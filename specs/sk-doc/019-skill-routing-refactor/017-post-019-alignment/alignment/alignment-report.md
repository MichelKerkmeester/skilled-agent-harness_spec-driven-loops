---
title: Deep Alignment Report
description: Auto-generated reducer view over the alignment packet. Never manually edited.
---

# Deep Alignment Report

- Target: Post-019 routing conformance across all 12 skill hubs, against the authorities packet 019 established (compiled serving contract, typed leaf identity, create-* packet canon, hub routing metadata)
- Lanes: 4 (4 applicable)
- Overall verdict: FAIL
- Result state: SEALED (authoritative -- the loop reached synthesis)
- Coverage: 49 / 1794 artifacts (incomplete)
- Findings: P0 0 / P1 11 / P2 0
- Composite score: 55

## Lane: sk-code / code / .opencode/bin/compiled-route-status.cjs, .opencode/bin/compiled-route-sync.cjs, .opencode/bin/lib/compiled-route-manifest.cjs, .opencode/bin/lib/compiled-routing/010-live-activation/activation/**, .opencode/bin/lib/compiled-routing/011-runtime-engine/**

- Verdict: CONDITIONAL
- Iterations run: 4
- Artifacts checked: 19 / 19
- Findings: P0 0 / P1 1 / P2 0
- Composite score: 5

### P1

- **reality-drift** (reasoning-agent) — `.opencode/bin/lib/compiled-routing/010-live-activation/activation/mcp-tooling/manifest.json` — The activation records pass compiled-route-status, but compiled-route-sync --check fails because its authored runtime root no longer exists, breaking reproducible verification of the promoted closure. [SOURCE: .opencode/bin/compiled-route-sync.cjs:40]

## Lane: sk-doc / docs / .opencode/skills/*/feature-catalog/**, .opencode/skills/sk-doc/create-*/SKILL.md

- Verdict: FAIL
- Iterations run: 6
- Artifacts checked: 30 / 465
- Findings: P0 0 / P1 10 / P2 0
- Composite score: 50

### P1

- **reality-drift** (reasoning-agent) — `.opencode/skills/cli-external-orchestration/feature-catalog/cli-executor-dispatch-routing/cli-executor-dispatch-routing.md` — The CLI executor leaf repeatedly claims the registry has three workflow packets, but the live registry includes cli-cursor as a fourth workflow. [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/cli-executor-dispatch-routing/cli-executor-dispatch-routing.md:18] [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:79]
- **reality-drift** (reasoning-agent) — `.opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` — The root catalog contradicts its own four-packet introduction and the live registry by describing dispatch across only three packets. [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:33] [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:79]
- **reality-drift** (reasoning-agent) — `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md` — The Cursor leaf says mcp-route-guard is deliberately not wired, while the live Cursor hook registry wires it under beforeMCPExecution. [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:40] [SOURCE: .cursor/hooks.json:82]
- **creation-standard-drift** (reasoning-agent) — `.opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md` — The Cursor leaf uses mutable Phase 011 narration and a numbered spec implementation summary as runtime evidence, contrary to the feature-catalog current-source-only rule. [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:38] [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:79] [SOURCE: .opencode/skills/sk-doc/create-feature-catalog/SKILL.md:386]
- **creation-standard-drift** (reasoning-agent) — `.opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md` — The root catalog embeds Phase 010, Phase 011, and Phase 016 delivery history in its current-reality summary, violating the authority rule against mutable phase history in runtime catalogs. [SOURCE: .opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:73] [SOURCE: .opencode/skills/sk-doc/create-feature-catalog/SKILL.md:351] [SOURCE: .opencode/skills/sk-doc/create-feature-catalog/SKILL.md:386]
- **reality-drift** (reasoning-agent) — `.opencode/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` — The leaf claims the shared workflow doctrine lives at `shared/references/workflow_*.md`, but that pattern resolves no files; the live canonical files and both surfaces’ symlinks use `workflow-{implement,debug,verify}.md`. This breaks the catalog’s current-source traceability requirement. [SOURCE: .opencode/skills/sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md:32] [SOURCE: .opencode/skills/sk-code/shared/references/workflow-debug.md]
- **reality-drift** (reasoning-agent) — `.opencode/skills/sk-design/feature-catalog/creation-command-surface/interface-creation-commands.md` — The catalog presents the five `/interface:*` commands as one canonical surface and cites `design-command-surface-check.mjs` as validating command-package and metadata parity, but a direct re-probe returned `STATUS=DRIFT` for audit, design, foundations, and motion because their live command argument hints are more specific than `command-metadata.json`. [SOURCE: .opencode/skills/sk-design/feature-catalog/creation-command-surface/interface-creation-commands.md:50] [SOURCE: .opencode/skills/sk-design/command-metadata.json:9] [SOURCE: .opencode/commands/interface/audit.md:3]
- **reality-drift** (reasoning-agent) — `.opencode/skills/sk-design/feature-catalog/manager-shell/transport-vs-taste-separation.md` — The leaf’s sole Validation And Tests row labels the md-generator feature catalog as a Manual playbook, but the live document identifies itself as the md-generator capability inventory rather than validation of the manager-shell transport/taste boundary. A real hub playbook with explicit PASS/FAIL criteria exists but is not cited, so the required validation/test anchor is inaccurate. [SOURCE: .opencode/skills/sk-design/feature-catalog/manager-shell/transport-vs-taste-separation.md:45] [SOURCE: .opencode/skills/sk-design/design-md-generator/feature-catalog/feature-catalog.md:2] [SOURCE: .opencode/skills/sk-design/manual-testing-playbook/hub-manager-intake/verifier-cadence-pause.md:44]
- **reality-drift** (reasoning-agent) — `.opencode/skills/sk-design/feature-catalog/styles-library-utilization/retrieval-engine.md` — The retrieval-engine leaf presents five implementation files and three automated tests as current source anchors, but direct live-filesystem probes found all eight paths absent; the feature therefore lacks the implementation and validation anchors required by the feature-catalog authoring contract. [SOURCE: .opencode/skills/sk-design/feature-catalog/styles-library-utilization/retrieval-engine.md:42] [SOURCE: .opencode/skills/sk-design/feature-catalog/styles-library-utilization/retrieval-engine.md:52]
- **reality-drift** (reasoning-agent) — `.opencode/skills/sk-design/feature-catalog/styles-library-utilization/style-database-backend.md` — The indexed-style-database leaf presents seven implementation files and five automated tests as current source anchors, but direct live-filesystem probes found the database and engine paths absent; its shipped-backend claims therefore lack the source and validation anchors required by the feature-catalog authoring contract. [SOURCE: .opencode/skills/sk-design/feature-catalog/styles-library-utilization/style-database-backend.md:42] [SOURCE: .opencode/skills/sk-design/feature-catalog/styles-library-utilization/style-database-backend.md:54]

## Lane: sk-doc / docs / .opencode/skills/*/SKILL.md, .opencode/skills/*/description.json, .opencode/skills/*/graph-metadata.json, .opencode/skills/*/mode-registry.json, .opencode/skills/*/hub-router.json, .opencode/skills/*/leaf-manifest.json

- Verdict: FAIL
- Iterations run: 0
- Artifacts checked: 0 / 12
- Findings: P0 0 / P1 0 / P2 0
- Composite score: 0

No open findings.

## Lane: sk-design / designs / .opencode/skills/sk-design, .opencode/skills/mcp-tooling

- Verdict: FAIL
- Iterations run: 0
- Artifacts checked: 0 / 1298
- Findings: P0 0 / P1 0 / P2 0
- Composite score: 0

No open findings.
