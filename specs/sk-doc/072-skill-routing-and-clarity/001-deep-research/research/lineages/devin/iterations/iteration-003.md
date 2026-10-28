# Iteration 3: standalone skills cli-orca, sk-git, sk-prompt, sk-vision

## Focus

Whether the standalone model proven by `mcp-code-mode` generalises across the other four standalone skills this lineage owns, and what their routers actually do when the skill has one mode and no hub.

## Actions Taken

- Read the Class S/H contract in `sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` §2-§3.
- Read the full §2 routing block of `cli-orca`, `sk-git`, `sk-prompt` and `sk-vision`.
- Compared the four routers' scoring logic line by line rather than by their shared prose.
- Counted advisor vocabulary in each `graph-metadata.json` and confirmed the absence of `description.json` in all four roots.

## Findings

1. All four roots are Class S by the fleet contract, not by convention: a Class S root declares neither `mode-registry.json` nor `hub-router.json`, and `description.json`, `mode-registry.json`, `hub-router.json` and `command-metadata.json` are **forbidden** for S while `leaf-manifest.config.json` is required and `leaf-manifest.json` plus `leaf-aliases.json` are generated. The contract names exactly these roots: "**S** (7) | `cli-orca`, `mcp-code-mode`, `sk-git`, `sk-prompt`, `sk-vision`, `system-skill-advisor`, `system-spec-kit`". `sk-vision/SKILL.md:66` restates it: "No `mode-registry.json`, no `hub-router.json`, no `description.json`." [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:41] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:54] [SOURCE: .skilled/skills/sk-vision/SKILL.md:66]

2. `sk-vision`'s router cannot route. It declares one intent (`VISION`, line 84), maps that intent to two directory prefixes (`feature-catalog/`, `manual-testing-playbook/`, line 97-99), and `route_resources` loads every markdown file under both prefixes whenever the inventory is non-empty (lines 130-142). `UNKNOWN_FALLBACK` returns only when the corpus is empty, never for an unrecognised request. The `INTENT_SIGNALS` keywords are therefore decorative: any invocation loads the whole corpus. [SOURCE: .skilled/skills/sk-vision/SKILL.md:84] [SOURCE: .skilled/skills/sk-vision/SKILL.md:97] [SOURCE: .skilled/skills/sk-vision/SKILL.md:130]

3. `cli-orca` declares weights its router never reads and carries a unique ownership map. Every intent declares `"weight"` (lines 102-110), but lane selection at line 177 is `max(INTENT_SIGNALS, key=lambda name: sum(signal in signals for signal in INTENT_SIGNALS[name]["keywords"]))` — a count of matched phrases, not a weighted score. The same router also holds `FOREIGN_OWNERS` (lines 113-120), which defers generic-git, Chrome-DevTools, agentic-browser and other out-of-scope phrases to named sibling skills; no other router in this lineage has an ownership table. [SOURCE: .skilled/skills/cli-orca/SKILL.md:102] [SOURCE: .skilled/skills/cli-orca/SKILL.md:113] [SOURCE: .skilled/skills/cli-orca/SKILL.md:177]

4. `sk-git` implements a third scoring shape. It adds `NOISY_SYNONYMS` (lines 67-71) as a second weighted table and a boundary-aware `keyword_present()` matcher (lines 115-117) whose docstring explains why: "bare substrings misroute ('pr' in 'improve prompt')". The three standalone routers therefore implement three different versions of the same "weighted intent scoring" claim — prefix load in `sk-vision`, match count in `cli-orca`, weighted plus synonyms plus word boundaries in `sk-git` — and only `sk-git` fixes the substring bug. [SOURCE: .skilled/skills/sk-git/SKILL.md:67] [SOURCE: .skilled/skills/sk-git/SKILL.md:115]

5. `sk-prompt` forbids the duplication it then performs. A comment at lines 56-57 says "Keep one authoritative Smart Router Pseudocode block in this section. Detection context may appear before pseudocode. Do NOT duplicate routing logic in separate lookup tables." The same section then lists the leaf files three times: the `Resource Domains` text list (lines 83-89), the `Resource Loading Levels` table (lines 93-98) and `RESOURCE_MAP` (lines 143-152), with `COMMAND_INTENTS` (lines 118-126) as a fourth mode-selection table read before `INTENT_MODEL`. [SOURCE: .skilled/skills/sk-prompt/SKILL.md:56] [SOURCE: .skilled/skills/sk-prompt/SKILL.md:83] [SOURCE: .skilled/skills/sk-prompt/SKILL.md:143]

