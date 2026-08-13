---
title: "Implementation Summary: Injection Contract Directive Sync"
description: "Completed summary for synchronizing the three shared advisor directives, canonical ownership, OpenCode fallback parity, and Pi-only directive ownership in the injection contract."
status: complete
completion_pct: 100
trigger_phrases:
  - "injection contract sync summary"
  - "directive ownership status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/009-injection-contract-directive-sync"
    last_updated_at: "2026-08-11T06:43:17.298Z"
    last_updated_by: "pi-phase-009-implementation"
    recent_action: "Completed contract synchronization; Phase 008 reconciled the parent packet metadata"
    next_safe_action: "Preserve the uncommitted-state freshness caveat; no Phase 009 source or contract work remains"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/hooks/injection-contract.md"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:c7e7914c4e16ce9cf20f481eceafe2dccbefe69e8c7b03d389acae85dac242d3"
      session_id: "2026-08-05-cli-038-009-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Injection Contract Directive Sync

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-injection-contract-directive-sync |
| **Status** | Complete; scoped contract synchronization verified |
| **Completion** | 100% scoped implementation; parent packet is Complete after Phase 008 reconciliation |
| **Level** | 2 |
| **Predecessor** | 008-phase-state-reconciliation |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase synchronizes the durable Skill Advisor Brief entry in `injection-contract.md` with the live sources. The contract now names the three fixed shared directives (comment hygiene, governor, proof-over-appearance), identifies `render.ts` as their canonical owner, documents the OpenCode bridge as the parity-preserving fallback emitter, and records the per-runtime channels. It also distinguishes Pi's role: `prompt-advisor.ts` forwards the shared brief and owns the Pi-only `PI_SUBAGENT_DISPATCH_DIRECTIVE` appended in the visible input transform. Phase 009 modified no advisor source, bridge source, runtime adapter, test, README, or other phase; source paths with prior working-tree changes remain read-only and are called out in the handoff.

### Baseline and Drift

The pre-edit contract already contained the three shared directive names and the model-agnostic governor wording from the existing working-tree parity update. Its missing contract surface was the Pi-only directive ownership/role; the safe negative control confirmed `PI_SUBAGENT_DISPATCH_DIRECTIVE` and `Pi subagent dispatch` were absent. The render core, OpenCode bridge, and Pi adapter source scans were green before editing, so the change stayed documentation-only.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/hooks/injection-contract.md` | Modified | Adds the proof sample prefix, canonical render ownership, OpenCode fallback parity, accurate channels, and Pi-only ownership/forwarder role. |
| `spec.md` | Updated | Records the completed scoped state, defining-module wording, Pi-only ownership requirement, and final objective command set. |
| `tasks.md` | Updated | Records baseline, final grep/test evidence, rollback boundary, and Phase 008 handoff. |
| `checklist.md` | Updated | Marks scoped contract/ownership/channel gates with command-backed evidence; strict-validator row is reported separately. |
| `implementation-summary.md` | Updated | Records the implementation, receipts, residual parent-validator blocker, and dirty-worktree caveat. |
| `description.json`, `graph-metadata.json` | Regenerated in the packet-wide final metadata pass | Refreshes generated synopsis, source hashes, and derived status for this child folder. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation re-read the live contract and all three read-only source authorities, captured the baseline greps and the expected-missing Pi-only negative control, then changed only the Skill Advisor Brief entry. The contract sample keeps the authoritative prefixes illustrative, while the ownership rows name constants and paths rather than creating a second source of truth. Final source/contract greps, safe negative controls, the bridge regression test, and the link self-test were run after the edit. Phase 009 source and contract scope remain unchanged by the packet-state repair; Phase 008 regenerated packet metadata afterward. The bridge and Pi source files were already dirty from earlier packet work and were not edited in this phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `render.ts` the canonical owner of the three shared directives | The contract names constants and ownership; it does not republish the full directive text. |
| Document the OpenCode bridge as a fallback emitter, not a competing authority | The bridge mirrors all three constants locally and loads the canonical renderer when compiled output is available. |
| Mark `prompt-advisor.ts` as shared-brief forwarder and Pi-only owner | Pi forwards `additionalContext` from the shared hook and separately appends `PI_SUBAGENT_DISPATCH_DIRECTIVE` in its visible transform. |
| Preserve the existing working-tree parity wording | Phase 009 adds the missing ownership/role documentation without undoing earlier bridge, enforcement, or evidence changes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-edit contract baseline | PASS, exit 0 — shared comment-hygiene, governor, and proof-over-appearance names were present; expected negative control confirmed the Pi-only ownership row was absent before the edit. |
| Read-only source inventory | PASS, exit 0 — `render.ts` lists all three constants and compositions; the bridge lists the same three fallback constants and canonical-loader path; Pi lists its own constant and transform append. |
| Final directive-presence greps | PASS, exit 0 each — comment-hygiene, governor, and proof-over-appearance contract scans matched the Skill Advisor Brief entry. |
| Canonical owner and OpenCode fallback scans | PASS, exit 0 — contract names the full `render.ts` owner path/function/constants and bridge fallback; source scans confirm parity. |
| Per-runtime and Pi-only ownership scans | PASS, exit 0 — `[SYS]`/`[MSG]` channels, `experimental.chat.system.transform`, Pi forwarder role, and `PI_SUBAGENT_DISPATCH_DIRECTIVE` ownership all match source behavior. |
| Safe negative controls | PASS, exit 0 as expected — shared constants are absent from `prompt-advisor.ts`, and the Pi-only constant is absent from render/bridge; stale `Fable-5` wording is absent. |
| Bridge regression test | PASS, exit 0 — `node --test .opencode/plugins/tests/mk-skill-advisor.test.cjs` reports 14/14 tests passed. |
| Markdown-link self-test and target check | PASS, exit 0 — link self-test reports all cases passed; `skill-advisor-hook.md` target exists. |
| Phase strict validation | **PASS with explicit freshness caveat**, command exit 2 — final output reports `Errors: 0`, `Warnings: 1`, every structural rule passes, and the sole disposition is `CONTINUITY_FRESHNESS: packet paths have uncommitted changes`; this warning is reported separately because the task must not commit. |
| Parent recursive strict validation | Final packet run exits 2 because nine child `CONTINUITY_FRESHNESS` warnings remain; parent reports `Errors: 0, Warnings: 0, RESULT: PASSED`, every child reports `Errors: 0`, and no structural/integrity error remains. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The contract is documentation-only; directive enforcement remains owned by the existing advisor hook chain and Pi dispatch boundary. No source/test behavior changed here.
2. Grep assertions prove names, paths, and source presence, not full semantic equivalence of surrounding prose; the final review also read the live contract entry and source transforms.
3. The Phase 009 child metadata is refreshed after the final documentation evidence; packet-wide parent and child metadata reconciliation remains owned by Phase 008.
4. Parent recursive strict validation is structurally clean after Phase 008's packet-wide repair; any remaining exit-2 disposition is the uncommitted-state `CONTINUITY_FRESHNESS` warning, not a metadata-integrity error.
5. The working tree is intentionally dirty and cannot be committed by this task; any Phase 009 completion-freshness warning caused by uncommitted scoped paths is reported separately from the source/contract verification results.

### Rollback boundary

Revert only `.opencode/hooks/injection-contract.md` and the Phase 009 authored/generated artifacts. Do not revert or modify `render.ts`, the OpenCode bridge, `prompt-advisor.ts`, Phase 006/007 enforcement/evidence files, or parent/other-phase metadata.
<!-- /ANCHOR:limitations -->
