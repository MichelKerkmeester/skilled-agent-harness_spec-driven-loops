---
title: "D4-R10 — Temporal/subject freshness invalidation + TTL-span hardening"
description: "Author a freshness consumer contract for the design proof token enumerating six invalidation axes (stale, future-issued, malformed-time, TTL-span, replay, subject/payload-mismatch) and harden the codex boundary so an absurd expiresAt - issuedAt span fails closed, with replay and subject-mismatch named as run-scoped residuals."
trigger_phrases:
  - "d4-r10 freshness invalidation"
  - "ttl span bound design token"
  - "design proof freshness consumer contract"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/010-freshness-invalidation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 and record the run-scoped residuals and the 24h-bound rationale"
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
# D4-R10 — Temporal/subject freshness invalidation + TTL-span hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A valid-but-stale or replayed design proof token otherwise authorizes design-affecting work long after issuance or for a different subject. The codex boundary's time-window check bounded only where `now` sits inside the token (`issuedAt <= now < expiresAt`); it never bounded the SPAN between `issuedAt` and `expiresAt`, so a token that minted itself a one-year lifetime passed the live gate. There was also no single enumerated contract that named which staleness axes are enforced where, which let "freshness" read as solved when most of it was not.

### Purpose
Make freshness invalidation an explicit, enumerated consumer contract and close the temporal/span gap in code. A single reference defines each invalidation axis with its reject rule and labels it CODE-ENFORCED at the codex boundary or RUN-SCOPED RESIDUAL at the guarded proxy/parent, and the codex boundary gains a TTL-span upper bound so an absurd `expiresAt - issuedAt` fails closed for both Open Design lanes — with replay and subject/payload-mismatch named honestly as residuals, not implied as closed.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A freshness consumer reference at `.opencode/skills/mcp-open-design/references/freshness_invalidation.md` enumerating six axes (stale, future-issued, malformed-time, TTL-span, replay, subject/payload-mismatch), each with a reject rule and a code-enforced vs run-scoped-residual label
- The boundary contract and the residual table (replay consumed-set + payload recompute), reusing the proof-token §2/§6/§7 by citation rather than duplicating the field schema
- A TTL-span upper bound at the codex boundary: a named const `MAX_DESIGN_TOKEN_TTL_MS` (24h) and a tightened `isValidTokenTimeWindow` requiring `(expiresAt - issuedAt) <= MAX_DESIGN_TOKEN_TTL_MS` on top of the existing window

