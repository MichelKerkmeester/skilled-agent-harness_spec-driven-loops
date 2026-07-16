---
title: "Tasks: Global Security Sweep + Supply-Chain Audit"
description: "Atomic Level 1 task ledger for scaffolding and dispatching the 25-iteration read-only security sweep."
trigger_phrases:
  - "015 global security sweep tasks"
  - "Mini Shai-Hulud audit tasks"
  - "security sweep dispatch tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/001-dependency-security-supply-chain-audit"
    last_updated_at: "2026-05-15T18:37:42.553981Z"
    last_updated_by: "cli-opencode-015-scaffold"
    recent_action: "authored_atomic_tasks_for_security_sweep_dispatch"
    next_safe_action: "dispatch_iteration_001"
    blockers: []
    key_files:
      - "tasks.md"
      - "research/prompts/iteration-001.md..iteration-025.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-015-scaffold"
      parent_session_id: null
    completion_pct: 12
    open_questions: []
    answered_questions:
      - "Use packet-local writes only"
---
# Tasks: Global Security Sweep + Supply-Chain Audit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1.1 Confirm Gate 3 authorized packet scope (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/`).
- [x] T1.2 Read `spec.md` as the campaign source of truth.
- [x] T1.3 Read Level 1 plan/tasks/implementation-summary templates.
- [x] T1.4 Read canonical 037 iteration prompt reference.
- [x] T1.5 Create `plan.md` from the Level 1 plan template.
- [x] T1.6 Create `tasks.md` from the Level 1 tasks template.
- [x] T1.7 Create placeholder `implementation-summary.md` for post-synthesis completion.
- [x] T1.8 Initialize `research/deep-research-state.jsonl` with one campaign_start event.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T2.1 Dispatch iteration 001: Mini Shai-Hulud IOCs (`research/prompts/iteration-001.md`).
- [ ] T2.2 Dispatch iteration 002: stolen credential exposure (`research/prompts/iteration-002.md`).
- [ ] T2.3 Dispatch iteration 003: npm supply chain (`research/prompts/iteration-003.md`).
- [ ] T2.4 Dispatch iteration 004: pip/cargo/uv/brew supply chain (`research/prompts/iteration-004.md`).
- [ ] T2.5 Dispatch iteration 005: postinstall script audit (`research/prompts/iteration-005.md`).
- [ ] T2.6 Dispatch iteration 006: LaunchAgents and LaunchDaemons inventory (`research/prompts/iteration-006.md`).
- [ ] T2.7 Dispatch iteration 007: systemd and cron (`research/prompts/iteration-007.md`).
- [ ] T2.8 Dispatch iteration 008: shell startup files (`research/prompts/iteration-008.md`).
- [ ] T2.9 Dispatch iteration 009: git hooks and hooksPath (`research/prompts/iteration-009.md`).
- [ ] T2.10 Dispatch iteration 010: PATH integrity and shadow binaries (`research/prompts/iteration-010.md`).
- [ ] T2.11 Dispatch iteration 011: MCP server allowlist across six configs (`research/prompts/iteration-011.md`).
- [ ] T2.12 Dispatch iteration 012: auth state file inventory (`research/prompts/iteration-012.md`).
- [ ] T2.13 Dispatch iteration 013: GitHub state (`research/prompts/iteration-013.md`).
- [ ] T2.14 Dispatch iteration 014: workspace trust files (`research/prompts/iteration-014.md`).
- [ ] T2.15 Dispatch iteration 015: external MCP transports (`research/prompts/iteration-015.md`).
- [ ] T2.16 Dispatch iteration 016: suspicious commit patterns (`research/prompts/iteration-016.md`).
- [ ] T2.17 Dispatch iteration 017: CI/CD workflows (`research/prompts/iteration-017.md`).
- [ ] T2.18 Dispatch iteration 018: external-author plugins, skills, and agents (`research/prompts/iteration-018.md`).
- [ ] T2.19 Dispatch iteration 019: hidden network exposure (`research/prompts/iteration-019.md`).
- [ ] T2.20 Dispatch iteration 020: primary synthesis and remediation playbook draft (`research/prompts/iteration-020.md`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T3.1 Dispatch iteration 021: verify active-threat findings from iterations 001-005.
- [ ] T3.2 Dispatch iteration 022: verify persistence findings from iterations 006-010.
- [ ] T3.3 Dispatch iteration 023: verify runtime and auth findings from iterations 011-015.
- [ ] T3.4 Dispatch iteration 024: verify code, history, CI, and network findings from iterations 016-019.
- [ ] T3.5 Dispatch iteration 025: final adjudication with VERIFIED/HALLUCINATED/PARTIAL counts.
- [ ] T3.6 Produce `research/review-report.md` from verified iteration evidence.
- [ ] T3.7 Update `implementation-summary.md` after synthesis with verdict, evidence, limitations, and validation results.
- [ ] T3.8 Run strict spec validation and record the exit code.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] `research/iterations/iteration-001.md` through `iteration-025.md` exist and are non-empty.
- [ ] `research/deep-research-state.jsonl` contains campaign_start plus 25 iteration records.
- [ ] `research/review-report.md` contains the final CLEAN / INDICATORS-PRESENT / COMPROMISE-CONFIRMED verdict.
- [ ] CRITICAL/HIGH findings have concrete remediation command sequences or a documented safe-remediation hold.
- [ ] Verification iterations mark findings as VERIFIED, HALLUCINATED, or PARTIAL.
- [ ] No `[B]` blocked tasks remain unless a CRITICAL active-threat halt is documented.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Prompt queue**: See `research/prompts/`
- **Iteration outputs**: See `research/iterations/`
- **State**: See `research/deep-research-state.jsonl`
<!-- /ANCHOR:cross-refs -->
