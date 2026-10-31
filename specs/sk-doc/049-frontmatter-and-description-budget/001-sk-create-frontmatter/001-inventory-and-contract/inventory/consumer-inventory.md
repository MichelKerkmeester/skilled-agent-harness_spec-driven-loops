---
title: "Frontmatter consumer inventory and ownership boundary"
description: "Every live reference to the frontmatter template spec and the versioning rules, with its exact written form, its post-move target, and an owned-or-shared classification."
trigger_phrases:
  - "frontmatter consumer inventory"
  - "who reads frontmatter templates"
  - "frontmatter ownership boundary"
  - "frontmatter reference forms"
importance_tier: "important"
contextType: "implementation"
---

# Frontmatter consumer inventory and ownership boundary

## 1. THE PROBE

One command reproduces every number in this document.

```bash
grep -ranI --exclude-dir=.git --exclude-dir=node_modules \
  -E 'frontmatter-(templates|versioning)' .opencode/ \
  | grep -v '/benchmark/reports/'
```

`-a` matters. Several files in this repository carry a NUL byte, and `grep` returns
nothing on those without it while printing no warning.

The `/benchmark/reports/` filter removes three frozen skill-benchmark report bundles.
They are recorded output from a dated run, not consumers.

## 2. THE COUNT

Counting by grep line is not the same as counting by reference. Two of the matches are
the moving files matching their own filename in the grep path prefix, and twelve more are
the filename used as an example rather than as a pointer. The classifier below reads the
line content, not the path.

| Population | Lines | Files |
|-----------|-------|-------|
| All matches under `.opencode/`, frozen benchmark reports excluded | 83 | 40 |
| **Live consumer references to repoint** | **54** | **34** |
| Internal cross-links inside the two moving documents | 4 | 2 |
| Frozen history and out-of-scope surfaces | 13 | 6 |
| Bare-name mentions — not references at all | 12 | 4 |

The four rows partition the 83 exactly. Phase 003 acts on the first two: **58 lines
across 36 files**.

A pre-flight estimate of 25 and 13 was carried into this packet. It is wrong in both
directions. It undercounts the template spec, and it misses the command surface and the
shared scripts entirely, because it matched only markdown link syntax — and 22 of the 54
live references are not markdown links.

## 3. REFERENCE FORMS

Five distinct written forms are in use. A rewrite that assumes one form silently misses
the other four.

| Form | Example | All 83 | Live 54 |
|------|---------|--------|---------|
| Markdown link, relative | `[frontmatter-templates.md](../../shared/assets/frontmatter-templates.md)` | 38 | 32 |
| Skill-relative path inside an emitted string or listing | `(see references/frontmatter-versioning.md)` | 16 | 6 |
| Repo-absolute path in a doc, config, comment or docstring | `.opencode/skills/sk-doc/shared/assets/frontmatter-templates.md` | 11 | 10 |
| Bare relative path in prose | `../shared/references/frontmatter-versioning.md` | 6 | 6 |
| Bare filename, no path — not a reference | `` `frontmatter-templates.md` `` | 12 | 0 |

Reproduce the split:

```bash
python3 - <<'EOF'
import re, subprocess, collections
out = subprocess.run(
    "grep -ranI --exclude-dir=.git --exclude-dir=node_modules "
    "-E 'frontmatter-(templates|versioning)' .opencode/ | grep -v '/benchmark/reports/'",
    shell=True, capture_output=True, text=True).stdout.splitlines()
def classify(c):
    if re.search(r'\]\([^)]*frontmatter-(templates|versioning)\.md', c): return 'markdown-link'
    if re.search(r'\.opencode/skills/sk-doc/shared/(assets|references)/frontmatter-(templates|versioning)\.md', c): return 'repo-absolute'
    if re.search(r'(\.\./|\./)+[^\s`)\]]*frontmatter-(templates|versioning)\.md', c): return 'bare-relative'
    if re.search(r'(?<![\w./])(references|assets)/frontmatter-(templates|versioning)\.md', c): return 'skill-relative-in-string'
    return 'bare-name'
