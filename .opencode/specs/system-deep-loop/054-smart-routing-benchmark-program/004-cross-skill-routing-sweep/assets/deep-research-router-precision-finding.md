# Finding: deep-research router over-activates on generic keywords

> Discovered while attempting the anti-circularity fixture strengthening (Sonnet Finding 1).
> Two findings: a real (low-severity) router-precision defect, and a methodology gap in the
> fixture path that blocks expressing it as a scored test.

## Finding 1 — over-activation on borrowed generic keywords (reproducible)

deep-research's `INTENT_SIGNALS` includes ordinary words that fire outside any research context.
Four unrelated prompts each mis-route to a research intent:

| Prompt (unrelated to research) | Routes to | Offending keyword(s) |
|--------------------------------|-----------|----------------------|
| "What's our go-to-market strategy for the Q3 product dashboard rollout?" | `STATE` (6 res) | `strategy`, `dashboard` |
| "Reconcile the customer registry against the billing lineage records." | `STATE` (6 res) | `registry`, `lineage` |
| "Refactor the focus-trap handling in the file upload component." | `ITERATION` (4 res) | `focus` |
| "Analyze the diminishing returns on our paid ad spend this month." | `CONVERGENCE` (4 res) | `diminishing returns` |

Reproduce: `routeSkillResources({ skillRoot: '.opencode/skills/system-deep-loop/deep-research', taskText: '<prompt>' })`.

**Severity: low.** deep-research's router only fires *after* the parent hub has already routed to
deep-research, so an unrelated prompt reaches it only inside an active research session — the blast
radius is intra-session precision, not hub-level misrouting.

**Fix (deferred — a genuine precision/recall tradeoff):** narrow `STATE`'s `strategy`/`dashboard`/
`registry`/`lineage` and `ITERATION`'s `focus`/`delta` toward compound, research-scoped forms
(`research strategy`, `findings registry`, …). The cost is recall: inside a research session those
bare words *do* legitimately name research artifacts (the research dashboard, the findings registry),
so narrowing them trades in-session recall for cross-domain precision. That tradeoff is an operator
call, not an obvious win — deferred to a scoped follow-up rather than unilaterally changing the
shipped router. The T1 gold this sweep shipped stays valid either way (the T1 STATE scenario still
routes via `state file` + `jsonl`).

## Finding 2 — the fixture path cannot score generic-keyword over-activation

The anti-circularity fixture path (`--fixtures-dir`) enforces `contamination-lint`, which bans every
`INTENT_SIGNALS` keyword from a fixture prompt. A negative that probes "keyword X over-fires in an
unrelated context" must *contain* keyword X — so the lint rejects it as `contaminated-fixture`
(score 0 for contamination, not for the over-activation being measured). The framework's negatives
are built for keyword-*free* unrelated prompts (which a pure keyword router trivially suppresses),
not for generic-keyword collisions. So this finding is documented as a reproducible probe here rather
than as a committed fixture. Strengthening the harness to score generic-keyword over-activation (e.g.
a separate over-activation lane that exempts the probed keyword from the lint) is a benchmark-engine
follow-up.

## Why the T2/T3 fixture strengthening was not landed here

For a keyword-only leaf router, decontaminated T2 holdouts route to nothing deterministically (a
`knownRouteGap` that documents keyword-dependence rather than exercising judgment — the deterministic
fixture path has no live channel), and the most valuable T3 negatives are blocked by Finding 2. The
real anti-overfit test needs a *live* evaluation of decontaminated prompts, which the current
harness does not score as a gate. The honest Mode-B framing (consistency, not judgment) recorded in
`implementation-summary.md` remains the proportionate response for this packet.
