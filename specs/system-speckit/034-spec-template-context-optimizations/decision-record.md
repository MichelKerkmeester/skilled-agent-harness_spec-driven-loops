---
title: "Decision Record: Spec-Kit Template & Context Optimizations"
description: "Architecture decisions for the 034 implementation: phasing structure, the refutation list as durable non-scope, AC-coverage rollout, and the byte-identical render safety gate."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-template-context-optimizations"
    last_updated_at: "2026-08-13T04:18:38Z"
    last_updated_by: "claude-code"
    recent_action: "Added ADRs from two deep-reviews (advisory, mirror, fingerprint)"
    next_safe_action: "Await commit go-ahead"
    blockers: []
    key_files:
      - "specs/system-speckit/033-spec-templates-and-context-reducer/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-034-optimizations"
      parent_session_id: null
    completion_pct: 100
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

## ADR-003: Promote AC_COVERAGE to default-on as a non-blocking advisory (amended from "warn")

**Status:** Accepted (amended during implementation — originally proposed at warn severity)

**Context:** `AC_COVERAGE` is fully implemented but was disabled by default, so the one machine-checked plan-adherence gate was dormant. The original plan proposed enabling it at **warn** severity; implementation surfaced that `warn` is blocking under `--strict`, so a warn on any under-covered completing packet would regress completion across the fleet.

**Decision:** Enable it by default as a **non-blocking advisory** — `RULE_STATUS` stays `pass`; on under-coverage the rule surfaces an advisory message but never warns or errors. Preserve `SPECKIT_AC_COVERAGE_FLOOR` (0.9) and the manual-infeasible escape hatch. `SPECKIT_AC_COVERAGE_ENFORCE` remains a reserved future promotion switch.

**Consequences:** Plan-adherence becomes visible fleet-wide with zero `--strict` regression. Deep-review finding F008 ("warn severity unmet") is closed by aligning the acceptance to this advisory reality rather than by making the gate block. A later promotion to a blocking severity requires separate adoption evidence.

**Alternatives considered:** Emit a real `warn` status (rejected — blocks completion for every under-covered packet under `--strict`, the exact regression the advisory design avoids); enable at error immediately (rejected — same regression, worse); leave dormant (rejected — that is the gap).

---

## ADR-004: Guard template consolidation with a byte-identical render gate

**Status:** Accepted

**Context:** REQ-002 consolidates ~40% duplicated template source into a shared core + per-level addenda. The renderer emits one variant per level, so the reader's view must not change — only the source shrinks.

**Decision:** The consolidation phase is gated on renderer snapshot output being **byte-identical per level** to the pre-change baseline. Any diff blocks the change.

**Consequences:** The maintainability win (smaller source, no variant drift) is captured with zero risk to what agents actually read. This also clarifies that rec 6 is a maintainability win, not an agent-token win.

**Alternatives considered:** Trust manual review of the refactor (rejected — silent divergence across four templates × four levels is exactly the failure mode a snapshot gate catches).

---

## ADR-005: Keep the memory_search budget enforcer as a deliberate mirror, not a forced shared helper

**Status:** Accepted

**Context:** Deep-review finding F005 flagged that `memory-search.ts` enforces its token budget with a local `enforceSearchTokenBudget` that appears to mirror `enforceTokenBudget` in `memory-context.ts`. Verification showed the two are **different concepts, not just different types**: the search enforcer drops the lowest **score** result each pass (a score-fallback chain over `score`/`intentAdjustedScore`/`rrfScore`/`similarity`/`averageSimilarity`/`finalRankScore`) on an `MCPResponse` envelope; the context enforcer contains none of that chain (a source scan for those score fields returns nothing) and instead does structural compaction (`minimumStructuredResult`, `compactDirectResult`) on a `ContextResult`. Neither is exported today.

**Decision:** Keep the two enforcers separate. There is no cleanly-extractable shared core — the truncation strategies differ — so a forced "shared helper" would couple two unrelated algorithms and regress two hot runtime handlers for no real DRY gain. This is the "verify before DRYing two instances that may be different concepts" discipline reaching the opposite conclusion from the finding after inspection.

**Consequences:** The two enforcers stay independent, documented here as intentional after verification rather than as unaddressed duplication. If a third consumer with the same strategy appears, extract a shared primitive at that point.

**Alternatives considered:** Force reuse of `enforceTokenBudget` now (rejected — types differ, it is not exported, and the cross-file refactor risks both handlers' behavior for a maintainability-only gain).

---

## ADR-006: Run memory_search token-budget enforcement before feedback telemetry (F006)

**Status:** Accepted (implemented)

**Context:** Deep-review finding F006 (P2) noted that the `search_shown` feedback event was computed from the response before token-budget truncation ran, so telemetry could record results that were then truncated from the returned envelope.

**Decision:** Move the `enforceSearchTokenBudget` call to run immediately after the deferred-drift enqueue and **before** the implicit-feedback block, so `search_shown` records only the results actually returned. Inspection confirmed the feedback block and the truncation both depend solely on `responseToReturn`, so no other ordering is coupled.

**Consequences:** `search_shown` telemetry no longer overcounts truncated results. Verified: the truncation call precedes the feedback block in source; `tsc --noEmit` clean; the token-budget suite stays green.

**Alternatives considered:** Leave the order and accept overcounting (rejected — the fix is a low-risk local reorder once the dependency was verified).

---

## ADR-007: Keep the all-zero continuity fingerprint as the grandfathered placeholder (F015)

**Status:** Accepted

**Context:** Deep-review finding F015 (P2) noted that `_memory.continuity.session_dedup.fingerprint` is the all-zero placeholder (`sha256:000…`) across this packet's docs. This packet's continuity was maintained by direct frontmatter edits (allowed by ADR-004), not by `generate-context.js` memory saves, so the fingerprint was never populated with a real content hash.

**Decision:** Keep the all-zero placeholder. `CONTINUITY_FRESHNESS` explicitly grandfathers the all-zero fingerprint (it is the sanctioned "not fingerprinted" value), so the packet validates `--strict` clean with it. Populating a real fingerprint requires a `generate-context.js` save — a separate memory operation with its own indexing/DB side effects — which is out of scope for a doc-reconciliation pass and offers no correctness gain here.

**Consequences:** The packet stays validation-clean; continuity dedup for this packet relies on `session_id`/content rather than a stored fingerprint. A future `/memory:save` on this folder would replace the placeholder with a real hash if fingerprint-based freshness is later wanted.

**Alternatives considered:** Run `generate-context.js` now to populate real fingerprints (rejected — added indexing/churn risk for a grandfathered, validation-clean placeholder).
