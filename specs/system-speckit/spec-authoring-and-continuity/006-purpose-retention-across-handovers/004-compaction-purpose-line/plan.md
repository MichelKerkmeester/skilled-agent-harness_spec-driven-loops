---
title: "Implementation Plan: Phase 4: compaction-purpose-line"
description: "Add one helper that reads a packet's purpose sentence, then lead the post-compaction context with it in the shared session-prime hook and the Pi compaction handler. Every edit below is a literal search and replace, dry-run in a copy of the runtime."
trigger_phrases:
  - "compaction purpose line plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: compaction-purpose-line

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ES modules), Node 26, built with `tsc --build` |
| **Framework** | Runtime hook adapters of `system-spec-kit` |
| **Storage** | None. The helper reads `spec.md` and `goal.md`, and the hooks read the existing hook state file |
| **Testing** | Vitest 4 through `runtime/vitest.config.ts` |

### Overview
A new module `runtime/lib/spec/packet-purpose.ts` reads the first sentence of a packet's `### Purpose`, falls back to the nearest enclosing phase parent and then to the `goal.md` Objective, and returns null on anything else. `session-prime.ts` puts that sentence first in its compact output, which covers Claude, Codex, Cursor and DSH, and the Pi compaction handler adds the same section. The proof is a measurement script that prints `purpose_heading=0` today and `purpose_heading=1` after the build, plus seven new tests.

All runtime paths in this plan are under `.skilled/skills/system-spec-kit/runtime/`. Every edit was applied to a scratch copy of the runtime first: each search text matched exactly once, the copy built, typechecked and linted clean and the five test files passed 71 of 71.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The baseline Vitest run below prints `Tests  64 passed (64)` and the measurement prints `purpose_heading=0 purpose_text=0`
- [ ] `rg -n 'packet-purpose' .skilled/skills/system-spec-kit/runtime --glob '!**/dist/**'` prints nothing, so no other change added the module first
- [ ] Each search text in section 3 matches once: `rg -c -F` on its first line prints 1 in its file

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The five-file Vitest run prints `Test Files  5 passed (5)` and `Tests  71 passed (71)`, the build and the typecheck exit 0 and the measurement prints `purpose_heading=1 purpose_text=1`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
One shared reader. The helper owns the purpose rule. Two surfaces call it and render one line.

### Key Components
- **`lib/spec/packet-purpose.ts`**: owns the purpose rule. It sits beside `is-phase-parent.ts`, whose `isPhaseParent` it reuses for the parent walk. TypeScript hooks import it from source (`../../lib/spec/packet-purpose.js`), Pi and any `.mjs` or `.cjs` hook load the built `dist/lib/spec/packet-purpose.js` the way they already load `dist/hooks/claude/hook-state.js`, `runtime/lib/continuity/thin-continuity-record.ts` can import `../spec/packet-purpose.js` and code under `runtime/cli` reaches it through `@spec-kit/runtime/api` once a re-export is added there.
- **`hooks/claude/session-prime.ts`**: the one function that builds the post-compaction context for four runtimes. `.claude/settings.json`, the Codex and Cursor `session-start` adapters and `hooks/dsh/session-start-context.mjs` all run `dist/hooks/claude/session-prime.js`.
- **`hooks/pi/session-compact-context.ts`**: Pi's own `session_compact` handler, loaded from source through `.pi/extensions/session-compact-context.ts`. The runtime build excludes `hooks/pi/**`.

### Data Flow
The Stop hook writes `lastSpecFolder` into hook state. On `SessionStart` with `source: 'compact'`, `runSessionStartHook` reads that state, resolves the folder against the working directory, asks `resolvePacketPurpose` for the sentence and puts a `## Packet Purpose` section before the sections `handleCompact` returns. `formatBudgetedHookOutput` then cuts from the end, so the purpose survives any cut that leaves the first section. Pi reads the same state file, builds the same section and passes it to `fitRecoverySections`, which shortens only the summary.

### Per-runtime answer

