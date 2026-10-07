---
title: "Acceptance Criteria: Phase 13: sk-prompt framework docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "sk prompt framework docs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs"
    last_updated_at: "2026-09-27T18:30:00Z"
    last_updated_by: "closure-leaf"
    recent_action: "Marked all seven criteria Met from the build evidence"
    next_safe_action: "None. The criteria are closed; the orchestrator commits"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 13: sk-prompt framework docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs
**Level:** 2
**Status:** Complete
**Date:** 2026-09-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the registry holds five code-task scaffolds, When the build rewrites its `description`, Then the description names CRISPE and CRAFT as frameworks without a scaffold and the five ids and entries are unchanged | `node -p '((r)=>r.frameworks.map(f=>f.id).join(",")+" "+/CRISPE/.test(r.description)+" "+/CRAFT/.test(r.description))(require("./.skilled/skills/sk-prompt/assets/framework-registry.json"))'` prints `rcaf,race,cidi,tidd-ec,costar true true` (baseline 2026-09-27: `... false false`), and `git diff --numstat -- .skilled/skills/sk-prompt/assets/framework-registry.json` shows 1 line added and 1 deleted. Observed 2026-09-27 after `e3cf07f4f9`: `rcaf,race,cidi,tidd-ec,costar true true` and numstat `1 1`, exit 0. Evidence: `.skilled/skills/sk-prompt/assets/framework-registry.json:3` | Met | - |
| AC-002 | REQ-001 | Given the owner's sources define seven frameworks, When the build finishes, Then the seven-framework prose and both matrix rows for CRISPE and CRAFT stay in `SKILL.md` | `grep -c -e 'Creativity *. CRISPE' -e 'Comprehensive *. CRAFT' .skilled/skills/sk-prompt/SKILL.md` prints 2 and `grep -c '7 frameworks' .skilled/skills/sk-prompt/SKILL.md` prints 4 (both baselines 2026-09-27). Observed 2026-09-27 after `e3cf07f4f9`: the matrix-row grep prints 2 and the `7 frameworks` grep prints 4 (rerun read-only while closing the docs). Evidence: `.skilled/skills/sk-prompt/SKILL.md:321`, `.skilled/skills/sk-prompt/SKILL.md:323` | Met | - |
| AC-003 | REQ-002 | Given a run loads `patterns-evaluation.md`, When `SKILL.md` gives the loading rule, Then both the resource loading section and the agent rules name the three sections to read | `grep -c 'FRAMEWORK DEEP DIVES' .skilled/skills/sk-prompt/SKILL.md` prints at least 2 and `grep -c 'CLEAR EVALUATION MASTERY' .skilled/skills/sk-prompt/SKILL.md` prints at least 2 (baseline 2026-09-27: 0 and 0). Observed 2026-09-27 after `e3cf07f4f9`: 2 and 2, exit 0. Evidence: `.skilled/skills/sk-prompt/SKILL.md:100`, the rule under Resource Loading Levels, and the amended bullet under Deterministic Agent Rules | Met | - |
| AC-004 | REQ-002 | Given a request carries an on-demand keyword, When the rule is in place, Then the whole file still loads for it | `grep -c '"all frameworks"' .skilled/skills/sk-prompt/SKILL.md` prints 1, and the rule's text names the on-demand keywords as the full-read case. Observed 2026-09-27 after `e3cf07f4f9`: 1. The rule's last line reads "A request that carries an on-demand keyword (the `ON_DEMAND_KEYWORDS` list below) reads the whole file", and the agent-rules bullet ends "an on-demand keyword reads the whole file". Evidence: `.skilled/skills/sk-prompt/SKILL.md:106`, `.skilled/skills/sk-prompt/SKILL.md:154`, `.skilled/skills/sk-prompt/SKILL.md:469` | Met | - |
| AC-005 | REQ-003 | Given the before read is 59,661 bytes, When the build measures the section read, Then the largest read set of the two files is at most 34,000 bytes | `wc -c < .skilled/skills/sk-prompt/SKILL.md` prints at most 24000, and the `sed` range counts in `plan.md` section 5 print 3066, 3950, 2670 (CRAFT) and 538 (TIDD-EC), recorded in `implementation-summary.md` with the before total 59,661. Observed 2026-09-27 after `e3cf07f4f9`: `SKILL.md` 23893 bytes. The counts print 3066, 3950, 2670 and 538, so the CRAFT read is 9,686 bytes and the largest read set 33,579, against the before total 59,661. Recorded in `implementation-summary.md`. Evidence: `.skilled/skills/sk-prompt/SKILL.md:100`, `specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs/implementation-summary.md:120` | Met | - |
| AC-006 | REQ-004 | Given the owner's validators and consumers pass today, When the two edits land, Then they all still pass | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-prompt/SKILL.md` prints `VALID` with exit 0, `python3 .skilled/skills/sk-doc/scripts/quick_validate.py .skilled/skills/sk-prompt` exits 0, `bash .skilled/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh .` prints `GUARD PASS` with exit 0 and `npx vitest run model-benchmark/tests/sweep-foundation.vitest.ts` from `.skilled/skills/system-deep-loop/deep-improvement/scripts` exits 0. Observed 2026-09-27 after `e3cf07f4f9`: `VALID`, `Skill is valid!`, `GUARD PASS` and `Tests  26 passed (26)`, each exit 0, the same as the pre-edit baseline. Evidence: `specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs/implementation-summary.md:111`, `specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs/implementation-summary.md:114` | Met | - |
| AC-007 | REQ-005 | Given the owner records docs changes in its changelog, When the build commits, Then the changed sk-prompt files are the two edited files and one changelog file | `git diff --name-only 6f47c32dce..HEAD -- .skilled/skills/sk-prompt` prints exactly `SKILL.md`, `assets/framework-registry.json` and one file under `changelog/` (0 lines at planning time. T001 moves the base past any later owner commit). Observed 2026-09-27 after `e3cf07f4f9`: `.skilled/skills/sk-prompt/SKILL.md`, `.skilled/skills/sk-prompt/assets/framework-registry.json` and `.skilled/skills/sk-prompt/changelog/v3.0.2.0.md`, exit 0. Evidence: `.skilled/skills/sk-prompt/changelog/v3.0.2.0.md:15`, `specs/cli-jev/003-cli-jev-workflow-integration/013-sk-prompt-framework-docs/implementation-summary.md:117` | Met | - |

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

Closeable. All seven criteria are Met with observed evidence from the build commit `e3cf07f4f9` and the checks the orchestrator ran before and after it.
<!-- /ANCHOR:closure -->
