---
title: "Implementation Plan: Phase 10: problem-sentence-carry"
description: "Fourteen literal search-and-replace edits in nine files. Six give the purpose helper a problem sentence, three print it in the two compaction adapters, three extend the tests and two name it in the READMEs. The proof is three test files and the unchanged continuity tests."
trigger_phrases:
  - "problem sentence carry plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: problem-sentence-carry

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM) for one library file, two hook adapters and three vitest files, Markdown for three README rows |
| **Framework** | system-spec-kit runtime library and hooks |
| **Storage** | None |
| **Testing** | vitest from `.skilled/skills/system-spec-kit/node_modules`, `npm run typecheck` and `npm run build` |

### Overview
Fourteen literal edits add a problem sentence to the purpose the helper resolves and print it after a compaction. E1 to E6 change `packet-purpose.ts`, E7 to E9 change the two adapters, E10 to E12 change the tests and E13 and E14 change the READMEs. The proof is `hook-session-start.vitest.ts` at 27 tests, `packet-purpose.vitest.ts` at 9 and `history-locator-adapters.vitest.ts` at 19, all passing, with the two continuity test files unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The operator has said yes to carrying the problem, the open question in `spec.md` section 7
- [ ] Phases 007 and 009 are built: `rg -c '^function paragraphAfter' .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` prints `1` and `rg -c '^export function folderNamedInBrief' .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` prints `1`
- [ ] Each search text in section 4 matches exactly once in its file (`rg -c -F`, or `rg -U -c -F` where it spans lines, prints 1)

### Definition of Done
- [ ] All REQ rows in `spec.md` have evidence in `tasks.md`
- [ ] The three test files print `Tests  9 passed (9)`, `(28 tests)` and `(19 tests)`, all passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
One more field. The value the helper already returns gains a problem sentence, and the two adapters print it on a second line.

### Key Components
- **`PacketPurpose` and `resolvePacketPurpose` in `runtime/lib/spec/packet-purpose.ts`**: the returned value gains `problem`, read by the new private `problemIn` from the folder that supplied the purpose.
- **`formatPacketProblem`, a new export in the same file**: returns `Problem: <sentence>` or null. It exists beside `formatPacketPurpose` because that function's one-line result is stored in the continuity block, where a second sentence does not fit.
- **`buildPacketPurposeSection` in `runtime/hooks/claude/session-prime.ts`** and **`readPacketPurposeSection` in `runtime/hooks/pi/session-compact-context.ts`**: each prints the purpose line and then the problem line when there is one.

### Data Flow
`resolvePacketPurpose(folder)` finds the purpose as today, in the packet, an enclosing phase parent or `goal.md`. For the first two it then reads the first sentence under `### Problem Statement` in that same `spec.md`. The adapter prints `## Packet Purpose`, the purpose line and, when the problem is not null, `Problem: <sentence>`. The continuity writer still calls only `formatPacketPurpose`, so what it stores does not change.

### What the problem sentence is
- It comes from the paragraph under a heading that reads exactly `### Problem Statement`, through the same `paragraphAfter` and `authoredSentence` the purpose uses. So it is one sentence, at most 300 characters, and a bracket placeholder, `UNKNOWN` or an empty paragraph gives null.
- It comes from the folder that supplied the purpose. An inherited purpose shows the parent's problem.
- A purpose taken from `goal.md` has a null problem.
- The line is always `Problem: <sentence>`. The purpose line above it already names the parent folder when the pair is inherited.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup confirms phases 007 and 009 are built, captures the baselines in section 5 and confirms each search text below matches once. Implementation applies E1 to E14 below, one per task in `tasks.md`. Verification runs the test files, the typecheck and the build. `tasks.md` owns the order and the task state.

Apply each edit as a literal search and replace with the Edit tool. Copy the text inside the fences exactly. `P` is `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts`, `S` is `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`, `PI` is `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts`, `T` is `.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts`, `ST` is `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` and `PT` is `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts`.

Search texts marked "today" were counted on 2026-11-14 at `bd79708c2f` and each printed `1`. Search texts marked "after 007" or "after 009" are lines those phases write, copied from their `plan.md`. They match nothing until that phase is built, and task T003 counts them then.

### E1. The returned value gains a problem
File: `P`. Count today: 1 with `rg -U -c -F`.

