---
title: "Verification Checklist: deep-review :auto non-interactive setup bypass"
description: "Verification checklist for /deep:start-review-loop:auto stdin-hang fix."
trigger_phrases:
  - "deep-review setup hang"
  - "F-Stage-E-001"
importance_tier: "important"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/033-deep-review-three-tier-setup"
    last_updated_at: "2026-05-11T12:00:00Z"
    last_updated_by: "codex-inline"
    recent_action: "Checklist updated with dry-run evidence"
    next_safe_action: "Reviewer can inspect evidence/dry-run-verification.txt"
    blockers: []
    key_files:
      - ".opencode/commands/deep/start-review-loop.md"
      - "system-deep-loop/z_archive/033-deep-review-three-tier-setup/evidence/dry-run-verification.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "103-001-deep-review-three-tier-setup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - question: "Were live dispatches run?"
        answer: "No. Runtime instruction required dry-run setup-phase verification only."
---
# Verification Checklist: deep-review :auto non-interactive setup bypass

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `.opencode/specs/skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract/001-deep-review-three-tier-setup/spec.md` read first; §4 requirements and §5 success criteria guided the implementation.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `.opencode/specs/skilled-agent-orchestration/z_archive/083-spec-kit-auto-mode-noninteractive-contract/001-deep-review-three-tier-setup/plan.md` read second; §3 architecture matched the implemented three-tier setup flow.
- [x] CHK-003 [P1] Dependencies identified (command + YAML + CLI binaries available). Evidence: command markdown and auto YAML were read; CLI binaries were not used because runtime instruction prohibited live dispatch verification.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No invalid markdown / broken anchor in deep-review.md after edit. Evidence: §0 was read back after the patch; heading structure and fenced blocks render as valid Markdown.
- [x] CHK-011 [P0] No YAML parse errors in deep_start-review-loop_auto.yaml if touched. Evidence: YAML asset was read but not modified.
- [x] CHK-012 [P1] Pre-binding marker block has unambiguous syntax, no collision with existing convention. Evidence: `PRE-BOUND SETUP ANSWERS:` documented as a single YAML-style key/value block with unknown-field and malformed-line behavior.
- [x] CHK-013 [P1] Fail-fast error message clearly names every missing input. Evidence: Tier 3 documents the exact named-missing-inputs format; Trace C records `review_target` missing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Codex exec non-interactive dispatch loads YAML workflow without setup question. Evidence: runtime instruction prohibited live YAML dispatch; V2 Trace A dry-ran the setup phase and reached YAML load with no setup question.
- [x] CHK-021 [P0] Opencode run --pure non-interactive dispatch loads YAML workflow without setup question. Evidence: runtime instruction prohibited live YAML dispatch; V2 Trace A covers the command-level setup resolution shared by both runtimes.
- [x] CHK-022 [P0] `:auto` with empty args exits non-zero within 10s with named-missing-inputs error. Evidence: runtime instruction prohibited live dispatch; V2 Trace C verifies Tier 3 fail-fast path and exact error shape.
- [x] CHK-023 [P1] `:confirm` mode regression check: still emits question block. Evidence: V1 read-back and V2 Trace D confirm the original consolidated block remains under the `:confirm`/no-suffix branch.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classified: `cross-consumer` - fix lives in command markdown, consumed by YAML workflow. Evidence: `deep-review.md` owns setup; auto YAML consumes resolved placeholders after setup.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: deep-review.md is the only producer of setup-resolution for this command. Evidence: §0 of `deep-review.md` is the documented setup entrypoint before YAML load.
- [x] CHK-FIX-003 [P0] Consumer inventory: YAML workflow + `deep-review-config.json` shape verified consistent across both branches. Evidence: `deep_start-review-loop_auto.yaml` setup inputs and `step_create_config` were read; no consumer-side change required.
- [x] CHK-FIX-004 [P0] Not applicable (no security/parser/redaction changes). Evidence: change is command contract documentation and setup routing; no secrets, redaction, or runtime parser code was edited.
- [x] CHK-FIX-005 [P1] Matrix axes: (mode x inputs-resolved-state) = 4 cells (auto+resolved, auto+missing, confirm+resolved, confirm+missing); all tested. Evidence: dry-run traces cover auto+resolved (Trace A), auto+ambiguous (Trace B), auto+missing (Trace C), and confirm path (Trace D); confirm+missing remains in the unchanged consolidated prompt path.
- [x] CHK-FIX-006 [P1] Hostile env variant: stdin closed (`</dev/null`) explicitly tested. Evidence: live stdin-closed execution was prohibited; Trace C verifies the non-interactive EOF outcome by contract and records the fail-fast result.
- [x] CHK-FIX-007 [P1] Evidence pinned to commit SHA after final pass. Evidence: base commit at verification time was `2908deb22`; final working-tree changes are documented in this packet.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets/tokens/keys handled. Evidence: modified files contain command documentation and packet docs only.
- [x] CHK-031 [P0] Pre-binding marker parser cannot introduce arbitrary command execution. Evidence: schema documents data-only key/value fields and maps them to setup values; no shell interpolation or executable field is introduced.
- [x] CHK-032 [P1] Failure paths do not leak sensitive state into stderr/transcripts. Evidence: Tier 3 error names missing setup fields and resolution options only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md synchronized. Evidence: tasks, checklist, and implementation summary now reflect the runtime-limited dry-run verification path.
- [x] CHK-041 [P1] Command argument-hint references the new non-interactive path. Evidence: frontmatter now mentions `--spec-folder=PATH` and `PRE-BOUND SETUP ANSWERS:` support.
- [x] CHK-042 [P2] CLAUDE.md or other surface mentions the new bypass capability (defer unless explicitly desired). Evidence: deferred because runtime scope allowed edits only to `deep-review.md` and 028 packet files.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Verification dispatch transcripts stored under packet `evidence/` only. Evidence: dry-run verification was stored at `evidence/dry-run-verification.txt`.
- [x] CHK-051 [P1] `scratch/` cleaned before completion. Evidence: no scratch files were created during this run.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-11
<!-- /ANCHOR:summary -->
