---
title: "Iteration 4: Where else in .skilled the same judgment would pay off"
trigger_phrases: []
---
# Iteration 4: Where else in .skilled the same judgment would pay off

## Focus

The full inventory of Jev judgment call sites across `.skilled`, split by question type, and what the Pi
transport actually pays off in each: call volume, critical-path position, dependency shape, and
observability.

## Actions Taken

- Grepped every `.cjs`, `.mjs`, `.ts` under `.skilled` for `jev choice|noul|score` construction and read
  each call site's subcommand and role.
- Cross-read the 038 follow-up list of the 13 runtime-tree callers and checked which are `choice`
  (transport-admissible today) against `noul` and `score`.
- Checked for existing native-classifier users across `.skilled` and read the `cli-pi` classifier
  guidance for Pi workers.
- Read the dispatch audit's classifier classification rule and the opted-in callers' recording sizes.

## Findings

1. The direct judgment inventory (excluding tests, benchmarks and the transport itself): seven `choice`
   call sites — `deep-improvement/.../score-verdict-fallback.cjs:783`,
   `system-deep-loop/runtime/scripts/score-severity-replay.cjs:1070`,
   `system-skill-advisor/.../score-jev-tiebreak.mjs:1005`,
   `system-skill-advisor/.../score-suggested-order.mjs` (same construction),
   `system-spec-kit/.../score-debug-next-check.mjs:733`,
   `system-spec-kit/.../score-track-narrowing.mjs:1327`,
   `system-spec-kit/.../score-alignment-suggestion.ts:1083`; at least seven `noul` call sites —
   `sk-doc/shared/scripts/cite-drift-scan.mjs:1081`, `sk-doc/sk-create-goal/scripts/score-goal-lint.cjs:313`,
   `system-deep-loop/runtime/scripts/score-severity-replay.cjs:1118`,
   `system-deep-loop/runtime/scripts/score-fanout-pairs.cjs:985`,
   `system-deep-loop/deep-review/scripts/score-residue-flagger.cjs:1093`,
   `system-spec-kit/.../score-completion-claims.mjs:784`,
   `system-skill-advisor/.../score-jev-tiebreak.mjs:928`, plus `score-d4-agreement.cjs`; and one `score`
   call site — `system-deep-loop/runtime/scripts/score-stop-rater.cjs:1090`
   [SOURCE: grep over .skilled for the four subcommand strings, per-file lines above].

2. The two callers already wired are both offline measurement harnesses in sk-doc, and no production
   caller has adopted the transport; the 038 scope named cli-classifier, sk-doc and sk-communication as
   eligible but only these two opted in. The operational payoff in live workflows is therefore still zero
   [SOURCE: specs/.../038-pi-classifier-transport-integration/implementation-summary.md §The callers]
   [SOURCE: specs/.../038-pi-classifier-transport-integration/spec.md §3 In Scope].

3. The largest single-call-volume surface is the routing-accuracy pair. `score-suggested-order.mjs` and
   `score-jev-tiebreak.mjs` are the 019-style harnesses that issue one `choice` per order per row — 333
   calls for a 111-row replay — and they are exactly what produced the 037 baseline. Re-routing those 333
   calls through Pi saves roughly 25 s of wall time per replay (mean 332 → 260 ms) and $0.0075 in Pi cost
   per replay at the catalog price; the harness is operator-run, not on a live path
   [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs:1005]
   [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/live-run.stdout.txt replay counts]
   [SOURCE: iteration 2 findings 5-7].

4. The deep-loop runtime scorers sit closest to workflow critical paths but are blocked by type:
   `score-severity-replay.cjs` (`choice` + `noul`), `score-fanout-pairs.cjs` (`noul`),
   `score-residue-flagger.cjs` (`noul`) and `score-stop-rater.cjs` (`score`) each need their own
   keep-rule run before the transport can admit them, because the shipped transport decides only for
   `choice` and REQ-003 fixes that boundary for the phase
   [SOURCE: specs/.../038-pi-classifier-transport-integration/spec.md REQ-003]
   [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs `choiceRequestFrom`].

5. The payoff the transport actually delivers is operational, not epistemic: both routes ask the same
   model family and agree 95.5 percent, so no caller gets better answers; what changes is ~22 percent
   mean latency, one fewer child process, and a route that works when the `jev` binary or its provider
   credential is missing but a Pi credential exists
   [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/live-run.stdout.txt]
   [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs module header].

6. A structural gap: `dispatch-audit.mjs` classifies `jev choice|noul|score|run` — and `jev-mcp` — as
   `cli-classifier` dispatches, so the audit observes classifier judgment only when it leaves the process
   as a jev process. A Pi-native call inside a script is invisible to that audit; adopting the transport
   inside dispatch-tracked scripts silently narrows what the audit sees
   [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:236-241].

7. For Pi workers specifically, the native surfaces are already documented: codemode
   `models.classify()` (up to four concurrent per script), extensions `ctx.modelRegistry.classify()`,
   and the SDK; `cli-pi/SKILL.md` rule 13 points workers at these and rule 10 keeps an answer as
   evidence, never permission. The only code in `.skilled` that actually calls a native classifier
   today is the benchmark scorer and the transport module itself
   [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:165-176]
   [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:219,232]
   [SOURCE: grep for `getModelOfType|ModelRuntime` across .skilled].

8. Two surfaces are out of scope on inspection: `score-stop-hint.cjs` replays a stop-rater report offline
   and reads the `jev` column, it does not spawn the classifier, so there is no call to route; and
   `dispatch-audit.mjs:236` only classifies a jev invocation, it makes no judgment call of its own
   [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/score-stop-hint.cjs:37-57]
   [SOURCE: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:232-241].

9. Ranking the adoption payoff on the recorded evidence: (a) the routing-accuracy harnesses own the
   volume (333 calls/replay) but run occasionally; (b) `score-debug-next-check` and `score-goal-lint` sit
   in interactive authoring loops with small call counts and would gain latency only; (c) the deep-loop
   runtime scorers would gain critical-path latency but are `noul`/`score` and need measurement first;
   (d) no surface gains accuracy anywhere, because the route is a same-model re-route
   [SOURCE: per-finding call sites above; latency and cost from iteration 2].

10. One more candidate class the inventory surfaced but the 038 list does not cover: `sk-doc`'s own
    `noul` callers (`cite-drift-scan.mjs`, `score-goal-lint.cjs`) are outside the 13-caller list yet
    reachable by the same seam; if a `bool` arm is ever measured, they are the cheapest early adopters
    (one call per document question, no option-order machinery)
    [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1081]
    [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs:313].

## Ruled Out

- "Adopting the transport improves judgment quality somewhere": the same model answers both routes;
  measured agreement between them is the only quality number that exists, and it says they differ on 5
  of 111 rows.
- "The biggest win is at the deep-loop runtime scorers right now": they are `noul`/`score`; the shipped
  transport will not admit a single one of their calls today.
- "The two wired callers prove production adoption": both are offline harnesses; the live workflow
  payoff was zero at the 038 close.

## Next Focus

Iteration 5 — Q5: what a default-on integration would need, cost and risk (the switch flip and its
blast radius, gate hardening, identity reruns, observability, credential and failure-path economics,
and the risk register for a default change).

## Sources

- grep inventory over `.skilled` (`jev choice|noul|score` call construction), files and lines cited above
- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`
- `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md`
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/{spec.md,implementation-summary.md}`
- `specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run.stdout.txt`
