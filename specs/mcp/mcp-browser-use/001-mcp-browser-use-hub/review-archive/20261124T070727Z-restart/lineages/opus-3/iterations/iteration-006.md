# Iteration 006 — Traceability (checklist_evidence re-adjudication)

## Dispatcher

- Lineage: opus-3 (fan-out), session `fanout-opus-3-1795495435655-lf6jf3`, generation 1
- Dimension: traceability
- Operator focus (every phase's shipped work against its goal criteria): this pass tabulated, for all 13 phases, the open task boxes, open goal boxes and the spec status, then followed the one phase whose status disagrees with its goal (005) to the requirements it records as not met. It replayed 005's out-of-domain evidence against the live advisor.
- Sources: no `steer.md` present.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/0*/spec.md` (Status rows), `0*/tasks.md`, `0*/goal.md` (open-box counts)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/spec.md:23,149-150,172`, `tasks.md:67-68,79-80`, `implementation-summary.md:47`, `scratch/after-out-of-domain.jsonl`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/tasks.md:74`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` (metadata Status, phase map row 5)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **005's REQ-009 note understates the out-of-domain leak: half the probe phrases still return the browser hub above the 0.8 gate, two of them near 0.9** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/tasks.md:67` -- T020's not-met note says only that "set that aside…" and "lighthouse keeper…" still return `mcp-browser-use` "at 0.82, the band unrelated skills share". The phase's own evidence file records two more hits well above that band: "summarise the performance trace review notes in the spec" at 0.8878 and "export a har file parser in typescript" at 0.9129 (`scratch/after-out-of-domain.jsonl:7-8`). A live replay today returns the same four of eight, each with a compiled `route` to a mode (`mcp-aside-devtools` for "set that aside and fix the failing unit test first", `mcp-chrome-devtools` for the other three). The hub is never ranked first. But the advisor's 0.8 confidence floor is the threshold the repository's skill-routing gate treats as a must-load signal, so the leak has reach the note does not describe. The parent `spec.md` metadata says "Complete" and names REQ-009 as not met. The disclosure exists but understates the leak.
   Finding class: understated-known-limitation.
   Scope proof: 8 phrases replayed through `.skilled/bin/skill-advisor.cjs advisor_recommend`. Hits are 0.82, 0.82, 0.8864 and 0.9129. The four misses return no hub entry.
   Affected surface hints: `005-routing-and-surfaces/tasks.md` T020 note, `mcp-browser-use/graph-metadata.json` aliases (`aside`, `lighthouse`, `performance trace`, `har`), parent `spec.md` status line.
   Case: the prompt "export a har file parser in typescript" returns `mcp-browser-use` at 0.9129 with a compiled route to `mcp-chrome-devtools`, a coding task that needs no browser.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| checklist_evidence | partial | 11 of 13 phases agree across tasks, goal and status. 003 has 5 open goal boxes under "Complete" (`003-mode-relocation/goal.md:58`; R1-P2-002). 004 has 5 open goal boxes plus `tasks.md:74` (manual verification deferred to 006, which ran it). 005 is "Partial" in spec and summary with T020/T021 `[B]` (`tasks.md:67-68`), while its goal boxes are all ticked (R1-P2-003). The drifts are recorded findings, not missing evidence, but the protocol cannot honestly be marked pass while goal state contradicts phase state. |

## Integration Evidence

- `.skilled/bin/skill-advisor.cjs advisor_recommend` live replay of `005-.../scratch/after-out-of-domain.jsonl`: same four hits as recorded on 2026-11-21. The leak is unchanged, not regressed.

## Edge Cases

- 004's open manual-verification box is satisfied downstream by 006's live Bladebro run. It is a cross-phase hand-off, not a gap.
- 005 REQ-008 (fixtures relabeled rather than passing unchanged) is disclosed with a reason. It is not re-raised.

## Confirmed-Clean Surfaces

- Phases 001, 002, 006-013: no open task or goal boxes, and status Complete is consistent.

## Ruled Out

- Regression of the out-of-domain leak since 005: the hit set and confidences match the recorded file.

## Next Focus

- Dimension: security (final pass, iteration 7 of 7)
- Focus area: the out-of-domain alias set from a trust angle (`aside`, `stealth browser`, `rb attach` in `mode-registry.json` aliases), checking that a non-browser prompt cannot reach the Bladebro real-browser lane. Also recheck that the hub `ROUTER.md` and `hub-router.json` keep signed-in, real-browser work behind explicit naming.
- Reason: the final iteration should close the security angle on the routing leak found here, since the real-browser lane is the highest-impact target.
- Rotation status: all dimensions covered, stabilization done.
- Required evidence: alias list plus live replay.

## Verdict

No new P0/P1. R1-P1-001 and R2-P1-001 remain active, so the verdict over active findings is CONDITIONAL.

Review verdict: CONDITIONAL
