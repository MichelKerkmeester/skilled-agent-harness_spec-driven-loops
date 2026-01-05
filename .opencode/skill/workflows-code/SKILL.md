---
name: workflows-code
description: "Orchestrator guiding developers through implementation, debugging, and verification phases across specialized code quality skills (project)"
allowed-tools: [Read, Grep, Glob, Bash]
version: 2.0.0
---

<!-- Keywords: workflows-code, development-orchestrator, frontend-development, browser-verification, debugging-workflow, implementation-patterns, webflow-integration -->

# Code Workflows - Development Orchestrator

Unified workflow guidance across 6 specialized code quality skills for frontend development.

**Core Principle**: Implementation → Debugging (if needed) → Verification (MANDATORY) = reliable frontend code.

---

## 1. 🎯 WHEN TO USE

### Activation Triggers

**Use this skill when:**
- Starting frontend development work
- Implementing forms, APIs, DOM manipulation
- Integrating external libraries or media
- JavaScript files have been modified
- Encountering console errors or unexpected behavior
- Deep call stack issues or race conditions
- Multiple debugging attempts needed
- Need root cause identification
- Before ANY completion claim ("works", "fixed", "done", "complete", "passing")
- After implementing or debugging frontend code

**Keyword triggers:**
- Implementation: "implement", "build", "create", "add feature", "async", "validation", "CDN", "animation", "webflow", "performance", "security"
- Debugging: "debug", "fix", "error", "not working", "broken", "issue", "bug", "console error"
- Verification: "done", "complete", "works", "fixed", "finished", "verify", "test"

### When NOT to Use

**Do NOT use this skill for:**
- Non-frontend tasks (backend, infrastructure, DevOps)
- Documentation-only changes
- Pure research without implementation
- Git/version control operations (use workflows-git instead)
- Skill creation/editing (use workflows-documentation instead)

### Phase Overview

This orchestrator operates in three primary phases:

| Phase                       | Purpose                                                     | Trigger                               |
| --------------------------- | ----------------------------------------------------------- | ------------------------------------- |
| **Phase 1: Implementation** | Writing code with async handling, validation, cache-busting | Starting new code, modifying existing |
| **Phase 2: Debugging**      | Fixing issues systematically using DevTools                 | Console errors, unexpected behavior   |
| **Phase 3: Verification**   | Browser testing before completion claims                    | Before ANY "done" or "works" claim    |

**The Iron Law**: NO COMPLETION CLAIMS WITHOUT FRESH BROWSER VERIFICATION EVIDENCE

---

## 2. 🧭 SMART ROUTING

### Resource Loading Levels

| Level       | When to Load             | Resources                          |
| ----------- | ------------------------ | ---------------------------------- |
| ALWAYS      | Every phase invocation   | Core workflow + essential patterns |
| CONDITIONAL | If task keywords match   | Domain-specific references         |
| ON_DEMAND   | Only on explicit request | Deep-dive optimization guides      |

### Task Keyword Triggers

```python
TASK_KEYWORDS = {
    "VERIFICATION": ["done", "complete", "works", "verify", "finished"],
    "DEBUGGING": ["bug", "fix", "error", "broken", "issue", "failing"],
    "CODE_QUALITY": ["style check", "quality check", "validate code", "check standards", "code review"],
    "ANIMATION": ["animation", "motion", "gsap", "lenis", "scroll"],
    "FORMS": ["form", "validation", "input", "submit", "botpoison"],
    "VIDEO": ["video", "hls", "streaming", "player"],
    "DEPLOYMENT": ["deploy", "minify", "cdn", "r2", "production"],
    # ON_DEMAND explicit request triggers
    "PERFORMANCE": ["performance", "optimize", "core web vitals", "lazy load", "cache"],
    "OBSERVERS": ["observer", "mutation", "intersection", "resize observer"]
}
```

