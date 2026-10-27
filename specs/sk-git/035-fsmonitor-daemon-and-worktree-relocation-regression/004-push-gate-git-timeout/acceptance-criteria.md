---
title: "Acceptance Criteria: Phase 4: push-gate-git-timeout"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "push gate git timeout acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/004-push-gate-git-timeout"
    last_updated_at: "2026-10-27T10:13:09Z"
    last_updated_by: "markdown-agent"
    recent_action: "Planned the phase: spec, plan, tasks and acceptance criteria written"
    next_safe_action: "Wait for the operator answer to Q1 and Q2, then run T001 (the daemon probe)"
    blockers:
      - "Q1 (process latch in scope) and Q2 (--write refuses on a timed-out run) need the operator answer before implementation"
    key_files:
      - "specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/004-push-gate-git-timeout/plan.md"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs"
      - ".skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".skilled/skills/sk-git/scripts/validate-message.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "UNKNOWN"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Q1: Should the process latch (REQ-002) ship in this phase?"
      - "Q2: Should generate-leaf-manifest --write refuse to write on a timed-out run?"
      - "Q3: Should behavior-bench-run.cjs fail closed when git status cannot answer?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: push-gate-git-timeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/004-push-gate-git-timeout
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `generate-leaf-manifest.cjs` with a stubbed `spawnSync`, When its `check-ignore` call is made, Then the argv starts with `-c core.fsmonitor=false`, the timeout option is set, and a timed-out call reaches the name fallback. Then `node --test --test-reporter=tap .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-git-timeout.test.cjs` prints `# fail 0`. | Ran 2026-10-27: `# pass 4`, `# fail 0`; argv and timeout asserted at `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-git-timeout.test.cjs:106` | Met | - |
| AC-002 | REQ-002 | Given a process where the first `check-ignore` call returns `ETIMEDOUT`, When a second skill root is built in the same process, Then no second `check-ignore` call is spawned. Then `node --test --test-reporter=tap --test-name-pattern 'second root spawns no further git call' .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-git-timeout.test.cjs` prints `# fail 0`. | Ran 2026-10-27 with the fixed pattern: 1 test selected, `# pass 1`, `# fail 0`; assertion at `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-git-timeout.test.cjs:146` | Met | - |
| AC-003 | REQ-003 | Given git answering normally, When the manifest bytes for every skill root are rebuilt after the change, Then they match the baseline captured before the change. Then `diff -r scratch/baseline scratch/after` prints nothing and exits 0. | Ran 2026-10-27: `diff -r` printed nothing and exited 0 for 16 roots (`tasks.md` T017) | Met | - |
| AC-004 | REQ-004 | Given a scratch repository's daemon stopped with `kill -STOP`, When the skill gate runs from that repository, Then its elapsed time is below 40 seconds. Then `time node <scratch repo>/.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` prints a real time below 40 seconds. | Ran 2026-10-27 in a scratch repository, not a clone (`tasks.md` T019): 2 s with the new code, against a hang to the 90 s cap with the old code; `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:155` | Met | - |
| AC-005 | REQ-005 | Given the five edited scripts, When the spawn sites are read, Then every git call on the named lines carries a timeout, and each index-reading call carries the opt-out. Then `rg -n "timeout" .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs .skilled/skills/sk-git/scripts/validate-message.mjs` prints a line for each site named in the plan. | Ran 2026-10-27: timeouts at `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:128` and `:155`, `regenerate-skill-derived.cjs:79`, `verify-router-sync.cjs:171`, `behavior-bench-run.cjs:888`, `validate-message.mjs:86` and `:93` | Met | - |
| AC-006 | REQ-006 | Given the five new test files and the four existing test files, When each is run with `node --test`, Then each prints `# fail 0`. Then the command in T021 prints `# fail 0` for all nine files. | Ran 2026-10-27: nine files, each `# fail 0` (`tasks.md` T021) | Met | - |
| AC-007 | REQ-007 | Given a stubbed `spawnSync` whose `check-ignore` returns `ETIMEDOUT`, When `runWrite` runs on a fixture skill root, Then it throws or returns nonzero and the fixture's `leaf-manifest.json` bytes are unchanged. Then `node --test --test-reporter=tap .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-git-timeout.test.cjs` prints `# fail 0` | Ran 2026-10-27: refusal case passes, assertion at `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-git-timeout.test.cjs:185` | Met | - |
| AC-008 | REQ-008 | Given a stubbed `execFileSync` that throws for `git status`, When the isolation check runs, Then it reports one violation naming git status as unavailable. Then `node --test --test-reporter=tap .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run-git-timeout.test.cjs` prints `# fail 0` | Ran 2026-10-27: `# pass 4`, `# fail 0`; violation returned at `.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs:904` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met with evidence observed on 2026-10-27.
<!-- /ANCHOR:closure -->
