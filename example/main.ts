import { Database } from "../mod.ts";
import aws from "../collections/aws/mod.ts";
import gcp from "../collections/gcp/mod.ts";

class MyDb extends Database {
  // Register collections
  aws = aws();
  gcp = gcp(this.aws);

  // Register custom queries (ie: views)
  foobar = (name: string) =>
    this.aws.ssm.parameters({ Name: name }).join(
      this.gcp.ssm.parameters(),
      (_) => _.Name,
      (_) => _.Type,
      (a, b) => ({
        Name: a.Name,
        Value: a.Value,
        Type: b.Type,
      }),
    );
}

class DatabaseClient<T1> {
  query<T3>(q: (q: T1) => T3): T3;
  query<T2, T3>(q: (q: T1, ctx: T2) => T3, ctx: T2): T3;
  query<T2, T3>(q: (q: T1, ctx: T2) => T3, ctx?: T2): T3 {
    // send that off to the server, server creates ts file, esecutes it in a
    // deno sandbox, returns results, no dealing with ast's, parsers, lexers,
    // expression trees, or any of that stuff.
    console.log(JSON.stringify([q, ctx]));

    // So long as each iterator only yields POJSOs and not anything fancier,
    // like ES6 classes, we shouldn't need to do anything but return the results.
    return "results from server" as unknown as T3;
  }
}

// https://github.com/mandarineorg/leaf

const FOO = "adfghsdafhg";

const qs = new DatabaseClient<MyDb>().query(
  (q, ctx) => q.aws.ssm.parameters({ Name: ctx.Name }).first(),
  { Name: FOO },
);

console.log(qs);

console.log("TEST1");

const db = new MyDb();

console.log("TEST2");

// query against the database directly.
// Use it just like you would any other embedded database ala. SqLite.
console.log(
  db.aws.ssm.parameters({ Name: "" }).skip(3).where((_) => _.Value === "abc123")
    .join(
      db.gcp.ssm.parameters(),
      (_) => _.Name,
      (_) => _.Type,
      (a, b) => ({
        Name: a.Name,
        Value: a.Value,
        Type: b.Type,
      }),
    ).select((_) => ({ "afdsg": _.Name })),
);

/*
{
  $from: {
    "aws.ssm.parameters": {
      $skip: 3,
      $where: {
        name: {$like:"foobar"}
      },
      $join: {
        "gcp.ssm.parameters": {
          $where: {
            name: {$like:"foobar"}
          },
          $on: {"name":{$eq:"name"}},
          $select: ['*'],
          $into: "gcpParams"
        }
      },
      $select: ['*'],
      $take: 100,
    }
  }
}
*/

/*
      aws {
        ssm {
          parameters({filters: {Name: ""}, query: []}) {
            Value
          }
        }
      }
*/

// https://github.com/typestack/class-transformer
// https://github.com/shaochuancs/esserializer
// https://stackoverflow.com/questions/40201589/serializing-an-es6-class-object-as-json/40201783
// https://github.com/GameBridgeAI/ts_serialize
// https://github.com/Tnifey/class-transformer
// http://esm.sh/
// https://groq.dev/
// https://netflix.github.io/falcor/
// http://restql.b2w.io/
// https://askql.org/
// https://rapidql.com/

//
// J
// Client sends a TypeScript string which essentially represents the query.
// The server it's self could be written in rust.
// The rust server accepts the query and generates a TypeScript file with all
// the correct context that the query needs that it then executes in a deno sandbox.
// Deno can be embeded in rust https://deno.land/manual@v1.0.0/embedding_deno
// Deno could consume iterators written in rust via wasm.
// Rust natively supports the concept of an iterator unlike go https://doc.rust-lang.org/std/iter/index.html
// So mapping a rust iterator to a javascript one shouldn't be too hard

console.log("TEST3");

// Or generate a client
// The client has virtually the same API as the server but builds a JSON object
// that represents a query which can then be passed to the servers query method.
//const dbClient = db.generateClient();
//db.query(
//  dbClient.aws.ssm.parameters({ Name: "" }).join(
//    dbClient.gcp.ssm.parameters(),
//    (_) => _.Name,
//    (_) => _.Type,
//    (a, b) => ({
//      Name: a.Name,
//      Value: a.Value,
//      Type: b.Type,
//    }),
//  ),
//);
