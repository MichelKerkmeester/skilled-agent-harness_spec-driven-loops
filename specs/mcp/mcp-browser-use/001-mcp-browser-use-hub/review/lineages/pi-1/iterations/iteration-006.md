# Review Iteration 006

## Dispatcher

- Mode: review (fan-out lineage `pi-1`, generation 1)
- Dimension: maintainability (second pass, per-mode document sets)
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration checked the per-mode document sets the earlier passes only touched where a fix landed, and re-verified the open P1 so the synthesis reads a current state rather than iteration 3's prose.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/ROUTER.md`, `mcp-aside-devtools/ROUTER.md`, `mcp-bladebro/ROUTER.md` (reference tables)
- `.skilled/skills/mcp-browser-use/{mcp-chrome-devtools,mcp-aside-devtools,mcp-bladebro}/benchmark/reports/README.md` plus their run-folder listings
- `.skilled/skills/mcp-browser-use/hub-router.json` (`vocabularyClasses`) against `ROUTER.md`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:75`, `scripts/doctor.sh:36` (P1 re-verification)
- `.skilled/skills/mcp-browser-use` placeholder sweep (`TODO`, `FIXME`, `TBD`, template `FILL` markers)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The open P1 (`pi1-I3-P1-001`) was re-read at both cited lines and is still active: `mcp-aside-devtools/SKILL.md:75` still tells the agent to report the unpinned pipeline when the binary is absent, and `scripts/doctor.sh:36` still prints it as the install line. It is carried unchanged, not downgraded.

### P2 Findings

None new.

## Traceability Checks

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Every reference table checked resolves: the Aside packet's ROUTER references (`aside-cli-reference.md`, `mcp-wiring.md`, `session-management.md`, `troubleshooting.md`) all exist under its `references/`, and the shared `shared-smart-router.md` link resolves to `system-spec-kit/references/cli/shared-smart-router.md`. The status stays `partial` for the carried iteration-3 D2 contradiction, which the re-read confirms is still live. |
| `checklist_evidence` | core | pass | The per-mode benchmark indexes are complete and non-dangling: Chrome 3 links / 3 folders, Aside 7 links / 7 folders, Bladebro 3 links / 3 folders, with no unlisted run folder and no missing target in any of them. |
| `feature_catalog_code` | overlay | pass | The hub `ROUTER.md`'s routing phrases resolve inside `hub-router.json`'s vocabulary: the only phrases the ROUTER lists that the vocabulary does not hold are the four action names (`route`, `clarify`, `defer`, `reject`) plus `packet` and `targets`, which are decision vocabulary rather than detector phrases. |
| `playbook_capability` | overlay | partial | The four vocabulary phrases absent from the hub `ROUTER.md` (`automate the browser`, `browser agent`, `natural language browser`, `web browser`) belong to the `generic-browser-automation` class, which `hub-router.json` marks as discovery-only and deliberately unreferenced, so their absence is intended rather than drift; the scenario-count question from iteration 5 stays open. |

## Integration Evidence

- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/ROUTER.md:60` links `../../system-spec-kit/references/cli/shared-smart-router.md`, and that file exists, so the cross-skill reference is live rather than nominal.
- `.skilled/skills/mcp-browser-use/hub-router.json` `vocabularyClasses.generic-browser-automation.note` states the class is "Deliberately unreferenced by routerSignals, so hub-identity-only prompts defer", which is the reason its phrases do not appear in `ROUTER.md`.
- The three per-mode `benchmark/reports/README.md` indexes and their folders agree one for one, which extends iteration 5's hub-level index result to the mode packets.

## Edge Cases

- **A path test needs the reference's base directory.** A first pass of the ROUTER check reported five "missing" files per mode; all were table cells naming `references/<file>` by bare filename. Testing each against the packet root was the wrong base, and the files resolve under `references/`. The candidate was withdrawn before it reached the registry.
- **`hub-router.json` holds two vocabulary kinds.** `routerSignals` phrases are detector inputs while `generic-browser-automation` is deliberately inert; treating every vocabulary phrase as required in `ROUTER.md` would manufacture four false findings.
- **The P1 re-read is a currency check, not a second opinion.** Both lines are quoted again because a synthesis that reads only iteration 3 cannot tell whether a later edit closed them.

## Confirmed-Clean Surfaces

- No `TODO`, `FIXME`, `TBD` or unfilled template marker exists anywhere in the hub tree outside changelogs and benchmark reports; the only `XXXXXX` hits are `mktemp` templates in two Bladebro examples.
- All three mode ROUTER reference tables resolve against their packets.
- The hub `ROUTER.md` and `hub-router.json` agree on detector vocabulary.
- All three per-mode benchmark indexes are complete.

## Ruled Out

- **Three per-mode ROUTER tables name files that do not exist** -- ruled out: the bare filenames resolve under each packet's `references/` directory.
- **The hub `ROUTER.md` omits four detector phrases** -- ruled out: the class is discovery-only by design and says so in the vocabulary file.
- **Placeholder text shipped in the hub** -- ruled out by the sweep; only shell `mktemp` templates matched.
- **The open P1 was closed by a later edit** -- ruled out: both cited lines still carry the unpinned pipeline.

## Next Focus

- Dimension: traceability (consolidation pass)
- Focus area: replay the core protocols against the accumulated registry and confirm each `partial` this run recorded still has the reason it recorded, so synthesis inherits a checked status rather than a stale one
- Reason: the loop is at its last scheduled consolidation; every dimension has a pass behind it and only the carried statuses need a final read
- Rotation status: all four dimensions covered; this is the consolidation pass
- Blocked/productive carry-forward: productive, status replay against cited lines
- Required evidence: one direct read per protocol this run marked `partial` or `fail`

Review verdict: CONDITIONAL
