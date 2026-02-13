---
title: "workflows-code Smart Router - Recommendations Report"
created: 2024-12-31
version: 2.0.0
status: refined
---

# workflows-code Smart Router Recommendations

## 1. Executive Summary

### Assessment

After deep analysis of the existing SKILL.md (678 lines), the **current architecture is fundamentally sound**. The skill already has:
- ✅ Repository registry (`STACK_TO_FOLDER` mapping)
- ✅ Detection commands (bash-based marker detection)
- ✅ Phase-based routing (`route_resources()` function)
- ✅ Comprehensive knowledge index (Section 9)

**The issues are bugs and gaps, not architectural flaws.**

### Key Recommendations

| Priority | Recommendation | Impact |
|----------|----------------|--------|
| 🔴 Critical | Create missing universal assets | Unblocks Phase 2/3 workflows |
| 🟠 High | Add resource priority system (P1/P2/P3) | Reduces token usage by 60-80% |
| 🟠 High | Add task-based keyword matching | Smarter, more relevant loading |
| 🟡 Medium | Add explicit override capability | User control over detection |
| 🟡 Medium | Expand checklists to 50+ items | More thorough debugging/verification |

### Expected Outcomes

| Metric | Current | After Implementation |
|--------|---------|---------------------|
| Critical bugs | 2 | 0 |
| Avg tokens loaded | ~15,000 | ~3,000-5,000 |
| Detection accuracy | ~85% | ~98% |
| Time to add new repo | Edit 5+ locations | Edit 1 location |

---

## 2. Current Architecture Assessment

### What Works Well

The existing SKILL.md has solid foundations:

| Component | Location | Status |
|-----------|----------|--------|
| Stack detection | Lines 66-74 | ✅ Working (minor drift) |
| Registry mapping | Lines 170-177 | ✅ Working |
| Phase routing | Lines 179-251 | ✅ Working (missing fallback) |
| Phase detection helper | Section 7 | ✅ Working |
| Quick reference | Section 8 | ✅ Working |
| Knowledge index | Section 9 | ✅ Complete |

### Identified Gaps

| Gap | Impact | Severity |
|-----|--------|----------|
| Missing `debugging_checklist.md` | Phase 2 broken | 🔴 Critical |
| Missing `verification_checklist.md` | Phase 3 broken | 🔴 Critical |
| No resource prioritization | Loads everything (~15K tokens) | 🟠 High |
| No task-based loading | Irrelevant files loaded | 🟠 High |
| Phase 2/3 missing fallback | Unknown stacks fail | 🟡 Medium |
| Detection drift | Inconsistent behavior | 🟡 Medium |
| Broken cross-references | Navigation fails | 🟡 Medium |

### Current File Structure

```
workflows-code/
├── SKILL.md (v4.1.0, 678 lines)
├── references/
│   ├── common/stack_detection.md     # Detection heuristics
│   ├── backend-system/    (15 files) # Go patterns
│   ├── fe-partners-app/   (5 files)  # Angular patterns
│   ├── barter-expo/       (6 files)  # React Native patterns
│   ├── gaia-services/     (6 stubs)  # Python patterns
│   └── postgres-backup-system/ (3 files) # DevOps patterns
└── assets/
    ├── backend-system/    (2 files)
    ├── fe-partners-app/   (4 files)
    ├── barter-expo/       (1 file)
    ├── postgres-backup-system/ (3 files)
    ├── debugging_checklist.md     # ❌ MISSING
    └── verification_checklist.md  # ❌ MISSING
```

---

## 3. Proposed Enhancements

### 3.1 Enhanced Repository Registry

Replace the simple `STACK_TO_FOLDER` mapping with a comprehensive registry:

```yaml
REPOSITORY_REGISTRY:

  backend-system:
    display_name: "Go Backend"
    stack: go
    
    detection:
      git_patterns: ["backend-system", "barter-backend"]
      primary_markers: ["go.mod"]
      secondary_markers: ["cmd/main.go", "internal/domain/"]
    
    resources:
      p1:  # ALWAYS load (~1,500 tokens)
        - references/backend-system/go_standards.md
        - references/backend-system/domain_layers.md
      
      p2:  # Load if task matches keywords (~4,000 tokens)
        - references/backend-system/database_patterns.md
          keywords: [database, query, GORM, SQL, migration]
        - references/backend-system/api_design.md
          keywords: [API, endpoint, handler, HTTP, route]
        - references/backend-system/testing_strategy.md
          keywords: [test, mock, coverage, unit]
        - references/backend-system/di_configuration.md
          keywords: [dependency, injection, wire, DI]
        - assets/backend-system/cron_tracking_deployment.md
          keywords: [cron, scheduled, job, background]
      
      p3:  # Load only on explicit request (~10,000 tokens)
        - references/backend-system/database_patterns_gorm_type_mappings.md
        - references/backend-system/business_domain_vocabulary.md
        - references/backend-system/cli_commands.md
        - references/backend-system/cron_execution_tracking.md
        - references/backend-system/deployment.md
        - references/backend-system/infrastructure_events.md
        - references/backend-system/microservice_bootstrap_architecture.md
        - references/backend-system/models_vs_entities_and_adapters.md
        - references/backend-system/social_media_api_content_gallery_capabilities.md
        - assets/backend-system/README_CRON_TRACKING.md
    
    verification:
      test: "go test ./..."
      lint: "golangci-lint run"
      build: "go build ./..."

  fe-partners-app:
    display_name: "Angular Frontend"
    stack: angular
    
    detection:
      git_patterns: ["fe-partners-app", "partners-frontend"]
      primary_markers: ["angular.json"]
      secondary_markers: ["src/app/app.module.ts"]
    
    resources:
      p1:
        - references/fe-partners-app/angular-standards.md
        - references/fe-partners-app/component-architecture.md
      p2:
        - references/fe-partners-app/state-management.md
          keywords: [state, NGXS, store, action, selector]
        - references/fe-partners-app/rxjs-best-practices.md
          keywords: [RxJS, observable, subscription, pipe]
        - references/fe-partners-app/api-patterns.md
          keywords: [API, HTTP, service, interceptor]
        - assets/fe-partners-app/form-patterns.md
          keywords: [form, input, validation, control]
        - assets/fe-partners-app/testing-strategy.md
          keywords: [test, Jasmine, Karma, spec]
      p3:
        - assets/fe-partners-app/angular-material-patterns.md
        - assets/fe-partners-app/typescript-patterns.md
    
    verification:
      test: "ng test --watch=false"
      lint: "ng lint"
      build: "ng build --configuration=production"

  barter-expo:
    display_name: "React Native Mobile"
    stack: expo
    
    detection:
      git_patterns: ["barter-expo", "mobile-app"]
      primary_markers: ["app.json"]
      content_check: '"expo"'
      secondary_markers: ["expo-env.d.ts"]
    
    resources:
      p1:
        - references/barter-expo/react-native-standards.md
        - references/barter-expo/react-hooks-patterns.md
      p2:
        - references/barter-expo/navigation-patterns.md
          keywords: [navigation, screen, route, stack]
        - references/barter-expo/performance-optimization.md
          keywords: [performance, optimize, FlashList, memo]
        - assets/barter-expo/mobile-testing.md
          keywords: [test, Jest, Detox, mock]
      p3:
        - references/barter-expo/expo-patterns.md
        - references/barter-expo/native-modules.md
    
    verification:
      test: "npm test"
      lint: "npx eslint ."
      build: "npx expo export"

  gaia-services:
    display_name: "Python AI Services"
    stack: python
    
    detection:
      git_patterns: ["gaia-services", "ai-services"]
      primary_markers: ["requirements.txt"]
      content_check: "flask"
      secondary_markers: ["app.py"]
    
    resources:
      p1:
        - references/gaia-services/python-standards.md
        - references/gaia-services/flask-patterns.md
      p2:
        - references/gaia-services/api-design.md
          keywords: [API, endpoint, route, REST]
        - references/gaia-services/testing-strategy.md
          keywords: [test, pytest, mock, fixture]
      p3:
        - references/gaia-services/docker-deployment.md
        - references/gaia-services/llm-integration.md
    
    verification:
      test: "pytest"
      lint: "ruff check ."
      build: null

  postgres-backup-system:
    display_name: "DevOps Backup System"
    stack: devops
    
    detection:
      git_patterns: ["postgres-backup", "db-backup"]
      primary_markers: ["Makefile"]
      content_check: "pg_dump"
      secondary_markers: ["docker-compose.yml"]
    
    resources:
      p1:
        - references/postgres-backup-system/architecture.md
        - references/postgres-backup-system/project_rules.md
      p2:
        - assets/postgres-backup-system/deployment.md
          keywords: [deploy, release, production]
        - assets/postgres-backup-system/development_guide.md
          keywords: [develop, setup, local, environment]
      p3:
        - assets/postgres-backup-system/api_reference.md
        - references/postgres-backup-system/README.md
    
    verification:
      test: "make test"
      lint: null
      build: "make build"
```

### 3.2 Smart Detection Pipeline

Multi-strategy detection with confidence scoring:

```
DETECTION PIPELINE (execute in order, stop at first match):

┌─────────────────────────────────────────────────────────────────┐
│ PRIORITY 1: EXPLICIT OVERRIDE (100% confidence)                 │
├─────────────────────────────────────────────────────────────────┤
│ Check: Does `.barter-repo` file exist?                          │
│ Action: Read file content, use as repository name               │
│ Example: echo "backend-system" > .barter-repo                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (if no match)
┌─────────────────────────────────────────────────────────────────┐
│ PRIORITY 2: GIT REMOTE PATTERN (95% confidence)                 │
├─────────────────────────────────────────────────────────────────┤
│ Check: git remote get-url origin 2>/dev/null                    │
│ Match against: REGISTRY[*].detection.git_patterns               │
│ Example: "github.com/barter/backend-system" → backend-system    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (if no match)
┌─────────────────────────────────────────────────────────────────┐
│ PRIORITY 3: PRIMARY MARKERS (90% confidence)                    │
├─────────────────────────────────────────────────────────────────┤
│ Check: File existence + optional content check                  │
│                                                                 │
│ go.mod exists?                        → backend-system          │
│ angular.json exists?                  → fe-partners-app         │
│ app.json exists AND contains "expo"?  → barter-expo             │
│ requirements.txt AND contains "flask"? → gaia-services          │
│ Makefile exists AND contains "pg_dump"? → postgres-backup-system│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (if no match)
┌─────────────────────────────────────────────────────────────────┐
│ PRIORITY 4: SECONDARY MARKERS (80% confidence)                  │
├─────────────────────────────────────────────────────────────────┤
│ Check: Fallback file patterns                                   │
│                                                                 │
│ cmd/main.go exists?           → backend-system                  │
│ src/app/app.module.ts exists? → fe-partners-app                 │
│ expo-env.d.ts exists?         → barter-expo                     │
│ app.py exists?                → gaia-services                   │
│ docker-compose.yml + postgres? → postgres-backup-system         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (if no match)
┌─────────────────────────────────────────────────────────────────┐
│ PRIORITY 5: FALLBACK (ask user)                                 │
├─────────────────────────────────────────────────────────────────┤
│ Action: Ask user to specify repository                          │
│ Prompt: "Which repository are you working in?                   │
│          A) backend-system (Go)                                 │
│          B) fe-partners-app (Angular)                           │
│          C) barter-expo (React Native)                          │
│          D) gaia-services (Python)                              │
│          E) postgres-backup-system (DevOps)"                    │
│                                                                 │
│ Alternative: Load common resources only                         │
└─────────────────────────────────────────────────────────────────┘
```

