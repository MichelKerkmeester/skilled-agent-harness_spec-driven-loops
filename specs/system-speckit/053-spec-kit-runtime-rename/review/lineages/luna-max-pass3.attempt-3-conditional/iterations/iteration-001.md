# Deep Review Iteration 1

## Review metadata

- Session: fanout-luna-max-pass3-1788562574615-h6l4fh
- Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
- Dimension: correctness
- Angle: workspace package, public API, build order, symlink, and freshness boundary
- Scope selection: bounded packet list with direct reads of the moved package and its scripts consumer
- Executor: inline cli-codex, model gpt-5.6-luna
- Nested dispatch: prohibited by the execution contract

## Evidence reviewed

- The workspace names runtime as a package and exposes runtime and scripts as workspaces. [SOURCE: .opencode/skills/system-spec-kit/package.json:2-10]
- The moved package is named @spec-kit/runtime, exports dist/api/index.js, and prepares two runtime freshness entries before TypeScript build. [SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:2-18]
- The scripts package consumes @spec-kit/runtime through file:../runtime and maps its API and internal paths to ../runtime. [SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:21-26] [SOURCE: .opencode/skills/system-spec-kit/scripts/tsconfig.json:10-18]
- The scripts freshness walker recursively visits every entry under its source root. It checks existence at line 218, then calls statSync on a symbolic child at line 234. [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-235]
- A traversal exception is returned as a freshness error rather than an unprovisioned result. [SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:614-669,795-800]
- Observed filesystem state: scripts/runtime is a tracked symlink to ../runtime/dist, runtime/dist is absent, and the direct checker call reproduced ENOENT for scripts/runtime. This is the supplied DIST FRESHNESS CHECK ERROR.

## Finding

### DR-001 [P1] Scripts freshness scan follows a missing moved-runtime distribution link

- File: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:228-235
- Evidence: The scripts package watches its root broadly. The moved runtime link is inside that root, and the child guard calls fs.statSync(child) after lstatSync reports a symlink. When the runtime dist target is not provisioned, statSync throws ENOENT. The surrounding check catches that exception and emits a fatal freshness error. The current checkout reproduces the failure before any repository gate is run.
- Finding class: class-of-bug
- Scope proof: The producer is the generic source walker and the consumer is checkPackageFreshness/checkAllFreshness. The same path is also reached by the scripts package freshness and validation entry points. This is a cross-package boundary issue, not a single caller typo.
- Affected surface hints: scripts freshness walker, runtime dist provisioning, validate.sh freshness gate
- Risk score: 7 (advisory calibration only)
- Recommendation: Exclude generated cross-package links from the scripts source walk or represent them as an explicit external package boundary. Add a clean checkout test that runs the scripts freshness check before and after runtime dist provisioning. Do not commit generated dist as the workaround.

#### Typed claim-adjudication packet

{
  "findingId": "DR-001",
  "claimClass": "class-of-bug",
  "status": "confirmed",
  "confidence": "high",
  "producerInventory": [
    ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-235",
    ".opencode/skills/system-spec-kit/scripts/runtime:symlink-to-../runtime/dist"
  ],
  "consumerInventory": [
    ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:614-669",
    ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:795-800",
    ".opencode/skills/system-spec-kit/scripts/spec/validate.sh:275-301"
  ],
  "adversarialChecks": [
    "runtime/dist absent reproduced ENOENT during scripts source traversal",
    "runtime/dist present was not created because the user forbids repository builds and generated writes"
  ],
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-235",
    ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:795-800",
    ".opencode/skills/system-spec-kit/runtime/package.json:12-16"
  ]
}

## Dimension result

- Correctness: CONDITIONAL. Package naming and direct API wiring align, but the observed freshness boundary has a confirmed P1 failure in the unbuilt checkout.
- Security: not yet reviewed.
- Traceability: not yet reviewed.
- Maintainability: not yet reviewed.
- New findings: 0 P0, 1 P1, 0 P2.
- Convergence: telemetry only. The max-iterations policy requires continued review.

## Next angle

Iteration 2 broadens to security: hook registration, process-boundary target resolution, environment-derived paths, and database or socket isolation.

Review verdict: CONDITIONAL
