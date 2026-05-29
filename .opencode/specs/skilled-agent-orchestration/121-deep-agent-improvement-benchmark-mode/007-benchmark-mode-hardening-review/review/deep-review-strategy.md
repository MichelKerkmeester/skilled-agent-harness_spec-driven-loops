---
title: Deep Review Strategy - session 120+121 dual-executor review
description: Session tracking for the 10-iteration dual-executor (gpt-5.5 + MiniMax M2.7) deep review of the session's authored code and docs.
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for this deep-review session. Tracks dimension coverage, P0/P1/P2 findings, what worked/failed, and next focus across 10 iterations alternating two executors over the session 120+121 authored work.

---

## 2. TOPIC
Review the session's authored code + docs: the deep-agent-improvement `model-benchmark` mode build (121/003 — `loop-host.cjs`, `dispatch-model.cjs`, the ported 5-dim scorer + grader, mode-aware records) and the MiniMax provider integration (120 — cli-opencode + sk-prompt skill edits). Dimensions: correctness, security, traceability, maintainability.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants - iteration 1 gpt-5.5 found 3 P1 issues
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization, command injection in spawned CLIs
- [ ] D3 Traceability, Spec/code alignment (research.md build-delta vs shipped code), decision-record vs implementation, doc accuracy
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Reviewing the 168 auto-generated 120/121 spec/iteration artifacts (workflow logs, not authored code)
- Fixing findings (READ-ONLY review; remediation is a follow-on packet)
- Re-auditing the 120/003 eval-rig original source (reviewed only as the port baseline)

---

## 5. STOP CONDITIONS
- Convergence: rolling newFindingsRatio < 0.10 with claim-adjudication satisfied
- Max iterations: 10
- All 4 dimensions reviewed by BOTH models (gpt-5.5 + MiniMax)

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | FAIL | 1 | 3 P1 findings: benchmark route skips dispatcher, dispatcher cwd is not honored across executors, D3 cwd checker has a prefix-boundary false negative. |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 3 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +3 P1, +0 P2

[Findings tracked in `deep-review-findings-registry.json`.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
- Direct line-number review found the highest-risk correctness surfaces quickly: mode routing, executor cwd propagation, and scorer path containment.
- The v2 search ledger captured both findings and ruled-out directions for unknown-mode fallback, EC-5 ordering, and hard-gate math.

---

## 9. WHAT FAILED
- The review graph is unavailable, so coverage used direct reads plus exact `rg` searches.
- The first pass did not deeply inspect the 120 MiniMax skill docs because the iteration focus was the 121/003 core build code.

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach is exhausted]

---

## 11. RULED OUT DIRECTIONS
- Unknown-mode fallback regression: ruled out by `resolveMode()` and `loop-host.vitest.ts`.
- EC-5 materialize-before-benchmark ordering regression: ruled out by `planInvocation()` step order and the ordering test.
- Hard-gate weighted-score arithmetic: no defect found in `applyHardGate()` or rubric-weight summation during this pass.

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
D1 Correctness — second-executor pass with MiniMax should try to reproduce/contest DR-001-P1-001 through DR-001-P1-003, then widen to the 120 MiniMax integration files for correctness-only issues.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
- The work was built + unit-tested THIS session: vitest 10 files / 116 tests green, alignment-drift PASS (0 findings), TST-1 byte-identity gate passing, a real model-benchmark smoke run (3/3, aggregateScore 100).
- **Dual-executor plan** (each dimension gets BOTH models): iter 1/3/5/7/9 → cli-codex `gpt-5.5` high/fast; iter 2/4/6/8/10 → cli-opencode `minimax/MiniMax-M2.7`. Dimension cycle: D1 (i1 codex, i2 minimax), D2 (i3,i4), D3 (i5,i6), D4 (i7,i8), then cross-cutting/adversarial verification of prior findings (i9 codex, i10 minimax).
- The scorer tree under `scripts/scorer/` was PORTED from 120/003 eval-rig; the det-checks + grader + cache are largely verbatim (review the decouple seam + the new `score-model-variant.cjs` wrapper most closely; the verbatim ports carry lower novelty risk).
- MiniMax M2.7 held the 3-artifact contract on 5/7 dispatches in 121/002 — budget for occasional missed iterations; post_dispatch_validate catches them.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 1 | `spec.md:127` requires dispatcher routing; shipped benchmark route does not invoke `dispatch-model.cjs`. |
| `checklist_evidence` | core | fail | 1 | Tests cover loop-host ordering/scorer basics but not dispatcher runtime wiring or cwd propagation. |
| `skill_agent` | overlay | pending | - | cli-opencode/sk-prompt skill edits |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
**121/003 build code (highest scrutiny — new, authored):**
- scripts/loop-host.cjs, scripts/dispatch-model.cjs, scripts/scorer/score-model-variant.cjs
- scripts/score-candidate.cjs (mode-field edit), scripts/run-benchmark.cjs (mode-field edit)
- scripts/tests/loop-host.vitest.ts, scripts/tests/scorer.vitest.ts

