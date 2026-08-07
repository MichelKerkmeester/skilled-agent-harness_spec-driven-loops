---
title: "Checklist: README, agent, command, changelog, flowchart, diff, and benchmark generators (020 phase 003 child 003)"
description: "Blocking SOL verifier contract for seven create-* generator families and their kebab-case output paths."
trigger_phrases:
  - "create workflow artifact naming checklist"
  - "readme agent command benchmark naming checklist"
  - "hyphenated create output checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Verified all seven create-* output families and completed the acceptance contract"
    next_safe_action: "No child work remains"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: README, Agent, Command, Changelog, Flowchart, Diff, and Benchmark Generators

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for child 003. The verifier records the candidate SHA, BASE SHA,
commands, exit codes, family name, input slug, output root, exact-name manifest, generated-tree listing, and link/path
resolution result. It fails on zero family coverage, stale non-exempt output rules, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-006 [P0] The candidate is scoped to the seven listed generator packets and preserves the create-skill/catalog/playbook and command-asset child boundaries. Evidence: `git diff --name-only -- <seven-scope-paths>` lists only the approved generator directories.
- [x] CHK-007 [P2] The report records the pinned BASE SHA and rename-map hash, or explicitly records that this generator-only check has no map input. Evidence: BASE `1ec0ad2947b19ac3053c7b031b7d43e67bf42bbe`; no rename map is an input to this emission-only child.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-008 [P1] Changes are limited to packet guidance/templates and focused generator tests/fixtures; no existing output tree, source-template filename, scorer, or renderer is renamed. Evidence: `git diff --name-status -- <seven-scope-paths>` reports modified files only and `git diff --check` exits 0.
- [x] CHK-009 [P2] YAML/JSON keys, code identifiers, Python names, frontmatter fields, version syntax, `README.md`, `SKILL.md`, and other confirmed tool contracts remain unchanged. Evidence: the temporary exact-name manifest preserves `README.md`, `mcp_server`, `model_benchmark`, `v1.2.3.4.md` and `DAB-001-verify-first.md`.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] README/install-guide fixtures write their expected tool-mandated files and show zero non-exempt underscore directory/file segments in the output listing. Evidence: the disposable tree reports `families=7/7`, `files=24` and `underscore-violations=0`.
- [x] CHK-002 [P0] Agent and command fixtures prove the generated file stem and namespace segments match the validated lowercase hyphenated input. Evidence: `migration-engineer.md` and `spec-kit/create-packet.md` appear in the verified output listing.
- [x] CHK-003 [P0] Changelog, flowchart, and diff fixtures prove compliant component/target paths while preserving version filename and create-diff preview boundaries. Evidence: `v1.2.3.4.md`, `release-workflow.md` and `release-notes.diff.html` pass the output-tree audit; `test_create_diff.py` passes 52 tests.
- [x] CHK-004 [P0] MCP, behavior, skill-benchmark, and model-benchmark fixtures each produce a nonzero path listing with no non-exempt underscore output name and a recorded exact-name manifest. Evidence: `benchmark-subfamilies=4/4` and the exact-name manifest reports zero violations across all benchmark fixtures.
- [x] CHK-005 [P0] Every packet-owned output example and naming rule is checked for stale non-exempt underscore emissions; current source-template filenames are recorded as source paths, not output claims. Evidence: the named `stale-output-name audit` exits 0 and all 30 changed generator Markdown files pass `validate_document.py`.
- [x] CHK-010 [P0] Invalid or ambiguous names are rejected or explicitly resolved by the semantic naming boundary; no blind global underscore-to-hyphen replacement is used. Evidence: `test_explicit_report_name_rejects_underscore`, `test_explicit_report_name_rejects_non_suffix_dot` and `test_default_report_name_is_derived_as_kebab_case` pass.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-011 [P1] The seven family reports include output paths, path/link resolution evidence, exit codes, and the exact-name/exemption manifest used by the scan. Evidence: the disposable output command exits 0 with `7/7` families, `4/4` benchmark subfamilies, 24 listed files and the complete exemption manifest.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-012 [P2] Explicit user target paths remain inside their requested roots, and no new write authority, evaluator authority, or preview-engine behavior is introduced. Evidence: `test_existing_report_is_not_overwritten` passes and benchmark scorer or renderer files remain outside the scoped diff.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-013 [P2] Each packet's guidance and templates describe the same emitted naming rule proved by its fixture and state the relevant exemption boundary. Evidence: `validate_document.py` passes all 30 changed generator Markdown files.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-014 [P1] Family fixture outputs and reports are disposable; the candidate worktree contains no generated artifact or unrelated tracked change after verification. Evidence: `mktemp -d` plus the EXIT cleanup trap removes the 24-file fixture tree, and scoped `git status --short` lists only intended source and packet files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The child is accepted only when every P0 item passes for all seven families, each family has nonzero path evidence, and
the reports show that exact-name exemptions were classified before the kebab-case scan.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
