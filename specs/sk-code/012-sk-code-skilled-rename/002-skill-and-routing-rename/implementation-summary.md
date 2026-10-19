---
title: "Implementation Summary"
description: "The sk-code surface for the framework's own code now answers to sk-code-skilled, code-skilled and SKILLED, and every gate that passed before the rename passes after it."
trigger_phrases:
  - "skill and routing rename implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/012-sk-code-skilled-rename/002-skill-and-routing-rename"
    last_updated_at: "2026-10-18T19:50:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Renamed the surface and rebuilt routing artifacts; all gates green"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-skilled/SKILL.md"
      - ".skilled/skills/sk-code/mode-registry.json"
      - ".skilled/skills/sk-code/hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-skilled-rename-2026-10-18"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-skill-and-routing-rename |
| **Completed** | 2026-10-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A request about the framework's own code now routes to `sk-code-skilled` through both routing stages. The same prompt on `main` still routes to `sk-code-opencode`, which shows the change, not just the files, took effect.

### Phase 2: skill-and-routing-rename

The packet folder, its hermes mirror, its changelog alias and six playbook scenarios moved to the new names. Every identity spelling outside this packet was rewritten: kebab, snake, upper snake, camel and the spaced trigger-phrase form. Inside the sk-code hub and the advisor plugin, the surface id OPENCODE became SKILLED. The leaf manifest, compiled-route manifest, advisor DB, hermes mirror and trigger index were rebuilt with their own tools.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-skilled/` | Renamed | The surface packet under its new name |
| `.skilled/skills/sk-code/{mode-registry,hub-router,graph-metadata,leaf-manifest,description}.json` | Modified | Hub routing carries the new ids |
| `.skilled/changelog/sk-code/code-skilled` | Renamed | Changelog alias symlink re-pointed |
| `.opencode/plugins/system-skill-advisor.js` | Modified | Surface id SKILLED |
| `.skilled/commands/doctor/scripts/` | Modified | Literal pins and their tests |
| `.hermes/skills/sk-code-skilled/` | Regenerated | Materialized mirror |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A scripted pass did the moves and text rewrites in one run over the worktree, then each generated artifact was rebuilt and checked with its own gate. Results were compared against the baseline logs captured before the change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave the runtime id OPENCODE alone outside the hub | Outside sk-code the token names the OpenCode runtime, so it is renamed only where it means this surface |
| Rebuild generated files rather than edit them | Each has a drift check that flags a hand edit |
| Exclude this packet's own docs from the sweep | They describe the rename itself and would read as nonsense after it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Drift guards | PASS, 4 of 4, same 8 warnings as baseline |
| Packet, surface-hint, typo-flag, plugin, create-skill tests | PASS |
| Doctor test suite | PASS |
| Advisor plugin vitest | PASS, 94 of 94 |
| Rename-tooling harness, anchor-repair and retrieval vitest | PASS (harness 4 of 4, retrieval 108 of 108) |
| `parent-skill-check.cjs .skilled/skills/sk-code` | PASS after leaf-manifest regeneration |
| `compiled-route-guard.cjs`, `compiled-route-sync.cjs --check` | PASS, all hubs fresh |
| `sk-code-setup-check.cjs` | PASS |
| Advisor rebuild | generation 7, `packetId: sk-code-skilled` |
| Hermes mirror | PASS, 68 copies in sync |
| Trigger index `--check` | PASS, no old-name entries |
| `/deep:review:auto`, 3 iterations on cli-devin `deepseek-v4-1-flash-max` (`../review/review-report.md`) | PASS, 0 P0, 0 P1, 4 P2; fixed: two JSON-escaped `\ncode-opencode` misses, the `OPENCODE_LANGUAGES` / `detectOpencodeLanguages` / `OPENCODE_PATH_MARKER` identifiers and this runtime-name claim; kept: this packet's own generated phrase variant |
| Runtime names `.opencode/` and `cli-opencode`, `git grep -c` outside this packet (`scratch/after/runtime-names.txt`) | 1,191,108 at HEAD, 1,191,103 staged; the 5-line delta is all regenerated derived fields (three re-derived `graph-metadata.json` key-file lists, one regenerated `phrase-variants.json`), with no runtime name rewritten |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Benchmark reports keep the old name.** They are recorded run output under `benchmark/reports/`, excluded by the operator's history choice for machine records.
2. **The OPENCODE token in spec history is unchanged.** In specs it mixes the surface and the runtime, so it cannot be renamed safely by pattern.
<!-- /ANCHOR:limitations -->

---