**Ported scorer machinery (lower novelty — verbatim from 120/003):**
- scripts/scorer/deterministic/{bundle-gate,cwd-check,hallucination-flag,preplanning-regex}.cjs
- scripts/scorer/grader/{harness,dispute}.cjs + prompts/{system-grader,system-skeptic}.md
- scripts/scorer/lib/cache.cjs

**120 skill edits (MiniMax integration):**
- cli-opencode/{SKILL.md, assets/prompt_quality_card.md, assets/prompt_templates.md, changelog/v1.3.4.0.md, graph-metadata.json, references/cli_reference.md}
- sk-prompt/assets/{cli_prompt_quality_card.md, model-profiles.json}
- sk-prompt-small-model/{SKILL.md, references/pattern-index.md}

**Authored design/research docs:**
- 121/001 decision-record.md, 121/002 research/research.md, 121/003 spec.md
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Severity threshold: P2
- Review target type: files (29-file curated scope)
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent]
- Executors: cli-codex gpt-5.5 (high/fast) alternating with cli-opencode minimax/MiniMax-M2.7
- Findings registry: `deep-review-findings-registry.json`
- Started: see config
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 11
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **checklist_evidence:** Spec is Level 1 Priority P2, Status Complete; no checklist.md required. TST-1 + planning + EC ordering tests present (loop-host.vitest.ts). -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **checklist_evidence:** Spec is Level 1 Priority P2, Status Complete; no checklist.md required. TST-1 + planning + EC ordering tests present (loop-host.vitest.ts).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence:** Spec is Level 1 Priority P2, Status Complete; no checklist.md required. TST-1 + planning + EC ordering tests present (loop-host.vitest.ts).

### **doc-drift (REQ-004 literal "--cwd" ↔ implementation):** WARN — acceptance wording says det-checks accept `--cwd`; implementation decouples via absolute virtual-fixture cwd instead. Recommend updating REQ-004 wording or adding the literal flag (tracked as P2 #7). -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **doc-drift (REQ-004 literal "--cwd" ↔ implementation):** WARN — acceptance wording says det-checks accept `--cwd`; implementation decouples via absolute virtual-fixture cwd instead. Recommend updating REQ-004 wording or adding the literal flag (tracked as P2 #7).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **doc-drift (REQ-004 literal "--cwd" ↔ implementation):** WARN — acceptance wording says det-checks accept `--cwd`; implementation decouples via absolute virtual-fixture cwd instead. Recommend updating REQ-004 wording or adding the literal flag (tracked as P2 #7).

### **spec_code (REQ-001 / TST-1, spec.md:125 ↔ loop-host.vitest.ts:44-71):** PASS — TST-1 asserts byte-identical plan for default vs `--mode=agent-improvement` and identical fallback for unknown mode (EC-2). Planner/executor split makes the identity gate assert plans without spawning. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **spec_code (REQ-001 / TST-1, spec.md:125 ↔ loop-host.vitest.ts:44-71):** PASS — TST-1 asserts byte-identical plan for default vs `--mode=agent-improvement` and identical fallback for unknown mode (EC-2). Planner/executor split makes the identity gate assert plans without spawning.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (REQ-001 / TST-1, spec.md:125 ↔ loop-host.vitest.ts:44-71):** PASS — TST-1 asserts byte-identical plan for default vs `--mode=agent-improvement` and identical fallback for unknown mode (EC-2). Planner/executor split makes the identity gate assert plans without spawning.

