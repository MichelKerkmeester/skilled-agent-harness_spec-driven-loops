---
title: "Deep Review Iteration 001 — correctness"
trigger_phrases: []
---

# Iteration 1: D1 Correctness — switch semantics and the guard surface

## Focus

Dimension: correctness. Files read and assessed: `.skilled/hooks/shared/hook-flags.cjs`, `.skilled/hooks/shared/hook-flags.sh`, `.skilled/hooks/shared/hook-flags.test.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`, `.skilled/skills/sk-doc/shared/scripts/validation-switch.cjs`, `.skilled/skills/sk-doc/shared/scripts/validation_switch.py`, `.skilled/skills/sk-doc/scripts/tests/test_validation_switch.py`, `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts`, plus guard-placement spot checks across the 20 guarded validators.

Scope investigated: the two switches' resolution precedence and truthy set, the comment rule, the `validate.sh` skip path and its report, the sk-doc guard placement (check paths vs writers/self-tests), and the tests that pin each behavior.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 10 (9 primary + guard sweep)
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F001**: Shell truthy check deletes internal whitespace, so a quoted value with an internal space that spells a truthy token reads `on` in the shell reader but `off` in the Node and Python readers, `hook-flags.sh:26`. Evidence: `.skilled/hooks/shared/hook-flags.sh:26` runs `tr -d '[:space:]'` (deletes every whitespace character anywhere in the value) before the `1|true|yes|on` case, while `.skilled/hooks/shared/hook-flags.cjs:93-97` (`value.trim().toLowerCase()`) and `.skilled/skills/sk-doc/shared/scripts/validation_switch.py:43-45` (`value.strip().lower()`) trim only the edges. A saved `SKDOC_SKIP_VALIDATION="o n"` therefore resolves truthy through `hook_flag_on` and falsy through `isFlagOn`/`is_truthy`. The cross-reader table in `.skilled/hooks/shared/hook-flags.test.cjs:193-249` does not include an internal-whitespace row, so the divergence is unpinned. Impact is low (no real switch value carries internal spaces; the packet's own docs say every value is one word), and the `tr -d` shape predates this packet — but the packet's parity claim ("one rule everywhere keeps the readers in agreement", `implementation-summary.md:108`) now covers these readers and does not note the exception. Recommendation: trim edges only in the shell mirror (`sed 's/^[[:space:]]*//; s/[[:space:]]*$//'`) or add the case to the cross-reader table as a documented difference.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | not-run (scheduled) | hard | - | Traceability iteration owns the spec-vs-implementation pass |
| checklist_evidence | not-run (scheduled) | hard | - | Traceability iteration owns the evidence pass |
| feature_catalog_code | not-run (scheduled) | advisory | - | Maintainability/broadening iterations |
| playbook_capability | not-run (scheduled) | advisory | - | Maintainability/broadening iterations |

## Claim Adjudication

No new P0 or P1 findings in this iteration — no typed packets required. F001 is P2 and does not gate convergence.

## Assessment

- New findings ratio: 1.0 (one fully-new P2; weighted total 1.0)
- Dimensions addressed: correctness
- Novelty justification: first iteration; the correctness surface (precedence, truthy set, comment rule, skip path ordering, guard placement) was read end to end. The precedence chain is correct on every path checked: environment-first with set-but-empty winning (`hook-flags.cjs:181-193`, `hook-flags.sh:37-49`, `validation_switch.py:87-92`), last matching file line wins in all three readers, only `1/true/yes/on` turn a switch on, `validate.sh` checks after `parse_args` and `apply_env_overrides` and before recursion (`validate.sh:404-410`), `--help` still exits in `parse_args` before the check, and a missing folder still exits 3 before the check (`validate.sh:104-106`). Guard placement matches the claimed exemptions: `validate_document.py:1712-1714` (not `--fix`), `frontmatter-version.mjs:392-393` (gate/verify only), the two README checkers and the link resolver return from `--self-test` before the guard (`check_derived_readme_counts.py:282-283`, `check_readme_references.py:273-274`, `resolve_skill_markdown_links.py:170-172`). The 20-guard count is confirmed by file sweep (22 files match the guard symbol; 20 are validators, 2 are the helpers).

## Ruled Out

- "Skip report is unreadable by the pre-commit gate": ruled out by reading `repair-derived.cjs:167-170` — it reads `report.results` and `report.entries` with `|| []`, so the skipped report's single `info` entry yields zero error rows.
- "The switch hides a bad argument": ruled out — `parse_args` validates and exits before `exit_if_switched_off` (`validate.sh:104-106` vs `:410`).
- "`--help` is suppressed by the switch": ruled out — `show_help` exits during parsing (`validate.sh:85-86`).
- "Writers and self-tests are silenced": ruled out for the documented set by reading the exemption branches (see Assessment).

## Dead Ends

- Running the suites directly to re-derive the test results: not attempted. This lineage's containment forbids commands that write outside its directory (vitest/node test caches, temp fixtures), so all verification in this lineage is by reading, and the suite outcomes remain the packet's own claims, cross-checked against the test sources.

## Recommended Next Focus

D2 security: the parser surface (injection refusal in `hook_flag_on`, quoted/comment/tab value handling in all four readers, BOM/CRLF behavior), the CI-enforcement claim (`rg` over `.github`), and the `.gitignore` status of `hook-flags.env`.

Review verdict: PASS
