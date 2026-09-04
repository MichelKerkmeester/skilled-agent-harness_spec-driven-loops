---
title: "Implementation Plan: sk-code-obsidian hub wiring"
description: "Execution record for wiring OBSIDIAN into mode-registry.json, hub-router.json, and stack-detection.md, refreshing the generated manifest, and proving the change with the hub's own routing CLI and fleet gate."
trigger_phrases:
  - "sk-code-obsidian hub wiring execution"
  - "obsidian surface manifest refresh"
  - "compiled-route obsidian proof"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/003-hub-wiring"
    last_updated_at: "2026-08-28T21:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Wired OBSIDIAN surface into hub"
    next_safe_action: "Author skill references"
    blockers: []
    key_files:
      - "$HUB/.opencode/skills/sk-code/mode-registry.json"
      - "$HUB/.opencode/skills/sk-code/hub-router.json"
      - "$HUB/.opencode/skills/sk-code/shared/references/stack-detection.md"
      - "$HUB/.opencode/skills/sk-code/leaf-manifest.json"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-code-obsidian hub wiring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON (`mode-registry.json`, `hub-router.json`, `leaf-manifest.json`), Markdown with frontmatter (`stack-detection.md`) |
| **Framework** | `sk-code`'s own two-axis hub contract: `mode-registry.json` (mode + surface-axis declarations), `hub-router.json` (router signals, vocabulary classes, tie-break policy), `compiled-route.cjs`/`compiled-route-manifest.cjs` (the compiled router and its manifest lifecycle) |
| **Storage** | `$HUB/.opencode/skills/sk-code/*` (a separate repository, reached from this plugin repo through the root `.opencode` symlink) |
| **Testing** | No unit tests; verification is direct CLI routing proof (`compiled-route.cjs`) plus the fleet metadata gate (`ci-skill-root-metadata.cjs`) |

### Overview
This plan lands the `OBSIDIAN` surface across the hub's four routing-relevant files — the mode
registry, the router signals, the detection reference, and the generated manifest — then proves the
change with the hub's own CLI rather than by inspecting the edited JSON in isolation. The critical
design constraint is the symlink guard: because the plugin repository symlinks `.opencode` (and
`.claude`, `.codex`, `.cursor`, `.devin`) at its root back to the hub, a literal unresolved-path
`.opencode/` detection test would report `OPENCODE` for every task inside the plugin, so the
detection branch must resolve symlinks first and require the resolved real path to land inside the
hub's own `.opencode/` directory.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Live `mode-registry.json` and `hub-router.json` schemas read in full before editing, so the
      new entries match the shape of the hub's 5 existing modes exactly.
- [x] The approved design (`../001-surface-design-plan/mode-design-plan.md`) read as the source for
      the proposed alias set, router signal weight/classes, and detection precedence.
- [x] The measured audit (`../002-repo-convention-audit/audit.json`) read as the source for the
      plugin markers cited in the OBSIDIAN detection branch.

### Definition of Done
- [x] `mode-registry.json` and `hub-router.json` carry the new `sk-code-obsidian` entries, confirmed
      by a live file read after editing.
- [x] `stack-detection.md` carries the rewritten precedence, the OBSIDIAN detection branch, and the
      symlink guard, with its `version:` field bumped 4.1.0.10 -> 4.2.0.0.
- [x] The generated `leaf-manifest.json` is refreshed (`fresh=true`) and the fleet metadata gate
      passes clean (`checked=14 passed=14 failed=0`).
- [x] Four representative plugin prompts route to `sk-code-obsidian`, where the same class of prompt
      returned `defer` before the change, and three regression prompts still route to their original
      surfaces.
- [x] `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` in this folder replaced with
      real content — no scaffold placeholders remain.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Wire-then-prove. Every file edit is followed by a CLI-measured check against the live, compiled
router — never a read of the source JSON alone — because `sk-code` serves routing decisions from a
generated manifest, not from the registry/router source files directly.

### Key Components
- **Mode registry (`mode-registry.json`)**: the sixth `modes[]` entry declaring `sk-code-obsidian`
  as a read-only `surface`-kind packet (`packetKind: surface`, `backendKind: evidence-base`,
  `mutatesWorkspace: false`), plus the `extensions.surface-axis.surfaces` list that names it as one
  of the hub's four bundleable surfaces.
- **Router signals (`hub-router.json`)**: `routerSignals["sk-code-obsidian"]` (weight 4, three
  classes including `hub-identity`), two new `vocabularyClasses` carrying the alias and runtime
  keyword sets, and the mode's slot in `routerPolicy.tieBreak` (surfaces resolve last).
