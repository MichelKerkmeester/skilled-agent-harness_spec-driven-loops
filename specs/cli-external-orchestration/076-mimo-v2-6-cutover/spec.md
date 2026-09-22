---
title: "Feature Specification: MiMo v2.5 to v2.6 cutover across skills settings and deep-loop allowlists"
description: "The Xiaomi MiMo ids moved to the v2.6 generation. Every living dispatch surface — the cli-pi and cli-opencode documents, the .pi settings' enabledModels, and the deep-loop Pi/Hermes allowlists that enforce the roster — still names a mimo-v2.5 token, so a dispatch that trusts these surfaces resolves a generation the gateway no longer answers for."
trigger_phrases:
  - "mimo v2.6 cutover"
  - "mimo v2.5 to v2.6"
  - "mimo id rename"
  - "xiaomi mimo roster cutover"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: MiMo v2.5 to v2.6 cutover across skills settings and deep-loop allowlists

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-22 |
| **Branch** | `main` (working directly, operator-selected; the working tree carried one unrelated machine-state hunk in `.pi/settings.json` before this packet started) |
| **Origin** | Operator: "Replace all instances of MiMo v2.5 with v2.6 in cli-pi and cli-opencode skills AND also the .pi settings"; the deep-loop and cli-hermes surfaces were folded in 070-style by consent after the operator chose "Extend like 070"; the official-xiaomi wiring of the two renamed ids in `.pi/models.json` added mid-flight by the operator's "in cli pi please use official xiaomi provider for mimo 2.6" |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The operator directed that the MiMo model ids move from the v2.5 to the v2.6 generation. Sixty-seven occurrences across the two skills (15 files) still read `mimo-v2.5`-family tokens, plus two `enabledModels` lines in `.pi/settings.json`, the deep-loop enforcement that decides whether a Pi or Hermes dispatch resolves at all, and the cli-hermes closed roster that documents it. Meanwhile the installed pi's bundled catalogs still serve only v2.5 ids — observed directly in `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/node_modules/@earendil-works/pi-ai/dist/providers/data/xiaomi.json` — so the renamed settings entries resolve only when the installed pi's catalogs carry v2.6; that resolution check is the operator's, not this packet's.

The enforcement half is the reason the scope extends past documentation: `PI_SUPPORTED_MODELS`, its synchronous mirror in `fanout-run.cjs`, `HERMES_SUPPORTED_MODELS`, the `HERMES_ALLOWED_MODELS` copy, the provider map, and the tests that assert the "Hermes equals Pi's roster minus the one id the gateway refuses" pairing must all move in one pass, because the pairing comment itself says two lists meant to hold the same ids drift, and the drift surfaces as a model one runtime accepts and the other refuses.

### Purpose

Every living surface that names a MiMo id — skills, settings, enforcement, mirrors, tests — reads the v2.6 generation, and the paired roster copies move together so no count of them drifts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The mechanical, case-preserving rename: `mimo-v2.5` → `mimo-v2.6` (covering `-pro`, `-pro-ultraspeed`, `-free`, and the bare id) and `MiMo-V2.5-Pro` → `MiMo-V2.6-Pro`. Only tokens containing `v2.5` change; the `mimo-v2`-bare, `-pro`, `-omni` and `-flash` ids are not v2.5 and stay.
- The living documents of cli-opencode (7 files) and cli-pi (1 file) and cli-hermes (5 files).
- `.pi/settings.json`'s two `enabledModels` lines, plus — added mid-flight by the operator's "in cli pi please use official xiaomi provider for mimo 2.6" — the matching `.pi/models.json` definitions that make those renamed ids resolve under the official Xiaomi Direct provider (base `https://api.xiaomimimo.com/v1`, inherited from the built-in registration): a `providers.xiaomi.models` array defining `mimo-v2.6-pro` and `mimo-v2.6-pro-ultraspeed`, whose field values are inherited verbatim from the official v2.5-pro/-ultraspeed store definitions because the `xiaomi`-provider catalog still publishes no v2.6 metadata (the inheritance is labeled INFERRED, and the parts the elsewhere-listing corroborates are marked as such in the records)
- The deep-loop enforcement set and its mirrors: `PI_SUPPORTED_MODELS` and `HERMES_SUPPORTED_MODELS` in `executor-config.ts`, the Pi allowlist copy, `PI_MODEL_PROVIDERS` and `HERMES_ALLOWED_MODELS` in `fanout-run.cjs`, and the test expectations that pin them — including the paired-roster comment's model token, whose durable WHY (the gateway's HTTP-400 rationale) survives unchanged.
- The deep-ai-council illustrative dispatches that name the old id.
- Version bumps and one new changelog entry per affected skill, each carrying `version` in its YAML frontmatter: cli-opencode 1.4.6.0 → 1.4.7.0, cli-pi 1.5.4.0 → 1.5.5.0, cli-hermes 1.0.0.0 → 1.0.1.0.

