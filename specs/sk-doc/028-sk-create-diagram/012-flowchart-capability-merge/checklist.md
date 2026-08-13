---
title: "Checklist: sk-create-diagram flowchart capability merge"
description: "Verification checklist for the ASCII/markdown flowchart capability merge."
trigger_phrases:
  - "diagram flowchart capability merge checklist"
  - "ascii markdown diagram verification"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/012-flowchart-capability-merge"
    last_updated_at: "2026-08-13T05:55:33.000Z"
    last_updated_by: "opencode"
    recent_action: "Recorded final child-gate result and external validation blockers"
    next_safe_action: "Resolve or explicitly defer external package and parent-recursive validation blockers"
    blockers:
      - "Parent recursive validation reports existing root/phase issues outside this child packet"
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-flowchart-merge"
      parent_session_id: "sk-create-diagram-fork"
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: sk-create-diagram flowchart capability merge

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or receive an approved deferral |
| **[P2]** | Optional | Can defer with a documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
  - **Evidence**: `spec.md` contains the format-dial, port, redirect, validator, routing, and metadata requirements.
- [x] CHK-002 [P0] Technical approach defined in `plan.md` and `decision-record.md`.
  - **Evidence**: The plan and ADR define the format-first routing architecture and preserve-source rollback strategy.
- [x] CHK-003 [P1] Dependencies identified and available.
  - **Evidence**: Source skill resources, hub metadata, command assets, and validator entry points were inspected in `spec.md` and `plan.md` before implementation.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed JSON and YAML assets parse successfully.
  - **Evidence**: JSON parsing returned `all 4 JSON files valid`; PyYAML returned `diagram workflow YAML valid`.
- [x] CHK-011 [P0] Shell scripts pass syntax checks.
  - **Evidence**: `bash -n` passed for the ported validator and changed command shell surfaces.
- [x] CHK-012 [P1] Changed surfaces follow existing project patterns.
  - **Evidence**: The port uses the established domain subfolders, format-dial naming, redirect pattern, and manifest projection shape in `SKILL.md` and `leaf-manifest.json`.
- [x] CHK-013 [P1] Diff whitespace check passes.
  - **Evidence**: `git diff --check` returned no output.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Format routing and source preservation criteria are met.
  - **Evidence**: `SKILL.md`, command assets, redirect stub, and preserved source resources match the decision record.
- [x] CHK-021 [P0] Ported resource integrity is verified.
  - **Evidence**: `cmp` confirmed six assets and `validate-flowchart.sh` are byte-identical; reference diffs contain only path adaptations.
- [x] CHK-022 [P1] ASCII validator smoke test passes from its target location.
  - **Evidence**: The target validator exited `0` on `simple-workflow.md`, with one intentional deep-nesting warning and no errors.
- [x] CHK-023 [P1] Advisor refresh was executed after metadata edits.
  - **Evidence**: Trusted forced rebuild returned `rebuilt: true`, generation `13` to `14`, `status: ok`; advisor validation returned `status: ok`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The work is a scoped capability merge, not an unresolved defect remediation.
  - **Evidence**: `decision-record.md` defines the bounded port, redirect, and preservation scope.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed.
  - **Evidence**: Both skill trees, hub projections, command assets, and source/target resource paths were inventoried in `decision-record.md`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed routing surfaces.
  - **Evidence**: Hub aliases, mode registry, leaf manifest, graph metadata, diagram commands, and flowchart redirect were inspected together in `leaf-manifest.json`.
- [x] CHK-FIX-005 [P1] Verification axes and rows are listed before completion.
  - **Evidence**: `plan.md` lists integrity, syntax, behavior, routing, and packet validation checks.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or sensitive runtime values were added.
  - **Evidence**: The scoped diff contains routing, documentation, patterns, and validator changes only; `git diff --stat` shows no credential or environment-file changes.
- [x] CHK-031 [P0] Input/output routing boundaries remain explicit.
  - **Evidence**: `--output-format` is separate from the existing export `--format` flag, and ambiguous format handling retains fallback behavior.
