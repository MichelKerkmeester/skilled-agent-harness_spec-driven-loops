---
title: "Implementation Plan: Phase 12: purpose-reader-precision"
description: "Twenty-four literal search-and-replace edits in 26 files. They fix the purpose reader at the source, share one folder resolver between the two compaction hooks, align four hop rules and pin each change with a test. The proof is a probe over every live spec.md and five test suites at fixed counts."
trigger_phrases:
  - "purpose reader precision plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: purpose-reader-precision

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM) for the reader, two hooks and four vitest files. CommonJS for the nudge and its `node:test` file. Markdown and YAML for three command docs |
| **Framework** | system-spec-kit runtime library and hooks, the session-relaunch hook, the speckit commands |
| **Storage** | None |
| **Testing** | vitest from `.skilled/skills/system-spec-kit/node_modules`, `node --test`, `npm run typecheck`, `npm run build`, eslint and the probe in `scratch/` |

### Overview
Twenty-four edits, E1 to E24, each a literal search and replace. E1 to E7 fix the reader, E8 to E13 change the hooks and the folder detector, E14 to E17 add and move tests, E18 to E22 align the hop rules and the library README, and E23 and E24 close the doc state of phases 006 to 011. The proof is the probe pair in `spec.md`, the four purpose suites at 14, 29, 19 and 20 tests and the relaunch suite at 1028 passes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The operator has answered the four defaults in `spec.md` section 10, or let them stand
- [ ] Each search text in section 4 matches the count this plan states (`rg -c -F`, or `rg -U -c -F` where it spans lines)
- [ ] Every baseline in section 5 prints its value

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] The four purpose suites print `(14 tests)`, `(29 tests)`, `(19 tests)` and `(20 tests)`, all passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Fix at source. The reader decides what is a purpose. The hooks print what it returns, and the hop rules describe the same decision in words.

### Key Components
- **`packet-purpose.ts`**: owns the decision. It gains a combined-heading test, a second layout sentence, a short-lead join, bold and control stripping, a surrogate-safe cut and the new `enclosingPacketFolder`. That export exists because the Pi hook has no walk-up today and the Claude hook keeps its own copy, so the two drift.
- **`session-prime.ts` and `session-compact-context.ts`**: the two compaction hooks. Both resolve the folder through `enclosingPacketFolder`. The Claude hook takes a project root and reads the brief's folder only after it accepted the brief.
- **`nudge.cjs`, `handoff.md`, both resume assets**: the four places a model reads the rule. Each states the same shapes.

### Data Flow
A hook reads the recorded folder, resolves it to the nearest packet inside the root and asks `resolvePacketPurpose`. The reader reads the packet's own problem first, then its purpose. A purpose comes from `### Purpose`, a labelled paragraph, or the opening paragraph of a `## PURPOSE` or `## ROOT PURPOSE` section. Without one it walks up the phase parents and then reads `goal.md`. The problem goes beside the purpose: the packet's own when it states one, else the parent's that supplied the purpose.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/spec/packet-purpose.ts` | Producer of every purpose and problem line | update | `packet-purpose.vitest.ts` at 14 tests and the probe |
| `runtime/hooks/claude/session-prime.ts` | Claude, Codex, Cursor and DSH compaction recovery | update | `hook-session-start.vitest.ts` at 29 tests |
| `runtime/hooks/pi/session-compact-context.ts` | Pi compaction recovery | update | `history-locator-adapters.vitest.ts` at 20 tests |
| `runtime/hooks/claude/compact-inject.ts` | Writes the brief's `Active spec folder` line | update | `hook-precompact.vitest.ts` at 19 tests |
| `runtime/cli/core/workflow.ts` | Stores `formatPacketPurpose` output as `packet_purpose` | unchanged, consumer | The continuity suites keep their counts. Its stored text changes for the 211 packets, which is the fix |
| `runtime/api/index.ts` | Re-exports the reader | unchanged | `git status --short` does not list it |
| `nudge.cjs`, `handoff.md`, both resume assets | State the rule to a model | update | `nudge.test.cjs` and `test-phase-command-workflows.js` |
| Devin `post-compaction.cjs`, OpenCode hooks | Print no purpose | not a consumer | Deferred by the parent's D6 |

Same-class producers: `rg -n "Keep parent documentation lean" --hidden --glob '!specs/**' --glob '!.git/**' .` lists exactly the seven files E1, E18 to E21 and the two test files touch.
Consumers of changed symbols: `rg -n 'resolvePacketPurpose|formatPacketProblem|enclosingPacketFolder' .skilled --glob '*.ts' --glob '*.md'` lists the reader, two hooks, `workflow.ts`, `api/index.ts`, three tests and three READMEs.
Matrix axes: purpose source (subheading, label, purpose-only section, combined section, none) by ancestor (has purpose, none) by `goal.md` (present, absent). The new and changed tests cover combined with ancestor, combined alone, layout with goal and label with combined.
Algorithm invariant: a returned purpose is never text the packet wrote under a problem label or a layout sentence, and no path outside the root is read. Adversarial cases are in E14: a path outside the root, a track folder with no `spec.md`, a control character and a surrogate pair at the cut.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup captures the baselines in section 5 and counts every search text below. Implementation applies E1 to E24, one task each in `tasks.md`. Verification builds, reruns every suite and the probe, and lints. `tasks.md` owns the order and the task state.

