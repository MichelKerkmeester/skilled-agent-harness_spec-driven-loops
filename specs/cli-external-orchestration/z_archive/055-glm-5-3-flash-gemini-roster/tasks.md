---
title: "Tasks: GLM-5.3-Flash + Gemini 3.7 Flash on the CLI OpenRouter roster"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "glm-5.3-flash gemini roster"
  - "retire ox-alpha glm gemini"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/055-glm-5-3-flash-gemini-roster"
    last_updated_at: "2026-08-27T07:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All tasks complete; live-verified GLM-5.3-Flash + Gemini 3.7 Flash (PONG)"
    next_safe_action: "None — committed and pushed"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-055-glm-5-3-flash-gemini"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: GLM-5.3-Flash + Gemini 3.7 Flash on the CLI OpenRouter roster

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verify OpenRouter slugs + tiers live [evidence: `opencode models openrouter --verbose` — `z-ai/glm-5.3-flash` reasoning variants low/high/max, `google/gemini-3.7-flash` reasoning variants low/medium/high]
- [x] T002 Verify opencode-go + Cline slugs [evidence: `opencode models opencode-go` lists `opencode-go/glm-5.3-flash`; Cline id `z-ai/glm-5.3-flash` from `~/.cline/data/logs/cline.log` + `providers.json`]
- [x] T003 Locate fan-out enforcement points + guard assertions [evidence: `PI_SUPPORTED_MODELS` (executor-config.ts), `PI_ALLOWED_MODELS`/`PI_MODEL_PROVIDERS` + `isFlashMaxPinnedModel` (fanout-run.cjs), 2 guard tests]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Retire ox-alpha + add glm/gemini rows in cli-opencode `providers-and-models.md` (OpenRouter callout/table + opencode-go glm row) [evidence: 3-model callout; glm/gemini rows; ox-alpha row gone]
- [x] T005 Fix cli-opencode `SKILL.md` "OpenRouter routes DeepSeek only" → three-model allowlist [evidence: lines 188/230 updated]
- [x] T006 Retire ox-alpha + add glm/gemini rows in cli-pi `providers-and-models.md` (OpenRouter + opencode-go + Cline sections) [evidence: 3-model callout; Cline row ox-alpha→glm-5.3-flash; default note updated]
- [x] T007 `.pi/models.json` cline-pass model `x-ai/ox-alpha` → `z-ai/glm-5.3-flash` [evidence: JSON valid; 1.31M context]
- [x] T008 `.pi/settings.json` `defaultModel` → `z-ai/glm-5.3-flash`; enabledModels swap [evidence: JSON valid; no ox-alpha id; 4 new ids]
- [x] T009 `PI_SUPPORTED_MODELS` roster swap + extend `isFlashMaxPinnedModel` to GLM-5.3-Flash (`executor-config.ts`) [evidence: roster + pin regex updated]
- [x] T010 Mirror `PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS` map + pin regex (`fanout-run.cjs`) [evidence: `node --check` ok; provider map has z-ai/glm-5.3-flash→openrouter, google/gemini-3.7-flash→openrouter, glm-5.3-flash→opencode-go]
- [x] T011 Swap guard-test expectations (roster assertion + max-pin cases + `providerByModel`) [evidence: 203 passed / 0 failed]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Unit tests + typecheck [evidence: `executor-config.vitest.ts` + `fanout-run.vitest.ts` = 203 passed / 0 failed; `tsc --noEmit` 0 new errors in touched files]
- [x] T013 Stray-id sweep [evidence: `rg -in "ox[ _-]?alpha"` over enforcement points returns only historical "replaces the retired Ox Alpha route" provenance notes, no live model id]
- [x] T014 Live OpenRouter dispatches [evidence: `opencode run --model openrouter/z-ai/glm-5.3-flash --variant max` → PONG; `…/google/gemini-3.7-flash --variant high` → PONG; `pi -p --model openrouter/z-ai/glm-5.3-flash --thinking max` → PONG]
- [x] T015 Spec docs + metadata + strict validate [evidence: 5 docs + `description.json`/`graph-metadata.json`; `validate.sh --strict` Errors:0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: T001–T015 complete]
- [x] No `[B]` blocked tasks remaining [evidence: `grep '\[B\]' tasks.md` returns nothing]
- [x] Tests green + live dispatch verified [evidence: 203 passed; real PONG on both new OpenRouter models via cli-opencode and cli-pi]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
