---
title: "Implementation Summary: Command Metadata as a Hub Standard"
description: "Delivered: command-metadata.json required on every hub with a hub-agnostic core schema validated by the fleet gate; six surfaces authored (19 entries + 3 empty declarations), scaffolder and doctrine updated, cross-model verified."
trigger_phrases:
  - "command metadata implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/022-command-metadata-generalization"
    last_updated_at: "2026-07-28T13:08:48Z"
    last_updated_by: "claude-code"
    recent_action: "Delivered the hub command-metadata standard"
    next_safe_action: "None; future advisor consumption of ownedSignals is a separate packet"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-command-metadata-generalization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Command Metadata as a Hub Standard

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-28 |
| **Execution model** | Orchestrator builds code; LUNA xhigh authors the two large surfaces; SOL high adversarially verifies |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`command-metadata.json` graduated from an sk-design-only overlay to a **class-H requirement**: every hub declares its slash-command surface as checkable data, `[]` when it owns none.

- **Core schema library** (`create-skill/scripts/lib/command-metadata-schema.cjs`): pure validation of `command`, `ownerMode`, `description`, `argumentHint`, `userIntent{job, ownedSignals[]}`, `choreography[{order, skill, resource, action}]`; per-file uniqueness of command ids and owned signals; unknown extension fields legal so richer per-hub validators layer above the core.
- **Fleet-gate integration**: for every H root the gate parses the file, binds owner modes to `mode-registry.json`, resolves choreography resources and `.opencode/commands/<family>/<name>.md` definition files on disk, and reports `COMMAND_METADATA_*` violations naming the offending command.
- **Contract flip**: required for H, forbidden for S (entries bind to registry modes a standalone lacks); the overlay set is now empty with the mechanism retained.
- **Authored surfaces**: sk-doc 11 `/create:*` entries and system-deep-loop 8 `/deep:*` entries (LUNA xhigh, self-validated against the gate), sk-prompt 1 `/prompt:improve` entry, empty declarations for cli-external-orchestration, mcp-tooling, sk-code. sk-design's existing file passes the core schema byte-unchanged — the subset proof.
- **Scaffolder + doctrine**: the parent-hub scaffold writes `[]`; canonical contract doc v1.1.0.0; SKILL.md workflow step; both script READMEs; contract and doctor test suites extended.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Consumer-first: the schema library and gate wiring landed before any file widened, so the baseline run itself demonstrated the standard (six hubs failing on the new requirement, sk-design passing). Surfaces were then authored against live gate output, the scaffolder taught, and the whole diff adversarially reviewed by a second model.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Core-as-subset**: the schema was frozen only after confirming sk-design's richest file already satisfies it, so generalization required zero migration and broke none of its four existing validators.
- **Empty array over absence**: uniform presence with honest content — a hub with no commands says so as data, and the gate never has to guess whether absence means "none" or "forgot".
- **`/doc:quality` omitted**: the registry names it but no definition file exists anywhere; including it would have laundered a pre-existing inconsistency through the new standard. Recorded for the registry's owner.
- **Advisor consumption deferred**: `ownedSignals` now exist fleet-wide as routing data; wiring them into advisor scoring is a distinct packet with its own baseline discipline.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Fleet class gate | `checked=11 passed=11`, all seven hubs command-validated |
| Seeded mutations | unknown ownerMode + missing resource both caught; restored; clean |
| Contract + doctor suites | pass (H-required, S-forbidden, uniformity; fixture carries `[]`) |
| Freshness gate | 11/11 (command-metadata is not a leaf) |
| sk-code drift guards | 3/3 |
| Scaffold proof | `--kind parent` and standalone both pass with `--fix`, idempotent |
| Cross-model review | SOL high: 4 findings — 3 confirmed and fixed (choreography zero-order off-by-one; stale `/prompt-improve` registry id corrected to `/prompt:improve` with manifest refresh; focused schema unit tests added), 1 no-change (the flagged untracked spec files are this packet's own docs, authored mid-review) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Signals are unique per file, not yet per fleet.** Cross-hub signal collisions become checkable (and worth checking) when the advisor starts consuming them.
- **The registry/definition mismatch for `/doc:quality` remains open** — deliberately surfaced, not fixed here, since the registry belongs to a different concern.
- **Choreography depth is minimal-core** for the newly authored entries (hub → mode → workflow asset where the command doc names one); hubs may deepen entries with extension fields as their validators mature.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:amendment-presence-optional -->
## Amendment (2026-07-29): command-metadata is class-H optional, not required

This supersedes the "H-required" claims in the Verification section above. The original standard required every hub to carry `command-metadata.json` even when it owned no slash commands, which forced the command-less hubs to keep an empty-array placeholder that no consumer reads. Per operator direction ("if there are no related commands, don't have the json for that skill"), the presence rule was reversed:

- **`command-metadata.json` moved from the class-H required set to the class-H optional set** in `skill-root-metadata-contract.cjs`: it is validated against the core schema when present, allowed absent when the hub owns no commands, and still **forbidden on standalone (S) roots** (they have no registry mode to bind a command to). The fleet gate already validated the file present-only (`if (!existsSync) return []`), so no gate-body change was needed once the required-set entry was removed.
- **The empty `command-metadata.json` files were removed** for the three command-less hubs `sk-code`, `mcp-tooling`, and `cli-external-orchestration`.
- **`init_skill.py` no longer scaffolds an empty `[]`** for a new hub; the file is authored only when the hub gains its first command.
- The contract unit test's "missing command-metadata on a hub is a violation" case was flipped to assert the absence is now conformant.

**Independent drift fixed in the same pass:** the `create-skill`→`sk-create-skill` mode rename had left `sk-doc`'s (×11) and `sk-prompt`'s (×1) command-metadata `ownerMode`s pointing at dead mode ids; each was reprefixed to its live registry mode (`create-skill`→`sk-create-skill`, `prompt-improve`→`sk-prompt-improve`, etc.).

**Verification (v4 `a7ae763521`):** fleet class gate `checked=11 passed=11 failed=0`; contract unit test passes; `parent-skill-check.cjs` exits 0 for all hubs; leaf-manifest freshness 11/11. **Out-of-scope pre-existing failure surfaced, not fixed here:** `command-binding-existence.vitest.ts`'s namespace sanity check expects a `design` command namespace that no longer exists (sk-design's commands live under `interface/` after that rename) — a stale test assertion independent of this change.
<!-- /ANCHOR:amendment-presence-optional -->