Apply each edit with the Edit tool as a literal search and replace. Copy the text inside the fences exactly. `RT` is `.skilled/skills/system-spec-kit/runtime`. `P` is `$RT/lib/spec/packet-purpose.ts`, `S` is `$RT/hooks/claude/session-prime.ts`, `PI` is `$RT/hooks/pi/session-compact-context.ts`, `CI` is `$RT/hooks/claude/compact-inject.ts`, `T` is `$RT/tests/packet-purpose.vitest.ts`, `ST` is `$RT/tests/hook-session-start.vitest.ts`, `PCT` is `$RT/tests/hook-precompact.vitest.ts`, `PT` is `$RT/tests/history-locator-adapters.vitest.ts`, `N` is `.skilled/hooks/session-relaunch/lib/nudge.cjs`, `NT` is `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` and `H` is `.skilled/commands/speckit/handoff.md`.

Every count below was taken on 2026-11-14 at `1bedb33577` and prints 1 unless the edit says otherwise.

### E1. Two layout sentences (A2)
File: `P`. Search text:
```text
// The phase-parent scaffold has written this sentence, in two wordings, in
// place of a purpose. It describes the document layout, not the work, so it
// never counts as one.
const SCAFFOLD_PARENT_PURPOSE = /^Keep parent documentation lean while child phases own detailed plans\b/;
```
Replacement:
```text
// Phase-parent scaffolds have written these layout sentences in place of a
// purpose. They describe the document layout, not the work, so neither counts
// as one.
const SCAFFOLD_PARENT_PURPOSE = /^(?:Keep parent documentation lean while child phases own detailed plans|This phase groups the related child phases below so parent-level context stays a short thematic map)\b/;
```

### E2. Two constants (A1, A9)
File: `P`. Search text:
```text
const PURPOSE_SECTION_HEADING = /^##\s+(?:\d+\.\s+)?(?:PROBLEM\s+(?:&|AND)\s+PURPOSE|ROOT\s+PURPOSE|PURPOSE)\s*$/i;
```
Replacement:
```text
const PURPOSE_SECTION_HEADING = /^##\s+(?:\d+\.\s+)?(?:PROBLEM\s+(?:&|AND)\s+PURPOSE|ROOT\s+PURPOSE|PURPOSE)\s*$/i;
// In a combined section the opening paragraph states the problem, not the purpose.
const COMBINED_SECTION_HEADING = /^##\s+(?:\d+\.\s+)?PROBLEM\s+(?:&|AND)\s+PURPOSE\s*$/i;
// A lead-in this short, such as "Measure it.", says nothing alone, so the next sentence joins it.
const MAX_LEAD_IN_WORDS = 3;
```

### E3. No purpose from a combined section's opening paragraph (A1)
File: `P`. Two edits. First search text:
```text
 * `Purpose:` when there is one, else the section's first paragraph.
```
First replacement:
```text
 * `Purpose:` when there is one, else the first paragraph of a `## PURPOSE` or
 * `## ROOT PURPOSE` section. A combined problem and purpose section states its
 * problem first, so without a label it yields no purpose.
```
Second search text:
```text
  if (labelled >= 0) return paragraphAfter(lines, labelled - 1).replace(PURPOSE_LABEL, '');
  return paragraphAfter(lines, section);
}
```
Second replacement:
```text
  if (labelled >= 0) return paragraphAfter(lines, labelled - 1).replace(PURPOSE_LABEL, '');
  if (COMBINED_SECTION_HEADING.test(trimmed[section])) return '';
  return paragraphAfter(lines, section);
}
```

### E4. Clean authored text (A9, A10, A11)
File: `P`. Three edits. First search text:
```text
 * The first sentence of authored text, or null for a template token, a
 * bracketed prompt, UNKNOWN or the scaffold's layout sentence.
```
First replacement:
```text
 * The first sentence of authored text, joined to the next one when it is a
 * lead-in of three words or fewer, or null for a template token, a bracketed
 * prompt, UNKNOWN or a scaffold layout sentence. Bold markers and control
 * characters are dropped, because the line is printed as plain text.
```
Second search text:
```text
  const text = raw.replace(/<!--[\s\S]*?-->/g, ' ').replace(/\s+/g, ' ').trim().replace(LIST_MARKER, '');
```
Second replacement:
```text
  const text = raw
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(LIST_MARKER, '');
```
Third search text, with `rg -U -c -F`:
```text
  const sentence = text.match(SENTENCE_END)?.[0] ?? text;
  return sentence.length <= MAX_PURPOSE_CHARS
    ? sentence
    : `${sentence.slice(0, MAX_PURPOSE_CHARS - 3).trimEnd()}...`;
```
Third replacement:
```text
  const first = text.match(SENTENCE_END)?.[0] ?? text;
  const rest = text.slice(first.length).trim();
  const sentence = first.split(' ').length <= MAX_LEAD_IN_WORDS && rest
    ? `${first} ${rest.match(SENTENCE_END)?.[0] ?? rest}`
    : first;
  if (sentence.length <= MAX_PURPOSE_CHARS) return sentence;
  // The cut counts UTF-16 units, so a cut inside a surrogate pair drops the
  // lone high half instead of printing a broken character.
  const cut = sentence.slice(0, MAX_PURPOSE_CHARS - 3).replace(/[\uD800-\uDBFF]$/, '');
  return `${cut.trimEnd()}...`;
