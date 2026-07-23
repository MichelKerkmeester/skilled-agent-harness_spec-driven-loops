---
title: "Implementation Summary: sk-git Non-Hub Router Rollout"
description: "The target-local sk-git compiler rollout is executable and real-green while legacy remains authoritative. Deterministic artifacts, real-scorer replay, classified parity, closed algebra, protected hashes, and exact rollback all pass."
trigger_phrases:
  - "sk-git rollout implementation summary"
  - "sk-git real green evidence"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/009-non-hub-rollout/001-sk-git"
    last_updated_at: "2026-07-19T10:40:49Z"
    last_updated_by: "codex"
    recent_action: "Recorded green executable and strict validation evidence"
    next_safe_action: "No remaining packet work"
    blockers: []
    key_files:
      - "harness/run-sk-git.cjs"
      - "compiled/sk-git/policy.json"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-rollout-20260719"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-git Non-Hub Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-sk-git |
| **Verification Date** | 2026-07-19 |
| **Level** | 2 |
| **Status** | Complete |
| **Live Authority** | Legacy only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-git` now has an isolated compiled-router rollout that exercises its real authored intents, leaves, and default through the program's generic compiler. The child produces deterministic machine and human projections, evaluates typed fixtures through the frozen scorer, compares compiled decisions to the legacy router without granting authority, and proves that a fenced candidate can roll back to byte-identical prior manifest bytes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `harness/source-contract.json` | Created | Freeze authored leaves and standalone destination facts |
| `harness/*.cjs` | Created | Compile, generate, replay, fingerprint, and verify the child |
| `compiled/sk-git/**` | Created | Store policy, three projections, and nine typed fixtures |
| `activation/**` | Created | Store shadow manifests and reuse fenced activation logic |
| `parity/shadow-parity.cjs` | Created | Reuse the shared parity implementation |
| Packet docs and metadata | Created | Record Level-2 scope, plan, tasks, evidence, and continuity |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation imports the generic compiler and frozen canonical contract directly. A child-local adapter supplies only authored `sk-git` facts: one standalone destination, five intent selectors, ten leaves, the explicit quick-reference default, a local backend, workspace mutation metadata, and the authored force-push prohibition. All projections derive from one snapshot, and the default command verifies checked bytes without writing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep singleton behavior generic | Candidate cardinality and empty collections should produce N=1 behavior without a skill-name branch |
| Preserve positive default union but type zero signal as defer | This matches the authored legacy default while retaining the closed non-route algebra required by the rollout design |
| Classify rather than hide typed-vs-legacy differences | Zero-signal, ambiguous, and forbidden cases intentionally improve semantics while legacy remains authoritative |
| Run the frozen scorer in a subprocess | The gate exercises the real path and keeps the protected modules read-only |
| Keep activation shadow-only | A rollback proof does not justify live authority; the manifest remains legacy-authoritative |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Determinism | PASS: five compiles, two processes, 13 byte-identical generated artifacts; body `99fc04543f5e97591c8ba0e9c00802864c39b1267b5c8a1fa0421c30c79e6712`; effective `7912844c9e6cdcf9e16bbfebdfa43e317c7334aee4147e8a1bcfc641253ef7b8` |
| Authored topology | PASS: one candidate, five selectors, ten leaves, authored default, no bundles/handoffs/cross-target edges, null overlay, static provenance |
| Real scorer | PASS: nine typed rows; deliberate extra-resource falsifier rejected |
| Shadow parity | PASS: six exact matches, three classified semantic mismatches, zero effects, no gold mutation, legacy authoritative |
| Closed algebra | PASS: defer, one clarify, reject, target-free/authority-free non-routes, zero rank calls |
| Rollback | PASS: prior/restored manifest SHA-256 `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`; fence 2; stale epoch rejected |
| Protected files | PASS: all three final SHA-256 values match the pre-write baselines |
| Syntax | PASS: all six CommonJS files pass `node --check` |
| Strict packet validation | PASS: zero errors, zero warnings, `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR | Target | Actual | Status |
|-----|--------|--------|--------|
| Deterministic bytes | Stable across processes | Two isolated processes match | Pass |
| Offline operation | No network or installs | Node built-ins and local imports only | Pass |
| Zero live authority | Legacy serves throughout | `live_authority=legacy`, effects zero | Pass |
| Protected boundary | Scorer files unchanged | Three baseline hashes match | Pass |
<!-- /ANCHOR:nfr-verify -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The three semantic mismatches are expected and classified, not exact legacy matches: typed zero signal defers instead of exposing the legacy default union; ambiguity clarifies instead of returning multiple legacy leaves; forbidden force-push rejects instead of returning the legacy fallback. Legacy remains authoritative, so these produce no live effect.
2. The activation drill proves selection, fencing, stale rejection, and byte-exact rollback in the shadow harness. It does not activate `sk-git` or any live router.
3. The policy card terminates at `DOCUMENT_ONLY_UNATTESTED`; it does not claim live freshness or committed effects.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Reuse the compiler child as the archetype | Reused its modules but did not run its phase gate | Its checked `mcp-code-mode` artifact has known unrelated migration drift |
| No shared edits | No shared or live files changed | The target-local adapter was sufficient for real-green verification |
<!-- /ANCHOR:deviations -->