| Runtime | Builds the post-compaction context | Budget | Knows the spec folder | Runs from | This phase |
|---------|------------------------------------|--------|-----------------------|-----------|------------|
| Claude | `runSessionStartHook` (`source: 'compact'`) in `hooks/claude/session-prime.ts`, from the brief `hooks/claude/compact-inject.ts` cached | `COMPACTION_TOKEN_BUDGET` 4000 tokens, cut to as little as 200 by `calculatePressureAdjustedBudget` | Yes, `state.lastSpecFolder` | `dist/hooks/claude/session-prime.js` | Covered |
| Codex | Same function. `hooks/codex/session-start.ts` runs `session-prime.js` | Same | Yes | `dist` | Covered |
| Cursor | Same function. `hooks/cursor/session-start.ts` runs `session-prime.js` | Same | Yes | `dist` | Covered |
| DSH | `registerSessionCompactContext` in `hooks/dsh/session-compact-context.mjs` calls `runSessionPrime({ source: 'compact' })` | Same | Yes, through session-prime | `.mjs` source that spawns the `dist` session-prime | Covered |
| Pi | The `session_compact` handler in `hooks/pi/session-compact-context.ts` | `MAX_CONTEXT_BYTES` 4096 bytes, summary shortened first | Yes, `readLastSpecFolder` | Source `.ts` | Covered |
| Devin | `composeRecoverySections` in `hooks/devin/post-compaction.cjs` | 4096 bytes | Yes | Source `.cjs` | Left out: Devin 3000.12 does not pass `PostCompaction` output to the model |
| OpenCode | `experimental.chat.system.transform` in `.opencode/plugins/session-history-lookup.js` | The one lookup section | No | Source `.js` plugin | Left out: no spec folder at that point |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup runs the baseline tests and the measurement script and confirms each search text matches once. Implementation creates `lib/spec/packet-purpose.ts` and its test, edits `hooks/claude/session-prime.ts` and `hooks/pi/session-compact-context.ts`, adds the hook tests and updates five READMEs, one change per step as listed below. Verification builds the runtime, reruns the same tests, the typecheck, the lint and the measurement, and checks `git status --short`. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Step 1. Create `lib/spec/packet-purpose.ts`

New file, full content:

```ts
// ───────────────────────────────────────────────────────────────────
// MODULE: Packet Purpose
// ───────────────────────────────────────────────────────────────────
// Reads why a spec packet exists from its own documents, so a surface that
// rebuilds context after a compaction or a hop can repeat the purpose and not
// only the files and the next step. Every read fails soft: a missing or
// unreadable document yields null, never an exception.

import * as fs from 'node:fs';
import * as path from 'node:path';

import { isPhaseParent } from './is-phase-parent.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Where the purpose text came from: the packet, an enclosing phase parent or the packet's goal.md Objective. */
export type PacketPurposeSource = 'packet' | 'ancestor' | 'goal';

/** One resolved purpose sentence and the folder it was read from. */
export interface PacketPurpose {
  /** The first sentence of the purpose, whitespace-collapsed and length-capped. */
  text: string;
  /** Which document supplied the text. */
  source: PacketPurposeSource;
  /** Absolute path of the folder whose spec.md or goal.md held the text. */
  folder: string;
}

// The phase-parent scaffold has written this sentence, in two wordings, in
// place of a purpose. It describes the document layout, not the work, so it
// never counts as one.
const SCAFFOLD_PARENT_PURPOSE = /^Keep parent documentation lean while child phases own detailed plans\b/;
// One sentence has to fit even a pressure-shrunk recovery budget.
const MAX_PURPOSE_CHARS = 300;
const MAX_ANCESTOR_DEPTH = 8;

// ───────────────────────────────────────────────────────────────────
// 2. TEXT EXTRACTION
// ───────────────────────────────────────────────────────────────────

function readTextFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/** The first paragraph under the `### Purpose` heading, skipping comment lines. */
function extractPurposeParagraph(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((line) => /^###\s+Purpose\s*$/.test(line.trim()));
  if (start < 0) return '';
  const body: string[] = [];
  for (const raw of lines.slice(start + 1)) {
    const line = raw.trim();
    if (line.startsWith('#') || line.startsWith('<!-- /ANCHOR') || line.startsWith('>')) break;
    if (line.startsWith('<!--')) continue;
    if (line === '') {
      if (body.length > 0) break;
      continue;
    }
    body.push(line);
  }
  return body.join(' ');
}

function extractGoalObjective(markdown: string): string {
  return markdown.match(/^\*\*Objective:\*\*\s*(.+)$/m)?.[1] ?? '';
}

/**
 * The first sentence of authored text, or null for a template token, a
 * bracketed prompt, UNKNOWN or the scaffold's layout sentence.
 */
function authoredSentence(raw: string): string | null {
  const text = raw.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ').trim();
  if (!text || SCAFFOLD_PARENT_PURPOSE.test(text)) return null;
  if (text.includes('[YOUR_VALUE_HERE') || /^\[[^\]]*\]$/.test(text) || /^unknown\.?$/i.test(text)) return null;
  const sentence = text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
  return sentence.length <= MAX_PURPOSE_CHARS
    ? sentence
    : `${sentence.slice(0, MAX_PURPOSE_CHARS - 3).trimEnd()}...`;
}

