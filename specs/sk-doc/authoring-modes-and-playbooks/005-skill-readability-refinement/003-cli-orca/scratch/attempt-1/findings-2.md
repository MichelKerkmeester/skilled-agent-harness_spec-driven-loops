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