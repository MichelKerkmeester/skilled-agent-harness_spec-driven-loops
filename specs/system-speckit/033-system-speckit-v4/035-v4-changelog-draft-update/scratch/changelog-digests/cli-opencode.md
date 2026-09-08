# cli-opencode changelog digest

Skill path: `.opencode/skills/cli-external-orchestration/cli-opencode/`. Versions covered: v1.3.12.0 through v1.4.3.0 (the last 10 of 24 entries in `changelog/`). Dated entries run 2026-06-07 (`v1.3.14.0.md`) to 2026-08-14 (the confirmation date inside `v1.4.2.0.md`). Three entries carry no release date: `v1.3.12.0.md`, `v1.3.13.0.md` and `v1.4.3.0.md`.

---

## Per-version digest, newest first

### v1.4.3.0

REMOVED the direct `deepseek` provider, every DeepSeek V4 Pro entry and every GPT-5.6 Terra slug (base, fast and pro) from the roster, the cline-pass route, the examples and the pre-flight trees. BREAKING the default dispatch changed to `opencode run --model opencode-go/deepseek-v4-flash --variant max --format json --dir <repo-root>`, with flash pinned to max tier by policy, applied across SKILL.md, README, the roster, cli-reference's pre-flight decision tree, agent-delegation, integration-patterns, opencode-tools, prompt-templates, permissions-matrix, context-budget and the destructive-scope fallback advice. The provider auth pre-flight now keys the default on `OPENCODE_GO_OK` instead of a deepseek login check. REMOVED playbook scenario CO-011 (deepseek direct API) and its feature file, while CO-012 keeps flash variant coverage on the opencode-go route. The OpenRouter three-model allowlist, the cline-pass flash and GLM routes, the minimax, xiaomi and openai catalogs and the incident history in `references/destructive-scope-violations.md` were left alone. Source: `v1.4.3.0.md`.

### v1.4.2.0

Documentation-only catalog fix. `references/providers-and-models.md` gained an `opencode-go/glm-5.3` row and its gateway family line moved from "DeepSeek and Qwen" to "DeepSeek, GLM, and Qwen". The entry states plainly that cli-opencode has no code-enforced model allowlist, because `--model provider/model-id` is free-form, so the id was already dispatchable and only the catalog was behind. The id was list-verified against `opencode models opencode-go` on 2026-08-14 and not dispatch-tested, an explicit operator decision. Source: `v1.4.2.0.md`.

### v1.4.1.0

Purpose-first rewrite of `README.md` onto the refined skill README template: a one-line pitch blockquote, an AT A GLANCE table, a problem-first overview and a new capability section called The Dispatch Surface. Every dispatch fact from the old README survived, including the default invocation shape, the `</dev/null` rule, the top-level `--agent` caveats, the three-layer self-invocation guard and the `--share` confirmation gate. The README `version:` field was corrected from a drifted `1.3.0.29` up to `1.4.1.0`, and the provider prose was corrected to the four documented providers `deepseek`, `minimax`, `xiaomi` and `openai`. Source: `v1.4.1.0.md`.

### v1.4.0.0

Added a new routable reference leaf, `references/providers-and-models.md`, registered in the hub `leaf-manifest.json`, as the single authority for providers, model ids, the `--variant` effort map and dispatch shapes. REMOVED from the published roster: `kimi-for-coding`, `zai-coding-plan` (GLM), the Token Plan providers `minimax-coding-plan` and `xiaomi-token-plan-ams`, and the plain `gpt-5.6` slugs. The roster kept `deepseek` (v4-pro default and v4-flash), `minimax` Direct (MiniMax-M3), `xiaomi` Direct (mimo-v2.5-pro and -ultraspeed) and OpenAI GPT-5.6 across sol, terra and luna times base, fast and pro. `cli-reference.md` section 5 and the SKILL.md roster were trimmed to a compact residue plus a pointer to the new catalog. No default-model, dispatch-envelope or auth pre-flight behavior changed. Source: `v1.4.0.0.md`, packet `specs/cli-external-orchestration/033-per-mode-provider-model-reference/`.

### v1.3.15.3

