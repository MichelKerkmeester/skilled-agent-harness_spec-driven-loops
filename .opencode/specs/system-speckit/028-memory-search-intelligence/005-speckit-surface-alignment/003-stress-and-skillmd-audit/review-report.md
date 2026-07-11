---
title: "Review Report: Stress-Test Lane + system-spec-kit SKILL.md/Changelog Alignment Audit"
description: "Adversarial documentation-alignment audit of two under-covered surfaces: the stress-test lane (feature catalog + manual playbook vs the mcp_server/stress_test/** automated harness and the 029-substrate-sandbox-cleanup work) and system-spec-kit's own SKILL.md + changelog vs recent 028 packet work. Read-only audit; no source files modified."
trigger_phrases:
  - "stress test lane audit"
  - "stress-test documentation gap"
  - "SKILL.md changelog alignment"
  - "substrate sandbox cleanup documentation"
  - "mcp_server stress_test coverage gap"
importance_tier: "normal"
contextType: "general"
---

# Review Report: Stress-Test Lane + SKILL.md/Changelog Alignment Audit

<!-- SPECKIT_LEVEL: audit -->

---

## VERDICT

**Split verdict.** The stress-test lane has a real, confirmed, and non-trivial documentation gap: the feature catalog and manual playbook's "stress-testing" surface documents only the manual operator narrative cycle (Hunter-Skeptic-Referee, `findings.md`/`findings-rubric.json`) and is structurally unaware that a second, much larger "stress test" surface exists — the automated `mcp_server/stress_test/**` Vitest harness (6 domains, ~35 files, 5 `npm run stress:*` scripts) — and three of that harness's six domain READMEs (`durability/`, `search-quality/`, `substrate/`) have fallen behind their own directories, including one phantom file reference and one behaviorally stale section. **system-spec-kit's own `SKILL.md` and changelog, by contrast, are confirmed current**: the SKILL.md version matches the latest changelog release exactly, every one of the 43 file paths it cites resolves, and the changelog's v3.7.0.0 release comprehensively narrates the most recent major 028 work (dark-flag graduation, daemon re-election, retention-forgetting, tombstones, envelope-fidelity, and the declined/cut feature list). No changelog or SKILL.md finding rises above informational.

**Confirmed findings: 8. Inferred findings: 0.** (Every finding below was verified by opening the cited source and, where a staleness claim depends on timing, cross-checked against `git log` for both the doc and the code/test file in question.)

---

## SURFACE 1 — STRESS-TEST LANE

### P1 — Structural: the catalog/playbook "stress testing" surface has no awareness of the automated harness

**CONFIRMED.** `.opencode/skills/system-spec-kit/feature_catalog/stress-testing/category-overview.md` and its playbook counterpart `.opencode/skills/system-spec-kit/manual_testing_playbook/stress-testing/` (`README.md`, `run-stress-cycle.md`) document exactly one thing: the manual, operator-run release-readiness cycle (freeze a corpus, score packet x dimension cells 0-2, write `findings.md` + `findings-rubric.json`, Hunter-Skeptic-Referee for regressions). Both documents state this framing explicitly:
- `category-overview.md:21` — "This category documents the manual stress-test surface that operators run... The playbook peer captures the execution flow; this catalog category records the current shape of the surface as a stable inventory entry."
- `manual_testing_playbook/stress-testing/README.md:16` — "Use it when a release... needs a reproducible stress cycle with a frozen corpus, scored cells, narrative findings..."

Neither document, nor the pipeline-architecture catalog peer (`feature_catalog/pipeline-architecture/stress-test-cycle.md`), mentions that `.opencode/skills/system-spec-kit/mcp_server/stress_test/` is a second, independent, code-level meaning of "stress test": a dedicated Vitest suite with six domains (`durability/`, `matrix/`, `memory/`, `search-quality/`, `session/`, `substrate/`), ~35 test files, its own architecture README (`mcp_server/stress_test/README.md`), and five `npm run stress*` scripts (confirmed present in `mcp_server/package.json:34-38`). The only cross-reference in either direction is a single line in `run-stress-cycle.md:38` and `stress-test-cycle.md:44` naming `stress_test/search-quality/corpus.ts` as "the canonical fixture example" — the other five domains (durability, matrix, memory, session, substrate) are never named in the catalog or playbook at all. A reader who searches on the catalog's own trigger phrases ("stress testing", "run stress test cycle") has no path to discovering `npm run stress:durability` or `npm run stress:substrate` exist.

