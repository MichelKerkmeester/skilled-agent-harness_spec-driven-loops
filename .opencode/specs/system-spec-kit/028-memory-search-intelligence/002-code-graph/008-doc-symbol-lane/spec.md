---
title: "Feature Specification: Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)"
description: "Two independent capability adds for the code graph: a local no-LLM doc-symbol extractor that fills the empty language==='doc' early-return (markdown headings → heading nodes, json/yaml/toml keys → key nodes with content-derived ids), needing a SymbolKind union extension and non-code render tolerance; plus low-priority lease-classification telemetry on the mk-code-index launcher, which has no metrics sink today."
trigger_phrases:
  - "code graph doc symbol lane"
  - "q5-c1 doc symbol extractor"
  - "markdown heading config key nodes"
  - "code graph lease classification telemetry"
  - "symbolkind non code render tolerance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/008-doc-symbol-lane"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented Q5-C1 doc-symbol lane and Q7 lease classifier/no-op emit"
    next_safe_action: "Run strict validation and hand off the implemented phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/05-all-findings-plain-language.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-008-doc-symbol-lane"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Feature Specification: Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Implemented |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/002-code-graph |
| **Candidates** | Q5-C1 (DONE: doc-symbol extractor), Q5-C1-doc-symbol-extractor (DONE: build key), Q7-lease-classification-telemetry (DONE: classifier + no-op emit; sink wiring out of scope) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph doc lane is hash-only: `'doc'` is excluded from the tree-sitter parser type (`tree-sitter-parser.ts:67` `type ParserLanguage = Exclude<SupportedLanguage,'doc'>`), and when `language === 'doc'` the indexer short-circuits to an empty result (`structural-indexer.ts:1237-1249` returns `{nodes:[], edges:[], contentHash, parseHealth:'clean'…}`). A doc row is therefore purely a change-detection content-hash — markdown headings and json/yaml/toml keys are never queryable as graph nodes (and `**/*.md` is omitted from the default include globs entirely). Separately, the mk-code-index launcher classifies lease lifecycle events (held / bridged / reclaimed / respawned) but has no metrics sink, so that classification is computed for control flow and dropped — there is no observability into lease churn.

### Purpose
Add two independent, additive capabilities: a deterministic zero-token doc-symbol extractor that turns the empty `'doc'` early-return into real `heading`/`key` graph nodes (Q5-C1, a tier-2 BUILD), and low-priority lease-classification telemetry that surfaces launcher lease-lifecycle counts once a metrics sink exists (Q7-lease, design-and-stub).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Q5-C1 (tier-2 BUILD, doc-symbol extractor) — DONE:** Replace the empty `language === 'doc'` early-return (`structural-indexer.ts:1237`) with a dependency-free, deterministic extractor — markdown ATX/Setext headings → `heading` nodes with parent-`CONTAINS`-child nesting by heading level; structured config (json/yaml/toml) top-level + nested keys → `key` nodes via a shallow key walk. All node ids content-derived (idempotent across rescans), no LLM, no network.
- **SymbolKind union extension (tier-2 BUILD, not a tolerance note):** Extend `SymbolKind` in `indexer-types.ts:13-16` to admit `heading` and `key`, and make the downstream `code-graph-context` rendering tolerate non-code node kinds (the research explicitly reclassifies this from a passive "tolerance note" to an active BUILD).
- **Markdown include-glob opt-in:** Document that `**/*.md` is deliberately omitted from the default globs (`indexer-types.ts:156-177`, explicit comment ~`:169-171`); the doc-symbol lane is inert for markdown until markdown is in scope, so the lane MUST ship behind/with the glob decision (json/yaml/toml already index as empty doc rows and exercise the new lane immediately).
- **Q7-lease-classification-telemetry (low-priority observability) — DONE:** On the mk-code-index launcher, classify lease-lifecycle transitions (lease held by other / bridged secondary / stale-reclaimed / respawned) into named counters and emit them through whatever metrics sink the launcher adopts. Because there is no metrics sink today, this phase delivers the classification + a sink-agnostic emit stub (no-op default), not a wired dashboard.

