---
title: "Feature Specification: Phase 22: agent-source-and-drift-checks"
description: "The doctor roster check reads only five runtime trees and treats the Claude fork as canonical, the playbook sandboxes never build the .opencode tree their drift checks diff, and the deep-research Claude copy grants a tool its source never declares. This phase makes each of those checks able to fail and settles the two agent design calls the operator decided on 2026-11-15."
trigger_phrases:
  - "agent source and drift checks"
  - "phase 22 agent source and drift checks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 22: agent-source-and-drift-checks

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 25 |
| **Predecessor** | 021-vibe-budget-default |
| **Successor** | 023-agent-docs-fixes |
| **Handoff Criteria** | The roster check covers all eight trees and fails on a missing `.vibe` or `.dsh` agent, both sandboxes build `.opencode/agents`, the four agent generators and the mirror check pass, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the agent alignment follow-ups. It fixes the phase 20 findings that hide drift from a check (A5, B5, E1, E2) and acts on three operator answers of 2026-11-15.

**Scope Boundary**: The doctor roster check and its test, the two deep-loop playbook sandbox scripts, the `deep-research` and `markdown` agent sources with their generated copies, and the crosswalk lines those two source changes make wrong. Other doc findings go to phase 23.

**Dependencies**:
- Phase 20 findings in `../020-agent-docs-alignment-research/research/research.md`

**Deliverables**:
- A roster check that reads `.skilled/agents` and covers `.claude`, `.cursor`, `.devin`, `.opencode`, `.codex`, `.pi`, `.dsh` and `.vibe`
- Sandboxes whose `.opencode/agents` drift diffs compare real files
- `websearch: allow` in the deep-research source and `mode: subagent` for markdown, carried to every generated tree
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doctor roster check never reads `.dsh/agents` or `.vibe/agents`, so an agent missing there passes, and its header calls `.opencode` and `.codex` independently authored when one is a symlink and the other generated. The two deep-loop playbook sandboxes copy `.skilled` and `.claude` agent files but never create `.opencode`, so their `.opencode/agents` diffs compare two missing files. The Claude copy of `deep-research` grants `WebSearch`, which no source key declares, and `markdown` declares `mode: all` while its body and the registry call it a LEAF.

### Purpose
Each drift check can fail when its tree drifts, and every agent tree grants what its source declares.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ grep -cE "\.dsh/agents|\.vibe/agents" .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
0
$ grep -c opencode .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh
0
$ grep -nE "^  web|^mode" .skilled/agents/deep-research.md .skilled/agents/markdown.md
.skilled/agents/markdown.md:4:mode: all
.skilled/agents/markdown.md:13:  webfetch: deny
.skilled/agents/deep-research.md:4:mode: subagent
.skilled/agents/deep-research.md:13:  webfetch: allow
$ sed -n 4p .claude/agents/deep-research.md
tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rebuild the roster check on `.skilled/agents` with presence checks for `.claude`, `.opencode`, `.codex`, `.pi`, `.dsh` and `.vibe`, and link checks for `.cursor` and `.devin` into `.claude/agents`.
- Create `.opencode/agents -> ../.skilled/agents` in both playbook sandboxes.
- Add `websearch: allow` to the deep-research source and set `markdown` to `mode: subagent` (operator answers 2026-11-15), then regenerate the generated trees.
- Correct the crosswalk sentences those two source changes make wrong.

### Out of Scope
- The other phase 20 doc findings - phase 23 owns them.
- The `.claude` fork helper - it is local tooling outside the repo; its fix is recorded in the implementation summary.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | Modify | Canonical tree and eight surfaces |
| `.skilled/commands/doctor/scripts/tests/agent-roster-mirror-check.test.cjs` | Modify | Fixture trees and drift cases |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh`, the deep-review twin | Modify | Build `.opencode/agents` |
| `.skilled/agents/deep-research.md`, `.skilled/agents/markdown.md` | Modify | `websearch` key, `mode: subagent` |
| `.pi/agents/*.md`, `.codex/agents/*.toml`, `.dsh/agents/*.patch.yml`, `.vibe/agents/*.toml` | Regenerate | Generator output |
| `.skilled/bin/agent-mirror-crosswalk.md` | Modify | Permission vocabulary and mode counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The roster check reads `.skilled/agents` and fails when any of the eight trees lacks an agent. | The test file has a drift case for `.vibe` and for `.dsh`, and `node --test` on it passes |
| REQ-002 | Both sandboxes create `.opencode/agents` as a link to `.skilled/agents`. | Running each setup script into a temp dir leaves `<dir>/.opencode/agents/<agent>.md` readable |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The deep-research source grants `websearch` and markdown is a subagent in every generated tree. | The four generators' `--check` and `check-agent-mirror-sync.cjs` exit 0 |
| REQ-004 | The crosswalk states the permission vocabulary and mode counts the sources now hold. | `rg -n 'websearch' .skilled/bin/agent-mirror-crosswalk.md` finds the vocabulary line, and the mode line names ten subagents |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The roster check prints eight surface rows, all OK, on the real tree.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The four agent generators | Medium | Each runs with `--check` after the write; a failure blocks the commit |
| Risk | `websearch` output on OpenCode is not screened, since the injection screen covers `webfetch` only | Medium | Same as Claude today, where the screen covers `WebFetch` only; recorded as a limitation |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose on 2026-11-15: add `websearch` to the source, and decide both design calls now.
<!-- /ANCHOR:questions -->

---


