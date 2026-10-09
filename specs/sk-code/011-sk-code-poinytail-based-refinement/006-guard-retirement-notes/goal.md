---
title: "Goal: Phase 6: guard-retirement-notes"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/006-guard-retirement-notes"
    last_updated_at: "2026-10-09T17:52:35Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-006-guard-retirement-notes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: guard-retirement-notes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give each retired sk-code guard, the router-sync suite and the Lane C router-mode CI gate, a note that names what partly covers it now, the gap and its owner, in the drift-guard umbrella script, the Lane C benchmark index and the three sk-code-opencode docs that describe the router-sync suite.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every edit is a comment or prose. No executable line in `run-all-drift-guards.sh` and no `DEFAULT_RESOURCE` or `RESOURCE_MAP` entry in `sk-code-opencode/SKILL.md` changes, and no retired guard is revived |
| D2 | The gap owner named in every note is sk-code |
| D3 | The umbrella script comment holds the full router-sync record. `alignment-verification-automation.md` carries the same facts as a table in a new "Retired router-sync suite" subsection placed before "Severity model", and the other docs summarize or point at them |
| D4 | The script-still-runs check compares the after run with a baseline captured at build time: same exit code and same `PASS:`/`FAIL:` lines. It does not require exit 0 |
| D5 | If sk-code compiled routing reports stale after the `SKILL.md` edit, the build records the output and does not re-mint. The commit-time route-remint gate owns the re-mint |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n -e '^# Successor, partial:' -e '^# Gap:' -e 'Owner: sk-code' -e 'routing-registry-drift.yml' .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` prints at least one hit per `-e` pattern, and `rg -n -e '\*\*Successor:\*\*' -e 'Owner of that gap: sk-code' -e 'routing-registry-drift.yml' .skilled/skills/sk-code/benchmark/README.md` prints at least one hit per `-e` pattern
- [ ] For each of `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md`, `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` and `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md`, `rg -c 'routing-registry-drift.yml'` and `rg -c 'sk-code\)|Owner of (the|every) gap'` each print 1 or more, and `rg -c 'has no replacement yet|recorded as missing|nothing checks it now\.'` prints nothing and exits 1
- [ ] Over the four files `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`, `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md`, `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` and `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md`, `rg -l 'union of the surface children' <four files> | wc -l` prints 4 and `rg -l 'qualifiedIdToLeaf' <four files> | wc -l` prints 4
- [ ] `diff <(grep -E '^(PASS|FAIL|rc=|run-all-drift-guards:)' specs/sk-code/011-sk-code-poinytail-based-refinement/006-guard-retirement-notes/scratch/drift-before.txt) <(grep -E '^(PASS|FAIL|rc=|run-all-drift-guards:)' specs/sk-code/011-sk-code-poinytail-based-refinement/006-guard-retirement-notes/scratch/drift-after.txt)` prints nothing, where drift-before.txt and drift-after.txt are both written by `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh > <file> 2>&1; echo "rc=$?" >> <file>`, drift-before.txt before any file under `.skilled/skills/sk-code` is edited and drift-after.txt once editing is done
- [ ] `git diff -U0 -- .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh .skilled/skills/sk-code/sk-code-opencode/SKILL.md | grep -E '^[+-]' | grep -vE '^(\+\+\+|---)' | grep -vE '^[+-][[:space:]]*(#|$)' | grep -v 'The third guard, the'` prints nothing, and `bash -n` and `shellcheck` on `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` both exit 0
- [ ] `python3 .skilled/skills/sk-doc/scripts/validate_document.py --blocking-only <file>` prints `VALID` and exits 0 for each of `.skilled/skills/sk-code/benchmark/README.md`, `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md`, `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` and `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md`, and `python3 .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .skilled/skills/sk-code --check-router` exits 0 with Errors 0 and no `ROUTER-DEAD-PATH`
- [ ] `git diff -U0 -- .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh .skilled/skills/sk-code/benchmark/README.md .skilled/skills/sk-code/sk-code-opencode/scripts/README.md .skilled/skills/sk-code/sk-code-opencode/SKILL.md .skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md | rg '^\+.*\x{2014}'` prints nothing, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/006-guard-retirement-notes --strict` prints `RESULT: PASSED`
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
| Script and Lane C index notes name successor, gap and owner | Done | one hit per pattern in both files |
| Three sk-code-opencode docs point at the successor and owner, stale wording gone | Done | counts 1+ each; stale rg exit 1 |
| Four-check description present in all four router-sync files | Done | 4 and 4 |
| Umbrella script exit code and guard verdicts match the baseline | Done | verdict diff empty, rc=0 |
| Script and router block changes are comment-only, static checks exit 0 | Done | filter empty; bash -n 0; shellcheck 0 |
| Four docs validate and the router check exits 0 | Done | four VALID; Errors 0, no dead path |
| No added em dash, phase validates strict | Done | rg empty; `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Stale leaf manifest from the webflow-checker phase | Freshness check reported `STALE sk-code`; the orchestrator removed an ignored `__pycache__` and regenerated `leaf-manifest.json` (7 entries) |
| Hermes copy regenerated | The edited `sk-code-opencode/SKILL.md` drifted its Hermes copy; the orchestrator regenerated it |
| Diff checks run by the orchestrator | The executor sandbox cannot run `git diff` (fsmonitor socket) |
| No acceptance-criteria.md | Level 1 packet. The criteria come from spec.md REQ-001, REQ-002 and SC-001 and from the Phase 3 Verification tasks in tasks.md |
<!-- /ANCHOR:log -->
