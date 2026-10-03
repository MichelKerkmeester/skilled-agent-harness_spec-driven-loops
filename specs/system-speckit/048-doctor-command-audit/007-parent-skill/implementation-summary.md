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
    packet_pointer: "system-speckit/048-doctor-command-audit/007-parent-skill"
    last_updated_at: "2026-10-02T21:03:04Z"
    last_updated_by: "implementation"
    recent_action: "Applied the parent-skill fix: workflow contract, phase order, labels"
    next_safe_action: "None — packet closed"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/assets/doctor-parent-skill.yaml"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/commands/doctor/assets/doctor-speckit-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-parent-skill"
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
| **Spec Folder** | 007-parent-skill |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Verdict: fix.** `/doctor:speckit parent-skill` keeps its route and its two read-only checks; the fix aligns the workflow asset `.skilled/commands/doctor/assets/doctor-parent-skill.yaml` and the documentation inside `.skilled/commands/doctor/scripts/parent-skill-check.cjs` with the checks the checker actually runs, and expands the shared presentation row that describes the target.

### Phase 7: parent-skill

Before the fix, the workflow described a narrower and older contract than the checker implements. It allowed only `workflow` and `surface` packet kinds, named only `graph-metadata.json` in the nested-identity rule, ended its canon list at the playbook and benchmark checks, and ran only the parent audit in phase 0. The checker already accepts `transport` packets, rejects nested `description.json` as well, and runs leaf-manifest, root-metadata, root-router and routing-version checks; the route already listed the fleet metadata gate `ci-skill-root-metadata.cjs` before the parent audit.

The fix updates the invariant text, the phase-0 activity list, the upstream assets and the output mapping in the workflow; refreshes the checker's usage note, header and runtime label so the strict override reads as advisory-only; and expands the `parent-skill` row in `doctor-speckit-presentation.txt` to name routing manifests, root metadata, the router contract and version consistency. The audit result itself is unchanged: on this checkout the fleet gate passes 14 of 14 roots and the parent audit passes every hard invariant with 0 warnings.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/doctor-parent-skill.yaml` | Modified | The invariant now documents the `transport` packet kind, the nested `description.json` prohibition, the advisory strict override and the newer checks; phase 0 runs the fleet metadata gate before the parent audit and maps both exit codes |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | Usage note, header and runtime label now say the override covers advisory findings and list the manifest, root-metadata, router and version checks; check behavior unchanged |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modified | The `parent-skill` subsystem row now reads "Audit parent-skill structure, routing manifests, root metadata, router contract, and version consistency" |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Audited first: read the router, the route entry, the workflow, the checker and the presentation with line-numbered reads, probed every path they name, and kept one read-only run of both route-declared commands plus the route validator in `scratch/doctor-run.log`. Wrote the verdict and the four minimal edits in `scratch/proposal.md`, then applied them in one batch across the `/doctor:speckit` targets because they share `_routes.yaml`, `speckit.md` and the shared presentation file. The batch was executed by GPT-6 Luna through `cli-codex` (max, fast); the orchestrator reviewed the diff and reran the gates itself. No `--fix` flag was passed and no runtime state was written.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the route and fix the workflow contract instead of retiring the target | The route, both scripts and the audit pass on this checkout; the defect was stale descriptive text, not a broken check |
| Run the fleet metadata gate before the per-hub audit in phase 0 | The route already orders it first because it starts from `SKILL.md` and is the only check that can report a metadata file a root never wrote |
| Document the strict override as advisory-only | `PARENT_HUB_CHECK_STRICT=0` routes findings through the checker's advisory severity path; hard failures remain failures |
| Record subsystem defects as findings, not fixes | The phase changes the doctor; defects in the subsystem it inspects are reported for a later decision, and none were found here |
| Leave the route entry and the other targets' assets alone | The batch shares `_routes.yaml` and the presentation; this target changed its own workflow, checker documentation and presentation row only |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -c "import yaml; yaml.safe_load(open('.skilled/commands/doctor/assets/doctor-parent-skill.yaml'))"` | `YAML_OK` |
| `node --check .skilled/commands/doctor/scripts/parent-skill-check.cjs` | `NODE_SYNTAX_OK` |
| `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Exit 0 — `checked=14 passed=14 failed=0 fixed=0` |
| `node .skilled/commands/doctor/scripts/parent-skill-check.cjs ".skilled/skills/system-deep-loop"` | Exit 0 — "OK: parent-skill-check — all hard invariants passed, 0 warnings"; the label now reads "Advisory findings: FAIL. Hard failures always FAIL." |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0 — "OK: route-validate — 9 routes validated, 2 warnings"; J1 parity PASS. The two warnings are the informational duplicate `--scope` and `--dir` flags |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` (batch gate) | `STATUS=OK`, exit 0 |
| `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` (batch gate) | `GUARD PASS` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/007-parent-skill --strict` | `RESULT: PASSED`; Summary: Errors: 0, Warnings: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recorded findings: none in the audited subsystem.** The audit of `.skilled/skills/system-deep-loop` found no defect. The fleet gate reports 14 roots passed and 0 failed, and the parent audit reports every hard invariant passed with 0 warnings (`scratch/proposal.md:33-35`, `scratch/doctor-run.log:18-19` and `:26-75`). Per the packet decision, subsystem defects are recorded rather than fixed; none were recorded for this target.
2. **Three `parent-skill-check-*.test.cjs` suites fail in this worktree.** They fail exactly as they did before the batch because their temporary fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` here. The failure is a baseline condition of this worktree, not a regression from this change.
3. **The route validator does not verify workflow activities.** Its script-existence assertion checks `script_invocations` paths, so `route-validate.sh` passing does not by itself prove that phase 0 invokes every route script. The route's ordering comment and the workflow activity list are the evidence for that order.
4. **The recorded run predates the label edit.** `scratch/doctor-run.log:24` shows the earlier `Mode 5-9: canon (FAIL)` label. The edit is descriptive only, so the audit results recorded in that log are unaffected.

**Follow-up status.** Items 2 and 3 are resolved by `specs/system-speckit/049-doctor-audit-followups` phase 003: the fixtures pass, and `route-validate` assertion L1 checks that each route script is invoked by its workflow. Items 1 and 4 are observations.
<!-- /ANCHOR:limitations -->

---

