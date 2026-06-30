# Research Iteration 1 — gpt-5.5 (xhigh, fast)
## Slice: Ground truth: 002 R1/R2 (rename + invokable-hub routing)
Dispatched 2026-06-28T08:40:33.319Z | wall 194s

---

R1/R2 are real on disk: the deep-loop hub is now Option-E invokable, and the council packet folder is `deep-ai-council` with `name: deep-ai-council`. The remediation should not revert that work; it should reconcile packet 155/002 docs to reality, preserve the intentional `ai-council` command/agent/artifact keys, and fix the stale old-path/template references that remain.  
```json
{
  "verified_facts": [
    {
      "claim": "002 R2 executed: the mode packet folder was renamed from ai-council to deep-ai-council.",
      "status": "confirmed",
      "evidence": "command: `test -d .opencode/skills/deep-loop-workflows/deep-ai-council && echo 'deep-ai-council exists'; test ! -d .opencode/skills/deep-loop-workflows/ai-council && echo 'ai-council absent'` -> `deep-ai-council exists` and `ai-council absent`; git show b0cbbe7b67 name-status shows `R098 .opencode/skills/deep-loop-workflows/ai-council/SKILL.md -> .opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md`."
    },
    {
      "claim": "All 6 deep-loop skill packets satisfy folder == SKILL.md name.",
      "status": "confirmed",
      "evidence": "command output: `deep-loop-workflows => deep-loop-workflows`, `deep-context => deep-context`, `deep-research => deep-research`, `deep-review => deep-review`, `deep-ai-council => deep-ai-council`, `deep-improvement => deep-improvement`."
    },
    {
      "claim": "002 R1 executed: deep-loop-workflows implements invokable-hub Option E routing.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:18 says `Invoke it as Skill(deep-loop-workflows)`; line 36 says `Routing is registry-driven (invokable-hub, Option E)` and loads `registry[mode].packet`; lines 44-52 spell out reading `mode-registry.json` and loading `registry[mode].packet/SKILL.md`."
    },
    {
      "claim": "The ai-council workflow mode intentionally still routes to packet deep-ai-council while preserving legacy command/agent/artifact keys.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/mode-registry.json:66-72 has `workflowMode: ai-council`, `packet: deep-ai-council`, `command: /deep:ai-council`, `agent: ai-council`, `artifactRoot: ai-council/`; .opencode/skills/deep-loop-workflows/SKILL.md:25 repeats the same mapping."
    },
    {
      "claim": "The single graph-metadata invariant is preserved for the deep-loop hub.",
      "status": "confirmed",
      "evidence": "command: `find .opencode/skills/deep-loop-workflows -name graph-metadata.json -print | sort` -> only `.opencode/skills/deep-loop-workflows/graph-metadata.json`."
    },
    {
      "claim": "Remaining ai-council references in the command and agent surfaces are intentional legacy keys, not stale packet paths.",
      "status": "confirmed",
      "evidence": ".opencode/commands/deep/ai-council.md:72-76 keeps packet-local `ai-council/**` artifacts and `/deep:ai-council` syntax; .opencode/agents/ai-council.md:2 names the agent `ai-council`, line 27 restricts writes to `ai-council/**`, and line 37 points to the actual `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md`."
    },
    {
      "claim": "There are still real stale/broken old packet-path references under .opencode/skills.",
      "status": "confirmed",
      "evidence": "rg `deep-loop-workflows/ai-council` found dead paths at .opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-rollback.vitest.ts:14,21; scripts/tests/multi-ai-council-persist-artifacts.vitest.ts:15; scripts/tests/multi-ai-council-advise-completion.vitest.ts:13; mcp_server/tests/multi-ai-council-permission-scope.vitest.ts:14; mcp_server/tests/council-playbook-anchor-integrity.vitest.ts:10; mcp_server/tests/multi-ai-council-audit-trail.vitest.ts:14,21; mcp_server/tests/council-helpers-smoke.vitest.ts:14; .opencode/skills/sk-doc/scripts/tests/test_changelog_validator.py:27."
    },
    {
      "claim": "deep-loop-workflows graph metadata still has one stale source_docs path.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/graph-metadata.json:153-161 lists source_docs including `ai-council/SKILL.md`, while key_files at lines 123-130 correctly use `deep-ai-council/SKILL.md`."
    },
    {
      "claim": "Grandfathered mismatch prose is now stale because folder and packetSkillName are both deep-ai-council.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:73 calls `deep-ai-council` a grandfathered name case while saying folder and packetSkillName are both `deep-ai-council`; .opencode/skills/deep-loop-workflows/mode-registry.json:15 still says `ai-council is a grandfathered exception (folder 'ai-council', packetSkillName 'deep-ai-council')`."
    },
    {
      "claim": "Create-parent-skill and sk-doc parent-skill docs still teach the old ai-council/deep-ai-council mismatch as canonical.",
      "status": "confirmed",
      "evidence": ".opencode/commands/create/assets/create_parent_skill_auto.yaml:185,219,256 and create_parent_skill_confirm.yaml:199,233,285 cite `folder ai-council, packetSkillName deep-ai-council`; .opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md:63 and :137 use the same stale worked example."
    },
    {
      "claim": "The review findings about `deep-n` and `deep_n_presentation` are not true in the current tree.",
      "status": "refuted",
      "evidence": "rg `deep_n_presentation|deep-n/|deep-n` under .opencode/commands .opencode/agents .opencode/skills found no command/agent stale path hits, only unrelated `deep-navy` text in a sk-design example; .opencode/commands/deep/ai-council.md:84 and :114 both reference existing `.opencode/commands/deep/assets/deep_ai-council_presentation.txt`."
    },
    {
      "claim": "002 docs truthfully claim R1/R2 execution in some places but still contain plan-only and not-run contradictions.",
      "status": "partial",
      "evidence": "True execution claims: implementation-summary.md:14,45,54 and tasks.md:61,75. Refuted stale claims: spec.md:78-79 says not Skill-invokable and name!=folder; spec.md:102-103 says documentation only/no source changes; implementation-summary.md:57 says `No source tree changed`; line 65 says `nothing was implemented`; line 89 says package_skill was not run; line 98 says no implementation exists."
    }
  ],
  "recommended_steps": [
    {
      "id": "S1",
      "action": "Reconcile 002 packet docs to the executed R1/R2 reality: mark R1 Option-E hub routing and R2 rename as executed, remove plan-only/no-source-change/not-run language, update status/completion fields, and make task/checklist summaries match item state.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/plan.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md"
      ],
      "rationale": "The repo state confirms R1/R2 happened; the packet fails because docs mix executed and plan-only states.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S2",
      "action": "Fix stale old packet-path references from `deep-loop-workflows/ai-council/...` to `deep-loop-workflows/deep-ai-council/...`, and update deep-loop graph source_docs from `ai-council/SKILL.md` to `deep-ai-council/SKILL.md`.",
      "files": [
        ".opencode/skills/deep-loop-workflows/graph-metadata.json",
        ".opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-rollback.vitest.ts",
        ".opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts",
        ".opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-advise-completion.vitest.ts",
        ".opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-permission-scope.vitest.ts",
        ".opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts",
        ".opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-audit-trail.vitest.ts",
        ".opencode/skills/system-spec-kit/mcp_server/tests/council-helpers-smoke.vitest.ts",
        ".opencode/skills/sk-doc/scripts/tests/test_changelog_validator.py"
      ],
      "rationale": "These are real broken paths after the rename, not intentional legacy command/agent keys.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S3",
      "action": "Replace stale grandfathered-mismatch wording with the current invariant: packet folder/name is `deep-ai-council`; legacy `ai-council` remains only as workflowMode, command, agent, and artifact root.",
      "files": [
        ".opencode/skills/deep-loop-workflows/SKILL.md",
        ".opencode/skills/deep-loop-workflows/mode-registry.json",
        ".opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md",
        ".opencode/commands/create/assets/create_parent_skill_auto.yaml",
        ".opencode/commands/create/assets/create_parent_skill_confirm.yaml",
        ".opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md"
      ],
      "rationale": "The old mismatch example is now false and will generate future stale scaffolds.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S4",
      "action": "Explicitly preserve the intentional legacy keys: do not rename `/deep:ai-council`, `.opencode/agents/ai-council.md`, `workflowMode: ai-council`, `agent: ai-council`, or `<packet>/ai-council/**` artifacts.",
      "files": [
        ".opencode/commands/deep/ai-council.md",
        ".opencode/agents/ai-council.md",
        ".opencode/skills/deep-loop-workflows/mode-registry.json",
        ".opencode/skills/deep-loop-workflows/SKILL.md"
      ],
      "rationale": "Those references are the compatibility surface ADR-001 keeps; changing them would be live-infra behavior change, not remediation.",
      "risk": "med",
      "reversible": true
    },
    {
      "id": "S5",
      "action": "After doc/path reconciliation, run targeted verification: rg for old `deep-loop-workflows/ai-council` paths, rg for stale grandfathered mismatch prose, package_skill checks for hub plus five packets, and packet validate.sh strict.",
      "files": [
        ".opencode/skills/deep-loop-workflows",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment"
      ],
      "rationale": "R1/R2 are structurally true, but completion cannot be claimed until stale references and metadata contradictions are gone.",
      "risk": "low",
      "reversible": true
    }
  ],
  "open_decisions": [
    {
      "question": "Should remediation change live hub tool permissions to address NFR-S01, or reconcile docs to the current union-grant hub pattern?",
      "options": [
        "Doc/risk reconciliation only: record that hub allowed-tools is the effective contract unless runtime narrowing is proven.",
        "Live-infra edit: narrow hub allowed-tools or implement packet-specific permission enforcement."
      ],
      "recommendation": "Prefer doc/risk reconciliation for this R1/R2 remediation pass; live permission changes are higher-blast and should be a separately approved fix."
    },
    {
      "question": "Should historical changelog references to the old ai-council path be changed?",
      "options": [
        "Leave historical rename notes intact when they explicitly describe old -> new movement.",
        "Rewrite all historical mentions mechanically."
      ],
      "recommendation": "Leave historical changelog notes intact; fix only current load paths, templates, metadata, and instructional prose."
    }
  ],
  "critique_prior": [
    "No prior ledger entries were supplied.",
    "Confirmed the review's core R1/R2 diagnosis: execution happened but packet docs were not reconciled.",
    "Confirmed stale path findings for graph metadata, tests, and parent-skill scaffolding templates.",
    "Refuted current-tree claims about `.opencode/agents/ai-council.md` using `deep-n/` and `.opencode/commands/deep/ai-council.md` using `deep_n_presentation.txt`."
  ]
}
```
