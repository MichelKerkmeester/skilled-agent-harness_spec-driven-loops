# Pi Remote Claude Restyle Plan Verification

## Verdict

**NEEDS-REWORK.** The direction is credible, and the plan correctly protects several critical product invariants, but it is not safe to hand directly to implementation. There are no architectural blockers, but there are **nine major issues** that must be resolved first: the token inventory is incomplete, several light and dark color roles are under-specified or noncompliant, the state/surface contract is incomplete, the proposed phase boundary is not isolated, the theme bootstrap is too late, the font supply chain is not deterministic, the proof plan can miss residue, and the service-worker rollback is not executable.

This review is based on the actual Claude bundle, current PWA source, and five-phase implementation plan. Contrast values were independently recomputed from the stated hex colors with the WCAG 2 relative-luminance formula via `sk-design-interface/scripts/contrast_check.py`; they were not copied from `restyle-plan.md`.

## What is already sound

- The two-layer primitive/semantic-token model is appropriate for Tailwind 4 and for preserving a Claude-like light theme while deriving a product-specific dark theme.
- The plan correctly keeps Carbon as the strong action/focus color and treats Clay as selection/identity decoration rather than the default CTA.
- Redaction and content-free notification requirements are explicitly preserved.
- The 44px target, visible focus, reduced-motion, keyboard, and VoiceOver requirements are explicitly present.
- The named component paths line up with components the five-phase plan intends to create; React Aria `data-*` state selectors are idiomatic.
- The light semantic colors for success, warning, and danger have adequate text contrast on their paired soft backgrounds.

## Findings

### R-01 — Major — The token migration is not complete and its typography roles conflict

**What is wrong.** The plan says it maps the current app token surface, but its mapping table covers colors, shadows, and radii only (`restyle-plan.md:113-145`). The current stylesheet also defines fifteen in-use layout, spacing, and motion tokens that the plan never mentions:

`--content-width`, `--reading-width`, `--page-gutter`, `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-6`, `--space-8`, `--space-12`, `--space-16`, `--duration-fast`, `--duration-state`, `--ease-out`, and `--ease-out-interface` (`style.css:3-9`, `style.css:45-62`).

The primitive example promises spacing primitives (`restyle-plan.md:26-29`) but does not define them (`restyle-plan.md:31-62`). It also defines `--text-body: 14px` while the role table specifies 15px compact body and 16px assistant prose (`restyle-plan.md:46-50`, `restyle-plan.md:220-225`). No semantic line-height or weight tokens resolve that collision. Finally, the plan renames Claude's `--font-anthropic-serif` and `--font-anthropic-sans` primitives to generic `--font-serif` and `--font-sans`; that can be a valid Tailwind adaptation, but it is not the claimed exact primitive copy and it overwrites an existing application token without a declared alias boundary.

**Concrete fix.** Add an exhaustive old-token-to-new-token table generated from the current `:root` and `@theme` definitions. Each row must say `replace`, `preserve`, or `delete`, with its semantic role and light/dark value. Define the missing spacing, width, duration, easing, font-weight, and line-height tokens. Separate source primitives (for example, `--font-anthropic-*`) from application semantic aliases, and define distinct type roles such as `--text-ui`, `--text-body`, and `--text-prose` so the CSS and role table cannot disagree.

### R-02 — Major — The light-theme role contract permits inaccessible text and controls

**What is wrong.** The raw Claude colors are faithful, but some cannot serve the semantic roles the prose assigns them. The plan says Ashen may be used for “nonessential supporting text” (`restyle-plan.md:123-127`). Importance is not a WCAG exception: ordinary-size supporting text still needs 4.5:1. Ashen fails on all three planned light surfaces. Pebble fails even the 3:1 large-text/non-text threshold on all three. Raw Clay fails 4.5:1 everywhere and reaches 3:1 only on Paper White. The mapped `--line-strong: #b4b0a7` is only 1.83–2.16:1 against the three surfaces, so it cannot be the sole visible boundary for a control. Fog Gray is only 1.24–1.46:1.

The prose contains safer alternatives (`#6c6a65` for body-safe tertiary text and `#8a452f` for accent text), but it does not turn those constraints into enforceable semantic tokens or selector rules.

**Concrete fix.** Replace the permissive role prose with an allowed-use matrix:

