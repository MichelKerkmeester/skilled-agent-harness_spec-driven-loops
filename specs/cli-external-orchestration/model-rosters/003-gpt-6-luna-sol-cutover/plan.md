---
title: "Implementation Plan: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code"
description: "A scripted, exclusion-aware token rename across the cli skills, the deep-loop allowlists and the pi config, followed by hand edits where a rename would leave a false claim, a duplicate row or an unresolvable Pi model."
trigger_phrases:
  - "gpt-6 cutover plan"
  - "luna sol rename plan"
  - "llmgateway gpt-6-luna route"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs, TypeScript and CommonJS deep-loop runtime, JSON pi config |
| **Framework** | OpenCode skill packets, the deep-loop fan-out runner, the pi coding agent |
| **Storage** | None |
| **Testing** | Vitest, `tsc --noEmit`, `pi --list-models`, the sk-code drift-guard wrapper, spec-kit `validate.sh` |

### Overview

One scripted substitution renames the GPT-5.6 Luna and Sol tokens across an enumerated file list, and it skips the Luna Max personas by pattern. Hand edits then fix the places a token swap cannot: verification claims tied to the old id, the cli-claude-code roster rows that would duplicate each other, the new LLM Gateway rows, and the Pi config: the gateway entry in `.pi/models.json` and the operator's new Pi defaults.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The GPT-6 ids confirmed in Codex's model cache, `opencode models openai` and LLM Gateway's `/v1/models`
- [x] Scope decisions taken with the operator: every Opus id, 076-style reach, work on `main`
- [x] Baselines captured before any edit

### Definition of Done
- [ ] Every acceptance criterion `Met`
- [ ] Edited suites at or above baseline, typecheck exit 0
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a mechanical rename across a paired-copy enforcement contract, the same shape as packets 070 and 076. The copies stay copies, because the tests that assert their agreement are what keep them honest.

### Key Components
- **The roster contract**: `PI_SUPPORTED_MODELS` and `HERMES_SUPPORTED_MODELS` in `executor-config.ts` and their synchronous mirrors `PI_ALLOWED_MODELS`, `PI_MODEL_PROVIDERS` and `HERMES_ALLOWED_MODELS` in `fanout-run.cjs`. They decide whether a Pi or Hermes fan-out dispatch resolves.
- **The Codex defaults**: `CODEX_DEFAULT_MODEL` in `fanout-run.cjs` and `DEFAULT_MODEL` in `codex-dispatch.cjs`. A family test ties the first to the "Fan-out fallback" line in cli-codex's `SKILL.md`.
- **The Pi model sources**: built-in providers such as `openai-codex` take their models from Pi's catalog, which `pi update --models` refreshes, so the two GPT-6 ids need no manual entry. `.pi/models.json` holds only the custom providers; the `llmgateway` block gains `gpt-6-luna` beside its three existing models.
- **The documented surfaces**: the five skills' living docs, their generated Hermes mirrors, and `.pi/custom-providers.md`.

