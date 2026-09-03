---
title: "Iteration 004 — Lifecycle hooks + context-injection envelope"
trigger_phrases: []
---
# Iteration 004 — Lifecycle hooks + context-injection envelope

**Status:** insight · **Findings:** 5 · **newInfoRatio:** 0.66 · **tokens:** 95251 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(xhigh) read-only

---

## Mechanism

OpenLTM wires five lifecycle surfaces: `SessionStart`, `UpdateContext`, `EvaluateSession`, `PreCompact`, and opt-in `GitCommit`; docs describe startup injection, session-stop progress save, session-stop pattern extraction, compaction snapshotting, and post-commit diff learning (`docs/06-hooks.md:13`, `docs/06-hooks.md:24`, `docs/06-hooks.md:38`). Project identity is resolved by exact registry match, longest prefix, then cwd-derived slug, with fallback context files deciding whether a project is “new” (`hooks/lib/resolveProject.ts:5`, `hooks/lib/resolveProject.ts:118`, `hooks/lib/resolveProject.ts:140`).

The injection envelope is deliberately bounded. `SessionStart` caps restored summary to 60 lines, LTM memories to 30 lines, conflicts to 5, and ignores summaries older than 30 days (`hooks/src/SessionStart.ts:17`, `hooks/src/SessionStart.ts:20`, `hooks/src/SessionStart.ts:198`). It uses the first 500 chars of `context-summary.md` as semantic query context, retrieves global memories with `minImportance:4, limit:16` and project-scoped memories with `minImportance:2, limit:15`, optionally adds graph insights, then emits a compact status header plus directive, LTM block, conflict block, reminder, and backfill hint (`hooks/src/SessionStart.ts:37`, `hooks/src/SessionStart.ts:52`, `hooks/src/SessionStart.ts:224`, `hooks/src/SessionStart.ts:237`). Core context export also budgets per section: GOAL 10, PROGRESS 20, DEC 15, WATCH 15, using “last lines plus omitted count” truncation (`packages/openltm-core/src/context.ts:30`, `packages/openltm-core/src/context.ts:39`, `packages/openltm-core/src/context.ts:139`).

`PreCompact` is a durable markdown checkpoint. It first exports from DB, assembling goal/progress/decision/gotcha sections with fixed line budgets, then falls back to the four legacy markdown context files if DB export fails or DB is absent (`hooks/src/PreCompact.ts:12`, `hooks/src/PreCompact.ts:23`, `hooks/src/PreCompact.ts:29`, `hooks/src/PreCompact.ts:39`). It always writes the final snapshot to `context-summary.md` (`hooks/src/PreCompact.ts:56`, `hooks/src/PreCompact.ts:61`).

`UpdateContext` reconstructs the transcript path, parses JSONL, records either modified files from `Write`/`Edit`/`MultiEdit` or a read-only session line, writes to DB if available, and falls back to trimming `context-progress.md` to 20 lines (`hooks/src/UpdateContext.ts:88`, `hooks/src/UpdateContext.ts:101`, `hooks/src/UpdateContext.ts:116`, `hooks/src/UpdateContext.ts:128`, `hooks/src/UpdateContext.ts:138`).

`EvaluateSession` is a candidate-memory extractor, not only a logger. It skips sessions below 5 messages, extracts assistant text capped to the last 8000 chars, captures up to 10 errors and tool counts, writes a daily learned-pattern markdown file, converts up to 3 error blocks into `gotcha` proposals, and optionally asks an LLM for decisions/gotchas/patterns/progress (`hooks/src/EvaluateSession.ts:20`, `hooks/src/EvaluateSession.ts:98`, `hooks/src/EvaluateSession.ts:146`, `hooks/src/EvaluateSession.ts:190`, `hooks/src/EvaluateSession.ts:219`, `hooks/src/EvaluateSession.ts:223`, `hooks/src/EvaluateSession.ts:240`). The LLM prompt enforces max 5 items per class under 120 chars, and proposal files are JSON with `generatedAt` (`hooks/lib/llmExtract.ts:8`, `hooks/lib/llmExtract.ts:14`, `hooks/lib/proposalQueue.ts:11`, `hooks/lib/proposalQueue.ts:14`).

