# Iteration 001 — inventory

- Executor: cli-codex gpt-5.6-luna effort=xhigh service_tier=fast sandbox=read-only
- Completed: 2026-07-30T05:46:53.339Z
- New findings: 3 (of 3 reported; prior total 0)
- Coverage: {"filesExamined":41,"groupsExamined":11}

## Summary
The 1,985-file manifest divides into an 890-file runtime backend and 1,095 mode, shared, and governance files. Risk concentrates in runtime/lib authority, fencing, replay, and convergence primitives, plus the large mutation-capable deep-improvement packet. Deep-alignment is the newest and least validated surface; its README explicitly says full live end-to-end acceptance remains outstanding. Three concrete P2 documentation and traceability defects were found.

## Findings
- [P2] F-001-01 Runtime scripts README links to a removed parent SKILL.md @ .opencode/skills/system-deep-loop/runtime/scripts/README.md:40
  - evidence: The related-resources section points to .opencode/skills/system-deep-loop/runtime/SKILL.md, but that file is absent; runtime operating rules were folded into runtime/README.md.
  - recommendation: Replace the stale link with runtime/README.md and update the parent-resource wording.
- [P2] F-001-02 Deep-alignment adapter inventory omits a registered adapter variant @ .opencode/skills/system-deep-loop/deep-alignment/README.md:102
  - evidence: The README says five adapters ship and lists sk-doc, sk-git, sk-design, sk-code, and sk-design-live-render. scoping.cjs registers sk-doc-command as an additional adapter variant, and scripts/adapters/sk-doc-command.cjs exists.
  - recommendation: Document sk-doc-command explicitly or clarify that the count excludes adapter variants; align the README, catalog, and registry.
- [P2] F-001-03 Research README describes an obsolete workflow roster @ .opencode/skills/system-deep-loop/deep-research/README.md:41
  - evidence: The README claims four active families and omits deep-alignment, while the hub and mode registry define five families and seven active modes including alignment. It also says improvement has four command lanes while the registry defines three improvement lanes.
  - recommendation: Synchronize the roster and lane count with mode-registry.json and the parent hub documentation.

