---
title: "Goal: OpenBot parity research for skilled bots"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "openbot parity research goal"
  - "packet goal"
  - "durable directive"
  - "completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research"
    last_updated_at: "2026-11-25T22:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w2-002-goals-parent"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: OpenBot parity research for skilled bots

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Answer what skilled bots must build for OpenBot parity, and how deeply the build plan must be specified, through one research run per child.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One research run per child. The parent holds no research of its own. |
| D2 | The first run ranks the gaps. The second reviews the build plan those gaps produced. The third checks whether each build phase is planned deeply enough to build in one shot. The fourth collects, per build phase, the reference code to lift or mirror and the pitfalls to guard against. |
| D3 | The packet ends at a recommendation, a depth verdict and an evidence pack per build phase. Nothing is built here. |
| D4 | The reference repos under `specs/system-skilled-bots/context/` are read-only inputs. |
| D5 | A child passes `validate.sh --strict` for its own folder before the next child starts. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-openbot-parity-research | `001-openbot-parity-research/goal.md` |
| 002-plan-review-research | `002-plan-review-research/goal.md` |
| 003-plan-depth-research | `003-plan-depth-research/goal.md` |
| 004-reference-evidence-research | `004-reference-evidence-research/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/002-openbot-parity-research --recursive --strict` prints `RESULT: PASSED` for the parent and all four children.
- [x] `find specs/system-skilled-bots/002-openbot-parity-research -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' | wc -l` prints 4, and `rg -c '^\| [0-9]+ \|' specs/system-skilled-bots/002-openbot-parity-research/spec.md` prints 4.
- [x] `rg -c '^## 15\. Ranked Build Order' specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md` prints 1.
- [x] `test -f specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/research.md` exits 0, and `ls specs/system-skilled-bots/002-openbot-parity-research/002-plan-review-research/research/review-*-findings.md | wc -l` prints 5, one file per review round 2 to 6.
- [x] `test -f specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md` exits 0, and that file names a verdict per 003 phase.
- [ ] `test -f specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md` exits 0, and `find specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' | wc -l` prints 40.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Parent spec rewritten as a lean phase parent | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/002-openbot-parity-research --recursive --strict` prints `RESULT: PASSED` for the parent and all three children |
| All three child goals authored | Done | `ls specs/system-skilled-bots/002-openbot-parity-research/00*/goal.md` lists three files |
| Parent goal authored | Done | `node .skilled/hooks/goal/bin/goal.cjs packet specs/system-skilled-bots/002-openbot-parity-research --workspace "$PWD"` reports `packet_budget=ok` |
| Three child folders present | Done | `find specs/system-skilled-bots/002-openbot-parity-research -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' | wc -l` prints 3 |
| Fourth child added | In Progress | `004-reference-evidence-research/` scaffolded and prepared on 2026-11-27, its run not started |

### Deviations and findings

| Item | Note |
|------|------|
| Generated metadata after the move | `repair-derived.cjs --apply` re-derived the moved 001 child's identity and every graph fingerprint, and `generate-description.js` wrote the parent's `description.json`. |
| Review rounds criterion amended | The plan review synthesis does not list its rounds by number, so the criterion checks the five `review-*-findings.md` files instead. |
<!-- /ANCHOR:log -->
