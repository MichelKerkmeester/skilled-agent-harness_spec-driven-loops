{"timestamp":"2026-09-11T19:22:54.596Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":58,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
# Skill-Benchmark Retirement — Adversarial Audit, Iteration 5

**VERDICT: INCOMPLETE** — the lane still resolves from live docs, engine comments and generator help text, and, worse, one cross-skill run report the retirement was claimed to preserve is missing from the tree.

---

## FINDINGS

### P0-1 — A preserved-evidence run folder for mcp-tooling is missing; every index that referenced it still points at the void
**What is wrong.** `mcp-tooling`'s `2026-07-16--after-routing-remediation--router` run (7 files: `README.md`, `failed-runs.md`, `findings-and-recommendations.md`, `results.csv`, `skill-benchmark-report.json`, `skill-benchmark-report.md`, `source.md`) was a git-*tracked* run under `.opencode/skills/mcp-tooling/benchmark/reports/`. It is absent from the working tree today. Its same-date sibling `baseline/` (also 2026-07-16) survives, as do every other hub's report corpora. The lane-retirement claim says historical reports of other skills were "deliberately preserved"; this one was not.

**Evidence.**
- Tracked-and-present: `specs/system-speckit/028-memory-search-intelligence/001-release-cleanup/017-findings-remediation/002-repo-hygiene-and-residue/workers/devin-02-F5.md:191-197` — `git ls-files … ':(exclude)…/.gitkeep'` lists all seven `reports/2026-07-16--after-routing-remediation--router/*` files; `:264-265` counts them into 40 tracked files; `:267-268` shows that session's only change was `D .gitkeep`; `:291-292` "STATUS: APPLIED". The same log's listing (`:16-22`) omits the two `2026-08-03` runs that exist today — so the folder was already tracked before those later runs landed.
- Absent now: `ls .opencode/skills/mcp-tooling/benchmark/reports/` → `2026-08-03--playbook-validation--live/`, `2026-08-03--playbook-validation--router/`, `baseline/`, `compiled-routing/`, `README.md` — no `after-routing-remediation*`; `find .opencode/skills/mcp-tooling -pattern "**/after-routing-remediation*"` → no files.
- Still indexed/pointed at as live: `.opencode/skills/mcp-tooling/benchmark/README.md:25` (verdict table row, PASS 98) and `:30` (describes the run); `.opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:85` (points at `benchmark/2026-07-16--after-routing-remediation--router/`); spec evidence trails `specs/mcp-tooling/011-routing-remediation/tasks.md:85`, `implementation-plan` `implementation-summary.md:72`, `specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md:180`, `plan.md:174` — all cite the path as the stored PASS verdict.
- It was meant to be durable: `specs/sk-doc/021-benchmark-naming-and-playbook-results/assets/reports-move-map.json:29-30` and `rename-map.json:29-30` record it being *moved into* `reports/` (not purged); `specs/sk-doc/020-hyphen-naming-convention/000-worktree-baseline-and-census/baseline/census/symlink-mode-manifest.json:8240,8250` records the two report files in the tracked census.
- Prior iterations never saw this: a case-insensitive grep for `after-routing` across the entire `specs/agents/010-repo-rule-system-integration/research/lineages/deprecation-audit/` tree (prior-findings + iterations 1–4 + prompts) returns **zero** matches. Iterations 2 and 4 both did presence-only over-removal checks ("a `find` … returned a full corpus … no emptied owner tree" — `iterations/iteration-002.md:56`; `iteration-004.md:53`) that cannot detect a missing folder while siblings remain. Also note the hub README's §2 table additionally omits the two existing `2026-08-03` runs that `benchmark/reports/README.md:27-28` does index — the hub README is stale in both directions.

**Fix.** Restore the seven files from git history (they were tracked, so recoverable) and refresh `mcp-tooling/benchmark/README.md`'s §2 table; or, if the deletion was deliberate, obtain the removal rationale, then update all five referencing surfaces. Attribution caveat: I cannot read git history (no shell), so I cannot prove the retirement sweep deleted it rather than a later pass — but it is exactly the brief's named over-removal risk, the deletion is bounded to after the F5 session, and no surviving doc records it.

### P1-1 — `sk-doc`'s hub benchmark README instructs re-running via a live host that no longer knows the mode
**What is wrong.** `.opencode/skills/sk-doc/benchmark/README.md:43-52` documents re-running as
`node …/deep-improvement/scripts/shared/loop-host.cjs --mode=skill-benchmark …`. `loop-host.cjs` now defines `VALID_MODES = new Set(['agent-improvement','model-benchmark'])` (`:40`) and `resolveMode` warns *"unknown mode 'skill-benchmark', defaulting to 'agent-improvement'"* (`:113-118`). The agent-improvement plan then requires `--candidate`, which the documented command does not pass (`:166-168`), so the run stops with `agent-improvement: missing required --candidate=<path>` (`:184-197`, exit 2). The documented re-run cannot succeed and fails misleadingly — a live path with a retired mode (code-path analysis; not executed). Prior coverage cited this README's dead links (`:62-63`) but not this run block.

**Fix.** Replace the block (and its "Expected result: a `verdict=` line…" promise at `:52`) or reinstate the mode on `loop-host.cjs` if runs are wanted.

### P1-2 — mcp-tooling benchmark README's hub count is stale (7 claimed, 9 registered)
**What is wrong.** `.opencode/skills/mcp-tooling/benchmark/README.md:13` ("seven-mode hub"), `:17` ("seven-mode hub (four workflow modes, including mcp-obsidian, plus three transports)") and `:28` ("The current hub has seven modes: four workflows plus three transports") do not match the hub's own single source of truth: `mode-registry.json`'s `modes` array enumerates **nine** modes — five `workflow` (mcp-chrome-devtools `:31`, mcp-click-up `:65`, mcp-aside-devtools `:99`, mcp-obsidian `:244`, mcp-notion `:298`) and four `transport` (mcp-figma `:134`, mcp-refero `:172`, mcp-mobbin `:208`, mcp-magicpath `:340`; the transports extension list at `:20-25` also shows four).

**Fix.** Update the three claims to nine modes (5 + 4). The registry itself is clean — this is doc drift in the surviving lane index, not registry drift.

### P2-1 — Deleted `load-playbook-scenarios.cjs` is still cited as a live authority by three live files
- `.opencode/skills/sk-doc/sk-create-skill/scripts/validate-playbook-topology.cjs:86` — a live validator's comment calls it "the proven parser for this same corpus shape".
- `.opencode/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:577` — "The Lane C scenario loader skips any feature file … silently absent from the benchmark" (a benchmark that no longer runs).
- `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/manual-testing-playbook.md:29` — describes its `EMPTY_PLAYBOOK` behavior as current and says scenarios "are run by hand and persisted through the runner named below" — a grep of that packet for `run-skill|scenario-persistence|wrapper|benchmark harness` finds **no runner named below**; the pointer dangles.
- Deletion confirmed: `find .opencode -pattern "**/load-playbook-scenarios*"` → no files.

**Fix.** Reword to describe the surviving typed-gold gate; decide explicitly whether routing-gold frontmatter (`expected_intent`/`expected_resources`, still parsed by the topology gate at `:150`) remains a live contract, since the loader that consumed it for scoring is gone.

### P2-2 — Live engine comments justify the compiled-routing default-on by the deleted Lane C parity — and one says "seven" where the tree says five
- `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:29-33`: "All seven compiled-eligible hubs are verified compiled-serving (Lane C parity: … 0 drift) …" — the deleted lane provides the live justification, and the count is wrong: `DEFAULT_ON_HUBS` (`:34-40`), `014-runtime-engine/lib/compiled-route.cjs:30-36` (`HUB_CHILD`), `009-parent-hub-rollout/` (children 001-004, 007) and `013-live-activation/activation/` each enumerate **five** hubs. The archived sweep describes the flip as "all 7 hubs" (`sk-doc/benchmark/reports/compiled-routing/2026-07-21--benchmark-sweep--r3/report.json:140`), so a 7-hub roster existed historically; two are gone without the comment being touched.
- `.opencode/bin/lib/compiled-route-manifest.cjs:480`: "the identical cached snapshot the runtime engine and Lane C parity already compute".
- This pinpoints iteration 4's previously uncited P2 and adds the "Lane C" spelling — `.opencode/bin` had only been swept for `skill-benchmark`-family strings, so these two were missed by that spelling scope. (The `router-replay.cjs` comment set under `009-parent-hub-rollout/…` was already on record.)

**Fix.** Correct the comment to five (or restore the two), and restate the parity basis in the past tense.

### P2-3 — The parent-hub scaffolder's help text teaches the dead parity gate (both copies)
`.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py:865-871` and the second copy `.opencode/skills/sk-doc/scripts/init_skill.py:864-871`: `--compiled-routing ready` "does NOT make the hub compiled-serving. The hub still needs its own shadow-child router built to route == legacy and pass **Lane C parity** before it can join the runtime's compiled-serving cohort" → pointing at `compiled-routing-architecture.md`, itself citing the deleted `compiled-routing-parity.cjs` (`:66`). Every new parent-hub scaffold shows an unachievable onboarding gate. (The benchmark-README block at `:126-132`/`:130` was previously on record; the help text was not.)

**Fix.** Reword the help text to the surviving acceptance path (or reinstate the parity tool).

### P2-4 — Residual lane memory in live surfaces (new instances of recorded classes)
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/cache/grader/8f1323b05b3fd805dc519983d68b2e9d.out.md:2` — committed grader cache whose evidence cites the deleted `scripts/skill-benchmark/d4-ablation.cjs`. Purge the cache directory from the repo.
- `.opencode/skills/sk-vision/benchmark/README.md:60,81` — "node the retired scenario-persistence wrapper" placeholder instance not in the previously listed set (`:53,:82` were recorded; `:60` command and `:81` REFERENCE row are the new lines).
- `.opencode/commands/deep/assets/deep-model-benchmark-presentation.txt:222` — "existing **Lane B/C** defaults are unchanged": a live command asset using the lane-letter spelling; with skill-benchmark retired, "C" has no live referent (may be shorthand; worth a one-word fix).
- Present-tense "Lane C parity" claims as live verification: `sk-code`, `sk-doc` and `mcp-tooling` `feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md:20`; `sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md:9`; `mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:27` ("the sk-doc shape the Lane-C skill-benchmark loader reads").

---

## CHECKED AND CLEAN

- **`.opencode/commands` full-tree, case-insensitive `skill[ _-]?benchmark` sweep**: exactly one hit — the known `create/assets/create-benchmark-presentation.txt:86`. The live `create-benchmark-{auto,confirm}.yaml` family router binds only `mcp_promotion` and STOPs for other families; `.opencode/commands/deep/` (bodies + `assets/`, `assets/compiled/`, `assets/legacy/`) carries zero lane strings besides the `Lane B/C` line above.
- **`.github` sweep (broader than prior)**: `router-replay|run-skill-benchmark|archive-compiled-routing|skill-benchmark|Lane C` → zero matches. No CI path executes deleted lane tooling.
- **`.opencode/plugins` source** (not only tests): zero lane strings. `system-deep-loop-guard.js` holds no mode allowlist with the lane; only the hermetic tests (`plugins/tests/system-deep-loop-guard.test.cjs:37,111,125`, `claude-task-dispatch-guard.test.cjs:49,168,185`) still fabricate it — status unchanged from prior record.
- **`deep-improvement/scripts/**`**: `loop-host.cjs` clean (`VALID_MODES` = 2 modes; `loop-host.vitest.ts` exists and does not pin the lane); the whole subtree's only lane hit is the cache file above. `materialize-benchmark-fixtures.cjs`, `run-benchmark.cjs`, scorers all present and lane-free.
- **`validate-playbook-topology.cjs`** is self-contained and live: requires only `lib/leaf-resource-contract.cjs` and `@spec-kit/shared/frontmatter/parse-frontmatter.js`; its test (`scripts/tests/validate-playbook-topology.test.cjs`) imports the module, not the deleted loader — the loader reference is comment-only.
- **`.opencode/skills/system-skill-advisor`**: "five lanes" hits are the advisor's scorer lanes (distinct vocabulary), not lane C.
- **False positives killed**: `mcp-aside-devtools/README.md:42` "Lane Capability Layer" and `SKILL.md:199` "Lane Comparison" are CLI-vs-MCP transport lanes, not skill-benchmark.
- **mcp-tooling registry honesty**: no lane entries; the hub count issue is confined to the README (P1-2).
- **sk-doc report tree intact**: `sk-doc/benchmark/reports/` holds only `compiled-routing/` and its archived runs — consistent with its README's "no Lane C run archived" statement; nothing removed.
- **sk-doc hub leaf manifest**: the three lane-named leaves (`assets/skill-benchmark/skill-benchmark-readme-template.md`, `references/skill-benchmark/serving-snapshot-schema.md`, `-storage-guide.md`) resolve to the surviving sk-create-benchmark packet, so the manifest is internally consistent (still the sk-doc P0 of iteration 4, unchanged here).
- **Negative results worth recording**: no shell runner, workflow, plugin or command outside docs reaches the deleted scripts; `after-routing-remediation` appears *nowhere* in the lineage's prior findings (new surface, F1); the F5 log proves the `.gitkeep` cleanup was the *only* change that session made under `benchmark/`.

## WHAT I COULD NOT CHECK

- **No shell in this session**: every "fails/exits" statement is code-path or load-path analysis, not an observed run — loop-host fallback (P1-1), gate behaviors, and the vitest suites were traced, not executed.
- **Git history is unreadable**: I cannot date or attribute the deletion of the mcp-tooling run folder (P0-1). The only git evidence available is the `git ls-files` transcript embedded in the F5 worker log; whether the seven files were deleted in a committed change, which commit, and by which packet/lineage remains unverified.
- **Byte-level generated-pair equivalence** (e.g., regenerating `sk-doc/leaf-manifest.json` via `buildManifestBytes`) needs node execution; content-level consistency was checked instead.
- **The 300-match `Lane C` sweep truncated inside preserved `cli-external-orchestration` report fixtures** — live-file coverage of that spelling is complete for the directories I enumerated, but the tail of that sweep was report-corpus noise I did not exhaust.
- **Gitignored trees** (`node_modules/`, caches) remain outside the search tools' reach.
