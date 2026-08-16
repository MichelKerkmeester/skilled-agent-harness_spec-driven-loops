---
title: "Feature Specification: Phase 3: package-baseline-gates"
description: "Finalize raw TypeScript packaging, licensing/provenance, and baseline typecheck/test/pack gates for the fork."
trigger_phrases:
  - "package-baseline-gates"
  - "pi extension package manifest"
  - "fast-mode package verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/003-package-baseline-gates"
    last_updated_at: "2026-08-16T14:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Package gates green: tsc 0, 57 tests, pack 9 files, provenance added"
    next_safe_action: "Hand off to the 002-subagent-handoff workstream"
    blockers: []
    key_files:
      - "../../context/pi-openai-fast-mode/package.json"
      - "../../context/README.md"
      - "../../research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 3: package-baseline-gates

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-identity-config-compat |
| **Successor** | None |
| **Handoff Criteria** | Raw TypeScript package loads, upstream behavior tests pass, provenance is preserved, and the package can be packed |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:phase-context -->
## Phase Context

This child owns the distributable package contract and the baseline gates. It does not add handoff behavior or mutate installation settings.

**Dependencies**:
- `001-source-baseline/` and `002-identity-config-compat/`.
- Pi package and extension-loader guidance in the installed runtime docs.

**Deliverables**:
- `pi.extensions` manifest pointing to raw `.ts`.
- Peer dependency and keyword metadata, unchanged MIT attribution, and README provenance for commit `9b28456`.
- Passing no-emit typecheck, upstream regression suite, and `npm pack --dry-run` output.

<!-- /ANCHOR:phase-context -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A correct source tree is not enough for Pi to load or discover the extension. The package must declare its raw TypeScript entry, keep Pi core packages as peers, preserve licensing, and prove that the identity/config work did not regress upstream behavior.

### Purpose
Produce an installable, attributable package baseline that is ready for the handoff workstream and later local/git installation.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `package.json` name, description, keywords, `pi.extensions`, scripts, peer dependencies, and included files.
- README usage/provenance and unchanged upstream MIT LICENSE.
- `tsconfig.json` no-emit gate, lockfile review, upstream tests, typecheck, and pack dry-run.

### Out of Scope
- Handoff implementation and child-process tests; see `../../002-subagent-handoff/`.
- Settings mutation, `/fast` command ownership, live UI/RPC checks, and PLUGINS.md; see `../../003-integration-and-tests/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Fork `package.json` and lockfile | Modify | Declare Pi package and raw extension entry |
| Fork `README.md`, `LICENSE`, `tsconfig.json` | Modify/Verify | Preserve provenance and no-emit loading contract |
| Fork `src/`, `tests/` | Verify | Run baseline tests after earlier child changes |

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pi can load the extension from the package manifest | `package.json` `pi.extensions` points at `./src/index.ts` (an existing raw `.ts` entry) and `npm pack --dry-run` lists it |
| REQ-002 | Core Pi packages remain peer dependencies and no compiled `dist/` is required | Pi core packages are declared in `peerDependencies` and no `dist/` is emitted; pack output contains raw source only |
| REQ-003 | Upstream behavior remains green after baseline changes | `npm run typecheck` and `npm test` both exit 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Licensing and provenance remain auditable | LICENSE content is unchanged and README cites `pi-openai-fast-mode` commit `9b28456` |
| REQ-005 | No dependency drift is introduced by packaging | `package.json` and lockfile diff show only intentional package identity/metadata changes |

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm pack --dry-run` shows the expected package name and source files.
- **SC-002**: Typecheck and upstream Vitest suites pass from the final child state.
- **SC-003**: The handoff workstream can consume the package without another packaging rewrite.

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A build step hides the raw extension entry | Pi install succeeds but runtime loading fails | Keep `pi.extensions`, `files`, and pack output explicit |
| Risk | License/provenance drift | Distribution becomes unauditable | Byte-check LICENSE and grep README for commit provenance |
| Dependency | Node.js >=22.19 and Vitest | Gates cannot run | Use the upstream declared toolchain and record versions |

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this planning pass; npm publication remains a top-level release decision.

<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Parent:** `../spec.md`
- **Research:** `../../research/research.md`
- **Package guidance:** Installed Pi package documentation cited by the research synthesis.
