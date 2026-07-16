# Research: GPT Behavioral Hardening Follow-Up (Packet 031) — glm-max lineage

> **Synthesis of a 30-iteration deep-research fan-out lineage** (cli-opencode / zai-coding-plan/glm-5.2 / reasoning max). Stop policy: `max-iterations` (30); convergence signals treated as telemetry only; angles broadened via adversarial re-checks (iters 8,11,13,19,22,25,26) and analytical consolidation (iters 27-29). Spec folder: `.../007-gpt-behavioral-hardening-research`. Sibling lineage: `gpt-fast-high`. Iteration evidence: `iterations/iteration-001.md` … `iteration-030.md`. All 9 KQs answered with `file:line` citations.

---

## 0. CRITICAL INTEGRITY CAVEAT — READ FIRST

This lineage builds on the predecessor research (`../001-deep-agent-router-and-orchestration/research/research.md`) whose §0 records that the mis-route taxonomy (modes A/B/C) and FIX-1…FIX-5 ranking are **operator-asserted axioms**, not cross-validated findings (the cited prior syntheses do not exist on disk). This research **does not re-validate those axioms**; it builds on them as given and treats the KQ1 external smoke as the path to validation. Every claim below distinguishes CONFIRMED (file:line) from INFERRED.

---

## 1. KQ1 — Decisive Smoke Evidence

**Recommendation:** Implement an 8-run external smoke harness (4 modes × 2 models) run from a clean non-OpenCode shell.

- **Environment requirement (CONFIRMED):** no `OPENCODE_*` env vars, no `opencode` ancestor process, no `~/.opencode/state/<id>/lock` — i.e., a genuine non-OpenCode shell or fresh worktree harness. [SOURCE: cli-opencode/SKILL.md:66,87,319; 005-gpt-verification-smoke/verification-smoke.md:56-57]
- **Why phase 005 was inconclusive (CONFIRMED):** all 4 command-owned attempts tripped the cli-opencode 3-layer self-invocation guard on `OPENCODE_PID=63869`; the bounded no-tools probes preserved route echo but returned `agent_definition_loaded:false`. [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:90-99,120]
- **PASS criteria (all required):** exactly one new canonical record of the requested mode; expected artifact+delta paths; no `dispatch_failure`; executor provenance names GPT/OpenAI; AND route-proof fields (`mode`/`target_agent`/`agent_definition_loaded==true`/echoed `resolved_route`) all match — the last closes the §5 false-negative. [SOURCE: 005:42-65; ../001/research.md §5,§7]
- **Baseline control:** identical tiny packet under native/Claude in the same shell. [SOURCE: ../001/research.md §7]

---

## 2. KQ2 — Real-World Mis-Route Mechanism

**Finding:** the operator symptom set is a **MIX** of three mechanisms, not one.

| Symptom | Mechanism | Class |
|---------|-----------|-------|
| Wrong sub-agent invoked | orchestrate lacks deep-context/deep-review rows + soft identity | mis-routing (A/B/C) [orchestrate.md:95-105,162] |
| Stuck on pre-defined flows | GPT reads soft advisory command-prose as hard gates | **NEW mode D** [research-prompt.md:21; loop_protocol.md:166-180] |
| Overthinks / needs literal instructions | judgment-dependent Deep Route field forces inference | mis-routing + mode D [orchestrate.md:207] |
| Slow as @orchestrate | role-resolution overhead (subagent_type:general + CLI no agent flag) | **latency, distinct from routing** [../001/research.md §3.1] |

- **Mode D is separable from FIX-5/host identity (CONFIRMED):** hard identity prevents wrong-agent dispatch but does not fix GPT halting on an advisory step it reads as a gate. [SOURCE: ../001/research.md §8b; iter 7]
- **Mode D is NOT the latency confound (INFERRED):** "stuck" (halt) is observably distinct from "slow" (long duration); no GPT-vs-Claude wall-clock telemetry exists yet (KQ6 is the measurement path). [SOURCE: ../001/research.md §9; iter 8]

---

## 3. KQ3 — ai-council Subagent-Only Conversion

**Recommendation: DO NOT convert.** Keep `ai-council` `mode: all`; add a route-proof header instead.

- **Breakage under conversion (CONFIRMED):** `/deep:ai-council` loses its depth-0 parallel-seat path; operator quick-planning adds a hop + role-resolution latency; depth-aware council value is lost. [SOURCE: ai-council.md:4,36-60]
- **Conversion is preventive-not-curative (CONFIRMED):** the reported symptoms do not involve ai-council. [SOURCE: research-prompt.md:21]
- **Cheaper additive alternative (RECOMMENDED):** keep `mode: all`, add a deep.md-style route-proof header so GPT cannot mis-resolve council while preserving direct invocation. [SOURCE: deep.md:69-75; iter 10,11]
- **Risk asymmetry:** keep+header is reversible; conversion is subtractive and hard to roll back. [SOURCE: iter 11]

