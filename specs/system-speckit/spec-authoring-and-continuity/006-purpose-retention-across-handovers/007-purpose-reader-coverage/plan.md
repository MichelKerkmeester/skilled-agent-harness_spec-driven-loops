---
title: "Implementation Plan: Phase 7: purpose-reader-coverage"
description: "Seven literal search-and-replace edits in three files. Five widen what the purpose helper reads and fix its first-sentence rule, one adds five tests and one rewords a README row. The proof is the helper's test file and a probe over two real packets."
trigger_phrases:
  - "purpose reader coverage plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: purpose-reader-coverage

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM) for one library file and its vitest file, Markdown for one README row |
| **Framework** | system-spec-kit runtime library, `runtime/lib/spec/` |
| **Storage** | None |
| **Testing** | vitest from `.skilled/skills/system-spec-kit/node_modules`, `npm run typecheck`, eslint and one `node` probe in this folder's `scratch/` |

### Overview
Seven literal edits change what `packet-purpose.ts` reads. E1 adds four constants, E2 replaces `extractPurposeParagraph` with a version that reads three shapes, E3 and E4 change two lines in `authoredSentence` and E5 corrects one doc comment. E6 adds five fixtures and five tests, and E7 rewords the README row. The proof is `packet-purpose.vitest.ts` going from 4 passing tests to 9 and the probe printing `packet` for two real packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The baseline commands in section 5 print the numbers recorded there
- [ ] Each search text in section 4 matches exactly once in its file (`rg -c -F`, or `rg -U -c -F` for E2 and E6, prints 1)
- [ ] `git status --short` lists none of the three files in section 4 before the first edit

### Definition of Done
- [ ] All REQ rows in `spec.md` have evidence in `tasks.md`
- [ ] `packet-purpose.vitest.ts` prints `Tests  9 passed (9)`, `hook-session-start.vitest.ts` prints `(23 tests)` and `history-locator-adapters.vitest.ts` prints `(18 tests)`, all passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Extend in place. One existing library file gains a wider reader. No new file outside this folder's `scratch/`, no new export, option or dependency.

### Key Components
- **`extractPurposeParagraph` in `runtime/lib/spec/packet-purpose.ts`**: today it returns an empty string for any `spec.md` without an exact `### Purpose` heading (line 54), so `purposeIn` returns null and `resolvePacketPurpose` walks to a parent. After E2 it reads three shapes, in this order.
- **`paragraphAfter`, a private function in the same file**: the paragraph loop that `extractPurposeParagraph` holds today, moved out unchanged so the three shapes share it. It is not exported.
- **`authoredSentence` in the same file**: today its regex ends the sentence at the first full stop. After E3 and E4 it drops a list marker first and skips the full stop of four abbreviations.

### Data Flow
`resolvePacketPurpose(folder)` calls `purposeIn(folder)`, which reads `spec.md` and passes it to `extractPurposeParagraph`, then passes that paragraph to `authoredSentence`. Nothing above `purposeIn` changes, so the walk to a parent, the `goal.md` fallback, the three labels in `formatPacketPurpose` and every caller behave as before.

### The reading order, and why
1. The paragraph under `### Purpose`. This is the current template, and 2671 of the 2963 live files have it.
2. With no such heading, find the purpose section: the first line that matches `## PROBLEM & PURPOSE`, `## PROBLEM AND PURPOSE`, `## ROOT PURPOSE` or `## PURPOSE`, in any letter case, with or without a number such as `2.` before the name. No purpose section means no purpose, as today.
3. Inside the section, which ends at the next line that starts with `## `, take the first paragraph that opens with `Purpose:` or `**Purpose:**`, with or without a list bullet, and remove the label.
4. With no labelled paragraph, take the section's first paragraph.

The label comes before the first paragraph because under a combined problem and purpose heading the first paragraph is the problem, and an author who wrote `Purpose:` marked which paragraph is the purpose. The label is read only inside the section because a `Purpose:` cell in a table or a later section is not the packet's purpose.

A purpose section whose first content is a `###` subheading yields nothing, because the paragraph reader stops at any heading. That is today's result for those files and this phase does not change it.

### The first-sentence rule
- A leading `1. `, `1) `, `- ` or `* ` is removed before the sentence is cut. Today a numbered Purpose yields `1.`.
- A full stop that follows `e.g`, `i.e`, `vs` or `cf` as a whole word does not end the sentence. The list is these four and no pattern for abbreviations in general, because `etc.` and a trailing initial do end sentences.
- The 300-character cap and the `...` it adds stay as they are.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup runs the baseline commands in section 5 and confirms each search text below matches once. Implementation applies E1 to E7 below, one per task in `tasks.md`. Verification builds the runtime, reruns the baseline commands and runs the probe. `tasks.md` owns the order and the task state.

Apply each edit as a literal search and replace with the Edit tool. Copy the text inside the fences exactly. `P` is `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` and `T` is `.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts`. Each search text was counted on 2026-11-14 at `bd79708c2f` with `rg -c -F`, or `rg -U -c -F` where it spans lines, and each printed `1`.

