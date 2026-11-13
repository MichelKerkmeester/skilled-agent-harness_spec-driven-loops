---
title: "Implementation Plan: Phase 5: continuity-purpose-field"
description: "Add an optional packet_purpose field to the _memory.continuity record, have the save writer refresh it from the shared purpose helper on every continuity write, and lead the Goal facet with it. Every edit below is a literal search and replace, dry-run in a copy of the runtime with the sibling helper applied first."
trigger_phrases:
  - "continuity purpose field plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: continuity-purpose-field

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ES modules), Node 26, built with `tsc --build` in two packages: the runtime and the runtime `cli` |
| **Framework** | The `system-spec-kit` continuity record, its save writer and the authored continuity snapshot |
| **Storage** | The `_memory.continuity` frontmatter block of a leaf packet's `implementation-summary.md`, or a research record's `spec.md` |
| **Testing** | Vitest 4 through `runtime/vitest.config.ts` for the runtime and the root `vitest.config.ts` project `cli` for the save writer |

### Overview
The record contract in `lib/continuity/thin-continuity-record.ts` learns one optional string field, `packet_purpose`, and the Goal facet lists it before the next safe action. The save writer in `cli/core/workflow.ts` sets the field on every continuity write from the helper child 004 creates, reached through a new re-export in `api/index.ts`, and the opt-in snapshot carries the stored value when it rewrites the block. The proof is five new tests and a probe script that shows the reader drops a `packet_purpose` key today and keeps it after the build.

All runtime paths in this plan are under `.skilled/skills/system-spec-kit/runtime/`. Every edit was applied to a scratch copy of the runtime after child 004's `lib/spec/packet-purpose.ts` was copied in from its plan. Each search text matched exactly once, both packages built, typechecked and linted clean, the API boundary check passed and the focused tests passed 61 of 61 and 41 of 41.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Child 004 has shipped: `ls .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` prints the path and `rg -n 'export function (resolvePacketPurpose|formatPacketPurpose)' .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` prints 2 lines
- [ ] `rg -n 'packet_purpose' .skilled/skills/system-spec-kit/runtime --glob '!**/dist/**'` prints nothing, so no other change added the field first
- [ ] The baseline commands in section 5 print the numbers recorded there

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The focused runtime run prints `Test Files  3 passed (3)` and `Tests  61 passed (61)`, the save writer run prints `Tests  41 passed (41)`, both builds and both typechecks exit 0 and the probe prints `has_packet_purpose=true` and `kept_in_markdown=true`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Writer-owned derived copy. The packet's `spec.md` stays the source. The save writer copies one line into the record, and readers never write it.

### Key Components
- **`lib/continuity/thin-continuity-record.ts`**: the record type, its reader, validator, serializer, byte budget and facet builder. Without the change the reader builds the record from known keys only, so a `packet_purpose` key is dropped on read and lost on the next rewrite.
- **`cli/core/workflow.ts`**: `buildSaveContinuityMarkdown`, `planContinuityWrite` and `writePlannedContinuity` are the save writer. The help text in `cli/continuity/generate-context.ts` only describes it.
- **`api/index.ts`**: the one door from `runtime/cli` into the runtime. No file under `runtime/cli` imports `../../lib`, and `@spec-kit/runtime/api` resolves to `dist/api/index.js` through the package exports.
- **`lib/continuity/authored-continuity-snapshot.ts`**: the opt-in snapshot rebuilds the block field by field. Without the carry it would erase the stored purpose on every Claude compaction where the snapshot is enabled.

### Data Flow
A `--full-auto` save that carries continuity fields, or mints a `session_ref`, plans a continuity write. `resolveContinuityLeaf` picks the leaf, descending from a phase parent when the save names one. The writer calls `resolvePacketPurpose` on the canonical leaf path and formats the result against the canonical project root with `formatPacketPurpose`. The line goes into the upsert beside `packet_pointer`, `last_updated_at` and `last_updated_by`. It is never carried from the stored block, so a null result removes an old copy. The validator keeps the line when it is a non-empty string of at most 512 characters after whitespace collapse and drops it otherwise. The serializer writes it after `next_safe_action`, and the budget compaction drops it with `session_ref` before it trims the status lists. `buildContinuityFacets` puts it first in Goal.

