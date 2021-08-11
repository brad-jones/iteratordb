import { Collection } from "../../../mod.ts";
import { Lazy } from "https://deno.land/x/lazy@v1.7.2/lib/mod.ts";
import { SSM } from "https://deno.land/x/aws_sdk@v3.17.0-2/client-ssm/mod.ts";

export interface AwsSsmParameter {
  Name: string;
  Value: string;
}

export interface AwsSsmParameterFilters {
  Name?: string;
}

export class AwsSsmParameters
  implements Collection<AwsSsmParameter, AwsSsmParameterFilters> {
  constructor(private conn: SSM = new SSM({})) {
    this.queryable = this.queryable.bind(this);
    this.hydrator = this.hydrator.bind(this);
  }

  queryable(filters?: AwsSsmParameterFilters): Lazy<AwsSsmParameter> {
    return Lazy.from(this.hydrator(filters));
  }

  *hydrator(filters?: AwsSsmParameterFilters): Generator<AwsSsmParameter> {
    yield {
      Name: "",
      Value: "",
    };
  }
}
