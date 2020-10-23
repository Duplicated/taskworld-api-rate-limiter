# **taskworld-api-rate-limiter**

### Assumptions
* Based on the given diagram, this rate limiter is to be deployed **separately** - that is, it won't be a part of the existing API server(s)

  * Will need to proxy incoming requests to actual API servers
  * Drawback: increased latency since this service will add another layer between clients and servers

### Strategy
* For scalability, these services need to be stateless. However, they still need to know the current request count of each `X-USER-ID` over a given time window. Therefore, I will use Redis to manage the state due to its in-memory (ie. fast read and write) nature.

* Algorithm to use: TBD

### TODOs
* Set up Redis connection (run a local container for this)
* Set up test suite with Jest, once the algorithm has been decided on