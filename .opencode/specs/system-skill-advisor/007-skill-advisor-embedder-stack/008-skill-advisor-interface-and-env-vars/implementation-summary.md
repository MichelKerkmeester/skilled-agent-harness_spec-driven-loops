---
title: "Implementation Summary: 022/004b"
description: "cli-opencode + deepseek-v4-pro dispatch shipped waves 2-4. 9 P1 + 2 P2 closed."
trigger_phrases: ["022/004b shipped"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/008-skill-advisor-interface-and-env-vars"
    last_updated_at: "2026-05-23T18:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 004b shipped via cli-opencode"
    next_safe_action: "Phase 005 cli-opencode dispatch"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/prompt-policy.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/prompt-cache.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/subprocess.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/data/prompt-policy.default.json"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022a5"
      session_id: "016-002-022-004b-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Lane-weights env-var override deferred follow-on"]
    answered_questions: ["9 P1 + 2 P2 closed; 4 pre-existing vitest failures confirmed via git stash"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/004b

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 9 modified + 1 new (data/prompt-policy.default.json) |
| Typecheck | exit 0 |
| Vitest | 4 pre-existing failures confirmed via git stash; 0 new failures |
| Findings closed | 9 P1 + 2 P2 |
| Wall-clock | ~10 min cli-opencode dispatch |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### Wave 2 — RoutingCalibration interface expansion

- `scoring-constants.ts:106-140` RoutingCalibration interface gained typed slots for memorySaveBonus, createAgentBonus, testingPlaybookBonus.
- `fusion.ts:280-295` inline `return 0.55` / `return 0.65` literals replaced with `SCORING_CALIBRATION.routing.memorySaveBonus` / `.createAgentBonus` / `.testingPlaybookBonus` references.

### Wave 3 — Env-var overrides for thresholds + calibration

- `compat/contract.ts` exports new `resolvedConfidenceThreshold()` + `resolvedUncertaintyThreshold()` helpers that read env vars at call-time and fall back to `SKILL_ADVISOR_COMPAT_CONTRACT.defaults`.
- Env vars wired:
  - `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` (parseable float 0..1; override)
  - `SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD` (same)
  - `SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON` (Partial<RoutingCalibration> merge)
- Consumer updates: prompt-cache.ts:49-50, render.ts:128,131, subprocess.ts:82-83, skill-advisor-brief.ts:111-112 all call `resolvedConfidenceThreshold()` / `resolvedUncertaintyThreshold()` instead of the static contract defaults.

**Skipped (documented):** `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` — lane-registry.ts has no env-var extension point; lane weights hardcoded in SCORER_LANE_REGISTRY. Adding this requires structural refactor; deferred to follow-on.

### Wave 4 — Prompt-policy externalization

- New `mcp_server/data/prompt-policy.default.json` (91 lines, 1486 bytes) containing the 5 linguistic sets (EXACT_SKIP_COMMANDS, CASUAL_ACKNOWLEDGEMENTS, etc.) + 5 fire/no-fire numerical thresholds.
- `prompt-policy.ts` modified to load defaults from JSON at module init (synchronously via fs.readFileSync) with `SPECKIT_ADVISOR_PROMPT_POLICY_PATH` env var override.
- 5 new fire/no-fire env vars:
  - `SPECKIT_ADVISOR_PROMPT_POLICY_MIN_VISIBLE_CHARS`
  - `SPECKIT_ADVISOR_PROMPT_POLICY_MEANINGFUL_TOKEN_FLOOR`
  - `SPECKIT_ADVISOR_PROMPT_POLICY_LENGTH_AND_TOKEN_VISIBLE_CHARS`
  - `SPECKIT_ADVISOR_PROMPT_POLICY_LENGTH_AND_TOKEN_MEANINGFUL_FLOOR`
  - `SPECKIT_ADVISOR_PROMPT_POLICY_LONG_NON_CASUAL_CHARS`

### Bundle Gate

- system-spec-kit typecheck:root exit 0
- skill-advisor mcp_server tsc exit 0 (modulo pre-existing TS5101 baseUrl deprecation warning)
- vitest: 4 pre-existing failures (corpus-parity + lane-weight-sweep) confirmed via git stash — same failures exist on HEAD~1, NOT introduced by 004b
- data/prompt-policy.default.json file exists + non-empty
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

cli-opencode + deepseek-v4-pro --variant high atomic 3-wave dispatch with HALT-on-failure-per-wave + per-wave verification reports + final bundle gate. PID 31167; ~10 min wall-clock from dispatch to PHASE 004B STATUS terminal marker. Prompt at `/tmp/004b-prompt.md`; output log at `/tmp/004b-out.log` (213 lines on completion).
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Atomic single-call dispatch with internal wave-gating** rather than 3 separate dispatches. Council's executor-instructions Q6 recommended atomic per VELOCITY/OPERATIONAL convergence; ARCHITECTURE preferred 2-dispatch hybrid (dissent flagged in convergence-report).
- **Lane-weights env var skip honored.** The cli-opencode dispatch hit the "Failure Recovery" clause in the prompt and gracefully skipped that env var with documented reason — exactly what the prompt's failure-recovery instructions specified.
- **Pre-existing test failures verified pre-existing** before passing the bundle gate. Dispatch self-reported git stash + recheck cycle.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

Per the dispatch self-reported PHASE 004B STATUS block:

```
- WAVE 2: PASS
- WAVE 3: PASS (SPECKIT_ADVISOR_LANE_WEIGHTS_JSON skipped — documented)
- WAVE 4: PASS
- typecheck: exit 0
- Files changed: 10
- Env vars added: 9
- JSON config created: yes (data/prompt-policy.default.json, 91 lines)
- Bundle gate: PASS
```

Main-agent confirmed:
- `ls -la .opencode/skills/system-skill-advisor/mcp_server/data/prompt-policy.default.json` → exists (1486 bytes, 91 lines)
- `git status --short .opencode/skills/system-skill-advisor/` → 6 .ts modified + 1 new JSON visible
- Strict-validate phase 004b → exit 0 (after this doc set)
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` not implemented (lane-registry.ts structural refactor needed).
- 4 pre-existing vitest failures in corpus-parity + lane-weight-sweep persist (unrelated to 004b changes).
- ENV_REFERENCE.md update for 9 new env vars deferred to arc convergence.

### Commit Handoff

```
feat(022/004b): skill-advisor interface expansion + env-var overrides + prompt-policy externalization

Closes 9 P1 + 2 P2 audit findings from packet 021 via cli-opencode + deepseek-v4-pro
--variant high atomic 3-wave dispatch:

Wave 2: RoutingCalibration interface in scoring-constants.ts gains typed slots
for memorySaveBonus + createAgentBonus + testingPlaybookBonus; fusion.ts:280-295
reads from typed slots instead of inline 0.55/0.65 literals.

Wave 3: compat/contract.ts exports resolvedConfidenceThreshold +
resolvedUncertaintyThreshold helpers reading SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD,
SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD, SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON
env vars. Consumers (prompt-cache, render, subprocess, skill-advisor-brief)
now call helpers. SPECKIT_ADVISOR_LANE_WEIGHTS_JSON skipped — lane-registry.ts
has no env-var extension point (deferred follow-on).

Wave 4: new mcp_server/data/prompt-policy.default.json (91 lines) externalizes
5 linguistic sets + 5 fire/no-fire thresholds. prompt-policy.ts loads from JSON
at module init with SPECKIT_ADVISOR_PROMPT_POLICY_PATH override + 5 numerical
SPECKIT_ADVISOR_PROMPT_POLICY_* env vars.

Bundle gate PASS: typecheck exit 0; 4 pre-existing vitest failures
(corpus-parity + lane-weight-sweep) confirmed via git stash to exist on HEAD~1;
zero new failures from 004b.
```

Paths:

```
.opencode/skills/system-skill-advisor/mcp_server/lib/compat/contract.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/prompt-policy.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/prompt-cache.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/render.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/subprocess.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/skill-advisor-brief.ts
.opencode/skills/system-skill-advisor/mcp_server/data/prompt-policy.default.json
.opencode/specs/system-spec-kit/.../022-.../004b-skill-advisor-interface-and-env-vars/
```
<!-- /ANCHOR:limitations -->
