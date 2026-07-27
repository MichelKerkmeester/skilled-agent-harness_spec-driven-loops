# Iteration 003 — deep-loop runtime and fan-out infrastructure

**Focus:** `.opencode/skills/system-deep-loop/runtime/scripts/`, reducer duplication, broken repo symlinks affecting search.
**newInfoRatio:** 0.75
**Novelty:** Mapped minimally referenced runtime scripts, dual reduce-state entrypoints, and filesystem-loop/broken-symlink hazards under `.opencode/specs/` (outside audit scope but affects tooling).
**Status:** complete

## Findings

### F10 — CAT-1: `append-state-record.cjs` referenced only from deep-review YAML, not research fan-out path
- **Path:** `.opencode/skills/system-deep-loop/runtime/scripts/append-state-record.cjs`
- **Evidence:** Single live workflow reference in `.opencode/commands/deep/assets/deep-review-auto.yaml` (lines ~1533, 1550, 1559); research loop uses inline JSONL append in YAML or agent writes.
- **Proof:** `rg -l 'append-state-record' --glob '*.{yaml,cjs,md}' .opencode/skills/system-deep-loop .opencode/commands | grep -v specs` → only `deep-review-auto.yaml` (+ runtime README if present).
- **Simpler shape:** Shared JSONL append helper invoked from both review and research YAML to avoid parallel write paths.

### F11 — CAT-5: Two `reduce-state.cjs` implementations (deep-research vs runtime review reducer)
- **Path:** `.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`, `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`
- **Evidence:** Both export reducer logic; deep-research version resolves `research/` artifact root; runtime version handles review/alignment modes (`runtime/scripts/reduce-state.cjs:2058` review branch).
- **Proof:** `wc -l` → deep-research ~3162 lines, runtime ~2100+ lines; `rg 'function reduceResearchState' .opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` → present; fanout lineage reduce fails when pointed at lineage dir because resolver expects `{spec}/research/` not `lineages/composer`.
- **Simpler shape:** Single reducer with explicit `artifactDir` override from config (fanout lineages already store `artifactDir` in config).

### F12 — CAT-6: Fan-out salvage/merge script cluster (~17 runtime scripts) with heavy documentation surface
- **Path:** `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs`, `fanout-run.cjs`, `fanout-salvage.cjs`, `fanout-pool.cjs`
- **Evidence:** 17 scripts under `runtime/scripts/`; fanout-merge alone has 1000+ lines of tests in `runtime/tests/unit/fanout-merge.vitest.ts`; feature-catalog enumerates 4+ fanout docs.
- **Proof:** `ls .opencode/skills/system-deep-loop/runtime/scripts/*.cjs | wc -l` → 17; `rg -l 'fanout-salvage' .opencode/skills/system-deep-loop/runtime .opencode/commands | grep -v specs | wc -l` → 10 (mostly docs + fanout-run.cjs).
- **Simpler shape:** Collapse salvage + pool into fanout-run subcommands if salvage is only stdout recovery (see dq-deep JSONL `salvaged_from_stdout` events).

### F13 — CAT-3: Broken symlinks under `.opencode/` break ripgrep and glob (tooling residue)
- **Path:** `.opencode/install-guides/MCP - Chrome Dev Tools.md`, `.opencode/changelog/sk-design/design-audit`, `.opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/system-spec-kit`
- **Evidence:** Grep/rg errors: "No such file or directory" and "File system loop found" during audit searches.
- **Proof:** `test -e '.opencode/install-guides/MCP - Chrome Dev Tools.md'` → fail (broken symlink); `rg --files .opencode/changelog/sk-design/design-audit 2>&1` → No such file.
- **Note:** Specs paths excluded from findings ranking per charter; install-guides symlink captured in F2.

## Dead Ends / Ruled Out
- `codex-dispatch.cjs` dead: referenced from `cli-external-orchestration/hub-router.json` and skill-benchmark scripts.

## Next focus
Skills hub metadata: `mode-registry.json`, `hub-router.json`, compiled-routing activation fences, audit-era semantics.
