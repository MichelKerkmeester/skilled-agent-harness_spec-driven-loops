---
title: "Implementation Plan: zvec-grep vendoring into system-plugins "
description: "Vendor the fork as a squashed git subtree under system-plugins, build it in place against its own dependencies, and move the vendored rung ahead of PATH in the lane's resolution order with an injectable candidate so the order is testable."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: zvec-grep vendoring into system-plugins

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | ESM JavaScript wrapper; TypeScript fork built with its own toolchain |
| **Framework** | git subtree; system-spec-kit retrieval scripts |
| **Storage** | None new; the index stays under the ignored `.zvec-grep/` |
| **Testing** | vitest through `mcp-server/vitest.config.ts`; live status and query runs |

### Overview
The fork's `harness` branch is added with `git subtree add --squash`, so the repository gains one commit carrying 380 files and can pull upstream fixes later with one command. The lane gains a `vendoredEntry()` anchored to its own file location and a `candidates` argument on `resolveZvecGrep`, so the real order is exercised in production and a fake one in tests. Built output stays ignored and is produced by the documented build step.
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
Vendored package plus shell-out wrapper, the pattern every engine under `.opencode` follows.

### Key Components
- **`system-plugins/zvec-grep/`**: the fork's source, manifest and build; dependencies installed in place.
- **`vendoredEntry()` and `resolveZvecGrep(env, candidates)`**: the resolution order with the vendored rung second.
- **Doctor `zvec` route**: names an unbuilt vendored copy.

### Data Flow
A search enters the wrapper, resolution returns the vendored entry when its `dist/cli/index.js` exists, the wrapper spawns it through the interpreter in direct mode, and output flows back as before.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `resolveZvecGrep` | Owns which binary answers | update | 39 lane tests; live `status` reports `vendored` |
| `binarySource` consumers (doctor route, status output) | Observe the rung | update | `route-validate.sh` 10 routes |

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
| Unit | Resolution order with and without a vendored file | vitest |
| Integration | Live status and the five baseline queries through the vendored build | shell |
| Manual | Doctor route validation | `route-validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Fork `harness` branch `893af2f` | External | Green | Nothing to vendor |
| Fork dependencies (620 MB `node_modules`) | External | Green | Build fails without them; symlinked to the outside clone for this session, `npm ci` for a fresh checkout |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the vendored build answers wrongly or the subtree breaks a repository gate.
- **Procedure**: revert the packet's commits; the lane falls back to PATH and the outside clone with no other change.
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
| Setup | Low | subtree add and build |
| Core Implementation | Low | resolution order, tests, docs |
| Verification | Low | tests, live status, queries, validation |
| **Total** | | **under one session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable
- [x] Feature flag configured - `SPECKIT_ZVEC_GREP_BIN` overrides the vendored rung
- [x] Monitoring alerts set - the doctor route's `vendored_not_built` signal

### Rollback Procedure
1. Set `SPECKIT_ZVEC_GREP_BIN` to the outside clone if the vendored build misbehaves.
2. `git revert` the packet commits.
3. Run `zvec-lane.mjs status --json` and confirm the rung that answered.
4. Nothing user-facing changes.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

