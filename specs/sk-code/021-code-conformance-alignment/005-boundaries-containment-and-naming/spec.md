---
title: "Feature Specification: Boundaries, Containment and Naming"
description: "Fourteen findings that no codemod can close, because each requires deciding what the code should be before it can be changed: five path-containment sites using lexical prefix matching where the standard mandates canonical realpath comparison, five module and package boundary decisions, three exported-symbol naming changes needing consumer inventories, and two organisation decisions including a 2,288-line entrypoint against a 400-line guideline. Every unit is gated by its own package's typecheck, build and full suite with a reported baseline delta."
trigger_phrases:
  - "path containment prefix matching"
  - "node builtin specifier normalisation"
  - "snake case export rename"
  - "context server extraction"
  - "compiled routing authority"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/005-boundaries-containment-and-naming"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the judgment-tier phase from the track (b) synthesis proposal"
    next_safe_action: "Wait for child 001, then run T001 with the three evidence corrections"
    blockers:
      - "Blocked on child 001"
      - "OPERATOR-DECISION Q3 gates the containment lane"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Q3 - who owns the canonical containment helper?"
      - "For the two ESM-in-.js cases: rename to .mjs or convert to CommonJS?"
    answered_questions: []
---
# Feature Specification: Boundaries, Containment and Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

These are the findings a codemod cannot close, because in each case the correct output is a decision rather than a transform. The containment cluster is the sharpest: five sites check scope with a raw `startsWith` where the standard mandates `fs.realpathSync` on both sides followed by `path.relative`, and the difference matters exactly when it matters most — a sibling directory sharing a prefix, or a symlinked ancestor. The security register owns the canonical helper for that pattern and has the higher-severity instances; this child consumes that helper rather than authoring a second one.

**Key Decisions**: consume the shared containment helper rather than duplicate it (Q3); extract from the oversized entrypoint in smallest-safe increments behind existing contracts, each independently verified, rather than as one restructuring.

**Critical Dependencies**: child 001; the security register's containment child (Q3 fallback defined); coordination with child 003 so header and structural edits do not interleave in one file.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `sk-code/021-code-conformance-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Four defect classes here share one property: the standard states what to do, and the code does something else that a machine cannot mechanically rewrite.

**Containment.** The standard is explicit — never trust user-provided paths; the canonical example resolves both sides with `fs.realpathSync` and then compares with `path.relative`. Five sites instead use raw prefix matching: the skill-graph store's two embedding-refresh scope checks, a benchmark cwd scorer, the extraction scripts' symlink-blind check, and an archive script where a hub identifier reaches a path join with no allowlist and no containment check at all. Prefix matching passes for a sibling directory that happens to share a prefix, and fails to notice a symlinked ancestor.

**Module and package boundaries.** Three NodeNext packages import bare Node built-ins (`import fs from 'fs'`) where the documented convention is the `node:` specifier — confirmed on the MCP entrypoint against its own `tsconfig.json` setting `module: "nodenext"`. Two ordinary `.js` files use ESM syntax outside the plugin boundary, which is a format decision (rename to `.mjs` with every caller updated, or convert to CommonJS), not a rewrite.

**Naming.** Load-bearing TypeScript exports snake_case symbols; a JavaScript pattern asset teaches snake_case function naming and, because pattern assets are copied into downstream code by design, propagates the divergence. Renaming an export is a consumer-inventory problem, not a find-and-replace.

**Organisation.** The main MCP entrypoint is 2,288 lines against a documented 400-line guideline with the instruction to extract modules; and the compiled-routing rebuild authority is anchored in a renumberable spec packet that two scripts point at, so a routine packet rename would break the rebuild path.

### Purpose

Make each of these decisions explicitly, record it, and then implement it in the smallest independently verifiable unit — with each unit gated by its own package's typecheck, build and full suite against a captured baseline.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Containment (5 findings).** Replace raw `startsWith` scope checks with the canonical realpath-plus-`path.relative` pattern at all five sites, consuming the security register's shared helper **[OPERATOR-DECISION: Q3 — containment helper ownership]**. Sibling-prefix and symlinked-ancestor regression tests are written before each fix and demonstrated failing.

