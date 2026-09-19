---
title: "Acceptance Criteria: Deprecate the sk-code-mobile-cli surface packet and sweep its references"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/009-sk-code-mobile-cli-deprecation"
    last_updated_at: "2026-09-19T12:10:00Z"
    last_updated_by: "session"
    recent_action: "Met every criterion with its observed evidence and closed the packet"
    next_safe_action: "Commit the change, then let the sk-doc README baseline drop its deleted-file row"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "01a0b8a1-ad54-70e2-a246-61d8f42d7a6f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Deprecate the sk-code-mobile-cli surface packet and sweep its references

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-code/009-sk-code-mobile-cli-deprecation
**Level:** 2
**Status:** Complete
**Date:** 2026-09-19
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the packet directory, When the removal lands, Then it holds no files | `find .skilled/skills/sk-code/sk-code-mobile-cli -type f` → 0; the removed tree's anchor and count are recorded at `implementation-summary.md:45` | Met | - |
| AC-002 | REQ-001 | Given the skills tree and root README, When the sweep lands, Then only the enumerated residue names the packet | `rg -l -e sk-code-mobile-cli -e PI_REMOTE .skilled/skills README.md` → 7 files, 52 matches, each named in the allowlist at `implementation-summary.md:160` | Met | - |
| AC-003 | REQ-002 | Given the hub registries, When the mode is de-registered, Then no surface still carries it | `parent-skill-check.cjs .skilled/skills/sk-code` → `OK: all hard invariants passed, 0 warnings`, 5 modes; the removed surfaces are enumerated at `.skilled/skills/sk-code/changelog/v4.2.3.0.md:6` | Met | - |
| AC-004 | REQ-003 | Given an `app-mobile`-shaped prompt, When it reaches the hub, Then no mobile surface resolves | Replay → `{"action":"defer","selectionKind":null,"targets":[]}`; receipt at `implementation-summary.md:144` | Met | - |
| AC-005 | REQ-002 | Given the hub still serves its remaining traffic, When the quality prompt replays, Then the workflow mode still routes | Replay → `sk-code-quality` single route at the same hash; receipt at `implementation-summary.md:145` | Met | - |
| AC-006 | REQ-004 | Given the version authority rule, When the removal ships, Then every routing artifact agrees on the version | Checks `13a`/`13b` PASS at `4.2.3.0`; receipt at `implementation-summary.md:146` | Met | - |
| AC-007 | REQ-005 | Given the derived artifacts, When their generators re-run, Then the committed bytes match a fresh generation | `ci-leaf-manifest-freshness` and `ci-skill-derived-freshness` → 13 fresh each; receipt at `implementation-summary.md:147` | Met | - |
| AC-008 | REQ-005 | Given the advisor projection, When it validates, Then every path it names resolves | `skill_graph_compiler.py --validate-only` → `VALIDATION PASSED`; receipt at `implementation-summary.md:148` | Met | - |
| AC-009 | REQ-006 | Given the compiled closure, When it is re-minted, Then it is consistent with the live policy | `compiled-route-guard.cjs` → all hubs fresh, exit 0; receipt at `implementation-summary.md:149` | Met | - |
| AC-010 | REQ-007 | Given the sibling packet, When the removal lands, Then its conventions survive with live citations | 0 census hits in the obsidian subtree and its playbook validates; receipt at `implementation-summary.md:150` | Met | - |
| AC-011 | REQ-008 | Given the hub playbook, When the deleted root leaves the allowlist, Then the package still validates and every remaining root is discovered | `validate-playbook-package.cjs --strict` → all packages valid; receipt at `implementation-summary.md:151` | Met | - |
| AC-012 | REQ-009 | Given the skills-tree history files, When they are scrubbed, Then they no longer enumerate the surface | Only the two hub changelog entries retain it, by design; the annotation is at `.skilled/skills/sk-code/changelog/v4.2.2.0.md:8` and the allowlist entry at `implementation-summary.md:160` | Met | - |
| AC-013 | REQ-010 | Given the root README, When the sweep lands, Then the packet is not advertised | The surface list at `README.md:950` names only the three surviving packets | Met | - |
| AC-014 | REQ-011 | Given the skills README, When it is checked, Then the no-op is recorded rather than assumed | `rg -c "mobile" .skilled/skills/README.txt` → 0; recorded at `implementation-summary.md:152` | Met | - |
| AC-015 | REQ-012 | Given the predecessor packet, When this work ships, Then a reader is pointed forward | Supersession note at `specs/sk-code/008-sk-code-mobile-cli-mode/spec.md:27` | Met | - |
| AC-016 | REQ-001 | Given the frozen scope, When the work is done, Then no path outside it changed | Scope audit and the fleet-wide promotion disclosure at `implementation-summary.md:154` | Met | - |
| AC-017 | REQ-001 | Given this packet, When it is validated, Then it may close | `validate.sh … --strict` → `RESULT: PASSED`; receipt at `implementation-summary.md:155` | Met | - |

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

Every criterion is `Met` with evidence that was observed, not inferred: the tree is gone, the
residue is a named eight-file allowlist, the hub re-validates at `4.2.3.0`, the mobile prompt no
longer resolves while the quality prompt still does, and every derived artifact matches a fresh
generation of its own generator. Two things a reader should not mistake for misses. The skill tree
keeps the removal in its changelog, which is version history rather than a live reference, and the
`sk-doc` README baseline keeps one row for the deleted file until the deletion is committed,
because that baseline enumerates git-tracked paths. Consciously left out of scope: the historical
record under `specs/` research lineages, scratch trees and completed packet bodies, and any git
history rewrite.
<!-- /ANCHOR:closure -->

---

