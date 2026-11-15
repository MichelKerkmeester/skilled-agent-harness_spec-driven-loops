---
title: "Feature Specification: Phase 1: standalone-agent-and-council-command"
description: "The ai-council agent body depends on scripts and references inside the deep-ai-council packet and tells the agent to run node while its frontmatter denies bash. This child rewrites the agent so it stands alone in all eight agent folders and adds the one council command the operator chose, /speckit:ai-council, before anything is deleted."
trigger_phrases:
  - "standalone agent and council command"
  - "phase 1 standalone agent and council command"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: standalone-agent-and-council-command

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-hub-two-mode-wiring |
| **Handoff Criteria** | Child 002 starts when the agent mirror checkers exit 0, the REQ-008 search prints nothing and `/speckit:ai-council` is present in all six runtime command and prompt folders. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the ai-council mode deprecation, which retires `ai-council` as a `system-deep-loop` mode and keeps the council as a standalone agent.

**Scope Boundary**: The two authored agent files, their three generated mirrors, the Deep Route line in `orchestrate.md`, three new speckit command files, one `command-metadata.json` row in `system-spec-kit`, one tracked-command row in the advisor and the setup files in the parent `scratch/` folder. Nothing is deleted in this child.

**Dependencies**:
- Phases 004 and 005 of the parent packet are Complete (REQ-017).
- The operator chose D3 option B, recorded as Q008 in the packet `decision-record.md`.

**Deliverables**:
- A self-contained `ai-council` agent in all eight agent folders, carried by the existing mirror generators.
- `/speckit:ai-council` with one workflow file and one presentation file, present in all six runtime command and prompt folders.
- The gate baseline, the start inventory and the history allowlist in `../scratch/`, which children 002 to 005 read.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `ai-council` agent body points at `deep-ai-council/scripts/persist-artifacts.cjs`, the packet structure references and `runtime/scripts/append-mode-event.cjs`, and it tells the agent to run `node` while its frontmatter says `bash: deny`. The agent breaks the moment the packet is deleted. Without a command the council would be reachable only by naming `@ai-council`, and nothing would bind the spec folder before the agent writes.

### Purpose
The council runs from one self-contained agent and one typed command, and neither reads a `system-deep-loop` file.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only command and its verbatim output:

```text
$ rg -c 'system-deep-loop|deep-ai-council|/deep:ai-council|append-mode-event|persist-artifacts|node ' .skilled/agents/ai-council.md .claude/agents/ai-council.md; rg -n '^  bash:' .skilled/agents/ai-council.md; find -L .skilled/agents .claude/agents .codex/agents .cursor/agents .devin/agents .dsh/agents .opencode/agents .pi/agents -maxdepth 1 -name 'ai-council*' | wc -l; ls .skilled/commands/speckit | rg -c -i council
.claude/agents/ai-council.md:18
.skilled/agents/ai-council.md:18
10:  bash: deny
       8
```

Run from the repository root at `81faa4614c` on 2026-11-14. Each authored agent file holds 18 lines that name a deep-loop path, a packet script or a `node` call. The frontmatter denies bash. 8 agent entries exist across the eight agent folders. The last command prints nothing, because the speckit command folder holds no council file.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Capture the gate baseline, the start inventory and the history allowlist in `../scratch/` before any edit.
- Rewrite `.skilled/agents/ai-council.md` and its Claude twin so the artifact layout and output schema live in the body and no packet path, script call or `node` instruction remains.
- Regenerate the Codex, Pi and DSH agent mirrors and confirm the symlinked mirrors still resolve.
- Remove `@ai-council` from the Deep Route rule in `orchestrate.md` and keep it as a LEAF.
- Add `/speckit:ai-council` with one workflow file and one presentation file, its `command-metadata.json` row and its advisor tracked-command row, and mirror it to six runtime folders.