function purposeIn(folder: string): string | null {
  const markdown = readTextFile(path.join(folder, 'spec.md'));
  return markdown === null ? null : authoredSentence(extractPurposeParagraph(markdown));
}

// ───────────────────────────────────────────────────────────────────
// 3. RESOLUTION
// ───────────────────────────────────────────────────────────────────

/**
 * Resolve the one-sentence purpose of a spec packet.
 *
 * Reads the packet's own `### Purpose` first. When that is empty or a
 * placeholder, walks up through enclosing phase parents that carry a spec.md
 * and takes the nearest authored purpose. When neither exists, takes the
 * packet's goal.md Objective. Returns null when nothing authored exists or a
 * read fails.
 *
 * @param specFolderAbsPath - Absolute path to the spec packet folder
 * @returns The purpose sentence with its source and folder, or null
 */
export function resolvePacketPurpose(specFolderAbsPath: string): PacketPurpose | null {
  try {
    const folder = path.resolve(specFolderAbsPath);
    const own = purposeIn(folder);
    if (own) return { text: own, source: 'packet', folder };

    let current = folder;
    for (let depth = 0; depth < MAX_ANCESTOR_DEPTH; depth += 1) {
      const parent = path.dirname(current);
      if (parent === current) break;
      if (!fs.existsSync(path.join(parent, 'spec.md')) || !isPhaseParent(parent)) break;
      const inherited = purposeIn(parent);
      if (inherited) return { text: inherited, source: 'ancestor', folder: parent };
      current = parent;
    }

    const goal = readTextFile(path.join(folder, 'goal.md'));
    const objective = goal === null ? null : authoredSentence(extractGoalObjective(goal));
    return objective ? { text: objective, source: 'goal', folder } : null;
  } catch {
    return null;
  }
}

/** Render a resolved purpose as one line, naming the parent folder when the text is inherited. */
export function formatPacketPurpose(purpose: PacketPurpose, projectRoot: string): string {
  if (purpose.source === 'ancestor') {
    const parentFolder = path.relative(projectRoot, purpose.folder).split(path.sep).join('/');
    return `Parent purpose (${parentFolder}): ${purpose.text}`;
  }
  if (purpose.source === 'goal') return `Goal objective: ${purpose.text}`;
  return `Purpose: ${purpose.text}`;
}
```

### Step 2. Create `tests/packet-purpose.vitest.ts`

New file, full content:

```ts
// ───────────────────────────────────────────────────────────────────
// MODULE: Packet Purpose
// ───────────────────────────────────────────────────────────────────
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { resolvePacketPurpose } from '../lib/spec/packet-purpose.js';

const ROOT = mkdtempSync(join(tmpdir(), 'packet-purpose-'));
afterAll(() => rmSync(ROOT, { recursive: true, force: true }));

function packet(relativeFolder: string, purpose: string, objective?: string): string {
  const folder = join(ROOT, relativeFolder);
  mkdirSync(folder, { recursive: true });
  writeFileSync(
    join(folder, 'spec.md'),
    `# Spec\n\n### Problem Statement\nA problem.\n\n### Purpose\n${purpose}\n<!-- /ANCHOR:problem -->\n`,
  );
  if (objective) writeFileSync(join(folder, 'goal.md'), `# Goal\n\n**Objective:** ${objective}\n`);
  return folder;
}

