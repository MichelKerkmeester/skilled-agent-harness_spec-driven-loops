---
title: "Decision Record: Spec-Kit Template & Context Optimizations"
description: "Architecture decisions for the 034 implementation: phasing structure, the refutation list as durable non-scope, AC-coverage rollout, and the byte-identical render safety gate."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-template-context-optimizations"
    last_updated_at: "2026-08-12T12:51:40Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded phasing + non-scope decisions"
    next_safe_action: "Implement Phase 1"
    blockers: []
    key_files:
      - "specs/system-speckit/033-spec-templates-and-context-reducer/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-034-optimizations"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Decision Record: Spec-Kit Template & Context Optimizations

## ADR-001: Track the six recs as phases within one packet, not phase folders

**Status:** Accepted

**Context:** The six 033 recommendations span four surfaces (template renderer, template source, validation, MCP memory). The operator asked for "several phases." The phase-qualification guard requires BOTH complexity ≥25/50 AND documentation level ≥3 before splitting into phase-child folders.

**Decision:** Use a single standard packet whose `plan.md` organizes the work into four implementation phases. Do not create phase-child folders.

**Consequences:** Lower ceremony; the recs stay in one reviewable plan. If any single rec grows into a large independently-tracked workstream, it can be promoted to its own packet later. "Several phases" lives in the plan, not the filesystem.

**Alternatives considered:** Phase-child folders (rejected — the recs are loosely coupled and small-to-medium, below the folder-split threshold); one rec per packet (rejected — fragments a coherent plan).

---

## ADR-002: The 033 refutation list is durable non-scope (hard blocker)

**Status:** Accepted

**Context:** The two source concepts tempt toward building things this repo already ships. The 033 research refuted these explicitly, with file:line evidence.

**Decision:** No phase may implement any refuted item. Forbidden: porting `reduce_findings()` (deep-loop reducers + findings-registry already do it); adding a token budget to `memory_context` (already enforced); new Default-FAIL / fresh-evaluator / progress-handoff frameworks (Iron Law, deep-review, handover already exist); Gate-3-as-reducer (category error); GraphRAG / Kimi subagent split; unconditional claim-level memory dedup.

**Consequences:** Prevents the wrong-abstraction / cargo-cult trap. A PR touching any refuted surface is rejected on sight. Claim-level memory dedup stays deferred behind a duplicate-rate measurement precondition.

**Alternatives considered:** Re-evaluate each refuted item during implementation (rejected — the research already did this adversarially across three model families; re-litigating wastes effort).

---

## ADR-003: Promote AC_COVERAGE to default-on at warn severity, with the escape hatch intact

**Status:** Accepted

**Context:** `AC_COVERAGE` is fully implemented but disabled by default (`validation-rules.md:75-79`, "Default: Disabled"), so the one machine-checked plan-adherence gate is dormant. Turning it on changes `--strict` outcomes for existing packets.

**Decision:** Enable it by default at **warn** severity (not error), preserving `SPECKIT_AC_COVERAGE_FLOOR` (0.9) and the manual-infeasible escape hatch. Verify no existing packet hard-fails under `--strict` before landing.

**Consequences:** Plan-adherence becomes visible without breaking existing packets. A later severity promotion (warn→error) requires separate adoption evidence.

**Alternatives considered:** Enable at error severity immediately (rejected — regresses existing packets); leave dormant (rejected — that is the gap).

---

## ADR-004: Guard template consolidation with a byte-identical render gate

**Status:** Accepted

**Context:** REQ-002 consolidates ~40% duplicated template source into a shared core + per-level addenda. The renderer emits one variant per level, so the reader's view must not change — only the source shrinks.

**Decision:** The consolidation phase is gated on renderer snapshot output being **byte-identical per level** to the pre-change baseline. Any diff blocks the change.

**Consequences:** The maintainability win (smaller source, no variant drift) is captured with zero risk to what agents actually read. This also clarifies that rec 6 is a maintainability win, not an agent-token win.

**Alternatives considered:** Trust manual review of the refactor (rejected — silent divergence across four templates × four levels is exactly the failure mode a snapshot gate catches).
