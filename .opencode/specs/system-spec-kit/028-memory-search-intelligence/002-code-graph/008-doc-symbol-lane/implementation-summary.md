---
title: "Implementation Summary: Code Graph — Doc-Symbol Lane + Lease Telemetry (Q5-C1, Q7-lease)"
description: "PENDING state — both candidates are planned against confirmed seams but not implemented. Q5-C1 turns the empty language==='doc' early-return into a deterministic no-LLM heading/key extractor (a tier-2 BUILD: SymbolKind union extension + non-code render tolerance, not a passive tolerance note); Q7-lease classifies launcher lease-lifecycle transitions behind a no-op-default emit stub. Neither appears in 030 spec §14 (the only shipped Code-Graph candidate is Q4-C1, e21caf5de6) → both PENDING."
trigger_phrases:
  - "code graph doc symbol lane implementation summary"
  - "q5-c1 doc symbol extractor pending"
  - "lease classification telemetry not shipped"
  - "symbolkind heading key render tolerance build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/008-doc-symbol-lane"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author doc-symbol-lane impl-summary (PENDING: 0 of 2 shipped)"
    next_safe_action: "Implement Track A: extend SymbolKind, build the doc-symbol extractor"
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
    completion_pct: 0
    open_questions:
      - "Does code-graph-context branch on a closed code-kind vocabulary anywhere (the q5-f4 render-tolerance confirm)?"
      - "Bring **/*.md into the default globs this phase, or ship json/yaml/toml-first?"
      - "Which metrics sink will the launcher adopt for Q7 (none today)?"
    answered_questions:
      - "Q5-C1 and Q7-lease are both PENDING — absent from 030 §14 (only Q4-C1 shipped)"
      - "Q5-C1 is a tier-2 BUILD, not merely a SymbolKind tolerance note (roadmap L192)"
      - "The doc lane touches no schema migration — doc nodes reuse the existing node/edge write path"
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
| **Completed** | Not started (0 of 2 candidates shipped — PENDING) |
| **Level** | 2 |
| **Candidates** | Q5-C1 / `Q5-C1-doc-symbol-extractor` (PENDING), Q7-lease-classification-telemetry (PENDING) |
| **Shipped In** | None — absent from 030 spec §14 (only Q4-C1 shipped for Code Graph, `e21caf5de6`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been built yet. This sub-phase plans two independent, additive capability adds against confirmed seams. The headline once Track A ships: the code graph's doc lane stops being a write-only content-hash and starts answering questions — a markdown file's headings become queryable `heading` nodes nested by level, and a json/yaml/toml file's keys become `key` nodes, all with content-derived ids that stay stable across rescans, all from a deterministic regex/key walk with no LLM and no network. Track B gives the launcher its first lease-churn visibility: every lease lifecycle transition gets a name and a counter, ready for whatever metrics sink the launcher eventually adopts.

### Q5-C1 doc-symbol extractor (PENDING — tier-2 BUILD)

Today `'doc'` is excluded from the tree-sitter parser type (`tree-sitter-parser.ts:67` `type ParserLanguage = Exclude<SupportedLanguage, 'doc'>`), and when `language === 'doc'` the indexer short-circuits to an empty result (`structural-indexer.ts:1237` returns `{nodes:[], edges:[], contentHash, parseHealth:'clean'…}`) — a doc row is purely a change-detection content-hash [CONFIRMED: research iter-4 findings `q5-f1`, `q5-f2`]. Worse, `**/*.md` is omitted from the default include globs entirely, with an explicit comment, so only json/jsonc/yaml/yml/toml even reach the doc lane today, and they reach it only to produce empty rows [CONFIRMED: `indexer-types.ts:156-177`; finding `q5-f3`].

The planned change replaces that empty branch with a dependency-free extractor (`doc-symbol-extractor.ts`, new):

- `extractMarkdownHeadings(content)` parses ATX (`^#{1,6} `) and Setext headings into `heading` nodes with parent-`CONTAINS`-child nesting by heading level, skipping fenced code regions so a `#` inside a code block is not mistaken for a heading;
- `extractConfigKeys(content, language)` walks json/yaml/toml top-level and nested keys into `key` nodes via a shallow key walk (structure, never `eval`, so a value that looks like a key is not promoted);
- every node id is content-derived through the kind-agnostic `generateSymbolId(filePath, fqName, kind)` (`indexer-types.ts:100`, `sha256(filePath::fqName::kind)`), so a rescan of unchanged doc content yields a byte-identical node/edge set.

Research reclassifies this from a passive note to a real **tier-2 BUILD** (002 iter-4, ranking `Q5-C1=12`, `disposition:BUILD`): the inferred slot-in (`q5-f4`) "confirms with" two concrete BUILD items — extending the `SymbolKind` union (`indexer-types.ts:13`) to admit `'heading' | 'key'`, and making the `code-graph-context` render path tolerate those non-code kinds without assuming a closed code vocabulary [roadmap L192 "tier-2 BUILD candidate (002 iter-4), not merely a SymbolKind tolerance note"].

### Q7-lease-classification telemetry (PENDING — low-priority observability)

The mk-code-index launcher already computes lease-lifecycle decisions — bridge an alive owner, reclaim a stale heartbeat, respawn a dead owner — at `maybeBridgeLeaseHolder` (`mk-code-index-launcher.cjs:136`), the owner-lease read/write sites (`readOwnerLeaseFile:290`, `writeOwnerLeaseFileExclusive:317`), and the stale-heartbeat-reclaim path (`:357-366`). That classification is consumed for control flow and dropped: a grep for `metric|gauge|telemetry|emitLeaseMetric` on the launcher returns nothing — there is no metrics sink today [CONFIRMED: live grep; roadmap L296]. The planned change names each transition (held-by-other / bridged-secondary / stale-reclaimed / respawned) and routes it through a sink-agnostic `emitLeaseMetric(class, …)` that defaults to a no-op. Because no sink exists, this phase delivers the classifier plus the no-op stub — the durable deliverable — not a wired dashboard.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. plan.md sequences the work as two independent tracks that share no code path and can land in either order. Track A (Q5-C1) is the bulk: extend `SymbolKind` and add render tolerance, build the deterministic extractor, slot it into the single `=== 'doc'` early-return while preserving `contentHash`/`parseHealth:'clean'`, and ship json/yaml/toml-first because `**/*.md` is omitted from the default globs (the `.md` glob is an explicit opt-in so the heading extractor is not a silent no-op for markdown). Track B (Q7) is low-effort: classify the existing lease transitions and add the no-op-default emit. Neither track touches the destructive `code-graph-db.ts` reindex transaction boundary, so **no schema migration is required** — doc nodes reuse the existing node/edge write path. The change is reversible (Track A and Track B are independent commits; `code-graph.sqlite` is a rebuildable cache), branch-scoped, and verified with focused Vitest plus `validate.sh --strict`. Nothing is committed, pushed, or deployed without explicit user approval.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat Q5-C1 as a tier-2 BUILD, not a tolerance note | The inferred slot-in (`q5-f4`) only works once `SymbolKind` admits `'heading' | 'key'` AND the render path tolerates non-code kinds; research explicitly promotes both confirm-items to real BUILD work [roadmap L192] |
| Content-derived doc-node ids, no LLM, no network | A rescan of unchanged doc content must yield byte-identical nodes/edges or every scan looks like delete+create; `generateSymbolId` is already kind-agnostic so the new kinds get stable ids for free |
| Ship json/yaml/toml-first; keep `**/*.md` an explicit opt-in | Markdown is deliberately omitted from the default globs; json/yaml/toml already produce doc rows and exercise the lane immediately, while bringing markdown in risks ballooning node count on a large doc corpus (REQ-006) |
| Skip fenced code regions in the heading scanner | A `#` inside a fenced code block is not a heading; the adversarial case is called out as a required test rather than left to surprise (REQ-001) |
| Q7 ships a classifier + no-op-default emit, not a dashboard | There is no metrics sink today (roadmap L296); the durable deliverable is the named classification derived from existing control flow, with the emit stubbed so it changes no lease behavior until a sink is chosen |
| No schema migration — additive only | Doc nodes reuse the existing node/edge schema and the lane sits behind the existing `=== 'doc'` guard, so Q5-C1 is independent of the Q1-C1/Q6-C1 reindex-transaction cluster and ships on its own |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Q5-C1 markdown-heading extraction (ATX/Setext, fenced-skip, nesting) | PENDING (planned; seam confirmed `structural-indexer.ts:1237`) |
| Q5-C1 config-key extraction (json/yaml/toml shallow walk) | PENDING (planned; only json/jsonc/yaml/yml/toml index today, `q5-f3`) |
| SymbolKind union admits `'heading' | 'key'`; stable ids | PENDING (seam confirmed `indexer-types.ts:13`, `:100` kind-agnostic) |
| Non-code render tolerance in `code-graph-context` | PENDING (the `q5-f4` confirm item; render path to audit before ship) |
| Idempotence — rescan yields byte-identical doc nodes/edges | PENDING (content-derived ids planned; test to be written) |
| Markdown glob decision recorded (json/yaml/toml-first) | PENDING (REQ-006; `indexer-types.ts:156-177` omission to document) |
| Q7-lease classifier per transition + no-op-default emit | PENDING (seams confirmed `mk-code-index-launcher.cjs:136,290,317,357-366`; no metrics sink today) |
| `validate.sh --strict` on this folder | Expected PASS (spec-doc structure authored to Level-2 template) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** Both candidates are absent from 030 spec §14 — the only Code-Graph candidate shipped in Wave-0 was Q4-C1 (`e21caf5de6`). There is no commit hash for Q5-C1 or Q7-lease; this summary documents the planned/pending state per the phase's research-then-implement structure.
2. **Render-tolerance is the one real risk.** Q5-C1 is conflict-L and off the destructive-reindex boundary, but if `code-graph-context` branches on a closed code-kind vocabulary anywhere, a context query that returns a doc node could throw or mis-format. The closed-vocab caveat is flagged (roadmap §6 "WEAKER than billed"); REQ-004 makes render tolerance a tested gate before shipping.
3. **Markdown stays opt-in.** The heading extractor is inert for `.md` until `**/*.md` is brought into the default globs; shipping json/yaml/toml-first avoids a node-count surprise on a large doc corpus (REQ-006). The lane is exercised immediately by config files regardless.
4. **Q7 has nowhere to emit.** There is no metrics sink on the launcher today (roadmap L296), so `emitLeaseMetric()` no-ops by default and no dashboard is wired. The classifier is the durable deliverable; the actual telemetry is gated on a later sink decision.
5. **No benefit number is measured.** Every leverage/effort tag is structural inference, never a benchmarked delta (research §6 / roadmap §6). Q5-C1's M-effort and Q7's low-priority ratings come from the seam shape, not a measured retrieval gain.
6. **Config-key walk dependency is open.** Research leaves open whether to reuse the host's available parsers (`JSON.parse`, a yaml/toml lib) or stay a fully dependency-free shallow scanner; the conservative dependency-free path is the default until that is resolved at build.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Checklist**: See `checklist.md`
- **Research evidence**: `../research/research.md` (baseline row "Doc-lane is hash-only"), `../research/iterations/iteration-004.md` (Q5 answered; ranking `Q5-C1=12` BUILD), `../research/deltas/iter-004.jsonl` (`q5-f1..f4`, `cand-q5-c1-doc-symbol-pass`)
- **Roadmap**: `../../research/roadmap.md` (Q5-C1 tier-2 BUILD L192; Q7 lease-classification telemetry L296, "no metrics sink today")
- **Synthesis**: `../../research/synthesis/05-all-findings-plain-language.md` (item 26 "Index doc + config symbols (Q5-C1) tier-2"), `../../research/synthesis/01-go-candidates.md`
- **Wave-0 shipped record**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (only Q4-C1 = row 13, `e21caf5de6`; Q5-C1 and Q7-lease absent — both PENDING)
<!-- /ANCHOR:related-docs -->
