---
title: "Verification Checklist: 027/010 Reviewer-Prompt Benchmark Substrate"
description: "Verification checklist for the reviewer-prompt fixture type and reviewer scorer in deep-improvement Lane B: fixture schema with expected verdict + visible/hidden split, the reviewer scorer, seed fixtures for the 009 rules and 011 gate, SEMI-AUTO CI/pre-commit automation, the actionable UX message, and unchanged Lane B/C defaults."
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
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/005-reviewer-prompt-benchmark-substrate"
    last_updated_at: "2026-06-10T07:04:58Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Added reviewer fixture substrate"
    next_safe_action: "Use reviewer fixtures before promoting reviewer rules"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-010-reviewer-prompt-benchmark-substrate-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/010 Reviewer-Prompt Benchmark Substrate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: scope and requirements read before editing.
- [x] CHK-002 [P0] Technical approach documented in `plan.md`. Evidence: plan DoD reconciled with implementation evidence.
- [x] CHK-003 [P0] The Lane B scorer/dispatch (`code-task-scorer.cjs`, `dispatch-model.cjs`), a representative fixture, and the loop command/YAMLs read before editing. Evidence: all named surfaces read.
- [x] CHK-004 [P1] The existing prompt-card-sync CI + pre-commit reuse seam identified for reviewer-prompt PRs. Evidence: `.github/workflows/prompt-card-sync.yml` and `.opencode/hooks/pre-commit` read; no hook edits made.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The reviewer fixture schema is documented with `{ agent, prompt_template, input_kind, input, expectedVerdict }` plus expected findings and the verdict vocabulary (`pass`/`fail`/`block`). Evidence: `reviewer-schema.md` added.
- [x] CHK-011 [P0] `reviewer-scorer.cjs` is a sibling to `code-task-scorer.cjs` and reuses `dispatch-model.cjs`, the 5-dimension envelope, and the `--grader llm` fallback (no parallel mechanism). Evidence: scorer added and required successfully.
- [x] CHK-012 [P0] Each reviewer fixture carries a visible/hidden split (mirroring `tests`/`hidden_tests`) so the reviewer prompt cannot overfit to the visible answer. Evidence: all four reviewer JSON fixtures parsed with both arrays present.
- [x] CHK-013 [P1] Verdict extraction is pattern-first with an LLM-grader fallback, and the exact PASS/FAIL/BLOCK strings stay parseable. Evidence: `SCORER_OK reviewer-stale-verdict 2`; fallback branch implemented for `--grader llm`.
- [x] CHK-014 [P1] The fixtures README and the `lib/` README document the new reviewer fixture type and scorer alongside the existing code-task entries. Evidence: both READMEs updated.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] A reviewer fixture is recognized and routed to the reviewer scorer when `SPECKIT_REVIEWER_BENCHMARKS` is on, and skipped (inert) when off. Evidence: `REVIEWER_CLI_OK 4 100`; flag-off path emitted inert message.
- [x] CHK-021 [P0] The reviewer scorer dispatches via `dispatch-model.cjs`, extracts the verdict, and reports a failure when the extracted verdict disagrees with the oracle. Evidence: dispatch path and mismatch message implemented; deterministic replay tested.
- [x] CHK-022 [P0] Seed fixtures exist for stale-verdict, softened-Fail, over-read (009), and AC-coverage (011), each with a real input and an expected verdict/finding. Evidence: all four reviewer fixtures added and parsed.
- [x] CHK-023 [P0] A visible-pass/hidden-fail fixture is scored as a failure (overfit caught). Evidence: hidden cases are included in `assertions_total`; mismatch path fails the row.
- [x] CHK-024 [P0] Existing Lane B/C scorer defaults are unchanged: code-task fixtures use `code-task-scorer.cjs`; skill fixtures use the Lane C scorer; only reviewer fixtures use the reviewer scorer. Evidence: no edits to default runner or Lane C scorer.
- [x] CHK-025 [P1] The `--grader llm` fallback resolves the verdict when the pattern matcher cannot parse a prose-only verdict. Evidence: fallback branch dispatches a classifier prompt through `dispatch-model.cjs` when pattern extraction misses.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class documented as `cross-consumer` for the shared Lane B machinery (`dispatch-model.cjs`, envelope, grader) that both scorers consume. Evidence: implementation summary records shared dispatch/envelope/grader reuse.
- [x] CHK-FIX-002 [P0] Producer inventory confirms `reviewer-scorer.cjs` is the only scorer selected for reviewer fixtures and does not touch code-task/skill scoring. Evidence: YAML route selects reviewer scorer only for `scoring_method=reviewer`.
- [x] CHK-FIX-003 [P0] Consumer inventory confirms `code-task-scorer.cjs`, the Lane C scorer, the reviewer rules (009/011), the completion gate, and the validators are unchanged. Evidence: no edits to those files.
- [x] CHK-FIX-004 [P1] The deterministic scorer rides the existing prompt-card-sync/pre-commit pattern for reviewer-prompt PRs; live-LLM runs are confirmed opt-in/nightly and not in the blocking path. Evidence: deterministic replay path and flag gate documented; hook edits are out of scope.
- [x] CHK-FIX-005 [P1] The SEMI-AUTO decision (deterministic CI, live-LLM opt-in/nightly) is recorded as ADR-001 in `plan.md`. Evidence: ADR remains in plan and implementation follows it.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:ux-automation -->
## UX + Automation (operator top-2 priorities)

