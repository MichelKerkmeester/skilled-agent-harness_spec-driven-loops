---
title: "Implementation Plan: Presentation Asset Format — .md to .txt [template:examples/level_1/plan.md]"
description: "Plan to rename command presentation assets to .txt and update all references and generators."
trigger_phrases:
  - "presentation asset format plan"
  - "command txt rename plan"
  - "presentation extension plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/002-command-presentation-workflow-separation/007-presentation-asset-format"
    last_updated_at: "2026-06-12T13:30:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Renamed assets and updated references"
    next_safe_action: "Validate and scoped-commit"
---
# Implementation Plan: Presentation Asset Format — .md to .txt

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command routers + plain-text presentation assets |
| **Framework** | OpenCode/Claude slash-command loader (`.md` discovery) |
| **Storage** | `.opencode/commands/<family>/` |
| **Testing** | grep gates (zero residual `.md`), slash-command list inspection |

### Overview
Rename the 24 presentation assets to `.txt` so the loader no longer registers them, then update router references, asset self-references, and the sk-doc generator templates. Behavior-preserving: no display content or routing changes.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Discovery mechanism confirmed (loader keys on `.md`; `.yaml` assets never registered).
- [x] Full reference scope mapped (routers, self-refs, generators).

### Definition of Done
- [x] Zero `*_presentation.md` under command assets.
- [x] Zero `.md` presentation references in the command tree.
- [x] Generators emit `.txt`.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Co-located non-`.md` presentation contract beside each thin router, mirroring the `.yaml` workflow-asset precedent that already avoids slash-command registration.

### Key Components
- **Router `.md`**: resolves routing, reads the presentation contract by path.
- **`_presentation.txt`**: the display source of truth (renamed from `.md`).
- **sk-doc templates**: generate future commands with `.txt` references.

### Data Flow
The loader scans `.opencode/commands/**/*.md`; `.txt` assets are skipped, so only true routers register while their display contracts remain readable.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the loader registers `assets/*.md` and skips non-`.md`.
- [x] Enumerate the 24 assets and all references.

### Phase 2: Core Implementation
- [x] `git mv` the 24 assets `.md` → `.txt`.
- [x] Rewrite router references and the three doctor asset self-references.
- [x] Update sk-doc generator templates.

### Phase 3: Verification
- [x] Zero-residual grep for `_presentation.md`.
- [x] Confirm no code path loads the assets by `.md` path.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | No residual `.md` references | `grep -r "_presentation.md" .opencode/commands` returns nothing |
| Static | No orphaned asset `.md` | `find .opencode/commands -path "*/assets/*_presentation.md"` empty |
| Manual | Slash-command list no longer shows presentation entries | Inspect the runtime command list |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Loader skips non-`.md` in command dirs | Internal | Green | If it scanned `.txt` too, the rename would not help |
| sk-doc command templates | Internal | Green | New commands would re-introduce `.md` assets |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A router cannot resolve its `.txt` contract, or `.txt` assets unexpectedly register as commands.
- **Procedure**: `git mv` the assets back to `.md` and revert the reference rewrite; the change is a single scoped commit.

<!-- /ANCHOR:rollback -->
