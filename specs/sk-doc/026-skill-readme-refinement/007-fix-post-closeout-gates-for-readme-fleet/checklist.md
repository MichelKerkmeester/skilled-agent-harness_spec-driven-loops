---
title: "Verification Checklist: Fix post-closeout gates for the README fleet"
description: "Verification protocol for global link and version gate recovery plus aligned CLI mode README presentation."
trigger_phrases:
  - "link guard remediation checklist"
  - "frontmatter version checklist"
  - "CLI README family verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/007-fix-post-closeout-gates-for-readme-fleet"
    last_updated_at: "2026-08-05T08:05:41Z"
    last_updated_by: "phase-executor"
    recent_action: "Verified global gates and CLI README family"
    next_safe_action: "Regenerate metadata and run strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs"
      - ".opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-fix-post-closeout-gates-for-readme-fleet"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Fix post-closeout gates for the README fleet

<!-- SPECKIT_LEVEL: 3 -->

---
<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete or receive user-approved deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---
<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase scope documents the global link, version, and CLI README remediation. [evidence: `spec.md`]
- [x] CHK-002 [P0] Plan defines repair, exception, version, README, and closeout stages. [evidence: `plan.md`]
- [x] CHK-003 [P1] The live baseline names 96 link reports and six version gaps. [evidence: `/tmp/007-link-baseline.txt`, `check-frontmatter-versions.sh`]
<!-- /ANCHOR:pre-impl -->

---
<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Guard configuration remains narrow and readable. [evidence: `check-markdown-links.cjs` diff review]
- [x] CHK-011 [P0] The link-guard self-test exits 0. [evidence: `--self-test` `6/6`]
- [x] CHK-012 [P1] Node syntax checks pass for changed JavaScript. [evidence: `node --check`]
- [x] CHK-013 [P1] No comments introduce ephemeral planning identifiers or spec paths. [evidence: `comment-hygiene` grep clean]
<!-- /ANCHOR:code-quality -->

---
<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The full link guard reports `0 broken`. [evidence: `check-markdown-links.cjs` exit 0]
- [x] CHK-021 [P0] The full version gate reports zero missing and malformed fields. [evidence: version gate `ok=3233`]
- [x] CHK-022 [P0] All six CLI README validators exit 0. [evidence: `6/6` validators]
- [x] CHK-023 [P1] Each changed CLI README has a matching changelog record. [evidence: changelog heads `3/3`]
- [x] CHK-024 [P1] The two global gates pass again without changes. [evidence: deterministic rerun `0 broken` and `ok=3233`]
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every baseline link finding has a documented action class. [evidence: classification matrix `96/96`]
- [x] CHK-FIX-002 [P0] Every real target resolves from its source document directory or repository root. [evidence: global guard `0 broken`]
- [x] CHK-FIX-003 [P0] Every guard exception maps to an intentional fixture or copy-time placeholder. [evidence: `11` allowlist pairs, `2` fixture classes]
- [x] CHK-FIX-004 [P1] All six original version-gap documents have a derived four-part version. [evidence: version gate `ok=3233`]
- [x] CHK-FIX-005 [P1] All six CLI child modes expose full sibling navigation. [evidence: sibling tables `6/6`]
<!-- /ANCHOR:fix-completeness -->

---
<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or private runtime state appear in changed docs or guard code. [evidence: diff review]
- [x] CHK-031 [P0] Guard exceptions do not disable validation for active documentation trees. [evidence: `check-markdown-links.cjs`]
- [x] CHK-032 [P1] Documentation claims do not modify CLI dispatch permissions or safety contracts. [evidence: README versus `SKILL.md` comparison]
<!-- /ANCHOR:security -->

---
<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and summary agree on results. [evidence: phase-doc `review` of all six records]
- [x] CHK-041 [P1] Parent phase map includes Phase 007 and its final status. [evidence: `../spec.md`]
- [x] CHK-042 [P1] `cli-opencode` explicitly explains why it differs from the five sibling executors. [evidence: `cli-opencode/README.md`]
<!-- /ANCHOR:docs -->

---
<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary analysis files remain outside committed package paths. [evidence: `git status --short`]
- [x] CHK-051 [P1] No unintended generated files remain after metadata regeneration. [evidence: `git diff --check`]
<!-- /ANCHOR:file-org -->

---
<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|------:|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 19 | 19/19 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-05
<!-- /ANCHOR:summary -->

---
<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] The decision record documents the narrow-exception policy. [evidence: `decision-record.md`]
- [x] CHK-101 [P1] Alternatives and rollback are documented. [evidence: `plan.md` and `decision-record.md`]
<!-- /ANCHOR:arch-verify -->

---
<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] The global guard completes without a new per-link repository walk. [evidence: `check-markdown-links.cjs` review]
<!-- /ANCHOR:perf-verify -->

---
<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] The rollback command is recorded and remains file-scoped. [evidence: `git restore -- <paths>`]
- [x] CHK-121 [P1] No deployment or feature flag applies to this documentation-only phase. [evidence: scope `review` shows no deploy surface]
<!-- /ANCHOR:deploy-ready -->

---
<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Every changed in-scope document meets frontmatter-version policy. [evidence: `check-frontmatter-versions.sh` gate]
<!-- /ANCHOR:compliance-verify -->

---
<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All changed CLI READMEs pass the README validator. [evidence: `6/6` validator output]
- [x] CHK-141 [P1] All README links remain resolvable through the global link guard. [evidence: global guard `0 broken`]
<!-- /ANCHOR:docs-verify -->

---
<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Repository maintainer | Scope owner | Approved | 2026-08-05 |
| Documentation validator | Automated gate | Approved | 2026-08-05 |
<!-- /ANCHOR:sign-off -->
