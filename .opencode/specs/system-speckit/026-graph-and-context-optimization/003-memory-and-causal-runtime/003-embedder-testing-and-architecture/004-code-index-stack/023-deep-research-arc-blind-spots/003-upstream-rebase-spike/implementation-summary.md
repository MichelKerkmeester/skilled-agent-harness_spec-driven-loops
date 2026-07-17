---
title: "Implementation Summary: 023F Upstream cocoindex-code Rebase Spike"
description: "Research summary and scoped implementation evidence for comparing local cocoindex-code against upstream v0.2.33."
trigger_phrases:
  - "023F summary"
  - "upstream rebase spike summary"
importance_tier: "high"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/003-upstream-rebase-spike"
    last_updated_at: "2026-05-19T20:22:26Z"
    last_updated_by: "codex"
    recent_action: "Summarized research and scoped wins"
    next_safe_action: "Commit intended 023F files once git metadata is writable"
    blockers: []
    key_files:
      - "research/delta-classification.md"
      - "research/rebase-plan.md"
      - "research/cross-packet-impact.md"
    session_dedup:
      fingerprint: "sha256:14c6258af47f6aa45fae1e696d9ec5a217a9196bd750217a86b3d53618f64962"
      session_id: "023-deep-research-arc-blind-spots/003-upstream-rebase-spike"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Phase A SDK bump remains unshipped until compatibility verification."
    answered_questions:
      - "Upstream prompt-policy equivalent exists as indexing_params/query_params."
      - "Dimensions should not be added as a per-side local knob."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/003-upstream-rebase-spike` |
| **Completed** | Implementation and validation complete on 2026-05-19; commit blocked by sandbox git metadata permissions. |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

023F turned the upstream drift concern from a vague release-count warning into a concrete rebase map. The local fork did not receive a full upstream import; it received two scoped wins that fit this spike: Svelte/Vue default include patterns and an explicit `sentence-transformers==5.4.1` pin.

### Scoped Wins

The package metadata now pins the local optional embedding stack to the benchmark-observed `sentence-transformers==5.4.1`. PyPI currently reports `5.5.0` as latest, so this closes the missing-pin finding without silently changing model/runtime behavior.

The default include pattern list now includes `**/*.svelte` and `**/*.vue`, matching upstream `cocoindex-code` v0.2.32 and the main CocoIndex SDK language detector. A new regression test locks those patterns in.

### Delta Classification Summary

The local fork should preserve hybrid FTS5/RRF fusion, path-class boosts, mirror deduplication, Jina reranking, query expansion, search-budget validation, registered embedder metadata, canonical-resource ranking, and code-aware chunking. Upstream should be merged for embedder param settings, defaults, doctor checks, daemon warnings, lazy CLI imports, dependency migration planning, and stable SDK compatibility once isolated.

| File/Surface | Summary Classification |
|--------------|------------------------|
| `settings.py` | `CONFLICT_RESOLVE`: local canonical-resource/doc-exclusion policy plus upstream embedder params and language defaults. |
| `shared.py` | `CONFLICT_RESOLVE`: local Ollama/registry prompt routing vs upstream paramized embedder factory. |
| `daemon.py` | `CONFLICT_RESOLVE`: local concurrency/runtime hardening vs upstream embedder-param doctor/warning path. |
| `indexer.py` | `CONFLICT_RESOLVE`: local metadata/hybrid/canonical chunk schema vs upstream indexing param forwarding and chunker registry. |
| `query.py` | `PRESERVE_LOCAL`: local retrieval stack is the main product win. |
| `cli.py` / `client.py` / `server.py` / `protocol.py` | `CONFLICT_RESOLVE`: overlapping daemon UX and protocol changes. |
| Local-only retrieval modules | `PRESERVE_LOCAL`: no upstream equivalent. |
| Upstream-only `embedder_params.py` / `embedder_defaults.py` | `MERGE_UPSTREAM` in Phase B. |

### Findings Closed

| Finding | Closure |
|---------|---------|
| HIGH 017-A | Confirmed upstream `cocoindex-code` `v0.2.33` vs local fork `0.2.3+spec-kit-fork.0.2.0`; release table written. |
| HIGH 017-B | Upstream `indexing_params/query_params` likely obsolete a custom prompt-policy design; Phase B directs 023A1 to import upstream first. |
| HIGH 020-A | Verdict remains fragile if drift and runtime cost land together; plan separates cheap wins from SDK/rebase phases. |
| MED 002-C | `sentence-transformers==5.4.1` pinned explicitly in local extra. |
| MED 017-C | Upstream rejects per-side `dimensions`; 023A3 should follow model-wide dimension handling. |
| MED 017-D | Svelte/Vue include defaults imported and tested; upstream SDK splitter support documented. |
| MED 020-D | Cross-packet plan prevents local metadata/prompt design from hardening against stale upstream assumptions. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | Modified | Pin local embedding extra to `sentence-transformers==5.4.1`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Modified | Add Svelte/Vue default include patterns. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_settings_patterns.py` | Created | Cover Svelte/Vue default pattern regression. |
| `research/upstream-sweep.md` | Created | Release/source/test/API sweep. |
| `research/delta-classification.md` | Created | Local/upstream file classification table. |
| `research/dimensions-knob-removal-impact.md` | Created | Impact note for 023A3. |
| `research/rebase-plan.md` | Created | Phase A/B/C rebase plan. |
| `research/cross-packet-impact.md` | Created | Handoff to 023A1/A2/A3/023B. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The upstream facts came from `gh api` release/source queries, a read-only upstream clone under `/private/tmp`, `gh search code` checks against the main SDK, and direct local file reads. Implementation stayed conservative: no SDK bump, no full module rebase, and no prompt-policy import in 023F.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not bump `cocoindex[litellm]` in 023F | Upstream moved to stable `>=1.0.6,<1.1.0`, while local custom code still runs on `1.0.0a33`; this deserves isolated Phase A verification. |
| Import Svelte/Vue patterns only | The upstream `cocoindex-code` change is a default include-pattern change, not a local grammar-registry analog. |
| Pin `sentence-transformers` to `5.4.1` | The active bench/test environment uses `5.4.1`; latest is `5.5.0`, so floating would change runtime without evidence. |
| Route prompt-policy to upstream params | Upstream already models per-side `prompt_name` and `input_type`, including validation and legacy bridge semantics. |
| Keep dimensions model-wide | Upstream explicitly rejects `dimensions` as an `indexing_params/query_params` key because query and index dimensions must match. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted pytest | PASS: `36 passed in 0.58s` for `tests/test_settings_patterns.py tests/test_config.py`. |
| Full pytest | PASS: `189 passed in 17.38s`. |
| Ruff | PASS: `All checks passed!` |
| Strict spec validation | PASS: 0 errors, 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **SDK bump deferred.** The local dependency remains `cocoindex[litellm]==1.0.0a33`; Phase A must test the stable `>=1.0.6,<1.1.0` migration.
2. **Upstream embedder params not imported yet.** 023A1 should do this before custom prompt-policy work.
3. **No full rebase.** Local fork and upstream remain structurally divergent by design after 023F.
4. **Commit blocked.** `git add` failed because the sandbox cannot write `.git/index.lock`; working tree files are written and verified.
<!-- /ANCHOR:limitations -->
