---
title: Level Selection Guide
description: Guide to selecting appropriate documentation levels based on task complexity.
---

# Level Selection Guide - Complexity Scoring Algorithm

Guide to selecting appropriate documentation levels based on task complexity.

---

## 1. OVERVIEW

> Use `--level N` with `.opencode/skills/system-spec-kit/scripts/spec/create.sh` to select a level directly.

The complexity detection system automatically analyzes task descriptions to:
- Recommend appropriate documentation levels (1, 2, 3, or 3+)
- Enable level-appropriate template features via COMPLEXITY_GATE markers
- Scale section counts dynamically based on complexity

**Why Level Selection Matters:**
- Documentation ranges from under 60 LOC (simple) to over 3,000 LOC (complex)
- Static templates cannot cover this variance
- Explicit level selection ensures appropriate documentation depth

---

## 2. SCORING ALGORITHM

`scripts/spec/recommend-level.sh` scores tasks across 4 weighted factors (0-100 scale):

| Factor          | Weight | What It Measures                                  |
|-----------------|--------|---------------------------------------------------|
| **LOC**         | 35%    | Lines-of-code estimate (0-35 points)              |
| **File Count**  | 20%    | Number of files modified (0-20 points)            |
| **Risk**        | 25%    | auth (+10), api (+8), db (+7) — capped at 25      |
| **Complexity**  | 20%    | Architectural change (+20)                        |

### Factor Details

#### LOC (35%)
Linear interpolation across thresholds:
- 0-50 LOC: 0-8 points
- 51-150 LOC: 8-18 points
- 151-400 LOC: 18-28 points
- 401-1000 LOC: 28-35 points
- >1000 LOC: 35 points (max)

#### File Count (20%)
Linear interpolation across thresholds:
- 1-3 files: 0-5 points
- 4-8 files: 5-10 points
- 9-15 files: 10-16 points
- 16-30 files: 16-20 points
- >30 files: 20 points (max)

#### Risk (25%)
Sum of risk flags, capped at 25:
- `--auth` (authentication/authorization): +10
- `--api` (API changes): +8
- `--db` (database changes): +7

#### Complexity (20%)
- `--architectural` (architectural change): +20

### Phase Scoring (optional, separate from level)

Phase scoring uses its own 5 signals (max 50 points), enabled by default:
- Architectural flag: +10
- Files > 15: +10
- LOC > 800: +10
- Risk flags >= 2: +10
- Extreme scale (Files > 30 OR LOC > 2000): +10

Phases are recommended when phase score >= 25 (threshold) AND recommended level >= 3.
Score 25-34 → 2 phases; 35-44 → 3 phases; 45+ → 4+ phases.

---

## 3. LEVEL MAPPING

| Score     | Level | Name         | Description                              |
|-----------|-------|--------------|------------------------------------------|
| <25       | 0     | Quick        | Trivial changes, no formal spec needed   |
| 25-44     | 1     | Baseline     | Standard tasks, basic documentation      |
| 45-69     | 2     | Verification | Complex tasks, full verification         |
| 70+       | 3     | Full         | Critical/architectural, comprehensive    |

**Level 3+ (Extended)** is an override applied on top of Level 3, not a separate score band. Coordination-root packets governing multi-phase efforts should use Level 3+ regardless of complexity score, as they require governance artifacts (phase maps, ADR records) not covered by Level 3.

### Level 3+ (Extended) Features

Level 3+ includes everything from Level 3 plus:
- AI Execution Protocol section
- Dependency graph visualization (ASCII/DAG)
- Effort estimation framework
- Extended checklist items (100-150 items)
- Sign-off requirements

---

## 4. CLI TOOL

### spec/create.sh

Create spec folder with pre-expanded templates from level-specific folders:

```bash
# Create Level 1 spec folder (default)
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Simple bugfix"

# Create Level 2 spec folder
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Add OAuth2 authentication" --level 2

# Create Level 3 spec folder
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Major architecture redesign" --level 3

# Create Level 3+ spec folder (extended)
bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Platform migration" --level 3+
```

**Template Source:**
Templates are Level-gated manifest files rendered by `create.sh`:
- Level 1 - spec.md, plan.md, tasks.md, implementation-summary.md
- Level 2 - Level 1 plus checklist.md
- Level 3 - Level 2 plus decision-record.md
- Level 3+ - Level 3 file set with governance sections rendered by gate

> **Source of truth for template LOC counts:** [level_specifications.md](./level_specifications.md)

---

## 5. DYNAMIC SECTION SCALING

Sections scale based on detected complexity:

| Section | Level 1 | Level 2 | Level 3 | Level 3+ |
|---------|---------|---------|---------|----------|
| User Stories (spec.md) | 1-2 | 2-4 | 4-8 | 8-15 |
| Phases (plan.md) | 2-3 | 3-5 | 5-8 | 8-12 |
| Tasks (tasks.md) | 5-15 | 15-50 | 50-100+ | 100+ |
| Checklist Items | 10-20 | 30-50 | 60-100 | 100-150 |
| AI Protocol | None | None | Optional | Required |
| Dependency Graph | None | Table | ASCII | Full DAG |

---

## 6. VALIDATION RULES

Four validation rules ensure complexity consistency:

### check-complexity.sh
Validates declared level matches actual content metrics:
- User story count within expected range
- Phase count within expected range
- Task count within expected range
- AI protocol present for Level 3+

### check-section-counts.sh
Validates section counts for declared level:
- H2 section minimums per file
- H3 section minimums per file
- Requirements count
- Acceptance scenarios count

### check-ai-protocols.sh
For Level 3+ specs, validates AI protocol components:
- Pre-Task Checklist present
- Execution Rules table present
- Status Reporting Format present
- Blocked Task Protocol present

### check-level-match.sh
Validates level consistency across all spec files:
- spec.md, plan.md, checklist.md declare same level
- Required files exist for declared level

### Running Validation

```bash
# Run all complexity validation rules
bash .opencode/skills/system-spec-kit/scripts/rules/check-complexity.sh specs/XXX/
bash .opencode/skills/system-spec-kit/scripts/rules/check-section-counts.sh specs/XXX/
bash .opencode/skills/system-spec-kit/scripts/rules/check-ai-protocols.sh specs/XXX/
bash .opencode/skills/system-spec-kit/scripts/rules/check-level-match.sh specs/XXX/

# Exit codes:
# 0 = PASS
# 1 = WARN (non-blocking)
# 2 = FAIL (blocking)
```

---

## 7. RELATED RESOURCES

### Templates (Manifest-Based Organization)

Templates are selected from `templates/manifest/spec-kit-docs.json`:

| Level | Source | Rendered Content |
|-------|--------|---------------------|
| Level 1 | `templates/manifest/spec-kit-docs.json` | Baseline templates (spec, plan, tasks, implementation-summary) |
| Level 2 | `templates/manifest/spec-kit-docs.json` | Level 1 + checklist |
| Level 3 | `templates/manifest/spec-kit-docs.json` | Level 2 + decision-record, lazy research |
| Level 3+ | `templates/manifest/spec-kit-docs.json` | Level 3 file set with governance sections |

**Example paths:**
- `templates/manifest/spec.md.tmpl` - Level-gated spec template
- `templates/manifest/checklist.md.tmpl` - Level-gated checklist template
- `templates/manifest/decision-record.md.tmpl` - Level-gated ADR template
- `templates/manifest/spec.md.tmpl` - Level 3+ spec sections are rendered by gate

### Reference Documentation
- [level_specifications.md](./level_specifications.md) - Complete level requirements
- [template_guide.md](./template_guide.md) - Template selection and adaptation

---
