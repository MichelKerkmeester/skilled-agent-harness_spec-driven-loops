# Iteration 9: Traceability - command and agent alignment after phase 006

## Dimension

Traceability (`spec_code` and `agent_cross_runtime`). The speckit command surfaces and doc-authoring agents checked against the parent's phase 006 handoff criterion: name the card, the v2.3 token and the guard scripts wherever the surface describes authoring.

## Files Reviewed

- `.skilled/commands/speckit/plan.md:100-112`
- `.skilled/commands/speckit/implement.md:85-100`
- `.skilled/commands/speckit/complete.md:95-108`
- `.skilled/commands/speckit/assets/speckit-plan.yaml:300-320,480-495`
- `.skilled/commands/speckit/assets/speckit-implement.yaml:210-300`
- `.skilled/commands/speckit/assets/speckit-complete.yaml:340-355,460-475,645-660`
- `.skilled/agents/{markdown,code,context,orchestrate}.md` (authoring sections)
- `specs/system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment/{implementation-summary.md,plan.md}`
- `specs/system-speckit/054-weak-model-spec-authoring/spec.md:84,104,155`
- `specs/system-speckit/054-weak-model-spec-authoring/goal.md:159`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **`speckit-implement.yaml` describes spec-doc authoring but names neither the card nor the v2.3 token rule** -- `.skilled/commands/speckit/assets/speckit-implement.yaml:288` -- The workflow says "When this workflow writes tasks.md or implementation-summary.md, embed the matching inline scaffold below in the authoring prompt", so it is an authoring surface. It names the guard scripts at line 286 and carries no `placeholder-upgrade` key, no `spec-authoring-card.md` reference and no Draft/error rule, while `speckit-plan.yaml:489` and `speckit-complete.yaml:653` both carry the v2.3 rule and `speckit-complete.yaml:469-472` names the card. The parent's phase 006 handoff criterion (parent `spec.md:155`) requires every speckit command to name all three where it describes authoring, and phase 006 is marked Complete with "no open row".
   Finding class: incomplete-alignment
   Scope proof: the three YAML assets were compared key by key; `rg` for `v2.3`, `placeholder`, `spec-authoring-card` returns 0 in implement.yaml and 1 or more in plan and complete.
   Affected surface hints: implement workflow asset, implement command entry point, phase 006 handoff criterion
   Case: a model runs `/speckit:implement`, writes `implementation-summary.md` from the inline scaffold, leaves a value token, and the command's own authoring prompt never told it that a v2.3 token errors outside Draft.

