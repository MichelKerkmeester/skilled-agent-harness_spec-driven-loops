---
title: "Feature Specification: Phase 2: hub-two-mode-wiring"
description: "The system-deep-loop hub registers ai-council as a third workflow mode on its registry, router, root ROUTER.md, graph metadata and command metadata, and ships a /deep:ai-council command with six runtime mirrors. This child removes the mode from every hub routing surface, deletes the deep command and the mode packet and keeps the packet changelog as a real folder."
trigger_phrases:
  - "hub two mode wiring"
  - "phase 2 hub two mode wiring"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: hub-two-mode-wiring

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-standalone-agent-and-council-command |
| **Successor** | 003-runtime-council-removal |
| **Handoff Criteria** | Child 003 starts when the registry prints `research review`, `parent-skill-check.cjs` with the hub path prints `declares 2 modes` and `OK: parent-skill-check`, and `git ls-files .skilled/skills/system-deep-loop/deep-ai-council` prints nothing. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the ai-council mode deprecation, which retires `ai-council` as a `system-deep-loop` mode and keeps the council as a standalone agent.

**Scope Boundary**: The hub routing surfaces of `system-deep-loop`, its human-facing docs, catalogs, playbooks and shared files, the `deep-ai-council/` packet, the `/deep:ai-council` command set with its compiled and legacy copies and its six runtime mirrors, and the council sibling lines in research and review prose. Runtime libraries and advisor entries are out.

**Dependencies**:
- Child 001 is Complete, so the agent no longer reads a packet file and `/speckit:ai-council` exists.
- Parent decision D6: wiring changes follow `.skilled/repo-rules/skill-hub-routing.md`.

**Deliverables**:
- A two-mode hub on the registry, router, root `ROUTER.md`, graph metadata, command metadata, description and leaf manifest, with the per-hub gate green.
- No `/deep:ai-council` command in `.skilled/commands/deep/` or any runtime folder.
- The packet deleted and its changelog kept at `.skilled/changelog/system-deep-loop/deep-ai-council/` as a real folder.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hub still registers `ai-council` as a workflow mode, so a council request routes into `system-deep-loop`. The registry lists three modes and a `council` loop type, the router and root `ROUTER.md` carry council signals, and `/deep:ai-council` is mirrored to six runtime folders. The packet changelog is reachable only through a tracked symlink into the packet, so deleting the packet as it stands would break that path.

### Purpose
The hub routes only research and review on every routing surface, and the council mode packet and deep command are gone.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only command and its verbatim output:

```text
$ node -e 'const r=require("./.skilled/skills/system-deep-loop/mode-registry.json");console.log(r.modes.map(m=>m.workflowMode).join(" "), "|", r.extensions["runtime-loop"].runtimeLoopTypes.join(" "))'; rg -c -i 'council' .skilled/skills/system-deep-loop/hub-router.json .skilled/skills/system-deep-loop/ROUTER.md .skilled/skills/system-deep-loop/graph-metadata.json .skilled/skills/system-deep-loop/command-metadata.json .skilled/skills/system-deep-loop/description.json; git ls-files .skilled/skills/system-deep-loop/deep-ai-council | wc -l; git ls-files -s .skilled/changelog/system-deep-loop/deep-ai-council; ls .skilled/skills/system-deep-loop/deep-ai-council/changelog | wc -l; git ls-files .skilled/commands/deep | rg -c 'ai-council'; find -L .claude/commands .cursor/commands .opencode/commands .codex/prompts .pi/prompts .dsh/prompts -maxdepth 2 \( -iname '*deep-ai-council*' -o -path '*/deep/ai-council.md' \) | wc -l
research review ai-council | research review council
.skilled/skills/system-deep-loop/graph-metadata.json:22
.skilled/skills/system-deep-loop/ROUTER.md:16
.skilled/skills/system-deep-loop/description.json:4
.skilled/skills/system-deep-loop/hub-router.json:6
.skilled/skills/system-deep-loop/command-metadata.json:12
     141
120000 49d2dcbd1bdf0e5698a79131f53dabee49874a58 0	.skilled/changelog/system-deep-loop/deep-ai-council
      20
6
       6
```

Run from the repository root at `81faa4614c` on 2026-11-14. The registry holds three modes and three loop types. Five hub metadata files name the council on 60 lines in all. The packet holds 141 tracked files. The changelog path is a symlink, mode `120000`, and the packet changelog holds 20 files. 6 tracked files under `.skilled/commands/deep` name the council and 6 runtime entries mirror the command.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `ai-council` and the `council` loop type from the registry, the router, root `ROUTER.md`, graph metadata, command metadata and description, and regenerate the leaf manifest and compiled routing artifacts.
- Delete `/deep:ai-council`, its two workflow files, its presentation file, its compiled and legacy copies and its six runtime mirrors, and drop its entry from the contract compiler.
- Replace the tracked changelog symlink with a real folder holding the 20 packet changelog files, then delete the packet.
- Describe a two-mode hub in `SKILL.md`, `README.md`, `ARCHITECTURE.md`, the hub catalog, playbook and shared files, and replace the council sibling lines in research and review prose.
- Point the `sk-create-command` naming example at a workflow file that still exists.

