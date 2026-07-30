# Iteration 035 — maintainability

- Executor: cli-codex gpt-5.6-sol effort=high service_tier=fast sandbox=read-only
- Completed: 2026-07-30T08:56:10.073Z
- New findings: 5 (of 5 reported; prior total 136)
- Coverage: {"filesExamined":26,"keyPaths":[".opencode/skills/system-deep-loop/SKILL.md",".opencode/skills/system-deep-loop/README.md",".opencode/skills/system-deep-loop/mode-registry.json",".opencode/skills/system-deep-loop/hub-router.json",".opencode/skills/system-deep-loop/shared/references/smart-routing.md",".opencode/skills/system-deep-loop/shared/rollout/",".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs",".opencode/skills/system-deep-loop/shared/synthesis/resource-map.cjs"]}

## Summary
Examined the hub registry and routing documents, shared rollout governance, synthesis/progress seams, and the behavior-benchmark runner and fixtures. The main risk is governance drift: rollout state can advance without its mandated evidence, while shared-packet routing makes two improvement modes unobservable under their real identities. The benchmark runner also permits postcondition probes outside the fixture, weakening hermeticity and making results host-dependent. No tests were executed because the available suites create temporary or output files, which this read-only leaf contract forbids.

## Findings
- [P1] F-035-01 Four commands are promoted before the required evidence mechanism exists @ .opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json:2
  - evidence: The map sets research, review, ai-council, and alignment to `fix`. The adjacent rollout README lines 17-18 says manifest capture and the CI comparator are deferred, while promotion-rule.md lines 3-8 requires three consecutive green comparator runs, a green comparator, an unchanged fallback hash, and zero unexpected baseline divergence before any flip. The checked-in promotion state therefore cannot be reproduced or audited under its own governance contract.
  - recommendation: Make promotion evidence machine-readable and required by a validator that rejects `fix` entries without matching capture manifests, fallback hashes, comparator runs, and baseline-divergence results. Revert unsupported entries to `fallback` until that evidence exists.
- [P1] F-035-02 Shared-packet leaf identity makes two workflow routes unobservable @ .opencode/skills/system-deep-loop/shared/references/smart-routing.md:42
  - evidence: Lines 42-47 state that all `deep-improvement` leaf paths bind to the first-declared `agent-improvement` mode, so model-benchmark and skill-benchmark rows cannot emit their actual observed workflowMode. Lines 122-126 consequently instruct benchmark readers to reinterpret the observed `agent-improvement` identity rather than treating it as a routing miss. Any replay or telemetry consumer therefore loses the distinction between three registered workflow modes.
  - recommendation: Bind leaf identity using `(workflowMode, packet, leafResourceId)` rather than deriving mode from packet ownership. Allow one packet path to register mode-qualified leaf entries and add replay tests proving all three improvement modes remain distinct.
- [P1] F-035-03 Benchmark postconditions can depend on arbitrary host paths @ .opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs:147
  - evidence: `resolveProbePath` returns `path.resolve(rawPath)` unchanged for every absolute path at line 151. `evaluatePostconditions` then uses that result for existence, JSON-field, and text probes. The framework explicitly documents that absolute paths remain absolute, so a schema-v2 benchmark can pass or fail based on files outside its fixture or repository, contradicting the suite's hermetic-fixture claim.
  - recommendation: Reject absolute probe paths and require resolved paths to remain beneath the fixture root. If repository-level probes are needed, expose a separate explicit probe kind with a declared, validated allowlist.
- [P2] F-035-04 Hub documentation advertises an unsupported backend kind @ .opencode/skills/system-deep-loop/README.md:63
  - evidence: The README says `backendKind` may select an external adapter and line 65 describes routing null loop types to that adapter. mode-registry.json lines 8-9 defines only `runtime-loop-type` and `improvement-host`, and every registered mode uses one of those two values. The mode-authoring documentation therefore describes a backend contract absent from the registry.
  - recommendation: Remove the external-adapter wording or add it to the registry schema, validation, and mode-authoring checklist with an implemented dispatch path.
