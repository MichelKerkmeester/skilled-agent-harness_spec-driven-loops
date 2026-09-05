---
title: "Implementation Summary: Phase 7: memory-command-family-naming-decision"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-decommission-debt-fixes/007-memory-command-family-naming-decision"
    last_updated_at: "2026-09-05T09:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Executed Stage B inside 002-scripts-into-runtime-nesting"
    next_safe_action: "None; packet closeable"
    blockers: []
    key_files:
      - "decision-record.md"
      - ".opencode/commands/speckit/save.md"
      - ".opencode/commands/speckit/search.md"
      - ".opencode/commands/doctor/_routes.yaml"
      - "scratch/code-path-followups.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-007-memory-command-family-naming-decision-stage-a"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Keep literal (Option A) or rename with a compatibility window (Option B)? Operator chose Option B, hard cutover, no aliases"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-memory-command-family-naming-decision |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The operator decided directly (2026-09-05): rename the memory command family into the spec-kit family, hard cutover, no aliases. Stage A of that decision is done: `/memory:save` and `/memory:search` are gone, `/speckit:save` and `/speckit:search` exist in their place under `.opencode/commands/speckit/`, `/doctor memory` is `/doctor speckit-retrieval`, and every live document-level reference to the old names outside `system-spec-kit`'s `scripts/`, `runtime/` and `shared/` is updated. Stage B — moving the compiled writer's own code path — is also done: it executed inside `002-scripts-into-runtime-nesting/` per an operator-approved scope amendment once that phase's scripts -> runtime/cli move was in flight, since both renames touch the same tree. The writer now lives at `runtime/cli/continuity/generate-context.ts` (compiled to `runtime/cli/dist/continuity/generate-context.js`), the `command-contract.json` family key is `continuity`, and `generate-command-routers.cjs`'s hardcode matches. See that packet's `implementation-summary.md` for the full evidence.

### Memory Command Family Naming Decision