Search text:
```text
  /** Absolute path of the folder whose spec.md or goal.md held the text. */
  folder: string;
}
```
Replacement:
```text
  /** Absolute path of the folder whose spec.md or goal.md held the text. */
  folder: string;
  /** The first sentence of that folder's `### Problem Statement`, or null when it states none. */
  problem: string | null;
}
```

### E2. Read the problem sentence
File: `P`. Count today: 1 with `rg -U -c -F`. `paragraphAfter` is the function phase 007 edit E2 creates.

Search text:
```text
function purposeIn(folder: string): string | null {
  const markdown = readTextFile(path.join(folder, 'spec.md'));
  return markdown === null ? null : authoredSentence(extractPurposeParagraph(markdown));
}
```
Replacement:
```text
function purposeIn(folder: string): string | null {
  const markdown = readTextFile(path.join(folder, 'spec.md'));
  return markdown === null ? null : authoredSentence(extractPurposeParagraph(markdown));
}

/** The first sentence under `### Problem Statement`: what is broken, and for whom. */
function problemIn(folder: string): string | null {
  const markdown = readTextFile(path.join(folder, 'spec.md'));
  if (markdown === null) return null;
  const lines = markdown.split(/\r?\n/);
  const heading = lines.findIndex((line) => /^###\s+Problem Statement\s*$/.test(line.trim()));
  return heading < 0 ? null : authoredSentence(paragraphAfter(lines, heading));
}
```

### E3. The packet's own purpose carries its problem
File: `P`. Count today: 1.

Search text:
```text
    if (own) return { text: own, source: 'packet', folder };
```
Replacement:
```text
    if (own) return { text: own, source: 'packet', folder, problem: problemIn(folder) };
```

### E4. An inherited purpose carries the parent's problem
File: `P`. Count today: 1.

Search text:
```text
      if (inherited) return { text: inherited, source: 'ancestor', folder: parent };
```
Replacement:
```text
      if (inherited) return { text: inherited, source: 'ancestor', folder: parent, problem: problemIn(parent) };
```

### E5. A goal objective has no problem
File: `P`. Count today: 1.

Search text:
```text
    return objective ? { text: objective, source: 'goal', folder } : null;
```
Replacement:
```text
    return objective ? { text: objective, source: 'goal', folder, problem: null } : null;
```

### E6. Format the problem line
File: `P`. Count today: 1 with `rg -U -c -F`. These are the last three lines of the file.

Search text:
```text
  if (purpose.source === 'goal') return `Goal objective: ${purpose.text}`;
  return `Purpose: ${purpose.text}`;
}
```
Replacement:
```text
  if (purpose.source === 'goal') return `Goal objective: ${purpose.text}`;
  return `Purpose: ${purpose.text}`;
}

/** Render the problem behind a resolved purpose as one line, or null when the packet states none. */
export function formatPacketProblem(purpose: PacketPurpose): string | null {
  return purpose.problem ? `Problem: ${purpose.problem}` : null;
}
```

### E7. Claude adapter, import the formatter
File: `S` (line 38). Count today: 1.

Search text:
```text
import { formatPacketPurpose, resolvePacketPurpose } from '../../lib/spec/packet-purpose.js';
```
Replacement:
```text
import { formatPacketProblem, formatPacketPurpose, resolvePacketPurpose } from '../../lib/spec/packet-purpose.js';
```

### E8. Claude adapter, print the problem line
File: `S`. Count after 009: 1. The search text is the last line phase 009 edit E2 writes inside `buildPacketPurposeSection`.

Search text:
```text
  return { title: 'Packet Purpose', content: formatPacketPurpose(purpose, root) };
```
Replacement:
```text
  const line = formatPacketPurpose(purpose, root);
  const problem = formatPacketProblem(purpose);
  return { title: 'Packet Purpose', content: problem ? `${line}\n${problem}` : line };
```

### E9. Pi adapter, load the formatter and print the problem line
File: `PI`. Two edits in one task. The Pi adapter loads the helper from `dist/` under a local type, so the type and the cast both gain the new member.

First search text (lines 72 to 78), count today: 1 with `rg -U -c -F`:
```text
    type PacketPurpose = { text: string; source: "packet" | "ancestor" | "goal"; folder: string };
    const { formatPacketPurpose, resolvePacketPurpose } = await import(
      "../../dist/lib/spec/packet-purpose.js"
    ) as {
      resolvePacketPurpose: (specFolderAbsPath: string) => PacketPurpose | null;
      formatPacketPurpose: (purpose: PacketPurpose, projectRoot: string) => string;
    };
