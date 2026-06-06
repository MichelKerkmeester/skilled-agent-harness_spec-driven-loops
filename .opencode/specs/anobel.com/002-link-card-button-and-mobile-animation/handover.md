---
title: "Session Handover: Link Card Collapse/Expand — Mobile Cleanup, iOS Flicker, Publish"
description: "Full handover for the link_card_collapse_expand work through Revision 5: desktop/mobile animation fixes, iOS WebKit section flicker guard, visual-layer flicker hardening, minification, verification, repo topology, bdg method, and the outstanding publish/re-test action."
trigger_phrases:
  - "link card handover"
  - "link card collapse expand handover"
  - "sector menu card session handover"
  - "link_card_collapse_expand"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "anobel.com/002-link-card-button-and-mobile-animation"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Revision 5 mobile visual-layer transition suppression applied; source/staging/minified verified; injected mobile probe confirmed suppression through cleanup."
    next_safe_action: "User publishes updated link-card CSS/JS staging/minified assets plus any unpublished global CSS; then re-tests on real iOS Chrome/Safari."
    blockers: []
    key_files:
      - "a_nobel_en_zn/2_javascript/link_card_collapse_expand.js  (FLAT — moved molecules/ -> link/ -> root)"
      - "a_nobel_en_zn/1_css/link/link_card_collapse_expand.css"
      - "a_nobel_en_zn/2_javascript/z_minified/link_card_collapse_expand.min.js  (FLAT)"
      - "a_nobel_en_zn/3_staging/link_card_collapse_expand.js"
      - "a_nobel_en_zn/3_staging/link_card_collapse_expand.css"
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Desktop button: seamless SLIDE (Rev 1 reverted the dissolve); centering kept."
      - "Description color: Webflow default gray (removed mobile white override on paragraph)."
      - "Content padding: already correct on all breakpoints; not touched by this component."
      - "Revision 4: defer WAAPI cancel and height cleanup across animation frames to remove mobile end-frame flicker."
      - "Revision 5: suppress CSS transitions on Motion-owned mobile child layers while the card is animating."
---
# Session Handover Document

Seamless continuation context for the `link_card_collapse_expand` component work.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

> **Status: implementation verified** — code is verified locally and via Chrome DevTools (`bdg`) injection.
> The outstanding item is a **user action**: publish the latest files to Webflow/CDN and re-test on real iOS (see §3).

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-05-30 → 2026-06-06 (continued revisions, Claude/OpenCode)
- **To Session:** next session (continuation / post-publish verification)
- **Phase Completed:** IMPLEMENTATION + VERIFICATION through Revision 5
- **Handover Time:** 2026-06-06
- **Component:** sector-menu link card (`[data-link-card]` / `[data-link-expand]`) on `a-nobel-en-zn.webflow.io/nl/drafts`
- **Net result:** original link-card bugs fixed, desktop button final behavior is seamless slide, description color is Webflow-owned, desktop image transform is Webflow-owned, iOS section flicker is guarded, mobile height cleanup is frame-staged, mobile visual-layer CSS transitions are suppressed during Motion-owned animation, and publish assets are regenerated/verified. Content-padding concern investigated → no change needed (already correct).
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:repo-topology -->
## 1.5 Repo Topology (READ THIS FIRST — non-obvious)

There are **two repos that share the same files** (hardlinked tree — same inodes), so an edit in one appears in the other instantly:

| Logical role | anobel.com working dir | Public repo |
|---|---|---|
| JS source (canonical) | `src/2_javascript/link_card_collapse_expand.js` | `a_nobel_en_zn/2_javascript/link_card_collapse_expand.js` |
| CSS source (canonical) | `src/1_css/link/link_card_collapse_expand.css` | `a_nobel_en_zn/1_css/link/link_card_collapse_expand.css` |
| Minified JS | `src/2_javascript/z_minified/link_card_collapse_expand.min.js` | `.../2_javascript/z_minified/link_card_collapse_expand.min.js` |
| Staging mirror | `src/3_staging/link_card_collapse_expand.{js,css}` | `a_nobel_en_zn/3_staging/link_card_collapse_expand.{js,css}` |

