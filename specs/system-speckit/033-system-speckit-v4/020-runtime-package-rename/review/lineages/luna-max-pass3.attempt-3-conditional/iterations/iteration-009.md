# Deep Review Iteration 9

## Review metadata

- Session: fanout-luna-max-pass3-1788562574615-h6l4fh
- Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
- Dimension: correctness
- Angle: public API, package manifests, TypeScript references, build ownership, and model-server import boundary
- Prior active findings: DR-001, DR-002, DR-003, DR-004
- Executor: inline cli-codex, model gpt-5.6-luna

## Evidence reviewed

- The runtime package is named `@spec-kit/runtime`, exports only `dist/api/index.js`, and its build script invokes the runtime freshness preparation and TypeScript project build. [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:2-18]
- The scripts package consumes `@spec-kit/runtime` through its package dependency, TypeScript path aliases, and project reference. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:21-26] [SOURCE: .opencode/skills/system-spec-kit/scripts/tsconfig.json:10-18]
- The public runtime API is narrow and comments identify named scripts consumers, which is consistent with the package rename. [SOURCE: .opencode/skills/system-spec-kit/runtime/api/index.ts:4-24]
- The validation front end resolves the moved runtime orchestrator and gives the new runtime build command for both stale and missing-dist paths. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec/validate.sh:274-301]
- The model server imports Hugging Face through the system-spec-kit package boundary and its HTTP handler checks request authorization before routing. [SOURCE: .opencode/bin/hf-model-server.cjs:445-455,970-988]
- The lockfile mirrors the runtime `chokidar` declaration, but the bounded production-source search still finds only the manifest and TypeScript path map, with no import, require, or dynamic import. [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:41-45] [SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:17-23] [SOURCE: .opencode/skills/system-spec-kit/package-lock.json:1176-1185,2051-2065]
- The dangling runtime symlink and freshness traversal remain reproducible as DR-001. The dependency ownership mismatch remains reproducible as DR-004.

## Finding refinement

### DR-001 [P1] Freshness traversal throws on the dangling scripts/runtime symlink

- File: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-235,795-800
- Evidence: The runtime package and scripts package build relationship is correctly renamed, but the scripts package still exposes a dangling `runtime -> ../runtime/dist` symlink in the installed layout. The freshness walker calls `statSync()` on the symlink while descending, so the expected missing-path report is replaced by ENOENT.
- Finding class: correctness/infrastructure
- Scope proof: This iteration confirms the package and API references are correct while replaying the failure at the shared freshness traversal boundary.
- Affected surface hints: scripts package freshness check, validation and install-time diagnostics
- Recommendation: Make the freshness walker handle dangling directory symlinks as a classified missing candidate or ensure the expected runtime dist target exists before traversal.

### DR-004 [P1] Runtime manifest retains an unconsumed chokidar dependency

- File: .opencode/skills/system-spec-kit/runtime/package.json:41-45; .opencode/skills/system-spec-kit/runtime/tsconfig.json:17-23
- Evidence: `chokidar` is declared and locked, but the bounded production-source search finds no runtime import or require. The implementation summary cites `.opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts:101`, which belongs to the explicitly preserved advisor package and cannot justify a runtime dependency.
- Finding class: correctness/dependency-contract
- Scope proof: Manifest, lockfile, path-map, and production-source evidence were checked together. Test and fixture corpora were excluded according to the packet review scope.
- Affected surface hints: runtime package manifest, lockfile, AC-006 dependency evidence
- Recommendation: Remove `chokidar` from the runtime manifest and regenerate the lockfile, or add a real runtime consumer and document its ownership.

## Cross-reference result

- Public API and package rename: PASS for the reviewed runtime and scripts boundary.
- Validation and model-server path ownership: PASS for the reviewed source references.
- Freshness behavior: FAIL at the dangling symlink traversal boundary under DR-001.
- Dependency evidence: FAIL under DR-004 because installation evidence is not a live-consumer proof.
- Exact old path and npm name: PASS for the bounded live scan.

## Dimension result

- Correctness: CONDITIONAL. The API and build wiring are coherent, but DR-001 and DR-004 remain active P1 findings.
- Maintainability: CONDITIONAL with DR-003.
- Security: PASS with DR-002 advisory.
- Traceability: CONDITIONAL because AC-006 remains overstated.
- New findings: 0 P0, 0 P1, 0 P2. Refined findings: DR-001 and DR-004.
- Convergence: telemetry only. Continue to the configured maximum.

## Next angle

Iteration 10 replays the security boundaries around hook overrides, Gate 3 path classification, Devin policy, and the loopback model server, then closes the configured ten-iteration run without early synthesis.

Review verdict: CONDITIONAL