---

## 4. KQ4 — @orchestrate Hardening v2

**Recommendation:** orchestrate delegates deep-dispatch to `deep.md` as the single routing truth.

- **Smallest edit:** replace `orchestrate.md:95-105` deep rows + the `:207` judgment-filled Deep Route field with a single deterministic rule: *"if the request matches a /deep:* mode or names a deep leaf, dispatch @deep with the Deep Route header resolved from mode-registry.json and STOP; do not self-derive mode/execution."* [SOURCE: orchestrate.md:95-105,207; deep.md:34-46,66; iter 12]
- **This converts deep-routing from judgment-grade to table-lookup-grade** by reusing deep.md's registry resolution + bounded clarification gate. [SOURCE: deep.md:66]
- **Authority preserved (CONFIRMED):** orchestrate keeps decomposition/evaluation/synthesis authority; the handoff is mode-resolution only, not control. Two `mode: primary` agents are disambiguated by the explicit "dispatch @deep and STOP" rule (mirrors single-hop invariant). [SOURCE: orchestrate.md:42,194-225,502-577; deep.md:56,79; iter 13]
- **Positive side effect:** removes the inference that drives the "slow orchestrate" symptom for deep requests. [SOURCE: ../001/research.md §3.1; iter 25]

---

## 5. KQ5 — Sub-Agent-Enforcement Plugin

**Recommendation:** build a hook-based enforcement plugin in `system-skill-advisor`.

- **Mechanism:** a pre-dispatch hook asserts route-proof fields (`mode`/`target_agent`/`agent_definition_loaded`/echoed route) are resolvable in mode-registry.json; fails-closed or warns on mismatch. [SOURCE: mode-registry.json:10-16; iter 14]
- **Home:** `system-skill-advisor` already owns routing metadata + the drift-guard keeping its maps == registry projection; co-locating enforcement reuses one source of truth. [SOURCE: mode-registry.json:16; AGENTS.md GATE 2]
- **Scope boundary (CONFIRMED):** the plugin is a DETECTION layer (catches route/identity mismatch at dispatch); it does NOT create hard identity (that is FIX-5/host, architectural). [SOURCE: ../001/research.md §8b; 006/decision-record.md:11-14; iter 15]
- **Limit (CONFIRMED):** the plugin does NOT catch semantic wrong-mode (the §5 false-negative) — a schema-valid route-matched artifact doing wrong work passes the plugin. The KQ1 smoke must still check real leaf behavior. [SOURCE: ../001/research.md §5; iter 25]
- **Implementable now:** works at the OpenCode hook surface without host internals or unparking 006. [SOURCE: ../001/research.md §8b F31,§9]

---

## 6. KQ6 — GPT-vs-Claude Behavioral Benchmark

**Recommendation:** an 8-run, 2-metric benchmark = the KQ1 smoke applied to both models.

- **Design:** 4 modes × 2 models × 1 tiny packet; record (1) first-dispatch + total latency, (2) route-proof score (fraction of the 4 fields matching; binary gate per mode + continuous trend). [SOURCE: iter 16; ../001/research.md §7]
- **Baseline now:** expected GPT correctness < Claude and GPT latency > Claude — establishes the "before" numbers no wall-clock log currently exists for. [SOURCE: ../001/research.md §9]
- **Regression gate after KQ4/KQ5:** PASS requires GPT route-proof == Claude (4/4 all modes) AND acceptable latency ratio. [SOURCE: iter 17]
- **FIX-5 trigger integration:** if GPT still produces schema-valid route-mismatched artifacts post-fix, that is the KQ9 unpark signal — the benchmark makes it measured. [SOURCE: iter 17; 006/decision-record.md:20-22]
- **Residual:** latency-ratio threshold needs calibration from the baseline run. [SOURCE: iter 17]

---

## 7. KQ7 — Literal-Instruction-Following Pattern

**Finding:** the generalizable pattern and its safe-application boundary.

- **Pattern (CONFIRMED):** deterministic table lookup (registry as single source of truth) + single bounded clarification gate + structured pre-resolved dispatch header + hard boundaries forbidding the mis-invocation signals. [SOURCE: deep.md:26,34-46,51-59,63-79,83-98; iter 2]
- **Apply to ROUTING surfaces only:** orchestrate deep-path (KQ4), the 4 command entry seams, the CLI executor seam. [SOURCE: iter 18]
- **Do NOT apply to execution surfaces:** leaf agents' value is evidence-response/flexibility; over-applying tables harms mode D. [SOURCE: orchestrate.md:99-105,116; iter 19]
- **Guardrails (CONFIRMED):** boundaries must lock mode-resolution, not leaf evidence-response; the bounded clarification gate must be retained as the controlled flex-escape. [SOURCE: deep.md:51-59,66; iter 19]

