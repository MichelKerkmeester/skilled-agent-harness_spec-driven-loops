---
title: "Feature Specification: A CLI roster truth pass — DevPass onboarding, DeepSeek V4 Flash Vision, Gemini 3.8, DeepSeek V4 Pro retirement, and the pi config repair"
description: "Bring every model fact in the CLI hub back in line with what the live CLIs accept: register the llmgateway (DevPass) provider with four curated models, add the DeepSeek V4 Flash Vision variant wherever a provider offers it, move Gemini 3.7 Flash to 3.8 across all four CLI modes and both fan-out rosters, retire DeepSeek V4 Pro from the last roster still carrying it, and repair the two defects in the pi config."
trigger_phrases:
  - "devpass llmgateway roster"
  - "deepseek v4 flash vision cli"
  - "gemini 3.8 flash roster swap"
  - "llmgateway provider cli-opencode"
  - "retire deepseek v4 pro roster"
  - "pi config repair enabled models"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/060-devpass-roster-vision-gemini-3-8"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the Level 2 planning docs from live provider evidence; implementation not started"
    next_safe_action: "Execute Phase 1 of tasks.md (baseline capture), then the three workstreams"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-060-devpass-vision-gemini"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Which DevPass models enter the closed roster? -> Exactly four: deepseek-v4-flash, deepseek-v4-flash-vision-exp, glm-5.3-flash, gemini-3.8-flash (operator, 2026-09-04)"
      - "How far does the Gemini 3.7 -> 3.8 swap reach? -> Everywhere the hub names it, cursor and devin included (operator, 2026-09-04)"
      - "Does DeepSeek V4 Pro stay on any roster? -> No; remove it from all of them (operator, 2026-09-04)"
      - "Does the pi config get repaired here? -> Yes, both defects (operator, 2026-09-04)"
---
# Feature Specification: A CLI roster truth pass — DevPass onboarding, DeepSeek V4 Flash Vision, Gemini 3.8, DeepSeek V4 Pro retirement, and the pi config repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-04 |
| **Branch** | `skilled/v4.0.0.0` |

> **Level basis.** `recommend-level.sh --loc 300 --files 18 --api` returned **Level 2 (Verification)**, score 48/100, confidence 82%, phase score 10/50 (threshold 25) — phases NOT recommended. Re-scored at `--loc 420 --files 26 --api` after the 2026-09-04 scope amendment: still **Level 2**, and the phase score stays below threshold. This is a standard packet, not a phase parent.

> **Scope amended 2026-09-04, after authoring.** The operator directed that DeepSeek V4 Pro be removed from every roster, and that the pi config be repaired. Both were written into §3 as OUT of scope in the first draft; a live operator instruction outranks a scope line in a packet's own spec, so they are now IN, as WS5 and WS6. The amendment is recorded here rather than applied silently, and it is safe to make because no file outside this packet folder had been touched when it arrived.
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three distinct truth gaps sit in the CLI hub at once, and each one makes a document lie about what a dispatch will do.

**One: an authenticated provider nobody may use.** The operator subscribed to **DevPass**, LLM Gateway's flat-price coding plan, and authenticated it into opencode. `opencode auth list` shows `DevPass (LLM Gateway) · api`, `~/.local/share/opencode/auth.json` carries the `llmgateway` key, and `opencode models llmgateway` returns **183 model ids**. None of them appear in the cli-opencode catalog. Because that catalog is a **CLOSED ROSTER** enforced by discipline rather than code, every one of those 183 ids is currently forbidden for cli-opencode dispatch — the operator is paying a subscription the skill may not touch.

**Two: a vision variant that exists on three providers and is documented on none.** DeepSeek ships `deepseek-v4-flash-vision-exp`, the same 1M-context flash family the roster already leans on, but with `attachment: true` — it accepts images. It is live on `llmgateway`, `openrouter` and `opencode-go`, all three of which already carry plain V4 Flash in the catalog. A reader looking for "can cli-opencode see an image" finds nothing and concludes no.

**Three: a model version the hub names four different ways, all stale.** Gemini 3.7 Flash is wired across cli-opencode, cli-pi, cli-cursor, cli-devin and both deep-loop fan-out rosters. Google shipped 3.8 and every one of those five surfaces now offers it, but every one of them still names 3.7. On devin the `gemini` family alias has already **moved to 3.8**, so the hub's documented alias resolves somewhere the docs do not say.

