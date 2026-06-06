---
title: "QA Checklist: Link Card Button & Mobile Animation Fixes"
description: "Level 2 QA validation checklist for link-card animation fixes and the iOS WebKit flicker guard."
trigger_phrases:
  - "link card collapse expand checklist"
  - "link card qa checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Revision 5 visual-layer transition suppression verified by local checks and live injection; post-deploy re-verification remains open."
    next_safe_action: "Publish updated link-card CSS/JS assets plus any unpublished global CSS, then re-verify on the published Webflow URL."
    blockers: []
    completion_pct: 95
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# QA Checklist: Link Card Button & Mobile Animation Fixes

<!-- SPECKIT_LEVEL: 2 -->

> Verified live by injecting the edited CSS/JS into `a-nobel-en-zn.webflow.io/nl/drafts` via `bdg`
> (the published build is still the old code; final re-verification happens post-deploy).

---

## Functional (live bdg evidence)

- [x] **REQ-001** Desktop collapsed `+` centered — `centerOffset = 0` on all collapsed cards (was -2 at root=15px); computed `transform = matrix(1,0,0,1,-28,0)`.
- [x] **REQ-002** Desktop button uses seamless slide behavior again — button stays visible and moves continuously from centered collapsed position to top-right with no fade delay.
- [x] **REQ-002** Desktop image transform is Webflow-owned — no inline desktop image transform remains after Revision 2; mobile transform remains explicit.
- [x] **REQ-003** Mobile expand/collapse height animation remains smooth; cleanup clears fixed height only while CSS height transitions are still disabled.
- [x] **REQ-003** Mobile cleanup restores normal CSS transitions only after the state/no-new-animation guards pass.
- [x] **REQ-003** Revision 4 end-frame handoff verified — injected mobile probe held expanded height stable at ~330.84px before and after inline height cleared.
- [x] **REQ-003** Revision 5 visual-layer handoff verified — `data-link-card-mobile-animating` suppresses Motion-overlapped child CSS transitions through the animation/cleanup window, then clears.
- [x] **REQ-007** iOS WebKit whole-section flicker guard verified — overflow-visible sections with `data-render-content` compute to `content-visibility: visible`, `contain: layout style`, and `contain-intrinsic-size: none`.

## Robustness

- [x] **REQ-004** Instant/reduced-motion path sets button `opacity:1` explicitly; collapsed buttons rest at `opacity 1`.
- [x] Mobile height cleanup is guarded by the current animation owner to avoid stale cleanup after rapid toggles.
- [x] No component JavaScript console errors after live injection (only an unrelated Webflow ServiceWorker warning).

## Cleanups (REQ-005)

- [x] Obsolete dissolve-run bookkeeping removed after the desktop button reverted to seamless slide behavior.
- [x] `text_wrappers` array + unused `text_wrapper` SELECTOR removed; heading text-node wrapping retained.
- [x] Dead CSS var `--link-card-mobile-expanded-size` removed.
- [x] Desktop image transform cleared from JS ownership; mobile collapsed image scale remains consistent.
- [x] Webflow performance guide documents the `content-visibility` and overflow-visible section rule.

## Sync (REQ-006)

- [x] `3_staging/link_card_collapse_expand.js` byte-identical to `2_javascript/link_card_collapse_expand.js` (`cmp` exit 0).
- [x] `3_staging/link_card_collapse_expand.css` byte-identical to `1_css/link/…` (`diff` clean).
- [x] Public mirror hardlinks/bytes match for performance CSS, source JS, staging JS, and minified JS.
- [x] Minified asset regenerated after Revision 5; AST and runtime verification both passed **58/58**.

## Sign-off

- [x] All implementation-side P0 items verified with recorded evidence (see `implementation-summary.md`).
- [x] `implementation-summary.md` updated; strict spec validation passed.
- [ ] Post-deploy re-verification on the published Webflow URL (user action: publish updated link-card CSS/JS assets plus any unpublished global CSS).
