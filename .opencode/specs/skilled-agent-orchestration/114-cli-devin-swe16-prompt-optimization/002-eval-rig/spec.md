---
title: "Feature Specification: Eval Rig for cli-devin SWE 1.6 Optimization"
description: "Build the packet-local eval rig: fixtures, grader harness with dispute detection, sha256-keyed cache layer, deterministic-check regex library. Testable in isolation via dry-run on canned outputs. NO SWE 1.6 dispatches in this packet."
trigger_phrases:
  - "114/002 eval rig"
  - "cli-devin fixtures"
  - "grader harness"
  - "deterministic-check library"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization/002-eval-rig"
    last_updated_at: "2026-05-16T19:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded eval-rig spec"
    next_safe_action: "Read 001 council-report.md, materialize fixture catalog"
    blockers:
      - "Depends on 001-council-design council-report.md being ratified first"
    key_files:
      - "fixtures/"
      - "grader/harness.cjs"
      - "cache/index.jsonl"
      - "scripts/dry-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000114002"
      session_id: "114-002-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Grader model wire-up: claude-sonnet vs codex-gpt-5.5 (council picks)"
      - "Cache eviction: time-based, size-based, or none"
    answered_questions:
      - "No SWE 1.6 dispatches in this packet (verified by dry-run gate)"
      - "Atomic temp+rename for cache writes; mkdir-based per-key advisory lock"
      - "Separate caches for deterministic results vs grader results"
---
# Feature Specification: Eval Rig for cli-devin SWE 1.6 Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Build the load-bearing infrastructure for the bespoke deep-loop: a fixture set (5–10 tasks grounded in documented SWE 1.6 failure modes), a grader harness that dispatches a stronger LLM to score outputs against rubrics, a sha256-keyed cache layer that survives across iterations and operator-paused runs, and a deterministic-check library that handles bundle-gate compliance, path/cwd validation, and pre-planning regex matching. Verifiable in isolation: dry-run on canned outputs proves scoring pipeline produces expected scores before any real SWE 1.6 dispatch is made.

**Key Decisions**: Cache schema (separate det/grader caches); grader harness dispute-detection logic; deterministic vs grader split per rubric dim

**Critical Dependencies**: 001-council-design `council-report.md` ratified (rubric + fixtures + grader model + budget envelope)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (114 phase parent) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The eval loop in 003 needs (a) a fixture set grounded in real failure modes (not synthetic), (b) a grader harness that produces reproducible scores, (c) a cache that survives free-tier rate-limit pauses, (d) deterministic checks that don't burn grader calls on regex-checkable signals. Building these inline with the loop conflates infrastructure bugs with loop logic bugs. Memory: `feedback_bundle_gate_smoke_run` shows grep-only gates miss wrong-cwd defects — deterministic library must do more than regex.

### Purpose
Ship a rig that 003 consumes verbatim. Dry-run gate proves rig works on canned outputs before 003 commits real-model budget to it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `fixtures/fix-NNN-*.json` — 5–10 fixture files (count per council ratification), each with: task description, scope (CWD + allowed files), acceptance-criteria list, known-real CLI-flag allowlist for hallucination grading
- `grader/harness.cjs` — Node script that dispatches grader model (claude-sonnet-4.6 via cli-claude-code, OR codex-gpt-5.5-high via cli-codex; council picks), parses scores, returns rubric-shaped JSON; supports dual-grader with median + dispute detection
- `cache/index.jsonl` (append-only) + `cache/{key}.out.md` blobs; key = `sha256(variant_hash || fixture_id || swe16_version || recipe_hash)`; atomic temp+rename writes; per-key mkdir advisory lock
- `cache/det/` and `cache/grader/` — separate caches so deterministic results survive grader swaps
- `scripts/deterministic/bundle-gate.cjs` — checks output passes 3-layer bundle gate (grep imports, grep exports, smoke-run validation_commands)
- `scripts/deterministic/cwd-check.cjs` — verifies every path in output is absolute or relative-to-stated-cwd
- `scripts/deterministic/preplanning-regex.cjs` — checks pre-planning block presence + structural conformance
- `scripts/deterministic/hallucination-flag.cjs` — flags references to symbols/flags not in fixture's known-real allowlist
- `scripts/dry-run.cjs` — runs full scoring pipeline on canned outputs; exits 0 only if all expected scores match

