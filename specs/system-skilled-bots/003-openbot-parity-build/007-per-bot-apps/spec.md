---
title: "Feature Specification: Phase 7: per-bot-apps"
description: "Gives a bot a declared list of connector servers instead of the whole repository-wide UTCP config, writes a filtered config into each run folder, records the honored names on the run record, and fails the definition checker closed on a name the config does not hold."
trigger_phrases:
  - "per bot apps"
  - "phase 7 per bot apps"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: per-bot-apps

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-25 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 10 |
| **Predecessor** | 006-approval-grants |
| **Successor** | 008-vault |
| **Handoff Criteria** | A run record carries `posture.apps`, the run folder holds the filtered config, a worktree run's tree root holds the same file, and `apps-unknown-server` is a hard checker invariant with a defect fixture. 008-vault injects secrets into the same per-run config, so it needs that file to exist and its path to reach the child. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification.

**Scope Boundary**: The first of the two slices research §9 names. It covers the `apps:` key, the per-run filtered UTCP config, `HonoredPosture.apps` and the `apps-unknown-server` checker invariant. It stops before any secret: the vault slice is phase 8. `apps` is a filter, not a sandbox: it narrows the server list the run's config names, and it confines no child that reads a config from another path.

**Dependencies**:
- Phase 001, whose run records carry the posture block this phase extends.
- The deep-loop executor dispatch-env gate, which decides whether a caller-named key reaches a child at all.

**Deliverables**:
- An `apps:` frontmatter key parsed into the definition's posture block.
- A filtered UTCP config written into each run folder, holding only the declared servers.
- `HonoredPosture.apps` on every run record.
- The `apps-unknown-server` hard invariant in the definition checker, with a defect fixture.
- Five design documents under `design/`, which fix every field, the gate order, the refusal detail text, the fixture matrix and the text an operator reads. A builder needs no design decision beyond them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every bot reaches every connector server the repository configures, because one repository-wide UTCP config is the only config any run reads. A bot that only needs to file an issue can also reach the browser drivers, the design tools and the project tracker, and nothing in the definition, the run record or the checker says which servers a bot was meant to use. The research names the gap as the missing per-bot grant: "Today every bot can reach every configured server." [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/research.md:131]

### Purpose
A bot declares the servers it may reach, each run gets a config holding only those, and the run record says which ones were honored.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

The repository-wide config holds 14 servers, and no runtime module or checker line mentions `apps`:

```text
$ python3 -c "import json;d=json.load(open('.utcp_config.json'));print(len(d['manual_call_templates']),'servers')"
14 servers
$ grep -rc 'apps' .skilled/skills/system-skilled-bots/runtime/lib/*.ts | grep -v ':0'
$ grep -c 'apps' .skilled/skills/system-skilled-bots/scripts/bot-check.cjs
0
```

A definition that declares the key is refused today, because the parser's key set does not hold it:

```text
$ node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs <copy of scripts/fixtures/clean with "apps: [github]" added>
PASS: config: bots/config.json reads cleanly
PASS: identity: local/tool (from config)
FAIL: definition.unknown-key: bots/nightly-digest/BOT.md: unknown-key (apps)
exit=1
```

The same fixture without the key passes every invariant and exits 0, so the refusal is the key and not the fixture. The 14-server count is the surface a per-bot grant has to narrow, and the `unknown-key` refusal is the state REQ-001 replaces.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an `apps:` frontmatter key that parses as a list of server names into the definition's posture block, and refuse a malformed list.
- Add a runtime module that reads the repository's `.utcp_config.json`, refuses a declared name the config does not hold, and writes a filtered copy into the run folder and, for a run with its own worktree, into the worktree root.
- Record the honored names as `HonoredPosture.apps` on every run record, `[]` when the bot declares none, and set `UTCP_CONFIG_FILE` in the child environment to the run's filtered config, admitting that key through a per-dispatch key list on the deep-loop executor.
- Add `apps-unknown-server` to the checker's hard invariants, with a defect fixture and a test row.
- Carry `apps: null` in the authoring template and name the field and the invariant in the author reference and the feature catalog.

