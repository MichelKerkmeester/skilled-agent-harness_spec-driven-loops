# Review Iteration 004

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-max-2-1795511183570-92w0ez`, generation 1, lineageMode `new`
- Iteration 4 of 5. Dimension: maintainability. Operator review focus: traceability (`spec_code` + `checklist_evidence`).
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder). Scope: the 46 paths in `review-scope-files.txt`.

## Dimension

Maintainability: the closure documentation as a surface a later change has to work against. Three questions: does every pointer a reader follows still identify what it claims, does the packet's own bookkeeping (checklists, ADRs, waiver map) agree with the tree, and does the packet's continuity metadata describe the packet's real state.

The operator focus was addressed by completing the citation sweep started in iteration 3: all 90 `path:line` citations in the packet's six docs were resolved and inspected, and the one that resolves to a blank line is reported. `checklist_evidence` moves with this: the checklist counts and the waiver map are now verified against the boxes they describe.

## Files Reviewed

- All six packet docs (`spec.md`, `acceptance-criteria.md`, `tasks.md`, `plan.md`, `implementation-summary.md`, `decision-record.md`) through a mechanical citation sweep: 90 distinct `path:line` citations, resolved against the repository, the advisor runtime and the deep-loop runtime.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:244-256` (the `typedCommandIn` boundary)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1-3` (the shared-fixture header)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33-603` (ADR-001 to ADR-006 headings and sections, waiver map)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (holdout and near-miss ids)
- Checklist box count: every `CHK-*` row parsed by priority and tick state.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-032 and T069 cite a blank line for `typedCommandIn`** -- `acceptance-criteria.md:89` -- AC-032's observed cell ends `typedCommandIn` still answers its longest key (`.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:250`), and T069 repeats the same citation. Line 250 is blank; the function is declared at `command-attach.ts:251`. The claim itself is true (`typedCommandIn` still returns the longest key, and `typedCommandsIn` at `:274` is the ordered list the gate reads), so the defect is the anchor, not the behaviour. It is the only one of the 90 citations across the packet's six docs that resolves to a blank line.
Finding class: instance-only
Scope proof: `acceptance-criteria.md` and `command-attach.ts` are both in `reviewScopeFiles`; lines 249-252 were printed, and the sweep covered all 90 citations.
Affected surface hints: `acceptance-criteria.md` AC-032, `tasks.md` T069
Case: a reader follows AC-032's anchor to confirm `typedCommandIn`'s longest-key behaviour and finds an empty line between `TYPED_COMMAND_KEYS` and the function.

2. **Both closure docs carry continuity metadata that predates the sixth round** -- `implementation-summary.md:13` -- the frontmatter `_memory.continuity` block says `recent_action: "Deep review finished with verdict FAIL, remediation round requested"` and `next_safe_action: "Commit the review, then plan and build the sixth fix round"`, with `completion_pct: 90` and `last_updated_at: "2026-11-24T05:06:29Z"`. The sixth round is built, its closure docs are written, and the packet's status is "In Progress: the traceability review rerun is open" (`spec.md:23`). `acceptance-criteria.md:11-21` still carries the scaffold block: `last_updated_by: "scaffold"`, `last_updated_at: "2026-11-22T11:08:37Z"`, `completion_pct: 0`. A resume that reads either block starts from the state before the round it is standing on.
Finding class: class-of-bug (continuity metadata not refreshed when the closure docs were rewritten, so every later round inherits a stale pointer)
Scope proof: both files are in `reviewScopeFiles`; the frontmatter blocks were printed and compared with `spec.md:23` and `tasks.md:166` (T084 open).
Affected surface hints: `implementation-summary.md` `_memory.continuity`, `acceptance-criteria.md` `_memory.continuity`, `spec.md` metadata status
Case: the next session runs `/speckit:resume`, reads `next_safe_action` from the implementation summary, and re-plans a sixth round that already exists in the tree.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | 38-prompt matrix, probe pair, assets (iterations 1-3) | unchanged this iteration; REQ-011's clause remains the one mismatch |
| `checklist_evidence` | partial | `tasks.md:36-166`, `acceptance-criteria.md:58-97`, `decision-record.md:33-603`, fixture header | checklist counts agree with the Verification Summary; waiver map resolves; one blank-line anchor and one stale metadata block reported |

