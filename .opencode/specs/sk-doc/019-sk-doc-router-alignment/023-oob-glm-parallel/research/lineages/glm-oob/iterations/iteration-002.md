# Iteration 2: Cross-Domain Analogies — The Load-Balancer Health-Check Transfer

**Lineage:** glm-oob (cli-opencode / GLM-5.2)
**Iteration:** 2 of 5
**Agenda item:** #3 — what transfers from OS schedulers / IP routers / DNS resolvers / load balancers / human receptionists?
**Divergence charter:** do NOT collapse back into "weighted selection" — find the one primitive
routing doesn't already have. Iteration 1 stayed inside the routing domain; this iteration deliberately
imports from outside.

## Focus

Five analogies are on the agenda. Stress-test each for what it actually adds **beyond what
`hub-router.json` already does**. The hypothesis going in: most of them collapse to "weighted
selection" (which routing already has, even if every weight is the same). The lateral question is
which one transfers a **primitive routing lacks entirely.**

The five candidates:
1. OS scheduler (priority + preemption)
2. IP router (longest-prefix match)
3. DNS resolver (hierarchical cache with TTL)
4. Load balancer (weighted round-robin + health checks)
5. Human receptionist (ask, don't guess)

## Findings

### F1. Four of the five analogies collapse back to weighted selection; one does not.

Reading the five analogies against the live router surfaces:

- **OS scheduler → priority + preemption.** Maps to today's `weight` field. Pre-emption — a
  higher-priority mode interrupting a lower one mid-flight — has no router equivalent and is
  incoherent for a stateless one-shot routing decision (you cannot "pre-empt" a routing that
  already happened). **Adds nothing new.** The only OS-scheduler primitive that *would* transfer
  is *aging* (boosting starving modes), which is structurally identical to a learned-weight
  router (iteration 4's territory).
- **IP router → longest-prefix match.** Maps to today's `vocabularyClasses`: the prompt token
  sequence is matched against vocabulary entries, and the longest match wins. Today's router
  already does this implicitly (more specific class names beat less specific ones via the
  `classes` ordering). **Adds nothing new** — it just renames `vocabularyClasses` to "prefix
  table."
- **DNS resolver → hierarchical cache with TTL.** Two sub-primitives: hierarchy (resolver,
  authoritative) and cache with TTL. Hierarchy is exactly the advisor ↔ hub split (advisor is
  the recursive resolver, hub is the authoritative). The genuinely new piece is **TTL**:
  vocabulary entries that expire if not refreshed. Today `mode-registry.json` entries never
  expire — a stale entry is a *user-facing lie* under run-2's null-with-card fallback
  (thread G of `021/run2-archive/research.md`). TTL would auto-drain stale modes. **This is
  the same primitive as the load-balancer health check** (F2) reached via a different analogy —
  see F3.
- **Load balancer → weighted round-robin + health checks.** Weighted round-robin is exactly
  today's static-weight router. The new piece is the **health check**: each backend has a
  runtime liveness/readiness score, and routing weight adapts. Nothing in any `hub-router.json`
  has any feedback today (every `weight` is `4`; every vocab entry is static).
  **Adds something routing genuinely lacks.**
- **Human receptionist → ask, don't guess.** Maps to today's `defer` outcome. The receptionist's
  lateral primitive is not "ask" (defer already does that) but **triage protocol**: a fixed
  decision tree ("are you here for X? then Y; otherwise Z") that the receptionist executes
  deterministically rather than asking open-endedly. That is structurally identical to
  `bundleRules`. **Adds nothing new.**

So the only primitive that does not collapse to weighted selection or bundleRules is the
**runtime feedback signal** — the load-balancer's health check, equivalently DNS's TTL. Reaching
it via two independent analogies is mild cross-domain convergence.

[SOURCE: .opencode/skills/sk-doc/hub-router.json:11-35 (weight=4 on every signal)]
[SOURCE: .opencode/skills/sk-design/hub-router.json:25-83 (weight=4 on every signal)]
[SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md (thread G, A3)]

### F2. The lateral claim — every mode has a runtime health score, weights adapt.

Stress-test the load-balancer transfer seriously. Concrete shape:

- Each `(skill, mode)` carries a `health` record: `{ recentSuccessRate, recentTokenCost,
  recentLatencyP95, lastRefreshedAt }`.
- The router's effective weight is `staticWeight × healthMultiplier`, where `healthMultiplier`
  ranges 0.0 (drained) → 1.0 (full).
- Modes below a `healthFloor` are drained: their vocab still matches (so the prompt is heard),
  but the router defers with a card naming the drained mode and the reason.

What this *buys* that no static router can:

1. **A failing mode self-quarantines without a code change.** If `design-md-generator`'s
   playwright extraction starts 5xx'ing for a release cycle, the router drains it for that
   window instead of mis-routing URL-bearing prompts to a broken mode.
2. **Cost-awareness becomes routing-aware.** Today a prompt that matches two modes routes to
   whichever has the higher vocab score, even if one is 3× more expensive. With health
   accounting, "recent token cost" can fold into the multiplier.
3. **The drift problem run-2 named (thread G, A3) gets a runtime fix instead of a gate.** Run-2
   proposed *drift-validation as a gate* — a build-time check. Health checks make drift
   *runtime-visible*: a stale `mode-registry.json` shows up as degraded health before it
   becomes a user-facing lie.

[SOURCE: .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/run2-archive/research.md (thread G, A3)]

### F3. What breaks (four structural costs, none of which the load-balancer literature flags
because backends there do not argue back)

1. **Modes are not stateless backends.** A load balancer's health check probes `/healthz` and
   gets a deterministic 200/503. A skill mode's "health" is *prompt-dependent*: `design-audit`
   is healthy for a color-contrast check and unhealthy for a motion budget audit if the motion
   sub-packet has drifted. So health is `(mode, prompt-class)`, not `mode` — the state space
   explodes from N modes to N×P prompt-classes. This is the cost the analogy hides.
2. **Defining "success" requires a grader, and graders are expensive.** A backend's health is
   binary (did it respond?). A skill mode's success is "did it produce a useful artifact for
   this prompt" — which needs either an LLM grader (expensive, itself unreliable) or a proxy
   like "did the operator re-prompt within 30 seconds" (noisy). The router gains feedback only
   by paying for a grader.
3. **Cold-start is poisoned.** A new mode has no health history. Load balancers solve this with
   "slow start" (ramp up weight over time); but skill modes are not getting continuous traffic,
   so the ramp never completes. A new mode stays cold indefinitely unless the operator
   synthetic-seeds it.
4. **Health feedback invites Goodhart's law.** Once `recentSuccessRate` affects routing,
   mode authors will game it (e.g. a mode that declines hard prompts to protect its score).
   Load balancers do not have this problem because backends do not author themselves; skill
   mode authors do.

### F4. The genuinely radical transfer is not "health checks" — it is the *feedback channel itself*.

Stress-testing F2 against F3 shows the productive part is not the score, it is the **existence of
a feedback channel**. Today the router is open-loop: it emits a route, never learns whether it was
right. Even a degenerate feedback signal — "operator re-prompted within 30 seconds, yes/no" —
gives the system its first closed-loop data point. That data point does not require any health
score, any grader, any cold-start handling. It just requires **the router to emit a `routeId` and
the runtime to record whether the next operator turn re-entered the router.**

This is the lateral answer to the agenda: the primitive that transfers is **closed-loop routing**.
The health-check analogy pointed at it; the destination is smaller than the analogy suggested.
And closed-loop routing is exactly what iteration 4 (learned/adaptive) needs as input. So F4 is
a bridge, not a destination.

### F5. Implications for the run-1/run-2 verdict.

Run-1/run-2 assumed an open-loop router — every recommendation in `021/run2-archive/research.md`
is a *configuration* change (set `defaultMode`, change `defaultResource`, encode
`defaultResourceSemantics`). A closed-loop router changes the *kind* of recommendation possible:
instead of "what should the default be," the question becomes "what default minimises re-prompt
rate." That is a measurable, falsifiable question — exactly the run-2 critique that the flips are
"directional-pending-measurement." The health-check / feedback-channel transfer supplies the
measurement infrastructure run-2 said was missing.

## Negative knowledge — what this iteration ruled out

- **Ruled out: OS scheduler as a source of routing primitives.** Priority = today's weight;
  pre-emption is incoherent for one-shot routing; aging collapses to learned weights (iter 4).
- **Ruled out: IP longest-prefix match as a source of routing primitives.** Today's
  `vocabularyClasses` is already longest-prefix match by another name.
- **Ruled out: receptionist "ask, don't guess" as a source of routing primitives.** Already
  shipped as `defer`; the triage protocol is `bundleRules`.
- **Ruled out: full health-score routing (F2) as the immediate destination.** F3's four costs
  make it a multi-release programme, not a refactor. The bridge (F4) is the productive next step.

## Sources Consulted

- All hub `hub-router.json` files (uniform `weight: 4`, no feedback field anywhere).
- `021/run2-archive/research.md` threads G (A3 drift) and D (the falsifiable-measurement gap).
- `021-default-mode-policy-research/spec.md` §3 ("the falsifiable live experiment run-1 said it
  was routing around").
- General (no live URL): load-balancer health-check literature — weighted round-robin with
  passive health checks (Envoy/Nginx shapes); DNS resolver RFC 1034 hierarchical cache + TTL.
  These are background knowledge, not citable artefacts; they shaped which primitive was looked
  for but the *applicability* findings come from the live router surfaces above.

## Assessment

- **newInfoRatio:** 0.80 — five analogies surveyed, four collapsed to existing primitives (mild
  re-derivation), but the fifth (closed-loop routing, F4) and the bridge to iteration 4 are
  net-new to this packet. Slightly below 1.0 because the survey shape echoes familiar domain
  mapping.
- **novelty justification:** F4 (feedback channel as the genuine transfer, smaller than the
  health-check analogy) and F5 (closed-loop re-frames run-2's measurement gap) are not in any
  prior packet; the four collapse-to-existing findings are confirmatory.
- **confidence:** high on F1 (sourced); medium on F4 (design inference, unmeasured).
- **status:** `insight` — survey iterations look low-novelty but F4 reframes the agenda.

## Reflection

- **What worked:** pushing each analogy past "sounds nice" to "what primitive does it add that
  routing lacks." Four-of-five collapsing is itself a finding (F1): routing has absorbed most
  static-selection primitives already; the missing axis is feedback.
- **What failed:** trying to make the load-balancer transfer literal (F2). The state-space
  explosion (F3.1) killed it as an immediate design.
- **Carries forward to iter 4:** F4's `routeId` + re-prompt signal is the *exact input* a
  learned/adaptive router needs. Iteration 4 should pick up from F4, not from F2.

## Recommended Next Focus

**Iteration 3: No-wrong-door / handoff routing + routing as dialogue (agenda #4 + #5).**
Iteration 1's carry-forward (CF1) asked whether *deferral* is even the right primitive, or whether
*handoff* is. Iteration 2 added weight to that question: closed-loop routing (F4) needs a signal,
and a handoff is a *typed* signal ("mode A accepted, then transferred to mode B") — strictly more
informative than "operator re-prompted." So iteration 3 should stress: if any mode could accept any
request and then hand off, does the keep-vs-null distinction dissolve? And does handoff supply the
closed-loop signal F4 needs?