### **spec_code (REQ-002, spec.md:126 ↔ loop-host.cjs:71-76 + run-benchmark.cjs:288-339):** PASS — materialize → run-benchmark → `benchmark-complete` record is produced. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **spec_code (REQ-002, spec.md:126 ↔ loop-host.cjs:71-76 + run-benchmark.cjs:288-339):** PASS — materialize → run-benchmark → `benchmark-complete` record is produced.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (REQ-002, spec.md:126 ↔ loop-host.cjs:71-76 + run-benchmark.cjs:288-339):** PASS — materialize → run-benchmark → `benchmark-complete` record is produced.

### **spec_code (REQ-004, spec.md:133 ↔ score-model-variant.cjs):** PASS — scorer is decoupled (primitive criteria, absolute-cwd guard, buildGraderFn). The "active scorer" gap is a documented §7 P2 follow-on, not a REQ-004 miss. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **spec_code (REQ-004, spec.md:133 ↔ score-model-variant.cjs):** PASS — scorer is decoupled (primitive criteria, absolute-cwd guard, buildGraderFn). The "active scorer" gap is a documented §7 P2 follow-on, not a REQ-004 miss.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (REQ-004, spec.md:133 ↔ score-model-variant.cjs):** PASS — scorer is decoupled (primitive criteria, absolute-cwd guard, buildGraderFn). The "active scorer" gap is a documented §7 P2 follow-on, not a REQ-004 miss.

### `120_skill_edit_guidance`: NOT FOUND. No skill-edit docs found in the 120 MiniMax spec tree; safe-command guidance not present as a risk surface. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `120_skill_edit_guidance`: NOT FOUND. No skill-edit docs found in the 120 MiniMax spec tree; safe-command guidance not present as a risk surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `120_skill_edit_guidance`: NOT FOUND. No skill-edit docs found in the 120 MiniMax spec tree; safe-command guidance not present as a risk surface.

### `agent_cross_runtime`: PARTIAL (unchanged). `dispatch-model.cjs` has five executor branches; cwd handling is only effective for `cli-opencode`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime`: PARTIAL (unchanged). `dispatch-model.cjs` has five executor branches; cwd handling is only effective for `cli-opencode`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: PARTIAL (unchanged). `dispatch-model.cjs` has five executor branches; cwd handling is only effective for `cli-opencode`.

### `agent_cross_runtime`: partial. `dispatch-model.cjs:118` has executor branches, but `loop-host.cjs:73` still does not invoke the dispatcher in the model-benchmark route. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. `dispatch-model.cjs:118` has executor branches, but `loop-host.cjs:73` still does not invoke the dispatcher in the model-benchmark route.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. `dispatch-model.cjs:118` has executor branches, but `loop-host.cjs:73` still does not invoke the dispatcher in the model-benchmark route.

### `agent_cross_runtime`: PARTIAL. `dispatch-model.cjs` has branches for five CLI executors, but cwd handling is only effective for `cli-opencode`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime`: PARTIAL. `dispatch-model.cjs` has branches for five CLI executors, but cwd handling is only effective for `cli-opencode`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: PARTIAL. `dispatch-model.cjs` has branches for five CLI executors, but cwd handling is only effective for `cli-opencode`.

### `backoff_testability`: ADVISORY due DR-007-P2-002. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `backoff_testability`: ADVISORY due DR-007-P2-002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `backoff_testability`: ADVISORY due DR-007-P2-002.

### `cache_assumptions`: PASS. Cache uses PACKET_ROOT-relative path (`path.join(PACKET_ROOT, 'cache')`) derived from `__dirname` at `cache.cjs:30`. This is consistent and predictable; no gitignored-path assumptions found. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `cache_assumptions`: PASS. Cache uses PACKET_ROOT-relative path (`path.join(PACKET_ROOT, 'cache')`) derived from `__dirname` at `cache.cjs:30`. This is consistent and predictable; no gitignored-path assumptions found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `cache_assumptions`: PASS. Cache uses PACKET_ROOT-relative path (`path.join(PACKET_ROOT, 'cache')`) derived from `__dirname` at `cache.cjs:30`. This is consistent and predictable; no gitignored-path assumptions found.

