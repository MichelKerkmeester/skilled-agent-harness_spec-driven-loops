---
title: "Acceptance Criteria: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "gpt-6 cutover acceptance"
  - "luna sol closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/077-gpt-6-luna-sol-cutover"
    last_updated_at: "2026-09-23T18:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Every criterion met; Phase 6 pushed with CI green"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "077-gpt-6-luna-sol-cutover"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 6 keeps the Sol smokes skipped"
      - "Phase 6 keeps CLAUDE_DEFAULT_MODEL and leaves gpt-6-astra off the rosters"
      - "Phase 6 applies the Codex default and removes both Xiaomi credentials, each file backed up first"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 077-gpt-6-luna-sol-cutover
**Level:** 2
**Status:** Complete
**Date:** 2026-09-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the in-scope skills, runtime, config and mirrors, When the residue scan runs, Then no `gpt-5.6-luna` or `gpt-5.6-sol` hit remains outside the recorded history, and the Luna Max persona counts are unchanged | `tasks.md` T012: one residue hit, the PI-017 captured-output cell; persona counts 26 files and 88 occurrences before and after | Met | - |
| AC-002 | REQ-002 | Given the deep-loop allowlists and their CJS mirrors, When the six runtime suites and typecheck run, Then they pass at or above the 391-passed baseline and typecheck exits 0 | `tasks.md` T013: 391 passed, 1 skipped, exit 0, equal to baseline; typecheck exit 0 | Met | - |
| AC-003 | REQ-003 | Given the Pi config, When `pi --list-models gpt-6` runs, Then `llmgateway/gpt-6-luna`, `openai-codex/gpt-6-luna` and `openai-codex/gpt-6-sol` are listed | `tasks.md` T014, rerun after the catalog refresh: all three listed, built-in `openai-codex` models intact | Met | - |
| AC-004 | REQ-004 | Given the Hermes roster, When its declaration and fan-out mirror are read, Then both name `gpt-6-luna` and `gpt-6-sol` and hold seven ids | `executor-config.ts` `HERMES_SUPPORTED_MODELS` and `fanout-run.cjs` `HERMES_ALLOWED_MODELS`, seven ids each; the Hermes pairing test passes in T013 | Met | - |
| AC-005 | REQ-005 | Given cli-claude-code's living docs and mirror, When searched for Opus 4.x, Then nothing matches and each roster carries one `claude-opus-5-5` row | `tasks.md` T008 and T012: zero `claude-opus-4` or `Opus 4.x` hits; one Opus row in each roster | Met | - |
| AC-006 | REQ-006 | Given the five affected skills, When their `SKILL.md` and changelogs are read, Then each carries a patch bump and one new changelog with `version` frontmatter, and the frontmatter gate passes | `tasks.md` T010 and T015: 1.9.1.0, 1.4.9.0, 1.5.7.0, 1.0.2.0, 1.5.1.0; gate exit 0 | Met | - |
| AC-007 | REQ-007 | Given the Hermes mirrors, When `sync-skills-hermes.cjs --check` runs, Then none of the five touched skills drifts | `tasks.md` T011 and T015: drift fell from 6 to 3, and the 3 left are untouched skills | Met | - |
| AC-008 | REQ-008 | Given the pi fast-mode extension, When its suite runs, Then it passes 77/77 with the GPT-6 ids in its priority list | `tasks.md` T013: 77/77 | Met | - |
| AC-009 | REQ-009 | Given cli-opencode's living docs, When searched for `gpt-6-(luna\|sol)-pro` and read for the missing-default fallback, Then no `-pro` slug is presented as selectable and the fallback names a slug `opencode models openai` lists | `tasks.md` T021 and T032: `opencode models openai` serves astra, luna and sol with `-fast` and no `-pro`; the grid shows four served slugs; the fallback is `openai/gpt-6-sol --variant high`; the `-pro` grep has no hit | Met | - |
| AC-010 | REQ-010 | Given CX-002 and the cli-codex playbook, When the loop, step 4 and every "documented default" line are read, Then Luna, Terra and Sol run once each, step 4 reads all three outputs, and the default agrees with `SKILL.md` | `tasks.md` T022, T023 and T032: loop `for m in gpt-6-luna gpt-5.6-terra gpt-6-sol`, step 4 globs `cli-codex-cx002-gpt-*.txt`, and every "documented default" line names `gpt-5.5` or `medium` | Met | - |
| AC-011 | REQ-011 | Given cli-codex's living docs, When searched for Terra's ceiling, Then every statement says `ultra`, matching Codex's model cache, and the new cli-codex changelog corrects the released Terra line | `tasks.md` T024, T028 and T032: five Terra ceiling lines say `ultra`, matching the cache's `low` to `ultra`; `changelog/v1.9.2.0.md` corrects the v1.9.1.0 ceiling | Met | - |
| AC-012 | REQ-012 | Given the Pi docs and the committed Pi config, When compared, Then the `gpt-6-luna` row has one verification status, the picker change is documented, and PI-017 expects the ten current ids and `deepseek-v4.1-flash` with re-captured evidence | `tasks.md` T025, T026, T027 and T032: `.pi/custom-providers.md:88` reads dispatch-verified only; the xiaomi section documents the picker; PI-017 expects ten ids and `deepseek-v4.1-flash` with output captured 2026-09-23 | Met | - |
| AC-013 | REQ-013 | Given this packet, When its smoke-test claims are compared with the recorded runs, Then Codex and OpenCode `gpt-6-luna` read passed and no limitation contradicts them | `tasks.md` T018 and T031: both runs recorded as `OK`; Known Limitations lists only the Sol routes as unrun | Met | - |
| AC-014 | REQ-014 | Given each skill Phase 4 edits, When its `SKILL.md`, newest changelog and Hermes mirror are read, Then it carries one bump and one changelog, the frontmatter gate passes, and its mirror is in sync | `tasks.md` T028, T030 and T032: 1.4.10.0, 1.9.2.0 and 1.5.8.0 with one changelog each; frontmatter gate exit 0; the three mirrors are out of `sync-skills-hermes.cjs --check` drift | Met | - |
| AC-015 | REQ-015 | Given the changelog template committed at closure, When this packet's changelogs are compared with it, Then they follow its shape | `tasks.md` T029 and T042. Reopened: sk-doc/057 landed on 2026-09-23 in `5f0ab3a10b`, so the committed template is now its compact shape, and the changelogs Phase 4 matched to the older template must follow it. Met: all eleven pass 057's `check-changelog-structure.py` with 0 violations | Met | - |
| AC-016 | REQ-016 | Given the Pi fan-out code, When its allowlists and provider map are read and the six runtime suites run, Then `mimo-v2.6-pro` maps to `llmgateway`, no copy holds `mimo-v2.6-pro-ultraspeed`, the copies are equal, and the suites pass at or above the T033 baseline with typecheck exit 0 | `tasks.md` T034, T035 and T045: `mimo-v2.6-pro` → `llmgateway`; ultraspeed in neither copy; the pairing test passes; 391 passed, 1 skipped, exit 0, same as T033; typecheck exit 0 | Met | - |
| AC-017 | REQ-017 | Given cli-pi's and cli-opencode's living docs, When searched for `xiaomi/`, `xiaomi-token-plan-ams` and a `xiaomi` provider section, Then nothing matches, and every MiMo example names `llmgateway/mimo-v2.6-pro` | `tasks.md` T036, T038 and T045: no route-shaped hit; the MiMo template, routing table, fallbacks and examples name `llmgateway/mimo-v2.6-pro` | Met | - |
| AC-018 | REQ-018 | Given `.pi/settings.json` and `.pi/custom-providers.md`, When read, Then no `xiaomi/` entry remains and the gateway MiMo row is the fan-out route | `tasks.md` T037 and T045: `enabledModels` keeps `llmgateway/mimo-v2.6-pro` only; the custom-providers row calls itself the fan-out route | Met | - |
| AC-019 | REQ-019 | Given cli-hermes's roster statements, When read, Then none defines the roster as Pi's minus ultraspeed | `tasks.md` T039: both lines describe the seven as Pi's bare literals, with ultraspeed on neither roster | Met | - |
| AC-020 | REQ-020 | Given the remapped fan-out route, When a one-turn smoke runs through `llmgateway/mimo-v2.6-pro`, Then it replies `OK` | `tasks.md` T040: fan-out-built `pi … --model llmgateway/mimo-v2.6-pro --thinking high`, exit 0, `OK`, 11 s | Met | - |
| AC-021 | REQ-021 | Given each skill Phase 5 edits, When its `SKILL.md`, newest changelog and Hermes mirror are read, Then it carries one bump and one changelog, the frontmatter gate passes, and its mirror is in sync | `tasks.md` T041, T043 and T045: 1.5.9.0, 1.4.11.0 and 1.0.3.0, one changelog each; gate exit 0; the three mirrors are out of drift | Met | - |
| AC-022 | REQ-022 | Given cli-opencode's auth pre-flight block, When it runs on this machine, Then it prints `default=1 minimax_token=0 minimax_direct=1 llmgateway=1`, matching `opencode models <id>` for each provider | `tasks.md` T047: the block extracted from the edited doc printed `default=1 minimax_token=0 minimax_direct=1 llmgateway=1`, exit 0; `README.md:131` names the same check | Met | - |
| AC-023 | REQ-023 | Given the deep command sources and contracts, the deep-ai-council docs, the three MiMo profiles and cli-claude-code's comparison, When searched for `xiaomi/` and `xiaomi-token-plan`, Then nothing matches, and each regenerated contract differs from its predecessor only in the Xiaomi lines and the manifest digests | `tasks.md` T049, T050, T051, T053 and T060: no `xiaomi` hit in the Phase 6 paths, the deep command sources and contracts or the seven mirrors, and a positive control finds the gateway MiMo id; the contract word diffs hold only 3 sample-id swaps and 2 `MiniMax/Xiaomi` → `MiniMax` swaps besides digests | Met | - |
| AC-024 | REQ-024 | Given the two edited tests, When the council and remediation suites run, Then they pass 21/21 and 35/35, and the six runtime suites and typecheck hold the T046 baseline | `tasks.md` T054 and T060: council 21/21, remediation 35/35, `sweep-isolation` 15/15; six suites 391 passed, 1 skipped, exit 0 (228 s), equal to T046; typecheck exit 0 | Met | - |
| AC-025 | REQ-025 | Given each skill Phase 6 edits, When its `SKILL.md`, newest changelog and Hermes mirror are read, Then it carries one bump and one changelog that 057's checker passes, the frontmatter gate passes, and its mirror is in sync | `tasks.md` T057, T058 and T060: seven bumps with one changelog each, 057's checker 0 violations on all seven; frontmatter gate exit 0; `PASS: 70 Hermes skill copies in sync`. The hub bump first reached CI without its routing metadata, and T064 carried 3.0.1.0 into the four files; `parent-skill-check.cjs` passes on every hub | Met | - |
| AC-026 | REQ-026 | Given CX-002, cli-codex's providers reference and cli-claude-code's rosters, When read, Then CX-002 greps a file that holds the roster, cli-codex locates its profiles as `$CODEX_HOME/<name>.config.toml` files, and the current Fable id is `claude-fable-5-1` | `tasks.md` T052 and T053: CX-002 greps `providers-and-models.md` §2, which holds the roster; line 137 locates profiles as `$CODEX_HOME/<name>.config.toml`; no `claude-fable-5` left beside `claude-fable-5-1` | Met | - |
| AC-027 | REQ-027 | Given the live checks, When each runs for one turn, Then OpenCode `llmgateway/mimo-v2.6-pro` and PI-017's live step reply | `tasks.md` T048 and T062: OpenCode `llmgateway/mimo-v2.6-pro` replied `OK` in 21 s; PI-017's corrected live step exited 0 listing only its four read-only tools. The Sol routes stay operator-run by the operator's answer, T055 | Met | - |
| AC-028 | REQ-028 | Given the three home-config files, When each is read, Then Codex defaults to `gpt-6-luna`, no credential store holds `xiaomi`, and a dated backup of each file exists | `tasks.md` T056: `~/.codex/config.toml` reads `model = "gpt-6-luna"`; neither credential store lists `xiaomi` on the final recheck; each file has a `*.bak-20260923` backup | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met. Phase 6 reopened the packet on 2026-09-23 to close the six follow-ups Phase 5 recorded, and closed AC-022 to AC-028 the same day: the auth pre-flight reads real provider state, no Xiaomi route is left in the deep commands, the council docs, the benchmark profiles or cli-claude-code, the stale test fixtures pass, CX-002 and the Codex profile location point at what exists, the live MiMo and PI-017 checks replied, and the operator's own config names `gpt-6-luna` and holds no Xiaomi credential. Phase 5 reopened the packet on 2026-09-23 to move MiMo to LLM Gateway only, and AC-015 reopened with it, because sk-doc/057 became the committed template; both closed the same day. The residue scan, the unchanged suite counts and the Pi model listing carried the cutover, and Phase 4 corrected the two P1 and five P2 doc defects a fresh review of the pushed commits found. Left out on purpose: a live billed round-trip through the Codex, OpenCode and Hermes Sol routes and `claude-opus-5-5`, which the operator kept skipped, the two named Codex profile files, which wait for the operator's yes, and the adjacent defects listed in `implementation-summary.md`.
<!-- /ANCHOR:closure -->
