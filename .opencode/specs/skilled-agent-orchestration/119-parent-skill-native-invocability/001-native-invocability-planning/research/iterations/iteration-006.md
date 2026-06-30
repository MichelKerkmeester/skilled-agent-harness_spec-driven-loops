# Research Iteration 6 — gpt-5.5 (xhigh, fast)
## Slice: Status canonicalization across both children + parent (exact values)
Dispatched 2026-06-28T08:58:59.197Z | wall 325s

---

Canonical state: 001 is complete as a decision-only child; 002 is `in_progress` at 65%; the parent is `in_progress` and should resume into 002. The failure is status drift plus unfinished R3/full-R5 evidence, not a reason to revert the live R1/R2/R4 work.

```json
{
  "verified_facts": [
    {
      "claim": "Graph metadata status must use the closed enum; prose statuses do not belong in derived.status.",
      "status": "confirmed",
      "evidence": ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts:19-28 lists planned, draft, placeholder, in_progress, blocked, deferred, complete, unknown."
    },
    {
      "claim": "The parent is currently stale: it says 002 is planned and has no active-child pointer.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/spec.md:50 has Status 'Planned (gated)'; graph-metadata.json:38 has derived.status planned; graph-metadata.json:98-99 has last_active_child_id null and last_active_at null."
    },
    {
      "claim": "001 is decision-complete: ADR-001 is Accepted and chooses Option E.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md:47 has Status Accepted; line 70 says 'We chose: Option E — invokable-hub routing.'"
    },
    {
      "claim": "001 spec metadata is stale and still reads draft/0 with obsolete runtime-probe questions.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md:17-30 has plan-only recent_action, next_safe_action runtime probe, completion_pct 0, and an open runtime-extensibility question; line 62 has Status Draft."
    },
    {
      "claim": "002 requirements define the exact R1-R5 units; R5 is broader than package checks.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md:122-131 defines R1 invokable-hub, R2 name==folder, R3 feature-catalog hygiene, R4 runtime reconciliation, and R5 package_skill plus advisor_rebuild, skill_graph_validate, routing fixtures, and validate.sh."
    },
    {
      "claim": "R1 exists on disk: deep-loop-workflows is an invokable Option-E hub.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:18 says invoke as Skill(deep-loop-workflows); line 36 says routing is registry-driven invokable-hub Option E."
    },
    {
      "claim": "R2 rename/package state is real: deep-ai-council exists and all six package checks pass.",
      "status": "confirmed",
      "evidence": "command `ls .opencode/skills/deep-loop-workflows` showed deep-ai-council and no ai-council folder; command `python3 .opencode/skills/sk-doc/scripts/package_skill.py <hub-or-packet> --check --json` for hub + five packets exited 0 with valid true for each."
    },
    {
      "claim": "R3 is not canonicalized yet: all five feature_catalog folders still exist and no per-mode ruling is recorded as final.",
      "status": "confirmed",
      "evidence": "command `find .opencode/skills/deep-loop-workflows -path '*/feature_catalog' -maxdepth 3 -type d -print` returned five folders; .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md:124 requires the footprint to match the recorded ruling."
    },
    {
      "claim": "R4 should canonicalize as kept, not pending simplification.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md:122 says Accepted - keep the merged-identity layer; .opencode/skills/deep-loop-workflows/mode-registry.json:4 documents the hardcoded projection maps and drift guard."
    },
    {
      "claim": "R5 is partial: package checks pass, but full R5 gates are not evidenced in the packet.",
      "status": "partial",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md:131 requires package checks, advisor_rebuild, skill_graph_validate, routing fixtures, and validate.sh; implementation-summary.md:89 still says package_skill was Not run, which is refuted by the package-check command but does not evidence the other gates."
    },
    {
      "claim": "Parent active-child routing needs last_active_at as well as last_active_child_id.",
      "status": "confirmed",
      "evidence": ".opencode/skills/system-spec-kit/references/workflows/quick_reference.md:481-487 says phase-parent resume honors last_active_child_id only when last_active_at parses as ISO-8601 and is fresh."
    }
  ],
  "recommended_steps": [
    {
      "id": "S26.01",
      "action": "file -> field -> new value: parent spec.md -> Phase Documentation Map row 001 Status -> `Complete - mechanism decided (Option E); reference implementations exist in deep-loop-workflows and sk-design; no build in 001.`; row 002 Status -> `In progress - R1/R2 executed; R3 pending decision; R4 kept; R5 partial.`",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/spec.md"
      ],
      "rationale": "Parent phase map should reflect the child truth instead of mixing accepted/planned with stale draft children.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.02",
      "action": "file -> field -> new value: parent graph-metadata.json -> derived.status -> `in_progress`; derived.last_active_child_id -> `skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment`; derived.last_active_at -> `2026-06-28T10:55:59+02:00`.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/graph-metadata.json"
      ],
      "rationale": "The parent remains open because 002 is active, and resume should land on the child with remaining work.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.03",
      "action": "file -> field -> new value: 001 spec.md -> Metadata Status -> `Complete - mechanism decided; no build in 001`; _memory.continuity.completion_pct -> `100`; recent_action -> `Accepted Option E invokable-hub routing; no build belongs in 001`; next_safe_action -> `Apply downstream 002 reconciliation and validation; do not run obsolete runtime-extensibility probe`; open_questions -> `[]`; answered_questions -> [`Option E uses Skill(<parent>) hub routing with no runtime change.`, `If hub routing proves insufficient, A/B commands and agents remain fallback surfaces; C has identity cost; D is separate runtime work.`].",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md"
      ],
      "rationale": "001 owns the mechanism decision only; Option E supersedes the runtime-probe framing.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.04",
      "action": "file -> field -> new value: 001 graph-metadata.json -> derived.status -> `complete`.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/graph-metadata.json"
      ],
      "rationale": "Use the graph enum value matching the completed decision packet; do not use non-enum prose like decision-complete.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.05",
      "action": "file -> field -> new value: 001 tasks.md -> T001-T004 -> `[x] N/A - superseded by accepted Option E`; T005 -> `[x] Produce A-E decision, choose Option E, record fallback`; T006-T010 -> `[x] N/A for 001 - no build or runtime probe in this packet`; Completion Criteria -> all `[x]` with `decision packet complete; downstream execution lives in 002+`.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/tasks.md"
      ],
      "rationale": "Close 001 without pretending obsolete probe/build tasks ran.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.06",
      "action": "file -> field -> new value: 001 plan.md -> Phase 1 decision work -> `[x]` for decision-record output and `[x] N/A-superseded` for runtime/prototype probes; Phase 2 and Phase 3 implementation/probe checkboxes -> `[x] N/A for 001 - downstream execution/validation owned by 002+`; ADR-001 status -> `Accepted`.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/plan.md"
      ],
      "rationale": "The plan should describe the completed decision path, not a future research gate.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.07",
      "action": "file -> field -> new value: 001 checklist.md -> Verification Summary -> `P0 Items | 16 | 16/16 verified-or-N/A`; `P1 Items | 23 | 23/23 verified-or-N/A`; `P2 Items | 9 | 9/9 verified-or-N/A`; Verification Date -> `2026-06-28`.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/checklist.md"
      ],
      "rationale": "The current summary totals are stale; actual checkbox item counts are 16 P0, 23 P1, and 9 P2.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.08",
      "action": "file -> field -> new value: 001 implementation-summary.md -> Completed -> `Mechanism decided: Option E invokable-hub routing accepted; no build in 001; reference implementations exist in deep-loop-workflows and sk-design.`",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md"
      ],
      "rationale": "Preserves the real completion while removing the false runtime-probe/reference-only-to-154 framing.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.09",
      "action": "file -> field -> new value: 002 spec.md -> Metadata Status -> `In progress - R1/R2 executed; R3 pending decision; R4 kept; R5 partial`; _memory.continuity.completion_pct -> `65`; recent_action -> `R1/R2 executed; R4 kept; package checks pass; R3 and full R5 remain pending`; next_safe_action -> `Decide/document R3, finish R5 gates, then rerun packet and parent validation`; open_questions -> [`R3: record the per-mode feature_catalog ruling.`, `R5: advisor_rebuild, skill_graph_validate, full routing fixtures, and validate.sh still need cited results.`]; answered_questions -> [`R1: Option E invokable-hub routing is implemented on deep-loop-workflows.`, `R2: ai-council folder is renamed to deep-ai-council; package checks pass for hub plus five packets.`, `R4: keep the deep-loop merged-identity advisor projection; future simplification requires separate evidence.`, `R5 package subgate: package_skill.py --check --json passed for hub plus five packets on 2026-06-28.`].",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md"
      ],
      "rationale": "65% equals three complete requirements plus one of four R5 subgates proven; R3 remains zero until the ruling is documented.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.10",
      "action": "file -> field -> new value: 002 graph-metadata.json -> derived.status -> `in_progress`.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/graph-metadata.json"
      ],
      "rationale": "002 is neither draft nor complete: live work exists, but R3 and full R5 remain open.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.11",
      "action": "file -> field -> new value: 002 tasks.md -> T001-T007 -> `[x]`; T008-T009 -> `[ ] pending R3 decision`; T010 -> `[x]`; T011 -> `[ ] pending full routing fixture/probe evidence under R5`; T012-T013 -> `[x] R4 kept`; T014 -> `[x] package checks passed`; T015-T017 -> `[ ] pending`; remove `[B]` from completed rows; Completion Criteria -> `[ ]` until R3 and non-package R5 gates are complete.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md"
      ],
      "rationale": "Checkboxes should distinguish implemented structure from unproven validation gates.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.12",
      "action": "file -> field -> new value: 002 plan.md -> Stage 0 -> `[x]`; Stage 1/R2 -> `[x]`; Stage 2/R3 -> `[ ] pending decision`; Stage 3/R1 -> `[x] static hub retrofit complete`; Stage 4/R4 -> `[x] merged identity kept`; Stage 5/R5 -> `[ ] partial: package check passed, advisor/graph/routing/validate gates pending`.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/plan.md"
      ],
      "rationale": "The stage map should match the R-state instead of showing all stages unchecked.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.13",
      "action": "file -> field -> new value: 002 checklist.md -> Verification Summary -> `Acceptance Requirements | 5 | 3 complete / 1 pending-decision / 1 partial`; `R5 Subgates | 4 | 1/4 proven`; `Overall | 100 | 65`; `Priority Item Totals | P0 15, P1 23, P2 9`; remove stale `0/11`, `0/14`, and `0/2` rows.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md"
      ],
      "rationale": "Requirement-level counts are the clearest canonical status; priority totals should be corrected but not used to claim completion.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S26.14",
      "action": "file -> field -> new value: 002 implementation-summary.md -> Completed -> `Partial: R1 invokable-hub routing executed; R2 deep-ai-council rename/package checks executed; R3 pending per-mode ruling; R4 merged-identity layer kept; R5 partial with package checks passed and advisor/graph/routing/validate gates pending.`",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md"
      ],
      "rationale": "Replaces the false all-green/not-run contradiction with a precise partial-completion record.",
      "risk": "low",
      "reversible": true
    }
  ],
  "open_decisions": [
    {
      "question": "How should R3 close?",
      "options": [
        "Keep all five feature_catalog folders with a per-mode ADR-003 evidence table.",
        "Remove unearned catalogs and repoint references.",
        "Leave R3 pending and do not claim 002 complete."
      ],
      "recommendation": "Keep R3 pending until a per-mode table is added; if every mode earns its catalog, close R3 as keep-all with evidence rather than as an assumed keep-all."
    },
    {
      "question": "When can 002 move from in_progress to complete?",
      "options": [
        "After R3 is recorded and advisor_rebuild, skill_graph_validate, full routing fixtures, validate.sh, and parent validation all pass.",
        "After package checks only.",
        "After doc reconciliation only."
      ],
      "recommendation": "Use the first option. Package checks support the 65% partial state but do not satisfy R5."
    }
  ],
  "critique_prior": [
    "S6 overstates R3 as resolved keep-all; this slice should canonicalize R3 as pending-decision until the per-mode earned-keep table exists.",
    "S25 should be narrowed: child 001 graph status should be the enum `complete`, not prose such as `decision-complete`.",
    "Parent graph remediation should include `last_active_at` with `last_active_child_id`; otherwise the resume ladder may ignore the pointer."
  ]
}
```
