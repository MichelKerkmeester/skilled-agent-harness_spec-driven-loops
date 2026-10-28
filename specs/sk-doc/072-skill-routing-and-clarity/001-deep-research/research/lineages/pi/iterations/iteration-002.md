# Iteration 2 — sk-doc: the hub that centralizes stage two

## Focus

Map sk-doc's routing mechanisms — hub `SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `leaf-aliases.json` and the 14 mode packets — and test the hub's own authority claim that each packet's `Keyword triggers:` line is the source of truth for a synchronized JSON projection.

## Actions Taken

1. Inventoried sk-doc: `SKILL.md` 187 lines, `ROUTER.md` 407, `hub-router.json` 477, `mode-registry.json` 605; 14 mode packets, 183 to 562 lines each.
2. Read `SKILL.md` §2 (lines 51-80), `ROUTER.md` §1-§4 head, and the §3 machine block's open.
3. Parsed `hub-router.json` and `mode-registry.json`: 15 router signals, 17 vocabulary classes, 15 modes, 152 aliases.
4. Compared each packet's `Keyword triggers:` terms against the union of `hub-router.json` `vocabularyClasses` keywords.
5. Checked which packets carry a `RESOURCE_MAP` machine block at all.
6. Searched every `.cjs/.js/.ts/.py/.mjs` file under `.skilled` and `.pi` for a reader of the `Keyword triggers:` line.

## Findings

1. **Two hubs assign opposite authorities to the same stage-one vocabulary.** sk-doc says "each nested packet's single `Keyword triggers:` line is the source of truth for its routing vocabulary; `mode-registry.json` and `hub-router.json` are synchronized projections" (`sk-doc/SKILL.md:53`); sk-code says "`mode-registry.json` is the single source of truth" (`sk-code/SKILL.md:54`). Whichever wins, one hub's model is wrong today. [SOURCE: .skilled/skills/sk-doc/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/SKILL.md:54]

2. **Nothing parses the declared source of truth.** A search of every `.cjs/.js/.ts/.py/.mjs` under `.skilled` and `.pi` for `Keyword triggers` returns zero code hits. The machine reader, `router-replay-lib.cjs`, resolves a hub's modes from `hub-router.json` and its leaves from `ROUTER.md`; the `Keyword triggers:` line is prose only. So sk-doc's "source of truth" is a convention enforced by review, not by a check. [SOURCE: .skilled/skills/sk-doc/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:1]

3. **The "synchronized projection" claim is false today.** Comparing the 173 backticked terms across the 14 packets' `Keyword triggers:` lines with the union of `hub-router.json` vocabulary keywords finds 17 terms absent from the projection. `sk-create-diff` is the worst: 5 of its 7 triggers — `document before/after review`, `before/after document diff`, `review document edits`, `docx diff`, `pdf diff` — exist nowhere in `hub-router.json`. Every `/create:*` and `/doc:quality` slash form is also absent (for example `/create:readme`, `/create:skill-parent`). [SOURCE: .skilled/skills/sk-doc/sk-create-diff/SKILL.md:30] [SOURCE: .skilled/skills/sk-doc/hub-router.json:1]

4. **Stage two is hub-owned in sk-doc and packet-owned in sk-code, on the same decision.** Only 5 of 14 sk-doc packets carry a `RESOURCE_MAP` machine block (`sk-create-benchmark:115`, `sk-create-frontmatter:80`, `sk-create-repo-rule:89`, `sk-create-skill:106`, `sk-create-with-human-voice:89`); the other 9 have no router block and depend entirely on `ROUTER.md` §3, which names every packet's leaves packet-qualified. sk-code does the reverse: all four packets carry blocks and the hub block duplicates them. Both shapes pass the same checks today, which matters for the verdict — one hub already demonstrates that per-mode blocks are optional. [SOURCE: .skilled/skills/sk-doc/ROUTER.md:145] [SOURCE: .skilled/skills/sk-doc/sk-create-readme/SKILL.md:42]

5. **sk-doc forbids the hub-level move the report proposes to test, by name and mechanism.** `SKILL.md:65` states the machine block "must not move into `SKILL.md` (the replay would treat it as the hub's own router and lose the mode projection) or into `hub-router.json` (schema handoff-ambiguity rule)". That is a hub-level constraint, not a packet-level one: no document forbids moving a packet's own block inside its own `SKILL.md`, which is where the block already lives. The report's plan is safe at packet level and blocked at hub level, and the two cases were conflated. [SOURCE: .skilled/skills/sk-doc/SKILL.md:65]

6. **The JSON cost grows with the mode count, and so does the drift surface.** sk-doc spends 605 lines of `mode-registry.json` and 477 of `hub-router.json` for 15 modes and 152 aliases — 40 registry lines per mode; sk-code spends 130 and 83 for 4 modes and 83 aliases — 33 lines per mode. The per-mode cost is roughly constant, so the alias drift in finding 3 is a function of mode count, not of the hub. A shape that keeps one JSON per hub must budget for that growth or generate it. [SOURCE: .skilled/skills/sk-doc/mode-registry.json:1] [SOURCE: .skilled/skills/sk-doc/hub-router.json:1]

7. **Readability: the routing definition is a 107-word run-on, and the trigger lines are ungrouped term dumps.** `sk-doc/SKILL.md:53` reads verbatim: "Routing is **registry-driven at runtime and packet-authored at source** in two stages. Stage 1 (hub → mode): each nested packet's single `Keyword triggers:` line is the source of truth for its routing vocabulary; `mode-registry.json` and `hub-router.json` are synchronized projections that the hub reads without re-deriving mappings during a request. The advisor routes any documentation/authoring query to the single identity `sk-doc`; the hub then picks the packet. Stage 2 (mode → leaves): the root `ROUTER.md` maps the request's authoring intent to the exact packet-local leaf resources that mode loads. The two layers stay separate: the hub never emits leaf paths, and the surface router never re-decides the mode." The frontmatter packet's trigger line (`sk-create-frontmatter/SKILL.md:36`) is 28 terms with no grouping, mixing field names, error symptoms and version formats. [SOURCE: .skilled/skills/sk-doc/SKILL.md:53] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/SKILL.md:36]

8. **Hub shape already diverges inside the same skill family.** sk-doc carries `leaf-aliases.json` (5 alias entries) and `leaf-scopes.json` in addition to `leaf-manifest.json`; sk-code carries only `leaf-manifest.json`. `leaf-aliases.json` is read by `router-replay-lib.cjs` and `parent-skill-check.cjs`, so the extra file changes which paths a guard can resolve — the hubs are not interchangeable inputs to the same checks. [SOURCE: .skilled/skills/sk-doc/leaf-aliases.json:1] [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:1]

## Questions Answered

- Q2: sk-doc contributes a fourth drift class — packet trigger lines versus the `hub-router.json` projection, 17 of 173 terms missing.
- Q1 (sk-doc share): its five mechanisms are now mapped.

## Questions Remaining

- Q1/Q2 for sk-design and system-deep-loop.
- Q3 (enforcement and breakage), Q4 (verdict), Q5 (per-skill readability), Q6 (plan).

## Next Focus

Iteration 3: sk-design and system-deep-loop — the two remaining hubs. Check whether sk-design follows the sk-code shape or the sk-doc shape, and whether system-deep-loop's `ROUTER.md` matches its stale compiled manifest (the report flagged `system-deep-loop` as stale).

## SCOPE VIOLATIONS

None. All writes landed under `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research/lineages/pi/`.
