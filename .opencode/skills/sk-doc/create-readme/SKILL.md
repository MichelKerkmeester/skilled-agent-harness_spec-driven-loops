---
name: create-readme
description: Author sk-doc folder, code-folder and skill/project READMEs plus folded five-phase install guides.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-readme, folder readme, code folder readme, project readme, skill readme, install guide, /create:readme, audit_readmes -->

# Create README (workflow)

`create-readme` is the README authoring packet in the `sk-doc` family. It writes current-state folder READMEs and install guides from local evidence, using packet-local templates under `assets/` and shared create-quality-control validators under `../shared`.

---

## 1. WHEN TO USE

### Activation Triggers

Use this packet when the request involves:

- Creating or refreshing a folder `README.md`.
- Documenting a project, skill, feature, component or source-code directory.
- Writing developer orientation for a code folder, including topology, boundaries, entrypoints and validation.
- Creating an install guide for MCP servers, plugins, CLI tools or development dependencies.
- Running `/create:readme`.

Keyword triggers: `create readme`, `/create:readme`, `readme`, `folder readme`, `write readme`, `README.md`, `install guide`, `installation guide`, `setup guide`, `code folder readme`.

### When NOT to Use

Use another `sk-doc` packet when:

- The user wants to audit, validate, score, or optimize an existing README or another existing document without authoring or refreshing it. Use `create-quality-control`.
- The user wants to scaffold a skill, agent, command, benchmark package, feature catalog, testing playbook, flowchart, or changelog. Use `create-skill`, `create-agent`, `create-command`, `create-benchmark`, `create-feature-catalog`, `create-manual-testing-playbook`, `create-flowchart`, or `create-changelog`.
- The target is not markdown.
- The folder is self-explanatory and a parent README or inline comments already give enough orientation.

This is a nested workflow packet under the `sk-doc` parent hub. It owns README and install-guide authoring only. It does not carry `graph-metadata.json`; advisor identity, skill graph metadata and cross-packet routing live at the `sk-doc` hub root.

---

## 2. SMART ROUTING

Route by artifact type first, then by folder purpose.

| Request | Output | Primary Template |
| --- | --- | --- |
| Project, skill, feature or component README | `README.md` in the target folder | `assets/readme_template.md` |
| Source-code folder README | `README.md` in the source folder | `assets/readme_code_template.md` |
| Install guide | Markdown guide, usually under `.opencode/install_guides/` | `assets/install_guide_template.md` |

This packet uses simple artifact routing. It selects README, code-folder README, or install-guide behavior from request intent and target-folder purpose. It does not use runtime keyed resource discovery by project, stack, mode or model. The only packet-local resource groups are `references/readme/`, `references/install_guide/` and `assets/`.

Router resilience rules:

- Load optional markdown resources only after resolving them under this packet and confirming they exist.
- Treat `references/README.md` as the fallback route map when artifact type or folder purpose is unclear.
- Ask for the missing artifact type, target folder or validation expectation instead of silently loading no resources.
- Do not add a full `references/<key>/` or `assets/<key>/` runtime-key router unless this packet gains real keyed resource subdirectories.

### Smart Router Pseudocode

