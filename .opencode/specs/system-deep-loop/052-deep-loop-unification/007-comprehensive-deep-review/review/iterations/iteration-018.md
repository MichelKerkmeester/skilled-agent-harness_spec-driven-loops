# Deep Review Iteration 018

## Dimension

Correctness + security: `deep-ai-council` packet.

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md:86`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:39`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:624`
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:4`
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:291`
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:342`
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:357`
- `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:464`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md:22`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md:67`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md:114`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md:153`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md:19`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/seat_diversity_patterns.md:132`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md:30`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/failure_handling.md:135`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/anti_patterns.md:44`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/patterns/command_wiring.md:140`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/output_schema.md:35`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state_format.md:22`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state_format.md:167`
- `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state_format.md:215`
- `.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json:9`
- `.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json:10`
- `.opencode/skills/system-deep-loop/deep-ai-council/assets/deep_ai_council_config.json:15`
- `.opencode/skills/system-deep-loop/deep-ai-council/assets/prompt_pack_round.md:33`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:441`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:446`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:498`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:519`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:987`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/audit-trail.cjs:117`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/rollback.cjs:29`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/rollback.cjs:93`
- `.opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:111`
- `.opencode/skills/system-deep-loop/deep-ai-council/manual_testing_playbook/03--artifact-persistence-and-state-format/state-jsonl-records-council-complete-event.md:25`

## Findings By Severity

### P0

None.

### P1

#### DR-018-P1-001 [P1] Persistence always records council completion as converged

- File: `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:446`
- Category: correctness-state-integrity
- Finding class: cross-consumer
- Claim: The full-report persistence path writes `council_complete` with `convergence: true` for every parsed report, so max-round non-convergence and all-seat failure reports can be durably recorded as converged even though the packet docs require non-converged or failed treatment.
- Evidence: `renderArtifacts()` builds state events with `{ event: 'council_complete', ..., convergence: true }` unconditionally at `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:446`. The convergence reference requires max-round escape to emit `council_complete` with `convergence:false` at `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/convergence_signals.md:30`. Failure handling says all-seat failure should not produce a normal `council_complete` with `convergence:true` at `.opencode/skills/system-deep-loop/deep-ai-council/references/convergence/failure_handling.md:135`.
- Counterevidence sought: Checked whether `parseCouncilReport()` extracts a convergence flag, whether `output_schema.md` requires a convergence section, whether the config template exposes a convergence mode, and whether `advise-council-completion.cjs` rejects false convergence. The parsed model only carries required sections and plan confidence, the schema requires composition/seats/recommended plan/plan confidence, and the advisory only checks existence of a `council_complete` event.
- Alternative explanation: The helper may have been intended only for successful converged reports. That is not enforced by the CLI or schema, and the packet documents explicitly discuss max-round and failure persistence through the same state format.
- Final severity: P1
- Confidence: 0.88
- Downgrade trigger: Downgrade to P2 if a caller-owned preflight is found that blocks `persist-artifacts.cjs` from being invoked for non-converged or failed reports, or if a separate artifact field is proven to be the authoritative convergence source for all consumers.
- Recommendation: Add an explicit convergence input/parse path and fail closed when a report indicates non-convergence or failure but no durable `convergence:false` state can be written.

### P2

#### DR-018-P2-001 [P2] Completion docs and tests still describe a terminal `council_complete` event after audit events were added

- File: `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md:153`
- Category: documentation-correctness
- Finding class: matrix/evidence
- Claim: Several operator-facing surfaces still require or test that `ai-council-state.jsonl` ends with `council_complete`, but the current writer appends `artifact_written` audit events after the rendered state log, and the live advisory accepts any `council_complete` event rather than a terminal one.
- Evidence: The loop protocol acceptance criteria says `ai-council-state.jsonl` ends with `council_complete` at `.opencode/skills/system-deep-loop/deep-ai-council/references/integration/loop_protocol.md:153`. State format says every run closes with `council_complete` at `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state_format.md:22`, while the same file later documents v1.2 `artifact_written` audit events at `.opencode/skills/system-deep-loop/deep-ai-council/references/structure/state_format.md:167`. The writer emits the full state log and then every scoped writer appends audit records via `appendArtifactWrittenEvent()` at `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs:498` and `.opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/audit-trail.cjs:117`. The live advisory checks `stateEvents.some(event => event.event === 'council_complete')` rather than terminal position at `.opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs:111`.
- Scope proof: Grep also found the README and DAC-006 manual test still using terminal/tail wording; this is a docs/test contract drift, not a runtime completion failure because the advisory already uses presence semantics.
- Recommendation: Update the affected docs/tests to distinguish completion-bearing events from later audit events, or change the writer order if terminal `council_complete` is still intended.

## Traceability Checks

- `state_protocol_vs_writer`: fail. The writer does not preserve non-converged completion semantics for failed/max-round cases.
- `rollback_helper`: pass with caveat. `moveRoundToFailed()` and `markSuperseded()` operate on normalized round ids and existing artifact paths; no new rollback logic bug was confirmed in this pass.
- `seat_count_round_count`: pass. SKILL says 2-3 seats, seat diversity caps at 3, and config defaults `seats_per_round:3`, `max_rounds:3`.
- `seat_influence_guardrails`: pass. Protocol separates independent proposals, cross-seat critique, convergence checks, failure handling, anti-pattern detection, and simulated-vantage labeling. No direct unsafe cross-seat context mutation was confirmed.
- `credential_scan`: pass with caveat. Scoped credential-pattern scan found no real committed secrets; matches were documentation/examples such as hostile metadata redaction using `secret: 'leak-me'`.
- `allowed_tools_scope`: pass with caveat. SKILL grants Read/Write/Edit/Bash/Glob/Grep; packet docs use read/search for evidence, Write/Edit for packet-local `ai-council/**`, and Bash for helper/validation invocation. No new tool-scope finding was confirmed.

## Verdict

CONDITIONAL. The packet has one new P1 correctness issue in persisted convergence state and one P2 documentation/test drift. No P0 or credential exposure was confirmed.

## Next Dimension

Iteration 19 should finish `deep-ai-council` with traceability + maintainability. Focus on command/agent identity (`deep-ai-council` skill vs `ai-council` agent), feature catalog/playbook parity, changelog/version drift, graph support documentation, and whether DR-018-P1-001 is reflected consistently across operator docs.

Review verdict: CONDITIONAL
