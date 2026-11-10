---
title: "Implementation Plan: Phase 3: hook-markers-and-improvement-family"
description: "Mirror the Codex and Devin drift fallback onto the Claude and Cursor hook registrations, extend the doctor asset and parity test, and document and validate the improvement/ artifact family."
trigger_phrases:
  - "hook drift marker claude cursor"
  - "claude cursor fallback wrap"
  - "improvement artifact family doc"
  - "IMPROVEMENT_ARTIFACTS rule"
  - "doctor health rows adapters"
  - "parity marker per host"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: hook-markers-and-improvement-family

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash command strings inside JSON hook configs, YAML doctor asset, bash rule, markdown reference |
| **Framework** | Vitest parity test in the spec-kit runtime; the compiled validation orchestrator reads the registry |
| **Storage** | None |
| **Testing** | Parity test, synthetic adapter failure, rule against a real packet and a malformed fixture |

### Overview
Each Claude and Cursor adapter invocation gains the same `|| { … }` fallback the Codex and Devin configs carry, with the host-specific success JSON shape taken from the adapters. The doctor asset lists the new adapters and the parity test asserts the marker per host. The `improvement/` family is documented from a real on-disk tree and checked by a presence-only shape rule.
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
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive observability on a best-effort contract, applied to the two hosts phase 005 left out.

### Key Components
- **Fallback wrapper** per registration: stderr `mk-hook-drift host=<host> event=<event> adapter=<name>`, stdout the host's expected JSON with `"mkHookDrift": true`.
- **Doctor asset rows** in `hook_adapter_fallback_health_checks`.
- **Rule** `check-improvement-artifacts.sh`: JSON parse plus the shared top-level field set.

### Data Flow
Host fires event → adapter runs → on failure the wrapper answers and marks → doctor reads markers; validator reads `improvement/*-config.json` when present.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Marker on every Claude and Cursor registration | `runtime/tests/hook-adapter-path-parity.vitest.ts` |
| Synthetic | Renamed compiled adapter still answers with the marker | `bash -c` on the extracted command |
| Rule | Real packet with `improvement/`; malformed fixture | `validate.sh --strict` with `SPECKIT_RULES=IMPROVEMENT_ARTIFACTS` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Compiled adapters under `runtime/dist/hooks/{claude,cursor}` | Internal | Built | The fallback only fires when they fail; the parity test resolves them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a host rejects the fallback payload.
- **Procedure**: revert the two hook configs in one commit; the doctor rows, test, rule and reference are additive and safe to keep.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:ai-protocol -->
## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Read the files this phase names before editing; confirm the failing behavior with the verification command first.
- Never run the whole deep-loop suite in this environment; run named files.

### Task Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` order; verification tasks run after every implementation task |
| TASK-SCOPE | Touch only the files the phase names; report anything outside it |
| Comment hygiene | Code comments carry the durable why, never packet or task identifiers |

### Status Reporting Format
Per finding: root cause, files changed, the exact rerun command and its result line.

### Blocked Task Protocol
Mark the task `[B]`, state what blocks it and which file or decision would unblock it, and continue with unblocked tasks.
<!-- /ANCHOR:ai-protocol -->
