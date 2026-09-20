---
title: "Implementation Summary: Document Composer 2.5 Max-Mode Absence in cli-cursor"
description: "Docs-only cli-cursor update recording that Composer 2.5 has no -max variant and how Cursor Max Mode is actually selected; no runtime allowlist change."
trigger_phrases:
  - "cursor composer max mode summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/051-cli-cursor-max-mode-doc"
    last_updated_at: "2026-08-19T19:25:45Z"
    last_updated_by: "claude"
    recent_action: "3 docs-only edits shipped; validate --strict PASSED Errors:0"
    next_safe_action: "Operator review of the 3 cli-cursor doc edits, then commit"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-cursor/README.md"
      - ".opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-051-cli-cursor-max-mode-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: Document Composer 2.5 Max-Mode Absence in cli-cursor

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Track** | cli-external-orchestration |
| **Scope** | Docs-only (3 cli-cursor files); runtime allowlist unchanged |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A short, evidence-backed note across the three cli-cursor doc surfaces stating that **Composer 2.5 has no `-max` (1M "Max Mode") variant**, and clarifying how Cursor Max Mode is actually selected:

| File | Change |
|------|--------|
| `cli-cursor/SKILL.md` | "Use Composer max" override-table row: Composer has no `-max` tier; tell the user, do not substitute another model's `-max`. |
| `cli-cursor/README.md` | Composer roster clause extended: those two ids are Composer's only tiers, no `-max` (1M Max Mode) variant to dispatch. |
| `cli-cursor/references/providers-and-models.md` | §4 "Max Mode = the `-max` id" paragraph: Max Mode is an enumerated `-max` id, not the rejected `[context=1m]` bracket; Composer 2.5 has none. |

`git diff --stat`: 3 files, `4 insertions(+), 1 deletion(-)`. No `.ts`/`.cjs` touched.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was preceded by live `cursor-agent` probing, which established the facts empirically:
- `--list-models` returns exactly two Composer ids: `composer-2.5`, `composer-2.5-fast`.
- `composer-2.5[context=1m]` and the `--help`'s own example `claude-opus-4-8[context=1m,effort=high,fast=false]` both return `Cannot use this model`.
- Real Max Mode ids exist as enumerated `-max` suffixes (`glm-5.2-max`, `gpt-5.6-luna-max` in-scope; `claude-*-max`/`gpt-5.6-sol-max` out of scope).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **No allowlist change.** `composer-2.5-max` is not a real Cursor id, so adding it would break dispatch and violate the allowlist's provenance rule. The enforced 21-id list stays intact.
- **Docs-only, three surfaces.** The fact is placed where a reader (README), an orchestrator composing a dispatch (SKILL override table), and a model-reference consumer (providers §4) each look.
- **Bracket docs left as-is.** `providers-and-models.md` already live-tested and correctly documents bracket rejection; only the Max-Mode note was added, not a correction.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Scope proof**: `git diff --stat` limited to the three cli-cursor doc files; `executor-config.ts` / `fanout-run.cjs` unchanged (allowlist still 21 ids).
- **Gate**: `validate.sh 051-cli-cursor-max-mode-doc --strict` → Errors:0.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The note reflects the current `cursor-agent --list-models` roster. If Cursor later ships a Composer Max tier, re-probe and update the three surfaces.
- Enabling Max Mode for other models via cli-cursor (adding `claude-sonnet-5-max` etc. to the allowlist) is out of scope and would be a separate packet touching runtime code + tests.
<!-- /ANCHOR:limitations -->
