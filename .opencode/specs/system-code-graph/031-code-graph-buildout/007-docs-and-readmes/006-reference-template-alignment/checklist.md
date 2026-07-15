---
title: "Verification Checklist: System Code Graph Reference Template Alignment"
description: "Verification checklist and evidence for system-code-graph reference template alignment."
trigger_phrases:
  - "system-code-graph verification"
  - "reference template alignment checklist"
  - "code graph docs validation"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/007-docs-and-readmes/006-reference-template-alignment"
    last_updated_at: "2026-05-24T08:04:41Z"
    last_updated_by: "codex"
    recent_action: "Recorded validation evidence for completed reference alignment"
    next_safe_action: "Re-run checks if any changed file is edited again"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/references/"
    session_dedup:
      fingerprint: "sha256:8460ff50aa22bebbee47d74d8196b965bdaeff938afea7478b0899a676e1ebfa"
      session_id: "system-code-graph-reference-template-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: System Code Graph Reference Template Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## 1. VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim completion until verified |
| **[P1]** | Required | Must complete or document deferral |
| **[P2]** | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## 2. PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: scope, requirements, success criteria, and out-of-scope runtime boundaries are recorded.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`. Evidence: taxonomy, router, affected surfaces, and validation phases are documented.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: sk-doc validators, quick validator, and spec validator were available; `generate-description.ts --help` hit an unrelated sidecar module load issue, so `description.json` was created directly to the expected shape.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Canonical references use snake_case subfolder paths. Evidence: canonical files live under `references/runtime/`, `references/readiness/`, `references/config/`, and `references/integrations/`.
- [x] CHK-011 [P0] Compatibility stubs exist at old root paths. Evidence: every moved root kebab-case file exists with a short pointer to its canonical file.
- [x] CHK-012 [P0] Canonical references follow sk-doc structure. Evidence: all references passed `validate_document.py --type reference --blocking-only`.
- [x] CHK-013 [P0] Smart router follows sk-doc standards. Evidence: `SKILL.md` includes dynamic discovery, `_guard_in_skill()`, `load_if_available()`, `_task_text()`, weighted intent scoring, ambiguity handling, fallback checklist, and no-KB notice.
- [x] CHK-014 [P1] Active docs link to canonical references. Evidence: stale root-path `rg` check returned no active matches.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## 4. TESTING

- [x] CHK-020 [P0] Structure extraction completed. Evidence: `extract_structure.py` ran on `SKILL.md`, `README.md`, `ARCHITECTURE.md`, and all reference/stub files.
- [x] CHK-021 [P0] Reference blocking validation passed. Evidence: all 16 `system-code-graph/references/**/*.md` files exited `0`.
- [x] CHK-022 [P0] Skill and README blocking validation passed. Evidence: both commands returned `VALID`.
- [x] CHK-023 [P0] Package quick validation passed. Evidence: `quick_validate.py .opencode/skills/system-code-graph --json` returned `"valid": true`.
- [x] CHK-024 [P1] Link/path smoke checks passed. Evidence: stale root paths, canonical kebab-case subfolder paths, reference `### TABLE OF CONTENTS`, unnumbered canonical H2s, and unresolved local markdown links were checked.
- [x] CHK-025 [P0] Strict spec validation passed. Evidence: `validate.sh <packet> --strict` returned success after packet docs were synchronized.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: documentation drift was classed as cross-consumer navigation/template drift.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: root references, active docs, and router maps were searched before edits.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: `SKILL.md`, `README.md`, `ARCHITECTURE.md`, references, system-spec-kit docs, commands, and agents were included in stale-path `rg` checks.
- [x] CHK-FIX-004 [P0] Security/path/parser adversarial table not applicable. Evidence: docs-only change with no parser, path resolver, redaction, or security code edits.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: axes were canonical references, compatibility stubs, router maps, active docs, and packet docs.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant not applicable. Evidence: no tests or code read process-wide state in this docs-only pass.
- [x] CHK-FIX-007 [P1] Evidence pinned to command results in this packet. Evidence: validation commands and outcomes are recorded in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced. Evidence: changed files are markdown/json docs.
- [x] CHK-031 [P0] Path handling remains safe. Evidence: router pseudocode includes `_guard_in_skill()` and no runtime path resolver changed.
- [x] CHK-032 [P1] Auth/authz not applicable. Evidence: documentation-only skill reference update.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all packet docs describe the same reference split and router update.
- [x] CHK-041 [P1] README updated where applicable. Evidence: `system-code-graph/README.md` related-document table uses canonical references.
- [x] CHK-042 [P2] Architecture doc updated where applicable. Evidence: `ARCHITECTURE.md` readiness and related links use canonical references.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files remain in scratch or absent. Evidence: no scratch artifacts were created beyond template `.gitkeep`.
- [x] CHK-051 [P1] Canonical reference folders use focused domains. Evidence: `runtime/`, `readiness/`, `config/`, and `integrations/` are present.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:scope -->
## 5. SCOPE AND SAFETY

- [x] CHK-030 [P0] No runtime behavior changed. Evidence: edits were limited to documentation/navigation and spec packet files.
- [x] CHK-031 [P0] No schema, script, command, handler, parser, or database implementation changed. Evidence: changed surfaces are docs and reference paths only.
- [x] CHK-032 [P1] Old-path compatibility preserved. Evidence: root stubs keep existing direct links resolvable.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:summary -->
## 6. VERIFICATION SUMMARY

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 22/22 |
| P1 Items | 22 | 22/22 |
| P2 Items | 8 | 8/8 |

**Verification Date**: 2026-05-24
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`. Evidence: ADR-001 and ADR-002 cover taxonomy and router decisions.
- [x] CHK-101 [P1] All ADRs have status. Evidence: both ADRs are Accepted.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale. Evidence: each ADR includes an alternatives table.
- [x] CHK-103 [P2] Migration path documented. Evidence: rollback steps live in `plan.md` and `decision-record.md`.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P1] Performance not affected. Evidence: no runtime files changed.
- [x] CHK-111 [P1] Throughput not affected. Evidence: docs-only scope.
- [x] CHK-112 [P2] Load testing not applicable. Evidence: no executable behavior changed.
- [x] CHK-113 [P2] Performance benchmarks not applicable. Evidence: no performance-sensitive code changed.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented. Evidence: `plan.md` includes rollback steps.
- [x] CHK-121 [P0] Feature flag not applicable. Evidence: docs-only change.
- [x] CHK-122 [P1] Monitoring not applicable. Evidence: no runtime deployment.
- [x] CHK-123 [P1] Runbook not needed. Evidence: existing validators are the operational runbook.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review not required. Evidence: documentation-only scope.
- [x] CHK-131 [P1] Dependency licenses unaffected. Evidence: no dependencies changed.
- [x] CHK-132 [P2] OWASP checklist not applicable. Evidence: no application behavior changed.
- [x] CHK-133 [P2] Data handling unaffected. Evidence: no storage or data pipeline changed.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized. Evidence: spec, plan, tasks, checklist, decision record, and summary match.
- [x] CHK-141 [P1] API documentation unaffected. Evidence: no MCP schema or handler docs changed beyond navigation.
- [x] CHK-142 [P2] User-facing documentation updated. Evidence: README and ARCHITECTURE links updated.
- [x] CHK-143 [P2] Knowledge transfer documented. Evidence: implementation summary lists canonical folders and stubs.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Codex | Implementer | Approved | 2026-05-24 |
<!-- /ANCHOR:sign-off -->