**Four: a retired model still enforced on one roster.** DeepSeek V4 Pro was retired from the cli-opencode catalog and from the pi allowlist, and the docs say so. It is still live in cli-devin's enforced allowlist under **three** ids — `deepseek-v4`, `deepseek-v4-pro` and `deepseek-v4-pro-max` — and devin's own guidance names `deepseek-v4-pro-max` as the model to reach for on architecture, security and planning work, in five separate places. The hub therefore documents V4 Pro as retired and recommends it at the same time.

**Five: a pi config carrying one dead entry and missing one live one.** `.pi/models.json` declares a `cline-pass/deepseek-v4-pro` model block that the cli-pi playbook itself calls an "inert leftover". And `.pi/settings.json` `enabledModels` lists eleven ids with **no Gemini id at all**, though the deep-loop fan-out roster accepts one — so the pi picker cannot offer a model the fan-out will happily dispatch.

Two smaller falsehoods sit inside the same paragraphs this work has to edit. `providers-and-models.md` asserts GLM-5.3-Flash "has **no `max` variant on any route**" — `opencode models llmgateway --verbose` shows `llmgateway/glm-5.3-flash` exposing `max`. And `cli-reference.md` line 263 still tells the auth pre-flight that OpenRouter "currently routes DeepSeek V4 Flash only", a claim packet 055 retired in `SKILL.md` on 2026-08-27 but missed here.

### Purpose
Make every provider, model id and thinking tier the cli-opencode hub names match what the live CLIs actually accept, on the day this ships. Concretely: open the DevPass route with a deliberately small four-model roster; give the flash family its vision variant wherever a provider offers one and say plainly where none exists; and carry Gemini to 3.8 across all four CLI modes and both enforced fan-out rosters together, so no surface documents a version another surface rejects.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**WS1 — DevPass (`llmgateway`) onboarding, cli-opencode only. DELIVERED by packet `063` on 2026-09-04.** The catalog section now exists and carries **five** models — the four below plus `llmgateway/gpt-5.6-luna`, added when the operator asked for Luna on both rosters. All five are dispatch-tested through cli-opencode. Nothing remains for this workstream; the table below is retained as the record of the original four and their verified ladders:

| Model id | Reasoning | Vision | Variant ladder (live) | Dispatch tier |
|----------|-----------|--------|-----------------------|---------------|
| `llmgateway/deepseek-v4-flash` | yes | no | `none`→`minimal`→`low`→`medium`→`high`→`xhigh`→`max` | `--variant max` (flash family policy) |
| `llmgateway/deepseek-v4-flash-vision-exp` | yes | **yes** | `none`→`low`→`high`→`max` | `--variant max` |
| `llmgateway/glm-5.3-flash` | yes | yes | `none`→`minimal`→`low`→`medium`→`high`→`xhigh`→`max` | `--variant max` |
| `llmgateway/gemini-3.8-flash` | yes | yes | `minimal`→`low`→`medium`→`high` | `--variant high` (no `max`/`xhigh` tier) |

The section records the endpoint (`https://api.llmgateway.io/v1`, OpenAI-compatible, `@ai-sdk/openai-compatible`), the auth shape, and the DevPass fair-use rule: LLM Gateway classifies a model **Premium** at $15+/1M output or $5+/1M input, and caps Premium usage at 12%/15%/18% of monthly credits per week on Lite/Pro/Max. All four models above bill at **$0.104, $0.28, $0.40 and $3.75 per 1M output** — every one is Standard, so **no weekly cap applies to this roster**. That fact is the reason the roster is safe to dispatch freely, so it belongs in the catalog rather than in a commit message.

**WS2 — DeepSeek V4 Flash Vision rollout.** Add `deepseek-v4-flash-vision-exp` to every cli-opencode provider that already carries plain V4 Flash **and offers the variant**: `llmgateway` (via WS1), `openrouter/deepseek/deepseek-v4-flash-vision-exp`, `opencode-go/deepseek-v4-flash-vision-exp` (variants `low`/`high`/`max`, 1M context). `cline-pass` carries plain V4 Flash but **offers no vision id** — `opencode models cline-pass` returns only `deepseek-v4-flash`, `deepseek-v4-pro`, `glm-5.3`. Its absence is documented as a provider limitation, exactly as the existing GLM-5.3-Flash-on-Cline callout documents that gap.

