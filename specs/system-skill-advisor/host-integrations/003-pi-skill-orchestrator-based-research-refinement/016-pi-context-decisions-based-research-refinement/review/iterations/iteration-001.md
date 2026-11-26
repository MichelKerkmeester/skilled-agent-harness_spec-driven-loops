# Iteration 001 - Correctness (unread modules + fusion.ts recheck)

## Dispatcher

- Generation 5, iteration 1 of 3, native executor (opus), lineageMode restart, sessionId 2026-11-23T21:41:17.101Z.
- Iteration number derived from the state log: zero prior `type:"iteration"` records, so this is iteration 1 (matches the dispatch).

## Dimension

Correctness. Operator focus addressed: this pass read the modules generation 4 never opened (`runtime/lib/lifecycle/`, `runtime/lib/derived/sync.ts`, `runtime/lib/skill-graph/skill-graph-db.ts` index path, `runtime/handlers/skill-graph/scan.ts`) and rechecked the five generation-4 fusion.ts findings at HEAD. Four of five still hold and are recorded below with full paths; one is ruled out.

## Files Reviewed

- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts (lines 520-560, 1110-1140, 1170-1470, 340-380)
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts (94-110)
- .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/age-haircut.ts, archive-handling.ts, rollback.ts, schema-migration.ts, supersession.ts (full)
- .skilled/skills/system-skill-advisor/runtime/lib/derived/sync.ts (full)
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/derived.ts (70-110)
- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts (607-632, 738-747, 859-1075)
- .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts (full)
- .skilled/skills/system-skill-advisor/runtime/tests/skill-graph-handlers.vitest.ts (test reading, 114-122)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A scoped skill_graph_scan deletes every skill outside the scanned root and publishes the shrunken graph as live** -- .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:976 -- `handleSkillGraphScan` accepts any `skillsRoot` under the workspace [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:44] and passes it to `indexSkillMetadata` [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:53]. Inside the index transaction `deleteMissingNodes(database, skillIds)` runs with only the ids found under that root [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:976], and that helper issues `DELETE FROM skill_nodes WHERE id NOT IN (...)` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:745]. The handler then publishes a generation with `state: 'live'` [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:55-60], and the scorer projection reads `skill_nodes` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1402]. The code already guards the empty-root case ("preserving existing graph") [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:921-922], which shows deletion of unseen skills was not meant to follow from a narrow root; the one-skill root bypasses that guard. The tool schema advertises the parameter as "Optional skills root to scan" [SOURCE: .skilled/skills/system-skill-advisor/runtime/tools/skill-graph-tools.ts:28], and the only handler test covers the empty root [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-graph-handlers.vitest.ts:114-122].
   Finding class: stale-or-destructive-state-on-rebuild
   Scope proof: handler and index function are both in reviewScopeFiles; the deletion is unconditional inside the transaction for any non-empty id set.
   Affected surface hints: runtime/handlers/skill-graph/scan.ts, runtime/lib/skill-graph/skill-graph-db.ts deleteMissingNodes, skill_graph_scan tool schema, projection SQLite read path.
   Case: a trusted caller runs skill_graph_scan with skillsRoot set to .skilled/skills/sk-code, which deletes every other skill node and its rows, so the advisor projection can route only to sk-code until a full-root scan runs again.

```json
{"type":"correctness","claim":"skill_graph_scan with a sub-root deletes all skill_nodes not under that root and publishes the generation as live","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:44",".skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:53",".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:976",".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:745",".skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1402"],"counterevidenceSought":"Looked for a scope filter on deleteMissingNodes (none, it takes only the id list), for a test pinning sub-root semantics (only the empty-root test exists), and for an empty-scan guard (exists but only for zero ids).","alternativeExplanation":"skillsRoot may be intended only as a full replacement root for tests or alternate workspaces, in which case deleting unseen ids is the mirror semantics; the schema text does not say so.","finalSeverity":"P1","confidence":0.75,"downgradeTrigger":"Downgrade to P2 if the serving projection does not read skill_nodes on the live path, or if skillsRoot is documented and enforced as a full-tree replacement root only."}
```

Skeptic/referee (compact): the call requires a trusted caller, which limits exposure but not correctness; a trusted agent passing a narrower root is a natural use of an advertised parameter. Not P0, because a full-root rescan restores the graph and no data outside the derived index is lost. Held at P1.

### P2 Findings

1. **RRF fusion scores flow into confidence and the ranking adjustments as if they were weighted sums** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1190 -- Under the opt-in RRF flag (`isAdvisorRrfFusionEnabled` defaults false [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:166-168]) `score` becomes the RRF score [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1190-1191], is divided by the weighted-sum `liveTotal` into `liveNormalized` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1208], and is compared against the fixed -0.08 command penalty [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1254-1255]. With k=8 [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:84] a rank-1 hit in a 0.4-weight lane scores about 0.044 (probe), smaller than the 0.08 penalty, so the penalty and confidence ramp operate on a different scale than the one they were calibrated for. Recheck of generation-4 finding, still holds.
   Finding class: scale-mismatch
   Scope proof: all lines in fusion.ts, in scope.
   Affected surface hints: fusion.ts confidenceFor input, sort comparator, RRF flag users.
   Case: with the RRF flag on, any command candidate without a slash in the prompt loses to a skill even when it holds rank 1 in every lane, because the 0.08 penalty exceeds its whole RRF score.

