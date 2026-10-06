---
title: "Feature Specification: Fix advisor launcher bootstrap on a fresh clone"
description: "On a fresh clone the skill-advisor launcher installs only its own runtime, but that runtime's build compiles with the system-spec-kit workspace's TypeScript and node types, so the build fails and the MCP server never starts."
trigger_phrases:
  - "advisor launcher fresh clone"
  - "skill advisor bootstrap build failure"
  - "cannot find name process spec-kit shared"
  - "github issue 27 missing package.json"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Fix advisor launcher bootstrap on a fresh clone

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-01 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
GitHub issue #27 reports that the MCP launchers cannot build on a fresh clone. Its specific claims describe an older layout: `mk-spec-memory-launcher.cjs` and `system-code-graph` no longer exist, and the spec-kit `package.json` is present at `.skilled/skills/system-spec-kit/package.json`. A clean-clone reproduction still shows a real failure in the current `system-skill-advisor-launcher.cjs`. It runs `npm ci` and `npm run build` in the advisor runtime only, but that build script compiles `system-spec-kit/shared` and then calls `../../system-spec-kit/node_modules/.bin/tsc`. The spec-kit workspace is never installed, so `tsc --build` fails with `Cannot find name 'process'` and similar errors, and the launcher never starts.

### Purpose
On a fresh clone, starting the skill-advisor launcher installs everything its build needs and brings the daemon up with no manual steps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The launcher bootstrap installs the system-spec-kit workspace dependencies when they are missing, before building the advisor runtime.

### Out of Scope
- The `mcp-code-mode` launcher - it does not depend on the spec-kit workspace.
- Replying on issue #27 - the operator asked for a draft only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | `buildIfNeeded` installs the spec-kit workspace when its `tsc` is missing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A fresh clone bootstraps the advisor launcher without manual installs | Running the launcher on a clean clone builds `dist/runtime/advisor-server.js` and logs `Skill graph daemon active=true` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No regression in existing launcher behavior | The existing launcher vitest suites pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A clean clone that failed before the fix with `TS2591` errors starts the daemon after it.
- **SC-002**: The bootstrap, lease and idle-timeout launcher suites pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | npm registry reachable at first launch | Bootstrap fails offline | Same requirement the runtime install already has |
| Risk | First launch takes longer because of a second install | Low | Runs only when the spec-kit `tsc` binary is missing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