### `cache_file_writes`: PASS. cache.cjs uses mkdtempSync + rename for atomic writes; no TOCTOU race. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `cache_file_writes`: PASS. cache.cjs uses mkdtempSync + rename for atomic writes; no TOCTOU race.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `cache_file_writes`: PASS. cache.cjs uses mkdtempSync + rename for atomic writes; no TOCTOU race.

### `checklist_evidence`: FAIL (unchanged). Tests cover loop-host ordering and scorer basics but not dispatcher runtime wiring or cwd propagation across executors. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: FAIL (unchanged). Tests cover loop-host ordering and scorer basics but not dispatcher runtime wiring or cwd propagation across executors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: FAIL (unchanged). Tests cover loop-host ordering and scorer basics but not dispatcher runtime wiring or cwd propagation across executors.

### `checklist_evidence`: FAIL (unchanged). TST-1 remains a plan-equality test, not a byte-identical state JSONL run (spec.md:125). No evidence the scorer is exercised through the benchmark path. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `checklist_evidence`: FAIL (unchanged). TST-1 remains a plan-equality test, not a byte-identical state JSONL run (spec.md:125). No evidence the scorer is exercised through the benchmark path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: FAIL (unchanged). TST-1 remains a plan-equality test, not a byte-identical state JSONL run (spec.md:125). No evidence the scorer is exercised through the benchmark path.

### `checklist_evidence`: fail. `loop-host.vitest.ts:44` still checks plan identity, not byte-identical state JSONL; `scorer.vitest.ts:50` exercises the ported scorer directly but not the active benchmark runner seam. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `checklist_evidence`: fail. `loop-host.vitest.ts:44` still checks plan identity, not byte-identical state JSONL; `scorer.vitest.ts:50` exercises the ported scorer directly but not the active benchmark runner seam.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail. `loop-host.vitest.ts:44` still checks plan identity, not byte-identical state JSONL; `scorer.vitest.ts:50` exercises the ported scorer directly but not the active benchmark runner seam.

### `checklist_evidence`: fail. Existing scorer tests cover passing/failing grep criteria, but no test covers command allowlisting, cwd containment, or out-of-range grader scores. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: fail. Existing scorer tests cover passing/failing grep criteria, but no test covers command allowlisting, cwd containment, or out-of-range grader scores.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail. Existing scorer tests cover passing/failing grep criteria, but no test covers command allowlisting, cwd containment, or out-of-range grader scores.

### `checklist_evidence`: FAIL. The existing tests cover `loop-host` ordering and scorer basics, but no dispatch-model test covers cwd propagation or runtime wiring from benchmark mode to the executor map. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: FAIL. The existing tests cover `loop-host` ordering and scorer basics, but no dispatch-model test covers cwd propagation or runtime wiring from benchmark mode to the executor map.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: FAIL. The existing tests cover `loop-host` ordering and scorer basics, but no dispatch-model test covers cwd propagation or runtime wiring from benchmark mode to the executor map.

### `checklist_evidence`: FAIL. TST-1 is still a plan equality test (`loop-host.vitest.ts:44-63`), not a byte-identical state JSONL run as claimed in `spec.md:125`. Scorer tests do not cover D2/D3/D5 behavior. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `checklist_evidence`: FAIL. TST-1 is still a plan equality test (`loop-host.vitest.ts:44-63`), not a byte-identical state JSONL run as claimed in `spec.md:125`. Scorer tests do not cover D2/D3/D5 behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: FAIL. TST-1 is still a plan equality test (`loop-host.vitest.ts:44-63`), not a byte-identical state JSONL run as claimed in `spec.md:125`. Scorer tests do not cover D2/D3/D5 behavior.

### `config_loading_fragility`: PASS. `dispatch-model.cjs:118` builds the spawn spec safely with explicit arg arrays; no fragile config loading found in the benchmark path. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `config_loading_fragility`: PASS. `dispatch-model.cjs:118` builds the spawn spec safely with explicit arg arrays; no fragile config loading found in the benchmark path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `config_loading_fragility`: PASS. `dispatch-model.cjs:118` builds the spawn spec safely with explicit arg arrays; no fragile config loading found in the benchmark path.

