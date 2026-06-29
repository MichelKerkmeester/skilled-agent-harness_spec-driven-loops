---
title: Design Context Loading Contract
description: Shared sk-design contract for register-first loading, build bundles, context manifests, proof fields, and claim gates.
trigger_phrases:
  - "design context loading"
  - "context loaded card"
  - "proof of application card"
  - "sk-design context manifest"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Design Context Loading Contract

This file is shared vocabulary, not a workflow and not a sixth mode. The mode packets still own craft: `../design-interface/SKILL.md` owns interface direction and pre-flight, `../design-foundations/SKILL.md` owns static systems and contrast, and `../design-audit/SKILL.md` plus `../design-audit/references/audit_contract.md` own evidence-backed audit claims.

---

## 1. OVERVIEW - REGISTER-FIRST GATE

`register.md` is the first read for any design or UI work. Set `Brand` or `Product` before palette, layout, motion, copy, severity, or implementation handoff decisions. The register is the shared posture; mode files decide how to apply it.

Required first files:

- `register.md`
- `../design-interface/references/design-process/brief_to_dials.md`

---

## 2. BUNDLE RULE FOR BUILD WORK

For narrow advice, the parent hub's smallest-useful-mode rule still applies. For work that builds, redesigns, generates, or evaluates a UI surface, the smallest useful bundle is larger than one mode:

- `interface` for direction, surface read, and pre-flight.
- `foundations` for palette, type, layout, responsive, token, and contrast decisions.
- `register.md` plus `../design-interface/references/design-process/brief_to_dials.md` for register and dials.
- `../design-interface/assets/interface_preflight_card.md` before delivery.
- Matching `foundations` axis references when color, type, layout, data, responsive, or token work is in scope.
- `../design-audit/references/audit_contract.md`, `../design-audit/references/accessibility_performance.md`, `../design-audit/references/evidence_capture.md`, and `../design-audit/assets/audit_evidence_worksheet.md` before audit, score, accessibility, release-ready, or production-ready claims.

---

## 3. CONTEXT MANIFEST

Before dispatching an agent or making a design/build decision, name the loaded files in a context manifest. The manifest is proof of context, not a summary.

Minimum manifest fields:

```text
SURFACE:
TASK TYPE: advice | build | redesign | generation | audit | dispatch
REGISTER SOURCE: register.md loaded | not loaded
DIAL SOURCE: brief_to_dials.md loaded | not loaded
MODE BUNDLE LOADED:
- interface:
- foundations:
- audit:
CONDITIONAL FILES LOADED:
- foundations contrast/color refs:
- interface pre-flight card:
- audit evidence refs:
```

No palette, layout, motion, copy, accessibility, score, release, or readiness claim passes until the files behind the claim are named as loaded.

---

## 4. REQUIRED PROOF FIELDS

Use these exact field names and shapes in parent sessions, delegated prompts, child responses, and final proof cards when the corresponding gate applies. The fill-in cards `assets/context_loaded_card.md` (pre-work) and `assets/proof_of_application_card.md` (end-of-work) operationalize these fields.

### Register And Dials

```text
REGISTER: Brand | Product
WHY: task cue | surface in focus | declared register
DIALS: VARIANCE n / MOTION n / DENSITY n
DOWNSTREAM EFFECT: density, motion budget, color dosage, copy register, anti-slop strictness, audit severity
```

### Contrast Pairs

```text
CONTRAST PAIRS:
- foreground token/value:
  background token/value:
  surface:
  target: WCAG AA 4.5:1 body or 3:1 large/UI
  result: pass | fail | not assessed
  fix if fail:
```

`foundations` owns the contrast repair logic; use actual foreground/background pairs and adjust OKLCH lightness first when repairing. Compute each ratio with `../design-foundations/scripts/contrast_check.py` (a calculator, not an estimate); `result` is `fail` for any pair below 4.5:1 body unless the 3:1 large/UI target applies.

### Interface Preflight

```text
INTERFACE PREFLIGHT:
surface:
section count:
narrowest tested width:
hero: pass | fail
grid/bento: pass | fail | N/A
eyebrow/meta: pass | fail
button/form contrast: pass | fail
breakpoint overflow: pass | fail
real imagery: pass | fail | N/A
copy audit: pass | fail
motion/reduced-motion: pass | fail | N/A
AI-tell sweep: pass | fail
verdict: SHIP | FIX
```

`interface` owns the detailed binary card. A single failed applicable box means the UI surface is not ready.

### Interaction State Matrix

This lane applies when the surface is stateful: interactive states beyond default, including loading/error/empty/disabled states, async fetch, form submit, multi-step flow, optimistic update, or state-transition motion. Non-stateful surfaces mark the lane N/A.

```text
INTERACTION STATE MATRIX:
surface/component:
trigger:
states:
- <state>: <one-line meaning>
events:
- <event>: <source state> -> <target state>
transitions:
- <transition>: defined target state | gap:
forbidden:
- <impossible state pair> -> prevented by:
guards:
- <transition>: <condition that must hold>
uiByState:
- <state>: <visible UI representation>
recovery:
- <error/terminal state>: <documented way out>
a11y:
- <state/transition>: focus target, async announcement, disabled semantics
reducedMotion:
- <state-transition motion>: reduced-motion alternative | N/A
verdict: COMPLETE | GAPS
```

