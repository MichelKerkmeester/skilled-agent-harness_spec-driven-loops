# Iteration 5: traceability, playbook overlay, spec_code rerun and R1-P2-005

## Dispatcher

- Run 5 of 7 (extended run, generation 5, lineageMode completed-continue, session 2026-11-23T21:41:17.101Z). Native executor, LEAF.
- Prompt pack: `review/prompts/iteration-5.md`. Worktree HEAD `52f0bcb9a98`. The built `dist/` scorer files are newer than their sources (05:27:46 against 05:27:17), so the probe ran current code.
- Operator focus: the advisor logic in `runtime/` and `hooks/`. This pass covered it through the scorer's seed bound and ambiguity cluster, the daemon trust gate, the skill-graph scan, the disable switch and the hook fallback, all reached from the playbook claims.
- The strategy's Exhausted Approaches listed the heldBelow direction as BLOCKED after iteration 1. This pack reopened it with a new method, a probe of generation 4's case, so the entry was rewritten instead of retried as before.

## Dimension

Traceability. Three jobs: (1) the `playbook_capability` overlay, never run before; (2) a rerun of core `spec_code` on its two open contradictions; (3) settling the contested generation-4 finding R1-P2-005 with a probe.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:448,493-559,776-786,1014-1026,1194-1240`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:8-9,46-130`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:283,301,600-610`
- `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:246-248,318-332`
- `.skilled/bin/system-skill-advisor-launcher.cjs:68-80` (context, outside the target)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:912-926,970-980`
- `.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:40-62`
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:60-90`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:138-140`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:495`
- `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:135-136`, `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts:117-119,453`
- All 55 scenario files under `.skilled/skills/system-skill-advisor/manual-testing-playbook/` (context; the playbook sits outside reviewScopeFiles).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **heldBelow names only the lowest holder, so a withheld holder leaves the held target free to make the top a coin flip** -- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545 -- A target held by two typed-command seeds is capped at the lower seed's score minus 1e-6 (`fusion.ts:529-541`). `heldBelow` then records only that lower seed (`fusion.ts:545-557`). The cluster exception at `ambiguity.ts:68` drops the target only when `heldBelow` names the passing top. When the lower holder is itself withheld from passing, the higher holder is the top, and the target sits within `AMBIGUITY_MARGIN` (0.05, `ambiguity.ts:8`) of it only because of the cap. The pair is then reported as a coin flip, which is the case the exception exists to stop. The withhold that makes this reachable is `withholdMentionedCommands` (`fusion.ts:1014-1026`). It sets `passes_threshold: false` on a command the prompt only mentions, and leaves its score and its cap on other rows unchanged. This settles R1-P2-005: generation 4's literal case does not misfire, but this narrower case does.
   - Finding class: boundary-defect (single-valued binding where the guard needs the holder set).
   - Scope proof: `fusion.ts` and `ambiguity.ts` are in reviewScopeFiles. The probe imported the built `dist/runtime/lib/scorer/fusion.js` and `ambiguity.js` with no change to the target.
   - Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:545-557`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:68`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:153`, `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:301`, plus the Python twin if it mirrors the exception.
   - Case: a prompt runs typed command A and only mentions typed command B. Both seed graph support into a skill T that neither owns. B is withheld, A is the top at 0.80, and T is capped to 0.789999 with heldBelow B. `isAmbiguousTopTwo` returns true on A and T alone. The probe gives `ambiguous:true` against `ambiguousIfTargetExcluded:false`. The end-to-end prompt was not run, so reachability past the withhold is inferred from `fusion.ts:1014-1026`.

## R1-P2-005 Probe

`/private/tmp/dr532-iter5/probe-heldbelow.mjs` called `boundGraphSupportBySeedWithHolders` with two slash-anchored seeds, `cmd-a` and `cmd-b`, that both hold `sk-target`. Graph support was 0.3 each, graphWeight was 1, and confidence was set equal to the bounded score. It then ran `isAmbiguousTopTwo` and `applyAmbiguity` on the result. Exit 0.

| Case | Scores A / B / T (unbounded) | heldBelow T | Ambiguous | Ambiguous with T removed | Reading |
|---|---|---|---|---|---|
| C1 gen-4 exact | 0.80 / 0.79 / 0.85 | cmd-b | true | true | The flag is unchanged. B ties A on its own. T only joins `ambiguousWith`. |
| C2 far apart | 0.90 / 0.70 / 0.95 | cmd-b | false | false | No effect. |
| C3 tie | 0.80 / 0.80 / 0.85 | cmd-a | true | true | Binding equals the top, so the exception drops T. |
| C4 margin edge | 0.80 / 0.7500005 / 0.85 | cmd-b | true | true | T falls outside the margin when B is inside it. |
| C5 B withheld | 0.80 / 0.79 / 0.85 | cmd-b | true | false | The flag flips on T alone. |

Generation 4's claim says the target's 1e-6 gap falls inside the margin. That gap is to the lower holder. The gap to the top is the A–B gap plus 1e-6, so whenever T clusters on score, B does too (C1, C4). In generation 4's literal case the coin flip is real, between A and B. The only extra in that case is T listed in the wire `ambiguousWith`, and the rendered partner still picks B, because B sorts first (`render.ts:603-607`). Confidence follows the bounded score (`fusion.ts:1196,1212-1213`), so the confidence path at `ambiguity.ts:74-76` gives no second route in C2. C5 is the reachable misfire, recorded above.

