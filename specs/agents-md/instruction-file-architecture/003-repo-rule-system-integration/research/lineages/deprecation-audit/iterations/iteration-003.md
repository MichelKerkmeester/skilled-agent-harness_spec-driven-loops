{"timestamp":"2026-09-11T19:06:29.164Z","runtime":"claude","status":"ok","freshness":"live","durationMs":2092,"cacheHit":false,"skillLabel":"mcp-tooling"}
Audit complete. Here is the consolidated verdict from all four iterations, with this iteration's new findings marked **NEW**.

---

# Verdict: the retirement is real at the hub layer, but incomplete everywhere else — and it currently breaks a CI gate

The hub's own registry surfaces are genuinely clean (five modes, no lane). But the claim "gone from every surface that could reach it" is **false**: lane links inside a no-baseline CI link check are broken **right now**, a hub-owned drift checker fails its own lane-count assertion on the live tree, several live docs still teach the deleted harness, and authoring surfaces still generate it into new files.

## Method and constraint

- This session has **read/grep/find/ls only — no shell**. Everything below is static: path-existence checks, load-path tracing, source reads. Where a failure follows from code paths (e.g., "the guard exits 1"), that is stated as code-path analysis, **not an observed run**.
- Iterations 1–2's full reports live at `specs/agents/010-repo-rule-system-integration/research/lineages/deprecation-audit/` (`prior-findings.md`, `iterations/iteration-001.md`, `iteration-002.md`).

## What is genuinely clean (claims that hold)

| Claim | Verdict |
|---|---|
| Command entry points gone across runtimes | ✔ verified: `.opencode/commands/deep` (5 commands only), `.claude/commands/deep`, `.pi/prompts`, `.codex/prompts`, `.cursor/commands` |
| Mode registry / hub router / leaf manifest / command metadata | ✔ `mode-registry.json` 5 modes, empty `deprecatedModes`; `hub-router.json` 5 signals; both manifests 5 modes |
| Advisor + command-bridge artifacts regenerated | ✔ `system-skill-advisor` subtree has zero matches; advisor projections clean |
| Script tree / fixture corpus / typed ledger libs deleted | ✔ absence proven: `deep-improvement/{references,scripts,assets}/skill-benchmark`, `runtime/lib/skill-benchmark-*` do not exist |
| Historical reports preserved | ✔ no over-removal found (see §5) |
| `check-markdown-links` clean / `command-catalog-mirror-check` passing | ✘ **broken — see §2** |

## 1. Reachability — lane still resolvable from live surfaces

- **`.opencode/commands/create/assets/create-benchmark-presentation.txt:86`** still offers `C) skill_benchmark`; selecting it dead-ends at the branch-not-registered message. **NEW.**
- **`sk-doc/sk-create-benchmark`** teaches Lane C end-to-end: `SKILL.md` (FAMILIES at :111–112, `SKILL_BENCHMARK` intent :120, RESOURCE_MAP :146–148, :486, :646–650, :668), `README.md`, `scripts/README.md`, `manual-testing-playbook/benchmark-families/author-lane-c-index.md`. **NEW.**
- **`sk-doc/SKILL.md:31`** advertises the family: "Author MCP-promotion, behavior, skill-benchmark, and model-benchmark packages". **NEW.**
- **`sk-doc/sk-create-command/assets/command-contract.json:276`** lists `/deep:skill-benchmark` as a live deep-namespace alias. **NEW.**
- **`init_skill.py` ×2** (`.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py:126–132`, `sk-doc/scripts/init_skill.py:130`) still scaffold a `benchmark/README.md` whose RUNNING A BENCHMARK block invokes the deleted `run-skill-benchmark.cjs` — the retirement regenerates itself into every new skill. **NEW.**
- **Hub `graph-metadata.json:113`** still carries the derived trigger phrase `"skill benchmark"` (lastUpdated 2026-07-14, predating retirement); `ci-skill-derived-freshness.cjs` cannot catch it (authored field). **NEW.**
- Live typed-ledger residue the retirement left behind: `deep-improvement-common-reducer.ts:695–702` initializes a `skill-benchmark` status row (4 modes incl. retired); `deep-improvement-common-projection-schema.ts:95,101` enums; `shipped-census.ts` `007-skill-benchmark` with import-census evidence pointing at deleted `run-skill-benchmark.cjs`/`d4-ablation.cjs`; `graph.ts:63` migration edge; `legacy-projection-manifest.ts:178–180`; sealed-artifact/ledger/blinded-adjudication types.

## 2. Dangling references — including 25 live broken links that fail CI today

**P0 (NEW): `.github/workflows/markdown-link-integrity.yml` → `check-markdown-links.cjs` runs whole-repo over `.opencode/skills/**` with no baseline, exits 1 on any broken link, and triggers on PRs touching those roots. The retirement left 25 broken links across 9 files:**

- **To deleted `.opencode/commands/deep/skill-benchmark.md`** (5): `sk-code/benchmark/README.md:145`, `sk-prompt/benchmark/README.md:71`, `sk-doc/benchmark/README.md:63`, `cli-external-orchestration/benchmark/README.md:63`, `sk-create-benchmark/references/skill-benchmark/skill-benchmark-storage-guide.md:231`.
- **To deleted `deep-improvement/references/skill-benchmark/**`** (20): `sk-create-benchmark/SKILL.md:668` (scoring-contract + build-report), `serving-snapshot-schema.md:211,212,213,223` (×4), `skill-benchmark-storage-guide.md:52,53,138,172,227,228,229,230,248` (×9), `sk-create-manual-testing-playbook/SKILL.md:309`, `sk-doc/benchmark/README.md:62`, `sk-prompt/benchmark/README.md:70`, `cli-external-orchestration/benchmark/README.md:62`, `cli-external-orchestration/cli-claude-code/benchmark/README.md:60`.