### Out of Scope
- Trust multiplier (Q4-C1) — already shipped in 030 `e21caf5de6`; separate phase.
- Generation watermark (Q6-C2/Q6-C1) — sibling phase `003-generation-watermark`.
- Bi-temporal `valid_at`/`invalid_at` columns (Q1-C1), PPR-seeded impact ranking (Q3-C1), rename-supersede edges (Q1-C2), edge-staleness/dependency-transitivity (CG-edge-staleness) — other phases; the doc lane touches none of the destructive-reindex transaction boundary.
- Building or selecting a metrics sink for the launcher — Q7 is gated on a sink existing; this phase only classifies + stubs the emit. No dashboard, no Prometheus/statsd wiring.
- Tree-sitter parsing of doc content, or treating markdown prose as code — the lane is a deterministic regex/key walk only; the parser-language exclusion stays.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` | Modify | Extend `SymbolKind` union (`:13-16`) with `'heading' \| 'key'`; confirm `generateSymbolId` (`:100`) accepts the new kinds (it is kind-agnostic — `sha256(filePath::fqName::kind)`) |
| `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts` | Modify | Replace the empty `if (language === 'doc')` early-return (`:1237-1249`) with the doc-symbol extractor producing `heading`/`key` nodes + `CONTAINS` nesting edges; keep `contentHash`/`parseHealth:'clean'` on the result |
| `.opencode/skills/system-code-graph/mcp_server/lib/doc-symbol-extractor.ts` (new) | Create | Dependency-free extractor: `extractMarkdownHeadings(content)` (ATX `^#{1,6} ` + Setext) and `extractConfigKeys(content, language)` (json/yaml/toml shallow nested key walk), returning content-derived nodes/edges |
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modify | Render tolerance for non-code node kinds (`heading`/`key`) — confirm formatting/`kind` handling does not assume a code SymbolKind |
| `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts` (globs) | Modify (opt-in) | If markdown is brought in scope, add `**/*.md` to the default include globs (`:156-177`); else document the lane stays json/yaml/toml-only |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify | Classify lease-lifecycle transitions into named counters (held/bridged/reclaimed/respawned) and route them through a sink-agnostic `emitLeaseMetric()` stub (no-op default) |
| `.opencode/skills/system-code-graph/mcp_server/lib/*.vitest.ts` (or co-located test) | Create/Modify | Tests: markdown headings → nested `heading` nodes; config keys → `key` nodes; ids stable across rescans; empty/edge inputs; non-code render path; lease-classifier returns the right class per transition |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Q5-C1: deterministic markdown-heading extraction | `extractMarkdownHeadings()` parses ATX (`^#{1,6} `) and Setext headings into `heading` nodes with parent-`CONTAINS`-child edges by heading level; output is byte-identical across two runs on the same content (content-derived ids, no LLM/network) — research iter-4 C1, `structural-indexer.ts:1237` |
| REQ-002 | Q5-C1: deterministic config-key extraction | `extractConfigKeys()` walks json/yaml/toml top-level + nested keys into `key` nodes via a shallow key walk (no eval); ids content-derived and idempotent — research iter-4 C1, finding `q5-f3` (only json/jsonc/yaml/yml/toml index today) |
| REQ-003 | SymbolKind union admits the new kinds | `SymbolKind` (`indexer-types.ts:13-16`) extended with `'heading' \| 'key'`; `generateSymbolId(filePath, fqName, kind)` (`:100`) produces stable ids for them; this is the confirmed-with item from `q5-f4` ("SymbolKind union tolerance for heading/key") promoted to a real BUILD |
| REQ-004 | Non-code render tolerance | `code-graph-context` rendering tolerates `heading`/`key` node kinds without assuming a code SymbolKind (the second half of the `q5-f4` confirm — "render tolerance for non-code nodes"); a context query that returns a doc node does not throw or mis-format |
| REQ-005 | Additive, off the destructive-reindex boundary | The lane is a new branch behind the existing `=== 'doc'` guard; code lanes (js/ts/python/bash) and the `code_edges` write path are untouched; conflict is L (research iter-4 C1, ranking row Q5-C1=12, BUILD) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Markdown glob decision recorded | The default-glob omission of `**/*.md` (`indexer-types.ts:156-177`, comment `:169-171`) is documented; the lane ships json/yaml/toml-first (those already produce doc rows), and `**/*.md` inclusion is an explicit opt-in so the heading extractor is not a no-op-for-markdown surprise (finding `q5-f3`) |
| REQ-007 | Q7-lease: classify lease-lifecycle transitions | The launcher computes a named lease class per transition (held-by-other / bridged-secondary / stale-reclaimed / respawned) at the existing lease decision sites (`mk-code-index-launcher.cjs` `maybeBridgeLeaseHolder` ~`:136`, owner-lease read/write ~`:290-334`); classes are derived from existing control flow, not new state — research 005-revisit-027, roadmap 027-REVISIT L296 |
| REQ-008 | Q7-lease: sink-agnostic emit stub, no-op default | An `emitLeaseMetric(class, …)` stub routes classified events to a metrics sink interface that defaults to no-op (because "no metrics sink today" — roadmap L296); no dashboard is wired and no behavior changes when the sink is absent; the emit is the only new side-effect |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: DONE — Q5-C1 ships; the empty `language === 'doc'` early-return is replaced by a deterministic, dependency-free extractor that emits `heading` nodes (with `CONTAINS` nesting) for markdown and `key` nodes for json/yaml/toml, with content-derived ids that are byte-identical across rescans.
- **SC-002**: DONE — `SymbolKind` admits `'heading' \| 'key'` and `code-graph-context` renders those non-code node kinds without error.
- **SC-003**: DONE — the doc lane is additive and conflict-L; code parser lanes and the destructive-reindex write path are untouched, and the `**/*.md` glob decision is explicitly recorded (lane is json/yaml/toml-first).
- **SC-004**: DONE — Q7-lease ships its classifier + a no-op-default emit stub; lease-lifecycle transitions are named and routed through a sink-agnostic interface, with zero behavior change while no sink is configured.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `SymbolKind` union (`indexer-types.ts:13-16`) | Q5-C1 cannot emit `heading`/`key` nodes without the union extension | REQ-003 extends it; `generateSymbolId` is already kind-agnostic |
| Dependency | `code-graph-context` non-code render path | Doc nodes must render without assuming a code kind | REQ-004 adds tolerance; verify formatting before shipping |
| Dependency | Default include globs (`indexer-types.ts:156-177`) | Markdown is omitted by default → heading extractor inert for `.md` until opt-in | REQ-006 records the decision; ship json/yaml/toml-first |
| Dependency | A metrics sink for the launcher | Q7 emit has nowhere to go ("no metrics sink today") | REQ-008 stubs a no-op-default sink; wiring deferred to a sink decision |
| Risk | Doc extractor produces unstable ids across rescans | Edge churn, false delete+create on every scan | Content-derived ids (REQ-001/002), apply-once idempotence (research iter-4 cross-cut) |
| Risk | Render path assumes a closed code-kind vocabulary | Context query throws / mis-formats on a doc node | REQ-004 tolerance test; closed-vocab caveat (roadmap §6 "WEAKER than billed") — keep the extension minimal and tested |
| Risk | Markdown indexing balloons the graph | Many headings → node-count growth on a large doc corpus | Lane is json/yaml/toml-first; `**/*.md` stays opt-in (REQ-006); headings only (not prose) |
| Risk | Q7 classifier couples to launcher control flow | A lease-logic refactor breaks the classifier | Derive classes from existing transitions read-only; no new lease state (REQ-007) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The doc-symbol extractor is a single-pass regex/key walk per doc file — O(content length), no parser spin-up; cheaper than the tree-sitter path it sits beside (the `'doc'` branch never invoked the parser).
- **NFR-P02**: Node-count growth is bounded by heading/key cardinality; markdown stays opt-in (REQ-006) so the default json/yaml/toml corpus sees only config-key nodes.

