---
title: "Feature Specification: Gateway Alignment Deep-Review (find what the 013 fix and audit missed)"
description: "A 10-iteration deep-review over the full deep-loop gateway-alignment surface — leaf agents in six runtimes, orchestrator YAMLs, deep command docs, AGENTS.md, and the append-mode-event gateway — hunting for misalignments the 013 fix and its read-only audit did not catch."
trigger_phrases:
  - "gateway alignment deep review"
  - "deep-loop leaf gateway review"
  - "append gateway missing things review"
  - "runtime agent gateway audit review"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/014-gateway-alignment-review"
    last_updated_at: "2026-08-25T12:10:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded the review packet as bound write authority for the deep-review run"
    next_safe_action: "Launch /deep:review :auto with the hybrid ox-alpha executors over the audit surface"
    blockers: []
    key_files:
      - "review/review-report.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Executor? ox-alpha via cli-pi, hybrid: cline-pass primary + openrouter fallback lineage."
      - "How many iterations? 10, stop-policy max-iterations (no early convergence)."
---
# Feature Specification: Gateway Alignment Deep-Review (find what the 013 fix and audit missed)

<!-- SPECKIT_LEVEL: review -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | review |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-25 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/014-gateway-alignment-review` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `013-runtime-agent-gateway-alignment` packet migrated the four affected deep-loop leaf agent prompts (`deep-research`, `deep-review`, `deep-alignment`, `ai-council`) across all six runtimes from a direct `*-state.jsonl` bash-append to the authoritative append gateway (`append-mode-event.cjs`). A read-only follow-up audit then swept AGENTS.md, the deep command docs, and the sixteen orchestrator YAMLs and reported them already aligned.

Both passes were driven by grep-based doc guards and a single reviewer. A guard finds only the patterns it encodes; a single reviewer sees only the angles it takes. Neither is a substitute for an independent, multi-pass adversarial read of the whole surface. Plausible gaps the prior work could have missed include: a leaf write site the guard's regex never matched, a runtime straggler outside the four resolved agent files, a `--event-json` argument still pointing at a multi-line delta, delta-versus-payload conflation in prose the conflation fix did not reach, a SKILL.md that now contradicts its own leaf agent, or an orchestrator YAML whose `append_to_jsonl` records are declared gateway-routed but whose surrounding prose still instructs a direct write.

### Purpose

Run an independent, 10-iteration deep-review over the full gateway-alignment surface to surface what the 013 fix and its read-only audit did not catch, classified P0/P1/P2 with cited evidence, so any real residual misalignment becomes a tracked, remediable finding rather than a latent bypass.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Review the four migrated leaf agent prompts in all six runtimes: `.claude`, `.opencode`, `.pi` (Markdown), `.codex` (TOML), and the `.cursor` / `.devin` symlinked copies.
- Review the sixteen deep orchestrator YAMLs under `.opencode/commands/deep/assets/` for direct-write bypass, `--event-json` pointing at a delta/state file, and delta/payload conflation.
- Review the eight deep command docs under `.opencode/commands/deep/*.md` and `AGENTS.md` for stale direct-state-write or gateway-bypass instructions.
- Review the `013-runtime-agent-gateway-alignment` packet's guard (`scripts/check-agent-gateway.sh`) for coverage gaps — patterns a real bypass could slip past.
- Cross-check the leaf agent prompts against their mode SKILL.md and the authoritative `state-jsonl.md` for coherence.

### Out of Scope

- Implementing fixes. This is an observation-only review; findings feed a separate remediation step per the deep-review contract.
- The append-gateway runtime (`append-mode-event.cjs`), the ledger, and the reducer scripts as engineering targets — they are read as the contract of record, not re-audited for their own internal correctness.
- Any surface outside deep-loop gateway alignment.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/review-report.md` | Add | The synthesized review report: verdict, findings (P0/P1/P2), remediation plan. |
| `review/` state artifacts | Add | Loop state written by the deep-review workflow (config, JSONL, iterations, strategy, dashboard). |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The review runs the full configured iteration budget | Ten iterations execute under `stop_policy: max-iterations`; convergence is telemetry-only and does not stop the loop early. |
| REQ-002 | Every finding is evidence-cited | Each recorded finding carries `[SOURCE: file:line]`; inference-only findings are rejected per the deep-review contract. |
| REQ-003 | The review emits a parseable verdict | `review-report.md` carries one of PASS / CONDITIONAL / FAIL with the mapping rule applied (any confirmed P0 → FAIL). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The whole audit surface is covered | Leaf agents (six runtimes), orchestrator YAMLs, command docs, AGENTS.md, and the guard each receive at least one iteration of coverage. |
| REQ-005 | A throttled fallback lineage degrades gracefully | An OpenRouter lineage that hits an upstream rate limit salvages without failing the whole run; the cline-pass lineage carries the review. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ten iterations complete with a synthesized `review/review-report.md` carrying all required sections and a single parseable verdict.
- **SC-002**: Every finding cites `file:line` evidence; no inference-only findings survive.
- **SC-003**: The full audit surface is covered across the run.
- **SC-004**: `validate.sh <spec-folder> --strict` exits clean once the run and packet docs are reconciled.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | OpenRouter stealth pool rate-limited at launch | Fallback lineage produces little | cline-pass lineage is the primary; salvage tolerates a dead lineage (exit 2). |
| Risk | cline-pass free tune hits its daily cap mid-run | Iterations stop before ten | Deep-review is lineage-aware; resume the remaining iterations on OpenRouter once its pool frees. |
| Risk | Reviewer reproduces the prior grep-only blind spots | Same misses repeat | Fresh context per iteration; dimension rotation; adversarial P0 re-read before any FAIL. |
| Dependency | `append-mode-event.cjs` gateway contract | The reference the review reads leaf prompts against | Shipped and tested under 012; unchanged. |
| Dependency | ox-alpha via cli-pi (cline-pass + openrouter) | The executor for every iteration | Both routes PONG-probed; cline-pass live at launch, openrouter throttled. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Executor, iteration count, stop policy, and scope are bound; the run is launch-ready.

<!-- /ANCHOR:questions -->