### Out of Scope
- **Removing the five project MCP config pins.** `.mcp.json`, `.claude/mcp.json`, `.codex/config.toml`, `opencode.json` and `.cursor/mcp.json` each set `UTCP_CONFIG_FILE` to `.utcp_config.json` explicitly, and an explicit value in an MCP server block overrides the inherited one. [SOURCE: .mcp.json:9] [SOURCE: .claude/mcp.json:9] [SOURCE: .codex/config.toml:17] [SOURCE: opencode.json:29] [SOURCE: .cursor/mcp.json:9] The pins stay, and the `/doctor:mcp` wiring check that asserts them stays with them. [SOURCE: .skilled/commands/doctor/scripts/mcp-doctor-lib.sh:291] What makes a pin resolve to the filtered file is the worktree write REQ-003 adds: the child's working directory is the run's worktree, so `<worktree>/.utcp_config.json` is the file the pin already names. A run with no worktree has nowhere to place that file without dirtying the checkout, so REQ-005 refuses it. A shared run that declares no `apps` is the limit the risk table names: its pin resolves against the checkout, so its child reads the repository config and reaches every server. `apps` stays a filter, not a sandbox: a child that reads a config from another path is not confined by this phase.
- **The vault.** `bots secret set`, a keychain or 0600 store, child-environment injection and `HonoredPosture.secretsUsed` are phase 8, which the research lands after this slice because it is the one that can leak. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:77]
- **A connector registry or catalogue.** The UTCP config already names the servers this team has, so a second registry would restate it. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/research.md:324]
- **Per-action grants.** OpenBot grants per action per bot. This phase grants per server per bot. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/research.md:115-116]
- **A migration for existing bots.** `apps:` absent means no servers, which is the fail-closed default for a run with its own worktree. This repository has no `bots/` folder, so no definition changes meaning. A shared run is the exception the risk table names: its child reads the repository config through the project pin, so `apps` narrows a worktree run only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modify | Add `apps` to the frontmatter key set and parse it into `Posture.apps` |
| `.skilled/skills/system-skilled-bots/runtime/lib/apps.ts` | Create | Read the repository UTCP config, resolve the declared names, write the filtered copy into the run folder and the worktree root |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify | Add `apps: string[]` to `HonoredPosture` |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Resolve and write the config before dispatch, record the names, set the child key on `extraEnv`, restore the tree's own file after the child exits and at the next open of a tree that holds the filtered one, add the `apps-refused` and `apps-unenforceable` causes |
| `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts` | Modify | Seed `apps: []` in the posture object it builds, so the runner's assignment keeps the field |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modify | `DispatchInput` gains `extraEnv?: Record<string, string>`, and `dispatchInLineage` merges it into `dispatchEnv` and passes its keys as `dispatchEnvKeys` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Take a per-dispatch key list, admit `UTCP_CONFIG_FILE` through it and bound every entry it admits |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modify | Add `apps-unknown-server` to the hard invariants and run the apps predicate |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server/` | Create | A defect fixture whose bot declares a server the config does not hold, with its own `.utcp_config.json` holding the one name it does |
| `.skilled/skills/system-skilled-bots/runtime/tests/apps.vitest.ts` | Create | The filter, the refusals, the written file, the worktree write and the killed-run restore |
| `.skilled/skills/system-skilled-bots/runtime/tests/runner.vitest.ts` | Modify | Extend the exact-shape posture assertion with `apps` |
| `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts` | Modify | One row for the new defect fixture |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modify | Carry `apps: null` with its default in a comment |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modify | Name the field in the template list and the shared-run limit |
| `.skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md` | Modify | Name the field in the field list |
| `.skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md` | Modify | Name the invariant in the hard-invariant list |
| `design/records.md` | Create | Every field this phase adds or writes, with its type, null rule, absent-key default and version rule |
| `design/state-machines.md` | Create | The declaration lifecycle, the gate order, the worktree file lifecycle and three sequences, in Mermaid |
| `design/refusals.md` | Create | The six names, their detail text, their precedence and what the operator sees |
| `design/fixtures.md` | Create | The declaration by config-state matrix, the goldens and the checker defect fixture's literal tree |
| `design/fixtures/*.json` | Create | Five goldens: the source config, two filtered copies and two posture blocks |
| `design/mockups.md` | Create | The literal text of every surface this phase changes, and the surfaces it leaves alone |

