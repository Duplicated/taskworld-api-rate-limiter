import httpMocks from 'node-mocks-http';
import { notImplementedRoutes } from '../middleware';
import redis from '../redis';

describe('Test middleware to reject all non-POST methods', () => {
  it('Case 1: GET method', async () => {
    const mockRequest = httpMocks.createRequest({
      method: 'GET',
    });
    const mockResponse = httpMocks.createResponse();
    const resultResponse = await notImplementedRoutes(
      mockRequest,
      mockResponse
    );
    expect(resultResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 501,
      })
    );
  });
  it('Case 2: PUT method', async () => {
    const mockRequest = httpMocks.createRequest({
      method: 'PUT',
    });
    const mockResponse = httpMocks.createResponse();
    const resultResponse = await notImplementedRoutes(
      mockRequest,
      mockResponse
    );
    expect(resultResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 501,
      })
    );
  });
  it('Case 3: PATCH method', async () => {
    const mockRequest = httpMocks.createRequest({
      method: 'PATCH',
    });
    const mockResponse = httpMocks.createResponse();
    const resultResponse = await notImplementedRoutes(
      mockRequest,
      mockResponse
    );
    expect(resultResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 501,
      })
    );
  });
  it('Case 4: DELETE method', async () => {
    const mockRequest = httpMocks.createRequest({
      method: 'DELETE',
    });
    const mockResponse = httpMocks.createResponse();
    const resultResponse = await notImplementedRoutes(
      mockRequest,
      mockResponse
    );
    expect(resultResponse).toMatchObject(
      expect.objectContaining({
        statusCode: 501,
      })
    );
  });
  it('Case 5: POST method (this will get through)', async () => {
    const mockRequest = httpMocks.createRequest({
      method: 'POST',
    });
    const mockResponse = httpMocks.createResponse();
    const next = jest.fn();
    await notImplementedRoutes(mockRequest, mockResponse, next);
    expect(next).toHaveBeenCalled();
  });
});

afterAll(async (done) => {
  redis.disconnect();
  done();
});
