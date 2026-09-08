# cli-devin changelog digest

Skill path: `.opencode/skills/cli-external-orchestration/cli-devin/`
Versions covered: v1.0.0.0 to v1.4.1.0 (6 entries, the full changelog, fewer than the requested 10)
Date range: only the last three entries carry dates, 2026-08-12 (v1.3.0.0) through 2026-08-15 (v1.4.1.0). v1.0.0.0, v1.1.0.0 and v1.2.0.0 carry no dates.

---

## Per version, newest first

### v1.4.1.0

Adds Google's Gemini 3.7 Flash High to the curated Devin model allowlist, the first Gemini uid in Devin's curated scope, taking the roster from five families to six. The uid `gemini-3-7-flash-high` was added to `DEVIN_SUPPORTED_MODELS` in `executor-config.ts` and to its hand-duplicated mirror `DEVIN_ALLOWED_MODELS` in `fanout-run.cjs`, with unit tests updated in the same change and a negative fixture asserting `gemini-3-7-flash-low` stays rejected. Unlike the previous release this uid was both list-verified and dispatch-tested end to end on 2026-08-15, with a live probe returning exit 0 and an echoed marker. The sibling tiers `gemini-3-7-flash-minimal`, `-low` and `-medium` stay out of scope. Cited from `v1.4.1.0.md`.

### v1.4.0.0

Adds four Max-tier uids confirmed by `devin models list` on 2026-08-14: `deepseek-v4-flash-max`, `deepseek-v4-pro-max`, `gpt-5-6-luna-max` and `gpt-5-6-luna-max-priority`. The curated scope grows from four families to five because GPT-5.6 is new. Devin encodes its "Fast" speed tier as the `-priority` suffix, so `gpt-5-6-luna-max-priority` is the Fast variant of Luna Max. Per operator decision these four were list-verified only and not dispatch-tested, and the code comments and docs say so. The DeepSeek request was scoped to max thinking levels, so the `-low` and `-high` DeepSeek tiers Devin also exposes were deliberately left out. Cited from `v1.4.0.0.md`.

### v1.3.0.0

Adds the Grok 4.6 family, `grok-4-6-low`, `-medium`, `-high` and `-xhigh`, alongside the still-present Grok 4.5 uids. This is an addition and not a swap, since Cognition had not dropped 4.5. The 4.6 family carries a fourth effort tier, `xhigh`, that 4.5 never had, and every `grok-4-6-*` uid was dispatch-tested end to end before landing, with `grok-4-5-high` independently re-tested. Both allowlist arrays and their unit coverage were updated together and the full 188-test runtime suite plus `tsc --noEmit` passed. Model rosters and tables across the touched docs were resorted alphabetically by family then by uid rather than grouped by release order. Cited from `v1.3.0.0.md`.

### v1.2.0.0

Rewrites the cli-devin README purpose-first on the shared skill README template, replacing an aspect-table opening with a one-line pitch, an at-a-glance table and a problem-first overview that names when a second AI perspective pays off. REMOVED stale model examples from the README, specifically `adaptive`, `opus`, `gpt` and the SWE-1.6 ids that the curated catalog had already retired, replacing them with the four curated families and the `swe` default. The version field also moved to 1.2.0.0 to catch up with the changelog, which it had lagged by a full release. Cited from `v1.2.0.0.md`.

### v1.1.0.0

Consolidates Devin's model facts, which had been duplicated between a `references/cli-reference.md` section 5 block and an inline roster in `SKILL.md` and had drifted apart, into one new single-source catalog at `references/providers-and-models.md`, registered as a routable leaf. BREAKING for anyone selecting models by name, the roster was curated down to four families read from a live `devin models list` and REMOVED the ids `adaptive`, `opus`, `sonnet`, `claude`, `haiku`, `gpt`, `codex`, `gemini`, `kimi` and the SWE-1.6 ids, which no longer resolve. BREAKING and a changed default, the catalog default moved from `adaptive` to `swe`, where the `swe` alias resolves to `swe-1-7-lightning`. The `adaptive` router remains visible in `devin models list` but is outside the curated catalog's scope. The four surviving families were GLM-5.2 with six variants, SWE-1.7 with three, Grok 4.5 with three, and DeepSeek V4 Pro. Cited from `v1.1.0.0.md`.

### v1.0.0.0

