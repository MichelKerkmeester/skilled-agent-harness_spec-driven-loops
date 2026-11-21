---
title: "Implementation Summary"
description: "Built on branch 469: the opt-in review --depth-mode=expansive frontier with its golden default-path baseline. The target-1 pilot ran twice; AC-011 was amended and run 2 meets it."
trigger_phrases:
  - "review frontier mode implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode"
    last_updated_at: "2026-11-21T11:09:55Z"
    last_updated_by: "generate-context"
    recent_action: "Phase merged and built on integration; golden test passes and pilot run 2 drained"
    next_safe_action: "Record a budget per depth (CHK-113) and show SL-004 and SL-2-04 frontier-free"
    packet_purpose: "Purpose: With `--depth-mode=expansive`, a review run decomposes its target into admitted sub-target nodes held in `candidateCoverage`, `searchDebt` and a review `registry.frontier`, focuses them breadth-first, refuses to stop while they are open within budget, closes them cleanly and partitions depth-1 no..."
    blockers:
      - "Search debt SL-004 and SL-2-04 not shown frontier-free"
      - "CHK-113 open: no budget per depth recorded"
    key_files:
      - "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/tasks.md"
      - "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:989cf1c23e6a428358517461e6c333348e1afd2c9d731cc162e20909be1aa529"
      session_id: "scaffold-011-review-frontier-mode"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "91021a9f-dca3-4cb7-9743-2973efffa465"
      workspace: "/Users/michelkerkmeester/worktrees/public/455-expansive-depth-integration"
      savedAt: "2026-11-21T11:09:55Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
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
| **Completed** | Built 2026-11-17 on `worktrees/469-ed-011-review-frontier-mode`; the playbook and the changelog were written 2026-11-18; the target-1 pilot ran twice on 2026-11-17 and 2026-11-18; AC-011 met under the amended criterion (decision-record Q008) on run 2 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->
With `--depth-mode=expansive`, a review run seeds depth-1 sub-target nodes from its target, keeps their status in `review/frontier-nodes.jsonl`, works the active node's next uncovered dimension each iteration and refuses a stop candidate while any node is open. Without the flag, a review writes what it wrote before, except for one expansive-only paragraph in CLI lineage prompts, which ADR-005 waives; the operator ratified it on 2026-11-18. A golden test pins seven default-path artifacts to bytes captured before the build.

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
Setup ran natively: dependency merges confirmed, the golden review baseline captured on `5e583331cc9` before any code change. Each implementation task then went to DeepSeek V4.1 Flash on the Pi lane as one brief, under a 20-minute watchdog with a status snapshot of main and the worktree around every dispatch; no dispatch touched main and none hit the watchdog. Every diff was read and every check rerun before its commit. The target-1 pilot ran in a throwaway worktree, with its results under Known Limitations. The full suite (T029) runs on the integration tip after merge.
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
| Strip the expansive-only persona paragraph from the golden lineage prompt (ADR-005) | The leaf contract must change the persona the lineage prompt embeds; waived, ratified by the operator on 2026-11-18, as 010's ADR-006 |
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
1. **The pilot ran twice; AC-011 was amended.** Run 2 (`scratch/pilot-run-2.md`, at `cee8682a6c9`) drained every lineage frontier to zero open and zero active, with 8 depth-1 nodes answered and a lineage-local graph in every lineage. pi-2 still stopped on the cap behind real `spec_code` traceability, so the operator dropped the stop-reason clause. Run 1 follows. The target-1 run reviewed 400 commits with 6 lineages of up to 16 iterations each, on a throwaway fixture (`scratch/pilot-run-1.md`). The T031 budget check passed: half of the 16-iteration cap is 8, which meets the 8 it needs. AC-011 failed for two reasons. The root cap of 6 pruned the seventh depth-1 node, and 3 of 6 lineages stopped on `maxIterationsReached`. The frontier still ended with no open or active node, and the merge guard passed. Four defects were fixed in `43eb6d47b8e` with fail-first tests. One stays open for the operator: a lineage keeps running after its node is answered.
2. **AC-001 waived.** The default CLI lineage prompt now carries the expansive-only leaf-contract paragraph in its embedded persona (ADR-005), ratified by the operator on 2026-11-18 together with 010's ADR-006.
3. **Research golden on this base.** `research-depth-mode-golden` lineage-prompt fails on this branch's base because its baseline holds worktree 467's path; integration fixed it in `2c9405692a1`.
<!-- /ANCHOR:limitations -->

---


