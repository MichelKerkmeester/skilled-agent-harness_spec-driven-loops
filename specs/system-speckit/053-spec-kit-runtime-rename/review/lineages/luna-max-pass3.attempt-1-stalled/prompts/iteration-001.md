Review iteration 1: correctness of the moved workspace and its build/freshness seam.

Target: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename`
Dimension: correctness
Scope: read the bounded files selected below and directly imported consumers only.

Review targets:

- `.opencode/skills/system-spec-kit/runtime/package.json`
- `.opencode/skills/system-spec-kit/runtime/api/index.ts`
- `.opencode/skills/system-spec-kit/scripts/package.json`
- `.opencode/skills/system-spec-kit/scripts/tsconfig.json`
- `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`
- `.opencode/skills/system-spec-kit/scripts/runtime`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`

Questions:

1. Does the new package/export/workspace contract resolve consistently?
2. Does the rename leave a build-order or freshness failure at a cross-package seam?
3. Are old package references absent from live runtime and scripts code, excluding preserved advisor and historical evidence?

Required evidence format: cite `[SOURCE: path:line]` for source claims and record any observed filesystem state separately. Do not change the target or run repository gates. The executor-dispatch step is satisfied inline by this session.
