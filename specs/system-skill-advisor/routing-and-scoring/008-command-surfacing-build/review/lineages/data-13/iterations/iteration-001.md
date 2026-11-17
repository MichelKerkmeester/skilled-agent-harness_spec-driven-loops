# Review Iteration 001

## Dispatcher

- Mode: review, lineage `data-13`, iteration 1 of 8.
- Declared target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Area: `data` per `review/review-scope-13.txt`; diff range `b8ebee37d75..932aff4e437`.
- Focus this iteration: correctness and traceability of the seven new advisor `intent_signals` phrases, the CL-009 playbook prompt change and ADR-001's P05 waiver.
- Operator review focus binding: `review_brief-13.txt` was read first; every finding below is checked against its data-area questions (ordinary prompts must not be pulled to the advisor, the playbook prompt must match its expected lines, ADR-001 must keep P05 on `/doctor:helper`).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/graph-metadata.json:1-201` (whole file at `932aff4e437`)
- `.skilled/skills/system-skill-advisor/graph-metadata.json:96-110` (the seven appended signals)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md:1-198` (whole file at `932aff4e437`)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md:80-165` (changed prompt and Expected block)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:1-38`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:59`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:37,49,121`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json:79-135`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` (the compiled `system-skill-advisor` signals)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:2116-2140` and its `commandPolicies` rows for `/doctor:update`
- `.skilled/commands/doctor/_routes.yaml:786-809`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:1-330`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:295-300`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:200-290`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64-200` (`command-doctor-update` row)
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:30-90`
- `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/{fusion,projection}.js` (the built scorer used for the scoring probes)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-13.txt:1-1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-13.txt:1-7`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/deep-review-config.json`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **New signals are indexed as common words, so ordinary prompts top the advisor** -- `.skilled/skills/system-skill-advisor/graph-metadata.json:101-107` -- Five of the seven appended signals introduce ordinary vocabulary (`clean`, `arena`, `arm`, `advisor`, `briefs`) that the lexical lane consumes as skill tokens. Prompts that never name the advisor now return it as the top recommendation at confidence 0.82 with `passes_threshold: true`, and in two cases it displaces the plausible skill.
   Finding class: algorithmic
   Scope proof: Scored the same prompt set twice with the built scorer, once with the committed projection and once with the seven signals removed from the advisor's `intentSignals`. `the routing arm of the load balancer is flaky` -> `system-skill-advisor:0.82` now, `none` before. `the advisor briefs me every morning` -> `system-skill-advisor:0.82` now, `none` before. `the arena is clean now` -> `system-skill-advisor:0.82` now, `none` before. `clean the routing table` -> `system-skill-advisor:0.82` now, `none` before. `fix the routing arm in the nginx config` puts the advisor first at 0.82 where `system-spec-kit`/`sk-code` led before.
   Affected surface hints: `.skilled/skills/system-skill-advisor/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts`
   Case: `the routing arm of the load balancer is flaky`
   Claim adjudication: `{"type":"algorithmic","claim":"The appended intent_signals leak common tokens into the lexical lane, so prompts with no advisor intent pass the 0.82 threshold for system-skill-advisor.","evidenceRefs":["graph-metadata.json:101-107",".skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json (signals for system-skill-advisor)","dist scorer probe: laneContributions lexical rawScore 0.67 evidence token:clean, token:arena"],"counterevidenceSought":"Tested controls with the same words in other senses; checked whether the 0.82 confidence is below the emitted threshold and found passes_threshold true with uncertainty 0.12-0.16. Checked whether the same prompts topped the advisor before the change: they returned none in the stripped projection.","alternativeExplanation":"The advisor may be the intended catch-all for graph and prompt terminology, so an ordinary networking prompt could be tolerated noise. Rejected because three of the four cases have no advisor/graph meaning at all and two displace a more plausible skill.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"If the advisor brief suppresses recommendations below a higher confidence than 0.82, or if the lexical lane already excluded single-token evidence from graph signals before this change."}`
   Recommendation: score joined intent_signals as phrases only, or gate their individual tokens out of the lexical and graph lanes; add ordinary-sense fixtures such as `the routing arm of the load balancer is flaky` and `the advisor briefs me every morning` to the specificity test.

### P2 Findings

1. **`clean arena` fires inside a longer noun phrase and ranks the advisor above a design request** -- `.skilled/skills/system-skill-advisor/graph-metadata.json:106` -- The declared two-word phrase matches as a substring of `clean arena seating`, so a design request is now topped by the advisor at 0.82 ahead of `sk-design`, where `sk-design` was the only recommendation before.
   Finding class: algorithmic
   Scope proof: `clean arena seating chart for the stadium` -> `system-skill-advisor:0.82` first, `sk-design:0.82` second; the stripped-intent projection returned only `sk-design:0.82`. The recommendation's lanes are `explicit_author:0.88 [author:clean arena]` and `lexical:0.40 [token:clean|token:arena]`.
   Affected surface hints: `.skilled/skills/system-skill-advisor/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts`
   Case: `clean arena seating chart for the stadium`
   Recommendation: require a phrase boundary after a declared signal, or add the ordinary noun-phrase sense as a negative fixture.

