---
title: "Implementation Summary: Eval Rig"
description: "Placeholder — populated post-build after dry-run gate passes and operator signs off."
trigger_phrases:
  - "113/002 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/002-eval-rig"
    last_updated_at: "2026-05-16T20:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Built rig; dry-run gate ALL PASS"
    next_safe_action: "Hand off to 003-eval-loop"
    blockers: []
    key_files:
      - "lib/cache.cjs"
      - "grader/harness.cjs"
      - "grader/dispute.cjs"
      - "scripts/dry-run.cjs"
      - "scripts/iter1-sanity-gate.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114025"
      session_id: "114-002-summary"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 113-cli-devin-prompt-quality-arc/002-eval-rig |
| **Completed** | 2026-05-16 |
| **Level** | 3 |
| **Dry-run gate** | ALL PASS (5/5 subtests) |
| **Total files** | 22 (7 fixtures + 6 cjs/scripts + 2 grader + 2 prompts + 3 canned outputs + 1 .gitignore + 1 dry-run.cjs) |
| **Operator constraint** | claude-only — no codex/gemini/devin dispatches in build |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Rig is operational. 22 files implement the eval pipeline: 7 council-ratified fixtures (one per failure cluster), a 4-script deterministic library catching bundle-gate / cwd / pre-plan / hallucination regressions, a sha256-keyed dual-cache (det + grader) with atomic temp+rename writes and mkdir-based 5-min-TTL advisory locking, a claude-sonnet grader harness with dispute-resolver recovery hook, an iter-1 manual sanity-review gate honoring the council's Skeptic-adopted REQ-NEW, and a dry-run orchestrator validating the whole pipeline against 3 canned outputs without burning a single SWE 1.6 dispatch. Every subtest passes; verify-no-swe16-dispatch grep confirms zero external CLI calls in the build itself.

### Eval Rig Architecture

