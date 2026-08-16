---
title: "Implementation Plan: Phase 1 source-baseline"
description: "Copy the pinned upstream source into a separate working package and freeze the comparison boundary."
trigger_phrases:
  - "source-baseline plan"
  - "fast-mode source inventory"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/001-source-baseline"
    last_updated_at: "2026-08-16T12:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Copied 16-file inventory into packages/, verified byte-identical"
    next_safe_action: "Hand off to 002-identity-config-compat"
    blockers: []
    key_files: ["../../context/pi-openai-fast-mode/"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Phase 1 source-baseline

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, raw source |
| **Framework** | Pi Extension API |
| **Storage** | None changed |
| **Testing** | Source inventory and reference diff |

### Overview
Select the package location outside `context/`, copy the pinned upstream source into a separate working package, and record the exact source boundary. Provenance is pinned by `context/README.md` (commit `9b28456`, v0.3.0); `context/pi-openai-fast-mode/` is the immutable source of truth. Do not rename identities or alter source logic here.


<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Pinned source and commit are named.
- [x] Later child ownership is explicit.

### Definition of Done
- [x] Working package exists outside `context/`.
- [x] Reference snapshot is unchanged.
- [x] Source inventory and rollback deletion path are recorded.


<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source snapshot plus isolated working copy.

### Key Components
- **Pinned context**: immutable comparison source at `context/pi-openai-fast-mode/` (commit `9b28456`, v0.3.0).
- **Working package**: later implementation target outside `context/`.

### Data Flow
Pinned source inventory → isolated copy → baseline handoff to identity/config compatibility.


<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Resolve the working package location outside `context/` and record it.
- [x] Inventory the pinned upstream snapshot (`context/README.md`, commit `9b28456`, v0.3.0) and record the concrete copy list: `src/commands.ts`, `src/config.ts`, `src/index.ts`, `src/payload.ts`, `src/status.ts`, `src/types.ts`, `tests/commands.test.ts`, `tests/config.test.ts`, `tests/extension.test.ts`, `tests/payload-status.test.ts`, `package.json`, `tsconfig.json`, `README.md`, `LICENSE`, `.gitignore`, `preview-img.png`.

### Phase 2: Core Implementation
- [x] Copy exactly the inventoried files into the working package.
- [x] Exclude `.git`, `node_modules`, and any local build/install artifacts.
- [x] Verify the copied tree has the expected entry points and package files.

### Phase 3: Verification
- [x] Confirm `context/pi-openai-fast-mode/` is clean via `git status`/`git diff` before and after the copy.
- [x] Record the deletion/re-copy rollback procedure.


<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Source inventory and reference unchanged | `find`, `rg`, `git diff` |
| Manual | Confirm package location and rollback | Shell inspection |


<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pinned upstream snapshot | Internal | Green | Cannot establish a trustworthy baseline |
| Repository layout | Internal | Open until decided | Later install source remains ambiguous |


<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Copy includes unintended files or the pinned reference changes.
- **Procedure**:
  1. Delete the working package directory: `rm -rf packages/pi-fast-mode-w-subagent-support`.
  2. Re-copy from the pinned source `context/pi-openai-fast-mode/` (commit `9b28456`, v0.3.0) using the exact copy list.
  3. Confirm the pinned reference is unchanged: `git status` in `context/pi-openai-fast-mode/` shows a clean tree.
<!-- /ANCHOR:rollback -->
