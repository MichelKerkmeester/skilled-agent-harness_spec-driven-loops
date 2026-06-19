---
title: "Implementation Plan: Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)"
description: "Approach and sequencing for the doc-symbol lane and lease telemetry: extend SymbolKind, build a dependency-free heading/key extractor into the language==='doc' early-return with non-code render tolerance, ship json/yaml/toml-first; then classify launcher lease-lifecycle transitions behind a no-op-default metrics emit. Two independent tracks, no shared schema migration."
trigger_phrases:
  - "code graph doc symbol lane plan"
  - "q5-c1 doc symbol extractor sequencing"
  - "lease classification telemetry plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/008-doc-symbol-lane"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 plan; sequencing for Q5-C1 + Q7-lease tracks"
    next_safe_action: "Implement Track A: SymbolKind + doc-symbol extractor"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-008-doc-symbol-lane"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, better-sqlite3) + a CommonJS launcher (`.cjs`) |
| **Framework** | mk-code-index MCP server (`system-code-graph/mcp_server`) + `.opencode/bin` launcher |
| **Storage** | SQLite `code-graph.sqlite` (`code_nodes`/`code_edges`) — NO migration; doc nodes reuse the existing node/edge schema |
| **Testing** | Vitest, co-located in `mcp_server/lib` |

### Overview
Two independent additive tracks. **Track A — Q5-C1 (tier-2 BUILD, doc-symbol lane):** extend the `SymbolKind` union with `heading`/`key`, build a dependency-free extractor (`doc-symbol-extractor.ts`) that turns markdown headings into nested `heading` nodes and json/yaml/toml keys into `key` nodes with content-derived ids, slot it into the single `language === 'doc'` early-return (`structural-indexer.ts:1237`), and make `code-graph-context` render those non-code kinds. Ship json/yaml/toml-first because `**/*.md` is omitted from the default include globs. **Track B — Q7-lease (low-priority observability):** classify the launcher's existing lease-lifecycle transitions into named counters and route them through a sink-agnostic `emitLeaseMetric()` that no-ops by default (there is no metrics sink today). The two tracks share no code path and can land in either order.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001..004)
- [x] Dependencies identified (SymbolKind union, render tolerance, default globs, metrics sink)

