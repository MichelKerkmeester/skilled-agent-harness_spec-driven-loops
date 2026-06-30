---
title: "Implementation Summary: Temporal/subject freshness invalidation + TTL-span hardening"
description: "Post-build record for the freshness consumer contract added to mcp-open-design/references/freshness_invalidation.md (six axes: stale, future-issued, malformed-time, TTL-span, replay, subject/payload-mismatch) and the codex-boundary TTL-span hardening in pre-tool-use.ts (MAX_DESIGN_TOKEN_TTL_MS = 24h; tightened isValidTokenTimeWindow), with the both-lanes acceptance matrix, the code-enforced-vs-run-scoped-residual honesty, and the two-file scope."
trigger_phrases:
  - "freshness invalidation implementation summary"
  - "ttl span hardening codex boundary record"
  - "design proof token freshness six axes"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/010-freshness-invalidation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the six freshness axes, the TTL-span hardening, and the both-lanes acceptance matrix"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-freshness-invalidation |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/mcp-open-design/references/freshness_invalidation.md` (new, 60 lines) + `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` (+6/-1) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A valid-but-stale design proof token used to authorize work long after issuance, and the codex boundary's time-window check bounded only where `now` sat — it never bounded the span between `issuedAt` and `expiresAt`, so a token minting itself a one-year lifetime sailed straight through. This phase closes that gap two ways: it writes a freshness consumer contract that enumerates every staleness axis with its reject rule, and it hardens the codex boundary so an absurd TTL span now fails closed. Freshness is now code-enforced at the tool boundary for both Open Design lanes, and the rules that a per-call hook cannot reach are named honestly as run-scoped residuals rather than implied as solved.

### The freshness consumer contract (six axes)

The new reference defines the freshness consumer for `DESIGN_PROOF_TOKEN` without inventing a second token schema — it inherits the field schema, boundary responsibilities, and validator acceptance by citation to the proof-token contract §2/§6/§7. It enumerates six invalidation axes, each with a reject rule and an explicit enforcement label:

- **Stale / expired** (`now >= expiresAt` -> reject) — CODE-ENFORCED at the codex boundary.
- **Future-issued** (`issuedAt > now` -> reject) — CODE-ENFORCED at the codex boundary.
- **Malformed timestamp** (`issuedAt`/`expiresAt` parses non-finite -> reject) — CODE-ENFORCED at the codex boundary.
- **TTL span** (`expiresAt - issuedAt` unreasonably large -> reject) — CODE-ENFORCED at the codex boundary (the axis this phase closed).
- **Replay** (a consumed `nonce`+`runId` pair -> reject) — RUN-SCOPED RESIDUAL: needs a consumed-set the per-call boundary cannot hold.
- **Subject / payload mismatch** (recomputed payload digests differ -> reject) — RUN-SCOPED RESIDUAL: needs the actual outgoing payload the per-call boundary never sees.

The first four are fully determined by `issuedAt` and `expiresAt`, so the stateless codex boundary can enforce them per call. The last two need cross-call state or the outgoing payload, so they are mandatory reject rules attributed to the guarded proxy or parent — the only place that evidence lives.

### The TTL-span code hardening

