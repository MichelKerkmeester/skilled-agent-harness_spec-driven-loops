---
title: "Implementation Plan: Phase 13: context-markdown-design-fixes"
description: "Edit three agent files so each instruction fits the tools the agent holds: a Grep trigger lane for @context, a late template binding and a named DQI scorer for @markdown and four routed paths for @design. Then carry each edit into the runtime copies and prove it with the search each requirement names."
trigger_phrases:
  - "context markdown design fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: context-markdown-design-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions with YAML frontmatter, plus generated TOML and YAML runtime copies |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` searches per requirement, `sync-agent-roster.cjs --check`, `check-agent-mirror-sync.cjs` and `wc -l` |

The four step-5 `@context` explorers of `/speckit:plan` ran inline, the workflow's own fallback, because a leaf worker cannot dispatch. The architecture, feature, dependency and test passes were done with `rg`, `sed` and `Read` over the three agent files, their runtime copies, the trigger index and its lookup CLI, the `sk-design` hub, the `sk-code-quality` runner and the `/create:*` workflows. No test file under the repository names any of the three agents or the strings this phase changes: the search for `agents/(markdown|design)\.md`, `thirteen valid`, `BINDING: template` and `Path applied` in `*.{ts,js,cjs,mjs,py,sh}` exited 1.

### Overview
Three agent files change, in the order context, markdown, design, each followed by its mirror routine. Every edit is text, and each requirement in `spec.md` has one search that proves it. The roster and mirror checks run after the last mirror routine.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 006 and 008 have landed, and `git log --oneline -- .skilled/agents/context.md .skilled/agents/markdown.md .skilled/agents/design.md .skilled/agents/orchestrate.md` shows their commits
- [ ] The Measured Behavior commands in `spec.md` re-run on the build base, with each line number found again by pattern
- [ ] The open questions on 006's unscored-output form and the untrusted-content sentence are answered in 006's documents

### Definition of Done
- [ ] Every acceptance command in `spec.md` section 4 prints what its row says
- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Agent text alignment. No runtime code changes.

### Key Components
- **`.skilled/agents/context.md`**: the read-only retrieval leaf. It gains one trigger lane that uses Grep, loses its shell recipe, its record IDs, one constant line and the §6 restatement.
- **`.skilled/agents/markdown.md`**: the `/create:*` executor. One binding moves, the DQI source is named and two duplicate lists collapse into a pointer to §5.
- **`.skilled/agents/design.md`**: the design leaf. Its routing tree gains two branches and a Step 2c, and two sentences gain an exception and an edit scope.
- **Runtime copies**: `.claude/agents/` is a hand-kept fork. `.pi`, `.codex` and `.dsh` are generated from `.skilled/agents/`. `.opencode/agents` links to `.skilled/agents` and `.cursor/agents` links into `.claude/agents`.

### Data Flow
A dispatcher sends a prompt to an agent, which follows the instructions in its file using only the tools its frontmatter grants. The edits change only which instructions those are. The sync scripts then copy the `.skilled` text into the Pi, Codex and harness formats, and the mirror check compares what it can.

### Fix Approach per Requirement

