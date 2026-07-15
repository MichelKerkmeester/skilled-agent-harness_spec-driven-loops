---
title: "Plan: Final Regression and Operator Runbook"
description: "Concrete execution plan for the final regression sweep, operator runbook, remediation-map closure, and arc completion."
trigger_phrases:
  - "final-regression-and-operator-runbook"
  - "memory leak 10"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/010-final-regression-and-operator-runbook"
    last_updated_at: "2026-05-22T14:40:33Z"
    last_updated_by: "codex"
    recent_action: "planned-phase-010-final-regression-and-runbook"
    next_safe_action: "run-bundled-regression-and-process-harness"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "operator-runbook.md"
      - "../001-research-synthesis-and-remediation-map/research/remediation-map.md"
    session_dedup:
      fingerprint: "sha256:0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a"
      session_id: "009-memory-leak-remediation-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase is documentation plus verification only; no new runtime remediation is in scope."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Final Regression and Operator Runbook

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Python, shell, MCP servers, local CLI runtimes |
| **Framework** | Spec Kit Memory, CocoIndex, Code Graph, deep-loop workflows |
| **Storage** | JSONL state, SQLite/index files, sidecar ledgers, spec docs |
| **Testing** | Targeted Vitest, targeted pytest, build/typecheck rollup, process-memory harness, strict spec validation |

### Overview
Close the memory-leak remediation arc by replaying the targeted validation gates from phases 003-009, recording process/memory baseline evidence, and publishing an operator runbook that separates safe exact-identity cleanup from no-action and reboot-only pressure cases.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Predecessor phases 003-009 have implementation summaries with verification commands and limitations.
- [x] Phase 010 spec folder is established for all file modifications.
- [x] Runtime code changes are out of scope; this phase owns verification evidence and docs only.
- [x] Destructive cleanup remains unavailable unless an existing subsystem has exact PID/resource identity and owner-token proof.

### Definition of Done
- [x] Targeted phase regression commands pass or a failure is captured in `handover.md` with the exact command output.
- [x] Process-memory harness snapshot and process-sweep fixture run cleanly and are recorded in `implementation-summary.md`.
- [x] `operator-runbook.md` distinguishes safe cleanup, no-action cases, and reboot-only Apple Silicon pressure.
- [x] Remediation map items 1-17 have implementation outcomes and phase pointers.
- [x] Parent arc spec and graph metadata mark phase 010 and the arc completed.
- [x] Phase 010, parent arc, and phases 003-010 pass strict spec validation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification-first closure with no new runtime code. Phase 010 bundles already-shipped phase evidence, runs the accepted targeted gates, and documents operator actions without expanding cleanup authority.

### Key Components
- **Final regression sweep**: sequential targeted gates from phases 003-009, using the same command surfaces the prior implementation summaries cite.
- **Process harness replay**: `process-memory-harness.js snapshot` for live host telemetry and `process-sweep.js fixture --pretty` for deterministic no-kill policy evidence.
- **Operator runbook**: safe cleanup commands only when the owning subsystem already proves exact identity; explicit preserve rules for warm daemons, browsers, external MCP stdio servers, unknown owners, current PID, and ancestors.
- **Remediation closure**: map each normalized item 1-17 to `implemented`, `verified`, `deferred`, or `no-action` with phase evidence.
- **Arc closure**: parent `spec.md` status and `graph-metadata.json` derived status move to completed, with phase 010 as the last active child.

### Data Flow
Preceding phase summaries provide command sources and known limitations. The final sweep generates fresh pass/fail evidence. The runbook converts subsystem-specific owner rules into operator guidance. The remediation map and parent docs then record final closure state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `010-final-regression-and-operator-runbook/plan.md` | Phase execution plan | Replace scaffold with concrete closure plan | Strict phase validation |
| `010-final-regression-and-operator-runbook/tasks.md` | Phase task ledger | Replace scaffold with numbered tasks T001-T009 | Strict phase validation |
| `010-final-regression-and-operator-runbook/operator-runbook.md` | New operator guide | Author safe cleanup/no-action/reboot guidance | Strict phase validation and review against phase summaries |
| `010-final-regression-and-operator-runbook/implementation-summary.md` | Final evidence bundle | Record regression results, process snapshots, limitations, and commit handoff | Strict phase validation |
| `001-research-synthesis-and-remediation-map/research/remediation-map.md` | Arc work-item map | Add implementation outcomes for items 1-17 | Parent and phase validation |
| `009-memory-leak-remediation/spec.md` | Phase-parent control file | Mark phase 010 and arc completed, update continuity | Parent strict validation |
| `009-memory-leak-remediation/graph-metadata.json` | Search/graph metadata | Set derived status completed and last active child | Parent strict validation |

