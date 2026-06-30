# Deep Review — Iteration 2

## Dimension

Security (D2). Second independent Opus 4.8 pass over the post-015 two-lane code. Goal: (a) confirm the 015 security remediations hold, (b) hunt NEW security issues a different model surfaces, without re-reporting the prior materializer fixture-id traversal (`correctness-1-1`).

## State Summary

- Target: two-lane program 008-013 post-remediation (files mode).
- Prior findings: P0=0 P1=1 (the iter-1 materializer fixture-id traversal) P2=0.
- This round adds: 1 new P1 (criteria-exec hardening gate is incomplete — `bundle-gate.cjs` smoke-run path bypasses `DEEP_AGENT_ALLOW_CRITERIA_EXEC`), plus 6 confirmations that 015 security fixes hold.

## Files Reviewed

- `scripts/model-benchmark/dispatch-model.cjs:185-234,236-295` (read-only default + write opt-in; cwd forwarding)
- `scripts/model-benchmark/run-benchmark.cjs:88-166` (sanitizeLabel, SAFE_FIXTURE_ID, regex-DoS bounds)
- `scripts/model-benchmark/scorer/score-model-variant.cjs:54-136,201-258` (criteria-exec gate, det-check subprocess, temp-dir handling)
- `scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs:128-179` (Layer-3 smoke-run execSync)
- `scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:85-109` (separator-bounded containment)
- `scripts/model-benchmark/scorer/grader/harness.cjs:127-136,201-261` (execFileSync dispatch, clamp, cache redaction)
- `scripts/model-benchmark/scorer/lib/cache.cjs:38-199` (key derivation, atomic write, lock)
- `scripts/shared/loop-host.cjs:75-169` (script-path resolution, arg forwarding)
- `scripts/shared/promote-candidate.cjs:77-321` (target gating, copy)
- `scripts/agent-improvement/score-candidate.cjs:171-225,447-449` (packet-local cache dir, execFileSync runScript)
- `scripts/shared/reduce-state.cjs` (JSONL ingestion — no exec, no path egress)
- `commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml`
- `SKILL.md:279` (hardening-gate documentation)
- `scripts/tests/remediation.vitest.ts:107-132` (F-P1-3 gate coverage)

## Findings by Severity

### P0

None.

### P1

**security-2-1 — `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` hardening gate does NOT cover `bundle-gate.cjs`; fixture `acceptance.command` still shell-executes via the D2 smoke-run path.**

Evidence:
- The 015 F-P1-3 remediation added the criteria-exec gate ONLY inside `score-model-variant.cjs::scoreAcceptanceDeterministic` (`score-model-variant.cjs:107-113`): when `DEEP_AGENT_ALLOW_CRITERIA_EXEC === '0'` it skips `execSync(a.command, ...)` for `type:'deterministic'` acceptance.
- But on the same 5-dim scoring pass, `score()` ALSO spawns the D2 bundle gate via `runDetCheck('bundle-gate', fixturePath, outputFile)` (`score-model-variant.cjs:209`). The virtual fixture written to the temp JSON carries `acceptance: criteria.acceptance` verbatim (`score-model-variant.cjs:196,205`).
- `bundle-gate.cjs::scoreLayer3` (`bundle-gate.cjs:128-157`) selects `fixture.acceptance.find(a => a.type === 'smoke-run' || a.type === 'deterministic' && a.command)` and runs `execSync(acceptance.command, { cwd: cwdAbs, timeout: 30000, ... })` with NO consultation of `DEEP_AGENT_ALLOW_CRITERIA_EXEC`. The string `DEEP_AGENT_ALLOW_CRITERIA_EXEC` does not appear anywhere in `bundle-gate.cjs`.
- `SKILL.md:279` documents the control as: "set `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` to refuse criteria-driven shell execution **in the 5-dim scorer**." Bundle-gate IS part of the 5-dim scorer (D2, weight 0.30, the hard gate), so the documented guarantee is false for one of the two criteria-exec surfaces.
- The F-P1-3 regression test (`remediation.vitest.ts:119-131`) only feeds `type:'deterministic'` acceptance and asserts `r.dimensions.D1` flips to 0 when the flag is set. It never exercises bundle-gate Layer-3, so the gap is untested. A `type:'smoke-run'` acceptance (or a `deterministic` acceptance whose `command` bundle-gate also matches) executes regardless of the flag.

