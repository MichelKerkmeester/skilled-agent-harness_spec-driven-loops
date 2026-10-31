---
title: "Implementation Summary"
description: "What phase 007 built: sk-create-goal registered in the sk-doc hub, reachable through both routing stages, with compiled routing republished."
trigger_phrases:
  - "sk-create-goal hub routing summary"
  - "goal mode newcomer replay"
  - "sk-doc compiled routing republish"
  - "create goal canary case"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/007-hub-routing-integration"
    last_updated_at: "2026-09-26T08:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Registered sk-create-goal and republished compiled routing"
    next_safe_action: "Execute phase 008"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/mode-registry.json"
      - ".skilled/skills/sk-doc/hub-router.json"
      - ".skilled/skills/sk-doc/ROUTER.md"
      - ".skilled/skills/sk-doc/graph-metadata.json"
      - "scratch/routing-after.md"
      - "scratch/publication-notes.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "execute-007-hub-routing-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Authoring-only aliases that route through both stages: settled by replay, 0 of 6 session-goal probes captured"
      - "Stage-two leaves: the mode's six real reference and asset files"
      - "Alias source: the packet's Keyword triggers line covers seven of the fourteen aliases; the rest live in the hub registry"
      - "Mirror the canary case into the authored source and republish: yes (operator, 2026-09-26)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-hub-routing-integration |
| **Status** | Complete |
| **Updated** | 2026-09-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A plain request to write a packet goal now reaches `sk-create-goal`. Before this phase none of the ten newcomer prompts did. The advisor sent seven of them to system-spec-kit, whose hook intent already claims "goal.md" and "packet goal". After it, nine of the ten go advisor to `sk-doc` and all ten route to the mode at the hub. None of the six session-goal and host-command probes reaches the mode at either stage.

### Phase 7: hub-routing-integration

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/mode-registry.json` | Modified | One workflow row, `/create:goal`, fourteen aliases, metadata routing. |
| `.skilled/skills/sk-doc/hub-router.json` | Modified | Router signal, vocabulary class and tie-break position. |
| `.skilled/skills/sk-doc/ROUTER.md` | Modified | `GOAL_AUTHORING` intent, resource map and inventory leaves. |
| `.skilled/skills/sk-doc/graph-metadata.json` | Modified | Advisor vocabulary for goal-file authoring. |
| `.skilled/skills/sk-doc/description.json` | Modified | Hub description and keywords. |
| `.skilled/skills/sk-doc/SKILL.md` | Modified | Mode row and count, fifteen modes across fourteen packets. |
| `.skilled/skills/sk-doc/leaf-manifest.json` | Regenerated | From the registry and the mode's leaves. |
| Runtime and authored `007-sk-doc/fixtures/canary-cases.v1.json` | Modified | The `single-create-goal` case, byte-identical in both copies. |
| Runtime and authored `013-live-activation/activation/sk-doc/manifest.json` | Regenerated | Re-minted by `compiled-route-manifest.cjs refresh`. |
| `scratch/` | Created | Before, after and final replay records and the publication notes. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A MiMo 2.6 Pro worker at high thinking did the registration on cli-pi. The operator chose it after cli-codex ran out of quota and LLM Gateway GPT-6 Luna failed on every second tool call. The worker captured the baseline first and edited the six hub files. It regenerated the manifest, added the canary case and published compiled routing. The sync first failed because the authored activation manifest still pinned the old policy. The worker re-minted it through the manifest tool and the sync passed.

The orchestrator then found three things and fixed them:

- The worker had added the canary case to the runtime fixture only, and after finalize. The next rebuild would have dropped it. The operator approved mirroring it into the authored source.
- Whole-file writes had dropped the trailing newline from five files.
- Those fixes changed hub bytes, so the orchestrator republished through refresh, sync, every gate and finalize.

The orchestrator's own replay matched the worker's before and after the republish.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use git HEAD as the rollback source instead of a `cp -p` copy | The seven hub files were tracked and unmodified before the edit, so HEAD holds the exact pre-change bytes. |
| Keep seven registry aliases beyond the packet's keyword line | The packet file is out of scope here. The replay shows none of the extra aliases captures a session-goal request. |
| Mirror the canary case into the authored fixture | The runtime fixture is rebuilt from it. The frontmatter mode's reachability fix edited the same authored tree in one commit. |
| Record the topology counts rather than pin them | The sk-doc harness derives them from the registry at build time: 15 destinations, rows and tuples and 14 packets. There is no pinned number to edit. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Newcomer prompts, before | 0 of 10 reach the mode; 0 of 6 probes (`scratch/routing-before.md`) |
| Newcomer prompts, after | 10 of 10 route to the mode at the hub; 9 of 10 reach `sk-doc` at the advisor; 0 of 6 probes (`scratch/routing-after.md`, `scratch/routing-replay-final.txt`) |
| Positive prompt through both stages | "Write a goal.md for this spec packet." goes `sk-doc@0.9474` then `route [sk-create-goal]` |
| JSON parse of the four hub JSON files | OK |
| `generate-leaf-manifest.cjs --check .skilled/skills/sk-doc` | `leaf-manifest.json OK` |
| `parent-skill-check.cjs .skilled/skills/sk-doc` | `OK: all hard invariants passed, 0 warnings`; the `6a` failure is closed |
| `compiled-route-status.cjs --all --no-probe` | All seven hubs `compiled-serving` |
| `compiled-route-sync.cjs --verify` and `compiled-route-guard.cjs` | `move-simulation OK: all 7 hubs resolve`; runtime matches source |
| sk-doc canary | 22 pass, 0 fail, including `single-create-goal -> route single [sk-create-goal]` |
| `compiled-route-admission.cjs --all` | sk-doc `pass`, 24 pass and 0 drift; sk-design 1 drift with no sk-design input changed; CI runs it `--warn-only` |
| Kill-switch | `{"servingAuthority":"legacy","hubId":"sk-doc"}` |
| Lock and rollback | None left after `--finalize` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/007-hub-routing-integration --strict` | `RESULT: PASSED`, 0 errors and 0 warnings, on 2026-09-26 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One newcomer prompt still reaches the mode only at the hub.** "Draft the phase parent's directive and a complete list of phase-child goal files." tops out at system-spec-kit in the advisor. The hub routes it to the mode.
2. **sk-design admission drift predates this phase.** No sk-design input changed. CI runs admission warn-only.
3. **The Hermes copies of the hub and mode are stale until phase 008.** `sync-skills-hermes.cjs --check` reports `DRIFT sk-doc` and `DRIFT sk-create-goal`, and phase 008 regenerates both.
<!-- /ANCHOR:limitations -->

---
