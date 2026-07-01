---
title: "Implementation Plan: Synthesis Integrity and Orchestrator Watchdog"
description: "Plan for the synthesis-completion invariant, post-exit watchdog, and reconstructResearchRegistryFromState."
trigger_phrases:
  - "synthesis integrity orchestrator watchdog plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/011-synthesis-integrity-and-orchestrator-watchdog"
    last_updated_at: "2026-07-01T11:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch implementation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Synthesis Integrity and Orchestrator Watchdog

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Three independent fixes sharing one theme (don't trust self-reported completion without verifying real state): (1) in the workflow YAMLs, gate the `synthesis_complete` event log behind an artifact-existence + finding-count check; (2) in `fanout-run.cjs`'s pool loop, give `lagCeilingMs` a sane non-zero default and add a check that force-fails a worker whose subprocess PID is confirmed dead but which never produced a ledger completion event, after a bounded grace period; (3) in `fanout-merge.cjs`, add `reconstructResearchRegistryFromState` mirroring the existing `reconstructReviewRegistryFromState` (read it first as the exact pattern to copy), deriving a minimal `keyFindings` array from `deep-research-state.jsonl`'s `type:"iteration"` records when no registry file exists at all.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- No regression to normal-completion paths (a lineage that DOES write its artifacts correctly must still log `synthesis_complete` normally).
- Watchdog grace period must not force-fail genuinely-still-working lineages.
- New reconstruct function mirrors the shipped review-side one's tested behavior for the analogous case.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Verify-then-log, not log-then-hope.** The completion event itself becomes conditional on real artifact state, rather than being an unconditional narration step.
- **Grace period keyed off confirmed subprocess death, not elapsed time alone.** The watchdog should only intervene once a lineage's subprocess is confirmed gone (PID no longer live) AND the ledger hasn't caught up within a bounded window — not simply "this lineage has been running a long time," which would incorrectly penalize legitimately slow-but-alive workers.
- **Mirror the shipped pattern for the reconstruct function** rather than designing a new approach — `reconstructReviewRegistryFromState` already solved this exact class of problem for review lineages; reuse its shape for research.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Change |
|---------|--------|
| `.opencode/commands/deep/assets/deep_research_auto.yaml`, `deep_review_auto.yaml` | Synthesis-completion invariant |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Watchdog default + force-fail logic |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` | `reconstructResearchRegistryFromState` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

1. Read `reconstructReviewRegistryFromState` in full as the reference pattern; read the current `lagCeilingMs`/pool-settle logic in `fanout-run.cjs`; read the `synthesis_complete` logging point in both workflow YAMLs.
2. Implement the synthesis-completion invariant.
3. Implement the post-exit watchdog.
4. Implement `reconstructResearchRegistryFromState`.
5. Write and pass all 3 regression tests; run the full suite to confirm no regressions to normal paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

1. Synthesis invariant: simulate both the "artifacts missing" (should log `synthesis_incomplete`) and "artifacts present, zero findings" (should still log `synthesis_complete` normally) cases.
2. Watchdog: simulate a dead-subprocess-no-ledger-event condition; assert force-fail after the grace period, and assert a genuinely-alive worker within the grace period is NOT force-failed.
3. Reconstruct function: mirror the existing review-side test exactly, adapted for the research schema.
4. Full `deep-loop-runtime` suite green.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

None — independent of the other 009 children, though thematically related to `009/001`'s already-shipped merge-tolerance work.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

Revert the commit. All three changes are additive (new checks, new function) with no data migration.
<!-- /ANCHOR:rollback -->
