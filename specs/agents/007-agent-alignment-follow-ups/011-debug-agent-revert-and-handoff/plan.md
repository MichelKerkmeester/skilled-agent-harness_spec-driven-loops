---
title: "Implementation Plan: Phase 11: debug-agent-revert-and-handoff"
description: "Edit one agent file in six text changes, the four debug fixes first and the size cut last, then copy the change to the .claude fork, regenerate three runtime copies and prove each requirement with the rg or wc command its acceptance line names."
trigger_phrases:
  - "debug agent revert and handoff plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: debug-agent-revert-and-handoff

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | One Markdown agent file with YAML frontmatter, its hand-kept fork and three generated copies |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` and `wc` checks per requirement, the roster check and the mirror check |

Step 5 of `/speckit:plan` dispatches four `@context` explorers. A leaf worker cannot dispatch, so the four ran inline as the workflow's own fallback ("Use inline planning activities"). Architecture: `rg -n '^## |^### '` on the agent and the required-sections list in `agent-template.md`. Features: the `AGENT_IO_HANDOFF v1` group and the code agent's receiver gate. Dependencies: `rg -n 'debug-delegation'` over the repository outside `specs/`, which found the producers and consumers in section 3. Tests: the roster and mirror scripts, both run at the base and both exit 0.

### Overview
All five fixes land in `.skilled/agents/debug.md` and are copied by hand to the `.claude` fork. The four debug fixes go first, because the size cut removes text some of them would otherwise edit. The cut then deletes duplicated text only, and every rule it removes still has a home named in section 3. The build starts from the tree phase 6 leaves, so every edit is anchored on quoted text and not on the line numbers in `spec.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 6 has landed its `debug.md` edits, and `git log -1 -- .skilled/agents/debug.md` names its commit
- [ ] The operator answered question 1 in `spec.md` section 7, or the planning default A stands
- [ ] Each command in the `spec.md` Measured Behavior block was re-run on the build base and its output saved in `scratch/baseline.txt`

### Definition of Done
- [ ] Every acceptance command in `spec.md` section 4 prints its after value
- [ ] `wc -l < .skilled/agents/debug.md` prints 600 or less, `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Agent-contract text edit. No runtime code changes.

### Key Components
- **`.skilled/agents/debug.md`**: the canonical agent. Every change is made here first.
- **`.claude/agents/debug.md`**: a hand-kept fork with its own frontmatter and `.claude/agents/` paths. It takes the same body edits by hand. `.cursor` and `.devin` link to it.
- **Generated copies**: `.pi/agents/debug.md`, `.codex/agents/debug.toml` and `.dsh/agents/debug.patch.yml`, rewritten by their sync scripts. `.opencode/agents/debug.md` links to the canonical file.

### Data Flow
An operator opts in after repeated failures. `/speckit:implement` or `/speckit:complete` runs `scaffold-debug-delegation.sh`, which writes `<spec_folder>/debug-delegation.md` or `debug-delegation-NNN.md`. The operator dispatches @debug with a Debug Context Handoff. @debug runs five phases, updates the handoff file the dispatch names and either fixes or returns a diagnosis with the `AGENT_IO_HANDOFF v1` group, which `code.md`'s receiver gate validates.

### Fix Approach per Requirement

**REQ-001, revert and the shared bound (debug-1).** Add Phase 5 rule 7: "Revert a rejected fix with `Edit` before the next attempt, so one fix at most is in place. Never use `git checkout` or `git restore` for this, because they also discard the operator's uncommitted work." Rewrite the `Tests fail?` branch so both arms revert first and both count the hypothesis as rejected, the new-error arm before it restarts Phase 1. Change the section 8 trigger to "Three hypotheses rejected in total, counted across every Phase 1 restart". The number stays three, so no second bound appears. The anti-pattern row on three hypotheses points at section 8.

**REQ-004, the handoff file (debug-2).** Rewrite section 0B to say: the file is `<spec_folder>/debug-delegation.md`, or the versioned `debug-delegation-NNN.md` that `scaffold-debug-delegation.sh` writes when an earlier one exists. `/speckit:implement` and `/speckit:complete` seed it before the operator dispatches. Among agents only @debug edits it, and other agents read it. @debug reads and updates only the file the dispatch or handoff names, and writes none when none is named, putting the evidence in its response. Then align the repeats: Phase 5 rule 6, section 8 item 5, the tool-routing row "Create only if absent", the checklist line and the rules line that says ALWAYS. The ALWAYS line becomes "Write findings to the handoff file the dispatch names, or to the response when it names none".

**REQ-005, fix or hand off (debug-4).** Delete the `### Debug To Implementation Handoff` block and the paragraph after the fence from section 2, because section 7's `AGENT_IO_HANDOFF v1` group carries the same four fields. Move that paragraph's one live sentence, that a legacy file without the fields warns and needs manual checking, into section 7. Add the fix-or-hand-off rule to Phase 5 and section 7 in the operator's answer to question 1. Under default A: "Phase 5 fixes unless the dispatch says `diagnose only`. With `diagnose only`, stop after Phase 4 and return the diagnosis with the `AGENT_IO_HANDOFF v1` group for @code." Either answer adds: "After a fix, run the sk-code quality runner on the changed files when the repository ships it (in this repository: `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files <paths>`) and report its gate under Verification. Without it, name the gap on the `Not checked:` line." The runner is cited by path, never by a `code.md` line, because phase 7 may rewrite that step.

