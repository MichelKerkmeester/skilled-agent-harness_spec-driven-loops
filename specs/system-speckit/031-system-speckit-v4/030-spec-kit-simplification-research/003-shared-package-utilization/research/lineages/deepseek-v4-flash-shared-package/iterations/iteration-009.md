# Iteration 9: Job 2 angle E + job 3 — types crossing surface, kept-row re-examination

## Focus

What actually crosses the package boundary from `types.ts` now that the barrel is gone; then re-examine the four recorded decisions from confirmed-findings for new evidence (re-list only with evidence that the stated reason is wrong).

## Findings

| # | path:line | Declared purpose | Observed | Severity | Recommendation |
|---|-----------|------------------|----------|----------|----------------|
| R9-01 | `shared/types.ts` cross-boundary inventory | Cross-package types | **2 symbols cross**: `ExtractionResult`, `ScoredNgram` — type-only imports at `runtime/cli/lib/trigger-extractor.ts:16` and `runtime/cli/lib/semantic-signal-extractor.ts:28`. Every other type (EmbeddingProfile*, RetryConfig, ProviderInfo, ApiKeyValidationResult, ArchivePattern, FolderScore, …) is consumed only inside shared (relative imports) — `types.ts` is effectively a shared-internal types module with a 2-symbol public leak, plus the 0-consumer `EmbeddingProfileExtended` (R2-04). | P2 | move: export the two extraction types from `shared/trigger-extractor.ts` and make types.ts internal-only (its stable-name value as a contract then shrinks to the 2 symbols) |
| R9-02 | `.opencode/commands/speckit/assets/speckit-{plan,complete}-*.yaml`, `.opencode/commands/deep/assets/deep-research-auto.yaml` | Predicate-grammar citations | All four citations of the predicate-grammar contract are present (3 speckit + 1 deep) — the keep-decision for `predicates/boolean-expr.ts` stands; **no new evidence** against it. | P2 (verified/recorded) | (none) |
| R9-03 | `runtime/cli/lib/frontmatter-migration.ts:15,110-111,852-861` | context-types consumer | Live value usage: spreads CANONICAL_CONTEXT_TYPES (:110) and LEGACY_CONTEXT_TYPE_ALIASES (:111, :861) — the retired-DB naming sits on a live migration seam; round one's "stays" verdict verified. | P2 (verified-positive) | (none) |
| R9-04 | `config.ts:8-10` / `factory.ts:334` / `profile.ts:255` | 2-spelling DB override | All three readers resolve `SPEC_KIT_DB_DIR` first then `SPECKIT_DB_DIR` — order consistent; README documents the pair. The recorded decision (keep both, operator configs carry both) stands; **no new evidence** (the divergence is the base semantics — R2-01 — not the spelling). | P2 (recorded) | (none) |
| R9-05 | this worktree's `shared/dist/` | L4 environment case | Pre-init observation: the stale dist still carries `index.d.ts` re-exporting from the removed barrel, `lib/structure-aware-chunker.d.ts`, `embeddings.d.ts` — the exact shape the main-checkout census classified as environment. Nothing new; not re-collectable here without node tooling (forbidden). | P2 (recorded) | (none) |

## Ruled out this iteration

- Re-listing boolean-expr (R9-02), the 2-spelling pair (R9-04), the advisor isolation doctrine (R7-04; no new evidence), and the L4 freshness claim (R9-05; environment).
- The `EmbeddingProfileExtended` row (already R2-04; not re-listed).

## Sources Consulted

- `@spec-kit/shared/types` specifier census (exactly 2 files, both type-only) + shared-internal relative imports (types.ts used by all shared modules)
- Citation sweep: `boolean-expr` in `.opencode/commands` (4 files) + all skills (excluding dist/changelog/lineages)
- `frontmatter-migration.ts` context-types usage; `config.ts`/`factory.ts`/`profile.ts` spelling order
- Worktree dist listing (one `ls`, read-only; noted as environment)

## Assessment

- newInfoRatio: 0.55 — R9-01 (2-symbol crossing surface) is the only new structural row; R9-02..R9-05 verify and close the kept-row ledger with "no new evidence" verdicts.

## Reflection

- Worked: separating "recorded decision verified" from "recorded decision overturned" — the four rows all verify; R2-01/R5-01 remain the incomplete-fix ledger from earlier iterations.
- Failed: my first citation grep used `--glob '*.md'` and missed the .yaml contract assets — corrected; the citations were never gone.
- Ruled out: dist; archive; spec-folder research artifacts.

## Recommended Next Focus

Iteration 10 (final): the closing sweep — reconcile every confirmed-findings row (10) against the current tree with the verdict ledger (fixed / incomplete / environment / recorded), rank the complete post-009 simplification backlog by severity and consumer impact, and record the memory-DB residue state (it survives only inside the factory's SQLite block + the naming layer).
