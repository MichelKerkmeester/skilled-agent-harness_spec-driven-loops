# Iteration 2: mcp-tooling hub and mcp-code-mode

## Focus

The second hub family and the shared MCP execution substrate: whether `mcp-tooling` repeats the CLI-hub pattern, whether its nine packets agree with the hub router, and what `mcp-code-mode` shows about routing a standalone single-mode skill.

## Actions Taken

- Read `mcp-tooling/SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `graph-metadata.json`, `description.json`, `leaf-manifest.json`.
- Read the routing section of all nine `mcp-tooling/mcp-*/SKILL.md` packets and the full routing block of `mcp-obsidian`.
- Read `mcp-code-mode/SKILL.md`, `leaf-manifest.config.json`, and the leaf-manifest generator references.
- Ran the same read-only alias/route comparison used in iteration 1 against the mcp-tooling registry, hub-router classes and `ROUTER.md` signals.

## Findings

1. Stage one can route to `mcp-obsidian` on signals stage two has no leaf set for. `mode-registry.json` gives `mcp-obsidian` 26 aliases (line 265), including the health, Iconic rulebook, Excalidraw and Minimal-theme families; `hub-router.json` wires those families into the `mcp-obsidian` signal through four classes (line 56). `ROUTER.md`'s `OBSIDIAN` intent has 13 keywords (line 97), none of which is health, iconic, excalidraw or theme. A request that scores on those classes selects the mode, then matches no stage-two intent and defers. [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:265] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:56] [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:97]

2. The mcp hub repeats the same four-list vocabulary pattern and the same drift, measured the same way: registry aliases (6/6/26/7/14/7/6/6/6 at lines 52, 86, 120, 158, 195, 231, 265, 319, 363), `hub-router.json` vocabulary classes (23 classes from line 23), `ROUTER.md` `INTENT_SIGNALS` (11/11/13/11/14/11/8/9/6 keywords from line 94), and each packet's `<!-- Keywords: -->` comment. Comparing registry aliases with `ROUTER.md` found 6 `mcp-chrome-devtools` registry phrases absent from the router, 5 `mcp-click-up`, 6 `mcp-obsidian`, 4 `mcp-aside-devtools`, 1 `mcp-notion`, 4 `mcp-figma`, 2 `mcp-refero` and 4 `mcp-mobbin`; only `mcp-magicpath` matched exactly. [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:52] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:23] [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:94]

3. Unlike the CLI hub, the mcp packets state the same fallback contract the hub router states. Every packet declares `DEFAULT_RESOURCE` plus `DEFAULT_RESOURCE_SEMANTICS = "fallback-only"` (for example `mcp-obsidian/SKILL.md:152-156`, `mcp-figma/SKILL.md:122-124`), and the hub router declares `DEFAULT_RESOURCE = []` with "No always-loaded preamble" (`ROUTER.md:90-92`). The wording is restated ten times, but the semantics agree: the default is a defer-time suggestion, never unioned into a scored route. [SOURCE: .skilled/skills/mcp-tooling/mcp-obsidian/SKILL.md:152] [SOURCE: .skilled/skills/mcp-tooling/mcp-figma/SKILL.md:122] [SOURCE: .skilled/skills/mcp-tooling/ROUTER.md:90]

4. `mcp-code-mode` is the working model for a standalone skill: no `mode-registry.json`, no hub router, and still a typed leaf projection. Its SKILL.md says so directly — "mcp-code-mode is a normal, standalone single-mode skill whose sole workflow mode is `mcp-code-mode` (there is no `mode-registry.json`)" — and it ships `leaf-manifest.json`, `leaf-manifest.config.json` and `leaf-aliases.json`, regenerated with `generate-leaf-manifest.cjs --write`. The generator lives at `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`. [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:62] [SOURCE: .skilled/skills/mcp-code-mode/leaf-manifest.config.json:7]

5. `mcp-code-mode`'s router declares a default that cannot act as one. `DEFAULT_RESOURCE = "references/workflows.md"` (line 74) is also the only `LOADING_LEVELS["ALWAYS"]` entry (line 103), and the fallback `if not loaded: load_if_available(DEFAULT_RESOURCE)` (lines 195-196) therefore runs only when the ALWAYS file is missing. The "default" is an always-load, so the fallback branch is dead in normal operation. [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:74] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:103] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:195]

6. The same regeneration instruction is actionable in one skill and unactionable in the other. `mcp-code-mode` names the exact command and the byte-stability check (`SKILL.md:62`); `mcp-tooling` says only "Regenerate `leaf-manifest.json` through the canonical metadata command" (`SKILL.md:126`) without naming the command, the script or the check. An operator reading the hub cannot perform the instruction from the text. [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:126] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:62]

7. Readability splits sharply between the two skills. `mcp-tooling/SKILL.md` is the cleanest hub read so far: 152 lines, 8 lines over 200 characters, and a 17-line §2 (lines 48-64) that states the two stages before any table. `mcp-code-mode/SKILL.md` puts 155 lines of §2 before its first instruction, 134 of them a Python block, and line 62 is a 972-character paragraph: "**Typed leaf projection (fleet routing standard).** mcp-code-mode is a normal, standalone single-mode skill whose sole workflow mode is `mcp-code-mode` (there is no `mode-registry.json`). Every routable leaf under `references/`, `assets/`, and the manual-testing playbook is enumerated in `leaf-manifest.json`, generated from `leaf-manifest.config.json` (regenerate with `generate-leaf-manifest.cjs --write .skilled/skills/mcp-code-mode`; it must stay byte-stable under `--check`)." [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:48] [SOURCE: .skilled/skills/mcp-code-mode/SKILL.md:62]

## Questions Answered

None fully answered. Findings 1-3 advance question 1, findings 3-4 and 6 advance question 2, finding 4 supplies the standalone-skill evidence for question 3, and finding 7 supplies question 4 evidence.

## Questions Remaining

All five strategy questions remain open; the standalone verdict needs iterations 3 and 4, and the plan needs the whole evidence set.

## Ruled Out

- Treating the mcp hub as a copy of the CLI hub. Its stage-two contract is consistent with its packets, so the CLI drift is a packet-level defect, not a universal hub defect.
- Treating `DEFAULT_RESOURCE = []` and `DEFAULT_RESOURCE = "references/x.md"` as a contradiction. Both declare fallback-only semantics; the difference is representation.

## Dead Ends

- Searching the mcp packets for a per-mode `ROUTER.md`: none exists. Every packet routes from its own SKILL.md block.

## Edge Cases

- Ambiguous input: "every mode packet" was read at routing-section depth for eight packets and full depth for `mcp-obsidian`; the health/iconic gap is proven for `mcp-obsidian` and not generalised to the others.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/mcp-tooling/SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `graph-metadata.json`, `leaf-manifest.json`
- `.skilled/skills/mcp-tooling/mcp-{chrome-devtools,click-up,obsidian,aside-devtools,notion,figma,refero,mobbin,magicpath}/SKILL.md`
- `.skilled/skills/mcp-code-mode/SKILL.md`, `leaf-manifest.config.json`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` (path existence)

## Assessment

- New information ratio: 0.85
- Questions addressed: 1, 2, 3 (partially), 4 (partially)
- Questions answered: none fully

## Reflection

- What worked and why: reusing the iteration-1 comparison script made the mcp drift measurable in one call and kept the method identical across hubs.
- What did not work and why: reading all nine packets in full would have exceeded the useful budget; the routing-section grep located the blocks without losing the evidence.
- What I would do differently: read `leaf-manifest.config.json` before the SKILL.md paragraph; it states the contract in a third of the words.

## Recommended Next Focus

Iteration 3: the four standalone skills in this lineage that are not MCP substrates — `cli-orca`, `sk-git`, `sk-prompt`, `sk-vision` — to test whether the standalone model in finding 4 generalises.