- Full Public root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/a_nobel_en_zn/`
- anobel.com root: `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/`
- `anobel.com/.opencode` is a symlink → `Public/.opencode` (skills, specs).
- **Edited in:** the anobel.com `src/` view and shared Public paths. Because of shared inodes, edits reflect in both repos automatically (verified: same inode for JS source and minified JS).
- **The minify pipeline expects `src/2_javascript`** (the `src/`-prefixed layout) → run it from the `anobel.com` working dir.
- **The live Webflow staging site serves PUBLISHED code.** Local edits do NOT appear live until the user re-publishes in Webflow. This is the crux of the outstanding action.
<!-- /ANCHOR:repo-topology -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
| --- | --- | --- |
| Bug 3 fix = remove `!important` from `set_mobile_fixed_height` | `!important` author declarations outrank the Web-Animations layer in the CSS cascade, so the `wrapper.animate()` height keyframes never painted (card froze ~1.1s then snapped). Normal inline lets WAAPI drive the tween. | `…js` `set_mobile_fixed_height` (~line 1017); mobile height now animates smoothly |
| Bug 1 fix = right-anchored `calc(50% - 2rem)` centering | The button is **exactly 4rem**; the old `calc(50% - 28px)` assumed a fixed 56px (only correct at 14px root). `2rem` = half of 4rem → centers at any root AND interpolates smoothly to the expanded `right: 1.5rem` (needed for the slide). | `apply_collapsed_button` desktop branch (~line 681) |
| Bug 2 = **seamless slide** (Rev 1 reverted an earlier dissolve) | First attempt was an opacity "dissolve" (no positional travel). User disliked the delay/gap. Reverted to the original continuous slide that they liked. | CSS button `transition` (incl. `inset`/`transform` 320ms); `animate_card_state` applies button directly |
| Description color = Webflow default gray (remove override) | User wants the description (paragraph) to use Webflow's defined grayish (`rgb(207,207,207)`), not forced white. Removed `[data-hover="paragraph"]` from the mobile-expanded white rule. Desktop already used the default. | CSS mobile expanded color rule (~line 473) |
| Content padding = **no change** | Investigated: the expanded content padding lives on Webflow's `.card--content.is--card-expandable` and already matches the spec on all breakpoints. This component never set content padding. | none |
| Minify via single-file terser (not batch) | The batch `minify-webflow.mjs` can touch more files than this scoped fix. Single-file terser is scoped to just this component. | `.../z_minified/link_card_collapse_expand.min.js` |
| Revision 4 mobile cleanup | WebKit can show a one-frame mismatch if a filled WAAPI height animation is canceled and inline height is cleared in the same frame. Defer cancel, clear, and transition restore across frames. | `finish_mobile_height_animation` |
| Revision 5 visual cleanup | The remaining MP4 flicker was localized layer churn. Suppress CSS transitions on Motion-owned children while the mobile card is animating. | `data-link-card-mobile-animating` + CSS child-layer rule |
| Spec docs are packet-local truth | Memory MCP was unavailable, but strict spec validation now passes after manual reconciliation. | packet `002` |

### 2.2 Blockers Encountered

| Blocker | Status | Resolution/Workaround |
| --- | --- | --- |
| Synthetic `mouseover` does not trigger desktop hover-expand | resolved | The hover-intent guard checks real `:hover`; use `focusin` (immediate activation path) or real CDP `Input.dispatchMouseEvent` mouse moves |
| Dissolve fade-out reverted to full opacity mid-grow | resolved (then mooted) | Motion.dev does NOT persist an animation's end value — pin inline opacity in `onComplete`. (Moot now: dissolve was reverted to the slide in Rev 1.) |
| Injected CSS not overriding old published rules | resolved | Append the injected `<style>` to `document.body` (after Webflow's body-level embeds) so it wins source order |
| Cannot prove "removed" CSS rule via injection | resolved | The old published CSS lingers alongside the injected copy, so an *absent* rule can't un-set it. Verified the real outcome via a proxy (e.g. collapsed-card paragraph color = Webflow base) |
| Spec-memory MCP unavailable | open (environmental) | Packet docs written + reconciled manually; strict `validate.sh --strict` passed |

### 2.3 Files Modified (this session)

| File | Change Summary | Status |
| --- | --- | --- |
| `.../2_javascript/link_card_collapse_expand.js` | Original bugs, Rev 1 slide/color behavior, Rev 2 desktop image transform ownership, Rev 4 mobile cleanup, Rev 5 animating-state lifecycle | complete |
| `.../1_css/link/link_card_collapse_expand.css` | Button slide transition, paragraph color ownership, dead var removal, mobile image scale alignment, Rev 5 child-layer transition suppression | complete |
| `.../1_css/global/performance.css` | Overflow-visible `data-render-content` fail-safe for iOS/WebKit paint skipping | complete |
| `.../2_javascript/z_minified/link_card_collapse_expand.min.js` | Re-minified publish bundle (terser `--compress --mangle`) | complete |
| `…/3_staging/link_card_collapse_expand.js` | Mirror of canonical JS | complete (byte-identical) |
| `…/3_staging/link_card_collapse_expand.css` | Mirror of canonical CSS | complete (byte-identical) |
| packet `002/*.md` + `*.json` | spec/plan/tasks/checklist/implementation-summary/handover reconciled through Revision 5 | complete |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:chronology -->
## 2.6 Full Chronology (what happened, in order)

1. **Staging server started** — `npm run dev` (`node src/3_staging/server.js`, port 3000) running in background; serves raw JS/CSS from `anobel.com/src/3_staging/` (NOT a full HTML page — the component needs the Webflow page to run).
2. **Analyzed the 4 files** the user pointed to. Found the `3_staging/*` copies are byte-identical synced duplicates of the canonical source. Flagged: dead `is_current_run`, write-only `text_wrappers`, dead CSS var `--link-card-mobile-expanded-size`, mobile image `scale(1.04)` vs JS `scale(1)`.
3. **3 bugs reported + plan mode (max effort).** Diagnosed all three live with `bdg`:
   - Bug 1 (collapsed `+` off-center): button 60px@root15 / 56px@root14 = **4rem**; `calc(50% - 28px)` only centers a 56px button → −2px off at root≠14.
   - Bug 2 (button travels): right-anchored to a card whose right edge sweeps ~770px during the 1000ms grow.
   - Bug 3 (mobile glitch): height frozen at 82px ~1.1s then snapped to 331px (the `!important` vs WAAPI cascade defeat).
   - Asked 2 questions → user chose "dissolve to top-right" + "fix bugs + cleanups". Plan approved.
4. **Gate 3** → created Level-2 spec packet `anobel.com/002-link-card-button-and-mobile-animation` (manual).
5. **Implemented** Bug 3 + Bug 1 + Bug 2 (as a dissolve) + cleanups; verified each via `bdg` injection; synced staging.
6. **Minified** per sk-code WEBFLOW: terser → AST verify (`verify-minification.mjs`) → runtime test (`test-minified-runtime.mjs`) → browser-confirmed the minified bundle.
7. **User deployed** to the live Webflow staging site (confirmed live ran my code).
8. **User feedback (Revision 1):** disliked the dissolve's delay → "go back to the seamless slide + fine-tune"; description text color altered → "use the Webflow grayish".
9. **Revision 1 applied:** reverted dissolve → slide (kept centering via `calc(50% - 2rem)`); removed the mobile paragraph white override. Verified via `bdg` (slide is continuous opacity 1; Webflow base paragraph = gray). Re-minified + re-verified. Synced staging. Updated spec docs.
10. **Content-padding question:** user said desktop expanded padding "seems wrong, should be 2rem" + asked if I touched it. Investigated → I did NOT touch padding; verified live that `.card--content.is--card-expandable` already = **2rem desktop / 1.5rem mobile / 1.5rem + 1.25rem bottom portrait** (exactly the spec). No code change.
11. **User renamed** the combo class `.is--card-collapse-expand` → `.is--card-expandable` (already reflected in the CSS file + live).
12. **Revision 2 — desktop image transform:** user asked to "remove the image scale effect on desktop." Confirmed via `bdg` the desktop image was already `scale(1)`/`none` (even under real hover). Per the user's choice, `set_image_state` now omits `transform` from the desktop image_target and clears any inline transform so Webflow owns the desktop image transform; mobile keeps `scale(1)`. Re-minified (55,694 B → 18,401 B); AST + runtime PASS; staging synced.
13. **Repo-wide flatten (separate task, no spec folder):** ungrouped ALL `.js` in `2_javascript/` to the root (58 active sources), dropped the stray `navigation/nav_notifications.min.js`, kept `form/z_archive/` archived, regenerated `z_minified/` flat (58 `.min.js`, no subfolders). `link_card` source is now `2_javascript/link_card_collapse_expand.js`. AST 58/58 + runtime 58/58 PASS. This tree is under MEGA cloud-sync, so re-verify structure before relying on it.
14. **Revision 3:** added `performance.css` overflow-visible fail-safe for `data-render-content`, hardened mobile cleanup to keep transitions disabled during height clearing, updated Webflow performance guidance, re-minified and verified.
15. **Revision 4:** user still saw a tiny mobile expand-end flicker on latest assets. `finish_mobile_height_animation()` now frame-stages final height paint, WAAPI cancel, inline height clear, and transition restore. Injected mobile probe showed stable expanded height through cleanup.
16. **Revision 5:** the next MP4 still showed localized end-frame visual churn. A fresh sub-agent agreed this looked like visual-layer handoff, not wrapper height or content-visibility. Added `data-link-card-mobile-animating` before prepass state flips and CSS transition suppression for Motion-owned mobile child layers. Injected mobile probe confirmed transitions stayed `none / 0s` through the animation window and restored after cleanup.
<!-- /ANCHOR:chronology -->

---

<!-- ANCHOR:technical-knowledge -->
## 2.7 Critical Technical Knowledge (so the next agent doesn't re-derive it)

- **CSS cascade order (high→low):** transitions > `!important` author > **animations (WAAPI / `element.animate`)** > normal author > … . This is WHY an `!important` inline height froze the WAAPI height animation (Bug 3), and why an injected `<style>` had to win by source order.
- **The action button is exactly `4rem` wide.** Center it right-anchored with `calc(50% - 2rem)`. Do NOT switch to `left:50% + translateX(-50%)` — that was the dissolve-era centering and it breaks the smooth slide because `inset`/`transform` can't interpolate cleanly between a left-anchored and right-anchored state.
- **Desktop button = slide, opacity always 1.** Expanded `inset: 1.5rem 1.5rem auto auto`; collapsed `inset: 1.5rem calc(50% - 2rem) auto auto` + `transform: none`. CSS transitions `inset`/`transform` 320ms; the button also rides the growing card edge for the full ~1000ms grow (intentional — the user likes this).
- **Mobile expand/collapse height** is driven by `wrapper.animate()` (WAAPI) over ~1.1s while a separate Motion timeline cross-fades content. `set_mobile_fixed_height` must use NORMAL inline (no `!important`). At finish, do not cancel the filled WAAPI layer and clear inline height in the same frame; Rev 4 intentionally stages those operations across animation frames. Rev 5 additionally keeps CSS transitions disabled on Motion-owned child layers while the card is animating.
- **Motion.dev (`window.Motion`) does NOT persist** an animation's end value by default — it reverts to the underlying inline style on finish. Pin inline styles in `onComplete` if you ever re-introduce a multi-step Motion sequence. (Currently not needed.)
- **Description vs caption vs heading:** `[data-hover="paragraph"]` = the description sentence (e.g. "Beroepsvaart op zee en binnenwateren"); `[data-hover="caption"]` = the "SECTOR" eyebrow; `[data-hover="heading"]` = the title. Webflow base paragraph color = `rgb(207,207,207)`. On mobile expanded, heading + caption stay white for legibility over the dark image; paragraph uses the gray default.
- **Content padding is Webflow's, on `.card--content.is--card-expandable`** — desktop 2rem, mobile 1.5rem, portrait (<480) 1.5rem with 1.25rem bottom. This component never sets it. If it ever looks wrong, check Webflow Designer larger-breakpoint overrides (1280/1440/1920).
- **`bdg` verification method** (Chrome DevTools CLI, v0.6.10): `bdg <url>` → `bdg cdp Emulation.setDeviceMetricsOverride --params '{…}'` → inject via `bdg dom eval "(function(){ window.__linkCardCollapseExpandCleanup(); /* inject <style> to document.body */ (0,eval)(atob(b64)); })()"` → sample with `setInterval` + read back → `bdg stop`. Trigger desktop expand with `focusin` (not synthetic mouseover). Base64 the files to avoid shell-quoting hell.
- **Injection-test artifacts to expect:** (a) the OLD published CSS stays in the page next to your injected copy, so a rule you *removed* still applies in the test — verify "absence" via a proxy element/state; (b) append injected `<style>` to `document.body` so it wins source order; (c) a lingering CSS transition can hold an inline value at its pre-transition state until your CSS wins.
<!-- /ANCHOR:technical-knowledge -->