Content-hygiene pass fixing five real bugs found by the whole-program deep review. The biggest is a safety self-contradiction: ALWAYS Rule 16 told the reader to run a blanket `pkill -9 -f "opencode run"`, which kills every opencode run on the machine including operator-owned sessions that ALWAYS Rule 5 protects. Rule 16 now captures the dispatched PID and kills only that PID plus its own children. REMOVED a stale sibling-boundary README row that carried the retired `cli-codex` skill's description mislabeled as `cli-opencode`. A `--share` confirmation note was added above the README Step 4 quick start. The Step 3 default-dispatch recipe dropped its top-level `--agent context` flag, which had contradicted ALWAYS Rule 3, and folded the role into the prompt body. Six corrupted manual-testing-playbook filename links were repaired after a concurrent session's blanket find and replace split a filename across a path segment. Source: `v1.3.15.3.md`.

### v1.3.15.2

RENAME of the whole OpenAI model family in the docs: every live GPT-5.5 reference became GPT-5.6, and the catalog grew from one line of three tiers to twelve slugs, a bare tier plus the Sol, Terra and Luna families each in base, fast and pro. `gpt-5.6-sol` became the adopted flagship default, with `gpt-5.5` mapping to `gpt-5.6-sol`, `gpt-5.5-fast` to `gpt-5.6-sol-fast` and `gpt-5.5-pro` to `gpt-5.6-sol-pro`. A wording bug was fixed too: base, fast and pro are model tiers and are orthogonal to the `--variant` reasoning-effort lever, which the prior text had conflated. Two caveats are on record. The Pro-tier variant restriction was carried over from `gpt-5.5-pro` rather than re-measured, and the destructive-scope Layer 4 recommendation of `cli-copilot` plus `gpt-5.6-sol` names a model whose availability on the Copilot surface is unverified, with the entry noting no `cli-copilot` skill exists under `.opencode/skills/` at all. Source: `v1.3.15.2.md`, released 2026-07-09.

### v1.3.15.0

REMOVED the `opencode-go` gateway provider from every operational surface of the skill. BREAKING the default model and provider moved from `opencode-go/deepseek-v4-pro` to the direct `deepseek/deepseek-v4-pro --variant high`, the same underlying model on a separately funded credential. The trigger was a live dispatch failing with `401 Insufficient balance` from the gateway's shared credit pool, mid-run rather than at pre-flight. `OPENCODE_GO_OK` left the pre-flight, the README provider count dropped from eight to seven and gateway-only models `glm-5.1`, `glm-5.2`, `qwen3.6-plus` and `mimo-v2.5-free` were dropped for having no direct-provider equivalent. The RM-8 destructive-scope incident record naming the old gateway dispatch was deliberately preserved as history. Left open: the manual-testing-playbook still referenced opencode-go, including two gateway-only scenario files. Source: `v1.3.15.0.md`, released 2026-06-26.

### v1.3.14.0

Added the Xiaomi Direct API provider `xiaomi` as a pay-per-token alternative to the Token Plan provider `xiaomi-token-plan-ams`, on model `xiaomi/mimo-v2.5-pro`, authenticated with `opencode providers login xiaomi` and detected in pre-flight as `XIAOMI_DIRECT_OK`. A four-row MiMo routing table covers Token Plan default, Token Plan missing, Direct API requested and Direct API missing. REMOVED every MiniMax M2.7 reference including the `-highspeed` variants, leaving MiniMax-M3 as the sole model for both `minimax-coding-plan` and `minimax`. The trigger phrases in `graph-metadata.json` dropped `minimax-2.7` and the `-highspeed` forms and gained the xiaomi API phrases. The 120/003 benchmark TIDD-EC and dense contract, originally measured on M2.7, was carried forward to M3 pending a re-benchmark. Source: `v1.3.14.0.md`, released 2026-06-07.

### v1.3.13.0

Landed the `references/cli-reference.md` edit that v1.3.12.0 had held back: a benchmark-dated row documenting plain `minimax-coding-plan/MiniMax-M3` as a confirmed-live dispatchable id, backed by 20 clean benchmark dispatches with `--variant high` accepted, together with that file's section dividers. REMOVED a stray leading `---` before section 1 of `assets/prompt-templates.md` for consistency with the sibling asset cards. No dispatch behavior changed. Source: `v1.3.13.0.md`.

### v1.3.12.0