const parent = packet('specs/demo/001-parent', 'Keep the parent outcome in view. This second sentence is dropped.');
const child = packet('specs/demo/001-parent/002-child', '[One-paragraph purpose, what this phase achieves]');
const scaffolded = packet(
  'specs/demo/003-scaffolded',
  'Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.',
  'Ship the scaffolded packet goal.',
);

describe('resolvePacketPurpose', () => {
  it('returns the first sentence of the packet purpose', () => {
    expect(resolvePacketPurpose(parent)).toEqual({
      text: 'Keep the parent outcome in view.',
      source: 'packet',
      folder: parent,
    });
  });

  it('uses the nearest phase parent purpose when the child purpose is a placeholder', () => {
    expect(resolvePacketPurpose(child)).toEqual({
      text: 'Keep the parent outcome in view.',
      source: 'ancestor',
      folder: parent,
    });
  });

  it('skips the scaffold layout sentence and falls back to the goal objective', () => {
    expect(resolvePacketPurpose(scaffolded)).toEqual({
      text: 'Ship the scaffolded packet goal.',
      source: 'goal',
      folder: scaffolded,
    });
  });

  it('returns null for a folder that does not exist', () => {
    expect(resolvePacketPurpose(join(ROOT, 'specs/demo/404-missing'))).toBeNull();
  });
});
```

### Step 3. `hooks/claude/session-prime.ts`: import `resolve`

Current text:

```ts
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
```

Replacement:

```ts
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
```

### Step 4. `hooks/claude/session-prime.ts`: import the helper

Current text:

```ts
import { isMainModule } from '../../lib/esm-entry.js';
```

Replacement:

```ts
import { isMainModule } from '../../lib/esm-entry.js';
import { formatPacketPurpose, resolvePacketPurpose } from '../../lib/spec/packet-purpose.js';
```

### Step 5. `hooks/claude/session-prime.ts`: add `buildPacketPurposeSection`

Current text:

```ts
function readCompactPrimeIdentity(sessionId: string): { cachedAt: string; opaqueId?: string | null } | null {
```

Replacement:

```ts
/**
 * The last active packet's purpose, as the section that leads a compaction
 * recovery. It goes first because the budget cut drops trailing sections, and
 * why the work exists outlasts the transcript detail after it. A missing or
 * unreadable packet yields no section, never a failed recovery.
 */
export function buildPacketPurposeSection(
  lastSpecFolder: string | null | undefined,
  projectRoot: string = process.cwd(),
): OutputSection | null {
  if (!lastSpecFolder) return null;
  const purpose = resolvePacketPurpose(resolve(projectRoot, lastSpecFolder));
  if (!purpose) return null;
  return { title: 'Packet Purpose', content: formatPacketPurpose(purpose, projectRoot) };
}

function readCompactPrimeIdentity(sessionId: string): { cachedAt: string; opaqueId?: string | null } | null {
```

### Step 6. `hooks/claude/session-prime.ts`: lead the compact sections with the purpose

Current text:

```ts
    case 'compact':
      compactIdentity = readCompactPrimeIdentity(sessionId);
      sections = await handleCompact(sessionId);
      budget = COMPACTION_TOKEN_BUDGET;
      break;
```

Replacement:

```ts
    case 'compact': {
      compactIdentity = readCompactPrimeIdentity(sessionId);
      const stateResult = loadState(sessionId);
      const purposeSection = buildPacketPurposeSection(stateResult.ok ? stateResult.state.lastSpecFolder : null);
      sections = await handleCompact(sessionId);
      if (purposeSection) sections.unshift(purposeSection);
      budget = COMPACTION_TOKEN_BUDGET;
      break;
    }
```

The section is added here and not inside `handleCompact` so it leads all three of that function's return paths: a fresh cache, a stale or quarantined cache and no cache at all. DSH reaches the no-cache path because it has no PreCompact event.

### Step 7. `tests/hook-session-start.vitest.ts`: two compact tests

Current text:

```ts
      expect(parsed.pendingCompactPrime).toBeNull();
    });

  });