The boundary edit adds a named const `MAX_DESIGN_TOKEN_TTL_MS = 24 * 60 * 60 * 1000` (24h) with a durable WHY comment, and tightens `isValidTokenTimeWindow` to also require `(expiresAt - issuedAt) <= MAX_DESIGN_TOKEN_TTL_MS` on top of the existing `issuedTime <= now && now < expiryTime` window. The 24h ceiling is a deliberately generous defensive bound: legitimate tokens mint at the proof-token contract's ~300s default and pass untouched; only freshness-defeating spans reject. Because the structural token check is shared by both the MCP-tool lane and the `od` CLI lane, the span bound now applies to both with one edit.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-open-design/references/freshness_invalidation.md` | Created | Freshness consumer contract: the six-axis matrix with reject rules and code-enforced vs run-scoped-residual labels, the boundary contract, the residual table (replay consumed-set + payload recompute), the acceptance scenarios, and the cite-don't-duplicate reuse of the proof-token §2/§6/§7 — 60 lines |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` | Modified | Add `MAX_DESIGN_TOKEN_TTL_MS` (24h) with a durable WHY comment and tighten `isValidTokenTimeWindow` to also require `(expiresAt - issuedAt) <= MAX_DESIGN_TOKEN_TTL_MS` — +6/-1 |

No live skill, gate, hook test, or CLI file was edited beyond these two. `.codex/policy.json` and the codex hook vitest files were left untouched.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 high fast`) created the freshness consumer reference (60 lines) and made the +6/-1 boundary edit. The orchestrator then re-verified the TTL-span behavior independently with DYNAMIC now-timestamps through BOTH enforcement lanes — the `od` CLI lane (D4-R5, gate file) and the MCP lane (D4-R4, inline token): a one-year-span token REJECTS (TTL-span exceeded — the open gap closed), a ~300s-span token ACCEPTS, a fresh `now-30s -> now+270s` token ACCEPTS (no regression), an expired token REJECTS, and a future-issued token REJECTS. This documentation re-confirms that work: `npx vitest run` reports `codex-pre-tool-use.vitest.ts` 11/11 passing and the dedicated `hooks-codex-freshness.vitest.ts` 1/1 passing against the live hook. It writes only the phase-folder docs and touches no live file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Enforce the TTL span at the codex boundary instead of leaving it contract-only | The span is fully determined by `issuedAt`/`expiresAt`, so a stateless per-call hook CAN close it; leaving it to the contract would let an absurd-lifetime token pass the live gate |
| Set the ceiling at 24h, not ~300s | A tight bound risks falsely rejecting legitimate tokens across clock skew and slow runs; 24h is generous enough that real ~300s tokens never reject yet absurd spans always do |
| Add the bound to `isValidTokenTimeWindow` rather than a new sibling helper | The window check is the single shared chokepoint both lanes already call; extending it applies the span bound to the MCP and `od` CLI lanes with one edit and no new surface |
| Cite the proof-token contract §2/§6/§7 instead of restating the schema | One token schema, one source of truth — duplicating the field schema would invite drift; the consumer reference enumerates only freshness responsibilities |
| Name replay and subject-mismatch as run-scoped residuals, not solved | A per-call boundary holds no consumed-set and never sees the outgoing payload; claiming closure there would be dishonest, so each is attributed to the guarded proxy/parent where the evidence lives |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Every freshness axis has an explicit reject rule | PASS, stale, future-issued, malformed-time, TTL-span, replay, subject/payload-mismatch each carry a reject rule |
| Each axis labeled code-enforced vs run-scoped-residual with no over-claim | PASS, four axes CODE-ENFORCED at the codex boundary; replay + subject/payload-mismatch RUN-SCOPED RESIDUAL |
| TTL-span hardening present and named | PASS, `MAX_DESIGN_TOKEN_TTL_MS = 24 * 60 * 60 * 1000` with a durable WHY comment; `isValidTokenTimeWindow` requires `(expiresAt - issuedAt) <= MAX_DESIGN_TOKEN_TTL_MS` |
| ACCEPTANCE (MCP lane, D4-R4 inline token): 1-year span | PASS, REJECT (TTL-span exceeded) — orchestrator-verified with dynamic now-timestamps |
| ACCEPTANCE (od CLI lane, D4-R5 gate file): 1-year span | PASS, REJECT (TTL-span exceeded) — orchestrator-verified with dynamic now-timestamps |
| ACCEPTANCE: ~300s-span token | PASS, ACCEPT through both lanes |
| ACCEPTANCE (no regression): fresh `now-30s -> now+270s` token | PASS, ACCEPT — the legitimate window still validates |
| ACCEPTANCE: expired token | PASS, REJECT (stale) |
| ACCEPTANCE: future-issued token | PASS, REJECT (future-issued) |
| `codex-pre-tool-use.vitest.ts` | PASS, 11/11 (re-run: `npx vitest run`) |
| `hooks-codex-freshness.vitest.ts` (TTL-span test) | PASS, 1/1 (re-run: `npx vitest run`) |
| `tsc --noEmit` on the hook | PASS, clean (orchestrator-verified) |
| Both gates intact: `.codex/policy.json` + codex hook test files untouched | PASS, neither has any uncommitted change |
| Scope: only the two named files written | PASS, `pre-tool-use.ts` diff is +6/-1; `freshness_invalidation.md` is the only new file |
| Evergreen: no spec/packet/phase IDs or `specs/` paths in the doc body or the hook comment | PASS, both bodies scan clean |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (description.json / graph-metadata.json) | EXPECTED, the orchestrator regenerates these; level/status drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Replay invalidation is a run-scoped residual.** The per-call codex boundary can require `singleUse: true`, `nonce`, and `runId`, but it holds no consumed-set, so it cannot prove a nonce was unused. The guarded proxy or parent must maintain a run-scoped set keyed by `nonce`+`runId` and consume each successful token exactly once. Named honestly, not solved here.
2. **Subject/payload-digest recompute is a run-scoped residual.** The boundary can require well-formed digest fields but never sees the actual outgoing subject, brief, form-answer, lineage, surface, or reachable file hashes to recompute against. The guarded proxy or parent must rebuild those inputs and compare. Named honestly, not solved here.
3. **The 24h TTL-span ceiling is generous, not tight.** It is a defensive upper bound against obviously non-fresh tokens, not permission to mint long-lived authorization. Minting still follows the proof-token contract's ~300s default; the ceiling only catches absurd spans. A token between ~300s and 24h would still pass the span check.
4. **This phase ships no consumed-set or recompute machinery.** It closes the temporal/span axes in code and writes the contract for all six. The replay consumed-set and the payload recompute are named residuals, out of scope for this phase.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Freshness consumer contract (6 axes) + codex-boundary TTL-span hardening (MAX_DESIGN_TOKEN_TTL_MS = 24h)
- Four axes CODE-ENFORCED at the codex boundary; replay + subject/payload-mismatch RUN-SCOPED RESIDUALS
- Both-lanes acceptance: 1yr REJECT / 300s+270s ACCEPT / expired+future REJECT; vitest 11/11 + 1/1, tsc clean, both gates intact
- Scope = freshness_invalidation.md (new) + pre-tool-use.ts (+6/-1); GENERATED_METADATA regenerated by the orchestrator
-->
