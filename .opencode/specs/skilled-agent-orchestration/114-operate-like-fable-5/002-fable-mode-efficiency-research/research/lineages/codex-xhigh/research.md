# Research Synthesis: codex-xhigh Fable-5 Efficiency Lineage

## 1. Executive Summary
This lineage converged in 6 of 10 allowed iterations. The core conclusion is that round 2 should not add another large doctrine block. Round 1 already landed the Fable5 evidence/operations doctrine in the highest-read text surfaces. The new leverage is mechanism and measurement: a compact Fable governor riding the existing prompt-time hook/advisor bridge, a leak-test-style behavioral metric, and targeted ritual upgrades for mutation checks, cold-successor handoffs, and evidence-schema validation.

Protocol caveat: the fan-out request named `cli-codex model=gpt-5.5`, but nested Codex CLI dispatch is forbidden by the `cli-codex` self-invocation guard. This lineage therefore records the requested executor metadata and ran directly in the current Codex seat. Treat this as content-complete but process-degraded.

## 2. Method
The loop followed the deep-research packet contract in artifact-local form:
- phase_init: created config, strategy, state log, registry, dashboard, prompt directory, iteration directory, and delta directory.
- phase_main_loop: ran six focused iterations with one markdown narrative and one delta stream per iteration.
- phase_synthesis: created this synthesis, an artifact-local resource map, and an artifact-local recommendation map.

The parent spec write-back, memory save, and git staging steps were intentionally skipped because the fan-out prompt froze writes to the lineage artifact directory.

## 3. Evidence Corpus
Primary sources:
- `external/Fable5.md`: distilled round-1 doctrine. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/Fable5.md:7]
- `external/fable-mode-main/`: command overlay plus behavioral profile. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/fable-mode-main/fable-mode.md:9]
- `external/opus-fable-mode-main/`: governor, re-injection hook, and measurement harness. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/README.md:47]
- Round-1 packet: what already shipped and must not be duplicated. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/001-initial-refinement/before-vs-after.md:17]
- Public framework surfaces: AGENTS, skills, agents, commands, hooks, advisor, doctor, deep-loop runtime.

## 4. Round-1 Dedup Baseline
Round 1 already shipped:
- root AGENTS/CLAUDE operating-discipline bullets. [SOURCE: AGENTS.md:59]
- constitutional `regression-baseline-and-delta.md`. [SOURCE: .opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md:20]
- constitutional `finding-is-a-hypothesis.md`. [SOURCE: .opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md:20]
- outward/irreversible action fold in `main-branch-direct-push.md`. [SOURCE: .opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md:28]
- sk-code baseline/blast-radius at the verification point. [SOURCE: .opencode/skills/sk-code/SKILL.md:43]

Do not re-recommend those as new work. Build on them.

## 5. Net-New Technique Taxonomy
| Technique | Type | Net-new value | Best surface |
|---|---|---|---|
| Mutation check after GREEN | ritual / mechanism | Proves a test pins the intended behavior, not only that it passes | sk-code, sk-code-review |
| Adversarial claim/verdict/evidence schema | ritual / mechanism | Forces reviewers/agents to cite and classify claims | orchestrate, deep-review, agent I/O |
| Scar-tissue cold-successor handoff | ritual / doctrine | Carries state, sequence, and traps that cannot be re-derived | memory save, handover templates |
| Rotting list to self-auditing test | mechanism | Turns stale docs into failing checks | sk-code, validation docs |
| Two-register working cadence | doctrine / voice | Less narrating during work, denser boundary summaries | governor capsule, global voice |
| Recursion depth limit 1 | doctrine / model-specific | Stops self-audit loops and armor hedging | governor capsule |
| UserPromptSubmit re-injection | mechanism | Reasserts the governor as context grows | hook/advisor bridge |
| Leak-test metrics | measurement | Verifies whether behavior moved | doctor or benchmark command |

