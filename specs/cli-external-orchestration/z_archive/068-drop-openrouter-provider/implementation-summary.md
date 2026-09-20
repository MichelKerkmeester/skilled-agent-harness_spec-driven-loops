---
title: "Implementation Summary"
description: "OpenRouter left the cli-pi and cli-opencode closed rosters. All 25 mentions were classified before any edit: 22 live wiring, removed; 3 historical record, untouched; 0 generated."
trigger_phrases:
  - "implementation summary"
  - "openrouter removed from both rosters"
  - "live wiring versus historical record"
  - "fan-out roster divergence"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/068-drop-openrouter-provider"
    last_updated_at: "2026-09-09T09:40:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "OpenRouter removed from both rosters; residue sweep and CI checkers clean"
    next_safe_action: "Operator decides on a system-deep-loop packet for the fan-out roster"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-pi/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "068-openrouter-removal-2026-09-09"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Follow-up packet in system-deep-loop to drop the two OpenRouter literals from the fan-out roster?"
      - "Remove the dormant providers.openrouter block from .pi/models.json?"
    answered_questions:
      - "Does removing OpenRouter break a documented default, fallback or example? No: it was never a default on either skill, and both models it carried keep two other roster routes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 068-drop-openrouter-provider |
| **Status** | Complete |
| **Completed** | 2026-09-09 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

OpenRouter is off both closed rosters. Twenty-two live references are gone from `cli-pi` and `cli-opencode`, three changelog references stay exactly as they were, and every model OpenRouter used to carry still has two documented routes on each CLI. The work that mattered was not the deletion. It was deciding, mention by mention, which text describes a route that exists and which text records a route that once did.

### Remove the openrouter provider from the cli-pi and cli-opencode skills

Both skills now say **six providers are reachable** instead of seven. On `cli-pi` those are `openai-codex`, `opencode-go`, `cline-pass`, `llmgateway`, `minimax` and `xiaomi`; on `cli-opencode`, `opencode-go`, `openai`, `cline-pass`, `llmgateway`, `minimax` and `xiaomi`. The `### openrouter` roster section is gone from both catalogs along with its two model rows.

The interesting mentions were the ones outside the OpenRouter section. Four passages in `cli-pi` explained a *neighbouring* provider by comparing it against OpenRouter: the `cline-pass` DeepSeek row pointed at "the opencode-go / openrouter Flash routes above", the `cline-pass` GLM row used OpenRouter twice to explain why its own thinking ceiling is `xhigh` and once to explain why it is direct-dispatch only, and the DevPass section named OpenRouter as one of the per-token routes that lost the fan-out slot. Delete the OpenRouter section alone and all four are left pointing at nothing. Each was rewritten against a provider still on the roster.

One passage on `cli-opencode` was a genuine fallback and got handled as one. GLM-5.3-Flash cannot be reached through that CLI's Cline route, and the callout saying so offered OpenRouter first and opencode-go second. It now offers `opencode-go/glm-5.3-flash` and `llmgateway/glm-5.3-flash`, both already roster rows, so the workaround still has two routes rather than one.

### Mention classification

The full pre-change inventory. Line numbers are the pre-edit ones.

