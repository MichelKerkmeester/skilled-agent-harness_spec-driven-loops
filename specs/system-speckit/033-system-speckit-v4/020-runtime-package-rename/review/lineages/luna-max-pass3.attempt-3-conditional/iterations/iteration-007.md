# Deep Review Iteration 7

## Review metadata

- Session: fanout-luna-max-pass3-1788562574615-h6l4fh
- Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
- Dimension: traceability
- Angle: exact live-surface residue, preserved advisor boundary, and acceptance-claim coherence
- Prior active findings: DR-001, DR-002, DR-003, DR-004
- Executor: inline cli-codex, model gpt-5.6-luna

## Evidence reviewed

- The runtime ENV reference explicitly labels advisor mcp-server paths as owned by the preserved skill advisor and says they are not read by this package. [SOURCE: .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:307-318]
- The CLI section likewise distinguishes the removed spec-memory CLI from the surviving advisor CLI. [SOURCE: .opencode/skills/system-spec-kit/runtime/ENV-REFERENCE.md:360-374]
- The current validate front end resolves the moved runtime orchestrator and gives the new build command in both stale and missing-dist paths. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:274-301]
- A bounded exact search over live runtime, scripts, hook, CI, and root surfaces returned no system-spec-kit/mcp-server or @spec-kit/mcp-server matches. The search excluded generated, historical, benchmark, archive, and fixture corpora as required by the packet scope.
- Generic old vocabulary remains in current fixture guidance, the root stress-test link label, and the Devin fallback text. [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/fixtures/README.md:3,13,38] [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/fixtures/hooks/README.md:33] [SOURCE: .devin/hooks.v1.json:35] [SOURCE: README.md:771]
- The acceptance table still reports AC-006 Met while AC-010 is Unmet. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/acceptance-criteria.md:62-66]

## Finding refinement

### DR-003 [P2] Current runtime guidance retains retired server vocabulary

- File: .opencode/skills/system-spec-kit/runtime/tests/fixtures/README.md:3,13,38
- Evidence: The preserved advisor boundary is documented correctly, but current runtime fixture documentation and a runtime recovery message still use MCP-server or mcp_server as the package owner. The root README label also calls the runtime package mcp-server even though the link target is runtime. These references are not exact old paths, so the hard residue invariant passes, but the live guidance remains misleading.
- Finding class: matrix/evidence
- Scope proof: Exact path/name search and preserved-set review were performed independently. The advisory finding is limited to current runtime labels and instructions, not the explicit advisor references.
- Affected surface hints: runtime fixture documentation, Devin fallback, root README stress-test section
- Recommendation: Replace current runtime labels with runtime and retain MCP wording only where the advisor package or historical evidence is the subject.

## Cross-reference result

- Preserved advisor references: PASS. The runtime ENV reference clearly scopes them to system-skill-advisor.
- Exact old path and npm name: PASS for the bounded live scan, with no output and exit 1.
- spec_code: PARTIAL because the dependency consumer proof for AC-006 is still missing.
- checklist_evidence: PARTIAL because AC-010 and T009 remain open and AC-006 is overstated.

## Dimension result

- Traceability: CONDITIONAL. Exact path residue is clean, but DR-003 remains an advisory documentation issue and DR-004 remains a required dependency-contract issue.
- Correctness: CONDITIONAL because DR-001 and DR-004 remain active.
- Security: PASS with DR-002 advisory.
- Maintainability: PASS with DR-003 advisory.
- New findings: 0 P0, 0 P1, 0 P2. Refined findings: DR-003.
- Convergence: telemetry only. Continue to the configured maximum.

## Next angle

Iteration 8 broadens maintainability into a consumer matrix: docs, test anchors, helper comments, fallback messages, and the distinction between current runtime and preserved advisor ownership.

Review verdict: CONDITIONAL
