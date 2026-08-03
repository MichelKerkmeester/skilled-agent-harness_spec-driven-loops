---
title: "Implementation Summary: Code README Standard And Enforcement"
description: "Implementation and verification receipts for the accepted code-folder README standard, opt-in validator mode, and manifest-driven auditor."
trigger_phrases:
  - "code readme enforcement implementation"
  - "code folder validator mode"
  - "readme manifest handoff"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement"
    last_updated_at: "2026-08-02T12:20:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the code-folder README contract"
    next_safe_action: "Downstream phases consume the handoff and leave this validator mode opt-in"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The tree rule is shape-conditional: immediate subdirectory count greater than zero requires a fenced tree; a flat folder accepts a complete inventory table."
      - "General README format rules bind code-folder READMEs except the tagline."
      - "A designated orientation file may replace README.md when it passes the same Overview and inventory check."
---
# Implementation Summary: Code README Standard And Enforcement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-code-readme-standard-and-enforcement |
| **Prepared** | 2026-08-02 |
| **Level** | 3 |
| **Status** | In Progress — implementation receipts recorded; downstream sweep remains separate |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The accepted operator rulings are now expressed in the authoring skill, code-folder template, checklist, and HVR guidance. The validator has a new explicit `code_folder` mode while the existing `readme` branch and its rule data remain unchanged. The auditor now discovers durable directories across the repository roots, applies the 21-class exclusion vocabulary, and checks a persisted manifest.

The fixture corpus covers nine negative classes, one flat-folder table pass, one positive control, and 21 exclusions. The control includes a legitimate validator command so the durability check distinguishes examples from durable leaks.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

The implementation was delivered in four bounded lanes: authoring-surface reconciliation, fixture construction, opt-in validator extension, and manifest-driven auditor discovery. The baseline verdict dump was captured before validator and rule-data edits; the full suite and parity runner then verified behavior without changing existing README files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Applied rule |
|----------|--------------|
| ADR-001 | Count immediate subdirectories mechanically. Nested folders require a fenced Directory Tree; flat folders may use a complete inventory table. |
| ADR-002 | Apply numbering, ALL-CAPS H2 casing, separators, language-tagged fences, no-TOC, and no-anchor rules to code-folder READMEs; exclude only the tagline. |
| ADR-003 | Permit a manifest-designated orientation file to supply Overview and inventory in place of README.md, recording the exemption. |
| ADR-004 | Keep the new validator branch opt-in and prove existing verdict parity with a full-corpus diff. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Receipt |
|-------|--------|---------|
| Baseline verdict dump | PASS | `code-folder/baseline-readme-verdicts.json`; 759 existing README files |
| Code-folder fixtures | PASS | 9 negatives flagged with expected rule IDs; flat table and positive control pass |
| Full test suite | PASS | 23/23 runners, full output captured without `tail` |
| Verdict parity | PASS | baseline 759 files, post 759 files, diff entries 0 |
| Manifest reproduction | PASS | derived 585 directories, frozen 585, prose baseline 501, raw candidate set reproduced |
| Auditor discovery | PASS | 577 README candidates; `.pi/extensions/README.md` and `.github/workflows/README.md` included; 21/21 exclusions |
| Contradiction gate | PASS | only code-scoped-away HVR matches remain |
| Strict packet validation | PASS | `validate.sh ... --strict`; Errors: 0, Warnings: 0 |
<!-- /ANCHOR:verification -->

Measured values are 759 README parity files, 585 derived durable directories, and 7 raw gaps. They refine the research-phase estimates of 379, 501, and 122.

---

<!-- ANCHOR:handoff -->
## Handoff

For `002` class (c), `003`, and `036-019`: the accepted ruling is shape-conditional tree navigation, with a complete flat-folder inventory table as the equivalent. Invoke the validator with `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <README> --type code_folder`; the default `readme` mode remains unchanged. The auditor's source-of-truth manifest is `.opencode/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, generated and asserted by `test_readme_manifest.py`. The auditor walks `.`, `.opencode`, `.claude`, `.pi`, `.github`, and `scripts`, and records the designated orientation exemption in its manifest report. The manifest does not auto-discover `.opencode/skills/sk-design/shared/authored-brand`, `.opencode/skills/system-spec-kit/scripts/runtime-mirrors`, or `.opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges` because they are below the durability floor. Phases `002` class (c) and `036/019` must take those three folders from `002`'s specification and must not infer "no gap" from manifest absence.

This leaf does not modify existing README content. The sweep and remediation owners consume the manifest and handle the seven currently reported raw gaps.
<!-- /ANCHOR:handoff -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The prose baseline was 501 directories and no prior frozen manifest existed. The derived manifest is therefore the durable source of truth at 585 directories (+84); seven raw gaps remain for downstream ownership. No git commit was created.
<!-- /ANCHOR:limitations -->