### Security
- **NFR-S01**: No new external input and no code execution — config keys are extracted by a shallow walk, never `eval`/`require`; markdown is regex-scanned. No auth surface change.
- **NFR-S02**: Q7 lease telemetry emits only internal lifecycle classes + counts (no secrets, no file contents); the no-op-default sink cannot leak.

### Reliability
- **NFR-R01**: `code-graph.sqlite` is a rebuildable cache — any defect in the doc lane is recovered by `code_graph_scan`, never data loss.
- **NFR-R02**: Content-derived doc-node ids are idempotent: a rescan of unchanged doc content yields the identical node/edge set (no spurious churn).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty doc file: extractor returns `{nodes:[], edges:[]}` with the content-hash preserved (same shape as today's early-return).
- Doc with no headings / no keys (e.g. prose-only markdown, empty json `{}`): zero nodes, no error.
- Deeply nested config or many heading levels: nesting `CONTAINS` edges follow the level/depth; ids stay content-derived.
- Malformed json/yaml/toml: the shallow key walk degrades to zero keys rather than throwing (parse-tolerant, mirroring `parseHealth:'clean'` doc semantics).

### Error Scenarios
- Heading regex ambiguity (e.g. `#` inside a fenced code block): the extractor SHOULD skip fenced regions to avoid false headings — adversarial case to test (REQ-001).
- A config value that looks like a key: the walk keys on structure, not string content, so values are not mis-promoted to `key` nodes.
- Q7 sink unavailable / not configured: `emitLeaseMetric()` no-ops (REQ-008); the launcher's lease behavior is unchanged.

### State Transitions
- First scan of a doc file: 0 → N doc nodes; a later edit that changes the content-hash re-extracts; unchanged content re-uses identical ids (no delete+create).
- Lease lifecycle (Q7): a secondary that bridges an alive owner emits `bridged-secondary`; a stale-owner reclaim emits `stale-reclaimed`; a dead-owner respawn emits `respawned` — each derived from the existing decision (`maybeBridgeLeaseHolder`, owner-lease exclusive write).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | New extractor module + SymbolKind extension + render tolerance + launcher classifier; ~3 source files + 1 new file + launcher (Q5-C1 effort M, Q7 low) |
| Risk | 9/25 | Additive/reversible (low) — off the destructive-reindex boundary; closed-vocab render path is the one caveat; Q7 is no-op-default |
| Research | 6/20 | Fully code-mapped (research iter-4 Q5; 005-revisit-027 Q7); residual confirms = SymbolKind/render tolerance + sink existence |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Does `code-graph-context` rendering branch on the closed code-kind vocabulary anywhere (formatters, `kind`-keyed maps)? The research flags this as the `q5-f4` confirm item — verify the render path tolerates `heading`/`key` before shipping (closed-vocab caveat, roadmap §6).
- Should markdown (`**/*.md`) be brought into the default include globs in this phase, or stay opt-in? The default comment (`indexer-types.ts:169-171`) deliberately omits it; shipping json/yaml/toml-first avoids a node-count surprise (REQ-006).
- For Q7, which metrics sink will the launcher adopt? There is none today (roadmap L296), so the emit stub stays no-op-default until that decision; the classifier is the durable deliverable.
- Should the config-key walk reuse the host's available parsers (`JSON.parse` for json; a yaml/toml lib) or stay a fully dependency-free shallow scanner? Research iter-4 leaves this open ("already-available parsers … or a shallow key walk"); the dependency-free path is the conservative default.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation plan**: See `plan.md`.
- **Task breakdown**: See `tasks.md`.
- **Subsystem research**: See `../research/research.md` (doc-lane baseline row "Doc-lane is hash-only") and `../research/iterations/iteration-004.md` (Q5 answered; C1 build sketch; ranking Q5-C1=12 BUILD) + `../research/deltas/iter-004.jsonl` (findings `q5-f1..f4`, proposal `cand-q5-c1-doc-symbol-pass`).
- **Authoritative roadmap**: See `../../research/roadmap.md` (Q5-C1 tier-2 BUILD, "not merely a SymbolKind tolerance note" L192; Q7 lease-classification telemetry L296, "no metrics sink today").
- **Synthesis**: See `../../research/synthesis/05-all-findings-plain-language.md` (item 26 "Index doc + config symbols (Q5-C1) tier-2" L160) and `../../research/synthesis/01-go-candidates.md`.
- **Prior shipped record (Wave-0)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 was used only to confirm these candidates were not already shipped before this phase; Q5-C1 and Q7-lease are now implemented locally in this phase.
<!-- /ANCHOR:related-docs -->