Maintainability results:

- **The checklist bookkeeping agrees with the tree.** By priority: 12 P0 rows with 11 ticked (CHK-020 open, which is the acceptance-criteria row AC-040 blocks), 13 P1 rows all ticked, 1 P2 row ticked; 85 tasks with 84 ticked and T084 open. That is exactly the `Verification Summary` at `tasks.md:291-293` (11/12, 13/13, 1/1), so AC-041's count claim holds.
- **The waiver map resolves.** Three rows carry a decision: AC-008 `Waived` with ADR-003, AC-017 `Waived` with ADR-002, AC-019 `Superseded` with ADR-001. All three ADRs exist, and ADR-001 to ADR-006 each carry Metadata, Context, Constraints, Decision, Alternatives, Consequences and an Implementation bullet.
- **The parity surface is documented where it is read.** `deep-loop-offer-cases.json:2` states that the fixture is read by both the TypeScript offer-gate test and the Python advisor test and that `asksForLoopRun` is the full gate after its four exceptions, which is the layer claim AC-041 verifies.
- **Every citation except one resolves.** 90 distinct citations; 75 full-path citations resolve directly, 14 short-form citations resolve to the intended module, and one — AC-032's `:250` — lands on a blank line. No citation points past a file's end.
- **The known command-reference failure is disclosed, not hidden.** `implementation-summary.md` records `speckit-resume.yaml:104` as a pre-existing failure; that line exists and names the telemetry path the row describes, so the disclosure is accurate.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:251`: the `typedCommandIn` declaration the AC-032 anchor should name.
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2`: the shared-fixture header AC-041 cites.
- `implementation-summary.md:13-14`: the stale `recent_action` and `next_safe_action` lines.
- `acceptance-criteria.md:11-21`: the scaffold continuity block.
- `decision-record.md:33`, `:128`, `:223`, `:317`, `:412`, `:508`: the six ADR headings.
- `tasks.md:291-293`: the Verification Summary the parsed box counts match.

## Edge Cases

- The citation sweep is only as good as its base directories. A short form such as `command-attach.ts:580` is relative to the advisor runtime, while `implementation-summary.md:155` is relative to the packet; resolving both against one base produces false "missing file" readings. Both bases were applied, and the one remaining blank-line target was confirmed by a direct read.
- `acceptance-criteria.md`'s scaffold continuity block predates the packet's own evidence table; it is stale but harmless to a validator, which is why it survived six rounds. Reported as part of P2-2 rather than as a validation failure.
- The `dist/` absence noted in iteration 2 also means the packet's build outputs cannot be maintained from this worktree; that is environmental, and the packet discloses it as a dependency.

## Confirmed-Clean Surfaces

- The checklist and Verification Summary counts.
- The ADR set and the waiver map.
- The shared-fixture header's statement of which layer each typed column pins.
- Citation resolution for 89 of 90 anchors.
- `plan.md:90`'s implementation-phases section, which CHK-002's check names.

## Ruled Out

- A further batch of shifted `implementation-summary.md` pointers beyond the eleven reported in iteration 3: ruled out by the full sweep; every other citation resolves to a line with content.
- An acceptance row waived without a backing ADR: ruled out; the three waiver rows name ADR-001, ADR-002 and ADR-003, all present.
- A Verification Summary miscount: ruled out by parsing every `CHK-*` row.
- A missing fixture-layer statement: ruled out by reading the header.

## Next Focus

- Dimension: traceability (second pass, the last iteration under the cap)
- Focus area: close out both core protocols, re-read the five active P2 findings' anchors, and state the evidence this rerun supplies for AC-040 and T084 without editing the packet's docs.
- Reason: the run reaches `maxIterations` after this iteration; the last pass must leave both protocols at their final status and the findings verified against the current tree.
- Rotation status: fourth rotation; all four canonical dimensions now covered.
- Blocked/productive carry-forward: productive category "resolve the citation, then confirm the symbol" is exhausted; no new direction is opened.
- Required evidence: the five findings' anchor lines, the two protocol statuses, and the terminal gate inputs.

## Verdict

No active P0 or P1; six P2 advisories are active after this iteration. Maintainability is at CONDITIONAL only because those advisories remain.

Review verdict: PASS
