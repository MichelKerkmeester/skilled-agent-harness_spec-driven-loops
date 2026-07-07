---
title: "Feature Specification: fix deep-review findings for two-lane code"
description: "Fix the 014 deep-review findings for two-lane code, including the Lane B command parser defect, security hardening, traceability gaps, and dispositions."
trigger_phrases:
  - "fix deep-review findings for two-lane code"
  - "014 deep-review findings fix"
  - "Lane B command flag misparse fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/015-fix-deep-review-findings-for-two-lane-code"
    last_updated_at: "2026-05-29T12:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored 015 Level 3 remediation packet from 014 review report"
    next_safe_action: "Implement F-P0-1 parser fix then P1 cluster"
    blockers: []
    key_files:
      - "../014-review-two-lane-workflow-implementation/review/review-report.md"
      - "../014-review-two-lane-workflow-implementation/review/all-findings.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-20260529"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: fix deep-review findings for two-lane code

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The 014 two-lane deep review returned a CONDITIONAL verdict against the two-lane program (121/008-013). This packet remediates every active finding: 1 confirmed P0 (the Lane B command flags misparse to booleans because `loop-host.cjs` `parseArgs` does not accept space-form flags), a cluster of 16 P1 findings (security: write-capable grader dispatch, unquoted shell interpolation, fixture-id traversal, open-by-default criteria-exec, shared-tmp score cache; traceability: invalid outcomes, dropped executor fields, missing provenance, overwritten reports, non-packet-local pause state, a Lane A-referencing promotion gate, split config, stale agent-note paths), and 16 P2 advisories. Each finding gets exactly one disposition - FIXED with a test or adversarial check where applicable, or DOCUMENT-ACCEPT with rationale. The work preserves TST-1 byte-identity in `scripts/shared/loop-host.cjs` and keeps the vitest suite green.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 19 |
| **Predecessor** | 014-review-two-lane-workflow-implementation |
| **Successor** | 016-add-readmes-for-script-subfolders |
| **Handoff Criteria** | P0 fixed + verified end-to-end through the YAML path; all 16 P1 fixed-or-document-accepted; all 16 P2 fixed-or-document-accepted; every finding carries exactly one disposition; vitest green; TST-1 byte-identity holds |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of packet 121 - remediation of the findings from the 014 two-lane deep review (`014-review-two-lane-workflow-implementation`, cli-codex gpt-5.5 xhigh + Opus 4.8 adjudication; verdict CONDITIONAL). Source of truth for findings: `../014-review-two-lane-workflow-implementation/review/review-report.md` and `../014-review-two-lane-workflow-implementation/review/all-findings.jsonl`.

The 014 review audited the two-lane program shipped across 121/008-013. Lane A is agent-improvement (`/deep:start-agent-improvement-loop`). Lane B is model-benchmark (`/deep:start-model-benchmark-loop`, runtime loop-host `--mode=model-benchmark` then materialize plus run-benchmark, scorer pattern or 5dim, grader noop or mock or llm). Scripts are lane-separated under `scripts/{shared,agent-improvement,model-benchmark}/` plus `scripts/lib/`.

**Scope Boundary**: Resolve every active 014 finding (1 P0 + 16 P1 + 16 P2) with exactly one disposition each - FIXED (real code or doc fix plus a test or adversarial check where applicable) or DOCUMENT-ACCEPT (an intended trusted-author boundary or by-design behavior, recorded with explicit rationale). No silent drops. Changes stay inside `.opencode/skills/deep-agent-improvement/**`, the two Lane B workflow YAMLs and the `/deep:start-model-benchmark-loop` and `/deep:start-agent-improvement-loop` command docs, the agent mirror notes, and the advisor explicit-lane scorer.

**Dependencies**: 014 review-report.md and all-findings.jsonl (findings plus recommended fixes); the 121/008-013 shipped two-lane code.

**Deliverables**: code and doc fixes plus regression tests for every FIXED finding; a per-finding disposition register in decision-record.md; green vitest and a verified Lane B command end-to-end run.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 014 deep review returned a CONDITIONAL verdict. One confirmed P0 makes the shipped `/deep:start-model-benchmark-loop` misbehave: `loop-host.cjs` `parseArgs` only accepts `--key=value` or bare flags, but all three Lane B command surfaces invoke loop-host with SPACE-form flags, so `profile`, `outputs-dir`, `scorer`, and `grader` all parse to `true`. Alongside the P0 sit 16 P1 findings (a security cluster around write-capable grader dispatch, unquoted shell interpolation, fixture-id path traversal, an open-by-default criteria-exec gate, and a shared-tmp score cache; plus a traceability cluster around invalid session outcomes, dropped LLM executor fields, missing scorer provenance on failure, overwritten reports, non-packet-local pause state, a Lane A-referencing Lane B promotion gate, split config paths, and stale agent-note script paths) and 16 P2 advisories.

