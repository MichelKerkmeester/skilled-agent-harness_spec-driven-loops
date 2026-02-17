---
name: workflows-code--web-dev
description: "Orchestrator guiding developers through implementation, debugging, and verification phases across specialized code quality skills (project)"
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.0.5.1
---

<!-- Keywords: workflows-code, development-orchestrator, frontend-development, browser-verification, debugging-workflow, implementation-patterns, webflow-integration -->

# Code Workflows - Development Orchestrator

Unified workflow guidance across 6 specialized code quality skills for frontend development.

**Core Principle**: Implementation → Debugging (if needed) → Verification (MANDATORY) = reliable frontend code.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

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

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level       | When to Load             | Resources                          |
| ----------- | ------------------------ | ---------------------------------- |
| ALWAYS      | Every phase invocation   | Core workflow + essential patterns |
| CONDITIONAL | If task keywords match   | Domain-specific references         |
| ON_DEMAND   | Only on explicit request | Deep-dive optimization guides      |

### Task Keyword Triggers

```python
TASK_SIGNALS = {
    "VERIFICATION": {"verify": 2.4, "done": 2.1, "complete": 2.0, "works": 1.8, "finished": 1.7},
    "DEBUGGING": {"bug": 2.3, "fix": 2.0, "error": 2.4, "broken": 1.8, "issue": 1.6, "failing": 1.9},
    "CODE_QUALITY": {"style check": 2.2, "quality check": 2.2, "validate code": 2.0, "check standards": 2.0, "code review": 1.7},
    "IMPLEMENTATION": {"implement": 2.0, "build": 1.7, "create": 1.5, "add": 1.2, "feature": 1.5, "code": 1.0},
    "ANIMATION": {"animation": 2.1, "motion": 1.8, "gsap": 2.3, "lenis": 2.1, "scroll": 1.4, "carousel": 1.8, "slider": 1.8, "swiper": 2.1},
    "FORMS": {"form": 2.0, "validation": 1.7, "input": 1.4, "submit": 1.5, "botpoison": 2.2},
    "FORM_UPLOAD": {"upload": 2.2, "filepond": 2.5, "file upload": 2.3, "drag drop": 1.9, "mime type": 1.8, "r2 upload": 2.2, "dropzone": 1.8},
    "VIDEO": {"video": 2.0, "hls": 2.4, "streaming": 2.1, "player": 1.4},
    "DEPLOYMENT": {"deploy": 2.2, "minify": 2.1, "cdn": 2.0, "r2": 1.8, "production": 1.5},
    "ASYNC": {"async": 1.9, "await": 1.8, "promise": 1.6, "fetch": 1.4, "timeout": 1.4, "settimeout": 1.3},
    "DOM": {"dom": 2.0, "element": 1.4, "queryselector": 1.8, "event": 1.4, "click": 1.3, "listener": 1.5},
    "CSS": {"css": 2.0, "style": 1.5, "layout": 1.6, "responsive": 1.7, "media query": 1.6, "flexbox": 1.5, "grid": 1.5},
    "API": {"api": 2.0, "endpoint": 1.8, "request": 1.5, "response": 1.4},
    "ACCESSIBILITY": {"a11y": 2.3, "accessibility": 2.1, "aria": 1.8, "screen reader": 1.8, "keyboard": 1.5, "focus": 1.7, "tab": 1.3},
    "PERFORMANCE": {"performance": 2.2, "optimize": 1.7, "core web vitals": 2.4, "lazy load": 1.9, "cache": 1.5, "throttle": 1.5, "debounce": 1.5, "requestanimationframe": 1.8, "raf": 1.4},
    "OBSERVERS": {"observer": 2.1, "mutation": 1.8, "intersection": 1.8, "resize observer": 1.9, "shared_observers": 2.2, "sharedobservers": 2.2, "observer consolidation": 2.3},
    "SCHEDULING": {"requestidlecallback": 2.4, "queuemicrotask": 2.1, "idle callback": 2.2, "posttask": 2.1, "scheduling api": 2.0, "main thread blocking": 1.8},
    "THIRD_PARTY": {"third-party": 2.1, "third party": 2.1, "external library": 2.1, "library integration": 1.9, "script loading": 1.7, "finsweet": 2.2}
}
```

