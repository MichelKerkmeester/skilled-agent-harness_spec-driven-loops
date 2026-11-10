# Iteration 4: system-skill-advisor, system-spec-kit, command and agent docs, runtime mirrors and generators

## Focus

The stage-one authority and the teaching surfaces: which file the advisor actually reads, which check couples stage-one vocabulary to stage-two `ROUTER.md`, what `system-spec-kit` contributes as a Class S root, how the command and agent docs restate routing, and which mirror generators copy routing text.

## Actions Taken

- Read `system-skill-advisor/SKILL.md` §2 including the full router block, and `system-spec-kit/SKILL.md` §2 plus its `CLI_TRANSPORT` map.
- Verified `leaf-manifest.json` membership for both roots and for `references/cli/shared-smart-router.md`.
- Read the `doctor:skill-advisor router-reach` workflow, its invariant and its upstream asset list.
- Read the six runtime `SYNC.md` manifests and counted canonical `SKILL.md` files against `.hermes/skills` copies.
- Counted the repeated advisor-precedence paragraph across `.skilled/agents/*.md` and read the routing instruction in `code.md`.

## Findings

1. Stage one reads exactly one file per skill: `graph-metadata.json`. `system-skill-advisor/SKILL.md:340` states it plainly — "The daemon routes from each skill's `graph-metadata.json`, using `intent_signals` and `derived.trigger_phrases` … The `trigger_phrases` and `intent_signals` fields in a skill's `SKILL.md` frontmatter are not read by any runtime routing reader." The `trigger_phrases` blocks in `ROUTER.md` and reference frontmatter (for example `mcp-tooling/ROUTER.md:4-8`) are documentation metadata, not routing inputs, so the five-list restatement is not five live sources — it is one live source and four copies the runtime ignores. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:340] [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:4]

2. `router-reach` is the check that couples the two live stages and the one that makes ROUTER.md vocabulary load-bearing. Its invariant says "the advisor scores a hub's graph-metadata.json intent_signals to choose a hub; that hub's ROUTER.md then chooses a mode inside it", and it fails `WRONG-HUB` or `OUTRANKED` when a multi-word ROUTER.md phrase does not reach its declaring hub. Its `stage_one_vocabulary` is `.skilled/skills/*/graph-metadata.json`, its `stage_two_vocabulary` is `.skilled/skills/*/ROUTER.md`, and its hub predicate requires both `ROUTER.md` and `mode-registry.json`. Deleting a ROUTER.md keyword that the graph never carried is invisible; deleting one the graph does carry, or removing ROUTER.md, fails the diagnostic. [SOURCE: .skilled/commands/doctor/assets/doctor-router-reach.yaml:23] [SOURCE: .skilled/commands/doctor/assets/doctor-router-reach.yaml:61] [SOURCE: .skilled/commands/doctor/assets/doctor-router-reach.yaml:81]

3. `system-skill-advisor`'s own router has a discovery root that cannot see six of its intents. `RESOURCE_BASES` lists `feature_catalog` and `manual_testing_playbook` (underscores, lines 107-108) while the directories are `feature-catalog` and `manual-testing-playbook`, and it omits `hooks/` entirely. Six intents map to paths under those roots: `RECOMMEND`, `STATUS`, `REBUILD`, `VALIDATE_TOOL`, `CLI` (lines 185-189) and `HOOK` (`hooks/skill-advisor-hook.md`, line 183). `discover_markdown_resources` walks only `RESOURCE_BASES` (lines 199-204), so those six leaves are never in inventory and `load_if_available` silently skips them. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:107] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:183] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:199]

4. The `HOOK` intent also violates the skill's own manifest rule, and `typed_leaves` cannot catch it. The comment above `RESOURCE_MAP` says "every value is a concrete markdown leaf that exists in `leaf-manifest.json`" (lines 163-164), but `hooks/skill-advisor-hook.md` is absent from the 121-leaf manifest. `typed_leaves` says "a path that is not a real manifest leaf is dropped, never emitted as an invented pair" (lines 233-235), yet its body only dedupes and skips package indexes (lines 236-243) — it never reads the manifest, so the invented pair is emitted. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:163] [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:231]

5. `system-spec-kit` is Class S but routes a CLI helper doc as one of its own leaves. Its `CLI_TRANSPORT` intent includes `references/cli/shared-smart-router.md` (`SKILL.md:268`), and that path is one of the root's 46 manifest leaves. The same file is the helper reference the seven CLI packets defer to. A change to the shared helper therefore changes spec-kit's manifest and leaf aliases as well as every CLI mode's router contract — a cross-hub coupling that a standalone-skill verdict must account for. [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:268] [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:95] [SOURCE: .skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:17]

