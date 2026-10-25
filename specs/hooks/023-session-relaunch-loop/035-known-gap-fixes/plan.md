---
title: "Implementation Plan: Close eight known gaps in the session relaunch loop"
description: "Fix the claim-seed parser split, the Pi provider switch, the prepare off check and the validator's git calls with a failing-first test each, add a per-runtime enable flag to the shared resolver, correct the docs and complete the parent goal binding."
trigger_phrases:
  - "known gap fixes plan"
  - "per-runtime switch plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Close eight known gaps in the session relaunch loop

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS and ESM), TypeScript, bash |
| **Framework** | Repo hook hub under `.skilled/hooks/`, the `skilled-loop` wrapper and the spec-kit validator |
| **Storage** | `.skilled/hooks/hook-flags.env` (gitignored, KEY=value) |
| **Testing** | `node --test`, vitest for the Pi adapter, `bash -n` and `shellcheck` for the wrapper |

### Overview
Four code gaps (G1, G2, G3, G5) each get a test that fails first, then the smallest fix at the producer: the nudge parser delegates to `parseClaimSeed`, the wrapper compares providers, `prepare` checks the concern before it branches and the validator's git calls pass `-c core.fsmonitor=false`. G7 then adds a per-runtime enable flag to the four resolver readers and passes the runtime from every caller, after the G1 to G4 work lands. G4, G6 and G8 are doc changes checked by grep and by `goal.cjs packet`.

The 2026-10-25 scope amendment adds the four pre-commit review findings and the hermetic sandboxes, each red first where it is code. The `prepare` refusal names the switch that decided and runs before the note is read (G3 amended). The shell reader trims the runtime and honours `MK_HOOKS_DISABLED` (R1). The validator git-call matcher covers control keywords and `VAR=value` prefixes (R2). The relaunch test sandboxes strip the flags they inherit through one shared fixture whose names come from the resolver (R3). The session-relaunch README states the Pi provider rule (R4), and an ad-hoc strict `tsc` run checks `hook-flags.ts` against its HEAD copy (R5). The full gate then runs in a clean, a Claude-off and a hostile environment.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared resolver with per-reader copies, plus single-owner parsers.

### Key Components
- **`parseClaimSeed`** (`lib/relaunch-core.cjs`): the one claim-seed parser; the nudge stops keeping its own split.
- **`live_model_voids_launch_effort`** (`.skilled/bin/skilled-loop`): decides whether a hop drops the launch effort; gains the launch provider.
- **`prepare`** (`bin/session-relaunch.cjs`): checks the concern for the resolved runtime before the outside-loop branch.
- **`isHookEnabled`** (`hook-flags.cjs`, `.mjs`, `.ts`, `.sh`): kill switches first, then the per-runtime flag when set, then the global enable flag.

### Data Flow
A caller asks the resolver about `session-relaunch` and names its runtime; the exact argument shape is the implementer's choice, the same in all four readers. A truthy master or concern kill switch returns false. A set `SYSTEM_SESSION_RELAUNCH_<RUNTIME>_ENABLED` decides next, environment before file. Otherwise `SYSTEM_SESSION_RELAUNCH_ENABLED` decides, as in phase 34.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/nudge.cjs` seed helpers | Second parser, splits at the first marker | Delegate to `parseClaimSeed` | Test with a note path holding the marker |
| `skilled-loop` effort rule | Ignores `--provider` | Compare launch and recorded provider | Shell test rows for both spellings |
| `prepare` | Checks the concern inside the loop only | Check before branching and before the note is read, name the deciding switch | CLI tests in and out of the loop, a refusal table and a note-bytes test |
| `hook-flags.sh` runtime and master aliases | Untrimmed runtime, `MK_HOOKS_DISABLED` ignored | Trim, honour every master alias | Rows in the four-reader table |
| Validator git-call matcher | Misses git after `if`, `elif`, `while`, `until` and behind `VAR=value` | Widen the command pattern | Probe of wanted and unwanted lines |
| Relaunch test sandboxes | Inherit the operator's relaunch and kill flags | Strip them per sandbox | Full gate in three environments |
| Validator git calls | Run without the fsmonitor option | Add `-c core.fsmonitor=false` | Grep test over the validator sources |
| Four resolver readers | Global enable only | Per-runtime flag | Precedence table across four readers |
| About ten session-relaunch callers | Ask without a runtime | Pass the runtime | One adapter silent with its runtime off |
| Operator docs and playbooks | Name the global switch only | Name the per-runtime flags | Grep per file |

Required inventories:
- Same-class producers: `rg -n 'function isHookEnabled|is_hook_enabled|hook_enabled' .skilled/hooks/shared`.
- Consumers of changed symbols: `rg -n "isHookEnabled\(" .skilled/hooks/session-relaunch .opencode/plugins/session-relaunch.js -g '!**/tests/**'`.
- Claim-seed parsers: `rg -n "SPEC_FOLDER_MARKER" .skilled/hooks/session-relaunch/lib`.
- Validator git calls: `rg -n "\bgit\b" .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh .skilled/skills/system-spec-kit/runtime/cli/rules .skilled/skills/system-spec-kit/runtime/cli/validation`.
- Matrix axes: per-runtime flag (unset, truthy, falsy) x global flag (unset, truthy) x source (env, file, both) x kill switch (unset, concern, master) x runtime (seven) x reader (four).
- Algorithm invariant: a truthy kill switch always returns false; a set per-runtime flag decides its runtime; otherwise the global flag decides; other concerns are unchanged.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records baselines and the failing tests, Implementation fixes G1 to G5, then G7, then the docs, and Verification reruns every gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Resolver precedence across four readers | `node --test .skilled/hooks/shared/hook-flags.test.cjs` (baseline 27) |
| Integration | Relaunch adapters, CLI, wrapper and OpenCode plugin | `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` (baseline 928) |
| Integration | Pi adapter | `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` (baseline 59) |
| Static | Wrapper syntax and lint | `bash -n .skilled/bin/skilled-loop` and `shellcheck .skilled/bin/skilled-loop` |
| Unit | Validator git calls | The validator's own test suite under `.skilled/skills/system-spec-kit/runtime/` |
| Environment | Hermetic sandboxes | The node, Pi and hook-flags legs run clean, with `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`, and with all seven per-runtime flags `0` plus both kill switches `1` |
| Static | `hook-flags.ts` types | Strict ad-hoc `tsc --noEmit` on the HEAD copy and the working tree, compared by normalized diff |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 34 default-off resolver | Internal | Green | G7 extends its enable rule |
| G1 to G4 implementation | Internal | Green | G7 waits, because both change the `prepare` check |
| `shellcheck` on PATH | External | Green | The wrapper lint gate cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A relaunch suite cannot be made green, or a default-on concern changes its answer.
- **Procedure**: Revert the gap's own diff. Each gap touches its own lines, so one gap reverts without the others.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baselines + failing tests) ──► Phase 2 (G1-G5, then G7, then docs) ──► Phase 3 (Verify)
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
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours (assumption)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Hook-flags tests green on all four readers
- [x] Relaunch, Pi and validator suites green in a clean environment
- [x] Relaunch suites green with per-runtime and kill flags exported

### Rollback Procedure
1. Revert the per-runtime resolver change in the four readers; callers that pass a runtime then fall back to the global flag.
2. Revert the gap diffs one at a time if a suite stays red.
3. Rerun the hook-flags, relaunch, Pi and validator suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
