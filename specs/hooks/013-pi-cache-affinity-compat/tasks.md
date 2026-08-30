---
title: "Tasks: pi-cache-optimizer OpenRouter session-affinity compat"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "openrouter compat tasks"
  - "tmp sweep tasks"
  - "session affinity tasks"
importance_tier: "important"
contextType: "general"
---
# Tasks: pi-cache-optimizer OpenRouter session-affinity compat

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Verified pi core merge semantics: `provider-composer.js` `applyModelsJson` merges provider-level `config.compat` into every catalog model via `mergeCompat(model.compat, config.compat)` (override wins); exported entry `composeModelProvider` runs the same path eagerly (`provider-composer.js`)
- [x] T002 Inventoried affected surface: ~200 OpenRouter catalog models in `~/.pi/agent/models-store.json` lack the flag in their compat blocks; 44 stale `pi-cache-optimizer-stats.json.*.tmp` files (~41 KB total, oldest 2026-07-28, newest ~19h old, 0 modified within 10 min — no active writer)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Added `compat: {"sendSessionAffinityHeaders": true}` to `providers["openrouter"]` in `models.json` (`Code_Environment/Public/.pi/models.json`, symlink target of `~/.pi/agent/models.json`); existing `modelOverrides["~deepseek/deepseek-v4-flash-latest"]` untouched
- [x] T004 Swept stale stats temp files: `find ~/.pi/agent -name 'pi-cache-optimizer-stats.json.*.tmp' -delete`; canonical `pi-cache-optimizer-stats.json` and `stats.d/` untouched
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `python3` JSON parse of the edited `models.json` exits 0 (REQ-002; embedded in the Node verification driver's `JSON.parse` step, exit 0)
- [x] T006 Node driver `/tmp/verify-openrouter-compat.mjs` imports pi's real `composeModelProvider` (`dist/core/provider-composer.js`), merges the edited provider config over the actual `z-ai/glm-5.3-flash` catalog entry (catalog compat confirmed to lack the flag), and asserts `merged compat.sendSessionAffinityHeaders === true`; warning condition (flag `undefined`) can no longer fire; deepseek override regression-checked (REQ-001, SC-001). Output: ALL CHECKS PASSED, exit 0
- [x] T007 Post-sweep count: `find ~/.pi/agent -name 'pi-cache-optimizer-stats.json.*.tmp' | wc -l` → 0 (REQ-003)
- [x] T008 `validate.sh <spec-folder> --strict` exit 0 and packet docs reconciled (REQ-004; see implementation-summary.md verification table)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (Node merge simulation + file counts + strict validation)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
