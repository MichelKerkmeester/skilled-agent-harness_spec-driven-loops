---
title: "Changelog: Subagent Governor Injection and Recursion Control [144-operate-like-fable-5/006-subagent-governor-recursion]"
description: "Chronological changelog for the subagent-visible governor and recursion-control phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/006-subagent-governor-recursion` (Level 3)
> Parent packet: `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5`

### Summary

The per-turn hook cannot reach deep-loop iterations and dispatched subagents, so this phase opens a separate governor channel for them. It adds recursion-control coverage, prompt-pack injection and an executor-config governor field so delegated work receives the same fable-5 efficiency doctrine as the primary agent. The work keeps malformed governor configuration loud rather than silently defaulting.

### Added

- None.

### Changed

- Opened the subagent-visible governor channel.
- Added the recursion-control rule so deep-loop iterations and dispatched subagents operate under fable-5 efficiency doctrine.
- Defined prompt-pack and agent-prompt injection.
- Defined an executor-config governor field.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| Gates defined in `checklist.md` | PENDING: will run `validate.sh` and relevant vitest suites for executor-config and prompt-pack. |
| `renderPromptPack` carries governor in both iteration templates | PENDING: `validatePromptPackTemplate` check defined. |
| `executorConfigSchema` governor field | PENDING: present, absent and malformed vitest cases defined. |
| Three agent mirrors consistent after `agent-mirror-sync.yml` | PENDING: mirror consistency check defined. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| _No file-level detail recorded._ | N/A | The extracted baseline records planned governor and recursion behavior without file-level detail. |

### Follow-Ups

- CHK-001 Requirements REQ-001 through REQ-008 documented in `spec.md` with acceptance criteria.
- CHK-002 Technical approach and ordered steps defined in `plan.md`.
- CHK-003 Phase 005 governor capsule confirmed available as the injection source.
- CHK-010 `executor-config.ts` and `prompt-pack.ts` pass TypeScript compile and lint.
- CHK-011 No new console errors or warnings from the deep-loop runtime build.
- CHK-012 Malformed governor config is rejected with a clear `ExecutorConfigError`, not a silent default.
