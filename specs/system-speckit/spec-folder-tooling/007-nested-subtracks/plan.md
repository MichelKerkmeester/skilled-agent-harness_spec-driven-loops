---
title: "Implementation Plan: Allow a declared sub-track to hold declared sub-tracks (max two sub-track levels under a track)"
description: "Extend every sub-track predicate in place by one declared level: the shared track reader recurses once, each shell and Node predicate accepts a level-2 sub-track inside a declared level-1 one, and each depth limit moves from one to two. A new test file runs every tool against one two-level tree."
trigger_phrases:
  - "nested subtracks plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Allow a declared sub-track to hold declared sub-tracks (max two sub-track levels under a track)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM/CommonJS, TypeScript, bash |
| **Framework** | None |
| **Storage** | `description.json` and `graph-metadata.json` files under `specs/` |
| **Testing** | vitest, `--project cli` |

### Overview
Each tool that recognises a declared sub-track gains one more declared level, and each depth limit moves from one sub-track level to two. The track reader keeps a single scan function per view that recurses once. Proof is a new two-level test file, the existing sub-track suites unchanged in result, and a byte-for-byte comparison of the old and new reader on one-level trees.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npx vitest run --config vitest.config.ts --project cli` reports no failed test file
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place predicate extension.

### Key Components
- **`track-roots.mjs`**: the shared reader the sweep, the refresh writer and the pre-push gate use. One recursive scan per view replaces the inline level-1 loop.
- **Shell and Node predicates**: `create.sh`, `validate.sh`, `archive.sh`, `relocate.mjs`, `repair-derived.cjs`, the orchestrator and the graph parser each keep their own sub-track test, extended to accept a level-2 sub-track whose parent is a declared level-1 one.

### Data Flow
A declared `description.json` marks a container. The reader lists it under its parent, the refresh writer writes its `children_ids` from the reader, and every packet tool reads the same declarations directly from disk.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/lib/track-roots.mjs` | Producer of track entries and diagnostics | update | `nested-subtrack.vitest.ts`, `scratch/one-level-parity.txt` |
| `suggest-subtracks.mjs`, `spec-gate-core.mjs` | Read level-1 sub-tracks only | unchanged | `suggest-subtracks.vitest.ts` and `spec-gate-core` tests pass |

Required inventories:
- Same-class producers: `rg -n -i "sub-?track" runtime shared` listed every predicate this plan changes.
- Consumers of changed symbols: `MAX_SUB_TRACK_DEPTH` is read by `sweep-track-roots.mjs` and `relocate.mjs` only.
- Matrix axes: depth (1, 2, 3) by tool (reader, sweep, refresh, create, validate, graph, repair, archive, relocate).
- Algorithm invariant: a folder is a sub-track only when it and every sub-track above it declare `level: "sub-track"`, it sits at most two levels under a track, and no link is followed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup captures the cli vitest and sweep baselines into `scratch/`. Implementation extends the reader, then each predicate, then the docs. Verification reruns both baselines, the new test file and strict validation. `tasks.md` owns the ordered tasks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Reader both views, sweep, refresh seeding | vitest |
| Integration | `create.sh`, `validate.sh`, `archive.sh`, `relocate.mjs`, `repair-derived.cjs`, graph refresh on a temp repository | vitest |
| Manual | Old-versus-new reader on one-level trees and on this repository | `node scratch/one-level-parity.mjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Compiled runtime `dist/` (`npm --prefix .skilled/skills/system-spec-kit run build`) | Internal | Green | `validate.sh` and graph refresh would run the old TypeScript |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the sweep or pre-push gate reports drift on a one-level tree that matched before.
- **Procedure**: revert the commit that carries this change, then rebuild the runtime with `npm --prefix .skilled/skills/system-spec-kit run build`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, since the baseline must be taken before any source edit |
| Implementation | Setup | Verification |
| Verification | Implementation and a rebuilt `dist/` | Closure |
<!-- /ANCHOR:phase-deps -->

---
