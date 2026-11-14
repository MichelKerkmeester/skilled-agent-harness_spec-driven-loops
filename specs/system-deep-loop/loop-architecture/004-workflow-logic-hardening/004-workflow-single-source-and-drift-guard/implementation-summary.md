---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "workflow single source and drift guard implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/004-workflow-single-source-and-drift-guard"
    last_updated_at: "2026-11-14T19:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed phase 004 with every acceptance row Met"
    next_safe_action: "Start phase 005 from the handoff list"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-workflow-single-source-and-drift-guard"
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
| **Spec Folder** | 004-workflow-single-source-and-drift-guard |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

`/deep:research` and `/deep:review` each run from one workflow file now, so a step, an executor branch or a flag can no longer exist in one mode and be missing in the other. `--dry-run` works in both modes of both commands, and a test fails the suite if a per-mode workflow file comes back.

### Phase 4: workflow-single-source-and-drift-guard

Before this phase each command kept an auto file and a confirm file that had drifted. The confirm files lacked five executor branches and 11 research and 4 review steps, and only research confirm could dry-run. You now get the same loop in both modes. Confirm adds only its approval gates, which carry `applies_to: confirm`, and auto skips them. That also changes confirm runs: they now run the telemetry heartbeat, the run-now check and every executor kind.

The files are smaller too. The inline Node bodies moved into five runtime scripts both commands call, and the three pivot seat blocks became one parameterized pair. `deep-research.yaml` is 144394 bytes and `deep-review.yaml` 158517 bytes, each below both twins it replaces.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/deep/assets/deep-research.yaml`, `deep-review.yaml` | Created | The single workflow per command, with `execution_mode`, `mode_overrides.confirm`, `dry_run_control` and confirm gates marked `applies_to: confirm` |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-review-auto.yaml`, `deep-review-confirm.yaml` | Deleted | The four twins |
| `.skilled/skills/system-deep-loop/runtime/scripts/loop-heartbeat.cjs`, `run-now-sentinel.cjs`, `iteration-graph-upsert.cjs`, `divergent-pivot.cjs`, `dispatch-iteration.cjs` | Created | The bodies that were inline in the workflows |
| `.skilled/commands/deep/research.md`, `review.md`, both presentation files, both legacy bodies and `legacy/README.markdown` | Modified | One workflow path per command, `--dry-run` in both modes and the rule that setup writes no config under dry run |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown` | Modified | Rebuilt from the new sources |
| `runtime/scripts/compile-command-contracts.cjs`, `check-contract-drift.cjs`, `check-ledger-stem-producers.cjs`, both ledger type files | Modified | Read one `workflowPath` for research and review, and credit the two scripts that now emit stems |
| `deep-research/scripts/verify-yaml-script-paths.sh`, `deep-review/assets/review-mode-contract.yaml`, `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modified | Point at the single files |
| `runtime/tests/unit/compile-command-contracts.vitest.ts` | Modified | The drift guard: no per-mode file, and flag parity between each command doc and its workflow |
| `runtime/tests/unit/loop-heartbeat.vitest.ts`, `divergent-pivot-cli.vitest.ts`, `dispatch-iteration.vitest.ts` | Created | 12 cases for the new scripts |
| 30 other test files under `runtime/tests/` and 4 under `system-spec-kit/runtime/cli/tests/` | Modified | Read the single files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Each change was one literal brief dispatched to DeepSeek V4.1 Flash at max effort through `opencode run` on the `llmgateway` provider, 30 dispatches in all: the merge, the five scripts, the readers, the docs, five test repoints and four dry-run runs. The orchestrating session read every diff and reran every check. The drift guard was written first and failed on the unmerged tree with 5 failed cases.

An Opus sub-agent compared the five scripts with the inline bodies they replace and found nine differences. Eight were fixed, among them a review OpenCode ordering fault that deleted containment rows. The test repoints surfaced five stale assertions, each traced to a real wording or layout change and updated. The four dry-run workers also found that the auto setup text told the orchestrator to write the config before any dry-run halt could fire, so the setup text now exempts dry run.

