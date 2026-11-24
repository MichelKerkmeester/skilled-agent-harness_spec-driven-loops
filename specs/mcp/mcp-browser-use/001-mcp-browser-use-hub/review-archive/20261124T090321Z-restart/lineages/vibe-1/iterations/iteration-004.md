# Review Iteration 004

## Dispatcher

- **Mode**: review
- **Target**: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- **Dimension**: traceability
- **Operator review focus**: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- **How this iteration addressed the focus**: it traced the parent goal's seven criteria and phase 014's six criteria to shipped evidence, and checked the packet's own two-stage replay against the playbook that defines the same scenario. It also checked whether the 014 advisor scorer change actually closed the out-of-domain finding it was made for.
- **Sources read**: `goal.md`, `spec.md`, `014-fix-deep-review-findings/{goal.md,implementation-summary.md}`, `.skilled/skills/mcp-browser-use/{description.json,manual-testing-playbook/manual-testing-playbook.md,manual-testing-playbook/hub-routing/holdout-browser-inspect.md}`, `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv`

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:100-140`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:53`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md:60-90`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/implementation-summary.md:50-80`
- `.skilled/skills/mcp-browser-use/description.json:1-26`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:12,62`
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-browser-inspect.md:46,62`
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv:1-50`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The advisor-facing keyword set is far narrower than the hub router's vocabulary, so the hub is unreachable for prompts it routes correctly** -- `.skilled/skills/mcp-browser-use/description.json:6` -- `description.json` carries 17 keywords, of which six are hub metadata (`mcp-browser-use`, `mode-registry`, `hub-router`, `workflowMode`, `packetKind`) and three are mode ids, leaving eight task phrases: `chrome devtools`, `aside repl`, `bladebro`, `stealth browser`, `lighthouse audit`, `record a performance trace`, `use aside`, `agentic browser`, `browser automation`. `hub-router.json` declares 76 keywords across six classes, including `network requests`, `inspect the dom`, `console errors`, `har export`, `cdp` and `browser debug`. The packet's own replay records the consequence: `MBU-PB-04` (`results.csv:50`) scores `hub_confidence` 0 with an empty `advisor_top` on "The staging site throws runtime errors on load; I need to inspect its network requests and the live DOM to find the cause", so stage one fails while stage two routes correctly to `mcp-chrome-devtools`. The same prompt is playbook `MT-H01`, whose pass condition is router-only (`holdout-browser-inspect.md:46`), so the packet holds two verdicts for one scenario: PASS in the playbook, FAIL in the replay.
   Finding class: traceability
   Scope proof: `description.json`, `hub-router.json`, the replay CSV and the playbook are all shipped files of the declared target's hub.
   Affected surface hints: `.skilled/skills/mcp-browser-use/description.json` keywords; `.skilled/skills/mcp-browser-use/hub-router.json` vocabulary classes; the replay report and the `MT-H01` playbook that disagree about the same prompt.
   Case: an agent asks for "inspect its network requests and the live DOM" on a staging site; the advisor scores the hub 0 because no `description.json` keyword matches, so the hub is never offered, even though the hub router would route the prompt to `mcp-chrome-devtools` in one step.

```json
{
  "type": "claim",
  "claim": "The hub's advisor-facing description.json keyword set omits most of the vocabulary its own router scores, so prompts the router handles are never routed to the hub, and the packet records the same scenario as both PASS and FAIL.",
  "evidenceRefs": [
    ".skilled/skills/mcp-browser-use/description.json:6",
    ".skilled/skills/mcp-browser-use/hub-router.json:96",
    ".skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv:50",
    ".skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-browser-inspect.md:46"
  ],
  "counterevidenceSought": "Checked whether the advisor scores from hub-router.json rather than description.json: the replay's stage-one column is the advisor's own output and it is 0 for this prompt, so the advisor does not read the router vocabulary. Checked whether the replay's FAIL is out of the criterion's scope: 014 criterion 5 names original, paraphrase and out-of-domain rows, and MBU-PB-04 is a playbook row, so the criterion survives on a narrow reading -- but the two artifacts still disagree about the scenario, which is the traceability defect. Checked whether the playbook's router-only pass condition is the authoritative one: it is the artifact that defines the scenario, and it says PASS.",
  "alternativeExplanation": "The narrow description.json could be deliberate, to keep the advisor from over-recommending the hub. That explains the omission but not the outcome: the packet's own replay marks the resulting miss a FAIL, and the playbook for the same prompt expects a route, so the two shipped artifacts cannot both be right.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if the replay's stage-one column is documented as advisory for playbook rows, and the playbook's router-only pass condition is declared the authoritative verdict for MT-H01."
}
```

### P2 Findings

2. **Two goal logs still report the 014 work as in progress while every criterion is checked** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md:83` -- Phase 014's goal marks all six completion criteria `[x]` and its frontmatter carries `completion_pct: 100`, while its own progress table still reads "Leftovers, re-mint, gates; scorer widen chosen | In Progress" (`goal.md:83`). The parent goal has the same shape: its progress table reads "014 deep review fixes | In Progress | Phase-added with its binding row. Five fix lanes running" (`goal.md:130`) while the parent `spec.md:53` states "Complete: phases 001 to 014 are Complete and all seven goal criteria hold".
   Finding class: traceability
   Scope proof: both goal files and the parent spec are canonical packet docs inside the declared target.
   Affected surface hints: `014-fix-deep-review-findings/goal.md` progress table; parent `goal.md` progress table; parent `spec.md` status row.
   Case: a reader opens the parent goal to learn whether the packet is done, reads "014 deep review fixes | In Progress", and reports the packet as unfinished, contradicting the spec's Complete status and the checked criteria.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | `.skilled/skills/mcp-browser-use/description.json:6` | Parent criterion 5 ("one real browser request per mode returns mcp-browser-use from the advisor and that mode from the hub router") holds for the three mode-named requests the replay records, but not for a plain-language debugging request the hub router handles, so the advisor half of the criterion is narrower than the criterion reads. |
