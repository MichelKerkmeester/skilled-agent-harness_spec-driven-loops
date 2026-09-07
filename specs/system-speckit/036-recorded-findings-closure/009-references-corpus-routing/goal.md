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
    packet_pointer: "system-speckit/036-recorded-findings-closure/009-references-corpus-routing"
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

- [ ] All 17 files named by finding F3-14 have a recorded route-or-remove disposition
- [ ] Every file dispositioned "route" is named in SKILL.md's RESOURCE_MAP or references/workflows/quick-reference.md
- [ ] Every file dispositioned "remove" is deleted along with its leaf-manifest.json and leaf-manifest.config.json rows
- [ ] generate-leaf-manifest.cjs --check exits 0 against .opencode/skills/system-spec-kit
- [ ] The routing-registry-drift workflow's ci-leaf-manifest-freshness.cjs and ci-skill-root-metadata.cjs both pass
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

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
