---
title: "Summary: 018/002 baseline fixture"
description: "Authored 18-pair deterministic CocoIndex retrieval fixture"
trigger_phrases: ["018/002 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/002-baseline-fixture"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 18-pair fixture and idempotent validator"
    next_safe_action: "Run 003-comparison-measure against the fixture"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018002"
      session_id: "018-002-baseline-fixture-impl"
      parent_session_id: "018-002-baseline-fixture"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 018/002 baseline fixture

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Status | Complete |
| Artifact | `evidence/code-retrieval-fixture.json`, `evidence/fixture-validate.sh` |
| Owner | main agent |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Authored `evidence/code-retrieval-fixture.json` with 18 deterministic query → expected source pairs. Distribution: 5 easy, 7 medium, 6 hard. Domains include mk-spec-memory embedder code, mk-spec-memory handler code, Code Graph libraries, the mk-spec-memory rescue/fusion layer, CocoIndex Python code, spec-kit scripts, and Vitest/Python tests.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Surveyed representative repo files first, then wrote natural-language queries with enough overlap for easy cases and paraphrased/semantic-only wording for harder cases. Added `evidence/fixture-validate.sh` to check fixture shape, path existence, safe repo-relative paths, difficulty distribution, and `DEFAULT_INCLUDED_PATTERNS` compatibility from CocoIndex settings.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

- Fixture pairs are all indexable code paths; `system-spec-kit/templates/` was surveyed but not scored because it currently contains only `.md`, `.tmpl`, `.json`, and metadata files, which do not match CocoIndex's code-only include patterns.
- Difficulty mix is 5 easy / 7 medium / 6 hard for sensitivity across lexical and semantic retrieval behavior.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

- Run: `bash evidence/fixture-validate.sh` — PASS, exit 0, 18 pairs with distribution `easy=5`, `medium=7`, `hard=6`.
- Hand-review: queries avoid exact source snippets and avoid adversarial/human-unanswerable wording.
- Run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` — PASS, exit 0.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

Doc-template artifacts under `system-spec-kit/templates/` are not scored because they are not indexable under the active CocoIndex include patterns. That keeps the validator honest and avoids fixture rows that cannot be returned after a clean reindex.
<!-- /ANCHOR:limitations -->
