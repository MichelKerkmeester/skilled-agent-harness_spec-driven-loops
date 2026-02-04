---
name: workflows-code--full-stack
description: "Stack-agnostic development orchestrator guiding developers through implementation, debugging, and verification phases with automatic stack detection via marker files and bundled stack-specific knowledge."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.0.0
---

<!-- Keywords: workflows-code, development-orchestrator, multi-stack, stack-detection, debugging-workflow, implementation-patterns, react, nextjs, react-native, swift, go, nodejs -->

# Code Workflows - Stack-Agnostic Development Orchestrator

Unified workflow guidance for any technology stack: Go, React, React Native, Swift, Node.js, and more.

**Core Principle**: Implementation → Debugging (if needed) → Verification (MANDATORY) = reliable, production-ready code.

---

## 1. 🎯 WHEN TO USE

### Activation Triggers

**Use this skill when:**
- Starting development work (any stack)
- Implementing features, APIs, components, services
- Encountering errors or unexpected behavior
- Before ANY completion claim ("works", "fixed", "done", "complete")

**Keyword triggers:**
- Implementation: "implement", "build", "create", "add feature", "service", "component"
- Debugging: "debug", "fix", "error", "not working", "broken", "issue", "bug"
- Verification: "done", "complete", "works", "fixed", "finished", "verify", "test"

### When NOT to Use

- Documentation-only changes → use workflows-documentation
- Git/version control → use workflows-git
- Infrastructure/DevOps → use specialized DevOps skills

### Phase Overview

| Phase                       | Purpose                                           | Trigger                               |
| --------------------------- | ------------------------------------------------- | ------------------------------------- |
| **Phase 1: Implementation** | Writing code following stack-specific patterns    | Starting new code, modifying existing |
| **Phase 2: Debugging**      | Fixing issues systematically, root cause analysis | Test failures, errors                 |
| **Phase 3: Verification**   | Final validation before completion claims         | Before ANY "done" claim               |

**The Iron Law**: NO COMPLETION CLAIMS WITHOUT RUNNING VERIFICATION FOR YOUR STACK

---

## 2. 🧭 SMART ROUTING

### Stack Detection (Marker File Based)

```bash
# Detection order (first match wins)
[ -f "go.mod" ] && STACK="GO"
[ -f "Package.swift" ] && STACK="SWIFT"
[ -f "app.json" ] && grep -q "expo" app.json && STACK="REACT_NATIVE"
[ -f "package.json" ] && grep -q "react-native" package.json && STACK="REACT_NATIVE"
[ -f "next.config.js" ] || [ -f "next.config.mjs" ] && STACK="REACT"
[ -f "package.json" ] && grep -q '"react"' package.json && STACK="REACT"
[ -f "package.json" ] && grep -q '"express"\|"fastify"' package.json && STACK="NODEJS"
```

### Stack-to-Folder Mapping

| Stack        | Category | References                        | Assets                        |
| ------------ | -------- | --------------------------------- | ----------------------------- |
| GO           | backend  | `references/backend/go/`          | `assets/backend/go/`          |
| NODEJS       | backend  | `references/backend/nodejs/`      | `assets/backend/nodejs/`      |
| REACT        | frontend | `references/frontend/react/`      | `assets/frontend/react/`      |
| REACT_NATIVE | mobile   | `references/mobile/react-native/` | `assets/mobile/react-native/` |
| SWIFT        | mobile   | `references/mobile/swift/`        | `assets/mobile/swift/`        |

### Task Classification & Load Levels