Runtime code under `.opencode/skills/system-spec-kit/`, `.opencode/skills/mcp-coco-index/`, `.opencode/skills/system-code-graph/`, and `.opencode/skills/system-rerank-sidecar/` is read and tested only. New fixes to baseline failures are forbidden in this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Final Regression Sweep
- [x] Run the deep-loop Vitest regression for phases 003 and 004.
- [x] Run phase 009 memory/runtime/embedder/provider Vitest suites.
- [x] Run phase 005 process harness and process sweep Vitest suites.
- [x] Run phase 006 CocoIndex lifecycle pytest.
- [x] Run phase 008 sidecar ledger and CocoIndex adapter/registry pytest.
- [x] Run phase 007 Code Graph targeted lifecycle Vitest.
- [x] Run the system-spec-kit build/typecheck rollup and alignment drift check.
- [x] Record command, result, and pass counts in `implementation-summary.md`.

### Phase 2: Process Harness Replay
- [x] Run `node .opencode/skills/system-spec-kit/scripts/dist/ops/process-memory-harness.js snapshot`.
- [x] Run `node .opencode/skills/system-spec-kit/scripts/dist/ops/process-sweep.js fixture --pretty`.
- [x] Record process count, project daemon count, expected daemon count, zombie count, RSS, swap, wired memory, and sweep eligibility counts.

### Phase 3: Operator Runbook
- [x] Create `operator-runbook.md` with quick diagnostics, safe cleanup commands, no-action cases, Apple Silicon reboot-only pressure, phase reference table, and triage tree.
- [x] Use real subsystem APIs and commands from implementation summaries.
- [x] Preserve the no-kill boundary for browsers, external MCP stdio servers, unknown owners, current PID, and ancestors.

### Phase 4: Arc Closure
- [x] Update remediation-map outcomes for items 1-17.
- [x] Fill phase 010 `implementation-summary.md`, including limitations and `## Commit Handoff`.
- [x] Update parent `spec.md` and `graph-metadata.json`.
- [x] Strict-validate phase 010, parent arc, and child phases 003-010.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Targeted regression | Phase-owned lifecycle suites from 003-009 | Vitest and pytest |
| Build/typecheck | Spec Kit MCP server and scripts packages | `npm run typecheck`, `npm run build` |
| Process telemetry | Host snapshot and dry-run sweep policy | `process-memory-harness.js`, `process-sweep.js` |
| Documentation validation | Phase 010, parent arc, and child phases | `validate.sh --strict` |
| Alignment | OpenCode skill alignment drift | `verify_alignment_drift.py` |

Broader suites with known phase-007 and phase-009 baseline failures are not a completion gate. They are recorded as limitations rather than fixed in this final documentation phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003-009 implementation summaries | Internal spec docs | Available | Regression table lacks source commands and limitations. |
| Phase 002 process-memory harness build output | Internal tooling | Available | Process baseline comparison cannot satisfy SC-001. |
| CocoIndex and rerank sidecar venvs | Local test environment | Expected available | Python lifecycle gates may be blocked by dependencies. |
| Code Graph targeted lifecycle tests | Local test environment | Expected available | Phase 007 evidence cannot be refreshed. |
| Spec Kit validation script | Internal tooling | Available | Completion cannot be claimed. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A targeted regression fails, harness/sweep commands fail, or strict validation exits non-zero.
- **Procedure**: Stop runtime changes, write `handover.md` in phase 010 with the failing command, verbatim output, files already edited, and the next safe action.
- **Scope**: Since phase 010 does not change runtime code, rollback is limited to spec documentation edits if the parent agent chooses to retry with a different closure packet.
<!-- /ANCHOR:rollback -->
