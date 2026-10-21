---
title: "Feature Specification: Pi advisor diagnostic on stderr"
description: "The Pi advisor bridge runs the advisor hook inside Pi's own process without a diagnostic writer, so every prompt prints a JSON diagnostic record over Pi's input line."
trigger_phrases:
  - "pi advisor diagnostic stderr"
  - "pi advisor diagnostic on stderr"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi advisor diagnostic on stderr

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-21 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every prompt in an interactive Pi session prints a line such as `{"timestamp":"…","runtime":"pi",…}` into Pi's input area. The Pi bridge `hooks/pi/prompt-advisor.ts` calls `handleClaudeUserPromptSubmit` in-process and passes only `{ runtime: "pi" }`, so the hook's `emitDiagnostic` falls back to its default writer, `process.stderr.write`. Pi's terminal UI shares that stderr.

### Purpose
The advisor diagnostic record stops appearing in Pi's terminal, while the hook still persists it to disk.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pass a no-op `writeDiagnostic` from the Pi bridge to the advisor hook.
- A bridge test that runs a real prompt and fails if the diagnostic reaches stderr.

### Out of Scope
- The Claude, Codex and Cursor hook paths: they run the hook as a subprocess, where stderr is the hook's own channel.
- The persisted diagnostic file: it is unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify | Pass `writeDiagnostic: () => {}` to the in-process hook call |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/prompt-advisor.vitest.ts` | Modify | Add the stderr test and update the call-shape assertion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A Pi prompt writes no advisor diagnostic to stderr | The new bridge test passes with the fix and fails without it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Existing bridge behavior is unchanged | `prompt-advisor.vitest.ts` passes in full, baseline 12 of 12 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No `"runtime":"pi"` diagnostic line reaches `process.stderr` during a bridge prompt.
- **SC-002**: The bridge suite passes 13 of 13.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The hook's `writeDiagnostic` dependency | If the hook stops honoring it, the line returns | The bridge test catches that |
| Risk | Operators lose the on-screen diagnostic | Low | The record is still persisted, and `SPECKIT_PI_ADVISOR_DEBUG` shows advisor status in the prompt |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
