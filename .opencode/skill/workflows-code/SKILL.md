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

### Phase Detection
```
TASK CONTEXT
    │
    ├─► Writing new code / implementing feature
    │   └─► PHASE 1: Implementation
    │       └─► Load: implementation_workflows.md, animation_workflows.md, webflow_patterns.md
    │
    ├─► Code not working / debugging issues
    │   └─► PHASE 2: Debugging
    │       └─► Load: debugging_workflows.md
    │       └─► See: workflows-chrome-devtools skill for DevTools reference
    │
    ├─► Code complete / needs verification
    │   └─► PHASE 3: Verification (MANDATORY)
    │       └─► Load: verification_workflows.md
    │       └─► ⚠️ The Iron Law: NO COMPLETION CLAIMS WITHOUT BROWSER VERIFICATION
    │
    └─► Quick reference needed
        └─► Load: quick_reference.md
```

### Specific Use Case Router

**Phase 1: Implementation**

| Use Case                                                  | Route To                                                                                                                                |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Async/timing issues, DOM not ready, race conditions       | [implementation_workflows.md#2-⏱️-condition-based-waiting](./references/implementation_workflows.md#2-⏱️-condition-based-waiting)         |
| Form input, API calls, DOM manipulation validation        | [implementation_workflows.md#3-🛡️-defense-in-depth-validation](./references/implementation_workflows.md#3-🛡️-defense-in-depth-validation) |
| JavaScript minification, terser, verification             | [minification_guide.md](./references/minification_guide.md)                                                                             |
| CDN deployment, version management, Cloudflare R2         | [cdn_deployment.md](./references/cdn_deployment.md)                                                                                     |
| CSS vs Motion.dev, entrance animations, scroll triggers   | [animation_workflows.md](./references/animation_workflows.md)                                                                           |
| Webflow collection lists, platform limits, ID duplication | [webflow_patterns.md](./references/webflow_patterns.md)                                                                                 |
| Animation/video/asset optimization                        | [performance_patterns.md](./references/performance_patterns.md)                                                                         |
| XSS, CSRF, injection prevention                           | [security_patterns.md](./references/security_patterns.md)                                                                               |
| Third-party library integration, CDN loading, HLS.js      | [third_party_integrations.md](./references/third_party_integrations.md)                                                                 |
| MutationObserver, IntersectionObserver, DOM watching      | [observer_patterns.md](./references/observer_patterns.md)                                                                               |

**Phase 2: Debugging**

| Use Case                                               | Route To                                                                                                                      |
| ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Console errors, layout bugs, event handler failures    | [debugging_workflows.md#2-🔍-systematic-debugging](./references/debugging_workflows.md#2-🔍-systematic-debugging)               |
| Deep call stack, mysterious failures, corrupted data   | [debugging_workflows.md#3-🎯-root-cause-tracing](./references/debugging_workflows.md#3-🎯-root-cause-tracing)                   |
| Slow page, janky animations, memory leaks              | [debugging_workflows.md#4-🔍-performance-debugging](./references/debugging_workflows.md#4-🔍-performance-debugging)             |
| Collection list not rendering, event listeners failing | [webflow_patterns.md](./references/webflow_patterns.md)                                                                       |
| Motion.dev not loading, layout jumps, jank             | [animation_workflows.md#7-🐛-common-issues-and-solutions](./references/animation_workflows.md#7-🐛-common-issues-and-solutions) |

**Phase 3: Verification**

| Use Case                                             | Route To                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------- |
| Before claiming "works", "fixed", "done", "complete" | [verification_workflows.md](./references/verification_workflows.md) |
| Animation working, layout fixed, feature complete    | [verification_workflows.md](./references/verification_workflows.md) |
| Video/media loads, form submission works             | [verification_workflows.md](./references/verification_workflows.md) |

### Resource Router
```python
def route_frontend_resources(task):
    # ──────────────────────────────────────────────────────────────────
    # Phase 1: Implementation
    # Purpose: Phase 1: condition-based waiting, defense-in-depth validation
    # Key Insight: Load for async handling patterns and validation
    # ──────────────────────────────────────────────────────────────────
    if task.phase == "implementation":
        if task.has_async_loading:
            load("assets/wait_patterns.js")  # async waiting patterns
        if task.needs_validation:
            load("assets/validation_patterns.js")  # validation templates
        # ──────────────────────────────────────────────────────────────────
        # Minification & CDN Deployment
        # Purpose: Safe JS minification, verification, Cloudflare R2 upload
        # Key Insight: Load for deployment workflow
        # ──────────────────────────────────────────────────────────────────
        if task.needs_minification:
            return load("references/minification_guide.md")  # terser, verification
        if task.needs_cdn_deployment:
            return load("references/cdn_deployment.md")  # R2 upload, versioning
        # ──────────────────────────────────────────────────────────────────
        # Animation Workflows
        # Purpose: Phase 1: CSS vs Motion.dev decision tree, animation patterns, performance, testing
        # Key Insight: Load for animation implementation decisions
        # ──────────────────────────────────────────────────────────────────
        if task.has_animations:
            return load("references/animation_workflows.md")  # CSS vs Motion.dev
        # ──────────────────────────────────────────────────────────────────
        # Webflow Patterns
        # Purpose: Phase 1/2: Platform limits, collection list patterns, async rendering solutions
        # Key Insight: Load for Webflow-specific constraints
        # ──────────────────────────────────────────────────────────────────
        if task.webflow_specific:
            return load("references/webflow_patterns.md")  # platform limits
        # ──────────────────────────────────────────────────────────────────
        # Security Patterns
        # Purpose: Phase 1: OWASP Top 10 security checklist (XSS, CSRF, injection prevention)
        # Key Insight: Load for security validation
        # ──────────────────────────────────────────────────────────────────
        if task.security_concerns:
            return load("references/security_patterns.md")  # OWASP Top 10
        return load("references/implementation_workflows.md")  # general patterns

    # ──────────────────────────────────────────────────────────────────
    # Phase 2: Debugging
    # Purpose: Phase 2: systematic debugging, root cause tracing
    # Key Insight: Load for Phase 2 debugging workflows
    # ──────────────────────────────────────────────────────────────────
    if task.phase == "debugging":
        load("assets/debugging_checklist.md")  # step-by-step workflow
        # For DevTools reference, see workflows-chrome-devtools skill
        return load("references/debugging_workflows.md")  # root cause tracing

    # ──────────────────────────────────────────────────────────────────
    # Phase 3: Verification (MANDATORY)
    # Purpose: Phase 3: MANDATORY browser verification
    # Key Insight: Load for Phase 3 verification (always required)
    # ──────────────────────────────────────────────────────────────────
    if task.phase == "verification" or task.claiming_complete:
        load("assets/verification_checklist.md")  # mandatory steps
        return load("references/verification_workflows.md")  # browser testing

    # ──────────────────────────────────────────────────────────────────
    # Quick Reference
    # Purpose: One-page cheat sheet
    # Key Insight: Load for quick navigation and decision support
    # ──────────────────────────────────────────────────────────────────
    if task.needs_quick_reference:
        return load("references/quick_reference.md")  # one-page cheat sheet

# ══════════════════════════════════════════════════════════════════════
# STATIC RESOURCES (always available, not conditionally loaded)
# ══════════════════════════════════════════════════════════════════════
# references/code_quality_standards.md → Cross-phase: Naming, initialization, file structure standards
# references/shared_patterns.md → DevTools, logging, testing, error patterns
# references/performance_patterns.md → Phase 1: Performance optimization (animations, assets, requests)
# references/minification_guide.md → Safe JS minification with terser, verification pipeline
# references/cdn_deployment.md → Cloudflare R2 upload, version management, HTML updates

# See "The Iron Law" in Section 1 - Phase 3: Verification
```

---

## 3. 🛠️ HOW IT WORKS

### Development Lifecycle

Frontend development flows through 3 phases:

```
Implementation → Debugging (if issues) → Verification (MANDATORY)
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

See [implementation_workflows.md](./references/implementation_workflows.md) for complete workflows.


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

See [debugging_workflows.md](./references/debugging_workflows.md) for complete workflows.


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

See [verification_workflows.md](./references/verification_workflows.md) for complete requirements.


---

## 4. 📋 RULES

### Phase 1: Implementation

#### ✅ ALWAYS
- Wait for actual conditions, not arbitrary timeouts
- Include timeout limits (default 5-10 seconds)
- Validate function parameters (null/undefined/type checks)
- Validate API responses before using data
- Validate DOM elements exist before manipulating
- Sanitize user input before storing or displaying
- Run CDN version updater after ANY JavaScript modification
- Use optional chaining (`?.`) for nested access
- Add `try/catch` around risky operations
- Log when operations complete successfully

#### ❌ NEVER
- Use `setTimeout` without documenting WHY
- Wait without timeout (infinite loops)
- Assume data exists without checking
- Trust external data (APIs, user input, URL params)
- Access nested properties without validation
- Use innerHTML with unsanitized data
- Use the same CDN version number after making changes
- Deploy JS without updating HTML versions
- Skip validation failures silently

#### ⚠️ ESCALATE IF
- Condition never becomes true (infinite wait)
- Validation logic becoming too complex
- Security concerns with XSS or injection attacks
- Script reports no HTML files found
- CDN version cannot be determined

See [implementation_workflows.md](./references/implementation_workflows.md) for detailed rules.

### Phase 2: Debugging

#### ✅ ALWAYS
- Open browser DevTools console BEFORE attempting fixes
- Read complete error messages and stack traces
- Test across multiple viewports via Chrome DevTools emulation (375px, 768px, 1920px minimum)
- Test on mobile viewports (320px, 768px minimum)
- Check Network tab for failed resource loads
- Add console.log statements to trace execution
- Test one change at a time
- Use browser DevTools debugger for complex issues
- Add console.trace() to find call stack
- Trace backward from symptom to source
- Fix at the source, not symptom
- Document root cause in comments

#### ❌ NEVER
- Skip console error messages
- Test only in one browser
- Ignore mobile viewport issues
- Change multiple things simultaneously
- Use `!important` without understanding why
- Proceed with 4th fix without questioning approach
- Fix only where error appears without tracing
- Add symptom fixes (null checks without understanding why)
- Skip DevTools investigation
- Leave production console.log statements

#### ⚠️ ESCALATE IF
- Bug only occurs in production
- Issue requires changing Webflow-generated code
- Cross-browser compatibility cannot be achieved
- Bug intermittent despite extensive logging
- Cannot trace backward (dead end)
- Root cause in third-party library

See [debugging_workflows.md](./references/debugging_workflows.md) for detailed rules.

### Phase 3: Verification (MANDATORY)

#### ✅ ALWAYS
- Open actual browser to verify (not just code review)
- Test in Chrome at minimum (primary browser)
- Test mobile viewport (375px minimum)
- Check DevTools console for errors
- Test interactive elements by clicking them
- Watch full animation cycle to verify timing
- Test at key responsive breakpoints (320px, 768px, 1920px)
- Note what you tested in your claim
- Record any limitations

#### ❌ NEVER
- Claim "works" without opening browser
- Say "should work" or "probably works" - test it
- Trust code review alone for visual/interactive features
- Test only at one viewport size
- Ignore console warnings as "not important"
- Skip animation timing verification
- Assume desktop testing covers mobile
- Claim "cross-browser" without testing multiple browsers
- Express satisfaction before verification ("Great!", "Perfect!", "Done!")

#### ⚠️ ESCALATE IF
- Cannot test in required browsers
- Real device testing required but unavailable
- Issue only reproduces in production
- Performance testing requires specialized tools

See [verification_workflows.md](./references/verification_workflows.md) for detailed rules.

---

## 5. 🏆 SUCCESS CRITERIA

### Phase 1: Implementation

**Implementation is successful when:**
- ✅ No arbitrary setTimeout used (or documented why needed)
- ✅ All waits have timeout limits
- ✅ All function parameters validated
- ✅ All DOM queries check for null
- ✅ All API responses validated before use
- ✅ All user input sanitized
- ✅ CDN versions updated after JS changes
- ✅ Safe defaults provided for missing data
- ✅ Clear error messages logged
- ✅ Code handles edge cases gracefully

**Quality gates:**
- Can you explain what condition is being waited for?
- What happens if API returns null?
- What happens if DOM element doesn't exist?
- Did you run the CDN version updater?
- Are all code paths tested with invalid data?

See [implementation_workflows.md](./references/implementation_workflows.md) for complete criteria.

### Phase 2: Debugging

**Debugging is successful when:**
- ✅ Root cause identified and documented
- ✅ Fix addresses cause, not symptom
- ✅ Tested across all target browsers
- ✅ Tested on mobile and desktop viewports
- ✅ No console errors introduced
- ✅ Performance not degraded
- ✅ Code comments explain WHY fix needed
- ✅ Browser-specific workarounds documented
- ✅ Single fix resolved issue (not multiple attempts)

**Quality gates:**
- Did you open DevTools console?
- Did you read complete error messages?
- Did you test in multiple browsers?
- Did you test on mobile viewports?
- Can you explain WHY the fix works?
- Did you fix the root cause or just the symptom?

See [debugging_workflows.md](./references/debugging_workflows.md) for complete criteria.

### Phase 3: Verification

**Verification is successful when:**
- ✅ Opened actual browser (not just reviewed code)
- ✅ Tested in multiple viewports (mobile + desktop minimum)
- ✅ Checked DevTools console (no errors)
- ✅ Tested interactions by actually clicking/hovering
- ✅ Watched full animation cycle (if applicable)
- ✅ Tested in multiple browsers (if claiming cross-browser)
- ✅ Documented what was tested in claim
- ✅ Can describe exactly what was seen in browser
- ✅ Noted any limitations or remaining work

**Quality gates:**
- Can you describe what you saw in browser?
- Did you test at mobile viewport?
- Is DevTools console clear?
- Did you test the actual user interaction?
- Did you verify animation timing by watching it?
- Can you confidently say it works because you saw it work?

See [verification_workflows.md](./references/verification_workflows.md) for complete criteria.

---

## 6. 🔌 INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

### Code Quality Standards (INTEGRATED)

**Primary Reference:** [code_quality_standards.md](./references/code_quality_standards.md)

This workflow integrates three core knowledge base standards:

#### Naming Conventions
- **JavaScript:** `snake_case` for all identifiers (variables, functions, classes)
- **Constants:** `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`, `INIT_DELAY_MS`)
- **Semantic prefixes:** `is_`, `has_`, `get_`, `set_`, `handle_`, `init_`, `load_`
- **CSS:** `kebab-case` with BEM notation

**Full reference:** See [code_quality_standards.md](./references/code_quality_standards.md) Section 1

#### Initialization Pattern (CDN-Safe)
Every component uses standardized CDN-safe initialization:
- Guard flags prevent double initialization
- Delays ensure dependency readiness (Motion.dev, etc.)
- Webflow.push integration for proper lifecycle
- `INIT_DELAY_MS`: 0ms (no deps), 50ms (standard), 100ms+ (heavy deps)

**Full reference:** See [code_quality_standards.md](./references/code_quality_standards.md) Section 3

#### Animation Strategy
- **CSS first:** Simple transitions, hover states, single-property animations
- **Motion.dev:** Complex sequences, scroll triggers, in-view, stagger
- **Mandatory:** `prefers-reduced-motion` support, `will-change` cleanup
- **Easing:** `[0.22, 1, 0.36, 1]` (ease-out), `[0.16, 1, 0.3, 1]` (expo-out)

**Complete reference:** [animation_workflows.md](./references/animation_workflows.md) - Decision tree, implementation patterns, testing, debugging, and policy

#### Webflow Platform Constraints
Platform limits enforced by Webflow that affect architecture decisions:
- **Collection lists:** 100 items display limit per list, 40 lists per page
- **ID duplication:** Webflow duplicates IDs across collection items
- **Async rendering:** Collection items render after DOM ready
- **Event delegation:** Required for dynamic collection items
- **Production config:** Synchronous JS loading, per-page CSS scope

**Complete reference:** [webflow_patterns.md](./references/webflow_patterns.md) - Platform limits, collection list patterns, async rendering solutions, validation scripts, and constraints

**Quick Integration:** See Section 8 of [code_quality_standards.md](./references/code_quality_standards.md#8-✅-quick-reference-checklist) for the pre-deployment checklist covering naming, structure, initialization, animation, and comment standards.

### Tool Usage Guidelines

- **Bash**: Git commands, system operations
- **Read**: Examine code files, documentation
- **Grep**: Pattern searches, finding keywords
- **Glob**: File discovery by patterns

### Additional Knowledge Base Dependencies

- **Code Quality Standards** - Complete naming conventions and file structure in [code_quality_standards.md](./references/code_quality_standards.md)

### External Tools

- **Browser DevTools** - Chrome DevTools MCP (automated testing), Chrome DevTools (manual debugging)
- **Python 3** - General scripting support
- **Git** - Version control for checking changes
- **Motion.dev** - Animation library (CDN: jsdelivr.net/npm/motion@12.15.0)
- **mcp-narsil** - Security scanning during debugging (OWASP, CWE, taint analysis via Code Mode)

### Browser Verification Tools (Choose One)

**The workflows-code skill supports multiple browser verification approaches:**

**Option 1: Chrome DevTools MCP (Automated, IDE-based)**
- **Recommended for**: IDE users, MCP infrastructure available, multi-tool workflows
- **Tools**: mcp__chrome_devtools_1__*, mcp__chrome_devtools_2__* (26 tools each)
- **Benefits**: Type-safe, structured data, multi-agent concurrency
- **Integration**: Phase 2 (Debugging) + Phase 3 (Verification)
- **See**: [verification_workflows.md Section 2.5](./references/verification_workflows.md) for complete MCP tool reference and automation patterns

**Option 2: workflows-chrome-devtools (Browser debugging orchestrator - CLI priority, MCP fallback)**
- **Recommended for**: CLI users, no MCP setup, token efficiency priority
- **Tool**: browser-debugger-cli (bdg) via Bash execution
- **Benefits**: Self-documenting, Unix composability, minimal setup
- **Installation**: `npm install -g browser-debugger-cli@alpha`
- **Usage**: Direct CDP access via terminal (644 methods across 53 domains)
- **See**: .opencode/skill/workflows-chrome-devtools/SKILL.md (complete CLI skill reference)

**Option 3: Manual Browser Testing**
- **Recommended for**: Visual quality checks, accessibility testing, animation feel
- **Tools**: Chrome DevTools (manual), Firefox DevTools, Safari Web Inspector
- **Benefits**: Real perception, tactile feedback, cross-browser
- **See**: [verification_workflows.md Section 2](./references/verification_workflows.md) for The Gate Function

**Integration with Phase 3 (Verification):**

All three options satisfy "The Iron Law" browser verification requirement:
- Evidence before claims (manual observation OR automated data)
- Multi-viewport testing (1920px + 375px minimum)
- Console error checking (manual DevTools OR automated capture)
- Interaction verification (click, hover, scroll testing)

**Decision Tree:**
```
Need browser verification? → Choose approach:
├─ Automated + MCP infrastructure available → Chrome DevTools MCP (Option 1)
├─ Automated + terminal-first workflow → workflows-chrome-devtools (Option 2)
└─ Visual quality / accessibility focus → Manual browser (Option 3)
```

**See Also:**
- [debugging_workflows.md](./references/debugging_workflows.md) - Debugging examples (MCP + CLI)
- [verification_workflows.md](./references/verification_workflows.md) - Verification workflows (Section 2.5: MCP + CLI options)
- [shared_patterns.md](./references/shared_patterns.md) - Automation patterns (MCP + CLI)

### Quality Review Integration

> **Note:** Review quality manually after file modifications.

**Manual quality review steps:**
- Review recent file changes for quality issues
- Check for consistent patterns across modifications
- Use as inputs to Phase 1 investigation during debugging

See [shared_patterns.md](./references/shared_patterns.md) for common patterns across all workflows.

---

## 7. 📦 REFERENCES

### Core References
| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [implementation_workflows.md](references/implementation_workflows.md) | Async patterns, validation | Condition-based waiting |
| [debugging_workflows.md](references/debugging_workflows.md) | Systematic debugging | Root cause tracing |
| [verification_workflows.md](references/verification_workflows.md) | Browser testing | The Iron Law |
| [animation_workflows.md](references/animation_workflows.md) | Motion.dev, Lenis, GSAP | Library loading patterns |
| [minification_guide.md](references/minification_guide.md) | Safe JS minification | AST verification |
| [cdn_deployment.md](references/cdn_deployment.md) | R2/CDN uploads | Version management |
| [quick_reference.md](references/quick_reference.md) | Command cheat sheet | Common patterns |

### Standards & Patterns
| Document | Purpose | Key Insight |
|----------|---------|-------------|
| [code_quality_standards.md](references/code_quality_standards.md) | Naming, structure | Webflow conventions |
| [webflow_patterns.md](references/webflow_patterns.md) | Webflow-specific code | Attribute selectors |
| [performance_patterns.md](references/performance_patterns.md) | Optimization | Lazy loading, caching |
| [security_patterns.md](references/security_patterns.md) | XSS prevention | Input sanitization |
| [shared_patterns.md](references/shared_patterns.md) | Reusable utilities | Observer patterns |
| [third_party_integrations.md](references/third_party_integrations.md) | HLS, Lenis, etc. | Library loading |
| [observer_patterns.md](references/observer_patterns.md) | Intersection/Mutation | Performance observers |

### Assets
| Asset | Purpose | Usage |
|-------|---------|-------|
| [wait_patterns.js](assets/wait_patterns.js) | Element/library waiting | Copy for async loading |
| [validation_patterns.js](assets/validation_patterns.js) | Form validation | Defense-in-depth |
| [hls_patterns.js](assets/hls_patterns.js) | HLS.js streaming | Video implementation |
| [lenis_patterns.js](assets/lenis_patterns.js) | Smooth scroll | Lenis integration |
| [verification_checklist.md](assets/verification_checklist.md) | Pre-deploy checks | QA workflow |
| [debugging_checklist.md](assets/debugging_checklist.md) | Debug process | Issue tracking |

---

## 8. 🧭 WHERE AM I? (Phase Detection Helper)

If you're unsure which phase you're in, use this self-assessment:

### Phase 1: Implementation

**You're here if:**
- [ ] Writing new code or modifying existing code
- [ ] Running builds and fixing compilation errors
- [ ] Implementing feature requirements
- [ ] Not yet testing or verifying

**Exit criteria:** All code written, builds successfully

### Phase 2: Debugging

**You're here if:**
- [ ] Code written but has bugs or failing tests
- [ ] Investigating root causes of failures
- [ ] Fixing logic errors or edge cases
- [ ] Not yet fully functional

**Exit criteria:** All tests passing, feature functional

### Phase 3: Verification

**You're here if:**
- [ ] All tests passing, feature appears complete
- [ ] Performing final validation in browser/environment
- [ ] Checking edge cases and user experience
- [ ] Ready to mark as complete

**Exit criteria:** Verified in real environment, ready to ship

### Troubleshooting: Phase Confusion

**"I'm fixing bugs while implementing"** → Stay in Phase 1, treat bugs as part of implementation

**"Tests pass but feature incomplete"** → Return to Phase 1, more implementation needed

**"Feature works but tests fail"** → Phase 2, debug test failures

### Phase Transitions

Understanding when and how to move between phases:

| Transition            | Trigger                                               | Action                                          |
| --------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| **Phase 1 → Phase 2** | Implementation reveals unexpected behavior or bugs    | Stop implementing, switch to debugging workflow |
| **Phase 2 → Phase 1** | Debugging reveals missing implementation              | Return to implementation to add missing code    |
| **Phase 2 → Phase 3** | All identified bugs are fixed                         | Proceed to browser verification                 |
| **Phase 3 → Phase 1** | Verification reveals new requirements                 | Return to implementation for additional work    |
| **Phase 3 → Phase 2** | Verification reveals bugs not caught during debugging | Return to debugging workflow                    |

**Key principle:** Phases are not strictly linear. Move freely between phases as needed, but always end with Phase 3 (Verification) before claiming completion.

---

## 9. 🔗 RELATED RESOURCES

### For Implementation

1. **Read**: This SKILL.md Section 1 (When to Use), Section 4 (How It Works), Section 5 (Rules), Section 6 (Success Criteria)
2. **Navigate**: [implementation_workflows.md](./references/implementation_workflows.md)
3. **Use Templates**: [wait_patterns.js](./assets/wait_patterns.js), [validation_patterns.js](./assets/validation_patterns.js)

### For Debugging

1. **Read**: This SKILL.md Section 1 (When to Use), Section 4 (How It Works), Section 5 (Rules), Section 6 (Success Criteria)
2. **Navigate**: [debugging_workflows.md](./references/debugging_workflows.md)
3. **Use Checklist**: [debugging_checklist.md](./assets/debugging_checklist.md)
4. **DevTools**: See workflows-chrome-devtools skill for Chrome DevTools reference

### For Verification

1. **Read**: This SKILL.md Section 1 (When to Use), Section 4 (How It Works), Section 5 (Rules), Section 6 (Success Criteria)
2. **Navigate**: [verification_workflows.md](./references/verification_workflows.md)
3. **Use Checklist**: [verification_checklist.md](./assets/verification_checklist.md)

### Quick Reference

Need fast navigation? See [quick_reference.md](./references/quick_reference.md)

---

**Remember**: This skill orchestrates the complete development lifecycle - Implementation, Debugging, and Verification. All phases integrate to ensure reliable, high-quality frontend code.