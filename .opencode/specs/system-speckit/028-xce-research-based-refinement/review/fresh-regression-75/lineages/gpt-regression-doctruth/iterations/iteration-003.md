# Seat gpt-regression-doctruth — iteration 3 (global #41)

- Model: `openai/gpt-5.5-fast` · Executor: opencode · Angle: gpt-regression-doctruth
- Verdict: **FAIL** · Findings: P0=0 P1=2 P2=0

## Analysis

Read-only regression review focused on the playbook self-check count and directly referenced commands. No files will be modified.The index is the only matching playbook root. I’m checking its embedded self-check against the actual markdown inventory under the playbook tree.The playbook’s release-readiness block hard-codes `410` and includes a Python read-only self-check. I’m running that exact self-check to verify the documented count against the current tree.The file-count self-check passes exactly as documented. I also found a nearby verdict-taxonomy inconsistency in the same release-readiness block and am verifying it against surrounding text before deciding if it is actionable.One nuance in the count definition is whether category README files are included as “scenario files.” I’m checking that before deciding whether the count claim itself has a traceability defect.The exact hard-coded check returns 410, but the counted set includes three category README/package-map files. That makes the “scenario files” count semantically different from the current scenario-file inventory.I’m doing one final pass over the index/category references to separate confirmed findings from observed context before producing the required JSON-only terminal block.Analysis: The documented count self-check was executed read-only and returned `OK: 410 files, 325 index links, 0 broken, 85 orphans (baseline 85)`. That proves the hard-coded check matches its own glob. However, the glob includes three category `README.md` files that the docs describe as package maps or category guides, so the stated “410 scenario files” claim is still traceability-wrong if “scenario files” means executable scenario contracts. I also found the verdict taxonomy still contradicts itself around `PARTIAL`.

```json
{
  "seat": "gpt-regression-doctruth",
  "model": "openai/gpt-5.5-fast",
  "angle": "REGRESSION: playbook contradictory verdict taxonomy + hard-coded file-count self-check were fixed. Re-verify the playbook self-check count matches reality.",
  "verdict": "FAIL",
  "summary": "Self-check returns 410 but counts 3 category READMEs as scenarios; PARTIAL verdict taxonomy still contradicts itself.",
  "files_reviewed": [
    ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/stress-testing/README.md",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/doctor-commands/README.md",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/local-llm-query-intelligence/README.md",
    ".opencode/skills/system-spec-kit/manual_testing_playbook/analysis/causal-stats-empty-graph-edge.md"
  ],
  "findings": [
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "Scenario file count includes category README files",
      "file": ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:160",
      "evidence": "Lines 160-164 define scenario_files as every direct category *.md file, and line 173 hard-codes expected 410. Running that inventory read-only produced playbook_glob_count=410, category_readme_count=3, non_readme_count=407. The included README files are category/package docs, e.g. stress-testing/README.md:21 says the README is the package map and execution procedure stays in run-stress-cycle.md.",
      "why": "The release-readiness text claims 410 scenario files, but the self-check count includes non-scenario README/package-map files. That inflates TOTAL_SCENARIOS and orphan accounting by 3, so coverage and readiness evidence can be traced to documentation files rather than executable scenario contracts.",
      "recommendation": "Exclude category README/package-map files from scenario_files, or rename the check to count all playbook markdown files. If excluding them, update the hard-coded count from 410 to 407 and recompute the orphan baseline against only executable scenario files."
    },
    {
      "severity": "P1",
      "dimension": "traceability",
      "title": "PARTIAL remains both disallowed and required by verdict rules",
      "file": ".opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:130",
      "evidence": "Line 9 lists valid scenario classifications as PASS, FAIL, SKIP, or UNAUTOMATABLE, and line 125 says PARTIAL is not a valid per-scenario verdict. But line 130 defines a feature PARTIAL as at least one mapped scenario being PARTIAL. Representative scenario docs also still request PASS/PARTIAL/FAIL, e.g. analysis/causal-stats-empty-graph-edge.md:22-23.",
      "why": "Operators cannot derive the documented feature-level PARTIAL without violating the root scenario taxonomy, and per-scenario files still instruct a verdict shape the root playbook forbids. That keeps release-readiness and triage semantics ambiguous.",
      "recommendation": "Choose one taxonomy and apply it consistently: either allow per-scenario PARTIAL everywhere, or keep scenario PARTIAL forbidden and redefine feature/packet PARTIAL as an aggregate evidence state derived from PASS/SKIP/UNAUTOMATABLE plus incomplete supporting evidence."
    }
  ]
}
```
