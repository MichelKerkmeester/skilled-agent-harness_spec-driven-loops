---
title: "Implementation Summary: Trigger Index Rebuild, Freshness and Build Isolation"
description: "In progress. The code half is built: two exact-path exemptions, sidecars that follow --out, one shared staleness helper behind the save check and a new --check mode, a report-only CI step, and the opt-in --scoring-only lookup flag the Gate 1 line now passes. The index regeneration follows the code commit."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes"
    last_updated_at: "2026-09-27T12:30:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the planning documents. Nothing is built"
    next_safe_action: "Run T001 to reproduce the refused rebuild"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/010-trigger-index-search-fixes/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Score-0 miss shape: option C with the AGENTS.md edit (operator, 2026-09-27)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Trigger Index Rebuild, Freshness and Build Isolation

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-trigger-index-search-fixes |
| **Status** | In Progress |
| **Completed** | Not completed. The code half is built and verified. The code commit and the index regeneration commit are still to come |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The trigger-index rebuild publishes again. The two vendored Deem model cards are exempt by exact path, so a plain build exits 0 with `ignored malformed : 2` where it exited 1 with `refused: 2 document(s)`. A build aimed at a scratch path now leaves every tracked fixture alone. Staleness has one definition, used by the save check and by a new `--check` mode that compares a whole index with the corpus and writes nothing. The owner chose option C for the score-0 miss shape, so the lookup gained an opt-in `--scoring-only` flag and the Gate 1 line passes it. The committed index itself is not rebuilt yet: that is its own commit, after the code commit.

### Trigger Index Rebuild, Freshness and Build Isolation

- **Exemptions.** Two `IGNORED_PATHS` entries in `lib/corpus.mjs` name `MODEL_CARD_08B.md` and `MODEL_CARD_9B.md`, each with the column-0 YAML reason. Both cards are still walked, hashed and reported with `ignored: true`.
- **Sidecar defaults.** `resolveArtifactPaths()` in the generator puts every sidecar not given explicitly beside `--out` when `--out` resolves to anything but the committed index. That covers the diagnostics a refused build writes. With no `--out`, or one that resolves to the committed index, the tracked paths stay.
- **Shared staleness helper.** `lib/freshness.mjs` holds the per-document comparison that used to live inside `checkTriggerIndexFreshness`. The save path calls it through its existing loader and keeps its result shape and messages.
- **`--check`.** The generator walks and reads the corpus as a build does, runs the helper for every document, counts index paths the corpus no longer holds, prints up to 20 examples and a manifest-hash note, and writes nothing. It exits 0 when nothing differs, 1 when anything is stale, obsolete or untrusted, and 2 on a bad invocation or an unreadable index.
- **Placement.** The measurement below selected the report-only CI step in `advisory-checks.yml`.
- **`--scoring-only`.** The lookup drops score-0 rows before the cap when the flag is set, so a miss comes back empty with exit 1. Without the flag nothing changes. The Gate 1 line in the root `AGENTS.md` passes it, and `sync-gate1-pointers.cjs` regenerated the two pointer blocks.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Modified | Two exact-path exemptions |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/freshness.mjs` | Created | The one staleness comparison |
| `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` | Modified | Save check calls the shared helper |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modified | Sidecars follow `--out`, and the `--check` mode |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modified | Opt-in `--scoring-only` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts` | Modified | Eight new cases: three sidecar, two `--check`, three `--scoring-only` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modified | Documents the sidecar rule and `--check` |
| `.github/workflows/advisory-checks.yml` | Modified | Report-only `--check` step |
| `.github/workflows/README.md` | Modified | Names the new step |
| `AGENTS.md` | Modified | Gate 1 line passes `--scoring-only` |
| `.codex/AGENTS.md`, `.cursor/rules/skill-routing.md` | Modified, generated | Pointer blocks follow the Gate 1 line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every build, `--check` and measurement wrote to a scratch directory outside the repository, and `git status --short` on the fixtures and `runtime/data` printed nothing after each. The refusal was reproduced first with the same scratch build that later proved the exemption. `dist` was rebuilt with the package's own `npm run build` after the `workflow.ts` change. Nothing is committed yet: the orchestrator makes the code commit, then stage B regenerates the index from a `git archive` of that commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Plan-time decisions PD-1 to PD-8 live in `plan.md` section 3 | They were fixed before the build |
| PD-4 verdict: report-only CI step, not a per-lookup warning | Cold-lookup `summary.p95Ms` was 92.087 ms (`measure-cold-lookup.mjs --out $SCRATCH/latency.json --json`, exit 0, 36 samples). Five in-process path-only `walkCorpus` runs over 22,974 files took 1,751.1, 1,587.5, 1,159.2, 1,231.3 and 1,449.6 ms, a p95 of 1,751.1 ms. The sum, 1,843.2 ms, is over the 200 ms rule |
| The staleness helper caches one path-to-phrases inversion per index object | A whole-corpus check calls it once per document. Rescanning every posting per call would cost the phrase count times the document count |
| `--check` rejects `--manifest`, `--diagnostics`, `--variants` and `--allow-malformed` with exit 2 | It writes nothing, so accepting them would let a caller believe they took effect |
| `--scoring-only` filters before the cap | Filtering after it would let score-0 rows take limit slots and then vanish |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Refusal before the fix | Scratch build exit 1, `refused: 2 document(s)`, both card rows `non-yaml-frontmatter` |
| Exemption | Scratch build exit 0, `ignored malformed : 2`, both rows `ignored: true` |
| `--out` alone | Exit 0, three sidecars beside `idx.json`, tracked fixture sha256 unchanged |
| `--check` | Committed index exit 1 with 130 stale (all missing) and 0 obsolete, matching the independent path-table count. Fresh scratch index exit 0. `--check --bogus` exit 2 |
| Suites | `trigger-index.vitest.ts` 49 before, 57 after. `workflow-trigger-index-freshness.vitest.ts` 7 and 7. `gate1-pointer-sync.vitest.ts` 4 and 4. Nine retrieval suites together 245 passed. `tsc --noEmit` rc 0 |
| `--scoring-only` live | "cli-classifier hub": default 20 rows at score 0, `truncated: true`, exit 0. With the flag, 0 rows, exit 1 |
| Pointer sync | Write mode `Wrote 2 of 2`, `--check` PASS, exit 0 |
| Comment hygiene | `check-comment-hygiene.sh` exit 0 on each changed `.mjs` and `.ts` file. A scratch control with a task id exited 1 |
| Not yet run | The regeneration, `--check` against a `git archive` of the final HEAD, and the "deem local server" lookup against the rebuilt index |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Index not rebuilt yet.** The committed index still lacks 130 documents until the regeneration commit lands.
2. **Agent copies of the lookup command.** Several agent definitions under `.skilled/agents/`, `.claude/agents/`, `.codex/agents/`, `.pi/agents/` and `.hermes/skills/` quote the lookup without `--scoring-only`. They still work, because the default is unchanged, but they print score-0 rows on a miss. They were outside this phase's write scope.
3. **Dead exemption.** The older `deepseek.extracted.md` entry in `IGNORED_PATHS` names a folder that no longer exists and shows in `ignoredPathsUnmatched`. It was outside this phase's scope.
4. **Symlinked `--out`.** An `--out` that reaches the committed index through a symlink compares as elsewhere, so its sidecars would land in `runtime/data/`. `path.resolve` covers relative and `..` spellings only.
<!-- /ANCHOR:limitations -->
