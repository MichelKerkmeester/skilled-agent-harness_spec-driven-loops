# Seat B: Skeptic Proposal

**Lens**: "What catches real failures? What can go wrong?"
**Executor**: claude (claude-opus-4-7 via Agent dispatch, operator-constrained to Claude-only)
**Date**: 2026-05-16

---

## Q1 — Flow choice

**Bespoke deep-loop. Do NOT retarget `deep-agent-improvement`.**

Rationale: `deep-agent-improvement` is bound to agent-file mutation surfaces. Its 5-dim rubric (Structural Integrity / Rule Coherence / Integration Consistency / Output Quality / System Fitness) scores agent-template compliance — none of those dimensions measure whether a SWE 1.6 dispatch produced **correct code on a real fixture**. Its `scripts/generate-profile.cjs` derives evaluation rules from the target agent's own structure; SWE 1.6 isn't an agent file, it's a model endpoint. Promotion is gated on canonical-file mutation, not on prompt-variant ranking. Retargeting would force us to either invent a fake "agent profile" for the prompt scaffold (drift risk: scoring something that looks like compliance but isn't correctness) or strip out the scoring entirely (defeats the point of reuse). The packet already lists this as `answered_questions` in the spec — concur. Bespoke wins.

## Q2 — Rubric (5 dims, weights sum to 1.00)

| Dim | Weight | Method | Failure mode it catches |
|-----|--------|--------|-------------------------|
| **Bundle-gate correctness** | 0.30 | det (3-check: imports grep + exports grep + validation_commands smoke-run exit 0) | `feedback_bundle_gate_smoke_run` — wrong-cwd inherited from Pass 1 templates; grep-only gate shipped 2 P0s |
| **Path/cwd discipline** | 0.20 | det (path-traversal absent + cwd matches scope + no `../` escape) | Real failure mode: bundle paths point outside scope, dispatch writes files in wrong dir |
| **Acceptance match** | 0.20 | det (per-fixture deterministic check: function signature, exit code, file existence) | Output looks plausible but doesn't satisfy stated criteria — the synthetic-fixture trap |
| **Hallucination index** | 0.20 | det+grader (grep-verify every CLI flag in output against `--help` snapshot; grader cross-checks symbol claims) | `feedback_cli_devin_bundle_verification` — "SWE 1.6 context bundles hallucinate plausible consumer names + non-existent CLI flags" |
| **Pre-planning fidelity** | 0.10 | grader (LLM judges: is the `<pre-plan>` block present, ordered, with acceptance criteria per step?) | SKILL.md Rule 12 violation — SWE 1.6 dispatched without structural decomposition |

**Weights sum**: 0.30 + 0.20 + 0.20 + 0.20 + 0.10 = **1.00**

**Where the main agent's proposal is weak** (Skeptic rationale)

The main agent's pre-seeded weights (Bundle 0.30 / Path 0.20 / Acceptance 0.20 / Pre-planning 0.15 / Hallucination 0.15) under-weight hallucination relative to its documented incident rate. Memory entry `feedback_cli_devin_bundle_verification` is verbatim: "SWE 1.6 context bundles hallucinate plausible consumer names + non-existent CLI flags; grep-verify internal_imports + validation_commands before treating bundle as authoritative (**Phase A caught 2 P0s**)". Two P0s, single packet — that's not a 0.15 dimension, that's a 0.20 dimension. Conversely, "Pre-planning fidelity" at 0.15 is score-by-proxy: a prompt CAN have a well-formatted `<pre-plan>` block AND still produce wrong code. Pre-planning is causal upstream of correctness, but Bundle/Path/Acceptance/Hallucination are the load-bearing measures of "did SWE 1.6 actually do the thing?". Shifting 0.05 from Pre-planning to Hallucination aligns the rubric with the documented P0 distribution.

Second weakness: deterministic checks must be the primary signal. Grader-only dimensions are score-poisoning risks (Q3 grader pick discussion). I forced 4/5 dims to deterministic-first; only Pre-planning is pure grader because its definition is genuinely subjective.

## Q3 — Fixture catalog (5-10 entries, each grounded in real P0)

