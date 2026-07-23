# Iteration 2: Runtime Include And Shared-Fragment Feasibility

## Focus

Resolve whether OpenCode can expand a shared fragment into each `/interface:*` prompt, distinguish checked-in literal self-containment from runtime-expanded self-containment, and select the smallest mechanism that preserves command-owned intake without copying mode-owned taste.

## Actions Taken

1. Inspected live command frontmatter and command-authoring rules for template, argument, loader, and router behavior.
2. Traced `$ARGUMENTS`, positional substitution, `!` shell-output injection, and file-reference behavior through shipped examples and runtime notes.
3. Traced the repository's command-contract renderer from supported-command registration through payload concatenation, argument joining, drift rejection, and manifest output.
4. Inspected renderer tests and the repository's generated-router/drift-check pattern.
5. Checked the current official OpenCode command documentation to cross-check Markdown templates, `$ARGUMENTS`, shell output, and `@` file references.

## Findings

1. **OpenCode has a direct shared-file expansion primitive: `@./path`.** Command Markdown is the prompt template, YAML frontmatter configures the command, `$ARGUMENTS` is the invocation placeholder, and local runtime guidance identifies `@./path` as file-content inclusion syntax. Therefore `@./.opencode/skills/sk-design/shared/creation-contract.md` is the smallest supported single-source mechanism for putting the existing normative contract into the prompt without asking the model to read it later. This makes the **rendered runtime prompt** self-contained; it does not make the checked-in command file itself contain those bytes. [SOURCE: .opencode/commands/deep/research.md:1-9] [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:188-219] [SOURCE: .opencode/skills/cli-external-orchestration/cli-claude-code/references/cli-reference.md:264]
2. **`$ARGUMENTS` is substitution, not a shared-fragment facility.** Authoring rules require commands to gate and route on `$ARGUMENTS`, while the verified non-interactive path passes the `--command` message into `$ARGUMENTS`; inside `!` injection it expands as separate argument words, so any renderer must join argv. The interface rewrite can preserve its current intake grammar while adding a literal brief and one `@` contract reference. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:221-242] [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:291-305] [SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:121]
3. **Shell-output injection can mechanically render shared content, but it is not the smallest or safest choice here.** The shipped `!` example runs before policy is read and emits argument ground truth. The repository renderer proves a larger variant: it hard-codes supported commands, joins argv, refuses stale compiled contracts, concatenates compiled and legacy bodies, and appends a render-manifest row. Reusing it for `/interface:*` would require registering five commands, compiler inputs, drift gates, rollout behavior, and an intentional write side effect; `@` inclusion needs none of that. [SOURCE: .opencode/commands/memory/search.md:11-20] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:17-38] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:62-90] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:131-149]
4. **Generation is the only candidate that can preserve a single canonical source while making every checked-in command body byte-literal, but it solves a stricter problem than runtime expansion.** The repository already treats generated router files plus `generate-command-routers.cjs --check` as a drift-controlled single-source pattern. If “self-contained” is defined as every shared lifecycle byte appearing in each source `.md`, generation is required; otherwise it adds build and synchronization machinery that the direct `@` mechanism avoids. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:327-363] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:81-111] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:164-173]
5. **Recommendation: keep each command's evocative, mode-specific creation brief literal, and inject only the normative shared creation contract with one `@` reference.** This keeps command-owned intake and experiential stakes visible in each checked-in file, keeps lifecycle/authority doctrine single-source, and leaves palettes, typography recipes, style menus, and judgment in the mode. Test it at three layers: static assertions for required literal brief sections and exactly one canonical `@` reference; a command-dispatch probe proving a contract sentinel and `$ARGUMENTS` both reach the rendered prompt; and anti-duplication checks rejecting copied mode-owned doctrine. Markdown links or “read this file” imperatives are references for the model, not loader expansion; presentation/YAML assets likewise remain agent-loaded routing assets rather than native prompt includes. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:244-267] [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:323-352] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:113-153]

## Questions Answered

- **What include/shared-fragment mechanism does the runtime support?** Use `@./path` for direct runtime file-content expansion. It yields runtime-expanded self-containment, not source-byte self-containment.

## Questions Remaining

- What complete literal, mode-specific creation brief should each of the five command bodies contain?
- Which exact lifecycle statements should remain literal near intake versus arrive through the shared contract reference?
- What exact static and live test fixtures should ship with the rewrite?

## Ruled Out

- **Markdown links or read imperatives as includes:** they can direct an agent to another file but do not establish loader-expanded prompt content.
- **Shell-command renderer for this rewrite:** feasible, but disproportionately adds registration, compilation, drift, rollout, security, and manifest-write concerns.
- **Presentation/YAML inclusion:** these are router-owned assets loaded by instructions/workflows, not a native Markdown-template include.
- **Full lifecycle duplication in five hand-authored files:** source-literal but not single-source; it creates avoidable normative drift.

## Dead Ends

- Treating “runtime-expanded self-contained” and “checked-in source byte-literal” as interchangeable. No include can satisfy both definitions; source-byte identity requires generation or duplication.
- Extending the deep-loop renderer merely because it exists. Its command registry and manifest behavior show it is a specialized subsystem, not a general zero-cost include primitive.

## Sources Consulted

- `.opencode/commands/deep/research.md:1-24`
- `.opencode/commands/memory/search.md:1-28`
- `.opencode/skills/sk-doc/create-command/SKILL.md:156-363`
- `.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:17-149`
- `.opencode/skills/system-deep-loop/runtime/tests/unit/render-command-contract.vitest.ts:81-173`
- `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md:121`
- `.opencode/skills/cli-external-orchestration/cli-claude-code/references/cli-reference.md:264`
- `.opencode/specs/sk-design/012-style-database-and-interface-commands/002-research-design-commands/research/research.md:291-300`
- `https://opencode.ai/docs/commands/`

## Assessment

- New information ratio: 1.00 (4 fully new findings and 1 partially new finding produce 0.90; +0.10 simplicity bonus for resolving the include question with one mechanism and separating the two meanings of self-containment)
- Questions addressed: What include, template injection, renderer, or generated-fragment mechanism does the current command runtime actually support?
- Questions answered: What include/shared-fragment mechanism does the runtime support?

## Reflection

- **What worked and why:** exact symbols and shipped examples exposed three distinct layers—native template expansion, repository renderer infrastructure, and model-directed asset loading—so superficially similar “include” candidates could be compared without another noisy generic search.
- **What did not work and why:** historical descriptions of compiled stubs were not sufficient evidence of the current command surface; direct reads showed the live deep command is an authored router while the specialized renderer remains separately implemented.
- **What I would do differently:** begin the body-drafting pass with a fixed source/runtime self-containment definition and a literal-versus-shared content matrix, preventing prompt prose from drifting into the shared authority contract.

## Recommended Next Focus

Draft the complete literal creation brief for each of the five commands. For every paragraph, label it `literal command-owned`, `shared normative @ contract`, or `mode-owned judgment`; preserve existing intake/route/proof sections and use the same experiential brief skeleton with mode-specific stakes rather than shared taste doctrine.
