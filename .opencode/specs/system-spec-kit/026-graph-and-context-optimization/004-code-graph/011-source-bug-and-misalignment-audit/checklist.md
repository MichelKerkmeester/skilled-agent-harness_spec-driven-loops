---
title: "Verification Checklist: Code Graph Source Audit [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/checklist]"
description: "QA checklist for the system-code-graph source audit packet: evidence integrity, adversarial verification, severity correctness, and read-only guarantee."
trigger_phrases:
  - "code graph audit checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit"
    last_updated_at: "2026-05-29T08:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified checklist against the audit"
    next_safe_action: "Hand off remediation tasks"
    blockers: []
    key_files:
      - "review-report.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code Graph Source Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is marked `[x]` only with evidence. This packet's "work" is the audit, so verification targets the integrity of the findings, not a code change.

| Tag | Meaning | Rule |
|-----|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `cli-opencode` SKILL.md read before composing the dispatch (CLI dispatch rule).
- [x] CHK-002 [P0] Provider auth pre-flight run; OpenAI oauth confirmed present (no silent substitution).
- [x] CHK-003 [P0] Self-invocation guard passed (not inside OpenCode).
- [x] CHK-004 [P0] Scope frozen: read-only audit, no spec-folder writes to the audited skill.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No source files in `system-code-graph` were modified (read-only audit). Evidence: gpt-5.5 coverage note + workflow returned no edits.
- [x] CHK-011 [P0] Findings cite exact file:line; spot-checked P1 quotes (status.ts:200, mcp-types.ts:9-14, tree-sitter-parser.ts, code-graph-db.ts:858-870).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Adversarial verification ran per finding (independent skeptic agents); 4 candidates refuted and excluded.
- [x] CHK-021 [P1] Severity ratings reflect verifier-corrected values (P1 downgrades to P2 documented in Verification notes).
- [ ] CHK-022 [P2] Remediation regression tests deferred to fix packets (not in scope here).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] 37 confirmed findings recorded (10 P1, 27 P2).
- [x] CHK-031 [P1] Each P1 finding has a named remediation task in `tasks.md`.
- [x] CHK-032 [P2] Duplicate finding (playbook-023 apply-mode) deduped.
- [ ] CHK-033 [P2] Fixes applied deferred by design (audit-only packet).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No secrets/credentials included in the dispatched prompt or findings.
- [x] CHK-041 [P1] Path-traversal/symlink and recovery-path findings checked for real exploitability; severities reflect actual reachability.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `review-report.md` is the evidence record; `spec.md`/`plan.md`/`tasks.md` frame scope + remediation.
- [x] CHK-051 [P2] Provenance documented (gpt-5.5 dispatch + direct verify + 43-agent workflow).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Placed as phase child `011` under `004-code-graph` (sibling to 009 docs-uplift, 010 playbook-validation).
- [x] CHK-061 [P0] Mandatory metadata present: `description.json`, `graph-metadata.json`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Check | Result |
|-------|--------|
| Evidence integrity (file:line quotes) | PASS — P1s spot-verified against source |
| Adversarial verification | PASS — 32/36 workflow candidates confirmed, 4 refuted |
| Read-only guarantee | PASS — no source edits |
| `validate.sh --strict` | PASS (see implementation-summary Verification table) |
<!-- /ANCHOR:summary -->
