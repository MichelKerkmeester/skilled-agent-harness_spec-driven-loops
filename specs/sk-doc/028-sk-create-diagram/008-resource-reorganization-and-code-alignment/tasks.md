---
title: "Tasks: sk-create-diagram resource reorganization and code alignment"
description: "Task queue for the references/assets reorg, Python alignment, and new READMEs."
trigger_phrases:
  - "diagram reorg tasks"
importance_tier: "important"
contextType: "planning"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/008-resource-reorganization-and-code-alignment"
    last_updated_at: "2026-08-12T13:21:22.000Z"
    last_updated_by: "claude"
    recent_action: "Authored task queue"
    next_safe_action: "Run T002 (reorg script)"
    blockers: []
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
# Tasks: sk-create-diagram resource reorganization and code alignment

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

- [x] T001 Enumerate every file citing a moved reference/asset path (59 files) and every bare-relative sibling link inside `references/*.md`, classified by whether the move crosses a subfolder boundary [EVIDENCE: `grep -rl` scan output, 59/59 files enumerated; 22/22 bare-relative links classified.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [B] Run the reorg script: `git mv` 75 files, token-rewrite 55 files, hand-fix 7 files' bare-relative sibling links [EVIDENCE: script output "Moved 75 files. Rewrote token references in 55 files. Applied hand-targeted bare-link fixes to 7 files."]
- [x] T003 Independently verify: rename status, orphaned-old-path grep, and a full link-resolution walk [EVIDENCE: `git status --short` = 75/75 `R`; orphaned-path grep = 0/0 hits; link walker found 2/133 real breaks, fixed both, re-run = 0/184 broken.]
- [x] T004 AST-based Python audit of both scripts (param hints, return hints, public-function docstrings, bare excepts, class naming) [EVIDENCE: `ast.parse` found 5/5 real missing docstrings on nested closures; a line-based grep heuristic had earlier produced 2/2 false positives (11 claimed missing return hints, 1 claimed non-PascalCase class), both disproven by `ast.parse` before any fix was applied.]
- [x] T005 Fix the 5 real docstring gaps [EVIDENCE: `python3 -m py_compile` clean; AST re-scan = 0/0 missing public docstrings in both files.]
- [x] T006 Author `scripts/README.md` and 6 subfolder README indexes [EVIDENCE: 7 files created.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `validate_skill_package.py --strict`; fix findings [EVIDENCE: first run FAILED — 6 new READMEs missing `version` frontmatter; fixed by adding the full 5-field block; re-run = `PASS (exit 0)`.]
- [x] T008 Re-run `validate-playbook-package.cjs` and `validate_catalog_package.py` [EVIDENCE: both `PASS`, 0 violations each — confirms the reorg didn't disturb phase 007's packages.]
- [ ] T009 Run packet-wide `validate.sh --recursive --strict`; fix findings
- [ ] T010 Residue sweep against this phase's declared file scope
- [ ] T011 Write `implementation-summary.md`
- [ ] T012 Write `checklist.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All required tasks marked [x]
- [ ] No [B] tasks remain
- [ ] All gates clean; no undocumented residue
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision record**: `decision-record.md`
- **Packet root**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
