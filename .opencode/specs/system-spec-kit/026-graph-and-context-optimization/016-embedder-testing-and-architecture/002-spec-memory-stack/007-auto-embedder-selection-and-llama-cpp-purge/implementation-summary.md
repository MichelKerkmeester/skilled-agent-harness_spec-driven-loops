---
title: "Summary: 016/002/007 Auto-Embedder Selection + llama-cpp Purge"
description: "Implementation summary placeholder; filled by cli-codex during execution + main agent on commit"
trigger_phrases: ["016/002/007 summary"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/auto-embedder-selection-and-llama-cpp-purge"
    last_updated_at: "2026-05-18T19:46:36Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded placeholder for codex dispatch"
    next_safe_action: "Codex fills via Commit Handoff section after execution"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002007"
      session_id: "016-002-007-summary"
      parent_session_id: "016-002-007"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/002/007 Auto-Embedder Selection + llama-cpp Purge

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | PLANNED (scaffolded; cli-codex dispatched) |
| Branch | main |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Placeholder; codex fills after execution. See `spec.md` §3 SCOPE for planned deliverables.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Placeholder; codex fills with Phase A-E execution narrative + any blockers / deviations.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

Placeholder; codex documents the auto-select sentinel pattern chosen (sentinel value vs explicit auto-call vs other) + any other implementation-time decisions.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

Concrete verification commands:

```bash
# Strict-validate this packet
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/auto-embedder-selection-and-llama-cpp-purge --strict

# Typecheck + tests
npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck
npx vitest --run embedder-auto-selection
npx vitest --run embedder-ollama

# Grep purge surface
git grep -l 'llama-cpp\|node-llama-cpp\|embeddinggemma\|LlamaCppProvider' \
  .opencode/skills/system-spec-kit/ || echo "OK: purge complete"

# Smoke: fresh DB bootstrap with Ollama+jina-v3 → expect auto-select picks jina-v3
# (codex documents exact steps)
```

Checklist (codex fills during/after execution):

- [ ] llama-cpp surface inventory in scratch/
- [ ] `autoSelectActiveEmbedder()` implemented + tested
- [ ] `LlamaCppProvider` removed from factory
- [ ] `node-llama-cpp` removed from package.json
- [ ] embeddinggemma-300m removed from registry
- [ ] DEFAULT_ACTIVE_EMBEDDER updated to sentinel
- [ ] vec_metadata persistence + write-race lock implemented
- [ ] Tests pass
- [ ] Docs updated
- [ ] Strict-validate PASSED
- [ ] Commit Handoff section below populated
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

Placeholder; codex documents any tradeoffs or follow-on work after execution.
<!-- /ANCHOR:limitations -->
