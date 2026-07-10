# Deep Research Strategy - fanout gpt55-3

## 2. TOPIC
Skill-advisor scorer parent-hub compatibility for `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning` and `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer`, read-only proposals only.

## 3. KEY QUESTIONS (remaining)
- [x] Which Layer-1b parent-hub vocabulary is still half-landed?
- [x] Which vocabulary belongs in metadata rather than hardcoded scorer boosts?
- [x] How should cross-hub collisions be reported and owned?
- [x] Which advisor projection fields are unvalidated by the current guard?
- [x] How should ambiguous cross-hub prompts be measured?
- [x] What runbook avoids stale DB/baseline drift after metadata changes?
- [x] When, if ever, should conflicts_with edges be authored?
- [x] How should hardcoded command bridges become metadata-derived?
- [x] How should query-class, hub-router, and eval-bucket taxonomies align?
- [x] What is the cheapest semantic_shadow response to mcp-* abstain false-fires?

## 4. NON-GOALS
- No edits to `.opencode/skills/system-skill-advisor/mcp_server`.
- No edits to parent-hub `graph-metadata.json`, `mode-registry.json`, or scorer tests.
- No live advisor reindex, rebuild, baseline capture, or ratchet update.
- No recommendation to raise `semantic_shadow` weight.

## 5. STOP CONDITIONS
- Stop after 10 iterations regardless of early convergence.
- Synthesize read-only proposals with source citations.
- Keep all lineage writes under the `gpt55-3` artifact directory.

## 6. ANSWERED QUESTIONS
- Parent-hub compatibility is currently blocked most by deep-loop review vocabulary that still says `iterative code audit`, `severity weighted findings`, and `code audit` while sk-code owns single-pass review/audit signals.
- Metadata should own hub identity, mode aliases, and human-facing workflow vocabulary; code should keep command bridge policy, task-class guards, abstain/safety floors, and cross-lane calibration mechanics.
- Cross-hub collision reporting needs hub + mode + intent-class ownership, not only normalized string collisions.
- The existing parent-hub guard does not validate the full advisor projection surface.
- Ambiguity measurement needs a labeled cross-hub fixture set, not only the existing low-margin slice and synthetic tie check.
- Reindex and baseline recapture should be one atomic operation after metadata changes.
- `conflicts_with` is available in scorer graph-causal logic but should only be used for measured mutually-exclusive pairs.
- Command bridges can follow the executor-delegation pattern: derive aliases from metadata at projection/build time, not from hardcoded tables.
- Query-class, hub-router classes, and eval buckets need a crosswalk gate, not complete runtime derivation.
- `semantic_shadow` should remain frozen; address mcp-* attractors through embedding-description hygiene and abstain fixtures.

## 7. WHAT WORKED
- Reading parent hub metadata side by side with scorer projection and lane code exposed exact authority seams.
- Treating angle 1-5 as the priority produced a clear safe-deletion and measurement sequence before lower-priority improvements.
- Using existing packet evidence from 007 and 008 prevented re-litigating known-falsified scorer work.

## 8. WHAT FAILED
- A pure grep for `parent-hub-vocab-sync` over all `.opencode` was too noisy; narrowing to the script and hub files was needed.
- Treating all shared words as collisions was rejected because `audit`, `review`, and `design` are legitimate across hubs with different intent classes.

## 9. EXHAUSTED APPROACHES (do not retry)
### Full hardcoded-boost migration - BLOCKED
- What was tried: classify every explicit boost as metadata-owned.
- Why blocked: command bridges and policy floors encode scorer behavior rather than hub vocabulary.
- Do NOT retry: do not propose moving every `TOKEN_BOOSTS` and `PHRASE_BOOSTS` entry into graph metadata.

### Broad conflicts_with authoring - BLOCKED
- What was tried: conflicts as a general cross-hub disambiguation channel.
- Why blocked: live skills have empty conflict arrays and the lane applies negative graph-causal scores.
- Do NOT retry: do not add broad peer-hub conflicts without measured pair fixtures.

## 10. RULED OUT DIRECTIONS
- Delete all deep-loop review vocabulary: rejected because iterative review-loop aliases must remain.
- Use `ambiguity_slice_stable` as empirical ambiguity FP/FN: rejected because the handler documents it as a synthetic stability check.
- Raise `semantic_shadow`: rejected by the 008 full-corpus ablation net-negative.
- Treat filesystem projection fallback as successful reindex: rejected because the projection code labels SQLite read failures as degraded fallback.

## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Exact corpus fixture labels for the proposed cross-hub ambiguity set remain to be authored in an implementation phase.
- Exact deletion patch for deep-loop-workflows metadata must be sequenced with reindex and ratchet recapture.
- Exact command metadata schema for generated command bridges should be selected from compiled command contracts before implementation.

## 11. NEXT FOCUS
Implementation-phase proposal: start with a no-code measurement packet that writes a cross-hub collision report and a labeled ambiguity fixture, then use that evidence to authorize metadata cleanup plus reindex/rebaseline.

## 12. KNOWN CONTEXT
resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot
- Source pointers: `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts`, `fusion.ts`, `lanes/explicit.ts`, `lanes/derived.ts`, `lanes/graph-causal.ts`, `lanes/semantic-shadow.ts`, `ambiguity.ts`, `executor-delegation.ts`.
- Parent hubs: `.opencode/skills/sk-code`, `.opencode/skills/sk-design`, `.opencode/skills/deep-loop-workflows` graph metadata, mode registries, and hub routers.
- Existing eval context: packet `007-eval-hardening` ambiguity/baseline evidence; packet `008-semantic-shadow-prove-or-freeze` freeze evidence.
- Constraints: hard read-only scorer/advisor code; write only to this lineage directory; parent-hub compatibility has highest priority.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10.
- Convergence threshold: 0.05, telemetry only before max iteration.
- Stop policy: max-iterations.
- Per-iteration budget: 12 tool calls, 10 minutes.
- Progressive synthesis: true.
- Current generation: 1.
- Started: 2026-07-07T00:00:00.000Z.
