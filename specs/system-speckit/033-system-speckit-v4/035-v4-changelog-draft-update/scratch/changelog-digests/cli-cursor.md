# cli-cursor changelog digest

Skill path: `.opencode/skills/cli-external-orchestration/cli-cursor/`. Versions covered: v1.0.0.0 through v1.4.1.0, all six entries the changelog folder holds (fewer than 10 exist). Dated entries run 2026-08-12 to 2026-08-15 (verification dates carried in `v1.3.0.0.md`, `v1.4.0.0.md` and `v1.4.1.0.md`). The three earlier entries carry no dates.

---

## Per version, newest first

### v1.4.1.0 (`v1.4.1.0.md`)

Cursor's live roster exposed Google's Gemini 3.7 Flash family, and the curated allowlist took the High tier id `gemini-3.7-flash-high`, growing from 20 to 21 ids. It is the first Gemini id in curated Cursor scope. The id went into `CURSOR_SUPPORTED_MODELS` in `executor-config.ts` and into the hand-duplicated mirror `CURSOR_ALLOWED_MODELS` in `fanout-run.cjs`, sorted alphabetically, with the unit tests in `executor-config.vitest.ts` and `fanout-run.vitest.ts` updated in the same pass and 190 tests passing. Unlike the Luna Max addition this one was list-verified and dispatch-tested end to end on 2026-08-15, with a live probe returning exit 0 and an echoed marker. The entry documents a display-name footgun: Cursor's listing prints the id as "Gemini 3.7 Flash" while the High tier lives only in the id suffix. The sibling tiers `gemini-3.7-flash-low` and `gemini-3.7-flash-medium` stay out of scope and are asserted rejected by negative fixtures. Eight cli-cursor docs moved their count from 20 to 21. SKILL.md version moved to 1.4.1.0.

BREAKING-adjacent wording change in the same entry: the previous blanket claim that every Claude, Gemini or Kimi id is out of scope was amended to every Claude, other Gemini or Kimi id, because Gemini 3.7 Flash High is now in scope.

### v1.4.0.0 (`v1.4.0.0.md`)

Cursor's roster exposed a GPT-5.6 Luna persona alongside Sol and Terra, confirmed by `cursor-agent --list-models` on 2026-08-14. The curated allowlist took the two Max-tier ids `gpt-5.6-luna-max` and `gpt-5.6-luna-max-fast`, growing from 18 to 20 ids. These were the first GPT-5.6 persona ids in curated Cursor scope, and only the Max tier came in. The Sol and Terra personas and the other Luna tiers stayed out. The important honesty caveat is that these two ids were list-verified only and were not dispatch-tested, by operator decision, so neither code comments nor docs claim a dispatch test for them. Both allowlist arrays and their vitest suites moved together and 190 tests passed. The same pass corrected two stale count claims of "10" that packet 036 had left behind when the roster grew to 18.

### v1.3.0.0 (`v1.3.0.0.md`)

Cursor's roster added a `cursor-grok-4.6-*` family, confirmed by `cursor-agent --list-models` on 2026-08-12, and the vendor did not drop the `cursor-grok-4.5-*` ids. The curated allowlist added the full 8-id 4.6 family alongside the existing 6-id 4.5 family, growing from 10 to 18 ids. The 4.6 family carries a fourth thinking tier `xhigh` that 4.5 never had. Every 4.6 id was dispatch-tested end to end before landing, `cursor-grok-4.5-high` was re-dispatch-tested to confirm it still works, and the parameterized bracket form `cursor-grok-4.6[effort=high]` was re-confirmed rejected outright with exit 1 rather than assumed from the 4.5-era test. Composer and GLM 5.2 were unchanged. The full runtime suite of 188 tests and `tsc --noEmit` passed clean.

RENAME-adjacent presentation change in the same entry: every roster table and enumerated model list across the touched docs was resorted alphabetically by id, or by family name then id, instead of being grouped by release order.

### v1.2.0.0 (`v1.2.0.0.md`)

A README-only release. The old README opened with a tabular feature card whose overview named the tooling before the outcome, and its prose used punctuation forms the Human Voice Rules ban. The rewrite leads with the outcome, states the problem before the solution and keeps every fact the old document carried, on the refined template from the skill-readme-refinement packet with the mcp-obsidian README as exemplar. A new capability section names the dispatch guard rails: the smart router, the enforced model allowlist, the auth pre-flight, the self-invocation guard and the memory handback. The version field had drifted, reading 1.0.0.0 while the changelog head was v1.1.0.0, so it moved to 1.2.0.0 to match the changelog head again. SKILL.md deliberately stayed at 1.1.0.0 and routing was untouched.

### v1.1.0.0 (`v1.1.0.0.md`)

Model facts were spread across `SKILL.md` and `references/cli-reference.md`, so the safety-critical detail that dispatch is scoped to a hard-enforced allowlist was easy to miss. This release added `references/providers-and-models.md` as the single-source catalog for the one backing provider (Cursor via `cursor-agent`), the enforced 10-id allowlist as it then stood, the default model, the suffix-baked effort model and the dispatch shape. There is no `--effort` flag on this executor, because the tier is baked into the model id. The catalog was registered as a routable reference leaf. The full allowlist is mirrored inline because it is a safety contract, and the entry states that where code and doc diverge the code in `executor-config.ts` wins.

