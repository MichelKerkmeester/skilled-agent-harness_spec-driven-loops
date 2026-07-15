# Improvement Iteration 002 — Mode architecture & boundaries

- **Model**: opus-4.8 (claude2, read-only)
- **Seat**: i02
- **top_pick**: Make the parent-skill validator enforce a per-skill routing drift-guard (and fail-closed when a non-canonical skill's advisorRouting is inert) — it converts the mode-boundary contract from prose-only to machine-enforced, which is the precondition for the /create:parent-skill pattern to be safely reused for skill #2
- **improvements**: 4

## Analysis

I have enough evidence across the registry, all packets, the advisor maps, the drift-guard test, the parent-skill validator, and the runtime convergence math. Here is my analysis.

---

# i02 — Mode Architecture & Boundaries (READ-ONLY improvement research)

## Verdict up front

The **factoring is largely right and, in its hardest parts, near-optimal.** The shared-hub / per-packet split is genuinely earned: each runtime-loop mode has materially different convergence math, signals, thresholds, and tool permissions (verified below), so flattening them would be wrong. The weaknesses are **not in the factoring — they're in naming consistency and boundary *enforcement* for the *next* skill.** The 155 epic's whole thesis is "this pattern is reusable via /create:parent-skill," and the validator that's supposed to prove a new skill is wired correctly currently gives false comfort. That's where the leverage is.

---

## Finding 1 — The parent-skill validator can't actually verify a non-canonical skill's mode-routing is wired (false "all invariants passed") · **P1**

This is the highest-leverage mode-boundary issue. The mode-boundary contract for a *new* parent skill is only as real as the tooling that enforces it, and right now it isn't enforced.

- `parent-skill-check.cjs:59-60` hardcodes the drift-guard path to the **canonical** test: `DRIFT_GUARD_TEST = '…/routing-registry-drift-guard.vitest.ts'` (deep-loop-workflows' own).
- Check **4a** (`parent-skill-check.cjs:283-288`) then just asserts *that file exists*. For a brand-new skill `foo-workflows`, 4a passes because **deep-loop-workflows'** test exists — `foo-workflows` has no drift-guard of its own and 4a never looks for one.
- Check **4b** (`parent-skill-check.cjs:300-301`) explicitly **skips** every non-canonical skill, emitting `"the drift-guard test (4a) is authoritative for <basename> — skipping"`.
- But the comment at `parent-skill-check.cjs:52-53` claims *"for any other target the per-skill drift-guard test is the authoritative parity guard."* **The code never checks that a per-skill test exists.** The comment describes intent the code doesn't implement.

Net: a new parent skill ships `advisorRouting` blocks that are inert (no Python `DEEP_ROUTING_MODE_BY_KEY` / TS `DEEP_MODE_BY_CANONICAL` entry — `skill_advisor.py:2320`, `aliases.ts:96`) **and** unguarded, while `/doctor:parent-skill` reports green. The drift-guard test itself is hardwired to one registry (`routing-registry-drift-guard.vitest.ts:32`), so it can't catch skill #2 either.

**Improvement:** derive the expected per-skill drift-guard path from the target basename and make 4a fail-closed if it's absent (or skip 4b *and* 4a honestly, surfacing `INERT-UNTIL-WIRED`). Optionally generalize the drift-guard test into a parametrized helper that iterates all `*/mode-registry.json` so one test covers every parent skill.
- **Effort M · Risk low · Preserves invariants** (only tightens the validator; no runtime/convergence/identity change).

---

## Finding 2 — The `ai-council` grandfather has a live doc-vs-reality contradiction, and the exception is documented-in-prose but not machine-guarded · **P2**

The grandfather is real and *defensible to keep* — but it currently carries a stale claim and a silent-divergence risk for future skills.

The naming surfaces split three-vs-three:
- `ai-council` (bare): folder `ai-council/`, agent file `ai-council.md` (`name: ai-council`, all 3 runtimes), registry `agent: "ai-council"` (`mode-registry.json:71`), `workflowMode: ai-council`.
- `deep-ai-council`: SKILL.md frontmatter `name: deep-ai-council` (`ai-council/SKILL.md:2`), `packetSkillName`, `legacyAdvisorId` (`mode-registry.json:76-78`), command `/deep:ai-council`.

Every other mode is uniform (`folder == SKILL name == agent == deep-<mode>`, verified). The **doc bug**: `ai-council/SKILL.md:432-433` lists as a *met* success criterion *"Runtime mirrors use `@deep-ai-council` as the primary agent identity"* — but the actual dispatched identity is `@ai-council` (registry `agent` field + the three agent files). The rename was deliberately *not* completed (`ai-council/SKILL.md:366` NEVER-add-shims, `:386` ESCALATE-if-caller-depends-on-`ai-council`), so a full folder/agent rename is **high-regret** (3 mirrors + dispatch + possible active consumers) for pure uniformity — **don't do it.**

**Improvement (cheap, low-regret):** (a) correct `ai-council/SKILL.md:432` to `@ai-council`; (b) make the grandfather explicit *in code* — add a `folder ≠ packetSkillName` allowlist assertion to `parent-skill-check.cjs` so the one sanctioned exception passes and any **new** silent divergence fails. Converts a prose footnote (`mode-registry.json:15`) into a guarded invariant.
- **Effort S · Risk low · Preserves invariants.**

---

## Finding 3 — Mode discoverability is asymmetric: 3 of 7 modes have no advisor map entry; nothing asserts "unscored ⇒ has a command" · **P2/P3**

Routing classes (from `mode-registry.json`): `lexical` = research/review/ai-council (3, Python-scored + both maps); `alias-fold` = agent-improvement (1, TS map only, not lexically scored); `metadata` = context (1, no map); `command-bridge` = model/skill (2, no map). So **4 of 7 are not lexically advisor-scored, and 3 of 7 have no advisor map entry at all.**

This is mostly *correct by design*: the deep-router exists to disambiguate the three genuinely-confusable modes (`skill_advisor.py:2304-2306`: "iterate findings until convergence" is dangerous because each loop's semantics differ), and `context` is inward/distinct with its own command + hub trigger phrases (`graph-metadata.json` derived.trigger_phrases: "gather codebase context", "context loop", "reuse catalog"). Improvement lanes are mutating and command-gated, so command-bridge is right.

**On the explicit sub-question — "should context be advisor-routable?":** **No, keep it metadata-routed.** Adding it would grow the hardcoded Python regex + map + drift-guard surface for a mode that isn't confusable with research/review and is already skill-level discoverable. This area is near-optimal.

**The actual gap:** nothing asserts a mode is reachable *somehow*. A future mode could be `metadata`-class with no command and be undiscoverable. **Improvement:** add a registry invariant to the validator — every mode is either lexical/alias-fold **or** declares a resolvable `command`. Cheap insurance on the discoverability boundary.
- **Effort S · Risk low · Preserves invariants.**

---

## Finding 4 — `deep-improvement` hosting 3 modes: considered a split, recommend **KEEP** (cohesive via real shared seams) · **P3**

I examined whether the 3-lane packet should split. It should not — the cohesion is structural, not cosmetic:
- All three share three pluggable seams (candidate-source, dispatcher, scorer) and a single entrypoint `loop-host.cjs --mode` (`deep-improvement/SKILL.md:300-302`); the agent-improvement path stays byte-identical with no flag (`:41`).
- `reduce-state.cjs` and `promote-candidate.cjs` are shared with mode-tagged records (`:305`). Splitting would *fork* these shared scripts or create cross-packet script deps — **more** coupling, not less.

The three improvement modes share the loop-host dispatch and packet-level guardrails. **No split.** Optional P3: keep an eye on the 564-line SKILL.md density (the lane-scoped smart-router already mitigates it). Near-optimal.
- **Effort N/A (no action) · Risk n/a · Preserves invariants.**

---

## Finding 5 — The 3-tier discriminator is sound; `backendKind`↔`runtimeLoopType` "redundancy" is intentional 2-consumer separation, not waste · **P3 (no action)**

`backendKind == runtime-loop-type` ⟺ `runtimeLoopType != null` (perfect correlation across all 7 modes), so `backendKind` looks partly derivable. But the two fields serve **two different consumers**: `runtimeLoopType` is the literal `--loop-type` CLI arg validated independently by `convergence.cjs:310-311` (`research|review|council|context`), while `backendKind` drives the hub's dispatch switch and — critically — identifies the three improvement lanes that use the separate `improvement-host` backend. Collapsing them would couple the runtime contract to the router. **Keep as-is — near-optimal.** (The `explicit null is load-bearing, never inferred` rule, SKILL.md:84, is the right call and worth preserving.)

---

## Honest near-optimal callouts (no change recommended)

- **research vs review are NOT too similar.** Direct evidence they're genuinely different and correctly justify separate packets: research composite = questionCoverage·0.30 / claimVerification·0.25 / invertedContradictions·0.15 / diversity·0.15 / depth·0.15 with `sourceDiversity`+`evidenceDepth` *blocking guards* (`convergence.cjs:120-130, 213-221`); review composite = dimensionCoverage·0.25 / findingStability·0.20 / p0ResolutionRate·0.25 / evidenceDensity·0.15 / hotspotSaturation·0.15 with `dimensionCoverage`+`p0` blocking (`convergence.cjs:143-149, 250-255`). Different signals, weights, thresholds, blocking guards, *and* tool grants (research: WebFetch/WebSearch/memory; review: code_graph_query, no web). The shared-hub/per-packet boundary is working exactly as intended.
- **One-identity keystone holds:** exactly one `graph-metadata.json` at the hub (verified by `find`), validator enforces it both ways (`parent-skill-check.cjs:138-188`).

---

## Open questions for the owner

1. For Finding 1's fix: should the per-skill drift-guard become a **parametrized test that auto-discovers all `mode-registry.json` files** (one test, all parent skills), or one hand-authored test per skill (what the scaffolder must emit)? The former closes the gap permanently; the latter matches the current "hardcoded for speed" philosophy.
2. Is there *any* live consumer still dispatching the council seat by the `deep-ai-council` name (vs `ai-council`)? If provably none, Finding 2 could escalate from "fix doc + guard" to a clean rename — but only with that evidence.
3. Are the improvement lanes (command-bridge) *intended* to stay advisor-invisible by NL (command-only), or is mode-level NL routing a future goal? That decision determines whether Finding 3 stays a P3 invariant or becomes real advisor work.

===RESEARCH-JSON===
{"angle":"mode architecture & boundaries","improvements":[{"title":"Make parent-skill validator enforce a PER-SKILL routing drift-guard instead of hardcoding the canonical one","rationale":"4a checks only that deep-loop-workflows' own drift-guard exists and 4b skips all non-canonical skills, so a NEW parent skill passes green with inert, unguarded advisorRouting blocks — the comment claims a per-skill guard is authoritative but the code never checks one exists; this is what makes the whole reusable-pattern thesis safe or unsafe","evidence":".opencode/commands/doctor/scripts/parent-skill-check.cjs:52-60,283-288,300-301; routing-registry-drift-guard.vitest.ts:32","effort":"M","risk":"low","preserves_invariants":true,"priority":"P1"},{"title":"Fix stale ai-council @deep-ai-council doc claim and machine-guard the folder!=packetSkillName grandfather via an allowlist","rationale":"SKILL.md §7 claims @deep-ai-council is the primary agent identity but the real dispatched agent is @ai-council (registry + all 3 agent files); the grandfather is fine to KEEP (rename is high-regret) but should be corrected in docs and enforced in code so no future skill silently diverges","evidence":".opencode/skills/deep-loop-workflows/ai-council/SKILL.md:2,432-433; mode-registry.json:15,71,76; .opencode/agents/ai-council.md:2","effort":"S","risk":"low","preserves_invariants":true,"priority":"P2"},{"title":"Add a registry discoverability invariant: every mode is lexical/alias-fold OR declares a resolvable command","rationale":"4 of 7 modes are not lexically advisor-scored and 3 of 7 have no advisor map entry; this is mostly correct by design (context stays metadata-routed, improvement lanes are command-gated) but nothing prevents a future mode from being both unscored AND command-less = undiscoverable","evidence":"mode-registry.json:28-31,92-97,110-113,125-128,141-144; skill_advisor.py:2304-2318","effort":"S","risk":"low","preserves_invariants":true,"priority":"P3"},{"title":"Keep deep-improvement as one 3-lane packet (do NOT split)","rationale":"the three lanes share candidate/dispatcher/scorer seams plus loop-host/reduce-state/promote-candidate with mode-tagged records, so a split would fork shared scripts and raise coupling, and all three reuse loop-host dispatch","evidence":".opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md:300-305,41; mode-registry.json:131-144","effort":"S","risk":"low","preserves_invariants":true,"priority":"P3"}],"top_pick":"Make the parent-skill validator enforce a per-skill routing drift-guard (and fail-closed when a non-canonical skill's advisorRouting is inert) — it converts the mode-boundary contract from prose-only to machine-enforced, which is the precondition for the /create:parent-skill pattern to be safely reused for skill #2","open_questions":["Should the drift-guard become one parametrized test auto-discovering all mode-registry.json files, or one hand-authored test per skill emitted by the scaffolder?","Is any live consumer still dispatching the council seat as deep-ai-council rather than ai-council (would unlock a clean rename vs keep-grandfather)?","Are the command-bridge improvement lanes intended to stay advisor-invisible to natural language, or is mode-level NL routing a future goal?"]}
===END===

## Improvements (structured)

```json
[
  {
    "title": "Make parent-skill validator enforce a PER-SKILL routing drift-guard instead of hardcoding the canonical one",
    "rationale": "4a checks only that deep-loop-workflows' own drift-guard exists and 4b skips all non-canonical skills, so a NEW parent skill passes green with inert, unguarded advisorRouting blocks \u2014 the comment claims a per-skill guard is authoritative but the code never checks one exists; this is what makes the whole reusable-pattern thesis safe or unsafe",
    "evidence": ".opencode/commands/doctor/scripts/parent-skill-check.cjs:52-60,283-288,300-301; routing-registry-drift-guard.vitest.ts:32",
    "effort": "M",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P1"
  },
  {
    "title": "Fix stale ai-council @deep-ai-council doc claim and machine-guard the folder!=packetSkillName grandfather via an allowlist",
    "rationale": "SKILL.md \u00a77 claims @deep-ai-council is the primary agent identity but the real dispatched agent is @ai-council (registry + all 3 agent files); the grandfather is fine to KEEP (rename is high-regret) but should be corrected in docs and enforced in code so no future skill silently diverges",
    "evidence": ".opencode/skills/deep-loop-workflows/ai-council/SKILL.md:2,432-433; mode-registry.json:15,71,76; .opencode/agents/ai-council.md:2",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P2"
  },
  {
    "title": "Add a registry discoverability invariant: every mode is lexical/alias-fold OR declares a resolvable command",
    "rationale": "4 of 7 modes are not lexically advisor-scored and 3 of 7 have no advisor map entry; this is mostly correct by design (context stays metadata-routed, improvement lanes are command-gated) but nothing prevents a future mode from being both unscored AND command-less = undiscoverable",
    "evidence": "mode-registry.json:28-31,92-97,110-113,125-128,141-144; skill_advisor.py:2304-2318",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P3"
  },
  {
    "title": "Keep deep-improvement as one 3-lane packet (do NOT split)",
    "rationale": "the three lanes share candidate/dispatcher/scorer seams plus loop-host/reduce-state/promote-candidate with mode-tagged records, so a split would fork shared scripts and raise coupling, and all three reuse loop-host dispatch",
    "evidence": ".opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md:300-305,41; mode-registry.json:131-144",
    "effort": "S",
    "risk": "low",
    "preserves_invariants": true,
    "priority": "P3"
  }
]
```