**Package and module boundaries (5 findings).** Normalise bare Node built-in imports to `node:` specifiers across NodeNext production sources in three packages, via an AST codemod, with a rebuild after each package. Decide the two ESM-in-ordinary-`.js` cases: rename to `.mjs` with every caller updated, or convert to CommonJS.

**Naming (3 findings).** Inventory consumers of the snake_case exports in the vector-index store and introduce camelCase with explicit compatibility aliases where callers require them. Rename the snake_case functions in the wait-pattern asset as one coordinated update including internal calls and examples.

**Organisation (2 findings, counted within the clusters above).** Extract cohesive lifecycle domains from the 2,288-line MCP entrypoint behind existing contracts, preserving startup ordering, in smallest-safe increments each independently verified. Promote the compiled-routing authored source out of the renumberable spec packet the sync and guard scripts point at, without changing a generated byte.

### Out of Scope

- **Headers, directives, shebangs and import *grouping*** — child 003's. This child changes import *specifiers*; 003 changes their *order*. Coordinate so the two do not interleave in one file.
- **Containment defects in the security register's own files** (`write-containment.ts`, `persist-artifacts.cjs`, `orchestrate-topic.cjs`, `promote-candidate.cjs`) — referenced, not re-filed.
- **Authoring a second containment helper**, unless Q3's fallback is invoked.
- **A full restructure of the MCP entrypoint** — only smallest-safe extractions behind existing contracts; the file will still exceed the guideline afterwards, and that is an accepted intermediate state, recorded as such.
- **Any public contract change.** No extracted module may alter an existing contract; compatibility aliases exist precisely so no caller breaks.

### Files to Change

| File Path | Change Type | Cluster | Description |
|-----------|-------------|---------|-------------|
| `skill-graph-db.ts` (lines 1271, 1343) | Modify | containment | Two raw `source_path.startsWith` scope checks → canonical containment |
| Benchmark `cwd-check.cjs` | Modify | containment | Prefix matching → canonical containment |
| `extract-files-from-markdown.cjs` | Modify | containment | Symlink-blind lexical check → canonical containment |
| `archive-compiled-routing.cjs` (lines ~150-165) | Modify | containment | `hubId` reaches path joins with no allowlist or containment check |
| `system-spec-kit/mcp-server/**` production sources | Modify | imports | Bare Node built-ins → `node:` specifiers; rebuild the package |
| `system-skill-advisor/**` production sources | Modify | imports | Same |
| md-generator backend production sources | Modify | imports | Same |
| `validate-doc-model-refs.js` | Modify | module fmt | ESM in an ordinary `.js` outside the plugin boundary — format decision only |
| Review canary `.js` utility | Modify | module fmt | Same decision |
| `vector-index-store.ts` | Modify | naming | snake_case exports → camelCase with compatibility aliases where callers require them |
| `wait-patterns.js` | Modify | naming | snake_case function names → camelCase, including internal calls and examples |
| `context-server.ts` (2,288 lines) | Modify | organisation | Smallest-safe lifecycle-domain extractions behind existing contracts |
| Compiled-routing authored source; `compiled-route-sync.cjs`; `compiled-route-guard.cjs` | Modify | authority | Promote out of the renumberable spec packet without changing a generated byte |

### Findings Covered (14)

