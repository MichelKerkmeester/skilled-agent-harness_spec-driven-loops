---
title: "Findings: sk-doc and create-skill logic"
description: "Current-code analysis of the sk-doc routing hub, standalone skill scaffolding, parent-hub creation, validation, and packaging contracts."
status: "current"
created: "2026-07-13"
importance_tier: "important"
contextType: "research"
---

# Findings: sk-doc and create-skill logic

> **Review type:** Read-only implementation analysis.
>
> **Scope:** `.opencode/skills/sk-doc/`, with emphasis on `create-skill/`, its templates, scripts, router metadata, and parent-hub validator.
>
> **Overall verdict:** The hub design is sound, but the creation and validation paths do not fully enforce their written contract.

---

## Executive Summary

`sk-doc` is well structured as a thin routing hub. It presents one public skill identity, uses registry files to choose a workflow, and keeps workflow-specific logic inside nested packets. Both `create-skill` and `create-skill-parent` intentionally route to the same `create-skill/` packet.

The weak point is the creation layer:

1. Standalone skills have an initializer, but parent hubs do not.
2. The initializer embeds its own stale template instead of using the canonical template asset.
3. The validator reports several documented requirements as warnings and still exits successfully.
4. Parent-hub validation exists, but it is separate from the completion command documented by `create-skill`.
5. Several written rules contradict the code, especially the description-length guidance.

The recommended direction is to keep the current hub architecture and replace the fragmented creation path with one template renderer and one strict validation entry point.

---

## How the System Works

```text
User request
   |
   v
sk-doc hub (routing only)
   |
   +-- mode-registry.json: declares available workflows
   |
   +-- hub-router.json: scores intent and selects a workflow
   |
   v
create-skill packet
   +-- create-skill        -> standalone skill
   +-- create-skill-parent -> parent hub with nested packets
```

The separation is deliberate:

- `sk-doc/SKILL.md` says the hub holds no packet-specific logic.
- Each packet owns its workflow, references, templates, scripts, and changelog.
- `create-skill` and `create-skill-parent` are two workflow names over one packet.
- The hub owns the single graph identity; nested packets do not carry their own graph metadata.

This is the right architectural shape. The findings below concern enforcement and generation, not the basic hub model.

---

## Confirmed Strengths

### 1. Clear hub and packet boundary

The hub routes requests but does not duplicate packet behavior. This keeps one public identity without turning the root `SKILL.md` into a monolith.

Evidence:

- `.opencode/skills/sk-doc/SKILL.md:15`
- `.opencode/skills/sk-doc/SKILL.md:47`

### 2. Intentional reuse of the create-skill packet

Standalone creation and parent-hub creation share one packet without creating duplicate advisor identities.

Evidence:

- `.opencode/skills/sk-doc/SKILL.md:25`
- `.opencode/skills/sk-doc/mode-registry.json:30`

### 3. Broad parent-hub checker

`parent-skill-check.cjs` checks the single graph identity, packet directories, companion files, tool unions, aliases, router resources, outcomes, metadata, playbooks, and benchmarks.

Current result:

```text
parent-skill-check: all hard invariants passed, 0 warnings
```

### 4. Deterministic helpers exist where they add value

`init_skill.py` handles directory creation, and `package_skill.py` handles repeatable structural checks and ZIP creation. The intended split between deterministic automation and human content judgment is sensible.

---

## Findings

### 1. Parent-hub creation is described as scaffolding but is manual

**Impact: High**

The packet says it owns standalone skill scaffolding and parent-hub scaffolding. In practice, `init_skill.py` only creates a standalone skill directory with `SKILL.md` and optional example resources. Parent hubs must be assembled manually from several templates.

Why this matters:

- The more complex output has less automation than the simple output.
- Manual copying makes registry, router, graph metadata, tools, and packet names easier to desynchronize.
- The public `create-skill-parent` route promises a stronger capability than the script provides.

Evidence:

- `.opencode/skills/sk-doc/create-skill/SKILL.md:12`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py:342-386`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py:415-416`

### 2. The initializer duplicates and has drifted from the canonical template

**Impact: High**

`init_skill.py` embeds a large `SKILL_TEMPLATE` string instead of rendering `assets/skill/skill_md_template.md`. The two sources already disagree.

Examples:

