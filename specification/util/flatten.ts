/** Flatten an object or array of strings into a single array of strings. */
export function Flatten(objectWithStringKeys: object | string[]): string[] {
  return Object.values(objectWithStringKeys).flatMap(value => {
    if (typeof value === 'object') {
      return Flatten(value);
    }
    return value;
  });
}