### Phase Detection
```
TASK CONTEXT
    │
    ├─► Writing new code / implementing feature
    │   └─► PHASE 1: Implementation
    │       └─► Load: phase1-implementation/*.md (ALWAYS: implementation_workflows.md)
    │       └─► At completion: CODE QUALITY GATE (see Phase 1.5)
    │
    ├─► Implementation complete / claiming done
    │   └─► PHASE 1.5: Code Quality Gate (MANDATORY for all code files)
    │       └─► Load: assets/checklists/code_quality_checklist.md (ALWAYS)
    │       └─► Load: references/standards/code_style_enforcement.md (if violations found)
    │       └─► JavaScript (.js): Sections 2-7 of checklist
    │       └─► CSS (.css): Section 8 of checklist
    │       └─► ⚠️ HARD BLOCK: All P0 checklist items must pass before claiming complete
    │
    ├─► Code not working / debugging issues
    │   └─► PHASE 2: Debugging
    │       └─► Load: phase2-debugging/debugging_workflows.md (ALWAYS)
    │       └─► See: workflows-chrome-devtools skill for DevTools reference
    │
    ├─► Code complete / needs verification
    │   └─► PHASE 3: Verification (MANDATORY)
    │       └─► Load: phase3-verification/verification_workflows.md (ALWAYS)
    │       └─► ⚠️ The Iron Law: NO COMPLETION CLAIMS WITHOUT BROWSER VERIFICATION
    │
    └─► Quick reference needed
        └─► Load: standards/quick_reference.md
```

### Specific Use Case Router

**Phase 1: Implementation**

