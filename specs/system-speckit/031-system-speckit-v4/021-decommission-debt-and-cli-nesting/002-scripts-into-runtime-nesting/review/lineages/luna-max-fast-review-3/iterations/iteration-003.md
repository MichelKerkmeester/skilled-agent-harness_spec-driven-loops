---
iteration: 3
focus: security
status: complete
newInfoRatio: 0.94
dimensions:
  - security
---

# Iteration 003 — Security: output path containment

## Review objective

Trace user-controlled path inputs through the moved CLI/runtime write sinks,
with emphasis on canonical containment, traversal rejection and symlink
handling. This pass is static only; no build or test command was executed.

## Sources read

- `.opencode/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts:120-145,575-580,620-637,640-675,721-746`
- `.opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:199-208,211-276,389-417,920-958`
- `.opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts:920-960,1545-1590`
- `.opencode/skills/system-spec-kit/runtime/cli/lib/template-utils.sh:65-180`
- `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh:90-120`
- `.opencode/skills/system-spec-kit/runtime/cli/core/config.ts:75-92`

## Findings

### F007 — Nested changelog `--output` bypasses write-path containment

- **Severity:** P1
- **Class:** path-containment
- **Evidence:** `nested-changelog.ts:130-136` accepts any non-empty `--output`
  value. `buildOutputPath` returns an override through `path.join` without
  validating traversal or canonical containment (`:626-630`), and
  `buildNestedChangelogData` converts that result into a relative path
  (`:660-675`). `writeNestedChangelog` then reconstructs the path and calls
  `mkdirSync` and `writeFileSync` without a containment check
  (`:721-726`). An override containing `../../` therefore escapes the project
  root; a symlinked parent can escape even when the lexical path appears
  inside it.
- **Impact:** A caller able to invoke the CLI with `--write` can overwrite or
  create an arbitrary file reachable from the project-root parent, rather than
  being limited to the packet-local changelog surface. This contradicts the
  packet-local output contract and bypasses the canonical path protections used
  for spec-folder inputs.
- **Required correction:** Validate the resolved override with canonical
  containment before directory creation, reject traversal and symlink escapes,
  and constrain it to the intended packet changelog directory (or explicitly
  document and enforce a narrower approved output-root contract).

## Quality-gate notes

- The shared `validateFilePath` path helper rejects explicit `..` segments and
  canonicalizes existing paths, so spec-folder input validation did not expose
  a second independently confirmed escape in this pass.
- `generate-context.ts` also validates the absolute spec-folder write target
  before acquiring its canonical save lock.
- Convergence remains telemetry only; seven further passes remain.

## Next focus

Traceability: compare packet claims, moved-tree manifests, runbooks and
cross-reference protocols against the current implementation surfaces.

Review verdict: FAIL
