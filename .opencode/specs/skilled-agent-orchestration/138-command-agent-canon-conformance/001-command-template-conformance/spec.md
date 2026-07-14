---
title: "Feature Specification: command-template conformance — uniform create-command router vocabulary across all seven OpenCode command families"
description: "Conform create/design/doctor/memory/speckit/prompt-improve/goal_opencode command docs to the sk-doc create-command canon: the uniform six numbered H2 sections, with asset triads only for workflow-YAML families and the direct-dispatch variant for memory/doctor, behavior-preserving, validate_document --type command clean."
trigger_phrases:
  - "command template conformance"
  - "create-command router vocabulary"
  - "doctor unnumbered header fix"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/001-command-template-conformance"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Conformed seven command families to create-command canon"
    next_safe_action: "Orchestrator runs validate.sh --strict on this child, then rolls up the parent"
---
# Feature Specification: command-template conformance — uniform create-command router vocabulary across all seven OpenCode command families

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` (worktree `.worktrees/0041-skilled-command-agent-canon`) |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | skilled-agent-orchestration/138-command-agent-canon-conformance |
| **Predecessor** | 000-foundations (supplies the deep-alignment command-docs lane findings) |
| **Successor** | 002-agent-canon-conformance |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The seven OpenCode command families are uneven against the sk-doc `create-command` canon. `validate_document.py --type command` keys on numbered `## N.` headers and a router-core (`OWNED ASSETS` + `PRESENTATION BOUNDARY`). Two families FAIL the validator today: `doctor/*` (three files) use UNNUMBERED headers so the validator detects zero sections (exit 1, two blocking errors each), and `prompt-improve.md` is a single fat monolith missing a required leaf section (exit 1). The rest PASS but carry canon drift: `create/*` (ten files) use renamed Title-case sections (`Routing Assets`, `Routing Rules`) that trip recommended-section warnings; `memory/*` uses banned synonym headers (`ROUTING ASSETS`, `WORKFLOW ROUTING`) and `memory/save.md` mis-declares the (correct) absence of workflow YAML as a "Missing upstream asset"; `search.md` inlines mode logic. `design/*` and `speckit/*` already use the precedent vocabulary and validate clean.

### Purpose
Bring every command family to the uniform create-command router vocabulary — the six numbered H2 sections `## 1. ROUTER CONTRACT / ## 2. OWNED ASSETS / ## 3. MODE ROUTING / ## 4. EXECUTION TARGETS / ## 5. PRESENTATION BOUNDARY / ## 6. WORKFLOW SUMMARY` — while preserving 100% of dispatch behavior. Section STRUCTURE is uniform across all families; ASSETS follow dispatch class: workflow-YAML families (`create`, `design`, `speckit`) keep their `_auto`/`_confirm`/`_presentation` triads, and the direct-dispatch families (`memory`, `doctor`) use the direct-dispatch canon variant with presentation-only OWNED ASSETS and an EXECUTION TARGETS section that points at the script/tool/route manifest (doctor keeps its `_routes.yaml`). No `_auto`/`_confirm` YAML is authored for direct-dispatch families — the canon forbids it.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The command docs of all seven families: `.opencode/commands/{create,design,doctor,memory,speckit}/*.md`, `.opencode/commands/prompt-improve.md`, `.opencode/commands/goal_opencode.md`.
- Section renumbering/renaming to the canonical six-section router vocabulary; folding non-canon sections (`HARD RULES`, `RELATED COMMANDS`, `WHEN TO USE`, `PRECONDITIONS`, `REGISTER`) into canon slots.
- Correcting `memory/save.md`'s mis-declared workflow-YAML "gap" to a plain direct-dispatch statement.
- Decomposing `prompt-improve.md` enough to satisfy the leaf-command required sections without changing its behavior.