### Purpose
Ship every active 014 finding closed with exactly one disposition, the P0 verified end-to-end through the YAML command path, the security and traceability P1 cluster hardened with adversarial tests, and the documented-accept boundaries recorded with rationale, so Lane B is reliable and the two-lane program clears its CONDITIONAL verdict.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F-P0-1: teach `loop-host.cjs` `parseArgs` to accept `--key value` space-form (consume the next non-`--` token) while keeping `--key=value` byte-identical; add a space-form parser test
- F-P1 security cluster: read-only grader/executor sandbox by default (F-P1-1), quoted or argv-array YAML interpolation (F-P1-2), fixture-id traversal sanitization (F-P1-9), criteria-exec fail-closed default (F-P1-10), packet-local owner-checked score cache (F-P1-11)
- F-P1 traceability cluster: valid Lane B session outcome (F-P1-3), thread LLM executor and model fields (F-P1-4), benchmark plateau stop (F-P1-5), config-path consolidation (F-P1-6), scorer provenance on failure (F-P1-7), lane-resolution ordering (F-P1-8), candidate-keyed score cache (F-P1-12), per-iteration immutable reports (F-P1-13), packet-local pause state (F-P1-14), Lane B promotion gate (F-P1-15), agent-note script-path repoint across 4 mirrors (F-P1-16)
- The 16 P2 advisories: each gets a FIXED or DOCUMENT-ACCEPT disposition
- Regression tests for each FIXED finding where a test or adversarial check applies

### Out of Scope
- F-P0-2 "model benchmark never dispatches a model" - REFUTED by 014 as an intended documented deferral (122/007 F-P2-1, arbiter-upheld); the default Lane B path is fixture pattern or 5dim scoring with `--grader noop`, and `dispatch-model.cjs` loads only on `--grader llm`. Recorded as DOCUMENT-ACCEPT.
- Re-architecting the scorer or dispatcher seams - the seam contracts are sound per the review
- New benchmark fixtures or profiles beyond what the fixes need

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/shared/loop-host.cjs` | Modify | F-P0-1 space-form parseArgs; F-P1-6 config path; F-P1-4 thread executor/model; P2 option schema |
| `scripts/model-benchmark/dispatch-model.cjs` | Modify | F-P1-1 read-only sandbox default; F-P1-14 packet-local pause state; P2 stderr diagnostics |
| `scripts/model-benchmark/run-benchmark.cjs` | Modify | F-P1-9 fixture-id sanitize; F-P1-7 scorer provenance on failure; F-P1-13 per-iteration reports; P2 profile provenance, regex policy |
| `scripts/agent-improvement/score-candidate.cjs` | Modify | F-P1-11 packet-local owner-checked cache; F-P1-12 candidate-keyed cache key |
| `scripts/shared/reduce-state.cjs` | Modify | F-P1-5 benchmark plateau stop; P2 unknown-mode bucket |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml` | Modify | F-P1-2 quote interpolation; F-P1-3 valid outcome; F-P0-1 flag form |
| `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_confirm.yaml` | Modify | F-P1-2; F-P1-3; F-P1-15 promotion gate |
| `.opencode/commands/deep/start-model-benchmark-loop.md` | Modify | F-P1-4 executor/model fields; F-P1-6 config path; P2 max-iterations binding |
| `.opencode/commands/deep/start-agent-improvement-loop.md` | Modify | F-P1-8 lane-resolution ordering |
| `.opencode/agents/deep-agent-improvement.md` (+ 3 mirrors) | Modify | F-P1-16 repoint Lane-awareness script paths post-013 reorg |
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Modify | F-P1-10 criteria-exec default; P2 lane-aware runtime assets |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modify | P2 normalize advisor penalty ids |
| `scripts/tests/*.vitest.ts` | Modify/Create | regression tests for each FIXED finding |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F-P0-1 Lane B command flags parse correctly | `parseArgs` accepts both `--key=value` and `--key value`; `profile`, `outputs-dir`, `scorer`, `grader` resolve to their real values from the space-form command; a loop-host test asserts space-form parsing; the existing `=`-form behavior is byte-identical (TST-1 safe) |
| REQ-002 | Lane B command verified end-to-end | The `/deep:start-model-benchmark-loop` command runs through the YAML path (not just the script) and reaches benchmark-complete with the fix |
| REQ-003 | No regression | Full vitest suite green; TST-1 byte-identity gate still holds; alignment-drift clean |