## 6. Surface Reliability Map
| Surface | Runtime reach | Read reliability | Best use | Notes |
|---|---|---:|---|---|
| Root AGENTS/CLAUDE | all | Very high | universal hard rules | Already used by round 1; avoid bloat |
| Constitutional memory | all via memory surfacing | High when triggered | small enforceable invariants | Good for one or two rule-level deltas |
| Skill Advisor UserPromptSubmit hook | Claude, Codex, OpenCode bridge | Very high when registered | compact governor injection | Best match for thermostat pattern [SOURCE: .opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md:36] |
| Hook system / runtime adapters | Claude, Codex, OpenCode, Copilot next-prompt | High but config-sensitive | transport, fail-open, stale markers | Codex readiness depends on hooks enabled [SOURCE: .opencode/skills/system-spec-kit/references/config/hook_system.md:43] |
| sk-code / sk-code-review | code tasks | High at point of work | mutation checks, self-auditing tests | Keep blast-radius gated |
| orchestrate / deep-review agents | delegated workflows | Medium-high when dispatched | evidence schema, adversarial review | Agent surface is role-specific |
| deep-loop runtime | deep workflows | Medium-high | executor provenance, fail-loud audit | Mechanism, not doctrine |
| /doctor routes | explicit diagnostics | Medium | behavior metrics and health checks | Good for leak-test-style reporting |
| /deep:* benchmark routes | explicit benchmarks | Medium | fixture-based behavior scoring | Alternative to doctor target |
| Slash command overlay | one runtime/session | Low for defaults | optional operator mode | Not primary Public mechanism |

## 7. Ranked Recommendation Map
| Rank | Tier | Surface | Delta | Leverage | Cost | Blast | Dedup |
|---:|---|---|---|---:|---:|---:|---|
| 1 | B | prompt-time hook/advisor bridge | Add compact Fable governor capsule: reason outward, recursion depth 1, minimum honest qualifier, outcome over visible process, batch work, result-first openings | 5 | 3 | 3 | new |
| 2 | C | /doctor or deep benchmark | Add leak-test-style metric for median words/message, tool:text, caveat percentage, self-opener percentage | 5 | 3 | 2 | new |
| 3 | B | deep-loop-runtime executor audit | Fail loud on CLI dispatch crash/model fallback; never silently downgrade executor/model provenance | 5 | 3 | 3 | carries prior defect |
| 4 | B | sk-code + sk-code-review | Add blast-radius-gated mutation-check guidance for tests and claims | 4 | 2 | 2 | new ritual |
| 5 | B | memory save / handover templates | Add scar-tissue trap ledger: blast site, activation condition, how to avoid re-paying it | 4 | 2 | 2 | new ritual |
| 6 | A | governor capsule or global voice | Minimal recursion-control/outcome-over-process doctrine, not a new long AGENTS block | 3 | 1 | 1 | partially new |
| 7 | B | orchestrate/deep-review/agent I/O | Tighten claim/verdict/evidence contract and contradiction adjudication | 3 | 3 | 2 | partly covered by finding-as-hypothesis |
| 8 | C | /deep:skill-benchmark or /deep:model-benchmark | Add fixture-based Fable-governor evaluation if doctor is too diagnostic-only | 3 | 3 | 2 | alternative to rank 2 |

## 8. Recommended Mechanism Architecture
Use the opus source's shape:
- setpoint: a compact governor capsule.
- thermostat: prompt-time hook or OpenCode system transform that re-injects the capsule.
- measurement: leak-test/benchmark output that reports movement toward Fable signature.

The governor should stay small. Candidate content:
- reason about the problem and person, not model self-image;
- one self-audit maximum, then return to the task;
- qualify only when the caveat changes what the reader should do;
- make reversible choices and move;
- batch tool work and report at natural checkpoints;
- open with result/object, not self-narration;
- preserve depth aimed at the problem.

## 9. Measurement Plan
Start with the opus leak-test metrics:
- median words/message;
- tool:text ratio;
- unsolicited caveat percentage;
- self-opener percentage.

For Public, add two repo-specific signals:
- tool/prose checkpoint ratio for Codex/OpenCode/Claude transcripts where available;
- completion-claim evidence ratio: number of done/works/verified claims with nearby command/file evidence.

Do not treat metrics as moral scoring. They are drift detectors.