First release of the skill, packaging safe execution rules, delegation patterns and reference docs for Cognition's Devin CLI against a live-verified contract. It introduced routing patterns for generation, review, research, architecture work, subagent delegation and cloud handoff, so Devin is picked deliberately rather than used as a generic fallback. It also introduced the safety layer: Devin's 4-tier permission model, OS-level sandboxing, and a self-invocation guard built from the `DEVIN_PROJECT_DIR` environment signal plus process ancestry so a session already running inside Devin CLI never dispatches itself. Shipped `SKILL.md`, `README.md`, five references covering the CLI, integration patterns, Devin tools, agent delegation and cloud handoff, plus two prompt assets. Cited from `v1.0.0.0.md`.

---

## Facts the v4 draft gets wrong or misses

- Draft line 173 says "Put GPT behind Codex, GLM behind Devin, Composer behind Cursor, DeepSeek behind Pi". Two of those attributions are incomplete for Devin. Per `v1.4.0.0.md`, Devin's curated allowlist carries `gpt-5-6-luna-max` and `gpt-5-6-luna-max-priority`, so GPT is not only behind Codex. Per `v1.1.0.0.md` and `v1.4.0.0.md`, Devin's curated allowlist carries `deepseek-v4`, `deepseek-v4-pro`, `deepseek-v4-flash-max` and `deepseek-v4-pro-max`, so DeepSeek is not only behind Pi. Draft line 218 reinforces the second by presenting DeepSeek V4 Flash as a Pi-only roster item.
- Draft lines 227 and 445 say the Gemini bridge was retired and that `cli-gemini` is gone from the skill tree, advisor scoring and hub routing. That is true of the standalone `cli-gemini` skill but it leaves the reader believing Gemini is unreachable. Per `v1.4.1.0.md`, `gemini-3-7-flash-high` was added to Devin's curated allowlist on 2026-08-15, list-verified and dispatch-tested, so Gemini is reachable through the Devin executor. The draft never says this.
- Draft line 176 says each CLI kind carries an enforced model allowlist so an off-roster id fails at dispatch. The mechanism is right but the draft misses that for Devin the allowlist lives in two hand-duplicated places that must be kept in sync, `DEVIN_SUPPORTED_MODELS` in `executor-config.ts` and `DEVIN_ALLOWED_MODELS` in `fanout-run.cjs`, named as such in `v1.3.0.0.md`, `v1.4.0.0.md` and `v1.4.1.0.md`.
- The draft nowhere records the Devin default-model change. Per `v1.1.0.0.md`, the curated default moved from `adaptive` to `swe`, resolving to `swe-1-7-lightning`, and the ids `adaptive`, `opus`, `sonnet`, `claude`, `haiku`, `gpt`, `codex`, `gemini`, `kimi` and SWE-1.6 were removed from the curated roster. Anyone scripting a Devin dispatch against an old id is affected and the draft gives them no warning.
- The draft misses the Devin roster's final shape entirely. Per `v1.4.1.0.md` the curated scope is six families, DeepSeek, Gemini, GLM-5.2, GPT-5.6 Luna, Grok (4.5 and 4.6) and SWE-1.7. The draft's only Devin model claim is the single word GLM at line 173.
- Draft line 207 says every executor is gated fail-closed on `command -v devin` and similar. This is consistent with the entries and with the `devin-availability-required` hard rule in `SKILL.md`. No correction needed.
- The draft does not mention Devin's self-invocation guard from `v1.0.0.0.md`, the `DEVIN_PROJECT_DIR` plus process-ancestry check that stops a session already inside Devin CLI from dispatching itself. This is a safety property of the executor the draft's "Executors That Only Run When Installed" section at line 205 comes close to but does not cover.
- Verification confidence differs across the additions and the draft flattens it. Per `v1.3.0.0.md` and `v1.4.1.0.md` the Grok 4.6 and Gemini uids were dispatch-tested end to end, while per `v1.4.0.0.md` the DeepSeek Max and GPT-5.6 Luna uids were list-verified only by operator decision. The draft claims at line 175 that CLI adapters were stress-tested and repaired to parity, which reads as uniform coverage.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `1.4.1.0`, matching the newest changelog entry `v1.4.1.0.md`.
- Identity: a MODE, not a hub and not standalone. There is no `mode-registry.json`, `hub-router.json` or `description.json` at the `cli-devin/` root. The parent `.opencode/skills/cli-external-orchestration/` holds `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json`, and its registry lists `"workflowMode": "cli-devin"` with `"packet": "cli-devin"` and `"packetSkillName": "cli-devin"`. The parent registry classes cli-devin as a `workflow` packet, one of the six executor modes alongside cli-opencode, cli-claude-code, cli-codex, cli-cursor and cli-pi.
