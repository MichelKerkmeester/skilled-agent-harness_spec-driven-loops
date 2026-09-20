---
title: "Research Outcome: Skill & Advisor JSON Optimization"
description: "In-progress record of the three-model deep-research fan-out (SOL-high / GLM-5.2-high / Grok-4.5-high, 5 iters each concurrent, no early convergence) into skill/advisor JSON optimization; setup complete, run pending, synthesis to follow."
trigger_phrases:
  - "skill json optimization research outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research"
    last_updated_at: "2026-07-29T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Fan-out complete (15/15 iters); synthesized the cross-lineage ranked opportunity map"
    next_safe_action: "Operator decides whether to schedule the Tier-1 follow-up program (O1 first)"
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "029-skill-json-optimization-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Highest-leverage cluster = the derived block (no regenerator, no freshness gate, TS-vs-Python schema conflict), 3/3 lineage agreement"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Research Outcome: Skill & Advisor JSON Optimization

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-29 |
| **Track** | sk-doc |
| **Lineages** | sol-high (cli-opencode `openai/gpt-5.6-sol` high) · glm-high (cli-devin `glm-5-2`) · grok-high (cli-cursor `cursor-grok-4.5-high`) |
| **Depth** | 5 iterations each, concurrency 3, stop-policy max-iterations — 15/15 completed, 0 failed |
| **Findings** | 90 total (30 + 28 + 32); synthesized to a ranked opportunity map |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet frames and runs an independent, three-model deep-research investigation into whether every skill- and skill-advisor-related JSON across `.opencode/skills/` is as optimized, automated, effective, tested, and integrated as it can be. The charter, five research dimensions, and three-lineage concurrent fan-out plan are authored; the run itself produces the findings. Research only — no fix is implemented here; the deliverable is a ranked opportunity map for an operator-gated follow-up.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three independent deep-research lineages via the deep-loop fan-out driver, each on a distinct high-effort model, all three concurrent, forced to 5 iterations (convergence treated as telemetry only). Each lineage runs the standard state machine with fresh context per iteration and converges to its own `research.md`; a synthesis pass then merges them into one ranked report. Model ids were verified against `executor-config.ts` before dispatch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Ran three models rather than one to triangulate — cross-lineage agreement is the confidence signal, single-lineage claims are flagged. Forced max-iterations depth so no lineage stops early on a low-novelty pass. Kept the run to research only (no implementation), matching the deep-research contract, so the output is a ranked opportunity map an operator can schedule against.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Run complete: `orchestration-summary.json` reports total=3, succeeded=3, failed=0; each lineage recorded 5 `complete` iterations under `max-iterations` (convergence never stopped a loop early). Per-lineage `research.md` produced (sol-high 26.6 KB / glm-high 16.5 KB / grok-high 8.0 KB) and the cross-lineage synthesis written to `research/research.md`. Model ids were verified against `executor-config.ts` before dispatch; all three CLIs authed (each produced iterations citing real files). Packet `validate.sh --strict` clean.

Headline result — 3/3 lineages agree the highest-leverage cluster is the `derived` block (no skill-root regenerator, no freshness gate, TS-writer-vs-Python-compiler schema conflict); grok-high grounded the "selection under-tested" theme with a live routing miss (`sk-prompt` ranked above `sk-doc` on a parent-hub scaffold prompt). Four Tier-1 opportunities (O1–O4) form a coherent follow-up program with O1 as the prerequisite.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

Runs on the diverged local `skilled/v4.0.0.0` branch per operator choice; research writes are confined to this packet's `research/` tree and never touch the pre-existing dirty files from other sessions. Findings are model-generated hypotheses — each must be re-confirmed against source before any fix is scheduled (finding = hypothesis).
<!-- /ANCHOR:limitations -->
