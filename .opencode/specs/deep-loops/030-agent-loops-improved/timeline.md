---
title: "156 Agent-Loops-Improved Chronological Timeline"
description: "Git-commit-ordered timeline of the 123-agent-loops-improved program, from reference research through deep-loop implementation to the loop-systems remediation track."
trigger_phrases:
  - "156 timeline"
  - "agent loops improved timeline"
  - "deep-loop program chronology"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved"
    last_updated_at: "2026-07-01T20:35:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Added epoch four (documentation truth audit, uncommitted at time of writing)"
    next_safe_action: "Add real commit hashes to epochs three and four once this work is committed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "changelog-156-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# 156 Agent-Loops-Improved Chronological Timeline

> **Sort key.** Git commit order, oldest first, for every commit that touched the `123-agent-loops-improved` packet. Epochs three and four's entries are pending commit at the time of writing and are ordered by real work sequence, not by commit hash, until they are committed.
> **What this packet did.** It mined two reference loop codebases for improvement seams and then shipped them as a phased deep-loop program: deep-loop-runtime resilience and convergence hardening, deep-loop-workflows guardrails, a speckit autopilot lifecycle, an advisor routing projection, UX and observability surfaces, hermetic test isolation, a remediation track that audited and fixed the shipped state, a research-backlog remediation track that turned a deep-research fan-out on the packet itself, and a final documentation-truth audit that checked the public README against everything shipped.
> **Where the truth lives.** Each commit's detail is in the matching phase changelog under `changelog/`. The before-and-after framing is in `before-vs-after.md`.

---

## 0. The four epochs

Epoch one runs on 2026-06-28, the implementation wave. The roadmap scaffold landed first, then forty commits shipped the deep-loop-runtime, deep-loop-workflows, deep-improvement, speckit-autopilot and advisor-projection work in dependency order.

Epoch two runs on 2026-06-29, completion and remediation. The phase docs were finalized, a twenty-iteration deep review found eight defect clusters, the implementation tree was restructured into root phases, and the loop-systems remediation track fixed every confirmed finding with red-before regression tests.

Epoch three runs on 2026-07-01, research-backlog remediation. A deep-research fan-out mined the packet's own state for remaining gaps, a deeper forced-depth generation-2 pass found two more critical bugs in the research runtime itself, and 11 children closed every finding, from tooling bug fixes through claimed-versus-actual drift closure to a final fix for the two most severe bugs the research process surfaced in its own completion and hang-handling logic.

Epoch four runs on 2026-07-01, the documentation truth audit. A genuine 10-iteration deep-review dispatched to GPT-5.5-fast checked the public root README against everything the packet had shipped, found four real documentation gaps plus one artifact-integrity defect in its own iteration 5, and this phase fixed all five.

---

## 1. Epoch one: implementation wave (2026-06-28)

### Scaffold and research

 9e9945a424  feat(156-agent-loops): scaffold loop-systems implementation roadmap

### Deep-loop-runtime: state safety, locking and lifecycle

 db5be2c0f1  feat(deep-loop-runtime): hermetic test isolation helper
 25e73ba869  feat(deep-loop-runtime): atomic-state write-only-on-change
 6ce2c88031  feat(deep-loop-runtime): atomic-state SHA-256 integrity helpers
 8b44aafff6  feat(deep-loop-runtime): atomic-state deferred/debounced writer
 3854d662c9  feat(deep-loop-runtime): abortable chunked sleep primitive
 c844ea42a0  feat(deep-loop-runtime): lifecycle taxonomy + transition guards
 ecb0a55682  feat(deep-loop-runtime): JSONL lock-held merge for fan-out salvage
 05a5ffeb34  feat(deep-loop-runtime): loop-lock heartbeat hardening
 156c27f441  feat(deep-loop-runtime): loop-lock single-flight decision

