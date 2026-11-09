---
title: "Implementation Plan: Phase 21: host-root-marker-refresh"
description: "Make upgrade-legacy use the host repository it runs from, make the marker proof count every anchor the template emits, and measure Barter's marker census on a copy."
trigger_phrases:
  - "host root marker refresh plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 21: host-root-marker-refresh

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (ESM and CommonJS), vitest |
| **Framework** | system-spec-kit spec tooling: upgrade-legacy, heal-spec-docs, retrieval host detection |
| **Storage** | None |
| **Testing** | One new vitest file, new cases in the refresh-markers file, the heal, template-structure and upgrade-legacy files, the cli vitest project, and a dry run over a scratch copy of Barter |

### Overview
`upgrade-legacy.mjs` takes its repository from `host-index.mjs` when the caller's checkout is a host, reads only the host's `specs/`, skips folders the host ignores and says how many it skipped. `provenMarker` in `heal-spec-docs.cjs` counts every anchor the template emits, and `refreshMarker` stays quiet about a document already at its level's marker. A dry run over a copy of Barter's packets measures what a Barter refresh would do.
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
- [x] The Barter census is measured and the baselines hold
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer, reusing the host detection the trigger index already ships.

### Key Components
- **`hostRepositoryRoot` and `defaultSpecRoots` in `upgrade-legacy.mjs`**: repository and default roots for a host caller
- **`ignoredSpecFolders` in `upgrade-legacy.mjs`**: one `git check-ignore` per run, with a stderr count
- **`provenMarker` in `heal-spec-docs.cjs`**: emitted anchors for the extra check, required and optional anchors for the missing check

### Data Flow
A run asks git for the caller's checkout, and `isHostRepository` decides whether that checkout or the script's own tree is the repository. Discovery walks the roots, drops ignored folders in a host, and the refresh asks `refreshMarker` per lane document, which asks `provenMarker` for the level's marker.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| upgrade-legacy repository root and default roots | hosts, maintainers | update | host-root vitest cases |
| upgrade-legacy stderr | hosts | update | host-root case a |
| `provenMarker` anchor sets | `refreshMarker`, `headerAdd` | update | refresh-markers unit cases, heal suites |
| Two READMEs | maintainers | update | read against the code |

Required inventories:
- `provenMarker` callers: `refreshMarker` (opt-in) and `headerAdd` (default lane mode), both in `heal-spec-docs.cjs`.
- `host-index.mjs` callers: the trigger index lookup and generator, and now `upgrade-legacy.mjs`.
- Matrix: host with `.skilled` symlinked outside, host with an ignored mirror, explicit host root, plain checkout; proof on a current phase child, a current document with a custom anchor, an old document with a custom anchor.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: setup records baselines and the measured defect, implementation sends one worker brief per change, verification reruns the suites and the Barter dry run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | host default, explicit host root, plain checkout | `upgrade-legacy-host-root.vitest.ts` |
| Unit | proof on current and old documents | `upgrade-legacy-refresh-markers.vitest.ts` |
| Regression | heal, template structure, upgrade-legacy, host trigger index | eleven files, cli project |
| Measurement | Barter census | dry run over a scratch copy |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi DeepSeek | External | Green | none |
| cli-codex Luna | External | Red (quota until 2026-11-13) | DeepSeek took every brief |
| Barter checkout | Read-only | Green | copied to the scratchpad |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a baseline-passing test fails after the change.
- **Procedure**: `git revert <phase commit>`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baselines, measured defect) | None | Implementation |
| Implementation (worker briefs) | Setup | Verification |
| Verification (suites, Barter dry run, review) | Implementation | Close and commit |
<!-- /ANCHOR:phase-deps -->


---
