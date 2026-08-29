---
title: "Tasks: Pre-Write Restraint and Artifact Routing in AGENTS.md"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "restraint routing"
  - "agents.md"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-restraint-and-routing-gates"
    last_updated_at: "2026-08-29T11:36:55Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Applied nine AGENTS.md edits, then seven review fixes"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-agents-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Pre-Write Restraint and Artifact Routing in AGENTS.md

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

- [x] T001 Read AGENTS.md in full; map each operator ask to its landing section [evidence: 542-line baseline read; landing map in `plan.md` section 3 table]
- [x] T002 Read the three candidate source skills for existing coverage [evidence: `code-quality-standards.md:42` ladder, `test-quality-checklist.md:98` smells, `sk-doc/SKILL.md:37` boundary]
- [x] T003 Split the asks into net-new rules, reachability pointers, and tightenings [evidence: `plan.md` nine-row edit table names the kind of each]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the Gate 2 artifact trigger for code and markdown writes [evidence: `AGENTS.md:141` bullet present]
- [x] T005 Tighten the Gate 2 Output line to report the resolved artifact route [evidence: `AGENTS.md:142` carries the ARTIFACT output form]
- [x] T006 Tighten the Gate 2 Skip line to exempt single-line edits to an already-read file [evidence: `AGENTS.md:143` carries the exemption]
- [x] T007 Add the pre-write restraint ladder pointer to Planning and Approach [evidence: `AGENTS.md:283` six rungs in source order plus authority citation]
- [x] T008 Add the read-the-system-before-the-file bullet naming the SYSTEMS and SCOPE lenses [evidence: `AGENTS.md:284` bullet present]
- [x] T009 Tighten the repeat-attempt bullet into an explicit level-up-to-the-seam rule [evidence: `AGENTS.md:296` names interface, data flow, module boundary]
- [x] T010 Add the test-restraint principle to Quality Principles [evidence: `AGENTS.md:314` bullet present with checklist citation]
- [x] T011 Add the doctrine-amendment step to PLAN-WORKFLOW LOCK [evidence: `AGENTS.md:36` step 4 present]
- [x] T012 Add the sk-communication routing rule for reader-comprehension failure [evidence: `AGENTS.md:475` bullet present]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Grep section headers; confirm sequential 1..10 and no moved cross-reference [evidence: `grep -nE '^## [0-9]+\.' AGENTS.md` returns 1..10 in order]
- [x] T014 Negative control: confirm each net-new phrase was absent from the pre-edit file [evidence: `git show HEAD:AGENTS.md | grep -ic '<phrase>'` returned 0 for all 7 net-new phrases pre-edit]
- [x] T015 Duplication read of every added line against its cited source file [evidence: all 5 cited paths resolve; ladder rungs match source order at `code-quality-standards.md:42`]
- [x] T016 Diff-size check within budget and strict packet validation [evidence: `git diff --numstat AGENTS.md` reports 9 insertions and 3 deletions; validation recorded in `implementation-summary.md`]
- [x] T017 Independent adversarial review by a second model [evidence: `cursor-agent --model cursor-grok-4.6-xhigh --mode ask` returned 24566 bytes of ranked findings]
- [x] T018 Verify each load-bearing review claim against the real files [evidence: `sk-code/mode-registry.json` confirms no acting mode for a code write; `workflow-debug.md:100` confirms the repeated-failure stop]
- [x] T019 Apply the seven confirmed fixes, keeping the rules repo-agnostic [evidence: `AGENTS.md:141` names skills only; `grep -nE 'sk-code-[a-z]+|surface=|phase=' AGENTS.md` returns no hit in any added line]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: `T001`-`T016` all complete in this file]
- [x] No `[B]` blocked tasks remaining [evidence: `grep '\[B\]' tasks.md` returns nothing]
- [x] Structural checks, negative control, and strict validation passed [evidence: see `implementation-summary.md` Verification table]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
