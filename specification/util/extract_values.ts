/** Utility type to recursively extract all values from the tree */
export type ExtractValues<T> = T extends object
  ? T[keyof T] extends infer V
    ? V extends object
      ? ExtractValues<V>
      : V
    : never
  : never;
