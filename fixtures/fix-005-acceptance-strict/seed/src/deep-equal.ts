export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;

  const seen = new WeakMap<object, object>();
  return valuesEqual(a, b, seen);
}

function valuesEqual(a: unknown, b: unknown, seen: WeakMap<object, object>): boolean {
  if (a === b) return true;
  if (Number.isNaN(a) && Number.isNaN(b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;

  const aObj = a as object;
  const bObj = b as object;

  if (seen.has(aObj)) return seen.get(aObj) === bObj;
  seen.set(aObj, bObj);

  if (aObj instanceof Date && bObj instanceof Date) {
    return aObj.getTime() === bObj.getTime();
  }

  if (Array.isArray(aObj) !== Array.isArray(bObj)) return false;

  if (Array.isArray(aObj)) {
    if (aObj.length !== (bObj as unknown[]).length) return false;
    for (let i = 0; i < aObj.length; i++) {
      if (!valuesEqual(aObj[i], (bObj as unknown[])[i], seen)) return false;
    }
    return true;
  }

  const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);
  for (const key of allKeys) {
    const aHasKey = key in aObj;
    const bHasKey = key in bObj;
    if (aHasKey !== bHasKey) {
      const val = aHasKey ? aObj[key as keyof typeof aObj] : bObj[key as keyof typeof bObj];
      if (val !== undefined) return false;
      continue;
    }
    const aVal = aObj[key as keyof typeof aObj];
    const bVal = bObj[key as keyof typeof bObj];
    if (!valuesEqual(aVal, bVal, seen)) return false;
  }
  return true;
}
