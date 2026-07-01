# Deep Research Strategy: Agent Loops Improved Perfection Audit (Round 2)

**Session:** fanout-glm-1782890147566-yg06ab
**Generation:** 2 (Round 2 — forced depth via stopPolicy=max-iterations)
**Executor:** cli-opencode model=zai-coding-plan/glm-5.2
**Budget:** 35 iterations (convergence is TELEMETRY ONLY; do not synthesize early)

---

## Research Topic

Continue and deepen the research into perfecting the deep-loops/030-agent-loops-improved packet across all 8 phases (001-008) and its own review/research tooling. This is Round 2. Round 1 ran 18 (glm) and 11 (gpt) iterations and produced a 26-finding report, converging early on a question-coverage/entropy signal short of the operator's >=30-iteration floor. This round forces stopPolicy=max-iterations so the full budget MUST be consumed.

---

## Known Context (Round 1 baseline — re-verify live, then go beyond)

Round 1 produced 12 corroborated findings (critical-1, high-9, medium-3, low-1). The key systemic patterns:
- Documentation drift (phase-map Draft rows, completion_pct:0 vs 100, graph-metadata omissions)
- Migration residue (123-/156- packet refs)
- Tooling bugs (merge silent-drop, 4h timeout cap, salvage naming collision)
- Registry staleness (review findings never dispositioned post-remediation)
- Validation gaps (no semantic checks)

**A new phase 009-research-backlog-remediation was scaffolded from the round-1 backlog** — child 001-fanout-merge-schema-tolerance claims Complete. This round must verify whether that fix actually landed (spec-vs-code), and audit 009 itself for the same drift disease.

---

## Key Questions

1. Which round-1 findings are STILL LIVE vs partially/fully fixed since round 1?
2. Did 009/001-fanout-merge-schema-tolerance actually fix the silent-drop bug in live code?
3. Is the 4h timeout cap (round-1 critical) still present in fanout-run.cjs?
4. What is the ROOT CAUSE of the salvage/duplicate-filename collision, and is it one bug or two?
5. Does the systemic doc-staleness pattern share ONE root cause (generator/reducer) or need independent per-file patches?
6. Does the deep-review loop have the same anti-convergence early-stop gap independent of stopPolicy?
7. Is stopPolicy=max-iterations documented as a first-class operator flag or only reachable via internal fanout config?
8. Are there ADDITIONAL latent bugs in fanout-pool.cjs / loop-lock.cjs / reduce-state.cjs beyond the 2 confirmed?
9. Does the registry-staleness bug (never-synced review registries) recur beyond the glm/codex lineages round 1 checked?
10. What should a concrete consolidated remediation phase contain, in priority order?

---

## Research Boundaries

- **In scope:** all of 030-agent-loops-improved/** (phases 001-009), deep-loop-runtime scripts, deep-loop-workflows surfaces, deep-review/deep-research YAML + convergence code, review/research lineages.
- **Out of scope:** implementing fixes (report findings only), unrelated subsystems.

---

## Non-Goals

- Do not restate round-1 findings verbatim without a fresh live re-verification.
- Do not pad iterations with restatements; each iteration must vary its angle or add net-new evidence.
- Do not implement any fix.

## Stop Conditions

- stopPolicy=max-iterations: convergence signals are TELEMETRY ONLY. The loop MUST reach iteration 35 before synthesizing.

---

## Strategy Machine-Owned Sections

### What Worked
(iteration updates appended below)

### What Failed
(iteration updates appended below)

### Next Focus
Iteration-by-iteration: re-verify round-1 baseline live → fan-out into new territory (009 phase, runtime scripts, root-cause analysis, cross-referencing by artifact type) → consolidated remediation design.

### Active Risks
- Token budget for 35 distinct iterations in one session; must vary angles to avoid padding.
- Some round-1 findings may already be partially fixed by the 009 phase; must distinguish live-vs-fixed.
