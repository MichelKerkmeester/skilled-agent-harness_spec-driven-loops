---
title: "Feature Specification: Phase 6: advisor-and-integration"
description: "After the structural fold-in and scorer rewrite, sweep the remaining documentation, advisor, and constitutional referrers to the new nested cli-external layout, repoint the reciprocal graph edges, regenerate skill-graph.json, and exercise the CI card-sync gate — while leaving logical-name executor-kind strings untouched."
trigger_phrases:
  - "cli-external parent phase 006"
  - "advisor integration sweep"
  - "cli dispatch referrer sweep"
  - "constitutional path template repoint"
  - "skill graph regeneration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/026-cli-external-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-09T19:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the advisor-and-integration sweep spec, plan, tasks, checklist"
    next_safe_action: "Execute the referrer sweep after phase 005"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - "CLAUDE.md"
      - ".opencode/skills/sk-prompt/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Repoint functional and constitutional referrers to the nested cli-external path; leave logical-name executor-kind strings untouched"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: advisor-and-integration

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-09 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 8 |
| **Predecessor** | 005-foldin-cli-claude-code |
| **Successor** | 007-routing-benchmark-and-review |
| **Handoff Criteria** | The remaining functional and constitutional referrers are repointed, the reciprocal graph edges name `cli-external`, `skill-graph.json` is regenerated from metadata, the CI card-sync gate passes, and the logical-name executor-kind strings are provably untouched |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Merge cli-opencode and cli-claude-code into one parent hub cli-external with two workflow modes: cli-opencode and cli-claude-code specification.

**Scope Boundary**: Referrer sweep and integration cleanup only. This phase repoints the remaining functional and constitutional referrers, the reciprocal graph edges, and regenerates the advisor graph; it does not move directories, rewrite the scorer, or run the Lane-C benchmark (phase 007).

**Dependencies**:
- Phases 004 and 005 completed the structural move, the atomic scorer rewrite, and the identity dissolution.
- Phase 001's classified referrer inventory names which referrers are functional, constitutional, and logical-name.
- The hub's single `graph-metadata.json` carries the folded advisor identity before `skill-graph.json` is regenerated.

