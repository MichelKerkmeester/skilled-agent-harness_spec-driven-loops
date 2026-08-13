# Iteration 038 — maintainability

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T09:14:34.666Z
- New findings: 6 (of 6 reported; prior total 156)
- Coverage: {"filesExamined":34,"keyPaths":[".opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/README.md",".opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md",".opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/fixtures/fixture-manifest.json",".opencode/skills/system-deep-loop/deep-research/README.md",".opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs",".opencode/skills/system-deep-loop/runtime/references/script-interface-contract.md",".opencode/skills/system-deep-loop/runtime/scripts/status.cjs",".opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs",".opencode/skills/system-deep-loop/runtime/scripts/query.cjs",".opencode/skills/system-deep-loop/deep-alignment/README.md",".opencode/commands/deep/alignment.md",".opencode/commands/deep/assets/deep-alignment-auto.yaml",".opencode/skills/system-deep-loop/deep-ai-council/README.md",".opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs",".opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/advise-council-completion.vitest.ts"]}

## Summary
I examined the benchmark documentation, reducers, runtime script contracts, alignment command surface, and council completion workflow. The main risk is documentation drift: several references describe absent packets, unsupported flags, or stricter completion behavior than the implementation provides. These discrepancies can send operators to non-runnable commands or cause them to treat advisory output as verification. No additional authority-boundary defect was established beyond the known findings.

## Findings
- [P1] F-038-01 Command-surface benchmark mixes live 035 and absent 066 packet @ .opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md:38
  - evidence: The benchmark index and runnable README use .opencode/specs/system-deep-loop/035-command-surface-benchmark, but this contract's verification command, fixture root, execution phase, and evidence paths use .opencode/specs/system-deep-loop/066-command-surface-benchmark. The 066 packet and oracle path are absent while the referenced 035 phase exists.
  - recommendation: Select one canonical packet, then regenerate the contract, fixture manifest, hashes, commands, and evidence links so every benchmark artifact resolves to the same existing packet.
- [P1] F-038-02 Research README promises corruption repair that the reducer does not perform @ .opencode/skills/system-deep-loop/deep-research/README.md:130
  - evidence: The troubleshooting section says the reducer auto-repairs one trailing corrupt JSONL line. The implementation records corruption warnings, throws in strict mode, and exits with status 2 unless --lenient is supplied; no truncation or repair branch exists.
  - recommendation: Document strict fail-closed behavior accurately and describe --lenient as an explicit recovery mode, not automatic repair.
- [P1] F-038-03 Runtime script contract omits the supported council loop type @ .opencode/skills/system-deep-loop/runtime/references/script-interface-contract.md:67
  - evidence: The contract restricts --loop-type to research or review. The actual status.cjs, upsert.cjs, and query.cjs implementations accept council, and runtime/lib/council/README.md documents those scripts with loopType=council.
  - recommendation: Update the interface contract with council's accepted arguments, lifecycle, and specialized storage semantics, and distinguish it from the research/review/context database path.
- [P2] F-038-04 Alignment README documents a nonexistent --convergence flag @ .opencode/skills/system-deep-loop/deep-alignment/README.md:144
  - evidence: The README lists --convergence=N as part of the command contract. The actual alignment command and both workflow assets use --coverage-threshold, --stability-window, and --convergence-mode; no --convergence option appears in the command surface.
  - recommendation: Replace the stale flag with the implemented coverage, stability, and convergence-mode options and update adjacent examples and references.
- [P2] F-038-05 Sibling docs still advertise a pre-alignment four-family roster @ .opencode/skills/system-deep-loop/deep-research/README.md:41
  - evidence: This README says the active roster has four families and four improvement lanes. The root SKILL.md defines five families including deep-alignment and three improvement lanes; similar four-family claims remain in the council and runtime READMEs.
  - recommendation: Synchronize the mode roster across all sibling READMEs and replace duplicated counts with links to one authoritative registry where possible.
