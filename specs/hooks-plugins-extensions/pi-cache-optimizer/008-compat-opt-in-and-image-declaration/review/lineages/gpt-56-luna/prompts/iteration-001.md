---
title: Deep Review Iteration 001 Prompt
description: Inline autonomous broad review prompt for the detached fan-out lineage.
---

# Inline Review Iteration 001

Review target: specs/hooks/021-compat-opt-in-and-image-declaration
Review target type: spec-folder
Review dimensions: correctness, security, traceability, maintainability
Session: fanout-gpt-56-luna-1789146937931-6gxjep
Executor binding: cli-codex model=gpt-5.6-luna
Execution mode: AUTONOMOUS
Lineage mode: auto

The executor-dispatch step is satisfied by this process. Perform the review inline. Do not
dispatch another CLI, agent, subprocess, or task. Read the target sources and evidence, identify
verified and inferred claims, and write the iteration result and its delta under this lineage.

Required protocols:

- Core spec_code and checklist_evidence.
- Applicable overlay feature_catalog_code and playbook_capability.
- skill_agent and agent_cross_runtime are not applicable to this spec-folder target.

Required breadth:

- Trace the startup notification path and all callers of the changed compatibility helpers.
- Check security and scope boundaries, especially credential redaction and write surfaces.
- Compare claims in spec.md, plan.md, tasks.md, and implementation-summary.md with source and evidence.
- Challenge test non-vacuity, live-probe claims, and maintenance/documentation drift.

Convergence before the cap is telemetry only. Synthesis must occur after iteration 1 with
stopReason maxIterationsReached.