```

Replacement:

```ts
      expect(parsed.pendingCompactPrime).toBeNull();
    });

    it('leads the compact recovery with the packet purpose', async () => {
      const packetDir = mkdtempSync(join(tmpdir(), 'session-prime-purpose-'));
      writeFileSync(join(packetDir, 'spec.md'), '### Purpose\nKeep the reason for the work in view. This sentence is dropped.\n');
      try {
        const now = new Date().toISOString();
        saveState(testSessionId, {
          claudeSessionId: testSessionId,
          speckitSessionId: null,
          lastSpecFolder: packetDir,
          sessionSummary: null,
          pendingCompactPrime: null,
          producerMetadata: null,
          metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
          createdAt: now,
          updatedAt: now,
        });

        let output = '';
        await runSessionStartHook(
          { source: 'compact', session_id: testSessionId },
          async (text) => { output = text; },
        );

        expect(output.startsWith('## Packet Purpose\nPurpose: Keep the reason for the work in view.\n')).toBe(true);
        expect(output).not.toContain('This sentence is dropped');
        expect(output).toContain('/speckit:resume');
      } finally {
        rmSync(packetDir, { recursive: true, force: true });
      }
    });

    it('adds no purpose section when the last spec folder has no spec.md', async () => {
      const emptyDir = mkdtempSync(join(tmpdir(), 'session-prime-no-spec-'));
      try {
        const now = new Date().toISOString();
        saveState(testSessionId, {
          claudeSessionId: testSessionId,
          speckitSessionId: null,
          lastSpecFolder: emptyDir,
          sessionSummary: null,
          pendingCompactPrime: null,
          producerMetadata: null,
          metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
          createdAt: now,
          updatedAt: now,
        });

        let output = '';
        await runSessionStartHook(
          { source: 'compact', session_id: testSessionId },
          async (text) => { output = text; },
        );

        expect(output).not.toContain('## Packet Purpose');
        expect(output.startsWith('## Context Recovery\n')).toBe(true);
      } finally {
        rmSync(emptyDir, { recursive: true, force: true });
      }
    });
  });
