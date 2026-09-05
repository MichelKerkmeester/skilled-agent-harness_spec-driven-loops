# Deep Review Iteration 4

## Review metadata

- Session: fanout-luna-max-pass3-1788562574615-h6l4fh
- Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
- Dimension: maintainability
- Angle: stale vocabulary, test documentation, helper comments, and follow-on change safety
- Prior active findings: DR-001, DR-002, DR-003, DR-004
- Executor: inline cli-codex, model gpt-5.6-luna

## Evidence reviewed

- The moved runtime documentation correctly describes a library package with no server or transport of its own. [SOURCE: .opencode/skills/system-spec-kit/runtime/README.md:12-28]
- Current fixture documentation contradicts that vocabulary by calling the fixtures MCP server tests and instructing operators to run from mcp_server. [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/fixtures/README.md:1-13,36-42] [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/fixtures/hooks/README.md:31-36]
- A runtime source comment still says the phase is barred from editing mcp_server TypeScript sources, even though the source file now belongs to runtime. [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:60-64]
- The shared test setup comments describe the derived database as the retired memory server's name. This is explanatory historical context, not a path or package lookup. [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:25-50]
- The runtime API barrel limits exports and documents the supported @spec-kit/runtime/api consumer boundary. [SOURCE: .opencode/skills/system-spec-kit/runtime/api/index.ts:4-18]
- The exact old path and npm-name scan remains clean over selected live surfaces. Preserved advisor references remain intentional.

## Finding refinement

### DR-003 [P2] Live docs and comments retain retired runtime vocabulary

- File: .opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs:60-64
- Evidence: The comment uses mcp_server as the current source owner while the surrounding runtime package documentation says the moved package is a library and not a server. Fixture READMEs and the root stress-test link carry the same stale current-package vocabulary. These labels do not change execution, but they make future search and maintenance decisions less reliable.
- Finding class: matrix/evidence
- Scope proof: A bounded search covered current runtime documentation, fixture guidance, helper comments, root package README, and hook fallback text. Preserved advisor paths and historical evidence were separated from current runtime references.
- Affected surface hints: runtime helper comments, runtime fixture READMEs, root README, Devin recovery message
- Recommendation: Update current-package prose and comments to runtime, and state historical or preserved-advisor ownership explicitly where MCP wording must remain.

## Ruled out

- The public API barrel is intentionally narrow and has no stale package identity. [SOURCE: .opencode/skills/system-spec-kit/runtime/api/index.ts:4-18]
- The test setup's production database protection uses runtime-relative paths and rejects explicit attempts to target the production database directory. [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/_support/vitest-setup.ts:25-50]
- The stale comment and fixture prose do not create a new runtime behavior defect. They remain a P2 maintainability issue.

## Dimension result

- Maintainability: PASS with DR-003 refined as a broader P2 vocabulary issue. No new P0 or P1 maintainability defect was found.
- Correctness: still CONDITIONAL because DR-001 and DR-004 remain active.
- Security: PASS with DR-002 advisory.
- Traceability: CONDITIONAL because the dependency audit and documentation evidence remain open.
- New findings: 0 P0, 0 P1, 0 P2. Refined findings: 1 P2.
- Convergence: telemetry only. All four dimensions are now covered, but the max-iterations policy requires continued review.

## Next angle

Iteration 5 replays correctness around freshness and dependency seams, with a clean negative check against the previously suspected cache-cleanup mismatch.

Review verdict: CONDITIONAL
