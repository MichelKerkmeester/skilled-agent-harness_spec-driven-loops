# 027 Research Phase 006 — peck-source deep mining

Sixth research pass over the 027 XCE-derived Spec Kit refinement packet. Where phase 001 (`001-peck-teachings-adoption/001-peck-teachings-for-spec-kit/peck-teachings-analysis.md`, 2026-06-02) mined peck's **README** and produced teachings T1-T4 (T2/T3/T4 adopted as children `001/{002,003,004}`; **T1 deferred**), phase 006 mines peck-master's **actual source** — agent prompts, CLI commands, the `reflect` skill, and the `revim-*` benchmark harness — for **net-new** adoptable mechanisms, and re-evaluates the deferred T1 coverage gate.

- **Iterations:** 001-018 (folder-scoped — this is a separate research packet; 001-013 discovery + 014-018 cross-model verify).
- **Executor:** cli-opencode `openai/gpt-5.5-fast --variant high`, **read-only**; the orchestrator (Claude Code) writes all artifacts (Gate-3-safe, compaction-safe — proven in phase 005).
- **Dispatch:** parallel background batches of 4; `</dev/null` + `gtimeout -k`; orphans killed between batches.
- **Primary outputs:** `research.md` (net-new teaching verdict matrix + convergence report), `sub-packet-proposal.md` (proposed new 027 child phase + T1 decision).
- **Layout:** `deep-research-config.json`, `deep-research-strategy.md`, `deep-research-state.jsonl`, `deep-research-dashboard.md`, `findings-registry.json`, `iterations/iteration-NNN.md`, `deltas/iter-NNN.jsonl`, `prompts/iteration-NNN.{md,out,err}`.

See `../research.md` (phase index) and `../005-live-rescope-coco-purge/research.md` (prior canonical synthesis).
