### .skilled/skills/cli-orca/README.md

- [P2] .skilled/skills/cli-orca/README.md:15 | 1 | The README scaffold uses a one-sentence blockquote purpose line after the H1; this tagline is plain text. | Prefix the existing line with `> `.
- [P2] .skilled/skills/cli-orca/README.md:17 | 10 | `At a glance` is an unnumbered H2. | Change it to `## 1. AT A GLANCE` and increment the following H2 numbers by one.
- [P2] .skilled/skills/cli-orca/README.md:29 | 4 | The overview states the purpose but does not open with a When to Use section. | Add `### Purpose` before line 31; after the purpose paragraph, add `### When to Use` and `Use this package when a request names an Orca-managed surface or an official skill in an Orca context.`
- [P1] .skilled/skills/cli-orca/README.md:39 | 8 | The package index lists selected components but omits many files under the package root, including nested references, snapshots, changelogs and benchmark reports. | Replace lines 41–49 with a complete recursive inventory of every file under `.skilled/skills/cli-orca/`.
- [P2] .skilled/skills/cli-orca/README.md:55 | 7 | The positive signals and negative holdouts are packed into prose paragraphs. | Reformat the content at lines 55 and 59 as positive-signal and holdout lists, preserving each phrase and owner.
- [P2] .skilled/skills/cli-orca/README.md:57 | 5 | The bare-token routing gate follows the positive signals it governs. | Move line 57 before line 55.
- [P2] .skilled/skills/cli-orca/README.md:63 | 7 | The paragraph combines two separate naming collisions. | Split it into two bullets, one for `orca-linear`/`linear-tickets` and one for the orchestration hub/skill distinction.
- [P2] .skilled/skills/cli-orca/README.md:74 | 9 | “After the extraction,” “authored in the same change,” and “including the extraction” describe authoring history. | Remove “after the extraction” from line 74; replace line 76 with `The advisor and compiled-route replays are documented by their owning workflow. This README does not report those gate results.`; replace the line 218 description with `Release history.`
- [P2] .skilled/skills/cli-orca/README.md:76 | 1 | The README contains local links but no Related Resources section, which the README template requires when links exist. | Append `## 6. RELATED RESOURCES` with links to `SKILL.md` and `ROUTER.md`.

### .skilled/skills/cli-orca/ROUTER.md

- [P2] .skilled/skills/cli-orca/ROUTER.md:16 | 3 | The intro starts with a pointer sentence. | Move the current line 17 sentence describing the `SKILL.md`/`ROUTER.md` split into the overview; replace lines 16–17 with `Use this router to identify which local reference an Orca-qualified request loads.`
- [P2] .skilled/skills/cli-orca/ROUTER.md:21 | 4 | The overview presents request signals before its purpose. | Move lines 25–27 above line 23 under `### Purpose`, then label the existing signal summary `### When to Use`.
- [P2] .skilled/skills/cli-orca/ROUTER.md:23 | 7 | The paragraph packs positive signals, resource families, recovery conditions, non-matches and owner handoffs together. | Split its existing clauses into bullets for routes, recovery, non-matches and deferrals.

### .skilled/skills/cli-orca/SKILL.md

- [P2] .skilled/skills/cli-orca/SKILL.md:205 | 2 | The validator reports `render_section_order`: “REFERENCES AND RELATED RESOURCES” is followed by later H2 sections. | Rename this heading to `## 5. REFERENCES` and move the Related Resources heading and table at lines 220–228 to the end of Section 7 as a final `### RELATED RESOURCES` subsection, preserving the H2 order and numbers.

### .skilled/skills/cli-orca/assets/PROVENANCE.md

- [P2] .skilled/skills/cli-orca/assets/PROVENANCE.md:15 | 3 | The second intro sentence is a maintenance instruction, not part of the hook. | Move `Do not edit the snapshot files; refresh them from a newer snapshot instead.` to the start of Section 5.
- [P2] .skilled/skills/cli-orca/assets/PROVENANCE.md:19 | 4 | The overview has no Purpose and When to Use structure. | Add `### Purpose` before line 21 and `### When to Use` after the purpose content, with `Use this record when verifying the source, release revision or digest of a bundled snapshot.`
- [P2] .skilled/skills/cli-orca/assets/PROVENANCE.md:34 | 9 | The body contains an ephemeral spec path. | Replace the `Snapshot tree` value with `vendored Orca source tree`.
- [P2] .skilled/skills/cli-orca/assets/PROVENANCE.md:40 | 9 | `UNKNOWN` is a status token. | Replace `UNKNOWN -` with `No commit id is recorded because`.
- [P2] .skilled/skills/cli-orca/assets/PROVENANCE.md:59 | 9 | “Release-Mapping Status” labels a status subsection. | Rename it `### Release Mapping` and rephrase line 61 as a static comparison: `The final row in release-mapping.json is 1.4.178-rc.2; for most skills, its revision is one behind the manifest, so the listed app versions do not cover the manifest revisions above.`

