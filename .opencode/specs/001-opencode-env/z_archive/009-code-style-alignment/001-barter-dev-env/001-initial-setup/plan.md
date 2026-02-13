---
title: Migration Plan - Knowledge to Skill Subfolders
description: Technical implementation plan for migrating knowledge into workflows-code skill
level: 3
status: in_progress
created: 2024-12-31
---

# Migration Plan - Knowledge to Skill Subfolders

## 1. OVERVIEW

This plan details the technical steps to migrate stack-specific knowledge from `repositories/*/knowledge/` into bundled subfolders within the `workflows-code` skill.

## 2. PATHS

**Source Base:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/repositories/`

**Target Base:** `/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/workflows-code/references/`

## 3. PHASE 1: Create Subfolder Structure

### 3.1 Create Target Directories

```bash
# Base path
SKILL_REF="/Users/michelkerkmeester/MEGA/Development/Opencode Env/Barter/coder/.opencode/skill/workflows-code/references"

# Create subfolders matching repository names
mkdir -p "$SKILL_REF/common"
mkdir -p "$SKILL_REF/backend-system"
mkdir -p "$SKILL_REF/fe-partners-app"
mkdir -p "$SKILL_REF/barter-expo"
mkdir -p "$SKILL_REF/gaia-services"
mkdir -p "$SKILL_REF/postgres-backup-system"
```

### 3.2 Move Existing Content to common/

Move existing universal files:
- `REDIRECT.md` → Archive (delete after migration)
- `stack_detection.md` → `common/stack_detection.md`

## 4. PHASE 2: Migrate Knowledge Files

### 4.1 backend-system (Go) - 17 files

```bash
cp repositories/backend-system/knowledge/*.md references/backend-system/
```

Files:
- api_design.md
- business_domain_vocabulary.md
- cli_commands.md
- cron_execution_tracking.md
- cron_tracking_deployment.md
- database_patterns_gorm_type_mappings.md
- database_patterns.md
- deployment.md
- di_configuration.md
- domain_layers.md
- go_standards.md
- infrastructure_events.md
- microservice_bootstrap_architecture.md
- models_vs_entities_and_adapters.md
- README_CRON_TRACKING.md
- social_media_api_content_gallery_capabilities.md
- testing_strategy.md

### 4.2 fe-partners-app (Angular) - 9 files

```bash
cp repositories/fe-partners-app/knowledge/*.md references/fe-partners-app/
```

Files:
- angular-material-patterns.md
- angular-standards.md
- api-patterns.md
- component-architecture.md
- form-patterns.md
- rxjs-best-practices.md
- state-management.md
- testing-strategy.md
- typescript-patterns.md

### 4.3 barter-expo (React Native) - 7 files

```bash
cp repositories/barter-expo/knowledge/*.md references/barter-expo/
```

Files:
- expo-patterns.md
- mobile-testing.md
- native-modules.md
- navigation-patterns.md
- performance-optimization.md
- react-hooks-patterns.md
- react-native-standards.md

### 4.4 gaia-services (Python) - 6 files

```bash
cp repositories/gaia-services/legacy-knowledge/*.md references/gaia-services/
```

Files (stubs):
- api-design.md
- docker-deployment.md
- flask-patterns.md
- llm-integration.md
- python-standards.md
- testing-strategy.md

### 4.5 postgres-backup-system (DevOps) - 6 files

```bash
cp repositories/postgres-backup-system/knowledge/*.md references/postgres-backup-system/
```

Files:
- api_reference.md
- architecture.md
- deployment.md
- development_guide.md
- project_rules.md
- README.md

## 5. PHASE 3: Update SKILL.md

### 5.1 Update Stack Detection Mapping

Add mapping from detected stack to folder name:

```python
STACK_TO_FOLDER = {
    "GO_BACKEND": "backend-system",
    "ANGULAR": "fe-partners-app",
    "EXPO": "barter-expo",
    "REACT_NATIVE": "barter-expo",
    "PYTHON": "gaia-services",
    "DEVOPS": "postgres-backup-system"
}
```

### 5.2 Update route_resources() Function

Change from:
```python
load(".opencode/knowledge/go_standards.md")  # External!
```

To:
```python
folder = STACK_TO_FOLDER[stack]
load(f"references/{folder}/go_standards.md")  # Bundled!
```

### 5.3 Update Resource References

Replace all external `.opencode/knowledge/` references with `references/{folder}/` paths.

## 6. PHASE 4: Cleanup

### 6.1 Remove REDIRECT.md

Delete `references/REDIRECT.md` as it's no longer needed.

### 6.2 Verify No Broken References

Search for any remaining `.opencode/knowledge/` references in SKILL.md and update.

## 7. VERIFICATION

### 7.1 File Count Verification

| Folder | Expected | Actual |
|--------|----------|--------|
| common/ | 1 | ? |
| backend-system/ | 17 | ? |
| fe-partners-app/ | 9 | ? |
| barter-expo/ | 7 | ? |
| gaia-services/ | 6 | ? |
| postgres-backup-system/ | 6 | ? |

### 7.2 SKILL.md Verification

- [ ] No `.opencode/knowledge/` references remain
- [ ] All `references/{folder}/` paths are valid
- [ ] Stack detection maps to correct folders
- [ ] REDIRECT.md removed

### 7.3 Functional Test

- [ ] Skill loads successfully
- [ ] Go project triggers backend-system resources
- [ ] Angular project triggers fe-partners-app resources
- [ ] React Native project triggers barter-expo resources

## 8. ROLLBACK PLAN

If issues arise:
1. Original files remain in `repositories/*/knowledge/`
2. Restore REDIRECT.md from git
3. Revert SKILL.md changes