### `criteria_command_execution`: FAIL (P1 unchanged). String `execSync` in score-model-variant.cjs:103 and bundle-gate.cjs:153. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `criteria_command_execution`: FAIL (P1 unchanged). String `execSync` in score-model-variant.cjs:103 and bundle-gate.cjs:153.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `criteria_command_execution`: FAIL (P1 unchanged). String `execSync` in score-model-variant.cjs:103 and bundle-gate.cjs:153.

### `criteria_command_execution`: fail. The scorer and bundle gate execute fixture/criteria command strings with `execSync`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `criteria_command_execution`: fail. The scorer and bundle gate execute fixture/criteria command strings with `execSync`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `criteria_command_execution`: fail. The scorer and bundle gate execute fixture/criteria command strings with `execSync`.

### `cwd_path_escape`: FAIL (P1 unchanged from iter 3). cwd-relative path resolution with `path.resolve(cwdAbs, rawPath)` and `startsWith` check (cwd-check.cjs:86) still allows sibling-prefix traversal. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `cwd_path_escape`: FAIL (P1 unchanged from iter 3). cwd-relative path resolution with `path.resolve(cwdAbs, rawPath)` and `startsWith` check (cwd-check.cjs:86) still allows sibling-prefix traversal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `cwd_path_escape`: FAIL (P1 unchanged from iter 3). cwd-relative path resolution with `path.resolve(cwdAbs, rawPath)` and `startsWith` check (cwd-check.cjs:86) still allows sibling-prefix traversal.

### `cwd_path_escape`: fail. The scorer requires an absolute cwd but does not constrain cwd to the repo or ensure criterion file paths remain under that cwd. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `cwd_path_escape`: fail. The scorer requires an absolute cwd but does not constrain cwd to the repo or ensure criterion file paths remain under that cwd.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `cwd_path_escape`: fail. The scorer requires an absolute cwd but does not constrain cwd to the repo or ensure criterion file paths remain under that cwd.

### `feature_catalog_code`: not assessed in this correctness iteration. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `feature_catalog_code`: not assessed in this correctness iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: not assessed in this correctness iteration.

### `feature_catalog_code`: not re-reviewed this iteration; prior pass evidence remains. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `feature_catalog_code`: not re-reviewed this iteration; prior pass evidence remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: not re-reviewed this iteration; prior pass evidence remains.

### `feature_catalog_code`: PASS for MiniMax catalog consistency in `model-profiles.json` and the small-model pattern index. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `feature_catalog_code`: PASS for MiniMax catalog consistency in `model-profiles.json` and the small-model pattern index.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: PASS for MiniMax catalog consistency in `model-profiles.json` and the small-model pattern index.

### `grader_dispatch_security`: PASS. harness.cjs:119 uses `execFileSync(CLAUDE_BIN, args, ...)` with argv array — safe, no shell string. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `grader_dispatch_security`: PASS. harness.cjs:119 uses `execFileSync(CLAUDE_BIN, args, ...)` with argv array — safe, no shell string.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `grader_dispatch_security`: PASS. harness.cjs:119 uses `execFileSync(CLAUDE_BIN, args, ...)` with argv array — safe, no shell string.

### `maintainability_test_quality`: FAIL due DR-007-P2-001 and the existing TST-1 evidence gap. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `maintainability_test_quality`: FAIL due DR-007-P2-001 and the existing TST-1 evidence gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `maintainability_test_quality`: FAIL due DR-007-P2-001 and the existing TST-1 evidence gap.

### `maintainability_test_quality`: FAIL due to DR-007-P2-001 (subsumed) and the persistent TST-1 evidence gap. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `maintainability_test_quality`: FAIL due to DR-007-P2-001 (subsumed) and the persistent TST-1 evidence gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `maintainability_test_quality`: FAIL due to DR-007-P2-001 (subsumed) and the persistent TST-1 evidence gap.

