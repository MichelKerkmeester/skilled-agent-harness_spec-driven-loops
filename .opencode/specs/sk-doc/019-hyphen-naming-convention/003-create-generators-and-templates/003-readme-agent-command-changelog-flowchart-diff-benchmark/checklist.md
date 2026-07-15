---
title: "Checklist: README, agent, command, changelog, flowchart, diff, and benchmark generators (017 phase 003 child 003)"
description: "Blocking SOL verifier contract for seven create-* generator families and their kebab-case output paths."
trigger_phrases:
  - "create workflow artifact naming checklist"
  - "readme agent command benchmark naming checklist"
  - "hyphenated create output checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/003-create-generators-and-templates/003-readme-agent-command-changelog-flowchart-diff-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the SOL acceptance contract for seven create-* output families"
    next_safe_action: "Run one nonzero temporary generation for each family and inspect every path"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] CHK-006 [P0] The candidate is scoped to the seven listed generator packets and preserves the create-skill/catalog/playbook and command-asset child boundaries.
- [ ] CHK-007 [P2] The report records the pinned BASE SHA and rename-map hash, or explicitly records that this generator-only check has no map input.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Changes are limited to packet guidance/templates and focused generator tests/fixtures; no existing output tree, source-template filename, scorer, or renderer is renamed.
- [ ] CHK-009 [P2] YAML/JSON keys, code identifiers, Python names, frontmatter fields, version syntax, `README.md`, `SKILL.md`, and other confirmed tool contracts remain unchanged.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] README/install-guide fixtures write their expected tool-mandated files and show zero non-exempt underscore directory/file segments in the output listing.
- [ ] CHK-002 [P0] Agent and command fixtures prove the generated file stem and namespace segments match the validated lowercase hyphenated input.
- [ ] CHK-003 [P0] Changelog, flowchart, and diff fixtures prove compliant component/target paths while preserving version filename and create-diff preview boundaries.
- [ ] CHK-004 [P0] MCP, behavior, skill-benchmark, and model-benchmark fixtures each produce a nonzero path listing with no non-exempt underscore output name and a recorded exact-name manifest.
- [ ] CHK-005 [P0] Every packet-owned output example and naming rule is checked for stale non-exempt underscore emissions; current source-template filenames are recorded as source paths, not output claims.
- [ ] CHK-010 [P0] Invalid or ambiguous names are rejected or explicitly resolved by the semantic naming boundary; no blind global underscore-to-hyphen replacement is used.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P1] The seven family reports include output paths, path/link resolution evidence, exit codes, and the exact-name/exemption manifest used by the scan.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-012 [P2] Explicit user target paths remain inside their requested roots, and no new write authority, evaluator authority, or preview-engine behavior is introduced.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P2] Each packet's guidance and templates describe the same emitted naming rule proved by its fixture and state the relevant exemption boundary.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-014 [P1] Family fixture outputs and reports are disposable; the candidate worktree contains no generated artifact or unrelated tracked change after verification.
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
