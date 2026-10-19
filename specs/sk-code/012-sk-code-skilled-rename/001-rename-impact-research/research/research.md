---
title: "Research: renaming the sk-code-opencode surface to sk-code-skilled"
description: "Five-iteration deep research (cli-devin, DeepSeek V4.1 Flash Max) mapping every spelling and load-bearing reference of the sk-code-opencode surface, the generated artifacts and guards a rename must rebuild, and an ordered, test-guarded rename plan."
trigger_phrases:
  - "sk-code-skilled rename research"
  - "sk-code-opencode rename impact"
importance_tier: "normal"
contextType: "research"
---

# Research: renaming the sk-code-opencode surface to sk-code-skilled

<!-- ANCHOR:deep-research-sk-code-skilled-rename -->

## 1. Answer

The rename is mechanical but not a blind search-and-replace. The name lives in two forms that both need renaming: the prefixed `sk-code-opencode` (the packet folder, the hub `mode-registry.json` key and every path) and the bare `code-opencode` (the hub-router routing classes, the changelog alias symlink, benchmark ids and test fixtures). The compiled-routing runtime holds no literal of its own: it reads the hub JSONs at route time, so renaming the registry entries changes the compiled policy without a code change. Three runtime mirrors (`.opencode/skills`, `.claude/skills`, `.devin/skills`) are symlinks into `.skilled/skills` and follow the folder rename for free. Only `.hermes/skills/` holds materialized copies, and it is re-synced, not hand-edited. The one match pattern that is unsafe is any pattern built on the bare `opencode` token, because `.opencode/` and `cli-opencode` must stay. About 92% of all line references sit in history (specs, archives, research logs, changelogs). The research recommends keeping that history unchanged, which conflicts with the operator's request to rename every markdown reference; see §12.

## 2. Scope and Method

- Five iterations on `deepseek-v4-1-flash-max` through the `cli-devin` single-executor path, stop policy `max-iterations`. Every iteration passed `verify-iteration.cjs` (narrative, delta and route proof) on the first dispatch.
- Each iteration ran read-only ripgrep sweeps, file reads and directory listings in worktree `.worktrees/144-sk-code-skilled-rename`. No dispatch printed a write-containment advisory, and `git status` after the run shows changes only inside this packet plus the track-root child list in `specs/sk-code/graph-metadata.json`, which packet creation wrote.
- The orchestrator re-checked these claims directly before synthesis: `hub-router.json:38` carries the three `code-opencode-*` classes; `parent-skill-check.cjs:1163` pins `SK_CODE_NATIVE_SURFACE = 'sk-code-opencode'`; `.skilled/changelog/sk-code/code-opencode` is a symlink to `../../skills/sk-code/sk-code-opencode/changelog`; `.opencode/skills`, `.claude/skills` and `.devin/skills` are symlinks to `../.skilled/skills`; the `advisor_rebuild` invocation matches its feature-catalog leaf; the advisor SQLite DB contains the string `code-opencode` (a raw `strings` match, which also covers the prefixed form), so it needs the rebuild.

## 3. Q1: Where the identity is load-bearing

