---
title: Reciprocal Frame
description: Structural fingerprint that makes navigation and footer express one information model while page bodies remain distinct.
trigger_phrases:
  - "reciprocal frame structure"
  - "navigation footer coherence"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Reciprocal Frame

The opening and closing frames share responsibility for orientation without becoming mirror copies.

## 1. Regions and composition

Use an opening frame that establishes identity, current location, and primary task; compose the middle as page-specific regions with their own heading/body relationships; close with a frame that resolves the page and redistributes attention toward broader destinations, support, or continuity. The two frames share an information model while doing different jobs.

## 2. Remaining rhythm axes

- **Divider language:** distinguish the frame from page bodies through role and pacing, not an ornamental border applied everywhere.
- **Button voice:** opening actions support the current task; closing actions support continuation, recovery, or a next commitment.
- **Image treatment:** frame imagery is optional and must not replace identity, location, or destination labels.
- **Reveal pattern:** core navigation and closing destinations remain available without motion or hidden discovery gestures.

## 3. Navigation and footer pairing

Navigation provides immediate orientation and high-priority movement. The footer completes the same taxonomy with lower-frequency destinations, support, ownership, and continuity; shared labels keep the same meaning, while each frame includes only what its moment requires.

## 4. Applicability guard

**Reach for it when:** a product spans several surfaces, users need strong global orientation, and the closing frame must do more than repeat a generic destination list.

**Avoid when:** the experience is embedded, single-purpose, intentionally frameless, or too small to justify separate opening and closing responsibilities.

## 5. Responsive-collapse note

The shared responsive gate must verify identity, current location, primary movement, support, and lower-frequency destinations remain reachable across space and input changes. It decides disclosure and ordering; this card does not prescribe a menu or footer transformation.

## 6. Failure modes

- The footer duplicates navigation without adding closure, support, or continuity.
- The opening frame presents a generic product pattern unrelated to the actual information architecture.
- Labels change meaning between opening and closing frames.
- Page-specific content inherits so much frame chrome that every surface feels identical.

## 7. Evidence and diversification stamp

Visible proof maps shared labels and responsibilities across both frames, then identifies at least one responsibility unique to each. Record `cardId: "reciprocal-frame"` in the shared `structuralFingerprintSelections` envelope with navigation/footer emphasis, applied regions, responsive-gate evidence, and proof that page-specific bodies remain structurally distinct.