### P1 - Required (complete OR documented-accept)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Security cluster fixed | Grader/executor dispatch read-only by default with opt-in (F-P1-1); YAML interpolation quoted or argv-array (F-P1-2); fixture ids rejected if they contain separators, absolute syntax, or `..` and resolved path asserted inside outputs dir (F-P1-9); criteria-exec fails closed by default (F-P1-10); score cache packet-local with owner/mode validation (F-P1-11) - each with an adversarial test where applicable |
| REQ-005 | Traceability cluster fixed | Valid Lane B session outcome (F-P1-3); LLM executor/model threaded (F-P1-4); benchmark plateau stop implemented (F-P1-5); config path consolidated (F-P1-6); scorer provenance on failure (F-P1-7); lane-resolution ordering fixed (F-P1-8); cache key includes candidate path (F-P1-12); per-iteration immutable reports (F-P1-13); packet-local pause state (F-P1-14); Lane B promotion gate corrected (F-P1-15); agent-note paths repointed across 4 mirrors (F-P1-16) |
| REQ-006 | Every P2 dispositioned | Each of the 16 P2 advisories is FIXED with evidence or DOCUMENT-ACCEPT with rationale; no silent drops |
| REQ-007 | Per-finding disposition register | decision-record.md records exactly one disposition per active finding (1 P0 + 1 refuted + 16 P1 + 16 P2) with evidence or rationale |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Re-running the 014 P0 check shows the Lane B command parses its flags correctly and reaches benchmark-complete through the YAML path.
- **SC-002**: All 16 P1 and all 16 P2 findings carry exactly one disposition; FIXED items have evidence or a test, DOCUMENT-ACCEPT items have a rationale.
- **SC-003**: vitest green, TST-1 byte-identity holds, no regression to the Lane A path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | parseArgs change perturbs the `=`-form path and breaks TST-1 byte-identity | High | Space-form is additive (only consumes the next token when no `=` present); keep `=`-form code path untouched; add a TST-1 identity assertion |
| Risk | Read-only grader default breaks a legitimate write-capable evaluation profile | Med | Provide an explicit documented opt-in for write-capable evaluation in an isolated temp workspace; default closed |
| Risk | Criteria-exec fail-closed default breaks existing benchmark profiles | Med | Require an explicit documented opt-in env var for trusted profiles; surface a clear refusal message |
| Dependency | 014 review-report.md and all-findings.jsonl | Source of truth for findings and recommended fixes | Both are present and pinned in the 014 packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | TST-1 byte-identity | The `=`-form plan and the Lane A plan are byte-identical pre and post fix |
| NFR-002 | Least privilege | Grader/executor dispatch is read-only by default; criteria-exec fails closed by default |
| NFR-003 | Traceability | Failure reports and ledger rows carry scorer, grader, and profile provenance |
| NFR-004 | Packet-local state | Score cache, pause sentinel, and benchmark reports live under the packet/runtime root, not a shared path |

---

## 8. EDGE CASES

- Space-form flag followed immediately by another `--flag`: the parser must store `true`, not consume the next flag as a value.
- `=`-form flag with an empty value (`--scorer=`): preserved as today (byte-identical).
- Fixture id that is a plain basename, contains a separator, a backslash, `..`, absolute syntax, or is empty: only the plain basename is accepted.
- Score cache entry owned by another user or with loose permissions: treated as a cache miss, not trusted.
- `record.mode` missing or misspelled: bucketed as unknown or warned, not silently counted as Lane A.

---

## 9. COMPLEXITY ASSESSMENT

Level 3. The packet touches multiple lane-separated scripts, two Lane B YAMLs, several command and agent docs, and the advisor scorer, across security, traceability, and maintainability dimensions. The risk concentration is the P0 parser change (TST-1 byte-identity must hold) and the security cluster (each fix needs an adversarial or regression test). The change set is broad but each fix is surgical and file-scoped.

---

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| parseArgs change breaks TST-1 byte-identity | Low | High | Keep `=`-form branch untouched; assert identity in test |
| Read-only grader default breaks a write-capable profile | Low | Med | Documented opt-in restores write-capable evaluation |
| Criteria-exec fail-closed breaks a trusted profile | Med | Med | Documented opt-in env var + clear refusal message |
| A P2 disposition is dropped silently | Low | Med | Disposition register enumerates all 16 P2 with status |

---

## 11. USER STORIES

- As a benchmark operator, I run `/deep:start-model-benchmark-loop` and the profile, outputs-dir, scorer, and grader flags take effect, so the run benchmarks what I asked for.
- As a security reviewer, I see grader dispatch run read-only by default and criteria-exec fail closed, so an evaluation run cannot mutate the workspace or run shell unprompted.
- As an auditor, I read a failure report and ledger row that name the scorer, grader, and profile, so I can tell a failed 5dim/llm run from a pattern/noop run.

## 12. OPEN QUESTIONS

- Should the criteria-exec gate default fail-closed (secure-by-default, may break trusted profiles) or remain open (backward-compat)? Chosen: fail-closed with a documented opt-in (see decision-record ADR-004).
- Should the score cache live packet-local keyed by candidate, or stay in a shared tmp path? Chosen: packet-local plus candidate-keyed (see decision-record ADR-005).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
- **Decision Register**: See `decision-record.md`
- **Findings source**: See `../014-review-two-lane-workflow-implementation/review/review-report.md`
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
