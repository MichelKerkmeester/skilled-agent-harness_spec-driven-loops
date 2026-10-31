---
title: "Iteration 1: Grading AI responses, the wiring"
trigger_phrases: []
---
# Iteration 1: Grading AI responses, the wiring

**Angle:** deepseek-01 · **Lens:** integration engineer · **Jev package under study:** Python `jev-cli` 0.6.2 (wrapped by `.skilled/skills/cli-jev/cli-usage/`)

## Focus

Where exactly would a Jev grade of a model's output be called, and what does each candidate site already expect back? Hand-off target: the grader interface shape a `jev` kind must return, the exit-code mapping it needs, and which sites fit a synchronous call versus only an offline one.

## Actions Taken (opened this iteration)

- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs:1-120`, `:150-360`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs:1-330`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs:560-640`, plus a grader grep (`:16`, `:433-463`, `:577-641`, `:727-834`)
- `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:40-140`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs:1-40`, `:100-140`
- `.skilled/skills/cli-jev/cli-usage/SKILL.md:1-60`, `:140-200`
- `.skilled/skills/cli-jev/cli-usage/references/integration-patterns.md:120-160`
- `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md:1-80`
- `.skilled/commands/deep/model-benchmark.md:100-125`

## Per-Idea Records

### Idea 1.1 — A `jev` grader kind on the model-benchmark D4 seam

| Field | Content |
|---|---|
| **Idea** | `score` grader kind (`jev score` over ordered hallucination/grounding levels) added to `buildGraderFn` and selectable as `--grader jev`; returns the harness grader payload. |
| **Value** | Gives benchmark runs a different-family numeric second lens on the untrusted-output dimension D4 (weight 0.15), without the Claude-only constraint the current `llm` grader carries (`harness.cjs:9-10`, `:42-43`). |
| **Seam** | Factory `score-model-variant.cjs:207-226`; call `:289-294`; consumption `:296-303`; `run-benchmark.cjs:577` (default `noop`), `:582` (usage string), `:610-623` (refusal pattern), `:639-643` (5dim dispatch). |
| **Metric, baseline, harness** | H9. Baseline for grader agreement is UNKNOWN (probe note: no recorded grader-versus-oracle agreement found). Metric: agreement with the reviewer fixture `expectedVerdict` (`reviewer-schema.md:20`, `:40`), plus cost and latency per grade. Smallest add-on: a `jev` arm beside `--grader llm` over the same outputs (the H9 gap row in the measurement digest names exactly this). |
| **Cost, latency, privacy** | One billed Python `jev score` call per graded output when `--samples 1`; offline (`run-benchmark.cjs` has no deadline; `harness.cjs:44` sets a 120 s dispatch ceiling for the Claude path). State sent: fixture metadata plus the candidate output text (`harness.cjs:199-222`), forwarded verbatim by the transport (`cli-usage/SKILL.md:76-77` per seam map). No measured latency exists (gap row). |
| **Opt-in and no key** | New `--grader jev` value beside `noop\|mock\|llm` (`run-benchmark.cjs:582`, `.skilled/commands/deep/model-benchmark.md:111`). Startup checks `command -v jev` + `jev auth status` (`cli-usage/SKILL.md:96-103` per seam map); on failure refuse the run with a stderr message and exit 2, mirroring the family-collision refusal (`run-benchmark.cjs:614-621`). Mid-run exit 0 JSON parse failure or exit 3/4 maps to `parse_status: 'failed'` (`harness.cjs:222-224`, `:284`), never a substitute score. Default stays `noop` (`:577`), so today's behavior is untouched. |
| **Complexity** | ~40-60 LOC: one branch in `buildGraderFn`, a small `scorer/grader/jev.cjs` wrapper that spawns `jev score --value` with `</dev/null`, one allowlist/usage line in `run-benchmark.cjs`, one doc row in `.skilled/commands/deep/model-benchmark.md:111`. Callers: `scoreFixture5dim` (`run-benchmark.cjs:439-463`) and the direct CLI (`score-model-variant.cjs:342-357`). Frozen contract: the grader return shape `{score, confidence, parse_status, dim_id, rationale, evidence}` (`score-model-variant.cjs:198-199`, `:209`). |
| **Verdict** | **next** — the cleanest wiring in the repository (offline, factory and flag already exist), but it is a benchmark arm, not operator-facing, and no grader-agreement baseline exists yet, so the first slice must measure that number. |
| **Confidence** | Confirmed from code: factory shape, call site, D4 consumption, flag surface, refusal pattern. Inferred: the `score` position → `[0,1]` mapping (`position / (levels - 1)`); would be confirmed by a wrapper unit test against `mock` responses. UNKNOWN: per-call latency and cost. |

