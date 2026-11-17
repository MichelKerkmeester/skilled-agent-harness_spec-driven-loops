# Deep Review Iteration 002 - docs-metadata confirm 5b

## Dispatcher

BINDING: target=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
BINDING: maxIterations=3
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build

- Lineage: `docs-metadata-confirm-5b`. Dimension this iteration: **maintainability**, with the **correctness** half of the playbook verdict vocabulary.
- Operator review focus, bound as `review_focus`: the same confirming brief as iteration 1; this iteration keeps the brief's holdout rule and its write boundary and continues the docs-metadata area. `steer.md` does not exist in the lineage, so no lead ruling applied.
- How this iteration addressed the focus: it confirmed the four playbook edits and the tests README regeneration line by line, then swept the same two documents for the residual lists the fixes did not touch. It did not re-enter the traceability count checks already closed in iteration 1, and it did not re-report any D13 item or any limit already named in `report-2.txt`/`report-3.txt`.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/verify-5/report.md:29`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation/plan.md:88`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:30`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:38`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:103`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:117`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:125`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:152`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:186`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:191`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:341`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:345`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:346`
- `.skilled/skills/system-skill-advisor/runtime/tests/README.md:57`
- `.skilled/skills/system-skill-advisor/runtime/tests/README.md:95`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:30`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:828`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md:183`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Section 18.5 still names numbered category slots that the playbook no longer has** -- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:341` -- The notes in the catalog-to-category mapping table still say "daemon mechanics in `05`, operator-facing trust-state scenarios in `04`" (`:341`), "native command-surface scenarios in `01`" and "CLI hook plus plugin invocation scenarios in `02`" (`:345`), and "happy-path hook behavior in `02`, disable plus rollback flags in `03`" (`:346`). Every category folder is now feature-named, and the same document no longer uses the numbered scheme at `:38` or `:103`, so these four quantities resolve to nothing.
   Case: an operator reads section 18.5 to find where the daemon scenarios live, follows "in `05`" to a category folder or section numbered 05, and finds neither: the daemon section is `## 11. AUTO UPDATE DAEMON` and the folder is `auto-update-daemon/`.
   Finding class: instance-only.
   Scope proof: `ls .skilled/skills/system-skill-advisor/manual-testing-playbook/` prints nine bare kebab-case folders and no `NN--*` entry; `rg -n "in \`0[1-9]\`"` over the playbook root returns only `:341`, `:345` and `:346`.
   Affected surface hints: playbook section 18.5 mapping notes; playbook inputs section; category folder names.

2. **The tests README package-topology block omits the `doctor/` suite folder** -- `.skilled/skills/system-skill-advisor/runtime/tests/README.md:57` -- Section 3 lists thirteen test folders and leaves `doctor/` out. The folder exists and holds `doctor/skill-graph-freshness-panel.vitest.ts`; the regenerated section 4 in the same file lists `doctor/` at `:190`, so the two inventories in one document disagree.
   Case: a maintainer scanning the package-topology block for the doctor coverage before changing a doctor bridge sees no `doctor/` row and concludes the folder does not exist, while section 4 and the disk both hold it.
   Finding class: instance-only.
   Scope proof: `find .skilled/skills/system-skill-advisor/runtime/tests -maxdepth 1 -type d` prints fourteen entries including `doctor`; section 3 lists thirteen; `git show 2a1a42263cc:.../tests/README.md` shows the same omission, so it predates the fix and the regenerated section 4 is the correct inventory.
   Affected surface hints: tests README section 3 package topology; tests README section 4 directory tree; `runtime/tests/doctor/`.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Phase child `032-review-pass-five-remediation` D10 names the playbook lines changed; the two findings are residual lists the decision did not cover. |
| `checklist_evidence` | core | notApplicable | No top-level checklist claims these docs. |
| `skill_agent` | overlay | pass | The playbook is linked from SKILL.md as the manual-validation surface; no routing claim changed. |
| `agent_cross_runtime` | overlay | pass | No runtime doc claim was edited by this fix. |
| `feature_catalog_code` | overlay | pass | The playbook's category mapping still names the seven catalog groups that `feature-catalog/` holds. |
| `playbook_capability` | overlay | partial | The four DM5 playbook fixes verify; the section 18.5 numbered slots remain (finding 1). |

Summary: required 6, executed 6, pass 3, partial 2, fail 0, blocked 0, notApplicable 1.

