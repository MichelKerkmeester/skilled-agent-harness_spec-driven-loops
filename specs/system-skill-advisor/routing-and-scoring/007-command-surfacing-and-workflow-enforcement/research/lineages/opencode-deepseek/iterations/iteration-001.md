# Iteration 1: Command inventory drift across three metadata sources

## Focus

Angle 1 (inventory): which of the 45 commands have no active bridge, which bridges point at retired names, and what one drift-proof inventory needs. The selected interpretation of "active bridge" is a generated bridge entry that is enabled for at least one scoring platform, because the generated projection contains entries that neither scorer loads.

## Actions Taken

- Enumerated every markdown command under `.skilled/commands` and separated grouped hub commands from the loose `local-skilled-alignment.md`.
- Read the three `command-metadata.json` files (system-deep-loop, sk-design, sk-doc) and the bridge `allow-list.json`.
- Read the doctor route manifest `.skilled/commands/doctor/_routes.yaml`.
- Parsed `command-bridges.generated.json` and compared its 62 entries against the live command tree, including per-platform `enabled` flags.
- Read the bridge deriver and its README to establish which inputs are authoritative.

## Findings

1. The live command surface is 45 markdown files: 44 grouped commands (13 `/create:*`, 3 `/deep:*`, 3 `/design:*`, 17 `/doctor:*`, 1 `/prompt:*`, 7 `/speckit:*`) plus the loose `local-skilled-alignment.md`. Only 19 of those commands appear in a `command-metadata.json`, because only three skill hubs publish command metadata: `system-deep-loop` (3 commands), `sk-design` (3), and `sk-doc` (13). [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:1] [SOURCE: .skilled/skills/sk-design/command-metadata.json:1] [SOURCE: .skilled/skills/sk-doc/command-metadata.json:1]

2. The generated bridge projection holds 62 entries sourced from 19 command-metadata rows, 8 allow-list rows, and 35 doctor routes, but those 62 entries collapse to 43 distinct command spellings. The doctor command is the only family whose routes fan a single slash command into many bridges. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:18]

3. Four live grouped commands have no generated bridge at all: `/prompt:improve`, `/speckit:handoff`, `/speckit:save`, and `/speckit:search`. The allow-list explains two adjacent gaps: `/speckit:*` commands exist only because `system-spec-kit` "has no command-metadata.json yet", and `/prompt` is bridged under its retired spelling while "JSON declares `/prompt:improve`". [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:52] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:7]

4. Three generated bridges name spellings that are not live grouped commands: `/spec_kit` is explicitly "deprecated ... one-release compatibility", `/memory:save` is retained as a legacy scorer key, and `/prompt` is the legacy name for `/prompt:improve`. A bridge can therefore outlive the command it names, and the projection does not flag that drift. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:35] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:49] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:56]

5. Activation is platform-specific and much narrower than the 62-entry projection: only 40 entries are active for the TypeScript scorer and 50 for the Python scorer. Twenty-two entries are TypeScript-inactive, including every `/deep:*`, every `/design:*`, 11 of 13 `/create:*` commands, and `/speckit:plan`, `/speckit:complete`, `/speckit:implement` and `/speckit:resume`; twelve entries are Python-inactive, including `/deep:ai-council` and the same `/design:*` family. This is the mechanism behind the measured behavior that only doctor commands surface as runnable lines. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:9] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:10]

6. The doctor family is the one fully connected slice: every derived doctor bridge is active in both scorers, and `doctor-phrase-reach.cjs` is the proof tool that each admitted phrase reaches its route. No equivalent reach proof exists for `/create:*`, `/deep:*`, `/design:*`, `/prompt:*` or `/speckit:*`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:64]

7. A drift-proof inventory needs one command-tree-derived registry with completeness as a hard gate: every command markdown must either carry owner metadata or have a written allow-list justification, and any bridge whose command spelling is absent from the tree must fail validation. The current deriver reads three independent inputs and never checks them against the live tree, so missing metadata, retired spellings and disabled entries remain invisible. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:21] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:87]

## Ruled Out

- Counting `command-bridges.generated.json` entries as "commands": the 62 entries are routes and compatibility aliases, not a command list, and three of them name non-live spellings.
- Treating the allow-list as a complete fallback: it covers 8 commands, misses 4 live `/speckit:*`/`/prompt:improve` commands, and adds 3 retired aliases.

## Dead Ends

- Reading the doctor route manifest alone cannot explain non-doctor coverage; the route manifest only governs 17 of 45 commands.

## Edge Cases

- Ambiguous input: "45 commands" could count the loose `local-skilled-alignment.md`; it is not a grouped slash command, so the bridge analysis excludes it from per-hub counts.
- Contradictory evidence: none. The README's claim that doctor bridges are all active agrees with the generated projection.
- Missing dependencies: `system-spec-kit` has no `command-metadata.json`, confirmed by the allow-list reasons; the fallback is to treat the allow-list as its compatibility surface.
- Partial success: none.

## Sources Consulted

- `.skilled/commands` markdown tree (44 grouped files plus `local-skilled-alignment.md`)
- `.skilled/skills/system-deep-loop/command-metadata.json:1`
- `.skilled/skills/sk-design/command-metadata.json:1`
- `.skilled/skills/sk-doc/command-metadata.json:1`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json:3-56`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4-10`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:21-24`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:16-18,64`
- `.skilled/commands/doctor/_routes.yaml:1-60`

## Assessment

- New information ratio: 0.95
- Questions addressed: Which commands have no active bridge, which bridges point at retired names, and what does one drift-proof command inventory need?
- Questions answered: Which commands have no active bridge, which bridges point at retired names, and what does one drift-proof command inventory need?

## Reflection

- What worked and why: comparing the generated projection against the live tree exposed both missing commands and retired aliases in one pass, because the projection carries `enabled` flags that the source files do not.
- What did not work and why: counting bridge entries without deduplicating by command overstates coverage; the doctor family fans one command into many routes.
- What I would do differently: have the deriver emit a coverage assertion so this comparison is a build check rather than a manual observation.

## Recommended Next Focus

Angle 2 (scoring): why plain planning and research prompts return zero recommendations, how command bridges compete with skills in fusion, and what the no-slash penalty and mutating-command gate cost in recall versus precision.
