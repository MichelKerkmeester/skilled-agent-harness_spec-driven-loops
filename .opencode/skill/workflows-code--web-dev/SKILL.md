---
name: workflows-code
description: "Orchestrator guiding developers through implementation, debugging, and verification phases across specialized code quality skills (project)"
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.0.9.2
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

This orchestrator operates in four primary phases:

| Phase                       | Purpose                                                     | Trigger                                  |
| --------------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| **Phase 0: Research**       | Systematic analysis before complex implementation           | Performance issues, unfamiliar codebases |
| **Phase 1: Implementation** | Writing code with async handling, validation, cache-busting | Starting new code, modifying existing    |
| **Phase 1.5: Code Quality** | Validate against style standards                            | P0 items pass                            |
| **Phase 2: Debugging**      | Fixing issues systematically using DevTools                 | Console errors, unexpected behavior      |
| **Phase 3: Verification**   | Browser testing before completion claims                    | Before ANY "done" or "works" claim       |

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
    # Core workflow phases
    "VERIFICATION": ["done", "complete", "works", "verify", "finished"],
    "DEBUGGING": ["bug", "fix", "error", "broken", "issue", "failing"],
    "CODE_QUALITY": ["style check", "quality check", "validate code", "check standards", "code review"],

    # Implementation domains
    "IMPLEMENTATION": ["implement", "build", "create", "add", "feature", "code"],
    "ANIMATION": ["animation", "motion", "gsap", "lenis", "scroll", "carousel", "slider", "swiper"],
    "FORMS": ["form", "validation", "input", "submit", "botpoison"],
    "VIDEO": ["video", "hls", "streaming", "player"],
    "DEPLOYMENT": ["deploy", "minify", "cdn", "r2", "production"],

    # Technical domains
    "ASYNC": ["async", "await", "promise", "fetch", "timeout", "setTimeout"],
    "DOM": ["dom", "element", "querySelector", "event", "click", "listener"],
    "CSS": ["css", "style", "layout", "responsive", "media query", "flexbox", "grid"],
    "API": ["api", "fetch", "endpoint", "request", "response"],
    "ACCESSIBILITY": ["a11y", "accessibility", "aria", "screen reader", "keyboard", "focus", "tab"],

    # CONDITIONAL: triggers performance pattern loading
    "PERFORMANCE": ["performance", "optimize", "core web vitals", "lazy load", "cache", "throttle", "debounce", "requestAnimationFrame", "RAF"],
    "OBSERVERS": ["observer", "mutation", "intersection", "resize observer", "shared_observers", "sharedobservers", "observer consolidation"],
    "SCHEDULING": ["requestIdleCallback", "queueMicrotask", "idle callback", "postTask", "scheduling API", "main thread blocking"],
    "THIRD_PARTY": ["third-party", "third party", "external library", "library integration", "script loading", "finsweet"]
}
```

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
    # CONDITIONAL: animation, webflow, security, css, swiper, a11y (if keywords match)
    # ON_DEMAND: performance, observer (on request)
    # ──────────────────────────────────────────────────────────────────
    if task.phase == "implementation":
        # CONDITIONAL: Load for async/validation if keywords detected
        if task.has_async_loading:
            load("assets/patterns/wait_patterns.js")  # CONDITIONAL: async waiting patterns
        if task.needs_validation:
            load("assets/patterns/validation_patterns.js")  # CONDITIONAL: validation templates

        # CONDITIONAL: Load if deployment keywords detected
        if task.needs_minification:
            return load("references/deployment/minification_guide.md")  # CONDITIONAL: terser, verification
        if task.needs_cdn_deployment:
            return load("references/deployment/cdn_deployment.md")  # CONDITIONAL: R2 upload, versioning

        # CONDITIONAL: Load if animation keywords detected
        if task.has_animations:
            return load("references/implementation/animation_workflows.md")  # CONDITIONAL: CSS vs Motion.dev

        # CONDITIONAL: Load if CSS keywords detected (css, style, layout, responsive)
        if task.has_css_work:
            load("references/implementation/css_patterns.md")  # CONDITIONAL: CSS architecture

        # CONDITIONAL: Load if carousel/slider keywords detected
        if task.has_carousel or task.has_slider:
            return load("references/implementation/swiper_patterns.md")  # CONDITIONAL: Swiper.js patterns

        # CONDITIONAL: Load if accessibility/focus keywords detected
        if task.has_accessibility or task.has_focus:
            return load("references/implementation/focus_management.md")  # CONDITIONAL: a11y, keyboard nav

        # CONDITIONAL: Load if webflow keywords detected
        if task.webflow_specific:
            return load("references/implementation/webflow_patterns.md")  # CONDITIONAL: platform limits

        # CONDITIONAL: Load if security keywords detected
        if task.security_concerns:
            return load("references/implementation/security_patterns.md")  # CONDITIONAL: OWASP Top 10

        # CONDITIONAL: Load if third-party library integration detected
        if task.has_third_party or 'finsweet' in task.keywords:
            return load("references/implementation/third_party_integrations.md")  # CONDITIONAL: external libraries, CDN loading

        # CONDITIONAL: Load if performance keywords detected (throttle, debounce, RAF)
        if task.needs_performance_optimization:
            return load("references/implementation/performance_patterns.md")  # CONDITIONAL: throttle, debounce, RAF

        # CONDITIONAL: Load if observer/SharedObservers keywords detected
        if task.needs_observer_patterns:
            return load("references/implementation/observer_patterns.md")  # CONDITIONAL: MutationObserver, IO, SharedObservers

        # CONDITIONAL: Load if browser scheduling APIs detected
        if task.has_scheduling_apis or 'requestIdleCallback' in task.keywords:
            load("references/implementation/async_patterns.md")  # CONDITIONAL: RAF, idle callback, scheduling

        # CONDITIONAL: Load if lenis smooth scroll detected
        if task.has_lenis or 'lenis' in task.keywords:
            load("assets/integrations/lenis_patterns.js")  # CONDITIONAL: Lenis smooth scroll patterns

        # CONDITIONAL: Load if HLS video streaming detected
        if task.has_hls or 'hls' in task.keywords:
            load("assets/integrations/hls_patterns.js")  # CONDITIONAL: HLS.js video patterns

        # ALWAYS: Default implementation patterns
        return load("references/implementation/implementation_workflows.md")

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
    # CONDITIONAL: css, swiper, focus (if debugging those domains)
    # ──────────────────────────────────────────────────────────────────
    if task.phase == "debugging":
        load("assets/checklists/debugging_checklist.md")  # ALWAYS: step-by-step workflow

        # CONDITIONAL: Load if CSS debugging
        if task.has_css_issues:
            load("references/implementation/css_patterns.md")  # CONDITIONAL: CSS debugging

        # CONDITIONAL: Load if carousel/slider debugging
        if task.has_carousel_issues or task.has_slider_issues:
            load("references/implementation/swiper_patterns.md")  # CONDITIONAL: Swiper debugging

        # CONDITIONAL: Load if focus/accessibility debugging
        if task.has_focus_issues or task.has_a11y_issues:
            load("references/implementation/focus_management.md")  # CONDITIONAL: a11y debugging

        # For DevTools reference, see workflows-chrome-devtools skill
        return load("references/debugging/debugging_workflows.md")  # ALWAYS: root cause tracing

    # ──────────────────────────────────────────────────────────────────
    # Phase 3: Verification (MANDATORY)
    # ALWAYS: verification_workflows.md + verification_checklist.md
    # ──────────────────────────────────────────────────────────────────
    if task.phase == "verification" or task.claiming_complete:
        load("assets/checklists/verification_checklist.md")  # ALWAYS: mandatory steps
        return load("references/verification/verification_workflows.md")  # ALWAYS: browser testing

    # ──────────────────────────────────────────────────────────────────
    # Quick Reference
    # ──────────────────────────────────────────────────────────────────
    if task.needs_quick_reference:
        load("references/standards/quick_reference.md")  # one-page cheat sheet (includes CSS patterns)
        return True

# See "The Iron Law" in Section 1 - Phase 3: Verification
# See "Code Quality Gate" in Section 3 - Phase 1.5 for style enforcement
```