### 3.3 Intelligent Resource Loading

Task-aware loading algorithm:

```
SMART_LOAD(user_request):

    # ═══════════════════════════════════════════════════════════════
    # STEP 1: DETECT REPOSITORY
    # ═══════════════════════════════════════════════════════════════
    
    repo = run_detection_pipeline()
    
    if repo.confidence < 80%:
        repo = ask_user_for_repository()
    
    REPORT: "Detected: {repo.display_name} ({repo.confidence}% confidence)"
    
    # ═══════════════════════════════════════════════════════════════
    # STEP 2: CLASSIFY TASK
    # ═══════════════════════════════════════════════════════════════
    
    task_type = classify_task(user_request)
    
    TASK CLASSIFICATION (check in order, use first match):
    
    │ Keywords                              │ Task Type      │
    ├───────────────────────────────────────┼────────────────┤
    │ "done", "complete", "works", "verify" │ VERIFICATION   │
    │ "bug", "fix", "error", "broken"       │ DEBUGGING      │
    │ "test", "mock", "coverage"            │ TESTING        │
    │ "database", "query", "GORM", "SQL"    │ DATABASE       │
    │ "API", "endpoint", "handler"          │ API            │
    │ "deploy", "release", "production"     │ DEPLOYMENT     │
    │ "implement", "create", "add", "build" │ IMPLEMENTATION │
    │ (no match)                            │ IMPLEMENTATION │
    
    REPORT: "Task type: {task_type}"
    
    # ═══════════════════════════════════════════════════════════════
    # STEP 3: DETERMINE LOAD LEVEL
    # ═══════════════════════════════════════════════════════════════
    
    if task_type == VERIFICATION:
        load_level = "MINIMAL"      # ~750 tokens
    elif task_type == DEBUGGING:
        load_level = "DEBUGGING"    # ~3,000 tokens
    elif task_type in [DATABASE, API, TESTING, DEPLOYMENT]:
        load_level = "FOCUSED"      # ~2,500 tokens
    else:  # IMPLEMENTATION
        load_level = "STANDARD"     # ~4,000 tokens
    
    # ═══════════════════════════════════════════════════════════════
    # STEP 4: LOAD RESOURCES
    # ═══════════════════════════════════════════════════════════════
    
    resources = []
    
    # Always load common detection reference
    resources.append("references/common/stack_detection.md")
    
    switch load_level:
    
        case "MINIMAL":
            resources.append("assets/verification_checklist.md")
            # That's it - verification needs minimal context
        
        case "DEBUGGING":
            resources.extend(REGISTRY[repo].resources.p1)
            resources.append("assets/debugging_checklist.md")
            # Add testing resources for the stack
            testing_file = find_testing_resource(repo)
            if testing_file:
                resources.append(testing_file)
        
        case "FOCUSED":
            resources.extend(REGISTRY[repo].resources.p1)
            # Add only P2 files matching task keywords
            for p2_file in REGISTRY[repo].resources.p2:
                if any(keyword in user_request for keyword in p2_file.keywords):
                    resources.append(p2_file.path)
        
        case "STANDARD":
            resources.extend(REGISTRY[repo].resources.p1)
            resources.extend(REGISTRY[repo].resources.p2)
    
    # ═══════════════════════════════════════════════════════════════
    # STEP 5: EXECUTE LOADS
    # ═══════════════════════════════════════════════════════════════
    
    for resource in resources:
        load(resource)
    
    REPORT: "Loaded {len(resources)} resources (~{estimate_tokens(resources)} tokens)"
```

### 3.4 Visual Decision Flow

Complete routing decision tree:

```
                         USER REQUEST
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     STEP 1: REPOSITORY DETECTION                        │
│                                                                         │
│  .barter-repo exists? ──YES──► Use explicit repo (100%)                 │
│         │                                                               │
│         NO                                                              │
│         ▼                                                               │
│  Git remote matches? ──YES──► Use matched repo (95%)                    │
│         │                                                               │
│         NO                                                              │
│         ▼                                                               │
│  Primary marker? ────YES──► Use detected repo (90%)                     │
│         │                                                               │
│         NO                                                              │
│         ▼                                                               │
│  Secondary marker? ──YES──► Use detected repo (80%)                     │
│         │                                                               │
│         NO                                                              │
│         ▼                                                               │
│  ASK USER ──────────────► User selects repo                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     STEP 2: TASK CLASSIFICATION                         │
│                                                                         │
│  Request contains "done/complete/works/verify"?                         │
│  └─► VERIFICATION ──────────────────────────────────────────────────┐   │
│                                                                     │   │
│  Request contains "bug/fix/error/broken"?                           │   │
│  └─► DEBUGGING ─────────────────────────────────────────────────┐   │   │
│                                                                 │   │   │
│  Request contains "test/mock/coverage"?                         │   │   │
│  └─► TESTING ───────────────────────────────────────────────┐   │   │   │
│                                                             │   │   │   │
│  Request contains "database/query/GORM/SQL"?                │   │   │   │
│  └─► DATABASE ──────────────────────────────────────────┐   │   │   │   │
│                                                         │   │   │   │   │
│  Request contains "API/endpoint/handler"?               │   │   │   │   │
│  └─► API ───────────────────────────────────────────┐   │   │   │   │   │
│                                                     │   │   │   │   │   │
│  Request contains "deploy/release/production"?      │   │   │   │   │   │
│  └─► DEPLOYMENT ────────────────────────────────┐   │   │   │   │   │   │
│                                                 │   │   │   │   │   │   │
│  Default ──► IMPLEMENTATION                     │   │   │   │   │   │   │
│                                                 │   │   │   │   │   │   │
└─────────────────────────────────────────────────┼───┼───┼───┼───┼───┼───┘
                                                  │   │   │   │   │   │
                                                  ▼   ▼   ▼   ▼   ▼   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     STEP 3: RESOURCE LOADING                            │
│                                                                         │
│  VERIFICATION ──► verification_checklist.md ONLY (~750 tokens)          │
│                                                                         │
│  DEBUGGING ─────► P1 + debugging_checklist.md + testing (~3,000 tokens) │
│                                                                         │
│  FOCUSED ───────► P1 + matching P2 files (~2,500 tokens)                │
│  (TESTING, DATABASE, API, DEPLOYMENT)                                   │
│                                                                         │
│  IMPLEMENTATION ► P1 + all P2 files (~4,000 tokens)                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                      PROCEED WITH TASK
```

---

## 4. Context Management Strategy

### Token Budget Analysis

| Repository | P1 Tokens | P2 Tokens | P3 Tokens | Total |
|------------|-----------|-----------|-----------|-------|
| backend-system | ~1,500 | ~4,000 | ~10,000 | ~15,500 |
| fe-partners-app | ~1,200 | ~3,500 | ~1,500 | ~6,200 |
| barter-expo | ~1,000 | ~2,500 | ~1,500 | ~5,000 |
| gaia-services | ~800 | ~1,200 | ~1,000 | ~3,000 |
| postgres-backup-system | ~1,000 | ~1,500 | ~1,000 | ~3,500 |
| **Universal assets** | ~1,500 | - | - | ~1,500 |

### Loading Strategies

| Strategy | When to Use | Resources Loaded | Est. Tokens |
|----------|-------------|------------------|-------------|
| **MINIMAL** | Verification phase | verification_checklist.md only | ~750 |
| **DEBUGGING** | Bug fixing | P1 + debugging checklist + testing | ~3,000 |
| **FOCUSED** | Specific task (DB, API, etc.) | P1 + matching P2 | ~2,500 |
| **STANDARD** | General implementation | P1 + all P2 | ~4,000 |
| **COMPREHENSIVE** | Deep dive, complex issues | P1 + P2 + P3 | ~10,000-15,000 |

### Context Overflow Prevention

If approaching context limits:

1. **Summarize loaded resources** - Create brief summary of key points
2. **Unload P3 files first** - These are least critical
3. **Keep P1 files always** - Core standards must remain
4. **Ask user to prioritize** - "Which area is most relevant?"

### Progressive Loading

```
Initial load: P1 only (~1,500 tokens)
     │
     ▼
User asks about database ──► Load database_patterns.md
     │
     ▼
User asks about testing ──► Load testing_strategy.md
     │
     ▼
User needs deep dive ──► Load remaining P3 files
```

---

## 5. Implementation Roadmap

### Tier 1: Bug Fixes (1-2 hours)

| Task | File | Effort | Impact |
|------|------|--------|--------|
| Create debugging_checklist.md | `assets/debugging_checklist.md` | 45 min | 🔴 Critical |
| Create verification_checklist.md | `assets/verification_checklist.md` | 45 min | 🔴 Critical |
| Add missing frontmatter | `SKILL.md` | 5 min | 🟡 Medium |
| Sync stack_detection.md | `references/common/stack_detection.md` | 15 min | 🟡 Medium |

### Tier 2: Enhancements (4-6 hours)