2. **Any slash in the prompt disables the skill-versus-command tie-break and the breadth abstention** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1254 -- The command penalty is skipped whenever `promptLower.includes('/')` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1254-1255]; the Class C breadth abstention uses the same test [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1360]. The intent is a typed slash command, but a file path or "and/or" also contains a slash (probe: "fix bug in src/parser.ts" yields penalty 0). Recheck of generation-4 finding, still holds.
   Finding class: over-broad-predicate
   Scope proof: fusion.ts in scope.
   Affected surface hints: fusion.ts sort comparator, Class C abstention, lowInfoPrompt predicate at :1308.
   Case: the prompt "refactor src/scorer/fusion.ts" drops the command penalty, so a command candidate ties or beats the sk-code skill on raw score alone.

3. **The returned `ambiguous` flag is recomputed on the doctor-inclusive list** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1462 -- The code states that doctor bridges must not shape skill ambiguity and computes a doctor-free pass for that reason [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1272-1273], yet the result's `ambiguous` is `isAmbiguousTopTwo(ranked)` over the merged list that still contains doctor bridges [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1462]; `isAmbiguousTopTwo` looks at the passing-top cluster [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:94-97]. Recheck of generation-4 finding, still holds.
   Finding class: invariant-violation
   Scope proof: fusion.ts and ambiguity.ts in scope.
   Affected surface hints: fusion.ts final return, consumers of `ambiguous` in render and hooks.
   Case: a prompt where a passing doctor bridge sits within the cluster band of the top skill returns ambiguous=true even though the doctor-free pass found a single clear skill.

4. **Low-information abstention counts stop words as meaningful tokens** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1303 -- `meaningfulTokenCount` keeps every whitespace token longer than one character [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1303-1304], so function words count toward the three-token ceiling at :1305. Probe: "do it to me" (all stop words) counts 4 and is NOT treated as low-information, while "review it" counts 2. Recheck of generation-4 finding, still holds.
   Finding class: miscount
   Scope proof: fusion.ts in scope.
   Affected surface hints: fusion.ts lowInfoPrompt, any shared stop-word list in scorer/text.ts.
   Case: a four-word prompt made only of stop words escapes the low-information abstention, so strict callers get a routed recommendation for a prompt with no content.

## Traceability Checks

- spec_code: partial. The empty-scan comment ("preserving existing graph", skill-graph-db.ts:922) states the preservation intent the sub-root path violates; fusion.ts:1272-1273 states the doctor-free ambiguity intent :1462 violates. Packet spec docs not read this iteration (planned for iteration 3).
- checklist_evidence: notApplicable this iteration; the review target is a skill code tree with no checklist rows for these modules; recheck in iteration 3.

## Integration Evidence

- Tool surface: `skill_graph_scan` schema in .skilled/skills/system-skill-advisor/runtime/tools/skill-graph-tools.ts:28 (skillsRoot description).
- Consumer: scorer projection SQLite read at .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1402.

## Edge Cases

- Partial coverage: cross-skill-edges/, derived/extract.ts, provenance.ts, sanitizer.ts, skill-graph-queries.ts, bfs-traversal.ts and handlers/skill-graph/status.ts, validate.ts, query.ts were not read within the 24-call budget; carried to iteration 2.
- Production-dead code: routeSupersession, rollbackGraphMetadataFile, backfillDerivedV2 and readMixedVersion have no non-test caller (grep over runtime and hooks); only applyAgeHaircutToLane (via scorer/age-policy.ts) and lifecycleStatusForPath (projection.ts:1275) are live. Correctness defects in the dead modules (for example supersession.ts:33-36 substring mention matching) do not reach routing; recorded for the maintainability pass rather than as findings.
- Probes ran in /private/tmp/dr530/probe.mjs, reproducing the fusion.ts expressions literally; exit 0.

## Confirmed-Clean Surfaces

- .skilled/skills/system-skill-advisor/runtime/lib/derived/sync.ts: atomic write with tmp cleanup, idempotent compare ignoring generated_at, workspace containment check.
- .skilled/skills/system-skill-advisor/runtime/lib/lifecycle/archive-handling.ts: path lifecycle mapping consistent with filterDefaultRoutable.

## Ruled Out

- heldBelow naming one holder (fusion.ts:545-558): the named binding is the lowest-scored holder, which is the one whose ceiling (min) set the final score, as the comment at :542-544 states. Not a defect.
- NaN from age-haircut.ts:37-40 on a malformed timestamp: the only live caller passes `derivedGeneratedAt` validated through isoTimestampOrNull (projection.ts:1334). Not reachable.

## Next Focus

- Dimension: security plus Python/TS parity (as planned).
- Focus area: socket_hijack, R2-P1-001 trust default recheck, shadow log; then the correctness carry-over modules above if budget allows.
- Reason: planned order; correctness on cross-skill-edges and remaining skill-graph handlers is uncovered.
- Rotation status: correctness covered partially (1/4 dimensions).
- Required evidence: file:line plus a probe or test reading per finding.

Review verdict: CONDITIONAL
