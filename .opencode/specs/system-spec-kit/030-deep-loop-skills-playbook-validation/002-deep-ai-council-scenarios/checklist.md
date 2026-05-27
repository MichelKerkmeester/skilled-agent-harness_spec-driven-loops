---
title: "Verification Checklist + Verdict Ledger: Deep-AI-Council Scenarios (Playbook 002)"
description: "Verification + 32-scenario verdict ledger for deep-ai-council playbook run."
trigger_phrases:
  - "deep-ai-council checklist"
  - "deep ai council verdict ledger"
  - "030 phase 002 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-deep-loop-skills-playbook-validation/002-deep-ai-council-scenarios"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author phase 002 checklist + 32-scenario verdict ledger"
    next_safe_action: "Fill verdicts as category batches complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist + Verdict Ledger: Deep-AI-Council Scenarios (Playbook 002)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Phase 001 `06`/`07`/`08` verdicts confirmed non-FAIL (gates 08/09)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Dispatch prompts composed via sk-prompt (RCAF + medium-density pre-planning)
- [ ] CHK-011 [P0] No secrets in dispatch prompts
- [ ] CHK-012 [P1] Spec folder passed as pre-approved to dispatch
- [ ] CHK-013 [P1] `--permission-mode auto 2>&1 </dev/null` on every dispatch (`--model swe-1.6` for 01-08, `--model gpt-5.5` for 09)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 32 scenarios dispatched with a recorded verdict
- [ ] CHK-021 [P0] Each verdict is PASS/PARTIAL/FAIL/SKIP with one decisive reason
- [ ] CHK-022 [P1] Each verdict cites command + evidence excerpt + anchor file:line
- [ ] CHK-023 [P1] Orchestrator spot-re-ran all FAIL/PARTIAL + 1 PASS sample per category

### Scenario Verdict Ledger — deep-ai-council (32 scenarios)

Verdict legend: `PENDING` (not yet run) · `PASS` · `PARTIAL` · `FAIL` · `SKIP`. Executor: `devin`=SWE-1.6, `codex`=GPT-5.5. Evidence = `scratch/logs/*` path + anchor file:line.

#### 01--runtime-routing-and-rename
| Scenario | Title | Executor | Verdict | Evidence |
|----------|-------|----------|---------|----------|
| DAC-001 | Runtime agent renamed to deep-ai-council | devin | PENDING | |
| DAC-002 | Advisor routes council prompts to skill | devin | PENDING | |

#### 02--council-deliberation-and-seat-diversity
| Scenario | Title | Executor | Verdict | Evidence |
|----------|-------|----------|---------|----------|
| DAC-003 | Three-seat diverse deliberation | devin | PENDING | |
| DAC-004 | Cross-seat critique blocks premature convergence | devin | PENDING | |

#### 03--artifact-persistence-and-state-format
| Scenario | Title | Executor | Verdict | Evidence |
|----------|-------|----------|---------|----------|
| DAC-005 | Persist-artifacts helper writes packet-local tree | devin | PENDING | |
| DAC-006 | State JSONL records council_complete event | devin | PENDING | |
| DAC-007 | Output schema strict required sections fail closed | devin | PENDING | |

#### 04--convergence-and-rollback
| Scenario | Title | Executor | Verdict | Evidence |
|----------|-------|----------|---------|----------|
| DAC-008 | Two-of-three agree triggers convergence | devin | PENDING | |
| DAC-009 | Max rounds without convergence emits non-converged | devin | PENDING | |
| DAC-010 | Rollback failed round preserves forensic trail | devin | PENDING | |

#### 05--scope-boundaries
| Scenario | Title | Executor | Verdict | Evidence |
|----------|-------|----------|---------|----------|
| DAC-011 | Graph support stays derived and scoped | devin | PENDING | |
| DAC-012 | Planning-only boundary rejects implementation writes | devin | PENDING | |

#### 06--depth-and-failure-handling
| Scenario | Title | Executor | Verdict | Evidence |
|----------|-------|----------|---------|----------|
| DAC-014 | Depth detection parallel vs sequential | devin | PENDING | |
| DAC-018 | Resume after interrupted state | devin | PENDING | |

#### 07--writer-library-contract
| Scenario | Title | Executor | Verdict | Evidence |
|----------|-------|----------|---------|----------|
| DAC-013 | Library writer call sequence | devin | PENDING | |
| DAC-015 | Five-dimension scoring rubric application | devin | PENDING | |
| DAC-016 | Hunter Skeptic Referee cross-critique | devin | PENDING | |
| DAC-017 | OUT_OF_SCOPE_WRITE rejection | devin | PENDING | |

#### 08--council-graph-integration (gated on phase 001 06/07/08)
| Scenario | Title | Executor | Verdict | Evidence |
|----------|-------|----------|---------|----------|
| DAC-019 | runtime upsert CLI idempotency and self-loop rejection | devin | PENDING | |
| DAC-020 | runtime upsert CLI empty input no-op success | devin | PENDING | |
| DAC-021 | runtime query CLI hostile metadata redaction | devin | PENDING | |
| DAC-022 | runtime query CLI five modes return prompt-safe context | devin | PENDING | |
| DAC-023 | runtime convergence CLI three-state decision matrix | devin | PENDING | |
| DAC-024 | runtime status CLI recovery payload and readiness | devin | PENDING | |
| DAC-025 | Derived projection rebuilds from artifacts | devin | PENDING | |
| DAC-026 | Council graph MCP surface retired | devin | PENDING | |

#### 09--council-graph-value-comparison (CODEX — A/B reasoning)
| Scenario | Title | Executor | Verdict | Evidence |
|----------|-------|----------|---------|----------|
| DAC-027 | Unresolved disagreement triage: graph vs no-graph baseline | codex | PENDING | |
| DAC-028 | Decision provenance audit: graph vs no-graph baseline | codex | PENDING | |
| DAC-029 | Convergence safety under critical disagreement: graph vs no-graph baseline | codex | PENDING | |
| DAC-030 | Stalled-council blocker ranking: graph vs no-graph baseline | codex | PENDING | |
| DAC-031 | Hot-topic discovery: graph vs no-graph baseline | codex | PENDING | |
| DAC-032 | Mid-run interruption recovery: graph vs no-graph baseline | codex | PENDING | |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Any FAIL verdict classed (instance-only / class-of-bug) and logged, not fixed in place here
- [ ] CHK-FIX-002 [P0] Reproducing command captured for each FAIL
- [ ] CHK-FIX-003 [P0] No live runtime/source edited during this validation phase
- [ ] CHK-FIX-004 [P0] Confirmed FAIL escalated to a `007+` remediation child (record+remediate)
- [ ] CHK-FIX-005 [P1] Scenario → playbook category cross-reference recorded
- [ ] CHK-FIX-006 [P1] Dispatch hangs recorded as SKIP with reason + retry note
- [ ] CHK-FIX-007 [P1] Evidence pinned to captured logs, not transient stdout
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in prompts or evidence
- [ ] CHK-031 [P0] No `--permission-mode dangerous` without operator authorization
- [ ] CHK-032 [P1] CLI credentials never echoed to logs/evidence
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Verdict ledger complete with 32 rows
- [ ] CHK-042 [P2] implementation-summary.md updated post-run
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Dispatch prompts + raw logs in scratch/ only
- [ ] CHK-051 [P1] scratch/ retained as evidence (do NOT clean — this is a validation packet)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 2 | 0/2 |

**Scenario ledger**: 0/32 verdicts recorded
**Verification Date**: 2026-05-27 (scaffold)
<!-- /ANCHOR:summary -->
