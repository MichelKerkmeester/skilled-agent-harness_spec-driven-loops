import assert from "node:assert/strict";

const ASYMMETRIC = Symbol("supercov.test.asymmetric");

interface AsymmetricMatcher {
  [ASYMMETRIC](actual: unknown): boolean;
}

function isAsymmetric(value: unknown): value is AsymmetricMatcher {
  return Boolean(
    value &&
      typeof value === "object" &&
      ASYMMETRIC in (value as Record<PropertyKey, unknown>),
  );
}

function equal(actual: unknown, expected: unknown): boolean {
  if (isAsymmetric(expected)) return expected[ASYMMETRIC](actual);
  if (Object.is(actual, expected)) return true;
  if (Array.isArray(actual) && Array.isArray(expected))
    return actual.length === expected.length &&
      expected.every((value, index) => equal(actual[index], value));
  if (
    actual &&
    expected &&
    typeof actual === "object" &&
    typeof expected === "object" &&
    Object.getPrototypeOf(actual) === Object.getPrototypeOf(expected)
  ) {
    const actualRecord = actual as Record<string, unknown>;
    const expectedRecord = expected as Record<string, unknown>;
    const actualKeys = Reflect.ownKeys(actualRecord);
    const expectedKeys = Reflect.ownKeys(expectedRecord);
    return actualKeys.length === expectedKeys.length &&
      expectedKeys.every(
        (key) => Reflect.has(actualRecord, key) && equal(actualRecord[key as string], expectedRecord[key as string]),
      );
  }
  try {
    assert.deepStrictEqual(actual, expected);
    return true;
  } catch {
    return false;
  }
}

function matchObject(actual: unknown, expected: unknown): boolean {
  if (isAsymmetric(expected)) return expected[ASYMMETRIC](actual);
  if (Object.is(actual, expected)) return true;
  if (Array.isArray(expected))
    return Array.isArray(actual) &&
      actual.length === expected.length &&
      expected.every((value, index) => matchObject(actual[index], value));
  if (expected && typeof expected === "object") {
    if (!actual || typeof actual !== "object") return false;
    const actualRecord = actual as Record<string, unknown>;
    return Reflect.ownKeys(expected).every(
      (key) => Reflect.has(actualRecord, key) &&
        matchObject(actualRecord[key as string], (expected as Record<string, unknown>)[key as string]),
    );
  }
  return equal(actual, expected);
}

function thrownBy(actual: unknown): unknown {
  assert.equal(typeof actual, "function", "expected a function");
  try {
    (actual as () => unknown)();
  } catch (error) {
    return error;
  }
  return undefined;
}

function matchesThrown(error: unknown, expected?: unknown): boolean {
  if (error === undefined) return false;
  if (expected === undefined) return true;
  if (typeof expected === "string")
    return error instanceof Error && error.message.includes(expected);
  if (expected instanceof RegExp)
    return expected.test(error instanceof Error ? error.message : String(error));
  if (typeof expected === "function") return error instanceof expected;
  return equal(error, expected);
}

interface Matchers {
  readonly not: Matchers;
  readonly resolves: Matchers;
  toBe(expected: unknown): void | Promise<void>;
  toBeDefined(): void | Promise<void>;
  toBeGreaterThan(expected: number): void | Promise<void>;
  toBeLessThan(expected: number): void | Promise<void>;
  toBeUndefined(): void | Promise<void>;
  toContain(expected: unknown): void | Promise<void>;
  toContainEqual(expected: unknown): void | Promise<void>;
  toEqual(expected: unknown): void | Promise<void>;
  toHaveLength(expected: number): void | Promise<void>;
  toMatch(expected: string | RegExp): void | Promise<void>;
  toMatchObject(expected: unknown): void | Promise<void>;
  toStrictEqual(expected: unknown): void | Promise<void>;
  toThrow(expected?: unknown): void | Promise<void>;
}

