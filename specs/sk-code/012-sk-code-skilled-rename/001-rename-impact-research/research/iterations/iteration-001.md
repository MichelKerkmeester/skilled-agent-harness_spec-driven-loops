# Iteration 001 — Q1: Where the `sk-code-opencode` identity is load-bearing

- Run: `2026-10-18T17:35:32.240Z` · mode=research · segment 1, iteration 1 of 5
- Status: insight — Q1 answered (one element carried forward: advisor-DB internals)

## Focus

Q1: Where is the sk-code-opencode identity load-bearing (folder paths, hub registry/router/graph-metadata/SKILL.md, advisor DB and compiled routes, integration code, scripts, tests, fixtures, runtime mirrors), with counts and path:line evidence?

## Actions Taken

1. Read run config and strategy — session identity, exact key-question text, and the orchestrator's seed counts (strategy §12).
2. Repo-wide aggregate sweeps (search tool over the worktree): identity spellings `sk[ _-]?code[ _-]?opencode`, case-insensitive → **15,694 occurrences**; exclusion surface `cli[ _-]?opencode|\.opencode`, case-insensitive → **2,129,598 occurrences** (implausible — flagged, see F7).
3. Path inventory `**/*code-opencode*` → packet folder + `.hermes` mirror + changelog path (~99 path lines; 53 displayed, 46 withheld at the display limit).
4. Read the hub contract in full — `.skilled/skills/sk-code/SKILL.md` (209 lines).
5. Line sweep `.skilled/skills/sk-code` for `sk-code-opencode` (hit the 150-match cap; per-area counts in F5 are lower bounds).
6. Line sweep `.skilled/**/*.cjs` — 38 matches, complete (drift guards, verifiers, compiled-route tests, doctor checks).
7. Line sweep hub-root `*.json` — 18 matches (mode-registry, hub-router, graph-metadata, leaf-manifest, description + 1 benchmark transcript).

Tool-call note: 13 calls this iteration (pack target 12; config budget 24). The extra call was sweep 7, needed for Q1's registry/router/graph-metadata path:line evidence.

## Findings

### F1 — Structural anchors: the packet folder and its runtime mirror
- The packet is `.skilled/skills/sk-code/sk-code-opencode/` — `SKILL.md`, `README.md`, `assets/checklists/` (14 files), `assets/scripts/` (8 files), `benchmark/reports/` (15 files), `changelog/` (13 release notes shown), plus a `scripts/` dir (drift-guard runner + tests, seen in the `.cjs` sweep). [SOURCE: .skilled/skills/sk-code/SKILL.md:165]
- Runtime mirror confirmed at `.hermes/skills/sk-code-opencode/SKILL.md`. [SOURCE: .hermes/skills/sk-code-opencode/SKILL.md:1]
- Bare-form history dir (orchestrator-known): `.skilled/changelog/sk-code/code-opencode`. [SOURCE: specs/sk-code/012-sk-code-skilled-rename/001-rename-impact-research/research/deep-research-strategy.md:163]

### F2 — Hub-root routing JSONs carry the surface key (the registry-driven core)
| File | Lines | Carries |
|---|---|---|
| `mode-registry.json` | 5, 19, 79, 88, 89 | surfaces list; `workflowMode` / `packet` / `packetSkillName` entries |
| `hub-router.json` | 7, 36, 39 | `tieBreak` order; surfaceBundle entry; resources |
| `graph-metadata.json` | 230, 250–253, 278, 282 | resource paths (incl. packet `references/` + `assets/scripts/`), causal summary |
| `leaf-manifest.json` | 114–115 | typed (`workflowMode`, `packet`) leaf pair |
| `description.json` | 47 | hub advisor descriptor entry |

[SOURCE: .skilled/skills/sk-code/mode-registry.json:79] [SOURCE: .skilled/skills/sk-code/hub-router.json:7] [SOURCE: .skilled/skills/sk-code/graph-metadata.json:250] [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:114] [SOURCE: .skilled/skills/sk-code/description.json:47]

### F3 — Sibling packets and the quality mode reference the packet by relative path
- `sk-code-quality/SKILL.md` maps load targets `../sk-code-opencode/assets/checklists/<target>.md` at lines 69, 107–112, 122–127 (34 matches in the file). [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:69]
- `sk-code-quality/scripts/typo-flags.test.sh:17` pins `$SKILL/sk-code-opencode/assets/scripts/verify-router-sync.cjs`. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh:17]
- `sk-code-review/SKILL.md:39,42,499`, `sk-code-review/references/review-core.md:68`, `sk-code-webflow/README.md:94`. [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:39] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:68] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/README.md:94]

