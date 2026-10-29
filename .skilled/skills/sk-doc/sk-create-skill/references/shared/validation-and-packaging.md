---
title: Skill Validation and Packaging
description: Validation requirements and distribution steps for skills - minimal and comprehensive validation, packaging for distribution, and installation.
trigger_phrases:
  - "skill validation requirements"
  - "skill packaging distribution"
  - "quick validate skill"
  - "comprehensive skill validation"
  - "skill installation steps"
importance_tier: normal
contextType: implementation
version: 1.2.4.0
---

# Skill Validation and Packaging

How to validate a skill before release and package it for distribution, covering both the minimal pre-package check and the comprehensive quality pass.

---

## 1. OVERVIEW

This reference covers the two validation tiers a skill passes before release and the distribution steps that follow. Minimal validation is a fast pre-packaging sanity check; comprehensive validation is a full quality pass before distribution.

**Core Principle**: Validate before you package, and package before you distribute.

**When to Use**:
- Before packaging a skill into a distributable zip
- Before releasing or sharing a skill
- When diagnosing why `package_skill.py` rejected a skill

**Key Sources**:
- `scripts/quick_validate.py` - minimal frontmatter sanity check
- `scripts/extract_structure.py` - structure checklist for comprehensive validation
- `scripts/validate_skill_package.py` - completion gate: classifies the root from its registry/router pair (rejecting a half-declared pair as unclassified), runs the parent-hub root checks, and wraps `package_skill.py --check`; standalone class conformance is enforced by the fleet gate `ci-skill-root-metadata.cjs`
- `scripts/package_skill.py` - validation plus packaging

---

## 2. VALIDATION REQUIREMENTS

### Completion Gate (validate_skill_package.py)

**Purpose**: Authoritative pre-completion gate. Run before claiming a skill is done. It delegates the package check, detects standalone versus parent roots from the coupled registry/router declaration, and fails an unclassified root rather than guessing its class.

```bash
scripts/validate_skill_package.py <path/to/skill>
```

### Package Check (package_skill.py --check)

**Purpose**: Authoritative pre-completion gate. Run before claiming a skill is done.

```bash
scripts/package_skill.py <path/to/skill> --check
```

`--check` validates without packaging. It hard-fails on:
- A missing required SKILL.md field (`name`, `description`, `allowed-tools`, `version` — all four).
- A `version` that is not 4-part `X.Y.Z.W`.
- A `name` that does not match the skill folder name.
- A missing required SKILL.md section (e.g., `REFERENCES` with no approved combined-heading variant).

It reports non-kebab generated package paths as advisory findings so existing repository debt remains inspectable. Run `--strict` for a newly generated package: strict validation and actual packaging reject every non-exempt path that is not kebab-case. Python filenames, Python import-package directories, frozen/generated subtrees, and tool-mandated names such as `SKILL.md`, `README.md`, `.utcp_config.json`, `action.yml`, and `conftest.py` remain exact.

### Routing Shape Check

`package_skill.py` also checks the routing shape of every SKILL.md it is given:

- Every skill and every mode packet keeps its machine router in a sibling `ROUTER.md` inside its own folder, under a final `## MACHINE ROUTER` heading.
- `SKILL.md` carries a relative markdown link to `./ROUTER.md` that resolves on disk. Its SMART ROUTING section stays short prose, and a mode packet keeps it to 8 to 12 non-blank lines.
- A `## MACHINE ROUTER` section left in `SKILL.md` is migration debt, because the router belongs in the sibling file.

Five codes report a violation:

- `RS-001`: SMART ROUTING is longer than the limit (12 non-blank lines or 180 words by default).
- `RS-002`: `SKILL.md` carries a `## [N. ]MACHINE ROUTER` section outside a fence. The router belongs in the sibling `ROUTER.md`.
- `RS-003`: a `## MACHINE ROUTER` section is not the last H2 of the document that holds it.
- `RS-004`: a skill or mode packet has no sibling `ROUTER.md` in its own folder, or its real path leaves that folder.
- `RS-005`: `SKILL.md` carries no relative markdown link to `./ROUTER.md`, or the link does not resolve on disk.

