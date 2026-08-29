---
title: "Feature Specification: Drop the DeepSeek direct API provider, DeepSeek V4 Pro, and GPT-5.6 Terra from the cli-pi and cli-opencode rosters"
description: "Remove the direct DeepSeek API provider, every DeepSeek V4 Pro entry, and every GPT-5.6 Terra slug from the cli-pi and cli-opencode model rosters, their playbooks, and the deep-loop cli-pi fan-out enforcement (allowlists + provider map + default model), with unit-test updates."
trigger_phrases:
  - "drop deepseek api pro terra"
  - "remove deepseek provider roster"
  - "remove gpt-5.6-terra roster"
  - "opencode-go default deepseek flash"
importance_tier: "normal"
contextType: "implementation"
version: 1.0.0.0
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/056-roster-drop-deepseek-api-pro-terra"
    last_updated_at: "2026-08-29T10:35:00Z"
    last_updated_by: "pi"
    recent_action: "Spec finalized after implementation and validation"
    next_safe_action: "None — complete"
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
# Feature Specification: Drop the DeepSeek direct API provider, DeepSeek V4 Pro, and GPT-5.6 Terra from the cli-pi and cli-opencode rosters

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-28 |

Related packets: `033-deepseek-v4-flash-pi-roster` (introduced the direct provider), `043-roster-update-luna-deepseek-glm-gemini`, `044-deepseek-v4-flash-max-only`, `047-cli-pi-opencode-openrouter-roster`.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator retired three dispatch targets:

1. the **direct DeepSeek API provider** (`deepseek` provider in both cli-pi and cli-opencode rosters),
2. **DeepSeek V4 Pro** in every form both skills expose it (direct provider, cline-pass route, default-model wiring, examples, enforcement),
3. **GPT-5.6 Terra** in every form both skills expose it (bare `gpt-5.6-terra` on cli-pi; `openai/gpt-5.6-terra`, `-fast`, and `-pro` slugs on cli-opencode).

The rosters are closed rosters whose docs and the deep-loop fan-out enforcement must not drift: `PI_SUPPORTED_MODELS` / `PI_ALLOWED_MODELS` / `PI_MODEL_PROVIDERS` in `system-deep-loop` enforce exactly the cli-pi roster, and `PI_DEFAULT_MODEL` pointed at `deepseek-v4-pro`, which is being removed.

### Purpose
Keep the closed rosters, their dispatch examples and playbook expectations, and the runtime enforcement consistent after the retirement. The operator chose `opencode-go/deepseek-v4-flash --variant max` as the new cli-opencode default; the cli-pi fan-out default mirrors it as the bare `deepseek-v4-flash` literal (which the runtime already fronts through opencode-go).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `cli-pi/references/providers-and-models.md` + cli-pi model-dispatch playbook expectations + cli-pi changelog.
- `cli-opencode`: roster, SKILL.md, README.md, references, assets, playbooks (default model, variant, examples, pre-flight trees), changelog + version bump.
- `system-deep-loop` enforcement: `runtime/lib/deep-loop/executor-config.ts`, `runtime/scripts/fanout-run.cjs`, and the three unit-test files that assert these lists.
- Retire `cli-opencode/manual-testing-playbook/multi-provider/deepseek-direct-api.md` (tests a removed provider) and its playbook index entry.

### Out of Scope (Non-Goals)
- Historical records: benchmark reports and past changelog entries keep their original text.
- The opencode-go, openrouter, and cline-pass DeepSeek V4 **Flash** routes stay (only the direct API provider and Pro entries go).
- Other cli skills' rosters (cli-codex, cli-cursor, cli-devin) — the Devin/Cursor allowlists are outside this packet's stated scope.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement | Rationale |
|---|-------------|-----------|
| REQ-FUNC-1 | `deepseek` direct-API provider section removed from both roster docs; no dispatch example in either skill names `--provider deepseek` or `--model deepseek/deepseek-v4-*` | Provider retirement |
| REQ-FUNC-2 | Every `deepseek-v4-pro` entry removed from both skills: roster rows, cline-pass routes, default-model wiring, examples, pre-flight trees, playbook expectations | Operator decision: all v4-pro entries |
| REQ-FUNC-3 | Every GPT-5.6 Terra slug removed from both skills (bare id, base/fast/pro row, effort-ceiling table, cli-reference examples) | Operator decision: all terra slugs |
| REQ-FUNC-4 | cli-opencode default becomes `opencode-go/deepseek-v4-flash --variant max` consistently across SKILL.md, README, roster §3/§5, cli-reference pre-flight, and all example commands | Flash is max-tier-pinned by policy |
| REQ-FUNC-5 | Enforcement sync: `PI_SUPPORTED_MODELS`/`PI_ALLOWED_MODELS` drop `deepseek-v4-pro` and `gpt-5.6-terra`; `PI_MODEL_PROVIDERS` drops their mappings; `PI_DEFAULT_MODEL` → `deepseek-v4-flash` | Roster ↔ runtime must not drift |
| REQ-FUNC-6 | Unit tests updated and passing (`executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts`) | Enforcement has test guards |
| REQ-FUNC-7 | The bare `deepseek-v4-flash` literal stays allowlisted and documented as opencode-go-fronted on cli-pi (runtime provider map already routes it there) | Flash remains dispatchable |
| REQ-FUNC-8 | `validate.sh` passes `--strict` for this packet; no stray files left behind | Completion gate |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Grep gates over non-changelog, non-benchmark docs return zero live dispatch shapes for the removed provider/ids (intentional retired-notes and incident history exempt).
2. The pi enforcement list and its mirror contain exactly the documented 11 ids with `PI_DEFAULT_MODEL = 'deepseek-v4-flash'`.
3. The three guard-test suites pass (205/205).
4. The smoke playbook's pinned range reproduces the recorded roster from a fresh capture.
5. `validate.sh --strict` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- `supported-model-allowlist-smoke.md` pins a `sed` line range into executor-config.ts — the range was already stale pre-change; repaired and re-verified with a fresh capture.
- cli-reference's pre-flight script keys the default on a provider grep; retargeting from `deepseek` to `opencode-go` changes which missing credential triggers the ASK-user tree.
- DeepSeek V4 Flash's context window is not documented in-repo; the context-budget row is marked unverified rather than filled with an invented number.
- Machine-local `.pi/settings.json` may still carry the retired `deepseek-v4-pro` enabledModel; docs now explicitly forbid dispatching it.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — all four scope decisions were answered by the operator before implementation (new default, runtime sync, terra scope, pro scope).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `../../skills/cli-external-orchestration/cli-pi/references/providers-and-models.md`
- `../../skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md`
- `../../skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
<!-- /ANCHOR:related-docs -->
