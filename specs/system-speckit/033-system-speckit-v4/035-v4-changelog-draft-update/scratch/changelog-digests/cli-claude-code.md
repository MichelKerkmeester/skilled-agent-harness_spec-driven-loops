# cli-claude-code changelog digest

Skill path: `.opencode/skills/cli-external-orchestration/cli-claude-code/`
Versions covered: v1.1.8.0 (oldest) through v1.5.0.0 (newest), 10 of the 18 entries in `changelog/`.
Date range: only the two oldest entries carry a release date, 2026-06-02 (`v1.1.8.0.md`) to 2026-06-03 (`v1.1.9.0.md`). Entries `v1.1.10.0.md` through `v1.5.0.0.md` carry no date field.

---

## 1. PER-VERSION DIGEST (NEWEST FIRST)

### v1.5.0.0 (`v1.5.0.0.md`)

The skill README was rewritten purpose-first on the refined skill README template. It now opens with a one-line pitch and a problem-first overview, then carries the agent roster as a capability table, the dispatch lifecycle, the self-invocation guard, the auth pre-flight and the Memory Handback, closing with troubleshooting, FAQ, verification and related documents. The sibling boundaries table was corrected because the old README listed `cli-opencode` twice, so all six cli-X siblings are now named once with the provider each dispatches to. RENAME of the advertised version: the README frontmatter version jumped from 1.1.0.20 to 1.5.0.0 to re-align the README with the changelog top. Dispatch behavior, the 13 agent definitions under `.claude/agents/` and all SKILL.md content were explicitly untouched.

### v1.4.0.0 (`v1.4.0.0.md`)

The model roster stopped being duplicated across `SKILL.md` section 3 and `references/cli-reference.md` section 6. A new catalog leaf `references/providers-and-models.md` was added as the single source for the Anthropic model ids, the `claude-sonnet-4-6` default pin, the `--effort` reasoning-effort lever and the two non-interactive dispatch shapes (the default envelope and the spec-gate-neutralized child envelope). It was registered as a routable reference leaf, and its section 2 is structured under an `### Anthropic` heading with a model table so a second provider could slot in later. MOVED PATH: the exhaustive model prose left `references/cli-reference.md` section 6, which keeps a compact `### Available Models` table plus a bold pointer to the new catalog, and `SKILL.md` Model Selection shrank to a two-sentence residue plus the same pointer. No model id, default or dispatch behavior changed, and `README.md` was version-bumped to match.

### v1.3.0.0 (`v1.3.0.0.md`)

`SKILL.md` was condensed by relocating reference-table duplication into pointers at `references/cli-reference.md`, which is loaded on every invocation anyway. MOVED PATH: the flag glossary, the unique-capabilities table, the essential-command examples and the troubleshooting table were removed from `SKILL.md` and now live solely in `references/cli-reference.md`. What stayed in `SKILL.md` is a compact Model Selection roster, a compact Agent Delegation table (its per-row invocation-pattern column dropped in favor of a pointer to `agent-delegation.md`) and a new Dispatch-Critical Gotchas subsection covering the print-mode default, `--permission-mode plan` versus `bypassPermissions`, the absence of a `--search` flag and the `$CLAUDECODE` nesting check. All 13 ALWAYS rules, 4 NEVER rules, 4 ESCALATE conditions, the Memory Handback protocol, the router dictionaries, the self-invocation guard and the OAuth pre-flight were preserved verbatim.

### v1.2.0.0 (`v1.2.0.0.md`)

BREAKING: the `ANTHROPIC_API_KEY` authentication path was removed from the dispatch flow, the auth pre-flight, the reference tables and the troubleshooting guidance. Authentication is now Claude subscription OAuth only, through `claude auth login` for the interactive browser flow or `claude setup-token` for a non-interactive CI/CD OAuth token. REMOVED: the two-variable `ANTHROPIC_KEY_OK` and `CLAUDE_OAUTH_OK` decision tree collapsed into a single `claude auth status` check, and when the check fails the skill asks the user to run `claude auth login` and refuses to dispatch. Sections 3, 11 and 12 of `references/cli-reference.md` dropped the API-key method, the env var and the Anthropic Console key-management link. Separately, the current-generation ids `claude-opus-4-8`, `claude-sonnet-5` and `claude-fable-5` were added to the CLI reference alongside `claude-opus-4-6`, `claude-sonnet-4-6` and `claude-haiku-4-5-20251001`. The default pin `claude-sonnet-4-6`, routing, permission modes and every dispatch rule were untouched. The upgrade note tells anyone who relied on the env var to run `claude auth login` once.

### v1.1.13.0 (`v1.1.13.0.md`)

REMOVED: the extra leading `---` divider before section 1 of `assets/prompt-templates.md`, which the sk-doc asset template omits because asset docs go title, intro, then section 1. Only that divider and one blank line were removed, and no content changed. This brings the file in line with `prompt-quality-card.md` and the other cli asset cards. No dispatch behavior changed.

### v1.1.12.0 (`v1.1.12.0.md`)

Missing sk-doc section dividers were added to the reference and asset docs. `references/cli-reference.md`, `references/integration-patterns.md`, `assets/prompt-quality-card.md` and `assets/prompt-templates.md` all ran numbered H2 sections together without the standalone `---` thematic break the sk-doc reference and asset templates require. Blank-padded dividers were inserted before every non-first H2, and the entry claims a content-skeleton diff that is byte-identical on every non-blank, non-divider line. No dispatch behavior changed.

### v1.1.11.0 (`v1.1.11.0.md`)