### Reader and writer inventory

| Surface | File | Changes? | Why |
|---------|------|----------|-----|
| Record type, reader, validator, serializer, budget | `lib/continuity/thin-continuity-record.ts` | Yes | The record must know the key or every read and write drops it |
| Goal facet | `lib/continuity/thin-continuity-record.ts` `buildContinuityFacets` | Yes | Lists the purpose first and keeps the next safe action second. The facet limit is already 2 |
| Save writer | `cli/core/workflow.ts` | Yes | Sets the field from the helper on each continuity write |
| Payload normalizer | `cli/utils/input-normalizer.ts` | No | `extractContinuityFields` reads seven named fields, so a payload `packet_purpose` never reaches the patch. The unknown-field check already warns that it is ignored |
| Help text | `cli/continuity/generate-context.ts` | Yes, text | Says the field is writer-owned |
| Runtime API | `api/index.ts` | Yes | Re-exports `resolvePacketPurpose` and `formatPacketPurpose` for `runtime/cli` |
| Snapshot | `lib/continuity/authored-continuity-snapshot.ts` | Yes | Carries the stored value and passes it to the facets |
| Resume ladder | `lib/resume/resume-ladder.ts` | No | Its result feeds one non-test consumer, the snapshot, which reads only the restore counts. The snapshot gets the purpose from the record it already reads |
| Template | `templates/core/implementation-summary.md.tmpl` | No | The field is writer-owned and optional, like `session_ref`, which the template does not ship either |
| Spec-doc validator | `lib/validation/spec-doc-structure.ts`, `lib/validation/orchestrator.ts` | No | They read named keys and require five. No rule lists allowed keys |
| Continuity README | `lib/continuity/README.md` | Yes, text | Names the field |
| Record tests | `tests/thin-continuity-record.vitest.ts` | Yes | Adds two tests. The existing tests match with `toMatchObject` or on named keys, so none pins the field list |
| Save tests | `cli/tests/save-continuity-write.vitest.ts` | Yes | Adds two tests. Its fixture specs carry no `### Purpose`, so the existing 39 tests see no new field |
| Snapshot test | `tests/authored-continuity-snapshot.vitest.ts` | Create | No test covers the snapshot today |
| Resume ladder tests | `tests/resume-ladder.vitest.ts` | No | They assert restore counts and item text, and the ladder does not change |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and checks that ten archives become three. WEAK: See tasks. -->

Setup confirms child 004 has shipped, runs the baseline tests and the probe and confirms each search text below matches once. Implementation applies the 26 steps below in order, one change per step. Verification builds the runtime and then the cli, reruns the same tests plus the new ones, the typechecks, the lint, the API boundary check and the probe, and checks `git status --short`. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Steps 1, 14 and 18 need child 004's `lib/spec/packet-purpose.ts` to exist, and every test step needs it too. Steps 12 and 13 edit the same function: apply both before any typecheck, because step 12 alone declares `implementationSummaryPath` twice. The cli tests import `@spec-kit/runtime/api` from `dist`, so build the runtime before running them.

### Step 1. `api/index.ts`: Re-export the purpose helper for the save writer

Current text:

```ts
export type { ThinContinuityValidationError } from '../lib/continuity/thin-continuity-record.js';
```

Replacement:

```ts
export type { ThinContinuityValidationError } from '../lib/continuity/thin-continuity-record.js';

// The save writer copies a packet's purpose into the continuity block with the reader
// the compaction recovery uses, so both name the same purpose.
export { formatPacketPurpose, resolvePacketPurpose } from '../lib/spec/packet-purpose.js';
```

### Step 2. `lib/continuity/thin-continuity-record.ts`: Add the optional field to the record type

Current text:

```ts
  next_safe_action: string;
  blockers: string[];
```

Replacement:

```ts
  next_safe_action: string;
  /** The packet's purpose line, a copy the save writer refreshes from the packet's spec docs. */
  packet_purpose?: string;
  blockers: string[];
```

