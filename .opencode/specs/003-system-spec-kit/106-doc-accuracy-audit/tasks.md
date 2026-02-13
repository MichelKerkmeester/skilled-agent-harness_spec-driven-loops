# Tasks: Documentation Accuracy Audit — system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Wave 1: Core + References (Agents 1-5)

- [ ] T001 [P] Audit core files — SKILL.md, READMEs, top-level docs
- [ ] T002 [P] Audit reference docs — memory subsystem
- [ ] T003 [P] Audit reference docs — spec-kit subsystem
- [ ] T004 [P] Audit reference docs — validation and scripts
- [ ] T005 [P] Audit reference docs — templates architecture

---

## Wave 2: References + Templates (Agents 6-10)

- [ ] T006 [P] Audit template level_1 files
- [ ] T007 [P] Audit template level_2 files
- [ ] T008 [P] Audit template level_3 and level_3+ files
- [ ] T009 [P] Audit template core and addendum files
- [ ] T010 [P] Audit constitutional and memory format docs

---

## Wave 3: Scripts + MCP Server (Agents 11-15)

- [ ] T011 [P] Audit script documentation — spec/ scripts
- [ ] T012 [P] Audit script documentation — memory/ scripts
- [ ] T013 [P] Audit script documentation — template/ scripts
- [ ] T014 [P] Audit MCP server tool documentation
- [ ] T015 [P] Audit MCP server type and config documentation

---

## Wave 4: Agents + Commands + Guides (Agents 16-20)

- [ ] T016 [P] Audit agent definition files (.opencode/agent/)
- [ ] T017 [P] Audit command files — spec_kit commands
- [ ] T018 [P] Audit command files — memory commands
- [ ] T019 [P] Audit install guide files
- [ ] T020 Synthesize all findings into consolidated audit report

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 176 files audited with zero skipped
- [ ] Final audit report produced (T020)

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
