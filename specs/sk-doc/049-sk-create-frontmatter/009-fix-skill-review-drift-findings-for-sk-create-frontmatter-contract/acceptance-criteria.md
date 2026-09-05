---
title: "Acceptance Criteria: Phase 9: fix the skill-review drift findings in the sk-create-frontmatter contract"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "contract drift closure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract"
    last_updated_at: "2026-09-05T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Recorded the observed outcome of every criterion"
    next_safe_action: "Commit the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-049-009-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: fix the skill-review drift findings in the sk-create-frontmatter contract

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/049-sk-create-frontmatter/009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract
**Level:** 3
**Status:** Complete
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the parse diagram's claim that the closing delimiter must sit within 20 lines, When the validators are read and the fleet is walked, Then the claim is replaced by what they do | No validator caps block length. 7 `SKILL.md` and 24 playbook files carry blocks over 20 lines and pass every gate. Diagram and checklist line corrected in `assets/frontmatter-templates.md` | Met | - |
| AC-002 | REQ-001 | Given section 5's 10 to 200 and 10 to 100 character limits, When `quick_validate.py` is read, Then the rules name the 130 and 110 soft targets and the 1,536 cap it enforces | `quick_validate.py` lines 16, 92 and 224 to 235 read the budget from `skill-contract.json`. Section 5 and the checklist now name those figures and the script | Met | - |
| AC-003 | REQ-001 | Given section 5 saying a spec document needs no frontmatter, When the spec validator is read, Then the rule says the block is required and owned by system-spec-kit | `spec-doc-structure.ts` lines 269 to 278 and 682 skip a document with no opening delimiter, so `SPECDOC_FRONTMATTER_001` covers malformed blocks only. A missing block fails through the frontmatter-basics check in `orchestrator.ts` lines 863 to 883. Section 5 now carries `frontmatter_required: true` and names both mechanisms. Grep for `suggest_removal` returns nothing. The mechanism was corrected after a fresh review caught the first wording naming the wrong rule | Met | - |
| AC-004 | REQ-001 | Given the reference template's claim that the advisor's checker enforces the five-field block in coverage mode, When the checker is read, Then the note states its default mode and its walk | `check-skill-doc-frontmatter.mjs` line 34 walks `references` and `assets` under `join(skillsRoot, skillName, subdir)` at line 173, and shape mode passes a file with no detailed field. Runs report 128 documents against 818 in the tree. The note now says so and names the packaging gate for nested packets | Met | - |
| AC-005 | REQ-003 | Given the engine's usage text, When `--help` runs, Then `gate` is listed alongside the other modes | `node frontmatter-version.mjs --help` prints `Modes: compute (dry-run), apply, verify, gate (...)`, exit 0. `test-frontmatter-version.mjs` 23 passed, 0 failed | Met | - |
| AC-006 | REQ-005 | Given the packaging gate's two warnings, When the mode `SKILL.md` gains sections 7 and 8, Then the gate reports zero warnings | `package_skill.py --check --strict` prints `Result: PASS` with no warning line | Met | - |
| AC-007 | REQ-005 | Given `references/README.md` failing the document validator for a missing overview, When an overview section is added, Then it exits 0 | `validate_document.py` prints `Total issues: 0` for it and for every other mode document | Met | - |
| AC-008 | REQ-002 | Given `version field` absent from stage one and routing at the 0.82 floor with score 0.24, When it is added to `graph-metadata.json`, Then it routes on its own signal | Replay at advisor generation 596: `sk-doc` 0.8917, score 0.692, compiled target `sk-create-frontmatter`. Baseline at generation 593 was 0.82 at 0.24 | Met | - |
| AC-009 | REQ-002 | Given `trigger_phrases` returning nothing, When the spaced form is added to all three stage-two files, the keyword list and stage one, Then the spaced form routes with a compiled target and the underscore form is recorded | `trigger phrases` 0.9034, score 0.713, target `sk-create-frontmatter`, baseline had no target. `trigger_phrases` still returns nothing even at a 0.5 confidence threshold, recorded in `implementation-summary.md` with the generation | Met | - |
| AC-010 | REQ-002 | Given two new aliases, When each is replayed against out-of-domain phrases, Then no capture goes unrecorded | `what phrases trigger the smoke alarm` routes nothing. `trigger phrases for a marketing email campaign`, `bump the version field in package.json` and `read the version field from the cargo manifest` route to `sk-doc` at 0.86 to 0.88. Recorded as narrow captures in the summary, the same reading phase 008 gave `X.Y.Z.W` | Met | - |
| AC-011 | REQ-004 | Given the hub description at 639 characters, When it is trimmed by the contract's drop and keep lists, Then it sits at or under 130 and the audit headroom exceeds 400 | 130 characters. `audit_descriptions.py` project total 7,376 against 7,885 before, headroom 624 under 8,000 | Met | - |
| AC-012 | REQ-004 | Given eight hub-shaped baseline prompts, When they are replayed after the trim, Then every one routes as before | `diff` of the baseline and after files shows no change on any of the eight. Only the three intended trigger rows moved | Met | - |
| AC-013 | REQ-004 | Given the hub `SKILL.md` is a pinned compiled-routing source, When it is edited, Then the guard goes stale, both manifests are re-minted, and the guard, the sync verify and the canary are green | Guard `sk-doc stale-manifest` after the edit. `compiled-route-manifest.cjs refresh` moved the runtime manifest to `fbd5b481...`, the authored copy matched by hand, guard `fresh`, `compiled-route-sync.cjs --verify` prints `move-simulation OK`. Canary outcome recorded in the summary's verification table | Met | - |
| AC-014 | REQ-006 | Given the parent `goal.md` listing phase 008 in progress at 88 percent while the spec map says complete, When both are reconciled, Then they agree and phase 009 appears in both | Parent `goal.md` progress table names 008 and 009 done, criteria ticked, binding table lists the 009 goal. Parent `spec.md` phase map row 9 Complete, handoff row 008 to 009 filled | Met | - |
| AC-015 | REQ-006 | Given the parent spec's Level 2, `main` branch and scaffold placeholder, and phase 008's `Phase 1` titles and `[SESSION-ID]`, When each is corrected, Then no template residue remains | Level 3, branch `skilled/v4.0.0.0`, parent packet `sk-doc/049-sk-create-frontmatter`. Phase 008 spec, plan, tasks and acceptance-criteria titles read `Phase 8`, session id `2026-09-02-049-008-implementation` | Met | - |
| AC-016 | REQ-006 | Given phase 008's 44 unchecked checklist lines and `[X]` summary placeholders, When each is marked with the evidence its acceptance criteria already carry, Then none remain unchecked | `grep -c '^- \[ \]'` on `008-utilization-review/tasks.md` returns 0. Summary table 15, 23 and 9 | Met | - |
| AC-017 | REQ-007 | Given every markdown file this phase wrote, When the human-voice scanner runs against each file's committed baseline, Then no file gains a hard blocker | Recorded in the summary's verification table per file, with the one semicolon this phase introduced and removed before the count | Met | - |
| AC-018 | REQ-007 | Given this phase folder, the parent and phase 008, When the spec validator runs strict, Then each prints `RESULT: PASSED` | Recorded in the summary's verification table as the closing run | Met | - |

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

AC-001 through AC-004 carried the packet: each is a sentence the contract made about enforcement
that the enforcing code did not back, and each is now a sentence the code does back, with the
script and line that proves it. AC-008 and AC-009 restored the declared trigger set to something
the advisor can score, and the one alias it cannot score is recorded with the command and the
generation rather than re-added in hope. AC-011 to AC-013 trimmed the hub inside the budget the
mode itself sets, under a baseline that shows nothing else moved, and carried the refresh a pinned
source demands. Left out deliberately: the scorer, the checker's walk, the three other over-budget
descriptions, and the scaffolder that emitted empty documents. Each is named in the summary with
its owner.
<!-- /ANCHOR:closure -->
