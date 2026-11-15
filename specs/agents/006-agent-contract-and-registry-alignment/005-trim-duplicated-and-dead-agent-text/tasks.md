---
title: "Tasks: Phase 5: trim-duplicated-and-dead-agent-text"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "trim duplicated and dead agent text tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: trim-duplicated-and-dead-agent-text

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Variables**: `A` is `.skilled/agents`. `M` is `scratch/removal-map.md`. `T` is `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Save the Measured Behavior commands and their output (`scratch/baseline.txt`). Verify: `rg -c '52568' scratch/baseline.txt` prints 1.
- [x] T002 Count the words in each section of `code.md` with awk (`scratch/baseline.txt`). Verify: `rg -c 'OUTPUT VERIFICATION' scratch/baseline.txt` prints 1.
- [x] T003 Write one row per block to be removed, quoting the block and its surviving line (`scratch/removal-map.md`). Verify: `rg -c '^\| ' scratch/removal-map.md` prints 12 or more.
- [x] T004 Dispatch `context`, `review` and `code` once each on one fixed small task and save the returns (`scratch/dispatch-before.md`). Verify: `rg -c '^## ' scratch/dispatch-before.md` prints 3.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Amend the summary rule and set the canonical advisor block (`.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md`). Verify: `rg -c 'Hook-Injected' .skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md` prints 1 or more.
- [x] T006 Add the shared-block comparison to the `--check` mode (`.skilled/bin/sync-agent-roster.cjs`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 1 and names the files whose block differs.
- [x] T007 Add the drifted-block case (`.skilled/bin/sync-agent-roster.vitest.ts`). Verify: `npx vitest run .skilled/bin/sync-agent-roster.vitest.ts` reports every case passed.
- [x] T008 Make the advisor block identical to the template's copy in all eleven files (`.skilled/agents/ai-council.md`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` exits 0.
- [x] T009 Remove the box-drawn summary from the eight files that carry one (`.skilled/agents/context.md`). Verify: `rg -l '^│  AUTHORITY' .skilled/agents` prints no path. Observed: nine files carried one, `deep-review.md` included, and `rg -l '^│' .skilled/agents` prints no path.
- [x] T010 Cut the two sections to the statements the removal map marks `kept, unique` (`.skilled/agents/code.md`). Verify: the awk count for the two sections totals 1300 or lower.
- [x] T011 Remove the repeated routing list (`.skilled/agents/context.md`). Verify: `rg -c 'Use exact tools when the query gives exact evidence handles' .skilled/agents/context.md` prints no line.
- [x] T012 Regenerate the runtime copies of every changed agent file by the route `.skilled/bin/agent-mirror-crosswalk.md` names for each tree (`.claude/agents`, `.codex/agents`, `.pi/agents`, `.cursor/agents`, `.devin/agents`, `.dsh/agents`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Recount the words per section and in total (`scratch/after.txt`). Verify: `wc -w .skilled/agents/*.md` prints a total of 50000 or lower. Observed: the total is 50,856. The ceiling is waived by ADR-001 in `decision-record.md`.
- [x] T014 Dispatch the same three agents on the same task and save the returns (`scratch/dispatch-after.md`). Verify: `rg -c '^## ' scratch/dispatch-after.md` prints 3.
- [x] T015 Compare the `code` return with the return template field by field (`scratch/code-dispatch-after.md`). Verify: `rg -c 'missing' scratch/code-dispatch-after.md` prints no line. Observed: the return template is section 9 of `code.md` since phase 4.
- [x] T016 Confirm no permission or boundary line was deleted (`scratch/after.txt`). Verify: `git diff main -- .skilled/agents` shows no deleted line containing `deny`.
- [x] T017 Run strict validation on this phase folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `wc -w .skilled/agents/*.md` prints a total of 50000 or lower and `scratch/removal-map.md` has no row without a surviving line or a reason. Observed: the total is 50,856 and the ceiling is waived by ADR-001. The removal map has 25 rows and none lacks a surviving line or a reason.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A `[B]` task blocks close until its blocker is named in this file and the operator has answered it.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements are in `spec.md` section 4 and each has a row in `acceptance-criteria.md` Evidence: eight REQ rows in `spec.md` section 4 and eight AC rows.
- [x] CHK-002 [P0] The baseline in `spec.md` Measured Behavior was rerun and saved to `scratch/baseline.txt` Evidence: `rg -c '52568' scratch/baseline.txt` printed 1, and the rerun measured 53,367.
- [x] CHK-003 [P1] Phase 4's `acceptance-criteria.md` says `Closeable: Yes` Evidence: `rg -n 'Closeable' ../004-agent-template-conformance-and-drift-check/acceptance-criteria.md` printed `**Closeable:** Yes`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check .skilled/bin/sync-agent-roster.cjs` exits 0 Evidence: `node --check .skilled/bin/sync-agent-roster.cjs` exited 0.
- [x] CHK-011 [P0] `node .skilled/bin/check-agent-mirror-sync.cjs` ends with `all comparable mirrors in sync` and exits 0 Evidence: `node .skilled/bin/check-agent-mirror-sync.cjs --all` ended with `11 agent(s) checked — all comparable mirrors in sync — OK` and exited 0.
- [x] CHK-012 [P1] No rule was reworded: every changed line is a deletion or the shared block Evidence: `git diff 9efcf3da86 31ced0f5ea -- .skilled/agents` adds eight lines: the three-line shared block in `design.md` and `markdown.md`, and the headings `## 11. RULES` and `## 12. RELATED RESOURCES` in `debug.md`, renumbered after its summary went. Every other changed line is a deletion. Each file equals the expected file `scratch/trim-plan.py` wrote before the cut.
- [x] CHK-013 [P1] No changed line names a spec path, a packet number or a task id Evidence: the eight added lines are the shared block and two headings, and the script's comments name no spec path, packet number or task id. `quality-gate.cjs --files` on the script and its test exited 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] REQ-001 to REQ-003 hold as `acceptance-criteria.md` states Evidence: AC-001 to AC-003 are `Met`, each with its observed output.
- [x] CHK-021 [P0] The removal map was committed before the first cut, shown by its commit order Evidence: `git log --oneline -- scratch/removal-map.md` shows `7380966149`, three commits before the cut in `31ced0f5ea`.
- [x] CHK-022 [P1] REQ-004 to REQ-008 hold as `acceptance-criteria.md` states Evidence: AC-004, AC-005, AC-006 and AC-008 are `Met`. AC-007 is `Waived` by ADR-001, an operator decision of 2026-11-14.
- [x] CHK-023 [P1] The three after-dispatches keep every limit the before-dispatches showed Evidence: `scratch/dispatch-after.md` against `scratch/dispatch-before.md`. `context` dispatched no sub-agent, wrote nothing and ran no shell in both. `review` stayed read-only on the fast path with five tool calls and named the unrun resolver under `Not checked` in both. `code` changed one file, ran the named check and stopped at five tool calls in both.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported defect class beyond the rows in the Testing Checklist.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No deleted line contains `deny`, `NEVER` or `HARD BLOCK` unless the removal map names its surviving line Evidence: `git diff 9efcf3da86 31ced0f5ea -- .skilled/agents | grep -E '^-[^-]' | grep -cE 'deny|NEVER|HARD BLOCK'` printed 0.
- [x] CHK-031 [P1] No agent gains a permission in this phase Evidence: `git diff 9efcf3da86 31ced0f5ea --stat -- .skilled/agents/agent-registry.json` printed nothing, and no frontmatter line changed in an agent file.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` name the same word targets Evidence: the three documents name 50,000 for the total and 1,300 for the two `code.md` sections. The measured total is 50,856 and ADR-001 waives the ceiling.
- [x] CHK-041 [P1] The agent template and the eleven files agree on whether a summary section exists Evidence: `rg -l '^│' .skilled/agents` prints no path, and the template's section 7 says agent files carry no closing summary.
- [ ] CHK-042 [P2] `.skilled/skills/sk-doc/sk-create-agent/references/common-pitfalls.md` names restated summaries as a pitfall Deferred: the file is a skill reference file, which parent decision D6 keeps out of this packet.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Baselines, parity tables and removal maps live under `scratch/` only Evidence: `ls scratch` lists the baseline, the removal map, the before and after returns, the briefs and the helpers, and nothing of the kind sits outside it.
- [x] CHK-051 [P1] `git status --short` lists no file outside the paths in `spec.md` Files to Change and this packet Evidence: `git show --stat 31ced0f5ea` lists the agent files and their runtime copies, the script and its test, the template and this packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 7 | 7/7 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 0/1, deferred with its reason |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---



