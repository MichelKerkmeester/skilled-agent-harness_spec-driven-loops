---
title: "Feature Specification: fix Opus review findings for two-lane code"
description: "Fix the 017 Opus review findings for two-lane code, including materializer fixture-id safety, criteria-exec gating, live documentation anchors, benchmark-mode promotion, and dispositions."
trigger_phrases:
  - "fix Opus review findings for two-lane code"
  - "017 deep-review findings fix"
  - "materializer fixture-id traversal fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/018-fix-opus-findings-for-two-lane-code"
    last_updated_at: "2026-05-29T17:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored 018 Level 3 remediation packet from 017 opus review"
    next_safe_action: "Implement W1 materializer guard then W2 exec gate"
    blockers: []
    key_files:
      - "../017-review-two-lane-workflow-with-opus/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-018-20260529"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: fix Opus review findings for two-lane code

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The 017 Opus deep review returned a CONDITIONAL verdict against the post-015 two-lane program. This packet remediates every active finding: 4 P1 (the materializer is a first-writer fixture-id traversal hole that the 015 run-benchmark sanitize never reached, the bundle-gate Layer-3 execSync path is a fail-open against a documented criteria-exec gate, three dead Mode-4 doc anchors misroute the orchestrating agent, and the Lane B promotion path is non-executable while its docs over-claim mode-aware promotion) and 13 P2 advisories spanning containment hardening, grader prompt-injection defense, cache read-integrity, source-attribution tags, and shared-helper extraction. Each finding gets exactly one disposition: FIXED with a test or adversarial check where applicable, or DOCUMENT-ACCEPT with rationale. The work keeps the in-scope vitest suite green and preserves the materializer-versus-run-benchmark byte-identity invariant.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 19 |
| **Predecessor** | 017-review-two-lane-workflow-with-opus |
| **Successor** | 019-align-skill-docs-and-consolidate-changelog |
| **Handoff Criteria** | All 4 P1 fixed-or-document-accepted; all 13 P2 fixed-or-document-accepted; every active finding carries exactly one disposition; the Lane B benchmark-mode promotion path is executable and the docs describe the resolved behavior; vitest green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of packet 121, remediation of the findings from the 017 Opus deep review (`017-review-two-lane-workflow-with-opus`, reviewer model Opus 4.8 (1M), verdict CONDITIONAL). Source of truth for findings: `../017-review-two-lane-workflow-with-opus/review/review-report.md`.

The 017 review re-audited the two-lane program in its post-015-remediation state. It confirmed the 015 fixes held with no regression, then surfaced a small cluster of real defects that 015 either did not reach or only half-closed. Lane A is agent-improvement (`/deep:start-agent-improvement-loop`). Lane B is model-benchmark (`/deep:start-model-benchmark-loop`). Scripts live under `scripts/{shared,agent-improvement,model-benchmark}/` plus `scripts/lib/` and `scripts/model-benchmark/scorer/`.

**Scope Boundary**: Resolve every active 017 finding (4 P1 + 13 P2) with exactly one disposition each: FIXED (real code or doc fix plus a test or adversarial check where applicable) or DOCUMENT-ACCEPT (an intended trusted-author boundary or arbiter-upheld deferral, recorded with explicit rationale). No silent drops. Changes stay inside `.opencode/skills/deep-agent-improvement/scripts/**`, the `.opencode/skills/deep-agent-improvement/SKILL.md`, the two Lane command docs (`start-model-benchmark-loop.md`, `start-agent-improvement-loop.md`), the Lane B auto YAML, and the advisor explicit-lane projection comment.

**Dependencies**: 017 review-report.md (findings, evidence, recommended fixes); the post-015 two-lane code shipped across 121/008-016.

