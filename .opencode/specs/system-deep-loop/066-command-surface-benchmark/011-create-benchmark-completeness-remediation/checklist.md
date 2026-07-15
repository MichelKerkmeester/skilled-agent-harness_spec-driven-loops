---
title: "Checklist: create-benchmark completeness remediation"
description: "Verification checklist: each dual-review finding closed with evidence, plus the Sol Ultra re-review and strict-validation gates."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation"
    last_updated_at: "2026-07-15T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored verification checklist"
    next_safe_action: "Execute and check off T003"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Checklist: create-benchmark completeness remediation

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is checked against the real patched file with evidence (path/line, validator output, or link resolution). Findings are hypotheses until confirmed at edit time. Nothing is marked complete without a passing `validate_document.py` on the edited doc.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] P01 — Both dual-review reports archived under `evidence/`.
- [x] P02 — Findings mapped to tasks T003–T013; severity tagged.
- [ ] P03 — create-benchmark tree confirmed clean of concurrent-session edits before each group.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] Q01 — `DEFAULT_RESOURCE` resolves to an existing file; `grep references/README.md create-benchmark/SKILL.md` returns nothing. (T003)
- [ ] Q02 — Router loads `assets/shared/` for `mcp_promotion` via an explicit family-to-key map. (T003)
- [ ] Q03 — Scenario template exposes fillable v2 fields; a v2 scenario authored from it matches the runner's schema-v2 field set. (T004)
- [ ] Q04 — Index template schemaVersion wording is conditional, not hardcoded `1`. (T004)
- [ ] Q05 — No "Lane D" reference anywhere in create-benchmark. (T008)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] T01 — `command-surface` package contains a family README + `conformance_benchmark.md`; both pass `validate_document.py`. (T005)
- [ ] T02 — A v2 scenario authored from the patched template parses against the runner's schema-v2 expectations. (T004)
- [ ] T03 — Every edited doc passes `validate_document.py`; `validate.sh --strict` on this child Errors:0. (T015)
- [ ] T04 — GPT-5.6 Sol Ultra Fast re-review: no surviving P1, no new regression; report archived. (T014)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] FC01 — Every numbered P1/P2 finding in the archived reports maps to a landed fix or an explicit legacy label; none silently dropped.
- [ ] FC02 — No new finding introduced by the fixes (confirmed by the Sol Ultra re-review). (T014)
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] S01 — No secrets, credentials, or runtime code introduced; edits are documentation and templates only.
- [ ] S02 — Cross-tree edits are pathspec-scoped; no `git add -A`; concurrent-session work untouched.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] D01 — "command benchmark" routable by name (keywords + fallback line); matrix-manifest field shape documented. (T006)
- [ ] D02 — `references/shared/README.md` route-map lists all six families incl. conformance + Lane A. (T007)
- [ ] D03 — `/deep:command-benchmark`, `/deep:model-benchmark`, `/deep:agent-improvement` render as correct links. (T009)
- [ ] D04 — Lane C fixture-authoring doctrine linked from the authoring home. (T010)
- [ ] D05 — No create-benchmark guide calls the shipped `sk-doc-command` adapter "planned." (T005)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] F01 — MCP consumer README points at SKILL §4–§6 with the correct validator path; report-template href corrected. (T011)
- [ ] F02 — Lane C exemplar READMEs regenerated/labeled; sk-code naming aligned toward hyphen-pilot (no snake reversion). (T012)
- [ ] F03 — Four behavior indexes carry a create-benchmark back-pointer. (T013)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Completion requires every Q/T/D/F item checked with evidence, both review reports archived, the Sol Ultra re-review clean of surviving P1, `validate.sh --strict` Errors:0, and all fixes committed pathspec-scoped + FF-pushed to `skilled/v4.0.0.0`.
<!-- /ANCHOR:summary -->
