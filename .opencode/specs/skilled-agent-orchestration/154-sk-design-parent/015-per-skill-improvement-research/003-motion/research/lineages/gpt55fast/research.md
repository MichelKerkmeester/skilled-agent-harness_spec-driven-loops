# Deep Research Synthesis: sk-design motion improvement

> Packet: `154-sk-design-parent/015-per-skill-improvement-research/003-motion`
> Lineage: `gpt55fast`
> Session: `fanout-gpt55fast-1782532104406-n794vy`
> Stop reason: converged after 6 of 10 iterations
> Write boundary: lineage-local artifacts only

## 1. Executive Summary

The motion packet is already strong. The prior 009 research's highest-priority motion items, the restraint gate and three reusable cards, are implemented and wired. The next improvements should therefore be surgical: fix router/resource contract drift, add a compact advanced-craft top-up, repair manual-playbook fixture drift, preserve motion-specific benchmark evidence, and refresh traceability docs.

The most important finding is not missing motion wisdom. It is a resource-loading contract mismatch: the SKILL says every motion task starts with the shared Brand-vs-Product register and the animation decision framework, but the router pseudocode defaults only to `corpus_map.md` and cannot load `../shared/register.md` through its packet-local guard. That affects efficiency and correctness for every motion task.

## 2. Method

The loop read the deep-research workflow contract, the `cli-opencode` executor guard, the current `sk-design` hub and registry, the current motion packet, all motion references/assets/manual scenarios, prior 009 and 012 spec evidence, the local 014 benchmark artifact set, and a targeted external corpus subset.

No sub-agents were dispatched. No `opencode run` self-invocation was used. The `artifact_dir` was bound directly to the fan-out override as instructed.

## 3. Current-State Baseline

| Area | Confirmed state | Evidence |
|---|---|---|
| Packet path | User's `motion` target maps to `.opencode/skills/sk-design/design-motion` | [SOURCE: .opencode/skills/sk-design/mode-registry.json:40-49] |
| Parent routing | `sk-design` is the single advisor-routable identity; hub resolves `workflowMode` | [SOURCE: .opencode/skills/sk-design/SKILL.md:39-56] |
| Motion scope | Temporal interaction design, animation, micro-interactions, presence, reduced motion | [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:13-16] |
| Completed 009 motion work | Restraint gate plus three motion assets implemented in phase 012 | [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/012-foundations-motion-audit/implementation-summary.md:64-69] |
| Local benchmark artifact | Present 014 report is `design-interface`, not motion | [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:1-6] |

## 4. Prioritized Improvements

| Priority | Improvement | Why it helps | Evidence |
|---|---|---|---|
| P1 | Align router resource loading with the ALWAYS contract | Ensures every motion task actually starts from the register and restraint gate, preventing wasted or miscalibrated motion guidance | [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:95-104]; [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:114-117]; [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:151-156]; [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:201-209] |
| P1 | Add compact advanced-craft top-up | Captures residual high-value Emil craft not already covered: origin-aware popovers, instant subsequent tooltips, `@starting-style`, slow-motion debugging, Motion shorthand caveat | [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md:234-276]; [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md:324-341]; [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md:500-517]; [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md:642-661] |
| P1 | Repair manual-playbook expected-resource drift and add hub routing scenario | Makes manual/benchmark validation match what the skill actually says it loads, and tests the parent `sk-design -> motion` path | [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/01--strategy/001-purposeful-motion-plan.md:11-15]; [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/03--reduced-motion/001-performance-and-reduced-motion.md:11-16]; [SOURCE: .opencode/skills/sk-design/design-motion/manual_testing_playbook/03--reduced-motion/001-performance-and-reduced-motion.md:30-34] |
| P2 | Persist a motion-specific benchmark report or fixture | The user supplied a 100/100 claim, but the local report present is interface. A motion-labeled artifact prevents future inference errors | [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:1-6]; [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md:62-65] |
| P2 | Update corpus map and stale changelog language | Keeps traceability honest after nested packet conversion and after any advanced-craft top-up | [SOURCE: .opencode/skills/sk-design/design-motion/references/corpus_map.md:33-44]; [SOURCE: .opencode/skills/sk-design/design-motion/changelog/v1.0.0.0.md:14-17]; [SOURCE: .opencode/skills/sk-design/SKILL.md:74-77] |
| P2 | Add implementation mechanism and stack-boundary field to motion cards | Prevents accidental library migration or mixed animation systems before `sk-code` handoff | [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:256-259]; [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/fixing-motion-performance.md:116-120]; [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:38-40] |
| P3 | Add an on-demand advanced-rendering card only if needed | Preserves extraordinary-motion ideas while avoiding default slop or expensive effects | [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/overdrive.md:19-27]; [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/overdrive.md:93-116] |

