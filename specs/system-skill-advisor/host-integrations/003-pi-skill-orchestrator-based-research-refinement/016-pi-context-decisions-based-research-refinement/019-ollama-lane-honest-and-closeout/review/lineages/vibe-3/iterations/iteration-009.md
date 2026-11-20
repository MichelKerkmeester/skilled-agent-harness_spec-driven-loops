# Review Iteration 009

## Dispatcher

- Mode: review (fan-out lineage `vibe-3`)
- Session: `fanout-vibe-3-1795172940208-84a42n`, generation 1, lineageMode `new`
- Frontier node: none -- both F-1-003 and F-1-006 are answered on all four dimensions, so this iteration runs the cross-reference fallback the strategy reserves for a drained frontier.
- Operator review focus: the phase-019 commit set at HEAD. This iteration addressed the focus by reading the shipped changelog against the packet's own ablation record and against the archived measurement it quotes.
- Sources read: `steer.md` (absent), `deep-review-strategy.md`, `frontier-nodes.jsonl`, `git show 5c91b2f3f5d`, and the HEAD files cited below.

## Files Reviewed

- `.skilled/changelog/skilled/v4.1.0.0.md:220-236`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:99`, `:112-121`
- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/acceptance-criteria.md:56-68`
- `specs/system-skill-advisor/z_archive/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The changelog states the archived 149/193 ablation as the reason for the shipped default weight** -- `.skilled/changelog/skilled/v4.1.0.0.md:222` -- the "Ollama Off the Advisor Prompt Path" section says "The ablation scored 149 of 193 with the lane and 150 without", while `:231` of the same file says the real-embedding ablation "scored 156 correct against 161 without it" on the 196-row corpus, and the packet's own record at `implementation-summary.md:99`, `:113` and `:121` states 156 against 161 three times. The 149/193 pair is the archived measurement at `specs/system-skill-advisor/z_archive/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79`, which the current packet supersedes. `5c91b2f3f5d` rewrote the sentence at `:231` and left `:222` untouched.
   Finding class: traceability
   Scope proof: `.skilled/changelog/skilled/v4.1.0.0.md` is in the review target; the packet and archive paths are cited as context evidence only.
   Affected surface hints: the shipped changelog, the packet's ablation record, the archived packet the figure comes from.
   Case: an operator reads the section that explains why the lane defaults to `0`, quotes a one-row margin from a superseded 193-row run, and cannot reconcile it with the five-row margin the same file reports forty lines later.
   ```json
   {
     "type": "traceability",
     "claim": "The changelog's default-weight rationale cites the archived 149/193 ablation while the packet and the same file's later section cite 156/161 on the 196-row corpus.",
     "evidenceRefs": [
       ".skilled/changelog/skilled/v4.1.0.0.md:222",
       ".skilled/changelog/skilled/v4.1.0.0.md:231",
       "implementation-summary.md:99",
       "implementation-summary.md:113",
       "implementation-summary.md:121",
       "specs/system-skill-advisor/z_archive/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79"
     ],
     "counterevidenceSought": "Searched the packet and the changelog for any sentence that reconciles 193 rows with 196 rows or marks 149/193 as superseded; found none. Checked whether 149/193 could be the no-embedding run the changelog describes at :235; that run is described on the 196-prompt corpus, not 193.",
     "alternativeExplanation": "The 149/193 figure may be a deliberate historical reference showing the lane was already net-negative before this phase. Rejected because the sentence sits in the section that explains the shipped default and names no archive, so a reader takes it as the current measurement.",
     "finalSeverity": "P1",
     "confidence": "high",
     "downgradeTrigger": "Downgrade to P2 if the sentence is amended to name the archived packet and mark the figure superseded, since the default-0 decision holds under both measurements."
   }
   ```

### P2 Findings

None.

## Traceability Checks

- `spec_code` -- pass -- `acceptance-criteria.md:56-68` carries thirteen rows and every one reads `Met` with a named verification artifact, so the packet's closure claim matches its own table.
- `checklist_evidence` -- pass -- `acceptance-criteria.md:56-68` was read row by row against the shipped code and the changelog; the only mismatch found is the ablation figure reported above, and the checklist row AC-005 itself names the correct 156/161 pair.

## Integration Evidence

- `.skilled/changelog/skilled/v4.1.0.0.md:222` and `:231` -- the two contradictory ablation sentences in one shipped file.
- `implementation-summary.md:99`, `:113`, `:121` -- the packet's three statements of 156 against 161, which the changelog's `:222` contradicts.
- `specs/system-skill-advisor/z_archive/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79` -- the archived source of the 149/193 pair.

## Edge Cases

- The frontier is drained, so this iteration runs the cross-reference fallback rather than a node dimension. The fallback is recorded here as the strategy requires.
- The 149/193 measurement is real; the finding is that the changelog presents it as current without naming the archive it comes from.

## Confirmed-Clean Surfaces

- Every `acceptance-criteria.md` row reads `Met` with a named verification artifact, so no row is silently unmet.
- The changelog's later ablation paragraph (`:231`) matches the packet's record exactly, so the defect is confined to `:222`.

## Ruled Out

- "The packet's ablation record is internally inconsistent": ruled out -- `implementation-summary.md:99`, `:113` and `:121` all state 156 against 161 with the same flip count.
- "The 149/193 figure is fabricated": ruled out -- it matches the archived packet at `008-semantic-shadow-prove-or-freeze/implementation-summary.md:79` exactly.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: the frontier is drained, all four dimensions are covered, and the cross-reference fallback has run
- Rotation status: F-1-003 4 of 4, F-1-006 4 of 4, cross-reference 1 of 1
- Blocked/productive carry-forward: productive -- the fallback produced one P1
- Required evidence: none; synthesis reads the registry and the nine iteration files
- Recovery note: none

Review verdict: CONDITIONAL