print(collections.Counter(classify(l.split(':',2)[2]) for l in out))
EOF
```

## 4. THE RUN-TIME PARSER QUESTION

REQ-002 asks for every consumer that parses the file at run time, held separately from
those that link to it, because a broken link is visible and a broken parse is not.

**There are none.** This contradicts the premise the packet was opened on, so the
evidence is given in full.

`shared/scripts/quick_validate.py` was named as a parser. It is not one. It opens
exactly one file:

```
quick_validate.py:172:  content = skill_md.read_text(encoding='utf-8')
```

That is the `SKILL.md` under validation. The four frontmatter paths it carries live in a
module docstring (lines 12, 26) and in strings it emits to the operator (lines 93, 254,
261, 266). Its own docstring states the arrangement outright: *"Constants below are the
single source of truth for the python validators; doc-side constants live in the markdown
file."* The budget numbers are duplicated into Python, deliberately. The path is a
citation, not a dependency.

`sk-create-skill/scripts/package_skill.py` was named as the second parser. It reads
`SKILL.md` (line 782) and walks `*.md` under the packet (line 596) to check frontmatter
blocks. It never opens either frontmatter document. Its single reference, line 334, is
inside a validation failure message.

An exhaustive sweep for dynamic construction found no other candidate: no script under
`.opencode/` joins a `shared/assets` or `shared/references` path with either filename.

**What this changes.** The failure mode is real but different from the one assumed. A
stale path in an emitted string does not break a run — it prints a wrong path to an
operator who then cannot find the document. That is a silent failure of a different kind,
and it is why the eight code-carried references in section 5 are repointed first in phase
003 even though nothing will crash if they are missed.

## 5. THE INVENTORY

### 5a. Code and configuration — repoint first

These carry a path an operator or a downstream tool will act on. None of them resolves a
file, so none of them fails loudly.

| # | File | Lines | Form | Class |
|---|------|-------|------|-------|
| 1 | `.opencode/skills/sk-doc/shared/scripts/quick_validate.py` | 12, 26, 93, 254, 261, 266 | docstring + emitted strings | shared |
| 2 | `.opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | 334 | emitted string | shared |
| 3 | `.opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs` | 8, 379 | comment + emitted help text | shared |
| 4 | `.opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` | 8 | comment | shared |
| 5 | `.opencode/commands/doctor/scripts/audit_descriptions.py` | 29 | docstring | shared |
| 6 | `.opencode/commands/doctor/assets/doctor-skill-budget.yaml` | 39, 40 | config value + anchor | shared |
| 7 | `.opencode/commands/create/assets/create-agent-confirm.yaml` | 627 | workflow step reference | shared |
| 8 | `.opencode/commands/create/assets/create-skill-confirm.yaml` | 443 | workflow step action text | shared |

### 5b. Hub shared tier

| # | File | Lines | Form | Class |
|---|------|-------|------|-------|
| 9 | `shared/references/validation.md` | 544 | markdown link | shared |
| 10 | `shared/references/core-standards.md` | 337 | markdown link | shared |
| 11 | `shared/references/quick-reference.md` | 351 | markdown link | shared |
| 12 | `shared/assets/llmstxt-templates.md` | 850 | markdown link, sibling form `./` | shared |

### 5c. Mode packets

| # | File | Lines | Form | Class |
|---|------|-------|------|-------|
| 13 | `sk-create-agent/assets/agent-template.md` | 62 | markdown link | owned-by-frontmatter |
| 14 | `sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-baseline-template.md` | 31 | bare relative | owned-by-frontmatter |
| 15 | `sk-create-benchmark/assets/behavior-benchmark/behavior-benchmark-index-template.md` | 32 | bare relative | owned-by-frontmatter |
| 16 | `sk-create-benchmark/assets/skill-benchmark/skill-benchmark-readme-template.md` | 37 | bare relative | owned-by-frontmatter |
| 17 | `sk-create-changelog/assets/changelog-template.md` | 286 | markdown link, sibling form `./` — **broken today** | owned-by-frontmatter |
| 18 | `sk-create-command/assets/command-template.md` | 63, 1247 | markdown link | owned-by-frontmatter |
| 19 | `sk-create-feature-catalog/SKILL.md` | 200, 465 | bare relative | owned-by-frontmatter |
| 20 | `sk-create-feature-catalog/references/README.md` | 58 | markdown link | owned-by-frontmatter |
| 21 | `sk-create-feature-catalog/assets/feature-catalog-template.md` | 298 | markdown link | owned-by-frontmatter |
| 22 | `sk-create-manual-testing-playbook/SKILL.md` | 567 | bare relative | owned-by-frontmatter |
| 23 | `sk-create-manual-testing-playbook/references/README.md` | 55 | markdown link | owned-by-frontmatter |
| 24 | `sk-create-quality-control/references/optimization.md` | 200 | markdown link | owned-by-frontmatter |
| 25 | `sk-create-readme/assets/install-guide-template.md` | 985 | markdown link | owned-by-frontmatter |
| 26 | `sk-create-skill/references/README.md` | 76 | markdown link | owned-by-frontmatter |
| 27 | `sk-create-skill/references/skill/creation-workflow.md` | 36, 279, 294, 428 | markdown link | owned-by-frontmatter |
| 28 | `sk-create-skill/references/shared/overview.md` | 186, 202, 277 | markdown link + tree listing | owned-by-frontmatter |
| 29 | `sk-create-skill/references/shared/common-pitfalls.md` | 61, 262 | markdown link | owned-by-frontmatter |
| 30 | `sk-create-skill/references/shared/validation-and-packaging.md` | 133 | markdown link | owned-by-frontmatter |
| 31 | `sk-create-skill/assets/skill/skill-md-template.md` | 87, 106, 1176 | markdown link | owned-by-frontmatter |
| 32 | `sk-create-skill/assets/skill/skill-asset-template.md` | 172, 939 | markdown link | owned-by-frontmatter |
| 33 | `sk-create-skill/assets/skill/skill-procedure-template.md` | 86, 235 | markdown link | owned-by-frontmatter |
| 34 | `sk-create-skill/assets/skill/skill-reference-template.md` | 84, 1019 | markdown link | owned-by-frontmatter |

