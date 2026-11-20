# Review Iteration 006

## Dispatcher

- Mode: review (fan-out lineage `vibe-2`)
- Session: `fanout-vibe-2-1795172940208-84a42n`, generation 1, lineageMode `new`
- Focus: Frontier node F-1-005, dimension `traceability`
- Review target type: `files`
- Operator review focus: the commit set `31ffd18beab`, `1ccbb3283c6`, `dc3979eb451`, `86038dfba80`, `c74042fd559`, `571575632a4`, `5c91b2f3f5d`, `0390556ee2b`, and the ten `docs(specs)` commits `2f5fe41bb9e`..`aaaff7dd9df`.

### How this iteration addressed the operator review focus

The focus asks whether the docs state the shipped weight and behavior, and names the ablation result of 156 against 161 that set the lane weight to 0. This iteration read every ablation statement in the changelog, the feature catalog, the playbook and the install guide, and compared each against the packet's ablation table. Three of the four surfaces agree. The changelog's first ablation sentence records a score pair that appears nowhere in the table and contradicts the sentence eleven lines below it.

## Files Reviewed

- `.skilled/changelog/skilled/v4.1.0.0.md:222,225,231`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/ablation.md:22,24`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md:59-60`
- `.skilled/skills/system-skill-advisor/references/scoring/lane-weight-tuning.md:51,160`
- `.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:118`
- `INSTALL-SKILLED.md:88`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:112-113,121`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 from iteration 1 remains active and keeps this run at CONDITIONAL.

### P2 Findings

1. **The changelog records two different ablation score pairs for the same lane, and the first appears nowhere in the packet's ablation table** -- `.skilled/changelog/skilled/v4.1.0.0.md:222` -- the "Ollama Off the Advisor Prompt Path" section says "The ablation scored 149 of 193 with the lane and 150 without." Eleven lines later the "Advisor Refreshes Vectors in the Background" section says "The real-embedding ablation used the 196-row corpus ... it scored 156 correct against 161 without it" (`:231`). The packet's ablation table records 158 against 161 for skills-only seeding and 156 against 161 for production seeding (`implementation-summary.md:112-113`); no run scored 149 or 150. The first sentence is a pre-fix measurement left in place with no supersession marker, and it understates the lane's cost as one correct answer where the shipped measurement is five.
   Finding class: `traceability`
   Scope proof: the claim is in the declared target `.skilled/changelog/skilled/v4.1.0.0.md`; the contradicting evidence is the packet's ablation table, cited as traceability context.
   Affected surface hints: `v4.1.0.0.md` Ollama section, operator reading the cost of enabling the lane, `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` guidance.
   Case: an operator reads the Ollama section to decide whether to enable the semantic lane. It tells them the lane scored 149 against 150 without it, so enabling it costs one correct answer. They enable it. The shipped measurement in the same changelog says the lane costs five, and the packet's table confirms five. The operator made the decision on a number the release no longer supports.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/changelog/skilled/v4.1.0.0.md:222`, `implementation-summary.md:112-113` | Three of four ablation surfaces match the table; the changelog's first sentence records a superseded pair. Recorded as R6-P2-001. |
| `checklist_evidence` | pass | `acceptance-criteria.md:56-66` | No `Unmet` row; AC-005 and AC-010 both read `Met`. |
| `agent_cross_runtime` | notApplicable | `.skilled/agents/` (no advisor status reference) | No agent definition integrates the advisor surface. |

## Integration Evidence

- `feature-catalog/scorer-fusion/ablation.md:24` matches the table exactly: 196-row corpus, two identical runs, 156 with the lane against 161 without, 7 flips, no new gold-`none` fire, live default `0`.
- `manual-testing-playbook/scorer-fusion/ablation.md:60` matches the same numbers and adds the seeding description.
- `INSTALL-SKILLED.md:88` states the shipped weight and the reason without quoting a score pair, so it cannot drift from the table.
- `references/scoring/lane-weight-tuning.md:51` makes a general claim about weight misallocation and quotes no ablation number, so it is not a traceability surface for this measurement.
- The changelog's second ablation sentence (`:231`) matches the table.

## Edge Cases

- **Ambiguity: whether a superseded measurement in a changelog is a defect.** A changelog records history, so an older number can be legitimate. Here it is not marked as older, sits in a section describing the shipped default, and contradicts the same file's later sentence. Recorded as a finding.
- **Contradiction: 149/193 against 150 versus 156/196 against 161.** Both were read; the packet table supports only the second, so the first is the side that is stale.
- **Missing dependency: no recorded run scored 149 or 150.** The table covers runs 1 to 9 and none matches, so the sentence cannot be traced to any recorded measurement.

## Confirmed-Clean Surfaces

- The feature catalog ablation leaf states the shipped measurement correctly.
- The playbook scenario states the shipped measurement correctly.
- The install guide states the shipped weight and the reason without a score pair.
- The changelog's background-refresh section states the shipped measurement correctly.
- The lane-weight tuning reference quotes no ablation number.

## Ruled Out

- **The feature catalog's ablation leaf still claims an `advisor_validate` slice.** Ruled out: `ablation.md:22` says `advisor_validate` returns no ablation slice, which is the corrected negative claim.
- **`runLaneAblation` is described as honouring lane weights.** Ruled out: `ablation.md:22` says it ignores weights and includes lanes already at 0.
- **The install guide overstates the lane's benefit.** Ruled out: it says a measured run routed fewer prompts correctly with the lane on.
- **The playbook's pass-bar sentence contradicts D2.** Ruled out: it says the default stays at 0 and the test asserts the default follows the pass bar, which is D2's fail branch.

## Next Focus

- Dimension: `maintainability`
- Focus area: the advisor's `SKILL.md`, the feature catalog index and the doctor assets, judged for pattern compliance, documentation clarity and safe follow-on change cost.
- Reason: `maintainability` is the last uncovered dimension and the only remaining graph coverage gap; convergence is blocked on it alone.
- Rotation status: F-1-002 `correctness`, `security` and `traceability` complete; F-1-005 `correctness`, `security` and `traceability` complete.
- Blocked/productive carry-forward: productive — comparing every surface that quotes a measurement against the one table that records it found the stale pair.
- Required evidence: `.skilled/skills/system-skill-advisor/SKILL.md`, `feature-catalog/feature-catalog.md`, and the doctor assets the commits touched.
- Recovery note: none.

Review verdict: CONDITIONAL
