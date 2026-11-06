---
title: "Implementation Plan: Vendored Skilled overlays and safe re-pin in a system-skilled-doctor skill"
description: "Add a standalone skill, system-skilled-doctor, that owns ten existing doctor commands about supporting and integrating Skilled into a project plus a new /doctor:overlay command. The overlay engine is a port of Barter's replay and sync scripts with one state source, an owned lock and a configurable overlay folder, and its re-pin target stages, scans, backs up and rolls back."
trigger_phrases:
  - "vendored overlays and repin plan"
  - "system skilled doctor plan"
  - "doctor overlay plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Vendored Skilled overlays and safe re-pin in a system-skilled-doctor skill

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, standard library only, as Barter's engine is today |
| **Framework** | A standalone Skilled skill, plus the doctor command family: a router `.md`, workflow YAML, a presentation asset and an engine script |
| **Storage** | JSON files in the overlay folder: the manifest and the applied-hash state. One setting file at the tree root names that folder. Re-pin backups go in a run folder in the overlay folder |
| **Testing** | `node --test`, porting Barter's `sync.test.cjs`, `replay.test.cjs` and `compiled-route-guard.test.cjs`, plus the existing doctor contract tests and the command-bridge drift guard |

### Overview
This packet is research and design. It writes no code. The build adds a standalone skill, `system-skilled-doctor`, that owns the doctor commands for putting Skilled into a project, checking it and keeping it current. A new `/doctor:overlay` command joins them. Its engine is Barter's two scripts merged into one, so apply and check read one state, and it takes its own lock. The research behind every claim is in `research/research.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md sections 2 and 3)
- [x] Success criteria measurable (spec.md section 5)
- [x] Dependencies identified (spec.md section 6)

### Definition of Done
For this packet:
- [x] Every proposed piece in section 3 names a Barter failure or a routing need, with a file and line
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/other/003-vendored-overlays-and-repin --strict` prints `RESULT: PASSED`

For the build packet, not this one:
- [ ] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine.test.cjs` passes every ported test and one new test per REQ-003 to REQ-013
- [ ] The doctor contract tests and `command-bridges-drift-guard.vitest.ts` pass after the ten tags move
- [ ] `status` and `check` on a copy of Barter's tree match what Barter's own scripts report on the same copy
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A standalone skill that owns doctor commands through their `skill_agent` tag, the same way `system-spec-kit` owns nine of them today.

### How the home was chosen
The first draft compared four homes and recommended a lone `/doctor:overlay` command. The operator ruled for a new skill, `system-skilled-doctor`, that owns every doctor command about supporting and integrating Skilled into a project. The comparison still explains two choices inside that ruling:
- **The overlay engine is a sibling of `/doctor:update`, not an extension of it.** The update engine is git-history based: it resolves the repository with `git rev-parse --show-toplevel` (`release-update.cjs:311-314`), lists files with `git ls-tree` over `.skilled` only (`release-update.cjs:350`) and reads `HEAD` (`release-update.cjs:829`). Barter's `skilled/` is an untracked archive copy (`git ls-files skilled` prints 0), and six of its 116 overlays target runtime folders the update engine never reads.
- **The skill routing reason is real.** Today `install`, `symlink`, `update`, `setup`, `helper`, `runtime-mirrors`, `env`, `speckit` and `mcp` carry `skill_agent: system-spec-kit`. `derive-command-bridges.cjs:141-152` credits each doctor bridge to that tag, so a request to install or update Skilled routes to the spec-folder skill. The new skill gives those requests an owner whose purpose matches them.

### Shape: one standalone skill, not a parent hub
`sk-create-skill` takes the hub path only "when one public skill identity must dispatch to multiple packets" (`sk-create-skill/SKILL.md:154`), where "packets own the detailed workflow, evidence, examples, tool boundaries, and validation" (`references/parent-skill/parent-skills-nested-packets.md:25`). Here each owned command already owns its own workflow, in its YAML and presentation asset under `.skilled/commands/doctor/assets/`. A mode packet per command would restate that contract in a second place.

The routing between commands is also already solved. Every doctor route becomes an advisor command bridge with its own trigger phrases (`_routes.yaml:23-29`), so the advisor picks the command, not a hub router.

A hub would cost a `mode-registry.json`, a `hub-router.json`, a `command-metadata.json` and, per mode, a `SKILL.md`, `README.md`, `ROUTER.md` and `changelog/`. Compiled-route admission would also need at least one scored scenario per mode (`compiled-routing-architecture.md:80`). None of that prevents an observed failure.

The standalone shape is the required one from `sk-create-skill/SKILL.md:98-122`. Its `ROUTER.md` holds intents that load either `SKILL.md` or `references/overlays.md`. The overlay ability is the one command with agent-side knowledge beyond its YAML: what each sync state means, which file to edit and what a blocked apply asks of a person. That is why it gets the skill's one reference.

