---
title: "Implementation Summary"
description: "Every tracked slash command and doctor route now has a risk class and a derived run, start or ask policy in the generated bridge file, and the deriver fails when the command tree and the declarations disagree. Routing is unchanged."
trigger_phrases:
  - "command inventory and risk metadata implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/002-command-inventory-and-risk-metadata"
    last_updated_at: "2026-11-12T14:06:31Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the command inventory, risk classes and derived policies"
    next_safe_action: "Plan phase 003 plain chat command reach"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json"
      - ".skilled/skills/system-spec-kit/command-metadata.json"
      - ".skilled/skills/sk-prompt/command-metadata.json"
      - ".skilled/skills/system-skill-advisor/runtime/tests/command-policy-derivation.vitest.ts"
    session_dedup:
      fingerprint: "sha256:4b8a51ebf10be02ea087103ffb707bc501fada55ea02b249e869cfa98fa309f7"
      session_id: "scaffold-002-command-inventory-and-risk-metadata"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3+ -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-command-inventory-and-risk-metadata |
| **Completed** | 2026-11-12 |
| **Level** | 3+ |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every one of the 44 tracked slash commands now states what it writes, and the generated bridge file carries a policy for each: 7 run outright, 22 start and let their own setup ask, 15 ask first. A command file with no risk class now fails the deriver. Routing did not move: the phase 1 baseline's 175 rows are byte-identical.

### Phase 2: command-inventory-and-risk-metadata

You can now read, per command and per doctor route, whether a model may run it without asking. The answer comes from four keys the command's owner declares (`mutating`, `gate3_location`, `ask_first`, `write_scope`) and one rule in the deriver, so nobody hand-keeps a policy table.

The 8 commands that had no attributes anywhere now have them: `system-spec-kit` and `sk-prompt` each carry a `command-metadata.json`, which the skill root metadata contract now permits on a standalone skill when each entry names the skill itself as owner. The policies are a new top-level list in the generated file. Nothing scores on them yet, and no bridge was switched on or off.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` | Modified | Tree read, identity check, risk key validation, `derivePolicy`, `commandPolicies` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Modified | Four new disabled entries and 68 policy records |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts`, `runtime/scripts/skill_advisor.py` | Modified | The deriver's marked blocks, with the four disabled entries |
| `.skilled/skills/sk-doc/command-metadata.json`, `sk-design/command-metadata.json`, `system-deep-loop/command-metadata.json` | Modified | Risk keys on 19 entries |
| `.skilled/skills/system-spec-kit/command-metadata.json`, `.skilled/skills/sk-prompt/command-metadata.json` | Created | 7 and 1 entries |
| `.skilled/commands/doctor/_routes.yaml` | Modified | `/doctor:env` actions and `write_scope` on two routes |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs`, `scripts/ci-skill-root-metadata.cjs` | Modified | The standalone allowance and the owner rule |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`, `references/shared/skill-root-metadata-contract.md` | Modified | Roster fix, the new case and the amended reference |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-policy-derivation.vitest.ts` | Created | Six tests for the rule, the validation and the identity check |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts`, `tests/command-bridges-drift-guard.vitest.ts` | Modified | Census 27, and expected ids follow the allow-list rule |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md` | Modified | New section on the risk keys and the policy |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | Modified | Re-captured, `bridgeCounts` only |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator asked for the DeepSeek V4.1 Flash swarm again. Thirteen workers ran through Pi at max thinking in three waves, one file each: six on the hub metadata, the doctor manifest and the two contract files, four on the contract test, the two new metadata files and the deriver, three on the new test and the two reference documents. The briefs and logs are in `scratch/briefs/` and `scratch/logs/`. The orchestrating session ran setup, read every diff between waves, regenerated the bridge file and ran every check.

Three edits were made by the orchestrating session: one corrected comment in the deriver, the census number, and the drift guard's expected ids. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Amend the skill root metadata contract | The operator chose it on 2026-11-12, so all 27 non-doctor commands declare attributes in one file shape |
| Policies as a top-level list | Fields on bridge entries break the drift guard and would feed the scorer blocks before anything reads them |
| A `write_scope` mark | The free-text write target cannot tell the deriver that every write lands in the spec folder |
| Keep the allow-list rows | Retiring them changes active ids in both scorers, which the review places later |
| `/design:extract` asks first, for `settings` and `outside-repo` | Its skill requires `npm install` and a Playwright Chromium install before every run, and the main path crawls a live URL |
| The other 15 hub commands stay `start` | The audit found an ask reason only on optional routes, and the record holds one class per command |
| Fix the contract test's roster first | It failed before this phase on a missing skill id, so no later assertion in it could run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `derive-command-bridges.cjs --check` | `fresh`, counts 66 generated, 40 TypeScript-active, 50 Python-active |
| Policy rollup against the review | `{"ask":16,"run":7,"start":21}`. One difference: `/design:extract` moved from start to ask after the workflow audit |
| Fixture command with no attributes | The real check exited 1 with `command inventory mismatch`. After the delete, `fresh` |
| Class change flips a policy | `/doctor:git` `setup` set to `mutates` derived `ask`. Files restored, `fresh` |
| Pinned numbers | `[158,50,20,5]` before and after |
| Phase 1 baseline | Rows, metrics, commands and unreachable list byte-identical after re-capture |
| `npm test` in the advisor runtime | 163 files passed, 1,397 tests passed, 8 skipped, 218 s |
| Contract gate and test | `checked=14 passed=14 failed=0`, test exits 0. All `.test.cjs` files in sk-create-skill pass |
| Doctor route validator | `OK: route-validate`, its own test 22 passed |
| Acceptance criteria | 14 rows, 14 Met, none waived. See `acceptance-criteria.md`. Checklist P0 8 of 8, P1 12 of 12 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three hub commands carry a risky route their one class cannot express.** `/create:changelog --release` pushes a tag and publishes a GitHub release, and its `:auto` workflow has no stop before it. `/create:skill-parent` rewrites shared advisor routing source when a mode is lexical. `/design:diagram` runs a local browser on PNG export. Each stays `start`, which is safe only while a model-started command opens in confirming mode. `/create:agent` also stays `start`: its workflow tells the model to dispatch one context agent and, in the same file, never to dispatch agents. The audit read each command's router and auto workflow and searched the rest by keyword, so a step worded outside those terms could be missed.
2. **Three orphan ids remain.** `/spec_kit`, `/memory:save` and `/prompt` name no command file and are exempt from the identity check until the allow-list is retired.
3. **Nothing reads `commandPolicies` yet.** Phase 004 joins it to a recommendation by command and route.
4. **`counts.commandMetadata` is 23, not 27.** It counts the metadata entries that become bridge entries, and four are carried by allow-list rows.
5. **One whole-suite run failed mid-way.** Restoring source files during a proof left the build older than its source, and two CLI test files failed until a rebuild. The final run is from a fresh build.

**Note added 2026-11-12 by phase 003.** The evidence above is as recorded for this phase and is not rewritten. Phase 003 later gave `/create:changelog` `ask_first: ["outside-repo"]` by operator decision, which addresses the `--release` risk in limitation 1. The per-command rollup is now 17 ask, 7 run and 20 start, against the 16, 7 and 21 recorded here. See `../003-plain-chat-command-reach/plan.md` ADR-014.
<!-- /ANCHOR:limitations -->

---

