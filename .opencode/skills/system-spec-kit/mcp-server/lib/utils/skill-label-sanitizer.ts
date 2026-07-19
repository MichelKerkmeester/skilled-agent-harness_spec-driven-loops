// ───────────────────────────────────────────────────────────────
// MODULE: Skill Label Sanitizer Utility
// ───────────────────────────────────────────────────────────────
// Spec-kit keeps this prompt-safety helper local so shared payload validation
// does not import advisor renderer internals.

import { canonicalFold } from '@spec-kit/shared/unicode-normalization';

const INSTRUCTION_LABEL_PATTERN =
  /^\s*(SYSTEM|INSTRUCTION|IGNORE|EXECUTE)\s*[:=]|^\s*(<!--|```)|\b(ignore\s+(previous|all)\s+instructions|system\s*:|instruction\s*:|execute\s*:|developer\s*:|assistant\s*:)/i;
const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function sanitizeSkillLabel(skillLabel: string | null | undefined): string | null {
  if (typeof skillLabel !== 'string') {
    return null;
  }
  const folded = canonicalFold(skillLabel);
  if (/[\n\r]/.test(folded)) {
    return null;
  }
  const singleLine = folded
    .replace(CONTROL_CHAR_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!singleLine || INSTRUCTION_LABEL_PATTERN.test(singleLine)) {
    return null;
  }
  return singleLine;
}
