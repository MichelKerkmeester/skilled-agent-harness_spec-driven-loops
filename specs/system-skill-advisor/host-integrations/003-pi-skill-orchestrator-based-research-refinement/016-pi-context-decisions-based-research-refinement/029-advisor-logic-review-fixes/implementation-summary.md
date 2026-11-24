---
title: "Implementation Summary"
description: "A one-skill graph scan no longer wipes the rest of the graph, the advisor checks who owns a socket or temp folder before it trusts it, and the scorer's TypeScript and Python twins now read the same cases the same way. All 19 findings of the advisor logic review are fixed, with gates green against the captured baseline."
trigger_phrases:
  - "advisor logic review fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/029-advisor-logic-review-fixes"
    last_updated_at: "2026-11-24T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Landed all 13 work units and ran the full gate set green against the baseline"
    next_safe_action: "Finish the two verification review passes, then commit and land"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/owned-private-dir.ts"
      - ".skilled/bin/lib/launcher-ipc-bridge.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-advisor-logic-review-fixes |
| **Completed** | 2026-11-24 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A `skill_graph_scan` pointed at one skill folder used to delete every other skill from the live graph. It now deletes only nodes whose stored source lies under the folder it scanned. The advisor also checks ownership before it trusts a shared path. A socket or a temp-folder store that belongs to someone else, is open to others, or has a symlink planted at its name is refused, and the write is skipped instead of throwing.

### Fix every finding of the twelve-pass deep review of the system-skill-advisor logic

