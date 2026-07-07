---
title: "Tasks: Phase 15 sk-design canon alignment"
description: "Executed task breakdown for the sk-design parent-hub canon alignment phase — all tasks complete with pushed-commit evidence; STRICT parent-skill-check reports 0 failures."
trigger_phrases:
  - "sk-design canon tasks"
  - "sk-design changelog symlinks"
  - "sk-design benchmark tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/015-sk-design-canon-alignment"
    last_updated_at: "2026-07-05T09:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase executed and verified: all 25 tasks complete, STRICT 0 failures, five increments pushed"
    next_safe_action: "None for this phase — proceed to phase 018 (deep-loop canon alignment)."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/changelog/"
      - ".opencode/skills/sk-design/description.json"
      - ".opencode/skills/sk-design/manual_testing_playbook/"
      - ".opencode/skills/sk-design/benchmark/"
      - ".opencode/skills/sk-design/mode-registry.json"
      - ".opencode/skills/sk-design/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-015-execution"
      parent_session_id: "phase-015-doc-authoring"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "How was the blocked bundleRules conversion resolved?"
        answer: "Phase 017 reconciled the canon shape (whenPrimary/includeSurfaces/whenAll), unblocking T014; the prose Bundle Rule is now the declarative ui-build-bundle entry."
---
# Tasks: Phase 15 sk-design canon alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [source]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record completed packetKind repair for all five sk-design modes (`.opencode/skills/sk-design/mode-registry.json`) [EVIDENCE: commit f8673ff0db]
- [x] T002 Confirm `.opencode/skills/sk-design/` has no direct edit conflict before execution [EVIDENCE: `git status` collision check run before every edit batch; only self-authored paths modified]
- [x] T003 Read sk-design hub files before editing: `SKILL.md`, `mode-registry.json`, `hub-router.json`, changelog entries, and `design-interface/README.md` [EVIDENCE: read-first honored across all edit batches this phase]
- [x] T004 Confirm the five audited changelog entries are symlinks, not real packet changelog directories (`.opencode/skills/sk-design/changelog/`) [EVIDENCE: confirmed prior to deletion; packet changelogs verified intact inside packets]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Strict P0 Parent-Hub Fixes
- [x] T005 Delete hub symlink `changelog/design-audit` and preserve packet changelog directory [EVIDENCE: commit 4f00dd262c; parent-skill-check 7a PASS]
- [x] T006 Delete hub symlink `changelog/design-foundations` and preserve packet changelog directory [EVIDENCE: commit 4f00dd262c; 7a PASS]
- [x] T007 Delete hub symlink `changelog/design-interface` and preserve packet changelog directory [EVIDENCE: commit 4f00dd262c; 7a PASS]
- [x] T008 Delete hub symlink `changelog/design-md-generator` and preserve packet changelog directory [EVIDENCE: commit 4f00dd262c; 7a PASS]
- [x] T009 Delete hub symlink `changelog/design-motion` and preserve packet changelog directory [EVIDENCE: commit 4f00dd262c; 7a PASS]
- [x] T010 Author sk-design hub `description.json` from parent skill description template (`.opencode/skills/sk-design/description.json`) [EVIDENCE: commit 0898f9bba3; 8a PASS with required fields]
- [x] T011 Scaffold hub `manual_testing_playbook/` for mode classification and transform-verb framing (`.opencode/skills/sk-design/manual_testing_playbook/`) [EVIDENCE: commit b9abf16b31 — 22 files / 21 scenarios across 5 categories; 260 referenced paths existence-verified; semantic claims spot-checked against registry+router; 9a PASS]
- [x] T012 Produce hub `benchmark/` Lane-C baseline (`.opencode/skills/sk-design/benchmark/`) [EVIDENCE: commit fc4644a98a — router-mode run, CONDITIONAL 69/100, 15/15 scored scenarios passed, D5 100/100; 9b PASS]

### P1/P2 Canon Alignment
- [x] T013 Declare `transform-verbs` in the registry extension block (`.opencode/skills/sk-design/mode-registry.json`) [EVIDENCE: commit 5a6765c9b1 — extensions.transform-verbs activates the in-place transformVerbRouting block per canon (no relocation); 3f PASS]
- [x] T014 Convert prose Bundle Rule to declarative `bundleRules` (`.opencode/skills/sk-design/hub-router.json`) [EVIDENCE: unblocked by phase 017 canon reconciliation; ui-build-bundle whenAll interface+foundations → orderedBundle, commit 5a6765c9b1; 5f PASS]
- [x] T015 Fix broken `design-interface/README.md` link to `../sk-code/README.md` (`.opencode/skills/sk-design/design-interface/README.md`) [EVIDENCE: commit 4f00dd262c (3 README links); plus 4 mode-SKILL sk-doc link depths in 0898f9bba3]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Contract Verification
- [x] T016 Run strict parent-skill-check for sk-design and require 0 fails [EVIDENCE: `PARENT_HUB_CHECK_STRICT=1` run 2026-07-05 — "all hard invariants passed, 0 warnings"]
- [x] T017 Confirm check 7a symlinked changelog failure is gone [EVIDENCE: 7a PASS in the strict run]
- [x] T018 Confirm check 8a description failure is gone [EVIDENCE: 8a PASS with required fields]
- [x] T019 Confirm check 9a manual_testing_playbook failure is gone [EVIDENCE: 9a PASS]
- [x] T020 Confirm check 9b benchmark failure is gone [EVIDENCE: 9b PASS]

### Artifact and Scope Verification
- [x] T021 Verify `design-interface/README.md` no longer has the broken `../sk-code/README.md` link [EVIDENCE: check-markdown-links reports zero broken sk-design links]
- [x] T022 Verify benchmark baseline artifacts are present and readable for phase 019 rollup [EVIDENCE: baseline report.json parsed programmatically during the identity re-check]
- [x] T023 Verify the hub playbook did not overwrite the design-audit packet playbook [EVIDENCE: `design-audit/manual_testing_playbook/` exists untouched; hub playbook lives at hub root]
- [x] T024 Verify git diff is limited to planned sk-design execution files plus this phase folder [EVIDENCE: every push blast-radius-gated via scratch-index diff --stat (5/22/4/5-file counts verified pre-push)]
- [x] T025 Update implementation-summary with actual verification evidence after execution [EVIDENCE: implementation-summary.md rewritten to executed state this pass]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-blocked P0 and P1 execution tasks are marked `[x]` with evidence.
- [x] T014 is either completed after phase 017 or remains explicitly blocked with the phase 017 dependency. [Completed — 017 landed first]
- [x] Strict parent-skill-check for sk-design reports 0 fails after execution.
- [x] `implementation-summary.md` is updated from planned state to executed evidence only after verification.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Hub Program**: See `../spec.md`

<!-- /ANCHOR:cross-refs -->