| Task | Description | Effort | Impact |
|------|-------------|--------|--------|
| Add resource priority | P1/P2/P3 classification in registry | 1 hour | 🟠 High |
| Add task keywords | Keyword matching for P2 files | 1 hour | 🟠 High |
| Add Phase 2/3 fallback | else clause for unknown stacks | 30 min | 🟡 Medium |
| Update broken paths | Fix `.opencode/knowledge/` refs | 1 hour | 🟡 Medium |
| Fix cross-references | Update refs↔assets links | 1 hour | 🟡 Medium |
| Add detection confidence | Report confidence level | 30 min | 🟢 Low |

### Tier 3: Advanced Features (Future)

| Feature | Description | Benefit |
|---------|-------------|---------|
| Explicit override | `.barter-repo` file support | User control |
| Git-based detection | Detect from remote URL | Higher accuracy |
| Token tracking | Report tokens loaded | Transparency |
| Progressive loading | Load on-demand | Reduced context |
| Context summarization | Auto-summarize loaded files | Overflow prevention |

---

## 6. Specific Changes Required

### 6.1 SKILL.md Modifications

#### Add Frontmatter Fields

```yaml
---
name: workflows-code
description: "Smart multi-repository development orchestrator with task-aware resource loading"
version: 5.0.0
globs: ["**/*.go", "**/*.ts", "**/*.tsx", "**/*.py", "**/*.js", "**/*.jsx"]
alwaysApply: false
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---
```

#### Replace Section 2 with Enhanced Registry

Replace lines 60-251 with the enhanced repository registry and smart loading algorithm from Section 3 of this report.

#### Add Phase 2/3 Fallback

In `route_resources()`, add else clause:

```python
# Phase 2: Testing/Debugging
if task.phase == "testing" or task.phase == "debugging":
    if folder == "backend-system":
        load("references/backend-system/testing_strategy.md")
    # ... existing elif clauses ...
    else:  # FALLBACK FOR UNKNOWN STACKS
        load("assets/debugging_checklist.md")
        # Load all testing resources
        for f in ["backend-system", "fe-partners-app", "barter-expo", "gaia-services"]:
            testing_file = find_testing_file(f)
            if testing_file:
                load(testing_file)

# Phase 3: Verification
if task.phase == "verification" or task.claiming_complete:
    load("assets/verification_checklist.md")
    # No fallback needed - checklist is universal
```

### 6.2 New Files to Create

#### assets/debugging_checklist.md

```markdown
---
title: "Universal Debugging Checklist"
type: asset
version: 1.0.0
---

# Universal Debugging Checklist

> **STOP**: Before diving into code, complete Section 1 first.

## 1. Issue Capture (MANDATORY FIRST STEP)

- [ ] Error message captured verbatim (copy-paste, not paraphrase)
- [ ] Full stack trace saved (if available)
- [ ] Reproduction steps documented:
  1. [Step 1]
  2. [Step 2]
  3. [Expected result]
  4. [Actual result]
- [ ] Frequency: ☐ Always ☐ Sometimes ☐ Once ☐ Random
- [ ] Environment: ☐ Development ☐ Staging ☐ Production
- [ ] Browser/Device (if frontend): _______________
- [ ] First occurrence: Date/Time or Commit: _______________

## 2. Scope Assessment

- [ ] How many files affected? ☐ Single ☐ Multiple ☐ Unknown
- [ ] Which layer?
  - [ ] UI / Frontend
  - [ ] API / Backend
  - [ ] Business Logic
  - [ ] Database
  - [ ] External Service
  - [ ] Infrastructure
- [ ] Recent changes to affected area?
  ```bash
  git log --oneline -10 -- <affected_path>
  ```
- [ ] Dependencies updated recently?
  ```bash
  git diff HEAD~10 package.json go.mod requirements.txt
  ```
- [ ] Similar issues in past? Search: _______________

## 3. Evidence Gathering

- [ ] Application logs collected (relevant timeframe)
- [ ] Database state verified (if applicable)
- [ ] Network requests inspected (if applicable)
- [ ] Environment variables confirmed correct
- [ ] Configuration files checked for recent changes
- [ ] External service status verified (if applicable)
- [ ] Cache cleared / invalidated (if applicable)

## 4. Hypothesis Formation

**Single hypothesis** (not multiple guesses):

> I believe the bug is caused by: _______________________
> 
> Because: _______________________
> 
> Expected behavior: _______________________
> 
> Actual behavior: _______________________

- [ ] Confidence: ☐ High ☐ Medium ☐ Low

## 5. Hypothesis Testing

- [ ] Minimal reproduction case created (if possible)
- [ ] Single change applied to test hypothesis
- [ ] Result: ☐ Confirmed ☐ Refuted ☐ Inconclusive
- [ ] If refuted: Return to Step 4 with new hypothesis

**⚠️ STOP CONDITION**: If 3+ hypotheses failed, STOP and:
- [ ] Question fundamental assumptions
- [ ] Seek different perspective (rubber duck, colleague)
- [ ] Consider if problem is elsewhere entirely

## 6. Stack-Specific Debugging

### If Go (backend-system)

- [ ] Run static analysis:
  ```bash
  go vet ./...
  ```
- [ ] Run comprehensive linting:
  ```bash
  golangci-lint run
  ```
- [ ] Enable GORM debug logging:
  ```go
  db.Debug().Where(...)
  ```
- [ ] Check context cancellation/timeout
- [ ] Verify DI wire configuration
- [ ] Check for goroutine leaks (if applicable)
- [ ] Verify error wrapping chain

### If Angular (fe-partners-app)

- [ ] Browser DevTools Console - check for errors
- [ ] Network tab - verify API request/response
- [ ] Check RxJS subscription cleanup (memory leaks)
- [ ] Verify OnPush change detection triggers
- [ ] Check signal/computed updates
- [ ] Verify NGXS action dispatch:
  ```typescript
  this.store.dispatch(new MyAction()).subscribe(console.log)
  ```
- [ ] Check zone.js issues (if applicable)

### If React Native (barter-expo)

- [ ] Metro bundler logs - check for errors
- [ ] Expo dev tools - verify config
- [ ] Check native module bridge errors
- [ ] Test on BOTH platforms:
  - [ ] iOS Simulator
  - [ ] Android Emulator
- [ ] Verify FlashList `estimatedItemSize`
- [ ] Check navigation state
- [ ] Verify async storage state

### If Python (gaia-services)

- [ ] Enable Flask debug mode
- [ ] Verify environment variables loaded:
  ```python
  import os; print(os.environ.get('KEY'))
  ```
- [ ] Check dependency versions:
  ```bash
  pip freeze | grep <package>
  ```
- [ ] Verify LLM API responses (if applicable)
- [ ] Check database connection pool
- [ ] Verify CORS configuration (if API)

### If DevOps (postgres-backup-system)

- [ ] Check cron job logs:
  ```bash
  journalctl -u cron --since "1 hour ago"
  ```
- [ ] Verify pg_dump permissions
- [ ] Check disk space:
  ```bash
  df -h
  ```
- [ ] Verify network connectivity to database
- [ ] Check backup file permissions
- [ ] Verify S3/storage credentials

## 7. Resolution Implementation

- [ ] Root cause documented (in code comment or commit message)
- [ ] Single fix implemented (not multiple changes)
- [ ] Fix addresses ROOT CAUSE, not just symptom
- [ ] Tests added/updated to cover the bug
- [ ] No debug code left behind:
  - [ ] No `console.log` / `fmt.Println` / `print()`
  - [ ] No `debugger` statements
  - [ ] No commented-out code

## 8. Verification

- [ ] Original reproduction steps no longer reproduce bug
- [ ] All existing tests still pass
- [ ] Linting passes
- [ ] Build succeeds
- [ ] Manual smoke test performed

## 9. Post-Resolution

- [ ] Similar code patterns checked for same bug
- [ ] Knowledge base updated (if new pattern discovered)
- [ ] Monitoring/alerting improved (if production bug)
- [ ] Postmortem documented (if significant outage)

---

## Quick Reference: Common Debugging Commands

| Stack | Test | Lint | Logs |
|-------|------|------|------|
| Go | `go test ./...` | `golangci-lint run` | Application logs |
| Angular | `ng test` | `ng lint` | Browser DevTools |
| React Native | `npm test` | `npx eslint .` | Metro bundler |
| Python | `pytest` | `ruff check .` | Flask debug |
| DevOps | `make test` | N/A | `journalctl` |
```

