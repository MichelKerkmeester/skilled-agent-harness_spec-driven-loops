---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "command and skill doc alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/005-command-and-skill-doc-alignment"
    last_updated_at: "2026-11-14T21:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed phase 005 with every acceptance row Met"
    next_safe_action: "Split phase 006 into children, then implement it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-command-and-skill-doc-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-command-and-skill-doc-alignment |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The deep-research and deep-review docs now describe the loop the code runs: one workflow file per command, a stop decision a script computes, and a failure question that exists in confirm mode only. `check-documentation-drift.cjs` fails when a doc states a wrong executor count, names a file that does not exist or lists flags that differ from the command flag table.

### Phase 5: command-and-skill-doc-alignment

Phases 001 to 004 changed how the loop stops, counts, locks and loads its workflow. The docs still named four workflow files that were merged away, a review reducer path that never existed and a tool-call number no code enforces. You can now follow any file name in these docs and find the file. Each fact has one owner: `EXECUTOR_KINDS` for the executor list, the command flag table for the flags and the prompt pack value for the tool-call budget. The other docs point at the owner and state no number.

The facts check was written first and failed with 463 errors on the unfixed tree. It now prints `"errors": []`, and a plain run of the checker includes it, so the next stale name fails a check.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` | Modified | The `--facts` rule set and the `--facts-root=<dir>` option that points it at a fixture tree |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/check-documentation-drift.vitest.ts` | Created | 11 cases: each rule passing and failing, the excluded changelog, the parse failure and the live tree |
| `.skilled/commands/deep/research.md`, `review.md` | Modified | One autonomous directive that names no runtime binary, a routing step that points at the flag table, the restart rows, the execution-protocol block in review and the dry-run sentence |
| `.skilled/commands/deep/assets/deep-research-presentation.txt`, `deep-review-presentation.txt`, both legacy bodies | Modified | The confirm-only failure checkpoint and the dry-run sentence |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Modified | Rebuilt from the new sources |
| `deep-research/SKILL.md`, `README.md` and 7 files under `references/` | Modified | The stop script, the counters, the failure rule, the duration limit, the budget owner and the single dispatcher |
| `deep-review/SKILL.md` and 7 files under `references/` | Modified | The same facts for review, and the real reducer path `runtime/scripts/reduce-state.cjs` |
| `deep-review/scripts/render-contract-snapshot.cjs`, `deep-review/assets/review-mode-contract-snapshot.md` | Modified | The generator named `review_mode_contract.yaml`. The file is `review-mode-contract.yaml`, and the snapshot was regenerated |
| 66 files under `deep-research/feature-catalog/` and `manual-testing-playbook/` | Modified | Single workflow name, the stop script as the owner of the stop decision, and search commands that print a line |
| 60 files under `deep-review/` and `runtime/` `feature-catalog/` and `manual-testing-playbook/` | Modified | The same, and a rewritten native fan-out scenario that describes `fanout-run.cjs` |
| `runtime/references/integration-points.md`, hub `ARCHITECTURE.md` | Modified | Workflow file names and two script paths |
| `.skilled/agents/deep-research.md`, `deep-review.md` and their mirrors in `.claude`, `.codex`, `.pi` and `.dsh` | Modified | No stated budget number in research, `deep-review.yaml` in review |
| `sk-doc/sk-create-command/SKILL.md`, `sk-code/sk-code-skilled/assets/checklists/command-authoring.md`, `system-spec-kit/references/structure/folder-structure.md`, `cli-opencode/references/destructive-scope-violations.md`, `.skilled/commands/speckit/README.txt` | Modified | Each names a workflow file that exists |
| Five changelog entries: `deep-research` v1.15.13.0, `deep-review` v1.11.15.0, `deep-loop-runtime` v1.9.17.0, `sk-create-command` v1.0.12.0, `sk-code-skilled` v2.1.19.0 | Created | One entry per changed packet, with the four `SKILL.md` versions bumped to match |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The facts check and its test came first, and the live-tree case failed until the docs were fixed. A script then renamed the old workflow file names in 127 files, which took the errors from 439 to 45. Six literal briefs went to DeepSeek V4.1 Flash at max effort through `opencode run` on the `llmgateway` provider, one at a time: the checker, the command docs, the research skill and references, the review skill and references, and the two catalog and playbook sets. The orchestrating session read every change that was more than a file rename and reran every check.