**Deliverables**: code and doc fixes plus regression tests for every FIXED finding; a per-finding disposition register in decision-record.md; green vitest.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 017 deep review returned CONDITIONAL with four active P1 defects. The materializer (`materialize-benchmark-fixtures.cjs`) is the FIRST writer in the wired Lane B plan and writes `path.join(outputsDir, fixture.id + '.md')` with no id guard, so a hostile id escapes the outputs directory at materialization time even though the 015 fix hardened the second writer. The bundle-gate D2 hard-gate runs `execSync(acceptance.command)` with no `DEEP_AGENT_ALLOW_CRITERIA_EXEC` check, so the documented fail-closed guarantee is false the moment a profile defines a smoke-run or deterministic-plus-command acceptance under `--scorer 5dim`. Three command-doc anchors cite a Mode-4 heading that no longer exists in SKILL.md and instruct the orchestrating agent to focus on it. The Lane B promotion step is wired into the auto YAML but cannot execute, because `promote-candidate.cjs` hard-requires a scored agent candidate, and the docs over-claim mode-aware promotion that the promoter does not implement. Thirteen P2 advisories sit alongside these, covering containment, grader injection, cache integrity, attribution tags, and shared-helper drift.

### Purpose
Ship every active 017 finding closed with exactly one disposition: the first-writer traversal hole hardened with an adversarial test, the bundle-gate exec path routed through the documented gate, the Mode-4 anchors repointed to the live heading, and the Lane B promotion path made executable in benchmark mode with the docs corrected to describe the resolved behavior, so the two-lane program clears its CONDITIONAL verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F017-P1-01: port the `SAFE_FIXTURE_ID` guard into `materialize-benchmark-fixtures.cjs` before its `path.join` write, ideally via a shared helper, with a materializer hostile-id regression test
- F017-P1-02: route bundle-gate Layer-3 execSync through the `DEEP_AGENT_ALLOW_CRITERIA_EXEC` gate (early-return a skipped layer when the flag is 0), with a smoke-run no-execution regression test
- F017-P1-03: replace the three dead Mode-4 anchors with the live `§4 LANE B: MODEL-BENCHMARK` heading reference
- F017-P1-04: give `promote-candidate.cjs` a benchmark-mode promotion path (promote on a passing `benchmark-complete` report when `--benchmark-report` is provided, bypassing the agent-scored-file requirement), and correct every doc that claims mode-aware promotion to describe the resolved behavior (records/reducer are mode-aware, promotion gains a benchmark-mode branch)
- The 13 P2 advisories: each gets a FIXED or DOCUMENT-ACCEPT disposition (containment check, grader injection hardening, grader cache run-scope, score-cache inputHash verify, systemFitness ref sanitize, advisor comment, source-attribution tags, parse-args/integration-score/profile-resolve shared-helper extraction, dead-param/unused-resolver cleanup, Lane B headline framing)
- Regression tests for each FIXED finding where a test or adversarial check applies

### Out of Scope
- F017-P2-01 model-blind Lane B wiring: the wired Lane B loop scores the materialized reference, not a dispatched model. This is an arbiter-upheld DOCUMENT-ACCEPT deferral (122/007 to 014/015 F-P0-2). Only the residual doc over-claim is in scope, not wiring live model dispatch.
- Re-architecting the scorer, dispatcher, or promoter seams beyond the benchmark-mode branch
- New benchmark fixtures or profiles beyond what the fixes need

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/shared/materialize-benchmark-fixtures.cjs` | Modify | F017-P1-01 port `SAFE_FIXTURE_ID` guard before the outputs write |
| `scripts/lib/` (new shared helper) | Create | F017-P1-01 shared fixture-id guard; F017-P2-05 parse-args; F017-P2-09 profile-resolve; F017-P2-06 integration-score |
| `scripts/model-benchmark/scorer/deterministic/bundle-gate.cjs` | Modify | F017-P1-02 route Layer-3 execSync through the criteria-exec gate |
| `scripts/model-benchmark/scorer/score-model-variant.cjs` | Modify | F017-P2-03 grep/grep_absent containment check |
| `scripts/model-benchmark/scorer/grader/harness.cjs` | Modify | F017-P2-12 grader prompt-injection hardening |
| `scripts/model-benchmark/scorer/lib/cache.cjs` | Modify | F017-P2-13a grader cache run-scope plus key verify |
| `scripts/agent-improvement/score-candidate.cjs` | Modify | F017-P2-10 cache read inputHash verify; F017-P2-13b systemFitness ref sanitize |
| `scripts/shared/promote-candidate.cjs` | Modify | F017-P1-04 benchmark-mode promotion path |
| `scripts/shared/loop-host.cjs` | Modify | F017-P2-02 drop unused dispatch-model resolver entry |
| `scripts/model-benchmark/scorer/deterministic/cwd-check.cjs` | Modify | F017-P2-07 drop unused third parameter |
| `scripts/model-benchmark/dispatch-model.cjs` | Modify | F017-P2-08 normalize provenance tags; F017-P2-11 packet-qualify finding-id-shaped comments |
| `scripts/model-benchmark/run-benchmark.cjs` | Modify | F017-P2-11 packet-qualify finding-id-shaped comments |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Modify | F017-P1-03 Mode-4 anchors; F017-P1-04 promotion wording |
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Modify | F017-P1-03 Mode-4 anchor |
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Modify | F017-P1-04 promotion wording; F017-P2-01 Lane B headline framing |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml` | Modify | F017-P1-04 benchmark-mode promotion step; F017-P2-01 headline framing |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modify | F017-P2-04 two-node projection comment |
| `scripts/tests/*.vitest.ts` | Modify/Create | regression tests for each FIXED finding |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No regression | The in-scope vitest suite is green after all fixes; the existing run-benchmark and loop-host behavior is preserved |

