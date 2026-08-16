---
title: "Feature Specification: sk-vision build and tests"
description: "bun install, bun run build, prove dist/plugin.js, bun test, then rg residual dump identifiers. tsc substitute allowed if documented."
trigger_phrases:
  - "sk-vision bun build"
  - "sk-vision dist plugin"
  - "sk-vision bun test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/003-build-and-tests"
    last_updated_at: "2026-08-16T07:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored nested-phase copy pack and L1 suite."
    next_safe_action: "Implement files from this child's spec.md copy pack."
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/sk-vision/vision-runtime/dist/plugin.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-001-sk-vision-fork-of-opencode-senses-003-runtime-fork-003-build-and-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-vision build and tests

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-rebrand-identifiers |
| **Successor** | 004-gpu-smoke |
| **Handoff Criteria** | dist/plugin.js exists (or documented tsc substitute). bun test passes. rg residual dump identifiers is clean except LICENSE Adarsh line. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of `003-runtime-fork`.

**Scope Boundary**: Build and tests only. No GPU load. No host adapters.

**Dependencies**:
- 002-rebrand-identifiers Complete.

**Deliverables**:
- dist/plugin.js and passing dump tests after rebrand.

**Changelog**:
- When this phase closes, refresh the matching file in the parent changelog using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Rebranded source is not yet an importable plugin factory for 004.

### Purpose
Emit dist/plugin.js and run dump tests. Prove identifier inventory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- bun install && bun run build
- test -f dist/plugin.js
- bun test
- rg residual identifiers

### Out of Scope
- GPU load/status — next child
- Host adapters
- npm publish
- Skipping dist/plugin.js

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-vision/vision-runtime/dist/plugin.js` | Generate | Build output |
| `.opencode/skills/sk-vision/vision-runtime/node_modules/` | Generate | bun install |

### Implementer copy pack (follow exactly)

Stop and report if any of these is true: rebrand child is not Complete; you are about to skip emitting dist/plugin.js; you are about to run GPU load; you are about to create host adapters.

```bash
cd .opencode/skills/sk-vision/vision-runtime
# package.json script is "build": "bun run scripts/build.ts"
bun install
bun run build
test -f dist/plugin.js
bun test
rg -n 'SENSES_|opencode-senses|~/.cache/opencode-senses|<SENSES|senses_' .
```

If bun is unavailable, document a `tsc` substitute in this child's implementation-summary and still emit `dist/plugin.js`. Do not skip the artifact.

`rg` must return only the LICENSE Adarsh copyright line (if it mentions the upstream name) or zero hits. `senses_` tool keys must be gone.

Close this child with:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork/003-build-and-tests --strict
```
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | dist/plugin.js exists | test -f dist/plugin.js |
| REQ-002 | Dump tests run after rebrand | bun test exit 0, or documented substitute plus evidence |
| REQ-003 | Identifier inventory clean | rg only LICENSE exception |
| REQ-004 | No GPU required to close | Do not run load |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | No extra scope | Files outside Files to Change stay untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] test -f dist/plugin.js
- [ ] bun test passes or documented substitute
- [ ] rg residual dump identifiers clean except LICENSE
- [ ] This child validate.sh --strict exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | bun missing | Med | Document tsc substitute; still emit dist/plugin.js |
| Risk | Tests still using senses_ keys | High | Return to rebrand child |
| Dependency | Rebrand complete | High | Stop if Planned |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Close without dist/plugin.js? **A**: No. Artifact is required.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
