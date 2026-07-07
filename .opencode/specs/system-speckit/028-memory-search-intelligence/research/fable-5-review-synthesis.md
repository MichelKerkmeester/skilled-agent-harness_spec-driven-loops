# Fable-5 Independent Review + Synthesis of the 20-Iteration Alignment Audit

> Independent, adversarial review of `research.md` (executive synthesis + 20-iteration evidence log) and its per-iteration files. Every load-bearing claim below was re-verified against the live tree on 2026-07-05. Scope: review only — no audited file was modified.

---

## 1. VERDICT

**The audit is trustworthy at the citation level and mildly inflated at the executive level.** Every one of the 19 findings I spot-checked resolved to an accurate `[SOURCE: file:line]` — including all five `[INFERENCE]`-labeled absence claims, which I reproduced independently with fresh greps (all returned zero hits, as claimed). The per-iteration leaf files are careful, hedge appropriately, and the orchestrator's log compression is faithful. The problems are concentrated in the orchestrator-written executive layer: one of the three "fix-first" items bundles a documented historical record as live drift, the "cross-cutting code issue" label misclassifies a workflow-YAML contract gap, and the "every iteration surfaced fully-novel misalignments" claim rests on a convergence metric that demonstrably did no work (see §6).

Spot-check tally: **16 findings CONFIRMED** (several understated), **3 FLAGGED** (framing/staleness issues, detailed in §3), **0 fabricated or misread citations.**

---

## 2. SPOT-CHECK RESULTS

### 2.1 The three "fix-first" items