### Step 3. `lib/continuity/thin-continuity-record.ts`: Let raw facet input carry the purpose

Current text:

```ts
export interface ContinuityFacetInput {
  summary?: string | null;
```

Replacement:

```ts
export interface ContinuityFacetInput {
  summary?: string | null;
  packetPurpose?: string | null;
```

### Step 4. `lib/continuity/thin-continuity-record.ts`: Add the size limit

Current text:

```ts
const SESSION_REF_KEYS = ['runtime', 'sessionId', 'workspace', 'savedAt', 'locatorKind', 'version'] as const;
```

Replacement:

```ts
const SESSION_REF_KEYS = ['runtime', 'sessionId', 'workspace', 'savedAt', 'locatorKind', 'version'] as const;
// One sentence of at most 300 characters plus, when it is inherited, the label that
// names the parent folder it came from.
const PACKET_PURPOSE_MAX_CHARS = 512;
```

### Step 5. `lib/continuity/thin-continuity-record.ts`: Lead the Goal facet with the purpose

Current text:

```ts
  const answeredQuestions = record.answered_questions ?? record.answeredQuestions ?? [];

  return {
    goal: uniqueFacetItems([nextSafeAction], 2),
```

Replacement:

```ts
  const answeredQuestions = record.answered_questions ?? record.answeredQuestions ?? [];
  const packetPurpose = record.packet_purpose ?? record.packetPurpose ?? null;

  return {
    // Why the packet exists comes first, and the next step stays beside it.
    goal: uniqueFacetItems([packetPurpose, nextSafeAction], 2),
```

### Step 6. `lib/continuity/thin-continuity-record.ts`: Add the purpose normalizer

Current text:

```ts
function normalizeCompactList(
```

Replacement:

```ts
/**
 * The packet's purpose line. It is a copy the next save rewrites from the packet's
 * spec docs, so a value that is not one short line is dropped instead of failing the
 * record: a bad copy must never cost a save or a resume the rest of the block.
 */
function normalizePacketPurpose(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const normalized = normalizeWhitespace(value);
  return normalized.length > 0 && normalized.length <= PACKET_PURPOSE_MAX_CHARS ? normalized : undefined;
}

function normalizeCompactList(
```

### Step 7. `lib/continuity/thin-continuity-record.ts`: Serialize the purpose after next_safe_action

Current text:

```ts
    next_safe_action: record.next_safe_action,
  };

  if (!compactOptionalFields || record.blockers.length > 0) {
```

Replacement:

```ts
    next_safe_action: record.next_safe_action,
  };

  if (record.packet_purpose) {
    ordered.packet_purpose = record.packet_purpose;
  }
  if (!compactOptionalFields || record.blockers.length > 0) {
```

### Step 8. `lib/continuity/thin-continuity-record.ts`: Drop the purpose copy before the status fields when over budget

Current text:

```ts
  // The history pointer goes first: the next full-auto save can mint it again,
  // while the packet brief still needs its status fields to stay readable.
  const compacted: ThinContinuityRecord = {
    ...record,
    blockers: record.blockers.slice(-3),
    key_files: record.key_files.slice(-3),
  };
  delete compacted.session_ref;
```

Replacement:

```ts
  // The history pointer and the purpose copy go first: the next full-auto save can
  // mint or copy them again, while the packet brief still needs its status fields to
  // stay readable.
  const compacted: ThinContinuityRecord = {
    ...record,
    blockers: record.blockers.slice(-3),
    key_files: record.key_files.slice(-3),
  };
  delete compacted.session_ref;
  delete compacted.packet_purpose;
```

### Step 9. `lib/continuity/thin-continuity-record.ts`: Read the purpose in the validator

Current text:

```ts
  const nextSafeAction = normalizeCompactField(input.next_safe_action, 'next_safe_action', options, errors);
  const blockers = normalizeCompactList(input.blockers, 'blockers', errors);
```

Replacement:

```ts
  const nextSafeAction = normalizeCompactField(input.next_safe_action, 'next_safe_action', options, errors);
  const packetPurpose = normalizePacketPurpose(input.packet_purpose);
  const blockers = normalizeCompactList(input.blockers, 'blockers', errors);
```

