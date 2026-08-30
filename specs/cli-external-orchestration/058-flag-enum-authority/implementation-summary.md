---
title: "Implementation Summary: Flag Enum Authority"
description: "A flag glossary that copied its CLI's incomplete help output made correct documentation look fabricated; four edits publish the probed enum, a session-free verification recipe, and the rule at both dispatch and hub level."
trigger_phrases:
  - "flag enum authority summary"
  - "permission mode enum probe"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/058-flag-enum-authority"
    last_updated_at: "2026-08-30T11:05:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped four documentation corrections verified by probe"
    next_safe_action: "Consider re-baselining the remaining DV-* results against 3000.6.7"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-devin/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-flag-enum-authority"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | cli-external-orchestration/058-flag-enum-authority |
| **Level** | 1 |
| **Status** | Complete |
| **Date** | 2026-08-30 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four documentation edits across three skills.

`cli-devin/references/cli-reference.md:113` carried `auto, accept-edits, smart, dangerous` — the four values `devin --help` prints. The binary accepts eight. That row now names all five canonical values with their alias groups (`auto`→`normal`, `yolo`/`bypass`→`dangerous`, `autonomous` requiring `--sandbox`) and states outright that help is not the authoritative enum. A probe recipe follows the flag table: pointing `--prompt-file` at a nonexistent path forces parse-time enum validation without starting a billable session.

`cli-devin/SKILL.md:344` adds the same rule as a routing-time gotcha, in the list an agent reads before composing a dispatch — the correct table alone would not have prevented this, because the wrong inference happens before anyone opens the reference.

`cli-external-orchestration/SKILL.md:169` generalizes it to the hub's ALWAYS rules, phrased CLI-agnostically so it fires for any of the six binaries rather than only Devin.

`manual-testing-playbook/cli-invocation/smart-permission-doc-runtime-mismatch.md:11` gets a staleness banner. `DV-004` asserts the binary rejects `smart`; on 3000.6.7 it accepts it, so that scenario now records the inverse of reality.

A second pass audited the eight `DV-*` scenarios whose claims can be checked without a billable dispatch. Three hold (`DV-003`'s fabricated `--reasoning-effort` is still rejected; `devin mcp` and `devin cloud` are still reachable). Two have superseded values (`DV-002`'s version string; `DV-012`'s hardcoded 13-agent roster, now 12). `DV-004` is inverted. `DV-014` and `DV-016` are obsolete rather than stale — `.devin/SYNC.md:20` records that Devin's mirrored command surface was removed by operator decision, so a scenario asserting 36 mirrored commands tests something that no longer exists.

`DV-012` and `DV-016` received banners; the results index gained an audit note above the table. No recorded row was rewritten.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Enum established first by probe, then documented. No value was published that had not been observed accepted or rejected by the installed binary.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Banner `DV-004` rather than re-baseline it.** Its recorded PASS embeds the binary's own error text from 3000.2.17, which is the evidence that recovered the canonical alias grouping. Overwriting it would have destroyed the only record of the pre-upgrade enum.
- **Leave the `cli-reference.md` version stamp at 3000.2.17.** Only the enum row was re-verified against 3000.6.7; bumping the whole document would claim a re-verification that did not happen. The probe block states its own verified version instead.
- **Change no dispatch example.** Every permission-mode value in the skill was correct; the reference was the defect.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Probe against `devin 3000.6.7`, exit 2 = rejected at parse, exit 1 = accepted and reached the file error:

- Accepted: `auto`, `normal`, `accept-edits`, `smart`, `dangerous`, `yolo`, `bypass`, `autonomous`
- Rejected: `plan`, `manual` — Claude's modes, serving as negative controls that prove the probe discriminates rather than accepting everything

All edits confirmed present at their target lines. Packet validated with `validate.sh --strict`.

Roster parity was confirmed with the purpose-built checker rather than a hand diff — `node .opencode/commands/doctor/scripts/agent-roster-mirror-check.cjs` returns `STATUS=OK` with 12/12 coverage across cursor, devin, opencode, codex and pi. My first hand-diff compared against the wrong source (`.opencode/agents/` rather than the canonical `.claude/agents/`) and would have reported a phantom missing agent.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The published enum is a snapshot of 3000.6.7 and will drift; both the gotcha and the reference instruct the reader to re-probe rather than trust the line. Twelve behavioural `DV-*` scenarios (`DV-001`, `005`-`011`, `013`, `015`, `017`, `019`) remain unverified: confirming them costs real dispatches, which this packet avoided by design. `DV-016` is obsolete rather than stale and needs a decision — retire it, or re-target it at the surface Devin actually reads.
<!-- /ANCHOR:limitations -->

---