```python
# Task keywords for intelligent routing
TASK_KEYWORDS = {
    "VERIFICATION": ["done", "complete", "works", "verify", "finished", "check"],
    "DEBUGGING": ["bug", "fix", "error", "broken", "issue", "failing", "crash"],
    "TESTING": ["test", "mock", "coverage", "spec", "unit", "integration"],
    "DATABASE": ["database", "query", "GORM", "SQL", "migration", "model", "schema"],
    "API": ["API", "endpoint", "handler", "HTTP", "route", "REST", "request"],
    "DEPLOYMENT": ["deploy", "release", "production", "kubernetes", "docker"],
    "IMPLEMENTATION": ["implement", "create", "add", "build", "feature", "new"]
}

# Load level determines how many resources to load
LOAD_LEVELS = {
    "VERIFICATION": "MINIMAL",      # Just verification checklist
    "DEBUGGING": "DEBUGGING",       # Stack refs + debugging checklist
    "TESTING": "FOCUSED",           # Stack refs filtered by "test" keywords
    "DATABASE": "FOCUSED",          # Stack refs filtered by "database" keywords
    "API": "FOCUSED",               # Stack refs filtered by "api" keywords
    "DEPLOYMENT": "FOCUSED",        # Stack refs filtered by deployment keywords
    "IMPLEMENTATION": "STANDARD"    # All stack refs + patterns
}

STACK_FOLDERS = {
    "GO": ("backend", "go"),
    "NODEJS": ("backend", "nodejs"),
    "REACT": ("frontend", "react"),
    "REACT_NATIVE": ("mobile", "react-native"),
    "SWIFT": ("mobile", "swift")
}

def classify_task(user_request):
    """Classify task type based on keywords in request."""
    request_lower = user_request.lower()
    for task_type, keywords in TASK_KEYWORDS.items():
        if any(kw.lower() in request_lower for kw in keywords):
            return task_type
    return "IMPLEMENTATION"

def route_resources(user_request, stack):
    """Route to appropriate resources based on task type and stack."""
    category, folder = STACK_FOLDERS[stack]
    task_type = classify_task(user_request)
    load_level = LOAD_LEVELS[task_type]

    # MINIMAL: Verification only
    if load_level == "MINIMAL":
        return [f"assets/{category}/{folder}/checklists/verification_checklist.md"]

    # DEBUGGING: Stack refs + debugging checklist
    if load_level == "DEBUGGING":
        return [
            f"assets/{category}/{folder}/checklists/debugging_checklist.md",
            f"references/{category}/{folder}/*testing*.md"
        ]

    # FOCUSED: Filter refs by task keywords (database, api, test, deploy)
    if load_level == "FOCUSED":
        keywords = TASK_KEYWORDS.get(task_type, [])
        return [
            f"references/{category}/{folder}/*_standards.md",  # Always load standards
            f"references/{category}/{folder}/*{keywords[0].lower()}*.md"  # Filter by domain
        ]

    # STANDARD: All stack refs + patterns (default for IMPLEMENTATION)
    return [
        f"references/{category}/{folder}/*.md",
        f"assets/{category}/{folder}/checklists/code_quality_checklist.md",
        f"assets/{category}/{folder}/patterns/*.*"
    ]
```

### Phase Detection Flow

```
TASK CONTEXT
    │
    ├─► STEP 0: Detect Stack (from marker files)
    │   └─► Load: references/{category}/{stack}/*.md
    │
    ├─► PHASE 1: Implementation
    │   └─► Load: *standards*.md, patterns/*.*
    │
    ├─► PHASE 2: Debugging
    │   └─► Load: debugging_checklist.md, *testing*.md
    │
    └─► PHASE 3: Verification (MANDATORY)
        └─► Load: verification_checklist.md
        └─► Run: stack-specific test commands
```

### Stack Resources Pattern

All stacks follow the same structure:

| Resource Type       | Path Pattern                                                     | Load Level   |
| ------------------- | ---------------------------------------------------------------- | ------------ |
| Standards           | `references/{category}/{stack}/*_standards.md`                   | ALWAYS       |
| Domain/Architecture | `references/{category}/{stack}/*.md`                             | CONDITIONAL  |
| Code Quality Check  | `assets/{category}/{stack}/checklists/code_quality_checklist.md` | ALWAYS       |
| Debugging Check     | `assets/{category}/{stack}/checklists/debugging_checklist.md`    | DEBUGGING    |
| Verification Check  | `assets/{category}/{stack}/checklists/verification_checklist.md` | VERIFICATION |
| Code Patterns       | `assets/{category}/{stack}/patterns/*.*`                         | CONDITIONAL  |

---

## 3. 🛠️ HOW IT WORKS

### Development Lifecycle

```
Implementation → Debugging (if issues) → Verification (MANDATORY)
```

### Phase 1: Implementation (Stack-Specific)

**Common Stack Patterns:**