### Step 10. `lib/continuity/thin-continuity-record.ts`: Keep the purpose on the normalized record

Current text:

```ts
    next_safe_action: nextSafeAction,
    blockers,
```

Replacement:

```ts
    next_safe_action: nextSafeAction,
    ...(packetPurpose ? { packet_purpose: packetPurpose } : {}),
    blockers,
```

### Step 11. `lib/continuity/authored-continuity-snapshot.ts`: Carry the stored purpose when the snapshot rewrites the block

Current text:

```ts
    ...(currentRecord?.session_dedup ? { session_dedup: currentRecord.session_dedup } : {}),
```

Replacement:

```ts
    ...(currentRecord?.session_dedup ? { session_dedup: currentRecord.session_dedup } : {}),
    ...(currentRecord?.packet_purpose ? { packet_purpose: currentRecord.packet_purpose } : {}),
```

### Step 12. `lib/continuity/authored-continuity-snapshot.ts`: Read the stored record before the facets are built

Current text:

```ts
  const timestamp = formatIsoSeconds(options.now ?? new Date());
  const facets = buildContinuityFacets({
    summary: ladder.summary,
    recentAction: ladder.recentAction,
    nextSafeAction: ladder.nextSafeAction,
    blockers: ladder.blockers,
    keyFiles: ladder.keyFiles,
  });
```

Replacement:

```ts
  const timestamp = formatIsoSeconds(options.now ?? new Date());
  const implementationSummaryPath = path.join(folderPath, 'implementation-summary.md');
  const currentSummary = fs.existsSync(implementationSummaryPath)
    ? fs.readFileSync(implementationSummaryPath, 'utf8')
    : null;
  const currentContinuity = currentSummary === null ? null : readThinContinuityRecord(currentSummary);
  const currentRecord = currentContinuity?.ok ? currentContinuity.record ?? null : null;
  const facets = buildContinuityFacets({
    summary: ladder.summary,
    recentAction: ladder.recentAction,
    nextSafeAction: ladder.nextSafeAction,
    blockers: ladder.blockers,
    keyFiles: ladder.keyFiles,
    packetPurpose: currentRecord?.packet_purpose ?? null,
  });
```

### Step 13. `lib/continuity/authored-continuity-snapshot.ts`: Use the record read above for the rewrite

Current text:

```ts
  const implementationSummaryPath = path.join(folderPath, 'implementation-summary.md');
  if (fs.existsSync(implementationSummaryPath)) {
    const currentSummary = fs.readFileSync(implementationSummaryPath, 'utf8');
    const currentContinuity = readThinContinuityRecord(currentSummary);
    const writeResult = upsertThinContinuityInMarkdown(currentSummary, buildContinuityRecord({
      ladder,
      specFolder,
      timestamp,
      actor: options.actor ?? 'precompact-hook',
      currentRecord: currentContinuity.ok ? currentContinuity.record : null,
    }));
```

Replacement:

```ts
  if (currentSummary !== null) {
    const writeResult = upsertThinContinuityInMarkdown(currentSummary, buildContinuityRecord({
      ladder,
      specFolder,
      timestamp,
      actor: options.actor ?? 'precompact-hook',
      currentRecord,
    }));
```

### Step 14. `cli/core/workflow.ts`: Import the helper through the runtime API

Current text:

```ts
import { readThinContinuityRecord, SESSION_REF_RUNTIME_LOCATOR_KINDS, upsertThinContinuityInMarkdown, writeDecisionRecord, recordConsumedKeys, DecisionRecordWriteError } from '@spec-kit/runtime/api';
```

Replacement:

```ts
import { formatPacketPurpose, readThinContinuityRecord, resolvePacketPurpose, SESSION_REF_RUNTIME_LOCATOR_KINDS, upsertThinContinuityInMarkdown, writeDecisionRecord, recordConsumedKeys, DecisionRecordWriteError } from '@spec-kit/runtime/api';
```

