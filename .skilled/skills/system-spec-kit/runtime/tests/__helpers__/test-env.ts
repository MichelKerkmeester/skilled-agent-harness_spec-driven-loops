// ───────────────────────────────────────────────────────────────────
// MODULE: Test Env
// ───────────────────────────────────────────────────────────────────

export function setEnv(key: string, value: string | undefined): string | undefined {
  const prior = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
  return prior;
}

export function restoreEnv(key: string, prior: string | undefined): void {
  if (prior === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = prior;
  }
}

function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return (
    value !== null
    && typeof value === 'object'
    && typeof (value as Promise<T>).finally === 'function'
  );
}

export function withFeatureFlag<T>(
  key: string,
  value: string | undefined,
  fn: () => T | Promise<T>,
): T | Promise<T> {
  const prior = setEnv(key, value);
  try {
    const result = fn();
    if (isPromise(result)) {
      return result.finally(() => restoreEnv(key, prior));
    }
    restoreEnv(key, prior);
    return result;
  } catch (error) {
    restoreEnv(key, prior);
    throw error;
  }
}