### .skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md

- [P2] .skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:41 | 9 | The `research-orca-cli-surface.md §4` citation is authoring history. | Delete the trailing `(research: research-orca-cli-surface.md §4)`.
- [P2] .skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:70 | 7 | The paragraph combines source provenance, the failure condition and the override boundary. | Keep the source statement in the paragraph, then split the failure and override claims into separate bullets.
- [P2] .skilled/skills/cli-orca/references/mutation-and-browser-boundaries.md:70 | 9 | The research citation and “surface research flagged” wording describe authoring history. | Replace the clause beginning `which the surface research flagged` with `and that source file is the only source cited here for this behavior.`

### .skilled/skills/cli-orca/references/orca-cli-reference.md

- [P2] .skilled/skills/cli-orca/references/orca-cli-reference.md:17 | 3 | The intro begins with a pointer sentence and contains three sentences; its coverage sentence is not in the overview. | Move the sentence beginning `It records the executable resolution order` into the overview after line 23, then replace the intro with `Open this reference when a request needs an Orca command family and the installed guide must settle the exact flags.`
- [P2] .skilled/skills/cli-orca/references/orca-cli-reference.md:21 | 4 | The overview lacks Purpose and When to Use labels. | Add `### Purpose` before line 23 and `### When to Use` before the use-case bullets at lines 25–27.
- [P1] .skilled/skills/cli-orca/references/orca-cli-reference.md:95 | 5 | The destructive removal command appears before its archive-hook gate comment. | Move the comment on line 95 before the `orca worktree rm` command on line 94.
- [P1] .skilled/skills/cli-orca/references/orca-cli-reference.md:110 | 5 | The destructive bulk-close command appears before its authorization and receipt warning. | Move the comment on line 110 before the `orca terminal close` command on line 109.
- [P2] .skilled/skills/cli-orca/references/orca-cli-reference.md:76 | 9 | “Fresh research return,” “research return,” “prior Orca packet,” and “ancestor observation” are authoring-history references at lines 76, 199, 210–212 and 218–220. | Replace line 76 with `Family names and subcommand lists come from the command family inventory sourced from the guide and its conditional references (guide: skill-guides/orca-cli.md). Use the installed guide and agent-context --json as the authoritative command inventory and do not infer a missing command from this table.` Replace line 199’s research-return attribution with `source: src/shared/worktree/archive-hook-removal-gate.ts`; at line 210 replace `recorded from source inspection only (research return)` with `established by src/shared/worktree/archive-hook-removal-gate.ts only`; delete the research-return parentheticals at lines 211–212 and 220; at line 218 replace `local research could not ground` with `no local source establishes`; at line 219 replace `inspected for the prior Orca packet` with `inspected at` and remove `(ancestor observation)`.

### .skilled/skills/cli-orca/references/orca-skills/computer-use.md

- [P2] .skilled/skills/cli-orca/references/orca-skills/computer-use.md:17 | 3 | The first intro sentence is a pointer to the file, not a hook. | Delete `Local reference for the official computer-use skill.`
- [P2] .skilled/skills/cli-orca/references/orca-skills/computer-use.md:21 | 4 | The overview lacks Purpose and When to Use labels. | Add `### Purpose` before line 23 and `### When to Use` before the sentence describing when visible-window control applies.
- [P2] .skilled/skills/cli-orca/references/orca-skills/computer-use.md:27 | 7 | The paragraph packs many distinct command families and action types into one sentence. | Split the existing capability inventory into bullets for checks, app/window and accessibility reads, actions, and coordinate/screenshot results.
- [P2] .skilled/skills/cli-orca/references/orca-skills/computer-use.md:17 | 9 | The intro includes an ephemeral spec path. | Delete the final sentence beginning `Snapshot paths cited below resolve under`.

### .skilled/skills/cli-orca/references/orca-skills/linear-tickets.md

- [P2] .skilled/skills/cli-orca/references/orca-skills/linear-tickets.md:16 | 3 | The first intro sentence is a pointer to the file, not a hook. | Delete `Local reference for the official linear-tickets skill.`
- [P2] .skilled/skills/cli-orca/references/orca-skills/linear-tickets.md:20 | 4 | The overview lacks Purpose and When to Use labels. | Add `### Purpose` before line 22 and `### When to Use` before the engagement-trigger content at line 24.
- [P2] .skilled/skills/cli-orca/references/orca-skills/linear-tickets.md:24 | 7 | The overview packs the primary entry point, alignment rule, triggers, read-first flow, untrusted-data rule and recovery guidance into long paragraphs. | Split the existing content at lines 24–26 into bullets for entry point, alignment, engagement triggers, read-first flow and shared boundaries.
- [P2] .skilled/skills/cli-orca/references/orca-skills/linear-tickets.md:16 | 9 | The intro includes an ephemeral spec path. | Delete the final sentence beginning `Snapshot paths cited below resolve under`.