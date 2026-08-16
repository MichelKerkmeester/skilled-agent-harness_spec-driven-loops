---
title: "Feature Specification: Weak-Model Loop Adherence (DeepSeek write-boundary hardening)"
description: "Make DeepSeek Flash and other weak models obey the deep-loop observation-only write boundary across all eight loop modes, so cli-pi/DeepSeek lineages complete instead of failing write-containment."
trigger_phrases:
  - "deepseek loop adherence"
  - "weak model write boundary"
  - "write containment"
  - "cli-pi deepseek"
  - "observation-only leaf"
  - "loop adherence"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-weak-model-loop-adherence"
    last_updated_at: "2026-08-16T16:55:42Z"
    last_updated_by: "claude"
    recent_action: "Authored the spec: problem, scope, requirements, acceptance criteria"
    next_safe_action: "Operator approves approach, then implement Phase 1 contract text"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions:
      - "Adopt the hard pre-write jail here, or split into a follow-on phase?"
    answered_questions: []
---
# Feature Specification: Weak-Model Loop Adherence (DeepSeek write-boundary hardening)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-16 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/010-weak-model-loop-adherence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Weak models do not obey the deep-loop's observation-only leaf contract, and today the runtime can only catch the breach after the fact — it cannot let such a model succeed.

A real two-executor deep-review run made this concrete. The DeepSeek-v4-flash lineage, running the observation-only review contract, instead ran mutating tooling repeatedly: `generate-context.js` 26 times, `validate.sh --strict` 24 times, plus 19 file writes, 15 file edits, and 3 `git checkout` calls. Those runs regenerated metadata and edited eight tracked paths **outside** the lineage's own artifact directory (unrelated `sk-design` changelogs and a `z_archive` packet's metadata). The write-containment layer detected the out-of-scope in-HEAD breach, reverted all eight paths from HEAD, and **failed the lineage fatally**. The stronger codex lineage (gpt-5.6-luna) ran the identical contract and stayed clean.

Two things follow. First, the failure is model-behavior, not a runtime defect — the containment net worked. Second, because containment is a post-hoc revert-and-fail, a weak model that breaches **cannot complete the loop**; it can only be caught. That blocks DeepSeek from being a usable executor across the deep-loop, most visibly through the cli-pi executor whose enforced roster leads with DeepSeek.

The dispatched leaf prompt is the root gap: it tells the model "write only inside your lineage directory," but it does **not** explicitly forbid running mutating tooling (`generate-context.js`, `validate.sh --recursive`, `git` write operations). A strong model infers that boundary; DeepSeek Flash does not.

### Purpose

Make DeepSeek Flash — and weak models generally — reliably stay inside the observation-only write boundary across all eight deep-loop modes, so a cli-pi/DeepSeek lineage completes a full run instead of failing write-containment. Close the gap by hardening what the model is told (explicit tooling prohibition, weak-model-tuned) and, where justified, by strengthening the boundary from revert-and-fail toward prevention.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add an explicit, weak-model-tuned prohibition to the dispatched leaf/lineage prompt: during an observation-only pass, never run `generate-context.js`, `validate.sh` (especially `--recursive`), `git` write commands, or any command that mutates files outside the lineage artifact directory; write only inside that directory.
- Apply the hardened contract across all eight loop modes (deep-research, deep-review, deep-ai-council, deep-improvement-common, agent-improvement, model-benchmark, skill-benchmark, deep-alignment), respecting each mode's real write surface (review is strictest; research/benchmarks legitimately write more).
- Route the weak-model directive through the small-model dispatch rules (`sk-prompt/sk-prompt-models`) so DeepSeek/MiniMax/Qwen/etc. get the reinforced wording.
- A regression test that reproduces the observed breach (a weak-model leaf attempting mutating tooling) and proves the hardened prompt path + containment keep the run inside scope.
- Verify DeepSeek is dispatchable per mode via cli-pi (roster, provider, thinking-effort mappings already exist) and record the per-mode adherence result.

### Out of Scope

