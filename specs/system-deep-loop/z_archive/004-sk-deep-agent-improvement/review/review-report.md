---
title: Deep Review Report - 079 sk-deep-agent-improvement
description: Final deep-review synthesis for the sk-improve-agent to deep-agent-improvement rename packet.
---

# Deep Review Report - 079 sk-deep-agent-improvement

## Executive Summary

- **Verdict**: CONDITIONAL
- **hasAdvisories**: true
- **Stop reason**: all configured dimensions covered after 4 iterations; active P1 findings prevent PASS.
- **Active findings**: P0=0, P1=3, P2=1.
- **Scope**: `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement` plus declared rename implementation surfaces in skill, command, advisor, runtime mirror, root docs, and install docs.
- **Release readiness**: not release-ready until the P1 findings are resolved or explicitly deferred with user approval.

## Planning Trigger

`/speckit:plan` is required for remediation because three active P1 findings remain. The review did not modify implementation files.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": [
    {
      "id": "P1-001",
      "severity": "P1",
      "title": "Resource map marks nonexistent runtime command mirrors as OK",
      "source": ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/review/iterations/iteration-001.md",
      "affectedSurfaces": ["resource-map runtime mirror inventory", "Gemini command mirror", "Codex command mirror"]
    },
    {
      "id": "P1-002",
      "severity": "P1",
      "title": "Unquoted workflow placeholders allow shell/path injection before script validation",
      "source": ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/review/iterations/iteration-002.md",
      "affectedSurfaces": ["deep_start-agent-improvement-loop_auto.yaml", "deep_start-agent-improvement-loop_confirm.yaml", "spec_folder", "target_path", "candidate_path"]
    },
    {
      "id": "P1-003",
      "severity": "P1",
      "title": "Completion status is claimed while mandatory memory-save and checklist/task evidence remain pending",
      "source": ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/review/iterations/iteration-003.md",
      "affectedSurfaces": ["implementation-summary.md", "tasks.md", "checklist.md", "REQ-015", "/memory:save"]
    },
    {
      "id": "P2-001",
      "severity": "P2",
      "title": "Install-guide skill inventory still advertises retired sk-deep-* skill IDs",
      "source": ".opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/review/iterations/iteration-004.md",
      "affectedSurfaces": ["SET-UP - AGENTS.md", "deep-research", "deep-review"]
    }
  ],
  "remediationWorkstreams": [
    "Reconcile resource-map runtime mirror inventory with disk state",
    "Harden improve-agent workflow shell placeholder handling",
    "Complete or defer memory-save and update task/checklist/summary status",
    "Clean stale install-guide deep skill names"
  ],
  "specSeed": "Add remediation acceptance criteria for resource-map accuracy, command placeholder quoting, continuity completion, and setup-doc naming drift.",
  "planSeed": "Prioritize P1-002 first, then P1-003, then P1-001, then P2-001.",
  "findingClasses": ["matrix/evidence", "cross-consumer"],
  "affectedSurfacesSeed": ["resource-map.md", "improve command YAML", "implementation-summary.md", "tasks.md", "checklist.md", "install guides"],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

| ID | Severity | Title | Dimension | Evidence | Disposition |
|----|----------|-------|-----------|----------|-------------|
| P1-001 | P1 | Resource map marks nonexistent runtime command mirrors as OK | correctness / traceability | `resource-map.md:41`, `resource-map.md:63`, `resource-map.md:108-115`; `implementation-summary.md:87-88` | active |
| P1-002 | P1 | Unquoted workflow placeholders allow shell/path injection before script validation | security | `deep_start-agent-improvement-loop_auto.yaml:37-40`, `:56-59`, `:128-135`; `deep_start-agent-improvement-loop_confirm.yaml:141-148` | active |
| P1-003 | P1 | Completion status is claimed while mandatory memory-save and checklist/task evidence remain pending | traceability | `implementation-summary.md:17`, `:26`, `:36`, `:163`; `spec.md:140`; `tasks.md:151`; `checklist.md:138`, `:155` | active |
| P2-001 | P2 | Install-guide skill inventory still advertises retired `sk-deep-*` skill IDs | maintainability | `.opencode/install_guides/SET-UP - AGENTS.md:514-515`; `.opencode/install_guides/README.md:1200`, `:1482`; `README.md:1216` | active advisory |

### P1-001 Details

- **Impact**: Release evidence can mislead follow-on operators by saying all enumerated command mirror paths exist when `.codex/commands/deep/` is absent and Gemini has no YAML command assets.
- **Fix recommendation**: Update `resource-map.md` to mark absent Codex command surfaces and Gemini YAML assets as N/A/absent, and revise the `Missing on disk` summary.
- **Scope proof**: Iteration 1 confirmed implementation-summary already documents Gemini/Codex runtime shapes correctly, so the defect is stale resource-map evidence, not missing implementation.

### P1-002 Details

- **Impact**: User-controlled placeholders are interpolated into shell commands before Node scripts can normalize paths.
- **Fix recommendation**: Use argv arrays or a central quoting/escaping helper for `{spec_folder}`, `{target_path}`, `{agent_name}`, `{target_profile}`, and any output path placeholders before command execution.
- **Scope proof**: The same unquoted pattern appears in both auto and confirm workflow command surfaces.

### P1-003 Details

- **Impact**: Packet completion status conflicts with required release-continuity evidence.
- **Fix recommendation**: Run `/memory:save`, update T-041 and CHK-055 with evidence, and revise the implementation-summary status. If intentionally deferred, document explicit user-approved deferral and remove blanket all-P0/P1-met claims.
- **Scope proof**: `spec.md` defines REQ-015 as P1, while task/checklist/summary surfaces still show it pending.

### P2-001 Details

- **Impact**: Future setup-doc operators may copy retired `sk-deep-research` / `sk-deep-review` IDs.
- **Fix recommendation**: Update `.opencode/install_guides/SET-UP - AGENTS.md` to use `deep-research` and `deep-review` in the active install inventory.
- **Scope proof**: Adjacent current docs already use `deep-research` / `deep-review`; this is isolated setup-doc drift.

## Remediation Workstreams

1. **Security hardening**: Fix unquoted command placeholders in `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` and `deep_start-agent-improvement-loop_confirm.yaml`; mirror if equivalent downstream runtime command assets exist.
2. **Release evidence reconciliation**: Correct `resource-map.md` runtime mirror rows and summary.
3. **Continuity completion**: Execute `/memory:save`, then update `implementation-summary.md`, `tasks.md`, and `checklist.md` so REQ-015/T-041/CHK-055 agree.
4. **Documentation cleanup**: Replace retired `sk-deep-research` / `sk-deep-review` entries in `.opencode/install_guides/SET-UP - AGENTS.md`.

## Spec Seed

- Add an explicit remediation requirement that command YAML placeholders must be safely passed as argv or shell-escaped before execution.
- Add an acceptance criterion that resource-map rows must represent actual disk state after implementation, including N/A entries for unsupported runtime mirrors.
- Add a completion criterion requiring `/memory:save` evidence before `completion_pct: 100` and blanket P0/P1 completion claims.
- Add a setup-doc naming consistency check for deep-family skills.

## Plan Seed

- T-001: Patch improve-agent auto/confirm YAML command construction to avoid unquoted shell interpolation.
- T-002: Re-run a malicious/space-containing path smoke test or document dispatcher-level escaping evidence.
- T-003: Patch `resource-map.md` Gemini/Codex command rows and summary.