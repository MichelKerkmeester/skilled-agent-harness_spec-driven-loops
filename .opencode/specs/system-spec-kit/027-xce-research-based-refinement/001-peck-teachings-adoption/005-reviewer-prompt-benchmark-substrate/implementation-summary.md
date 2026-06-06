---
title: "Implementation Summary: 027/010 Reviewer-Prompt Benchmark Substrate"
description: "Placeholder implementation summary for the reviewer-prompt fixture type + reviewer scorer in deep-improvement Lane B (peck T10). Populate after the scorer, fixtures, and CI wiring land."
trigger_phrases:
  - "027 phase 010"
  - "reviewer prompt benchmark substrate"
  - "reviewer fixture"
  - "reviewer scorer lane b"
  - "SPECKIT_REVIEWER_BENCHMARKS"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-peck-source-adoption/001-reviewer-prompt-benchmark-substrate"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 010 planning docs (not implemented)"
    next_safe_action: "Implement the reviewer fixture type + scorer, then fill evidence"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-010-reviewer-prompt-benchmark-substrate-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-peck-source-adoption/001-reviewer-prompt-benchmark-substrate` |
| **Completed** | Pending |
| **Level** | 2 |
| **Status** | Spec-Scaffolded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pending implementation. This packet adopts peck teaching T10 (`../../research/006-peck-source-deep-mining/research.md` §2, the run's highest-novelty 0.85 finding) per the integration plan (`../../research/006-peck-source-deep-mining/integration-plan.md` §§2-7): a reviewer-prompt fixture type plus a reviewer scorer inside deep-improvement Lane B. It is the regression substrate that makes the 009 verification rules and the 011 AC-coverage gate safe to ship, and it is sequenced to land FIRST (integration-plan §6 ship-rank #2; sub-packet-proposal §0/§7).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md` | Pending (ADD) | Reviewer fixture schema + verdict vocabulary + how-to-add (or folded into the fixtures README) |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-stale-verdict.json` | Pending (ADD) | 009 stale-verdict seed fixture (expected `fail`) |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-softened-fail.json` | Pending (ADD) | 009 anti-softening seed fixture (expected `fail`, must not relabel conditional) |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-over-read.json` | Pending (ADD) | 009 read-budget seed fixture (expected finding: unjustified re-read) |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-ac-coverage.json` | Pending (ADD) | 011 AC-coverage seed fixture (expected `fail`/finding on shortfall) |
| `.opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md` | Pending | Document the reviewer fixture type alongside code-task fixtures |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/reviewer-scorer.cjs` | Pending (ADD) | Reviewer scorer: run prompt, extract verdict (pattern-first + `--grader llm`), compare to oracle; reuses `dispatch-model.cjs` + 5dim envelope + visible/hidden split |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/README.md` | Pending | Document the reviewer scorer alongside `code-task-scorer.cjs` |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Pending | Recognize the reviewer fixture type; route to the reviewer scorer; document `SPECKIT_REVIEWER_BENCHMARKS` |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml`, `deep_start-model-benchmark-loop_confirm.yaml` | Pending | Reviewer-fixture detection + reviewer-scorer selection |
| `.opencode/skills/deep-improvement/manual_testing_playbook/manual_testing_playbook.md` | Pending | Add the reviewer-prompt regression flow (authoring + scorer run + UX message + flag) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Delivery evidence should include the reviewer fixture schema, the `reviewer-scorer.cjs` sibling module reusing `dispatch-model.cjs` + the 5-dimension envelope + the `--grader llm` fallback, the four seed fixtures with a visible/hidden split, the command/YAML detection wiring, the SEMI-AUTO CI/pre-commit reuse, the `manual_testing_playbook` update, and strict spec validation. The feature is gated behind `SPECKIT_REVIEWER_BENCHMARKS`; no existing Lane B/C scorer default changes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Sibling scorer, not a fork | The reviewer scorer reuses `dispatch-model.cjs`, the 5dim envelope, and the `--grader llm` fallback; one dispatch/envelope/grader mechanism to maintain. |
| SEMI-AUTO automation | Deterministic pattern-first scorer runs in CI/pre-commit on reviewer-prompt PRs; live-LLM runs stay opt-in/nightly so nondeterministic verdicts never flap CI (ADR-001). |
| Visible/hidden oracle split | Mirror the `t3-*` `tests`/`hidden_tests` shape so a reviewer prompt cannot overfit to the visible answer. |
| Pattern-first verdict extraction | Keep the exact PASS/FAIL/BLOCK strings parseable; fall back to `--grader llm` only on ambiguous prose. |
| Gate behind `SPECKIT_REVIEWER_BENCHMARKS` | Off = existing Lane B/C behavior unchanged; the addition is additive and reversible. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reviewer fixture recognized + routed to the reviewer scorer when the flag is on; inert when off | Pending |
| Reviewer scorer extracts verdict (pattern-first + `--grader llm`) and reports a failure on oracle mismatch | Pending |
| Seed fixtures present for stale-verdict, softened-Fail, over-read (009) and AC-coverage (011) with a visible/hidden split | Pending |
| Existing Lane B/C scorer defaults unchanged; reviewer rules / completion gate / validators unchanged | Pending |
| Exact `REVIEWER_BENCHMARK: ... — rule not safe to promote` message surfaced in the existing Lane B report | Pending |
| Strict spec validation: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-peck-source-adoption/001-reviewer-prompt-benchmark-substrate --strict` | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented yet.** This is a scaffold placeholder; no behavior changes are claimed here.
2. **Live-LLM verdicts are nondeterministic.** Only the deterministic pattern-first scorer participates in CI/pre-commit; live-LLM reviewer runs are opt-in/nightly by design.
<!-- /ANCHOR:limitations -->