- **REQ-001, context-1.** Replace the `Read` row at `:73`, the sentence at `:79` and the bullet at `:183` with one §2 definition: Grep for `^\s*- "[^"]*<phrase>` with case ignored, over `*.md` under the four corpus roots `lib/corpus.mjs` walks, skipping `z_archive` and `scratch` as `retrieval-conventions.md` §9 does. Grep the index itself returns integer ids into `paths`, not paths, and the lookup CLI runs through `node`, which Bash-denied `@context` cannot run, so neither is the better instruction here. The other mentions of "the trigger index lookup" at `:53`, `:95`, `:128`, `:155`, `:175` and `:405` then point at this definition and need no edit. The sentence names the recall loss, exact declared phrases only and no token-overlap matches, and the precision loss: the pattern can match a quoted bullet in a document body, so a hit is confirmed by reading that file's frontmatter.
- **REQ-004, context-2.** First confirm each parameter name in the OpenCode and the Claude Code Grep tool schemas, because `.skilled/agents/` serves the first and `.claude/agents/` the second. A case flag not common to both becomes an inline `(?i)`. Then rewrite the `:206` bullet as Grep parameters taken from the recipe: fixed pattern, case ignored, files-with-matches output, `*.md` glob, `z_archive` and `node_modules` skipped, `specs` and `.skilled` as paths. Drop `:207`'s `--json` and parse instruction, keeping "rank the hits yourself" for the content mode. Delete `:209`. An empty Grep result is a clean no-hit and a tool error is a failed search, which the ESCALATE IF row at `:405` already covers.
- **REQ-005, context-3.** `:252-253` become `` `path:line`: [title or heading]: [finding] `` lines. `:355` and `:379` read "`file:line` or tool-reported record".
- **REQ-006, context-4.** Delete `:270` and `:359`. Keep the section with its `Boundary:` and `Note:` lines, so `orchestrate.md:560` and the seven sites that count six sections (`:290`, `:291`, `:302`, `:346`, `:354`, `:384`, `:425`) stay true. Move the one §6 clause §0 lacks, `:226` "never convert an exploration gap into a hidden delegation request", into §0 `:41`. Delete §6 and renumber §7 to §12. The one internal section reference, "Section 2" at `:54`, does not move.
- **REQ-007, markdown-1.** Drop `BINDING: template=` from the §0b block. Add to step 5 at `:141`: "then emit `BINDING: template=<path read>`". The §7 checklist line at `:265` keeps all six names, because all six are still emitted.
- **REQ-008, markdown-2.** Rewrite `:252`: run `python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py <file>` and report its `dqi.total`. For an output the scorer does not fit, use 006's form. Planned default `DQI=n/a`, with the reason in `NOTES`. Step 7 at `:143` and the §7 checklist at `:269` name the same source.
- **REQ-009, markdown-3.** Delete the `memory` row at `:170`.
- **REQ-010, markdown-4.** Replace the 13 bullets at `:52-64` with "any `/create:*` command in the Section 5 table", and `:101`'s "one of the thirteen valid `/create:*` commands" with "a `/create:*` command from Section 5".
- **REQ-002, design-1.** Add two branches to the tree at `:53-75`. A chart, plot or heatmap goes to CHART and `sk-design-chart` (`/design:chart`). A flowchart, architecture, sequence or ASCII diagram goes to DIAGRAM and `sk-design-diagram` (`/design:diagram`). Use the split at `sk-design-chart/SKILL.md:36`: values a reader compares go to a chart, a structure a reader follows goes to a diagram. Add Step 2c: load the packet's `SKILL.md`, build from a corpus form, run `node scripts/check-corpus.cjs --extra <dir>` or `node scripts/check-diagram-corpus.cjs --extra <dir>` and require `RESULT: PASSED`, plus `bash scripts/validate-flowchart.sh <target>` for ASCII output. Where the diagram packet would pause and ask about the style guide, return that question as remaining work, because a LEAF cannot ask and `:197` forbids it. Carry the four paths into `:171`, `:183`, §4 Quality Gates and §7 Output Verification.
- **REQ-011, design-2.** `:87` becomes: follow the prompt and report the conflict, except where the prompt would break a §6 NEVER rule. Those hold whatever the prompt says.
- **REQ-012, design-3.** After `:97`, state that the decide path edits only the files the request names and runs `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files <those paths>` before reporting. `:134` becomes: when the request names no file to change, return the values and `code` implements them.
- **REQ-003.** The mirror routine after each agent, then the roster and mirror checks.

### Affected Surfaces

