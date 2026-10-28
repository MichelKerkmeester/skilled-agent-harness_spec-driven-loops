---
name: sk-create-changelog
description: Author global component changelogs in the v4 narrative style, with placement, versioning, lean content and release notes.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.3.7.0
---

<!-- Keywords: create-changelog, /create:changelog, changelog, release notes, global changelog, packet-local changelog, semantic version, nested changelog -->

# create-changelog

`create-changelog` is the changelog-authoring workflow packet of the `sk-doc` family. It writes a global component changelog under `.skilled/changelog/{component}/v{VERSION}.md`. Packet-local (nested) changelogs under a spec packet's `changelog/` folder are deprecated, and this workflow no longer writes them (section 4).

This file is the executable contract: resolve the source, resolve the global target, calculate the version, generate, validate and write. `assets/changelog-template.md` owns what an entry says and how it reads. The `references/` set, routed by `references/README.md`, holds worked examples and edge cases.

---

## 1. WHEN TO USE

### Activation Triggers

Use this workflow to:

1. Create a global component changelog at `.skilled/changelog/{component}/v{VERSION}.md`.
2. Answer a request for a packet-local (nested) changelog: refuse it as deprecated and offer a global component entry instead.
3. Run or support `/create:changelog`.
4. Resolve a changed spec folder, component hint or recent git history into a changelog target.
5. Calculate the next four-part version for a global changelog.
6. Prepare GitHub release notes from a generated global changelog.

Keyword triggers: `create changelog`, `/create:changelog`, `changelog`, `changelog entry`, `release notes`, `global changelog`, `packet-local changelog`, `nested changelog`, `since the last version`, `--bump`, `--release`, `vX.Y.Z.B`.

### When NOT to Use

1. A release plan with no file output.
2. A README (`create-readme`), agent, command, benchmark, flowchart, feature catalog, manual testing playbook or skill. Each has its own `create-*` packet.
3. Auditing, scoring or optimizing an existing changelog (`create-quality-control`).
4. A source too ambiguous to resolve to a spec folder, a component hint or recent git history.
5. Branch, commit or PR work and release mechanics beyond `--release`, which `sk-git` owns. The tag and GitHub release run in the command YAMLs' release step (section 8), and only for the `skilled` release line.

---

## 2. SMART ROUTING

### Family Boundary

This is a nested workflow packet under `sk-doc` and owns changelog authoring only. The single advisor identity lives at the `sk-doc` hub root, so never add a packet-local `graph-metadata.json`.

### Router Resilience

The packet has one output mode, the global component entry (section 6). The advisor does not guarantee that a packet-local request lands here. When one does, the router refuses it as deprecated and offers a global entry. Its references are flat, so it uses no `references/<key>/` discovery.

- Load an optional resource only after resolving it under this packet and confirming it exists.
- Treat `references/README.md` as the fallback route map when the topology or output mode is unclear.
- Ask for the missing source type, target or version intent instead of silently loading nothing.
- Add a `references/<key>/` runtime-key router only if the packet gains keyed subdirectories.

### Smart Router Pseudocode

The resilient router discovers resources at call time, loads only what exists, scores the global intent against the deprecated packet-local one, refuses a packet-local request without writing and returns a disambiguation checklist rather than loading nothing:

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/README.md"

# Two intents, one output mode. Keywords come from this packet's activation triggers.
INTENT_MODEL = {
    "global_component": {"weight": 4, "keywords": ["global changelog", "release notes", "component", "--release", "--bump"]},
    # Deprecated: kept so a packet-local request that lands here is refused and offered a global entry.
    "packet_local": {"weight": 4, "keywords": ["packet-local changelog", "nested changelog", "--nested"]},
}
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the change source (component hint, git history, or spec folder)",
    "Confirm the global component the change belongs to",
    "Confirm the four-part version and whether --bump/--release applies",
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

