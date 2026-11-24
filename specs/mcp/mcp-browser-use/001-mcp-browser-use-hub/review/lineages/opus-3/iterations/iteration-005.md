# Iteration 005 — Correctness (stabilization)

## Dispatcher

- Lineage: opus-3 (fan-out), session `fanout-opus-3-1795495435655-lf6jf3`, generation 1
- Dimension: correctness (stabilization pass after all four dimensions were covered)
- Operator focus (every phase's shipped work against its goal criteria): this pass reran the two active P1s against current file content. It closed 001-research's goal criteria and parent criterion 1, which no earlier pass ran. It replayed the six recorded two-stage routing requests that 005 and 006 used as goal evidence, then probed whether the routing outcome holds beyond those exact strings.
- Sources: no `steer.md` present.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/goal.md`, `001-research/research/deep-research-state.jsonl`, `001-research/research/research.md`
- `.skilled/skills/mcp-code-mode/scripts/_utils.sh`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh` (P1 replay)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:60` (P1 replay)
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv`, `README.md`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. Replay of the active P1s:
- R1-P1-001 is still active. `diff` of the two `_utils.sh` copies still prints 8 lines (the two hunks at 160 and 164).
- R2-P1-001 is still active. `mcp-bladebro/SKILL.md:60` still offers `npx -y bladebro mcp` with no gate.

### P2 Findings

1. **Tie-break routing holds only for the recorded phrasings, with margins near the advisor floor** -- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv:5` -- All six recorded requests reproduce today with the same advisor confidences. The two tie-break rows that name no tool pass at 0.8255 (MBU-T-01, Aside) and 0.8298 (MBU-T-02, Bladebro), against a 0.8 confidence threshold. For MBU-T-02 the live advisor now ranks `local-webflow` second at 0.82. Two plain paraphrases of the same intents, "fill out the form in my signed-in account" and "browse this site without getting flagged as a bot", return no recommendation at all, so neither stage runs. 005's criterion 3 and 006's benchmark criterion pass as written. The parent objective, that agents reach the modes through both stages, is proven only on strings the vocabulary was tuned against.
   Finding class: brittle-acceptance-evidence.
   Scope proof: live `advisor_recommend` replays of the three tie-break rows and of two paraphrases. A no-tool Chrome request, "check the console errors on this page", does route (0.8875 → `mcp-chrome-devtools`), so the gap is specific to the Aside and Bladebro tie-breaks.
   Affected surface hints: `.skilled/skills/mcp-browser-use/graph-metadata.json` vocabulary, `hub-router.json` tie-break rules, the 006 benchmark corpus.
   Case: a user asks "fill out the form in my signed-in account" without naming Aside. The advisor returns no skill, and the request never reaches the hub that the research assigned signed-in deterministic work to.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | pass | 001-research: 12 iteration records (≥10), `research.md` present, goal criteria ticked and consistent. The six recorded routing requests reproduce stage one and stage two (`route`, `single`, gold mode) on the current tree. |

## Integration Evidence

- `.skilled/bin/skill-advisor.cjs advisor_recommend` with its `compiledRoute` block: MBU-T-01 → `mcp-aside-devtools`, MBU-T-02 → `mcp-bladebro`, MBU-T-03 → `mcp-chrome-devtools`.

## Edge Cases

- Parent goal criterion 7 (`validate.sh --strict --recursive` PASSED) was not rerun because the lineage contract forbids it. It stays unverified in this lineage.
- The paraphrase probe is judgment: two strings do not measure a recall rate. The finding stays P2 because the goal criteria name fixed requests and are met as written.

## Confirmed-Clean Surfaces

- 001-research goal criteria and parent criterion 1.
- Recorded two-stage replay, 6 of 6.

## Ruled Out

- Advisor drift since 006 on the recorded corpus: confidences are identical to the recorded values (0.8255, 0.8299/0.8298, 0.9161).

## Next Focus

- Dimension: traceability (checklist_evidence re-adjudication)
- Focus area: decide whether `checklist_evidence` can move from partial. Check the parent `goal.md` progress log and each child's implementation-summary verification rows against the goal boxes, including the 006 alignment criterion "no unresolved blocker" and 007's changelog coverage claim.
- Reason: `checklist_evidence` is the only hard protocol still partial.
- Rotation status: all dimensions covered, stabilization 1 done.
- Required evidence: file:line per checklist row.

## Verdict

No new P0/P1. R1-P1-001 and R2-P1-001 are reconfirmed active, so the verdict over active findings is CONDITIONAL.

Review verdict: CONDITIONAL