**WS3 — Gemini 3.7 Flash → 3.8, hub-wide.** Every surface that names the model, in all four CLI modes plus the shared runtime:

| Mode | Old id | New id |
|------|--------|--------|
| cli-opencode / cli-pi (OpenRouter) | `google/gemini-3.7-flash` | `google/gemini-3.8-flash` |
| cli-cursor | `gemini-3.7-flash-high` | `gemini-3.8-flash-high` |
| cli-devin | `gemini-3-7-flash-high` | `gemini-3-8-flash-high` |

Both enforced fan-out rosters move with them: `PI_SUPPORTED_MODELS` / `CURSOR_SUPPORTED_MODELS` / `DEVIN_SUPPORTED_MODELS` in `executor-config.ts`, their `*_ALLOWED_MODELS` mirrors and `PI_MODEL_PROVIDERS` in `fanout-run.cjs`, and the vitest fixtures pinning all three.

**WS4 — One remaining truth fix inside the edited paragraphs.** The GLM-5.3-Flash "no `max` on any route" claim was **already corrected by packet `061`** on 2026-09-04, which found it was not merely a doc error but a shipped runtime pin sending both fan-out routes a tier their provider does not offer. The catalogs now read `max` for OpenRouter and opencode-go, `xhigh` for Cline only. What remains for WS1 here is to add the `llmgateway` route to that same per-route picture: it carries **both** `xhigh` and `max`, and is dispatched at `max`. The `cli-reference.md` "OpenRouter routes DeepSeek V4 Flash only" line becomes the current allowlist. Both sit in blocks WS1–WS3 already rewrite; leaving a known-false sentence in a paragraph being edited would ship a lie this packet had its hands on.

**WS5 — Retire DeepSeek V4 Pro from every roster.** cli-devin is the only roster still carrying it, and it carries three ids, not two: `deepseek-v4-pro`, `deepseek-v4-pro-max`, and the bare **`deepseek-v4`**, which the devin catalog documents as the V4 Pro family uid (`cli-devin/references/providers-and-models.md:53`). All three leave `DEVIN_SUPPORTED_MODELS` and `DEVIN_ALLOWED_MODELS`, dropping that allowlist from 17 ids to 14. Devin keeps `deepseek-v4-flash-max`, so the DeepSeek family stays represented and the curated family count is unchanged.

Removing the ids is the easy half. The harder half is that devin's guidance recommends `deepseek-v4-pro-max` for reasoning-heavy work in five places — `SKILL.md` (the selection strategy, the dispatch-rules line, and the "Use deepseek" trigger row), `README.md`, and the `cli-reference.md` §5 rationale table's architecture, security and planning rows. Each repoints to `gpt-5-6-luna-max`, which stays on the allowlist. Leaving them would have devin recommending a model its own allowlist rejects, which is worse than the state before the removal.

No other CLI needs a removal: cli-opencode retired V4 Pro from its catalog already, cli-pi's `PI_SUPPORTED_MODELS` never carried it, and cli-cursor never had it. One stale **example** does need fixing — `cli-claude-code/references/claude-tools.md:242` illustrates the `--variant` lever with `deepseek-v4-pro`, and repoints to a model that is still real.

**WS6 — Repair the pi config.** Two defects, both under `.pi/`:
- **Dead entry:** delete the `cline-pass/deepseek-v4-pro` model block from `.pi/models.json`, then update the two cli-pi playbook lines that instruct a reader to expect it and not dispatch it. Once the block is gone, "it may still appear" stops being true and the playbook would otherwise teach a reader to look for something absent.
- **Missing entry:** add `openrouter/google/gemini-3.8-flash` to `.pi/settings.json` `enabledModels`, closing the gap where the fan-out roster accepts a Gemini model the interactive picker cannot offer. This is the item §9 flagged and the operator directed be fixed.