**REQ-006, missing information and one escalation (debug-5).** Replace "Ask for missing information before proceeding" with "Return the Blocked Response with `missing_info` and list each missing field under Information Needed." Keep section 7's Escalation Response, headed `## Debug Escalation`, as the one template. Replace section 8's Escalation Output block with one line that points at it. Section 8 item 4, the `ESCALATION: Exhausted hypotheses` marker, stays.

**REQ-002, the size cut (across-6).** Nothing moves to another file. Each cut deletes text another section of the same file already holds. Line ranges are at `c1dbb1bcc4` and move after phase 6, so the build finds each cut by its first line.

| Cut | Lines now | Removed | Where the rule still lives |
|-----|-----------|---------|----------------------------|
| "You are not automatically called when" block in section 1 | 82-89 | 8 | Section 0A, lines 49-53 |
| Handoff fields and the paragraph after the fence in section 2 | 128-132, 135-136 | 7 | Section 7, `AGENT_IO_HANDOFF v1` (REQ-005) |
| "Tool Selection Flow" tree in section 6 | 374-391 | 18 | The Tool Routing table, lines 359-367 |
| Section 8 "Escalation Output" template | 533-545 | 13, less a 1-line pointer | Section 7 Escalation Response (REQ-006) |
| "Quality Criteria" table in section 9 | 570-581 | 12 | The Pre-Delivery checklist, lines 555-568 |
| Section 10 bullets and section 11 RULES | 584-641 | 58, less a table of about 16 | One ANTI-PATTERNS table in the template's three columns, holding every NEVER and ALWAYS item |

The cuts remove about 100 lines and the fixes add about 8, so the file lands near 560 plus phase 6's additions. The need is 48 plus those additions. RELATED RESOURCES becomes section 11. The roster check compares title prefix and order, and `rg` found no `debug.md` section number cited outside the file. The cut leaves alone the "Daemon-free retrieval" paragraph, the "Skip the Layer 1 retrieval checks" line, the fast-path paragraph and the Success Response verification lines, which are phase 6's.
### Affected Surfaces

Found with `rg -n 'debug-delegation' --glob '!specs/**'` and `rg -n 'agents/debug\.md'`. Every row outside the agent copies stays unchanged, for the reason given.

