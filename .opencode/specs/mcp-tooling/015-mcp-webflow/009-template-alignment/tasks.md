---
title: "Tasks: Phase 9 - Template alignment and standards conformance"
description: "Template-alignment tasks for the mcp-webflow packet."
trigger_phrases:
  - "webflow template tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/009-template-alignment"
    last_updated_at: "2026-08-03T06:13:04Z"
    last_updated_by: "pi"
    recent_action: "Align the mcp-webflow packet with the canonical skill templates"
    next_safe_action: "Packet complete"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-mcp-webflow-009"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9 - Template alignment and standards conformance

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the canonical template contracts (asset, reference, catalog snippet, playbook snippet) [evidence: `skill-asset-template.md`, `skill-reference-template.md`, `feature-catalog-snippet-template.md`, `manual-testing-playbook-snippet-template.md` read]

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Align `assets/` files with the skill-asset-template (canonical naming, short intro, OVERVIEW with Purpose/Usage, numbered sections, `---` dividers) [evidence: `assets/utcp-manual-reference.md`, `assets/payload-examples.md`]
- [x] T003 Move `examples/` to `assets/examples/` and align each example with the asset template [evidence: `assets/examples/*.md` — 5 files, contextType general, 3 trigger phrases]
- [x] T004 Rename all playbook scenarios without the `-001` numeric suffix [evidence: `manual-testing-playbook/**` — 16 files renamed]
- [x] T005 Rebuild the playbook root index with resolving links and `{PREFIX}-{NNN}` IDs [evidence: `manual-testing-playbook/manual-testing-playbook.md`]
- [x] T006 Add `---` dividers and the snippet-template sub-structure to all 9 catalog cards [evidence: `feature-catalog/*.md` — dividers, SOURCE FILES tables, SOURCE METADATA bullets, template markers]
- [x] T007 Align `references/action-reference.md` with the reference template [evidence: short intro, OVERVIEW, numbered sections 1-23, RELATED RESOURCES last]
- [x] T008 Align `references/tool-surface.md` with the reference template [evidence: duplicate-H1 artifact removed; 220-action count consistent]
- [x] T009 Align `references/mcp-wiring.md` with the reference template [evidence: twin OVERVIEWs merged; duplicate artifact removed]
- [x] T010 Align `references/troubleshooting.md` with the reference template [evidence: duplicate H1 removed; sections renumbered]
- [x] T011 Update SKILL.md/README cross-references after renames/moves [evidence: grep sweep — zero stale references in `SKILL.md`/`README.md`]
- [x] T012 Regenerate the leaf-manifest [evidence: `leaf-manifest.json` regenerated; fleet metadata 11/11]

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Dispatch fresh DeepSeek v4 Flash sub-agents to check template compliance [evidence: 4 sub-agent reports; all P1/P2 fixed; `tasks.md` T001-T014 closed]
- [x] T014 Run validators and close the phase [evidence: validate_skill_package PASS; package_skill --check PASS; fleet metadata 11/11; recursive strict validation green]

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Zero P0/P1 template deviations from the DeepSeek v4 Flash check [evidence: 4 sub-agent reports, all findings fixed]
- [x] All cross-references resolve [evidence: grep sweep + link check]
- [x] Validators pass [evidence: validate_skill_package PASS; package_skill --check PASS]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