function createMatchers(actual: unknown, negate = false, asynchronous = false): Matchers {
  const verify = (condition: boolean, message: string): void => {
    assert.equal(negate ? !condition : condition, true, `${negate ? "not " : ""}${message}`);
  };
  const run = (matcher: (value: unknown) => void): void | Promise<void> =>
    asynchronous ? Promise.resolve(actual).then(matcher) : matcher(actual);
  const matchers = {
    get not() {
      return createMatchers(actual, !negate, asynchronous);
    },
    get resolves() {
      return createMatchers(actual, negate, true);
    },
    toBe: (expected: unknown) => run((value) => verify(Object.is(value, expected), "to be identical")),
    toBeDefined: () => run((value) => verify(value !== undefined, "to be defined")),
    toBeGreaterThan: (expected: number) => run((value) => verify(typeof value === "number" && value > expected, `to be greater than ${expected}`)),
    toBeLessThan: (expected: number) => run((value) => verify(typeof value === "number" && value < expected, `to be less than ${expected}`)),
    toBeUndefined: () => run((value) => verify(value === undefined, "to be undefined")),
    toContain: (expected: unknown) => run((value) => verify(
      typeof value === "string"
        ? value.includes(String(expected))
        : Array.isArray(value) && value.includes(expected),
      `to contain ${String(expected)}`,
    )),
    toContainEqual: (expected: unknown) => run((value) => verify(
      Array.isArray(value) && value.some((entry) => equal(entry, expected)),
      "to contain an equal value",
    )),
    toEqual: (expected: unknown) => run((value) => verify(equal(value, expected), "to equal expected value")),
    toHaveLength: (expected: number) => run((value) => verify(
      Boolean(value && typeof (value as { length?: unknown }).length === "number" && (value as { length: number }).length === expected),
      `to have length ${expected}`,
    )),
    toMatch: (expected: string | RegExp) => run((value) => verify(
      typeof value === "string" && (typeof expected === "string" ? value.includes(expected) : expected.test(value)),
      `to match ${String(expected)}`,
    )),
    toMatchObject: (expected: unknown) => run((value) => verify(matchObject(value, expected), "to match object")),
    toStrictEqual: (expected: unknown) => run((value) => verify(equal(value, expected), "to strictly equal expected value")),
    toThrow: (expected?: unknown) => run((value) => verify(matchesThrown(thrownBy(value), expected), "to throw expected error")),
  } satisfies Matchers;
  return matchers;
}

interface Expect {
  (actual: unknown, message?: string): Matchers;
  any(constructor: Function): AsymmetricMatcher;
  arrayContaining(expected: unknown[]): AsymmetricMatcher;
  objectContaining(expected: Record<string, unknown>): AsymmetricMatcher;
  stringContaining(expected: string): AsymmetricMatcher;
  stringMatching(expected: string | RegExp): AsymmetricMatcher;
}

export const expect = Object.assign(
  (actual: unknown) => createMatchers(actual),
  {
    any: (constructor: Function): AsymmetricMatcher => ({
      [ASYMMETRIC](actual: unknown): boolean {
        if (constructor === String) return typeof actual === "string" || actual instanceof String;
        if (constructor === Number) return typeof actual === "number" || actual instanceof Number;
        if (constructor === Boolean) return typeof actual === "boolean" || actual instanceof Boolean;
        return actual instanceof constructor;
      },
    }),
    arrayContaining: (expected: unknown[]): AsymmetricMatcher => ({
      [ASYMMETRIC](actual: unknown): boolean {
        return Array.isArray(actual) &&
          expected.every((wanted) => actual.some((entry) => equal(entry, wanted)));
      },
    }),
    objectContaining: (expected: Record<string, unknown>): AsymmetricMatcher => ({
      [ASYMMETRIC](actual: unknown): boolean {
        return matchObject(actual, expected);
      },
    }),
    stringContaining: (expected: string): AsymmetricMatcher => ({
      [ASYMMETRIC](actual: unknown): boolean {
        return typeof actual === "string" && actual.includes(expected);
      },
    }),
    stringMatching: (expected: string | RegExp): AsymmetricMatcher => ({
      [ASYMMETRIC](actual: unknown): boolean {
        return typeof actual === "string" &&
          (typeof expected === "string" ? actual.includes(expected) : expected.test(actual));
      },
    }),
  },
) as Expect;
