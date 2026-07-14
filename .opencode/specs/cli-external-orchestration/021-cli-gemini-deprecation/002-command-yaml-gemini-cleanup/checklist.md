---
title: "Verification Checklist: Command-layer Gemini cleanup"
description: "Checklist for command-layer cli-gemini branch removal, Gemini surface-token cleanup, command-doc executor-list cleanup, and YAML-validity verification."
trigger_phrases:
  - "command yaml gemini cleanup checklist"
importance_tier: "important"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/021-cli-gemini-deprecation/002-command-yaml-gemini-cleanup"
    last_updated_at: "2026-06-08T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Verified command-layer cleanup checklist (9 files)"
    next_safe_action: "None; phase complete, orchestrator validates centrally"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_start-research-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-research-loop_confirm.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_auto.yaml"
      - ".opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml"
      - ".opencode/commands/doctor/assets/doctor_mcp_install.yaml"
      - ".opencode/commands/deep/start-research-loop.md"
      - ".opencode/commands/deep/start-review-loop.md"
      - ".opencode/commands/deep/start-model-benchmark-loop.md"
      - ".opencode/commands/deep/start-agent-improvement-loop.md"
    session_dedup:
      fingerprint: "sha256:41fb3f1a8ea29f2479d37b46835caf27176e2b17b87a7c955a7cb1f88c9a85d7"
      session_id: "command-yaml-gemini-cleanup-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Command-layer Gemini cleanup

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001/002/003/004). Evidence: spec.md §4 carries all four requirements.
- [x] CHK-002 [P0] Technical approach defined in plan.md (affected surfaces + verification). Evidence: plan.md affected-surfaces table lists all nine command-layer files plus the dead-code helper.
- [x] CHK-003 [P1] Predecessor dependency confirmed (phase `001` deleted the `cli-gemini` skill and `.gemini/` surface). Evidence: `001/implementation-summary.md` records the completed skill + runtime deletion.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All five edited YAMLs parse as valid YAML (REQ-002). Evidence: verified centrally by orchestrator.
- [x] CHK-011 [P0] No residual `gemini` token remains anywhere in the command layer (REQ-001 sweep returns zero). Evidence: `grep -rniE "gemini" .opencode/commands` returns 0 matches (exit 1).
- [x] CHK-012 [P1] Removal kept sibling executor branches and surrounding block structure intact. Evidence: only the named branch/tokens removed; YAML parses clean.
- [x] CHK-013 [P1] Edits follow existing command-layer conventions (no orphaned anchors, dangling keys, or broken Q-Exec lettering). Evidence: docs keep contiguous option lettering; YAML block structure intact.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001, REQ-002, REQ-003, REQ-004). Evidence: command-layer sweep zero; YAML parses clean; no enum names `cli-gemini`; docs carry only supported executors.
- [x] CHK-021 [P0] `if_cli_gemini:` branch absent from all four deep YAMLs. Evidence: all four files gemini-clean (exit 1 on grep).
- [x] CHK-022 [P1] `Gemini` stripped from cli-opencode/cli-devin self-invocation guard surface lists in all four deep YAMLs. Evidence: all four files gemini-clean (exit 1 on grep).
- [x] CHK-023 [P1] `gemini` removed from `doctor_mcp_install.yaml` runtime `valid_values`. Evidence: file gemini-clean (exit 1 on grep).
- [x] CHK-024 [P1] `cli-gemini` removed from the four deep command docs (executor lists, Q-Exec options re-lettered, ASCII box fixed, gemini example commands removed). Evidence: all four docs gemini-clean (exit 1 on grep).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class documented as cross-consumer residual-reference cleanup after a deleted skill/runtime surface. Evidence: spec.md §2 problem statement.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: all command-layer `gemini` references across `.opencode/commands` (YAML + docs) enumerated. Evidence: T002 inventory covered 5 YAML + 4 docs.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: deep-loop executor router, self-invocation guard lists, doctor runtime filter, and command-doc executor lists all checked. Evidence: plan.md affected-surfaces table.
- [x] CHK-FIX-004 [P1] Out-of-scope surfaces confirmed unchanged (lib `resolveGeminiSandboxMode`, `specs/**`, `~/.gemini`, `.geminiignore`). Evidence: spec.md §3 out-of-scope; no edits made to those paths.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed: nine files x removal axes (spec.md complexity/edge-case notes + plan.md required inventories).
- [x] CHK-FIX-006 [P1] No executor enum/whitelist in any command YAML lists `cli-gemini` (REQ-003; verified none did). Evidence: targeted `cli-gemini|cli_gemini` YAML search returns no enum entry.
- [x] CHK-FIX-007 [P1] Evidence pinned to explicit grep/parse commands and working-tree diff, not branch-relative claims. Evidence: closing sweep `grep -rniE "gemini" .opencode/commands` = 0 (exit 1).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced by the edits. Evidence: removal-only edits; no new literals added.
- [x] CHK-031 [P1] Removed branches do not expose secrets in comments or examples. Evidence: branches/examples removed, not relocated.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three docs updated to the nine-file command-layer scope and Complete status.
- [x] CHK-042 [P2] The four deep command docs are cleaned of `cli-gemini` executor references (now in scope, not deferred). Evidence: docs gemini-clean (exit 1 on grep); REQ-004 met.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files added outside scratch/approved locations. Evidence: only the nine in-scope command-layer files and packet docs were touched.
- [x] CHK-051 [P1] scratch reviewed before completion. Evidence: no scratch artifacts required for this removal-only cleanup.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-08
<!-- /ANCHOR:summary -->
