---
title: "Goal: Phase 3: decouple-and-rewire"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "cli-jev decoupling"
  - "dispatch rewiring"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/003-decouple-and-rewire"
    last_updated_at: "2026-09-20T15:25:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Decoupling verified; dispatch chain, rosters and surfaces rewired"
    next_safe_action: "Run phase 004: onboard the hub to the compiled-routing fleet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-003-decouple-and-rewire"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: decouple-and-rewire

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** One home for the Jev transport: the old hub carries no registration
or trace of it, and every dispatch surface, roster and generated artifact names
`.skilled/skills/cli-jev/cli-usage/`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The decoupling a parallel writer landed is verified rather than repeated or reverted, and the phase docs attribute it to their commit |
| D2 | The dispatch row's display name stays `cli-jev`; only `packetPath` moves, so the playbook's `JEV-017` assertion and the recorded evidence stay true |
| D3 | Each hook suite runs under its own runner: `node --test` for the packet bijection, vitest for the inspector, with the filter scoped so a quarantined snapshot cannot be collected |
| D4 | Roster edits follow the mirror contract: canonical `.skilled` file, the same body in the `.claude` twin, then the two generators |
| D5 | Every generated surface is re-derived by the writer that owns it, and each delta is measured before it is accepted |
| D6 | The hub's release line starts at `0.1.0.0` by operator direction; the transport's `1.x` history stays recorded in the mode's own changelog |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes,
resend this file's chat slice so the operator can update their copy. A child goal
change that alters a parent decision or criterion is an amendment to the parent:
apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 2. COMPLETION CRITERIA

- [x] The old hub answers with seven workflow modes and no transport trace, and its doctor run exits 0
- [x] The audit row, both hook suites and a live preflight refusal put the packet's eight hard rules back in force
- [x] Every roster and runtime mirror names `cli-usage` as the transport, and the four mirror gates exit 0
- [x] The generated surfaces carry no stale path and each regeneration is reproducible
- [x] The hub's artifacts and changelog carry the `0.1.0.0` release line, and the old hub still serves a fresh compiled policy
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 3. LOG

Everything below is VOLATILE. It is not part of the directive and it is expected to grow.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Landed decoupling | Verified | Commit `e66dccd6a2`; registry seven modes and no extension, router with no `cli-jev` signal, `tieBreak` seven |
| Dispatch chain | Done | `packetPath: 'cli-jev/cli-usage'`; rule-checks 20 pass / 0 fail; audit suite 75 tests passed |
| Enforcement proof | Done | Preflight of `jev run @request.json --value` → `deny` with `[jev-value-not-with-run]` |
| Rosters | Done | Both agents and their mirrors rewired; `.pi` and `.codex` regenerated `2 of 12`; four mirror gates exit 0 |
| Release line | Done | Five artifacts at `0.1.0.0`; changelog renamed to `v0.1.0.0.md`; doctor `13a`/`13b` pass |
| Generated surfaces | Done | Index 16 → 0 stale rows, manifests 35/70 → 0, fixture reproducible, 12 cache rows inserted |
| Old hub manifest | Done | `refresh` exit 0 at generation 5, copied to the authored twin; guard reports the hub fresh |

### Deviations and findings

| Item | Note |
|------|------|
| The decoupling was already committed when this phase started | A parallel writer committed it mid-plan; the plan's own text was stale on that point, and the phase docs now record the committed half as verified input |
| The Pi agent tree was stale before the roster edit | Its check exited 1 with two stale files, so the sanctioned regeneration fixed a pre-existing failure as well as propagating the edit |
| The old hub's prose still claimed an extension | Its `SKILL.md` said one `transport-axis` with an empty `transports` and its `README.txt` still counted eight modes; both were fixed and the hub re-minted |
| The sk-doc guard is stale, and it is not this phase's file | The parallel writer's uncommitted `sk-create-readme/SKILL.md` bump is a routing input; the pre-commit route-remint gate mints it at their commit |
| The Pi preflight suite has a pre-existing failure | `cli-devin`'s `stdin-redirect-required` became `severity: error` on 2026-09-15 while the test still expects the advisory; verified unchanged at `HEAD` |
<!-- /ANCHOR:log -->