- [P2] F-035-05 Deep-review integration documentation ends at an empty section @ .opencode/skills/system-deep-loop/deep-review/SKILL.md:440
  - evidence: The file ends immediately after the `### Code Graph Integration` heading. There is no contract, limitation, or explicit statement that code-graph integration is unavailable, leaving the final integration surface undefined.
  - recommendation: Document the actual code-graph integration and fallback behavior, or remove the empty heading if no integration exists.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 35,
  "dimension": "maintainability",
  "summary": "Examined the hub registry and routing documents, shared rollout governance, synthesis/progress seams, and the behavior-benchmark runner and fixtures. The main risk is governance drift: rollout state can advance without its mandated evidence, while shared-packet routing makes two improvement modes unobservable under their real identities. The benchmark runner also permits postcondition probes outside the fixture, weakening hermeticity and making results host-dependent. No tests were executed because the available suites create temporary or output files, which this read-only leaf contract forbids.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Four commands are promoted before the required evidence mechanism exists",
      "file": ".opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json",
      "line": 2,
      "evidence": "The map sets research, review, ai-council, and alignment to `fix`. The adjacent rollout README lines 17-18 says manifest capture and the CI comparator are deferred, while promotion-rule.md lines 3-8 requires three consecutive green comparator runs, a green comparator, an unchanged fallback hash, and zero unexpected baseline divergence before any flip. The checked-in promotion state therefore cannot be reproduced or audited under its own governance contract.",
      "recommendation": "Make promotion evidence machine-readable and required by a validator that rejects `fix` entries without matching capture manifests, fallback hashes, comparator runs, and baseline-divergence results. Revert unsupported entries to `fallback` until that evidence exists."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Shared-packet leaf identity makes two workflow routes unobservable",
      "file": ".opencode/skills/system-deep-loop/shared/references/smart-routing.md",
      "line": 42,
      "evidence": "Lines 42-47 state that all `deep-improvement` leaf paths bind to the first-declared `agent-improvement` mode, so model-benchmark and skill-benchmark rows cannot emit their actual observed workflowMode. Lines 122-126 consequently instruct benchmark readers to reinterpret the observed `agent-improvement` identity rather than treating it as a routing miss. Any replay or telemetry consumer therefore loses the distinction between three registered workflow modes.",
      "recommendation": "Bind leaf identity using `(workflowMode, packet, leafResourceId)` rather than deriving mode from packet ownership. Allow one packet path to register mode-qualified leaf entries and add replay tests proving all three improvement modes remain distinct."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Benchmark postconditions can depend on arbitrary host paths",
      "file": ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs",
      "line": 147,
      "evidence": "`resolveProbePath` returns `path.resolve(rawPath)` unchanged for every absolute path at line 151. `evaluatePostconditions` then uses that result for existence, JSON-field, and text probes. The framework explicitly documents that absolute paths remain absolute, so a schema-v2 benchmark can pass or fail based on files outside its fixture or repository, contradicting the suite's hermetic-fixture claim.",
      "recommendation": "Reject absolute probe paths and require resolved paths to remain beneath the fixture root. If repository-level probes are needed, expose a separate explicit probe kind with a declared, validated allowlist."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Hub documentation advertises an unsupported backend kind",
      "file": ".opencode/skills/system-deep-loop/README.md",
      "line": 63,
      "evidence": "The README says `backendKind` may select an external adapter and line 65 describes routing null loop types to that adapter. mode-registry.json lines 8-9 defines only `runtime-loop-type` and `improvement-host`, and every registered mode uses one of those two values. The mode-authoring documentation therefore describes a backend contract absent from the registry.",
      "recommendation": "Remove the external-adapter wording or add it to the registry schema, validation, and mode-authoring checklist with an implemented dispatch path."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Deep-review integration documentation ends at an empty section",
      "file": ".opencode/skills/system-deep-loop/deep-review/SKILL.md",
      "line": 440,
      "evidence": "The file ends immediately after the `### Code Graph Integration` heading. There is no contract, limitation, or explicit statement that code-graph integration is unavailable, leaving the final integration surface undefined.",
      "recommendation": "Document the actual code-graph integration and fallback behavior, or remove the empty heading if no integration exists."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 26,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/SKILL.md",
      ".opencode/skills/system-deep-loop/README.md",
      ".opencode/skills/system-deep-loop/mode-registry.json",
      ".opencode/skills/system-deep-loop/hub-router.json",
      ".opencode/skills/system-deep-loop/shared/references/smart-routing.md",
      ".opencode/skills/system-deep-loop/shared/rollout/",
      ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs",
      ".opencode/skills/system-deep-loop/shared/synthesis/resource-map.cjs"
    ]
  }
}
```