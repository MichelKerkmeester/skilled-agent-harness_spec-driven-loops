---
title: Deep Review Strategy
description: Session tracking for the five-iteration MiMo review of the sk-create-goal mode and every cross-repo surface that names it.
trigger_phrases:
  - "sk-create-goal deep review strategy"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - sk-create-goal and cross-repo references

## 1. OVERVIEW

### Purpose

Tracks the five-iteration review of the sk-create-goal mode, the `/create:goal` command, and every surface elsewhere in the repository that names the mode or its rules.

### Usage

- **Init:** Written by the orchestrator from config and the continuity ladder.
- **Per iteration:** The leaf reads Next Focus, reviews its dimension, updates findings and sets the next focus.

---

## 2. TOPIC

Review of `skill:sk-create-goal` at `.skilled/skills/sk-doc/sk-create-goal/`, plus every cross-repo surface that names it: the `/create:goal` command and its runtime prompt mirrors, the five speckit workflows, the goal hooks, the sk-doc hub registries, system-spec-kit's docs, template and validator, the markdown agent across runtimes, the advisor bridges, the create-goal benchmark report, `AGENTS.md` and the root `README.md`.

The operator's three bars for this review:

1. **Perfect sk-doc alignment** of the skill and its manual testing playbook. Measure `SKILL.md`, `README.md`, `references/`, `assets/` and `changelog/` against `.skilled/skills/sk-doc/sk-create-skill/assets/skill/` (the `skill-md-template.md`, `skill-readme-template.md`, `skill-reference-template.md` and `skill-asset-template.md` templates). Measure the playbook against `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/` (`SKILL.md`, `assets/manual-testing-playbook-template.md`, `assets/manual-testing-playbook-snippet-template.md`, `references/common-pitfalls.md`, `references/prompt-voice.md`).
2. **Perfect cross-repo references.** Every path, section number, operation name, command name and quoted rule that another surface uses for this mode must resolve and agree with the mode's canonical text. Canonical homes: `references/budget-and-handoff.md` section 3 (cut order) and section 4 (send rule), `references/parent-and-nested-goals.md` section 6 (precedence and amendments), `references/authoring-standards.md` section 4 (criteria rules). `/create:goal` has six operations: top-level, phase-parent, child, retrofit, phase-add, amend.
3. **Every playbook scenario must be runnable** against what the mode and command actually support.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] correctness
- [ ] security
- [ ] traceability
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Rewriting the 227 older goal files that still carry the removed Operator copy section. They are cut at their next amendment by design.
- The four over-budget parents in other packets (sk-code/007, sk-design/018, sk-design/019, sk-git/028). Their owners cut them.
- The deep-loop runtime, the append gateway and the reducer. They are tooling for this review, not its target.
- Style preferences with no concrete failure. A maintainability finding names what breaks or misleads.

---

## 5. STOP CONDITIONS

