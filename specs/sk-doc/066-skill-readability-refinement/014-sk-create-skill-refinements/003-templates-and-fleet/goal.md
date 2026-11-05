---
title: "Goal: Phase 3: templates-and-fleet"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "templates and fleet goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/003-templates-and-fleet"
    last_updated_at: "2026-11-05T06:39:44Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: templates-and-fleet

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The sk-create-skill templates pass the new render checks, skill READMEs open with OVERVIEW under README render checks, and every new finding across `.skilled/skills` is fixed in form only until the phase 001 staged sets are empty and every render code is enforced.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Skill and mode READMEs open with OVERVIEW, per the operator decision of 2026-11-05 |
| D2 | Every fleet change is form only and each skill commit passes `doc-rewrite-guard.py` with no hard finding. A pinned doc with a finding goes to the operator |
| D3 | Per skill, findings are listed with `RENDER_STAGED_OFF=1`, fixed and committed. The last task empties `RENDER_STAGED_CODES` and `RENDER_STAGED_SCOPES` |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `python3 -c "import sys;sys.path.insert(0,'.skilled/skills/sk-doc/sk-create-skill/scripts');import package_skill as p;print(p.RENDER_STAGED_CODES,p.RENDER_STAGED_SCOPES)"` prints `() ()`, and the `debt` object in `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json` is `{}`
- [ ] `rg -n "^## 1\. AT A GLANCE" .skilled/skills --glob 'README.md' --glob '*readme-template.md'` prints nothing
- [ ] `validate_document.py` prints `Total issues: 0` for `skill-reference-template.md` and `skill-asset-template.md`
- [ ] `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py <skill> --check --strict` exits 0 for each of the 13 skills under `.skilled/skills/`
- [ ] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`, and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` reports `fail 0`
- [ ] `node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `fail 0`
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
| Planning docs | Done | spec, plan, tasks and acceptance criteria authored 2026-11-05 |
| Phase 002 handoff | Pending | waits for the phase 002 commit |
| T001 baseline | Done | start sha 273224bbed; 347 staged findings in 44 units: cli-external-orchestration/cli-claude-code 3, cli-external-orchestration/cli-codex 1, cli-external-orchestration/cli-cursor 3, cli-external-orchestration/cli-devin 1, cli-external-orchestration/cli-hermes 1, cli-external-orchestration/cli-opencode 1, cli-external-orchestration/cli-pi 2, cli-orca 15, mcp-code-mode 3, mcp-tooling/mcp-aside-de... |
| T002 no-Purpose refs | Done | 83 docs, all fixable by inserting Purpose, none frozen; scratch/no-purpose-verdicts.md |
| T003 pinned docs | Done | code-quality-standards.md:17 intro restates description; operator approved an intro-only edit verified by check-rule-copies.js; review-core.md has 0 findings |
| T010 guard rule | Amended | operator 2026-11-05: template hard findings map to T004-T009 in scratch/guard-t010-map.md |
| README switch order | Deviation | renderChecks for readme and README.md scan scope move to after the last fleet fold, so leaf gates stay green between skill commits |
| T010 review | FIX then fixed | opus-medium 2 P1 + 10 P2: inventory heading anchored and tree names read from the inventory section (2 new negatives, mutation-checked), parent README 4.x subsections renumbered, size-table effect column tested, RS-001 wording, stale checklist and size lines, recommended lists drop RELATED RESOURCES. Not changed: hub and packet scaffolds and core-standards fix template keep the hub shape, out o... |

### Deviations and findings

| Item | Note |
|------|------|
| REFERENCES count | `skill-md-template.md` also has its own closing `## 7. REFERENCES AND RELATED RESOURCES` at line 1006, so the target count is 2, not 1 |
<!-- /ANCHOR:log -->
