---
title: "Implementation Summary"
description: "`sk-prompt` is now a standalone routed-resource skill that keeps its name and its `/prompt:improve` command, with the fleet gate classifying it `[S]` and all 14 roots passing."
trigger_phrases:
  - "008 phase 006 summary"
  - "standalone-conversion results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/008-sk-prompt-standalone-conversion/006-standalone-conversion"
    last_updated_at: "2026-08-28T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase 6 complete; acceptance checks recorded"
    next_safe_action: "Execute 007-compiled-routing-withdrawal"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-006-standalone-conversion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Keep the engine's changelog as the skill's"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-standalone-conversion |
| **Completed** | 2026-08-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-prompt` is now a standalone routed-resource skill that keeps its name and its `/prompt:improve` command, with the fleet gate classifying it `[S]` and all 14 roots passing.

### The class follows one authored declaration

A root is a hub because it declares both a mode registry and a hub router. Deleting that pair is what reclassifies it; the other removals - the description, the command-metadata file, the stage-two router - follow from the contract's forbidden set for the new class rather than from preference.

### The command survives without a command-metadata file

That file is forbidden on a standalone root because every entry binds a command to a mode in a registry the root no longer has. Two existing standalone skills already own slash commands this way: the binding lives in the command definition under the commands directory, which is why `/prompt:improve` needed only its asset paths repointed.

### Flattening used git mv so history follows

The engine's references, assets, playbook, changelog and documents moved up a level as renames rather than delete-and-recreate, so the surviving skill keeps the engine's version lineage rather than starting over at the hub's.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-prompt-improve/**` | Modify | Flattened into the skill root by `git mv` to preserve history |
| `{mode-registry,hub-router,description,command-metadata}.json` | Delete | Forbidden on a standalone root |
| `ROUTER.md` | Delete | Stage-two hub control document |
| `leaf-manifest.config.json` | Create | Required on a standalone root |
| `leaf-manifest.json`, `leaf-aliases.json` | Modify | Regenerated for the single-mode root |
| `graph-metadata.json` | Modify | Family, domains, triggers, entities and causal summary rewritten |
| `feature-catalog/**` | Delete | Documented only the hub routing that no longer exists |
| `.opencode/commands/prompt/**` | Modify | Repoint the workflow assets at the flattened skill |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The contract's file matrix was read first and treated as the specification, so the target file set was decided before anything moved. The structural steps ran in dependency order - flatten, then delete the forbidden set, then author the config, then regenerate - with the fleet gate run after the regeneration to confirm the class actually flipped. Two mid-flight failures were recovered rather than worked around: git removing an emptied destination directory, and the compiler rejecting first an invalid entity kind and then an intent-signal count below its floor.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the engine's changelog as the skill's | The surviving skill is the engine; its version lineage is continuous, while the hub's entries describe a routing layer that no longer exists. |
| Delete the feature catalog rather than stub it | Both of its entries documented hub routing exclusively. A catalog describing a dispatch decision with one possible answer would be worse than none. |
| Regenerate the derived manifests through the gate's fix mode | They are a deterministic function of the config and the corpus; hand-writing them would rot on the next leaf added. |
| Restore from HEAD rather than reconstruct | When a failed move left files un-moved and a cleanup removed them, git already had the authoritative copies. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fleet metadata class gate | PASS - `[S] sk-prompt`, 14 of 14 roots |
| Derived manifest freshness | PASS - both regenerate byte-identically |
| Skill-graph compiler | PASS - validation passed after two rejections were fixed |
| Link integrity | PASS - 13790 links checked, 0 broken |
| Command binding | PASS - no asset references the pre-flatten path |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The skill no longer ships a feature catalog.** Its two entries documented only hub routing. Authoring one for the prompt-engineering surface is separate work, not part of this conversion.
2. **Benchmark reports under the skill still describe hub routing runs.** They are write-once evidence of what was measured at the time and were left intact.
<!-- /ANCHOR:limitations -->

---
