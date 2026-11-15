---
title: "Feature Specification: Claude Code session handover on by default and v4.0.2.1 release notes"
description: "In-session handover ships off on every runtime, so a project that installs Skilled and runs Claude Code never gets it unless the owner finds the switch. The v4.0.2.1 release notes also skip most of what packets 038 and 039 changed in the handover. This phase turns handover on by default for Claude Code only and rewrites the release notes' handover section."
trigger_phrases:
  - "claude default on release notes"
  - "claude code session handover on by default"
  - "session relaunch default on for claude"
  - "v4.0.2.1 handover release notes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Claude Code session handover on by default and v4.0.2.1 release notes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/390-claude-default-on-release-notes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`hookFlagDecision` in `.skilled/hooks/shared/hook-flags.cjs` returns off for the `session-relaunch` concern on every runtime when no enable switch holds a value, and `hook_enabled` in `hook-flags.sh` copies that rule. A project that installs Skilled and runs Claude Code therefore never gets in-session handover unless its owner finds `SYSTEM_SESSION_RELAUNCH_ENABLED`. Separately, the Session Handover section of `.skilled/changelog/skilled/v4.0.2.1.md` covers packet 036 and part of 038, and says nothing of 038's later children or any of packet 039.

### Purpose
A Claude Code session hands over by default while every other runtime stays off until its switch is set, and the v4.0.2.1 release notes and root README describe every handover change in the existing changelog style.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node -e 'const f=require("./.skilled/hooks/shared/hook-flags.cjs");for(const r of f.RUNTIMES)console.log(r, JSON.stringify(f.hookFlagDecision("session-relaunch",{},{},{runtime:r})))'
claude {"enabled":false,"key":"SYSTEM_SESSION_RELAUNCH_ENABLED","reason":"global"}
codex {"enabled":false,"key":"SYSTEM_SESSION_RELAUNCH_ENABLED","reason":"global"}
pi {"enabled":false,"key":"SYSTEM_SESSION_RELAUNCH_ENABLED","reason":"global"}
opencode {"enabled":false,"key":"SYSTEM_SESSION_RELAUNCH_ENABLED","reason":"global"}
cursor {"enabled":false,"key":"SYSTEM_SESSION_RELAUNCH_ENABLED","reason":"global"}
devin {"enabled":false,"key":"SYSTEM_SESSION_RELAUNCH_ENABLED","reason":"global"}
$ env -i HOOK_FLAGS_CONFIG=/dev/null bash -c '. .skilled/hooks/shared/hook-flags.sh; hook_enabled session-relaunch claude && echo claude on || echo claude off'
claude off
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Turn the `session-relaunch` concern on for the `claude` runtime when neither its runtime switch nor the global switch holds a value, in `hook-flags.cjs` and its shell mirror `hook-flags.sh`
- Keep every other runtime, and a caller that names no runtime, off under the same condition
- Correct every document that says handover ships off on Claude Code
- Rewrite the Session Handover section of the v4.0.2.1 release notes to cover packets 036 to 040 in the existing style, with matching glance, upgrade and checks rows
- Align the root README's In-Session Handover section and its other default statements

### Out of Scope
- Moving the `v4.0.2.1` git tag or editing a GitHub release - both are outward-facing and need the operator
- Any change to hop behavior, the wrapper or the adapters - only the default changes
- The `.mjs` and `.ts` facades - they re-export the `.cjs` resolver and carry no rule of their own
- The repository's dotenv template - the operator's rule forbids reading or writing a dotenv file, so its one comment is reported instead. The operator later asked for it, and `.env.example` sections 8 and 18 now say the loop ships on for Claude Code only
- The OpenCode plugin README and architecture notes - they describe OpenCode, which still ships off

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/shared/hook-flags.cjs` | Modify | A per-runtime default for the default-off concern, `claude` on |
| `.skilled/hooks/shared/hook-flags.sh` | Modify | The same rule in the shell reader |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modify | Resolver tests for the Claude default and cross-reader parity |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs`, `session-relaunch-cli.test.cjs` | Modify | Tests that encoded Claude off by default now prove the Claude default and the off default on Codex |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Modify | The full handover section |
| `README.md` | Modify | In-Session Handover and the default statements |
| `.skilled/hooks/hook-flags.env.example` | Modify | The enable switch comments |
| `.skilled/hooks/README.md`, `.skilled/hooks/shared/README.md`, `.skilled/hooks/injection-contract.md`, `.skilled/hooks/session-relaunch/README.md` | Modify | The default statements |
| `.skilled/commands/speckit/handoff.md`, `.skilled/commands/doctor/assets/doctor-env.yaml` | Modify | The refusal reasons and the flag explanation |
| `.skilled/skills/system-spec-kit/README.md`, `runtime/ENV-REFERENCE.md`, `feature-catalog/feature-catalog.md`, `feature-catalog/context-preservation/session-relaunch-loop.md`, `manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Modify | The default statements |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With no relaunch switch set, `hookFlagDecision("session-relaunch", {}, {}, { runtime: "claude" })` returns enabled, and the same call for codex, pi, opencode, cursor and devin returns disabled. |
| REQ-002 | A set global or Claude switch still decides for Claude: `SYSTEM_SESSION_RELAUNCH_ENABLED=0` or `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` turns Claude off, and a kill or master switch beats the default. |
| REQ-003 | `hook_enabled session-relaunch <runtime>` in `hook-flags.sh` gives the same answer as the `.cjs` resolver for every runtime and switch combination the parity test runs. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The v4.0.2.1 Session Handover section names every change that packets 036 to 040 made, in the existing changelog style. |
| REQ-005 | The root README and the docs listed in Files to Change say Claude Code hands over by default and every other runtime stays off until its switch is set. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Measured Behavior command prints `claude {"enabled":true,...}` and `"enabled":false` for the other five runtimes, and the shell line prints `claude on`.
- **SC-002**: The relaunch and plugin suites, the resolver suite and the Pi suite pass with no test lost against the baseline of 1,555, 28 and 62.
- **SC-003**: A grep over the doc surfaces in scope finds no line that says handover ships off on Claude Code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Every Claude hook passes `runtime: 'claude'` to the resolver | A Claude caller with no runtime stays off | Grep for relaunch resolver calls without a runtime; only tests and the history lookup plugin, which uses another concern, match |
| Risk | Every Claude Code user of Skilled now gets the context nudge near the limit | Med | Outside the `skilled-loop` wrapper the nudge asks only for `keep`, never `prepare`; the docs and upgrade notes name the switch that turns it off |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: A missing or unreadable config file leaves Claude on and every other runtime off, and every default-on concern on.
- **NFR-R02**: A value that is set but blank counts as unset in both readers, as the runtime switch already does.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no runtime named, or a runtime outside `RUNTIMES`, stays off with no switch set.
- Maximum input: the global switch on with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0` keeps Claude off and every other runtime on.
- Failure path: with Claude switched off, `session-relaunch.cjs prepare --runtime claude` still exits 2 and names the switch.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two resolver files, one test file, about fifteen docs |
| Risk | 12/25 | Changes a shipped default for every Claude Code user |
| Research | 4/20 | The resolver and its callers are read |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does an explicit `SYSTEM_SESSION_RELAUNCH_ENABLED=0` turn Claude off? Decision: yes, a set global value decides for every runtime without its own switch.
<!-- /ANCHOR:questions -->

---