- `--ink-tertiary-safe: #6c6a65` for any normal-size supporting text.
- Raw Ashen only for large text at 3:1+, inactive controls, or nonessential decoration; never ordinary body copy.
- Pebble and Fog only for decorative detail or disabled/inactive presentation, never information-bearing text or the only control boundary.
- `--accent-ink: #8a452f` for all light-theme Clay-family text.
- A separate control-boundary/focus token that reaches 3:1 on every surface where it is used; Carbon remains the focus-ring token.

Add lintable selector examples for metadata, placeholders, disabled labels, input outlines, selected rows, and focus rings.

### R-03 — Major — The derived dark palette has an unhandled non-text contrast failure

**What is wrong.** The dark text hierarchy is generally valid, but `--line-strong` / disabled Ashen `#777168` is only **2.80:1** on `--surface-muted: #302e2a`. That fails the 3:1 non-text threshold when the line is the only visible control boundary. The plan reports the 3.28:1 value on `#24221f` (`restyle-plan.md:338-340`) but does not test the same token on every surface where a control may appear. Raw dark Clay is also only **4.34:1** on muted surface, so it must not be used for ordinary-size text there, although it remains above 3:1 for large text or non-text UI.

**Concrete fix.** Add a separate dark boundary token of at least `#807a70` for muted surfaces; it measures 3.18:1 on `#302e2a`. Keep `#777168` restricted to genuinely inactive decoration. Require `--accent-ink-dark: #f0b19a` for accent-family text and reserve raw `#d97757` for non-text selection marks or sufficiently large text. Test every semantic foreground against every surface on which the component matrix permits it.

### R-04 — Major — Per-surface styling is named, but the interaction-state contract is incomplete

**What is wrong.** The plan names all major page families, but `restyle-plan.md:246-325` supplies treatments rather than the state matrix its own proof plan promises (`restyle-plan.md:418-419`). Several implementation-relevant surfaces remain implicit:

- transcript turn actions: Copy, Retry, Edit, menu-open, unavailable, and pending states;
- model/effort/command sheets: initial loading, empty/no-results, catalog failure, stale catalog, reconnect, selected item disappearing after a model change, dismissal, focus return, and scroll locking;
- empty transcript capability runway and quick actions from Phase 2;
- runtime strip checking, unavailable, stale, and error states;
- composer queued/sending, immutable pending submission, rejected, delivery-unknown, offline, reconnecting, and retry transitions;
- push permission denied, subscription failure, loading, success, and unsupported states;
- top-bar reconnecting/offline status and compact mobile theme-control labeling;
- review grant banner and inline barrier/error alerts;
- enrollment scan failure, validation error, busy, and recovery states.

Generic “empty/loading/offline/stale/error” prose does not resolve state precedence. For example, it does not say what wins when a selected row becomes disabled, when stale and offline coexist, or when a sheet loses its selected option.

**Concrete fix.** Add a per-component interaction matrix with: state, triggering event, transition, forbidden action, visual treatment, recovery action, accessible name/announcement, focus behavior, and reduced-motion behavior. Include the missing surfaces above and explicit compound-state precedence. Tie every matrix row to a Phase 2–4 acceptance check.

### R-05 — Major — The proposed foundation track is not actually isolated from the five phases

**What is wrong.** Inserting fonts, primitives, and semantic aliases after Phase 1 and before Phase 2 is directionally sensible (`restyle-plan.md:393-407`), but replacing global semantic aliases immediately restyles every existing Phase 1 surface, including the legacy transcript and composer that Phase 1 explicitly leaves intact (`implementation-phases.md:115-121`). It also restyles home/review/enrollment surfaces before Phase 4 owns their final polish. That contradicts the claim that the foundation is an isolated, reversible change set and weakens phase-by-phase regression attribution. Phase 4 still says it uses the “existing OKLCH tokens” (`implementation-phases.md:478`), which conflicts with the new hex-based Claude semantic layer.

**Concrete fix.** Choose and document one integration strategy:

1. **Opt-in migration:** add Claude primitives first, keep legacy semantic aliases stable, and migrate component selectors behind a root class/feature flag in the phase that owns each surface; or
2. **Explicit global restyle:** make the foundation track a formal phase covering every currently rendered surface, with screenshots and acceptance checks before Phase 2 starts.

In either case, update `implementation-phases.md` so the track has an owner, entry/exit gate, rollback, and consistent token language in Phases 2–4. Do not leave it as an unnumbered side plan.

### R-06 — Major — `main.tsx` cannot guarantee a pre-paint theme

