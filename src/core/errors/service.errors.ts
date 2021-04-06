export const SERVICE_ERRORS = {
  ENTITY: {
    NOT_FOUND: {
      response: {
        statusCode: 404,
      },
      message: 'ENTITY not found',
    },
    NOT_UPDATED: {
      response: {
        statusCode: 400,
      },
      message: 'ENTITY not updated',
    },
    ALREADY_EXIST: {
      response: {
        statusCode: 406,
      },
      message: 'ENTITY email already registered',
    },
  },
  USER: {
    NOT_FOUND: {
      response: {
        statusCode: 404,
      },
      message: 'User not found',
    },
    OLD_NOT_MATCHED: {
      response: {
        statusCode: 401,
      },
      message: 'Old password is not correct',
    },
    PASSWORDS_EQUALS: {
      response: {
        statusCode: 406,
      },
      message: 'You should choose new password',
    },
    NOT_UPDATED: {
      response: {
        statusCode: 400,
      },
      message: 'User not updated',
    },
    ALREADY_EXIST: {
      response: {
        statusCode: 406,
      },
      message: 'This email already registered',
    },
    WRONG_CREDENTIALS: {
      response: {
        statusCode: 401,
      },
      message: 'Wrong credentials',
    },
  },
};
