# cli-codex changelog digest

Skill path: `.opencode/skills/cli-external-orchestration/cli-codex/`
Versions covered: v1.4.8.0 (oldest) through v1.9.0.0 (newest), the last 10 of 24 changelog entries.
Date range: none. No entry in this set carries a date field.

---

## Per version, newest first

### v1.9.0.0

`v1.9.0.0.md` records a purpose-first rewrite of `README.md` on the refined skill README template. The new README leads with a one-line pitch, then a problem-first OVERVIEW, an AT A GLANCE table and a dedicated dispatch capabilities section, in the narrative voice the mcp-obsidian pilot set. The entry states the rewrite keeps every capability, trap, boundary and integration fact of the prior document, including the two silent `codex exec` traps, the three-layer self-invocation guard, the agent roster and the per-model effort ceilings. It also records that the README `version:` field had drifted to 1.5.0.0 while the changelog folder already held entries through v1.8.0.0, and moves it to 1.9.0.0 to match the changelog head. Source packet cited: `.opencode/specs/sk-doc/026-skill-readme-refinement/005-mode-child-readme-revisit/002-cli-codex/`.

### v1.8.0.0

`v1.8.0.0.md` single-sources the provider and model facts. It adds `references/providers-and-models.md` as a dedicated catalog owning the OpenAI provider (ChatGPT OAuth only), the four model ids and their per-model effort ceilings (`gpt-5.5` at most `xhigh`, `gpt-5.6-luna` and `gpt-5.6-terra` at most `max`, `gpt-5.6-sol` at most `ultra`), the default invocation shape, the `-c model_reasoning_effort=` lever with its 8-level ladder, and the dispatch envelopes. The catalog is registered as a routable leaf so the smart router loads it on model and effort intents, and its section 2 is shaped as a per-provider heading plus table (`### OpenAI`) so a second provider slots in as a sibling. RENAME of ownership rather than of a file: the roster tables in `SKILL.md` and in `references/cli-reference.md` §5 MODEL SELECTION were trimmed to a compact residue plus a pointer at the new catalog, with the config-profile mechanics kept inline in `cli-reference.md`. The entry states no routing behavior, model, default or rule changed and that no model was added or removed. Source packet cited: `.opencode/specs/cli-external-orchestration/033-per-mode-provider-model-reference/`.

### v1.7.1.0

`v1.7.1.0.md` is a small follow-up condensation of `SKILL.md`. The Codex Agent Delegation table drops its `Invocation Pattern` column, seven full `codex exec -p ...` examples that duplicated `references/agent-delegation.md`, leaving a two-column Task to Profile table plus a one-line note for the built-in `codex exec review` subcommand. The entry notes `SKILL.md` had already been condensed once at v1.6.1.0 so the remaining content is largely load-bearing, and that ALWAYS rules 10 to 16 were deliberately left verbatim rather than tightened. All 16 ALWAYS rules, 5 NEVER rules, 4 ESCALATE conditions, the Memory Handback protocol, the four-model roster, the router dictionaries, the self-invocation guard and the OAuth pre-flight are preserved. No routing behavior, rule, model or contract changed.

### v1.7.0.0

BREAKING: `v1.7.0.0.md` makes cli-codex authenticate through ChatGPT OAuth only and REMOVED the OpenAI API key path. The `OPENAI_API_KEY` env-var method is gone from the dispatch flow, the auth pre-flight, the reference tables and the troubleshooting guidance. The two-variable `OPENAI_KEY_OK` / `CODEX_OAUTH_OK` decision tree collapses to a single OAuth check, and when the CLI is not logged in the skill surfaces `codex login` and waits rather than dispatching. `references/cli-reference.md` §3 Authentication, §13 Troubleshooting and §14 Environment Variables drop the API-key method, the env var and the `platform.openai.com` key-management link. `codex login` needs a ChatGPT Plus, Pro, Business, Edu or Enterprise account. The model roster, routing, sandbox modes and every dispatch rule are untouched, and the generic NEVER rule against sending secrets in prompts stays as secret hygiene. Upgrade note: a machine that relied on `OPENAI_API_KEY` must run `codex login` once.

### v1.6.1.0

`v1.6.1.0.md` condenses `SKILL.md` from 4630 to 3976 words by relocating duplicated reference tables into pointers at `references/cli-reference.md`, which is ALWAYS loaded on every invocation. The full flag glossary, the unique-capabilities table, the essential-command examples and the troubleshooting table left `SKILL.md`, which now carries only the three dispatch-critical gotchas (the read-only sandbox default that silently no-ops, the explicit `service_tier="fast"`, and the fact that there is no `--reasoning-effort` flag) plus a pointer. The duplicate install and auth block, the repeated per-model ceiling clause and the duplicated sandbox and fast-mode warnings were each consolidated to one authoritative statement, and section 8 now points at the section 5 reference index instead of restating it. Nothing about routing, rules, models or contracts changed.

### v1.6.0.0