6. The agent docs restate the advisor-precedence rule eleven times. The identical paragraph "Treat hook-injected skill-advisor recommendations as routing hints only. They never override explicit user instructions, active command workflow, scope gates…" appears verbatim in 10 of the 11 `.skilled/agents/*.md` files (`ai-council:32`, `code:28`, `context:30`, `debug:28`, `deep-research:28`, `deep-review:27`, `orchestrate:39`, `prompt-improver:32`, `review:28`, and a wrapped variant in `design:28`). `code.md:66` adds a second routing decision — run `sk-code`'s smart router, else `advisor_recommend`, else escalate `UNKNOWN_ROUTE` — which duplicates the Gate 2 order in prose for one agent only. [SOURCE: .skilled/agents/code.md:28] [SOURCE: .skilled/agents/code.md:66] [SOURCE: .skilled/agents/orchestrate.md:39]

7. Only one runtime mirror copies routing text; the rest symlink or omit it. `.hermes/skills/<name>/SKILL.md` is a generated markdown-only copy of every canonical `SKILL.md` (56 real skills plus 11 `agent-<name>` copies on disk), checked by `sync-skills-hermes.cjs --check`; `.claude/skills` and `.devin/skills` are whole-directory symlinks to `../.skilled/skills`; `.opencode` mirrors the tree with per-entry symlinks; `.codex` and `.cursor` carry no skills mirror at all. A routing edit therefore propagates by symlink to Claude, Devin and OpenCode, requires one Hermes regeneration, and requires `sync-prompts.cjs`/`sync-prompts-hermes.cjs` only for command docs. [SOURCE: .hermes/SYNC.md:24] [SOURCE: .claude/SYNC.md:60] [SOURCE: .devin/SYNC.md:57] [SOURCE: .codex/SYNC.md:28]

8. The Cursor routing rule is the one hand-maintained routing list, and its own manifest says so. `.cursor/SYNC.md:114` records: "`rules/skill-routing.md`'s packet list has no generator and is not derived from the skill registry, so a new skill packet will not appear in it automatically. Only its Gate 1 pointer block is generated." The file itself is 28 lines and lists seven packet pointers (lines 9-16), so it is already narrower than the 14-root fleet. [SOURCE: .cursor/SYNC.md:114] [SOURCE: .cursor/rules/skill-routing.md:9]

## Questions Answered

Question 2 is now substantially answered for the enforcement layer: stage one reads `graph-metadata.json`; `router-reach` couples it to `ROUTER.md`; the leaf manifest and aliases are the leaf authority; Hermes is the only text-copy mirror; Cursor's rule list is ungenerated. What remains for iteration 5 is the change-impact table per proposed option.

## Questions Remaining

- Question 1 still needs the readability synthesis across all assigned skills, though its inventory half is now complete.
- Question 2 needs the explicit "what each option breaks" mapping.
- Question 3 needs the hub and mode-packet verdicts.
- Questions 4 and 5 remain open.

## Ruled Out

- Treating all five phrase lists as live routing sources. Only `graph-metadata.json` feeds stage one; the rest are documentation or dead metadata.
- Treating ROUTER.md as removable on the strength of the CLI hub's duplication alone. `router-reach` reads it and fails without it.
- Treating the Hermes mirror as a text copy of routing prose that can be hand-edited. It is generated and `--check` enforces it.

## Dead Ends

- Counting `.hermes/skills` against `find .skilled/skills -name SKILL.md` without excluding `node_modules`: the three extra hits are Playwright's bundled skills, correctly not mirrored.

## Edge Cases

- Ambiguous input: "command and agent docs that teach routing" was scoped to the advisor-precedence paragraph, the `@code` route instruction, the deep route-proof lines and the doctor router-reach workflow; other command docs were inventoried but not read in full.
- Contradictory evidence: `system-skill-advisor` documents a manifest-membership rule its own `HOOK` intent violates. Recorded, not reconciled.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/SKILL.md`, `leaf-manifest.json`
- `.skilled/skills/system-spec-kit/SKILL.md`, `leaf-manifest.json`, `references/cli/shared-smart-router.md`
- `.skilled/commands/doctor/assets/doctor-router-reach.yaml`, `.skilled/commands/doctor/skill-advisor.md`
- `.skilled/commands/deep/research.md`, `.skilled/commands/deep/review.md`
- `.skilled/agents/*.md` (advisor paragraph count, `code.md:66`, `orchestrate.md` table)
- `.hermes/SYNC.md`, `.claude/SYNC.md`, `.devin/SYNC.md`, `.codex/SYNC.md`, `.cursor/SYNC.md`, `.opencode/README.md`, `.cursor/rules/skill-routing.md`

## Assessment

- New information ratio: 0.9
- Questions addressed: 1, 2, 3 (partially), 4 (partially)
- Questions answered: question 2 substantially

## Reflection

- What worked and why: reading the doctor invariant before the scripts named the exact coupling in the authors' own words, which is stronger evidence than inferring it from filenames.
- What did not work and why: the mirror count needed `node_modules` exclusion; the first count looked like a mirror gap that was not one.
- What I would do differently: read the SYNC manifests before the skill routers when the question is "what breaks" — they name every generator and every drift check in one place.

## Recommended Next Focus

Iteration 5: synthesize the verdicts — per-mode ROUTER.md versus one hub ROUTER.md versus the advisor hybrid versus JSON-only, separately for hubs, mode packets and standalone skills — then the phased plan with order, risk and rollback.
