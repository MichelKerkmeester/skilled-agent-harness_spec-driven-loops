# Recommendations: codex-xhigh Fable-5 Efficiency Map

## Verdict
Do not spend round 2 on another AGENTS-style doctrine dump. Round 1 already landed the core doctrine. Spend the next implementation packet on persistent mechanism plus measurement:

1. compact Fable governor via prompt-time hook/advisor bridge;
2. leak-test-style measurement route;
3. executor provenance fail-loud hardening.

## Ranked Items
| Rank | Tier | Surface | Delta | Why it wins | Dedup status |
|---:|---|---|---|---|---|
| 1 | B | Skill Advisor prompt-time hook / OpenCode bridge / Codex UserPromptSubmit | Inject compact Fable governor capsule every prompt when enabled | Matches source thermostat pattern and has highest runtime reach | New |
| 2 | C | `/doctor fable-mode` or `/deep:*benchmark` | Report median words/message, tool:text, caveat %, self-opener %, and evidence-backed completion ratio | Makes behavior measurable instead of aesthetic | New |
| 3 | B | deep-loop-runtime executor audit | Fail loud on CLI crash, model mismatch, or fallback; record actual process provenance | Prevents false research claims and repeats prior defect | Carries prior defect |
| 4 | B | sk-code / sk-code-review | Add blast-radius-gated mutation-check guidance | Pins tests and claims to observable failure | New ritual |
| 5 | B | memory save / handover templates | Add scar-tissue trap ledger with blast site and activation condition | Keeps cold-successor handoffs from rotting | New ritual |
| 6 | A | governor capsule or global voice | Add minimal recursion-control/outcome-over-visible-process text | Useful only if kept short | Partly new |
| 7 | B | orchestrate / deep-review / agent I/O | Strengthen claim/verdict/evidence and contradiction adjudication | Extends finding-as-hypothesis to child outputs | Partly covered |
| 8 | C | deep benchmark family | Fixture-based governor evaluation | Alternative or complement to doctor route | New |

## Suggested Sequence
1. Land rank 3 first if more fan-out research will run; otherwise provenance can keep lying.
2. Land rank 1 and rank 2 together: governor plus measurement.
3. Add rank 4 and rank 5 as targeted ritual upgrades.
4. Only then consider rank 6/7 text, and keep it compact.

## Governor Capsule Candidate
Reason about the problem and the person, not model self-image. One self-audit maximum, then return to the task. Qualify only when the qualifier changes what the reader should do. Make reversible decisions and move. Batch tool work; report at natural checkpoints. Open with the result or object, not self-narration. Preserve depth aimed at the problem.

## Measurement Candidate
| Metric | Source | Direction |
|---|---|---|
| Median words/message | `leak_test.py` | lower toward Fable, but not at the expense of task success |
| Tool:text ratio | `leak_test.py` | higher in execution work |
| Unsolicited caveat % | `leak_test.py` | lower |
| Self-opener % | `leak_test.py` | lower |
| Evidence-backed completion ratio | Public-specific extension | higher |

## Do Not Do
| Avoid | Reason |
|---|---|
| Another long AGENTS block | Round 1 already used that channel and the profile warns about doc sprawl |
| Slash-command-only mode | Too opt-in and local |
| Capability-equivalence claims | Source says prompts cannot change weights |
| Silent executor fallback | Directly contradicts the Fable "artifact must not lie" doctrine |

## Evidence Anchors
- Round-2 scope: `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/002-fable-mode-efficiency-research/spec.md:77`
- Round-1 shipped set: `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/001-initial-refinement/before-vs-after.md:17`
- Governor source: `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/governor-block.md:4`
- Re-injection source: `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/reinject.sh:4`
- Metric source: `.opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/external/opus-fable-mode-main/leak_test.py:13`
- Hook surface: `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md:36`
- Self-invocation caveat: `.opencode/skills/cli-codex/SKILL.md:17`
