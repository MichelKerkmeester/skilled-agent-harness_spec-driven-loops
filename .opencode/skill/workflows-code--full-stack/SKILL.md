---
name: workflows-code--full-stack
description: "Stack-agnostic development orchestrator guiding developers through implementation, debugging, and verification phases with automatic stack detection via marker files and bundled stack-specific knowledge."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.0.1.0
---

<!-- Keywords: workflows-code, development-orchestrator, multi-stack, stack-detection, debugging-workflow, implementation-patterns, react, nextjs, react-native, swift, go, nodejs -->

# Code Workflows - Stack-Agnostic Development Orchestrator

Unified workflow guidance for any technology stack: Go, React, React Native, Swift, Node.js, and more.

**Core Principle**: Implementation → Debugging (if needed) → Verification (MANDATORY) = reliable, production-ready code.

---

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

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

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Stack Detection (Marker File Based)

```python
def detect_stack(workspace_files, package_json_text="", app_json_text=""):
    """Smart Router V2 stack detection with deterministic priority."""
    if "go.mod" in workspace_files:
        return "GO"
    if "Package.swift" in workspace_files:
        return "SWIFT"
    if "app.json" in workspace_files and "expo" in app_json_text.lower():
        return "REACT_NATIVE"
    if "package.json" in workspace_files and "react-native" in package_json_text.lower():
        return "REACT_NATIVE"
    if "next.config.js" in workspace_files or "next.config.mjs" in workspace_files:
        return "REACT"
    if "package.json" in workspace_files and '"react"' in package_json_text:
        return "REACT"
    if "package.json" in workspace_files and ('"express"' in package_json_text or '"fastify"' in package_json_text):
        return "NODEJS"
    return "NODEJS"  # Safe backend default
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
from pathlib import Path

TASK_SIGNALS = {
    "VERIFICATION": {
        "done": 2.2, "complete": 2.0, "works": 1.8, "verify": 2.4, "finished": 1.8, "test": 1.4
    },
    "DEBUGGING": {
        "bug": 2.4, "fix": 2.1, "error": 2.4, "broken": 2.0, "issue": 1.6, "failing": 2.0, "crash": 2.6
    },
    "TESTING": {
        "test": 2.1, "mock": 1.6, "coverage": 2.0, "spec": 1.4, "unit": 1.7, "integration": 1.9
    },
    "DATABASE": {
        "database": 2.2, "query": 1.8, "gorm": 2.2, "sql": 2.1, "migration": 2.0, "model": 1.5, "schema": 1.8
    },
    "API": {
        "api": 2.0, "endpoint": 2.0, "handler": 1.8, "http": 1.6, "route": 1.7, "rest": 1.5, "request": 1.3
    },
    "DEPLOYMENT": {
        "deploy": 2.3, "release": 2.0, "production": 1.9, "kubernetes": 2.1, "docker": 2.1
    },
    "IMPLEMENTATION": {
        "implement": 2.1, "create": 1.7, "add": 1.3, "build": 1.8, "feature": 1.6, "new": 1.0
    }
}

LOAD_LEVELS = {
    "VERIFICATION": "MINIMAL",
    "DEBUGGING": "DEBUGGING",
    "TESTING": "FOCUSED",
    "DATABASE": "FOCUSED",
    "API": "FOCUSED",
    "DEPLOYMENT": "FOCUSED",
    "IMPLEMENTATION": "STANDARD"
}

STACK_FOLDERS = {
    "GO": ("backend", "go"),
    "NODEJS": ("backend", "nodejs"),
    "REACT": ("frontend", "react"),
    "REACT_NATIVE": ("mobile", "react-native"),
    "SWIFT": ("mobile", "swift")
}

def _assert_scope(path, skill_root):
    """Scope guard: all discovery stays inside current skill folder."""
    resolved = path.resolve()
    root = skill_root.resolve()
    if root not in resolved.parents and resolved != root:
        raise ValueError(f"Out-of-scope path blocked: {resolved}")


def discover_markdown_files(skill_root):
    """Recursive discovery for references/assets markdown files only."""
    refs = list((skill_root / "references").rglob("*.md"))
    assets = list((skill_root / "assets").rglob("*.md"))
    discovered = refs + assets
    for file_path in discovered:
        _assert_scope(file_path, skill_root)
    return discovered


def score_intents(user_request):
    """Weighted intent scoring (Smart Router V2)."""
    text = user_request.lower()
    scores = {intent: 0.0 for intent in TASK_SIGNALS}
    for intent, weighted_terms in TASK_SIGNALS.items():
        for term, weight in weighted_terms.items():
            if term in text:
                scores[intent] += weight
    ranked = sorted(scores.items(), key=lambda item: item[1], reverse=True)
    best_intent, best_score = ranked[0]
    second_intent, second_score = ranked[1]
    if best_score == 0:
        return ["IMPLEMENTATION"], scores
    if (best_score - second_score) <= 0.6:
        return [best_intent, second_intent], scores
    return [best_intent], scores


def route_resources(user_request, stack, skill_root):
    """Route stack resources with stack-prioritized filtering and ambiguity handling."""
    discover_markdown_files(skill_root)
    category, folder = STACK_FOLDERS[stack]
    candidate_intents, _ = score_intents(user_request)

    selected = []
    for task_type in candidate_intents:
        load_level = LOAD_LEVELS[task_type]

        if load_level == "MINIMAL":
            selected.append(f"assets/{category}/{folder}/checklists/verification_checklist.md")
            continue

        if load_level == "DEBUGGING":
            selected.extend([
                f"assets/{category}/{folder}/checklists/debugging_checklist.md",
                f"references/{category}/{folder}/*testing*.md"
            ])
            continue

        if load_level == "FOCUSED":
            selected.extend([
                f"references/{category}/{folder}/*_standards.md",
                f"references/{category}/{folder}/*{task_type.lower()}*.md"
            ])
            continue

        selected.extend([
            f"references/{category}/{folder}/*.md",
            f"assets/{category}/{folder}/checklists/code_quality_checklist.md",
            f"assets/{category}/{folder}/patterns/*.*"
        ])

    # Preserve order but remove duplicates.
    return list(dict.fromkeys(selected))
```

