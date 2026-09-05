# Deep Review Iteration 8

## Review metadata

- Session: fanout-luna-max-pass3-1788562574615-h6l4fh
- Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
- Dimension: maintainability
- Angle: consumer matrix across Pi adapters, source-dist checks, operator docs, and runtime test guidance
- Prior active findings: DR-001, DR-002, DR-003, DR-004
- Executor: inline cli-codex, model gpt-5.6-luna

## Evidence reviewed

- The Pi shared adapter documents the moved runtime hook owner at `.opencode/skills/system-spec-kit/runtime/hooks/pi/lib/claude-hook-adapter.ts` and distinguishes lifecycle ownership from adapter responsibilities. [SOURCE: .pi/extensions/lib/README.md:16-18,42-47]
- The Pi extension map keeps runtime lifecycle hooks under `system-spec-kit/runtime` while keeping `prompt-advisor.ts` under the preserved `system-skill-advisor/mcp-server` package. [SOURCE: .pi/extensions/README.md:23-29,67-71,95-99]
- The source-dist alignment checker has separate entries for `runtime/lib` and `system-skill-advisor/mcp-server`, so the preserved advisor target is not conflated with the renamed runtime target. [SOURCE: .opencode/skills/system-spec-kit/scripts/evals/check-source-dist-alignment.ts:136-150]
- Operator documentation still calls the runtime ENV reference the MCP server's reference and labels the runtime stress-test link `mcp-server/`, even though both targets point at the runtime package. [SOURCE: .opencode/bin/README.md:177-183] [SOURCE: README.md:771]
- The runtime fixture guidance, hook fixture guidance, and Devin fallback retain the same generic MCP-server or `mcp_server` vocabulary recorded in DR-003. [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/fixtures/README.md:3,13,38] [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/fixtures/hooks/README.md:33] [.devin/hooks.v1.json:35]
- A bounded exact search over the live surface still returned no `system-spec-kit/mcp-server` or `@spec-kit/mcp-server` matches. Preserved advisor and historical references remain outside that negative invariant.

## Finding refinement

### DR-003 [P2] Current runtime guidance retains retired server vocabulary

- File: .opencode/bin/README.md:183; README.md:771; .opencode/skills/system-spec-kit/runtime/tests/fixtures/README.md:3,13,38; .opencode/skills/system-spec-kit/runtime/tests/fixtures/hooks/README.md:33; .devin/hooks.v1.json:35
- Evidence: The consumer matrix confirms that executable ownership and source-dist targets are correctly separated. The remaining issue is terminology in current operator and fixture guidance. The labels can send a maintainer to treat the runtime package as an MCP server even when the linked path is the library runtime.
- Finding class: matrix/evidence
- Scope proof: Runtime-owned adapters, preserved advisor adapters, and source-dist targets were checked independently. The finding is limited to generic current labels and does not classify explicitly scoped advisor references as residue.
- Affected surface hints: operator README, root stress-test link label, runtime fixture guidance, Devin fallback
- Recommendation: Rename current runtime labels to runtime or engine and retain MCP wording only where the advisor package or historical evidence is the subject.

## Cross-reference result

- Consumer ownership: PASS. Pi runtime adapters and the advisor prompt adapter point to their intended packages.
- Source-dist alignment: PASS for the reviewed runtime and preserved advisor target split.
- Exact old path and npm name: PASS for the bounded live scan, with no output and exit 1.
- Documentation traceability: CONDITIONAL because DR-003 remains open.
- spec_code: PARTIAL because the dependency consumer proof for AC-006 is still missing.

## Dimension result

- Maintainability: CONDITIONAL. The ownership matrix is coherent, but current guidance contains stale generic labels under DR-003.
- Correctness: CONDITIONAL because DR-001 and DR-004 remain active.
- Security: PASS with DR-002 advisory.
- Traceability: CONDITIONAL with DR-003 and the deferred AC-006 evidence mismatch.
- New findings: 0 P0, 0 P1, 0 P2. Refined findings: DR-003.
- Convergence: telemetry only. Continue to the configured maximum.

## Next angle

Iteration 9 rechecks the public API, package manifests, TypeScript references, build ownership, and model-server import boundary for rename correctness and dependency evidence.

Review verdict: CONDITIONAL
