# Iteration 7: Maintainability - playbook, catalog and README claims against the code

## Dimension

Maintainability. The four catalog leaves and eight playbook scenarios added by phase 007, checked line by line against the guard scripts they describe, plus the README counts phase 007 edited.

## Files Reviewed

- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-authoring-card.md:1-60`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md:1-70`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/{template-section-fill-guidance,example-drift-guard}.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md:1-60`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md:1-70`
- The other six `manual-testing-playbook/template-authoring/*.md` files (headers and preconditions)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh:1-120`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:1-44`
- `.skilled/skills/system-spec-kit/README.md:440-460`
- `specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/implementation-summary.md:40-110`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The card-sync guard is described as failing on the first disagreement; it runs every check** -- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-authoring-card.md:30` -- The leaf says the guard "prints one `PASS` line per check and fails on the first disagreement." `check-card-sync.sh` defines `fail_check()` as printing a FAIL line and setting `STATUS=1`, then continues through all five checks and prints `CARD SYNC FAILED` at the end (`check-card-sync.sh:49-50,116-118`). The same claim is repeated in the leaf's source table (line 50) and in the playbook scenario (`authoring-card-sync-guard.md:12`), and the guard's own header comment carries it (`check-card-sync.sh:9`). The behavior is better than the description, but an operator who expects an early exit misreads a multi-line failure report.
   Finding class: documentation-contract-drift
   Scope proof: the guard's failure path was read end to end; the three doc lines were read directly.
   Affected surface hints: card-sync catalog leaf, card-sync playbook scenario, guard header comment
   Case: two surfaces disagree at once; the guard prints both FAIL lines and `CARD SYNC FAILED`, while the leaf says it would stop at the first.

2. **Two scenarios omit `awk` and `rg` from the tools their command blocks use** -- `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md:28` -- Scenario 479 lists "Node, bash and perl" and scenario 482 lists "bash, rsync and `jq`" as preconditions. The 479 commands run the guard, which uses `awk` for the description line and `rg` for the anchor report (`check-example-drift.sh:22,35,39`); the 482 commands run the guard and the scenario's own copy step, which use `awk` and `rg` (`check-card-sync.sh:66,79,110`). Phase 008's report recorded both omissions and forwarded them to the phase 007 owner, but phase 007 had already closed, so they remain.
   Finding class: precondition-drift
   Scope proof: both scenario preconditions and both guard scripts were read; phase 008's Known Limitations names the forwarded note.
   Affected surface hints: playbook scenarios 479 and 482, example drift guard, card sync guard
   Case: an operator provisions a minimal image from the stated list, and the scenario fails on a missing `rg` that the precondition never mentioned.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `spec-authoring-card.md:30`; `check-card-sync.sh:49-50,116-118` | The guard's behavior and its description differ. |
| `checklist_evidence` | partial | hard | 84 AC rows | One stale closure note from iteration 6; no new AC defect. |
| `skill_agent` | partial | advisory | `spec-authoring-card.md:18` | Same dangling guide pointer as iteration 4. |
| `agent_cross_runtime` | pending | advisory | - | Audited later. |
| `feature_catalog_code` | fail | advisory | `spec-authoring-card.md:30,50`; `versioned-placeholder-gate.md:36` | Two catalog leaves misstate their code. |
| `playbook_capability` | fail | advisory | `authoring-card-sync-guard.md:12`; `example-drift-guard-catches-leak.md:28`; `authoring-card-sync-guard.md:28` | Two scenarios carry a wrong tool list or a wrong guard behavior. |

## Edge Cases

- The README's `references/ (42 files)` count matches the tree exactly (42 markdown files under `references/`), so phase 007's fix holds.
- The catalog root lists all four new leaves, and the playbook index lists all eight scenarios 476 to 483.
- Scenario 483's pointer file left in phase 007's `scratch/verify/` is a workspace note, not a documentation claim, so it is not reported here.
- The guard's header comment repeats the same "first disagreement" wording; it is the origin of the doc claim and is cited in the finding rather than raised separately.

## Confirmed-Clean Surfaces

- All four catalog leaves exist with a root entry, and each names the implementation, validation and playbook surfaces it owns.
- All eight scenario files carry the five required sections and a Provenance line.
- The README's tree count and file counts match the tree.
- The playbook index's category bullet and section 7.9 table list every new scenario id.
- The card-sync guard's five checks match the five surfaces the leaf says it covers, apart from the failure-ordering wording.

## Ruled Out

- A missing catalog root entry: ruled out; all four leaves are listed.
- A wrong README count: ruled out; the count matches.
- A scenario that cannot run because a script is absent: ruled out; every named script exists.

## Next Focus

Iteration 8 - correctness - the versioned gate's behavior under adversarial documents: multiple Status rows, a stamp below line 70, tokens in title lines, indented fences and CRLF input, checked against both implementations without writing outside the lineage.

Review verdict: PASS