### 5d. Internal, inside the two moving documents

| File | Lines | Target | Survives the move |
|------|-------|--------|-------------------|
| `shared/assets/frontmatter-templates.md` | 124, 181, 363 | `../references/frontmatter-versioning.md` | Yes, if the mode keeps `assets/` and `references/` as siblings |
| `shared/references/frontmatter-versioning.md` | 146 | `../assets/frontmatter-templates.md` | Yes, same condition |

This is the reason the two documents land at `sk-create-frontmatter/assets/` and
`sk-create-frontmatter/references/`. Any other arrangement rewrites four working links
for nothing.

Two further lines in `frontmatter-templates.md` — 520 and 560 — name
`frontmatter-versioning.md` inside a sample schema description with no path. They are
bare-name mentions and stay as written.

### 5e. Outbound links inside the moving documents — invisible to the probe

The probe matches the two filenames. It cannot see a link that points *out* of a moving
file at something else, and four of those break on the move. They were found by scanning
both documents for every relative link, not by the reference probe.

| File | Line | Link today | After the move |
|------|------|-----------|----------------|
| `frontmatter-templates.md` | 934 | `../../sk-create-skill/assets/skill/skill-md-template.md` | Unchanged. Both old and new homes sit two levels under the hub. |
| `frontmatter-templates.md` | 935 | `../../sk-create-command/assets/command-template.md` | Unchanged, same reason. |
| `frontmatter-templates.md` | 938 | `../references/core-standards.md` | **Breaks.** Becomes `../../shared/references/core-standards.md`. |
| `frontmatter-templates.md` | 939 | `../references/validation.md` | **Breaks.** Becomes `../../shared/references/validation.md`. |
| `frontmatter-versioning.md` | 147 | `../scripts/frontmatter-version.mjs` | **Breaks.** Becomes `../../shared/scripts/frontmatter-version.mjs`. |
| `frontmatter-versioning.md` | 148 | `../scripts/check-frontmatter-versions.sh` | **Breaks.** Becomes `../../shared/scripts/check-frontmatter-versions.sh`. |

Two more lines carry a shared-tier path in prose rather than in a link, and read wrong
after the move even though nothing resolves them: `frontmatter-versioning.md` line 126
names `scripts/check-frontmatter-versions.sh`, and section 7 of the same document
describes the validators by bare name.

Reproduce:

```bash
grep -anoE '\]\((\.\./|\./)[^)]*\)' \
  .opencode/skills/sk-doc/shared/assets/frontmatter-templates.md \
  .opencode/skills/sk-doc/shared/references/frontmatter-versioning.md
```

## 6. NOT CONSUMERS — DO NOT REPOINT

### 6a. Bare-name mentions (12 lines, 4 files)

| File | Lines | Why it stays |
|------|-------|--------------|
| `sk-create-skill/assets/skill/skill-asset-template.md` | 28, 56, 685, 697, 807, 922, 929, 931 | The filename is the worked example for the kebab-case naming rule. It illustrates a convention; it does not point at a document. |
| `shared/assets/frontmatter-templates.md` | 520, 560 | A sample schema field description: `"4-part X.Y.Z.W; see frontmatter-versioning.md"`. No path. |
| `sk-create-skill/references/skill/creation-workflow.md` | 183 | A tree diagram of a skill being scaffolded. |
| `sk-doc/changelog/v1.8.0.0.md` | 3 | A spec-folder path, `154-frontmatter-versioning`. A folder, not the document. |

### 6b. Frozen history (13 path-bearing lines, 6 surfaces)

