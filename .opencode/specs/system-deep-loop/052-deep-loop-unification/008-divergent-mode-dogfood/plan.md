---
title: "Plan: Divergent-Mode Live Dogfood — Research + Review"
description: "Execution plan for two parallel 10-iteration deep-loop runs against system-deep-loop, both in divergent convergence mode, via GPT-5.6-Sol-fast high."
trigger_phrases:
  - "divergent mode dogfood plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood"
    last_updated_at: "2026-07-11T08:00:00Z"
    last_updated_by: "claude"
    recent_action: "P0 incident during Phase 1 dispatch, docs recreated from context"
    next_safe_action: "Operator decision needed before any re-run"
    blockers:
      - "Both loops destroyed mid-run by a CLI-dispatched opencode session with unscoped repo write access"
    key_files: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Plan: Divergent-Mode Live Dogfood — Research + Review

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run `/deep:research` and `/deep:review` in parallel against `system-deep-loop` itself, both capped at 10 iterations, both with `convergenceMode: "divergent"` active, both using `cli-opencode`/`openai/gpt-5.6-sol-fast`/high — a genuine first live-fire test of the divergent-pivot mechanism shipped in packet 055, producing real research/review findings as a byproduct. No remediation in this packet; discovery only.

**Update**: Phase 1 dispatch triggered a real P0 incident — see `implementation-summary.md`. This plan's Phase 2/3 did not execute.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Both loops' config files show real `convergenceMode: "divergent"` and the specified executor — not defaulted or silently overridden.
- Raw `state.jsonl`/`deltas/` for each loop independently read and reconciled against the loop's own completion claim (never trusted blindly).
- `system-deep-loop`'s own tree confirmed unmodified (`git status` clean) throughout and after both runs.
- Real wall-clock concurrency confirmed (interleaved iteration timestamps across the two loops), not sequential.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Both loops are driven by faithfully executing the real skill-owned `deep_research_auto.yaml` / `deep_review_auto.yaml` phase_loop contracts (rendered via `render-command-contract.cjs`) — the same proven mechanism used for the 007 precedent and for packet 055's own implementation — not a hand-rolled substitute. Dispatched via the Workflow tool's `parallel()` (one `agent()` per loop) purely for genuine wall-clock concurrency; each agent still writes every real state file the interactive command would write (`state.jsonl`, `deltas/`, registry/findings, memory upserts, single-dispatch-disciplined `opencode run` calls).

Unlike the 007 precedent (which found-and-fixed), this packet is discovery-only: `treat_review_target_as_read_only` is an unconditional invariant for review, and research has no target-mutation path, so no remediation phase exists here by design.

**Realized gap**: neither loop's `opencode run` dispatch was isolated in a `git worktree`, and `deep-research`'s prompt pack carries no ALLOWED WRITE PATHS / BANNED OPERATIONS containment text at all (unlike `deep-review`'s, which does but was still insufficient as prose-only containment). This is the RM-8 destructive-scope-violation failure class this repo already documents in `cli-opencode/references/destructive_scope_violations.md` — its four-layer mitigation was not applied here.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Parallel Dispatch

Launch both loops concurrently via `Workflow`'s `parallel()`:
- **Research**: topic covering the full `system-deep-loop` surface (runtime, 4 subskills, `deep/*` commands, agent defs), `maxIterations: 10`, `antiConvergence.convergenceMode: "divergent"`, executor `cli-opencode`/`openai/gpt-5.6-sol-fast`/high.
- **Review**: `reviewTarget: ".opencode/skills/system-deep-loop"`, `reviewTargetType: "skill"`, dimensions `[correctness, security, traceability, maintainability]`, `maxIterations: 10`, `antiConvergence.convergenceMode: "divergent"`, `stopPolicy` left at default `"convergence"` (NOT `max-iterations` — that would force `decision=CONTINUE` before `step_handle_convergence.if_stop` and silently suppress the pivot branch), same executor.

**Outcome**: Research reached iteration 9/10 (8 independently verified), review reached iteration 7/10 (6 independently verified by that loop's own agent) before a dispatched CLI session deleted the entire packet. See `research/INCIDENT.md` and `review/INCIDENT.md`.

### Phase 2: Independent Verification (not reached)

Was to independently read raw state logs, spot-check dispatch content, confirm `git status` clean. Superseded by incident investigation, which confirmed `system-deep-loop`'s tracked tree was NOT touched — only the packet's own untracked artifacts were destroyed.

### Phase 3: Close-Out (not reached)

Pending operator decision on whether/how to re-run with proper isolation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Raw JSONL state-log reconciliation for both loops (the same "don't trust the reducer/self-report" discipline that caught real bugs in the 007 precedent).
- Spot-check dispatched iteration content directly, not just the synthesized summary.
- `git status` on `.opencode/skills/system-deep-loop/` before, during (if observable), and after both runs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs` — renders the real command contract both loops execute.
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` — the mechanism under live test.
- `.opencode/skills/cli-external/cli-opencode/SKILL.md` — single-dispatch discipline + cross-skill-parallel exception governing concurrent execution.
- `.opencode/skills/cli-external/cli-opencode/references/destructive_scope_violations.md` — the RM-8 precedent this incident reproduces.
- Precedent: `../007-comprehensive-deep-review/review/deep-review-config.json` — real, proven config shape for this exact target.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Both loops were read-only against `system-deep-loop`; nothing there needed rollback, and independent verification confirmed it stayed untouched. The packet's own untracked artifacts are unrecoverable via git (never committed) — partial recovery was performed from the orchestrating conversation's own transcript where content was directly known; see the two `INCIDENT.md` files for exactly what was and wasn't recoverable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Parent packet**: `../spec.md`
- **Precedent**: `../007-comprehensive-deep-review/`
- **Feature under test**: `../../055-deep-loop-divergent-mode/`
- **Incident precedent**: `.opencode/skills/cli-external/cli-opencode/references/destructive_scope_violations.md`
<!-- /ANCHOR:cross-refs -->
