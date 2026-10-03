---
title: "Iteration 5: What a default-on integration would need, cost and risk"
trigger_phrases: []
---
# Iteration 5: What a default-on integration would need, cost and risk

## Focus

Turning the opt-in switch into a default: the exact code and contract changes, the gate hardening a
default path requires, the cost it moves, and the risk register whose first entry is the verdict's
one-row margin.

## Actions Taken

- Read the switch, the per-call runtime construction and the gates in the transport, and the CLI doc's
  switch table that would change.
- Counted the callers and checked what a default flip touches (module contract, two callers' recorded
  switch-off bytes, the cli-jev doc table, any future consumer).
- Checked the Hermes mirrors (skill-only, no code copies) so propagation scope is bounded.
- Assembled cost from the recorded run and the catalog prices, and the failure-path latency from the
  transport's gate-and-fallback structure.

## Findings

1. The switch flip itself is one function, but the contract around it changes in three places at once:
   `resolveTransport` returns `jev` when the value is unset and would have to return `pi` (or a new
   `auto` mode) instead; the module header's "CLI is the default and the fallback" sentence becomes
   false; and the switch table in `cli-jev/SKILL.md` that lists "unset, `''`, or `jev` -> the `jev`
   CLI" must be rewritten. The two wired callers' byte-identical switch-off recordings would become
   the pre-change baseline of a *different* default, so the 038 invariant evidence would not survive
   as a running contract [SOURCE:
   .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:59-65]
   [SOURCE: .skilled/skills/cli-classifier/cli-jev/SKILL.md:245-250]
   [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs module header lines 6-13].

2. A default path would pay the runtime construction and gates on every call unless they are cached:
   `createPiRuntime` is called per call inside the Pi branch, and the model and credential gates run
   per call after it. Nothing today caches the runtime, the model, or the availability list, because the
   opt-in path is rare; the default path would make that overhead the common case. The measured 260 ms
   mean is the benchmark's runtime, created once for the whole run, not the transport's per-call cost,
   and the transport itself has never had a live call (038 ran no smoke call)
   [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs:349-366]
   [SOURCE: specs/.../038-pi-classifier-transport-integration/implementation-summary.md Known Limitations 5].

3. A default flip needs identity pinning first. The gate resolves any Pi version with no check, while
   the verdict's scope statement says a later Pi or Jev identity reruns the whole keep rule before any
   use; a default-on route would silently ride an upgrade that the verdict does not cover. The CLI side
   already demonstrates the pattern: its gate pins `jev 0.6.2` and skips the arm on any other version
   [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs:25,1119-1124]
   [SOURCE: specs/.../037-pi-native-classifier-transport/implementation-summary.md Known Limitations 5].

4. A default flip also needs quiet fallback semantics. Today a skip line means "Pi was asked for and did
   not answer"; on a default path it would print on every call on a machine without Pi credentials or
   the package, turning a diagnostic into noise and, in the callers' streaming outputs, into a line
   before every CLI result. Either the fallback goes quiet by default or a preflight decides the route
   once per process [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs `piSkipLine`
   and the four gate branches].

5. The cost a default-on integration moves is small and metered: about $0.0022 per 100 calls, ~$0.0075
   for the 333-call replay shape, $0 at the unmeasured free arm; the CLI side records no cost at all, so
   a default flip trades an unrecorded cost for a metered one. The real budget line is the rerun the
   identity rule demands (one replay plus operator time) and the latency of the failure path, where a
   failed Pi attempt is followed by the full CLI call
   [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/live-run/report.json]
   [SOURCE: iteration 2 findings 5-7].

6. The failure path doubles the worst-case latency of a choice call: gate failure or backend failure
   abandons the Pi attempt after whatever it consumed (up to the caller's own timeout, 30 s in the
   scorers) and then spawns the CLI with its own full timeout. There is no circuit breaker and no retry
   inside the transport, so a persistently failing Pi path spends the Pi attempt on every call before
   falling back [SOURCE: .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs gate branches
   and spawnCli timeout].

7. Observability has to land before a default: instrumented callers write `backend: "jev"` even when Pi
   answered, per-call usage is not recorded anywhere, and dispatch auditing no longer sees the judgment
   once it stops leaving the process. All three are today's-known limits; a default flip makes them the
   normal case instead of the opt-in case
   [SOURCE: specs/.../038-pi-classifier-transport-integration/implementation-summary.md Known Limitations 1]
   [SOURCE: iteration 3 findings 4 and 10] [SOURCE: iteration 4 finding 6].

8. The verdict itself is the first risk: adopt is separated from keep-cli by one row of 111, and the two
   outcomes' confidence intervals overlap almost entirely ([89.8, 98.5] vs [88.6, 98.0]). A default
   based on it inherits that margin; the honest precondition is either a wider or repeated same-day
   measurement or an explicit decision to accept a noisy 95.5
   [SOURCE: iteration 3 finding 1] [SOURCE: iteration 1 finding 1].

9. Data path changes for every caller under a default flip: the CLI asks `official` `jev-1.13.0` while
   the Pi route asks `typesafe/jev-1.13` through OpenRouter, a third-party gateway. Same nominal model,
   different processor and different credential store; a default-on decision is a decision about where
   every prompt goes, and it should be made as such rather than as a latency tweak
   [SOURCE: specs/.../037-pi-native-classifier-transport/scratch/live-run/report.json `pi.provider`/`cli.provider`]
   [SOURCE: specs/.../037-pi-native-classifier-transport/spec.md:77].

10. Blast radius of the flip is bounded today and grows later: exactly two files require the module
    (both sk-doc harnesses), the Hermes mirrors carry skill docs only and no code copy, and the module
    is the cli-classifier hub's shared transport that future callers will adopt. The flip is one line
    now and a fleet-wide behavior change once adoption grows, so the switch should be staged (for
    example a third `auto` value that prefers Pi when the gates pass and is quiet otherwise) rather than
    a hard default change
    [SOURCE: grep for `jev-transport` requires across .skilled]
    [SOURCE: `.hermes/skills/cli-classifier/` holds only `SKILL.md`].

11. Default-on is defensible only as a monitored commitment, not a one-time flip: pin the identities in
    the gate, rerun the keep rule on any identity change, keep the CLI as the fallback forever, keep an
    escape value, and record backend/usage on every call so the default can be audited after the fact
    [SOURCE: iterations 3 and 4 findings above; .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:232].

## Ruled Out

- "Flip the default now; the margins will hold": the verdict is one row from keep-cli with overlapping
  intervals, the transport has never made a live call, and the Pi version is unpinned — three separate
  reasons a default flip today would run on evidence thinner than the flip's own blast radius.
- "Default-on costs nothing because the per-call price is tiny": per-call dollars are tiny, but the
  failure path doubles worst-case latency, identity reruns cost a replay plus operator time, and the
  data path changes for every prompt.
- "Keep it opt-in forever": the 038 follow-up list is unscheduled and only two harnesses adopted, so
  the measured verdict is stranded unless a later phase either grows adoption or flips the default.

## Next Focus

Synthesis — merge all five iterations into `research/research.md`: the ranked recommendations with
file:line evidence and the measured result, the ruled-out directions, and the open questions for the
next phase to decide.

## Sources

- `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`
- `.skilled/skills/cli-classifier/cli-jev/SKILL.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`
- `specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/{spec.md,implementation-summary.md,scratch/live-run/report.json}`
- `specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/implementation-summary.md`
- `.hermes/skills/cli-classifier/` (skill-only mirror check)
