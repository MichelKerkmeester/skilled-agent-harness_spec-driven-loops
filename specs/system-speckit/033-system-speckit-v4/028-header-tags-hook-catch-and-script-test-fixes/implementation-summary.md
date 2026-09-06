---
title: "Implementation Summary: Header tags, hook catch and script test fixes"
description: "Four waves landed. The fourth, from an independent Claude Fable 5 verification, repaired the CLI quality gate that had been dead since the CLI nesting (a wrong runtime directory in the boundary script) and everything it had been hiding, gave the telemetry store its production writer, made every remaining hook entry point report before failing open, excluded build output from the corpus, and pinned the CLI's engine floor. The third, from a five-iteration DeepSeek pass, renamed the render-quality scorer so two scorers stop sharing a name, routed three more private root walk-ups through the hooks resolver by exporting it from the runtime package with a declaration file, put the cursor and devin classify adapters on the shared stdin helpers, removed a type-only indexer stub, a re-export shim, a dead shell helper and two unconsumed test hooks, and gave fact coercion and the matrix helpers their first tests. The second, from a Gemini 3.8 Flash pass over runtime/lib, runtime/api, runtime/hooks, the CLI scripts and shared, found the most serious defect of the program: the shared config resolved the shared package as the skill root, so the telemetry store that carries a phase parent's active-child pointer under generator hardening was written under a directory that does not exist, and the Gate 3 classifier never read the store at all. Both are fixed, with a script test pinning the root. The same wave removed five dead wave-orchestration modules and two broken one-off migrations, gave the three remaining stop hooks a stderr report, moved a validation CLI's success output to stdout, made an uncomputable fingerprint a violation, normalized 248 header widths, wired the shared package's six script tests into its test command and repaired the one that had rotted. First wave: every shell script under runtime/cli now opens with the documented COMPONENT or SPECKIT tag and every module script with MODULE, the cursor response hook reports a failure instead of hiding it, an unused barrel is gone, and two public scripts have their first tests."
trigger_phrases:
  - "header tag fixes shipped"
  - "completeness clamp errexit bug"
  - "cursor hook stderr report"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/028-header-tags-hook-catch-and-script-test-fixes"
    last_updated_at: "2026-09-06T10:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the packet with its verification evidence"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:34c5b0dee1c93414a4e844cdf0c4ed98ab78a705f7798e33355b90512138a97c"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-header-tags-hook-catch-and-script-test-fixes |
| **Completed** | 2026-09-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every shell script under runtime/cli now opens with the documented COMPONENT or SPECKIT tag and every module script with MODULE, the cursor response hook reports a failure instead of hiding it, an unused barrel is gone, and two public scripts have their first tests. One of those tests found a real bug: calculate-completeness.sh exited silently under errexit whenever a packet had placeholders.

### Mechanical rows

