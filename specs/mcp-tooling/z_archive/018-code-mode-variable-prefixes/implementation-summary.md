---
title: "Implementation Summary"
description: "Notion and Obsidian now register their 24 and 12 tools, ClickUp's credential lookup is repaired, and the two remaining failures are named rather than hidden."
trigger_phrases:
  - "code mode variable prefix fixed"
  - "notion obsidian manual registered"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/018-code-mode-variable-prefixes"
    last_updated_at: "2026-08-29T14:33:53Z"
    last_updated_by: "session"
    recent_action: "Repaired three lookups and documented every required key"
    next_safe_action: "None; the two remaining failures are outside this repository"
    blockers: []
    key_files:
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Completed** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Executor** | Orchestrator |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three repaired credential lookups, and an honest account of the two that a change in this repository cannot reach.

Code Mode takes a bare `${VAR}` from a manual and resolves `<manual name>_VAR`, doubling every underscore in the manual name. The install guide documents the prefix and tables it; the underscore behaviour is not written down anywhere and had to be probed.

Against that rule, `notion` and `obsidian` were referencing names that already carried the prefix, so their lookups doubled it and found nothing. Their references are now bare, which matches the keys the environment file already held. `clickup_official` was referencing correctly, but its manual name contains an underscore, so the key it needs carries a doubled one; the environment gained that key rather than the manual losing the name its documented tool identifiers embed.

### Files Changed

| File | Change |
|------|--------|
| `.utcp_config.json` | Four references de-duplicated: one for `notion`, three for `obsidian` |
| `.env` | Two keys added for `clickup_official`, copied from the existing pair; untracked, values never displayed |
| `.env.example` | The prefixing rule stated including the underscore doubling; the `clickup__official_*` and `webflow` keys added; the MagicPath entry replaced by a note that no key belongs there |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The rule was confirmed before anything was edited, because the fix is its inverse and an inverted rule produces a confident wrong edit. Confirmation came from the owning skill's own install guide, whose table is unambiguous, plus a controlled probe for the part the documentation omits.

Verification used a freshly started server rather than a runtime registration. That distinction is the reason the defect survived: registration happens once at startup, the running servers had loaded their environment long before, and a runtime registration exercises a different path entirely.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Fix the reference where the reference is wrong, the environment where the name is unusual.** `notion` and `obsidian` were written incorrectly and were corrected. `clickup_official` is named legitimately, and its documented tool identifiers embed that name, so renaming it to produce a tidier key would have broken every call site its install guide teaches.
- **Copy the credential between keys programmatically.** The value was never read out or displayed, and the environment file was confirmed untracked with no tracked-file change.
- **Do not invent a Webflow credential.** None exists in the environment file. A placeholder would convert a legible registration failure into an authentication failure at first use, which is worse.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Prefix rule, documented part | The install guide tables `figma` + `${FIGMA_API_KEY}` needing `figma_FIGMA_API_KEY` |
| Prefix rule, undocumented part | A manual named `probe_under_score` produced the lookup `probe__under__score_FOO_BAR` |
| Pre-change failures | `clickup_official`, `magicpath`, `notion`, `obsidian`, `webflow` |
| `notion` after the fix | Registered, 24 tools |
| `obsidian` after the fix | Registered, 12 tools |
| `clickup_official` after the fix | Variable error gone; now fails on `npm error 404 ... @clickup/mcp-server` |
| Previously working manuals | `aside`, `chrome_devtools_1/2`, `figma`, `github`, `gitkraken`, `magnific`, `mobbin`, `refero` all still register |
| Secrets in tracked files | None; `.env` gitignored and reporting zero tracked changes |
| Template completeness | All nine keys the config resolves appear in `.env.example`; zero undocumented |

The ClickUp result is the useful one to read twice. The repair worked — its credential now resolves — and doing so uncovered a second, unrelated defect underneath: the package its manual launches is not served by the registry. One fix does not make a manual work; it makes the next problem visible.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- `webflow` still does not register. Its reference is correct and no credential for it exists in the environment file, so only the operator can complete it.
- `clickup_official` still does not register, now for an upstream reason: `@clickup/mcp-server` returns 404 from the registry. Whether that package moved, was renamed, or was never published is outside this packet.
- The underscore-doubling behaviour is load-bearing here and is documented nowhere in the owning skill. This packet records it, but a reader who meets the same error will still reach for the documented rule alone and be one step short.
- An earlier attempt to correct the MagicPath entry in `.env.example` was reported as done but never ran: the command was chained behind a comparison that returned non-zero, so the edit was skipped while the summary claimed it. The correction is applied here, and the lesson is narrower than "check exit codes" - a chained edit whose output is not read back is a claim, not a change.
- Nothing enforces the rule. A future manual can be added with a pre-prefixed reference and will fail exactly the same way, silently, until someone starts a fresh server and reads its stderr.
<!-- /ANCHOR:limitations -->

---
