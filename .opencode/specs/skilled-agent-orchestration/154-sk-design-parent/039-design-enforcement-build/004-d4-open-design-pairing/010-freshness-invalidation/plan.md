---
title: "Implementation Plan: temporal/subject freshness-invalidation consumer"
description: "Plan to author a freshness-invalidation consumer reference that defines stale/future-issued/TTL-span/replay/subject-mismatch reject rules over the proof token, names what the codex boundary already enforces vs what needs run-scoped state, and scopes one optional TTL-span code hardening."
trigger_phrases:
  - "freshness invalidation plan"
  - "proof token freshness consumer"
  - "ttl span bound design token"
  - "stale token reject rule"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/010-freshness-invalidation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all plan gates and phases complete with delivery evidence"
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
# Implementation Plan: temporal/subject freshness-invalidation consumer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Primary deliverable** | One new doc: a freshness-invalidation consumer reference under the open-design transport skill (`references/freshness_invalidation.md`) |
| **Optional code** | A TTL-span upper bound added to the codex boundary's token time-window check (HIGH-BLAST, owner-gated, only if the span bound is accepted) |
| **Reuses** | The proof token contract: field schema (`issuedAt`/`expiresAt`/TTL), the boundary Time/TTL/Replay/Payload rows, and the validator acceptance table |
| **Already enforced** | The codex boundary already rejects expired and future-issued tokens via a time-window check (`issuedAt <= now < expiresAt`) and malformed timestamps |
| **Status** | Complete — reference authored (60 lines) and the TTL-span boundary hardening landed (+6/-1); verified through both lanes |

### Overview
The proof token already carries `issuedAt`, `expiresAt` (~300s default TTL), `singleUse`, `nonce`, `runId`, and a canonical `subjectDigest`. The contract's freshness consumer must "reject stale, future-issued, replayed, or subject-mismatched design authorization," but only part of that is enforced anywhere today. The executable codex boundary check validates the token's structure and a time window — `issuedAt <= now < expiresAt`, with non-parseable timestamps rejected — which already closes the **stale/expired** and **future-issued** axes. It does NOT bound the TTL *span*, does NOT hold a consumed-nonce set, and does NOT recompute the subject digest from the outgoing payload. This phase makes freshness-invalidation an explicit, enumerated consumer: a single reference that defines each invalidation axis with its reject rule, reuses the existing schema/boundary/acceptance sections instead of re-inventing them, and labels every axis honestly as code-enforced at the per-call boundary, contract-only, or dependent on run-scoped state held by the guarded proxy/parent. The plan additionally scopes ONE optional code change — a TTL-span upper bound on the boundary time-window check — and flags it as a HIGH-BLAST edit to the shared executable hook requiring careful no-regression. This phase produces the consumer contract; the run-scoped consumed-set and payload-recompute machinery are named, not built here.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Deliverable path and doc type frozen (new freshness-invalidation consumer reference under the open-design transport skill) — Done: `mcp-open-design/references/freshness_invalidation.md`
- [x] "Already enforced vs adds" delta traced to the actual boundary source and the proof token contract sections — Done: boundary enforced `issuedAt <= now < expiresAt`; span/replay/recompute were the gaps
- [x] Each freshness axis has a named enforcement home: per-call boundary code, contract-only, or run-scoped proxy/parent — Done: four code-enforced at the codex boundary, two run-scoped residuals
- [x] Evergreen constraint understood (the authored reference carries no spec/packet/phase IDs or spec paths) — Done: body + hook comment scan clean

### Definition of Done
- [x] Reference exists at the exact target path with the required frontmatter and section order — Done: 60-line reference at the frozen path
- [x] Every freshness axis (stale, future-issued, malformed-time, TTL-span, replay, subject/payload-mismatch) has an explicit reject rule — Done: six-axis matrix, one reject rule each
- [x] Each axis is labeled code-enforced (boundary), contract-only, or needs-run-scoped-state, with no over-claim — Done: four CODE-ENFORCED, two RUN-SCOPED RESIDUAL
- [x] The reference reuses the proof token field schema, boundary rules, and acceptance table by reference, not by duplicating them — Done: cites proof-token §2/§6/§7; no second schema
- [x] If the TTL-span code hardening is in scope, its acceptance is defined (absurd span rejects; legitimate ~300s token still passes) and it is flagged HIGH-BLAST with a named no-regression gate — Done: `MAX_DESIGN_TOKEN_TTL_MS = 24h`; 1yr REJECTS, ~300s ACCEPTS; HIGH-BLAST + vitest gate
- [x] The reference body carries no spec/packet/phase IDs or spec paths (durable WHY only) — Done: evergreen scan clean
- [x] `checklist.md` items verified with evidence — Done: all P0/P1 items `[x]` with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single freshness-invalidation consumer reference that enumerates each staleness axis as a deterministic reject rule over the existing proof token, plus one optional, owner-gated, low-surface code hardening at the per-call boundary. The contract is the source of truth; the code enforces only the subset that is self-contained per call. Everything that needs cross-call memory or the actual payload is attributed to the run-scoped boundary and named as a residual.

