---
title: "Implementation Plan: Bring skill and agent descriptions back under the description budget"
description: "Trims the seven over-soft descriptions to their soft targets with candidate text measured at planning time, then runs a rule-bound pass over the remaining fleet toward the 5,600-character ceiling, checking advisor routing before and after every cut. Two wording fixes follow: the audit's stated surface and the rejected :auto invocation in two sk-doc references."
trigger_phrases:
  - "description budget plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Bring skill and agent descriptions back under the description budget

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and YAML frontmatter; Python and Node checkers already in the tree |
| **Framework** | sk-doc authoring contract, the doctor description audit, skill advisor routing, spec-kit validation |
| **Storage** | None; the advisor runtime database is read, and rebuilt only if it reports stale |
| **Testing** | `audit_descriptions.py`, `quick_validate.py`, `validate_document.py`, `advisor_recommend`, the runtime sync checkers, `validate.sh --strict` |

### Overview

Trim the seven descriptions the audit flags OVER-SOFT to at or under their soft target, using candidate text that keeps every routing token the current description carries. Then run a rule-bound pass over the rest of the fleet, cutting only DROP-class content and stopping per item at its KEEP floor, because the seven alone leave the project total 759 characters over the ceiling and the fleet cannot fit 5,600 while every item sits at 130 or 110. Every cut is checked against advisor routing before and after. Two wording fixes close the adjacent findings: the audit's stated purpose names the surface it counts, and the two sk-doc references recommend the invocation the doctor router accepts.

The full measurement, with the 62-item inventory and the seven over-soft items, is in `spec.md` section 2. Every trim below is bound to the owner's trim rules in `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:262`; this packet changes only its stale invocation line and adds one sentence about the counted surface.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md`)
- [x] Success criteria measurable (each requirement names its check)
- [x] Dependencies identified (`spec.md` dependencies)

### Definition of Done
- [x] All acceptance criteria met (see the requirement disposition in `implementation-summary.md`)
- [x] Tests passing (if applicable) (gates listed in `implementation-summary.md` Verification)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Measure, cut, re-measure, prove routing. Content edits under an owner contract, then provenance re-sync: a description lives in one canonical file, the audit sums those files, the advisor scores prompts against their terms, the runtime mirror generators copy them verbatim, and the compiled route manifests pin the hub `SKILL.md` hashes.

### Key Components

- **`.skilled/commands/doctor/scripts/audit_descriptions.py`**: the measurement. Walks `.skilled/skills/*/SKILL.md`, `.skilled/commands/**/*.md` and the two agent trees (deduped by name), and reports total, headroom, top-N, OVER-SOFT and HARD-FAIL.
- **`.skilled/skills/sk-doc/shared/assets/skill-contract.json`**: the constants, at lines 49 to 58. Soft target 130 for skills and agents, 110 for commands, hard cap 1,536, project ceiling 5,600.
- **`frontmatter-templates.md` section Description Budget & Trim Style**: the owner of the DROP and KEEP rules. Every cut cites it.
- **`quick_validate.py`**: the per-skill create-time gate. Warns on soft-target overrun, fails at the hard cap.
- **`advisor_recommend`**: the routing referee. One representative prompt per trimmed item, run before and after.
- **The runtime mirror generators**: `sync-agents-pi.cjs`, `sync-prompts-pi.cjs`, `sync-agents.cjs`, `sync-prompts.cjs`, `sync-skills-hermes.cjs`, `sync-prompts-hermes.cjs`. Each has a `--check` mode; all pass at baseline.
- **`compiled-route-guard.cjs`**: hub routing freshness. All seven hubs report fresh at baseline; a `SKILL.md` edit can stale one.
- **`.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs`**: the command catalog and the hand-kept hub `command-metadata.json` descriptions, checked against command frontmatter. Reports `STATUS=OK` at baseline.

### Data Flow