### Data Flow
A bare fan-out literal such as `gpt-6-luna` is admitted by the allowlist, mapped to `openai-codex` by `PI_MODEL_PROVIDERS`, and composed into `openai-codex/gpt-6-luna`, which Pi resolves from its refreshed catalog. The provider-qualified `llmgateway/gpt-6-luna` is a direct-dispatch route only: one literal maps to one provider, so it does not enter the fan-out map. Hermes takes the bare literal with `--provider llmgateway`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-config.ts` Pi and Hermes allowlists | Producer of the admitted-id set | Update | `executor-config.vitest.ts` pairing assertions |
| `fanout-run.cjs` mirrors, provider map, Codex default | Synchronous consumer copy | Update | `fanout-run.vitest.ts` mirror, provider-map and family tests |
| `codex-dispatch.cjs` default | Benchmark dispatch default | Update | Residue grep |
| Council and model-benchmark tests | Consumers that pin ids | Update | Their suites, compared to baseline |
| Cursor allowlist (`gpt-5.6-luna-max`) | Separate catalog | Unchanged | Persona counts unchanged before and after |
| `CLAUDE_DEFAULT_MODEL` | Claude fan-out fallback | Unchanged, recorded | Family test accepts any `claude-opus-` id |

Required inventories:
- Same-class producers: `rg -n "gpt-5\.6-(luna|sol)" .skilled .hermes .pi --glob '!**/changelog/**' --glob '!**/benchmark/**' --glob '!**/node_modules/**'`.
- The Luna Max persona guard: `rg -c "gpt-5\.6-luna-max|gpt-5-6-luna-max|GPT-5\.6 Luna Max"` before and after, counts equal.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Phases 1 to 3 shipped in `f2a90d7ac5`.

### Review remediation (tasks.md Phase 4)

A fresh reviewer read the three pushed commits and reported two P1 and five P2 doc defects. Each was re-checked against `80dc0a118d` before it entered this plan. Phase 4 is doc-only: no runtime file, test or config value changes, so the deep-loop suites are not re-run.

**Approach, by owner:**
- **cli-opencode.** Point the missing-default fallback at `openai/gpt-6-sol` with `--variant high`, the premium base slug the catalog serves. Keep the GPT-6 grid honest: the `-pro` column is either removed or marked "not listed by `opencode models openai` on 2026-09-23", and the slug count follows. The choice between those two is made when the file is open, by whichever keeps the table readable.
- **cli-codex.** Make CX-002 run `gpt-6-luna gpt-5.6-terra gpt-6-sol` once each, with step 4 reading `/tmp/cli-codex-cx002-gpt-*.txt`. Align every playbook "documented default" claim with `SKILL.md`: `gpt-5.5` is the skill default and `gpt-6-luna` the fan-out fallback. Correct Terra's ceiling to `ultra` in the four places that state it. The new changelog corrects the released "no GPT-6 counterpart" line and names `gpt-6-astra` as listed but outside the roster.
- **cli-pi and `.pi`.** Re-run PI-017's free inspection steps (`sed` and `rg` over `executor-config.ts`) and put their real output in the captured cell, dated. The expected cell names the ten current ids and `deepseek-v4.1-flash`. The live-smoke part stays marked not re-run, because it bills a turn. Note in the xiaomi section that ultraspeed is out of the picker but dispatches with an explicit `--model`. Give the `.pi/custom-providers.md` Luna row one verification status.
- **Changelog format.** No edit if sk-doc/057 has landed by then: the five entries already follow its compact shape. If 057 has not landed, conform them to the template at `HEAD`.
- **This packet.** Record the Codex and OpenCode Luna smokes, retire the `-pro` limitation once T021 lands, and record the picker change.

**Verification:** re-run each finding's check (T032), the frontmatter version gate, `sync-skills-hermes.cjs --check` and `validate.sh --strict`.

### Xiaomi provider removal (tasks.md Phase 5)

The operator asked for MiMo to go through LLM Gateway only on Pi and OpenCode, with the change reaching the fan-out runtime. Unlike Phase 4, this phase edits runtime code and tests, so the six deep-loop suites and typecheck run again against the Phase 3 baseline.

**Approach, by owner:**
- **Runtime.** In `fanout-run.cjs`, map `mimo-v2.6-pro` to `llmgateway` in `PI_MODEL_PROVIDERS` and drop the ultraspeed entry; drop `mimo-v2.6-pro-ultraspeed` from `PI_ALLOWED_MODELS` and from `PI_SUPPORTED_MODELS` in `executor-config.ts`. The provider-map comment also still says openai-codex fronts "the GPT-5.6 tunes", and it is corrected in the same hunk. Update the roster and map expectations in `executor-config.vitest.ts` and `fanout-run.vitest.ts`.
- **Live proof.** One one-turn smoke through `pi --model llmgateway/mimo-v2.6-pro` before the commit, because the remap sends every MiMo fan-out lineage there.
- **cli-pi and `.pi`.** Remove the `xiaomi` section and ultraspeed row; the LLM Gateway MiMo row becomes the fan-out route. PI-017 expects nine ids. Remove `xiaomi/mimo-v2.6-pro` from `enabledModels`, reading the file first because a running Pi session can rewrite it.
- **cli-opencode.** Remove the Xiaomi Direct and Token Plan routes from the provider references, the CLI reference's provider detection and MiMo routing table, the MiMo prompt template, the quality card, the variant playbook row and the provider count. MiMo examples use `llmgateway/mimo-v2.6-pro`.
- **cli-hermes.** Reword the two lines that define the roster as Pi's minus ultraspeed.
- **Changelogs.** sk-doc/057 is now committed, so every changelog of this packet, the eight released ones and the three Phase 5 entries, follows its compact shape: summary, spec-folder line, What's New at a Glance, Upgrade.

**Verification:** a residue search for Xiaomi routes, the six runtime suites and typecheck against baseline, the live smoke, the frontmatter version gate, `sync-skills-hermes.cjs --check` and `validate.sh --strict`.

### Recorded follow-ups (tasks.md Phase 6)

The operator asked for all six items Phase 5 left open, with implementation delegated and this session as orchestrator and reviewer. Every item was re-checked on 2026-09-23 before it entered this plan, so each brief carries observed facts, not the Phase 5 notes.

**Who does what.**
- **Implementation: `gpt-6-luna` at `xhigh` on the `fast` tier through cli-codex.** The command comes from `fanout-run.cjs`'s `buildLineageCommand` for kind `cli-codex` with `--sandbox workspace-write`, `AI_SESSION_CHILD=1` and stdin from `/dev/null`. Each prompt carries the child-dispatch preamble, the resolved agent persona (`code` for tests, `markdown` for docs), the spec folder marked pre-approved, and one brief.
- **Fallback: MiMo v2.6 Pro at `high` through cli-pi**, built the same way for kind `cli-pi` as `llmgateway/mimo-v2.6-pro`, with the same brief. It fires when a Luna dispatch fails to start, hits a usage limit, or returns work that fails review twice.
- **Orchestrator and reviewer: this session.** It writes the briefs, runs one dispatch at a time, and reviews every return: the changed paths against the brief's file list, each named line against the literal new text, and the relevant check. It also does the work that is verification or operator config rather than implementation: contract regeneration, Hermes mirrors, live smokes, the home-config edits, the gates and the commit.

**Briefs.** One change per brief, under about 90 lines, with the literal old text and new text at each `file:line`, the file count as the accept condition, and a closing handback block. That shape comes from the operator's standing feedback on CLI dispatch briefs.

**Work units, in dispatch order.**
1. **D1 cli-opencode pre-flight.** `references/cli-reference.md` lines 173 to 181: each `grep` over `opencode providers list` becomes `opencode models <id> >/dev/null 2>&1`, for `opencode-go`, `minimax-coding-plan`, `minimax` and `llmgateway`. Accept: running the new block here prints `default=1 minimax_token=0 minimax_direct=1 llmgateway=1`.
2. **D2 deep command sources.** Four `-presentation.txt` files: the sample id `xiaomi-token-plan-ams/mimo-v2.5-pro` becomes `llmgateway/mimo-v2.6-pro`, and "required for MiniMax/Xiaomi token-plan models" becomes "required for MiniMax token-plan models". This session then runs `compile-command-contracts.cjs --command deep/<name> --write` for research, review and ai-council, and diffs each contract.
3. **D3 council docs and profiles.** deep-ai-council `SKILL.md` lines 20 and 357, `seat-diversity-patterns.md` lines 138 and 240, and the three `capability-m3-vs-mimo*.json` profiles, where `xiaomi-token-plan-ams/mimo-v2.5-pro` becomes `llmgateway/mimo-v2.5-pro`.
4. **D4 cli-codex.** CX-002 step 1 greps `references/providers-and-models.md` §2 instead of a table `cli-reference.md` lacks, and its pass cell, triage cell and source row follow. `providers-and-models.md` line 137 and CX-002 line 55 locate profiles as `$CODEX_HOME/<name>.config.toml` files, as `SKILL.md` §3 does. The `luna-impl` and `sol-verify` rows stay: those profile files exist, and planning's claim that they did not was wrong. They pin the retired 5.6 ids, which is home config and needs its own operator yes.
5. **D5 cli-claude-code.** `claude-fable-5` becomes `claude-fable-5-1` in `SKILL.md` line 235, `references/providers-and-models.md` lines 51 and 55 and `references/cli-reference.md` line 206. The OpenCode provider count at `references/claude-tools.md` line 252 is replaced by the five providers cli-opencode names and a link to its roster, so the two copies cannot drift again.
6. **D6 tests.** `orchestrate-session-cli.vitest.ts` lines 338 and 340 and `remediation.vitest.ts` line 298 expect `deepseek-v4.1-flash` on `llmgateway`, which is what the Pi roster and `buildLineageCommand` produce now.
7. **D7 bumps and changelogs** for each skill Phase 6 edits, in the sk-doc/057 shape, after reading each skill's current version.

**This session's own steps.** The OpenCode MiMo smoke and PI-017's live step come right after D1. If PI-017's command cannot reach a model as written, a D8 brief corrects it. The operator kept the Sol smokes skipped. The operator approved the three home-config edits, and each file is copied to a dated backup first. After D7 come the Hermes mirrors, regenerated into a scratch directory with only the touched skills copied back.

**Verification:** the Xiaomi route search over the Phase 6 paths; the council and remediation suites in full; the six runtime suites and typecheck against a fresh baseline; the contract diffs; the frontmatter version gate; 057's changelog checker; `sync-skills-hermes.cjs --check`; `validate.sh --strict`. Then one commit, pushed to `main` and `skilled/v4.0.0.0`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Deep-loop allowlists, mirrors, provider map, defaults | Vitest: `executor-config`, `fanout-run`, `combo-matrix`, `fanout-merge`, `executor-audit`, stress `cli-codex`; `npm run typecheck` |
| Unit | Council and model-benchmark dispatch | Vitest, compared against their pre-existing single failure |
| Unit | Pi fast-mode priority list | The extension's own Vitest suite |
| Integration | Pi model resolution | `pi --list-models gpt-6`, JSON parse of `.pi/settings.json`, `.pi/models.json` and `.pi/pi-blackhole-config.json`, one-turn live smokes |
| Static | Residue, persona guard, mirrors, drift | `rg` residue scans, `sync-skills-hermes.cjs --check`, `run-all-drift-guards.sh` compared to baseline, `check-frontmatter-versions.sh` |

The full deep-loop `npm test` hangs on the lineage integration tests that dispatch real CLIs, as packets 070 and 076 recorded, so the suites above are the gate. A live billed round-trip through each new route is the operator's check, not this packet's.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| LLM Gateway catalog rows for `gpt-6-luna` and `gpt-6-sol` | External | Green, read 2026-09-23 | Hermes and the Pi gateway route would name an unlisted id |
| Codex model cache and `opencode models openai` | External | Green, read 2026-09-23 | The Codex and OpenCode renames would be unconfirmed |
| `${LLMGATEWAY_API_KEY}` | Internal | Existing, unchanged | None for the config; a live call needs it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite drops below baseline, Pi cannot list the new routes, or the operator's live round-trip fails for a GPT-6 id.
- **Procedure**: Every change is a working-tree edit to a tracked file, apart from the new changelog files and this packet. `git checkout --` the edited paths restores them, and deleting the five new changelog files and this folder removes the rest. The `.pi/settings.json` restore must keep the pre-existing reorder hunk, so revert that file by hand rather than with a checkout.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: baselines, inventory) ──► Phase 2 (Rename + hand edits) ──► Phase 3 (Verify) ──► Phase 4 (Review remediation) ──► Phase 5 (Xiaomi removal) ──► Phase 6 (Recorded follow-ups)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verify |
| Verify | Implementation | Review remediation |
| Review remediation | Verify, the fresh review; T029 also waits on sk-doc/057 or falls back to `HEAD` | Xiaomi removal |
| Xiaomi removal | Review remediation, the operator's scope answer, and the Phase 3 suite baseline | Recorded follow-ups |
| Recorded follow-ups | Xiaomi removal, the operator's §10 answers, and a fresh suite baseline | Closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done in-session |
| Core Implementation | Med | One session |
| Verification | Med | About 10 minutes of suite runtime |
| Review remediation | Low | About a dozen doc edits, three bumps, no suite runtime |
| Xiaomi removal | Med | Two runtime files, two test files, about fifteen docs, three bumps, one suite run and one live smoke |
| Recorded follow-ups | Med | Seven or eight Luna dispatches of a few minutes each, three contract regenerations, two to five live smokes, four suite runs; about two hours of wall time |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baselines recorded in `tasks.md`
- [x] No data migration and no feature flag involved

### Rollback Procedure
1. Revert the edited tracked files with `git checkout --`, except `.pi/settings.json`.
2. Hand-revert `.pi/settings.json` to keep the pre-existing reorder hunk.
3. Delete the five new changelog entries and rerun `sync-skills-hermes.cjs` so the mirrors follow.
4. Rerun the Phase 3 suites to confirm the baseline counts return.
5. Phase 4 is doc-only and lands as its own commit, so `git revert` of that commit undoes it without touching Phases 1 to 3.
6. Phase 5 lands as its own commit. `git revert` of it restores the `xiaomi` routes, the ultraspeed id and the picker entry; rerun the six runtime suites afterwards to confirm the baseline.
7. Phase 6 lands as its own commit, so `git revert` undoes its repository edits. The home-config edits are outside git: copy each dated backup (`<file>.bak-<date>`) back over its file.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