### F4 — Integration and guard code holds the literal (rename-blocking)
- Doctor checks: `sk-code-setup-check.cjs:59` pins the drift-guard path literal (+ tests :29, :208); `parent-skill-check.cjs:1159,1163` pins `SK_CODE_NATIVE_SURFACE = 'sk-code-opencode'` for check 5l (+ invariants test 489–514). [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:59] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1163] [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:491]
- Compiled-route tests: `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:65,72,89,112` assert mode orders containing `sk-code-opencode`. [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:65]
- Packet verifiers: `verify-router-sync.cjs:33,261–265` cross-checks `leaf-manifest.json` against the on-disk packet folder; `router-replay-lib.cjs:495,611,628`; `verify-doc-claims.cjs:68`. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:263] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/router-replay-lib.cjs:495]
- Packet tests: `scripts/tests/verify-router-sync.test.cjs:35,102–161`; `scripts/tests/verify-doc-claims.test.cjs:9`. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify-router-sync.test.cjs:35]
- Compiled routing itself is registry-driven: `.skilled/bin/compiled-route.cjs` contains no `sk-code-opencode` literal (absent from the complete 38-match `.cjs` sweep) — it resolves through the hub JSONs in F2.

### F5 — Counts
| Measure | Value | Evidence |
|---|---|---|
| Non-spec files naming `sk-code-opencode` | 137 (107 md, 14 json, 10 cjs, 2 txt, 2 jsonl, 1 yaml, 1 sh) | orchestrator seed, strategy §12 |
| Non-spec files containing bare `code-opencode` | 43 | orchestrator seed, strategy §12 |
| Markdown files under `specs/` | 1,196 | orchestrator seed, strategy §12 |
| Identity occurrences, repo-wide (this iteration) | 15,694 (occurrences, not files; includes `specs/` history) | sweep 2 |
| `.skilled/**/*.cjs` matches | 38 (complete) | sweep 6 |
| Hub-root `*.json` matches | 18 | sweep 7 |
| `**/*code-opencode*` path lines | ~99 (53 displayed + 46 withheld) | sweep 3 |
| Exclusion-pattern occurrences | 2,129,598 (implausible; see F7) | sweep 2 |

[SOURCE: specs/sk-code/012-sk-code-skilled-rename/001-rename-impact-research/research/deep-research-strategy.md:163]

### F6 — Advisor surface is hub-level by design
The hub states surface packets are advisor-invisible and the advisor routes the single identity `sk-code`; `graph-metadata.json` is the ONE identity per skill. The advisor DB is therefore expected to hold the hub identity rather than per-surface rows — direct DB inspection carried to Q3 (generated-artifact rebuild map). [SOURCE: .skilled/skills/sk-code/SKILL.md:74] [SOURCE: .skilled/skills/sk-code/SKILL.md:183]

### F7 — Measurement anomaly (open)
The exclusion sweep returned 2,129,598 occurrences for `cli[ _-]?opencode|\.opencode` — implausible for source references; likely dominated by a vendored/generated tree or non-ignored content. Do not trust the number until a scoped re-run (Q2 owns it).

### F8 — History precedent
A prior family-wide rename is on record (`sk-code-quality/changelog/v1.1.1.0.md:25`: "names from before the rename"); benchmark transcripts embed past route outputs (`benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:29`). Q5 owns the rewrite-vs-exclude decision. [SOURCE: .skilled/skills/sk-code/sk-code-quality/changelog/v1.1.1.0.md:25]

## Questions Answered

- Q1: Where is the sk-code-opencode identity load-bearing (folder paths, hub registry/router/graph-metadata/SKILL.md, advisor DB and compiled routes, integration code, scripts, tests, fixtures, runtime mirrors), with counts and path:line evidence? — answered by F1–F5; F6 carries the advisor-DB internals to Q3.

## Questions Remaining

- Q2: Which spellings belong to the identity (sk-code-opencode, bare code-opencode, title/snake/path forms), and which match patterns must exclude the OpenCode runtime's own names (.opencode/, cli-opencode)?
- Q3: How are generated artifacts (advisor DB, compiled routes, trigger index, graph metadata, runtime mirrors) rebuilt after a rename, and which tests/drift guards gate it?
- Q4: What ordered, test-guarded rename plan (one verification command per step) moves the surface to sk-code-skilled without breaking routing?
- Q5: How many references sit in history (changelogs, z_archive, research logs, iteration files), and should they be rewritten or excluded?

## Next Focus

Q2 — spellings and exclusion patterns, with concrete next actions: scoped re-run of the exclusion sweep to explain the 2.1M anomaly; bare-form inventory (`code-opencode` paths incl. `.skilled/changelog/sk-code/code-opencode`); snake/title-form extraction from the 15,694-occurrence set; confirm mirror topology beyond `.hermes` (`.devin` / `.claude` / `.codex`).