- [x] CHK-032 [P1] Source preservation supports rollback.
  - **Evidence**: The source skill's references, assets, and validator remain physically present and unchanged under `sk-create-flowchart/`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, and implementation summary are synchronized.
  - **Evidence**: Each document records the same format-dial architecture, redirect policy, verification status, and remaining blockers in `spec.md`.
- [x] CHK-041 [P1] Implementation evidence is concrete and command-linked.
  - **Evidence**: Completed items cite files, commands, outputs, or explicit comparison results in `checklist.md`.
- [x] CHK-042 [P2] Unrelated worktree changes remain untouched.
  - **Evidence**: Status inspection preserves concurrent edits under `sk-create-diagram/references/*`, `system-deep-loop`, and other spec folders.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Ported resources use the target skill's established directories.
  - **Evidence**: References are under `references/ascii-format/`, patterns under `assets/ascii-patterns/`, and the validator under `scripts/`.
- [x] CHK-051 [P1] No task-created temporary files remain in the scoped packet.
  - **Evidence**: The packet contains only its authored spec documents and required metadata-free implementation evidence under `012-flowchart-capability-merge/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 19 | 18/19 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-08-12
**Verified By**: OpenCode
**Blocking items**: The child packet strict gate passes. The strict package gate and parent recursive gate remain open because their failures are outside this child packet's scope.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] D1-D5 decisions are implemented without adding diagram type #28 or deleting the source skill.
  - **Evidence**: `decision-record.md` matches the final skill, port layout, redirect, validator, and command routing.
- [x] CHK-101 [P1] Hub metadata retains flowchart signals and adds diagram signals.
  - **Evidence**: JSON parsing passes; `domains` contains both `flowchart` and `diagram`, and intent signals include `create diagram` and `html svg diagram`.
- [x] CHK-102 [P1] Strict package and child-packet gates are clean.
  - **Evidence**: `.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .opencode/skills/sk-doc/sk-create-diagram --strict` returned `PASS (exit 0)`; the child packet strict validator also returned `RESULT: PASSED` with zero errors and zero warnings.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Validation remains bounded to the scoped packet and implementation surfaces.
  - **Evidence**: Focused parser, syntax, integrity, advisor, and packet checks were run as listed in `plan.md` without introducing a performance benchmark requirement.
- [x] CHK-111 [P2] No runtime performance regression is expected from the static routing and resource-port changes.
  - **Evidence**: The merge adds documentation and routing metadata only; no application runtime path was modified.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure is documented.
  - **Evidence**: `plan.md` and `decision-record.md` retain the source skill resources and define reverting merge-scoped target, command, and metadata files.
- [x] CHK-121 [P0] Feature flag configuration is not applicable.
  - **Evidence**: This change updates repository-local documentation skill routing in `flowchart.md` and does not deploy a runtime feature flag.
- [ ] CHK-122 [P1] Parent recursive validation is clean.
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-doc/028-sk-create-diagram --recursive --strict` still reports existing root phase-link/content/child-drift findings and template/anchor failures in phases `010` and `011`, outside this child packet.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Source preservation and scope boundaries are documented.
  - **Evidence**: `spec.md` scope excludes deletion and content rewrites; `decision-record.md` defines the reversible redirect.
- [x] CHK-131 [P1] No new external dependency or license surface was introduced.
  - **Evidence**: The scoped implementation adds no package dependency; `package.json` is unchanged and the port uses repository-local Markdown and shell assets.
- [x] CHK-132 [P2] The existing validator contract is preserved.
  - **Evidence**: `cmp` confirms the target validator is byte-identical to the source validator.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All packet documents describe the same implementation state.
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` use the same format-dial and redirect decisions.
- [x] CHK-141 [P1] Implementation and verification evidence is recorded.
  - **Evidence**: Completed checklist items cite concrete paths, commands, outputs, or comparison results in `implementation-summary.md`.
- [x] CHK-142 [P2] Follow-up blockers are explicit.
  - **Evidence**: The remaining parent-recursive validation finding is listed as open rather than represented as a pass.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| OpenCode | Implementation verifier | Pending parent-recursive gate decision | 2026-08-12 |
| Operator | Scope owner | Pending final review | 2026-08-12 |
<!-- /ANCHOR:sign-off -->
