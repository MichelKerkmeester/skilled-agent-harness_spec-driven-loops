---
title: "Implementation Plan: OpenCode skill wrapper and accessibility refinement"
description: "Freeze the portable contract, create the skill through sk-doc, wire pre-write and post-write orchestration, then certify every report view for accessible local review."
trigger_phrases:
  - "OpenCode document diff implementation"
  - "AI edit capture workflow"
  - "document diff accessibility plan"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/006-opencode-skill-and-accessibility"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the OpenCode wrapper and accessibility scaffold"
    next_safe_action: "Stabilize phases 002 through 005, then run create-skill intake"
    blockers:
      - "Stable phases 002 through 005 and passing phase 003 gates"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-006-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: OpenCode skill wrapper and accessibility refinement

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill contract plus minimal TypeScript or shell adapters where generated workflow permits |
| **Framework** | sk-doc `create-diff` nested child mode wrapping the portable `create-diff` package |
| **Storage** | Portable snapshot store only; the skill owns no separate persistence |
| **Testing** | Skill validation, orchestration integration, report accessibility, and local-only network checks |

### Overview

Use the repository create-skill workflow to generate and register a thin `create-diff` nested child mode under the sk-doc parent hub. Bind its edit workflow to the portable capture and compare contracts, preserve explicit-pair fallback, and finish report accessibility across every view and JavaScript mode.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phases 002 through 005 expose stable APIs, CLI commands, diagnostics, and exit codes.
- [ ] Phase 003 gates pass for all required adapters and reports.
- [ ] The sk-doc create-skill contract, nested-mode templates, and registration requirements are loaded at implementation intake.
- [ ] Automatic and explicit capture flows have testable OpenCode entry points.

### Definition of Done

- [ ] Parent-hub and create-diff mode validation plus wrapper integration tests pass.
- [ ] Capture-before-write ordering and after-edit review pass.
- [ ] Direct and wrapped output remain equivalent.
- [ ] Automated and manual accessibility checks pass with JavaScript on and off.
- [ ] Network monitoring confirms local-only behavior.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin orchestration adapter over a portable application core.

### Key Components

- **Skill contract**: Defines triggers, capability explanations, workflow order, failures, and user handoff.
- **Pre-edit coordinator**: Resolves the target and invokes capture before mutation.
- **Post-edit coordinator**: Invokes comparison and presents the local report path after a successful edit.
- **Fallback coordinator**: Requests explicit before and after files when state is unavailable.
- **Accessibility verification layer**: Tests report semantics and interaction without changing diff meaning.

### Data Flow

The skill identifies an authorized target, checks capability, invokes portable capture, permits the edit only after the capture result is known, then invokes portable comparison with the resulting after file. If no usable snapshot exists, the skill routes to explicit-pair comparison. Every product operation remains in the package API or CLI.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Portable API and CLI | Own all product behavior | Freeze and consume unchanged | Direct versus wrapped equivalence tests |
| sk-doc create-diff mode | New orchestration surface | Add mode triggers, ordering, fallback, guidance, and hub registration | Parent-hub, mode, and workflow validation tests |
| Report templates | Present changes | Refine semantics and accessibility only | Automated plus manual accessibility matrix |
| Snapshot lifecycle | Stores before states | Consume status and cleanup contract | Error mapping and dry-run tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Freeze portable commands, schemas, diagnostics, and capability messages.
- [ ] Scaffold `create-diff` under sk-doc via create-skill and register it in mode-registry.json + hub-router.json.
- [ ] Replace generated placeholders with the approved workflow contract.

### Phase 2: Implementation

- [ ] Implement capability check and capture-before-write invariant.
- [ ] Implement after-edit comparison and report handoff.
- [ ] Implement explicit-pair, lock, unsupported-format, and cleanup routes.
- [ ] Complete keyboard, focus, landmark, ARIA, contrast, zoom, RTL, and CJK behavior.
- [ ] Verify unified, side-by-side, fidelity, print, and no-script views.

### Phase 3: Verification

- [ ] Run skill, integration, security, accessibility, and network checks.
- [ ] Prove wrapper and direct CLI output equivalence.
- [ ] Publish simple capability and recovery guidance.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract | Skill structure, frontmatter, triggers, referenced paths | sk-doc validation workflow |
| Integration | Capture before write, compare after write, explicit fallback, errors | OpenCode harness plus portable CLI |
| Equivalence | Direct API or CLI versus wrapper output | Fixture corpus and byte comparison |
| Accessibility | Keyboard, screen reader, contrast, zoom, RTL, CJK, no script | Automated checker and manual matrix |
| Security | Local-only behavior, hostile names and content, safe report paths | Network monitor and phase 003 suite |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 002 through 005 | Internal | Required | Skill has no stable product surface to wrap |
| sk-doc create-skill | Internal workflow | Required | Skill structure cannot be hand-rolled |
| OpenCode edit lifecycle | Runtime | Confirm at intake | Automatic capture may need explicit workflow steps on some surfaces |
| Accessibility test tools | Development | Required | Report readiness cannot be certified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The wrapper misses pre-write capture, diverges from the portable engine, weakens security, or fails accessibility gates.
- **Procedure**: Disable automatic orchestration, preserve direct CLI and explicit-pair use, remove only the wrapper package, and retain valid snapshots and reports.
<!-- /ANCHOR:rollback -->