| ID | Sev | Cluster | Title | Confirmation status |
|----|-----|---------|-------|---------------------|
| RB-002-04 | P2 | imports | Load-bearing TypeScript uses bare Node built-in specifiers | **Confirmed** |
| RB-002-05 | P2 | naming | Legacy snake_case functions remain exported from load-bearing TypeScript libraries | **Partially confirmed** — 2 of 4 named symbols matched the cited grep form exactly; the other 2 use a different declaration form. T001 reconciles |
| RB-002-11 | P2 | organisation | Main MCP entrypoint substantially exceeds the organization size guideline | **Confirmed** — 2,288 lines against a 400-line guideline |
| RB-004-01 | P1 | containment | Archive hub ID is an unvalidated filesystem path segment | **Confirmed** — `hubId` reaches the archive-root and path-join calls with no allowlist or containment check |
| RB-004-03 | P1 | containment | Model-inferred extraction paths are only lexically contained | Unconfirmed — T001 owns it |
| RB-004-04 | P1 | containment | CWD scorer uses prefix matching instead of containment | Unconfirmed — T001 owns it |
| RB-004-12 | P1 | module fmt | Ordinary `.js` validator uses ESM syntax outside the plugin boundary | **Partially refuted — must be re-scoped.** The "lacks the required boxed header" claim is **false**; the boxed header is present. Only the ESM-in-`.js` decision survives |
| RB-005-02 | P1 | authority | Compiled-routing rebuild authority remains anchored in spec scratch | Unconfirmed — T001 owns it |
| RB-007-01 | P1 | containment | Embedding refresh uses prefix matching as path containment | **Confirmed** — both cited lines are raw prefix checks |
| RB-007-04 | P2 | imports | MD-generator production TypeScript uses bare Node built-in imports | Unconfirmed — T001 owns it |
| RB-007-05 | P2 | module fmt | Review canary uses ESM syntax in an ordinary `.js` utility | Unconfirmed — T001 owns it |
| RB-007-08 | P2 | naming | Wait-pattern asset teaches noncanonical JavaScript function naming | **Confirmed with a count correction** — the finding says sixteen snake_case functions; a count at HEAD found **fifteen**. T001 reconciles |
| RB-008-02 | P1 | containment | Path containment is repeatedly lexical and not consistently canonical *(pattern anchor)* | Confirmed as a class |
| RB-008-03 | P2 | imports | Bare Node built-in imports recur across NodeNext TypeScript packages *(pattern anchor)* | **Confirmed** — `module: "nodenext"` with bare `fs` and `path` imports |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every containment site uses canonical resolution, not lexical comparison | For each of the five sites, a sibling-prefix test and a symlinked-ancestor test, each written and demonstrated failing before the fix, then passing after |
| REQ-002 | No second containment helper is authored while the shared one is available | Either every site imports the shared helper, or Q3's fallback is explicitly invoked and recorded |
| REQ-003 | Every package builds and passes its full suite after each unit | Per package: typecheck, build, full suite, each compared against a captured baseline; a unit is not complete until its package is green |
| REQ-004 | No public contract changes | Every renamed export carries a compatibility alias where any consumer requires it; the consumer inventory is grep-backed per symbol |
| REQ-005 | Compiled-routing promotion changes no generated byte | Regenerate after the move and `diff` against the pre-move artifacts; a move-simulation test proves the new authority survives a packet rename |
| REQ-006 | The MCP entrypoint's startup ordering is preserved | A startup-order smoke plus MCP runtime verification after each extraction; the source is rebuilt to `dist` before any runtime verification |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The three evidence corrections are reconciled before any edit | T001 records the true symbol set for the vector-index store, the true count for the wait-pattern asset, and the re-scoped claim for the ESM-in-`.js` validator |
| REQ-008 | Specifier normalisation changes nothing but the specifier | Per file, the sorted multiset of imported bindings is identical before and after; only the `node:` prefix differs |
| REQ-009 | Each module-format decision is recorded before it is implemented | The decision record states the choice, the alternatives, and the consumer impact for each of the two `.js` files |
| REQ-010 | The pattern asset's examples stay consistent with its renamed functions | The asset parses, and every example in it references the new names |
| REQ-011 | Extractions are smallest-safe and independently verified | Each extraction is its own commit with its own green gate; a batch extraction is a scope violation |
| REQ-012 | Shared-file coordination with child 003 is explicit | For every file both children touch, the order is recorded and the second child rebases rather than merging conflicting header and structural edits |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five containment sites pass a sibling-prefix test and a symlinked-ancestor test that were demonstrated failing beforehand.
- **SC-002**: `rg -n 'startsWith' <the five files>` shows no remaining path-scope comparison using prefix matching.
- **SC-003**: Every touched package reports typecheck, build and full-suite results equal to its captured baseline.
- **SC-004**: Per renamed symbol, a grep-backed consumer inventory exists and every consumer resolves — through the new name or an explicit compatibility alias.
- **SC-005**: Compiled-routing regenerated outputs are byte-identical after the authority promotion, and a move-simulation test passes.
- **SC-006**: The MCP server starts and serves after each extraction, with the source rebuilt to `dist` first.
- **SC-007**: Zero bare Node built-in specifiers remain in the three packages' production sources.
- **SC-008**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Canonical resolution rejects a path the lexical check accepted, breaking a legitimate caller | High | Regression tests written first; each site's legitimate-path cases enumerated before the change |
| Risk | An extraction from the 2,288-line entrypoint reorders startup | High | Smallest-safe increments, one commit each, startup-order smoke after every one |
| Risk | Renaming an export breaks an unlisted consumer | High | Grep-backed consumer inventory per symbol; compatibility aliases where any consumer requires them |
| Risk | Compiled-routing promotion changes a generated byte | High | Byte-parity gate plus a move-simulation test proving the authority survives a rename |
| Risk | Specifier normalisation without a rebuild leaves `dist` stale, so runtime verification tests the old code | High | Rebuild the owning package before any runtime verification — this is the documented contract for runtime-facing MCP servers and hooks |
| Risk | Interleaving with child 003's header edits in one file produces a confusing diff or a conflict | Medium | Explicit per-file ordering; the second child rebases |
| Risk | Two containment helpers diverge if Q3's fallback is invoked | Medium | The fallback authors the helper in a shared location designed for the other program to adopt, not a private copy |
| Dependency | Child 001 | Red | Rulings and baseline |
| Dependency | Security register's containment child | Red or Yellow depending on Q3 | The shared helper; fallback defined |
| Dependency | Child 003 | Yellow | Shared-file ordering only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Canonical resolution calls `realpath`, which touches the filesystem where prefix matching did not. Any site on a hot path must have its call-rate measured; if it is per-request, the resolved root is cached rather than re-resolved.
- **NFR-P02**: Extractions must not add startup work to the MCP entrypoint; startup wall-clock is measured before and after.

