---
title: "Acceptance Criteria: Phase 3: check-and-template-canon"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "check and template canon acceptance criteria"
  - "phase 3 check and template canon closure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/003-check-and-template-canon"
    last_updated_at: "2026-10-29T11:30:00Z"
    last_updated_by: "pi"
    recent_action: "Recorded a command and its observed output against all 9 criteria, and every row is Met"
    next_safe_action: "Build 004-hub-router-merge"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 3: check-and-template-canon

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 003-check-and-template-canon
**Level:** 2
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a mode packet with a sibling `ROUTER.md`, When `package_skill.py --strict` and check 12b read it, Then neither reports RS-004, and the same packet with the file removed reports it | `python3 -m pytest` over the four Python files printed `106 passed`, and the two packet cases sit at `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:499` for the packet that owns a router and `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:513` for the one that does not. The old-shape copy at `scratch/old-shape/sk-git`, which carries no sibling file, reports `routing shape RS-004`; the copy was removed before commit, and its recorded result is at `implementation-summary.md:88` | Met | - |
| AC-002 | REQ-001 | Given a `ROUTER.md` whose real path leaves the skill folder, When either check reads it, Then RS-004 names the escape instead of passing the file | The escape case at `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:484` asserts `resolves outside the skill folder` on a router symlinked to a shared file, inside the four-file run that printed `106 passed`. The branch it exercises resolves the sibling file and holds its target to the skill folder at `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1041` | Met | - |
| AC-003 | REQ-002 | Given the current hub `SKILL.md`, When the pointer rule runs, Then it passes, and a copy with the `ROUTER.md` link removed fails RS-005 | The 7 ledger entries that record `RS-002` alone are exactly the 7 hubs, so a hub `SKILL.md` that carries the link raises no RS-005. The no-pointer case at `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:313` fails strict, and the fenced sample that must not count is at `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:340`. The old-shape copy, whose `SKILL.md` carries no link, reports `routing shape RS-005`; the copy was removed before commit, and its recorded result is at `implementation-summary.md:88` | Met | - |
| AC-004 | REQ-003 | Given a `SKILL.md` that still ends with a `## MACHINE ROUTER` section, When RS-002 runs, Then it reports the section and names the sibling `ROUTER.md` as its home, with or without a code block | The prose-only case at `.skilled/skills/sk-doc/scripts/tests/test_routing_shape.py:278` fails strict, and the message it asserts names the sibling file at `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1157-1159`. The old-shape copy reports `routing shape RS-002`, and all 54 ledger entries record `RS-002`, the code every unmoved `SKILL.md` raises for the section it still holds; the copy was removed before commit, and its recorded result is at `implementation-summary.md:88` | Met | - |
| AC-005 | REQ-004 | Given the fleet tree, When the root-router gate runs, Then `sk-git` gets a router result, and 12a prints one line per declared packet | `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` printed `checked=13 passed=13 failed=0 fixed=0`, and the standalone class runs the contract at `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:846`, so `sk-git` is classified and held to its contract. 12a on sk-doc printed one line per declared packet, fourteen `12a-router-contract: sk-doc/sk-create-*: ROUTER.md: known debt, RS-004 (migrate to the routing canon)` lines, from the packet list at `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1791` | Met | - |
| AC-006 | REQ-005 | Given the unmoved tree, When the ledger is read, Then it holds 54 entries and the ratchet suite accepts the raised ceiling | `rg -c '"lines":' .skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json` printed 54, the frozen fixture holds the same 54 keys, and `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs` printed `pass 4` and `fail 0`. The ledger's first entry sits at `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json:7`, and the live-to-frozen comparison is at `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs:23` | Met | - |
| AC-007 | REQ-006 | Given the templates, workflows and canon docs, When they are searched for the old packet rule, Then no current document keeps it | `rg 'mode packet carries its own ROUTER.md' .skilled/skills/sk-doc/sk-create-skill` printed no match, and `rg 'packet carries no ROUTER\|no ROUTER.md of its own' .skilled/commands/create` printed none, so the old rule survives in no current document, the changelog included. The replacement sentence sits at `.skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md:249`, which puts the block in the sibling `ROUTER.md` and links to it from `SKILL.md` | Met | - |
| AC-008 | REQ-007 | Given a fresh standalone scaffold, When `init_skill.py` finishes, Then the skill folder holds `ROUTER.md` beside `SKILL.md` | `init_skill.py` writes the sibling router in its standalone branch at `.skilled/skills/sk-doc/sk-create-skill/scripts/init_skill.py:441` and prints `Created SKILL.md and ROUTER.md`, and `test_create_skill_contract.py` scaffolds a standalone skill in a temp folder inside the four-file run that printed `106 passed`. The scaffold run into `.scratch-dc90/271/router-fixture-root` left `ROUTER.md` beside `SKILL.md`, and `../.scratch-dc90/271/router-fixture-root/router-fixture/SKILL.md:47` carries the `[`ROUTER.md`](./ROUTER.md)` link | Met | - |
| AC-009 | REQ-008 | Given the final tree, When the changelog and the suites run, Then `validate_document.py` reports 0 issues and every suite prints at least its baseline count | Every suite printed at or above its baseline: the four Python files `106 passed` against 84, all sk-doc Python tests `290 passed`, the create asset tests `15 passed`, the 23 sk-create-skill JS suites at `fail 0`, and `doctor run-all` at `7 suite(s) passed, 0 failed` with `node:test` at 548 passes. The changelog carries 1.8.0.0 at `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.8.0.0.md:11` and the carrier reads the same at `.skilled/skills/sk-doc/sk-create-skill/SKILL.md:5`, and `parent-skill-check.cjs` on sk-doc prints `PASS: 13d-packet-version: 14 mode packet(s) match their newest changelog entry`. `validate_document.py` prints `Total issues: 0` on both `sk-create-skill/changelog/v1.8.0.0.md` and `sk-doc/changelog/v2.3.31.0.md` | Met | - |

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

All 9 criteria are `Met`, and each row names the command that decided it plus the output that command printed. No row needed a waiver, so this packet carries no decision record. Every row's own command ran, AC-008's scaffold and AC-009's document validator included.
<!-- /ANCHOR:closure -->
