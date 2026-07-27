---
title: "Tasks: design-interface SKILL.md word-cap relief"
description: "Task breakdown across setup baselining, the relocation and one-home trims, and differential verification of the router block, both gates, D5 connectivity, and relative links."
trigger_phrases:
  - "skill word cap relief tasks"
  - "design-interface SKILL.md trim tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/014-skill-word-cap-relief"
    last_updated_at: "2026-07-27T19:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Trimmed design-interface/SKILL.md 4991 to 4760 words; router block byte-identical."
    next_safe_action: "Re-run package_skill --check and parent-skill-check before committing SKILL.md."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/references/motion/animation-decision-framework.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is a leaf-manifest regeneration needed? No — no file was created or deleted under references/ or assets/."
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: design-interface SKILL.md word-cap relief
<!-- SPECKIT_LEVEL: 2 -->
<!-- PHASE_LINKS: parent=../spec.md; predecessor=013-design-command-decomposition-research -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Collision check: `git status --porcelain .opencode/skills/sk-design/` clean for the target, and `git log -3` on `SKILL.md` read for concurrent-session context (no path) [5m]
- [x] T002 Read `package_skill.py` to establish the authoritative counting method — `len(content.split())` over the raw file including frontmatter, cap `MAX_SKILL_MD_WORDS = 5000` (`.opencode/skills/sk-doc/create-skill/scripts/package_skill.py`) [10m]
- [x] T003 Capture baselines: 4,991 words, `--check` PASS, `parent-skill-check` OK 0 warnings, router block SHA-256, D5 unmapped set computed against `HEAD` (no path) [15m]
- [x] T004 Measure words per section across the whole file to aim the cuts at where the words actually are, rather than at the first thing that looks verbose (`.opencode/skills/sk-design/design-interface/SKILL.md`) [15m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Relocation

- [x] T005 Append §7 "THE FULL MOTION SEQUENCE" — the eight ordered steps from gate through `sk-code` handoff — to the gate reference (`.opencode/skills/sk-design/design-interface/references/motion/animation-decision-framework.md`) [25m]
- [x] T006 Verify every relative path used by the new §7 resolves from `references/motion/`, including the three `../../assets/motion/` cards and `../../../shared/sk-code-handoff.md` (no path) [5m]
- [x] T007 Replace the `SKILL.md` §3 Motion Design Workflow body with the gate statement plus a pointer to that §7, keeping the failed-gate-ships-instant rule inline (`.opencode/skills/sk-design/design-interface/SKILL.md`) [15m]

### Trims

- [x] T008 Remove retired-`motion`-mode residue from §2 Smart Routing and §3 (`.opencode/skills/sk-design/design-interface/SKILL.md`) [10m]
- [x] T009 [P] Apply the one-home rule to the Resource Loading Levels table: drop parentheticals the Core References index already carries, keeping every tier, trigger, and path (`.opencode/skills/sk-design/design-interface/SKILL.md`) [30m]
- [x] T010 [P] Trim fourth-copy prose in the Core References index, §7 Integration Points, §8, and the Two-Pass meta-narration (`.opencode/skills/sk-design/design-interface/SKILL.md`) [25m]
- [x] T011 Correct the stale manual-testing-playbook sub-path from `manual_testing_playbook/<NN>--<topic>/` to the on-disk `manual-testing-playbook/<topic>/` (`.opencode/skills/sk-design/design-interface/SKILL.md`) [5m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Prove the router block byte-identical: SHA-256 match against `HEAD` plus separate byte comparison of `INTENT_SIGNALS`, `RESOURCE_MAP`, and `DEFAULT_RESOURCE` (no path) [10m]
- [x] T013 Re-run `python3 ../sk-doc/create-skill/scripts/package_skill.py design-interface --check` and compare to baseline (no path) [5m]
- [x] T014 Re-run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` and confirm OK with 0 warnings including `10b-byte-drift` (no path) [5m]
- [x] T015 Recompute the D5 unmapped set from disk and diff against the `HEAD` baseline set (no path) [10m]
- [x] T016 Sweep both edited files for unresolvable relative links — `SKILL.md` and `references/motion/animation-decision-framework.md` (no path) [5m]
- [x] T017 Re-check `git status` for a mid-flight collision on the two owned files (no path) [5m]
- [x] T018 Mark `checklist.md` items with evidence (`checklist.md`) [15m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Word count reduced from 4,991 to 4,760, headroom 9 to 240
- [x] Router block SHA-256 identical to `HEAD`
- [x] Both gates unchanged from baseline; D5 unmapped set unchanged from baseline
- [x] `checklist.md` verified with evidence on every ticked item
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