**When to promote to a hub:** when a second owned command needs agent-side workflow beyond its YAML. One such command is not a pattern.

The operator ruled for this standalone shape on 2026-11-06.

### The doctor commands: owned or left

Owned by `system-skilled-doctor`, ten existing plus one new, as the operator ruled ("Nine plus speckit", and `/doctor:mcp` "Into the new skill"):
- `/doctor:install`: puts Skilled into a project repository.
- `/doctor:symlink`: links a Skilled checkout into a project.
- `/doctor:update`: moves a project's checkout to a newer release.
- `/doctor:overlay` (new): keeps a vendored copy's local changes across a re-pin.
- `/doctor:agents-md`: embeds or restores Skilled's shipped sections in a project's `AGENTS.md`. Today it is tagged `sk-doc`, but it integrates Skilled into a project rather than authoring a document.
- `/doctor:runtime-mirrors`: checks that each runtime folder in a project matches `.skilled`.
- `/doctor:env`: shows and sets the environment switches Skilled reads in a project.
- `/doctor:setup`: runs the read-only setup checks across every doctor target and names each repair. It is the project's health entry point.
- `/doctor:helper`: maps a described problem to the doctor command that fits. It is the front door to the whole family.
- `/doctor:speckit`: checks that a project's trigger index is fresh and its retrieval recipes run. It moves from `system-spec-kit` by the operator's ruling.
- `/doctor:mcp`: installs and debugs Code Mode and its runtime registration in a project. It moves from `system-spec-kit` by the operator's ruling, rather than to `mcp-code-mode`.

Left with their domain skill:
- `/doctor:sk-code` stays with `sk-code`: it checks that skill's own battery and quality config.
- `/doctor:git` stays with `sk-git`: it switches that skill's hook gates and rules.
- `/doctor:ci` stays with `sk-code`: it manages GitHub Actions workflows, which are code, not Skilled integration.
- `/doctor:sk-skill` stays with `sk-doc`: it checks and converts skills against the authoring format sk-doc owns.
- `/doctor:skill-advisor` stays with `system-skill-advisor`: it tunes and rebuilds that skill's own graph.
- `/doctor:deep-loop` stays with `system-deep-loop`: it diagnoses that skill's own loop state.

### How existing command names keep working
No command file moves. `derive-command-bridges.cjs:22` reads doctor routers from the fixed `.skilled/commands/doctor/`, `_routes.yaml` lives there, and the runtime mirrors copy from there. The build changes one line in each of the ten owned command files, the `skill_agent` tag, and reruns the deriver, which writes `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py` and `render.ts` (`derive-command-bridges.cjs:25-47`). Four contract tests pin the old tag and change with it: `doctor-install-contract.test.cjs:170`, `doctor-helper-contract.test.cjs:122`, `doctor-symlink-contract.test.cjs:263` and `doctor-agents-md-contract.test.cjs:224`. The speckit and mcp contract tests pin no tag. The skill's `SKILL.md` lists the commands it owns and when to use each. Typing `/doctor:install` runs exactly what it runs today.

### Consequence: `system-spec-kit` owns no doctor command
All nine of its tags move. Its README doctor table (section 7, lines 564-574, headed "Seven doctor commands wrap the checks this skill owns") moves whole to `system-skilled-doctor`'s README, which adds rows for `/doctor:helper`, `/doctor:mcp`, `/doctor:agents-md` and `/doctor:overlay`. The `system-spec-kit` README keeps one sentence: `/doctor:speckit` and `/doctor:env` check this skill's trigger index and environment switches, and they are documented in `system-skilled-doctor`. The table moves rather than shrinks, because a shrunk table would list commands the skill no longer owns. The scripts those commands call stay in `system-spec-kit`: the trigger-index generator and lookup under `runtime/cli/retrieval/`, the runtime-mirror generators under `runtime/cli/runtime-mirrors/` and `runtime/ENV-REFERENCE.md`. Moving a command's owner does not move the code it runs. The doctor feature-catalog category under `system-spec-kit/feature-catalog/doctor-commands/` names no owner skill, so it stays and gains only the overlay row.

### The overlay command
`/doctor:overlay` has three targets.
- `status`, read-only: one line per destination that is not in sync, with its state and the fix. It also runs the full check, which a pre-commit hook can call. A `--guard <path>` query answers whether a path is owned.
- `apply`: applies overlays and captures a live edit with `--capture <path>`, under the engine's lock.
- `repin`: moves the vendored tree to a new upstream commit in one guarded run. `--stage <dir>` runs the same steps on a copy and writes nothing to the live tree. `--rollback <run>` restores a run's backup.