### Step 15. `cli/core/workflow.ts`: Give the merge the purpose line

Current text:

```ts
 * fields. Any failure in the payload's own values fails the whole update.
 */
function buildSaveContinuityMarkdown(
  summaryMarkdown: string,
  patch: Record<string, unknown>,
  packetPointer: string,
  now: string,
): SaveContinuityUpdate {
```

Replacement:

```ts
 * fields. Any failure in the payload's own values fails the whole update.
 *
 * The purpose line is the writer's own copy of the packet's spec docs. It is set on
 * every write and never carried, so a packet whose purpose is gone loses the copy too.
 */
function buildSaveContinuityMarkdown(
  summaryMarkdown: string,
  patch: Record<string, unknown>,
  packetPointer: string,
  now: string,
  packetPurpose: string | null,
): SaveContinuityUpdate {
```

### Step 16. `cli/core/workflow.ts`: Write the purpose line with the other writer-owned fields

Current text:

```ts
      last_updated_by: CONTINUITY_WRITER_ACTOR,
    });
```

Replacement:

```ts
      last_updated_by: CONTINUITY_WRITER_ACTOR,
      ...(packetPurpose ? { packet_purpose: packetPurpose } : {}),
    });
```

### Step 17. `cli/core/workflow.ts`: Keep the purpose line on the write plan

Current text:

```ts
  packetPointer: string;
  dropped: string[];
  hostPath: string;
}
```

Replacement:

```ts
  packetPointer: string;
  packetPurpose: string | null;
  dropped: string[];
  hostPath: string;
}
```

### Step 18. `cli/core/workflow.ts`: Resolve the purpose for the leaf the save writes into

Current text:

```ts
  const packetPointer = getPacketIdFromGraphMetadata(resolution.leafPath);
  const update = buildSaveContinuityMarkdown(
    fsSync.readFileSync(hostPath, 'utf8'),
    patch,
    packetPointer,
    new Date().toISOString(),
  );
```

Replacement:

```ts
  const packetPointer = getPacketIdFromGraphMetadata(resolution.leafPath);
  const purpose = resolvePacketPurpose(canonicalPath(resolution.leafPath));
  const packetPurpose = purpose ? formatPacketPurpose(purpose, projectRoot) : null;
  const update = buildSaveContinuityMarkdown(
    fsSync.readFileSync(hostPath, 'utf8'),
    patch,
    packetPointer,
    new Date().toISOString(),
    packetPurpose,
  );
```

### Step 19. `cli/core/workflow.ts`: Return the purpose line in the plan

Current text:

```ts
  return { leafPath: resolution.leafPath, patch, packetPointer, dropped: update.dropped, hostPath };
```

Replacement:

```ts
  return { leafPath: resolution.leafPath, patch, packetPointer, packetPurpose, dropped: update.dropped, hostPath };
```

### Step 20. `cli/core/workflow.ts`: Pass the planned purpose line to the final write

Current text:

```ts
      plan.packetPointer,
      now,
    );
```

Replacement:

```ts
      plan.packetPointer,
      now,
      plan.packetPurpose,
    );
```

### Step 21. `cli/continuity/generate-context.ts`: Name the field in the save help text

Current text:

```ts
  - A payload value the validator rejects fails the save before any file is written.
```

Replacement:

```ts
  - packet_purpose is writer-owned too: every continuity write copies the leaf's purpose
    sentence from its spec.md, else the nearest phase parent's, else its goal.md Objective,
    and leaves the field out when none is authored. A payload packet_purpose is ignored.
  - A payload value the validator rejects fails the save before any file is written.
```

### Step 22. `lib/continuity/README.md`: Name the field in the continuity README

Current text:

```markdown
- `session_ref` is the writer-owned, pointer-only save field. It records `runtime`, `sessionId`, `workspace`, `savedAt`, `locatorKind` and `version`, and it never holds transcript text or a locator path.
```

Replacement:

