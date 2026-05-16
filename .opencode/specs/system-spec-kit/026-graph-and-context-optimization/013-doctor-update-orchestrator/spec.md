---
title: "Feature Specification: Doctor Update Orchestrator [system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/spec]"
description: "Phase parent for the complete doctor command surface timeline: initial commands, sandbox playbook, remediation, router consolidation, and hard cutover."
trigger_phrases:
  - "013-doctor-update-orchestrator"
  - "doctor command surface"
  - "/doctor:update"
  - "/doctor memory"
  - "/doctor causal-graph"
  - "/doctor deep-loop"
  - "/doctor cocoindex"
  - "doctor update orchestrator"
  - "spec-kit version migration"
  - "001-doctor-commands"
  - "002-sandbox-testing-playbook"
  - "002-rm8-013-remediation-doc-honesty-security"
  - "003-router-phase"
  - "005-cutover-phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator"
    last_updated_at: "2026-05-12T04:55:46Z"
    last_updated_by: "spec-author"
    recent_action: "Folded former 014 doctor-command consolidation packet into 013 as phases 004 + 005"
    next_safe_action: "Ship calibration packet for 23 manual playbook scenarios (deferred from 014)"
    blockers: []
    key_files:
      - "001-doctor-commands/spec.md"
      - "001-doctor-commands/decision-record.md"
      - "002-sandbox-testing-playbook/spec.md"
      - "002-rm8-013-remediation-doc-honesty-security/spec.md"
      - "003-router-phase/spec.md"
      - "005-cutover-phase/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-phase-parent-2026-05-09"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Doctor Update Orchestrator

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (phase parent) |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Superseded By** | None (014 dissolved into this packet as phases 004 + 005) |
| **Predecessor** | ../012-causal-graph-channel-routing/spec.md |
| **Successor** | None (current packet line) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A user at spec-kit `v3.3.0.0` (or any version older than current `v3.4.1.0`) needs a one-shot path to bring every database/index/graph in the spec-kit ecosystem into alignment with their current codebase and skill set. The 026 release shipped doctor commands for code-graph, skill-advisor, skill-budget, and MCP infra, but **four subsystems with on-disk databases have no `/doctor:*` coverage**: memory continuity-index, causal-edges, deep-loop coverage graphs, and CocoIndex. There is also no unified entry point that chains rebuilds in dependency-safe order with snapshot + rollback. Authoring the new commands is one half of the gap; authoring a reproducible Docker sandbox + manual testing playbook so users can verify the commands against canonical preconditions is the other half.

### Purpose
Group the complete doctor command surface timeline under one phase root so the surface is browsable in one place: initial command authoring (`001`), sandbox + playbook authoring (`002`), RM-8 remediation (`003`), additive router consolidation (`004`), and hard cutover (`005`). Each child owns its own Level 2 / Level 3 spec; this parent only documents the cross-child topology, the active layout, and the high-level outcome the children worked toward.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Maintain `013-doctor-update-orchestrator/` as the active thematic parent for the doctor command surface plus its testing harness.
- Track active child via `derived.last_active_child_id` in `graph-metadata.json`.
- Keep heavy docs (plan, tasks, checklist, decision-record, implementation-summary) inside the children, never at the parent root.

### Out of Scope
- Rewriting child-owned requirements (REQ-### items, ADRs) — those live in 001 and 002.
- Authoring command code or scenario files at this parent level — those live in canonical Public paths under the children.
- Running the sandbox harness — that is 002's deliverable, executed in a controlled environment, deferred to follow-on work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This file (phase parent root). |
| `description.json` | Create | Phase parent identity + parentChain. |
| `graph-metadata.json` | Create | Phase parent metadata + children_ids. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-doctor-commands/` | Complete | Feature Specification: 5 isolated `/doctor:*` commands (memory, causal-graph, deep-loop, cocoindex) + unified `/doctor:update` orchestrator implementing the council 10-line spec, plus the migration manifest for 3.3.0.0 → 3.4.1.0. Authored via cli-codex gpt-5.5 high fast across 5 sequential dispatch tracks; 23 deliverables total (5 cmds + 10 yamls + 1 manifest + 7 packet docs). G1+G2 verification gates passed. |
| 2 | `002-sandbox-testing-playbook/` | Complete | Feature Specification: Docker sandbox + 23-scenario manual testing playbook covering all 5 doctor commands and the version-migration end-to-end. Adds new playbook category `23--doctor-commands/` (IDs 323-347 with gaps at 337 and 343) plus `_sandbox/23--doctor-commands/` with Dockerfile, docker-compose.yml, fixture-fetch script, 4 harness scripts, and 23 per-scenario shell wrappers. |
| 3 | `002-rm8-013-remediation-doc-honesty-security/` | Complete | RM-8 doc-honesty + security hardening + cross-runtime mirror remediation that closed 30/30 P1 and 28/30 P2 findings from the original deep-review (commit `8d794afad`). 4 sequential cli-codex (gpt-5.5 high fast) batches: A doc honesty, B security (`flock(2)` + `--no-audit` drop + cap_drop), C cross-runtime mirror (10 doctor commands × 4 runtimes), D P2 cleanup. Verdict moved CONDITIONAL → PASS (hasAdvisories=true) per re-review commit `76daa9ef0`. |
| 4 | `003-router-phase/` | Complete | Router consolidation (was packet 014 Phase 1, dissolved into 013): authored `.opencode/commands/doctor.md` (argv-positional router) + `doctor/mcp.md` + `_routes.yaml` manifest + route-validate.sh CI assertion. 4-runtime mirrors (.claude / .gemini / .codex). Additive ship — old 10 `.md` commands still present during this phase. |
| 5 | `005-cutover-phase/` | Complete | Hard cutover (was packet 014 Phase 2, dissolved into 013): DELETED 9 legacy `/doctor:<name>.md` files across `.opencode` + `.gemini`; sed-updated 23 manual playbook scenarios + 28 sandbox shell scripts + 5 YAML assets + 3 install guides + sk-doc references + feature catalog + 013 historical spec docs (94 substitutions across 15 files); advisor reindex via `advisor_rebuild`. Final state: 3 `.md` files (router + mcp + update) per runtime; 10 unchanged YAML workflows. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Phase parent integrity (hard blockers)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P-001 | Phase parent root has the lean trio (`spec.md`, `description.json`, `graph-metadata.json`) and NO heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`). | `find . -maxdepth 1 -type f -name '*.md' -o -name '*.json'` returns the lean-trio (`spec.md`, `description.json`, `graph-metadata.json`) PLUS any cross-cutting optional docs (`handover.md`, `resource-map.md`). Heavy authored docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) MUST be absent at parent level. |
| REQ-P-002 | `graph-metadata.json` `derived.last_active_child_id` matches the most recently saved child packet. | Field is one of the five child folders and currently points to `005-cutover-phase`. |
| REQ-P-003 | All five children are listed in `graph-metadata.json` `children_ids` with the canonical `system-spec-kit/...` path prefix. | `children_ids` array length = 5; entries match children `001` through `005` with full prefix. |
| REQ-P-004 | Children 001 through 005 are `Complete` for parent to be `Complete`. | Tracked via per-child completion metadata and strict validation of the phase parent. |