### Idea 1.2 — A `jev noul` completion-claim detector at the Stop sentinel

| Field | Content |
|---|---|
| **Idea** | `noul` "does this last assistant message claim the task is complete" replacing/augmenting the regex `detectCompletionClaim`. |
| **Value** | The regex fires on generic words `occurred\|happened` (`completion-evidence-sentinel.cjs:64`) anywhere in the last 400 chars (`:70`), then the sentinel either advises or approves. A judgment could cut false advisories the operator reads at turn end. |
| **Seam** | `completion-evidence-sentinel.cjs:113-119` (pure sync boolean), consumer `completion-evidence-stop.cjs:117-135`. |
| **Metric, baseline, harness** | No harness. Smallest: annotate N recorded claims (the advisories log path exists at `completion-evidence-sentinel.cjs:78`) with true/false claim labels, score regex precision/recall versus a Jev arm. Gap row "Jev judgment accuracy against gold" applies. |
| **Cost, latency, privacy** | One call per completion claim, but the live path budget is `DEFAULT_CHECK_TIMEOUT_MS 1200` (`completion-evidence-sentinel.cjs:90-94`) under a hook window the seam map records as 10 s at `.claude/settings.json:174-175`; the Python client timeout is 60 s per the digest with no measured latency, so a live call cannot be shown to fit. Offline or shadow only. |
| **Opt-in and no key** | Behind a `SYSTEM_COMPLETION_SENTINEL_*`-style opt-in (family exists at `:84-88`); with no key, keep the regex as today and say nothing (advisory is already best-effort). |
| **Complexity** | ~50-70 LOC and an async refactor of a pure boolean; touches the runtime-neutral core plus both adapters. |
| **Verdict** | **later** — false-positive reduction on an advisory-only path does not pay for the refactor until a labeled claim set exists. |
| **Confidence** | Confirmed from code: regex, tail length, timeouts, advisory-only behavior (`completion-evidence-stop.cjs:19-21`, `:137-139`). Inferred: that Jev beats the regex here; would be confirmed by the labeled-claim harness. |

### Idea 1.3 — The H13 reply-harness judge slot (grading, offline)

| Field | Content |
|---|---|
| **Idea** | `score` per rubric dimension as the empty blinded judge in the `sk-communication` reply harness. |
| **Value** | Fills the one grading slot in the repo that was explicitly built for a judge and currently has none. |
| **Seam** | Harness files per the measurement digest H13; no code lab found that blocks it (read-only harness). |
| **Metric, baseline, harness** | H13 itself: per-dimension delta and control-stability check. Baseline: none recorded (harness runs are manual). |
| **Cost, latency, privacy** | Offline, manual runs; masked reply text leaves the machine. |
| **Opt-in, complexity, verdict** | Offline script option (`jev` arm beside the human judge); ~30 LOC; **later** — measurement tooling, not a seam in shipped behavior. |
| **Confidence** | Inferred from the digest (harness README not opened this iteration); would confirm by opening `README.md:11-21`. |

## Findings

1. **The D4 grader is the one seam whose return contract is already exactly what a Jev answer provides.** The factory returns `{score, confidence, parse_status}` (`score-model-variant.cjs:198-199`), `noop` returns a constant payload (`:209`), the `llm`/`mock` path delegates to `harness.gradeD4` (`:212-221`), and the catch path returns `{score: 0.0, confidence: 0.0, parse_status: 'failed'}` (`:222-224`). The scorer only reads `grader.score` (`:300`, `:316`, `:320`). SQL of a wire: a `jev` kind needs to return that same object; nothing else in the scorer consumes the grader.
2. **The parse-status vocabulary is already established** (`harness.cjs:231-285`): `ok`, `dim_mismatch`, `fallback_fenced`, `fallback_regex`, `fallback_score_only`, `failed`. A Jev wrapper should reuse `ok`/`failed` and never invent a silent neutral: non-zero exits and unparsable stdout are failures, matching the transport rule that exit 4 is never a judgment (`integration-patterns.md:138`) and the repo rule against a catch that swallows into a default.
3. **The refusal pattern for an unavailable grader already exists.** `run-benchmark.cjs:610-623` refuses a run (stderr + exit 2) when a grader shares a model family. A `--grader jev` without the CLI or key should mirror this shape, which satisfies the no-key rule without a new mechanism.
4. **Exit-code mapping needed** (from the contract read): 0 → parse stdout JSON and validate the expected keys; 1/2/3/4/130 → no judgment (`cli-usage/SKILL.md:167-174`); exit 2 means no quota was spent (`:171`), exit 3 is an operator step (`:172`), exit 4 is retryable and must never read as a score (`:173`; `integration-patterns.md:138`).
5. **Sync vs offline verdict:** only offline. The D4 seam is offline by construction; the completion sentinel runs under a 1200 ms internal check timeout inside a hook window (`completion-evidence-sentinel.cjs:90-94`); the reply harness is manual. None of the three can host a live 60 s-timeout call on its happy path today.
6. **The Jev side of the grader is a `score`, and the caller owns the threshold/normalization** (`integration-patterns.md:43-44` per seam map). The D4 number is `[0,1]`; a `score` returns a zero-based position that may be fractional (`cli-usage/SKILL.md:162-164`), so the wrapper must normalize by the level count it defined. That constant belongs next to the question, per the vendored pattern of policy-beside-catalog.

