---
title: "Tasks: skill-advisor model-server default spawn"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "model server spawn tasks"
  - "flip the spawn default"
  - "socket fallback tasks"
  - "live demand proof"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: model server default spawn

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

- [x] T001 Read the launcher's spawn gate, the supervision control and the client's socket default (`.opencode/bin/system-skill-advisor-launcher.cjs`, `lib/model-server-supervision.cjs`, `shared/embeddings/providers/hf-local.ts`)
- [x] T002 Scaffold this packet at Level 1 (`specs/system-skill-advisor/023-model-server-default-spawn`)
- [x] T003 [P] Record the stakes read: one default in one launcher file, reversible by flag or revert
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Flip the setting reader to default-on, explicit-on and off, and export it for tests (`.opencode/bin/system-skill-advisor-launcher.cjs`)
- [x] T005 Degrade to a log line when the supervision library is absent under the default; keep explicit `1` fatal (`.opencode/bin/system-skill-advisor-launcher.cjs`)
- [x] T006 Move the model-server files directory off the deleted database directory in the launcher, the supervision tcp fallback and the child's listen target (`.opencode/bin/system-skill-advisor-launcher.cjs`, `.opencode/bin/lib/model-server-supervision.cjs`, `.opencode/bin/hf-model-server.cjs`)
- [x] T007 Document the default and the kill switch (`.env.example`, `ENV-REFERENCE.md`, `.claude/mcp.json`, `.cursor/mcp.json`, `opencode.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Live proof from the worktree: demand listener ready at the shared socket, demand request 503, child spawned and listening on the same path (`scratch/` launcher stderr excerpts in the summary)
- [x] T009 Unit test over unset, blank, `1`, `0`, `false`, `off`, `no`; bootstrap tests repointed at the bridge's socket resolution; launcher, supervision and embedder suites green
- [x] T010 Packet docs written and validated
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (spawn chain); model load blocked by the host install, recorded as a limitation
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---