### P1 — Cross-child outcomes

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P-010 | Every command authored in child 001 has at least one corresponding scenario in child 002's playbook category. | 5 commands × ≥1 scenarios ≥ 5; planned coverage is 23 scenarios across 6 feature blocks. |
| REQ-P-011 | The migration manifest authored in child 001 is exercised by at least one end-to-end scenario in child 002. | Scenario DOC-345 (or equivalent) cites `migration-manifest.json` and runs `--migrate` end-to-end. |
| REQ-P-012 | Child 002's sandbox harness wraps the canonical doctor command invocations exactly as documented in child 001's Markdown entrypoints (no parallel reimplementation). | Per-scenario `.sh` wrappers `cd` into the workspace and invoke `/doctor:*` via the same shell-friendly invocation pattern declared in the Markdown setup phase. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-P-001**: All five children reach complete status.
- **SC-P-002**: 5 `/doctor:*` commands registered in Skill Advisor and pass `validate_document.py --type command` (already true for child 001).
- **SC-P-003**: 23 manual playbook scenarios authored in `system-spec-kit/manual_testing_playbook/23--doctor-commands/` and indexed in the root playbook's Section 12 cross-reference (planned for child 002).
- **SC-P-004**: Sandbox harness scripts pass `bash -n` and `harness/run-all.sh --dry-run` exits 0 (planned for child 002).
- **SC-P-005**: Strict spec-folder validate exits 0 on parent root with all five child phases.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Phase parent strict validate may flag because the validator hasn't been updated for the lean-trio convention this packet adopted | Phase E gate G4 may fail on cross-packet template-manifest issue (same pattern as 002 + 003 packets in this session) | Document as known cross-packet issue; G4 acceptance allows it |
| Risk | Children diverge on naming conventions or path roots over time | Cross-child references break, root playbook index gets stale | Pin: child 001 commands at `Public/.opencode/commands/doctor/`; child 002 scenarios at `system-spec-kit/manual_testing_playbook/23--doctor-commands/`. Locked in this spec. |
| Risk | Codex parallel dispatch unreliability with 4 tracks (per memory `feedback_cli_dispatch_unreliability`) | Phase B in child 002 may need serial fallback | Tracks write to disjoint paths (5 ID ranges). Fallback to serial if hangs detected. |
| Dependency | Existing `doctor_code-graph_apply.yaml` style as canonical reference | Child 001's polish track depends on this gold standard | Confirmed canonical and stable; cited in 001's polish track prompt. |
| Dependency | sk-doc `validate_document.py` and spec-kit `validate.sh --strict` | All verification gates depend on these scripts | Both in repo; tracked in 001 + 002 verification sections. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(All resolved at intake — kept for audit trail.)

- **Q-A** *(answered 2026-05-09)*: Spec packet location for the sandbox playbook? **Answer**: New child `002-sandbox-testing-playbook/` inside this phase parent (parallel to `001-doctor-commands/`).
- **Q-B** *(answered 2026-05-09)*: Manual playbook home — packet-local or skill-level? **Answer**: Skill-level at `system-spec-kit/manual_testing_playbook/23--doctor-commands/` (matches existing 22-category convention).
- **Q-C** *(answered 2026-05-09)*: Sandbox harness location? **Answer**: `manual_testing_playbook/_sandbox/23--doctor-commands/` (sibling to Markdown categories with `_` prefix to keep out of validator scans).
- **Q-D** *(answered 2026-05-09)*: Fixture archive hosting? **Answer**: External download via `fetch-fixtures.sh` at sandbox setup time (cleanest repo footprint).
- **Q-E** *(answered 2026-05-09)*: Scenario ID range? **Answer**: 323-347 with gaps at 337 and 343 (23 IDs above current 322 file max in the playbook).
<!-- /ANCHOR:questions -->

---

<!--
PHASE-PARENT SPEC + LEVEL 1 (~210 lines)
- Lean trio at parent (this file + description.json + graph-metadata.json)
- 2 children (001-doctor-commands complete, 002-sandbox-testing-playbook in progress)
- No plan/tasks/checklist/decision-record/implementation-summary at parent (those live in children)
- PHASE DOCUMENTATION MAP enumerates child layout
- REQ-P-### tracks cross-child outcomes only; per-command/per-scenario REQs live in children
-->