### Design Documents

Five documents under `design/` fix what the requirements state in one sentence each. A builder reads them before writing code, and a disagreement between one of them and this file is a defect in this file.

| Document | What it fixes | Requirement it serves |
|----------|---------------|-----------------------|
| [`design/records.md`](design/records.md) | Every field this phase adds or writes: the `apps:` key, `Posture.apps`, `posture.apps`, the four top-level keys of the filtered config with the one rewrite, the worktree copy, the child key and the checker line, each with its type, null rule, absent-key default and version rule | REQ-001 to REQ-006 |
| [`design/state-machines.md`](design/state-machines.md) | The declaration lifecycle, the eleven-step gate order with the refusal at each step, the worktree file lifecycle from write to restore including the killed-run case and three Mermaid sequences | REQ-002, REQ-003, REQ-005, REQ-006 |
| [`design/refusals.md`](design/refusals.md) | The six names with their layer, class, exit and registry entry, the exact detail string each carries, the precedence when two apply and what the operator sees | REQ-001, REQ-002, REQ-005, REQ-007 |
| [`design/fixtures.md`](design/fixtures.md) | The declaration by config-state matrix with one row per case, the five goldens beside it and the checker defect fixture's literal tree | REQ-002, REQ-003, REQ-006 |
| [`design/mockups.md`](design/mockups.md) | The literal checker output, the four refusal lines, the record as `jq` prints it, the template block and the author reference line | REQ-006, REQ-008, REQ-009 |