| Stack        | Key Patterns                                      | Naming                                   |
| ------------ | ------------------------------------------------- | ---------------------------------------- |
| Go           | Domain layers, DI, generics, table-driven tests   | `snake_case` files, `PascalCase` exports |
| Node.js      | Express middleware, async/await, service patterns | `camelCase` everywhere                   |
| React        | Hooks, component composition, data fetching       | `kebab-case` files, `PascalCase` classes |
| React Native | Hooks extraction, responsive scaling, navigation  | `kebab-case` files, `PascalCase` classes |
| Swift        | MVVM, SwiftUI views, async/await, Combine         | `PascalCase` types, `camelCase` members  |

**Code Quality Gate (Before claiming implementation complete):**

1. Detect stack via marker files
2. Load `assets/{category}/{stack}/checklists/code_quality_checklist.md`
3. Validate P0 items (MUST fix), P1 items (fix or document deferral)
4. **Gate Rule**: If ANY P0 item fails, completion is BLOCKED

### Phase 2: Debugging

**Systematic Debugging** (Universal):

1. **Root Cause Investigation** - Read errors, reproduce, check `git diff`, trace data flow
2. **Pattern Analysis** - Find working examples, compare against stack patterns
3. **Hypothesis Testing** - Single hypothesis, one change at a time, if 3+ fixes failed → question approach
4. **Implementation** - Document fix, implement, run verification

**Stack-Specific Testing:**

| Stack        | Test Command    | Coverage         | Lint                |
| ------------ | --------------- | ---------------- | ------------------- |
| Go           | `go test ./...` | `go test -cover` | `golangci-lint run` |
| Node.js      | `npm test`      | Jest coverage    | ESLint              |
| React        | `npm test`      | Jest coverage    | ESLint              |
| React Native | `npm test`      | Jest coverage    | ESLint              |
| Swift        | `swift test`    | Xcode coverage   | SwiftLint           |

### Phase 3: Verification (MANDATORY)

**The Gate Function** - BEFORE claiming any status:

1. **IDENTIFY:** What command proves this claim?
2. **RUN:** Execute verification command
3. **VERIFY:** All tests pass? Linting clean?
4. **RECORD:** Note what you verified
5. **ONLY THEN:** Make the claim

**Stack-Specific Verification:**

| Stack          | Test Command    | Lint Command        | Build Command     |
| -------------- | --------------- | ------------------- | ----------------- |
| `GO`           | `go test ./...` | `golangci-lint run` | `go build ./...`  |
| `NODEJS`       | `npm test`      | `npx eslint .`      | `npm run build`   |
| `REACT`        | `npm test`      | `npx eslint .`      | `npm run build`   |
| `REACT_NATIVE` | `npm test`      | `npx eslint .`      | `npx expo export` |
| `SWIFT`        | `swift test`    | `swiftlint`         | `swift build`     |

---

## 4. 📋 RULES

### Universal Rules (All Stacks)

#### ✅ ALWAYS
- Validate all inputs at function boundaries
- Handle errors with meaningful messages
- Add tests for new functionality
- Run verification before claiming complete

#### ❌ NEVER
- Skip input validation
- Catch and swallow errors silently
- Change multiple things simultaneously when debugging
- Claim "works" without running tests

#### ⚠️ ESCALATE IF
- Bug only occurs in production
- Root cause in third-party dependency
- Cannot reproduce consistently

### Go-Specific

| ✅ ALWAYS                             | ❌ NEVER                                       |
| ------------------------------------ | --------------------------------------------- |
| Use `context.Context` as first param | Ignore errors (use `_` only when intentional) |
| Return errors as last return value   | Use `panic` for normal error handling         |
| Use `defer` for cleanup              | Share memory without synchronization          |
| Use table-driven tests               | Use global mutable state                      |

### Swift-Specific

| ✅ ALWAYS                                  | ❌ NEVER                                  |
| ----------------------------------------- | ---------------------------------------- |
| Use `guard let` or `if let` for optionals | Force unwrap (`!`) without proven safety |
| Use `weak self` in closures               | Block main thread with sync operations   |
| Use `@MainActor` for UI updates           | Use `try!` without handling errors       |

### React / Next.js Specific

| ✅ ALWAYS                             | ❌ NEVER                              |
| ------------------------------------ | ------------------------------------ |
| Use hooks at top level of components | Mutate state directly                |
| Include all deps in useEffect arrays | Use `any` type without justification |
| Handle loading and error states      | Skip key prop in lists               |

### React Native / Expo Specific