### Convergence, coverage-graph and fan-out resilience

 5361706c4b  feat(deep-loop-runtime): shared convergence-profile schema + parity pin (ADR)
 364a95bbcb  feat(deep-loop): byte-offset log regions (stamp + dashboard surfacing)
 e617c8a34c  feat(deep-loop-runtime): fixed-rate overrun accounting
 34919c1339  feat(deep-loop-runtime): convergence score-delta signal
 c69d7c8521  feat(deep-loop-runtime): observation-threshold guard for convergence
 cfb7b475ce  feat(deep-loop-runtime): coverage-graph time decay
 8b7f80f461  feat(deep-loop-runtime): coverage-graph fuzzy merge
 c04648fa66  feat(deep-loop-runtime): typed fallback-router reroute + graph preflight
 8fd95112e7  feat(deep-loop-runtime): LLM-judge hardening (retry, fallback, quarantine)
 01e4825272  feat(deep-loop-runtime): persisted-wait crash resume for fan-out
 03a04cb54f  feat(deep-loop-runtime): fanout stall watchdog
 1b37fdbe0a  feat(deep-loop): code-graph to coverage-graph seed bridge

### Deep-loop-workflows and observability

 d181c79c6a  feat(deep-loop-workflows): dashboard sparkline trend section
 64ca699a6b  feat(deep-loop-workflows): run-now sentinel control in auto research loop
 5b330f614a  feat(deep-loop): single-loop telemetry heartbeat + no-change suppression
 cf34c21462  feat(deep-loop-workflows): injection inbox provenance
 0eb6b96e76  feat(deep-loop-workflows): anti-convergence min-iteration floor
 f879af051d  feat(deep-loop-workflows): anchor-ownership conflict resolution
 0894cc7c9f  feat(deep-loop-workflows): loop-wide --dry-run mode
 5c618d628f  feat(deep-loop): cross-mode anti-convergence contract (fail-closed stopPolicy)
 df96c09d3c  feat(deep-loop-workflows): rejected-pattern cache with fuzzy suppression
 97beb2e364  feat(deep-loop-workflows): ideas-backlog observe-promote-reject lifecycle
 f8be972a2f  feat(deep-loop-runtime): unified observability event envelope
 ea049f6080  feat(deep-loop-workflows): per-iteration memory upsert
 a78e877ca9  feat(deep-loop-runtime): push-wave fan-out schema (flat_pool default, wave planner stub)

### Deep-improvement, speckit autopilot and advisor projection

 7c218ee33d  feat(system-spec-kit): speckit :autopilot/:unattended lifecycle
 c92390d8ec  feat(skill-advisor): registry-projection drift guard + workflowMode
 356c92f0bb  feat(deep-improvement): loop-quality benchmark (outcome score-delta)
 4888db2fdf  feat(deep-improvement): lane-D self-improvement packaging profile
 91e04a892b  feat(deep-loop-runtime): record-replay cassette harness
 1b3a721a31  feat(deep-improvement): accepted-vs-shipped promotion split + rollback

---

## 2. Epoch two: completion and remediation (2026-06-29)

### Phase docs finalized and tree restructured

 7e3a1d6597  chore(156-agent-loops): refresh phase-parent metadata after completion
 8f19f7f618  refactor(156-agent-loops): ungroup 002-implementation, promote children to root phases 002-008
 5107cd8ac7  fix(156-agent-loops): restore promoted phase content at new paths (002-008)

### Deep review

 411f512947  docs(deep-review): 20-iter review packet for 156 loop-systems
 f3638fca98  docs(deep-review): finalize review-report, 8 clusters fixed (P0 + ~20 P1)
 bb33403ffa  test(deep-review): MiMo-V2.5-Pro runs all 41 new-feature playbook scenarios, 41/41 PASS

