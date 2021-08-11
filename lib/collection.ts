import { Lazy } from "https://deno.land/x/lazy@v1.7.2/lib/mod.ts";

export interface Collection<T1, T2> {
  queryable(filters?: T2): Lazy<T1>;
  hydrator(filters?: T2): Generator<T1>;
}
