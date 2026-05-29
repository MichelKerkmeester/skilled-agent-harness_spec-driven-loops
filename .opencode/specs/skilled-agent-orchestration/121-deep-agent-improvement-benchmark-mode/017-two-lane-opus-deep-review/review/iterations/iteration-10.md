# Iteration 10 — Security (final round)

## State Summary

Second independent Opus 4.8 deep review of the deep-agent-improvement TWO-LANE program (phases 008-013), post-015-remediation. Iteration 10 of 10, dimension focus: **security**. Goal: (a) confirm 015 remediations hold without regression, (b) surface NEW security issues a different model finds, without re-reporting the 16 prior findings already in the feed-forward registry.

Reviewed the curated current two-lane code for injection, traversal, untrusted-data-trust, and supply-chain (promotion) surfaces. Cross-checked every finding against the 16-item prior-findings list to avoid duplicates.

## Dimension: Security

### Files Reviewed

- `scripts/shared/loop-host.cjs:75-203`
- `scripts/model-benchmark/dispatch-model.cjs:185-296` (buildSpawnSpec, dispatchReal)
- `scripts/model-benchmark/scorer/grader/harness.cjs:127-262` (dispatchReal, gradeD4, cache-hit path)
- `scripts/model-benchmark/scorer/score-model-variant.cjs:72-258`
- `scripts/model-benchmark/scorer/lib/cache.cjs:30-222` (cache root + read/write/derive)
- `scripts/model-benchmark/run-benchmark.cjs:88-166,260-307,418-438`
- `scripts/agent-improvement/score-candidate.cjs:334-380,447-460,481-506` (systemFitness ref probe, runScript)
- `scripts/shared/promote-candidate.cjs:125-302` (gate chain + copy)
- `scripts/shared/materialize-benchmark-fixtures.cjs:60-99` (fixture-id write path)
- `scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:85-148`
- `scripts/shared/reduce-state.cjs` (no untrusted exec/path surface; read-only JSONL reducer)

### Findings by Severity

#### P0
None.

#### P1
None.

#### P2

- **security-10-1** — Grader (LLM-as-judge) D4 score is open to prompt-injection / score-inflation from the benchmarked model's own output. `harness.cjs:57-72 composeGraderPrompt` embeds the untrusted `swe16OutputText` inside a fenced block directly adjacent to the grading instruction ("Score D4 Hallucination only. Return JSON only…"). In a model benchmark the graded output IS the adversarial axis; a benchmarked model can emit fence-breakout text that instructs the grader to return `score: 1.0`. `clampScore01` (F-P1-4) only bounds the value to `[0,1]` — it does NOT prevent a convinced grader from legitimately returning an inflated in-range score. Bounded impact: D4 weight is 0.15 and only the `graderKind:'llm'` path dispatches a real grader (default run-benchmark path is `noop`), so reported P2.

- **security-10-2** — Grader cache lives at a fixed, in-repo, non-run-scoped location, so a stale or poisoned in-range D4 entry from one run/packet is trusted by another. `cache.cjs:30-31` resolves `CACHE_ROOT = scorer/cache/` (`PACKET_ROOT = resolve(__dirname,'..')` = the `scorer/` dir), shared across every benchmark run regardless of `--outputs-dir`/packet. This is the un-applied analogue of `score-candidate.cjs` F-P1-11, which deliberately moved its cache to a packet-local `.score-cache` "rather than a shared … location whose contents are trusted before rescoring." The grader cache-hit path (`harness.cjs:201-209`) only re-clamps the value (F-P1-4) and never re-validates the cached blob against the key inputs, and the dir can be committed into the repo tree. Distinct from the prior P2 score-candidate cache finding (different cache, different module). P2 (key binds `swe16_output_hash`, so cross-run reuse requires an identical output hash; exploitability is bounded).

- **security-10-3** — `score-candidate.cjs:356-363` interpolates candidate-derived integration refs into `fs.existsSync` paths without sanitization, allowing path-traversal existence probes. `scoreDimSystemFitness` does `cmdPath = cmd.replace(/^\//,'').replace(/:/g,'/')` then `fs.existsSync(`.opencode/commands/${cmdPath}.md`)`, and `fs.existsSync(`.opencode/skills/${sk}/SKILL.md`)` for skills. `commands`/`skills` come from `profile.derivedChecks.integrationPoints`, derived by `generate-profile.cjs` from the candidate agent file — the very artifact being scored, which in the improvement loop can be model-generated/untrusted. A crafted ref such as `/../../../../etc/hosts` yields `existsSync('.opencode/commands/../../../../etc/hosts.md')`, a traversal-based file-existence oracle that also perturbs the `resource-refs-valid` sub-score. Read-only existence probe (no read/write/exec), soft scoring dimension, partial candidate trust → P2.

### Traceability Checks (security overlay)

- `spec_code` (read-only default claim): SKILL/dispatch claim "read-only by default (F-P1-1)" — verified in code across all 5 executors (see confirmations). PASS.
- `feature_catalog_code` (fixture-id sanitize claim): run-benchmark hardens fixture-id (F-P1-9) but materializer does not — the prior P1 remains open (confirmed, not re-reported).

### Verdict

CONDITIONAL — no new P0/P1 this round; three new P2 advisories. Combined with the open prior P1 cluster (materializer fixture-id traversal, bundle-gate exec gate gap, criteria-grep traversal, Lane-B promotion/wiring P1s), the program remains CONDITIONAL pending those P1 remediations. The 015 security remediations that were checked all hold without regression.

### Next Dimension

n/a — iteration 10 of 10 (final). Hand off to synthesis.

## Confirmations (015 fixes / sound areas)

1. F-P1-1 read-only-by-default holds across ALL five executors in `dispatch-model.cjs buildSpawnSpec` (opencode: no write-grant flag; claude: `--permission-mode plan`; codex: `--sandbox read-only`; gemini: no `-y`; devin: `--permission-mode auto`). Write mode is gated behind `DEEP_AGENT_DISPATCH_WRITE=1` only.
2. No shell-injection surface: `dispatch-model.cjs` and `score-candidate.cjs runScript` use `spawnSync`/`execFileSync` with argv arrays (no `shell:true`); the only `execSync(userString)` paths are the already-reported criteria `a.command` (score-model-variant) and the fixed-string `git rev-parse --show-toplevel`.
3. F-P1-9 fixture-id sanitize (`assertSafeFixtureId` + `SAFE_FIXTURE_ID`) and the regex-DoS caps (`MAX_PATTERN_LENGTH=512`, `MAX_MATCH_INPUT_LENGTH=200000`, `safeRegexTest`) all hold in `run-benchmark.cjs`.
4. F-P1-4 grader score/confidence clamp to `[0,1]` is applied on BOTH the fresh path and the cache-hit path (`harness.cjs:206-209,229-231`).
5. F-P1-2 separator-bounded `isInside` containment holds in `cwd-check.cjs:85-87` (no sibling-prefix bypass).
6. `promote-candidate.cjs` supply-chain guard chain holds: scored-state, proposal-only-off, promotionEnabled, target==config.target, profile match, benchmark-complete + pass + aggregate gate, repeatability pass + profile match, single-canonical-target match, weighted-score gate, dimension gates, delta-threshold, mirror-sync gate, and explicit `--approve` are ALL required before `copyFileSync(candidate, target)`; a timestamped backup is taken first.
7. Prior P1 still open (NOT re-reported): `materialize-benchmark-fixtures.cjs` writes `path.join(outputsDir, `${fixture.id}.md`)` with no `assertSafeFixtureId` guard — confirmed the F-P1-9 hardening was never ported to the materializer.
