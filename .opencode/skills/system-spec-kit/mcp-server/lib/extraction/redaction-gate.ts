// ───────────────────────────────────────────────────────────────
// MODULE: Redaction Gate
// ───────────────────────────────────────────────────────────────
// Feature catalog: Guards and edge cases
interface RedactionMatch {
  value: string;
  category: string;
}

interface RedactionResult {
  redactedText: string;
  redactionApplied: boolean;
  matches: RedactionMatch[];
}

interface RedactionPattern {
  category: string;
  expression: RegExp;
}

interface InjectionMarkerMatch {
  value: string;
  category: string;
}

interface InjectionMarkerDetectionResult {
  cleanedText: string;
  markerDetected: boolean;
  matches: InjectionMarkerMatch[];
  removedRatio: number;
  residueRejected: boolean;
}

interface InjectionMarkerPattern {
  category: string;
  expression: RegExp;
}

const GIT_SHA_40 = /^[0-9a-f]{40}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const GENERIC_HIGH_ENTROPY_MIN_LENGTH = 40;
const INJECTION_MARKER_RESIDUE_REJECT_THRESHOLD = 0.5;
const INJECTION_MARKER_QUALITY_FLAG = 'prompt_injection_marker_detected';
const INJECTION_MARKER_RESIDUE_REJECTED_FLAG = 'prompt_injection_marker_residue_rejected';

const PATTERNS: RedactionPattern[] = [
  { category: 'api_key', expression: /\bsk-[A-Za-z0-9_-]{20,}\b/g },
  { category: 'bearer_token', expression: /\bBearer\s+[A-Za-z0-9._\-]{20,}\b/gi },
  { category: 'aws_access_key', expression: /\bAKIA[0-9A-Z]{16}\b/g },
  { category: 'private_key', expression: /-----BEGIN(?: RSA)? PRIVATE KEY-----[\s\S]*?-----END(?: RSA)? PRIVATE KEY-----/g },
  { category: 'email', expression: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi },
  { category: 'jwt', expression: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g },
  { category: 'generic_high_entropy', expression: /\b[A-Za-z0-9+/_=-]{40,}\b/g },
];

const INJECTION_MARKER_PATTERNS: InjectionMarkerPattern[] = [
  {
    category: 'ignore_previous_instructions',
    expression: /\b(?:ignore|disregard|forget)\s+(?:all\s+)?(?:previous|prior|above|earlier)\s+(?:instructions|prompts|messages|context)\b/gi,
  },
  {
    category: 'override_system_prompt',
    expression: /\boverride\s+(?:the\s+)?(?:system|developer|assistant)\s+(?:prompt|message|instructions?)\b/gi,
  },
  {
    category: 'role_reassignment',
    expression: /\byou\s+are\s+now\s+(?:the\s+)?(?:system|developer|administrator|root|chatgpt)\b/gi,
  },
  {
    category: 'role_header_instruction',
    expression: /\b(?:system|developer|assistant)\s*:\s*(?:ignore|override|disregard|execute)\b/gi,
  },
  {
    category: 'wrapper_breakout',
    expression: /<\/\s*recalled-memory-context\s*>/gi,
  },
];

function shouldSkipMatch(value: string, category: string): boolean {
  if (category !== 'generic_high_entropy') {
    return false;
  }

  if (value.length < GENERIC_HIGH_ENTROPY_MIN_LENGTH) {
    return true;
  }

  if (GIT_SHA_40.test(value)) {
    return true;
  }

  if (UUID_PATTERN.test(value)) {
    return true;
  }

  return false;
}

function redactWithPattern(inputText: string, pattern: RedactionPattern, matches: RedactionMatch[]): string {
  return inputText.replace(pattern.expression, (value: string) => {
    if (shouldSkipMatch(value, pattern.category)) {
      return value;
    }

    matches.push({ value, category: pattern.category });
    return '[REDACTED]';
  });
}

function applyRedactionGate(inputText: string): RedactionResult {
  if (typeof inputText !== 'string' || inputText.length === 0) {
    return { redactedText: '', redactionApplied: false, matches: [] };
  }

  const matches: RedactionMatch[] = [];
  let redactedText = inputText;
  for (const pattern of PATTERNS) {
    redactedText = redactWithPattern(redactedText, pattern, matches);
  }

  return {
    redactedText,
    redactionApplied: matches.length > 0,
    matches,
  };
}

function removeInjectionMarkers(inputText: string, matches: InjectionMarkerMatch[]): string {
  let cleanedText = inputText;
  for (const pattern of INJECTION_MARKER_PATTERNS) {
    cleanedText = cleanedText.replace(pattern.expression, (value: string) => {
      matches.push({ value, category: pattern.category });
      return '';
    });
  }
  return cleanedText;
}

function removedTextRatio(original: string, cleaned: string): number {
  if (original.length === 0) {
    return 0;
  }
  return Math.max(0, original.length - cleaned.length) / original.length;
}

function detectInjectionMarkers(inputText: string): InjectionMarkerDetectionResult {
  if (typeof inputText !== 'string' || inputText.length === 0) {
    return {
      cleanedText: '',
      markerDetected: false,
      matches: [],
      removedRatio: 0,
      residueRejected: false,
    };
  }

  const matches: InjectionMarkerMatch[] = [];
  const cleanedText = removeInjectionMarkers(inputText, matches);
  const removedRatio = removedTextRatio(inputText, cleanedText);
  return {
    cleanedText,
    markerDetected: matches.length > 0,
    matches,
    removedRatio,
    residueRejected: matches.length > 0 && removedRatio > INJECTION_MARKER_RESIDUE_REJECT_THRESHOLD,
  };
}

export {
  applyRedactionGate,
  detectInjectionMarkers,
  GENERIC_HIGH_ENTROPY_MIN_LENGTH,
  INJECTION_MARKER_QUALITY_FLAG,
  INJECTION_MARKER_RESIDUE_REJECTED_FLAG,
  INJECTION_MARKER_RESIDUE_REJECT_THRESHOLD,
};

/**
 * Re-exports related public types.
 */
export type {
  RedactionResult,
  RedactionMatch,
  InjectionMarkerDetectionResult,
  InjectionMarkerMatch,
};