### Freshness-axis matrix (the implementer brief)
This is the core of the deliverable. Each row states the reject rule and where it is (or must be) enforced.

| Axis | Reject rule | Enforced today? | This phase adds |
|------|-------------|-----------------|-----------------|
| **Stale / expired** | `now >= expiresAt` → reject | YES — the boundary time-window check requires `now < expiresAt` | Contract restatement only (cite the enforced path) |
| **Future-issued** | `issuedAt > now` → reject | YES — the boundary check requires `issuedAt <= now` | Contract restatement only |
| **Malformed timestamp** | `issuedAt`/`expiresAt` not parseable → reject | YES — the boundary rejects non-finite parsed times | Contract restatement only |
| **TTL-span bound** | `expiresAt - issuedAt` exceeds a short-lived max (~300s + tolerance) → reject | NO — the window check bounds where `now` sits, never the span; an absurd `expiresAt` passes | Contract rule + OPTIONAL code hardening (HIGH-BLAST) |
| **Replay** | `nonce`+`runId` already consumed → reject | NO — the per-call boundary checks presence only; it holds no consumed-set | Contract rule only at the boundary; needs a run-scoped consumed-set in the proxy/parent (residual) |
| **Subject/payload mismatch** | recompute `subjectDigest` (and brief/form/lineage) from the actual outgoing payload; differ → reject | NO — the boundary checks the digest is well-formed, never recomputes it | Contract rule only at the boundary; needs payload access at the proxy/parent (residual) |

### Key components
- **Freshness consumer reference (new)** — the enumerated axis matrix above, each axis with its reject rule and enforcement home, reusing the proof token schema/boundary/acceptance sections.
- **Per-call boundary check (existing)** — already enforces stale + future-issued + malformed-time; the candidate site for the optional TTL-span bound.
- **Run-scoped boundary (named, not built)** — the guarded proxy/parent that can hold the consumed nonce+runId set and reconstruct the payload to recompute digests; the only place replay and subject-mismatch can be fully closed.

### Honest enforcement boundary
The codex boundary check is per-call and stateless. It can fully enforce only the axes that depend on the token alone: stale, future-issued, malformed-time, and (if added) the TTL-span bound. **Replay** needs a consumed nonce+runId set that survives across calls; a per-call hook cannot hold it, so at the codex boundary replay-invalidation is contract-only and enforceable only where run-scoped state lives. **Subject/payload mismatch** needs the actual outgoing subject/brief/form/lineage objects to recompute against; where the boundary validates the token in isolation without the reconstructable payload, it is contract-only there too. The reference MUST state these residuals rather than imply full closure.

### Optional code hardening (TTL-span bound)
If the owner accepts the span bound, the change adds to the boundary time-window check (or a new sibling helper) a test that `0 < (expiresAt - issuedAt) <= MAX_TTL`, where `MAX_TTL` reflects the ~300s precedent with enough tolerance that legitimate tokens never falsely reject. This is HIGH-BLAST: the time-window check sits on the executable pre-tool path shared by the all-surface gate and the proof-token consumers; a too-tight bound would falsely reject every legitimate token and break all guarded design operations. The exact `MAX_TTL` value and tolerance are an owner decision.

### Data flow
1. The mint side stamps `issuedAt`/`expiresAt` (~300s apart), `singleUse`, `nonce`, `runId`, and `subjectDigest`.
2. The per-call boundary already rejects expired, future-issued, and malformed-time tokens; with the optional hardening it also rejects absurd-span tokens.
3. The run-scoped boundary (named here) consumes the nonce+runId pair and recomputes the subject digest from the actual payload to close replay and subject-mismatch.
4. The freshness consumer reference is the one contract all three steps validate against.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the boundary time-window and structural token checks; record exactly what freshness is already enforced — Done: `isValidTokenTimeWindow` enforced `issuedAt <= now < expiresAt` + finite parse, no span bound
- [x] Re-read the proof token schema, boundary, and acceptance sections to anchor the reuse points — Done: §2/§6/§7 anchored as cite-don't-duplicate reuse points
- [x] Scaffold the freshness consumer reference with frontmatter, H1, and the section headers — Done: frontmatter + Freshness Axes / Boundary Contract / Acceptance / Implementation Notes

