---
title: "Implementation Summary: D5-R2 — OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent fail-closed re-validation"
description: "A return-path contract now lets the parent re-validate what a CLI child did with Open Design, failing closed on a missing result, a digest mismatch, or an unlisted mutating call."
trigger_phrases:
  - "d5-r2 implementation summary"
  - "open design transport result built"
  - "parent fail-closed re-validation summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/002-transport-result-revalidation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Author OPEN_DESIGN_TRANSPORT_RESULT v1 schema + parent fail-closed re-validation"
    next_safe_action: "Wire the transport-result contract into cli-* ALWAYS blocks (D5-R5)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r2-impl"
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
| **Spec Folder** | 002-transport-result-revalidation |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The request path into Open Design was already guarded, but the return path was blind. Once work crossed into a CLI child the parent had no structured way to know what the child actually did — a child could run an Open Design build with no design judgment loaded, or write files silently, and a final natural-language summary could not prove otherwise. This phase authors the return-path counterpart: `OPEN_DESIGN_TRANSPORT_RESULT v1`, the structured receipt a CLI child must demand-back after an Open Design transport op, plus the parent-side replay that re-validates it and fails closed when the evidence is missing, mismatched, or incomplete.

### OPEN_DESIGN_TRANSPORT_RESULT v1 result schema

The contract defines the envelope a child returns as structured metadata, not prose. It records what judgment and transport the child loaded (`childLoadedSkills`), the operation class it ran (`operationClass`, reusing the guarded-proxy policy classes by reference), and an ordered record of every Open Design tool, CLI verb, or adapter call it made (`toolsCalled[]`, each entry carrying surface, tool/verb, mutation class, target, and whether it fed a design decision). It carries the payload and lineage digests the parent needs to replay the boundary — `designManifestDigest`, `transportAssertionDigest`, `briefDigest`, `formAnswersDigest`, `openDesignLineageDigest`, `proofCardDigest`, plus a self-excluding `transportResultDigest` so altered return metadata is detectable. The token is referenced, never re-minted: `designProofTokenRef` carries only the nonce and run boundary of the `DESIGN_PROOF_TOKEN` that authorized the call. A JSON shape example reuses the proof-token contract's `sha256:<hex>` digest convention by citation rather than redefining canonicalization.

### Parent fail-closed re-validation and the three deny rules

The parent treats the result as evidence to verify, not a trust signal. It detects whether Open Design was used, demands a structured result, schema-checks it, recomputes and compares the dispatch/payload/tool-call/result digests, reconciles the proof-token reference against the token minted for the run boundary, reconstructs the effective operation class (a child may not downgrade observed writes to `read` or `transport`), and confirms every mutating or destructive call is listed — including the multi-turn case where `start_run` returns a form and a later UI response fires a build that writes files. Three deny rules anchor the gate, each a fail-closed `DENY`: (1) **missing result after Open Design use** — a natural-language summary, an Agent I/O envelope, or an artifact link does not satisfy the gate; (2) **digest mismatch** — any manifest, assertion, payload, tool-call, lineage, proof-card, or result digest that cannot be recomputed or does not match; (3) **unlisted mutating call** — a mutating or destructive call absent from `toolsCalled`, including a `start_run` build that wrote files with no matching record.

### Named residual and the Agent I/O boundary

