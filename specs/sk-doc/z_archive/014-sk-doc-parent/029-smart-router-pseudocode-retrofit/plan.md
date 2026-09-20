---
title: "Implementation Plan: Smart-router pseudocode retrofit (sk-doc mode packets)"
description: "Retrofit canonical def route_… pseudocode into the nine sk-doc mode packets that lacked it, split create-flowchart's merged SMART ROUTING heading, close the package_skill.py validator loophole, and verify the registry-driven parent hub router — all inside an isolated worktree, verified with package_skill.py --strict and parent-skill-check.cjs."
trigger_phrases:
  - "smart router retrofit plan"
  - "014 sk-doc phase 029 plan"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/029-smart-router-pseudocode-retrofit"
    last_updated_at: "2026-07-14T16:56:15.126Z"
    last_updated_by: "claude-opus"
    recent_action: "Router retrofit + loophole fix implemented and verified"
    next_safe_action: "Commit + push non-force to origin/skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/scripts/package_skill.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Smart-router pseudocode retrofit (sk-doc mode packets)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
`create-skill`'s `assets/skill/skill_smart_router.md` defines the canonical router: runtime resource discovery (`discover_markdown_resources`), an in-skill sandbox guard (`_guard_in_skill`), and a multi-tier graceful fallback (`UNKNOWN_FALLBACK`). `package_skill.py::validate_smart_router` enforces only those three marker tokens inside the SMART ROUTING section — full `def route_…` bodies are a canonical reference, not a hard requirement — but a start-anchored heading regex meant a merged heading skipped the check entirely.

### Overview
Author one canonical `### Smart Router Pseudocode` block per packet, tiered by the packet's resource topology (FLAT vs KEYED) and simplified where a packet's resources are flat. Fix `create-flowchart`'s merged heading. Patch the validator to catch merged headings. Verify the parent hub separately with its own contract checker. All edits land in an isolated git worktree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Canonical pattern (`skill_smart_router.md`) read and mirrored into a shared template.
- Per-packet resource topology known (which packets have `references/<key>/` subdirs).

### Definition of Done
- All 11 packets PASS `package_skill.py --check --strict`.
- Loophole fix proven by unit test.
- Parent hub passes `parent-skill-check.cjs` STRICT, 0 warnings.
- `validate.sh --recursive --strict` on the 029 packet = Errors:0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two router tiers over one shared marker backbone:
- **TIER FLAT** — packets with no `references/<key>/` subdirs. `score_intents` → load flat refs/assets → `UNKNOWN_FALLBACK` on low confidence. The intent selects a documented template, not a keyed subtree.
- **TIER KEYED** — packets with real `references/<key>/` subtrees (create-benchmark's six benchmark families). `get_routing_key` → load `references/<key>/` + `assets/<key>/` + `references/shared/` → three-tier fallback (unknown key → guide-only notice → happy path).

### Key Components
- Three marker helpers (`discover_markdown_resources`, `_guard_in_skill`, `load_if_available`) kept identical across FLAT packets; create-benchmark references them in prose to respect its word ceiling.
- `validate_smart_router` merged-heading detector + `STRICT_PROMOTED_MARKERS` entry.

### Data Flow
Request → `discover_markdown_resources()` (inventory) → intent/key scoring → guarded load via `_guard_in_skill` → resources or `UNKNOWN_FALLBACK` checklist.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Packets / files | Router tier |
|---------|-----------------|-------------|
| Flat-resource packets | create-agent, create-changelog, create-diff, create-feature-catalog, create-flowchart, create-manual-testing-playbook, create-quality-control, create-readme | TIER FLAT |
| Keyed-resource packet | create-benchmark (6 family subtrees) | TIER KEYED (compact) |
| Already conformant | create-command, create-skill | Pre-existing full router (untouched) |
| Validator | create-skill/scripts/package_skill.py | Loophole fix |
| Parent hub | sk-doc/SKILL.md | Registry-driven (verify only) |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Read `skill_smart_router.md`; author a shared FLAT+KEYED router template; prove the golden block on create-changelog.

### Phase 2: Core Implementation
- Add FLAT routers to the six remaining flat packets (parallel agents mirroring the golden helpers).
- Do the delicate edits directly: create-flowchart heading split + renumber; create-benchmark KEYED compact router + word-budget trims.
- Patch `validate_smart_router` for merged headings.

### Phase 3: Verification
- Full `--check --strict` sweep (11/11 PASS); marker + standalone-heading grep table; create-benchmark word count; `parent-skill-check.cjs` STRICT; loophole unit test; `validate.sh --recursive --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Packaging gate**: `package_skill.py <pkt> --check --strict` per packet (the authoritative router contract).
- **Marker/heading audit**: `grep -c` for the 3 markers + `^## N. SMART ROUTING` per packet.
- **Loophole unit test**: import `validate_smart_router`, feed a merged heading (must warn) and a standalone+3-marker section (must be clean).
- **Parent hub**: `parent-skill-check.cjs <hub>` STRICT.
- **Spec docs**: `validate.sh --recursive --strict`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `create-skill/assets/skill/skill_smart_router.md` — canonical router pattern.
- `create-skill/scripts/package_skill.py` — standalone Python validator (runs from the worktree).
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs` — node validator (run from the main tree against worktree paths; worktree lacks node_modules).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All edits are confined to one isolated worktree on `skilled/v4.0.0.0`. Rollback = discard the worktree branch commit (or `git restore` the 10 touched files) before push; nothing is force-pushed and no shared/dirty tree is touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 1 (golden block) blocks Phase 2 (agents mirror it).
- Phase 2 blocks Phase 3 (sweep needs all routers present).
- The loophole fix is independent of the packet edits but its proof (create-flowchart failing pre-split) depends on the flowchart heading state.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work unit | Effort |
|-----------|--------|
| Golden template + create-changelog reference | S |
| Six FLAT routers (agent-dispatched) | M |
| create-flowchart heading split + renumber | S |
| create-benchmark KEYED router + word trim | M |
| Validator loophole fix + unit test | S |
| Verification sweep + spec docs | M |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Worktree isolated on `skilled/v4.0.0.0`; primary checkout untouched.
- [x] All 10 touched files under `.opencode/skills/sk-doc/`.

### Rollback Procedure
- `git -C <worktree> restore <files>` for a partial revert, or drop the branch commit before push.

### Data Reversal
- None — documentation + validator only; no data migration, no runtime state.
<!-- /ANCHOR:enhanced-rollback -->
