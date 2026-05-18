---
title: "Tasks: Phase A README PoC"
description: "Task tracker for the 3-folder system-code-graph README authoring proof-of-concept."
trigger_phrases:
  - "035 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/017-code-folder-readmes"
    last_updated_at: "2026-05-15T08:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created task list"
    next_safe_action: "T004 dispatch Pass 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:708de18f42cac0fa4278af4ca9f9f0238582d4bd26fcd6a1b421f68284c03546"
      session_id: "035-tasks"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase A README PoC

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold packet (description.json, graph-metadata.json, spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, resource-map.md)
- [x] T002 Verify cli-devin install + auth (devin v2026.5.6-8, logged in)
- [x] T003 Read sk-doc CODE template + 2 exemplar READMEs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T004 Compose Pass 1 prompt at `/tmp/devin-035-pass1.md` (folder list, JSON schema, output paths)
- [ ] T005 Dispatch `devin --prompt-file /tmp/devin-035-pass1.md --model swe-1.6 --permission-mode normal </dev/null`
- [ ] T006 Verify 3 context bundles in `research/context-bundles/{mcp_server-root,core,plugin_bridges}.json`
- [ ] T007 Compose Pass 2 prompt at `/tmp/opencode-035-pass2.md` (bundle refs + sk-doc template + HVR + 2 exemplars)
- [ ] T008 Dispatch `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general ...`
- [ ] T009 Verify 3 READMEs written in target folders
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T010 Per-README `validate_document.py --type readme` → exit 0 × 3
- [ ] T011 Per-README HVR score check via `--json` → `hvr_score >= 85` × 3
- [ ] T012 Anchor presence grep (4 mandatory anchors per README)
- [ ] T013 Bulk audit via `audit_readmes.py` scoped to system-code-graph → 0 blocking errors
- [ ] T014 Strict-validate on this packet → exit 0
- [ ] T015 Fill in implementation-summary.md with results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` or `[B]` with rationale
- [ ] 3 READMEs land in scope folders + pass validation
- [ ] Strict-validate exits 0
- [ ] Commit on main
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:cross-refs -->
