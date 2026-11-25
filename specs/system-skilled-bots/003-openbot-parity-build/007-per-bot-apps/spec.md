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
- **Per-action grants.** OpenBot grants per action per bot; this phase grants per server per bot. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/research.md:115-116]
- **A migration for existing bots.** `apps:` absent means no servers, which is the fail-closed default for a run with its own worktree. This repository has no `bots/` folder, so no definition changes meaning. A shared run is the exception the risk table names: its child reads the repository config through the project pin, so `apps` narrows a worktree run only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modify | Add `apps` to the frontmatter key set and parse it into `Posture.apps` |
| `.skilled/skills/system-skilled-bots/runtime/lib/apps.ts` | Create | Read the repository UTCP config, resolve the declared names, write the filtered copy into the run folder and the worktree root |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modify | Add `apps: string[]` to `HonoredPosture` |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify | Resolve and write the config before dispatch, record the names, set the child key, add the `apps-refused` and `apps-unenforceable` causes |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Take a per-dispatch key list and admit `UTCP_CONFIG_FILE` through it |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Modify | Add `apps-unknown-server` to the hard invariants and run the apps predicate |
| `.skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server/` | Create | A defect fixture whose bot declares a server the config does not hold |
| `.skilled/skills/system-skilled-bots/runtime/tests/apps.vitest.ts` | Create | The filter, the refusals and the written file |
| `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts` | Modify | One row for the new defect fixture |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modify | Carry `apps: null` with its default in a comment |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modify | Name the field in the template list |
| `.skilled/skills/system-skilled-bots/feature-catalog/definition/bot-definition-contract.md` | Modify | Name the field in the field list |
| `.skilled/skills/system-skilled-bots/feature-catalog/definition/definition-checker.md` | Modify | Name the invariant in the hard-invariant list |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `apps:` parses as a list of non-empty strings into `Posture.apps`; absent or `null` yields `null`, and a non-list or an empty-string entry is refused as `apps-invalid`. |
| REQ-002 | A declared name that is not a `manual_call_templates[].name` in the checkout's `.utcp_config.json` is refused as `apps-unknown-server`, and the refusal detail names every unknown name. |
| REQ-003 | Every run writes `<runFolder>/utcp.json` before dispatch, holding the repository config's top-level keys with `manual_call_templates` filtered to the honored names, which is empty when the bot declares none. That copy is the run's evidence and the file `UTCP_CONFIG_FILE` names; it is not the file a shared run's child reads, because the project pin resolves against the child's working directory. For a run with its own worktree the filtered config is also written to `<worktree>/.utcp_config.json`, which is the path the project MCP config pins name, so the pin resolves to the filtered file without touching the pins or the doctor check; the runner restores the tree's own file after the child exits, so the working tree the operator commits holds the repository config, and a commit the child makes during the run is not rewritten. Each `load_variables_from` entry keeps its loader type and its `env_file_path` is written as the absolute path it resolves to from the source config's folder, because a relative path's base is the config file's own folder and the copy sits elsewhere. |
| REQ-004 | Every run record carries `posture.apps`: the honored names, or `[]` when the bot declares none. |
| REQ-005 | The child environment carries `UTCP_CONFIG_FILE` set to the absolute path of the run's filtered config. `runAuditedExecutorCommand` takes `dispatchEnvKeys?: string[]` alongside `dispatchEnv`, `assertDispatchEnvAllowed` accepts a key that is in the kind's list or in that array, and the runner passes exactly `UTCP_CONFIG_FILE` for the one file it wrote. The key is inherited by every run and the project pin overrides it, so the worktree copy REQ-003 writes is what makes a child read the filtered file. A run without its own worktree that declares `apps` is refused `apps-unenforceable` with class `author`, because the filtered file cannot be placed without dirtying the checkout. |
| REQ-006 | The checker reports `apps-unknown-server` as a hard invariant, prints one `FAIL:` line naming it, and exits 1. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | A run whose `apps` cannot be honored is refused before dispatch as `apps-refused` with failure class `author`, and writes no filtered config; a run with no worktree is the separate `apps-unenforceable` refusal REQ-005 names. |
| REQ-008 | `assets/bot-template.txt` carries `apps: null` with its default named in a comment, so a copied template declares no server. |
| REQ-009 | `bots-author/references/bot-definition.md` and the two feature-catalog files name the `apps` field and the `apps-unknown-server` invariant, and the author reference names the shared-run limit: `apps` narrows a run with its own worktree, a shared run reads the repository config, and a shared bot that declares `apps` is refused `apps-unenforceable`. |

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
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The deep-loop executor dispatch-env gate | A key it does not admit never reaches a child, so the filtered config would be written and unread | Add `dispatchEnvKeys` to `runAuditedExecutorCommand` and name `UTCP_CONFIG_FILE` in it, so the key is admitted per dispatch rather than by a prefix or a widened kind list; prove it with a test that reads the environment handed to the dispatch and a second test that an unlisted key is still refused |
| Dependency | The repository's `.utcp_config.json` | A missing or malformed config leaves no server names to check against | Refuse as `utcp-config-missing` or `utcp-config-invalid` when `apps` is declared, and pass when it is not |
| Risk | An absent `apps:` silently narrows a bot that used to reach everything | Medium: a bot loses a connector with no error at the call site | Fail closed by design, and name the change in the template comment and the author reference; this repository has no `bots/` folder, so nothing changes meaning today |
| Risk | A run with no worktree cannot place the filtered config where the pin looks | Medium: the child would read the repository config and reach every server | Refuse `apps-unenforceable` with class `author` before dispatch, so a bot that declares `apps` and runs in the checkout fails loudly rather than silently reaching everything |
| Risk | A shared run that declares no `apps` still reaches every server | Medium: `apps` narrows a worktree run only, so an author who omits the key on a shared bot believes it is narrowed when it is not | Named limit, not a silent one: the run-folder copy is written and the record says `posture.apps: []`, the author reference names the limit, and the pin is what a shared run's child reads, so closing it needs the pin change this phase keeps out of scope |
| Risk | The worktree write replaces the tree's tracked `.utcp_config.json`, so the tree is dirty by one file | Medium: an operator commit could carry the filtered config | The runner restores the tree's own file after the child exits, so the working tree the operator commits holds the repository config. A commit the child makes during the run is not rewritten and the restore cannot reach it; the bounded impact is that the committed file holds a subset of the servers and no credential, so it narrows a later run rather than leaking one |
| Risk | The filtered copy drifts from the repository config's shape | Low: a server entry the filter drops or reshapes breaks a connector | Copy every top-level key verbatim and filter only `manual_call_templates`, so the shape is the source file's; the one rewrite is `load_variables_from`'s `env_file_path`, which REQ-003 makes absolute |
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