```markdown
- `session_ref` is the writer-owned, pointer-only save field. It records `runtime`, `sessionId`, `workspace`, `savedAt`, `locatorKind` and `version`, and it never holds transcript text or a locator path.
- `packet_purpose` is an optional, writer-owned copy of the packet's purpose line, refreshed on every continuity write from `lib/spec/packet-purpose.ts`. `spec.md` stays its source. It leads the Goal facet, and an invalid value is dropped without failing the record.
```

### Step 23. `tests/thin-continuity-record.vitest.ts`: Import the facet builder in the record tests

Current text:

```ts
import {
  THIN_CONTINUITY_MAX_BYTES,
  readThinContinuityRecord,
```

Replacement:

```ts
import {
  THIN_CONTINUITY_MAX_BYTES,
  buildContinuityFacets,
  readThinContinuityRecord,
```

### Step 24. `tests/thin-continuity-record.vitest.ts`: Add the two record tests

Current text:

```ts
    expect(result.ok).toBe(false);
    expect(result.errors.map((error) => error.code)).toContain('MEMORY_007');
  });
});
```

Replacement:

```ts
    expect(result.ok).toBe(false);
    expect(result.errors.map((error) => error.code)).toContain('MEMORY_007');
  });
});

describe('thin continuity packet_purpose', () => {
  it('keeps the purpose line through a write and a read, and leads the Goal facet with it', () => {
    const purpose = 'Purpose: Keep why the packet exists in front of the next session.';
    const written = upsertThinContinuityInMarkdown(makeFrontmatterMarkdown(), {
      packet_pointer: 'track/purpose-packet',
      last_updated_at: '2026-11-13T00:00:00Z',
      last_updated_by: 'purpose-test',
      recent_action: 'Recorded the fixture purpose',
      next_safe_action: 'Verify the fixture purpose',
      packet_purpose: purpose,
    });
    expect(written.ok).toBe(true);

    const read = readThinContinuityRecord(written.markdown!);
    expect(read.record?.packet_purpose).toBe(purpose);
    expect(buildContinuityFacets(read.record!).goal).toEqual([purpose, 'Verify the fixture purpose']);
  });

  it('drops a purpose that is not one short line and keeps the rest of the block', () => {
    const read = readThinContinuityRecord(makeContinuityMarkdown({
      packet_purpose: JSON.stringify(`Purpose: ${'x'.repeat(600)}`),
    }));

    expect(read.ok).toBe(true);
    expect(read.record?.packet_purpose).toBeUndefined();
    expect(buildContinuityFacets(read.record!).goal).toEqual(['Continue the fixture work']);
  });
});
```

### Step 25. `cli/tests/save-continuity-write.vitest.ts`: Add the two save writer tests

Current text:

```ts
    await save(LEAF, { recent_action: 'Ignored in plan-only mode' }, false);
    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).toBe(before);
  });
```

Replacement:

```ts
    await save(LEAF, { recent_action: 'Ignored in plan-only mode' }, false);
    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).toBe(before);
  });

  it('copies the nearest authored purpose into the leaf a parent-targeted save reaches', async () => {
    writeFile(`${PARENT}/spec.md`, `${specDoc('Parent')}\n### Purpose\nKeep the fixture purpose in view. This sentence is dropped.\n`);
    await save(PARENT, { recent_action: 'Wired the continuity writer', key_files: [`${LEAF}/spec.md`] });

    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).toContain(
      `packet_purpose: "Parent purpose (${PARENT}): Keep the fixture purpose in view."`,
    );
  });

  it('removes a stored purpose copy once no purpose is authored', async () => {
    writeFile(
      `${LEAF}/implementation-summary.md`,
      summaryDoc(LEAF).replace('    blockers:', '    packet_purpose: "Purpose: A purpose the spec no longer holds."\n    blockers:'),
    );
    await save(LEAF, { recent_action: 'Wired the continuity writer' });

    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).not.toContain('packet_purpose');
  });
```

### Step 26. `tests/authored-continuity-snapshot.vitest.ts`: Create the snapshot test

New file, full content:

```ts
// ───────────────────────────────────────────────────────────────────
// MODULE: Authored Continuity Snapshot Tests
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, describe, expect, it } from 'vitest';

import { refreshAuthoredContinuitySnapshot } from '../lib/continuity/authored-continuity-snapshot.js';

