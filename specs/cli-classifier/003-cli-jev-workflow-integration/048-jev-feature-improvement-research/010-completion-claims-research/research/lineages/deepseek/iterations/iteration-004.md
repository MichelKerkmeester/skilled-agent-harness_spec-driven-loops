# Iteration 4: Q4 - where else in .skilled the same judgment pays off

## Focus

Locate the surfaces where this completion-claim judgment (does this text claim completion / should this gate fire) is already consumed or could be scored with the same machinery, with file:line evidence and a payoff ranking.

## Findings

### F4-01 - Five wired surfaces share one core

The same sentinel core serves Claude Stop (.claude/settings.json:179), Codex Stop (.codex/hooks.json:136), Devin Stop (.devin/hooks.v1.json:168), Pi turn_end (.pi/extensions/completion-evidence.ts symlink) and the OpenCode session.idle plugin. One vocabulary/threshold improvement lands in all five at once — the highest multiplier surface for this feature.
[SOURCE: .claude/settings.json:175-181]
[SOURCE: .codex/hooks.json:128-140; .devin/hooks.v1.json:160-172]
[SOURCE: ls -la .pi/extensions/completion-evidence.ts; .opencode/plugins/system-completion-sentinel.js:1-20]

### F4-02 - Cursor is written but unwired

`cursor/completion-evidence-response.mjs` exists, but `.cursor/hooks.json` has no completion entry (zero matches). Cursor turns are uncovered; wiring the existing adapter is the cheapest coverage win.
[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs]
[SOURCE: grep completion .cursor/hooks.json -> 0 matches]

### F4-03 - A second un-scored regex in the same core

`SPEC_FOLDER_TEXT_PATTERN` + `resolveSpecFolderFromText` decide which packet a claim is checked against; a wrong resolution produces a false "no implementation-summary.md" advisory or a missed packet, and it has never been scored. The 110-row corpus is reusable input (each row carries its session objective with packet paths).
[SOURCE: completion-evidence-sentinel.cjs:75,121-132]

### F4-04 - The audit template is already replicated

30+ `score-*` scripts already exist across .skilled (debug-next-check, residue-flagger, stop-rater, alignment-suggestion, jev-tiebreak, clarify-default, goal-lint, fanout-pairs, verdict-fallback, ...). The payoff is not rebuilding the harness but pointing it at gate judgments that still lack it.
[SOURCE: find .skilled -name "score-*" (30+ hits); 047 results.md]

### F4-05 - Spec-gate classify is the next high-volume surface

The spec-gate classify/enforce hooks exist in every runtime and decide, per prompt, whether the folder gate applies — higher volume than completion claims with the same shared-core shape. They are a natural next scorer target; their input text is more sensitive than claim tails, so the label protocol must inherit 042's privacy rules.
[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/{claude,codex,cursor,devin}/spec-gate-classify.mjs, spec-gate-enforce.mjs]
[SOURCE: .skilled/hooks/shared/hook-flags.cjs:67]

### F4-06 - The run-scope twin policy already exists

The fan-out runner refuses a self-reported completion unless iteration files and state records prove the depth (completionFromArtifacts / findMaxIterationsPolicyViolation). That is the same claim-vs-evidence policy the sentinel applies at turn scope, and 026's zero-recall finding is shared evidence for both: treat claims as hints, verify evidence.
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:943-1024,1527]
[SOURCE: completion-evidence-sentinel.cjs:489-499]

### F4-07 - The goal-verifier family shares the label store

003's `score-verifier-labeled-set.cjs` measured "stop: no headroom" (no false-met rate to lower), and its labels live in the same `~/.skilled/.labels` store. A shared audit workspace could batch-label sentinel-family judgments (completion claim, spec-folder resolution, goal met) instead of one packet per feature.
[SOURCE: 047 results.md row 003; .skilled/hooks/goal/lib/score-verifier-labeled-set.cjs]

### F4-08 - Offline and per-event surfaces need different economics

The completion-claim detector runs per turn (Stop hooks); the deep-loop scorers judge offline artifacts. The 3-call/row template fits infrequent verdicts; the per-turn surface needs a gate-then-judge cascade. "Where else it pays off" splits into offline surfaces (merge/verdict/lint) and per-event surfaces (hooks).
[SOURCE: sentinel consumers (turn scope) vs deep-loop scorers (run scope); 047 rows]

## Sources Consulted

- `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, `.cursor/hooks.json`, `.opencode/plugins/system-completion-sentinel.js`, `.pi/extensions/` (wiring)
- `.skilled/hooks/shared/hook-flags.cjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/` tree; `hooks/lib/completion-evidence-sentinel.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `find .skilled -name "score-*"` sweep; 047 `results.md`
- Commands: wiring greps, symlink check, scorer sweep (read-only)

## Assessment

- newInfoRatio: 0.78
- Novelty justification: Ranks the surfaces by multiplier and identifies concrete un-scored siblings inside the same core (spec-folder resolution) and at higher volume (spec-gate classify), plus the run-scope twin policy — none of it in the 047 row.
- Confidence: high on wiring and file presence; medium on spec-gate volume (no turn counts collected) and on the spec-folder-resolution failure rate (no labels).

## Reflection

- Worked: following the core's import graph to every adapter and wiring file instead of trusting one runtime's config.
- Failed: assuming all six adapters are live — Cursor's is not wired in this checkout.
- Ruled out: re-deriving "the template costs effort" — it is already replicated 30+ times; the gap is targeting, not tooling.

## Recommended Next Focus

Q5: what a default-on integration would need, cost and risk — role choice, latency budgets per runtime, credentials/version pinning, privacy, and the measurement gate before default-on.
