---
title: "Implementation Plan: Phase 2: consume-locked-withdraw"
description: "Move the relaunch record read, withdrawn check and unlink in consume into one withAppendLock call, report withdrawn: true only for a withdrawn record, and make the wrapper decline on it."
trigger_phrases:
  - "consume locked withdraw plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: consume-locked-withdraw

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, Bash |
| **Framework** | None |
| **Storage** | JSON relaunch record and hop history files on disk |
| **Testing** | `node --test`, vitest for the Pi test |

### Overview
`consume` today reads the record at `session-relaunch.cjs:692` and unlinks it under `core.withAppendLock` at `:715-722`, so a withdraw in between is lost. The change reads the record and unlinks it inside the same lock call, records whether it was a withdrawn record, and parses the hand-over note after the lock. The wrapper reads the new field after `consume_record` and declines the hop.
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
CLI command plus a Bash wrapper, sharing a file lock (`core.withAppendLock`).

### Key Components
- **`consume` in `bin/session-relaunch.cjs`**: inside one `withAppendLock(statePath, ...)` call, run `core.readRelaunchFile(loopId)`, set `withdrawn` when `record.status === 'disarmed'` and `WITHDRAWN_DISARM_REASONS.has(record.disarmReason)`, then unlink (ENOENT ignored). Note parsing and `core.noteState` run after the lock. `consumed.withdrawn = true` is set only when withdrawn. Any code comment states the why (a withdraw rewrites the record under this lock) and carries no spec or phase id.
- **`WITHDRAWN_DISARM_REASONS`**: already exported from `relaunch-core.cjs` (`:1761`); consume uses the same set as `shouldRelaunch`.
- **`.skilled/bin/skilled-loop`**: a helper `consumed_withdrawn` beside `consumed_note_state` (`:93`) reads the field from `consumed_record_json`. Right after `consume_record` on the approved path (about `:667-729`), when it reports true, the wrapper prints the existing withdrawn warning used at `:859-870` and exits with `runtime_exit`, before `record_hand_over` and any relaunch. The other consumes on the approved path (about `:709`, `:715` and the Ctrl-C path at `:724`) each check `consumed_withdrawn` before their `print_manual_command`; on a withdrawn record they skip the claim command and reuse the existing previous-hop unclaimed-note warning block (about `:886-890`) instead.

### Data Flow
Wrapper gets `relaunch: true` from `should-relaunch`, calls `consume`, consume locks, reads, checks, unlinks, unlocks, prints JSON; the wrapper either declines (withdrawn) or continues to `record_hand_over` and the relaunch as today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `consume` in `session-relaunch.cjs` | Producer of consume JSON | Update | New CLI tests, exact-shape tests unedited |
| `shouldRelaunch` in `relaunch-core.cjs` | Owner of the withdrawn rule | Unchanged | `rg -n WITHDRAWN_DISARM_REASONS .skilled/hooks` |
| `skilled-loop` approved path | Consumer of consume JSON | Update | `skilled-loop.test.cjs` decline test |
| Other consume callers | Readers of consume JSON | Unchanged, since the key is absent for non-withdrawn records | `rg -n "consume --loop-id" .skilled .opencode` |

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
| Unit | consume output for withdrawn, armed and missing records | `node --test` on `session-relaunch-cli.test.cjs` |
| Integration | wrapper decline with a withdraw between approval and consume, and no `handed-over` history line | `node --test` on `skilled-loop.test.cjs` |
| Regression | whole relaunch suite plus the Pi test | the commands below |

Capture a baseline before the change and rerun after, reporting the delta:

```bash
node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs
npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts
```

No live proof is required; the interleaving is deterministic in tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 Complete | Internal | Yellow | This phase waits for wave 2 |
| `core.withAppendLock` | Internal | Green | None; already used by withdraw and consume |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any relaunch suite regression or a wrapper that declines an armed record.
- **Procedure**: Revert the commit touching `session-relaunch.cjs`, `skilled-loop` and the tests.
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
- [ ] Baseline test output saved in `scratch/`
- [ ] No feature flag needed; the change is small and local
- [ ] No monitoring applies to a local CLI

### Rollback Procedure
1. Stop using the new wrapper build.
2. `git revert` the change commit.
3. Rerun the test commands in the testing section.
4. Note the revert in the parent packet.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