- Empty input: `apps: []` is a declared empty list, so the run writes a config with no servers and records `posture.apps: []`; it is not the same as absent, which also yields `[]` but leaves `Posture.apps` `null`.
- Maximum input: all 14 names declared yields a filtered config identical to the repository config's `manual_call_templates`, in the source order.
- Failure path: a name the config does not hold exits the checker 1 with `FAIL: apps-unknown-server:`, and refuses the run as `apps-refused` with class `author` and exit 4.
- No worktree: a bot declaring `apps` and `isolation: shared` is refused `apps-unenforceable` with class `author` before dispatch, so no filtered config is written and no child starts. A shared bot that declares no `apps` runs, writes the run-folder copy and records `[]`, and its child reads the repository config through the pin, which is the limit the risk table names.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One new module, four modified runtime files, one shared per-dispatch key list, one checker invariant, one fixture and two test files |
| Risk | 12/25 | A fail-closed default that changes what a bot reaches, and a shared dispatch-env gate every executor kind reads |
| Research | 8/20 | The research names the slice and its size; the project-config pin and the doctor predicate it breaks needed discovery |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does an absent `apps:` mean no servers or all servers? Decision: no servers, because the research calls the mechanism a whitelist that fails closed. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/lineages/vibe-2/research.md:289]
- Should the five project MCP configs stop pinning `UTCP_CONFIG_FILE` in this phase? Decision: no. The pins stay, and the worktree write REQ-003 adds is what makes a pin resolve to the filtered file, so removing them is neither needed nor in scope.
- Should the filtered config keep the repository config's `load_variables_from` block? Decision: yes, with each `env_file_path` made absolute. The block names a dotenv file and holds no value, and dropping it would change how a server resolves its own variables. A relative path's base is the config file's own folder, and the copy sits in the run folder, so the path is written absolute to keep it pointing at the same file.
<!-- /ANCHOR:questions -->

---
