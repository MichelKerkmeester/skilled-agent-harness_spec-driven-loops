---
title: "Implementation Plan: Boundaries, Containment and Naming"
description: "Four loosely coupled clusters, each requiring a recorded decision before an edit: canonical path containment consuming a shared helper, node: specifier normalisation with a per-package rebuild, exported-symbol renames behind grep-backed consumer inventories, and two organisation moves verified by startup-order smoke and byte parity. Every unit is gated by its own package's typecheck, build and full suite against a captured baseline."
trigger_phrases:
  - "containment helper plan"
  - "node specifier normalisation plan"
  - "consumer inventory rename"
  - "context server extraction plan"
importance_tier: "high"
contextType: "planning"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/005-boundaries-containment-and-naming"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the implementation plan for the judgment tier"
    next_safe_action: "Wait on child 001 and Q3, then run T001 with the three evidence corrections"
    blockers: []
    key_files:
      - "plan.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Boundaries, Containment and Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (NodeNext) for the MCP server, the skill advisor and the md-generator backend; Node CJS for the archive, extraction and compiled-routing scripts; JavaScript for the pattern asset |
| **Framework** | MCP server runtime; Vitest per package |
| **Storage** | SQLite-backed vector and graph stores are read by the touched modules but their schemas are untouched |
| **Testing** | Per package: `tsc --noEmit`, build, full Vitest suite, each against a captured baseline. Plus containment regression tests, a startup-order smoke, and a byte-parity check |

### Overview

Four clusters, each with a different verification shape and no shared abstraction between them. The unifying discipline is the order of operations: **decide, record, inventory, test-first, then edit, then rebuild, then verify.** Two properties of this repository make that order non-negotiable — runtime-facing MCP servers and hooks execute built `dist` output, so a TypeScript change that is not rebuilt is verified against stale code; and containment is a security property, so the regression test must exist and fail before the fix, or the fix is unfalsifiable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Child 001 landed with its rulings and baseline
- [ ] **[OPERATOR-DECISION: Q3 — containment helper ownership]** resolved, so the helper's import path is known
- [ ] The three evidence corrections reconciled: the vector-index store's true symbol set, the wait-pattern asset's true count, and the re-scoped ESM-in-`.js` claim
- [ ] Per-package baselines captured: typecheck result, build result, suite pass/fail counts

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
- [ ] Every containment site has a failing-then-passing sibling-prefix and symlinked-ancestor test
- [ ] Every package rebuilt before its runtime verification
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Decision-first, smallest-unit remediation. Each unit is: a recorded decision, an inventory, a failing test, the edit, a rebuild, a package gate, a commit.

### Key Components

- **The shared containment helper**: owned by the security register per Q3. Canonical form is `fs.realpathSync` on both the root and the candidate, then `path.relative`, with a non-escaping result required. This child imports it; it does not reimplement it.
- **Three NodeNext packages**: the spec-kit MCP server, the skill advisor, and the md-generator backend. Each has a `tsconfig.json` with `module: "nodenext"` and production sources importing bare built-ins.
- **The vector-index store and the wait-pattern asset**: the two naming surfaces. The asset is copied into downstream code by design, so its names propagate.
- **The MCP entrypoint**: 2,288 lines with a documented 400-line guideline. Extraction targets are cohesive lifecycle domains behind contracts that already exist.
- **The compiled-routing authority**: authored source currently anchored in a renumberable spec packet, pointed at by the sync and guard scripts.

### Data Flow

