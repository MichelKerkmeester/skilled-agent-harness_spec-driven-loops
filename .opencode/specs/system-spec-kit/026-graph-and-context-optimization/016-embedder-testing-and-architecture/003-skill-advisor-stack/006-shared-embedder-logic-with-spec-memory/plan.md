---
title: "Plan: shared embedder logic with spec-memory [template:level_1/plan.md]"
description: "Plan to remove skill-advisor/spec-memory embedder factory drift."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Authored implementation plan stub"
    next_safe_action: "Extract shared embedder factory and add parity regression"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Extract one shared embedder factory contract and make skill-advisor use it, with a parity regression as the guardrail.

| Phase | Focus | Output |
|-------|-------|--------|
| A | Confirm predecessor evidence and target files | Implementation starts from the cited source lines and current code |
| B | Implement scoped changes | Source and tests updated only for this packet's requirements |
| C | Run focused verification | Unit/integration/perf evidence captured in the packet |
| D | Closeout | Strict-validate packet and update implementation summary |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All P0 requirements in `spec.md` have direct test or command evidence.
- The focused test command for this packet exits 0.
- No production data, runtime DB, or operator-local config is changed without an explicit operator step.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The shared contract surface (`adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts`) lives at `.opencode/skills/system-spec-kit/shared/embeddings/`. mk-spec-memory's versions are the canonical source per the operator directive ("mk-spec-memory is most recently updated"). Both skills' local `mcp_server/lib/embedders/` files become thin re-export shims so existing relative-path imports inside each skill continue to resolve. Skill-advisor's `schema.ts` stays local because it integrates with `skill-graph.sqlite` (distinct from mk-spec-memory's database).

The shared `auto-select.ts` cascade already exists with file-based locking. This work adds a `contentType: 'text' \| 'code'` parameter defaulting to `'text'`. CocoIndex stays in Python with its own code-tuned registry — the parameter preserves the text/code split conceptually even though there is no TS code consumer today.

The parity test exercises both public skill surfaces (mk-spec-memory's embedder and skill-advisor's embedder via the same shared registry). It asserts identical Float32Array values for the same input, proving the registry behaves the same across consumers.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A - Discovery

1. Re-read predecessor packet and source files named in `spec.md`.
2. Confirm current line numbers before editing.
3. Identify the smallest test surface that proves the change.

### Phase B - Implementation

1. **Step 1**: Copy `adapter.ts`, `types.ts`, `registry.ts`, `adapters/ollama.ts` from `system-spec-kit/mcp_server/lib/embedders/` to `system-spec-kit/shared/embeddings/`. Promote skill-advisor's wider `EmbedderAdapter` interface (with optional `options?: EmbedderOptions`) since it is backward-compatible with mk-spec-memory's narrower interface. Convert both skills' local files to thin re-export shims.
2. **Step 2**: Delete `system-skill-advisor/mcp_server/lib/embedders/adapters/llama-cpp-baseline.ts`. Remove `embeddinggemma-300m` manifest entry from skill-advisor's local overrides (it should disappear entirely since Step 3 flips the default to `'auto'`).
3. **Step 3**: Add `contentType: 'text' \| 'code'` parameter to shared `auto-select.ts` (default `'text'`, no behaviour change for mk-spec-memory). Flip skill-advisor's `DEFAULT_ACTIVE_EMBEDDER` from `embeddinggemma-300m` to `{ name: 'auto', dim: 0 }`. Add `ensureActiveEmbedder(db, { contentType: 'text' })` helper that calls the shared cascade and persists the winner via existing `setActiveEmbedder()`.
4. **Step 4**: Wire skill-advisor daemon bootstrap (`advisor-server.ts`) to call `ensureActiveEmbedder()` before first read/write. Trigger one-shot `refreshSkillEmbeddings()` after pointer flip (already routes via dispatcher from phase 004).
5. **Step 5**: Update skill-advisor `INSTALL_GUIDE.md` section 12 (all subsections) and `README.md` pluggable-layer subsection to reflect the shared registry and `'auto'` sentinel default. Final parity grep across skill-advisor tree for `embeddinggemma` and `llama-cpp`.
6. Add cross-skill embedding parity regression and `ensureActiveEmbedder` cascade tests.

### Phase C - Verification

1. Run spec-memory embedder registry tests.
2. Run skill-advisor embedder/scorer tests.
3. Run the new parity regression.

### Phase D - Closeout

1. Update `implementation-summary.md` from PRE-IMPLEMENTATION to the actual result.
2. Run strict validation on this packet.
3. Preserve any operator-side blockers in the summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `npm test` or targeted vitest for system-spec-kit embedder registry.
- Targeted vitest for system-skill-advisor embedders and scorer smoke.
- New parity test that compares vectors for identical input.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Current spec-memory embedder registry/factory modules.
- Skill-advisor embedders and skill-graph DB code.
- Shared package path resolution between the two skills.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

1. Restore skill-advisor default registry to its prior implementation.
2. Remove the shared-factory parity test if shared extraction is reverted.
3. Leave documented decision notes in this packet summary.
<!-- /ANCHOR:rollback -->
