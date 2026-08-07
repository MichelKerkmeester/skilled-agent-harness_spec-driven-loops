---
title: "Tasks: AGENTS.md Communication Quality Section"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "communication quality"
  - "agents.md"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/003-communication-quality"
    last_updated_at: "2026-08-07T08:44:03Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded task breakdown; all tasks complete"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".codex/AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: AGENTS.md Communication Quality Section

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Analyze context source; extract communication-craft heuristics [evidence: `context/` Reddit thread read; summarized in `spec.md:56`]
- [x] T002 Read both AGENTS.md files directly; map coverage [evidence: `AGENTS.md` §1/§4/§7 vs `.codex/AGENTS.md` §1-12 mapped]
- [x] T003 Separate net-new from already-covered principles [evidence: 6 net-new list recorded in `plan.md:78`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Insert COMMUNICATION QUALITY section after §7 [evidence: `AGENTS.md:464` header present]
- [x] T005 Renumber Agent & Skill Routing §8 to §9 [evidence: `AGENTS.md:497` now `## 9. AGENT & SKILL ROUTING`]
- [x] T006 Renumber Quick Reference §9 to §10 [evidence: `AGENTS.md:536` now `## 10. QUICK REFERENCE`]
- [x] T007 Add early-commitment caveat to §3 [evidence: `.codex/AGENTS.md` §3 `Show Work Before Conclusion` updated]
- [x] T008 Add required/optional + best-practice bullets to §4 [evidence: `.codex/AGENTS.md` §4 `Always Do This` two bullets added]
- [x] T009 Add Register subsection to §6 [evidence: `.codex/AGENTS.md` §6 `Register` subsection present]
- [x] T010 Add Construction subsection to §7 [evidence: `.codex/AGENTS.md` §7 `Construction` subsection present]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Grep section headers and cross-refs [evidence: `grep -nE '^## [0-9]+\.' AGENTS.md` sequential 1..10; sole §8 hit external]
- [x] T012 Confirm net-new bullets non-duplicative, non-contradictory [evidence: read vs `AGENTS.md` §1 and `.codex/AGENTS.md`; no restatement]
- [x] T013 Author Level 2 spec docs + metadata; run validation [evidence: 5 docs + metadata; `validate.sh` run recorded in implementation-summary]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: `T001`-`T013` all complete in this file]
- [x] No `[B]` blocked tasks remaining [evidence: `grep '\[B\]' tasks.md` returns nothing]
- [x] Structural checks and validation passed [evidence: see `implementation-summary.md` Verification table]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