For this flat-reference packet, the canonical resilient router discovers resources at call
time, guards and loads only what exists, scores the three artifact intents, and returns a
disambiguation checklist rather than silently loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Three output artifacts; keywords come from this packet's activation triggers.
INTENT_MODEL = {
    "readme": {"weight": 4, "keywords": ["readme", "folder readme", "create readme", "write readme", "project readme", "skill readme"]},
    "code_readme": {"weight": 4, "keywords": ["code folder readme", "source-code folder readme", "source code readme"]},
    "install_guide": {"weight": 4, "keywords": ["install guide", "installation guide", "setup guide"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the artifact type (README vs code README vs install guide)",
    "Confirm the target folder",
    "Confirm the validation expectation",
]

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(path for path in base.rglob("*.md") if path.is_file())
    return {doc.relative_to(SKILL_ROOT).as_posix() for doc in docs}

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, inventory, loaded, seen) -> None:
    guarded = _guard_in_skill(relative_path)
    if guarded in inventory and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def score_intents(request) -> dict:
    text = request.text.lower()
    scores = {intent: 0 for intent in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw in cfg["keywords"]:
            if kw in text:
                scores[intent] += cfg["weight"]
    return scores

def route_readme_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: unclear artifact type
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    artifact_type = max(scores, key=scores.get)               # Tier 2: happy path
    # references/readme/ and references/install_guide/ are artifact groups, not a runtime
    # key-space: this packet does not use runtime keyed resource discovery. The artifact
    # type selects the template already documented above; load the flat refs that exist.
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"artifact_type": artifact_type, "resources": loaded}
```

Use this README decision tree:

```text
Is this a project root?
+-- YES: write a general README using the sections the audience needs
`-- NO: is this a reusable component?
    +-- YES: write a component README trimmed to API, examples, configuration and known issues
    `-- NO: is someone likely to land here?
        +-- YES: write a focused README with overview plus needed navigation or usage
        `-- NO: skip README and use inline comments or parent documentation
```

Use the install-guide decision tree:

```text
Is the tool already well documented?
+-- YES: link to official docs unless project-specific setup exists
`-- NO: does it require AI platform configuration, project-specific settings or multi-step setup?
    +-- YES: create an install guide
    `-- NO: document the one-line install command inline
```

---

## 3. HOW IT WORKS

Every run follows one operating model, whatever the artifact:

1. Read local evidence first: the target folder, nearby docs, package files, config files and existing commands. Never document unconfirmed files, commands, APIs or metrics.
2. Route by artifact type and folder purpose (Section 2) to pick the output and template.
3. Draft current-state content only, in the smallest useful shape: a general README (Section 5), a code-folder README (Section 6) or an install guide (Section 7).
4. Copy the matching template as a scaffold, remove unused sections and put orientation first.
5. Validate the authored markdown and resolve local links before delivery (Section 8).

READMEs and install guides share this lifecycle. The sections below give the detailed steps for each.

---

## 4. README AUTHORING WORKFLOW

1. Identify the target folder, audience and README type before drafting.
2. Read the target folder contents, nearby documentation, package files, config files and existing commands.
3. Do not invent commands, files, APIs, metrics, features or capabilities.
4. Choose the smallest useful README shape. Use a general README for project, skill, feature and component roots. Use a code-folder README for source-directory orientation.
5. Write current-state documentation only. Use stable file paths, commands, feature names and source links instead of packet IDs, phase IDs, migration history or temporary planning labels.
6. Put orientation first: what this is, who it is for and how to use or navigate it.
7. Apply progressive disclosure: title and tagline answer "what is this", overview helps the reader decide relevance, quick start appears only when there is a runnable path and detailed reference comes later.
8. Use two-tier voice for project, skill and feature READMEs: plain narrative for overview and usage, precise reference tables for options, configuration and tool signatures.
9. Use technical reference voice for component and code-folder READMEs.
10. Copy the relevant template only as a scaffold. Remove unused sections instead of leaving placeholders.
11. Use relative links for local documents and verify that links resolve from the README location.
12. Test documented commands when feasible. If a command cannot be tested locally, mark it clearly as an example.
13. Show expected output for verification commands.
14. Validate the authored markdown before delivery.

---

## 5. GENERAL README OUTPUT SHAPE

A general README answers two questions: what this is, and how someone uses or navigates it.

Use only the sections that fit the audience.

| Section | Include When | Content |
| --- | --- | --- |
| Overview | Always | Purpose, audience, main value and prerequisites |
| Key Statistics | Useful facts help readers decide scope | Counts, version, supported modes or limits |
| How This Compares | Readers may confuse this with nearby tools | Short comparison table |
| Quick Start | Readers need to run or try something | Short setup, verification and first use |
| Features | Capabilities need explanation | Feature groups, behavior notes and examples |
| Requirements | Runtime, tool or service needs exist | Minimum versions, permissions and external services |
| Structure | Navigation matters | Directory tree and key files |
| Configuration | Settings exist | Config files, options, defaults and env vars |
| Usage Examples | Patterns are easier shown than described | Simple and advanced examples with expected results |
| Troubleshooting | Users can hit known issues | What they see, cause and fix |
| FAQ | Repeated questions exist | Short answers only |
| Related Resources | Links exist | Grouped skills, documents, commands or external references |

General README format rules:

- H1 is a plain title.
- Add a one-sentence blockquote tagline immediately after the H1.
- H2 headings are numbered and ALL CAPS, for example `## 1. OVERVIEW`.
- Numbered H3 and H4 subsections inside feature sections are ALL CAPS, for example `### 3.1 TECHNICAL REFERENCE`.
- Unnumbered H3 and H4 headings use Title Case.
- Use `---` horizontal rules between H2 sections.
- Do not add a Table of Contents.
- Do not add `<!-- ANCHOR -->` navigation comments.
- Use tables for comparisons, file maps, configuration, options and troubleshooting.
- Use fenced code blocks with language tags.

Frontmatter is optional for normal project READMEs and recommended for skill or system documentation that should be discoverable.

```yaml
---
title: "[DOCUMENT_TITLE]"
description: "[One-sentence description]"
trigger_phrases:
  - "[search phrase]"
  - "[routing phrase]"
---
```

---

## 6. CODE-FOLDER README OUTPUT SHAPE

Create a code-folder README when a developer needs local orientation before editing the directory.

Include details when relevant:

- High-level purpose: what the folder owns.
- Architecture diagram: how callers, handlers, adapters and storage relate.
- Package topology: layers, zones and allowed dependency direction.
- Directory tree with only important files.
- Key files and responsibilities.
- Boundaries: what this folder may import, export or own.
- Data or control flow through important paths.
- Public entrypoints, exports or commands.
- Validation and test commands.
- Related documents.

Use this section model:

| Section | Include When | Notes |
| --- | --- | --- |
| Overview | Always | One or two paragraphs about current responsibility |
| Architecture Diagram | Helpful for dispatch, pipelines, adapters or layered flows | Prefer zones and arrows over prose |
| Package Topology | The folder has layers, zones or import rules | Show dependency direction clearly |
| Directory Tree | Always for multi-file folders | Show only important files |
| Key Files | Responsibilities are split | Table with file and role |
| Boundaries | Import rules or ownership matter | State allowed and disallowed edges |
| Data or Control Flow | Runtime paths matter | Keep to the main path |
| Entrypoints | The folder exposes APIs, commands or exports | Include function names, files or CLI commands |
| Validation | Tests or checks exist | Use commands that work from repo root |
| Related | Nearby docs exist | Link parent, sibling and architecture docs |

Code-folder README rules:

- Document current behavior only.
- Use code terms exactly as they appear in files.
- Prefer file paths, exported names and commands over narrative history.
- Keep diagrams small enough to read in a terminal.
- State allowed dependency direction when the folder has layers.
- Do not force Quick Start, Features, FAQ or Troubleshooting unless the directory has runnable commands, meaningful capabilities or known reader problems.

---

## 7. INSTALL GUIDE WORKFLOW

1. Confirm the install needs a guide rather than a one-line command or link to official docs.
2. Identify the install-guide type: MCP server, CLI tool, plugin or development dependency.
3. Read the tool docs, repo files, package metadata and existing config examples.
4. Build the folded five-phase flow: prerequisites, installation, initialization when needed, configuration and verification.
5. Use the 11-section install-guide structure: sections 0 through 10, with sections 7 and 8 optional.
6. Put an AI-first copy-paste prompt at the top that states what the AI will do and the expected time.
7. Include a 2-4 sentence H1 description that states what the guide covers, key capabilities, workflow or approach and value.
8. Add a Core Principle blockquote in Overview: install once, verify at each step.
9. End every phase with a validation checkpoint named `phase_N_complete`.
10. Add a STOP block after every validation checkpoint that can fail.
11. Use one command per purpose and make commands copy-pasteable.
12. Include expected output for every validation command.
13. Include platform-specific configuration only when it is real for the tool.
14. Put troubleshooting in its own reference section, not inside the phase flow.
15. Test commands when feasible, or mark unverified commands clearly.

Install guide phases:

```text
Phase 1: Prerequisites  -> Validate: tools exist
Phase 2: Installation   -> Validate: binaries installed
Phase 3: Initialization -> Validate: index or database initialized, if applicable
Phase 4: Configuration  -> Validate: config files created and valid
Phase 5: Verification   -> Validate: system works end-to-end
```

Required install-guide structure:

| # | Section | Required | Validation Gate |
| --- | --- | --- | --- |
| 0 | AI-First Install Guide | Yes | none |
| 1 | Overview | Yes | none |
| 2 | Prerequisites | Yes | `phase_1_complete` |
| 3 | Installation | Yes | `phase_2_complete`, `phase_3_complete` |
| 4 | Configuration | Yes | `phase_4_complete` |
| 5 | Verification | Yes | `phase_5_complete` |
| 6 | Usage | Yes | none |
| 7 | Features | Optional | none |
| 8 | Examples | Optional | none |
| 9 | Troubleshooting | Yes | none |
| 10 | Resources | Yes | none |

Validation checkpoint format:

````markdown
### Validation: `phase_N_complete`

```bash
<validation-command>
```

**Expected output**:

```text
<expected-output-pattern>
```

**Checklist**:

- [ ] Output matches expected pattern
- [ ] No error messages displayed

❌ **STOP if validation fails** - See [Troubleshooting](#troubleshooting).
````

Troubleshooting format:

| Error | Cause | Fix |
| --- | --- | --- |
| `command not found: tool` | Not in PATH | Run the install command again and verify PATH |
| `Invalid configuration` | Malformed JSON | Validate JSON syntax and check quoted paths |

Install guides should contain 5+ STOP blocks across all validation checkpoints and 5+ troubleshooting errors with actionable fixes.

---

## 8. VALIDATION

Run shared validation on authored markdown when feasible:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <path>
```

Use quick validation or structure extraction when appropriate:

```bash
python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py <path>
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py <path>
```

As an internal authoring check after creating or refreshing READMEs, the packet-local inventory script can verify repository coverage from the repo root:

```bash
python3 .opencode/skills/sk-doc/create-readme/scripts/audit_readmes.py --repo-root . --validator .opencode/skills/sk-doc/shared/scripts/validate_document.py
```

Use `--json-out`, `--markdown-out` or `--inventory-out` when the user needs artifacts. Treat broken references, missing key artifact coverage and validator blocking errors as findings to fix or report.

Pre-publish checks for READMEs:

- README type is correct. Code folders use the code-folder shape.
- Included sections match the audience and task.
- No empty sections or placeholders remain.
- Section numbers are sequential.
- Local links use correct relative paths.
- Commands were tested or clearly marked as examples.
- Expected outputs are shown for verification commands.
- Code blocks specify language tags.
- HVR passes.

Pre-publish checks for install guides:

- All required sections are present.
- Core Principle blockquote appears in Overview.
- All phases have validation checkpoints.
- STOP conditions appear after every validation checkpoint that can fail.
- Prerequisites include version requirements.
- Configuration examples are complete for the supported platforms.
- Troubleshooting table has 5+ actionable entries.
- Time estimate appears in the AI-First section.

---

## 9. WRITING RULES

Always:

- Read the target folder and nearby docs before writing.
- Choose the README type before choosing a template.
- Keep READMEs current-state and reader-focused.
- Use relative links for local documents.
- Use fenced code blocks with language tags.
- Test documented commands when feasible.
- Show expected output for verification commands.
- Use tables for file maps, options, comparisons and troubleshooting.
- Keep `README.md` and `SKILL.md` casing intact.

Never:

- Add a Table of Contents or anchor-comment navigation.
- Leave template placeholders in the final document.
- Document commands, files or features not confirmed from workspace or user evidence.
- Cite mutable packet numbers, phase IDs or migration bookkeeping in durable README content.
- Force Quick Start, Features, FAQ or Troubleshooting into a code-folder README when the folder only needs orientation.
- Proceed past a failed install-guide checkpoint without a STOP instruction.
- Create `graph-metadata.json` in this packet.

Human Voice Rules apply:

- No em dashes. Use commas, periods or colons.
- No semicolons. Split the sentence or use "and".
- No Oxford comma in inline lists.
- No setup phrases.
- No banned words from the HVR reference.
- Prefer active voice and direct verbs.
- Use analogies only when they clarify narrative sections. Do not use analogies in component or code-folder READMEs.

Escalate if:

- The target folder purpose or audience is unclear.
- The README would require product, brand or public-facing claims that are not in the repo.
- Install steps need secrets, paid services, destructive operations or external accounts.
- Validation fails in a way that requires changing code or configuration outside the requested document.

---

## 10. OVERFLOW REFERENCES

The core workflow lives in this `SKILL.md`. Use these files only for deep overflow detail, exhaustive scaffolds, edge cases and long examples:

- `assets/readme_template.md` for the full fillable general README scaffold.
- `assets/readme_code_template.md` for the full fillable code-folder scaffold and diagram examples.
- `assets/install_guide_template.md` for full install-guide examples and platform config patterns.
- `references/README.md` for the overflow route map that indexes the `readme/` and `install_guide/` reference groups.
- `references/readme/` for extended README type, voice, writing-pattern and quality detail across three single-concern files.
- `references/install_guide/` for extended install-guide section examples, platform config and quality standards across two single-concern files.
- `../shared/references/core_standards.md` for shared document formatting rules.
- `../shared/references/hvr_rules.md` for the full Human Voice Rules.
- `../shared/references/evergreen_packet_id_rule.md` for current-state documentation rules.
