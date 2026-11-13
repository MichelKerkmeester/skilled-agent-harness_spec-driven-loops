---
title: "Implementation Plan: Phase 2: subtrack-proposal"
description: "Add suggest-subtracks.mjs, a read-only Node CLI that clusters a flat track into a whole-track map and names the best-fitting subtrack for a new packet. Add one advisory line to create.sh and one clause to the spec-folder question. Prove it by feeding the map to the relocate.mjs preflight."
trigger_phrases:
  - "subtrack proposal plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: subtrack-proposal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), bash and markdown |
| **Framework** | None. Plain Node CLI beside the existing `runtime/cli/spec/` scripts |
| **Storage** | None. The tool reads `description.json` and `graph-metadata.json` and writes nothing |
| **Testing** | vitest, run with `npm test` in `.skilled/skills/system-spec-kit/runtime/cli` |

### Overview
This phase adds `suggest-subtracks.mjs` in `.skilled/skills/system-spec-kit/runtime/cli/spec/`. It then wires three prompts to it: the `create.sh` stderr hint, the spec-folder question wording and the structure docs. Proof is a map from a real flat track that passes the `relocate.mjs` preflight, with an unchanged `git status`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure that the baseline run did not have
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only proposal CLI

### Key Components
- **`suggest-subtracks.mjs`** (new file): reads a track, clusters its packets and prints a map or a fit. Extending `create.sh` in place fails, because the retroactive proposal runs when no packet is being created and `create.sh` has no entry point for that.
- **`create.sh` `list_recent_track_packets`** (extended in place): prints one more stderr line.
- **`spec-gate-core.mjs`** (extended in place): three strings gain one clause.
- **Docs and assets** (extended in place): `AGENTS.md`, two presentation assets, `folder-structure.md`, `phase-definitions.md`, `SKILL.md` and `quick-reference.md`.

### Data Flow
The tool reads each live packet's `description.json` keywords and `graph-metadata.json` `trigger_phrases` and `key_topics`. Packets that share terms form a cluster, and the shared terms give the candidate subtrack name. Retroactive mode prints one `from` and `to` pair per live packet. Present mode scores one description against the existing subtracks and prints the best fit or none.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes shared prompt wording, so the surfaces are listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Producer: exports `GATE_3_CHOICE_RELATED`, `GATE_3_QUESTION` and `GATE_3_MUTATION_NOTICE` | update | `rg -c -i "subtrack\|sub-track" runtime/hooks/lib/spec-gate/spec-gate-core.mjs` prints 3 or more |
| Tests and hooks that pin those strings | Consumer: assert or relay the wording | update each pinned copy | `rg -l "GATE_3_QUESTION\|GATE_3_CHOICE_RELATED" .skilled` lists them |
| `AGENTS.md` Gate 3 option C | Docs: the human-readable copy of the option | update | `rg -c -i "sub-track\|subtrack" AGENTS.md` prints 1 or more |
| `runtime/cli/spec/create.sh` `list_recent_track_packets` | Producer: stderr hint before numbering | update | `create.sh --json` stdout still parses with `node -e` |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` line 71 | Docs: same option C wording | unchanged, open question | `rg -n "series parent" .skilled/commands/speckit/assets/speckit-implement.yaml` prints line 71 |

Required inventories:
- Same-class producers: `rg -n "series parent" .skilled AGENTS.md --glob '!**/node_modules/**'`.
- Consumers of changed symbols: `rg -n "GATE_3_QUESTION|GATE_3_CHOICE_RELATED|GATE_3_MUTATION_NOTICE" . --glob '*.ts' --glob '*.js' --glob '*.mjs' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: mode (retroactive, present), track shape (flat, grouped, missing), size (below, at, above the threshold).
- Algorithm invariant: a retroactive map names every live packet of the track exactly once, so applying it can never leave the track mixed.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup picks a real flat track with more than eight packets and inventories the pinned gate strings. Implementation builds `suggest-subtracks.mjs` and edits `create.sh`, `spec-gate-core.mjs`, the assets and the docs. Verification feeds the emitted map to `relocate.mjs --map` and checks that `git status` is unchanged.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Clustering, threshold and present-time fit in `suggest-subtracks.mjs`. Phase 005 writes the suite | vitest |
| Integration | Suites that pin the spec gate wording and `create.sh` output stay green | vitest |
| Manual | `suggest-subtracks.mjs --track <real flat track>` piped to `relocate.mjs --map` | `node`, `git status --porcelain` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runtime/cli/spec/relocate.mjs` from phase 001 | Internal | Yellow | The map cannot be checked against preflight |
| `runtime/cli/lib/track-roots.mjs` `readWorkingTreeTracks` and `trackLayout` | Internal | Green | The tool would need its own track reader |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `create.sh --json` stdout stops parsing, or a suite that pins the spec gate wording fails.
- **Procedure**: Revert the commit that carries this phase. The tool is read-only, so no data needs restoring.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001-relocation-engine | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 003-subtrack-archive-and-numbering |
<!-- /ANCHOR:phase-deps -->

---
