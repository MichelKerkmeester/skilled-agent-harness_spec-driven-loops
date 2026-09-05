# Deep Review Iteration 3

## Review metadata

- Session: `fanout-luna-max-pass3-1788556809353-mcpewh`
- Target: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename`
- Dimension: traceability
- Angle: packet contract versus live operational docs and verification claims
- Executor: inline `cli-codex`, model `gpt-5.6-luna`, max effort, fast tier
- Prior active findings carried forward: `DR-001` (P1 correctness), `DR-002` (P2 security)

## Evidence reviewed

- The packet says the runtime package must contain MCP wording only when describing something retired, and REQ-004 forbids old path/name references in live files. `[SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:47-50,118-131]`
- The packet’s review scope explicitly asks the runtime package for “no MCP name” and the scripts group for the renamed runtime references. `[SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:82-96]`
- The moved runtime manifest itself is correctly named `@spec-kit/runtime` and has no MCP description or entry point. `[SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:2-10]`
- Live runtime documentation still uses the active title “MCP Server: Spec Kit Engine,” an “MCP SERVER PACKAGE” diagram, and a library/data description that says the files serve MCP workflows. `[SOURCE: .opencode/skills/system-spec-kit/runtime/README.md:1-14,41-46]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/lib/README.md:1-17,28-33,190-198]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/data/README.md:1-13]`
- The scripts validation README still says its runtime freshness check trusts compiled `mcp_server` output, while the implementation invokes the moved `system-spec-kit/runtime` package. `[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/README.md:84-101]` `[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:274-301]`
- Test support documentation directs operators to run from `mcp_server`, and the runtime API comment still labels internal code `mcp_server`. `[SOURCE: .opencode/skills/system-spec-kit/runtime/tests/_support/README.md:11-46]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/api/index.ts:4-8]`
- Acceptance rows AC-001 through AC-009 are marked Met, while AC-010 remains Unmet; the implementation summary also records an inconclusive full suite and a known stale-reference limitation. `[SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/acceptance-criteria.md:55-66]` `[SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:163-179,198-227]`

## Finding

### DR-003 — P1 traceability — live operational docs retain the retired MCP-server identity

The moved runtime contains multiple operator-facing READMEs whose titles, diagrams, descriptions, related links, and run commands still present it as an MCP server or use `mcp_server` as the current package directory. The scripts validation README repeats the old compiled-output identity even though `validate.sh` now resolves `system-spec-kit/runtime`. These are live files in the bounded review surface, not changelogs, archived evidence, or the preserved advisor package.

Impact: users and future maintainers are directed toward a server and path that the rename explicitly retires; the live documentation contradicts the package’s new library/runtime contract and fails the packet’s no-live-residue requirement. `[SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:50,88-94,130-131]`

Suggested remediation: rename the live headings/descriptions/diagrams and command examples to runtime, remove the stale scripts validation wording, and retain MCP only where the prose explicitly explains a retired or preserved advisor surface. Re-run the live-surface residue search after the documentation edit.

#### Typed claim-adjudication packet

```json
{
  "findingId": "DR-003",
  "claimClass": "class-of-bug",
  "status": "confirmed",
  "confidence": "high",
  "producerInventory": [
    ".opencode/skills/system-spec-kit/runtime/README.md:1-14,41-46",
    ".opencode/skills/system-spec-kit/runtime/lib/README.md:1-17,28-33,190-198",
    ".opencode/skills/system-spec-kit/runtime/data/README.md:1-13",
    ".opencode/skills/system-spec-kit/scripts/spec/README.md:84-101",
    ".opencode/skills/system-spec-kit/runtime/tests/_support/README.md:11-46",
    ".opencode/skills/system-spec-kit/runtime/api/index.ts:4-8"
  ],
  "consumerInventory": [
    ".opencode/skills/system-spec-kit/scripts/spec/validate.sh:274-301",
    ".opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:50,88-94,130-131",
    "operators and maintainers reading the live package documentation"
  ],
  "adversarialChecks": [
    "preserved system-skill-advisor/mcp-server references were excluded by the packet’s preserved-set rule",
    "historical evidence directories were excluded by the packet’s review boundary",
    "runtime/package.json has the new name, so the residue is documentation/identity drift rather than manifest drift"
  ],
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/runtime/README.md:1-14",
    ".opencode/skills/system-spec-kit/runtime/lib/README.md:1-17",
    ".opencode/skills/system-spec-kit/scripts/spec/README.md:96",
    ".opencode/skills/system-spec-kit/scripts/spec/validate.sh:280"
  ]
}
```

## Traceability result

- Traceability: CONDITIONAL. The packet contract is clear, but live operational documentation violates the retired-identity rule.
- `spec_code`: partial; the manifest and implementation path align, while live docs do not.
- `checklist_evidence`: partial; AC-010 is correctly still open, but claimed prior gate outputs are not independently rerun in this bound lineage and the summary records inconclusive package-suite results.
- Correctness: carried forward `DR-001`.
- Security: carried forward `DR-002`; no new security finding.
- New findings: 0 P0, 1 P1, 0 P2.
- Convergence: telemetry only; continue because the stop policy is `max-iterations`.

## Next angle

Iteration 4 broadens to maintainability: runtime package documentation and test nomenclature, stale helper names, direct-import policy, and whether the rename leaves safe follow-on change paths.

Review verdict: CONDITIONAL