---

<!-- ANCHOR:verification-evidence -->
## 2.8 Verification Evidence (live `bdg`, latest code)

- **Desktop centering:** all collapsed cards `centerOffset = [0,0,0,0]`.
- **Desktop button slide:** `opacity = 1` throughout; `x` glides `149 → 847` continuously as the card grows (no dissolve gap). Seamless.
- **Mobile height:** expand ramps `82 → 101 → 244 → … → 331` over ~900ms; sibling collapses `331 → … → 82`; no frozen plateau, no snap. Both directions.
- **Description color:** Webflow base paragraph color on mobile = `rgb(207,207,207)` (proven via a collapsed card, which no white rule targets) → after deploy the mobile expanded paragraph is gray, matching desktop.
- **Content padding (live):** desktop `2rem` (28px @ 14px root); mobile/landscape `1.5rem`; portrait `1.5rem` sides + `1.25rem` bottom. Matches spec exactly.
- **Mobile end-frame cleanup (Rev 4):** injected minified bundle under a 390px mobile viewport; expanded height stayed stable at approximately `330.84px` before cleanup, while inline height cleared, and after CSS transitions restored.
- **Mobile visual-layer cleanup (Rev 5):** injected CSS + minified bundle under a 390px mobile viewport; `data-link-card-mobile-animating` was present during animation, child-layer transitions computed `none / 0s`, then the attribute cleared after cleanup with stable height.
- **Minified:** AST verify PASS (suite 58/58); runtime test PASS (suite 58/58); minified bundle browser-confirmed for the Rev 5 mobile visual-layer cleanup handoff.
<!-- /ANCHOR:verification-evidence -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point
- **First, confirm the deploy.** The live `/nl/drafts` may not yet include Revision 5 until the user publishes the updated assets. The next session's job usually begins by confirming publish, then re-verifying on the live URL.
- **Files to anchor on:** `implementation-summary.md` (full record incl. Revision 5) and this `handover.md`. Code entry point: `2_javascript/link_card_collapse_expand.js` → `set_mobile_animating`, `finish_mobile_height_animation`, `animate_card_state`, and `apply_collapsed_button`; CSS button block and mobile animating rule in `1_css/link/link_card_collapse_expand.css`.

