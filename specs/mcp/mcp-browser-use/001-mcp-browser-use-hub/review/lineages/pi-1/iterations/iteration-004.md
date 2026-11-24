# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `pi-1`, generation 1)
- Dimension: traceability
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This is the iteration that answers the focus directly: it extracted the completion criteria of all fifteen phase goals and tested the ones a static read can settle, then compared each phase's declared status against its own continuity block.

## Files Reviewed

- `goal.md`, `spec.md` of `001-research` through `015-fix-follow-up-review-findings` (completion-criteria and metadata sections)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` (root metadata)
- `.skilled/skills/mcp-browser-use/mode-registry.json`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/` (installer, `SKILL.md`, `mcp-servers/bladebro-mcp/README.md`, playbook tree)
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/feature-catalog.md:243`, `feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md`, `references/cdp-patterns.md`, `manual-testing-playbook/dom-and-screenshot/eval-javascript.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The open P1 from iteration 3 (`pi1-I3-P1-001`) is a spec contradiction and is carried there; this iteration's traceability checks record it rather than re-raising it.

### P2 Findings

1. **Four phase continuity blocks report a completion percentage their own spec contradicts** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/goal.md:6` -- `_memory.continuity.completion_pct` reads `0` for `001-research` and `002-hub-scaffold`, `90` for `006-verification` and `50` for `012-browser-hub-doc-topic`, while each of those folders' `spec.md` metadata says `Status: Complete`. The `recent_action` strings agree with the spec, not the percentage ("Authored the durable directive"), so the same continuity block carries both a finished state and an unfinished score. The generation-3 review recorded this class as open packet-state drift; phases 014 and 015 closed their own packets without closing it.
Case: `rg -m1 'completion_pct' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/002-hub-scaffold/goal.md` prints `0` for a folder whose `mode-registry.json` ships the exact three modes its criteria name and whose `spec.md` says Complete, so a continuity reader sees a phase that never started beside artifacts that shipped.
Finding class: `state-drift`
Scope proof: both sides read for each of the four phases (`goal.md` continuity block and `spec.md` metadata table); the shipped artifacts for 002 were parsed independently (`mode-registry.json`, three modes).
Affected surface hints: `001-research/goal.md`, `002-hub-scaffold/goal.md`, `006-verification/goal.md`, `012-browser-hub-doc-topic/goal.md`, and any `/speckit:resume` read that trusts `completion_pct`.

2. **The root spec says every phase is Complete while phase 005 declares itself Partial** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:6` -- The root `Status` cell opens "Complete: phases 001 to 015 are Complete" and then, in the same cell, states "005 still records REQ-003 and REQ-008 as not met as written". `005-routing-and-surfaces/spec.md` carries `Status: Partial` with the same two requirements. One of the two statements is wrong, and a reader who stops at the first clause gets the wrong answer.
Case: a release reader greps the root `Status` and reads "phases 001 to 015 are Complete"; the child packet for 005 says `Partial` and names two unmet requirements, so the root's first clause is false as written.
Finding class: `state-drift`
Scope proof: both status cells read; the child's requirement caveats are quoted in both places, so this is a contradiction rather than a missing qualification.
Affected surface hints: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md`, `005-routing-and-surfaces/spec.md`, `005-routing-and-surfaces/goal.md` (`completion_pct: 95`).

## Traceability Checks

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Two of the four phases checked at source hold, two do not. Phase 002's criteria hold: `mode-registry.json` parses to exactly three modes, each `packetKind: workflow` and `backendKind: cli-plus-mcp`, with no transport field. Phase 003's stale-pointer criterion holds: `rg 'mcp-tooling/mcp-(chrome-devtools|aside-devtools|bladebro)'` over `.skilled` excluding changelogs and benchmark reports returns no line. Phase 005's catalog criterion holds: `feature-catalog/mcp-parallel-instances/lighthouse-and-performance-trace.md` exists and `feature-catalog.md:243` totals **31**. Phase 011's `returnByValue` strand holds: `references/troubleshooting.md` and `references/cdp-patterns.md` both carry `"returnByValue":true`. The `spec_code` status stays `partial` only because iteration 3's D2 contradiction (`pi1-I3-P1-001`) remains open. |
| `checklist_evidence` | core | partial | Phase 014's `npx -y bladebro` criterion holds: every surviving line names an operator yes and pins `bladebro@4.8.2` (`bladebro/SKILL.md:61`, `mcp-servers/bladebro-mcp/README.md:35`, `feature-catalog/transport/mcp-code-mode-lane.md:26`). Phase 014's `browser-debugger-cli@alpha` criterion holds: no match outside changelog and benchmark reports. Phase 007's Bladebro playbook criterion was checked by tree shape only (15 scenario files across five groups), not by the `GUARD PASS` output the criterion names, and the remaining criteria in 001, 004, 005, 006, 008, 009, 010, 011, 012, 013 and 015 are command-output claims that this lineage does not execute. |
| `playbook_capability` | overlay | partial | Phase 007's "30 of 30 scenarios recorded" and phase 008's `results.csv` row counts are files the run would have to count and read; the playbook tree for Bladebro holds 15 scenario files, so neither number could be confirmed as stated without the validator the criterion names. |
| `skill_agent` | overlay | fail | Carried from iteration 3: `mcp-aside-devtools/SKILL.md:75` still prescribes the unpinned pipeline that phase 015's D2 forbids. No new agent-surface drift was found this iteration. |

## Integration Evidence

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/spec.md` names `REQ-003` as met "at the default threshold but not at `--threshold 0.5`" and `REQ-008` as "held only after the browser fixtures were relabeled"; the root spec repeats both qualifiers, so the two documents are consistent about the caveats and inconsistent only about the label.
- Phase 002's registry was parsed rather than grepped: `mode-registry.json` yields three entries carrying `packetKind` and `backendKind` and no `transport`-axis key, which is exactly what `002-hub-scaffold/goal.md:32` requires.
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/feature-catalog.md:243` carries `| **TOTAL** | **31** |`, and the leaf `mcp-parallel-instances/lighthouse-and-performance-trace.md` is present, so phase 005's structural claim is intact.

## Edge Cases

- **A `rg -r` flag reports a false positive for a renamed parameter.** An early pass of this iteration read `"n": true` where the CDP parameter should have been `returnByValue` and nearly recorded a P1 that the shipped recipes were broken. `-r n` is ripgrep's *replacement* flag, so the match was being rewritten in the output, not in the file. A direct `sed` read of the same line shows `"returnByValue":true`. The candidate was withdrawn; the method note is kept because this class of mistake is silent in the tool output.
- **Command-output criteria are not settable from a read.** Eleven of the fifteen phases state their completion as a command's printed line. Marking those `pass` from prose would be a fabricated verification, so they are `partial` with the reason named rather than assumed clean.
- **`completion_pct` may be derived rather than authored.** If a generator writes it from the goal log's progress table, the defect is in the generator's input for those four phases and not in the text; either way the shipped value contradicts the spec, which is the thing an operator reads.

## Confirmed-Clean Surfaces

- Phase 002's mode registry: exactly three modes, both required axes correct, no transport extension.
- Phase 003's relocation: no stale `mcp-tooling/mcp-*` path remains outside changelogs and benchmark reports.
- Phase 005's catalog: the named lighthouse leaf exists and the summary total is 31.
- Phase 011's port note: the `returnByValue` guidance is present in both the troubleshooting reference and the CDP patterns file.
- Phase 014's install guidance: no bare `npx -y bladebro` instruction survives without an operator yes and a pinned version, and no `browser-debugger-cli@alpha` reference remains in the shipped packet.

## Ruled Out

- **The shipped CDP recipes pass a truncated parameter name** -- ruled out after a direct read; the apparent `"n"` was a `rg -r` replacement artifact in this reviewer's own output, and the files carry `"returnByValue":true`.
- **Phase 015's criteria are unverifiable end to end** -- ruled out for the first two: criterion 1 and the hub strand of criterion 2 were reproduced in iteration 2 through `resolveRoute`.
- **A phase is missing its goal or spec** -- ruled out: all fifteen child folders carry both, plus `tasks.md`, `plan.md` and `implementation-summary.md` in the levels that require them.

## Next Focus

- Dimension: maintainability
- Focus area: the hub's cross-mode documentation consistency (`README.md`, `ROUTER.md`, `leaf-scopes.json`, `mode-registry.json` descriptions, the benchmark and playbook indexes) against what the packets actually ship
- Reason: the archived run left doc-drift advisories open and phase 015 claims to have corrected them; the previous passes only touched the pack
- Rotation status: traceability closed for what a read can settle; maintainability begins
- Blocked/productive carry-forward: productive, index-against-artifact comparison
- Required evidence: each index row checked against a real folder or file on disk

Review verdict: CONDITIONAL