```json
{
  "type": "claim-adjudication",
  "findingId": "R9-P1-001",
  "claim": "The implement workflow asset describes spec-doc authoring but omits the card and the v2.3 token rule that the phase 006 handoff criterion requires on every authoring surface.",
  "evidenceRefs": [
    ".skilled/commands/speckit/assets/speckit-implement.yaml:286-288",
    ".skilled/commands/speckit/assets/speckit-plan.yaml:489",
    ".skilled/commands/speckit/assets/speckit-complete.yaml:469-472,653",
    "specs/system-speckit/054-weak-model-spec-authoring/spec.md:155"
  ],
  "counterevidenceSought": "Checked the implement command entry point for the card or token rule (none), checked whether the inline scaffold itself carries the rule (it does not), and checked whether another shared asset is loaded by implement (none found).",
  "alternativeExplanation": "The criterion's 'where it describes authoring' may be read to cover only commands whose primary job is authoring, and implement's primary job is execution. Rejected because implement explicitly writes tasks.md and implementation-summary.md and carries an inline authoring scaffold, which is the exact surface the criterion names.",
  "finalSeverity": "P1",
  "confidence": 0.80,
  "downgradeTrigger": "Downgrade to P2 if implement.md or its asset gains a card/token pointer, or if the handoff criterion is amended to exclude implement.",
  "transitions": [{ "iteration": 9, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

### P2 Findings

1. **Phase 006's summary says four agents were changed for the card and example; only one names the card** -- `specs/system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment/implementation-summary.md:68` -- The row lists `.skilled/agents/markdown.md`, `orchestrate.md`, `code.md` and `context.md` with the purpose "Card and filled example, retired checklist doc dropped". `markdown.md` names the card and the filled example; `code.md`, `context.md` and `orchestrate.md` contain neither `spec-authoring-card` nor a filled-example pointer. The combined row reads as four card changes where the actual change was one card row plus three checklist removals.
   Finding class: record-overstatement
   Scope proof: all four agent files were grepped for the card, the example path and `checklist.md`; only markdown.md matches the card and example.
   Affected surface hints: phase 006 implementation summary, four agent files
   Case: an operator auditing phase 006 for the card in every doc-authoring agent finds it in one file and cannot tell from the summary that the other three were checklist-only edits.

2. **The parent spec still lists doctor speckit entries as modified by phase 006** -- `specs/system-speckit/054-weak-model-spec-authoring/spec.md:104` -- The Files to Change table names `.skilled/commands/doctor/` speckit entries as Modify for phase 006. The operator's read-only re-audit found 91 doctor files and 0 authoring findings, so phase 006 added no doctor row (`goal.md:159`), and the phase 006 summary records the same. The table row describes a change that did not happen, while the parent spec is the packet's only authored parent document.
   Finding class: stale-scope-table
   Scope proof: the table row, the operator decision row and the phase 006 summary were read directly.
   Affected surface hints: parent spec Files to Change, parent goal log, phase 006 audit
   Case: a reader concludes the doctor commands carry new authoring text and reviews them for changes that are not there.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | fail | hard | `speckit-implement.yaml:286-288`; `speckit-plan.yaml:489`; `speckit-complete.yaml:653`; `spec.md:155` | The implement surface is missing two of the three named elements. |
| `checklist_evidence` | partial | hard | 84 AC rows | One stale closure note from iteration 6. |
| `skill_agent` | partial | advisory | `spec-authoring-card.md:18` | Same dangling guide pointer. |
| `agent_cross_runtime` | partial | advisory | `006.../implementation-summary.md:68`; four agent files | The summary overstates the agent change; the canonical and mirror bodies match. |
| `feature_catalog_code` | fail | advisory | `spec-authoring-card.md:30`; `versioned-placeholder-gate.md:36` | Two leaves misstate their code. |
| `playbook_capability` | fail | advisory | scenarios 479 and 482 | Tool lists and guard behavior wording. |

## Edge Cases

- The plan and complete command entry points name the guard scripts but not the card; their workflow assets name the card (complete) or the token rule (plan), so the pair covers the criterion.
- `code.md` explicitly refuses spec-doc authorship and redirects to `@markdown`, so its silence on the card is correct rather than a gap.
- `orchestrate.md` routes spec-doc authoring to `@markdown` and carries an authoring-validation block that does not name the card; as a router it is not a doc-authoring agent, so it is not reported as a missing card.
- The `.claude` agent siblings match the `.skilled` bodies, so no cross-runtime drift is introduced by the phase 006 edits.

## Confirmed-Clean Surfaces

- `speckit-plan.yaml` and `speckit-complete.yaml` both carry the v2.3 Draft/error rule, and complete names the card in its authoring-load block.
- All three command entry points name both guard scripts after strict validation.
- `markdown.md` names the card and the filled-example route, and the `.claude` mirror carries the same body.
- The doctor audit is recorded with its result (91 files, 0 authoring findings) rather than silently skipped.

## Ruled Out

- A missing guard-script reference in any speckit command: ruled out; all three carry the pair.
- A cross-runtime agent mismatch: ruled out; the mirrors match the canonical bodies.
- A doctor authoring gap: ruled out; the re-audit found none.

## Next Focus

Iteration 10 - synthesis pass - the packet's closing claims: the parent goal's seven completion criteria, the two benchmark reports and the changelog/version carriers, plus a final adversarial re-read of every P0/P1 before the report is compiled.

Review verdict: CONDITIONAL
