# Deep Review Iteration 3

## Review metadata

- Session: fanout-luna-max-pass3-1788562574615-h6l4fh
- Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
- Dimension: traceability
- Angle: spec and plan contract, dependency audit, acceptance evidence, and live identity residue
- Prior active findings: DR-001, DR-002
- Executor: inline cli-codex, model gpt-5.6-luna

## Evidence reviewed

- The packet explicitly requires every remaining dependency to have a live consumer and names chokidar among the candidates. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:58-63,122-124]
- The runtime manifest still declares chokidar and its tsconfig maps a type path for it. [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:41-45] [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:17-23]
- A bounded source search over runtime and scripts production files found no chokidar import or require. The only current runtime hits are the manifest and tsconfig mapping.
- The implementation summary justifies keeping runtime chokidar using system-skill-advisor/mcp-server/advisor-server.ts:101, which is a separate preserved package rather than a runtime consumer. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:88-100,112-115]
- The acceptance table marks AC-006 Met even though the cited inventory does not establish a runtime consumer for chokidar. It also marks AC-010 Unmet and tasks T009 remains open. [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/acceptance-criteria.md:57-66] [SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/tasks.md:55-60]
- The exact live search for system-spec-kit/mcp-server and @spec-kit/mcp-server returned no hits over the selected nonhistorical surfaces. Generic retired vocabulary remains in current operational docs and a fallback message. [SOURCE: .devin/hooks.v1.json:35] [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/fixtures/README.md:3,13,38] [SOURCE: .opencode/skills/system-spec-kit/runtime/tests/fixtures/hooks/README.md:33] [SOURCE: README.md:771]

## Findings

### DR-004 [P1] Runtime manifest keeps chokidar on an advisor-only consumer claim

- File: .opencode/skills/system-spec-kit/runtime/package.json:41-45
- Evidence: chokidar is a direct runtime dependency, but the bounded production source search found no import, require, or dynamic import in runtime or scripts. The implementation summary cites the separate skill-advisor MCP package as the reason to keep it. That package is explicitly preserved and is not a consumer of the moved runtime manifest. The packet's REQ-003 and AC-006 therefore remain unproven and the manifest still carries an apparently dead entry.
- Finding class: class-of-bug
- Scope proof: The producer is the runtime dependency manifest. The consumer inventory covers all current runtime and scripts source hits, the runtime tsconfig mapping, the lockfile package entry, and the separate advisor citation. No runtime source consumer was found.
- Affected surface hints: runtime/package.json, runtime/tsconfig.json, package-lock.json, dependency audit
- Risk score: 6 (advisory calibration only)
- Recommendation: Remove chokidar from the runtime manifest and its path mapping if the source inventory is authoritative, or add the real runtime consumer and document why it belongs in this package. Regenerate the lockfile and rerun the dependency audit.

#### Typed claim-adjudication packet

{
  "findingId": "DR-004",
  "claimClass": "class-of-bug",
  "status": "confirmed",
  "confidence": "high",
  "producerInventory": [
    ".opencode/skills/system-spec-kit/runtime/package.json:41-45",
    ".opencode/skills/system-spec-kit/runtime/tsconfig.json:17-23"
  ],
  "consumerInventory": [
    ".opencode/skills/system-spec-kit/runtime: bounded production source search, no chokidar import",
    ".opencode/skills/system-spec-kit/scripts: bounded production source search, no chokidar import",
    ".opencode/skills/system-spec-kit/package-lock.json:1176-1184,2051-2066",
    ".opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:88-100"
  ],
  "adversarialChecks": [
    "searched import, require, and dynamic-import spellings in runtime and scripts while excluding tests, fixtures, generated output, and historical data",
    "the only current runtime hits were package.json and tsconfig.json, so lockfile presence does not establish a live consumer",
    "the cited advisor consumer is under the explicitly preserved system-skill-advisor package"
  ],
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/runtime/package.json:41-45",
    ".opencode/skills/system-spec-kit/runtime/tsconfig.json:17-23",
    ".opencode/specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:88-100",
    ".opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:122-124"
  ]
}

### DR-003 [P2] Live docs retain retired runtime vocabulary

- File: .opencode/skills/system-spec-kit/runtime/tests/fixtures/README.md:3,13,38
- Evidence: Current fixture documentation describes MCP server tests and directs operators to run from mcp_server. The same stale package vocabulary appears in the root stress-test link label and the Devin fallback message, while their actual paths use runtime. The exact old path and old npm name scan is clean, so this is documentation and recovery-guidance drift rather than a path-resolution defect.
- Finding class: matrix/evidence
- Scope proof: The same search covered runtime fixture docs, root README, and all four hook registration surfaces. Preserved system-skill-advisor paths were excluded from this finding.
- Affected surface hints: runtime fixture READMEs, root README stress-test link, Devin fallback text
- Recommendation: Rename current-package prose and fallback instructions to runtime, and reserve MCP wording for the explicitly preserved advisor or historical surfaces.

## Traceability status

- spec_code: PARTIAL. The exact old path and npm name scan is clean, but REQ-003 is contradicted by the unresolved chokidar ownership evidence.
- checklist_evidence: PARTIAL. AC-010 and T009 correctly remain open, while AC-006 is overstated until the dependency audit is corrected.
- The implementation summary's preserved advisor reference is not evidence that runtime itself consumes chokidar.

## Dimension result

- Traceability: CONDITIONAL. One P1 dependency-contract mismatch and one P2 live documentation residue are active.
- Correctness: still CONDITIONAL because DR-001 remains active.
- Security: PASS with DR-002 advisory.
- Maintainability: not yet reviewed.
- New findings: 0 P0, 1 P1, 1 P2.
- Convergence: telemetry only. The max-iterations policy requires continued review.

## Next angle

Iteration 4 broadens to maintainability: current helper comments, test nomenclature, package ownership, fixture instructions, and follow-on change safety.

Review verdict: CONDITIONAL
