import type { en } from "./en";

type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? ReadonlyArray<DeepStringify<U>>
    : T extends object
      ? { [K in keyof T]: DeepStringify<T[K]> }
      : never;

export type TranslationDict = DeepStringify<typeof en>;
