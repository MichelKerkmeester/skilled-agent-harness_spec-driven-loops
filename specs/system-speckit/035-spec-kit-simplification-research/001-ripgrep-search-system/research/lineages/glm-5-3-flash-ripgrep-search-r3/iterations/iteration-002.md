# Iteration 2 — the doctor retrieval target

- **Lineage:** glm-5-3-flash-ripgrep-search-r3 · **Angle 2 of 5** · TS receipts: 10:49:39Z / 10:55:12Z / 11:07:08Z
- **Angle:** for each check `doctor-speckit-retrieval.yaml` declares, read the artifact it names under `fixtures/` or `runtime/data/` and decide whether the check reads a real value or a self-referential one; a check that would pass on a stale or absent artifact is a finding.
- **Method:** 3 reads (the 254-line target, the router, the route manifest) + 1 receipt sweep (four-way hashes, phraseQuality, schema-assert, update-ownership, index scale, lineage-indexing) + 1 anchor sweep + 2 reads (the conventions — shared with iterations 4-5, read once here — and the retrieval README) = 8 evidence calls + 4 record writes = 12 (at the cap).

## The declared check inventory (9 signals)

| # | Signal (yaml line) | Named artifact | Read? | Reads a real value? |
|---|--------------------|----------------|-------|---------------------|
| 1 | index_older_than_corpus (:179) | the index (its 13,722 paths) | counted, not diffed | mechanism-free → **R3-2.6** |
| 2 | manifest_hash_mismatch (:118-119) | "a fresh manifest" — none exists | n/a | mechanism-free → **R3-2.2** |
| 3 | committed_pair_mismatch (:126-128 area) | trigger-index + corpus-manifest + generation-diagnostics + phrase-variants | YES (receipt [1]) | REAL — all four `b6953bc6…e9e0e7` |
| 4 | lookup_exit_error (:132-134 area) | the lookup (`lookup-trigger-index.mjs:23`) | YES | REAL (exit 0/1/2; 1 = clean no-hit, never a signal) |
| 5 | ripgrep_ambient_config (:129-131) | the recipe (§2.2 / the route's invocation) | YES (text) | diff never run → **R3-2.3** |
| 6 | trigger_phrase_drift | sampled packets' frontmatter vs the index | sampled (≤5, disclosed) | REAL within its disclosed cap |
| 7 | anchor_marker_drift (:135-137) | none | — | no activity → **R3-2.4** |
| 8 | corpus_pollution (:141) | fixtures/generation-diagnostics.json | YES (receipt [2]) | REAL — the `phraseQuality` bucket exists in the committed diagnostics |
| 9 | schema_version_mismatch | "the version the lookup script expects" | YES (receipt [3]) | REAL — `TRIGGER_INDEX_SCHEMA_VERSION` enforced at `lib/artifact.mjs:164-168` |

Plus the execution surface: the yaml's promised invocation vs the route's actual one (**R3-2.1**) and the pass-policy's frozen-prompt-set promise (**R3-2.5**), and the absent-fixture semantics (**R3-2.7**).

## Findings (7)

| ID | Claim (path:line) | Actual (path:line + receipt) | Severity | Recommendation |
|----|-------------------|------------------------------|----------|----------------|
| R3-2.1 | `doctor-speckit-retrieval.yaml:157` — "Run the path-only recipe from retrieval-conventions.md section 2.2"; `:158` — the broken-roots re-run "proving the wrapper can tell a broken invocation from a clean miss" | `_routes.yaml:42` — `rg --no-config --files-with-matches --max-count 1 --fixed-strings --ignore-case --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' -- 'trigger index generator' specs .opencode` — vs conventions §2.2 (retrieval-conventions.md:92): the contract carries `--hidden` and FOUR exclusion globs. The route's invocation is missing `--hidden` (conventions:76: without it, dotted-directory misses "read as a clean no-match") and `!**/scratch/**`; its `!**/.git/**` absence is vacuous without `--hidden`. It is also not the wrapper: `rg-wrapper.mjs` implements the path-only recipe "exactly as the convention document specifies" (README:89; conventions:315 — "The Section 2 recipes behind one front door"), yet no yaml or route line invokes it, while `:158` claims the probe proves the wrapper's contract. The invocation is a fifth, undocumented recipe shape (README:22: the ONLY hand-composed recipe = §2.4's, not this one) | P1 | fix — make the route's invocation §2.2-verbatim or `node …/rg-wrapper.mjs path-only …`; one line |
| R3-2.2 | `doctor-speckit-retrieval.yaml:118-119` — `manifest_hash_mismatch`: "The index's recorded manifestHash does not match a **fresh** manifest over the same included paths" (severity medium) | The workflow's ONLY manifestHash comparison is `:155`'s four-way committed-vs-committed compare (the `committed_pair_mismatch` mechanism, receipt [1]); the only .mjs the workflow may invoke is `:156`'s OPTIONAL `measure-cold-lookup.mjs`. No activity computes, reads, or compares a fresh manifest; the outputs slot `:188` (`manifest_hash_mismatch: M`) cannot be populated as declared | P1 | document — the signal fires only from a companion `/doctor:update` build (per the yaml's own invariant) — or fix with a compute-only fresh-walk activity |
| R3-2.3 | `doctor-speckit-retrieval.yaml:129-131` — `ripgrep_ambient_config`: "A recipe run WITHOUT --no-config returns a different result set than the same recipe WITH it" (severity HIGH) | The workflow runs the recipe ONCE with `--no-config` (`:157` via `_routes.yaml:42`) plus ONE broken-roots re-run (`:158`); no flagless second run and no result-set comparison exists in the yaml or the route. The signal exists to enforce conventions §7 (`retrieval-conventions.md:222-233`, the ambient-configuration neutralization table) — the doctor owns that enforcement and never executes the check | P1 | fix — add the flagless twin and the diff to the :157-:158 activities, or document as operator-verified |
| R3-2.4 | `doctor-speckit-retrieval.yaml:135-137` — `anchor_marker_drift` (severity low); outputs slot `:192` (`anchor_marker_drift: Q`) | No phase-0 or phase-1 activity reads anchors; the yaml's only other anchor occurrence is the phase-2 recommendation rule ("trigger phrase OR anchor drift"). conventions §2.4 (`retrieval-conventions.md:113+`) defines the exact pair grammar and mandates "Report an unmatched or orphan marker as a diagnostic" — the doctor is that diagnostician and never scans | P2 | fix — fold an anchor-pair check into the 5-sample packet reads (same packets, already read) — or document as telemetry-only |
| R3-2.5 | `doctor-speckit-retrieval.yaml:38` — `lookup_exit_class: "0 or 1 on the frozen prompt set; 2 or higher fails"` | Nothing loads the frozen prompt set: no workflow activity references `fixtures/prompt-set.json` (the yaml's only gesture is `:38`), and the operational probe `:154` ("a known probe prompt") is bound by `_routes.yaml:41` to ONE inline literal, `resume work session context`. README:78 documents the frozen five (prompt-set.json among them) as having "no runtime reader" — the doctor's :38 is the one promise that names the set, and no step loads it; the fixture going stale or absent would change nothing the doctor reports | P2 | document — :38 records the acceptance bar, :154+route:41 the operational liveness — or fix by binding :154's probe to the frozen set |
| R3-2.6 | `doctor-speckit-retrieval.yaml:179` — "Cross-reference the index mtime with source mtimes: any indexed file newer than the index signals staleness" | The indexed set is 13,722 paths (receipt [5]: 11,871 `specs/` + 1,851 `.opencode/` occurrences in the committed index). The route's two promised invocations (`_routes.yaml:41-42`) are the lookup and ONE rg; no step extracts the index's `paths[]` and no enumeration is prescribed. The nearest improvisation, `find specs .opencode -newer <index>`, is a SUPERSET: conventions:269+ (§9) deliberately keeps `research/lineages` (receipt [7c]: 0 lineage paths indexed), `dist` and `tests/fixtures` OUT of the index while the recipe roots carry them, so improvised walks fire on documents the signal definition does not count | P2 | document — name the enumeration and its scope — or fix with a paths-extracting route invocation |
| R3-2.7 | `doctor-speckit-retrieval.yaml:155` — the four-way compare ("any unequal value is the committed_pair_mismatch signal") + the fail_fast branches (`:174`, `:252` = INDEX-missing only) | Receipt [1]: all four committed artifacts carry the equal manifestHash `b6953bc6b72532be791adb67232eb8e21472906a080bfef7e5bd679ee0e9e0e7` (the 08:34Z-UTC 013-closeout = one consistent run) — the check is REAL and passing today. But no step defines what an absent or unreadable FIXTURE yields: STATUS=MISSING covers only the missing INDEX, and the comparison instruction covers only unequal values | P2 | document — a missing fixture is its own signal; one clause |

## What the angle verified as correct (receipts, no rows)

1. **The committed pair is consistent and real** — receipt [1]: identical `manifestHash` in trigger-index.json, corpus-manifest.json, generation-diagnostics.json, phrase-variants.json (V10's four-way fix, HOLDING; the comparison = four independently committed artifacts, NOT self-referential).
2. **corpus_pollution reads real data** — receipt [2]: the committed generation-diagnostics.json carries the `phraseQuality` bucket (documents: editor-fallback 4, generic-workflow-word 171, numeric-only 121, prose-sentence 18, single-token 825, stop-word-only 12); its trustworthiness is pinned to the committed run BY the four-way compare — the design closes its own loop (N5's fix, IN THE FILE at :141 + the phase-1 read; not re-reported).
3. **The schema-mismatch premise holds in code** — receipt [3]: `lib/artifact.mjs:164-168` throws on `schemaVersion !== TRIGGER_INDEX_SCHEMA_VERSION`; the lookup therefore exits 2 with a precise message, making the phase-0 probe the signal's detector.
4. **/doctor:update really runs the generator** — receipt [4]: `assets/doctor-update.yaml:369` invokes `generate-trigger-index.mjs` ("full regeneration; … no daemon and no incremental mode"); the invariant's ownership chain (update.md → doctor-update.yaml:369) holds, so the phase-2 recommendations route to a mechanism that exists.
5. **All 14 doctor assets exist** (receipt [7b] ls): the 9 routed targets + update + mcp-install/debug + presentations — no dangling route.
6. **The route→yaml probe-prompt integration is closed** — yaml:154's "a known probe prompt" (deliberately unnamed) is bound by `_routes.yaml:41` to a concrete literal, with the exit-class comment matching `lookup-trigger-index.mjs:23` exactly (2+ = "missing or unreadable index, reported with stderr and never as a no-hit").
7. **The fail_fast MISSING-vs-FAIL distinction is honest** — yaml:174/:252: a missing index = STATUS=MISSING, "the ripgrep lane still works and is reported separately".
8. **The :152-:153 baseline (test -f + stat) survives from the pre-006 phase 0** — the 006 remediation ADDED :155's four-way compare rather than replacing the presence/size/shape baseline (L1's remediation = IN THE FILE, verified).
9. **The frozen-five disclosure (README:76-78)** = the L9/V13 documentation disposition, HOLDING: "captured once… have no runtime reader… a mismatch against the committed manifest is expected and is not a staleness signal."

## Self-referential verdicts (the angle's question, asked of every check)

- The four-way compare: NOT self-referential (four separately committed files; receipt [1]).
- corpus_pollution: single-sourced (the generator counts its own output) but NOT a tautology — the doctor's role is surfacing, the value is pinned to the committed run by the pair-check, and the pollution diagnosis (§8's rationale: "the phrases never rank, so the cost is precision and parse time, not a wrong answer") requires exactly one source of truth.
- schema_version_mismatch: the lookup is both the detector (exit 2) and the meaning (the thrown message names expected vs actual) — tight but coherent, the message IS the classification.
- The three mechanism-free signals (R3-2.2/2.3/2.4) are the ones whose OUTPUTS slots (:186-192) are self-fulfilling: the report prints whatever the workflow can produce, which for those three is nothing.

## Census cross-check (read once, iteration 1)

- L1/L6/V10 (the 006 doctor fixes): verified IN THE FILE (:155's four-way, :152-:153's retained baseline, :174/:252's MISSING semantics) — not re-reported.
- N5 (the phraseQuality screen, 013): verified IN THE FILE (:141 + the phase-1 read; receipt [2]) — not re-reported.
- L4 (search.md's recipe, fixed in 006): NOT re-verified here (different file); the ROUTE's invocation = the same defect class on a third surface, un-remediated by 006's scope → R3-2.1 is new, and its census-kinship is disclosed.
- V4 (the recipe-count fix): VERIFIED at README:22 ("three of the four… composed by hand" = §2.4) — which STRENGTHENS R3-2.1: the hand-composed slot is taken, so the doctor's invocation is a fifth undocumented shape.
- L9/V13 (the frozen five): the README:76-78 disclosure = the recorded disposition, HOLDING — not re-reported; R3-2.5 is the NEW fact (the doctor's own :38 promise), not the fixture-readership fact the census recorded.
- No census row contradicted this pass. No row re-reported.

## What the angle did NOT read (call cap)

`doctor-speckit-presentation.txt` (the report-destination wording, `<packet_scratch>` resolution — the mutation-boundary's enforcement text); `doctor-update.yaml` beyond :369's receipt; the embeddings/deep-loop/… sibling targets; conventions §3-§6 beyond what the citations needed (§3 scoping, §4 exit-status worked-example, §5 ranking, §6 flags — skimmed for context only, none audited); `rg-wrapper.mjs` itself (14KB — its §2.2-fidelity is documented by README:89 and the coverage-parity test, not independently re-verified here); the recipes' BEHAVIORAL verification (no rg executed — the hard limits; the :157-:158 divergence is established textually from the two invocation strings).

## Open questions

1. Where does `<packet_scratch>` resolve for a subsystem-targeted `/doctor speckit-retrieval`? `setup_vars` = [execution_mode, intent, incremental] — no packet; `speckit.md` delegates unresolved setup to the presentation contract's per-target prompts (unread; the report-destination = thus runtime-resolved).
2. The diagnostics' `single-token` documents-bucket reads 825 (receipt [2]); the census (round 2, N1) counted 826 owning documents. One-document delta: drift, classification semantics, or counting-rule difference — not recounted here (the 352/2,245 census counts were not retaken; the 13,722 path count IS this pass's receipt).
3. Who calls `rg-wrapper.mjs` in production? Its documentation (conventions:315, README:22/89) bills it as the Section-2 front door; the doctor never invokes it; the test suite's usage is unverified within this pass's cap.
4. Do the recipes behave as documented (the :158 exit-2 proof, the §4 worked-example rows)? Not executed — the hard limits; the :157-vs-:42 divergence is textual.

## Process notes

- 12 calls exactly (8 evidence + 4 records), at the cap; the conventions read (317 lines) deliberately serves iterations 4 and 5 too (§1 boundary losses, §8 phrase guidance, §9 exclusions) — one read, three angles, disclosed here.
- The self-fulfilling-outputs mechanism (three dead signals → three永远-quiet report slots) applies to R3-2.2, R3-2.3 and R3-2.4 jointly; they are kept as separate rows because their remediations differ (companion-build note vs second-ripgrep-run vs 5-sample fold-in).

## What Worked / What Failed / Next Focus

- **Worked:** the receipt-sweep pattern (one bash, six decisive receipts: [1]-[6]); the route-yaml cross-reading — the invocation divergence was invisible from either file alone; the census-read-once discipline converted five would-be re-reports into verified-positives.
- **Failed:** nothing; 12/12 calls, no wedges this iteration.
- **Next Focus (Iteration 3):** the residue sweep and its allowlist — `sweep-memory-residue.mjs`'s patterns vs `fixtures/residue-allowlist.json`, ≤8 sampled allowlisted paths (existence, residue-gone, pattern-coverage: "a residue the sweep's patterns would miss in a file you opened is a finding"). Seeds: README:106 (the cwd-default `--search-root` requirement); the census's ONE-SHOT-acceptance disposition (README §4) vs 013's "documented owner task" — where does the ownership documentation actually live; the sweep's ripgrep-JSON patterns vs the retired-terms surface.
