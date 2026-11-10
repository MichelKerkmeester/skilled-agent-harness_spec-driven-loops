---
title: "Iteration 8: D2/D3 Security and traceability — command, hook and registration residue"
trigger_phrases: []
---

# Iteration 8: D2/D3 Security and traceability — command, hook and registration residue

## Setup and route

- review_target: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- review_target_type: `spec-folder`
- review_dimensions: `all`
- spec_folder: `.opencode/specs/system-speckit/052-memory-decommission-landing`
- execution_mode: `AUTONOMOUS`
- lineage_mode: `auto`
- target_agent: `deep-review`
- agent_definition_loaded: `true`
- resolved_route: `Resolved route: mode=review target_agent=deep-review`

## Focus

This pivot audits the surviving command and doctor surfaces, portable hook catalog, OpenCode plugin inventory, and decommission references. It traces the intended replacement memory commands and doctor route, then compares the current hook kill-switch index and authoritative plugin inventory against their configuration tables and tests. Historical names in residue scanners, parity probes, and negative assertions are treated as expected evidence; operator-facing configuration that advertises a removed plugin is evaluated separately. Convergence remains telemetry only under `stopPolicy=max-iterations`.

## Scorecard

- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 22
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0
- Scope inventory: 438 paths in `scratch/review-scope.txt`; this iteration reviewed 22 listed paths

## Findings

### P0, Blocker

- None.

### P1, Required

- None newly opened. F001, F003, F004, F006 and F007 remain active; the command and hook pass did not change their severity.

### P2, Advisory

- **F010 — Current plugin documentation advertises the retired memory-plugin kill switch.** `[SOURCE: .opencode/plugins/README.md:16-20,24-44,90-100]` The plugin README calls its flat directory inventory authoritative and lists current auto-loaded modules, but its configuration table still names `SYSTEM_SPEC_MEMORY_DISABLED`, `SPECKIT_SPEC_MEMORY_PLUGIN_DISABLED`, and “advisor and memory plugins.” `[SOURCE: .opencode/plugins/tests/README.md:92-95]` The test README repeats `SYSTEM_SPEC_MEMORY_DISABLED` as a current suite kill switch. `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md:14-18,361-365]` The surviving package explicitly says the memory engine, launcher, plugin bridge, and spec-memory CLI are gone; `[SOURCE: .opencode/hooks/README.md:34-58]` the current hook kill-switch index contains no memory concern. The stale plugin documentation can cause an operator to believe a removed subsystem is disabled or covered by tests, but no live memory plugin entry is listed and no runtime behavior change was demonstrated. Severity is P2: decommission traceability/maintenance residue, not a live registration or enforcement bypass.
  - Recommendation: remove the retired memory flag and “memory plugin” references from current plugin configuration/test documentation, or mark them explicitly historical; keep historical names only in the residue scanner and negative-control tests.

## Claim adjudication

```json
[
  {
    "findingId": "F010",
    "claim": "The current OpenCode plugin documentation describes a retired memory plugin and kill switch as if they were current.",
    "evidenceRefs": [
      ".opencode/plugins/README.md:16-20,24-44,90-100",
      ".opencode/plugins/tests/README.md:92-95",
      ".opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md:14-18,361-365",
      ".opencode/hooks/README.md:34-58"
    ],
    "counterevidenceSought": "Compared the plugin inventory, current hook kill-switch index, package removal statement, and exact runtime-facing documentation references.",
    "alternativeExplanation": "The names may be intended as historical compatibility notes, but the table headings and test guidance present them as active configuration rather than historical evidence.",
    "finalSeverity": "P2",
    "confidence": 0.94,
    "downgradeTrigger": "If the plugin README and test README are shown to be explicitly historical and no operator is expected to use their configuration tables, downgrade to documentation cleanup only; the decommission residue should still be removed or labelled.",
    "transitions": [
      { "iteration": 8, "from": null, "to": "P2", "reason": "Current plugin configuration and test guidance advertises a retired memory concern absent from the authoritative inventory and hook index." }
    ]
  }
]
```

## Search and ruled-out checks

- `/memory:save` and `/memory:search` are intentionally retained successor commands: the command README describes lexical retrieval plus the continuity writer `[SOURCE: .opencode/commands/memory/README.txt:34-48]`, the save router explicitly routes writes through the continuity script `[SOURCE: .opencode/commands/memory/save.md:17-26,64-72]`, and the search router uses the generated index and ripgrep lanes `[SOURCE: .opencode/commands/memory/search.md:22-29,70-83]`. Their names are not a retired-server registration finding.
- The `/doctor memory` route is a surviving read-only trigger-index diagnostic, not the removed memory server: the route manifest binds it to `doctor-memory.yaml` and lists lookup/ripgrep checks `[SOURCE: .opencode/commands/doctor/_routes.yaml:31-47]`, while the workflow says no background service and treats the generated index as an input `[SOURCE: .opencode/commands/doctor/assets/doctor-memory.yaml:21-46]`. F004 remains the missing checklist pointer in that route.
- The current hook index contains the active concerns and no memory concern `[SOURCE: .opencode/hooks/README.md:34-58]`. The residue terms in `sweep-memory-residue.mjs` are an intentional scanner vocabulary `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:108-118]`; `parity-check.mjs` probes for the retired daemon to prove the lookup path does not consult it `[SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/parity-check.mjs:793-817]`; and the daemon/workflow tests assert the old launcher surface is absent `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/daemon-detect.vitest.ts:40-45]` `[SOURCE: .opencode/skills/system-spec-kit/scripts/tests/workflow-step115-daemon-guard.vitest.ts:31-63]`. These are negative controls, not live residue.
- The package environment reference consistently states that the old memory server and CLI were removed and names the surviving skill-advisor owner `[SOURCE: .opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md:14-18,361-370]`; this corroborates F010's documentation mismatch rather than creating a second runtime finding.
- The hook flag resolver and portable hook documentation expose current concern-derived names and aliases, so no additional flag parsing or kill-switch boundary defect was supported `[SOURCE: .opencode/hooks/shared/hook-flags.cjs:1-80]` `[SOURCE: .opencode/hooks/shared/env-aliases.cjs:1-80]`.

## Traceability result

- `spec_code`: partial. F010 adds stale current plugin configuration documentation; F001, F003, F004, F006, F007, F008 and F009 remain unresolved.
- `checklist_evidence`: blocked. The packet has checklist-like material in `tasks.md`, but no root `checklist.md`; the authoritative validator and generators remain intentionally unrun under the lineage-only boundary.

## Iteration handoff

- New active registry: P0=0, P1=5, P2=5, open=10.
- Next angle: cross-lane adversarial replay and the remaining ranking-determinism/authoritative-evidence frontier.
- Stop policy: continue through iteration 10 even if convergence telemetry rises.

Review verdict: CONDITIONAL
