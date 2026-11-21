---
title: "Implementation Summary"
description: "The doctor commands no longer offer, run or describe the embedder route. /doctor:skill-advisor has six targets, /doctor:setup six legs, and the install docs no longer walk a user through pulling a model."
trigger_phrases:
  - "doctor surface implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/024-ollama-lane-removal/002-doctor-surface"
    last_updated_at: "2026-11-21T00:04:37Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented and verified phase 002"
    next_safe_action: "Run /speckit:implement on 003-lane-feeders"
    packet_purpose: "Purpose: No doctor file and neither install doc names the embedder route or passes the semantic-health flag, and every doctor gate stays as green as phase 001 recorded it."
    blockers: []
    key_files:
      - "002-doctor-surface/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:005f93e9be39b83f63046f675210746a58381aade16be434776284e4746f129c"
      session_id: "scaffold-002-doctor-surface"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/497-ollama-lane-removal"
      savedAt: "2026-11-21T00:04:37Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
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
| **Spec Folder** | 002-doctor-surface |
| **Completed** | 2026-11-21 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A user can no longer reach the lane through a doctor command. The `/doctor:skill-advisor embedder` route, its workflow, the setup leg that probed semantic health and the install steps that pulled an Ollama model are gone, and the residue check's live count fell from 309 to 283.

### Phase 2: doctor-surface

`/doctor:skill-advisor` now lists six targets and `/doctor:setup` runs six legs. The install, overlay, symlink and update workflows no longer pass `--include-semantic-health` or describe the route. The two embedder rows left `scoring-compatibility.json`, and the generator rewrote the four bridge outputs from it. The operator cost script for the embedder went with the route.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/_routes.yaml` | Modified | Embedder route block removed |
| `.skilled/commands/doctor/assets/doctor-skill-advisor-embedder.yaml` | Deleted | The route's workflow |
| `.skilled/commands/doctor/skill-advisor.md`, `setup.md` and 11 workflow and presentation assets | Modified | Route, leg and flag mentions removed |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` and two contract tests | Modified | Embedder rows and their 5 cases removed |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `lib/scorer/projection.ts`, `scripts/skill_advisor.py` | Modified | Embedder route ids dropped from the command tables |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json` | Modified | Two embedder rows removed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerated | Generator output, 35 doctor routes |
| `.skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs` | Deleted | Cost script with no remaining caller |
| `.skilled/skills/system-skill-advisor/runtime/scripts/README.md` | Modified | Its row and paragraph |
| `INSTALL-SKILLED.md`, `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md` | Modified | Model pull and route steps removed, sections renumbered |
| `.skilled/skills/system-skilled-doctor/README.md` | Modified | Setup check count seven to six |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus worker made the edits in `tasks.md` order on top of `35983033f76`, ran the generator after the route and compatibility rows were gone, and ran each gate. The conductor added the doctor README count fix the worker found, then sent the diff to a read-only review before the commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One commit for the route, displays, install steps, tests and regenerated bridges | A route removed without its bridge rows fails the bridge freshness check |
| The orphan check's model-server class stays until phase 005 | The server it watches still exists until that phase deletes it |
| Delete the cost script here | Nothing on the advisor's prompt, daemon or status path loads it; its only purpose was the route |
| Keep the presentations' closing line | It predates the embedder section and closes every doctor presentation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` (advisor `runtime/`) | exit 0 |
| `npm run clean && npm run build` (advisor `runtime/`) | exit 0 |
| `npm test` (advisor `runtime/`) | exit 0: 196 files, 2568 passed, 8 skipped. Two fewer than baseline because `command-head-length.vitest.ts` builds one case per command-table entry and each table lost the embedder entry |
| `bash .skilled/commands/doctor/scripts/tests/run-all.sh` | 7 suites passed; node:test total 1422 to 1417, the 5 deleted embedder cases |
| `derive-command-bridges.cjs --check` | exit 0, fresh: doctorRoutes 35, generated 62, typescriptActive 46, pythonActive 52 |
| `check-markdown-links.cjs` | exit 0, 15275 links, 0 broken |
| Advisor leaf manifest check | OK |
| `sweep-lane-residue.mjs repo` | exit 1: 310 files, 27 allowlisted, 283 live (was 309) |
| Lane-word grep over `.skilled/commands/doctor` | prints only `orphan-process-check.cjs` and its test, kept until phase 005 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`command-routing-baseline.json` still records the old bridge counts (36, 63, 47, 53).** No test asserts them; phase 007, which owns generated surfaces, recaptures it.
2. **The v4.1.0.0 changelog still names the route and the leg.** Phase 006 rewrites the changelogs.
3. **The orphan check still reports model-server processes.** Phase 005 removes that class with the server.
<!-- /ANCHOR:limitations -->