```
First replacement:
```text
    type PacketPurpose = { text: string; source: "packet" | "ancestor" | "goal"; folder: string; problem: string | null };
    const { formatPacketProblem, formatPacketPurpose, resolvePacketPurpose } = await import(
      "../../dist/lib/spec/packet-purpose.js"
    ) as {
      resolvePacketPurpose: (specFolderAbsPath: string) => PacketPurpose | null;
      formatPacketPurpose: (purpose: PacketPurpose, projectRoot: string) => string;
      formatPacketProblem: (purpose: PacketPurpose) => string | null;
    };
```
Second search text, count after 009: 1. It is the last line phase 009 edit E5 writes:
```text
    return purpose ? `## Packet Purpose\n${formatPacketPurpose(purpose, root)}` : null;
```
Second replacement:
```text
    if (!purpose) return null;
    const line = formatPacketPurpose(purpose, root);
    const problem = formatPacketProblem(purpose);
    return `## Packet Purpose\n${problem ? `${line}\n${problem}` : line}`;
```

### E10. Helper test file, four assertions name the problem
File: `T`. Four edits in one task, each counted with `rg -U -c -F`. The fixture helper `packet()` writes `### Problem Statement` with the line `A problem.`, so a packet and a child that inherits from it both report that sentence. The goal fixture and the combined-heading fixture report null.

First search text, count today: 1:
```text
      source: 'packet',
      folder: parent,
    });
```
First replacement:
```text
      source: 'packet',
      folder: parent,
      problem: 'A problem.',
    });
```
Second search text, count today: 1:
```text
      source: 'ancestor',
      folder: parent,
    });
```
Second replacement:
```text
      source: 'ancestor',
      folder: parent,
      problem: 'A problem.',
    });
```
Third search text, count today: 1:
```text
      source: 'goal',
      folder: scaffolded,
    });
```
Third replacement:
```text
      source: 'goal',
      folder: scaffolded,
      problem: null,
    });
```
Fourth search text, count after 007: 1. It is part of the first test phase 007 edit E6 adds:
```text
      source: 'packet',
      folder: combinedHeading,
    });
```
Fourth replacement:
```text
      source: 'packet',
      folder: combinedHeading,
      problem: null,
    });
```

### E11. Claude test file, one new test
File: `ST`. Count after 009: 1 with `rg -U -c -F`. The search text is the end of the last test phase 009 edit E8 adds. The new test fails today because no Problem line is printed.

Search text:
```text
      expect(folderNamedInBrief('## Session State\nRecent topics:\n- purpose')).toBeNull();
    });
```
Replacement:
```text
      expect(folderNamedInBrief('## Session State\nRecent topics:\n- purpose')).toBeNull();
    });

    it('adds the problem under the purpose line', async () => {
      const packetDir = mkdtempSync(join(process.cwd(), '.tmp-session-prime-problem-'));
      writeFileSync(
        join(packetDir, 'spec.md'),
        '### Problem Statement\nThe archive never shrinks, so the disk fills. More detail.\n\n### Purpose\nKeep three archives.\n',
      );
      try {
        const now = new Date().toISOString();
        saveState(testSessionId, {
          claudeSessionId: testSessionId,
          speckitSessionId: null,
          lastSpecFolder: relative(process.cwd(), packetDir),
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

        expect(output.startsWith(
          '## Packet Purpose\nPurpose: Keep three archives.\nProblem: The archive never shrinks, so the disk fills.\n',
        )).toBe(true);
        expect(output).not.toContain('More detail');
      } finally {
        rmSync(packetDir, { recursive: true, force: true });
      }
    });
```

### E12. Pi test file, the fixture states a problem
File: `PT`. Two edits in one task, each counted 1 today.

