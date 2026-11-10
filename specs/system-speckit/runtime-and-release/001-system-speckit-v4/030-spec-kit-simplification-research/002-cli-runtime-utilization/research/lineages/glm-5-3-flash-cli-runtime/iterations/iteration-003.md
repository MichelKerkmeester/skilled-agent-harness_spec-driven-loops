---
title: "Iteration 3: Save Pipeline Stage 1 — continuity/ + core/ Against the Decommission"
trigger_phrases: []
---
# Iteration 3: Save Pipeline Stage 1 — continuity/ + core/ Against the Decommission

## Focus

The declared core of the package (package.json:4 "context generation and continuity management"; package.json:6 main = dist/continuity/generate-context.js): what the save path actually executes, where the three documented gate layers (ARCHITECTURE.md:182,195; ADR-006) run, and which continuity/core stages survived the memory decommission (ADR-001, ARCHITECTURE.md:148-166).

## Actions Taken

1. Listed continuity/ (9 files) and core/ (29 files); extracted every import of continuity/generate-context.ts (lines 15-35) — the admitted production surface.
2. Programmatically counted real usage of the 8 barrel symbols (core/index.js) inside generate-context.ts.
3. Traced the conduct: workflow.ts → find-predecessor-memory.ts + post-save-review.ts; read post-save-review.ts's own import surface (lib/memory-telemetry, lib/trigger-phrase-sanitizer, types/save-mode, utils/logger, find-predecessor).
4. Repo-wide caller search (commands, bin, hooks, plugins, workflows, plus tests and docs) for the 7 non-entry continuity/ files and the 6 untouched core/spec-root-* modules.
5. Read the /speckit:save command mechanics (speckit-plan-auto.yaml:696-701; speckit-implement-confirm.yaml:632-635) and the daemon-detect/quality-scorer/validate-memory-quality headers.

## Findings

1. `commands/speckit/assets/speckit-plan-auto.yaml:696-701` — declared: a "post_save_indexing" step whose command is generate-context.js and whose own note reads "Nothing else runs after it... no indexing handoff, no daemon to wait for". Observed: the three-layer save gate (ARCHITECTURE.md:182: intake validation → content router → post-save quality review) is REAL and wired, but all three layers execute inside ONE process — generate-context.ts:15-35 (intake: validateFilePath from @spec-kit/shared/utils/path-security at :15, schema via @spec-kit/runtime/api :16, duplicate detection via workflow→find-predecessor) → core/workflow.ts (conductor; references post-save-review.ts and the spec-root guards) → core/post-save-review.ts:1157L (imports only lib/memory-telemetry, lib/trigger-phrase-sanitizer, types/save-mode, utils/logger, find-predecessor). No second invocation, no indexing. The YAML key name "post_save_indexing" is decommission residue in the one surface operators read. Severity P2. Recommendation: fix the key/label (e.g. post_save_write) in the command YAMLs.

2. `continuity/rank-memories.ts` (440L) — declared: the "ranking CLIs" of continuity/ (cli/README.md:53). Observed callers: NONE-FOUND in code — references are 2 READMEs (skills/README.md, continuity/README.md), 1 sk-code conventions doc, and itself; absent from BOTH scripts-registry.json and the live validator-registry.json (grep: NOT-FOUND); the /speckit:search command (now the ripgrep-recipe lane, 001 packet) does not reference it. A 440-line ranking subsystem wired to nothing. Severity P1. Recommendation: remove (after the iteration-9 dynamic-import sweep).

3. `continuity/fix-memory-h1.mjs` + `continuity/ast-parser.ts` (65L pair) — declared: one-off memory-H1 fixer and its helper. Observed: fix-memory-h1's only references are 2 READMEs; its sole dependant, ast-parser.ts (49L), is imported by nothing else (intra-continuity grep: only fix-memory-h1). They are dead together. Severity P1. Recommendation: remove both, and drop the 2 README lines with them.

4. Dual quality scorers plus a dispatched-by-nothing shim — extractors/quality-scorer.ts is canonical ("Prefer scoreMemoryQuality from extractors/quality-scorer.ts", core/quality-scorer.ts:123); core/quality-scorer.ts (367L) exports its own scoreRenderQuality (:140) and reports "Scores the quality of generated memory files" (:4) — production callers: NONE-FOUND (rg over core/continuity/extractors/loaders/lib/spec-folder: empty); the duplication is acknowledged and test-pinned by tests/quality-scorer-disambiguation.vitest.ts — a test that exists to manage the duplication. Alongside: continuity/validate-memory-quality.ts (66L) — self-described "re-export shim... serves as the CLI entry point" of ../lib/validate-memory-quality.ts — dispatched by NEITHER registry (validator-registry: NOT-FOUND; scripts-registry: NOT-FOUND), so its documented CLI role has no registered consumer. Severity P1. Recommendation: merge — collapse the scorers into the extractors/ canonical, delete the shim, retire the disambiguation test.

