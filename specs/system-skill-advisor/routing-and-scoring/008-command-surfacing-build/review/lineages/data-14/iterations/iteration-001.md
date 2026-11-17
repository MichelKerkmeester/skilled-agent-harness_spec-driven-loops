# Review Iteration 001

## Dispatcher

- Mode: review, lineage `data-14`, iteration 1 of 8.
- Declared target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Area: `data`; scope files are the advisor graph metadata and ADR-001 in the 040 decision record.
- Dimensions this iteration: correctness and traceability.
- Operator review focus binding: `review-brief-14.txt` asks the data area to check that no remaining advisor intent signal pulls an ordinary prompt to the advisor, and that ADR-001's decline of P05, P08 and P09 stays consistent with the tree. This iteration runs the ordinary-prompt check over all 33 remaining signals and verifies the ADR against AC-004, T006 and the probe rows.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/graph-metadata.json:1-160` (whole file at `e626653ce79`: edges, domains, the 33 intent signals, derived block)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:1-38` (whole file at `e626653ce79`, ADR-001 at line 37)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:59` (AC-004 row)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:49,58` (T006 and T008 evidence cells)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json` (P05, P07, P08, P09 rows and counts)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/after-pass-13.txt:1-25` (leak-check transcript)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-14.txt` and `review-brief-14.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-report.md:18,29` (pass-thirteen disposition of data-13 F001)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1724-1869` (SQLite projection and phrase-variant expansion)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1263-1300` (scoring entry point)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:60-100` (token and phrase matching used by the leak check)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Four ordinary prompts still top the advisor through pre-existing generic intent signals** -- `.skilled/skills/system-skill-advisor/graph-metadata.json:70` -- The six removed phrases stop the five prompts that pass thirteen checked, but the remaining list still carries generic author phrases that match ordinary non-routing prompts. With the committed projection, `route request to the backend service` returns `system-skill-advisor` (0.82, `author:route request`), `which skill should I learn next as a developer` returns it (0.82, `author:which skill`), `not offering a skill in the job listing` returns it (0.82, `author:not offering a skill`), and `measure the workflow throughput` returns it (0.82). Dropping only the matching signal removes the advisor top-1 in every case; `measure the workflow throughput` then returns `sk-design`. The pass-thirteen report's sentence "none of the five ordinary prompts tops the advisor" is true, but the five-prompt check is narrower than the signal list it is taken to clear.
   Finding class: algorithmic
   Scope proof: Ran the built native scorer in-process with the committed SQLite projection (33 canonical advisor signals, 37 after phrase variants) on the four prompts, then re-scored each with only its matching signal removed. The advisor top-1 disappears in all four; no other lane or graph edge supplies it.
   Affected surface hints: `.skilled/skills/system-skill-advisor/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts`, `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/after-pass-13.txt`
   Case: `route request to the backend service`
   Recommendation: narrow the generic signals to advisor-specific compounds (`advisor route request`, `which skill should the advisor use`, `advisor not offering a skill`, `advisor workflow measure`) or exclude their single tokens from the lexical lane, and pin the four prompts as ordinary-sense fixtures.
   Claim adjudication:
   ```json
   {
     "type": "correctness",
     "claim": "Remaining generic intent signals route ordinary prompts to system-skill-advisor, so the pass-thirteen leak class is reduced rather than closed.",
     "evidenceRefs": [
       ".skilled/skills/system-skill-advisor/graph-metadata.json:69-70",
       ".skilled/skills/system-skill-advisor/graph-metadata.json:94",
       ".skilled/skills/system-skill-advisor/graph-metadata.json:98",
       "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/after-pass-13.txt:16-20"
     ],
     "counterevidenceSought": "Checked whether the top-1 came from the skill description or a graph edge rather than the signal; re-scored with only the matching signal dropped and the advisor top-1 disappeared in all four. Checked whether the prompts are advisor-domain; they are backend, career, HR and ops prompts. Checked the pass-thirteen record; its five-prompt check does not cover these inputs.",
     "alternativeExplanation": "The graph prerequisite edge sk-code -> system-skill-advisor and the advisor description contribute small amounts, but the single-signal drop test removes the top-1, so each signal is load-bearing.",
     "finalSeverity": "P1",
     "confidence": 0.9,
     "downgradeTrigger": "If the operator scopes the advisor to any prompt containing 'route request' or 'which skill', or a later change narrows those signals and the four prompts stop topping the advisor."
   }
   ```