### Phase Detection Flow

```
TASK CONTEXT
    │
    ├─► STEP 0: Detect Stack (from marker files)
    │   └─► Scope guard + recursive discovery in skill folder
    │
    ├─► STEP 1: Score task intents (weighted, multi-hit)
    │   ├─► If close scores: keep top-2 intents
    │   └─► Otherwise: keep top intent
    │
    ├─► PHASE 2: Stack-prioritized resource filtering
    │   └─► Load: *standards*.md, patterns/*.*
    │
    ├─► PHASE 3: Debugging
    │   └─► Load: debugging_checklist.md, *testing*.md
    │
    └─► PHASE 4: Verification (MANDATORY)
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

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

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

<!-- /ANCHOR:how-it-works -->
<!-- ANCHOR:rules -->
## 4. RULES

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

### ✅ Verification Rules

| ✅ ALWAYS                           | ❌ NEVER                               |
| ---------------------------------- | ------------------------------------- |
| Run tests before claiming complete | Claim "works" without running tests   |
| Note what you verified             | Say "should work" - prove it          |
| Check for errors in output         | Skip verification for "small changes" |

---

<!-- /ANCHOR:rules -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

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

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:integration-points -->
## 6. INTEGRATION POINTS

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

---

<!-- /ANCHOR:integration-points -->
<!-- ANCHOR:external-resources -->
## 7. EXTERNAL RESOURCES

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

<!-- /ANCHOR:external-resources -->
<!-- ANCHOR:related-skills -->
## 8. RELATED SKILLS

| Skill                         | Use For                              |
| ----------------------------- | ------------------------------------ |
| **workflows-documentation**   | Documentation, skill creation        |
| **workflows-git**             | Git workflows, commit hygiene        |
| **system-spec-kit**           | Spec folder management, memory       |
| **workflows-chrome-devtools** | Browser debugging, screenshots       |

### Navigation Guide

**Implementation:** Detect stack → Load `*_standards.md` → Load `code_quality_checklist.md`
**Debugging:** Load `debugging_checklist.md` → Load `*testing*.md` → Follow 4-step debug
**Verification:** Load `verification_checklist.md` → Run test/lint/build → Claim done

---

<!-- /ANCHOR:related-skills -->
<!-- ANCHOR:where-am-i -->
## 9. WHERE AM I?

| Phase                 | You're here if...            | Exit criteria              |
| --------------------- | ---------------------------- | -------------------------- |
| **1: Implementation** | Writing/modifying code       | Code builds, P0 items pass |
| **2: Debugging**      | Code has bugs/failing tests  | All tests passing          |
| **3: Verification**   | Tests pass, final validation | Verified, ready to ship    |

**Transitions:** 1→2 (bugs found) | 2→1 (missing code) | 2→3 (fixed) | 3→1/2 (issues found)
**Key principle:** Always end with Phase 3 before claiming completion.

---

<!-- /ANCHOR:where-am-i -->
<!-- ANCHOR:quick-reference -->
## 10. QUICK REFERENCE

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

<!-- /ANCHOR:quick-reference -->
<!-- ANCHOR:directory-structure -->
## 11. DIRECTORY STRUCTURE

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
<!-- /ANCHOR:directory-structure -->
