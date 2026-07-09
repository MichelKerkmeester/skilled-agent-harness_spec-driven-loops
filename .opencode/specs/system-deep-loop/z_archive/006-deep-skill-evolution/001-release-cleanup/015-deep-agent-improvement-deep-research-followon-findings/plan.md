---
title: "Implementation Plan: resolve 005 deep-research follow-on findings"
description: "Four fix groups across four skills: SKILL.md trajectory correction, deep-agent-improvement config cleanup + vitest config, cli-devin recipe field strip, and a 2-citation cross-skill evergreen sweep, each with targeted verification."
trigger_phrases:
  - "resolve 005 deep-research followons plan"
  - "009 followon plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/015-deep-agent-improvement-deep-research-followon-findings"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "plan-authored"
    next_safe_action: "execute-four-fix-groups-then-verify"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000009002"
      session_id: "131-000-009-followons"
      parent_session_id: "131-000-009-followons"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: resolve 005 deep-research follow-on findings

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surfaces** | deep-agent-improvement (SKILL.md doc + JSON config + new vitest config), cli-devin (3 JSON recipes + 2 md contract docs), deep-research + deep-ai-council (md docs) |
| **Routing** | `sk-code` for JSON/config + vitest config; `sk-doc` for the markdown doc edits |
| **Verification** | `node --check` / JSON validity, `devin --agent-config` strict-parse smoke x3, `vitest run`, sk-code alignment-drift, evergreen re-grep |

### Overview

Four independent fix groups, all small, all sourced from the 005 deep-research loop + 008 residuals. F1 corrects a doc error this arc itself introduced. F2 removes dead config + makes the test suite runnable. F3 unblocks the cli-devin recipes against the current strict parser. F4 is a 2-line evergreen sweep in sibling skills.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done

- [ ] F1: SKILL.md §6 distinguishes the two convergence mechanisms (no "exact-repeat" mischaracterization)
- [ ] F2: no live `target-profiles` refs; vitest suite discovers + runs `*.vitest.ts`
- [ ] F3: all 3 cli-devin recipes strict-parse; contract docs match
- [ ] F4: 2 sibling-skill citations reworded
- [ ] All touched code/config: `node --check` / JSON validity clean; alignment-drift PASS; 009 strict validate exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No architectural change. F1 + F4 are doc corrections. F2 removes unconsumed config fields + adds a test-runner config (no runtime impact). F3 removes recipe fields the parser already rejects (so it only un-breaks dispatch, no behavior change). The two convergence mechanisms (mutation-coverage `checkConvergenceEligibility` ±2 vs reduce-state `stopOnDimensionPlateau` exact) are documented, not changed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Apply + Verify

- [ ] Load `sk-code` (JSON/config/vitest) + `sk-doc` (markdown).
- [ ] F1: correct SKILL.md §6 trajectory paragraph (two mechanisms).
- [ ] F2: remove/repoint dead `target-profiles` refs; add `scripts/vitest.config.mjs`; run the suite.
- [ ] F3: strip rejected fields from the 3 recipes; align `deep-loop-iter-contract.md` + `agent-config-recipes.md`; strict-parse smoke each.
- [ ] F4: reword the 2 sibling-skill citations.
- [ ] Verify (see Testing); fill `implementation-summary.md`; strict validate; commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Tool |
|------|------|
| JSON validity (recipes, config) | `python3 -m json.tool` (jsonc: tolerant) |
| Recipe strict-parse | `devin -p --agent-config <recipe> --model swe-1.6 --permission-mode auto -- "ok"` x3 |
| Test suite | `vitest run` with the new config over `scripts/tests/*.vitest.ts` |
| Code alignment | `verify_alignment_drift.py --root .opencode/skills/deep-agent-improvement` |
| Evergreen | `rg "arc 1NN\|packet 1NN"` in the touched docs (excl changelog) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| `devin` binary (recipe strict-parse smoke) | Green (2026.5.6) | F3 verification |
| repo-root vitest v4 | Green | F2 suite run |
| Node.js 18+ | Green | node --check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Per-file `git checkout HEAD -- <path>` reverts; the new `vitest.config.mjs` can be deleted. No data, no migration, no feature flag. Each fix group is independent.
<!-- /ANCHOR:rollback -->
