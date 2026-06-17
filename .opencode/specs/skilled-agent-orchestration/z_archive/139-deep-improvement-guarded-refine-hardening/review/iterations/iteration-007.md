# Iteration 7 — Traceability Overlay Protocols

## Dimension

traceability (deep pass 2: OVERLAY protocols)

## Files Reviewed

- `.opencode/skills/deep-improvement/SKILL.md:32-38` (lane table)
- `.opencode/agents/deep-improvement.md:46` (lane awareness paragraph)
- `.claude/agents/deep-improvement.md:46` (lane awareness paragraph)
- `.opencode/skills/deep-improvement/feature_catalog/06--non-dev-ai-system/guarded-refine-loop.md:20,52,56`
- `.opencode/skills/deep-improvement/manual_testing_playbook/11--non-dev-ai-system/synthetic-deficit-and-gauntlet.md:16,26,28`
- `.opencode/skills/deep-improvement/references/non_dev_ai_system/loop_contract.md:51,65-73`
- `Barter/Copywriter/_loop/loop.py:529,560,564,573,577`
- `Barter/Copywriter/_loop/gauntlet.py:1-19,69-156`
- `.opencode/skills/deep-improvement/scripts/non-dev-ai-system/run-non-dev-ai-system.cjs`
- `.opencode/skills/deep-improvement/scripts/shared/loop-host.cjs:44,76-78`

## Traceability Checks

### (a) skill_agent — PASS

SKILL.md lane table (lines 32–38) and agents/deep-improvement.md lane-awareness paragraph (line 46) agree on all four lanes:

| Aspect | SKILL.md | Agent file | Match |
|--------|----------|------------|-------|
| Lane A mode id | agent-improvement | agent-improvement | ✅ |
| Lane A command | /deep:start-agent-improvement-loop | /deep:start-agent-improvement-loop | ✅ |
| Lane B mode id | model-benchmark | model-benchmark | ✅ |
| Lane B command | /deep:start-model-benchmark-loop | /deep:start-model-benchmark-loop | ✅ |
| Lane B script | scripts/shared/loop-host.cjs --mode=model-benchmark | scripts/shared/loop-host.cjs --mode=model-benchmark | ✅ |
| Lane C mode id | skill-benchmark | skill-benchmark | ✅ |
| Lane C command | /deep:start-skill-benchmark-loop | /deep:start-skill-benchmark-loop | ✅ |
| Lane C script | scripts/shared/loop-host.cjs --mode=skill-benchmark | scripts/shared/loop-host.cjs --mode=skill-benchmark | ✅ |
| Lane D mode id | non-dev-ai-system-refine | non-dev-ai-system-refine | ✅ |
| Lane D command | /deep:start-non-dev-ai-system-loop | /deep:start-non-dev-ai-system-loop | ✅ |
| Lane D script | scripts/shared/loop-host.cjs --mode=non-dev-ai-system-refine | scripts/shared/loop-host.cjs --mode=non-dev-ai-system-refine | ✅ |

No post-rename drift. All mode ids, command names, and script paths are consistent.

### (b) agent_cross_runtime — PASS

`.opencode/agents/deep-improvement.md` (251 lines) and `.claude/agents/deep-improvement.md` (251 lines) are byte-for-byte identical. Zero drift.

### (c) feature_catalog_code — PASS with advisory

Feature catalog (`guarded-refine-loop.md`) vs actual code (`loop.py`, `gauntlet.py`, `run-non-dev-ai-system.cjs`, `loop-host.cjs`):

| Catalog claim | Code evidence | Verdict |
|---------------|---------------|---------|
| Adapter decides --dry-run vs --run based on --live | run-non-dev-ai-system.cjs:84-88 | ✅ |
| Frozen scoring surface content-hashed | gates.py:34-35, 89-94 | ✅ |
| Different-family grader enforced | loop.py:211-213 | ✅ |
| N-sample averaging (LOOP_SAMPLES default 3) | loop.py:50, 266-287 | ✅ |
| Worktree isolation | loop.py:592-606 | ✅ |
| Kill-switches: scoring-surface drift, derived-copy drift, grader-family, HVR lint, floor breach, held-out regression, iteration ceiling | loop.py:93-103, 216-224, 409-431 | ✅ |
| Pilot: synthetic-deficit promote_accept | loop.py:432, 560-564, 573-577 | ✅ |
| "gauntlet passes 10/10 dispatch-free" | gauntlet.py: A1-A9 = 9 attacks | ⚠️ P2 advisory |

