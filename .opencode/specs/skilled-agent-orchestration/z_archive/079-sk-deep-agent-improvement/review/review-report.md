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
      "affectedSurfaces": ["improve_improve-agent_auto.yaml", "improve_improve-agent_confirm.yaml", "spec_folder", "target_path", "candidate_path"]
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
| P1-002 | P1 | Unquoted workflow placeholders allow shell/path injection before script validation | security | `improve_improve-agent_auto.yaml:37-40`, `:56-59`, `:128-135`; `improve_improve-agent_confirm.yaml:141-148` | active |
| P1-003 | P1 | Completion status is claimed while mandatory memory-save and checklist/task evidence remain pending | traceability | `implementation-summary.md:17`, `:26`, `:36`, `:163`; `spec.md:140`; `tasks.md:151`; `checklist.md:138`, `:155` | active |
| P2-001 | P2 | Install-guide skill inventory still advertises retired `sk-deep-*` skill IDs | maintainability | `.opencode/install_guides/SET-UP - AGENTS.md:514-515`; `.opencode/install_guides/README.md:1200`, `:1482`; `README.md:1216` | active advisory |

### P1-001 Details

- **Impact**: Release evidence can mislead follow-on operators by saying all enumerated command mirror paths exist when `.codex/commands/improve/` is absent and Gemini has no YAML command assets.
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

1. **Security hardening**: Fix unquoted command placeholders in `.opencode/commands/improve/assets/improve_improve-agent_auto.yaml` and `improve_improve-agent_confirm.yaml`; mirror if equivalent downstream runtime command assets exist.
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
- T-004: Run `/memory:save`; update implementation summary, tasks, and checklist with evidence.
- T-005: Patch `.opencode/install_guides/SET-UP - AGENTS.md` retired deep skill names.
- T-006: Re-run targeted deep-review or single-pass review over changed evidence.

## Traceability Status

| Protocol | Status | Evidence | Notes |
|----------|--------|----------|-------|
| `spec_code` | partial | Iterations 1 and 3 | Implementation summary mostly matches current state, but resource-map and completion claims conflict with disk/task evidence. |
| `checklist_evidence` | failed | Iteration 3 | Checklist and task ledger still leave required memory-save work unchecked while summary claims completion. |
| `feature_catalog_code` | partial | Iterations 1, 2, 4 | Advisor and main rename surfaces sampled clean; command YAML security issue remains. |
| `playbook_capability` | partial | Iteration 4 | Operator docs mostly use new naming; one setup-doc table advertises retired deep skill IDs. |

## Resource Map Coverage Gate

- `Entries touched`: 4 review iteration files plus the reducer-emitted review resource map were produced under `review/`; no `applied/T-*.md` reports were present for reducer-style touched-entry accounting.
- `Entries not touched`: source packet `resource-map.md` was reviewed and found to contain gaps for Gemini/Codex runtime command rows; most other map categories were not exhaustively replayed after the first active mismatches were found.
- `Implementation paths absent from resource-map`: no new implementation path absent from the map was proven; instead, the active issue is the inverse: the map marks nonexistent runtime command paths as `OK`.

## Deferred Items

- P2-001 can be addressed after the P1s if release timing requires, but it should be fixed before using install guides as setup source-of-truth.
- Reducer extraction should be investigated separately: it produced a false PASS dashboard despite iteration JSONL containing findings.
- Full command-dispatch exploitability for P1-002 depends on dispatcher placeholder escaping behavior outside the reviewed packet; remediation should either prove escaping or eliminate shell interpolation.

## Audit Appendix

### Iteration Summary

| Iteration | Dimension | Findings | Ratio | Artifact |
|-----------|-----------|----------|-------|----------|
| 001 | correctness | P1=1 | 1.0 | `review/iterations/iteration-001.md` |
| 002 | security | P1=1 | 1.0 | `review/iterations/iteration-002.md` |
| 003 | traceability | P1=1 | 1.0 | `review/iterations/iteration-003.md` |
| 004 | maintainability | P2=1 | 1.0 | `review/iterations/iteration-004.md` |

### Convergence Replay

- All configured dimensions have coverage.
- Active P1 findings remain, so legal STOP to PASS is not allowed.
- Graph convergence returned `CONTINUE` because the review coverage graph was empty; synthesis proceeds because all dimensions were manually covered and active P1s force `CONDITIONAL`.
- Stop reason: all dimensions covered with active P1 remediation required.

### Reducer / Dashboard Caveat

- `reduce-state.cjs --create-missing-anchors` succeeded but reported `openFindingsCount: 0` and generated `deep-review-dashboard.md` with `Provisional Verdict: PASS`.
- This report treats iteration files and `deep-review-state.jsonl` as authoritative because all four iteration records include explicit finding counts and `findingDetails`.
- The reducer/dashboard mismatch is not used to downgrade findings; it is recorded as an audit limitation and follow-up risk.

### Core Protocols

- `spec_code`: partial due to P1-001 and P1-003.
- `checklist_evidence`: failed due to P1-003.

### Overlay Protocols

- `feature_catalog_code`: partial due to P1-002.
- `playbook_capability`: partial due to P2-001.

### Sources Reviewed

- `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/spec.md`
- `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/tasks.md`
- `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/checklist.md`
- `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/implementation-summary.md`
- `.opencode/specs/skilled-agent-orchestration/079-sk-deep-agent-improvement/resource-map.md`
- `.opencode/commands/improve/assets/improve_improve-agent_auto.yaml`
- `.opencode/commands/improve/assets/improve_improve-agent_confirm.yaml`
- `.opencode/install_guides/SET-UP - AGENTS.md`
- `.opencode/install_guides/README.md`
- `README.md`
- `AGENTS.md`
- `.opencode/skills/deep-agent-improvement/SKILL.md`

STATUS=OK