## 10. Runtime and Provenance Caveats
This lineage did not spawn nested `codex exec`. The `cli-codex` skill forbids self-invocation from inside Codex. [SOURCE: .opencode/skills/cli-codex/SKILL.md:17]

Prior packet research also documents a related runtime defect: repeated cli-codex dispatch can SIGKILL and silently fall back to gpt-5 in the existing executor audit path. [SOURCE: .opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/research/research.md:1]

Rank 3 is therefore not optional polish. It protects the core Fable rule that artifact claims must not lie.

## 11. Recommendations
Do rank 1 and rank 2 together. A governor without measurement is wishful; measurement without a governor only quantifies the current state. Then do rank 3 before relying on future fan-out model comparisons. Add rank 4 and rank 5 as point-of-use ritual upgrades after the mechanism path exists. Keep rank 6 tiny or fold it into the governor capsule.

## Eliminated Alternatives
| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Re-recommend round-1 AGENTS/constitutional/sk-code distribution | Already shipped; violates dedup requirement | `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/001-initial-refinement/before-vs-after.md:17` | 1 |
| Slash-command-only Fable mode | On-demand and session-local, not persistent enough | `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/fable-mode-main/README.md:3` | 2 |
| Prompt text as capability upgrade | Source says prompts steer style but not capability ceiling | `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/README.md:7` | 3 |
| Scatter doctrine across all agents/commands | Lower read reliability and higher drift than hook injection | `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md:36` | 4 |
| AGENTS-only governor | Single-load setpoint decays; no thermostat or measurement | `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/README.md:77` | 5 |
| Claim actual nested cli-codex process provenance | Self-invocation guard forbids nested Codex dispatch | `.opencode/skills/cli-codex/SKILL.md:17` | 6 |
| Run parent spec write-back or memory save from this leaf | Would write outside the lineage artifact_dir | `.opencode/commands/deep/assets/deep_research_auto.yaml:906` | 6 |

## 12. Open Questions
None blocking inside this lineage. Merge-level open question: whether the owner wants the measurement delivered as `/doctor fable-mode` or as a `/deep:*benchmark` lane.

## 13. Risks
| Risk | Impact | Mitigation |
|---|---|---|
| Governor becomes another prose wall | High | Keep it compact and delivered by hook |
| Metrics create performative terseness | Medium | Pair metrics with task-success and evidence ratios |
| Hook registration differs by runtime | Medium | Use existing hook/advisor readiness and stale markers |
| Executor provenance remains silent | High | Fail loud on model mismatch/crash before future fan-out |

## 14. Convergence Report
- Stop reason: converged.
- Total iterations: 6.
- Questions answered: 6 / 6.
- Remaining questions: 0.
- newInfoRatio trend: `0.92 -> 0.78 -> 0.61 -> 0.43 -> 0.24 -> 0.04`.
- Quality guards: source diversity passed; focus alignment passed; no single weak-source dominance.
- Graph gates: not applicable; graphEvents were omitted.

## 15. Artifacts
- `deep-research-config.json`
- `deep-research-state.jsonl`
- `deep-research-strategy.md`
- `deep-research-findings-registry.json`
- `deep-research-dashboard.md`
- `iterations/iteration-001.md` through `iterations/iteration-006.md`
- `deltas/iter-001.jsonl` through `deltas/iter-006.jsonl`
- `resource-map.md`
- `recommendations.md`

## 16. References
- `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/002-fable-mode-efficiency-research/spec.md`
- `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/Fable5.md`
- `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/fable-mode-main/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/external/opus-fable-mode-main/`
- `.opencode/specs/skilled-agent-orchestration/z_archive/114-operate-like-fable-5/001-initial-refinement/before-vs-after.md`
- `AGENTS.md`
- `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md`
- `.opencode/skills/system-spec-kit/references/config/hook_system.md`
- `.opencode/skills/sk-code/SKILL.md`
- `.opencode/commands/doctor/_routes.yaml`

## 17. Merge Handoff
Merge should keep the recommendation ordering and carry the executor caveat forward. If the sibling lineage disagrees, adjudicate ranks 1-3 first: hook governor, measurement, executor fail-loud. Those are mutually reinforcing and have the highest leverage-to-blast ratio.
