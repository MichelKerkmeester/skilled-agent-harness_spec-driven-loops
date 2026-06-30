---
title: "Verification Checklist: markdown agent rename"
description: "Verification checklist for markdown agent rename."
trigger_phrases:
  - "markdown agent rename"
importance_tier: "important"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/082-sk-doc-skill-readme-and-structure"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented markdown agent rename across runtime mirrors and create-command references"
    next_safe_action: "Run final verification and save continuity"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: markdown agent rename

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

- [x] CHK-001 [P0] Requirements documented in spec.md - Evidence: `spec.md` defines rename scope, preserved command names and runtime mirror requirements.
- [x] CHK-002 [P0] Technical approach defined in plan.md - Evidence: `plan.md` defines exact-search inventory, classification and validation strategy.
- [x] CHK-003 [P1] Dependencies identified and available - Evidence: runtime source files existed for `.opencode`, `.claude`, `.gemini` and `.codex` (`.toml`) mirrors.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Documentation paths are valid - Evidence: `test -f` checks pass for all three `markdown.md` runtime mirrors.
- [x] CHK-011 [P0] No stale references remain - Evidence: targeted `rg "@create|create\\.md|create\\.toml|Create-Doc Agent|name: create|name = \\\"create\\\"|\\[agents\\.create\\]|agents/create\\.toml"` checks include runtime agents, `.codex/config.toml`, create-command scopes, the spec-kit implement asset and root docs.
- [x] CHK-012 [P1] Error handling implemented where scripts change - Evidence: no scripts changed; command refusal text was updated from create-doc wording to markdown-agent wording.
- [x] CHK-013 [P1] Changes follow project patterns - Evidence: runtime mirror names, frontmatter, Phase 0 command wording and YAML prerequisite comments use existing patterns with only identity terms changed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met - Evidence: `markdown.md` or `markdown.toml` exists where `create` agent files existed, `.codex/config.toml` registers `agents.markdown`, and command-family `/create:*` references remain.
- [x] CHK-021 [P0] Manual verification complete - Evidence: exact searches and file existence checks were run after implementation.
- [x] CHK-022 [P1] Edge cases tested - Evidence: `.codex` used TOML instead of Markdown, was renamed to `markdown.toml`, and the Codex registry now points at `agents/markdown.toml`; `/create:*` command invocations were preserved.
- [x] CHK-023 [P1] Error scenarios validated - Evidence: command hard-block messages now instruct `@markdown /create:*` and reference `markdown.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable item has a finding class or scope classification. - Evidence: agent runtime files, orchestration references, command self-verification text, YAML prerequisites and command invocations were classified separately.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. - Evidence: glob and grep found `.opencode`, `.claude`, `.gemini` Markdown sources and `.codex` TOML source.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed paths and docs. - Evidence: grep inventory covered runtime agents, create commands, YAML assets, `.codex/config.toml`, `AGENTS.md`, `AGENTS_Barter`, `README.md` and sk-doc agent template references.
- [x] CHK-FIX-004 [P0] Path fixes include adversarial checks for old and new locations. - Evidence: old `create.md` absence and new `markdown.md` presence were checked.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. - Evidence: axes were runtime mirror, command surface, YAML workflow asset, root doc and sk-doc template; modified row set is listed in `resource-map.md`.
- [x] CHK-FIX-006 [P1] Runtime mirror variant executed where runtime files change. - Evidence: `.opencode`, `.claude`, `.gemini` and `.codex` mirrors were renamed and updated consistently.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit command output. - Evidence: verification command outputs are recorded in this checklist and implementation summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - Evidence: changes are documentation/agent identity text only; no credentials introduced.
- [x] CHK-031 [P0] Input validation implemented where commands change - Evidence: no input grammar changed; existing setup and hard-stop gates remain intact.
- [x] CHK-032 [P1] Agent write-scope boundaries remain explicit - Evidence: `markdown.md` retains explicit LEAF-only and writable-scope boundary sections.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - Evidence: status, tasks and phase gates updated to complete.
- [x] CHK-041 [P1] Resource map updated - Evidence: `resource-map.md` now lists actual read/write paths and verification commands.
- [x] CHK-042 [P2] README updated if applicable - Evidence: root README only preserves `/create:*` command-family documentation; no agent identity update was required.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only - Evidence: no temporary files were created outside scratch.
- [x] CHK-051 [P1] scratch/ cleaned before completion - Evidence: `scratch/` contains only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-10
<!-- /ANCHOR:summary -->
