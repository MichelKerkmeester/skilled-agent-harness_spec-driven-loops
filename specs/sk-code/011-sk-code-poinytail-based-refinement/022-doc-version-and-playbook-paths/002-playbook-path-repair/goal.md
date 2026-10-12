---
title: "Goal: Playbook path repair"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook path repair goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair"
    last_updated_at: "2026-10-12T06:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-022-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Playbook path repair

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Resolve every `BACKTICK_PATH_UNRESOLVED` warning the playbook validator prints, so each playbook reference to a repo file resolves and every warning left has a written reason.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A path that names a file that moved or exists under another base is corrected to the path that resolves. A path to a removed or renamed target is corrected to its successor, or the reference is removed when no successor exists. |
| D2 | Backticked text not meant as a repo path gets the narrowest change: rewrite it so it no longer reads as a path, or a narrow validator rule for one clearly marked class. Never a broad suppression. |
| D3 | The warning stays report-only; the validator still exits 0. |
| D4 | A playbook link correction is doc maintenance, recorded by the doc's own version. No skill is bumped for it. sk-doc is bumped once only if the validator changes. |
| D5 | This phase never edits a `version:` line. The integrator runs phase 001's bump over the changed docs after merging. |
| D6 | Every ledger row ends Fixed with a backticked command proof or Closed with a reason that prevent-overengineering or an operator decision backs. Every warning left is a Remaining row with its reason. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict >/dev/null 2>&1 && n=$(node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict 2>&1 | grep -c BACKTICK_PATH_UNRESOLVED); r=$(grep -cE '^\| RM-[0-9]+ \| .+ \| .+ \|$' specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/implementation-summary.md); [ "$n" = "$r" ] && echo ok`, run from the repository root, prints ok.
- [x] `grep -cE '^\| PP-([0-9]+|V) \| (Fixed|Closed) \|' specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/implementation-summary.md`, run from the repository root, prints 29.
- [x] `grep -E '^\| PP-([0-9]+|V) \| Fixed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/implementation-summary.md | grep -vcF "$(printf '\140')"` prints 0, and `grep -E '^\| PP-([0-9]+|V) \| Closed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/implementation-summary.md | grep -vcE 'prevent-overengineering|operator decision'` prints 0, both run from the repository root.
- [x] `G='^Spec: sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair$'; c=$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills | grep -c '/changelog/'); s=$(git log --no-merges --format= --name-only --diff-filter=A --grep="$G" -- .skilled/skills/sk-doc/changelog | grep -c .); v=$(git log --no-merges --format= --name-only --grep="$G" -- .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs | grep -c .); e=$(git log --no-merges --format= -p --grep="$G" -- '.skilled/skills/*/manual-testing-playbook/*' | grep -cE '^[-+]version:'); [ "$c" = "$s" ] && [ "$s" = "$((v > 0))" ] && [ "$e" = 0 ] && echo ok`, run from the repository root, prints ok.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--level 2` and `--with-goal`; spec.md lists one ledger row per package and the validator row |
| Build | Done | Commits `82c90e85b7`, `f30918f94b`, `3be9030128`, `cd34e1fbbe`: 258 warnings to 1, the one left recorded as RM-1 |
| Review | Done | `/deep:review :auto`, 5 iterations, commit `05aaffc3b9`: CONDITIONAL with 1 P1 and 6 P2 |
| Review fixes | Done | Commit `ed9a3d48e9` fixed four P2. The P1 closed with RM-1 in `implementation-summary.md`, and two P2 were rejected with reasons |

### Deviations and findings

| Item | Note |
|------|------|
| Baseline count | The operator brief measured 252 warnings from 110 paths. The validator at the scaffold commit prints 258 from 113 across 28 packages; the ledger uses the scaffold numbers |
| Two validator rules | Installed release state under `.skilled/release/` and symlinks whose build-output target is missing could not be fixed in the docs, so each got a narrow rule with a test. That bumped sk-doc to 2.3.7.0 |
| Root playbook blind spot | The validator backtick-checks scenario files only. The review found root files still citing paths their scenarios had corrected, and those were fixed with the same replacements |
| Review model id | The cli-pi allowlist accepts `deepseek-v4.1-flash`, which routes to `llmgateway/deepseek-v4.1-flash`. The prefixed id is refused |
<!-- /ANCHOR:log -->
