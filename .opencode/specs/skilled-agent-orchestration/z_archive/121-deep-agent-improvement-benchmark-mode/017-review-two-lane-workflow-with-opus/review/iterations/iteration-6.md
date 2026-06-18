# Iteration 6 — Security (Opus 4.8 second-opinion deep review)

## State Summary

- Review target: deep-agent-improvement TWO-LANE program (phases 008-013), post-015-remediation state.
- This is iteration 6 of 10; dimension focus: **security**.
- Prior security pass (iter 2) plus the carried prior-findings list already covered: fixture-id traversal in the materializer (F-P1-9 gap), the `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` gate not covering `bundle-gate.cjs`, the Lane-doc "Mode 4" phantom section, the four parseArgs dialects, and several P2 maintainability items. Those are NOT re-reported.
- This pass read the dispatch/exec surfaces adversarially: `dispatch-model.cjs`, `grader/harness.cjs`, `score-model-variant.cjs` (deterministic acceptance + grader factory), `cwd-check.cjs`, `score-candidate.cjs` (score cache + systemFitness fs probes), `run-benchmark.cjs` (ReDoS guards + fixture-id sanitize), `promote-candidate.cjs` (copyFileSync promotion), `reduce-state.cjs`, the two Lane command docs, the Lane B auto YAML, `SKILL.md`, and `explicit.ts`.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:54-234,261-275`
- `.opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:44-135,201-262`
- `.opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:72-136,201-258`
- `.opencode/skills/deep-agent-improvement/scripts/model-benchmark/scorer/deterministic/cwd-check.cjs:85-148`
- `.opencode/skills/deep-agent-improvement/scripts/agent-improvement/score-candidate.cjs:171-204,356-364,572-651`
- `.opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:126-166`
- `.opencode/skills/deep-agent-improvement/scripts/shared/promote-candidate.cjs:297-302`
- `.opencode/skills/deep-agent-improvement/SKILL.md:279`
- `.opencode/commands/deep/start-model-benchmark-loop.md:356`

## Findings by Severity

### P0

None.

### P1

- **security-6-1** — `scoreAcceptanceDeterministic` grep/grep_absent criteria read arbitrary absolute-escape paths, and the `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` hardening gate does NOT cover this read path. `score-model-variant.cjs:82` and `:95` build `path.join(cwdAbs, a.file)` from fixture-authored `a.file` with no traversal guard; a criterion `{type:'grep', file:'../../../../etc/hosts', pattern:'...'}` reads outside `cwd`. The `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0` gate (lines 107-113) wraps ONLY the `type:'deterministic'` execSync branch, so a hardened operator who disabled criteria-driven execution still has criteria-driven arbitrary file reads. Distinct from the prior "exec gate does not cover bundle-gate.cjs" finding (that is the layer-3 smoke-run in a different file). Within the documented trusted-author model this is latent, but the hardening gate's coverage hole contradicts its stated fail-closed purpose.

### P2

- **security-6-2** — Score-cache hit path (`score-candidate.cjs:194-200`, `readCachedScore`) trusts the on-disk filename hash and never re-validates that the cached blob's own `inputHash` field equals the requested hash. The cached object is emitted verbatim as `status:'scored'` and consumed downstream by `promote-candidate.cjs`. A forged `<hash>.json` in the packet-local `.score-cache/` dir would be served as an authoritative score (e.g. `recommendation:'candidate-better'`). Mitigated by the F-P1-11 packet-local relocation and by the hash being content-derived (predicting it generally requires already controlling the candidate), so defense-in-depth rather than an open exploit.

## Traceability Checks

- `skill_agent` (advisory): SKILL.md §4.5 (line 279) documents the two hardening gates (`DEEP_AGENT_ALLOW_CRITERIA_EXEC`, `DEEP_AGENT_GRADER_CACHE_RAW`) and the trusted-author rationale. The doc describes the criteria-exec gate as refusing "criteria-driven shell execution" — accurate for the exec branch, but the grep file-read branch (security-6-1) is not covered, so the gate's protection is narrower than a reader of §4.5 would assume. Recorded as the basis for security-6-1.

## Confirmations (015 fixes that HOLD)

- F-P1-1 read-only dispatch default HOLDS: `dispatch-model.cjs:54-57,189-230` defaults every executor to its read-only mode (codex `--sandbox read-only`, claude `--permission-mode plan`, gemini omits `-y`, devin `auto`, opencode no write-grant), write-capable strictly gated behind `DEEP_AGENT_DISPATCH_WRITE=1`.
- F-P1-1 cwd-for-all-executors HOLDS: `dispatchReal` sets `cwd: dir` on the spawn opts for every executor (line 265), not just cli-opencode.
- No shell-injection in any dispatch path: all executor invocations use `spawnSync(bin, argsArray, …)` / `execFileSync` with argument arrays (no `shell:true`, no string concatenation into a shell). `repoRoot()` uses a fixed `git rev-parse` command.
- F-P1-4 grader score clamp HOLDS on BOTH fresh and cache-hit paths: `harness.cjs:44-48` (`clampScore01`), applied at write (lines 230-231) and re-applied on cache hit (lines 206-208).
- F-P1-13 fixture-id sanitize HOLDS for `run-benchmark.cjs`: `assertSafeFixtureId` (lines 126-133) rejects `../evil` and `a/b` before any `path.join`, proven by `run-benchmark-hardening.vitest.ts:67-91`.
- ReDoS guards HOLD: `compilePatterns` caps authored pattern length at 512 (`run-benchmark.cjs:149-157`) and `safeRegexTest` caps tested input at 200000 chars (lines 161-166).
- F-P1-13 label sanitize HOLDS: `sanitizeLabel` (`run-benchmark.cjs:88-91`) reduces the author-controlled label to `[A-Za-z0-9._-]`, capped at 120 chars, before the report-history basename, so the snapshot cannot escape `report-history/`.
- F-P2-6 grader-cache raw-output redaction HOLDS: `DEEP_AGENT_GRADER_CACHE_RAW=0` redacts raw model output from the on-disk grader cache (`harness.cjs:237-239`).
- F-P2-9 busy-wait removal is not a security regression: `sleepSync` uses `Atomics.wait` with a bounded spin fallback (`dispatch-model.cjs:122-130`).
- Gemini model whitelist (loop_protocol.md:272) is NOT enforced in `dispatch-model.cjs` (model passes straight to `-m model`), but `model` is operator-supplied config in the same trust domain, and dispatch-model is a separate code path from the deep-loop-runtime executor-config whitelist — a parity/traceability note, not a security hole.

## Verdict

CONDITIONAL — one new P1 (security-6-1: hardening-gate coverage hole over the criteria-grep file-read traversal) plus one P2 defense-in-depth item. The 015 read-only-dispatch, score-clamp, fixture-id-sanitize, and ReDoS hardening all hold.

## Next Dimension

Traceability (per default dimension ordering; coordinate with loop state).
