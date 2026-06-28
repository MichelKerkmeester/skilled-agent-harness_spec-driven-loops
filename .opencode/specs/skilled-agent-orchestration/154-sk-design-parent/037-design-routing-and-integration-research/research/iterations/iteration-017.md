# Iteration 17: /design:* allowed-tools over-grant

## Focus

This iteration investigated D2-13: the `/design:*` command wrappers grant `Write`, `Edit`, and `Bash` uniformly even though the sk-design hub says four modes are doc-guidance/read-and-guide modes and only `md-generator` runs the Playwright extract-write-validate pipeline.

## Actions Taken

1. Read the live `/design:*` command wrappers and confirmed their frontmatter grants the same tool set across all five commands: `Read, Write, Edit, Bash, Glob, Grep`. [SOURCE: .opencode/commands/design/interface.md:4] [SOURCE: .opencode/commands/design/foundations.md:4] [SOURCE: .opencode/commands/design/motion.md:4] [SOURCE: .opencode/commands/design/audit.md:4] [SOURCE: .opencode/commands/design/md-generator.md:4]
2. Checked the `sk-design` hub contract and mode registry. The hub explicitly distinguishes four read-and-guide/doc-guidance modes from the single extraction mode, while the registry currently records `backendKind` but no tool policy. [SOURCE: .opencode/skills/sk-design/SKILL.md:62] [SOURCE: .opencode/skills/sk-design/SKILL.md:81] [SOURCE: .opencode/skills/sk-design/mode-registry.json:5] [SOURCE: .opencode/skills/sk-design/mode-registry.json:14]
3. Opened the five mode packets to compare their own tool surfaces. `interface`, `foundations`, `motion`, and `audit` allow only `Read`, `Grep`, `Glob`, and `Task`; `md-generator` alone allows `Write`, `Edit`, and `Bash`. [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-md-generator/SKILL.md:4]
4. Compared the impeccable-main command model. Its parent skill grants constrained script commands instead of blanket write/edit authority, keeps command descriptions and argument hints in `command-metadata.json`, and treats pinned shortcuts as redirects back into the parent command. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:6] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:120] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:177] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:1]

## Findings

### Finding 1: Wrapper tool grants violate the mode boundary

Severity: P1. Label: ENFORCEABLE.

The live command wrappers grant mutating tools for all five commands, but four target mode packets do not grant those tools themselves. The mismatch is visible in the frontmatter: `interface`, `foundations`, `motion`, and `audit` wrappers each grant `Write`, `Edit`, and `Bash`, while their mode packets limit tools to `Read`, `Grep`, `Glob`, and `Task`. [SOURCE: .opencode/commands/design/interface.md:4] [SOURCE: .opencode/commands/design/foundations.md:4] [SOURCE: .opencode/commands/design/motion.md:4] [SOURCE: .opencode/commands/design/audit.md:4] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-foundations/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-motion/SKILL.md:4] [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:4]

Buildable recommendation: add a command-surface `toolPolicy` for each `/design:*` command and check wrapper frontmatter against it. Initial policy:
- `interface`, `foundations`, `motion`, `audit`: mutation-free. Remove `Write`, `Edit`, and `Bash` from command frontmatter. Mirror packet tools where the command host supports them, or use the closest mutation-free command set (`Read`, `Glob`, `Grep`) with an explicit no-mutation policy.
- `md-generator`: artifact-producing. Keep `Write`, `Edit`, and `Bash`, but mark it as the only checked-in `/design:*` command whose mode may mutate workspace artifacts.

Enforcement: deterministic. A static checker can parse command frontmatter and fail when a command with `toolPolicy.mutatesWorkspace=false` contains `Write`, `Edit`, or `Bash`.

### Finding 2: The hub already has enough semantics to classify the grants, but no schema field carries them

Severity: P1. Label: ENFORCEABLE.

The hub names the permission split directly: four doc-guidance modes are read-and-guide, and `md-generator` is the only mode with an extraction pipeline requiring `Write/Edit/Bash` over Playwright. The registry distinguishes `backendKind: "reference-base"` from `backendKind: "playwright-extract"`, but it does not carry `allowedTools`, `mutatesWorkspace`, or `bashAllowlist` fields. [SOURCE: .opencode/skills/sk-design/SKILL.md:62] [SOURCE: .opencode/skills/sk-design/SKILL.md:81] [SOURCE: .opencode/skills/sk-design/mode-registry.json:16] [SOURCE: .opencode/skills/sk-design/mode-registry.json:28] [SOURCE: .opencode/skills/sk-design/mode-registry.json:40] [SOURCE: .opencode/skills/sk-design/mode-registry.json:52] [SOURCE: .opencode/skills/sk-design/mode-registry.json:64]

Buildable recommendation: extend the command metadata work from iterations 15-16 with permission metadata rather than putting permissions only in wrapper prose. Either:
- Add a sibling `.opencode/commands/design/command-metadata.json` or `.opencode/skills/sk-design/command-metadata.json` with `command`, `mode`, `descriptionRole`, `toolPolicy`, and fixture cases.
- Or add a `commandSurface` object to each `mode-registry.json` mode. Keep the existing routing discriminator intact and let the command metadata point to `workflowMode`.

The checker should compute expected tools from the metadata plus packet frontmatter and flag drift in the wrapper files.

Enforcement: deterministic for static files. Runtime behavior remains advisory only if mutating tools stay granted, because prose cannot prevent a tool call once the command surface permits it.

### Finding 3: impeccable-main supports metadata-first command surfaces and constrained tool grants

Severity: P2. Label: ENFORCEABLE for wrapper generation/checks, ADVISORY for runtime taste decisions.

The corpus pattern is not "grant every command raw write/edit access." Impeccable's skill source allows only constrained script command forms in frontmatter, while command descriptions and argument hints live in a JSON metadata file. Its command router also says pinned shortcuts invoke the parent command directly instead of becoming separate independent command logic. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:6] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/scripts/command-metadata.json:2] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:165] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/SKILL.src.md:177]

Buildable recommendation: when `/design:*` commands grow generated pins, make pins redirect through the `sk-design` hub or command metadata row, and copy the least-privilege tool policy from that row. Do not hand-author permissive frontmatter on every pinned shortcut.

Enforcement: deterministic. A fixture can assert that generated command wrappers either match the canonical tool policy or redirect to a parent command without adding broader tools.

## Questions Answered

- Q1/D2: `/design:*` specificity needs a permission contract as well as argument grammar and output shape. The current wrappers are not merely generic; they are over-permissive relative to their target modes.
- Q5/all: The permission portion is enforceable. Static wrapper parity, mutation-free mode checks, and generated-pin tool checks can run over a test corpus. The only advisory part is whether the model exercises taste correctly after the least-privilege surface is loaded.

## Questions Remaining

- Should `toolPolicy` live inside `mode-registry.json.commandSurface` or in a sibling `command-metadata.json` that points back to `workflowMode`?
- Should mutation-free `/design:*` wrappers include `Task` when the command host supports it, or should command wrappers stay stricter than child mode packets and use only `Read`, `Glob`, and `Grep`?
- Should `md-generator` keep raw `Bash`, or should it move to a constrained command-pattern allowlist similar to impeccable-main's script-only grant?

## Next Focus

Advance the D2 angle bank beyond D2-13. The next D2 pass should turn the command-surface schema into a replayable checker design: fixtures for wrapper frontmatter parity, generated-pin redirects, and the lone artifact-producing `md-generator` exception.
