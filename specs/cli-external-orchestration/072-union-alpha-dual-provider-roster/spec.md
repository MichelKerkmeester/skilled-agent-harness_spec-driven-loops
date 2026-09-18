---
title: "Feature Specification: Add Union Alpha to the cli-opencode and cli-pi rosters through opencode-go and OpenRouter"
description: "Union Alpha is a free stealth model that both pi and opencode already see on two providers at once — opencode-go under a bare id and OpenRouter under stealth/union-alpha. Neither roster names it, so no dispatch may use it. Adding it restores OpenRouter as a roster provider, which packet 068 removed, and records a catalog thinking claim that measurement contradicted."
trigger_phrases:
  - "union alpha roster"
  - "add union alpha"
  - "stealth union alpha"
  - "openrouter back on the roster"
  - "union alpha two providers"
  - "union alpha pi settings"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add Union Alpha to the cli-opencode and cli-pi rosters through opencode-go and OpenRouter

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Blocked — not started (upstream model withdrawn 2026-09-18) |
| **Created** | 2026-09-17 |
| **Branch** | `skilled/v4.0.0.0` (no dedicated branch; `--skip-branch`) |
| **Origin** | Operator: "Add support for Union Alpha through openrouter provider to opencode and pi roster (+pi settings)", then "Both providers" when shown that opencode-go carries the same model with thinking support, and "No — rosters and pi settings only" on whether the deep-loop fan-out allowlist came in scope |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

> **Falsified 2026-09-18, before a single roster row shipped.** Union Alpha's stealth period ended the day after the evidence below was gathered, and all four routes are now dead. OpenRouter answers `404` with "Thank you for participating in the Stealth Union Alpha testing period. This model was Unbiased's Pareto", the opencode-go gateway answers `400 ... Upstream request failed: Model is unavailable`, and both ids have left `opencode models`. Everything in this section was true on 2026-09-17 and is kept as written; what it no longer supports is the change it argues for. §7 carries the measurements and the two controls that rule out a client-side fault.

### Problem Statement

Union Alpha is a free stealth model that both CLIs already see, on two providers at once. `pi --list-models` on 2026-09-17 lists it twice — `opencode-go union-alpha` and `openrouter stealth/union-alpha` — and `opencode models opencode-go` and `opencode models openrouter` each carry their side. Both rosters are closed: `cli-pi/SKILL.md` states that non-roster models are FORBIDDEN and that a model reaches the roster only by amending it, so a model no roster names cannot be dispatched at all, however visible it is in a catalog.

The two routes are not interchangeable, which is why naming only one would be a wrong answer rather than a partial one. `pi --list-models` reports `thinking: yes` for the opencode-go route and `thinking: no` for the OpenRouter route, and the OpenRouter catalog agrees on its side: `supported_parameters` for `stealth/union-alpha` is `max_tokens, response_format, temperature, tool_choice, tools, top_p`, with no reasoning parameter among them. Context and output match on both sides at 262,144 and 131,072 tokens, and both accept images.

**The opencode-go thinking claim did not survive measurement, and that is a finding rather than a detail.** All four routes were dispatched on 2026-09-17 and all four answered. When both were then dispatched through `opencode run --thinking max`, neither emitted a `reasoning` part in the event stream, while a control dispatch of `opencode-go/glm-5.3-flash` at the same tier emitted one of 48 characters. The control matters because the obvious instrument is broken: the `tokens.reasoning` counter reported `0` for the control too, so a row built on that counter would have been wrong in the reassuring direction. Both routes also *accepted* `--thinking max` and `--thinking xhigh` without error, so flag acceptance proves nothing either. What the roster can honestly say is that the OpenRouter route has no thinking tier, on three agreeing signals, and that the opencode-go route's catalog claim is contradicted by the only behavioral test run against it.

Adding the OpenRouter route reverses a decision. Packet 068 removed OpenRouter from both rosters because the operator was retiring the account, and `cli-pi/references/providers-and-models.md` now carries a paragraph stating that OpenRouter is off the roster and deliberately reachable only through the fan-out. That paragraph becomes false the moment a roster row names an OpenRouter model, so it is load-bearing text this packet has to rewrite rather than a line it can leave alone.

