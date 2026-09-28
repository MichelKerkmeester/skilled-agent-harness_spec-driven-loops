---
title: "Implementation Plan: Doc validation off switches"
description: "Resolves each switch through the shared hook-flags resolver in its language, environment first and hook-flags.env second, and turns it on only for truthy values. validate.sh checks after parsing its arguments and prints a skipped report under JSON, and each sk-doc validator calls a small helper at its command-line entry."
trigger_phrases:
  - "doc validation off switch plan"
  - "validation switch resolver"
  - "skipped validation report"
  - "sk-doc validator guard"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Doc validation off switches

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Node.js (CommonJS and ESM), Python 3 |
| **Framework** | None, command-line validators |
| **Storage** | None. The switches read `.skilled/hooks/hook-flags.env` |
| **Testing** | Vitest for spec-kit, `node --test` for the hooks resolver, pytest for sk-doc |

### Overview
Each switch resolves through the shared hook-flags resolver in its own language: the environment first, even when the variable is set to empty, then the last matching line of `hook-flags.env`. Only `1`, `true`, `yes` and `on` turn a switch on. `validate.sh` checks after it parses its arguments, so it knows whether JSON was asked for, and each sk-doc validator calls one helper at its command-line entry that prints a notice and exits 0.
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
One shared resolver per language, with a thin adapter at each entry point.

### Key Components
- **`hook_flag_on` in `hook-flags.sh`**: the shell check `validate.sh` sources, so the switch costs no Node call.
- **`isFlagOn` in `hook-flags.cjs`**: the Node check, with the precedence `isHookEnabled` already uses.
- **`validation-switch.cjs`**: the sk-doc Node helper. It calls `isFlagOn`, prints the notice and a JSON line when asked, and exits 0.
- **`validation_switch.py`**: the sk-doc Python helper. No Python resolver exists, so it mirrors `loadConfigFile` and the truthy set.

### Data Flow
A validator starts and calls its helper with its own name and arguments. The helper resolves the switch. When the switch is off, the validator runs unchanged. When it is on, the helper prints where the switch was set on stderr, prints `{"skipped": true, ...}` on stdout if JSON was asked for, and exits 0 before any check runs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate.sh` skip path | Producer of the report | Update | `validate-skip-switch.vitest.ts` |
| `repair-derived.cjs` | Reads `results` and `entries` for error rows | Unchanged | The regression test in `repair-derived.vitest.ts` |
| `strict-pass-freshness.ts` | Reads the exit code, `passed` and the rows | Unchanged, counts a skip as a pass | `strict-pass-freshness.ts:255-270` |
| `quality-audit.sh` | Reads the exit code only | Unchanged | `quality-audit.sh:130-145` |
| `progressive-validate.sh` | Passes the output through | Unchanged | `progressive-validate.sh:246-285` |
| `create.sh` | Runs `--quiet` and reads the exit code | Unchanged | `create.sh:1027`, `:1665`, `:1901` |
| `changed-packet-validation.yml` | CI consumer | Unchanged, never sees the switch | `rg -n 'SKIP_VALIDATION\|HOOK_FLAGS_CONFIG' .github` finds nothing |
| Post-edit router | Runs `check-frontmatter-versions.sh`, exit 1 is a finding | Unchanged, a skip exits 0 | `post-edit-router.cjs:38` |
| sk-doc validators | Producers of findings | Update, check path only | `test_validation_switch.py` |
| Scripts that import validator functions | Library readers | Unchanged, the guard sits in `main` | `audit_descriptions.py:49`, `validate_catalog_package.py:46`, and the rename engine and reference checker, which import `check_no_new_snake_case` |
| `audit_readmes.py` | Reads `valid` from `validate_document.py --json` | Unchanged, a skip line carries `valid: true` | `test_validation_switch.py` compares the line exactly |
| The four readers of `hook-flags.env` | Parse the file for every hook and both switches | Update after close: a `#` after a space or tab ends a value | The cross-reader test in `hook-flags.test.cjs` and the example test in `test_validation_switch.py` |

Required inventories:
- Same-class producers: `rg -n 'SPECKIT_SKIP_VALIDATION|SPECKIT_VALIDATION\b' .skilled` found one reader, `validate.sh`, with two skip exits (lines 19 and 115). Both move onto one path.
- Consumers of changed symbols: `rg -n 'validate\.sh' --glob '!**/tests/**'` over the runtime, scripts, hooks and workflows, and a per-validator `rg -F <name>` over code, workflows and commands.
- Readers of the flags file, for the comment rule: `rg -l -L 'HOOK_FLAGS_CONFIG|hook-flags\.env'` over the code and every runtime folder. Four readers parse the file: `hook-flags.cjs`, `hook-flags.sh`, `validation_switch.py` and `check-dist-staleness.sh`, and each runtime's dist checker is a link to the last. Every other consumer goes through one of the four.
- Matrix axes: where the value comes from (environment, file, neither), the environment value (truthy, falsy, empty, unset), the output mode (text, JSON) and the validator mode (check, write, self-test).
- Algorithm invariant: a switch is on only when its effective value is truthy, and the effective value is the environment value whenever the variable is set, else the last `NAME=` line of the flags file. Adversarial cases: environment `0` over file `1`, empty environment over file `1`, a quoted `'yes'`, a commented line, spaces around `=`, and a missing file. The comment rule adds a comment after a bare value, after quotes and after a tab, `a#b`, `on#x` and an empty value before a comment.
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
| Unit | `isFlagOn`, `hook_flag_on` and the Python resolver mirror | `node --test`, pytest |
| Integration | `validate.sh` in both output modes, `repair-derived.cjs` under the switch, and one Python and one Node validator spawned with each source | Vitest, pytest with subprocesses |
| Manual | The pre-commit gate's own command, `repair-derived.cjs --folder <packet> --apply`, with the switch on, and the suites rerun with it off | Node, the suite runners |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `hook-flags.cjs` and `hook-flags.sh` | Internal | Green | The switches could not persist in `hook-flags.env` |
| Node and Python 3 on the path | External | Green | The validators already need both |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator skips when no switch is set, or a skipped report breaks a consumer.
- **Procedure**: revert this packet's commits. No data or generated file depends on them.
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
| Setup | Low | Under an hour |
| Core Implementation | Med | 2 to 3 hours |
| Verification | Med | 1 to 2 hours |
| **Total** | | **4 to 6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not needed, nothing changes data
- [x] Feature flag configured: both switches are the flags, and both default to off
- [x] Monitoring alerts set: not applicable to local command-line tools

### Rollback Procedure
1. Unset the switch, or set it to `0` in the environment, which wins over the file.
2. Revert the packet's commits with `git revert`.
3. Rerun the spec-kit and sk-doc suites to confirm the validators run again.
4. No one outside this repository needs telling. The switches are default off.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
