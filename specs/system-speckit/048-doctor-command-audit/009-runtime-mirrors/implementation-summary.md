---
title: "Implementation Summary"
description: "Fix verdict for `/doctor:speckit runtime-mirrors`: the route invokes both Pi checkers, the Codex hooks check runs with the worktree allowance, the workflow runs the command-catalog checker and defines an error result, and the target is visible in the startup menu."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/009-runtime-mirrors"
    last_updated_at: "2026-10-02T16:10:22Z"
    last_updated_by: "doc-closure"
    recent_action: "Closed the phase documentation for the applied runtime-mirrors fix"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - "scratch/reality-check.md"
      - "scratch/doctor-run.log"
      - "scratch/proposal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-runtime-mirrors"
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
| **Spec Folder** | 009-runtime-mirrors |
| **Status** | Complete |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: fix. The route and its workflow disagreed about what the diagnostic runs, the Codex hooks check could not anchor in a linked worktree, and the workflow had no result state for a check that refuses or returns without an affirmative answer. The applied fix aligns the route invocations with the workflow inventory, allows the hooks check to run in this worktree, adds the command-catalog checker to the workflow, defines `STATUS=ERROR`, and shows the target in the startup menu. Evidence: `scratch/reality-check.md`, the read-only runs in `scratch/doctor-run.log`, and the verdict and applied edits in `scratch/proposal.md`.

### Phase 9: runtime-mirrors

`/doctor:speckit runtime-mirrors` checks that each runtime mirror agrees with its source: the runtime, Codex and Pi agent, command and prompt trees, the agent roster, the command catalog, the 64 hook adapter paths and the user-global Codex hooks file. An operator runs it after touching a generator or a mirrored directory, or when a hook seems to fall back. The workflow now runs every checker its own inventory declares, and a checker that refuses or cannot complete is an error rather than a silent pass. The route lists both Pi checks, so the invocation list and the workflow no longer disagree about the checker set.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/_routes.yaml` | Modified | Added the two Pi checker invocations and the `--allow-worktree` flag on the Codex hooks check |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modified | Added the command-catalog asset and execution step; aligned the action with the declared checker inventory; defined `STATUS=ERROR` |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modified | Showed `12) Check runtime mirrors` in the startup menu and the help block |
| `scratch/reality-check.md`, `scratch/doctor-run.log`, `scratch/proposal.md` | Created | Phase evidence: inventory, read-only runs, verdict and the applied edits |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Audit first: the phase inventoried every path, script, command, flag and variable the route and workflow name, ran the full checker set read-only, and tested all 64 hook adapter paths individually. The verdict was fix. The three target files were edited in one batch with the other doctor targets that share `_routes.yaml`, the router text and the presentation contract, and the orchestrator reviewed the diff and reran the gates. Delivery is a working-tree change, not a commit. Verification reran the route validator, the YAML parse, the command-catalog mirror check and the MCP mutation-class guard, and read the startup menu.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Align the route with the workflow instead of trimming the workflow | The workflow already declared both Pi checkers and ran them; the route simply omitted them, so the invocation list was completed |
| Pass `--allow-worktree` rather than skipping the hooks check | The installer's `--check` path returns before any write; its worktree guard was the only obstacle to a read-only parity check in this worktree |
| Add the command-catalog checker to the workflow rather than removing it from the route | The route already invoked it and the checker exists and reports clean; the workflow was the side missing it |
| Define `STATUS=ERROR` for refusals and checker errors | A disabled installer can return exit 0 with no output, and a refusal is not an in-sync result; the contract now names the third state |
| Record subsystem defects instead of fixing them | The findings are observations about the mirrors and the installer guard, and the packet decision keeps them as findings |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | exit 0 — `OK: route-validate — 9 routes validated, 2 warnings`; `PASS: J1` parity and `PASS: I1` script resolution, rerun after the batch |
| `python3 yaml.safe_load` over every doctor asset YAML and `_routes.yaml` | `YAML_OK` |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | `STATUS=OK`, exit 0 |
| `check-mcp-mutation-class.sh` | `GUARD PASS` |
| Doctor script tests | `skill-advisor-route-contract.test.cjs` passes; three `parent-skill-check-*.test.cjs` fail exactly as the pre-batch baseline (their fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree) — not a regression |
| Startup menu check | Shows `12) Check runtime mirrors` and `13) Check router reach`; the help prompt reads `Press 1-2, 6-13, H, 0, or X.` |
| Retired-identifier sweep | `rg` for `system_skill_advisor.`, `deep_loop_graph_status\|query\|convergence(` and `doctor_*` in the edited doctor files returns no matches |
| Read-only checker set (`scratch/doctor-run.log`) | Runtime mirrors 172 across 8 trees in sync; Codex and Pi agent and prompt checks pass; roster 12/12 on five surfaces; command catalog in sync; all 64 adapter paths present; the Codex hooks check refused at its worktree guard (exit 1) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recorded finding: no runtime mirror or catalog defect was confirmed.** Every check that completed reported in sync: the mirror checker reports 172 mirrors across 8 trees, the Codex and Pi agent and prompt checks pass, the roster is 12/12 across all five surfaces, the command catalog reports every listed catalog and metadata set in sync, and all 64 adapter paths exist (`scratch/doctor-run.log`).
2. **Recorded finding: user-global Codex hook parity is unverified, not a confirmed defect.** `~/.codex/hooks.json` exists, but the check stopped at the linked-worktree guard before comparing its contents (`scratch/doctor-run.log:45-47`). The route now passes `--allow-worktree`, which is the path to that comparison.
3. **Repair commands were not run.** The write-producing repair commands and the package build were recorded as skipped by the read-only audit (`scratch/doctor-run.log:457-487`).
4. **Three doctor test fixtures fail in this worktree, as before the batch.** `parent-skill-check-*.test.cjs` cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` inside a temporary fixture; this matches the pre-batch baseline and is not a regression.

**Follow-up status.** Item 4 is resolved by `specs/system-speckit/049-doctor-audit-followups` phase 003. Item 2 stands: user-global Codex hooks live outside the repository and need the operator's own check. Items 1 and 3 are observations.
<!-- /ANCHOR:limitations -->

---