- **Fixtures (`fixtures/fix-NNN-<slug>/task.json`)** declare task description, scope (CWD + allowed writes), acceptance criteria (typed: grep / grep_absent / deterministic command / git_diff_paths), grounded_in citation, and a per-fixture allowlist (cli_flags + symbols) that hallucination-flag.cjs uses as ground truth. Each fixture maps to a distinct failure cluster: hallucinated CLI flag (fix-001), wrong-cwd paths (fix-002), bundle-gate smoke-run (fix-003), multi-file scope-boundary (fix-004), acceptance-strict deepEqual (fix-005), adversarial path-traversal (fix-006), baseline pure-function diagnostic (fix-007).
- **Deterministic library (`scripts/deterministic/*.cjs`)** runs each fixture's variant output through 4 scores. bundle-gate.cjs implements the 3-layer check from `feedback_bundle_gate_smoke_run` (imports grep + exports grep + smoke-run validation_command) and emits `hard_gate_failed: true` on environment failures so 003 can short-circuit D1 to 0.0 per council's adopted Optimizer ADR. cwd-check.cjs classifies every path-like token into 4 buckets; any traversal_attempt zeroes the score. preplanning-regex.cjs scores the `<pre-plan>` block on presence + ≥3 numbered steps + per-step acceptance + verification command. hallucination-flag.cjs gates on the fixture allowlist plus a built-in COMMON_ALLOWLIST of JS/Node/test-framework symbols (with JS keywords explicitly excluded so `while(...)` and `if(...)` are not flagged as fake function calls).
- **Cache (`lib/cache.cjs` + `cache/{det,grader}/`)** derives sha256-prefix keys for det and grader cache separately so a grader-model rev doesn't invalidate det results. Grader key includes `rubric_version` AND `grader_model_build_hash` so an Anthropic-side sonnet rev mid-loop forces re-grade automatically (council additive item REQ-002-NEW). Writes are temp+rename atomic; concurrent contention serialized via per-key mkdir locks with 5-min stale-clear. `cache/.gitignore` keeps `*.out.md` blobs out of version control while preserving `index.jsonl` as empty placeholders.
- **Grader (`grader/harness.cjs` + `grader/dispute.cjs`)** composes the system prompt from `prompts/system-grader.md`, dispatches via `claude --print --model claude-sonnet-4-5 -p <prompt>` (real mode), parses the response into rubric-shape JSON with 3-tier parse fallback (strict → fenced code → bare object → score-regex). For 002's dry-run gate, dispatch uses `mock` mode with 4 canned shapes verifying every parse path. dispute.cjs implements the council's confidence-threshold escalation: `confidence < 0.7` OR D4 dispute rate > 15% across 3 iters triggers a second adversarial claude call (operator constraint: same CLI, different system prompt at `prompts/system-skeptic.md`) and reports median + delta + dispute flag.
- **Iter-1 sanity gate (`scripts/iter1-sanity-gate.cjs`)** is invoked by 003 after iter-1 completes. Reads the iteration row from eval-loop-state.jsonl, prints D1-D5 breakdown, prompts the operator interactively, exits 0 on approval. `EVAL_LOOP_SKIP_ITER1_REVIEW=true` bypasses for automated runs (Skeptic blind-spot-5 mitigation per council additive REQ-003-NEW).
- **Dry-run gate (`scripts/dry-run.cjs`)** orchestrates 5 subtests: test-cache (100 concurrent writes, verify no torn entries), test-deterministic (score 3 canned outputs through 4 checks, assert directional thresholds), test-grader-stub (verify 4 parser paths), test-cache-reconstruct (corrupt index, rebuild, verify count), verify-no-swe16-dispatch (grep the build for forbidden tokens). Exits 0 iff all 5 pass.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `fixtures/fix-001-hallucinated-cli-flag/task.json` through `fix-007-baseline-pure-function/task.json` | Created (7) | Council-ratified fixture definitions with grounded_in citations |
| `lib/cache.cjs` | Created | sha256-keyed dual-cache; atomic temp+rename; mkdir lock; build-hash invalidation |
| `scripts/deterministic/bundle-gate.cjs` | Created | 3-layer bundle check with hard-gate signal for D2 short-circuit |
| `scripts/deterministic/cwd-check.cjs` | Created | Path/CWD discipline (D3) |
| `scripts/deterministic/preplanning-regex.cjs` | Created | Pre-plan structure check (D5) |
| `scripts/deterministic/hallucination-flag.cjs` | Created | Allowlist gate for D4 (deterministic primary; grader adds semantic) |
| `grader/harness.cjs` | Created | D4 grader dispatcher; claude --print -p; 3-tier parse fallback |
| `grader/dispute.cjs` | Created | Confidence-threshold dual-grader recovery |
| `grader/prompts/system-grader.md` | Created | Primary grader system prompt |
| `grader/prompts/system-skeptic.md` | Created | Adversarial dispute-resolver system prompt |
| `scripts/iter1-sanity-gate.cjs` | Created | Manual review gate (REQ-003-NEW from council) |
| `scripts/dry-run.cjs` | Created | 5-subtest pipeline validator |
| `scripts/dry-run-fixtures/{passing,failing,parse-error}.canned.md` | Created (3) | Canned outputs for deterministic scoring verification |
| `scripts/cache-reconstruct.cjs` | Created | Rebuild index.jsonl from blobs after corruption |
| `cache/{det,grader}/index.jsonl` | Created (empty) | Initial cache indices |
| `cache/.gitignore` | Created | Exclude blob runtime artifacts; preserve empty index placeholders |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Build proceeded in 4 phases. Phase 1 set up the cache layer + reconstruct script + first two deterministic checks (cwd-check, preplanning-regex) — the original dispatch agent landed these before hitting an API error mid-build. Phase 2 (main agent direct work after the agent dispatch failed, per memory `feedback_cli_dispatch_unreliability.md`) added the remaining two deterministic checks (bundle-gate, hallucination-flag), the grader harness + dispute + two system prompts, the iter-1 sanity gate, fixture task.json files, canned outputs, and dry-run orchestrator. Phase 3 ran the dry-run gate and hit two failures: (a) hallucination flagged JS keywords (`while`, `if`) as fake function calls and didn't treat dotted-path symbols whose tail was in COMMON_ALLOWLIST as legitimate; (b) the no-dispatch grep self-matched its own pattern literal. Both fixed in <5 min: hallucination-flag got a JS_KEYWORDS exclusion set + segment-walk for allowlist; dry-run.cjs builds the grep pattern via string concatenation so the source line doesn't contain the forbidden token sequence. Phase 4 re-ran dry-run: all 5 subtests PASS.

