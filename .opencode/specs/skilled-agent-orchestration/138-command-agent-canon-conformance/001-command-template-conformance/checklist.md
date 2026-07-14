---
title: "Verification Checklist: command-template conformance across all seven OpenCode command families"
description: "Verifier contract for conforming create/design/doctor/memory/speckit/prompt-improve/goal_opencode command docs to the sk-doc create-command canon — one row per family with validate_document.py 0/0 evidence, behavior-preservation diff result, and commit hash."
trigger_phrases:
  - "command template conformance checklist"
  - "create-command router vocabulary verification"
  - "command validate_document command checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/001-command-template-conformance"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded per-family verifier evidence with commit hashes and validate exit codes"
    next_safe_action: "Orchestrator runs validate.sh --strict on this child"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/mcp.md"
      - ".opencode/commands/create/"
      - ".opencode/commands/memory/save.md"
      - ".opencode/commands/prompt-improve.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Verifier contract is one row per family with validate 0/0 + behavior diff + commit hash."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: command-template conformance across all seven OpenCode command families

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Must complete OR get user approval |
| **P2** | Optional | Can defer with documented reason |

Validator: `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type command` (expect exit 0, 0 blocking, 0 warnings).
Behavior gate: per-file reference-set diff — every dispatch target, asset path, and `$ARGUMENTS` token in the pre-conformance HEAD file vs the conformed file (expect zero losses).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`; evidence: `spec.md` sections 2-5 define the canon-drift problem, scope, REQ-001..REQ-007, and success criteria.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`; evidence: `plan.md` sections 3-5 define source-first two-variant conformance and the validate + reference-diff gates.
- [x] CHK-003 [P1] Upstream findings available; evidence: 000-foundations deep-alignment lane surfaced 20 P1 `missing_recommended_router_section` findings + the doctor/prompt-improve P0 validator failures that scope this child.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Section STRUCTURE is uniform: the six numbered H2 router sections (`## 1. ROUTER CONTRACT` … `## 6. WORKFLOW SUMMARY`) across all conformed families; evidence: `validate_document.py --type command` detects the numbered router-core on every in-scope file (exit 0).
- [x] CHK-011 [P0] ASSETS follow dispatch class; evidence: workflow-YAML families (create/design/speckit) retain their `_auto`/`_confirm`/`_presentation` triads; direct-dispatch families (memory/doctor) use presentation-only OWNED ASSETS + EXECUTION TARGETS pointing at scripts/tools/route-manifest (doctor keeps `_routes.yaml`). No `_auto`/`_confirm` YAML authored for direct-dispatch families.
- [x] CHK-012 [P1] Canon vocabulary used, no banned synonyms; evidence: `create/*` Title-case sections (`Routing Assets`, `Routing Rules`) and `memory/*` synonyms (`ROUTING ASSETS`, `WORKFLOW ROUTING`) renamed to canon (commit `52d17a8075`).
- [x] CHK-013 [P1] Comment hygiene / no behavior prose altered; evidence: the reference-set behavior diff over commit `52d17a8075` shows zero losses across all 23 files, confirming edits were structure/vocabulary only.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

**Per-Family Verifier Contract**

Each row: `validate_document.py --type command` result (exit / blocking / warnings) + behavior-preservation diff result + commit hash.