### Resource Router
```python
from pathlib import Path

def _assert_scope(path, skill_root):
    resolved = path.resolve()
    root = skill_root.resolve()
    if root not in resolved.parents and resolved != root:
        raise ValueError(f"Out-of-scope path blocked: {resolved}")


def discover_router_docs(skill_root):
    """Smart Router V2: recursive markdown discovery under this skill only."""
    docs = list((skill_root / "references").rglob("*.md"))
    docs.extend((skill_root / "assets").rglob("*.md"))
    for doc in docs:
        _assert_scope(doc, skill_root)
    return docs


def classify_intents(task_text):
    """Weighted intent scoring with ambiguity support (top-2)."""
    text = task_text.lower()
    scores = {intent: 0.0 for intent in TASK_SIGNALS}
    for intent, terms in TASK_SIGNALS.items():
        for term, weight in terms.items():
            if term in text:
                scores[intent] += weight

    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    best_intent, best_score = ranked[0]
    second_intent, second_score = ranked[1]
    if best_score == 0:
        return ["IMPLEMENTATION"], scores
    if (best_score - second_score) <= 0.7:
        return [best_intent, second_intent], scores
    return [best_intent], scores


def route_frontend_resources(task):
    skill_root = Path(".opencode/skill/workflows-code--web-dev")
    discover_router_docs(skill_root)

    if task.phase == "verification" or task.claiming_complete:
        return [
            "assets/checklists/verification_checklist.md",
            "references/verification/verification_workflows.md"
        ]

    if task.phase == "code_quality" or task.implementation_complete:
        resources = ["assets/checklists/code_quality_checklist.md"]
        if task.has_violations:
            resources.append("references/standards/code_style_enforcement.md")
        return resources

    if task.phase == "debugging":
        resources = [
            "assets/checklists/debugging_checklist.md",
            "references/debugging/debugging_workflows.md"
        ]
        if task.has_css_issues:
            resources.append("references/implementation/css_patterns.md")
        if task.has_carousel_issues or task.has_slider_issues:
            resources.append("references/implementation/swiper_patterns.md")
        if task.has_focus_issues or task.has_a11y_issues:
            resources.append("references/implementation/focus_management.md")
        return resources

    intents, scores = classify_intents(task.description)
    intent_to_resources = {
        "IMPLEMENTATION": ["references/implementation/implementation_workflows.md"],
        "ANIMATION": ["references/implementation/animation_workflows.md"],
        "FORMS": ["assets/patterns/validation_patterns.js"],
        "FORM_UPLOAD": ["references/implementation/form_upload_workflows.md"],
        "VIDEO": ["assets/integrations/hls_patterns.js"],
        "DEPLOYMENT": ["references/deployment/minification_guide.md", "references/deployment/cdn_deployment.md"],
        "ASYNC": ["assets/patterns/wait_patterns.js", "references/implementation/async_patterns.md"],
        "DOM": ["references/implementation/implementation_workflows.md"],
        "CSS": ["references/implementation/css_patterns.md"],
        "API": ["references/implementation/implementation_workflows.md"],
        "ACCESSIBILITY": ["references/implementation/focus_management.md"],
        "PERFORMANCE": ["references/implementation/performance_patterns.md"],
        "OBSERVERS": ["references/implementation/observer_patterns.md"],
        "SCHEDULING": ["references/implementation/async_patterns.md"],
        "THIRD_PARTY": ["references/implementation/third_party_integrations.md"]
    }

    selected = ["references/implementation/implementation_workflows.md"]  # ALWAYS for implementation
    for intent in intents:
        selected.extend(intent_to_resources.get(intent, []))

    # Optional explicit loads stay supported.
    if "lenis" in task.description.lower():
        selected.append("assets/integrations/lenis_patterns.js")
    if "hls" in task.description.lower():
        selected.append("assets/integrations/hls_patterns.js")

    return list(dict.fromkeys(selected))

# See "The Iron Law" in Section 1 - Phase 3: Verification
# See "Code Quality Gate" in Section 3 - Phase 1.5 for style enforcement
```

### Routing Authority

Smart Router V2 intent scoring and the resource map in this section are the authoritative routing source. Do not maintain separate use-case routing tables.

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

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

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

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

### ✅ Phase 3: Verification (MANDATORY)

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

<!-- /ANCHOR:rules -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

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

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 6. INTEGRATION POINTS

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
| **Motion.dev**                | Animation library (CDN: jsdelivr.net/npm/motion) |

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:external-resources -->
## 7. EXTERNAL RESOURCES

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

<!-- /ANCHOR:external-resources -->
<!-- ANCHOR:related-resources -->
## 8. RELATED RESOURCES

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

<!-- /ANCHOR:related-resources -->
<!-- ANCHOR:where-am-i-phase-detection -->
## 9. WHERE AM I? (Phase Detection)

| Phase                 | You're here if...                      | Exit criteria                      |
| --------------------- | -------------------------------------- | ---------------------------------- |
| **0: Research**       | Complex issue, unfamiliar codebase     | Constraints documented, plan ready |
| **1: Implementation** | Writing/modifying code                 | Code written, builds               |
| **1.5: Code Quality** | Implementation done, running checklist | All P0 items passing               |
| **2: Debugging**      | Code has bugs/failing tests            | All tests passing                  |
| **3: Verification**   | Tests pass, final validation           | Verified in browser                |

**Transitions:** 0→1 (plan ready) | 1→2 (bugs found) | 2→1 (missing code) | 2→3 (fixed) | 3→1/2 (issues found). Always end with Phase 3.

---

<!-- /ANCHOR:where-am-i-phase-detection -->
<!-- ANCHOR:quick-reference -->
## 10. QUICK REFERENCE

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
# Pattern: src="https://cdn.example.com/js/file.js?v=X.Y.Z"
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
# Minification workflow (scripts located in .opencode/skill/workflows-code--web-dev/scripts/)
node .opencode/skill/workflows-code--web-dev/scripts/minify-webflow.mjs          # Batch minify all JS
node .opencode/skill/workflows-code--web-dev/scripts/verify-minification.mjs     # AST verification
node .opencode/skill/workflows-code--web-dev/scripts/test-minified-runtime.mjs   # Runtime testing

# Single file minification
npx terser src/javascript/[folder]/[file].js --compress --mangle \
  -o src/javascript/z_minified/[folder]/[file].js

# CDN deployment (after minification)
wrangler r2 object put project-cdn/js/[file].min.js --file src/javascript/z_minified/[file].min.js

# Version check
grep -n "v=" src/html/global.html | head -5
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
<!-- /ANCHOR:quick-reference -->
