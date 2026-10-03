---
title: "Goal: Surface-Reality Conformance"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/013-surface-reality-conformance"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-child-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Surface-Reality Conformance

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the cross-repo drift guard `tools/naming/scan-skill-references.mjs`, which resolves every filename and path citation in the `sk-code-obsidian` packet against the real plugin tree, wire it into the packet's gate runner and `SKILL.md`, repair every citation it finds broken, and prove it cannot report a false pass.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The guard resolves paths, not claims. Checking that prose describes a cited file correctly stays a recorded standing risk. |
| D2 | The sentinel exclusion is scoped to the one constant it documents, not a general allowlist. |
| D3 | No plugin source file, component or stylesheet changes. Edits land only in the guard, its reference doc, `SKILL.md`, `scripts/run-source-gates.sh` and packet citation text. |
| D4 | The guard runs offline and deterministically, with no network or model dispatch. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `tools/naming/scan-skill-references.mjs` and `references/skill-reference-integrity.md` exist, and the guard is named in `SKILL.md` and wired into `scripts/run-source-gates.sh`
- [x] The guard's first run against the post-rename tree reports `broken : 23`, and after 26 substitutions across 14 documents a re-run reports `broken : 0`
- [x] The guard's output reads `counter-example rejected : yes` for its never-existing sentinel path
- [x] A planted dead citation makes the guard return rc 1 with `broken : 1`, and removing it returns rc 0 with `broken : 0`
- [x] `bash scripts/run-source-gates.sh` exits 0 with naming, comments, folder-docs and skill-refs all reporting PASS
- [x] `npx tsc --noEmit` exits 0, `npm run build` exits 0, `npx vitest run` passes 386, `npm run screenshots:verify` reports 180 current and `npm run lint` reports 115 problems (100 errors, 15 warnings)
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
| Guard built, documented, wired; 23 broken citations repaired | Done (2026-08-28) | `tasks.md` T010 to T016 |
| Sentinel, plant-then-remove, gates runner, plugin gate suite | Done | `tasks.md` T020 to T024, CHK-020 to CHK-025 |
| Phase status | Complete | `spec.md` metadata |

### Deviations and findings

| Item | Note |
|------|------|
| Standing risk | A citation can resolve to a real file while describing it wrongly; only reading keeps the prose true |
| Extraction pattern scope | The citation pattern was tuned to this packet's markdown and needs separate verification before use on another packet |
<!-- /ANCHOR:log -->
