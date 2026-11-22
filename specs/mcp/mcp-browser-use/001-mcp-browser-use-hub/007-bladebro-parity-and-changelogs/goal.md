---
title: "Goal: Phase 7: bladebro-parity-and-changelogs"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "bladebro parity and changelogs goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/007-bladebro-parity-and-changelogs"
    last_updated_at: "2026-11-22T07:02:51Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the durable directive"
    next_safe_action: "Operator decides whether to remove worktree 505 and its branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "da5c810b-9095-42b1-8923-c83799a0919f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: bladebro-parity-and-changelogs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Bladebro installs and checks itself like its sibling modes, every browser hub changelog resolves from the global tree and matches what shipped, and every mode playbook scenario has a recorded verdict or a named blocker.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No real install, update or uninstall runs. Scripts are tested on their safe paths only. |
| D2 | Changelog history is extended with new entries, never rewritten. |
| D3 | Scenarios that drive the signed-in Aside browser or account wait for an operator yes. |
| D4 | Nothing is committed without the operator's instruction. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `check-mcp-mutation-class.sh` prints `GUARD PASS` with both Bladebro scripts listed
- [x] The changelog coverage check prints 0 uncovered and no link dangles
- [x] `parent-skill-check.cjs .skilled/skills/mcp-browser-use` ends with `OK`
- [x] Chrome DevTools has 30 of 30 scenarios recorded, and every unrun Aside scenario is named
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Scripts, asset, guide | Done | shellcheck exit 0, guard 23 PASS, asset diff `BYTE_TRUE`, guide 0 issues |
| Changelog topology | Done | `58 changelog dirs, 58 covered, 0 uncovered` |
| Changelog entries | Done | four new entries plus the advisor fix folded into its v2.0.0.0 entry, shape check exit 0 |
| Hub gates | Done | parent-skill check `OK`. Guard fresh after one re-mint |
| Benchmark coverage | Done | five new reports. Chrome DevTools 30 of 30, Aside 16 of 29 |
| Commit and push | Done | the operator chose commit, merge and push on 2026-11-22: `a5d1912a6c2`, `4d9c5049fca` and merge `5bfe0a856e1`, pushed as `e7b79323c6d..5bfe0a856e1` |

### Deviations and findings

| Item | Note |
|------|------|
| Install guide model | The handoff named `install-template.md`. That template covers a repository-root INSTALL.md, so Aside's validated guide was the model |
| BB-014 wording | The 006 log records the operator kept Bladebro installed, so the new docs say that instead of "waits for a yes" |
| Advisor entry folded (D2) | Main reached advisor 2.0.0.0 before the merge. The operator chose on 2026-11-22 to fold the scorer fix into that existing entry, which edits history D2 says to extend. The 1.3.1.0 entry was dropped |
| Aside runs | The operator answered "Not now" on 2026-11-22, so the 13 scenarios stay on the operator-yes list |
<!-- /ANCHOR:log -->
