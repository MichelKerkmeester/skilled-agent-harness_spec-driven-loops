---
title: "Feature Specification: Doctor Command Consolidation [system-spec-kit/026-graph-and-context-optimization/014-doctor-command-consolidation/spec]"
description: "Phase parent for collapsing the 10 .md /doctor:* command surface into 3 .md (router + orchestrator + mcp infra) via a manifest-driven routing pattern. Phase 1 (001-router-phase) ships the router additively; Phase 2 (002-cutover-phase, planned) deletes the 9 old commands, syncs cross-runtime mirrors, updates the manual testing playbook, and reindexes the skill advisor."
trigger_phrases:
  - "014-doctor-command-consolidation"
  - "doctor command consolidation"
  - "/doctor router"
  - "_routes.yaml"
  - "doctor manifest"
  - "10 to 3 doctor commands"
  - "Option C router consolidation"
  - "doctor argv-positional routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-doctor-command-consolidation"
    last_updated_at: "2026-05-11T16:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 1 + Phase 2 shipped"
    next_safe_action: "Commit + push"
    blockers: []
    key_files:
      - "001-router-phase/spec.md"
      - "001-router-phase/plan.md"
      - "001-router-phase/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-phase-parent-2026-05-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cutover style: hard cutover end state (no shim aliases)"
      - "/doctor:update scope: stays separate (Option C, 10->3)"
      - "Packet sequencing: two phases (router additive, then cutover)"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Doctor Command Consolidation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (phase parent) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../013-doctor-update-orchestrator/spec.md |
| **Successor** | None (current packet line) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 013 shipped 10 `/doctor:*` markdown commands under `.opencode/commands/doctor/`: 8 follow a Gen-A "unified setup + YAML execution" contract (`causal-graph`, `cocoindex`, `code-graph`, `deep-loop`, `memory`, `skill-advisor`, `skill-budget`, `update`) and 2 follow an older Gen-B "MODE POLICY: Standalone" contract (`mcp_debug`, `mcp_install`). Roughly 50 lines of identical boilerplate — EXECUTION PROTOCOL block, CONSTRAINTS, GATE 3 EXEMPT table, "SINGLE CONSOLIDATED PROMPT" header — is duplicated across 8 of those files (30-50K of duplication). The per-command variability that actually matters is small: `allowed-tools` MCP set, setup variable names, YAML asset filename, and the GATE 3 `Location` cell. The 10 YAML workflows in `assets/` are self-sufficient and own all execution logic. This is a routing problem dressed up as 10 separate commands; consolidating the markdown surface preserves every behavior while shrinking maintenance burden, mirror cost (4 runtimes × 10 files = 40 → 4 × 3 = 12), and description-budget footprint.

### Purpose
Group the Phase 1 router-authoring work (`001-router-phase/`) and the Phase 2 hard-cutover work (`002-cutover-phase/`, planned after Phase 1 ships) under one phase root so the two-stage rollout is browsable in one place. Each phase child owns its own Level 2 spec; this parent only documents the cross-phase topology, the routing pattern, and the high-level outcome the two phases work toward.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Maintain `014-doctor-command-consolidation/` as the active phase parent for the consolidation work.
- Track active child via `derived.last_active_child_id` in `graph-metadata.json`.
- Keep heavy docs (plan, tasks, checklist, decision-record, implementation-summary) inside the phase children, never at the parent root.

