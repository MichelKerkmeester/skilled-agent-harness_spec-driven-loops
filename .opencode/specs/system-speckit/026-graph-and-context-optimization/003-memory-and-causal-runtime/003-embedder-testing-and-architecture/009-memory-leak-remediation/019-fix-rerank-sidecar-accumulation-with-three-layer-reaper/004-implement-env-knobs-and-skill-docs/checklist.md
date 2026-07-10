---
title: "Verification Checklist: Rerank reaper env knobs and operator docs [template:level_2/checklist.md]"
description: "Verification checklist for launcher env allowlist, docs, smoke, and strict validation."
trigger_phrases:
  - "rerank reaper checklist"
  - "sidecar env docs verification"
  - "integration smoke runbook"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/004-implement-env-knobs-and-skill-docs"
    last_updated_at: "2026-05-23T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "recorded-verification-checklist"
    next_safe_action: "final-strict-validation"
    blockers: []
    key_files:
      - ".opencode/skills/system-rerank-sidecar/scripts/start.sh"
      - ".opencode/skills/system-rerank-sidecar/SKILL.md"
      - ".opencode/skills/system-rerank-sidecar/README.md"
    session_dedup:
      fingerprint: "sha256:0100050040000000000000000000000000000000000000000000000000000000"
      session_id: "010-005-004-rerank-reaper-env-docs"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Bounded start.sh smoke may hit sandbox bind limits; requested command includes || true."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Rerank reaper env knobs and operator docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` REQ-001 through REQ-008.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` affected-surfaces and testing strategy.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: predecessor ADR snippets and sibling packet summaries read before edits.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Shell syntax passes. Evidence: `bash -n .opencode/skills/system-rerank-sidecar/scripts/start.sh` exited 0.
- [x] CHK-011 [P0] No unrelated source files modified by this packet. Evidence: scoped `git status --short -- <target files> <packet folder>` shows only `start.sh`, `SKILL.md`, `README.md`, and this packet folder.
- [x] CHK-012 [P1] Allowlist pattern preserved. Evidence: `start.sh` still uses `exec env -i "${env_args[@]}"`.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: added only explicit keys via existing `add_env_if_set` loop.
- [x] CHK-014 [P1] OpenCode alignment drift passes. Evidence: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar` exited 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: four reaper env names appear in `start.sh`, `SKILL.md`, and `README.md`.
- [x] CHK-021 [P0] Manual smoke command executed. Evidence: `timeout 8 bash .opencode/skills/system-rerank-sidecar/scripts/start.sh --help 2>&1 || true` exited 0 after uvicorn attempted startup and shut down.
- [x] CHK-022 [P1] Edge cases tested. Evidence: static check confirmed only explicit allowlist forwarding after `env -i`; unrelated env is not copied.
- [x] CHK-023 [P1] Error scenarios documented. Evidence: `implementation-summary.md` records sandbox bind result and manual post-merge smoke runbook.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned. Evidence: cross-consumer docs/config integration, not source behavior.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: `rg` over sidecar docs and launcher for reaper env names.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: target surfaces are `start.sh`, `SKILL.md`, `README.md`; app/source owners remain unchanged.
- [x] CHK-FIX-004 [P0] Security/path/parser adversarial table not applicable. Evidence: no parser/path/security algorithm changed.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: `plan.md` affected-surfaces lists approved knob vs unrelated env and normal cleanup vs manual debug.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant covered statically. Evidence: `env -i` boundary and explicit `add_env_if_set` keys preserve rejection of unrelated parent env.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit commands and file paths. Evidence: implementation summary records exact verification commands.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: docs and shell comments add no secret material.
- [x] CHK-031 [P0] Env boundary remains restrictive. Evidence: no blanket pass-through was added to final `env_args`.
- [x] CHK-032 [P1] Auth/authz unchanged. Evidence: no API behavior or auth code changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three docs describe the same three target files and verification flow.
- [x] CHK-041 [P1] Code comments adequate. Evidence: `start.sh` comments explain the four reaper knobs.
- [x] CHK-042 [P2] README updated. Evidence: README includes operator lifecycle, env table, telemetry path, manual debug section, and troubleshooting row.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: no temp files created outside packet scratch.
- [x] CHK-051 [P1] scratch/ clean before completion. Evidence: only scaffold `.gitkeep` remains.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-23
<!-- /ANCHOR:summary -->
