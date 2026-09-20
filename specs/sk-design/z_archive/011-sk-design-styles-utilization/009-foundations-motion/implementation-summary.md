---
title: "Implementation Summary: foundations + motion styles-library wiring (Phase C)"
description: "design-foundations and design-motion are wired to the styles library through the phase-007 seam and verified: a typed compatibility graph with discriminated relation/basis unions, a transformation ledger bound to edge endpoints, a restraint-first motion gate that runs before retrieval, source-bound eligibility, and validated negative baselines. 43/43 tests pass; an adversarial review closed two value-level authority bypasses."
trigger_phrases:
  - "foundations motion summary"
  - "compatibility graph status"
  - "motion restraint gate status"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/009-foundations-motion"
    last_updated_at: "2026-07-18T19:51:10Z"
    last_updated_by: "claude"
    recent_action: "Built and verified foundations + motion wiring; 43/43 tests, authority bound to source"
    next_safe_action: "Packet 011 complete — run the deep-review + doc-alignment pass"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-foundations-motion-011-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Foundations relation/basis are discriminated unions; an unresolved basis yields only not-assessed."
      - "Motion eligibility is bound to the hydrated source; a relabeled incidental source fails closed."
---
# Implementation Summary: foundations + motion styles-library wiring (Phase C)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

> **Complete — built, adversarially reviewed, and verified.** `node --test` is 43/43 across both modes.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-foundations-motion |
| **Status** | Complete — implemented, reviewed, verified |
| **Level** | 3 |
| **Depends On** | `../004-retrieval-substrate/`, `../007-shared-context-seam/`, `../008-interface-audit-pilots/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two relationship-heavy design modes wired to the styles library through the phase-007 seam, each enforcing the fixed authority order via closed typed schemas.

- **design-foundations** — a relationship blueprint plus a typed dependency/compatibility graph (`works-with` / `conflicts-with` / `not-assessed` as discriminated relation/basis unions), a transformation ledger bound to edge endpoints and authority lock IDs, and downstream `not-assessed` checks. The corpus can never lock a target-measured value.
- **design-motion** — a restraint-first query gate ("should this move at all?") that runs BEFORE any retrieval, polarity-aware eligibility with hard negatives bound to the hydrated source's generation + content hashes, purpose/state archetypes, and validated negative baselines.

The corpus is non-authoritative throughout: it explains relationships and critique but never selects a mode, assigns severity/score, proves a11y/perf, establishes copying, authorizes exact reuse, or owns a fix.

### Files Created

| File | Action | Result |
|------|--------|--------|
| `design-foundations/corpus/relationship-blueprint.mjs` | Create | Discriminated compatibility graph, transformation ledger, explicit-none request, not-assessed |
| `design-foundations/corpus/__tests__/**` | Create | Adversarial fixtures + tests (enum-smuggling, explicit-none, ledger binding) |
| `design-motion/corpus/motion-evidence.mjs` | Create | Restraint gate, source-bound polarity-aware eligibility, purpose/state archetypes, negative baselines |
| `design-motion/corpus/__tests__/**` | Create | Adversarial fixtures + tests (relabeled source, baseline schema, restraint-before-retrieval) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built by a `cli-codex gpt-5.6-sol` (high, fast) implementer to `spec.md`/`plan.md`/`tasks.md`/`decision-record.md` in an isolated worktree, consuming the phase-004 engine and the phase-007 seam and mirroring the phase-008 typed-schema pattern. A `gpt-5.6-sol` xhigh-fast adversarial reviewer found two value-level authority bypasses: allowed enum values combined to smuggle a compatibility verdict + target-value lock (foundations), and motion candidate claims were unbound to the hydrated source (relabeling an incidental style as `positive/explicit-temporal` passed). A scoped fix pass closed them with discriminated relation/basis + transformation/lock unions, ledger sources bound to edge endpoints, rejection of target-derived corpus records, and a closed selected-mode attestation binding motion eligibility to the source generation + content hashes; explicit-none was made reachable and the negative-baseline schema closed. Scope stayed locked to `design-foundations/**` and `design-motion/**`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Discriminated relation/basis + transformation/lock unions | An inconsistent verdict+lock combination becomes unrepresentable (ADR-001) |
| Corpus never locks target-measured values | Target-derived corpus records are rejected; only `not-assessed` when the basis is unresolved (ADR-002) |
| Motion eligibility bound to the hydrated source | A relabeled incidental source cannot masquerade as evidence; attestation is over typed source evidence |
| Restraint gate runs before retrieval | "Do not move" is answerable without hydrating anything |
| Negative outcomes fail closed | `not-assessed`, `no-fit`, `no-temporal-authority` are validated evidence, never thrown errors |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Run by the implementer and independently re-run by the orchestrator.

| Check | Result |
|-------|--------|
| Foundations authority (typed) | VERIFIED: the enum-smuggling combination (verdict + target-value lock) is rejected; ledger sources bind to edge endpoints |
| Motion source-binding | VERIFIED: a relabeled incidental source fails closed; eligibility is bound to source generation + content hashes |
| Foundations explicit-none | VERIFIED: `selection.mode:'none'` accepts an empty graph and is reachable |
| Motion negative baseline | VERIFIED: a baseline missing any audit field (target evidence ID, affected states, preserved feedback, instant equivalent, reduced-motion) is rejected |
| Restraint-before-retrieval | VERIFIED: the restraint gate can answer "do not move" without hydration |
| Fail-closed | VERIFIED: missing-manifest calls return validated `no-fit` / `no-temporal-authority`, not a throw |
| Test suite | VERIFIED: `node --test` 43/43 pass, 0 skipped |
| Packet validity | VERIFIED: `validate.sh 009-foundations-motion --strict` → Errors 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two modes wired; hub-level orchestration deferred.** Foundations and motion consume the seam directly; broader hub orchestration across all modes is future work.
2. **Compatibility graph is corpus-derived and non-authoritative.** It surfaces relationships and `not-assessed` honestly but never proves or locks a target value.
3. **Negative baselines are opt-in evidence.** They are validated when present; motion does not require a baseline to answer "do not move".
<!-- /ANCHOR:limitations -->