### Out of Scope
- Rewriting the 10 YAML workflow files in `.opencode/commands/doctor/assets/` — those stay untouched.
- Changing `/doctor:update` (the orchestrator) behavior or its frontmatter — it survives the consolidation as a standalone command.
- Modifying the 4 helper scripts in `.opencode/commands/doctor/scripts/` (`audit_descriptions.py`, `doctor-runtime-bootstrap.sh`, `mcp-doctor-lib.sh`, `mcp-doctor.sh`) — those are workflow dependencies, not router concerns.
- Authoring command code at the parent level — it lives in the children.

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
| 1 | `001-router-phase/` | In Progress | Feature Specification: Author `.opencode/commands/doctor.md` (router, ~250-300 LOC) + `.opencode/commands/doctor/mcp.md` (MCP infra, ~150 LOC) + `.opencode/commands/doctor/_routes.yaml` (canonical route manifest) + `.opencode/commands/doctor/scripts/route-validate.sh` (CI assertion). Ships ADDITIVELY alongside the existing 10 commands so both `/doctor memory` and `/doctor:memory` invocations succeed during the validation window. Mirror to .claude / .gemini / .codex in the same packet. |
| 2 | `002-cutover-phase/` | Planned | Hard-cutover packet: DELETE the 9 old .md files (causal-graph, cocoindex, code-graph, deep-loop, memory, skill-advisor, skill-budget, mcp_debug, mcp_install) across all 4 runtime dirs (36 files total); sed-update 23 manual playbook scenarios + 4 harness scripts to switch `/doctor:<name>` → `/doctor <name>`; rebuild Skill Advisor index. Locked decision: NO shim aliases (per `feedback_delete_not_archive_or_comment`); advisor lexical routing absorbs old phrases. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Phase parent integrity (hard blockers)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P-001 | Phase parent root has the lean trio (`spec.md`, `description.json`, `graph-metadata.json`) and NO heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) at the parent level. | `find . -maxdepth 1 -type f` matches lean-trio convention. Heavy authored docs MUST be absent at parent level. |
| REQ-P-002 | `graph-metadata.json` `derived.last_active_child_id` matches the most recently saved child packet. | Field is `001-router-phase` while Phase 1 is in progress; updates to `002-cutover-phase` when Phase 2 work starts. |
| REQ-P-003 | Both planned children are listed (or scheduled) in `graph-metadata.json` `children_ids`. | `001-router-phase` present at packet creation; `002-cutover-phase` added when that packet is scaffolded. |
| REQ-P-004 | Phase 1 reaches `_memory.continuity.completion_pct: 100` BEFORE Phase 2 scaffolding begins. | Tracked via child `001-router-phase/spec.md` continuity frontmatter. |

