---
title: "Implementation Summary: Public Doc Internal Spec Reference Removal"
description: "Concrete internal spec packet paths were removed from public-facing docs and replaced with portable contract wording."
trigger_phrases:
  - "public docs"
  - "internal spec references"
  - "implementation summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/032-public-doc-internal-spec-reference-removal"
    last_updated_at: "2026-05-18T09:12:49Z"
    last_updated_by: "codex"
    recent_action: "Removed concrete internal spec packet references from public docs and command assets"
    next_safe_action: "Ready for final handoff"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/commands/"
      - ".opencode/install_guides/"
      - ".opencode/plugins/README.md"
      - ".opencode/skills/"
    session_dedup:
      fingerprint: "sha256:828450c92c75cf6a740640c17b76b21073ca9b59cc8fecd840465b0320751d34"
      session_id: "public-doc-internal-spec-reference-removal-2026-05-18"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User requested a new cleanup packet under 000-release-cleanup/003-cross-cutting-cleanup-pass."
      - "Generic Spec Kit placeholders remain where they represent user-selected workflow inputs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `032-public-doc-internal-spec-reference-removal` |
| **Completed** | 2026-05-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Public-facing docs no longer point readers at this repo's internal spec packet folders. The cleanup replaced concrete `.opencode/specs/...`, `specs/system-spec-kit/...`, and `skilled-agent-orchestration/...` provenance with stable wording such as local command contracts, internal design notes, resilience assets, or generic user-provided placeholders.

### Public Documentation Cleanup

The root `README.md`, plugin README, Code Graph setup guide, command YAML assets, command markdown, skill references, feature catalogs, manual playbooks, and skill assets were scrubbed for hardcoded internal packet paths. Command assets now describe their local contract instead of carrying upstream `packet` fields that external users cannot resolve.

### Placeholder Policy

Generic placeholders remain where they are the actual product interface. Examples such as `<spec-folder>`, `<active-spec-folder>`, `specs/`, and `.opencode/specs/` stay in Spec Kit and memory command docs when they describe a path supplied by the user or a supported workflow root.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | Removed internal packet links and packet-history wording from public overview prose |
| `.opencode/commands/**` | Modified | Replaced upstream packet references with local contract wording and generic placeholders |
| `.opencode/install_guides/SET-UP - Code Graph.md` | Modified | Removed internal code-graph spec and research packet links |
| `.opencode/plugins/README.md` | Modified | Removed packet-history references from public plugin docs |
| `.opencode/skills/**` docs/assets/catalogs/playbooks | Modified | Replaced concrete internal provenance with portable wording |
| `032-public-doc-internal-spec-reference-removal/**` | Created/Modified | Added this cleanup packet and verification record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I used scoped `rg` searches to find concrete internal path roots, patched the public doc surfaces, then reran the searches until public-facing markdown/YAML/JSON assets were clean. A broad diff review caught one accidental runtime script-path edit, which was restored before final verification.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep generic Spec Kit placeholders | They are command inputs and workflow roots, not leaked internal packet paths |
| Exclude test fixtures from the public-doc pass | Fixtures intentionally encode internal paths to test parser behavior and are not user-facing docs |
| Use local contract wording in command YAML | External users need the shipped behavior contract, not the development packet path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Concrete internal path search across public docs | PASS: no matches outside test fixtures and runtime test data |
| Command/install/README packet-history search | PASS: no `packet NNN` / `Packet NNN` matches in `README.md`, `.opencode/commands`, or `.opencode/install_guides` |
| Diff review | PASS: restored the accidental non-doc package script replacement; remaining broad diffs are documentation/assets/catalog/playbook cleanup |
| Strict spec validation | PASS: `validate.sh --strict` returned exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical packet wording remains in some internal skill docs.** The concrete internal spec folder paths requested for external-facing cleanup are gone from public doc surfaces. Some internal historical notes still use generic "packet" language without linking to private spec folders.
2. **Test fixtures intentionally retain internal-looking paths.** These are parser fixtures and runtime validation data, not public docs.
<!-- /ANCHOR:limitations -->
