const seen = new WeakMap<object, object>();

function eq(x: unknown, y: unknown): boolean {
  if (x === y) return true;

  if (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y)) return true;

  if (typeof x !== typeof y) return false;

  if (x === null || y === null) return x === y;

  if (typeof x !== 'object' || typeof y !== 'object') return false;

  if (seen.has(x as object)) {
    return seen.get(x as object) === (y as object);
  }
  seen.set(x as object, y as object);

  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime();
  }

  if (x instanceof Date !== y instanceof Date) return false;

  const isArrX = Array.isArray(x);
  const isArrY = Array.isArray(y);
  if (isArrX !== isArrY) return false;

  if (isArrX && isArrY) {
    const arrX = x as unknown[];
    const arrY = y as unknown[];
    if (arrX.length !== arrY.length) return false;
    for (let i = 0; i < arrX.length; i++) {
      if (!eq(arrX[i], arrY[i])) return false;
    }
    return true;
  }

  const recordX = x as Record<string, unknown>;
  const recordY = y as Record<string, unknown>;

  const keysX = Object.keys(recordX).filter(k => recordX[k] !== undefined);
  const keysY = Object.keys(recordY).filter(k => recordY[k] !== undefined);

  if (keysX.length !== keysY.length) return false;

  for (const key of keysX) {
    if (!Object.prototype.hasOwnProperty.call(recordY, key)) return false;
    if (!eq(recordX[key], recordY[key])) return false;
  }

  return true;
}

export function deepEqual(a: unknown, b: unknown): boolean {
  return eq(a, b);
}