### Security
- **NFR-S01**: Containment is the security property here. Every site must reject a sibling directory sharing a prefix and a symlinked ancestor, and these are asserted as tests rather than reasoned about.
- **NFR-S02**: The unvalidated hub identifier must not be able to traverse outside the archive root, including via `..` segments, absolute paths, and symlinks.

### Reliability
- **NFR-R01**: Every extraction preserves startup ordering exactly; the ordering is asserted, not assumed.
- **NFR-R02**: Compatibility aliases are documented with the version at which they may be removed, so they do not become permanent by default.

---

## 8. EDGE CASES

### Data Boundaries
- A sibling directory whose name is a prefix of the allowed root — the case prefix matching gets wrong.
- A symlinked ancestor pointing outside the allowed root — the case prefix matching cannot see.
- A path containing `..` segments that lexically resolve inside but canonically resolve outside.
- A hub identifier that is empty, absolute, or contains a path separator.
- A file whose only import is a bare built-in: normalisation must not leave a dangling blank line.
- An exported symbol that is referenced only in a string (a dynamic lookup): grep must catch it, and a rename must handle it or keep an alias.

### Error Scenarios
- `realpath` throws because a path does not exist yet: the containment check must define behaviour for a not-yet-created target rather than crashing.
- A package's build fails after specifier normalisation: revert that package's unit and investigate before retrying.
- An extraction breaks startup: revert that single extraction; the smallest-safe increment exists precisely so this is cheap.
- A regenerated compiled-routing byte differs: revert the promotion entirely; a byte difference means the authority move was not transparent.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~15, LOC: moderate but concentrated, Systems: 5 packages including two runtime-facing servers |
| Risk | 22/25 | Auth: N, API: Y — exported symbols rename, Breaking: Y if a consumer is missed or startup reorders |
| Research | 16/20 | Every unit needs a decision and a consumer inventory before an edit |
| Multi-Agent | 6/15 | Workstreams: 4 clusters, loosely coupled |
| Coordination | 13/15 | Dependencies: child 001, another program's helper, child 003 file ordering |
| **Total** | **75/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Canonical check rejects a legitimate path | H | M | Legitimate-path cases enumerated per site before the change |
| R-002 | Extraction reorders MCP startup | H | M | Smallest-safe increments; startup-order smoke each time |
| R-003 | Renamed export breaks an unlisted consumer | H | M | Grep-backed inventory; compatibility aliases |
| R-004 | Compiled-routing byte drift | H | L | Byte-parity gate; move-simulation test |
| R-005 | Stale `dist` makes runtime verification test old code | H | M | Rebuild before every runtime verification |
| R-006 | Two containment helpers diverge | M | M | Fallback authors in a shared location, not a private copy |
| R-007 | `realpath` on a hot path costs measurably | M | M | Call-rate measured; resolved root cached where per-request |
| R-008 | Header and structural edits collide in one file | M | M | Per-file ordering with child 003; second child rebases |