| Surface | Role | Relation to the change |
|---------|------|------------------------|
| `.skilled/agents/orchestrate.md:560` | Consumer | Checks the Context Package for the Nested Dispatch Status section. REQ-006 keeps the section, so no edit |
| `.skilled/agents/review.md:461`, `.skilled/agents/code.md:116` | Consumer | Skip their Layer 1 memory checks when handed a Context Package. The Memory Context heading stays, so no edit |
| `.skilled/commands/speckit/plan.md`, `.skilled/commands/create/agent.md`, `speckit-plan.yaml` step 5 | Dispatchers of `@context` | Ask for a Context Package and name the ripgrep recipes for spec and skill docs. Unchanged contract |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`, `runtime/cli/retrieval/lib/corpus.mjs` | Producers | Source of the recipe and the corpus roots that REQ-001 and REQ-004 restate. Read only |
| `.skilled/agents/agent-registry.json` `context` and `design` records | Description | Says "Trigger index lookup", and the design summary names two skills. Reported, not changed |
| `.skilled/commands/create/assets/*.yaml` | Dispatchers of `@markdown` | Hold their own `dqi_minimum` values and pass no `template_path`. They do not parse the `DQI=` line, so the evidence format can change |
| `.skilled/skills/sk-doc/sk-create-quality-control/SKILL.md:99` | Rule source | Forbids a DQI claim without `extract_structure.py` output. REQ-008 aligns with it |
| `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md:281`, `:731` | Template | Sets the binding timing and describes `@design`. Phase 006 owns it |
| `.skilled/skills/sk-design/mode-registry.json`, `sk-design-chart/SKILL.md`, `sk-design-diagram/SKILL.md` | Producers | The mode names, commands and checks Step 2c cites. Read only |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Producer | The command REQ-012 names. `--help` exits 0 and lists `--files` |
| `.claude/agents/`, `.pi/agents/`, `.codex/agents/`, `.dsh/agents/` copies of the three agents | Runtime variants | Hand-edited or regenerated in the mirror routine |
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-runs the Measured Behavior commands and finds each line again by pattern. Implementation edits `context.md`, then `markdown.md`, then `design.md`, each followed by the mirror routine. Verification runs every acceptance search in `spec.md` section 4 across the runtime copies, then the roster check, the mirror check, `wc -l` and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each requirement is closed by the search its acceptance line names, run on `.skilled/agents/` and on the `.claude`, `.pi`, `.codex` and `.dsh` copies. `scratch/negative-checks.sh` runs the eight negative searches over all five copies at once. Every count was above 0 at `c1dbb1bcc4`, so a 0 after the build is the edit's doing and not an anchor that never matched. The `.dsh` copies indent the agent text by six spaces, which is why each pattern anchors with `^\s*`. `check-agent-mirror-sync.cjs` marks every `.dsh` patch `NOT COMPARED`, so a stale harness copy passes it, and the per-file search is what catches that. The run ends with three checks. `node .skilled/bin/sync-agent-roster.cjs --check` must print `agent-roster: OK`. `node .skilled/bin/check-agent-mirror-sync.cjs` must exit 0. `wc -l` must print 600 or less for each of the three files. No behavior test runs an agent. The phase changes instructions, and the review that found them was a reading, so a reading with searches closes them.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`rg`, `node` and `python3`, no new package. Phase 006 must land first, because it sets the unscored-DQI form REQ-008 uses, decides the "Daemon-free retrieval" line next to `context.md:79` and may add the untrusted-content sentence to `context.md`. Phase 008 must land first, because it edits `orchestrate.md` and this phase re-checks its line 560. The mirror routine needs these five scripts, each confirmed present:

- `.skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs`
- `.skilled/bin/sync-agent-roster.cjs`
- `.skilled/bin/check-agent-mirror-sync.cjs`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the roster or mirror check fails on main after the merge, or a dispatcher reports that `@context`, `@markdown` or `@design` refuses or stalls on work it did before. Revert the phase's commit with `git revert`. The commit carries each agent with all of its runtime copies, because the commit gate blocks a commit with an unstaged mirror, so the revert restores them together.
<!-- /ANCHOR:rollback -->

---
