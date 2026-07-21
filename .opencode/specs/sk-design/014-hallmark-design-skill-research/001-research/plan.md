---
title: "Research Plan: Hallmark reuse & learnings for sk-design"
description: "How the 20-iteration Hallmark study was run and synthesized."
_memory:
  continuity:
    packet_pointer: "sk-design/014-hallmark-design-skill-research/001-research"
    last_updated_at: "2026-07-20T09:19:14Z"
    last_updated_by: "spec-author"
    recent_action: "Document the completed Hallmark research methodology"
    next_safe_action: "Commit the research packet; adopt via 016-hallmark-adoption"
    blockers: []
    key_files:
      - ".opencode/specs/sk-design/014-hallmark-design-skill-research/001-research/research/lineages/sol-codex/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Research Plan: Hallmark reuse & learnings for sk-design

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

A deep-research fanout compared the external Hallmark design skill (placed at `../external/hallmark/`) against sk-design's hub, five modes, `/interface:*` commands, audit/fingerprint machinery, MD-generator, and styles corpus.

### Overview

Two independent GPT-5.6-SOL lineages (cli-codex + cli-opencode), 10 iterations each, concurrency 2, `stop-policy=max-iterations` (no early convergence), each producing a synthesized reuse/learning matrix.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Hallmark license + all references read; sk-design owners identified before verdicts.

### Definition of Done

- Both lineages complete 10/10 iterations; each emits a per-asset matrix with COPY/ADAPT/LEARN/INSPIRE-NEW/SKIP verdicts + a licensing verdict + a phased plan.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Parallel two-executor deep-research fanout via `fanout-run.cjs`, loop-type `research`, over the placed Hallmark repo.

### Key Components

- **Executors:** cli-codex (gpt-5.6-sol high fast) + cli-opencode (openai/gpt-5.6-sol-fast high), concurrency 2.
- **Subject:** `../external/hallmark/` (Nutlope/Hallmark, MIT, cloned minus `.git`).

### Data Flow

Hallmark source + sk-design source → per-lineage iterations write deltas + state → each lineage reduces to `research.md` → operator synthesis → adoption plan (`016-hallmark-adoption`).

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Run the fanout

Ten forced-depth iterations per lineage across licensing/routing, audit, extraction schema, motion, foundations/interface, themes/corpus, roadmap, matrix normalization, and adversarial validation.

### Phase 2: Synthesize

Each lineage reduces to a per-asset reuse/learning matrix + ranked adoptions + eliminated alternatives.

### Phase 3: Record

Capture both syntheses; hand the adoptions to the `016-hallmark-adoption` phase plan.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Convergence telemetry-only under max-iterations; correctness judged by grounding — every verdict cites the actual Hallmark file and the sk-design owner it maps to; 158 citations were path/line-range checked in the codex lineage's adversarial pass.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

cli-codex + cli-opencode; GPT-5.6-SOL; the placed Hallmark repo; the deep-loop fanout runtime.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research-only; no runtime change. The packet is a record.

<!-- /ANCHOR:rollback -->