- The embedded template places `REFERENCES` before `HOW IT WORKS` and `RULES`.
- The canonical template defines the expected order as `WHEN TO USE`, `SMART ROUTING`, `HOW IT WORKS`, `RULES`, then `REFERENCES`.
- The embedded router is much smaller than the resilience pattern required by the canonical template.

Evidence:

- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py:29-160`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md:76-108`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md:181-364`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md:366-479`

### 3. A successful check can still violate written requirements

**Impact: High**

`package_skill.py --check` distinguishes errors from warnings, but several rules written as requirements are warnings only. The command returns success when warnings remain.

Warning-only cases include:

- TODO text in the skill description.
- Missing `ALWAYS`, `NEVER`, or `ESCALATE` rule subsections.
- Missing or incomplete resource frontmatter.
- Missing smart-router resilience markers.
- Placeholder example files.
- Non-standard resource names.

This makes “validation passed” weaker than “the documented skill contract is satisfied.”

Evidence:

- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:185-192`
- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:254-282`
- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:352-357`
- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:395-492`
- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:683-698`

### 4. Description-length guidance contradicts the validator

**Impact: High**

The workflow and canonical template say a skill description should be no more than 130 characters. The validator recommends 150-300 characters and only warns when a description is shorter than 50 or longer than 500 characters.

Both rules cannot be followed at the same time as written.

Evidence:

- `.opencode/skills/sk-doc/create-skill/references/skill/creation_workflow.md:256`
- `.opencode/skills/sk-doc/create-skill/references/shared/common_pitfalls.md:57-67`
- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:188-192`

### 5. Parent validation is not part of the documented completion gate

**Impact: High**

The `create-skill` packet repeatedly names this as the completion gate:

```text
scripts/package_skill.py <path> --check
```

That checker validates a normal skill folder. It does not enforce parent-specific rules such as one graph identity, registry/router parity, packet boundaries, tool unions, or bundle semantics.

Those checks live in a separate command:

```text
.opencode/commands/doctor/scripts/parent-skill-check.cjs
```

A parent hub can therefore pass the documented `create-skill` completion command without proving the parent-hub contract.

Evidence:

- `.opencode/skills/sk-doc/create-skill/SKILL.md:195-197`
- `.opencode/skills/sk-doc/create-skill/SKILL.md:339-344`
- `.opencode/skills/sk-doc/create-skill/references/shared/validation_and_packaging.md:41-55`

### 6. Frontmatter and section parsing are permissive

**Impact: Medium**

The validator uses regular expressions and substring checks instead of parsing YAML and matching exact headings.

Examples:

- A required field is detected by searching for text such as `name:` anywhere in the frontmatter block.
- `allowed-tools: Read` can pass because scalar syntax is rejected only when the value contains a comma.
- A heading passes when it merely contains a required section name as a substring.

These checks are fast, but malformed or misleading documents can pass.

Evidence:

- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:146-219`
- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:232-251`

### 7. Parent templates require avoidable manual cleanup

**Impact: Medium**

The parent-hub templates encode fields that are not valid for every parent:

- The hub template hardcodes `[Read, Write, Edit, Bash, Grep, Glob]`, although the checker requires the exact union of packet tools.
- The router template includes `surfaceBundle` even when the hub has no surface packets.
- The graph metadata template lists a root `README.md`, although the parent contract and checker do not require or generate one.

The written instructions tell authors to remove unused pieces, but a generator should make these decisions from declared packet types.

Evidence:

- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md:103-123`
- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_router_template.json:12-22`
- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_graph_metadata_template.json:82-94`

### 8. The parent checker does not enforce every published exactness rule

**Impact: Medium**

The checker is broad and currently passes `sk-doc`, but some schema promises remain looser than their documentation.

Examples:

- `tieBreak` must contain every mode, but duplicates and extra values are not rejected by the coverage check.
- Aliases are checked for case-insensitive uniqueness, but lowercase form is not required.
- Positive signal weights and non-empty classes/resources are not fully enforced.
- The registered `packetSkillName` is compared with the folder name, but the nested `SKILL.md` frontmatter name is not checked by this validator.

Evidence:

- `.opencode/commands/doctor/scripts/parent-skill-check.cjs:357-393`
- `.opencode/commands/doctor/scripts/parent-skill-check.cjs:727-756`

### 9. ZIP packaging has two inferred edge-case risks

**Impact: Medium; inferred rather than reproduced**

The packaging loop skips files whose immediate filename starts with a dot, but it does not reject files because an ancestor directory is hidden. Files inside a hidden directory may therefore be included.

The ZIP file is created before the source tree is recursively enumerated. If the output directory is inside the skill folder, the output archive may be encountered while packaging.

Evidence:

- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:629-650`