A description is authored once: in a `SKILL.md`, a command `.md` or an agent `.md`. The audit reads those canonical files and sums them. The advisor scores a prompt against their terms and returns a ranked skill. The mirror generators copy each description verbatim into the Pi, Codex and Hermes dialects, and the compiled route manifests pin the hub `SKILL.md` hashes. A trim therefore has to travel: edit the canonical file, re-measure with the audit, re-run the routing prompt, regenerate the mirrors, and re-check the hub manifests.

### Stage-1 trim candidates

Planning-time candidates for the seven, each measured with `python3 -c` against the same character count the audit uses. The build re-measures after the edit and may adjust wording; what it may not drop is the KEEP set, the name token, the primary verb, the primary domain noun, any mode suffix and any numeric specificity.

| Item | Now | Candidate | What the candidate drops | What it keeps |
|------|----:|----------:|--------------------------|---------------|
| `sk-code` | 405 | 128 | The four mode-name enumerations, the em-dash clause, `holds no per-mode logic`, the `mode-registry.json` dispatch tail | `code`, quality and review modes, surface packets, `implement/debug/verify`, stack knowledge |
| `design` (agent) | 267 | 122 | The three child skill names and the `decides ... via` mechanics | `design`, `sk-design`, values and behavior, Style Reference, charts and diagrams, `LEAF` |
| `cli-classifier` | 155 | 113 | `Holds no packet-local logic.` | classifier judgment, `cli-jev`, `cli-deem`, hosted and local, transport, `mode-registry.json` |
| `cli-external-orchestration` | 149 | 109 | `Holds no per-mode logic;` | external CLI dispatch, seven workflow modes, `mode-registry.json`, `workflowMode` |
| `system-spec-kit` | 147 | 129 | `Unified`, the joining conjunction | spec-folder workflow, context preservation, `Levels 1-3+`, validation, trigger-index, ripgrep retrieval, required for file changes |
| `sk-doc` | 144 | 123 | `OpenCode-`, `packet goals` | documentation and authoring hub, skills, agents, commands, READMEs, catalogs, playbooks, changelogs, frontmatter |
| `sk-design` | 135 | 116 | The `that is being asked for` padding | design parent hub, one design identity, the owning mode, `sk-design-fundamentals` |

Candidate text, in order: `Code skill: quality/review workflow modes and read-only surface packets for implement/debug/verify doctrine and stack knowledge.` / `Design specialist across the sk-design modes: values and behavior, Style Reference measurement, charts and diagrams. LEAF.` / `Routes classifier judgment requests to the cli-jev (hosted) or cli-deem (local) transport via mode-registry.json.` / `Parent hub for external CLI dispatch: seven workflow modes routed through mode-registry.json by workflowMode.` / `Spec-folder workflow, context preservation: Levels 1-3+, validation, trigger-index, ripgrep retrieval. Required for file changes.` / `Documentation and component-authoring hub: skills, agents, commands, READMEs, catalogs, playbooks, changelogs, frontmatter.` / `Design parent hub: routes one design identity to the mode owning the decision, starting with sk-design-fundamentals.`

Together they cut 562 characters: 1,402 to 840. The project total then stands at 6,289, so the stage-2 pass must find 689 more across the other 55 descriptions, about 12.5 characters each. That is the number to beat, and it is why stage 2 is not optional.

### Stage-2 rule

Examine the remaining descriptions largest first. Cut only what the trim rules list as DROP: product enumerations, stack lists, marketing prose, parenthetical jargon. Stop each item when only KEEP-class content is left: the name token, the primary verb, the primary domain noun, mode suffixes such as `:auto` and `:confirm`, and numeric specifics. Re-run the audit after each batch and stop the pass the moment the total is at or under 5,600; do not trim past the ceiling for tidiness.

If the pass reaches its floor above 5,600, stop cutting and record the result. The fleet at its per-item targets totals 7,340 characters (14 skills and 12 agents at 130, 36 commands at 110) against a 5,600 ceiling, so the two constants cannot both hold for 62 items, and reaching the ceiling requires an average near 90 characters per description. That arithmetic is the finding to report, not a reason to cut a routing token.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

