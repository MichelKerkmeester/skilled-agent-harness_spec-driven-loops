---
title: "Implementation Summary: Drop DeepSeek API provider, V4 Pro, and GPT-5.6 Terra"
description: "Removed the direct DeepSeek API provider, every DeepSeek V4 Pro entry, and every GPT-5.6 Terra slug from the cli-pi and cli-opencode rosters, playbooks, and deep-loop fan-out enforcement; default repointed to opencode-go/deepseek-v4-flash --variant max; 205/205 unit tests green; packet validated --strict."
trigger_phrases:
  - "implementation summary"
  - "drop deepseek api pro terra"
  - "opencode-go default deepseek flash"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/056-roster-drop-deepseek-api-pro-terra"
    last_updated_at: "2026-08-29T10:35:00Z"
    last_updated_by: "pi"
    recent_action: "Shipped the roster retirement across both CLI skills + fan-out enforcement; validated --strict"
    next_safe_action: "None — work is complete and validated; optional follow-ups in LIMITATIONS"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-056-roster-drop-deepseek-api-pro-terra"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Drop DeepSeek API provider, V4 Pro, and GPT-5.6 Terra

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Verification** | 205/205 unit tests; grep gates pass; `validate.sh --strict` PASS |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The direct DeepSeek API provider, DeepSeek V4 Pro in every form, and GPT-5.6 Terra in every slug were removed from the two closed-roster CLI skills and the enforcement runtime that mirrors the pi roster.

### Enforcement runtime (system-deep-loop)
- `executor-config.ts`: `PI_SUPPORTED_MODELS` → 11 ids (no `deepseek-v4-pro`/`gpt-5.6-terra`); `PI_DEFAULT_MODEL` → `deepseek-v4-flash`; comments note the bare flash literal is opencode-go-fronted.
- `fanout-run.cjs`: mirror (`PI_ALLOWED_MODELS`), default, and `PI_MODEL_PROVIDERS` updated in sync; provider-fronting comment corrected.
- Tests: `executor-config.vitest.ts`, `fanout-run.vitest.ts`, `combo-matrix.vitest.ts` expectations swapped; non-pinned examples use minimax/qwen/gpt-5.6-sol; default command proves the flash `--thinking max` pin.

### cli-pi (v1.1.0.0 roster, v1.4.1.0 changelog)
- Roster: deepseek provider section removed; cline-pass Pro row removed; openai-codex terra row + §4 ceiling row removed; §3/§5 examples → `--provider opencode-go --model deepseek-v4-flash --thinking max`.
- Playbooks: allowlist smoke (11 ids, flash default, stale sed range 153,174 → repaired 182,211 with fresh evidence); cline id-format Pro retired with a do-not-dispatch note.

### cli-opencode (v1.2.0.0 roster, v1.4.3.0 SKILL)
- Roster: deepseek provider section removed; terra persona row removed (sol/luna × base/fast/pro); cline-pass Pro row removed; defaults → `opencode-go/deepseek-v4-flash --variant max`; §4 variant table reworked; §5 envelope updated.
- SKILL/README/cli-reference: default invocation, keyword line, pre-flight one-shot rekeyed (`DEEPSEEK_OK` → `OPENCODE_GO_OK`), ASK-user trees and login recommendations, §5 model selection.
- agent-delegation / integration-patterns / opencode-tools / prompt-templates / permissions-matrix / context-budget / destructive-scope: mechanical default swap; flash+high pairs corrected to max; flash context window explicitly marked unverified (no invented number).
- Playbooks: CO-011 (deepseek direct API) retired, feature file deleted, index/coverage/wave plan updated; CO-001/CO-014/CO-015/CO-017/CO-034 command sequences pin `--variant max`; global preconditions item 4 retargeted to the gateway; `variant-levels-comparison.md` flash row corrected to the max pin.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Single-session implementation: runtime first (with tests re-run to green), then cli-pi docs/playbooks, then the wider cli-opencode sweep (mechanical sed + surgical narrative edits), then the three grep gates, metadata generation, and `validate.sh --strict`. Historical records (benchmark reports, past changelog entries, the 2026-05-04 destructive-scope incident narrative) were intentionally left verbatim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| New cli-opencode default: `opencode-go/deepseek-v4-flash --variant max` | Operator-selected; flash is max-tier-pinned by roster policy, so the default effort moves from `high` to `max` |
| Fan-out default mirrors it as bare `deepseek-v4-flash` | Runtime already maps that literal to opencode-go; keeps TS/CJS parity tests meaningful |
| All terra slugs and all v4-pro entries removed | Operator chose the full-retirement options |
| Incident history kept verbatim | Destructive-scope narrative is factual record; only its actionable fallback advice was repointed |
| No invented flash context window | Context-budget row marked "not re-verified — confirm via `opencode models opencode-go`" |
| CO-011 retired rather than rewritten | Its whole contract tests a removed provider; flash variant coverage lives in CO-012 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Command | Observed |
|-------|---------|----------|
| Live-doc sweep (v4-pro/terra) | `grep -rn "deepseek-v4-pro\|5.6-terra" cli-pi cli-opencode --include="*.md"` minus changelog/benchmark | 6 hits, all intentional retired-notes/incident history |
| Live-doc sweep (direct provider) | `grep -rn "provider deepseek\b\|deepseek/deepseek-v4-pro\|login deepseek" …` | Zero hits |
| Enforcement sync | grep over executor-config.ts + fanout-run.cjs pi sections | No pi-list residue (DEVIN list exempt — out of scope) |
| Unit tests | `npx vitest run` (3 suites) | 205 passed / 0 failed, re-run after the final map fix |
| Syntax | `node --check fanout-run.cjs` | Exit 0 |
| Evidence capture | `sed -n '182,211p' executor-config.ts` | 11 ids + `PI_DEFAULT_MODEL … 'deepseek-v4-flash'` matches playbook record |
| Packet gate | `validate.sh <packet> --strict` | RESULT: PASSED |
| Stray files | git status sweep | Only intended files changed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- DeepSeek V4 Flash's context window on opencode-go is not verified in-repo; confirm before budget-sensitive dispatches.
- A stale `deepseek-v4-pro` entry may remain in this machine's `.pi/settings.json` `enabledModels` — config cleanup is operator-side; the roster forbids dispatching it.
- No live dispatch was executed in this packet (docs/runtime-list change; the routes themselves carry prior dispatch evidence).
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## 7. DEVIATIONS

- The smoke playbook's pinned `sed '153,174p'` range was already stale pre-change (pointed at the web-search policy block); repaired to `182,211p` with a fresh capture rather than preserving a broken anchor.
- cli-opencode's pi-independent `--variant high` examples on non-pinned models (kimi/xiaomi/sol/gpt) were left as-is — the max pin is flash-specific policy.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:out-of-scope-followups -->
## 8. OUT OF SCOPE / FOLLOW-UPS

- Devin/Cursor/Codex allowlists: untouched by design (their own provider rosters still carry deepseek-v4-pro variants).
- Operator-side `.pi/settings.json` cleanup of the retired `deepseek-v4-pro` enabledModel.
- Flash context-window verification via `opencode models opencode-go`, then fill the context-budget.md row.
<!-- /ANCHOR:out-of-scope-followups -->