```

### E5. The problem from a combined section (A1)
File: `P`. Search text, with `rg -U -c -F`:
```text
/** The first sentence under `### Problem Statement`: what is broken, and for whom. */
function problemIn(folder: string): string | null {
  const markdown = readTextFile(path.join(folder, 'spec.md'));
  if (markdown === null) return null;
  const lines = markdown.split(/\r?\n/);
  const heading = lines.findIndex((line) => /^###\s+Problem Statement\s*$/.test(line.trim()));
  return heading < 0 ? null : authoredSentence(paragraphAfter(lines, heading));
}
```
Replacement:
```text
/**
 * The first sentence under `### Problem Statement`: what is broken, and for
 * whom. Without that heading it is the opening paragraph of a combined problem
 * and purpose section, unless that paragraph is the labelled purpose.
 */
function problemIn(folder: string): string | null {
  const markdown = readTextFile(path.join(folder, 'spec.md'));
  if (markdown === null) return null;
  const lines = markdown.split(/\r?\n/);
  const trimmed = lines.map((line) => line.trim());
  const heading = trimmed.findIndex((line) => /^###\s+Problem Statement\s*$/.test(line));
  if (heading >= 0) return authoredSentence(paragraphAfter(lines, heading));
  const combined = trimmed.findIndex((line) => COMBINED_SECTION_HEADING.test(line));
  if (combined < 0) return null;
  const opening = paragraphAfter(lines, combined);
  return PURPOSE_LABEL.test(opening) ? null : authoredSentence(opening);
}
```

### E6. The packet's own problem travels with any purpose (A1)
File: `P`. Five edits. First search text:
```text
  /** The first sentence of that folder's `### Problem Statement`, or null when it states none. */
```
First replacement:
```text
  /** The packet's own problem sentence, else the parent's that supplied the purpose, or null. */
```
Second search text:
```text
 * packet's goal.md Objective. Returns null when nothing authored exists or a
 * read fails.
```
Second replacement:
```text
 * packet's goal.md Objective. The problem is the packet's own when it states
 * one, else the parent's that supplied the purpose. Returns null when no
 * purpose is authored or a read fails.
```
Third search text:
```text
    const own = purposeIn(folder);
    if (own) return { text: own, source: 'packet', folder, problem: problemIn(folder) };
```
Third replacement:
```text
    const ownProblem = problemIn(folder);
    const own = purposeIn(folder);
    if (own) return { text: own, source: 'packet', folder, problem: ownProblem };
```
Fourth search text:
```text
      if (inherited) return { text: inherited, source: 'ancestor', folder: parent, problem: problemIn(parent) };
```
Fourth replacement:
```text
      if (inherited) return { text: inherited, source: 'ancestor', folder: parent, problem: ownProblem ?? problemIn(parent) };
```
Fifth search text:
```text
    return objective ? { text: objective, source: 'goal', folder, problem: null } : null;
```
Fifth replacement:
```text
    return objective ? { text: objective, source: 'goal', folder, problem: ownProblem } : null;
```

### E7. One folder resolver for both hooks (A4)
File: `P`. Search text, the last three lines of the file:
```text
export function formatPacketProblem(purpose: PacketPurpose): string | null {
  return purpose.problem ? `Problem: ${purpose.problem}` : null;
}
```
Replacement:
```text
export function formatPacketProblem(purpose: PacketPurpose): string | null {
  return purpose.problem ? `Problem: ${purpose.problem}` : null;
}

/**
 * The nearest folder at or below `projectRoot`, starting at `folder`, that
 * holds a spec.md. A recorded folder can be a track folder or a packet's
 * scratch or research subfolder, and only the packet carries the purpose. A
 * value that leaves the project is refused before any file is opened.
 */
export function enclosingPacketFolder(folder: string, projectRoot: string): string | null {
  const root = path.resolve(projectRoot);
  let current = path.resolve(root, folder);
  if (!current.startsWith(root + path.sep)) return null;
  while (!fs.existsSync(path.join(current, 'spec.md'))) {
    const parent = path.dirname(current);
    if (!parent.startsWith(root + path.sep)) return null;
    current = parent;
  }
  return current;
}
```

### E8. Claude hook imports (A4)
File: `S`. Two edits. First search text, lines 9 and 10, with `rg -U -c -F`:
```text
import { existsSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
```
First replacement. `existsSync`, `dirname` and `sep` are used only in the block E10 removes:
```text
import { join, resolve } from 'node:path';
```
Second search text:
```text
import { formatPacketProblem, formatPacketPurpose, resolvePacketPurpose } from '../../lib/spec/packet-purpose.js';
```
Second replacement:
```text
import { enclosingPacketFolder, formatPacketProblem, formatPacketPurpose, resolvePacketPurpose } from '../../lib/spec/packet-purpose.js';
```

### E9. Name the accepted-brief section (A6)
File: `S`. Two edits. First search text:
```text
const CACHE_TTL_MS = 30 * 60 * 1000;
```
First replacement:
```text
const CACHE_TTL_MS = 30 * 60 * 1000;
// The title of the section that carries a cached brief the hook accepted.
const RECOVERED_CONTEXT_TITLE = 'Recovered Context (Post-Compaction)';
```
Second search text:
```text
    { title: 'Recovered Context (Post-Compaction)', content: wrappedPayload },
```
Second replacement:
```text
    { title: RECOVERED_CONTEXT_TITLE, content: wrappedPayload },
```

### E10. Claude hook uses the shared resolver (A4)
File: `S`. Search text, with `rg -U -c -F`:
```text
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
```
Replacement:
```text
  if (!lastSpecFolder) return null;
  const root = resolve(projectRoot);
  // The folder is read from a temp state file or a transcript line, and can be
  // a track folder or a packet subfolder. The resolver keeps it in the project.
  const folder = enclosingPacketFolder(lastSpecFolder, root);
  if (!folder) return null;
  const purpose = resolvePacketPurpose(folder);
```

### E11. A project root and an accepted brief only (A6, A8)
File: `S`. Two edits, each with `rg -U -c -F`. First search text:
```text
export async function runSessionStartHook(
  input: HookInput,
  writeOutput: (output: string) => Promise<void> = writeHookOutput,
): Promise<void> {
```
First replacement:
```text
export async function runSessionStartHook(
  input: HookInput,
  writeOutput: (output: string) => Promise<void> = writeHookOutput,
  projectRoot: string = process.cwd(),
): Promise<void> {
```
Second search text:
```text
      const purposeSection = buildPacketPurposeSection(
        priorState?.lastSpecFolder || folderNamedInBrief(priorState?.pendingCompactPrime?.payload),
      );
      sections = await handleCompact(sessionId);
      if (purposeSection) sections.unshift(purposeSection);
```
Second replacement:
```text
      sections = await handleCompact(sessionId);
      // A stale or quarantined brief must not choose which spec.md is read, so
      // the folder it names counts only when handleCompact injected that brief.
      const briefAccepted = sections[0]?.title === RECOVERED_CONTEXT_TITLE;
      const purposeSection = buildPacketPurposeSection(
        priorState?.lastSpecFolder
          || (briefAccepted ? folderNamedInBrief(priorState?.pendingCompactPrime?.payload) : null),
        projectRoot,
      );
      if (purposeSection) sections.unshift(purposeSection);
```

### E12. Pi hook: shared resolver, real type, logged failure (A4, A5)
File: `PI`. Three edits. First search text:
```text
import { join, resolve, sep } from "node:path";
```
First replacement. `sep` is used only in the block the second edit removes:
```text
import { join, resolve } from "node:path";
```
Second search text, lines 72 to 85, with `rg -U -c -F`:
```text
    type PacketPurpose = { text: string; source: "packet" | "ancestor" | "goal"; folder: string; problem: string | null };
    const { formatPacketProblem, formatPacketPurpose, resolvePacketPurpose } = await import(
      "../../dist/lib/spec/packet-purpose.js"
    ) as {
      resolvePacketPurpose: (specFolderAbsPath: string) => PacketPurpose | null;
      formatPacketPurpose: (purpose: PacketPurpose, projectRoot: string) => string;
      formatPacketProblem: (purpose: PacketPurpose) => string | null;
    };
    const root = resolve(cwd);
    const folder = resolve(root, specFolder);
    // The folder is read from a temp state file, so a value that leaves the
    // project is refused before any file is opened.
    if (!folder.startsWith(root + sep)) return null;
    const purpose = resolvePacketPurpose(folder);
```
Second replacement. The type comes from the source module the build compiles, so it cannot drift from the helper. The file already imports `.ts` paths, as at line 20:
```text
    type PacketPurposeModule = typeof import("../../lib/spec/packet-purpose.ts");
    const { enclosingPacketFolder, formatPacketProblem, formatPacketPurpose, resolvePacketPurpose } = await import(
      "../../dist/lib/spec/packet-purpose.js"
    ) as PacketPurposeModule;
    const root = resolve(cwd);
    // The folder is read from a temp state file, and can be a track folder or a
    // packet subfolder. The resolver keeps it in the project, as on Claude.
    const folder = enclosingPacketFolder(specFolder, root);
    if (!folder) return null;
    const purpose = resolvePacketPurpose(folder);
```
Third search text, with `rg -U -c -F`:
```text
    return `## Packet Purpose\n${problem ? `${line}\n${problem}` : line}`;
  } catch {
    return null;
  }
}
```
Third replacement:
```text
    return `## Packet Purpose\n${problem ? `${line}\n${problem}` : line}`;
  } catch (error) {
    // A stale or missing build drops the purpose, so say so on stderr rather
    // than lose it silently. The recovery itself still goes ahead.
    process.stderr.write(`WARN [speckit-hook:session-compact-context] packet purpose unavailable: ${String(error)}\n`);
    return null;
  }
}
```

### E13. A line suffix is not a folder (A7)
File: `CI` (line 337). Search text:
```text
        const candidate = m.replace(/[),.;:!?]+$/u, '');