---

## 11. USER STORIES

### US-001: Containment actually contains (Priority: P0)

**As an** operator whose paths are derived from model output and user input, **I want** scope checks that resolve canonically, **so that** a sibling directory or a symlink cannot slip past a prefix comparison.

**Acceptance Criteria**:
1. Given a sibling directory whose name is a prefix of the allowed root, When a scope check runs, Then access is denied.
2. Given a symlinked ancestor pointing outside the allowed root, When a scope check runs, Then access is denied.
3. Given each test, When run before the fix, Then it fails.

### US-002: A rename does not break my caller (Priority: P0)

**As a** consumer of the vector-index store or the wait-pattern asset, **I want** every renamed symbol inventoried and aliased where needed, **so that** my code keeps working.

**Acceptance Criteria**:
1. Given a renamed symbol, When I grep for its old name, Then every hit is either updated or resolved by an explicit alias.

### US-003: The rebuild path survives a rename (Priority: P1)

**As a** maintainer who renumbers spec packets routinely, **I want** the compiled-routing rebuild authority outside the renumberable tree, **so that** a routine rename does not break the rebuild.

**Acceptance Criteria**:
1. Given the promoted authority, When a move-simulation renames the old packet, Then the rebuild still resolves.
2. Given the promotion, When outputs are regenerated, Then they are byte-identical.

---

## 12. OPEN QUESTIONS

- **[OPERATOR-DECISION: Q3 — containment helper ownership]** The security register has the higher-severity containment instances and should own the canonical helper, which this child consumes. If that program will not land soon, should this child author the helper in a shared location for later adoption, or fix its five instances locally and accept a later consolidation? *Recommendation: consume; if unavailable, author in a shared location designed for adoption — never a private copy.*
- For the two ESM-in-ordinary-`.js` cases: rename to `.mjs` with every caller updated, or convert to CommonJS? The answer depends on each file's caller set, which T001 inventories. Recorded as a decision before either is implemented.
- Which snake_case exports in the vector-index store actually have external consumers, and therefore need a compatibility alias rather than a clean rename? T001's inventory decides, and the two symbols using a different declaration form must be found with a corrected pattern.
- Is the wait-pattern asset's true count fifteen or sixteen? A count at HEAD found fifteen; T001 reconciles before the coordinated rename.
- How far below 2,288 lines does the entrypoint need to get before the guideline is satisfied, and is an intermediate state acceptable? *Recommendation: yes — record the intermediate state honestly rather than forcing an unsafe extraction to hit a number.*
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
