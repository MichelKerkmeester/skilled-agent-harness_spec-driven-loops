---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/005-embeddings"
    last_updated_at: "2026-10-02T20:54:43Z"
    last_updated_by: "implementation"
    recent_action: "Retired /doctor:speckit embeddings and recorded the audit verdict"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/assets/doctor-embeddings.yaml"
      - ".skilled/commands/doctor/speckit.md"
      - ".skilled/commands/doctor/assets/doctor-speckit-presentation.txt"
      - ".skilled/commands/doctor/scripts/route-validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-embeddings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-embeddings |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Verdict: retire.** The `/doctor:speckit embeddings` route was removed because the command it
dispatched to could no longer report what it promised: `advisor_status` returns freshness,
generation, trust state, skill count and lane weights, with no embeddings field, and the route's
own command line exits 64 without a workspace root. The router, the presentation, the route
validator's fixtures and every live documentation reference now describe the doctor that actually
exists.

### Phase 5: embeddings

The audit checked every path, command, flag and variable the route and `doctor-embeddings.yaml`
named against this checkout, then ran the safest read-only form of the command. The route's own
declaration at `_routes.yaml` called `advisor_status` without the `workspaceRoot` the CLI schema
requires, so that form exits 64; the workflow's form supplies the root but reads
`data.embeddings.provider` and `data.embeddings.modelServer`, which the strict status schema does
not define. The route validator passed structural and known-command checks but did not catch either
mismatch. Keeping the target would require a separately implemented read-only status interface
that joins provider configuration and model-server health; that interface is not in the inspected
contract, so retirement is the minimal change that makes the doctor match the current system.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/_routes.yaml` | Modified | Removed the embeddings route stanza and its trigger phrases; 9 routes remain |
| `.skilled/commands/doctor/assets/doctor-embeddings.yaml` | Deleted | The workflow that read `data.embeddings.provider` and `data.embeddings.modelServer` |
| `.skilled/commands/doctor/speckit.md` | Modified | Removed the embeddings row from the router workflow table |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modified | Removed the menu item, accepted answer, symptom line, quick-reference and confusable-pair lines, valid-target entry and manifest row |
| `.skilled/commands/doctor/scripts/route-validate.sh` | Modified | Repointed the two self-test fixtures from the embeddings target and asset to deep-loop; the parity note now reads 9 routes |
| `README.md` | Modified | Removed the `/doctor embeddings` references and changed the router target count from 10 to 9 |
| `.skilled/commands/speckit/README.txt` | Modified | Removed the "Embedder and model-server status" row that pointed at `/doctor embeddings` |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` | Modified | Removed `/doctor embeddings` from the live route list |
| `.skilled/commands/README.txt` | Modified | Removed `embeddings` from the doctor router's target list |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The verdict was applied in one batch with the other `/doctor:speckit` targets by GPT-6 Luna through
`cli-codex` (max, fast), because they share `_routes.yaml`, `speckit.md` and
`doctor-speckit-presentation.txt`. The orchestrator reviewed the diff and reran the gates itself:
`route-validate.sh` exits 0 with 9 routes and 2 warnings, every doctor YAML parses, the command
catalog mirror check returns `STATUS=OK`, the MCP mutation-class guard passes, and the doctor
script tests match their recorded baseline. No runtime state was written. This packet's documents
were then closed from the audit evidence in `scratch/`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retire the target instead of fixing it | `advisor_status` has no embeddings output to fix toward; a text-only change cannot make the strict schema return `data.embeddings`, and the interface that would is not in the inspected contract |
| Remove the live documentation references even though the phase decision scoped a retirement to the route and its workflow asset | READMEs and playbooks would otherwise advertise a command that no longer exists |
| Repoint the validator fixtures to deep-loop rather than delete the fixture blocks | Keeps the fixture count and the missing-script and target-set assertions intact |
| Keep changelogs and generated indexes untouched | They are history, not live instruction |
| Record subsystem defects as findings, not fixes | This phase changes the doctor; defects in the subsystem it inspects are reported for a later decision |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0 — "OK: route-validate — 9 routes validated, 2 warnings" (10 routes before the retirement) |
| `python3 yaml.safe_load` over every doctor asset YAML and `_routes.yaml` | `YAML_OK` for all |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | `STATUS=OK`, exit 0 |
| `check-mcp-mutation-class.sh` | `GUARD PASS` |
| Doctor script tests | `skill-advisor-route-contract.test.cjs` passes; the three `parent-skill-check-*.test.cjs` files fail exactly as before the batch because their fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree — not a regression |
| Startup menu | Shows `12) runtime mirrors` and `13) router reach`, which were accepted answers but were not displayed before |
| Removed-name scan | `rg` for `system_skill_advisor.`, `deep_loop_graph_status\|query\|convergence(` and `doctor_*` in the edited doctor files returns no matches |
| `advisor_status` contract | An orchestrator-run `advisor_status` (exit 0) returns freshness, generation, trustState, skillCount and laneWeights with no embeddings field; the route's own command line exits 64 without `--workspace-root` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/005-embeddings --strict` | `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The advisor status API has no joined embedding provider or model-server status fields.** Its current output contract is advisor graph freshness and trust data, while provider details and model health are separate surfaces. Evidence: `advisor-tool-schemas.ts:319-336`; `factory.ts:602-619,1128-1130`; `hf-model-server.cjs:45,838-853`. Recorded, not fixed.
2. **The model-server health payload does not match the object the retired workflow expected.** `/api/health` uses state, model, dim, device, load timing and error; the workflow also named dtype, healthy, serverState, loaded, baseUrl and modelServerError. Evidence: `doctor-embeddings.yaml:51-52` before deletion and `hf-model-server.cjs:838-853`. Recorded, not fixed.
3. **Live provider and model-server health is UNKNOWN.** The workflow-shaped `advisor_status` call was blocked by a sandbox IPC `EPERM`, exit 75. This is not evidence that the provider or server is unhealthy. Evidence: `scratch/doctor-run.log`. Recorded, not fixed.
4. **The presentation's generic `/doctor` forms have no matching root command files** in either checked command tree; the nested router exists and is the one in use. This is a separate doctor-surface observation, not part of the retirement. Evidence: `scratch/reality-check.md` and `scratch/proposal.md`.
<!-- /ANCHOR:limitations -->

---