### Out of Scope
- Runtime council libraries, scripts and tests - child 003 owns them. Tests that assert the deep command set change here, because T020 breaks them.
- Advisor maps, lanes and bridges - child 004 owns them.
- Hub `benchmark/` and `changelog/` files - they record history and go on the allowlist.
- `ai-council/**` artifacts inside spec folders and untracked files - parent decision D5 protects them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json`, `command-metadata.json`, `description.json` | Modify | Two modes |
| `.skilled/skills/system-deep-loop/leaf-manifest.json` | Regenerate | Two modes |
| `.skilled/skills/system-deep-loop/SKILL.md`, `README.md`, `ARCHITECTURE.md`, `feature-catalog/`, `manual-testing-playbook/`, `shared/` | Modify | Two modes |
| `.skilled/skills/system-deep-loop/deep-research/`, `deep-review/` prose | Modify | No council sibling lines |
| `.skilled/changelog/system-deep-loop/deep-ai-council` | Replace | Symlink becomes a real folder with the 20 changelog files |
| `.skilled/skills/system-deep-loop/deep-ai-council/` | Delete | The mode packet |
| `.skilled/commands/deep/ai-council.md`, its assets, compiled and legacy copies, six runtime mirrors | Delete | The deep command |
| `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modify | No `deep/ai-council` contract entry |
| `.skilled/skills/sk-doc/sk-create-command/SKILL.md` | Modify | Naming example names an existing workflow file |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids come from the requirement list this phase had before it was split, so a requirement keeps its id in the child that owns it. Ids from REQ-018 up were added at the split. A new requirement takes the highest REQ id across the five children plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | D1: `node -e 'console.log(require("./.skilled/skills/system-deep-loop/mode-registry.json").modes.map(m=>m.workflowMode).join(" "))'` prints `research review`. |
| REQ-002 | D1 and D6 stage two: `hub-router.json` `routerPolicy.tieBreak` is `["research", "review"]`, no `routerSignals` or vocabulary class names the council, and root `ROUTER.md` holds no `AI_COUNCIL` key in `INTENT_SIGNALS` or `RESOURCE_MAP`. |
| REQ-003 | D1 and D6: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` exits 0, its `INFO: Parent skill:` line names `.skilled/skills/system-deep-loop`, it prints `PASS: 3b: mode-registry.json declares 2 modes` and it ends with `OK: parent-skill-check`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | D3: `ls .skilled/commands/deep/ai-council.md .skilled/commands/deep/assets/deep-ai-council-*` fails for every path, and no runtime command or prompt folder holds an entry named `*deep-ai-council*` or `deep/ai-council.md`. The command mirror checkers exit 0. |
| REQ-018 | D5 and the packet half of REQ-011: `git ls-files .skilled/skills/system-deep-loop/deep-ai-council` prints nothing, `git ls-files -s .skilled/changelog/system-deep-loop/deep-ai-council \| rg '^120000' \| wc -l` prints 0 and `ls .skilled/changelog/system-deep-loop/deep-ai-council \| wc -l` prints 20. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The registry prints `research review` and `parent-skill-check.cjs .skilled/skills/system-deep-loop` exits 0 with two modes.
- **SC-008**: No `/deep:ai-council` entry exists in `.skilled/commands/deep/` or in any of the six runtime command and prompt folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 001 at Status Complete | Deleting the packet first breaks the agent, which reads packet scripts until it is rewritten. | The setup task T095 checks the status before any edit. |
| Risk | A council prompt falls through to research or review once the council class is gone | High: the hub routes planning work into a loop that cannot serve it | The stage-two replay runs here after the router edit, and child 005 replays both stages on the final tree. |
| Risk | The per-hub gate is run without its hub argument and reports on another hub | Med: a green run that certifies the wrong hub | REQ-003 requires the `INFO: Parent skill:` line to name `.skilled/skills/system-deep-loop`. |
| Risk | The runtime and advisor suites fail between this child and children 003 and 004, because they still name the deleted packet | Med: a red suite on the branch until child 004 closes | This child closes on its focused checks. Children 003 and 004 own the two suites. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: no runtime code path changes in this child.

### Security
- **NFR-S01**: N/A: no auth, secret or permission surface changes.

### Reliability
- **NFR-R01**: Research and review still route to their modes in stage two after the router edit, checked by replaying one prompt each through `compiled-route.cjs --hub system-deep-loop`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no deep-loop vocabulary still selects no packet in `compiled-route.cjs --hub system-deep-loop`.
- Maximum input: all 141 tracked packet files are deleted in one commit, and the 20 changelog files are present in the real folder before that commit.
- Failure path: `ls .skilled/commands/deep/ai-council.md` fails with "No such file or directory" on the final tree.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Six hub metadata files, the hub docs, a 141-file packet delete, the command set and six mirrors. |
| Risk | 14/25 | Hub routing and a public command change. Deletes are tracked and revert through git. |
| Research | 4/20 | The surfaces are listed by file and line in `plan.md`. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
