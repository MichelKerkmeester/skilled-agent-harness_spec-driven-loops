---
title: "Verification Checklist: temporal/subject freshness-invalidation consumer"
description: "QA checklist for the freshness-invalidation consumer reference: axis-complete reject rules, honest code-enforced vs contract-only vs run-scoped labeling, the named replay/subject-mismatch residuals, the optional HIGH-BLAST TTL-span hardening with no-regression, and the evergreen no-IDs rule."
trigger_phrases:
  - "freshness invalidation checklist"
  - "proof token freshness verification"
  - "ttl span bound QA"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/010-freshness-invalidation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered reference and the boundary hardening"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/freshness_invalidation.md"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: temporal/subject freshness-invalidation consumer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Deliverable path and doc type frozen in plan.md
  - **Evidence**: `mcp-open-design/references/freshness_invalidation.md` (new, 60 lines) + the `pre-tool-use.ts` boundary edit are the two frozen deliverables
- [x] CHK-002 [P0] "Already enforced vs adds" delta traced to the boundary source and the proof token contract
  - **Evidence**: `isValidTokenTimeWindow` enforced `issuedAt <= now < expiresAt` + finite parse; the TTL-span bound is the added code, replay + subject-recompute are the named residuals
- [x] CHK-003 [P1] Named residuals attributed to the run-scoped boundary, not the per-call hook
  - **Evidence**: the residual table attributes the replay consumed-set (`nonce`+`runId`) and the subject/payload recompute to the guarded proxy/parent

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Reference created at the exact target path with frontmatter and section order
  - **Evidence**: `freshness_invalidation.md` at the frozen path with frontmatter + Freshness Axes / Boundary Contract / Acceptance / Implementation Notes
- [x] CHK-011 [P0] Every freshness axis has an explicit reject rule
  - **Evidence**: the six-axis table gives one reject rule each for stale, future-issued, malformed-time, TTL-span, replay, subject/payload-mismatch
- [x] CHK-012 [P0] Each axis labeled code-enforced (boundary) vs contract-only vs needs-run-scoped-state with no over-claim
  - **Evidence**: four axes labeled CODE-ENFORCED at the codex boundary; replay + subject/payload-mismatch labeled RUN-SCOPED RESIDUAL
- [x] CHK-013 [P1] Reference reuses the proof token schema/boundary/acceptance by reference, not by duplicating the field schema
  - **Evidence**: the reference cites proof-token §2/§6/§7 and states "It does not define a second token schema"

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: stale (`now >= expiresAt`) → reject; cite the boundary `now < expiresAt` path as the enforced behavior
  - **Evidence**: an expired token REJECTS through both lanes; `isValidTokenTimeWindow` requires `now < expiryTime` — orchestrator-verified with dynamic now-timestamps
- [x] CHK-021 [P0] ACCEPTANCE: future-issued (`issuedAt > now`) → reject; cite the boundary `issuedAt <= now` check
  - **Evidence**: a future-issued token REJECTS through both lanes; the check requires `issuedTime <= now` — orchestrator-verified
- [x] CHK-022 [P0] ACCEPTANCE (TTL-span, code change in scope): an absurd `expiresAt - issuedAt` span → reject; a legitimate ~300s token still passes
  - **Evidence**: a 1-year-span token REJECTS via the MCP lane (D4-R4) and the `od` CLI lane (D4-R5); a ~300s-span token ACCEPTS — orchestrator-verified with dynamic now-timestamps
- [x] CHK-023 [P0] ACCEPTANCE: replayed nonce+runId and subject-mismatch reject rules are DEFINED in the contract and attributed to the run-scoped boundary
  - **Evidence**: the acceptance table defines "reuses a consumed `nonce`+`runId` -> REJECT at the run-scoped proxy/parent" and "digest fields do not match the outgoing payload -> REJECT at the recompute point"
