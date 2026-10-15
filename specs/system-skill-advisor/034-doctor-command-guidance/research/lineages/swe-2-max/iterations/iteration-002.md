# Iteration 2: Measured baseline — what the advisor returns on setup/health prompts

## Focus
Measure `advisor_recommend` output today for plain-language setup/health prompts and for literal doctor command names. Runs were executed with `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"..."}' --format json` against the live daemon (`trustState.state: live`, generation 1033). Raw captures are preserved in `.executor-state/baseline-probes.jsonl` inside this lineage.

## Actions Taken
- Probed the output shape once, then ran a 12-prompt natural-language battery plus 5 literal/near-literal doctor prompts — 17 advisor_recommend calls total.
- Recorded id/confidence/score per recommendation and the `ambiguous` flag.

## Findings
1. Baseline response envelope: `data.recommendations[]`, `data.ambiguous`, `effectiveThresholds` (confidenceThreshold 0.8, uncertaintyThreshold 0.35), `freshness`, `trustState`, and a `_shadow` block (`advisor-shadow-learned-weights-v1`, liveWeightsFrozen) [SOURCE: .executor-state/baseline-probes.jsonl probe 1; .skilled/bin/skill-advisor.cjs:105-109].
2. 5 of 12 natural setup/health prompts return EMPTY recommendations: "help me set up skilled", "is my repo set up right", "why is this rule not enforced", "set up the development environment", "check if my environment is healthy", "update my skills to latest" — 6 of 12 empty in fact (recount: empty = set-up-skilled, repo-set-up-right, rule-not-enforced, dev-env, env-healthy, update-skills → 6/12) [SOURCE: .executor-state/baseline-probes.jsonl].
3. 6 of 12 natural prompts surface a SKILL instead of a doctor command: "check my git hooks" → sk-git 0.83; "my MCP server is not connecting" → mcp-code-mode 0.89 + sk-code + cli-classifier; "the skill advisor keeps recommending the wrong skill" → system-skill-advisor 0.85; "verify my speckit setup" → system-spec-kit 0.82; "install git hooks for this repo" → sk-git 0.82; "something is wrong with my setup, run diagnostics" → ambiguous with 3 weak ties (cli-external-orchestration, mcp-code-mode, system-skill-advisor, all 0.82 confidence / ~0.1 score) [SOURCE: .executor-state/baseline-probes.jsonl].
4. Literal command names still miss the doctor surface entirely: "/doctor:git" → sk-git 0.83; "doctor git setup" → sk-git 0.83; "run the doctor for my repo" → ambiguous trio topped by sk-doc (a documentation skill) 0.82; "/doctor:env" → EMPTY; "doctor:skill-advisor" → system-skill-advisor 0.82 [SOURCE: .executor-state/baseline-probes.jsonl].
5. Net measurement: 17/17 probes surfaced zero doctor commands; the advisor cannot name a `/doctor:*` route for any phrasing today because no doctor candidate exists in its scoring inventory (consistent with iteration-1 finding f-iter001-005) [SOURCE: .executor-state/baseline-probes.jsonl; .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json].
6. Where skills DO answer, they are plausibly "wrong-but-defensible": sk-git for git-hook checks, system-skill-advisor for advisor misrouting — these are the anti-steal boundary cases the design must respect, not blanket overrides [SOURCE: .executor-state/baseline-probes.jsonl probes for git hooks / advisor complaints].

## Questions Answered
- Q3 (measured baseline) — answered with 17 probes, exceeding the ≥10 requirement.

## Questions Remaining
- What does `_routes.yaml` declare per doctor route, and is the phrase vocabulary compatible with the advisor's lexical lanes?
- How does the Python compat scorer treat bridges (parity)?
- Design: where should doctor guidance live (bridge entries vs phrase boosts vs a new surface), and how to test routing accuracy.

## Ruled Out
- Hypothesis "the advisor might already surface doctor commands via some other surface": falsified by 17/17 probes.

## Dead Ends
- None.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none — measurements corroborate the static analysis from iteration 1.
- Missing dependencies: none — daemon was live; no degraded result observed.
- Partial success: none.

## Sources Consulted
- .executor-state/baseline-probes.jsonl (17 advisor_recommend captures, this lineage)
- .skilled/bin/skill-advisor.cjs:105-109
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
- steer.md: absent this iteration

## Assessment
- New information ratio: 0.9 — the measurements are all new evidence; the headline conclusion (doctor invisible) partially restates f-iter001-005, now measured rather than inferred.
- Questions addressed: Q3.
- Questions answered: "What does the advisor return today for at least ten plain-language setup/health prompts (measured baseline)?"

## Reflection
- What worked: batching probes through the JSON CLI and reducing each to id/confidence gave a compact, citable baseline table; probing literal "/doctor:X" strings separated "no candidate exists" from "phrasing too weak".
- What did not work: `timeout` is unavailable on macOS — plain invocation was fine because the daemon was already warm.
- What I would do differently: none — the battery covered both natural and literal phrasings.

## Recommended Next Focus
The doctor family inventory: `_routes.yaml` trigger_phrases per route and each `/doctor:*` command's scope — the vocabulary a bridge would consume, and the baseline against which routing accuracy should be measured.
