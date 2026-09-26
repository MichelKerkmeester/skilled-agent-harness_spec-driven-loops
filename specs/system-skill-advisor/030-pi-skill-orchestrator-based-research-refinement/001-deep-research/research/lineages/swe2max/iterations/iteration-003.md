# Iteration 003 — Advisor read path: five-lane scorer, brief rendering, output bounds

## Focus

The advisor's scoring and rendering internals: how a prompt becomes a recommendation,
what the brief actually contains, and where its bounds sit. Advisor side of RQ1, RQ4,
RQ5, RQ6; groundwork for RQ2.

## Actions Taken

- Read `ARCHITECTURE.md` (166 lines) — daemon + CLI front door, subsystem map.
- Read `runtime/handlers/advisor-recommend.ts` (595 lines) — recommend handler.
- Read `runtime/lib/scorer/lane-registry.ts` (111 lines) — lane weights.
- Read `runtime/lib/scorer/lanes/lexical.ts` (118 lines) — lexical lane internals.
- Read `runtime/lib/scorer/lanes/graph-causal.ts` (173 lines) — edge propagation.
- Read `runtime/lib/skill-advisor-brief.ts` (563 lines) — brief builder + fail-open.
- Read `runtime/lib/render.ts` (465 lines) — final brief renderer + sanitizer.

## Findings

### F12 — The advisor's model-visible output is one line plus a directives block [CONFIRMED]

`renderAdvisorBrief` emits `Advisor: {freshness}; use {topLabel} {conf}/{unc} pass.` —
the top recommendation only — capped at 80 tokens (320 chars) via
`capText(tokenCap * 4)` (`runtime/lib/render.ts:79-82, 120-127, 435-440`). On top-2
ambiguity it renders both candidates up to 120 tokens
(`runtime/lib/render.ts:421-433`, `AMBIGUOUS_TOKEN_CAP`/`MAX_TOKEN_CAP` 120,
`runtime/lib/skill-advisor-brief.ts:110-111, 132-135`). A `Directives:` block with the
comment-hygiene rule is appended to every brief (`render.ts:101, 438`). The daemon's
`advisor_recommend` returns `topK` (default 3) structured recommendations
(`advisor-recommend.ts:507`), but the prompt-visible brief shows only top-1 (+1 on
ambiguity). The orchestrator returns up to 5 (max 8) name+description rows instead —
the advisor is already far tighter on the prompt boundary.

### F13 — Scoring is five fused lanes, not substring matching [CONFIRMED]

`scoreAdvisorPrompt` fuses `explicit_author` 0.42, `lexical` 0.28, `graph_causal` 0.13,
`derived_generated` 0.12, `semantic_shadow` 0.05
(`runtime/lib/scorer/lane-registry.ts:8-19`; `ARCHITECTURE.md:117`). Weights are
env-overridable (`SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`, `lane-registry.ts:37-71`) and a
shadow bm25 lane exists for promotion experiments (`lane-registry.ts:21-29`). The
orchestrator's name-exact/prefix/substring signals (`search.ts:27-37`) all live inside
the advisor's lexical lane as token-overlap + synonym expansion + +0.38 category hints
(`lanes/lexical.ts:9-40, 60-106`) — but the advisor works at token granularity; the
orchestrator's raw substring signal (`name.includes(q)`) has no direct advisor
equivalent.

### F14 — Graph edges already influence ranking but produce no bundle [CONFIRMED]

`graph_causal` propagates seed scores across typed edges — `enhances` 0.55, `siblings`
0.35, `depends_on` 0.35, `prerequisite_for` 0.30, `conflicts_with` −0.35 — BFS depth 2,
breadth 4, decay 1/(depth+1), floor 0.05 (`lanes/graph-causal.ts:28-34, 42-43, 91-95`).
So `depends_on`/`enhances` DO affect *which* skill is recommended (a dependency can
surface on its own propagated score), and `conflicts_with` penalizes — a signal the
orchestrator lacks entirely. But the output is a name: no dependency-closure loading
anywhere in the recommend path (`advisor-recommend.ts:457-530`). The runtime that acts
on the recommendation loads nothing extra; each runtime loads a skill body when the
model invokes it.