def route_changelog_request(request):
    inventory = discover_markdown_resources()
    loaded, seen = [], set()
    scores = score_intents(request)

    if max(scores.values() or [0]) < 4:                      # Tier 1: unclear source/mode
        load_if_available(DEFAULT_RESOURCE, inventory, loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    output_mode = max(scores, key=scores.get)                # Tier 2: pick the intent
    if output_mode == "packet_local":                        # Deprecated: refuse and write nothing
        return {
            "output_mode": "refused",
            "writes": [],
            "message": "Packet-local changelogs are deprecated. Spec folders no longer get changelogs.",
            "offer": "Write a global component entry under .skilled/changelog/ instead (section 4)",
        }
    # Flat resource topology: no references/<key>/ subdirectories. The mode selects the
    # generator target documented below, not a keyed subtree; load the flat refs that exist.
    for path in sorted(inventory):
        load_if_available(path, inventory, loaded, seen)
    return {"output_mode": output_mode, "resources": loaded}
```

---

## 3. REQUIRED INPUTS

| Input | Required | Meaning |
| --- | --- | --- |
| `source_type` | Yes, resolved before writing | `spec_folder`, `component` or `git_history` |
| `spec_folder` | When `source_type = spec_folder` | The spec folder to summarize into a global component entry |
| `component_hint` | When `source_type = component` | A name matched against the discovered changelog folders |
| `version_bump` | Optional, default `auto` | `major`, `minor`, `patch`, `build` or `auto` |
| `--nested` | Refused | Packet-local changelogs are deprecated. The workflow stops and offers a global entry (section 4) |
| `--release` | Optional | After a `skilled` release entry is written, tags the version and publishes the GitHub release with the entry as its body (section 8). Any other component skips the release |

Global output lives under `.skilled/changelog/`. Versions read `v{MAJOR}.{MINOR}.{PATCH}.{BUILD}`, the first one is `v1.0.0.0` and dates use `YYYY-MM-DD`. Between 40 and 79 percent confidence in the source or target, proceed and record the assumptions. Below 40 percent, stop and ask with A/B/C options.

---

## 4. HOW IT WORKS (HOW_IT_WORKS): CHANGELOG OUTPUT MODES

### Global Component Changelog

A global entry is written to `.skilled/changelog/{component}/v{VERSION}.md`. `{component}` is a lowercase kebab-case segment matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`, or `{hub}/{link}` when the folder is a hub, with each segment matching that pattern. Reject an ambiguous hint rather than emit a guessed or underscore-bearing directory. The `v{VERSION}.md` filename is an exact version contract and is never slug-normalized.

| Bump | Calculation | Source trigger intent |
| --- | --- | --- |
| `major` | `{MAJOR+1}.0.0.0` | Breaking, overhaul, rewrite, migration, platform version jump |
| `minor` | `{MAJOR}.{MINOR+1}.0.0` | Significant new feature or subsystem addition |
| `patch` | `{MAJOR}.{MINOR}.{PATCH+1}.0` | Incremental improvement, bug fix, refactor, docs, cleanup |
| `build` | `{MAJOR}.{MINOR}.{PATCH}.{BUILD+1}` | Hotfix, typo, same-day build on an already-published version |

Auto detection takes the explicit `--bump` flag first, then change-type keywords in the `spec.md` title and purpose, then conventional commit prefixes. With no clear signal it defaults to `patch`. If the calculated file already exists, increment the build segment until the path is unique.

### Packet-Local Changelogs (Deprecated)

Spec folders no longer get changelogs. Changelogs live only under `.skilled/changelog/` and in each skill's own `changelog/` folder. This workflow writes no file under `specs/**/changelog/` and refuses `--nested`.

Existing packet-local files such as `changelog-<packet>-root.md` stay where they are and still validate. The spec-kit nested generator remains only to render them and prints a deprecation notice when it runs.

---

## 5. CHANGELOG FORMAT CONTRACT

Read `assets/changelog-template.md` before generating global content. It owns the compact and expanded shapes (section 2), what to leave out and the say-it-once rule (section 3), voice and length (section 4) and format selection (section 5). Every entry must be able to sit beside the canonical exemplar, `.skilled/changelog/skilled/v4.0.0.0.md`, without looking out of place.

The contract in one pass:

1. Frontmatter first, then an optional editorial title H1, then the summary narrative. No version header, backlink or version-date line.
2. Compact under 10 reader-visible changes when the release is neither major nor breaking: summary, `## What's New at a Glance` and `## Upgrade`, with `## Why This Release` only when the summary does not say why.
3. Expanded for 10 or more changes, a major bump or any breaking change: opening narrative, `## Why This Release`, `## What's New at a Glance`, topical H2 sections with benefit-led H4 items and `## Upgrade Notes`.
4. A spec-folder blockquote, `> Spec folder: `{path}` (Level {N})`, when the release has a spec folder.
5. Content chosen by reader impact and each fact said once. No file, test or schema tables unless the numbers are the story.

When a source such as an older command snippet conflicts with the template, follow the template, write the narrative format and record the mismatch rather than inventing a hybrid.

### Frontmatter Contract

A global entry must be as findable as a spec document, so its frontmatter block carries these five keys, in this order:

| Key | Value |
| --- | --- |
| `title` | `<component> v<version>, <editorial title>`, or `<component> v<version>` when the entry has no editorial title. A Skilled release entry uses its H1, or `Skilled v<version>` |
| `description` | One or two plain sentences, 250 characters at most, saying what the release changed |
| `trigger_phrases` | The identity phrases first, then one or two topic phrases |
| `importance_tier` | `"normal"` |
| `contextType` | `"general"` |

Identity phrases name the entry the way a reader asks for it. A skill entry declares `<component> v<version>` and `<component> <version>`, where `<component>` is the `name:` in the `SKILL.md` of the folder that holds the entry's changelog folder, never a `{hub}/{link}` target. The deep-loop runtime has no `SKILL.md` and is `deep-loop-runtime`. A Skilled release entry declares `v<version> release notes` and `skilled v<version>`. A topic phrase is 2 to 6 words from the entry's own text that name what changed. It carries no version number and never fits any release the way "bug fixes" would. A component entry may keep a `version:` key after the five.

Existing packet-local entries keep the block the deprecated nested generator renders, with an identity phrase derived from the output path.

---

## 6. TOPOLOGY AND TARGET RESOLUTION

### Mode Detection

For a spec folder, read `implementation-summary.md` first and `spec.md` for the title, purpose and level. Read `tasks.md` only to confirm what shipped. Every source resolves to global mode:

1. `--nested` present: stop, say packet-local changelogs are deprecated and offer a global entry.
2. A spec folder, including a phase child, a phase parent or a folder that already has `changelog/`, resolves to the global component its changed paths touch (Global Component Discovery below).
3. A component hint or git history source is built from recent commits and the files they touched.

### Global Component Discovery

Discover component folders from the repository at run time with `ls -d .skilled/changelog/*/ 2>/dev/null | sort`, never from a hardcoded table. Then resolve:

1. Each folder is a plain component name, such as `sk-doc` or `system-spec-kit`, with no numeric prefix. One folder is not a skill: `skilled` is the framework release line, with one entry per Skilled release.
2. Match changed paths against folder names by whole path segment, never by substring.
3. Match `.skilled/skills/{name}/**` to the folder named `{name}`, and `.skilled/commands/**` or `.skilled/agents/**` to the folder that owns them.
4. Resolve a hub to one of its links, never to the hub folder. A hub is a real folder other than `skilled`, such as `sk-doc` or `sk-code`, holding one link per member packet plus `parent`, the hub's own changelog. `ls -l .skilled/changelog/{hub}/` lists them. A path under `.skilled/skills/{hub}/{packet}/` resolves to the link whose target is `{packet}/changelog`. Any other path under the hub, and a hint that names the hub, resolve to `{hub}/parent`. A hint that names a member by its link, its packet folder or `{hub}/{link}` resolves to that link.
5. Match `component_hint` against folder names exactly.
6. Use spec path segments as a tiebreaker.
7. Resolve to `skilled` only when `component_hint` names it. A changed path never selects it, because the operator chooses a framework release.
8. If nothing matches, do not invent or default a folder. Pause and ask which component the changelog belongs to.

Then choose the target:

1. A component with more than 60 percent of the changed files is primary.
2. With several roughly equal components, pick the primary by file count and list the rest as secondary.
3. Verify the target folder exists before writing, and never create a missing one.

---

## 7. CREATION WORKFLOW

Complete these seven steps in order. The command YAMLs number the same workflow as eight steps, because they run the optional GitHub release as its own step 7.

Before writing, validate each authored component, packet or phase slug. Exact version filenames and frozen changelog paths stay exempt.

```bash
python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <component-or-phase-slug>
```

1. **Analyze context.** Resolve the source type and read the source (section 6). Compile `work_context`: what changed for the reader, the change type, the level and the source.
2. **Resolve output target.** Discover the folders, match paths and hints (section 6), choose the primary component, list secondary ones and verify `.skilled/changelog/{resolved_folder}/` exists.
3. **Determine version.** List the `v*.md` entries in the target folder and in its generation folders (`v1+/`, `v2+/` and so on). List the version entries on the upstream branch with `git ls-tree` (the branch's upstream, else `origin/main`). Start from the highest of the local and upstream `vX.Y.Z.B` versions, choose the bump (section 4) and calculate the next version. Increment the build segment while the file exists locally or upstream, because two branches numbering from their own checkout pick the same version and collide at merge. Without a reachable upstream, number locally and say so in the report. For the `skilled` release line with at least one entry, first check the highest entry for a release tag with `git ls-remote --exit-code --tags origin refs/tags/v{latest}`. Exit 2 means no tag, so that release is still open: extend that entry wherever it sits instead of numbering a new one, keep its version and skip the bump. A bump the operator chose is not applied, and the report says so and that tagging the open release first starts a new one. When the open entry exists only upstream, stop and ask for a merge or rebase first. Any exit other than 0 or 2 means the check failed, so number a new entry and say so rather than risk editing a release that already shipped. Every other component numbers a new entry.
4. **Generate content.** Read `assets/changelog-template.md`, then:
   - Write the frontmatter block per the Frontmatter Contract in section 5.
   - Choose the content before writing it (template section 3). List what changed, keep what the reader would notice, act on or decide differently about, merge items with the same effect and drop the housekeeping.
   - Select compact or expanded from the changes that survive (template section 5).
   - Write each section to its one job, so a fact appears once: themes in the opening, the gap in Why This Release, one payoff line per theme at a glance, the detail in the H4 items and only actions in the upgrade notes.
   - Lead with why the release matters, and add a table only when its numbers are the story.
   - When extending an open release, read the entry first and fold the new work into it: add its section or H4 items, a glance bullet in section order, its spec folder on the spec-folder line and any upgrade action. Widen the opening and Why This Release only enough to cover the new theme, keep the title unless the new work changes the headline, and correct any existing sentence the new work makes untrue.
5. **Validate quality.** Run the section 9 checks on the draft. For a new entry, confirm the version is strictly greater than the latest one and no file exists at the target. For an extension, confirm the target is the open entry. Confirm every path the entry names exists. Apply the cut test (template section 3), fix what is safe and revalidate.
6. **Write the file.** Write `.skilled/changelog/{primary_component}/v{next_version}.md`, or edit the open entry in place when extending, read back its first lines, then set `next_version` in every version carrier the component's skill root already has (`SKILL.md`, `description.json`, `hub-router.json` and `mode-registry.json`, never `README.md` or a hub `ROUTER.md`, whose versions are each document's own) and, for a hub, run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs` on the hub and stop on a non-zero exit. Report secondary components as candidates rather than writing extra files.
7. **Report and preserve context.** Report the path, component, version, whether the entry is new or extended, bump type, summary, section count and files tracked. A spec-folder source can preserve context through the normal memory save workflow. Do not claim completion before the written file is verified.

Pause when confidence drops below 40 percent, component resolution stays ambiguous, the calculated version looks wrong or a required section would be empty.

---

## 8. NOTATION AND FORMAT RULES

The voice, structure, omission and length rules live in `assets/changelog-template.md` sections 3 and 4. The non-negotiables are:

1. Write for a smart person who is not a developer, and lead with why the release matters.
2. Keep what the reader would notice or act on. Drop file inventories, test counts, internal labels, process detail and follow-on housekeeping, and compress reverted work to one story sentence or nothing.
3. Say each fact once, in the section whose job it is.
4. Bold lead-in sentences on glance bullets, H4 item headings of 2-7 words (10 at most), an `&nbsp;` line before every H2 (the opening, Why This Release, What's New at a Glance and every later section), nothing between H4 items, no `---` rule in the body and inline `**Breaking:**` markers.
5. No Oxford commas, em dashes or semicolons, per the Human Voice Rules.

### Release Notes

For GitHub release notes, use the changelog content with any YAML frontmatter and the editorial title H1 removed, keeping its spacing, then append an `&nbsp;` line and the pointer:

```text
&nbsp;

Full changelog: `.skilled/changelog/{component}/v{VERSION}.md`
```

The command YAMLs own the release itself, as `step_7_publish_release`, and run it only when `publish_release` is explicitly true and the component is `skilled`, the framework release line. Any other component skips the release, because component versions share the `vX.X.X.X` shape with release tags and a component version must never become one. The tag is `v{next_version}`, and the release title is the tag followed by the entry's editorial title, the H1 without its leading version. The step checks for a tag collision and an authenticated `gh`, then runs `git tag -a`, `git push origin {release_tag}` and `gh release create {release_tag} --title {release_title} --notes-file {notes_file}`, which publishes at once with no draft stage. `:confirm` shows the exact commands and runs them only after approval.

---

## 9. VALIDATION

Validate the target, version and content before writing.

Global changelog checks:

1. The target is `.skilled/changelog/{component}/v{VERSION}.md` in an existing folder, and no file exists at that path. Extending an open `skilled` release is the one exception: the target is that release's existing entry.
2. The version follows `vX.Y.Z.B` and is strictly greater than the latest one in the folder, counting its generation folders. An extension keeps the open release's version.
3. The frontmatter carries `title`, `description`, `trigger_phrases`, `importance_tier` and `contextType` in contract order, with both identity phrases for the target path and at least one topic phrase. `validate_document.py` blocks an entry whose block, keys or phrases are missing.
4. The prose opens with the summary narrative, and the spec-folder blockquote is present when the source is a spec folder.
5. The tier's sections are present: compact carries the summary, `## What's New at a Glance` and `## Upgrade`. Expanded carries the opening narrative, `## Why This Release`, `## What's New at a Glance`, at least one topical H2 with H4 items and `## Upgrade Notes`.
6. No Files Changed, Test Impact or Schema Changes section. Any table passes the earned-evidence rule.
7. Omission applied: no file inventories, test counts, process detail or housekeeping items. No internal labels (task, requirement, scenario or finding IDs, packet or phase numbers) appear outside the spec-folder line.
8. Each fact appears once: no sentence restates one from another section, and each glance bullet adds something the summary did not.
9. The template's ceilings hold: summary within 3 sentences, opening within 5 paragraphs, Why This Release within 3 short paragraphs or 4 sentences, at most 12 glance bullets, H4 items within 7 paragraphs, H4 headings within 10 words and compact files within 40 prose lines.
10. H4 headings are benefit-led and never numbered or sentence-length, and no H3 sits inside a topical section.

Voice gate, run on the draft before writing:

```bash
python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <draft-file>
```

The scan must report zero hard blockers (banned punctuation or words). Deductions below that threshold are acceptable. If the scanner is unavailable, apply the rules by hand and record that the scan was skipped. Structural checks complement it: bold lead-ins on glance bullets, an `&nbsp;` line before every H2, nothing between H4 items, no `---` rule in the body, no `**Problem:**`/`**Fix:**` labels and inline `**Breaking:**` markers.

Packet-local files are deprecated, so no new one is validated here. `validate_document.py` still checks the existing ones under `specs/**/changelog/`.

After writing, run the shared markdown checks:

```bash
python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <written-file>
python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py <written-file>
```

If validation fails, fix the blocking issues or report the exact blocker and command output.

---

## 10. RULES

### ✅ ALWAYS

1. Follow the seven-step workflow in order.
2. Read `assets/changelog-template.md` before generating global content.
3. Discover global component folders from `.skilled/changelog/` at run time, and resolve to an existing one before writing.
4. Keep global versions four-part and strictly sequential. Extending an untagged `skilled` release keeps its version.
5. Choose content by reader impact and say each fact once.
6. Refuse `--nested` and route a spec-folder source to a global component entry.
7. List secondary affected components.
8. Verify the written file before claiming completion.
9. Keep this packet self-contained, with the advisor identity at the `sk-doc` hub root.

### ⛔ NEVER

1. Add a packet-local `graph-metadata.json`.
2. Overwrite an existing changelog or reuse an existing version. Extending an untagged `skilled` release entry is the one exception, and it adds to the entry rather than replacing it.
3. Guess a component folder, or create a missing one.
4. Write an entry with an empty summary or an empty required section.
5. Write a new packet-local changelog, or use the deprecated nested generator to create one. Its `--write` only re-renders an existing packet changelog.
6. Make the command router or YAML the only workflow contract.
7. Hide a source-format conflict. Record it and follow the template.

### ⚠️ ESCALATE IF

1. No source context can be found in a spec folder, component history or git history.
2. Component resolution stays ambiguous after file-count and path-segment analysis.
3. The calculated version is unexpected or cannot be made unique.
4. A required section would be empty.
5. The user asks for a GitHub release with no git release workflow or command context available.
6. Validation still fails after safe local fixes.

---

## 11. REFERENCES

1. `assets/changelog-template.md`: the canonical format, selection, voice and length rules.
2. `references/README.md`: the route map to `worked-examples.md` (filled-in entries), `version-bump-rules.md` (concrete version choices) and `topology-edge-cases.md` (placement, back-dating, source conflicts and the release flow).
3. `.skilled/commands/create/changelog.md`: the thin `/create:changelog` router.
4. `.skilled/commands/create/assets/create-changelog-auto.yaml` and `create-changelog-confirm.yaml`: the `:auto` and `:confirm` workflows, which resolve to this same contract.

---

## 12. SUCCESS CRITERIA

The workflow succeeds when:

1. The file lands at its global component path, and a `--nested` request is refused with a global entry offered instead.
2. Global versioning is sequential, unique and four-part, and an untagged `skilled` release is extended rather than followed by a second untagged entry.
3. The entry follows the template's compact or expanded shape and reads in the v4 style: why first, benefit-led headings, only what the reader needs and each fact said once.
4. A release body, when requested, uses the entry and appends the full changelog path.
5. Validation passes, or the remaining issue is escalated with exact evidence.
6. No other file changes unless the user asked for it.
