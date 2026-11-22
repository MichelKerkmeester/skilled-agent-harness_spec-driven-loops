# Iteration 5: KQ5 — naming decision (keep the `mcp-` prefix)

## Focus

KQ5: do the three modes keep the `mcp-` prefix inside the new hub? The required deliverable is **one naming decision giving the folder, `workflowMode` and `packetSkillName` for Chrome DevTools, Aside and Bladebro** [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:72,121]. The hand-edit list of KQ4 is expressed in current mode ids, so the choice decides whether those literal occurrences are renamed or merely relocated [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-004.md:96]. Exhausted approaches were checked first: none of the BLOCKED directions (broad Bladebro web search, live `bladebro` probes, non-`metadata` routingClass, hand-writing `leaf-manifest.json`, importing `transport-axis`) bears on naming, and none was retried. Research was entirely local and read-only.

Selected interpretation: "keep the `mcp-` prefix" is evaluated against the repository's canonical parent-hub naming rule, not against the informal mode nouns in prose. That resolves the only contradiction found (see Edge Cases).

## Actions Taken

1. Read the four state files (config, state JSONL, strategy, findings registry); derived iteration 5 from four prior `iteration` records plus the existing `iteration_start` for run 5; confirmed `iteration-005.md` and `iter-005.jsonl` do not exist; session id is `2026-11-21T08:29:48.000Z`.
2. Reused prior evidence before broad rereads: KQ3's proposed shape and its explicit deferral of the exact strings [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:64-66]; KQ4's hand-edit/regenerate/history split [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research/iterations/iteration-004.md:37-43].
3. Read `.skilled/skills/mcp-tooling/mode-registry.json` in full for the current `workflowMode` / `packet` / `packetSkillName` / `grandfatheredFolderMismatch` values of Chrome and Aside and for the field semantics in `advisorRoutingContract`.
4. Grepped the parent and child specs for naming constraints; read the parent charter KQ5 bar, 002 REQ-002/003, 003's relocation scope, and 004's "name from 001-research KQ5" row.
5. Grepped `.skilled` for `grandfatheredFolderMismatch` and read the canonical parent-hub creation rule plus the authoritative checker `parent-skill-check.cjs` naming checks (3d-name and frontmatter name), and mcp-tooling's own mode table and folder tree.

## Findings

1. **The canonical parent-hub rule is `folder == packetSkillName == [hub-prefix]-<mode>`, so workflow modes keep the prefix.** The create-skill-parent contract states it verbatim: "registry keys (mode.packet) match packet folder names; canonical workflow folder == packetSkillName == `[hub-prefix]-<mode>`, surface folder == packetSkillName == bare noun; grandfathered mismatches recorded via `grandfatheredFolderMismatch` + `packetSkillName`" [SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:294] [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:261]. `mcp-browser-use` has hub prefix `mcp` (exactly as `mcp-tooling` does), so the canonical folder ids are `mcp-<mode>`. [INFERENCE: applying the `[hub-prefix]-<mode>` template to the new hub name.]

2. **The authoritative checker enforces folder/name equality but not a prefix, and treats a mismatch flag as legacy-only.** `checkModeNaming` soft-fails when `grandfatheredFolderMismatch:false` coexists with `folder != packetSkillName`, soft-fails a `true` flag when the names actually match ("stale flag — set it false; a blanket-true flag would mask a real future mismatch"), and requires the packet `SKILL.md` frontmatter `name:` to equal `packetSkillName` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:588-612]. There is no check requiring or forbidding the `mcp-` prefix, so the canonical rule (finding 1), not the checker, is the decider. This rules out the hybrid "bare folder + prefixed name + flag:true" option.

3. **The current ids already satisfy the canonical rule, so keeping the prefix is the zero-rename option.** In mcp-tooling, Chrome is `workflowMode: "mcp-chrome-devtools"`, `packet: "mcp-chrome-devtools"`, `packetSkillName: "mcp-chrome-devtools"`, `grandfatheredFolderMismatch: false` [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:30,47-49]; Aside is the same pattern [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:97,114-116]. Both appear as `mcp-*` in the hub mode table and folder tree [SOURCE: .skilled/skills/mcp-tooling/SKILL.md:30,33,95,98]. Relocating with the prefix intact changes only the parent path; renaming would invalidate every literal mode id in the KQ4 hand-edit set.

4. **The bare names "bladebro, aside, chrome-devtools" in the parent spec are the `<mode>` nouns, not the full ids.** The charter says the hub has "three modes: bladebro, aside and chrome-devtools" [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:82] and leaves the prefix question open for 001-research [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146]. Under the canonical template those nouns compose as `mcp-` + noun; 003's scope likewise says to move the packets "under the 001-research names" without fixing them [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/spec.md:82], and 004 explicitly defers the Bladebro folder name to KQ5 [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:96]. [INFERENCE: noun-vs-full-id reading, consistent with finding 1.]

5. **Decision — keep the `mcp-` prefix for all three modes.** One table, with folder relative to `.skilled/skills/mcp-browser-use/`:

   | Mode | Folder | `workflowMode` | `packetSkillName` |
   |------|--------|----------------|-------------------|
   | Chrome DevTools | `mcp-chrome-devtools/` | `mcp-chrome-devtools` | `mcp-chrome-devtools` |
   | Aside | `mcp-aside-devtools/` | `mcp-aside-devtools` | `mcp-aside-devtools` |
   | Bladebro | `mcp-bladebro/` | `mcp-bladebro` | `mcp-bladebro` |

   For every row: `packet == packetSkillName`, `grandfatheredFolderMismatch: false`, and the packet `SKILL.md` frontmatter `name:` equals `packetSkillName`. Bladebro is a greenfield packet, so `mcp-bladebro` is a new canonical id following the same template; 004 must author its `SKILL.md` with that exact name. [INFERENCE: findings 1–4 applied to the three modes.]