No P0 candidates existed; the P1 above was challenged in-iteration by the stripped-projection control and by the threshold check, and the P2 needed no self-check.

## Traceability Checks

- `spec_code` -- pass. The committed `intent_signals` block at `932aff4e437` holds 39 phrases and the seven appended ones match T006's description (`tasks.md:49`). The compiled `runtime/scripts/skill-graph.json` carries the same seven strings in the `system-skill-advisor` signals, so the graph recompile claimed by T006 happened.
- `checklist_evidence` -- pass. `acceptance-criteria.md:59` (AC-004) records P07/P08/P09 passing and P05 topped by `/doctor:helper`; `scratch/probes.json` shows exactly that (`P07` 0.8511, `P08` 0.82, `P09` 0.8548, `P05` `command-doctor-helper` 0.8), and my rerun of P05 returned `command-doctor-helper` at 0.8 with and without the seven signals.
- `playbook_capability` -- pass. `brief-command-policy-word.md:83-108` sends `check for skilled updates`; scoring that prompt tops `command-doctor-update` (0.8962), and `renderAdvisorBrief` renders `system-skilled-doctor → /doctor:update (ask)` for a parent and `(parent-named only)` for a child, matching `brief-command-policy-word.md:148` and `:160-161`. The old prompt `update skilled to the latest version` tops `sk-git`, which explains why the playbook needed the change.

## Integration Evidence

- Scorer surface: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1263` `scoreAdvisorPrompt`; explicit lane `lanes/explicit.ts:309`; lexical lane evidence from `laneContributions`.
- Command surface: `command-bridges.generated.json` entry `command-doctor-update` and `COMMAND_ROWS['command-doctor-update']` (`command-attach.ts`), policy `ask`, mutating `mutates`, owner `system-skilled-doctor`.
- Doctor route declaration: `.skilled/commands/doctor/_routes.yaml:800-809` still lists `update skilled to the latest version`; that phrase no longer reaches its own command (see Edge Cases).
- ADR surface: `decision-record.md:37` ADR-001 and `acceptance-criteria.md:59` AC-004 agree.

## Edge Cases

- The phrase `update skilled to the latest version` remains a declared `/doctor:update` trigger (`_routes.yaml:804`) but scores `sk-git` (0.82) and never returns `command-doctor-update`. The playbook now avoids the phrase rather than pinning it. That route file sits outside the declared target, so it is recorded here as integration evidence and left for a follow-up, not raised as a finding against the playbook.
- `clean arena seating before the show` matched `author:clean arena` yet produced no recommendation (below the 0.82 pass line); the same phrase inside `clean arena seating chart for the stadium` did pass. The difference is the second lexical token (`chart`), so the boundary finding is about ranking, not about every substring occurrence.
- The committed `derived` block was not regenerated with the seven signals; a fresh `extractDerivedMetadata` run does not surface them either, so this is not evidence of a stale routing surface.

## Confirmed-Clean Surfaces

- ADR-001 holds: P05 tops `command-doctor-helper` at 0.8, identical before and after the seven signals, and `/doctor:helper` ranks `/doctor:skill-advisor rebuild` first for it.
- The CL-009 prompt change matches every expected line; the version bumped `1.0.1.0 -> 1.0.2.0`, the six command blocks and the Evidence block all use `check for skilled updates`, and the root catalog row carries no prompt text that would need the same edit.
- The graph is compiled: `skill-graph.json` signals for `system-skill-advisor` end with the seven new phrases, and the projection reports `source: sqlite` with 61 skills.

## Ruled Out

- A stale `derived` block breaking routing: the fresh extractor does not add the seven phrases to `trigger_phrases`/`keywords`, so the derived lane is unaffected and the omission is not a routing defect.
- A secret, injection or ReDoS surface in the change: the signals are static author strings matched by substring/token rules, with no prompt-built regex and no filesystem or credential read.
- The waived P05 coming back to the advisor through `skill graph is stale` / `rebuild the skill graph`: measured identical 0.8 `command-doctor-helper` ranking before and after; the helper handoff still wins.
- The playbook prompt itself: its parent and child labels reproduce exactly.

## Next Focus

- Dimension: security and maintainability.
- Focus area: the same three scope files read under the two remaining dimensions; the phrase specificity contract in `declared-phrase-specificity.vitest.ts`, duplicate/overlapping signals against the doctor vocabulary, and the playbook's own instruction surface.
- Reason: correctness and traceability are covered; two dimensions remain and each scope file still needs its second dimension.
- Rotation status: correctness and traceability marked complete for this iteration; security and maintainability next.
- Blocked/productive carry-forward: the lexical-token leak is productive to re-read under maintainability, because its fix shape (phrase-only scoring) changes the declared-phrase contract.
- Required evidence: a maintainability read of the signal list against the test contract, and a security read of the playbook commands.

Review verdict: CONDITIONAL
