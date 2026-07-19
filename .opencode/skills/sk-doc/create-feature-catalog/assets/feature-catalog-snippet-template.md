---
title: Feature Catalog Snippet Template
description: Template for per-feature reference files stored directly under feature-catalog category directories.
trigger_phrases:
  - "feature catalog snippet"
  - "per feature file template"
  - "feature snippet scaffold"
  - "split catalog feature file"
importance_tier: normal
contextType: general
version: 1.8.0.5
---

# Feature Catalog Snippet Template

Per-feature reference files for split feature catalogs. Use this template for the one-file-per-feature contract described in the main feature catalog template.

---

## 1. OVERVIEW

Each feature file is the canonical home for detailed current-reality reference material. The root `feature-catalog.md` stays readable by summarizing the feature and linking here, while the per-feature file carries the fuller behavior description, structured source-file references, validation anchors, and concise metadata.

| Use this template when | Do NOT use this template for |
|---|---|
| Creating one file per catalog feature | General reusable prose fragments |
| Adding a feature to an existing split catalog | Replacing the root feature catalog |
| A feature needs structured source-file + test references | Splitting one feature across multiple files without clear reason |
| A feature maps to a named MCP tool or CLI command | Features not yet shipped (mark as not-yet-implemented in HOW IT WORKS instead) |

---

## 2. FRONTMATTER CONTRACT

All per-feature snippet files require this frontmatter block. Fields marked `# required` must appear in every file; fields marked `# optional` may be omitted if not applicable.

```yaml
---
title: "{FEATURE_NAME}"                           # required — human-readable label, matches H3 in root catalog
description: "{ONE_LINE_FEATURE_SUMMARY}"         # required — shown in catalog tables and advisor doc matches
trigger_phrases:                                   # required — drives skill-advisor routing (doc-trigger harvest; memory does not index skill docs)
  - "{primary trigger phrase}"
  - "{alternate phrasing}"
  - "{tool or command name}"
  - "{user-visible label if different}"
importance_tier: "important"                       # optional — omit unless this is a Tier 1 critical feature
version: 1.0.0.0
---
```

**Field notes:**
- `trigger_phrases` must match the H3 feature heading used in the root `feature-catalog.md` (plus natural language alternates)
- `importance_tier: "important"` is reserved for features that should rank as high-signal in skill-advisor routing — omit for standard entries
- `title` and `description` should mirror the root catalog entry for this feature (same wording, same scope)

---

## 3. TEMPLATE SCAFFOLD

Copy everything inside the code fence into `feature-catalog/{CATEGORY_DIR}/{FEATURE_SLUG}.md`. Both placeholder values must be kebab-case:

```markdown
---
title: "{FEATURE_NAME}"
description: "{OVERVIEW_ONE_LINE}"
trigger_phrases:
  - "{primary trigger phrase}"
  - "{alternate phrasing}"
  - "{tool or command name}"
  - "{user-visible label if different}"
# importance_tier: "important"   # uncomment only for Tier 1 critical features
version: 1.0.0.0
---

# {FEATURE_NAME} ({tool_name_or_command})

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

{OVERVIEW_ONE_LINE}

{OVERVIEW_DETAIL}

---

## 2. HOW IT WORKS

<!-- Short section (≤3 paragraphs): write plain prose and delete the sub-headings below.
     Long section (>3 paragraphs): keep or rename sub-headings and delete this comment. -->

### {PRIMARY_BEHAVIOR_ASPECT}

{Description of the core behavior from the caller's perspective.}

### {SECONDARY_BEHAVIOR_ASPECT}

{Description of a distinct aspect — quality gates, routing logic, async behavior, etc.}

<!-- Add further H3 sub-headings as needed. Common ones:
     Configuration | Quality Gates | Edge Cases | Async & Safety | Post-Action Behavior -->

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `{IMPLEMENTATION_FILE_1}` | {Handler\|Shared\|Script} | {ROLE_1} |
| `{IMPLEMENTATION_FILE_2}` | {Handler\|Shared\|Script} | {ROLE_2} |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `{TEST_FILE_1}` | {Automated test\|Manual playbook} | {TEST_ROLE_1} |
| `{TEST_FILE_2}` | {Automated test\|Manual playbook} | {TEST_ROLE_2} |

---

## 4. SOURCE METADATA

- Group: {CATEGORY_NAME}
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `{CATEGORY_DIR}/{FEATURE_SLUG}.md`

Related references:
- [{neighboring-feature}.md]({neighboring-feature}.md) — {brief description}
- [{neighboring-feature}.md]({neighboring-feature}.md) — {brief description}
```

---

## 4. AUTHORING NOTES

**Frontmatter**
- `trigger_phrases` must align with the H3 feature heading in the root catalog — copy the heading exactly as one phrase, then add natural-language alternates and the tool/command name.
- Use `importance_tier: "important"` only for features that must surface in every relevant search — omit for standard catalog entries.

**H1 heading**
- Include the tool or command name in parentheses when the feature maps to a named MCP tool, CLI command, or function: `# Memory indexing (memory_save)`.
- Omit the parenthetical if the feature is a subsystem behavior with no single named entry point.

**OVERVIEW**
- First paragraph: one-liner summary matching the root catalog description.
- Second paragraph: additional detail — typical caller, failure modes, or non-obvious scope. Do not repeat the root catalog verbatim.

**HOW IT WORKS**
- Describe behavior from the caller/operator perspective, not from the implementation.
- If the section exceeds 3 paragraphs, break it into H3 sub-headings — e.g. `### Core Behavior`, `### Quality Gates`, `### Configuration`, `### Edge Cases`. Don't let a wall of prose stand without navigation anchors.
- Use the optional subsections (Trigger / Auto-Fire Path / Class / Caveats) for features with distinct runtime modes (auto-fire, half-auto, manual); omit them for simple request/response features.
- If the feature is not yet implemented, say so clearly in this section and leave SOURCE FILES tables empty or stub-only.

**SOURCE FILES**
- Layer column valid values: `Handler`, `Shared`, `Script`, `Test`.
- Type column valid values: `Automated test`, `Manual playbook`.
- List only stable public-facing paths. Omit transient build artifacts or generated files.
- If no implementation files exist yet, add a single row: `| — | — | Not yet implemented |`.

**SOURCE METADATA**
- Preserve the feature file path after publication — other docs link to this path. Category folders and per-feature files use descriptive kebab-case names without numeric prefixes.
- Related references: link to the immediately adjacent features in the same category directory so readers can navigate without returning to the root catalog.

---

## 5. CHECKLIST

Before publishing a per-feature snippet file, verify:

```markdown
Structure:
- [ ] Frontmatter has title, description, and trigger_phrases
- [ ] importance_tier present only if this is a Tier 1 critical feature
- [ ] Template marker present after H1: <!-- sk-doc-template: skill_asset_feature_catalog -->
- [ ] All four body sections present: OVERVIEW, HOW IT WORKS, SOURCE FILES, SOURCE METADATA

Content:
- [ ] trigger_phrases include the H3 heading from root catalog plus natural-language alternates
- [ ] H1 includes tool name in parens when feature maps to a named tool or command
- [ ] HOW IT WORKS describes shipped behavior (not speculative roadmap)
- [ ] Source-file tables reference real, existing paths
- [ ] "Canonical catalog source" uses lowercase kebab-case: feature-catalog.md

Quality:
- [ ] This per-feature file is linked from the matching root catalog entry
- [ ] Related references at the bottom point to real neighboring feature files
```
