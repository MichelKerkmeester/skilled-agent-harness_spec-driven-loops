---
title: OKLCH Workflow
description: Practical OKLCH workflow for conversion, palette generation, contrast repair, gamut checks, and implementation handoff.
trigger_phrases:
  - "oklch workflow"
  - "palette generation"
  - "contrast repair"
  - "gamut check"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# OKLCH Workflow

Practical OKLCH workflow for conversion, palette generation, contrast repair, gamut checks, and implementation handoff.

---

## 1. OVERVIEW

### Core Principle

Use OKLCH when creating or repairing a web color system. The useful property is not novelty; it is control. Lightness steps read as brightness steps, hue stays stable across a scale, and chroma can be managed explicitly.

### When to Use

- Converting an implementation color system (hex/HSL) into perceptual tokens.
- Generating a new palette with predictable lightness and hue behavior.
- Repairing failing text or UI contrast.
- Checking gamut and providing safe sRGB or P3 fallbacks.

---

## 2. CHANNELS

| Channel | Meaning | Working rule |
| --- | --- | --- |
| `L` | perceptual lightness, 0 to 1 | Primary contrast lever. Change this first when text fails. |
| `C` | chroma, colorfulness | Lower near black/white; max depends on hue and lightness. |
| `H` | hue angle | Keep stable inside a single-hue scale unless intentionally shifting. |
| alpha | opacity | Use slash syntax; avoid alpha as a substitute for a complete palette. |

Format values as `oklch(0.637 0.237 25.331)` with three decimals for `L` and `C` and no fake precision.

---

## 3. PALETTE GENERATION

1. Pick the hue from brand or subject evidence, not from the common blue or warm-orange default.
2. Generate a lightness ladder first: near-white backgrounds, mid accents, deep text and dark surfaces.
3. Set chroma as a percentage of each hue's displayable maximum, not the same absolute `C` across all hues.
4. Reduce chroma near `L` extremes to avoid neon whites and muddy blacks.
5. For multi-hue palettes, assign roles before values: primary, neutral, semantic, surface, border, text.

---

## 4. CONTRAST REPAIR

Use this sequence:
1. Identify the actual foreground/background pair.
2. Check APCA and WCAG where available. Normal text targets: APCA `|Lc| >= 60` and WCAG AA `4.5:1`; large text and UI components have lower minimums but still need evidence.
3. Adjust `L` first. Chroma and hue changes are branding choices, not reliable contrast fixes.
4. Keep semantic meaning stable. Error red should not become orange just to pass; darken or lighten within the role.

---

## 5. GAMUT AND FALLBACKS

High-chroma OKLCH can leave sRGB. Clamp to the maximum chroma for the chosen `L/H`, or provide a guarded P3 path:

```css
:root {
  --color-accent: oklch(0.62 0.18 260);
}

@media (color-gamut: p3) {
  :root {
    --color-accent: oklch(0.62 0.24 260);
  }
}
```

---

## 6. REVIEW OUTPUT

When proposing changes, use a table so each change is independently actionable:

| Before | After | Why |
| --- | --- | --- |
| `#3b82f6` | `oklch(0.623 0.188 259.815)` | Converts implementation value to perceptual token |
| Same absolute chroma across hues | Same chroma percentage of each hue's max | Keeps perceived vividness balanced |
| Failing text contrast | Lower foreground `L` or raise background `L` | Repairs readability without changing role |

---

## 7. FAILURE SMELLS

- New hex or HSL values in a token system without a compatibility reason.
- Palette steps that visibly drift hue without intent.
- Same accent used for CTA, info, selection, and decoration.
- P3 color without sRGB fallback.
- Dark-mode colors hand-picked independently from the token roles.
