---
title: "Implementation Plan: Close-out and tail"
description: "Level 2 plan for the already-shipped close-out tail of the sk-code parent program."
trigger_phrases:
  - "sk-code close-out plan"
  - "advisor scorer repair plan"
  - "review identity cleanup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/014-close-out-and-tail"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Backfilled Level 2 plan for shipped close-out commits"
    next_safe_action: "Run strict validation for phase 014"
---
# Implementation Plan: Close-out and tail

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown, skill metadata |
| **Framework** | OpenCode skill system and system-skill-advisor scorer tests |
| **Storage** | Repository files under `.opencode/skills/` and phase docs under `.opencode/specs/` |
| **Testing** | Parent skill checks, rule-copy checks, advisor scorer suites, parity report, rename-invariant vitest |

### Overview
This phase closed the tail of the sk-code parent program after the two-axis restructure. The implementation used three pushed commits: one to retire stale review identity labels, one to repair advisor scorer expectations and cli-opencode routing, and one to restore rename-invariant TOML reads.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase scope limited to close-out tail work.
- [x] Shipped commits identified: `027882bfd0`, `ea689d84e0`, `dd9487d65d`.
- [x] Existing parent context read from `124-sk-code-parent/spec.md` and sibling summaries.
- [x] Deferred gated work identified and excluded from completion claims.

### Definition of Done
- [x] Review identity label cleanup shipped and verified.
- [x] Advisor scorer stale tests and cli-opencode routing regression repaired and verified.
- [x] Rename-invariant parse error repaired and verified.
- [x] Remaining advisor-suite failures classified as other sessions' work.
- [x] Phase 014 docs backfilled and strict validation run.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Post-ship close-out phase with targeted commits and evidence-backed deferrals.

### Key Components
- **Review mode identity**: `.opencode/skills/sk-code/review/SKILL.md` plus the review manual-testing-playbook files.
- **Advisor explicit lane**: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`.
- **Advisor scorer tests**: `advisor-quality-049-003.vitest.ts` and `native-scorer.vitest.ts`.
- **Rename invariants**: `rename-invariants.vitest.ts` and the `.codex/config.toml` reads it protects.
- **Phase docs**: this folder's Level 2 doc set.

### Data Flow
The shipped commits first align identity text with the current review mode model, then align scorer expectations and explicit-lane behavior with that model, then restore rename-invariant test parsing. Verification reads target-suite results, full-suite deltas, and parity output before classifying unrelated remaining failures.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Review identity cleanup
- [x] Rename review `SKILL.md` skill identity from `code-review` to `review`.
- [x] Replace 77 stale `sk-code-review` identity labels with `review` across 24 review manual-testing-playbook files.
- [x] Keep intentional `sk-code-review` search keyword coverage.
- [x] Verify parent-skill-check strict, check-rule-copies plus its test, and review-tree links.

### Phase 2: Advisor scorer repair
- [x] Root-cause three failures through git history to commit `298bf11eb0`.
- [x] Retarget stale pure-review and ambiguous-code-problem scorer expectations to `sk-code`.
- [x] Widen cli-opencode disambiguation penalty to `-3.0` so explicit OpenCode CLI delegation wins.
- [x] Verify three target suites, full advisor-suite delta, and 197-prompt parity report.

### Phase 3: Rename-invariant repair
- [x] Restore `.codex/config.toml` reads in `rename-invariants.vitest.ts`.
- [x] Remove the parse failure introduced by duplicated `const opencodeConfig` and JSON-backed TOML assertions.
- [x] Verify target suite 4/4 green.

### Phase 4: Deferred gated follow-ups
- [ ] Canonical reindex and skill-graph recompile remain gated by broken daemon state.
- [ ] Lane-C fresh baseline re-derivation remains open.
- [ ] `.worktrees/0014-sk-code-parent` cleanup remains open.
- [ ] Phase 015 sibling alignment remains open.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parent skill invariants | Review identity cleanup | `parent-skill-check` with strict mode |
| Rule copy integrity | Review tree rule copies | `check-rule-copies` and its test |
| Link integrity | Review tree links | Review-tree link check |
| Advisor target suites | Three repaired scorer failures | Target scorer suites, 39/39 green |
| Advisor regression delta | Full advisor suite | Stashed baseline 13 failures to 9 failures, zero new failures |
| Advisor parity | 197-prompt parity report | Byte-identical report comparison |
| Rename invariants | `.codex/config.toml` TOML reads | Target suite 4/4 green |
| Spec validation | Phase 014 docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-code/017-sk-code-parent/014-close-out-and-tail --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-code review mode fold-in | Internal | Green | Identity cleanup has no current target model |
| system-skill-advisor scorer tests | Internal | Green | Routing repair cannot be verified |
| Python scorer behavior | Internal | Green | Parity-improving cli-opencode routing cannot be confirmed |
| Spec Kit strict validator | Internal | Green | Backfilled docs cannot be accepted |
| Skill graph daemon | Internal | Gated | Canonical reindex and graph recompile remain deferred |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Target suites regress, advisor parity report changes unexpectedly, or review identity cleanup breaks parent-skill checks.
- **Procedure**: Revert the specific shipped commit that introduced the failed behavior and re-run the corresponding target gates before touching unrelated concurrent-session files.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Review identity cleanup | Phase 013 two-axis restructure | Advisor scorer repair |
| Advisor scorer repair | Review identity cleanup and git-log root cause | Rename-invariant repair only for close-out confidence |
| Rename-invariant repair | Existing rename-invariant target suite | Phase documentation backfill |
| Documentation backfill | Shipped commit facts and verification facts | Strict validation |
| Deferred follow-ups | Healthy daemon and sibling phase readiness | Future close-out work, not this phase's shipped code |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Review identity cleanup | Medium | Shipped in commit `027882bfd0` |
| Advisor scorer repair | Medium | Shipped in commit `ea689d84e0` |
| Rename-invariant repair | Low | Shipped in commit `dd9487d65d` |
| Documentation backfill | Low | Current phase-doc task |
| **Total** | | **Already shipped plus doc backfill** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Code work already pushed in three remote commits.
- [x] Target verification evidence captured in phase facts.
- [x] Remaining failures classified as unrelated concurrent-session work.
- [x] Deferred work separated from completion claims.

### Rollback Procedure
1. Revert only the affected commit: `027882bfd0`, `ea689d84e0`, or `dd9487d65d`.
2. Re-run the target suite tied to that commit.
3. Compare full advisor-suite failure ownership before claiming regression status.
4. Leave other sessions' dirty files untouched unless separately authorized.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Git revert of static skill, test, and documentation files only.

<!-- /ANCHOR:enhanced-rollback -->
