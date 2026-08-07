---
title: "cli-copilot Dispatch Test Parity: close F-004 P2 from 011 deep-review"
description: "Rewrote the cli-copilot section of cli-matrix.vitest.ts to exercise buildCopilotPromptArg directly instead of the legacy resolveCopilotPromptArg command-string form. Covers all three targetAuthority branches, pins the YAML write-then-dispatch ordering on both auto-loop YAML files. Closes the F-004 P2 silent-regression risk identified in the 011 deep-review."
trigger_phrases:
  - "cli-copilot dispatch test parity"
  - "F-004 cli-matrix fix"
  - "buildCopilotPromptArg test coverage"
  - "cli-matrix vitest rewrite"
  - "promptFileBody dispatch test"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/017-cli-copilot-dispatch-test-parity` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings`

### Summary

The 011 deep-review surfaced F-004 [P2]: the cli-copilot branch of `cli-matrix.vitest.ts` still asserted the legacy `resolveCopilotPromptArg` command-string form (`-p "$(cat ...)"` and `Read the instructions in @path`) while packet 012 had already moved the production dispatch onto `buildCopilotPromptArg`, which returns a typed `{ argv, promptBody, promptFileBody?, enforcedPlanOnly }` struct and writes `built.promptFileBody` to disk before invoking copilot. The test passed only because `resolveCopilotPromptArg` remained exported as a compatibility shim. A future refactor of the helper's argv layout, preamble emission or `promptFileBody` discriminator would silently break the dispatch contract without failing the test.

This packet rewrote the cli-copilot section of `cli-matrix.vitest.ts` to exercise `buildCopilotPromptArg` directly across all three `targetAuthority` branches. A static-grep ordering check was added on both `_auto.yaml` dispatch files to pin the write-then-dispatch invariant. The smoke test was updated to model the approved-authority large-prompt happy path. Production code was not touched. The test count increased from 11 to 13 (five new cases added, three legacy cases removed). All 13 pass. The 011 deep-review §7 Packet B PASS gate is satisfied.

### Added

- New `cli-matrix cli-copilot dispatch shape (buildCopilotPromptArg)` describe block with 5 cases covering `kind:"approved"` small prompt, `kind:"approved"` large prompt, `kind:"missing"+writeIntent:false`, `kind:"missing"+writeIntent:true`. Also covers YAML write-then-dispatch ordering for both `_auto.yaml` files.
- Module-level constants `COPILOT_BASE_ARGV` and `APPROVED_FOLDER`, plus repo-root anchored YAML path references using `fileURLToPath(import.meta.url)` + `dirname` + `resolve`
- `buildCopilotPromptArg` import replacing the removed `resolveCopilotPromptArg` import

### Changed

- `buildDispatchCommand` cli-copilot branch replaced with a loud `throw new Error(...)` pointing future maintainers to `buildCopilotPromptArg`. The `promptSizeBytes` parameter was also removed because no remaining kind needs it.
- Smoke test (`exercises the large-prompt ... with a real subprocess`) updated to model the approved-authority large-prompt path with `promptFileBody` written to disk before subprocess dispatch instead of calling `resolveCopilotPromptArg` directly

### Fixed

- Legacy cli-copilot tests asserted the obsolete `-p "$(cat ...)"` / `Read the instructions in @path` command-string form. The new tests assert `built.argv` and `built.promptFileBody` shape, so a regression in `buildCopilotPromptArg`'s argv layout, preamble emission or `promptFileBody` discriminator now fails the test rather than going undetected.

### Verification

| Check | Result |
|-------|--------|
| Updated `cli-matrix.vitest.ts` (13 tests) | PASS. Tests 13 passed (13). Exit 0. 1.22s. |
| Full deep-loop suite (`tests/deep-loop/`) | PASS. Tests 73 passed (73). 6 test files. Exit 0. 1.70s. |
| `executor-config-copilot-target-authority.vitest.ts` (29 tests) | PASS. Tests 29 passed (29). Exit 0. 122ms. |
| Legacy `resolveCopilotPromptArg` reference removed from cli-matrix imports | PASS. `grep` confirms 0 hits in import lists. |
| Legacy `-p "$(cat ...)"` and `Read the instructions in @path` removed from test bodies | PASS. `grep` confirms 0 hits in describe-block bodies. |
| `buildCopilotPromptArg` exercised directly in test bodies | PASS. `grep` returns 5+ hits (1 import plus 4+ invocations). |
| YAML write-then-dispatch ordering pinned for both `_auto.yaml` files | PASS. Vitest case asserts `writeIdx >= 0` and `dispatchIdx > writeIdx` on both files. |
| Production code byte-stable | PASS. `git status` shows only `cli-matrix.vitest.ts` and packet docs in the diff. |
| `validate.sh --strict` on packet | PASS. Zero structural errors. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/cli-matrix.vitest.ts` | Rewrote cli-copilot dispatch tests and smoke test against `buildCopilotPromptArg`. Approximately +150 / -55 LOC. |

### Follow-Ups

- Run live cli-copilot dispatch verification on the next deep-research or deep-review run that exercises cli-copilot. Confirm the `## TARGET AUTHORITY` preamble appears in the rendered iteration prompt and zero unauthorized folder mutations occur. Tracked as a P2 item in `checklist.md` (same item deferred from packet 012).
- Ship sibling packet 016 (Degraded-readiness envelope parity, P1) to satisfy the 011 deep-review CONDITIONAL to PASS conversion. This packet is independent but required for the verdict flip.
- Ship sibling packet 018 (Feature catalog and playbook degraded alignment, P2) to close findings F-005 and F-007. Tracked at the 011 phase-parent level.