5. `core/spec-root-*` governance cluster (collision-classifier 170L, fallback-telemetry 48L, fixtures 239L, migration 360L, migration-manifest 248L, registry 180L — 1245L, 6 of 29 core files, 43% of non-review core LOC) — declared: spec-roots resolution, collision, and migration governance (core/README.md). Observed: production-wired ONLY through spec-root-write-guard.ts (39L, imported by generate-context.ts:28) and workflow.ts; every module's external reference profile is test-dominated (refs 1-4, of which tests 1-3); no command, hook, plugin, or workflow names any of them. Substantial trust-entry infrastructure beneath the save path, exercised in production by exactly two hunks of glue. Severity P2. Recommendation: document the two-entry-hole wiring explicitly; the 005-overengineering packet tracks the weight.

6. `continuity/` migration-era residents — backfill-frontmatter.ts (620L; 4 references, tests+docs), backfill-research-metadata.ts (284L; 8), migrate-trigger-phrase-residual.ts (625L; 1) — declared: backfill/residual-migration utilities (their MODULE headers; continuity/README.md). Observed: no wired caller anywhere; they are retained one-shot machinery inside the production tree. Severity P2. Recommendation: document their already-ran/keep-for-recovery status, or remove once their last migration is confirmed consumed.

7. CORRECTION to iteration-2 finding f-iter002-006 — `continuity/generate-context.ts:34` imports `../spec/is-phase-parent.js`: the 200L near-duplicate IS production-wired. Updated verdict: the SAVE path (this import) and the VALIDATION gate (engine orchestrator → runtime/lib/spec/is-phase-parent.ts) detect phase parents through two different TypeScript implementations that drift by 208 diff lines, agree on the enforced regex /^[0-9]{3}-[a-z0-9][a-z0-9-]*$/, and both disagree with the documented ^[0-9]{3}-[a-z0-9-]+$ (engine header comment:6; MODULE-MAP; the command contract speckit-implement-auto.yaml:80). Severity P2. Recommendation: merge — one detection, one import seam; the drift risk is now realized on both the heaviest write path and the heaviest read gate.

## Positive Controls (verified, not findings)

- All 8 barrel symbols imported from core/index.js are actually used (CONFIG×23, SPEC_FOLDER_PATTERN×14, getSpecsDirectories×8, SPEC_FOLDER_BASIC_PATTERN×2, findActiveSpecsDir×2, findChildFolderSync×2, getSessionScopedSaveContextExample×1, CATEGORY_FOLDER_PATTERN×1) — no barrel-cargo-cult at the entry.
- `cli/config/index.ts` ("Config Barrel", :5-8) is a deliberate dependency-inversion seam — 5 extractors + core/subfolder-utils import '../config' so extractors need not reach into '../core'. Alive by design; NOT duplication. Note: core/config.ts:4 reads "JSONC config" while cli/config/ ships only README+index.ts — the referenced JSONC file's location: UNKNOWN (low stakes; the CONFIG object clearly defaults safely given 23 uses with no I/O errors).
- `core/daemon-detect.ts:3-5` documents its own post-decommission justification: "The save path owns no background service any more, so the only remaining caller is the workflow save lock" — imported at core/workflow.ts:104 (isProcessAlive) and used for flock liveness. Runs, 24L, necessary. The decommission's cleanest survivor.

## Questions Answered

- Q2 (partial): the three documented save-gate layers ALL still execute (intake schema+dedup → router → post-save review), single-process, via workflow.ts. What remains for Q2 is the extractors/ half (iteration 4): which of the 13 extractors the save path pulls, and whether any extractor stage is inert. The decommission left the 3 layers intact; the residue concentrates in the non-entry files (rank-memories, fix-memory-h1+ast-parser, the migration trio, the shim).

## Questions Remaining

- Q1 callers for the remaining directories; Q2 second half (extractors/); Q3 other lanes' parity; Q4 zero-caller entries beyond these; Q5 codex/pi/mirrors/evals; Q6 framing + ../lib + shared duplication.

## What Worked / What Failed

- Worked: reading the ENTRY POINT'S import list as the boundary of "wired" — every liveness question downstream became a grep.
- Worked: the daemon-detect/validate-memory-quality/quality-scorer MODULE headers — the package's own residue documentation settled three verdicts without inference.
- Failed: none; no approach exhausted.

## Ruled Out

- "The post-save review layer runs as a separate command" — the command YAMLs name generate-context.js alone and say nothing else runs (speckit-plan-auto.yaml:699).
- "core/config.ts vs cli/config/ is accidental duplication" — config/ is the documented inversion seam with 7 importers.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:15-35] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/core/index.ts:8-25] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts:104] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/core/post-save-review.ts:11-27] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/core/quality-scorer.ts:4,50-51,123,140,359] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/continuity/validate-memory-quality.ts:1-4] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/core/daemon-detect.ts:3-5] [SOURCE: .opencode/commands/speckit/assets/speckit-plan-auto.yaml:696-701] [SOURCE: .opencode/commands/speckit/assets/speckit-implement-confirm.yaml:632-635] [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:148-166,182,195] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/README.md:53] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/config/index.ts:5-8]

## Next Iteration

Iteration 4: the save pipeline, stage 2 — extractors/ (13 files, 5893L) + loaders/ (3) + renderers/ (3) + templates/ (3): which extractors collect-session-data actually invokes, whether any extractor stage is inert post-decommission, and the declared-vs-actual split between session/spec-folder/file extraction.