**The overlay-folder setting.** It lives in `.skilled-overlays.json` at the vendored tree root, as `{"overlayDir": "<path relative to the tree root>"}`. The default when the file is absent is `skilled-overlays/`. The one reader is `resolveOverlayDir(root)` in `overlay-engine.cjs`. The command workflows, the guard hook and a project's pre-commit line all call the engine and never read the setting themselves. It cannot live in `.skilled`, because a re-pin overwrites that folder, and it cannot live in the manifest, because the manifest sits inside the folder it would locate. Barter sets `{"overlayDir": "barter-overlays"}` and renames nothing.

### Key Components

Every piece below names the Barter failure or routing need it answers. A piece with neither is in the dropped list.

| Piece | Failure or need it answers | Evidence |
|-------|---------------------------|----------|
| `system-skilled-doctor` skill with `SKILL.md`, `ROUTER.md` and `references/overlays.md` | Install, link and update requests are credited to the spec-folder skill. Agents also need the overlay states and the edit-the-overlay rule, which Barter keeps in its own rule file | `skill_agent: system-spec-kit` in nine doctor routers, credited by `derive-command-bridges.cjs:141-152`. `barter-overlay-first.md:84-92` holds the state table |
| Engine `overlay-engine.cjs`, ported with all six scopes, layout links and the regenerate and verify steps | A re-pin re-copies the tree and erases every local change | `barter-overlays/README.md:8-16`. Each scope is in use: 88 file, 16 directory, 8 json-entry, 2 remove-root, 1 marked-section, 1 skill-root |
| One state source: apply and check both read the accepted hashes | A changed pinned overlay blocks replay because the destination still holds the last applied copy, so each re-pin needs `restore-pinned.cjs` | `replay.cjs:1190` and `:1242` call `planOverlay(entry, root)` with no accepted hashes. `sync.cjs:241` passes them. `restore-pinned.cjs:1-19` and `integrate.sh:68-70` are the workaround |
| A retained path that the overlay writes becomes an output and is guarded | sk-git `SKILL.md` sits in both `replace` and `retained`, so `status` reads clean while the live copy is stale, and the guard lets a live edit through | `replay.cjs:847` skips retained paths when building outputs. `sync.cjs` skips them in `destinationCandidates`. `overlay-sync-core.cjs:91-92` returns not-owned for them. The test fixture never puts a retained file in `replace` (`sync.test.cjs:124-126`) |
| The engine takes its own lock, and refuses while it is held | The lock is honoured only by scratch wrappers | `grep build-lock` over the engine, hooks and plugins prints 0 lines. `with-lock.sh:8` and `run-leaf.sh:31` take it |
| `repin` holds the lock from the copy to the first clean apply, with no clean-status precondition | `with-lock.sh` demands a clean `status`, which cannot hold between the copy and the first replay, so 034 wrote a second wrapper without the check | `with-lock.sh:13-14`, `with-lock-repin.sh:2-4`, 034 `facts.md:24` |
| `repin` backs up each path it will overwrite or delete, and `--rollback <run>` restores them | `skilled/` is untracked, so a re-pin overwrites files nothing can restore. The runbook's "restore from git" rollback does not exist | 034 `facts.md:19` and open question 1 at `facts.md:49` |
| `repin` refuses while an unowned file in the copied roots differs from the old pin | Edits made in place in the vendored tree are reverted by the next copy. Router fixes from program 033 came back with the old sentence | 034 `facts.md:20-22`: 36 routers edited in Skilled, 32 equal to Barter's in-place edits, 4 routers and the template reverted by the re-pin |
| `repin --stage <dir>` with a report of blocked overlays and of overlays that now equal upstream | Each re-pin hand-builds a dry tree and hand-inventories dead entries | 034 built `dry/` and `int/` with a 141-line `integrate.sh`, and hand-dropped 45 entries (`facts.md:29-30`) |
| `repin` copies changed paths for `.skilled` and whole runtime folders, with a manifest `repin.exclude` list (operator ruling: "keep both") | A whole-archive copy overwrites regenerated files and Barter's real `.opencode/scripts` folder, and `tar` exits 1 on it | `README.md:57-87` and the `.opencode/scripts` row at `README.md:135` |
| The operations of one json-entry set apply in order | A `setKeyOnItem` on an item added by the same set's `insertItems` failed on a fresh copy | 030 `implementation-summary.md:128` |
| The protected-name guard passes exact manifest paths only (operator ruling) | The guard refused Barter's `tokens.css` and was hand-patched with an extension list, which also lets any `.ts`, `.css` or `.svelte` token file through a walk | 034 `facts.md:23`, `facts.md:51`. `sync.cjs:89-101` now holds the patch |
| One configurable overlay-folder setting with one reader (operator ruling) | The hook core finds the folder by the hard-coded name `barter-overlays`, so no other project can reuse it | `overlay-sync-core.cjs:55-80` |
| Pre-write guard hook in `hook-registry.json`, inert without a manifest, calling the engine | A live edit to an owned file is lost at the next re-pin | `barter-overlay-first.md:33-37` |