Corroborating evidence that this surface has drifted behind the rest of the docs: the four stress-testing docs carry per-file version tags stuck a full minor version behind the product (`category-overview.md:10` → `3.6.0.5`; `manual_testing_playbook/stress-testing/README.md:6` → `3.6.0.8`; `run-stress-cycle.md:6` → `3.6.0.13`; `stress-test-cycle.md:10` → `3.6.0.11`), while `SKILL.md:5` and the newest changelog file are both `3.7.1.0`.

This is a scope/awareness gap, not a factual contradiction — the manual cycle's documentation is internally accurate about what it covers. But given the audit's mandate to find "missing coverage," this is the headline finding: an entire, large, actively-maintained test surface has zero consolidated documentation entry point from the place operators would naturally look for it.

### P1 — `durability/README.md` omits 4 of 11 real files, despite a dedicated "align stale READMEs" pass after they existed

**CONFIRMED.** `mcp_server/stress_test/durability/README.md` §2 SCOPE (lines 19-27) documents exactly 7 files. The directory actually contains 11 `.vitest.ts` files. Missing from the README:
- `ipc-client-cap-fanout-stress.vitest.ts` — added 2026-06-11 (`2ce26d094f`)
- `shard-repair-persistence-stress.vitest.ts` — added 2026-06-11 (`2ce26d094f`)
- `metadata-edge-promoter-stress.vitest.ts` — added 2026-06-12 (`4913ddf6f9`)
- `release-cleanup-new-surfaces-stress.vitest.ts` — added 2026-06-10 (`c0b67a5089`)

The README's own git history (`git log -- .../durability/README.md`) shows its most recent edit is `019580f298`, dated 2026-06-19, titled **"docs+fix(028): align stale code READMEs + strip pre-existing artifact-ID comments"** — a commit whose explicit purpose was to fix stale READMEs, landing eight days after the last of the four missing files existed. All four files pre-date that alignment pass; none were added by it. This is the strongest finding in the audit: a dedicated stale-doc-remediation commit still left over a third of the domain's real test files undocumented.

### P1 — `search-quality/README.md` cites a file that never existed, and omits 2-3 real ones

**CONFIRMED.** `mcp_server/stress_test/search-quality/README.md` §4 DIRECTORY TREE, line 88, lists `w11-code_graph-calibration-telemetry.vitest.ts`. `git log --all --diff-filter=A -- "*w11-code_graph-calibration-telemetry*"` returns zero results — this file has never existed anywhere in this repository's history. It reads as a planned-but-never-built (or copy-paste) artifact that was never cleaned out of the doc.

The same directory tree (and the rest of the README) never mentions three real files that do exist on disk:
- `w3-trust-tree.vitest.ts` — present since 2026-05-07 (`6647661f32`)
- `w5-shadow-learned-weights.vitest.ts` — present since 2026-05-07 (`6647661f32`)
- `bm25-scope-then-limit-stress.vitest.ts` — added 2026-06-12 (`4913ddf6f9`)

