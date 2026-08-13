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
    last_updated_at: "2026-08-13T06:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Phase 015 deprecated sk-create-flowchart fully (deleted, not redirected)"
    next_safe_action: "Hand back to the user for review/merge decision on worktree branch sk-doc/0145-sk-create-diagram"
    blockers: []
    key_files:
      - "spec.md"
      - "001-inventory-and-skill-contract/decision-record.md"
      - "015-flowchart-deprecation/implementation-summary.md"
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
| **Status** | Complete — all 15 phases shipped; phase 013 ran a 10-iteration multi-model deep review (CONDITIONAL, 4 P1), phase 014 resolved every P1 finding, and phase 015 fully deprecated (deleted, not redirected) the superseded `sk-create-flowchart` skill |
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
| `008-resource-reorganization-and-code-alignment/` | Create | 008 | references/ and assets/ split into domain subfolders; deeper Python alignment; scripts/README.md |
| `009-manual-playbook-execution/` | Create | 009 | All 9 manual-testing-playbook scenarios run for real via deepseek/deepseek-v4-flash; results gathered |
| `010-benchmark-artifact-embedding/` | Create | 010 | 7 real scenario outputs copied into their benchmark report folders; 2 no-artifact scenarios documented |
| `011-reference-template-alignment/` | Create | 011 | 10 named reference files aligned with `sk-create-skill`'s literal template (dividers, casing, intro de-duplication) |
| `012-flowchart-capability-merge/` | Create | 012 | `sk-create-flowchart`'s ASCII/markdown capability merged into `sk-create-diagram` as a second output format |
| `013-deep-review-grok-deepseek/` | Create | 013 | 10-iteration fan-out deep review (Grok 4.6 + deepseek-v4-flash), merged CONDITIONAL verdict |
| `014-review-remediation/` | Create | 014 | All 4 P1 findings from the 013 review resolved, verified clean |
| `015-flowchart-deprecation/` | Create | 015 | `sk-create-flowchart` fully deprecated: skill directory deleted, every command/prompt mirror deleted, all live hub/router/advisor/doc references purged or repointed at `sk-create-diagram` |
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
| 8 | `008-resource-reorganization-and-code-alignment/` | Split references/ and assets/ into domain subfolders; deeper Python alignment; scripts/README.md | Complete |
| 9 | `009-manual-playbook-execution/` | Run all 9 manual-testing-playbook scenarios for real via deepseek/deepseek-v4-flash; gather results | Complete |
| 10 | `010-benchmark-artifact-embedding/` | Copy real scenario outputs into their benchmark report folders per `create-benchmark`'s copied-artifact contract | Complete |
| 11 | `011-reference-template-alignment/` | Align 10 named reference files with `sk-create-skill`'s literal reference template | Complete |
| 12 | `012-flowchart-capability-merge/` | Merge `sk-create-flowchart`'s ASCII/markdown capability into `sk-create-diagram`; advisor/hub integration | Complete |
| 13 | `013-deep-review-grok-deepseek/` | 10-iteration fan-out deep review (Grok 4.6 + deepseek-v4-flash); merged CONDITIONAL verdict | Complete |
| 14 | `014-review-remediation/` | Fix all 4 P1 findings from phase 013's review | Complete |
| 15 | `015-flowchart-deprecation/` | Fully deprecate `sk-create-flowchart`: delete the skill and every command/prompt mirror, purge/repoint every live hub, router, advisor, and doc reference | Complete |

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
| Phase 007 audit + artifacts | Phase 008 reorg | `validate.sh --strict` clean for the phase-parent and all 7 children | Phase 007 checklist evidence |
| Phase 008 reorg + alignment | Phase 009 playbook execution | `references/`/`assets/` subfoldered with 0 broken cross-references; both scripts AST-clean; `scripts/README.md` exists; `validate.sh --recursive --strict` clean for parent + all 8 children | Recorded command output in `008-resource-reorganization-and-code-alignment/implementation-summary.md` |
| Phase 009 playbook execution | Phase 010 artifact embedding | 9/9 scenarios executed and results gathered via the canonical wrapper | Phase 009 checklist evidence |
| Phase 010 artifact embedding | Phase 011 reference alignment | 7/7 artifact copies byte-identical, 2/2 no-artifact scenarios documented | Phase 010 checklist evidence |
| Phase 011 reference alignment | Phase 012 flowchart merge | 10/10 named files structurally aligned with the template | Phase 011 checklist evidence |
| Phase 012 flowchart merge | Phase 013 deep review | `sk-create-diagram` routes both output formats; hub JSON + advisor index refreshed | Phase 012 checklist evidence |
| Phase 013 deep review | Phase 014 remediation | Merged verdict recorded; headline finding independently confirmed real | Phase 013 checklist evidence |
| Phase 014 remediation | Phase 015 flowchart deprecation | All 4 P1 findings resolved; `validate.sh --recursive --strict` clean for parent + all 14 children | Recorded command output in `014-review-remediation/implementation-summary.md` |
| Phase 015 flowchart deprecation | Closeout | `sk-create-flowchart` fully removed; 0 live references remain outside historical spec docs; `validate.sh --recursive --strict` clean for parent + all 15 children | Recorded command output in `015-flowchart-deprecation/implementation-summary.md` |
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
- Machine metadata: `description.json` and `graph-metadata.json`
