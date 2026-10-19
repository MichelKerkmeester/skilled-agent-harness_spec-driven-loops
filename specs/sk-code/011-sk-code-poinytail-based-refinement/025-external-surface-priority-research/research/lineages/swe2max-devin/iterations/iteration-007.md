# Iteration 7: Q11 — outside-hub references to the obsidian/webflow example surfaces

## Focus
Q11 asked which hubs, tooling, CI, mirrors, catalogs, playbooks, batteries and release-engine
rules outside the two example packets assume `sk-code-obsidian`/`sk-code-webflow`, and what the
end-to-end external-user flow hits. Method: broad `rg -il 'webflow|obsidian'` across `.skilled/`,
`.github/`, `.claude/`, `.codex/`, `.devin/`, `.cursor/`, `.hermes/`, `.opencode/`, `.pi/`, root
docs (~150 files, mostly collisions), then a precise `rg -ln 'sk-code-obsidian|sk-code-webflow'`
pass for the true dependents, then a delete-and-run probe in throwaway COPY_A
(`/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/r2copies/swe2max-devin-i7-a`).

## Actions Taken
1. `rg -il 'webflow|obsidian'` over `.skilled .github .claude .codex .devin .cursor .hermes .opencode .pi AGENTS.md README.md`, excluding the two example packets — ~150 hits; dominant noise classes identified.
2. `rg -ln 'sk-code-obsidian|sk-code-webflow'` same scope — the true dependent set (hub internals + a small outside-hub set).
3. `rg -il 'webflow|obsidian' .github .devin .cursor .codex .claude` — exit 1, zero hits.
4. Line-level greps of every outside-hub precise hit (tests, fixtures, manifests, plugin, mirrors, doctor scripts).
5. COPY_A probe: `test_readme_manifest.py` baseline (exit 0) → `rm -rf` both example packets → rerun (exit 1) → `compiled-route-surface-hint.test.cjs` post-delete (6/6 pass) → `routing-registry-drift.yml` trigger-path read.