### Specific Use Case Router

**Phase 1: Implementation**

| Use Case                                                  | Route To                                                                                                                                           | Load Level  |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Async/timing issues, DOM not ready, race conditions       | [implementation_workflows.md#2-condition-based-waiting](./references/implementation/implementation_workflows.md#2-condition-based-waiting)         | ALWAYS      |
| Form input, API calls, DOM manipulation validation        | [implementation_workflows.md#3-defense-in-depth-validation](./references/implementation/implementation_workflows.md#3-defense-in-depth-validation) | ALWAYS      |
| JavaScript minification, terser, verification             | [minification_guide.md](./references/deployment/minification_guide.md)                                                                             | CONDITIONAL |
| CDN deployment, version management, Cloudflare R2         | [cdn_deployment.md](./references/deployment/cdn_deployment.md)                                                                                     | CONDITIONAL |
| CSS vs Motion.dev, entrance animations, scroll triggers   | [animation_workflows.md](./references/implementation/animation_workflows.md)                                                                       | CONDITIONAL |
| CSS architecture, custom properties, responsive patterns  | [css_patterns.md](./references/implementation/css_patterns.md)                                                                                     | CONDITIONAL |
| Carousel, slider, Swiper.js integration                   | [swiper_patterns.md](./references/implementation/swiper_patterns.md)                                                                               | CONDITIONAL |
| Focus management, keyboard navigation, accessibility      | [focus_management.md](./references/implementation/focus_management.md)                                                                             | CONDITIONAL |
| Webflow collection lists, platform limits, ID duplication | [webflow_patterns.md](./references/implementation/webflow_patterns.md)                                                                             | CONDITIONAL |
| Animation/video/asset optimization, throttle, debounce    | [performance_patterns.md](./references/implementation/performance_patterns.md)                                                                     | CONDITIONAL |
| XSS, CSRF, injection prevention                           | [security_patterns.md](./references/implementation/security_patterns.md)                                                                           | CONDITIONAL |
| Third-party library integration, CDN loading, HLS.js      | [third_party_integrations.md](./references/implementation/third_party_integrations.md)                                                             | CONDITIONAL |
| MutationObserver, IntersectionObserver, SharedObservers   | [observer_patterns.md](./references/implementation/observer_patterns.md)                                                                           | CONDITIONAL |
| RAF, requestIdleCallback, queueMicrotask, scheduling APIs | [async_patterns.md](./references/implementation/async_patterns.md)                                                                                 | CONDITIONAL |

**Phase 2: Debugging**

| Use Case                                               | Route To                                                                                                                                 | Load Level  |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Console errors, layout bugs, event handler failures    | [debugging_workflows.md#2-systematic-debugging](./references/debugging/debugging_workflows.md#2-systematic-debugging)                    | ALWAYS      |
| Deep call stack, mysterious failures, corrupted data   | [debugging_workflows.md#3-root-cause-tracing](./references/debugging/debugging_workflows.md#3-root-cause-tracing)                        | ALWAYS      |
| Slow page, janky animations, memory leaks              | [debugging_workflows.md#4-performance-debugging](./references/debugging/debugging_workflows.md#4-performance-debugging)                  | CONDITIONAL |
| Collection list not rendering, event listeners failing | [webflow_patterns.md](./references/implementation/webflow_patterns.md)                                                                   | CONDITIONAL |
| Motion.dev not loading, layout jumps, jank             | [animation_workflows.md#7-common-issues-and-solutions](./references/implementation/animation_workflows.md#7-common-issues-and-solutions) | CONDITIONAL |
| CSS layout bugs, specificity issues, responsive breaks | [css_patterns.md](./references/implementation/css_patterns.md)                                                                           | CONDITIONAL |
| Carousel/slider not working, Swiper issues             | [swiper_patterns.md](./references/implementation/swiper_patterns.md)                                                                     | CONDITIONAL |
| Focus trapping, keyboard navigation, a11y failures     | [focus_management.md](./references/implementation/focus_management.md)                                                                   | CONDITIONAL |

**Phase 3: Verification**

| Use Case                                             | Route To                                                                         | Load Level |
| ---------------------------------------------------- | -------------------------------------------------------------------------------- | ---------- |
| Before claiming "works", "fixed", "done", "complete" | [verification_workflows.md](./references/verification/verification_workflows.md) | ALWAYS     |
| Animation working, layout fixed, feature complete    | [verification_workflows.md](./references/verification/verification_workflows.md) | ALWAYS     |
| Video/media loads, form submission works             | [verification_workflows.md](./references/verification/verification_workflows.md) | ALWAYS     |

---

## 3. 🛠️ HOW IT WORKS

### Development Lifecycle

Frontend development flows through phases with a mandatory quality gate:

```
Research (optional) → Implementation → Code Quality Gate → Debugging (if issues) → Verification (MANDATORY)
```

### Phase 0: Research (Optional)

**When to Use:** Complex performance issues, unfamiliar codebases, architectural decisions.

#### Performance Audit Workflow

Before implementing performance fixes, conduct systematic analysis:

1. **Capture Baseline Metrics**
   - Run PageSpeed Insights (Mobile + Desktop)
   - Record: LCP, FCP, TBT, CLS, Speed Index
   - Screenshot the waterfall diagram

2. **Identify Root Cause**
   - Use 10-agent research methodology for comprehensive analysis
   - Map the critical rendering path
   - Identify blocking resources

3. **Document Constraints**
   - Platform limitations (Webflow, CMS, etc.)
   - Third-party dependencies
   - Business requirements

#### 10-Agent Research Methodology

For complex codebase analysis, dispatch parallel agents:

| Agent | Focus Area                  |
| ----- | --------------------------- |
| 1     | HTML loading strategy       |
| 2     | JavaScript bundle inventory |
| 3     | Third-party scripts         |
| 4     | CSS performance             |
| 5     | LCP/Images analysis         |
| 6     | Above-fold resources        |
| 7     | Animation performance       |
| 8     | Initialization patterns     |
| 9     | External libraries          |
| 10    | Network waterfall           |

See: `references/research/multi_agent_patterns.md`

#### Skip Phase 0 When
- Simple, isolated fixes
- Clear requirements with known solution
- Time-critical hotfixes


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

4. **Animation Visibility Gates** - Use IntersectionObserver for animation control
   - 0.1 threshold for animation start/stop (10% visibility)
   - Controls video autoplay and Swiper pagination
   - Prefer SharedObservers (`window.SharedObservers.observe()`) with raw IO fallback
   - See [observer_patterns.md](./references/implementation/observer_patterns.md) for patterns

See [implementation_workflows.md](./references/implementation/implementation_workflows.md) for complete workflows.


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

**Systematic Debugging** uses a 4-phase framework: Root Cause Investigation → Pattern Analysis → Hypothesis Testing → Implementation. Key principle: Test one change at a time; if 3+ fixes fail → question approach.

**Root Cause Tracing**: Trace backward from symptom → immediate cause → source. Fix at source, not symptom.

See [debugging_workflows.md](./references/debugging/debugging_workflows.md) for complete workflows.


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
- Chrome Tablet emulation (991px)
- Chrome Mobile emulation (375px)
- DevTools console clear at all viewports

See [verification_workflows.md](./references/verification/verification_workflows.md) for complete requirements.


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
- Use validated timing constants: 64ms throttle (pointer), 180ms debounce (validation), 200ms debounce (resize), 0.1 IntersectionObserver threshold

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

See [implementation_workflows.md](./references/implementation/implementation_workflows.md) for detailed rules.

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
- Remember: RAF auto-throttles to ~1fps in background tabs (no manual visibility checks needed)

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

See [debugging_workflows.md](./references/debugging/debugging_workflows.md) for detailed rules.

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

See [verification_workflows.md](./references/verification/verification_workflows.md) for detailed rules.

### Error Recovery

See [error_recovery.md](./references/debugging/error_recovery.md) for CDN upload, minification, and version mismatch recovery procedures.

---

## 5. 🏆 SUCCESS CRITERIA

### Phase Completion Checklists

| Phase                   | Checklist                                                                              | Key Criteria                                           |
| ----------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Phase 1: Implementation | [implementation_workflows.md](./references/implementation/implementation_workflows.md) | No arbitrary setTimeout, inputs validated, CDN updated |
| Phase 1.5: Code Quality | [code_quality_checklist.md](./assets/checklists/code_quality_checklist.md)             | P0 items passing, snake_case, file headers             |
| Phase 2: Debugging      | [debugging_workflows.md](./references/debugging/debugging_workflows.md)                | Root cause documented, fix at source                   |
| Phase 3: Verification   | [verification_checklist.md](./assets/checklists/verification_checklist.md)             | Browser tested, multi-viewport, console clean          |

### Performance Targets

| Metric | Target | Tool       | Metric | Target | Tool       |
| ------ | ------ | ---------- | ------ | ------ | ---------- |
| FCP    | < 1.8s | Lighthouse | CLS    | < 0.1  | Lighthouse |
| LCP    | < 2.5s | Lighthouse | FPS    | 60fps  | DevTools   |
| TTI    | < 3.8s | Lighthouse | Errors | 0      | Console    |

Run Lighthouse 3× in Incognito with mobile emulation, use median scores.

---

## 6. 🔌 INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Code Quality Standards

- [code_quality_standards.md](./references/standards/code_quality_standards.md) - Initialization, validation, async patterns
- [code_style_guide.md](./references/standards/code_style_guide.md) - Naming, formatting, comments
- [shared_patterns.md](./references/standards/shared_patterns.md) - Common patterns across workflows

### Performance References

- [cwv_remediation.md](./references/performance/cwv_remediation.md) - Core Web Vitals patterns
- [resource_loading.md](./references/performance/resource_loading.md) - Preconnect, preload, async patterns
- [webflow_constraints.md](./references/performance/webflow_constraints.md) - Platform limitations
- [third_party.md](./references/performance/third_party.md) - GTM, analytics optimization
- [performance_checklist.md](./references/verification/performance_checklist.md) - Before/after verification

### External Tools

| Tool                          | Purpose                                                  |
| ----------------------------- | -------------------------------------------------------- |
| **workflows-chrome-devtools** | Browser debugging (CLI-first via bdg, MCP fallback)      |
| **Motion.dev**                | Animation library (CDN: jsdelivr.net/npm/motion@12.15.0) |

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
| **workflows-chrome-devtools** | Browser debugging, screenshots, console access              |

### Navigation Guide

**For Implementation Tasks:**
1. Start with Section 1 (When to Use) to confirm this skill applies
2. Follow Implementation phase from Section 3 (How It Works)
3. Load ALWAYS/CONDITIONAL resources from `references/implementation/`

**For Debugging Tasks:**
1. Load [debugging_checklist.md](./assets/checklists/debugging_checklist.md)
2. Follow systematic debugging workflow in Section 3
3. Use workflows-chrome-devtools skill for DevTools reference

**For Verification Tasks:**
1. Load [verification_checklist.md](./assets/checklists/verification_checklist.md)
2. Complete all applicable checks
3. Only claim "done" when checklist passes

---

## 9. 📍 WHERE AM I? (Phase Detection)

| Phase                 | You're here if...                      | Exit criteria                      |
| --------------------- | -------------------------------------- | ---------------------------------- |
| **0: Research**       | Complex issue, unfamiliar codebase     | Constraints documented, plan ready |
| **1: Implementation** | Writing/modifying code                 | Code written, builds               |
| **1.5: Code Quality** | Implementation done, running checklist | All P0 items passing               |
| **2: Debugging**      | Code has bugs/failing tests            | All tests passing                  |
| **3: Verification**   | Tests pass, final validation           | Verified in browser                |

**Transitions:** 0→1 (plan ready) | 1→2 (bugs found) | 2→1 (missing code) | 2→3 (fixed) | 3→1/2 (issues found). Always end with Phase 3.

---

## 10. 🏎️ QUICK REFERENCE

### Essential Timing Constants

| Constant            | Value | Use Case                                     |
| ------------------- | ----- | -------------------------------------------- |
| Pointer throttle    | 64ms  | `pointermove`, `mousemove` event handlers    |
| Validation debounce | 180ms | Form input validation, search fields         |
| Resize debounce     | 200ms | Window resize handlers, layout recalculation |
| IO threshold        | 0.1   | IntersectionObserver for animations (10%)    |
| RAF background      | ~1fps | Auto-throttled by browser in background tabs |

### Critical Patterns

```javascript
// Condition-based waiting (NOT setTimeout)
async function wait_for_element(selector, timeout = 5000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        const el = document.querySelector(selector);
        if (el) return el;
        await new Promise(r => setTimeout(r, 50));
    }
    throw new Error(`Timeout waiting for ${selector}`);
}

// Throttle pattern (64ms for pointer events)
function throttle(fn, delay = 64) {
    let last = 0;
    return (...args) => {
        const now = Date.now();
        if (now - last >= delay) {
            last = now;
            fn(...args);
        }
    };
}

// Debounce pattern (180ms for validation)
function debounce(fn, delay = 180) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// IntersectionObserver (0.1 threshold)
const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => e.isIntersecting && handle(e)),
    { threshold: 0.1 }
);
```

### CDN Version Update

```bash
# After JS changes, update version in HTML
# Pattern: src="https://cdn.anobel.com/js/file.js?v=X.Y.Z"
# Increment Z for patches, Y for features, X for breaking changes
```

### Browser Testing Matrix

| Viewport | Width  | Required | Notes                     |
| -------- | ------ | -------- | ------------------------- |
| Mobile   | 375px  | ALWAYS   | iPhone SE baseline        |
| Tablet   | 991px  | Standard | Webflow tablet breakpoint |
| Desktop  | 1920px | ALWAYS   | Full HD reference         |

### Performance Targets (Summary)

| Metric | Target | Quick Check                      |
| ------ | ------ | -------------------------------- |
| FCP    | < 1.8s | Lighthouse mobile                |
| CLS    | < 0.1  | Lighthouse mobile                |
| FPS    | 60fps  | DevTools Performance panel       |
| Errors | 0      | DevTools Console (all viewports) |

### Common Commands

```bash
# Minification workflow (scripts located in .opencode/skill/workflows-code/scripts/)
node .opencode/skill/workflows-code/scripts/minify-webflow.mjs          # Batch minify all JS
node .opencode/skill/workflows-code/scripts/verify-minification.mjs     # AST verification
node .opencode/skill/workflows-code/scripts/test-minified-runtime.mjs   # Runtime testing

# Single file minification
npx terser src/2_javascript/[folder]/[file].js --compress --mangle \
  -o src/2_javascript/z_minified/[folder]/[file].js

# CDN deployment (after minification)
wrangler r2 object put anobel-cdn/js/[file].min.js --file src/2_javascript/z_minified/[file].min.js

# Version check
grep -n "v=" src/0_html/global.html | head -5
```

### Success Criteria Checklist (Quick)

```
Implementation:
□ No arbitrary setTimeout (condition-based waiting instead)
□ All inputs validated
□ CDN versions updated

Code Quality:
□ P0 items passing
□ snake_case naming
□ File headers present

Verification:
□ Actual browser opened
□ Mobile + Desktop tested
□ Console errors: 0
□ Documented what was tested
```