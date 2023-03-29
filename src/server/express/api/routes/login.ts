import { Operation } from "@dylanbulmer/openapi/types/Route";
import { R200 } from "@dylanbulmer/openapi/classes/responses";
import { Error, Response, User } from "@codrjs/models";
import UserService from "@/utils/axios/UserService";
import { generateToken } from "@/utils/jwt";

export const POST: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  async (req, res) => {
    // get email
    const { email } = req.body;

    // get user from user service
    UserService.get(`internal/user?email=${email}`)
      .then(res => new User(res.data.details.user))
      .then(user => {
        // generate token
        const jwt = generateToken(user);

        // create session from session service

        // send login email

        // return with status and sessionId

        res
          .status(200)
          .json(
            new Response<{ jwt: string }>({ message: "OK", details: { jwt } })
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