MOVED PATH in the same entry: the duplicated model facts in `cli-reference.md` section 5 and the `SKILL.md` roster were trimmed to a compact residue plus a pointer to the new catalog. The effort explanation, the id-form footgun and the dispatch envelope now live only in `references/providers-and-models.md`. The enforced allowlist itself stayed inline in `cli-reference.md`.

### v1.0.0.0 (`v1.0.0.0.md`)

First release. It packaged safe execution rules, delegation patterns and reference docs grounded in a live-verified Cursor CLI contract so other assistants could delegate focused work to `cursor-agent`. Routing patterns cover generation, review, Composer-model dispatch, read-only plan and ask exploration and agent-based delegation. Guardrails cover the approval and sandbox flag mapping, Cursor's always-zero exit code and its shared editor-config surface. A self-invocation guard built from live-confirmed `CURSOR_AGENT` and `CURSOR_CONVERSATION_ID` env signals plus process ancestry stops a session already running inside Cursor CLI from dispatching itself. Shipped alongside were a main guide, references for Cursor's worktree, cloud-worker and plugin surfaces plus its hooks.json contract, and reusable prompt templates. The hub's `mode-registry.json` and `hub-router.json` registered cli-cursor as the hub's fourth workflow mode.

---

## Facts the v4 draft gets wrong or misses

- Draft line 173 says "Composer behind Cursor" as if Composer were the Cursor story. By `v1.4.1.0.md` the enforced Cursor allowlist holds 21 ids across the Composer, Grok 4.5, Grok 4.6, GLM 5.2, GPT-5.6 Luna Max and Gemini 3.7 Flash High families. The draft's one-model shorthand understates the roster by a wide margin, and the growth path 10 to 18 to 20 to 21 (`v1.1.0.0.md`, `v1.3.0.0.md`, `v1.4.0.0.md`, `v1.4.1.0.md`) is absent from the draft entirely.
- Draft lines 227 and 445 say Gemini is gone, retired with `cli-gemini` and cleaned out of the skill tree. That is true of the Gemini bridge, but `v1.4.1.0.md` puts a Gemini model back in reach through Cursor as `gemini-3.7-flash-high`, list-verified and dispatch-tested on 2026-08-15. A reader of the draft would conclude no Gemini model is reachable in v4. The draft should qualify the retirement as bridge-only.
- Draft line 176 states each CLI kind carries an enforced model allowlist but names no enforcement point. The entries are specific: `CURSOR_SUPPORTED_MODELS` in `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` is the source, with a hand-duplicated mirror `CURSOR_ALLOWED_MODELS` in `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` that must be kept in sync (`v1.1.0.0.md`, `v1.3.0.0.md`, `v1.4.0.0.md`, `v1.4.1.0.md`). The duplication is a real maintenance hazard the draft never mentions.
- The draft never records the verification-honesty distinction the entries make load-bearing. `v1.3.0.0.md` and `v1.4.1.0.md` ids were dispatch-tested end to end. `v1.4.0.0.md` Luna Max ids were list-verified only, by operator decision, and are documented as not dispatch-tested. A release note that presents the roster as uniformly proven would be wrong.
- Draft line 201 and line 207 cover the hub merge and binary gating but miss the two Cursor-specific safety mechanisms `v1.0.0.0.md` introduces: the self-invocation guard keyed on `CURSOR_AGENT` and `CURSOR_CONVERSATION_ID` plus process ancestry, and the fact that `cursor-agent` always exits zero so exit status is not a usable success signal. Both change how a caller must treat this executor.
- The draft misses Cursor's read-only modes and its isolation surfaces. `v1.0.0.0.md` documents `--mode plan` and `--mode ask` as read-only dispatch shapes, plus native git worktree isolation, a cloud worker and a plugin marketplace. The hub's `mode-registry.json` marks these as opt-in escape hatches rather than the default dispatch shape.
- The draft misses the effort-model quirk. `v1.1.0.0.md` records that cli-cursor has no `--effort` flag because the tier is baked into the model id suffix, and `v1.4.1.0.md` adds the display-name footgun where Cursor prints `gemini-3.7-flash-high` as "Gemini 3.7 Flash". Both are id-construction traps for anyone writing a dispatch by hand.

## Current version and identity

`SKILL.md` frontmatter carries `version: 1.4.1.0`, matching the changelog head `v1.4.1.0.md`. It also declares `name: cli-cursor`, `allowed-tools: [Bash, Read, Glob, Grep]` and two `hard_rules`: `stdin-redirect-required` (warn) and `cursor-availability-required` (error, requiring `command -v cursor-agent` before every dispatch).

cli-cursor is a MODE, not a hub and not standalone. There is no `mode-registry.json`, `description.json`, `hub-router.json` or `graph-metadata.json` at the `cli-cursor/` root. The parent `.opencode/skills/cli-external-orchestration/` holds the hub metadata set (`mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, `leaf-manifest.json`), and its `mode-registry.json` lists `workflowMode: "cli-cursor"` with `packetKind: "workflow"`, `backendKind: "cli-dispatch"`, `packet: "cli-cursor"`, `grandfatheredFolderMismatch: false`, `command: null` and `advisorRouting.routingClass: "metadata"`. Routing class metadata means cli-cursor carries no advisor entry of its own and is reached only through the hub identity `cli-external-orchestration`. Aliases registered on the hub for this mode are `cursor`, `cursor cli`, `delegate to cursor`, `cursor agent` and `cli-cursor`. It is one of six sibling workflow modes alongside cli-opencode, cli-codex, cli-devin, cli-pi and cli-claude-code.