### 3.2 Priority Tasks Remaining
1. **[USER ACTION] Publish** the latest `3_staging/link_card_collapse_expand.{js,css}` and `2_javascript/z_minified/link_card_collapse_expand.min.js` (plus global `performance.css` if not already published) to Webflow/CDN.
2. **Re-verify on the published URL** (no injection needed once live): collapsed centering approx `0`; button slides with opacity 1; mobile height ramps smoothly with no end-frame flicker; mobile description gray; content padding 2 / 1.5 / 1.5+1.25.
3. **(Optional, only if asked)** Tune the slide timing — the `inset`/`transform` `320ms cubic-bezier(0.16,1,0.3,1)` in the CSS button-transition block is the single lever.
4. **(Optional)** If the user still reports padding wrong at a specific desktop width, inspect Webflow Designer breakpoint overrides on `.card--content` / `.is--card-expandable` (this is a Designer setting, not this file).

### 3.3 Critical Context to Load
- [ ] `handover.md` (this file) — start here.
- [ ] `implementation-summary.md` — Revision 5 section + verification evidence.
- [ ] `spec.md` — §3 root causes, §5 requirements (REQ-001/002/003/007), §6 success criteria.
- [ ] Repo topology (§1.5 above) — the shared-inode two-repo setup + the "live = published only" rule.
- [ ] sk-code WEBFLOW minify pipeline: `.opencode/skills/sk-code/references/webflow/deployment/minification_guide.md` + scripts under `assets/webflow/scripts/`.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:pitfalls -->
## 3.5 Pitfalls / Do-NOT list

