---
title: "Feature Specification: restore the pi skill advisor brief: probe either root name for the warm-CLI assets and key the directive dedup receipt on the full contribution"
description: "Every pi prompt scores in ~2 ms and fails: the hook's warm-CLI asset probe only looks under the old root while the advisor CLI and its IPC bridge now live under the renamed one. The hook fails open, the brief collapses to the constant directives block, and dedup suppresses the repeat, so no skill suggestion is ever delivered."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: restore the pi skill advisor brief: probe either root name for the warm-CLI assets and key the directive dedup receipt on the full contribution

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-09-22 |
| **Branch** | `worktrees/059-restore-pi-advisor-brief` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Since the source-root migration, the pi prompt-advisor hook fails on every prompt in ~2 ms without contacting anything: its warm-CLI fallback probe looks only under `<root>/.opencode/bin/`, but the advisor shim and the launcher-IPC bridge now live under `<root>/.skilled/bin/`. The probe returns nothing, the hook fails open with a retryable-CLI "assets missing" error, freshness reads as unavailable, and the only delivered text collapses to the constant directives block — which the pi directive dedup then suppresses on repeat turns. No skill suggestion is ever delivered. A second, latent defect: the dedup receipt keys on the directives alone, so even a healthy brief would deliver its changing recommendation at most once per session.

### Purpose
A pi prompt again carries an `Advisor:` head naming the recommended skill, and a changed recommendation is delivered rather than suppressed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The hook's warm-CLI probe accepts either root name (`.skilled` first, `.opencode` as the older-checkout fallback), with the shim path, IPC-bridge path and default advisor database dir all taken from the same found root; the upward directory walk is unchanged.
- The pi delivery-dedup receipt keys on the full delivered contribution (route head + directives) so a changed recommendation re-delivers; the always-full escape hatch (`SPECKIT_PI_DIRECTIVE_DEDUP=0`) and the reset on session start/compact are kept.
- Rebuild the advisor package so the compiled hook the extension imports in-process carries both fixes and dist freshness is green again.

### Out of Scope
- The duplicated environment-alias expression in the same probe function — harmless duplication, noted for a later cleanup.
- Directive-lifecycle cadence beyond the receipt key — the existing reset semantics are exactly preserved.
- The shim's warm-only+stale exit-75 preflight — the hook already passes `--no-warm-only`, which the CLI answers.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts | Modify | Either-root probe; all three paths from one found root |
| .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts | Modify | Dedup receipt keyed on the full delivered contribution |
| .skilled/skills/system-skill-advisor/runtime/dist/ (rebuilt, untracked) | Build | Compiled hook refreshed; restores dist freshness |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The probe finds the CLI shim and IPC bridge under either root name and never mixes paths from different roots | Stdin smoke of the compiled hook returns `status: "ok"` with additionalContext beginning `Advisor: ` |
| REQ-002 | The pi dedup receipt keys on the full contribution (head + directives); `SPECKIT_PI_DIRECTIVE_DEDUP=0` still always delivers, and receipts still reset on session start/compact | A changed recommendation re-delivers its route line; the escape hatch and reset semantics survive in the source |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The advisor package's own test battery shows no regression from the edits | Battery failure set is identical with and without the edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The compiled hook's stdin smoke returns `status: "ok"`, `freshness: "live"`, and a brief beginning `Advisor: ` (observed: `Advisor: live; use sk-doc 0.94/0.12 pass.`)
- **SC-002**: The worktree's advisor reports trust/scan `live` after the smoke's cold start (generation 1, 21 skills)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Advisor shim + IPC bridge must exist under one root in any checkout the hook probes | Older checkouts without the renamed root fall through to the legacy root | Either-root probe keeps both layouts working |
| Risk | The receipt-key change alters which turns are suppressed | Low — first turn and every uncertain case still deliver, and the escape hatch disables suppression entirely | Dedup remains fail-open; reset semantics unchanged |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Diagnosis, scope and operator decisions (new packet, local-only worktree) are settled.
<!-- /ANCHOR:questions -->
