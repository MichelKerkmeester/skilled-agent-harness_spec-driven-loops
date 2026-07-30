# Iteration 033 — maintainability

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T08:50:10.749Z
- New findings: 6 (of 6 reported; prior total 127)
- Coverage: {"filesExamined":38,"keyPaths":[".opencode/skills/system-deep-loop/SKILL.md",".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/profile-resolve.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/append-run-index.cjs",".opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles",".opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark",".opencode/skills/system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config.json",".opencode/skills/system-deep-loop/benchmark/reports/README.md",".opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md"]}

## Summary
Read the hub and nested packet manifests plus the Lane B/C loaders, profile and fixture assets, report-index writer, and alignment conformance asset. The dominant risk is migration residue: seven of ten shipped Lane B profiles cannot resolve their fixture IDs, and the documented Lane C legacy corpus layout is incompatible with its loader. Additional drift exists in a dead Lane-A path, an empty report index beside existing run folders, inert Lane-C assets, and one broken evidence link. No known finding was re-reported or refuted.

## Findings
- [P1] F-033-01 Seven shipped benchmark profiles reference nonexistent fixture IDs @ .opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v3.json:9
  - evidence: The profile references validate_ipv4, validate_date, validate_semver, and hard_roman_to_int, while the fixture IDs use hyphens. sweep-benchmark.cjs only resolves exact parsed IDs or filename stems at lines 121-127; its exported selector reports fixture-not-found errors for seven of the ten shipped profiles.
  - recommendation: Normalize one canonical fixture-ID convention, update all profiles and tests, and add an all-profile asset-resolution gate.
- [P1] F-033-02 Documented nested legacy fixture corpus is skipped by the loader @ .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:280
  - evidence: loadFixtures() scans only immediate directory entries for *.public.json. The asset README documents fixtures/<skill-id>/ subdirectories and says the corpus is consumed via --fixtures-dir; calling loadFixtures() on the documented fixtures parent returns zero rows, while the deep-improvement child returns one.
  - recommendation: Recurse into skill subdirectories or resolve the target skill child explicitly, and fail when an explicit corpus path yields zero fixture rows.
- [P2] F-033-03 Lane-A config contains a missing and unconsumed fixture catalog path @ .opencode/skills/system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config.json:35
  - evidence: paths.fixtureCatalog points to .opencode/skills/system-deep-loop/deep-improvement/assets/fixtures, which does not exist. No implementation script references fixtureCatalog; the asset README nevertheless describes it as resolving under the skill assets.
  - recommendation: Remove the stale field or point it at a real catalog, then validate every configured asset path during initialization.
- [P2] F-033-04 Benchmark report index is empty beside existing report folders @ .opencode/skills/system-deep-loop/benchmark/reports/README.md:25
  - evidence: The RUN INDEX contains only the table header, while baseline and three compiled-routing run folders exist on disk. append-run-index.cjs updates the index only when a future run writes through the current code path, so existing evidence remains undiscoverable.
  - recommendation: Backfill the index from existing folders and add a drift check comparing indexed folders with report directories.
- [P2] F-033-05 Lane-C profile and remediation assets are inert duplicate sources of truth @ .opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/README.md:22
  - evidence: The README states default-profile.json is not loaded at runtime and remediation-taxonomy.json is not imported by the report renderer. score-skill-benchmark.cjs hardcodes WEIGHTS at line 35, leaving edits to the shipped profile or taxonomy unable to affect benchmark behavior.
  - recommendation: Either wire both assets into runtime validation/rendering or move them into clearly labelled historical/reference documentation.
