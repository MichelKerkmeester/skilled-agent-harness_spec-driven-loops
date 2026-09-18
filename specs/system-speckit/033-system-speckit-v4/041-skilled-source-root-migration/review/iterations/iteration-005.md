# Iteration 005: Generated state integrity

**Executor.** gpt-5.6-luna, reasoning max, service tier fast, read-only sandbox.

## GEN-001 Trigger-index generation publishes an empty or narrowed corpus under the legacy-root layout

- **Severity:** P1
- **File:** `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:28`
- **Trigger:** Run the generator in the supported `today` layout, where `.opencode/` is real and `.skilled/` is absent or only a placeholder.
- **Consequence:** `.opencode/skills` and `.opencode/hooks` are skipped. The generator can publish an empty or specs-only index and exit 0.
- **Evidence:** `CORPUS_ROOTS` is hard-coded to `.skilled`. Missing roots are recorded and skipped at `corpus.mjs:158-162`. `generate-trigger-index.mjs:371-405` rejects only malformed documents, while `artifact.mjs:172-176` permits empty path and phrase tables. A no-write build against `/tmp` returned zero documents, phrases and paths.
- **Fix:** Resolve corpus roots from the active `.skilled` or `.opencode` source root, deduplicate aliases by real path and fail before publication when required roots or minimum corpus counts are absent. Add `today`, `skilled-only` and `whole-link` regression fixtures.