### E1. Four constants
File: `P` (line 37). Count: 1.

Search text:
```text
const MAX_ANCESTOR_DEPTH = 8;
```
Replacement:
```text
const MAX_ANCESTOR_DEPTH = 8;
// Packets written before the `### Purpose` subheading hold the purpose under
// one of these level-two headings, with or without a section number.
const PURPOSE_SECTION_HEADING = /^##\s+(?:\d+\.\s+)?(?:PROBLEM\s+(?:&|AND)\s+PURPOSE|ROOT\s+PURPOSE|PURPOSE)\s*$/i;
// Inside that section an author may mark the purpose paragraph with a label.
const PURPOSE_LABEL = /^(?:[-*]\s+)?\*{0,2}Purpose\*{0,2}\s*:\*{0,2}\s*/i;
// A numbered or bulleted purpose opens with a marker that is not its sentence.
const LIST_MARKER = /^(?:\d+[.)]|[-*])\s+/;
// The full stop of these abbreviations does not end a sentence.
const SENTENCE_END = /^.+?(?<!\b(?:e\.g|i\.e|vs|cf))[.!?](?=\s|$)/i;
```

### E2. The reader takes three shapes
File: `P` (lines 51 to 68). Count: 1 with `rg -U -c -F`. The search text is the whole current function. The replacement puts the paragraph loop, unchanged, into `paragraphAfter` and places it above its caller.

Search text:
```text
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
```
Replacement:
```text
/** The first paragraph after line `start`, skipping comment lines and stopping at a heading, an anchor close or a quote. */
function paragraphAfter(lines: string[], start: number): string {
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

/**
 * The packet's purpose paragraph. Reads the `### Purpose` subheading first.
 * Without one it reads the purpose section: the paragraph an author labelled
 * `Purpose:` when there is one, else the section's first paragraph.
 */
function extractPurposeParagraph(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const trimmed = lines.map((line) => line.trim());
  const subheading = trimmed.findIndex((line) => /^###\s+Purpose\s*$/.test(line));
  if (subheading >= 0) return paragraphAfter(lines, subheading);

  const section = trimmed.findIndex((line) => PURPOSE_SECTION_HEADING.test(line));
  if (section < 0) return '';
  const nextSection = trimmed.findIndex((line, index) => index > section && /^##\s/.test(line));
  const sectionEnd = nextSection < 0 ? trimmed.length : nextSection;
  const labelled = trimmed.findIndex(
    (line, index) => index > section && index < sectionEnd && PURPOSE_LABEL.test(line),
  );
  if (labelled >= 0) return paragraphAfter(lines, labelled - 1).replace(PURPOSE_LABEL, '');
  return paragraphAfter(lines, section);
}
```

### E3. Drop a leading list marker
File: `P` (line 79). Count: 1.

Search text:
```text
  const text = raw.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ').trim();
```
Replacement:
```text
  const text = raw.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ').trim().replace(LIST_MARKER, '');
```

### E4. Do not end the sentence at an abbreviation
File: `P` (line 82). Count: 1.

Search text:
```text
  const sentence = text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
```
Replacement:
```text
  const sentence = text.match(SENTENCE_END)?.[0] ?? text;
```

### E5. The doc comment names the purpose, not one heading
File: `P` (line 100). Count: 1.

Search text:
```text
 * Reads the packet's own `### Purpose` first. When that is empty or a
```
Replacement:
```text
 * Reads the packet's own purpose first. When that is empty or a
```

### E6. Five fixtures and five tests
File: `T`. Two edits in one task, each counted 1 with `rg -U -c -F`. Each new test fails today for one reason: the first three and the fifth because the reader returns nothing or a cut line for that shape, and the fourth pins that a stray label stays unread once labels are read at all.

First search text (lines 31 to 32):
```text
  'Ship the scaffolded packet goal.',
);
```
First replacement:
```text
  'Ship the scaffolded packet goal.',
);

function rawPacket(relativeFolder: string, spec: string): string {
  const folder = join(ROOT, relativeFolder);
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, 'spec.md'), spec);
  return folder;
}

const combinedHeading = rawPacket(
  'specs/demo/010-combined-heading',
  '# Spec\n\n## 2. PROBLEM & PURPOSE\n\nThe archive never shrinks, so the disk fills.\nA second line of the same paragraph.\n\nA later paragraph.\n\n## 3. SCOPE\n',
);
const labelled = rawPacket(
  'specs/demo/011-labelled',
  '# Spec\n\n## 2. PROBLEM & PURPOSE\n\nThe archive never shrinks.\n\n**Purpose:** keep three archives and delete the rest. More detail.\n\n## 3. SCOPE\n',
);
const rootPurpose = rawPacket(
  'specs/demo/012-root-purpose',
  '# Spec\n\n## ROOT PURPOSE\n\nGive every runtime one goal hook.\n',
);
const labelOutsideSection = rawPacket(
  'specs/demo/013-label-outside',
  '# Spec\n\n## 1. METADATA\n\nPurpose: a table note that is not the packet purpose.\n',
);
const numbered = packet(
  'specs/demo/014-numbered',
  '1. Measure the archive size (e.g. with du) before the cut. Then cut.',
);
```

Second search text (lines 59 to 61):
```text
  it('returns null for a folder that does not exist', () => {
    expect(resolvePacketPurpose(join(ROOT, 'specs/demo/404-missing'))).toBeNull();
  });