A machine router block is a fenced block, or an unfenced run of lines such as an indented one, that holds `INTENT_SIGNALS =`, `RESOURCE_MAP =`, `UNKNOWN_FALLBACK_CHECKLIST =`, `def discover_markdown_resources` or `def _guard_in_skill`. A fence closes only on a run of the same character at least as long as the one that opened it. A `MACHINE ROUTER` section is an H2 heading that matches `## [N. ]MACHINE ROUTER` outside a fence. The heading alone is the finding, with or without a block below it, so a skill that kept only the prose still fails RS-002. A router block with no section around it reports the same code, because it declares routing in the same file.

`--strict` promotes all five to errors. Known debt lives in `.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json`, keyed by the skill's path relative to `.skilled/skills` (for example `sk-code/sk-code-review`). A folder outside that root is never debt. Each entry records `{"lines", "words", "machineBlocks", "codes"}`, and `machineBlocks` counts the RS-002 findings the entry tolerates, one per leftover section or stray block. A listed skill fails when its line count, word count or number of RS-002 findings grows past the record, or when it shows a code the entry does not record. An entry in any other form is ignored. Remove the entry once the skill is migrated. `/create:skill-parent` applies the same rule as `parent-skill-check.cjs` check `12b-routing-shape`.

### Fleet Class Gate (ci-skill-root-metadata.cjs)

The fleet and parent-hub gates validate structure, metadata classes, registry/router parity, and on-disk paths. A passing mechanical gate does not prove that narrative canon agrees with an executable authority; re-read the governing module when maintaining doctrine, templates, or examples.

Run the fleet-wide class gate before release to check metadata presence, forbidden files, and generated-file freshness. `--fix` regenerates derivable files only. The canonical contract is [skill-root-metadata-contract.md](skill-root-metadata-contract.md).

```bash
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix
```

### Minimal Validation (quick_validate.py)

**Purpose**: Pre-packaging sanity check for essential frontmatter requirements.

**Checks**:
1. SKILL.md file exists
2. YAML frontmatter present
3. Required fields: name, description, allowed-tools, version
4. Name format: hyphen-case (and matches folder)
5. No angle brackets in description
6. **Platform compatibility** - Features work across different AI agent environments

**Output**: Pass/fail with error messages

**When to use**: Automatically during packaging

### Comprehensive Validation (markdown-document-specialist)

**Purpose**: Full quality assurance for production-ready skills.

**What “comprehensive validation” means in this repo**:

- **Structure checklist (script)**: Deterministic checks from `extract_structure.py` (frontmatter, headings, required sections, fenced code blocks).
- **Content quality (AI)**: Judgement based on the extracted JSON + the actual text (clarity, completeness, examples).
- **Style compliance (AI)**: Judgement against `core-standards.md` (headings format, bullets, emoji rules, consistency).

**Quality gate (qualitative)**:
- **SKILL.md must have zero checklist failures**.
- If content is unclear/incomplete, iterate until the doc is production-ready (no major gaps).

**When to use**: After packaging, before distribution

**Command**:
```bash
scripts/extract_structure.py .skilled/skills/my-skill/SKILL.md
# AI evaluates the JSON output and provides quality assessment
```

---

## 3. DISTRIBUTION

### Packaging for Distribution

**Command**:
```bash
scripts/package_skill.py <path/to/skill> <output-directory>
```

**Output**: A zip whose filename and archive root match the hyphenated skill folder name. Packaging runs the strict generated-path check before writing the archive.

**Distribution Checklist**:
- ✅ Validation passed
- ✅ Final review completed (no critical gaps)
- ✅ All bundled resources included
- ✅ README or documentation provided
- ✅ Version number in frontmatter (4-part `X.Y.Z.W`; see [frontmatter-versioning.md](../../../sk-create-frontmatter/references/frontmatter-versioning.md))
- ✅ License information (if applicable)

### Installation

**User installation**:
1. Download skill zip file
2. Extract to `.skilled/skills/` directory
3. Skill automatically available to the agent

**Verification**:
- Check skill appears in the agent's skill list
- Test skill with example use case
- Verify bundled resources accessible

---

## 4. RELATED RESOURCES

### Sibling Skill-Creation References
- [creation-workflow.md](../skill/creation-workflow.md) - The 6-step skill creation process
- [common-pitfalls.md](./common-pitfalls.md) - Common skill-creation pitfalls and fixes
- [overview.md](./overview.md) - Skill anatomy and structure system

### Reference Files
- [core-standards.md](../../../shared/references/core-standards.md) - Document type rules and structural requirements
- [validation.md](../../../shared/references/validation.md) - Quality scoring and validation workflows