### Out of Scope
- The run-scoped replay consumed-set and the subject/payload recompute machinery — named as residuals, enforced only where run state and the outgoing payload live (the guarded proxy/parent)
- A second token schema — the consumer cites the proof-token contract and defines no new fields
- Any edit beyond the two named files; `.codex/policy.json`, the codex hook test files, and every other live skill/gate/CLI file are untouched

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/freshness_invalidation.md` | Create | The six-axis freshness consumer contract with reject rules, code-enforced vs run-scoped-residual labels, the boundary contract, the residual table, and the acceptance scenarios — 60 lines, cites proof-token §2/§6/§7 |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | Modify | Add `MAX_DESIGN_TOKEN_TTL_MS = 24 * 60 * 60 * 1000` with a durable WHY comment and tighten `isValidTokenTimeWindow` to also require `(expiresAt - issuedAt) <= MAX_DESIGN_TOKEN_TTL_MS` — +6/-1 |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Enumerate every freshness axis with a reject rule | Stale, future-issued, malformed-time, TTL-span, replay, and subject/payload-mismatch each carry an explicit reject rule in the reference |
| REQ-002 | Label each axis honestly | Each axis is labeled CODE-ENFORCED at the codex boundary (stale, future-issued, malformed-time, TTL-span) or RUN-SCOPED RESIDUAL (replay, subject/payload-mismatch) with no over-claim |
| REQ-003 | Harden the boundary against absurd TTL spans | `isValidTokenTimeWindow` rejects when `(expiresAt - issuedAt) > MAX_DESIGN_TOKEN_TTL_MS`, keeping the existing `issuedTime <= now && now < expiryTime` window |
| REQ-004 | No regression on legitimate tokens | A fresh `now-30s -> now+270s` token and a ~300s-span token still ACCEPT; the codex hook vitest stays green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Reuse the proof-token contract, do not duplicate it | The reference cites proof-token §2/§6/§7 for field schema, boundary, and acceptance; it defines no second token schema |
| REQ-006 | Name the run-scoped residuals precisely | The reference attributes replay (consumed-set keyed by `nonce`+`runId`) and subject/payload-mismatch (payload recompute) to the guarded proxy/parent |
| REQ-007 | Keep the body evergreen | No spec/packet/phase IDs or `specs/` paths in the reference body or the hook comment |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `freshness_invalidation.md` carries the six-axis matrix with a reject rule per axis and a CODE-ENFORCED vs RUN-SCOPED-RESIDUAL label per axis; four axes are code-enforced at the codex boundary and two are run-scoped residuals.
- **SC-002**: The codex boundary rejects an absurd-span token through BOTH lanes — a one-year-span token REJECTS via the MCP lane (D4-R4 inline token) and the `od` CLI lane (D4-R5 gate file) — while a ~300s-span token and a fresh `now-30s -> now+270s` token ACCEPT, and an expired and a future-issued token REJECT.
- **SC-003**: The codex hook vitest stays green (`codex-pre-tool-use.vitest.ts` 11/11, `hooks-codex-freshness.vitest.ts` 1/1), `tsc --noEmit` is clean, `.codex/policy.json` and the codex test files are untouched, and both the reference body and the hook comment are evergreen.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Replay is a run-scoped residual at the codex boundary | A per-call hook holds no consumed-set, so it cannot prove a `nonce`+`runId` pair was unused; replay stays open at that boundary | The reference names replay as a RUN-SCOPED RESIDUAL and attributes the consumed-set to the guarded proxy/parent; the boundary still requires `singleUse: true`, `nonce`, and `runId` to be present |
| Risk | Subject/payload mismatch is a run-scoped residual | The boundary never sees the actual outgoing subject/brief/form/lineage/surface/file-hash inputs, so it cannot recompute the digests | The reference names recompute as a RUN-SCOPED RESIDUAL at the guarded proxy/parent and requires only well-formed digest fields at the boundary; it does not claim digest closure from structure alone |
| Risk | The 24h TTL-span ceiling is generous, not tight | A token between ~300s and 24h still passes the span check, so the bound is defensive, not a precise freshness window | 24h is chosen so legitimate ~300s tokens never falsely reject across clock skew and slow runs; minting still follows the ~300s default, and the ceiling only catches absurd spans |
| Risk | The hardening edits the shared executable boundary check | A too-tight bound would falsely reject every legitimate token and break all guarded Open Design operations on both lanes | HIGH-BLAST flagged; the span bound was verified no-regression with dynamic now-timestamps through both lanes and the codex hook vitest before completion |
| Dependency | Proof-token contract (§2 schema, §6 boundary, §7 acceptance) | Green | The consumer's reuse points lose their anchor and the axes would be re-invented |
| Dependency | Codex boundary time-window + structural token check | Green | The TTL-span bound has no chokepoint to extend |
| Dependency | Run-scoped consumed-set + payload recompute | Not built here | Replay + subject-mismatch closure is a named residual, out of scope for this phase |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: A freshness-defeating token (absurd `expiresAt - issuedAt`) now fails closed at the codex boundary for both the MCP-tool lane and the `od` CLI lane, not just the contract.
- **NFR-S02**: No token is silently widened — the span bound is additive to the existing window check; a token that fails the window OR the span is rejected.

### Defense-in-Depth
- **NFR-DD01**: The codex boundary enforces the four token-only axes (stale, future-issued, malformed-time, TTL-span); the guarded proxy/parent enforces the two state/payload axes (replay, subject/payload-mismatch). The contract is the single source both layers validate against.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Temporal boundaries
- **Absurd span, in-window now**: a token with `issuedAt <= now < expiresAt` but `expiresAt - issuedAt` of a year REJECTS on the span bound — the gap this phase closed.
- **Legitimate short span**: a `now-30s -> now+270s` token (≈300s) ACCEPTS; the window and the span both pass.
- **Expired**: `now >= expiresAt` REJECTS as stale regardless of span.
- **Future-issued**: `issuedAt > now` REJECTS regardless of span.
- **Malformed timestamp**: a non-finite `issuedAt`/`expiresAt` fails closed before the window or span is evaluated.

### Residual cases
- **Replayed token**: a previously consumed `nonce`+`runId` is well-formed and in-window, so it passes the boundary; only the run-scoped consumed-set can reject it.
- **Subject swap**: a token whose digest fields are well-formed but do not match the actual outgoing payload passes the boundary; only the run-scoped recompute can reject it.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One new 60-line reference + a +6/-1 boundary edit; no schema or runtime restructure |
| Risk | 16/25 | The edit lands on the shared executable boundary check both lanes call; a too-tight bound would break all guarded design ops, so it is HIGH-BLAST despite the small diff |
| Research | 8/20 | Tracing what the boundary already enforces vs the open span/replay/subject gaps |
| **Total** | **32/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the codex boundary close replay invalidation? **RESOLVED: No, not here. A per-call hook holds no consumed-set and cannot prove a `nonce`+`runId` was unused. Replay is named a RUN-SCOPED RESIDUAL and attributed to the guarded proxy/parent, which must maintain a run-scoped consumed-set and consume each successful token exactly once.**
- Should the codex boundary recompute the subject/payload digests? **RESOLVED: No, not here. The boundary validates the token in isolation and never sees the outgoing subject/brief/form/lineage/surface/file-hash inputs. Subject/payload-mismatch is named a RUN-SCOPED RESIDUAL at the guarded proxy/parent, which rebuilds the actual payload and compares. The boundary requires only well-formed digest fields.**
- Why 24h for `MAX_DESIGN_TOKEN_TTL_MS` rather than ~300s? **RESOLVED: 24h is a deliberately generous defensive ceiling. Minting still follows the proof-token contract's ~300s default; a tight ~300s bound risks falsely rejecting legitimate tokens across clock skew and slow runs. The 24h bound rejects only absurd, freshness-defeating spans (e.g. a one-year lifetime) while legitimate ~300s tokens always pass.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Freshness consumer contract (6 axes) + codex-boundary TTL-span hardening (MAX_DESIGN_TOKEN_TTL_MS = 24h)
- Four axes CODE-ENFORCED at the codex boundary; replay + subject/payload-mismatch RUN-SCOPED RESIDUALS recorded in RISKS/OPEN QUESTIONS
- Both-lanes acceptance (1yr REJECT / 300s+270s ACCEPT / expired+future REJECT); 24h-bound rationale recorded
- Scope = freshness_invalidation.md (new) + pre-tool-use.ts (+6/-1); GENERATED_METADATA regenerated by the orchestrator
-->
