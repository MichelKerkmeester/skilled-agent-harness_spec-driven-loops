---
title: "Goal: Phase 3: engine-docs-and-release"
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
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release"
    last_updated_at: "2026-11-20T10:36:30Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-003-engine-docs-and-release"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: engine-docs-and-release

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The doctor overlay docs, the relayout workflow, the playbook scenarios and the system-skilled-doctor v1.2.0.0 release note state the `framework/` and `root/` default naming rule, the direct-sibling overlay folder and the one migration step, `/doctor:overlay apply --relayout`, and phase 4 gets the Skilled commit id that carries phases 1-3.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No engine code, test or comment changes. Each doc line restates a rule read from `overlay-engine.cjs`. |
| D2 | The relayout plan and its nothing-to-move result come from `offLayout` in `status --json`, not the capped LAYOUT lines. |
| D3 | Minor bump, `1.1.8.0` to `1.2.0.0`. The bump and `changelog/v1.2.0.0.md` land in the docs commit, the last of phases 1-3. |
| D4 | The one write outside this folder is the phase 4 spec's `Target Skilled commit:` line. |
| D5 | Out of scope: `.skilled/commands/doctor/scripts/README.markdown` and generated prompt mirrors. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] In Skilled, `rg -n 'inside the tree' .skilled/commands/doctor/assets/doctor-overlay-presentation.txt` prints only lines that also contain `../<name>`, `rg -n -e 'leading dot dropped' -e 'without its leading dot' .skilled/commands/doctor .skilled/skills/system-skilled-doctor -g '!**/scripts/**' -g '!**/changelog/**'` prints only lines that also contain `root/`, and `rg -n -e 'source[L]ayout' -e 'framework-root' -e 'opt[-]in' .skilled/commands/doctor .skilled/skills/system-skilled-doctor -g '!**/scripts/**' -g '!**/changelog/v1.1*'` prints nothing.
- [x] In Skilled, `rg -n '^#+ Moving an existing tree onto the new layout' .skilled/skills/system-skilled-doctor/references/overlays.md` prints one line, and `awk '/^#+ Moving an existing tree onto the new layout/{f=1;next} f&&/^#/{exit} f' .skilled/skills/system-skilled-doctor/references/overlays.md` prints text containing `apply --relayout`, `offLayout` and `--adopt`.
- [x] In Skilled, `rg -n '^9\. With .--relayout.' .skilled/commands/doctor/overlay.md` prints a line containing `status --json` and `offLayout`, `rg -n 'With relayout.*offLayout' .skilled/commands/doctor/assets/doctor-overlay-apply.yaml` prints at least two lines, `rg -n 'A re-read after a relayout' .skilled/commands/doctor/assets/doctor-overlay-apply.yaml` prints a line containing `offLayout`, `rg -n 'against the tree root' .skilled/commands/doctor/assets/doctor-overlay-repin.yaml .skilled/commands/doctor/assets/doctor-update-apply.yaml` prints one line in each file, and `rg -n '^19\. Render the result' .skilled/commands/doctor/overlay.md` prints a line naming both `/doctor:update record-base` and `/doctor:overlay apply --relayout`.
- [x] In Skilled, `rg -c 'skilled-overlays/skilled|belongs at skilled|-> skilled/|source\\?":\\?"skilled/' .skilled/skills/system-skilled-doctor/manual-testing-playbook` prints nothing, and `rg -c 'SKD-013' .skilled/skills/system-skilled-doctor/manual-testing-playbook/manual-testing-playbook.md` prints `4`.
- [x] In Skilled, `sed -n 5p .skilled/skills/system-skilled-doctor/SKILL.md` prints `version: 1.2.0.0`, and `awk '/^# v1.2.0.0/{f=1;next} /^## /{exit} f' .skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md` prints an intro that names `framework/`, `root/` and `/doctor:overlay apply --relayout`.
- [x] In Skilled, `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` prints `# fail 0`, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0.
- [x] In Skilled, `rg -n 'Target Skilled commit: [0-9a-f]{40}' specs/system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout/spec.md` prints one line, and `git show --name-only --format= <that id>` lists `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md`.
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
| Phase goal authored | Done | `/create:goal ... child :auto` from `goal-phase-child-template.md`, sourced from this phase's `spec.md`, `plan.md` and `tasks.md` |
| T001-T046 | Done | Contract 9/9, `route-validate` exit 0, the residual searches, every doc-task verify and all six scenarios passed (`scratch/evidence/`) |
| T047-T048 | Done | Docs committed as `d42bafc`, merged into `main` as `063daaee2c1`, and that id written on phase 004's `Target Skilled commit:` line |

### Deviations and findings

| Item | Note |
|------|------|
| No `acceptance-criteria.md` | This is a Level 1 phase, which carries none. On the operator's direction the criteria come from the spec's REQ-001 to REQ-011 and SC-001 to SC-003, with the verify commands from `tasks.md`, so the workflow did not stop on the missing file |
| Child verify step | `validate.sh --strict` was not run on this phase during authoring, on the operator's instruction. The read-only no-binding-anchor check was run instead |
| Pinned commit | The operator named the merged `main` commit as phase 004's pin. A merge commit lists no files under plain `git show --name-only`, so the last criterion is checked with `git show -m --first-parent --name-only --format= <id>`, which lists the changelog |
| Scenario residual | SKD-013 builds an old-layout tree on purpose, so the playbook residual search matches its fixture; with that file excluded it prints nothing |
| Commit-id criterion | Checked through `git show` on the recorded id rather than `git log -1`, because a later commit moves HEAD, as the spec's risk table notes |
<!-- /ANCHOR:log -->