The packet's contracts own the shapes more than one phase writes, and these documents cite them rather than copying them: the run record's field table and the version rules are [`contracts/records.md`](../contracts/records.md) section 4 and [`contracts/versioning.md`](../contracts/versioning.md) section 1, the refusal columns are [`contracts/refusals.md`](../contracts/refusals.md) section 3.6, the module's group and imports are [`contracts/runtime-architecture.md`](../contracts/runtime-architecture.md) section 1.2, and the shared-run record is [`contracts/decisions.md`](../contracts/decisions.md) D5.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `apps:` parses as a list of non-empty strings into `Posture.apps`. Absent or `null` yields `null`, and a non-list or an empty-string entry is refused as `apps-invalid`. |
| REQ-002 | A declared name that is not a `manual_call_templates[].name` in the checkout's `.utcp_config.json` is refused as `apps-unknown-server`, and the refusal detail names every unknown name. |
| REQ-003 | Every run writes `<runFolder>/utcp.json` before dispatch, holding the repository config's top-level keys with `manual_call_templates` filtered to the honored names, which is empty when the bot declares none. A run that declares nothing writes `{"manual_call_templates": []}` without reading the source config, so a missing or unparsable config never widens it. That copy is the run's evidence and the file `UTCP_CONFIG_FILE` names. It is not the file a shared run's child reads, because the project pin resolves against the child's working directory. For a run with its own worktree the filtered config is also written to `<worktree>/.utcp_config.json`, which is the path the project MCP config pins name, so the pin resolves to the filtered file without touching the pins or the doctor check. The runner restores the tree's own file after the child exits, so the working tree the operator commits holds the repository config, and a commit the child makes during the run is not rewritten. A tree found holding the filtered file at the next open is restored before anything else is written, which covers a run killed between the write and the restore. Each `load_variables_from` entry keeps its loader type and its `env_file_path` is written as the absolute path it resolves to from the source config's folder, because a relative path's base is the config file's own folder and the copy sits elsewhere. |
| REQ-004 | Every run record carries `posture.apps`: the honored names, or `[]` when the bot declares none. |
| REQ-005 | The child environment carries `UTCP_CONFIG_FILE` set to the absolute path of the run's filtered config. `DispatchInput` gains `extraEnv?: Record<string, string>`, `dispatchInLineage` merges it into `dispatchEnv` and passes its keys as `dispatchEnvKeys`, and the runner passes exactly `UTCP_CONFIG_FILE` for the one file it wrote. `runAuditedExecutorCommand` takes `dispatchEnvKeys?: string[]` alongside `dispatchEnv`, and `assertDispatchEnvAllowed` admits an entry only when it equals `UTCP_CONFIG_FILE` or matches `^SKILLED_BOT_SECRET_[A-Z0-9_]+$`, so the caller names the key and the gate bounds the namespace. The key is inherited by every run and the project pin overrides it, so the worktree copy REQ-003 writes is what makes a child read the filtered file. A run without its own worktree that declares `apps` is refused `apps-unenforceable` with class `author`, because the filtered file cannot be placed without dirtying the checkout. |
| REQ-006 | The checker reports `apps-unknown-server` as a hard invariant, prints one `FAIL:` line naming it, and exits 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | A run whose `apps` cannot be honored is refused before dispatch as `apps-refused` with failure class `author`, and writes no filtered config. A run with no worktree is the separate `apps-unenforceable` refusal REQ-005 names. |
| REQ-008 | `assets/bot-template.txt` carries `apps: null` with its default named in a comment, so a copied template declares no server. |
| REQ-009 | `bots-author/references/bot-definition.md` and the two feature-catalog files name the `apps` field and the `apps-unknown-server` invariant, and the author reference names the shared-run limit: `apps` narrows a run with its own worktree, a shared run reads the repository config, and a shared bot that declares `apps` is refused `apps-unenforceable`. |
| REQ-010 | The five documents under `design/` fix every field this phase adds or writes, the eleven-step gate order, the worktree file's four states including the killed-run restore, the six refusal names with their detail text and precedence, the declaration by config-state matrix with its goldens and the literal text of every surface an operator or an author reads. Every verify command in them runs with no tty and prints what the document says. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` prints a line starting `FAIL: apps-unknown-server:` and exits 1.
- **SC-002**: A run of a bot declaring `apps: [github]` leaves `<runFolder>/utcp.json` whose `manual_call_templates` holds exactly one entry, named `github`, and its record's `posture.apps` is `["github"]`.
- **SC-003**: A run of a bot declaring no `apps` leaves `<runFolder>/utcp.json` whose `manual_call_templates` is empty, and its record's `posture.apps` is `[]`.
- **SC-004**: `npm test` in `.skilled/skills/system-skilled-bots/runtime` passes with `apps.vitest.ts` and the new `bot-check.vitest.ts` row.
- **SC-005**: `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/clean` still exits 0, so the new invariant refuses nothing the old checker passed.
- **SC-006**: A worktree run of a bot declaring `apps: [github]` leaves `<worktree>/.utcp_config.json` whose `manual_call_templates` holds exactly one entry, named `github`, and the working tree's own file is back once the run ends.
- **SC-007**: A run of a bot declaring `apps` with `isolation: shared` is refused `apps-unenforceable` with class `author` and exit 4, and writes no filtered config.
- **SC-008**: A shared run of a bot declaring no `apps` writes `<runFolder>/utcp.json` with an empty `manual_call_templates` and records `posture.apps: []`, and the author reference names that its child still reads the repository config.
- **SC-009**: A worktree left holding the filtered file by a run killed before the restore has its own `.utcp_config.json` back at the next open of that tree, before the next run writes anything.
- **SC-010**: The five design documents exist and every verify command in them runs with no tty and prints what the document says.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The deep-loop executor dispatch-env gate | A key it does not admit never reaches a child, so the filtered config would be written and unread | Add `dispatchEnvKeys` to `runAuditedExecutorCommand` and name `UTCP_CONFIG_FILE` in it, so the key is admitted per dispatch rather than by a prefix or a widened kind list. Prove it with a test that reads the call `runAuditedExecutorCommand` receives and a second test that an unlisted key is still refused |
| Dependency | The repository's `.utcp_config.json` | A missing or malformed config leaves no server names to check against | Refuse as `utcp-config-missing` or `utcp-config-invalid` when `apps` is declared, and pass when it is not |
| Risk | An absent `apps:` silently narrows a bot that used to reach everything | Medium: a bot loses a connector with no error at the call site | Fail closed by design, and name the change in the template comment and the author reference. This repository has no `bots/` folder, so nothing changes meaning today |
| Risk | A run with no worktree cannot place the filtered config where the pin looks | Medium: the child would read the repository config and reach every server | Refuse `apps-unenforceable` with class `author` before dispatch, so a bot that declares `apps` and runs in the checkout fails loudly rather than silently reaching everything |
| Risk | A shared run that declares no `apps` still reaches every server | Medium: `apps` narrows a worktree run only, so an author who omits the key on a shared bot believes it is narrowed when it is not | Named limit, not a silent one: the run-folder copy is written and the record says `posture.apps: []`, the author reference names the limit, and the pin is what a shared run's child reads, so closing it needs the pin change this phase keeps out of scope |
| Risk | `cli-mistral-vibe` starts its child in a temporary lineage folder, so the relative pin resolves inside that folder and the child reads neither the filtered file nor the checkout's config | Medium: `apps` narrows the eight kinds whose child starts in the tree and not this one | Named limit, not a silent one: `design/records.md` section 5.1 gives one row per executor kind with its config file, its pin, its child working directory and which file wins, and the author reference names the shared-run limit |
| Decision | D5 in [`contracts/decisions.md`](../contracts/decisions.md) confirms the shared-run record as designed | The record says `posture.apps: []` while the child reads the full repository config, and a shared run that declares `apps` is refused `apps-unenforceable` | Accepted, not mitigated: the limit is stated in the author reference, proven by a test on purpose and named in the row above. A later packet that removes the pin is the only thing that closes it |
| Risk | The worktree write replaces the tree's tracked `.utcp_config.json`, so the tree is dirty by one file | Medium: an operator commit could carry the filtered config | The runner restores the tree's own file after the child exits, so the working tree the operator commits holds the repository config. A commit the child makes during the run is not rewritten and the restore cannot reach it. The bounded impact is that the committed file holds a subset of the servers and no credential, so it narrows a later run rather than leaking one |
| Risk | A run killed between the worktree write and the restore leaves the filtered file in its tree | Medium: the next run of that bot would read the narrowed file as the repository config and honor a subset of the servers it declared | The next open of a tree that holds the filtered file restores the tree's own file before anything else is written, so the filtered copy is never the base a later run copies from. A child that committed the filtered file leaves the index holding it, which is the row above |
| Risk | The filtered copy drifts from the repository config's shape | Low: a server entry the filter drops or reshapes breaks a connector | Copy every top-level key verbatim and filter only `manual_call_templates`, so the shape is the source file's. The one rewrite is `load_variables_from`'s `env_file_path`, which REQ-003 makes absolute |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Resolving and writing the filtered config adds under 20 ms to a run, measured as one file read and one file write on a 14-server config.
- **NFR-P02**: The filtered config is written once per run, before dispatch, and never rewritten during the run.