- Converting write-containment from revert-and-fail to a hard pre-write jail (prevent, not revert). Evaluated in Section 6; if adopted it becomes its own phase, because it is a larger, safety-critical change to the containment layer.
- Changing DeepSeek's model quality or swapping the model. This packet makes the existing model comply, not replace it.
- The Pi native loop-driver dispatch gap (running the loop driver natively on Pi via pi-subagents) — a separate, already-identified gap tracked under the cli-pi program.
- Fixing the ten deep-review findings on packet 036 — those are planned separately.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/prompt-pack.ts` | Modify | Add the explicit observation-only tooling prohibition to the dispatched leaf prompt. |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Reinforce the fan-out lineage prompt's write-boundary wording (the `Do not touch any path outside <lineageDir>` block). |
| `.opencode/skills/sk-prompt/sk-prompt-models/**` | Modify | Weak-model dispatch directive for observation-only deep-loop passes. |
| `.opencode/skills/system-deep-loop/runtime/tests/**` | Create | Regression test reproducing the weak-model out-of-scope-tooling breach and proving the hardened path holds. |
| per-mode leaf prompt/contract surfaces | Modify | Apply the hardened contract to each mode's leaf where it dispatches. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The dispatched observation-only leaf prompt explicitly forbids mutating tooling | The rendered prompt for a review/observation pass contains a literal prohibition naming `generate-context.js`, `validate.sh`, and `git` write ops, plus "write only inside your lineage directory" — verifiable by grep of the rendered prompt. |
| REQ-002 | A DeepSeek Flash review lineage completes without a write-containment fatal | A re-run of the two-executor 036 review (or an equivalent scoped review) ends with the deepseek lineage `status: fulfilled`, `exitCode: 0`, zero out-of-scope reverts. |
| REQ-003 | The hardening applies to all eight loop modes | Each mode's dispatched leaf carries the hardened boundary wording appropriate to its write surface — recorded per mode with evidence. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Weak-model directive routed through the small-model dispatch rules | `sk-prompt/sk-prompt-models` carries the observation-only directive; DeepSeek/MiniMax/Qwen dispatch picks it up. |
| REQ-005 | Regression test reproduces the breach then proves the fix | Test fails against the old prompt (weak model runs out-of-scope tooling → containment fatal) and passes against the hardened prompt (stays in scope). Red-then-green. |
| REQ-006 | Per-mode cli-pi/DeepSeek adherence recorded | A results table names each of the eight modes with pass/fail adherence evidence for a DeepSeek-via-cli-pi lineage. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A DeepSeek Flash lineage completes a full deep-review run inside its lineage directory with zero write-containment reverts.
- **SC-002**: The hardened prohibition is present and grep-provable in the rendered leaf prompt for every one of the eight modes.
- **SC-003**: The regression test demonstrates red-then-green against the exact observed failure mode.
- **SC-004**: No behavior change for strong models (codex/luna) — their runs stay clean and unaffected.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Prompt hardening alone may not fully constrain a weak model | DeepSeek still occasionally breaches | Keep write-containment as the net; evaluate the hard pre-write jail (below) as a follow-on phase. |
| Risk | Over-restricting modes that legitimately write (research/benchmarks) | A mode's normal writes get blocked | Scope wording per mode by its real write surface; test each mode, not just review. |
| Decision | Revert-and-fail vs. hard pre-write jail | A jail lets a breaching weak model still succeed (writes silently dropped/redirected) instead of failing | Decide in `decision-record.md`; if adopted, split into its own safety-critical phase. |
| Dependency | Small-model dispatch rules (`sk-prompt/sk-prompt-models`) | Weak-model wording must live there per project rule | Consult that packet before composing the directive. |
| Dependency | cli-pi executor + DeepSeek roster (already built) | Needed for per-mode verification | `PI_SUPPORTED_MODELS`/`buildPiLineageCommand` already dispatch DeepSeek. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should this packet also adopt the hard pre-write jail (prevent-not-revert), or ship prompt-hardening first and split the jail into a follow-on phase? (Recommendation: ship prompt-hardening + per-mode + test here; evaluate the jail in `decision-record.md`.)
- For P1-4-style scope calls in each mode: which mode-owned files are legitimately writable by that mode's leaf vs. strictly forbidden?

<!-- /ANCHOR:questions -->
