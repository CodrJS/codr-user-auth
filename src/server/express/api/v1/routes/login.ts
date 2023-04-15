import { Operation } from "@dylanbulmer/openapi/types/Route";
import { R200 } from "@dylanbulmer/openapi/classes/responses";
import {
  Error,
  ISession,
  IUser,
  Response,
  Session,
  User,
} from "@codrjs/models";
import UserService from "@/utils/axios/UserService";
import { generateToken } from "@/utils/jwt";
import SessionService from "@/utils/axios/SessionService";

export const POST: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  async (req, res) => {
    // get email
    const { email } = req.body;

    Promise.resolve()
      // get user from user service
      .then(() => {
        const user = UserService.get<Response<{ user: IUser }>>(
          `internal/user?email=${email}`
        ).then(res => new User(res.data.details.user));
        return user;
      })
      // generate authentication token
      .then(user => {
        const jwt = generateToken(user);
        return { user, jwt };
      })
      // create session from session service
      .then(async ({ user, jwt }) => {
        const ip = (
          <string>req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress ||
          "UNKNOWN"
        )
          .split(",")[0]
          .trim();

        const session = await SessionService.post<
          Response<{ session: ISession }>
        >(
          "session",
          {},
          {
            headers: {
              "User-Agent": req.headers["user-agent"],
              "x-forwarded-for": ip,
              Authorization: `Bearer ${jwt}`,
            },
          }
        ).then(res => new Session(res.data.details.session));

        return { user, jwt, session };
      })
      // send login email
      .then(({ user, jwt, session }) => {
        /**
         * @TODO Tech debt: Publish to kafka login event stream stream. Notification domain should pick this up and send out the email.
         */
        return { user, jwt, session };
      })
      .then(({ user, jwt, session }) => {
        // return with status and sessionId
        res.status(200).json(
          new Response<{ jwt: string; sessionId: string }>({
            message: "OK",
            details: { jwt, sessionId: session._id as unknown as string },
          })
        );
      })
      .catch(e => {
        const status = e?.status || 500;
        res.status(status).json(
          new Error({
            status,
            message: "An unknown error occurred.",
            details: e,
          })
        );
      });
  };

// 3.0 specification
POST.apiDoc = {
  description: "Log into Codr.",
  tags: ["Authentication"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              examples: ["system@codrjs.com"],
            },
          },
        },
      },
    },
  },
  responses: {
    "200": {
      description: R200.description,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/HealthSchema",
          },
        },
      },
    },
  },
};
