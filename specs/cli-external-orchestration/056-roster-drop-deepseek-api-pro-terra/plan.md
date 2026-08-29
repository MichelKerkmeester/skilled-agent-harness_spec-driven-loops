---
title: "Implementation Plan: Drop DeepSeek API provider, V4 Pro, and GPT-5.6 Terra from the cli-pi / cli-opencode rosters"
description: "Remove the direct DeepSeek API provider, every DeepSeek V4 Pro entry, and every GPT-5.6 Terra slug from both CLI rosters, playbooks, and the deep-loop cli-pi fan-out enforcement, with the default model repointed to opencode-go/deepseek-v4-flash and guard tests updated."
trigger_phrases:
  - "drop deepseek api pro terra plan"
  - "remove deepseek provider roster"
  - "opencode-go default deepseek flash plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/056-roster-drop-deepseek-api-pro-terra"
    last_updated_at: "2026-08-29T10:35:00Z"
    last_updated_by: "pi"
    recent_action: "Documented the retirement plan (rosters + playbooks + fan-out enforcement)"
    next_safe_action: "None — implementation complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-056-roster-drop-deepseek-api-pro-terra"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Drop DeepSeek API provider, V4 Pro, and GPT-5.6 Terra from the cli-pi / cli-opencode rosters

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript/CommonJS (deep-loop runtime) + Markdown skill docs |
| **Framework** | vitest |
| **Storage** | None (docs + runtime lists) |
| **Testing** | `npx vitest run` + grep sweep + `node --check` |

### Overview
Retire three dispatch targets — the direct DeepSeek API provider, DeepSeek V4 Pro in every form, and GPT-5.6 Terra in every slug — from the cli-pi and cli-opencode rosters, their playbooks and examples, and the deep-loop fan-out enforcement that mirrors the pi roster. The cli-opencode default moves to `opencode-go/deepseek-v4-flash --variant max`; the fan-out default mirrors it as the bare `deepseek-v4-flash` literal (already opencode-go-fronted in the runtime).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Operator decisions captured (new default, terra scope, pro scope, runtime sync)
- [x] Enforcement points + guard-test assertions located
- [x] The bare `deepseek-v4-flash` literal confirmed opencode-go-fronted in `PI_MODEL_PROVIDERS`

### Definition of Done
- [x] No `deepseek-v4-pro`, `gpt-5.6-terra`, or direct-provider dispatch shape remains in live docs of either skill
- [x] Fan-out enforcement + provider map + default model updated in sync
- [x] Unit tests green (205/205); `node --check` clean
- [x] Packet validates `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-closed roster mirrored across two runtime files plus closed-roster doc catalogs on both CLIs. `executor-config.ts` `PI_SUPPORTED_MODELS` is source of truth; `fanout-run.cjs` mirrors it as `PI_ALLOWED_MODELS` plus a `PI_MODEL_PROVIDERS` map; `isFlashMaxPinnedModel` forces `--thinking max` for the flash family. One literal maps to one provider.

### Key Components
- **`PI_SUPPORTED_MODELS`** (executor-config.ts): the enforced fan-out allowlist + default model.
- **`PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS` + `PI_DEFAULT_MODEL`** (fanout-run.cjs): mirror + model→provider routing + default.
- **`references/providers-and-models.md`** (both skills): the closed-roster catalogs.
- **Playbooks**: pinned expectations that reference the enforcement lists (line ranges, id counts, defaults).

### Data Flow
Fan-out default (`deepseek-v4-flash`) → `PI_ALLOWED_MODELS` → `PI_MODEL_PROVIDERS` (`opencode-go`) → `isFlashMaxPinnedModel` forces `--thinking max` → builds `pi -p --offline --model opencode-go/deepseek-v4-flash --thinking max`. cli-opencode examples dispatch `--model opencode-go/deepseek-v4-flash --variant max` directly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| cli-pi + cli-opencode `providers-and-models.md` | Closed rosters | drop deepseek provider / v4-pro / terra rows; repoint defaults | grep + read |
| cli-opencode SKILL/README/references/assets | dispatch examples + pre-flight trees | mechanical default swap + pre-flight rekey to opencode-go | grep |
| `executor-config.ts` `PI_SUPPORTED_MODELS` + `PI_DEFAULT_MODEL` | roster + default | −2 ids; default → `deepseek-v4-flash` | roster assertion |
| `fanout-run.cjs` mirror + map + default | sync + routing | −2 ids/entries; default swap | `node --check` + vitest |
| `*.vitest.ts` guards | pin roster/provider/default | swap expectations | `npx vitest run` |
| Playbooks (allowlist smoke, cline id-format, CO-001/014/015/017/034, CO-011) | expectations + command sequences | recompute, retire CO-011, pin flash max | fresh evidence capture |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Enforcement runtime
- [x] `PI_SUPPORTED_MODELS` −2 ids; `PI_DEFAULT_MODEL` → `deepseek-v4-flash`; comment refresh
- [x] `fanout-run.cjs` mirror + `PI_MODEL_PROVIDERS` −2 entries + default; comment refresh
- [x] Guard tests updated; 205/205 green

### Phase 2: cli-pi docs
- [x] Roster retirement (deepseek provider, cline-pass Pro, terra); §3/§5 examples repointed; version bump; changelog v1.4.1.0
- [x] Playbook expectations updated (smoke: 11 ids + flash default + repaired stale line range with fresh evidence; cline id-format: Pro retired)

### Phase 3: cli-opencode docs
- [x] Roster retirement + §3/§4/§5 defaults rework; version bump; changelog v1.4.3.0
- [x] SKILL/README/cli-reference: default swap, pre-flight rekey to opencode-go, login/ASK trees
- [x] agent-delegation / integration-patterns / opencode-tools / prompt-templates / permissions-matrix / context-budget / destructive-scope: default swap (incident history preserved)
- [x] CO-011 retired + feature file deleted; index/coverage/wave plan updated; flash command sequences pinned to max

### Phase 4: Verification
- [x] Grep gates (no v4-pro / terra / direct-provider shapes in live docs)
- [x] Unit tests re-run after final map fix — green
- [x] `validate.sh --strict`; no-stray-files sweep
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | roster + provider map + default + command construction | `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts` |
| Syntax | fan-out mirror | `node --check fanout-run.cjs` |
| Sweep | no stray removed id in live docs | grep over non-changelog, non-benchmark files |
| Evidence | smoke playbook pinned range | `sed -n '182,211p' executor-config.ts` fresh capture |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| opencode-go gateway configured | External (machine) | Green (route already dispatch-verified 2026-08-07) | Default dispatch falls to ASK-user tree |
| vitest toolchain | Local | Green | Guard tests cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: fan-out mis-routes, a guard test regresses, or a dispatch default fails auth on operator machines.
- **Procedure**: revert the packet's edits via git (all touched files are tracked). Re-adding a roster id means re-adding its `PI_MODEL_PROVIDERS` entry and test expectations in the same change.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist
- [x] Enforcement points + guard tests located
- [x] Baseline grep gate recorded (17 live files matched pre-change)

### Rollback Procedure
1. `git checkout` the touched files (runtime + both skills)
2. Re-run `npx vitest run` on the three suites
3. No data reversal (docs/runtime lists only)
<!-- /ANCHOR:enhanced-rollback -->