| File | Lines | Why it stays |
|------|-------|--------------|
| `sk-doc/changelog/v1.8.0.0.md` | 11, 12, 32 | A released changelog entry. It records where the file was at v1.8.0.0, and that remains true. |
| `system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` | 2, 57, 65, 67, 138, 182, 193 | Recorded measurement from a dated run. |
| `system-spec-kit/manual-testing-playbook/tooling-and-scripts/markdown-link-integrity-guard.md` | 74, 75 | Frozen expected-output of the link guard, already stale against the current template. |
| `sk-doc/benchmark/reports/compiled-routing/**` | 3 bundles, filtered by the probe | Dated benchmark report output. |

### 6c. Out of scope by instruction

| File | Lines | Why it stays |
|------|-------|--------------|
| `system-skill-advisor/manual-testing-playbook/auto-indexing/provenance-and-trust-lanes.md` | 214 | An absolute path inside a sample indexer output. `system-skill-advisor/**` is closed to this packet. Counted inside the 13 above. |

## 7. THE OWNERSHIP BOUNDARY

### 7a. What the mode owns

Both documents, whole. Neither splits.

| Document | Lines | New home |
|----------|-------|----------|
| `shared/assets/frontmatter-templates.md` | 939 | `sk-create-frontmatter/assets/frontmatter-templates.md` |
| `shared/references/frontmatter-versioning.md` | 148 | `sk-create-frontmatter/references/frontmatter-versioning.md` |

No section of either document has a second constituency that would justify leaving part
of it behind. The template spec is one contract with eleven document-class sections; the
versioning rules are one derivation algorithm. Splitting either would produce two files
that each defer to the other.

### 7b. What stays shared, and why

Three frontmatter-named things stay in the shared tier. The reason is the same in each
case: something outside sk-doc path-binds to them.

| Artifact | Stays because |
|----------|---------------|
| `shared/scripts/frontmatter-version.mjs` | The versioning engine. |
| `shared/scripts/check-frontmatter-versions.sh` | The corpus gate that wraps it. |
| `shared/scripts/quick_validate.py` | The fast frontmatter validator, invoked by four `create:*` command workflows and by `doctor/scripts/audit_descriptions.py`. |

The binding is literal, not stylistic:

```
.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs:38:
  frontmatterVersions: '.opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh',
```

A post-edit hook resolves that path on every qualifying edit, from outside the hub.
`shared/README.md:29` already documents the hard-coding as a known constraint. Moving the
script would break a runtime hook to gain nothing: the mode owns the *rules*, and the
scripts are enforcement, which is exactly the kind of many-producer utility the shared
tier is for.

**The boundary in one line: the mode owns the contract, the shared tier keeps the
enforcement.**

### 7c. Classification summary

Line totals: section 5a carries 15 lines over 8 files, 5b carries 4 over 4, 5c carries 35
over 22, 5d carries 4 over 2. That is 58 lines over 36 files, of which 54 over 34 are
consumer references.

| Class | Consumers | Meaning |
|-------|-----------|---------|
| `owned-by-frontmatter` | 22 files, section 5c | A mode packet that emits frontmatter and defers to the contract. It cites the owning mode after the move. |
| `shared` | 12 files, sections 5a and 5b | Hub-tier or command-tier. It cites the contract without belonging to it. Repointed, not reassigned. |
| Internal | 2 files, section 5d | The documents themselves. |
| Not a consumer | 4 files, section 6a | The filename appears as an example, a schema string or a diagram label. |
| Frozen | 5 surfaces, sections 6b and 6c | History, recorded output, and one surface closed to this packet. |

Every match is in exactly one row. No consumer is unclassified.

## 8. WHAT PHASE 003 INHERITS

1. Repoint the 15 code and configuration lines in section 5a first, across 8 files. They
   are the ones no gate will catch.
2. Repoint the 39 markdown lines in sections 5b and 5c, across 26 files, at their correct
   relative depth. Depths differ: `../..`, `../../..`, `../`, and `./` all appear.
3. Leave the 4 internal lines in section 5d alone: keeping `assets/` and `references/`
   as siblings inside the mode preserves them.
3a. Fix the 4 broken outbound links in section 5e. The probe does not see them, so
   nothing else in this packet will catch them except the link resolver.
4. Fix `sk-create-changelog/assets/changelog-template.md:286` while repointing it. It is
   broken today and the repoint is what fixes it.
5. Leave sections 6a, 6b and 6c untouched.
6. Add nothing to `leaf-aliases.json`. Neither document is in it now, and an entry there
   would reintroduce the mismatch this packet exists to remove.

### Verification baseline

`resolve_skill_markdown_links.py --repo-root . --scope .opencode/skills/sk-doc` reports
**113 failures** before the move, of which exactly one names a frontmatter path — item 17,
the already-broken changelog template link. After phase 003 the frontmatter-related
failure count must be zero and the total must not exceed 112.
