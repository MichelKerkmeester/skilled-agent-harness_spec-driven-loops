---
title: "Implementation Plan: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED"
description: "Add a default-off concern map to the four shared hook-flag readers so session-relaunch runs only when SYSTEM_SESSION_RELAUNCH_ENABLED is truthy and no kill switch is set. Tests go red first, the relaunch suites opt in, and the operator docs name the switch."
trigger_phrases:
  - "default off opt in plan"
  - "session relaunch enable flag plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS and ESM), TypeScript, POSIX shell |
| **Framework** | Repo hook hub under `.skilled/hooks/` |
| **Storage** | `.skilled/hooks/hook-flags.env` (gitignored, KEY=value) |
| **Testing** | `node --test`, vitest for the Pi adapter |

### Overview
The shared resolver gains a map of concerns that are off by default, with one entry: `session-relaunch` to `SYSTEM_SESSION_RELAUNCH_ENABLED`. For a concern in that map, `isHookEnabled` returns true only when the enable flag resolves truthy from the environment or the config file, the environment winning, and no master or concern kill switch is set. The rule lands in all four readers, the Hermes arm caller reads the config file, and the docs say how to opt in.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared resolver with per-reader copies (`.cjs`, `.mjs`, `.ts`, `.sh`) that must agree.

### Key Components
- **Default-off concern map**: names each concern that needs an enable flag, and the flag.
- **`isHookEnabled`**: kill switches first, then, for a default-off concern, the enable flag.
- **Callers**: about ten session-relaunch adapters that call `isHookEnabled('session-relaunch')` and need no change, plus the Hermes arm path that does.

### Data Flow
An adapter asks `isHookEnabled('session-relaunch')`. The resolver reads each key from the environment, falling back to the config file. A truthy master or concern kill switch returns false. A default-off concern then returns the truthiness of its enable flag. Any other concern returns true.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hook-flags.cjs`, `.mjs`, `.ts`, `.sh` | Producers of the enabled answer | Update all four | Cross-reader parity test |
| `hermes/session-end-arm.mjs:80` | Caller that passes an env with no config | Update so a file opt-in reaches it | Test opting in through the file |
| The other session-relaunch callers | Consumers with the config file or no env | Unchanged | `rg -n "isHookEnabled\(" .skilled/hooks/session-relaunch .opencode/plugins` |
| Relaunch tests | Observe the concern as on | Opt in | The three suites exit 0 |
| README, env examples, ENV-REFERENCE, doctor-env, hook READMEs | Tell the operator the default | Update | Grep for the old "enabled by default" wording |

Required inventories:
- Same-class producers: `rg -n 'function isHookEnabled|is_hook_enabled' .skilled/hooks/shared`.
- Consumers of changed symbols: `rg -n "isHookEnabled\(|is_hook_enabled" . --glob '*.cjs' --glob '*.mjs' --glob '*.js' --glob '*.ts' --glob '*.sh'`.
- Matrix axes: enable flag (unset, truthy, falsy) x source (env, file, both) x kill switch (unset, concern, master) x concern (session-relaunch, one default-on concern) x reader (four).
- Algorithm invariant: a truthy kill switch always returns false; a default-off concern returns true only with a truthy enable flag; a default-on concern's answer is unchanged.
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
| Unit | Resolver matrix and cross-reader parity | `node --test .skilled/hooks/shared/hook-flags.test.cjs` |
| Integration | Relaunch adapters, CLI and OpenCode plugin with the concern opted in | `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` |
| Integration | Pi adapter | `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` |
| Unit | Silent when not enabled: Claude context nudge, CLI `prepare` inside the loop | New tests in the relaunch suite |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 033 changes in the same relaunch files | Internal | Yellow | Test opt-ins conflict with uncommitted 033 edits; merge by hand |
| Operator's local `hook-flags.env` | Internal | Green | The operator's checkout stays off until the line is added |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A default-on concern turns off, or the relaunch suites cannot be made green with an opt-in alone.
- **Procedure**: Remove the default-off map entry in the four readers. The concern returns to default-on and the test opt-ins become no-ops.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Failing tests) ──► Phase 2 (Resolver + caller + test opt-ins) ──► Phase 3 (Docs + verify)
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
| Setup | Low | 1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Operator's `hook-flags.env` holds `SYSTEM_SESSION_RELAUNCH_ENABLED=1` before merge
- [ ] Hook-flags tests green on all four readers

### Rollback Procedure
1. Remove the `session-relaunch` entry from the default-off map in the four readers.
2. Revert the docs to name the kill switch only.
3. Rerun the hook-flags tests and the three relaunch suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