```
Replacement:
```text
        // A `:12` or `:12:3` line suffix names a place in the file, not another folder.
        const candidate = m.replace(/[),.;:!?]+$/u, '').replace(/(?::\d+){1,2}$/u, '');
```

### E14. Reader tests (A1, A2, A4, A9, A10, A11)
File: `T`. Six edits. First search text:
```text
import { resolvePacketPurpose } from '../lib/spec/packet-purpose.js';
```
First replacement:
```text
import { enclosingPacketFolder, resolvePacketPurpose } from '../lib/spec/packet-purpose.js';
```
Second search text, with `rg -U -c -F`:
```text
const numbered = packet(
  'specs/demo/014-numbered',
  '1. Measure the archive size (e.g. with du) before the cut. Then cut.',
);
```
Second replacement:
```text
const numbered = packet(
  'specs/demo/014-numbered',
  '1. Measure the archive size (e.g. with du) before the cut. Then cut.',
);
const combinedChild = rawPacket(
  'specs/demo/001-parent/015-combined-child',
  '# Spec\n\n## 2. PROBLEM & PURPOSE\n\nThe child archive never shrinks.\n\n## 3. SCOPE\n',
);
const groupsScaffold = packet(
  'specs/demo/016-groups-scaffold',
  'This phase groups the related child phases below so parent-level context stays a short thematic map. Each child owns its own scope.',
  'Ship the grouped packet goal.',
);
const leadIn = rawPacket(
  'specs/demo/017-lead-in',
  '# Spec\n\n### Problem Statement\n**10. The entry module mixes concerns** (item 10). More.\n\n### Purpose\nMeasure it. Record the gate baselines first. Then cut.\n',
);
const controlAndCut = rawPacket(
  'specs/demo/018-control-and-cut',
  `# Spec\n\n### Problem Statement\nThe bell\u0007 rings.\n\n### Purpose\n${'x'.repeat(296)}\u{1F600}${'y'.repeat(10)}.\n`,
);
```
Third search text, with `rg -U -c -F`. The packet's own `A problem.` now goes beside a goal objective:
```text
      source: 'goal',
      folder: scaffolded,
      problem: null,
    });