- [x] CHK-024 [P1] No-regression: the canonical ~300s token instance still passes the (possibly hardened) boundary window check
  - **Evidence**: a fresh `now-30s -> now+270s` token ACCEPTS; `codex-pre-tool-use.vitest.ts` 11/11 + `hooks-codex-freshness.vitest.ts` 1/1 (re-run); tsc clean

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded for the change
  - **Target**: instance-or-class — does the freshness gap recur on other token-time paths?
  - **Evidence**: instance-closed at the shared `isValidTokenTimeWindow` chokepoint; both the MCP-tool lane and the `od` CLI lane validate through it, so the span bound covers both with one edit
- [x] CHK-FIX-002 [P0] Temporal axes closed in code, not left contract-only
  - **Target**: stale, future-issued, malformed-time, and TTL-span are CODE-ENFORCED at the codex boundary
  - **Evidence**: the window check enforces stale/future/malformed; the new `(expiresAt - issuedAt) <= MAX_DESIGN_TOKEN_TTL_MS` closes the TTL-span axis
- [x] CHK-FIX-003 [P0] Run-scoped residuals named honestly, not implied solved
  - **Target**: replay (consumed-set) and subject/payload-mismatch (recompute) are attributed to the run-scoped proxy/parent, not the per-call boundary
  - **Evidence**: the reference labels both RUN-SCOPED RESIDUAL and the residual table names the required state/evidence and the reject condition for each
- [x] CHK-FIX-004 [P1] The 24h ceiling rationale recorded
  - **Target**: the bound is generous so legitimate ~300s tokens never falsely reject; only absurd spans reject
  - **Evidence**: spec OPEN QUESTIONS + the reference Implementation Notes state mint stays ~300s and 24h is a defensive ceiling, not permission for long-lived authorization
- [x] CHK-FIX-005 [P1] Spec-vs-landed divergence surfaced
  - **Target**: the spec named `proof_check.py --require-design-token`; the executable freshness spine landed in the codex boundary instead
  - **Evidence**: recorded in plan.md Phase 2 and tasks.md T007; the boundary hook is the enforced site, the checker flag is the optional build/CI lane

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] HIGH-BLAST flag recorded for any boundary-check change, with a named no-regression gate before merge
  - **Evidence**: spec RISKS + plan flag the edit HIGH-BLAST on the shared executable pre-tool path; the no-regression gate is the codex hook vitest (11/11 + 1/1) plus dynamic-timestamp both-lanes acceptance
- [x] CHK-031 [P0] TTL-span bound fails closed only on absurd spans; tolerance keeps legitimate tokens valid
  - **Evidence**: `MAX_DESIGN_TOKEN_TTL_MS = 24h`; a 1-year span REJECTS while ~300s and `now-30s -> now+270s` tokens ACCEPT — orchestrator-verified
- [x] CHK-032 [P1] Replay + subject-mismatch residuals named as enforceable only where run-scoped state / payload is reconstructable
  - **Evidence**: the residual table requires a run-scoped consumed-set for replay and the reconstructable outgoing payload for recompute, both owned by the proxy/parent

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] EVERGREEN: the reference body carries no spec/packet/phase IDs or spec paths
  - **Evidence**: the `freshness_invalidation.md` body and the new hook WHY comment scan clean for IDs and `specs/` paths
- [x] CHK-041 [P1] Consumers and residuals named by durable purpose, not by ID
  - **Evidence**: the codex boundary, the guarded proxy/parent, the consumed-set, and the payload recompute are named by role, not by packet/phase ID
- [x] CHK-042 [P1] spec/plan/tasks reconciled; the spec's literal checker target surfaced as an open decision
  - **Evidence**: the spec named `proof_check.py --require-design-token`; the executable freshness spine landed in the codex boundary hook, recorded in plan Phase 2 and tasks T007 as the spec-vs-landed divergence

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the new reference (and the boundary hook) is written; no other live target edited
  - **Evidence**: change set is `freshness_invalidation.md` (new) + `pre-tool-use.ts` (+6/-1); `.codex/policy.json` and the codex hook test files have no uncommitted change
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: no scratch artifacts created for this phase

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (independent re-verification against the delivered `freshness_invalidation.md` and the `pre-tool-use.ts` TTL-span hardening; codex hook vitest re-run 11/11 + 1/1)

<!-- /ANCHOR:summary -->

---