### F15 — The push design's failure surface is silent absence [CONFIRMED]

`buildSkillAdvisorBrief` returns status `fail_open` with `brief: null` on subprocess
failure or any uncaught exception (`skill-advisor-brief.ts:486-504, 550-562`);
freshness `absent`→skipped, `unavailable`→degraded, only `live`/`stale` emit a brief
(`skill-advisor-brief.ts:196-206, 344-373`; `render.ts:388-395`). A `shouldFireAdvisor`
policy gate can suppress firing entirely (metalinguistic mentions →
skill-name suppressions) (`skill-advisor-brief.ts:407-427`). `ARCHITECTURE.md:133`
states every adapter bounds the call with a timeout and fails open — matching the
observed `fail_open / CLI fallback timed out` Pi log: push failure = zero routing
signal, invisible to the model, no retry possible in-turn.

### F16 — The renderer is a prompt-boundary sanitizer [CONFIRMED]

`sanitizeSkillLabel` unicode-folds, rejects newlines and instruction-shaped labels
(`SYSTEM:`, `ignore previous instructions`, code fences…) (`render.ts:83-85, 129-145`);
the renderer ignores free-form reason text entirely (`render.ts:377-383`). On the
daemon path, `matchedDocs` is allowlisted to `references|assets/**/*.md`, max 3
(`advisor-recommend.ts:257-273`), and `compiledRoute` enrichment runs as a 5s-timeout
subprocess per hub (`advisor-recommend.ts:336-368`). Non-live freshness paths return
empty recommendations rather than stale guesses (`advisor-recommend.ts:160-192`).

### F17 — Answer-side cost asymmetry for RQ1 [CONFIRMED]

The orchestrator removes the catalog AND hides the search index; the advisor hides the
index (SQLite graph) but pushes a ~80-token verdict on every fired prompt — plus the
runtime's own eager catalog where it exists (Pi's `<available_skills>`, ~2.6 KB+ here).
They are complementary boundaries, not substitutes: an advisor brief does not remove
Pi's native catalog, and the orchestrator's stub does not rank.

## Questions Answered

- RQ1 (advisor side): the brief is ~80–120 tokens — additive to any native catalog, not
  a replacement. Catalog cost on non-Pi runtimes is the runtime's, not the advisor's.
- RQ4: the advisor acts on `depends_on`/`enhances`/`conflicts_with` edges as score
  propagation at recommend time, but never returns a dependency bundle.
- RQ5: advisor lane set fully enumerated; orchestrator signals map into the lexical lane.
- RQ6: advisor bounds = 1–2 visible names, 80/120-token cap, sanitized labels, no
  descriptions in the brief at all.

## Questions Remaining

- RQ2/7: hook adapters (`hooks/pi/prompt-advisor.ts`, `hooks/claude/user-prompt-submit.ts`,
  `hooks/lib/skill-advisor-cli-fallback.ts`, `.skilled/plugins/system-skill-advisor.js`),
  `prompt-policy.ts`, `subprocess.ts` retry/timeout mechanics — next iteration.
- Whether the skill graph stores dependency edges usable for a bundle return.

## Ruled Out

- `projection.ts` (1246 lines) deep-read: lane contract sufficient from registry + lanes.
- `executor-delegation.ts`, `feedback-calibration.ts`, `beta-reliability.ts`: calibration
  internals, not needed for the mechanism comparison.

## Next Focus

Iteration 4: hooks and fallback mechanics — `hooks/pi/prompt-advisor.ts`,
`hooks/claude/user-prompt-submit.ts`, `hooks/lib/skill-advisor-cli-fallback.ts`,
`.skilled/plugins/system-skill-advisor.js`, `runtime/lib/subprocess.ts`,
`runtime/lib/prompt-policy.ts` (RQ2 failure modes, RQ7 advisor side).
