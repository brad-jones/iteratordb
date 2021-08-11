import { SSM } from "https://deno.land/x/aws_sdk@v3.17.0-2/client-ssm/mod.ts";
import { AwsSsmParameters } from "./ssm/parameters.ts";

export type IAws = ReturnType<typeof Aws>;

const Aws = (conn?: {}) => ({
  ssm: {
    parameters: new AwsSsmParameters(new SSM({})).queryable,
  },
});

export default Aws;
