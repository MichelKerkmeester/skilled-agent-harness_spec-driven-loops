---
title: "Implementation Plan: pi-cache-optimizer OpenRouter session-affinity compat"
description: "Add a provider-level sendSessionAffinityHeaders compat override to the openrouter provider in models.json so pi's merge clears the warning for every catalog model, then sweep stale pi-cache-optimizer stats temp files."
trigger_phrases:
  - "implementation"
  - "openrouter compat"
  - "session affinity plan"
  - "models.json"
  - "tmp sweep"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: pi-cache-optimizer OpenRouter session-affinity compat

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON configuration (pi agent `models.json`) + filesystem cleanup |
| **Framework** | pi coding agent (`@earendil-works/pi-coding-agent`) + `pi-cache-optimizer` extension |
| **Storage** | None — config files only |
| **Testing** | `python3` JSON parse check; Node simulation of pi's `applyModelsJson`/`mergeCompat`; spec-kit `validate.sh --strict` |

### Overview
Add a provider-level `compat` block to the `openrouter` entry in `models.json` (real file: `Code_Environment/Public/.pi/models.json`, symlinked into `~/.pi/agent/`). Pi core merges provider-level compat into every model of the provider (`provider-composer.js` → `applyModelsJson` → `mergeCompat(model.compat, config.compat)`), so one JSON block clears the warning for the reported `z-ai/glm-5.3-flash` and ~200 catalog siblings. Then delete the 44 stale `pi-cache-optimizer-stats.json.*.tmp` files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2–§3)
- [x] Success criteria measurable (spec.md §5 — machine-checkable merged-compat simulation and file counts)
- [x] Dependencies identified (spec.md §6 — OpenRouter header support, git-tracked revert path)

### Definition of Done
- [ ] All acceptance criteria met (tasks.md Phase 3)
- [ ] Tests passing (merged-compat simulation + JSON validity)
- [ ] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Config-only change (no code); verification by direct simulation of pi's merge semantics.

### Key Components
- **`models.json` openrouter provider compat**: single provider-level override block; merge order means it wins over catalog compat without touching `modelOverrides`.
- **`pi-cache-optimizer` warning hook**: consumes merged compat via `describeMissingOpenAICompatibleProxyCompat`; fires only when the flag is `undefined` (an explicit `false` is honored as opt-out).
- **pi-ai `openai-completions` adapter**: reads `compat.sendSessionAffinityHeaders`; `sessionAffinityFormat` auto-detects `"openrouter"` for openrouter.ai base URLs → sends `x-session-id: <sessionId>`.

### Data Flow
pi loads `models.json` → `applyModelsJson` merges provider compat into every catalog model → the openai-completions adapter sees `sendSessionAffinityHeaders === true` → each request carries `x-session-id` → OpenRouter pins the session to one upstream backend → higher prompt-cache hit rate (cacheRead $0.015/M vs $0.075/M input for z-ai/glm-5.3-flash).
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.

### Phase 1: Single-pass config override and sweep

One implementation pass covers both deliverables: the openrouter provider `compat` block lands in `models.json`, the stale `pi-cache-optimizer-stats.json.*.tmp` files are deleted, and every verification task in `tasks.md` Phase 3 runs against the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A — record dependencies beyond the components named in the architecture here.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git checkout` / revert of the single `models.json` edit in the Public repo (git-tracked) restores the prior compat state. Tmp-file deletion is irreversible, but the files carry no unique data — they are abandoned atomic-write fragments of regenerable stats; the canonical `pi-cache-optimizer-stats.json` and `stats.d/` are untouched.
<!-- /ANCHOR:rollback -->

---
