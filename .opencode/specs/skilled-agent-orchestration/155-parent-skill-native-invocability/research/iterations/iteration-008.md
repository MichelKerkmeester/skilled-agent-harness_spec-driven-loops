# Research Iteration 8 — gpt-5.5 (xhigh, fast)
## Slice: Implementation order, rollback, validation gates
Dispatched 2026-06-28T09:08:23.497Z | wall 327s

---

Best order: make the packet honest before touching live skill surfaces. The rollback anchor should be `rollback/155-parent-skill-native-invocability-pre-remediation-20260628-393777e7a7`, created from the current `HEAD`; current targeted files are clean except the untracked review artifacts, so do not delete or fold those into the remediation.

```json
{
  "verified_facts": [
    {
      "claim": "Both deep-review reports are FAIL verdicts and therefore require remediation before completion claims.",
      "status": "confirmed",
      "evidence": "001 review-report.md:9 says \"FAIL — P0=4 · P1=20 · P2=5 · total 29\"; 002 review-report.md:9 says \"FAIL — P0=3 · P1=34 · P2=4 · total 41\"."
    },
    {
      "claim": "Current checkout is not the previously claimed 154 branch; rollback must anchor to current HEAD.",
      "status": "confirmed",
      "evidence": "command `git rev-parse --abbrev-ref HEAD && git rev-parse --short=10 HEAD` -> `system-speckit/028-memory-search-intelligence` and `393777e7a7`."
    },
    {
      "claim": "Targeted canonical packet/live-skill files are clean before remediation; only review folders under packet 155 are untracked.",
      "status": "confirmed",
      "evidence": "command `git status --short -- <targeted packet/live files>` returned only `?? .../001-invocability-mechanism/review/` and `?? .../002-deep-loop-alignment/review/`."
    },
    {
      "claim": "Strict recursive spec validation currently passes, so validation alone does not catch the semantic contradictions from review.",
      "status": "confirmed",
      "evidence": "command `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability --strict --recursive` exited 0 with RESULT: PASSED for parent, 001, and 002."
    },
    {
      "claim": "The parent phase map and generated graph metadata still disagree with the live remediation state.",
      "status": "confirmed",
      "evidence": "parent spec.md:49 says 001 is accepted; parent spec.md:50 says 002 is `Planned (gated)`; parent graph-metadata.json:38 says `status: planned`; parent graph-metadata.json:98-99 has `last_active_child_id: null` and `last_active_at: null`."
    },
    {
      "claim": "Phase 001 should be reconciled as decision-complete, not runtime-probe pending.",
      "status": "confirmed",
      "evidence": "001 decision-record.md:47 says `Status | Accepted`; 001 decision-record.md:70 says `We chose: Option E — invokable-hub routing`; but 001 spec.md:17-30 still says plan-only/runtime probe with completion_pct 0 and 001 spec.md:62 says `Status | Draft`."
    },
    {
      "claim": "Phase 002 should be reconciled as in-progress/partial, not complete.",
      "status": "confirmed",
      "evidence": "002 spec.md:122-131 defines R1-R5; R3 at line 124 requires feature-catalog footprint to match the recorded ruling; R5 at line 131 requires package checks plus advisor_rebuild, skill_graph_validate, routing fixtures, and validate.sh."
    },
    {
      "claim": "R3 is not safely complete: all five deep-loop feature_catalog folders still exist.",
      "status": "confirmed",
      "evidence": "command `find .opencode/skills/deep-loop-workflows -path '*/feature_catalog' -maxdepth 3 -type d -print` returned feature_catalog dirs for deep-ai-council, deep-context, deep-improvement, deep-research, and deep-review."
    },
    {
      "claim": "R1/R2 live state is real and should not be reverted by doc reconciliation.",
      "status": "confirmed",
      "evidence": "deep-loop-workflows/SKILL.md:18 says invoke as `Skill(deep-loop-workflows)`; line 36 says routing is `invokable-hub, Option E`; command `find .opencode/skills/deep-loop-workflows -maxdepth 1 -type d -name '*ai-council*'` returned only `deep-ai-council`."
    },
    {
      "claim": "Package checks currently pass structurally for the hub plus five packets, but not warning-free.",
      "status": "confirmed",
      "evidence": "command `PYTHONDONTWRITEBYTECODE=1 python3 .opencode/skills/sk-doc/scripts/package_skill.py <hub-or-packet> --check --json` exited 0 for hub plus five packets with `valid: true`; deep-improvement emitted many warnings."
    },
    {
      "claim": "The read-only parent-skill structural audit passes for deep-loop-workflows.",
      "status": "confirmed",
      "evidence": "command `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/deep-loop-workflows` exited 0 and reported `OK: parent-skill-check — all invariants passed, 0 warnings`."
    },
    {
      "claim": "The dead HVR path should be corrected in live packet docs, not review artifacts.",
      "status": "confirmed",
      "evidence": "command `test -e .opencode/skills/sk-doc/references/hvr_rules.md` returned old_path_exists=1; `test -e .opencode/skills/sk-doc/references/global/hvr_rules.md` returned global_path_exists=0, where 0 means exists."
    },
    {
      "claim": "generate-context ordering matters for the phase parent active-child pointer.",
      "status": "confirmed",
      "evidence": "system-spec-kit README.md:196 says generate-context refreshes description/graph metadata; README.md:198 says parent saves write null while child saves bubble up the child's packet_id."
    },
    {
      "claim": "Advisor/skill-graph gates are real MCP surfaces, but this read-only run did not execute rebuild/scan.",
      "status": "confirmed",
      "evidence": "system-skill-advisor feature_catalog.md:109-116 lists `advisor_rebuild`, `skill_graph_scan`, and `skill_graph_validate`; doctor_update.yaml:456-457 maps skill-graph to `skill_graph_scan({})` and advisor to `advisor_rebuild({ force: true }) + advisor_validate({})`."
    },
    {
      "claim": "The stale deep-n/deep_n_presentation review findings should not be fixed in this checkout.",
      "status": "refuted",
      "evidence": "command `rg -n \"deep-n|deep_n_presentation\" .opencode/agents/ai-council.md .opencode/commands/deep/ai-council.md .opencode/commands/deep/assets` returned no hits; commands/deep/ai-council.md:84 and :114 reference `deep_ai-council_presentation.txt`."
    }
  ],
  "recommended_steps": [
    {
      "id": "S36",
      "action": "[rollback-baseline] Before any write, create baseline ref `rollback/155-parent-skill-native-invocability-pre-remediation-20260628-393777e7a7` from `393777e7a7`, then capture a targeted `git status --short -- <packet/live-skill-files>` snapshot. Do not include or delete the untracked review artifacts.",
      "files": [
        "git ref: rollback/155-parent-skill-native-invocability-pre-remediation-20260628-393777e7a7"
      ],
      "rationale": "Current branch has unrelated dirty state; a named ref plus targeted status gives a clean rollback anchor for the remediation blast radius.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S37",
      "action": "[reversible-doc] Reconcile 001 first: apply the existing S21-S26.08 intent so spec/plan/tasks/checklist/decision-record/implementation-summary all say decision-complete, Option E accepted, no build in 001, obsolete runtime probe N/A.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/spec.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/plan.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/tasks.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/checklist.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md"
      ],
      "rationale": "Lowest blast: this closes the self-contradictory decision packet before touching 002 or live skills.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S38",
      "action": "[reversible-doc] Reconcile 002 next to reality: R1/R2 executed, R3 pending until a per-mode ruling exists, R4 kept, R5 partial. Uncheck or mark pending the R3 and non-package R5 rows; record package checks as pass-with-warnings, not full R5.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/spec.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/plan.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md"
      ],
      "rationale": "This prevents false completion while preserving the real executed rename and hub routing.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S39",
      "action": "[reversible-doc] Reconcile the parent phase map and parent graph metadata after the children: parent status in_progress, 001 complete, 002 in_progress/partial, active child 002 with an actual remediation timestamp.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/spec.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/graph-metadata.json"
      ],
      "rationale": "Resume needs both human phase map and machine active-child pointer to agree.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S40",
      "action": "[reversible-doc] Fix dead HVR_REFERENCE comments in live packet docs only. Resolve the Branch field separately: leave unchanged or mark UNKNOWN unless the maintainer explicitly defines Branch as packet lineage.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/spec.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/spec.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/plan.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md"
      ],
      "rationale": "Path repair is mechanical; Branch semantics are not.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S41",
      "action": "[generated-doc] Re-render packet metadata/fingerprints through generate-context.js after packet doc reconciliation. Run parent first if needed, then 001, then 002 last so the parent active-child pointer ends on 002. Use actual remediation JSON and actual timestamp, not the prior canned timestamp.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/description.json",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/graph-metadata.json",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/description.json",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/graph-metadata.json",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/description.json",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/002-deep-loop-alignment/graph-metadata.json"
      ],
      "rationale": "Continuity freshness reads session_dedup.fingerprint, and generate-context is the canonical path for description/graph metadata refresh.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S42",
      "action": "[live-infra] Last, clean live skill/template stale wording only: source_docs `ai-council/SKILL.md` -> `deep-ai-council/SKILL.md`; remove grandfathered-mismatch wording now that folder==packetSkillName; remove ai-council/deep-ai-council as the canonical mismatch example from create-parent-skill templates.",
      "files": [
        ".opencode/skills/deep-loop-workflows/graph-metadata.json",
        ".opencode/skills/deep-loop-workflows/SKILL.md",
        ".opencode/skills/deep-loop-workflows/mode-registry.json",
        ".opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md",
        ".opencode/commands/create/assets/create_parent_skill_auto.yaml",
        ".opencode/commands/create/assets/create_parent_skill_confirm.yaml"
      ],
      "rationale": "These are live skill surfaces, so they should come after packet truth is stable; the edits are still low-behavior because they correct stale metadata/prose/templates.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S43",
      "action": "[validation-gates] After all edits, run: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability --strict --recursive`; package checks for hub + five packets with `PYTHONDONTWRITEBYTECODE=1 python3 .opencode/skills/sk-doc/scripts/package_skill.py <path> --check --json`; `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/deep-loop-workflows`; routing fixtures via `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- tests/routing-registry-drift-guard.vitest.ts tests/routing-parity-deep-skills.vitest.ts tests/routing-parity-deep-council.vitest.ts tests/routing-fixtures.affordance.test.ts`; if skill graph metadata changed, run `mcp__mk_skill_advisor.skill_graph_scan({\"skillsRoot\":\".opencode/skills\"})`, `mcp__mk_skill_advisor.advisor_rebuild({\"force\":true,\"workspaceRoot\":\"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public\"})`, `mcp__mk_skill_advisor.skill_graph_validate({})`, and `mcp__mk_skill_advisor.advisor_validate({\"confirmHeavyRun\":true,\"workspaceRoot\":\"/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public\"})`.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability",
        ".opencode/skills/deep-loop-workflows",
        ".opencode/skills/system-skill-advisor/mcp_server/tests"
      ],
      "rationale": "This is the minimum post-edit gate set matching packet R5 plus the live parent-skill invariant.",
      "risk": "med",
      "reversible": true
    }
  ],
  "open_decisions": [
    {
      "question": "What should the child Branch field mean?",
      "options": [
        "Checkout branch: keep `system-speckit/028-memory-search-intelligence` because that is current.",
        "Packet lineage: change only if the maintainer explicitly says 155 is tracked under a 154 branch.",
        "Unknown: replace with an explicit UNKNOWN/note rather than encoding a misleading branch."
      ],
      "recommendation": "Use UNKNOWN or leave unchanged until policy is clarified; do not silently change it to 154."
    },
    {
      "question": "How should R3 close?",
      "options": [
        "Keep R3 pending until a per-mode feature_catalog assessment table exists.",
        "Close R3 as keep-all only after recording evidence for all five modes.",
        "Delete feature_catalog folders now."
      ],
      "recommendation": "Keep R3 pending; do not auto-delete directories."
    },
    {
      "question": "Should NFR-S01 trigger live tool-permission narrowing?",
      "options": [
        "Document the current hub union/tool-contract reality and keep behavior unchanged.",
        "Remove WebFetch or otherwise narrow hub allowed-tools now.",
        "Design runtime-enforced per-mode permission narrowing as a separate packet."
      ],
      "recommendation": "Document now; do not auto-change live permissions in this remediation."
    },
    {
      "question": "When can 002 be marked complete?",
      "options": [
        "After R3 is evidenced and full R5 gates pass.",
        "Now, because package checks pass.",
        "Never, unless a runtime Skill probe is run for 001."
      ],
      "recommendation": "Only after R3 evidence plus full R5 gates; package checks alone support partial status."
    }
  ],
  "critique_prior": [
    "S26.02 must not use the prefilled `2026-06-28T10:55:59+02:00`; use the actual remediation timestamp and run 002 generate-context last so parent active-child does not get nulled.",
    "S26.07 hardcoded checklist totals should be recomputed after edits; do not force 16/23/9 if the checklist item count changes.",
    "S29 should run generate-context.js first; direct fingerprint patching is fallback only, and graph `source_fingerprint` must not be copied blindly into every doc.",
    "S35 should be split: metadata/fingerprint refresh after packet docs, live-skill cleanup last, validation gates after all edits.",
    "Package checks are currently valid with warnings, not clean-without-warnings; record that distinction.",
    "Do not fix the refuted deep-n/deep_n_presentation findings in this checkout.",
    "Do not claim advisor/skill-graph health from this read-only pass; the MCP status/validate calls were cancelled, so those remain future post-edit gates."
  ]
}
```
