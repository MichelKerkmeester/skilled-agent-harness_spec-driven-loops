---
title: "Feature Specification: docs, agents, governance and closeout"
description: "Add cli-cursor mentions to the agent rosters (3 runtimes), governance docs (AGENTS.md/CLAUDE.md/README.md), and cross-skill sibling references against the current tree, then run full recursive validation to close out the cli-cursor creation packet."
trigger_phrases: ["cli-cursor closeout", "cli-cursor governance docs", "cli-cursor agent roster"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/007-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase 007 spec; status Planned"
    next_safe_action: "Author plan.md, tasks.md, checklist.md; run after phases 002-006"
    blockers: ["depends on phases 002-006 landing for their surfaces to reference"]
    key_files: ["AGENTS.md", "CLAUDE.md", "README.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Should the repo's own root AGENTS.md (which the Cursor CLI reads as rules if run here) gain any Cursor-specific note, or stay executor-agnostic?", "Which agent roster files (context/deep-research/deep-review/deep-improvement across .opencode/.claude/.codex) currently enumerate the sibling executors and therefore need a cli-cursor row - resolved by grepping the current tree, not replaying a template."]
    answered_questions: ["This is a first-time creation, so 007 ADDS cli-cursor mentions rather than restoring deleted ones; the touch-list is built by grepping the current tree."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: docs, agents, governance and closeout

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../006-cursor-manual-testing-playbook/spec.md` |
| **Successor** | None (final phase) |
| **Handoff Criteria** | `cli-cursor` mentioned wherever its 3 siblings are, across rosters/governance/cross-skill docs; whole packet passes `validate.sh --recursive --strict` 0/0 and the hub passes both skill validators at 0 fails. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Adding a 4th CLI mode is not complete when the packet and runtime wiring exist — the new executor must also appear wherever its 3 siblings already do: in the agent rosters (per-runtime `context`/`deep-research`/`deep-review`/`deep-improvement` agent docs across `.opencode/`, `.claude/`, `.codex/`), in governance docs (`AGENTS.md`, `CLAUDE.md`, `README.md`), and in cross-skill sibling mentions. Because this is a **first-time creation** (not a revival), there is no archived deletion diff to reverse; the touch-list must be built by grepping the *current* tree for where `cli-codex`/`cli-claude-code`/`cli-opencode` are enumerated, then adding a symmetric `cli-cursor` entry — never by replaying a stale template.

There is also a Cursor-specific wrinkle: the repo's own root `AGENTS.md` is a file the Cursor CLI itself reads as rules if `cursor-agent` is run in this repo (phase 001). Whether that file should carry any Cursor-specific note or stay executor-agnostic is an explicit open question for this phase, not a silent edit.

### Purpose
Add `cli-cursor` to every roster/governance/cross-skill surface where its siblings appear (touch-list built from the current tree), resolve the `AGENTS.md`-as-Cursor-rules question, and run the full closeout validation: `validate.sh --recursive --strict` on the whole packet plus the two hub skill validators, confirming the 4th mode is fully and consistently integrated with zero regressions.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Grep the current tree for every roster/governance/cross-skill surface enumerating the 3 sibling executors; add a symmetric `cli-cursor` entry to each.
- Update agent roster docs (`.opencode/agents/context.md` + `.claude`/`.codex` mirrors, `deep-research.md`, `deep-review.md`, `deep-improvement.md`) where sibling executors are listed.
- Update governance docs (`AGENTS.md`, `CLAUDE.md`, `README.md`) where the CLI hub's modes are enumerated.
- Update cross-skill sibling docs that mention the sibling CLI modes.
- Resolve the open question on whether the repo's root `AGENTS.md` (read by Cursor as rules) gains a Cursor-specific note.
- Run full closeout validation: `validate.sh --recursive --strict` on `030-cli-cursor-creation`, plus `parent-skill-check.cjs` and `validate_skill_package.py` against the hub.

### Out of Scope
- Any packet, executor-runtime, hook, model-registry, or playbook work — those are phases 002-006; this phase only adds the surrounding roster/governance/cross-skill mentions and validates.
- Editing sibling executors' own docs beyond adding the `cli-cursor` peer mention where the list of executors appears.
- Fabricating a Cursor changelog/version-history narrative anywhere in the closeout docs.
- Rewriting any archived (`z_archive/**`) content.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/agents/context.md` (+ `.claude`/`.codex` mirrors) | Modify | Add `cli-cursor` where sibling executors are enumerated (paths confirmed by grepping the current tree). |
| `.opencode/agents/deep-research.md`, `deep-review.md`, `deep-improvement.md` (+ runtime mirrors) | Modify | Add `cli-cursor` executor mention where siblings appear. |
| `AGENTS.md`, `CLAUDE.md`, `README.md` | Modify | Add `cli-cursor` to the CLI hub mode enumeration; resolve the AGENTS.md-as-Cursor-rules question. |
| Cross-skill sibling docs (grep-identified) | Modify | Add `cli-cursor` peer mention where the sibling CLI modes are listed. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | The touch-list is built by grepping the CURRENT tree for `cli-codex`/`cli-claude-code`/`cli-opencode` enumerations, not by replaying an archived or template list. | P0 |
| REQ-002 | Every roster/governance/cross-skill surface that enumerates the 3 siblings gains a symmetric `cli-cursor` entry; no surface is left with only 3 of the 4 modes. | P0 |
| REQ-003 | The repo's root `AGENTS.md`-as-Cursor-rules question is resolved with a recorded decision (add a Cursor note vs. stay executor-agnostic), not silently edited. | P1 |
| REQ-004 | `validate.sh --recursive --strict` on `030-cli-cursor-creation` returns 0 errors, 0 warnings across the phase-parent and every phase child. | P0 |
| REQ-005 | `parent-skill-check.cjs` and `validate_skill_package.py` against the hub both return 0 fails after all mentions are added. | P0 |
| REQ-006 | No fabricated Cursor changelog/version-history narrative is introduced in any closeout doc. | P1 |
| REQ-007 | Completion metadata across the packet is reconciled (no doc claims a conflicting completion state); phases 002-006 remain Planned, phase 001 remains Complete, and this phase's status is set truthfully. | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: A grep for the sibling executor names across rosters/governance/cross-skill docs shows `cli-cursor` present wherever all 3 siblings are.
- **SC-002**: `validate.sh --recursive --strict` on the packet returns 0/0.
- **SC-003**: `parent-skill-check.cjs` and `validate_skill_package.py` against the hub both return 0 fails.
- **SC-004**: The `AGENTS.md`-as-Cursor-rules decision is recorded.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Stale touch-list**: replaying a sibling's historical touch-list instead of grepping the current tree would miss surfaces that changed since the siblings were added, or touch surfaces that no longer exist. Mitigation: REQ-001 mandates a fresh grep.
- **Partial enumeration**: adding `cli-cursor` to some surfaces but not all leaves an inconsistent "3-of-4" state. Mitigation: REQ-002 + the SC-001 grep sweep.
- **Dependency — phases 002-006**: the surfaces this phase references (skill packet, executor kind, hooks, model, playbook) should exist before their mentions are added, or the mentions point at not-yet-built targets. Mitigation: run this phase last; where a target is still Planned, mention it consistently with how the siblings' equivalent is described.
- **Concurrent-session churn**: governance docs (`AGENTS.md`/`CLAUDE.md`/`README.md`) may be edited by other sessions. Mitigation: check `git status` for a clean tree on those files before editing; scope edits narrowly.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-C01**: Each added `cli-cursor` mention matches the exact phrasing/format its siblings use in that surface — symmetric, not a bespoke variant.

## 8. EDGE CASES
- A surface enumerates only 2 of the 3 siblings (pre-existing inconsistency): add `cli-cursor` to match the dominant pattern, and note (not fix) the pre-existing gap unless trivially correct.
- The root `AGENTS.md` is being edited concurrently: defer the AGENTS.md edit until its tree is clean; do not stage another session's changes.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 12/25 | Many small symmetric edits across grep-identified surfaces; no code. |
| Risk | 10/25 | Low blast radius per edit; main risk is partial enumeration or touching another session's dirty files. |
| Research | 8/20 | Touch-list is a fresh grep of the current tree; mechanical once identified. |
| **Total** | **30/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Stale/replayed touch-list misses surfaces | Medium | Medium | REQ-001 fresh grep |
| Partial "3-of-4" enumeration | Medium | Medium | REQ-002 + SC-001 sweep |
| Editing a concurrently-dirty governance file | Medium | Medium | `git status` check before editing |

## 11. USER STORIES
- As a maintainer, I want `cli-cursor` to appear wherever its 3 siblings do, so the 4th mode is a first-class peer across rosters, governance, and cross-skill docs, not a half-integrated addition.
- As the operator, I want the whole packet to pass `validate.sh --recursive --strict` 0/0 and the hub to pass both skill validators, so the creation is provably complete.

## 12. OPEN QUESTIONS
- Should the repo's own root `AGENTS.md` (which the Cursor CLI reads as rules if `cursor-agent` runs here) gain a Cursor-specific note, or stay executor-agnostic? Resolve with a recorded decision; leaning executor-agnostic unless a concrete Cursor-rules need is identified.
- Which exact roster files across `.opencode/`/`.claude/`/`.codex/` enumerate the sibling executors and thus need a `cli-cursor` row is resolved by grepping the current tree at implementation time, not from this spec's list.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../006-cursor-manual-testing-playbook/spec.md` (predecessor)
- `../spec.md` (phase-parent packet)
- `../../029-cli-devin-revival/007-docs-agents-governance-and-closeout/spec.md` (sibling closeout precedent)
