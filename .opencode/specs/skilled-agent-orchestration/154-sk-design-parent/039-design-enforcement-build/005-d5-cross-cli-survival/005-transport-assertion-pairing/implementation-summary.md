---
title: "Implementation Summary: D5-R5 — OPEN_DESIGN_TRANSPORT_ASSERTION v1 result-assertion pairing"
description: "The transport handoff is no longer a bare claim: a child-resident assertion now pairs with the post-op result, and the parent recomputes its digests against both the returned result and the originating manifest."
trigger_phrases:
  - "d5-r5 implementation summary"
  - "open design transport assertion built"
  - "result-assertion pairing summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/005-transport-assertion-pairing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Append transport-assertion pairing section to cli_child_pairing.md"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r5-impl"
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
| **Spec Folder** | 005-transport-assertion-pairing |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The return path already proved what a CLI child DID: `OPEN_DESIGN_TRANSPORT_RESULT v1` lets the parent replay the operation and fail closed when Open Design was used but no result returns. The request path still trusted a bare claim — nothing made the child emit its own content-bound declaration of what it loaded, what class of operation it ran, and what payload it carried. This phase closes that half by appending the `OPEN_DESIGN_TRANSPORT_ASSERTION v1` schema plus the rule that pairs each transport op's assertion with its result, so the handoff is now a checkable pair the parent re-validates rather than a sentence it has to take on faith.

### OPEN_DESIGN_TRANSPORT_ASSERTION v1 schema

The appended section defines the child-resident block as structured metadata, not prose. It carries `version` and a parent-issued `dispatchId` that must match the paired result and the originating manifest; `childLoadedSkills` (a design-affecting op must include design judgment and Open Design transport); `operationClass` (`read`/`mutating`/`destructive`/`transport`, conservative — it may not downgrade observed behavior); `liveToolsListVerified` (the child confirmed the live Open Design tool surface before relying on tool names, availability, or mutability); content-bound `payloadDigests` reusing the proof-token §2 digest field shape (`designManifestDigest`, `transportAssertionDigest`, `briefDigest`, `formAnswersDigest`, `openDesignLineageDigest`, `proofCardDigest`); and a self-excluding `assertionDigest` so altered assertion metadata is detectable — the twin of `transportResultDigest`. A JSON shape example reuses the token contract's `sha256:<hex>` convention by citation rather than redefining canonicalization.

### Result-assertion pairing and parent re-validation

The pairing rule makes the assertion checkable: every Open Design transport op carries both blocks, and the assertion's `payloadDigests` must reconcile against the corresponding transport-result digest fields and the originating dispatch manifest. A claim with no recomputable digest is not an assertion. The parent re-validation extension runs the existing transport-result re-validation first, then recomputes `assertionDigest` from the envelope excluding itself, recomputes `payloadDigests` using proof-token §2 (digest schema) and §6 (recompute-and-reject), compares assertion digests to the paired result and the manifest, confirms `childLoadedSkills` carries design judgment, confirms `operationClass` is at least as strict as the reconstructed behavior, and confirms `liveToolsListVerified` holds where tool names or mutability mattered. It returns `ALLOW` only when both halves pass; otherwise `DENY`. Seven deny rules anchor the gate — missing assertion after Open Design use, assertion-digest non-recompute, result-assertion mismatch, manifest-assertion mismatch, operation-class downgrade, missing live-tools verification, and missing design judgment — each a fail-closed `DENY`. The extension cites §2/§6 and defines no second token schema, exactly parallel to the existing cross-delegation laundering guard.

### Named residual

