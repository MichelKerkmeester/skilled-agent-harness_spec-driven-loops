---
title: "Spec: GPT Reliability Research — Simplify/Optimize Our Systems for GPT Executors"
description: "30-iteration orchestrator-hosted deep-research campaign using GPT-5.5-fast xhigh as the researcher: identify which parts of our commands, gates, deep-loop workflows, agents, skills, and hooks can be simplified, optimized, or re-approached so GPT-backed executors in opencode use them correctly as intended, like Claude does. Seeded by packet 033's measured failure modes (Gate-3 halts every mode/both efforts; structured-mode stalls; dispatch-mode absorption; presentation gaps)."
trigger_phrases:
  - "gpt reliability research"
  - "simplify systems for gpt"
  - "034 research"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/034-gpt-reliability-research"
    last_updated_at: "2026-07-03T00:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Spec authored; campaign not started"
    next_safe_action: "Run iteration 001 against angle A1 (Gate-3 precedence)"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-spec-init"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does --variant xhigh forward to the provider reasoning parameter? Accepted-unverified (same status as med/high in 033)."
    answered_questions:
      - "Who hosts the loop? The ORCHESTRATOR (Claude session), not GPT — packet 033 proved GPT cannot reliably self-host deep-loop commands (Gate-3 halts, stalls). GPT runs bounded single-iteration research dispatches only."
---
# Spec: GPT Reliability Research — Simplify/Optimize Our Systems for GPT Executors

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-03 |
| **Parent Packet** | None (top-level under deep-loops track; evidence-successor to 033-deep-loop-behavior-benchmarks) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 033 measured, across ~120 runs, exactly where GPT-backed executors diverge from Claude on our command surfaces: (1) a Gate-3 documentation halt in every mode at both reasoning efforts; (2) silent stalls in the structured modes (context, council); (3) role absorption in the dispatch modes at medium effort; (4) presentation-contract gaps on bare commands. Those are symptoms. This packet researches the CAUSES on our side: which parts of our systems — CLAUDE.md gates, command YAML contracts, deep-loop workflow protocols, agent definitions, skill routing, hooks, prompt-pack templates, mode registry — are structured in ways GPT handles poorly, and what simplification, optimization, or alternative approach would make GPT use them correctly as intended, like Claude does.

Method: an orchestrator-hosted research loop of up to 30 bounded iterations. The orchestrator (Claude session) defines investigation angles, dispatches ONE research iteration at a time to `openai/gpt-5.5-fast --variant xhigh` via cli-opencode, checks progress on a ~2-minute cadence, verifies each iteration's output quality (evidence-cited, non-stuck, non-vacuous), steers or rotates angles when output degrades, and accumulates deduped findings into a registry. GPT never hosts the loop — that architecture is itself an application of this packet's thesis.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** read-only research over the repo's executor-facing surfaces (CLAUDE.md gates, `.opencode/commands/deep/**`, deep-loop-workflows skills + shared runtime, `.opencode/agents/**`, skill-advisor routing, hooks, prompt-pack templates, mode-registry); findings registry; ranked synthesis with 033-linked verification cells.

**Out of scope:** implementing any proposal (future packet); modifying system files; re-running 033 benchmark legs; researching non-executor surfaces (UI, unrelated MCP servers).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (loop)**: Up to 30 research iterations, each a single bounded `opencode run` dispatch (xhigh) with a per-iteration angle brief, seed evidence, and an output contract requiring `file:line` citations and concrete proposals tagged simplify | optimize | re-approach.
- **REQ-002 (orchestration)**: The orchestrator checks each running iteration on a ~2-minute cadence, kills/retries stuck or vacuous iterations (one retry, then rotate angle), and records a per-iteration verdict (productive | thin | stuck | off-target) in the iteration log.
- **REQ-003 (angles)**: Angles are defined manually by the orchestrator, seeded from 033's backlog, and adjusted dynamically. Initial set (adjustable): A1 Gate-3/CLAUDE.md gate design for autonomous executors; A2 command YAML presentation+setup contracts; A3 deep-loop LEAF dispatch protocol vs GPT absorption; A4 structured-mode loop protocols (council seats, improvement evaluator) vs stalls; A5 agent definition files parseability for GPT; A6 skill-advisor routing + trigger phrases; A7 hooks/session-start context volume vs GPT context discipline; A8 prompt-pack templates + budgets/watchdogs; A9 mode-registry + command router indirection depth; A10 cross-cutting: what Claude tolerates that GPT does not (instruction density, gate ordering, implicit conventions).
- **REQ-004 (findings)**: A findings registry accumulates deduped findings with evidence, affected surface, proposed change, expected reliability effect, and effort class. Convergence rule: 3 consecutive iterations with zero new registry entries on the active angle → rotate; all angles dry → stop early.
- **REQ-005 (synthesis)**: A final synthesis doc ranks proposals (P0/P1/P2) by measured-impact linkage to 033 findings, and states which 033 benchmark cells would flip if implemented (re-runnable via the 033 behavior benchmarks as the acceptance harness).
- **REQ-006 (safety)**: Research is read-only against the repo. GPT iterations write ONLY into this packet's `research/` tree. No system files are modified in this packet.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. ≥ 20 productive iterations (or early convergence with all angles dry), each with evidence-cited output persisted under `research/iterations/`.
2. Findings registry with deduped, evidence-linked entries covering ≥ 8 of the 10 angles.
3. Synthesis doc with ranked proposals, each mapped to at least one measured 033 failure it addresses and the benchmark cells that would verify the fix.
4. Zero writes outside the packet tree; orchestrator iteration log complete (verdict per iteration).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Handling |
|---|---|
| GPT iteration stalls or halts inside a research dispatch | Orchestrator-hosted loop; read-only briefs; kill + retry once, then rotate angle |
| Vacuous output without evidence | Output contract demands file:line citations; thin verdicts excluded from registry |
| OpenAI quota wall | Detect, pause, resume after reset (033 env_error precedent) |
| Depends on 033 scorecards as seed evidence | Already committed and pushed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does `--variant xhigh` forward to the provider reasoning parameter? Accepted-unverified (same status as med/high in 033); the campaign treats it as best-effort.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

- Per-iteration hard cap ~8 minutes; campaign wall-clock bounded by 30 iterations plus orchestration overhead.
- All state externalized in the packet (registry + iteration log) so the campaign is resumable after any interruption.
- Zero mutation of system files; fixture-free (read-only research, no restore machinery needed).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- GPT dispatch emits a Gate-3-style halt inside a read-only brief → treat as stuck, kill, retry once with an explicit "no file writes are requested; do not ask about spec folders" line.
- Provider quota wall mid-campaign → pause loop, resume after reset; iterations already persisted are never re-run.
- An angle produces contradictory proposals across iterations → both enter the registry; the synthesis adjudicates with 033 evidence.
- Iteration output exceeds usable size or ignores the contract → graded thin/off-target; findings not extracted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

Level 2. LOC is minimal (docs + research artifacts only); the complexity is operational — a long-running orchestrated loop with dynamic steering — which the plan externalizes into per-iteration state and simple convergence rules.
<!-- /ANCHOR:complexity -->
