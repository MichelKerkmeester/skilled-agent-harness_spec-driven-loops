---
title: "Plan: Divergent-Mode Live Dogfood — Research + Review"
description: "Execution plan for two parallel 10-iteration deep-loop runs against system-deep-loop, both in divergent convergence mode, via GPT-5.6-Sol-fast high."
trigger_phrases:
  - "divergent mode dogfood plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/008-divergent-mode-dogfood"
    last_updated_at: "2026-07-11T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Retry complete: Phase 5 (retry) executed successfully, both loops verified terminal"
    next_safe_action: "Merge wt/0028-divergent-dogfood-retry to skilled/v4.0.0.0"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Divergent-Mode Live Dogfood — Research + Review

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run `/deep:research` and `/deep:review` in parallel against `system-deep-loop` itself, both capped at 10 iterations, both with `convergenceMode: "divergent"` active, both using `cli-opencode`/`openai/gpt-5.6-sol-fast`/high — a genuine first live-fire test of the divergent-pivot mechanism shipped in packet 055, producing real research/review findings as a byproduct. No remediation in this packet; discovery only.

**Update**: Phase 1's dispatch triggered a real P0 incident (destructive deletion by an unsandboxed CLI dispatch — see `implementation-summary.md`). After operator-approved fixes (worktree isolation, `deep-research` containment-parity fix), a full retry (Phase 5) completed successfully: both loops reached genuine `maxIterationsReached` terminal states with 10/10 real iterations each and no pivot fired either side.
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

### Phase 2: Incident Verification

Independently read raw state logs (what survived), confirmed `git status` clean on `system-deep-loop`'s tracked tree (zero deletions repo-wide), confirmed the loss was fully contained to this packet's own never-committed artifacts. See `research/INCIDENT.md` and `review/INCIDENT.md`.

### Phase 3: Recovery

Recreated the 5 packet-level spec docs from this conversation's own authored content (verbatim, previously validated). Recovered what was independently verifiable from each loop's own transcript/conversation record without fabricating raw JSONL/registry content that no longer existed.

### Phase 4: Remediation

Added the missing containment block to `deep-research/assets/prompt_pack_iteration.md.tmpl` (parity with `deep-review`'s), regenerated its compiled contract, verified clean. Created worktree `wt/0028-divergent-dogfood-retry` off a clean baseline commit.

### Phase 5: Retry

Relaunched both loops inside the worktree with per-iteration git checkpoints as an added safety net. Diagnosed and recovered from two instances of agents ending their turn to passively "wait for a notification" that never reliably arrives (once compounded by a wrong-PID mixup with an unrelated concurrent session's process) — resumed/relaunched each explicitly instructed to block synchronously instead. Both loops reached genuine terminal state: 10/10 real iterations each, `maxIterationsReached` on both, `divergentPivotFired:false` on both (never reached a genuine legal STOP within budget — correct, not a bug). A re-awakened original research-loop agent correctly avoided creating a competing third writer once it detected the relaunch already progressing, and completed `phase_synthesis` (`research.md`, `resource-map.md`) once the relaunch's real 10-iteration data was complete. Review did not run `phase_synthesis` — one remaining asymmetry between the two loops.
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