### Purpose

Both rosters name Union Alpha on both providers, no row claims a thinking tier that a dispatch did not demonstrate, pi's picker offers both, and the restored OpenRouter section replaces the retirement paragraph instead of contradicting it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **The opencode-go row on both rosters.** Bare literal `union-alpha`, matching every other opencode-go id in those tables, recorded with image input and with the thinking claim stated as the open contradiction it is: catalog `thinking: yes`, no `reasoning` part observed at `--thinking max`.
- **The OpenRouter route on both rosters, which means restoring the provider.** A new `### openrouter` section in each `providers-and-models.md`, carrying exactly one model, `stealth/union-alpha`, recorded with **no thinking tier** so no dispatch passes `--thinking` on that route.
- **The retirement paragraph in `cli-pi/references/providers-and-models.md`.** The "OpenRouter is off this roster, and deliberately still in the fan-out" block is rewritten to say what is true after this packet: the provider is back on the roster carrying one model, and the two fan-out literals it describes are unchanged.
- **Every count the change falsifies.** "Six providers are reachable" in both `SKILL.md` files and "only the six authenticated providers above" in the cli-pi roster doc all become seven.
- **`.pi/settings.json`.** Two new `enabledModels` entries, `opencode-go/union-alpha` and `openrouter/stealth/union-alpha`, so both routes appear in pi's picker. `defaultProvider` and `defaultModel` are not touched.
- **Frontmatter version bumps on every edited doc, plus one changelog entry per skill** — `cli-pi` v1.5.4.0 and `cli-opencode` v1.4.7.0 — which is how both skills have recorded every prior roster change.