What would confirm these risks:

1. A fixture containing `.private/data.txt`.
2. A packaging run whose output directory is a child of the source skill.
3. Inspection of the resulting archive entries.

---

## Current Validation Evidence

The current repository trees are structurally healthy under their existing validators.

### create-skill packet

Command:

```bash
python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py \
  .opencode/skills/sk-doc/create-skill --check --json
```

Result:

```text
valid: true
warnings: 2
- Missing recommended section: INTEGRATION POINTS
- Missing recommended section: RELATED RESOURCES
```

### sk-doc hub through the normal package checker

Command:

```bash
python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py \
  .opencode/skills/sk-doc --check --json
```

Result:

```text
valid: true
warnings: 4
- Missing recommended section: SUCCESS CRITERIA
- Missing recommended section: INTEGRATION POINTS
- Missing recommended section: RELATED RESOURCES
- Missing discover_markdown_resources smart-router marker
```

The last warning also shows that the normal skill checker does not understand the hub's registry-driven routing style.

### sk-doc hub through the parent checker

Command:

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs \
  .opencode/skills/sk-doc
```

Result:

```text
All hard invariants passed, 0 warnings
```

---

## Recommended Changes

### Priority 1: One canonical generator

Add one creation entry point with an explicit output kind:

```text
init_skill.py --kind standalone
init_skill.py --kind parent
```

The generator should render the files under `assets/` rather than carrying another embedded template.

### Priority 2: One authoritative validation entry point

Create a dispatcher that identifies the output type and runs the correct checks:

```text
standalone -> package_skill validation
parent     -> package_skill validation + parent-skill-check
```

The completion documentation should name this combined command.

### Priority 3: Add strict validation

Keep warning mode for compatibility, but require a strict mode before completion:

```text
package_skill.py <path> --check --strict
```

In strict mode, TODOs, missing required rule sections, missing resource metadata, placeholder files, and incomplete smart-router contracts should fail.

### Priority 4: Parse exact structures

- Parse frontmatter as YAML.
- Require `allowed-tools` to be a real array.
- Match required H2 headings exactly after removing optional numbering and emoji.
- Validate the nested packet's frontmatter name against `packetSkillName`.
- Require `tieBreak` to be an exact permutation of registered modes.

### Priority 5: Centralize shared rules

Move description limits, required sections, naming rules, supported packet types, and tool rules into one machine-readable contract consumed by:

- Templates.
- Initializers.
- Package validation.
- Parent-hub validation.
- Documentation tests.

### Priority 6: Render parent templates conditionally

Generate fields from the selected packet types:

- Include `surfaceBundle` only when surfaces exist.
- Include transport declarations only when transports exist.
- Compute the hub tool union from packet tool surfaces.
- Include optional files only when they are actually generated.

### Priority 7: Add focused fixtures

At minimum, cover:

1. Valid standalone skill.
2. Invalid frontmatter and scalar `allowed-tools`.
3. Warning-only document under normal and strict modes.
4. Workflow-only parent hub.
5. Parent with surface packets.
6. Parent with transport packets.
7. Duplicate or extra `tieBreak` entries.
8. Hidden-directory packaging.
9. Output directory inside the source skill.

---

## Recommended Product Decision

Do not redesign `sk-doc` as another monolith. Its routing-hub architecture is the strongest part of the system.

Concentrate the next work on three boundaries:

1. **Generation:** one renderer for standalone and parent outputs.
2. **Contract:** one machine-readable source for rules and limits.
3. **Verification:** one strict command that proves the correct contract for the detected output type.

That approach fixes the observed drift without replacing a hub model that is already working.

---

## Limitations

- This was a source and validator analysis, not an implementation task.
- No product files were changed while gathering the findings.
- ZIP edge cases are code-based inferences and still need executable fixtures.
- The current validators passing proves conformance to their implemented checks, not to every written requirement.

