---
title: "Implementation Summary: memory decommission landing"
description: "The memory-database decommission is landed and pushed on skilled/v4.0.0.0 and main, the READMEs describe continuity instead of a memory store, the git hooks and engine no longer serve the removed index, and a ten-iteration review with gpt-5.6-luna found ten defects that are fixed at source; a second pass and the runtime rename are still running, so this summary is in progress."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/052-memory-decommission-landing"
    last_updated_at: "2026-09-04T17:48:43Z"
    last_updated_by: "claude-code"
    recent_action: "Closed the landing after the rename review passed clean"
    next_safe_action: "Nothing pending; the packet is closed"
    blockers: []
    key_files:
      - "specs/system-speckit/052-memory-decommission-landing/goal.md"
      - "specs/system-speckit/052-memory-decommission-landing/review/lineages/luna-max/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-052-memory-decommission-landing"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 052-memory-decommission-landing |
| **Completed** | In progress; see the goal log for the open items |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The memory database is gone from the branches people actually use. `skilled/v4.0.0.0` and `main` now carry the decommission from packet 049, pushed to origin, with no memory server in any runtime config, no spec-memory hook, plugin or launcher on disk, and the residue sweep at zero live records. Along the way the landing removed three kinds of leftover the decommission had missed and closed a CI regression the landing itself caused.

### The landing

Two merges from the branch side resolved 41 conflicts between the memory removal and the command-contract work on v4: command frontmatter keeps v4's contract-shaped hints with the memory tools out of every allow list, the twelve engine files v4 had edited stay deleted, and 049's generated metadata was regenerated from the merged documents. Both branches then fast-forwarded and every gate ran on the landed tree: 049 recursive, doctor routes, the skill-root audit, derived freshness, command references, catalog and agent mirrors, and the compiled-routing guard after four hubs were re-minted.

### Residue the decommission had missed

The git hooks were still appending drift markers for the deleted index on every commit; the engine still carried the module that read them and a search-weight config nothing ranked with; READMEs from the root down still framed a cognitive-memory layer, a memory framework, store-era feature flags and token-budget tiers; the plugin guides still advertised the retired kill switch. All of it is removed or reframed, checked by the sk-doc validators for each document class.

### The review loop and the CI regression

A ten-iteration review with gpt-5.6-luna at max reasoning on a 438-file scope found ten defects: a hidden-directory gap in the ripgrep lane, a malformed-limit parser, a model-server token that gated the bind but not the request, a doctor route pointing at artifacts that did not exist, a codex example contradicting its own rule, a forced-depth check that counted files instead of checking the set, a symlink escape in write containment, and three P2s in the skill advisor and plugin docs. Seven are fixed at source with named commits; two P2s inside the preserved advisor are handed to its owner. The Routing Registry Drift Guard workflow failed from the first landing push because the spec-kit skill's hand-curated vocabulary still said memory and a metadata refresh reset the age haircut that had muted it; curating the vocabulary restored the save-command routing and improved two golden counts, so the scorer baseline was recaptured and CI is green again.

### Retired at the operator's request

The zvec semantic lane, its vendored fork under `system-plugins`, packets 050 and 051 and the pi package entry left the tree in one commit; the trigger index regenerated deterministically for the removed documents.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/**`, `AGENTS.md`, `.gitignore` | Modified | Merge resolutions toward v4's contract with memory tools removed |
| `.opencode/scripts/git-hooks/**`, `.opencode/skills/system-spec-kit/mcp-server/**` | Modified, Deleted | Drift-marker hooks and dead engine modules removed |
| `README.md` and nine skill, script and runtime READMEs | Modified | Continuity and retrieval framing |
| `.opencode/skills/system-spec-kit/scripts/retrieval/**`, `references/retrieval/retrieval-conventions.md` | Modified | Hidden-directory and `.git` handling, limit parsing, wrapper parity |
| `.opencode/bin/hf-model-server.cjs`, `shared/embeddings/providers/hf-local.ts` | Modified | Bearer token at the request boundary; model identity in the availability probe |
| `.opencode/skills/system-deep-loop/runtime/**` | Modified | Contiguous iteration set for forced depth; canonicalized containment |
| `.opencode/skills/system-spec-kit/graph-metadata.json`, advisor `scorer-eval-baseline.json` | Modified | Continuity vocabulary and the recaptured baseline |
| `.opencode/skills/system-plugins/**`, zvec lane, packets 050 and 051 | Deleted | Retired |
| `review/lineages/luna-max/**` | Created | Pass-one lineage, report and registry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The landing was merged from the branch side so the release branch only ever fast-forwarded. Agent lanes handled the README reframing, the hook and engine residue, the containment fix and the runtime rename, each verified on disk against its own report before anything was committed. Review findings were fixed as they arrived, with tests and live probes, and pushed under the operator's standing go-ahead; the two gates that fired on push were answered on their merits, once by authorizing the intended engine deletion and once by re-minting from a clean checkout of HEAD.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Merge from the branch side, fast-forward the release branch | The release branch is never rewritten, and the operator's concurrent commits on it merge in rather than collide |
| Fix a security P1 inside the preserved set | Leaving the model server's unchecked token would have kept a real hole open to satisfy a scope rule written to prevent accidental churn, not to protect a defect |
| Curate the advisor vocabulary instead of muting the ratchet | The regression was stale vocabulary scoring at full strength, and the ratchet's improvement path is to recapture, not to loosen |
| Retire the zvec lane in one commit | The operator asked for it; a partial removal would have left a doctor route, a config and a catalog row pointing at nothing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Residue sweep on main | live 0 over 3,176 paths |
| Trigger index, two runs | identical hashes after every regeneration |
| `validate.sh --strict` 049 recursive, 052, 053 | PASSED |
| Doctor routes, command references, catalog mirror, agent mirrors, skill-root audit, derived freshness, routing guard | all green on the landed tree |
| Review pass one | ten iterations, CONDITIONAL, 0 P0, 5 P1, 5 P2; every P1 fixed with a named commit |
| Drift Guard workflow | green on origin at `a9ab17ea3f` after the vocabulary fix |
| Review pass two | ten iterations, CONDITIONAL, 4 P1 and 5 P2; every P1 fixed with a named commit |
| Runtime rename | packet 053 complete: `system-spec-kit/runtime`, three dependencies, no MCP identity in live docs or code |
| Review pass three on the renamed tree | attempt 3 CONDITIONAL with 2 P1 fixed; attempt 4 PASS, 0 P0, 0 P1, 2 P2 fixed |
| Final gates at `85d9791eb3` | sweep live 0; trigger index identical twice; 049 recursive, 052, 053 PASSED; doctor routes, both audits, routing guard, dist freshness green; no codex, zg or model-server process |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Debt handed to owners, not fixed here.** The dist freshness table counts retrieval fixtures as scripts sources; the fan-out runner keeps no lineage stderr and its review leaf also writes iteration files at the cwd; the rollback runbook documents retired automation; each is recorded in the goal log with an owner.
2. **Two P2s in the skill advisor are handed off, not fixed.** The doc-frontmatter fence parser and the shared-payload vocabulary are in the preserved set and below the blocking bar.
3. **Three validator class defects are recorded, not fixed.** Playbook folder READMEs, compiled deep-loop contracts and the install-scripts README fail their class checks identically at the pre-landing commit.
4. **The retired database is gone from this machine.** Deleted on the operator's explicit yes after the closure; 26 GB including its backup copy, vectors and logs.
<!-- /ANCHOR:limitations -->

---