**Deliverables**:
- Repoint of the remaining functional referrers: the `skill_advisor.py` hardcoded lexical alias-to-id maps (including the literal `.opencode/skills/cli-claude-code` path key) and the CI card-sync gate.
- Repoint of the constitutional path templates in `CLAUDE.md`, `AGENTS.md`, and `cli-dispatch-skill-preload.md` to the nested `.opencode/skills/cli-external/cli-X/SKILL.md` form.
- Repoint of the reciprocal advisor graph edges (for example `sk-prompt`'s `enhances` edges into the old flat identities) to `cli-external`, plus a regeneration of `skill-graph.json` from metadata.
- An explicit no-op confirmation that the logical-name executor-kind strings were left untouched.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After phases 004 and 005 move the skill content, rewrite the scorer, and dissolve the two identities, a set of documentation, advisor, and constitutional referrers can still name the old flat `cli-opencode/` and `cli-claude-code/` paths. Leaving those stale makes operator guidance, the constitutional cli-dispatch preload rule, the Python advisor alias maps, and the advisor graph inconsistent with the hub layout. The sweep must be surgical: it must repoint path-based referrers while leaving the logical-name executor-kind strings (which dispatch by config kind, not path) untouched, or it will break dispatch by "fixing" a name that was never a path.

### Purpose
Ensure zero stale live path references to the old flat skills remain, the constitutional path templates and reciprocal graph edges name `cli-external`, the advisor graph is regenerated from the merged metadata, and the CI card-sync gate passes — without disturbing the logical-name class.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repoint the `skill_advisor.py` hardcoded lexical alias-to-id maps, including the literal `.opencode/skills/cli-claude-code` path key, to the hub layout.
- Repoint the constitutional path templates in `CLAUDE.md`, `AGENTS.md`, and `system-spec-kit/constitutional/cli-dispatch-skill-preload.md` to the nested `.opencode/skills/cli-external/cli-X/SKILL.md` form.
- Repoint the reciprocal advisor graph edges that name the old flat identities (for example `sk-prompt/graph-metadata.json`'s `enhances` edges) to `cli-external`.
- Repoint `system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`, which hardcodes both skills' flat `SKILL.md` and `assets/prompt_templates.md` paths, to the nested packet paths.
- Regenerate `skill-graph.json` from the updated `graph-metadata.json` through the advisor rebuild/compiler path; never hand-edit the generated artifact.
- Sweep the remaining active documentation/prose referrers (READMEs, install guides, other skills' cross-references) from the old flat paths to the nested packet paths.
- Exercise the CI card-sync gate (`check-prompt-quality-card-sync.sh`) and its `.github/workflows/prompt-card-sync.yml` wiring against the final layout — the per-skill card paths were already repointed atomically in phases 004/005, so this is a verify, not a repoint.

### Out of Scope
- Moving directories, rewriting the scorer, or re-baselining the parity fixtures - phases 004/005 own those atomic structural changes.
- Rewriting the internal outbound relative cross-skill paths inside the moved trees - phases 004/005 own those in the move itself, because a depth-broken `../../sk-...` never contains the old flat path string and this phase's grep sweep STRUCTURALLY cannot detect it.
- Repointing the logical-name executor-kind strings (`executor-config.ts` `EXECUTOR_KINDS`, the deep-loop `if_cli_*` config branches, matrix adapters, `model_profiles.json` `executor` values) - these dispatch by stable string, not path, and MUST stay unchanged.
- Lane-C benchmark execution and the live delegation-routing re-baseline - phase 007 owns those.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Modify | Repoint the hardcoded lexical alias-to-id maps and the literal `.opencode/skills/cli-claude-code` path key to the hub layout. |
| `CLAUDE.md` and `AGENTS.md` | Modify | Repoint the cli-dispatch preload path template to `.opencode/skills/cli-external/cli-X/SKILL.md`. |
| `.opencode/skills/system-spec-kit/constitutional/cli-dispatch-skill-preload.md` | Modify | Repoint the same path template and its example paths. |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Modify | Repoint the reciprocal `enhances` edges into the old flat identities to `cli-external`. |
| `.opencode/skills/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts` | Modify | Repoint the hardcoded flat `cli-opencode`/`cli-claude-code` `SKILL.md` and `assets/prompt_templates.md` paths to the nested packet paths so the vitest passes. |
| `skill-graph.json` generated artifact | Regenerate | Regenerate from the updated hub `graph-metadata.json` through the advisor rebuild/compiler command; do not hand-edit. |
| documentation/prose referrers (READMEs, install guides, cross-skill docs) | Modify | Sweep active prose references from the old flat paths to the nested packet paths. |
| `check-prompt-quality-card-sync.sh` + `.github/workflows/prompt-card-sync.yml` | Verify | Exercise the CI sync-check path against the final layout (per-skill card paths already repointed in 004/005); edit only if the check proves a path is still stale. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Remove stale active old-flat-path references. | `grep -rl` for the old flat `cli-opencode/` and `cli-claude-code/` paths across active files returns zero hits outside the new `cli-external/` content and historical spec/changelog text. |
| REQ-002 | Repoint the functional advisor referrers. | The `skill_advisor.py` alias maps and the literal `.opencode/skills/cli-claude-code` path key resolve the hub layout; the `outsourced-agent-handback-docs.vitest.ts` hardcoded flat paths are repointed and the vitest passes; the CI card-sync gate passes against the final layout. |
| REQ-003 | Repoint the constitutional path templates. | `CLAUDE.md`, `AGENTS.md`, and `cli-dispatch-skill-preload.md` use the nested `.opencode/skills/cli-external/cli-X/SKILL.md` path form. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Repoint reciprocal edges and regenerate the graph. | The reciprocal `enhances` edges name `cli-external`, and `skill-graph.json` is regenerated through the advisor rebuild path (not hand-edited), with the diff showing generated output only. |
| REQ-005 | Leave the logical-name executor-kind strings untouched. | A targeted grep confirms `executor-config.ts` `EXECUTOR_KINDS`, the deep-loop `if_cli_*` branches, the matrix adapters, and `model_profiles.json` `executor` values are unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The re-run stale-path sweep is clean for active files: no old flat `cli-opencode/`/`cli-claude-code/` path hits remain outside `cli-external/` and historical text.
- **SC-002**: The constitutional path templates and reciprocal graph edges name `cli-external`, and `skill-graph.json` is regenerated from metadata.
- **SC-003**: The CI card-sync gate passes, and the logical-name executor-kind strings are provably unchanged.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 structural move, dissolution, and scorer rewrite | If phase 005 is incomplete, this phase may repoint prose to paths that do not exist yet | Confirm the moved packets, the single hub identity, and the green scorer before sweeping |
| Dependency | Advisor rebuild/compiler command | If the compiler path is unavailable, generated graph drift cannot be closed safely | Stop and inspect the advisor rebuild workflow; do not hand-edit `skill-graph.json` |
| Risk | A naive global replace corrupts historical text or hits logical-name strings | High | Scope the sweep to active files; explicitly allow historical spec/changelog text; leave the logical-name class untouched |
| Risk | The CI card-sync script still assumes the old layout | Medium | Run `check-prompt-quality-card-sync.sh` and fix only proven stale sync paths in scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Precision
The sweep is class-aware: it repoints only functional and constitutional path referrers and never touches the logical-name executor-kind strings. Precision here is a correctness property, not a style preference — over-repointing breaks dispatch.

### History Preservation
Historical spec/changelog prose that documents the pre-hub state is left intact; only live functional and routing references are repointed.

### Regeneration Discipline
`skill-graph.json` is regenerated from source metadata, never hand-edited, so the generated artifact stays reproducible from the advisor rebuild path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### A referrer is both a path and a name in the same file
If a file contains both a path reference (repoint) and a logical-name executor-kind string (leave), the sweep edits only the path occurrence and leaves the string, verified line by line rather than by a file-wide replace.

### The advisor rebuild command is unavailable
If the advisor graph compiler cannot run, `skill-graph.json` is left as-is and the phase blocks on restoring the rebuild path rather than hand-editing the generated file.

### A reciprocal edge points at a mode, not the hub
Reciprocal edges are repointed to the hub identity `cli-external`, not to a nested mode, because advisor edges connect skill identities and the modes are advisor-invisible.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None. The locked decisions and the phase 001 breakage-class taxonomy establish exactly which referrers repoint and which stay untouched.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC (~120 lines)
- Core + Level 2 addendum
- NFRs and Edge Cases added
- Verification-focused documentation
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
