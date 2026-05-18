---
title: "Tasks: System Spec Kit Codegraph Residue Audit"
description: "Task list for auditing and cleaning stale code-graph references from system-spec-kit user-facing docs after packet 014."
trigger_phrases:
  - "012 codegraph residue audit tasks"
  - "system spec kit code graph cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/026-system-spec-kit-codegraph-residue-audit"
    last_updated_at: "2026-05-14T17:35:44Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-012"
    recent_action: "Completed audit and cleanup tasks; git staging blocked by sandbox"
    next_safe_action: "Stage and commit the scoped 012 changes when git index writes are permitted"
    blockers:
      - "Sandbox denied git index lock creation during staging: .git/index.lock Operation not permitted"
    key_files:
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/README.md"
      - ".opencode/skills/system-spec-kit/ARCHITECTURE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-012-system-spec-kit-codegraph-residue-audit"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: System Spec Kit Codegraph Residue Audit

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

- [x] T001 Confirm pre-check found no existing `012-*` folder.
- [x] T002 Confirm current branch is `main`.
- [x] T003 Run scoped raw grep across system-spec-kit user-facing markdown docs.
- [x] T004 Classify findings into STALE_REMOVE, STALE_REWRITE, LEGITIMATE_HISTORICAL, and LEGITIMATE_CROSS_SKILL.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Scaffold the 012 Level 1 packet.
- [x] T006 Rewrite root skill docs to describe Code Graph as sibling-skill integration.
- [x] T007 Rewrite stale feature catalog package paths to `.opencode/skills/system-code-graph/`.
- [x] T008 Rewrite stale manual testing package and DB paths to `.opencode/skills/system-code-graph/`.
- [x] T009 Preserve legitimate historical and cross-skill references.
- [x] T010 Restore unrelated Skill Advisor catalog/playbook files after self-check caught unrelated deletions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Re-run stale-residue grep and confirm no matches in scoped markdown docs.
- [x] T012 Confirm no system-code-graph files were modified by this packet.
- [x] T013 Run strict validation on the 012 packet.
- [B] T014 Stage only the 012 packet and scoped system-spec-kit doc edits. Blocked by sandbox denial when creating `.git/index.lock`.
- [B] T015 Commit on `main` with the requested commit message. Blocked because staging failed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [B] Git staging and commit blocked by sandbox index-lock permissions.
- [x] Stale-residue verification passed.
- [x] Strict packet validation passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:phase2-tasks -->
## Phase 2 Tasks (added 2026-05-15)

### Phase 2 - Install Guide + Doctor Coverage

- [ ] **P2-001 — Author INSTALL_GUIDE.md** | `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | New file, 9 sections, sk-doc template marker, frontmatter (title/description/trigger_phrases), cross-link to SET-UP - Code Graph.md
- [ ] **P2-002 — Fix .vscode/mcp.json broken launcher** | rename `system_code_graph` → `mk_code_index`, point launcher at `mk-code-index-launcher.cjs`, apply `_NOTE_1_DB`/`_NOTE_2_TOOLS`/`_NOTE_3_INDEX_DEFAULTS` convention
- [ ] **P2-003 — Insert mk_skill_advisor block in .vscode/mcp.json** | currently absent entirely; mirror opencode.json:38–51
- [ ] **P2-004 — Add diagnose_mk_code_index() to mcp-doctor.sh** | clone `diagnose_mk_spec_memory()` pattern at lines 144–265
- [ ] **P2-005 — Add diagnose_mk_skill_advisor() to mcp-doctor.sh** | same pattern, system-skill-advisor paths
- [ ] **P2-006 — Update mcp-doctor.sh enumeration + dispatch** | lines 4, 16, 50, 58–62, 501, 533–536
- [ ] **P2-007 — Fix mcp-doctor.sh line 533 typo** | `diagnose_mk-spec-memory` → `diagnose_mk_spec_memory`
- [ ] **P2-008 — Patch doctor_mcp_install.yaml** | valid_values (line 82), server definitions (lines 102–165), install_guides map (42–46, 95–99), report_format (326–334)
- [ ] **P2-009 — Patch doctor_mcp_debug.yaml** | valid_values (line 85), repair_actions (111–149), install_guides map (41–46, 92–96), report_format (276–284)
- [ ] **P2-010 — Update mcp.md help copy** | lines 60, 115, 153 — "all 4 MCP servers" → "all 6 MCP servers"
- [ ] **P2-011 — Patch master install README §7.1 Component Matrix** | lines 319–328
- [ ] **P2-012 — Patch master install README §7.3 Installation Bundles** | lines 369–391
- [ ] **P2-013 — Insert master install README §10.4 mk-code-index** | between current §10.3 Sequential Thinking and §10.4 Chrome DevTools
- [ ] **P2-014 — Insert master install README §10.5 Skill Advisor** | after new §10.4
- [ ] **P2-015 — Update master install README Phase 3 Complete Validation** | lines 729–739, add checklist items + update grep one-liner
- [ ] **P2-016 — Patch master install README §19 Setup Guides table** | line 1450, add INSTALL_GUIDE.md row
- [ ] **P2-017 — Reconcile master install README aggregate counts** | lines 17, 58, 73, 1440
- [ ] **P2-018 — Run strict validate** | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` (expect exit 0)
- [ ] **P2-019 — Cross-runtime config consistency check** | grep all 6 configs for `mk_code_index`/`mk-code-index`
- [ ] **P2-020 — Fill implementation-summary.md Phase 2 evidence**
- [ ] **P2-021 — Update implementation-summary.md `_memory.continuity` for Phase 2 completion**
<!-- /ANCHOR:phase2-tasks -->
