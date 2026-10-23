---
title: "Acceptance Criteria: Phase 4: private-local-skills"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "private local skills acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/004-private-local-skills"
    last_updated_at: "2026-10-23T07:03:40Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: private-local-skills

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-code/013-private-surface-skills/004-private-local-skills`
**Level:** 2
**Status:** Draft
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given commit `42b41dd286` and the phase 1 ignore rules, When both trees are restored and the workflow references are real copies, Then both skills exist and hold exactly the archived file count | `test -f .skilled/skills/local-webflow/SKILL.md && test -f .skilled/skills/local-obsidian/SKILL.md && echo OK` prints `OK`; `find .skilled/skills/local-webflow/ -type f \| wc -l` prints `161` and `find .skilled/skills/local-obsidian/ -type f \| wc -l` prints `65`, which are `git archive 42b41dd286 <surface path> \| tar -t \| grep -v '/$' \| wc -l` for each surface; the trailing slash is required so a symlinked skill folder is followed | Unmet | - |
| AC-002 | REQ-002 | Given the restored trees, When the workflow references are made real, Then no symlink remains under either skill and each copy points at the guardrail document by a path that resolves | `find .skilled/skills/local-webflow/ .skilled/skills/local-obsidian/ -type l \| wc -l` prints `0`; `grep -rc "workflow-guardrails.md" .skilled/skills/local-webflow/references/workflow-*.md .skilled/skills/local-obsidian/references/workflow-*.md` reports `0` for each `workflow-debug.md`, `1` for each `workflow-implement.md` and `2` for each `workflow-verify.md`; `grep -rn "\.\./\.\./sk-code-skilled/" .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints nothing | Unmet | - |
| AC-003 | REQ-003 | Given both skills after the move, When the link audit runs, Then no link that resolved at `42b41dd286` fails, and the one pre-existing broken link is untouched | `bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-webflow` prints only `BROKEN .../references/javascript/quality-standards/shared-listener-and-weakmap.md -> target` and ends `AUDIT_FAIL=1`; `bash /tmp/psurf-phase4/link-audit.sh .skilled/skills/local-obsidian` prints no `BROKEN` line and ends `AUDIT_FAIL=0` | Unmet | - |
| AC-004 | REQ-004 | Given both skills, When the absolute self-paths are rewritten, Then no file outside the dated records names the old hub location | `grep -rn 'sk-code/sk-code-webflow\|sk-code/sk-code-obsidian' .skilled/skills/local-webflow .skilled/skills/local-obsidian \| grep -v '/changelog/'` prints nothing, and `grep -rl 'sk-code/sk-code-webflow' .skilled/skills/local-webflow/changelog` may still print files, which is the D6 carve-out | Unmet | - |
| AC-005 | REQ-005 | Given both skills, When the standalone rewrite is applied, Then each is a self-describing skill with no hub-surface claim | `grep -c "^name: local-webflow$" .skilled/skills/local-webflow/SKILL.md` prints `1` and the same for `local-obsidian`; `grep -n -i "hub bundles\|hub detects\|the hub's\|packetKind\|advisor-invisible\|parent hub" <both SKILL.md and both README.md>` prints nothing; `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/local-webflow/README.md --type readme` and the `local-obsidian` twin both print `VALID` | Unmet | - |
| AC-006 | REQ-006 | Given both skills, When the metadata is written, Then each root carries exactly one advisor-readable identity | `node -e "const j=require('./.skilled/skills/local-webflow/graph-metadata.json');if(j.skill_id!=='local-webflow')process.exit(1);if(!['cli','mcp','sk-code','sk-hub','deep-loop','sk-util','system'].includes(j.family))process.exit(1);console.log('OK')"` prints `OK`, the same for `local-obsidian`, and `find .skilled/skills/local-webflow .skilled/skills/local-obsidian -name graph-metadata.json -o -name description.json \| wc -l` prints `2` | Unmet | - |
| AC-007 | REQ-007 | Given both skills present, When git is asked about them, Then they are ignored, untracked and unstaged | `git status --porcelain .skilled` prints nothing; `git diff --cached --name-only` prints nothing; `git status --porcelain --ignored .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints exactly two lines each starting `!!`, one per `local-*` path, and the two paths are named explicitly so the ignored state that a provisioned checkout already carries elsewhere under `.skilled/` is outside this criterion; `git check-ignore -v .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints two lines each naming `/.skilled/skills/local-*` | Unmet | - |
| AC-008 | REQ-008 | Given the phase is complete, When the summary is read, Then it records the mode, the restore commands, both link audits, the ignore evidence and the advisor-scan result | `grep -c "Folder mode" specs/sk-code/013-private-surface-skills/004-private-local-skills/implementation-summary.md` prints `1`; the same `grep -c` for `AUDIT_FAIL` prints at least `2`, for `check-ignore` at least `1`, and for `skill_nodes` at least `1` | Unmet | - |
| AC-009 | REQ-009 | Given both skills, When their comments and docs are scanned, Then no comment names this packet, and the only spec paths present are the ones the restored documents already carried at `42b41dd286` | `grep -rn "013-private-surface-skills\|004-private-local-skills" .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints nothing; `grep -rn "specs/" .skilled/skills/local-webflow .skilled/skills/local-obsidian` prints only lines that `git grep -n "specs/" 42b41dd286 -- .skilled/skills/sk-code/sk-code-webflow .skilled/skills/sk-code/sk-code-obsidian` already contained | Unmet | - |
| AC-010 | SC-004 | Given the final state, When the packet gate runs, Then the packet passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/004-private-local-skills --strict` prints `RESULT: PASSED` | Unmet | - |

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

**Closeable:** No

The packet closes when AC-001 to AC-010 are all `Met`. The two criteria that carry the phase are AC-003, because a private skill nobody can navigate is a private skill nobody uses, and AC-007, because one staged path puts private content into the public repository. Left out on purpose: the `description.json` file named in the phase brief, since no leaf skill in the repository carries one and no consumer reads it, and every pre-existing broken link, which the phase must not fix.
<!-- /ANCHOR:closure -->