Reachability: dormant in shipped fixtures (`default.json` fixtures carry no `command`), but live the moment any profile/fixture defines an `acceptance` entry with `type:'smoke-run'` or `type:'deterministic'`+`command` and the 5-dim scorer is selected (`--scorer 5dim`). cwd is `path.resolve(outputsDir)` for the benchmark path, i.e. the run's own outputs dir.

Severity rationale: same trust domain as F-P1-3 (benchmark profiles are trusted-author content today), so this is a latent surface rather than an open exploit — that is why 015 rated the sibling surface P1 and shipped a gate for it. The defect here is that the shipped gate is INCOMPLETE: a security control that the SKILL advertises as covering "the 5-dim scorer" silently fails closed on only one of two exec paths, so a hardened/shared-runner deployment that sets the flag still executes fixture-supplied commands. Incomplete remediation of an already-acknowledged P1 surface keeps it at P1.

Fix: route bundle-gate Layer-3 through the same env gate. Either (a) have `bundle-gate.cjs::scoreLayer3` early-return a skipped/`passed:false` layer when `process.env.DEEP_AGENT_ALLOW_CRITERIA_EXEC === '0'`, or (b) have `score-model-variant.cjs` strip `command` fields from the virtual fixture's `acceptance` (and skip the bundle-gate smoke-run) when the flag is set, before writing the temp fixture. Extend `remediation.vitest.ts` with a `type:'smoke-run'` fixture asserting no execution under the flag.

### P2

None this round.

## Confirmations (015 security fixes that hold)

- F-P1-1 read-only-by-default dispatch holds: `dispatch-model.cjs::buildSpawnSpec` defaults codex `--sandbox read-only`, claude `--permission-mode plan`, gemini omits `-y`, devin `--permission-mode auto`; write modes gated behind `DEEP_AGENT_DISPATCH_WRITE` (lines 189-230), and `dispatchReal` forwards `cwd` for every executor (lines 263-275).
- F-P1-9 fixture-id traversal guard is real in `run-benchmark.cjs`: `assertSafeFixtureId` + `SAFE_FIXTURE_ID` reject `.`/`..`/separators before `path.join(outputsDir, ...)` (lines 126-138). (The materializer gap is the separately-tracked `correctness-1-1`; not re-reported.)
- F-P1-4 grader-score clamp holds on both fresh and cache-hit paths: `clampScore01` coerces non-finite to 0 and bounds [0,1] at write time and on cache read (`harness.cjs:44-48,206-209,229-231`).
- Regex-DoS bounds hold: authored `requiredPatterns`/`forbiddenPatterns` are length-capped (`MAX_PATTERN_LENGTH=512`) and tested against truncated input (`MAX_MATCH_INPUT_LENGTH=200000`) in `run-benchmark.cjs:146-166`.
- D3 path classification is separator-bounded: `cwd-check.cjs::isInside` (lines 85-87) rejects shared-prefix siblings, closing the `/repo/proj-evil` vs `/repo/proj` masquerade (F-P1-2).
- Grader dispatch is shell-safe: `harness.cjs::dispatchReal` uses `execFileSync(CLAUDE_BIN, [..., '-p', prompt])` (line 131) — model output + fixture content travel as a single argv element, so no shell metacharacter injection. `score-model-variant.cjs::runDetCheck` and `score-candidate.cjs::runScript` likewise use array-arg `spawnSync`/`execFileSync('node', [script, ...])`, not a shell string.
- Score-cache poisoning surface reduced: `score-candidate.cjs` anchors `.score-cache` under the packet-local outputs/candidate dir rather than world-writable `os.tmpdir()` (F-P1-11), and the cache key binds candidate/baseline paths (F-P1-12) so a same-hash collision cannot serve another candidate's score (lines 171-204, 546-570).

## Traceability Checks

- `spec_code`: SKILL.md:279 claims the criteria-exec gate covers "the 5-dim scorer". Code partially contradicts: bundle-gate (a 5-dim det-check) is uncovered. Recorded as security-2-1.

## Verdict

CONDITIONAL — one new P1 (incomplete security-control coverage). All other 015 security remediations verified sound.

## Next Dimension

Traceability (D3).