6. **Blast-radius consequence: relocation, not renaming.** With ids unchanged, the KQ4 hand-edit list keeps its literal mode ids and only path prefixes move (`mcp-tooling/` → `mcp-browser-use/`) [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-004.md:37-43]. The path-bearing exceptions already identified still need re-pointing: the test-enforced byte-identical `_utils.sh` relationship, the doctor mutation-class guard's `skill_dir` values, and the manual-testing allowlist paths [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:73]. Advisor golden fixtures that assert `mcp-chrome-devtools` as a route label remain textually valid, but 005 must verify the label still resolves under hub-membership (`metadata`) routing after the mode changes hub.

7. **The folder==name invariant from KQ3 is preserved, with the strings now filled in.** KQ3 explicitly deferred the exact strings and promised to preserve folder == `packetSkillName` whatever KQ5 chose [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:66]. Finding 5 fills those strings; no amendment to KQ3's proposed registry shape is needed.

## Questions Answered

- **KQ5: Do the modes keep the `mcp-` prefix inside the new hub? Answer with one naming decision giving the folder, `workflowMode` and `packetSkillName` for each of the three modes.** Answered: **Yes** — keep the prefix. Folders / `workflowMode` / `packetSkillName` are `mcp-chrome-devtools`, `mcp-aside-devtools`, and (new) `mcp-bladebro`, with folder == `packetSkillName` and `grandfatheredFolderMismatch: false` for each. Full answer also written to `research.md` KQ5 section.

## Questions Remaining

- KQ1 (capability matrix — findings gathered in iteration 1 but the strategy box is still unchecked; carries the Lighthouse contradiction)
- KQ6 (macOS verification steps)
- KQ7 (security risks and mitigations)
- KQ8 (whether Bladebro takes over Aside's deterministic signed-in work)

## Edge Cases

- **Ambiguous input:** "keep the prefix" could have meant folder-only, id-only, or both. Resolved by the canonical rule, which ties folder, `packetSkillName` and frontmatter `name:` together; the hybrid was ruled out by the checker's stale-flag rule (finding 2).
- **Contradictory evidence:** the parent spec's bare mode nouns (spec.md:82) appear to conflict with the canonical prefixed ids. Resolved: line 82 enumerates `<mode>` nouns, and the still-open question at line 146 is exactly what this iteration decided; the canonical template composes `mcp-` + noun (finding 4). Both claims are preserved with citations rather than collapsed.
- **Missing dependencies:** none. The Bladebro packet still does not exist, but naming it greenfield (`mcp-bladebro`) needs no packet on disk; authoring remains 004's work.
- **Partial success:** none. All planned research actions completed.

## Ruled Out

- Dropping the `mcp-` prefix from workflow mode ids: rejected because the canonical create-skill-parent rule is `folder == packetSkillName == [hub-prefix]-<mode>` and dropping it would rename every literal mode id in the KQ4 hand-edit set for no contract benefit.
- Hybrid bare folder + prefixed `packetSkillName` with `grandfatheredFolderMismatch:true`: rejected because the flag is defined as a preserved *legacy* mismatch, `parent-skill-check.cjs:595-597` soft-fails a stale `true` flag, and iteration 3 fixed folder == name as the invariant.

## Dead Ends

- None. Both alternatives produced a decisive finding rather than eliminating a path. Candidates for reducer promotion: the two ruled-out options above are classification choices specific to KQ5, not exhausted research directions.

## SCOPE VIOLATIONS

None. All writes are inside the `001-research/research/` lineage directory; no researched file was modified and no install or rename was performed.

## Sources Consulted

- `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:294`, `create-skill-parent-auto.yaml:261`, `create/skill-parent.md:112`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:520,552,588-612,783`
- `.skilled/skills/mcp-tooling/mode-registry.json:13-15,30,47-49,97,114-116`
- `.skilled/skills/mcp-tooling/SKILL.md:28-37,90-111,123-141`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:82,134-138,146`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/002-hub-scaffold/spec.md:109-116,144`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/spec.md:40,46,82,113-115`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/spec.md:90,96,114`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:64-66,73,79`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/iterations/iteration-003.md:25,66`; `iteration-004.md:37-43,96`
- repo-wide grep for `grandfatheredFolderMismatch` over `.skilled`; scoped grep for naming terms over the parent packet

## Assessment

- New information ratio: **0.90**. Six findings are new (canonical naming rule, checker semantics, current-registry baseline, noun-vs-full-id reading, the three-mode decision table and the blast-radius consequence); one partially reuses iteration 3's folder == `packetSkillName` invariant. The contradiction resolution adds no new external evidence, so no simplicity bonus was applied.
- Questions addressed: KQ5.
- Questions answered: KQ5.

## Reflection

- What worked and why: going to the canonical authoring contract and the authoritative checker first turned a judgment call into a cited rule; the checker's "stale flag" soft-fail specifically eliminated the tempting hybrid option.
- What did not work and why: the broad naming grep over the parent packet returned mostly prompt-template boilerplate; narrowing to the canonical rule and the checker produced the decisive evidence.
- What I would do differently: read the create-skill-parent canon in iteration 3, when the strings were first deferred, so KQ5 could have been answered without a dedicated iteration.

## Recommended Next Focus

KQ6: produce the macOS verification step list for Bladebro — install through a live agent-browser and real-browser probe, each step with expected output and rollback. The binary is absent from PATH and installation is an explicit non-goal (BLOCKED in strategy), so this must be a documented procedure KQ6 can hand to 006, not a live probe. Keep the `mcp-bladebro` naming decided here as the packet the playbook verifies.