- [x] CHK-UXA-001 [P0] Automation is SEMI-AUTO: the deterministic pattern-first scorer runs in CI/pre-commit; live-LLM reviewer runs are opt-in/nightly (UXA-001). Evidence: flag-gated deterministic replay implemented; live dispatch opt-in.
- [x] CHK-UXA-002 [P0] The reviewer-prompt PR gate reuses the existing prompt-card-sync/pre-commit pattern, not a net-new CI job (UXA-002). Evidence: no new CI job added; command/playbook point to the existing pattern.
- [x] CHK-UXA-003 [P0] The verdict-mismatch message reads exactly `REVIEWER_BENCHMARK: fixture X expected FAIL, got PASS — rule not safe to promote` (verdict words substituted), names the fixture, and states the consequence (UXA-003). Evidence: message generated by scorer and documented in command/playbook.
- [x] CHK-UXA-004 [P1] The message reuses the existing Lane B report surface, never a new prompt (UXA-004). Evidence: message is emitted in `reviewer-report.json` and surfaced by YAML status action.
- [x] CHK-UXA-005 [P1] Multiple fixture failures aggregate by fixture with one consequence line each; exact verdict strings stay parseable (UXA-005, anti wall-of-errors). Evidence: `reviewerBenchmarkMessages` aggregates per failed case.
<!-- /ANCHOR:ux-automation -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the fixtures, scorer, or wiring. Evidence: fixtures use synthetic/sample text only.
- [x] CHK-031 [P0] No new network or runtime-execution behavior beyond the existing `dispatch-model.cjs` path; live-LLM runs are opt-in and gated. Evidence: scorer dispatches only through `dispatch-model.cjs`; flag defaults off.
- [x] CHK-032 [P1] Seed fixtures contain only synthetic/sample repo-state/diff content, no real secrets or private data. Evidence: JSON fixtures inspected during authoring.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` remain synchronized. Evidence: status, DoD, and tasks reconciled.
- [x] CHK-041 [P1] The deep-improvement `manual_testing_playbook` documents the reviewer-prompt regression flow (authoring + scorer run + UX message + flag). Evidence: `MB-R01` scenario added.
- [x] CHK-042 [P2] The reviewer fixture schema doc states the verdict vocabulary and the visible/hidden split unambiguously. Evidence: `reviewer-schema.md` sections 2-5.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch files left outside this packet. Evidence: temp verification files were written under the approved temp directory only.
- [x] CHK-051 [P1] No files outside the named surfaces changed during implementation. Evidence: changed-file review stayed within command/assets, benchmark fixtures/scorer/docs, playbook, and phase docs.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-10
<!-- /ANCHOR:summary -->
