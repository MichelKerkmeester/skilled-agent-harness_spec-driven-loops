# Alignment report: topic system-skilled-bots

Report-only run: every check ran in its read-only form, and this command writes only into its run folder.

## Scope

- Kind: topic, file set doc-set
- Target: `topic system-skilled-bots`
- Commits: `79519553b62e41c7a018f4e3fde04f1d2f7f30ff` to `79519553b62e41c7a018f4e3fde04f1d2f7f30ff`, 0 first-parent commits
- Files: 121, of which 0 uncommitted or untracked
- Owners: 4
- Findings: 0 (P0 0, P1 0, P2 0), 0 literal, 0 inferred, 0 outside the scope; 0 more overturned by the critic and not counted
- Open findings: 0 (0 handed off, 0 rebutted)
- Lanes: A, B, C, D
- Fix plan: [fix-plan.md](fix-plan.md)

## Surfaces

| Surface | Title | Fired | Files | Checks |
|---|---|---|---|---|
| D1 | Docs match the topic's current code | yes | 121 | lens only |
| D2 | Topic checks pass | yes | 0 | 3 |

## Battery

pass 3, fail 0, cannot run 0, not applicable 0

Grading: topic checks from topics.json; a doc-alignment run has no change-scoped battery.

Failures are not compared against the scope's start point in this version, so a failing row may be debt that predates the scope. Re-running a check at the start point needs a second checkout, which a report-only run does not create.

| Status | Severity | CI-gated | Check | Exit | ms |
|---|---|---|---|---|---|
| pass | P1 | no | `D2-skill-package` | 0 | 377 |
| pass | P1 | no | `D2-feature-catalog` | 0 | 1011 |
| pass | P1 | no | `D2-manual-testing-playbook` | 0 | 72 |

## Checks that could not run

None.

## Findings by surface

None.

## Findings outside the scope

A lane or the critic reported these on files that are not in scope.json, so they are not attributed to this range. "merged-in" means the file changed between the merge base and the head only through a merge the first-parent scope leaves out; "unchanged in range" means the range never touched it, which is usually a cause a lane traced from an in-scope change. "pre-existing (critic)" means the critic showed the finding predates the scope, whatever file it names. A finding here can still block CI; its severity stands.

None.

## Overturned by the critic

The critic refuted these or showed they repeat another finding, so they are left out of every count above. Each keeps the severity its lane gave it.

None.

## Probes awaiting the critic

None.

## Files no lane reviewed

None.

