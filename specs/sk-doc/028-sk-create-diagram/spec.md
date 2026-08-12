---
title: "Feature Specification: sk-create-diagram — editorial HTML/SVG diagram mode for sk-doc"
description: "Phase parent for forking the external diagram-design plugin (27 diagram types, self-contained HTML/SVG output) into a new sk-create-diagram nested workflow packet under the sk-doc parent hub."
trigger_phrases:
  - "sk-create-diagram"
  - "editorial HTML diagram skill"
  - "fork diagram-design plugin"
  - "27 diagram types skill"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram"
    last_updated_at: "2026-08-12T08:21:53.000Z"
    last_updated_by: "claude"
    recent_action: "Completed all 7 phases; sk-create-diagram is registered and strict-validated"
    next_safe_action: "Hand back to the user for review/merge decision on worktree branch sk-doc/0145-sk-create-diagram"
    blockers: []
    key_files:
      - "spec.md"
      - "001-inventory-and-skill-contract/decision-record.md"
      - "007-adherence-audit-and-artifact-completion/implementation-summary.md"
      - "../../../.opencode/skills/sk-doc/sk-create-diagram/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The source material lives at context/ (an untracked, already-forked copy of the cathrynlavery/diagram-design plugin) and is the canonical input for every phase."
      - "The new skill is a nested sk-doc workflow packet, not a standalone hub — one advisor identity (sk-doc) already exists."
      - "Implementation phases dispatch to Deepseek v4 Flash via cli-opencode; the orchestrating session plans, dispatches, and verifies."
      - "The icon set ships in v1 — pure reference content, no runtime dependency risk, and richer diagram types need it (decision-record.md §5)."
      - "Onboarding stays agent-mediated guidance, not a packet script — no sibling sk-doc mode's toolSurface declares a network-fetch tool (decision-record.md §5)."
      - "manual-testing-playbook/ and feature-catalog/ ship as packet-local subdirectories (mirroring sk-create-diff), not entries in sk-doc's shared master indexes (007/decision-record.md)."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  Detailed requirements, decisions, tasks, validation, and continuity live in child phases.
-->