## Integration Evidence

- **Playbook package validator:** `validate-playbook-package.cjs:30` defines `REQUIRED_OUTCOME_VOCABULARY = ['PASS','FAIL','SKIP']` and `:828` `verdictChecks` applies `FORBIDDEN_VERDICTS` to every scenario file. The root's `:30` persistence line and `:117-120` verdict list now both use the required three, so DM5-P2-007 is fixed at the owner.
- **Playbook template:** `manual-testing-playbook-template.md:183` states the same three outcomes, so the root change moves toward the template rather than away from it (D10's rationale).
- **Playbook inventory test:** `runtime/tests/manual-testing-playbook.vitest.ts:53` asserts the root holds 53 scenario rows and `:55` asserts 53 files; the root now says 53 files across 9 categories, and the disk holds 53 files across 9 folders.
- **Tests README tree:** section 4 matches `ls -1A` one for one (106 entries), so DM5-P2-005 is fixed exactly; section 3 is a second, older inventory in the same file.

## Confirmed-Clean Surfaces

- DM5-P2-002 (category-folder shape) is fixed at `:38` (gap-09 note removed) and `:103` (feature-named example), and `rg -n "gap-09|NN__category|09--"` over the playbook package returns nothing.
- DM5-P2-003 (CL schedule) is fixed at `:152` and `:186`: the wave plan and the category heading both read `CL-001, CL-005..CL-010`, which matches the seven authored `CL-0*` frontmatter ids in `cli-hooks-and-plugin/`.
- DM5-P2-007 (verdict vocabulary) is fixed: the root no longer defines `PARTIAL`, and the feature rule now reads `SKIP`: no mapped scenario is `FAIL` and at least one is `SKIP` (`:125`).
- DM5-P2-005 (tests tree) is fixed: 91 files plus 14 folders plus README, no drift.
- The `python-compat` mapping row at `:347` no longer carries the gap-09 parenthetical and still reads `1:1 mapping`.

## Edge Cases

- Finding 1 is a residual of the same class as DM5-P2-002, whose fix edited `:38` and `:103` only. It is reported as a new site, not as a re-report of the fixed lines.
- Finding 2 predates the fix commit (`2a1a42263cc` holds the same thirteen-row topology block). It is reported because the file is a fixed file whose regenerated section 4 now contradicts section 3, and the earlier DM5-P2-005 finding was scoped to the tree.
- The `CL-004` row at `:191` is a deliberate `(not yet authored)` placeholder, not a contradiction of the `:186` heading: the heading enumerates validated scenarios, and the row labels the gap. Ruled out below rather than reported.
- `README.md:176` (iteration 1, finding 1) and `ROUTER.md:103` (iteration 1, finding 2) remain active and are not re-raised here.

## Ruled Out

- "The `CL-004` row contradicts the section 8 heading": ruled out; the row is explicitly labelled `(not yet authored)` and carries no link, so it cannot be read as a validated scenario and the inventory test excludes it.
- "The playbook's `READY` release word is a stray fourth verdict": ruled out; D10 records it as intentionally kept from the root template's release rule, and the validator's forbidden list applies to scenario files only.
- "The playbook's new `SKIP` feature rule diverges from the template": ruled out; the template's rule only covers the all-blocked case, and the root needs a rule for a mixed PASS/SKIP feature, which D10 chose.
- "The tests README's KEY FILES table should list the six command-surfacing suites": ruled out; that table is an explicit curated subset (`:209`), not an inventory, and DM5-P2-005 named the tree.

## Next Focus

- Dimension: security, with a closing cross-reference sweep.
- Focus area: holdout hygiene over the nine reviewed docs (no prompt text, no row ids, no holdout split quoted) and a convergence check that the two P2s of iteration 1 and the two of iteration 2 are all still active and none was introduced by this iteration's edits.
- Reason: security is the last uncovered dimension, and no new inventory directions remain in the docs-metadata area after two productive iterations.
- Rotation status: traceability and maintainability/correctness reviewed; security next.
- Blocked/productive carry-forward: productive direction was doc-list versus live-inventory comparison (two findings); no blocked approach.
- Required evidence: a `rg` sweep for prompt corpora references and prompt-looking text over the reviewed set, and a re-read of the four active finding sites.
- Recovery note: none.

Review verdict: PASS
