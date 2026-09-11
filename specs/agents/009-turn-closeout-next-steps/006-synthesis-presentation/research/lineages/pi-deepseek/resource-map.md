# Resource Map: Synthesis Presentation Research

Sources consulted by lineage `pi-deepseek`, grouped by role.

## Primary corpus under study

| Resource | Use |
|----------|-----|
| `REPO RULES.md` | Router: trigger table sections 2, scope statement section 4 In/Out and all four widenings, precedence ladder |
| `repo-rules/communication.md` | Sections 2, 4, 5, 6, 7, 8, 11, 12: reply doctrine, HVR boundary, recommendation presentation, length ceiling |
| `repo-rules/handoff-and-questions.md` | Sections 1-7: turn-end handback, operator-action table, structured choices |
| `repo-rules/evidence-and-proof.md` | Sections 1, 7, 8, 9, 10: proof tiers, finding-as-hypothesis, close-out |
| `repo-rules/prevent-overengineering.md` | Reversal-cost order, restraint-versus-delivery line |
| `repo-rules/scope-discipline.md` | Scope lock, adjacent-defect protocol, plan-before-acting |
| `repo-rules/uncertainty-and-honesty.md` | Confidence bands, UNKNOWN, two registers |
| `repo-rules/delegation-and-orchestration.md` | Sections 2, 3, 4, 5, 6: brief contents, judgment questions, verification of returns |
| `repo-rules/blast-radius.md` | Reversibility tiers (write containment context) |
| `repo-rules/root-cause-and-debugging.md` | Symptom-versus-producer framing |
| `repo-rules/skill-hub-routing.md` | Two-stage routing and report-only-is-not-proof discipline |
| `AGENTS.md` | Gate 5 load mechanics (121-128), Gate 3 (65-66), section 3 (184-187), section 4 (229-257), section 6 (386-403), section 8 (422-430), section 10 (500-518) |

## Decision doctrine

| Resource | Use |
|----------|-----|
| `.opencode/skills/sk-doc/sk-create-repo-rule/references/decision-tests.md` | The four tests, their outcomes, the near-miss, the refusal routing table |
| `.opencode/skills/sk-doc/sk-create-repo-rule/references/rule-anatomy.md` | Length bands (244/250), structural MUSTs, sideways-link default |
| `.opencode/skills/sk-doc/sk-create-repo-rule/references/creation-standards.md` | Five reader tests, duplication guard, don'ts |

## Deep-loop presentation contracts

| Resource | Use |
|----------|-----|
| `.opencode/commands/deep/assets/deep-research-presentation.txt` | Results Display success/failure templates, workflow overview (17 sections), negative knowledge |
| `.opencode/commands/deep/assets/deep-review-presentation.txt` | Results Display success template: severity counts plus verdict token |
| `.opencode/commands/deep/assets/deep-ai-council-presentation.txt` | Results Display success template and artifact paths |
| `.opencode/commands/deep/assets/deep-agent-improvement-presentation.txt` | Results Display return status and scored example output |
| `.opencode/commands/deep/assets/deep-model-benchmark-presentation.txt` | Results Display review results (the only recommendation field), example output, Lane B routing |
| `.opencode/commands/deep/assets/deep-skill-benchmark-presentation.txt` | Results Display return status, machine record, presentation boundary |

## Deep-loop mode skills

| Resource | Use |
|----------|-----|
| `.opencode/skills/system-deep-loop/deep-research/SKILL.md` | Executor invariants, success criteria, convergence report fields |
| `.opencode/skills/system-deep-loop/deep-review/SKILL.md` | Report sections, severity table, verdict table, final-line contract |
| `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md` | Planning-only handoff, two-of-three convergence, output schema ownership |
| `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` | Three lanes, stopReason/sessionOutcome enums, Lane B mechanics, resume caveat |

## HVR standard

| Resource | Use |
|----------|-----|
| `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` | Purpose/usage scope, voice directives, punctuation, structural patterns, word and phrase lists, pre-publish structure checklist |

## Incident evidence

| Resource | Use |
|----------|-----|
| `specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/deep-research-config.json` | Four-iteration cap and max-iterations stop policy |
| `specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/deep-research-state.jsonl` | Four iteration records and the closing synthesis_complete row |
| `specs/agents/009-turn-closeout-next-steps/001-deep-research/research/lineages/pi-deepseek/research.md` | The 265-line synthesis, measured |
| `specs/agents/009-turn-closeout-next-steps/006-synthesis-presentation/spec.md` | Packet problem statement, scope boundary with sibling packet 046, requirements |

## Sibling packet

| Resource | Use |
|----------|-----|
| `specs/system-deep-loop/046-synthesis-chat-presentation/spec.md` and `plan.md` | Scope of the runtime change to the presentation contracts (checked; plan still a scaffold) |

## Machine counts measured

| Metric | Value | Command |
|--------|-------|---------|
| `repo-rules/communication.md` lines | 244 | `wc -l` |
| `REPO RULES.md` lines | 107 | `wc -l` |
| `AGENTS.md` lines | 518 | `wc -l` |
| 001 lineage `research.md` lines | 265 | `wc -l` |
| Rule files under `repo-rules/` | 10 | `ls` |
| Results Display sections read | 6 | `grep -n "Results Display"` |
