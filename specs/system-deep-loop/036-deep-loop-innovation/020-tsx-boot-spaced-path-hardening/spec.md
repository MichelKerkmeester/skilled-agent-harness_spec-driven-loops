---
title: "Feature Specification: tsx Boot + Containment-Root Hardening for Spaced Paths"
description: "Harden the deep-loop runtime so it stops crashing with ERR_MODULE_NOT_FOUND on loop-lock.js when launched from a checkout whose path contains a space under NODE_PRESERVE_SYMLINKS=1, and give containment an explicit repo-root override. The tsx re-exec across 10 .cjs entrypoints strips the flag it never needs; DEEP_LOOP_REPO_ROOT pins the containment root."
trigger_phrases:
  - "tsx boot spaced path hardening"
  - "loop-lock.js ERR_MODULE_NOT_FOUND deep-loop"
  - "NODE_PRESERVE_SYMLINKS tsx loader"
  - "DEEP_LOOP_REPO_ROOT containment override"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/020-tsx-boot-spaced-path-hardening"
    last_updated_at: "2026-08-26T16:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented + verified the tsx child-env flag strip and the DEEP_LOOP_REPO_ROOT override"
    next_safe_action: "Reconcile docs; commit; push per operator go-ahead"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/runtime-bootstrap.cjs"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The flag is not needed by the runtime (containment uses fs.realpath); stripping it in the tsx child is safe."
      - "DEEP_LOOP_REPO_ROOT gives an explicit containment-root escape hatch."
---
# Feature Specification: tsx Boot + Containment-Root Hardening for Spaced Paths

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-26 |
| **Source** | Cross-session bug report: deep-loop crashes on `loop-lock.js` from a spaced-path checkout |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 019-risky-followup-remediation |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop runtime is 19 `.ts` files with zero `.js` files; each `.cjs` entrypoint re-execs itself under the tsx loader (`--import <tsx>`), which remaps `.js` import specifiers to their `.ts` source. When the runtime is launched from a checkout whose absolute path contains a space (e.g. a "Mobile CLI" directory) **and** `NODE_PRESERVE_SYMLINKS=1` is set, the spaced, symlink-unresolved path stays in Node's module resolver, tsx fails to initialize its own internals and its remap, and the first remapped import in the state layer — `atomic-state.ts`'s `import … from './loop-lock.js'` — dies with `ERR_MODULE_NOT_FOUND`. Because the crash is in the state/locking layer, the loop never registers a completed iteration; the reducer rejects the state and the loop cannot advance past iteration 1 or synthesize. Every executor stalls identically — the harness is broken, not the worker.

Investigation showed the flag is neither set nor needed anywhere in the runtime: containment resolves every path through `fs.realpath` (flag-independent) and the repo root comes from `process.cwd()`. The flag was an operator addition that only breaks the loader.

### Purpose

Make the tsx re-exec immune to `NODE_PRESERVE_SYMLINKS` (strip it in the child, since the runtime never needs it), and give write-containment an explicit `DEEP_LOOP_REPO_ROOT` override so the loop can be pinned to the canonical space-free root when launched from a mirror.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A shared boot helper (`runtime-bootstrap.cjs`) exposing `tsxChildEnv(extra)` (strips `NODE_PRESERVE_SYMLINKS`) and `resolveContainmentRepoRoot(env, cwd)` (honors `DEEP_LOOP_REPO_ROOT`).
- Rewiring the tsx re-exec child env in all 10 `.cjs` entrypoints to `tsxChildEnv`.
- Wiring the two `write-containment` repo-root sites in `fanout-run.cjs` to `resolveContainmentRepoRoot`.
- A node:test regression that locks both helpers and guards all 10 entrypoints against re-leaking the flag.

### Out of Scope

- Shipping compiled `.js` artifacts / a build step (unnecessary once the loader boots).
- Upgrading tsx or changing Node version policy.
- The unrelated `AI_SESSION_CHILD` dispatch spawn in `codex-dispatch.cjs`.
- Operator-side guidance (don't set the flag; run from the space-free checkout; symlink the mirror's node_modules) — documented, not code.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/runtime-bootstrap.cjs` | Create | Shared `tsxChildEnv` + `resolveContainmentRepoRoot` helpers |
| `scripts/{10 entrypoints}.cjs` | Modify | Build the tsx child env via `tsxChildEnv` |
| `scripts/fanout-run.cjs` | Modify | Resolve the containment repo root via the helper (honors `DEEP_LOOP_REPO_ROOT`) |
| `scripts/tests/runtime-bootstrap.test.cjs` | Create | node:test regression |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The tsx child never inherits `NODE_PRESERVE_SYMLINKS` | `tsxChildEnv` strips it even when the parent sets it; the entrypoints boot under the flag. |
| REQ-002 | All 10 tsx re-exec entrypoints route through the helper | The regression test fails if any entrypoint builds the tsx child env from the raw parent env. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Containment honors an explicit repo-root override | `resolveContainmentRepoRoot` returns `DEEP_LOOP_REPO_ROOT` (resolved) when set, else `cwd`; a blank value is ignored. |
| REQ-004 | No behavior change for the default (unset) case | With neither env var set, the tsx child env and the repo root are unchanged from before. |
| REQ-005 | No whole-suite regression on either gate | The runtime vitest suite and `run-node-tests.mjs` show no new code-caused failures. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `.cjs` entrypoint boots its TypeScript implementation with `NODE_PRESERVE_SYMLINKS=1` set.
- **SC-002**: `resolveContainmentRepoRoot` resolves the override and ignores a blank value.
- **SC-003**: The regression test guards all 10 entrypoints; delta on both gates is clean.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Stripping the flag changes module-path strings for the tsx child | A module relying on preserved-symlink paths could shift | The runtime is symlink-agnostic by design (containment uses `fs.realpath`); verified on both whole-suite gates |
| Risk | Re-leak in a future entrypoint | The crash returns for spaced paths | The regression test fails if any of the 10 inherits the raw parent env |
| Dependency | `run-node-tests.mjs` gate | Catches node:test regressions the vitest-only gate misses | Run as part of verification |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether dropping `NODE_PRESERVE_SYMLINKS` also fully resolves the operator's containment concern — **not closed**: I found no code path by which the flag affects containment (`realpathSafe`/`fs.realpathSync` is flag-independent; `repoRoot` is `cwd`), so the observed catch-22 likely has a different cause. The `DEEP_LOOP_REPO_ROOT` override is provided as the explicit escape hatch regardless.

<!-- /ANCHOR:questions -->
