---
title: "055 -- Dual-scope memory auto-surface (TM-05)"
description: "This scenario validates Dual-scope memory auto-surface (TM-05) for `055`. It focuses on Confirm auto-surface hooks."
audited_post_018: true
version: 3.6.0.16
id: retrieval-enhancements-dual-scope-memory-auto-surface-tm-05
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 055 -- Dual-scope memory auto-surface (TM-05)

## 1. OVERVIEW

This scenario validates Dual-scope memory auto-surface (TM-05) for `055`. It focuses on Confirm auto-surface hooks.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm auto-surface hooks.
- Real user request: `Please validate Dual-scope memory auto-surface (TM-05) against the documented validation surface and tell me whether the expected signals are present: Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context.`
- RCAF Prompt: `As a retrieval-enhancement validation operator, validate Dual-scope memory auto-surface (TM-05) against the documented validation surface. Verify non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: Hook triggers on non-memory tool path; compaction surfaces context-relevant memories; FAIL: Hook does not fire or surfaced memories irrelevant

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval-enhancement validation operator, validate Dual-scope memory auto-surface (TM-05) against the documented validation surface. Verify non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. invoke non-memory-aware tool path
2. trigger compaction
3. verify surfaced memories

### Expected

Non-memory-aware tool path triggers auto-surface hook; compaction event surfaces relevant memories; surfaced memories match current context

### Evidence

Command 1, non-memory-aware tool path (`glob`):

```text
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual-testing-playbook/retrieval-enhancements/dual-scope-memory-auto-surface-tm-05.md
```

Observed result: the non-memory-aware `glob` tool returned only the matched file path. It did not return an auto-surface hook trace or surfaced memory list.

Memory hook/status observation (`mk_spec_memory_status`):

```text
plugin_id=mk-spec-memory
enabled=true
disabled_reason=none
cache_ttl_ms=5000
max_brief_chars=2400
max_cache_entries=200
runtime_ready=false
node_binary=node
bridge_timeout_ms=3000
cli_timeout_ms=2500
bridge_path=[spec-memory-bridge]
last_bridge_status=fail_open
last_error_code=EXIT_69
last_duration_ms=68
bridge_invocations=6
continuity_lookups=5
cache_entries=0
cache_hits=0
cache_misses=5
cache_hit_rate=0
warm_status=fail_open
warm_error=EXIT_69
warm_route=cli
warm_retryable=false
warm_exit_code=69
```

Memory trigger observation from the required gate call (`memory_match_triggers`):

```json
{
  "summary": "No matching trigger phrases found",
  "data": {
    "count": 0,
    "results": [],
    "matchType": "trigger-phrase",
    "meta": {
      "autoSurface": {
        "constitutionalCount": 10,
        "triggeredCount": 5,
        "surfaced_at": "2026-07-02T20:15:11.497Z",
        "latencyMs": 981
      }
    }
  }
}
```

Surfaced memory list from the same `memory_match_triggers` output:

```text
constitutional:
- id 38292: GOAL PROMPTING — Runtime-Specific: Claude Code Native vs OpenCode mk-goal Plugin
- id 21863: CLI DISPATCH — Skill Preload Mandate
- id 18041: Recursion Control — Reason About the Problem, Audit Once, Don't Narrate the Self
- id 18040: POST-IMPLEMENTATION DEEP-REVIEW — Mandatory after substantive ship
- id 18039: Fable-5 Governor — Reason Outward, Act, Commit, Qualify Minimally
- id 18038: DEEP SKILLS — Use the Workflow, Never Hand-Roll
- id 16266: Baseline Before No-Regressions; Report the Delta
- id 16265: Main Branch — Owner's AIs Push Directly
- id 16264: TOOL ROUTING - Search & Retrieval Decision Tree
- id 16263: A Finding Is a Hypothesis Until You Open the Cited Code

triggered:
- memory_id 7170: Featur [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/088-speckit-known-limitations-remediation/spec]
- memory_id 7162: Spec 089 [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/089-speckit-reimagined-refinement/spec]
- memory_id 7158: Decision [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/087-speckit-deep-analysis/decision-record]
- memory_id 7156: Dec [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/089-speckit-reimagined-refinement/decision-record]
- memory_id 7145: Feature Specification [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/087-speckit-deep-analysis/spec]
```

Command 2, trigger compaction: BLOCKED. No compaction-trigger operation is exposed in the available runtime tool surface, and the playbook does not specify an executable command for causing a real compaction event.

Command 3, verify surfaced memories: PARTIAL. The memory gate output did surface 10 constitutional and 5 triggered memories, but the required compaction-event surfaced memories could not be produced for relevance verification.

### Pass / Fail

- **BLOCKED**: Required compaction event could not be triggered because no compaction-trigger operation is exposed in the available runtime tool surface; the non-memory-aware `glob` path also returned no auto-surface hook trace.

### Failure Triage

Verify auto-surface hook registration → Check compaction trigger logic → Inspect context matching for surfaced memories

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [retrieval-enhancements/dual-scope-memory-auto-surface.md](../../feature-catalog/retrieval-enhancements/dual-scope-memory-auto-surface.md)

---

## 5. SOURCE METADATA

- Group: Retrieval Enhancements
- Playbook ID: 055
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval-enhancements/dual-scope-memory-auto-surface-tm-05.md`
