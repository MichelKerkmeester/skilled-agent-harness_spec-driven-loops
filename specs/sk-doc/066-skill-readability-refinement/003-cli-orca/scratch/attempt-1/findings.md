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
### .skilled/skills/cli-orca/references/orca-skills/orca-cli.md

- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-cli.md:17 | 1, 3, 9 | The description and intro do not match the template’s hook pattern; the intro also contains a packet path. | Replace both the frontmatter `description` and the intro with: `Use this reference when an Orca task needs a local map of the CLI-owned surfaces before you load the binary's guide.`
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-cli.md:23 | 4 | The overview does not open with Purpose and When to Use. | Insert `### Purpose` before the first sentence and `### When to Use` before `The frontmatter names the engagement phrases`; leave both sentences verbatim.
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-cli.md:37 | 7 | The guide-loading and fallback decision tree is packed into one paragraph. | Convert the conditional paths into an ordered list, preserving the kernel, `--reference`, `--full`, and `--help` order.

### .skilled/skills/cli-orca/references/orca-skills/orca-emulator-android.md

- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-emulator-android.md:16 | 1, 3, 9 | The three-sentence intro exceeds the template limit, lacks a clear reader hook, and includes a packet path. | Replace both the frontmatter `description` and the intro with: `Open this reference when Android device work needs the official skill's scope before its version-matched guide is loaded.`
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-emulator-android.md:22 | 4 | The overview does not open with Purpose and When to Use. | Insert `### Purpose` before the first sentence and `### When to Use` before `Engage it when`; leave both sentences verbatim.
- [P1] .skilled/skills/cli-orca/references/orca-skills/orca-emulator-android.md:81 | 5 | The `--worktree all` warning appears after the command surface it governs and warns that mutations run unscoped. | Move this warning to immediately before the `Targeting:` paragraph at line 71.
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-emulator-android.md:73 | 7 | One paragraph packs seven separate constraints. | Split the sentences into one bullet per constraint, preserving their current wording and order.

### .skilled/skills/cli-orca/references/orca-skills/orca-emulator.md

- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-emulator.md:16 | 1, 3, 9 | The three-sentence intro exceeds the template limit, lacks a clear reader hook, and includes a packet path. | Replace both the frontmatter `description` and the intro with: `Open this reference when iOS Simulator work needs the official skill's scope before its version-matched guide is loaded.`
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-emulator.md:22 | 4 | The overview does not open with Purpose and When to Use. | Insert `### Purpose` before the first sentence and `### When to Use` before `Engage it when`; leave both sentences verbatim.
- [P1] .skilled/skills/cli-orca/references/orca-skills/orca-emulator.md:77 | 5 | The `--worktree all` warning appears after the command surface it governs and warns that mutations run unscoped. | Move this warning to immediately before the `Targeting:` paragraph at line 67.
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-emulator.md:69 | 7 | One paragraph packs seven separate constraints. | Split the sentences into one bullet per constraint, preserving their current wording and order.

### .skilled/skills/cli-orca/references/orca-skills/orca-linear.md

- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-linear.md:17 | 1, 3, 9 | The three-sentence intro exceeds the template limit, lacks a clear reader hook, and includes a packet path. | Replace both the frontmatter `description` and the intro with: `Use this reference when a Linear ticket task needs Orca's read-first rules and supported write surfaces.`
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-linear.md:23 | 4 | The overview does not open with Purpose and When to Use. | Insert `### Purpose` before `orca-linear declares`; insert `### When to Use` before `Engage it when`; leave the remaining wording verbatim.
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-linear.md:49 | 7 | Discovery and queue pagination mechanics are packed into one paragraph. | Split the discovery and triage instructions from the queue-style filtering and pagination instructions into separate bullets, preserving their wording.

### .skilled/skills/cli-orca/references/orca-skills/orca-per-workspace-env.md

- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-per-workspace-env.md:17 | 1, 3, 9 | The four-sentence intro exceeds the template limit, repeats the routing boundary from §5, and includes a packet path. | Replace both the frontmatter `description` and the intro with: `Open this reference when an Orca workspace needs an environment recipe or a doctor/provisioning decision.`
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-per-workspace-env.md:23 | 4 | The overview does not open with Purpose and When to Use. | Insert `### Purpose` before the first sentence and `### When to Use` before `Engage it`; keep the later `Use orca-cli` sentence under When to Use.
- [P1] .skilled/skills/cli-orca/references/orca-skills/orca-per-workspace-env.md:45 | 5 | The setup sequence lists base and auth snapshots before the snapshot safety rules in §3. | Move the sequence below the credential and snapshot rules, under a `### Setup Workflow` heading.
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-per-workspace-env.md:45 | 7 | Ten ordered workflow actions are compressed into a comma-separated paragraph. | Convert the sequence into a numbered list, preserving its order and every `[CHECKPOINT]` label.
- [P2] .skilled/skills/cli-orca/references/orca-skills/orca-per-workspace-env.md:72 | 7 | The provisioning paragraph combines its execution steps, retry loop, state-file check, and cleanup exception. | Split it into ordered steps, retaining the failed-result, `ok`, authenticated `snapshotId`, `destroy`, and `destroy: none` conditions.

### .skilled/skills/cli-orca/references/orca-skills/orchestration.md

