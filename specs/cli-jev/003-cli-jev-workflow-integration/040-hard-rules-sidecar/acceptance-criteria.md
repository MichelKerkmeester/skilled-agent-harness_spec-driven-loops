---
title: "Acceptance Criteria: Phase 40: hard-rules-sidecar"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hard rules sidecar acceptance criteria"
  - "skill frontmatter migration closure gate"
  - "hard rules verdict criteria"
  - "reader repoint criteria"
  - "hard rules sidecar waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar"
    last_updated_at: "2026-09-30T18:29:21Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Marked all five criteria Met from the build's records and the final-state gates"
    next_safe_action: "None. The orchestrator commits the build and the phase docs path-scoped"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar/scratch/context/context.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-040-hard-rules-sidecar"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 40: hard-rules-sidecar

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar
**Level:** 2
**Status:** Complete
**Date:** 2026-09-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The five rows mirror the five completion criteria in `goal.md`. The Verification cell names the command, the expected output and the observed result from the build's own records under `scratch/verify/`. The build ran in the working tree at start HEAD `b3964f2a3f`, and the orchestrator commits it path-scoped after this closure pass. `E` is `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, `S` one of the nine skill folders and `B` the fixed command set per skill the design note fixes.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-003 | Given the nine skills that declare `hard_rules:` today, When the move lands, Then each has `hard-rules.json` beside its SKILL.md with its rules copied exactly in order, and a grep for `^hard_rules:` in any SKILL.md finds nothing | The rule-for-rule comparison per skill, plus `grep -rn '^hard_rules:' --include=SKILL.md .skilled/skills`. Expected: every skill reads `equal` with its count (sk-git 17, cli-jev 8, cli-hermes 8, cli-opencode 5, cli-pi 4, and 2 each for cli-claude-code, cli-codex, cli-cursor and cli-devin), and the grep prints nothing. Observed: the nine sidecars hold 50 rules in all, 17, 8, 8, 5, 4, 2, 2, 2 and 2 for sk-git, cli-jev, cli-hermes, cli-opencode, cli-pi, cli-claude-code, cli-codex, cli-cursor and cli-devin; the final-state grep prints nothing at exit 1 (`scratch/verify/session-evidence.md:20`); the before and after rule snapshots compare `equal` for all nine skills (`scratch/verify/compare.txt:1`, exit 0); and the review re-ran HEAD's own parser over the nine HEAD SKILL.md files and matched all 50 rules byte for byte (`scratch/verify/review-mimo-r1.txt:10`) | Met | - |
| AC-002 | REQ-002, REQ-003, REQ-005, REQ-012 | Given the engine and the 10 reader files of `spec.md` section 3, When the readers move to the sidecar in the same change, Then the four preflight adapters and both sk-git scripts read the sidecar, the engine stays fail-open, and each suite passes at or above its baseline | `rg -n 'readHardRules\|parseHardRules'` reviewed row by row against `spec.md` section 3, then `node --test` on each of the five test files and the sk-git hook fixture. Expected: no production reader parses frontmatter, and each suite exits 0 with 0 failed at or above its recorded baseline. Observed: `parseHardRules` is gone from every production file, the only remaining hit being a dated benchmark raw report (`scratch/verify/session-evidence.md:21`); all twelve readers keep their `…/SKILL.md` argument so the sibling read resolves (`scratch/verify/review-mimo-r1.txt:11`); and the five suites pass 20, 75, 26, 7 and 7 with 0 failed, equal to the baseline's 135 passed and 0 failed (`scratch/verify/s1.txt:23` to `s5.txt`, `scratch/verify/baseline-suites.txt:20`) | Met | - |
| AC-003 | REQ-004 | Given the fixed command set `B` per skill, When `B` runs through `evaluate` from the pre-change state and again from the final state, Then the two verdict sets match row for row, with the same rule ids, severities and block or warn outcome | A scratch runner importing `E`, with recordings under `scratch/verify/before/` and `scratch/verify/after/` compared per skill. Expected: an empty comparison per skill, including the rows where a command triggers no rule. Observed: `scratch/verify/compare.txt:1` is the first of nine `equal <skill> <n> rows` lines at exit 0, the before and after rule snapshots are byte-equal and the empty-verdict rows are included; the review reproduced all 47 corpus rows live against the current engine (`scratch/verify/review-mimo-r1.txt:12`) | Met | - |
| AC-004 | REQ-006, REQ-009 | Given the sk-doc frontmatter contract and the skill template, When the docs land, Then both name the sidecar and say `hard_rules` is not a SKILL.md frontmatter key, and `validate_document.py` is VALID on every changed doc | `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on each changed doc. Expected: VALID on each, with no result claimed beyond what the recordings hold. Observed: `sk-create-frontmatter`'s contract, `assets/frontmatter-templates.md` and `assets/skill/skill-md-template.md` all name `hard-rules.json`; `validate_document.py` reports 0 issues on all 37 changed docs, 27 skill docs in the session's run and 37 in the reviewer's (`scratch/verify/session-evidence.md:23`; `scratch/verify/review-mimo-r1.txt:13`) | Met | - |
| AC-005 | REQ-007, REQ-008, REQ-010 | Given the Hermes copies and this phase's own gates, When the phase closes, Then `sync-skills-hermes.cjs --check` passes, no rule's meaning changed, and `validate.sh --strict` prints `RESULT: PASSED` for this phase | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check`, then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/040-hard-rules-sidecar --strict`. Expected: the check passes and `RESULT: PASSED`. Observed: `scratch/verify/h2.txt:1` prints `PASS: 72 Hermes skill copies in sync` after 10 of 72 copies written and 0 pruned, the review's byte-for-byte comparison over all 50 rules shows no rule's meaning changed (`scratch/verify/review-mimo-r1.txt:14`), and `validate.sh --strict --recursive` prints `RESULT: PASSED` for every folder in this closure pass | Met | - |

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

All five rows are Met from the build's records under `scratch/verify/` and the working tree at start HEAD `b3964f2a3f`. The move left no `hard_rules` key in any SKILL.md, no production reader on frontmatter and every verdict byte-equal; the review recorded two P2 findings, both fixed and rechecked, and no open P0 or P1. The orchestrator commits the build and these docs path-scoped after this pass.
<!-- /ANCHOR:closure -->

---
