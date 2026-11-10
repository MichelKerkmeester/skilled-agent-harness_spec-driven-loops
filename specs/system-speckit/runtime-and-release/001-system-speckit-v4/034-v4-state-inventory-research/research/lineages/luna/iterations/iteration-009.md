# Angle 9 — BREAKING CHANGES AND UPGRADE NOTES

## Focus

Build an operator-facing upgrade candidate list from the v3.6.0.0 boundary, the v4 timeline and current paths. Separate changes confirmed by live registries/code from claims that are only inferred from commit messages or stale narrative documents.

## Actions Taken

- Confirmed the active branch and available release tags without fetching or changing refs.
- Read the v4 timeline and phase map around the memory decommission, runtime rename, CLI nesting, retrieval, template, hook, mirror, and CI packets.
- Compared old and current paths for specs, deep-loop packages, prompt-models, Figma, interface, and diagram commands.
- Used the read-only `git log --oneline v3.6.0.0..HEAD` path-filtered history as chronology evidence, not as proof of runtime behavior.

## Findings

### INVENTORY

| surface | value | source |
|---|---|---|
| release boundary | Current checkout is `skilled/v4.0.0.0`; tags `v3.6.0.0` and `v4.0.0.0-beta.1` are present. | [SOURCE: `git branch --show-current` and `git tag --list` output; `specs/system-speckit/033-system-speckit-v4/spec.md:3-14`] |
| memory decommission | Timeline packet 017 removes the system-spec-memory MCP database subsystem and replaces it with grep-first retrieval; packet 019 lands that decommission on the release branch. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/timeline.md:71,75`] |
| runtime rename/nesting | Packet 020 renames the surviving spec-kit runtime package; packet 021 nests the CLI and moves the trigger index under runtime. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/timeline.md:77,79`] |
| later hardening sequence | The filesystem contains `029-goal-operator-resync-rule`, `030-spec-kit-simplification-research`, `031-ci-shared-package-resolution`, `032-recorded-findings-closure`, and `033-ci-dependency-hardening` directories in addition to the older `029-ci-shared-package-resolution` directory. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/` directory inventory; `specs/system-speckit/033-system-speckit-v4/spec.md:138`] |
| phase-map drift | The parent `spec.md` phase map ends at row 29 and does not list the later 029 goal-resync, 030, 031, 032, or 033 directories; the directory inventory and current HEAD therefore outrun the parent map. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/spec.md:138-143`] |
| specs path | `.opencode/specs` is present as a symlink to `../specs`; the canonical parent packet is under top-level `specs/`. | [SOURCE: `.opencode/specs` link target; `specs/system-speckit/033-system-speckit-v4/spec.md:3-14`] |
| retired package paths | `.opencode/skills/deep-loop-workflows`, `.opencode/skills/deep-loop-runtime`, `.opencode/skills/sk-prompt-small-model`, and flat `.opencode/skills/mcp-figma` are absent; `system-deep-loop`, `sk-prompt`, and nested `mcp-tooling/mcp-figma` are present. | [SOURCE: live `test -e` path checks; `.opencode/skills/system-deep-loop/mode-registry.json:19-117`; `.opencode/skills/mcp-tooling/SKILL.md:30`] |
| retired command paths | `.opencode/commands/interface` and `.opencode/commands/create/diagram` are absent; current design routers are `/design:extract`, `/design:diagram`, and `/design:chart`. | [SOURCE: live `test -e` path checks; `.opencode/commands/design/diagram.md:1-13`; `.opencode/commands/design/extract.md:1-13`] |
| current runtime evidence | The live runtime now has nested `runtime/cli`, lexical retrieval, registered validator rules, shared package resolution and runtime mirror gates, so “renamed” and “nested” are code-visible path changes rather than only packet labels. | [SOURCE: `.opencode/skills/system-spec-kit/runtime/cli/README.md:13,62`; `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:16,57`; `.github/workflows/spec-kit-check.yml:116-148`] |
| history signal | Recent history contains explicit commits for mirror parity, recorded-findings closure, generated hook registrations, shared package resolution, runtime/CLI nesting, moved design modes, and memory removal. Commit subjects establish chronology and candidate scope, not the final contract by themselves. | [SOURCE: `git log --oneline v3.6.0.0..HEAD -- .opencode/skills/system-spec-kit .opencode/skills/system-deep-loop .opencode/commands .github/workflows .opencode/hooks .opencode/scripts/git-hooks` output; `specs/system-speckit/033-system-speckit-v4/timeline.md:71-91`] |