---

## 8. KQ8 — Propagation Scope

**In-scope paths (6 + mirrors):**

| # | Path | Treatment |
|---|------|-----------|
| 1 | .opencode/agents/orchestrate.md (deep-dispatch :95-105,:207) | KQ4 delegation |
| 2-5 | .opencode/commands/deep/{research,review,context,ai-council}.md | mandatory Resolved-route header at seam |
| 6 | .opencode/agents/deep.md | reference template (already literal-safe) |
| 7 | cli-opencode executor prompt seam | route header structurally mandatory (only identity carrier) |
| 8 | system-skill-advisor hook surface | KQ5 enforcement plugin |

[SOURCE: orchestrate.md; commands/deep/*.md; deep.md; cli-opencode/SKILL.md; mode-registry.json; iter 20]

- **Cross-runtime:** .claude/agents/{orchestrate,deep,ai-council}.md MUST receive the same edits (bundled per phase, not separate); Codex parity BLOCKED (TOML contradiction) — deferred. [SOURCE: ../001/research.md §8; iter 28]
- **Must-NOT-harden:** leaf execution agents, ai-council depth-0 path, the bounded clarification gate. [SOURCE: iter 22]
- **Deferred same-pattern follow-up:** improvement-family deep modes (agent/model/skill-benchmark) — lower priority; symptoms name only the 4 runtime modes. [SOURCE: mode-registry.json:81-145; iter 21]

---

## 9. KQ9 — FIX-5 Unpark Decision

**Decision: WAIT on KQ1 + cheaper layers. Do NOT unpark now; do NOT close as sufficient.**

- **New decision criterion (more decisive than 006):** unpark FIX-5/host-identity **IFF**, after KQ4 + KQ5 land AND the KQ1 external smoke runs, the KQ6 benchmark shows GPT route-proof < 4/4 while Claude = 4/4 on any mode. This is a **negative gate on the cheaper layers** (prove insufficiency), distinct from 006's never-exercisable positive trigger. [SOURCE: iter 23,24; 006/decision-record.md:20-22]
- **Why not now (CONFIRMED):** FIX-5 is architectural, crosses runtime/CLI/loops/mirrors, "not PR-sized"; the cheaper layers are unproven-insufficient, not proven-insufficient. [SOURCE: ../001/research.md §8b]
- **Risk asymmetry:** waiting is reversible (run smoke, decide from data); unparking-now is irreversible. [SOURCE: iter 24]
- **Why not never (CONFIRMED):** "never" is only viable if cheaper layers prove sufficient — exactly what is unproven; the operator evidence justifies RUNNING the decisive smoke, not closing the question. [SOURCE: ../001/research.md §9; 006/decision-record.md:29]

---

## 10. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Re-running the smoke from inside an OpenCode session | OPENCODE_PID guard structurally trips | 005:120; cli-opencode/SKILL.md:319 | 5 |
| Treating all operator symptoms as one mis-routing class | conflates latency, routing, and state-machine literalism | iter 6 | 6 |
| Converting ai-council to subagent-only now | removes non-broken depth-0 parallel feature; symptoms do not involve council | ai-council.md:55-60; research-prompt.md:21 | 9-11 |
| Applying the literal-safe table pattern to leaf/execution surfaces | harms Claude evidence-response (mode D); removes controlled flex-escape | deep.md:51-59,66 | 18-19 |
| Codex (.codex/agents | .opencode/agents/*.toml) parity in this work | TOML-location contradiction unresolved | ../001 §8 | 20 |
| Unparking FIX-5 immediately on operator evidence alone | architectural blast radius; cheaper layers unproven-insufficient; wait is reversible | ../001 §8b; iter 23 | 23-24 |

---

## 11. Recommendations

1. **008 — Prompt-layer hardening:** KQ4 orchestrate→deep delegation + KQ7/KQ8 header propagation (4 command seams, CLI seam) + KQ3 council route-proof header. Bundle .claude mirrors. Low blast radius, reversible.
2. **009 — Detection-layer plugin:** KQ5 enforcement plugin in system-skill-advisor.
3. **010 — External smoke + benchmark baseline:** KQ1 8-run harness + KQ6 baseline measurement.
4. **011 — Regression gate:** re-run KQ6 after 008+009; apply the KQ9 negative-gate decision.
5. **012 (CONDITIONAL) — FIX-5/host-identity:** unpark only if the 011 gate fires (GPT<4/4 vs Claude=4/4).

---

## 12. Open Questions / Carried Forward

- Calibrate the KQ6 latency-ratio threshold from the 010 baseline run.
- Validate KQ2 mode-D magnitude once GPT-vs-Claude telemetry exists.
- Confirm an OPENCODE_PID-free external shell is available to the operator (KQ9 gate runnability — if none exists, the gate cannot fire and FIX-5 stays parked indefinitely, the same trap as 005/006).
- The mis-route taxonomy A/B/C + FIX-ranking remain operator-asserted axioms (../001 §0); KQ1 smoke is the validation path.

---

## 13. Residual Risk

| Item | Status | Residual risk |
|------|--------|---------------|
| KQ2 mode-D magnitude | INFERRED, not measured | KQ6 benchmark is the measurement path |
| KQ5 plugin semantic-blindness | CONFIRMED limit | does not catch semantic wrong-mode; KQ1 smoke must check real leaf behavior |
| KQ9 gate runnability | depends on external shell availability | if no OPENCODE_PID-free shell, gate cannot fire; FIX-5 parked indefinitely |
| Codex parity | deferred (TOML contradiction) | hardening serves OpenCode + Claude only |
| Improvement-family modes | deferred same-pattern follow-up | lower priority; symptoms name 4 runtime modes only |
| Host-runtime hard identity / FIX-5 | gated on KQ9 negative-gate | architectural; unpark only on measured insufficiency |

---

## RECOMMENDED IMPLEMENTATION ORDER (for /speckit:plan)

1. **008** Route-proof header propagation + orchestrate→deep delegation (prompt-layer) + .claude mirrors.
2. **009** Enforcement plugin in system-skill-advisor (detection-layer).
3. **010** External smoke harness + benchmark baseline (measurement).
4. **011** Regression gate run + KQ9 negative-gate decision.
5. **012** (conditional) FIX-5/host-identity if 011 gate fires.

---

## CONVERGENCE REPORT

- **Stop reason:** `maxIterationsReached` (stop policy = max-iterations; 30 of 30 completed). Convergence signals were treated as telemetry only; angles broadened rather than synthesizing early.
- **Iterations completed:** 30 of 30.
- **Questions answered:** 9/9 (KQ1-KQ9), each with file:line citations.
- **newInfoRatio trend:** 1.00 -> 0.62 -> 0.55 -> 0.70 -> 0.60 -> 0.58 -> 0.50 -> 0.40 -> 0.62 -> 0.50 -> 0.38 -> 0.60 -> 0.42 -> 0.60 -> 0.50 -> 0.62 -> 0.50 -> 0.55 -> 0.42 -> 0.58 -> 0.40 -> 0.38 -> 0.60 -> 0.50 -> 0.35 -> 0.33 -> 0.25 -> 0.22 -> 0.20 -> 0.18
- **Average newInfoRatio:** 0.488 (descending arc: coverage 1-5 → mechanism/council/orchestrate/plugin 6-15 → benchmark/pattern/propagation/FIX5 16-24 → adversarial re-checks 25-26 → analytical synthesis 27-30).
- **Adversarial re-checks:** iters 8, 11, 13, 19, 22, 25, 26 (mode-D vs latency confound; council depth-0 value; delegation authority; pattern over-constrain; must-NOT-harden; KQ4+KQ5 holes; KQ3+KQ9 holds).

---

## REFERENCES (key citations)

- `../001-deep-agent-router-and-orchestration/research/research.md` — §0 (axiom caveat), §1 (root cause), §3/§3.1 (pre-route edits + latency), §5 (FIX-5 false-negative), §7 (verification), §8/§8b (parity + host identity), §9 (deferrals)
- `.opencode/agents/{deep,orchestrate,ai-council,context}.md` — deep.md:4,34-46,51-59,63-79,83-98; orchestrate.md:4,42,95-105,162,194-225,206-207,502-577; ai-council.md:4,36-60
- `.opencode/commands/deep/{research,review,context,ai-council}.md`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:10-16,18-146`
- `.opencode/skills/cli-opencode/SKILL.md:16,66,87,319`
- `005-gpt-verification-smoke/verification-smoke.md:42-66,90-99,120`
- `006-host-hard-identity-fix5/decision-record.md:11-14,20-22,29`
- `research-prompt.md` (KQ1-KQ9, boundaries, stop conditions); `../goal-prompt.md` (symptoms)

---

*Synthesis by the glm-max fan-out lineage (cli-opencode / zai-coding-plan/glm-5.2 / reasoning max) from 30 fresh-context iterations. Sibling lineage: gpt-fast-high. Iteration narratives in `iterations/`; structured deltas in `deltas/`; state log in `deep-research-state.jsonl`.*
