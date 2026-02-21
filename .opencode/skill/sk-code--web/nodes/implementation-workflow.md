---
description: "Phase 1 implementation patterns for CSS/layout/animation, accessibility (ARIA), API/network handlers, and responsive frontend delivery with a Phase 1.5 quality gate"
---
# Implementation Workflow

Covers Phase 1 (writing code) and Phase 1.5 (code quality validation) of the development lifecycle.

## Phase 1: Implementation

Implementation involves four specialized workflows:

### 1. Condition-Based Waiting

Replace arbitrary setTimeout with condition polling:
- Wait for actual conditions, not timeouts
- Includes timeout limits with clear errors
- Handles: DOM ready, library loading, image/video ready, animations

### 2. Defense-in-Depth Validation

Validate at every layer data passes through:
- Layer 1: Entry point validation
- Layer 2: Processing validation
- Layer 3: Output validation
- Layer 4: Safe access patterns

### 3. CDN Version Management

Update version parameters after JS changes:
- Manual version increment workflow
- Updates all HTML files referencing changed JS
- Forces browser cache refresh

### 4. Animation Visibility Gates

Use IntersectionObserver for animation control:
- 0.1 threshold for animation start/stop (10% visibility)
- Controls video autoplay and Swiper pagination
- Prefer SharedObservers (`window.SharedObservers.observe()`) with raw IO fallback
- See `references/implementation/observer_patterns.md` for patterns

See `references/implementation/implementation_workflows.md` for complete workflows.

## Phase 1.5: Code Quality Gate

Before claiming implementation is complete, validate code against style standards.

### Workflow

1. **Identify File Type** - Determine which checklist sections apply:
   - **JavaScript (`.js`)**: Sections 2-7 (13 P0 items)
   - **CSS (`.css`)**: Section 8 (4 P0 items)
   - **Both**: All sections (17 P0 items)

2. **Load Checklist** - Load `assets/checklists/code_quality_checklist.md`

3. **Validate P0 Items** - Check all P0 (blocking) items for the file type:

   **JavaScript P0 Items:**
   - File header format (three-line with box-drawing characters)
   - Section organization (IIFE, numbered headers)
   - No commented-out code
   - snake_case naming conventions
   - CDN-safe initialization pattern

   **CSS P0 Items:**
   - Custom property naming (semantic prefixes: `--font-*`, `--vw-*`, etc.)
   - Attribute selectors use case-insensitivity flag `i`
   - BEM naming convention (`.block--element`, `.block-modifier`)
   - GPU-accelerated animation properties only (`transform`, `opacity`, `scale`)

4. **Validate P1 Items** - Check all P1 (required) items for the file type

5. **Fix or Document** - For any failures:
   - P0 violations: MUST fix before proceeding
   - P1 violations: Fix OR document approved deferral
   - P2 violations: Can defer with documented reason

6. **Only Then** - Proceed to verification or claim completion

**Gate Rule**: If ANY P0 item fails, completion is BLOCKED until fixed.

See `references/standards/code_style_enforcement.md` for remediation instructions.

## Cross References
- [[how-it-works]] - Lifecycle overview and phase transitions
- [[rules]] - ALWAYS/NEVER/ESCALATE rules for implementation
- [[verification-workflow]] - Phase 3 that follows implementation
- [[debugging-workflow]] - Phase 2 if issues arise during implementation
- [Document Quality Mode](../../sk-documentation/nodes/mode-document-quality.md) - Quality review workflow for implementation docs
- [OpenCode Quick Reference](../../sk-code--opencode/nodes/quick-reference.md) - TypeScript/Python/Shell standards alignment
- [Progressive Enhancement Levels](../../system-spec-kit/nodes/progressive-enhancement.md) - Spec level and template guidance