### DRIFT

| draft line | claim | verdict | actual state | severity | one-line correction | source |
|---:|---|---|---|:---:|---|---|
| 18, 57 | Specs moved from `.opencode/specs/` to top-level `specs/`, while a compatibility symlink keeps old references working. | TRUE | `.opencode/specs` resolves to `../specs`; the top-level packet exists. | P2 | Retain the path migration and explicitly document the compatibility symlink target. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:18,57`; live `.opencode/specs` link target; `specs/system-speckit/033-system-speckit-v4/spec.md:3-14`] |
| 23, 180 | The authoritative ledger covers eight loop modes. | FALSE | The live deep-loop registry exposes six modes, and the timeline's current v4 directory sequence does not establish eight shipped modes. | P0 | Change every eight-mode ledger statement to the six registered modes and name them. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:23,180`; `.opencode/skills/system-deep-loop/mode-registry.json:19-117`] |
| 31, 226 | Goals carry equal weight in every tool and the shared core reaches all tools. | FALSE | The current goal table supports OpenCode, Pi, and Cursor; Claude, Codex, and Devin are explicitly by-design unsupported. | P0 | State three supported goal runtimes and preserve the injection-only/verification differences. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:31,226`; `.opencode/hooks/goal/goal-plugin.md:141-153`] |
| 98 | Advisor state can still leak into a spec folder after the structural boundary change. | STALE | The current advisor workspace-root resolver and package-local state contract are the live authority; the draft's residual-leak claim is not confirmed by the current path policy. | P1 | Replace the warning with the current structural containment contract, or reproduce a leak before retaining it. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:98`; `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/workspace-root.ts:31`; `.opencode/skills/system-skill-advisor/mcp-server/lib/utils/db-path-policy.md:47`] |
| 104 | Codex advisor startup specifically depends on ABI 141 and `mk_skill_advisor`. | MISSING | This history pass did not inspect the installed native module ABI or execute the startup path; the current package/runtime source only proves the renamed nested location, not that historical ABI assertion. | P1 | Reproduce the installed runtime ABI before publishing a numeric ABI guarantee. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:104`; `.opencode/bin/skill-advisor.cjs:19-43`] |
| 114-118 | sk-doc is a parent over `sk-create-*` packets including `sk-create-diagram`, with surface/workflow axes. | STALE | sk-doc is a parent, but its live registry has 14 modes and no diagram packet; diagrams moved to sk-design. | P1 | Keep the parent claim and remove `sk-create-diagram` plus the unsupported axis generalization. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:114-118`; `.opencode/skills/sk-doc/mode-registry.json:19-53`; `.opencode/skills/sk-design/SKILL.md:58-69`] |
| 126 | `/create:diagram` is a shipped command. | FALSE | The command path is absent; `/design:diagram` is the live design router. | P0 | Replace `/create:diagram` with `/design:diagram`. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:126`; `.opencode/commands/design/diagram.md:1-13`] |
| 149, 155 | A usable `deep-alignment` mode joined the loop family. | FALSE | No `deep-alignment` workflowMode is registered; the live names are agent-improvement and the two benchmark modes. | P0 | Remove the shipped-mode claim and list the six registry modes instead. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:149,155`; `.opencode/skills/system-deep-loop/mode-registry.json:19-117`] |
| 202-210 | Pi hosts the framework natively with MCP, hooks, and agents, and is the deepest integration. | TRUE | Pi has native extension bridges, guard-core adapters, and runtime-specific lifecycle wiring; the comparative “deepest” ranking remains narrative. | P2 | Retain the concrete native-bridge claim and label comparative superlatives as interpretation. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:202-210`; `.pi/extensions/README.md:11-24`] |
| 244-248 | The hook layer is roughly 96 relative symlinks controlled by `MK_HOOKS_DISABLED` and twenty concern flags. | STALE | The live tree mixes portable cores and symlink indexes; the canonical master flag is `SYSTEM_HOOKS_DISABLED` and the concern table uses `SYSTEM_*` names. | P1 | Correct the flag names and explain the mixed source/index topology. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:244-248`; `.opencode/hooks/README.md:20-52`] |
| 256-278 | Design's `/interface:*` manager shell and Open Design removal are current together. | STALE | Open Design is absent, but the design command family is `/design:*` and the live hub has four modes, not the draft's interface manager/card contract. | P0 | Keep Open Design removal and rewrite the design surface around current mode/command files. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:256-278`; `.opencode/skills/sk-design/SKILL.md:58-69`; `.opencode/commands/design/diagram.md:1-13`] |
| 284-299 | sk-code becomes a parent with workflow and read-only surface modes. | TRUE | The registry confirms two workflow and four surface modes; review is first-class. | P2 | Retain and enumerate the six current modes. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:284-299`; `.opencode/skills/sk-code/mode-registry.json:30-44,92-110`] |
| 333, 443 | New branches use four-digit owner-first grammar. | FALSE | Live grammar is three-digit `worktrees/{NNN}-{slug}` or `branches/{NNN}-{slug}`, allocated by the sk-git script; push allowlisting is separate. | P0 | Replace the upgrade rule with the three-digit worktrees/branches grammar and current push policy. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:333,443`; `.opencode/skills/sk-git/SKILL.md:299-305,359-363`] |
| 345, 351-361 | Prompt work has `prompt-improve` and `prompt-models` modes with six profiles. | FALSE | sk-prompt is a standalone one-mode leaf with seven frameworks and internal operating modes; no prompt-models mode is registered. | P0 | Remove the two-mode/profile topology from the upgrade notes. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:345,351-361`; `.opencode/skills/sk-prompt/leaf-manifest.json:2,42`; `.opencode/skills/sk-prompt/SKILL.md:292-319`] |
| 395, 441 | mcp-figma moved under `mcp-tooling` and the old deep-loop package identities disappeared. | TRUE | The flat Figma path and old deep-loop package paths are absent; the nested Figma transport and `system-deep-loop` registry are live. | P2 | Retain these path moves and add the exact new paths. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:395,441`; `.opencode/skills/mcp-tooling/SKILL.md:30`; `.opencode/skills/system-deep-loop/mode-registry.json:19-117`] |
| 440-457 | The concrete rename/removal/default list is complete and current. | STALE | It mixes confirmed path moves with false interface/diagram/prompt-model claims, a wrong branch grammar, and a universal goal claim. | P1 | Rebuild upgrade notes from the confirmed-by-code rows in this iteration and mark historical inferences separately. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:440-457`; `.opencode/hooks/goal/goal-plugin.md:141-153`; `.opencode/skills/sk-git/SKILL.md:359-363`] |

