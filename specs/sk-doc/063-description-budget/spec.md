---
title: "Feature Specification: Bring skill and agent descriptions back under the description budget"
description: "The description audit reports 6,851 characters across 62 authored descriptions against a 5,600 soft ceiling, headroom -1,251, with seven items over their 130/110 soft targets and none over the 1,536 hard cap. This packet trims those descriptions back to target without losing a routing token, runs a rule-bound pass over the rest toward the ceiling, states which surface the audit counts, and fixes two references that recommend an invocation the doctor router rejects."
trigger_phrases:
  - "description budget overage"
  - "skill description trim"
  - "agent description length"
  - "advisor routing keywords"
  - "audit description surface"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Bring skill and agent descriptions back under the description budget

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `worktrees/079-doctor-command-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Seven authored descriptions sit over their soft target and the project total runs 1,251 characters over its 5,600 ceiling. Every description a skill, command or agent carries is billed against one project budget: Claude Code keeps an 8,000-character list of them and silently drops the longest from auto-discovery when the total crosses that line, and the project convention in `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:262` sets a 5,600-character soft ceiling so the fleet stays well clear of it.

The doctor audit of that budget, rerun read-only on this checkout at HEAD `e1b148bc2a`, reports 62 items (14 skills, 36 commands, 12 agent names), a project total of 6,851 characters, headroom of -1,251 against the 5,600 ceiling, seven items OVER-SOFT and zero HARD-FAIL:

| Surface | Item | Chars | Soft target | Excess |
|---------|------|------:|------------:|-------:|
| skill | `sk-code` | 405 | 130 | 275 |
| agent | `design` | 267 | 130 | 137 |
| skill | `cli-classifier` | 155 | 130 | 25 |
| skill | `cli-external-orchestration` | 149 | 130 | 19 |
| skill | `system-spec-kit` | 147 | 130 | 17 |
| skill | `sk-doc` | 144 | 130 | 14 |
| skill | `sk-design` | 135 | 130 | 5 |

The source audit recorded 6,774 characters and 35 commands; the finding holds and the fleet has since grown by one command and 77 characters, so the overage it named is still open.

Trimming only those seven recovers 492 characters at most and leaves the total at 6,359, still 759 over the ceiling. The per-item targets and the ceiling cannot both hold for this fleet: 14 skills and 12 agents at 130 plus 36 commands at 110 total 7,340 characters, and holding 62 items under 5,600 asks them to average about 90 characters each. Closing the aggregate therefore means trimming well under the per-item targets across most of the fleet, which is why every trim in this packet is bound to a routing check.

Two smaller defects sit beside the number:

- The audit walks `.skilled/commands/**/*.md` (`audit_descriptions.py:181`), including `.skilled/commands/goal-opencode.md` (32 chars) and `.skilled/commands/vision.md` (105 chars), while its docstring claims to measure the surfaces "that feed Claude Code's available-skills list" (`audit_descriptions.py:7`). `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/command-scope.cjs:21` declares both files runtime-exclusive (`CANONICAL_MIRROR_EXCLUDES`), so 137 counted characters are authored-surface, not Claude-visible. Mirroring them would contradict that list: Claude has no `sk-vision` integration and the goal command is per-runtime (`command-scope.cjs:8`).
- `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:302` and `.skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md:67` recommend running `/doctor skill-budget :auto`. The doctor router parses remaining flags against the resolved target's `allowed_flags` and rejects anything else (`speckit.md:64`); `.skilled/commands/doctor/_routes.yaml:93` lists four flags and no mode, and the family contract declares no supported modes. The accepted form is `/doctor:speckit skill-budget`, the form the doctor's own assets already use (`.skilled/commands/doctor/mcp.md:37`).

### Purpose

Every authored description is at or under its 5,600-character project budget with no item over its soft target and no routing token lost, the audit's purpose states the surface it counts, and both sk-doc references name an invocation the router accepts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Trimming the seven OVER-SOFT descriptions to at or under their 130-character soft target, each trim keeping the name token, primary verb, primary domain noun, any mode suffix and any numeric specificity the description already carried.
- A rule-bound pass over the remaining descriptions that removes only DROP-class content (product enumerations, stack lists, marketing prose, parenthetical jargon) and stops per item when only KEEP-class content remains, continuing until the project total is at or under 5,600 or every item sits at its floor.
- A before and after advisor routing check for every trimmed skill and agent, with the trimmed description reverted when the trim is what moved the recommendation.
- Regenerating the generated runtime mirrors the changed descriptions flow into: Pi agents and prompts, Codex agents and prompts, Hermes skill and prompt copies, and the hand-kept hub `command-metadata.json` descriptions for any trimmed command a hub mirrors.
- Rewording the audit's stated purpose, in `audit_descriptions.py`, `.skilled/commands/doctor/assets/doctor-skill-budget.yaml` and the budget section of `frontmatter-templates.md`, so the count names the surface it covers, including the two runtime-exclusive commands.
- Replacing `/doctor skill-budget :auto` with `/doctor:speckit skill-budget` in the two sk-doc references that recommend it.
- Recording the measured result: the final audit, the routing diff, the files changed, and the residual over the ceiling with its cause when the floor stops the pass short.

### Out of Scope

- Changing the soft targets, the 1,536-character hard cap or the 5,600-character ceiling in `.skilled/skills/sk-doc/shared/assets/skill-contract.json` - the audit measures against those constants, and moving a target to meet a number hides the drift instead of reporting it.
- Changing the audit's counting logic or walking a different surface set - the finding asks which surface the number describes, not for a smaller number.
- Mirroring `.skilled/commands/goal-opencode.md` and `.skilled/commands/vision.md` into `.claude/commands` - `command-scope.cjs:21` declares both runtime-exclusive and the rationale is live.
- Retiring, merging or adding skills, commands or agents to shrink the fleet - the fleet is a product decision, and the arithmetic that two constants cannot both hold belongs in the open questions.
- The other observations the source audit recorded and left unfixed: the `doctor-rebuild-presentation.txt:172` one-liner, the hardcoded 8,000-character default, the packet label in the audit's report title.
- Rewriting published changelog entries that carry historical invocations - history stays as written.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/SKILL.md` | Modify | Trim the 405-character description to at or under 130 |
| `.skilled/agents/design.md` | Modify | Trim the 267-character description to at or under 130 |
| `.claude/agents/design.md` | Modify | Same description text as the canonical agent file, kept byte-equal |
| `.skilled/skills/cli-classifier/SKILL.md` | Modify | Trim 155 characters to at or under 130 |
| `.skilled/skills/cli-external-orchestration/SKILL.md` | Modify | Trim 149 characters to at or under 130 |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | Trim 147 characters to at or under 130 |
| `.skilled/skills/sk-doc/SKILL.md` | Modify | Trim 144 characters to at or under 130 |
| `.skilled/skills/sk-design/SKILL.md` | Modify | Trim 135 characters to at or under 130 |
| `.skilled/skills/*/SKILL.md`, `.skilled/commands/**/*.md`, `.skilled/agents/*.md`, `.claude/agents/*.md` | Modify | Stage-2 filler trims, only on items that carry DROP-class content; the exact subset is measured during the pass |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modify | Fix the rejected invocation at line 302; add one sentence naming the counted surface in the budget section |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md` | Modify | Fix the rejected invocation at line 67 |
| `.skilled/commands/doctor/scripts/audit_descriptions.py` | Modify | Docstring and report line state the counted surface; no behavior change |
| `.skilled/commands/doctor/assets/doctor-skill-budget.yaml` | Modify | `purpose:` at line 5 names the counted surface; no workflow change |
| `.skilled/skills/sk-doc/command-metadata.json`, `.skilled/skills/sk-design/command-metadata.json`, `.skilled/skills/system-deep-loop/command-metadata.json` | Modify | Hand-kept command descriptions refreshed for any trimmed command a hub mirrors |
| `.pi/agents/*.md`, `.pi/prompts/*.md`, `.codex/agents/*.toml`, `.codex/prompts/*`, `.hermes/skills/*/SKILL.md`, `.hermes/prompts/*.md` | Regenerate | Generated runtime copies of the changed descriptions, refreshed through their sync tools |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every item the audit reports OVER-SOFT is trimmed to at or under its soft target: `sk-code` 405, the `design` agent 267, `cli-classifier` 155, `cli-external-orchestration` 149, `system-spec-kit` 147, `sk-doc` 144 and `sk-design` 135, each keeping its name token, primary verb, primary domain noun, mode suffixes and numeric specifics | `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root "$PWD"` reports no OVER-SOFT item, and `python3 .skilled/skills/sk-doc/scripts/quick_validate.py .skilled/skills/<name>` prints no description-length warning |
| REQ-002 | A trim pass runs over every remaining description, cuts only DROP-class content, stops per item at its KEEP floor, and continues until the project total is at or under 5,600 or every item sits at its floor | The audit's project total is at or under 5,600, or `implementation-summary.md` names the items at their floor and the measured total; `scratch/trim-plan.md` records each item examined and why it was cut or left |
| REQ-003 | The result is re-measured and recorded with the counts, the files changed, the headroom, and, when the ceiling is not reached, the arithmetic that the fleet at its per-item targets totals 7,340 against the 5,600 ceiling | `scratch/audit-after.txt` holds the run; `implementation-summary.md` carries the numbers and the residual in its Verification and Known Limitations sections |
| REQ-004 | Advisor routing is checked before and after every trim, with one representative prompt per trimmed skill and agent, and any top recommendation the trim moved is either explained or reverted | `scratch/advisor-before.json` and `scratch/advisor-after.json` hold the runs; the before-and-after table in `implementation-summary.md` shows each prompt and its top skill |
| REQ-005 | The audit's purpose states the surface it counts, including the two runtime-exclusive commands, and neither command is mirrored into `.claude/commands` | The surface sentence appears in the audit docstring, `doctor-skill-budget.yaml:5` and the budget section of `frontmatter-templates.md`; no `goal-opencode.md` or `vision.md` exists under `.claude/commands` |
| REQ-006 | Both sk-doc references recommend the accepted invocation `/doctor:speckit skill-budget` instead of `/doctor skill-budget :auto` | `rg -n "doctor skill-budget :auto" .skilled` returns no match, and `rg -n "doctor:speckit skill-budget" .skilled/skills/sk-doc` finds both files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The generated runtime mirrors stay in sync after the trims: Pi agents and prompts, Codex agents and prompts, the Hermes skill and prompt copies, the hand-kept hub command metadata, and the symlink trees | Every `sync-*.cjs --check` exits 0, `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` reports `STATUS=OK`, and `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` reports every mirror in sync |
| REQ-008 | The hub skills whose `SKILL.md` changes leave compiled routing fresh | `node .skilled/bin/compiled-route-guard.cjs` exits 0 with every hub fresh or excused |
| REQ-009 | The packet validates once the docs are filled and the change lands | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/063-description-budget --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The audit reports zero OVER-SOFT and zero HARD-FAIL items.
- **SC-002**: The project total is at or under 5,600 characters with the headroom recorded, or the measured total, the items at their floor and the per-item-targets arithmetic behind the residual are recorded in `implementation-summary.md` and raised as an open question.
- **SC-003**: Every trimmed skill and agent returns the same top advisor recommendation for its representative prompt, or the difference is recorded with both runs and the description restored.
- **SC-004**: No current document under `.skilled` recommends `/doctor skill-budget :auto`, and the audit's stated purpose names the surface it counts.
- **SC-005**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/063-description-budget --strict` prints `RESULT: PASSED`, and `node .skilled/bin/compiled-route-guard.cjs` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A trim drops a token the advisor scores on | The trimmed skill stops being recommended | REQ-004 runs a before-and-after prompt per trimmed item and restores the description when the trim is the cause |
| Risk | The 5,600 ceiling cannot be reached while the per-item targets stand at 130/110 for 62 items | The aggregate goal is missed | The pass measures its floor, names the items there, records the 7,340-versus-5,600 arithmetic, and never cuts a KEEP token to reach a number |
| Risk | Editing a hub `SKILL.md` stales its compiled routing manifest | The hub serves legacy routes | `compiled-route-guard.cjs` checks all seven hubs; the pre-commit route re-mint regenerates the manifests when the change is committed (`.skilled/scripts/git-hooks/pre-commit:322`) |
| Risk | The agent description lives in two authored files and three generated trees | The mirrors drift from the canonical text | Edit `.skilled/agents/design.md` and `.claude/agents/design.md` in one task, regenerate Pi, Codex and Hermes copies, and run each checker |
| Risk | A command trim leaves a hub's hand-kept `command-metadata.json` stale | The command catalog guard reports prose divergence | Rerun `command-catalog-mirror-check.cjs` and refresh the affected metadata entries |
| Dependency | The doctor audit script and workflow | The measurement and the purpose edit | Both are read-only and text-only here; rerun the audit and `route-validate.sh` after the wording change |
| Dependency | The advisor daemon | The routing check cannot run | `advisor_status` is probed first; exit 75 is retryable, and a persistent failure falls back to the KEEP-token presence check with the fallback recorded |
| Dependency | The trim rules in `frontmatter-templates.md` | Every cut must match the owner's DROP and KEEP lists | Read the section before the pass; this packet changes only its two stale lines, not the rules |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The per-item soft targets (130/110) and the 5,600 project ceiling cannot both hold for 62 items: at target the fleet totals 7,340. If the rule-bound pass cannot reach 5,600 without cutting KEEP-class content, which does the operator prefer: a higher ceiling, lower per-item targets, or a smaller fleet? **Answered 2026-10-03:** the operator raised the ceiling to 6,400 and ruled out further trimming.
- `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` lists `/doctor <target>` in the doctor family's `invocation_aliases`, while the router resolves as `/doctor:speckit` and the doctor's own assets use `/doctor:speckit <target>`. This packet adopts the finding's accepted form; should the family contract be corrected in its own packet?
- Should the audit also print a Claude-visible subtotal that excludes the two runtime-exclusive commands, or is one authoring-surface total enough once its stated purpose names the surface? Deferred here; the reword keeps one number.
<!-- /ANCHOR:questions -->
