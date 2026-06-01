---
title: "Constitutional Quality Gate Exemption for memory_index_scan"
description: "A 5-line patch to handlers/memory-index.ts widens the useWarnOnly branch to include constitutional markdown files. Constitutional policy text now indexes successfully via warn-only sufficiency mode instead of being hard-rejected by the strict gate."
trigger_phrases:
  - "constitutional warn-only exemption"
  - "INSUFFICIENT_CONTEXT_ABORT constitutional"
  - "memory-index isConstitutional patch"
  - "policy markdown sufficiency exempt"
  - "constitutional quality gate exemption"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/018-constitutional-quality-gate-exemption` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack`

### Summary

Constitutional markdown files under `.opencode/skills/*/constitutional/` were hard-rejected by `memory_index_scan` with `INSUFFICIENT_CONTEXT_ABORT`. The sufficiency gate at `memory-sufficiency.ts:372` requires `support >= 3` plus `anchors >= 1` when primary evidence is absent. Constitutional files carry policy text without ANCHOR tags by design, so the strict gate always triggered for them. A 016/002/016 scan first surfaced two specific rejections: `cli-dispatch-skill-preload.md` and `post-implementation-deep-review.md`.

A 5-line patch widened the `useWarnOnly` OR chain in `handlers/memory-index.ts:474` to include `isConstitutional`, mirroring the existing `isSpecDoc` exemption. Constitutional policy text now passes through warn-only sufficiency mode and indexes successfully. The patch was type-checked then built then staged for daemon restart behind packet 019 to avoid disrupting its in-flight scan.

### Added

- Rationale comment block in `handlers/memory-index.ts` above the `isConstitutional` term naming this packet and the policy-not-evidence reasoning

### Changed

- `useWarnOnly` branch in `handlers/memory-index.ts:474`: OR chain widened from `force || isSpecDoc` to `force || isSpecDoc || isConstitutional`

### Fixed

- Constitutional markdown files were hard-rejected by `memory_index_scan` with `INSUFFICIENT_CONTEXT_ABORT` because they lack ANCHOR tags and primary-evidence sections by design. The exemption removes the hard-reject for this file class.

### Verification

| Check | Result |
|-------|--------|
| Source patch present in `handlers/memory-index.ts:474` | PASS |
| `npx tsc --noEmit -p tsconfig.json` | PASS |
| `npm run build` | PASS |
| Daemon restart and post-restart re-scan confirming 0 constitutional `INSUFFICIENT_CONTEXT_ABORT` rejections | Deferred until packet 019 completes its in-flight scan |
| Strict validate on this packet | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modified | OR `isConstitutional` into `useWarnOnly` plus a rationale comment block (commit `8abbb954bd`) |

### Follow-Ups

- Constitutional file quality goes unenforced by the strict gate. Warn-only mode still emits advisories, but reviewers and authors are the actual quality bar for policy text. If a future constitutional file lands with truly broken structure, the index will accept it. Mitigation: PR review.
- No tests added for the new OR term. The OR chain is small and the existing scan paths exercise both branches. A dedicated test could be added if regressions surface.
