---
title: Deep Research Strategy — 007 Gem Team Adoption Matrix
description: Persistent brain for the gem-team adoption-research loop. Orchestrator-maintained (reduce-state.cjs-compatible 7-ANCHOR format; reducer not invoked).
session: 2026-06-06-027-gem-team-adoption-matrix
executor: cli-opencode openai/gpt-5.5-fast --variant high (read-only); orchestrator-written artifacts
iterations: 001-onward (global counter; continues after 005's 061-080)
---

# Deep Research Strategy — 007 Gem Team Adoption Matrix

## 1. OVERVIEW

Study the external multi-agent framework **mubaidr/gem-team** (`external/gem-team-main/`) and triage its mechanisms for adoption into this repo's **spec-kit** system. Each Gem Team feature → **ADOPT / ADAPT / REJECT** verdict with `file:line` evidence on BOTH sides, plus an explicit "spec-kit already does this" dedup pass. Output: `research.md` (verdict matrix) + `sub-packet-proposals.md` (candidate new 027 child phases). Research-only — no source modifications. The XCE corpus that seeded 027's earlier research is **exhausted** (per the 005 synthesis), so gem-team is genuinely net-new external signal.

---

## 2. TOPIC

**Which Gem Team mechanisms should the spec-kit ADOPT, ADAPT, or REJECT — and what concrete, independently-shippable sub-packets should 027 spawn to capture the net-new value, without re-building what the system already has?**

Comparison baseline (spec-kit surfaces): `.opencode/skills/**` (system-spec-kit, deep-loop-runtime, deep-research/review/improvement, sk-code/sk-git/sk-doc/sk-prompt, system-skill-advisor, system-code-graph), `.opencode/agents/**` (orchestrate, context, code, review, debug, deep-*, ai-council), the Spec Kit Memory MCP (continuity ladder, causal graph, semantic triggers, learning reducers), Code Graph MCP, Skill Advisor MCP, the spec-folder workflow + Gates, and `generate-context.js`.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

Overarching:
- [ ] **RQ-A** For each gem-team mechanism, what is the spec-kit's existing equivalent (with `file:line`), and is the verdict ADOPT (net-new) / ADAPT (better idea, fit to our stack) / REJECT (already-have or not-applicable)?
- [ ] **RQ-B** Which ADOPT/strong-ADAPT rows compose into 2-4 concrete, independently-shippable sub-packets for 027 (scope, level/LOC, deps, risk)?

Per-angle (one focus per iteration):
- [ ] **RQ1 (iter 001)** Orchestration & wave execution — gem-orchestrator + routing matrix + ≤2-concurrent waves vs `@orchestrate` + deep-loop fan-out + Gates.
- [ ] **RQ2 (iter 002)** Memory architecture — gem memory tool (orchestrator-owned; facts/patterns/gotchas/failure_modes/decisions/conventions; deduped; self-validated) vs Spec Kit Memory MCP + continuity + causal graph.
- [ ] **RQ3 (iter 003)** Context Envelope — gem's progressive per-wave `context_envelope.json` cache vs continuity frontmatter + `memory_context`.
- [ ] **RQ4 (iter 004)** Knowledge layers — PRD.yaml / AGENTS.md / Memory / Skills / Derived Docs vs spec-folder docs + skills + memory. Gap analysis.
- [ ] **RQ5 (iter 005)** Verification & quality gates — gem-reviewer (zero-hallucination, OWASP) + gem-critic + contract-first + TDD vs sk-code verification + sk-code-review + the Iron Law.
- [ ] **RQ6 (iter 006)** Diagnose-then-fix enforcement — gem's multi-level debugger→implementer pairing with `debugger_diagnosis` gate vs `@debug` + debug-delegation.md.
- [ ] **RQ7 (iter 007)** Auto-skills extraction — gem-skill-creator (pattern→SKILL.md from high-confidence learnings) vs `/create` + deep-improvement.
- [ ] **RQ8 (iter 008)** Task classification & fast-path modes — 7-type classification + complexity + MICRO/FAST_TRACK + smart routing vs spec Levels 1-3 + gate skips.
- [ ] **RQ9 (iter 009)** Token-efficiency mechanisms — concise output, file-based context, self-validating context cache vs existing token discipline.
- [ ] **RQ10 (iter 010)** Pre-mortem / risk / resilience / auto-replanning — gem-planner risk analysis + pre-mortem + failure handling vs confidence framework + halt conditions.
- [ ] **RQ11 (iter 011)** Standard Output Contract — gem's uniform JSON agent contract (plan_id/task_id/status/confidence/failure_type) vs the user's agent return conventions.
- [ ] **RQ12 (iter 012)** CHANGELOG deep-mine — the 64KB CHANGELOG for design decisions/gotchas/evolution not in README/AGENTS (net-new signal hunt).
- [ ] **RQ13 (iter 013)** Distribution/packaging (APM) — apm.yml + release-please + multi-harness deploy vs per-runtime agent dirs.

Adversarial + completeness (Exhaustive depth):
- [ ] **RQ-V (Round D)** Adversarially refute the top ADOPT candidates (is the value real, or does spec-kit already cover it?).
- [ ] **RQ-C (Round D)** Completeness critic — what gem-team feature/CHANGELOG signal did the 13 angles miss?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- NOT implementing any adoption — this is research only; implementation is a separate `/speckit:plan` follow-up.
- NOT modifying gem-team-main or any spec-kit source.
- NOT re-opening the XCE corpus (exhausted per 005).
- NOT proposing things the spec-kit already does as well or better — overlap must be marked REJECT with evidence.
- NOT mobile/design agents (gem-designer-mobile etc.) beyond a one-line REJECT note — out of the spec-kit's domain.

---

## 5. STOP CONDITIONS

- All 13 analysis angles + adversarial round + completeness critic complete (Exhaustive operator selection ⇒ ~18-20 iterations).
- newInfoRatio trend converges (avg of last 3 < convergenceThreshold 0.05) AND no high-signal open questions remain.
- OR maxIterations (20) reached.
- 3 consecutive dispatch timeouts/failures ⇒ halt, synthesize partial.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- **RQ1 orchestration** (iter 001, ratio 0.18) — mostly REJECT; `@orchestrate` + deep-loop fan-out + the 2-agent ceiling already match. ADAPT only: consolidate the routing matrix into one visible table; name a per-wave integration-check invariant.
- **RQ2 memory** (iter 002, ratio 0.24) — mostly already-have (causal graph, learning reducers, semantic triggers). ADAPT: a typed reusable-memory taxonomy (gotcha / failure_mode as first-class retrieval labels) + orchestrator-owned memory seeding for multi-agent lanes.
- **RQ3 context envelope** (iter 003, ratio 0.42) — ADAPT (lead candidate): one consolidated per-dispatch Context Package snapshot + typed read-directives (`safe_to_assume` / `verify_before_use` / `do_not_re_read`) + progressive after-wave enrichment.
- **RQ4 knowledge layers** (iter 004, ratio 0.38) — ADAPT: an explicit knowledge-source precedence / conflict-resolution order; "external/derived docs are lowest-precedence unless cited & current".
- **RQ5 verification gates** (iter 005, ratio 0.64 — richest) — **ADOPT: contract-first test ordering** (real GAP: we verify before completion but don't mandate tests-first). ADAPT: source-verified standing gate; named OWASP/secrets/PII scan; lightweight critic pass. REJECT: no-self-review (already have @review read-only + Hunter/Skeptic/Referee).
- **RQ6 diagnose-then-fix** (iter 006, ratio 0.78 — Round B richest) — ADAPT (strong): the 4-level machine-checked `debugger_diagnosis` enforcement (planner pairs debugger→implementer; orchestrator pre-wave schema gate for root_cause/target_files/fix_recommendations; implementer validates diagnosis; reviewer verifies pairing). We have @debug 5-phase + debug-delegation.md but no contract gate.
- **RQ7 auto-skills** (iter 007, ratio 0.64) — ADAPT: automatic pattern→skill extraction with reuse≥2× + confidence≥0.90/0.95 thresholds, vs our human-initiated /create + deep-improvement.
- **RQ8 task-classification** (iter 008, ratio 0.58) — ADAPT: explicit task-type(7) × complexity(LOW/MED/HIGH) → track(MICRO/FAST/full) routing matrix + FAST_TRACK phase-skipping, vs our LOC/Level gate-skips.
- **RQ9 token-efficiency** (iter 009, ratio 0.31 — mostly already-have) — ADAPT minor: concise-output rule + self-validating context cache; we already have Code Mode ~98% reduction + advisor token caps.
- **RQ10 pre-mortem/resilience** (iter 010, ratio 0.74) — ADAPT (strong): typed failure taxonomy (transient/fixable/needs_replan/escalate/flaky/…) with per-type retry limits + pre-mortem-before-execution + needs_replan auto-routing, vs our prose halt/escalate/confidence model.
- **RQ11 standard output contract** (iter 011, ratio 0.83 — HIGHEST) — ADOPT: per-agent typed dispatch schemas (`task_definition`/`context_envelope_snapshot` fields). ADAPT: uniform output envelope (status/confidence/failure_type), numeric confidence alongside HIGH/MED/LOW. **Key cross-cut:** found @context already returns a structured Context Package [context.md:230-284] + @code already has escalation classifiers [code.md:303-310] → this NARROWS the 003 context-envelope and 010 failure-taxonomy candidates (the structures partly exist; net-new is typing/uniformity, not the concept).
- **RQ12 CHANGELOG mine** (iter 012, ratio 0.46) — mostly niche ADAPT: research-findings cache at agent init, plan-template cache + bypass, shared-component pre-save check + failure-log reinjection, accessibility-tree-over-screenshots (browser gotcha). Lower priority.
- **RQ13 distribution/APM** (iter 013, ratio 0.72 — surprising signal) — ADAPT: single-source agent defs + per-harness auto-deploy + one-command multi-tool install. Spec-kit isn't APM-distributed but maintains per-runtime dirs (.opencode/.claude/.codex); in-scope value = a single-source→multi-runtime generator. Scope-questionable.
<!-- /ANCHOR:answered-questions -->

---

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Read-only cli-opencode `gpt-5.5-fast --variant high` dispatch + orchestrator-written state (Gate-3-safe, race-safe). The `### FINDINGS…### METRICS` output contract parsed cleanly; citations are real `file:line` on both sides. (iters 001-005)
- Parallel batches of ~5 background `opencode run` processes joined by a bare `wait`. (Round A)
- Honest, skeptical verdicts: agents REJECTed already-have features (orchestration, 2-agent ceiling, no-self-review) with our-side evidence instead of over-claiming gaps — exactly the discipline this adoption matrix needs.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- First Round-A batch used a zsh associative-PID-array `wait "${PID[$N]}"` → "job not found" → the wrapper exited early and killed the 4 opencode children before stdout flushed (0-byte outputs; stderr showed they were mid-grep). Fixed by using a bare `wait` (joins all background jobs). Validate iterations by output structure, not exit codes.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
_None yet._
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
_None yet._
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**COMPLETE (19/19 iters: 001-019).** All 9 top candidates adversarially downgraded to narrow ADAPT slices (014-018); completeness critic (019) converged to 3 sub-packets + a 6-item defer list. Deliverables written: `research.md` (synthesis + verdict matrix) and `sub-packet-proposals.md` (P1 typed-agent-io-adapter · P2 scoped-preexec-handoff-gates · P3 planner-review-focus-drift-hint). **Verdict: validate-and-incrementally-refine — the spec-kit needs polish, not new subsystems.**

**+ MiMo-V2.5-Pro cross-model extension (iters 020-024, COSTAR):** verdict independently CORROBORATED (low new-info 0.05-0.25); P1 re-scoped to dispatch-INPUT-primary + a snapshot-vs-progressive decision; P2 reframed as an honest downscale of Gem's machine-checked pre-wave gate; OWASP-coverage claim flagged for verification. Coverage-gap angles (specialized-agents/PRD/planner/CHANGELOG) mostly REJECT/defer — no new sub-packets.

13/13 analysis angles complete; newInfoRatio stayed high throughout (0.18→0.83, no convergence-to-zero) ⇒ each angle found genuine net-new signal; Exhaustive depth justified.
<!-- /ANCHOR:next-focus -->

---

## 12. KNOWN CONTEXT

**From the 005 canonical synthesis (`research/005-live-rescope-coco-purge/research.md`):**
- 027 is a phase-parent with 8 implementation children (000-008) covering memory write-safety, incremental index, causal tombstones, metadata promoter, write-path reconciliation, semantic triggers, learning-feedback reducers; all rescoped after the 026 program closed (2026-06-05) + a CocoIndex purge.
- The XCE external corpus is **EXHAUSTED** — no net-new memory-system signal remained. gem-team is the fresh corpus.
- The spec-kit is **mature**: it already has a Spec Kit Memory MCP (continuity, causal edges, learning reducers, semantic triggers), Code Graph MCP, Skill Advisor MCP, deep-loop runtime (research/review/improvement/benchmark), and a layered skill + agent system. **The bar for ADOPT is high** — only genuinely net-new value qualifies.

**Gem Team summary (`external/gem-team-main/README.md`, `AGENTS.md`):**
- Self-learning multi-agent orchestration framework (APM-distributed). 16 agents under `.apm/agents/*.agent.md`.
- Orchestrator-owned memory; progressive **context envelope** (`docs/plan/{plan_id}/context_envelope.json`) enriched per wave; knowledge layers PRD/AGENTS/Memory/Skills/Derived; wave execution (≤2 concurrent); verification gates (zero-hallucination reviewer + critic + contract-first + TDD); diagnose-then-fix enforced at 4 levels; auto-skills extraction; 7-type task classification + complexity + MICRO/FAST_TRACK fast-paths; token-efficiency (file-based context, self-validating cache); standard JSON output contract; 64KB CHANGELOG.

**Comparison surfaces to cite (spec-kit side):** `.opencode/skills/system-spec-kit/`, `.opencode/skills/deep-loop-runtime/`, `.opencode/skills/deep-research/`, `.opencode/agents/*.md`, `CLAUDE.md`/`AGENTS.md` gates, `.opencode/skills/system-spec-kit/mcp_server/**`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20 (Exhaustive operator selection)
- Convergence threshold: 0.05 (newInfoRatio)
- Per-iteration budget: ≤8-12 file reads, 1200s gtimeout, scoped to ≤5-8 named files (gpt-5.5-fast high times out on broad audits)
- Executor: cli-opencode `openai/gpt-5.5-fast --variant high`, READ-ONLY dispatch; orchestrator writes all state (Gate-3-safe, race-safe, compaction-safe)
- Parallelism: batches of ~5 independent background `opencode run` processes (true concurrency)
- research.md ownership: orchestrator-owned canonical synthesis output
- Evidence rule: every claim cites `[SOURCE: file:line]` on BOTH the gem-team and spec-kit sides
- Started: 2026-06-06T08:30:00Z