```
Third replacement:
```text
      source: 'goal',
      folder: scaffolded,
      problem: 'A problem.',
    });
```
Fourth search text, with `rg -U -c -F`. The test pinned the defect:
```text
  it('reads the first paragraph under a combined problem and purpose heading', () => {
    expect(resolvePacketPurpose(combinedHeading)).toEqual({
      text: 'The archive never shrinks, so the disk fills.',
      source: 'packet',
      folder: combinedHeading,
      problem: null,
    });
  });
```
Fourth replacement:
```text
  it('reads no purpose from the opening paragraph of a combined problem and purpose heading', () => {
    expect(resolvePacketPurpose(combinedHeading)).toBeNull();
  });
```
Fifth search text:
```text
    expect(resolvePacketPurpose(labelled)?.text).toBe('keep three archives and delete the rest.');
```
Fifth replacement:
```text
    expect(resolvePacketPurpose(labelled)).toMatchObject({
      text: 'keep three archives and delete the rest.',
      problem: 'The archive never shrinks.',
    });
```
Sixth search text, the last three lines of the file, with `rg -U -c -F`:
```text
    expect(resolvePacketPurpose(numbered)?.text).toBe('Measure the archive size (e.g. with du) before the cut.');
  });
});
```
Sixth replacement:
```text
    expect(resolvePacketPurpose(numbered)?.text).toBe('Measure the archive size (e.g. with du) before the cut.');
  });

  it('keeps a combined heading opening paragraph as the problem beside an inherited purpose', () => {
    expect(resolvePacketPurpose(combinedChild)).toEqual({
      text: 'Keep the parent outcome in view.',
      source: 'ancestor',
      folder: parent,
      problem: 'The child archive never shrinks.',
    });
  });

  it('skips the phase-group layout sentence and keeps the packet problem beside the goal objective', () => {
    expect(resolvePacketPurpose(groupsScaffold)).toEqual({
      text: 'Ship the grouped packet goal.',
      source: 'goal',
      folder: groupsScaffold,
      problem: 'A problem.',
    });
  });

  it('joins a short lead-in to the next sentence and drops bold markers', () => {
    expect(resolvePacketPurpose(leadIn)).toMatchObject({
      text: 'Measure it. Record the gate baselines first.',
      problem: 'The entry module mixes concerns (item 10).',
    });
  });

  it('drops control characters and never splits a surrogate pair at the cut', () => {
    expect(resolvePacketPurpose(controlAndCut)).toMatchObject({
      text: `${'x'.repeat(296)}...`,
      problem: 'The bell rings.',
    });
  });

  it('finds the enclosing packet folder inside the project only', () => {
    expect(enclosingPacketFolder(join(parent, 'scratch', 'notes'), ROOT)).toBe(parent);
    expect(enclosingPacketFolder('specs/demo', ROOT)).toBeNull();
    expect(enclosingPacketFolder(tmpdir(), ROOT)).toBeNull();
  });
});
```

### E15. Session-start tests in the temp checkout, and a stale brief (A6, A8)
File: `ST`. `WORKSPACE` is the temp checkout `checkoutRoot()` already makes at line 52. Eleven edits. Edits one to five each change one line, each counted 1:

| Search text | Replacement |
|-------------|-------------|
| `      const packetDir = mkdtempSync(join(process.cwd(), '.tmp-session-prime-purpose-'));` | `      const packetDir = mkdtempSync(join(WORKSPACE, 'session-prime-purpose-'));` |
| `      const emptyDir = mkdtempSync(join(process.cwd(), '.tmp-session-prime-no-spec-'));` | `      const emptyDir = mkdtempSync(join(WORKSPACE, 'session-prime-no-spec-'));` |
| `      const packetDir = mkdtempSync(join(process.cwd(), '.tmp-session-prime-brief-'));` | `      const packetDir = mkdtempSync(join(WORKSPACE, 'session-prime-brief-'));` |
| `      const packetDir = mkdtempSync(join(process.cwd(), '.tmp-session-prime-problem-'));` | `      const packetDir = mkdtempSync(join(WORKSPACE, 'session-prime-problem-'));` |
| `      const packetDir = mkdtempSync(join(process.cwd(), '.tmp-session-prime-walkup-'));` | `      const packetDir = mkdtempSync(join(WORKSPACE, 'session-prime-walkup-'));` |

Edit six. Search text, counted 2, replace both with `replace_all`:
```text
          lastSpecFolder: relative(process.cwd(), packetDir),