The contract is honest about where determinism ends. A text-only or unmodifiable child may emit the assertion as prose or omit it entirely; on that path assertion checking degrades to ADVISORY because the parent has no structured envelope to recompute. The enforceable floor stays the parent demand-back plus the existing transport-result re-validation, and both fail closed. The parent may report supplied assertion-like prose as advisory evidence, but it must not claim a machine-checkable assertion pass from prose alone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` | Modified (append-only) | Appended the "Open Design Transport Assertion Pairing" H2 section (lines 247-342): the `OPEN_DESIGN_TRANSPORT_ASSERTION v1` schema, the result-assertion pairing rule, the parent re-validation extension citing proof-token §2/§6, the seven-rule deny table, the named text-only residual, and an acceptance subsection. 99 insertions, 0 deletions — every pre-existing section (Result Schema, Parent Re-Validation, Deny Rules, Named Residual, Agent I/O, Acceptance, Cross-Delegation Token Laundering Guard) preserved byte-identical |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) read the existing transport-result schema and parent re-validation first, then the proof-token §2 (field/digest schema) and §6 (boundary-side recompute-and-reject), so the new section cites those contracts and redefines neither. It appended one H2 section at the end of `cli_child_pairing.md`, leaving every prior line untouched. The orchestrator verified the deliverable independently: `git diff --numstat` confirmed 99 insertions and 0 deletions (pure append); the pre-existing `OPEN_DESIGN_TRANSPORT_RESULT` references and the laundering guard are intact; the assertion schema names all seven fields including the self-excluding `assertionDigest`; the pairing rule reconciles assertion digests against both the returned result and the originating manifest; the parent re-validation extension cites §2 and §6 and maps each of the seven deny rules to a fail-closed `DENY`; the text-only advisory residual is named; `design_proof_token.md` is untouched; and an evergreen scan returned no spec path, packet, phase, ADR, REQ, task, or finding ID.

The honest framing: this upgrades the transport handoff from a bare claim to a result-assertion pair the parent re-validates — the assertion's `payloadDigests` must reconcile against both the returned result and the originating dispatch manifest. It is the request/return-path twin of the existing transport-result re-validation, not a new authorization token and not a taste claim. A text-only child degrades to advisory (the named residual), and the `cli-*` ALWAYS wiring that demands the assertion back at dispatch time is the downstream consumer, not this phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pair a pre-op assertion with the existing post-op result | The token proves context flowed INTO the boundary and the result proves what the child DID; the assertion is the child's own pre-op declaration, made checkable by binding the same digests the parent can recompute |
| Make the assertion checkable, not a bare claim | A claim with no recomputable digest is not evidence; binding `payloadDigests` to the proof-token §2 schema lets the parent reconcile assertion against result against manifest |
| Cite proof-token §2 and §6, never redefine them | Restating the digest convention or the recompute-and-reject discipline would let copies drift; the laundering guard already reuses them by reference, so this section follows the same pattern |
| Append-only, every prior section preserved | The deliverable extends the existing contract; touching no prior line keeps the result schema, parent re-validation, and laundering guard a single source of truth and makes rollback a clean section delete |
| Name the text-only / unmodifiable-child path as ADVISORY | Without a structured assertion envelope the parent cannot recompute anything; over-claiming a machine-checkable pass from prose would be dishonest, so the parent demand-back + transport-result re-validation stay the floor |
| Keep the deliverable evergreen and scoped to one appended section | The contract must survive doc reorganization and must not couple to this packet; the cli-* ALWAYS wiring is the named downstream consumer, not this phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Assertion schema present | PASS — `version`, `dispatchId`, `childLoadedSkills`, `operationClass`, `liveToolsListVerified`, `payloadDigests`, self-excluding `assertionDigest` all defined (`cli_child_pairing.md` lines 259-265) |
| Result-assertion pairing rule | PASS — both blocks per op; assertion digests reconcile against the paired result and the originating manifest (lines 288-297) |
| Parent re-validation cites §2/§6 | PASS — step 4 recomputes `payloadDigests` via proof-token §2/§6 (line 306); extension defines no second token schema |
| Seven deny rules each fail-closed DENY | PASS — missing assertion, assertion-digest mismatch, result-assertion mismatch, manifest-assertion mismatch, operation-class downgrade, live-tools verification missing, missing design judgment (lines 317-323) |
| operationClass conservative | PASS — "MUST NOT downgrade observed behavior" (line 262); downgrade is a DENY (line 321) |
| Text-only residual named as advisory | PASS — assertion checking degrades to ADVISORY; parent demand-back + transport-result re-validation as the fail-closed floor (lines 327-329) |
| Append-only / preserved content | PASS — `git diff --numstat` shows 99 insertions, 0 deletions; prior sections byte-identical |
| Evergreen scan over appended section | PASS — no spec path / packet / phase / ADR / REQ / task / finding ID |
| Scope clean — no live skill file touched | PASS — `git status` shows only `cli_child_pairing.md` (the named output) and in-folder spec docs; no cli-* SKILL and no `design_proof_token.md` modified |
| `validate.sh --strict` | PASS except the expected GENERATED_METADATA residual (orchestrator regenerates `description.json` / `graph-metadata.json`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The text-only / unmodifiable-child path is advisory, not deterministic.** With no structured assertion envelope the parent cannot recompute the assertion's digests. The contract reports the residual and compares any supplied digest fields, but a structured `OPEN_DESIGN_TRANSPORT_ASSERTION v1` is required for a machine-checkable pass; the parent demand-back + transport-result re-validation remain the enforceable floor.
2. **This phase appends the contract, not the wiring.** The `cli-*` ALWAYS blocks that demand the assertion back at dispatch time are the downstream consumer. Until that wiring lands, the contract defines the pairing gate but does not yet fire it from the CLI SKILLs.
3. **Generated metadata is a residual at hand-off.** `description.json` and `graph-metadata.json` still need regeneration by the orchestrator after this doc sync; the strict validator's GENERATED_METADATA findings are expected and are not hand-written.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
