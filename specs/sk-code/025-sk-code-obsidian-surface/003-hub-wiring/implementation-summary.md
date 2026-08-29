---
title: "Implementation Summary: sk-code-obsidian hub wiring"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "sk-code-obsidian hub wiring"
  - "obsidian surface routing live"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/003-hub-wiring"
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
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-hub-wiring |
| **Completed** | 2026-08-28 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Before this phase, a prompt naming work inside the Obsidian plugin repository had nowhere to land
in the `sk-code` hub — `compiled-route.cjs` returned `{"action":"defer","targets":[]}` for a prompt
that named the plugin's table renderer by file path. This phase wired a fifth surface, `OBSIDIAN`,
into the four live files that govern hub routing, so that class of prompt now bundles
`sk-code-obsidian` deterministically, and confirmed with a script-verified alias check and a live
CLI proof — not a read of the edited JSON alone — that nothing else in the hub regressed.

### The OBSIDIAN Surface

`mode-registry.json` gained a sixth `modes[]` entry, `sk-code-obsidian`: a read-only `surface`-kind
packet (`packetKind: surface`, `backendKind: evidence-base`, `mutatesWorkspace: false`, tool surface
limited to `Read, Bash, Grep, Glob`) with 5 aliases, and `extensions.surface-axis.surfaces` grew
from 3 entries to 4. `hub-router.json` gained the matching `routerSignals["sk-code-obsidian"]`
(weight 4, three signal classes including `hub-identity`), two new vocabulary classes
(`code-obsidian-aliases`, `code-obsidian-runtime`), and a slot in `routerPolicy.tieBreak`.

### The Symlink Guard

