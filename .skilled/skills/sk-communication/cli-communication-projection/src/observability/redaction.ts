// ───────────────────────────────────────────────────────────────────
// MODULE: Redaction Canary Scanning
// ───────────────────────────────────────────────────────────────────

/** One synthetic value used to detect secret or personal-data leakage. */
export interface RedactionCanary {
  readonly id: string;
  readonly category: 'personal-data' | 'secret';
  readonly value: string;
}

/** Content-free location of one detected canary. */
export interface RedactionCanaryFinding {
  readonly path: string;
  readonly canaryId: string;
  readonly code: 'redaction-canary';
}

/** Synthetic values that must remain absent from observability outputs. */
export const REDACTION_CANARIES: readonly RedactionCanary[] = deepFreeze([
  {
    id: 'synthetic-api-secret',
    category: 'secret',
    value: 'sk-canary-telemetry-4d77a21f',
  },
  {
    id: 'synthetic-email',
    category: 'personal-data',
    value: 'alex.canary@example.invalid',
  },
  {
    id: 'synthetic-phone',
    category: 'personal-data',
    value: '+1-202-555-0147',
  },
  {
    id: 'synthetic-address',
    category: 'personal-data',
    value: '47 Canary Lane, Example City',
  },
]);

const BASE64_REDACTION_CANARIES = deepFreeze(REDACTION_CANARIES.map((canary) => ({
  canaryId: canary.id,
  value: Buffer.from(canary.value).toString('base64'),
})));

/** Scan nested aggregates, exports, traces, and error metadata without reflecting values. */
export function scanForRedactionCanaries(input: unknown): readonly RedactionCanaryFinding[] {
  const findings: RedactionCanaryFinding[] = [];
  const visited = new WeakSet<object>();
  scanValue(input, '$', findings, visited);
  return deepFreeze(findings);
}

/** Throw a content-free error when any redaction canary is present. */
export function assertNoRedactionCanaryLeak(input: unknown): void {
  if (scanForRedactionCanaries(input).length > 0) {
    throw new Error('Redaction canary detected in telemetry data.');
  }
}

function scanValue(
  value: unknown,
  path: string,
  findings: RedactionCanaryFinding[],
  visited: WeakSet<object>,
): void {
  if (typeof value === 'string') {
    scanString(value, path, findings);
    return;
  }
  if (value instanceof Uint8Array) {
    scanString(new TextDecoder().decode(value), path, findings);
    return;
  }
  if (value instanceof Uint16Array) {
    scanString(decodeUint16Array(value), path, findings);
    return;
  }
  if (value instanceof ArrayBuffer) {
    scanString(new TextDecoder().decode(new Uint8Array(value)), path, findings);
    return;
  }
  if (typeof value !== 'object' || value === null || visited.has(value)) {
    return;
  }
  visited.add(value);

  if (value instanceof Error) {
    scanString(value.message, `${path}.message`, findings);
    scanValue(value.cause, `${path}.cause`, findings, visited);
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => scanValue(entry, `${path}[${index}]`, findings, visited));
    return;
  }
  for (const [key, entry] of Object.entries(value)) {
    const childPath = appendPath(path, key);
    scanString(key, childPath, findings);
    scanValue(entry, childPath, findings, visited);
  }
}

function scanString(
  value: string,
  path: string,
  findings: RedactionCanaryFinding[],
): void {
  for (const canary of REDACTION_CANARIES) {
    const encodedCanary = BASE64_REDACTION_CANARIES.find(
      (encoded) => encoded.canaryId === canary.id,
    );
    if (value.includes(canary.value) || value.includes(encodedCanary?.value ?? '')) {
      findings.push({ path, canaryId: canary.id, code: 'redaction-canary' });
    }
  }
}

function decodeUint16Array(value: Uint16Array): string {
  return Array.from(value, (codeUnit) => String.fromCharCode(codeUnit)).join('');
}

function appendPath(path: string, key: string): string {
  const isSafe = /^[A-Za-z_$][A-Za-z0-9_$-]{0,63}$/.test(key)
    && !REDACTION_CANARIES.some((canary) => key.includes(canary.value));
  return isSafe ? `${path}.${key}` : `${path}.<redacted-key>`;
}

function deepFreeze<TValue>(value: TValue): TValue {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) {
    return value;
  }
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return Object.freeze(value);
}