### P1 - Required (complete OR documented-accept)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | F017-P1-01 materializer fixture-id traversal closed | The materializer rejects an id with separators, `..`, absolute syntax, or empty before its `path.join` write; a hostile-id regression test asserts the materializer refuses `../escaped` and writes nothing outside outputsDir; the guard is shared with run-benchmark so both writers enforce the same `SAFE_FIXTURE_ID` |
| REQ-003 | F017-P1-02 bundle-gate exec fail-closed | bundle-gate Layer-3 does not call execSync when `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0`; a smoke-run regression test asserts no execution under the flag; the documented SKILL.md gate guarantee becomes true for the bundle-gate path |
| REQ-004 | F017-P1-03 dead Mode-4 anchors repointed | All three Mode-4 references resolve to the live `§4 LANE B: MODEL-BENCHMARK` SKILL.md heading; `rg "Mode 4" SKILL.md` and the command docs no longer dangle |
| REQ-005 | F017-P1-04 Lane B promotion executable and doc-true | `promote-candidate.cjs` promotes a Lane B `report.json` with `status=benchmark-complete` and a passing recommendation when `--benchmark-report` is provided, bypassing the agent-scored-file requirement; the auto YAML promotion step is executable; SKILL.md, the command doc, and the YAML describe the resolved behavior (records and reducer are mode-aware, promotion gains a benchmark-mode branch) with no remaining over-claim; a benchmark-mode promotion regression test passes |
| REQ-006 | Every P2 dispositioned | Each of the 13 P2 advisories is FIXED with evidence or DOCUMENT-ACCEPT with rationale; no silent drops |
| REQ-007 | Per-finding disposition register | decision-record.md records exactly one disposition per active finding (4 P1 + 13 P2) with evidence or rationale |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The materializer refuses a hostile fixture id with the same `SAFE_FIXTURE_ID` rule as run-benchmark, proven by a passing regression test, and the bundle-gate Layer-3 path does not execute under `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0`.
- **SC-002**: The Lane B `report.json` benchmark-complete promotion path executes through `promote-candidate.cjs` and the docs describe the resolved behavior, with no remaining mode-aware-promotion over-claim and no dead Mode-4 anchor.
- **SC-003**: All 4 P1 and all 13 P2 findings carry exactly one disposition; FIXED items have evidence or a test, DOCUMENT-ACCEPT items have a rationale; vitest green with no regression.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Sharing the fixture-id guard perturbs the run-benchmark byte-identity invariant | Med | Extract a shared helper that both files require, with run-benchmark keeping identical reject semantics; assert identity in a test |
| Risk | The bundle-gate gate-skip changes a passing 5dim score for an existing profile | Med | Skip only when the flag is 0; shipped fixtures carry no command so the default path is unchanged; assert score parity for command-free profiles |
| Risk | The benchmark-mode promotion branch loosens the agent-canonical guarded path | High | Gate the bypass behind an explicit `--benchmark-report` argument and a passing benchmark-complete recommendation; the agent-scored path stays unchanged when no benchmark report is passed |
| Dependency | 017 review-report.md | Source of truth for findings, evidence, and recommended fixes | Present and pinned in the 017 packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Byte-identity | The shared fixture-id guard preserves run-benchmark reject semantics byte-for-byte |
| NFR-002 | Least privilege | bundle-gate Layer-3 fails closed under `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0`; criteria file reads are containment-bounded |
| NFR-003 | Guarded promotion | The benchmark-mode promotion branch requires an explicit `--benchmark-report` and a passing recommendation; the agent-canonical path is unchanged otherwise |
| NFR-004 | Doc truth | No doc claims behavior the code does not implement (mode-aware promotion, Mode-4 anchors, benchmark-a-model headline) |

