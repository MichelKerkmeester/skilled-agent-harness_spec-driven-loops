---
title: "Implementation Plan: sk-doc Validator Notices and Dead Playbook Citations"
description: "Adds a non-blocking fallback warning to validate_document.py, makes quick_validate.py block a non-qualified MCP tool token for skills as it does for commands, and repoints or removes four dead playbook citations. Each owner's contract and existing tests carry the change."
trigger_phrases:
  - "validator fallback warning plan"
  - "mcp token severity plan"
  - "dead citation repoint plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-doc Validator Notices and Dead Playbook Citations

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 for both validators and their tests. Markdown for the playbook files |
| **Framework** | None. Standard library only |
| **Storage** | None |
| **Testing** | pytest through `run-script-tests.sh` for `test_structure_validation.py`, the file's own runner for `test_quick_validate_086.py` |

### Overview
Three small owner fixes with no model call. `validate_document.py` records whether detection reached its README default and, when the caller gave no type, adds one warning to the result. `quick_validate.py` drops its skill-only warning branch so a non-qualified MCP tool token fails every package kind. Two playbook rows are repointed to the presentation file that now holds their anchor text, and two rows are removed from a recorded capture whose content no longer exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every cited line reopened at the build HEAD and still saying what `spec.md` quotes
- [ ] The owner suite's failing set recorded by name before any edit
- [ ] The non-qualified token count rerun and still 0

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met` with observed evidence
- [ ] The owner suite fails no file outside its recorded baseline set
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place fixes inside each owner's existing module. No new module, flag or file.

### Key Components
- **`detect_document_type()`** (`validate_document.py:210-256`): keeps its signature and its `'readme'` return. The build separates the final default from the path rules with the smallest change that lets `validate_document()` know the default was hit, for example a private helper that returns the type with its source, as `extract_structure.py:622-660` already does with `('generic', 'default')`. `detect_document_type()` stays a thin wrapper, so the five test files that import it see no change.
- **`validate_document()`** (`:1435-1538`): when `doc_type` was `None` on entry and detection came from the default, it appends one entry of severity `warning` and type `document_type_fallback`, with a message and a `fix_hint` naming `--type`.
- **`validate_skill()`** in `quick_validate.py` (`:143-273`): the token loop at `:247-251` returns invalid for any kind.

### Data Flow
File path in, detected type and its source out, rules for that type applied, warnings list extended by the notice, exit code computed from blocking errors only, exactly as today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `validate_document.py` `detect_document_type` | Producer of the type | Update: expose the default as its source, return value unchanged | `test_changelog_validator.py`, `test_category_classification_denumbered.py` and `test_root_name_consumer_matrix.py` call it and keep their results |
| `validate_document.py` `validate_document` and `main` | Producer of the result and exit code | Update: one warning when the default was hit with no type given | New pytest cases, exit code read in T011 |
| `quick_validate.py` token loop | Producer of the MCP-token verdict | Update: one blocking branch | New cases in `test_quick_validate_086.py` |
| `validate_document.py` `validate_command_frontmatter` (`:1405-1417`) | Imports `is_non_fq_mcp_token` and already blocks for commands | Unchanged | `rg -n '_is_non_fq_mcp_token' validate_document.py` shows the import and the one blocking use |
| `/create:*` workflow YAMLs that run `validate_document.py` without `--type` | Consumers of the exit code | Unchanged: exit code does not move | `create-manual-testing-playbook-auto.yaml:176`, `create-feature-catalog-confirm.yaml:205` |
| `audit_descriptions.py`, `package_skill.py` | `audit_descriptions.py` imports only constants from `quick_validate`. `package_skill.py` has its own `validate_skill` | Not a consumer of the changed branch | `rg -n 'from quick_validate' .skilled --glob '*.py'` |
| Three playbook files | Consumers of the moved command text | Update their citations | `rg` in T013, line counts in T014 |

Required inventories:
- Same-class producers: `rg -n "Default to readme|return 'readme'" .skilled/skills/sk-doc/shared/scripts/validate_document.py` and `rg -n "kind == 'command'" .skilled/skills/sk-doc/shared/scripts/quick_validate.py`.
- Consumers of changed symbols: `rg -n 'detect_document_type|validate_document|is_non_fq_mcp_token|validate_skill' .skilled --glob '*.py' --glob '*.cjs' --glob '*.yaml'`.
- Matrix axes: `--type` given or not, detection by rule or by default, path excluded or not. Four rows: explicit type (no notice), detected type (no notice), default hit (notice), excluded path (skipped, no notice). Token kind: fully qualified, server-only, bare `mcp_`, wildcard, non-MCP, crossed with skill and command.
- Algorithm invariant: the notice never changes `valid` or `exit_code`, and a token is blocking exactly when `is_non_fq_mcp_token` is true, whatever the package kind.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Each step and the check that proves it:

| Step | Observable check |
|------|------------------|
| Baseline | `run-script-tests.sh` failing set written down by name. The two fallback probes and the token count rerun |
| Fallback notice | The playbook root index run with `--json` shows `document_type_fallback` in `warnings` and exits 0. The repo-rule file still exits 1 with the notice added |
| Token severity | A temporary skill fixture with `mcp__code_mode` exits 1, with `mcp__code_mode__call_tool_chain` exits 0 |
| Tests | `ONLY_TESTS="test_structure_validation.py test_quick_validate_086.py" bash run-script-tests.sh` prints `PASS` for both |
| Citations | `rg` for the four old citations prints nothing, and `sed -n` on each new range shows its anchor text |
| Close | Full owner suite rerun with the failing set compared by name, then `validate.sh --strict` on this phase |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Fallback notice: an untyped document with no `--type` gets the warning with `exit_code` unchanged (happy path). The same document with `doc_type='readme'` gets no warning (edge case) | pytest, `test_structure_validation.py` |
| Unit | Token severity: a skill fixture with `mcp__code_mode` is invalid (happy path). A skill fixture with `mcp__code_mode__*` is valid (edge case) | `test_quick_validate_086.py` runner |
| Integration | The whole owner suite, failing set compared by name with the baseline | `run-script-tests.sh` |
| Manual | The three edited playbook files still validate as `playbook_feature`. Each new citation range read with `sed -n` | `validate_document.py`, `sed` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-doc` owner contract (`shared/scripts/README.md`, `validation-and-enforcement.md`) | Internal | Green | The notice-versus-failure choice rests on it |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | Internal | Green, 407 lines on 2026-09-27 | REQ-003 and REQ-004 pins move if it changes |
| pytest 8.4.2 | External | Green | `test_structure_validation.py` needs it |
| The owner suite's four existing failures | Internal | Red before this phase | Only the comparison by name can show no new failure |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a caller breaks on the new warning or on a newly blocked skill, or the owner suite fails a file outside its baseline set.
- **Procedure**: `git revert` the phase's commit. The three fixes touch disjoint lines, so a partial revert of one file with `git checkout <base> -- <file>` is also safe. Nothing is installed and no data changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline) ──► Validators + tests ──► Verify
        └──────────► Citations ───────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Validators, Citations |
| Validators + tests | Setup | Verify |
| Citations | Setup | Verify |
| Verify | Validators, Citations | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes, most of it the owner suite run (over 10 minutes on 2026-09-27) |
| Core Implementation | Low | 1 to 2 hours |
| Verification | Low | 30 minutes plus one more suite run |
| **Total** | | **2 to 3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline failing set of the owner suite saved in `scratch/`
- [ ] No feature flag. The change is small enough to revert whole
- [ ] No monitoring. Both validators run on demand

### Rollback Procedure
1. `git revert <phase commit>` on the branch.
2. Rerun `ONLY_TESTS="test_structure_validation.py test_quick_validate_086.py" bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`.
3. Rerun the playbook root index probe and confirm the output matches the baseline, with no `document_type_fallback` warning.
4. No stakeholder notice. Nothing is published or pushed by this phase.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
