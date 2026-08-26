---
title: "Feature Specification: System-Deep-Loop Broad Deep-Review (drift, bugs, and issues)"
description: "A 20-iteration deep-review over the whole system-deep-loop surface — the runtime, the eight /deep:* command docs and their orchestrator YAMLs, the deep-loop agents across six runtimes, the mode-packet SKILLs and references, and the recently-landed 015 changes — hunting for correctness bugs, security gaps, spec/implementation drift, and cross-runtime inconsistency beyond the gateway-alignment scope the 014 review already covered."
trigger_phrases:
  - "system-deep-loop broad review"
  - "deep-loop drift and bugs review"
  - "deep-loop commands agents review"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/016-system-deep-loop-review"
    last_updated_at: "2026-08-26T00:05:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the broad review packet as bound write authority"
    next_safe_action: "Launch /deep:review :auto with the hybrid ox-alpha-xhigh executors"
    blockers: []
    key_files:
      - "review/review-report.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Executor? ox-alpha via cli-pi, hybrid: cline-pass + openrouter, both at --thinking xhigh."
      - "How many iterations? 20 per lineage, stop-policy max-iterations (no early convergence)."
---
# Feature Specification: System-Deep-Loop Broad Deep-Review (drift, bugs, and issues)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-26 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/016-system-deep-loop-review` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 014 review was scoped narrowly to the gateway-alignment surface and surfaced ten real findings; the 015 remediation just landed a P0 fix plus five P1s across the runtime, prompt-packs, SKILLs, YAMLs, and the guard. Two things follow: the wider system-deep-loop surface has never had an equivalent adversarial pass, and the fresh 015 changes may themselves carry drift or edge cases. A single narrow review plus a fast-moving remediation is not evidence that the broader loop machinery is coherent.

Likely classes of latent issue on the wider surface: correctness bugs in the runtime scripts and reducers, security or containment gaps in the dispatch branches, spec-versus-implementation drift between the command docs / SKILLs and the runtime they describe, cross-runtime inconsistency between the six agent copies, stale or contradictory references, and edge cases the 015 changes introduced (for example the new confirm-mode containment or the merge-gate field handling).

### Purpose

Run an independent, 20-iteration deep-review over the whole system-deep-loop surface to surface correctness bugs, security gaps, spec/implementation drift, and cross-runtime inconsistency, classified P0/P1/P2 with cited evidence, so any real issue becomes a tracked, remediable finding rather than latent drift.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The deep-loop runtime: `.opencode/skills/system-deep-loop/runtime/` — `lib/` (gateway, ledger schemas, legacy projections, reducers, executor config, write-containment) and `scripts/` (fanout-run, fanout-merge, reduce-state, verify-iteration, append-mode-event, the guards).
- The eight `/deep:*` command docs under `.opencode/commands/deep/*.md` and their sixteen orchestrator YAMLs + presentation assets under `.opencode/commands/deep/assets/`.
- The deep-loop agents (`deep-research`, `deep-review`, `deep-alignment`, `ai-council`, `deep-improvement`) across the six runtime directories, including cross-runtime consistency.
- The mode-packet SKILL.md files and `references/` under `.opencode/skills/system-deep-loop/` (research, review, alignment, ai-council, improvement, benchmarks).
- The recently-landed 015 changes as a focus area for introduced drift or edge cases.

### Out of Scope

- Implementing fixes. This is observation-only; findings feed a separate remediation step.
- Surfaces unrelated to system-deep-loop.
- Re-deriving the 014 gateway-alignment findings (already remediated in 015); this run may confirm their closure but should spend its budget on new surface.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/review-report.md` | Add | The synthesized review report: verdict, P0/P1/P2 findings, remediation plan. |
| `review/` state artifacts | Add | Loop state written by the deep-review workflow (config, JSONL, iterations, strategy, dashboard, per-lineage). |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The review runs the full configured iteration budget | Twenty iterations execute per lineage under `stop_policy: max-iterations`; convergence is telemetry-only and does not stop the loop early. |
| REQ-002 | Every finding is evidence-cited | Each recorded finding carries `[SOURCE: file:line]`; inference-only findings are rejected. |
| REQ-003 | The review emits a parseable verdict | `review-report.md` carries one of PASS / CONDITIONAL / FAIL with any confirmed P0 forcing FAIL. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Broad surface coverage | The runtime, command docs, YAMLs, agents, and mode SKILLs each receive at least one iteration of coverage across the run. |
| REQ-005 | Both lineages contribute at highest thinking | cline and openrouter lineages both dispatch ox-alpha at `--thinking xhigh`; a rate-limited lineage salvages without failing the run. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Twenty iterations per lineage complete with a synthesized `review/review-report.md` and a single parseable verdict.
- **SC-002**: Every finding cites `file:line` evidence; no inference-only findings survive.
- **SC-003**: The broad surface (runtime, commands, YAMLs, agents, SKILLs) is covered across the run.
- **SC-004**: `validate.sh <spec-folder> --strict` exits clean once the run and packet docs are reconciled.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cline free tune hits its daily cap mid-run | Iterations stop before twenty | openrouter lineage carries on; the loop is resumable. |
| Risk | Broad scope dilutes depth per iteration | Shallow findings | Dimension rotation + fresh context per iteration; 20 iterations give room for depth. |
| Risk | Reviewer re-reports the already-remediated 014/015 findings | Wasted budget | Scope note excludes re-deriving gateway-alignment; treat 015 as a check-for-drift focus, not a re-review. |
| Dependency | ox-alpha via cli-pi (cline + openrouter) | The executor for every iteration | Both routes PONG-probed live; both accept `--thinking xhigh`. |
| Dependency | The shipped system-deep-loop runtime + 015 changes | The review target | Landed on v4 + main; read as the current state. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Executor, iteration count, stop policy, and scope are bound; the run is launch-ready.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Deep-Research Findings (auto-generated — canonical source: research/research.md)

Companion fan-out deep-research run (single cli-devin lineage `glm`, GLM 5.2,
10 iterations forced-depth) investigated latent issues beyond this packet's review
scope. 42 evidence-cited findings: **1×P0, 15×P1, 26×P2**.

- **F-029 (P0)**: append gateway returns `ok:true` when projection refresh fails —
  silent ledger/projection divergence (`append-mode-event.ts:510-516,539-544`).
- P1 cluster highlights: orphan retry-credit reset (F-007), severity downgrade to P2
  in registry reconstruction (F-010), whole-merge abort on one lineage miscount
  (F-011), reducer output blocked by anchor/corruption warnings (F-012/F-013),
  repair truncation after first bad line (F-034), salvage coverage/content gaps
  (F-038/F-039), post-hoc-only confinement for devin/pi/opencode kinds (F-022).
- Systemic patterns: loop-type registry fragmentation, projection-vs-ledger
  divergence, fail-closed amplification.
- Citations are leaf-reported file:line; full catalog with sources:
  `research/research.md` §5–§7. Open follow-ups: research/research.md §13.
<!-- END GENERATED: deep-research/spec-findings -->

<!-- /ANCHOR:questions -->
