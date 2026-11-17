---
title: "Implementation Summary"
description: "Built on branch 469: the opt-in review --depth-mode=expansive frontier with its golden default-path baseline; the live pilot runs on the integration tip after merge."
trigger_phrases:
  - "review frontier mode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode"
    last_updated_at: "2026-11-17T14:34:37Z"
    last_updated_by: "template-author"
    recent_action: "Authored the planned phase docs"
    next_safe_action: "Wait for phases 008-010, then start T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-review-frontier-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-review-frontier-mode |
| **Completed** | Built 2026-11-17 on `worktrees/469-ed-011-review-frontier-mode`; the playbook and the changelog were written 2026-11-18; not closed: the target-1 pilot and the full suite run at integration |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->
With `--depth-mode=expansive`, a review run seeds depth-1 sub-target nodes from its target, keeps their status in `review/frontier-nodes.jsonl`, works the active node's next uncovered dimension each iteration and refuses a stop candidate while any node is open. Without the flag, a review writes what it wrote before, except for one expansive-only paragraph in CLI lineage prompts, which is waived pending operator ratification. A golden test pins seven default-path artifacts to bytes captured before the build.

T002, 008's support decision: "Support custom dimensions in `buildDimensionCoverage` (ADR-001, OD-001) | Operator choice: every configured dimension is tracked and can be covered", so the per-node dimension universe is the configured `reviewDimensions` list.

### Opt-in expansive depth mode for deep-review

The admission helper gained a review target mode (no inbox, review config caps, scope inside a file-list target, seed prune reasons, block by node id). The review reducer projects `registry.frontier` with per-node dimension coverage, the depth budget, the active node and its next dimension; open nodes are `searchDebt`, terminal nodes go to `candidateCoverage` per ADR-001. The workflow seeds, activates, admits, steers and closes stuck nodes; the stop decision vetoes review stop candidates while nodes are open; the review pivot seeds from unanswered nodes and refuses an open frontier; fan-out partitions depth-1 nodes and merges lineage frontiers behind a partition guard.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/frontier-admit.cjs` | Modify | Review target mode |
| `runtime/scripts/reduce-state.cjs` | Modify | Review frontier projection, debt, Next Focus, dashboard |
| `runtime/scripts/convergence.cjs` | Modify | Review `frontierOpen` facts and veto |
| `runtime/scripts/fanout-run.cjs`, `fanout-merge.cjs` | Modify | Review partition, lineage stores, merged frontier and guard |
| `deep-review/scripts/divergent-review-pivot.ts` | Modify | Frontier gate and unanswered-node seeds |
| `.skilled/commands/deep/assets/deep-review.yaml`, `deep-review-presentation.txt`, `review.md` | Modify | Flag binding and the frontier steps |
| `deep-review/assets/deep-review-config.json`, `prompt-pack-iteration.md.tmpl` | Modify | Config keys and lock, `{frontier_block}` slot |
| `.skilled/agents/deep-review.md` and five mirrors | Modify | `frontier_proposal` leaf-contract row |
| Review reference docs, `SKILL.md`, `README.md`, `review-mode-contract.yaml` | Modify | Flag documentation |
| `deep-review/manual-testing-playbook/` (index and scenarios DRV-076 to DRV-082) | Modify and create | Expansive review scenarios, indexed and counted |
| `deep-review/changelog/v1.13.0.0.md` | Create | Release entry for the review flag |
| `deep-review/SKILL.md`, `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Version 1.13.0.0 and the regenerated review contract |
| `runtime/tests/unit/review-depth-mode-golden.vitest.ts`, `tests/fixtures/golden-review-default/`, `frontier-admit-review.vitest.ts` | Create | Golden baseline and review admission suite |
| Review reducer, stop-decision, yaml-contract, prompt-pack, deltas-contract, divergent-pivot, fan-out and optimizer suites | Modify | New cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->
Setup ran natively: dependency merges confirmed, the golden review baseline captured on `5e583331cc9` before any code change. Each implementation task then went to DeepSeek V4.1 Flash on the Pi lane as one brief, under a 20-minute watchdog with a status snapshot of main and the worktree around every dispatch; no dispatch touched main and none hit the watchdog. Every diff was read and every check rerun before its commit. The live pilot (T030, T031) and the full suite (T029) run on the integration tip after merge.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->
| Decision | Why |
|----------|-----|
| Admit into `searchDebt` and `candidateCoverage`, not an inbox | The review reducer has no question surface, so an inbox row would be read by nothing |
| Reuse the phase-010 admission order, budget and veto | One frontier design for both loops keeps the bounds and stop semantics identical |
| Attribute iterations by record field, bounded marker or store activation row (D-011-01) | A leaf that rewords its focus still spends the node's visit, budget and dimension |
| Veto review hard stop candidates (D-011-02) | `all_dimensions_clean` is a hard stop, so the research guard would never veto it |
| Strip the expansive-only persona paragraph from the golden lineage prompt (ADR-005) | The leaf contract must change the persona the lineage prompt embeds; waived pending operator ratification, as 010's ADR-006 |
| Pilot keeps all four dimensions and raises `maxIterations` (T000) | Narrowing dimensions would weaken the coverage the review gate checks |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->
| Check | Result |
|-------|--------|
| Golden review default path | `npx vitest run review-depth-mode-golden.vitest`: 14 of 14 (lineage prompt with the one stripped paragraph) |
| Review playbook validator (2026-11-18) | `validate-playbook-package.cjs --package` on `deep-review/manual-testing-playbook`: PASS, 69 scenarios across 10 categories, violations 0 |
| Changelog shape and parent-skill doctor (2026-11-18) | `check_changelog_shape.py`: PASS; `parent-skill-check.cjs` on system-deep-loop: OK, 0 warnings |
| Phase suites | See `goal.md` log and `tasks.md` evidence; final named-suite run recorded there |
| Spec validation | `validate.sh --strict` on this folder: see the 2026-11-18 row in the `goal.md` log |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->
1. **Pilot not run.** The target-1 pilot (T030, T031) runs on the integration tip after merge; `registry.frontier.stats` evidence does not exist yet.
2. **AC-001 waived.** The default CLI lineage prompt now carries the expansive-only leaf-contract paragraph in its embedded persona (ADR-005), pending operator ratification together with 010's ADR-006.
3. **Research golden on this base.** `research-depth-mode-golden` lineage-prompt fails on this branch's base because its baseline holds worktree 467's path; integration fixed it in `2c9405692a1`.
<!-- /ANCHOR:limitations -->

---