### Out of Scope
- **The deep-loop fan-out allowlist.** `PI_SUPPORTED_MODELS` (`executor-config.ts`), its `PI_ALLOWED_MODELS` mirror and `PI_MODEL_PROVIDERS` (`fanout-run.cjs`) and the two guard tests are untouched by operator decision. The consequence is specific and belongs in the roster rows: a fan-out naming either Union Alpha id is refused by `isPiModelAllowed`, so both routes are **direct-dispatch only** until a follow-up packet widens the allowlist.
- **`.pi/models.json`.** It already declares `providers.openrouter` and `providers.opencode-go`, each with `compat.sendSessionAffinityHeaders`, and pi's builtin catalog already resolves both Union Alpha ids — `pi --list-models` prints them without any config entry. A models block would restate what the runtime already knows, so nothing is added.
- **The hub's advisor vocabulary.** `ROUTER.md`, `hub-router.json`, `graph-metadata.json` and `description.json` carry no `union-alpha` token, so a prompt naming the model by name does not route to either skill. That is the hub's routing surface rather than either roster's, and the operator scoped this packet to the rosters and pi settings. Worth a follow-up; not folded in here.
- **The two pre-existing provider-count drifts in `cli-opencode/README.md`.** Line 131 says "Four providers are documented" and line 50 names four provider catalogs, while that skill's own `SKILL.md` has said six since packet 068. The drift predates this packet and is not created by it, so it is named here rather than fixed.
- **Changelog and benchmark records.** Six files under both skills' `changelog/` mention OpenRouter as it stood before 068. They state what was true when they were written and are not edited.
- **Any other model on either provider.** OpenRouter fronts 444 ids and opencode-go 28; a live catalog is not a roster, and only Union Alpha is added.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | opencode-go Union Alpha row; new `### openrouter` section with the one model; retirement paragraph rewritten; six-provider count |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | opencode-go Union Alpha row; new `### openrouter` section with the one model |
| `.opencode/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | "Six providers are reachable" becomes seven, with `openrouter` named |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Same count and provider list |
| `.pi/settings.json` | Modify | Two `enabledModels` entries added; defaults untouched |
| `.opencode/skills/cli-external-orchestration/cli-pi/changelog/v1.5.4.0.md` | Create | Roster change entry |
| `.opencode/skills/cli-external-orchestration/cli-opencode/changelog/v1.4.7.0.md` | Create | Roster change entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both `providers-and-models.md` files carry a Union Alpha row under `opencode-go` using the bare id `union-alpha` | `grep -n "union-alpha" <file>` shows a table row under `### opencode-go` in each; the id has no provider prefix, matching the neighbouring rows |
| REQ-002 | Both `providers-and-models.md` files carry an `### openrouter` section whose only model row is `stealth/union-alpha` | The section exists in both; each contains exactly one model row; no other OpenRouter id is listed |
| REQ-003 | The OpenRouter row states that the route has no thinking tier. The opencode-go row records the contradiction rather than resolving it: catalog `thinking: yes`, no `reasoning` part observed at `--thinking max` | Neither row claims a thinking tier that a dispatch did not demonstrate. The opencode-go row names both the catalog claim and the observed behavior, and any dispatch guidance it gives does not depend on which is right |
| REQ-004 | No surface still claims six providers after a seventh is on the roster | `grep -rn "[Ss]ix providers\|six authenticated providers"` over both skills returns only `changelog/` hits |
| REQ-005 | The `cli-pi` retirement paragraph no longer contradicts the roster | The "OpenRouter is off this roster" sentence is gone; the replacement names the one roster model and leaves the two fan-out literals described as they are |
| REQ-006 | `.pi/settings.json` offers both routes in the picker | `enabledModels` contains `opencode-go/union-alpha` and `openrouter/stealth/union-alpha`; the file still parses as JSON; `defaultProvider` and `defaultModel` are byte-identical to their pre-change values |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Both rows state that the model is direct-dispatch only | Each of the four rows names the fan-out allowlist as the reason, so a reader does not discover it through a refused dispatch |
| REQ-008 | Each edited doc carries a frontmatter version bump, and each skill gains one changelog entry | `cli-pi` at v1.5.4.0 and `cli-opencode` at v1.4.7.0, each with a changelog file naming the added ids |
| REQ-009 | Every row cites the dispatch that verified it | All four routes completed a real turn on 2026-09-17 (`tasks.md` T002), so no row ships as "listing-only" and each carries that date |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Union Alpha is dispatchable by hand through both providers from both CLIs, because a roster names it, and every figure in those rows was read from a live catalog rather than carried across from the other route.
- **SC-002**: No surface in either skill claims OpenRouter is off the roster, claims six providers, or offers a thinking tier on a route that has none.
- **SC-003**: The deep-loop fan-out behaves exactly as it does today, and both rosters say so, so the one thing this packet deliberately did not do is documented rather than discovered.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The OpenRouter credential in `~/.pi/agent/auth.json` and `~/.local/share/opencode/auth.json` | Packet 068 recorded the account as being retired, which would have made the whole OpenRouter half of this packet undeliverable | **Resolved 2026-09-17.** Both OpenRouter dispatches completed and returned the expected token, so the credential authorizes completions and not merely catalog reads (`tasks.md` T002) |
| Dependency | Union Alpha is a stealth model | Stealth ids are withdrawn or renamed without notice, and its `created` date is 2026-09-17 | Both rows carry the verification date, so a later failure reads as catalog drift rather than a wiring bug |
| Risk | Restoring OpenRouter reverses packet 068 | Med | The retirement paragraph is rewritten in place, so the two documents state one policy rather than disagreeing |
| Risk | The OpenRouter route silently accepting a `--thinking` flag it does not honor | Med | The row states the route has no thinking tier, and REQ-003 pins that claim to the `pi --list-models` column rather than to an assumption |
| Risk | A fan-out dispatch naming either id is refused | Low | Stated in all four rows under REQ-007 rather than left to be found at dispatch time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Answered 2026-09-18, and the answer blocks the packet: Union Alpha was withdrawn between planning and implementation.** The stealth cloak came off one day after the evidence above was gathered. OpenRouter's API now returns `404 {"message":"Thank you for participating in the Stealth Union Alpha testing period. This model was Unbiased's Pareto. Use it now: https://openrouter.ai/unbiased/pareto","code":404}`, and its live catalog of 446 ids carries no `union` or `stealth` entry at all. The opencode-go route returns `400 ... Error from provider (Console Go): Upstream request failed: Model is unavailable`, and `opencode models opencode-go` has dropped from 28 ids to 27 with `union-alpha` gone, so both opencode dispatches fail at resolution with the `Unexpected server error` signature this hub already documents for ids absent from models.dev. **Two controls rule out a client-side or account fault:** `opencode run --model opencode-go/glm-5.3-flash --variant max` and `pi --model llmgateway/glm-5.3-flash --thinking max` each returned the expected token at exit 0 in the same session. **`pi --list-models` still prints both rows**, which is the trap worth keeping: pi lists from its builtin catalog rather than from a live provider query, so a listing outlives the route it names, and no row may be written from that column alone. Nothing in §3 survives this — every edit in the packet, the restored `### openrouter` section and the seven-provider recount included, exists only to make a dispatchable model dispatchable. Reversing packet 068's OpenRouter retirement to carry zero working models would be a policy change bought for nothing.
- **Successor, recorded but deliberately not adopted here: `unbiased/pareto`.** OpenRouter's own 404 names it, and the live catalog carries it at 262,144 context with `supported_parameters` of `max_tokens, temperature, tool_choice, tools, top_p` — still no reasoning parameter. It is **not free**: $2.50 per million prompt tokens and $7.50 per million completion, against Union Alpha's $0/$0. That makes repointing this packet at Pareto a different decision with a different cost argument, not a find-and-replace, and §3's "only Union Alpha is added" forbids folding it in. It needs an operator call.
- **Answered 2026-09-17, and still true of the account rather than the model: does the OpenRouter credential authorize a completion, or only a catalog read?** It authorizes completions. Both OpenRouter dispatches returned the expected token that day, so the account packet 068 described as being retired is serving. The 2026-09-18 failure above is the model's withdrawal and not a credential lapse — the `404` is a model-lifecycle message, not a `401`.
- **Does the opencode-go route have a thinking tier at all? Now unanswerable on this model, and it stays unresolved.** Its catalog column said yes and the one behavioral test said no, and the route was withdrawn before a discriminator could settle it. Settling the equivalent question on any successor still needs the instrument this packet did not build: a prompt whose answer differs measurably with and without reasoning, run against a control on the same provider. The durable lesson survives the model — the `tokens.reasoning` counter read `0` for a known-good control too, so only the `reasoning` **part type** in the event stream discriminates.
- Should `union-alpha` enter the hub's advisor vocabulary so a prompt naming the model routes to these skills? Out of scope here by operator decision, and **moot as of 2026-09-18** — a withdrawn id earns no routing vocabulary. It becomes live again only if a successor is adopted.
- **Fixed in place on operator instruction 2026-09-17: the cli-pi dispatch envelope.** Both code blocks in `cli-pi/references/providers-and-models.md` — the §5 child envelope and the §3 quick-invocation example — documented `--provider opencode-go --model deepseek-v4.1-flash` with no `</dev/null`, a shape the enforcement guard refuses before launch. Both now use a provider-qualified `--model` plus `</dev/null`, §2's selection rule says which form is usable here, and the file is at v1.5.0.40.
- **Remaining in that file, deliberately not rewritten:** four roster-row sentences still describe route selection as `--provider opencode-go --model <id>`. They are prose inside the exact rows this packet's implementation will rewrite, so correcting them twice would mean resolving the same text twice; they are folded into the roster edit rather than done ahead of it. **Still open 2026-09-18** — the roster edit they were folded into never ran, so the four sentences stand uncorrected and now need a carrier of their own. They are a real defect independent of Union Alpha: §2 of that file says the split form is refused before launch, so those four sentences document a shape the guard rejects.
<!-- /ANCHOR:questions -->

---