| Surface | Role | Change |
|---------|------|--------|
| `.skilled/commands/speckit/assets/speckit-implement.yaml:287`, `:510` | Producer: runs the scaffold on opt-in | None. The new section 0B names this producer. |
| `.skilled/commands/speckit/assets/speckit-complete.yaml:320`, `:949` | Producer: same | None |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/scaffold-debug-delegation.sh:145`, `:154` | Producer of the name and the versioned name | None. It parses nothing from `debug.md`. Its `:352` pointer `lines 60-89` is already stale and is recorded in `spec.md` section 7. |
| `.skilled/skills/system-spec-kit/SKILL.md:72` | Consumer: "@debug exclusively writes" | None. The new rule keeps @debug the only agent writer. |
| `.skilled/agents/orchestrate.md:466` | Consumer: exclusive ownership | None. Still true among agents, and phase 8 owns the file. |
| `.skilled/agents/code.md:93-106` | Consumer: validates the four handoff fields | None. The fields keep their names in `AGENT_IO_HANDOFF v1`. |
| `.skilled/skills/system-spec-kit/references/workflows/agent-io-contract.md:126-140` | Consumer: the handoff schema | None |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:154`, `:183`, `:391`, `:399`, `:402` | Consumer: example prompts name the file | None. A prompt that names the file is the case the new rule covers. |
| `README.md:339`, `:989` | Consumer: names @debug as the writer | None |
| `.skilled/agents/agent-registry.json:117-127` and `agent-template.md` REQUIRED-SECTIONS | Read by the roster check | None |
| `.claude/agents/debug.md` | Hand-kept fork | Same body edits |
| `.pi/agents/debug.md`, `.codex/agents/debug.toml`, `.dsh/agents/debug.patch.yml` | Generated copies | Regenerated |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms phase 6 landed and re-runs every Measured Behavior command on that base. Implementation makes the four debug fixes, then the size cut, then the fork edit and the three regenerations. Verification runs every acceptance command in `spec.md` section 4, the roster check, the mirror check and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`D` is `.skilled/agents/debug.md`. Each command prints the after value its requirement names.

```bash
rg -c -i 'revert' D                                   # 2 or more
rg -c -i 'in total' D                                 # 2 or more
rg -n 'Same error\? → Try next post-challenge hypothesis$' D   # nothing
rg -n 'git checkout|git restore' D                    # one line, inside the "Never use" sentence
rg -c 'ONLY @debug may create' D                      # nothing
rg -c 'Write all findings and evidence to' D          # nothing
rg -c 'scaffold-debug-delegation.sh' D                # 1 or more
rg -c 'debug-delegation-NNN.md' D                     # 1 or more
sed -n '/^## 2\./,/^## 3\./p' D | rg -c 'root_cause'  # nothing
rg -c 'AGENT_IO_HANDOFF v1' D                         # 1
rg -c 'quality-gate.cjs' D                            # 1 or more
rg -c 'diagnose only' D                               # 1 or more under default A
rg -c 'Ask for missing information' D                 # nothing
rg -c '^## (Debug Escalation|ESCALATION: Debug Exhausted)' D   # 1
wc -l < D                                             # 600 or less
node .skilled/bin/sync-agent-roster.cjs --check       # agent-roster: OK
node .skilled/bin/check-agent-mirror-sync.cjs         # exit 0, all comparable mirrors in sync
```

The mirror check compares the body of the canonical file with the `.claude` fork and the Codex copy, so a hand edit missed in the fork fails it. `rg -c -i 'revert'` over the four copies is the second check for the Pi and DSH copies, which the mirror script does not compare.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 6 `006-shared-agent-contract` | Packet phase | Planned | The build waits. The base moves and the cut size is set from it. |
| Phase 7 `007-code-agent-retry-and-status` | Packet phase | Planned | The fix rule cites `quality-gate.cjs` by path, so only a renamed runner would need a follow-up edit |
| Operator answer to question 1 | Decision | Open | T006 takes default A |
| `node`, `rg`, `wc` and the five sync and check scripts | Tooling | Present at the base | None. Each path was listed with `ls` during planning. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the roster or mirror check fails after the regeneration and a re-sync does not clear it, or a debug run after the merge stops at a missing handoff file it needed. Revert the phase's one commit with `git revert`. The canonical file, the fork and the three generated copies ship in that one commit, because the commit gate blocks a commit with an unstaged mirror.
<!-- /ANCHOR:rollback -->

---
