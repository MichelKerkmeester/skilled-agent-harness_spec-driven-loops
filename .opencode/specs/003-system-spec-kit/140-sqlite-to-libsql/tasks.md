# Tasks: libSQL Hybrid RAG Enablement Assessment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Consolidate existing SQLite vs libSQL evidence into decision framing (`specs/003-system-spec-kit/140-sqlite-to-libsql/spec.md`)
- [x] T002 Create Level 3 planning docs with template-compliant structure (`specs/003-system-spec-kit/140-sqlite-to-libsql/plan.md`)
- [x] T003 Define measurable success metrics for quality, compatibility, reliability (`specs/003-system-spec-kit/140-sqlite-to-libsql/spec.md`)
- [ ] T004 Freeze benchmark query set and baseline corpus for parity harness (`[UNKNOWN] benchmark corpus path`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Implement `DatabaseAdapter` interface boundary in MCP runtime (`.opencode/skill/system-spec-kit/mcp_server/...`)
- [ ] T006 Implement `SearchCapabilityProfile` and backend feature checks (`.opencode/skill/system-spec-kit/mcp_server/...`)
- [ ] T007 [P] Add shadow-read parity harness and metric collection (`.opencode/skill/system-spec-kit/mcp_server/...`)
- [ ] T008 Add dual-write canary controls with idempotency and divergence counters (`.opencode/skill/system-spec-kit/mcp_server/...`)
- [ ] T009 [P] Implement stream lifecycle error classification and retry telemetry (`.opencode/skill/system-spec-kit/mcp_server/...`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Validate Top-10 overlap, Recall@10 delta, and nDCG@10 delta against thresholds (`checklist.md`)
- [ ] T011 Run 10 checkpoint restore drills and capture evidence (`checklist.md`)
- [ ] T012 Verify rollback time objective (<= 15 minutes) in canary scenario (`plan.md`)
- [ ] T013 Finalize Go/No-Go decision record with evidence (`decision-record.md`)
<!-- /ANCHOR:phase-3 -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Confirm active scope is still `specs/003-system-spec-kit/140-sqlite-to-libsql`
- [ ] Confirm dependencies from `plan.md` section 6 are not blocked
- [ ] Confirm next pending task has no unmet dependency
- [ ] Confirm P0 checklist gates affected by this task

### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Execute tasks in dependency order unless explicitly marked `[P]` |
| TASK-SCOPE | Do not modify files outside the declared scope |
| TASK-VERIFY | Validate evidence and thresholds before marking `[x]` |
| TASK-DOC | Update checklist and task status in the same change set |

### Status Reporting Format

```markdown
## Status Reporting
- Task: T###
- State: IN_PROGRESS | COMPLETED | BLOCKED
- Evidence: file path or test output
- Next: T###
```

### Blocked Task Protocol

- Mark blocked items as `[B]` with one-line reason and dependency.
- Escalate `UNKNOWN` blockers in `spec.md` open questions.
- Do not continue to dependent tasks while blocker remains unresolved.

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] P0 checklist gates passed with evidence
- [ ] Go/No-Go migration posture documented and approved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification**: See `checklist.md`
- **Architecture Decision**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