| File | Line(s) | Class | Verdict |
|------|---------|-------|---------|
| `cli-pi/SKILL.md` | 134 | Live wiring | Provider count and list; seven to six, `openrouter` dropped |
| `cli-pi/references/providers-and-models.md` | 46 | Live wiring | Roster sourcing note; the `openrouter confirmed 2026-08-17` clause describes where the *current* roster comes from, so it goes with the provider |
| `cli-pi/references/providers-and-models.md` | 84-94 | Live wiring | The `### openrouter` section: heading, prose, allowlist callout, table and both rows. Cut whole |
| `cli-pi/references/providers-and-models.md` | 107 | Live wiring | `cline-pass` DeepSeek row's "Distinct from the opencode-go / openrouter Flash routes above". Now names opencode-go alone |
| `cli-pi/references/providers-and-models.md` | 108 | Live wiring | `cline-pass` GLM row, three separate references. Ceiling comparison, "same underlying model" pointer, and the direct-dispatch reason. All three rewritten |
| `cli-pi/references/providers-and-models.md` | 120 | Live wiring | DevPass fan-out rationale naming the per-token alternatives. `opencode-go` is the one that remains |
| `cli-pi/changelog/v1.4.1.0.md` | 5, 12 | **Historical record** | **Not edited.** Records the roster as it stood after packet 056, including that the OpenRouter allowlist was unchanged then |
| `cli-opencode/SKILL.md` | 29 | Live wiring | Advisor Keywords comment. Token removed so the gateway name no longer pulls vocabulary toward a mode that cannot dispatch it |
| `cli-opencode/SKILL.md` | 196 | Live wiring | Provider count and list; seven to six |
| `cli-opencode/SKILL.md` | 198 | Live wiring | Id-shape footgun. Reduced to the two shapes that remain, bare `llmgateway` against slashed `cline-pass` |
| `cli-opencode/references/providers-and-models.md` | 80-90 | Live wiring | The `### openrouter` section. Cut whole |
| `cli-opencode/references/providers-and-models.md` | 99 | Live wiring, and a real fallback | GLM-5.3-Flash-on-Cline workaround. Repointed at `opencode-go` and `llmgateway`, both roster rows |
| `cli-opencode/references/cli-reference.md` | 263 | Live wiring | `opencode providers login openrouter` in the all-providers-missing pre-flight tree. Line removed |
| `cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | 338 | Live wiring inside a retired-scenario note | The sentence has a historical preamble about CO-011's retirement and a live clause about where flash coverage continues. Only the live clause changed |
| `cli-opencode/manual-testing-playbook/multi-provider/variant-levels-comparison.md` | 15 | Live wiring | CO-012 scenario contract listing the routes that accept reasoning variants |
| `cli-opencode/changelog/v1.4.3.0.md` | 12 | **Historical record** | **Not edited.** Same reason as the cli-pi entry |
| `cli-pi/references/providers-and-models.md` | 127 | Live wiring, **no OpenRouter token** | Found by a follow-up count audit, not the grep. "Only the seven authenticated providers above" became six |
| Any non-markdown file in either skill | — | **Generated** | **Empty class.** Every JSON, CSV and report file in both trees was scanned and none contains the token, so nothing needed regenerating |

The rule separating the first two classes is the skills' own, not one invented here. `cli-pi/changelog/v1.5.0.0.md` states it under "Not Changed": changelog and benchmark records "state what was true when they were written".

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-pi/SKILL.md` | Modified | Six providers, not seven |
| `cli-pi/references/providers-and-models.md` | Modified | Roster section cut; four cross-references rewritten |
| `cli-pi/changelog/v1.5.1.0.md` | Created | Records the retirement, what stayed, and the runtime divergence |
| `cli-opencode/SKILL.md` | Modified | Keyword, provider count, id-shape footgun |
| `cli-opencode/references/providers-and-models.md` | Modified | Roster section cut; GLM fallback repointed |
| `cli-opencode/references/cli-reference.md` | Modified | Off-roster login option removed from the pre-flight tree |
| `cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | Modified | Flash coverage note |
| `cli-opencode/manual-testing-playbook/multi-provider/variant-levels-comparison.md` | Modified | CO-012 route list |
| `cli-opencode/changelog/v1.4.4.0.md` | Created | Records the retirement and what stayed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Enumerate, classify, then edit. The enumeration used `grep -rani` so that neither case nor a stray NUL byte could hide a mention, and it reproduced the brief's starting figures exactly: 12 lines over 3 files in `cli-pi`, 13 over 6 in `cli-opencode`. Every one was read in surrounding context before anything changed.

The edits were applied by a script where each substitution asserts it matches exactly once and each section cut asserts its first and last line before deleting the range. A drifted string aborts the run rather than silently editing the wrong place or nothing at all. Fifteen edits applied, zero aborts.

Baselines for all three CI checkers were captured before the first edit, which matters here because the working tree carries roughly a hundred dirty files from concurrent sessions in unrelated trees. Without a before-number, an unrelated `sk-design` staleness would have read as damage from this change.

Nothing was committed. The tree is too dirty for a safe stage-and-commit by anyone but the operator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rewrite four `cli-pi` cross-references rather than only cutting the OpenRouter section | They explain a *different* provider's ceiling and fan-out status by comparing it against OpenRouter. Cutting the section alone leaves four passages pointing at a provider the file no longer documents |
| Treat the roster sourcing note at line 46 as live, not historical, despite its date | It says where the roster standing *today* came from. A dated clause inside a live sentence is not a log entry, and the changelog already holds the historical version |
| Describe the `cline-pass` GLM route as bound by "a provider outside this roster" | The literal is genuinely taken in the fan-out map, which is the true reason it is direct-dispatch only. Naming OpenRouter would reintroduce the term; dropping the reason entirely would leave an unexplained claim |
| Repoint the cli-opencode GLM fallback at two routes, not one | It is a real workaround for a route that does not work. Leaving it with a single option makes an unavailable provider a single point of failure |
| Leave the deep-loop fan-out roster alone | It belongs to `system-deep-loop`, which was out of scope by instruction. Repointing a live routing map to make documentation self-consistent is exactly the silent fix the brief forbade |
| Add a changelog entry and bump versions on every edited doc | Both skills have recorded every prior roster change this way. Without it, the next reader cannot tell when OpenRouter left, and the version fields stop attesting the documents they sit in |
| Leave everything uncommitted | About a hundred files are dirty from other sessions. Staging explicit paths is possible but committing is the operator's judgment call, not a subagent's |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Residue sweep, `grep -rani openrouter` over both skills excluding `changelog/` | **PASS.** Zero hits |
| Residue sweep including changelogs | **PASS.** Exactly 3 hits: `cli-pi/changelog/v1.4.1.0.md:5,12` and `cli-opencode/changelog/v1.4.3.0.md:12`, all deliberate |
| `git diff --name-only` scope | **PASS.** 7 tracked markdown files, all inside the two skills. No non-markdown file, no other skill, no changelog modified |
| `ci-leaf-manifest-freshness` | **PASS, no delta.** `cli-external-orchestration` OK with hash `61a54e8d…` before and after; `checked=13 fresh=12 failed=1` both times, the one failure being a pre-existing `sk-design` staleness from another session |
| `ci-skill-derived-freshness` | **PASS, no delta.** `checked=13 fresh=13 stale=0 errored=0` before and after |
| `ci-router-vocabulary-reach` | **PASS.** `cli-external-orchestration` OK with `declared=49` and all counters zero, before and after. The overall verdict improved from FAILED to PASSED because four transient `sk-doc` advisor probe errors cleared between runs; neither state involved this hub |
| Deep-loop roster unit tests, `executor-config.vitest.ts` + `fanout-run.vitest.ts` | **PASS.** 213 tests, 2 files. Negative control: these assert the OpenRouter literals are still in the fan-out roster, so a pass proves no runtime file moved |
| `validate.sh <packet> --strict` | **PASS.** See the closing gate run recorded with this packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

0. **A token sweep is necessary and not sufficient.** One sentence in `cli-pi/references/providers-and-models.md` counted the authenticated providers without naming any of them, so no grep for `openrouter` could reach it. It was caught by auditing count claims after the removal, and the same class of defect could exist in any doc that counts a set this packet shrank.

1. **The fan-out roster still routes two literals through OpenRouter.** `PI_SUPPORTED_MODELS` in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:201-202` allowlists `deepseek/deepseek-v4-flash-vision-exp` and `z-ai/glm-5.3-flash`, and `PI_MODEL_PROVIDERS` in `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2293-2294` maps both to `openrouter`. A `cli-pi` fan-out can therefore still compose an OpenRouter selector for two literals that neither roster documents. This is deliberate: `system-deep-loop` was out of scope, and closing the gap by repointing a live map would have been a silent behavioural change. It needs its own packet.

2. **`.pi/models.json` still declares a `providers.openrouter` block.** It holds `sendSessionAffinityHeaders` compat and a `~deepseek/deepseek-v4-flash-latest` model override. Harmless once nothing selects the provider, but it is the last place the account is named in configuration, so removing it is worth a decision rather than an assumption. It is Pi runtime configuration, not skill documentation.

3. **Freeing the `z-ai/glm-5.3-flash` literal would change routing.** That literal is the only reason `cline-pass/z-ai/glm-5.3-flash` is direct-dispatch only on `cli-pi`. If the follow-up packet removes the OpenRouter map entry, the Cline route becomes eligible for the fan-out slot. That is a routing decision to make on purpose, not a side effect to discover.

4. **Nothing is committed.** All changes sit in the working tree. The two new changelog files and this packet are untracked.
<!-- /ANCHOR:limitations -->

---
