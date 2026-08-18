---
title: "Tasks: Cursor + Devin testing-playbook scenarios"
description: "Task ledger for adding VSN-017..VSN-020 scenarios and the shared-transport catalog page to the sk-vision playbook."
trigger_phrases:
  - "sk-vision cursor devin testing playbook tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook"
    last_updated_at: "2026-08-17T16:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored VSN-017..VSN-020 playbook scenarios and updated the index."
    next_safe_action: "Commit the sk-vision-scoped changes on v4."
    blockers: []
    key_files:
      - "specs/sk-vision/001-sk-vision-fork-of-opencode-senses/017-cursor-devin-testing-playbook/tasks.md"
      - ".opencode/skills/sk-vision/manual-testing-playbook/host-adapters/cursor-mcp.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-017-cursor-devin-testing-playbook"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cursor + Devin testing-playbook scenarios

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

- [x] T001 Confirm the playbook covered only the two in-process hosts and locate the MCP dependency both hosts share. Evidence: index §10 had `VSN-014`/`VSN-015`; the four-host model needs a standalone-server scenario as their shared root.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Author `host-adapters/mcp-standalone.md` (`VSN-017`), `cursor-mcp.md` (`VSN-018`), and `devin-mcp.md` (`VSN-019`). Evidence: three files present, each with a `VSN-0##` id and the standard scenario sections.
- [x] T003 Author `host-adapters/vision-blind-model.md` (`VSN-020`) proving a text-only model reads an image via `sk_vision_ocr`/`sk_vision_inspect`; enrich the Cursor/Devin "Why This Matters" with the GLM vision-blind angle. Evidence: `VSN-020` pass/fail keys on a tool call + ground-truth match; both attach files name GLM.
- [x] T004 Port `feature-catalog/host-adapters/mcp-transport.md` and update the index §10 (header, intro, four entries), the coverage note, and the version to `1.1.0.0`. Evidence: catalog page present; §10 lists `VSN-017`..`VSN-020`; coverage note reads 20 scenarios.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Confirm the four scenario files and the catalog page exist. Evidence: `ls host-adapters/` lists the four; `mcp-transport.md` present.
- [x] T006 Confirm the index names four hosts and links the four scenarios. Evidence: `grep` on §10 matches `VSN-017`..`VSN-020` and "four host".
- [x] T007 Confirm the catalog-manifest refresh and skill package. Evidence: `ci-skill-root-metadata.cjs` `OK [S] sk-vision (wrote leaf-manifest.json, leaf-aliases.json)`; `validate_skill_package.py --check` PASS.
- [ ] T008 Commit the sk-vision-scoped changes on v4. Evidence: pending the commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implementation tasks marked `[x]`. Evidence: `tasks.md` T001-T007.
- [ ] Commit task T008 complete. Evidence: pending.
- [x] No `[B]` blocked tasks remaining. Evidence: `tasks.md` has no blocked entry.
- [x] Verification passed. Evidence: `implementation-summary.md` Verification table.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
