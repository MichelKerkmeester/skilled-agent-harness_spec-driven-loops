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
    packet_pointer: "system-deep-loop/033-deep-loop-behavior-benchmarks"
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

### D-009 — Writer fallback: GLM-5.2-max primary, MiMo-V2.5-Pro fallback WITH mandatory review (RESOLVED 2026-07-02, operator-directed)

The GLM quota pool (`zai-coding-plan`) is near exhaustion. Operator direction: fall back to **MiMo-V2.5-Pro** (`xiaomi-token-plan-ams/mimo-v2.5-pro`, `--variant high` — forwarding confirmed for this provider) for authoring/implementation dispatches, **with mandatory orchestrator review of every MiMo deliverable before use**. Rationale for the strengthened review gate: MiMo's benchmarked weakness is format adherence and instruction restraint rather than correctness (it optimizes output shape and has been observed ignoring restraint constraints), so each MiMo-authored artifact gets contract-by-contract machine verification plus a prose read-through before anything consumes it. Same COSTAR framework as GLM; prompts add the MiMo-specific `Style: precise, no preamble` / `Audience: automated pipeline` levers. Writer legs are unchanged in the benchmark itself — this decision covers the authoring executor only.

### D-010 — Delegation evidence is a per-mode KIND, not just task-dispatch (RESOLVED 2026-07-02, phase-004 pre-authoring)

The runner's delegation model (`DISPATCH_RE` task events + route-proof records + `role_absorption` when `te==0 && fixtureGained`) was built for the single-LEAF-dispatch shape of research/review/context. It does NOT fit the two phase-004 modes, and applying it unchanged would produce systematic false `role_absorption`:

- **deep-ai-council is primarily IN-CLI**: the common-case council deliberates using the active runtime's own model bench as seats, with **zero external dispatch**. A correct council run produces `ai-council/seats/round-NNN/*.md` per-seat artifacts and a `council-report.md` with per-seat sections — but `te==0`. Under the current logic that is flagged as absorption, which is wrong.
- **deep-improvement is a proposal-loop**: "delegation" is packet-local **candidate + evaluator-score** artifacts (`score-candidate.cjs` output carrying `rubricVersion`/`inputHash`), produced through the candidate/dispatcher/scorer seams — again not a single-leaf dispatch.

Resolution: add `expected_delegation.evidence_kind` with three values. `task_dispatch` (default — unchanged behavior, all existing RSB/CXB/RVB contracts keep working with no field). `seat_artifacts` (council) — delegation is satisfied when ≥ `min_seats` seat artifacts are written under the fixture's `ai-council/seats/`; council-absorption is a produced plan/report with **no seat diversity** (missing seat artifacts), and `te==0` is NORMAL not a failure. `candidate_evidence` (improvement) — delegation is satisfied by packet-local candidate + evaluator-score artifacts. The runner gains a post-run fixture artifact scan (it already snapshots fixture files for `fixtureGained`) that counts seat/candidate artifacts by path pattern.

**Implemented form (stronger than "guard to task_dispatch only"):** absorption is **mode-aware** via a `hasDelegationEvidence(deleg, obs)` helper — the `role_absorption` gate fires when `role_absorption_forbidden`, a work product exists (`fixtureGained`), and the mode's own evidence is absent (`task_dispatch`: zero task events with `min_task_events>0`; `seat_artifacts`: zero seats; `candidate_evidence`: zero candidate/score artifacts). This keeps the research/review/context legs byte-identical (task_dispatch retains its `min_task_events>0` precondition) **and** still catches genuine council/improvement absorption on their own evidence shape, rather than blinding the bucket for those modes. Verified by the hermetic suite: task_dispatch absorption unchanged; an in-CLI council with persisted seats is NOT flagged; a council that emitted a plan with zero seats IS.
<!-- /ANCHOR:decision -->