### Security
- **NFR-S01**: The filtered config holds no credential value: it resolves no variable and copies no value, and the `load_variables_from` block REQ-003 rewrites keeps pointing at the same dotenv file, so no secret enters the file.
- **NFR-S02**: A declared name the config does not hold is refused, never dropped, so a typo cannot silently widen or narrow reach.

### Reliability
- **NFR-R01**: A refusal to resolve or write the config leaves the run refused before dispatch, so no child starts with a config the runner did not write.
- **NFR-R02**: A run record written before this phase, with no `posture.apps`, still validates, because the record validator checks the posture block's shape and not its keys.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `apps: []` is a declared empty list, so a worktree run writes a config with no servers and records `posture.apps: []`. It is not the same as absent, which also yields `[]` but leaves `Posture.apps` `null`. A shared run that declares `apps: []` is still refused `apps-unenforceable`, because the declaration is not `null` and the run has nowhere to place the file.
- Maximum input: all 14 names declared yields a filtered config identical to the repository config's `manual_call_templates`, in the source order.
- Failure path: a name the config does not hold exits the checker 1 with `FAIL: apps-unknown-server:`, and refuses the run as `apps-refused` with class `author` and exit 4.
- No worktree: a bot declaring `apps` and `isolation: shared` is refused `apps-unenforceable` with class `author` before dispatch, so no filtered config is written and no child starts. A shared bot that declares no `apps` runs, writes the run-folder copy and records `[]`, and its child reads the repository config through the pin, which is the limit the risk table names.
- Killed before the restore: a run killed between the worktree write and the restore leaves the filtered file in its tree. The next open of that tree compares the tree's file with the checkout's, restores the tree's own file from the tree's index when the two differ, and writes nothing when they are equal. The filtered copy is therefore never the base a later run copies from.
- A config with no `manual_call_templates` key: every declared name is unknown, so the refusal is `apps-unknown-server` and not `utcp-config-invalid`. One rule covers "the config does not hold this name".
- A name differing only by case, or a name that is a prefix of another: both are different names, so both are refused. The match is exact and case-sensitive.
- A duplicate name in the declaration: it resolves once and the honored list holds it once, because the honored list follows the config's order and not the declaration's.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | One new module, four modified runtime files, one shared per-dispatch key list, one checker invariant, one fixture, two test files and five design documents |
| Risk | 12/25 | A fail-closed default that changes what a bot reaches, and a shared dispatch-env gate every executor kind reads |
| Research | 8/20 | The research names the slice and its size. The project-config pin and the doctor predicate it breaks needed discovery |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does an absent `apps:` mean no servers or all servers? Decision: no servers, because the research calls the mechanism a whitelist that fails closed. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/research.md:289]
- Should the five project MCP configs stop pinning `UTCP_CONFIG_FILE` in this phase? Decision: no. The pins stay, and the worktree write REQ-003 adds is what makes a pin resolve to the filtered file, so removing them is neither needed nor in scope.
- Should the filtered config keep the repository config's `load_variables_from` block? Decision: yes, with each `env_file_path` made absolute. The block names a dotenv file and holds no value, and dropping it would change how a server resolves its own variables. A relative path's base is the config file's own folder, and the copy sits in the run folder, so the path is written absolute to keep it pointing at the same file.
- How does the next open of a tree know its file is the filtered one? Decision: it compares the tree's `.utcp_config.json` with the checkout's. When the two differ, the tree's file is not the repository config, so it is restored from the tree's own git index before anything else is written. A marker file would be a second thing a killed run leaves behind, and the index is already the tree's own answer to what that file should hold. `design/state-machines.md` section 3 draws the four states.
- Does the filtered config carry a version key of its own? Decision: no. The copy carries the source config's top-level keys verbatim, so a `schemaVersion` would be a key the source does not hold and would make the copy a different shape from the file the Code Mode server already reads. The file's version is the source config's shape.
- Does the checker fail when the checkout has no `.utcp_config.json`? Decision: no. The invariant is about a name the config does not hold, and a config that is not there holds no name to compare, so the checker prints `INFO: apps-unknown-server: <path> is not there, so no server name can be checked` and the runner refuses the run as `apps-refused`. A definition defect and a checkout defect are two different things and the checker audits the first. `design/records.md` section 7 fixes the line.
- Does the per-run filter compare a tool name before or after it is normalised? UNKNOWN. The research left it open with no verified answer. This phase filters whole `manual_call_templates` entries by `name`, exactly and case-sensitively (`design/records.md` section 4.1). It compares no tool name. The question matters only if Code Mode rewrites a server name before it prefixes that server's tools, for example a hyphen to an underscore. Then an `apps:` entry written in the rewritten form would be refused `apps-unknown-server`, and the author would have no way to tell. Settle it before this phase is dispatched: declare a server whose name holds a hyphen and read the tool names its child lists.
<!-- /ANCHOR:questions -->

---
