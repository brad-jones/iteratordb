import { IAws } from "../aws/mod.ts";
import { GcpSsmParameters } from "./ssm/parameters.ts";

export default (conn: IAws) => ({
  ssm: {
    parameters: new GcpSsmParameters(conn).queryable,
  },
});