DISAGREEMENTS: The parent v4 `spec.md` phase map stops at one row 29, while the filesystem and current history contain a second 029 plus 030–033; the parent map is therefore stale as a chronology inventory. The draft's “eight modes,” `deep-alignment`, prompt-models, interface, diagram, hook flag, and branch grammar claims contradict live registries or contracts. Commit subjects confirm when work landed but do not independently prove the behavior each subject names.

CONFIDENCE: Confirmed: branch/tag presence, old/new path existence, current registries, current command routers, goal support table, worktree grammar, and the 017–029 timeline entries. Inferred: semantic details stated only in commit subjects or narrative changelog prose, especially ABI-specific behavior, comparative Pi ranking, and whether all later 030–033 packet changes are reflected in the stale parent timeline; those remain labeled or bounded rather than promoted to ground truth.

## Questions Answered

- Which upgrade claims are code-confirmed? The top-level specs symlink, retired package paths, nested Figma path, current design routers, six-mode deep-loop registry, three-digit worktree grammar, and three-runtime goal table.
- Which candidate breaking changes should operators act on? Memory/MCP retrieval removal, runtime/CLI nesting, deep-loop package consolidation, nested Figma path, `/design:*` command family, prompt topology correction, worktree grammar, and session-scoped goal migration.
- Which claims are only historical inference? ABI 141, comparative Pi superiority, exact ledger rollout semantics, and any behavior asserted only by commit subject.

## Questions Remaining

- Can the full draft be classified line by line, including every count and numeric performance claim?
- Which true historical changes are omitted by the draft, especially the 029–033 follow-on hardening packets?
- Which disagreements survive a final reproduction pass over the draft and the current registries?

## Next Focus

Iteration 10: DRAFT-VERSUS-REALITY.

## Reflection

The history pass shows why an upgrade guide cannot be reconstructed from commit subjects alone: the repository contains a stale parent phase map beside later phase directories, and the draft preserves several earlier intermediate designs. The final pass should use the draft as an index, but use current code and registries for every verdict.
