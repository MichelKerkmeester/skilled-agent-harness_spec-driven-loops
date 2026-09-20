---
title: "Implementation Plan: Document Composer 2.5 Max-Mode Absence in cli-cursor"
description: "Three surgical docs-only edits to the cli-cursor skill recording that Composer 2.5 has no -max variant and how Cursor Max Mode is actually selected."
trigger_phrases:
  - "cursor composer max mode plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/051-cli-cursor-max-mode-doc"
    last_updated_at: "2026-08-19T19:25:45Z"
    last_updated_by: "claude"
    recent_action: "Applied 3 doc edits; no runtime code touched"
    next_safe_action: "Run validate.sh --strict, then operator review"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-cursor/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-051-cli-cursor-max-mode-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Document Composer 2.5 Max-Mode Absence in cli-cursor

<!-- ANCHOR:summary -->
## 1. SUMMARY

Evidence-first, docs-only. Live `cursor-agent` probes established the facts before any edit: `--list-models` returns exactly two Composer ids (`composer-2.5`, `composer-2.5-fast`); `composer-2.5[context=1m]` and the `--help`'s own example `claude-opus-4-8[context=1m,effort=high,fast=false]` both return `Cannot use this model`; real Max Mode is the enumerated `-max` id (`glm-5.2-max`, `gpt-5.6-luna-max` in-scope). Three minimal insertions carry this into the docs a reader/orchestrator would consult. No runtime allowlist change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `validate.sh 051-cli-cursor-max-mode-doc --strict` → Errors:0.
- `git diff --stat` shows only the three cli-cursor doc files (no `.ts`/`.cjs`).
- No `composer-2.5-max` presented anywhere as a usable id.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The cli-cursor roster has three documentation surfaces plus a runtime enforcement layer. This change touches only the docs:

| Surface | Role | Edit |
|---------|------|------|
| `SKILL.md` §3 override table | Maps user phrasing → dispatch flags | Add "Use Composer max" refusal row |
| `README.md` roster paragraph | Human-facing roster description | Note Composer has no `-max` tier |
| `providers-and-models.md` §4 | Canonical effort/tier reference | Add "Max Mode = `-max` id" paragraph |
| `executor-config.ts` / `fanout-run.cjs` | Runtime enforcement (21 ids) | **Untouched** — no id added/removed |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Establish evidence
Probe the live CLI (`cursor-agent --list-models`, `composer-2.5[context=1m]` rejection) to confirm Composer has no `-max` id before any edit.

### Phase 2: Apply the three doc edits
Add the "Use Composer max" row to `SKILL.md`; extend the `README.md` Composer clause; add the `providers-and-models.md` §4 Max-Mode paragraph.

### Phase 3: Packet and gate
Author the Level 1 packet docs + metadata; run `validate.sh --strict` to Errors:0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `grep` confirms "no `-max`" / "Max Mode" present on all three surfaces.
- `git diff --stat` confirms docs-only scope (`4 insertions(+), 1 deletion(-)`, zero code files).
- `validate.sh --strict` = Errors:0 is the authoritative gate.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Live `cursor-agent` CLI (used only to establish evidence; not a runtime dependency of the change).
- system-spec-kit `validate.sh` for the completion gate.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Pure additive docs. To revert: `git checkout -- ` the three cli-cursor doc files and delete the packet folder. No runtime state, no migration, nothing deployed.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Specification**: See `spec.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
