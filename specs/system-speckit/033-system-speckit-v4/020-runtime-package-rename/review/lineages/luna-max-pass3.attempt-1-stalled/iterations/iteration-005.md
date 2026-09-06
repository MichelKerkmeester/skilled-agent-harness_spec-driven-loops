# Deep Review Iteration 5

## Review metadata

- Session: `fanout-luna-max-pass3-1788556809353-mcpewh`
- Target: `.opencode/specs/system-speckit/053-spec-kit-runtime-rename`
- Dimension: correctness
- Angle: freshness cache identity, build preparation order, workspace links, and test cleanup
- Executor: inline `cli-codex`, model `gpt-5.6-luna`, max effort, fast tier
- Prior active findings carried forward: `DR-001`, `DR-002`, `DR-003`, `DR-004`

## Evidence reviewed

- The moved runtime package uses `system-spec-kit/runtime` as its freshness package id and builds two runtime entries. `[SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:12-16]` `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:53-83]`
- Cache filenames derive directly from the package id by replacing the slash with a hyphen. `[SOURCE: .opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:259-263]`
- The freshness test’s source and dist paths use `runtime`, but its cleanup glob still contains the old `system-spec-kit-mcp_server` token. `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh:10-18]` `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh:32-44,76-79]`
- Runtime/shared and scripts/runtime links point at the expected shared and moved runtime build outputs; the current checkout lacks runtime dist, which was already recorded as `DR-001`. `[SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:32-36]` `[SOURCE: .opencode/skills/system-spec-kit/scripts/tsconfig.json:10-18]`
- The workspace lockfile models a runtime-scoped `chokidar` placement, so the fallback dependency is consistent with the package manifest even though the current unbuilt checkout is not provisioned. `[SOURCE: .opencode/skills/system-spec-kit/package-lock.json:2051-2066]`

## Finding

### DR-005 — P2 correctness/test isolation — freshness test cleanup uses the old cache identity

`test-dist-freshness.sh` computes the new runtime source and dist paths and invokes the new rebuild command, but `$CACHE_GLOB` still targets `.dist-freshness-system-spec-kit-mcp_server-*`. The current freshness producer derives the cache prefix from `system-spec-kit/runtime`, which is `system-spec-kit-runtime`, so the test’s pre-run and exit cleanup cannot remove the cache it creates for the moved package.

Impact: a freshness test can leak generated cache state into the runtime dist directory and fail to start from a clean cache. This is a P2 test-isolation/correctness issue; no production runtime behavior is inferred from the static mismatch. Suggested remediation: derive the cleanup glob from the same package id or update it to the runtime prefix, then add a test assertion that the cache is absent after exit.

## Dimension result

- Correctness: CONDITIONAL due to `DR-001` and the new P2 cache cleanup mismatch `DR-005`.
- Security: previously PASS with `DR-002` advisory.
- Traceability: previously CONDITIONAL with `DR-003` active.
- Maintainability: previously PASS with `DR-004` advisory.
- New findings: 0 P0, 0 P1, 1 P2.
- Convergence: telemetry only; continue to the max-iteration hard stop.

## Ruled-out correctness directions

- Runtime/shared link contract: no source import was found that requires the link to be a source package rather than the shared dist reference expected by the moved build. `[SOURCE: .opencode/skills/system-spec-kit/runtime/tsconfig.json:32-36]`
- `chokidar` lockfile ownership: the runtime-scoped lock entry and advisor fallback are aligned; current absence is provisioning state, not manifest drift. `[SOURCE: .opencode/skills/system-spec-kit/package-lock.json:2051-2066]` `[SOURCE: .opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts:97-115]`
- Public API package identity: runtime manifest, workspace list, and scripts dependency remain aligned. `[SOURCE: .opencode/skills/system-spec-kit/runtime/package.json:2-10]` `[SOURCE: .opencode/skills/system-spec-kit/package.json:2-10]`

## Next angle

Iteration 6 revisits security with an adversarial static pass over path normalization, environment-derived roots, database/socket isolation, and runtime/advisor boundary references.

Review verdict: CONDITIONAL