| Use Case                                                  | Route To                                                                                                                                                      | Load Level  |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Async/timing issues, DOM not ready, race conditions       | [implementation_workflows.md#2-⏱️-condition-based-waiting](./references/phase1-implementation/implementation_workflows.md#2-⏱️-condition-based-waiting)         | ALWAYS      |
| Form input, API calls, DOM manipulation validation        | [implementation_workflows.md#3-🛡️-defense-in-depth-validation](./references/phase1-implementation/implementation_workflows.md#3-🛡️-defense-in-depth-validation) | ALWAYS      |
| JavaScript minification, terser, verification             | [minification_guide.md](./references/deployment/minification_guide.md)                                                                                        | CONDITIONAL |
| CDN deployment, version management, Cloudflare R2         | [cdn_deployment.md](./references/deployment/cdn_deployment.md)                                                                                                | CONDITIONAL |
| CSS vs Motion.dev, entrance animations, scroll triggers   | [animation_workflows.md](./references/phase1-implementation/animation_workflows.md)                                                                           | CONDITIONAL |
| Webflow collection lists, platform limits, ID duplication | [webflow_patterns.md](./references/phase1-implementation/webflow_patterns.md)                                                                                 | CONDITIONAL |
| Animation/video/asset optimization                        | [performance_patterns.md](./references/phase1-implementation/performance_patterns.md)                                                                         | ON_DEMAND   |
| XSS, CSRF, injection prevention                           | [security_patterns.md](./references/phase1-implementation/security_patterns.md)                                                                               | CONDITIONAL |
| Third-party library integration, CDN loading, HLS.js      | [third_party_integrations.md](./references/phase1-implementation/third_party_integrations.md)                                                                 | CONDITIONAL |
| MutationObserver, IntersectionObserver, DOM watching      | [observer_patterns.md](./references/phase1-implementation/observer_patterns.md)                                                                               | ON_DEMAND   |

**Phase 2: Debugging**

| Use Case                                               | Route To                                                                                                                                            | Load Level  |
| ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Console errors, layout bugs, event handler failures    | [debugging_workflows.md#2-🔍-systematic-debugging](./references/phase2-debugging/debugging_workflows.md#2-🔍-systematic-debugging)                    | ALWAYS      |
| Deep call stack, mysterious failures, corrupted data   | [debugging_workflows.md#3-🎯-root-cause-tracing](./references/phase2-debugging/debugging_workflows.md#3-🎯-root-cause-tracing)                        | ALWAYS      |
| Slow page, janky animations, memory leaks              | [debugging_workflows.md#4-🔍-performance-debugging](./references/phase2-debugging/debugging_workflows.md#4-🔍-performance-debugging)                  | CONDITIONAL |
| Collection list not rendering, event listeners failing | [webflow_patterns.md](./references/phase1-implementation/webflow_patterns.md)                                                                       | CONDITIONAL |
| Motion.dev not loading, layout jumps, jank             | [animation_workflows.md#7-🐛-common-issues-and-solutions](./references/phase1-implementation/animation_workflows.md#7-🐛-common-issues-and-solutions) | CONDITIONAL |

**Phase 3: Verification**

| Use Case                                             | Route To                                                                                | Load Level |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------- |
| Before claiming "works", "fixed", "done", "complete" | [verification_workflows.md](./references/phase3-verification/verification_workflows.md) | ALWAYS     |
| Animation working, layout fixed, feature complete    | [verification_workflows.md](./references/phase3-verification/verification_workflows.md) | ALWAYS     |
| Video/media loads, form submission works             | [verification_workflows.md](./references/phase3-verification/verification_workflows.md) | ALWAYS     |

### Resource Router
```python
def route_frontend_resources(task):
    # ──────────────────────────────────────────────────────────────────
    # Level-based loading
    # ALWAYS: Load for every phase invocation
    # CONDITIONAL: Load if keywords match
    # ON_DEMAND: Load on explicit request
    # ──────────────────────────────────────────────────────────────────
    
    # ──────────────────────────────────────────────────────────────────
    # Phase 1: Implementation
    # ALWAYS: implementation_workflows.md
    # CONDITIONAL: animation, webflow, security (if keywords match)
    # ON_DEMAND: performance, observer (on request)
    # ──────────────────────────────────────────────────────────────────
    if task.phase == "implementation":
        # ALWAYS: Load for async/validation
        if task.has_async_loading:
            load("assets/patterns/wait_patterns.js")  # ALWAYS: async waiting patterns
        if task.needs_validation:
            load("assets/patterns/validation_patterns.js")  # ALWAYS: validation templates
        
        # CONDITIONAL: Load if deployment keywords detected
        if task.needs_minification:
            return load("references/deployment/minification_guide.md")  # CONDITIONAL: terser, verification
        if task.needs_cdn_deployment:
            return load("references/deployment/cdn_deployment.md")  # CONDITIONAL: R2 upload, versioning
        
        # CONDITIONAL: Load if animation keywords detected
        if task.has_animations:
            return load("references/phase1-implementation/animation_workflows.md")  # CONDITIONAL: CSS vs Motion.dev
        
        # CONDITIONAL: Load if webflow keywords detected
        if task.webflow_specific:
            return load("references/phase1-implementation/webflow_patterns.md")  # CONDITIONAL: platform limits
        
        # CONDITIONAL: Load if security keywords detected
        if task.security_concerns:
            return load("references/phase1-implementation/security_patterns.md")  # CONDITIONAL: OWASP Top 10
        
        # ON_DEMAND: Load on explicit request (performance optimization)
        if task.needs_performance_optimization:
            return load("references/phase1-implementation/performance_patterns.md")  # ON_DEMAND: Core Web Vitals
        
        # ON_DEMAND: Load on explicit request (observer patterns)
        if task.needs_observer_patterns:
            return load("references/phase1-implementation/observer_patterns.md")  # ON_DEMAND: MutationObserver, IO
        
        # ALWAYS: Default implementation patterns
        return load("references/phase1-implementation/implementation_workflows.md")

    # ──────────────────────────────────────────────────────────────────
    # Phase 1.5: Code Quality Gate (MANDATORY for all code files)
    # ALWAYS: code_quality_checklist.md
    # CONDITIONAL: code_style_enforcement.md (if violations found)
    # JavaScript (.js): Sections 2-7 | CSS (.css): Section 8
    # ──────────────────────────────────────────────────────────────────
    if task.phase == "code_quality" or task.implementation_complete:
        load("assets/checklists/code_quality_checklist.md")  # ALWAYS: validation checklist
        if task.has_violations:
            load("references/standards/code_style_enforcement.md")  # CONDITIONAL: remediation
        return True  # Gate must pass before proceeding

    # ──────────────────────────────────────────────────────────────────
    # Phase 2: Debugging
    # ALWAYS: debugging_workflows.md + debugging_checklist.md
    # ──────────────────────────────────────────────────────────────────
    if task.phase == "debugging":
        load("assets/checklists/debugging_checklist.md")  # ALWAYS: step-by-step workflow
        # For DevTools reference, see workflows-chrome-devtools skill
        return load("references/phase2-debugging/debugging_workflows.md")  # ALWAYS: root cause tracing

    # ──────────────────────────────────────────────────────────────────
    # Phase 3: Verification (MANDATORY)
    # ALWAYS: verification_workflows.md + verification_checklist.md
    # ──────────────────────────────────────────────────────────────────
    if task.phase == "verification" or task.claiming_complete:
        load("assets/checklists/verification_checklist.md")  # ALWAYS: mandatory steps
        return load("references/phase3-verification/verification_workflows.md")  # ALWAYS: browser testing

    # ──────────────────────────────────────────────────────────────────
    # Quick Reference
    # ──────────────────────────────────────────────────────────────────
    if task.needs_quick_reference:
        return load("references/standards/quick_reference.md")  # one-page cheat sheet

# ──────────────────────────────────────────────────────────────────
# STATIC RESOURCES (always available, not conditionally loaded)
# Located in references/standards/ for cross-phase access
# ──────────────────────────────────────────────────────────────────
# references/standards/code_quality_standards.md → Cross-phase: Initialization, error handling, validation patterns
# references/standards/code_style_guide.md → Cross-phase: Naming conventions, formatting, comments
# references/standards/code_style_enforcement.md → Phase 1.5: Enforcement rules with examples and remediation
# references/standards/shared_patterns.md → DevTools, logging, testing, error patterns
# references/phase1-implementation/performance_patterns.md → Phase 1: Performance optimization (ON_DEMAND)
# references/deployment/minification_guide.md → Safe JS minification with terser, verification pipeline
# references/deployment/cdn_deployment.md → Cloudflare R2 upload, version management, HTML updates
# assets/checklists/code_quality_checklist.md → Phase 1.5: Code quality validation checklist

# See "The Iron Law" in Section 1 - Phase 3: Verification
# See "Code Quality Gate" in Section 3 - Phase 1.5 for style enforcement
```

---

## 3. 🛠️ HOW IT WORKS

### Development Lifecycle

Frontend development flows through phases with a mandatory quality gate:

```
Implementation → Code Quality Gate → Debugging (if issues) → Verification (MANDATORY)
```

### Phase 1: Implementation

**Implementation involves three specialized workflows:**

1. **Condition-Based Waiting** - Replace arbitrary setTimeout with condition polling
   - Wait for actual conditions, not timeouts
   - Includes timeout limits with clear errors
   - Handles: DOM ready, library loading, image/video ready, animations

2. **Defense-in-Depth Validation** - Validate at every layer data passes through
   - Layer 1: Entry point validation
   - Layer 2: Processing validation
   - Layer 3: Output validation
   - Layer 4: Safe access patterns

3. **CDN Version Management** - Update version parameters after JS changes
   - Manual version increment workflow (see Section 4)
   - Updates all HTML files referencing changed JS
   - Forces browser cache refresh

See [implementation_workflows.md](./references/phase1-implementation/implementation_workflows.md) for complete workflows.


### Phase 1.5: Code Quality Gate

**Before claiming implementation is complete, validate code against style standards:**

1. **Identify File Type** - Determine which checklist sections apply:
   - **JavaScript (`.js`)**: Sections 2-7 (13 P0 items)
   - **CSS (`.css`)**: Section 8 (4 P0 items)
   - **Both**: All sections (17 P0 items)

2. **Load Checklist** - Load [code_quality_checklist.md](./assets/checklists/code_quality_checklist.md)

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

See [code_style_enforcement.md](./references/standards/code_style_enforcement.md) for remediation instructions.


### Phase 2: Debugging

**Systematic Debugging** uses a 4-phase framework:

1. **Root Cause Investigation**
   - Read error messages carefully
   - Reproduce consistently
   - Check recent changes
   - Gather evidence in DevTools
   - Trace data flow

2. **Pattern Analysis**
   - Find working examples
   - Compare against references
   - Identify differences
   - Understand dependencies

3. **Hypothesis and Testing**
   - Form single hypothesis
   - Test minimally (one change at a time)
   - Verify before continuing
   - Ask when unsure

4. **Implementation**
   - Document the fix
   - Implement single fix
   - Verify in browser
   - If 3+ fixes failed → question approach

**Root Cause Tracing** traces backward through call chain:

1. Observe symptom
2. Find immediate cause
3. Trace one level up
4. Keep tracing up
5. Fix at source, not symptom

See [debugging_workflows.md](./references/phase2-debugging/debugging_workflows.md) for complete workflows.


### Phase 3: Verification

**The Gate Function** - BEFORE claiming any status:

1. IDENTIFY: What command/action proves this claim?
2. OPEN: Launch actual browser
3. TEST: Execute the interaction
4. VERIFY: Does browser show expected behavior?
5. VERIFY: Multi-viewport check (mobile + desktop)
6. VERIFY: Cross-browser check (if critical)
7. RECORD: Note what you saw
8. ONLY THEN: Make the claim

**Browser Testing Matrix:**

**Minimum** (ALWAYS REQUIRED):
- Chrome Desktop (1920px)
- Mobile emulation (375px)
- DevTools Console - No errors

**Standard** (Production work):
- Chrome Desktop (1920px)
- Chrome Tablet emulation (768px)
- Chrome Mobile emulation (375px)
- DevTools console clear at all viewports

See [verification_workflows.md](./references/phase3-verification/verification_workflows.md) for complete requirements.


---

## 4. 📋 RULES

### Phase 1: Implementation

#### ✅ ALWAYS
- Wait for actual conditions, not arbitrary timeouts (include timeout limits)
- Validate all inputs: function parameters, API responses, DOM elements
- Sanitize user input before storing or displaying
- Update CDN versions after JavaScript modifications
- Use optional chaining (`?.`) and try/catch for safe access
- Log meaningful success/error messages

#### ❌ NEVER
- Use `setTimeout` without documenting WHY
- Assume data exists without checking
- Trust external data without validation
- Use innerHTML with unsanitized data
- Skip CDN version updates after JS changes

#### ⚠️ ESCALATE IF
- Condition never becomes true (infinite wait)
- Validation logic becoming too complex
- Security concerns with XSS or injection attacks
- Script reports no HTML files found
- CDN version cannot be determined

See [implementation_workflows.md](./references/phase1-implementation/implementation_workflows.md) for detailed rules.

### Phase 1.5: Code Quality Gate (MANDATORY for all code files)

#### ✅ ALWAYS
- Load code_quality_checklist.md before claiming implementation complete
- Identify file type (JavaScript → Sections 2-7, CSS → Section 8)
- Validate all P0 items for the applicable file type
- Fix P0 violations before proceeding
- Document any P1/P2 deferrals with reasons
- Use code_style_enforcement.md for remediation guidance

#### ❌ NEVER (JavaScript)
- Skip the quality gate for "simple" changes
- Claim completion with P0 violations
- Use commented-out code (delete it)
- Use camelCase for variables/functions (use snake_case)
- Skip file headers or section organization

#### ❌ NEVER (CSS)
- Use generic custom property names without semantic prefixes
- Omit case-insensitivity flag `i` on data attribute selectors
- Use inconsistent BEM naming (mix snake_case, camelCase)
- Animate layout properties (width, height, top, left, padding, margin)
- Set `will-change` permanently in CSS (set dynamically via JS)

#### ⚠️ ESCALATE IF
- Cannot fix a P0 violation
- Standard conflicts with existing code patterns
- Unclear whether code is compliant

See [code_quality_checklist.md](./assets/checklists/code_quality_checklist.md) and [code_style_enforcement.md](./references/standards/code_style_enforcement.md) for detailed rules.

### Phase 2: Debugging

#### ✅ ALWAYS
- Open DevTools console BEFORE attempting fixes
- Read complete error messages and stack traces
- Test across multiple viewports (375px, 768px, 1920px)
- Test one change at a time
- Trace backward from symptom to root cause
- Document root cause in comments

#### ❌ NEVER
- Skip console error messages
- Change multiple things simultaneously
- Proceed with 4th fix without questioning approach
- Fix only symptoms without tracing root cause
- Leave production console.log statements

#### ⚠️ ESCALATE IF
- Bug only occurs in production
- Issue requires changing Webflow-generated code
- Cross-browser compatibility cannot be achieved
- Bug intermittent despite extensive logging
- Cannot trace backward (dead end)
- Root cause in third-party library

See [debugging_workflows.md](./references/phase2-debugging/debugging_workflows.md) for detailed rules.

### Phase 3: Verification (MANDATORY)

#### ✅ ALWAYS
- Open actual browser to verify (not just code review)
- Test mobile viewport (375px minimum)
- Check DevTools console for errors
- Test interactive elements by clicking them
- Note what you tested in your claim

#### ❌ NEVER
- Claim "works" without opening browser
- Say "should work" or "probably works" - test it
- Test only at one viewport size
- Assume desktop testing covers mobile
- Express satisfaction before verification

#### ⚠️ ESCALATE IF
- Cannot test in required browsers
- Real device testing required but unavailable
- Issue only reproduces in production
- Performance testing requires specialized tools

See [verification_workflows.md](./references/phase3-verification/verification_workflows.md) for detailed rules.

---

## 5. 🏆 SUCCESS CRITERIA

### Phase 1: Implementation

**Implementation is successful when:**
- ✅ No arbitrary setTimeout used (or documented why needed)
- ✅ All inputs validated (parameters, DOM, API responses)
- ✅ User input sanitized
- ✅ CDN versions updated after JS changes
- ✅ Safe defaults provided for missing data
- ✅ Clear error messages logged

See [implementation_workflows.md](./references/phase1-implementation/implementation_workflows.md) for complete criteria.

### Phase 1.5: Code Quality Gate

**Code Quality Gate passes when:**

**JavaScript (.js):**
- ✅ All P0 checklist items verified and passing (Sections 2-7)
- ✅ All P1 checklist items verified or documented deferrals
- ✅ File headers use correct format (three-line, box-drawing)
- ✅ Section organization follows standard (IIFE, numbered headers)
- ✅ No commented-out code present
- ✅ All naming uses snake_case (not camelCase)
- ✅ CDN-safe initialization pattern followed

**CSS (.css):**
- ✅ All P0 checklist items verified and passing (Section 8)
- ✅ Custom properties use semantic prefixes (`--font-*`, `--vw-*`, etc.)
- ✅ Attribute selectors include case-insensitivity flag `i`
- ✅ Class names follow BEM convention (`.block--element`, `.block-modifier`)
- ✅ Animations use GPU-accelerated properties only (`transform`, `opacity`, `scale`)

See [code_quality_checklist.md](./assets/checklists/code_quality_checklist.md) for complete criteria.

### Phase 2: Debugging

**Debugging is successful when:**
- ✅ Root cause identified and documented
- ✅ Fix addresses cause, not symptom
- ✅ Tested across target browsers and viewports
- ✅ No console errors introduced
- ✅ Performance not degraded
- ✅ Code comments explain WHY fix needed

See [debugging_workflows.md](./references/phase2-debugging/debugging_workflows.md) for complete criteria.

### Phase 3: Verification

**Verification is successful when:**
- ✅ Opened actual browser (not just reviewed code)
- ✅ Tested in multiple viewports (mobile + desktop)
- ✅ Checked DevTools console (no errors)
- ✅ Tested interactions by actually clicking/hovering
- ✅ Documented what was tested in claim
- ✅ Can describe exactly what was seen in browser

See [verification_workflows.md](./references/phase3-verification/verification_workflows.md) for complete criteria.

### Verification Statement Template

See [verification_checklist.md](./assets/checklists/verification_checklist.md) for the completion claim template.

---

## 6. 🔌 INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Code Quality Standards

**Primary References:**
- [code_quality_standards.md](./references/standards/code_quality_standards.md) - Initialization, error handling, validation, async patterns
- [code_style_guide.md](./references/standards/code_style_guide.md) - Naming conventions, formatting, comments

See these reference files for complete standards. Key patterns include CDN-safe initialization, snake_case naming, and defense-in-depth validation.

### Tool Usage Guidelines

- **Bash**: Git commands, system operations
- **Read**: Examine code files, documentation
- **Grep**: Pattern searches, finding keywords
- **Glob**: File discovery by patterns

### Additional Knowledge Base Dependencies

- **Code Quality Standards** - Initialization and validation patterns in [code_quality_standards.md](./references/standards/code_quality_standards.md)
- **Code Style Guide** - Naming conventions and formatting in [code_style_guide.md](./references/standards/code_style_guide.md)

### External Tools

- **Browser DevTools** - Chrome DevTools MCP (automated testing), Chrome DevTools (manual debugging)
- **Python 3** - General scripting support
- **Git** - Version control for checking changes
- **Motion.dev** - Animation library (CDN: jsdelivr.net/npm/motion@12.15.0)
- **mcp-narsil** - Security scanning during debugging (OWASP, CWE, taint analysis via Code Mode)

### Browser Verification

For browser debugging and verification, use the **workflows-chrome-devtools** skill which provides:
- CLI-first approach via `browser-debugger-cli` (bdg)
- MCP fallback for multi-tool workflows
- Complete DevTools integration (644 methods across 53 domains)

**See:** `.opencode/skill/workflows-chrome-devtools/SKILL.md` for complete reference.

### Quality Review Integration

> **Note:** Review quality manually after file modifications.

**Manual quality review steps:**
- Review recent file changes for quality issues
- Check for consistent patterns across modifications
- Use as inputs to Phase 1 investigation during debugging

See [shared_patterns.md](./references/standards/shared_patterns.md) for common patterns across all workflows.

---

## 7. 📚 EXTERNAL RESOURCES

### Official Documentation

| Resource           | URL                         | Use For                   |
| ------------------ | --------------------------- | ------------------------- |
| MDN Web Docs       | developer.mozilla.org       | JavaScript, DOM, Web APIs |
| Webflow University | university.webflow.com      | Webflow platform patterns |
| Motion.dev         | motion.dev/docs             | Animation library         |
| HLS.js             | github.com/video-dev/hls.js | Video streaming           |
| Lenis              | lenis.darkroom.engineering  | Smooth scroll             |

### Testing & Debugging

| Resource        | URL                                | Use For               |
| --------------- | ---------------------------------- | --------------------- |
| Chrome DevTools | developer.chrome.com/docs/devtools | Browser debugging     |
| Can I Use       | caniuse.com                        | Browser compatibility |

---

## 8. 🔗 RELATED RESOURCES

### Related Skills

| Skill                         | Use For                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| **workflows-documentation**   | Documentation quality, skill creation, markdown validation  |
| **workflows-git**             | Git workflows, commit hygiene, PR creation                  |
| **system-spec-kit**           | Spec folder management, memory system, context preservation |
| **mcp-narsil**                | Code intelligence, security scanning, call graphs           |
| **workflows-chrome-devtools** | Browser debugging, screenshots, console access              |

### Navigation Guide

**For Implementation Tasks:**
1. Start with Section 1 (When to Use) to confirm this skill applies
2. Follow Implementation phase from Section 3 (How It Works)
3. Load ALWAYS/CONDITIONAL resources from `references/phase1-implementation/`

**For Debugging Tasks:**
1. Load [debugging_checklist.md](./assets/checklists/debugging_checklist.md)
2. Follow systematic debugging workflow in Section 3
3. Use workflows-chrome-devtools skill for DevTools reference

**For Verification Tasks:**
1. Load [verification_checklist.md](./assets/checklists/verification_checklist.md)
2. Complete all applicable checks
3. Only claim "done" when checklist passes

---

## 9. 📍 WHERE AM I? (Phase Detection Helper)

If you're unsure which phase you're in:

### Phase 1: Implementation
**You're here if:** Writing/modifying code, not yet testing
**Exit criteria:** Code written, builds successfully

### Phase 2: Debugging
**You're here if:** Code written but has bugs/failing tests
**Exit criteria:** All tests passing, feature functional

### Phase 3: Verification
**You're here if:** Tests pass, performing final validation
**Exit criteria:** Verified in browser, ready to ship

### Phase Transitions

- **Phase 1 → 2:** Implementation reveals bugs → Switch to debugging
- **Phase 2 → 1:** Debugging reveals missing code → Return to implementation
- **Phase 2 → 3:** All bugs fixed → Proceed to verification
- **Phase 3 → 1/2:** Verification reveals issues → Return to appropriate phase

**Key principle:** Always end with Phase 3 before claiming completion.