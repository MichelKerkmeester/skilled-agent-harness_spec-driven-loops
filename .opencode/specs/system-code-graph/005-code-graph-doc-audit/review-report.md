# Doc-Alignment Audit — system-code-graph vs. 028 Code-Graph Implementation

Review target: `.opencode/skills/system-code-graph/**` (SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, `feature_catalog/**`, `manual_testing_playbook/**`, `references/**`, `changelog/**`) against `.opencode/specs/system-code-graph/001-code-graph-core/**` and the real `mcp_server/` source.
Mode: single-pass adversarial read-only audit (Read/Grep/git-blame/git-log against live source). No fixes applied — read-only on all audited surfaces.

---

## 1. Verdict

**DRIFT FOUND** — the doc suite is *mostly* aligned (two prior remediation passes during 028 already closed several gaps), but two shipped, tested, committed features have **zero** documentation footprint anywhere in the skill (a direct contradiction of two explicit glossary/behavior claims in SKILL.md and README.md), and two internal-architecture references describe directory layouts that do not exist.

**Confirmed findings: 6. Inferred findings: 0.** Every finding below was verified by opening the cited source file(s) directly — none are inferred from doc text alone.

---

## 2. Correction to the audit's own premise

The task brief states the doc suite was "never audited despite 028 code-graph work." That premise is **overstated** — evidence contradicts a blanket "never":

- Commit `fc9f4ae977` (2026-06-24, "docs(028): close the code-graph and advisor coverage gaps") added catalog/playbook coverage for `REVERSE_DEP_FORCE_PARSE`, `EDGE_GOVERNANCE_VOCAB`, `TOMBSTONE_LIMIT`, and a BM25-symbol-resolver playbook scenario. [SOURCE: git commit fc9f4ae977] CONFIRMED — verified the commit's file list and current doc content (`feature_catalog/02--manual-scan-verify-status/code-graph-scan.md:19-21`, `feature_catalog/02--manual-scan-verify-status/code-graph-status.md:25`) both accurately describe these flags today.
- Spec phase `002-code-graph/011-edge-confidence-review-remediation` (completed 2026-07-01, four days before this audit) explicitly built a new `feature_catalog/09--edge-confidence-and-provenance/` group (3 files) plus 2 manual-playbook scenarios (028, 029) for edge-confidence-differentiation and seeded-PPR. [SOURCE: `.opencode/specs/system-code-graph/001-code-graph-core/011-edge-confidence-review-remediation/implementation-summary.md:68-70`] CONFIRMED — verified `feature_catalog/feature_catalog.md:298-344` and the three files under `feature_catalog/09--edge-confidence-and-provenance/` exist and accurately cite real source lines.

So the accurate framing is **partially audited, with specific confirmed gaps** — those gaps are findings F1 and F2 below, both of which predate and were missed by both remediation passes above.

---

## 3. Findings, ranked by severity

### F1 — HIGH — Doc-symbol lane: SKILL.md and README.md assert a behavior the shipped code no longer has

**CONFIRMED.** `SKILL.md`'s Glossary states: *"The current parser returns clean doc rows with zero symbol nodes and zero relationship edges, so doc file counts are not structural extraction coverage."* [SOURCE: `.opencode/skills/system-code-graph/SKILL.md:23`] `README.md` repeats it: *"symbol nodes and relationship edges stay empty (`node_count: 0`, `edge_count: 0`)"* [SOURCE: `.opencode/skills/system-code-graph/README.md:99`]. `ARCHITECTURE.md` does not repeat the claim but also does not correct it.