First search text (line 136):
```text
    writeFileSync(join(packetDir, 'spec.md'), '### Purpose\nKeep the reason for the work in view.\n');
```
First replacement:
```text
    writeFileSync(join(packetDir, 'spec.md'), '### Problem Statement\nThe reason gets lost.\n\n### Purpose\nKeep the reason for the work in view.\n');
```
Second search text (line 155):
```text
      expect(messages[0].content).toContain('## Packet Purpose\nPurpose: Keep the reason for the work in view.');
```
Second replacement:
```text
      expect(messages[0].content).toContain('## Packet Purpose\nPurpose: Keep the reason for the work in view.\nProblem: The reason gets lost.');
```

### E13. Library README, one row
File: `.skilled/skills/system-spec-kit/runtime/lib/spec/README.md` (line 53). Count today: 1.

Search text:
```text
| `formatPacketPurpose(purpose, projectRoot)` | Function | One line for a recovery brief that names the parent folder when the purpose is inherited. |
```
Replacement:
```text
| `formatPacketPurpose(purpose, projectRoot)` | Function | One line for a recovery brief that names the parent folder when the purpose is inherited. |
| `formatPacketProblem(purpose)` | Function | One `Problem:` line with the first sentence of the Problem Statement in the folder the purpose came from, or null. |
```

### E14. Hook READMEs, two rows
Two edits in one task, each counted 1 today.

First file: `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md` (line 20). Search text:
```text
that quotes the last active packet's purpose, when one is authored.
```
Replacement:
```text
that quotes the last active packet's purpose, when one is authored, and its problem on a second line when the packet states one.
```
Second file: `.skilled/skills/system-spec-kit/runtime/hooks/pi/README.md` (line 47). Search text:
```text
When the last active packet has an authored purpose, a `## Packet Purpose` section comes before `## Active Spec Folder`.
```
Replacement:
```text
When the last active packet has an authored purpose, a `## Packet Purpose` section comes before `## Active Spec Folder`, with a `Problem:` line when the packet states one.
```

None of these edits was applied or run at planning time. This session could not start `node`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run each command below before E1 and again after E14. All run from `.skilled/skills/system-spec-kit/runtime`. The baselines are the values phases 007 and 009 leave behind, so they hold only once both are built.

| Command | Baseline | After the edits |
|---------|----------|-----------------|
| `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/packet-purpose.vitest.ts` | `Tests  9 passed (9)` | unchanged, with four assertions extended |
| `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts` | `(27 tests)`, `(19 tests)`, `Tests  46 passed (46)` | `(28 tests)`, `(19 tests)`, `Tests  47 passed (47)`, exit 0 |
| `../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/thin-continuity-record.vitest.ts runtime/tests/authored-continuity-snapshot.vitest.ts` | `(42 tests)`, `(1 test)`, `Tests  43 passed (43)`, run 2026-11-14 at `bd79708c2f` | unchanged |
| `npm run typecheck` | exit 0, no diagnostics | unchanged |
| `../node_modules/.bin/eslint lib/spec/packet-purpose.ts hooks/claude/session-prime.ts hooks/pi/session-compact-context.ts` | exit 0, no output | unchanged |
| `npm run build` | exit 0 | exit 0, and `rg -c 'formatPacketProblem' dist/lib/spec/packet-purpose.js` prints `1` |

A baseline that prints something other than the value in this table stops the phase before E1. Report the difference and do not edit.

What no check proves: that the Problem line helps a model after a real compaction. That needs a real compaction in an operator session.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`node`, `npm` for the runtime build and typecheck, and `rg`. No new package.

Phases 007 and 009 come first. `runtime/cli/core/workflow.ts:614` calls `resolvePacketPurpose` and passes the result to `formatPacketPurpose` only, so the extra field does not reach the continuity block. Its own test, `runtime/cli/tests/save-continuity-write.vitest.ts`, sits outside the runtime vitest config (`vitest.config.ts` excludes `runtime/cli/**`), so this plan checks the two continuity test files under `runtime/tests/` and that `workflow.ts` is untouched. `runtime/api/index.ts:126` re-exports the two existing functions and is not changed, because no caller outside the runtime needs the problem line.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: any test in the three purpose test files fails after the edits, or the continuity test counts move. Before commit, run `git checkout -- <file>` for the nine files in section 4 and `npm run build` in the runtime folder. After commit, revert that one commit and rebuild. Phases 007 to 009 stay in place.
<!-- /ANCHOR:rollback -->

---
