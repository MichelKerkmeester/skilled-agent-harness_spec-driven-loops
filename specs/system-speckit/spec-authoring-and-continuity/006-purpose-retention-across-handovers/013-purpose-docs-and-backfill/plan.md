---
title: "Implementation Plan: Phase 13: purpose-docs-and-backfill"
description: "Twenty edits in 25 files: eleven approved purpose sentences, one feature catalog entry, five playbook scenarios, two injection contract lines, six root README sentences and one library index row. The proof is the parent check at 0 of 11, both package validators and a strict validate of each parent."
trigger_phrases:
  - "purpose docs and backfill plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: purpose-docs-and-backfill

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | spec-kit packets, the sk-doc feature catalog and manual-testing playbook standards, sk-doc's README standard |
| **Storage** | None |
| **Testing** | `scratch/check-parents.mjs`, `validate.sh --strict`, the sk-doc catalog and playbook package validators, `validate_document.py` |

### Overview
E1 to E11 write eleven approved purpose sentences. E12 to E17 add the catalog entry and the five playbook scenarios and link them, and E18 to E20 add the purpose line to the injection contract, the root README and the library index. The proof is `check-parents.mjs` at `0 of 11`, the two package validators at `violations=0` with five more scenarios, and each parent's strict validate at its baseline.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 012 is built: `rg -c '^export function enclosingPacketFolder\(' .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` prints `1`
- [ ] The operator has approved, edited or rejected each sentence in `scratch/sentences.md`, recorded in `goal.md` section 4
- [ ] Each search text in section 4 matches once

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `check-parents.mjs` prints `layout sentence as purpose: 0 of 11` and both package validators print `violations=0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Docs follow behavior. Each doc names what the reader and the hooks do after phase 012, and nothing else.

### Key Components
- **`packet-purpose-carry.md`, a new catalog entry**: no entry names the feature today, so an operator cannot find which hops carry the line or where the code is.
- **Five new playbook scenarios**: no scenario checks the line on any hop, so a regression ships unseen. One per hop, because each hop has its own trigger and its own output.
- **Eleven parent sentences**: eight parents carry layout text and three carry sentences Fable reserved. Each sentence travels into every hop below its parent.

### Data Flow
A parent's `### Purpose` or `## Root Purpose` paragraph is read by `resolvePacketPurpose` and printed by every hop below it. The catalog entry points at the reader, the hooks and the tests. Each scenario names its catalog entry, and the root index lists each scenario and entry once.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Eleven parent `spec.md` files | Source of the carried purpose | update | `check-parents.mjs` and a strict validate per parent |
| `feature-catalog/` | Inventory of shipped behavior | update | `validate_catalog_package.py --package system-spec-kit` |
| `manual-testing-playbook/` | Operator checks | update | `validate-playbook-package.cjs --package ...` |
| `.skilled/hooks/injection-contract.md` | What each hook injects | update | `rg -c 'Packet Purpose'` |
| Root `README.md` and `runtime/lib/README.md` | Operator and maintainer overview | update | `rg -c` per passage |
| Devin `post-compaction.cjs`, OpenCode plugin | Print no purpose | not a consumer | No doc names them as printing it |

Same-class producers: `rg -l -F 'This phase groups the related child phases below' specs -g spec.md -g '!**/z_archive/**'` lists exactly the eight parents.
Consumers: every child below the eleven parents reads the new sentence as an inherited purpose. `check-parents.mjs` covers the parents, and the phase 012 probe covers the children.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup checks phase 012, records the operator's answers and the baselines, and counts the search texts. Implementation applies E1 to E20, one task each in `tasks.md`. Verification reruns the check script, the validators and a strict validate of each parent, then stops for the operator before any commit. `tasks.md` owns the order and the task state.

Route every `.md` write through sk-doc first: `sk-create-feature-catalog` for E12 to E15, `sk-create-manual-testing-playbook` for E16 and E17 and the README standard for E19 and E20. The parent `spec.md` edits are spec-kit documents. Every count below was taken on 2026-11-14 at `1bedb33577` and prints 1. `SK` is `.skilled/skills/system-spec-kit` and `DL` is `specs/system-deep-loop/loop-architecture/001-deep-loop-innovation`.

### E1 to E8. The eight layout-sentence parents (B1)
Files: `$DL/001-research-inputs-and-architecture/spec.md` to `$DL/008-review-and-rollback-followup/spec.md`, line 37 of each. The search text is the same in all eight:
```text
This phase groups the related child phases below so parent-level context stays a short thematic map.
```
The replacement is that parent's approved sentence from `scratch/sentences.md`, as the operator left it. The second sentence of the paragraph, `Each child owns its own scope, plan, and verification; ...`, stays as written. A sentence the operator rejects is not applied, and its parent stays in the T002 list.

### E9 to E11. The three reserved sentences (B7)
Each search text is the `Today:` line in `scratch/sentences.md`, and each replacement is the approved `Sentence:` line under it.

| Edit | File | Line |
|------|------|------|
| E9 | `specs/hooks-plugins-extensions/hook-injection-pipeline/005-smart-rule-injection/spec.md` | 39 |
| E10 | `specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/spec.md` | 43 |
| E11 | `specs/sk-design/020-chart-and-diagram-review/spec.md` | 68 |

### E12. The catalog entry (B2)
Create `$SK/feature-catalog/context-preservation/packet-purpose-carry.md` from `.skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md`. Use `context-preservation/compaction-history-lookup.md` as the model for shape only.
- Frontmatter: `title: "Packet purpose carry"`, a one-line description, at least three trigger phrases that include `packet purpose carry`, `version: 1.0.0.0`.
- `## 1. OVERVIEW`: every hop carries one sentence of why the packet exists: the resume brief, the relaunch note, the context recovered after a compaction and the continuity save.
- `## 2. HOW IT WORKS`, under H3 headings because it runs past three paragraphs. `### Where The Sentence Comes From`: `### Purpose`, else a `Purpose:` paragraph inside `## PROBLEM & PURPOSE`, `## PURPOSE` or `## ROOT PURPOSE`, else the opening paragraph of `## PURPOSE` or `## ROOT PURPOSE`, else the nearest phase parent's, else the `goal.md` Objective. Both layout sentences, `UNKNOWN` and a template placeholder never count. `### Line Shapes`: `Purpose:`, `Parent purpose (<repo-relative parent folder>):` and `Goal objective:`, plus a `Problem:` line after a compaction. `### Hops`: resume and relaunch follow the rule in their command text, the compaction hooks on Claude, Codex, Pi and DSH print it through the reader, and each save stores it as `packet_purpose`. Devin and OpenCode print none.
- `## 3. SOURCE FILES`: the implementation table with `File | Layer | Role` rows for `runtime/lib/spec/packet-purpose.ts`, `runtime/hooks/claude/session-prime.ts`, `runtime/hooks/pi/session-compact-context.ts`, `runtime/cli/core/workflow.ts`, `.skilled/hooks/session-relaunch/lib/nudge.cjs`, `.skilled/commands/speckit/handoff.md` and both resume assets. The validation table with `File | Type | Role` rows for `runtime/tests/packet-purpose.vitest.ts`, `runtime/tests/hook-session-start.vitest.ts`, `runtime/tests/history-locator-adapters.vitest.ts`, `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` and `runtime/cli/tests/test-phase-command-workflows.js`, using the Type values the template allows.
- `## 4. SOURCE METADATA`: group Context Preservation, the canonical source `feature-catalog.md`, the file path, and related links to `session-relaunch-loop.md`, `compaction-history-lookup.md` and the five E16 scenarios.

### E13. The root catalog section (B2)
File: `$SK/feature-catalog/feature-catalog.md`. Search text:
```text
## 10. CONFIGURATION CONTRACTS
```
Replacement:
```text
### Packet purpose carry

#### Description

Carries one sentence of why a packet exists across every hop: the resume brief, the relaunch note, the context recovered after a compaction and the continuity save.

#### Current Reality

One reader takes the packet's `### Purpose`, a labelled `Purpose:` paragraph or the opening paragraph of a `## PURPOSE` or `## ROOT PURPOSE` section. Without one it takes the nearest phase parent's purpose, then the packet's `goal.md` Objective. The compaction hooks print it with the problem sentence beside it, the resume brief and the relaunch note follow the same rule in words, and each save stores it as `packet_purpose`.

#### Source Files

See [context-preservation/packet-purpose-carry.md](context-preservation/packet-purpose-carry.md) for implementation and test file listings.

---

## 10. CONFIGURATION CONTRACTS
```

### E14. Link from the relaunch entry (B2)
File: `$SK/feature-catalog/context-preservation/session-relaunch-loop.md` (line 29). Search text:
```text
Cursor and Devin run on the `/speckit:handoff` command trigger only.
```
Replacement:
```text
Cursor and Devin run on the `/speckit:handoff` command trigger only. The note's Goal opens with the packet's purpose line, as [Packet purpose carry](packet-purpose-carry.md) describes.
```

### E15. Link from the compaction entry (B2)
File: `$SK/feature-catalog/context-preservation/compaction-history-lookup.md` (line 21). Search text:
```text
When the locator is missing, malformed, stale, foreign or unsupported, the hooks keep the existing recovery surface and inject no lookup section.
```
Replacement:
```text
When the locator is missing, malformed, stale, foreign or unsupported, the hooks keep the existing recovery surface and inject no lookup section. A separate `## Packet Purpose` section leads the same recovery, as [Packet purpose carry](packet-purpose-carry.md) describes.
```

### E16. Five scenarios (B3)
Create five files under `$SK/manual-testing-playbook/plugins-and-hooks/` from `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md`, with `compaction-history-lookup.md` in the same folder as the model for shape only. Each has frontmatter with `id: plugins-and-hooks-<file stem>` and `version: 1.0.0.0`, the sections OVERVIEW, SCENARIO CONTRACT, TEST EXECUTION with Prompt, Commands, Expected, Evidence, Pass / Fail and Failure Triage, SOURCE FILES and SOURCE METADATA, and a link back to `../../feature-catalog/context-preservation/packet-purpose-carry.md`. The prompt text is the same in the contract and the execution table.

| File | Hop | What the scenario proves |
|------|-----|--------------------------|
| `packet-purpose-resume.md` | `/speckit:resume` | The brief's second row is `Purpose:` quoted from a packet with `### Purpose`, `Parent purpose (<repo-relative folder>):` for a child with a placeholder, and absent for a packet with none |
| `packet-purpose-relaunch.md` | `/speckit:handoff` and the relaunch note | The note's `## Goal` opens with the purpose line, and `node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs` passes as the model-free check |
| `packet-purpose-claude-compaction.md` | Claude `SessionStart(source=compact)` | The recovered context opens with `## Packet Purpose`, a `Problem:` line when the packet states one, and no section for a packet with none. The model-free check is `hook-session-start.vitest.ts` |
| `packet-purpose-pi-compaction.md` | Pi `session_compact` | The injected message holds the same section, including from a `scratch` subfolder. The model-free check is `history-locator-adapters.vitest.ts` after `npm run build` |
| `packet-purpose-save.md` | `/speckit:save` | `rg -n 'packet_purpose:' <packet>/implementation-summary.md` prints the line after a save, and a packet with no purpose gets no field |

### E17. Five root index rows (B3)
File: `$SK/manual-testing-playbook/manual-testing-playbook.md`, section 7.5. Search text:
```text
| ask-surface-guard-live-conversation |
```
Replacement:
```text
| packet-purpose-resume | Packet purpose on resume: the brief's Purpose row quotes the packet, its phase parent or its goal.md, and is left out when none states one | [packet-purpose-resume](plugins-and-hooks/packet-purpose-resume.md) | [packet-purpose-carry](../feature-catalog/context-preservation/packet-purpose-carry.md) |
| packet-purpose-relaunch | Packet purpose on relaunch: the handoff note's Goal opens with the purpose line | [packet-purpose-relaunch](plugins-and-hooks/packet-purpose-relaunch.md) | [packet-purpose-carry](../feature-catalog/context-preservation/packet-purpose-carry.md) |
| packet-purpose-claude-compaction | Packet purpose after a Claude compaction: the recovered context opens with the purpose and problem lines | [packet-purpose-claude-compaction](plugins-and-hooks/packet-purpose-claude-compaction.md) | [packet-purpose-carry](../feature-catalog/context-preservation/packet-purpose-carry.md) |
| packet-purpose-pi-compaction | Packet purpose after a Pi compaction: the injected message carries the same section, from a subfolder too | [packet-purpose-pi-compaction](plugins-and-hooks/packet-purpose-pi-compaction.md) | [packet-purpose-carry](../feature-catalog/context-preservation/packet-purpose-carry.md) |
| packet-purpose-save | Packet purpose on save: the continuity block stores packet_purpose | [packet-purpose-save](plugins-and-hooks/packet-purpose-save.md) | [packet-purpose-carry](../feature-catalog/context-preservation/packet-purpose-carry.md) |
| ask-surface-guard-live-conversation |
```

### E18. The injection contract (B4)
File: `.skilled/hooks/injection-contract.md`. Two edits. First search text (line 214):
```text
**Injects:** a startup or resume brief: a session-context surface on cold start, or a cached compaction/resume payload.
```
First replacement:
```text
**Injects:** a startup or resume brief: a session-context surface on cold start, or a cached compaction/resume payload. On `source=compact` a `## Packet Purpose` section leads the output: one line with the last active packet's purpose and a `Problem:` line when the packet states one.
```
Second search text (line 242):
```text
**Injects:** a composed recovery block: retained summary and active spec-folder pointer.
```
Second replacement:
```text
**Injects:** a composed recovery block: retained summary and active spec-folder pointer. Pi and DSH lead it with the same `## Packet Purpose` section as Session Start Context. Devin's block carries none.
```

### E19. Six root README passages (B5)
File: `README.md`. Six edits. Each search text ends its passage, and each replacement appends one sentence to it.

| Line | Search text | Sentence appended after it |
|------|-------------|----------------------------|
| 45 | `no daemon on this path. A phrase nobody wrote is a clean no-hit, never a nearest guess.` | `The brief opens with the packet's purpose, quoted from its `spec.md`, so the next session knows why the work exists.` |
| 522 | ``It rebuilds in this order: `handover.md` -> `_memory.continuity` -> canonical spec docs.`` | ``Each save also stores the packet's purpose sentence as `packet_purpose` in that continuity block.`` |
| 548 | `When its handle is missing or stale, the section is left out and recovery runs as before.` | ``On Claude, Codex, Pi and DSH the recovered context opens with a `## Packet Purpose` section that quotes the last active packet's purpose, with a `Problem:` line when the packet states one.`` |
| 1052 | ``Claude Code, Codex, Pi and OpenCode hand over on their own, while Cursor and Devin hand over only when you run `/speckit:handoff`.`` | ``The note's Goal opens with the packet's purpose line, copied from its `spec.md`, so the purpose survives every hop.`` |
| 1175 | `It works after crashes, compactions or new sessions.` | ``The summary opens with a Purpose row quoted from the packet's `spec.md`, or from its phase parent or `goal.md` when the packet states none.`` |
| 1199 | `Outside the wrapper it prints the command that continues the work in a new session.` | `Its Goal section opens with the packet's purpose, copied word for word.` |

### E20. The library index row (B6)
File: `$SK/runtime/lib/README.md` (line 118). Search text:
```text
| `spec/packet-purpose.ts` | Reads a packet's one-sentence purpose for the post-compaction context. |
```
Replacement:
```text
| `spec/packet-purpose.ts` | Reads a packet's one-sentence purpose and problem for the compaction recovery and for the `packet_purpose` field each continuity save writes. |
```

None of these edits was applied at planning time.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run each command before E1 and again after E20, from the worktree root. Every baseline was run on 2026-11-14 at `1bedb33577`, before phase 012 was built.

| Command | Baseline | After the edits |
|---------|----------|-----------------|
| `node $C/scratch/check-parents.mjs \| tail -1` | `layout sentence as purpose: 8 of 11` | `layout sentence as purpose: 0 of 11`, and `packet` on all eleven lines with the approved sentences |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent> --strict --quiet` for each line of `scratch/parents.txt` | `RESULT: PASSED (errors=0 warnings=0)` for all eleven | unchanged |
| `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package system-spec-kit` | `PACKAGE system-spec-kit: PASS tier=fail violations=0`, 4 notes | `violations=0`, no new note |
| `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook` | `scenarios=119 ... violations=0 warnings=2` | `scenarios=124 ... violations=0 warnings=2` |
| `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` for the new catalog entry and each new scenario | not run, the files do not exist | exit 0 for each of the six |
| `python3 .skilled/skills/sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py <staging root>` with copies of the six new files under a scratch folder that mirrors the package layout | not run | exit 0 |
| `rg -l 'Packet Purpose\|packet_purpose\|Parent purpose \(' $SK/feature-catalog $SK/manual-testing-playbook .skilled/hooks/injection-contract.md README.md` | no output | lists the catalog entry, the root catalog, the five scenarios, the injection contract and `README.md` |

At build time T002 reruns the first row after phase 012 is built, because phase 012 changes what the parents resolve to. With the layout sentence skipped, the eight parents print `ancestor` or `goal`, not `packet`.

A baseline that prints something other than this table stops the phase before E1. Report the difference and do not edit.

What no check proves: that a sentence is the real reason for its parent. The operator review is that check.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 012 built | Internal | Planned | The docs would describe a rule the reader does not follow yet |
| Operator approval of `scratch/sentences.md` | Internal | Open | E1 to E11 cannot run |
| `node`, `python3`, `rg`, the sk-doc validators | Internal | Green, all ran at planning time | The docs cannot be verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a validator loses its PASS line, a parent's strict validate gains an error or a warning, or the operator rejects a sentence after it was applied.
- **Procedure**: before commit, `git checkout -- <file>` for the one file named, and delete a new file with `git clean -n` first to list it. After commit, revert the one commit.
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
| Setup | Phase 012 built and the operator's sentence review | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | The commit, which waits for the operator |
<!-- /ANCHOR:phase-deps -->

---