Pure formatting sweep adding the sk-doc section dividers that five reference docs were missing before their numbered H2 sections, plus the section-1 leading divider in `permissions-matrix.md` and `context-budget.md`. Two H2s in the agent-delegation reference had a divider floating mid-content instead of immediately before the heading and were fixed. The edits add only blank and divider lines, verified byte-identical on every other line. `references/cli-reference.md` was deferred because it carried an unrelated uncommitted content edit at sweep time. Source: `v1.3.12.0.md`.

---

## Facts the v4 draft gets wrong or misses

- The draft's claim of an enforced allowlist is contradicted for this mode. `CHANGELOG-v4.0.0.0.md` line 176 says "A closed roster per executor. Each CLI kind carries an enforced model allowlist, so an off-roster id fails at dispatch instead of quietly landing on a default." `v1.4.2.0.md` states the opposite for cli-opencode: it "has no code-enforced model allowlist (`--model provider/model-id` is free-form)", which is why an undocumented id was already dispatchable. `v1.4.3.0.md` names an allowlist only for the OpenRouter three-model route, not for the mode as a whole.
- The draft never names cli-opencode's default model, and that default moved twice inside this window. `v1.3.15.0.md` moved it from `opencode-go/deepseek-v4-pro` to the direct `deepseek/deepseek-v4-pro`, then `v1.4.3.0.md` removed the direct deepseek provider entirely and made `opencode-go/deepseek-v4-flash --variant max` the default. The draft mentions DeepSeek V4 Flash only at line 218 as a Pi roster fact, so a reader learns nothing about the opencode default or its two breaking moves.
- The draft misses the new providers-and-models reference leaf. `v1.4.0.0.md` added `references/providers-and-models.md` as the single source of truth for providers, model ids, effort and dispatch shapes, registered in the hub `leaf-manifest.json`, and trimmed the duplicated roster out of `SKILL.md` and `cli-reference.md`. Nothing in the draft's "Orchestrating Other AIs" section, lines 195 to 227, records it.
- The draft misses the OpenAI family rename and its later trim. `v1.3.15.2.md` replaced GPT-5.5 with the twelve-slug GPT-5.6 catalog and adopted `gpt-5.6-sol` as flagship default, then `v1.4.3.0.md` removed every Terra slug. Both are breaking for anyone pinned to an old slug, and neither appears in the draft's breaking-changes list at lines 441 to 458.
- The draft misses the provider roster churn. `v1.3.14.0.md` added the Xiaomi Direct API and removed MiniMax M2.7, and `v1.4.0.0.md` dropped `kimi-for-coding`, `zai-coding-plan` and both Token Plan providers from the published roster. The draft has no provider-level detail for any executor other than Pi.
- The draft's retirement claim at line 227 is incomplete for this mode. It says `cli-copilot` is gone from the skill tree, the advisor's scoring and hub routing. `v1.3.15.2.md` records that cli-opencode's own safety layer still recommends `cli-copilot` plus `gpt-5.6-sol` in `references/destructive-scope-violations.md` Layer 4 and in SKILL.md ALWAYS rule 15, annotated as unverified, and notes that no `cli-copilot` skill exists under `.opencode/skills/` at all. A live recommendation pointing at a retired surface survives inside the mode.

---

## Current version and identity

`SKILL.md` frontmatter carries `version: 1.4.3.0`, matching the newest changelog entry `v1.4.3.0.md`. Note a drift worth flagging: `README.md` frontmatter still reads `version: 1.4.2.0`, one release behind, and `v1.4.3.0.md` records only a SKILL.md version bump.

cli-opencode is a mode, not a hub and not standalone. There is no `mode-registry.json` at `cli-opencode/`, and the parent `.opencode/skills/cli-external-orchestration/mode-registry.json` lists it as `workflowMode: "cli-opencode"` with `packetKind` "workflow" and `routingClass: "metadata"`, meaning it is resolved by hub membership and carries no advisor map entry of its own. The parent holds the hub-only files `description.json`, `mode-registry.json` and `hub-router.json`, and `hub-router.json` sets `defaultMode: null`. The mode root holds `SKILL.md`, `README.md`, `references/`, `assets/`, `benchmark/`, `changelog/` and `manual-testing-playbook/`, with no root metadata of its own.