## 5. Rationale Details

### 5.1 Router Contract Alignment

The motion skill's prose is correct: the register sets the motion budget and the decision framework decides whether animation is allowed before timing or easing. But the router pseudocode does not mirror that. It defaults to `references/corpus_map.md`, and its guard only allows markdown under `SKILL_ROOT`, which blocks the shared register. This can make deterministic router replay under-load compared with the human workflow.

Recommended implementation shape for a future code/doc phase:

- Treat `../shared/register.md` as a parent-shared pre-load with an explicit allowlist.
- Treat `references/animation_decision_framework.md` as a baseline motion resource for all intents.
- Keep `corpus_map.md` baseline for traceability, but not as the only default.
- Update playbook expected resources after the router contract is clarified.

### 5.2 Advanced Craft Top-Up

Do not build a broad advanced rendering system. The useful residual is smaller: a craft reference that gives concrete edge cases designers and implementers actually forget. Candidate sections:

- Origin-aware popovers, with modals exempt.
- Tooltips with initial delay but instant adjacent follow-up.
- `@starting-style` versus mounted-state hacks.
- Slow-motion and frame-by-frame debugging.
- Framer Motion shorthand caveat under load.
- Hover media query and touch-device hover false positives.

### 5.3 Playbook and Benchmark

The playbook's eight scenarios are valuable. The improvements are quality-of-evidence improvements, not volume:

- Fix expected resource lists to match mandatory resources.
- Add a parent-hub routing scenario.
- Add a motion-specific benchmark output or fixture matching the claimed 100/100 score.
- Keep adversarial refusal tests like the dashboard command-palette scenario.

### 5.4 Traceability Freshness

The current `corpus_map.md` does not list `emil-design-eng` or `overdrive`. If the advanced-craft top-up lands, add `emil-design-eng` to traceability. If an advanced-rendering on-demand card lands, include `overdrive` but mark it on-demand and propose-first.

The initial changelog still references flat-skill era artifacts (`feature_catalog/`, per-packet `graph-metadata.json`). In the nested packet model, only the hub carries graph metadata. Refreshing that note prevents future maintainers from chasing missing files.

## 6. Explicit Do-Not List

| Do not | Reason | Evidence |
|---|---|---|
| Do not re-add the restraint gate or three cards | They are already implemented | [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/012-foundations-motion-audit/implementation-summary.md:64-69] |
| Do not bulk-import the external corpus | Prior research chose operational refs and cards over volume | [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md:158-176] |
| Do not make motion-performance release scoring a motion responsibility | Motion owns build-side guidance; audit owns scoring and findings | [SOURCE: .opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:14-18] |
| Do not split out a `design-interaction` child | Parent hub has five modes and motion already owns interaction motion | [SOURCE: .opencode/skills/sk-design/SKILL.md:21-29] |
| Do not steal generic interface/design prompts | Hub defaults generic design to interface unless motion dominates | [SOURCE: .opencode/skills/sk-design/SKILL.md:56-58] |
| Do not make advanced rendering default | Overdrive requires proposal and context selection before building | [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/overdrive.md:19-27] |
| Do not run memory save in this lineage | User restricted writes to the lineage artifact directory | User instruction |

## 7. Convergence Report

| Metric | Result |
|---|---|
| Stop reason | `converged` |
| Iterations completed | 6 |
| Max iterations | 10 |
| Questions answered | 5/5 |
| newInfoRatio trend | `1.00 -> 0.72 -> 0.55 -> 0.35 -> 0.18 -> 0.04` |
| Quality guards | source diversity pass, focus alignment pass, no single weak source pass |

## 8. References

- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-motion/references/*`
- `.opencode/skills/sk-design/design-motion/assets/*`
- `.opencode/skills/sk-design/design-motion/manual_testing_playbook/*`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/register.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/009-reference-asset-expansion/research/research.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/012-foundations-motion-audit/implementation-summary.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/014-routing-benchmark/design-interface/skill-benchmark-report.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/emil-design-eng.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/overdrive.md`
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/fixing-motion-performance.md`