### Definition of Done
- [ ] Q5-C1 acceptance criteria met (REQ-001..006): deterministic heading/key extraction, SymbolKind extended, render-tolerant, additive, glob decision recorded
- [ ] Q7-lease acceptance criteria met (REQ-007..008): lease transitions classified, no-op-default emit stub, zero behavior change without a sink
- [ ] Tests passing: heading nesting, config keys, id stability across rescans, empty/edge inputs, non-code render path, lease-class-per-transition
- [ ] `node --check` / `tsc` clean; vitest green; docs reconciled (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two additive branches with no schema migration. Track A is a new lane behind the existing `=== 'doc'` guard in the indexer + a union/render extension; Track B is a read-only classification + a pluggable no-op emit on the launcher. Neither touches the destructive `code-graph-db.ts` reindex transaction boundary.

### Key Components
- **`indexer-types.ts` SymbolKind union (`:13-16`)**: extended with `'heading' \| 'key'`; `generateSymbolId(filePath, fqName, kind)` (`:100`) is already kind-agnostic (`sha256(filePath::fqName::kind).slice(0,16)`), so new kinds get stable ids for free.
- **`doc-symbol-extractor.ts` (new)**: `extractMarkdownHeadings(content)` (ATX `^#{1,6} ` + Setext, fenced-code-aware) producing `heading` nodes with parent-`CONTAINS`-child edges by level; `extractConfigKeys(content, language)` (shallow json/yaml/toml key walk) producing `key` nodes. Pure, deterministic, no LLM/network.
- **`structural-indexer.ts` doc branch (`:1237-1249`)**: the single `if (language === 'doc')` early-return; replace the empty `{nodes:[], edges:[]}` with the extractor output while preserving `contentHash`/`parseHealth:'clean'`/`detectorProvenance`.
- **`code-graph-context.ts` render path**: tolerate `heading`/`key` node kinds (the second `q5-f4` confirm) — no formatter may assume a closed code SymbolKind.
- **`mk-code-index-launcher.cjs` lease sites**: `maybeBridgeLeaseHolder` (~`:136`), owner-lease read/write (`readOwnerLeaseFile` ~`:290`, `writeOwnerLeaseFileExclusive` ~`:317`) — classify each transition; `emitLeaseMetric()` routes to a no-op-default sink.

### Data Flow
**Track A:** scan reads a doc file → `language === 'doc'` → `doc-symbol-extractor` produces content-derived `heading`/`key` nodes + `CONTAINS` edges → persisted via the existing node/edge write path → `code_graph_context` queries return doc nodes, rendered through the non-code-tolerant formatter. **Track B:** the launcher takes a lease decision → classifies the transition (held-by-other / bridged-secondary / stale-reclaimed / respawned) → `emitLeaseMetric(class)` → no-op sink (until one is configured). No cross-track data flow.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Track A changes the indexer's persistence-feeding lane and the public render path; Track B touches the launcher's lease lifecycle. Both feed shared surfaces (the node/edge schema, the context formatter, the lease control flow), so an affected-surfaces inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `structural-indexer.ts:1237-1249` `=== 'doc'` early-return | Returns `{nodes:[], edges:[]}` + content-hash (hash-only doc lane) | update — emit extractor output, keep content-hash/parseHealth | `sed -n '1237,1249p' structural-indexer.ts`; confirm only this branch is the doc seam |
| `indexer-types.ts:13-16` `SymbolKind` | Closed 11-kind code vocabulary | update — add `'heading' \| 'key'` | `rg -n 'type SymbolKind' indexer-types.ts`; `rg -n ': SymbolKind' mcp_server/lib` to find kind consumers |
| `indexer-types.ts:100` `generateSymbolId` | `sha256(filePath::fqName::kind)` id minting | unchanged — already kind-agnostic; verify new kinds produce stable ids | `sed -n '100,110p' indexer-types.ts` |
| `code-graph-context.ts` render/format | Builds context payload from nodes incl. `kind` | update — tolerate non-code kinds in formatting | `rg -n 'kind' code-graph-context.ts`; confirm no closed-vocab switch throws on `heading`/`key` |
| `indexer-types.ts:156-177` default include globs | Omits `**/*.md` (explicit comment ~`:169-171`); includes json/jsonc/yaml/yml/toml | record decision — markdown opt-in; lane is json/yaml/toml-first | `sed -n '156,177p' indexer-types.ts` |
| `tree-sitter-parser.ts:67` `ParserLanguage = Exclude<…,'doc'>` | Excludes `'doc'` from the parser | unchanged — the extractor does NOT route through tree-sitter | `rg -n "Exclude<SupportedLanguage" tree-sitter-parser.ts` |
| `mk-code-index-launcher.cjs` lease decision sites (~`:136`, `:290-334`) | Bridge/reclaim/respawn lease control flow; no metrics | update — classify transitions + `emitLeaseMetric()` no-op-default | `rg -n 'maybeBridgeLeaseHolder\|OwnerLease\|leaseResult' mk-code-index-launcher.cjs` |
| Launcher metrics sink | Absent ("no metrics sink today") | not a consumer yet — stub a sink interface, default no-op | `rg -n 'metric\|sink\|gauge\|telemetry' mk-code-index-launcher.cjs` → expect zero today |

Required inventories:
- Doc-symbol token absence (confirms PENDING): `rg -n 'heading.*node\|extractMarkdownHeadings\|extractConfigKeys\|doc-symbol' .opencode/skills/system-code-graph/mcp_server` → expect zero hits before this phase.
- SymbolKind consumers: `rg -n ': SymbolKind\|SymbolKind\b' .opencode/skills/system-code-graph/mcp_server/lib` — every kind-keyed map/switch must tolerate the two new kinds.
- Lease-metric token absence: `rg -n 'emitLeaseMetric\|lease.*class\|leaseMetric' .opencode/bin/mk-code-index-launcher.cjs` → expect zero before this phase.
- Invariant (idempotence): a rescan of unchanged doc content MUST yield byte-identical doc nodes/edges (content-derived ids), and `emitLeaseMetric()` MUST be a pure side-effect that changes no lease decision.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the live `=== 'doc'` early-return line range in `structural-indexer.ts` (currently `:1237-1249`) and the `SymbolKind` union line (`indexer-types.ts:13-16`)
- [ ] Inventory `SymbolKind` consumers and the `code-graph-context` render path for closed-vocab assumptions (the `q5-f4` render-tolerance confirm)
- [ ] Confirm the default-glob `**/*.md` omission (`indexer-types.ts:156-177`) and decide json/yaml/toml-first vs markdown opt-in (REQ-006)
- [ ] Confirm zero existing doc-symbol / lease-metric tokens (PENDING baseline)

### Phase 2: Core Implementation
- [ ] Track A: extend `SymbolKind` with `'heading' \| 'key'`; add render tolerance in `code-graph-context.ts`
- [ ] Track A: build `doc-symbol-extractor.ts` — `extractMarkdownHeadings` (ATX + Setext, fenced-code-aware, nested `CONTAINS`) and `extractConfigKeys` (json/yaml/toml shallow nested walk), content-derived ids
- [ ] Track A: replace the empty `=== 'doc'` early-return with the extractor output (keep content-hash/parseHealth)
- [ ] Track B: classify lease-lifecycle transitions in `mk-code-index-launcher.cjs` and add the `emitLeaseMetric()` no-op-default sink stub

### Phase 3: Verification
- [ ] Unit: heading nesting by level; config keys top-level + nested; id stability across two rescans; empty/edge inputs degrade to zero nodes; fenced-code headings skipped
- [ ] Behavior: a `code_graph_context` query that returns a doc node renders without error (non-code kind tolerated); code-lane node/edge sets byte-identical to baseline
- [ ] Track B: lease classifier returns the correct class per transition; `emitLeaseMetric()` no-ops with no sink and changes no lease decision
- [ ] `node --check` / `tsc` clean; vitest green; docs reconciled; glob decision recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `extractMarkdownHeadings` (ATX/Setext/nesting/fenced-skip), `extractConfigKeys` (json/yaml/toml/malformed→0), `generateSymbolId` stability for new kinds | Vitest |
| Integration | `language === 'doc'` scan → doc nodes persisted → `code_graph_context` returns + renders them; code-lane parity vs baseline; lease classifier per transition | Vitest (in-memory or temp sqlite) |
| Manual | run `code_graph_scan` on a folder with markdown + a config file; query a heading/key; observe lease classes in a debug emit | mk-code-index MCP / `code-index.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `SymbolKind` union (`indexer-types.ts:13-16`) | Internal | Green | Extend in-phase; Q5-C1 cannot emit doc node kinds without it |
| `code-graph-context` non-code render path | Internal | Yellow | Must tolerate `heading`/`key`; closed-vocab caveat (roadmap §6) — verify before ship |
| Default include globs (`indexer-types.ts:156-177`) | Internal | Green | Markdown opt-in; json/yaml/toml already index → lane exercised immediately |
| Metrics sink for the launcher | Product | Red (none) | Q7 emit no-ops until a sink is chosen; classifier ships regardless (REQ-008) |
| Destructive-reindex txn boundary (`code-graph-db.ts`) | Internal | Green (untouched) | Out of scope — doc nodes reuse the existing node/edge write path; no migration |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: doc nodes destabilize a context query (render throw on a non-code kind), node-count balloons on a doc corpus, or the lease classifier perturbs a lease decision.
- **Procedure**: `git revert` the offending track's commit (Track A and Track B are independent commits). `code-graph.sqlite` is a rebuildable cache, so reverting the extractor and re-running `code_graph_scan` clears any doc nodes; reverting the launcher classifier restores the prior lease control flow exactly (the emit was a pure no-op side-effect).
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Track A (Q5-C1):  Confirm seams ──► SymbolKind + render tolerance ──► extractor ──► slot into 'doc' branch ──► Verify
Track B (Q7):     Confirm lease sites ──► classify transitions ──► no-op emit stub ──► Verify
                  (tracks are independent — either order)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm seams | None | SymbolKind/extractor (A), classifier (B) |
| SymbolKind + render tolerance (A) | Confirm seams | extractor slot-in |
| Doc-symbol extractor (A) | SymbolKind + render | Verify (A) |
| Lease classifier + emit stub (B) | Confirm lease sites | Verify (B) |
| Verify | Implement | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm seams | Low | 0.5-1 hour |
| Track A — SymbolKind + render tolerance | Low-Med | 1-2 hours |
| Track A — doc-symbol extractor + slot-in | Med | 3-5 hours |
| Track B — lease classifier + no-op emit | Low | 1-2 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **~8-13 hours (Q5-C1 is the bulk; Q7 is low)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration (doc nodes reuse the existing node/edge schema) — confirmed
- [ ] Baseline code-lane node/edge result set captured for byte-identity comparison
- [ ] Markdown glob decision recorded (json/yaml/toml-first vs `**/*.md` opt-in)
- [ ] Q7 sink confirmed absent → emit defaults no-op (no dashboard wired)

### Rollback Procedure
1. `git revert` the Track A commit (SymbolKind + extractor + render tolerance + slot-in) and/or the Track B commit (launcher classifier) — they are independent.
2. Re-run `code_graph_scan` to clear any persisted doc nodes (the `'doc'` branch returns to empty).
3. Smoke test: `code_graph_context` returns its prior payload for code symbols; the launcher's lease bridge/reclaim/respawn behavior is unchanged.

### Data Reversal
- **Has data migrations?** No (node/edge writes only; no schema change).
- **Reversal procedure**: N/A — `code-graph.sqlite` is a rebuildable cache; worst case is a full `code_graph_scan`.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`.
- **Task breakdown**: See `tasks.md`.