### Out of Scope
- Any change to a command's runtime BEHAVIOR, dispatch target, mode set, or flag contract — structure/vocabulary only.
- Authoring or removing workflow YAML assets, presentation `.txt` bodies, or `_routes.yaml` content (the direct-dispatch families keep their existing dispatch model).
- Agent conformance (002) and Codex parity (003).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor/{mcp,speckit,update}.md` | Modify | Unnumbered → numbered six-section router-core (INVALID→VALID); keep subsystem-dispatch model |
| `.opencode/commands/prompt-improve.md` | Modify | Add the missing required leaf section(s); numbered H2s (INVALID→VALID) |
| `.opencode/commands/create/*.md` (10) | Modify | Rename Title-case sections to canonical six-section vocabulary |
| `.opencode/commands/memory/*.md` (4) | Modify | Banned-synonym headers → canon; fix save.md gap mis-framing; fold extras |
| `.opencode/commands/goal_opencode.md` | Modify | Conform section vocabulary |
| `.opencode/commands/design/*.md` (5), `.opencode/commands/speckit/*.md` (4) | Modify (light) | Fold inserted sections / renumber to clean 1-6 where warnings remain |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
- REQ-001: `doctor/{mcp,speckit,update}.md` conform to numbered six-section router-core; `validate_document.py --type command` exits 0 for each (INVALID→VALID).
- REQ-002: `prompt-improve.md` gains the required leaf section(s); `--type command` exits 0.
- REQ-003: Every `.opencode/commands/**/*.md` in scope exits 0 on `validate_document.py --type command` (`shared/scripts` entrypoint).
- REQ-004: Behavior preserved — no dispatch target, mode, or flag contract changes (diff review confirms structure-only edits).

### P1 - Required (complete OR user-approved deferral)
- REQ-005: `create/*` and `memory/*` use the canonical section vocabulary (no banned synonyms); recommended-section warnings resolved where the canon prescribes the section.
- REQ-006: `memory/save.md`'s "Missing upstream asset" line is replaced by a plain direct-dispatch (no-workflow-YAML-by-design) statement.
- REQ-007: The deep-alignment command-docs lane re-audit returns no confirmed P0 for any family.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

### Acceptance Scenarios
- Given a conformed `doctor/mcp.md`, when `validate_document.py --type command` runs, then it exits 0 with the router-core sections detected as numbered H2s.
- Given the full family set, when each command doc is validated, then all exit 0 and a behavior diff shows only structural/vocabulary edits.
- Given the re-audit, when the deep-alignment command-docs lane runs against the conformed files, then its verdict carries no confirmed P0 finding.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Behavior drift risk**: renumbering/renaming sections could accidentally alter dispatch prose. Mitigation: structure-only edits, per-file behavior diff, REQ-004 gate.
- **Direct-dispatch mis-application**: forcing workflow-YAML sections onto memory/doctor would author canon-forbidden assets. Mitigation: the direct-dispatch variant (presentation-only OWNED ASSETS, script/route EXECUTION TARGETS) is the fixed target per the parent's adjudicated decision.
- **Dependency**: 000-foundations' deep-alignment command-docs lane findings populate this phase's checklist; the `shared/scripts` `validate_document.py` entrypoint is the per-file gate.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Re-audit signal (REQ-007) is a deterministic proxy.** The deep-alignment command-docs lane re-audit relies on the deterministic `validate_document.py --type command` sweep (0 blocking / 0 warnings across all 23 modified files) rather than the loop's reduced report. The loop's reducer gap is documented in 000-foundations. No confirmed P0 remains under the deterministic gate; whether the reducer would surface any non-deterministic P1 is UNKNOWN until 000's reducer gap is closed.
- **RESOLVED — direct-dispatch asset shape.** Whether `memory/*` and `doctor/*` should carry `_auto`/`_confirm` workflow YAML was adjudicated (Fable) to the direct-dispatch canon variant: presentation-only OWNED ASSETS plus an EXECUTION TARGETS section pointing at the script/tool/route manifest (doctor keeps `_routes.yaml`). No workflow YAML was authored for direct-dispatch families.
- **RESOLVED — behavior-preservation evidence.** A reference-set diff (every dispatch target, asset path, and `$ARGUMENTS` token in each pre-conformance HEAD file vs the conformed file) confirmed zero losses across all 23 modified files, satisfying REQ-004.

<!-- /ANCHOR:questions -->
