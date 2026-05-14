---
title: "002 rerun-24-scenarios-suite (validate post-fix substrate)"
description: "Re-run the full 15-scenario suite in `manual_testing_playbook/24--local-llm-query-intelligence/` after Wave 1 lands. Produce a real PASS/FAIL distribution against the post-fix substrate."
trigger_phrases:
  - "rerun 24 scenarios suite post-032"
  - "post-fix substrate validation"
  - "kimi-k2.6 24-- scenario run"
  - "post-022 scenario re-run"
importance_tier: "important"
status: "planned"
---

# 002 — Re-run 24-- scenarios suite

## Goal

Execute all 15 scenarios in `manual_testing_playbook/24--local-llm-query-intelligence/` (401-415) via cli-opencode + kimi-k2.6 against the post-fix substrate (post-001 governance decouple + post-003 clean build). Produce a real PASS/FAIL distribution that measures the actual local-LLM substrate quality, not E081 substrate-failure noise.

## Pre-flight gate (REQUIRED before running)

1. Confirm `memory_health` shows:
   - `embeddingProvider.healthy === true` OR
   - `circuitBreakerOpen === false` AND `queueDepth < 100`
   - State stable for at least 5 minutes (no recent circuit flap)
2. If not stable: dial `SPECKIT_RETRY_BATCH_SIZE` from 25 → 10 in `.env.local`, restart the Memory MCP daemon, wait 5 min, recheck.
3. Confirm at least 1 external CLI (codex / kimi / gemini / claude) is installed for cross-AI scenarios (414, 415).
4. Confirm 001 (governance decouple) has landed: `memory_save({filePath, retentionPolicy: "ephemeral"})` succeeds without other governance fields.

## Execution

Use the proven kimi-k2.6 runner pattern from `/tmp/run-24-search-only.sh` (referenced via this session's `run-2026-05-14-kimi-k2.6.md` evidence). One opencode dispatch per scenario, sequential. The runner script is committed at `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.sh` (codex creates the updated runner script as part of its dispatch).

Per scenario:
- Read the scenario `.md` file from the playbook
- Execute the TEST EXECUTION section using real MCP tools
- Apply pass/fail per the scenario's section 2 criteria
- Cleanup sandbox memories via `memory_delete` by parent_id
- Capture: verdict (PASS/PARTIAL/FAIL/SKIP) + key metric + 2-3 sentence detail

Final report at: `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14b-post-032.md`

## Acceptance criteria

1. All 15 scenarios attempted (no abort mid-suite).
2. At least 8 of 15 result in PASS or PARTIAL (real substrate quality signal, not universal E081 failure).
3. Save-heavy scenarios (401, 411, 412, 413, 414, 415) round-trip successfully — save + search + delete cycle completes for each, indicating end-to-end substrate health.
4. The report includes:
   - Substrate state at start (via memory_health)
   - Substrate state at end
   - Per-scenario verdict + metric + 2-3 sentence detail
   - PASS/PARTIAL/FAIL/SKIP counts
   - Overall finding (2-3 sentences)
5. `implementation-summary.md` summarizes the run + lists any anomalies + verdict ratio.

## Out of scope

- Fixing scenarios that legitimately FAIL due to local-LLM quality limits (those become findings for separate work).
- Re-running individual failed scenarios with different prompts (one shot per scenario only).
- Modifying scenario `.md` files (already cleaned in Fix 3).