- [x] CHK-020 [P0] **doctor family** — `doctor/{mcp,speckit,update}.md` (3 files); validate: exit 0 / 0 blocking / 0 warnings each (was exit 1, two blocking errors each → INVALID→VALID); behavior: subsystem-dispatch model + `_routes.yaml` retained unchanged; commit `95b5a60240`.
- [x] CHK-021 [P0] **prompt-improve** — `prompt-improve.md` (1 file); validate: exit 1 → exit 0 / 0 blocking / 0 warnings after the required leaf section was added; behavior: reference-set diff zero losses; commit `52d17a8075`.
- [x] CHK-022 [P0] **create family** — `create/*.md` (10 files); validate: exit 0 / 0 blocking / 0 warnings each; behavior: `_auto`/`_confirm`/`_presentation` triad references retained, reference-set diff zero losses; commit `52d17a8075`.
- [x] CHK-023 [P1] **memory family** — `memory/*.md` (4 files); validate: exit 0 / 0 blocking / 0 warnings each; behavior: direct-dispatch variant (presentation-only OWNED ASSETS + EXECUTION TARGETS), `save.md` "Missing upstream asset" mis-framing replaced with a plain by-design no-workflow-YAML statement, reference-set diff zero losses; commit `52d17a8075`.
- [x] CHK-024 [P1] **speckit family** — `speckit/{complete,implement,plan}.md` (3 files); validate: exit 0 / 0 blocking / 0 warnings each; behavior: workflow-YAML triad retained, reference-set diff zero losses; commit `52d17a8075`.
- [x] CHK-025 [P1] **design family** — `design/*.md` (5 files); validate: exit 0 / 0 blocking / 0 warnings each; behavior: workflow-YAML triad retained, reference-set diff zero losses; commit `52d17a8075`.
- [x] CHK-026 [P1] **already-conformant** — `goal_opencode.md`, `speckit/resume.md`; validate: exit 0 / 0 blocking / 0 warnings; behavior: unchanged (no edit needed — pre-existing conformance confirmed).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every in-scope command file passes the per-file gate; evidence: `validate_document.py --type command` → exit 0 / 0 blocking / 0 warnings for all 26 conformed files (doctor 3 + the 23-file commit `52d17a8075` set).
- [x] CHK-FIX-002 [P0] The two validator-failing families were remediated INVALID→VALID; evidence: `doctor/mcp.md`, `doctor/speckit.md`, `doctor/update.md` (commit `95b5a60240`) and `prompt-improve.md` (commit `52d17a8075`) each moved from `validate_document.py --type command` exit 1 to exit 0.
- [x] CHK-FIX-003 [P0] Behavior preserved (REQ-004); evidence: reference-set diff (dispatch target / asset path / `$ARGUMENTS` token, HEAD vs conformed) showed ZERO losses across all 23 files of commit `52d17a8075`; the doctor family's 3 files kept the subsystem-dispatch model and `_routes.yaml` unchanged.
- [x] CHK-FIX-004 [P1] Dispatch-class variant applied consistently; evidence: no `_auto`/`_confirm` workflow YAML authored for direct-dispatch families (memory/doctor); doctor retains `_routes.yaml`.
- [x] CHK-FIX-005 [P1] Evidence pinned to explicit commits and command outcomes; evidence: commits `95b5a60240` and `52d17a8075` (23 files, +442/-404) recorded per family above.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets added; evidence: commits `95b5a60240` and `52d17a8075` touch only `.opencode/commands/**` section structure/vocabulary — no secret material introduced.
- [x] CHK-031 [P1] No dispatch/permission contract weakened; evidence: the reference-set behavior diff over commit `52d17a8075` shows zero dispatch-target / asset-path / `$ARGUMENTS` losses; direct-dispatch families keep their existing dispatch model.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and implementation summary are synchronized on Complete status and shared evidence; evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all record Status Complete and the shared commits `95b5a60240` + `52d17a8075`.
- [x] CHK-041 [P1] `memory/save.md` no longer mis-declares a workflow-YAML gap; evidence: the "Missing upstream asset" line was replaced with a plain by-design no-workflow-YAML statement (commit `52d17a8075`).
- [x] CHK-042 [P2] Report anchors present per conformed file; evidence: confirmed present on the conformed command files.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only command docs (plus doctor's retained `_routes.yaml` reference) changed; evidence: commits `95b5a60240` and `52d17a8075` touch `.opencode/commands/**` only.
- [x] CHK-051 [P1] No new asset files created for direct-dispatch families; evidence: no `_auto`/`_confirm` workflow YAML added under `memory/` or `doctor/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-14

**Verifier note**: All completion evidence is the deterministic `validate_document.py --type command` sweep (0/0) plus the reference-set behavior diff. The deep-alignment loop's reduced report is NOT the completion signal here — its reducer gap is documented in 000-foundations (see `spec.md` §7 OPEN QUESTIONS).
<!-- /ANCHOR:summary -->
