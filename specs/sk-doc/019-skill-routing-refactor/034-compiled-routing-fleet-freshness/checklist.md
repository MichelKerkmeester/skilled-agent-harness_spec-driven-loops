---
title: "Verification Checklist: Compiled-Routing Fleet Freshness Repair"
description: "Verification checklist for the compiled-routing fleet freshness repair."
trigger_phrases:
  - "fleet freshness verification checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/034-compiled-routing-fleet-freshness"
    last_updated_at: "2026-07-30T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored packet from live guard evidence"
    next_safe_action: "Re-mint the four stale hubs first"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-compiled-routing-fleet-freshness"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Compiled-Routing Fleet Freshness Repair

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is marked complete only with evidence specific to that item. Evidence text is never reused across items.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The guard verdict was re-confirmed against all three environments before any change [evidence: `compiled-route-guard.cjs` re-run by exit code before each phase: pre-fix (3x compile-error), post-fix pre-mint (4x authored-drift + 3x inputs-do-not-compile), post-mint (all seven fresh); worktree, primary tree via same tracked tools, and live CI (run 30564608871)]
- [x] CHK-002 [P1] The routing-gate baseline was captured before the first re-mint [evidence: T-02 baseline captured before any re-mint: capture pins 151/195, 13, 5, 53/72, 17/24, buckets 24/31 27/32 10/11 — post-ceremony capture matched every pin exactly]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P1] Changes stay within routing inputs, regenerated manifests, and this packet's docs — no engine/compiler/guard code touched [evidence: shipped engine, compiler, guard, and sync under .opencode/bin and 014-runtime-engine untouched; deviation recorded per the deliberate-exceptions row: the sibling program's canary infrastructure (never-committed shared modules, one worktree-hostile path resolve, two committed-red validator/replay defects) had to be repaired for any ceremony to run — rationale in `ceremony-deltas.md`]
- [x] CHK-004 [P2] No ephemeral artifact label appears in any code comment or authored input [evidence: new/edited code comments carry durable-why only (verified on shared modules, replay driver, canary validators, policy-card); no spec paths or packet ids added]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-005 [P0] Every gate was run by exit code, not by reading tail output [evidence: canary vector, guard, corpus gate, vitest suites, sync verify/finalize all checked via $? — evidence lines in tasks.md T-06..T-08]
- [x] CHK-006 [P1] Each compile failure's real exception was captured before its fix landed [evidence: the three compile failures' real exceptions were captured under the tool boundary before fixes (cli-pi missing fixture entry, sk-prompt pre-rename paths, sk-doc stale supplemental bundle-rule ids) — recorded in T-05 with each hub's exception captured under `node` before the fix landed]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-007 [P0] Every requirement in spec.md section 4 has a matching evidence line [evidence: REQ evidence rows in tasks.md T-01..T-08 cover spec section 4; zero-movement satisfied by exact pin match (151/195 full, 53/72 holdout)]
- [x] CHK-008 [P1] Anything deliberately not done (e.g. an engine-defect escalation) is recorded with a reason [evidence: deliberately not done: no engine-defect escalation needed (all failures were input/packet-side); the shadow-era activate-hub driver was deliberately NOT used for re-mint (CAS correctly refuses graduated hubs — precedent lane e215751429c used instead); consumption vitest suite not gated (env-only @opencode-ai/plugin import, outside CI's gate)]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-009 [P2] No credential, token or absolute personal path enters a committed artifact [evidence: committed artifacts are digests, manifests, fixtures, and code — grep for /Users/ and tokens over the three ceremony commits returned nothing]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-010 [P1] Status and completion fields agree with what the evidence supports [evidence: status flipped to Complete only after guard green + exact gates + CI pass (`gh run view 30564608871` green)]
- [x] CHK-011 [P2] Continuity frontmatter reflects the packet's real state at close [evidence: continuity frontmatter updated at close in implementation-summary.md]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-012 [P2] Artifacts live under this packet folder and follow the naming convention [evidence: packet artifacts live in this folder; ceremony evidence lives in the sibling program packet it repairs (ceremony-deltas.md), referenced not duplicated]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-013 [P0] `validate.sh <folder> --strict` reports Errors:0 [evidence: validate.sh --strict run at close: Errors:0 (see implementation-summary validation section)]
- [x] CHK-014 [P0] No completion claim outruns its evidence [evidence: T-09 CI evidence recorded only after `gh run watch 30564608871` exited 0]
- [x] CHK-015 [P1] Each item above carries evidence unique to itself [evidence: each row above cites its own command, file, or run id — 15/15 rows distinct]
<!-- /ANCHOR:summary -->
