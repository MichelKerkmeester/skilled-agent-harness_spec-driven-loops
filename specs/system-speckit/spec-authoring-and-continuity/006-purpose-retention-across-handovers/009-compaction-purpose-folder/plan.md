---
title: "Implementation Plan: Phase 9: compaction-purpose-folder"
description: "Nine literal search-and-replace edits in four files. Five change how the two compaction adapters choose and check the purpose folder, and four move the compaction tests to repo-relative folders and add four tests. The proof is the two test files at 26 and 19 passing tests."
trigger_phrases:
  - "compaction purpose folder plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: compaction-purpose-folder

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM) for two hook adapters and two vitest files |
| **Framework** | system-spec-kit runtime hooks, `runtime/hooks/claude/` and `runtime/hooks/pi/` |
| **Storage** | Hook state in the temp directory, read only |
| **Testing** | vitest from `.skilled/skills/system-spec-kit/node_modules`, `npm run typecheck` and `npm run build` |

### Overview
Nine literal edits change which folder the compaction recovery reads a purpose from and what it refuses. E1 to E3 add a containment check and a fallback to `session-prime.ts`. E4 and E5 add the same check to the Pi adapter. E6 to E9 move three tests to repo-relative folders and add four tests. The proof is `hook-session-start.vitest.ts` at 26 tests and `history-locator-adapters.vitest.ts` at 19, all passing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The baseline commands in section 5 print the values recorded there
- [ ] Each search text in section 4 matches exactly once in its file (`rg -c -F`, or `rg -U -c -F` where it spans lines, prints 1)
- [ ] `git status --short` lists none of the four files in section 4 before the first edit

### Definition of Done
- [ ] All REQ rows in `spec.md` have evidence in `tasks.md`
- [ ] The two test files print `(27 tests)`, `(19 tests)` and `Tests  46 passed (46)`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Check at the caller. Each adapter checks the folder it read before it calls the helper. One new exported function, no new file, option or dependency.

### Key Components
- **`buildPacketPurposeSection` in `runtime/hooks/claude/session-prime.ts`**: resolves the stored folder against the project root. After E2 it returns null when the result is not inside that root.
- **`folderNamedInBrief`, new in the same file**: returns the folder on the `Active spec folder:` line of a cached brief, or null. Without it a session whose Stop hook pinned no packet has no folder to read. It sits beside `buildPacketPurposeSection` and not inside it, because that function takes a folder and has a second caller shape in the tests.
- **The compact branch of `runSessionStartHook` in the same file**: passes `lastSpecFolder` when hook state holds one, else the folder the brief names.
- **`readPacketPurposeSection` in `runtime/hooks/pi/session-compact-context.ts`**: the same containment check. The two adapters each keep their own three lines, because the Pi adapter loads the helper from `dist/` at run time and shares no import with the Claude adapter.

### Data Flow
PreCompact caches a brief in hook state. When it detected a folder, the brief holds the line `Active spec folder: <folder>` (`compact-inject.ts:465`). After the compaction, SessionStart loads the same state. It takes `lastSpecFolder` when the Stop hook wrote one. Otherwise it reads the folder from that line. Either value goes to `buildPacketPurposeSection`, which refuses a path outside the project and hands the rest to `resolvePacketPurpose`. The section still leads the recovered context.

### The containment rule
The folder passes when `resolve(root, folder)` starts with `resolve(root)` followed by the path separator. An absolute path elsewhere fails. A relative path that climbs out with `..` fails. The project root itself fails, because it is not a packet. Nothing is opened before the check.

### Why the Stop hook is left alone
`selectDetectedSpecFolder` returns null for several packets on purpose: its result becomes `lastSpecFolder`, which is also the autosave target (`session-stop.ts:540-553`). The fallback here chooses only which purpose to show. It writes nothing to hook state.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup runs the baseline commands in section 5 and confirms each search text below matches once. Implementation applies E1 to E9 below, one per task in `tasks.md`. Verification runs the two test files, the typecheck and the build. `tasks.md` owns the order and the task state.

Apply each edit as a literal search and replace with the Edit tool. Copy the text inside the fences exactly. `S` is `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`, `PI` is `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts`, `ST` is `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` and `PT` is `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts`. Each search text was counted on 2026-11-14 at `bd79708c2f` with `rg -c -F`, or `rg -U -c -F` where it spans lines, and each printed `1`.

### E1. Import the path separator
File: `S` (line 9). Count: 1.

Search text:
```text
import { resolve } from 'node:path';
```
Replacement:
```text
import { existsSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
```

### E2. Containment, and the folder the brief names
File: `S` (lines 227 to 235). Count: 1 with `rg -U -c -F`. The doc comment above the function stays.

