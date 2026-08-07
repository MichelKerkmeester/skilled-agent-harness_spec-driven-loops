---
title: "Tasks: Phase 9: command-agent-advisor-cutover"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 009"
  - "command agent cutover"
  - "advisor routing"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/009-command-agent-advisor-cutover"
    last_updated_at: "2026-07-11T17:12:19Z"
    last_updated_by: "claude"
    recent_action: "Completed T001-T012: all artifacts built, both cutover gates green"
    next_safe_action: "None required"
    blockers: []
    key_files:
      - ".opencode/commands/deep/alignment.md"
      - ".claude/agents/deep-alignment.md"
      - ".opencode/agents/deep-alignment.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 9: command-agent-advisor-cutover

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

- [x] T001 Confirmed phase 003 mode-packet skeleton exists on disk (`.opencode/skills/system-deep-loop/deep-alignment/SKILL.md`, `README.md`, `assets/`, `scripts/`, `references/` all present)
- [x] T002 Re-read `.opencode/commands/deep/review.md`, `.claude/agents/deep-review.md`, and `.opencode/agents/deep-review.md` for currency; confirmed the exact dual-mirror diff shape via `diff`
- [x] T003 [P] Re-read `.opencode/skills/system-deep-loop/mode-registry.json` discriminator/advisorRoutingContract docs for currency; confirmed the existing `alignment` entry (`mode-registry.json:198-221`) is schema-complete
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Authored `/deep:alignment` command (`.opencode/commands/deep/alignment.md`) and `:auto`/`:confirm` asset YAMLs (`deep_alignment_auto.yaml`, `deep_alignment_confirm.yaml`); registered `deep/alignment` in `render-command-contract.cjs`'s `COMMANDS` map and verified the dispatch renders end-to-end
- [x] T005 Authored `@deep-alignment` leaf agent (`.claude/agents/deep-alignment.md` + `.opencode/agents/deep-alignment.md`), per-lane translation of the deep-review contract, Bash-only write-safety (no Write/Edit tool)
- [x] T006 Verified the `mode-registry.json` entry already exists complete for the new mode; no duplicate or edit made
- [x] T007 Added advisor projection-map entries (`SKILL_ALIAS_GROUPS` in `skill_advisor.py`, then `--emit-routing-projection` regenerated both files' generated blocks) and ran the drift-guard test -> 7/7 passed
- [x] T008 Authored the behavior benchmark folder's missing scenario (DAB-011 clean-pass/zero-findings); 10 scenarios plus the `behavior_benchmark.md`/`baselines/` shell already existed on disk from an earlier pass and were extended to 11, covering all three minimum categories (real findings, clean zero-findings pass, multi-lane)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Ran `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/system-deep-loop --strict` -> "OK: parent-skill-check — all hard invariants passed, 0 warnings"
- [x] T010 Ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/032-deep-alignment-mode/009-command-agent-advisor-cutover --strict` for this phase (see checklist.md CHK-020/021 for the exact result); the full-packet `--recursive` run across all 10 phases is out of this phase's scope-lock (touches sibling phase folders) and is a packet-parent follow-up, not a phase-009 blocker
- [x] T011 Ran the behavior benchmark's scenario-contract review: `behavior_benchmark/scenarios/` holds 11 files; execution against a live executor is a separate benchmark-round activity, not a spec-doc gate
- [x] T012 Updated `checklist.md` with evidence for each verified item
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
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