Line-three substitutions across 38 files, one deletion, one comment rewrite, one header rationale. Judgment rows each carry a decision below.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| runtime/cli/rules/*.sh (27), spec/*.sh (3), kpi/quality-kpi.sh | Modified | Header tag |
| runtime/cli/retrieval/*.mjs (6), evals/run-phase2-closure-metrics.mjs | Modified | Header tag |
| runtime/cli/utils/memory-frontmatter.ts | Deleted | No importer |
| runtime/hooks/cursor/completion-evidence-response.mjs | Modified | stderr line on failure, exit stays clean |
| runtime/cli/lib/frontmatter-migration.ts | Modified | Header states why it keeps its own fence detection |
| shared/embeddings.ts | Modified | Durable comment instead of a catalog pointer |
| runtime/cli/spec/calculate-completeness.sh | Modified | Clamp written as a full if; the false branch no longer ends the function non-zero |
| runtime/cli/tests/quality-audit-script.vitest.ts, calculate-completeness-script.vitest.ts | Created | Happy path and edge case each |
| shared/config.ts, shared/gate-3-classifier.ts, shared/config.test.ts | Modified, Created | Skill-root resolution, store-first pointer lookup, root pinned by a test |
| runtime/api/graph-refresh.ts, runtime/tests/api-graph-refresh.vitest.ts | Modified, Created | Seam import, exported resolver, happy path and error test |
| runtime/lib/validation/spec-doc-structure.ts, generated-metadata-integrity.ts | Modified | stdout for success output; uncomputable fingerprint reported |
| runtime/hooks/{claude,codex,devin}/completion-evidence-stop.cjs | Modified | stderr report before approve |
| runtime/cli/lib/wave-*.cjs (5), runtime/cli/tests/deep-loop-wave-*.vitest.ts (4), runtime/cli/migrate-deep-loop-*.cjs (2) | Deleted | No caller; one-off migrations against a retired path |
| shared/package.json, shared/predicates/boolean-expr.test.ts, shared/utils/retry.ts | Modified | Real test command; rotten assertion repointed; SQLite residue removed |
| 248 files under runtime and shared | Modified | Header dividers at the documented width; banners in four modules |
| runtime/cli/core/quality-scorer.ts and three tests | Modified | `scoreRenderQuality` |
| runtime/package.json, runtime/hooks/lib/workspace/repo-root.d.mts, cli/graph/*.ts, cli/continuity/backfill-frontmatter.ts | Modified, Created | One resolver reached through the package export |
| runtime/hooks/{cursor,devin}/spec-gate-classify.mjs | Modified | Shared stdin and parse helpers |
| runtime/cli/core/memory-indexer.ts, runtime/cli/extractors/session-activity-signal.ts | Deleted | No importer |
| runtime/cli/spec/progressive-validate.sh, shared/embeddings/providers/ollama.ts, shared/parsing/secret-scrubber.ts | Modified | Dead helper and test hooks removed |
| runtime/cli/tests/fact-coercion.vitest.ts, shared/ranking/matrix-math.test.ts | Created | Happy path and edge case each |
| runtime/cli/retrieval/generate-trigger-index.mjs, retrofit-convention.mjs, runtime/cli/codex/generate-command-routers.cjs | Modified | Delegate repo-root resolution to the hooks module instead of three private walk-ups |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Substitutions verified by a tag census, the two tests run under the CLI vitest project, the CLI typecheck run after the deletion, the CLI dist rebuilt and reported fresh, the hook syntax-checked. Committed as ee8a17b5b1.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Normalize RULE to COMPONENT | The shell standard documents one tag; ripgrep found no consumer of RULE |
| Report, do not swallow, in the response hook | Sibling hooks fall back to approve or allow; a response hook has nothing to emit, so it writes one stderr line and exits clean |
| Keep the migration parser separate | It classifies malformed legacy blocks the strict shared parser rejects; the header now says so |
| Consolidate the repo-root resolvers onto the hooks module | The sentinel-file resolver in `runtime/hooks/lib/workspace/repo-root.mjs` is the one with a written rationale; the retrieval generator, the retrofit script and the codex router now delegate to it, and the pinned retrieval root test and the router self-check still pass |
| Keep doctor exit codes 20, 26 and 64 | Documented in the script header; 64 is the sysexits usage code |
| Keep the legacy test-* names | Wired by package scripts, not by a glob |
| Keep the rule scripts loader-only | Their `run_check` takes the loader's folder and level; a direct-run guard fails under `set -u`, so the guard was tried and reverted |
| Keep the dormant cursor classify adapter | Documented as waiting for cursor-agent to deliver the event |
| Keep the orchestrator's cli paths | The rule registry and scripts belong to the CLI package and the orchestrator runs them by path |
| Keep the two continuity regexes | They accept a BOM or leading comment the shared parser rejects; each now says so |
| Remove rather than fix the migrations | Both targeted a packet path retired before the CLI move and had never run successfully |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Tag census | grep over runtime/cli: 0 RULE, 0 SPEC-KIT, 0 SCRIPT shell headers; 0 SCRIPT module headers |
| Shared tests | `npm test` in shared: 11 of 11 script tests pass, including the config root, matrix, scrubber, trace and socket helper tests |
| CLI check gate | `npm run check` in runtime/cli: lint, import policy, api boundary, architecture boundary, allowlist expiry, source/dist alignment, AST import policy and handler cycles all pass |
| Runtime suites | api-graph-refresh, generated-metadata-integrity, spec-doc-structure, resume-ladder: 56 of 56 |
| CLI suites | coverage-graph, retrieval root, import policy, boundary enforcement, script tests: 144 of 144 |
| Builds | shared, runtime and CLI typecheck and build clean; dist freshness all fresh |
| Store path | `resolveTelemetryStorePath()` now returns `<skill>/runtime/database/access-telemetry.json` |
| Tests | `vitest run` on the two new files: 4 passed |
| Typecheck | `npm run typecheck` in runtime/cli: exit 0 |
| Dist freshness | `dist-freshness.cjs check-all`: all fresh after rebuild |
| Strict validation | `validate.sh <child> --strict` printed RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Recursive child manifest test** `recursive-child-manifest.vitest.ts` fails at HEAD with or without these changes because the corpus manifest it checks is being edited by another session; not caused here.
<!-- /ANCHOR:limitations -->

---
