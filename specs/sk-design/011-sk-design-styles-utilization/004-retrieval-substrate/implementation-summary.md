---
title: "Implementation Summary: styles-library retrieval substrate"
description: "The Phase A retrieval engine over the 1,290-bundle sk-design styles library is built and verified: a committed byte-stable manifest, deterministic eligibility-first selection, a disposable in-memory FTS/BM25 accelerator with source-scan fallback, compact candidate cards, realpath-contained generation-guarded hydration, and a manifest-bound CORPUS_USE_PROOF v1 gate — 17/17 fixtures pass after an adversarial review closed five P1 defects."
trigger_phrases:
  - "retrieval substrate status"
  - "retrieval substrate summary"
  - "corpus use proof status"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/004-retrieval-substrate"
    last_updated_at: "2026-07-18T17:30:41Z"
    last_updated_by: "claude"
    recent_action: "Built and verified the retrieval engine; 17/17 fixtures pass, byte-stable across locales"
    next_safe_action: "Integrate 004 and start Wave 2 (005 md-gen schema + 007 shared context seam)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-retrieval-substrate-011-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deterministic eligibility decides membership; lexical scores only order the eligible set."
      - "The FTS accelerator ships in-memory and disposable; no committed DB artifact."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

<!-- STATUS: Complete — engine implemented, adversarially reviewed, and verified (17/17 fixtures). -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-retrieval-substrate |
| **Status** | Complete — implemented, reviewed, verified |
| **Level** | 3 |
| **Estimated Effort** | ~5-8 engineer-days (Phase A) + 1-2 days (FTS accelerator) |
| **Origin** | Fourth child (first implementation phase) of the styles-library utilization phase parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Phase A retrieval engine over the committed 1,290-bundle corpus at `.opencode/skills/sk-design/styles/`. A single local CLI (`style-library.mjs`) exposes `build --write`, `build --check`, `query`, and `hydrate`, backed by eight ES-module engine files, seven fixture suites, and one committed byte-stable manifest. Deterministic eligibility decides membership before any ranking; the FTS/BM25 projection is built in-memory and discarded; hydration is realpath-contained and generation-guarded; and a manifest-bound `CORPUS_USE_PROOF v1` gate refuses un-provenanced or averaged corpus claims.

### Files Created

| File | Action | Result |
|------|--------|--------|
| `styles/_engine/style-library.mjs` | Create | CLI: `build --write/--check`, `query`, `hydrate` |
| `styles/_engine/manifest.mjs` | Create | Manifest schema, refresh, content/generation hashing, atomic write, mutation guard |
| `styles/_engine/ordering.mjs` | Create | Locale-independent code-point comparator for all committed ordering |
| `styles/_engine/eligibility.mjs` | Create | Required-facet, exclusion, and provenance/rights gates (first stage) |
| `styles/_engine/rank-fts.mjs` | Create | Disposable in-memory FTS/BM25 projection + bounded source-scan fallback |
| `styles/_engine/cards.mjs` | Create | Compact byte-capped candidate cards |
| `styles/_engine/hydrate.mjs` | Create | Realpath-contained, generation-guarded, mode-scoped hydration |
| `styles/_engine/corpus-use-proof.mjs` | Create | `CORPUS_USE_PROOF v1` schema + manifest-bound validator + ready gate |
| `styles/_engine/__tests__/**` | Create | Seven fixture suites (17 tests) |
| `styles/_retrieval-manifest.json` | Create | Committed byte-stable manifest (1,290 records) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built by a `cli-codex gpt-5.6-sol` (high reasoning, fast tier) implementer working strictly to `spec.md`/`plan.md`/`tasks.md`, in an isolated integration worktree. A `gpt-5.6-sol` xhigh-fast adversarial reviewer then audited the diff and returned 0 P0 / 7 P1. Five were confirmed real and fixed in a scoped second pass — locale-sensitive ordering, blind trust of committed derived fields, a self-attestation-only proof gate, a symlink-target mutation blind spot, and shallow tests. One was rejected as spec-correct (`unavailable` for a stale selected artifact per tasks.md T018), and one was a by-design phase boundary (the gate has no CLI consumer until downstream phases). Scope stayed locked to `styles/_engine/**` and the manifest; no corpus bundle or other packet was touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Committed checked manifest is the only retrieval artifact | Canonical, reviewable, hash-bound; ~1 ms scans beat grep or a stale hand-index (ADR-001) |
| Deterministic eligibility decides; scores only explain ordering | Composition and negation need determinism; P@5 0.60 vs BM25 0.33 in the research holdout (ADR-002) |
| Disposable in-memory FTS5/BM25 accelerator | Fast ordering with no drift and nothing committed; sub-second rebuild (ADR-003) |
| Generation-guarded, realpath-contained hydration + source-scan fallback | Refuse stale values and path escapes, degrade rather than fail hard (ADR-004) |
| Manifest-bound `CORPUS_USE_PROOF v1` blocking ready-gate | No un-provenanced or averaged corpus output ships; evidence is bound to the real record (ADR-005) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All fixtures were run by the implementer and independently re-run by the orchestrator.

