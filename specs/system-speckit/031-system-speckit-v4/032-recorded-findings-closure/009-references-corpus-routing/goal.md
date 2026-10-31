---
title: "Goal: References Corpus Routing"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "references corpus routing goal"
  - "browse only file routing"
  - "leaf manifest byte stability"
  - "resource map completeness"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/009-references-corpus-routing"
    last_updated_at: "2026-09-07T17:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-07-036-009-references-corpus-routing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: References Corpus Routing

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Read each of the 17 browse-only files finding F3-14 named under system-spec-kit's references and assets corpus, then either route it through SKILL.md's intent map or quick-reference.md, or delete it with its leaf-manifest row, so the manifest stays byte-stable and every enumerated leaf is reachable.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The 17-file list is the one computed directly from the current tree (26 RESOURCE_MAP paths plus 2 prose-linked at SKILL.md:428, against the 45-file corpus), not a re-read of the stale F3-14 count |
| D2 | agent-io-contract.md and folder-structure.md are routed, never removed, because CLAUDE.md cites both directly |
| D3 | A file is only removed after a repo-wide grep for its filename confirms no external citation |
| D4 | The manifest is only ever changed through generate-leaf-manifest.cjs --write, never by hand-editing leaf-manifest.json |
| D5 | Child 020's fix to SKILL.md:95's manifest/RESOURCE_MAP coherence claim is not reopened here, since this packet only routes or removes the files themselves |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] All 17 files named by finding F3-14 have a recorded route-or-remove disposition (nineteen were found and dispositioned)
- [x] Every file dispositioned "route" is named in SKILL.md's RESOURCE_MAP or references/workflows/quick-reference.md
- [x] Every file dispositioned "remove" is deleted along with its leaf-manifest.json and leaf-manifest.config.json rows
- [x] generate-leaf-manifest.cjs --check exits 0 against .opencode/skills/system-spec-kit
- [x] The routing-registry-drift workflow's ci-leaf-manifest-freshness.cjs and ci-skill-root-metadata.cjs both pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet opened | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md and this goal.md authored from the F3-14/F3-15 census and the current SKILL.md/corpus tree |
| Every browse-only leaf routed: seven existing intents extended and four new intents added, so all 45 manifest leaves sit under at least one intent; nothing removed | Done | disposition table below; `implementation-summary.md` Verification |
| Gates | Done | leaf routing check 45 of 45; `generate-leaf-manifest.cjs --check` OK; `ci-skill-root-metadata.cjs` 13 of 13; `ci-leaf-manifest-freshness.cjs` 13 fresh; router-contract, leaf-resource and journey tests 3 pass; SKILL.md sk-doc VALID |

### Disposition

Every file was read and every one has live citations inside the skill, several from other skills too, so none is removed. Each is routed under the intent whose work it serves.

| Directory | File | Disposition | Intent |
|-----------|------|-------------|--------|
| workflows | `agent-io-contract.md` | route (cited by `CLAUDE.md` §9) | DISPATCH (new) |
| workflows | `auto-mode-contract.md` | route (cited by eleven command surfaces) | AUTO_MODE (new) |
| workflows | `execution-methods.md` | route | IMPLEMENT |
| workflows | `goal-set-string-playbook.md` | route | HOOKS, which already carries the goal keywords |
| templates | `level-selection-guide.md` | route | PLAN |
| templates | `level-specifications.md` | route | PLAN |
| templates | `template-style-guide.md` | route | TEMPLATE_AUTHORING (new) |
| structure | `folder-structure.md` | route (cited by `CLAUDE.md` §6) | PLAN |
| structure | `folder-routing.md` | route | MEMORY, save-time routing |
| structure | `grep-convention.md` | route | RESEARCH |
| structure | `phase-system.md` | route | PHASE |
| validation | `decision-format.md` | route | COMPLETE |
| validation | `five-checks.md` | route | COMPLETE |
| validation | `path-scoped-rules.md` | route (was reachable only from quick-reference) | IMPLEMENT |
| cli | `daemon-cli-reference.md` | route | CLI_TRANSPORT (new) |
| cli | `memory-handback.md` | route (cited by the cli-* skills) | CLI_TRANSPORT (new) |
| cli | `shared-smart-router.md` | route (cited by the cli-* skills) | CLI_TRANSPORT (new) |
| retrieval | `retrieval-conventions.md` | route (cited across the repository) | RESEARCH |
| assets | `parallel-dispatch-config.md` | route | DISPATCH (new) |

### Deviations and findings

| Item | Note |
|------|------|
| Nineteen files, not seventeen | Recomputing the manifest against the map and quick-reference found eighteen browse-only leaves plus one reachable only from quick-reference; all nineteen are routed so the claim in `SKILL.md` can say every leaf, not a subset |
| Nothing removed | Every file carries citations inside the skill; the two the brief named as repo-root-reachable are cited by `CLAUDE.md` and are routed, as required |
| Four new intents rather than overloading existing ones | Dispatch headers, the `:auto` contract, the cli-* transport docs and template authoring have no existing intent whose keywords would ever select them |
| `SKILL.md` §"Typed leaf projection" reworded | It said the map routes a subset; it now says every manifest leaf sits under an intent, and a new leaf without one is a gap |
<!-- /ANCHOR:log -->
