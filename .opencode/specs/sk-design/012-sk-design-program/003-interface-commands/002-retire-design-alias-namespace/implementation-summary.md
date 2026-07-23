---
title: "Implementation Summary: retire the /design:* alias namespace"
description: "Shipped: /interface:* is the sole public sk-design command surface. The /design:* alias namespace was retired end-to-end — surface checker + three registries re-keyed, alias plumbing stripped, commands/design/ deleted — verified by the checker (exit 0, drift 0) and 15/15 tests."
trigger_phrases:
  - "retire design aliases summary"
  - "interface surface dedup"
  - "command namespace retirement"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/003-interface-commands/002-retire-design-alias-namespace"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "review-remediation"
    recent_action: "Shipped in commit 9a42aedae4; docs reconciled; metadata complete."
    next_safe_action: "None — packet complete and verified."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-remediation-session"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 002-retire-design-alias-namespace |
| **Status** | Complete |
| **Shipped** | commit `9a42aedae4` on `skilled/v4.0.0.0` |
| **Level** | 2 |
| **Created** | 2026-07-20 |
| **Completed** | 2026-07-21 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/interface:*` is now the sole public sk-design command surface. The `/design:*` alias skin — five thin wrappers, fifteen assets, the `canonicalCommand`/`compatibilityAliases` registry fields, and the checker's alias-reconciliation machinery — was removed end-to-end. Modes re-key one-to-one: `interface`→`/interface:design`, `foundations`→`/interface:foundations`, `motion`→`/interface:motion`, `audit`→`/interface:audit`, `md-generator`→`/interface:design-reference`. The `design-mcp-open-design` transport (`command:null`) is untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Re-keyed command set + stripped alias plumbing; roster reads `interface` only |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.test.mjs` | Modified | Re-keyed to the `/interface:*` sibling set + mutation fixtures |
| `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` | Modified | Dropped alias fields; removed the "legacy thin aliases" test |
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Re-keyed `command`; deleted alias fields |
| `.opencode/skills/sk-design/hub-router.json` | Modified | Deleted `compatibilityAliases`; kept `canonicalByMode` |
| `.opencode/skills/sk-design/mode-registry.json` | Modified | Re-keyed each mode `command`; deleted `compatibilityAliases` |
| `.opencode/commands/design/` | Deleted | Removed 5 alias wrappers + 15 assets |
| sk-design ungated docs | Modified | Reconciled `/design:*` alias prose to "retired" (README, SKILL, feature-catalog, manual-testing-playbook) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented in the isolated worktree `0090-sk-design-command-dedup`, then committed and pushed to `skilled/v4.0.0.0` as `9a42aedae4`. Sequence: registries first, then the checker, then the `commands/design/` deletion and test updates, then the executable-contract verification. The ungated-doc reconciliation (checklist item CHK-050) was completed as a follow-up after a two-model deep review flagged the residual prose, and this metadata was reconciled to shipped in the same follow-up.
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

Executed at the `skilled/v4.0.0.0` tip in the review worktree on 2026-07-21:

| Check | Result |
|-------|--------|
| `node design-command-surface-check.mjs` | PASS — exit 0, STATUS=VALID, STAGE=complete, drift=0 |
| `node --test design-command-surface-check.test.mjs interface-command-contract.test.mjs` | PASS — 15 tests, 15 pass, 0 fail |
| `/design:` token absent from checker + 3 registries; `commands/design/` absent | PASS — registries report 0 `/design:`/`compatibilityAlias`/`canonicalCommand`; `commands/design/` deleted |
| Five `commands/interface/` wrappers present | PASS — 5 wrappers present |
| Ungated docs reconciled | PASS — README/SKILL/feature-catalog/manual-testing-playbook state the namespace is retired |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The checker's `METADATA … aliases=15` line counts the `/interface:*` commands' own legitimate `aliases` arrays (checker line ~219), **not** residual `/design:*` config — the three registries carry zero `/design:*`/`compatibilityAlias` references.
- Historical changelog entries (`changelog/v1.4.3.0.md`, `v1.6.0.0.md`) intentionally preserve the alias era and are not rewritten.
<!-- /ANCHOR:limitations -->