## Ruled Out

- **A live Jev call inside `detectCompletionClaim`**: the core is a synchronous pure boolean (`completion-evidence-sentinel.cjs:113-119`) called under a 1200 ms timeout (`:90-94`); a subprocess with a 60 s client timeout has no measured latency and cannot be shown to fit.
- **A synchronous Jev call inside the D4 grader path without a no-key guard**: the transport has no rate limit or latency figure recorded, and `--grader` is chosen before the run, so the guard belongs at startup, not per fixture.
- **A `run` batched grader call for D4**: the scorer grades one dimension for one candidate at a time (`score-model-variant.cjs:290-294`); batching across fixtures is not the scorer's contract, and `--value` is refused with `run` (`cli-usage/SKILL.md:180-181`).

## Questions Answered

- Which sites exist for grading a model's output: D4 model-benchmark grader (S22), completion-claim detection (S09), H13 reply-harness judge slot.
- What the D4 site expects back: `{score, confidence, parse_status, dim_id, rationale, evidence}` consumed as `grader.score` only.
- Which fit synchronous vs offline: all three are offline-only today; none has a proven latency budget for a live call.
- Exit-code mapping: 0 judgment, 3 operator, 4 retryable-never-a-judgment, 2 usage/no-quota, 1 inspect.

## Questions Remaining

- Does a Jev D4 `score` agree with the hidden reviewer oracle, and at what cost/latency? (needs the H9 measurement gap filled)
- Would the `score` output for a fixed level list be stable across repeats? (stability gap row; H9's `benchmark-stability.cjs:24-25` pattern)
- Does the completion sentinel's advisory log hold enough labeled claims to score the regex? (unopened log; unknown)
- H13 harness README specifics (opened next iteration if needed).

## Hand-off (for iteration 2 and later)

- The grader wrapper must return the exact harness shape; `parse_status` values to use: `ok` or `failed`. The no-key guard belongs beside `run-benchmark.cjs:610-623`, not per call.
- The `score → [0,1]` normalization is caller-owned; name the level list and the divisor in the wrapper.
- Do not propose a live Jev call on the completion sentinel path; if it is revisited, it is a shadow/offline audit over the advisory log.
- Next iteration (deepseek-02) starts from the advisor 2500 ms child (`user-prompt-submit.ts:22-24`) and the shadow lane pattern (`lane-registry.ts:21-27`), which matters because this iteration proved the repo already has a shadow-lane precedent for delayed judgments.

## Assessment

- `newInfoRatio`: `0.85`
- Novelty justification: First pass established the exact grader payload contract, the existing refusal and parse-status patterns a `jev` kind must reuse, and the offline-only classification of all three grading sites.
- Confidence: high for D4 shape and fault mapping; medium for the completion-sentinel budget (based on code comments and constants); UNKNOWN for Jev accuracy, latency and cost.

## Sources Consulted

- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-model-variant.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/grader/harness.cjs`
- `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs`
- `.skilled/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs`
- `.skilled/skills/cli-jev/cli-usage/SKILL.md`
- `.skilled/skills/cli-jev/cli-usage/references/integration-patterns.md`
- `.skilled/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md`
- `.skilled/commands/deep/model-benchmark.md`
- Digest claims (not reopened): `context/seam-map.md` (S09, S22), `context/measurement-digest.md` (H9, H13, gaps)
