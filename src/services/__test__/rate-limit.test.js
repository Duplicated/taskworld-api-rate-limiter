import 'dotenv/config';
import httpMocks from 'node-mocks-http';
import { rateLimit } from '../middleware';
import redis from '../redis';

const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});

afterAll(async (done) => {
  // restore old env
  process.env = OLD_ENV;
  await redis.flushall();
  redis.disconnect();
  done();
});

describe('Test spamming rate limiter', () => {
  describe('Group 1: Exceeding limit, will return 429 status', () => {
    it('Case 1: Set limit to 10, sending 60 reqs total', async () => {
      process.env.REQUEST_LIMIT = '10';
      const arrayOfResponses = [];
      for (let i = 0; i < 60; i++) {
        const mockRequest = httpMocks.createRequest({
          method: 'POST',
          headers: {
            'x-user-id': '14289731',
          },
        });
        const mockResponse = httpMocks.createResponse();
        const next = jest.fn();
        const resultResponse = await rateLimit(mockRequest, mockResponse, next);
        arrayOfResponses.push(resultResponse);
      }
      expect(arrayOfResponses).toContainEqual(
        expect.objectContaining({ statusCode: 429 })
      );
    });
    it('Case 2: Set limit to 20, sending 50 reqs total', async () => {
      process.env.REQUEST_LIMIT = '20';
      const arrayOfResponses = [];
      for (let i = 0; i < 50; i++) {
        const mockRequest = httpMocks.createRequest({
          method: 'POST',
          headers: {
            'x-user-id': '643723487',
          },
        });
        const mockResponse = httpMocks.createResponse();
        const next = jest.fn();
        const resultResponse = await rateLimit(mockRequest, mockResponse, next);
        arrayOfResponses.push(resultResponse);
      }
      expect(arrayOfResponses).toContainEqual(
        expect.objectContaining({ statusCode: 429 })
      );
    });
  });
  describe('Group 2: Not exceeding limit, all responses will return 200 status from mock proxy endpoint', () => {
    it('Case 3: Set limit to 60, sending 30 reqs total', async () => {
      process.env.REQUEST_LIMIT = '60';
      const arrayOfResponses = [];
      for (let i = 0; i < 30; i++) {
        const mockRequest = httpMocks.createRequest({
          method: 'POST',
          headers: {
            'x-user-id': '9993621',
          },
        });
        const mockResponse = httpMocks.createResponse();
        const next = jest.fn();
        const resultResponse = await rateLimit(mockRequest, mockResponse, next);
        arrayOfResponses.push(resultResponse);
      }
      expect(arrayOfResponses).toContainEqual(
        expect.not.objectContaining({ statusCode: 429 })
      );
    });
  });
});
