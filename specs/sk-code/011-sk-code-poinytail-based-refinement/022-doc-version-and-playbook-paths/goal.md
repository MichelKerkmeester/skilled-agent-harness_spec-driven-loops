---
title: "Goal: Doc version and playbook paths"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths"
    last_updated_at: "2026-10-12T13:00:00Z"
    last_updated_by: "builder"
    recent_action: "Closed phase 003: root playbook paths checked and corrected, six stale references fixed"
    next_safe_action: "Orchestrator merges worktrees/121-playbook-root-refs to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-022-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Doc version and playbook paths

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every skill doc its own automatically raised version again, and resolve or explain every unresolved backticked playbook path, root files included.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every doc carries its own version (operator decision, 2026-10-12), reversing 021/003's `SKILL.md`-only rule for child docs |
| D2 | 001 and 002 are independent; each builds in its own worktree branched from the scaffold commit. 003 builds from main after both merged |
| D3 | 002 never edits a version; after both merge, the integrator runs 001's bump over 002's changed docs |
| D4 | A Closed row's reason cites prevent-overengineering or an operator decision |
| D5 | sk-doc is bumped once by 001, and once more by 002 only if the validator changes; colliding numbers are renumbered at integration |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-per-doc-versions | `001-per-doc-versions/goal.md` |
| 002-playbook-path-repair | `002-playbook-path-repair/goal.md` |
| 003-playbook-root-and-stale-refs | `003-playbook-root-and-stale-refs/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `cat specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/00*/implementation-summary.md | grep -cE '^\| (PV-R[0-9]+|PP-([0-9]+|V)|RR-(1|2\.[0-9]{2})|SR-[1-6]) \| (Fixed|Closed) \|'`, run from the repository root, prints 57.
- [x] `grep -l 'completion_pct: 100' specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/00*/implementation-summary.md | wc -l | tr -d ' '`, run from the repository root, prints 3.
- [x] `for c in specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/00*/; do node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs $c | tail -1; done | grep -c 'RESULT: PASSED'`, run from the repository root, prints 3.
- [x] `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify`, run from the repository root after the children merge, exits 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths --recursive --strict`, run from the repository root, prints `RESULT: PASSED` 4 times and `RESULT: FAILED` 0 times.
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
| Scaffold | Done | Parent and two children created with create.sh phase mode, `--path`, `--level 2` and `--with-goal`; each child spec lists its ledger rows |
| 001 per-doc versions | Done | Merged onto `worktrees/120-docver-integration`; sk-doc 2.3.7.0 |
| 002 playbook path repair | Done | Merged onto `worktrees/120-docver-integration`; its sk-doc release renumbered 2.3.7.0 to 2.3.8.0 under D5 |
| 003 playbook root and stale refs | Done | Built on `worktrees/121-playbook-root-refs` from origin/main; sk-doc 2.3.9.0; root warnings 70 to 1 (RM-1) |
| Integration | Done | `frontmatter-version.mjs bump --base worktrees/119-docver-per-doc` raised 227 docs 002 changed; criteria 1 to 5 run from the merged tree: 37, 2, 2, verify exit 0, 3 PASSED and 0 FAILED |

### Deviations and findings

| Item | Note |
|------|------|
| Ledger total 57 | 001 has 8 rows (PV-R1 to PV-R8); 002 has 28 package rows and the validator row PP-V; 003 has RR-1, RR-2.01 to RR-2.13 and SR-1 to SR-6 |
<!-- /ANCHOR:log -->