| ✅ ALWAYS                                        | ❌ NEVER                                   |
| ----------------------------------------------- | ----------------------------------------- |
| Use `FlatList` for long lists                   | Use inline styles for repeated components |
| Handle platform-specific with `Platform.select` | Skip testing on physical devices          |
| Test on both iOS and Android                    | Use synchronous storage for large data    |

### Node.js Specific

| ✅ ALWAYS                             | ❌ NEVER                               |
| ------------------------------------ | ------------------------------------- |
| Use async/await over callbacks       | Block event loop with sync operations |
| Validate all API inputs              | Store secrets in code                 |
| Use environment variables for config | Trust client data without validation  |

### Debugging Rules

| ✅ ALWAYS                     | ❌ NEVER                                           |
| ---------------------------- | ------------------------------------------------- |
| Read complete error messages | Skip error messages                               |
| Test one change at a time    | Change multiple things simultaneously             |
| Trace backward to root cause | Fix symptoms without understanding cause          |
| Document root cause          | Proceed with 4th fix without questioning approach |

### Verification Rules

| ✅ ALWAYS                           | ❌ NEVER                               |
| ---------------------------------- | ------------------------------------- |
| Run tests before claiming complete | Claim "works" without running tests   |
| Note what you verified             | Say "should work" - prove it          |
| Check for errors in output         | Skip verification for "small changes" |

---

## 5. 🏆 SUCCESS CRITERIA

### Phase Completion Checklists

| Phase          | Checklist Path                                              | Key Criteria                         |
| -------------- | ----------------------------------------------------------- | ------------------------------------ |
| Implementation | `assets/{cat}/{stack}/checklists/code_quality_checklist.md` | Stack conventions, P0 items pass     |
| Debugging      | `assets/{cat}/{stack}/checklists/debugging_checklist.md`    | Root cause documented, fix at source |
| Verification   | `assets/{cat}/{stack}/checklists/verification_checklist.md` | Tests pass, verified in environment  |

### Stack-Specific Success Criteria

| Stack          | Test Coverage | Lint Clean | Build Success | Environment Verified |
| -------------- | ------------- | ---------- | ------------- | -------------------- |
| `GO`           | 80%+          | Required   | Required      | `go test -race`      |
| `NODEJS`       | 80%+          | Required   | Required      | API Tests            |
| `REACT`        | 70%+          | Required   | Required      | Browser (multi-VP)   |
| `REACT_NATIVE` | 70%+          | Required   | Required      | Device/Simulator     |
| `SWIFT`        | 70%+          | Required   | Required      | Device/Simulator     |

### Performance Targets

**Web:** FCP < 1.8s, LCP < 2.5s, TTI < 3.8s, CLS < 0.1, FPS 60fps, Errors 0
**Mobile:** App Launch < 2s, Memory (no leaks), FPS 60fps

---

## 6. 🔌 INTEGRATION POINTS

### Framework Integration

- **Gate 2**: Skill routing via `skill_advisor.py`
- **Memory**: Context preserved via Spec Kit Memory MCP

### Knowledge Base Structure

```
workflows-code--full-stack/
├── references/{category}/{stack}/*.md    # Reference docs per stack
├── assets/{category}/{stack}/checklists/ # Code quality, debugging, verification
├── assets/{category}/{stack}/patterns/   # Code templates
└── SKILL.md
```

### External Tools

| Tool                          | Purpose                               |
| ----------------------------- | ------------------------------------- |
| **workflows-chrome-devtools** | Browser debugging (CLI-first via bdg) |
| **mcp-narsil**                | Security scanning (OWASP, CWE)        |

---

## 7. 📚 EXTERNAL RESOURCES

| Stack        | Documentation           |
| ------------ | ----------------------- |
| Go           | go.dev/doc              |
| Node.js      | nodejs.org/docs         |
| React        | react.dev               |
| Next.js      | nextjs.org/docs         |
| React Native | reactnative.dev         |
| Expo         | docs.expo.dev           |
| Swift        | swift.org/documentation |

---

## 8. 🔗 RELATED SKILLS

| Skill                         | Use For                              |
| ----------------------------- | ------------------------------------ |
| **workflows-documentation**   | Documentation, skill creation        |
| **workflows-git**             | Git workflows, commit hygiene        |
| **system-spec-kit**           | Spec folder management, memory       |
| **mcp-narsil**                | Code intelligence, security scanning |
| **workflows-chrome-devtools** | Browser debugging, screenshots       |

