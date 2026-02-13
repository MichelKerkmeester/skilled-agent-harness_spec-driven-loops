---
name: ux-patterns
description: Apply proven user experience patterns to create intuitive interfaces.
category: design
triggers:
  - ux
  - patterns
  - usability
  - interaction
version: 0.1.0
---

# UX Patterns Skill

## Purpose
Apply proven user experience patterns to create intuitive interfaces.

## Navigation Patterns

### Global Navigation
Top or side navigation for main sections.
- Limit to 5-7 primary items
- Highlight current section
- Keep consistent across pages

### Breadcrumbs
Show location in hierarchy.
- Use for deep hierarchies
- Each item is clickable
- Current page is not a link

### Search
Quick access to content.
- Prominent placement
- Autocomplete suggestions
- Clear search button

## Form Patterns

### Inline Validation
Validate as user types.
- Show success for valid fields
- Show errors after field blur
- Don't validate empty required fields until submit

### Progressive Disclosure
Show fields progressively.
- Start with essential fields
- Reveal advanced options on demand
- Group related fields

### Smart Defaults
Pre-fill sensible values.
- Remember previous choices
- Use location for regional defaults
- Pre-select common options

## Feedback Patterns

### Loading States
- Skeleton screens for initial load
- Spinners for short waits (< 3s)
- Progress bars for long operations
- Optimistic updates when possible

### Empty States
- Explain what should be here
- Guide user to add content
- Don't just show "No items"

### Error States
- Explain what went wrong
- Suggest how to fix it
- Provide a path forward

## Confirmation Patterns

### Destructive Actions
- Require explicit confirmation
- Show what will be affected
- Use different color (red) for danger
- Allow undo when possible