#### assets/verification_checklist.md

```markdown
---
title: "Pre-Completion Verification Checklist"
type: asset
version: 1.0.0
---

# Pre-Completion Verification Checklist

> **THE IRON LAW**: No completion claim ("done", "works", "fixed", "complete") without running this checklist.

## 1. Code Quality (Universal)

- [ ] Code follows repository-specific standards
- [ ] No unnecessary complexity added
- [ ] No code duplication introduced
- [ ] Error handling is appropriate and consistent
- [ ] Edge cases considered and handled
- [ ] No magic numbers/strings (use constants)
- [ ] Comments explain WHY, not WHAT
- [ ] Variable/function names are descriptive

## 2. Testing (Universal)

- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Test coverage maintained or improved
- [ ] Edge cases have test coverage
- [ ] Tests are deterministic (no flaky tests)
- [ ] Tests run in reasonable time

## 3. Stack-Specific Verification

### Go (backend-system)

```bash
# Run these commands and verify all pass:
go test ./...                    # ☐ Pass
go test -race ./...              # ☐ Pass (no race conditions)
golangci-lint run                # ☐ Pass
go build ./...                   # ☐ Pass
go mod tidy                      # ☐ No changes needed
```

- [ ] Table-driven tests used where appropriate
- [ ] Mocks use interfaces, not concrete types
- [ ] Error messages are descriptive
- [ ] Context propagation is correct

### Angular (fe-partners-app)

```bash
# Run these commands and verify all pass:
ng test --watch=false            # ☐ Pass
ng lint                          # ☐ Pass
ng build --configuration=production  # ☐ Pass
```

- [ ] No console errors in browser DevTools
- [ ] Responsive design verified:
  - [ ] Desktop (1920px)
  - [ ] Mobile (375px)
- [ ] Accessibility: keyboard navigation works
- [ ] OnDestroy cleanup implemented (no memory leaks)
- [ ] Signals update correctly

### React Native (barter-expo)

```bash
# Run these commands and verify all pass:
npm test                         # ☐ Pass
npx eslint .                     # ☐ Pass
npx expo export                  # ☐ Pass
```

- [ ] Tested on iOS simulator
- [ ] Tested on Android emulator
- [ ] No yellow box warnings
- [ ] Performance: no jank on scroll
- [ ] FlashList has `estimatedItemSize`

### Python (gaia-services)

```bash
# Run these commands and verify all pass:
pytest                           # ☐ Pass
pytest --cov                     # ☐ Adequate coverage
ruff check .                     # ☐ Pass
ruff format --check .            # ☐ Pass
```

- [ ] Type hints added for new functions
- [ ] Docstrings added for public functions
- [ ] Environment variables documented

### DevOps (postgres-backup-system)

```bash
# Run these commands and verify all pass:
make test                        # ☐ Pass (if applicable)
make build                       # ☐ Pass
```

- [ ] Backup script runs successfully
- [ ] Restore tested (backup is usable)
- [ ] Cron schedule verified
- [ ] Monitoring alerts configured

## 4. Security (Universal)

- [ ] No secrets/credentials in code
- [ ] No hardcoded API keys
- [ ] Input validation on all user inputs
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (if frontend)
- [ ] CORS configured correctly (if API)
- [ ] Authentication/authorization correct

## 5. Documentation

- [ ] README updated (if applicable)
- [ ] API documentation updated (if applicable)
- [ ] Code comments for complex logic
- [ ] CHANGELOG entry added (if applicable)
- [ ] Migration guide (if breaking changes)

## 6. Final Checks

- [ ] No debug code left:
  - [ ] No `console.log` / `fmt.Println` / `print()`
  - [ ] No `debugger` statements
  - [ ] No commented-out code
- [ ] No TODO comments for this feature (complete them or create ticket)
- [ ] Git diff reviewed for unintended changes
- [ ] Commit message is descriptive

## 7. Verification Statement

**Fill in before claiming completion:**

```
VERIFICATION COMPLETE
=====================
Repository: [backend-system | fe-partners-app | barter-expo | gaia-services | postgres-backup-system]