The subtle part of this phase: the plugin repository symlinks `.opencode`, `.claude`, `.codex`,
`.cursor`, and `.devin` at its root back to the hub. A detection test that simply asked "is there a
`.opencode/` segment at or above this path" would have reported `OPENCODE` for every single task
run inside the plugin repository, defeating the entire point of adding `OBSIDIAN`. The fix, written
into `stack-detection.md`, resolves symlinks first: `OPENCODE` holds only when the **resolved** real
path lands inside the hub's own `.opencode/` directory. A genuine hub file still wins `OPENCODE`;
plugin source reached through the symlink does not. The guard changes how the test is performed, not
which surface wins.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `$HUB/.opencode/skills/sk-code/mode-registry.json` | Modified | Sixth `modes[]` entry for `sk-code-obsidian`; `extensions.surface-axis.surfaces` extended to 4 entries |
| `$HUB/.opencode/skills/sk-code/hub-router.json` | Modified | New `routerSignals["sk-code-obsidian"]`, two `code-obsidian-*` vocabulary classes, `routerPolicy.tieBreak` slot |
| `$HUB/.opencode/skills/sk-code/shared/references/stack-detection.md` | Modified | New OBSIDIAN row, rewritten 5-way precedence, numbered detection branch, the symlink guard, 5 new test-case rows, `version:` 4.1.0.10 -> 4.2.0.0 |
| `$HUB/.opencode/skills/sk-code/leaf-manifest.json` | Regenerated | Generated file, refreshed via `compiled-route-manifest.cjs refresh` to serve the edited routing |
| `spec.md`, `plan.md`, `tasks.md` | Replaced scaffold | This leaf's spec-kit record of the above |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verification was CLI-driven end to end, not a read of the edited JSON in isolation. A negative
control was captured before any edit: `compiled-route.cjs --hub sk-code --prompt "fix the table
renderer in the obsidian note database plugin src/views"` returned `{"action":"defer","targets":
[]}`. After the registry and router edits landed, the generated manifest was refreshed — discovering
along the way that `mint` returns `already-exists` and performs no update against an existing
manifest, and that `refresh` is the correct verb — and the manifest's status transitioned from
`causeCode: stale-manifest` (policy hash `eeae98f8…` vs. current `834a0e38…`) to `causeCode:
compiled-serving` (fingerprint `82764d6d…`), with `refresh` reporting `fresh=true`. The same
negative-control prompt plus three others (a screenshot-scenario request, a `.db-*` class rename, a
code-quality review) then all resolved to `sk-code-obsidian`. Three regression prompts — one
`app-mobile`-flavored, one Webflow-flavored, one naming `.opencode/skills` — were routed
unchanged, confirming `sk-code-mobile-cli`, `sk-code-webflow`, and `sk-code-opencode` still resolve
correctly. Finally, `ci-skill-root-metadata.cjs` was run to failure first (`STALE_GENERATED_FILE:
leaf-manifest.json is stale`), then re-run with `--fix` to a clean `checked=14 passed=14 failed=0`,
exit code 0.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve symlinks before testing for `.opencode/` rather than testing the literal path | The plugin repo's root-level symlinks back to the hub would otherwise make every plugin-repo task detect as `OPENCODE`; resolving first and requiring the real path to land inside the hub's own `.opencode/` directory keeps genuine hub files and plugin source correctly separated |
| Verify alias disjointness by script against the live registry before landing the new aliases | A manual eyeball check across 34 existing aliases risks a silent clash that steals another mode's routing; a script-verified check against the actual file is the only reliable way to guarantee 0 clashes |
| Prove the change with `compiled-route.cjs` against the refreshed manifest, not by reading the edited source JSON | `sk-code` serves routing from a generated manifest, not the source files directly; a source-only check would pass locally while the live router kept deferring on a stale manifest |
| Use `refresh`, not `mint`, once `mint` returned `already-exists` with no update | `mint` is for creating a new manifest; treating its no-op success as a passing refresh would have shipped a phase that looked done but was still serving stale routing |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control (`compiled-route.cjs`, pre-change) | PASS — `{"action":"defer","targets":[]}` |
| Alias disjointness (script vs. live `mode-registry.json`) | PASS — 34 existing aliases across 5 modes, 0 clashes with the 5 proposed |
| 4 positive-routing prompts (post-change, post-refresh) | PASS — all 4 resolve to `sk-code-obsidian` |
| 3 regression prompts (`app-mobile`, Webflow, `.opencode/skills`) | PASS — resolve to `sk-code-mobile-cli`, `sk-code-webflow`, `sk-code-opencode` respectively |
| Manifest refresh (`compiled-route-manifest.cjs refresh`) | PASS — `fresh=true`; `causeCode` `stale-manifest` -> `compiled-serving`, fingerprint `82764d6d…` |
| Fleet metadata gate (`ci-skill-root-metadata.cjs`) | PASS after `--fix` — `checked=14 passed=14 failed=0`, exit code 0 (failed first with `STALE_GENERATED_FILE`) |
| Hub-side diff scope | PASS — exactly 5 modified files plus the new untracked packet directory |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`sk-code-obsidian` still carries no packet content.** `SKILL.md` and `README.md` under
   `$HUB/.opencode/skills/sk-code/sk-code-obsidian/` do not exist yet — this phase wired routing
   only. Phase `004-skill-core` authors them next, against the routing this phase made live.
2. **The 5th modified file in the measured hub diff count is not individually itemized here.** The
   measured proof states the hub diff is exactly 5 modified files plus the new untracked packet
   directory; 4 are named explicitly above (`mode-registry.json`, `hub-router.json`,
   `stack-detection.md`, `leaf-manifest.json`) as the files this phase edited or regenerated. The
   fifth is captured in that measured count but was not individually named in the evidence handed to
   this record — treat it as confirmed by count, not itemized by path.
3. **The manifest `mint`-vs-`refresh` trap is recorded, not fixed.** `mint` returning `already-exists`
   with no update on an existing manifest is a real CLI surprise that cost a cycle during this phase;
   no change was made to the CLI itself, only to this record, so a future operator who reaches for
   `mint` first will hit the same trap unless they read this document.

<!-- /ANCHOR:limitations -->
