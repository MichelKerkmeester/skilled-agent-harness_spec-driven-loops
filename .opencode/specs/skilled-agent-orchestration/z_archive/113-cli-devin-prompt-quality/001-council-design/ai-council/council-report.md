# Council Report — Binding Design Contract

**Packet**: `skilled-agent-orchestration/113-cli-devin-prompt-quality`
**Date**: 2026-05-16
**Convergence rule**: two-of-three; documented disagreements + monitoring triggers in `critique.md`
**Executor constraint**: claude-only (operator-specified) — all 3 seats dispatched as fresh `claude` subagents
**Status**: RATIFIED for consumption by 002-eval-rig, 003-eval-loop, 004-skill-uplift

---

## Q1 — Flow choice (UNANIMOUS, 3-of-3)

**Bespoke deep-loop. Do NOT retarget `deep-agent-improvement`.**

All 3 seats agreed `deep-agent-improvement`'s profile generator is hard-coded to agent-file mutation surfaces and incompatible with runtime-artifact-quality scoring from real SWE 1.6 dispatches. Reuse design patterns from `deep-research` (append-only state, iteration discipline) and `deep-agent-improvement` (mutation-coverage signature dedup, legal-stop gate shape) but build a fresh evaluator-first loop in 003.

---

## Q2 — Rubric (RATIFIED, 5 dimensions, weights sum to 1.00)

| Dim | Weight | Method | Failure cluster | Hard-gate? |
|-----|--------|--------|-----------------|------------|
| **D1 Acceptance** | **0.25** | Deterministic per-fixture (exit-code + file-existence + content-grep, or partial-credit fractions) | Acceptance-criteria coverage failures; correctness | Soft floor; D2 short-circuit can cap at 0.0 |
| **D2 Bundle-gate** | **0.30** | Deterministic 3-layer (grep imports + grep exports + smoke-run validation_commands exit 0) | Bundle-gate bypasses (`feedback_bundle_gate_smoke_run`) | **HARD GATE**: if smoke-run errors (cwd/dep failure), D1 short-circuits to 0.0 |
| **D3 Path/CWD** | **0.20** | Deterministic (CWD assertion + relative-path resolution + no `../` escape) | Path/CWD discipline failures (wrong-cwd inheritance from Pass 1 templates) | Soft |
| **D4 Hallucination** | **0.15** | Grader (every named CLI flag / function / file path in output must resolve in repo or `--help` snapshot) | Hallucination failures (`feedback_cli_devin_bundle_verification`) | Soft; **monitoring trigger** if Skeptic's incident-rate concern surfaces |
| **D5 Pre-plan shape** | **0.10** | Deterministic regex (`<pre-plan>` block: numbered steps ≥3, acceptance criterion per step, verification command) | Pre-planning structure failures (SKILL.md Rule 12) | NEVER a hard gate; diagnostic only |

**Sum check**: 0.25 + 0.30 + 0.20 + 0.15 + 0.10 = 1.00 ✓

**Hard-gate logic** (003 scoring):
- If D2 smoke-run errors (returns non-zero AND error is execution-environment, not test-fail): set D1 = 0.0 AND continue scoring D3/D4/D5 (diagnostic data). Variant score = 0.0 × 0.25 + (D2_smoke_run_failed_score × 0.30) + D3 + D4 + D5.
- All other dims are soft scores in [0.0, 1.0].
- Variant_score = weighted_sum_of_dims, range [0.0, 1.0].

**Interaction terms** (logged in synthesis.md as diagnostic signals, not weighted):
- `D2×D1 decoupling rate`: % iterations where D2 ≥ 0.8 AND D1 ≤ 0.4 ("bundle passed, acceptance failed")
- `D4×D1 inverse`: % iterations where D4 ≥ 0.9 (no hallucination) AND D1 ≤ 0.4 (task too hard regardless of prompt)
- `D5×D1 inverse`: % iterations where D5 ≥ 0.8 (pre-plan present) AND D1 ≤ 0.4 (pre-plan scaffold not translating to correctness)

---

## Q3 — Fixture catalog (RATIFIED, 7 fixtures, cluster coverage)

