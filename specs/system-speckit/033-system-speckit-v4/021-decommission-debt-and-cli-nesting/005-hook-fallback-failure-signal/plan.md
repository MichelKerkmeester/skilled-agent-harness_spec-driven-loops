---
title: "Implementation Plan: Phase 5: hook-fallback-failure-signal"
description: "Add a machine-detectable drift marker and structured stderr to every Codex/Devin hook fallback, fix Codex's unreachable Stop-cleanup diagnostic, decide and implement the Copilot wrapper fate, and add a path-resolution parity test."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: hook-fallback-failure-signal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (hook command strings inside JSON configs), Node (compiled hook adapters), YAML (doctor assets) |
| **Framework** | None - JSON-configured host hooks plus a doctor diagnostic route |
| **Storage** | None new - the drift marker lives in the hook's own JSON response, not a persisted store |
| **Testing** | A new path-resolution parity test (Vitest or a shell script matching the doctor route's own test style) |

### Overview
Every `node <adapter> || printf fallback` chain in `.codex/hooks.json` and `.devin/hooks.v1.json` gains an additional JSON field and a stderr line that make an adapter failure detectable without parsing free text. The Codex Stop-cleanup chain is restructured so its diagnostic branch can actually run. The Copilot wrapper question is decided with an evidence-backed comparison and implemented. A new test proves every currently-registered hook path resolves.
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
- [x] Parity test passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive observability on an existing best-effort contract: the hook must always answer, so the fix adds a signal alongside the existing fallback rather than changing when the fallback fires.

### Key Components
- **Drift marker**: an additional field in the fallback JSON's `hookSpecificOutput` (e.g. `"mkHookDrift": true` or a similarly explicit boolean/enum), added to every `|| printf` branch in both configs.
- **Structured stderr**: the wrapping `bash -c` prints a single recognizable line to stderr before the fallback JSON reaches stdout, so a log collector that captures stderr sees the failure even without JSON parsing.
- **Codex Stop-cleanup fix**: replace `session-cleanup.sh ... || true || printf fallback` with a form where a genuine cleanup failure reaches the `printf` branch, while the overall command's exit status still never fails the Stop hook (e.g. wrap the whole thing so only the final `printf`-or-success determines exit status, not an intermediate `|| true`).
- **Copilot decision**: compare the effort to build `runtime/hooks/copilot/{session-prime,user-prompt-submit}.ts` (new adapters, wired into the runtime build, needing their own tests) against removing `.github/hooks/scripts/*.sh` and its registration; implement whichever the operator picks, informed by usage evidence gathered in Setup.
- **Parity test**: enumerates every `command:` string across `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.pi/`, OpenCode's hook registration, and (if kept) `.github/hooks/`, extracts the referenced adapter path, and asserts it resolves after a build.

### Data Flow
Host fires a hook event → `bash -c` wrapper attempts the primary adapter → on failure, prints the structured stderr line and emits the fallback JSON with the drift marker → host receives a well-formed response either way → the doctor route (or a log scrape) reads accumulated drift markers/stderr lines and reports degraded-adapter history.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `.codex/hooks.json` every `|| printf` fallback (e.g. lines 8, 13, 18, 27, 33, 40, 48, 56, 64, 72) | Returns a static fallback with no machine-detectable field | update: add the drift marker and stderr line | Synthetic adapter-failure test (SC-001) |
| `.codex/hooks.json:140` Stop-cleanup chain | `... || true || printf fallback` - fallback unreachable | update: restructure so the fallback is reachable on real failure, still never fails the Stop hook | Synthetic `session-cleanup.sh` failure test (SC-002) |
| `.devin/hooks.v1.json` fallback chains | Same shape as Codex's, without the unreachable-cleanup compounding bug | update: add the drift marker and stderr line | Same synthetic-failure pattern applied to Devin's config |
| `.github/hooks/scripts/session-start.sh`, `user-prompt-submitted.sh` | Always take the fallback (compiled Copilot handlers do not exist) | decide: build the adapters, or remove the wrappers | Whichever is chosen, verified by the parity test resolving (build case) or the registration's absence (remove case) |
| Doctor route (existing or new asset) | Does not currently surface hook-adapter drift | update/create | SC-003: doctor output includes the synthetic failure |

Required inventories:
- Same-class producers: `rg -n '\|\| printf %s' .codex/hooks.json .devin/hooks.v1.json` - confirms the exact set of fallback chains this phase must update.
- Consumers of changed symbols: `rg -n 'additionalContext' .opencode/commands/doctor` - confirms whether any existing doctor asset already parses hook fallback text, which the new drift marker must not break.
- Matrix axes: host (Codex / Devin / Copilot) × hook event (SessionStart / UserPromptSubmit / PreToolUse / PostToolUse / Stop / PreCompact / PostCompaction / SessionEnd, whichever each host registers) - the parity test's row count should match the actual registered event count per host, not a hypothetical maximum.
- Algorithm invariant: a hook command's exit status must remain 0 (success) to the host in every branch; only the JSON payload and stderr stream carry the new failure signal.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Parity test over every registered hook path | Vitest or a shell script under `scripts/tests/` |
| Integration | Synthetic adapter-failure and cleanup-failure runs against the real `.codex/hooks.json`/`.devin/hooks.v1.json` command strings | Manual `bash -c '<command>'` invocation with the target file temporarily renamed |
| Manual | Doctor route output reviewed after a synthetic failure | `/doctor` or its underlying route script |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/bin/install-codex-hooks.mjs --check` | Internal | Green - already referenced in the doctor route (`_routes.yaml:182`) | The new drift-marker doctor surface should reuse this existing check path rather than duplicating it |
| The Copilot build decision's evidence (grep counts, usage signal) | Internal | Needs gathering in Setup | Without it, REQ-004's decision is made without the blast-radius comparison this spec promises |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A host (Codex or Devin) starts rejecting the modified fallback JSON, or the Stop-cleanup restructuring causes a Stop hook to report failure when cleanup itself only warned.
- **Procedure**: Revert `.codex/hooks.json` and `.devin/hooks.v1.json` to their pre-change state in one commit; the doctor-route and parity-test additions are independent and safe to keep since they only read, not gate, hook execution.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (confirm exact fallback chains + gather Copilot evidence) ──► Core (drift marker + cleanup fix + Copilot decision) ──► Verify (synthetic failures + parity test + doctor check)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Fallback chains already located by file:line; Copilot evidence gathering is a grep exercise |
| Core Implementation | Med | Two config files, one doctor route, one decision-dependent Copilot change |
| Verification | Med | Synthetic failure tests for both hosts plus a new parity test |
| **Total** | | **One session, more if the Copilot decision is "build the adapters"** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Current `.codex/hooks.json` and `.devin/hooks.v1.json` content preserved for diffing
- [ ] A working Codex and/or Devin session confirmed to fire hooks successfully before this change
- [ ] The doctor route's current output captured as a baseline

### Rollback Procedure
1. Revert the two hook-config files to their pre-change content.
2. Confirm a real session still fires hooks successfully (SessionStart, Stop at minimum).
3. Re-run the doctor route and confirm its output matches the pre-change baseline.
4. No stakeholder notification needed - internal tooling change with no external contract, though a note to the operator if the Copilot wrappers were removed as part of this phase.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - no persisted schema changes, only hook-config JSON and (possibly) a new/removed source directory
<!-- /ANCHOR:enhanced-rollback -->

---