| Check | Result |
|-------|--------|
| `build --check` byte-stability (REQ-001) | VERIFIED: `--write` then two `--check` runs byte-identical; empty added/changed/removed |
| Locale byte-stability (NFR-S02) | VERIFIED: `build --check` under `LC_ALL=tr_TR.UTF-8` returns `ok:true`, no drift (code-point comparator) |
| Eligibility-before-ranking (REQ-002) | VERIFIED: end-to-end query test; 1,169 of 1,290 filtered before ranking; ineligible never carded |
| Generation-guarded hydration (REQ-003) | VERIFIED: whole-generation mismatch → `generation-mismatch`; stale selected artifact → `unavailable` (T018) |
| Path-containment (REQ-009) | VERIFIED: `..` traversal and escaping symlinks rejected with `path-escape` via realpath containment |
| `CORPUS_USE_PROOF v1` gate (REQ-004) | VERIFIED: fabricated fingerprints, mismatched provenance, and false anti-copy all fail the manifest-bound gate |
| Poisoned-manifest integrity | VERIFIED: `--check` fully re-derives from source and flags hand-poisoned derived fields |
| Change/invalidation fixtures (REQ-008) | VERIFIED: 17/17 across add/change/delete, fallback, mismatch, symlink mutation, ordering, proof |
| Packet validity | VERIFIED: `validate.sh 004-retrieval-substrate --strict` → Errors 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CI wiring deferred (T028 / CHK-122).** No per-skill test-runner CI harness exists and `.github/` is outside this phase's scope lock; the 17 fixtures pass locally via `node --test` and CI selectors land when a design-test job is introduced.
2. **Committed manifest is ~3.6 MB.** Full per-style facts for 1,290 real bundles run larger than ADR-001's early ~503 KB estimate; it stays a byte-stable derived artifact with ~1 ms metadata scans, so the size is a storage cost, not a retrieval cost.
3. **Proof gate has no runtime consumer yet.** By design — phase 004 provides the validator; the first consumer wires it in `../005-md-generator-schema-contract/` and later mode phases.
4. **FTS accelerator ships in-memory.** It uses `node:sqlite` `:memory:` and is discarded each run; a persisted projection is deferred until measured repeated-query load justifies it.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:architecture-summary -->
## Architecture Decisions Summary

| ADR | Decision | Status | Impact |
|-----|----------|--------|--------|
| ADR-001 | Committed checked manifest is the only retrieval artifact | Accepted | Canonical, reviewable, hash-bound index |
| ADR-002 | Deterministic eligibility decides; scores only order | Accepted | Composition/negation correctness; slop resistance |
| ADR-003 | Disposable same-generation FTS5/BM25 accelerator | Accepted | Fast ordering, no drift, uncommitted |
| ADR-004 | Generation-guarded, realpath-contained hydration + fallback | Accepted | No stale-value leakage, no path escape, resilient retrieval |
| ADR-005 | Manifest-bound `CORPUS_USE_PROOF v1` blocking ready-gate | Accepted | No un-provenanced/averaged corpus output ships |

See `decision-record.md` for full ADR documentation. All five are Accepted after the build validated.
<!-- /ANCHOR:architecture-summary -->

---

## Follow-Up Items

- [x] Implement Phase 1-3 per `tasks.md` (T001-T027, T029-T030)
- [ ] Wire CI selectors for the engine fixtures (T028) when a design-test CI job lands
- [ ] First runtime consumer of the retrieval engine + proof gate lands in `../005-md-generator-schema-contract/`
- [x] Promote ADR-001..005 from Proposed to Accepted after the build validated
