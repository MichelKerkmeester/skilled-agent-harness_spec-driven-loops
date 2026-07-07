---
title: "Spec: 022/004b Skill-Advisor Interface + Env-Vars + Prompt-Policy"
description: "cli-opencode + deepseek-v4-pro --variant high dispatched waves 2-4: RoutingCalibration interface expansion, env-var overrides (SPECKIT_ADVISOR_*), prompt-policy externalization to JSON. 9 P1 + 2 P2 closed. Bundle gate PASSED."
trigger_phrases: ["022/004b skill-advisor interface env-vars", "prompt-policy JSON config"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/007-skill-advisor-embedder-stack/008-skill-advisor-interface-and-env-vars"
    last_updated_at: "2026-05-23T18:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 004b shipped via cli-opencode dispatch"
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
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022a1"
      session_id: "016-002-022-004b"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["4 pre-existing vitest failures in corpus-parity + lane-weight-sweep — confirmed pre-existing via git stash; zero new failures from 004b"]
    answered_questions: ["WAVE 2/3/4 all PASS via cli-opencode dispatch; WAVE 3 lane-weights-json env var skipped (lane-registry.ts has no extension point; hardcoded in SCORER_LANE_REGISTRY)"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/004b Skill-Advisor Interface + Env-Vars + Prompt-Policy

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Type | cli-opencode + deepseek-v4-pro --variant high dispatch (atomic 3-wave) |
| Owner | cli-opencode dispatch via PID 31167 (10:27 elapsed) |
| Parent | `../spec.md` |
| Predecessor | `../004a-skill-advisor-compat-contract-consolidation/` (Wave 1 — 14 P0) |
| Findings closed | 9 P1 + 2 P2 (waves 2-4 from packet 021 audit) |
| Bundle gate | PASS — typecheck exit 0; 4 pre-existing vitest failures confirmed pre-existing via git stash |
| Wall-clock | ~10 min cli-opencode dispatch (background) |
| Risk class | MEDIUM (multi-file interface expansion + env-var wiring + JSON config externalization) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Phase 004a closed the 14 P0 inline-literal consolidation. Phase 004b closes the remaining 11 audit findings (9 P1 + 2 P2) via 3 waves:

**Wave 2:** `RoutingCalibration` interface (scoring-constants.ts:106-140) lacked typed slots for 3 inline bonus/penalty literals in fusion.ts:280-295 (memory:save → 0.55, create:agent → 0.55, create:testing-playbook → 0.65). Without the typed slot, threshold tuning required code edits not config changes.

**Wave 3:** No env-var override path for confidence/uncertainty thresholds or routing calibration. SPECKIT_ADVISOR_* convention existed for alert thresholds + shadow vars but not for the core scorer thresholds.

**Wave 4:** `prompt-policy.ts` (225 lines) had 5 hardcoded linguistic sets (EXACT_SKIP_COMMANDS, CASUAL_ACKNOWLEDGEMENTS, etc.) and 5 numerical fire/no-fire thresholds, none of which were operator-tunable.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (delivered by cli-opencode dispatch)

**Wave 2:** RoutingCalibration interface expansion + fusion.ts wiring.
**Wave 3:** env-var overrides via `resolvedConfidenceThreshold()` / `resolvedUncertaintyThreshold()` helpers in compat/contract.ts; SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD + SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD + SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON env vars wired to consumers (prompt-cache.ts, render.ts, subprocess.ts, skill-advisor-brief.ts).
**Wave 4:** new `mcp_server/data/prompt-policy.default.json` (91 lines, 1486 bytes) with 5 linguistic sets + 5 fire/no-fire thresholds; prompt-policy.ts loads from JSON at module init; `SPECKIT_ADVISOR_PROMPT_POLICY_PATH` env var for override; 5 new `SPECKIT_ADVISOR_PROMPT_POLICY_*` numerical override env vars.

### Out of Scope (documented skip)

- `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` — skipped per dispatch self-report. lane-registry.ts has no env-var extension point; SCORER_LANE_REGISTRY is hardcoded. Adding this requires structural refactor beyond 004b scope; can be addressed in a follow-on.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | RoutingCalibration interface has 3 expanded bonus/penalty fields | `grep -n memorySaveBonus\|createAgentBonus\|testingPlaybookBonus scoring-constants.ts` ≥ 3 |
| R2 | fusion.ts no longer has inline `return 0.55\|return 0.65` for those 3 routes | `rg "return 0\.55\|return 0\.65" fusion.ts` → 0 hits |
| R3 | resolvedConfidenceThreshold + resolvedUncertaintyThreshold exported from contract.ts | grep |
| R4 | 9 new SPECKIT_ADVISOR_* env vars wired across consumers | per dispatch self-report |
| R5 | mcp_server/data/prompt-policy.default.json exists with 5 sets + 5 thresholds | `ls + wc -l` |
| R6 | system-spec-kit typecheck:root exit 0 | npm run typecheck:root |
| R7 | Pre-existing test failures unchanged (no new vitest failures introduced) | dispatch self-report + `git stash` confirmation |
| R8 | Strict-validate phase 004b exit 0 | validate.sh --strict |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

R1–R8 pass. 9 P1 + 2 P2 closed. Lane-weights env var documented as out-of-scope follow-on.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

cli-opencode + deepseek-v4-pro --variant high atomic 3-wave dispatch with HALT-on-failure-per-wave + post-wave verification + bundle gate. PID 31167; ~10 min wall-clock. Prompt at `/tmp/004b-prompt.md`; output log at `/tmp/004b-out.log` (213 lines on completion). Self-reported PHASE 004B STATUS block:

```
- WAVE 2: PASS
- WAVE 3: PASS (SPECKIT_ADVISOR_LANE_WEIGHTS_JSON skipped — documented)
- WAVE 4: PASS
- typecheck: exit 0
- Files changed: 10 (9 modified + 1 new)
- Env vars added: 9
- JSON config created: yes
- Bundle gate: PASS
```
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| `resolvedConfidenceThreshold()` env-var parsing crashes on bad input | Dispatch implemented try/catch + warning + fallback to defaults |
| JSON config file missing at runtime | Module init falls back to bundled defaults if file unreadable |
| Pre-existing vitest failures attributed to 004b | Dispatch confirmed via `git stash` — same failures exist on HEAD~1 (unchanged) |
| Lane-weights env var skipped | Documented in spec scope; follow-on packet can address |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Lane-weights JSON override env var (deferred follow-on; lane-registry.ts needs structural refactor to expose extension point).
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Parent arc: `../spec.md`
- Predecessor: `../004a-skill-advisor-compat-contract-consolidation/` (Wave 1)
- Council brief: `../ai-council/executor-instructions.md` §Phase 004 (full atomic plan; 004b implements waves 2-4)
- Audit: f-iter004-015..025 (9 P1 + 2 P2)
- Dispatch prompt: `/tmp/004b-prompt.md`
- Dispatch output: `/tmp/004b-out.log` (213 lines)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

- Behavior preserved when env vars unset (defaults match prior literal values)
- JSON config loaded at module init (one-time read; no per-call overhead)
- TypeScript strict-mode preserved
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- `SPECKIT_ADVISOR_PROMPT_POLICY_PATH` pointing to non-existent file → fallback to bundled defaults
- `SPECKIT_ADVISOR_CALIBRATION_OVERRIDE_JSON` malformed JSON → log warning, fallback
- Wave 3 SPECKIT_ADVISOR_LANE_WEIGHTS_JSON intentionally skipped
- 4 pre-existing vitest failures in corpus-parity + lane-weight-sweep exist independently of 004b changes
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2+ multi-file refactor via cli-opencode dispatch. 9 modified + 1 new file. 9 new env vars. New JSON config externalization pattern.
<!-- /ANCHOR:complexity -->
