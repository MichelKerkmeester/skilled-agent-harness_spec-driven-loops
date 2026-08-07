---
title: "Checklist: create-benchmark completeness remediation"
description: "Verification checklist: each dual-review finding closed with evidence, plus the Sol Ultra re-review and strict-validation gates."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/011-create-benchmark-completeness-remediation"
    last_updated_at: "2026-07-16T04:35:00Z"
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

- [x] CHK-P01 [P2] — Both dual-review reports archived under `evidence/`.
- [x] CHK-P02 [P2] — Findings mapped to tasks T003–T013; severity tagged.
- [ ] CHK-P03 [P2] — create-benchmark tree confirmed clean of concurrent-session edits before each group.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-Q01 [P1] — `DEFAULT_RESOURCE` → `references/shared/README.md` (exists); no `references/README.md` reference remains. (`3c7f512131`)
- [x] CHK-Q02 [P1] — `FAMILY_DISK_KEY` maps `mcp_promotion`→`shared`; keyed loader includes `assets/shared/`. (`3c7f512131`)
- [x] CHK-Q03 [P1] — Scenario template carries a v2 block; re-review flagged v1 evidence-kind gaps, corrected so all four evidence kinds author correctly. (`3c7f512131`, `8ab89656c6`)
- [x] CHK-Q04 [P1] — Index template schemaVersion wording echoes the scenario, not hardcoded `1`. (`3c7f512131`)
- [x] CHK-Q05 [P2] — No "Lane D" reference remains in create-benchmark. (`f82e58ba9b`)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-T01 [P1] — `command-surface` README + `conformance_benchmark.md` authored; both `validate_document.py` 0 issues. (`cec7160e47`)
- [x] CHK-T02 [P1] — v2 scaffold field set reconciled against `framework.md`; the corrected oracle verify command verifies all 13 fixtures. (`8ab89656c6`)
- [x] CHK-T03 [P1] — Per-doc `validate_document.py` 0 issues; `validate.sh --strict` on this child is Errors:0 Warnings:0 RESULT:PASSED. Fixed `recent_action` length, refreshed `source_fingerprint`, added CHK-* `[P*]` priority tags, phase headers, and evidence markers.
- [x] CHK-T04 [P1] — Sol Ultra Fast re-review executed; report archived at `evidence/review-sol-ultra-rereview.md` [evidence: evidence/review-sol-ultra-rereview.md]. **Verdict was FAIL, not clean:** confirmed regressions closed (`8ab89656c6`); structural findings escalated, then resolved as doc/template edits under operator authorization (tasks.md T016).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FC01 [P2] — Every numbered P1/P2 finding maps to a landed fix or an escalated T016 item; none silently dropped (tasks.md).
- [x] CHK-FC02 [P1] — **Not a clean pass:** the re-review DID find new regressions (N1–N9); they were verified and closed in `8ab89656c6`. Remaining structural findings are escalated, not introduced-and-hidden.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-S01 [P2] — No secrets/credentials/runtime logic introduced; edits are documentation, templates, and one router-fallback string.
- [x] CHK-S02 [P1] — Commits pathspec-scoped. **Exception:** `cec7160e47` swept 16 already-staged concurrent-session files (disclosed; content intact). All later commits use `git commit --only` (sweep-proof).
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-D01 [P2] — command-benchmark keywords + fallback line + matrix-manifest field shape (composition doc); router-overclaim prose corrected. (`f82e58ba9b`, `8ab89656c6`)
- [x] CHK-D02 [P2] — Route-map lists conformance (§12), Lane A (§14), and the composition guide. (`f82e58ba9b`)
- [x] CHK-D03 [P2] — `/deep:command-benchmark`, `/deep:model-benchmark`, `/deep:agent-improvement` render as correct links. (`f82e58ba9b`)
- [x] CHK-D04 [P2] — `scenario_authoring.md` + `create-manual-testing-playbook` corpus handoff linked. (`f82e58ba9b`)
- [x] CHK-D05 [P2] — No guide calls the `sk-doc-command` adapter "planned." (`cec7160e47`)
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-F01 [P2] — MCP README validator path + promotion-flow pointer fixed; report-template href corrected. (`413f463c22`)
- [x] CHK-F02 [P2] — Lane C exemplar READMEs labeled (no rename, no hyphen reversion); sk-code stale headline reconciled. (`91e0449be6`, `8ab89656c6`)
- [x] CHK-F03 [P2] — Four behavior indexes carry a create-benchmark back-pointer. (`91e0449be6`)
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The documentation remediation is landed and validated: all Q/T/D/F/S items are satisfied with commit evidence, all three review reports are archived, per-doc `validate_document.py` is 0 issues, and every fix is committed pathspec-scoped + FF-pushed to `skilled/v4.0.0.0`. This packet is **not** a clean "no surviving P1" pass: the Sol Ultra re-review returned FAIL, and its confirmed regressions were closed. Its deeper structural findings were escalated to the operator, then — under the operator's "Fix all" authorization — all resolved as documentation/template edits with no runtime, scorer, evaluator, or frozen-framework change (tasks.md T016). `validate.sh --strict` on this child is Errors:0 Warnings:0 RESULT:PASSED.
<!-- /ANCHOR:summary -->
