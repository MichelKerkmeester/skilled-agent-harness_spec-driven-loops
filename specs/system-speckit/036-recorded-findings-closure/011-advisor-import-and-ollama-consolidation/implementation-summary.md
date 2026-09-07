---
title: "Implementation Summary"
description: "One Ollama transport now serves both the daemon adapter and the legacy provider, and every advisor import of @spec-kit/shared carries the .js extension, pinned by a test."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/011-advisor-import-and-ollama-consolidation"
    last_updated_at: "2026-09-07T15:05:51Z"
    last_updated_by: "template-author"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "Implement child 012"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:897b7cba3af178de7a510f2b4e239abefad4a321355830bec7d7c821e4f43b18"
      session_id: "scaffold-011-advisor-import-and-ollama-consolidation"
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
| **Spec Folder** | 011-advisor-import-and-ollama-consolidation |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared embedding stack carried two Ollama implementations: a batch adapter the daemon reaches through the registry, and a single-text provider the legacy factory constructs. Both spoke the same HTTP protocol with their own copies of the fetch, the timeout, the tags probe, the row parsing and the error classification. The provider now embeds through an adapter instance built from a prefix-free manifest, so the transport exists once; the adapter gained the three things the provider needed from it, a per-instance base URL and timeout, dimension learning for a model with no registry row, and an exported availability probe whose reason strings the provider always surfaced. On the advisor side, the nine `@spec-kit/shared` specifiers that lacked an extension now carry `.js`, and a test walks the server tree and fails on any extensionless specifier in an import, re-export, dynamic import or mock.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/embeddings/adapters/ollama.ts` | Modified | Options, dimension learning, `probeOllamaModel`, `resolveOllamaBaseUrl` |
| `shared/embeddings/providers/ollama.ts` | Modified | Delegates every request to the adapter; duplicated helpers removed |
| `shared/embeddings/{adapters,providers}/README.md`, `shared/README.md` | Modified | Single transport noted; env table regenerated |
| `mcp-server/lib/utils/skill-markdown.ts`, `lib/skill-graph/doc-frontmatter.ts`, five test files | Modified | `.js` specifiers |
| `mcp-server/tests/shared-import-specifier-extension.vitest.ts` | Created | Pins the extension convention with a negative control |
| `decision-record.md` | Created | ADR-001, the waiver and routing of four pre-existing advisor failures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both files were read in full and their behaviours listed side by side before the merge: prefixing, chunking, normalisation, health state and the cached availability promise stayed in the provider; fetch, deadline, probe, parsing and error mapping stayed in the adapter. The provider's fixed thirty-second deadline and explicit base URL became adapter options so nothing the factory relied on changed. The shared typecheck and tests ran first, which caught the README env table, then the advisor typecheck and the targeted suites, then the full advisor suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Merge the transport, keep both surfaces | The two interfaces serve two call sites; only the HTTP layer was duplicated |
| Prefix-free manifest for the provider's adapter | The provider applies prefixes and chunking before the request; passing them twice would double-prefix |
| A test rather than a lint rule | The server has no lint pipeline of its own; a vitest file runs wherever the suite runs, and its negative control proves the matcher |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Shared typecheck and test suite | clean; 18 pass after the README env table regenerated |
| Advisor typecheck | clean |
| Golden prompts, specifier pinning, shared-factory parity | 3 files, 21 tests pass |
| Extensionless `@spec-kit/shared` specifiers under the server | 0 outside the test that guards them |
| `unicode-normalization.ts` | unchanged |
| Full advisor suite | 13 assertions fail in 4 files that predate this child: stale `/memory:save` bridge, a 21-versus-20 metadata count, a settings-parity regex on a moved hook path, and a daemon flake that passed on rerun; waived by ADR-001 and routed to children 014 and 016 |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The provider still owns a module-level availability cache.** Its callers expect one probe per process; the adapter probes per call.
2. **The pinning test is a test, not a lint rule.** It runs with the advisor suite and in CI's routing job, not on save.
<!-- /ANCHOR:limitations -->

---

