---
title: "Implementation Summary: Phase 6: advisor-and-integration"
description: "The hub graph identity is unified and the functional referrer sweep is complete; two operator-approved items stay deferred."
trigger_phrases:
  - "advisor integration summary"
  - "phase 006 implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-16T16:55:00Z"
    last_updated_by: "claude"
    recent_action: "Documented the executed integration sweep and its 2 deferrals"
    next_safe_action: "Rebuild advisor skill-graph DB when scheduled"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/graph-metadata.json"
      - ".opencode/commands/doctor/assets/doctor_mcp_install.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "doctor_mcp_debug.yaml and mcp-doctor.sh carry no bridge skill_dir refs; only doctor_mcp_install.yaml does"
      - "3 labeled-prompts rows target mcp-chrome-devtools and retarget to mcp-tooling; 0 rows for click-up or figma"
---
# Implementation Summary: Phase 6: advisor-and-integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-advisor-and-integration |
| **Completed** | 2026-07-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`mcp-tooling` now has one advisor-facing graph identity instead of three, and every functional referrer this phase owns points at the hub. Two items stay explicitly, visibly deferred rather than silently dropped.

### Hub Graph Union and Referrer Sweep

`.opencode/skills/mcp-tooling/graph-metadata.json` unions the three bridges' intent signals, trigger phrases, and outward edges — figma's `depends_on sk-design@0.7` and a union `enhances sk-code@0.5` — and records `mcp-code-mode` as an external cross-skill dependency, not a hub member. The three children's own `graph-metadata.json` files are deleted. The inbound/reverse edges that pointed at those deleted identities are repointed: `mcp-code-mode/graph-metadata.json` and `sk-design/graph-metadata.json` both now carry `"target": "mcp-tooling"` edges. `doctor_mcp_install.yaml` repoints all three bridges to their nested paths and its previously-stale `mcp-open-design` entry now resolves to `sk-design/design-mcp-open-design`. The 3 `labeled-prompts.jsonl` rows that targeted `mcp-chrome-devtools` now target `mcp-tooling`. Both `.opencode/skills/README.md` and the root `README.md` catalog the hub. The sweep also caught referrers beyond this phase's original file list: 6 `sk-code`/`code-webflow` reference files, 2 `mcp-code-mode` playbook cross-refs, and outward-edge fixes inside `sk-design`.

### What Stays Deferred

Two items are operator-approved deferrals, not gaps that slipped through:
- **Advisor skill-graph DB rebuild** — the graph identity is correct on disk, but the advisor's indexed skill-graph DB has not been re-keyed. This is a coordinated, operator-gated reindex (touches shared advisor state beyond this packet), deferred rather than run unilaterally.
- **CLAUDE.md/AGENTS.md figma-transport prose** — both files still read "`mcp-figma` is the external sibling Figma transport," which predates the hub. Restating it is an operator decision because it governs agent behavior repo-wide, not just this packet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-tooling/graph-metadata.json` | Created | Union hub graph identity |
| `mcp-tooling/{mcp-chrome-devtools,mcp-click-up,mcp-figma}/graph-metadata.json` | Deleted | Dissolved the three child graph identities |
| `.opencode/skills/mcp-code-mode/graph-metadata.json`, `.opencode/skills/sk-design/graph-metadata.json` | Modified | Reverse edges repointed to `mcp-tooling` |
| `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` | Modified | 3 bridge refs repointed; stale `mcp-open-design` entry fixed |
| `labeled-prompts.jsonl` | Modified | 3 rows retargeted to `mcp-tooling` |
| `.opencode/skills/README.md`, root `README.md` | Modified | Catalog rows reference the hub |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The child-identity deletion, hub-identity authoring, and reverse-edge repoints landed as one atomic change, so the advisor was never in a window where all three bridges were simultaneously unrouted. Verified with a repo-wide grep sweep for the old flat skill-folder paths (clean outside historical spec/changelog/playbook-fixture text) and direct reads of every modified graph-metadata.json.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Defer the advisor skill-graph DB rebuild rather than run it unilaterally | It is a shared, operator-gated reindex outside this packet's blast radius; running it mid-reconciliation risks clobbering concurrent state |
| Defer the CLAUDE.md/AGENTS.md prose restatement | Those files govern agent behavior repo-wide; the operator owns that framing decision, not this packet in isolation |
| Fix the stale `mcp-open-design` entry in passing | Directly adjacent to the bridge repoints in the same file; leaving a known-stale entry unrepaired while touching its neighbors would be inconsistent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Coverage |
|-------|--------|----------|
| Hub `graph-metadata.json` union + 3 child deletions | PASS | direct read + `git status` |
| Reverse edges in `mcp-code-mode`/`sk-design` | PASS | direct read of both files |
| `doctor_mcp_install.yaml` repoint + stale entry fix | PASS | direct read, lines 198-229 |
| `labeled-prompts.jsonl` retarget | PASS | 3/3 rows confirmed |
| README catalogs | PASS | both files reference `mcp-tooling` |
| Repo-wide stale-path sweep | PASS | zero live hits outside historical text |
| Checklist | PARTIAL | 18/21 items verified (9/10 P0, 8/10 P1, 1/1 P2); CHK-020, CHK-022, CHK-041 open |
| `validate.sh 006-advisor-and-integration --strict` | PASS | Errors: 0, Warnings: 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Advisor skill-graph DB not rebuilt** — `mcp-tooling` and its packet names are not yet re-keyed in the advisor's indexed skill-graph DB. Coordinated, operator-gated reindex; deferred, not dropped. REQ-003 (P0) is therefore only partially met.
2. **CLAUDE.md/AGENTS.md figma-transport prose not restated** — both files still frame `mcp-figma` as "the external sibling Figma transport," predating the hub. Operator decision, deferred because it governs agent behavior repo-wide. REQ-004 (P1) is therefore only partially met.
3. **Pre-existing click-up config drift** — inherited from phase 005, untouched here, re-confirmed still-deferred in phase 008.
<!-- /ANCHOR:limitations -->