1. **Baseline.** Run the audit and save the run; snapshot the seven descriptions with paths and lengths; capture the advisor recommendations for the representative prompts; read the trim rules and write the floor rule into `scratch/trim-plan.md`; record the baseline exit codes for the mirror checkers, the route guard and the route validator.
2. **Stage 1, the seven.** Edit the seven canonical files, with the `design` agent edited in both `.skilled/agents/design.md` and `.claude/agents/design.md` in one task. Verify immediately: audit reports no OVER-SOFT, and each trimmed skill passes `quick_validate.py` without a length warning.
3. **Stage 2, the fleet.** Run the rule-bound pass from the plan's stage-2 rule, re-measuring with the audit until the total is at or under 5,600 or every item is at its floor. Record each item's disposition.
4. **Wording fixes.** Reword the audit's stated surface in the audit docstring and the workflow `purpose:` line, add the matching sentence to the budget section of `frontmatter-templates.md`, and replace the rejected `:auto` invocation in both sk-doc references.
5. **Provenance re-sync.** Regenerate the Pi, Codex and Hermes copies of everything that changed, refresh the hand-kept hub command metadata for any trimmed command a hub mirrors, and run every checker.
6. **Verification and record.** Re-run the audit and the advisor prompts, diff the routing table, run the route guard, the route validator and the packet validator, then fill `implementation-summary.md` with the measured numbers and any residual.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There are no unit tests to add: the deliverables are description strings, and the repository already ships the gates that read them. The verification tasks in `tasks.md` Phase 3 run, in order:

- `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root "$PWD"` for the total, the OVER-SOFT list and the HARD-FAIL list.
- `python3 .skilled/skills/sk-doc/scripts/quick_validate.py .skilled/skills/<name>` per trimmed skill, reading the description warning out of its output.
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file> --type agent` and `--type command` for the trimmed agent and command files.
- `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"..."}' --format json` for each representative prompt, before and after.
- The six mirror `--check` runs plus `sync-runtime-mirrors.cjs --check` and `command-catalog-mirror-check.cjs`.
- `node .skilled/bin/compiled-route-guard.cjs` for hub routing freshness.
- `bash .skilled/commands/doctor/scripts/route-validate.sh` after the doctor workflow purpose edit.
- `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/064-description-budget --strict` for the packet.

The negative checks are the ones that must come back empty: no OVER-SOFT item, no HARD-FAIL item, no match for `doctor skill-budget :auto` under `.skilled`, and no `goal-opencode.md` or `vision.md` under `.claude/commands`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The advisor daemon, for the routing check. Probe it with `advisor_status`; exit 75 is a retryable daemon error. If it stays unavailable, record that and fall back to a KEEP-token presence check per trimmed item, naming the fallback in `implementation-summary.md`.
- The doctor audit script and its workflow asset, owned by the doctor subsystem. This packet edits their text only and reruns the audit and `route-validate.sh` afterwards.
- The runtime mirror generators and their `--check` modes, all passing at baseline: Pi agents 12 in sync, Codex agents 12 in sync, Hermes skill copies 71 in sync, Pi, Codex and Hermes prompts 34 each in sync, 174 symlink mirrors across 8 trees in sync, command catalog `STATUS=OK`, all seven hubs fresh.
- The trim rules in `frontmatter-templates.md`, which this packet follows rather than rewrites.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the description lines with git, file by file: every edit is a single frontmatter line in a tracked file, and the generated mirrors rebuild from the canonical text with the same sync commands. No runtime state is migrated and no database is written; if an advisor rebuild was run because the index reported stale, it is content-derived and rebuilds from the same files. Reverting a single description is also the per-item remedy when the routing check moves a recommendation for a reason the trim caused.
<!-- /ANCHOR:rollback -->

---
