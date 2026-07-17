---
title: "Implementation Plan: Global Security Sweep + Supply-Chain Audit"
description: "Plans the 25-iteration read-only security audit scaffold for the Public repo after the TanStack Mini Shai-Hulud disclosure. The work prepares 20 cli-devin primary research iterations and 5 cli-opencode + deepseek-v4-pro verification iterations."
trigger_phrases:
  - "015 global security sweep plan"
  - "Mini Shai-Hulud audit plan"
  - "security sweep iteration plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/001-dependency-security-supply-chain-audit"
    last_updated_at: "2026-05-15T19:30:00Z"
    last_updated_by: "claude-opus-4-7-015-synthesis"
    recent_action: "campaign_complete_25_iterations_synthesized_to_review_report"
    next_safe_action: "memory_save_then_commit_and_push_review_report"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "research/prompts/iteration-001.md..iteration-025.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-015-scaffold"
      parent_session_id: null
    completion_pct: 12
    open_questions: []
    answered_questions:
      - "Gate 3 scope pre-authorized for packet 015"
---
# Implementation Plan: Global Security Sweep + Supply-Chain Audit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown prompts, shell verification commands, JSONL state |
| **Framework** | system-spec-kit Level 1 packet + deep-research dispatch loop |
| **Storage** | Packet-local files under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/` |
| **Testing** | Strict spec validation plus prompt inventory checks |

### Overview

This packet prepares a 25-iteration read-only security audit after the 2026-05-15 TanStack Mini Shai-Hulud supply-chain disclosure. The campaign runs 20 primary cli-devin SWE-1.6 iterations over direct IOCs, credential exposure, supply-chain manifests, persistence surfaces, MCP runtime/auth state, GitHub state, CI/CD, plugin trust, and network exposure.

The final 5 iterations use cli-opencode + deepseek-v4-pro as verification passes. Those passes re-check active-threat findings, persistence findings, runtime/auth findings, code/history/CI/network findings, and then adjudicate VERIFIED vs HALLUCINATED vs PARTIAL findings before producing the adjusted remediation playbook.

The scaffold itself does not remediate anything. It creates the dispatch-ready docs, prompt contracts, and initial JSONL state so every iteration can collect evidence consistently.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable: 25 iteration outputs, JSONL state records, final severity-ranked report.
- [x] Dependencies identified: cli-devin SWE-1.6 and cli-opencode + deepseek-v4-pro must be available before dispatch.
- [x] Prompt format anchored to the canonical 037 deep-review iteration pattern.

### Definition of Done
- [ ] `plan.md`, `tasks.md`, and `implementation-summary.md` exist in the packet.
- [ ] `research/prompts/iteration-001.md` through `iteration-025.md` exist and are concrete, not stubs.
- [ ] `research/deep-research-state.jsonl` has exactly one campaign_start event before dispatch.
- [ ] Strict spec validation runs for the packet after scaffold generation.

### Audit Quality Gates
- [ ] Each dispatched phase runs its required verification commands and cites file:line or command output for every finding.
- [ ] Findings are severity-ranked as CRITICAL, HIGH, MEDIUM, LOW, or INFO.
- [ ] Verification iterations reduce hallucinated findings by requiring repeated file-existence, line-citation, and command-output evidence.
- [ ] If a CRITICAL direct IOC is found, the iteration halts after writing evidence and the operator is notified before any token revocation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only staged deep-research campaign with cross-executor verification.

### Key Components
- **Spec packet**: Defines scope, requirements, risks, and 25-dimension campaign plan.
- **Prompt set**: Gives each iteration a bounded focus, concrete verification commands, and uniform output schema.
- **Iteration outputs**: Store evidence in `research/iterations/iteration-NNN.md`.
- **State JSONL**: Tracks campaign start and per-iteration severity counts, novelty, executor, model, duration, and timestamp.
- **Final synthesis**: Converts per-dimension evidence into severity-ranked findings and a remediation playbook.

### Data Flow

```text
spec.md
  |
  v
Level 1 scaffold: plan.md + tasks.md + implementation-summary.md
  |
  v