### Out of Scope
- **Any of the other 179 `llmgateway` ids.** The closed roster is the enforcement; four is what the operator picked. Adding Claude, GPT-5.x, Grok, Kimi or Qwen through DevPass is a separate decision with its own packet.
- **Every other gap in `.pi/settings.json`.** WS6 adds the one Gemini id and removes the one dead V4 Pro block. It does not audit the other nine `enabledModels` entries, reconcile `defaultModel`, or touch `.pi/models.json` beyond deleting that block.
- **The `gemini-3.8-flash-low` / `-medium` sibling tiers on cursor, and `-low` / `-medium` on devin.** The curated scope has been High-tier-only since packet 043; this swap preserves that policy rather than revisiting it.
- **`llmgateway/auto`, and the DeepSeek V4 Pro vision siblings.** The `auto` router can silently resolve outside a closed roster, which is why cursor's `auto` is excluded too. V4 Pro itself is now IN scope under WS5 — being removed, not added.
- **cline-pass vision.** Not offered by the provider; documented, not worked around.
- **Historical changelog files, and the V4 Pro references in the incident record.** Left as written record, per the precedent set by packet 057. `cli-opencode/references/destructive-scope-violations.md` and the `SKILL.md` line citing it describe a real 2026-05-04 incident that happened with `opencode-go/deepseek-v4-pro`; that is history and stays accurate as written. Retiring a model does not rewrite what it did.
- **A code-enforced allowlist for cli-opencode.** It has none by design; this packet does not introduce one.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | New `llmgateway` §2 section (4 rows + DevPass tier note); openrouter Gemini row 3.7→3.8 + vision row; opencode-go vision row; cline-pass vision-absent callout; GLM `max` claim corrected; §4 variant table gains an `llmgateway` row |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Provider prose at the two model-selection points: add llmgateway, carry Gemini to 3.8 |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | Modify | Auth pre-flight gains an `llmgateway` login line; the stale "OpenRouter routes DeepSeek V4 Flash only" claim corrected |
| `.opencode/skills/cli-external-orchestration/cli-opencode/README.md` | Modify | Provider roster prose |
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | OpenRouter callout + row: Gemini 3.7 → 3.8 |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/supported-model-allowlist-smoke.md` | Modify | Expected-id list carries `google/gemini-3.8-flash` |
| `.opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md` | Modify | Allowlist row + provenance note → `gemini-3.8-flash-high` |
| `.opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md` | Modify | Model table + selection guidance |
| `.opencode/skills/cli-external-orchestration/cli-cursor/README.md` | Modify | Two allowlist prose sites |
| `.opencode/skills/cli-external-orchestration/cli-cursor/assets/prompt-templates.md` | Modify | Enforced-allowlist id list |
| `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md` | Modify | 21-id enumeration |
| `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` | Modify | Curated-families line → `gemini-3-8-flash-high`; drop all three V4 Pro ids; repoint the selection strategy, dispatch-rules line and "Use deepseek" trigger row |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md` | Modify | Roster row + provenance note; record the `gemini` alias moving to 3.8 and the 2x price change; delete the two V4 Pro rows and the max-tier provenance note's V4 Pro half |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `PI_SUPPORTED_MODELS`, `CURSOR_SUPPORTED_MODELS`, `DEVIN_SUPPORTED_MODELS` (Gemini swap + three V4 Pro removals) and their doc comments |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | `PI_ALLOWED_MODELS`, `PI_MODEL_PROVIDERS`, `CURSOR_ALLOWED_MODELS`, `DEVIN_ALLOWED_MODELS` (Gemini swap + three V4 Pro removals) + comments |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Roster assertions + negative fixtures |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Allowed-model fixtures, provider-map coverage, negatives |
| `.opencode/skills/cli-external-orchestration/cli-devin/README.md` | Modify | Model-choice FAQ repoints off `deepseek-v4-pro-max` |
| `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md` | Modify | Drop the V4 Pro invocation examples and `/model` lines; repoint the §5 architecture / security / planning rows and the `DEVIN_MODEL` example |
| `.opencode/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md` | Modify | `--variant` example stops naming a retired model |
| `.pi/models.json` | Modify | Delete the `cline-pass/deepseek-v4-pro` block |
| `.pi/settings.json` | Modify | `enabledModels` gains `openrouter/google/gemini-3.8-flash` |
| `.opencode/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/model-dispatch/cline-provider-id-format-dispatch.md` | Modify | Two lines describing the now-deleted V4 Pro entry |
| `.opencode/skills/cli-external-orchestration/changelog/v1.4.6.0.md` | Create | Hub changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `llmgateway` section carries exactly the four operator-chosen models | `providers-and-models.md` §2 has an `llmgateway` heading with 4 rows and no fifth; `llmgateway/auto` is absent |
| REQ-002 | Every id, variant ladder and price is live-sourced, never inferred | Each row traceable to `opencode models llmgateway --verbose` output captured in `scratch/`; no row claims a dispatch test that was not run |
| REQ-003 | Gemini 3.8 replaces 3.7 on every in-scope surface, with none missed | `rg -n 'gemini-3\.7\|gemini-3-7' .opencode/skills/cli-external-orchestration .opencode/skills/system-deep-loop/runtime` returns hits only in `changelog/` and `benchmark/` |
| REQ-004 | The three fan-out roster pairs stay byte-consistent | `PI_SUPPORTED_MODELS`==`PI_ALLOWED_MODELS`, `CURSOR_*` and `DEVIN_*` likewise; every pi id resolves in `PI_MODEL_PROVIDERS` |
| REQ-005 | The runtime stays green | `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` exits 0; `tsc --noEmit` adds no new error in a touched file, measured against a baseline captured first |
| REQ-006 | Vision lands on exactly the three providers that offer it | Vision rows exist for `llmgateway`, `openrouter`, `opencode-go`; the `cline-pass` section states the variant is not offered and names the `opencode models cline-pass` evidence |
| REQ-007 | The remaining false claim is corrected | No surface says OpenRouter routes DeepSeek only. The GLM `max` claim is already fixed by packet `061`; this packet must not reintroduce it when editing the same rows |
| REQ-012 | All three DeepSeek V4 Pro ids leave the devin allowlist | `DEVIN_SUPPORTED_MODELS` and `DEVIN_ALLOWED_MODELS` each hold 14 ids and none of `deepseek-v4`, `deepseek-v4-pro`, `deepseek-v4-pro-max`; `deepseek-v4-flash-max` survives |
| REQ-013 | No surface recommends a model its own allowlist rejects | Every V4 Pro recommendation across devin `SKILL.md`, `README.md` and `cli-reference.md` §5 names an id still present in the allowlist |
| REQ-014 | The pi config is repaired on both counts | `.pi/models.json` has no `deepseek-v4-pro` block and parses as valid JSON; `.pi/settings.json` `enabledModels` contains `openrouter/google/gemini-3.8-flash` and parses; the two playbook lines match the new reality |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Each of the four DevPass models completes a real dispatch | `opencode run --model llmgateway/<id> --variant <tier> --format json` returns a model reply per model; transcript in `scratch/evidence/` |
| REQ-009 | Gemini 3.8 confirmed live on cursor and devin | A `cursor-agent -p --model gemini-3.8-flash-high` and a `devin -p --model gemini-3-8-flash-high` probe each return a reply, matching the dispatch-tested standard packet 043 set for the 3.7 ids |
| REQ-010 | Vision is proven, not assumed | One dispatch per vision-carrying provider passes an image attachment and gets a description; a text-only reply does not satisfy this |
| REQ-011 | The packet validates | `validate.sh <folder> --strict` prints `RESULT: PASSED` with `Errors: 0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator reading `providers-and-models.md` can dispatch a DevPass model without opening another file, and knows why no weekly cap applies to these four.
- **SC-002**: A deep-loop fan-out dispatch of `google/gemini-3.8-flash`, `gemini-3.8-flash-high` or `gemini-3-8-flash-high` is accepted; the 3.7 forms are rejected by the same allowlists.
- **SC-003**: Vision is reachable from cli-opencode on three providers, and the fourth's inability is stated rather than left blank.
- **SC-004**: No id, tier or price in the hub contradicts what the live CLIs return on 2026-09-04.
- **SC-005**: The DevPass roster remains four models — the closed-roster discipline held under the temptation of 183 available ids.
- **SC-006**: A devin dispatch of any DeepSeek V4 Pro id is rejected at the allowlist, and no document anywhere in the hub still suggests reaching for one.
- **SC-007**: An operator opening pi's model picker can select the same Gemini model the fan-out roster accepts, and cannot select a V4 Pro entry that no longer exists.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 183 ids behind one flat-price key erodes the closed roster | The roster stops being a decision and becomes a default | Four rows, enumerated in REQ-001; every addition needs its own packet |
| Risk | Gemini swapped in docs but not in the enforced rosters | Docs name a model the fan-out rejects — the exact split option 2 of the operator fork would have created | REQ-003's sweep spans docs and runtime in one regex; REQ-004 pins roster equality |
| Risk | `gemini-3.8-flash-high` assumed to exist by symmetry with 3.7 | A fabricated id in a code-enforced allowlist fails closed at dispatch time | Already gated: `cursor-agent --list-models` and `devin models list` both printed the 3.8 tiers on 2026-09-04 before this spec was written |
| Risk | Vision assumed from `attachment: true` | The flag describes the catalog, not a successful round trip | REQ-010 requires a real image dispatch, not a text reply |
| Risk | Devin 3.8 costs 2x 3.7 ($1.5/$7.5 vs $0.75/$3.75 per 1M) | Silent spend increase on every fan-out lineage using the devin Gemini lane | Recorded in the devin catalog row and the changelog so the cost is chosen, not discovered |
| Risk | `tsc --noEmit` errors predate the change | A pre-existing failure gets attributed to this packet, or hides a real one | Baseline captured in Phase 1 before any edit (T001) |
| Risk | V4 Pro ids removed but its recommendations left behind | devin would advise a model its own allowlist rejects — a worse failure than leaving it, because it fails at dispatch rather than at review | REQ-013 covers the recommendation text as a first-class requirement, not as cleanup |
| Risk | The bare `deepseek-v4` alias is missed | The family uid stays dispatchable and the "removed" claim is false | REQ-012 names all three ids explicitly; the id-count assertion (17 → 14) catches a partial removal that a grep for `-pro` would not |
| Risk | Deleting the `.pi/models.json` block breaks JSON or the provider entry | pi fails to load its Cline provider | `node -e JSON.parse` on both pi files before and after; the block is one of three in the array, not the array itself |
| Dependency | DevPass subscription active | No dispatch | Green — `opencode auth list` shows the credential; `llmgateway/claude-haiku-4-5` returned `PONG-DEVPASS` on 2026-09-04 |
| Dependency | cursor + devin CLIs authenticated | REQ-009 blocked | Green — both `--list-models` calls succeeded on 2026-09-04 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Each `*_SUPPORTED_MODELS` array and its `*_ALLOWED_MODELS` mirror MUST list identical ids (fail-closed sync invariant, guard-asserted).
- **NFR-M02**: Every allowlisted pi model MUST carry a `PI_MODEL_PROVIDERS` entry.
- **NFR-M03**: The `llmgateway` section MUST follow the shape of the existing `cline-pass` section — provider-id caveat, endpoint, three-segment-vs-two-segment id form, per-model variant ceiling — so a reader who knows one knows both.

### Honesty
- **NFR-H01**: No id, tier, price or capability may be written without a live source. "List-verified" and "dispatch-tested" are distinct claims and MUST NOT be interchanged.
- **NFR-H02**: A model id present on a provider but deliberately excluded MUST read as excluded, not as absent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Model ids
- **No `-latest` alias on DevPass.** The operator asked for "DeepSeek V4 Flash (latest)"; `llmgateway` publishes no `-latest` pointer. The bare `llmgateway/deepseek-v4-flash` **is** the current pointer, and there is no `-latest` vision alias on any provider. The catalog says so, so a reader does not hunt for one.
- **`~`-prefixed OpenRouter ids.** `opencode models openrouter` prints alias pointers with a leading `~` (`openrouter/~deepseek/deepseek-v4-flash-latest`). The `~` is a display marker for an alias, not part of the dispatch string; the catalog and `.pi/settings.json` disagree on this today and the catalog form is correct.
- **Two-segment vs three-segment.** `llmgateway` takes `llmgateway/<id>` (two segments), unlike `cline-pass/cline-pass/<id>` and `openrouter/<upstream>/<id>`. Getting this wrong is the single most likely dispatch error against the new section.

### Thinking tiers
- **`llmgateway/glm-5.3-flash` has `max`; the OpenRouter and Cline routes do not.** The ceiling is per-route, and the current blanket "no `max` on any route" sentence is false. Corrected under WS4.
- **Gemini tops at `high` on every route.** 3.8 keeps 3.7's ladder (`minimal`/`low`/`medium`/`high`) — no `max`, no `xhigh`. It stays outside `isFlashMaxPinnedModel`, so the version bump needs no pin change.
- **The vision variant has a shorter ladder than plain flash.** `llmgateway/deepseek-v4-flash-vision-exp` exposes `none`/`low`/`high`/`max` — no `minimal`, `medium` or `xhigh`. `max` is present, so the flash max-pin policy still applies cleanly.

### Retirement
- **`deepseek-v4` is the V4 Pro uid, not a separate model.** The devin catalog records this at `providers-and-models.md:53`. A removal that greps for `deepseek-v4-pro` leaves the bare alias behind and quietly keeps V4 Pro dispatchable.
- **Removing a model is two jobs.** The id leaves the allowlist, and every recommendation of it leaves the prose. Doing only the first turns a documentation problem into a runtime rejection.
- **Retirement does not rewrite history.** The 2026-05-04 destructive-scope incident happened with `opencode-go/deepseek-v4-pro`. That record keeps the model name, because changing it would falsify the incident.
- **`devin models list` still offers V4 Pro.** Retirement here is a curation decision, not an upstream removal: the ids stay live on the provider and stay forbidden for this hub. The catalog must read as *excluded*, not as *absent*.

### Providers
- **`cline-pass` carries plain flash but no vision.** Same shape as the existing GLM-5.3-Flash-on-Cline gap: reach vision through another provider.
- **Devin's `gemini` alias has moved.** It now resolves to the 3.8 family. Any doc naming the bare alias must be read as 3.8 after this ships.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **Which DevPass models enter the roster?** **RESOLVED (operator, 2026-09-04):** exactly four — `deepseek-v4-flash`, `deepseek-v4-flash-vision-exp`, `glm-5.3-flash`, `gemini-3.8-flash`.
- **How far does the Gemini swap reach?** **RESOLVED (operator, 2026-09-04):** everywhere the hub names it, cursor and devin included, gated on a live `--list-models` check. The gate was run before this spec was written and **passed** on both CLIs.
- **Does `.pi/settings.json` need a Gemini swap?** **RESOLVED (operator, 2026-09-04): it needs an ADD, and it is now in scope.** `enabledModels` holds eleven ids and **not one Gemini id**, though packet 055's spec lists adding `openrouter/google/gemini-3.7-flash` there among its shipped changes — so either that edit was dropped or the spec overstated it. There is nothing to *swap*; WS6 adds `openrouter/google/gemini-3.8-flash` outright. This began as a finding flagged for the operator and deliberately left unfixed; the operator's "also fix pi" instruction moved it in.
- **How far does "remove DeepSeek V4 Pro from all rosters" reach?** **RESOLVED (evidence + operator, 2026-09-04):** exactly one enforced roster carries it — cli-devin's, under three ids. cli-opencode retired it earlier, cli-pi never had it, cli-cursor never had it. The remaining V4 Pro strings in the hub are an inert `.pi/models.json` block (deleted under WS6), a stale `--variant` example in cli-claude-code, and the 2026-05-04 incident record, which stays.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Prior art**: `055-glm-5-3-flash-gemini-roster` (the Gemini 3.7 + GLM-5.3-Flash rows this packet moves), `049-cline-provider-roster` (the third-party-gateway section shape `llmgateway` follows), `043-roster-update-luna-deepseek-glm-gemini` phase 004 (the cursor/devin Gemini High-tier-only curation policy), `044-deepseek-v4-flash-max-only` (the flash max-pin), `057-roster-drop-grok-from-devin` (leave changelogs as historical record)
- **Changelog**: `.opencode/skills/cli-external-orchestration/changelog/v1.4.6.0.md`
<!-- /ANCHOR:related-docs -->