| Surface | Evidence |
|---|---|
| Packet folder `.skilled/skills/sk-code/sk-code-opencode/` (SKILL.md, README, 14 checklists, 8 scripts, benchmark reports, changelog, drift-guard runner and tests) | [SOURCE: .skilled/skills/sk-code/SKILL.md:165] |
| Hub routing JSONs: `mode-registry.json` (5, 19, 79, 88, 89), `hub-router.json` (7, 36, 38, 39, 79), `graph-metadata.json` (230, 250-253, 278, 282), `leaf-manifest.json` (114-115), `description.json` (47) | [SOURCE: .skilled/skills/sk-code/mode-registry.json:79] [SOURCE: .skilled/skills/sk-code/hub-router.json:7] [SOURCE: .skilled/skills/sk-code/graph-metadata.json:250] [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:114] [SOURCE: .skilled/skills/sk-code/description.json:47] |
| Sibling packets that load the packet by relative path: `sk-code-quality/SKILL.md` (34 matches, e.g. 69, 107-112, 122-127), `typo-flags.test.sh:17`, `sk-code-review/SKILL.md` (39, 42, 499), `review-core.md:68`, `sk-code-webflow/README.md:94` | [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:69] [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh:17] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:39] |
| Doctor literal pins: `sk-code-setup-check.cjs:59`, `parent-skill-check.cjs:1159,1163` and its invariants test (489-514) | [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:59] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1163] [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:491] |
| Compiled-route pins: the surface-hint test (65, 72, 89, 112) and the promoted sk-code canary fixture (10 matches) | [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:65] [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json:122] |
| Packet verifiers and tests: `verify-router-sync.cjs` (33, 232, 261-265), `router-replay-lib.cjs` (495, 611, 628), `verify-doc-claims.cjs:68`, `scripts/tests/*` | [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:261] [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/router-replay-lib.cjs:495] |
| Materialized mirror `.hermes/skills/`: 7 files, 53 matching lines | [SOURCE: .hermes/skills/sk-code-opencode/SKILL.md:2] [SOURCE: .hermes/skills/sk-code-quality/SKILL.md:20] |
| Advisor: routes the hub identity `sk-code`; surface packets are advisor-invisible by design, but the DB stores the indexed hub graph, which names the surface | [SOURCE: .skilled/skills/sk-code/SKILL.md:74] |

Counts: 137 non-spec files name `sk-code-opencode` (107 markdown, 14 json, 10 cjs, 2 txt, 2 jsonl, 1 yaml, 1 sh), and 43 non-spec files carry the bare form. The case-insensitive family sweep matches 2,378 files, 2,229 of them under `specs/`.

## 4. Q2: Spellings, and what every pattern must exclude

| Family | Form | Live carriers |
|---|---|---|
| Prefixed kebab | `sk-code-opencode` | Packet folder, hub keys, paths, mirrors |
| Bare kebab | `code-opencode` | Routing classes `code-opencode-aliases`, `code-opencode-runtime`, `code-opencode-authoring`; changelog alias symlink; benchmark ids; test fixtures [SOURCE: .skilled/skills/sk-code/hub-router.json:38] |
| Spaced lowercase | `sk code opencode` | Generated retrieval artifacts only: 47 trigger-index keys, 13 phrase-variants entries [SOURCE: .skilled/skills/system-spec-kit/runtime/data/trigger-index.json:111848] |
| Snake | `CODE_OPENCODE_DIR` | One shell constant in the drift-guard runner [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:23] |
| Camel | `codeOpencode` | One local const in the router verifier [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:261] |
| Qualified | `sk-code:code-opencode` | Verifier mapping concept; one old changelog note [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify-router-sync.cjs:232] |

The bare form shares the identity: it is the surface packet's routing id and its changelog alias, not leftover history. It takes the name `code-skilled`.

Names that must not change: the `.opencode/` runtime alias directory, the `cli-opencode` executor skill, and the standalone runtime brand and id `opencode` / `OpenCode` / `OPENCODE` [SOURCE: .skilled/skills/system-spec-kit/shared/review-research-paths.cjs:70] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs:53].

Safe match patterns: `sk-code-opencode` exact; `(^|[^k_-])(?:sk-)?code-opencode`; and the family alternation `sk[_-]?code[_-]?opencode|code[_-]?opencode|codeopencode|sk code opencode`. Every identity form puts `code` directly before `opencode`, and no runtime name does. Unsafe: a bare `opencode` token, a `-opencode` suffix, `\.opencode`, or `OPENCODE` alone. Path rule: a path such as `.opencode/skills/sk-code/sk-code-opencode` keeps its `.opencode` segment and renames only the last segment.

## 5. Q3: Rebuild machinery and guards