# Feature Specification: sk-create-diagram — editorial HTML/SVG diagram mode for sk-doc

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P2 |
| **Status** | Complete — all 7 phases shipped and strict-validated; see phase 006 for the one documented deferral and phase 007 for the adherence audit + playbook/catalog completion |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` (worktree `.worktrees/0145-sk-doc-sk-create-diagram`) |
| **Track** | `sk-doc` |
| **Predecessor** | None |
| **Successor** | `001-inventory-and-skill-contract` |
| **Handoff Criteria** | Content-trim manifest, target skill tree, and command surface are decided and strict-valid before phase 002 authoring starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`context/` holds a complete, already-working third-party Claude/Pi/Codex plugin ("diagram-design" by Cathryn Lavery) that generates 27 kinds of editorial technical diagrams as self-contained HTML files with inline SVG — architecture, flowcharts, sequence, ER, Gantt, and more — plus draw.io/Mermaid import and PNG/SVG export. `sk-doc` has no equivalent capability: its closest sibling, `sk-create-flowchart`, is explicitly ASCII/markdown-only and out of scope for SVG or HTML output.

### Purpose

Fork the external plugin's content into a new `sk-create-diagram` nested workflow packet under the `sk-doc` parent hub, rebuilt to this repository's `sk-create-skill` authoring standards (frontmatter contract, section order, root metadata class, kebab-case resource trees, advisor routing) rather than copied verbatim.

> This parent stays lean. Phase 001 owns the inventory and mapping decisions; phases 002 through 006 own detailed implementation, wiring, and validation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A new `.opencode/skills/sk-doc/sk-create-diagram/` nested workflow packet: `SKILL.md`, `README.md`, `references/`, `assets/`, `scripts/`, `changelog/`, `manual-testing-playbook/`, `benchmark/`.
- All 27 diagram types from the source plugin, ported as `references/type-*.md` with one canonical example asset each.
- The shared design system (style guide, connector rules, complexity budget, taste gate), onboarding flow, and optional primitives (annotation callout, sketchy variant, terminal variant, icon set — icon set scope decided in phase 001).
- draw.io and Mermaid import (extract scripts + reference docs) and PNG/SVG export guidance, routed by natural language inside the one packet — no separate slash commands per import/export action.
- One command, `/create:diagram`, following the router + presentation + auto/confirm YAML pattern used by sibling `/create:*` commands.
- `mode-registry.json`, `hub-router.json`, and `command-metadata.json` registration under the `sk-doc` hub.

### Out of Scope

- The source repo's own CI/lint tooling (`lint-skin.py`, `verify-*.py`, `build-icons.py`, `fix-mojibake.py`) and its GitHub Actions workflow — these validate the *source plugin's* release process, not this skill.
- Multi-variant asset galleries (light/dark/full/consultant/terminal per type) — v1 ships one canonical light example per type plus the four base templates; the source's full gallery (`index.html`, ~90 example files) is not ported.
- Any change to `sk-create-flowchart` beyond an optional one-line "When NOT to Use" cross-reference — its ASCII-only scope is unchanged.
- Live-URL brand onboarding as an automated network fetch — see Open Question 2.

### Aggregate File Scope

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-inventory-and-skill-contract/` | Create | 001 | Content-trim manifest, target tree, scope-boundary decision record |
| `002-skill-scaffold-and-design-system/` | Create | 002 | `SKILL.md`, style guide, onboarding, output-spec, primitives, base templates |
| `003-diagram-type-reference-library/` | Create | 003 | 27 `type-*.md` references + 27 canonical example assets |
| `004-import-export-tooling/` | Create | 004 | draw.io/Mermaid extract scripts, import/export references, NL routing |
| `005-command-and-hub-wiring/` | Create | 005 | `/create:diagram` command, mode-registry/hub-router/command-metadata entries |
| `006-validation-and-quality-gate/` | Create | 006 | Strict validation, advisor smoke test, implementation-summary, closeout |
| `007-adherence-audit-and-artifact-completion/` | Create | 007 | Literal template/code-standards audit + fix; manual-testing-playbook/ and feature-catalog/ packages |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-inventory-and-skill-contract/` | Map `context/` to the `sk-create-skill` contract; decide trim manifest, target tree, name/boundary | Complete |
| 2 | `002-skill-scaffold-and-design-system/` | Scaffold the packet; author `SKILL.md` core + design-system references + base templates | Complete |
| 3 | `003-diagram-type-reference-library/` | Port all 27 diagram-type references and one canonical example each | Complete |
| 4 | `004-import-export-tooling/` | Port draw.io/Mermaid extraction and import/export guidance | Complete |
| 5 | `005-command-and-hub-wiring/` | Register `/create:diagram` and the hub entries | Complete |
| 6 | `006-validation-and-quality-gate/` | Strict validation, advisor smoke test, closeout | Complete — advisor smoke test deferred, see phase 006 |
| 7 | `007-adherence-audit-and-artifact-completion/` | Literal template/code-standards adherence audit; author manual-testing-playbook/ and feature-catalog/ | Complete |

### Phase Transition Rules

- Phase 001 is orchestrator-authored (judgment/mapping work); phases 002-004 are dispatched to Deepseek v4 Flash via `cli-opencode` and verified by the orchestrator before the next phase opens.
- Phases 003 and 004 both depend only on phase 002's frozen `SKILL.md` skeleton and design-system references; they may run back-to-back but neither blocks the other's *authoring* — both must land before phase 005 wiring.
- Phase 005 (hub registry, router, command files) is orchestrator-authored directly — it edits shared `sk-doc` hub files with wider blast radius than a single packet.
- Phase 006 runs the full strict validation chain and is orchestrator-authored (verifier role).
- Every child must pass strict validation at intake and closure. The parent map remains the coordination truth; detailed execution stays in children.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| Packet preparation | Phase 001 inventory | `context/` content is read, `sk-create-skill` contract is loaded, worktree exists | Child strict validation and parent recursive strict validation |
| Phase 001 inventory | Phases 002-004 | Trim manifest, target tree, skill name/boundary, and command surface are decided in `decision-record.md` | Phase 001 strict validation |
| Phase 002 scaffold | Phase 003 and 004 | `SKILL.md` skeleton, `references/shared` design-system docs, and base templates exist and pass `validate_skill_package.py --check` | Phase 002 checklist evidence |
| Phases 003 and 004 | Phase 005 wiring | All 27 type references + examples, and import/export tooling, are present and internally consistent with `SKILL.md` | Phase 003/004 checklist evidence |
| Phase 005 wiring | Phase 006 validation | `/create:diagram` command, `mode-registry.json`, `hub-router.json`, `command-metadata.json` entries exist and resolve | Phase 005 checklist evidence |
| Phase 006 validation | Phase 007 audit | `validate.sh --strict` clean for the phase-parent and all 6 children | Phase 006 checklist evidence |
| Phase 007 audit + artifacts | Closeout | Template/code-standards deviations fixed; `manual-testing-playbook/` and `feature-catalog/` exist and pass their validators; `validate.sh --recursive --strict` clean for parent + all 7 children | Recorded command output in `007-adherence-audit-and-artifact-completion/implementation-summary.md` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None remaining — all three resolved in phase 001's `decision-record.md` §5 (icon set ships in v1; onboarding stays agent-mediated) and phase 005 (the `sk-create-flowchart` cross-reference was added).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Source material: `context/skills/diagram-design/SKILL.md`, `context/README.md`
- Inventory and mapping: `001-inventory-and-skill-contract/spec.md`, `001-inventory-and-skill-contract/decision-record.md`
- Skill-creation standard: `.opencode/skills/sk-doc/sk-create-skill/SKILL.md`
- Sibling boundary reference: `.opencode/skills/sk-doc/sk-create-flowchart/SKILL.md`
- Machine metadata: `description.json` and `graph-metadata.json`
