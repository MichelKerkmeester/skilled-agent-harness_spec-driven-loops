---
title: "Implementation Summary: command-template conformance across all seven OpenCode command families"
description: "Implementation summary for conforming create/design/doctor/memory/speckit/prompt-improve/goal_opencode command docs to the sk-doc create-command canon — behavior-preserving, validate_document.py --type command clean, shipped across two commits."
trigger_phrases:
  - "command template conformance summary"
  - "create-command router vocabulary implementation"
  - "doctor header fix evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/001-command-template-conformance"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Command-family conformance shipped and validated 0/0"
    next_safe_action: "Orchestrator runs validate.sh --strict on this child, then rolls up the parent 138 packet"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/mcp.md"
      - ".opencode/commands/doctor/speckit.md"
      - ".opencode/commands/doctor/update.md"
      - ".opencode/commands/prompt-improve.md"
      - ".opencode/commands/memory/save.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Direct-dispatch families use presentation-only OWNED ASSETS; no workflow YAML authored."
      - "Behavior preservation proven by a reference-set diff, not visual review."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-command-template-conformance |
| **Completed** | 2026-07-14 |
| **Level** | 2 |
| **Status** | Complete |
| **Commits** | `95b5a60240` (doctor family P0), `52d17a8075` (create/design/memory/speckit/prompt-improve, 23 files, +442/-404) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All seven OpenCode command families were conformed to the sk-doc `create-command` canon: the uniform six numbered H2 router sections `## 1. ROUTER CONTRACT / ## 2. OWNED ASSETS / ## 3. MODE ROUTING / ## 4. EXECUTION TARGETS / ## 5. PRESENTATION BOUNDARY / ## 6. WORKFLOW SUMMARY`. Section STRUCTURE is uniform across all families; ASSETS follow dispatch class.

### P0 Remediation (INVALID → VALID)

Two families FAILED `validate_document.py --type command` before this work:
- `doctor/{mcp,speckit,update}.md` used UNNUMBERED headers, so the validator detected zero sections — two blocking errors each, exit 1. Conformed to the numbered six-section router-core while keeping the subsystem-dispatch model and `_routes.yaml`. Fixed in commit `95b5a60240`.
- `prompt-improve.md` was a single fat monolith missing a required leaf section, exit 1. The missing required leaf section was added and headers numbered. Fixed in commit `52d17a8075`.

### Canon Vocabulary Sweep

The remaining families PASSED the validator but carried canon drift, resolved in commit `52d17a8075`:
- `create/*` (10 files): Title-case sections (`Routing Assets`, `Routing Rules`) renamed to the canonical six-section vocabulary; the `_auto`/`_confirm`/`_presentation` triad retained.
- `memory/*` (4 files): banned-synonym headers (`ROUTING ASSETS`, `WORKFLOW ROUTING`) replaced with canon.
- `speckit/{complete,implement,plan}.md` (3 files) and `design/*` (5 files): inserted sections folded / renumbered to a clean 1-6 where recommended-section warnings remained; workflow-YAML triads retained.
- `goal_opencode.md` and `speckit/resume.md` were already conformant — unchanged.

### Dispatch-Class Asset Model (Fable-adjudicated)

Section STRUCTURE is uniform, but ASSETS diverge by dispatch class:
- **Workflow-YAML families** (`create`, `design`, `speckit`): OWNED ASSETS names the existing `_auto`/`_confirm`/`_presentation` triad; dispatch model unchanged.
- **Direct-dispatch families** (`memory`, `doctor`): OWNED ASSETS is presentation-only; EXECUTION TARGETS points at the script/tool/route manifest (doctor keeps `_routes.yaml`). No `_auto`/`_confirm` workflow YAML was authored for these families — the canon forbids it.

### memory/save.md Gap Correction

`memory/save.md` previously mis-declared the (correct) absence of workflow YAML as a "Missing upstream asset". That mis-framing was replaced with a plain by-design statement: a direct-dispatch command has no workflow YAML by design.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Source-first, behavior-preserving conformance: remediate the two validator-failing families first (P0), then sweep canon vocabulary across the rest, then verify each file with `validate_document.py --type command` and a per-file reference-set behavior diff. Landed across two commits (`95b5a60240` for the doctor P0, `52d17a8075` for the 23-file remainder).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two asset variants keyed on dispatch class | Forcing `_auto`/`_confirm` YAML onto memory/doctor would author canon-forbidden assets; direct-dispatch families legitimately have no workflow YAML. |
| P0 families first, then vocabulary sweep | The doctor/prompt-improve validator failures (exit 1) are hard blockers; the recommended-section warnings are drift, not failures. |
| Behavior preserved by reference-set diff | Renumbering/renaming sections risks altering dispatch prose; the diff proves parity rather than relying on visual review. |
| `memory/save.md` gap re-framed, not "fixed" | The absence of workflow YAML is correct by design for a direct-dispatch command; only the misleading wording needed replacement. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Per-file validation (all in-scope) | CONFIRMED PASS: `validate_document.py --type command` → exit 0, 0 blocking, 0 warnings for every in-scope command file (26 conformed files: doctor 3 + the 23-file commit `52d17a8075` set). |
| doctor family P0 | CONFIRMED PASS: `doctor/{mcp,speckit,update}.md` moved from exit 1 (two blocking errors each) to exit 0; subsystem-dispatch model + `_routes.yaml` unchanged; commit `95b5a60240`. |
| prompt-improve P0 | CONFIRMED PASS: exit 1 → exit 0 after the required leaf section was added; commit `52d17a8075`. |
| Behavior preservation (REQ-004) | CONFIRMED PASS: reference-set diff (every dispatch target / asset path / `$ARGUMENTS` token, pre-conformance HEAD vs conformed) showed ZERO losses across all 23 files of commit `52d17a8075`. |
| Dispatch-class asset model | CONFIRMED: no `_auto`/`_confirm` workflow YAML authored for memory/doctor; doctor retains `_routes.yaml`. |
| memory/save.md wording | CONFIRMED: "Missing upstream asset" mis-framing replaced with a plain direct-dispatch statement. |
| Report anchors | CONFIRMED: present per conformed file. |
| Strict spec validation | INFERRED / PENDING: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-child> --strict` is run by the orchestrator, not this authoring pass. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Re-audit signal is a deterministic proxy.** REQ-007 (no confirmed P0 from the deep-alignment command-docs lane re-audit) is satisfied via the deterministic `validate_document.py --type command` sweep (0/0), not the loop's reduced report. The loop's reducer gap is documented in 000-foundations.
2. **Behavior-diff figure scoped to commit `52d17a8075`.** The reviewer-supplied reference-set diff result ("ZERO losses across all 23 modified files") covers the 23-file commit-2 set. The doctor family's 3 files (commit `95b5a60240`) are additionally evidenced by the subsystem-dispatch model + `_routes.yaml` remaining unchanged and the INVALID→VALID validate transition.
3. **Strict spec validation is orchestrator-owned.** This authoring pass does not run `validate.sh --strict` (it does not commit); the orchestrator runs it and rolls up the parent 138 packet.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:rollback -->
## Rollback

Source-only revert, no runtime state or data involved:
1. Revert `52d17a8075` (create/design/memory/speckit/prompt-improve, 23 files).
2. Revert `95b5a60240` (doctor family P0).
3. Re-run `validate_document.py --type command` across the affected files to confirm the pre-conformance contract (doctor/prompt-improve return to exit 1; the rest to their prior VALID-with-drift state).
<!-- /ANCHOR:rollback -->
