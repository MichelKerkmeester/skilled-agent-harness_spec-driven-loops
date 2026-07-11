---
title: "Implementation Summary: Divergent-Mode Live Dogfood — Research + Review"
description: "Both loops completed 10/10 real iterations against system-deep-loop, both with convergenceMode=divergent active. Neither pivot fired (correct — neither loop reached a genuine legal STOP within budget). A first attempt was destroyed mid-run by an unsandboxed CLI dispatch; after a containment-parity fix and worktree isolation, the retry succeeded and was independently verified end-to-end."
trigger_phrases:
  - "divergent mode dogfood implementation summary"
  - "divergent mode dogfood retry complete"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood"
    last_updated_at: "2026-07-11T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Both loops verified complete: 10/10 iterations, no pivot fired, tree clean"
    next_safe_action: "Merge wt/0028-divergent-dogfood-retry to skilled/v4.0.0.0"
    blockers: []
    key_files:
      - "research/research.md"
      - "review/deep-review-findings-registry.json"
      - "research/INCIDENT.md"
      - "review/INCIDENT.md"
    completion_pct: 100
    open_questions:
      - "Whether to run review's phase_synthesis for parity with research's synthesis doc"
      - "Whether the real bugs found in system-deep-loop's own runtime warrant a separate remediation packet"
    answered_questions:
      - "Deliberately trigger the divergent pivot — confirmed by operator."
      - "Nest as phase 008 under 052-deep-loop-unification — confirmed by operator."
      - "After the incident, fix the containment gap and retry in a worktree — confirmed by operator."
---
# Implementation Summary: Divergent-Mode Live Dogfood — Research + Review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-divergent-mode-dogfood |
| **Completed** | 2026-07-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two parallel deep-loop dogfood runs against `system-deep-loop` itself — `/deep:research` hunting for improvements, `/deep:review` hunting for bugs/drift — both configured with `convergenceMode: "divergent"` to exercise the packet-055 pivot mechanism for the first time with real content-generating iterations. Both loops reached genuine `maxIterationsReached` terminal states: **10/10 real iterations each**, independently verified from raw state logs, not self-reports. **No divergent pivot fired in either loop** — both stayed `STOP_BLOCKED` at every convergence checkpoint (never reached a genuine legal STOP within the 10-iteration budget), so the pivot mechanism was correctly configured and ready but never actually exercised. The mechanism's absence-of-trigger was itself confirmed correct: `maxIterationsReached` is an explicitly-excluded pivot-eligibility reason by design.

The first attempt was destroyed mid-run (research at iteration 9, review at iteration 7) by a dispatched `opencode run` CLI session with unsandboxed repo write access — real, unrecoverable-via-git data loss, contained to this packet's own never-committed artifacts (`system-deep-loop`'s tracked code was untouched). After an operator-approved fix and retry, both loops completed successfully.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **First attempt**: launched both loops via the Workflow tool's `parallel()`, each faithfully driving the real skill-owned YAML contract. Traced `stopPolicy`/`convergenceMode` precedence beforehand to avoid silently suppressing the pivot branch.
2. **Incident**: a dispatched CLI session deleted the entire packet mid-run. The research loop's own agent self-discovered this, investigated thoroughly (git status, Trash inspection, receipt/exit-code analysis, prompt-pack asymmetry comparison), and wrote an evidence-backed `research/INCIDENT.md` rather than fabricating recovery. Independently confirmed the blast radius was contained to the never-committed packet — `system-deep-loop`'s tracked code was untouched.
3. **Recovery**: recreated the 5 packet-level spec docs from this conversation's own authored content (verbatim, previously validated); recovered what was independently verifiable from each loop's transcript without fabricating lost raw JSONL/registry content.
4. **Remediation**: fixed the confirmed root cause — `deep-research`'s prompt pack had zero write-scope containment, unlike `deep-review`'s. Added the missing ALLOWED WRITE PATHS/BANNED OPERATIONS/SCOPE VIOLATION PROTOCOL block, regenerated the compiled contract, verified clean via the contract-drift test suites.
5. **Retry, worktree-isolated**: created `wt/0028-divergent-dogfood-retry`, committed a clean recovery baseline before any dispatch, added per-iteration git checkpoint commits as an ongoing safety net (closing the "never committed = no recovery path" gap directly, not just at the start).
6. **Two stalls diagnosed and fixed mid-retry**: research's loop-driver agent grabbed an unrelated concurrent session's process PID via a broad `ps aux` scan and waited forever for it to exit — relaunched independently with an explicit fix (capture PID from your own spawn, never a process scan). Review's agent ended its turn to passively "wait for a notification" that never reliably arrives — resumed via `SendMessage` with an explicit instruction to block synchronously instead.
7. **A genuinely unexpected but benign resolution**: the *original* (not-relaunched) research agent, which I had judged deadlocked and worked around, woke up roughly two hours later, correctly detected the relaunched agent was already actively driving the same loop, and did **not** create a competing third writer — instead it verified the real work to completion and ran `phase_synthesis` itself (`research.md`, a 17-section synthesis of 47 cited findings; `resource-map.md`), closing a gap I hadn't asked either loop to close.
8. **Independent verification throughout, never trusting self-reports**: every completion claim (both the original 10-iteration counts, the terminal `loopStopped`/`loop_stop` events, the lock releases, the synthesis doc, the final checkpoint commits) was independently re-derived from the raw files before being reported.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave `stopPolicy` at default (not `max-iterations`) for review | `deep_review_auto.yaml:579,601` forces `decision=CONTINUE` before `step_handle_convergence.if_stop` when `stopPolicy=max-iterations`, which would silently prevent the divergent-pivot branch from ever firing |
| Fix `deep-research`'s containment gap directly, defer the larger worktree-as-default architecture change | The prompt-pack parity fix was bounded, safe, and closed a confirmed asymmetry; making git-worktree isolation a permanent default inside the shared YAML for all future CLI-executor dispatches is a much larger architectural change to production infrastructure that deserves its own dedicated planning cycle, not a rushed bolt-on |
| Do not resume the original workflow via `resumeFromRunId`; relaunch as independent agents instead | The underlying cause of the deadlock (wrong-PID tracking) needed an explicit fix stated in the new dispatch's own instructions, not just a cache-hit replay of the same broken logic |
| Do not create a third writer when the original research agent unexpectedly woke up mid-relaunch | Matches the entire premise of this incident response — avoiding exactly the kind of uncoordinated concurrent-writer conflict that caused the original data loss |
| Discovery-only scope held throughout, including the retry | Both loops remained structurally read-only against `system-deep-loop`; real bugs found were reported, not fixed, matching the packet's original design |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Research: real iteration count | 10/10, confirmed via raw `deep-research-state.jsonl` (10 `type:"iteration"` records) |
| Research: terminal event | `loopStopped`, `stopReason:"maxIterationsReached"`, `divergentPivotEligible:false`, `divergentPivotFired:false` |
| Research: synthesis | `research.md` (201 lines, 37.7KB, 17 sections, 47 cited findings), `resource-map.md` — both confirmed real |
| Research: lock released | Confirmed — `.deep-research.lock` no longer exists |
| Review: real iteration count | 10/10, confirmed via raw `deep-review-state.jsonl` (10 `type:"iteration"` records) |
| Review: terminal event | `loop_stop`, `hardStopReason:"maxIterationsReached"`, `divergentPivotFired:false`, `iterationCount:10` |
| Review: lock released | Confirmed — `.deep-review.lock` no longer exists |
| Review: synthesis | Not run — `phase_synthesis` (`review-report.md`) is the one remaining asymmetry vs. research |
| `system-deep-loop`'s own tree | Clean throughout and after both runs — only the expected benign `deep-loop-graph.sqlite`/`observability-events.jsonl` regeneration noise, zero source/doc changes |
| Content genuineness | Spot-checked iteration-001.md and iteration-010.md directly (research); review's per-iteration findings read with full evidence chains — both genuine, not templated |
| Stray artifact cleanup | One confirmed-empty accidental file (`retry-placeholder`, created outside allowed-write scope by a research iteration) found and removed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:findings -->
## Real Findings Surfaced (selection — both loops are discovery-only, nothing here was fixed)