const WORKSPACE = fs.mkdtempSync(path.join(os.tmpdir(), 'authored-snapshot-'));
afterAll(() => fs.rmSync(WORKSPACE, { recursive: true, force: true }));

describe('authored continuity snapshot', () => {
  it('keeps the stored purpose copy and leads the Goal facet with it', () => {
    const folder = path.join(WORKSPACE, 'specs', 'demo', '001-snapshot');
    fs.mkdirSync(folder, { recursive: true });
    const purpose = 'Purpose: Keep the snapshot purpose in view.';
    fs.writeFileSync(path.join(folder, 'implementation-summary.md'), [
      '---',
      'title: "Implementation Summary"',
      '_memory:',
      '  continuity:',
      '    packet_pointer: "demo/001-snapshot"',
      '    last_updated_at: "2026-11-13T00:00:00Z"',
      '    last_updated_by: "tester"',
      '    recent_action: "Recorded the snapshot fixture"',
      '    next_safe_action: "Verify the snapshot fixture"',
      `    packet_purpose: "${purpose}"`,
      '---',
      '# Implementation Summary',
      '',
    ].join('\n'));

    const result = refreshAuthoredContinuitySnapshot({
      enabled: true,
      specFolder: 'demo/001-snapshot',
      workspacePath: WORKSPACE,
    });

    expect(result.status).toBe('updated');
    expect(result.facets?.goal[0]).toBe(purpose);
    expect(fs.readFileSync(path.join(folder, 'implementation-summary.md'), 'utf8')).toContain(`packet_purpose: "${purpose}"`);
  });
});
```

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run every command from the worktree root. `RT` is `.skilled/skills/system-spec-kit/runtime`. `P` is `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers`. `PR` is `$P/005-continuity-purpose-field/scratch/measure-continuity-purpose.mjs`.

`VR` is `(cd $RT && ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/thin-continuity-record.vitest.ts runtime/tests/resume-ladder.vitest.ts)`. `VC` is `(cd $RT/cli && ../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/save-continuity-write.vitest.ts)`.

Baseline, run on 2026-11-13 before any edit:

| Command | Observed |
|---------|----------|
| `VR` | `Test Files  2 passed (2)`, `Tests  58 passed (58)`: 40 and 18 tests |
| `VC` | `Test Files  1 passed (1)`, `Tests  39 passed (39)` |
| `(cd $RT && ../node_modules/.bin/tsc --noEmit --composite false -p tsconfig.json); echo $?` | no output, `0` |
| `(cd $RT/cli && ../../node_modules/.bin/tsc --noEmit --composite false -p tsconfig.json); echo $?` | no output, `0` |
| `(cd $RT && ../node_modules/.bin/eslint lib/continuity/thin-continuity-record.ts lib/continuity/authored-continuity-snapshot.ts api/index.ts cli/core/workflow.ts cli/continuity/generate-context.ts tests/thin-continuity-record.vitest.ts cli/tests/save-continuity-write.vitest.ts); echo $?` | no output, `0` |
| `bash $RT/cli/check-api-boundary.sh` | `PASS: No lib/ -> api/ import violations found` |
| `node $PR $RT $P \| tail -2` | `probe.ok=true errors=0 has_packet_purpose=false` and `rewrite.ok=true kept_in_markdown=false` |

Wider regression sets, baseline on the same day:

| Command | Observed |
|---------|----------|
| `(cd $RT && ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/continuity-freshness.vitest.ts runtime/tests/path-boundary.vitest.ts runtime/tests/resume-ladder.vitest.ts runtime/tests/session-token-resume.vitest.ts runtime/tests/spec-doc-structure.vitest.ts runtime/tests/thin-continuity-record.vitest.ts)` | `Test Files  6 passed (6)`, `Tests  106 passed (106)` |
| `(cd $RT/cli && ../../node_modules/.bin/vitest run --config ../../vitest.config.ts --project cli tests/continuity-freshness.vitest.ts tests/input-normalizer-unit.vitest.ts tests/phase-parent-pointer.vitest.ts tests/save-continuity-write.vitest.ts tests/test-phase-command-workflows.js tests/trigger-index-rebuild-workflow.vitest.ts tests/workflow-canonical-save-metadata.vitest.ts tests/workflow-invariance.vitest.ts tests/workflow-save-secret-scrub.vitest.ts tests/workflow-session-id.vitest.ts tests/workflow-step115-daemon-guard.vitest.ts tests/workflow-trigger-index-freshness.vitest.ts)` | `Test Files  10 passed \| 1 skipped (11)`, `Tests  171 passed \| 3 skipped (174)` |

After the edits, build the runtime first and then the cli. The cli tests load `@spec-kit/runtime/api` from the runtime `dist`, and `/speckit:save` runs the cli `dist`:

| Command | Expected, from the dry run in a scratch copy |
|---------|----------------------------------------------|
| `npm --prefix $RT run build; echo $?` | `0`, and `rg -c resolvePacketPurpose $RT/dist/api/index.js` prints 1 |
| `npm --prefix $RT/cli run build; echo $?` | `0`, and `rg -c resolvePacketPurpose $RT/cli/dist/core/workflow.js` prints 2 |
| `VR` with `runtime/tests/authored-continuity-snapshot.vitest.ts` added | `Test Files  3 passed (3)`, `Tests  61 passed (61)`: 42, 18 and 1 tests |
| `VC` | `Test Files  1 passed (1)`, `Tests  41 passed (41)` |
| Both typecheck commands | no output, `0` |
| The eslint command with `tests/authored-continuity-snapshot.vitest.ts` added | no output, `0` |
| `bash $RT/cli/check-api-boundary.sh` | `PASS: No lib/ -> api/ import violations found` |
| `node $PR $RT $P \| tail -2` | `probe.ok=true errors=0 has_packet_purpose=true` and `rewrite.ok=true kept_in_markdown=true` |
| The wider runtime set with the snapshot test added | `Test Files  7 passed (7)`, `Tests  109 passed (109)` |
| The wider cli set | `Test Files  10 passed \| 1 skipped (11)`, `Tests  173 passed \| 3 skipped (176)` |

In the scratch copy two wider files failed to load because the copy lacked `.skilled/hooks/goal/lib/goal-slice.cjs` and `.github/workflows/trigger-index-rebuild.yml`, which sit outside the runtime. Both pass in the worktree. Such a failure outside a full checkout is the environment, not this change.

Each new test was checked against the code it guards in the dry run. With the snapshot carry removed the snapshot test fails, and with the writer's `packet_purpose` line removed the parent-targeted save test fails. The stale-copy test fails if a later change adds `packet_purpose` to `CARRIED_CONTINUITY_FIELDS`.

Size evidence from the dry run, over the 2,607 `implementation-summary.md` files under `specs/` outside `z_archive`, `scratch` and `research`: 1,138 hold a block the strict reader accepts. The largest serializes to 1,456 bytes today and would serialize to 1,701 bytes with its resolved purpose line, so none crosses the 2,048-byte budget. The helper resolved 1,048 purposes from the packet itself, 83 from an ancestor, 0 from `goal.md` and found none for 7. The formatted line has a median of 168 characters and a maximum of 384, under the 512-character limit.

Strict validation does not reject the key today. A copied Level 1 fixture ran the same 40 rules with the same outcome with and without a hand-added `packet_purpose` line. The three failures in both runs were path drift from the copy.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

Child 004's `lib/spec/packet-purpose.ts` with `resolvePacketPurpose(specFolderAbsPath)` and `formatPacketPurpose(purpose, projectRoot)` as its plan states them. Node, `tsc`, Vitest and ESLint as the runtime already uses them. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a save fails or writes a wrong purpose line, or a resume stops reading a block it read before. Revert the one commit that carries the nine files, then run `npm --prefix .skilled/skills/system-spec-kit/runtime run build` and `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run build` so the save and the hooks load the old `dist`. Blocks written in between keep a `packet_purpose` line, and the old reader drops it on its next read and rewrite, so no data repair is needed.
<!-- /ANCHOR:rollback -->

---
