Review iteration 5: correctness recheck of the renamed build and cache contract.

Target: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename`
Dimension: correctness
Angle: freshness cache identity, build preparation order, workspace lockfile placement, public API resolution, and test cleanup.

Review targets:

- `.opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh`
- `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs`
- `.opencode/skills/system-spec-kit/runtime/package.json`
- `.opencode/skills/system-spec-kit/package-lock.json`
- `.opencode/skills/system-spec-kit/runtime/tsconfig.json`
- `.opencode/skills/system-spec-kit/runtime/shared`
- `.opencode/skills/system-spec-kit/scripts/runtime`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`

Questions:

1. Does every renamed cache and build identity match across producer, consumer, and cleanup code?
2. Are workspace links and lockfile placements consistent with the runtime package layout?
3. Do clean/unbuilt and built states have an explicit, non-leaking lifecycle?

Do not build, run tests, run the freshness tool, or mutate generated output.