`GitCommit` is opt-in backfill. It exits unless `ltm.gitLearnEnabled` is true, skips repos with `.ltmignore`, truncates diffs to 4000 chars, ignores lock/dist/minified patterns, requires a default 200-char post-filter diff, then spawns a detached extractor so git is never blocked (`hooks/src/GitCommit.ts:10`, `hooks/src/GitCommit.ts:24`, `hooks/src/GitCommit.ts:75`, `hooks/src/GitCommit.ts:117`, `hooks/src/GitCommit.ts:132`, `hooks/src/GitCommit.ts:138`). Unlike `EvaluateSession`, commit extraction calls `extractAndLearn` directly with source `git-commit:<hash>` and file tags (`hooks/src/GitCommit.ts:88`, `hooks/src/GitCommit.ts:96`, `hooks/lib/llmExtract.ts:50`, `hooks/lib/llmExtract.ts:61`).

## Teachings for system-spec-kit

- **Claim** · Add a persisted PreCompact markdown snapshot as a low-tech fallback beside the richer hook cache · **Evidence** · `hooks/src/PreCompact.ts:56`, `hooks/src/PreCompact.ts:61` · **Maps-to** · compact hook + spec-folder continuity ladder · **Verdict** · ADAPT · **Risk** · LOW · **Confidence** · 0.86 · **Why it transfers (or not)** · Our resume ladder is stronger, but a bounded crash snapshot would cover hook-cache loss without replacing handover/frontmatter.

- **Claim** · Use fixed per-section line budgets with explicit omitted counts for emergency context envelopes · **Evidence** · `packages/openltm-core/src/context.ts:30`, `packages/openltm-core/src/context.ts:39`, `packages/openltm-core/src/context.ts:142` · **Maps-to** · SessionStart and compaction envelope rendering · **Verdict** · ADAPT · **Risk** · LOW · **Confidence** · 0.88 · **Why it transfers (or not)** · Our token-budgeted retrieval is richer, but line quotas are easier to audit under compaction pressure.

- **Claim** · Promote transcript-derived discoveries through a proposal queue before durable memory writes · **Evidence** · `hooks/src/EvaluateSession.ts:223`, `hooks/src/EvaluateSession.ts:246`, `hooks/lib/proposalQueue.ts:14` · **Maps-to** · shadow-first learning-feedback reducers · **Verdict** · ADAPT · **Risk** · MED · **Confidence** · 0.82 · **Why it transfers (or not)** · Our shadow reducers already cover feedback learning, but candidate decision/gotcha proposals could improve recall without silent memory pollution.

- **Claim** · Consider opt-in git-diff learning backfill, but route it to proposals rather than direct memory writes · **Evidence** · `hooks/src/GitCommit.ts:117`, `hooks/src/GitCommit.ts:132`, `hooks/src/GitCommit.ts:138`, `hooks/lib/llmExtract.ts:53` · **Maps-to** · new sub-packet · **Verdict** · ADAPT · **Risk** · HIGH · **Confidence** · 0.78 · **Why it transfers (or not)** · Single-user local fits, but our causal/FSRS store needs provenance review to avoid committing noisy inferred memories.

- **Claim** · Do not replace spec-folder continuity with OpenLTM’s four context categories · **Evidence** · `packages/openltm-core/src/context.ts:16`, `packages/openltm-core/src/context.ts:44`, `packages/openltm-core/src/context.ts:152` · **Maps-to** · handover.md / implementation-summary continuity frontmatter · **Verdict** · REJECT · **Risk** · LOW · **Confidence** · 0.90 · **Why it transfers (or not)** · Our canonical docs, causal edges, tiers, and FSRS supersede flat goal/progress/decision/gotcha storage.

## Negative knowledge

