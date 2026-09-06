# Research Synthesis: Ripgrep Search System — Skeptical Retrieval Audit

**Lineage:** `glm-5-3-flash-ripgrep-search` · **Session:** `fanout-glm-5-3-flash-ripgrep-search-1788705376825-f0ulmm` · **Loop:** research · **Executor:** cli-pi (glm-5.3-flash), inline (no nested dispatch)
**Spec folder:** `specs/system-speckit/035-spec-kit-simplification-research/001-ripgrep-search-system`
**Stop reason:** `maxIterationsReached` (10/10 — charter mandates exactly 10, no early convergence; per-iteration newInfoRatio: 1.0, 0.9, 1.0, 0.85, 0.7, 0.7, 0.8, 0.55, 0.45, 0.4)
**Non-goals honored:** no edits to any repo file; no database/vector redesign; no prose-style review. All empirical probes were read-only or wrote only inside this lineage directory.

---

## 1. Verdict

The lexical retrieval system is **correct at the code level and inconsistent at the artifact/process level**. The generator, lookup, wrapper, and their libraries implement their documented contracts faithfully (determinism, fail-closed publication, exit-code discipline, parity assertions, and a 14-suite test lane all verified). The defects concentrate in the seams: a stale committed index nobody's tooling detects, a documented freshness invariant with no whole-corpus verifier, contract drift between the retrieval docs themselves, and one completed-migration tool displacing 48 KB in the hot directory. No P0 (nothing broken for the user today); 9 P1 rows are process/contract/utilization defects with concrete fixes.

## 2. The Ledger

Severity: **P1** = wrong/unused/stale (fix), **P2** = cosmetic or verified-positive (document). "Fix vehicle" names the smallest repair.

### P1 rows

