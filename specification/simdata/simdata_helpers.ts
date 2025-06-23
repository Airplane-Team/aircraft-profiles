import { TypedEntries } from '../util/typed_entries.js';
import { DataDescriptor, ValueType, ValueTypes } from './data_descriptor.js';

/** Guard on `value`, true when its declared `type` is `Boolean` aka `boolean`. */
export function ValueIsBoolean(value: ValueTypes, type: ValueType): value is boolean {
  return type === ValueType.Boolean;
}

/** Guard on `value`, true when its declared `type` is `Number` aka `number`. */
export function ValueIsNumber(value: ValueTypes, type: ValueType): value is number {
  return type === ValueType.Number;
}

/** Guard on `value`, true when its declared `type` is `String` aka `string`. */
export function ValueIsString(value: ValueTypes, type: ValueType): value is string {
  return type === ValueType.String;
}

/** Guard on `value`, true when its declared `type` is `BooleanMap` aka `Record<string, boolean>`. */
export function ValueIsBooleanMap(
  value: ValueTypes,
  type: ValueType
): value is Record<string, boolean> {
  return type === ValueType.BooleanMap;
}

/** Guard on `value`, true when its declared `type` is `NumberMap` aka `Record<string, number>`. */
export function ValueIsNumberMap(
  value: ValueTypes,
  type: ValueType
): value is Record<string, number> {
  return type === ValueType.NumberMap;
}

/** Guard on `value`, true when its declared `type` is `StringMap` aka `Record<string, string>`. */
export function ValueIsStringMap(
  value: ValueTypes,
  type: ValueType
): value is Record<string, string> {
  return type === ValueType.StringMap;
}

/**
 * Clamps a number based on the range defined in the descriptor.
 *
 * @param value The number to clamp. If the value is null-ish, the original value is returned.
 * @param descriptor The DataDescriptor containing the range.
 *                    If the descriptor has no range, the original value is returned.
 * @returns The clamped value.
 */
export function Clamp(
  value: number | undefined | null,
  descriptor: DataDescriptor | undefined
): number | undefined | null {
  if (value == null) return value;
  if (!descriptor?.range) {
    return value;
  }
  const [min, max] = descriptor.range;
  return Math.min(Math.max(value, min), max);
}

/**
 * Clamps a number map based on the range defined in the data descriptor.
 *
 * @param descriptor The DataDescriptor defining the type and range.
 *                    If the descriptor has no range, the original value is returned.
 * @param data A record mapping strings to numbers. If the data is not a record, the
 *             original value is returned. If a map entry is not a number, it is skipped.
 * @returns The clamped number map.
 */
export function ClampMap(
  descriptor: DataDescriptor | undefined,
  data: Record<string, number> | undefined | null
): Record<string, number> | undefined | null {
  if (!data) return data;
  if (!descriptor?.range) {
    return data;
  }

  const clampedMap: Record<string, number> = {};
  for (const [key, value] of TypedEntries(data)) {
    const clamped = Clamp(value, descriptor);
    if (clamped == null) continue;
    clampedMap[key] = clamped;
  }
  return clampedMap;
}
