---
title: "Research Synthesis: Parent-Hub defaultMode Policy"
description: "Should a parent hub's routerPolicy.defaultMode point at a child mode or be null? Synthesis of 4 iterations (3 GPT-5.6-SOL + 1 Fable-5 diverse lens). Verdict: 1 keep (sk-prompt), 4 flip to null (cli-external, system-deep-loop, mcp-tooling, sk-design) — but the reframe matters: defaultMode is a defer-time suggestion + catch-all anchor, never an auto-route. Plus a simplified encoding rec and a live finding (sk-design still carries the over-emission bug)."
trigger_phrases:
  - "default mode policy synthesis"
  - "should hubs default to null verdict"
  - "defaultMode defer-time suggestion"
importance_tier: "important"
contextType: "research"
---

# Research Synthesis: Parent-Hub `defaultMode` Policy

**Method:** 4 iterations — 3 by GPT-5.6-SOL xhigh (semantics → decision rule + per-hub verdicts → encoding), 1 by Fable-5 as an adversarial diverse lens. (The runtime blocked SOL iters 4–5 on a workflow module-path bug; the 3 SOL iterations converged and the Fable lens independently verified them.)

---

## Bottom line

The verdict survives adversarial review — **keep 1, flip 4** — but the *reason* changed, and that changes the fix.

| Hub | Verdict | Confidence | Why |
|---|---|---|---|
| `sk-prompt` | **KEEP** | 0.85 | Its default is the catch-all scoring anchor and was deliberately re-affirmed this session with route-gold receipts. Not "provisional" — it's the one default with fresh evidence. |
| `cli-external-orchestration` | **FLIP → null** | 0.80 | The correct suggestion is *runtime-dependent* (each executor refuses self-dispatch), so no static default can be right. Also neutralize its `defaultResource`. |
| `system-deep-loop` | **FLIP → null** | 0.90 | Fully vestigial — prose already defers, no identity class, `defaultResource` is the neutral README. A zero-behavior-change truth reconciliation. |
| `mcp-tooling` | **FLIP → null** | 0.85 | It's *already* the defer-with-suggestion pattern; the `defaultMode` field just misstates it. Keep the chrome-devtools hint via its existing fallback-only `defaultResource`. |
| `sk-design` | **FLIP → null** | 0.75 | But null alone is insufficient — it also has `hub-identity` on all 6 modes (the over-emission bug), which must move to discovery-only classes. |

---

## The reframe (the most important finding)

`defaultMode` is **not an auto-route**. No hub in the fleet auto-executes a child on a zero-signal request — every one already *defers* (some with a suggested child). So "keep vs flip" was never a choice between auto-routing and deferring; nobody auto-routes.

What a non-null `defaultMode` actually is, on a keyword-routed hub, is **two things**:
1. A **defer-time suggestion pointer** — "if I have to ask, I'll lean toward this child."
2. A **catch-all scoring anchor** — the default mode is the one place the generic `hub-identity` vocabulary lives, so hub-generic words (like the bare word "prompt") score *one* mode instead of co-firing all of them. This is exactly the over-emission mechanism the whole fleet route-gold program fixed this session.

Because of #2, on a well-built hub most "generic" requests never reach the zero-signal branch at all — they *score* the default. So the decision-theoretic "expected loss of guessing vs deferring" framing SOL built its rule on targets a branch that's rare by construction. The fleet's real, *measured* routing failure was on the scored path (six hubs blocked by over-emission), not the zero-signal branch.

---

## Deterministic-benchmark fact (confirmed line-for-line)

On a zero-signal request, a named-child default and `null` are **indistinguishable in the benchmark replay** — both produce `intents: []` and `workflowMode: null`; the *only* difference is a `defaultApplied` telemetry flag, and that flag means "a default is *configured*," not "the child was *selected*." So today's exact-set gold literally cannot tell a keep from a flip. (`router-replay.cjs:342-350`.)

---

## The decision rule (refined)