MOVED PATH: the canonical CLI prompt quality card left `sk-prompt` for the `sk-prompt-models` hub, so this skill's references were repointed to the new hub location. The stated reason is that the links keep resolving while `sk-prompt` stays a forkable generic engine. `SKILL.md` and `assets/prompt-quality-card.md` both had their canonical-card pointer rewritten, and `SKILL.md` took the version bump. The entry calls this a mechanical reference repoint with no change to dispatch behavior.

### v1.1.10.0 (`v1.1.10.0.md`)

`assets/prompt-quality-card.md` was restructured to the sk-doc asset template so it matches the other CLI skills. A `## 1. OVERVIEW` section with Purpose and Usage was added at the top, the remaining sections were recased and renumbered to ALL-CAPS (Shared Layer, Model Overrides, Delegation and Precedence, Failure Patterns) and `## N. RELATED RESOURCES` was moved last. The framework and CLEAR tables stayed delegated to the canonical card rather than inlined, and the canonical-card pointer was left as it was. The card-sync guard was verified green. No dispatch behavior changed.

### v1.1.9.0 (`v1.1.9.0.md`, released 2026-06-03)

The Tier-3 deep-path escalation bullet in `SKILL.md` re-enumerated its own escalation triggers, and that copy had already drifted from the canonical card by dropping "policy" and "or audience". REMOVED: the inlined enumeration. The bullet is now only a pointer to the "Tier 3 Deep path" section of the canonical `cli-prompt-quality-card.md`, so it cannot drift again. Verified by CHECK 2 (pointer-only) of `check-prompt-quality-card-sync.sh`. The entry credits the finding to a deep research run under spec packet 130.

### v1.1.8.0 (`v1.1.8.0.md`, released 2026-06-02)

REMOVED: the duplicated sk-prompt framework table and CLEAR scoring rubric from `assets/prompt-quality-card.md`, which shrank from 90 to 44 lines. What remains is a lean Claude-specific supplement of model defaults and permission-mode notes plus a pointer to the canonical sk-prompt card. `SKILL.md` gained a prose block stating a 3-tier precedence rule (sk-prompt canonical card, then the cli-claude-code supplement, then any in-prompt override) and a cross-link to the sk-prompt hub.

---

## 2. FACTS THE V4 DRAFT GETS WRONG OR MISSES

- MISSING, and it is the one breaking change in this set. `v1.2.0.0.md` removes `ANTHROPIC_API_KEY` as an auth path for `cli-claude-code` and makes Claude subscription OAuth the only route, via `claude auth login` or `claude setup-token`. The draft never mentions it. The Orchestrating Other AIs section (draft lines 197 to 227) talks only about hub consolidation, binary gating and retired bridges, and the upgrade list at draft line 445 does not tell a reader whose machine relied on the env var to run `claude auth login` once. That is exactly the kind of item the upgrade list exists for.

- MISSING. `v1.4.0.0.md` adds `references/providers-and-models.md` as a routable single-source catalog for the Anthropic model ids, the `claude-sonnet-4-6` default pin, the `--effort` lever and the dispatch envelopes. `v1.2.0.0.md` separately adds the current-generation `claude-opus-4-8`, `claude-sonnet-5` and `claude-fable-5` ids to the reference. The draft names no Claude model id anywhere and says nothing about a per-mode model catalog, so a reader learns nothing about which model a Claude Code dispatch actually uses by default.

- STALE POINTER TRAIL versus draft line 367. `v1.1.11.0.md` is the last entry in this set to touch the canonical prompt-quality card path, and it repoints `SKILL.md` and `assets/prompt-quality-card.md` at the `sk-prompt-models` hub. Draft lines 367 and 445 state that `sk-prompt-models` no longer exists and was folded back into `sk-prompt` before release. No changelog entry after `v1.1.11.0.md` records the repoint back, so the changelog trail alone would leave a reader pointing at a removed skill. The current files do resolve to `../../sk-prompt/assets/cli-prompt-quality-card.md`, so the draft is right about the end state and the changelog is what is incomplete.

- TIER COUNT DRIFT versus draft line 361. `v1.1.8.0.md` records a 3-tier precedence rule and `v1.1.9.0.md` speaks of a "Tier 3 deep path", while the live `SKILL.md` rule 8 now describes a 2-tier rule with the deep path at Tier 2. The draft describes the outcome only as "the one prompt-quality contract" and never states a tier count, so it is not wrong, but nothing in these ten entries documents the 3-tier to 2-tier collapse.

- CORRECT, for the record. Draft line 361's claim that the six CLI executors each carry a lean card replacing "around 90 lines of duplicated quality cards" matches `v1.1.8.0.md` exactly, which thins the card from 90 to 44 lines. Draft line 201's claim that `cli-claude-code` is no longer an independently routable top-level identity matches the mode entry in the hub's `mode-registry.json`.

---

## 3. CURRENT VERSION AND IDENTITY

- `SKILL.md` frontmatter version: **1.4.0.0**.
- `README.md` frontmatter version: **1.5.0.0**, and the newest changelog entry is `v1.5.0.0.md`. The gap is expected rather than a defect, because `v1.5.0.0.md` states it changed the README only and moved no `SKILL.md` content, so `SKILL.md` never took the bump. Anything reading the mode's version off `SKILL.md` will report 1.4.0.0.
- Identity: **a mode**, not a hub and not standalone. There is no `mode-registry.json`, `hub-router.json`, `description.json` or `graph-metadata.json` at `cli-claude-code/`, whose root holds only `README.md`, `SKILL.md`, `assets/`, `benchmark/`, `changelog/`, `manual-testing-playbook/` and `references/`. The parent `cli-external-orchestration/` holds the hub metadata set, and its `mode-registry.json` registers `cli-claude-code` with `"workflowMode": "cli-claude-code"` and `"packetKind"` classified as a workflow axis packet. Hub registry version is 1.2.0.2.
