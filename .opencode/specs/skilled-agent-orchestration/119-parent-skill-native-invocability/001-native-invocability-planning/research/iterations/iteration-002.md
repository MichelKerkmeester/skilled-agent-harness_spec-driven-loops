# Research Iteration 2 — gpt-5.5 (xhigh, fast)
## Slice: Ground truth: 002 R3 (feature-catalog) per-mode earned-keep
Dispatched 2026-06-28T08:44:45.028Z | wall 213s

---

R3’s review finding is valid as a documentation/evidence failure, not as proof the catalogs are bloat. My per-mode ruling is keep all five: each catalog has enough mode-specific feature surface and source/test anchoring to earn the overhead. The honest fix is A: document “keep-all, earned,” rewrite ADR/T008 language away from removal-as-execution, and clean the stale “no catalog exists” playbook references. 

```json
{
  "verified_facts": [
    {
      "claim": "ADR-003 requires a per-mode earned-keep assessment, not automatic deletion.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md:216 says keep feature_catalog only where earned and assess actual contents; lines 261-262 say Stage 2 removes unearned folders and repoints references."
    },
    {
      "claim": "R3 is falsely marked executed in packet docs.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md:64 marks T008 [x]; implementation-summary.md:54 says feature-catalogs kept (R3); decision-record.md:199 marks ADR-003 Accepted (executed)."
    },
    {
      "claim": "All five deep-loop mode feature_catalog directories exist, with substantial file counts.",
      "status": "confirmed",
      "evidence": "command `for d in deep-research deep-review deep-improvement deep-context deep-ai-council; do find .../feature_catalog -type f -name '*.md' | wc -l; done` -> deep-research 17, deep-review 28, deep-improvement 25, deep-context 26, deep-ai-council 33."
    },
    {
      "claim": "deep-research feature_catalog is EARNED; recommend keep.",
      "status": "confirmed",
      "evidence": "SKILL.md:15 defines iterative research with externalized state/convergence; feature_catalog/feature_catalog.md:17-22 covers lifecycle/state/convergence/output; feature_catalog/loop-lifecycle/initialization.md:33-53 lists implementation files and validation playbooks."
    },
    {
      "claim": "deep-review feature_catalog is EARNED; recommend keep.",
      "status": "confirmed",
      "evidence": "SKILL.md:27-33 covers multi-round review dimensions and spec/code alignment; feature_catalog/feature_catalog.md:17-22 covers lifecycle/state/dimensions/severity; feature_catalog/severity-system/quality-gates.md:49-67 maps gates to implementation and validation scenarios."
    },
    {
      "claim": "deep-improvement feature_catalog is EARNED; recommend keep.",
      "status": "confirmed",
      "evidence": "SKILL.md:30-41 defines four co-equal lanes; feature_catalog/feature_catalog.md:21-36 maps lanes A-D and shared scoring; feature_catalog/skill-benchmark/mode-wiring.md:31-46 anchors mode wiring to scripts and tests."
    },
    {
      "claim": "deep-context feature_catalog is EARNED; recommend keep.",
      "status": "confirmed",
      "evidence": "SKILL.md:12-14 defines a convergence-gated multi-model context loop; feature_catalog/feature_catalog.md:24-32 covers seven capability categories; feature_catalog/04--convergence-detection/context-coverage-signals.md:48-63 anchors runtime signal code and validation."
    },
    {
      "claim": "deep-ai-council feature_catalog is EARNED; recommend keep.",
      "status": "confirmed",
      "evidence": "SKILL.md:122-126 explicitly says feature_catalog mirrors the playbook 1:1 with 32 entries; feature_catalog/feature_catalog.md:15-17 states each row links to implementation anchors and manual scenarios; manual_testing_playbook.md:414-445 maps DAC-001..DAC-032 to feature_catalog entries."
    },
    {
      "claim": "sk-design comparison premise is true but not decisive for deep-loop: sk-design currently keeps only one feature_catalog directory.",
      "status": "confirmed",
      "evidence": "command `find .opencode/skills/sk-design -maxdepth 4 -type d -name feature_catalog -print` -> only `.opencode/skills/sk-design/design-md-generator/feature_catalog`."
    },
    {
      "claim": "The deep-loop catalogs are unevenly integrated: only deep-ai-council SKILL.md directly names feature_catalog.",
      "status": "confirmed",
      "evidence": "command `rg -n 'Feature Catalog|feature catalog|feature_catalog' .../deep-*/SKILL.md` -> only `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md:125`."
    },
    {
      "claim": "There are stale playbook references saying no feature catalog exists.",
      "status": "confirmed",
      "evidence": "command `rg -n 'No dedicated feature catalog exists yet|No feature catalog exists yet' .../manual_testing_playbook | wc -l` -> 83; per mode: deep-research 30, deep-review 28, deep-ai-council 25. Examples: deep-research/manual_testing_playbook/entry-points-and-modes/auto-mode-deep-research-kickoff.md:68, deep-review/.../auto-mode-deep-review-kickoff.md:68, deep-ai-council/.../runtime-agent-renamed-to-deep-ai-council.md:82."
    },
    {
      "claim": "Removing catalogs is higher blast than documenting keep-all.",
      "status": "confirmed",
      "evidence": "spec.md:150 says deep-loop is the most-used skill family and regressions hit `/deep:*`, agents, and fanout; decision-record.md:237 says every removal must repoint SKILL.md/reference pointers."
    }
  ],
  "recommended_steps": [
    {
      "id": "S6",
      "action": "Resolve R3 as keep-all-earned. Add a per-mode ADR-003 assessment table with outcomes: deep-research keep, deep-review keep, deep-improvement keep, deep-context keep, deep-ai-council keep. Rewrite ADR-003 so 'keep all five' is no longer rejected as bloat/no-work, and change T008/T009 plus implementation-summary/checklist wording from removal-executed to assessment-completed-with-no-removals.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/decision-record.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/tasks.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/checklist.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/implementation-summary.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/spec.md",
        ".opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/002-deep-loop-alignment/plan.md"
      ],
      "rationale": "This reconciles docs to actual disk state and the per-mode evidence without destructive removal in the most-used skill family.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S7",
      "action": "Sweep stale playbook statements that say no feature_catalog exists, replacing each with the actual catalog path or per-feature entry.",
      "files": [
        ".opencode/skills/deep-loop-workflows/deep-research/manual_testing_playbook/**/*.md (30 stale-hit lines)",
        ".opencode/skills/deep-loop-workflows/deep-review/manual_testing_playbook/**/*.md (28 stale-hit lines)",
        ".opencode/skills/deep-loop-workflows/deep-ai-council/manual_testing_playbook/**/*.md (25 stale-hit lines)"
      ],
      "rationale": "Keep-all only becomes honest if the scenario docs stop contradicting the live catalogs.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S8",
      "action": "Optionally add a short feature_catalog pointer to the four mode SKILL.md files that do not mention it; leave deep-ai-council as-is because it already points operators there.",
      "files": [
        ".opencode/skills/deep-loop-workflows/deep-research/SKILL.md",
        ".opencode/skills/deep-loop-workflows/deep-review/SKILL.md",
        ".opencode/skills/deep-loop-workflows/deep-improvement/SKILL.md",
        ".opencode/skills/deep-loop-workflows/deep-context/SKILL.md"
      ],
      "rationale": "The catalogs are earned but not consistently discoverable from SKILL.md; a pointer is lower blast than deleting or restructuring them.",
      "risk": "med",
      "reversible": true
    }
  ],
  "open_decisions": [
    {
      "question": "Should R3 resolve by documenting keep-all-earned or by removing catalogs?",
      "options": [
        "A: Keep all five as earned, update ADR/T008 wording, and fix stale no-catalog references",
        "B: Remove one or more catalogs and repoint every reference"
      ],
      "recommendation": "A. All five catalogs have mode-specific source/test anchors; removal creates unnecessary blast radius across a high-use family."
    },
    {
      "question": "Should the four non-council SKILL.md files gain explicit feature_catalog pointers?",
      "options": [
        "Yes: add one-line discoverability pointers",
        "No: keep catalog discovery in README/manual playbooks only"
      ],
      "recommendation": "Yes, but treat it as a small live-doc edit after the packet-doc reconciliation, because only deep-ai-council currently exposes the catalog from SKILL.md."
    }
  ],
  "critique_prior": [
    "Correct the prior '44 entries total' shorthand: current markdown counts are 17 research, 28 review, 25 improvement, 26 context, 33 council, including root catalog files.",
    "Keep 002-F029/002-F039 as real findings only in the evidence/documentation sense: no per-mode earned-keep assessment was documented before this iteration. Do not treat them as proof the catalogs are unearned.",
    "Extend proposed S5 verification with `rg -n 'No dedicated feature catalog exists yet|No feature catalog exists yet' .opencode/skills/deep-loop-workflows/{deep-research,deep-review,deep-ai-council}/manual_testing_playbook` and require zero stale hits.",
    "Do not remove any feature_catalog folder in this remediation pass unless a later owner explicitly rejects the keep-all ruling; deletion is destructive relative to many playbook, README, reference, and catalog links."
  ]
}
```
