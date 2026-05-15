# Iter 002 — Track 1: Anchor Coverage Gap Analysis

## Template Pattern Analysis

The `skill_md_template.md` uses anchor tags with the pattern:
- Start: `<!-- ANCHOR:{number}-{kebab-case-name} -->`
- End: `<!-- /ANCHOR:{number}-{kebab-case-name} -->`

Numbers correspond to section H2 numbering (1, 2, 3, etc.), names are kebab-case versions of section headers.

## Findings: Missing Anchor Tags in system-spec-kit/SKILL.md

### 1. Section 1: WHEN TO USE
- **Line 14**: `## 1. WHEN TO USE`
- **Suggested anchor**: `<!-- ANCHOR:1-when-to-use -->`
- **End location**: Before line 76 (the `---` separator)
- **Context**: Section contains "What is a Spec Folder?", "Activation Triggers", "When NOT to Use", "Distributed Governance Rule", and "Utility Template Triggers" subsections

### 2. Section 2: SMART ROUTING
- **Line 78**: `## 2. SMART ROUTING`
- **Suggested anchor**: `<!-- ANCHOR:2-smart-routing -->`
- **End location**: Before line 353 (the `---` separator)
- **Context**: Section contains "Resource Domains", "Template and Script Sources of Truth", "Resource Loading Levels", and "Smart Router Pseudocode" with Python code

### 3. Section 3: HOW IT WORKS
- **Line 355**: `## 3. HOW IT WORKS`
- **Suggested anchor**: `<!-- ANCHOR:3-how-it-works -->`
- **End location**: Before line 377 (the `---` separator)
- **Context**: Section contains "Core Workflow", "Spec Kit Memory", "Validation and Recovery", and "Code Graph and Search Routing" subsections

### 4. Section 4: RULES
- **Line 379**: `## 4. RULES`
- **Suggested anchor**: `<!-- ANCHOR:4-rules -->`
- **End location**: Before line 428 (the `---` separator)
- **Context**: Section contains "✅ ALWAYS", "❌ NEVER", and "⚠️ ESCALATE IF" subsections with detailed rule lists

### 5. Section 5: SUCCESS CRITERIA
- **Line 431**: `## 5. SUCCESS CRITERIA`
- **Suggested anchor**: `<!-- ANCHOR:5-success-criteria -->`
- **End location**: Before line 435 (the `---` separator)
- **Context**: Single-paragraph section defining success conditions

### 6. Section 6: INTEGRATION POINTS
- **Line 437**: `## 6. INTEGRATION POINTS`
- **Suggested anchor**: `<!-- ANCHOR:6-integration-points -->`
- **End location**: Before line 456 (the `---` separator)
- **Context**: Section contains "Quick Reference Commands" table and canonical command lifecycle description

### 7. Section 7: REFERENCES AND RELATED RESOURCES
- **Line 460**: `## 7. REFERENCES AND RELATED RESOURCES`
- **Suggested anchor**: `<!-- ANCHOR:7-references-and-related-resources -->`
- **End location**: End of file (line 466)
- **Context**: Final section describing resource discovery, scripts, and related skills

## Summary

- **Total sections requiring anchors**: 7
- **Total missing anchor pairs**: 7 (0 start anchors, 0 end anchors)
- **Coverage ratio**: 0% (no anchors present)
- **Pattern compliance**: The target file follows the H2 numbered section structure from the template but lacks all anchor tags

## Recommended Action

Add anchor pairs to all 7 main sections following the template pattern to enable proper section referencing and navigation tooling.
