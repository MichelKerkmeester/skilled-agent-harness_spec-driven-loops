---
title: "Implementation Plan: Phase 3: manual-claim-live-settings"
description: "Rebuilds the wrapper's manual claim template after each consume from the consumed live model and effort, so a printed manual command starts the receiver on the sender's live settings. The startup template stays the fallback when the record holds no accepted live values."
trigger_phrases:
  - "manual claim live settings plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: manual-claim-live-settings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash wrapper, Node.js CommonJS core |
| **Framework** | None |
| **Storage** | None, the consumed relaunch record JSON in memory |
| **Testing** | `node --test`, vitest for the Pi suite |

### Overview
Rebuilds the wrapper's manual claim template after each consume from the consumed live model and effort, so a printed manual command starts the receiver on the sender's live settings. The startup template stays the fallback when the record holds no accepted live values.
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
Shell wrapper around a Node core; the change stays in the wrapper.

### Key Components
- **`build_manual_command_template`** (`skilled-loop:402-420`): builds the template from `launch_arguments`; reused for the rebuild.
- **`print_manual_command`** (`skilled-loop:42-70`): prints through `manualClaimCommand`, reading `SKILLED_LOOP_MANUAL_TEMPLATE`.
- **`find_manual_template_conflict`** (`skilled-loop:425-436`): flags a carried value holding the placeholder; rerun on the rebuild.
- **Live value block** (`skilled-loop:789-830`): reads `consumed_field model` and `effort` with `model_is_valid` and `effort_is_valid`; the template rebuild and re-export go after it, before `:829`.
- **`printManualClaim`** (`session-relaunch.cjs:310`, called at `:516` on the hop cap): prints from the exported template, so the re-export keeps it current.

### Data Flow
Two paths keep the template current.

1. **Hop path.** The startup template from `:637` holds the first launch's values, so once a hop switches model it goes stale: after hop 1 moved to Opus, a later decline whose record holds no live values would print Sonnet, and so would the in-session hop-cap command (`session-relaunch.cjs:516`, `printManualClaim`), which reads the exported `SKILLED_LOOP_MANUAL_TEMPLATE`. So after the live settings block ends (about `:828`) and before `build_relaunch_arguments "$launch_prompt"` (about `:829`), the wrapper rebuilds the template from the current `SKILLED_LOOP_MODEL`, `SKILLED_LOOP_PROVIDER` and `SKILLED_LOOP_EFFORT`, re-exports `SKILLED_LOOP_MANUAL_TEMPLATE` so the next hop's CLI prints from it, and recomputes `manual_template_conflict`. Every later print, in the wrapper or in the session, then starts from the settings the current hop launched on.
2. **Early-exit prints.** The prints at `:711`, `:717`, `:726` and `:746` run before the live values are read at `:789`. A new helper reads the live model and effort from `consumed_record_json`, applies `model_is_valid` and the effort rule, rebuilds the template and the conflict check, and hands both to `print_manual_command` for that print. The prints at `:876` and `:889` use the same helper, so a decline record's own live values still win over the current hop's.

Both paths reuse the single effort-rule function phase 001 leaves in the wrapper (effort from the live entry when the live model differs from the launch one, none if absent), so the hop path and the prints cannot pick effort two ways. Quoting stays with `shell_quote_argument` inside `build_manual_command_template`.

**The `launch_arguments` clobber.** `build_manual_command_template` and `find_manual_template_conflict` both call `build_relaunch_arguments`, which resets the global `launch_arguments` and `relaunch_seed_index`. The plan never calls them in the current shell: each rebuild runs inside a command substitution, `$(build_manual_command_template)` as `:637` already does, so the reset dies with the subshell. The helper sets its model and effort overrides inside that same subshell, so they never leak into the exported `SKILLED_LOOP_*` values. On the hop path the rebuild also sits before `:829`, which rebuilds `launch_arguments` for the real launch anyway, and the Codex `--no-daemon` prefix is added after it as today.

With no accepted live values the current template is used unchanged, so a run that never switches model prints exactly what it prints today. Any code comment added states the durable why only, with no spec or phase ids.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `build_manual_command_template` | Builds the startup template | Reused for the rebuild | `skilled-loop.test.cjs` AC-001 |
| `print_manual_command` callers at `:711`, `:717`, `:726`, `:746`, `:876`, `:889` | Post-consume prints | Update to use the helper's rebuilt template | `rg -n print_manual_command .skilled/bin/skilled-loop` |
| Exported `SKILLED_LOOP_MANUAL_TEMPLATE` (`:637`) | Startup template, never refreshed | Rebuilt and re-exported after each hop's live settings block, before `:829` | AC-005 test |
| CLI hop-cap print (`session-relaunch.cjs:516`, `printManualClaim`) | Reads the exported template | Unchanged code; now reads the current hop's template | AC-005 test; existing CLI tests pass unedited |
| Global `launch_arguments` and `relaunch_seed_index` | Reset by `build_relaunch_arguments` | Protected by running every rebuild in a command substitution | Existing relaunch argument tests pass unedited |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
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
| Integration | Wrapper manual command after consume (AC-001, AC-002 and AC-005 red before; AC-004 a regression guard, green before and after) | `node --test` on `skilled-loop.test.cjs` |
| Integration | Cursor live reader to printed command | `node --test` on `session-relaunch-cli.test.cjs` |
| Regression | Whole hook suites, baseline before and rerun after | Commands below |

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```

No live proof is required.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 effort rule | Internal | Yellow | Effort choice undefined until 001 lands |
| Phase 004 manual goal binding | Internal | Yellow | Same print path; build after 004 to avoid conflicting edits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any existing manual command test fails, or a printed command breaks quoting.
- **Procedure**: Revert the wrapper and test commits with `git revert`; the startup template path is untouched.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hours |
| Core Implementation | Med | 2 hours |
| Verification | Low | 1 hour |
| **Total** | | **3.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline suite numbers recorded
- [ ] Change isolated to its own commit

### Rollback Procedure
1. Revert the wrapper commit with `git revert`.
2. Rerun the hook suites to confirm the baseline numbers.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