Search text:
```text
export function buildPacketPurposeSection(
  lastSpecFolder: string | null | undefined,
  projectRoot: string = process.cwd(),
): OutputSection | null {
  if (!lastSpecFolder) return null;
  const purpose = resolvePacketPurpose(resolve(projectRoot, lastSpecFolder));
  if (!purpose) return null;
  return { title: 'Packet Purpose', content: formatPacketPurpose(purpose, projectRoot) };
}
```
Replacement:
```text
export function buildPacketPurposeSection(
  lastSpecFolder: string | null | undefined,
  projectRoot: string = process.cwd(),
): OutputSection | null {
  if (!lastSpecFolder) return null;
  const root = resolve(projectRoot);
  let folder = resolve(root, lastSpecFolder);
  // The folder is read from a temp state file or a transcript line, so a value
  // that leaves the project is refused before any file is opened.
  if (!folder.startsWith(root + sep)) return null;
  // A detected folder can be a track folder or a packet's scratch or research
  // subfolder, so the nearest enclosing folder that holds a spec.md is the packet.
  while (!existsSync(join(folder, 'spec.md'))) {
    const parent = dirname(folder);
    if (!parent.startsWith(root + sep)) return null;
    folder = parent;
  }
  const purpose = resolvePacketPurpose(folder);
  if (!purpose) return null;
  return { title: 'Packet Purpose', content: formatPacketPurpose(purpose, root) };
}

/**
 * The folder the brief cached before the compaction named as active. A session
 * whose Stop hook saw several packets has no last folder, and this is the one
 * packet the recovery can still name. Only the header above the recent context
 * is read, because that part quotes transcript lines that could carry a
 * look-alike folder line.
 */
export function folderNamedInBrief(payload: string | null | undefined): string | null {
  const header = payload?.split(/^Recent context:/m)[0];
  return header?.match(/^\s*Active spec folder: (\S+)\s*$/m)?.[1] ?? null;
}
```

### E3. The compact branch falls back to the brief
File: `S` (line 389). Count: 1. `||` and not `??`, so an empty stored string also falls back.

Search text:
```text
      const purposeSection = buildPacketPurposeSection(stateResult.ok ? stateResult.state.lastSpecFolder : null);
```
Replacement:
```text
      const priorState = stateResult.ok ? stateResult.state : null;
      const purposeSection = buildPacketPurposeSection(
        priorState?.lastSpecFolder || folderNamedInBrief(priorState?.pendingCompactPrime?.payload),
      );
```

### E4. Pi adapter, import the path separator
File: `PI` (line 14). Count: 1.

Search text:
```text
import { join, resolve } from "node:path";
```
Replacement:
```text
import { join, resolve, sep } from "node:path";
```

### E5. Pi adapter, containment
File: `PI` (lines 79 to 80). Count: 1 with `rg -U -c -F`.

Search text:
```text
    const purpose = resolvePacketPurpose(resolve(cwd, specFolder));
    return purpose ? `## Packet Purpose\n${formatPacketPurpose(purpose, cwd)}` : null;
```
Replacement:
```text
    const root = resolve(cwd);
    const folder = resolve(root, specFolder);
    // The folder is read from a temp state file, so a value that leaves the
    // project is refused before any file is opened.
    if (!folder.startsWith(root + sep)) return null;
    const purpose = resolvePacketPurpose(folder);
    return purpose ? `## Packet Purpose\n${formatPacketPurpose(purpose, root)}` : null;
```

### E6. Claude test file, imports
File: `ST` (lines 8 and 12). Two edits in one task, each counted 1.

First search text:
```text
import { join, resolve } from 'node:path';
```
First replacement:
```text
import { join, relative, resolve } from 'node:path';
```
Second search text:
```text
import { buildHistoryLookupSection, runSessionStartHook } from '../hooks/claude/session-prime.js';
```
Second replacement:
```text
import { buildHistoryLookupSection, buildPacketPurposeSection, folderNamedInBrief, runSessionStartHook } from '../hooks/claude/session-prime.js';
import { buildMergedCompactResult } from '../hooks/claude/compact-inject.js';
```

### E7. Claude test file, the two purpose tests store a repo-relative folder
File: `ST` (lines 167, 174, 198 and 204). Four edits in one task, each counted 1. The hook takes its project root from `process.cwd()`, so the packet moves from the system temp directory to a dot-prefixed folder under the working directory, and the stored value becomes relative as in real state. Without this edit both tests would pass through the containment check for the wrong reason or fail on it.

First search text:
```text
      const packetDir = mkdtempSync(join(tmpdir(), 'session-prime-purpose-'));
```
First replacement:
```text
      const packetDir = mkdtempSync(join(process.cwd(), '.tmp-session-prime-purpose-'));