## Leaf output (verbatim JSON)
```json
{
  "iteration": 1,
  "dimension": "inventory",
  "summary": "The 1,985-file manifest divides into an 890-file runtime backend and 1,095 mode, shared, and governance files. Risk concentrates in runtime/lib authority, fencing, replay, and convergence primitives, plus the large mutation-capable deep-improvement packet. Deep-alignment is the newest and least validated surface; its README explicitly says full live end-to-end acceptance remains outstanding. Three concrete P2 documentation and traceability defects were found.",
  "moduleMap": [
    {
      "group": "runtime/lib shared authority and convergence substrate",
      "approxFiles": 345,
      "riskRank": 1,
      "notes": "Core ledger, event envelope, fencing, replay, projections, receipts, state, locks, and convergence infrastructure; authority cutover here can corrupt or misauthorize every mode."
    },
    {
      "group": "deep-improvement packet",
      "approxFiles": 476,
      "riskRank": 2,
      "notes": "Largest packet with 182 scripts and 146 assets; owns promotion, rollback, external executors, model benchmarks, and skill benchmarks."
    },
    {
      "group": "runtime/lib mode durability bundles",
      "approxFiles": 208,
      "riskRank": 3,
      "notes": "Eight repeated certificate, ledger-schema, reducer, resume, rollback, sealed-artifact, and shadow-parity families; duplication creates parity-drift risk."
    },
    {
      "group": "runtime/tests",
      "approxFiles": 192,
      "riskRank": 4,
      "notes": "149 unit tests plus integration, lifecycle, council, receipt, executor, fixture, and SQLite coverage; this is the main cutover evidence surface."
    },
    {
      "group": "deep-alignment packet",
      "approxFiles": 133,
      "riskRank": 5,
      "notes": "Read-only conformance engine with scoping, six adapter modules including variants, partitioning, convergence, and remediation hook; live end-to-end acceptance remains incomplete."
    },
    {
      "group": "runtime/scripts",
      "approxFiles": 20,
      "riskRank": 6,
      "notes": "JSON CLI entrypoints for convergence, state mutation, reducers, fan-out, graph operations, and loop locking."
    },
    {
      "group": "deep-review packet",
      "approxFiles": 149,
      "riskRank": 7,
      "notes": "P0/P1/P2 review workflow, reducer, fan-out, convergence, artifact state, feature catalog, and manual scenarios."
    },
    {
      "group": "deep-research packet",
      "approxFiles": 149,
      "riskRank": 8,
      "notes": "Web/code investigation workflow with externalized state, source triangulation, convergence, synthesis, and fan-out."
    },
    {
      "group": "deep-ai-council packet",
      "approxFiles": 130,
      "riskRank": 9,
      "notes": "Multi-seat planning, adjudication, council graph integration, rollback, convergence, and session recovery."
    },
    {
      "group": "runtime documentation and validation artifacts",
      "approxFiles": 125,
      "riskRank": 10,
      "notes": "Runtime database, feature catalog, references, manual playbook, package metadata, and operational documentation."
    },
    {
      "group": "hub, shared services, and top-level governance",
      "approxFiles": 58,
      "riskRank": 11,
      "notes": "Mode registry, hub router, leaf manifest, shared smart routing, progress, rollout, synthesis, feature catalog, and parent playbook; cross-mode traceability surface."
    }
  ],
  "hotspots": [
    "runtime/lib/authorized-ledger, event-envelope, locks-and-fencing, and transactional-projections: authority, fencing, and replay decisions affect every downstream write.",
    "runtime/lib/deep-loop plus runtime/scripts/convergence.cjs, reducers, and fan-out scripts: state corruption, incorrect stop decisions, or lost iteration artifacts would invalidate loop results.",
    "runtime/lib/receipts-and-effect-recovery, dispatch-receipts, replay-fingerprint, and result-envelopes: boundary exactly-once behavior and forensic recovery at cutover.",
    "deep-improvement/scripts/shared/loop-host.cjs, promote-candidate.cjs, rollback-candidate.cjs, and model/skill benchmark executors: mutation, promotion, external execution, and trust-boundary risk.",
    "deep-alignment/scripts/scoping.cjs, adapters, partition-corpus.cjs, check-convergence.cjs, and reducer wiring: newest authority-conformance surface with incomplete live acceptance.",
    "mode-registry.json, hub-router.json, leaf-manifest.json, shared/references/smart-routing.md, and command routers: cross-surface routing and packet identity drift.",
    "runtime/lib mode durability bundles: repeated per-mode implementations require parity checks during authority cutover.",
    "runtime/tests/integration, lifecycle, executor-audit, and receipt-crypto suites: strongest evidence for spawned CLI, SQLite, locking, and receipt behavior."
  ],
  "findings": [
    {
      "severity": "P2",
      "dimension": "maintainability",
      "title": "Runtime scripts README links to a removed parent SKILL.md",
      "file": ".opencode/skills/system-deep-loop/runtime/scripts/README.md",
      "line": 40,
      "evidence": "The related-resources section points to .opencode/skills/system-deep-loop/runtime/SKILL.md, but that file is absent; runtime operating rules were folded into runtime/README.md.",
      "recommendation": "Replace the stale link with runtime/README.md and update the parent-resource wording."
    },
    {
      "severity": "P2",
      "dimension": "traceability",
      "title": "Deep-alignment adapter inventory omits a registered adapter variant",
      "file": ".opencode/skills/system-deep-loop/deep-alignment/README.md",
      "line": 102,
      "evidence": "The README says five adapters ship and lists sk-doc, sk-git, sk-design, sk-code, and sk-design-live-render. scoping.cjs registers sk-doc-command as an additional adapter variant, and scripts/adapters/sk-doc-command.cjs exists.",
      "recommendation": "Document sk-doc-command explicitly or clarify that the count excludes adapter variants; align the README, catalog, and registry."
    },
    {
      "severity": "P2",
      "dimension": "traceability",
      "title": "Research README describes an obsolete workflow roster",
      "file": ".opencode/skills/system-deep-loop/deep-research/README.md",
      "line": 41,
      "evidence": "The README claims four active families and omits deep-alignment, while the hub and mode registry define five families and seven active modes including alignment. It also says improvement has four command lanes while the registry defines three improvement lanes.",
      "recommendation": "Synchronize the roster and lane count with mode-registry.json and the parent hub documentation."
    }
  ],
  "coverage": {
    "filesExamined": 41,
    "groupsExamined": 11
  }
}
```