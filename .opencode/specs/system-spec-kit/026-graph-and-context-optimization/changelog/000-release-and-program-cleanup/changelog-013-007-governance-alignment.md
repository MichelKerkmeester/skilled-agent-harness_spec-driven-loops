---
title: "013/007 Governance Alignment"
description: "Ten governance drift findings were fixed across sk-doc, sk-code and constitutional docs, including frontmatter guidance, command-section rules, comment hygiene enforcement and alignment verifier severity."
trigger_phrases:
  - "013/007 governance alignment"
  - "governance alignment changelog"
  - "comment hygiene checker broadened"
  - "verify alignment drift severity"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/007-governance-alignment`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation`

### Summary

Ten governance drift findings are resolved across sk-doc, sk-code and constitutional docs. Spec frontmatter guidance now validates required Spec Kit frontmatter instead of telling agents to remove it, command-section requirements match the live validator registry, filename standards allow packet-local hyphenated docs, comment hygiene detection and enforcement docs match the constitutional rule, semantic code-search fallback guidance routes to Grep and Glob and the alignment verifier no longer false-positives on Python scripts shipped with `.sh` extensions while treating header and shebang gaps as errors.

### Added

- Filename exception language allowing `NNN-name.md` packet-local documents to use hyphens
- Comment hygiene detection for seven forbidden patterns from the constitutional examples
- Documentation for three comment-hygiene enforcement gates, the pre-commit environment bypass, the non-bypassable CI gate and the per-line `// hygiene-ok` false-positive escape
- Tests for alignment verifier ERROR promotion and Python `.sh` guard behavior

### Changed

- sk-doc frontmatter guidance for spec files now instructs agents to validate and generate required fields from Spec Kit templates
- Command required-section guidance now matches the runtime authority: required `purpose` and `instructions`, recommended `contract`, `examples` and `notes`
- Tool-routing constitutional guidance now says semantic code-search fallback is Grep and Glob, not `memory_search`
- Three sk-code docs now invoke `check-comment-hygiene.sh` through its shebang instead of `bash`
- `verify_alignment_drift.py` now treats shebang and module-header rules as ERROR-level integrity rules

### Fixed

- `check-comment-hygiene.sh` now catches bare REQ ids, CHK ids, task ids, checklist item labels, Pn finding labels, finding-number labels and top-level spec-folder paths matching the constitutional examples
- `verify_alignment_drift.py` now returns no shell findings for files whose first line is `#!/usr/bin/env python3`, preventing false SH-SHEBANG and SH-STRICT-MODE findings on Python scripts with `.sh` names

### Verification

- `check-comment-hygiene.sh` scratch test with seven forbidden patterns: PASS, exit 1
- `check-comment-hygiene.sh` scratch test with a clean file: PASS, exit 0
- `pytest test_verify_alignment_drift.py -v`: PASS, 11 tests in 0.11s
- `verify_alignment_drift.py` on `sk-code/scripts`: PASS, 0 false SH-SHEBANG findings
- `validate.sh --strict` on `007-governance-alignment`: PASS, Errors 0

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | Modified | Spec frontmatter guidance validates instead of removes |
| `.opencode/skills/sk-doc/references/global/quick_reference.md` | Modified | Command required-section list |
| `.opencode/skills/sk-doc/references/global/core_standards.md` | Modified | Command sections and filename exception |
| `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` | Modified | Enforcement gate count, bypass and `hygiene-ok` guidance |
| `.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md` | Modified | Semantic fallback changed to Grep and Glob |
| `.opencode/skills/sk-code/SKILL.md` | Modified | Removed broken `bash` prefix |
| `.opencode/skills/sk-code/references/universal/code_quality_standards.md` | Modified | Removed broken `bash` prefix |
| `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md` | Modified | Removed broken `bash` prefix |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Modified | Broadened violation patterns |
| `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py` | Modified | Python `.sh` guard and ERROR severity set |
| `.opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py` | Modified | ERROR promotion and Python `.sh` guard tests |

### Follow-Ups

- The spec-path hygiene pattern may miss numeric-only spec folders such as `specs/042/`. The constitutional examples all use hyphenated names, so that edge case stayed out of scope.
- The doc now references `.github/workflows/comment-hygiene.yml`. The implementation summary notes the file's existence was not verified in-session and came from audit evidence.
