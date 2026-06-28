---
title: "Implementation Summary: Cross-delegation token laundering guard"
description: "Post-build record for the Cross-Delegation Token Laundering Guard section appended to mcp-open-design/references/cli_child_pairing.md: the three laundering attacks (replay/omit/weaken), one fail-closed deny rule each reusing DESIGN_PROOF_TOKEN §2/§6, the two enforcement points, the no-second-schema reuse, and the named parent-boundary-only residual. Pure append, scope clean."
trigger_phrases:
  - "cross delegation laundering guard implementation summary"
  - "token replay omit weaken deny record"
  - "child re-validate demand-back summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/007-cross-child-laundering-guard"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record the laundering-guard append and the parent-boundary-only residual"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
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

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-cross-child-laundering-guard |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` (Cross-Delegation Token Laundering Guard section, 51 insertions, 0 deletions) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The transport-result re-validation already proves a child did not launder design intent on the return path, but the request path down to the child was unguarded: a token can be replayed after consumption, omitted on a design-affecting child op, or weakened by relaxing its fields. This phase closes that gap by appending a Cross-Delegation Token Laundering Guard to the existing pairing contract. A replayed, omitted, or weakened `DESIGN_PROOF_TOKEN` is now denied at the cross-delegation boundary instead of slipping past a once-valid mint.

This is a prose deny contract, not code. It reuses the proof-token replay defense and boundary rules by citation and authors no second token schema. It is a pure append to one existing reference and edits no live skill, gate, hook, or CLI file beyond that section.

### The three-attack threat model

The section names the cross-delegation laundering surface as three attacks. REPLAY presents a token whose `nonce` and `runId` pair was already consumed by an earlier design-affecting operation. OMIT runs a design-affecting child operation with no token, relying on absence being treated as exempt, advisory, or unverifiable. WEAKEN presents a token derived from a real mint but relaxed — `singleUse` stripped or flipped, `expiresAt` extended, `issuedAt` backdated, or `boundSurface` swapped away from the authorized target.

### One fail-closed deny rule per attack, reusing §2/§6

Each attack maps to exactly one deny rule that consumes `DESIGN_PROOF_TOKEN v1` §2 and §6 rather than redefining them. Replay reuses the §2 replay defense and the §6 consumed-pair rejection: the parent owns the run-scoped consumed-set for `nonce` and `runId`, and any reappearance of a consumed pair returns DENY. Omit reuses the §6 required-field rejection, elevated so token presence is mandatory on every design-affecting child operation — absence is never exempt, fail closed. Weaken reuses §6 single-use, time, TTL, surface, payload-digest, and file-hash re-validation against the original mint; any relaxation, or any token that cannot reproduce the content-bound digests from the authorized material, returns DENY. The content-bound digests are the tamper evidence: a child may reference the minted token but must not re-mint, mutate, summarize, or substitute it to pass a looser boundary.

### Two enforcement points

The guard names two points. The child PreToolUse re-validation runs before the design-affecting call: a modifiable child validates token presence, the unconsumed `nonce`+`runId` pair, field integrity against the mint, target-surface match, freshness, and digest recomputation before any guarded call reaches Open Design. The parent demand-back is the enforceable floor: the parent reconciles the returned `designProofTokenRef` and operation evidence against the original mint, the run-scoped consumed-set, the outgoing target, and the transport-result replay, and denies replay, omission, weakening, ambiguity, stale state, or validator exception.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` | Modified (pure append) | Append the Cross-Delegation Token Laundering Guard section: threat model, the three §2/§6-reusing deny rules, the two enforcement points, the named residual, and the acceptance table — 51 insertions, 0 deletions; the existing transport-result content is preserved |