That reading found three sentences a worker got wrong, each fixed by hand: two said a run with no graph data skips the graph check, and one dropped `minIterationsNotReached` from the reasons that never pivot. The agent files, the hub doc, the snapshot generator, the presentation files and the docs outside the mode packets were edited by hand.

The full runtime suite, the typecheck, the contract drift check, the agent mirror check and the three spec-kit contract tests ran from the final tree. The code landed in one commit on branch `worktrees/382-deep-loop-workflow-logic-hardening`: `9d02835e46`. Nothing is pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The fixture root is the `--facts-root=<dir>` option | The first version read an environment variable. The checklist requires a checker that reads none, and a flag keeps it free of process-wide state |
| The docs were reworded to match the dry-run halt, the workflow was left alone | Phase 004 found that a dry run on an existing packet also halts at directory creation. This phase changes no workflow, so both command docs and both legacy bodies now say every packet stops at that step |
| The research setup bullet says "topic" | The goal criterion searches both command docs for "research topic" and must print nothing. The one remaining hit was correct wording in `research.md`, so the word was shortened and the meaning kept |
| The snapshot generator was edited | The facts check reported the generated snapshot, and a generated file is fixed at its generator. The change is the file name on ten lines of comments and messages |
| The legacy review body keeps its flag list and its `opencode run --command` clause | It has no flag table to point at, the facts check does not read it and no test compares it with the command doc. Only its dry-run sentence changed |
| The changelog entries for the two mode packets describe phases 001 to 004 too | Those phases shipped no changelog entry, and a reader of the packet changelog would otherwise find the doc change without the behavior it describes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `check-documentation-drift.cjs --facts` on the unfixed tree | FAILS as required: exit 1, 463 errors, naming `deep-research/SKILL.md:92`, `deep-review/SKILL.md:59` and the `research.md` routing step |
| `check-documentation-drift.cjs` on the final tree | PASS: exit 0, `"errors": []` |
| Full runtime suite, `vitest run` in the runtime folder | PASS: 183 test files, 3028 passed, 8 skipped, 0 failed, exit 0. The phase 004 close had 182 files and 3017 passed. The new test file adds 11 |
| `check-documentation-drift.vitest.ts` and `typo-flags.vitest.ts` | PASS: 11 and 15 passed |
| The three spec-kit contract tests | PASS: 21 passed |
| `check-contract-drift.cjs` | PASS: `[CONTRACT DRIFT] OK commands=3` |
| `npm run typecheck` in the runtime folder | PASS: exit 0 |
| `check-agent-mirror-sync.cjs --all` | PASS: `all comparable mirrors in sync` |
| `render-contract-snapshot.cjs --check` | PASS: the snapshot is up to date |
| Underscore-name inventory | 0 files |
| `check_changelog_shape.py` on the five new entries | PASS on each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The facts check tests three kinds of fact.** It checks an executor count, a named file and the routing flags. It cannot tell that a sentence about behavior is wrong, which is how the three sentences above passed it. A reader still has to check behavior claims against the code.
2. **`maxDurationReached` is not in `convergence.cjs`.** The setup task expected it there. The frozen list is in `runtime/lib/deep-loop/lifecycle-taxonomy.cjs` and the workflow compares the duration itself, as phase 003 built it. The docs attribute the duration stop to the loop, not to the script.
3. **`halt_hook_rule` and `safe_operations` still overlap.** Phase 004 reported it. The rule says to halt before any command in a tagged step, while the safe list says reads still run. This phase changes no workflow, so it stays open.
4. **Three playbook files state a test count.** They tell the operator to confirm 197 of 197 unit tests. The number was stale before this phase and the facts check does not read it.
5. **The `sk-create-command` naming example names a council workflow file.** Phase 006 retires the council mode, so that example needs a new file name when the council files go.
6. **The stale-name inventory still lists one file.** `deep-review/manual-testing-playbook/manual-testing-playbook.md` names `deep-review-auto-restart-contract.vitest.ts`, a test file that exists.
<!-- /ANCHOR:limitations -->

---
