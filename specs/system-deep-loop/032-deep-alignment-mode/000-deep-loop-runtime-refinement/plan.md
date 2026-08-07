---
title: "Plan: system-deep-loop Runtime Remediation (from dogfood findings)"
description: "Planning-only pass triaging 62 real dogfood findings into a prioritized remediation candidate list. No code changes in this packet yet."
trigger_phrases:
  - "system-deep-loop remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/000-deep-loop-runtime-refinement"
    last_updated_at: "2026-07-11T08:54:42Z"
    last_updated_by: "claude"
    recent_action: "Triage complete, plan authored, no code touched"
    next_safe_action: "Operator confirms remediation scope before Phase 1 starts"
    blockers:
      - "No code changes made yet — awaiting operator confirmation"
    key_files: []
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Plan: system-deep-loop Runtime Remediation (from dogfood findings)

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Triage 62 real findings from packet `008-divergent-mode-dogfood`'s research and review loops into a prioritized remediation candidate list, with every candidate independently spot-verified against its cited source before inclusion. Fix nothing yet — this packet stays in "Planning" status until the operator confirms scope, since every candidate touches shared production runtime used by every future `/deep:research`/`/deep:review`/`/deep:ai-council` invocation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Every Tier-1/Tier-2 finding in `spec.md` §5 cites a real file:line, independently spot-checked, not just relayed from the source loop's own claim.
- No code change lands until the operator explicitly confirms which findings to fix.
- Once confirmed, each fix gets its own independent verify pass (fix agent + separate verify agent, or equivalent), matching the discipline proven in `052-deep-loop-unification/007-comprehensive-deep-review`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two-phase structure: **Phase 0 (this pass)** is triage-only, producing the candidate list in `spec.md` §5. **Phase 1+ (gated on operator confirmation)** would fix confirmed candidates in small, independently-verified batches grouped by shared root cause (e.g., the two `reduce-state.cjs` bugs share a root-cause class — hand-rolled parsers not matching real iteration output shape — and could be fixed together; the two canonical-agent-schema findings likewise share a root cause and could be fixed together).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Triage (this pass, complete)

Read both source documents (`research.md`, `deep-review-findings-registry.json`) in full, cross-referenced findings that both loops corroborated independently, spot-verified every Tier-1/Tier-2 candidate's cited file:line directly, and wrote the triaged list in `spec.md` §5.

### Phase 1: Reducer fixes (proposed, not started)

Fix the two `reduce-state.cjs` content-extraction bugs (research's `extractListItems` heading mismatch, review's search-debt-drop) together — same root-cause class, same file family, natural batch. Regenerate/re-run existing regression tests for `reduce-state.cjs` on both sides.

### Phase 2: Agent-contract alignment (proposed, not started)

Align the canonical `deep-research.md`/`deep-review.md` agent definitions (both `.opencode/agents/` and `.claude/agents/` mirrors) with what the live prompt-pack/validator actually requires. Regenerate compiled command contracts afterward (hash-tracked dependency).

### Phase 3: Council provenance/cost-guard fixes (proposed, not started)

Fix the false `@ai-council` route-proof claim, the write-boundary bypass under unrestricted permissions, and the unenforced cost-guard upper bound — three related findings in the same subsystem (`deep-ai-council`).

### Phase 4: Benchmark truthfulness + doc fixes (proposed, not started)

Fix the live skill-benchmark PASS-while-masking-P1 issue and the runtime README API-signature drift — lower-risk, more isolated fixes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Per-fix: relevant existing vitest suites re-run, pre-existing vs. new failures explicitly distinguished (matching this repo's established regression-baseline-and-delta discipline).
- Per-fix: independent verify pass that does not trust the fix's own self-report.
- Full `parent-skill-check.cjs`/`package_skill.py --check` re-run after any batch of fixes lands, fresh not cached.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `../../052-deep-loop-unification/008-divergent-mode-dogfood/research/research.md` — primary evidence source (research findings).
- `../../052-deep-loop-unification/008-divergent-mode-dogfood/review/deep-review-findings-registry.json` — primary evidence source (review findings).
- Precedent: `../../052-deep-loop-unification/007-comprehensive-deep-review/` — proven fix-then-independently-verify discipline for this exact class of shared-infrastructure remediation.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No code has been touched by this packet yet — nothing to roll back. Once Phase 1+ begins, each phase's changes are isolated and independently `git revert`-able; no phase depends on a prior phase's code (only Phase 0's triage, which is documentation).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Source of findings**: `../../052-deep-loop-unification/008-divergent-mode-dogfood/`
- **Precedent for fix discipline**: `../../052-deep-loop-unification/007-comprehensive-deep-review/`
<!-- /ANCHOR:cross-refs -->
