// ───────────────────────────────────────────────────────────────────
// MODULE: History Vocabulary Drift
// ───────────────────────────────────────────────────────────────────
// The canonical runtime-to-locator-kind map lives in the hook state module.
// The shared session readers are plain ESM and cannot import that TypeScript
// source, so the capability table restates the kinds. This suite fails when a
// restated copy drifts from the canonical map.

import { describe, expect, it } from 'vitest';

import { capabilities } from '../../../../hooks/shared/session-readers/index.mjs';
import {
  HISTORY_LOCATOR_KINDS,
  type HistoryLocatorRuntime,
} from '../hooks/claude/hook-state.js';
import { SESSION_REF_RUNTIME_LOCATOR_KINDS } from '../lib/continuity/thin-continuity-record.js';

const HOOK_RUNTIMES = Object.keys(HISTORY_LOCATOR_KINDS) as HistoryLocatorRuntime[];

// Every remaining copy: plain ESM modules cannot import the TypeScript source,
// so each restates the kinds and must be checked against the authority.
const VOCABULARY_COPIES = [
  {
    name: 'session-reader capabilities',
    kindFor: (runtime: HistoryLocatorRuntime) => capabilities[runtime]?.locatorKind,
  },
  {
    name: 'continuity session_ref kinds',
    kindFor: (runtime: HistoryLocatorRuntime) => SESSION_REF_RUNTIME_LOCATOR_KINDS[runtime],
  },
];

describe('history locator vocabulary', () => {
  it('keeps every copy on the canonical runtime-to-kind map', () => {
    for (const copy of VOCABULARY_COPIES) {
      const kinds = Object.fromEntries(
        HOOK_RUNTIMES.map((runtime) => [runtime, copy.kindFor(runtime)]),
      );
      expect({ copy: copy.name, kinds }).toEqual({ copy: copy.name, kinds: HISTORY_LOCATOR_KINDS });
    }
  });
});
