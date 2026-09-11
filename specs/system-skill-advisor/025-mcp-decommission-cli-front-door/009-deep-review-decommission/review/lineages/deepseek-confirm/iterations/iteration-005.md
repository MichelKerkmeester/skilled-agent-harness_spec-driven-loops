# Iteration 5: D5 Stabilization — adversarial replay, overlay protocols, stop confirmation

## Focus

Dimension: stabilization (all dimensions already covered; this pass re-tests the active set and completes the advisory overlay protocols).
Scope: adversarial replay of F001–F003, `feature_catalog_code` and `playbook_capability` overlay execution, convergence and legal-stop confirmation, iteration-ceiling stop.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability (stabilization pass)
- Files reviewed: 9
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

None.

### P1, Required

None.

### P2, Suggestion

- **F008**: Live playbook scenario steps still instruct an operator to use the retired MCP server. `.opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/unavailable-daemon.md:48` step 5 reads "If MCP scan is unavailable, restart the MCP server after deleting only the corrupt copied database", and step 6 (`:49`) says "call `skill_graph_scan({})` from an untrusted public MCP context". The file is a live scenario contract (its recorded run sits below the quoted contract). Sibling hits are historical records and are classified as such: the absorbed legacy row in `cli-hooks-and-plugin/claude-user-prompt-submit.md:64` is explicitly labelled "Absorbed Legacy Test Row", and the "MCP server reachable" lines in `auto-update-daemon/rebuild-from-source.md:81` and `lifecycle-routing/rollback-lifecycle.md:102` sit inside recorded-run evidence blocks. The retained-directory decision in phase 007's limitation item 5 covers names, not live instruction text, so this remains a doc-vs-tree mismatch; it is raised under the advisory `playbook_capability` protocol.
  Reproduction: `rg -n "MCP server|MCP scan|MCP context" .opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/unavailable-daemon.md` → `:48`, `:49`.
  ```json
  {
    "findingId": "F008",
    "claim": "A live playbook scenario still instructs restarting the MCP server and using an untrusted public MCP context, neither of which exists after the decommission.",
    "evidenceRefs": [
      ".opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/unavailable-daemon.md:48",
      ".opencode/skills/system-skill-advisor/manual-testing-playbook/operator-h5/unavailable-daemon.md:49"
    ],
    "counterevidenceSought": "Checked whether the lines sit inside recorded-run evidence (they do not; they are numbered scenario steps above the blocked-run record), grepped the playbook for other MCP instruction text and classified each hit (legacy row / recorded run), and read phase 007's retained-names decision (names only).",
    "alternativeExplanation": "The steps could be deliberately aspirational placeholders for a future MCP-compatible surface; no such surface exists, and the scenario's own blocked-run record shows the precondition could not be met.",
    "finalSeverity": "P2",
    "confidence": 0.75,
    "downgradeTrigger": "If the playbook marks recorded scenarios as frozen history rather than live contracts, downgrade to informational.",
    "transitions": [
      { "iteration": 5, "from": null, "to": "P2", "reason": "Initial discovery during overlay-protocol execution" }
    ]
  }
  ```

## Adversarial replay (active P0/P1)

| Finding | Hunter (re-verify against source) | Skeptic (severity challenge) | Referee |
|---|---|---|---|
| F001 (P1) | Re-read ENV-REFERENCE.md:313/:366; re-ran `rg` for both variables across `.claude`, `.codex`, `opencode.json`, `.cursor`, `.pi` (including hidden files) → zero hits. | Still a doc-vs-config mismatch on an operator reference; no false claim about security behavior beyond the trust-default row. P1 stands as a required-finding non-closure. | **Confirmed P1**, confidence 0.9 |
| F002 (P1) | Re-read `bin/README.md:20,171,177,179` verbatim; re-listed `bin/` (one daemon-backed shim); `DIST_PACKAGES` count re-checked (6 ids). | Could a second/third shim live outside `bin/`? The section is about `bin/`; none found. P1 stands. | **Confirmed P1**, confidence 0.85 |
| F003 (P1) | Re-read parent `spec.md:141-151`; re-checked child statuses (008/009/010 Complete); confirmed no generator or freeze rule for the map. | The map may be authoring-time metadata; spec.md's own text says it tracks aggregate progress. P1 stands as a completion-presentation non-closure, not a behavior defect. | **Confirmed P1**, confidence 0.8 |

No falsifications; no downgrades.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | all nine prior required findings assessed; six closed, three partial (F001, F002, F003) | Overlay results below |
| checklist_evidence | partial | hard | 008 acceptance rows assessed; AC-008 suite replay owed (no stored log; scratch empty) | Corroborated for the accuracy-gate pair by `9015d00c79` |
| feature_catalog_code | pass | advisory | `.opencode/skills/system-skill-advisor/feature-catalog/` — no MCP-server claims; index describes the CLI surface and native daemon | Correction: marked `notApplicable` in iteration 4; the protocol applies to spec-folder targets and was executed here |
| playbook_capability | partial | advisory | live steps in `operator-h5/unavailable-daemon.md:48-49` assume a retired MCP surface | Filed as F008 |

## Gate and stop confirmation

- `convergenceGate`: telemetry — composite stop score would be evaluated as 1.0-stop on ratios but the ceiling takes precedence.
- `dimensionCoverageGate`: pass — correctness (1-2), security (4), traceability (2-4), maintainability (2-4); core protocols executed.
- `p0ResolutionGate`: pass — activeP0 = 0.
- `evidenceDensityGate`: pass — every active P0/P1 carries file:line evidence and a reproduction.
- `hotspotSaturationGate`: pass trivially (no coverage graph active).
- `claimAdjudicationGate`: pass — packets for F001/F002/F003 present, four `claim_adjudication` events all `passed: true`.
- `fixCompletenessReplayGate`: pass trivially — not a security-sensitive fix rerun.
- `candidateCoverageGate` / `graphlessFallbackGate`: pass trivially — review-depth v2 inactive.
- Terminal decision: iteration_count 5 >= maxIterations 5 → `STOP`, `stopReason: maxIterationsReached` (parent goal D10: five iterations, convergence off, ceiling terminal).

## Assessment

- New findings ratio: 1.0 (one new P2; weight 1 of 1)
- Dimensions addressed: stabilization across all four; overlay protocols completed
- Novelty justification: the overlay pass found one live-scenario residue that the earlier iterations did not touch; adversarial replay produced no changes to the active set.

## Ruled Out

- "The feature catalog still sells an MCP surface": catalog is clean and current.
- "The playbook as a whole is stale": the remaining hits outside `unavailable-daemon.md` are labelled legacy rows or recorded-run evidence; classified historical.
- "A P0 exists among the prior set": no prior required finding was P0; none upgraded.

## Dead Ends

- Searching for a live MCP surface behind the playbook's "MCP scan" step: the scan now runs through the CLI; no MCP entry exists.

## Recommended Next Focus

None — ceiling reached. Proceed to synthesis.

Review verdict: PASS