`v1.6.0.0.md` replaces the single `gpt-5.5` model lock with a documented four-model roster: `gpt-5.5` as default plus `gpt-5.6-luna`, `gpt-5.6-terra` and `gpt-5.6-sol`. It extends the documented reasoning-effort scale from `none` through `xhigh` by adding `max` and `ultra`, with per-model ceilings of `xhigh` for `gpt-5.5`, `max` for luna and terra, and `ultra` for sol. Guidance is to default to `gpt-5.5 medium`, escalate to `gpt-5.6-luna max` for deep implementation and `gpt-5.6-sol xhigh` or `ultra` for verification and review. All twenty model by effort cells were live-verified callable through `codex exec` on ChatGPT OAuth before the docs were written. The CX-002 manual-testing scenario was reframed from asserting a single supported model to verifying the default pin plus the callable GPT-5.6 roster. Default dispatch is unchanged at `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"`.

### v1.5.0.0

`v1.5.0.0.md` revives cli-codex as a nested workflow packet under the `cli-external-orchestration` hub. RENAME of location: the retired skill contract moved into `cli-external-orchestration/cli-codex/` under nested-packet metadata rules, and operator and reference paths were normalized to resolve from the renamed hub topology. Fail-closed routing is preserved, so `command -v codex` must succeed before dispatch and Codex self-invocation stays prohibited. Orchestrated execution delegates to the existing deep-loop `cli-codex` adapter instead of adding a second process path. The mode was registered in the hub registry and the lexical router. BREAKING for callers: the upgrade note says to route Codex requests through `cli-external-orchestration` using workflow mode `cli-codex` rather than at a standalone skill identity.

### v1.4.10.0

`v1.4.10.0.md` REMOVED the stray leading `---` divider that sat before section 1 of `assets/prompt-templates.md`, since the sk-doc asset template goes title, intro, then section 1 with no divider. Only the divider and one blank line were removed, so it now matches `prompt-quality-card.md` and the other cli asset cards. No dispatch behavior changed.

### v1.4.9.0

`v1.4.9.0.md` adds the missing sk-doc section dividers to `references/cli-reference.md`, `references/hook-contract.md`, `references/integration-patterns.md`, `assets/prompt-quality-card.md` and `assets/prompt-templates.md`, which had numbered H2 sections running together with no `---` separator. The edits add only blank and divider lines, and the entry records that a content-skeleton diff against the prior version was byte-identical on every non-blank, non-divider line, with an adversarial per-skill audit confirming every non-first H2 now carries its divider. No dispatch behavior changed.

### v1.4.8.0

`v1.4.8.0.md` records a mechanical reference repoint. RENAME of path: the canonical `cli_prompt_quality_card.md` moved out of sk-prompt into the sk-prompt-models hub, so this skill's references in `SKILL.md` and `assets/prompt-quality-card.md` were repointed at the new hub location. The stated reason is that every link keeps resolving and sk-prompt stays a forkable generic engine. No change to dispatch behavior.

---

## Facts the v4 draft gets wrong or misses

- The draft never mentions the four-model GPT-5.5 and GPT-5.6 roster or the per-model reasoning-effort ceilings, which `v1.6.0.0.md` documents as the replacement for the earlier single `gpt-5.5` lock. Draft line 173 only says "Put GPT behind Codex" and names no model or effort ceiling, so a reader learns nothing about `gpt-5.6-luna`, `gpt-5.6-terra` or `gpt-5.6-sol`.
- The draft misses the OAuth-only auth change entirely. `v1.7.0.0.md` removes the `OPENAI_API_KEY` path, which is a breaking migration for any machine that used it, and no draft line covers it. Draft line 430 mentions an "OpenAI-compatible" transport for a different feature (the rewrite model adapters), which is unrelated and could be misread as covering this.
- The draft misses the dedicated `references/providers-and-models.md` catalog added in `v1.8.0.0.md`, and the fact that it is registered as a routable leaf loaded on model and effort intents. The draft's hub section (lines 199 to 207) describes routing only at the executor level.
- Draft line 201 says two executors "stop being independently routable top-level identities" and names `cli-opencode` and `cli-claude-code`. `v1.5.0.0.md` shows cli-codex also lost its standalone identity in this cycle, since its upgrade note tells callers to route Codex through `cli-external-orchestration` with workflow mode `cli-codex`. The draft covers the fact loosely at line 207 by saying Codex was deprecated then brought back, but the count of "two" at line 201 does not square with a Codex that is now reachable only as a hub mode.
- Nothing in the draft is contradicted by these entries on the fail-closed binary gate. Draft line 207 states the `command -v codex` check, which `v1.5.0.0.md` confirms as a preserved hard rule.

---

## Current version and identity

- `SKILL.md` frontmatter `version:` is **1.8.0.0**, one release behind the changelog head of v1.9.0.0. `README.md` frontmatter carries **1.9.1.0**, one release ahead of the changelog head. The three sources disagree, which the fleet convention says they should not.
- Identity: **mode**. There is no `mode-registry.json` at `.opencode/skills/cli-external-orchestration/cli-codex/`, and no `graph-metadata.json` there either. The parent `.opencode/skills/cli-external-orchestration/` holds `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json`, and its registry lists `"workflowMode": "cli-codex"` with `"packet": "cli-codex"`, classified as a `workflow` packet. cli-codex is therefore a workflow mode under the cli-external-orchestration hub, not a standalone skill and not a hub itself.
