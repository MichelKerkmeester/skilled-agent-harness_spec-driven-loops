---
title: "Goal: Phase 2: exempt-and-rewrite-guard"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "exempt and rewrite guard goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/002-exempt-and-rewrite-guard"
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
# Goal: Phase 2: exempt-and-rewrite-guard

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** One loader decides every render exemption and protects code-pinned docs, and one shipped rewrite guard blocks dropped code, frontmatter, citations and cited sections in every doc refinement.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Pinned docs sit in a `pinned` list, not the exempt map. Render checks still run on them, and the rewrite guard refuses to change them |
| D2 | The guard is one script, `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py`, with hard checks that exit 1 and advisory checks that only print |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `rg -n -e "FORMAT_SPEC_FILES = " -e "def load_render_exempt" .skilled/skills/sk-doc` prints nothing
- [ ] The loader exits non-zero on a ledger copy with a missing exempt doc key, and the `pinned` list in `render-known-debt.json` names `code-quality-standards.md` and `review-core.md`
- [ ] `doc-rewrite-guard.py` reports `.skilled/skills/system-spec-kit/shared/parsing/README.md` on the replayed `013-system-spec-kit/scratch/diff-1.patch` and exits 0 with no finding on an unchanged tree
- [ ] `rg -n "doc-rewrite-guard.py" .skilled/skills/sk-doc/sk-create-skill/references/skill/` prints a line in `examples-and-maintenance.md` and in `creation-workflow.md`
- [ ] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`, and `package_skill.py <skill> --check --strict` exits 0 for each of the 13 skills
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
| Phase 001 handoff | Pending | waits for the phase 001 commit |

### Deviations and findings

| Item | Note |
|------|------|
| Replay base | `git apply --check` of `diff-1.patch` on the current tree fails, so T001 must find the base it applies to before the fixture is frozen |
<!-- /ANCHOR:log -->