The README's most recent edit is `3e39a34617`, dated 2026-06-07 — a full month after `w3-trust-tree.vitest.ts` and `w5-shadow-learned-weights.vitest.ts` already existed, so those two omissions were live at the time of the doc's last touch (the `bm25-scope-then-limit-stress.vitest.ts` gap post-dates the README's last touch by five days and is the most forgivable of the three). Note also an internal inconsistency independent of code drift: §3 PACKAGE TOPOLOGY (line 59) uses a `w*-*.vitest.ts` wildcard shorthand for "targeted stress waves" while §4 DIRECTORY TREE (lines 74-91) lists them explicitly and incompletely — the two sections of the same file don't agree on how to represent the same file set.

### P2 — `substrate/README.md` is silent on the shipped sandbox-cleanup behavior and omits 2 of 7 files

**CONFIRMED.** `mcp_server/stress_test/substrate/README.md` §4 SCENARIO BOUNDARY (lines 47-49) reads: "The harness still writes TSV evidence to `_sandbox/local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv`. That preserves the 045 operator evidence path while making the same smoke a canonical Vitest gate. The sandbox runner remains in place as the operator-facing evidence tool; keep the two runner copies manually synchronized until an automated mirror exists."

This describes the harness as it existed before `.opencode/specs/system-speckit/028-memory-search-intelligence/001-speckit-memory/029-substrate-sandbox-cleanup` shipped (COMPLETE, 2026-06-23, commit `80aea86f37`, and re-touched `2026-07-04`). That packet added, and I independently confirmed present in the current source (`mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs:13,105,115-116,793-805,887`):
- A `cleanupSandbox({ clean })` helper that **always** removes the throwaway hermetic code-graph DB (`.tmp-cg-db/`) at the end of every run.
- A `--clean` CLI flag (default `false`) that also removes the whole `_sandbox/local-llm-query-intelligence/` run dir and its now-empty parent.
- A vitest `afterAll` in `substrate-runner-harness.vitest.ts` that reaps the sandbox after the suite has read the TSV — meaning `npm run stress:substrate` no longer leaves the `_sandbox` folder behind at all.

None of this is reflected in the README's "SCENARIO BOUNDARY" section, which is the exact section that should describe it. `git log` confirms the README's last touch is `a36dd35034` (2026-06-01) — three weeks before the cleanup feature shipped — so this is a clean pre/post gap, not a misread. Separately, the same README's §2 SCOPE table (lines 17-24) documents 5 of the substrate directory's 7 real files; missing are `idempotency-receipt-race-stress.vitest.ts` and `secret-scrub-save-flood-stress.vitest.ts` (both added 2026-06-11, also after the README's last touch).

### P2 — Top-level `stress_test/README.md`: KEY FILES table omits `durability/`, contradicting its own directory tree and entrypoints table

**CONFIRMED.** `mcp_server/stress_test/README.md` §3 DIRECTORY TREE (lines 58-68) lists `durability/`, and §6 ENTRYPOINTS (lines 126-134) documents `npm run stress:durability` with a full description — but §4 KEY FILES (lines 72-82) has no row for `durability/` at all, jumping from `memory/` straight to `session/`. `git show a3621ebe33 -- mcp_server/stress_test/README.md` (2026-06-19, "docs(028): execute release-cleanup 001 (code READMEs)") shows this commit edited exactly this table — removing two now-stale rows (`skill-advisor/`, `code-graph/`, which had moved out of this tree) — without ever adding the `durability/` row, even though `durability/` had existed in this same file's directory tree since 2026-06-11 (predating this edit by 8 days). Same failure pattern as the `durability/README.md` finding above: an explicit stale-doc cleanup pass touched the right table and still missed the same domain.

### Confirmed current — no finding

`mcp_server/stress_test/memory/README.md` and `mcp_server/stress_test/session/README.md` each document exactly the 3 files that exist in their respective directories (no more, no less); `mcp_server/stress_test/matrix/README.md` documents its single file correctly. `mcp_server/package.json:34-38` confirms every `npm run stress*` script named across all the READMEs above actually exists with the expected target path. These three domains and the script wiring are clean — stated plainly per the audit brief, not flagged as a finding.

---

## SURFACE 2 — SYSTEM-SPEC-KIT SKILL.md + CHANGELOG

### Confirmed current — no material finding

**CONFIRMED.** `SKILL.md:5` declares `version: 3.7.1.0`, which is an exact match for the newest file in `.opencode/skills/system-spec-kit/changelog/` (`v3.7.1.0.md`). `git log` on `SKILL.md` shows edits as recently as 2026-07-05 (`a73c78e655`) and 2026-07-04 (`062f36da4f`, `1e7edb1b00`, `a24517e016`) — same-week maintenance activity.

I extracted every file path `SKILL.md` cites (27 paths in the `RESOURCE_MAP`/`LOADING_LEVELS` router tables plus 17 additional paths named in prose, `references/`, `scripts/`, and `mcp_server/` targets) and verified each resolves to a real file on disk. **All 43 resolved; zero broken references.** This included spot-checking specific, falsifiable claims:
- `SKILL.md:468` cites `references/workflows/spec_folder_authoring_checklist.md` and `spec_folder_write_recipe.md` as relocated from sk-code — matches changelog `v3.7.1.0.md` exactly ("Adopted the spec-folder authoring docs, relocated from sk-code into their proper home").
- `SKILL.md:426` states reranking "was removed in the 014 deprecation... cloud rerankers were removed earlier in 022/013" — independently corroborated by `git log` on an unrelated file (`search-quality/README.md`), which shows commit `74515e11f7`: "chore(014/017): complete LLM-reranker deprecation — remove dead vestiges + align all docs to MMR-only".
- `SKILL.md:416` and `mcp_server/README.md:36,166,242` both independently state the memory MCP surface has 41 tools — internally consistent across two files, and a believable progression from the "37 tools" figure the changelog cites at `v3.5.0.5.md` (dual-stack CLI release), given `memory_embedding_reconcile` is separately described (`SKILL.md:420`) as a genuinely new tool added since then.

The changelog itself is comprehensive and current: `v3.7.0.0.md` ("Honest Verdicts, Earned Flags and a Search That Surfaces") is a long, detailed release narrative that explicitly covers the dark-flag-graduation program (`028/005-dark-flag-graduation`) — naming which four flag families graduated (multi-hop appends, code-graph staleness/degree-cap, advisor RRF fusion spine, deep-loop dedup) and which four were cut (retrieval-class weights, save reconsolidation, seeded PageRank, edge governance vocabulary), plus the declined-work list (the entire semantic-edge-layer family, sleeptime consolidation, agentic recall, procedural-reliability lane) — and separately confirms daemon re-election, retention-forgetting, soft-delete tombstones, and envelope-fidelity are each represented (via `v3.5.0.4.md`/`v3.5.0.5.md`/`v3.6.0.0.md`/`v3.7.0.0.md`). This is a well-maintained surface; I found nothing here that contradicts current code or recent specs.

### Informational — two absences that are appropriate, not gaps

Not counted as findings, included for completeness since the audit brief asked about "recent specs" coverage:
- `.../001-speckit-memory/029-substrate-sandbox-cleanup` (COMPLETE, 2026-06-23) has no changelog entry. Its own spec explicitly scopes it as "test-infrastructure-only" with "no behavior change to the memory or code-graph subsystems" (`029-substrate-sandbox-cleanup/spec.md:87`) — below the bar the changelog otherwise holds itself to (user/operator-facing capability narration), so its absence is consistent with editorial policy, not drift.
- `006-speckit-surface-alignment` (this packet) has no changelog entry yet. It is 2 of 14 phases complete at time of audit; the changelog's own pattern (`v3.5.0.0.md`: "the long-running 026 program documented every one of its roughly 634 phases into one canonical changelog tree before closing itself out") is to narrate a program once it closes, not per-phase. Premature to flag.

---

## CONFIRMED VS INFERRED SUMMARY

| # | Finding | Surface | Severity | Status |
|---|---------|---------|----------|--------|
| 1 | Catalog/playbook "stress testing" has no link to the automated `mcp_server/stress_test/**` harness | Stress lane | P1 | CONFIRMED |
| 2 | `durability/README.md` missing 4/11 files post-dating an explicit stale-README-fix commit | Stress lane | P1 | CONFIRMED |
| 3 | `search-quality/README.md` cites a file that never existed; omits 2-3 real files | Stress lane | P1 | CONFIRMED |
| 4 | `substrate/README.md` silent on shipped sandbox-cleanup behavior (--clean, auto-reap); omits 2/7 files | Stress lane | P2 | CONFIRMED |
| 5 | Top-level `stress_test/README.md` KEY FILES table omits `durability/` row | Stress lane | P2 | CONFIRMED |
| 6 | `memory/`, `session/`, `matrix/` domains + package.json scripts are fully current | Stress lane | — (clean) | CONFIRMED |
| 7 | `SKILL.md` version, all 43 cited paths, and specific factual claims are current | SKILL.md/changelog | — (clean) | CONFIRMED |
| 8 | Changelog v3.7.0.0/v3.7.1.0 comprehensively covers recent 028 work | SKILL.md/changelog | — (clean) | CONFIRMED |

**8 findings, 8 confirmed, 0 inferred.** Every claim above was verified by opening the cited file at the cited line and, for every staleness claim, cross-checked against `git log --diff-filter=A` (for the missing file's creation date) and `git log` (for the doc's last-touch date) to establish that the doc's own edit history had the opportunity to catch the gap and did not.

---

## METHODOLOGY NOTE

This audit is read-only: no file outside this report and its containing folder was modified. Findings were scoped strictly to the two named surfaces (stress-test lane; system-spec-kit `SKILL.md` + changelog) per the audit brief; adjacent surfaces this packet assigns to other phases (`011-code-graph-doc-audit`, the feature-flag catalog table in `004-flag-table-single-source`, the index-freshness sweep in `003-index-freshness-sweep`) were deliberately left untouched to avoid scope overlap.