- **Default prior: defer-with-suggestion.** For a keyword-routed hub it strictly dominates both naked-defer (same safety, better UX) and auto-default (same UX hint, no mis-route) — no traffic corpus needed.
- **Keep a non-null default only when it earns its keep** on *both* jobs: it's a safe lean for the plausible alternatives, AND it's serving as the catch-all anchor. sk-prompt passes both; the other four fail one or both.
- SOL's formal expected-loss inequality is directionally right but *unfalsifiable in practice* (no zero-signal corpus exists) and unnecessary — the archetype rule below is the enforceable version.

---

## Recommendations

### A. Router changes (per hub — each flip is a TWO-field decision, not one)
1. **sk-prompt** — keep as-is (it's the reference keyword-routed hub). Optionally close a minor unreachable pseudocode hole in its SKILL.md fallback branch.
2. **system-deep-loop** — flip `defaultMode: null`. Zero behavior change (metadata is dead). Safest flip.
3. **mcp-tooling** — flip `defaultMode: null`; keep the suggestion via its already-fallback-only `defaultResource`. Makes metadata match authored behavior.
4. **cli-external-orchestration** — flip `defaultMode: null` AND neutralize / mark fallback-only its `defaultResource` (else the cli-opencode bias survives in the resource channel).
5. **sk-design** — flip `defaultMode: null` **and** move `hub-identity` off all 6 modes to discovery-only classes. *Live finding:* sk-design currently carries the same over-emission bug fixed elsewhere this session; it escaped route-gold only because it has no routing-gold scenarios. This is the highest-value flip because it fixes a real latent defect.

> Every non-null→null flip must also settle the `defaultResource` channel — flipping `defaultMode` alone can silently keep the child bias.

### B. Encoding — reject the heavy `zeroSignalPolicy` object; do the minimal delta instead
Iteration 3 proposed a new `zeroSignalPolicy` object + a 9-field `expected_route` tuple. Fable showed ~70% already ships. The minimal, enforceable delta:
1. **Canonize a third archetype: "defer-routed keyword hub"** (`defaultMode: null`, `hub-identity` as discovery-only, suggestion via fallback-only `defaultResource` — the mcp-tooling pattern). Today the canon blesses only *keyword-routed* (non-null default) and *detection-routed* (sk-code). The four flips create keyword hubs with null defaults, which the schema doesn't yet describe — without this third archetype the freshly hardened template will quietly pressure future authors back toward named defaults.
2. **Rename `defaultApplied` → `defaultConfigured`** (resolves the "configured vs selected" naming tension) and make it gold-assertable — the one new assertion that closes the keep-vs-null observability gap.
3. **Require `defaultResourceSemantics: "fallback-only"`** whenever `defaultMode` is non-null.
4. **One zero-signal route-gold fixture per hub**, whose gold matches its declared archetype. Fixtures are the evidence burden; prose `corpusRef`/`costModelRef` fields would go stale.
5. **Normalize the shipped defer-gold** `workflowMode` representation (currently `null` in one fixture, `[]` in another).

---

## Where SOL and Fable agreed vs differed

- **Agreed:** the replay semantics; the same five verdicts; that the named defaults were introduced by bulk scaffold/merge commits (the configuration is the hypothesis, not evidence); that mcp-tooling's metadata contradicts its behavior.
- **Fable refined:** the reframe (defer-time suggestion + catch-all anchor, not auto-route); sk-prompt's keep is *under-claimed* not provisional (it has same-day receipts); the vestigial-vs-backed `defaultResource` split (SOL never checked `defaultResource`); cli's static-default is *unrepresentable* (runtime-dependent); sk-design needs the hub-identity move; the encoding is over-engineered.

---

## Honest scope

- 3 SOL iterations (converged) + 1 Fable diverse lens = 4 of the requested 5; the runtime blocked SOL iters 4–5 (environmental workflow bug on resume, not a research gap).
- All verdicts are **proposals** — changing a shipped `defaultMode` is a live-routing behavior change. sk-design's hub-identity fix is the one with a confirmed defect behind it; the other flips are truth-reconciliation (metadata matching already-authored defer behavior).
- No corpus of real zero-signal traffic exists; the recommendation deliberately routes around needing one (archetype + fixtures, not statistics).