- [P1] F-038-06 Council completion is documented as a gate but implemented as advisory @ .opencode/skills/system-deep-loop/deep-ai-council/README.md:80
  - evidence: The handoff instructions say to verify that the state log ends with council_complete. advise-council-completion.cjs only checks whether any such event exists, emits advisories, and returns 0 even when the event is missing; its tests explicitly preserve that behavior.
  - recommendation: Either label this step explicitly as advisory and require a separate authoritative completion check, or make the verifier fail closed and validate the terminal event semantics.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 38,
  "dimension": "maintainability",
  "summary": "I examined the benchmark documentation, reducers, runtime script contracts, alignment command surface, and council completion workflow. The main risk is documentation drift: several references describe absent packets, unsupported flags, or stricter completion behavior than the implementation provides. These discrepancies can send operators to non-runnable commands or cause them to treat advisory output as verification. No additional authority-boundary defect was established beyond the known findings.",
  "findings": [
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Command-surface benchmark mixes live 035 and absent 066 packet",
      "file": ".opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md",
      "line": 38,
      "evidence": "The benchmark index and runnable README use .opencode/specs/system-deep-loop/035-command-surface-benchmark, but this contract's verification command, fixture root, execution phase, and evidence paths use .opencode/specs/system-deep-loop/066-command-surface-benchmark. The 066 packet and oracle path are absent while the referenced 035 phase exists.",
      "recommendation": "Select one canonical packet, then regenerate the contract, fixture manifest, hashes, commands, and evidence links so every benchmark artifact resolves to the same existing packet."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Research README promises corruption repair that the reducer does not perform",
      "file": ".opencode/skills/system-deep-loop/deep-research/README.md",
      "line": 130,
      "evidence": "The troubleshooting section says the reducer auto-repairs one trailing corrupt JSONL line. The implementation records corruption warnings, throws in strict mode, and exits with status 2 unless --lenient is supplied; no truncation or repair branch exists.",
      "recommendation": "Document strict fail-closed behavior accurately and describe --lenient as an explicit recovery mode, not automatic repair."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Runtime script contract omits the supported council loop type",
      "file": ".opencode/skills/system-deep-loop/runtime/references/script-interface-contract.md",
      "line": 67,
      "evidence": "The contract restricts --loop-type to research or review. The actual status.cjs, upsert.cjs, and query.cjs implementations accept council, and runtime/lib/council/README.md documents those scripts with loopType=council.",
      "recommendation": "Update the interface contract with council's accepted arguments, lifecycle, and specialized storage semantics, and distinguish it from the research/review/context database path."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Alignment README documents a nonexistent --convergence flag",
      "file": ".opencode/skills/system-deep-loop/deep-alignment/README.md",
      "line": 144,
      "evidence": "The README lists --convergence=N as part of the command contract. The actual alignment command and both workflow assets use --coverage-threshold, --stability-window, and --convergence-mode; no --convergence option appears in the command surface.",
      "recommendation": "Replace the stale flag with the implemented coverage, stability, and convergence-mode options and update adjacent examples and references."
    },
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Sibling docs still advertise a pre-alignment four-family roster",
      "file": ".opencode/skills/system-deep-loop/deep-research/README.md",
      "line": 41,
      "evidence": "This README says the active roster has four families and four improvement lanes. The root SKILL.md defines five families including deep-alignment and three improvement lanes; similar four-family claims remain in the council and runtime READMEs.",
      "recommendation": "Synchronize the mode roster across all sibling READMEs and replace duplicated counts with links to one authoritative registry where possible."
    },
    {
      "severity": "P1",
      "dimension": "maintainability",
      "title": "Council completion is documented as a gate but implemented as advisory",
      "file": ".opencode/skills/system-deep-loop/deep-ai-council/README.md",
      "line": 80,
      "evidence": "The handoff instructions say to verify that the state log ends with council_complete. advise-council-completion.cjs only checks whether any such event exists, emits advisories, and returns 0 even when the event is missing; its tests explicitly preserve that behavior.",
      "recommendation": "Either label this step explicitly as advisory and require a separate authoritative completion check, or make the verifier fail closed and validate the terminal event semantics."
    }
  ],
  "refutations": [],
  "coverage": {
    "filesExamined": 34,
    "keyPaths": [
      ".opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/README.md",
      ".opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/conformance-benchmark.md",
      ".opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/fixtures/fixture-manifest.json",
      ".opencode/skills/system-deep-loop/deep-research/README.md",
      ".opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs",
      ".opencode/skills/system-deep-loop/runtime/references/script-interface-contract.md",
      ".opencode/skills/system-deep-loop/runtime/scripts/status.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs",
      ".opencode/skills/system-deep-loop/runtime/scripts/query.cjs",
      ".opencode/skills/system-deep-loop/deep-alignment/README.md",
      ".opencode/commands/deep/alignment.md",
      ".opencode/commands/deep/assets/deep-alignment-auto.yaml",
      ".opencode/skills/system-deep-loop/deep-ai-council/README.md",
      ".opencode/skills/system-deep-loop/deep-ai-council/scripts/advise-council-completion.cjs",
      ".opencode/skills/system-deep-loop/deep-ai-council/scripts/tests/advise-council-completion.vitest.ts"
    ]
  }
}
```