### `mode_field_writer_persistence`: pass for direct record writers. `score-candidate.cjs:430`/`:622` include `mode: 'agent-improvement'`; `run-benchmark.cjs:326`/`:355` include `mode: 'model-benchmark'`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `mode_field_writer_persistence`: pass for direct record writers. `score-candidate.cjs:430`/`:622` include `mode: 'agent-improvement'`; `run-benchmark.cjs:326`/`:355` include `mode: 'model-benchmark'`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode_field_writer_persistence`: pass for direct record writers. `score-candidate.cjs:430`/`:622` include `mode: 'agent-improvement'`; `run-benchmark.cjs:326`/`:355` include `mode: 'model-benchmark'`.

### `mode_metadata_reduction`: fail. Reducer and dashboard do not surface mode metadata despite spec lines `95` and `112`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `mode_metadata_reduction`: fail. Reducer and dashboard do not surface mode metadata despite spec lines `95` and `112`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `mode_metadata_reduction`: fail. Reducer and dashboard do not surface mode metadata despite spec lines `95` and `112`.

### `monkey_patch_footprint`: ADVISORY. dispute.cjs global fs patch is contained but is a code smell. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `monkey_patch_footprint`: ADVISORY. dispute.cjs global fs patch is contained but is a code smell.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `monkey_patch_footprint`: ADVISORY. dispute.cjs global fs patch is contained but is a code smell.

### `playbook_capability`: not assessed in this correctness iteration. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `playbook_capability`: not assessed in this correctness iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: not assessed in this correctness iteration.

### `playbook_capability`: not re-reviewed this iteration; prior pass evidence remains. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `playbook_capability`: not re-reviewed this iteration; prior pass evidence remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: not re-reviewed this iteration; prior pass evidence remains.

### `scorer_seam_clean`: PASS. `score-model-variant.cjs` is a clean decoupled entry point with primitive criteria + absolute cwd. The port comment (lines 7-21) accurately describes the design. No stale 120/003 fixture-file assumptions remain in the scorer entry point itself. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `scorer_seam_clean`: PASS. `score-model-variant.cjs` is a clean decoupled entry point with primitive criteria + absolute cwd. The port comment (lines 7-21) accurately describes the design. No stale 120/003 fixture-file assumptions remain in the scorer entry point itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `scorer_seam_clean`: PASS. `score-model-variant.cjs` is a clean decoupled entry point with primitive criteria + absolute cwd. The port comment (lines 7-21) accurately describes the design. No stale 120/003 fixture-file assumptions remain in the scorer entry point itself.

### `secrets_exposure`: advisory. Cache keys are hashes, but raw grader output is persisted. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `secrets_exposure`: advisory. Cache keys are hashes, but raw grader output is persisted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `secrets_exposure`: advisory. Cache keys are hashes, but raw grader output is persisted.

### `skill_agent`: not assessed in this correctness iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: not assessed in this correctness iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: not assessed in this correctness iteration.

### `skill_agent`: not assessed in this correctness pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent`: not assessed in this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: not assessed in this correctness pass.

### `skill_agent`: PASS (unchanged from iter 7). MiniMax docs are internally consistent. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `skill_agent`: PASS (unchanged from iter 7). MiniMax docs are internally consistent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS (unchanged from iter 7). MiniMax docs are internally consistent.

### `skill_agent`: PASS for the 120 MiniMax docs slice. MiniMax slug, direct provider, TIDD-EC + dense pre-plan, and variant caveat agree across `cli-opencode`, `sk-prompt`, and `sk-prompt-small-model`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `skill_agent`: PASS for the 120 MiniMax docs slice. MiniMax slug, direct provider, TIDD-EC + dense pre-plan, and variant caveat agree across `cli-opencode`, `sk-prompt`, and `sk-prompt-small-model`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS for the 120 MiniMax docs slice. MiniMax slug, direct provider, TIDD-EC + dense pre-plan, and variant caveat agree across `cli-opencode`, `sk-prompt`, and `sk-prompt-small-model`.

### `spawned_cli_arg_injection`: PASS (ruled out). `dispatchReal` uses `execFileSync` with argv array; `buildSpawnSpec` constructs args safely. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spawned_cli_arg_injection`: PASS (ruled out). `dispatchReal` uses `execFileSync` with argv array; `buildSpawnSpec` constructs args safely.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spawned_cli_arg_injection`: PASS (ruled out). `dispatchReal` uses `execFileSync` with argv array; `buildSpawnSpec` constructs args safely.