```

### Step 8. `hooks/pi/session-compact-context.ts`: import `resolve`

Current text:

```ts
import { join } from "node:path";
```

Replacement:

```ts
import { join, resolve } from "node:path";
```

### Step 9. `hooks/pi/session-compact-context.ts`: add `readPacketPurposeSection`

Current text:

```ts
function stripControlCharacters(text: string): string {
```

Replacement:

```ts
/**
 * The packet's purpose as a recovery section, read through the built helper
 * the Claude adapter uses. A missing build or an unreadable packet yields
 * null, so the purpose can be lost but the compaction recovery cannot.
 */
async function readPacketPurposeSection(cwd: string, specFolder: string): Promise<string | null> {
  try {
    type PacketPurpose = { text: string; source: "packet" | "ancestor" | "goal"; folder: string };
    const { formatPacketPurpose, resolvePacketPurpose } = await import(
      "../../dist/lib/spec/packet-purpose.js"
    ) as {
      resolvePacketPurpose: (specFolderAbsPath: string) => PacketPurpose | null;
      formatPacketPurpose: (purpose: PacketPurpose, projectRoot: string) => string;
    };
    const purpose = resolvePacketPurpose(resolve(cwd, specFolder));
    return purpose ? `## Packet Purpose\n${formatPacketPurpose(purpose, cwd)}` : null;
  } catch {
    return null;
  }
}

function stripControlCharacters(text: string): string {
```

Pi loads the built copy because `hooks/pi/**` is outside the runtime build and the same file already imports `../../dist/hooks/claude/hook-state.js` this way in `persistLocator`.

### Step 10. `hooks/pi/session-compact-context.ts`: add the section to the message

Current text:

```ts
        const specFolder = readLastSpecFolder(ctx.cwd, sessionId);
        if (specFolder) sections.push(`## Active Spec Folder\n${specFolder}`);
```

Replacement:

```ts
        const specFolder = readLastSpecFolder(ctx.cwd, sessionId);
        if (specFolder) {
          const purpose = await readPacketPurposeSection(ctx.cwd, specFolder);
          if (purpose) sections.push(purpose);
          sections.push(`## Active Spec Folder\n${specFolder}`);
        }
```

### Step 11. `tests/history-locator-adapters.vitest.ts`: imports

Current text:

```ts
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
```

Replacement:

```ts
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
```

### Step 12. `tests/history-locator-adapters.vitest.ts`: Pi edge assertion and Pi purpose test

Current text:

```ts
    expect(messages[0].content).toContain('Pi summary');
    expect(messages[0].content).not.toContain('## History Lookup');
    expect(messages[0].content).toContain('/speckit:resume');
  });
```

Replacement:

```ts
    expect(messages[0].content).toContain('Pi summary');
    expect(messages[0].content).not.toContain('## History Lookup');
    expect(messages[0].content).not.toContain('## Packet Purpose');
    expect(messages[0].content).toContain('/speckit:resume');
  });

  it('names the packet purpose of the last active spec folder', async () => {
    const sessionId = uniqueSession('pi-purpose');
    const packetDir = mkdtempSync(join(tmpdir(), 'pi-purpose-'));
    writeFileSync(join(packetDir, 'spec.md'), '### Purpose\nKeep the reason for the work in view.\n');
    // Pi reads the state file keyed by the cwd it is handed, not by process.cwd().
    const stateDir = join(
      tmpdir(),
      'speckit-claude-hooks',
      createHash('sha256').update(WORKSPACE).digest('hex').slice(0, 12),
    );
    const statePath = join(stateDir, `${createHash('sha256').update(sessionId).digest('hex').slice(0, 16)}.json`);
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(statePath, JSON.stringify({ lastSpecFolder: packetDir }));
    try {
      const { pi, handlers, messages } = createPi();
      sessionCompactContext(pi as never);
      await handlers.get('session_compact')!(
        { compactionEntry: { summary: 'Pi summary' } },
        { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
      );

      expect(messages).toHaveLength(1);
      expect(messages[0].content).toContain('## Packet Purpose\nPurpose: Keep the reason for the work in view.');
      expect(messages[0].content).toContain(`## Active Spec Folder\n${packetDir}`);
    } finally {
      rmSync(statePath, { force: true });
      rmSync(packetDir, { recursive: true, force: true });
    }
  });
```

### Step 13. `lib/spec/README.md`: current-state line

Current text:

```markdown
- `is-phase-parent.ts` is the only implementation file in this folder.
```

Replacement:

```markdown
- `is-phase-parent.ts` holds the phase-parent rule. `packet-purpose.ts` reads a packet's one-sentence purpose and uses that rule to find the enclosing phase parent.
```

### Step 14. `lib/spec/README.md`: key-file row

Current text:

```markdown
| `is-phase-parent.ts` | `isPhaseParent()`, `listPhaseChildren()`, and `assessPhaseParentHealth()` against the warning (20) and error (40) child-count thresholds. |
```

Replacement:

```markdown
| `is-phase-parent.ts` | `isPhaseParent()`, `listPhaseChildren()`, and `assessPhaseParentHealth()` against the warning (20) and error (40) child-count thresholds. |
| `packet-purpose.ts` | `resolvePacketPurpose()` and `formatPacketPurpose()`: the first sentence of a packet's `### Purpose`, else the nearest enclosing phase parent's, else its `goal.md` Objective. |
```

### Step 15. `lib/spec/README.md`: entrypoint rows

Current text:

```markdown
| `PHASE_PARENT_WARNING_THRESHOLD`, `PHASE_PARENT_ERROR_THRESHOLD` | Constants | Child-count thresholds (20 and 40) behind the health advisory. |
```

Replacement:

```markdown
| `PHASE_PARENT_WARNING_THRESHOLD`, `PHASE_PARENT_ERROR_THRESHOLD` | Constants | Child-count thresholds (20 and 40) behind the health advisory. |
| `resolvePacketPurpose(specFolderAbsPath)` | Function | The packet's purpose sentence with its source (`packet`, `ancestor` or `goal`) and the folder it came from, or null. Never throws. |
| `formatPacketPurpose(purpose, projectRoot)` | Function | One line for a recovery brief that names the parent folder when the purpose is inherited. |
```

### Step 16. `lib/MODULE-MAP.md`: key file under `spec/`

Current text (copy the existing line as it is, including its dash character):

```markdown
  - `is-phase-parent.ts` — a folder is a phase parent when it has at least one `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` child and at least one such child carries `spec.md` or `description.json`.
```

Replacement:

```markdown
  - `is-phase-parent.ts` — a folder is a phase parent when it has at least one `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` child and at least one such child carries `spec.md` or `description.json`.
  - `packet-purpose.ts`: reads a packet's one-sentence purpose from its `spec.md`, the nearest enclosing phase parent or its `goal.md` Objective.
```

### Step 17. `lib/README.md`: key-file row

Current text:

```markdown
| `spec/is-phase-parent.ts` | Single-source-of-truth phase-parent detection: a numbered child that carries `spec.md` or `description.json`. |
```

Replacement:

```markdown
| `spec/is-phase-parent.ts` | Single-source-of-truth phase-parent detection: a numbered child that carries `spec.md` or `description.json`. |
| `spec/packet-purpose.ts` | Reads a packet's one-sentence purpose for the post-compaction context. |
```

### Step 18. `hooks/claude/README.md`: the session-prime row

Current text (the end of the `session-prime.ts` row):

```markdown
because a fork shares its parent's session id. |
```

Replacement:

```markdown
because a fork shares its parent's session id. On a compaction the output opens with a `## Packet Purpose` section that quotes the last active packet's purpose, when one is authored. |
```

### Step 19. `hooks/pi/README.md`: the session-compact-context row

Current text (the end of the `session-compact-context.ts` row):

```markdown
Every message ends with the `## Recovery` pointer that names `/speckit:resume`. |
```

Replacement:

```markdown
When the last active packet has an authored purpose, a `## Packet Purpose` section comes before `## Active Spec Folder`. Every message ends with the `## Recovery` pointer that names `/speckit:resume`. |
```
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run every command from the worktree root. `RT` is `.skilled/skills/system-spec-kit/runtime`. `M` is `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/004-compaction-purpose-line/scratch/measure-compact-brief.mjs`. `P` is `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers`.

Baseline, run on 2026-11-13 before any edit:

| Command | Observed |
|---------|----------|
| `(cd $RT && ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts runtime/tests/hook-precompact.vitest.ts runtime/tests/phase-parent-health.vitest.ts)` | `Test Files  4 passed (4)`, `Tests  64 passed (64)`: 21, 17, 17 and 9 tests |
| `(cd $RT && ../node_modules/.bin/tsc --noEmit --composite false -p tsconfig.json); echo $?` | no output, `0` |
| `(cd $RT && ../node_modules/.bin/eslint hooks/claude/session-prime.ts hooks/pi/session-compact-context.ts); echo $?` | no output, `0` |
| `node $M "$PWD/$RT" $P 2>/dev/null \| tail -1` | `--- exit=0 purpose_heading=0 purpose_text=0` |

After the edits, build first, because every covered runtime but Pi runs the built `session-prime.js` and Pi loads the built helper:

| Command | Expected, from the dry run in a scratch copy |
|---------|----------------------------------------------|
| `npm --prefix $RT run build; echo $?` | `0` and `$RT/dist/lib/spec/packet-purpose.js` exists |
| The baseline Vitest command with `runtime/tests/packet-purpose.vitest.ts` added first | `Test Files  5 passed (5)`, `Tests  71 passed (71)`: 4, 23, 18, 17 and 9 tests |
| The typecheck command | no output, `0` |
| `(cd $RT && ../node_modules/.bin/eslint lib/spec/packet-purpose.ts hooks/claude/session-prime.ts hooks/pi/session-compact-context.ts tests/packet-purpose.vitest.ts); echo $?` | no output, `0` |
| `node $M "$PWD/$RT" $P 2>/dev/null \| tail -1` | `--- exit=0 purpose_heading=1 purpose_text=1` |

`hook-precompact.vitest.ts` mints a history locator, which needs a git checkout. In the dry-run copy it failed one test until the copy was made a git repository, and it passed in the worktree. A failure of `persists the locator beside the compact cache in the same state write` outside a checkout is the environment, not this change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

Node, `tsc`, Vitest and ESLint as the runtime already uses them. No new package. The helper uses `node:fs`, `node:path` and the existing `isPhaseParent`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a compaction recovery prints a wrong or broken purpose line, or a covered hook exits non-zero. Revert the one commit that carries these eleven files and run `npm --prefix .skilled/skills/system-spec-kit/runtime run build` so the hooks load the old `dist`. Child 005 imports `resolvePacketPurpose`, so revert it first if it has landed.
<!-- /ANCHOR:rollback -->

---
