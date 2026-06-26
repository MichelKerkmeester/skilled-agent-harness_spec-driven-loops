---
title: "Interaction Capture"
description: "Capture hover, focus, active, and disabled component states from a live page; detect loading, empty, and error states; produce interaction diffs that are folded into the tokens.json component variants the v3 writer turns into Components interaction states."
trigger_phrases:
  - "capture interaction states"
  - "--fast-no-interaction flag"
  - "state matrix generation"
  - "hover focus active capture"
  - "interaction-capture.ts"
importance_tier: "normal"
version: 1.0.0.6
---

# Interaction Capture (interaction-capture.ts)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Records per-element interaction states that the extractor would otherwise miss in a static crawl. The module discovers interactive elements on the page, reads their default computed styles, then simulates hover, focus (click), focus-visible (Tab), active (mouse-down), and disabled states. It computes a style diff for every state and also detects loading, empty, and error states through class-name patterns, ARIA attributes, and text-content heuristics. The resulting `InteractionData` is matched to components during clustering and folded into the `tokens.json` component variants (as the per-variant `hoverChanges`, `focusVisibleChanges`, `focusChanges`, `activeChanges`, and `disabledStyle` fields) — it is not written as a standalone interaction block — and the v3 writer turns those variant fields into the hover/focus/active states described inside the named Components. Interaction capture runs by default: `extract.ts` sets `noInteraction = false`, so the capture runs unless you opt out with `--fast-no-interaction` or `--no-interaction`.

---

## 2. HOW IT WORKS

### Flag control

Interaction capture is controlled by the interaction flags in `extract.ts`. The default is on: `noInteraction = false`, so capture runs unless you opt out. Pass `--no-interaction` or `--fast-no-interaction` to skip it. `--with-interaction` is still accepted but is now redundant — it requests the behavior that is already the default. `--fast` reduces crawl depth (`maxPages = 5`) but STILL captures interaction; `--fast-no-interaction` is the combined fast-crawl-and-skip-interaction mode (the old `--fast` behavior).

### Element discovery

The module queries the page for all elements matching an interactive selector: `button`, `a`, `input`, `select`, `textarea`, and ARIA-role elements (`[role="button"]`, `[role="link"]`, `[role="tab"]`, `[role="menuitem"]`, `[role="checkbox"]`, `[role="radio"]`) plus any element with a positive `tabindex`. It deduplicates by CSS class prefix and limits discovery to 50 elements.

### Per-element state capture

For each discovered element the module records the default computed style for ten CSS properties (`backgroundColor`, `color`, `borderColor`, `boxShadow`, `transform`, `opacity`, `outline`, `outlineOffset`, `textDecoration`, `cursor`), then simulates each state and computes a style diff:

1. **Hover**: moves the mouse to the element center and reads the style after 300ms.
2. **Focus-visible**: presses Tab up to 20 times to reach the element via keyboard navigation and reads the style.
3. **Focus**: clicks the element and reads the style after 100ms.
4. **Active**: presses the mouse button on the element and reads the style while held.
5. **Disabled**: reads the style of elements with `disabled` or `aria-disabled="true"`.

Each state is restored before the next begins. The module also reads the computed `transition` property and classifies every element by component type (button, link, input, tab, menuitem, toggle, interactive).

### State detection

Three class/ARIA-based detectors run after per-element capture:

- **Loading states**: scans for class patterns (`loading`, `spinner`, `skeleton`, `shimmer`, `placeholder`), `[aria-busy="true"]`, and `[role="progressbar"]`.
- **Empty states**: scans for class patterns (`empty`, `no-data`, `no-results`, `zero-state`, `empty-state`) and text patterns (`"no results"`, `"nothing here"`, `"get started"`).
- **Error states**: scans for class patterns (`error`, `invalid`, `danger`, `alert`), `[aria-invalid="true"]`, and `[role="alert"]`.

### Timeouts and resilience

The module is defensive. Per-element capture has a 2-second timeout; the full page has a 15-second timeout. Any individual state capture that fails is swallowed and the module continues to the next element. Loading, empty, and error detection failures are also non-fatal. Interrupted operations always attempt to restore the page to a clean state (blur active element, move mouse to 0,0).

### Token output

In-memory, the `InteractionData` payload contains an array of `InteractionCapture` objects plus optional `loadingStates`, `emptyStates`, and `errorStates` arrays. The cluster phase keys these captures on `tag|classes`, matches them to component variants, and persists only the matched per-variant diffs into `tokens.json` (`hoverChanges` / `focusVisibleChanges` / `focusChanges` / `activeChanges` / `disabledStyle` on each `components[].variants[]`). There is no top-level interaction block in `tokens.json`; an unmatched capture is dropped. The v3 writer reads those variant fields when authoring the Components section.

### Validation enforcement

In the v3 Style Reference there is no numbered §11 State Matrix — interaction states are characterized inside the named `## Components` section, which `validate.ts` requires via `checkSectionCompleteness`. Because capture runs by default, most extractions populate component variants with real interaction diffs. When capture is skipped (via `--fast-no-interaction` or `--no-interaction`), the variant interaction fields are null and the Components section simply omits interaction states rather than fabricating them. The validator's `checkSectionCoverage` flags a section-coverage violation when the prose asserts interaction states the backing variant data does not support.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `backend/scripts/interaction-capture.ts` | Script | Interactive element discovery, per-element state simulation (hover/focus/focus-visible/active/disabled), style-diff computation, loading/empty/error state detection |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual_testing_playbook/08--interaction/interaction-state-matrix.md` | Manual playbook | Interaction capture end-to-end scenario — confirms default-on capture folds interaction diffs into the tokens.json component variants the v3 writer turns into the Components interaction states |
| (no automated test) | Automated test | Covered by the manual playbook scenario |

---

## 4. SOURCE METADATA

- Group: INTERACTION CAPTURE
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `07--interaction-capture/interaction-capture.md`

Related references:
- [extract.md](../01--extract/extract.md) -- the extraction orchestrator that runs interaction capture by default (opt out with --fast-no-interaction / --no-interaction)
- [feature-extractors.md](../06--feature-extractors/feature-extractors.md) -- the six per-feature detectors that run alongside interaction capture during extraction
