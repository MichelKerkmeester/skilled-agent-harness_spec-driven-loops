# Decision Record: Phase 11 — outDir Migration + Setup Hardening + README Alignment

> **Parent Spec:** 092-javascript-to-typescript/

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core + level3plus-govern | v2.0 -->

---

## Decision Inheritance

Phase 11 inherits all architectural decisions from the parent spec:

**From `092-javascript-to-typescript/decision-record.md`:**
- **D1**: CommonJS output (not ESM)
- **D2**: ~~In-place compilation (no `dist/`)~~ **SUPERSEDED by D11-2**
- **D3**: `strict: true` from start
- **D4**: Move files to break circular deps
- **D5**: Keep `I` prefix on existing interfaces
- **D6**: Phase 0 standards first
- **D7**: Central `shared/types.ts`

**From `phase-11-type-error-remediation/decision-record.md`:**
- **D10-1**: Refactor tests to match new API (not type assertions)
- **D10-2**: Prefixed exports for barrel conflicts
- **D10-3**: Minimal production fixes (type narrowing over interface changes)
- **D10-4**: Fix vector-index.js self-require in both .js and .ts

---

## New Decisions for Phase 11

### D11-1: `hf-local` as Default Instead of `auto`

**Context:** The `EMBEDDINGS_PROVIDER: "auto"` setting with placeholder API keys (`YOUR_VOYAGE_API_KEY_HERE`) caused the auto-detection logic to treat placeholders as real keys, resulting in API validation failures and MCP server crashes on startup.

**Decision:** Set `EMBEDDINGS_PROVIDER: "hf-local"` as the default in all config files and remove all placeholder API key entries.

**Rationale:**
- `"auto"` relies on the absence/presence of API keys to select a provider
- Placeholder strings are non-empty, so auto-detection interprets them as real keys
- Removing placeholders AND setting explicit `"hf-local"` is the only safe default
- HF Local works offline, is free, and requires no API key — correct for first-time setup
- Users wanting cloud providers can add real keys and set the provider explicitly

**Alternative rejected:** Keep `"auto"` but remove placeholder keys.
- **Rejected:** Still risky — if a user has stale env vars (`VOYAGE_API_KEY` from another project), auto-detection would try them

**Trade-off:** Users must explicitly opt into cloud providers instead of getting automatic detection. This is the safer default.

---

### D11-2: Per-Workspace `dist/` Output (Supersedes D2)

**Context:** Phase 0 decision D2 specified "in-place compilation (no `dist/`)" — compiled `.js` files were generated alongside `.ts` sources in the same directories. After Phase 10 completed the full TS migration, this resulted in ~1400 compiled artifacts polluting source directories.

**Decision:** Add `"outDir": "dist/"` to all 3 tsconfig files, moving compiled output to per-workspace `dist/` directories.

**Rationale:**
- In-place compilation was appropriate during migration (gradual file-by-file conversion)
- Now that migration is complete, separation is better for:
  - Clean `git status` (no generated files in source dirs)
  - Source navigation (only `.ts` files in source directories)
  - Build artifact management (single directory to clean/ignore)
- Standard TypeScript project convention

**Why D2 was correct at the time:** During migration, in-place compilation allowed `.js` and `.ts` files to coexist with the same import paths, enabling file-by-file conversion without updating all consumers simultaneously.

**Trade-off:** Required updating ~30 test files, 5 package.json entry points, 8 barrel re-exports, and path resolution in config modules. One-time migration cost.

---

### D11-3: Full npx Cache Clearance (Not Targeted Deletion)

**Context:** `install-code-mode.sh` needed to clear stale npx-cached native modules (specifically `isolated-vm` compiled for an older Node.js version). The initial approach used `rm -rf ~/.npm/_npx/*utcp*` to target only the UTCP package.

**Decision:** Clear the entire npx cache with `rm -rf ~/.npm/_npx/*` instead of targeted deletion.

**Rationale:**
- npx cache directories use opaque content hashes, not human-readable package names
- A directory like `~/.npm/_npx/a3b2c1d4/` gives no indication of what package it contains
- Glob pattern `*utcp*` doesn't match these hash-based directory names
- The npx cache is a pure cache — clearing it has no data loss, only a speed cost on next `npx` invocation

**Alternative rejected:** Parse `package.json` inside each npx cache directory to find the target.
- **Rejected:** Over-engineered for a cache directory; clearing all is simpler and more reliable

**Trade-off:** All cached npx packages are cleared, not just the target. Minimal impact — npx re-downloads on demand.

---

### D11-4: In-Project HuggingFace Cache Location

**Context:** The existing troubleshooting documentation only mentioned `~/.cache/huggingface/` (the global HuggingFace cache). However, the `@huggingface/transformers` package stores its ONNX model cache inside `node_modules/@huggingface/transformers/.cache` — within the project, not in the global cache.

**Decision:** Document and clean the in-project cache path as the primary fix, with the global cache as a secondary fallback.

**Rationale:**
- The in-project cache is where corrupted ONNX models actually live
- `rm -rf ~/.cache/huggingface/` doesn't fix the most common corruption scenario
- The in-project path `node_modules/@huggingface/transformers/.cache` is the correct primary fix
- Global cache may also be relevant for other HuggingFace tools

**Alternative rejected:** Only document the global cache path.
- **Rejected:** Wouldn't fix the actual problem — corrupted models in `node_modules/`

---

### D11-5: Stream C+ Retroactive Fix

**Context:** After completing Streams A–C (43 README updates + 5 config/script hardening), a systematic grep audit revealed that `.claude/mcp.json`, `.vscode/mcp.json`, and the install_guides README still had the old broken patterns — the same issues fixed in Stream A for `opencode.json` and install scripts.

**Decision:** Add a Stream C+ to fix these remaining files rather than deferring to a separate spec.

**Rationale:**
- The files are actively broken (P0) — `.claude/mcp.json` is the Claude Code config
- The fix is identical to what was already done in Stream A
- Deferring would leave a known-broken state in the repository
- Small scope (5 files, well-understood changes)

**Alternative considered:** Create a separate Phase 12 spec.
- **Rejected:** Over-documenting a 5-file fix that's a direct continuation of Phase 11's mission

---

## Risk Register (Phase 11 Specific)

| Risk | Likelihood | Impact | Mitigation | Outcome |
|------|-----------|--------|-----------|---------|
| outDir change breaks runtime imports | Medium | High | Full test suite after each tsconfig change | No breakage — all tests pass |
| README updates miss some files | Low | Medium | Enumerate all READMEs with `find`, verify count | All 43 READMEs updated |
| Config file patterns missed | Medium | High | Systematic grep verification | Stream C+ caught 5 remaining files |
| Placeholder removal breaks user configs | Low | Low | Document migration in install guide | Clear documentation provided |

---

## Cross-References

- **Parent Decisions:** `092-javascript-to-typescript/decision-record.md` (D1–D7)
- **Phase 10 Decisions:** `phase-11-type-error-remediation/decision-record.md` (D10-1–D10-4)
- **Spec:** See `spec.md`
- **Plan:** See `plan.md`
- **Tasks:** See `tasks.md`
- **Checklist:** See `checklist.md`
