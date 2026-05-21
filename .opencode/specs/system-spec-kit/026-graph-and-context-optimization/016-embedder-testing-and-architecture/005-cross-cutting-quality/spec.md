---
title: "016/005: Cross-cutting quality (phase parent)"
description: "Phase parent grouping the cross-cutting quality + verification + docs work that spans multiple 016 stacks. Three sub-phases: playbook quality audit, 20-iter deep-review of the 016-019 code stack, and skill-docs alignment sweep."
trigger_phrases:
  - "016/005 cross-cutting quality"
  - "stack verification and docs"
  - "playbook audit deep-review docs-alignment"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality"
    last_updated_at: "2026-05-18T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Created phase-parent umbrella merging playbook-audit + deep-review-stack + skill-docs-alignment"
    next_safe_action: "Strict-validate + commit restructure"
    blockers: []
    key_files:
      - "001-playbook-quality-audit/spec.md"
      - "002-deep-review-stack/spec.md"
      - "003-skill-docs-alignment/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000016005"
      session_id: "016-cross-cutting-quality"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
<!-- SPECKIT_LEVEL: phase-parent -->

# 016/005: Cross-cutting quality (phase parent)

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This phase parent groups the cross-cutting quality + verification + docs work that spans multiple 016 stacks (001 foundation + 002 mk-spec-memory + 003 skill-advisor + 004 cocoindex). Each child sweeps across the per-stack work to ensure alignment + correctness.

The grouping mirrors the per-stack pattern (e.g., 002-mk-spec-memory-stack, 004-cocoindex-stack) by collecting related cross-cutting work into one umbrella — keeping 016's root scannable.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:phase-map -->
## 2. PHASE MAP

| Phase | Focus | Status |
|---|---|---|
| `001-playbook-quality-audit/` | 017: Playbook quality audit | Complete |
| `002-deep-review-stack/` | 020 Deep-review of 016-019 stack via cli-devin SWE 1.6 | Planned |
| `003-skill-docs-alignment/` | 021: Skill docs alignment for 016-019 changes (phase parent) | planned |
| `004-skill-local-benchmarks-format/` | 016/005/004: Skill-local `benchmarks/` folder format + report promotion | IN PROGRESS — folder scaffolding + FORMAT.md shipped; benchmark_report.md + READMEs pending sk-doc agent dispatch |
| `005-cocoindex-install-hygiene/` | 016/005/005: CocoIndex install hygiene | BLOCKED - pipx repair cannot modify `~/.local/pipx` inside this sandbox |
| `006-benchmark-format-to-sk-doc/` | Consolidate benchmark format mechanics into a single sk-doc reference following the *_creation.md pattern | Complete |
| `007-cocoindex-install-hygiene-pipx-repair/` | Apply the open pipx editable repair after operator-side pipx config is available | Planned - blocked on operator pipx config |
| `008-spec-memory-vitest-stabilization/` | Scaffold-only: 168 pre-existing vitest failures across 5 clusters (mock exports, MCP connection flakes, lease timeouts, assertion drift, flag/config); execution deferred | Scaffold only (execution deferred) |
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:cross-refs -->
## 3. CROSS-REFERENCES

- Sibling: `../001-local-embeddings-foundation/` — foundation work this validates
- Sibling: `../002-mk-spec-memory-stack/` — TypeScript MCP stack this validates
- Sibling: `../003-skill-advisor-stack/` — skill-advisor stack this validates
- Sibling: `../004-cocoindex-stack/` — CocoIndex stack this validates
<!-- /ANCHOR:cross-refs -->
