---
iteration: 2
focus: correctness
status: complete
newInfoRatio: 0.88
dimensions:
  - correctness
---

# Iteration 002 — Correctness: build and test discovery

## Review objective

Trace the moved CLI workspace through package scripts, Vitest projects,
TypeScript project boundaries, the lockfile and the targeted runbooks. This
pass is static only; no build or test command was executed.

## Sources read

- `.opencode/skills/system-spec-kit/package.json:18-25`
- `.opencode/skills/system-spec-kit/vitest.config.ts:10-55`
- `.opencode/skills/system-spec-kit/runtime/package.json:10-29`
- `.opencode/skills/system-spec-kit/runtime/tsconfig.json:1-62`
- `.opencode/skills/system-spec-kit/runtime/tsconfig.tests.json:1-32`
- `.opencode/skills/system-spec-kit/runtime/vitest.config.ts:7-39`
- `.opencode/skills/system-spec-kit/runtime/vitest.stress.config.ts:7-34`
- `.opencode/skills/system-spec-kit/runtime/cli/package.json:10-33`
- `.opencode/skills/system-spec-kit/runtime/cli/tsconfig.json:1-39`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/task-enrichment.vitest.ts:1-120`
- `.opencode/skills/system-spec-kit/runtime/cli/references/spec-root-alias-retirement-runbook.md:62-67`
- `.opencode/skills/system-spec-kit/package-lock.json:1792-1804,5550-5578`

## Findings

### F004 — CLI runbook resolves its Vitest config one directory too deep

- **Severity:** P1
- **Class:** cross-consumer
- **Evidence:** `runtime/cli/references/spec-root-alias-retirement-runbook.md:62-66` changes directory to `runtime/cli` and invokes `--config ../runtime/vitest.config.ts`. From that working directory the path resolves to `runtime/runtime/vitest.config.ts`; the actual runtime config is `runtime/vitest.config.ts`.
- **Impact:** The documented focused regression command cannot load the configured Vitest file from the moved CLI workspace. A maintainer following the runbook gets a configuration-path failure before the intended alias-retirement tests run.
- **Required correction:** Use the path relative to the documented working directory (`../vitest.config.ts`) or an absolute repository-root path, and align the same command in any mirrored playbook.

### F005 — Root Vitest documentation and the CLI TypeScript resolver disagree

- **Severity:** P2
- **Class:** matrix/evidence
- **Evidence:** `vitest.config.ts:10-16` says the CLI tsconfig chain resolves under `nodenext`, while `runtime/cli/tsconfig.json:4-8` explicitly sets `module: es2022` and `moduleResolution: node`. The runtime package uses `nodenext` in `runtime/tsconfig.json:5-9`.
- **Impact:** The explanation for the separate CLI Vitest project is false for the current CLI config and can cause a later maintainer to “fix” the wrong resolver or misdiagnose `.js`-suffixed import behavior.
- **Required correction:** Either make the CLI tsconfig use the resolver named by the project contract or update the comment to describe the actual `node`/`es2022` configuration and verify the import-resolution rationale.

### F006 — Stress configuration retains a retired `scripts/tests` exclusion

- **Severity:** P2
- **Class:** retired-path-reference
- **Evidence:** `runtime/vitest.stress.config.ts:16-21` excludes `scripts/tests/**`, but the CLI test root is now `runtime/cli/tests/` and `runtime/tsconfig.json:48-50` separately excludes `cli/**`.
- **Impact:** The stress configuration no longer documents the actual moved test boundary. If stress includes are expanded later, the stale exclusion will not protect the intended CLI test tree and will preserve ambiguity about which package owns those tests.
- **Required correction:** Replace the retired exclusion with the current boundary or remove it if the stress include cannot reach CLI tests, then keep the ownership rationale consistent with the TypeScript and regular Vitest configs.

## Quality-gate notes

- Workspace links and package names are internally aligned in the current lockfile.
- The runtime build and test configs do exclude `cli/**` intentionally; the remaining defects are in runbook/config-contract alignment.
- Convergence remains telemetry only; two dimensions and eight further passes remain.

## Next focus

Security: path construction, root containment, shell fallback handling and
input validation at the moved CLI/runtime seam.

Review verdict: FAIL