6. Standalone routing bounds the duplication at two files. Because `description.json` is forbidden for Class S, the advisor vocabulary lives only in `graph-metadata.json` and the SKILL.md block: `intent_signals` counts are 13 (`cli-orca`), 35 (`sk-git`), 10 (`sk-prompt`) and 8 (`sk-vision`), with `derived.trigger_phrases` at 12, 49, 20 and 8. That is one duplicate pair, not the hub's five-way restatement — the structural difference the verdict should preserve. [SOURCE: .skilled/skills/cli-orca/graph-metadata.json:1] [SOURCE: .skilled/skills/sk-git/graph-metadata.json:1] [SOURCE: .skilled/skills/sk-prompt/graph-metadata.json:1] [SOURCE: .skilled/skills/sk-vision/graph-metadata.json:1]

7. Readability: routing is the largest block in every standalone file and it precedes the instructions. `sk-prompt` runs §2 from line 53 to line 267 (215 lines, 41% of 524) before "## 3. HOW IT WORKS" at line 268. `sk-git` has 33 lines over 200 characters and a 2,195-character rule at line 307 ("**Provision a worktree before you trust anything it reports** — Every dependency tree here is gitignored, so a fresh worktree has none of them and fails in ways that read as broken code…"). `cli-orca` has 16 such lines, the longest 673 characters at line 226 ("The Orca browser is scoped to an Orca worktree and is not Chrome, Safari or the Orca desktop UI. Work in a snapshot, interact, re-snapshot loop…"). [SOURCE: .skilled/skills/sk-prompt/SKILL.md:268] [SOURCE: .skilled/skills/sk-git/SKILL.md:307] [SOURCE: .skilled/skills/cli-orca/SKILL.md:226]

## Questions Answered

Question 3 is now answered for standalone skills: the Class S contract forbids a hub router and a per-mode router alike, so the only viable shape is the one these roots already use — a short prose section plus a generated leaf manifest. The remaining half of question 3 (hubs and mode packets) needs iteration 5.

## Questions Remaining

- Per skill routing inventory and drift (question 1) still needs `system-skill-advisor` and `system-spec-kit`.
- Enforcement surfaces and what a change breaks (question 2) still needs the command, agent, mirror and generator layer.
- Hub and mode-packet verdicts (question 3), readability synthesis (question 4) and the plan (question 5) remain.

## Ruled Out

- A per-mode `ROUTER.md` for standalone skills. Class S forbids the hub files outright, so the option is not available, not merely inadvisable.
- Treating the four standalone routers as interchangeable. Their scoring implementations differ; only `sk-git` handles word boundaries.

## Dead Ends

- Looking for `description.json` in the standalone roots: the contract forbids it, and none exists.

## Edge Cases

- Ambiguous input: "readability findings per skill" is answered with measured line counts plus one quoted passage per skill; a full prose review of 524-line files is a later pass.
- Contradictory evidence: `sk-prompt`'s comment forbids duplicated lookup tables that the same section contains. Recorded as drift.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- `.skilled/skills/cli-orca/SKILL.md`, `graph-metadata.json`
- `.skilled/skills/sk-git/SKILL.md`, `graph-metadata.json`
- `.skilled/skills/sk-prompt/SKILL.md`, `graph-metadata.json`
- `.skilled/skills/sk-vision/SKILL.md`, `graph-metadata.json`, `leaf-manifest.json`

## Assessment

- New information ratio: 0.8
- Questions addressed: 1, 3 (standalone half), 4 (partially)
- Questions answered: question 3 for standalone skills

## Reflection

- What worked and why: reading the Class S contract first turned "these skills look similar" into a rule with a fleet list, which is what a verdict can stand on.
- What did not work and why: the first pass assumed every standalone had a `description.json` and the Node check failed; the contract explains why the absence is correct.
- What I would do differently: read the class contract at iteration 1, not iteration 3; it would have framed both hubs and standalone skills.

## Recommended Next Focus

Iteration 4: `system-skill-advisor` and `system-spec-kit` (including the shared smart-router reference), then the command docs, agent docs, runtime mirrors and the scripts that generate them.
