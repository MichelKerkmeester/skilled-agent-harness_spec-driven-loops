---
title: "Goal: sk-code-obsidian hub wiring"
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
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/003-hub-wiring"
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
# Goal: sk-code-obsidian hub wiring

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Wire the `OBSIDIAN` surface into `mode-registry.json`, `hub-router.json`, `shared/references/stack-detection.md` and the generated `leaf-manifest.json` so a plugin prompt bundles `sk-code-obsidian` deterministically without regressing the hub's other surfaces.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase authors no `sk-code-obsidian/` content and changes no plugin source. Phase `004-skill-core` and later leaves own the packet content. |
| D2 | `OPENCODE` holds only when the resolved real path, with symlinks followed, lands inside the hub's own `.opencode/` directory. A literal unresolved path test is not used. |
| D3 | Routing is proven through `compiled-route.cjs` against the refreshed manifest, not by reading the edited source JSON. |
| D4 | An existing manifest is updated with `compiled-route-manifest.cjs refresh`; `mint` returns `already-exists` and is not treated as a refresh. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `mode-registry.json` carries a sixth `modes[]` entry `sk-code-obsidian` with `packetKind: surface`, `backendKind: evidence-base`, `allowed: [Read, Bash, Grep, Glob]`, `mutatesWorkspace: false` and 5 aliases that clash with none of the 34 existing aliases, and `extensions.surface-axis.surfaces` has 4 entries
- [x] `hub-router.json` carries `routerSignals["sk-code-obsidian"]`, the `code-obsidian-aliases` and `code-obsidian-runtime` vocabulary classes, and `sk-code-obsidian` as the last `routerPolicy.tieBreak` entry
- [x] `stack-detection.md` states `OPENCODE > OBSIDIAN > PI_REMOTE > WEBFLOW > UNKNOWN`, carries the resolved-path symlink guard and reads `version: 4.2.0.0`
- [x] `compiled-route.cjs --hub sk-code --prompt "fix the table renderer in the obsidian note database plugin src/views"` returned `{"action":"defer","targets":[]}` before the change, and it and three other plugin prompts route to `sk-code-obsidian` after it
- [x] An `app-mobile` prompt, a Webflow prompt and an `.opencode/skills` prompt still route to `sk-code-mobile-cli`, `sk-code-webflow` and `sk-code-opencode`
- [x] `compiled-route-manifest.cjs refresh` returns `fresh=true` and the manifest status reads `causeCode: compiled-serving`
- [x] `ci-skill-root-metadata.cjs` exits 0 with `checked=14 passed=14 failed=0` after the refresh
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
| Registry, router, detection and manifest edits | Done (2026-08-28) | `tasks.md` T010 to T015 |
| Negative control, 4 positive routes, 3 regression routes, manifest and fleet gate | Done | `tasks.md` T020 to T024; `implementation-summary.md` Verification |
| Phase status | Complete | `spec.md` metadata |

### Deviations and findings

| Item | Note |
|------|------|
| Fifth modified hub file | The measured hub diff is 5 modified files; `implementation-summary.md` names only 4 and treats the fifth as confirmed by count |
| `mint` versus `refresh` trap | Recorded in this phase's documents, not fixed in the CLI |
<!-- /ANCHOR:log -->