### Out of Scope
- Deleting `/deep:ai-council`, the packet or any runtime file - children 002 and 003 own the removals.
- The multi-topic session loop - parent decision D10 drops it.
- Every other advisor entry - child 004 owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/agents/ai-council.md`, `.claude/agents/ai-council.md` | Modify | Self-contained agent |
| `.codex/agents/ai-council.toml`, `.pi/agents/ai-council.md`, `.dsh/agents/ai-council.patch.yml` | Regenerate | Mirrors of the agent |
| `.skilled/agents/orchestrate.md` and its mirrors | Modify | Deep Route rule names three deep agents |
| `.skilled/commands/speckit/ai-council.md`, `assets/speckit-ai-council.yaml`, `assets/speckit-ai-council-presentation.txt` | Create | The kept command. Without it the council has no typed entry point and nothing binds the spec folder before the agent writes. |
| `.skilled/skills/system-spec-kit/command-metadata.json` | Modify | One row for the new command |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modify | One tracked-command row with owner `system-spec-kit` |
| `../scratch/gate-baseline.md`, `../scratch/council-inventory-start.txt`, `../scratch/exceptions.md` | Create | Setup files the later children compare against |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids come from the requirement list this phase had before it was split, so a requirement keeps its id in the child that owns it. Ids from REQ-018 up were added at the split. A new requirement takes the highest REQ id across the five children plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-007 | D2: the agent exists in all eight agent folders and `node .skilled/bin/check-agent-mirror-sync.cjs --all`, `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` and the Codex, Pi and DSH agent generators with `--check` each exit 0. |
| REQ-008 | D2: `rg -n 'system-deep-loop|deep-ai-council|/deep:ai-council|append-mode-event|persist-artifacts|node ' .skilled/agents/ai-council.md .claude/agents/ai-council.md` prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | D3: `goal.md` holds one line `D3 decision: option A` or `D3 decision: option B`. Under option B, `ls .skilled/commands/speckit/assets/speckit-ai-council*.yaml \| wc -l` prints 1, the command reaches all six runtime command and prompt folders, and the advisor offers `/speckit:ai-council` for the council prompt. Under option A no council command file exists outside `specs/`. |
| REQ-017 | D7: work starts only when phases 004 and 005 show Status Complete, checked by `rg -l -F '\| **Status** \| Complete' ../004-*/spec.md ../005-*/spec.md \| wc -l` printing 2. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-004**: The agent mirror checks exit 0 and the agent body names no deep-loop path.
- **SC-005**: `/speckit:ai-council` is present in all six runtime command and prompt folders with exactly one workflow file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 004 and 005 of the parent packet at Status Complete | Phase 005 edited research and review docs that also name the council. Running first would collide. | REQ-017 blocks the start. |
| Risk | The rewritten agent loses a rule the packet scripts and references carried, such as the artifact schema | Med: council artifacts stop matching the layout older runs wrote | The body carries the artifact layout and output schema, and the manual dispatch in T099 checks the written tree. |
| Risk | The advisor does not offer the new command until its bridges are regenerated | Low: the command still runs when typed | REQ-009 checks the advisor output here, and child 004 reruns it after it regenerates the bridges. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: this child changes no runtime code path, only one tracked-command row.

### Security
- **NFR-S01**: The rewritten agent keeps `bash: deny` and its writes stay limited to `ai-council/**` inside the bound spec folder.

### Reliability
- **NFR-R01**: Every agent and command mirror checker that exits 0 at the start commit exits 0 after this child.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `/speckit:ai-council` run with no spec folder asks for one and writes nothing before it is bound.
- Maximum input: N/A: the command runs a single round, so there is no upper bound to exercise.
- Failure path: the agent keeps `bash: deny`, so a body step that needs a script cannot run, and the REQ-008 search fails before such a body ships.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two authored agent files, three generated mirrors, three new command files and two metadata rows. |
| Risk | 8/25 | A public command is added. Nothing is deleted. |
| Research | 6/20 | The agent rewrite needs the packet structure references read once. |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. D3 was answered as option B and the split as "Split now", recorded as Q008 and Q009 in the packet `decision-record.md`.
<!-- /ANCHOR:questions -->

---
