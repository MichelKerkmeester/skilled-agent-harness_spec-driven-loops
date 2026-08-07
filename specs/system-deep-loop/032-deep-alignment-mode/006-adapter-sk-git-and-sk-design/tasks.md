---
title: "Tasks: Phase 6: adapter-sk-git-and-sk-design"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 006"
  - "adapter sk-git"
  - "adapter sk-design"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/006-adapter-sk-git-and-sk-design"
    last_updated_at: "2026-07-11T14:51:52Z"
    last_updated_by: "claude"
    recent_action: "Completed T001-T014, all evidence-cited below"
    next_safe_action: "Hand off to phase 007 sk-code adapter build"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 6: adapter-sk-git-and-sk-design

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

- [x] T001 Confirm phase 005 adapter contract signature is available or fall back to the design-brief-locked contract (`.opencode/specs/system-deep-loop/032-deep-alignment-mode/005-adapter-sk-doc/`) — read `sk-doc.cjs` in full; both new adapters copy its `discover`/`standardSource`/`check`/`loadKnownDeviations` module shape.
- [x] T002 Re-read `.opencode/skills/sk-git/SKILL.md` §"Commit Message Logic" (lines 309-457) and branch-naming rule (line 298) for currency — confirmed live 2026-07-11 at `SKILL.md:310-457`/`:298`, cross-checked against the live `.opencode/scripts/git-hooks/commit-msg`.
- [x] T003 [P] Re-read `.opencode/skills/sk-design/design-audit/references/audit_contract.md` and `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md` for currency — both re-read 2026-07-11; `accessibility_performance.md` and `anti_patterns_production.md` also read as additional real static rubric sources.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement sk-git adapter `discover(scope)` over commit range / branch diff (`.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs`) — `branchRange` scope enumerates commits via bounded `git log` + branches via unconditional `git branch --list`.
- [x] T005 Implement sk-git adapter `standardSource(authority)` reading the commit grammar + branch rule (`sk-git.cjs`) — verified via `node sk-git.cjs standard-source`.
- [x] T006 Implement sk-git adapter `check(artifact, rules)` with the Git-generated-subject exemption list honored (`sk-git.cjs`) — verified `isExemptSubject()` correctly classifies real `Merge `-prefixed commits from this repo's own history.
- [x] T007 Implement sk-design adapter `discover(scope)` over DESIGN.md/tokens.json paths, v1 static-only (`.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs`) — verified against the real `design-md-generator/references/examples/` fixture tree (8 artifacts, 4 pairs found).
- [x] T008 Implement sk-design adapter `standardSource(authority)` reading the token vocabulary + audit rubric (`sk-design.cjs`) — verified via `node sk-design.cjs standard-source`; `scopeBoundary: 'static-only-v1'` confirmed in output.
- [x] T009 Implement sk-design adapter `check(artifact, rules)` citing the specific violated dimension per finding (`sk-design.cjs`) — `checkAuditRubric()` requires both `dimension` and `citation` per finding, verified to skip an uncited entry.
- [x] T010 Author each adapter's known-deviation/accepted-convention list (authority-local per ADR-005; format settled at build time) — `sk_git_known_deviations.md` (4 entries), `sk_design_known_deviations.md` (3 entries), both Markdown + fenced `json`, matching phase 005's format.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Dry-run sk-git adapter against a real commit range; confirm exempt Git-generated subjects are not flagged — `discover HEAD~15 HEAD` + real `Merge`-commit exemption confirmed; `check --commit fd9fc599be...` (real pre-hook legacy-scope commit) correctly suppressed to `[]`.
- [x] T012 Dry-run sk-design adapter against a real repo `DESIGN.md`; confirm findings cite a real rubric dimension — all 4 real example fixtures (`vercel`/`linear`/`stripe`/`supabase`) checked clean after 2 real bugs found by this exact dry-run were fixed (`sk_design_adapter.md` Section 7).
- [x] T013 Confirm both adapters return the documented empty-scope result on zero artifacts — `sk-git.cjs discover()` with an off-label `paths` scope and `sk-design.cjs discover()` with an off-label `branchRange` scope both return `{artifacts:[], nodes:[]}`.
- [x] T014 Update `checklist.md` with evidence for each verified item — see `checklist.md`.
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