The code landed in one commit on branch `worktrees/382-deep-loop-workflow-logic-hardening`: `f921b2c65b`. Nothing is pushed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The size requirement reads "smaller than both twins it replaces" | The merged files measured 144394 and 158517 bytes against targets of 140000 and 155000, and lossless cuts reached about 2900 bytes per file. The operator amended the requirement on 2026-11-14 so that no behavior or comment was cut to reach a number |
| Dry-run tags are compact | Each step carries `dry_run_boundary` only and one default halt event replaces the per-step events. This saves about 8000 bytes per file and drops the per-step detail text |
| Review OpenCode keeps the strictest precondition in both modes | The auto twin required an isolated worktree and a clean primary. Confirm runs of review through OpenCode now need the same. This is the one merge choice that could reasonably have gone the other way |
| A run-now failure exits 1 | The inline block hid a thrown error. The script drains its staged events and then reports the failure |
| Retry and Skip route through the both-mode steps | The confirm failure gate sends both choices to the step that every loop pass starts from, so no both-mode step is skipped |
| A fifth script, `divergent-pivot.cjs`, was added | The plan named four. The pivot bodies were the largest inline block left |
| The executor branch test lists the eight branches itself | It no longer derives them from the executor config, so a new executor kind fails the unknown-kind case and not the presence case |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Full runtime suite, `vitest run` in the runtime folder | PASS: 182 test files, 3017 passed, 8 skipped, 0 failed, exit 0. The phase 003 close had 3060 passed. The count fell because tests that looped over two twins now run once |
| Drift guard, `compile-command-contracts.vitest.ts` | PASS: 21 passed. Before the merge it reported 5 failed |
| Drift guard on a scratch copy that restores `deep-research-confirm.yaml` | FAILS as required: exit 1, `expected [ 'deep-research-confirm.yaml' ] to deeply equal []`, saved in `scratch/guard-negative.txt` |
| The four spec-kit contract tests | PASS: 24 passed |
| `check-contract-drift.cjs` | PASS: `[CONTRACT DRIFT] OK commands=3` |
| `npm run typecheck` in the runtime folder | PASS: exit 0 |
| `check-ledger-stem-producers.cjs` | PASS: `"violations":[]`, and the four `deep_research.run_now_*` stems are credited to `run-now-sentinel.cjs` |
| `verify-yaml-script-paths.sh` | PASS: 22 script references across 2 workflow YAMLs |
| Census, `measure-workflows.sh --single` | 144394 bytes with 364 heredoc bytes for research, 158517 with 1860 for review, and each of the eight executor branches once in the dispatch step |
| Four dry-run runs against a scratch spec folder | PASS: each transcript holds one `dry_run_halt` row at `step_create_directories`, `WRITES: none` and `DISPATCHES: none` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Phase 005 handoff: 139 files still name the four old workflow files.** None is read by a script or a test. The full list is `../scratch/phase-004-analysis/phase-005-handoff.txt`. By group: 45 deep-research and 39 deep-review playbook files, 18 deep-research and 4 deep-review feature catalog files, 12 runtime catalog and playbook files, both mode `SKILL.md` files, five reference docs, the deep-review changelog, `.skilled/agents/deep-review.md` and its four runtime mirrors, the `sk-create-command` skill, the `sk-code` command-authoring checklist, `.skilled/commands/speckit/README.txt`, one `cli-opencode` reference and four benchmark reports. The benchmark reports are recorded runs and should stay as they are.
2. **A dry run on an existing packet halts at directory creation too.** The command docs say an existing packet can read state and preview the next prompt first. The workflow halts at `step_create_directories` on every run, as the old confirm twin did. Phase 005 should either reword the docs or the step should skip its halt when the folders exist.
3. **`halt_hook_rule` and `safe_operations` overlap.** The rule says to halt before any command in a tagged step, while the safe list says reads still run. A dry-run worker flagged it as unclear for a tagged step that only reads.
4. **One script review finding is open.** The review found nine differences and the fix brief covered eight. The ninth is not written down in the packet, so it has to be found again by a second review of the five scripts.
5. **The byte figures are a requirement, not a guard.** No test fails when a workflow file grows.
6. **The skill and reference docs still describe two files per command.** They are phase 005's.
<!-- /ANCHOR:limitations -->

---


