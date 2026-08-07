---
title: "Verification Checklist: Phase 1 cli-external-orchestration README rewrite"
description: "Verification evidence for the purpose-first rewrite of the cli-external-orchestration skill README against the refined standalone template."
trigger_phrases:
  - "phase 1 checklist"
  - "cli external orchestration readme verification"
  - "hub readme rewrite verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/004-standalone-readme-revisit/001-cli-external-orchestration"
    last_updated_at: "2026-08-04T12:45:00Z"
    last_updated_by: "phase-executor-001"
    recent_action: "All checks verified with evidence marked"
    next_safe_action: "Hand phase off: phase 1 complete, successor 002-mcp-code-mode ready"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-cli-external-orchestration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 1 cli-external-orchestration README rewrite

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Required README structure or validation invariant | Cannot close the phase |
| **[P1]** | Required documentation and scope check | Must complete or be explicitly deferred |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Template readiness gate passed: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` exists and was read before drafting [evidence: `ls` exit `0` + `skill-readme-template.md` read]
- [x] CHK-002 [P0] Baseline recorded for `.opencode/skills/cli-external-orchestration/README.md`: `version` field value, `validate_document.py` output and relative link state [evidence: `version: 1.2.0.0` + `validate_document.py` exit `0` + `13` links]
- [x] CHK-003 [P1] mcp-obsidian exemplar (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) read and its pitch and OVERVIEW pattern recorded [evidence: `mcp-obsidian/README.md` read + pitch/OVERVIEW pattern mirrored]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Rewritten README exists at `.opencode/skills/cli-external-orchestration/README.md` with a one-line pitch blockquote and a problem-first OVERVIEW [evidence: `rg -n '^## 2\. OVERVIEW'` hit + pitch blockquote line `25`]
- [x] CHK-011 [P0] All six mode pointers (cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin and cli-pi) present in the rewritten README [evidence: `rg -c` per mode `7/4/5/4/5/5`]
- [x] CHK-012 [P0] Frontmatter `version` field reads `1.3.0.0` [evidence: `grep '^version:'` → `1.3.0.0`]
- [x] CHK-013 [P1] Section model of the rewritten README mirrors the refined template (`skill-readme-template.md`) [evidence: `7` numbered ALL-CAPS H2 sections `1..7` with `---` dividers per `rg -n '^## [0-9]+\. '`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `validate_document.py --type readme` reports zero issues on the rewritten README [evidence: exit `0` + `Total issues: 0`]
- [x] CHK-021 [P0] HVR grep returns zero em dashes, semicolons and Oxford commas in the README body [evidence: `rg -n '\x{2014}'` exit `1` + `\x{3B}` exit `1` + `,\s+(and|or)\b` exit `1`]
- [x] CHK-022 [P1] Link guard confirms every relative link in the rewritten README resolves [evidence: link scan `18/18` resolve]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P1] Section-by-section diff of old vs new README shows no dispatch fact lost [evidence: `git diff` old-vs-new + all `6` mode pointers and `4` routing facts present]
- [x] CHK-031 [P1] Scope diff lists only the README, the changelog entry and this phase's docs [evidence: `git diff --stat` → `1` file + `git status` → README, `v1.3.0.0.md`, phase docs]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-032 [P1] No vault, SKILL.md, template, registry or manifest file touched. Changed files are the README, the changelog entry and phase docs only [evidence: `git status` shows `M` README + `??` `v1.3.0.0.md` + `??` phase folder, `0` others]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-033 [P1] Phase validation errors zero on this phase folder [evidence: `validate.sh --strict` exit `0` + `Errors: 0` + `Warnings: 0`]
- [x] CHK-034 [P1] Changelog entry written at `changelog/v1.3.0.0.md` and phase metadata regenerated [evidence: `changelog/v1.3.0.0.md` exists + `backfill-graph-metadata.js` refreshed `1`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-035 [P1] No files moved or renamed. Only the README, the changelog entry and phase docs changed [evidence: `git status` scope `2` paths + `0` staged + no renames]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|------:|---------:|
| P0 items | 7 | 7/7 |
| P1 items | 9 | 9/9 |

**Verification Date**: 2026-08-04
<!-- /ANCHOR:summary -->
