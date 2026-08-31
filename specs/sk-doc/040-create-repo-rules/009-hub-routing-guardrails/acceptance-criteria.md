---
title: "Acceptance Criteria: Phase 9: Hub-Routing Guardrails"
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
    packet_pointer: "specs/sk-doc/040-create-repo-rules/009-hub-routing-guardrails"
    last_updated_at: "2026-08-31T14:06:07Z"
    last_updated_by: "claude"
    recent_action: "Closed fourteen criteria; corrected two that a fresh review proved overstated"
    next_safe_action: "Commit the packet"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook/manual-testing-playbook.md"
      - ".opencode/skills/sk-doc/sk-create-repo-rule/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: Hub-Routing Guardrails

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 040-create-repo-rules/009-hub-routing-guardrails
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the always-loaded document, When a reader reaches the advisor-metadata paragraph, Then it states one identity per hub, two-stage routing, and that registry entries alone never justify a routed claim | `AGENTS.md` §2 clause added, 50,337 -> 51,251 bytes. States `routingClass: "metadata"` earns no advisor map entry, that a nested `graph-metadata.json` is rejected, and names the two stages | Met | - |
| AC-002 | REQ-002 | Given a mode being added to an existing hub, When the author asks what is left, Then one table names every surface and what breaks when each is missed | `parent-skills-nested-packets.md` section 7: ten surfaces, each with its failure, plus the replay commands. Sections renumbered 7->8->9; dividers equal sections at 9 | Met | - |
| AC-003 | REQ-003 | Given a mode registered but absent from its hub SKILL.md, When the per-hub gate runs, Then it fails | Negative control: row removed -> `FAIL: 6b: mode(s) registered but absent from the hub SKILL.md: [sk-create-repo-rule]`; restored -> `PASS: 6b: every registered mode (13) appears`. Green on all five hubs | Met | - |
| AC-004 | REQ-003 | Given the 6b check, When a mode name appears outside the mode table, Then it does not produce a false pass | First implementation matched the whole file and passed with the row deleted, because the name also sits in a keywords comment. Tightened to table rows only, then re-run under the same negative control | Met | - |
| AC-005 | REQ-004 | Given the per-hub gate with no argument, When it runs, Then it says which hub it is reporting on before any verdict | Two NOTE lines print the defaulted hub and that the result describes that hub only | Met | - |
| AC-006 | REQ-005 | Given the new gate, When it runs fleet-wide, Then every hub passes without a warn-list | `sk-code` was missing two surface packets and `mcp-tooling` one transport. Rows added from each packet's own `SKILL.md` description; all five hubs now `OK ... 0 warnings` | Met | - |
| AC-007 | REQ-001 | Given the new repo rule, When measured against the rule anatomy, Then it conforms and lands in the preferred band | 125 lines (preferred, ceiling 250); sections 6 = dividers 6; six frontmatter keys in corpus order; 17 trigger phrases; 3 links resolve | Met | - |
| AC-008 | REQ-001 | Given the rule set, When the new rule is wired, Then counts stay equal and no trigger phrase collides | Files 9, trigger rows 9, index rows 9. 161 phrases, 161 distinct, 0 collisions | Met | - |
| AC-009 | REQ-005 | Given the changes, When the advisor regression runs, Then it is unchanged from baseline | 92 cases, metrics byte-identical to the stashed baseline; `ci-skill-root-metadata` 14/14 | Met | - |
| AC-010 | REQ-003 | Given the modified checker, When its own test suites run, Then they are no worse than before the change | The first 6b broke `parent-skill-check-leaf-manifest` (green -> red) because the fixtures build hubs with no mode table. Scoped 6b to hubs that document modes in a table; suite green again. `parent-skill-check-root-router` fails, and fails identically at HEAD with the checker stashed, so it is pre-existing | Met | - |
| AC-011 | REQ-001 | Given the always-loaded clause, When measured against every registered mode, Then its claims are true | The first clause said every nested mode is `routingClass: "metadata"` and none are advisor-visible. Measured: 34 metadata, 3 lexical, 1 alias-fold, 2 command-bridge; `lexical` and `alias-fold` do carry advisor entries. Clause and rule corrected to name the minority and tell the reader to check the class | Met | - |
| AC-012 | REQ-002 | Given the surface checklist, When applied to a hub other than sk-doc, Then every row is applicable or marked hub-specific | `FULL_INVENTORY` exists only in sk-doc (0 in the other four); row 5 now says "where the hub defines one". A projection-map row was added for non-`metadata` modes, which the first version omitted entirely | Met | - |
| AC-013 | REQ-003 | Given a green gate, When it is reported, Then it is not described as proof of reachability | 6b asserts a mode is named in the mode table and nothing more. Both the checklist and the rule now say so, and both name `sk-code-obsidian` and `sk-code-mobile-cli` as shipped modes that pass 6b while no request reaches them | Met | - |

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

AC-010 and AC-011 carried the packet, and both exist because a fresh review refuted a claim made here. The change shipped a green-to-red test regression in the very file it edited, and put two false statements into the always-loaded document after measuring data that contradicted them. Both are fixed and re-verified. AC-003 and AC-004 still hold. The first proves the gate catches the defect that shipped unnoticed; the second exists because my first implementation of that gate passed its own negative control for the wrong reason, and matching the whole file instead of the mode table would have made it decorative. Nothing was waived. Deliberately left alone: the pre-existing hub aliases that are broad because they match real request shapes, and the advisor's scoring model, which was legible-only rather than wrong.
<!-- /ANCHOR:closure -->