## Findings
| class | claim | evidence | P |
|---|---|---|---|
| BREAK | Deleting the two example packets makes the CI-wired repo-walking test `test_readme_manifest.py` fail: the frozen durable-directory manifest enumerates `.skilled/skills/sk-code/sk-code-obsidian` and nine `sk-code-webflow/*` dirs. Observed in COPY_A: exit 0 before, exit 1 after `rm -rf`, output `frozen durable-directory manifest is not reproducible (added: none; removed: .skilled/skills/sk-code/sk-code-obsidian, .skilled/skills/sk-code/sk-code-webflow, ... 8 more webflow subdirs)`. The failure message itself names the fix: `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write`. | `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:367,386-394`; `.skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py:20-26` (`--write` rebuilds via `build_durable_manifest`); `.github/workflows/sk-doc-script-tests.yml:4`; COPY_A `BASE_EXIT=0`/`DEL_EXIT=1` | P1 |
| PRESENCE | `.opencode/plugins/system-skill-advisor.js` `detectWorkspaceSurface` hardcodes the surface vocabulary and detection order `OPENCODE > OBSIDIAN > WEBFLOW` from workspace markers (hub root → OPENCODE; `manifest.json` `minAppVersion`/`esbuild.config.mjs` → OBSIDIAN; `src/2_javascript`/`wrangler.toml` → WEBFLOW) and is the only place the function exists. An external user's own surface can never receive a workspace surface-hint; after the examples are deleted, marker-shaped workspaces still emit OBSIDIAN/WEBFLOW hints, which resolve through the stale compiled map (silent recommendation of deleted packet paths) until re-mint, then are ignored (unknown names change nothing). | `.opencode/plugins/system-skill-advisor.js:692-707`; `rg -ln 'detectWorkspaceSurface'` → single hit; `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:79-82` | P1 |
| PRESENCE | The surface-hint test battery is hard-pinned to the example ordering — `['sk-code-skilled','sk-code-webflow']` (:65), `['sk-code-webflow','sk-code-skilled']` (:72), `['sk-code-webflow','sk-code-obsidian']` (:76), `['sk-code-review','sk-code-webflow','sk-code-skilled']` (:89) — but mints its own temp activation manifest from the authored routing source (:31-33), so it does NOT break on dir deletion alone: observed 6/6 pass post-delete in COPY_A. It fails only when authored routing inputs drop the surfaces, i.e., inside the R1/R4 edit itself. | `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:31-33,65,72,76,89`; COPY_A `==HINT-TEST==` 6 pass 0 fail | P2 |
| ORDER | `routing-registry-drift.yml` is the authoritative CI gate for compiled-routing freshness ("Pairs with the local drift-guard test; this is the authoritative gate… blocks compiled-routing freshness drift: editing a hub's routing inputs"), watching `.skilled/bin/compiled-route*` and `.opencode/bin/compiled-route*` paths. Surface-dir deletion is not visibly inside its path filter, so delete-alone may not trip it, but every authored routing-input edit (the R1/R4 fixes) lands under this gate. | `.github/workflows/routing-registry-drift.yml:5-12,62-65` | P1 |
| DOC | Root `README.md:800` advertises "Three ready surfaces: WEBFLOW … OPENCODE … OBSIDIAN" — the first doc an external user reads asserts the examples ship ready-made. | `README.md:800` | P1 |
| DOC | `.skilled/skills/README.txt:60` skills index describes sk-code's "read-only SURFACE evidence packets (sk-code-webflow, sk-code-skilled)" (obsidian already absent) — stale once examples go. | `.skilled/skills/README.txt:60` | P2 |
| DOC | `check-markdown-links.cjs:73` carries a hardcoded historical allowlist entry under a `sk-code-webflow` path — harmless for a gone path but cements the example in repo tooling. | `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs:73` | P2 |
| DOC | `playbook-failclosed-allowlist.txt:33,37` special-cases the two example `manual-testing-playbook` dirs — stale entries post-delete; whether the checker asserts listed paths exist (would break) or merely exempts them (harmless) was not opened. | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt:33,37` | P2 |
| DOC | `create-skill-parent-confirm.yaml:171` teaches `surface_packet_naming: "bare noun, no prefix (e.g. webflow)"` — encodes the example idiom in authoring guidance; harmless functionally. | `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:171` | P2 |
| OK | `.hermes/skills/sk-code*/SKILL.md` are generated copies ("generated by sync-skills-hermes.cjs; do not edit"); no `sk-code-obsidian`/`sk-code-webflow` mirror files exist, so the mirror set never breaks — only the hub mirror's prose goes stale until re-sync. | `.hermes/skills/sk-code/SKILL.md:63-64`; precise-hit list | OK |
| OK | `/doctor:update` release engine has zero surface references: `keep-local` decisions are class-based (`file.class === 'local-only' || 'kept-local' → 'keep-local'`); the only doctor-assets hit is `mcp-mutation-class-manifest.yaml:80-87` for the unrelated `mcp-obsidian` product. | `.skilled/commands/doctor/scripts/release-update.cjs:1283`; `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:80-87` | OK |
| OK | Advisor batteries/corpora use "webflow"/"obsidian" as product keywords, not skill ids — regression fixture expects `mcp-code-mode` for `"fetch webflow cms collection"`; `skill-graph.json:1` is generated (`generated_at`) with hub-level signals only. | `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl:14`; `routing-accuracy/holdout-prompts.jsonl:32`; `runtime/scripts/skill-graph.json:1` | OK |
| OK | Zero `webflow|obsidian` hits across `.github/workflows/` (28 yml files), `.devin/`, `.cursor/`, `.codex/`, `.claude/` — no CI job, install guide, or mirror folder names the examples. | `rg -il 'webflow|obsidian' .github .devin .cursor .codex .claude` → exit 1, no output | OK |
| OK | Collision classes that do NOT assume the sk-code examples: `mcp-tooling/mcp-obsidian` (~40 files, the Obsidian-notes MCP leaf incl. `obsidian-note-management.md` and durable-manifest entries :344-348), `sk-design-md-generator` `bundles/webflow` brand-style bundle, `*/benchmark/reports/compiled-routing/*.json` historical reports, all changelogs. | broad `rg -il` file list; `mcp-mutation-class-manifest.yaml:80-87`; `durable-directory-manifest.json:344-348` | OK |
| PRESENCE | Generated artifacts embed the surface names and go stale until regenerated: `system-spec-kit/runtime/data/trigger-index.json` (rebuilt by `trigger-index-rebuild.yml`), `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` (generated closure; iteration 5 already ruled it re-mint-owned), `mcp-tooling` hub generated files. | `trigger-index.json`; `canary-cases.v1.json`; `.github/workflows/trigger-index-rebuild.yml` | P2 |
| BREAK→DOC | End-to-end external-user flow after `clone → rm -rf` the two packets: (a) the first repo-walking test or CI run fails on the durable manifest and its own message names the one-command fix (`--write`); (b) routing still serves the stale compiled map, so a "webflow …" prompt recommends resources under deleted paths with NO error — the silent mislead; (c) the workspace surface-hint can never name the user's own surface (vocabulary is the example set). The "delete examples" checklist step for the manifest collapses to one existing command, `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write`. | COPY_A probe output; `.opencode/plugins/system-skill-advisor.js:692-707`; `test_readme_manifest.py:20-26` | P1 |

## Options / Recommendations
| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
|---|---|---|---|---|
| Add the manifest refresh to the R3 delete runbook as one line: `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write` | `spec`/docs only; regenerates `durable-directory-manifest.json` | one doc line + one generated-file refresh | none observed; `--write` derives deterministically (`build_durable_manifest`, test:21-23) | Hand-editing the manifest JSON — drifts from the derived truth the test reproduces |
| Generalize `detectWorkspaceSurface` to read the live surface set from `mode-registry.json`/`hub-router.json` instead of the hardcoded OPENCODE > OBSIDIAN > WEBFLOW order | `.opencode/plugins/system-skill-advisor.js:695-707` | plugin change + cache semantics | runs before every uncached advisor call (:693 "only cheap root markers are read") — extra I/O on a hot path | Deleting the OBSIDIAN/WEBFLOW branches — a user in a genuinely Webflow-shaped workspace then loses a legitimate hint; hardcoding the example vocabulary is the defect, not the branches |
| Re-word README.md:800 + README.txt:60 to mark the surfaces as examples | two doc lines | trivial | none | Covered by R4 — no new option needed |

## Ruled Out
- Broad `rg 'webflow|obsidian'` as the dependent set — ~150 hits dominated by `mcp-obsidian` (a different product), the `sk-design` webflow brand bundle, and changelogs; the operative signal is the precise `sk-code-obsidian|sk-code-webflow` pattern.

## Dead Ends
- Searching `.github/`, `.devin/`, `.cursor/`, `.codex/`, `.claude/` for surface names — zero hits; CI and those mirror folders are clean by name (the CI coupling is indirect, via repo-walking tests and the drift guard).

## Edge Cases
- Missing dependencies: none blocking; COPY_A served the destructive probe.
- Partial success: `playbook-failclosed-allowlist.txt` semantics (exempt vs require-exists) not opened — recorded as P2 DOC with the caveat named.
- Ambiguity: "runtime mirror folders" interpreted as `.hermes/` + `.opencode/plugins/`; `.opencode` plugin proved authored-in-place, not a copy (single `rg` hit for `detectWorkspaceSurface`).

## Questions Answered
- Q11: What other hubs, tooling, CI, mirrors, catalogs, playbooks, batteries or release-engine rules assume the obsidian and webflow examples, and what does the end-to-end external-user flow hit?

## Questions Remaining
- Q12 (rejected ideas X1-X9 re-challenge) — untouched this iteration.

## Sources Consulted
- `.opencode/plugins/system-skill-advisor.js:686-722`
- `.skilled/bin/tests/compiled-route-surface-hint.test.cjs:1-95`
- `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json:344-394`
- `.skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py:1-45`
- `.github/workflows/sk-doc-script-tests.yml:4`; `.github/workflows/routing-registry-drift.yml:1-78`
- `.skilled/skills/README.txt:53-60`; `README.md:800,873-882,1308`
- `.skilled/commands/doctor/scripts/release-update.cjs` (zero surface hits; `keep-local` :1281-1283)
- `.hermes/skills/sk-code/SKILL.md:53-64`
- `skill-advisor-regression-cases.jsonl:14`; `holdout-prompts.jsonl:32`; `skill-graph.json:1`
- COPY_A probe outputs (`BASE_EXIT=0`, `DEL_EXIT=1` + failure text, hint test 6/6 pass)

## Assessment
- New information ratio: 0.80
- Questions addressed: Q11
- Questions answered: Q11 (dependent-set enumerated by category; one observed break; two latent breaks; rest harmless or doc-level)

## Reflection
- What worked: splitting broad-vs-precise `rg` immediately separated ~150 product-name collisions from ~20 true dependents; the COPY_A probe converted "might break" into an observed exit-1 with the exact user-facing message.
- What did not: the first broad scan was too noisy to classify directly; the precise pattern was needed first.
- Different next time: check the allowlist checker's direction (exempt vs require) with one read of the consumer before recording.

## Recommended Next Focus
Q12 — re-challenge rejected ideas X1-X9 against the new evidence (esp. whether "delete examples" breaks were previously underestimated given the observed durable-manifest failure).

## Scope Violations
None — all writes stayed inside the lineage packet; the only mutation (`rm -rf` of the two example packets) ran inside throwaway COPY_A at the literal dispatcher-provided path.