## Traceability Checks

- `spec_code` (core, hard): **partial**, rerun on both contradictions, which still hold at HEAD.
  - Trust default: the comment at `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:324-326` says a call with no caller block sees an untrusted caller. `.skilled/bin/system-skill-advisor-launcher.cjs:74-75` sets `SYSTEM_SKILL_ADVISOR_TRUST_DEFAULT: 'trusted'` when the environment does not, and `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts:248` honors that value. So the default is consumed, not just declared (G5-I2-P2-001).
  - Graph wipe: the empty-root guard at `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:921-922` states the intent to preserve the graph. A one-skill root still passes the non-empty check and reaches `deleteMissingNodes` at `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:976`. `.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/scan.ts:45-60` guards only workspace escape (G5-I1-P1-001).
- `checklist_evidence` (core, hard): notApplicable. The target has no checklist rows.
- `playbook_capability` (overlay, advisory): **pass**, with method limits. The sweep (`/private/tmp/dr532-iter5/playbook-sweep.sh`) extracted every code path, env var and tool name from the 55 scenarios and checked each against `runtime/`, `hooks/` and `.skilled/bin/`. 45 scenarios came back clean. The 10 flagged scenarios were triaged:
  - False positives from the regex: `advisor_runtime`, `advisor_bench` and `advisor_regression` are substrings of the `skill_advisor_*.py` names, and `advisor_running` is a shell function in the scenario.
  - `advisor_unavailable` is emitted at `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:138-140` and `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:495`.
  - The disable switch names the scenario sets are read through `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-80`. `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is listed in `.skilled/hooks/shared/hook-flags.cjs:76`. `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED` is only unset, never claimed.
  - The goal-plugin paths exist under `.skilled/hooks/goal/lib/`, and they are not advisor capabilities.
  - Spot reads: the ambiguity-partner rendering is at `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:603-607`, and the shadow sink appends at `.skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:135-136`.
  - This was a name-existence sweep plus spot reads, not a run of each scenario, so `pass` means no scenario names a capability the code lacks.

## Integration Evidence

- `.skilled/bin/system-skill-advisor-launcher.cjs:74-75` (the launcher that starts the daemon) is the surface that consumes the trust default. It was read as context for `spec_code`.
- `.skilled/hooks/shared/hook-flags.cjs:76` (the shared flag registry) is where `advisor-disabled.ts` gets its switch names.

## Edge Cases

- `.skilled/skills/system-skill-advisor/manual-testing-playbook/operator-h5/degraded-daemon.md:139` cites `.opencode/skills/system-skill-advisor/runtime/tests/__fixtures__/errors.ts`, which does not exist. Its line 151 quotes an old error naming a `z_archive` path. This is doc drift outside reviewScopeFiles, the same kind as R3-P2-002, so it is not registered. The capability it tests, degraded status reported as `freshness: 'unavailable'`, is backed at `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:370-391`.
- In generation 4's literal case (C1), the held target joins the wire `ambiguousWith` of both holders while the flag is unchanged. That is a payload detail, folded into the finding above.
- Generation 4's literal example (`/deep:review` against `/deep:research`) has `system-deep-loop` as the owner of both commands. `answersSameRoute` (`ambiguity.ts:50-60`) would drop that owner from the cluster anyway. The finding therefore needs a target that neither holder owns (inferred, not probed).

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:529-541`: the cap loop only lowers scores and settles chains in at most one pass per held target, as its comment says (C1-C5 are all consistent).
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1196,1212-1213`: confidence derives from the bounded score, so a cap cannot leave a stale confidence behind.

## Ruled Out

- R1-P2-005 as generation 4 stated it: whenever the target clusters on score, the lower holder is already in the cluster, so the ambiguity flag is unchanged. Probe rows C1 and C4 show this. The defect that remains is narrower and is recorded as G5-I5-P2-001.
- The `playbook_capability` drift: no scenario names a runtime or hooks capability that the code no longer provides.

## Next Focus

- Dimension: maintainability.
- Focus area: the Python fallback's mirror of the seed bound and the ambiguity exception in `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`. Check whether G5-I5-P2-001 has a twin there, and compare INTENT_BOOSTERS against PHRASE_BOOSTS table by table, which iteration 3 left undone.
- Reason: G5-I3-P2-001 already shows hand-copied predicates, and a fix to `fusion.ts:545-557` must land in both languages.
- Rotation status: all four dimensions covered. The extension passes clear debt.
- Blocked/productive carry-forward: do not reopen parity suites, the playbook sweep, the handler or lifecycle scans, or the symlink path. Productive: probes on `dist/` exports with constructed inputs.
- Required evidence: the Python line numbers for the bound and the exception, and a constructed case run through both languages if budget allows.

## Verdict

Two P1s remain active (G5-I1-P1-001, G5-I2-P1-001). This pass added one P2 and no P0 or P1.

Review verdict: CONDITIONAL
