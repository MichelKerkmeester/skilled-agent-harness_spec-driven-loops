---
title: "QA Checklist: Link Card Button & Mobile Animation Fixes"
description: "Level 2 QA validation checklist for the link-card defect fixes, verified live via bdg."
trigger_phrases:
  - "link card collapse expand checklist"
  - "link card qa checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-05-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "All QA items verified live via bdg injection"
    next_safe_action: "Re-verify on published Webflow URL after user deploys 3_staging"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# QA Checklist: Link Card Button & Mobile Animation Fixes

<!-- SPECKIT_LEVEL: 2 -->

> Verified live by injecting the edited CSS/JS into `a-nobel-en-zn.webflow.io/nl/drafts` via `bdg`
> (the published build is still the old code; final re-verify happens post-deploy).

---

## Functional (live bdg evidence)

- [x] **REQ-001** Desktop collapsed `+` centered — `centerOffset = 0` on all collapsed cards (was −2 at root=15px); computed `transform = matrix(1,0,0,1,-28,0)`.
- [x] **REQ-002** Desktop expand — no full-opacity slide; button `opacity` held at 0 (x 231→842 unseen) while the card grows.
- [x] **REQ-002** Desktop expand — arrow fades in **stationary** at top-right (x=847, card full-width 836); final layout matches design.
- [x] **REQ-003** Mobile expand — height ramps `82→101→244→…→331` over ~900ms, no frozen plateau/snap.
- [x] **REQ-003** Mobile collapse — sibling height ramps `331→312→…→82` smoothly in the same gesture.

## Robustness

- [x] **REQ-004** Instant/reduced-motion path sets button `opacity:1` explicitly; collapsed buttons rest at `opacity 1`.
- [x] Fade callbacks guarded by `is_current_run` (stale-run-safe under rapid hover).
- [x] No component JavaScript console errors (only an unrelated Webflow ServiceWorker warning).

## Cleanups (REQ-005)

- [x] `is_current_run` referenced (dissolve guard) — no longer dead code.
- [x] `text_wrappers` array + unused `text_wrapper` SELECTOR removed; heading text-node wrapping retained.
- [x] Dead CSS var `--link-card-mobile-expanded-size` removed.
- [x] Mobile collapsed image scale consistent (`scale(1)` in CSS and JS).

## Sync (REQ-006)

- [x] `3_staging/link_card_collapse_expand.js` byte-identical to `2_javascript/molecules/…` (`diff` clean).
- [x] `3_staging/link_card_collapse_expand.css` byte-identical to `1_css/link/…` (`diff` clean).

## Sign-off

- [x] All P0 (REQ-001..003) verified with recorded evidence (see `implementation-summary.md`).
- [x] `implementation-summary.md` updated; continuity refreshed.
- [ ] Post-deploy re-verification on the published Webflow URL (user action: publish `3_staging`).
