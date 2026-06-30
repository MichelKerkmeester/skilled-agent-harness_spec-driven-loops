# Research Iteration 3 — gpt-5.5 (xhigh, fast)
## Slice: Ground truth: 002 R4 (merged-identity) + R5 (validation)
Dispatched 2026-06-28T08:47:59.352Z | wall 194s

---

R4 should be reconciled to “kept, with code evidence.” R5 should be reconciled to “package checks pass,” not “all validation gates are proven,” because the broader advisor/graph/routing/validate gates were not established in this slice.

```json
{
  "verified_facts": [
    {
      "claim": "R4 merged-identity layer still exists in the TypeScript advisor scorer.",
      "status": "confirmed",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:72-83 says the merged layer maps legacy mode-level ids to `(merged skill, workflowMode)`; lines 90-100 define `MERGED_DEEP_SKILL_ID = 'deep-loop-workflows'` and `DEEP_MODE_BY_CANONICAL` for research/review/ai-council/improvement; lines 119-129 expose `modeForAlias` and `mergedSkillForAlias`."
    },
    {
      "claim": "R4 merged-identity projection still exists in `skill_advisor.py` and emits `deep-loop-workflows` plus mode.",
      "status": "confirmed",
      "evidence": ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2309-2326 defines `DEEP_ROUTING_SKILLS`, `MERGED_DEEP_SKILL_ID`, and `DEEP_ROUTING_MODE_BY_KEY`; lines 2515-2539 build payload `{skill: deep-loop-workflows, mode: <workflowMode>}`; lines 2546-2590 blend that mode into recommendations."
    },
    {
      "claim": "The advisor projection is not dead code: the registry and drift guard still tie Python and TypeScript maps to `mode-registry.json`.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/mode-registry.json:10-16 documents the advisorRouting projection and drift guard; lines 42-78 define lexical routing for research/review/ai-council. .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:82-90 asserts Python and TypeScript projections equal the registry projection."
    },
    {
      "claim": "A read-only advisor routing probe returns the merged skill with a mode, confirming the projection is active.",
      "status": "confirmed",
      "evidence": "command `printf '%s' '{\"prompt\":\"run a deep review until p0 p1 findings stabilize\",\"packet_context\":{}}' | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --deep-skill-routing-json` exited 0 and returned `\"skill\": \"deep-loop-workflows\", \"mode\": \"review\", \"confidence\": 0.83`; council probe returned `\"mode\": \"ai-council\", \"confidence\": 0.76`."
    },
    {
      "claim": "ADR-002's current Status row is directionally true, but its surrounding Stage-4/pending language is stale or under-evidenced.",
      "status": "partial",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md:122 says `Accepted - keep the merged-identity layer`, which matches live code; lines 139 and 184 still say to evaluate/record keep-vs-simplify in Stage 4, which contradicts treating the keep decision as already accepted."
    },
    {
      "claim": "The sk-design regression rationale for keeping R4 is not independently proven by this slice.",
      "status": "partial",
      "evidence": "rg for `sk-design.*regress|per-mode routing regress|routing regressed` found the assertion repeated in packet 155 at decision-record.md:139 and implementation-summary.md:77, but 154 integration docs only frame validation/routing risk, e.g. .opencode/specs/design/008-sk-design-parent/006-integration-validation/spec.md:98 says there was no proof yet that routing was correct and line 176 lists misroute risk."
    },
    {
      "claim": "`package_skill.py --check` is validate-only and does not package/write the skill zip.",
      "status": "confirmed",
      "evidence": ".opencode/skills/sk-doc/scripts/package_skill.py:661-698 defines `check_only()` as validation and result printing; lines 721-724 describe `--check` as `Validate only; do not create a package`; lines 758-760 call `check_only(skill_path)` and exit."
    },
    {
      "claim": "R5 package checks pass now for the deep-loop hub plus all five mode packets.",
      "status": "confirmed",
      "evidence": "commands `python3 .opencode/skills/sk-doc/scripts/package_skill.py <path> --check --json` exited 0 with `\"valid\": true` for `.opencode/skills/deep-loop-workflows`, `deep-context`, `deep-research`, `deep-review`, `deep-improvement`, and `deep-ai-council`. Some commands emitted macOS xcrun cache warnings under the read-only sandbox, but validation JSON still returned `valid: true`."
    },
    {
      "claim": "implementation-summary.md line 89 claiming package checks were not run is false in the current tree.",
      "status": "refuted",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md:89 says `package_skill.py --check` was `Not run`; the six `--check --json` commands above all exited 0 with `valid: true`."
    },
    {
      "claim": "The broad R5 claim `all gates green` is not verified by this slice.",
      "status": "partial",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md:131 defines R5 as package checks plus `advisor_rebuild`, `skill_graph_validate`, routing fixtures, and `validate.sh`; only package checks and two lightweight routing probes were run here."
    }
  ],
  "recommended_steps": [
    {
      "id": "S9",
      "action": "Rewrite ADR-002 to say the merged-identity layer is kept in the current implementation, with evidence from `aliases.ts`, `skill_advisor.py`, `mode-registry.json`, and the drift-guard test. Remove the contradictory `Default to keep` / `pending Stage 4` framing, or explicitly label any future simplify benchmark as optional follow-up.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md"
      ],
      "rationale": "Current code kept the layer; the doc should not say both accepted and pending.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S10",
      "action": "Update R4/R5 packet docs to separate proven facts from unverified gates: R4 kept; package_skill checks pass; full R5 gates remain pending unless `advisor_rebuild`, `skill_graph_validate`, routing fixtures, and `validate.sh` are actually run and cited.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/plan.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md"
      ],
      "rationale": "The current docs overclaim in some places and underclaim in others; splitting package validation from full validation fixes the contradiction.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S11",
      "action": "Replace implementation-summary R5 wording with an evidence row: `package_skill.py --check --json passed for hub + five packets on 2026-06-28`; remove `Not run`; avoid saying `R5 validated` unless the non-package gates are also evidenced.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md"
      ],
      "rationale": "Line 45 and line 89 currently contradict each other; the true claim is narrower than full R5.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S12",
      "action": "Soften or remove the claim that sk-design's missing merged-identity layer caused a per-mode routing regression unless independent benchmark evidence is added.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md"
      ],
      "rationale": "The live repo supports `sk-design skipped this layer`; this slice did not verify `routing regressed` as a measured fact.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S13",
      "action": "Do not delete or simplify the R4 advisor projection in this remediation pass. Treat any future simplification as a separate higher-blast change requiring routing benchmark evidence and drift-guard updates.",
      "files": [
        ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts",
        ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py",
        ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts"
      ],
      "rationale": "The layer is live, drift-guarded, and currently routes deep modes through the merged identity.",
      "risk": "med",
      "reversible": true
    }
  ],
  "open_decisions": [
    {
      "question": "Should R4 be closed as kept, or remain pending until a comparative hub-only routing benchmark is run?",
      "options": [
        "Close as kept now using live projection and drift-guard evidence.",
        "Keep pending and run a dedicated compare-simplify benchmark before changing ADR-002 status."
      ],
      "recommendation": "Close as kept now; benchmark only if someone proposes simplification."
    },
    {
      "question": "How broad should R5 be claimed after this remediation?",
      "options": [
        "Claim only package_skill validation passed for hub plus five packets.",
        "Claim all R5 gates green after running advisor/graph/routing/validate gates."
      ],
      "recommendation": "Use the narrower claim unless the full gate suite is run and cited."
    },
    {
      "question": "What should happen to the sk-design regression rationale?",
      "options": [
        "Add independent routing benchmark evidence.",
        "Remove or soften the claim to a risk-based rationale."
      ],
      "recommendation": "Soften it now; do not keep an unevidenced regression claim as fact."
    }
  ],
  "critique_prior": [
    "S5 should be refined: package_skill checks are already confirmed passing in the current tree, but should still be rerun after remediation edits.",
    "The prior ledger's `R5 validated` language should not be accepted wholesale: package checks pass, but full R5 remains only partially verified.",
    "002-F012's suggested fix of making ADR-002 `Proposed` is now too conservative if reconciling to current reality; better wording is `Accepted - kept`, with explicit evidence and any simplify benchmark marked optional/future.",
    "The sk-design routing-regression rationale is unsupported by this slice; keep the R4 decision, but do not use that sentence as evidence unless a benchmark/result is found."
  ]
}
```
