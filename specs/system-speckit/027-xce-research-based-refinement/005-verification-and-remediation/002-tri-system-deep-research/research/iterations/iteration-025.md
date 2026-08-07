# Iteration 025 — Angle 25

**Angle:** CLI path-resolution robustness: code-index.cjs invoked from arbitrary cwd; absolute-path self-resolution audit across all three front doors.

**Summary:** No functional path-resolution bug reproduced in the front doors: absolute shim invocation self-resolves correctly across all three CLIs, and code-index warm-only status works from a temp cwd. The gaps are documentation wording and missing targeted regression coverage for the arbitrary-cwd absolute-path contract.

**Findings kept:** 2

## [P2][README-MISALIGNMENT] CLI docs show repo-relative front-door paths without a cwd precondition

- Evidence: .opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md:40-45 documents `node .opencode/bin/<cli>.cjs ...`; from cwd=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode, `node .opencode/bin/code-index.cjs list-tools --names-only --format json` fails with `Error: Cannot find module '/private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/opencode/.opencode/bin/code-index.cjs'`.
- Detail: The code is cwd-robust when the shim path itself is absolute: absolute invocations from the same temp cwd returned list-tools counts `spec-memory=37`, `code-index=8`, and `skill-advisor=9`, and `code-index.cjs code_graph_status --warm-only` returned `status: ok`. The docs/readmes consistently present repo-relative paths, which are only valid from the repo root and are misleading for the arbitrary-cwd use case.
- Fix sketch: Document `node /absolute/path/to/.opencode/bin/<cli>.cjs ...` for arbitrary cwd, or explicitly state that the relative examples require running from the repository root.

## [P3][REFINEMENT] No regression test pins absolute shim invocation from non-repo cwd

- Evidence: .opencode/bin/cli-offline-smoke.cjs:51-56 uses absolute shim paths but forces `cwd: repoRoot`; .opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-harness.ts:102-104 calls the absolute shim but runChild sets `cwd: worktreeRoot` at :178-180; .opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-test-utils.ts:95-97 runs the shim with `cwd: repoRoot`.
- Detail: The current implementation appears robust by source audit and manual probes, but the test suite does not lock the exact property under this angle: absolute front-door self-resolution from an arbitrary cwd. That leaves future changes to `__dirname`, `import.meta.url`, or spawn cwd handling able to regress without a targeted failure.
- Fix sketch: Add a small offline smoke/regression that invokes all three absolute shim paths with `cwd` set to a temp directory and asserts list-tools counts 37/8/9 without daemon contact.
