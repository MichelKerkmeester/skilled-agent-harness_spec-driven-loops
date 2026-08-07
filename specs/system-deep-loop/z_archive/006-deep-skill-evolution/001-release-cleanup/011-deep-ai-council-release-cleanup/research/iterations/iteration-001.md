# Iter 001 — deep-ai-council logic-gap research

## Question

Which documented behaviors or contracts in the deep-ai-council skill (SKILL.md sections 1-8, the 11 references, and the scripts' writer / parser / rollback / council-graph contracts) are internally inconsistent, unbacked by the scripts, or missing coverage, and are NOT already listed in spec.md or audit-findings.jsonl (AF-0001..AF-0009)?

## Evidence (file:line citations required)

**Contract verification greps:**

1. **Writer functions (7 claimed vs 7 found):** `grep -E "writeConfig|writeStrategyMd|writeStateJsonl|writeSeat|writeDeliberation|writeReport|writeCritique" scripts/lib/persist-artifacts.cjs` returned 20 matches. All 7 writer functions are exported at lines 746-752: `writeConfig`, `writeStrategyMd`, `writeStateJsonl`, `writeSeat`, `writeDeliberation`, `writeCritique`, `writeReport`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.cjs" lines="746-752" />

2. **council_graph_* tool names:** `grep -r "council_graph_upsert|council_graph_query|council_graph_status|council_graph_convergence" .opencode/skills/deep-ai-council` returned 34 file matches. The 4 tools are documented in references/graph_support.md lines 39-42. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/graph_support.md" lines="39-42" />

3. **State event names:** `grep -r "round_start|seat_returned|deliberation_synthesized|round_end|council_complete|artifact_written|rollback|artifact_superseded" scripts/` returned 32 matches. All 8 event types are emitted by the scripts and match the TypeScript types in references/state_format.md lines 23-87. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/state_format.md" lines="23-87" />

4. **Two-of-three convergence rule:** `grep -r "two-of-three|two_of_three" .opencode/skills/deep-ai-council` returned 49 matches. The rule is documented in references/convergence_signals.md line 21: "Use `two-of-three-agree` for v1." <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/convergence_signals.md" lines="21" />

5. **Depth 0 / Depth 1 dispatch rule:** `grep -r "Depth 0|Depth 1|depth_dispatch|sequential_thinking" .opencode/skills/deep-ai-council` returned 67 matches. The rules are documented in references/depth_dispatch.md lines 72-129. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/depth_dispatch.md" lines="72-129" />

**Documentation cross-references:**

6. **Agent body cross-references:** Multiple references (output_schema.md line 26, state_format.md line 181, graph_support.md line 113, folder_layout.md line 68, scoring_rubric.md line 339, seat_diversity_patterns.md line 269, failure_handling.md line 256) cross-reference `.opencode/agents/deep-ai-council.md`. However, the actual agent file is named `ai-council.md` (not `deep-ai-council.md`) per AF-0008. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/output_schema.md" lines="26" />

7. **MCP implementation path:** references/graph_support.md line 116 cross-references `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/` as the MCP implementation. This path exists but is not verified in this iteration. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/graph_support.md" lines="116" />

**Script behavior vs documentation:**

8. **Deep mode orchestration scripts:** scripts/orchestrate-session.cjs and scripts/orchestrate-topic.cjs implement a session → topic → round hierarchy with cost guards, findings registry, and stability scoring. These scripts import from `../../deep-loop-runtime/lib/council/` (lines 14-16 in orchestrate-session.cjs, lines 14-18 in orchestrate-topic.cjs). The references do not document this deep mode session hierarchy or the deep-loop-runtime dependency. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/orchestrate-session.cjs" lines="14-16" />

9. **Session state hierarchy:** orchestrate-session.cjs uses session-state.jsonl (line 55) and orchestrate-topic.cjs uses topic-specific round-state.jsonl (line 83). These state files are not documented in references/state_format.md, which only describes the single-round ai-council-state.jsonl format. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/orchestrate-session.cjs" lines="55" />

10. **Findings registry:** scripts/lib/findings-registry.cjs implements a session-wide findings registry with cross-topic priors (lines 339-364). This registry is not documented in any of the 11 references. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/lib/findings-registry.cjs" lines="339-364" />

11. **Graph replay implementation:** scripts/replay-graph-from-artifacts.cjs derives a council_graph_upsert payload from ai-council-state.jsonl (lines 227-337). The implementation creates SESSION, ROUND, SEAT, CLAIM, EVIDENCE, DISAGREEMENT, DECISION, and RECOMMENDATION nodes (lines 230-325). references/graph_support.md lines 48-73 document these node/edge kinds, but the replay script's specific derivation logic is not referenced. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs" lines="227-337" />

**Exclusion set verification:**

12. **AF-0001 (SKILL.md scenario count contradiction):** Already in audit-findings.jsonl as resolved. SKILL.md line 428 claimed 18 scenarios across 7 categories; actual is 32 across 9. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl" lines="1" />

13. **AF-0002 (missing FEATURE_CATALOG.md):** Already in audit-findings.jsonl as resolved. Root catalog file was missing; now authored. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl" lines="2" />

14. **AF-0003 (HVR violation 'seamless'):** Already in audit-findings.jsonl as resolved. scoring_rubric.md line 58 used 'seamless' (HVR hard-blocker). <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl" lines="3" />

15. **AF-0004 (SKILL.md phase references):** Already in audit-findings.jsonl as resolved. SKILL.md §7 carried phase/migration framing. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl" lines="4" />

16. **AF-0005 (README stale changelog):** Already in audit-findings.jsonl as resolved. README listed only v1.0/v1.1; head is v2.0.0. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl" lines="5" />

17. **AF-0006 (feature catalog back-link cascade):** Already in audit-findings.jsonl as resolved. 32 per-feature files pointed to manual_testing_playbook.md instead of FEATURE_CATALOG.md. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl" lines="6" />

18. **AF-0007 (false positive HVR grep):** Already in audit-findings.jsonl as dropped. 'holistic' and 'harness' verified as legitimate domain terms. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl" lines="7" />

19. **AF-0008 (broken agent mirror paths):** Already in audit-findings.jsonl as resolved. README referenced non-existent deep-ai-council.md agent files; actual files are ai-council.*. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl" lines="8" />

20. **AF-0009 (SKILL.md section ordering):** Already in audit-findings.jsonl as deferred. SKILL.md leads with OPERATIONAL MODES instead of WHEN TO USE. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl" lines="9" />

## Findings (numbered; each tagged P0/P1/P2 and "novel vs already-in-spec/audit")

**F-001 (P1, novel): Agent body cross-reference path mismatch across 7 references.** Multiple references cross-reference `.opencode/agents/deep-ai-council.md` (output_schema.md:26, state_format.md:181, graph_support.md:113, folder_layout.md:68, scoring_rubric.md:339, seat_diversity_patterns.md:269, failure_handling.md:256), but the actual agent files are named `ai-council.*` per AF-0008. This is a documentation-to-implementation path mismatch not captured in AF-0008 (which addressed README/runtime mirror paths only). The references should either be updated to the actual agent file names or the agent files should be renamed if a full rename is desired. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/output_schema.md" lines="26" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/state_format.md" lines="181" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/graph_support.md" lines="113" />

**F-002 (P2, novel): Deep mode session hierarchy undocumented in references.** The scripts/orchestrate-session.cjs and scripts/orchestrate-topic.cjs implement a session → topic → round hierarchy with session-state.jsonl, topic-specific round-state.jsonl, cost guards, findings registry, and stability scoring. These scripts import from `../../deep-loop-runtime/lib/council/` primitives. However, the 11 references only document single-round council behavior and the ai-council-state.jsonl format. The deep mode session hierarchy, state file formats, cost guard semantics, and deep-loop-runtime dependency are not documented in any reference. This is a documentation gap for the deep mode feature exposed via `/deep:ask-ai-council`. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/orchestrate-session.cjs" lines="14-16" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/orchestrate-topic.cjs" lines="14-18" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/depth_dispatch.md" lines="18-36" />

**F-003 (P2, novel): Findings registry not documented in references.** scripts/lib/findings-registry.cjs implements a session-wide findings registry with cross-topic priors, fingerprint-based deduplication, and file-system locking. This registry is used by orchestrate-session.cjs (line 18) to track findings across topics in deep mode. However, none of the 11 references document the findings registry schema, its cross-topic prior semantics, or its role in deep mode convergence. This is a documentation gap for a core deep mode data structure. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/lib/findings-registry.cjs" lines="339-364" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/orchestrate-session.cjs" lines="18" />

**F-004 (P2, novel): Graph replay script derivation logic not referenced.** scripts/replay-graph-from-artifacts.cjs implements specific derivation logic for council_graph_upsert payloads from ai-council-state.jsonl events (lines 227-337). The script creates SESSION, ROUND, SEAT, CLAIM, EVIDENCE, DISAGREEMENT, DECISION, and RECOMMENDATION nodes with specific edge relations. While references/graph_support.md documents the node/edge kinds (lines 48-73), it does not reference the replay script or describe the derivation algorithm. Operators may not know this script exists or how to use it for graph recovery. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs" lines="227-337" /> <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/graph_support.md" lines="48-73" />

**F-005 (P2, novel): Deep mode command asset path unverified.** references/depth_dispatch.md line 22 states that deep mode is exposed through `/deep:ask-ai-council` and loads `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml` or `deep_ask-ai-council_confirm.yaml`. The existence and correctness of these YAML assets is not verified in this iteration. If these files are missing or malformed, the deep mode command would fail despite being documented. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-ai-council/references/depth_dispatch.md" lines="22" />

## Gaps for next iter

- **RQ-001 (P1):** Should the 7 reference files be updated to cross-reference the actual agent file path `.opencode/agents/ai-council.md` instead of the non-existent `.opencode/agents/deep-ai-council.md`, or should the agent files be renamed to match the references?

- **RQ-002 (P2):** Should a new reference be added to document the deep mode session hierarchy (session → topic → round), the session-state.jsonl and round-state.jsonl formats, cost guard semantics, and the deep-loop-runtime dependency?

- **RQ-003 (P2):** Should the findings registry schema, cross-topic prior semantics, and its role in deep mode convergence be documented in a new reference or added to an existing reference?

- **RQ-004 (P2):** Should references/graph_support.md be updated to reference the replay-graph-from-artifacts.cjs script and describe its derivation algorithm for council_graph_upsert payloads?

- **RQ-005 (P2):** Should the existence and correctness of the deep mode command YAML assets (`.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml` and `deep_ask-ai-council_confirm.yaml`) be verified?

## JSONL delta row

```json
{"iter_id":"001","timestamp_utc":"2026-05-24T05:08:00.000Z","executor":"cli-devin","model":"swe-1.6","status":"complete","findings_count":5,"gaps_count":5,"primary_evidence_files":[".opencode/skills/deep-ai-council/SKILL.md",".opencode/skills/deep-ai-council/references/output_schema.md",".opencode/skills/deep-ai-council/references/state_format.md",".opencode/skills/deep-ai-council/references/graph_support.md",".opencode/skills/deep-ai-council/references/depth_dispatch.md",".opencode/skills/deep-ai-council/scripts/lib/persist-artifacts.cjs",".opencode/skills/deep-ai-council/scripts/lib/findings-registry.cjs",".opencode/skills/deep-ai-council/scripts/orchestrate-session.cjs",".opencode/skills/deep-ai-council/scripts/orchestrate-topic.cjs",".opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs",".opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/004-deep-ai-council/audit-findings.jsonl"]}
```