# Iteration 005 — Maintainability: registry dependency metadata

## Focus

Audit the moved CLI's central script registry and its consumer for metadata
that still describes the retired `scripts/` topology.

## Sources reviewed

- `runtime/cli/scripts-registry.json`
- `runtime/cli/registry-loader.sh`
- `runtime/cli/package.json`
- `package.json`
- `runtime/cli/README.md`
- `runtime/cli/spec-folder/README.md`
- `feature-catalog/tooling-and-scripts/markdown-link-integrity-guard.md`

## Findings

### F010 — P2: Script registry dependencies retain retired `scripts/` paths

- **Evidence:** `runtime/cli/scripts-registry.json:73` lists
  `scripts/lib/shell-common.sh`, and line 156 lists
  `scripts/spec-folder/*.ts` as dependencies.
- **Current topology:** the corresponding live paths are
  `runtime/cli/lib/shell-common.sh` and
  `runtime/cli/spec-folder/*.ts`; the old dependency paths do not exist.
- **Impact:** `scripts-registry.json` is the package's central inventory, so
  registry consumers and maintainers receive an inaccurate dependency graph
  after the move. The current `registry-loader.sh` exposes script metadata but
  does not validate or repair dependency paths, allowing the stale entries to
  persist silently.
- **Severity:** P2. The entrypoint paths remain usable, but dependency
  traceability and maintenance tooling are misleading.
- **Proof:** direct comparison of the registry entries with the live CLI
  filesystem and the registry loader's read-only query behavior.

## Coverage

- Files reviewed: 7
- New findings: F010
- Resolved findings: none
- Dimension: maintainability

## Next focus

Continue maintainability review at the test boundary: package scripts,
Vitest project configuration, legacy test runners, and generated-dist
assumptions.

Review verdict: FAIL
