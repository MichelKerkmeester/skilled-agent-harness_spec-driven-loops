---
title: "Implementation Plan: spec-kit runtime rename "
description: "Move the engine package to system-spec-kit/runtime with git mv in one commit, update every reference in the same commit, prune dependencies on a resolution audit, rebuild and re-stamp, then run a ten-iteration review on the moved tree."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: spec-kit runtime rename

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript engine, JavaScript and shell entry points |
| **Framework** | npm workspace-less packages, vitest, the spec-kit validators |
| **Storage** | None; the advisor's database is untouched |
| **Testing** | the package's bounded runner and typecheck, the scripts test tree, validate.sh, doctor routes, dist-freshness, the runtime adapters run once each |

### Overview
The move is mechanical and must be atomic: `git mv` the tree, rewrite every reference, regenerate the lockfile and dist, and commit once. Dependency pruning follows a resolution audit, because the HF model server in `.opencode/bin` and the hook adapters load modules by name at runtime rather than by import. The review pass runs after the move on the same bounded-scope pattern packet 052 used.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Engine package plus CLI entry points, the shape `system-deep-loop/runtime` already uses.

### Key Components
- **`runtime/lib`**: validation orchestrator, metadata refresh, continuity, description and graph modules.
- **`runtime/scripts`**: CLI entry points the shell scripts call.
- **`runtime/hooks`**: per-runtime lifecycle adapters registered in each runtime config.
- **`runtime/api`**: the supported import surface, renamed `@spec-kit/runtime/api`.

### Data Flow
Shell scripts and runtime hook configs call entry points under `runtime/`; those import `runtime/lib` and `@spec-kit/shared`; nothing serves a socket or a transport.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `dist-freshness.cjs` package table | Owns which roots the freshness guard watches | update | the guard passes on the new root and refuses a stale one |
| Runtime hook configs in five runtimes | Register adapters by path | update | each adapter executed once from the new path |
| `scripts/tsconfig.json` and imports | Resolve the engine's api | update | typecheck and the scripts test tree |
| Skill advisor's `mcp-server` | A real MCP server | not a consumer | untouched by grep of the diff |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
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
| Unit | The moved package's suite and typecheck; the scripts test tree | vitest, tsc |
| Integration | validate.sh, continuity writer, doctor routes, dist-freshness guard, each hook adapter from its new path, model server boot | shell |
| Manual | Review loop on the moved tree | deep review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 052 review loop complete | Internal | Yellow | Scope names the old paths |
| Operator's dirty files committed | Internal | Yellow | Cannot move a file under live edits |
| npm registry for `npm ci` | External | Green | Lockfile regeneration |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any gate that passed before the move fails after it and the cause is not a missed reference fixable in place.
- **Procedure**: `git revert` the single move commit; the old lockfile and dist stamp return with it.
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
| Setup | Low | dependency audit and reference inventory |
| Core Implementation | Med | the move, the rewrite, the manifest, the rebuild |
| Verification | High | every gate plus a ten-iteration review |
| **Total** | | **one session plus the review** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable; git history is the backup
- [x] Feature flag configured - not applicable
- [x] Monitoring alerts set - the gates in the testing table

### Rollback Procedure
1. Stop the review loop if running.
2. `git revert` the move commit.
3. Rebuild dist in the restored root and rerun validate.sh and the doctor routes.
4. Tell the operator which reference caused it.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Dependency audit | None | keep or remove per dependency | Move |
| Reference inventory | None | the file list to rewrite | Move |
| Move and rewrite | Audit, Inventory | one commit | Verify |
| Verify and review | Move | gates green, review report | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Audit and inventory** - short - CRITICAL
2. **Move, rewrite, rebuild, commit** - one sitting - CRITICAL
3. **Gates and review loop** - the loop's ten iterations - CRITICAL

**Total Critical Path**: one session plus the review loop

**Parallel Opportunities**:
- The dependency audit and the reference inventory run simultaneously
- The review loop starts only after the move commit
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Audit and inventory recorded | every dependency and reference has a decision | after the 052 loop |
| M2 | Move committed | all gates green on the new path | same session |
| M3 | Review clean | ten iterations, no P0 or P1 | after the loop |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Rename to runtime, shaped like the deep-loop runtime

**Status**: Accepted

**Context**: The package name promises an MCP server that no longer exists, and the harness already has a precedent for an engine package with CLI entry points and no server.

**Decision**: Move to `system-spec-kit/runtime`, name it `@spec-kit/runtime`, keep `lib/`, `scripts/`, `hooks/`, `tests/` at its root, and prune dependencies on a resolution audit.

**Consequences**:
- The name and layout say what the package is, matching the deep-loop runtime.
- About 470 files move or change in one commit; mitigated by an atomic commit and a full gate run before it.

**Alternatives Rejected**:
- Keep the name and add a README note: rejected, because the operator asked for the MCP identity to go and a note does not change what a reader searches for.
- Delete the package and reimplement its four responsibilities elsewhere: rejected, because validation, metadata, continuity and adapters are working code with tests, and a rewrite would be the larger risk.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
