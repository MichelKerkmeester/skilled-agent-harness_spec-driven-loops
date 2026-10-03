---
title: "Implementation Summary"
description: "The /doctor:speckit fable-mode check now requires a caller-supplied deep-loop artifact directory instead of a default target that does not exist, forwards the baseline override the route always accepted, and describes itself as a metric-drift report; verdict: fix."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/006-fable-mode"
    last_updated_at: "2026-10-02T20:54:25Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the phase docs from the verified fix evidence; verdict fix, all four criteria Met"
    next_safe_action: "Review and commit the doctor change with its phase docs"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/fable-mode-check.cjs"
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/assets/doctor-fable-mode.yaml"
      - ".skilled/commands/doctor/assets/doctor-speckit-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-fable-mode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The default research corpus cannot be used as a fallback target; the artifact directory is required and the check fails by name when it is missing"
      - "The baseline flag is optional; when not supplied, the committed fable-baseline.json is used"
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
| **Spec Folder** | 006-fable-mode |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: fix.

The fable-mode diagnostic no longer pretends a default research corpus exists. It requires the caller to name a deep-loop artifact directory and fails by name when none is given, so an operator sees the missing input instead of a path that cannot exist in this checkout. The route forwards the baseline override it always accepted, and the manifest and setup prompt describe what the target really does: report metric drift against the committed baseline.

### Phase 6: fable-mode

An operator running `/doctor:speckit fable-mode` now passes the directory to inspect, either as `--dir <path>` or interactively through the added setup prompt, and gets the five behavioral metrics with their deltas against the committed baseline. The check is still read-only by contract. When the directory is missing or the argument is absent, it exits 2 with a named reason rather than resolving a fixed path beneath `.skilled` that this checkout does not contain.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/fable-mode-check.cjs` | Modified | Removed the missing default target; requires `--dir` or a positional path and exits 2 with `pass --dir <path>` when none is given |
| `.skilled/commands/doctor/assets/doctor-fable-mode.yaml` | Modified | `target_dir` is required; the execution step passes `baseline` as `--baseline`, defaulting to the committed snapshot |
| `.skilled/commands/doctor/_routes.yaml` | Modified | The fable-mode setup variables and script invocation forward the baseline override |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modified | The target row describes metric drift; added the "Fable Mode Artifact Directory" setup prompt |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna (cli-codex, max, fast) applied the fix in one batch with the other `/doctor:speckit` targets, because they share `_routes.yaml`, `speckit.md` and the presentation file. The orchestrator reviewed the diff and reran the gates itself: the fixed check exits 2 with `pass --dir <path>` when run with no arguments, `route-validate.sh` exits 0 with 9 routes validated and 2 warnings, every doctor asset YAML parses, the catalog mirror check reports STATUS=OK, and the mutation-class guard passes. The three parent-skill-check tests fail exactly as they did before the batch because their temporary fixtures cannot load the shared frontmatter parser in this worktree — a baseline failure, not a regression. Nothing is committed yet.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the missing default target instead of repointing it | The recorded corpus is absent from this checkout, and a fixed default hides a caller's mistake; the check now names the missing input |
| Forward `baseline` through the route setup variables and invocation | The flag was accepted and documented but never reached the script, so the override was unreachable |
| Require `target_dir` in the workflow and add an interactive setup prompt | The router promises per-target prompts for unresolved setup values; the prompt asks for the artifact directory only when it was not supplied |
| Describe the target as metric drift | The workflow calls the metrics drift detectors, not quality scores; the manifest row previously implied review-quality scoring |
| Record the stale baseline source path as a finding | The baseline snapshot belongs to the inspected subsystem; the phase records defects there rather than fixing them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/commands/doctor/scripts/fable-mode-check.cjs` (no arguments, final state) | exit 2, `STATUS=ERROR fable-mode: pass --dir <path>` |
| `node .skilled/commands/doctor/scripts/fable-mode-check.cjs --dir ""` before the fix (`scratch/doctor-run.log`) | exit 2, `target not found: .../002-fable-mode-efficiency-research/research` (the missing default) |
| `node --check .skilled/commands/doctor/scripts/fable-mode-check.cjs` | NODE_CHECK_OK |
| `python3 yaml.safe_load` on every doctor asset YAML and `_routes.yaml` | YAML_OK |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | exit 0, `OK: route-validate — 9 routes validated, 2 warnings`; J1 router/manifest/presentation parity PASS |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | STATUS=OK, exit 0 |
| `check-mcp-mutation-class.sh` | GUARD PASS |
| Doctor script tests | `skill-advisor-route-contract.test.cjs` passes; the three `parent-skill-check-*.test.cjs` fail identically to baseline (their fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree) |
| Grep for retired routing symbols in the edited doctor files | no matches |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <phase> --strict` | RESULT: PASSED (Errors: 0, Warnings: 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recorded finding, not fixed: the baseline snapshot points at a corpus that is gone.** `fable-baseline.json:2` records an absolute path under `.opencode/specs/skilled-agent-orchestration/144-operate-like-fable-5/002-fable-mode-efficiency-research/research`; `ls -ld` on that path exits 1 and a directory-name search returns no match. The snapshot still holds aggregate metrics at `fable-baseline.json:90-98` that the wrapper reads and compares against, but those values cannot be reproduced from the raw corpus in this checkout.
2. **No live corpus run.** No deep-loop artifact corpus exists in this checkout, so the observed runs exercised only the missing-input paths; the metric rendering and delta rows against a real corpus were not verified in this phase.
3. **Running without a directory is now an error by design.** An operator who omits `--dir` gets exit 2 and `pass --dir <path>`; the added setup prompt covers the interactive router flow.
4. **The three parent-skill test failures are environmental.** They fail at baseline in this worktree for a fixture-loading reason unrelated to this phase's change and are not a regression.

**Follow-up status.** Items 1 and 4 are resolved by `specs/system-speckit/049-doctor-audit-followups` phase 003: the baseline target is null with a retirement note, and the fixtures link `@spec-kit/shared`. Items 2 and 3 stand as recorded: no corpus exists, and the missing-directory error is by design.
<!-- /ANCHOR:limitations -->

---

