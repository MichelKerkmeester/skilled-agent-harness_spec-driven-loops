---
title: "Feature Specification: better-sqlite3 Version + Node-ABI Alignment"
description: "Resolve the dependency-seams failure: the runtime pins better-sqlite3 12.10.0 while system-spec-kit ships 12.11.1, an ABI hazard when both skills load native bindings in one process — and the Node runtime itself shifted 25.x to 26.x mid-session, so a one-shot rebuild goes stale. Decide the canonical version and a Node-ABI strategy that survives bumps."
trigger_phrases:
  - "better-sqlite3 version alignment"
  - "dependency-seams abi safety"
  - "node abi rebuild strategy"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/001-dependency-and-node-abi-alignment"
    last_updated_at: "2026-08-26T11:05:01.015Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the dependency/Node-ABI child"
    next_safe_action: "Phase 1: audit both skills' better-sqlite3 + Node ABI and decide the canonical version"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions:
      - "Canonical better-sqlite3 version: bump runtime to 12.11.1, or system-spec-kit to 12.10.0?"
      - "Node-ABI strategy: pin Node, postinstall rebuild, or boot-time ABI check + rebuild?"
    answered_questions: []
---
# Feature Specification: better-sqlite3 Version + Node-ABI Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-08-26 |
| **Failing test** | `tests/unit/dependency-seams.vitest.ts` |
| **Parent Spec** | ../spec.md |
| **Successor** | 002-command-rollout-mode-resolution |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`dependency-seams` asserts the deep-loop runtime installs the SAME native-dependency versions system-spec-kit pins, so that a single Node process loading both skills' `better-sqlite3` bindings stays ABI-safe. Today they disagree: the runtime resolves `better-sqlite3@12.10.0`, system-spec-kit resolves `12.11.1`. Two different builds of the same C++ addon in one process is not a clean failure — it can corrupt data or crash the process. Compounding this, the Node runtime shifted `25.6.1 → 26.7.0` during the same session, which already forced one `better-sqlite3` rebuild; a static version pin alone does not survive Node bumps because the compiled ABI is what actually has to match, not just the semver.

### Purpose

Pick one canonical `better-sqlite3` version across both skills, align it, and establish a Node-ABI strategy (so the compiled binding is valid for whatever Node is running) such that `dependency-seams` passes and the SQLite-backed tests stay green across Node bumps.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit the actual installed + pinned `better-sqlite3` (and zod, tsx) in both the runtime and system-spec-kit.
- Decide the canonical version and align both skills to it (npm).
- Define and implement a Node-ABI strategy: a boot-time / test-setup check that rebuilds `better-sqlite3` when the compiled ABI does not match the running Node, so the pin is self-healing.
- Verify `dependency-seams` + every SQLite-backed test pass.

### Out of Scope

- The rollout-mode failure (child 002).
- Upgrading Node or changing the repo's Node version policy (only reacting to whatever Node is running).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| runtime + system-spec-kit `package.json` / lockfiles | Modify | Align `better-sqlite3` to the canonical version |
| runtime boot / test-setup | Add | ABI-mismatch detection + rebuild hook |
| `tests/unit/dependency-seams.vitest.ts` | Modify (only if the pin constant moves) | Reflect the canonical version |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both skills resolve the SAME better-sqlite3 version | `dependency-seams` version assertion passes; the pinned constant matches both installs. |
| REQ-002 | The compiled binding is valid for the running Node | Loading `better-sqlite3` from each skill succeeds under the current Node; no `NODE_MODULE_VERSION` mismatch. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The pin is self-healing across Node bumps | An ABI-mismatch check rebuilds the binding automatically (documented, tested trigger). |
| REQ-004 | No regression in SQLite-backed suites | coverage-graph, db-lifecycle, and the DB `*-script` tests pass after alignment. |
| REQ-005 | The change is scoped to dependency metadata + one guard | The scoped diff is the version pin, lockfiles, and the ABI-guard module; no unrelated code changes. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `dependency-seams.vitest.ts` passes.
- **SC-002**: `better-sqlite3` loads from both skills under the current Node.
- **SC-003**: A forced Node-ABI mismatch is auto-repaired by the strategy (verified).
- **SC-004**: Whole-suite delta vs the 017 baseline shows no new failures.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Bumping better-sqlite3 in system-spec-kit | Could disturb the memory MCP | Prefer aligning the runtime up to system-spec-kit's version; verify the MCP loads + a memory op works |
| Risk | Auto-rebuild needs a toolchain | Rebuild fails on a machine without node-gyp | Detect + warn clearly; fall back to a documented manual step |
| Dependency | npm + native toolchain | Required for the version change + rebuild | Confirm availability before the change |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Direction of alignment (runtime → 12.11.1 vs system-spec-kit → 12.10.0) — decided in Phase 1 from which version each skill's other consumers require.
- Where the ABI-mismatch check lives (a shared boot module vs each test-setup) — decided in Phase 1.

<!-- /ANCHOR:questions -->
