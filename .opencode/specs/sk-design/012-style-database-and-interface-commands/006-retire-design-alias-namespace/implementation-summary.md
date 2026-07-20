---
title: "Implementation Summary: retire the /design:* alias namespace"
description: "AUTHOR-SPEC stage: the spec/plan/tasks/checklist for retiring the /design:* alias namespace are authored; implementation is pending. Records the planned change and its executable acceptance contract."
trigger_phrases:
  - "retire design aliases summary"
  - "interface surface dedup"
  - "command namespace retirement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/006-retire-design-alias-namespace"
    last_updated_at: "2026-07-20T18:23:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the retirement spec/plan/tasks/checklist (AUTHOR-SPEC stage)"
    next_safe_action: "Re-key checker + 3 registries, delete commands/design/, run checker + tests"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/commands/design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: retire the /design:* alias namespace

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-retire-design-alias-namespace |
| **Status** | Planned (AUTHOR-SPEC stage — not yet implemented) |
| **Level** | 2 |
| **Created** | 2026-07-20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Planned change — not yet implemented.** This phase is authored, not executed: the spec, plan, tasks, and checklist define the retirement of the `/design:*` alias namespace so that `/interface:*` becomes the sole public sk-design command surface. Nothing in the runtime has changed yet; the entries below describe the intended change.

### Sole `/interface:*` surface

The design-judgment modes will be addressable under exactly one namespace. The `/design:*` alias skin — five thin wrappers, fifteen assets, the `canonicalCommand`/`compatibilityAliases` registry fields, and the checker's alias-reconciliation machinery — is removed end-to-end. Modes re-key one-to-one: `interface`→`/interface:design`, `foundations`→`/interface:foundations`, `motion`→`/interface:motion`, `audit`→`/interface:audit`, `md-generator`→`/interface:design-reference`. The `design-mcp-open-design` transport (`command:null`) is untouched.

### Planned Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Re-key command set + strip alias plumbing; roster read `interface` only |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs` | Modify | Re-key to the `/interface:*` sibling set + mutation fixtures |
| `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` | Modify | Drop alias fields; remove the "legacy thin aliases" test |
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Re-key `command`; delete alias fields; rewrite cross-reference tokens (order-preserving) |
| `.opencode/skills/sk-design/hub-router.json` | Modify | Delete `compatibilityAliases`; keep `canonicalByMode` |
| `.opencode/skills/sk-design/mode-registry.json` | Modify | Re-key each mode `command`; delete `compatibilityAliases` |
| `.opencode/commands/design/` | Delete | Remove 5 alias wrappers + 15 assets |
| sk-design ungated docs | Modify | Reconcile dangling `/design:*` alias prose; add retirement changelog entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Implementation runs entirely inside the isolated worktree `0090-sk-design-command-dedup`; nothing is committed, staged, or pushed at authoring time. The intended sequence is registries first, then the checker, then the `commands/design/` deletion and test updates, then the executable-contract verification.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `/interface:*`, retire `/design:*` entirely | Frozen operator decision — a single public surface removes the duplicated-namespace drift the checker exists to catch |
| Re-key rather than rewrite interface assets | The `commands/interface/` wrappers/assets already carry `/interface:*` tokens and zero `/design:` references, so the surface-drift target is already correct — only the JSON/checker layer needs re-keying |
| Preserve historical changelogs | `changelog/v1.4.3.0.md` and `v1.6.0.0.md` document the alias era honestly; a new entry records the retirement instead of rewriting history |
| Define correctness by the checker + tests | The surface checker (exit 0, drift=0) plus the two test files are the executable contract; no behavior claim is made without them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Planned verification (the executable contract — to be run at implementation, not yet executed):

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` exits 0 (drift=0) | PENDING |
| `node --test design-command-surface-check.test.mjs interface-command-contract.test.mjs` green (15) | PENDING |
| `rg -n '/design:'` — no command token in checker + 3 registries; `commands/design/` absent | PENDING |
| Five `commands/interface/` wrappers + 15 assets present and unchanged | PENDING |
| `validate.sh --strict` on this phase = 0 errors | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Authoring stage only** — this document records intent; the `PENDING` verification rows are the real gate and must show real output before any completion claim.
- **Ungated prose is best-effort** — the doc reconciliation (SKILL.md, README, feature-catalog, testing-playbook) is not enforced by the checker; it is honesty upkeep, tracked as P1, not a build blocker.
<!-- /ANCHOR:limitations -->
