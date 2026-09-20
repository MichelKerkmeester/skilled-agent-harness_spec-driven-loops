---
title: "Tasks: sk-create-diagram review remediation"
description: "Task queue for fixing the 013 deep-review's 4 P1 findings and bundled P2s."
trigger_phrases:
  - "diagram review remediation tasks"
importance_tier: "important"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/014-review-remediation"
    last_updated_at: "2026-08-13T05:55:33.000Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Run packet-wide validate.sh; report"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-create-diagram review remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |

**Task Format**: T### Description
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `review-report.md` in full; map every P1/bundled-P2 to a concrete fix [EVIDENCE: 8 findings mapped to R1/R2 workstreams per the report's own §4.]
- [x] T002 Investigate F001 and F009 evidence; resolve both without asking [EVIDENCE: `4996`-then-`5006`-word confirmation the grid rule text was the load-bearing contradiction; `style-guide.md:50`'s existing v5.1 deferral note confirmed F009 already handled.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Regenerate `leaf-manifest.json` against the real tree (F005/F-T-001) [EVIDENCE: 87 -> 96 leaves, `0/96` missing confirmed by direct filesystem re-walk.]
- [x] T004 Align `command-metadata.json`'s `/create:diagram` entry (F-T-002) [EVIDENCE: description + argumentHint now match `diagram.md`'s real html-svg + ascii-markdown scope.]
- [x] T005 Add `export diagram` to `hub-router.json` (F-T-003) [EVIDENCE: confirmed present via `json.load` + key check after edit.]
- [x] T006 Fix alias count 17->27 in 2 feature-catalog docs (F006) [EVIDENCE: real count confirmed `27` via `mode-registry.json` before editing.]
- [x] T007 Drop the stale not-present playbook sentence (F007) [EVIDENCE: `feature-catalog/` confirmed shipped since phase 007.]
- [x] T008 Fix `SKILL.md`'s grid/typography contradiction (F001) [EVIDENCE: font sizes now exempted, cited to `style-guide.md` §2's real type scale.]
- [x] T009 Fix all 10 stale citations in the review's sampled files (F003) [EVIDENCE: `create-diagram-auto.yaml` (6), `import-drawio.md` (4), `import-mermaid.md` (2), `notation-and-validator.md` (3) — recount: 15 total across sampled files; YAML re-parsed valid after each edit.]
- [x] T010 Sweep beyond the review's sample; fix 3 more instances (F003, extended) [EVIDENCE: `create-diagram-confirm.yaml` (4), `README.md` (1 citation + 1 stale flowchart-boundary claim), `type-sequence.md` (1), `type-high-level.md` (1) — repo-wide `grep` for `§[0789]`/`§1[0-9]` returns empty after.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Self-caught a word-limit regression from the T008 edit and fixed it [EVIDENCE: `validate_skill_package.py` FAIL at `5023` then `5006` words, trimmed twice, final `PASS (exit 0)`.]
- [x] T012 Run `validate_skill_package.py --strict` [EVIDENCE: `PASS (exit 0)`.]
- [x] T013 Confirm all 3 touched hub JSON files valid and the ported validator still smoke-tests clean [EVIDENCE: `json.load` on all 3; `validate-flowchart.sh` exit `0`.]
- [x] T014 Write `implementation-summary.md`
- [x] T015 Write `checklist.md` [EVIDENCE: `checklist.md` present with `9/9` sections filled.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required tasks marked [x]
- [x] `validate_skill_package.py --strict` passes
- [x] 0 stale `SKILL.md §N` citations remain anywhere in the packet or command surface
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Packet root**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
