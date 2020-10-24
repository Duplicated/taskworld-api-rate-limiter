import httpMocks from "node-mocks-http";
import { invalidAuth } from "./middleware";

const reqOptions = {
  method: "POST",
  headers: {
    "user-agent": "PostmanRuntime/7.26.5",
    accept: "*/*",
    "postman-token": "61eef59d-edd2-4bc9-a79b-7ff825ff0538",
    host: "localhost:3000",
    "accept-encoding": "gzip, deflate, br",
    connection: "keep-alive",
    "content-length": "0",
  },
};

describe("Check if X-USER-ID header is included", () => {
  it("Case 1: X-USER-ID is included", () => {
    const mockRequest = httpMocks.createRequest({
      ...reqOptions,
      headers: {
        ...reqOptions.headers,
        "x-user-id": "123456789",
      },
    });
    const mockResponse = httpMocks.createResponse();
    const next = jest.fn();
    invalidAuth(mockRequest, mockResponse, next);
    expect(next).toHaveBeenCalled();
  });
  it("Case 2: X-USER-ID is missing", () => {
    const mockRequest = httpMocks.createRequest(reqOptions);
    const mockResponse = httpMocks.createResponse();
    const next = jest.fn();
    invalidAuth(mockRequest, mockResponse, next);
    expect(mockResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 401,
      })
    );
    expect(mockResponse._getData()).toEqual(
      expect.objectContaining({ successful: false, message: "Missing user id" })
    );
  });
});
