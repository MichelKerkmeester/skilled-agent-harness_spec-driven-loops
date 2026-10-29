---
title: "Acceptance Criteria: Phase 4: hub-router-merge"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "hub router merge acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/004-hub-router-merge"
    last_updated_at: "2026-10-29T13:50:00Z"
    last_updated_by: "pi"
    recent_action: "Marked every criterion met from the final tree: seven pointer lines, an identical replay, identical routes and green checks"
    next_safe_action: "Commit the phase, then open phase 005 for the remaining 47 skills"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/SKILL.md"
      - ".skilled/skills/sk-doc/ROUTER.md"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: hub-router-merge

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-hub-router-merge
**Level:** 1
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the final tree, When each of the seven hub SKILL.md files is scanned for a MACHINE ROUTER mention, Then none holds one, and each carries the pointer line at the end of SMART ROUTING | `grep -c 'MACHINE ROUTER'` prints 0 and `grep -c 'before selecting hub resources'` prints 1 in all seven SKILL.md files. Each ends SMART ROUTING with the line: Run the compiled-routing directive in `ROUTER.md` before selecting hub resources. | Met | - |
| AC-002 | REQ-002 | Given the seven root `ROUTER.md` files, When the machine section of each is hashed after the move, Then every hash equals its pre-move value | `diff scratch/machine-sections-before.txt scratch/machine-sections-after.txt` prints nothing. The seven hashes match, for example `sk-code 37d20b4b4d35813e858925dcd30051abb2ee25a994221d71234be6aef4f5e558` and `sk-doc b411788161679cc354996f41a6372bb1c9e4004af4673e6443260bde4d9c2f5c`. The moved prose sits under `## 5. MACHINE ROUTER` in six hubs and `## 11. MACHINE ROUTER` in `sk-code`, and `git diff --numstat` reports additions with 0 deletions on every ROUTER.md | Met | - |
| AC-003 | REQ-002 | Given the replay command, When it runs after the last edit, Then every line matches the capture taken before the first edit | `diff scratch/replay-before.txt scratch/replay-after.txt` prints nothing. Both hold `total gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49`, and a replay run from the final tree reproduces `scratch/replay-after.txt` byte for byte | Met | - |
| AC-004 | REQ-003 | Given a fixed prompt per hub, When `compiled-route.cjs` runs on both sides, Then `action`, `selectionKind` and `targets` match and only the policy hash and generation differ | `diff scratch/routes-before.txt scratch/routes-after.txt` prints nothing. Every hub keeps `action=route`, `selectionKind=single` and one target: `sk-code` to `sk-code-review`, `sk-doc` to `sk-create-readme`, `mcp-tooling` to `mcp-figma` | Met | - |
| AC-005 | REQ-004 | Given the refreshed manifests, When the guard runs, Then it reports every hub fresh | `node .skilled/bin/compiled-route-guard.cjs` prints seven `fresh` lines and `All hubs fresh or excused: serving matches inputs, and the runtime matches its source`, then exits 0. `compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files` | Met | - |
| AC-006 | REQ-005 | Given each hub root, When the per-hub check runs with that path, Then it passes with zero warnings | All seven runs of `node .skilled/commands/doctor/scripts/parent-skill-check.cjs <hub path>` print `OK: parent-skill-check` with `all hard invariants passed, 0 warnings` and exit 0 | Met | - |
| AC-007 | REQ-006 | Given the routing suites, When they run on the final tree, Then none reports a failure | `python3 -m pytest .skilled/skills/sk-doc/scripts/tests/` reports `290 passed`. Under `node --test`: `root-router-contract.test.cjs` 1 of 1, `leaf-route-replay.test.cjs` 22 of 22, `parent-skill-check-routing-shape.test.cjs` 1 of 1, `routing-shape-known-debt-ratchet.test.cjs` 4 of 4, `compiled-route-manifest.test.cjs` 48 of 48 and `compiled-route-surface-hint.test.cjs` 13 of 13, all with 0 failing | Met | - |
| AC-008 | REQ-007 | Given the seven touched hubs, When each per-hub check runs, Then 13a and 13b pass on every hub | 13a and 13b each print one PASS line on all seven hubs. `description.json`, `hub-router.json` and `mode-registry.json` agree on `0.8.6.0` for `cli-classifier`, `1.7.12.0` for `cli-external-orchestration`, `1.9.3.0` for `mcp-tooling`, `3.9.24.0` for `sk-code`, `2.0.10.0` for `sk-design`, `2.3.32.0` for `sk-doc` and `1.6.20.0` for `system-deep-loop`, and each hub carries one changelog entry at `<hub>/changelog/v<edition>.md` | Met | - |

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

Every criterion is met on the final tree. AC-003 decides closure first, since a shifted replay line would have meant the move changed a route, and the two replay captures are identical. The seven per-hub checks, the guard, the sync parity check and the routing suites all report their affirmative markers.
<!-- /ANCHOR:closure -->