- [P2] .skilled/skills/cli-orca/references/orca-skills/orchestration.md:17 | 1, 3, 9 | The intro does not tell the reader when to open the file and includes a packet path. | Replace both the frontmatter `description` and the intro with: `Open this reference when a task asks for supervised Orca coordination and you need the role and lifecycle rules.`
- [P2] .skilled/skills/cli-orca/references/orca-skills/orchestration.md:23 | 4 | The overview does not open with Purpose and When to Use. | Insert `### Purpose` before the current sentence; add `### When to Use` after it using the explicit-supervision trigger from the first row of §2’s role table.
- [P2] .skilled/skills/cli-orca/references/orca-skills/orchestration.md:25 | 7 | The guide-loading, conditional-reference, and fallback paths are packed into one paragraph. | Convert the paths into an ordered decision list, preserving the normal guide, gate-specific reference, `--full`, and `--help` order.

### .skilled/skills/cli-orca/references/orca-skills/overview.md

- [P2] .skilled/skills/cli-orca/references/orca-skills/overview.md:17 | 1, 3, 9 | The three-sentence intro exceeds the template limit, lacks a clear reader hook, and includes a packet path. | Replace both the frontmatter `description` and the intro with: `Use this index to find the official Orca skill that owns a surface, then locate its local reference, install path or guide-loading instructions.`
- [P2] .skilled/skills/cli-orca/references/orca-skills/overview.md:19 | 1 | The required divider between the intro and the first H2 is missing. | Insert `---` after line 17.
- [P2] .skilled/skills/cli-orca/references/orca-skills/overview.md:21 | 4 | The overview does not open with Purpose and When to Use. | Insert `### Purpose` with `Maps the eight official Orca Agent Skills to their local references and boundaries.` and `### When to Use` with `Use this index to identify an owning skill, find its install path, or load the matching guide.`
- [P2] .skilled/skills/cli-orca/references/orca-skills/overview.md:66 | 7 | Guide-loading modes, conditional-reference behavior, JSON output, and the `skills show` alias are packed into one paragraph. | Split these into bullets by behavior, preserving every existing claim.
- [P2] .skilled/skills/cli-orca/references/orca-skills/overview.md:117 | 9 | The body includes a current verification status (`all eight checks pass`). | Replace that status sentence with: `Per-skill release records and the verification procedure are documented in [`../../assets/PROVENANCE.md`](../../assets/PROVENANCE.md).`

### .skilled/skills/cli-orca/references/session-and-runtime.md

- [P2] .skilled/skills/cli-orca/references/session-and-runtime.md:3 | 1 | The frontmatter description does not match the intro required by the reference template. | After revising the intro hook, set `description` to that exact text.
- [P2] .skilled/skills/cli-orca/references/session-and-runtime.md:17 | 3 | The intro repeats the Purpose’s executable, runtime, handoff, selection, recovery, and receipt topics instead of serving as a hook. | Replace both the intro and `description` with: `Open this reference when the CLI output leaves you unsure whether work started, completed, or needs a retry.`
- [P2] .skilled/skills/cli-orca/references/session-and-runtime.md:43 | 9 | The body cites ephemeral research files and section numbers in its `research:` attributions. | Replace `research: research-orca-cli-surface.md §3` at lines 43 and 63 with direct source citations; replace `research: research-official-skills.md §1.7/§1.8` at lines 90 and 104–107 with the relevant official skill reference or guide citations.
- [P2] .skilled/skills/cli-orca/references/session-and-runtime.md:121 | 7 | The wait, retry, and stop conditions form a sequential procedure inside one paragraph. | Convert the sentences into an ordered list, preserving the one-retry limit and the `wait.satisfied` conditions.
- [P2] .skilled/skills/cli-orca/references/session-and-runtime.md:123 | 7 | The paragraph combines single-handle close, bulk-close confirmation, `unverifiable` handling, Sleep, and the legacy stop rule. | Split these into separate bullets, preserving each condition and instruction.
### .skilled/skills/cli-orca/references/troubleshooting.md

- [P2] .skilled/skills/cli-orca/references/troubleshooting.md:17 | 3 | The second intro sentence repeats recovery and evidence claims that belong in the overview. | Keep the first sentence as the hook; move the second sentence verbatim under a new `### Purpose` in Section 1.
- [P2] .skilled/skills/cli-orca/references/troubleshooting.md:23 | 4 | The overview has no distinct `Purpose` and `When to Use` sections. | Add `### Purpose` before the moved sentence and `### When to Use` before “Use this reference whenever…”; put “It pairs with…” after the use text.
- [P2] .skilled/skills/cli-orca/references/troubleshooting.md:31 | 7 | One paragraph defines four separate table mechanisms, making the column guidance harder to scan. | Replace it with four bullets: `- **First check:** the cheapest observation that separates the causes.` `- **Next check:** what to run once the first check narrows the field.` `- **Safe action:** the only recovery attempt allowed before escalation.` `- **Stop:** when the safe action cannot produce a verified result.`
- [P1] .skilled/skills/cli-orca/references/troubleshooting.md:47 | 5 | The evidence-capture requirement follows the recovery actions it governs, so readers can encounter those actions before the preservation gate. | Move this paragraph to after line 31 and before the table; replace “Each recovery attempt above” with “Each recovery attempt in the symptom table below”.
