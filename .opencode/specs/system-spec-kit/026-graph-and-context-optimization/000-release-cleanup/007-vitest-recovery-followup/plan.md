---
title: "Implementation Plan: Vitest baseline recovery followup [template:level_1/plan.md]"
description: "Successor placeholder for closing the 196 vitest failures escalated from packet 006."
trigger_phrases:
  - "vitest recovery followup plan"
  - "026/000/007 plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/007-vitest-recovery-followup"
    last_updated_at: "2026-05-09T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored alongside placeholder spec"
    next_safe_action: "Execute T001 to enumerate followup-tagged tests"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "vitest-recovery-followup-placeholder-2026-05-09"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Vitest baseline recovery followup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Vitest |
| **Framework** | system-spec-kit |
| **Storage** | n/a |
| **Testing** | Vitest |

### Overview
Close the 196 escalated vitest failures from packet 006. Discoverable via `grep -rn 'followup: 026/000/007-vitest-recovery-followup'` in `mcp_server/tests/` and `mcp_server/skill_advisor/tests/`. Strategy: per-surface child packets, each running cli-codex against one cluster.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Inventory inherits from packet 006's `scratch/triage-inventory.json`
- [x] Source-level annotations make the work discoverable

### Definition of Done
- [ ] Zero `// followup: 026/000/007-vitest-recovery-followup` annotations remain
- [ ] Post-fix vitest reports zero NEW failures
- [ ] v3.4.1.0 changelog row updated
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Phase-parent of per-surface child packets, OR single in-packet remediation if scope allows. Per-surface clustering reduces blast radius and lets each cli-codex dispatch focus on one root cause.

### Key Components
- Predecessor inventory: `../006-vitest-baseline-recovery/scratch/triage-inventory.json`.
- Source annotations: `// followup: 026/000/007-vitest-recovery-followup` in test files.
- Drift attribution: `// drift: <packet>` comments pattern from packet 006.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Enumerate
1. `grep -rn 'followup: 026/000/007-vitest-recovery-followup' .opencode/skills/system-spec-kit/mcp_server/` — produce per-test inventory.
2. Cluster by parent directory (skill_advisor scorer, hooks, scaffold, alignment, code-graph, other).
3. For each cluster, decide: (a) in-packet fix, (b) per-surface child packet, or (c) skip with reason.

### Phase 2: Per-surface remediation
1. For each cluster decision (b): scaffold child packet; dispatch cli-codex; verify.
2. For each cluster decision (a): direct Edit + run targeted vitest.

### Phase 3: Verification
1. `pnpm vitest run` — confirm 0 NEW failures.
2. Update v3.4.1.0 changelog row with the post-recovery numbers.
3. Strict validate this packet + each child packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Targeted | Per-surface vitest re-runs after each cluster fix | Vitest |
| Full repo | Final convergence check | `pnpm vitest run` |
| Strict validate | This packet and any child packets | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Packet 006's triage-inventory.json | Predecessor | Shipped |
| Source-level followup annotations | Predecessor | Applied in 196 places |
| `pnpm vitest run` | Tooling | Available |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Per-cluster fixes are isolated; rollback is `git restore` on the target test file. The packet does not modify shipped runtime code. If a child packet introduces a regression, revert that child's commit; this parent stays valid.
<!-- /ANCHOR:rollback -->
