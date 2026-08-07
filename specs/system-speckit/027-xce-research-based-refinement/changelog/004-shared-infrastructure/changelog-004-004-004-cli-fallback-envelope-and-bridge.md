---
title: "Changelog: 004-cli-fallback-envelope-and-bridge"
description: "Normalized warm CLI fallback envelopes across hook helpers and added a prompt-time allowlist to the spec-memory bridge."
trigger_phrases:
  - "004/004 004 fallback envelope changelog"
  - "warm CLI fallback envelope"
  - "spec memory bridge allowlist"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-11

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/004-cli-fallback-envelope-and-bridge` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux`

### Summary

Hook helpers now emit a shared warm-fallback envelope shape with `{ status, reason, exitCode, retryable }`, while preserving existing payload fields. The spec-memory plugin bridge now rejects prompt-time mutation tool requests before warm probing.

### Added

- `warm-cli-fallback-envelope.ts` in the spec-kit MCP server hook helpers.
- Prompt-time bridge allowlist for `brief` and `status` requests only.
- Vitest coverage for the envelope contract and bridge allowlist.

### Changed

- Spec-memory, code-index, and skill-advisor CLI fallback helpers now emit the normalized envelope while retaining their existing compatibility fields.

### Fixed

- Mutation tool names sent to the prompt-time spec-memory bridge now return a structured skipped response with `route: prompt_safe_policy`, `retryable: false`, and no daemon interaction.

### Verification

| Check | Result |
|-------|--------|
| Spec-kit envelope/allowlist tests | PASS: 2 files, 4 tests |
| Skill-advisor envelope test | PASS: 1 file, 1 test |
| Typecheck and builds | PASS in spec-kit MCP server and skill-advisor MCP server |
| Plugin bridge suites | PASS: 3 files, 15 passed, 1 skipped |
| Comment hygiene | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `warm-cli-fallback-envelope.ts` | Created | Shared envelope normalizer |
| `spec-memory-cli-fallback.ts`, `code-index-cli-fallback.ts` | Modified | Normalized envelopes |
| `skill-advisor-cli-fallback.ts` | Modified | Local envelope normalizer |
| `mk-spec-memory-bridge.mjs` | Modified | Prompt-time allowlist |
| `004-cli-fallback-envelope-and-bridge/**` | Updated | Phase docs and evidence |

### Follow-Ups

- A settings-driven invocation parity suite remained red in the source checkout because `.claude/settings.local.json` lacks the expected hooks block; that is out of this phase scope.