### Loop-systems remediation track

 dc677807fb  docs(009-remediation): handover + remediation phase scaffolds
 16516de0dd  fix(deep-loop): promotion mirror-sync gate uses current-canonical baseline (009 remediation: 002)
 8966e04255  docs(deep-loop): require EXIT 0 test runs in high-risk playbook pass criteria (009 remediation: 005)
 8ed78a19c5  docs(deep-loop): adversarial regression scenarios for fixed loop-system bugs (009 remediation: 004)
 50ae3e9a63  test(deep-loop): genuinely concurrent JSONL append harness (009 remediation: 006)
 a9aac0a805  docs(009-remediation): finalize 001 rollback-hash-guard to Complete

---

## 3. Epoch three: research-backlog remediation (2026-07-01, pending commit)

> These entries are ordered by real work sequence. Commit hashes will be added once this work is committed, per this file's own frontmatter `next_safe_action`.

### Deep-research fan-out against the packet itself

A two-lineage forced-depth deep-research fan-out (glm-5.2 and gpt-5.5-fast) ran against the packet's own state, first at 18 and 11 iterations on an early-converging run, then re-run with `stopPolicy=max-iterations` forcing 35 genuine iterations per lineage. The second pass found two more critical bugs in the research runtime's own completion and hang-handling logic beyond the original ranked backlog.

### Tooling bug fixes

 (pending) fix(deep-loop-runtime): fanout-merge schema tolerance for non-canonical registry keys (009: 001)
 (pending) feat(deep-loop-runtime): per-lineage timeout-hours override (009: 002)
 (pending) fix(deep-loop-runtime): comment-hygiene markers, salvage filename padding, new lint rule (009: 003)

### Claimed-versus-actual drift closure

 (pending) fix(system-spec-kit): phase-map and completion-pct sync script and backfill (009: 004)
 (pending) fix(030-agent-loops-improved): packet-identity cleanup, dead lock removal (009: 005)
 (pending) fix(system-spec-kit): review-registry disposition, graph-metadata key_files, description truncation (009: 006)
 (pending) docs(008-loop-systems-remediation): real parent aggregate docs, two ADR decision-records (009: 007)

### Infrastructure and design hardening

 (pending) fix(deep-loop-runtime): loop-type-aware convergence-threshold default, stop-policy docs (009: 008)
 (pending) feat(deep-loop-runtime): sliding-window convergence decision record, stall watchdog, cost cap (009: 009)
 (pending) feat(system-spec-kit): SCAFFOLD_NEVER_TOUCHED validate.sh rule (009: 010)
 (pending) fix(deep-loop-runtime): synthesis-completion invariant, post-exit orchestrator watchdog, research registry reconstruction (009: 011)

---

## 4. Epoch four: documentation truth audit (2026-07-01, pending commit)

> These entries are ordered by real work sequence. Commit hashes will be added once this work is committed, per this file's own frontmatter `next_safe_action`.

### Dispatched 10-iteration GPT-5.5-fast deep-review

A genuine 10-iteration `/deep:review`-shaped dispatch to `openai/gpt-5.5-fast --variant high`, `stopPolicy=max-iterations`, checked whether `/README.md`, `/AGENTS.md` and `/AGENTS_Barter.md` had drifted from everything packet 030 shipped. It found 0 P0, 4 P1 and 1 P2 finding, caught its own iteration-5 verdict/final-line defect in the process, and confirmed `AGENTS.md`/`AGENTS_Barter.md` needed no changes.

### README fixes

 (pending) docs(README): rename Spec Kit Documentation section to Spec Kit Framework (010: 001)
 (pending) docs(README): promote Goal plugin to a full FEATURES subsection (010: 002)
 (pending) docs(README): disclose Deep Loop fan-out permission boundary and shipped guardrails (010: 003)
 (pending) fix(030-agent-loops-improved/010-documentation-truth-audit): correct stale graph-metadata entity, regenerate (010: 004)
 (pending) fix(030-agent-loops-improved/010-documentation-truth-audit): correct review iteration-5 verdict/final-line mismatch (010: 005)