| Artifact | Rebuild | Guard |
|---|---|---|
| Compiled routes | Regenerate from the hub JSONs through the `compiled-route-sync.cjs` toolchain; the runtime chain reads `mode-registry.json` and `hub-router.json` at route time [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/harness/build-artifacts.cjs:52] | `compiled-route-guard.cjs`, `compiled-route-status.cjs`; CI `routing-registry-drift.yml` warn-only |
| Advisor DB (`runtime/database/skill-graph.sqlite`) | `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true` [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-rebuild.md:26] | `advisor_status` fresh with a new generation; `advisor_recommend` probe |
| Trigger index | `generate-trigger-index.mjs` | `generate-trigger-index.mjs --check --json` (0 fresh, 1 stale) [SOURCE: .skilled/commands/doctor/_routes.yaml:56]; CI `trigger-index-rebuild.yml` repairs after push [SOURCE: .github/workflows/trigger-index-rebuild.yml:3] |
| Graph metadata | `graph-metadata-parser.ts` refresh path; `migrate-generated-json.ts` | `GENERATED_METADATA_DRIFT` validation rule |
| Runtime mirrors | `sync-runtime-mirrors.cjs`; `hermes/sync-skills-hermes.cjs` for the one materialized mirror | `check-agent-mirror-sync.cjs` |
| Packet drift guards | No rebuild; they resolve paths from the script's own location, so a folder move re-points them [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:22] | `run-all-drift-guards.sh`: four guards, warnings never fail, any FAIL exits non-zero [SOURCE: .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh:80] |

The promoted compiled-routing closure regenerates from an authored program under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`, whose `compiled/` outputs name the surface [SOURCE: .skilled/bin/lib/compiled-routing/serving-closure.manifest.json:3]. Those outputs regenerate through `buildArtifacts()` and are not hand-edited. The generator's `.opencode/skills` root sentinel is a runtime path and stays.

## 6. Q4: The ordered rename plan

Each step has one verification command. Phase 002 owns steps 0-9 and phase 003 owns steps 10-11.

0. Baseline: `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0. Save the live reference list and the `rg -n "\.opencode/|cli-opencode"` result for the exclusion audit.
1. Move the folder: `git mv .skilled/skills/sk-code/sk-code-opencode .skilled/skills/sk-code/sk-code-skilled`. Verify: `test -f .skilled/skills/sk-code/sk-code-skilled/SKILL.md`.
2. Hub surface: `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `leaf-manifest.json`, `description.json` and the sk-code `SKILL.md` mode tables. Verify: `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs --checks 1a,1b,2,3,4`.
3. Bare alias family: the three routing classes, the verifier's mapping constant, and the `.skilled/changelog/sk-code/code-opencode` symlink, which is re-pointed to a new `code-skilled` link. Verify: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`.
4. Packet verifiers, tests and fixtures, plus sibling references in `sk-code-quality`, `sk-code-review` and `sk-code-webflow`. Verify: the drift-guard run, then `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/`.
5. Doctor pins in `sk-code-setup-check.cjs` and `parent-skill-check.cjs`, with their tests. Verify: `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs`.
6. Compiled routes: regenerate, update the surface-hint test and the canary fixture. Verify: `compiled-route-guard.cjs` exits 0 and `compiled-route-status.cjs` reports fresh.
7. Advisor: `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true`. Verify: `advisor_status` shows a new generation, and an sk-code framework prompt routes to `sk-code-skilled`.
8. Mirrors: `sync-runtime-mirrors.cjs` and the hermes skill sync. Verify: `check-agent-mirror-sync.cjs` exits 0 and `.hermes/skills/sk-code-skilled/` exists.
9. Trigger index: regenerate. Verify: `generate-trigger-index.mjs --check --json` exits 0, and a lookup for `sk-code-skilled` returns rows.
10. Markdown sweep with a safe pattern from §4, over the scope the operator chooses in §12. Verify: the same `rg` returns no hit inside that scope.
11. Exclusion audit and final gate: the `.opencode/` and `cli-opencode` result is unchanged against the baseline, and `validate.sh specs/sk-code/012-sk-code-skilled-rename --recursive --strict` reports `RESULT: PASSED`.

Step 7 must run after step 2. The advisor indexes the hub graph, so a rebuild before the hub JSONs change republishes the old name.