| ID | Path:line | Claimed vs actual | Recommendation |
|----|-----------|-------------------|----------------|
| **L1 — Freshness/ownership chain** (merges F1.1 + F4.9 + F8.5) | `runtime/data/trigger-index.json` (whole); `fixtures/corpus-manifest.json`; `fixtures/latency-report.json`; `AGENTS.md:477`; `workflow.ts:344`; `doctor-speckit-retrieval.yaml:148` | Claimed: the committed index answers Gate 1 over the current corpus and staleness is caught ("Index stale after edits → rerun generator", `troubleshooting.md:63`). Actual: four mutually inconsistent corpus snapshots coexist (index manifestHash `f157b3a2…`, committed fixture manifest `49566f34…`, fresh build `9c258934…`, latency/parity fixtures `c0806077…` from a foreign worktree). Set-diff shows **zero query impact today** (identical 13,560 paths, 35,281 phrases, 45,806 postings — F8.1) — caught before it bit. The invariant is enforced at three partial points only: save-time per-packet (`checkTriggerIndexFreshness`), acceptance-time (latency budget), and **nothing at whole-corpus time**; no owner, no trigger. | Regenerate all four artifacts in one generator run; add a doctor-side `index.manifestHash == fixtures/corpus-manifest.json.manifestHash` comparison (O(1), no build — F8.7); point `AGENTS.md:477` at that check as the verifier. |
| **L2 — Single-token phrase scoring gap** (F2.6, F9.5) | `lib/normalize.mjs:118-121` | Claimed: the five-class ladder (`exact` → `phrase-containment` → `query-containment` → `token-overlap` → `partial`) describes what declared phrases can earn. Actual: `scorePhrase` returns null when the phrase has <2 tokens, so a single-token phrase can **only** match by exact equality; the candidate gate admits it for multi-token queries but it always scores `partial/0.0` and never ranks. Real-world incidence is low (sanitizer/no-prose-bigrams suites discourage 1-token phrases; spot-check found none). | Document the limitation in `retrieval-conventions.md` §8, or allow token-overlap scoring for single-token phrases. |
| **L3 — Concept-lane contract contradiction** (F3.1 + F5.1) | `retrieval-conventions.md:33,40,42,44` | Claimed: retrieval "splits into a keyed lane, a free-text lane **and a concept lane** … a ranked retrieval over an embedded index"; "**Both** index artifacts are produced by phase 001". Actual: two lanes exist; no concept lane or embedded index exists anywhere; `search.md:138` and presentation §6 declare semantic matching unsupported. The doc's own frontmatter phrase `"concept versus exact retrieval"` indexes the contradiction. | One editing pass: delete/rewrite the concept-lane rows and the availability note to name the single keyed index. |
| **L4 — search.md inline recipe drift** (F3.2, F5.2) | `.opencode/commands/speckit/search.md:86-88,27` | Claimed: "Copy the recipe flags literally from `retrieval-conventions.md`. Each of `--no-config`, **the two exclusion globs** and `--` closes a specific failure." Actual: the router's own inline block omits `--hidden`, `!**/.git/**`, `!**/scratch/**` that conventions §2.1 declares mandatory (§2.1 carries four exclusion globs); the count "two" matches only the drifted block. No mechanical guard can catch doc-level drift (wrapper's `assertRecipeParity` covers code only — F6.7). | Make the inline recipe byte-identical to §2.1, or replace it with a verbatim pointer; align the count. |
| **L5 — Gate 1 lookup has no mechanical executor** (F4.1, F4.2) | `AGENTS.md:83` = `CLAUDE.md:83`; `hook-system.md:89-93`; all `runtime/hooks/*`, installed adapters, plugins | Claimed: Gate 1 step 1 runs the lookup "EACH new user message"; the hook-system table pairs `lookup-trigger-index.mjs` with five runtimes' hook surfaces. Actual: **zero hooks, adapters, plugins, or settings registries reference the lookup script**; only `session-prime.ts:153` mentions plain `rg`. Enforcement is entirely model-reads-the-doc. | Either wire a UserPromptSubmit hook that runs the lookup and injects context, or state that Gate 1 is advisory; fix the hook-system table's column meaning. |
| **L6 — Doctor staleness probe misses the one check that matters** (F4.3) | `doctor-speckit-retrieval.yaml:148-149` | Claimed: the doctor diagnostic covers retrieval health. Actual: it probes index presence, mtime, and size — never manifestHash consistency. F1.1 shipped through exactly this hole. | Same fix vehicle as L1 (shared check). |
| **L7 — Orphaned latency harness** (F6.5) | `measure-cold-lookup.mjs` (whole) | Claimed: cold-start budget enforcement (exit 1 over budget). Actual: full working harness, produced the committed `latency-report.json`, then **zero recurring callers** — no doctor wiring, no CI reference, no quick-reference row. The one automated latency check that exists never runs again unless someone remembers it. | Wire into doctor-speckit-retrieval's optional checks or CI; otherwise document as acceptance-only in `retrieval/README.md`. |
| **L8 — retrofit-convention.mjs displacement** (F7.4) | `runtime/cli/retrieval/retrofit-convention.mjs` (48 KB, 1,000+ lines) | Claimed (README §1): part of the retrieval toolset. Actual: a five-stage, manifest-frozen corpus-rewriting pipeline for the **completed** one-time grep-convention migration, referenced once (`grep-convention.md`), kept alive by its own test suite, sitting in the directory every retrieval consumer shares. Largest file in `retrieval/`; zero retrieval-runtime role. | Relocate (with its test) to a maintenance/archive area, or delete once migration acceptance is confirmed. Out of scope to execute here. |
| **L9 — Acceptance-fossil fixtures + dormant contract slot** (F10.2, F10.3) | `fixtures/{semantic-probes,prompt-set,recipe-execution,daemon-off-proof}.json`; `generate-trigger-index.mjs:216-218`; `trigger-index.vitest.ts:404-410` | Claimed: fixtures serve "tests and frozen baselines". Actual: four fixtures have **no runtime reader**; `promptSetHash` is reserved by the manifest and asserted null by tests — the parity consumer it was reserved for never landed (schema v2). `semantic-probes.json` self-describes as "boundary evidence only" and pins a foreign-snapshot hash. | Land the parity arm or mark the four as archived acceptance evidence with a README row; refresh their hash pins at regeneration. Do not delete in this packet. |

### P2 rows (cosmetic / verified-positive, condensed)