- **Do NOT** re-introduce `translateX(-50%)` centering for the button — it breaks the slide. Use `calc(50% - 2rem)` right-anchor.
- **Do NOT** run the batch `minify-webflow.mjs` for scoped work unless you intend to refresh more than this component. Use single-file terser: `npx terser src/2_javascript/link_card_collapse_expand.js --compress --mangle -o src/2_javascript/z_minified/link_card_collapse_expand.min.js`.
- **Do NOT** hand-edit `z_minified/manifest.tsv` — it's a mixed-format file; a future batch run reconciles it.
- **Do NOT** add content-padding rules to this component CSS — padding is Webflow-owned and already correct; duplicating it would fight the Designer values the user asked to use.
- **Do NOT** trust an injection test that relies on a *removed* CSS rule — the old published CSS lingers; verify absence via a proxy.
- **Comment hygiene [HARD BLOCK]:** no spec paths or ADR/REQ/CHK/task IDs in code comments — durable WHY only.
<!-- /ANCHOR:pitfalls -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] All in-progress work saved (no mid-implementation breakage; JS `node --check` clean).
- [x] Continuity saved via `_memory.continuity` in `implementation-summary.md` + this handover.
- [x] No breaking changes left mid-implementation.
- [x] Verification done (live `bdg` injection for behavior; AST + runtime for minified; strict spec validation passed). NOTE: spec-memory MCP unavailable.
- [x] Staging mirror byte-identical to canonical source.
- [x] This handover document is complete.
- [ ] **User re-publish to Webflow** (the one open action — user's, not the agent's).
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

- The work reopened multiple times after "completion": minification, Revision 1 (button revert + color), Revision 2 (desktop image transform), Revision 3 (iOS section flicker), Revision 4 (mobile height cleanup), and Revision 5 (mobile visual-layer flicker). Expect the user to iterate on feel; the code is structured so button behavior and mobile cleanup are localized.
- The earlier `dissolve` approach is fully removed — if anyone reads old chat scrollback referencing `dissolve_button`, `button_out`/`button_in`, or `is_current_run`, those no longer exist in the code.
- `graph-metadata.json` `status` has been flipped to `in_progress` by an external indexer more than once even after I set `complete`; it re-derives from docs. Not worth fighting — the authoritative completion state is in `implementation-summary.md` + this handover.
- Local dev server (`npm run dev`, port 3000) may still be running in the background from the start of the session; it only serves raw JS/CSS files, so it is not a substitute for the Webflow page when verifying the component.
<!-- /ANCHOR:session-notes -->
