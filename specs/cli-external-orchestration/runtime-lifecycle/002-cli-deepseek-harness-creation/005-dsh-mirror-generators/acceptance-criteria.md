---
title: "Acceptance Criteria: Phase 5: dsh-mirror-generators"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh mirror generators acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/005-dsh-mirror-generators"
    last_updated_at: "2026-11-06T14:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked AC-001 to AC-005 Met with observed evidence"
    next_safe_action: "None, phase closed"
    blockers: []
    key_files:
      - "evidence/checks.txt"
      - "evidence/closeout-checks.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-005-dsh-mirror-generators"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: dsh-mirror-generators

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/005-dsh-mirror-generators`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a generated farm, When `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs --check` runs, Then it exits 0 and `.dsh/skills/*` counts the `find .skilled/skills -name SKILL.md -not -path '*/node_modules/*' \| wc -l` total minus the printed exclusions | Command output and both counts, recorded in `implementation-summary.md`. Observed: `PASS: 55 skill links are in sync.`, `exit=0`. Farm 55, `find` 55, and none of the printed excluded directories holds a counted `SKILL.md`, so the exclusion term is 0 (`evidence/checks.txt:1-3`, `evidence/checks.txt:16`, `evidence/closeout-checks.txt:79-80`, `evidence/closeout-checks.txt:121-129`) | Met | - |
| AC-002 | REQ-002 | Given generated prompts and personas, When `sync-prompts-dsh.cjs --check` and `sync-agents-dsh.cjs --check` run, Then both exit 0 | Both exit codes recorded. Observed: `PASS: 44 prompt stubs are in sync.` and `PASS: 11 agent patches are in sync.`, each `exit=0` (`evidence/checks.txt:4-9`, `evidence/closeout-checks.txt:81-86`). The 11 persona patches also composed through `dsh --dump-config` from a disposable `DSH_HOME`, each exit 0 with empty stderr, on the orchestrator's record (`evidence/checks.txt:24`) | Met | - |
| AC-003 | REQ-003 | Given the three generator tests, When `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-*-dsh.test.mjs` runs, Then it passes with a duplicate-name case and an over-500-character description warning case | `# fail 0` line and the two test names recorded. Observed: `ℹ tests 8`, `ℹ pass 8`, `ℹ fail 0`, `exit=0`. The cases are `exits with code one and names both paths when frontmatter names collide` and `skips missing metadata with warnings and warns without failing for long descriptions` (`evidence/closeout-checks.txt:104`, range `evidence/closeout-checks.txt:99-105`, `evidence/checks.txt:13`) | Met | - |
| AC-004 | REQ-004 | Given the farm, When `ls .dsh/skills/*/SKILL.md \| wc -l` and `ls -d .dsh/skills/*/ \| wc -l` run, Then the two counts are equal | Both counts recorded. Observed: 55 and 55, and every `readlink` target starts with `../../.skilled/` (`evidence/closeout-checks.txt:122`, `evidence/closeout-checks.txt:125`, `evidence/closeout-checks.txt:131`) | Met | - |
| AC-005 | REQ-005 | Given the CI and doctor wiring, When `rg -n 'dsh-mirror' .github/workflows/command-tree-parity.yml` and `node --test .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs` run, Then the first matches and the second passes | Match line and `# fail 0` recorded. Observed: `130:  dsh-mirror:` and `ℹ pass 7`, `ℹ fail 0`, `exit=0` (`evidence/closeout-checks.txt:119`, `evidence/closeout-checks.txt:116`, `evidence/checks.txt:18`, `evidence/checks.txt:22`) | Met | - |

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

Every criterion is met from output the closeout reran on 2026-11-06. Whether the 55 linked skills load in a keyed session stays UNKNOWN until phase `013-dsh-live-contract-pin`. Every checklist item in `tasks.md` is verified.
<!-- /ANCHOR:closure -->