### P1 — Cross-phase outcomes

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P-010 | The router .md authored in Phase 1 dispatches correctly to all 7 Gen-A YAMLs (memory, causal-graph, code-graph, deep-loop, cocoindex, skill-advisor, skill-budget) without modifying those YAML files. | Smoke test: `/doctor <target> --dry-run` for each of 7 targets loads the corresponding `assets/doctor_<target>.yaml` and produces identical output to today's `/doctor:<target>`. |
| REQ-P-011 | `/doctor:mcp install` and `/doctor:mcp debug` (Phase 1) reach `doctor_mcp_install.yaml` and `doctor_mcp_debug.yaml` respectively. | Smoke test: each sub-action loads the right YAML and produces identical output. |
| REQ-P-012 | `_routes.yaml` is the single source of truth for per-target metadata (yaml asset, setup vars, allowed flags, mutation class, MCP tool subset, advisor trigger phrases). | `route-validate.sh` asserts internal consistency (every route's yaml exists in `assets/`; every route's `mcp_tools` is a subset of the router's frontmatter `allowed-tools` union). |
| REQ-P-013 | Phase 2 cutover removes the 9 old .md files cleanly across all 4 runtime dirs and updates all references. | `grep -ril "/doctor:memory\|/doctor:causal-graph\|/doctor:code-graph\|/doctor:deep-loop\|/doctor:cocoindex\|/doctor:skill-advisor\|/doctor:skill-budget\|/doctor:mcp_debug\|/doctor:mcp_install" .opencode .claude .gemini .codex` returns ZERO matches (case-insensitive per `feedback_rename_grep_case_insensitive`). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-P-001**: Both children reach `_memory.continuity.completion_pct: 100`.
- **SC-P-002**: After Phase 1, the new `/doctor` router (with argv-positional dispatch) is registered in the Skill Advisor with confidence ≥ 0.8 for the union of historical trigger phrases. Validation: `skill_advisor.py "memory continuity index drift" --threshold 0.8` → `/doctor`.
- **SC-P-003**: After Phase 2, `find .opencode/commands/doctor -maxdepth 1 -type f -name "*.md"` returns exactly 2 files (`mcp.md`, `update.md`); `find .opencode/commands -maxdepth 1 -name "doctor.md"` returns 1 file (the router); total `.opencode/commands/doctor/` markdown drops from ~127K to ~50K (~60% byte reduction).
- **SC-P-004**: All 23 manual playbook scenarios at `system-spec-kit/manual_testing_playbook/23--doctor-commands/` invoke the new `/doctor <target>` form and pass `bash -n` plus harness smoke tests.
- **SC-P-005**: Strict spec-folder validate (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict`) exits 0 for both children.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Flag-parsing order in the router: if `--scope`, `--server`, `--dry-run`, `--no-snapshot`, `--json`, `--force` are pre-parsed before target resolution, they silently bind to the wrong target's schema | Cross-target flag injection silently corrupts subsystem invocations | Router MUST parse target first, flags second. Unit test asserts each target sees only its allowed flags; cross-schema injection raises a clear error. |
| Risk | Skill Advisor trigger-phrase dilution (7 frontmatters → 1) | Historical phrases like `"causal edges drift"` lose recall when collapsed under one description | `_routes.yaml` carries per-target `trigger_phrases`; ingestion script teaches the advisor to lexically route old phrases to `/doctor` with the right target context. |
| Risk | `allowed-tools` frontmatter union balloons in router | Wider tool authorization than per-target principle of least privilege | Unavoidable per OpenCode runner (no lazy authorization). `_routes.yaml` documents per-target subset; `route-validate.sh` asserts YAML tool calls fall within the per-target allowlist. |
| Risk | Manual playbook scenarios reference `/doctor:<name>` form | Phase 2 sed pass must catch all 23 scenarios + 4 harness scripts without breaking shell quoting | sed pass + case-insensitive grep verification gate; smoke run before commit. |
| Risk | Cross-runtime mirrors drift between `.opencode` / `.claude` / `.gemini` / `.codex` | One runtime's router becomes out of date | Same canonical body in all 3 markdown mirrors; codex TOML form is body-equivalent (per `feedback_codex_toml_body_drift`); 4-runtime parity smoke test. |
| Dependency | The 10 YAML workflows in `.opencode/commands/doctor/assets/` are stable and tested | Router relies on them being self-sufficient | Confirmed stable since 013 shipped (2026-05-11). Phase 1 does not modify any YAML. |
| Dependency | Skill Advisor `advisor_rebuild` MCP tool | Phase 2 advisor reindex needs this | Already shipped; tested in 013. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(All resolved at intake — kept for audit trail.)

- **Q-A** *(answered 2026-05-11)*: Should `/doctor:update` fold into the router or stay separate? **Answer**: Stays separate (Option C, final state 10 → 3 .md). The orchestrator's lock + DAG + snapshot semantics differ enough from per-subsystem diagnostics that conflating them would mix mental models.
- **Q-B** *(answered 2026-05-11)*: Should the cutover ship shim aliases for old `/doctor:<name>` invocations? **Answer**: No. Hard cutover end state. Advisor lexical routing absorbs old trigger phrases; users typing `/doctor:memory` get a suggested correction via the advisor.
- **Q-C** *(answered 2026-05-11)*: Single packet or phased? **Answer**: Two phases. Phase 1 (`001-router-phase/`) ships router + mcp.md + `_routes.yaml` additively (10 + 2 = 12 .md temporarily). Phase 2 (`002-cutover-phase/`) deletes old, syncs mirrors, updates playbook, reindexes advisor (final 3 .md).
- **Q-D** *(answered 2026-05-11)*: Where does the routing manifest live? **Answer**: Separate file `.opencode/commands/doctor/_routes.yaml` (not inlined in markdown) so the Skill Advisor + CI validator can read it as canonical data without parsing the router .md.
- **Q-E** *(answered 2026-05-11)*: Routing UX — `--target=<name>` flag or argv-positional? **Answer**: argv-positional (`/doctor memory --dry-run`). `--target=<name>` is preserved as a compatibility alias for power users who prefer flag-only invocations.
<!-- /ANCHOR:questions -->

---

<!--
PHASE-PARENT SPEC + LEVEL 1 (~220 lines)
- Lean trio at parent (this file + description.json + graph-metadata.json)
- 2 planned children (001-router-phase in progress, 002-cutover-phase planned)
- No plan/tasks/checklist/decision-record/implementation-summary at parent (those live in children)
- PHASE DOCUMENTATION MAP enumerates child layout
- REQ-P-### tracks cross-phase outcomes only; per-file REQs live in children
-->
