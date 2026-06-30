# Research Iteration 9 — gpt-5.5 (xhigh, fast)
## Slice: Red-team critique of the accumulated plan
Dispatched 2026-06-28T09:12:15.203Z | wall 232s

---

Reconcile-to-reality is still the right default, but the ledger currently over-completes the packet and underrates two live-infra risks. The dangerous fixes are dropping `WebFetch` from the hub and deleting `feature_catalog/` trees before the runtime-permission and R3 evidence decisions exist.

```json
{
  "verified_facts": [
    {
      "claim": "Both child deep-review reports are FAIL and remediation cannot claim completion from validation alone.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/review/review-report.md:9 says FAIL; .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/review/review-report.md:9 says FAIL"
    },
    {
      "claim": "Strict recursive spec validation currently passes despite the semantic contradictions.",
      "status": "confirmed",
      "evidence": "command `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability --strict --recursive` returned RESULT: PASSED for parent, 001, and 002"
    },
    {
      "claim": "The live deep-loop hub is already Option-E invokable and uses hub-level allowed-tools including WebFetch.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:5 has `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch]`; :18 says invoke as `Skill(deep-loop-workflows)`; :36 says routing is `invokable-hub, Option E`"
    },
    {
      "claim": "Removing WebFetch from the hub is not a safe mechanical fix because deep-research requires it and the parent-skill template says hub allowed-tools are the union modes need.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/deep-research/SKILL.md:4 includes `WebFetch`; .opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md:53 says `allowed-tools` is the union and to add `Task`/`WebFetch` if a mode requires them"
    },
    {
      "claim": "The NFR-S01 no-widening claim is currently unresolved, not satisfied.",
      "status": "confirmed",
      "evidence": "001 spec.md:157 says no mechanism may widen tool permissions; 002 spec.md:165 repeats that rule; hub SKILL.md:57 says only research has WebFetch while hub SKILL.md:5 grants WebFetch at the hub"
    },
    {
      "claim": "R3 is not complete: all five feature_catalog folders remain and ADR-003 currently rejects keep-all.",
      "status": "confirmed",
      "evidence": "command `find .opencode/skills/deep-loop-workflows -path '*/feature_catalog' -maxdepth 3 -type d -print` returned deep-research, deep-review, deep-improvement, deep-ai-council, and deep-context; 002 decision-record.md:227 marks keep-all rejected"
    },
    {
      "claim": "R4 should not be treated as fully proven without Stage-4 evidence.",
      "status": "confirmed",
      "evidence": "002 spec.md:130 requires runtime assumptions verified and a keep/simplify decision with evidence; 002 decision-record.md:139 says default to keep and evaluate in Stage 4; :184 says Stage 4 runs the routing-fixture comparison"
    },
    {
      "claim": "The stale deep-n and deep_n_presentation findings are false in this checkout.",
      "status": "refuted",
      "evidence": "command `rg -n \"deep-n|deep_n_presentation\" .opencode/agents/ai-council.md .opencode/commands/deep/ai-council.md .opencode/commands/deep/assets || true` returned no hits; .opencode/commands/deep/ai-council.md:84 and :114 point to `deep_ai-council_presentation.txt`"
    },
    {
      "claim": "Package checks are structurally green but not warning-free, so they satisfy only the package subgate of R5.",
      "status": "partial",
      "evidence": "package_skill.py loop reported valid=True for hub plus five packets, with warnings=1 for hub/context/research/review and warnings=50 for deep-improvement"
    },
    {
      "claim": "The parent-skill structural audit passes, but it does not settle NFR-S01 or R3/R4 evidence.",
      "status": "confirmed",
      "evidence": "command `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/deep-loop-workflows` ended `OK: parent-skill-check — all invariants passed, 0 warnings`"
    },
    {
      "claim": "Generated metadata order matters for the parent active-child pointer.",
      "status": "confirmed",
      "evidence": ".opencode/skills/system-spec-kit/README.md:196 says generate-context refreshes description/graph metadata; :198 says parent saves write null and child saves bubble up the child's packet_id"
    },
    {
      "claim": "The rollback/status ledger is stale: there is an untracked research folder in addition to the two review folders.",
      "status": "confirmed",
      "evidence": "command `git status --short -- .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability ...` returned `?? .../001-invocability-mechanism/review/`, `?? .../002-deep-loop-alignment/review/`, and `?? .../155-parent-skill-native-invocability/research/`"
    }
  ],
  "recommended_steps": [
    {
      "id": "S44",
      "action": "Correct S26.07/S37: reconcile 001 as decision-complete only after updating A-D language to A-E/Option E, removing false runtime-probe evidence, adding an explicit Option-E fallback, and recording NFR-S01 as unresolved or accepted-risk/deferred-to-002; do not mark security/runtime checklist items as simply verified-or-N/A.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/plan.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/tasks.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/checklist.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md"
      ],
      "rationale": "001 can close as a mechanism decision packet, but current docs still claim runtime evidence and ignore the hub-union permission issue.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S45",
      "action": "Correct S26.09/S26.14/S38: reconcile 002 as partial with R1/R2 complete, package-check subgate complete-with-warnings, R3 pending, R4 evidence-pending unless fixtures/sign-off are added, and non-package R5 pending. If R4 stays evidence-pending, set completion_pct around 55 rather than 65.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/plan.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md"
      ],
      "rationale": "The live state proves R1/R2, but the docs do not prove R3, R4, advisor/graph, routing fixtures, or full validate-gate closure.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S46",
      "action": "Add a permission-contract decision before any allowed-tools change: keep hub WebFetch for now, document that hub-union permissions are the current parent contract, and add an explicit R5 security probe or NFR-S01 amendment path.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md"
      ],
      "rationale": "Dropping WebFetch from the hub could break deep-research through `Skill(deep-loop-workflows)` unless runtime mode-level tool narrowing is proven.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S47",
      "action": "Treat R3 as a separate sign-off gate: add a per-mode feature_catalog assessment table first; if the result is keep-all, amend ADR-003 because keep-all is currently rejected; if any catalog is removed, require explicit maintainer sign-off and a rollback baseline.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md"
      ],
      "rationale": "The current ledger says do not auto-delete, which is right; it also needs to say that a keep-all close contradicts the current ADR unless the ADR changes.",
      "risk": "high",
      "reversible": false
    },
    {
      "id": "S48",
      "action": "Collapse duplicate generated-metadata steps: perform authored doc edits first, then run generate-context in order parent-if-needed, 001, 002 last; avoid direct graph-metadata/status/fingerprint patches unless the generator leaves a specific stale field.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/description.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/graph-metadata.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/description.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/graph-metadata.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/description.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/graph-metadata.json"
      ],
      "rationale": "S26.04/S26.10/S35/S41 double-count the same metadata work, and parent generation after child generation can reset last_active_child_id to null.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S49",
      "action": "Keep S42 but classify it as live-infra medium risk: fix stale deep-ai-council wording/source_docs/template examples, then run package checks, parent-skill-check, routing fixtures, skill_graph_scan, advisor_rebuild, skill_graph_validate, and advisor_validate.",
      "files": [
        ".opencode/skills/deep-loop-workflows/graph-metadata.json",
        ".opencode/skills/deep-loop-workflows/SKILL.md",
        ".opencode/skills/deep-loop-workflows/mode-registry.json",
        ".opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md",
        ".opencode/commands/create/assets/create_parent_skill_auto.yaml",
        ".opencode/commands/create/assets/create_parent_skill_confirm.yaml"
      ],
      "rationale": "These are not inert packet docs; they change live skill metadata and future parent-skill scaffolding behavior.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S50",
      "action": "Amend S36 rollback/status: include the untracked parent `research/` folder in the baseline status snapshot, do not delete review/research artifacts, and get explicit sign-off before creating a git rollback ref if the remediation runner treats refs as live repo mutations.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/research/",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/review/",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/review/"
      ],
      "rationale": "The ledger's clean-worktree fact is stale and a rollback ref is reversible but still a repository mutation.",
      "risk": "med",
      "reversible": true
    }
  ],
  "open_decisions": [
    {
      "question": "How should NFR-S01 be resolved for parent hubs?",
      "options": [
        "A: Accept hub-level union allowed-tools as the parent contract and document per-mode allowed-tools as direct-packet contracts.",
        "B: Prove runtime narrows tools to the selected mode before mode execution, then keep NFR-S01 unchanged.",
        "C: Change live hub allowed-tools to an intersection and add a separate dispatch path for deep-research WebFetch."
      ],
      "recommendation": "A now, with B as future hardening; do not take C without explicit runtime proof because it can break deep-research."
    },
    {
      "question": "How should R3 close?",
      "options": [
        "A: Keep R3 pending until a per-mode assessment table exists.",
        "B: Amend ADR-003 to keep all catalogs with evidence.",
        "C: Remove unearned catalogs after explicit sign-off and link-check/package-check validation."
      ],
      "recommendation": "A first; B or C only after the table."
    },
    {
      "question": "Should R4 count as complete?",
      "options": [
        "A: Evidence-pending: merged identity remains live, but Stage-4 fixtures/runtime-assumption evidence is missing.",
        "B: Policy-kept: maintainer signs off that no simplification is in scope and existing projection remains by decision."
      ],
      "recommendation": "A unless the remediator adds fixture evidence or an explicit maintainer sign-off."
    },
    {
      "question": "What should the child Branch field mean?",
      "options": [
        "A: Current checkout branch.",
        "B: Packet lineage branch.",
        "C: Unknown/omit until policy is defined."
      ],
      "recommendation": "C; do not silently change it to 154 because the current checkout is 028."
    },
    {
      "question": "Which live-infra changes require explicit sign-off?",
      "options": [
        "A: Tool-permission narrowing.",
        "B: feature_catalog deletion.",
        "C: advisor merged-identity simplification.",
        "D: git rollback-ref creation."
      ],
      "recommendation": "A/B/C definitely; D if the operator treats git refs as protected repo state."
    }
  ],
  "critique_prior": [
    "S26.07/S37 over-complete 001. Marking all checklist items verified-or-N/A hides the unresolved NFR-S01 permission issue and the false runtime-probe evidence.",
    "S26.09/S26.14/S38 overstate 002 by treating R4 as complete. The live layer is kept, but the packet requires Stage-4 runtime/routing evidence before R4 is truly closed.",
    "The review suggestion to remove WebFetch is wrong as a default fix. deep-research requires WebFetch and the parent-skill template says the hub allowed-tools are the union modes need.",
    "R3 is double-counted as both pending and implicitly keep-all. Keep-all currently contradicts ADR-003; deletion is destructive and must be gated.",
    "S35 and S41 duplicate generated metadata work; S26.04/S26.10 direct graph edits are brittle if generate-context is the source of truth.",
    "S36's baseline fact is stale because an untracked parent research folder exists in addition to the review folders.",
    "S42 is under-rated as low risk. It edits live skill metadata and command-generation templates, so advisor/skill-graph rebuild and routing tests are mandatory.",
    "S43 is necessary but incomplete unless it adds a permission-contract check and R3 link/catalog checks. Package checks alone do not satisfy R5.",
    "The stale deep-n/deep_n_presentation findings should remain refuted and should not drive edits.",
    "Reconcile-to-reality is correct for R1/R2, but not a license to declare packet 155 complete; reality is partial."
  ]
}
```