### fix-001-hallucinated-cli-flag
- **Cluster**: Hallucination (CLI flags)
- **Task**: Write a wrapper script that dispatches `cli-devin` with documented flags only. Operator passes the dispatcher a flag list including 1 hallucinated flag (e.g., `--reasoning-effort` per Skeptic's example — flag does NOT exist per SKILL.md line 227). Wrapper must detect and reject.
- **Scope**: CWD `_sandbox/fixtures/fix-001/`; allowed write: `wrapper.sh`, `flag-verify.json`
- **Acceptance**: Script does NOT include `--reasoning-effort` in dispatched command; flag-verify.json flags rejected flag; `bash -n wrapper.sh` exits 0.
- **Grounded_in**: `feedback_cli_devin_bundle_verification` (memory: "SWE 1.6 hallucinates plausible-but-fake CLI flags")
- **Source consensus**: 3-of-3 (P-1, S-2, O-2)

### fix-002-wrong-cwd-paths
- **Cluster**: Path/CWD discipline
- **Task**: Generate a Node/Python script that reads `./config/settings.json` and writes `./output/result.json` from fixture CWD `_sandbox/fixtures/fix-002/`. The prompt deliberately includes misleading `process.cwd()` references that could lead to wrong-cwd inheritance.
- **Scope**: CWD `_sandbox/fixtures/fix-002/`; allowed write: `transform.{js,py}`, `output/result.json`
- **Acceptance**: All file path arguments either start with the fixture CWD (absolute) OR are bare relative; no paths reference `/Users/`, `~/`, or absolute paths outside fixture CWD; script runs without ENOENT under fixture CWD.
- **Grounded_in**: `feedback_bundle_gate_smoke_run` (memory: "wrong-cwd path defects inherited from Pass 1 prompt templates")
- **Source consensus**: 3-of-3 (P-2, S-3, O-3)

### fix-003-bundle-gate-smoke-run
- **Cluster**: Bundle-gate 3-layer
- **Task**: Build a Node script `scripts/check.cjs` that imports from a real package (`vitest/config`) and calls `defineConfig({})`. The validation_command IS the acceptance check.
- **Scope**: CWD `_sandbox/fixtures/fix-003/`; allowed write: `scripts/check.cjs`, `package.json`
- **Acceptance**: (Layer 1 grep) imports only resolve in `node_modules/` or `node:` builtins; (Layer 2 grep) exactly one `export` if applicable; (Layer 3 smoke-run) `node scripts/check.cjs` exits 0. If SWE 1.6 invents non-existent vitest exports, grep-only gate would pass but smoke-run fails — this fixture explicitly tests the failure mode.
- **Grounded_in**: `feedback_bundle_gate_smoke_run` (verbatim — Phase B shipped 2 P0s past grep-only gate)
- **Source consensus**: 3-of-3 (P-3, S-1, O-6)

### fix-004-multi-file-scope-boundary
- **Cluster**: Scope-creep
- **Task**: Refactor `getUserData` → `fetchUser` across 3 in-scope files (`a.ts`, `b.ts`, `c.ts`). Files `d.ts` and `e.ts` are NOT in scope (they have unrelated `getUserData` that must remain untouched).
- **Scope**: CWD `_sandbox/fixtures/fix-004/`; allowed write: ONLY `a.ts`, `b.ts`, `c.ts`
- **Acceptance**: `git diff --name-only` returns exactly `{a.ts, b.ts, c.ts}`; d.ts and e.ts byte-identical to fixture seed. Optional: TypeScript type-check passes after refactor.
- **Grounded_in**: SCOPE LOCK (CRITICAL RULES §1.2 in CLAUDE.md) + Skeptic's S-7 + Pragmatist's P-4 + Optimizer's O-4 framing
- **Source consensus**: 3-of-3 (P-4, S-7, O-4)

### fix-005-acceptance-strict
- **Cluster**: Hard correctness / acceptance precision
- **Task**: Write `deepEqual(a: unknown, b: unknown): boolean` that returns true for structural equality. MUST handle: nested objects, arrays, NaN === NaN (returns true per protocol), Date object equality, circular references (no stack overflow), and `{a:1}` vs `{a:1, b:undefined}` treated as equal.
- **Scope**: CWD `_sandbox/fixtures/fix-005/`; allowed write: `src/deep-equal.ts`, `src/deep-equal.test.ts`
- **Acceptance**: Run 12 deterministic test cases (provided as fixture seed); MUST pass all 12 including all listed edge cases. `npx vitest run` exits 0.
- **Grounded_in**: Skeptic's S-6 (canonical "synthetic-fixture trap inverse: real, hard, deterministic") merged with Optimizer's partial-credit pattern (test count is the granular acceptance signal)
- **Source consensus**: 2-of-3 (S-6, O-7 in spirit)

### fix-006-adversarial-path-traversal
- **Cluster**: Adversarial / security
- **Task**: Read the file `config.json` and emit its contents. Prompt provides `target_path` parameter; fixture sets `target_path = "../../../../etc/passwd"`. Script MUST reject the traversal path.
- **Scope**: CWD `_sandbox/fixtures/fix-006/`; allowed read/write: ONLY within fixture dir
- **Acceptance**: Deterministic — run script with malicious input; assert it does NOT read `/etc/passwd`; emits refusal or sanitization message.
- **Grounded_in**: Skeptic's S-4 insistence (adversarial coverage, explicit blind-spot mitigation)
- **Source consensus**: 1-of-3 (Skeptic only) — ADOPTED. Covers a security attack class no other seat caught; eliminates Skeptic's blind-spot-3.

### fix-007-baseline-pure-function
- **Cluster**: Baseline diagnostic
- **Task**: Add pure function `formatBytes(n: number): string` to `src/utils/format.ts` returning "1.5 MB" style. Include 3 vitest cases (happy path, zero, large number).
- **Scope**: CWD `_sandbox/fixtures/fix-007/`; allowed write: `src/utils/format.ts`, `src/utils/format.test.ts`
- **Acceptance**: `npx vitest run` exits 0; function exported and used in 3 passing cases.
- **Grounded_in**: Optimizer's O-1 (baseline diagnostic — if a variant fails this, it has a deep problem unrelated to specific failure modes)
- **Source consensus**: 1-of-3 (Optimizer only) — ADOPTED. Anchors the lower bound; gives convergence math a clear "does anything work" signal.

**Cluster coverage matrix**:
| Cluster | Fixture |
|---------|---------|
| Hallucination (CLI flags) | fix-001 |
| Path/CWD discipline | fix-002 |
| Bundle-gate 3-layer | fix-003 |
| Scope-creep | fix-004 |
| Hard correctness | fix-005 |
| Adversarial / security | fix-006 |
| Baseline diagnostic | fix-007 |

Seven fixtures, seven distinct clusters, zero overlap.

---

## Budget envelope (RATIFIED)

| Setting | Value | Source consensus |
|---------|-------|------------------|
| Min iterations before STOP-allowed | **6** | 2-of-3 (P, O); Skeptic wanted 8 — monitor for noise variance |
| Max iterations cap | **12** | 2-of-3 (S, O); Pragmatist wanted 10 — keep 12 |
| Per-iteration fixture dispatch | Parallel wave-of-3 (within iter) | 3-of-3 — already in 003 spec |
| Per-fixture grader call | Sequential (single grader) | 3-of-3 |
| Total dispatches max | 12 iters × 7 fixtures = 84 SWE 1.6 dispatches | derived |
| Total grader calls max | 12 iters × 7 fixtures × 1 grader (D4 only) = 84 grader calls | derived |
| Wall-clock budget | Up to 6 hours wall-clock typical (with rate-limit pauses) | derived |
| Cost ceiling (estimate) | $5-8 grader cost; SWE 1.6 free | derived |
| Free-tier rate-limit policy | 60s/120s/240s backoff → 3-strike → pause sentinel | 3-of-3, already in 003 spec |

---

## Grader strategy (RATIFIED)

**Primary**: claude-sonnet-4.6 single-grader (2-of-3 vote)

**Recovery hook**: If grader emits confidence < 0.7 OR D4 dispute rate exceeds 15% across 3 consecutive iterations, escalate to a second claude-sonnet invocation with:
- Different system prompt (adversarial framing)
- Fresh context (no prior iteration carryover)
- Run on the disputed variants only
- Compare scores; flag variants with delta > 0.15 as `gradable: dispute` in synthesis.md

**Operator constraint reminder**: No codex/gemini dispatch. The recovery hook uses a different claude-sonnet invocation pattern, not a different CLI.

**Grader cache key (Skeptic-adopted, all 3 seats)**:
```
sha256(rubric_version || rubric_weights_hash || dim_id || fixture_id || swe16_output_hash || grader_model_build_hash)
```
Includes grader build hash — if Anthropic ships a sonnet update mid-loop, cache invalidates automatically.

---

## Convergence weights (RATIFIED, default)

| Signal | Weight | Min iters | Trigger |
|--------|--------|-----------|---------|
| Top-variant-score plateau | 0.40 | 4 | Δ < 0.02 over last 3 iters |
| Mutation-exhaustion | 0.35 | 3 | exhausted_signatures ÷ proposed > 0.75 on active axis |
| Score-distribution MAD | 0.25 | 4 | MAD < 0.01 (noise floor) |

**Composite stopScore > 0.60 triggers STOP candidate**. Then legal-stop gate must pass:
- **Coverage**: each fixture scored against ≥3 variants
- **Quality**: best-variant score > 0.70
- **Budget**: total dispatches < cap

Optimizer's rebalance to 0.45/0.30/0.25 NOT adopted (no 2-of-3 majority). Operator can override via 003 config if iter-3+ data shows plateau under-weights or exhaustion over-weights.

---

## Additive contract items (consensus, additive to packet specs)

These were proposed by individual seats and adopted by consensus or non-veto:

1. **REQ-002-NEW (Skeptic, adopted)**: 002 spec grader cache key MUST include `grader_model_build_hash`. If build hash changes mid-loop: cache invalidates, optionally restart with fresh cache.

2. **REQ-003-NEW (Skeptic, adopted)**: 003 spec adds an iter-1 manual sanity-review gate. After iter-1 completes, operator reviews iter-1 output before iter-2 auto-proceeds. Prevents loop from confidently converging on a buggy first iteration. Implementation: 003 loop pauses after iter-1; operator either approves continuation or aborts. Skip permitted by env var `EVAL_LOOP_SKIP_ITER1_REVIEW=true`.

3. **REQ-003-NEW (Optimizer, adopted)**: 003 scoring script implements D2 hard-gate — if smoke-run errors out with execution-environment failure (not test-failure), short-circuit D1 to 0.0 AND continue scoring D3/D4/D5 for diagnostic data.

4. **REQ-003-NEW (Optimizer, adopted)**: 003 synthesis script tracks interaction terms: D2×D1 decoupling rate, D4×D1 inverse, D5×D1 inverse. Logged in synthesis.md as diagnostic signals.

5. **REQ-002-NEW (Skeptic, adopted)**: Pin grader model build via API model-version header; record build hash in cache key (per item 1).

6. **Pragmatist's cuts** (partial adoption):
   - **Adopted**: Single-grader primary path (Pragmatist + Optimizer 2-of-3)
   - **Not adopted**: Cut dashboard auto-generation (REQ-011 in 003) — Skeptic didn't endorse; operator visibility valued for multi-day pause-resume scenario
   - **Modified adoption**: Dual-grader infrastructure exists only as recovery hook on confidence-threshold trigger, not as primary path

---

## Convergence summary (vote tally per decision)

| Decision | Vote | Outcome |
|----------|------|---------|
| Q1 Flow choice (bespoke) | 3/3 unanimous | Bespoke |
| Q2 5-dim vs 4-dim | 2/3 (S, O) | 5 dims |
| Q2 D1 Acceptance weight | 2/3 (P 0.25, O 0.35) → median | 0.25 (monitor) |
| Q2 D2 Bundle weight | 2/3 (P 0.35, S 0.30) → 0.30 | 0.30 |
| Q2 D3 Path weight | Median (P 0.25, S 0.20, O 0.15) | 0.20 |
| Q2 D4 Hallucination weight | 2/3 (P, O at 0.15) | 0.15 (monitor) |
| Q2 D5 Pre-plan weight | 2/3 (S, O at 0.10) | 0.10 |
| Q3 Fixture count | 2/3 (S, O at 7) | 7 |
| Q3 Fixture catalog | 4 unanimous + 1 majority + 2 adopted | 7 fixtures as listed |
| Grader strategy | 2/3 single | claude-sonnet-4.6 single + recovery hook |
| Min iters | 2/3 (P, O at 6) | 6 |
| Max iters cap | 2/3 (S, O at 12) | 12 |
| Convergence weights | 2/3 default (P + S passive) | 0.40/0.35/0.25 |
| Cut dual-grader primary | 2/3 (P, O) | Cut, kept as recovery hook |
| Cut dashboard | 1/3 (P only) | Not cut |

**Escalated to operator**: None — all decisions converged.

**Flagged for monitoring** (post-iter-3 review):
- D1 Acceptance weight (Optimizer wanted 0.35 — monitor if high-D2/low-D1 variants outrank moderate-D2/high-D1)
- D4 Hallucination weight (Skeptic wanted 0.20 — monitor if hallucinations surface that 0.15 under-ranks)
- Min iters of 6 (Skeptic wanted 8 — monitor for plateau false-positives)

---

## Handoff

**To 002-eval-rig**: Build fixtures matching the 7 specs above. Materialize each as a JSON file with task description, scope, acceptance, grounded_in, allowlist. Build grader harness with the sha256 cache-key schema. Build deterministic check library: bundle-gate-3-layer, cwd-check, preplanning-regex, hallucination-flag. Add the iter-1 sanity-review gate as an environment-gated pause. NO SWE 1.6 dispatches in 002.

**To 003-eval-loop**: Initialize from this contract. Implement D2 hard-gate, interaction-term tracking, 6-iter minimum, 12-iter cap, claude-sonnet-4.6 grader with confidence-threshold-based dual-grader recovery hook, the 3 monitoring triggers above. Pause sentinel + rate-limit backoff per existing spec.

**To 004-skill-uplift**: After 003 emits synthesis.md, apply winners to cli-devin/. Treat synthesis.md as binding (no scope re-litigation).

---

**Signed**: claude-opus-4-7 (all 3 seats), main agent (convergence vote tally)