### (d) playbook_capability — PASS with advisory

Playbook (`synthetic-deficit-and-gauntlet.md`) vs actual code:

| Playbook claim | Code evidence | Verdict |
|----------------|---------------|---------|
| Dry-run command: `loop-host.cjs --mode=non-dev-ai-system-refine --packaging-root <path>` | loop-host.cjs:24-27, run-non-dev-ai-system.cjs:88 | ✅ |
| Gauntlet command: `python3 _loop/gauntlet.py` | gauntlet.py:19 | ✅ |
| Dry-run exits 0, zero dispatches | loop.py:452-473 (--dry-run default) | ✅ |
| Gauntlet exits 0 with `10/10 PASSED` | gauntlet.py:163 prints N/N passed (actual: 9/9) | ⚠️ P2 advisory |
| Live run journals promote_accept | loop.py:432, 560, 564 | ✅ |
| Worktree cleanup on kill-switch | loop.py:600-606, gauntlet.py:120-130 (A7) | ✅ |

## Re-verification: Iteration 3 Claims

### LOOP_SKIP_PROBE in loop_contract.md

**Iteration 3 claim**: loop_contract.md missing LOOP_SKIP_PROBE.
**Current state**: LOOP_SKIP_PROBE is documented at loop_contract.md:51. **Claim resolved** — the env knob is present in the contract's env knobs table.

### promote_skip in loop_contract.md

**Iteration 3 claim**: loop_contract.md missing promote_skip.
**Current state**: loop_contract.md §4 journal events (lines 53–75) lists `promote_accept` and `promote_reject` but does NOT list `promote_skip`. However, `promote_skip` is used in the actual loop.py template (loop.py.template:560, 564) and in the pilot implementation (loop.py:573, 577). **Claim still valid** — the journal events table is incomplete; `promote_skip` is a real journal event that should be documented.

## Findings by Severity

### P0

(none)

### P1

(none)

### P2

#### R7-P2-001: Gauntlet attack count documented as 10/10 but code implements 9 (A1-A9)

- **File**: `gauntlet.py:1-19`, `feature_catalog/06--non-dev-ai-system/guarded-refine-loop.md:56`, `manual_testing_playbook/11--non-dev-ai-system/synthetic-deficit-and-gauntlet.md:16,26,28`
- **Evidence**: gauntlet.py defines attacks A1 through A9 (frozen-surface edit, derived-copy drift, same-family grader, unmeasurable held-out, HVR violation, synonym laundering, KillSwitch mid-promotion, dirty knowledge base, concurrent run/stale lock). The docstring says "10 attack categories" (line 3) but only 9 are coded. The feature catalog claims "passes 10/10 dispatch-free" (line 56). The playbook claims "gauntlet passes 10/10 dispatch-free" (line 16) and expected output says "10/10 PASSED" (line 26).
- **Severity**: P2 (documentation overclaim; no code defect)
- **Confidence**: 0.95

#### R7-P2-002: promote_skip missing from loop_contract.md journal events table

- **File**: `loop_contract.md:53-75`
- **Evidence**: The journal events table lists `promote_accept` (line 65) and `promote_reject` (line 65) but omits `promote_skip`. The actual code uses `promote_skip` in two places: held-out unmeasurable (loop.py.template:560, loop.py:573) and proposer dispatch failure (loop.py.template:564, loop.py:577). The guardrails_teachings.md and operator_guide.md also do not mention `promote_skip`.
- **Severity**: P2 (contract documentation gap; code behavior is correct)
- **Confidence**: 0.92

## Verdict

**PASS-candidate** with `hasAdvisories=true` (2 P2 findings, both documentation overclaims).

## Next Dimension

Composite vote reached STOP candidate at iter 6. Graph convergence says CONTINUE. Stuck count = 1 (ratio 0.0). If no new dimensions emerge, this is the terminal iteration.
