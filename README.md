# iteratordb

A query only, lazy database server designed for interesting data analytics
and answering business intelligence questions. Think graphql but for your
data sources instead of your APIs.

Also inspired by: <https://steampipe.io/>

## Why this and not steampipe?

**TLDR:** I got frustrated & figured I could build something better
          + I'm in COVID lockdown...

Basically it's just too new, at first I thought it was amazing but as the
complexities of the questions that I wanted to answer mounted I continued
to find short comings in the _steampipe_ tooling.

## Why this and not graphql?

I had the idea of sticking a graphql API over the top of the postgres databases
of _steampipe_. Querying the data with a graph query language totally made sense
to me at the time.

But as I got started on this project, I quickly realised that I needed to define
the graph ahead of time, which wasn't always possible. Many times it was only
after having explored the data that I would see connections.

And I guess this is why _steampipe_ just used SQL, as the querier is in control
of making those connection with various JOINs.

The other reason graphql doesn't fit very nicely for this job is because it's
only half a query language, it contains no ability to filter results unless you
explicitly define those filters in your graphql schema, again ahead of time.

_Yeah I guess you could code generate those filters but that felt like a hack._

I quickly learnt that graphql is indeed not a query language but an alternative
to building a traditional REST API.

## How does this work then?

- We start with a rust server offering both traditional HTTP & GRPC endpoints.

- The server is made up of a collection of iterators that can call out and
  retrieve data from any data source.

- The iterators would offer to cache their results for a period of time and
  also handle things like rate limiting and retries.

- The server has a `/mod.ts` endpoint that returns generated TypeScript which
  can be consumed by Deno.
  
  - Deno can consume authenticated endpoints through `Bearer` token authentication.

- This TypeScript makes use of <https://github.com/luvies/lazy> to provide a
  _"Linq"_ based API over the rust iterators.

- The Deno client constructs a full type safe query, which simply gets serialized
  to a string (eg: `Function.prototype.toString()`) and sent to the rust server.

- The rust server then injects the query string _(which is just TypeScript code)_,
  into a generated TypeScript module that provides the appropriate context for
  the query to execute successfully.

- The rust server would use [embedded deno](https://deno.land/manual/embedding_deno)
  to then execute the query in a secure sandbox & return the results to the client.

- We would also allow iterators to be written in TypeScript to reduce the
  burden of programming in rust.

- The iteratordb project it's self would not provide any actual iterators.
  They would be provided via rust crates (or Deno modules) and essentially the
  server administrator would programmatically add those crates/modules to their
  server project before complication and final deployment.

- Iterators could consume other iterators to provide a _"view"_ like construct
  & ultimately make any connections that we can ahead of time, while still leaving
  ultimate power in the queriers hands.

- Of course the rust server does not care if the query is written manually or by
  other tooling. It just has to be a valid TypeScript string. In effect TypeScript
  is our query language.

- Thus other fully typed clients (eg: a go module) could be generated
  & consumed in a similar manner as well.