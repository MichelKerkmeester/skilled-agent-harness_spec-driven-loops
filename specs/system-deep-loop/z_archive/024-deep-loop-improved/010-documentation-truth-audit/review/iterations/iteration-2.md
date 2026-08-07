# Deep Review Iteration 2

## Dimension

Correctness: fact-check iteration 1's README findings, verify repo-wide old Spec Kit anchor safety, verify `mk-goal` facts before README promotion, and check packet-local historic-reference docs for contradictions.

## Files Reviewed

- `README.md:33` confirms the TOC still says `[SPEC KIT DOCUMENTATION](#spec-kit-documentation)`.
- `README.md:208` confirms the FEATURES heading still says `### 📋 Spec Kit Documentation`.
- `README.md:1230-1233` confirms Goal is currently a Utility entry only.
- `.opencode/plugins/mk-goal.js:778-800` confirms atomic temp-file write, rename, directory fsync, and temp cleanup on failure.
- `.opencode/plugins/mk-goal.js:912-930` confirms per-session mutation queueing around state writes.
- `.opencode/plugins/mk-goal.js:1289-1295` confirms active-goal continuation prompt framing.
- `.opencode/plugins/mk-goal.js:1434-1437` confirms autonomous continuation is gated by `MK_GOAL_AUTONOMY` and default-suppressed outside `active` or `smoke`.
- `.opencode/plugins/mk-goal.js:1538-1593` confirms active-goal injection uses `[active_goal:<goalId>]` and appends to system context.
- `.opencode/plugins/mk-goal.js:1728-1875` confirms the plugin exports the transform hook, event hook, and `mk_goal` / `mk_goal_status` tools.
- `.opencode/commands/goal_opencode.md:34-43` confirms `/goal` routes set/show/clear/complete/pause through plugin tools and is state-free.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:80` confirms the plugin purpose is set, persist, inject every turn until met, and support show/clear/complete.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:89-92` confirms transform injection, lifecycle tracking, and command verbs are in scope.
- `.opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:172-186` confirms state, injection, command, lifecycle, supervisor, continuation, prompt enhancement, integration, and cleanup phases are complete.
- `.opencode/plugins/README.md:49` confirms the plugin catalog already claims per-session atomic fail-closed state, transform injection, tools, event usage accounting, and default-off guarded continuation.
- `.opencode/specs/deep-loops/030-agent-loops-improved/changelog/README.md:14` and `:32` were checked for phase-summary consistency.
- `.opencode/specs/deep-loops/030-agent-loops-improved/before-vs-after.md:167-185` was checked for contradictions with the planned README and goal-plugin fixes.
- `.opencode/specs/deep-loops/030-agent-loops-improved/timeline.md:29-31` and `:130-156` were checked for contradictions with the planned README and goal-plugin fixes.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/tasks.md:72` explains the old label only as the source phrase for the required rename.
- `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/graph-metadata.json:164` still indexes `Spec Kit Documentation` as a derived entity.
- Whole-repo exact search: `rg -n --fixed-strings -e '#spec-kit-documentation' -e 'Spec Kit Documentation'` produced 28 hits; live actionable hits were README and this phase's active graph metadata, while the rest were archived historical specs or this review lineage's prompts/evidence.

## Findings by Severity

### P0

None.

### P1

#### P1-003 Active graph metadata still indexes the retired Spec Kit Documentation label

- Claim: The root README rename would still leave this active phase's graph metadata advertising the retired `Spec Kit Documentation` entity, so post-fix memory/graph consumers can continue surfacing the old label even after README is corrected.
- Evidence: `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/graph-metadata.json:164` contains `"name": "Spec Kit Documentation"`; `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/tasks.md:72` is the source task phrase that likely produced the derived entity; the exact whole-repo search also found README's old TOC and heading at `README.md:33` and `README.md:208`.
- Counterevidence sought: I checked the exact search output for non-active hits. Archived `z_archive` specs and this review lineage's prompts/evidence intentionally quote the old label and are not live README cross-links. The active `graph-metadata.json` hit is not archived and is a machine-consumed packet metadata surface.
- Alternative explanation: The metadata entity may be an automatic derivation from a task that intentionally describes a rename from old to new, not a hand-authored stale public-doc claim. That reduces blast radius, but it does not remove the stale machine-consumed entity.
- Final severity: P1.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to P2 if the completion path regenerates graph metadata after the task wording changes or if the packet explicitly decides derived metadata may preserve source rename phrases after public docs are corrected.
- Finding class: cross-consumer.
- Scope proof: Whole-repo exact search found the active `graph-metadata.json:164` hit in addition to README; archived historical hits were excluded from the finding because they are not live cross-references.

### P2

None.

## Traceability Checks

- `spec_code`: PASS. `.opencode/specs/deep-loops/030-agent-loops-improved/010-documentation-truth-audit/spec.md:78` and `:113` require the README rename and no dangling old anchor references.
- `checklist_evidence`: PASS. The active task/checklist path still points at the same required reconciliation work, with `tasks.md:72` naming the README rename.
- `feature_catalog_code`: PASS with no new discrepancy. `mk-goal` implementation and plugin catalog support the claims a README Goal Plugin FEATURES subsection would need: session-durable `/goal`, active-goal system injection, atomic fail-closed state, lifecycle accounting, verifier status, and gated default-off continuation.
- `repo_anchor_safety`: CONDITIONAL. Exact search found no extra live `#spec-kit-documentation` anchor link outside README and review evidence, but it found active derived graph metadata still carrying `Spec Kit Documentation`.
- `historic_reference_consistency`: PASS. `changelog/README.md`, `before-vs-after.md`, and `timeline.md` describe packet 030's phases at the loop-system level and do not currently claim anything about README.md or the goal plugin that would be contradicted by phase 010's planned fixes.

## Verdict

CONDITIONAL. The two iteration-1 P1 findings are independently re-confirmed. Goal-plugin implementation facts support the planned README promotion. One new P1 was found in active graph metadata.

## Next Dimension

Security: broaden into whether README/metadata wording around goal autonomy, state, and command execution could overclaim safety or omit important default-off guardrails.
Review verdict: CONDITIONAL