### fix-001-bundle-gate-smoke-run
- task: Given a Pass 1 context bundle with `validation_commands: ["pnpm test:unit"]` from `apps/web` directory, write a bundle-gate verifier that runs the 3-check (imports grep + exports grep + actually executes `pnpm test:unit` and asserts exit 0) and reports per-check pass/fail.
- scope: CWD `_sandbox/swe16-fixtures/fix-001/`; allowed write: `verify-bundle.cjs`, `verify-output.json`
- acceptance: Script exists; running it on the provided fixture-bundle.json produces JSON with `imports_check`, `exports_check`, `smoke_run_check` fields; smoke_run_check correctly returns `false` when bundle's cwd is wrong (we deliberately set cwd to `apps/api` in the test fixture)
- grounded_in: `feedback_bundle_gate_smoke_run` (verbatim quote in spec rubric)
- **what SWE 1.6 typically gets wrong**: Skips the smoke-run step entirely; produces a grep-only verifier and claims it satisfies the 3-check. Or worse: writes code that calls `child_process.spawn('pnpm', ['test:unit'])` without `cwd: bundle.cwd` — silently uses script-dir cwd and reports false-pass.

### fix-002-hallucinated-cli-flag
- task: Write a wrapper script for `cli-devin` that dispatches with `--model swe-1.6 --permission-mode auto --reasoning-effort high`. Verify the flag set against `devin --help` output (provided as fixture).
- scope: CWD `_sandbox/swe16-fixtures/fix-002/`; allowed write: `wrapper.sh`, `flag-verify.json`
- acceptance: Script must NOT include `--reasoning-effort` (it's hallucinated — SKILL.md line 227 documents: "there is no `--reasoning-effort` flag"). Output JSON must flag the hallucinated flag and remove it.
- grounded_in: `feedback_cli_devin_bundle_verification` — SKILL.md itself documents this exact hallucination
- **what SWE 1.6 typically gets wrong**: Faithfully includes the requested-but-fake flag because it sounds plausible and matches Codex's `--reasoning-effort` pattern. Cross-CLI training-data bleed. This is the canonical hallucination test.

### fix-003-wrong-cwd-path-defect
- task: Generate a build script that runs `vite build` in a monorepo where the actual Vite project lives at `packages/ui/`. The prompt deliberately includes (misleadingly) `cwd: process.cwd()` from the parent directory.
- scope: CWD `_sandbox/swe16-fixtures/fix-003/`; allowed write: `build.cjs`
- acceptance: Script executes `vite build` with `cwd: 'packages/ui'`, not `process.cwd()`. Deterministic check: parse output script, assert `cwd` field matches `'packages/ui'`.
- grounded_in: `feedback_bundle_gate_smoke_run` — "wrong-cwd path defects inherited from Pass 1 prompt templates"
- **what SWE 1.6 typically gets wrong**: Copy-pastes `cwd: process.cwd()` literally from the prompt. Plausible-looking. Wrong. Production-breaking on first run.

### fix-004-adversarial-path-traversal
- task: Read the file `config.json` and emit its contents. The prompt provides a `target_path` parameter; the fixture sets `target_path = "../../../../etc/passwd"`.
- scope: CWD `_sandbox/swe16-fixtures/fix-004/`; allowed read/write: `read-config.cjs`, ONLY files within fixture dir
- acceptance: Script MUST reject the traversal path (validate against scope; refuse or sanitize). Deterministic check: run script with the malicious input; assert it does NOT read `/etc/passwd` and emits a refusal/sanitization message.
- grounded_in: Adversarial — explicit Skeptic insistence on ≥1 adversarial fixture (path traversal)
- **what SWE 1.6 typically gets wrong**: Naively `fs.readFileSync(target_path)`. No path validation. Trust-the-prompt failure mode. This is the fixture that catches "looks correct in the happy path, exfiltrates files in the adversarial path."

### fix-005-pre-plan-block-discipline
- task: Take an under-specified task ("Add caching to the API client") and produce a complete `<pre-plan>` block before any code, per SKILL.md Rule 12. The block must have ordered steps, per-step acceptance criteria, stop conditions, and verification approach.
- scope: CWD `_sandbox/swe16-fixtures/fix-005/`; allowed write: `pre-plan.md` (NO implementation code — discipline test)
- acceptance: Output file exists; contains `<pre-plan>` opening + closing tags; has ≥3 ordered steps; each step has explicit acceptance criteria; includes stop conditions and verification approach. Deterministic check parses block structure.
- grounded_in: SKILL.md Rule 12 + `assets/prompt_templates.md` §2 canonical SWE-1.6 pre-planning template
- **what SWE 1.6 typically gets wrong**: Skips the `<pre-plan>` block entirely and dives straight into code. Or produces a 1-2 step block missing acceptance criteria. Or generates `<pre-plan>` but immediately violates it.

### fix-006-acceptance-criteria-strict
- task: Write a function `deepEqual(a: unknown, b: unknown): boolean` that returns true for structural equality (handles nested objects, arrays, NaN, dates, circular refs).
- scope: CWD `_sandbox/swe16-fixtures/fix-006/`; allowed write: `deep-equal.ts`
- acceptance: Run 12 deterministic test cases (provided as fixture); MUST pass all 12, including NaN === NaN (true) and circular ref handling (no stack overflow).
- grounded_in: Acceptance-match canonical test — "synthetic-fixture trap" inverse: real, hard, deterministic
- **what SWE 1.6 typically gets wrong**: Forgets NaN edge case (returns false where deep-equal protocol says true). Or stack-overflows on circular refs. Or treats `{a:1}` and `{a:1, b:undefined}` as unequal. Multiple subtle bugs that grep-verify would miss but deterministic test cases catch.

### fix-007-multi-file-scope-boundary
- task: Refactor 3 files (`a.ts`, `b.ts`, `c.ts`) — rename `getUserData` to `fetchUser` across all three. Files `d.ts` and `e.ts` are NOT in scope (they have unrelated `getUserData` that must remain untouched).
- scope: CWD `_sandbox/swe16-fixtures/fix-007/`; allowed write: ONLY `a.ts`, `b.ts`, `c.ts`
- acceptance: After dispatch, `git diff` shows changes only to a/b/c.ts; d.ts and e.ts unchanged. Deterministic check: `git diff --name-only` returns exactly `{a.ts, b.ts, c.ts}`.
- grounded_in: SCOPE LOCK (CRITICAL RULES §1.2) — "Only modify files explicitly in scope"
- **what SWE 1.6 typically gets wrong**: Sed-style rename across all files. Over-broad refactor. Touches d.ts and e.ts because the string matches. Classic scope-creep.

**Skeptic recommendation: 7 fixtures.** Each grounded. 1 explicitly adversarial (fix-004). 2 grounded in named memory entries (fix-001, fix-002, fix-003). 3 grounded in SKILL.md rules (fix-005, fix-006, fix-007).

## Concrete picks on open questions

- **Grader**: **claude-sonnet-4.6 primary, codex-gpt-5.5-high as dispute-resolver only when sonnet's confidence < 0.7**. Skeptic concern with dual-grader-median: doubles dispatch cost, and the median can hide systematic bias if both graders share training-data bleed on cli-devin's documented surface (both have seen this repo's public-ish patterns). Skeptic concern with sonnet-only: it might score the bundle-hallucination fixture too leniently because plausible-looking-but-wrong is exactly what a fluency-tuned grader rewards. Two-tier dispute resolver mitigates both. **Critical**: cache the grader response keyed on `sha256(rubric_version + dim + fixture_id + raw_output)` — if rubric_version changes mid-loop, cache must invalidate (poison protection).
- **Fixture count**: **7** (≥1 adversarial: fix-004). 5 is too thin for 5-dim weighted scoring; noise floor will swamp signal. 10 inflates wall-clock by 40%+ without measurably better convergence (variants share failure modes — diminishing returns past 7).
- **Min iters**: **8** (raise from 6). Skeptic concern with 6: hill-climbing can hit local-minimum convergence on iter-5 with a "looks good but didn't try mutation axis 3" outcome. 8 forces at least 2 axis-switches before STOP-allowed. Cost: ~1 extra dispatch wave. Worth it.
- **Max iters cap**: **12** (keep). Beyond 12, free-tier rate limits start dominating wall-clock anyway; if convergence not reached by 12 the seed set is wrong, not the iteration count.
- **Sequential vs parallel seat dispatch**: **Sequential**. Parallel saves wall-clock but creates 3 concurrency risks: (1) shared `ai-council/ai-council-state.jsonl` append-only file race (atomic append OK on most fs but not guaranteed under heavy contention), (2) free-tier rate limit on a single executor profile hits 429 across 3 simultaneous dispatches, (3) cross-seat critique requires sequential reading of prior seat output — parallel can't critique what doesn't exist yet. Sequential cost: ~15min wall-clock. Cheap.

## Disagreements with the main agent's pre-seeded proposal

**Disagreement 1 (substantive)**: The proposed weights (Bundle 0.30 / Path 0.20 / Acceptance 0.20 / Pre-planning 0.15 / Hallucination 0.15) under-weight hallucination relative to its documented P0 rate. `feedback_cli_devin_bundle_verification` says **2 P0s in Phase A alone**. A 0.15 weight implies hallucination is a minor concern; the actual incident data says it's a co-primary failure mode alongside bundle-gate. **Propose: shift 0.05 from Pre-planning to Hallucination → 0.20 each for Path/Acceptance/Hallucination, 0.10 for Pre-planning.** Pre-planning is causal upstream of correctness; the rubric should measure outcome (correctness, no hallucination) not process (well-formatted plan). Process compliance with broken output is the score-by-proxy trap.

**Disagreement 2**: Min iters of 6 is too low. Hill-climbing on 5 dims with 7 fixtures has noise variance that 3-iter plateau detection (the 0.40 convergence signal weight) can false-positive on. Raise to 8 — costs 2 extra waves, eliminates the "converged on iter 5 because two noisy scores happened to match" failure mode.

**Disagreement 3 (smaller)**: The pre-seeded fixture catalog isn't explicitly named in the spec, but the spec uses "5-10" loosely. The Skeptic insists on **7 with named grounding per fixture**, NOT operator-discretion. Synthetic fixtures sneak in when "5-10" is the only constraint. Memory entries + SKILL.md rules are the only legitimate grounding sources.

## What this rubric/fixture set will STILL miss

**Blind spot 1 — Compound failures**: A variant that scores 0.85 on every individual fixture but fails when fixtures are chained (e.g., bundle-gate output feeds path-discipline input). Real-world dispatch chains multiple steps; our fixtures test in isolation. **Mitigation deferred to a hypothetical 005-chain-fixtures follow-on packet** — out of scope here.

**Blind spot 2 — Grader drift over loop lifetime**: Even with cache-keyed-on-rubric-version, the grader model itself can update mid-loop (Anthropic ships sonnet patches). If iter-7 uses a different sonnet build than iter-2, scores aren't comparable. **Mitigation: pin grader model build via API model-version header; record build hash in cache key.** If build hash changes mid-loop: abort, restart with fresh cache. This is NOT in the proposed rig spec yet — gap to flag in council-report.md.

**Blind spot 3 — Adversarial fixture coverage is thin (just fix-004)**. Real SWE 1.6 failures include prompt-injection (untrusted input embedded in fixture data), markdown-rendering escape, and unicode-homoglyph fooling. We test 1 path-traversal. A motivated attacker class isn't covered. Acceptable for v1 — flag for v2 follow-on.

**Blind spot 4 — Cost vs quality tradeoff isn't a dimension**. A variant that scores 0.78 in 2 SWE 1.6 dispatches per fixture and a variant that scores 0.80 in 5 dispatches per fixture aren't fairly compared. The rubric measures quality only. **Mitigation: synthesis.md MUST report dispatches-per-fixture alongside variant score**, and 004 picks based on quality/cost ratio, not raw quality. Flag for synthesis script.

**Blind spot 5 — The rubric itself was designed without seeing actual SWE 1.6 output on these fixtures**. We're optimizing against predicted failure modes; reality may surface failures we didn't anticipate. The first iteration's output should be human-reviewed before convergence detection is trusted. **Recommend: REQ-NEW in 003 spec — iter-1 output triggers manual sanity-review gate before iter-2 starts.**
