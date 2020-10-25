# **taskworld-api-rate-limiter**

### Assumptions
* Based on the given diagram, this rate limiter is to be deployed **separately** - that is, it won't be a part of the existing API server(s)

  * Will need to proxy incoming requests to actual API servers
  * Drawback: increased latency since this service will add another layer between clients and servers

### Strategy
* For scalability, these services need to be stateless. However, they still need to know the current request count of each `X-USER-ID` over a given time window. Therefore, I will use Redis to manage the state due to its in-memory (ie. fast read and write) nature.

* Runner-up algorithms

  * Leaky Bucket

    * Drawback: Since it's usually implemented with a queue, a burst of requests will take forever to process through. It's also inefficient to scale (ie. each user will need his/her own queue, so that'd consume a lot of storage).

  * Fixed Window Counter

    * Drawback: A burst of requests near the ending/beginning of the window can nuke the endpoint easily, since the limit resets itself at those boundaries. For example, at 50 requests per minute per user, there could be 50 requests at 07:00:59 and another 50 requests at 07:01:00 for a total of 100 requests over two seconds.

  * Sliding Log
  
    * Drawback: Logging multiple users' request timestamp will take up a lot of memory really fast. Computing a specific user's current request rates is already an expensive operation, but it's even more so in a distributed environment (ie. might need to get log from different datastore)

* Chosen algorithm: **Sliding Window Counter**
  
  * Rationale: This is a compromise between Fixed Window Counter and Sliding Log algorithms. The window starts from the API call with timestamp >= 60 seconds ago, up until the current timestamp, so it will keep "sliding" forward in time as newer requests come in. The limiter will check the sum of all counters for each timestamp within this window, and will reject any new request until the time window has elapsed.
 

### TODOs
* Set up proxy for passing valid requests down to actual API servers. Use `express-http-proxy`.
* Update test cases for rate limiter to actually talk to the proxy endpoint
* Containerize this project

### Setup

#### Dependencies
* Docker runtime
* Node.js (this project uses `nvm` to set the environment to be 12.18.3. You can download the script from [here](https://github.com/nvm-sh/nvm))

#### Instruction

1. Clone this project
2. Tell `nvm` to use this version of Node.js runtime (in case you have some other version of Node.js installed globally on your machine)
```sh
$ nvm use
```
3. Create your own `.env` (you may use all `process.env.*` values in `src/config` for your guideline)
4. Set up Redis container and store its endpoint inside `.env`

    * `REDIS_HOST` depends on how your docker's network bridge is configured
    * `REDIS_PORT` is default port 6379
    * `REDIS_PASS` is `taskworld`
```sh
$ docker image pull redis:latest
$ docker run --publish 6379:6379 --detach --name api-limiter-datastore redis:latest --appendonly yes --requirepass "taskworld"
```
5. `npm i` to install the project's dependent modules
6. `npm test` to run test cases