The review left 3 P1 and 16 P2 findings. The three P1s were the scan wipe, sockets used without an ownership check, and a metrics store that followed symlinks in a shared temp folder. They are fixed at their producers, and so is each sibling of the same class: the shadow sink, the feedback-calibration store, the route receipt and the session-proxy reattach path. The scorer's predicate fixes land in TypeScript and in the Python fallback together, and one shared fixture holds both to the same answers. The dead supersession, rollback and backfill code is gone, with its catalog and playbook entries. The comments and docs that claimed a fail-closed trust default now describe the launcher's trusted default as it is.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/skill-graph/skill-graph-db.ts`, `tools/skill-graph-tools.ts` | Modified | Delete only nodes under the scanned root. Build edge targets from every known skill id. |
| `runtime/skill-advisor-cli.ts` | Modified | Check socket ownership before connecting. Print `deletedNodes` in scan text output. |
| `.skilled/bin/lib/launcher-ipc-bridge.cjs`, `launcher-session-proxy.cjs` | Modified | Shared socket ownership check, also run before a reattach replays pending prompts. |
| `runtime/lib/owned-private-dir.ts` | Created | One owner, mode and symlink check for private folders. |
| `runtime/lib/metrics.ts`, `shadow/shadow-sink.ts`, `scorer/feedback-calibration.ts`, `hooks/lib/route-receipt.ts` | Modified | Use the shared check. Open files without following symlinks. Skip a refused write. |
| `runtime/lib/scorer/fusion.ts`, `ambiguity.ts`, `types.ts`, `runtime/scripts/skill_advisor.py` | Modified | Typed slash command recognition, RRF rescale, holder tracking, doctor-free ambiguity, stop-word token count, `review` as task intent. |
| `runtime/lib/policy-plan.ts`, `lib/freshness/generation.ts` | Modified | Record a diagnostic when the Gate-3 list fails to load. Re-read a lock before reclaiming it. |
| `hooks/pi/prompt-advisor.ts`, `schemas/advisor-tool-schemas.ts` | Modified | Comments naming the parity test that pins the cap and budget. |
| `runtime/lib/lifecycle/supersession.ts`, `schema-migration.ts` | Deleted | Dead code with no production caller. `rollback.ts` lost `rollbackGraphMetadataFile`. |
| Advisor catalog and playbook, `leaf-aliases.json`, `leaf-manifest.json` | Modified and deleted | Three catalog and two playbook entries removed, counts updated, leaf files regenerated. |
| `advisor-server.ts`, tools headers, `SKILL.md`, references, READMEs, spec-kit `ENV-REFERENCE.md`, `.env.example` | Modified | Trust-default wording matches the code. |
| New tests: `owned-private-dir`, `skill-advisor-cli-socket-ownership`, `scorer-predicate-cases`, `score-stage-order`, `python-ts-constant-parity`, `policy-plan-gate-owner-load` | Created | Each failed before its fix. |
| `scripts/routing-accuracy/command-routing-baseline.json` | Modified | One row recaptured: "review my PR" now reaches its gold label `sk-code`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Eight read-only design passes wrote one design per fix area. A Luna xhigh skeptic and a completeness critic then corrected the designs before any edit. Thirteen work units ran as parallel cli-codex Luna xhigh fast dispatches in two waves. The shared owner check, the socket check and the stage-order test landed first. Each unit owned a fixed file list, and each diff was checked against it. When the Codex quota ran out mid-way through the last docs unit, the operator moved it to cli-pi DeepSeek Flash max, split into eleven one-change briefs, plus two follow-up briefs for an inventory count and a link label. Socket tests that the Codex sandbox blocks were rerun outside it. The full gate set then ran against the baseline captured at `52f0bcb9a98`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Narrow scans delete only nodes under their root | A scan of one skill must not erase what it never looked at. |
| Keep the launcher's trusted default and fix the docs | The default is deliberate. The owner-only socket is the access boundary, so the wrong part was the wording. |
| Trim the lifecycle stress file instead of deleting it | Its `sa-014` and `sa-016` cases are the only tests of the live age multipliers. |
| Add `review` to the task-intent words | The stop-word fix would otherwise move "auto review this PR" off `sk-code` and break a ratchet. |
| Pin `scoreAdvisorPrompt` with a stage-order test, do not split it | A characterization test protects the order at a fraction of a refactor's risk. |
| Recapture one command-routing baseline row | The row moved from a wrong route to its gold label, so the recapture records an improvement. |
| Run the last docs unit on DeepSeek Flash | The Codex quota ran out, and the operator chose DeepSeek over waiting. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor typecheck and clean build | PASS, exit 0 |
| Advisor suite | PASS, 186 files, 2818 passed, 4 skipped. Baseline 180 files, 2738 passed. |
| Routing ratchets | PASS, 7, 9 and 6 passed, corpus exit 0, all at baseline |
| Advisor stress | PASS, 21 files, 62 passed. Baseline 65, minus the 3 trimmed lifecycle cases. |
| Python tests | PASS, including the new predicate parity check (cases=24) |
| Doctor, bridges, links, leaf, mirrors | PASS: 7 suites, fresh, exit 0, OK, 260 mirrors |
| Catalog and playbook validators | PASS, 0 violations, 53 scenarios, 0 warnings |
| Spec-kit typecheck and launcher suites | PASS, 55 of 55 launcher tests outside the sandbox |
| Unused-import delta typecheck | 34 errors, same as the baseline, none in lifecycle files |
| Comment hygiene over 49 changed code files | PASS, exit 0 |
| Trust residue grep | Hits on every target file before, zero target-line hits after |
| Lifecycle residue grep | Zero hits, rg exit 1 |
| One-skill scan on a database copy | 15 nodes and 59 edges kept, 0 deleted. Before the fix: 1 node, 0 edges. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Some dead code remains.** `lib/compat/redirect-metadata.ts`, `sanitizeEnvelopeSkillLabel`, `filterDefaultRoutable` and `rollbackDerivedBlock` have no production caller. They stayed out of scope because the deletion decision named four functions only.
2. **The CI hook path filter is not updated.** The new parity tests run in the full suite, but the workflow path filter that would trigger them on a hook-only change lives in a workflow file outside this packet.
3. **A hand-rolled IPC client can still assert its own trust.** This is by design. The owner-only socket is the boundary, and the docs now say so.
<!-- /ANCHOR:limitations -->

---
