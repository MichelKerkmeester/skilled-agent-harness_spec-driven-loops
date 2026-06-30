# Research Iteration 10 — gpt-5.5 (xhigh, fast)
## Slice: Final consolidation — single ordered remediation plan
Dispatched 2026-06-28T09:17:36.374Z | wall 321s

---

Best fix is reconcile-to-reality: keep the live Option-E hub, do not narrow `WebFetch` or delete `feature_catalog/` folders mechanically, and make packet 002 honestly partial until R3, R4 evidence, and full R5 gates are proven. The plan below orders docs first, then live wording cleanup, then generated metadata and validation.

```json
{
  "verified_facts": [
    {
      "claim": "Both child deep-review reports fail and semantic remediation is required.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/review/review-report.md:9 says FAIL with P0=4, P1=20, P2=5; .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/review/review-report.md:9 says FAIL with P0=3, P1=34, P2=4."
    },
    {
      "claim": "The live deep-loop hub already implements Option E parent-hub invocability.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:18 says invoke it as `Skill(deep-loop-workflows)`; .opencode/skills/deep-loop-workflows/SKILL.md:36 says routing is registry-driven, invokable-hub, Option E."
    },
    {
      "claim": "The live hub grants WebFetch at the hub level while non-research mode docs still describe narrower mode boundaries.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:5 lists WebFetch in hub allowed-tools; .opencode/skills/deep-loop-workflows/SKILL.md:57 says only research has WebFetch; .opencode/skills/deep-loop-workflows/deep-context/SKILL.md:36 says outward/web discovery belongs to deep-research; .opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md:53 says hub allowed-tools are the union modes need."
    },
    {
      "claim": "NFR-S01 is unresolved, not satisfied.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md:157 says no mechanism may widen a packet tool-permission contract; .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md:165 repeats the no-widening rule; the hub/tool evidence above shows a union-grant pattern."
    },
    {
      "claim": "R3 feature-catalog hygiene is not complete.",
      "status": "confirmed",
      "evidence": "Command `find .opencode/skills/deep-loop-workflows -path '*/feature_catalog' -maxdepth 3 -type d -print` returned feature_catalog dirs for deep-research, deep-review, deep-improvement, deep-ai-council, and deep-context; .opencode/specs/.../002-deep-loop-alignment/decision-record.md:227 rejects keeping all five."
    },
    {
      "claim": "Package checks pass structurally but are not warning-free.",
      "status": "partial",
      "evidence": "Commands `PYTHONDONTWRITEBYTECODE=1 python3 .opencode/skills/sk-doc/scripts/package_skill.py <hub-or-packet> --check --json` exited 0 with `valid: true` for the hub and five packets; warnings were present for hub, deep-context, deep-research, deep-review, and many deep-improvement assets."
    },
    {
      "claim": "The parent-skill structural audit passes but does not resolve R3, R4, R5, or NFR-S01.",
      "status": "partial",
      "evidence": "Command `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/deep-loop-workflows` reported `OK: parent-skill-check - all invariants passed, 0 warnings`."
    },
    {
      "claim": "Recursive strict spec validation passes despite the semantic contradictions.",
      "status": "partial",
      "evidence": "Command `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability --strict --recursive` returned RESULT: PASSED for parent, 001, and 002."
    },
    {
      "claim": "The HVR_REFERENCE path in live packet docs is dead and the corrected path exists.",
      "status": "confirmed",
      "evidence": "Command `ls .opencode/skills/sk-doc/references/hvr_rules.md` returned No such file or directory; command `ls .opencode/skills/sk-doc/references/global/hvr_rules.md` returned the existing file."
    },
    {
      "claim": "The Branch field should not be silently changed to 154 in this checkout.",
      "status": "confirmed",
      "evidence": "Command `git branch --show-current` returned `system-speckit/028-memory-search-intelligence`; child specs currently say the same at 001 spec.md:64 and 002 spec.md:67."
    },
    {
      "claim": "001 docs are internally contradictory: Draft/0 percent and A-D/probe language coexist with an accepted Option E decision.",
      "status": "confirmed",
      "evidence": "001 spec.md:62 says Status Draft and line 27 has completion_pct 0; 001 decision-record.md:47 says Status Accepted and line 70 chooses Option E; 001 plan.md:128 and tasks.md:63 still say options A through D; decision-record.md:99 falsely says evidence came from a real runtime probe."
    },
    {
      "claim": "002 docs are internally contradictory and should be partial, not complete.",
      "status": "confirmed",
      "evidence": "002 spec.md:78 says deep-loop is not Skill-invokable; tasks.md:47 says all tasks are pending while tasks.md:57-91 mark T001-T017 checked; tasks.md:75-91 mark completed tasks with [B]; implementation-summary.md:45 says R5 validated while line 89 says package_skill.py was not run."
    },
    {
      "claim": "002 R4 is evidence-pending unless fixtures or sign-off are added.",
      "status": "confirmed",
      "evidence": "002 spec.md:130 requires runtime assumptions verified and a merged-identity decision recorded with evidence; 002 decision-record.md:139 says default to keep and evaluate in Stage 4; decision-record.md:184 says Stage 4 runs the routing-fixture comparison."
    },
    {
      "claim": "Generated metadata ordering matters for the phase-parent active-child pointer.",
      "status": "confirmed",
      "evidence": ".opencode/skills/system-spec-kit/README.md:196 says generate-context refreshes description and graph metadata; README.md:198 says parent saves write null while child saves bubble up the child's packet_id; save_workflow.md:295-298 documents the same parent/child pointer behavior."
    },
    {
      "claim": "Parent generated metadata is stale for active child state.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/graph-metadata.json:38 says status planned; lines 98-99 have last_active_child_id and last_active_at null."
    },
    {
      "claim": "Live skill files still contain stale deep-ai-council naming language after the rename.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:73 calls deep-ai-council grandfathered while folder and packetSkillName are both deep-ai-council; mode-registry.json:15 still cites folder ai-council as the exception; deep-ai-council/SKILL.md:431 calls deep-ai-council the grandfathered SKILL.md name."
    },
    {
      "claim": "deep-loop-workflows graph metadata has one stale source_docs path.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/graph-metadata.json:128 lists the correct key file deep-ai-council/SKILL.md; line 160 still lists source_docs value ai-council/SKILL.md."
    },
    {
      "claim": "The stale deep-n and deep_n_presentation findings should not be fixed in this checkout.",
      "status": "refuted",
      "evidence": "Command `rg -n 'deep-n|deep_n_presentation' .opencode/agents/ai-council.md .opencode/commands/deep/ai-council.md .opencode/commands/deep/assets` returned no hits; ai-council.md:37 and commands/deep/ai-council.md:84,114 point to deep-ai-council and deep_ai-council_presentation.txt."
    },
    {
      "claim": "Advisor and skill-graph gates are real, but the earlier ledger paths were slightly stale.",
      "status": "confirmed",
      "evidence": "Correct paths: .opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md:109,111,113,116 list advisor_rebuild, advisor_validate, skill_graph_scan, skill_graph_validate; .opencode/commands/doctor/assets/doctor_update.yaml:456-457 maps skill-graph and advisor refresh commands."
    },
    {
      "claim": "Rollback/status ledger must account for review and research artifacts.",
      "status": "confirmed",
      "evidence": "Command `git status --short -- .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability ...` returned untracked 001 review, 002 review, and parent research folders."
    }
  ],
  "recommended_steps": [
    {
      "id": "S01",
      "action": "Group 1 preparation: before the first write, capture a targeted `git status --short` snapshot for the parent packet, both review folders, parent research folder, and live skill/template files. Create a rollback ref only after maintainer sign-off if refs are treated as repo mutations.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/",
        ".opencode/skills/deep-loop-workflows/",
        ".opencode/commands/create/assets/create_parent_skill_auto.yaml",
        ".opencode/commands/create/assets/create_parent_skill_confirm.yaml"
      ],
      "rationale": "The work is reversible, but there are untracked review/research artifacts that must not be deleted or mistaken for remediation output.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S02",
      "action": "Group 1 - 001 doc reconciliation: in spec.md, rewrite the problem/current-state text so `Skill(ai-council)` remains the non-goal/direct-mode failure but `Skill(deep-loop-workflows)` is the accepted parent-hub path. Change A-D option language to A-E, change REQ-002 to Option E accepted, add an explicit Option-E fallback, and record NFR-S01 as unresolved or carried to 002 rather than satisfied.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md"
      ],
      "rationale": "The live hub already implements Option E; 001 should document the chosen mechanism without pretending the runtime-probe path happened or the security NFR is proven.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S03",
      "action": "Group 1 - 001 doc reconciliation: in plan.md, replace the stale Proposed/deferred ADR copy with an Accepted pointer to decision-record.md, update all A-D references to A-E, mark the old runtime-extension probe as superseded by invokable-hub routing, and state that 001 has no source build.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/plan.md"
      ],
      "rationale": "plan.md and decision-record.md currently describe different decisions; the plan should become the historical plan plus current decision pointer.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S04",
      "action": "Group 1 - 001 doc reconciliation: in tasks.md, replace the old Phase 1 task text with decision-complete tasks for A-E evaluation, Option E selection, fallback recording, and NFR-S01 carry-forward. Do not mark old runtime-probe/security tasks as verified; mark implementation/probe tasks as not applicable to 001 or moved to 002.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/tasks.md"
      ],
      "rationale": "The current task list says the decision is pending while the decision artifact exists; toggling checkboxes without rewriting task meaning would preserve the traceability bug.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S05",
      "action": "Group 1 - 001 doc reconciliation: in decision-record.md, remove the false real-runtime-probe evidence, change deferred prose to Accepted Option E prose, add an explicit fallback if Option E is insufficient, add a security evaluation row for NFR-S01, and update the HVR_REFERENCE to `.opencode/skills/sk-doc/references/global/hvr_rules.md`.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md"
      ],
      "rationale": "This is the load-bearing mechanism record; it must be honest about why Option E was chosen and what remains unproven.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S06",
      "action": "Group 1 - 001 doc reconciliation: in checklist.md, update the verification summary from all-zero to match actual reconciled rows, add or strengthen a row requiring ADR status synchronization across docs, mark documentation/ADR rows complete with evidence, and leave NFR-S01/runtime-security rows pending or carried to 002.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/checklist.md"
      ],
      "rationale": "The checklist should not claim blanket completion, but it also should not stay at 0/27 after the decision docs are reconciled.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S07",
      "action": "Group 1 - 001 doc reconciliation: in implementation-summary.md, replace `Completed` with `Decision complete; no build in 001; NFR-S01 carried to 002`, correct Spec Folder to the full child path, attribute Option E primarily to deep-loop-workflows with sk-design/spec 154 as secondary adoption, remove false past/future validation contradictions, and update the HVR_REFERENCE path.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md"
      ],
      "rationale": "This file is what resume/search readers will land on; it needs to tell the true cause/effect story.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S08",
      "action": "Group 2 - 002 doc reconciliation: in spec.md, rewrite the problem statement in past/current-state form: R1 static hub retrofit and R2 rename are real; R3 is pending; R4 is evidence-pending/default-keep; R5 is partial. Change completion metadata to about 55 percent, move answered ADR-001 questions out of open_questions, keep Branch unchanged or mark UNKNOWN per policy, and update HVR_REFERENCE.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md"
      ],
      "rationale": "The current spec still frames solved work as unsolved and unproven work as complete.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S09",
      "action": "Group 2 - 002 doc reconciliation: in plan.md, set Stage 0 and Stage 1/R2 to complete, Stage 3/R1 to static retrofit complete with operator/routing probe pending under R5, Stage 2/R3 to pending decision, Stage 4/R4 to pending evidence/default keep, and Stage 5/R5 to partial with package checks passed-with-warnings and advisor/graph/routing/recursive validation gates pending. Add ADR-002 and ADR-003 summaries to the ADR section and update HVR_REFERENCE.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/plan.md"
      ],
      "rationale": "The stage plan is the execution map; it must distinguish completed static changes from unrun runtime/fixture gates.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S10",
      "action": "Group 2 - 002 doc reconciliation: in tasks.md, set T001-T007 to complete, T008-T009 to pending R3 decision, T010 to complete for static Option-E retrofit, T011 to pending operator/routing probe, T012-T013 to pending R4 evidence, T014 to complete-with-warnings, and T015-T017 to pending. Remove `[B]` from completed rows; uncheck completion criteria until R3/R4/R5 close; update HVR_REFERENCE.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md"
      ],
      "rationale": "A task cannot be both completed and blocked, and package checks alone do not prove the full validation stage.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S11",
      "action": "Group 2 - 002 doc reconciliation: in decision-record.md, set ADR-001 to Accepted/executed for folder rename, set ADR-002 to default-keep pending Stage-4 evidence or maintainer sign-off, set ADR-003 to policy accepted but implementation pending. Add a per-mode feature_catalog assessment table with `pending` rows until assessment is done, add the hub-union permission-contract decision for NFR-S01, and update HVR_REFERENCE.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md"
      ],
      "rationale": "ADR-003 currently rejects keep-all but the repo still keeps all five catalogs; the decision record must not claim executed evidence that does not exist.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S12",
      "action": "Group 2 - 002 doc reconciliation: in checklist.md, uncheck R3, R4 evidence, operator/routing probe, advisor/graph, and full R5 rows; keep package-check rows as pass-with-warnings; mark NFR-S01 security rows pending or accepted-risk only after the permission-contract decision is written. Set summary to R1/R2 complete, R3 pending, R4 evidence-pending, R5 partial, overall about 55 percent; update HVR_REFERENCE.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md"
      ],
      "rationale": "The checklist is the most dangerous false-positive surface right now because it marks deferred security and validation rows as complete.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S13",
      "action": "Group 2 - 002 doc reconciliation: in implementation-summary.md, replace the `R5 validated` and `Not run` contradiction with `Partial: R1 static hub routing done; R2 rename done; R3 pending; R4 default keep/evidence pending; R5 package checks passed with warnings and non-package gates pending`. Remove `No source tree changed` and `nothing was implemented`; update open/answered questions and HVR_REFERENCE.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md"
      ],
      "rationale": "Resume consumers need one truthful packet status, not mutually exclusive plan-only and executed narratives.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S14",
      "action": "Group 3 - parent reconciliation: in parent spec.md, update HVR_REFERENCE, set parent status to in_progress, set phase map 001 to `decision complete; NFR-S01 carried to 002`, set phase map 002 to `in progress/partial: R1/R2 complete, R3/R4/R5 pending or partial`, and remove any implication that validation alone closes the FAIL reviews.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/spec.md"
      ],
      "rationale": "The parent should summarize child truth, not preserve stale accepted/planned split-brain.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S15",
      "action": "Group 3 - parent reconciliation: do not hand-edit generated parent/child fingerprints or active-child metadata unless the generator leaves a specific stale field. Plan to refresh generated metadata after all authored docs are reconciled.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/description.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/graph-metadata.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/description.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/graph-metadata.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/description.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/graph-metadata.json"
      ],
      "rationale": "Direct patching fingerprints risks manufacturing metadata; generate-context owns these surfaces and active-child bubbling.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S16",
      "action": "Group 4 - live-skill-file fixes: in deep-loop-workflows/graph-metadata.json, change source_docs entry `ai-council/SKILL.md` to `deep-ai-council/SKILL.md`; leave key_files as already correct.",
      "files": [
        ".opencode/skills/deep-loop-workflows/graph-metadata.json"
      ],
      "rationale": "The stale source_docs path is dead after the rename and undermines R2 name==folder traceability.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S17",
      "action": "Group 4 - live-skill-file fixes: in deep-loop-workflows/SKILL.md, rewrite the line-73 layout prose to say deep-ai-council is now the standard folder==packetSkillName packet; explicitly preserve public legacy surfaces `workflowMode: ai-council`, `/deep:ai-council`, and agent `ai-council`.",
      "files": [
        ".opencode/skills/deep-loop-workflows/SKILL.md"
      ],
      "rationale": "The current `grandfathered name case` wording contradicts the actual folder/name equality.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S18",
      "action": "Group 4 - live-skill-file fixes: in mode-registry.json, update field documentation for packetSkillName so ai-council is no longer described as a folder/name exception; describe legacy public keys separately from packet folder/name identity.",
      "files": [
        ".opencode/skills/deep-loop-workflows/mode-registry.json"
      ],
      "rationale": "The registry documentation currently teaches the stale mismatch as canonical.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S19",
      "action": "Group 4 - live-skill-file fixes: in deep-ai-council/SKILL.md, replace the validation bullet that calls deep-ai-council the grandfathered SKILL.md name with standard packet-skill wording; keep the distinction that dispatched agent identity remains `ai-council`.",
      "files": [
        ".opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md"
      ],
      "rationale": "The packet file should match the renamed folder/name reality without breaking intentional command/agent compatibility.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S20",
      "action": "Group 4 - live-skill-file fixes: in both create-parent-skill templates, remove `ai-council/deep-ai-council` as the canonical folder!=packetSkillName example. Keep generic allowance for real folder/name mismatches and keep the valid many-modes-to-one-packet `deep-improvement` example; do not invent a replacement mismatch example.",
      "files": [
        ".opencode/commands/create/assets/create_parent_skill_auto.yaml",
        ".opencode/commands/create/assets/create_parent_skill_confirm.yaml"
      ],
      "rationale": "Future scaffolds should not copy a stale exception that no longer exists.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S21",
      "action": "Group 4 - explicit non-action: do not remove any feature_catalog directory and do not remove WebFetch from hub allowed-tools in this remediation. Record both as pending decisions with evidence gates.",
      "files": [
        ".opencode/skills/deep-loop-workflows/SKILL.md",
        ".opencode/skills/deep-loop-workflows/deep-research/feature_catalog/",
        ".opencode/skills/deep-loop-workflows/deep-review/feature_catalog/",
        ".opencode/skills/deep-loop-workflows/deep-improvement/feature_catalog/",
        ".opencode/skills/deep-loop-workflows/deep-ai-council/feature_catalog/",
        ".opencode/skills/deep-loop-workflows/deep-context/feature_catalog/"
      ],
      "rationale": "Both actions can break behavior: deep-research requires WebFetch, and ADR-003 has not produced a per-mode deletion ruling.",
      "risk": "high",
      "reversible": true
    },
    {
      "id": "S22",
      "action": "Group 5 - validation and generated metadata: after all authored doc edits, run generate-context in order parent-if-needed, 001 child, then 002 child last, using actual remediation JSON and timestamp. Verify parent last_active_child_id points to 002 after the final child save; patch only if the generator demonstrably leaves a stale field.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/description.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/graph-metadata.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/description.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/graph-metadata.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/description.json",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/graph-metadata.json"
      ],
      "rationale": "This refreshes zero fingerprints, generated summaries, and the phase-parent resume pointer without hand-forged metadata.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S23",
      "action": "Group 5 - validation: run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability --strict --recursive` and require pass after metadata refresh.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability"
      ],
      "rationale": "Strict validation is structural, not semantic, but it must stay green after reconciliation.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S24",
      "action": "Group 5 - validation: rerun `package_skill.py --check --json` for the hub plus deep-context, deep-research, deep-review, deep-ai-council, and deep-improvement; rerun `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/deep-loop-workflows`. Record warnings explicitly and do not call them warning-free unless they are gone.",
      "files": [
        ".opencode/skills/deep-loop-workflows",
        ".opencode/skills/deep-loop-workflows/deep-context",
        ".opencode/skills/deep-loop-workflows/deep-research",
        ".opencode/skills/deep-loop-workflows/deep-review",
        ".opencode/skills/deep-loop-workflows/deep-ai-council",
        ".opencode/skills/deep-loop-workflows/deep-improvement"
      ],
      "rationale": "Live wording and metadata edits touch skill packaging surfaces and must keep the family structurally valid.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S25",
      "action": "Group 5 - validation: run routing fixtures `npm --prefix .opencode/skills/system-skill-advisor/mcp_server test -- tests/routing-registry-drift-guard.vitest.ts tests/routing-parity-deep-skills.vitest.ts tests/routing-parity-deep-council.vitest.ts tests/routing-fixtures.affordance.test.ts`. Because live graph metadata changed, run trusted `skill_graph_scan`, forced `advisor_rebuild`, `skill_graph_validate`, and `advisor_validate` with confirmHeavyRun.",
      "files": [
        ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts",
        ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-skills.vitest.ts",
        ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-parity-deep-council.vitest.ts",
        ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-fixtures.affordance.test.ts",
        ".opencode/skills/deep-loop-workflows/graph-metadata.json"
      ],
      "rationale": "The edited skill metadata feeds advisor routing; package checks alone are not R5.",
      "risk": "med",
      "reversible": true
    }
  ],
  "open_decisions": [
    {
      "question": "What should the child Branch field mean?",
      "options": [
        "Checkout branch: keep `system-speckit/028-memory-search-intelligence` because it is the current branch.",
        "Packet lineage: replace with the intended packet lineage branch if maintainers define one.",
        "Unknown policy: mark the field UNKNOWN or remove it."
      ],
      "recommendation": "Use UNKNOWN or leave the current checkout value until policy is clarified; do not silently change it to 154."
    },
    {
      "question": "How should NFR-S01 be resolved for parent hubs?",
      "options": [
        "Accept hub-level union allowed-tools as the current parent contract and document the risk plus a future hardening probe.",
        "Prove runtime narrows tools after mode dispatch, then keep the no-widening NFR.",
        "Mechanically narrow hub allowed-tools now, including removing WebFetch."
      ],
      "recommendation": "Choose the first option now; do not remove WebFetch without runtime proof because deep-research requires it."
    },
    {
      "question": "How should R3 feature_catalog hygiene close?",
      "options": [
        "Add the per-mode assessment table first and keep R3 pending.",
        "If the assessment says keep-all, amend ADR-003 because keep-all is currently rejected.",
        "If any catalog is removed, require maintainer sign-off and a rollback baseline before deletion."
      ],
      "recommendation": "Start with the assessment table and keep R3 pending; no auto-delete."
    },
    {
      "question": "When can R4 count as complete?",
      "options": [
        "After routing fixtures compare merged-identity vs hub-only behavior.",
        "After explicit maintainer sign-off to keep the projection without fixture evidence.",
        "Now, based only on default-keep prose."
      ],
      "recommendation": "Require fixture evidence or explicit sign-off; until then R4 is evidence-pending."
    },
    {
      "question": "May the implementer create a rollback git ref before edits?",
      "options": [
        "Yes, refs are allowed as reversible remediation scaffolding.",
        "No, refs are protected repo state; record SHA/status snapshot only.",
        "Ask per-run before creating the ref."
      ],
      "recommendation": "Ask once before creating the ref; always capture the status snapshot either way."
    }
  ],
  "critique_prior": [
    "S37 was too optimistic: 001 can be decision-complete only after A-D language becomes A-E, false runtime-probe evidence is removed, Option-E fallback is added, and NFR-S01 is recorded as unresolved or carried forward.",
    "S38/S45 should win over S26.14: 002 is partial, around 55 percent if R4 remains evidence-pending; package checks prove only one R5 subgate.",
    "S43 path details needed correction: the real files are `.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md` and `.opencode/commands/doctor/assets/doctor_update.yaml`.",
    "The stale `deep-n` and `deep_n_presentation` findings are false in this checkout and should not produce edits.",
    "The Branch-field finding is policy-sensitive: current checkout is already 028, so changing to 154 would be an unsupported lineage assertion.",
    "Do not collapse generated-metadata work into manual fingerprint patches; run generate-context first and patch only a proven stale remainder.",
    "Do not treat parent-skill-check or recursive strict validation as semantic completion; both currently pass while the review reports still fail.",
    "Do not remove WebFetch or feature_catalog folders as mechanical cleanup; both require explicit evidence/sign-off gates."
  ]
}
```
