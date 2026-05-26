---
title: "Tasks: resolve 005 deep-research follow-on findings"
description: "Task ledger for the four fix groups (F1 SKILL.md trajectory correction, F2 config cleanup + vitest, F3 cli-devin recipes, F4 cross-skill evergreen) plus verification."
trigger_phrases:
  - "resolve 005 deep-research followons tasks"
  - "009 followon tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/005-deep-agent-improvement/002-deep-research-followon-findings"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "tasks-authored"
    next_safe_action: "execute-four-fix-groups-then-verify"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000009003"
      session_id: "131-000-009-followons"
      parent_session_id: "131-000-009-followons"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: resolve 005 deep-research follow-on findings

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load `sk-code` (JSON/config/vitest surface) + `sk-doc` (markdown)
- [ ] T002 Re-read the fix sites: SKILL.md §6; target_manifest.jsonc + improvement_config.json target-profiles refs; the 3 cli-devin recipes; the 2 sibling-skill citation lines
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 F1: correct SKILL.md §6 trajectory paragraph — describe the ±2 convergence-eligibility (mutation-coverage) AND the exact-equality plateau (reduce-state) as two distinct mechanisms
- [ ] T004 F2a: remove/repoint dead `target-profiles` refs in target_manifest.jsonc + improvement_config.json
- [ ] T005 F2b: add `scripts/vitest.config.mjs` (include `tests/**/*.vitest.ts`)
- [ ] T006 F3: strip rejected fields (verification_enabled, verification_languages, bayesian_scoring_enabled, bayesian_score_file, fallback_chain) from the 3 cli-devin recipes
- [ ] T007 F3: align `cli-devin/references/deep-loop-iter-contract.md` + `agent-config-recipes.md` to the trimmed recipe shape
- [ ] T008 F4: reword the 2 sibling-skill evergreen citations (deep-research README:235, deep-ai-council depth_dispatch.md:24)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 JSON validity on the 3 recipes + config files; `node --check` if any `.cjs` touched
- [ ] T010 `devin -p --agent-config <recipe> ... -- "ok"` strict-parse smoke on each of the 3 recipes
- [ ] T011 `vitest run` with the new config over `scripts/tests/*.vitest.ts`; record pass/fail (note pre-existing failures honestly)
- [ ] T012 `verify_alignment_drift.py --root .opencode/skills/deep-agent-improvement` PASS
- [ ] T013 Evergreen re-grep on the touched docs (excl changelog) clean
- [ ] T014 Fill `implementation-summary.md`; strict validate (exit 0); scope-strict commit + push
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] F1-F4 all applied and verified (REQ-001..REQ-004)
- [ ] 3 recipes strict-parse; vitest suite runs
- [ ] Strict validate exit 0; `implementation-summary.md` filled
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Source**: `../005-deep-agent-improvement/research/convergence-summary.md`
<!-- /ANCHOR:cross-refs -->
