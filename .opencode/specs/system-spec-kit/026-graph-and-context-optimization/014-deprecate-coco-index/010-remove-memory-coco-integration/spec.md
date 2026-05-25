---
title: "010: Remove memory's live CocoIndex integration (discovered scope gap, in progress)"
description: "Remove the CocoIndex coupling the 001 research missed inside system-spec-kit (memory): daemon-probe, cocoindex-path (isCocoIndexAvailable/getCocoIndexBinaryPath), cocoindex-calibration overfetch telemetry, cocoIndexAvailable threading, and the misleading coco-keyed vector-channel warning. Also fixes the latent phase-002 cross-skill typecheck break."
trigger_phrases:
  - "remove memory cocoindex integration"
  - "deprecate cocoindex phase 010"
  - "memory coco scope gap"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Remove memory's live CocoIndex integration

<!-- SPECKIT_LEVEL: 1 -->

> **Discovered scope gap.** The 12-iteration 001 research characterized memory's coco coupling as the opt-in rerank sidecar only (D1). It MISSED a live, first-class CocoIndex integration woven through memory's hot paths. This phase removes it. Detail map below; not in `../resource-map.md §4` (that map is the addendum gap).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In progress |
| **Created** | 2026-05-25 |
| **Branch** | `main` |
| **Depends on** | 002 (decouple-code-graph) — 010 also repairs 002's latent break |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
system-spec-kit (memory) carries a live CocoIndex integration the research missed: `lib/cocoindex/daemon-probe.ts`, `lib/utils/cocoindex-path.ts` (`isCocoIndexAvailable`/`getCocoIndexBinaryPath`), `lib/search/cocoindex-calibration.ts` (post-fetch overfetch telemetry), `cocoIndexAvailable` threaded through `context-server.ts`/`session-snapshot.ts`/`memory-surface.ts`/both `session-prime` hooks/`code-graph-boundary.ts`, the `cocoIndex` MergeInput hint in `compact-inject.ts`, and a coco-keyed `"vector channel unavailable, lexical-only"` warning in `memory-search.ts`. Memory's REAL search (hybrid vector/bm25/fts/graph/degree via its own embedder + `lib/search/vector-index.ts`) is independent of the coco daemon — the coco coupling is vestigial telemetry + a misleading warning. Additionally, phase 002 removed `cocoIndex`/`cocoIndexAvailable` from system-code-graph's exported types (`MergeInput`, `StartupBriefResult`) but left memory's consumers referencing them, so HEAD does not typecheck.

### Purpose
Excise memory's vestigial CocoIndex coupling and repair the 002 cross-skill type break, with `npm run typecheck` AND full `npm run test` (vitest) green as the hard gate. No change to actual memory search results.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- DELETE `lib/cocoindex/` (daemon-probe.ts + README.md), `lib/utils/cocoindex-path.ts`, `lib/search/cocoindex-calibration.ts`, and their dedicated tests (`tests/cocoindex-daemon-probe.vitest.ts`, `stress_test/search-quality/w6-cocoindex-calibration.vitest.ts`, `w11-cocoindex-calibration-telemetry.vitest.ts`)
- Remove all imports/usages (~120 refs across ~15 src files; heaviest `session-resume.ts`=33, `memory-search.ts`=14, `search-decision-envelope.ts`=10)
- Remove coco fields from contracts: `cocoIndexAvailable`, `MergeInput.cocoIndex`, `searchDecisionEnvelope.cocoindexCalibration` + `.cocoIndex`, `StartupBrief`/`StartupBriefResult` coco fields
- Remove the coco-keyed vector-channel warning (do NOT re-key it; out of scope)
- Update ~20 tests: drop coco-specific cases ONLY; preserve all non-coco coverage
- Remove coco from system-spec-kit DOCS (SKILL.md, README, manual_testing_playbook, references, stress_test READMEs)
- Repair the 002 cross-skill type break (consumers stop referencing removed code-graph coco fields)

### Out of Scope
- Adding a correct embedder-keyed vector-availability warning (pre-existing gap, separate work).
- Editing frozen historical spec docs under `.opencode/specs/**`; changelogs (frozen).
- Any rename of a symbol or file (the 009 failure mode — REMOVE only).

### Files to Change
Approx ~35 (src + tests + docs). Compiler-driven: delete coco files first, then `tsc` enumerates every consumer.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Delete coco source + dedicated test files; remove all usages | `rg -i cocoindex` in system-spec-kit src = 0 (excl changelog) |
| REQ-002 | Typecheck gate | `npm run typecheck` exit 0 (repairs the 002 break) |
| REQ-003 | Behavior gate | Full `npm run test` (vitest) exit 0; non-coco assertions preserved; test count drop ≈ deleted coco tests only |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Docs coco-free | system-spec-kit SKILL.md/README/playbooks/references have no live coco refs |
| REQ-005 | Rollback point | Pre-phase git commit hash recorded before edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run typecheck` + full `npm run test` both exit 0 after removal.
- **SC-002**: Memory search results unchanged (coco was vestigial telemetry; real search = embedder-backed hybrid channel).
- **SC-003**: Repo-wide live coco grep (excl specs/changelogs/014 packet) = 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Silent search-quality regression if coco were load-bearing | High | Verified memory's real vector channel is embedder-backed (`vector-index.ts`/`hybrid-search.ts`), coco is post-fetch telemetry only |
| Risk | codex weakening tests to pass vitest | Med | Hard gate + diff review of test changes + before/after test count |
| Risk | Out-of-scope drift across ~35 files | Med | Pre-phase commit; scope-lock system-spec-kit only; REMOVE-not-rename |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Operator approved full removal (2026-05-25). Behavioral safety (embedder-backed real search) verified pre-execution.
<!-- /ANCHOR:questions -->
