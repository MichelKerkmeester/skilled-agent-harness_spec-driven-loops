{"timestamp":"2026-09-11T19:16:35.952Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":63,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
VERDICT: INCOMPLETE — the deep-loop hub is genuinely clean, but the sk-doc parent hub still registers and machine-routes the skill-benchmark family across four registry/router surfaces that no prior iteration searched, so "gone from every surface" remains false as stated.

---

# FINDINGS

## P0 — the sk-doc parent hub still registers and routes the lane family (new surface; prior iterations verified only system-deep-loop's registry trio)

The claim "gone from … its registration in the mode registry, hub router, graph metadata and leaf manifest" holds for `system-deep-loop` (verified clean, see below) — it is false for `sk-doc`, whose equivalent machine artifacts still key `skill-benchmark` and are consumed by the Stage-2 hub router / compiled-routing compile path:

- `.opencode/skills/sk-doc/hub-router.json:302` — `"skill-benchmark"` inside the `create-benchmark-aliases` keyword class (:292–321). A prompt naming "skill-benchmark" is machine-routable to the `sk-create-benchmark` mode.
- `.opencode/skills/sk-doc/mode-registry.json:306` — `"skill-benchmark"` in the `sk-create-benchmark` mode's `aliases` array (:297–318).
- `.opencode/skills/sk-doc/leaf-manifest.json:24,32,33` — the family's leaves still enumerated: `assets/skill-benchmark/skill-benchmark-readme-template.md`, `references/skill-benchmark/serving-snapshot-schema.md`, `references/skill-benchmark/skill-benchmark-storage-guide.md`.
- `.opencode/skills/sk-doc/ROUTER.md:109–112` — the hub's machine-parsed surface router fires "benchmark leaves" on "… skill benchmark" requests; its RESOURCE_MAP block lists the same three lane leaves at :276, :284, :285.

Why this matters: these are exactly the artifact classes the audit asked to test (router, registry, manifest, generated artifact), and the routing chain ends in a dead end — the advisor/hub stage resolves "skill benchmark" toward `/create:benchmark`, whose family prompt still offers option C (`skill_benchmark`) and then stops at the branch-not-registered message (prior finding: `.opencode/commands/create/assets/create-benchmark-presentation.txt:86,90-91`).

Fix options (operator decision, because the retirement packet's recorded Key Decision is "Leave `sk-create-benchmark` alone"): either scope the retirement claim to `system-deep-loop` explicitly, or complete the family retirement — drop the family from `sk-create-benchmark/SKILL.md` FAMILIES, then edit the `sk-doc/ROUTER.md` machine block and regenerate the hub-router/mode-registry/leaf-manifest via the generators (`generate-leaf-manifest.cjs` at `.opencode/skills/sk-doc/sk-create-skill/scripts/`) rather than hand-editing, because sk-doc's leaf manifest is drift-checked. Note the registration is self-perpetuating while the three authoring files survive: regeneration keeps re-listing them.

## P2 — live compiled-routing engine source comments cite the deleted `router-replay.cjs` as their frozen reference

`.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/` — seven live engine files reference the deleted lane tool as "the legacy replay" / "the frozen legacy replay (`router-replay.cjs` …)" in inline comments: `007-sk-doc/lib/registry-compiler.cjs:188,204,216`; `007-sk-doc/lib/router.cjs:196,244`; `001-sk-code/lib/registry-compiler.cjs:207`; `003-mcp-tooling/lib/registry-compiler.cjs:96,244`; `003-mcp-tooling/lib/router.cjs:13`; `002-system-deep-loop/lib/registry-compiler.cjs:275`; `002-system-deep-loop/lib/canary-router.cjs:13,52,243`. No executable path references it — `.opencode/bin` has zero `skill[ _-]skillbenchmark` content matches — so this is name residue in durable-why comments, not breakage. Fix: on the next edit of these files, reword to "the retired legacy replay" or drop the filename; not worth a dedicated commit. (Prior iterations cited `router-replay` in docs/playbooks; the engine-comment location is new.)

---

# CHECKED AND CLEAN (this iteration's own verifications)

**Command surfaces, all five runtimes**
- `.opencode/commands/deep/` contains exactly five commands (agent-improvement, ai-council, model-benchmark, research, review); `.opencode/commands/deep/assets/` has no `deep-skill-benchmark-*` files — the claimed deletion is real, including its `compiled/` and `legacy/` subdirectories (zero lane matches).
- `skill[ _-]benchmark` case-insensitive sweep: `.claude`, `.codex`, `.cursor`, `.devin` → zero matches each; `.pi` → only historical `skill-benchmark-report.*` files under `.pi/extensions/*/benchmark/reports/` (preserved evidence, as claimed); `.github`, `.hermes`, `.skilled` → zero.

**Registries and hub identity (the new ground)**
- All 13 `leaf-manifest.json` files and all `hub-router.json` / `mode-registry.json` / `leaf-aliases.json` files under `.opencode/skills`: only sk-doc carries lane entries (the P0 above). `sk-doc/leaf-aliases.json` is clean.
- All `graph-metadata.json` under `.opencode`: exactly one lane string — `system-deep-loop/graph-metadata.json:113` (`"skill benchmark"`), already on record. sk-doc's graph metadata is clean even in the space spelling; `description.json` and `command-metadata.json` files are clean everywhere.
- `system-deep-loop/mode-registry.json` — 5 modes, `deprecatedModes: []`; `hub-router.json` — 5 signals, tie-break list of 5; `leaf-manifest.json` — 5 modes, no lane leaves. Retention of the lane there is verified absent, not merely unmentioned.

**Deletion claims, verified as absence on disk**
- `deep-improvement/assets|scripts|references|feature-catalog|manual-testing-playbook/skill-benchmark` — absent (sibling listings confirm only agent-improvement/model-benchmark/shared survive).
- `runtime/lib/skill-benchmark-{ledger-schema,reducers,sealed-artifacts}` — absent from `runtime/lib/`.
- `runtime/tests/**/*skill-benchmark*` (incl. `*.vitest.ts`) — zero files.
- `_args.cjs` — no file with that name exists anywhere in the repo; the three surviving requirers are the known sk-doc scripts.
- `deep-improvement/SKILL.md` and `runtime/scripts/` (incl. the modified `append-mode-event.cjs`) — zero lane strings.

**Retrieval corpora (limitation 5 tested, not repeated)**
- Searched `.opencode/skills/system-spec-kit/runtime` for deleted-path shapes — `deep-improvement/<x>/skill-benchmark`, `skill-benchmark-(ledger|reducers|sealed)`, lane vitests: **zero hits**. The only lane paths in `trigger-index.json` (:957,965,966) and `corpus-manifest.json` (:5903) are the surviving sk-create-benchmark authoring files; every lane-named spec path I sampled resolves on disk (`031/011-skill-benchmark-optimize-automation`, `031/016-skill-benchmark-applicability-reporting`, `034-skill-benchmark-codex-executor`, `036/…/007-skill-benchmark/*` with all 7 children, `mcp-tooling/013/010/005-routing-skill-benchmark`). So the corpora index lane *vocabulary* (recorded limitation), not dead *paths* — no dangling index entries.
- Generated-pair consistency: `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json` all carry the same `manifestHash` (`e10deae6…`); the five frozen fixtures pin the older `c0806077…` hash by documented design (`retrieval/README.md:78`). No two-run drift in the committed set.

**Other unreached surfaces now covered**
- `.opencode/agents/` (12 agents, no lane file, zero content matches), `.opencode/scripts/`, `.opencode/hooks/`, `.opencode/manual-testing-playbook/` — clean.
- `.opencode/bin/` — zero lane matches (compiled-routing engine carries no lane string despite the P2 comments).
- Root `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `PUBLIC-RELEASE.md`, `opencode.json`, `.utcp_config.json`, and every `package.json` under `.opencode` — zero matches.
- Over-removal sample: report trees under sk-git, sk-vision, sk-design-diagram, mcp-tooling, cli-external-orchestration and `.pi` retain their full `skill-benchmark-report.{json,md}` pairs; the sk-design-diagram `2026-09-11--…--capture-review-3` capture is intact. Nothing deleted outside the lane was observed.

**Negative results worth recording**: no prefixed/suffixed variant (`deep-skill-benchmark`, `/skill-benchmark`, `skill_benchmark`, `skillbenchmark`, `SKILL_BENCHMARK` path forms) surfaced anywhere beyond: sk-doc registries (new P0), the system-deep-loop graph-metadata phrase (known), the recorded dead-string constants in shared type unions (known, packet limitation 1), packet/changelog/spec history, and preserved reports. The earlier "wrong once" failure mode — the lane registered under its bare, un-prefixed name — is exactly what the sk-doc trio shows; a deep-prefixed search still misses it.

---

# WHAT I COULD NOT CHECK

- **Nothing was executed.** This session is read/grep/find/ls only; every "fails / exits 1" statement above is static load-path or configuration analysis, not an observed run. I could not run the vitest suites, `validate.sh`, `lookup-trigger-index.mjs`, or `parent-skill-check.cjs` to watch the sk-doc hub actually resolve a "skill benchmark" prompt (traced through `hub-router.json` + the documented two-stage contract instead).
- **Gitignored trees** (`node_modules/`, caches) are outside the search tools' reach (they respect `.gitignore`); a stale vendored copy of lane tooling could hide there unseen.
- **Symlink targets**: without a shell I cannot enumerate link targets, so a *broken* symlink pointing at a deleted lane path would be invisible to these checks. No suspected instance in the areas searched.
- **Git history diffing** was unavailable: deletions are verified as absence-from-disk, not provenance. I also did not re-count the "554 preserved reports" myself; I sampled report trees.
- The first repo-wide `find **/*skill-benchmark*` hit the 50 KB output cap (report files dominate); completeness of the "no other lane-named files" claim rests on the scoped follow-up finds (`runtime/tests`, `_args.cjs`, agents, bin, scripts, registries) rather than one exhaustive listing.
- Lineage hygiene note, not a lane finding: `specs/agents/010-repo-rule-system-integration/research/lineages/deprecation-audit/iterations/iteration-004.md` currently contains a single fail-open error record (`{"…","status":"fail_open","errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}`, timestamped 2026-09-11T19:16) from a previous iteration-4 attempt — unexplained by this run, and worth overwriting when this report is saved.