```
Second replacement:
```text
  it('returns null for a folder that does not exist', () => {
    expect(resolvePacketPurpose(join(ROOT, 'specs/demo/404-missing'))).toBeNull();
  });

  it('reads the first paragraph under a combined problem and purpose heading', () => {
    expect(resolvePacketPurpose(combinedHeading)).toEqual({
      text: 'The archive never shrinks, so the disk fills.',
      source: 'packet',
      folder: combinedHeading,
    });
  });

  it('prefers a labelled purpose paragraph inside that section and drops the label', () => {
    expect(resolvePacketPurpose(labelled)?.text).toBe('keep three archives and delete the rest.');
  });

  it('reads a root purpose heading', () => {
    expect(resolvePacketPurpose(rootPurpose)?.text).toBe('Give every runtime one goal hook.');
  });

  it('ignores a purpose label outside a purpose section', () => {
    expect(resolvePacketPurpose(labelOutsideSection)).toBeNull();
  });

  it('drops a list marker and does not end the sentence at an abbreviation', () => {
    expect(resolvePacketPurpose(numbered)?.text).toBe('Measure the archive size (e.g. with du) before the cut.');
  });
```

### E7. The README row names the shapes
File: `.skilled/skills/system-spec-kit/runtime/lib/spec/README.md` (line 31). Count: 1.

Search text:
```text
the first sentence of a packet's `### Purpose`, else the nearest enclosing phase parent's
```
Replacement:
```text
the first sentence of a packet's purpose, read under `### Purpose`, in a paragraph labelled `Purpose:` or under a level-two purpose heading, else the nearest enclosing phase parent's
```

None of these edits was applied or run at planning time. This session could not start `node`, so no scratch copy of the helper was executed. The expected test results below follow from reading the replacement text against each fixture.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run each command below before E1 and again after E7 and the build. Commands marked `(runtime)` run from `.skilled/skills/system-spec-kit/runtime`, all others from the worktree root. `G` is `specs/hooks-plugins-extensions/goal-and-directive-hooks/001-goal-hooks-cross-runtime` and `D` is `specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/001-deep-research`.

| Command | Baseline | After the edits |
|---------|----------|-----------------|
| `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/packet-purpose.vitest.ts` | `Tests  4 passed (4)`, recorded in phase 004's `tasks.md` when the file was created | `Tests  9 passed (9)`, exit 0 |
| `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts` | `(23 tests)` and `(18 tests)`, `Tests  41 passed (41)`. The 23 is phase 006's recorded baseline. The 18 is a count of `it(` lines in the file, not a run | unchanged |
| `(runtime) npm run typecheck` | exit 0, no diagnostics | unchanged |
| `(runtime) ../node_modules/.bin/eslint lib/spec/packet-purpose.ts tests/packet-purpose.vitest.ts` | exit 0, no output | unchanged |
| `LIST \| node <this folder>/scratch/probe-reader.mjs G D`, where `LIST` is the second Measured Behavior command in `spec.md` without its `wc -l` | `001-goal-hooks-cross-runtime none`, `001-deep-research ancestor` and `own purpose read: 0 of 292`. The first two are the reviewer's recorded results, and the third follows from the exact-heading test at line 54 | `001-goal-hooks-cross-runtime packet`, `001-deep-research packet` and `own purpose read: <n> of 292` |

The probe loads the built `dist/` file, so it shows the change only after `npm run build`. Its last line has no pass mark. A file whose purpose section opens with a subheading or a placeholder still yields nothing, and one that opens with a table yields the table row as its sentence, which no live file does today, so the number is recorded in `implementation-summary.md` and not gated.

A baseline that prints something other than the value in this table stops the phase before E1. Report the difference and do not edit.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`node`, `npm` for the runtime build and typecheck, and `rg`. No new package.

The helper has four callers, and none of them changes: `runtime/hooks/claude/session-prime.ts:232`, `runtime/hooks/pi/session-compact-context.ts:79`, `runtime/cli/core/workflow.ts:614` and the export at `runtime/api/index.ts:126`. The first three run from `dist/`, which `npm run build` regenerates.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: any of the nine helper tests fails after the edits, or a command in section 5 moves from its baseline in a way the After column does not name. Before commit, run `git checkout -- <file>` for the three files in section 4 and `npm run build` in the runtime folder. After commit, revert that one commit and rebuild.
<!-- /ANCHOR:rollback -->

---
