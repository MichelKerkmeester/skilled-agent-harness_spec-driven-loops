---
title: "Tasks: sk-create-diagram command and hub wiring"
description: "Task queue for registering sk-create-diagram in the sk-doc hub and wiring the /create:diagram command."
trigger_phrases:
  - "diagram hub wiring tasks"
importance_tier: "important"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/005-command-and-hub-wiring"
    last_updated_at: "2026-08-12T06:52:26.000Z"
    last_updated_by: "claude"
    recent_action: "Authored task queue"
    next_safe_action: "Author once phases 002-004 land"
    blockers:
      - "Waiting on phases 002-004"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-create-diagram command and hub wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [B] Confirm phases 002-004 landed and validate — blocks the rest of this phase [EVIDENCE: phases 002-004 `validate_skill_package.py --check --strict` all PASS.]
- [x] T002 Read `sk-create-diff`'s registry/router/command-metadata entries as the copy template [EVIDENCE: full entries read via Read tool before authoring.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `sk-create-diagram` entry to `mode-registry.json` [EVIDENCE: `python3 -c "import json; ..."` confirms entry present and valid JSON.]
- [x] T004 Add the router signal + vocabulary class + `tieBreak` entry to `hub-router.json` [EVIDENCE: set comparison confirms `modes == signals` and `tieBreak` covers all modes.]
- [x] T005 Add the `/create:diagram` entry to `command-metadata.json` [EVIDENCE: 12/12 entries, valid JSON, choreography resources resolve.]
- [x] T006 Create `.opencode/commands/create/diagram.md` (thin router) [EVIDENCE: file exists, 3309 bytes.]
- [x] T007 Create `create-diagram-presentation.txt`, `create-diagram-auto.yaml`, `create-diagram-confirm.yaml` [EVIDENCE: all 3 exist; both YAML files pass `yaml.safe_load`.]
- [x] T008 Replace the `README.md` stub with full content [EVIDENCE: `validate_document.py --type readme` reports 0 issues.]
- [x] T009 Replace the `changelog/v1.0.0.0.md` stub with a real entry [EVIDENCE: file replaced with full v1.0.0.0 entry.]
- [x] T010 Add the one-line cross-reference in `sk-create-flowchart/SKILL.md` [EVIDENCE: `SKILL.md:39` diff, single line.]
- [x] T011 Regenerate `sk-doc/leaf-manifest.json` [EVIDENCE: `git diff --stat` shows 82 insertions, 0 deletions, additive-only.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run `ci-skill-root-metadata.cjs` and confirm `sk-doc` stays class H clean [EVIDENCE: `OK [H] sk-doc`; 3 incidental unrelated-hub touches reverted via `git checkout --`.]
- [ ] T013 Run `skill_graph_scan --trusted` then `advisor_recommend` smoke test [DEFERRED: `system-skill-advisor/mcp-server` build fails on a pre-existing `@types/node` resolution gap unrelated to this packet; documented in checklist.md CHK-023 and implementation-summary.md Known Limitations rather than silently skipped.]
- [x] T014 Manually trace `/create:diagram` through the router to its presentation/workflow assets [EVIDENCE: EXECUTION TARGETS table in `diagram.md` resolves both `:auto` and `:confirm` paths; both asset files confirmed to exist.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required tasks marked [x]; T013 carries an explicit, evidenced deferral rather than a silent skip
- [x] No [B] tasks remain
- [ ] Advisor smoke test surfaces `sk-create-diagram` [DEFERRED: see T013.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Pattern reference**: `.opencode/commands/create/diff.md`
<!-- /ANCHOR:cross-refs -->
