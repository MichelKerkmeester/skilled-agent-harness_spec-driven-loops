---
title: "Implementation Plan: Slider JS Refactor & Variant Split"
description: "Plan for genericising the testimonial slider and splitting it into two named variants with scoped collision constants."
trigger_phrases:
  - "slider refactor plan"
  - "slider_testimonial plan"
  - "slider_timeline plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/003-slider-refactor"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All steps completed"
    next_safe_action: "Update Webflow Designer data attributes"
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/carousel/slider_testimonial.js"
      - "a_nobel_en_zn/2_javascript/carousel/slider_timeline.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-anobel.com/003-slider-refactor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Slider JS Refactor & Variant Split

<!-- SPECKIT_LEVEL: 1 -->

---

## Steps Executed

| # | Step | Status |
|---|------|--------|
| 1 | Analyse `testimonial.js` — code quality, architecture, findings | ✅ Done |
| 2 | Generic rebrand — replace all `testimonial`-prefixed identifiers | ✅ Done |
| 3 | Rename file to `slider_testimonial.js` in both repos | ✅ Done |
| 4 | Scope variant constants (`STYLE_ID`, `DECORATED_FLAG`, `INIT_FLAG`) | ✅ Done |
| 5 | Create `slider_timeline.js` — duplicate minus image colour state | ✅ Done |
| 6 | Minify both variants via `minify-webflow.mjs --force` | ✅ Done |
| 7 | Verify both via `verify-minification.mjs` | ✅ Done |
| 8 | Runtime test both via `test-minified-runtime.mjs` | ✅ Done |
| 9 | Delete stale `testimonial.min.js` and `slider.min.js` | ✅ Done |

## Technical Context

Both source repos are MEGA-synced:
- **Canonical source**: `Code_Environment/Public/a_nobel_en_zn/2_javascript/carousel/`
- **Mirror**: `anobel.com/src/2_javascript/carousel/`

Changes applied to the canonical source propagate to the mirror automatically. Minification is run from the anobel.com project root using the sk-code webflow scripts.
