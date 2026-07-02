---
title: "Decision Record: Deep-Loop Behavioral Benchmarks"
description: "Resolved design decisions (package layout, contract/evidence separation, scoring model, fixture isolation, pilot-first ordering) plus the two open decisions phase 1 must resolve by probe: the Claude baseline executor and the shared runner's home."
trigger_phrases:
  - "decision record"
  - "deep loop behavior benchmark decisions"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks"
    last_updated_at: "2026-07-02T07:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Initial decisions recorded at planning time"
    next_safe_action: "Resolve OPEN-001 and OPEN-002 via phase 1 probes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-dr-init"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "OPEN-001: Claude baseline executor (same-host opencode Anthropic model vs cli-claude-code vs Claude Code native leg)."
      - "OPEN-002: shared runner home (deep-loop-workflows/scripts/ vs deep-loop-runtime/scripts/)."
    answered_questions: []
---
# Decision Record: Deep-Loop Behavioral Benchmarks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:decision -->
## Decisions

### D-001 — A third sibling package per sub-skill, not a new command or a packet-only artifact (RESOLVED)

Each sub-skill gets `behavior_benchmark/` alongside its existing `feature_catalog/` and `manual_testing_playbook/`, following those packages' naming and index conventions. Rejected alternatives: (a) a new `/deep:behavior-benchmark` command — heavier surface than needed; the runner is operator-invoked tooling, not an agent workflow, and `deep:skill-benchmark`/`deep:model-benchmark` already occupy the adjacent command space with DIFFERENT charters (skill structure; fixture-based model scoring); (b) a one-off spec-packet benchmark like 031 phase 012 — exactly the non-durable shape this packet exists to replace.

### D-002 — Contract/evidence separation (RESOLVED)

Skill packages hold durable contracts (scenarios, rubric links, budgets, Claude baselines). Run transcripts and scored results land in this packet's phase folders. This mirrors the proven playbook convention (playbook = contract, spec packets = run evidence) and keeps skill folders from accumulating stale run output.

### D-003 — Two-output scoring: one terminal bucket + one 5-dimension score per run (RESOLVED)

Buckets (extending 031 phase 012's proven taxonomy with `role_absorption`, `stuck_no_progress`, `setup_misbind`, `partial`, `refused`, `crash`) answer "what happened"; dimensions (invocation, presentation, delegation, completion, latency) answer "how well". A single blended number was rejected because it hides exactly the failure classes the operator cares about (stuck vs slow vs wrong-agent are different problems with different fixes).

### D-004 — Fixture isolation is a hard precondition, not a convention (RESOLVED)

Deep-loop commands write artifacts into their targets, so every scenario targets a frozen fixture under this packet, restored git-clean between runs, and the runner asserts pre/post that nothing outside the fixture tree + results dir changed. A benchmark that can contaminate production spec folders is worse than no benchmark.

### D-005 — Pilot-first on deep-review, calibrate, then roll out (RESOLVED)

deep-review has the richest precedent (031 phase 012 tested it; this repo's fan-outs exercise it constantly), so its full three-executor round runs FIRST and its retro amends the rubric/budgets before the other four packages are authored. Rejected: authoring all 32 scenarios up front — any rubric ambiguity would be multiplied by five before being discovered.

### D-006 — Single-sample cells by default (RESOLVED)

One run per scenario/executor cell, with provenance marked, and manual 3-sample reruns only for contested cells. This benchmark hunts behavioral FAILURE CLASSES, not confidence intervals; tripling ~96 runs for statistical polish fails the cost/value test. Matches 031 phase 012's smoke philosophy, which produced decision-grade findings.

### D-007 (was OPEN-001) — Claude baseline executor: cli-claude-code leg (RESOLVED 2026-07-02, by probe)

Probe result: `opencode models` lists NO Anthropic provider (providers present: opencode, deepseek, kimi-for-coding, minimax, zai-coding-plan, openai) — option (a), the same-host Anthropic model, is unavailable on this install. Resolution: **option (b), the `claude` CLI leg** (verified installed, v2.1.198), scripted through the same runner via `claude -p` with a JSON output format. STATED CONFOUND, to be cited on every latency ratio this leg anchors: the baseline runs a different host binary, so host overhead (session bootstrap, tool wiring) is folded into the model comparison. Option (c) (manual Claude Code native leg) remains the fallback if scripted `claude -p` runs prove unable to exercise the command surfaces.

### D-008 (was OPEN-002) — Shared runner home: deep-loop-workflows/shared/behavior-benchmark/ (RESOLVED 2026-07-02)

`deep-loop-workflows/shared/` already exists as the parent skill's cross-mode shared surface (currently holding `synthesis/`). The runner, the framework reference, and the runner's own hermetic test fixtures live together at `.opencode/skills/deep-loop-workflows/shared/behavior-benchmark/`:

- `framework.md` — the single-source framework reference (scenario schema, rubric, taxonomy, budgets, rerun policy)
- `behavior-bench-run.cjs` — the shared scenario runner
- `tests/behavior-bench-run.test.cjs` + `tests/fixtures/` — hermetic runner tests and canned event streams

deep-loop-runtime/scripts/ was rejected: the runner is a workflow-layer measurement concern spanning all five modes, not a convergence-loop runtime concern, and parent-skill ownership matches how `mode-registry.json` already works.
<!-- /ANCHOR:decision -->