### Out of Scope
- ANY SWE 1.6 dispatch (this is 003's domain)
- Council deliberation (001's domain)
- Modifying cli-devin skill (004's domain)
- Cross-fixture comparison or variant ranking (003's loop logic)
- Cache eviction policy automation (manual operator cleanup only)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-eval-rig/fixtures/fix-NNN-*.json` | Create | 5–10 task fixtures |
| `002-eval-rig/grader/harness.cjs` | Create | Grader dispatch + dispute detection |
| `002-eval-rig/cache/index.jsonl` | Create | Append-only cache index (initialized empty) |
| `002-eval-rig/cache/det/`, `cache/grader/` | Create | Separate cache directories |
| `002-eval-rig/scripts/deterministic/*.cjs` | Create | Deterministic check library (4 scripts) |
| `002-eval-rig/scripts/dry-run.cjs` | Create | Pipeline dry-run gate |
| `002-eval-rig/scripts/cache-reconstruct.cjs` | Create | Index rebuild from blobs if corrupted |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fixture set matches council-ratified count and grounding | `ls fixtures/*.json \| wc -l` returns N (5/7/10 per council); each file's `grounded_in` field cites a memory entry or playbook path |
| REQ-002 | Grader harness scores rubric-shape JSON | `grader/harness.cjs <fixture> <canned_output>` returns valid JSON matching rubric schema with all 5 dims |
| REQ-003 | Cache schema sha256-keyed + atomic writes | `scripts/dry-run.cjs --test-cache` writes 100 concurrent entries, all readable, no torn entries |
| REQ-004 | Deterministic library handles 4 check types | `scripts/dry-run.cjs --test-deterministic` runs bundle-gate, cwd-check, preplanning-regex, hallucination-flag on canned outputs; all return expected scores |
| REQ-005 | Dry-run gate exits 0 on canned outputs | `scripts/dry-run.cjs` exit code = 0 |
| REQ-006 | NO SWE 1.6 dispatches in this packet | `git status --short \| grep "002-eval-rig/cache/"`: cache dir empty of SWE 1.6 outputs; `grep -r "cli-devin\|devin --" 002-eval-rig/scripts/` returns nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Dual-grader dispute detection | `grader/harness.cjs --dual-grader` runs both grader models, flags rows where abs(A-B) > 0.15 on any dim |
| REQ-008 | Per-key mkdir advisory lock | `cache/.lock-<key>/` directory used as lock; stale-lock auto-clear at 5min |
| REQ-009 | Cache reconstruct script handles index corruption | `scripts/cache-reconstruct.cjs` rebuilds `cache/index.jsonl` from `cache/{det,grader}/*.out.md` blobs |
| REQ-010 | Deterministic-vs-grader cache separation | `cache/det/` survives grader model swap; `cache/grader/` invalidates on rubric change |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 003-eval-loop imports and runs the rig without modification
- **SC-002**: Dry-run gate passes on first attempt before any 003 dispatch
- **SC-003**: Cache survives a simulated 003 mid-run crash (re-running 003 finds cached results, doesn't re-dispatch)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001-council-design council-report.md ratified | Hard blocker — can't build rig without rubric / fixtures / grader choice | Pause until 001 complete |
| Risk | Grader model produces unparseable JSON | High (003 can't score) | Strict JSON schema validation in harness.cjs; fallback to regex extraction; flag invalid grader output as `parseFailure` |
| Risk | Cache key collision (different prompt variants hash same) | Low | sha256 is collision-resistant; key includes 4 inputs (variant + fixture + version + recipe) |
| Risk | Mkdir lock deadlock | M | 5min TTL stale-lock auto-clear |
| Risk | Deterministic checks miss subtle hallucinations (semantic vs syntactic) | M | Deterministic catches obvious; grader catches semantic; combined coverage |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Single grader call < 30s p95 (cli-claude-code with sonnet-4.6 typical)
- **NFR-P02**: Deterministic check suite (all 4) < 1s per output

### Security
- **NFR-S01**: Grader prompts never leak repo secrets; fixture allowlists scrubbed for tokens

### Reliability
- **NFR-R01**: Cache index append-only; partial writes never corrupt readable rows

---

## 8. EDGE CASES

### Data Boundaries
- Empty canned output: deterministic returns 0.0 across all dims; grader skipped
- Malformed JSON from grader: flag as `parseFailure`, retry once, then fail-closed

### Error Scenarios
- Grader model rate-limit hit during dry-run: backoff + retry; dry-run failure if 3 retries fail
- Cache disk-full mid-write: atomic temp+rename means no corruption; surface to operator

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | 4 deterministic scripts + grader harness + cache layer + 5-10 fixtures + dry-run gate |
| Risk | 10/25 | No live system impact; isolated to packet; no breaking API |
| Research | 8/20 | Reuse cache patterns from deep-research/state.jsonl; novel grader-dispute logic |
| Multi-Agent | 4/15 | Grader dispatches another model (1 external CLI per call) |
| Coordination | 6/15 | Depends on 001 contract; produces 003's inputs |
| **Total** | **46/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Grader produces unparseable JSON | H | M | Strict schema + fallback + parseFailure flag |
| R-002 | Cache index corruption mid-run | M | L | Append-only writes; cache-reconstruct.cjs rebuilds from blobs |
| R-003 | Deterministic checks miss real failures | M | M | Combined with grader; council-ratified rubric weights |
| R-004 | Mkdir lock deadlock | L | L | 5min TTL stale-clear |

---

## 11. USER STORIES

### US-001: 003 consumes the rig (Priority: P0)

**As** 003-eval-loop, **I want** to require the rig and score a fixture in 1 function call, **so that** I don't re-derive scoring logic during the iteration loop.

**Acceptance Criteria**:
1. Given a fixture and a canned output, When 003 calls `score(fixture, output)`, Then it returns rubric-shape JSON with deterministic + grader scores.

### US-002: Operator dry-runs the rig (Priority: P0)

**As an** operator preparing for 003, **I want** to run `scripts/dry-run.cjs` and see PASS/FAIL, **so that** I don't burn free-tier credits on a flawed rig.

**Acceptance Criteria**:
1. Given a clean rig, When operator runs `scripts/dry-run.cjs`, Then exit 0 means rig is ready for 003.
2. Given a corrupted cache, When operator runs `scripts/dry-run.cjs`, Then it reports the issue with file paths and exits non-zero.

## 12. OPEN QUESTIONS

- Cache eviction policy: none (manual cleanup) vs time-based (>30 days) vs size-based (>1GB)?
- Should grader prompt be templatized via sk-prompt or inline-authored in harness.cjs?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent**: `../spec.md`
- **Upstream**: `../001-council-design/ai-council/council-report.md`
- **Downstream**: `../003-eval-loop/spec.md`