P0 candidate check: none raised. The Hunter pass searched every remaining signal against an ordinary-sense prompt; the Skeptic pass separated pre-existing signals from the pass-thirteen change and confirmed the inputs are outside the advisor's contract; the Referee kept P1 because the behavior is reproducible, the inputs are ordinary user text, and pass thirteen treated the same class as P1. It is not P0: no security exposure, no data loss, no release artifact is corrupted.

### P2 Findings

None this iteration.

## Traceability Checks

- `spec_code` -- pass. ADR-001's three declines match the tree: P05 still returns `command-doctor-helper`, and `doctor-helper-match.cjs --top=3` ranks `/doctor:skill-advisor rebuild` first (`doctor-helper-match.cjs` output, `decision-record.md:37`); P07 returns `system-skill-advisor`; P08 returns `sk-doc` and P09 returns no skill, which is why they are declined rather than claimed as fixed. `probes.json` records the same four outcomes.
- `checklist_evidence` -- partial. AC-004 is marked Waived with ADR-001 as its carrier and describes P08/P09 as needing leaking words, which agrees with the tree. T008's evidence cell says "no ordinary prompt tops the advisor" (`tasks.md:58`), which is wider than the five-prompt transcript it cites; F001 is the counterexample. T006's evidence still describes the seven-phrase build, a historical state superseded by T008 and ADR-001.
- `skill_agent` -- pass. `graph-metadata.json` is the skill's author metadata, and the committed SQLite projection exposes the same 33 canonical signals (37 after phrase variants) with no stale removed phrase.
- `agent_cross_runtime` -- not applicable (`applicable: false`). This area defines no agent file and no runtime-specific surface; the change is static skill metadata and a spec decision record.

## Integration Evidence

- `graph-metadata.json` is the only author surface for the advisor's intent signals; `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` and the SQLite `skill_nodes` row are projections of it. The projection read in this iteration exposes `vibe prompt hook` and none of the six removed phrases, so the compile path consumed the change.
- ADR-001's carried-by row points at `AC-004`, `T006`, `scratch/probes.json` and `scratch/after-pass-13.txt`; all four exist and describe the same P05/P07/P08/P09 outcomes.
- The pass-thirteen leak check in `after-pass-13.txt:16-20` reproduces exactly: the first four prompts return no skill and `fix the routing arm in the nginx config` returns `system-spec-kit` (not the advisor).

## Edge Cases

- Four of the leaking signals pre-date pass thirteen. The pass-thirteen fix removed only the seven phrases it had added, so F001 is a residual of the older surface, not a regression introduced by this change. It is still in the declared scope because the brief asks about every remaining phrase.
- The `scoreAdvisorPrompt` confidence is 0.82 for all four prompts because the advisor score is floored; the raw lane evidence, not the floored confidence, is the discriminator. Each single-signal drop test is the causal proof.
- `graph-metadata.json`'s `derived` block also carries `which skill`, `route request` and `skill routing`; the derived lane contributes 0.15-0.20 to the same prompts, so narrowing only `intent_signals` would reduce but not necessarily remove the advisor's rank. The recommendation names both surfaces.
- T006's evidence cell records the seven-phrase build and is now historical. It is not re-reported as a finding because T008 and ADR-001 both record the removal and the decline; it is recorded here so a later reader does not treat the two cells as a contradiction.

## Confirmed-Clean Surfaces

- Correctness: the six removed phrases no longer appear in the committed projection, and the ADR's four probe outcomes reproduce exactly (`P07` advisor, `P05` helper, `P08` `sk-doc`, `P09` no skill).
- Traceability: `AC-004`, `T008` and ADR-001 agree that P05, P08 and P09 are declined, and the probe rows carry the matching actuals.
- The one kept phrase, `vibe prompt hook`, is advisor-specific and does not match any ordinary prompt tested here.

## Ruled Out

- A stale SQLite projection still carrying the six removed phrases: the projection lists 33 canonical signals and none of the six.
- A broken ADR-to-probe linkage: P05's helper ranking, P07's pass and the P08/P09 non-advisor outcomes all reproduce.
- A regression caused by the pass-thirteen removal in the five prompts it tested: all five reproduce the pass-thirteen transcript.

## Next Focus

- Dimension: security and maintainability.
- Focus area: check the residual-leak record in ADR-001 and the regression surface around the remaining generic signals, plus the security of both scope files.
- Reason: correctness and traceability now have evidence; the residual is recorded as F001, and the documentation and test surface that would let it recur is unreviewed.
- Rotation status: correctness and traceability complete; security and maintainability remain.
- Blocked/productive carry-forward: F001 is the only active P1 and stays open.
- Required evidence: an ADR and test-surface read, and a security pass over the two static files.

Review verdict: CONDITIONAL
