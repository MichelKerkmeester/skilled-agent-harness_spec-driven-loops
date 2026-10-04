---
title: "Deep Research Strategy: Repo rule surfacing through the advisor"
trigger_phrases: []
---
# Deep Research Strategy: Repo rule surfacing through the advisor

## Research Topic

Decide, from repository evidence, whether `system-skill-advisor` (or another surface) should support and suggest repo rules from `.skilled/repo-rules/` without adding context the model does not need — naming each candidate's emission shape, silence condition, per-turn context cost, action-vs-topic match key, and cross-repo portability.

## Known Context

- The detached lineage is bound directly to `config.fanout_lineage_artifact_dir`; the `resolveArtifactRoot` node is intentionally skipped.
- All writes are bounded to this lineage directory. Spec writeback, parent/shared telemetry, continuity/memory save, and git staging are out of scope.
- `resource-map.md` was not present at initialization; this lineage emits its own resource map from the completed deltas.
- Today repo rules reach the model only through Gate 5 (`AGENTS.md` section 2), which fires on the first write of a session; the model matches its action against the trigger table in the root `REPO RULES.md`.
- Prior work that must be respected or explicitly overturned with evidence: `specs/hooks/022-smart-rule-injection`, `.skilled/hooks/injection-contract.md`, `REPO RULES.md` section 4, `specs/agents/010-repo-rule-system-integration/research`.

## Key Questions

- [x] How do repo rules reach the model today, and what did prior packets already decide or rule out about surfacing them?
- [x] What would candidate (a) — an advisor-brief pointer line in `render.ts` beside the Directives block — emit, cost per turn, and when would it stay silent? (constant 2nd directive; ~0 suppressed / ~150–250 chars per delivery episode; never self-silent; fails the 022 bar — refuse)
- [x] What would candidate (b) — adding `.skilled/repo-rules` to `CORPUS_ROOTS` for the Gate 1 trigger-index lookup — emit, cost, and match on (action vs prompt topic)? (rule rows in lookup output; silent on vocabulary miss but fires on read-only turns; topic-matched; recorded-decision reversal — refuse)
- [x] What would candidate (c) — an action-keyed PreToolUse advisory under `.skilled/hooks/` — emit, cost, and match on? (clones Gate-3 once-per-session marker; ≤4/13 rules tool-observable; near-zero cost strong form; weakest portability)
- [x] Is (d) no new surface the correct verdict, and what evidence would overturn it? (yes for model-facing surfaces — the coverage is a designed partition: Gate 5 + `AGENTS.md:261` reply-fired loader + resident floor at `:153`; overturned only by a measured Gate-5 miss rate)
- [x] Which candidates are portable across repos that share the rule corpus by symlink? (measured live: (a) clean; (b) misses sibling-local rules at root `repo-rules/`; (c) weakest — per-runtime invisibility traps)
- [x] What per-turn context cost does each candidate carry, measured or estimated from the code? ((a) ~0 suppressed / ~150–250 chars per delivery episode; (b) a candidate row per matching turn + <1% artifact growth; (c) ~1 line per session strong form)
- [x] Final matrix + verdict: does any surviving form satisfy the 022 bar AND match on action AND self-silence AND survive federation? (only strong-form (c) passes three of four; admission gated on unmeasured miss rate → verdict (d) plus CI coverage check as the real gap owner)

## Answered Questions

- Gate 5 (`AGENTS.md:93-101`) is the only door: first write of session, action-matched via `REPO RULES.md:40-52`; read-only turns never fire.
- 13 rule files, all carrying `trigger_phrases` frontmatter consumed today only by `sk-create-repo-rule`'s collision check (`retrieval-conventions.md:284`).
- Recorded prior refusals that bound this run: (1) `.skilled/repo-rules` deliberately excluded from trigger-index AND ripgrep corpus roots — "indexing them would surface a rule as a context candidate" (`retrieval-conventions.md:284`), enforced by `retrieval-coverage-parity.vitest.ts`; (2) the 022 prompt-time injection bar — an injection earns its slot by naming a gate-enforced prohibition, not by restating a loaded disposition (`022/decisions.md:21-24`); (3) advisory frequency must be measured from logs, never estimated (`022/decisions.md:33-36`); (4) rules do not do route selection (`REPO RULES.md:90-94`).

## What Worked

- Reading `retrieval-conventions.md`'s coverage table next to `corpus.mjs` surfaced the recorded exclusion decision the brief did not cite — the load-bearing document for candidate (b).
- `injection-contract.md` already catalogs every channel a candidate could ride, including per-runtime invisibility traps.

## What Failed

- Iteration 3's advise-rate figure was a tail estimate; iteration 4 corrected it to the measured ~1–33/day histogram — the 022 measurement rule applied to this lineage itself.
- No Gate-5 miss telemetry exists anywhere in `.skilled/logs/` or `.skilled/skills/.state/`, so the (d)-vs-(c)-strong call is bounded as a measurement gap rather than resolved by data.

## Exhausted Approaches

- Treating trigger-index inclusion as greenfield — it is a reversal proposal against a recorded decision plus a parity test.
- Estimating advisory fire rates — forbidden by the 022 measurement rule; costs must be read from code/logs.

## Ruled-Out Directions

- Prompt-vocabulary injection of rule content per se: refused wholesale by 022 (18/18); only forms naming a gate-enforced prohibition remain evaluable.
- Constant repo-rules directive in the advisor brief: restates resident Gate 5 text with no mechanical gate — fails both prongs of the 022 bar.
- Trigger-index inclusion and the refined-(e) rule-presenting variant: recorded-decision reversals whose failure mode is topic-matched surfacing on read-only turns; sibling-local rules measurably invisible.
- Weak-form (c) per-action classification at the tool boundary: ≤4/13 rules observable; riskiest commands already guarded.
- Advisor-scored rule recommendations: scorer kinds are `skill|command` only; pollutes the routing/rule layer boundary.

## Next Focus

Loop complete — 4/4 iterations, `maxIterationsReached`. Synthesis written to `research.md`. Follow-up candidates for the operator: (1) the once-per-session first-mutation Gate-5 reminder (strong-form c) if a miss is ever measured or the unmeasured risk is accepted; (2) a row-vs-fire coverage check in `create-repo-rule`'s verify step — the real fragility the evidence points to.
