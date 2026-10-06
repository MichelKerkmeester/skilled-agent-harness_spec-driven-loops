---
title: "Feature Specification: Make create.sh write new packets under the canonical specs root"
description: "create.sh still wrote new packets to .opencode/specs after that back-link to specs/ was removed on 2026-09-20, so packets landed in a stray tree nothing reads and a track numbered from 001. New packets now go to the canonical specs/ root, and the writer test that pinned the old root now guards the new one."
trigger_phrases:
  - "create.sh canonical specs root"
  - "create.sh writes to .opencode/specs"
  - "spec packet lands in .opencode/specs"
  - "track numbering restarts at 001"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Make create.sh write new packets under the canonical specs root

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-09-23 |
| **Branch** | None. Work on `main`, packet folder only |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet `032-relocate-specs-folder` moved the real spec tree to `specs/` on 2026-08-08 and left `.opencode/specs -> ../specs` as a back-link. `create.sh` kept writing to `.opencode/specs`, which worked only through that link. Commit `befe3993f1` removed the link on 2026-09-20, and from then on every new packet landed in a stray `.opencode/specs/` tree that no reader uses, and `--track` numbered from that empty tree, so it restarted at 001. The script still exited 0. The one test meant to guard the root, `spec-root-writer-autosave.vitest.ts`, asserted the old behaviour and passed.

### Purpose
`create.sh` writes every new packet under the canonical `specs/` root, and a test fails if it ever targets the legacy root again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `create.sh` roots new packets at `specs/`, with its comments and help text naming that root
- The writer test flipped to the canonical root, plus a track case that pins the numbering
- The resolver registry's pointer and description for the `create.sh` root selection
- A superseded notice on the alias retirement runbook, which describes the reverse migration

### Out of Scope
- The path guard and the relative-path fallback that still accept `.opencode/specs` - they keep legacy packets readable
- `test-phase-validation.js` and `test-phase-system.js` - they cannot load at all, because they are CommonJS files in an ES-module package, and nothing automated runs them. Reviving them is its own change
- Rewriting the runbook for the current direction - nothing plans a further root migration

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | `SPECS_DIR` points at `specs/`, comments and help follow |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-writer-autosave.vitest.ts` | Modify | Canonical-root and track-numbering tests |
| `.skilled/skills/system-spec-kit/runtime/cli/core/spec-root-registry.ts` | Modify | Correct line range and description for `create.sh` |
| `.skilled/skills/system-spec-kit/runtime/cli/references/spec-root-alias-retirement-runbook.md` | Modify | Superseded notice |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A new packet lands under `specs/`, and `.opencode/specs` is not created | The canonical-root test passes, and fails against the previous script |
| REQ-002 | A track packet numbers from `specs/<track>/` | With `007-existing-packet` present, the next packet is `008-...`, and the test fails against the previous script |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Legacy packets under `.opencode/specs` still resolve | The legacy-only resolution test still passes |
| REQ-004 | No other `create.sh` or spec-root test regresses | All spec-root, scaffold and registry-rule test files pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two flipped tests fail on the previous `create.sh` and pass on the new one
- **SC-002**: The 17 spec-root, scaffold, registry-rule and backfill test files pass with no new skips
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Every session scaffolds through this script | High | Script and test change in one commit, and the full spec-root suite runs before commit |
| Risk | A repo that still keeps packets only under `.opencode/specs` | Low | Explicit `--path` and `--parent` targets under either root still pass the guard |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the two dead phase tests be revived as `.cjs` files, or retired along with their README and playbook mentions?
<!-- /ANCHOR:questions -->

---
