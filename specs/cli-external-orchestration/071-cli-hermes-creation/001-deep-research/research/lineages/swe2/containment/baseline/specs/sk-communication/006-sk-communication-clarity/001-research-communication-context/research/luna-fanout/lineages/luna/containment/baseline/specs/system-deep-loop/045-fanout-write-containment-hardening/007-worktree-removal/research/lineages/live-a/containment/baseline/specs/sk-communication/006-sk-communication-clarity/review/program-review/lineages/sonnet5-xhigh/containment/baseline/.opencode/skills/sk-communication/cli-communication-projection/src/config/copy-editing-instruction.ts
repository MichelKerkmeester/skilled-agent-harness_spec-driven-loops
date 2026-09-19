// ───────────────────────────────────────────────────────────────────
// MODULE: Copy-Editing Instruction Declaration
// ───────────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Reply voice standard kept in the wording-standard skill beside this package. */
const VOICE_STANDARD_URL = new URL(
  '../../../../sk-doc/sk-create-with-human-voice/references/hvr-rules.md',
  import.meta.url,
);

function readVoiceStandard(): string {
  try {
    return readFileSync(VOICE_STANDARD_URL, 'utf8');
  } catch {
    throw new Error(
      `Cannot read the wording standard's reply base at ${fileURLToPath(VOICE_STANDARD_URL)}. The standard has one home and this package carries no copy.`,
    );
  }
}

const INSTRUCTION_FRAMING =
  'Rewrite only the assistant message below in plain English, following the standard that follows. Output only the rewrite.';

let cachedInstruction: string | null = null;

/**
 * One instruction shared by every copy-editing profile. The standard is read the
 * first time a profile is built, never at import, so a consumer that only imports
 * the package never touches the filesystem and a runtime without the standard fails
 * exactly where a provider would otherwise run without it.
 */
export function resolveCopyEditingInstruction(): string {
  if (cachedInstruction === null) {
    cachedInstruction = [INSTRUCTION_FRAMING, '', readVoiceStandard()].join('\n');
  }
  return cachedInstruction;
}

/** Sampling temperature every copy-editing profile shares. */
export const COPY_EDITING_TEMPERATURE = 0.2;
