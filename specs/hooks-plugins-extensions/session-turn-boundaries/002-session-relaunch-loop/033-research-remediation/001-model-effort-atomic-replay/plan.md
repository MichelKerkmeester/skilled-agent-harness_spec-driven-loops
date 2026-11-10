---
title: "Implementation Plan: Phase 1: model-effort-atomic-replay"
description: "Make model and effort replay as one set. The wrapper drops the launch effort when a non-empty launch model differs from the consumed live model and no effort comes with it, Hermes exempt, and armLocked removes the recorded effort when an arm brings a new model without one."
trigger_phrases:
  - "model effort atomic replay plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: model-effort-atomic-replay

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`.skilled/bin/skilled-loop`), Node.js CommonJS (`relaunch-core.cjs`) |
| **Framework** | None |
| **Storage** | Relaunch record JSON written by `atomicWriteFile` |
| **Testing** | `node --test`, vitest for the Pi extension |

### Overview
Make model and effort replay as one set. The wrapper drops the launch effort when a non-empty launch model differs from the consumed live model and no effort comes with it, and `armLocked` removes the recorded effort when an arm brings a new model without one. An empty launch model proves no switch, and Hermes keeps its launch effort because it never records one. Provider logic stays as it is. The Sonnet low to Opus medium case already works today and is kept as a regression guard.
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
Shell wrapper plus a Node core that owns the relaunch record.

### Key Components
- **Wrapper live settings block** (`skilled-loop` about 785-830): reads `consumed_field model`, `provider`, `effort`. Change: copy `SKILLED_LOOP_MODEL` into a local before the live override at line 793. The effort rule lives in one wrapper function that takes the runtime, that saved launch model, the accepted live model and the live effort. It unsets `SKILLED_LOOP_EFFORT` only when all of these hold: the runtime is not Hermes, the saved launch model is non-empty, the live model was accepted and differs from it, and `live_effort` is empty or invalid. An empty launch model proves no switch, so the launch effort stands; Hermes never records an effort (`hermes/session-end-arm.mjs:104-107`), so it keeps `--reasoning`. Phase 003 reuses this function for the manual command template, so it takes its inputs as arguments and reads no globals beyond what it is passed. A comment states the why: an effort belongs to the model it was chosen for.
- **`armLocked`** (`relaunch-core.cjs` about 806-816): after building `liveSettings`, when `liveSettings.model` is set, differs from `record.model` and `liveSettings.effort` is absent, drop `effort` from the spread record.
- **Flag rendering** (`skilled-loop:189-200`, `:545-567`): unchanged; Claude `--effort`, Codex `-c model_reasoning_effort="X"`, Pi `--thinking`, none when `SKILLED_LOOP_EFFORT` is unset.
- **`readClaudeSettings`** (`context-usage.cjs:153-173`): changed only if the investigation finds a switch entry.

### Data Flow
Sender hook reads live settings, `armLocked` writes them to the record, the wrapper consumes the record, picks model and effort as one set, and `build_relaunch_arguments` renders the flags.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `armLocked` settings merge | Producer of the record effort | Update | AC-004 test |
| Wrapper live settings block | Consumer of model and effort | Update | AC-001 red then green; AC-002, AC-003, AC-007, AC-008 guards green before and after |
| Provider block `skilled-loop:801-812` | Pi and Hermes provider | Unchanged | Provider tests pass unedited |
| Session-relaunch README 37-45 | Documents replay | Update | Doc read |

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
| Unit | `armLocked` effort clearing (AC-004, red before, green after) | `node --test` (`relaunch-core.test.cjs`) |
| Integration | Wrapper relaunch arguments: AC-001 table across Claude, Codex and Pi (red before), guards for AC-002, AC-003, AC-007 and the Hermes case AC-008 (green before and after) | `node --test` (`skilled-loop.test.cjs`) |
| Manual | Live hops per runtime, plus a control hop whose record had its `effort` field removed | Harness scripts copied into `scratch/harness/` |

Baseline before the change and rerun after, reporting the delta:

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Harness scripts from phase 031 `scratch/harness/` | Internal | Green | Live proof needs rewriting |
| Claude, Codex and Pi CLIs with `gpt-6-luna` access | External | Yellow | AC-005 cannot be observed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A relaunch fails to start or the provider tests regress.
- **Procedure**: Revert the commit that touches the wrapper and `relaunch-core.cjs`.
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
| Setup | Low | 1 hour |
| Core Implementation | Low | 2 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **5-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline test counts recorded
- [ ] No feature flag needed; the change is a narrow rule
- [ ] `relaunch.log` hop lines checked after the live proof

### Rollback Procedure
1. Stop any running wrapper loops.
2. `git revert` the change commit.
3. Rerun the test commands above.
4. Tell the owners of phases 002 to 004, who rebase on this change.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