`interface` owns the binary pre-flight form for this lane. A stateful surface is not ready until states, events, transitions, forbidden combinations, guards, UI by state, recovery, accessibility, and reduced-motion handling are all modeled. Triggering and model completeness remain design judgment; the checkable floor is that the matrix is present, filled, and consistent wherever the lane applies.

### Audit Evidence

```text
AUDIT EVIDENCE:
target:
source code: confirmed | not-assessed
rendered UI: confirmed | inferred | not-assessed
design artifact: confirmed | inferred | not-assessed
deterministic scan: confirmed | not-assessed
dimensions:
  accessibility:
    coverage:
    - layer: keyboard
      state: confirmed | inferred | blocked | not-assessed
      evidence:
      blocker/what would confirm:
    - layer: screen-reader
      state: confirmed | inferred | blocked | not-assessed
      evidence:
      blocker/what would confirm:
    - layer: zoom-reflow
      state: confirmed | inferred | blocked | not-assessed
      evidence:
      blocker/what would confirm:
    - layer: contrast
      state: confirmed | inferred | blocked | not-assessed
      evidence:
      blocker/what would confirm:
    - layer: reduced-motion
      state: confirmed | inferred | blocked | not-assessed
      evidence:
      blocker/what would confirm:
    - layer: assistive-tech
      state: confirmed | inferred | blocked | not-assessed
      evidence:
      blocker/what would confirm:
    - layer: user-testing
      state: confirmed | inferred | blocked | not-assessed
      evidence:
      blocker/what would confirm:
  performance:
  responsive:
  theming:
  anti-patterns:
```

`audit` owns severity, scoring, labels, and finding order. Use `../design-audit/assets/audit_evidence_worksheet.md` to carry confirmed, inferred, blocked, and not-assessed labels into findings and scores. Accessibility coverage is resolved only when every layer is `confirmed`, `inferred`, or `blocked` with a reason. `blocked` is not a pass; it is an honest resolved-with-reason state. Any `not-assessed` layer blocks WCAG, accessible, release-ready, and production-ready claims. The checkable floor is layer presence plus one valid state per layer; truthfulness of a `confirmed` state and sufficiency of the covered behavior remain audit judgment.

### Decision Rationale

This lane applies when work sets direction, breaks an established pattern, or hands rationale to another worker or context. Non-triggering work marks the lane N/A.

```text
DECISION RATIONALE:
decision:
optionsConsidered[]:
- <option>:
evidenceSources[]:
- <source>:
tradeoffs[]:
- <tradeoff>:
validationPlan:
sourceProofs[]:
- <SOURCE PROOF row or source anchor>:
```

Use this lane to make the reason for the decision reviewable before the design choice hardens. The checker enforces presence and non-placeholder fields only; reasoning quality remains a review judgment.

### Readability And Density

This lane applies when the surface is content-heavy: articles, documentation, dashboards, forms with sustained reading, dense settings, or any UI where reading comfort and scan density affect the outcome. Display type, logos, badges, counters, nav labels, and short UI strings are exempt.

```text
READABILITY AND DENSITY:
surface:
trigger: content-heavy | N/A
measured line length:
  target: 45-75 characters, near 66 for sustained reading
  observed:
  method:
text container max-width:
  value:
  unit: ch
line-height:
decision count:
exemptions:
- display type:
- short UI labels:
verdict: COMPLETE | GAPS | N/A
```

Use content-first house style: constrain sustained text with `ch`-unit max-widths, state an explicit line-height, and count the visible decisions a reader must parse in the surface. This lane is hybrid: field presence is convention-enforced for content-heavy surfaces, while the measured-value quality remains advisory.

### Locale Stress

This lane applies when the surface is global, localized, multilingual, translated, or likely to be reused in a right-to-left locale. Local-only surfaces mark the lane N/A.

```text
LOCALE STRESS:
surface:
trigger: global/localized | N/A
text expansion proxy:
  locale proxy: German/Finnish
  target: approximately 130% source string length
  result:
rtl layout:
  logical properties: pass | fail | N/A
  physical-direction CSS exceptions:
directional icons:
  mirrored arrows/chevrons: pass | fail | N/A
  non-mirrored exceptions:
verdict: COMPLETE | GAPS | N/A
```

Use logical properties for RTL-sensitive layout (`margin-inline-start`, `padding-inline-start`, `text-align: start`) and mirror directional icons such as arrows and chevrons. Do not mirror logos, clocks, media-play controls, or other symbols whose direction has semantic meaning. This lane is hybrid: field presence is convention-enforced for global surfaces, while expansion quality and icon judgment remain advisory.

---

## 5. HARD GATES