## 7. Q5: History counts

| Bucket | Matching lines |
|---|---|
| Whole repo | 11,282 |
| `specs/` | 10,371 (of which `z_archive/` 2,508, `research/` 1,954, `iterations/` 1,356) |
| `.skilled/` | 852 (skills 816, of which the packet itself 162 and its changelog 45; bin 14; commands 14; `.skilled/changelog` 6) |
| `.hermes/` | 53 |

Method: `rg -c --hidden` per-file line counts summed by bucket. ripgrep does not follow the symlinked mirror trees, so they count 0 here, which is correct: they are the same files as `.skilled/skills`.

History, meaning specs and changelogs, is about 10,400 lines, or about 92%. The live non-spec layer is about 900 lines.

## 8. Recommendations

1. Rename both identity forms: prefixed to `sk-code-skilled`, bare to `code-skilled`.
2. Use only the safe patterns in §4. Never match on the bare `opencode` token.
3. Run phase 002 in the §6 order. Rebuild the advisor, compiled routes, mirrors and trigger index with their own tools rather than editing generated files by hand.
4. History: the research recommends excluding changelogs, `z_archive/`, research logs and iteration files from the sweep, because they record what was true when written. That conflicts with the operator's instruction to rename every markdown reference, so it is the operator's decision (§12). If the operator keeps the instruction, the sweep still skips `.jsonl` state logs, ledgers and benchmark JSON reports, which are machine records rather than markdown.
5. Treat the generated retrieval fixtures (`trigger-index.json`, `phrase-variants.json` and its sidecars) as rebuild targets, not history.

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration |
|---|---|---|---|
| Global replace on `opencode` or `-opencode` | Collides with `.opencode/`, `cli-opencode` and the runtime id | §4 exclusion corpus | 3 |
| Editing the compiled-routing runtime code | The closure carries no literal; it reads the hub JSONs at route time | `.skilled/bin` sweep: 14 matches, all in one test and one fixture | 2 |
| Hand-editing `.opencode/`, `.claude/`, `.devin/` mirrors | They are symlinks to `.skilled/skills` | `ls -la` on each | 2 |
| Hand-editing generated artifacts (advisor DB, trigger index, compiled outputs) | Each has a rebuild command and a drift check that would flag hand edits | §5 | 4, 5 |
| Trusting the first exclusion-pattern count (2.1M occurrences) | Unscoped and history-dominated; replaced by scoped reruns | Iteration 1 F7, iteration 3 | 1, 3 |

## Divergence Map

- Saturated directions: none recorded.
- Pivots taken: none; the run used `convergenceMode: default` with stop policy `max-iterations`.
- Remaining frontier: uppercase-kebab and mixed-separator spellings were not isolated. The case-insensitive family sweep bounds them, and no carrier was observed.

## 12. Open Questions

- **History scope is the operator's decision.** The request says every markdown reference is renamed. The research recommends keeping history unchanged: about 1,196 spec markdown files, the changelogs and the archives. Choose one before phase 003: (a) rename every markdown file, history included; (b) rename live docs only and keep history.
- **Old trigger phrases.** Should the 47 `sk code opencode ...` trigger-index keys be dropped on rebuild, or kept as aliases so old prompts still route?
- **Compiled-route flag forms.** Step 6 cites the toolchain by path. Its exact flags were not re-read, so phase 002 confirms them with each script's `--help` before running.
- **A reducer defect to raise separately.** In iteration 4 the rendered next focus still named Q2 after Q2 was resolved; the leaf noticed and worked on Q3. This is outside this packet's scope.

## 13. References

- `research/iterations/iteration-001.md` through `iteration-005.md`
- `research/resource-map.md`
- `research/deltas/iter-001.jsonl` through `iter-005.jsonl`

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: Q2 spelling census and exclusion patterns (0.60); run 4: Q3 rebuild machinery and drift guards (0.62); run 5: Q4 rename plan and Q5 history counts (0.80)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

<!-- /ANCHOR:deep-research-sk-code-skilled-rename -->