**FF-1. Retention-forgetting flag-name drift — CONFIRMED, and sharper than stated.**
`feature-flags.md:23` (the packet's flagship "five survivors" table) names `SPECKIT_RETENTION_FORGETTING_V1`; live code reads `SPECKIT_RETENTION_FORGETTING` (`mcp_server/lib/search/search-flags.ts`, plus 5 test files), and ENV_REFERENCE documents the unsuffixed name (`ENV_REFERENCE.md:132`). Sharpening: ENV_REFERENCE's deprecated-alias table (`ENV_REFERENCE.md:601-605`) lists exactly five `_V1 → unsuffixed` graduation renames (lexical-grounding, noise-floor, cite-with-caveat, evidence-gap, envelope-fidelity) — **retention-forgetting is not among them**. The packet doc appears to have pattern-matched the `_V1` graduation convention onto a flag that never carried the suffix (or the alias table is missing a row; either way one line is wrong). Failure mode: §2 of feature-flags.md tells users they can force any survivor off via `SPECKIT_<FLAG>=false`; setting `SPECKIT_RETENTION_FORGETTING_V1=false` is a silent no-op and the retention guardrail stays on.

**FF-2. Benchmark index stale + benchmark-status self-contradiction — CONFIRMED; the README half is understated.**
- The active table at `mcp_server/benchmarks/README.md:42-46` holds **2 rows** under its own rule "One row per dated folder" — while the folder contains **8 dated subfolders**. Six are unindexed, not one: `benchmark-2026-05-20-rerank-ab`, `-rerun`, `2026-05-21-cap-top-k`, `-fp16-rerank`, `-rerank-ab-msmarco`, and `-spec-memory-mps` (whose frontmatter records `Verdict: HOLD` — a decision-bearing result invisible from the index).
- `benchmark-status.md:112-116` states the Track-C program "(003-spec-data-quality, 28 phases) is research-only … no code has landed, so NOTHING in the program is measured yet," while `benchmark-status.md:233-243` records that "The 003-spec-data-quality build landed thirteen real switches … Final verdict tally: twelve of thirteen kept, one deleted." The literal contradiction is confirmed. Nuance: the later section knowingly references the earlier one ("unlike the still-PROPOSED Track-C slate above") and the sibling doc `feature-flags.md` §7 does the supersession properly ("Section 6 listed the Track C slate as indicative names with no code behind them. That has changed…"). So the defect is precisely: **the stale §Track-C block lacks a forward supersession pointer**, and its parenthetical "(003-spec-data-quality, 28 phases)" over-scopes the "no code" claim to the whole lineage. A reader who stops at line 116 is misled about a DoD-evidence document.
- The "missing 028 corrected criterion-4 row" half is a **judgment call, not a rule violation**: the README's own boundary rule says spec-packet evidence lives packet-side "until they ship" and promotion is a curation act. The intra-folder staleness is the indefensible part.

**FF-3. Envelope-fidelity default/name drift — SPLIT: half confirmed, half overstated.**
- CONFIRMED: the stale comment at `formatters/search-results.ts:1350-1352` ("gated dark … Off by default") contradicts the live default — `search-flags.ts:700-703` implements default-ON with `SPECKIT_ENVELOPE_FIDELITY=false` as opt-out, matching `/memory:search` (`commands/memory/search.md:78`).
- OVERSTATED: treating the phase-027 summary's "default-OFF `SPECKIT_ENVELOPE_FIDELITY_V1`" (`027-envelope-fidelity-enforcement/implementation-summary.md:57`) as drift. That is an accurate historical record of what shipped at the time; the V1→unsuffixed rename is a *documented deliberate graduation* (`ENV_REFERENCE.md:605` deprecation row). The leaf iteration was careful ("Historical/current drift remains", iter 4 #1); the exec layer dropped the hedge. The actionable fix is the one-line code comment (and optionally a "superseded at graduation" pointer in the phase doc) — not a rewrite of a phase record.

### 2.2 The `[INFERENCE]`-labeled findings (all independently reproduced)

| # | Claim | My re-verification | Verdict |
|---|---|---|---|
| I-1 | Data-quality flags have ENV_REFERENCE section but no feature-catalog entries (iter 2 #3) | Fresh grep for 6 env vars (`SPECKIT_GENERATOR_HARDENING`, `_IDENTITY_MERGE_SAFETY`, `_GENERATED_METADATA_Z_EXCLUSION`, `_IDEMPOTENT_DESCRIPTION_WRITES`, `_STATUS_COMPLETION_CONSISTENCY_GATE`, `_GENERATED_METADATA_GRANDFATHER`) across `feature_catalog/` → **0 files** | CONFIRMED |
| I-2 | No manual-playbook scenario for under-surfacing/display-floor (iter 7 #4) | Grep for `under-surfacing|display floor|display-floor` across `manual_testing_playbook/` → **0 files**; the code-side regression suite exists (`tests/token-budget-constitutional-sync.vitest.ts:250`, `describe('T207: display floor + compact overflow')`) | CONFIRMED |
| I-3 | No dedicated rescue-authority catalog entry (iter 8 #5) | Grep for `RETRIEVAL_RESCUE_MODE|rescue authority|retrieval rescue` across `feature_catalog/` → **0 files** | CONFIRMED |
| I-4 | Delta-path naming misalignment (iter 10 #5) | `deep_research_auto.yaml:117` declares `delta_pattern: "{artifact_dir}/deltas/iter-{NNN}.jsonl"` (and `:1052` references `deltas/iter-NNN.jsonl`); this packet's actual runner wrote `deltas/iteration-001.jsonl`… (cited yaml lines 111/1039 drifted slightly to 117/1052 — substance intact) | CONFIRMED |
| I-5 | Placeholder row passes `validate_document.py` as valid readme (iter 17 #2) | Detector at `validate_document.py:119-155` has no feature-catalog type; catalog leaves fall through to `'readme'`. The row `\| — \| Automated test \| — \|` exists verbatim at `feature_catalog/15--retrieval-enhancements/dual-level-retrieval.md:43` | CONFIRMED — and note this "[INFERENCE]" was actually an *executed command with observed output*, the strongest evidence class in the log. The label semantics are inconsistent (see §6) |

### 2.3 Other high-severity spot checks

| Finding | Verification | Verdict |
|---|---|---|
| Playbook root index stale (iter 7 #1) | `manual_testing_playbook.md:194`: "file count is 411 … Scenarios 450-453 are the current high-water entries" — table holds rows **454** and **455** (`:3879-3881`); live file count is **417** | CONFIRMED (three facets stale: count, high-water, date stamp) |
| MODULE_MAP category count (iter 1 #4) | `lib/MODULE_MAP.md:381` says "the 19 top-level directories"; catalog numbering runs to `24--local-llm-query-intelligence` (playbook too) | CONFIRMED — **plus a missed anomaly**: the catalog has a duplicate prefix, `14--pipeline-architecture` AND `14--stress-testing` coexist (25 dirs, max number 24). The audit never noticed |
| Soft-delete catalog contradiction (iter 8 #3) | Catalog (`02--mutation/soft-delete-tombstones…md:18-20`): feature works "without making recall surfaces filter tombstoned rows by default" vs phase-002 summary (`…/002-…/implementation-summary.md:67`): "Soft-delete now excludes `deleted_at` rows across search, list, triggers, stats, and dedup reads" | CONFIRMED — flat contradiction on a reader-facing *current-behavior* claim about data visibility. Arguably belongs in the fix-first tier |
| Schema-version catalog stale (iter 8 #2) | v28 row (`schema-version-history-v28-v30.md:31`) describes the original `NOT IN ('constitutional','deprecated')` predicate; phase-002 verified the rebuilt index also excludes `archived` (`implementation-summary.md:105`) | CONFIRMED IN EFFECT, refined: the v28 row is defensible as versioned history; the true defects are (a) the timeline **stops at v37 with no row for the archived-tier rebuild migration**, and (b) the file is titled/named "v28-v30" while containing v28–v37 |
| Catalog flag table missing survivors (iter 2 #1) | Grep for all five survivor flags in `feature_catalog/19--feature-flag-reference/1-search-pipeline-features-speckit.md` → 0 hits | CONFIRMED |
| `CURRENT REALITY` vs `HOW IT WORKS` (iter 16 #5) | `create_feature_catalog_auto.yaml:163-166` requires `CURRENT REALITY` per feature file; the template's section 2 is `HOW IT WORKS` (`feature_catalog_snippet_template.md:87`) | CONFIRMED — the scaffolder's quality standard names a section the template no longer emits |
| Template test-type taxonomy (iter 16 #2) | `feature_catalog_snippet_template.md:118` defines only `{Automated test\|Manual playbook}` | CONFIRMED (undefined `Integration` labels in deep-loop-runtime catalogs are off-taxonomy) |
| `skill_docs` raw-field boundary (iters 19 #5, 20 #2) | `skill-graph-db.ts:766-780` prepares the upsert; the run site (`:811-821`) binds `parsed.title`, `parsed.description`, `JSON.stringify(parsed.triggerPhrases)` **raw** — in the same file, sibling node metadata IS sanitized (`sanitizeMetadataStringArray`/`sanitizeDerivedMetadata`, `:973-975`) | CONFIRMED — see §3 F-4: this is the one finding family where the underlying fact is a *code* asymmetry, arguably underweighted by the docs-framing |
| Deep-loop startup `memory_context` gap (iters 10 #4, 11 #1) | `deep_research_auto.yaml:58-61` and `deep_review_auto.yaml:51-54` define only `if_context_found` / `if_no_context`; no error/timeout branch at startup | CONFIRMED as a workflow-YAML contract gap — but see §3 F-2 on the exec's "code issue" label |
| Integration README wording (iter 13 #4) | `tests/integration/README.md:3,11` frames the suite as spawning `.cjs` entry points "end to end"; the table (`:25` region) lists `review-depth-convergence.vitest.ts`, which iter 12 #4 showed is YAML-string assertion | CONFIRMED (mild — the frontmatter does hedge review-depth as "fixture tests") |
| Governance playbook records 17 missing flags (iter 3 #1) | `17--governance/feature-flag-governance.md:50-62` does record "Source SPECKIT_* tokens missing from table: 17" | CONFIRMED the playbook says it — **but the recorded evidence is itself a stale snapshot**: the target (ENV_REFERENCE's flag reference table) *now contains* the listed flags (e.g. temporal edges `ENV_REFERENCE.md:103`, retention forgetting `:132`, absolute-relevance/confidence-calibration rows nearby). See §3 F-3 |

---

## 3. FLAGGED ITEMS (exec-layer overstatements / mislabels)

**F-1. Fix-first #3 partially misframes a documented graduation as drift.** Detailed under FF-3. The genuinely actionable residue is one stale code comment. Phase summaries are historical records; five flags went through the same documented `_V1` rename (`ENV_REFERENCE.md:601-605`) and their phase docs would all "drift" by this standard.

**F-2. Pattern E ("a cross-cutting code issue (not just docs)") is mislabeled.** The startup `memory_context` gap lives in command workflow YAML (prompt assets consumed by the orchestrating model), not code; it is an *unspecified branch* (model improvises on MCP error/timeout), not a demonstrated failure; and the same YAMLs already handle per-iteration MCP errors non-fatally (iter 10 #4). Real, worth a one-line `on_error` branch per asset — but it is the log's only support for "not just docs," and it doesn't carry that weight. The closest true code-side findings are the stale formatter comment (a comment) and F-4 below.

**F-3. Iter 3 #1's evidence has expired between recording and now.** The governance scenario 063's recorded transcript (17 missing flags) targets the ENV_REFERENCE flag table, which is current today. The *live* gap is in the `feature_catalog/19--…` table (confirmed independently). Consequence: the playbook's recorded evidence block itself now needs a re-run/re-record — an instance of the very drift pattern under audit, and a to-do the audit did not surface.

**F-4. The `skill_docs` raw-field finding is framed one level too softly.** The audit treats it as "caveat visible only in changelog" (doc problem). The verified underlying fact is a code asymmetry: harvested frontmatter `title`/`description`/`trigger_phrases` are stored raw (`skill-graph-db.ts:811-821`) while sibling metadata in the same file is sanitized (`:973-975`). Mitigation is real (public `matchedDocs` path sanitization is actively tested, `skill-doc-harvest.vitest.ts:246`), so severity stays moderate — but the fix decision is *sanitize-at-write vs document-the-boundary*, i.e. potentially a code change, and the punch list should say so.

---

## 4. EXECUTIVE THESIS ASSESSMENT

> "Code/runtime is largely current; drift concentrates in docs/catalogs and the validation tooling meant to catch it."

**Directionally supported, with two calibrations.**

*Supported:* Every misalignment that survived my checks is in a doc, catalog, index, template, YAML asset, or code comment. The audit positively verified ~10 runtime/test surfaces as current (formatters build the envelope contract, eval driver encodes the corrected benchmark narrative, council status/convergence implement the three-state contract with active tests, review-depth validator enforces evidence quality, resume/save command ladders, doc-harvest public-path sanitization). No spot check surfaced hidden code drift the audit missed.

*Calibration 1 — the "code is largely current" half is sampled, not swept.* Every iteration ran with the code graph stale/unavailable (recorded in the Edge Cases of multiple iteration files, e.g. iteration-006.md, iteration-017.md); code was inspected where docs pointed at it. That is legitimate for a doc-alignment audit, but the exec sentence generalizes further than the method reaches.

*Calibration 2 — "validation tooling has holes" conflates two distinct failure modes,* and the distinction changes the fix:
1. **No detector exists** — `validate_document.py` has no feature-catalog type (`:119-155`); nothing checks table `Type` taxonomy or placeholder rows; the link checker is out of scope by design (`check-markdown-links.cjs`). Fix = build the check.
2. **Detector exists, fired, and nobody closed the loop** — governance scenario 063 caught and *recorded* the flag-table drift as a failure; iteration 17 itself recorded the audit's own config/strategy iteration-cap contradiction "for reducer/operator follow-up." Fix = a process that routes recorded failures to remediation, not more detectors.

*Counter-evidence check:* none found that overturns the thesis. The only candidates for "code issues" are the F-4 sanitizer asymmetry (moderate, mitigated) and the F-2 YAML gap (not code). The "What IS aligned" credit list in the exec layer checks out where I touched it.

---

## 5. DUPLICATES AND WEAK FINDINGS

### 5.1 Duplicates (same issue, multiple iterations)

| Cluster | Iterations | Note |
|---|---|---|
| Retention flag-name drift | 1 #3 ≡ 2 #4 | Verbatim restatement |
| Benchmark README staleness | 1 #2 → 6 #1/#2 | 6 legitimately adds detail; 1 #2 is the same finding |
| `review-depth-convergence.vitest.ts` is string-assertion | 12 #4 ≡ 13 #3 | Near-verbatim |
| Council-graph tests cover three branches (positive) | 12 #3 ≡ 14 #3 | Verbatim, both alignment-credits |
| Startup `memory_context` gap | 10 #4, 11 #1, 11 #4 | One issue × three YAML assets — legitimately one finding with three anchors |
| `skill_docs` raw fields | 19 #5 ≡ 20 #2 (+20 #4 restates) | Same boundary, different doc surface |
| Envelope-fidelity facets | 4 #2 + 5 #2 | Two facets of one item (merged in exec fix-first #3) |
| Placeholder `Automated test` rows | 15 #3 → 17 #2 | 17 adds validator pass-through — genuinely additive |
| AI-council "Automated test" mislabels | 14 #5 ≡ 15 #1 | Same catalog rows |

Net: the log's ~93 findings compress to roughly **25-30 alignment-credits**, **~10 duplicates**, and **~18 distinct real misalignments** (punch list, §7).

### 5.2 Weak findings (thin / interpretive / not really misalignment)

- **Iter 3 #3** (release-hardening index "does not directly name" five flags): naming-absence only; scenarios 439-448 are flag-reference entries whose file contents were not checked for coverage under other names.
- **Iter 4 #4 / 5 #4** (dashboard presentation lacks diagnostic slots; reporting-dashboard narrower than ablation output): the runtime *does* render the diagnostics (iter 5 #3 confirms); these are template-minimalism/design observations, not drift.
- **Iter 14 #5** ("Automated test" label vs "thin wrapper around buildScenarioFixture"): the DAC fixtures ARE executed by a real vitest suite (iter 14 #4 says so); a thin wrapper around a centralized fixture is still an automated test. The legitimate residue is 15 #1's narrower point (catalog rows pointing at *manual playbook scenario files* typed as "Automated test").
- **Iter 19 #2** (`template_mapping.md` "under-describing" metadata refresh): soft wording-emphasis gap.
- **Iter 18 #4** (sk-doc README "broader than the validator supports"): interpretive; the README's pipeline claim is about the DQI/extract flow, and the FAQ does scope `validate_document.py` to READMEs. Real but mild, and partly duplicative of the harder 17 #1.

---

## 6. AUDIT-PROCESS OBSERVATIONS (loop instrumentation)

1. **`newInfoRatio` did no discriminative work.** All 20 state entries record exactly `"newInfoRatio":1` — including iterations that verbatim-repeated earlier findings (§5.1). The exec claims "Every one of the 20 iterations surfaced fully-novel, cited misalignments — the corpus is broad, not exhausted." The breadth conclusion is plausible from the raw content, but the metric cited as evidence is provably insensitive here, and several iterations (4, 9, 10, 12, 14, 19, 20) were majority *alignment-credits*, not misalignments. The claim should read: "the log kept producing usable material; the convergence metric never engaged."
2. **`[INFERENCE]` label semantics are inconsistent.** Some tags mark genuine unverified inference (grep-absence), others mark *executed commands with observed output* (iter 17 #2 — empirically the strongest evidence in the log). A reader triaging by label will misprice findings in both directions. (All five inference-tagged items happened to verify, so no harm done this run.)
3. **The audit self-demonstrated its subject.** Iteration 17 opens by recording that the dispatch said "run 17/40," state/strategy still recorded a 40-cap, and `deep-research-config.json` said `maxIterations: 20` — a live control-file contradiction inside the audit's own machinery, logged "for reducer/operator follow-up" and, per pattern-2 in §4, not yet closed. Also the loop's own deltas violated the YAML's declared `delta_pattern` naming (I-4).

---

## 7. CONSOLIDATED PUNCH LIST

De-duplicated, ranked by severity × cheapness-to-fix, one strongest citation each. Groups: **A** = wrong-fact docs (say something false *now*), **B** = stale indexes/counters, **C** = tooling/template contract, **D** = coverage gaps, **E** = decision items (not straight fixes).

| # | Grp | Fix | Strongest citation | Cost |
|---|---|---|---|---|
| 1 | A | `feature-flags.md` survivors table: `SPECKIT_RETENTION_FORGETTING_V1` → `SPECKIT_RETENTION_FORGETTING`; sweep remaining `_V1` mentions in *living* docs (phase summaries exempt as history) | `feature-flags.md:23` vs `ENV_REFERENCE.md:601-605` (no such alias) | 1 line |
| 2 | A | `benchmark-status.md` Track-C section: add supersession pointer to the phase-040 section and scope the "(005…, 28 phases) … no code has landed" parenthetical to the un-built proposal slate | `benchmark-status.md:112-116` vs `:233-243` | ~3 lines |
| 3 | A | Soft-delete catalog: replace "without making recall surfaces filter tombstoned rows by default" with the post-031/002 shared-predicate behavior | `feature_catalog/02--mutation/soft-delete-tombstones….md:20` vs `031/002 implementation-summary.md:67` | ~2 lines |
| 4 | A | Fix stale comment "gated dark … Off by default" above the envelope fragment | `formatters/search-results.ts:1350-1352` vs `search-flags.ts:700-703` | 1 line |
| 5 | B | Benchmarks README active table: add the 6 missing dated-folder rows (May-21 MPS HOLD first — it carries a decision) | `benchmarks/README.md:42` vs 8 folders on disk | ~20 min |
| 6 | B | Catalog flag-reference table: add the 5 survivors, 3 built-but-held, and 13 data-quality flags — or demote the table to a pointer at ENV_REFERENCE as the single source of truth (recommended; kills the class). Then re-run and re-record governance scenario 063, whose captured evidence is stale (§3 F-3) | `feature_catalog/19--feature-flag-reference/1-search-pipeline-features-speckit.md:31` (0/5 survivors) | ~1 h |
| 7 | B | Playbook root index: refresh count (411 → 417 live), high-water (450-453 → 455), date stamp | `manual_testing_playbook.md:194` vs table rows 454-455 (`:3879-3881`) | ~10 min |
| 8 | B | `MODULE_MAP.md` "19 categories" → current; resolve or document the duplicate `14--` prefix (`14--pipeline-architecture` + `14--stress-testing`) | `lib/MODULE_MAP.md:381` | ~10 min |
| 9 | C | `create_feature_catalog_auto.yaml`: `CURRENT REALITY` → `HOW IT WORKS` in `feature_file_requirements` (scaffolder validates a section the template doesn't emit) | `create_feature_catalog_auto.yaml:163-166` vs `feature_catalog_snippet_template.md:87` | 1 line |
| 10 | C | `validate_document.py`: add a `feature_catalog` doc type (path detector + rules) with a Validation-table check — allowed `Type` values per template taxonomy, no `— / Automated test / —` placeholder rows, test paths resolve. This closes the class behind #9, the `Integration` labels, and the placeholder rows in `15--retrieval-enhancements/` | `validate_document.py:119-155`; `dual-level-retrieval.md:43` | ~half day, highest leverage |
| 11 | B | Schema-version catalog: append a timeline row for the archived-tier `memory_index` rebuild (unique predicate now `NOT IN ('constitutional','deprecated','archived')`); retitle file beyond "v28-v30" (content already reaches v37) | `schema-version-history-v28-v30.md:31` vs `031/002 implementation-summary.md:105` | ~15 min |
| 12 | C | Deep-loop YAML assets: add an `on_error/timeout` branch to startup `context_loading` in research/review/council; fix `delta_pattern` naming (`iter-{NNN}` vs actual `iteration-NNN`) | `deep_research_auto.yaml:58-61`, `:117` | ~30 min |
| 13 | D | Author the missing manual-playbook scenario for the under-surfacing/display-floor regression (code test exists; playbook lane empty) | `tests/token-budget-constitutional-sync.vitest.ts:250`; 0 playbook hits | ~1 h |
| 14 | D | Add a rescue-authority (`SPECKIT_RETRIEVAL_RESCUE_MODE`) feature-catalog entry | pipeline README names it only generically (`lib/search/pipeline/README.md:28`); 0 catalog hits | ~30 min |
| 15 | C | Relabel `review-depth-convergence.vitest.ts` as a static workflow-contract fixture in the integration README + the two catalog rows; fix ai-council catalog rows typing manual scenario files as "Automated test" | `tests/integration/README.md:3` / `…convergence-script.md:47`; `…status-recovery….md:51` | ~20 min |
| 16 | E | **Decide:** sanitize `skill_docs` frontmatter fields at write (match the `:973-975` treatment) vs promote the raw-boundary caveat out of the changelog into README/ARCHITECTURE. Code-adjacent; public path already sanitized+tested | `skill-graph-db.ts:811-821` vs `:973-975`; `skill-doc-harvest.vitest.ts:246` | small either way |
| 17 | E | **Decide:** whether `/memory:manage` and `/doctor speckit` should expose `memory_embedding_reconcile` — doctor is read-only *by design* (`doctor_memory.yaml:21`), so this is routing policy, not an omission bug | `commands/memory/manage.md:45` | design call |
| 18 | E | **Process:** create a closure path for detector-fired-unactioned failures (governance 063's recorded fail; iteration-17's cap contradiction). Detectors without a remediation loop reproduce this audit's findings indefinitely | `feature-flag-governance.md:57` | process, cheap to start |

**Cross-cutting insights the per-iteration log doesn't state:**
- **The `_V1` graduation-rename convention is a systematic drift generator.** Five flags were renamed at graduation; any living doc written mid-campaign risks carrying a V1 name. One sweep + a lint for `SPECKIT_\w+_V1` outside phase folders and the ENV_REFERENCE alias table would retire the class (item 1).
- **Most "index drift" here is mechanically lintable.** "One row per dated folder" (item 5), scenario high-water vs max table ID (item 7), MODULE_MAP count vs `ls feature_catalog | wc -l` (item 8), catalog-table flag names vs `search-flags.ts` tokens (item 6/scenario 063) are all one-liner checks. The highest-leverage single investment is item 10 plus a tiny index-freshness lint pack, not more manual doc fixes.
- **Historical vs living docs need an explicit convention.** Three findings (FF-3 phase summary, schema v28 row, arguably Track-C) are "drift" only because the repo has no marker distinguishing a versioned historical record from a current-behavior claim. A standard `> Superseded by …` banner resolves the ambiguity cheaper than rewriting history.

---

## 8. COVERAGE GAPS (what the audit under-covered)

1. **system-code-graph skill surfaces — the clearest gap.** The skill has a full doc suite (`feature_catalog/`, `manual_testing_playbook/`, `ARCHITECTURE.md`, `README.md`, `SKILL.md`, `changelog/`) and 028 phase `002-code-graph` landed work there (e.g. the edge-confidence/PPR revisit, `feature-flags.md:58`), yet zero iterations audited any of it. The playbook even cross-links into it (scenario 437 → `system-code-graph/feature_catalog/06--mcp-tool-surface/code-index-cli.md`).
2. **Stress tests as a named surface.** The question names them explicitly; coverage was one finding about harness *hygiene* (iter 7 #3). The `14--stress-testing` catalog category and CLI stress scenarios 434-438 were never checked against current behavior.
3. **system-spec-kit `SKILL.md` itself** — cited once as supporting evidence (iter 9 #3), never audited for alignment with the last ~50 specs, despite "skill SKILL.md" being in the question.
4. **Changelogs** — only the skill-advisor changelog was consulted (as evidence); system-spec-kit's own changelog surfaces were not audited.
5. **Iterations 11-15 opportunity cost.** Five iterations on deep-loop internals produced the heaviest duplication (12↔13, 12↔14) and mostly alignment-credits; gaps 1-3 above are what that budget plausibly displaced.
6. **Packet `029-headroom-utilization` unacknowledged** (opened 2026-06-28, after 028). Low impact — completion 0%, essentially nothing shipped — but the iteration-1 inventory declared 028 the "authoritative late implementation source" without establishing that.
7. **Agents** — only `agents/context.md` was checked; other `.opencode/agents/*` guidance untouched (minor; arguably out of the named surface list).

---

## 9. BOTTOM LINE FOR THE OPERATOR

The evidence log is reliable — use it. Apply the exec layer with three corrections: drop the phase-027 half of fix-first #3 (keep the comment fix), read "pattern E" as a YAML-asset gap rather than a code issue, and don't let `newInfoRatio = 1.0 × 20` argue for extending the loop — the metric was inert this run. The distinct real misalignments compress to the 18-item list in §7; items 1-4 are wrong-fact fixes totaling under ten lines, and item 10 (catalog-aware validation) is the only investment that prevents the class from regrowing. Before declaring the alignment question answered, spend one bounded pass on system-code-graph docs and the stress-test lane (§8.1-8.2) — those are the named surfaces the 20 iterations never reached.