| Gate | Blocks |
|---|---|
| Context Loaded | Any design decision before required files are named as loaded |
| Register/Dials | Any palette, layout, motion or copy decision before register and dials |
| Foundations Contrast | Any UI build with changed foreground/background pairs |
| Interface Pre-Flight | Any "done", "ready", "ship", "looks good" delivery claim |
| Interaction State Matrix | Any stateful surface ship/ready/done claim before states, events, transitions, forbidden states, guards, UI by state, recovery, accessibility, and reduced-motion handling are modeled; non-stateful surfaces mark N/A |
| Audit Evidence | Any audit, score, accessibility or release-readiness claim |
| Dispatch Profile | Any small-model delegation where a profile exists |
| Adoption | Any canonical skill change from lineage findings |
| Decision Rationale | Any direction, pattern-break, or handoff claim before the decision, considered options, evidence sources, trade-offs, validation plan, and source proofs are recorded |
| Locale Stress / RTL | Any global or localized UI ready claim before locale-stress proof is filled and the documented RTL physical-direction lint has been run or explicitly marked N/A |

**Deterministic enforcement.** Two gates ship with a calculator so they are checked, not eyeballed. For the Foundations Contrast gate, run `../design-foundations/scripts/contrast_check.py "<fg>" "<bg>" [...]` (WCAG ratio + APCA Lc; exits non-zero on a body-contrast fail). For the final delivery gate, run `scripts/proof_check.py <notes-or-card>.md` (exits non-zero unless all four proof fields are present and the verdict reads READY). Wire both into any build, delivery, or CI step that would produce a ready, accessible, or release claim — including delegated and small-model output.

Documented RTL physical-direction lint, deterministic when run and not an always-on wired gate:

```bash
rg -n --pcre2 '(?:^|[;{[:space:]])(?:margin-(?:left|right)|padding-(?:left|right))\s*:|(?:^|[;{[:space:]])text-align\s*:\s*(?:left|right)\b' --glob '*.{css,scss,sass,less,pcss}' <changed-css-path-or-dir>
```

The rule flags physical-direction CSS (`margin-left`, `margin-right`, `padding-left`, `padding-right`, `text-align: left`, `text-align: right`). It intentionally does not match logical equivalents such as `margin-inline-start`, `margin-inline-end`, `padding-inline-start`, `padding-inline-end`, `text-align: start`, or `text-align: end`. A hit blocks global or localized ready claims unless the style is replaced with a logical equivalent or the exception is documented.

---

## 6. ADOPT-IF-BETTER

Fan-out or delegated recommendations are candidates until merged, attributed, and gated. Before adopting a lineage recommendation into canonical skill files, use the promotion discipline in `../../deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md`: score the candidate, validate it against fixtures or miss cases, check repeatability, respect the manifest boundary, and require explicit operator approval.

---

## 7. DESIGN DISPATCH MANIFEST

`DESIGN_DISPATCH_MANIFEST v1` is the structured carry a parent emits when dispatching design or UI work to a child. The CONTEXT MANIFEST names loaded files for the parent's own decision; the dispatch manifest makes that same resolution survive the dispatch boundary as a digestable block the child receives inline.

| Field | Type | Required | Meaning |
|---|---:|---:|---|
| `version` | integer | yes | Contract version; `1` for v1. |
| `surface` | string | yes | The surface the design work targets: route, page, frame, file, or artifact. |
| `taskType` | string | yes | One of `advice`, `build`, `redesign`, `generation`, `audit`, or `dispatch`, matching the CONTEXT MANIFEST task-type set. |
| `skDesignLoaded` | boolean | yes | Whether the hub was loaded before the manifest was resolved. Must be `true` to dispatch design work. |
| `workflowModes` | string array | yes | Non-empty list of registry-valid modes: `interface`, `foundations`, `motion`, `audit`, or `md-generator`, validated against `mode-registry.json`. |
| `register` | string | yes | `Brand` or `Product`. Must be resolved before dispatch; `unknown` is rejected. |
| `dials` | object | yes | `VARIANCE`, `MOTION`, and `DENSITY`, matching the Register And Dials shape. |
| `loadedFiles` | array | yes | Non-empty `{path, sha256}` entries for the design-context files the child must carry, using the proof-token loadedFiles convention by reference. |
| `proofDemandBack` | object | yes | The proof the parent demands back: a proof-of-application card, and, when Open Design is used, a transport result whose dispatch-manifest digest recomputes to this manifest. |

Validity rules:

- `skDesignLoaded` is `true`.
- `register` is resolved to `Brand` or `Product`; `unknown` is not dispatchable.
- `workflowModes` is non-empty, and every mode is registry-valid.
- `dials` carries the Register And Dials values used for the design decision.
- `loadedFiles` is non-empty, and every entry has the proof-token `{path, sha256}` shape.
- `proofDemandBack` names the proof the child must return, including the transport result when Open Design is in scope.

A manifest that fails any validity rule is not dispatchable. The parent ASKs instead of launching the child.

The manifest travels INLINE in the dispatch payload, never as a path the child resolves. It is the request carry that pairs with the return-path transport result: the parent recomputes the manifest digest from what it emitted and reconciles it against `designManifestDigest`.

Residual: an unmodifiable child CLI may ignore an inlined manifest. The enforceable floor is parent-side: require a valid manifest before dispatch, demand proof back, and deny any return path whose manifest digest cannot be reconciled.
