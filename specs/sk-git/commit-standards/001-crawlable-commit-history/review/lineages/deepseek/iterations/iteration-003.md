# Iteration 3: Traceability — spec_code, checklist_evidence, feature_catalog_code, playbook_capability

## Focus

- Dimension: D3 Traceability (core protocols `spec_code`, `checklist_evidence`; overlay protocols `feature_catalog_code`, `playbook_capability`).
- Files reviewed: parent `spec.md`, `goal.md`; child `tasks.md`/`decision-record.md`/`implementation-summary.md` for 003/004/005/006/007; `.opencode/skills/sk-git/feature-catalog/feature-catalog.md`; `.opencode/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md`; `.opencode/skills/sk-git/manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md`; `.opencode/skills/sk-git/changelog/v1.6.0.0.md`; `.opencode/skills/sk-git/graph-metadata.json`; `AGENTS.md` §5; `REPO RULES.md`; `repo-rules/delegation-and-orchestration.md`.
- Scope investigated: every parent-spec normative claim and Files-to-Change row; every checked task/checklist claim with a spot-check; catalog claims; playbook scenario executability; governance-doc claims vs hook implementation.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 14
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (four new traceability P2s)

## Findings

### P0, Blocker

None.

### P1, Required

None. (F010 below overstates a hook guarantee, but the implemented behavior remains fail-safe — uniqueness is preserved by history scanning — so it stays advisorial.)

### P2, Suggestion