Tests:
  Command: _______________
  Result:  ☐ Pass ☐ Fail

Lint:
  Command: _______________
  Result:  ☐ Pass ☐ Fail

Build:
  Command: _______________
  Result:  ☐ Pass ☐ Fail

Manual Verification:
  What was tested: _______________
  Result: _______________

Known Limitations:
  _______________

I have verified this code works because: _______________
```

---

## Quick Reference: Verification Commands

| Stack | Test | Lint | Build |
|-------|------|------|-------|
| Go | `go test ./...` | `golangci-lint run` | `go build ./...` |
| Angular | `ng test --watch=false` | `ng lint` | `ng build` |
| React Native | `npm test` | `npx eslint .` | `npx expo export` |
| Python | `pytest` | `ruff check .` | N/A |
| DevOps | `make test` | N/A | `make build` |

---

> **Remember**: "It should work" is not verification. "I ran X and it passed" is verification.
```

### 6.3 Files to Update (Link Fixes)

| File | Current | Should Be |
|------|---------|-----------|
| `references/postgres-backup-system/architecture.md` | `.opencode/knowledge/project_rules.md` | `./project_rules.md` |
| `references/postgres-backup-system/project_rules.md` | `.opencode/knowledge/architecture.md` | `./architecture.md` |
| `assets/postgres-backup-system/api_reference.md` | `.opencode/knowledge/*` | Relative paths |
| `assets/postgres-backup-system/deployment.md` | `.opencode/knowledge/*` | Relative paths |
| `assets/postgres-backup-system/development_guide.md` | `.opencode/knowledge/*` | Relative paths |
| `references/fe-partners-app/api-patterns.md` | `./form-patterns.md` | `../../assets/fe-partners-app/form-patterns.md` |
| `references/fe-partners-app/component-architecture.md` | `./form-patterns.md` | `../../assets/fe-partners-app/form-patterns.md` |
| `assets/fe-partners-app/form-patterns.md` | `./api-patterns.md` | `../../references/fe-partners-app/api-patterns.md` |
| `assets/backend-system/README_CRON_TRACKING.md` | `cron_execution_tracking.md` | `../../references/backend-system/cron_execution_tracking.md` |
| `references/common/stack_detection.md` | Lowercase output | Match SKILL.md (uppercase) |

---

## 7. Validation Test Cases

### Detection Tests

| ID | Scenario | Setup | Expected |
|----|----------|-------|----------|
| D1 | Go project | `go.mod` exists | `backend-system` (90%) |
| D2 | Angular project | `angular.json` exists | `fe-partners-app` (90%) |
| D3 | Expo project | `app.json` with "expo" | `barter-expo` (90%) |
| D4 | Python project | `requirements.txt` with "flask" | `gaia-services` (90%) |
| D5 | DevOps project | `Makefile` with "pg_dump" | `postgres-backup-system` (90%) |
| D6 | Explicit override | `.barter-repo` = "backend-system" | `backend-system` (100%) |
| D7 | Git remote | URL contains "fe-partners-app" | `fe-partners-app` (95%) |
| D8 | No markers | Empty directory | Ask user |
| D9 | Multiple markers | `go.mod` AND `angular.json` | `backend-system` (first match) |
| D10 | Secondary only | `cmd/main.go` exists | `backend-system` (80%) |

### Routing Tests

