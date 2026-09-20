---
title: "Implementation Plan: the CLI roster truth pass — DevPass, vision, Gemini 3.8, V4 Pro retirement, pi repair"
description: "Five workstreams over one shared verification gate: register llmgateway with four curated models, add the DeepSeek V4 Flash Vision variant to the three providers that offer it, carry Gemini 3.7 to 3.8 across four CLI modes and both fan-out rosters, retire all three DeepSeek V4 Pro ids from the devin allowlist along with every recommendation of it, and repair the two pi-config defects."
trigger_phrases:
  - "devpass roster plan"
  - "gemini 3.8 swap plan"
  - "deepseek flash vision plan"
  - "implementation"
  - "plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/060-devpass-roster-vision-gemini-3-8"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Planned three workstreams against live-captured provider evidence"
    next_safe_action: "Run T001 baseline capture before any edit"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-060-devpass-vision-gemini"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: the CLI roster truth pass — DevPass, vision, Gemini 3.8, V4 Pro retirement, pi repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + TypeScript/CommonJS (deep-loop runtime) |
| **Framework** | vitest |
| **Storage** | None — docs, constants and test fixtures |
| **Testing** | `npx vitest run` + `tsc --noEmit` + live dispatch across four CLIs |

### Overview
Five workstreams sharing one verification gate. **WS1** adds an `llmgateway` provider section to cli-opencode with four curated models; docs-only, because cli-opencode has no code-enforced allowlist — the catalog *is* the enforcement. **WS2** adds the DeepSeek V4 Flash Vision variant to `llmgateway`, `openrouter` and `opencode-go`, and documents why `cline-pass` gets none. **WS3** carries Gemini 3.7 to 3.8 across all four CLI modes, three enforced roster pairs and two vitest suites. **WS4** corrects two false sentences sitting inside blocks the others already rewrite. **WS5** retires all three DeepSeek V4 Pro ids from the devin allowlist and repoints every recommendation of it. **WS6** repairs the two `.pi` config defects.

Two ordering constraints, both narrow. WS3 and WS5 edit the same two runtime files and the same two vitest suites, so they land together — a roster edit and its guard-test edit must be one step or the suite fails between them. And WS6's `.pi/settings.json` addition names `openrouter/google/gemini-3.8-flash`, so it follows WS3's decision on that id rather than inventing one. Everything else is order-free.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `llmgateway` credential present and dispatching (`opencode auth list`; `PONG-DEVPASS` from `llmgateway/claude-haiku-4-5`, 2026-09-04)
- [x] All four DevPass ids, their variant ladders, vision flags and prices captured from `opencode models llmgateway --verbose`
- [x] Vision variant confirmed on `openrouter` and `opencode-go`, and confirmed **absent** on `cline-pass`
- [x] Gemini 3.8 confirmed present on openrouter, llmgateway, cursor (`gemini-3.8-flash-high`) and devin (`gemini-3-8-flash-high`) — the operator's gate on the widest-reach option
- [x] All three roster pairs and both vitest suites located by line number
- [ ] `tsc --noEmit` and vitest baselines captured (T001 — the one Ready item that must be done at implementation time, not before)

### Definition of Done
- [ ] `llmgateway` section carries exactly four models with live-sourced facts
- [ ] Devin allowlist is 14 ids in both files; no V4 Pro id and no V4 Pro recommendation survives
- [ ] Both `.pi` files parse and carry the intended add/delete
- [ ] Vision rows on three providers; `cline-pass` gap documented with its evidence
- [ ] Zero `gemini-3.7` / `gemini-3-7` references outside `changelog/` and `benchmark/`
- [ ] Three roster pairs equal; every pi id resolves in `PI_MODEL_PROVIDERS`
- [ ] vitest green; `tsc --noEmit` delta zero against the T001 baseline
- [ ] Every model dispatch-tested, vision proven with a real image
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two enforcement models sit side by side in this hub, and confusing them is the main way this work goes wrong.

**cli-opencode is discipline-enforced.** `--model provider/id` is free-form and nothing gates it at runtime. `providers-and-models.md` is the enforcement: a model absent from that catalog is forbidden, and the only thing stopping a dispatch is a reader honoring the rule. WS1 and WS2 therefore ship entirely in Markdown, and their correctness is a documentation property.

**cli-pi, cli-cursor and cli-devin are code-enforced.** `executor-config.ts` holds the source-of-truth `as const` array; `fanout-run.cjs` holds a hand-maintained mirror; a guard test asserts the two agree. A model missing from either is rejected before a command is built. WS3 and WS5 therefore edit three pairs plus a provider map, and their correctness is a test property.