No grader calls were made during the build (operator constraint: claude-only and no live API spend in 002). The grader harness is wired correctly but only invokable from 003. Stale dry-run-test cache entries were cleaned before commit; `cache/.gitignore` keeps future runtime blobs out of git.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Separate det/grader caches (ADR-001) | Free-tier credit conservation; det results survive grader model swaps |
| Sha256 key prefix (32 chars not 64) | Filesystem-friendly filenames; sha256 collision-resistance still adequate at 128-bit prefix |
| Mkdir-based advisory lock (not fcntl) | Cross-fs portability; mkdir is POSIX-atomic; 5-min stale-clear handles dead-process locks |
| JS_KEYWORDS exclusion in hallucination-flag | `while(...)`, `if(...)`, `switch(...)` look like function calls to the regex but aren't symbols; without exclusion, every valid script flags positive |
| Common-allowlist segment walk for dotted symbols | `value.toFixed()` should pass even though `value` isn't allowlisted, because `toFixed` is a well-known Number method |
| Grader dispatch via execFileSync (not async spawn) | 002 dry-run uses mock mode only; 003 will run real grader serially; sync API simpler for the sole call site |
| Adversarial second-grader uses same CLI + different system prompt | Operator constraint (claude-only); council ADR settled this over Skeptic's preferred cross-CLI dispute pattern |
| Empty parse-error.canned.md scores 0/det but doesn't crash | Boundary case: empty output must produce score 0.0 deterministically without exception so 003 records the failure rather than skipping the iteration |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command / Artifact | Result |
|-------|--------------------|--------|
| REQ-001: fixture count matches council | `ls fixtures/*/task.json \| wc -l` returns 7 | PASS |
| REQ-002: grader returns rubric JSON | dry-run `--test-grader-stub` verifies all 4 parse paths return well-formed `{dim_id, score, confidence, ...}` | PASS |
| REQ-003: cache atomic + sha256-keyed | dry-run `--test-cache` writes 100 entries: 100 written, 0 missing, 0 unreadable, 100 index rows | PASS |
| REQ-004: deterministic 4-script coverage | dry-run `--test-deterministic` runs all 4 checks on 3 canned outputs; 7/7 directional assertions PASS | PASS |
| REQ-005: dry-run gate exit 0 | `node scripts/dry-run.cjs --full` exits 0 with `ALL PASS` summary | PASS |
| REQ-006: no SWE 1.6 dispatches | dry-run verify subtest greps with concatenated pattern; 0 matches in scripts/grader/lib | PASS |
| REQ-007: dual-grader dispute detection | dispute.cjs implements `shouldEscalateToDualGrader` (confidence-trigger + dispute-rate-trigger) and `dualGraderInvocation` (median + delta + dispute flag); not exercised in 002 (003 invokes at iter time) | IMPLEMENTED (deferred runtime test to 003) |
| REQ-008: per-key mkdir advisory lock | lib/cache.cjs `acquireLock` with 5-min stale-clear; 100-concurrent test passed without torn entries | PASS |
| REQ-009: cache-reconstruct script | dry-run `--test-cache-reconstruct` corrupts index, rebuilds; 5/5 rows recovered | PASS |
| REQ-010: det vs grader cache separation | Verified by ADR-001 in decision-record.md + distinct `derive_det_key` / `derive_grader_key` signatures with different input sets | PASS |
| strict-validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/113-cli-devin-prompt-quality-arc/002-eval-rig --strict` | TO RUN |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fixture seed files not materialized.** Each `task.json` declares a `scope.cwd` that must exist on disk at iter time, but the seed/ subdirectories are empty in this commit. 003-eval-loop materializes the seed scenarios (e.g., the 5 .ts files for fix-004, the 12 vitest cases for fix-005, the malicious config for fix-006) immediately before iter-1 dispatch. This decoupling lets 002 ship without committing scenario test data that would inflate the repo.

2. **Grader model build hash is a placeholder.** Cache keys hardcode `claude-sonnet-4.6@2026-04-01` today. 003 must capture the real `anthropic-organization-id` + model-version header at first grader call and update `GRADER_MODEL_BUILD_HASH_PLACEHOLDER` in lib/cache.cjs to the actual value.

3. **Dual-grader path not exercised in 002.** dispute.cjs is wired but never invokes a real grader during the rig dry-run. 003 must exercise the recovery hook with a real low-confidence response to verify the dispute branch produces parseable output and the median calculation is sane.

4. **Hallucination check tolerance is heuristic.** The COMMON_ALLOWLIST is hand-curated; novel valid libraries (e.g., a freshly-released test framework) may register false positives on the first run. 003 should surface false-positive examples in synthesis.md so 004 (or a follow-on) can expand the allowlist.

5. **Bundle-gate smoke-run requires the fixture cwd to exist.** When the seed directory is empty (limitation #1), Layer 3 returns `hard_gate_failed: true` with a clear error message. 003 is expected to materialize seeds before dispatch, and the hard_gate signal will short-circuit D1 only on TRUE environment failures, not missing-seed misconfiguration.
<!-- /ANCHOR:limitations -->
