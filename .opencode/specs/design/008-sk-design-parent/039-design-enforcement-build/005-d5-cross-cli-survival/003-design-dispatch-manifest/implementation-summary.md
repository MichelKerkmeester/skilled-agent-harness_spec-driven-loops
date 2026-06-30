---
title: "Implementation Summary: D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + present-or-ASK pass-through"
description: "A parent now emits a structured DESIGN_DISPATCH_MANIFEST when dispatching design work, and all three cli-* SKILLs ASK rather than launch silently when that manifest cannot be assembled."
trigger_phrases:
  - "d5-r3 implementation summary"
  - "design dispatch manifest built"
  - "present-or-ask pass-through summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/003-design-dispatch-manifest"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Author DESIGN_DISPATCH_MANIFEST v1 schema + present-or-ASK rule in 3 cli-*"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r3-impl"
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
| **Spec Folder** | 003-design-dispatch-manifest |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A dispatched child CLI could not know which register, mode bundle, or files the parent resolved before handing off design work, so it reconstructed context by guesswork. This phase gives the parent a structured carry: `DESIGN_DISPATCH_MANIFEST v1` names exactly what design context, standards, and proof the child must load, and a present-or-ASK rule in all three cli-* SKILLs now ASKs before launching whenever that manifest cannot be assembled. It is the request-path half of the cross-CLI survival spine — it sits between the load-time safety net (the Design Standards Loading rule) and the return-path receipt (the transport result), carrying the resolution forward as data and feeding its digest into the return-path reconcile.

### DESIGN_DISPATCH_MANIFEST v1 schema

The schema lives in `context_loading_contract.md` §7, beside the CONTEXT MANIFEST vocabulary it extends rather than re-clones. The block carries nine fields: `version`, `surface`, `taskType` (the CONTEXT MANIFEST task-type set), `skDesignLoaded`, `workflowModes` (registry-valid against `mode-registry.json`), `register`, `dials` (the Register And Dials shape), `loadedFiles` (`{path, sha256}` by the proof-token convention), and `proofDemandBack`. Validity rules make a malformed manifest non-dispatchable: `skDesignLoaded` must be true, `register` must be resolved to `Brand` or `Product` (`unknown` is rejected), `workflowModes` must be non-empty and every mode registry-valid, and `loadedFiles` must be non-empty. The block travels INLINE in the dispatch payload — never a path the child resolves — and its digest is the `designManifestDigest` the return-path transport-result contract reconciles.

### Present-or-ASK pass-through in three cli-* SKILLs

Each of `cli-codex/SKILL.md`, `cli-claude-code/SKILL.md`, and `cli-opencode/SKILL.md` now carries one new ALWAYS rule, modeled on the Gate-3 spec-folder pass-through, inserted immediately after the existing `Design Standards Loading` rule. The rule instructs the parent to inline a `DESIGN_DISPATCH_MANIFEST v1` block when dispatching design or UI work, and — if the manifest cannot be assembled because `sk-design` is not loaded, the register is unresolved, or no registry-valid mode exists — to ASK before launching rather than start a silent design dispatch. The child returns the demanded proof; the parent reconciles it on the return path.

### Reconciliation with the two landed D5 pieces

The manifest is not a fresh idea; it carries the D5-R1 `Design Standards Loading` resolution forward as structured data (`skDesignLoaded` plus the resolved `workflowModes`, `register`, `dials`, and `loadedFiles`), and its digest is the D5-R2 return-path `designManifestDigest`. Request-path carry therefore sits exactly between the load-time safety net (D5-R1) and the return-path receipt (D5-R2), completing the request half of the spine.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/context_loading_contract.md` | Modified | Appended `## 7. DESIGN DISPATCH MANIFEST` defining `DESIGN_DISPATCH_MANIFEST v1` (9 fields), validity rules, the inline-payload note, the `designManifestDigest` reconcile note, and the named residual (lines 160-189) |
| `.opencode/skills/cli-codex/SKILL.md` | Modified | One present-or-ASK manifest rule appended after `Design Standards Loading` (item 13, line 361); trailing items renumbered by one digit |
| `.opencode/skills/cli-claude-code/SKILL.md` | Modified | The same present-or-ASK manifest rule (item 11, line 356); trailing items renumbered by one digit |
| `.opencode/skills/cli-opencode/SKILL.md` | Modified | The same present-or-ASK manifest rule (item 14) stacked on top of the concurrent GLM WIP; trailing items renumbered by one digit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) read the schema home first — `context_loading_contract.md` §1 register-first gate, §3 CONTEXT MANIFEST, §4 register/dials — confirmed the new section reuses that vocabulary, then located the insertion point in each cli-* by the content anchor `Design Standards Loading (surface-aware contract)` rather than a line number, because the GLM workstream had shifted `cli-opencode` lines. Four files were edited under a frozen scope: the additive schema section plus one append-only ALWAYS rule per cli-*.

