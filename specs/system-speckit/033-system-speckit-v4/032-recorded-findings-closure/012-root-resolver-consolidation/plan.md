---
title: "Implementation Plan: Phase 12: root-resolver-consolidation"
description: "Merge the two byte-identical eval-script resolvers, audit the two shared-package predicates for a real caller divergence, add a parity test over fixture trees and document the surviving count in shared/README.md."
trigger_phrases:
  - "root resolver consolidation plan"
  - "eval script resolver merge"
  - "shared predicate caller audit"
  - "parity test fixture trees"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: root-resolver-consolidation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (tsx-run eval scripts), Node ESM, bash |
| **Framework** | system-spec-kit's `runtime/cli` package, `npm run check` gate |
| **Storage** | None - each resolver only reads the filesystem to locate a root directory |
| **Testing** | A new parity test under `runtime/cli/tests/`, `npm run check` |

### Overview
`check-source-dist-alignment.ts:98` and `check-architecture-boundaries.ts:92` carry a byte-identical `resolvePackageRoot(startDir)` body with divergent `REQUIRED_ROOT_DIRS` marker lists (`['runtime', 'shared']` vs `['shared', 'runtime', 'runtime/cli']`). These merge into one shared helper using the stricter marker set unless a caller audit shows the looser set is load-bearing somewhere. `shared/config.ts:23` and `shared/embeddings/factory.ts:243` are audited for their actual callers before deciding whether they collapse into one predicate or stay apart with a documented reason. A parity test then feeds identical fixture trees to every surviving resolver and asserts one answer, and `shared/README.md` states the final count.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Merge-the-duplicate for the two eval scripts (clear byte-identical evidence), and audit-then-decide for the two shared-package predicates (real divergence needs a caller check, not an assumption).

### Key Components
- **Eval-script resolver merge**: one `resolvePackageRoot` helper, imported by both `check-source-dist-alignment.ts` and `check-architecture-boundaries.ts`, using the stricter three-marker list unless the audit says otherwise.
- **Shared-predicate audit**: every caller of `config.ts`'s `PACKAGE_ROOT` and `factory.ts`'s `resolveSpecKitPackageRoot` is read to decide collapse-or-keep.
- **Parity test**: one vitest file under `runtime/cli/tests/` that builds a small set of fixture directory trees (in a temp dir) and asserts every surviving resolver function returns the same root for each tree.
- **README update**: `shared/README.md`'s "Paths and workspace" table row gets a line stating the count and the boundary for each survivor.

### Data Flow
`npm run check` invokes both eval scripts, each calling its own (pre-merge: separate, post-merge: shared) `resolvePackageRoot`. The parity test runs independently under vitest and does not touch `npm run check`'s own execution path, so a parity-test failure never blocks the eval scripts from running, only from being trusted as consistent.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-source-dist-alignment.ts:98` `resolvePackageRoot` | Finds the package root for dist/source alignment checks | update (shared helper) | `npm run check` step for this script still passes |
| `check-architecture-boundaries.ts:92` `resolvePackageRoot` | Finds the package root for architecture-boundary checks, with an extra `runtime/cli` marker | update (shared helper, stricter marker set kept) | `npm run check` step for this script still passes, and a fixture tree missing `runtime/cli` is asserted to fail this check the same way it did before the merge |
| `shared/config.ts:23` `resolvePackageRoot` | Derives `DEFAULT_DB_DIR` for the telemetry store | audit, then update or unchanged | every caller of `PACKAGE_ROOT`/`getDbDir` re-tested after the decision |
| `shared/embeddings/factory.ts:243` `resolveSpecKitPackageRoot` | Derives the embeddings profile's database candidate scan root | audit, then update or unchanged | every caller of `createEmbeddingsProvider` re-tested after the decision |
| `shared/workspace/repo-root.mjs:59`, `runtime/cli/common.sh:16` | The canonical ESM and shell resolvers | not a consumer of this merge - these two are the merge targets other resolvers already delegate to where they can | parity test includes both as reference implementations |

Required inventories:
- Same-class producers: `rg -n 'function resolvePackageRoot|function resolveSpecKitPackageRoot|REQUIRED_ROOT_DIRS' .opencode/skills/system-spec-kit --glob '*.ts'`.
- Consumers of changed symbols: `rg -n 'PACKAGE_ROOT|resolveSpecKitPackageRoot|resolvePackageRoot' .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.mjs'`.
- Matrix axes: caller boundary (ESM-capable, synchronous-CLI/tsx, shell) x marker-set strictness (2-dir, 3-dir) x fixture-tree shape (full tree, missing runtime/cli, missing both).
- Algorithm invariant: for the same input directory tree, every surviving resolver returns the same root path, or - where a marker-set difference is genuinely load-bearing - the difference is documented in `shared/README.md` and covered by an adversarial parity-test row, never left as silent divergence.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The new parity test's per-resolver assertions | vitest |
| Integration | `npm run check` (lint, no-mcp-lib-imports, api-boundary, architecture-boundaries, allowlist-expiry, source-dist-alignment, no-mcp-lib-imports-ast, handler-cycles-ast) | `runtime/cli/package.json`'s `check` script |
| Manual | Caller audit for `config.ts`/`factory.ts` before deciding collapse-or-keep | `rg`, direct file read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runtime/cli/package.json`'s `check` script | Internal | Green | The fastest local signal that the eval-script merge did not break either check |
| `shared/workspace/repo-root.mjs` (the consolidated ESM resolver, already exists) | Internal | Green | Merge target for the parity test's reference case, not itself changed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `npm run check` fails after the eval-script merge, or the parity test finds a fixture tree where a surviving resolver's answer actually needs to diverge and the merge erased that.
- **Procedure**: `git revert` the merge commit. The two eval scripts return to their independent, byte-identical-but-separate state, and `shared/config.ts`/`factory.ts` return to whatever the audit decision changed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Confirm the current-state inventory (7 resolvers) against the tree, audit config.ts/factory.ts callers |
| Core Implementation | Med | Merge the two eval-script resolvers, decide and apply the config.ts/factory.ts disposition, write the parity test |
| Verification | Low | Run npm run check and the parity test, update shared/README.md |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable, git history is the backup
- [x] Feature flag configured - not applicable
- [x] Monitoring alerts set - not applicable

### Rollback Procedure
1. Stop before merging `shared/config.ts` and `factory.ts` if the caller audit finds a real divergence neither original documents.
2. `git revert` the offending commit.
3. Re-run `npm run check` and the parity test to confirm the pre-change state is restored.
4. Not user-facing, so no stakeholder notification is needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
