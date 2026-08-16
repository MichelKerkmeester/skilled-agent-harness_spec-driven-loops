---
title: "Decision Record: sk-vision 003 runtime fork"
description: "Architectural decision record for forking and rebranding the shipped vision runtime."
trigger_phrases:
  - "sk-vision runtime adr"
  - "sk-vision fork decision"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork"
    last_updated_at: "2026-08-15T16:30:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Authored Level 3 decision record for runtime fork."
    next_safe_action: "Proceed with implementation after approvals."
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-003-runtime-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: sk-vision 003 runtime fork

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Shipped Core Fork and Exhaustive Rebrand

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Core Architecture Team |

---

<!-- ANCHOR:adr-001-context -->
### Context

We need an isolated vision runtime to power `sk-vision` across OpenCode and Pi without colliding with upstream OpenCode Senses naming, environment variables, or cache directories.

### Constraints

- Shipped v0.2.0 files are tested and functional, while `PLAN.md` roadmap features are unbuilt stubs.
- Must retain upstream MIT license notice while asserting project rights over modifications.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Fork exclusively the shipped Senses v0.2.0 files into `.opencode/skills/sk-vision/vision-runtime/` and rebrand all identifiers to `SK_VISION_*`.

**How it works**: Stdio NDJSON protocol is maintained intact between `RuntimeClient` and `python/runtime.py`. All environment variables and cache roots shift from `SENSES_*` to `SK_VISION_*`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A: Full upstream repo fork including roadmap** | Includes potential future stubs | Introduces dead code, untested roadmap scaffolding | 4/10 |
| **B: Upstream npm dependency** | No maintenance burden | Upstream hardcodes SENSES envs and lacks Pi adapter hooks | 3/10 |
| **C: Shipped Core Fork with SK_VISION rebrand (Chosen)** | Clean footprint, zero namespace collisions, fully verified | Requires local maintenance of forked core | 9/10 |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

#### Positive
- Complete isolation from external package changes.
- Seamless dual-host integration via `dist/plugin.js`.

#### Negative
- Need to manually cherry-pick upstream bug fixes if desired.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Verification Checks

1. `ripgrep` confirms zero `SENSES_` occurrences in `vision-runtime/`.
2. TypeScript build creates `dist/plugin.js`.
3. Unit tests pass cleanly.
4. Python daemon starts and responds to status ping.
5. Strict spec validation passes.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

- Python venv path: `~/.cache/sk-vision/venv`
- Model weight cache: `~/.cache/sk-vision/models`
- Error tag format: `<SK-VISION error="..." />`
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