- **F009**: The parent spec's Files to Change row for `REPO RULES.md` ("Modify … Trigger row routing git actions to the rule", `spec.md:117`) was superseded by ADR-005 ("No new repo rule", `002-format-decision/decision-record.md:437-457`) and never shipped: `REPO RULES.md` has no git trigger row and was not modified. The rule-file row at `spec.md:116` carries the "if 002 decides" conditional; the `REPO RULES.md` row does not, so the table still reads as an unfulfilled deliverable. Evidence: `.opencode/specs/sk-git/028-crawlable-commit-history/spec.md:116-117`, `.opencode/specs/sk-git/028-crawlable-commit-history/002-format-decision/decision-record.md:437`, `REPO RULES.md` §2 trigger table (no git/commit trigger).
- **F010**: `AGENTS.md:343` claims "The commit-msg hook enforces it and refuses a hand-written or duplicate id". The hook only refuses a malformed (not seven digits) or colliding id; a well-formed unused id typed by hand passes, and `prepare-commit-msg` deliberately leaves an existing id in place (`REQUIRE_ID` is 0 when `HAS_COMMIT_ID` is 1). `SKILL.md:516` (NEVER #11) asserts the same as a rationale. Behavior stays fail-safe (a typed id is included in the allocator's scan and can never be reissued), so this is a claim-accuracy defect, not a functional one. Evidence: `.opencode/scripts/git-hooks/commit-msg:149-167`, `.opencode/scripts/git-hooks/prepare-commit-msg:158-176`, `.opencode/skills/sk-git/SKILL.md:516`, `AGENTS.md:343`.
- **F011**: `checklist_evidence` gaps: L3+ compliance items are checked with no supporting artifact in two children — `[x] CHK-130 [P1] Security review completed`, `CHK-131 Dependency licenses compatible`, `CHK-132 OWASP Top 10 checklist completed`, `CHK-133 Data handling compliant with requirements` at `006-docs-and-release/tasks.md:224-227` and `007-git-workflow-run-failures/tasks.md:224-227`. No security-review, license or data-handling artifact exists anywhere in either phase (grep for "security review"/"OWASP" outside `tasks.md` returns nothing), and the generator's own sign-off block is the only verification row. These are scaffold-template claims checked in bulk; either evidence them or mark them not-applicable. Evidence: `.opencode/specs/sk-git/028-crawlable-commit-history/006-docs-and-release/tasks.md:224-227`, `.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/tasks.md:224-227`.
- **F012**: The parent spec's Phase Documentation Map still carries a duplicate scaffold row, `| 7 | 007-git-workflow-run-failures/ | [Phase 7 scope] | Pending |`, directly below the real completed row for the same phase — a self-contradiction inside one table (Complete vs Pending). Evidence: `.opencode/specs/sk-git/028-crawlable-commit-history/spec.md:137` vs `:139`.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `spec.md:116-117`, `decision-record.md:437`, `REPO RULES.md` §2; `AGENTS.md:343`, `commit-msg:149-167` | ~14 of 16 Files-to-Change rows resolve to shipped files at the stated phase; one row (REPO RULES.md) superseded by ADR-005 without table repair; one governance claim (hand-written id) overstates enforcement. Not fail: no normative requirement lacks a shipped behavior; the two items are documentation accuracy. |
| checklist_evidence | partial | hard | `006/tasks.md:224-227`, `007/tasks.md:224-227`; 174 of 180 checked items trace to phase artifacts | Blocking gates (T-tasks) carry real evidence in `implementation-summary.md` verification tables; the compliance template block does not (F011). |
| feature_catalog_code | pass | advisory | `feature-catalog/workflow-playbooks/conventional-commit-workflows.md:30-46`; `feature-catalog/feature-catalog.md:131`; source table names `prepare-commit-msg`, `commit-id-naming.sh`, `scripts/tests/commit-id-naming.test.sh` (all exist) | Changelog claim "the feature catalog carries a Commit Identity And Search subsection" resolves; catalog lists the actual implementing files. |
| playbook_capability | partial | advisory | `manual-testing-playbook/commit-formation/find-commits-by-packet-and-id.md:49`; global hooks dir has no `prepare-commit-msg`; 006 T010 (advisor probe / install) waits for merge | GIT-044's three queries and files are real, but the scenario cannot pass in this tree: the stamper hook is not installed (`core.hooksPath=/Users/michelkerkmeester/.config/git/hooks` holds commit-msg/pre-commit/… but no `prepare-commit-msg`), and the two branches with pending operator gates (005 T010 push window, 006 T010 post-merge probe) are honestly marked open. Executable post-install, needs no change. |

## Assessment

- New findings ratio: 1.0 (four new P2s).
- Dimensions addressed: traceability.
- Novelty justification: none of the four is a restatement of the iteration-1/2 findings; F010 is the governance-doc counterpart of F004's behavior note but cites distinct documents and the reverse direction (docs stronger than code), and F009/F011/F012 are new locations.
- Verification depth: phase statuses cross-checked against `tasks.md` checkbox state (001-005/007 at 60/60 except the two operator-gated children at 57/60 each), spec Files-to-Change walked row by row, catalog and playbook claims opened at their targets, `graph-metadata.json` commit vocabulary confirmed (`commit id`, `commit identifier`, `find commits by packet`, `commit ordinal`, `stamp commit id`).

## Ruled Out

- "Spec: trailer omitted when work touches no packet" vs hook behavior: the stamper only writes `Spec:` when `SPECKIT_COMMIT_SPEC` is set (`prepare-commit-msg:178-183`), matching the docs.
- Subject-length contract: hook enforces the documented 100-hard-max (`commit-msg:110-113`); the 80 target is advisory by design.
- Phase map "executed last" vs "executed before 006": both rows read consistently (007 runs before the 006 closeout).
- Advisor vocabulary gap: `graph-metadata.json` owns commit-identity trigger phrases; the probe itself is honestly deferred to post-merge (006 T010).

## Dead Ends

- Looking for the "11,000 citations remapped" claim in shipped state: it is step 005 of the pending operator window (plan.md:227), correctly marked blocked rather than claimed.
- Trying to execute GIT-044 end to end inside this lineage: hook installation is a write action outside the lineage write surface; the scenario is verified by reading its commands against the hook code instead.

## Recommended Next Focus

D4 Maintainability: reference/asset version and `last_updated` metadata drift, template example hygiene against the token scanners, and the stabilization re-check of F001 through the real git trailer parser (`git interpret-trailers --parse`), plus a decrement check on the P2 findings recorded so far.

Review verdict: PASS
