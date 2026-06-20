---
title: "Implementation Summary: Code Graph - Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)"
description: "Implemented state - Q5-C1 turns the empty language==='doc' early-return into a deterministic no-LLM heading/key extractor (SymbolKind union extension + non-code render tolerance), Q7-lease classifies launcher lease-lifecycle transitions behind a no-op-default emit stub. Metrics sink/dashboard wiring remains out of scope."
trigger_phrases:
  - "code graph doc symbol lane implementation summary"
  - "q5-c1 doc symbol extractor implemented"
  - "lease classification telemetry not shipped"
  - "symbolkind heading key render tolerance build"
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
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-008-doc-symbol-lane"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which metrics sink will the launcher adopt later? This phase intentionally leaves sink/dashboard wiring out of scope."
    answered_questions:
      - "Q5-C1 and Q7-lease are implemented in this phase"
      - "Q5-C1 is a tier-2 BUILD, not merely a SymbolKind tolerance note"
      - "The doc lane touches no schema migration - doc nodes reuse the existing node/edge write path"
      - "Markdown remains opt-in in default globs, json/yaml/toml exercise the lane immediately"
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/002-code-graph/008-doc-symbol-lane` |
| **Completed** | 2026-06-19 (2 of 2 candidates implemented, shipped in commit `b18c077311`) |
| **Level** | 2 |
| **Candidates** | Q5-C1 / `Q5-C1-doc-symbol-extractor` (DONE), Q7-lease-classification-telemetry (DONE: classifier + no-op emit) |
| **Shipped In** | Commit `b18c077311` (feat(028) wave-2 build naming the doc-symbol lane) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This sub-phase built two independent, additive capability adds against confirmed seams. The code graph's doc lane now stops being a write-only content-hash and starts answering questions: markdown headings become queryable `heading` nodes nested by level, and json/jsonc/yaml/yml/toml keys become `key` nodes, all with deterministic ids that stay stable across rescans, all from a local regex/key walk with no LLM and no network. Track B gives the launcher its first lease-churn classification: lease lifecycle transitions get names and counter payloads, routed through a no-op-default sink until a real metrics sink exists.

### Q5-C1 doc-symbol extractor (DONE - tier-2 BUILD)

Today `'doc'` is excluded from the tree-sitter parser type (`tree-sitter-parser.ts:67` `type ParserLanguage = Exclude<SupportedLanguage, 'doc'>`), and when `language === 'doc'` the indexer short-circuits to an empty result (`structural-indexer.ts:1237` returns `{nodes:[], edges:[], contentHash, parseHealth:'clean'…}`) - a doc row is purely a change-detection content-hash [CONFIRMED: research iter-4 findings `q5-f1`, `q5-f2`]. Worse, `**/*.md` is omitted from the default include globs entirely, with an explicit comment, so only json/jsonc/yaml/yml/toml even reach the doc lane today, and they reach it only to produce empty rows [CONFIRMED: `indexer-types.ts:156-177`, finding `q5-f3`].

The change replaces that empty branch with a dependency-free extractor (`doc-symbol-extractor.ts`, new):

- `extractMarkdownHeadings(content)` parses ATX (`^#{1,6} `) and Setext headings into `heading` nodes with parent-`CONTAINS`-child nesting by heading level, skipping fenced code regions so a `#` inside a code block is not mistaken for a heading;
- `extractConfigKeys(content, language)` walks json/yaml/toml top-level and nested keys into `key` nodes via a shallow key walk (structure, never `eval`, so a value that looks like a key is not promoted);
- every node id is content-derived through the kind-agnostic `generateSymbolId(filePath, fqName, kind)` (`indexer-types.ts:100`, `sha256(filePath::fqName::kind)`), so a rescan of unchanged doc content yields a byte-identical node/edge set.

Research reclassifies this from a passive note to a real **tier-2 BUILD** (002 iter-4, ranking `Q5-C1=12`, `disposition:BUILD`): the inferred slot-in (`q5-f4`) "confirms with" two concrete BUILD items - extending the `SymbolKind` union (`indexer-types.ts:13`) to admit `'heading' | 'key'`, and making the `code-graph-context` render path tolerate those non-code kinds without assuming a closed code vocabulary [roadmap L192 "tier-2 BUILD candidate (002 iter-4), not merely a SymbolKind tolerance note"].

### Q7-lease-classification telemetry (DONE - low-priority observability)

The mk-code-index launcher already computed lease-lifecycle decisions - bridge an alive owner, reclaim a stale heartbeat, respawn a dead owner - and this phase now names those transitions (held-by-other / bridged-secondary / stale-reclaimed / respawned) and routes them through a sink-agnostic `emitLeaseMetric(class, …)` that defaults to a no-op. Because no sink exists, this phase delivers the classifier plus the no-op stub - the durable deliverable - not a wired dashboard.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as two independent tracks that share no code path. Track A extended `SymbolKind`, added render tolerance, built the deterministic extractor, and slotted it into the single `=== 'doc'` early-return while preserving `contentHash` and `parseHealth:'clean'`. Markdown remains opt-in because `**/*.md` is omitted from default globs, json/yaml/toml exercise the lane immediately. Track B classified existing lease transitions and added the no-op-default emit. Neither track touches the destructive `code-graph-db.ts` reindex transaction boundary, so **no schema migration is required** - doc nodes reuse the existing node/edge write path. The work shipped in commit `b18c077311` (feat(028) wave-2 build), touching `doc-symbol-extractor.ts`, `indexer-types.ts`, `structural-indexer.ts` and `code-graph-context.ts` plus the indexer and launcher-lease vitests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat Q5-C1 as a tier-2 BUILD, not a tolerance note | The inferred slot-in (`q5-f4`) only works once `SymbolKind` admits `'heading' | 'key'` AND the render path tolerates non-code kinds, research explicitly promotes both confirm-items to real BUILD work [roadmap L192] |
| Content-derived doc-node ids, no LLM, no network | A rescan of unchanged doc content must yield byte-identical nodes/edges or every scan looks like delete+create, `generateSymbolId` is already kind-agnostic so the new kinds get stable ids for free |
| Ship json/yaml/toml-first, keep `**/*.md` an explicit opt-in | Markdown is deliberately omitted from the default globs, json/yaml/toml already produce doc rows and exercise the lane immediately, while bringing markdown in risks ballooning node count on a large doc corpus (REQ-006) |
| Skip fenced code regions in the heading scanner | A `#` inside a fenced code block is not a heading, the adversarial case is called out as a required test rather than left to surprise (REQ-001) |
| Q7 ships a classifier + no-op-default emit, not a dashboard | There is no metrics sink today (roadmap L296), the durable deliverable is the named classification derived from existing control flow, with the emit stubbed so it changes no lease behavior until a sink is chosen |
| No schema migration - additive only | Doc nodes reuse the existing node/edge schema and the lane sits behind the existing `=== 'doc'` guard, so Q5-C1 is independent of the Q1-C1/Q6-C1 reindex-transaction cluster and ships on its own |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Q5-C1 markdown-heading extraction (ATX/Setext, fenced-skip, nesting) | PASS - `doc-symbol-extractor.vitest.ts` |
| Q5-C1 config-key extraction (json/jsonc/yaml/yml/toml shallow walk) | PASS - `doc-symbol-extractor.vitest.ts`, persistence-facing counts in `code-graph-indexer.vitest.ts` |
| SymbolKind union admits `'heading' | 'key'`, stable ids | PASS - typecheck plus ID-stability test |
| Non-code render tolerance in `code-graph-context` | PASS - `code-graph-context-handler.vitest.ts` |
| Idempotence - rescan yields byte-identical doc nodes/edges | PASS - `doc-symbol-extractor.vitest.ts` |
| Markdown glob decision recorded (json/yaml/toml-first) | PASS - default globs remain markdown opt-in, config docs exercise the lane |
| Q7-lease classifier per transition + no-op-default emit | PASS - `launcher-lease.vitest.ts` |
| `validate.sh --strict` on this folder | PASS: 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Commit.** The two candidates shipped in commit `b18c077311` (feat(028) wave-2 build), grounded by the touched code files plus the indexer and launcher-lease vitests.
2. **Markdown stays opt-in.** The heading extractor is inert for `.md` until `**/*.md` is added by a caller, json/yaml/toml exercise the lane immediately.
3. **Q7 has nowhere to emit by default.** There is no metrics sink on the launcher today, so `emitLeaseMetric()` no-ops by default and no dashboard is wired. The classifier is the durable deliverable, actual telemetry is gated on a later sink decision.
4. **No benefit number is measured.** The phase proves capability and regression safety, not retrieval lift.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
- **Research evidence**: `../research/research.md` (baseline row "Doc-lane is hash-only"), `../research/iterations/iteration-004.md` (Q5 answered, ranking `Q5-C1=12` BUILD), `../research/deltas/iter-004.jsonl` (`q5-f1..f4`, `cand-q5-c1-doc-symbol-pass`)
- **Roadmap**: `../../research/roadmap.md` (Q5-C1 tier-2 BUILD L192, Q7 lease-classification telemetry L296, "no metrics sink today")
- **Synthesis**: `../../research/synthesis/05-all-findings-plain-language.md` (item 26 "Index doc + config symbols (Q5-C1) tier-2"), `../../research/synthesis/01-go-candidates.md`
- **Wave-0 shipped record**: Wave-0 record was prior-state evidence only, this phase now implements Q5-C1 and Q7-lease locally
<!-- /ANCHOR:related-docs -->
