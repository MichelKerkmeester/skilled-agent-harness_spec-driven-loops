---
title: "Goal: Phase 1: render-checks-and-gate"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "render checks and gate goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-skill-readability-refinement/014-sk-create-skill-refinements/001-render-checks-and-gate"
    last_updated_at: "2026-11-05T06:39:43Z"
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
# Goal: Phase 1: render-checks-and-gate

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The shared validator checks every render rule the review marks checkable, the sk-create-skill gate is strict everywhere, and CI sweeps the fleet and ratchets the render ledger.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Advisory until 003, per the operator decision of 2026-11-05. New render codes sit in `RENDER_STAGED_CODES` and newly scanned scopes in `RENDER_STAGED_SCOPES` in `package_skill.py`. Their findings print as `render advisory:` and `--strict` does not promote them. The ledger `debt` stays `{}` and the ratchet allows staged entries only to be removed |
| D2 | The fleet sweep and the render ratchet run as steps in `.github/workflows/sk-doc-script-tests.yml` |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`, and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/*.test.cjs` reports `fail 0`
- [ ] `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/render-known-debt-ratchet.test.cjs` reports `fail 0`, and fails on a copy with a debt entry or a staged code added
- [ ] `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py <skill> --check --strict` exits 0 for each of the 13 skills, with staged findings printed as `render advisory:` warnings, and the ledger `debt` prints `{}`
- [ ] `node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `fail 0`
- [ ] `rg -n "frontmatter only" .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` prints nothing, and each gate command in sk-create-skill SKILL.md, README and creation-workflow ends in `--strict`
- [ ] `RENDER_STAGED_OFF=1` makes `package_skill.py --check --strict` exit non-zero on a fixture skill with a staged finding, and `rg -n "render-known-debt-ratchet" .github/workflows/sk-doc-script-tests.yml` prints the ratchet step
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
| Baselines | Done | 13 of 13 skills exit 0 under `--check --strict`, `run-script-tests.sh` 49 PASS, sk-create-skill node 103/103, compiled-route 101/101 |
| T001 baselines | Done | start 9a6ee36f6f; strict 13/13 exit 0; all sk-doc script tests passed; create-skill node i pass 103 i fail 0 ; compiled-route pass 101 fail 0 |
| Phase 001 review | Fixed | opus-medium on the uncommitted diff over 9a6ee36f6f: VERDICT FIX, 1 P1 and 7 P2. Fixed: related matcher now a leading related token without a colon topic, CI sweep covers 42 modes, OVERVIEW subsections must open it, fenced block under H1 is an intro, scope-gate docstring, ratchet comment, code-staging test. Kept: render_h2_sequence beside non_sequential_numbering, since packaging reads only ren... |

### Deviations and findings

| Item | Note |
|------|------|
| Staging decision | The operator rejected seeding the ledger on 2026-11-05 and chose advisory until 003, recorded as ADR-001 in `plan.md` |
| Review line drift | The review cites `creation-workflow.md` Step 6 for the strict gate, but the gate text sits in Step 5 at lines 329-335. Tasks cite the measured lines |
<!-- /ANCHOR:log -->
