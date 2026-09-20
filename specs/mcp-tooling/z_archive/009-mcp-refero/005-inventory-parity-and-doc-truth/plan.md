---
title: "Implementation Plan: Phase 5: inventory-parity-and-doc-truth"
description: "Enrich the mcp-refero packet to hub-sibling inventory parity (examples, install.sh, playbook, per-tool catalog leaves, changelog) and execute the sk-design de-duplication behind a byte-diffed before/after gate; everything traced to references/tool-surface.md."
trigger_phrases:
  - "refero parity plan"
  - "mcp-refero 005 plan"
  - "refero dedup plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Plan executed as written; gates green"
    next_safe_action: "Proceed to 006-live-verification-capture when operator auth is available"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-refero/examples/README.md"
      - ".opencode/skills/mcp-tooling/mcp-refero/scripts/install.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: inventory-parity-and-doc-truth

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + Bash (verify-only script) |
| **Framework** | sk-doc create-skill packaging conventions; system-spec-kit Level 2 |
| **Storage** | None (docs only; no runtime state) |
| **Testing** | `package_skill.py --check --strict`, `validate_skill_package.py` byte-diff, `bash -n` + live run, relative-link sweep, `validate.sh --strict` |

### Overview
Read-first, then additive authoring: mirror the `mcp-aside-devtools/examples/` structural conventions for a new `examples/` directory, adapt the sibling `doctor.sh` posture logic into a verify-only `install.sh`, extend the playbook and feature catalog in the packet's own house style, and finish the research section G de-duplication by rewriting the sk-design catalog file as a pointer. The one non-additive surface (sk-design) is guarded by running its package gate before and after and requiring byte-identical output.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (phase 001 synthesis, phase 002 packet, mcp-aside-devtools exemplar)

### Definition of Done
- [x] All acceptance criteria met
- [x] Gates passing (package strict, sk-design byte-diff, bash -n, link sweep, spec validate)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive doc enrichment inside a fixed packet contract, plus a single pointer-inversion (catalog ownership moves from sk-design to mcp-refero; sk-design keeps a pointer + judgment guidance).

### Key Components
- **examples/**: 3 worked Code Mode walkthroughs + directory README, mirroring the aside-devtools examples shape (per-item purpose/enforcement, common patterns, troubleshooting, see-also).
- **scripts/install.sh**: verify-only posture sibling of `doctor.sh` (no live probe; exit 1 only on missing runtime prerequisites).
- **manual-testing-playbook/**: 3 new scenario leaves + root index/coverage/wave updates, keeping the sibling frontmatter and section contract.
- **feature-catalog/**: 8 per-tool leaves under the existing 3 domain dirs; domain files gain leaf links; root count summary tracks both tiers.
- **sk-design pointer**: `refero_tools.md` keeps frontmatter (v1.6.0.0), a canonical-home-moved note, and only judgment-side guidance; 8 bounded prose edits across design-interface name the transport correctly.

### Data Flow
Ground truth flows one way: `research.md` sections A/C/D/G -> `references/tool-surface.md` -> every new example, scenario, and catalog leaf. sk-design consumes the surface via the pointer; nothing flows back into sk-design as duplicated fact.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The de-duplication changes what `refero_tools.md` contains, so its consumers were inventoried before the rewrite.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design/design-interface/references/mcp_tooling/refero_tools.md` | Producer: duplicated tool catalog | Rewritten as pointer + judgment guidance | Gate byte-diff identical; link sweep 0 broken |
| `design-interface/SKILL.md` (3 lines), `README.md` (2 lines) | Consumers: describe the old catalog/integration | Updated to "mcp-refero transport over mcp-code-mode" phrasing | `rg -n "refero" design-interface` sweep; gate byte-diff |
| `design_references_mcp.md` (2 link lines) | Consumer: links the catalog for arguments/shapes | Only the moved-content link phrasing updated; discipline content untouched | Link sweep; file otherwise unchanged per git diff |
| `mobbin_tools.md` (1 line), `initiative_ask_fallback_routing.md` (1 anchor row) | Consumers: cross-link/role description | Parenthetical role updated to pointer | Link sweep |
| `mcp-refero/references/tool-surface.md` | Canonical owner | Unchanged (already canonical) | `package_skill.py --check --strict` PASS |

Consumer inventory command: `rg -ln "refero" .opencode/skills/sk-design/design-interface --include="*.md"` returned 7 files; all reviewed, 6 edited (query_default_then_deviate.md only lists the path in frontmatter and needed no change).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baselines and exemplars
- [x] Read research.md sections A/C/D/G, tool-surface.md, SKILL.md, playbook root + one scenario leaf, catalog files
- [x] Read `mcp-aside-devtools/examples/` (README + scripts) and its `scripts/install.sh` for structural conventions
- [x] Capture BEFORE gates: sk-design `validate_skill_package.py` (saved to scratchpad), mcp-refero `package_skill.py --check --strict` PASS

### Phase 2: Packet enrichment (additive)
- [x] `examples/` README + 3 walkthroughs (tool_info-first, doubled prefix, SKIP-valid OAuth steps)
- [x] `scripts/install.sh` (verify-only; `bash -n` + live run)
- [x] 3 playbook scenarios + root index/coverage/waves/readiness updates (9 indexed / 17 files)
- [x] 8 per-tool catalog leaves + domain links + root count summary
- [x] SKILL.md/README.md v1.1.0.0 + surfacing; `changelog/v1.1.0.0.md`

### Phase 3: sk-design de-dup + verification
- [x] `refero_tools.md` -> pointer (v1.6.0.0); 8 bounded prose edits across 5 more design-interface files
- [x] AFTER gates: sk-design gate byte-identical; mcp-refero strict PASS; link sweep 0 broken
- [x] Spec child docs authored; metadata regenerated; `validate.sh --strict --no-recursive` PASSED
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural gate | mcp-refero packet | `package_skill.py --check --strict` (PASS, exit 0) |
| Regression gate | sk-design hub | `validate_skill_package.py` before/after, `diff` byte-identical |
| Script | install.sh | `bash -n` + non-interactive live run (exit 0) |
| Links | Every touched file | Python relative-link sweep (0 broken) |
| Spec docs | This child | `validate.sh --strict --no-recursive` (PASSED) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 research synthesis | Internal | Green (accepted) | No ground truth for new content |
| Phase 002 packet v1.0.0.0 | Internal | Green (shipped) | Nothing to enrich |
| sk-doc create-skill gate scripts | Internal | Green | No strict verification possible |
| Live Refero account/OAuth | External | Red (not available) | None for this phase - live steps are SKIP-valid by design; live capture is phase 006 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: sk-design gate output diverges from baseline, mcp-refero strict gate fails, or a consumer link breaks post-merge.
- **Procedure**: all changes are uncommitted doc edits on `skilled/v4.0.0.0`; `git checkout -- .opencode/skills/sk-design .opencode/skills/mcp-tooling/mcp-refero` restores both skills; deleting the new files under `examples/`, `scripts/install.sh`, the 3 scenario leaves, and the 8 catalog leaves reverts parity work. The spec child folder can be reset from its scaffold in git history.
<!-- /ANCHOR:rollback -->
