---
title: "Implementation Summary: create-benchmark completeness remediation"
description: "The dual-review P1/P2 fixes (T003-T013) and the Sol Ultra Fast re-review (T014) shipped; the re-review's confirmed regressions are closed, and its deeper structural findings (T016) are escalated to the operator as beyond doc-remediation scope."
status: in_progress
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/011-create-benchmark-completeness-remediation"
    last_updated_at: "2026-07-16T04:35:00Z"
    last_updated_by: "claude"
    recent_action: "Closed all T016 structural findings as doc/template edits; strict validate 0/0"
    next_safe_action: "Ship the T016 fixes; then 066 phase-010 closeout remains"
    completion_pct: 90
    blockers:
      - "T016 structural P1s (command_benchmark FAMILIES key, reviewer-profile template, Lane C corpus scaffold, conformance fixture-location doctrine) exceed doc-remediation scope and await an operator decision"
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/assets/conformance_benchmark/command-surface/conformance_benchmark.md"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-create-benchmark-completeness-remediation |
| **Status** | In progress |
| **Completed** | Setup + finding archival (T001–T002); fix groups and re-review pending |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

So far, the remediation scaffold: this child folded into packet 066, a full spec/plan/tasks/checklist doc set mapping every verified dual-review finding to a scoped task, and the two review reports (Fable 5 and GPT-5.6 Sol Ultra) archived verbatim under `evidence/` as the finding source of truth.

The fixes themselves (T003–T013) are behavior-preserving documentation and template edits plus one router-fallback string, executed in three scoped groups and gated by an independent GPT-5.6 Sol Ultra Fast re-review.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The remediation was scoped from two independent completeness reviews rather than a single opinion: Fable 5 and GPT-5.6 Sol Ultra each audited create-benchmark against the live `system-deep-loop` benchmark surfaces, and their agreements were treated as high-confidence findings while their one divergence (behavior-template expressiveness) was resolved by reading the actual template. Fixes are authored directly from the reviews' exact file:line targets, in three scoped groups, each edit validated at author time, then verified by an independent Sol Ultra Fast re-review before ship.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fold into packet 066 as a child, not a new sk-doc packet | Operator direction; the findings were surfaced by the 066 dual review and the conformance exemplar is 066-adjacent |
| Full-sweep blast radius | Operator direction; includes cross-tree exemplar READMEs and behavior-index back-pointers |
| Align sk-code Lane C naming toward hyphens | The exemplar sits in the hyphen-naming pilot; reverting to snake_case is forbidden |
| Author fixes directly, re-review with Sol Ultra | Both reviews already give exact file:line fixes; an independent leg verifies |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Per-doc validation | DONE: `validate_document.py` 0 issues on every edited create-benchmark and cross-tree doc (incl. the 8 re-review fixes) |
| Oracle verify command | DONE: corrected command verifies all 13 fixtures (`all=13 clean=0 public=8 held-out=4`) |
| Sol Ultra re-review | DONE: verdict FAIL; every load-bearing claim verified against real files; confirmed regressions closed in `8ab89656c6`; structural findings escalated (T016). Report: `evidence/review-sol-ultra-rereview.md` |
| Doc set validates | DONE: `validate.sh --strict` on this child is Errors:0 Warnings:0 RESULT:PASSED |
| Evidence archived | DONE: both original reviews + the re-review under `evidence/` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

Behavior preservation is verified by scope: edits are documentation, templates, and one router-fallback string; no scoring, evaluator, scheduler, or runtime code is touched. Each fix is an isolated, single-`git revert` change traceable to a numbered finding in the archived reports.
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Structural findings resolved (T016).** The re-review surfaced legitimate deeper gaps, initially escalated as beyond doc-remediation scope. Under the operator's "Fix all" authorization they were all closed as documentation/template edits (no scorer, evaluator, scheduler, runtime, or frozen-framework code changed): `command_benchmark` gained a Tier-0 composite routing branch (still a composition, now routable by name); the reviewer-mode profile is recorded as a distinct lane-owned input; the Lane C playbook snippet template carries the loader-gating frontmatter; the conformance guide documents both fixture-corpus patterns (package-local vs external `fixtureRoot`); and the P2/Fable prose-drift items (route-map table, Lane B count, RVB budgets, vision-audit taxonomy, baseline-anchor note, spec-kit pointer, DAB prefix, `/create:benchmark` coverage) are reconciled. Full ledger in `tasks.md` T016.
2. **Commit-sweep (`cec7160e47`).** The T005 commit swept 16 already-staged concurrent-session files (`.codex/config.toml`, `cli-codex/**`, `mcp-click-up/**`) because a bare `git commit` committed the whole index. Content is intact and unaltered; the clean un-sweep needs a force-push (forbidden), so it is left as-is and disclosed. All later commits use the sweep-proof `git add <paths> && git commit --only` pattern.
3. **Conformance exemplar is 066-adjacent.** The `command-surface` README/contract completion overlaps 066 closeout and is cross-referenced in 010. The executing phase (004) already holds a completed live convergence run (verdict FAIL); a frozen fixture-corpus run identity is still pending.
4. **Pre-existing (not introduced here):** the four deep-mode `behavior_benchmark.md` indexes carry a `missing overview` validator warning (they use `## PURPOSE`); the phase-002 `fixture-manifest.json` records the same path-doubling oracle command this remediation corrected in its own contract.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

1. **A second fix round followed the re-review.** The plan expected the re-review to confirm a clean tree; instead it returned FAIL and caught real regressions in the fixes. Those were verified and closed in a follow-up commit (`8ab89656c6`) rather than deferred — the honest response to a review that found genuine defects.
2. **T008 was over-corrected then re-fixed.** The first pass rewrote the model-guide scorer/seed sentence to say the author selects them; the profile template shows the sweep ignores the scorer field and the runtime never reads the seed, so the claim was reverted to lane-owned.
3. **Structural findings escalated first, then resolved on authorization.** T016's findings were surfaced for an operator scope decision rather than pulled in silently; the operator authorized them ("Fix all"), and each was closable within documentation/template scope after all — the router change was a composite routing branch (not a `FAMILIES` mutation), the reviewer profile was acknowledged (not templated into a new scorer), and no corpus, fixture data, or runtime code was generated or changed.
<!-- /ANCHOR:deviations -->