**What is wrong.** The plan assigns persisted-theme application to `src/main.tsx` “before React renders” (`restyle-plan.md:369-371`). That is before React render but not reliably before first paint: `index.html` starts as `data-theme="system"`, loads the stylesheet, and only then executes the module at the end of the body (`index.html:2`, `index.html:6`, `index.html:15`). A stored explicit dark or light preference can therefore flash the wrong theme. The current React effect is later still (`App.tsx:91-109`).

**Concrete fix.** Put a tiny, synchronous bootstrap in `<head>` before the stylesheet/module path. It must validate the stored value against `light | dark | system`, resolve `matchMedia`, set `document.documentElement.dataset.theme`, and update `theme-color`. Keep the long-lived media-query listener in application code. If a CSP is introduced, authorize the bootstrap with a nonce or pinned hash rather than relaxing policy. Add tests for explicit light, explicit dark, system changes, corrupt storage, storage denial, and no wrong-theme first paint.

### R-07 — Major — The offline font strategy is license-aware but not supply-chain complete

**What is wrong.** The plan correctly forbids external font requests and conditionally excludes Anthropic fonts without rights (`restyle-plan.md:196-213`). However, it never chooses a single substitute family, release, exact WOFF2 files, weights/styles, hashes, or `@font-face` descriptors. It lists Inter and IBM Plex as alternatives while giving only example Inter paths. It also keeps `"Anthropic Sans"` first in the fallback stack even when that font is not bundled, which makes rendering vary on machines that happen to have it locally.

