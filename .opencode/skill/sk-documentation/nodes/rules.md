---
description: "Mandatory rules (ALWAYS, NEVER, ESCALATE) separated by modes (Quality, Skills, Flowcharts, etc.)."
---
# Workflows Documentation Rules

### ✅ Mode 1: Document Quality

#### ✅ ALWAYS

1. **ALWAYS validate filename conventions** (snake_case, preserve README.md/SKILL.md)
2. **ALWAYS detect document type first** (applies correct enforcement level)
3. **ALWAYS verify frontmatter** for SKILL.md and Command types
4. **NEVER add TOC** (only allowed in README files)
5. **ALWAYS ask about llms.txt generation** (never auto-generate)
6. **ALWAYS apply safe auto-fixes** (H2 case, separators, filenames)
7. **ALWAYS validate before completion** (structure + content + style)
8. **ALWAYS provide metrics** (before/after counts from script output)
9. **ALWAYS run `validate_document.py` before delivery** (exit 0 required for READMEs)
10. **ALWAYS enforce Human Voice Rules (HVR)** on all documentation output. Full ruleset: [hvr_rules.md](../references/hvr_rules.md). Quick reference: `readme_template.md` §9.

#### ❌ NEVER

1. **NEVER modify spec files during active development** (loose enforcement)
2. **NEVER delete original content without approval**
3. **NEVER block for safe violations** (only block: missing frontmatter, wrong order)
4. **NEVER generate llms.txt without asking**
5. **NEVER apply wrong enforcement level**
6. **NEVER use banned HVR words** (leverage, robust, seamless, ecosystem, utilize, holistic, curate, harness, elevate, foster, empower, landscape, groundbreaking, cutting-edge, delve, illuminate, innovative, remarkable)

#### ⚠️ ESCALATE IF

1. Document type ambiguous
2. Critical violations detected
3. Major restructuring needed
4. Style guide missing
5. Conflicts with user intent

### Mode 2: OpenCode Component Creation

#### Skills

##### ✅ ALWAYS

1. **ALWAYS start with concrete examples** (validate understanding)
2. **ALWAYS run init_skill.py** (proper scaffolding)
3. **ALWAYS identify bundled resources** (scripts/references/assets)
4. **ALWAYS use third-person** ("Use when..." not "You should use...")
5. **ALWAYS keep SKILL.md <5k words** (move details to references/)
6. **ALWAYS delete unused examples** (keep lean)
7. **ALWAYS validate before packaging**
8. **ALWAYS recommend final review** (run `extract_structure.py`)

##### ❌ NEVER

1. **NEVER use second-person** (imperative/infinitive only)
2. **NEVER duplicate SKILL.md/references/** (progressive disclosure)
3. **NEVER create without examples**
4. **NEVER skip validation**
5. **NEVER include excessive detail** (SKILL.md is orchestrator)
6. **NEVER use vague descriptions**

##### ⚠️ ESCALATE IF

1. Skill purpose unclear
2. No concrete examples
3. Validation fails repeatedly
4. Unsupported features
5. User input required (brand assets, API docs)

#### Agents

##### ✅ ALWAYS

1. **ALWAYS load agent_template.md first** (template-first workflow)
2. **ALWAYS validate frontmatter** (name, mode, temperature, tools, permission)
3. **ALWAYS include CORE WORKFLOW section** (numbered steps)
4. **ALWAYS include ANTI-PATTERNS section** (what NOT to do)
5. **ALWAYS set explicit tool permissions** (true/false for each tool)
6. **ALWAYS test with real examples** before deployment

##### ❌ NEVER

1. **NEVER create agents without @write agent** (bypasses quality gates)
2. **NEVER skip frontmatter validation** (causes discovery failures)
3. **NEVER use vague tool permissions** (be explicit: true or false)
4. **NEVER omit anti-patterns** (agents need clear boundaries)

##### ⚠️ ESCALATE IF

1. Agent purpose overlaps with existing agent
2. Tool permissions unclear
3. Behavioral rules conflict with AGENTS.md

#### Commands

##### ✅ ALWAYS

1. **ALWAYS load command_template.md first** (template-first workflow)
2. **ALWAYS define clear triggers** (what invokes the command)
3. **ALWAYS include usage examples** (copy-paste ready)
4. **ALWAYS validate command name** (lowercase, colon-separated)

##### ❌ NEVER

1. **NEVER create commands without frontmatter** (required for discovery)
2. **NEVER use ambiguous triggers** (must be unique)
3. **NEVER skip testing** (commands must work on first invocation)

##### ⚠️ ESCALATE IF

1. Command conflicts with existing command
2. Trigger phrase is ambiguous
3. Command requires special permissions

### Mode 3: Flowchart Creation

#### ✅ ALWAYS

1. **ALWAYS use consistent box styles** (single-line process, rounded terminals, diamond decisions)
2. **ALWAYS label all decision branches** (Yes/No or specific outcomes)
3. **ALWAYS align elements** (no diagonal lines, consistent spacing)
4. **ALWAYS show complete paths** (every box has entry/exit)
5. **ALWAYS validate readability**

#### ❌ NEVER

1. **NEVER create ambiguous arrow connections**
2. **NEVER leave decision outcomes unlabeled**
3. **NEVER exceed 40 boxes** (break into sub-workflows)
4. **NEVER mix box styles inconsistently**
5. **NEVER skip spacing and alignment**

#### ⚠️ ESCALATE IF

1. Process exceeds ~40 boxes
2. Interactive/exportable format needed
3. Collaborative editing required
4. Pattern unclear

### Mode 4: Install Guide Creation

#### ✅ ALWAYS

1. **ALWAYS include AI-first install prompt** at the top
2. **ALWAYS use phase validation checkpoints** (phase_N_complete pattern)
3. **ALWAYS provide platform-specific configurations** (OpenCode, Claude Code, Claude Desktop)
4. **ALWAYS include troubleshooting section** with Error → Cause → Fix format
5. **ALWAYS verify commands are copy-paste ready**

#### ❌ NEVER

1. **NEVER skip validation checkpoints** (each phase must validate)
2. **NEVER assume prerequisites** (always list and verify)
3. **NEVER mix platform instructions** (separate clearly)
4. **NEVER use relative paths** in command examples

#### ⚠️ ESCALATE IF

1. Multi-platform complexity requires testing
2. External dependencies unavailable
3. Installation requires special permissions