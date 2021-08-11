import { Collection } from "../../../mod.ts";
import { Lazy } from "https://deno.land/x/lazy@v1.7.2/lib/mod.ts";
import { IAws } from "../../aws/mod.ts";

export interface GcpSsmParameter {
  Name: string;
  Value: string;
  Type: string;
}

export interface GcpSsmParameterFilters {
  Name?: string;
}

export class GcpSsmParameters
  implements Collection<GcpSsmParameter, GcpSsmParameterFilters> {
  constructor(
    private conn: IAws,
  ) {
    this.queryable = this.queryable.bind(this);
    this.hydrator = this.hydrator.bind(this);
  }

  queryable(filters?: GcpSsmParameterFilters): Lazy<GcpSsmParameter> {
    return Lazy.from(this.hydrator(filters));
  }

  *hydrator(filters?: GcpSsmParameterFilters): Generator<GcpSsmParameter> {
    yield {
      Name: "",
      Value: "",
      Type: "",
    };
  }
}
