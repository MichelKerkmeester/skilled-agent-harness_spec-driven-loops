---
title: "17-Skill README Refinement Survey"
description: "cli-devin SWE 1.6 audited all 17 non-system skill READMEs for policy drift and autonomously refined each one across 4 parallel waves, yielding zero Section 1 tables and zero em dashes in every file."
trigger_phrases:
  - "skill README refinement"
  - "cli-devin 17-skill audit"
  - "zero section 1 tables"
  - "em dash purge skill readmes"
  - "packet-005 refinement lens"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/005-skill-advisor-documentation/006-skill-readme-refinement-survey` (Level 1)
> Parent packet: `005-skill-advisor-documentation`

### Summary

The 17 non-system skill READMEs carried the same policy drift that packet-005 had resolved in the 3 system skill READMEs: markdown tables inside Section 1 Overview and em dashes scattered through the body. cli-devin SWE 1.6 first audited all 17 READMEs, then autonomously remediated each one across 4 parallel dispatch waves. Every README now has zero tables in Section 1 Overview and zero em dashes anywhere in the body.

### Added
- None.

### Changed
- Seventeen non-system skill READMEs refined to remove every markdown table from Section 1 Overview, applying the packet-005 zero-table policy across all skills.
- Em dashes eliminated from README bodies across all 17 skills, with the largest reductions in cli-devin (29 to 0), cli-opencode (20 to 0), deep-agent-improvement (19 to 0) and sk-code (13 to 0).
- Three skills missed by the initial audit (sk-git, sk-prompt, mcp-coco-index) were detected by post-wave grep and remediated in a cleanup dispatch to also reach zero Section 1 tables.

### Fixed
- Audit false negatives for Section 1 table detection in sk-git, sk-prompt and mcp-coco-index corrected through a post-audit grep sweep and targeted remediation dispatch.

### Verification
- Em-dash count across all 17 READMEs: PASS, 0 in every file
- Section 1 table count across all 17 READMEs: PASS, 0 in every file
- Banned-word grep across all 17: PASS, only 2 sk-doc instances of "leverage" in HVR explanatory context (acceptable)
- Inappropriate cross-skill coupling audit: PASS, 0 inappropriate references
- Frontmatter drift audit: PASS, 0 drift
- Strict-validate child 006: PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| 17 skill READMEs across cli-devin, cli-opencode, cli-codex, cli-claude-code, cli-gemini, deep-agent-improvement, deep-ai-council, deep-research, deep-review, mcp-chrome-devtools, mcp-coco-index, mcp-code-mode, sk-code-review, sk-code, sk-doc, sk-git and sk-prompt | Modified | Removed Section 1 markdown tables and em dashes per packet-005 refinement policy |
| Packet docs (spec, plan, tasks, implementation-summary) | Created | Scoped packet documentation |
| research/audit-report.json, research/audit-report.md | Created | Full audit findings covering all 17 non-system skill READMEs |

### Follow-Ups
- None.