| `checklist_evidence` | partial | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md:83` | Phase 014's six criteria are all checked, but criterion 5's own evidence records 48 of 49 replay rows passing, and two progress tables still say In Progress, so the checklist evidence is not internally consistent. |

## Integration Evidence

- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv` -- the 49-row two-stage replay; counted 48 PASS and 1 FAIL, with `stage1` false on exactly the failing row.
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/hub-routing/holdout-browser-inspect.md` -- playbook `MT-H01`, which defines the same prompt and a router-only pass condition.
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:12,62` -- the corpus rule that a run is complete only once its PASS/FAIL/SKIP outcome is recorded under `benchmark/reports/<dated-run-label>/`, and that the latest recorded run is `2026-11-21--manual-testing-playbook--hub-routing--post-review`.

## Edge Cases

- **Ambiguity: is 014 criterion 5 actually unmet?** Its wording is "passes every original, paraphrase and out-of-domain row". The single failing row is `kind: playbook`, so the criterion is satisfied on a literal reading. Recorded as satisfied, with the disagreement between the playbook and the replay carried as finding 1 rather than as a criterion failure. This is the safest in-scope interpretation and it keeps the severity honest.
- **Missing dependency: `validate.sh --strict --recursive` was not run.** Parent criterion 7 and 014 criterion 6 both rest on it. Running it is outside this lineage's write authority and the dispatch forbids it, so both criteria are recorded as unverified rather than passed or failed.
- **Missing dependency: `node --test .skilled/bin/tests/mcp-installers.test.cjs` was not run.** 014 criterion 1 rests on it. Recorded as unverified for the same reason.
- **Partial success**: the parent goal's criteria 1, 2 and 3 were verified in iterations 1 and 2 (mode counts, registry contents, no stale `mcp-tooling` ids in the hub's own files); criteria 4, 6 and 7 remain unverified or partly verified.

## Confirmed-Clean Surfaces

- Parent criterion 2 holds: `.skilled/skills/mcp-browser-use/mode-registry.json` lists exactly three modes (verified in iteration 1).
- Parent criterion 6 holds on the artifact side: all three modes have playbook coverage under `manual-testing-playbook/hub-routing/` (`chrome-devtools-browser-debug.md`, `aside-browser-automation.md`, `bladebro-stealth-browser.md`), plus `lighthouse-performance-audit.md`, `ambiguous-defer.md` and two holdouts, and the corpus records its latest run as `2026-11-21--manual-testing-playbook--hub-routing--post-review`.
- The 014 advisor scorer change did close the out-of-domain finding it was made for: every `negative` and `negative-rb` row in the replay now defers (`results.csv` rows `MBU-N-02` through `MBU-N-11` all show `route_action: defer` with `hub_confidence` 0), which is the behaviour 014's implementation summary claims.
- `014-fix-deep-review-findings/implementation-summary.md:50-80` names every changed file by path, and each path named there exists in the tree.

## Ruled Out

- **The 014 advisor scorer change failing its own goal**: ruled out -- all ten negative and negative-rb replay rows defer with hub confidence 0, which is exactly the out-of-domain behaviour 014 set out to restore.
- **Parent criterion 2 or 3 regressing**: ruled out in iterations 1 and 2.
- **The replay report being stale relative to the tree**: ruled out -- the CSV carries 49 rows including the paraphrase and negative families the 014 summary describes, so it is the post-fix run rather than the pre-fix one.

## Next Focus

- **Dimension**: traceability
- **Focus area**: the remaining parent criteria that rest on artifacts rather than on tool runs -- criterion 4 (the parent-skill checker naming the hub as its subject) and criterion 6's recorded-run requirement -- plus the 005 phase's own admission that REQ-003 and REQ-008 are "not met as written", which the parent spec records without resolving.
- **Reason**: iteration 4 traced the criteria that could be checked from shipped files; the ones that remain need the checker's own contract and the 005 requirement text read together.
- **Rotation status**: correctness and security complete; traceability continues; maintainability remains.
- **Blocked/productive carry-forward**: productive -- counting the replay's verdict column rather than trusting the summary line turned a claimed 49/49 into a measured 48/49.
- **Required evidence**: file:line for the parent-skill checker's subject rule, and for each 005 requirement the parent spec records as unmet.

Review verdict: CONDITIONAL
