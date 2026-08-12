---
title: "Implementation Status: sk-communication skill"
description: "The sk-communication standalone skill is authored, validated, and advisor-routable."
trigger_phrases:
  - "sk-communication implementation status"
importance_tier: "standard"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-communication-skill"
    last_updated_at: "2026-08-12T17:49:00Z"
    last_updated_by: "claude"
    recent_action: "Applied deep-review remediation to the skill docs and packet"
    next_safe_action: "Optionally clear the deferred P2 review advisories"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - ".opencode/skills/sk-communication/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-communication-skill-20260812"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The skill is a validated, advisor-routable wrapper for the communication-projection package."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Status: sk-communication skill

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-sk-communication-skill |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A standalone skill at `.opencode/skills/sk-communication/`. Its `SKILL.md` routes a request to the correct subsystem of the communication-projection package and enforces the invariants: canonical bytes stay unchanged, privacy runs before ranking, every runtime path declares a full-projection or safe-native tier, failures return the exact original, telemetry is content-free, and a release needs human-certified non-inferiority evidence. `graph-metadata.json` carries real projection domains and intent signals with sibling edges to `sk-code`, `sk-design`, and `sk-doc`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The skill was scaffolded with the create-skill initializer, then `SKILL.md` and `graph-metadata.json` were authored by hand, the manifest and aliases were generated, and the canonical validators plus an advisor smoke test confirmed the result.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Standalone skill, not a parent hub | One identity with one contract; there is no multi-mode dispatch to justify a hub. |
| Point at the package rather than duplicate it | The package is the single source of truth; the skill routes to it and enforces its invariants. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Skill-root metadata | PASS: `ci-skill-root-metadata` class-S 12/12, 0 failed |
| Package validation | PASS: `validate_skill_package.py` clean |
| Advisor routing | PASS: sk-communication is the top recommendation for the projection intent |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Bundled with an unmerged package**: the skill and the `packages/cli-communication-projection/` package it points at both live on the `skilled/0143-provider-adapters-privacy` branch and land to a release branch together.
<!-- /ANCHOR:limitations -->