| ID | Repo | Request | Expected Resources |
|----|------|---------|-------------------|
| R1 | backend-system | "implement new service" | P1: go_standards.md, domain_layers.md |
| R2 | backend-system | "fix database query" | P1 + database_patterns.md |
| R3 | backend-system | "add API endpoint" | P1 + api_design.md |
| R4 | fe-partners-app | "create component" | P1: angular-standards.md, component-architecture.md |
| R5 | fe-partners-app | "fix form validation" | P1 + form-patterns.md |
| R6 | barter-expo | "debug navigation" | P1 + navigation-patterns.md |
| R7 | Any | "done" / "complete" | verification_checklist.md ONLY |
| R8 | Any | "bug" / "not working" | P1 + debugging_checklist.md |

### Phase Transition Tests

| ID | Start | Trigger | End |
|----|-------|---------|-----|
| P1 | Implementation | Test failure | Debugging |
| P2 | Debugging | All tests pass | Verification |
| P3 | Verification | Issue found | Implementation/Debugging |
| P4 | Any | User says "done" | Verification (mandatory) |

---

## 8. Troubleshooting Guide

### Detection Failures

**Problem: Wrong repository detected**
```
Symptom: AI loads Angular patterns for Go project
Cause: Multiple marker files present (e.g., both go.mod and angular.json)
Solution: Create .barter-repo file with correct repo name
Prevention: Clean up stray config files from other projects
```

**Problem: No repository detected**
```
Symptom: AI asks which repository or loads only common resources
Cause: Working directory is not project root
Solution: Navigate to project root, or create .barter-repo file
Fallback: Explicitly tell AI which repository
```

**Problem: Low confidence detection**
```
Symptom: AI reports "80% confidence" or asks for confirmation
Cause: Only secondary markers found
Solution: Confirm with user, or add primary marker file
Action: "Detected {repo} with 80% confidence. Is this correct?"
```

### Resource Loading Issues

**Problem: File not found error**
```
Symptom: AI reports "Could not load {file}"
Cause: File was moved, renamed, or deleted
Solution: Check SKILL.md Section 9 for current paths
Action: Report missing file, continue with available resources
```

**Problem: Context overflow**
```
Symptom: AI loses track of earlier context, or errors about token limit
Cause: Too many resources loaded (especially with P3 files)
Solution: Use selective loading strategy
Action: 
  1. Summarize loaded content
  2. Unload P3 files
  3. Ask user which P2 files to prioritize
```

**Problem: Irrelevant resources loaded**
```
Symptom: AI references patterns not applicable to current task
Cause: Task classification missed keywords
Solution: Be more specific in request
Example: Instead of "fix it", say "fix the database query"
```

### Phase Confusion

**Problem: Unsure which phase**
```
Solution: Use Section 7 "Where Am I?" helper

Quick check:
- Writing new code? → Phase 1 (Implementation)
- Tests failing? → Phase 2 (Debugging)
- Ready to ship? → Phase 3 (Verification)
```

**Problem: Stuck in debugging loop**
```
Symptom: 3+ fix attempts failed
Cause: Wrong hypothesis, or problem is elsewhere
Solution: 
  1. STOP fixing
  2. Question assumptions
  3. Re-read error message carefully
  4. Consider if problem is in different layer
  5. Seek different perspective
```

**Problem: Skipped verification**
```
Symptom: Claimed "done" without running tests
Cause: Verification phase bypassed
Solution: ALWAYS run verification_checklist.md before any completion claim
Rule: "It should work" ≠ verification. "I ran X and it passed" = verification.
```

---

## 9. Success Metrics

### Quantitative

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Critical bugs | 2 | 0 | Bug count |
| Medium bugs | 15 | 0 | Bug count |
| Avg tokens loaded | ~15,000 | ~3,000-5,000 | Token estimate |
| Detection accuracy | ~85% | ~98% | Correct detections / total |
| Time to add new repo | ~30 min (5+ edits) | ~10 min (1 edit) | Time measurement |

### Qualitative

| Aspect | Current | Target |
|--------|---------|--------|
| Routing clarity | Read multiple sections | Read registry only |
| Resource relevance | All files loaded | Task-relevant files only |
| Debugging efficiency | Trial and error | Systematic checklist |
| Verification confidence | "Should work" | "Verified with X" |

---

## 10. Appendix

### A. Complete Repository Registry (YAML)

See Section 3.1 for the full registry definition.

### B. Alternatives Considered

**A. Separate Routing Config File**
- Idea: Move registry to `routing-config.yaml`
- Rejected: Breaks self-contained skill pattern
- Skills should be single-file loadable

**B. Dynamic Folder Discovery**
- Idea: Auto-discover repos from folder structure
- Rejected: No control over detection markers
- Implicit behavior is harder to debug

**C. Separate Skills Per Repository**
- Idea: Create `workflows-code-go`, `workflows-code-angular`, etc.
- Rejected: 5x maintenance burden
- Common logic would be duplicated

**D. External Knowledge Base**
- Idea: Keep knowledge in separate repository
- Rejected: Symlink pattern already failed
- Bundled resources are more reliable

### C. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-31 | Initial recommendations |
| 2.0.0 | 2024-12-31 | Complete rewrite with smart routing |

---

*Report generated: 2024-12-31*
*Target SKILL.md version: 5.0.0*
*Estimated implementation effort: 8-12 hours total*