**The two sides are not the same data structure**, and an edit written for one shape will not apply to the other. `executor-config.ts` declares arrays (`PI_SUPPORTED_MODELS`, `CURSOR_SUPPORTED_MODELS`, `DEVIN_SUPPORTED_MODELS`); `fanout-run.cjs` declares `new Set([...])` for all three mirrors and `new Map([...])` for `PI_MODEL_PROVIDERS`. The literal id lines look identical, which is exactly why the difference is easy to miss when scripting a bulk edit across both files.

### Key Components
- **`providers-and-models.md` §2** (cli-opencode): the closed roster. Gains an `llmgateway` section and two vision rows.
- **`PI_SUPPORTED_MODELS` / `PI_ALLOWED_MODELS` + `PI_MODEL_PROVIDERS`**: pi's allowlist pair and its model→provider routing. The Gemini id changes in all three.
- **`CURSOR_SUPPORTED_MODELS` / `CURSOR_ALLOWED_MODELS`**: cursor's 21-id pair, one id changing.
- **`DEVIN_SUPPORTED_MODELS` / `DEVIN_ALLOWED_MODELS`**: devin's pair, one uid changing.
- **`DEVIN_SUPPORTED_MODELS` / `DEVIN_ALLOWED_MODELS`**: devin's pair, 17 ids today. One id changes for Gemini and three leave for V4 Pro, landing at 14.
- **`isFlashMaxPinnedModel`**: **unchanged.** Gemini tops at `high` and was never pinned; the vision variant is not a pi fan-out literal; and V4 Pro is leaving, not changing tier. Naming this explicitly prevents a well-meant "while we're here" edit to a predicate that is already correct.
- **`.pi/models.json` `providers["cline-pass"].models`**: a three-element array; WS6 removes one element, not the array.

### Data Flow
Fan-out reads a model literal → checks the mode's `*_ALLOWED_MODELS` → for pi, resolves `PI_MODEL_PROVIDERS` to build the three-segment selector → applies `isFlashMaxPinnedModel` → constructs the dispatch. After WS3, `google/gemini-3.8-flash` resolves to `openrouter` and is not max-pinned; `google/gemini-3.7-flash` is rejected at the allowlist step.

Direct cli-opencode dispatch does not enter that path at all: the operator reads the catalog and passes `--model llmgateway/<id> --variant <tier>` straight to `opencode run`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| cli-opencode `providers-and-models.md` | The closed roster itself | +llmgateway section, +2 vision rows, Gemini 3.8, GLM `max` fix | read + `rg` sweep |
| cli-opencode `SKILL.md`, `cli-reference.md`, `README.md` | Provider prose + auth pre-flight | +llmgateway, Gemini 3.8, OpenRouter-allowlist fix | `rg -n 'llmgateway\|gemini-3\.'` |
| cli-pi `providers-and-models.md` + allowlist smoke playbook | Mirror catalog + expected-id list | Gemini 3.8 | `rg` |
| cli-cursor 5 doc surfaces | 21-id allowlist prose | `gemini-3.8-flash-high` | `rg -c` = same count as before |
| cli-devin `SKILL.md` + catalog | Curated-families roster | `gemini-3-8-flash-high` + alias/price note | `rg` |
| `executor-config.ts` 3 arrays | Source-of-truth allowlists | one id each | roster assertions |
| `fanout-run.cjs` 3 mirrors + provider map | Enforced mirror + routing | one id each + map key | `node --check` + vitest |
| `*.vitest.ts` | Pin rosters, provider map, negatives | update fixtures **in the same step** | `npx vitest run` |
| `isFlashMaxPinnedModel` | Flash top-tier pin | **not a consumer — unchanged** | Gemini has no `max`; grep confirms no Gemini or V4 Pro literal in the regex |
| cli-devin `SKILL.md` / `README.md` / `cli-reference.md` §5 | Where V4 Pro is *recommended* | repoint 5 sites to `gpt-5-6-luna-max` | `rg -n 'deepseek-v4-pro'` returns 0 outside changelogs |
| `.pi/models.json` + `.pi/settings.json` | pi provider decl + picker gate | delete one model block; add one id | `node -e JSON.parse` on both |
| cli-pi cline-id-format playbook | Describes the deleted block | update 2 lines | read |
| cli-claude-code `claude-tools.md` | `--variant` example | name a live model | `rg` |

