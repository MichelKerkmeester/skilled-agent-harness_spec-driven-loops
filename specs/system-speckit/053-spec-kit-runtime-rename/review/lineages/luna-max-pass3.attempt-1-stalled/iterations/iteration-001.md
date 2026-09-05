# Deep Review Iteration 1

## Review metadata

- Session: `fanout-luna-max-pass3-1788556809353-mcpewh`
- Target: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename`
- Dimension: correctness
- Angle: workspace package/export/build and freshness boundary
- Scope selection: bounded packet list; direct reads of runtime and scripts package seams
- Executor: inline `cli-codex`, model `gpt-5.6-luna`, max effort, fast tier
- Nested dispatch: prohibited by the execution contract; workflow dispatch step satisfied inline

## Evidence reviewed

- `runtime/package.json` names `@spec-kit/runtime`, exports `dist/api/index.js`, and makes the build produce the runtime distribution. `[SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:2-16]`
- The workspace declares `runtime` and `scripts` as workspaces, while scripts depends on the moved package by `file:../runtime`. `[SOURCE: .opencode/skills/system-spec-kit/package.json:2-10]` `[SOURCE: .opencode/skills/system-spec-kit/scripts/package.json:21-26]`
- Scripts TypeScript paths and runtime references resolve through `../runtime`; direct callers use `@spec-kit/runtime/api`. `[SOURCE: .opencode/skills/system-spec-kit/scripts/tsconfig.json:10-18]` `[SOURCE: .opencode/skills/system-spec-kit/scripts/core/workflow.ts:1240-1246]`
- The freshness table identifies the moved runtime package, but the scripts package watches `sourceCandidates: ['.']` and excludes only tests/test fixtures. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:33-50]`
- The source walker records a missing candidate and returns a freshness error when any watched path is absent. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-220]` `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:356-363]`
- Observed filesystem state: `.opencode/skills/system-spec-kit/scripts/runtime` is a tracked symlink to `../runtime/dist`; `.opencode/skills/system-spec-kit/runtime/dist` is absent. The developer environment reported `Watched source path is missing for system-spec-kit/scripts: .opencode/skills/system-spec-kit/scripts/runtime`.

## Finding

### DR-001 — P1 correctness — scripts freshness scan follows the moved runtime dist symlink

The rename changed the tracked scripts-side link from the old package distribution to `../runtime/dist`, but the scripts freshness scan recursively follows the scripts root. In a checkout where the moved runtime has not yet produced `dist`, the link is treated as a missing watched source and the scripts freshness check fails before it can establish its own package state. This is a cross-package build-order/provisioning seam, not a source-level runtime failure: the runtime manifest creates `dist` only through its build. `[SOURCE: .opencode/skills/system-spec-kit/scripts/runtime:1]` `[SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:12-16]`

Impact: the reported startup freshness error blocks the `@spec-kit/scripts` freshness gate in the current checkout and can make a clean or partially built rename unusable until an unrelated package is built first. That contradicts the packet’s `REQ-002` and `SC-001` gate contract. `[SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:122-124]` `[SOURCE: .opencode/specs/system-speckit/053-spec-kit-runtime-rename/spec.md:139-144]`

Suggested remediation: make the scripts freshness inventory exclude the generated `runtime` link (or model it as an external package boundary), and add a clean-worktree/build-order test covering scripts freshness before and after runtime dist provisioning. Do not resolve this by committing generated dist.

#### Typed claim-adjudication packet

```json
{
  "findingId": "DR-001",
  "claimClass": "class-of-bug",
  "status": "confirmed",
  "confidence": "high",
  "producerInventory": [
    ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:33-50",
    ".opencode/skills/system-spec-kit/scripts/runtime:1"
  ],
  "consumerInventory": [
    ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:356-363",
    ".opencode/skills/system-spec-kit/scripts/spec/validate.sh:275-288",
    ".opencode/skills/system-spec-kit/scripts/package.json:10-19"
  ],
  "adversarialChecks": [
    "runtime/dist absent: reproduced missing watched-source condition",
    "runtime/dist present: expected to remove this specific missing-path condition; requires a build and is intentionally not run"
  ],
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:217-220",
    ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:356-363",
    ".opencode/skills/system-spec-kit/runtime/package.json:12-16"
  ]
}
```

## Dimension result

- Correctness: CONDITIONAL. Workspace naming and direct imports align, but the freshness boundary has a confirmed P1 failure in the observed unbuilt state.
- Security: not yet reviewed.
- Traceability: not yet reviewed.
- Maintainability: not yet reviewed.
- New findings: 0 P0, 1 P1, 0 P2.
- Convergence: telemetry only; continue because the stop policy is `max-iterations`.

## Next angle

Iteration 2 broadens to security: hook registration and process-boundary target resolution, model-server dependency ownership, and path traversal behavior around the moved runtime.

Review verdict: CONDITIONAL