This is false as of commit `b18c077311` (2026-06-19, "feat(028): build wave-2 phases (doc-symbol lane, enrichment lag gauge)"), which shipped phase `002-code-graph/008-doc-symbol-lane` (status: complete, 100%). Verified directly in the live source:
- `parseFile()` branches on `language === 'doc'` and calls `extractDocSymbols(...)`, returning `docSymbols.nodes` / `docSymbols.edges` — not empty arrays. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1259-1272`]
- `extractDocSymbols` is a real, unconditional (no feature flag), 500+ line implementation producing `key` nodes for JSON/JSONC/YAML/YML/TOML files and `heading` nodes for Markdown (nested by level via `CONTAINS` edges). [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/doc-symbol-extractor.ts:1-50,528`]
- `SymbolKind` was extended to admit `'heading' | 'key'`. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:13-17`]
- Real tests exist and pass: `mcp_server/tests/doc-symbol-extractor.vitest.ts`.

Coverage sweep: an exhaustive grep across every `.md` file in the skill found doc-symbol-lane language in exactly **one** file — `mcp_server/lib/README.md` (which correctly lists `doc-symbol-extractor.ts` in its topology table). Zero mentions in `SKILL.md`, `README.md`, `ARCHITECTURE.md`, `INSTALL_GUIDE.md`, any `feature_catalog/**` file, any `manual_testing_playbook/**` file, `references/**`, or `changelog/**`. The skill's own changelog (`changelog/v1.2.0.0.md`, `v1.3.0.0.md`) — which lands squarely in this window — never mentions it either.

**Impact:** an agent reading SKILL.md's glossary today is told the doc lane is inventory-only and will not think to query `key`/`heading` nodes it can now actually retrieve, and will misjudge `code_graph_status`/`code_graph_query` output against a stale mental model.

### F2 — HIGH — Parser transient/fatal self-heal retry: zero documentation anywhere

**CONFIRMED.** Phase `002-code-graph/007-parser-resilience` (status: complete) shipped a transient/fatal retry axis on top of the existing B1/B2/OTHER crash-cohort classification: a `TRANSIENT` failure (WASM OOM, timeout, deadline-abort) stays eligible and self-heals on a later clean parse; it is promoted to permanent `FATAL` quarantine only after a durable `attempt_count` reaches `max_retries` (default 5, `SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES`). Committed 2026-06-19 via `fd30af2cb6` ("feat(028): build 4 phases... parser-resilience...").

Verified directly in the live source: `retryClass`/`retry_class` fields, `resolveMaxRetries`, transient→fatal promotion, and the lifted `recordSuccess` self-heal path all exist and are exercised by `mcp_server/tests/parser-skip-list.vitest.ts:236-364`. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:14,84-206`]

Current `README.md` describes parser failures only as: *"Parser crash cohorts classified as B1/B2 land in a quarantine skip-list"* [SOURCE: `.opencode/skills/system-code-graph/README.md:97`] — which reads as a permanent, one-shot classification and omits that most such failures now retry and self-heal before ever reaching permanent quarantine.

Coverage sweep: an exhaustive grep for `transient`, `retry_class`/`retryClass`, `max_retries`, `recordSuccess` across every `.md` file in the skill returned **zero hits**, including `mcp_server/lib/README.md` (which describes `parser-skip-list.ts` only as generic "Parser-failure quarantine storage," not disclosing the retry axis). The env var `SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES` has no row in `system-spec-kit/mcp_server/ENV_REFERENCE.md` even though the sibling flag `SPECKIT_PARSER_SKIP_LIST_ENABLED` does. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:239`]

Corroborating structural evidence: `feature_catalog/` and `manual_testing_playbook/` both number their groups `01, 02, 03, 04, 05, 06, 08, 09` — group `07` is absent from both trees. [SOURCE: directory listing, both trees] This is consistent with `007-parser-resilience`'s deliverable never having been folded into either catalog.

**Impact:** an operator debugging a `parserSkipList` entry has no doc pointing them at the self-heal behavior, the retry ceiling, or the override env var — they would reasonably conclude (from README's wording) that any skip-list entry is permanent and requires manual review, when most WASM crash causes actually clear on their own.

### F3 — MEDIUM — `references/runtime/tool_surface.md` handler-mapping table cites non-existent directories

**CONFIRMED.** The "Schema and Handler Mapping" table maps every tool's handler to a `lib/<name>/` subdirectory: `lib/scan/`, `lib/query/` + `lib/blast-radius/`, `lib/context/`, `lib/status/`, `lib/verify/`, `lib/apply/`, `lib/detect-changes/`. [SOURCE: `.opencode/skills/system-code-graph/references/runtime/tool_surface.md:76-83`]

None of these directories exist. `mcp_server/lib/` contains only four subdirectories: `graph/`, `ipc/`, `shared/`, `utils/` — everything else is a flat `.ts` file. [SOURCE: `find .opencode/skills/system-code-graph/mcp_server/lib -maxdepth 1`, confirmed] The real dispatch path is `tools/code-graph-tools.ts` → `handlers/<name>.ts` (a real, flat-file directory: `scan.ts`, `query.ts`, `context.ts`, `status.ts`, `verify.ts`, `apply.ts`, `detect-changes.ts`) → assorted flat `lib/*.ts` files — and the table omits the `handlers/` layer entirely. [SOURCE: `.opencode/skills/system-code-graph/mcp_server/handlers/README.md:55-65`, which correctly documents this real, flat topology]

**Impact:** low runtime risk (this is an internal-topology reference, not a behavior claim), but anyone using this table to navigate the codebase will search for directories that don't exist.

### F4 — MEDIUM — ARCHITECTURE.md's own diagram contradicts its own topology tree (phantom `parser/` directory)

**CONFIRMED.** The §1 ASCII architecture diagram shows a standalone `parser/` box ("tree-sitter WASM grammars") as a peer of `handlers/` and `lib/` [SOURCE: `.opencode/skills/system-code-graph/ARCHITECTURE.md:54`], and the dependency-direction line inside that same diagram states `lib/ ──▶ parser/` [SOURCE: `.opencode/skills/system-code-graph/ARCHITECTURE.md:71`] — repeated again, near-verbatim, in §2's "Allowed dependency direction" bullet list [SOURCE: `.opencode/skills/system-code-graph/ARCHITECTURE.md:103-108`].

No `mcp_server/parser/` directory exists. [SOURCE: `find .opencode/skills/system-code-graph/mcp_server -maxdepth 1 -type d`, confirmed: only `core, data, database, dist, handlers, lib, plugin_bridges, scripts, stress_test, tests, tools, vitest-tmp`] Tree-sitter parsing lives in the flat file `mcp_server/lib/tree-sitter-parser.ts`. ARCHITECTURE.md's **own** §2 "Package Topology" tree gets this right three paragraphs later: `lib/ # Parser, readiness, apply-mode, query + context` (no separate `parser/` entry). [SOURCE: `.opencode/skills/system-code-graph/ARCHITECTURE.md:89`] The two sections of the same document disagree with each other, and the diagram/dependency-rule side is the stale one. No ESLint config exists anywhere under the skill to enforce the claimed "reverse imports are blocked by lint" boundary rule — that enforcement claim is unverified (not disproven, just not locatable).

**Impact:** same as F3 — a navigation/mental-model hazard, not a behavior-correctness one.

### F5 — LOW — INSTALL_GUIDE.md's "Skill version" field is two version-bumps stale

**CONFIRMED.** `INSTALL_GUIDE.md` §1 states `| Skill version | \`1.0.3.2\` |`. [SOURCE: `.opencode/skills/system-code-graph/INSTALL_GUIDE.md:59`] The actual current `SKILL.md` frontmatter version is `1.3.0.0`. [SOURCE: `.opencode/skills/system-code-graph/SKILL.md:5`]

`git blame` shows this INSTALL_GUIDE.md line was last touched by commit `4f1dc0edef` (2026-05-29), when SKILL.md's version was in fact `1.0.3.2`. Two subsequent SKILL.md version bumps were never mirrored back into this line: `bbb2f539f4` (2026-06-23) bumped SKILL.md to `1.2.0.0`, and `fc9f4ae977` (2026-06-24) bumped it again to `1.3.0.0`. Per-file independent versioning is the documented design here (spec `154-frontmatter-versioning`: each doc's `version:` frontmatter tracks its own edit history, not a single shared skill version) — so README.md's independently-different `1.2.0.26` is *not* itself a defect. But INSTALL_GUIDE.md's body table isn't claiming its own file's version; it explicitly labels itself "Skill version," i.e., a cross-reference to SKILL.md's frontmatter, and that specific cross-reference is stale. Ruled out `package.json`'s `"version": "1.0.0"` as an alternate intended source — it matches none of the three numbers in play and appears to be an unrelated, unbumped npm-package stub.

**Impact:** cosmetic; does not affect tool behavior or MCP registration.

### F6 — LOW — feature_catalog.md's per-operation cataloging claim is imprecise

**CONFIRMED.** The catalog's "Feature-to-tool granularity (F013/F014)" note illustrates the 17-features-to-8-tools ratio with: *"`code_graph_query` provides multiple query operations (`outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, `blast_radius`), each catalogued as its own feature."* [SOURCE: `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md:25`]

In reality none of these six operations has its own catalog entry — all six are described together under the single "Query self-heal" feature (`feature_catalog/01--read-path-freshness/query-self-heal.md`). [SOURCE: verified via grep, zero individual catalog sections for `outline`/`calls_from`/`calls_to`/`imports_from`/`imports_to`/`blast_radius` as feature headings anywhere in `feature_catalog/`] The surrounding math (18 total features, 8 groups, "17 map to 8 tools" excluding the CLI-fallback entry) is internally self-consistent and accurate — only this one illustrative sentence overstates per-operation granularity that doesn't exist for this specific tool.

**Impact:** negligible; a documentation-precision nit inside an aside, not a load-bearing claim.

---

## 4. What is genuinely current (no finding)

To be adversarial in both directions: the following areas were checked and found accurate, and are called out so they are not mistaken for additional gaps —

- **Edge confidence differentiation, edge evidence classification, seeded-PPR impact ranking** (specs 005, 010, 011): fully and accurately cataloged in `feature_catalog/09--edge-confidence-and-provenance/` (3 files) and cross-referenced from `query-self-heal.md`, `code-graph-context.md`, and `code-graph-scan.md`; 2 manual-playbook scenarios (028, 029) exist and are cross-linked correctly.
- **Bitemporal edge writer / as-of reads / degree-capped reverse-dependency force-parse / edge-governance-vocab / tombstone retention** (specs 002, 003, 004, 006): all accurately and specifically documented in `feature_catalog/02--manual-scan-verify-status/code-graph-scan.md` and `code-graph-status.md`, and the bitemporal `asOf` read surface is documented in `query-self-heal.md` plus a dedicated playbook scenario (`manual_testing_playbook/06--mcp-tool-surface/code-graph-query-asof-time-travel.md`).
- **Tool count (8) and tool names**: consistent across `SKILL.md`, `README.md`, `INSTALL_GUIDE.md`, `ARCHITECTURE.md`, `feature_catalog.md`, and the real `tool-schemas.ts` (`code_graph_scan/query/status/context/classify_query_intent/verify/apply`, `detect_changes` — exactly 8, confirmed by direct grep).
- **`mcp_server/lib/README.md` and `mcp_server/handlers/README.md`**: both are detailed, current, and correctly reflect the real flat-file topology (including listing `doc-symbol-extractor.ts`) — the drift in F1/F3/F4 is specifically a top-level-doc / reference-doc problem, not a package-README problem.
- **Manual-playbook scenario count**: the playbook's own "26 scenarios across 8 groups" claim matches both the actual file count (26) and the table row count (26) exactly, despite scenario IDs running non-contiguously from 001–029 (retired IDs along the way) — not a drift, just non-sequential numbering.

---

## 5. Evidence ledger

| # | Finding | Severity | Confirmed / Inferred |
|---|---------|----------|----------------------|
| F1 | Doc-symbol lane undocumented + SKILL.md/README.md false "zero nodes/edges" claim | HIGH | Confirmed |
| F2 | Parser transient/fatal self-heal retry undocumented anywhere | HIGH | Confirmed |
| F3 | `tool_surface.md` handler-mapping table cites non-existent `lib/<tool>/` directories | MEDIUM | Confirmed |
| F4 | ARCHITECTURE.md phantom `parser/` directory, self-contradicts own topology tree | MEDIUM | Confirmed |
| F5 | INSTALL_GUIDE.md "Skill version" stale by two bumps (1.0.3.2 vs actual 1.3.0.0) | LOW | Confirmed |
| F6 | feature_catalog.md per-operation cataloging claim overstated for `code_graph_query` | LOW | Confirmed |

**6 confirmed, 0 inferred.** All six were verified by opening the cited implementation/doc files directly (Read/Grep/git-blame/git-log), not inferred from documentation text alone.
