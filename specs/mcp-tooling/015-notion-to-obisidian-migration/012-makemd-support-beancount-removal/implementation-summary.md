---
title: "Implementation Summary: Phase 012: makemd-support-beancount-removal"
description: "The mcp-obsidian skill now documents Make.md as a first-class plugin mirroring notion-bases, and Beancount is gone from every surface outside the changelog history. SKILL.md routes make-md via PLUGIN_MAKEMD, the version is 0.22.0.0, and every changed doc passes the document validator."
trigger_phrases:
  - "015 makemd beancount summary"
  - "mcp-obsidian make-md support summary"
  - "phase 012 implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/012-makemd-support-beancount-removal"
    last_updated_at: "2026-08-23T19:40:00Z"
    last_updated_by: "claude"
    recent_action: "Documented the make-md/beancount swap in the mcp-obsidian skill"
    next_safe_action: "Generate description.json + graph-metadata.json, then validate --strict"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/make-md/make-md.md"
      - ".opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/make-md.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-012-makemd-support-beancount-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Beancount fully removed? Yes - grep across the skill excluding changelog/ is empty and no PLUGIN_FINANCE surface remains"
      - "Make.md mirrors notion-bases? Yes - four-file reference tree, feature-catalog entry, PLUGIN_MAKEMD router intent, and index rows"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
# Implementation Summary: Phase 012: makemd-support-beancount-removal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Completed** | 2026-08-23 |
| **Level** | 1 |
| **Phase** | 12 |
| **Predecessor** | `../011-migration-playbook-refresh/` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

The mcp-obsidian skill's plugin surface now reflects what the vault actually uses: Beancount is retired and Make.md is documented as a first-class plugin, mirroring notion-bases.

### Make.md support added
Make.md now has the same file-layer coverage notion-bases has. A four-file reference tree lives at `references/plugins/make-md/` (`make-md.md`, `data-model.md`, `workflows.md`, `troubleshooting.md`), a `feature-catalog/plugins/make-md.md` entry mirrors the notion-bases catalog entry, and a `PLUGIN_MAKEMD` router intent is wired through every SKILL.md surface notion-bases uses - the intent list, RESOURCE_MAP (nine make-md paths), PLUGINS aggregate, `specific_plugin_intents` tuple, headline list, keywords, and activation triggers. Make.md rows were added to `installed-plugins.md` and `FEATURE-CATALOG.md`, and the make-md docs are grounded in the finance A/B research and the reverse-engineered `.space` on-disk format.

### Beancount removed
Beancount is gone from every surface outside the changelog history. Deleted: `references/plugins/beancount-finance/` (4 files), `feature-catalog/plugins/beancount-finance.md`, `examples/beancount-transaction.sh`, `assets/plugins/beancount-finance/` (2 files), and `manual-testing-playbook/plugin-tie-ins/beancount-transaction.md`. The full `PLUGIN_FINANCE` router surface was stripped from SKILL.md, and beancount mentions were removed from `README.md`, `INSTALL-GUIDE.md`, `FEATURE-CATALOG.md`, `installed-plugins.md`, `plugin-operation-logic.md`, `examples/README.md`, `assets/workflows.md`, and the manual-testing playbook.

### Version + changelog
SKILL.md moved 0.21.0.0 to 0.22.0.0, with a `changelog/v0.22.0.0.md` entry recording the swap. Prior beancount mentions in the changelog history are kept as record.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/make-md/` | Created | 4-file make-md reference tree mirroring notion-bases |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/make-md.md` | Created | Make.md feature-catalog entry |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Modified | `PLUGIN_MAKEMD` wired in, `PLUGIN_FINANCE` removed, version 0.22.0.0 |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/beancount-finance/` | Deleted | Retired plugin reference tree |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/beancount-finance.md` | Deleted | Retired feature-catalog entry |
| `.opencode/skills/mcp-tooling/mcp-obsidian/examples/beancount-transaction.sh` | Deleted | Retired example script |
| `.opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/beancount-finance/` | Deleted | Retired asset set |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/beancount-transaction.md` | Deleted | Retired manual-testing tie-in |
| `README.md`, `INSTALL-GUIDE.md`, `FEATURE-CATALOG.md`, `installed-plugins.md`, `plugin-operation-logic.md`, `examples/README.md`, `assets/workflows.md`, `manual-testing-playbook.md` | Modified | Beancount mentions removed; make-md rows added |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.22.0.0.md` | Created | Version entry for the swap |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

The make-md reference set and the beancount strip of the prose/index docs were delegated to markdown agents for token efficiency, while the delicate SKILL.md router surgery was done directly to avoid leaving a dangling intent. Every make-md capability was authored from the finance A/B research and the reverse-engineered `.space` format rather than invented.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

| Decision | Why |
|----------|-----|
| Mirror notion-bases point-for-point for Make.md | notion-bases is the Notion-closest plugin already documented; matching its structure keeps the two database plugins consistent and the router surface predictable |
| Do the SKILL.md router surgery directly, delegate the rest | A half-removed `PLUGIN_FINANCE` or half-wired `PLUGIN_MAKEMD` would break routing, so the router edits stayed in one hand while the bulkier prose work fanned out |
| Keep beancount in the changelog history | The changelog is a record of what happened; scrubbing it would rewrite history, and the "overview" convention flag it trips is pre-existing (v0.21 fails it identically) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `grep -rIi beancount <skill>` excluding `changelog/` | PASS - empty |
| SKILL.md router surface | PASS - no `PLUGIN_FINANCE`; `PLUGIN_MAKEMD` present in intent + RESOURCE_MAP (9 make-md paths) + routing tuple; version 0.22.0.0 |
| make-md reference tree + feature-catalog entry | PASS - 4 reference files + `feature-catalog/plugins/make-md.md` exist, mirroring notion-bases structure/frontmatter |
| Index docs | PASS - `installed-plugins.md` + `FEATURE-CATALOG.md` reference make-md, not beancount; make-md links resolve |
| `validate_document.py` on the 5 make-md docs + SKILL.md | PASS - 0 issues each |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

1. **Changelog "overview" convention flag.** The `v0.22.0.0.md` changelog entry trips the same "overview" convention flag that v0.21 trips identically; this is a pre-existing skill convention, not a regression from this phase.
2. **Make.md `.space` format is reverse-engineered.** The on-disk `.space` format documented in the make-md reference tree was reverse-engineered from `Make-md/makemd` during the finance A/B; behavior not observed there is stated as such rather than asserted.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- **Specification**: `spec.md` · **Plan**: `plan.md` · **Tasks**: `tasks.md`
- **Changed skill**: `.opencode/skills/mcp-tooling/mcp-obsidian/`
- **Predecessor**: `../011-migration-playbook-refresh/`
<!-- /ANCHOR:cross-refs -->