Source Serif, Inter, and IBM Plex are viable self-host candidates under their official OFL 1.1 distributions, but the implementation must carry the actual license and provenance, not merely name the license: [Source Serif](https://github.com/adobe-fonts/source-serif), [Inter license](https://github.com/rsms/inter/blob/master/LICENSE.txt), [IBM Plex license](https://github.com/IBM/plex/blob/master/LICENSE.txt).

**Concrete fix.** Select one committed pair for the fallback build, for example Source Serif 4 + Inter. Record upstream release/commit, exact filenames, SHA-256 hashes, subset/renaming decision, required weights/styles, and copy the corresponding OFL/copyright file. Define complete `@font-face` blocks (`font-family`, `src`, `format`, `font-style`, correct static or variable `font-weight`, and `font-display`). Preload only above-the-fold files with matching `type` and `crossorigin`, use only bundled families in the primary stack, and enumerate those exact files in the service-worker cache. Treat an Anthropic-font build as a separate rights-approved asset manifest.

### R-08 — Major — The final proof plan can report a clean restyle while old visual literals remain

**What is wrong.** The residue check looks only for `#4b68df`, `#6f8bff`, `#f4f5f7`, and external font hosts (`restyle-plan.md:416-417`). The current assets also contain `#151924` and multiple raw `white`/OKLCH colors, including code/diff colors in `style.css:1470-1506` and the old icon background in `public/icon.svg:2`. Those can survive the proposed scan. The contrast gate lists selected example pairs, not the actual selector-to-surface combinations created by components in both themes.

**Concrete fix.** Replace the three-value grep with an allowlist-based color audit across CSS, TSX inline styles, SVG, manifest, and HTML. Permit literals only in declared primitive/semantic blocks or explicitly approved assets; fail on every other hex, RGB/HSL/OKLCH literal and on all remote font/asset URLs. Generate a selector/component foreground-background inventory for light and dark and run every permitted text/control pair through the contrast checker. Retain the build, test, keyboard, VoiceOver, service-worker, and 390×844 screenshot checks.

### R-09 — Major — The rollback is not executable across the service-worker cache boundary

**What is wrong.** The plan says to restore prior style/font/PWA/theme files if the foundation fails (`restyle-plan.md:406-408`), but the service worker installs a versioned cache and deletes older caches during activation (`public/service-worker.js:5`, `public/service-worker.js:17-21`). Once a client activates the new worker and the new release removes or renames font assets, reverting source files alone is not an atomic rollback. Existing clients, installed PWAs, and caches can temporarily speak different asset contracts.

**Concrete fix.** Specify a forward-and-backward-compatible cache migration: unique versioned font filenames, release-specific cache names, coexistence of assets for at least one worker generation, activation behavior, and the exact rollback cache/version. Verify upgrade and downgrade from an installed previous release, first-load online, repeat-load offline, and cold app launch after the worker has activated.

### R-10 — Minor — The Claude fidelity claim does not distinguish source fidelity from product-density adaptation

**What is wrong.** The target Claude guidance uses 32px card padding as a characteristic primitive, while the restyle plan assigns 24px to primary cards and 16px to nested content (`restyle-plan.md:231-238`). That may be the correct mobile-product adaptation, but the plan simultaneously describes the primitives as an exact copy. Without an explicit adaptation record, a later implementer cannot tell whether 24px is deliberate or drift.

**Concrete fix.** Add a short deviation ledger separating exact source tokens from Pi Remote adaptations. Record 24px mobile card padding, denser controls, dark-theme derivation, operational semantic colors, and Carbon focus treatment as deliberate adaptations, with viewport rationale and acceptance screenshots.

### R-11 — Minor — `App.tsx` changes are described too loosely for a React Aria accessibility-sensitive migration

**What is wrong.** “Add semantic class/state hooks” (`restyle-plan.md:366-368`) does not state which existing React Aria semantics must remain authoritative. Adding parallel local state or native-only selectors could desynchronize visual and spoken state.

**Concrete fix.** State that visual selectors must consume React Aria's existing `data-hovered`, `data-pressed`, `data-focus-visible`, `data-selected`, `data-disabled`, and validation semantics. Add classes only for stable component roles, not duplicate interaction state. Require accessible-name, focus-return, selected-state, and disabled-state assertions for every modified React Aria component.

## Independent contrast audit

Thresholds used: **4.5:1** for ordinary text; **3:1** for large text and information-bearing non-text UI. `PASS-LARGE` below means the pair is not valid for ordinary body text.

### Light theme: text and Clay against every requested surface

| Foreground | Bone Parchment `#f7f5f2` | Paper White `#ffffff` | Soft Stone `#eeece8` | Allowed role |
|---|---:|---:|---:|---|
| Carbon Ink `#121212` | 17.22 PASS | 18.73 PASS | 15.88 PASS | Body, heading, control |
| Graphite `#373734` | 10.97 PASS | 11.94 PASS | 10.12 PASS | Body, metadata, control |
| Ashen `#7b7974` | 4.00 PASS-LARGE | 4.35 PASS-LARGE | 3.69 PASS-LARGE | Large text only; not body |
| Pebble `#9c9a92` | 2.59 FAIL | 2.82 FAIL | 2.39 FAIL | Decorative/inactive only |
| Clay `#d97757` | 2.87 FAIL | 3.12 PASS-LARGE | 2.65 FAIL | Paper non-text/large only; otherwise decorative |
| Body-safe tertiary `#6c6a65` | 4.96 PASS | 5.40 PASS | 4.58 PASS | Body-safe supporting text |
| Clay text `#8a452f` | 6.49 PASS | 7.06 PASS | 5.99 PASS | Accent-family text |

Additional light-boundary results:

| Boundary | Bone | Paper | Soft Stone | Result |
|---|---:|---:|---:|---|
| Stone Gray `#b4b0a7` | 1.99 | 2.16 | 1.83 | FAIL as sole control boundary |
| Fog Gray `#d8d5cf` | 1.35 | 1.46 | 1.24 | Decorative separator only |

Therefore the ratios quoted by the plan for its selected examples are directionally correct, but its usage prose is not strict enough to prevent failing combinations.

### Dark theme: full semantic text/accent matrix

| Foreground | Canvas `#181715` | Surface `#24221f` | Muted `#302e2a` | Result |
|---|---:|---:|---:|---|
| Primary `#f4f1eb` | 15.89 | 14.07 | 12.02 | PASS body |
| Secondary `#d8d3ca` | 12.02 | 10.65 | 9.09 | PASS body |
| Muted `#b5afa5` | 8.22 | 7.28 | 6.22 | PASS body |
| Tertiary `#9f998f` | 6.34 | 5.61 | 4.79 | PASS body |
| Disabled / current strong line `#777168` | 3.71 | 3.28 | **2.80** | FAIL body; FAIL non-text on muted |
| Raw Clay `#d97757` | 5.74 | 5.08 | **4.34** | FAIL body on muted; PASS non-text |
| Clay text `#f0b19a` | 9.78 | 8.66 | 7.39 | PASS body |

`#f0b19a` on dark Clay soft `#3a2720` is 7.69:1. The derived dark palette is otherwise viable if R-03's boundary and raw-Clay restrictions are made explicit.

## Surface completeness audit

| Surface | Named in plan | Verification result |
|---|---|---|
| Session list cards | Yes | Base styling covered; loading/empty/offline/retry and compound states need matrix |
| User bubble | Yes | Covered; pending/rejected/delivery-unknown precedence needs matrix |
| Assistant prose | Yes | Covered |
| Nested evidence / plans / working groups | Yes | Covered structurally; action and collapsed/expanded state details incomplete |
| Review / approval | Yes | Base states covered; grant banner and barrier/error alert treatment implicit |
| Attention inbox | Yes | Base selected/urgent state covered; empty/retry/stale compound states incomplete |
| Enrollment | Yes | Base structure covered; scan/validation/error/recovery matrix incomplete |
| Runtime strip | Yes | Base styling covered; checking/stale/error/unavailable treatments incomplete |
| Composer dock | Yes | Base styling covered; sending/immutable snapshot/rejected/delivery-unknown transitions incomplete |
| Model / effort / command sheets | Yes | Base row states covered; loading/no-results/failure/stale/focus-return/scroll-lock states missing |
| Empty / loading / offline / stale / error | Generic only | Not complete per surface; generic grammar is insufficient for implementation |
| Turn actions and quick-action runway | File-level only / implicit | No complete surface treatment or state contract |

No major page family is wholly absent, but several stateful sub-surfaces are not implementation-complete. R-04 is therefore a major completeness gap, not merely editorial detail.

## Security and UX invariant audit

| Invariant | Status | Notes |
|---|---|---|
| Redaction and no raw sensitive payloads | Preserved | Explicit in overview and proof plan; do not add payload-derived CSS classes, labels, or previews |
| Content-free push notifications | Preserved | Explicitly retained |
| Clay is not the default CTA | Preserved | Repeated consistently; Carbon owns primary action and focus |
| 44px touch targets | Preserved | Explicit requirement; verify entire clickable row, not only visible icon |
| Visible focus rings | Preserved with caveat | Carbon 3px ring is appropriate; control boundary contrast still needs R-02/R-03 |
| `prefers-reduced-motion` | Preserved | Existing global fallback is retained; matrix must cover new sheet/stream transitions |
| VoiceOver and keyboard semantics | Preserved with caveat | Requirements exist; R-11 must prevent visual state from diverging from React Aria state |
| Operational semantic colors | Acceptable adaptation | Bounded success/warning/danger colors are necessary product semantics, not competing brand accents |

There is no identified redaction or notification-security regression in the proposed visual direction. The pre-paint bootstrap added for R-06 must validate the stored enum and must not interpolate user-controlled content into HTML.

## Phase and feasibility assessment

The stack choices are feasible: the app already imports Tailwind 4 through `@import 'tailwindcss'`, uses the Tailwind Vite plugin, and uses React Aria Components. CSS variables in `@theme` plus semantic aliases in `:root` are valid for this setup. The proposed component files align with Phases 2 and 3, and caching local WOFF2 files is compatible with the existing service worker.

The handoff is not yet concrete enough because the global alias switch, pre-paint bootstrap, font manifest, exhaustive residue audit, and cache rollback lack implementable contracts. Resolve R-01 through R-09 before treating the restyle as a phase-ready plan.

## Must-fix list for the next stage

1. Complete the token migration inventory, including spacing, widths, motion, type size/line-height/weight, and explicit primitive-to-semantic aliases.
2. Turn light-theme color cautions into enforceable role tokens and allowed-use rules; add body-safe tertiary, Clay-text, and compliant control-boundary tokens.
3. Fix dark `--line-strong` on muted surfaces and prohibit raw Clay as ordinary text where it measures 4.34:1.
4. Add the full per-component interaction/state matrix, including compound-state precedence and the missing sheet, runtime, composer, push, enrollment, alert, turn-action, and quick-action states.
5. Make the restyle a formal phase or an opt-in per-phase migration; reconcile the five-phase plan and remove the “existing OKLCH tokens” conflict.
6. Move initial theme resolution to a validated pre-paint `<head>` bootstrap and retain runtime system-theme synchronization.
7. Pin an exact self-hosted font asset/license manifest with release, filenames, weights/styles, hashes, complete `@font-face` descriptors, preload entries, and cache entries.
8. Replace the narrow residue grep with an allowlist audit and test every actual semantic foreground/surface pair in both themes.
9. Define and test service-worker upgrade/downgrade and asset-coexistence rollback behavior.

## Final disposition

**VERDICT: needs-rework**

**MUST-FIX COUNT: 9**

Review status: REQUESTED_CHANGES
