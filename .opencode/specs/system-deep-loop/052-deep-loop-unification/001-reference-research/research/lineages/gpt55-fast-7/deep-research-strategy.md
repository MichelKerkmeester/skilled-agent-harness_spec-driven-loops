# Deep Research Strategy: system-deep-loop Merge Design Stress Test

## Research Topic

Validate and stress-test the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`: structural layout, bidirectional path-coupling repair, the `system-spec-kit` tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether `fallback-router.ts` should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

## Known Context

- `resource-map.md` was not present at init; skipping coverage gate for a pre-existing packet map.
- The phase parent states the merge is structural/identity work, not workflow-behavior change, and explicitly keeps `/deep:*` commands and deep agents stable. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/spec.md:80]
- Child 002 owns the physical `deep-loop-workflows` rename, nesting `deep-loop-runtime` as `runtime/`, internal bidirectional path repair, and the four-site `system-spec-kit` tooling-borrow. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:69]
- Child 003 owns external reference migration across commands, agents, docs, plugin/hooks/CI, graph metadata, and advisor corpus. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:69]
- Child 004 is optional and operator-gated fallback-router wiring. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:42]

## Key Questions

- [x] Is the proposed `system-deep-loop/` target layout structurally sound?
- [x] Are the forward and reverse path-coupling repair rules correct?
- [x] Does the `system-spec-kit` tooling-borrow need same-phase repair?
- [x] Is the external reference migration plan complete enough across commands, agents, READMEs, plugin/hooks/CI, graph edges, and advisor corpus?
- [x] Should `fallback-router.ts` be wired now for real GLM-5.2 to MiMo-v2.5-Pro fallback?

## Answered Questions

- Target layout is sound if `runtime/` remains infrastructure-only with no `workflowMode` entry and no nested `graph-metadata.json`. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:154]
- Directional path repair is correct: forward runtime-to-workflows imports keep hop count and delete the old segment; reverse workflows-to-runtime imports remove one hop and rename to `runtime/`. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/002-hub-rename-and-runtime-nesting/spec.md:171]
- The `system-spec-kit` tooling-borrow must land with phase 002 because it affects runtime typecheck paths and system-spec-kit council test coverage. [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/package.json:31]
- External migration is broad and advisor-sensitive; field-scoped corpus changes and rebaselining are required. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:101]
- Fallback-router wiring is useful but should stay optional unless the operator wants automatic remediation before re-running GLM-heavy fanout. [SOURCE: file:.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:90]

## What Worked

- Verifying phase plans against live code caught the correct asymmetric path-repair rule and avoided a naive "everything is one level deeper" migration.
- Separating structural migration (002), external identity migration (003), and behavior work (004) kept the merge design tractable.
- Checking plugin behavior found a subtle silent-risk surface: `mk-deep-loop-guard` fails open when its old registry path disappears.

## What Failed

- No pre-existing `resource-map.md` existed in the spec folder, so there was no prior packet coverage map to reuse.
- A single global grep count is insufficient to plan migration safely; categories need different rewrite rules.

## Exhausted Approaches

- Blind repo-wide find/replace was rejected because specs history and advisor corpus fields need different handling.
- Adding `runtime/` as a mode-packet was rejected as a category error.
- Making fallback routing a blocker for 002/003 was rejected because it is fan-out behavior work, not structural identity repair.

## Ruled-Out Directions

- Rename `/deep:*` commands and deep agents: out of scope and unnecessary for the identity split.
- Defer `system-spec-kit` tooling-borrow repair to child 003: would risk silent council-test coverage loss.
- Rely on `mk-deep-loop-guard` to catch a missed registry path: it fails open on missing/unreadable registry.

## Active Risks

- The OpenCode guard plugin's `REGISTRY_RELATIVE_PATH` must be updated and explicitly tested because missing registry read returns `null` and skips mismatch checks. [SOURCE: file:.opencode/plugins/mk-deep-loop-guard.js:75]
- The advisor merged identity exists in both Python and TypeScript constants and should gain or keep a drift-guard after migration. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2579]
- Temporary compatibility symlinks may mask missed references during the rewrite window; residual grep must run after symlink removal.

## Next Focus

Synthesis complete. Recommended downstream action: revise child 003 to add an explicit `mk-deep-loop-guard` fail-open verification item if not already present, then proceed with 002 only after the full fanout synthesis is merged.

## Non-Goals

- No code changes, renames, symlink creation, or migration edits in this lineage.
- No writes outside this lineage artifact directory.

## Stop Conditions

- Stop once the minimum 3-iteration floor is satisfied, all five key questions have source-backed answers, and a final pass finds low novelty with source-diverse evidence.
