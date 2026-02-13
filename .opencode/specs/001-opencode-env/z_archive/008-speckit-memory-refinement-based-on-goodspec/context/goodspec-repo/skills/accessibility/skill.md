---
name: accessibility
description: Ensure all UI components meet WCAG accessibility guidelines and are usable by people with disabilities.
category: design
triggers:
  - accessibility
  - wcag
  - a11y
  - inclusive
version: 0.1.0
---

# Accessibility Skill

## Purpose
Ensure all UI components meet WCAG accessibility guidelines and are usable by people with disabilities.

## Key Principles

1. **Semantic HTML** - Use proper HTML elements for their intended purpose
2. **Keyboard Navigation** - All interactive elements must be keyboard accessible
3. **Screen Reader Support** - Provide meaningful labels and ARIA attributes
4. **Color Contrast** - Maintain sufficient contrast ratios (4.5:1 for normal text)
5. **Focus Management** - Visible focus indicators and logical focus order

## Checklist

- [ ] All images have meaningful alt text
- [ ] Form inputs have associated labels
- [ ] Interactive elements are focusable
- [ ] Color is not the only means of conveying information
- [ ] Text can be resized up to 200% without loss of content
- [ ] Skip links are provided for navigation
- [ ] ARIA roles are used appropriately
- [ ] Error messages are associated with their inputs

## Tools

- axe-core for automated testing
- Screen readers (NVDA, VoiceOver) for manual testing
- Lighthouse accessibility audit