---

## 8. EDGE CASES

- Materializer fixture id that is a plain basename, contains a separator, a backslash, `..`, absolute syntax, or is empty: only the plain basename is accepted, matching run-benchmark.
- bundle-gate acceptance with `type=smoke-run` under `DEEP_AGENT_ALLOW_CRITERIA_EXEC=0`: the layer is skipped, no execSync runs.
- `promote-candidate.cjs` invoked with `--benchmark-report` pointing at a report whose status is not `benchmark-complete` or whose recommendation does not pass: refused, not promoted.
- `promote-candidate.cjs` invoked without `--benchmark-report`: the existing agent-scored path is unchanged.
- Score cache entry whose embedded `inputHash` mismatches the recomputed hash: treated as a cache miss and rescored.

---

## 9. COMPLEXITY ASSESSMENT

Level 3. The packet touches multiple lane-separated scripts, the scorer hard gate, the shared promoter, several command and skill docs, the Lane B YAML, and the advisor projection comment, across security, correctness, traceability, and maintainability dimensions. The risk concentration is the benchmark-mode promotion branch (must not loosen the agent-canonical guarded path) and the bundle-gate gate-skip (must not change scores for command-free profiles). A decision-record is warranted because the Lane B promotion behavior is a shared resolved contract that multiple docs must describe identically.

---

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Shared fixture-id guard perturbs run-benchmark semantics | Low | Med | Both writers require one helper; identity asserted in test |
| bundle-gate gate-skip changes a command-free 5dim score | Low | Med | Skip only when flag is 0; assert parity for command-free profiles |
| Benchmark-mode promotion loosens the guarded path | Low | High | Bypass gated behind `--benchmark-report` plus a passing recommendation |
| A P2 disposition is dropped silently | Low | Med | Disposition register enumerates all 13 P2 with status |

---

## 11. USER STORIES

- As a security reviewer, I see the materializer reject a hostile fixture id before it writes, so a benchmark run cannot escape the outputs directory at materialization time.
- As a security reviewer, I see bundle-gate Layer-3 refuse to run shell when criteria-exec is gated off, so the documented fail-closed control is true for the hard gate.
- As a benchmark operator, I run the Lane B promotion step and it promotes on a passing benchmark-complete report, so Lane B promotion is executable instead of dead.
- As an auditor, I read the SKILL.md and command docs and they describe the actual promotion behavior, so no doc claims mode-awareness the promoter does not implement.

## 12. OPEN QUESTIONS

- Should the benchmark-mode promotion branch promote into the same agent-canonical manifest target, or a benchmark-specific target? Chosen: promote on the benchmark-complete report basis through the existing guarded path, gated by `--benchmark-report` (see decision-record ADR-003).
- Should the shared fixture-id guard live in `scripts/lib/` or be inlined in both writers? Chosen: shared helper in `scripts/lib/` so both writers enforce one rule (see decision-record ADR-001).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
- **Decision Register**: See `decision-record.md`
- **Findings source**: See `../017-review-two-lane-workflow-with-opus/review/review-report.md`
- **Parent Spec**: See `../spec.md`

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