- [P2] F-033-06 Alignment benchmark contains a broken local evidence link @ .opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md:164
  - evidence: The evidence pointer targets .opencode/specs/system-deep-loop/066-command-surface-benchmark/004-command-lane-integration/alignment/, which is absent from the workspace; the local-link scan found this as the only broken markdown link.
  - recommendation: Update the pointer to the current evidence phase, or mark it as an external/generated reference and exclude it from local-link validation.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 33,
  "dimension": "maintainability",
  "summary": "Read the hub and nested packet manifests plus the Lane B/C loaders, profile and fixture assets, report-index writer, and alignment conformance asset. The dominant risk is migration residue: seven of ten shipped Lane B profiles cannot resolve their fixture IDs, and the documented Lane C legacy corpus layout is incompatible with its loader. Additional drift exists in a dead Lane-A path, an empty report index beside existing run folders, inert Lane-C assets, and one broken evidence link. No known finding was re-reported or refuted.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Seven shipped benchmark profiles reference nonexistent fixture IDs",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v3.json",
      "line": 9,
      "evidence": "The profile references validate_ipv4, validate_date, validate_semver, and hard_roman_to_int, while the fixture IDs use hyphens. sweep-benchmark.cjs only resolves exact parsed IDs or filename stems at lines 121-127; its exported selector reports fixture-not-found errors for seven of the ten shipped profiles.",
      "recommendation": "Normalize one canonical fixture-ID convention, update all profiles and tests, and add an all-profile asset-resolution gate."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Documented nested legacy fixture corpus is skipped by the loader",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs",
      "line": 280,
      "evidence": "loadFixtures() scans only immediate directory entries for *.public.json. The asset README documents fixtures/<skill-id>/ subdirectories and says the corpus is consumed via --fixtures-dir; calling loadFixtures() on the documented fixtures parent returns zero rows, while the deep-improvement child returns one.",
      "recommendation": "Recurse into skill subdirectories or resolve the target skill child explicitly, and fail when an explicit corpus path yields zero fixture rows."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Lane-A config contains a missing and unconsumed fixture catalog path",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config.json",
      "line": 35,
      "evidence": "paths.fixtureCatalog points to .opencode/skills/system-deep-loop/deep-improvement/assets/fixtures, which does not exist. No implementation script references fixtureCatalog; the asset README nevertheless describes it as resolving under the skill assets.",
      "recommendation": "Remove the stale field or point it at a real catalog, then validate every configured asset path during initialization."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Benchmark report index is empty beside existing report folders",
      "file": ".opencode/skills/system-deep-loop/benchmark/reports/README.md",
      "line": 25,
      "evidence": "The RUN INDEX contains only the table header, while baseline and three compiled-routing run folders exist on disk. append-run-index.cjs updates the index only when a future run writes through the current code path, so existing evidence remains undiscoverable.",
      "recommendation": "Backfill the index from existing folders and add a drift check comparing indexed folders with report directories."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Lane-C profile and remediation assets are inert duplicate sources of truth",
      "file": ".opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark/README.md",
      "line": 22,
      "evidence": "The README states default-profile.json is not loaded at runtime and remediation-taxonomy.json is not imported by the report renderer. score-skill-benchmark.cjs hardcodes WEIGHTS at line 35, leaving edits to the shipped profile or taxonomy unable to affect benchmark behavior.",
      "recommendation": "Either wire both assets into runtime validation/rendering or move them into clearly labelled historical/reference documentation."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Alignment benchmark contains a broken local evidence link",
      "file": ".opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md",
      "line": 164,
      "evidence": "The evidence pointer targets .opencode/specs/system-deep-loop/066-command-surface-benchmark/004-command-lane-integration/alignment/, which is absent from the workspace; the local-link scan found this as the only broken markdown link.",
      "recommendation": "Update the pointer to the current evidence phase, or mark it as an external/generated reference and exclude it from local-link validation."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 38,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/SKILL.md",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/lib/profile-resolve.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/append-run-index.cjs",
      ".opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles",
      ".opencode/skills/system-deep-loop/deep-improvement/assets/skill-benchmark",
      ".opencode/skills/system-deep-loop/deep-improvement/assets/agent-improvement/improvement-config.json",
      ".opencode/skills/system-deep-loop/benchmark/reports/README.md",
      ".opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md"
    ]
  }
}
```