- **Detection reference (`shared/references/stack-detection.md`)**: the human-readable contract the
  router's detection logic implements — the new OBSIDIAN row, the rewritten five-way precedence, the
  numbered detection branch (manifest markers, `esbuild.config.mjs`, `from "obsidian"` imports,
  `.db-*` classes), the symlink guard, and 5 new test-case rows proving the boundary conditions.
- **Manifest lifecycle (`leaf-manifest.json` + `compiled-route-manifest.cjs`)**: the generated file
  the compiled router actually serves from; `refresh` (not `mint`, which no-ops on an existing
  manifest) recomputes it from the edited source files.
- **Proof (`compiled-route.cjs`, `ci-skill-root-metadata.cjs`)**: the two CLIs used to measure the
  change rather than assume it — one for routing correctness, one for fleet-wide manifest hygiene.

### Data Flow
Design plan + measured audit -> edited `mode-registry.json`/`hub-router.json`/`stack-detection.md`
-> `compiled-route-manifest.cjs refresh` regenerates `leaf-manifest.json` -> `compiled-route.cjs`
measures four positive routes and three regression routes against the refreshed manifest ->
`ci-skill-root-metadata.cjs --fix` closes the stale-manifest gate finding -> phase `004-skill-core`
authors packet content against this now-live routing.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase
checkboxes and task state.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | Plugin-flavored prompt routes to `defer` before the change | `compiled-route.cjs --hub sk-code --prompt "..."` |
| Positive routing proof | 4 plugin-flavored prompts (table renderer, screenshot scenario, `.db-*` rename, quality review) all route to `sk-code-obsidian` after the change | `compiled-route.cjs --hub sk-code --prompt "..."` |
| Regression proof | 3 prompts (`app-mobile`, Webflow, `.opencode/skills`) still route to their original surfaces | `compiled-route.cjs --hub sk-code --prompt "..."` |
| Manifest freshness | Manifest `causeCode` transitions `stale-manifest` -> `compiled-serving`, `fresh=true` on refresh | `compiled-route-manifest.cjs status` / `refresh` |
| Fleet metadata gate | 14 checked units, 0 failures, exit 0 | `ci-skill-root-metadata.cjs` (fails first, then `--fix`) |
| Alias disjointness | 0 clashes between the 5 proposed aliases and the hub's 34 existing aliases across 5 other modes | Script-verified read of the live `mode-registry.json` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../001-surface-design-plan/mode-design-plan.md` | Internal (this packet) | Green — already authored | Without it, the alias set, router-signal weight/classes, and detection precedence would be invented rather than landed from the approved design |
| `../002-repo-convention-audit/audit.json` | Internal (this packet) | Green — already measured | Without it, the OBSIDIAN detection branch's plugin markers would be unsourced |
| `compiled-route.cjs`, `compiled-route-manifest.cjs`, `ci-skill-root-metadata.cjs` | External (hub repo) | Green — all three ran successfully during this phase | Without them, the wiring could not be proven live; a source-only JSON read would not catch a stale-manifest regression |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a later phase finds a plugin prompt that still defers, or a regression in one of the
  hub's other four surfaces, after this wiring landed.
- **Procedure**: revert the specific entry in `mode-registry.json` or `hub-router.json`, re-run
  `compiled-route-manifest.cjs refresh`, and re-run the four-prompt and three-regression proof from
  `tasks.md` Phase 3 before re-landing.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Registry + router edits ──► Detection reference rewrite ──► Manifest refresh ──► CLI routing proof ──► Fleet gate
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Registry + router edits | Design plan | Detection reference rewrite |
| Detection reference rewrite | Registry + router edits | Manifest refresh |
| Manifest refresh | Detection reference rewrite | CLI routing proof |
| CLI routing proof | Manifest refresh | Fleet gate |
| Fleet gate | CLI routing proof | Phase 004 (skill-core) |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Registry + router edits | Med | Two JSON files, ~6 new keys across `mode-registry.json`/`hub-router.json` |
| Detection reference rewrite | Med | One markdown file: table row, precedence rewrite, numbered branch, symlink guard, 5 test-case rows |
| Manifest refresh + proof | Med | One refresh command, 8 CLI routing calls, one gate run before and after `--fix` |
| **Total** | | **Single-session** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every routing claim in this record is a captured CLI output, not an inference from the edited
      source files.
- [x] The manifest-refresh trap (`mint` returns `already-exists` and does not update) is recorded so
      a future rollback does not repeat the same wasted cycle.

### Rollback Procedure
1. Identify the specific registry, router, or detection entry that regressed.
2. Revert that entry in place.
3. Re-run `compiled-route-manifest.cjs refresh` and the full proof set in `tasks.md` Phase 3.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — this phase mutates only the four named hub files, the generated
  manifest, and this leaf's own folder.

<!-- /ANCHOR:enhanced-rollback -->
