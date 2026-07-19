---
title: AI Fingerprint Self-Defect Card
description: One self-audit prompt per structured AI fingerprint tell.
trigger_phrases:
  - "AI fingerprint self defect"
  - "model tell self audit"
  - "anti slop self check"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# AI Fingerprint Self-Defect Card

Use these prompts before filing or clearing the model-specific Anti-Patterns finding. Each prompt mirrors one row in `ai-fingerprint-registry.json`.

## OpenCode

### ghost-card-border-plus-shadow
Find any card, panel, or button that uses both a 1px solid border and a soft wide shadow. If the shadow blur is 16px or more on the same element, flag it as a ghost-card border-plus-shadow tell.

### over-rounded-cards
Find cards, sections, panels, and text inputs with border-radius values of 24px or more. Treat pill tags and buttons separately; flag large containers that look inflated rather than designed.

### sketchy-svg-illustration
Find hand-drawn or doodle-style SVGs that stand in for a real subject. Flag sketch or doodle class names, turbulence or displacement filters, and crude low-path scenes used as trust-building visuals.

### diagonal-stripe-background
Find decorative diagonal stripe backgrounds on the body or top-level sections. If repeating-linear-gradient is used as surface decoration rather than information, flag the OpenCode stripe tell.

### element-tracking-on-display-type
Find display or hero headings with letter-spacing tighter than -0.04em. Flag cramped tracking, especially when letters touch or the heading loses legibility.

### theater-meta-criticism-copy
Find body copy that criticizes a product surface by calling it a kind of theater instead of naming concrete user harm. Flag it as advisory and confirm the surrounding context before filing.

## Gemini

### image-hover-animation
Find hover states that transform an image itself, including parent-hover utilities that scale, rotate, or translate a child image. Flag it when the image is not the action target.

## General

### cream-or-sand-body-background
Find warm-neutral near-white body or page backgrounds, including tokens named paper, cream, sand, bone, linen, or ivory when used as the page background. Flag the generic warm-paper default unless the brief truly requires it.

### eyebrow-above-every-section
Find tiny uppercase tracked labels repeated above three or more section headings. Include the numbered 01/02/03 variant when the page is not a real ordered sequence.

### uniform-section-fade-and-rise
Find one identical scroll reveal applied to most or all top-level sections: same fade, rise distance, easing, and trigger. Flag uniform reveal reflexes that ignore the content being revealed.