### `spawned_cli_arg_injection`: pass. `dispatch-model.cjs` builds argv arrays and calls `spawnSync(spec.bin, spec.args, ...)`; Codex receives the prompt through stdin. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spawned_cli_arg_injection`: pass. `dispatch-model.cjs` builds argv arrays and calls `spawnSync(spec.bin, spec.args, ...)`; Codex receives the prompt through stdin.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spawned_cli_arg_injection`: pass. `dispatch-model.cjs` builds argv arrays and calls `spawnSync(spec.bin, spec.args, ...)`; Codex receives the prompt through stdin.

### `spec_code`: FAIL (unchanged). `run-benchmark.cjs:114` still calls `scoreFixture()` directly; `score-model-variant.cjs` is never imported. The spec.md:133 seam requirement is not met. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `spec_code`: FAIL (unchanged). `run-benchmark.cjs:114` still calls `scoreFixture()` directly; `score-model-variant.cjs` is never imported. The spec.md:133 seam requirement is not met.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: FAIL (unchanged). `run-benchmark.cjs:114` still calls `scoreFixture()` directly; `score-model-variant.cjs` is never imported. The spec.md:133 seam requirement is not met.

### `spec_code`: FAIL (unchanged). `spec.md:127` requires the generic dispatcher route; `loop-host.cjs:73-75` and `run-benchmark.cjs:274-275` do not invoke `dispatch-model.cjs`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: FAIL (unchanged). `spec.md:127` requires the generic dispatcher route; `loop-host.cjs:73-75` and `run-benchmark.cjs:274-275` do not invoke `dispatch-model.cjs`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: FAIL (unchanged). `spec.md:127` requires the generic dispatcher route; `loop-host.cjs:73-75` and `run-benchmark.cjs:274-275` do not invoke `dispatch-model.cjs`.

### `spec_code`: FAIL. `spec.md:127` requires the generic dispatcher route, but `loop-host.cjs:73-75` and `run-benchmark.cjs:274-275` do not invoke `dispatch-model.cjs`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: FAIL. `spec.md:127` requires the generic dispatcher route, but `loop-host.cjs:73-75` and `run-benchmark.cjs:274-275` do not invoke `dispatch-model.cjs`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: FAIL. `spec.md:127` requires the generic dispatcher route, but `loop-host.cjs:73-75` and `run-benchmark.cjs:274-275` do not invoke `dispatch-model.cjs`.

### `spec_code`: FAIL. Existing P1s remain: `run-benchmark.cjs` still bypasses the decoupled scorer (`spec.md:133`, `run-benchmark.cjs:114`), promotion still overclaims model-benchmark support, and det-check CLIs still use fixture JSON rather than explicit `--cwd`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `spec_code`: FAIL. Existing P1s remain: `run-benchmark.cjs` still bypasses the decoupled scorer (`spec.md:133`, `run-benchmark.cjs:114`), promotion still overclaims model-benchmark support, and det-check CLIs still use fixture JSON rather than explicit `--cwd`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: FAIL. Existing P1s remain: `run-benchmark.cjs` still bypasses the decoupled scorer (`spec.md:133`, `run-benchmark.cjs:114`), promotion still overclaims model-benchmark support, and det-check CLIs still use fixture JSON rather than explicit `--cwd`.

### `spec_code`: fail. Prior P1s remain active for missing dispatcher invocation (`loop-host.cjs:73`), scorer seam bypass (`run-benchmark.cjs:114`), and promotion status mismatch (`promote-candidate.cjs:168`). This iteration adds reducer/dashboard mode metadata evidence (`reduce-state.cjs:608`, `reduce-state.cjs:889`, `reduce-state.cjs:1094`). -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `spec_code`: fail. Prior P1s remain active for missing dispatcher invocation (`loop-host.cjs:73`), scorer seam bypass (`run-benchmark.cjs:114`), and promotion status mismatch (`promote-candidate.cjs:168`). This iteration adds reducer/dashboard mode metadata evidence (`reduce-state.cjs:608`, `reduce-state.cjs:889`, `reduce-state.cjs:1094`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail. Prior P1s remain active for missing dispatcher invocation (`loop-host.cjs:73`), scorer seam bypass (`run-benchmark.cjs:114`), and promotion status mismatch (`promote-candidate.cjs:168`). This iteration adds reducer/dashboard mode metadata evidence (`reduce-state.cjs:608`, `reduce-state.cjs:889`, `reduce-state.cjs:1094`).

