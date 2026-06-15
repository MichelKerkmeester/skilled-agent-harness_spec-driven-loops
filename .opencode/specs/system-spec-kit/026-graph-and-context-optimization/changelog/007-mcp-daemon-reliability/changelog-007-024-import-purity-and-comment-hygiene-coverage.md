---
title: "Changelog: Import purity and comment-hygiene checker coverage [007-mcp-daemon-reliability/024-import-purity-and-comment-hygiene-coverage]"
description: "Chronological changelog for the Import purity and comment-hygiene checker coverage phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/024-import-purity-and-comment-hygiene-coverage` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The two open follow-ups from the daemon-reliability cross-check are closed. Importing the code-index launcher no longer rewrites your environment or prints to stderr, and the comment-hygiene checker now catches the perishable-label classes that used to slip past it. Two gpt-5.5 agents implemented the fixes in parallel on disjoint files.

### Added

- Require-purity regression test (launcher-code-index-import-purity.vitest.ts) that fresh-requires the code-index launcher and asserts process.env is byte-identical across the import
- Extended comment-hygiene checker patterns for RC-N, single-number DR-N, hyphen phase-NNN, and council P#-Seat# labels, plus inline trailing comment scanning in check-comment-hygiene.sh
- Should-flag and should-pass checker test (check-comment-hygiene.test.sh) covering all five label classes including inline comments and the hygiene-ok escape

### Changed

- Deferred env side effects (dotenv loading, maintainer-mode flags, stderr writes) into bootstrapLauncherEnv() behind the require.main guard in mk-code-index-launcher.cjs so importing the module is side-effect-free
- Scrubbed perishable RC, DR, phase, and finding labels to durable intent in mk-spec-memory-launcher.cjs, model-server-supervision.cjs, launcher-watchdog.vitest.ts, and mk-code-index-launcher.cjs
- Ran node --check on all three edited launchers and vitest suites (30/30 pass)

### Fixed

- Requiring mk-code-index-launcher.cjs for test imports used to load dotenv files into process.env, force maintainer-mode flags, and write to stderr; env side effects now live behind the entrypoint guard so the module is import-safe
- The comment-hygiene checker missed RC, DR, phase, and seat label classes in comments, allowing perishable identifiers to accumulate; the extended patterns and inline scanning close that gap

### Verification

- node --check on the three edited launchers - PASS
- vitest: import-purity, code-index-proxy, watchdog - PASS, 30/30
- require() of the code-index launcher prints nothing - PASS
- Checker self-test - PASS, all cases
- Should-flag probe (RC-2, inline REQ-3, DR-005, phase-004, P1-Seat2) - PASS, exit 1
- Should-pass probe (CWE, RFC, POSIX, V16, RC-no-number, hygiene-ok) - PASS, exit 0
- Extended checker on the four scrubbed files plus three launchers - PASS, all clean
- validate.sh --strict on this packet - PASS

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | Defer env side effects into bootstrapLauncherEnv(); scrub one council label |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-code-index-import-purity.vitest.ts` | Created | Require-purity regression test |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Modified | Add RC/DR-single/phase-hyphen/seat patterns and inline-comment scanning |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.test.sh` | Created | Should-flag and should-pass checker test |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Scrub RC and packet-test labels to durable WHY |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | Scrub DR and phase labels to durable WHY |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-watchdog.vitest.ts` | Modified | Scrub the finding-label comment to durable WHY |

### Follow-Ups

- F-notation stays review-owned. The checker does not flag F\d+ finding labels because the false-positive rate is too high. Genuine F labels rely on review.
- Repo-wide label backlog remains. About forty single-number DR-N labels and others elsewhere in the tree are not scrubbed here. They are a separate follow-on.
- No git pre-commit wiring yet. The extended checker runs through the PostToolUse hook. Wiring it into git pre-commit waits until the repo-wide backlog is scrubbed, so it does not block concurrent sessions.