| Theme | Findings |
|-------|----------|
| Doc fixes | `EXCLUSIONS` prose-glob list not the operational policy; add `dist` row + `.opencode/specs` alias row to §9 (F1.4, F5.8, F5.9); three matchClass vocabularies → one canonical ladder (F6.8, F3.4); latency `<50ms` target → 200ms budget with observed medians (F5.3, F9.2); latency-report path repo-relative (F5.4); README §7 validation commands broken as written — working invocation is `npx vitest run --config vitest.config.ts --project cli tests/…` (F7.1); wrapper `--root`-is-cwd trap → rename/document (F6.4, F7.3); §5 worked-example counts predate tree (F3 reflections); `--limit 0 = unlimited` undocumented (F2.5); `--triggers` is an undocumented router-only no-op passthrough (F3.8). |
| Render/utilization | 0.000-partial tail fills result listings (F1.6 — the surviving half of narrowed F2.8, F9.3); context.md reads the 3.8 MB index into context for Bash-denied agents (F6.2); consider `--no-index-hash` in the router lane (F3.5); variants fixture on-demand candidate (F1.9, F7.5). |
| Verified positive | Two-run byte-identical determinism (F1.2); atomic fail-closed publication (F1.3); exact single-exemption with unmatched-exemption reporting (F1.7); roots/mirrors/alias/cycle handling (F1.8); lookup edge inputs + exit codes per contract (F2.2, F2.3, F2.4, F2.5); scope filter exact (F2.3); unsupported lists match row-for-row across search.md/presentation (F3.3, F3.6, F3.7); conventions §4 recipes re-verified empirically at this tree (F3 sources); wrapper implements §5 tuple and refuses mode-mixing (F6.3, F9.3's exact-hit control); 14-suite test lane, trigger-index 48/48 passing (F4.8, F6.1, F7.6); save-time per-packet freshness check exists (F7.2); doctor's never-regenerate guard (F4.3); install-guides phrase quality (F8.6); manifest identity is the right consistency token (F8.7); skipped-reason behavior consistent across snapshots (F8.4, F8.8). |

## 3. Simplification Shortlist (no documented capability lost)

1. Relocate/archive `retrofit-convention.mjs` + its test (L8).
2. Regenerate-on-demand or drop `phrase-variants.json` from default publication (F1.9).
3. Document `sweep-memory-residue.mjs` as one-shot acceptance, or fold its allowlist check into the doctor (F6.6).
4. Delete conventions §1 concept-lane rows + fix the availability note (L3).
5. Replace search.md's inline recipe with a §2.1 pointer (L4).
6. Derive `EXCLUSIONS` from `EXCLUDED_DIR_NAMES`/`FIXTURE_DIR_PATTERN` (F1.4).
7. Keep Gate 1 inline in AGENTS/CLAUDE; do **not** create `repo-rules/retrieval.md` (F5.7 — Gate 5 loads on first write, not per prompt; footprint is already 5 lines; the real duplication is the AGENTS↔CLAUDE byte-mirror).

## 4. Open Questions (carried)

1. Is the `promptSetHash` parity arm expected to land (schema v3), or should the reserved slot be retired? (L9)
2. Is the grep-convention migration formally accepted-complete anywhere — the fact that licenses L8's relocation?
3. Should per-fixture hash pins (`semantic-probes.json`, `latency-report.json`) get an `IGNORED_PATHS`-style exemption or an auto-refresh in the regeneration command?
4. Who owns whole-corpus regeneration — CI task, doctor runbook step, or release checklist? (L1's fix needs a named owner.)

## 5. Convergence Report

- **Stop reason:** `maxIterationsReached` (charter: exactly 10, convergence telemetry only).
- **Iterations completed:** 10/10; all `status: complete`; zero timeouts/errors.
- **Question coverage:** 8/8 charter questions answered and closed; 4 process questions carried (§4).
- **newInfoRatio trend:** 1.0 → 0.4 (descending, never forced below the charter's no-early-stop bar).
- **Negative knowledge:** repo-rules placement, stale-index-drops-docs, F2.8's original framing, presentation/router disagreement, hook-executed Gate 1, golden lookup fixtures (absent — noted as a gap), generator nondeterminism — all ruled out with evidence in the per-iteration files.

## 6. Method & Evidence Notes

- Every P1 row carries file:line plus an observed behavior (empirical run, hash comparison, or exhaustive grep census); self-reported success was treated as unverified throughout.
- All generator runs, vitest runs, and lookups executed read-only against the repo or wrote solely inside this lineage directory (`tmp/gen1`, `tmp/gen2` hold the fresh-build artifacts used for the set-diffs — retained as evidence).
- 52 tool-bounded research operations across 10 iterations; ≤12 per iteration (skill TCB respected).

## References

- Iteration narratives: `iterations/iteration-001.md` … `iteration-010.md` (this directory)
- Per-iteration structured deltas: `deltas/iter-001.jsonl` … `iter-010.jsonl`; state log: `deep-research-state.jsonl`
- Ground truth: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/**`, `runtime/data/trigger-index.json`, `.opencode/commands/speckit/{search.md, assets/search-presentation.txt}`, `references/retrieval/retrieval-conventions.md`, `AGENTS.md`/`CLAUDE.md`, `REPO RULES.md`, `runtime/cli/{rules,tests,core}` surfaces cited per row.
