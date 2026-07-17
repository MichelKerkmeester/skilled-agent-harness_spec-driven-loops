---
title: "Feature Specification: Spec Root Resolution Hardening"
description: "Phase-parent for the data-before-writers hardening of spec-root resolution: unify on canonical-first, canonicalize writers, and retire the specs alias. Research is complete; implementation is decomposed into five sequential phases."
trigger_phrases:
  - "spec root resolution hardening"
  - "canonical-first resolver"
  - "resolver registry"
  - "specs symlink retirement"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Spec Root Resolution Hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit/000-migration-from-soa-and-cleanup` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All five phases pass `validate.sh --strict`; R1–R10 green across L1–L4; alias retired with zero re-materialization; `validate.sh --strict --recursive` on this packet exits at or below baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec-root resolution is implemented at ~20 independent call sites with four different precedences (canonical-first, legacy-first, canonical-only, direct-path-first) and no single contract. A repo-root `specs` symlink masked the disagreement by collapsing both roots to one inode; the confirmed endpoint is canonical-first with explicit-path preservation, unique legacy-only read fallback, and fail-closed handling of divergent duplicates.

### Purpose
Deliver a regression-safe, data-before-writers rollout that unifies resolution on canonical-first, canonicalizes every automatic writer, normalizes readers, and retires the alias — proven with and without the symlink.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and continuity live inside the phase children below. Canonical findings live in `research/research.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Unify all unqualified resolvers on canonical-first with the five research guardrails.
- Canonicalize the automatic writers; add divergent same-ID collision rejection.
- Normalize readers with read-only legacy fallback; retire the `specs` alias.
- Validate R1–R10 across L1 (source), L2 (clean dist), L3 (OS/no-symlink), L4 (fault injection).

### Out of Scope
- The broader `000-migration` numbering/teardown workstreams (sibling children).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| resolver registry + collision classifier | Create | 001 | Single-source contract + fail-closed preflight |
| packet data under `.opencode/specs/**` + quarantine | Migrate | 002 | Canonicalize legacy-only under a writer freeze |
| `session-stop.ts`, `generate-context.ts`, `workflow.ts`, `create.sh` | Modify | 003 | Canonical writers as one source+dist bundle |
| `scripts/core/config.ts` + independent constructors | Modify | 004 | Canonical-first readers with legacy read fallback |
| `specs` symlink + R1–R10 × L1–L4 fixtures | Delete/Create | 005 | Retire alias + full validation matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-resolver-registry-and-preflight/ | S0–S1: resolver registry (single-source contract), R1–R10 expected-result table, fail-closed collision classifier, source/dist baseline | Planned |
| 2 | 002-data-canonicalization/ | S2: writer freeze, hashed classification manifest, resolve divergent duplicates, move legacy-only to canonical with lossless quarantine | Planned |
| 3 | 003-writer-canonicalization/ | S3: canonicalize Stop autosave, generate-context, phase-pointer refresh, both create.sh modes; add collision rejection; ship source+dist, unfreeze | Planned |
| 4 | 004-reader-normalization/ | S4: shared helper + independent constructors canonical-first with read-only legacy fallback; 28-day zero-hit compatibility window | Planned |
| 5 | 005-symlink-retirement-and-validation/ | S5: prove no-alias cases, commit alias removal, run R1–R10 × L1–L4 matrix + fault injection, capture strict-validate delta | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on this parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-resolver-registry-and-preflight | 002-data-canonicalization | Registry covers every research §4 site; classifier rejects divergent duplicates; baseline hashes recorded | Classifier fixtures pass; registry coverage audit clean |
| 002-data-canonicalization | 003-writer-canonicalization | All divergent duplicates resolved; legacy-only moved; quarantine restore proven lossless | Byte-exact restore test; zero divergent survivors |
| 003-writer-canonicalization | 004-reader-normalization | All writers canonical; alias-absent smoke clean; collision rejection active; source+dist shipped | Alias-absent writer smoke; collision unit tests |
| 004-reader-normalization | 005-symlink-retirement-and-validation | Readers canonical-first with read-only legacy fallback; compatibility window zero fallback hits | Reader fixtures; window instrumentation |
| 005-symlink-retirement-and-validation | (done) | R1–R10 × L1–L4 green; alias retired with zero re-materialization; strict-validate delta captured | Recorded matrix outputs + memory save |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- How many resolvers exist beyond the bounded research scan? (owned by phase 001; registry must be extensible)
- What created and exclusively maintains the `specs` symlink? (owned by phase 005; research left it unknown)
- Are Linux/macOS/Windows CI runners available for the mandatory L3 no-symlink rows? (owned by phase 005)
<!-- /ANCHOR:questions -->