All targets verified absent on disk; none are in the guard's narrow template allowlist. Code-path analysis: guard exits 1.

**Non-link dangling references** (inline code/plain text — not CI-red, still misleading): deleted `run-skill-benchmark.cjs` instructed in `sk-communication/benchmark/README.md:37`, `sk-vision/benchmark/README.md:53,82`, `mcp-tooling/benchmark/README.md:13,44`, `sk-doc/sk-create-manual-testing-playbook/SKILL.md:285`, `sk-design-fundamentals/benchmark/README.md:37`, `sk-design-chart` playbook :51–52, compiled-routing bundle docs :73/:54; deleted `router-replay.cjs` in `mcp-tooling` mcp-refero/mobbin/figma SKILL.md, `cli-external-orchestration/ROUTER.md:79`, `mcp-tooling/ROUTER.md:84`; `sk-code/ROUTER.md:311` claims a deleted drift guard "keeps this block honest"; `alignment-verification-automation.md:112` calls the deleted suite "the equality authority"; `compiled-routing-architecture.md:66` names the deleted parity harness. **NEW (several).**

**Load-broken scripts** (static): `render-serving-snapshot.cjs` throws `MODULE_NOT_FOUND` at load (top-level require of deleted `compiled-routing-parity.cjs`); `archive-compiled-routing.cjs` same (+ lazy `_args.cjs` :222); `validate-compiled-routing-scenarios.cjs:387–390` crashes only on CLI invocation.

## 3. Broken dependents

- **`runtime/scripts/check-documentation-drift.cjs:116` requires `counts.lanes === 3`; the live registry computes `lanes = 2` → the checker now FAILS on the live tree.** **NEW.** Nothing invokes it — no test, no workflow (only its own README row) — so it is latent, but any manual run errors, and its documented job is exactly lane-count drift.
- `shipped-census.ts` `SHIPPED_MODE_CENSUS` is consumed by a passing vitest at ~25 call sites; nothing validates its `007-skill-benchmark` source paths against disk.
- Plugin tests `plugins/tests/system-deep-loop-guard.test.cjs:37` and `claude-task-dispatch-guard.test.cjs` still build fixture registries containing `skill-benchmark`. **NEW detail:** they are hermetic (temp-dir fixtures), so they stay green — stale coverage, not red tests — and no workflow runs them (no `node --test .opencode/plugins/tests` in `.github/workflows`).

## 4. Counts and indexes — stale claims verified in live docs

- `system-deep-loop/SKILL.md:120` "three improvement lanes"; `:131` "beyond the six registered".
- `system-deep-loop/README.md:62`, `runtime/lib/README.md:12` "three improvement lanes".
- **`feature-catalog/feature-catalog.md:15` says "seven `workflowMode` packets (research, review, ai-council, alignment, and the three improvement lanes)"** — two retirements stale; `:35` still claims ROUTER.md "supports router-replay benchmarking" (capability deleted). **NEW.**
- `deep-review/README.md:176` "Runs … across three lanes: agent improvement, model benchmark and skill benchmark". **NEW.**
- Root `README.md:428` "three co-equal lanes … giving six `/deep:*` loop commands in total"; `:944` "model/skill benchmarking". **NEW (line :428).**
- `BARTER.md:497` (stale vendored framework copy) lists `/deep:skill-benchmark`.
- No changelog entry records the retirement; `changelog/v3.0.0.0.md` still records the pre-retirement six-mode registry.
- Updated correctly: `.opencode/commands/README.txt` deep row = 5; `command-catalog-mirror-check` (group counts, coverage, metadata) would pass.

## 5. Over-removal — none found

554 preserved `skill-benchmark-report.{json,md}` files under other skills' `benchmark/reports/` resolve locally; `sk-create-benchmark` assets/references, packet 034, changelogs, and `.pi` historical reports are intact. The failure mode is under-editing of dependents, not over-deletion.

## 6. Generated artifacts

- Regenerated advisor/command-bridge surfaces: clean and internally consistent.
- **Hub `graph-metadata.json` was NOT regenerated** (stale `"skill benchmark"` trigger phrase, `lastUpdated 2026-07-14`) — the packet's "graph metadata registration removed" claim is false; freshness gates don't flag authored fields.
- `leaf-manifest.json` verified consistent against the tree (sampled all five modes); `ci-leaf-manifest-freshness` not broken.

## Caveats and what I could not do

- **No commands were executed** (no exec tool). `validate.sh`, vitest suites, and both CI gates are assessed by code-path analysis; treat "exits 1" as "will exit 1 when run".
- Test-suite red/green status for the sk-doc Python suites and runtime vitests is static analysis only (e.g., `test_readme_verdict_parity.py`/`test_readme_manifest.py` are statically broken; not in CI).

**Bottom line:** SC-002 ("no skill-benchmark reference outside deliberately preserved surfaces") is not satisfied; the correct status of `specs/system-deep-loop/047-deprecate-skill-benchmark/` is "hub registry clean, dependents unretired" — led by the 25 CI-failing dead links, the 2-lane mismatch in `check-documentation-drift.cjs`, and the still-generating `init_skill.py` scaffold.