### `unsafe_deserialization`: FAIL (P1 unchanged). Grader JSON parsing still accepts unbounded numeric scores. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `unsafe_deserialization`: FAIL (P1 unchanged). Grader JSON parsing still accepts unbounded numeric scores.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `unsafe_deserialization`: FAIL (P1 unchanged). Grader JSON parsing still accepts unbounded numeric scores.

### `unsafe_deserialization`: fail. Grader JSON parsing accepts any numeric score and the regex fallback accepts score-only text. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `unsafe_deserialization`: fail. Grader JSON parsing accepts any numeric score and the regex fallback accepts score-only text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `unsafe_deserialization`: fail. Grader JSON parsing accepts any numeric score and the regex fallback accepts score-only text.

### checklist_evidence: FAIL. TST-1 tests plan equality, not byte-identical state JSONL; scorer tests call the ported scorer directly but do not prove run-benchmark uses it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: checklist_evidence: FAIL. TST-1 tests plan equality, not byte-identical state JSONL; scorer tests call the ported scorer directly but do not prove run-benchmark uses it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: FAIL. TST-1 tests plan equality, not byte-identical state JSONL; scorer tests call the ported scorer directly but do not prove run-benchmark uses it.

### feature_catalog_code: PASS for MiniMax registry coverage in model-profiles.json and sk-prompt-small-model dispatch matrix. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: feature_catalog_code: PASS for MiniMax registry coverage in model-profiles.json and sk-prompt-small-model dispatch matrix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: PASS for MiniMax registry coverage in model-profiles.json and sk-prompt-small-model dispatch matrix.

### mode field persistence: PASS. score-candidate and run-benchmark include mode on success and infra_failure records. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: mode field persistence: PASS. score-candidate and run-benchmark include mode on success and infra_failure records.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: mode field persistence: PASS. score-candidate and run-benchmark include mode on success and infra_failure records.

### no loop.cjs discovery: PASS. The shipped loop-host.cjs honors the 002 discovery that there is no loop.cjs to modify. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: no loop.cjs discovery: PASS. The shipped loop-host.cjs honors the 002 discovery that there is no loop.cjs to modify.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: no loop.cjs discovery: PASS. The shipped loop-host.cjs honors the 002 discovery that there is no loop.cjs to modify.

### playbook_capability: PASS for cli-opencode reference coverage of the minimax provider/model and variant caveat. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: playbook_capability: PASS for cli-opencode reference coverage of the minimax provider/model and variant caveat.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability: PASS for cli-opencode reference coverage of the minimax provider/model and variant caveat.

### skill_agent: PASS for the MiniMax docs slice reviewed. cli-opencode cards/templates, model-profiles, and sk-prompt-small-model index all expose MiniMax M2.7, minimax-api quota pool, TIDD-EC + dense pre-plan, and the --variant caveat. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: skill_agent: PASS for the MiniMax docs slice reviewed. cli-opencode cards/templates, model-profiles, and sk-prompt-small-model index all expose MiniMax M2.7, minimax-api quota pool, TIDD-EC + dense pre-plan, and the --variant caveat.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: PASS for the MiniMax docs slice reviewed. cli-opencode cards/templates, model-profiles, and sk-prompt-small-model index all expose MiniMax M2.7, minimax-api quota pool, TIDD-EC + dense pre-plan, and the --variant caveat.

### spec_code: FAIL. REQ-002 and REQ-004 overclaim active scorer and promotion behavior. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: spec_code: FAIL. REQ-002 and REQ-004 overclaim active scorer and promotion behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: FAIL. REQ-002 and REQ-004 overclaim active scorer and promotion behavior.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
