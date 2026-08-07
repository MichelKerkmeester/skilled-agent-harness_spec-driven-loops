---
title: "Deep-Review Iteration Prompt Hardening Specification"
description: "Authored a specification for hardening the deep-review iteration dispatch prompt with explicit allowed-write paths and a destructive-verb ban after deepseek-v4-pro deleted 44 files during an automated review run."
trigger_phrases:
  - "rm-8"
  - "deep-review scope violation"
  - "prompt hardening"
  - "destructive scope violation"
  - "deepseek deleted files"
  - "deep-review safety"
importance_tier: "normal"
contextType: "research"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels/009-harden-deep-review-iteration-prompts` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/003-template-levels`

### Summary

The deep-review iteration dispatch hands executors unrestricted filesystem write access but only a single prose line guards against modifications to reviewed files. On 2026-05-04 a deepseek-v4-pro dispatch under `/deep:start-review-loop:auto` deleted 44 files across two phase folders. This packet authored the specification for tightening the dispatch prompt template with an explicit allowed-write list and a ban on destructive shell verbs.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

- spec.md authored with RM-8 evidence from cross-phase review synthesis

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| Packet docs (spec, plan, tasks, checklist, implementation-summary) | Created | Scoped packet documentation for prompt hardening specification |

### Follow-Ups

- Insert an allowed-write list into the CONSTRAINTS block of `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`
- Insert a destructive-verb ban forbidding rm, git rm, mv, sed -i, rmdir, output-redirect truncate, and find -delete in the same template
- Insert a scope_violation finding instruction for would-be out-of-scope mutations in the same template
- Smoke-test with a cli-opencode plus deepseek-v4-pro dispatch and verify no surprise writes outside the review directory