```
Second search text:
```text
          lastSpecFolder: packetDir,
```
Second replacement:
```text
          lastSpecFolder: relative(process.cwd(), packetDir),
```
Third search text:
```text
      const emptyDir = mkdtempSync(join(tmpdir(), 'session-prime-no-spec-'));
```
Third replacement:
```text
      const emptyDir = mkdtempSync(join(process.cwd(), '.tmp-session-prime-no-spec-'));
```
Fourth search text:
```text
          lastSpecFolder: emptyDir,
```
Fourth replacement:
```text
          lastSpecFolder: relative(process.cwd(), emptyDir),
```

### E8. Claude test file, four new tests
File: `ST` (lines 222 to 224). Count: 1 with `rg -U -c -F`. Each new test fails today for one reason: the first because a folder outside the project is read, the second because no fallback exists, the third because `folderNamedInBrief` does not exist and the fourth because a subfolder is not walked up to its packet and a folder line quoted under `Recent context:` is read.

Search text:
```text
        rmSync(emptyDir, { recursive: true, force: true });
      }
    });
```
Replacement:
```text
        rmSync(emptyDir, { recursive: true, force: true });
      }
    });

    it('adds no purpose section for a last spec folder outside the project', async () => {
      const outsideDir = mkdtempSync(join(tmpdir(), 'session-prime-outside-'));
      writeFileSync(join(outsideDir, 'spec.md'), '### Purpose\nA purpose from outside the project.\n');
      try {
        const now = new Date().toISOString();
        saveState(testSessionId, {
          claudeSessionId: testSessionId,
          speckitSessionId: null,
          lastSpecFolder: outsideDir,
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
        expect(output).not.toContain('A purpose from outside the project');
      } finally {
        rmSync(outsideDir, { recursive: true, force: true });
      }
    });

    it('takes the purpose from the folder the cached brief names when no last folder is pinned', async () => {
      const packetDir = mkdtempSync(join(process.cwd(), '.tmp-session-prime-brief-'));
      writeFileSync(join(packetDir, 'spec.md'), '### Purpose\nKeep the reason for the work in view.\n');
      const payload = `## Session State\nActive spec folder: ${relative(process.cwd(), packetDir)}\n\nRecent topics:\n- purpose`;
      try {
        const now = new Date().toISOString();
        saveState(testSessionId, {
          claudeSessionId: testSessionId,
          speckitSessionId: null,
          lastSpecFolder: null,
          sessionSummary: null,
          pendingCompactPrime: { payload, cachedAt: now, payloadContract: testPayloadContract(payload) },
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
      } finally {
        rmSync(packetDir, { recursive: true, force: true });
      }
    });

    it('reads the folder line the PreCompact brief writes', async () => {
      const folder = '.opencode/specs/demo/001-packet';
      const result = await buildMergedCompactResult([`Read ${folder}/spec.md during compaction`]);

      expect(folderNamedInBrief(result.text)).toBe(folder);
      expect(folderNamedInBrief('## Session State\nRecent topics:\n- purpose')).toBeNull();
    });

    it('walks up from a packet subfolder and ignores a folder line quoted under recent context', () => {
      const packetDir = mkdtempSync(join(process.cwd(), '.tmp-session-prime-walkup-'));
      writeFileSync(join(packetDir, 'spec.md'), '### Purpose\nShow the packet purpose from a subfolder.\n');
      try {
        const section = buildPacketPurposeSection(join(relative(process.cwd(), packetDir), 'scratch'));

        expect(section?.content).toBe('Purpose: Show the packet purpose from a subfolder.');
        expect(buildPacketPurposeSection('.tmp-no-such-track-folder')).toBeNull();
        expect(folderNamedInBrief('## Session State\nRecent context:\nActive spec folder: specs/evil/001-x')).toBeNull();
      } finally {
        rmSync(packetDir, { recursive: true, force: true });
      }
    });
```

### E9. Pi test file, a workspace-relative folder and one new test
File: `PT`. Five edits in one task, each counted 1. The Pi adapter takes its root from the `cwd` it is handed, which the tests set to `WORKSPACE`.

First search text (line 8):
```text
import { join } from 'node:path';
```
First replacement:
```text
import { join, relative } from 'node:path';
```
Second search text (line 135):
```text
    const packetDir = mkdtempSync(join(tmpdir(), 'pi-purpose-'));
```
Second replacement:
```text
    const packetDir = mkdtempSync(join(WORKSPACE, 'pi-purpose-'));
```
Third search text (line 145):
```text
    writeFileSync(statePath, JSON.stringify({ lastSpecFolder: packetDir }));
```
Third replacement:
```text
    writeFileSync(statePath, JSON.stringify({ lastSpecFolder: relative(WORKSPACE, packetDir) }));
```
Fourth search text (line 156):
```text
      expect(messages[0].content).toContain(`## Active Spec Folder\n${packetDir}`);
```
Fourth replacement:
```text
      expect(messages[0].content).toContain(`## Active Spec Folder\n${relative(WORKSPACE, packetDir)}`);
```
Fifth search text (lines 159 to 161), counted 1 with `rg -U -c -F`. It is the end of the existing purpose test, and the new test follows it:
```text
      rmSync(packetDir, { recursive: true, force: true });
    }
  });
```
Fifth replacement:
```text
      rmSync(packetDir, { recursive: true, force: true });
    }
  });

  it('adds no packet purpose for a last spec folder outside the workspace', async () => {
    const sessionId = uniqueSession('pi-purpose-outside');
    const outsideDir = mkdtempSync(join(tmpdir(), 'pi-purpose-outside-'));
    writeFileSync(join(outsideDir, 'spec.md'), '### Purpose\nA purpose from outside the workspace.\n');
    const stateDir = join(
      tmpdir(),
      'speckit-claude-hooks',
      createHash('sha256').update(WORKSPACE).digest('hex').slice(0, 12),
    );
    const statePath = join(stateDir, `${createHash('sha256').update(sessionId).digest('hex').slice(0, 16)}.json`);
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(statePath, JSON.stringify({ lastSpecFolder: outsideDir }));
    try {
      const { pi, handlers, messages } = createPi();
      sessionCompactContext(pi as never);
      await handlers.get('session_compact')!(
        { compactionEntry: { summary: 'Pi summary' } },
        { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
      );

      expect(messages).toHaveLength(1);
      expect(messages[0].content).not.toContain('## Packet Purpose');
      expect(messages[0].content).toContain(`## Active Spec Folder\n${outsideDir}`);
    } finally {
      rmSync(statePath, { force: true });
      rmSync(outsideDir, { recursive: true, force: true });
    }
  });
```

None of these edits was applied or run at planning time. This session could not start `node`. One point rests on reading alone and a test decides it: that the rendered brief keeps `Active spec folder:` on a line of its own. `WORKSPACE` in the Pi test file is a folder made inside the system temp directory (`tests/_support/history-fixtures.ts:20`), so a second temp folder beside it is outside it.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run each command below before E1 and again after E9. Commands marked `(runtime)` run from `.skilled/skills/system-spec-kit/runtime`, all others from the worktree root.

| Command | Baseline | After the edits |
|---------|----------|-----------------|
| `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts` | `(23 tests)`, `(18 tests)`, `Tests  41 passed (41)`. The 23 is phase 006's recorded baseline. The 18 is a count of `it(` lines in the file, not a run | `(27 tests)`, `(19 tests)`, `Tests  46 passed (46)`, exit 0 |
| `(runtime) npm run typecheck` | exit 0, no diagnostics | unchanged |
| `(runtime) ../node_modules/.bin/eslint hooks/claude/session-prime.ts hooks/pi/session-compact-context.ts tests/hook-session-start.vitest.ts tests/history-locator-adapters.vitest.ts` | exit 0, no output | unchanged |
| The first Measured Behavior command in `spec.md` | two lines | no line |
| The third Measured Behavior command in `spec.md` | three lines | no line |
| `(runtime) npm run build` | exit 0 | exit 0, and `rg -c 'folderNamedInBrief' dist/hooks/claude/session-prime.js` prints `2` |

A baseline that prints something other than the value in this table stops the phase before E1. Report the difference and do not edit.

The Claude tests make their packet folders under the runtime folder with the `.tmp-session-prime-` prefix, because the hook takes its project root from the working directory. That prefix is not git-ignored on purpose. Each test removes its folder in `finally`, and a crashed run that leaves one behind makes T015 and T018 fail, which is the signal to clean it up rather than hide it.

What no check proves: that a real compaction in a session with no pinned folder now opens with a purpose. That needs a real compaction in an operator session, after phase 006 is built.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`node`, `npm` for the runtime build and typecheck, and `rg`. No new package.

Claude, Codex, Cursor and DSH run `dist/hooks/claude/session-prime.js`, and the Pi adapter loads `dist/lib/spec/packet-purpose.js`, so `npm run build` is part of the change. Phase 006 edit E11 gives the fallback a folder line for packets under `specs/`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: any of the 46 tests fails after the edits, or a real compaction in a pinned session loses its purpose line. Before commit, run `git checkout -- <file>` for the four files in section 4 and `npm run build` in the runtime folder. After commit, revert that one commit and rebuild.
<!-- /ANCHOR:rollback -->

---
