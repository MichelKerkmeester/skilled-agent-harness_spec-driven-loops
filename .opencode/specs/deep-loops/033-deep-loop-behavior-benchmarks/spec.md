---
title: "Phase Parent: Deep-Loop Behavioral Benchmarks"
description: "Parent packet giving each of the five deep-loop-workflows sub-skills its own durable behavior_benchmark package: what an executor model actually outputs/presents when the command surface is triggered with realistic vague/concise user prompts, whether it dispatches the required sub-agents unprompted, whether it gets stuck, and how its latency compares to a Claude baseline. Measured executors: gpt-5.5-fast medium + high via cli-opencode."
trigger_phrases:
  - "deep loop behavior benchmark"
  - "behavioral benchmark per skill"
  - "gpt vs claude command behavior"
  - "vague prompt benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase 002 pilot complete: 24 runs scored, scorecard published"
    next_safe_action: "Phase 003: land the classifier-ordering retro item, then author RSB/CXB packages"
    blockers: []
    key_files:
      - "001-framework-and-harness/decision-record.md"
      - "../031-deep-loop-issues-with-gpt-opencode/012-gpt-claude-benchmark/benchmark-results.md"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-parent-init"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Claude baseline executor: same-host opencode Anthropic model (preferred, unverified) vs cli-claude-code vs Claude Code native leg -- phase 001 probe. See 001-framework-and-harness/decision-record.md OPEN-001."
      - "Shared runner home: deep-loop-workflows/scripts/ (recommended) vs deep-loop-runtime/scripts/ -- OPEN-002."
    answered_questions:
      - "Run results live in spec packet phases, NOT in the skill packages -- skills hold scenario contracts + rubric + baselines only."
      - "Pilot on deep-review first (richest precedent), calibrate the rubric, then roll out to the other four modes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase Parent: Deep-Loop Behavioral Benchmarks

<!-- SPECKIT_LEVEL: phase -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-02 |
| **Parent Packet** | None (top-level packet under deep-loops track) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PURPOSE

Each deep-loop sub-skill already carries a `manual_testing_playbook/` (does the SYSTEM match its documented behavior, assuming a competent executor and well-formed invocations) and a `feature_catalog/` (what exists). Nothing durably measures the EXECUTOR MODEL's behavior when a command surface is triggered the way real users actually trigger it: vague or concise prompts ("can you review this?"), bare invocations with no mode suffix, natural-language asks that never name a command. Packet 031 proved this gap is real and expensive — GPT-backed executors absorbed LEAF roles instead of dispatching sub-agents, got stuck on gates, ran 3-10x slower than Claude, and enforced routing rules inconsistently — and its phase 012 benchmark proved the measurement methodology works (live dispatches, classification buckets, latency ratios). But phase 012 was a one-off packet artifact: not repeatable per skill, not versioned with the skills it tests, and not designed around realistic user prompting.

This packet ships a durable `behavior_benchmark/` package inside each of the five deep-loop-workflows sub-skills (deep-ai-council, deep-context, deep-improvement, deep-research, deep-review), plus one shared lightweight runner, so any executor model's command-triggered behavior can be measured and compared on demand. Scenarios use verbatim user-style prompts sampled across three axes — entry surface (direct command with suffix / bare / natural-language / orchestrate-routed), prompt clarity (vague / concise / fully-specified, weighted toward vague and concise), and expected interaction mode (autonomous run / combined-setup-question halt / fail-fast). Each run yields exactly one terminal classification bucket (pass, partial, setup_misbind, phase0_block, route_mismatch, role_absorption, stuck_no_progress, timeout_latency, refused, missing_artifact, crash) plus a 5-dimension score (invocation/setup, presentation fidelity, delegation correctness, completion integrity, latency vs baseline — 0/1/2 each). Delegation is verified mechanically (task events, route-proof JSONL fields, mk-deep-loop-guard signals), stuck runs are killed by a no-progress watchdog, all writes land in frozen fixtures, and latency is compared per checkpoint (time-to-first-output, time-to-setup, time-to-first-dispatch, time-to-terminal) against a Claude baseline leg. First measured executors: `openai/gpt-5.5-fast` at `--variant medium` and `--variant high` via the cli-opencode dispatch surface.

Program-level design decisions (package layout, contract/evidence separation, scoring model, fixture isolation, pilot-first ordering, single-sample policy) and the two open probes (baseline executor, runner home) are recorded in `001-framework-and-harness/decision-record.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:phases -->
## 3. PHASE DOCUMENTATION MAP

| Phase | Status | Purpose |
|-------|--------|---------|
| `001-framework-and-harness` | Complete | Scenario schema, 5-dimension rubric, 11-bucket classification taxonomy, budget + rerun policy, shared runner (spawn `opencode run --format json`, hard timeout, 120s no-progress watchdog, checkpoint + delegation-evidence extraction, fixture-isolation assertion), frozen fixture packets, and the two de-risking probes (baseline-executor availability; end-to-end smoke). Exit gate: one scenario runs end-to-end on the baseline leg producing a valid scored result JSON. |
| `002-pilot-deep-review` | Complete | Author `deep-review/behavior_benchmark/` (RVB-001..008), capture Claude baselines, run both GPT legs (16 runs), score + classify, then a calibration retro that amends the framework BEFORE rollout. deep-review pilots because it has the richest precedent (031 phase 012 tested it; this repo's fan-outs exercise it constantly). |
| `003-rollout-research-context` | Complete | Authored + baselined + ran `deep-research/behavior_benchmark/` (RSB-001..008) and `deep-context/behavior_benchmark/` (CXB-001..006) against the calibrated framework — 42 scored runs (14 baseline + 28 GPT). Headline: effort raises the floor, but the load-bearing difference is delegation INTEGRITY — gpt-high never absorbs the LEAF role (it halts honestly) where gpt-med fakes delegation. Two calibrations (`env_error` bucket + false-positive hardening) and a fixture-contamination purge landed in-flight. |
| `004-rollout-council-improvement` | Planned | Author + baseline + run `deep-ai-council/behavior_benchmark/` (ACB-001..005) and `deep-improvement/behavior_benchmark/` (IMB-001..005) — multi-seat and improvement-host dispatch shapes, most expensive modes, hardened 25min budgets, fewest scenarios (20 GPT-leg runs). |
| `005-scorecard-and-integration` | Planned | Cross-skill scorecard (5-mode x 3-executor matrix, bucket histograms, per-checkpoint latency ratios; explicitly confirm/refute packet 031's headline findings per mode), ranked remediation backlog, README/SKILL.md discoverability pointers in all five sub-skills, full-packet strict validation. |
<!-- /ANCHOR:phases -->