### Out of Scope
- **Historical changelog bodies** (five cli-opencode files, one cli-pi file — 25 occurrence lines) and the dated PI-017 evidence cell in cli-pi's `supported-model-allowlist-smoke.md`. They record what was true when written; the 070 precedent kept nine such files. After this packet the evidence cell's captured output describes the pre-cutover `executor-config.ts` — an accepted, recorded drift.
- **Dated benchmark reports and profiles** (`benchmark/`, `capability-m3-vs-mimo*`): their filenames and contents record what was benchmarked.
- **The hub.** No v2.5 string exists at hub level — verified by grep — so no vocabulary widening, no ROUTER or hub-metadata edit, and no compiled-route re-mint.
- **The installed pi's bundled catalogs and its `models-store.json` cache.** Both still serve only the v2.5 trio under the `xiaomi` provider (observed: the 0.87.0 catalog file and the 2026-09-22T07:49Z etag-fetched store, lastModified 2026-09-21); the `.pi/models.json` definitions compose above them — observed, not assumed — and the picker remints itself when upstream publishes. The `mimo-v2.6-flash` and `-pro`/`-pro-ultraspeed` ids that today's model listing already shows under `opencode-go` and `openrouter` are those routes' own catalogs; wiring them is not this packet's.
- **The pre-existing `lastChangelogVersion` 0.86.1 → 0.87.0 hunk** in `.pi/settings.json`: machine state from before this packet, riding along in the same file, recorded here rather than silently absorbed.
- **Other tracks' surfaces** (sk-*, mcp-tooling, others) even where they mention MiMo: the operator named the two skills, the settings, and — by consent — the deep-loop and HerMeS surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/settings.json` | Modify | Two `enabledModels` entries: `xiaomi/mimo-v2.5-pro` and `xiaomi/mimo-v2.5-pro-ultraspeed` → v2.6 |
| `.pi/models.json` | Modify | `providers.xiaomi` gains a `models` array defining both v2.6 ids on the official Xiaomi Direct provider — no `baseUrl`/`api`/`apiKey` needed (the built-in registration supplies them; proven by a throwaway `PI_CODING_AGENT_DIR` probe where a bare models array registered); a throwaway-dir probe also proved the array MERGES with the built-in catalog rather than replacing it, and that omitted `contextWindow`/`maxTokens` would have rendered the picker's 128K/16.4K defaults |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | The one live occurrence (version 1.4.6.0 → 1.4.7.0 in the same edit) |
| `.skilled/skills/cli-external-orchestration/cli-opencode/README.md` | Modify | The small-model dispatch mention |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | Modify | Seven occurrence lines: dispatch shapes, §5 model row |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | The `xiaomi` provider's roster rows |
| `.skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md` | Modify | The MiMo dispatch-shape template(s) |
| `.skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md` | Modify | The per-model override row |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/multi-provider/variant-levels-comparison.md` | Modify | Line 58, the live variant-levels dispatch row |
| `.skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.4.7.0.md` | Create | One entry, `version` in frontmatter; how this skill records every roster change |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | The two Xiaomi roster rows |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | Version 1.5.4.0 → 1.5.5.0 (frontmatter; no other occurrence lives here) |
| `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.5.0.md` | Create | One entry, frontmatter carries `version` |
| `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md` | Modify | The closed-roster paragraph, line 198; version 1.0.0.0 → 1.0.1.0 in the same edit |
| `.skilled/skills/cli-external-orchestration/cli-hermes/README.md` | Modify | The model-roster row |
| `.skilled/skills/cli-external-orchestration/cli-hermes/feature-catalog/fanout-dispatch/closed-model-roster.md` | Modify | The `HERMES_SUPPORTED_MODELS` declaration it mirrors |
| `.skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md` | Modify | The roster table row |
| `.skilled/skills/cli-external-orchestration/cli-hermes/manual-testing-playbook/manual-testing-playbook.md` | Modify | Step 4's roster-minus-one sentence |
| `.skilled/skills/cli-external-orchestration/cli-hermes/changelog/v1.0.1.0.md` | Create | One entry, frontmatter carries `version` |
| `.skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.4.7.0.md` | Create | One entry, frontmatter carries `version` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `PI_SUPPORTED_MODELS` lines 226-227, `HERMES_SUPPORTED_MODELS` line 266 |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Pi allowlist copy lines 2305-2306, `PI_MODEL_PROVIDERS` 2526-2527, `HERMES_ALLOWED_MODELS` line 2626 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Lines 953-954, the paired-roster comment at 984, positive pairing 989, negative 991, effort-pinning loop 1015 |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Provider-map expectation lines 1884-1885 |
| `.skilled/skills/system-deep-loop/deep-ai-council/SKILL.md` | Modify | Line 357, the within-round example dispatch |
| `.skilled/skills/system-deep-loop/deep-ai-council/references/patterns/seat-diversity-patterns.md` | Modify | Lines 138 and 240, the same example in pattern and ASCII-diagram form |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No living surface in the three skills names a `mimo-v2.5`-family token | A scoped ripgrep over the four skill trees returns survivors only inside `changelog/` bodies and the dated PI-017 evidence cell |
| REQ-002 | The deep-loop enforcement pair, both mirrors and the provider map read the v2.6 ids | Four-file ripgrep returns zero hits; the renamed ids appear in `PI_SUPPORTED_MODELS`, `HERMES_SUPPORTED_MODELS`, the fan-out copies and `PI_MODEL_PROVIDERS` |
| REQ-003 | The suites that read the allowlist still pass, and the TypeScript still compiles | The 070 trio (`executor-config`, `fanout-run`, `combo-matrix`) exits 0 at or above the 259-test baseline, and `npm run typecheck` exits 0 |
| REQ-004 | `.pi/settings.json` carries the renamed ids and remains parseable | Both `xiaomi/mimo-v2.6-*` entries present; a JSON.parse of the file exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Version bumps and changelog entries ship for the three affected skills, and the repository's frontmatter gate accepts them | `check-frontmatter-versions.sh` reports zero failures; each new entry's YAML carries `version` |
| REQ-006 | The HerMeS pairing claim stays truthful | The pairing test asserts Hermes = Pi's roster minus the `-ultraspeed` id at their v2.6 spellings; the comment keeps its durable WHY (gateway-HTTP-400 rationale) with only the model token changed |
| REQ-007 | The spec packet validates | `validate.sh` on this packet with `--strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The scoped ripgreps return exactly the documented remainder — historical changelog bodies, the PI-017 evidence cell, and nothing else
- **SC-002**: The 070 trio passes at or above 259 tests and `npm run typecheck` exits 0, both from the final state
- **SC-003**: `check-frontmatter-versions.sh` reports zero failures across the repository
- **SC-004**: `validate.sh` on this packet prints `RESULT: PASSED`
- **SC-005**: The scoped diff contains only this packet's recorded files plus the recorded riding-along hunk; nothing else moved
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The installed pi's bundled catalogs and today's models-store still serve only v2.5 ids under the `xiaomi` provider (observed), so the renamed `enabledModels` had nothing to resolve | High for dispatch, none for correctness of this packet | Resolved in-packet: the `.pi/models.json` definitions register the v2.6 ids under the official provider — `pi --list-models` on the real agent dir lists both at 1.0M/131.1K with the v2.5 trio intact; what remains the operator's is the one live dispatch, since the listing carries no availability column |
| Risk | A blanket replace deletes or alters `mimo-v2-*` ids (v2, v2-pro, v2-omni, v2-flash) that the catalogs still serve | Med | Replacement patterns are anchored to `v2.5`; the token census (five shapes, 67 occurrences) bounds the blast; post-edit greps verify |
| Risk | The gateway's HTTP-400 rationale for HerMeS excluding `-ultraspeed` was observed against the v2.5 spelling; the packet does not re-probe v2.6 | Low | The pairing test guards membership, not the 400; the dated observation stands in the changelog record; a live re-probe belongs to the playbook's next run |
| Risk | Two roster copies (TypeScript and `.cjs`) drifting | Med | Both move in the same pass, and the pairing plus provider-map tests assert across them — the 070 lesson |
| Dependency | The two `enabledModels` ids are operator-asserted as the v2.6 spellings | Low | They follow the exact mechanical shape of their v2.5 predecessors; divergence, if any, surfaces in the operator's resolution check |
| Risk | The `.pi/models.json` definitions' display fields — contextWindow 1M, maxTokens 131072, the per-id costs, the deepseek thinkingFormat compat — are inherited verbatim from the official v2.5-pro/-ultraspeed definitions, because no upstream v2.6 metadata exists yet | Low | The 1M/131.1K context shape is corroborated by the same ids' published rows under `opencode-go` and `openrouter` in today's listing; the costs remain INFERRED until the upstream xiaomi catalog publishes them, and they affect only what the picker prints, never what resolves |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the gateway now serve `mimo-v2.6-pro-ultraspeed` for HerMeS, or does the 400-rationale carry over unchanged? Unprobed; the packet retains the pairing, and the answer only affects whether HerMeS's roster could later widen, not this rename.
- When the installed pi's catalogs will carry v2.6 is the operator's; until then its model picker may show the v2.5 spellings alongside the settings' v2.6 entries.
<!-- /ANCHOR:questions -->

---