The containment sites all sit on the same shape of flow: an externally-influenced path (model output, user input, a hub identifier) reaches a filesystem operation through a scope check. The defect is that the check is lexical. The fix inserts a canonical resolution between the input and the operation at each site, which is why one shared helper is correct and five local variants are not.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skill-graph-db.ts:1271,1343` | Two embedding-refresh scope checks using raw `source_path.startsWith` | update — canonical containment | Sibling-prefix and symlinked-ancestor tests, failing first; package typecheck, build, suite |
| Benchmark `cwd-check.cjs` | Prefix matching as containment | update | Same test pair; benchmark suite |
| `extract-files-from-markdown.cjs` | Symlink-blind lexical check on model-inferred paths | update | Same test pair, plus a `..`-segment case |
| `archive-compiled-routing.cjs` (~150-165) | `hubId` reaches `activeManifestPath()`, `compiledRoutingArchiveRoot()` and `path.join` with no allowlist or containment check | update — allowlist plus containment | Empty, absolute, separator-containing and `..`-containing hub identifiers all rejected |
| The shared containment helper | Owned by the security register | **consume, do not reimplement** — unless Q3's fallback is invoked | Import path recorded in the decision record |
| `system-spec-kit/mcp-server/**` | NodeNext production sources with bare built-in imports | update — `node:` specifiers, then **rebuild** | Imported-binding multiset unchanged per file; typecheck, build, full suite; MCP runtime verification against the rebuilt `dist` |
| `system-skill-advisor/**` | Same | update, then rebuild | Same |
| md-generator backend | Same | update, then rebuild | Same |
| `validate-doc-model-refs.js` | ESM syntax in an ordinary `.js`. **Its boxed header is present** — the header half of the original claim is refuted | update — module-format decision only | Caller inventory; whichever format is chosen, every caller resolves |
| Review canary `.js` utility | Same class | update — module-format decision | Same |
| `vector-index-store.ts` | Exports snake_case symbols from a load-bearing library | update — camelCase with aliases where required | Grep-backed consumer inventory per symbol; package suite |
| `wait-patterns.js` | Pattern asset teaching snake_case function naming; copied downstream by design | update — coordinated rename including internal calls and examples | Asset parses; every example references the new names; downstream copies inventoried |
| `context-server.ts` | 2,288-line MCP entrypoint | update — smallest-safe extractions behind existing contracts | Startup-order smoke plus MCP runtime verification after **each** extraction, against a rebuilt `dist` |
| `compiled-route-sync.cjs`, `compiled-route-guard.cjs` | Point at authored source inside a renumberable spec packet | update — repoint at the promoted authority | Byte parity on regenerated outputs; move-simulation test renaming the old packet |
| Child 003's header edits | Same files, different region | not a consumer — ordering constraint only | Per-file order recorded; the second child rebases |
| Security register's own containment files | Different files, same defect class | not a consumer — referenced, not re-filed | Named in the decision record |

Required inventories:
- Same-class producers: `rg -n 'startsWith\(' --glob '*.ts' --glob '*.cjs' --glob '*.js' --glob '!node_modules'` filtered to path-scope comparisons — this must find the five sites and any sixth nobody named.
- Same-class producers: `rg -n "from '(fs|path|os|url|crypto|child_process|util|stream|events)'" --glob '*.ts'` across the three NodeNext packages — the full bare-specifier population, not just the cited files.
- Consumers of changed symbols: per renamed export, `rg -n '<oldName>' . --glob '*.ts' --glob '*.js' --glob '*.cjs' --glob '*.md'` — including markdown, because pattern assets and documentation quote these names.
- Matrix axes for containment: {site: 5} × {case: sibling-prefix, symlinked-ancestor, `..`-segment, legitimate-inside, non-existent-target}. Twenty-five rows; every site needs all five.
- Algorithm invariant: **a candidate path is in scope only if `path.relative(realpath(root), realpath(candidate))` neither starts with `..` nor is absolute.** Adversarial cases: a sibling whose name extends the root's name; a symlink inside the root pointing out; a symlink outside pointing in; a target that does not exist yet; a case-insensitive filesystem.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm findings against HEAD and reconcile the three evidence corrections
- [ ] Capture per-package baselines: typecheck, build, suite counts
- [ ] Run the four required inventories
- [ ] Record every decision this phase depends on before any edit

### Phase 2: Core Implementation
- [ ] Containment cluster: test-first, one site at a time
- [ ] Imports cluster: one package at a time, each with a rebuild
- [ ] Naming cluster: inventory-backed renames with aliases where required
- [ ] Organisation cluster: smallest-safe extractions, then the authority promotion

### Phase 3: Verification
- [ ] Manual testing complete — MCP server starts and serves after every extraction
- [ ] Edge cases handled — all twenty-five containment matrix rows verified
- [ ] Documentation updated — spec, plan, tasks, checklist and decision record reconciled
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (test-first) | 5 containment sites × 5 adversarial cases | Package-native test runner; each test demonstrated failing before its fix |
| Contract | Imported-binding multiset unchanged by specifier normalisation | Per-file comparison script |
| Contract | Every consumer of a renamed symbol resolves | Grep-backed inventory plus package typecheck |
| Integration | MCP server starts, orders startup correctly, and serves | Startup-order smoke plus MCP runtime verification, against a rebuilt `dist` |
| Parity | Compiled-routing outputs unchanged by the authority promotion | Regenerate and `diff` |
| Simulation | The promoted authority survives a packet rename | Move-simulation test |
| Package gate | Per package, after every unit | `tsc --noEmit`, package build, full Vitest suite, compared against the captured baseline |
| Manual | Every module-format and extraction decision | Decision-record review before implementation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Child 001 | Internal | Red | Rulings and baseline |
| Security register's containment child | External to this program | Red or Yellow per Q3 | Without the shared helper, Q3's fallback authors it in a shared location for later adoption |
| Child 003 | Internal | Yellow | Shared-file ordering only; the two children touch different regions of the same files |
| Per-package build toolchains | Internal | Green | Each package must build before its runtime verification; a stale `dist` invalidates the verification |
| Operator decision Q3 | Internal | Red | Gates the containment lane's first line of code |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a containment change rejects a legitimate path; a package build or suite regresses; an extraction reorders startup; a regenerated compiled-routing byte differs; a consumer of a renamed symbol fails to resolve.
- **Procedure**: every unit is its own commit — one containment site, one package's specifiers, one symbol rename, one extraction. `git revert <unit-commit>` restores it alone. **After any revert in a TypeScript package, rebuild before re-verifying**, or the verification tests the reverted source against stale output. For the authority promotion, revert the script repointing first and the source move second, so the rebuild path is never pointing at nothing.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Child 001 + Q3 ──┐
                 ├──► Containment ──┐
Phase 1 ─────────┤                  │
(inventories,    ├──► Imports ──────┼──► Phase 3 (Verify)
 baselines,      ├──► Naming ───────┤
 decisions)      └──► Organisation ─┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventories + baselines + decisions | Child 001, Q3 | All four clusters |
| Containment | Decisions, shared helper | Verify |
| Imports | Baselines | Naming (same packages), Verify |
| Naming | Inventories | Verify |
| Organisation | Baselines, Imports (same package rebuild) | Verify |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventories, baselines and decisions | High | 6-9 hours |
| Containment cluster (5 sites, test-first) | High | 8-12 hours |
| Imports cluster (3 packages with rebuilds) | Med | 5-8 hours |
| Naming cluster (3 surfaces with inventories) | Med | 5-8 hours |
| Organisation cluster (extractions + promotion) | High | 10-16 hours |
| Verification | Med | 4-6 hours |
| **Total** | | **38-59 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — no data; pre-move compiled-routing outputs are copied aside for byte comparison
- [ ] Feature flag configured — N/A; compatibility aliases serve the same purpose for renames
- [ ] Monitoring alerts set — N/A; the startup smoke and package gates are the signal

### Rollback Procedure
1. Identify the failing unit from its package gate or regression test.
2. `git revert <unit-commit>` — one site, one package, one symbol, or one extraction.
3. **Rebuild the owning package** before re-verifying anything runtime-facing.
4. Re-run that package's typecheck, build and full suite and confirm the captured baseline is restored.
5. For the authority promotion, revert the script repointing before the source move.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Generated compiled-routing outputs are regenerated and byte-compared, never migrated.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────────────┐
│ Inventories +         │
│ baselines + decisions │
└───────────┬───────────┘
            │
   ┌────────┼────────────┬────────────────┐
   ▼        ▼            ▼                ▼
┌────────┐ ┌──────────┐ ┌────────┐ ┌──────────────┐
│Contain-│ │ Imports  │ │ Naming │ │ Organisation │
│ ment   │ │ + rebuild│ │+aliases│ │ extract+move │
└───┬────┘ └────┬─────┘ └───┬────┘ └──────┬───────┘
    └───────────┴───────────┴─────────────┘
                     ▼
          ┌────────────────────┐
          │ Package gates +    │
          │ startup + parity   │
          └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Inventories + decisions | Child 001, Q3 | Work lists, decisions, consumer maps | All clusters |
| Containment | Shared helper, decisions | Canonical scope checks at 5 sites | Verify |
| Imports | Baselines | `node:` specifiers, rebuilt packages | Organisation (shared package), Verify |
| Naming | Consumer inventories | camelCase exports with aliases | Verify |
| Organisation | Baselines, rebuilt packages | Smaller entrypoint, relocated authority | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inventories, baselines and recorded decisions** - 6-9 hours - CRITICAL
2. **Containment cluster, test-first, five sites** - 8-12 hours - CRITICAL
3. **Organisation cluster: extractions with per-extraction startup verification, then the authority promotion** - 10-16 hours - CRITICAL

**Total Critical Path**: 24-37 hours

**Parallel Opportunities**:
- The imports and naming clusters are independent of containment and of each other, except where they share a package's build.
- Consumer inventories for the naming cluster can be gathered while the containment tests are being written.
- The move-simulation test for the authority promotion can be built before the promotion itself.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Decisions recorded | Every module-format, alias and extraction decision written before its edit | End of Phase 1 |
| M2 | Containment closed | All 25 matrix rows verified; each test failed before its fix | Mid Phase 2 |
| M3 | Packages normalised and rebuilt | Zero bare built-in specifiers; each package rebuilt and green | Mid Phase 2 |
| M4 | Renames safe | Every consumer resolves through a new name or an explicit alias | Late Phase 2 |
| M5 | Organisation improved without drift | Entrypoint reduced in verified increments; regenerated routing bytes identical; move simulation passes | End of Phase 2 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Consume the shared containment helper; never author a second one

**Status**: Proposed — **[OPERATOR-DECISION: Q3 — containment helper ownership]**

**Context**: Five sites here and four in the security register share one defect class: lexical path comparison where the standard mandates canonical resolution. The security register has the higher-severity instances and is the security-owning program.

**Decision**: Import the shared helper at all five sites. If it is not available in time, author it in a shared location explicitly designed for the other program to adopt — never a private copy.

**Consequences**:
- One implementation of a security-critical primitive, with one place to fix a future bug in it.
- A hard dependency edge on another program's schedule, mitigated by the shared-location fallback.

**Alternatives Rejected**:
- *Five local fixes*: five implementations of a security primitive, guaranteeing divergence.
- *Wait indefinitely*: leaves five confirmed containment defects open on an unbounded timeline.

### ADR-002: Extract in smallest-safe increments, and accept an intermediate state

**Status**: Proposed

**Context**: The MCP entrypoint is 2,288 lines against a 400-line guideline. It is the startup path for a runtime-facing server, so an ordering change is a live outage.

**Decision**: Extract cohesive lifecycle domains behind contracts that already exist, one extraction per commit, each verified by a startup-order smoke and MCP runtime verification against a rebuilt `dist`. Stop when the next extraction is no longer safe, and record the resulting line count honestly rather than forcing it to a number.

**Consequences**:
- Every extraction is independently revertible and independently verified.
- The file will likely still exceed the guideline when this child completes; that intermediate state is recorded as accepted rather than quietly claimed as closed.

**Alternatives Rejected**:
- *One restructuring commit*: unrevertible at useful granularity on a live startup path.
- *Leave it entirely*: the finding is confirmed and the guideline is explicit about extracting modules.

### ADR-003: Rebuild before every runtime verification

**Status**: Proposed

**Context**: Runtime-facing MCP servers and hooks execute built `dist` output. A TypeScript source change that is not rebuilt is verified against the previous build.

**Decision**: Every TypeScript unit in this child rebuilds its owning package before any runtime verification, and the rollback procedure rebuilds too.

**Consequences**:
- Runtime verification means something.
- Each unit costs a build, which is why units are grouped per package rather than per file.

**Alternatives Rejected**:
- *Verify against the existing `dist`*: tests the old code and produces a false green — the exact failure mode child 004 exists to eliminate elsewhere.
