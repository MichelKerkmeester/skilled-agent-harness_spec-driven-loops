---
title: "Implementation Plan: Phase 11: advisor-import-and-ollama-consolidation"
description: "Read both Ollama implementations in full, merge them behind one contract the daemon's two live call sites both reach, then apply one import-extension convention across every advisor-owned specifier for @spec-kit/shared."
trigger_phrases:
  - "advisor import consolidation plan"
  - "ollama adapter merge plan"
  - "dual path dispatch preserved"
  - "extension convention lint pin"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: advisor-import-and-ollama-consolidation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, `@spec-kit/shared` embeddings package, skill-advisor MCP server |
| **Framework** | Vitest, the advisor's `EmbedderAdapter` registry and `createEmbeddingsProvider` factory |
| **Storage** | The advisor's `skill-graph.sqlite`, unaffected by this change |
| **Testing** | The advisor's own vitest suite, plus `routing-golden-prompts.vitest.ts` |

### Overview
`shared/embeddings/adapters/ollama.ts` and `shared/embeddings/providers/ollama.ts` are read in full, their divergent config surfaces reconciled, and merged into one implementation that both `getAdapter('ollama').embed()` (the pluggable-adapter dispatch path) and `createEmbeddingsProvider()` (the legacy dispatch path) resolve to, preserving `skill-graph-db.ts`'s existing dual-path dispatch documented at lines 1182-1194. Separately, every advisor-owned import and vi.mock specifier for `@spec-kit/shared/*` is normalized to the `.js` extension form already used at the one confirmed production call site (`skill-graph-db.ts:18`), and a lint rule or test pins that convention going forward.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-both-then-merge for the Ollama implementation, and find-and-normalize for the import specifiers, each independently verifiable.

### Key Components
- **Ollama merge**: one implementation, reached by both the adapter-registry call site and the factory call site, keeping `skill-graph-db.ts`'s dual dispatch (`hasActiveEmbedderPointer`) unchanged.
- **Import-specifier normalization**: every advisor-owned `@spec-kit/shared/*` specifier, production and test, uses `.js`.
- **Convention pin**: a lint rule (if the advisor's ESLint config can express an import-extension rule) or a dedicated test that greps the advisor's own source tree for an extensionless `@spec-kit/shared` specifier and fails if one is found.

### Data Flow
`skill-graph-db.ts`'s `refreshSkillEmbeddings()` dispatches to either `refreshSkillEmbeddingsViaAdapter` (via `getAdapter`) or `refreshSkillEmbeddingsLegacy` (via `createEmbeddingsProvider`) depending on `hasActiveEmbedderPointer`. After the merge, both paths call into the same underlying Ollama request logic, so an Ollama-backed embed produces the same vector regardless of which dispatch path a given install is on.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/embeddings/adapters/ollama.ts` | Live embed path via `getAdapter('ollama').embed()` | update | advisor's adapter-path tests (semantic-shadow lanes) pass |
| `shared/embeddings/providers/ollama.ts` | Live embed path via `createEmbeddingsProvider()` legacy dispatch | update or delete | advisor's legacy-path tests (refresh-roundtrip's legacy branch) pass |
| `skill-graph-db.ts`'s dual-path dispatch (`hasActiveEmbedderPointer`) | Chooses adapter vs legacy at runtime | unchanged | both dispatch branches still resolve and their tests pass |
| Advisor production imports of `@spec-kit/shared/*` (`skill-markdown.ts`, `doc-frontmatter.ts`) | Extensionless specifier | update to `.js` | `npm --prefix .opencode/skills/system-skill-advisor/mcp-server run build` (tsc) resolves cleanly |
| Advisor test/vi.mock imports of `@spec-kit/shared/*` (5 files) | Extensionless specifier | update to `.js` | each affected test file run individually, mock still intercepted |
| `routing-golden-prompts.vitest.ts` against `gate2-golden-prompts.jsonl` | Advisor routing regression guard | unchanged | passes after both the merge and the specifier fix |

Required inventories:
- Same-class producers: `rg -n "from '@spec-kit/shared" .opencode/skills/system-skill-advisor/mcp-server --glob '*.ts'`.
- Consumers of changed symbols: `rg -n "adapters/ollama|providers/ollama|OllamaAdapter|OllamaProvider" .opencode/skills/system-skill-advisor .opencode/skills/system-spec-kit/shared --glob '*.ts'`.
- Matrix axes: dispatch path (adapter, legacy) x Ollama config surface (base URL, model, dtype) x specifier location (production, test, vi.mock).
- Algorithm invariant: an Ollama embed call through either dispatch path returns a vector of the same dimension and provider profile it returned before the merge, for the same input text and the same `OLLAMA_BASE_URL`/`OLLAMA_EMBEDDINGS_MODEL` env pair.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor embedder registry and adapter tests | `tests/embedders/registry.vitest.ts`, `tests/embedders/shared-factory-parity.vitest.ts` |
| Integration | Semantic-shadow and refresh-roundtrip lanes exercising both dispatch paths, plus the routing-registry-drift golden-prompt suite | `semantic-shadow-cosine.vitest.ts`, `semantic-shadow-ablation.vitest.ts`, `refresh-roundtrip.vitest.ts`, `routing-golden-prompts.vitest.ts` |
| Manual | Read both Ollama files in full before merging, then grep the advisor tree for the specifier convention after the fix | direct file read, `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/shared`'s embeddings package (owned by system-spec-kit, consumed by the advisor) | Internal, cross-skill | Green | The merge edits a file this packet does not own the skill boundary of, so coordinate the commit message to name both skills |
| A running or mockable Ollama endpoint for the affected tests | External | Green - tests mock `createEmbeddingsProvider`/`getAdapter`, no live Ollama server required | Tests fall back to their existing mocks, so no new dependency is introduced |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the advisor's test suite or the golden-prompt suite fails after the merge, or a dispatch-path test shows the merged implementation dropped a config option one of the two originals honored.
- **Procedure**: `git revert` the merge commit. `adapters/ollama.ts` and `providers/ollama.ts` return to their pre-merge, independently-live state, and the import-specifier commit (if separate) can be kept or reverted independently.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | Read both ~400-line Ollama files in full, diagram the two config surfaces |
| Core Implementation | Med | Merge the implementation, fix seven import specifiers, add the convention pin |
| Verification | Low | Run the advisor's suite and the golden-prompt suite |
| **Total** | | **One to two sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable, git history is the backup
- [x] Feature flag configured - not applicable
- [x] Monitoring alerts set - not applicable

### Rollback Procedure
1. Stop before removing either original Ollama file if a dispatch-path test fails.
2. `git revert` the merge commit.
3. Re-run the advisor's suite and the golden-prompt suite to confirm the pre-merge state is restored.
4. Not user-facing, so no stakeholder notification is needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