research/prompts/iteration-001.md ... iteration-025.md
  |
  +--> iterations 001-020: cli-devin SWE-1.6 primary audit
  |        |
  |        v
  |     research/iterations/iteration-001.md ... iteration-020.md
  |
  +--> iterations 021-025: cli-opencode + deepseek-v4-pro verification
           |
           v
        research/iterations/iteration-021.md ... iteration-025.md
           |
           v
        research/review-report.md + remediation playbook
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/spec.md` | Source of truth for dimensions and campaign contract | Read only | Fully read before scaffold generation |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/plan.md` | Level 1 execution plan | Create | Packet validation + direct file inventory |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/tasks.md` | Atomic dispatch task ledger | Create | Packet validation + direct file inventory |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/implementation-summary.md` | Placeholder summary for post-synthesis completion | Create | Template marker present |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/research/prompts/` | Iteration prompt queue | Create 25 files | Count equals 25; iteration-001 has >=60 lines |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/research/deep-research-state.jsonl` | Campaign state | Initialize | Single campaign_start JSON object |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Init
- [ ] Confirm packet scope and existing metadata files.
- [ ] Create the Level 1 plan, tasks, and implementation summary docs.
- [ ] Initialize `research/deep-research-state.jsonl` with one campaign_start event.

### Phase 2: 20 cli-devin Primary Iterations
- [ ] Dispatch iterations 001-005 for active threats: Mini Shai-Hulud IOCs, stolen credentials, npm supply chain, pip/cargo/uv/brew supply chain, postinstall scripts.
- [ ] Dispatch iterations 006-010 for persistence: LaunchAgents/Daemons, systemd/cron, shell startup files, git hooks, PATH integrity.
- [ ] Dispatch iterations 011-015 for runtime/auth/network surfaces: MCP allowlist, auth state files, GitHub state, workspace trust files, external MCP transports.
- [ ] Dispatch iterations 016-020 for code/history/CI/network/synthesis: suspicious commits, CI/CD workflows, plugins/skills/agents, hidden network exposure, final primary synthesis.

### Phase 3: 5 cli-opencode + deepseek-v4-pro Verification Iterations
- [ ] Dispatch iteration 021 to verify active-threat findings from 001-005.
- [ ] Dispatch iteration 022 to verify persistence findings from 006-010.
- [ ] Dispatch iteration 023 to verify runtime/auth findings from 011-015.
- [ ] Dispatch iteration 024 to verify code/history/CI/network findings from 016-019.
- [ ] Dispatch iteration 025 for final adjudication and adjusted remediation playbook.

### Phase 4: Synthesis
- [ ] Produce `research/review-report.md` with CLEAN / INDICATORS-PRESENT / COMPROMISE-CONFIRMED verdict.
- [ ] Severity-rank all findings and attach actionable remediation paths for CRITICAL/HIGH items.
- [ ] Save final memory context after synthesis using the packet as the continuity target.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Security audit | This packet is itself the test: it probes host, repo, runtime, auth, and CI/CD security posture | cli-devin SWE-1.6, cli-opencode + deepseek-v4-pro, shell commands |
| Scaffold validation | Packet docs, prompt count, state initialization, template compliance | `ls`, `wc -l`, strict spec validator |
| Evidence verification | File:line citations, command outputs, repeated checks by independent executor | Iterations 021-025 |
| Hallucination reduction | Re-check every highest-risk claim against absolute paths and concrete command output | cli-opencode + deepseek-v4-pro verification passes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin SWE-1.6 | External executor | Required for iterations 001-020 | Primary campaign cannot run |
| cli-opencode + deepseek-v4-pro | External executor | Required for iterations 021-025 | Cross-AI verification cannot run |
| GitHub CLI auth state | Host/runtime input | Read-only audit target | GitHub state dimension may be partial if unavailable |
| macOS shell tools | Host/runtime input | Expected on this host | Persistence and network checks may need command fallbacks |
| system-spec-kit validator | Internal tool | Required after scaffold generation | Cannot claim scaffold ready without validation output |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Rollback is only needed if scaffold generation writes outside `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/` or corrupts existing packet metadata.
- **Procedure**: Delete or repair only the generated packet-local scaffold files, then re-run strict packet validation. The audit and dispatch loop are read-only; no rollback is needed for host or source-code state unless an iteration violates its read-only constraint.
<!-- /ANCHOR:rollback -->