Do not copy direct `GitCommit` auto-learn writes; commit diffs are too noisy for our higher-trust causal memory.

Do not copy the global `~/.claude/projects` context-file topology; system-spec-kit’s packet-local docs are the durable record.

Do not copy the hard 30-day stale skip as-is; FSRS decay and retrieval state should degrade relevance, not suppress recovery.

Do not copy dead or unclear knobs: `injectTopN` is read in `SessionStart` but not visibly applied in the scoped source (`hooks/src/SessionStart.ts:211`).

## Open questions

UNKNOWN: where proposal files are reviewed, accepted, or rejected after `EvaluateSession`.

UNKNOWN: empirical false-positive rate for LLM extraction from transcripts and git diffs.

Worth synthesis: whether our compact hook should persist a human-readable fallback snapshot into the active spec folder, not only temp hook state.

DELTA_JSON: {"type":"iteration","run":1,"iteration":"004","mode":"research","status":"insight","focus":"Lifecycle hooks + context-injection envelope","newInfoRatio":0.66,"findingsCount":5,"topVerdicts":["ADAPT: Add a persisted PreCompact markdown snapshot as a low-tech fallback beside the richer hook cache","ADAPT: Use fixed per-section line budgets with explicit omitted counts for emergency context envelopes","ADAPT: Promote transcript-derived discoveries through a proposal queue before durable memory writes"],"sources":["docs/06-hooks.md:13","docs/06-hooks.md:24","docs/06-hooks.md:38","hooks/lib/resolveProject.ts:5","hooks/lib/resolveProject.ts:118","hooks/lib/resolveProject.ts:140","hooks/src/SessionStart.ts:17","hooks/src/SessionStart.ts:20","hooks/src/SessionStart.ts:198","minImportance:4","minImportance:2","hooks/src/SessionStart.ts:37","hooks/src/SessionStart.ts:52","hooks/src/SessionStart.ts:224","hooks/src/SessionStart.ts:237","packages/openltm-core/src/context.ts:30","packages/openltm-core/src/context.ts:39","packages/openltm-core/src/context.ts:139","hooks/src/PreCompact.ts:12","hooks/src/PreCompact.ts:23","hooks/src/PreCompact.ts:29","hooks/src/PreCompact.ts:39","hooks/src/PreCompact.ts:56","hooks/src/PreCompact.ts:61","hooks/src/UpdateContext.ts:88","hooks/src/UpdateContext.ts:101","hooks/src/UpdateContext.ts:116","hooks/src/UpdateContext.ts:128","hooks/src/UpdateContext.ts:138","hooks/src/EvaluateSession.ts:20","hooks/src/EvaluateSession.ts:98","hooks/src/EvaluateSession.ts:146","hooks/src/EvaluateSession.ts:190","hooks/src/EvaluateSession.ts:219","hooks/src/EvaluateSession.ts:223","hooks/src/EvaluateSession.ts:240","hooks/lib/llmExtract.ts:8","hooks/lib/llmExtract.ts:14","hooks/lib/proposalQueue.ts:11","hooks/lib/proposalQueue.ts:14","hooks/src/GitCommit.ts:10","hooks/src/GitCommit.ts:24","hooks/src/GitCommit.ts:75","hooks/src/GitCommit.ts:117","hooks/src/GitCommit.ts:132","hooks/src/GitCommit.ts:138","hooks/src/GitCommit.ts:88","hooks/src/GitCommit.ts:96","hooks/lib/llmExtract.ts:50","hooks/lib/llmExtract.ts:61","packages/openltm-core/src/context.ts:142","hooks/src/EvaluateSession.ts:246","hooks/lib/llmExtract.ts:53","packages/openltm-core/src/context.ts:16","packages/openltm-core/src/context.ts:44","packages/openltm-core/src/context.ts:152","hooks/src/SessionStart.ts:211"],"tokensTotal":95251,"exitCode":0,"timestamp":"2026-06-08T13:33:08.239Z","sessionId":"2026-06-08-010-openltm-teachings","generation":1}