The orchestrator verified the deliverable independently. The manifest schema is present with all required fields (6 schema-field grep hits across `skDesignLoaded`, `workflowModes`, `register`, `dials`, `loadedFiles`, `proofDemandBack`), the validity rules reject `register=unknown`, and the digest-reconcile note ties to the return-path `designManifestDigest`. All three cli-* SKILLs carry exactly one `DESIGN_DISPATCH_MANIFEST` occurrence, each with an explicit ASK branch. Critically, the concurrent GLM-5.2 workstream's uncommitted WIP in `cli-opencode/SKILL.md` is UNTOUCHED: the three glm/zai markers remain in the Model Selection paragraph, and the manifest rule is stacked on top — the GLM diff grew from 13 to 27 lines as pure addition, not a clobber. The separate one-line GLM provider-table change in `cli-opencode/references/cli_reference.md` is NOT part of this phase and is excluded from the commit. The proof-token, return-path, and mode-registry contracts were cited, not redefined; an evergreen scan over the deliverable returned no spec path, packet, phase, ADR, REQ, task, or finding ID.

This phase carries context forward as data and gates dispatch parent-side; it does not add a static token lint or route-replay fixtures — that is the sibling fixture phase, named as the downstream consumer, not built here.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Home the schema in `context_loading_contract.md`, not the return-path contract or a new file | §3 already owns SURFACE / TASK TYPE / register / dials; defining the manifest here reuses that vocabulary instead of re-cloning it, the genuine lowest-duplication home |
| Clone the Gate-3 spec-folder present-or-ASK shape for the cli-* rule | The spec-folder pass-through already proves a parent-resolved handoff survives dispatch; design needs the same present + pre-approved, else ASK posture |
| Make the manifest travel INLINE, never as a path | codex and claude-code children cannot resolve skill paths; a manifest passed by reference would arrive empty, so it must ride in the payload |
| Bind the manifest digest to the return-path `designManifestDigest` | The request-path carry and the return-path receipt must reconcile to one value, or the round trip cannot be verified |
| Locate the insertion anchor by content, not line number | The GLM workstream was concurrently editing `cli-opencode`; trusting a line number risked clobbering its WIP |
| Name the unmodifiable-child residual rather than overstate the floor | A child that ignores the inlined manifest cannot be forced to honor it; honesty requires naming the parent-side floor as the only deterministic guarantee |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Manifest schema present | PASS — `## 7. DESIGN DISPATCH MANIFEST` defines all 9 fields + validity rules (`context_loading_contract.md` lines 160-189); 6 schema-field grep hits |
| `register=unknown` rejected | PASS — validity rule states `unknown` is not dispatchable; the parent ASKs (line 179, 185) |
| Digest reconciled on return path | PASS — manifest digest pairs with the return-path `designManifestDigest` (line 187) |
| Present-or-ASK rule in all 3 cli-* | PASS — `grep -c "DESIGN_DISPATCH_MANIFEST"` returns 1 each (cli-codex line 361, cli-claude-code line 356, cli-opencode item 14) |
| Missing manifest maps to ASK | PASS — each rule carries an explicit ASK branch (sk-design not loaded / register unresolved / no registry-valid mode) |
| GLM WIP preserved (no clobber) | PASS — 3 glm/zai markers intact in cli-opencode; the manifest rule is stacked (GLM diff 13 → 27 lines, pure addition) |
| cli_reference.md excluded | PASS — the separate GLM provider-table row in `cli-opencode/references/cli_reference.md` is not part of this phase |
| Cites token / return-path / mode-registry, no redefine | PASS — loadedFiles convention, `designManifestDigest`, and `mode-registry.json` referenced, not restated |
| Evergreen scan over deliverable | PASS — no spec path / packet / phase / ADR / REQ / task / finding ID |
| `validate.sh --strict` | PASS except the 2 expected GENERATED_METADATA errors (orchestrator regenerates `description.json` / `graph-metadata.json`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **An unmodifiable child CLI may ignore the inlined manifest.** The parent cannot force a third-party child to load the named files or honor the resolved register. The enforceable floor is parent-side only: the present-or-ASK gate at dispatch (valid manifest, else ASK) plus the return-path demand-back re-validation. A child that drops the manifest is a named residual with no deterministic guarantee.
2. **The path-resolvability ceiling forces inline carry.** codex and claude-code children cannot resolve skill paths, so the manifest MUST travel inline in the payload. Even inlined, a fully unmodifiable child that discards it is covered only by the parent demand-back floor.
3. **This phase carries and gates; it does not lint.** The static token lint and route-replay fixtures that would assert the manifest's presence and required fields in dispatch payloads are the sibling fixture phase, named as the consumer. Until that lands, enforcement is the parent-side present-or-ASK rule, not an automated check.
4. **Generated metadata is a residual at hand-off.** `description.json` and `graph-metadata.json` still need regeneration by the orchestrator after this doc sync; the strict validator's 2 GENERATED_METADATA findings are expected and are not hand-written.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
