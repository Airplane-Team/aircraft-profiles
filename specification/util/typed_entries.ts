/** Returns a typed array of entries for a record/object using provided type information.
 * @remark if your index type is number, you will still get string keys in the result.
 */
export function TypedEntries<T extends { [s: string]: unknown }>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as any;
}