### Phase 2: Core Implementation
- [x] Author the freshness-axis matrix: stale, future-issued, malformed-time, TTL-span, replay, subject/payload-mismatch — Done: six-axis table authored
- [x] For each axis, write the reject rule and label it code-enforced (boundary), contract-only, or needs-run-scoped-state — Done: four CODE-ENFORCED, two RUN-SCOPED RESIDUAL
- [x] Document the named residuals: the consumed nonce+runId set and the subject recompute need the run-scoped proxy/parent, not the per-call boundary — Done: residual table names the consumed-set + payload recompute
- [x] Reconcile the spec's literal checker target (extend the deterministic card checker with a design-token flag) as an optional build/CI lane and flag the spec-vs-landed divergence — Done: the executable freshness spine landed in the codex boundary; the `proof_check.py --require-design-token` checker is recorded as the spec-vs-landed divergence
- [x] (OPTIONAL, HIGH-BLAST, owner-gated) Add the TTL-span upper bound to the boundary time-window check — Done: `MAX_DESIGN_TOKEN_TTL_MS = 24h` + `(expiresAt - issuedAt) <= MAX_DESIGN_TOKEN_TTL_MS` in `isValidTokenTimeWindow` (+6/-1)
- [x] (OPTIONAL) Confirm no-regression: the canonical ~300s token still passes; only absurd spans reject — Done: ~300s + `now-30s -> now+270s` ACCEPT; 1yr REJECTS; vitest 11/11 + 1/1

### Phase 3: Verification
- [x] Walk stale + future-issued reject through the boundary code path; confirm the contract matches the enforced behavior — Done: both REJECT through both lanes; contract matches `now >= expiresAt` / `issuedAt > now`
- [x] Walk the TTL-span, replay, and subject-mismatch reject rules; confirm each names its enforcement home honestly — Done: TTL-span code-enforced; replay + subject-mismatch named run-scoped residuals
- [x] Grep the reference body for spec/packet/phase IDs and spec paths; confirm none present (evergreen) — Done: body + hook comment scan clean
- [x] Update `implementation-summary.md` and mark `checklist.md` with evidence — Done: implementation-summary.md authored; checklist fully `[x]`

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Axis completeness | Every freshness axis has a reject rule + enforcement home | Manual matrix walk against the contract's boundary/acceptance rows |
| Enforcement honesty | No axis over-claims code enforcement | Trace each "code-enforced" label to the actual boundary source line |
| Acceptance (already enforced) | Stale and future-issued reject | Confirm the boundary requires `issuedAt <= now < expiresAt` |
| Acceptance (TTL-span, if coded) | Absurd span rejects; legitimate ~300s passes | Apply the span bound to a far-future `expiresAt` and to the canonical instance |
| Residual honesty | Replay + subject-mismatch attributed to run-scoped state | Confirm the reference does not claim the per-call boundary closes them |
| Evergreen | No spec/packet/phase IDs or spec paths in body | Grep the reference body for ID and spec-path patterns |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Proof token contract (schema §2, boundary §6, acceptance §7) | Reference | Green | Reuse points lose their anchor; axes get re-invented |
| Boundary time-window + structural token check | Source | Green | Cannot state what is already enforced vs missing |
| Open-design transport `references/` directory | Internal | Green | Host directory for the new consumer reference already exists |
| Run-scoped consumed-set + payload recompute | Downstream | Not built here | Replay + subject-mismatch closure is a named residual, out of scope |
| Owner decision on the TTL-span bound + tolerance | Decision | Resolved | Owner accepted a generous 24h ceiling (`MAX_DESIGN_TOKEN_TTL_MS`); the hardening landed and legitimate ~300s tokens still pass |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The freshness contract is wrong or conflicts with a consuming gate, or the TTL-span bound falsely rejects legitimate tokens.
- **Procedure**: Delete the single new reference doc, or `git revert` the authoring commit. If the optional TTL-span hardening was applied, revert that hook edit separately so the doc-only artifact can stand alone. The doc-only path has no blast radius beyond the new file; the code path's blast radius is the shared boundary check and is reverted independently.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Author + optional hardening) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Author |
| Author (contract) | Setup | Verify |
| Optional hardening | Author + owner approval | Verify |
| Verify | Author | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (read boundary + scaffold) | Low | 30 minutes |
| Author (axis matrix + residuals + reconciliation) | Medium | 1.5-2 hours |
| Optional TTL-span hardening (code + no-regression) | Medium-High | 1-1.5 hours (only if owner-approved) |
| Verification (acceptance walk + evergreen scan) | Low | 30 minutes |
| **Total (doc-only)** | | **2.5-3 hours** |
| **Total (doc + code)** | | **3.5-4.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] New file path confirmed inside the open-design transport `references/` (no live target touched on the doc-only path) — Done: `mcp-open-design/references/freshness_invalidation.md`
- [x] Optional hook edit, if taken, isolated in its own commit for independent revert — Done: the +6/-1 boundary edit is the only `pre-tool-use.ts` change, revertible alone
- [x] No-regression gate named before any boundary-check change merges — Done: `codex-pre-tool-use.vitest.ts` 11/11 + `hooks-codex-freshness.vitest.ts` 1/1 + dynamic-timestamp both-lanes acceptance

### Rollback Procedure
1. **Immediate**: Delete the new freshness consumer reference
2. **Revert code**: `git revert` the authoring commit; revert the optional hook edit separately if applied
3. **Cleanup**: No directory cleanup needed (the host `references/` directory pre-exists)
4. **Verify**: Confirm the canonical ~300s token still validates at the boundary after any revert

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — a documentation-only consumer plus an optional in-memory time check; no schema or persisted state created

<!-- /ANCHOR:enhanced-rollback -->

---