```
Replacement:
```text
          lastSpecFolder: relative(WORKSPACE, packetDir),
```
Edit seven. Search text:
```text
          lastSpecFolder: relative(process.cwd(), emptyDir),
```
Replacement:
```text
          lastSpecFolder: relative(WORKSPACE, emptyDir),
```
Edit eight. Search text:
```text
      const payload = `## Session State\nActive spec folder: ${relative(process.cwd(), packetDir)}\n\nRecent topics:\n- purpose`;
```
Replacement:
```text
      const payload = `## Session State\nActive spec folder: ${relative(WORKSPACE, packetDir)}\n\nRecent topics:\n- purpose`;
```
Edit nine. Search text, counted 6 with `rg -U -c -F`, replace all six with `replace_all`. Passing the root to the two tests that do not need it is harmless: one names a folder outside it and one has already moved into it:
```text
        await runSessionStartHook(
          { source: 'compact', session_id: testSessionId },
          async (text) => { output = text; },
        );
```
Replacement:
```text
        await runSessionStartHook(
          { source: 'compact', session_id: testSessionId },
          async (text) => { output = text; },
          WORKSPACE,
        );
```
Edit ten. Two lines in the walk-up test, each counted 1:

| Search text | Replacement |
|-------------|-------------|
| `        const section = buildPacketPurposeSection(join(relative(process.cwd(), packetDir), 'scratch'));` | `        const section = buildPacketPurposeSection(join(relative(WORKSPACE, packetDir), 'scratch'), WORKSPACE);` |
| `        expect(buildPacketPurposeSection('.tmp-no-such-track-folder')).toBeNull();` | `        expect(buildPacketPurposeSection('no-such-track-folder', WORKSPACE)).toBeNull();` |

Edit eleven, a new test that fails today because the purpose is read before the brief is judged. Search text:
```text
    it('reads the folder line the PreCompact brief writes', async () => {
```
Replacement:
```text
    it('takes no purpose from the folder a stale brief names', async () => {
      const packetDir = mkdtempSync(join(WORKSPACE, 'session-prime-stale-brief-'));
      writeFileSync(join(packetDir, 'spec.md'), '### Purpose\nA purpose a stale brief points at.\n');
      const payload = `## Session State\nActive spec folder: ${relative(WORKSPACE, packetDir)}\n\nRecent topics:\n- purpose`;
      try {
        const now = new Date().toISOString();
        saveState(testSessionId, {
          claudeSessionId: testSessionId,
          speckitSessionId: null,
          lastSpecFolder: null,
          sessionSummary: null,
          pendingCompactPrime: { payload, cachedAt: '2020-01-01T00:00:00.000Z', payloadContract: testPayloadContract(payload) },
          producerMetadata: null,
          metrics: { estimatedPromptTokens: 0, estimatedCompletionTokens: 0, lastTranscriptOffset: 0 },
          createdAt: now,
          updatedAt: now,
        });

        let output = '';
        await runSessionStartHook(
          { source: 'compact', session_id: testSessionId },
          async (text) => { output = text; },
          WORKSPACE,
        );

        expect(output).not.toContain('A purpose a stale brief points at');
        expect(output.startsWith('## Context Recovery\n')).toBe(true);
      } finally {
        rmSync(packetDir, { recursive: true, force: true });
      }
    });

    it('reads the folder line the PreCompact brief writes', async () => {
```

### E16. Line-suffix test (A7)
File: `PCT`. Search text:
```text
    it('detects a spec folder under a top-level specs directory and names it in the brief', async () => {
```
Replacement:
```text
    it('counts a path with a line suffix toward its folder', () => {
      expect(detectSpecFolder([
        'Read specs/a/001-x/spec.md:12',
        'Edit specs/a/001-x/spec.md:40:3',
        'Read specs/b/002-y/plan.md',
      ])).toBe('specs/a/001-x');
    });

    it('detects a spec folder under a top-level specs directory and names it in the brief', async () => {
```

### E17. Pi walk-up test (A4)
File: `PT`. The test fails today because the Pi hook reads `scratch/spec.md`, which does not exist. Search text:
```text
  it('adds no packet purpose for a last spec folder outside the workspace', async () => {
```
Replacement:
```text
  it('walks up from a packet subfolder to the packet purpose', async () => {
    const sessionId = uniqueSession('pi-purpose-walkup');
    const packetDir = mkdtempSync(join(WORKSPACE, 'pi-purpose-walkup-'));
    writeFileSync(join(packetDir, 'spec.md'), '### Purpose\nShow the packet purpose from a subfolder.\n');
    const stateDir = join(
      tmpdir(),
      'speckit-claude-hooks',
      createHash('sha256').update(WORKSPACE).digest('hex').slice(0, 12),
    );
    const statePath = join(stateDir, `${createHash('sha256').update(sessionId).digest('hex').slice(0, 16)}.json`);
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(statePath, JSON.stringify({ lastSpecFolder: join(relative(WORKSPACE, packetDir), 'scratch') }));
    try {
      const { pi, handlers, messages } = createPi();
      sessionCompactContext(pi as never);
      await handlers.get('session_compact')!(
        { compactionEntry: { summary: 'Pi summary' } },
        { cwd: WORKSPACE, sessionManager: { getSessionId: () => sessionId } },
      );

      expect(messages[0].content).toContain('## Packet Purpose\nPurpose: Show the packet purpose from a subfolder.');
    } finally {
      rmSync(statePath, { force: true });
      rmSync(packetDir, { recursive: true, force: true });
    }
  });

  it('adds no packet purpose for a last spec folder outside the workspace', async () => {
```

### E18. Nudge rule (A2, A3)
File: `N`, lines 26 to 30. Search text, with `rg -U -c -F`:
```text
  + 'its spec.md, copied word for word and cut to 300 characters. Read it under ### Purpose, or '
  + 'without that heading in the paragraph that opens with Purpose: inside the ## PROBLEM & '
  + 'PURPOSE section, or else that section\'s opening paragraph. When it is empty, a template '
  + 'placeholder or the scaffold sentence that begins Keep parent documentation lean, use the '
  + 'nearest phase parent that has one and write `Parent purpose (<parent folder>): <sentence>`. '
```
Replacement:
```text
  + 'its spec.md, copied word for word and cut to 300 characters. Read it under ### Purpose, or '
  + 'without that heading in the paragraph that opens with Purpose: inside the ## PROBLEM & '
  + 'PURPOSE, ## PURPOSE or ## ROOT PURPOSE section, or else the opening paragraph of a '
  + '## PURPOSE or ## ROOT PURPOSE section. The opening paragraph of a ## PROBLEM & PURPOSE '
  + 'section states the problem, so it is never the purpose. When the text is empty, UNKNOWN, a '
  + 'template placeholder or a scaffold sentence that begins Keep parent documentation lean or '
  + 'This phase groups the related child phases below, use the nearest phase parent that has one '
  + 'and write `Parent purpose (<repo-relative parent folder>): <sentence>`. '
```

### E19. Nudge assertions (A3)
File: `NT` (line 109). Search text:
```text
  for (const part of ['### Purpose', 'Parent purpose (', 'Goal objective:', 'Keep parent documentation lean']) {
```
Replacement. `## PURPOSE` is not a substring of `## PROBLEM & PURPOSE`, so each new part fails today:
```text
  for (const part of [
    '### Purpose',
    '## PURPOSE',
    '## ROOT PURPOSE',
    'UNKNOWN',
    'Parent purpose (<repo-relative parent folder>)',
    'Goal objective:',
    'Keep parent documentation lean',
    'This phase groups the related child phases below',
  ]) {
```

### E20. Handoff rule (A1, A2)
File: `H`, lines 136 and 137. Two edits. First search text:
```text
`## ROOT PURPOSE` section, or else that section's opening paragraph.
```
First replacement:
```text
`## ROOT PURPOSE` section, or else the opening paragraph of a `## PURPOSE` or `## ROOT PURPOSE` section. The opening paragraph of a `## PROBLEM & PURPOSE` section states the problem, so it is never the purpose.
```
Second search text:
```text
or the scaffold sentence that begins `Keep parent documentation lean`, use
```
Second replacement:
```text
or a scaffold sentence that begins `Keep parent documentation lean` or `This phase groups the related child phases below`, use
```

### E21. Resume rule (A1, A2)
Files: `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` (line 139) and `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` (line 158). The two `purpose_row` values are identical, so apply both edits to each file. First search text:
```text
or else that section's opening paragraph. When that text is empty, UNKNOWN, still a bracketed template placeholder or the scaffold sentence that begins Keep parent documentation lean, and the packet
```
First replacement:
```text
or else the opening paragraph of a ## PURPOSE or ## ROOT PURPOSE section. The opening paragraph of a ## PROBLEM & PURPOSE section states the problem, so it is never the purpose. When that text is empty, UNKNOWN, still a bracketed template placeholder or a scaffold sentence that begins Keep parent documentation lean or This phase groups the related child phases below, and the packet
```
Second search text:
```text
Skip an ancestor whose purpose is empty, a placeholder or that scaffold sentence.
```
Second replacement:
```text
Skip an ancestor whose purpose is empty, a placeholder or one of those scaffold sentences.
```

### E22. Library README rows (A1, A4)
File: `$RT/lib/spec/README.md` (line 54). Search text:
```text
| `formatPacketProblem(purpose)` | Function | One `Problem:` line with the first sentence of the Problem Statement in the folder the purpose came from, or null. |
```
Replacement:
```text
| `formatPacketProblem(purpose)` | Function | One `Problem:` line with the packet's own problem sentence, else the one from the parent that supplied the purpose, or null. |
| `enclosingPacketFolder(folder, projectRoot)` | Function | The nearest folder inside the project, starting at `folder`, that holds a `spec.md`, or null. Both compaction hooks resolve a recorded folder through it. |
```

### E23. Finished phases record 100 (A12)
Files: `goal.md` in `../006-purpose-carry-follow-ups/`, `../007-purpose-reader-coverage/`, `../008-hop-purpose-rule-parity/`, `../009-compaction-purpose-folder/`, `../010-problem-sentence-carry/` and `../011-empty-parent-purpose-backfill/`, each at line 24 with every completion box ticked. Search text in each:
```text
    completion_pct: 0
```
Replacement in each:
```text
    completion_pct: 100
```
Phase 002 also holds `completion_pct: 0`, but it has one unticked box, so it stays.

### E24. No pre-merge next action (A12)
Files: `implementation-summary.md` in the same six phases, line 14 of each. The six search texts are below, one per file. The replacement is the same line in all six:
```text
    next_safe_action: "None. The phase is built and merged"
```

| Phase | Search text |
|-------|-------------|
| 006 | `    next_safe_action: "Build phase 006 in worktree 374 with a DeepSeek worker"` |
| 007 | `    next_safe_action: "Review plan.md section 4, then build with /speckit:implement"` |
| 008 | `    next_safe_action: "Build phase 007 first, then review plan.md section 4 and build with /speckit:implement"` |
| 009 | `    next_safe_action: "Build phase 006 first, then review plan.md section 4 and build with /speckit:implement"` |
| 010 | `    next_safe_action: "Get the operator's yes in spec.md section 7 before any build"` |
| 011 | `    next_safe_action: "Merge the worktree branch once the operator says yes"` |

None of these edits was applied at planning time. E1 to E6 were applied to a scratch copy of the built helper to project the after value in `spec.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run each command before E1 and again after E24. `(runtime)` means from `$RT`, all others from the worktree root. Every baseline was run on 2026-11-14 at `1bedb33577`.

| Command | Baseline | After the edits |
|---------|----------|-----------------|
| `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/packet-purpose.vitest.ts runtime/tests/hook-session-start.vitest.ts runtime/tests/history-locator-adapters.vitest.ts runtime/tests/hook-precompact.vitest.ts` | `(9 tests)`, `(28 tests)`, `(19 tests)`, `(18 tests)`. The first three ran together as `Tests  56 passed (56)` | `(14 tests)`, `(29 tests)`, `(20 tests)`, `(19 tests)`, `Tests  82 passed (82)`, exit 0 |
| `rg --files specs -g spec.md -g '!**/z_archive/**' -g '!**/scratch/**' -g '!**/lineages/**' \| node $C/scratch/probe-purpose-origin.mjs` | `own purpose read: 2928 of 2981`, `combinedOpening":203`, layout 8, short 7, at planning time. T002 records the value at build time | `combinedOpening":0`, layout 0, short 0, and `own purpose read` drops by the T002 combined count plus the T002 layout count |
| `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs; echo "EXIT=$?"` | `pass 89`, `fail 0`, `EXIT=0` | unchanged |
| `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs; echo "EXIT=$?"` | `pass 1028`, `fail 0`, `EXIT=0` | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | `Result: passed=150 failed=0` | unchanged |
| `python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]; print('yaml ok')" .skilled/commands/speckit/assets/speckit-resume-auto.yaml .skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | `yaml ok` | unchanged |
| `bash .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh` | `PASS: 256 mirrors across 10 trees are in sync.` | unchanged |
| The three prompt sync checks, `codex/sync-prompts.cjs --check`, `dsh/sync-prompts-dsh.cjs --check` and `pi/sync-prompts-pi.cjs --check` under `$RT/cli/` | `PASS: 45 prompts are in sync.`, `PASS: 45 prompt stubs are in sync.`, `PASS: 45 prompts are in sync.` | unchanged |
| `(runtime) npm run typecheck` | exit 0, no diagnostics | unchanged |
| `(runtime) ../node_modules/.bin/eslint lib/spec/packet-purpose.ts hooks/claude/session-prime.ts hooks/pi/session-compact-context.ts hooks/claude/compact-inject.ts` | not run at planning time. T002 records it | the T002 value |
| `(runtime) npm run build` | not run at planning time, because it writes `dist/` | exit 0, and `rg -c 'enclosingPacketFolder' dist/lib/spec/packet-purpose.js` prints `1` |

Read every exit status with `echo "EXIT=$?"` straight after the command, never after a pipe. Run the relaunch suite with `env -u AI_SESSION_CHILD`, because a dispatched worker carries `AI_SESSION_CHILD=1` and the relaunch hook turns itself off.

A baseline that prints something other than this table stops the phase before E1. Report the difference and do not edit.

What no check proves: that a model after a real compaction, resume or relaunch prints the corrected line. That needs an operator session.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node`, `npm`, `rg`, `python3` with `yaml` | Internal | Green, all ran at planning time | The phase cannot be verified |
| Phases 001 to 011 built and merged | Internal | Green, merged in `dee9003366` | Search texts would not match |
| The runtime `dist/` build | Internal | Green before the edits | The Pi test and the probe read the built helper, so T028 builds first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: any suite in section 5 prints a count or a failure other than its after value, or the continuity suites change their counts.
- **Procedure**: before commit, `git checkout -- <file>` for each file in `spec.md` section 3, then `npm run build` in `$RT`. After commit, revert the one commit and rebuild.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 001 to 011 merged | Implementation, because a failed baseline stops the phase |
| Implementation | Setup | Verification. E14 to E17 need E1 to E13 to pass |
| Verification | Implementation and the build | Phase 013, whose backfill is checked against the new reader |
<!-- /ANCHOR:phase-deps -->

---