### What Barter's copy shrinks to
Barter keeps `overlay-manifest.json`, its canonical sources, `sync-state.json`, its regenerate list, a new `.skilled-overlays.json` naming `barter-overlays`, a shortened `barter-overlay-first.md` that points at `/doctor:overlay`, the CLAUDE.md row, and the one line in its pre-commit hook that calls the check. These go: `replay.cjs` (1,324 lines), `sync.cjs` (728 lines), the three test files, `.skilled/hooks/overlay-sync/`, `.opencode/plugins/barter-overlay-sync.js`, `.hermes/plugins/barter-overlay-sync/`, the Pi layout link, the json-entry overlay that registers the hook, the seven-step runbook in `README.md`, and the scratch `restore-pinned.cjs`, `with-lock-repin.sh` and the stage half of `integrate.sh`.

### Dropped as overengineering
- **A parent hub with a mode per command.** Each command already owns its workflow, and the command bridges already route between them. See the shape section above.
- **Moving the command files into the skill folder.** The bridge deriver, `_routes.yaml` and the runtime mirrors all read the fixed doctor folder. Moving them breaks every one of those and prevents nothing.
- **Moving the doctor playbook and feature-catalog entries into the new skill.** They describe the commands, which do not move. Only the listing rows gain `/doctor:overlay`.
- **Teaching `/doctor:update` to handle a vendored tree.** Its engine is git-history based. A second model inside it costs more than a sibling command.
- **The post-edit auto-apply.** Dropped by the operator's ruling. It wrote the live tree outside any lock (`overlay-sync-core.cjs:193`), and `status` plus pre-commit already catch an unapplied overlay.
- **Shipping Barter's rule file upstream.** The reference and the refusal message carry what an agent needs. The operator kept this default ("keep both").
- **A command-line flag for the overlay folder beside the setting file.** Two settings would need two readers and a precedence rule.
- **Automatic stale-lock clearing or an `unlock` target.** No Barter run left a stale lock in the evidence. The refusal names the owner line and the file to remove.
- **Automatic rebase of blocked overlays.** The 034 rebases needed judgment (`facts.md:30-34`, open questions 6 and 7). The stage report lists them for a person.
- **A full-tree backup tar.** The paths the copy will touch are known before the first write, so backing up only those is enough.
- **Protecting `REPO RULES.md` and `AGENTS.md` with overlays.** `repin` copies only `.skilled` and the runtime folders, so the root files are never overwritten (`README.md:147-154`).
- **New scopes, a plugin interface for scopes, or user-defined scopes.** Barter's six scopes cover every overlay it has.

### Data Flow
`/doctor:overlay repin --upstream <dir> --to <commit>` resolves the overlay folder from the setting, takes the lock and checks that `status` shows no live or conflicting edits. It scans unowned files against the old pin, stages the new archive and lists the paths it will touch. Then it backs them up into a run folder, copies, sets the pin, applies twice, checks, and runs the manifest's regenerate and verify steps. A failure at any step after the backup leaves the run folder for `--rollback`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the task state for this design packet.

The build is a separate packet. `recommend-level.sh --loc 2200 --files 16 --architectural` prints `Recommended Level: 3 (Full)` with a phase score of 40 of 50, so it should be phased:
1. The skill and the tag move: scaffold `system-skilled-doctor` with `sk-create-skill`, move the ten `skill_agent` tags, update the four contract tests, regenerate the command bridges, and check advisor routing before and after.
2. The engine port with one state source, the retained-output fix, ordered json-entry operations, the exact-path guard rule, the overlay-folder setting and the owned lock, behind `/doctor:overlay status` and `apply`.
3. The `repin` target: stage, unowned-drift scan, backup, copy, apply, check and rollback.
4. The pre-write guard hook in the registry and its adapters. Barter's cutover follows as an ai-speckit packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

For this packet, the test is `validate.sh --strict` and a reread of each cited file and line. For the build, run the doctor contract tests and the command-bridge drift guard before and after the tag move. Port Barter's three test files first so the engine port is proven to keep behavior, then add one failing-first test per REQ-003 to REQ-013.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No package. The engine stays standard-library only, as Barter's `replay.cjs` is (`replay.cjs:28`). `repin` needs `git` and a local Skilled checkout that holds both commits.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This packet writes only its own folder. Delete `specs/other/003-vendored-overlays-and-repin/` to undo it.
<!-- /ANCHOR:rollback -->

---
