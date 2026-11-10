# Iteration 3 — the residue sweep and its allowlist

- **Lineage:** glm-5-3-flash-ripgrep-search-r3 · **Angle 3 of 5** · TS receipts: 11:22:42Z / 11:26:44Z / 11:29:28Z / 11:31:27Z / 11:33:18Z
- **Angle:** read `sweep-memory-residue.mjs` + `fixtures/residue-allowlist.json`; for ≤8 allowlisted paths, open the path and decide whether the exception still applies; an allowlisted path that no longer exists, or whose residue is gone, is a finding; a residue the sweep's patterns would miss in a file you opened is a finding.
- **Method:** 2 full reads (the 612-line sweep, the 41-entry allowlist) + 5 evidence bash (existence+residue counts, the 013-ownership hunt, the foreign-tree probe, the pattern-coverage probe, the 013's last unread docs) + 4 record writes = 11 calls.

## The sampled 8 (selection disclosed: the concrete-file entries most exposed to 013/006 movement, plus the two documents this lane reads anyway)

| # | Allowlisted path (entry #) | Exists? | Residue (sweep-term shapes) | Exemption still applies? |
|---|---------------------------|---------|------------------------------|--------------------------|
| 1 | retrieval-conventions.md (e33) | YES | 7 (memory_search/context/quick_search + system-spec-memory) | YES — it "names the retired tools it replaces" (the reason's claim, receipt-true) |
| 2 | feature-catalog/feature-catalog.md (e31) | YES | 1 line | YES (the reason = the retired-tool→successor mapping table; the table's SHAPE = iteration 4's read) |
| 3 | runtime/cli/tests/gate-3-classifier.vitest.ts (e19) | YES | 4 (my 4-pattern probe: 0 — its class is `memory_save`, the reason's own terms) | YES |
| 4 | runtime/cli/tests/memory-sufficiency.vitest.ts (e20) | YES | 8 | YES ("fixture text quoting a historical save gate message") |
| 5 | runtime/cli/tests/nested-changelog.vitest.ts (e21) | YES | 1 | YES ("fixture text; historical narrative") |
| 6 | runtime/cli/tests/workflow-step115-daemon-guard.vitest.ts (e28) | YES | 1 | YES (the negative guard lists the retired names by design) |
| 7 | .opencode/plugins/tests/opencode-goal-tool-path.test.cjs (e32) | YES | 1 | YES (the negative assertion, by design) |
| 8 | runtime/ENV-REFERENCE.md (e22) | YES | 4 (+ the launcher/shim spellings, receipt [5]) | YES — but its stated reason is half-stale → **R3-3.1** |

Also receipt-verified: the 033/017/001 acceptance-criteria.md (the decommission-packet dir-row's target, e4) = 7,116 B, present — the doctor-yaml:46 dependency resolves.

## Findings (2)

| ID | Claim (path:line) | Actual (path:line + receipt) | Severity | Recommendation |
|----|-------------------|------------------------------|----------|----------------|
| R3-3.1 | Two stale justification references inside the sweep's own audit surface — (a) `residue-allowlist.json` (entry, ENV-REFERENCE.md): "Lives in the engine tree; excluded with it"; (b) `sweep-memory-residue.mjs` (GLOB_DELTA comment, the `.git` reason): "the vendored/cloned repositories nested under this tree (e.g. `barter/*`, `.pi/git/*`)" | (a) receipt [D]: the retired engine is GONE from the skill tree — the `ls` of `.opencode/skills/system-spec-kit/` shows no `mcp-server` (nothing between `manual-testing-playbook` and `node_modules`); yet `runtime/ENV-REFERENCE.md` SURVIVED (receipts [1]+[A]: exists, 4 sweep-term hits + the launcher-shim spellings, receipt [5]) — the doc was "excluded with" a tree that no longer exists, and it is now that tree's only survivor. (b) receipt [4]: `barter/` does not exist; `.pi/git/github.com` does. The allowlist's own design bar is that the reasons alone suffice for audit ("so a reviewer can audit the whole exemption set without reading this script") — both stale references degrade exactly that | P2 | fix — two one-line reason refreshes (the file: "the retired engine's env documentation, retained when its tree was removed"; the comment: drop the barter example or replace it with a live one) |
| R3-3.2 | The census's N1 disposition, third clause: 013 = "the residue sweep is now a documented owner task rather than a silent condition" | Receipts [G]+[I2]+[J]: the 013 packet's 8 documents (spec, plan, tasks, goal, acceptance-criteria, implementation-summary, description.json, graph-metadata.json — all mtime = the 013 closeout) mention the memory-residue sweep ZERO times. spec.md:78's lone "owner" hit = the 826-documents content decision (a different ownership); implementation-summary.md:53 and goal.md:105 say "a repo-wide frontmatter sweep" — the other sweep. And the 013-TOUCHED retrieval README (receipt [I3]: its mtime = the 013 closeout, 10:34) still bills the sweep as "A one-shot acceptance check from the memory decommission" — precisely the silent-condition wording the disposition claims was replaced. The clause is either the census's paraphrase drift (the 006-era README row = the "documentation", the "owner" = elided) or a 013-Δ promised and never landed | P2 | fix — one sentence of ownership in the README §4 sweep row (WHO runs it, WHEN: after which class of change) — or amend the census's N1 row |

## What the angle verified as correct (receipts, no rows)

1. **All 8 sampled exemptions apply** — every sampled path exists and carries real sweep-term residue (4/8/1/4/1/1/1/7 across the two probes; the 4-vs-0 discrepancy in my first probe = my 4-pattern subset, corrected by the true term-shape pass, receipt [A]). No allowlisted path missing; no residue gone. Zero findings of the angle's own negative classes.
2. **The foreign-tree question, answered clean** — receipt [4]: `.pi/git/github.com` is swept (the GLOB_DELTA only excludes ITS nested `.git` dirs, by written reason) and carries ZERO memory-terms — the vendored clones are memory-free, so the repo-wide root costs nothing today. (The `barter/*` half of the delta's example = historic, see R3-3.1b.)
3. **The sweep's hardening is real, in code, with reasons**: the fail-closed allowlist load ("a silently dropped exemption reads as new residue and a silently dropped rule reads as a clean sweep"); word-bounded tool names so `memory_index_scan` never absorbs `memory_index_scan_status`; deliberately unbounded literal terms (the tool-call prefix and shim filenames); per-term attribution so a line naming several terms reports each (no leftmost-aliasing); the `unattributed` fallback; `--no-ignore-global --hidden` so the registrations that matter (`opencode.json`, `.utcp_config.json`) cannot be default-ignored.
4. **The historical/triage rule is honestly hedged in its own code** — "it is a triage label, not a claim that every file beneath one is semantically inert" — and the produced-vs-consumed semantics work: the generator's own `fixtures/` outputs (corpus-manifest, generation-diagnostics, phrase-variants) classify as historical, which is CORRECT for a "live consumer" question (a producer's self-emissions are not consumer residue); `.jsonl` → historical = the record-spill proxy.
5. **The exclusion deltas each carry a reason, and they hold**: `.git` root-scoped (the nested-`.git` defense — receipt [4] shows the nested-clone tree is REAL); `.worktrees` (this very lineage runs in one — the exclusion matches this repository's real layout); `research/lineages` mirrors the corpus's compound rule (§9:269+); the corpus's fixture-directory exclusion is deliberately NOT adopted, with the reason ("residue can hide inside a fixture-named directory... a fixture tree is real content").
6. **Shared policy, not a second hand-written list** — the anywhere-globs import `CORPUS_EXCLUDED_DIR_NAMES` from `lib/corpus.mjs`, with the `.git`-delta carved out consciously so a future shared-policy addition forces a decision here.
7. **The cwd-default behaves as documented** — README:106 ("running them from elsewhere without `--root`... fails to find specs/ and .opencode/") = `path.resolve(options.root ?? process.cwd())` + the `.opencode`-presence throw: fails as EXIT 2 with a message, not as a silent wrong-root miss.
8. **Exit contract 0/1/2** = the README §6 shape ("0 clean, 1 substantive finding, 2 invocation/execution fault").

## Census cross-check (read once, iteration 1)

- The census's L7/L9 rows (the sweep = one-shot acceptance, no caller outside tests and docs): the README §4 row = the recorded fix, STILL PRESENT — not re-reported. (R3-3.2 = the 013-ADDITIVE claim, a different fact.)
- The census's round-2 N1 disposition: its first TWO clauses verified-in-实体 by iterations 2 (the phraseQuality bucket, receipt [2]) and the judge's existence (receipt [I3]: `lib/phrase-judge.mjs`, 5,021 B, 013-touched); the THIRD clause = R3-3.2's new evidence. Disclosed, not a silent re-report.
- The `barter`/`.pi` example = the 006-era code comment — inside this angle's read scope, so it is filed here (merged with the allowlist's stale reason) rather than left for a prose pass (non-goal).

## What the angle did NOT read (call cap)

The 33 unsampled allowlist entries (16 concrete files + 17 glob/dir rows — the dispatch's 8-path cap); the coverage-parity test (`retrieval-coverage-parity.vitest.ts`) that "keeps the exclusion delta honest" (the README's mechanism, taken on documented faith); `lib/rg-lane.mjs` and `lib/corpus.mjs` (imported, not read); the 013 packet's `graph-metadata.json`/`description.json` (metadata, not prose).

## Open questions

1. Who, post-013, runs the residue sweep, and when? (R3-3.2's own question — open until somebody answers it.)
2. The allowlist's 8 subdirectory glob rows (`specs/**/audit|evidence|fixers|seats|logs|measurements|backlog|context`) are functionally subsumed by the later bare `specs/` prefix row — the only difference = the record's class label (`allowlisted`+reason vs `historical`). The file's own description anticipates this ("an explicit row stays visible as an explicit row"), so it is NOT filed; recorded as a duplication observation for the next雀allowlist editor.
3. Do the 16 unsampled concrete-file exemptions still hold? (Same 8-path cap; the next pass should sample the advisor-five and the two pi-doc entries, which my selection did not reach.)

## Process notes

- The 013/006 homes resolved this pass: both are PHASE CHILDREN of 035 (`specs/system-speckit/035-.../006-.../`, `.../013-.../` — receipt [B]); the dispatch's and census's track-rooted short forms are elisions. My own iteration-1 strategy file used the same elision; the correction lands in the synthesis-time strategy rewrite, not aGratis new record.
- The sweep's term-set inspired my two-probe correction (the 4-iconic-terms probe undercounted the `memory_save`-class rows): recorded in the iteration-003 delta's coverage line.

## What Worked / What Failed / Next Focus

- **Worked:** the two-probe residue counting (the 4-iconic-terms pass + the true term-shape pass) caught my own sampling bias; the 013-ownership hunt converged in three greps by following the mtimes.
- **Failed:** nothing; 11/12 calls.
- **Next Focus (Iteration 4):** the two boundary tables — feature-catalog's boundary table vs retrieval-conventions §1, row by row (every loss and every relocation in BOTH, same destination); then the retrieval README's limits section (§5 Boundaries + the §1 "Current state" bullets) against the same two. Seeds already in context: the conventions' §1 loss table carries SIX rows with a DOUBLE-BOOKED middle (rows 5-6: "Semantic paraphrase, vector and BM25 fusion, decay, access tracking and session dedup" AND "Decay, access tracking and session dedup" — decay/access/dedup appear twice); the §1 prose "the two share no mechanism" vs §5's "in the order lib/normalize.mjs ranks them" and the README §5's "share normalization and ranking through lib/normalize.mjs and lib/rg-lane.mjs" — the scope-of-"mechanism" question; the 013-touched README's "Current state" bullets vs the conventions' availability note ("In a checkout that predates the generator, the ripgrep lane... works immediately and the Gate 1 lane does not").