No live skill, gate, hook, CLI, or `.codex` file was edited beyond the named append. The proof-token §2/§6 rules are cited as dependencies, not restated.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 high fast`) appended one section to the existing `cli_child_pairing.md` and nothing else — 51 insertions, 0 deletions, a pure append that preserves the existing OPEN_DESIGN_TRANSPORT_RESULT and parent re-validation content with 7 references intact. The orchestrator then verified the result independently against the actual file: the change set is append-only (0 removed lines), the three attacks and their deny rules are present, §2/§6 are reused by citation with no second token schema authored (18 token references), the two enforcement points are named with parent demand-back as the floor, and both residuals are stated. An evergreen scan over the appended body found no spec, packet, or phase identifiers and no `specs/` paths. This documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live file beyond the named append.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Home the guard as an append to `cli_child_pairing.md`, not a new `design_delegation_payload.md` | The lowest-duplication home is the document the guard twins; the append co-locates with the return-path transport-result re-validation, reuses the same parent reconciliation, and extends the existing Deny Rules and Named Residual sections. Logic-sync deviation from the scaffold framing, recorded honestly |
| Reuse §2/§6 by citation, author no second token schema | A parallel token schema would drift from the mint; consuming the proof-token rules keeps a single source of truth |
| Make token presence mandatory on every design-affecting child op | Treating absence as exempt is the omit attack; the only safe default is fail-closed |
| Treat the content-bound digests as the weakening tamper evidence | A relaxed re-mint cannot reproduce the authorized digests without redoing the authorized load, so the digest mismatch is the deterministic deny signal |
| Name the parent demand-back as the enforceable floor | A fully-compromised or unmodifiable child cannot guarantee the child-side deny; honest scope makes the parent boundary the control that always holds |
| Name the forge-from-stolen-inputs residual instead of claiming closure | A child re-minting a digest-valid token from captured inputs inside the freshness window is out of scope for child-side guarantees; stating it keeps the boundary honest, no taste claim |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Section appended at the exact target | PASS, Cross-Delegation Token Laundering Guard in `cli_child_pairing.md` |
| Pure append, existing content preserved | PASS, 51 insertions, 0 deletions; transport-result + parent re-validation content intact (7 refs) |
| All three attacks defined | PASS, REPLAY (consumed `nonce`+`runId`), OMIT (design op with no token), WEAKEN (relaxed single-use/freshness/surface) |
| One deny rule per attack reusing §2/§6 | PASS, consumed-pair replay (§2+§6), missing child design token (§6 required-field), relaxed token fields (§6 single-use/time/TTL/surface/digest) |
| No second token schema authored | PASS, §2/§6 reused by citation; 18 token references, no new field table |
| Two enforcement points named | PASS, child PreToolUse re-validation + parent demand-back, with parent demand-back as the floor |
| Forge-from-stolen-inputs residual named | PASS, fully-compromised child re-minting a digest-valid token inside the freshness window stated out of scope for child-side guarantees |
| Unmodifiable-child residual named | PASS, an unmodifiable child CLI loses the child-side deny, stays covered by the parent demand-back floor |
| Evergreen: no spec/packet/phase IDs or `specs/` paths | PASS, appended body scan clean |
| Scope: only the named append; no other live file touched | PASS, change set limited to the one appended section |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (description.json / graph-metadata.json) | EXPECTED, the orchestrator regenerates these; level/status drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Prose contract, not code.** This phase ships a deny contract section; it does not itself execute the re-validation. The enforceable spine (proof token + transport-result re-validation + the parent boundary) already exists and is the mechanism that enforces it.
2. **Fully-compromised child is a named residual, not closed.** A child that steals authorized inputs and forges a digest-valid token inside the freshness window is out of scope for child-side guarantees. The enforceable control remains the parent demand-back floor.
3. **Unmodifiable child CLI loses the early deny.** A child that ignores the guard cannot run the child-side PreToolUse re-validation; it stays covered only by the mandatory, fail-closed parent demand-back, which loses the early child-side denial.
4. **Home deviates from the scaffold framing.** The scaffold framed a new shared `design_delegation_payload.md` plus an `agent-io-contract.md` extension; the delivered home is an append to `cli_child_pairing.md` (the transport-result twin, lowest-duplication home). The mandatory dispatch-block carrier remains a separate, out-of-scope concern.
5. **Taste is not certified.** This binds authorization across delegation; it does not certify the design quality of what any child produces.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Prose deny contract appended to cli_child_pairing.md: replay/omit/weaken denied, §2/§6 reused by citation, two enforcement points, parent demand-back floor
- Pure append (51/0); home deviation + parent-boundary-only residual recorded; GENERATED_METADATA regenerated by the orchestrator
-->