**Research (47 findings, 41 P1/6 P2)** — full detail in `research/research.md`:
- Council route proof claims `@ai-council` agent identity that the live seat subprocess never actually selects — false provenance at the process boundary.
- Council cost guards compute an upper bound but never enforce it (unbounded `Promise.all` seat fan-out).
- Canonical LEAF agent definitions (`.opencode/agents/deep-research.md`, `.claude/agents/deep-research.md`) instruct a schema the live prompt pack/validator rejects, and omit the mandatory delta-artifact write — a native agent following its own canonical definition gets redispatched.
- `reduce-state.cjs`'s `extractListItems` only matches flat bullet lists; every iteration narrative uses H3 sub-headings, so `findings-registry.json.metrics.keyFindings` stayed **0 across all 10 iterations** despite 51 real findings landing in the coverage graph.
- Deep-improvement (Lane A) independently reproduces the same defect classes on its own surfaces, including a structurally-impossible-to-satisfy repeatability gate.

**Review (15 open P1, 0 P0)** — full detail in `review/deep-review-findings-registry.json`:
- `reduce-state.cjs`'s traceability rollup drops resolved search-debt from canonical state (iteration 5 executed and failed `checklist_evidence`; current registry still shows it merely "deferred").
- Live skill-benchmark report can show PASS while masking active P1 evidence and Mode-A-only rerun guidance.
- The deep-review skill/prompt-pack requires delta/registry writes the canonical LEAF agent definition explicitly forbids — a genuine cross-file contract conflict.
- A coverage-graph gap (iterations never emitting `graphEvents`) recurred in this retry exactly as it had in the destroyed first attempt, confirming it's a real, reproducible bug in the review loop's own mechanics, not a one-off.

None of the above were remediated — that is a deliberate, separate future decision, not an oversight.
<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Review never ran `phase_synthesis`** — `review-report.md` does not exist. The raw 10-iteration data and findings registry are real and complete; only the synthesized narrative report is missing, unlike research's.
2. **The original destructive incident's root cause is not fully closed** — only `deep-research`'s prompt-pack containment gap was fixed (prose-level, matching `deep-review`'s existing level). The broader architectural mitigation (making `git worktree` isolation a permanent default for all CLI-executor dispatches in the shared YAML) was deliberately deferred as out of scope for this packet — it's shared production infrastructure and deserves its own planning cycle.
3. **This packet's own retry consumed real cost**: 20 real high-reasoning-effort dispatches at minimum across two full loop runs (the first destroyed attempt plus the successful retry), roughly double the originally estimated cost, because of the incident.
4. **The real bugs both loops found in `system-deep-loop`'s own runtime are not fixed** — by design (discovery-only scope) — and remain open for a future, separately-scoped remediation packet if warranted.
5. **The worktree (`wt/0028-divergent-dogfood-retry`, ~25 commits ahead of `skilled/v4.0.0.0`) has not yet been merged** — that is the next operator-facing step.
<!-- /ANCHOR:limitations -->
