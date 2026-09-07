---
title: "Feature Specification: Phase 11: advisor-import-and-ollama-consolidation"
description: "The skill advisor's tests import @spec-kit/shared extensionless while production code imports with .js, and two live Ollama embedding implementations (~790 lines, two contracts) sit behind one embedder registry."
trigger_phrases:
  - "advisor import specifier consistency"
  - "ollama adapter provider merge"
  - "advisor isolation doctrine preserved"
  - "golden prompt suite green"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: advisor-import-and-ollama-consolidation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-07 |
| **Branch** | `scaffold/011-advisor-import-and-ollama-consolidation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 16 |
| **Predecessor** | 010-manifest-dead-fields-and-coaching-markers |
| **Successor** | 012-root-resolver-consolidation |
| **Handoff Criteria** | validate.sh reports RESULT: PASSED for this folder and the advisor's tests plus the golden-prompt suite pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Recorded findings closure specification.

**Scope Boundary**: The skill advisor's own import specifiers under `.opencode/skills/system-skill-advisor/mcp-server/`, and the two live Ollama embedding implementations at `.opencode/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts` and `providers/ollama.ts` that the advisor reaches through `@spec-kit/shared`. The unicode-normalization isolation doctrine (`mcp-server/lib/shared/unicode-normalization.ts`) is read-only context, never edited here.

**Dependencies**:
- `@spec-kit/shared`'s embeddings package must keep serving the daemon's live embed path throughout the merge, with no capability regression.

**Deliverables**:
- One Ollama embedding implementation reachable from the daemon, in place of two.
- Every advisor-owned import and vi-mock specifier for `@spec-kit/shared` uses one consistent extension form.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Finding R5-01 (`specs/system-speckit/035-spec-kit-simplification-research/003-shared-package-utilization/research/lineages/deepseek-v4-flash-shared-package/research.md:25`) found two parallel live implementations of the same Ollama embedding backend, both reached from the same daemon flow: `shared/embeddings/adapters/ollama.ts` (366 lines) and `shared/embeddings/providers/ollama.ts` (424 lines), together ~790 lines with two separate contracts and two config surfaces. `system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:18` reaches the provider path via `createEmbeddingsProvider()` from `@spec-kit/shared/embeddings/factory.js`, and lines 1219 and 1314 of the same file reach the adapter path via `getAdapter().embed()` from `lib/embedders/registry.ts`, which re-exports `@spec-kit/shared/embeddings/registry.js`. Separately, findings R3-I1-01 and R3-I1-02 (same research file, `deepseek-v4-flash-shared-package-r3/research.md:13-14`) found the advisor's own import specifiers for `@spec-kit/shared/frontmatter/parse-frontmatter` and `@spec-kit/shared/embeddings/factory` are extensionless in five test files (`semantic-shadow-cosine.vitest.ts:33`, `refresh-roundtrip.vitest.ts:58`, `semantic-shadow-ablation.vitest.ts:9`, `seed-skill-embeddings.ts:10`, `lane-weight-sweep.vitest.ts:9`) and two production files (`skill-markdown.ts:12`, `doc-frontmatter.ts:12`), while production code that reaches the same package elsewhere uses `.js` (`skill-graph-db.ts:18`). Both findings were recorded rather than fixed because the shared package's live embedding stack is scoped as the advisor's own surface, and a merge is that skill's refactor.

### Purpose
The daemon reaches one Ollama embedding implementation instead of two, every advisor-owned `@spec-kit/shared` import and vi-mock specifier uses one consistent extension form, and the advisor's own tests plus the routing-registry-drift workflow's golden-prompt suite stay green, with the unicode-normalization isolation doctrine untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Merging `shared/embeddings/adapters/ollama.ts` and `shared/embeddings/providers/ollama.ts` into one implementation the daemon reaches through both the `factory.createEmbeddingsProvider()` call site and the `registry.getAdapter()` call site.
- Picking one import-extension convention (`.js`, matching the confirmed production form at `skill-graph-db.ts:18`) and applying it to every advisor-owned specifier for `@spec-kit/shared/*`.
- Adding a lint rule or a test that pins the chosen extension form so the inconsistency cannot silently return.

### Out of Scope
- `mcp-server/lib/shared/unicode-normalization.ts`'s local-duplication isolation doctrine - finding L7 recorded this as a "no change" decision for this program, not reopened here.
- Any Ollama, embeddings or import-specifier surface outside `.opencode/skills/system-skill-advisor` and the `@spec-kit/shared/embeddings` package it consumes.
- The two backend taxonomies (`BackendKind` vs `SupportedProviderName`, finding R5-04) and the unreachable `NotImplementedError` branches (R5-02) - recorded alongside R5-01 as the same stack's shape, not blocking requirements of this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts` | Modify | Becomes the one surviving implementation, or is replaced by a thin wrapper over the merged provider |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts` | Modify or Delete | Merged into the adapter, or the adapter becomes the thin wrapper over this one |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/skill-markdown.ts` | Modify | Import specifier for `parse-frontmatter` gets a `.js` extension |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/doc-frontmatter.ts` | Modify | Import specifier for `parse-frontmatter` gets a `.js` extension |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/__tests__/semantic-shadow-cosine.vitest.ts` | Modify | `vi.mock` specifier for `embeddings/factory` gets a `.js` extension |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/skill-graph/refresh-roundtrip.vitest.ts` | Modify | `vi.mock` specifier for `embeddings/factory` gets a `.js` extension |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/semantic-shadow-ablation.vitest.ts` | Modify | Import specifier for `embeddings/factory` gets a `.js` extension |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/fixtures/seed-skill-embeddings.ts` | Modify | Import specifier for `embeddings/factory` gets a `.js` extension |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/scorer/lane-weight-sweep.vitest.ts` | Modify | Import specifier for `embeddings/factory` gets a `.js` extension |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | One Ollama embedding implementation reaches the daemon through both the existing `factory.createEmbeddingsProvider()` and `registry.getAdapter().embed()` call sites, with no capability lost |
| REQ-002 | The advisor's own test suite (`npm --prefix .opencode/skills/system-skill-advisor/mcp-server run test`) passes after the merge |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every advisor-owned import and vi-mock specifier for `@spec-kit/shared/*` uses the `.js` extension form, matching the confirmed production convention at `skill-graph-db.ts:18` |
| REQ-004 | A lint rule or a test pins the `.js` extension convention so a future advisor-owned file cannot reintroduce an extensionless specifier undetected |
| REQ-005 | The routing-registry-drift workflow's golden-prompt suite (`routing-golden-prompts.vitest.ts` against `gate2-golden-prompts.jsonl`) passes after the merge, and `mcp-server/lib/shared/unicode-normalization.ts`'s isolation doctrine is unchanged |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `getAdapter('ollama').embed()` and `createEmbeddingsProvider()` for the Ollama provider both resolve to the same underlying implementation, with the advisor's embedding-backed tests still passing.
- **SC-002**: A repo-wide grep for `@spec-kit/shared` import specifiers under `.opencode/skills/system-skill-advisor` shows one extension form.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The two Ollama implementations have genuinely divergent config surfaces (two contracts), so a naive merge silently drops a capability one path relied on | High if unmitigated | Read both files fully before merging, then run the advisor's embedding-backed tests (semantic-shadow, refresh-roundtrip) against the merged implementation before removing either original path |
| Risk | Changing import extensions in test files touches vi.mock specifiers, which vitest resolves by exact string match against the import graph | Med - a mismatched mock specifier silently stops mocking, not a hard failure | Run the affected test file after each specifier change and confirm the mock is still intercepted, not just that the file parses |
| Dependency | `mcp-server/lib/shared/unicode-normalization.ts`'s isolation doctrine and its `.github/workflows/isolation-check.yml` claim | If the merge is read as touching "isolation," a reviewer may conflate it with the unrelated unicode-normalization doctrine | State explicitly in the PR/commit that the merge changes only the embeddings stack, not the isolation-doctrine module. No `isolation-check.yml` exists in the repo today, confirmed by direct search, so this dependency is documentation-only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The merged Ollama implementation's embed-call latency is not measurably worse than either original path, with no new network round trip added.
- **NFR-P02**: Not applicable beyond NFR-P01 - no throughput target exists for this local daemon path.

### Security
- **NFR-S01**: Not applicable - no auth surface changes. Ollama's `OLLAMA_BASE_URL` config handling is preserved exactly as either original path read it.
- **NFR-S02**: Not applicable - no data storage changes.

### Reliability
- **NFR-R01**: The advisor's embedding-backed tests (semantic-shadow-cosine, semantic-shadow-ablation, refresh-roundtrip, lane-weight-sweep) all still pass after the merge.
- **NFR-R02**: The golden-prompt suite's pass rate is unchanged before and after this phase.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: not applicable - no user input surface changes.
- Maximum length: not applicable.
- Invalid format: an Ollama response shape either original implementation handled (e.g. a truncated embedding vector) is still handled identically by the merged implementation. Both originals' error paths are read before choosing which one survives.

### Error Scenarios
- External service failure: the merged implementation preserves whichever original's Ollama-unreachable fallback behavior is the one actually exercised by the daemon's live call sites (`skill-graph-db.ts:1219`, `1314`, `1348`).
- Network timeout: preserved from whichever original owns the timeout config today, not newly introduced.
- Concurrent access: not applicable - the embedding call is per-request, not a shared mutable resource.

### State Transitions
- Partial completion: if the Ollama merge and the import-specifier fix are done in separate commits, each commit still leaves the advisor's tests green on its own, so a session boundary between the two never leaves the tree red.
- Session expiry: `goal.md`'s log tracks which of the two independent workstreams (merge, specifier fix) is done if a session ends mid-phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two ~400-line files to merge, plus seven advisor-owned files with an import-extension fix |
| Risk | 10/25 | A live daemon embed path, mitigated by running the advisor's own embedding-backed tests before and after |
| Research | 6/20 | Both Ollama files' contracts need a full read before merging. The import-specifier fix is already fully evidenced |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the merged Ollama implementation keeps the `adapters/ollama.ts` path (the one the advisor's own `lib/embedders/adapters/ollama.ts` shim already re-exports) or the `providers/ollama.ts` path as its home file - decided after both bodies are read in full and their divergent config surfaces are compared line by line.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
