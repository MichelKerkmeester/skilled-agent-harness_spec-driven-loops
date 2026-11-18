---
title: "Goal: README template conformance"
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
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance"
    last_updated_at: "2026-11-16T19:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "All six completion criteria verified"
    next_safe_action: "None: the program is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "f7735347-b0b1-4b4f-a0cd-c44e70a362ab"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: README template conformance

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Bring all 184 READMEs and SYNC docs that a `sk-create-readme` template covers into line with that template and the Human Voice Rules, stating only facts checked against the code they describe.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each file follows its template's section model, keeps `---` before every numbered H2 and carries no emoji in a heading. |
| D2 | A session that did not write a README checks every path, command and count in it against the code before it is committed. |
| D3 | Out of scope: the root README and root guides, `local-webflow`, code-folder READMEs outside `.skilled/hooks/`, and any change to the templates, the validator or the voice scanner beyond what phases 008 to 010 name. README versions and changelogs are never edited by hand. |
| D4 | Writers and reviewers run one README per session on the executor the operator chose, recorded as Q003 to Q012 in `decision-record.md`. The main session reruns every check before it trusts a result. |
| D5 | Phases run in order. Each phase is committed, merged with origin/main and pushed under sk-git before the next one starts, and the operator's own uncommitted files are never staged. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING
<!-- FILL: List each child phase and its goal path. Name the precedence rule. GOOD: 001 and 002. Decisions here outrank child detail. WEAK: Children are bound. -->

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-skill-readmes | `001-skill-readmes/goal.md` |
| 002-mode-packet-readmes | `002-mode-packet-readmes/goal.md` |
| 003-hook-folder-readmes | `003-hook-folder-readmes/goal.md` |
| 004-hook-runtime-readmes | `004-hook-runtime-readmes/goal.md` |
| 005-runtime-plugin-readmes | `005-runtime-plugin-readmes/goal.md` |
| 006-runtime-folder-readmes | `006-runtime-folder-readmes/goal.md` |
| 007-hook-code-folder-readmes | `007-hook-code-folder-readmes/goal.md` |
| 008-readme-html-conventions | `008-readme-html-conventions/goal.md` |
| 009-repo-rules-readme | `009-repo-rules-readme/goal.md` |
| 010-readme-text-diagrams | `010-readme-text-diagrams/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `validate.sh specs/sk-doc/document-standards/006-readme-template-conformance --recursive --strict` prints `RESULT: PASSED` for the parent and all 10 phase folders.
- [x] `validate_document.py` prints `VALID` and `hvr_scan.py` reports `hard blockers: 0` for each of the 184 files in scope.
- [x] `check-markdown-links.cjs` exits 0 and reports 0 broken links across the repository.
- [x] `test_readme_verdict_parity.py` prints `PARITY PASS` and the sk-doc `run-script-tests.sh` suite exits 0.
- [x] `.skilled/skills/sk-design/README.md` and `.vibe/README.md` both exist on origin/main.
- [x] After the last phase is pushed, `git rev-parse HEAD origin/main` prints the same hash twice.
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
| 001 to 010 | Done | All ten phases pushed. On 2026-11-18 at `45cdcc29428`: strict 11 of 11 `RESULT: PASSED`, 184 files `VALID` with 0 hard blockers, 0 broken links, `PARITY PASS`, suite exit 0, HEAD equal to origin/main |

### Deviations and findings

| Item | Note |
|------|------|
| Writer model | The 001 plan named Opus writers. The operator chose DeepSeek V4.1 Flash at max, recorded as D4. When the DevPass daily cap ran out at the end of phase 002, the operator chose GPT-6 Luna at max on the fast tier through cli-codex, and D4 was amended. |
| Binding rows | Phases 002 to 007 are unplanned scaffolds with placeholder acceptance criteria, so no child goal can be derived yet. `check-goal.cjs` needs every row and strict validation rejects a row whose target is missing, so this file passes both only after all seven child goals exist. Phases 002 to 007 are planned first, their child goals are written, and then this goal is committed and sent. |
| D3 amendment | On 2026-11-18 the operator placed the README alert and fold work in this program as phase 008. It touches the README writing reference and `validate_document.py`, which D3 had kept out of scope, so D3 now names the exception |
| Second D3 amendment | On 2026-11-18 the operator asked for a README in `.skilled/repo-rules/` under the new rule, placed as phase 009. The repo-rules checker and card builder read any README there as a rule, so D3 also names their README skip |
| Third D3 amendment | On 2026-11-18 the operator asked to go back to plain-text diagrams, placed as phase 010. It changes the skill README template, so D3 now points at what phases 008 to 010 name. The operator chose Hy4 Flash Free at high as its writer and reviewer, recorded as Q012 |
<!-- /ANCHOR:log -->