The contract is honest about where determinism ends. A `cli-claude-code` child can run text-only, returning no machine-readable tool stream; on that path digest matching degrades to **ADVISORY** — the residual is reported and any supplied digests are compared, but the contract claims no deterministic guarantee there. Separately, the Agent I/O contract is documented as optional-advisory: it may carry the transport-result payload as data, but it is never the gate. Its absence must never pass an Open Design handoff, and its presence never replaces the structured result, the proof-token reference, the guarded-proxy classification, or the digest comparison.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` | Created | The 192-line return-path contract: `OPEN_DESIGN_TRANSPORT_RESULT v1` schema, the parent re-validation algorithm, the three deny rules, the named text-only residual, the Agent-I/O-is-not-the-gate boundary, and the cite-not-redefine relationship to the proof-token and guarded-proxy contracts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 high) read the two request-path contracts first — `design_proof_token.md` for the digest convention and validator behavior, and `guarded_proxy.md` for the request-path precondition pattern — then authored the return-path mirror so it references those contracts and redefines neither. The orchestrator verified the deliverable independently: the result schema is present with `childLoadedSkills`, `operationClass`, `toolsCalled[]`, the payload digests, and the `designProofTokenRef` declared as a nonce+runId reference that is forbidden to re-mint; the three deny rules each map to a fail-closed `DENY`; the token and proxy contracts are cited and not redefined; the text-only `cli-claude-code` residual is named as advisory; and Agent I/O is explicitly excluded as the gate. Scope was confirmed clean by `git status` — the only change attributable to this phase is the single new `cli_child_pairing.md`; no cli-* SKILL was touched. An evergreen scan over the deliverable returned no spec path, packet, phase, ADR, REQ, task, or finding ID.

This phase authors the contract only. The `cli-*` ALWAYS wiring that actually demands the result back at dispatch time is the sibling phase D5-R5; this deliverable is the return-path schema and parent algorithm that wiring will carry, named honestly so the boundary is not mistaken for already-shipped enforcement.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirror the request-path precondition pair as a return-path contract | The token proves context flowed INTO the call; the transport result proves what the child DID with it. Same deny-by-default, fail-closed posture keeps the two halves symmetric and auditable |
| Reference the proof-token and guarded-proxy contracts, never redefine them | Re-stating the digest canonicalization or the precondition would let the two copies drift; a single source of truth per contract is the only safe option |
| Make `designProofTokenRef` a nonce+runId reference, forbidden to re-mint | A return receipt must not be able to manufacture authorization; it can only point at the token already minted for the run boundary |
| Bind the multi-turn `start_run` build to the unlisted-mutating-call DENY | The riskiest silent write is a build fired by a later UI response; treating an absent record as a DENY closes that gap explicitly |
| Name the text-only `cli-claude-code` path as ADVISORY, not a guarantee | Without a machine-readable tool stream the parent cannot deterministically prove a stale token or an omitted call; over-claiming would be dishonest |
| Keep the deliverable evergreen and scoped to one new doc | The contract must survive doc reorganization and must not couple to this packet; the cli-* wiring is the sibling D5-R5 phase, not this one |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Result schema present | PASS — `childLoadedSkills`, `operationClass`, `toolsCalled[]`, payload digests, and `designProofTokenRef` (nonce+runId, re-mint forbidden) all defined (`cli_child_pairing.md` lines 32-64) |
| Three deny rules each a fail-closed DENY | PASS — missing-result-when-OD-used, digest mismatch, unlisted mutating call (lines 156-158) |
| Multi-turn `start_run` build bound to DENY | PASS — parent step 8 + the unlisted-mutating-call rule both name the `start_run`-then-build write (lines 143, 158) |
| Cites token + proxy, does not redefine | PASS — `design_proof_token.md` and `guarded_proxy.md` cited as dependencies (lines 21-22) |
| Text-only residual named as advisory | PASS — `cli-claude-code` text-only path degrades digest matching to ADVISORY with no deterministic guarantee (line 168) |
| Agent I/O is not the gate | PASS — documented optional-advisory; absence never passes, presence never replaces the gate (lines 174-178) |
| Evergreen scan over deliverable | PASS — no spec path / packet / phase / ADR / REQ / task / finding ID |
| Scope clean | PASS — `git status` shows only the new `cli_child_pairing.md`; no cli-* SKILL modified |
| `validate.sh --strict` | PASS except the expected GENERATED_METADATA residual (orchestrator regenerates `description.json` / `graph-metadata.json`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The text-only `cli-claude-code` path is advisory, not deterministic.** With no machine-readable tool stream the parent cannot prove a stale token or an omitted Open Design call from prose. The contract reports the residual and compares any supplied digests, but a structured `OPEN_DESIGN_TRANSPORT_RESULT v1` plus replayable tool metadata is required for a machine-checkable pass.
2. **This phase authors the contract, not the wiring.** The `cli-*` ALWAYS blocks that demand the result back at dispatch time are the sibling D5-R5 phase. Until that wiring lands, the contract defines the return-path gate but does not yet fire it.
3. **Generated metadata is a residual at hand-off.** `description.json` and `graph-metadata.json` still need regeneration by the orchestrator after this doc sync; the strict validator's GENERATED_METADATA finding is expected and is not hand-written.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
