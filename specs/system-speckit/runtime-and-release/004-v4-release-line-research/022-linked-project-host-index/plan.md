---
title: "Implementation Plan: Phase 22: linked-project-host-index"
description: "Resolve the owning host of a linked project from the real location of its .skilled tree, read that host's index with a default scope of the linked track, and refuse a bare generation from the project."
trigger_phrases:
  - "linked project host index plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 22: linked-project-host-index

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM, vitest |
| **Framework** | system-spec-kit retrieval: trigger index lookup and generator, host detection |
| **Storage** | None |
| **Testing** | Linked-project cases in `host-trigger-index.vitest.ts`, the seven retrieval files, the cli vitest project, and the Barter reproduction run read-only |

### Overview
`owningHostRoot` in `host-index.mjs` asks git which repository holds the real location of a project's `.skilled` tree and returns it when it keeps an index. The lookup reads the caller's own index, then that owner's, then the packaged one, and scopes an owner's index to the folder the project's `specs` link names. The generator refuses a bare run from a linked project that has no index of its own.
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
- [x] The Barter reproduction finds the packet and the baselines hold
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer: the index location, not the host verdict.

### Key Components
- **`owningHostRoot` in `host-index.mjs`**: the git toplevel of the vendored tree's real location, when it differs from the caller and keeps an index
- **`defaultIndexSelection` in `lookup-trigger-index.mjs`**: index path, owner and default scope
- **`linkedTreeRefusal` in `generate-trigger-index.mjs`**: exit 2 for a bare run from a linked project

### Data Flow
The lookup asks git for the caller's root, reads its own index when present, else asks `owningHostRoot` for the owner, reads the owner's index and scopes it to the `specs` link target. The generator asks the same question before resolving any default and stops when the caller is a linked project with no index.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Lookup default index and scope | Gate 1 in hosts and projects | update | linked-project cases a to c, Barter reproduction |
| Lookup text output | Gate 1 readers | update | `paths` line asserted |
| Generator bare run | hosts, projects, CI | update | case d, own-index case |
| `runtime/data/README.md` | maintainers, hosts | update | read against the code |

Required inventories:
- `defaultIndexPath` callers: the lookup CLI and `host-trigger-index.vitest.ts`; it still returns a path.
- `parseArgs` consumers: `trigger-index.vitest.ts` reads `.limit` only; `specFolder` now distinguishes not given from empty.
- Matrix: Skilled checkout, host with its own index, linked project with an indexed owner, linked project with an unindexed owner, linked project with its own index, explicit `--index`, explicit `--spec-folder`, empty `--spec-folder`.
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
| Integration | linked project lookup, scope, fallback, generator refusal | `host-trigger-index.vitest.ts` |
| Regression | retrieval and trigger index | seven files, cli project |
| Reproduction | Barter `backend-system` | read-only lookup |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi DeepSeek | External | Green | none |
| cli-codex Luna | External | Red (quota until 2026-11-13) | DeepSeek took every brief |
| Barter checkouts | Read-only | Green | lookup and generator refusal run read-only |
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
| Setup (baselines, reproduction) | None | Implementation |
| Implementation (worker briefs) | Setup | Verification |
| Verification (suites, Barter reproduction, review) | Implementation | Close and commit |
<!-- /ANCHOR:phase-deps -->


---