- `stopPolicy` is `max-iterations`: all five iterations run. Convergence before iteration 5 is telemetry only, and the next focus broadens instead of stopping.
- Halt on an append-gateway refusal (exit 2) or three consecutive failed iterations.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
[None yet]

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 3
- P2 (Suggestions): 18
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Re-measuring the fixed-cost claims with the shared `extractDurableSlice` module in memory (no scratch packet writes) turned an allowed "inferred figure" into an exact confirmation: 1,004 / 1,624 / 956.
- Line-range citation audit (`awk` dumps of every cited range in `budget-and-handoff.md`) confirmed all but one citation in one pass.
- Comparing claim surfaces against the three implementations side by side surfaced both halves of the budget-boundary defect (the doc claim and the checker divergence).
- In-memory `node -e` probes against the shipped `goal-slice.cjs` module turned two fail-open hypotheses into observed evidence (the interior-`---` frontmatter leak and the 0.9ms to 3,338ms comment-count curve) with zero writes outside the review packet.
- Reading `walkGoalFiles` dirent handling directly ruled out symlink following in one pass instead of building filesystem fixtures.
- Iteration 3: one grep sweep of every `section N`/`§N` pointer across the 89 scope files against the four canonical headings confirmed perfect section landing in a single pass; resolving all 23 AC file:line citations immediately after isolated the one stale row (AC-019) instead of diffing prose.
- Iteration 4: measuring the mode against the four create-skill templates plus the changelog and playbook contracts surfaced five P2s the automated gates pass by design (out-of-enum `contextType` in seven files, a stale cut-order restatement in SKILL.md:108, the README changelog pointer, the v1.0.0.0 changelog shape, and SCG-007's lost voice baseline); an rg HVR sweep and an eight-pair prompt-sync comparison ruled out two whole directions in one call each.
- Next focus (iteration 5, fallback): all four dimensions are covered, so run the cross-reference fallback over the surfaces no iteration line-audited - `.codex/.hermes/.pi/prompts/create-goal.md` and `.skilled/commands/create/assets/create-goal-presentation.txt` against the mode's six operations and the budget-and-handoff send rule.

---

## 9. WHAT FAILED
- Running `goal.cjs packet` on a scratch copy would have written outside the review packet, so the fixed costs were re-measured from the template blocks instead (the focus explicitly allowed this fallback).
- `check-goal.cjs --help` errors with `unknown option` (exit 2) and `goal.cjs --help` falls through to `set`; neither binary exposes help, so tooling behavior had to be read from source (this became R1-P2-003).
- The `resolvePacketDir` symlink case (R2-P2-003) could not be executed: building the fixture would have written outside the review packet, so the finding stays code-derived and says so.
- The `GOAL_NOT_UTF8` path named in the security focus lives in `goal-core.cjs` / `bin/goal.cjs`, outside the 89 review-scope files; that focus item is deferred rather than answered.
- Iteration 3: REQ-008's "playbook section 6" statement was not directly inspected within budget (heading dump covered sections 1-5 plus feature-file headings); that half of the spec_code check is deferred, not passed. The run also overran the 13-call target to 17 because the three mandatory artifact writes and the Step-11 output verification are non-optional; disclosed in iteration-003.md rather than skipped.
- Iteration 3 carry-forward: the dispatch's per-iteration verdict mapping and the agent definition's active-finding mapping disagree; active P1s from iterations 1-2 force CONDITIONAL under the agent definition, and that is what was emitted.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **agent_cross_runtime (overlay)** — FINDING (R3-P2-002). Prompt mirrors (`.codex`, `.hermes`, `.pi`) are wrapper-only diffs around `.skilled/commands/create/goal.md`, each naming the canonical path — consistent. The three generated Hermes skill copies carry unresolvable relative links. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **agent_cross_runtime (overlay)** — FINDING (R3-P2-002). Prompt mirrors (`.codex`, `.hermes`, `.pi`) are wrapper-only diffs around `.skilled/commands/create/goal.md`, each naming the canonical path — consistent. The three generated Hermes skill copies carry unresolvable relative links.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **agent_cross_runtime (overlay)** — FINDING (R3-P2-002). Prompt mirrors (`.codex`, `.hermes`, `.pi`) are wrapper-only diffs around `.skilled/commands/create/goal.md`, each naming the canonical path — consistent. The three generated Hermes skill copies carry unresolvable relative links.

### **checklist_evidence (core)** — FINDING (R3-P2-001). All file:line citations in `acceptance-criteria.md` resolved; AC-019's `README.md:988` is stale by two lines. AC rows citing V-commands only were not re-executed (validators out of scope per dispatch). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **checklist_evidence (core)** — FINDING (R3-P2-001). All file:line citations in `acceptance-criteria.md` resolved; AC-019's `README.md:988` is stale by two lines. AC rows citing V-commands only were not re-executed (validators out of scope per dispatch).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence (core)** — FINDING (R3-P2-001). All file:line citations in `acceptance-criteria.md` resolved; AC-019's `README.md:988` is stale by two lines. AC rows citing V-commands only were not re-executed (validators out of scope per dispatch).

### **feature_catalog_code (overlay)** — VERIFIED. `feature-catalog.md:35` and `packet-authored-registry-routing.md:28` list `sk-create-goal` among the 15 workflow modes; `mode-registry.json:567-588` entry (`workflowMode`/`packet`/`packetSkillName`/`command: /create:goal`), `hub-router.json:178`, `leaf-manifest.json:110`, `command-metadata.json:456-485`, `description.json:36`, `graph-metadata.json:451` all agree. Version parity: skill `version: 1.2.0.0` matches `changelog/v1.2.0.0.md` and the Hermes copy (`:5`); hub version `2.1.0.0` is a separate namespace consistently applied. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **feature_catalog_code (overlay)** — VERIFIED. `feature-catalog.md:35` and `packet-authored-registry-routing.md:28` list `sk-create-goal` among the 15 workflow modes; `mode-registry.json:567-588` entry (`workflowMode`/`packet`/`packetSkillName`/`command: /create:goal`), `hub-router.json:178`, `leaf-manifest.json:110`, `command-metadata.json:456-485`, `description.json:36`, `graph-metadata.json:451` all agree. Version parity: skill `version: 1.2.0.0` matches `changelog/v1.2.0.0.md` and the Hermes copy (`:5`); hub version `2.1.0.0` is a separate namespace consistently applied.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **feature_catalog_code (overlay)** — VERIFIED. `feature-catalog.md:35` and `packet-authored-registry-routing.md:28` list `sk-create-goal` among the 15 workflow modes; `mode-registry.json:567-588` entry (`workflowMode`/`packet`/`packetSkillName`/`command: /create:goal`), `hub-router.json:178`, `leaf-manifest.json:110`, `command-metadata.json:456-485`, `description.json:36`, `graph-metadata.json:451` all agree. Version parity: skill `version: 1.2.0.0` matches `changelog/v1.2.0.0.md` and the Hermes copy (`:5`); hub version `2.1.0.0` is a separate namespace consistently applied.

### **playbook_capability (overlay)** — DEFERRED. The playbook-scenario runnability bar belongs to a later focus; not entered this iteration. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **playbook_capability (overlay)** — DEFERRED. The playbook-scenario runnability bar belongs to a later focus; not entered this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **playbook_capability (overlay)** — DEFERRED. The playbook-scenario runnability bar belongs to a later focus; not entered this iteration.

### **skill_agent (overlay)** — VERIFIED. `.codex/agents/markdown.toml:53,196` names `/create:goal` and the three goal templates consistently with `.skilled/agents/markdown.md`; the `.claude`/`.pi`/`.hermes` copies differ from canonical by frontmatter conversion only within inspected hunks (body parity beyond the first diff hunk bounded — Edge Cases). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **skill_agent (overlay)** — VERIFIED. `.codex/agents/markdown.toml:53,196` names `/create:goal` and the three goal templates consistently with `.skilled/agents/markdown.md`; the `.claude`/`.pi`/`.hermes` copies differ from canonical by frontmatter conversion only within inspected hunks (body parity beyond the first diff hunk bounded — Edge Cases).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent (overlay)** — VERIFIED. `.codex/agents/markdown.toml:53,196` names `/create:goal` and the three goal templates consistently with `.skilled/agents/markdown.md`; the `.claude`/`.pi`/`.hermes` copies differ from canonical by frontmatter conversion only within inspected hunks (body parity beyond the first diff hunk bounded — Edge Cases).

### **spec_code (core)** — VERIFIED with one deferred half. REQ-001/REQ-003 section ownership: `budget-and-handoff.md` §3 = "CUT IN THIS ORDER" and §4 = "WHAT A PARENT GOAL SENT IN CHAT CONTAINS" match every pointer's claim. REQ-008: `system-spec-kit/README.md:232` states the `--phase` child-only and `--level phase-parent --with-goal` parent behavior; `template-guide.md:187` states the child-only half and "Both work at every level"; `create.sh:285,296,1655,1888-1890` agrees. REQ-009: `SKILL.md:61` admits `/create:goal` ("`goal.md` may also come from `/create:goal`"). REQ-010: `SKILL.md:160` HOOKS keywords contain none of "packet goal", "goal.md", "nested goal" and keep the goal-hook vocabulary. REQ-015: `validation-rules.md:709,722` and `spec-doc-structure.ts:1050-1053` name the section 3 cut order and `/create:goal <parent> phase-add`. Deferred: REQ-008's "playbook section 6" statement (see Edge Cases). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **spec_code (core)** — VERIFIED with one deferred half. REQ-001/REQ-003 section ownership: `budget-and-handoff.md` §3 = "CUT IN THIS ORDER" and §4 = "WHAT A PARENT GOAL SENT IN CHAT CONTAINS" match every pointer's claim. REQ-008: `system-spec-kit/README.md:232` states the `--phase` child-only and `--level phase-parent --with-goal` parent behavior; `template-guide.md:187` states the child-only half and "Both work at every level"; `create.sh:285,296,1655,1888-1890` agrees. REQ-009: `SKILL.md:61` admits `/create:goal` ("`goal.md` may also come from `/create:goal`"). REQ-010: `SKILL.md:160` HOOKS keywords contain none of "packet goal", "goal.md", "nested goal" and keep the goal-hook vocabulary. REQ-015: `validation-rules.md:709,722` and `spec-doc-structure.ts:1050-1053` name the section 3 cut order and `/create:goal <parent> phase-add`. Deferred: REQ-008's "playbook section 6" statement (see Edge Cases).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (core)** — VERIFIED with one deferred half. REQ-001/REQ-003 section ownership: `budget-and-handoff.md` §3 = "CUT IN THIS ORDER" and §4 = "WHAT A PARENT GOAL SENT IN CHAT CONTAINS" match every pointer's claim. REQ-008: `system-spec-kit/README.md:232` states the `--phase` child-only and `--level phase-parent --with-goal` parent behavior; `template-guide.md:187` states the child-only half and "Both work at every level"; `create.sh:285,296,1655,1888-1890` agrees. REQ-009: `SKILL.md:61` admits `/create:goal` ("`goal.md` may also come from `/create:goal`"). REQ-010: `SKILL.md:160` HOOKS keywords contain none of "packet goal", "goal.md", "nested goal" and keep the goal-hook vocabulary. REQ-015: `validation-rules.md:709,722` and `spec-doc-structure.ts:1050-1053` name the section 3 cut order and `/create:goal <parent> phase-add`. Deferred: REQ-008's "playbook section 6" statement (see Edge Cases).

### `check-goal.cjs` argv paths: `--root` and the packet argument resolve anywhere (`check-goal.cjs:548`, `:669`) but the tool is read-only, operator-invoked and documents no containment promise, so this is recorded as contrast under R2-P2-004 rather than a separate finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `check-goal.cjs` argv paths: `--root` and the packet argument resolve anywhere (`check-goal.cjs:548`, `:669`) but the tool is read-only, operator-invoked and documents no containment promise, so this is recorded as contrast under R2-P2-004 rather than a separate finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `check-goal.cjs` argv paths: `--root` and the packet argument resolve anywhere (`check-goal.cjs:548`, `:669`) but the tool is read-only, operator-invoked and documents no containment promise, so this is recorded as contrast under R2-P2-004 rather than a separate finding.

### Advisor-bridge naming drift across `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py`: all three agree on `/create:goal` and `sk-create-goal`. Do not re-audit. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Advisor-bridge naming drift across `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py`: all three agree on `/create:goal` and `sk-create-goal`. Do not re-audit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Advisor-bridge naming drift across `command-bridges.generated.json`, `projection.ts`, `skill_advisor.py`: all three agree on `/create:goal` and `sk-create-goal`. Do not re-audit.

### agent_cross_runtime: not exercised this iteration; the mirror-link defect R3-P2-002 raised in iteration 3 remains open and was not re-entered. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: agent_cross_runtime: not exercised this iteration; the mirror-link defect R3-P2-002 raised in iteration 3 remains open and was not re-entered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: not exercised this iteration; the mirror-link defect R3-P2-002 raised in iteration 3 remains open and was not re-entered.

### An in-scope send surface printing frontmatter, comments or durable-slice text to chat: `create-goal-presentation.txt:113` and the workflow handoff step print only `chat_slice`. The only observed exposure path is R2-P1-001. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: An in-scope send surface printing frontmatter, comments or durable-slice text to chat: `create-goal-presentation.txt:113` and the workflow handoff step print only `chat_slice`. The only observed exposure path is R2-P1-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An in-scope send surface printing frontmatter, comments or durable-slice text to chat: `create-goal-presentation.txt:113` and the workflow handoff step print only `chat_slice`. The only observed exposure path is R2-P1-001.

### Changelog format drift in `v1.1.0.0.md` and `v1.2.0.0.md` - both satisfy the compact contract (summary narrative, What's New at a Glance, Upgrade). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Changelog format drift in `v1.1.0.0.md` and `v1.2.0.0.md` - both satisfy the compact contract (summary narrative, What's New at a Glance, Upgrade).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changelog format drift in `v1.1.0.0.md` and `v1.2.0.0.md` - both satisfy the compact contract (summary narrative, What's New at a Glance, Upgrade).

### Corpus walk following symlinks out of `specs/`: dirent `isFile`/`isDirectory` are lstat-based and both false for symlinks, so `walkGoalFiles` neither follows nor collects them (check-goal.cjs:429-435). Unreadable directories are caught and reported (check-goal.cjs:423-426). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Corpus walk following symlinks out of `specs/`: dirent `isFile`/`isDirectory` are lstat-based and both false for symlinks, so `walkGoalFiles` neither follows nor collects them (check-goal.cjs:429-435). Unreadable directories are caught and reported (check-goal.cjs:423-426).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Corpus walk following symlinks out of `specs/`: dirent `isFile`/`isDirectory` are lstat-based and both false for symlinks, so `walkGoalFiles` neither follows nor collects them (check-goal.cjs:429-435). Unreadable directories are caught and reported (check-goal.cjs:423-426).

### feature_catalog_code: not applicable - the package ships no `feature-catalog/`, and the root playbook records that absence per scenario. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: feature_catalog_code: not applicable - the package ships no `feature-catalog/`, and the root playbook records that absence per scenario.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: not applicable - the package ships no `feature-catalog/`, and the root playbook records that absence per scenario.

### Missing or out-of-order required sections in SKILL.md and README.md against the create-skill templates. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Missing or out-of-order required sections in SKILL.md and README.md against the create-skill templates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing or out-of-order required sections in SKILL.md and README.md against the create-skill templates.

### playbook_capability (overlay): the nine display fields are present in every scenario execution table (Feature ID, Feature Name, Scenario Name / Objective, Exact Prompt, Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria, Failure Triage at each scenario's table header), and all eight root summary prompts match their scenario contract and section 3 copies word for word (root playbook summary lines 31, 49, 67, 85, 103, 121, 139, 157). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: playbook_capability (overlay): the nine display fields are present in every scenario execution table (Feature ID, Feature Name, Scenario Name / Objective, Exact Prompt, Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria, Failure Triage at each scenario's table header), and all eight root summary prompts match their scenario contract and section 3 copies word for word (root playbook summary lines 31, 49, 67, 85, 103, 121, 139, 157).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability (overlay): the nine display fields are present in every scenario execution table (Feature ID, Feature Name, Scenario Name / Objective, Exact Prompt, Exact Command Sequence, Expected Signals, Evidence, Pass/Fail Criteria, Failure Triage at each scenario's table header), and all eight root summary prompts match their scenario contract and section 3 copies word for word (root playbook summary lines 31, 49, 67, 85, 103, 121, 139, 157).

### Prompt desync between root summaries and scenario contracts - all eight pairs compared, none differ. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Prompt desync between root summaries and scenario contracts - all eight pairs compared, none differ.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt desync between root summaries and scenario contracts - all eight pairs compared, none differ.

### RCAF misuse in scenario prompts - all canonical prompts are natural-human and the actor is an operator, matching the default split in `prompt-voice.md`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: RCAF misuse in scenario prompts - all canonical prompts are natural-human and the actor is an operator, matching the default split in `prompt-voice.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: RCAF misuse in scenario prompts - all canonical prompts are natural-human and the actor is an operator, matching the default split in `prompt-voice.md`.

### Registry omission of the mode from an exhaustive registry: no exhaustive registry omits it; `leaf-scopes`/`leaf-aliases` are partial by design. Do not re-audit. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Registry omission of the mode from an exhaustive registry: no exhaustive registry omits it; `leaf-scopes`/`leaf-aliases` are partial by design. Do not re-audit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Registry omission of the mode from an exhaustive registry: no exhaustive registry omits it; `leaf-scopes`/`leaf-aliases` are partial by design. Do not re-audit.

### Section-pointer drift (wrong section number landing): every `section N` / `§N` pointer in scope resolves to the heading holding that content. Do not re-audit. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Section-pointer drift (wrong section number landing): every `section N` / `§N` pointer in scope resolves to the heading holding that content. Do not re-audit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Section-pointer drift (wrong section number landing): every `section N` / `§N` pointer in scope resolves to the heading holding that content. Do not re-audit.

### skill_agent (overlay): `.skilled/agents/deep-review.md` loaded as the agent definition; the mode's RULES subsections match the create-skill template naming requirement (ALWAYS, NEVER, ESCALATE IF). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: skill_agent (overlay): `.skilled/agents/deep-review.md` loaded as the agent definition; the mode's RULES subsections match the create-skill template naming requirement (ALWAYS, NEVER, ESCALATE IF).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent (overlay): `.skilled/agents/deep-review.md` loaded as the agent definition; the mode's RULES subsections match the create-skill template naming requirement (ALWAYS, NEVER, ESCALATE IF).

### spec_code and checklist_evidence (core protocols): not exercised - this pass reviews published skill documentation, not spec-to-code mapping. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: spec_code and checklist_evidence (core protocols): not exercised - this pass reviews published skill documentation, not spec-to-code mapping.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code and checklist_evidence (core protocols): not exercised - this pass reviews published skill documentation, not spec-to-code mapping.

### Stale citations in the other four AC file:line rows (AC-001, AC-002, AC-009, AC-017 + AC-019's hooks half): all resolve exactly at the cited lines. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Stale citations in the other four AC file:line rows (AC-001, AC-002, AC-009, AC-017 + AC-019's hooks half): all resolve exactly at the cited lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale citations in the other four AC file:line rows (AC-001, AC-002, AC-009, AC-017 + AC-019's hooks half): all resolve exactly at the cited lines.

### Template regex injection from asset files: `TEMPLATE_BLOCK` (check-goal.cjs:35) is a fixed pattern and asset text is matched-against data; a missing block throws at module load (check-goal.cjs:275), a crash rather than an injection. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Template regex injection from asset files: `TEMPLATE_BLOCK` (check-goal.cjs:35) is a fixed pattern and asset text is matched-against data; a missing block throws at module load (check-goal.cjs:275), a crash rather than an injection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Template regex injection from asset files: `TEMPLATE_BLOCK` (check-goal.cjs:35) is a fixed pattern and asset text is matched-against data; a missing block throws at module load (check-goal.cjs:275), a crash rather than an injection.

### Version drift across SKILL.md, README.md, the changelogs and `mode-registry.json` - aligned at 1.2.0.0. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Version drift across SKILL.md, README.md, the changelogs and `mode-registry.json` - aligned at 1.2.0.0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Version drift across SKILL.md, README.md, the changelogs and `mode-registry.json` - aligned at 1.2.0.0.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Fixed-cost drift in `budget-and-handoff.md` section 6: measured exactly, all three figures match (do not re-measure).
- Six-operation gap or rename across `goal.md` and the three assets: all six identical and workflow-backed (do not re-audit names; D3 may still check wording parity).
- Chat-slice projection adding text or the ok-gate being exclusive at 4,000: invariant holds in code and every scanned restatement agrees.
- Remaining cited line ranges in `budget-and-handoff.md` (manifest 24-28, goal.cjs 203-216, goal-slice 52-63/73-80/107-119/268-285/380-387, README 75-84, goal-plugin 155-170, goal-cursor 10/14-19): all resolve.
- `check-goal.cjs` corpus walk symlink following or crash on unreadable directories (dirent lstat semantics; errors caught and reported): do not re-audit.
- An in-scope send surface printing frontmatter, comments or durable-slice text to chat: `create-goal-presentation.txt:113` renders only `{chat_slice}`; the one observed exposure path is the parser leak R2-P1-001.
- Regex construction from the goal asset templates (fixed `TEMPLATE_BLOCK`, asset text is matched-against data, missing block throws at module load): do not re-audit.

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- dimension: none remaining (4 of 4 covered); iteration 5 runs the agent definition's cross-reference fallback. - focus area: cross-repo surfaces naming the mode that no iteration has line-audited - the three runtime prompt mirrors (`.codex/prompts/create-goal.md`, `.hermes/prompts/create-goal.md`, `.pi/prompts/create-goal.md`) and `.skilled/commands/create/assets/create-goal-presentation.txt` against the mode's six operations and the budget-and-handoff send rule. - reason: cross-repo naming agreement is the one review direction no dimension covered end to end. - rotation status: fallback (no dimension left to rotate). - blocked/productive carry-forward: productive - iteration 3's section-pointer sweep isolated one stale row in 23 citations in one pass, and the same technique applies to the prompt mirrors. - required evidence: quoted prompt text against the canonical operation names and the send rule.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

Continuity ladder: `012-goal-send-and-dedupe/implementation-summary.md` records the phase as complete on 2026-09-26, uncommitted. The phase wrote the send rule and the cut order once in `budget-and-handoff.md`, removed author instructions from `goal.md.tmpl` and the three asset templates, and replaced restatements in system-spec-kit, the speckit workflows, `AGENTS.md` and the resend reminder with pointers. Phase 009's playbook run is recorded at `.skilled/skills/sk-doc/benchmark/reports/2026-09-26--manual-testing-playbook--create-goal/`.

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Target pointers: the 89 files in `deep-review-config.json` `reviewScopeFiles`.
- Behavior claims: `012-goal-send-and-dedupe/spec.md` REQ-001 to REQ-018 and `acceptance-criteria.md` AC-001 to AC-023. The chat slice is a deletion-only projection of the durable slice. The 4,000 limit is measured on the durable slice, comments and anchors included. A goal is sent only at `packet_budget=ok`.
- Reuse and conventions: sk-doc create-skill templates for skill files, sk-create-manual-testing-playbook for the playbook, HVR voice rules at `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`.
- Review risks and gaps: the working tree holds other sessions' uncommitted edits outside this scope. Review only the listed files.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | 012 spec REQs vs changed files |
| `checklist_evidence` | core | pending | - | 012 acceptance criteria evidence |
| `skill_agent` | overlay | pending | - | sk-create-goal vs the markdown agent across runtimes |
| `agent_cross_runtime` | overlay | pending | - | `.skilled`, `.claude`, `.codex`, `.pi`, `.hermes` copies |
| `feature_catalog_code` | overlay | pending | - | sk-doc feature catalog vs the mode |
| `playbook_capability` | overlay | pending | - | eight playbook scenarios vs actual support |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
See `reviewScopeFiles` in `deep-review-config.json` (89 files).
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-09-26T17:35:08Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: skill
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Executor: cli-pi, llmgateway/mimo-v2.6-pro, thinking high
- Started: 2026-09-26T17:35:08Z
<!-- MACHINE-OWNED: END -->

## 6. ITERATION LOG (terminal)

- Iteration 5 of 5 (traceability, broadened: `playbook_capability` overlay plus repo-wide sweep) complete. New: R5-P2-001 (SCG-004 cut-order step numbering skips canonical step 3), R5-P2-002 (SCG-005 seeds goal.md.tmpl bytes the mode never writes), R5-P2-003 (goal hooks README's "operator copy" naming collision). Ruled out: scenario signal supportability, mirror/presentation drift. Carry-forward for R1-P1-001: six exemption restatements listed in iteration-005.md. `stopPolicy` is max-iterations and all five iterations have run; the findings registry is the synthesis input.