### Navigation Guide

**Implementation:** Detect stack → Load `*_standards.md` → Load `code_quality_checklist.md`
**Debugging:** Load `debugging_checklist.md` → Load `*testing*.md` → Follow 4-step debug
**Verification:** Load `verification_checklist.md` → Run test/lint/build → Claim done

---

## 9. 📍 WHERE AM I?

| Phase                 | You're here if...            | Exit criteria              |
| --------------------- | ---------------------------- | -------------------------- |
| **1: Implementation** | Writing/modifying code       | Code builds, P0 items pass |
| **2: Debugging**      | Code has bugs/failing tests  | All tests passing          |
| **3: Verification**   | Tests pass, final validation | Verified, ready to ship    |

**Transitions:** 1→2 (bugs found) | 2→1 (missing code) | 2→3 (fixed) | 3→1/2 (issues found)
**Key principle:** Always end with Phase 3 before claiming completion.

---

## 10. 🏎️ QUICK REFERENCE

### Universal Workflow

1. **Detect Stack** → Check marker files (`go.mod`, `Package.swift`, `app.json`, `package.json`)
2. **Load Resources** → `references/{category}/{stack}/` + `assets/{category}/{stack}/`
3. **Execute** → Follow phase-specific patterns
4. **Verify** → Use verification checklist before claiming completion

### Stack Commands Quick Reference

| Stack        | Test            | Lint                | Build             |
| ------------ | --------------- | ------------------- | ----------------- |
| GO           | `go test ./...` | `golangci-lint run` | `go build ./...`  |
| NODEJS       | `npm test`      | `npx eslint .`      | `npm run build`   |
| REACT        | `npm test`      | `npx eslint .`      | `npm run build`   |
| REACT_NATIVE | `npm test`      | `npx eslint .`      | `npx expo export` |
| SWIFT        | `swift test`    | `swiftlint`         | `swift build`     |

### Resource Paths

| Stack        | Standards                                                  | Checklists                               |
| ------------ | ---------------------------------------------------------- | ---------------------------------------- |
| GO           | `references/backend/go/go_standards.md`                    | `assets/backend/go/checklists/`          |
| NODEJS       | `references/backend/nodejs/nodejs_standards.md`            | `assets/backend/nodejs/checklists/`      |
| REACT        | `references/frontend/react/react_nextjs_standards.md`      | `assets/frontend/react/checklists/`      |
| REACT_NATIVE | `references/mobile/react-native/react-native-standards.md` | `assets/mobile/react-native/checklists/` |
| SWIFT        | `references/mobile/swift/swift_standards.md`               | `assets/mobile/swift/checklists/`        |

### Success Checklist (Quick)

```
[ ] Stack detected via marker file
[ ] Standards loaded for stack
[ ] Code quality P0 items passing
[ ] Stack test command run and passing
[ ] Lint command passing
[ ] Build succeeds
[ ] Documented what was verified
```

---

## 11. 📁 DIRECTORY STRUCTURE

```
workflows-code--full-stack/
├── SKILL.md
├── references/
│   ├── backend/go/           # go_standards.md, api_design.md, database_patterns.md, ...
│   ├── backend/nodejs/       # nodejs_standards.md, express_patterns.md, ...
│   ├── frontend/react/       # react_nextjs_standards.md, state_management.md, ...
│   └── mobile/
│       ├── react-native/     # react-native-standards.md, navigation-patterns.md, ...
│       └── swift/            # swift_standards.md, swiftui_patterns.md, ...
└── assets/
    ├── backend/go/           # checklists/ + patterns/
    ├── backend/nodejs/       # checklists/ + patterns/
    ├── frontend/react/       # checklists/ + patterns/
    └── mobile/
        ├── react-native/     # checklists/ + patterns/
        └── swift/            # checklists/ + patterns/
```

### Adding New Stack

1. Create `references/{category}/{stack}/` with `{stack}_standards.md`
2. Create `assets/{category}/{stack}/checklists/` (code_quality, debugging, verification)
3. Create `assets/{category}/{stack}/patterns/`
4. Add detection logic to Section 2
5. Add to STACK_FOLDERS mapping
6. Add rules to Section 4
