---
title: "Acceptance Criteria: Phase 9: Standalone skills"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "standalone skills acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/009-standalone-skills"
    last_updated_at: "2026-10-28T15:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Verified every criterion against the final gate run"
    next_safe_action: "Conductor landing"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: Standalone skills

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-doc/072-skill-routing-and-clarity/009-standalone-skills`
**Level:** 2
**Status:** Complete
**Date:** 2026-10-28
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the phase is implemented, When its gates run, Then: `package_skill.py --strict` and `generate-leaf-manifest.cjs --check` pass for each skill. | At the final state both pass on all six changed files. `package_skill.py --check --strict` prints `Result: PASS` for cli-orca (3,097 words), mcp-code-mode, sk-git (4,895), sk-prompt (3,176), system-skill-advisor (3,412) and system-spec-kit (4,996), exit 0 each; the same check is green for the other eight skills, so the gate covers all fourteen. `generate-leaf-manifest.cjs --check` prints `leaf-manifest.json OK` with a hash for each of the six, exit 0. `ci-leaf-manifest-freshness` reads `checked=14 fresh=14 failed=0`. The full gate set is `scratch/after.md` §1, 39 of 39 at exit 0. `scratch/after.md:15`, `scratch/after.md:113`, `scratch/after.md:126`, `scratch/after.md:135` | Met | - |
| AC-002 | REQ-002 | Given the phase is implemented, When its gates run, Then: Each skill's first instruction appears before its machine block. | SMART ROUTING is `## 2` in all six files and the machine block is the last H2 in each: cli-orca `## 8`, mcp-code-mode `## 10`, sk-git `## 9`, sk-prompt `## 10`, system-skill-advisor `## 9`, system-spec-kit `## 8`. So every instruction in each file precedes the machine block, and the routing summary itself is 5 to 8 lines and 90 to 132 words. The review checked the same question structurally: diffing each file with §2 and the machine block removed leaves only the version bump. `scratch/after.md:142`, `scratch/after.md:149` | Met | - |
| AC-003 | REQ-003 | Given system-skill-advisor hooks include markdown and non-markdown files, When its manifest and aliases are regenerated, Then: the routed hook markdown is present, non-markdown hooks are absent, and the manifest freshness check passes. | `leaf-scopes.json` names five Markdown paths under `hooks/`, and the manifest lost exactly nine leaves, 136 to 127, with none added. Every removed path is non-Markdown: seven `.ts` files, one `.py` and one `.json`. No non-Markdown leaf remains in that manifest, the five hook Markdown leaves are present, `generate-leaf-manifest.cjs --check` prints OK, and the new test `generate-leaf-manifest-standalone-scopes.test.cjs` passes here while exiting 1 against `HEAD`'s generator, so it fails without the code change. `scratch/after.md:170`, `scratch/after.md:177`, `scratch/after.md:188`, `scratch/after.md:190` | Met | - |

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

All three criteria are Met with observed evidence from the final gate run. AC-003 is the one that needed code: the standalone generator path never read `leaf-scopes.json`, so the requirement could not be met by editing a JSON file, and the new test is what keeps it met.
<!-- /ANCHOR:closure -->