Required inventories, to be run and pasted into `scratch/` rather than trusted from memory:
- `rg -n 'gemini-3\.7|gemini-3-7' .opencode/skills/cli-external-orchestration .opencode/skills/system-deep-loop/runtime`
- `rg -n 'deepseek-v4-flash' .opencode/skills/cli-external-orchestration/cli-opencode`
- `rg -n 'llmgateway' .opencode/skills/cli-external-orchestration` (expect zero before WS1)
- `rg -n 'deepseek-v4-pro|\bdeepseek-v4\b' .opencode/skills .pi` — the full V4 Pro inventory, separating roster entries from incident history before a single deletion
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Three roster pairs, provider map, max-pin negatives | `executor-config.vitest.ts`, `fanout-run.vitest.ts` |
| Type | Touched TS modules, measured as a delta | `tsc --noEmit` against the T001 baseline |
| Syntax | The CommonJS mirror | `node --check fanout-run.cjs` |
| Sweep | No stale Gemini 3.7 outside changelog/benchmark | `rg -n 'gemini-3\.7\|gemini-3-7'` |
| Live (text) | Four DevPass models, cursor 3.8, devin 3.8 | `opencode run`, `cursor-agent -p`, `devin -p` |
| Live (vision) | Three vision routes actually accept an image | `opencode run` with an image attachment; a text-only reply is a FAIL |
| Negative control | The old ids now fail closed | Fan-out dispatch of `google/gemini-3.7-flash` is rejected at the allowlist |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| DevPass (LLM Gateway) subscription | External | Green — dispatch confirmed 2026-09-04 | WS1 and part of WS2 cannot be verified |
| OpenRouter + opencode-go auth | External | Green — already used by existing rows | WS2 vision rows unverifiable |
| cursor-agent + devin CLIs authenticated | External | Green — both `--list-models` succeeded 2026-09-04 | REQ-009 blocked; the doc swap could still ship list-verified only |
| An image file for the vision probe | Internal | Not yet chosen | REQ-010 falls back to list-verified, which would be a P1 deferral needing operator sign-off |
| DevPass Premium fair-use cap | External | Not engaged — all four models are Standard tier | None for this roster |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a guard test regresses, a fan-out lineage mis-routes, or a live dispatch contradicts a documented tier.
- **Procedure**: `git revert <feature-commit>`. The change is docs, constants and fixtures in one commit — no migration, no persisted state, no deployed consumer. Reverting restores the 3.7 ids in all three enforced rosters simultaneously, which is the only property that must not be split.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline) ──┬──► WS1 DevPass docs ─────────┐
                     ├──► WS2 Vision rows ──────────┤
                     ├──► WS3 Gemini 3.8 ──┐        │
                     │                     ├─atomic─┼──► Phase 3 (Verify)
                     ├──► WS5 V4 Pro out ──┘        │
                     └──► WS6 pi repair ────────────┘
                          (follows WS3's Gemini id)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline (T001) | None | All verification claims |
| WS1 DevPass | Baseline | Verify |
| WS2 Vision | Baseline | Verify |
| WS3 Gemini | Baseline | Verify |
| WS5 V4 Pro | Baseline | Verify — shares WS3's files, lands in the same step |
| WS6 pi repair | WS3 (id choice) | Verify |
| Verify | WS1, WS2, WS3, WS5, WS6 | None |

WS1 and WS2 share `providers-and-models.md`; WS3 and WS5 share `executor-config.ts`, `fanout-run.cjs` and both vitest suites, which is why they land as one step rather than two. WS6 is otherwise independent.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline capture | Low | 10-15 min |
| WS1 DevPass section | Medium | 45-60 min |
| WS2 Vision rows | Low | 20-30 min |
| WS3 Gemini sweep (13 docs + 4 code files) | Medium | 60-90 min |
| WS5 V4 Pro retirement (3 ids + 5 recommendation sites) | Medium | 40-60 min |
| WS6 pi config repair | Low | 15-20 min |
| Verification incl. live + vision dispatch | Medium | 45-60 min |
| **Total** | | **4.5-6.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change Checklist
- [ ] `tsc --noEmit` and `npx vitest run` baselines captured to `scratch/` (T001)
- [ ] `rg` inventory of all `gemini-3.7` / `gemini-3-7` sites captured before the first edit
- [ ] Working tree otherwise clean, so the revert target is this change alone

### Rollback Procedure
1. `git revert <feature-commit>`
2. `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` — expect the T001 baseline counts
3. `rg -n 'llmgateway' .opencode/skills/cli-external-orchestration` — expect zero hits again
4. `node -e JSON.parse` on both `.pi` files — a revert that leaves either unparseable breaks pi startup, so this is checked on the way back too

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — documentation, constants and test fixtures only.
<!-- /ANCHOR:enhanced-rollback -->