`decision-record.md` ADR-001 records Option B (rename, hard cutover) over Option A (keep literal) and a rejected aliased-window variant, with the blast-radius evidence and the D7 supersession scoped to command names only.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/memory/` | Deleted | Folder removed after its contents moved |
| `.opencode/commands/speckit/save.md`, `search.md` | Created (moved) | `/speckit:save`, `/speckit:search` command definitions |
| `.opencode/commands/speckit/assets/save-presentation.txt`, `search-presentation.txt` | Created (moved) | Presentation contracts, keeping the prefix-dropped naming convention |
| `.opencode/commands/speckit/README.txt` | Modified | Merged `memory/README.txt`'s content (search lanes, tool coverage matrix, declared losses) into the speckit command index |
| `.opencode/commands/README.txt` | Modified | Removed the `memory` group row, folded save/search into the `speckit` group, updated the doctor target list |
| `.opencode/commands/doctor/_routes.yaml` | Modified | `target: memory` -> `target: speckit-retrieval`; asset renamed |
| `.opencode/commands/doctor/assets/doctor-memory.yaml` | Renamed to `doctor-speckit-retrieval.yaml` | Internal invariant keys, report/state-log path stems and the `/doctor memory` self-references renamed |
| `.opencode/commands/doctor/speckit.md`, `assets/doctor-speckit-presentation.txt` | Modified | Execution-targets table row and every visible target label/menu item renamed |
| `CLAUDE.md`/`AGENTS.md` (symlink pair), `README.md`, `.opencode/install-guides/README.md` | Modified | Every `/memory:save`/`/memory:search`/`/doctor memory` reference renamed |
| `.opencode/agents/orchestrate.md`, `.claude/agents/orchestrate.md` | Modified | Canonical + hand-maintained mirror, both edited identically |
| `.codex/agents/orchestrate.toml`, `.pi/agents/orchestrate.md` | Regenerated | Via `sync-agents.cjs` / `sync-agents-pi.cjs` from the updated canonical |
| `.codex/prompts/speckit-{save,search}.md`, `.pi/prompts/speckit-{save,search}.md` | Regenerated | Via `sync-prompts.cjs` / `sync-prompts-pi.cjs`; stale `memory-{save,search}.md` mirrors removed |
| `.cursor/commands/speckit-{save,search}.md`, `.claude/commands/speckit/{save,search}.md` | Regenerated | Via `sync-runtime-mirrors.cjs`; a stale `.claude/commands/memory/` symlink directory (broken after the canonical move) removed by hand since the sync tool does not prune now-orphaned subdirectories |
| ~78 `create`/`deep`/`speckit`/`doctor` command assets, root docs, and skill `SKILL.md`/reference files across `cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-git`, `sk-prompt`, `system-deep-loop`, `sk-doc`, and `system-spec-kit`'s own non-`scripts`/`runtime`/`shared` reference docs | Modified | Renamed every live `/memory:save`, `/memory:search`, bare `memory:save`/`memory:search`, and `/doctor memory` mention; left `_memory.continuity`, `references/memory/*.md`, `scripts/dist/memory/`, and the generic English word "memory" untouched |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | `router_path`/`owned_assets`/`invocation_aliases`/presentation-exception paths and command names updated; the `memory` family *key* is kept because `generate-command-routers.cjs` hard-codes a string check against it and that script lives under `system-spec-kit/scripts/`, out of this phase's edit authority |
| `specs/sk-doc/019-.../013-live-activation/activation/{cli-external-orchestration,mcp-tooling}/manifest.json` | Modified | Copied from the freshly re-minted runtime manifests so `compiled-route-guard.cjs` reports both hubs fresh again after the SKILL.md/reference edits above changed their routed content |
| `scratch/code-path-followups.md`, `scratch/scripts-dist-memory-blast-radius.txt` | Created | Stage B starting inventory: every remaining code-path site naming `memory`, with file:line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A repository-wide grep for the exact command-name tokens (`/memory:save`, `/memory:search`, the bare colon forms, `/doctor memory`, and the `MEMORY:*` render labels) located every live site; each match was read in context before being changed, since the same files also carried `_memory.continuity` (a frontmatter field), `scripts/dist/memory/` (the code path), and `references/memory/*.md` (a reference-doc folder) that all needed to survive untouched. Mechanical literal-string substitution handled the ~80 files where only the token needed to change; the command move, the two README merges, the doctor-route rename, and the JSON contract update were each hand-edited to preserve their document structure. Every runtime-mirror sync script was then run to regenerate the derived copies rather than hand-editing them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the `command-contract.json` family key as `memory` | `generate-command-routers.cjs` hard-codes `family === 'memory'` to decide whether a direct-dispatch family drops its asset-name prefix; renaming the key without editing that script (under `system-spec-kit/scripts/`, out of this phase's authority) would desync the router drift check. Renamed only the paths and command names inside the block; the key rename is a Stage B item, named in `scratch/code-path-followups.md` |
| Keep `save-presentation.txt`/`search-presentation.txt` prefix-free | The contract's naming rule drops the family prefix whenever the bare command name already reads unambiguously; `save`/`search` still do, even after moving into the shared `speckit/assets/` folder |
| Amend this phase's own scope rather than open a silent workaround | The operator directed Stage A execution inside this phase, which the original `spec.md` explicitly excluded ("no rename... in this phase"). Recorded as a dated Scope Amendment in `spec.md` plus this file, rather than either refusing the instruction or quietly ignoring the frozen-scope conflict |
| Leave `.opencode/skills/system-skill-advisor/mcp-server/**` untouched | That routing/scoring corpus still names the old commands as example strings, but it belongs to a different, actively-owned packet (024); touching it risked colliding with concurrent work outside this phase's authority |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate-command-references.cjs` (before) | OK — 64 asset files, `[create, deep, design, doctor, prompt, speckit]` |
| `route-validate.sh` (before) | OK — 9 routes, 2 pre-existing informational warnings |
| Command + doctor rename executed | `.opencode/commands/memory/` removed; `speckit/save.md`, `search.md` created; `_routes.yaml` target renamed; `doctor-memory.yaml` renamed `doctor-speckit-retrieval.yaml` |
| `node generate-command-routers.cjs` (after) | `routers=30 clean=30 path-drift=0 shape-drift=0` |
| `node validate-command-references.cjs` (after) | OK — 64 asset files, same family list |
| `bash route-validate.sh` (after) | OK — 9 routes validated, 2 warnings (same pre-existing pair) |
| `bash route-validate.sh --self-test` | All 6 fixtures correctly rejected |
| `check-agent-mirror-sync.cjs orchestrate.md` (both runtimes) | `agent-mirror-sync: 1 agent(s) checked — all mirrors in sync — OK` |
| `sync-agents.cjs` / `sync-agents-pi.cjs` | Wrote 1 of 12 generated agents each (orchestrate) |
| `sync-prompts.cjs` / `sync-prompts-pi.cjs` | Wrote 2/3 of 35 generated prompts; both report PASS on re-check |
| `sync-runtime-mirrors.cjs` | `PASS: 169 mirrors across 8 trees are in sync` (after linking 4, removing 2, and hand-removing one stale `.claude/commands/memory/` symlink directory the sync tool does not prune) |
| Grep for old command names, repo-wide | Only historical (`specs/`, `changelog/`, `z_archive/`, benchmark reports) and two files under `system-spec-kit/scripts/` (out of edit authority; listed in `scratch/code-path-followups.md`) remain |
| Trigger index regenerated twice | First pair diverged (`corpusBytes` drifted 234088609 -> 234088933, evidence of concurrent repo activity mid-run, not this phase's edits); a clean back-to-back pair produced identical `indexSha256` `e98bd2b2d23885720d345693e9a1290025f28b869d2e68df53f54664afc94d6f` |
| `ci-skill-derived-freshness.cjs` | `checked=14 fresh=14 stale=0 errored=0` |
| `ci-skill-root-metadata.cjs` | `checked=14 passed=14 failed=0 fixed=0` |
| `compiled-route-guard.cjs` | 2 hubs (`cli-external-orchestration`, `mcp-tooling`) reported stale after the SKILL.md/reference edits; re-minted via `compiled-route-manifest.cjs refresh`, then the runtime manifest copied to its authored twin under `specs/sk-doc/019-.../015-router-unification-program/`; final run: all 5 hubs fresh |
| `validate_document.py` on every changed markdown file | No new failures versus the pre-edit baseline (3 files carry pre-existing, unrelated failure classes verified identical before/after: `speckit/README.txt` missing purpose/instructions sections, `AGENTS.md` missing an overview section, `decision-record.md`'s anchor-navigation shape matches every other `decision-record.md` in the repo) |
| `validate.sh <phase folder> --strict` | See Known Limitations — blocked pending `repair-derived.cjs --apply` and a fresh continuity save, run after this document |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Stage B complete**, executed inside `002-scripts-into-runtime-nesting/` per an operator-approved scope amendment rather than a separately Gate-3'd packet (shared blast radius with that phase's scripts -> runtime/cli move). `scripts/memory/` moved to `runtime/cli/continuity/`, the compiled entry is `runtime/cli/dist/continuity/generate-context.js`, the session-stop hook's four fallback candidates now resolve there, `runtime/cli/package.json`'s description says "continuity management", and `command-contract.json`'s family key plus `generate-command-routers.cjs`'s hardcode both read `continuity`. See that packet's `implementation-summary.md` for the full evidence.
2. **`system-skill-advisor`'s routing corpus untouched.** Its vocabulary maps and routing-accuracy fixtures still reference the old command names as example strings; that packet is actively owned elsewhere (024) and was left alone.
3. **Generated metadata (`description.json`, `graph-metadata.json`) needs a repair pass.** This document and the spec/tasks amendments above were written after the file changes; `repair-derived.cjs --apply` regenerates the derived fields and the description fingerprint before this phase's `validate.sh --strict` can pass clean.
<!-- /ANCHOR:limitations -->

---
