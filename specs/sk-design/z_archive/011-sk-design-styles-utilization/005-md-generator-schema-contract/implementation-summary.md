---
title: "Implementation Summary: design-md-generator v3 schema contract"
description: "The design-md-generator v3 schema contract is built and verified: one versioned V3_SCHEMA authority for section requiredness, capabilities, Quick Start groups, semantic roles, formatter emission, prompt instructions, and validation; a hard-vs-advisory validation split; a manifest-fed de-literalized corpus baseline; and a schema-drift sentinel with counterfactual tests. 149/149 tests pass and typecheck is clean after an adversarial review closed seven real enforcement gaps."
trigger_phrases:
  - "md generator schema summary"
  - "v3 schema contract status"
  - "schema authority status"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract"
    last_updated_at: "2026-07-18T18:22:32Z"
    last_updated_by: "claude"
    recent_action: "Built and verified the v3 schema authority; 149/149 tests pass, typecheck clean"
    next_safe_action: "Layer STUDY exemplars on the v3 contract in phase 006"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-mdgen-schema-011-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "One versioned V3_SCHEMA is the single authority; consumers resolve requiredness from it."
      - "Target/schema/provenance violations are immutably hard; corpus signals are advisory only."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> **Complete — built, adversarially reviewed, and verified.** `tsc --noEmit` is clean and `npm test` is 149/149.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-md-generator-schema-contract |
| **Status** | Complete — implemented, reviewed, verified |
| **Level** | 3 |
| **Estimated Effort** | ~10–15 engineer-days |
| **Depends On** | `../004-retrieval-substrate/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `design-md-generator` backend now has one versioned `V3_SCHEMA` as the single source of truth for section requiredness, conditional capabilities, extension slots, Quick Start groups, semantic typography roles, formatter emission, prompt instructions, and validation — removing the prior formatter/prompt/validator drift. Corpus signals inform advisory strata only and never alter target-measured values.

### Files Created / Modified

| File | Action | Result |
|------|--------|--------|
| `backend/scripts/schema-v3.ts` | Create | The single versioned v3 authority + consumer-contract projections + drift sentinel |
| `backend/scripts/typography-role-v3.ts` | Create | Semantic role normalizer: stable core + namespaced extensions, source labels preserved |
| `backend/scripts/corpus-baseline-v3.ts` | Create | Compact baseline + de-literalized fixtures from the phase-004 manifest (allowlisted vocabulary) |
| `backend/scripts/formatters-v3.ts` | Modify | Capability-driven `emitQuickStart` reads groups/roles from the schema |
| `backend/scripts/build-write-prompt.ts` | Modify | Prompt instructions resolve section identity/roles from the schema |
| `backend/scripts/validate.ts` | Modify | Hard-vs-advisory split + Quick Start required-group enforcement |
| `backend/scripts/report-gen.ts` | Modify | Renders hard failures distinctly from corpus advisories |
| `backend/tests/*.test.ts` | Create/Modify | Drift sentinel, counterfactual, immutability, and anti-leak regressions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built by a `cli-codex gpt-5.6-sol` (high, fast) implementer to `spec.md`/`plan.md`/`tasks.md` in an isolated worktree, on top of the phase-004 retrieval substrate. A `gpt-5.6-sol` xhigh-fast adversarial reviewer audited the diff and flagged seven real enforcement gaps between the spec's promises and the code. A scoped fix pass closed all seven: residual hard-coded section requiredness moved into the schema; an empty/group-incomplete Quick Start now hard-fails against the active schema groups; an immutable hard-issue set (target/schema/provenance can never be overridden to advisory); an allowlisted corpus vocabulary that normalizes source labels out of the baseline; removal of an unverifiable prose metric; split counterfactual tests proving all three consumers move together; and a real-input scoring regression. Scope stayed locked to the `design-md-generator/backend/**` Files-to-Change (the `build-write-prompt.ts` edit is required by the single-authority invariant). STUDY exemplars stayed out of scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One versioned v3 manifest as single authority | Removes formatter/prompt/validator drift at the root (ADR-001) |
| Corpus teaches shape, never target-measured values | Prevents slop, source leaks, and aesthetic majority votes (ADR-002) |
| Hard-vs-advisory validation split, hard set immutable | Calibrates output instead of majority-rejecting valid docs; a hard issue can never be downgraded (ADR-003) |
| Capability-driven Quick Start emission + required-group validation | Emission and validation both resolve from the schema (ADR-004) |
| Semantic typography-role normalizer | Stable core roles with namespaced extensions preserve source labels (ADR-005) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Run by the implementer and independently re-run by the orchestrator from `design-md-generator/backend/`.

| Check | Result |
|-------|--------|
| Typecheck | VERIFIED: `tsc --noEmit` exit 0, 0 errors |
| Test suite | VERIFIED: `npm test` 149/149 pass, 18 files, 0 skipped |
| Single authority (non-vacuous) | VERIFIED: counterfactual tests prove formatter + prompt + validator move together per schema mutation |
| Quick Start enforcement | VERIFIED: an empty Quick Start with active capabilities hard-fails `quickstart-missing-group` |
| Hard-set immutability | VERIFIED: an advisory override of `missing-section` stays hard and blocks |
| Corpus anti-leak | VERIFIED: a source theme label (`Acme Launch Theme`) is normalized to `unknown`/`other`, absent from baseline + fixtures |
| Hard-vs-advisory split | VERIFIED: a corpus-divergent, target-valid document passes with advisories only (score 100/100) |
| Packet validity | VERIFIED: `validate.sh 005-md-generator-schema-contract --strict` → Errors 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **STUDY exemplars out of scope.** Corpus-conditioned prose, hydration, provenance envelopes, and source-leak gates are deferred to `../006-md-generator-study-exemplars/`.
2. **Baseline vocabulary is allowlisted.** Non-structural theme/vocabulary values are normalized to `unknown`/`other` rather than passed through; new structural buckets are added deliberately, not automatically.
3. **Learned/fuzzy ranking not built.** The research rank-9 prose-judge experiment remains advisory-only and out of scope.
<!-- /ANCHOR:limitations -->
