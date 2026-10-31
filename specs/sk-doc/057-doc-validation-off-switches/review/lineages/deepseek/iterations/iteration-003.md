---
title: "Deep Review Iteration 003 — traceability"
trigger_phrases: []
---

# Iteration 3: D3 Traceability — spec_code, checklist_evidence, release-line claims

## Focus

Dimension: traceability. Protocols executed: `spec_code` (core, hard), `checklist_evidence` (core, hard). Files read and assessed: `spec.md`, `acceptance-criteria.md`, `tasks.md`, `plan.md`, `implementation-summary.md` (all 062), `specs/sk-doc/061-skilled-release-changelog/spec.md`, `.skilled/changelog/skilled/README.md`, the 13 manifest changelog entries, plus git-history verification of the pinned commit ranges.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 5 packet docs + 2 release-line docs + 13 changelog entries + git history
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F003**: The upcoming release entry `v4.0.0.2` does not mention the validation off switches, although the switch work landed on `main` before the entry's last update and the entry is still untagged (the README calls it "the entry for the upcoming release"). Evidence: `.skilled/changelog/skilled/README.md` ("The entry for the upcoming release lives here too, before its tag exists. Today that is `v4.0.0.2.md`"); `git log -1 --format=%ci` shows the switch commits at 2026-09-28 10:02 +0200 and the entry's last commit (`47432cf846`) at 14:19 +0200; `git rev-parse refs/tags/v4.0.0.2` fails (untagged); a search of all release entries for `SKIP_VALIDATION|off switch|validation off` matches only an unrelated "off switch" sentence in `v4.0.0.1.md`. Impact is release-documentation completeness only. Downgrade/close trigger: a later release entry (or an explicit scoping note) covers the switches before `v4.0.0.2` is tagged, or the operator confirms the switches are deferred to a later release line.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | REQ-001..REQ-008 each mapped to implementation evidence (see Assessment) | Every requirement resolves to shipped behavior read in iterations 1-2; no contradictions found. |
| checklist_evidence | partial | hard | tasks.md evidence cells: T002, T005, T008, T009, T013, T017, T018, CHK-021, CHK-FIX-002, CHK-FIX-007 re-verified by reading; suite-count rows (T014, T015, T016, CHK-010) are executed-claim rows | counts: { pass: 10, partial: 1 (suite rows), fail: 0 } — the subset re-verifiable from this lineage passes; suite outcomes remain the packet's own observed claims because lineage containment forbids running the suites. |
| feature_catalog_code | pending | advisory | - | Iteration 4 |
| playbook_capability | pending | advisory | - | Iteration 4 |
| skill_agent | notApplicable | advisory | - | Spec-folder target; no skill/agent drift observed |
| agent_cross_runtime | notApplicable | advisory | - | Spec-folder target |

## Claim Adjudication

No new P0 or P1 findings in this iteration — no typed packets required. F003 is P2 and does not gate convergence.

## Assessment

- New findings ratio: 1.0 (one fully-new P2)
- Dimensions addressed: traceability
- Novelty justification: `spec_code` executed as a full requirement-by-requirement mapping:

| REQ | Verdict | Evidence (read) |
|-----|---------|-----------------|
| REQ-001 commit trap | pass | `validate.sh:155-173` (skip after parse), `repair-derived.cjs:167-170` (`results`/`entries` with `|| []`), `repair-derived.vitest.ts:244-257` (exit 0, `inspected=1 repaired=0 failed=0`, bytes unchanged). Pre-fix trap confirmed from `git show 4f4d25288c~1:...validate.sh` (old exits at lines 19-20 and 115). |
| REQ-002 precedence + truthy set | pass | `hook-flags.cjs:181-193`, `hook-flags.sh:37-49`, `validation_switch.py:87-92`; `validate-skip-switch.vitest.ts:57-79` covers env-on, file-on, env `0`/empty/`skip` over file `1`. |
| REQ-003 SKDOC switch guards every validator | pass | 22-file guard sweep = 20 validators + 2 helpers; `validate_report.py` carries no guard (kept running by design); sweep test enumerates exactly 20. |
| REQ-004 writers/self-tests live | pass | `validate_document.py:1712-1714`, `frontmatter-version.mjs:392-393`, `check_derived_readme_counts.py:282-283`, `check_readme_references.py:273-274`, `resolve_skill_markdown_links.py:170-172`. |
| REQ-005 JSON skip line | pass | `SKIPPED_LINE` in `validation-switch.cjs:27` and `validation_switch.py:33`; `wantsJson` handles `--json`, `--format=json`, `--format json`; report shape at `validate.sh:142-150`; AC-005's `audit_readmes.py` reader uses `valid`. |
| REQ-006 CI keeps enforcing | pass | Zero matches for `SKIP_VALIDATION|HOOK_FLAGS_CONFIG|SPECKIT_VALIDATION` over `.github` (exit 1) with a positive control on `validate.sh`; `.gitignore:352` + `git check-ignore -v` + `git ls-files` (untracked). |
| REQ-007 docs name both switches | pass | `ENV-REFERENCE.md:172`, `path-scoped-rules.md:122,126`, `validation-rules.md:735`, `spec-validation-rule-engine.md`, `core-standards.md:230`, `validation-and-enforcement.md` (5 hits), `shared/scripts/README.md:33`, `hooks/README.md:78`, `hooks/shared/README.md:23` — every named doc carries the switch text. F002 records the `.env.example` omission as an advisory. |
| REQ-008 comment rule in four readers | pass | `hook-flags.cjs:122`, `hook-flags.sh:47`, `validation_switch.py:80`, `check-dist-staleness.sh:45` all use the same `[ \t]#` rule; cross-reader table at `hook-flags.test.cjs:193-249` holds all four to one expected map; example test at `:251-273`. F001 records the internal-whitespace exception, which is outside the comment rule. |

- `checklist_evidence`: the tasks.md evidence cells were checked for specificity and against their targets. Re-verified by reading: T002 (pre-fix reproduction matches git history), T005 ("both old exits are gone" — confirmed, only one path remains at `validate.sh:410`), T008/T009 (20 guards), T013 (regression test body), T017/T018 (example + cross-reader tests), CHK-021 (the ten symlinks exist in `sk-doc/scripts/`, of which the six guarded ones follow the switch: five guarded shims plus `check-frontmatter-versions.sh` → `frontmatter-version.mjs gate`), CHK-FIX-002 (four readers — independently re-derived by repo sweep), CHK-FIX-007 (commit ranges verified: `4f4d25288c..396d26d4ff` = `b274f085fb`, `3303e85a43`, `396d26d4ff`; `079d9cb31e..12c9351b5c` = `f5485b51d1`, `a0127c7a92`, `3ad952e58e`, `12c9351b5c`). Suite-count rows (T014, T015, T016, CHK-010) are the packet's own executed claims and were not re-run under lineage containment.
- Executed verification of a release-line claim (read-only): the trigger-index lookup for `sk-git v1.0.0.0` returns `.skilled/skills/sk-git/changelog/v1.0.0.0.md` first with `matchClass: "exact"`, score 1.0 — the 061 claim "A lookup for `sk-git v1.0.0.0` now ranks that entry first" holds in the committed index. All 13 manifest changelog entries carry `trigger_phrases:`.
- AC coverage: no `checklist.md` exists in the packet, so the `AC_COVERAGE` validation signal predicate is inactive (exempt); the acceptance-criteria.md rows AC-001..AC-008 were read against the same evidence above and none contradicts.

## Ruled Out

- "The packet's spec contradicts the implementation": ruled out — every REQ resolves to shipped behavior; the two semantics changes (any-non-empty → truthy set; `passed: true` on a skip) are both documented in the spec's risk table and the implementation summary's key decisions.
- "The pinned commit ranges are wrong": ruled out — both ranges verified against `git log --oneline`.
- "A changelog entry claims something the switches work contradicts": ruled out — no entry claims the switches; the only related match is an unrelated "off switch" phrase (F003 records the omission itself).

## Dead Ends

- Re-running the suites to convert the executed-claim rows into re-observed rows: not attempted (lineage containment). Recorded as a standing limitation of this lineage's evidence.

## Recommended Next Focus

D4 maintainability: the feature-catalog and playbook overlay protocols, the docs' internal coherence (READMEs, catalogs, playbooks, changelog house style), comment hygiene on changed files, and the recorded follow-ups (dead `SPECKIT_SKIP_DOC_MODEL_VALIDATE` mentions, BOM asymmetry).

Review verdict: PASS
