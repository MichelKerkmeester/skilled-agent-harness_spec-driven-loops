# Iteration 6 — RQ5: Ranking signals — extension score table vs advisor lane fusion

Focus: what the extension ranks skill metadata on, and whether any of its signals fills a gap in
the advisor's lexical or derived lanes.

## The two rankers, side by side

- **Extension** [CONFIRMED]: single weighted-substring table — name==query +200, name prefix +80,
  name substring +60, description substring +35, per-query-token: name-equality +45 / name
  substring +24 / description +8 / word-boundary haystack +4
  (`context/pi-skill-orchestrator-main/src/search.ts:19-38`). Zero-score rows are dropped, ties
  break alphabetically (`search.ts:49-50`). No synonym expansion, no calibration, no uncertainty.
- **Advisor** [CONFIRMED]: five live lanes with fixed weights — `explicit_author` 0.42, `lexical`
  0.28, `graph_causal` 0.13, `derived_generated` 0.12, `semantic_shadow` 0.05, plus an
  env-flagged BM25 shadow lane (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8-29`).
  The lexical lane expands synonyms and adds curated category hints
  (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:9-40`, `:80-85`), caps
  evidence at 5 hits and clamps the lane at 1.0 (`.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:69`).
  Literal skill-name mentions score `explicit:<variant>` at raw 1.0
  (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:317-321`).
  Ranking is deterministic: adjusted score → RRF rank or confidence → `localeCompare` tie-break
  (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:749-776`; same at `:306`).

## Findings

### F6-1 — Name-mention dominance is a short-circuit in the extension, a weighted vote in the advisor

- **Orchestrator mechanism** [CONFIRMED]: `name === q` at +200 outweighs every other signal
  combined (`context/pi-skill-orchestrator-main/src/search.ts:27`) — a literal skill name in the
  query is guaranteed top-1.
- **Advisor counterpart** [CONFIRMED mechanics / INFERRED failure]: a literal skill name raises
  the explicit lane (`explicit.ts:317-321`) whose weight is 0.42
  (`lane-registry.ts:9`); there is no documented short-circuit that pins a named skill to rank 1 —
  the calibration layer has only the derived-dominant pin at 0.72
  (`.skilled/skills/system-skill-advisor/references/scoring/advisor-scorer.md:109`). Whether a
  multi-lane pile-up (lexical + graph + derived) can outrank a clean name mention is not shown by
  the code alone [INFERRED — would confirm with a fusion replay where the prompt contains one
  exact skill id and a competitor skill carries three lane hits].
- **Proposed change**: a name-mention pin — when the prompt contains an exact installed skill id
  (the explicit lane already computes `skillNameVariants`), that skill is emitted as top-1 and
  flags `passes_threshold`, mirroring the framework rule "user names a skill → cite and proceed".
- **Benefit**: routing precision on the highest-intent prompt class there is.
- **Cost**: one branch before fusion output.
- **Risk**: prompts that merely mention a skill name in prose ("compare with sk-git") would pin the
  wrong top-1; mitigate by requiring the mention to sit near an invocation verb or slash form —
  the extension's own detection patterns are exactly that shape
  (`context/pi-skill-orchestrator-main/src/dependencies.ts:28-34`).
- **Verdict: ADOPT** — the extension's one genuinely load-bearing ranking signal is name
  dominance, and the advisor only has it as a weighted vote.

### F6-2 — The extension's raw score table fills no advisor lane gap

- **Orchestrator mechanism** [CONFIRMED]: the +200/+80/+60/+35/+45/+24/+8/+4 table
  (`context/pi-skill-orchestrator-main/src/search.ts:27-36`) is unbounded magnitude with no
  calibration and no evidence report — `rankSkillRecordsBySearch` returns bare records
  (`search.ts:41-53`).
- **Advisor counterpart** [CONFIRMED]: the same information (name shape, description tokens) is
  covered by lexical token overlap over id/name/domains/intent-signals/keywords
  (`lanes/lexical.ts:68-78`) plus the curated explicit lane, and every score is clamped,
  calibrated into confidence/uncertainty (`advisor-scorer.md:105-109`) and reported with evidence
  (`lanes/lexical.ts:87-90`). The advisor additionally has synonyms, category hints, graph
  propagation, derived triggers and embeddings — a strict superset.
- **Proposed change**: none. Record the negative result so no future phase "simplifies" the scorer
  toward substring weights.
- **Benefit**: prevents a regression dressed as simplification.
- **Cost**: none.
- **Risk**: none.
- **Verdict: REJECT** — importing the extension's ranker signals would subtract capability.

### F6-3 — Deterministic tie-breaks already exist and should stay an invariant

- **Orchestrator mechanism** [CONFIRMED]: equal scores fall back to `localeCompare` on name
  (`context/pi-skill-orchestrator-main/src/search.ts:50`).
- **Advisor counterpart** [CONFIRMED]: identical discipline — `fusion.ts:306` and the final rank at
  `fusion.ts:749-776` end in `localeCompare`. This determinism is what makes the Pi brief de-dup
  cache workable: the cache suppresses only an exact same-content brief
  (`.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:140`), so any nondeterministic
  ordering would silently re-add brief tokens every turn (cf. F2-1).
- **Proposed change**: none; document determinism as a tuning invariant (a weight change is fine,
  an unstable sort is not).
- **Benefit**: protects the dedup cost lever identified in iteration 2.
- **Cost**: none.
- **Risk**: none.
- **Verdict: REJECT** (as an adoption) — the mechanism is already present on the advisor side;
  it is recorded here as a cross-check, not a change.

## Ruled out this iteration

- Adopting the BM25 shadow lane's promotion loop as an "extension idea" — unrelated to the
  extension; the shadow lane is advisor-internal
  (`lane-registry.ts:21-29`, `:33-36`).
- Tuning any lane weight — out of scope (research only), and no evidence here says the weights are
  wrong.

## Claim ledger

| Claim | Status | What would confirm |
|-------|--------|--------------------|
| Extension name-equality +200 dominates its ranker | CONFIRMED | — (`search.ts:27`) |
| Advisor name mentions raise the explicit lane at raw 1.0, weight 0.42, no rank-1 pin | CONFIRMED | — (`explicit.ts:317-321`, `lane-registry.ts:9`; absence of a pin in `advisor-scorer.md` §8) |
| Multi-lane pile-up can outrank a clean name mention | INFERRED | Fusion replay with one exact id mention vs a three-lane competitor |
| Advisor lanes strictly subsume extension signals | CONFIRMED | — (lane coverage read directly) |
| Deterministic tie-breaks exist on both sides | CONFIRMED | — (`search.ts:50`, `fusion.ts:306,749-776`) |
