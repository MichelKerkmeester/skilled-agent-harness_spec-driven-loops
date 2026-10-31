---
title: "Decision Record: Memory Command Family Naming"
description: "The operator chose Option B: rename the memory command family into the spec-kit family as a hard cutover. This records the choice, the blast-radius evidence, and that it supersedes D7 for command names."
trigger_phrases:
  - "memory command family naming decision"
  - "speckit save search rename"
  - "doctor memory route rename"
  - "D7 supersession command names"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/007-memory-command-family-naming-decision"
    last_updated_at: "2026-09-05T09:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded Option B and executed the stage A doc/command rename"
    next_safe_action: "Open the stage B follow-on packet to move scripts/memory to scripts/continuity"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/save.md"
      - ".opencode/commands/speckit/search.md"
      - ".opencode/commands/doctor/_routes.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-007-memory-command-family-naming-decision"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Keep literal (Option A) or rename with a compatibility window (Option B)? Operator chose Option B, hard cutover, no aliases"
---
# Decision Record: Memory Command Family Naming

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Rename the memory command family into the spec-kit family, hard cutover

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-05 |
| **Deciders** | Operator, claude-code |

---

<!-- ANCHOR:adr-001-context -->
### Context

Packet 052's D7 decision (`specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing/goal.md:61`) chose, for that packet's scope: "Command names, paths and frontmatter keys stay literal." This phase's `spec.md` found that precedent no longer holding at scale: `/memory:save`, `/memory:search`, `.opencode/commands/memory/`, and the `/doctor memory` route carried the retired word "memory" through the command surface, the doctor route manifest, every `speckit`/`deep`/`create` command asset that documents the save workflow, agent mirrors, and the skill's own reference docs. A repository-wide search for the literal string `scripts/dist/memory` (the compiled writer's code path, distinct from the command names) returns 84 live matches at decision time — close to the 87 the spec recorded, the small drift expected since other phases in this packet touch adjacent files (SC-002 already allows for this).

The command-name blast radius measured before this phase's edits, by consumer class:

| Consumer class | Files |
|---|---|
| Command definitions + presentation assets (`.opencode/commands/memory/**`) | 5 (`save.md`, `search.md`, `README.txt`, `save-presentation.txt`, `search-presentation.txt`) |
| Command index docs (`.opencode/commands/README.txt`, `speckit/README.txt`) | 2 |
| `create`/`deep`/`speckit`/`doctor` command assets referencing `/memory:save` or `/memory:search` as a follow-up action | 33 |
| Doctor route manifest + router + presentation (`_routes.yaml`, `doctor-memory.yaml`, `speckit.md`, `doctor-speckit-presentation.txt`) | 4 |
| Root docs (`CLAUDE.md`/`AGENTS.md` symlink pair, `README.md`, install-guides) | 3 |
| Agent files (`.opencode/agents/orchestrate.md` + `.claude/agents/orchestrate.md`, mirrored to `.codex`/`.pi`) | 2 authored + 2 regenerated mirrors |
| `system-spec-kit` reference docs (`ARCHITECTURE.md`, `README.md`, `SKILL.md`, `references/**`, `templates/addons/handover.md.tmpl`) | 18 |
| Other skills' `SKILL.md` and references (cli-external-orchestration, mcp-code-mode, mcp-tooling, sk-code, sk-git, sk-prompt, system-deep-loop) | 20 |
| sk-doc contract/template assets (`command-contract.json`, `command-template.md`, `frontmatter-templates.md`) | 3 |
| A live manual-testing-playbook scenario naming the writer by its command name | 1 |

Total: 91 documents touched in this phase (Stage A). The compiled writer's own code path (`scripts/memory/generate-context.ts`, `scripts/dist/memory/generate-context.js`), the hook fallback candidates in `runtime/hooks/claude/session-stop.ts:73-76`, and the JSON contract's internal `memory` family key (which a hard-coded string check in `generate-command-routers.cjs` keys off, and which lives under `system-spec-kit/scripts/` — out of this phase's edit authority) are unchanged and listed in `scratch/code-path-followups.md` for the Stage B execution packet.

### Constraints

- No aliases: the operator's instruction was explicit that `/memory:save` and `/memory:search` are removed in the same change that introduces `/speckit:save` and `/speckit:search`, not deprecated alongside them.
- Code paths (`scripts/memory/`, `scripts/dist/memory/generate-context.js`, the hook's path candidates) stay untouched in this stage; moving them is a rename on the scale of packet 053's `mcp-server` -> `runtime` move and needs its own review pass.
- `generate-command-routers.cjs` (under `system-spec-kit/scripts/`, not editable from this packet) hard-codes a string check against the family key `"memory"` in `command-contract.json` to decide whether a direct-dispatch family's asset names drop the family prefix. Renaming that JSON key without also editing the script would desync the router drift check. The key's rename is deferred to whichever Stage B packet is allowed to touch that script.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option B — rename `/memory:save` to `/speckit:save`, `/memory:search` to `/speckit:search`, and `/doctor memory` to `/doctor speckit-retrieval`, as a hard cutover with no compatibility aliases. `.opencode/commands/memory/save.md` and `search.md` move into `.opencode/commands/speckit/`, keeping their existing prefix-dropped asset-naming convention (`save-presentation.txt`, `search-presentation.txt`) since that convention was never about the word "memory" — it drops the family prefix whenever a bare command name already reads unambiguously, and `save`/`search` still do.

**How it works**: Stage A (this change) moves and edits every document-level reference — command definitions, presentation contracts, the doctor route manifest, command index docs, agent files and their runtime mirrors, and every skill's `SKILL.md`/references that named the old commands — while leaving every code path (`scripts/memory/`, `scripts/dist/memory/generate-context.js`, the session-stop hook's fallback candidates, and the `command-contract.json` family key) untouched and inventoried for Stage B. Stage B, a follow-on packet opened under Gate 3, executes the code-path move.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **B — rename with hard cutover (chosen)** | The command surface stops carrying a name for a database that no longer exists; `/speckit:*` reads as one coherent family instead of two; matches the operator's stated intent | A rename on the scale of packet 053's `mcp-server` -> `runtime` move; touches ~91 documents in this stage alone plus a Stage B code-path move | 9/10 |
| A — keep literal, document the reinterpretation | No file moves, no path changes, cheapest immediate cost | Leaves a permanently confusing surface: new contributors read `/memory:save` and reasonably assume a memory database exists; extends D7's precedent past the point the evidence in this phase's `spec.md` showed it strains | 4/10 |
| Rename with a compatibility window (aliases, deprecate later) | Softer landing for any external muscle memory | The operator explicitly asked for a hard cutover, not a window; an alias for a slash command family in this codebase has no precedent to model it on, and it would extend, not shorten, the confusing-surface period Option A already costs | 3/10 |

**Why this one**: The operator decided directly (2026-09-05), and the reasoning matches the evidence this phase's `spec.md` gathered: the literal-naming precedent (D7) was scoped to packet 052's smaller surface, and it does not hold at 84-91 files. A hard cutover is also simpler to verify than a compatibility window — there is one name per command, not two, so residue sweeps and drift guards have one thing to check rather than an alias table to keep in sync and later retire.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The command surface no longer implies a memory database exists; `/speckit:save`, `/speckit:search`, `/speckit:plan`, `/speckit:implement`, `/speckit:complete` and `/speckit:resume` read as one family under one folder.
- `.opencode/commands/speckit/README.txt` now documents all six commands plus the retrieval tool-coverage matrix in one place, rather than splitting continuity write/search into a separate `memory/README.txt` a reader had to know to look for.
- D7 is superseded for command names specifically; it still holds for the code-path names this phase leaves untouched, so the supersession is scoped, not a blanket reopening of packet 052's decision.

**What it costs**:
- A second packet (Stage B) must still move `scripts/memory/` to `scripts/continuity/`, `scripts/dist/memory/generate-context.js` to `scripts/dist/continuity/generate-context.js`, and update the session-stop hook's four fallback path candidates plus the `command-contract.json` family key and its consuming script. Mitigation: `scratch/code-path-followups.md` in this folder lists every site with file:line so Stage B starts from a reproduction, not a fresh search.
- Every reference this phase updated needed a human read, not a blind repo-wide substitution, because `_memory.continuity` (a frontmatter field name), `references/memory/*.md` (a reference-doc folder), `scripts/dist/memory/` (the code path), and the generic English word "memory" all needed to survive untouched in the same files that also carried `/memory:save`/`/memory:search`. Mitigation: the five literal patterns used (`/memory:save`, `/memory:search`, the bare colon forms, `/doctor memory`, and the `MEMORY:*` render labels) do not collide with any of those three survivors, verified by a full read of every match before and after.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A Stage B packet renames `scripts/memory/` without also updating the four hook fallback candidates, silently breaking auto-save on session stop | H | `scratch/code-path-followups.md` names `runtime/hooks/claude/session-stop.ts:73-76` explicitly, matching REQ-004 |
| The `command-contract.json` family key stays `"memory"` while every command name it describes reads `/speckit:*`, reading as an inconsistency to a future editor | L | The JSON's own `asset_naming` and `path_templates` metadata now explain why the key stays, pointing at the hard-coded script check that would need to change first |
| A reference doc under `references/memory/` (the folder, not the command) is later assumed to also need a rename under this decision | L | This decision scopes to command names only; the `references/memory/` folder and its file names are out of scope here and untouched |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The spec's own blast-radius evidence showed D7's literal-naming precedent no longer fit the surface it was applied to |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed: keep literal, hard-cutover rename, alias-then-deprecate rename |
| 3 | **Sufficient?** | PASS | Stage A completes every document-level reference; Stage B is scoped and named, not silently deferred |
| 4 | **Fits Goal?** | PASS | Directly answers this phase's stated purpose: capture the operator's naming decision before any rename starts |
| 5 | **Open Horizons?** | PASS | The command-contract.json note and the code-path followups file give Stage B a clean starting point rather than a fresh investigation |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/commands/memory/` removed; `save.md`, `search.md`, `save-presentation.txt`, `search-presentation.txt` moved into `.opencode/commands/speckit/` and `.opencode/commands/speckit/assets/`; `memory/README.txt` merged into `speckit/README.txt`.
- `.opencode/commands/doctor/_routes.yaml`, `doctor-memory.yaml` (renamed `doctor-speckit-retrieval.yaml`), `speckit.md` and `doctor-speckit-presentation.txt` updated so `/doctor memory` becomes `/doctor speckit-retrieval`.
- Every live command-asset, root doc, agent file (plus `.codex`/`.pi` mirrors), and skill `SKILL.md`/reference naming `/memory:save` or `/memory:search` updated to `/speckit:save`/`/speckit:search`.
- `command-contract.json` updated at the path and alias level; its `memory` family key is kept, with a note explaining the hard-coded script dependency that blocks renaming it in this stage.

**How to roll back**: `git revert` the commit(s) covering this phase, or manually restore `.opencode/commands/memory/` from git history and reverse the doctor-route and reference-doc edits. No code path or generated artifact changed, so a rollback here does not touch `scripts/`, `runtime/`, or `shared/`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
