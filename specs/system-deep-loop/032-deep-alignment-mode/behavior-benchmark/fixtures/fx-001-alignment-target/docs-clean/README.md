# fx-001 Alignment Target — Clean Sub-Corpus

> A small, deliberately conformant documentation set used to anchor the clean-pass lane of the deep-alignment behavior benchmark.

This directory holds two files — this `README.md` and its `commands/well-formed.md` sibling — both written to pass the sk-doc authority's structural checks without any suppression or re-probe needed. It is the direct clean-lane counterpart to the fixture's main `docs/` corpus, which was written to carry the opposite: real, intentional gaps. Read together, the two directories exercise the exact same rule set from both sides — one showing what a genuine violation looks like, the other showing what actually satisfying the rule looks like.

---

## 1. OVERVIEW

This file exercises the `readme` document type's structural rules end to end: one required `overview` section, ALL CAPS numbered H2 headers, a short blockquote description under the H1, and — per the repo's own documented convention — no Table of Contents anywhere in the file. None of that is unusual for a real project README; it is simply followed completely rather than partially, which is the one property this file exists to demonstrate. A lane scoped at this directory should converge to a real `PASS` with zero open findings at every severity, not because the corpus was trivial, but because nothing in it is actually wrong.

---

## 2. QUICK START

Nothing here needs building or running. Read this file and its `commands/well-formed.md` sibling the way you would read any short internal documentation set — each stands on its own, and neither depends on state left over from a previous run or from a file elsewhere in the fixture.

- This file exercises the `readme` document type's rules.
- `commands/well-formed.md` exercises the `command` document type's rules instead, with both of its required sections present on purpose.

```bash
find docs-clean -name "*.md" | sort
```

```text
docs-clean/
  README.md             <- this file (readme rules)
  commands/
    well-formed.md       <- command rules
```

Running the `find` command above from the fixture root lists exactly two files — the whole of this clean sub-corpus, nothing more.

---

## 3. STRUCTURE

| File | Document type | Required sections present |
|---|---|---|
| `README.md` | `readme` | `overview` |
| `commands/well-formed.md` | `command` | `purpose`, `instructions` |

```json
{ "authority": "sk-doc", "artifactClass": "docs", "scope": { "type": "paths", "values": ["docs-clean/"] } }
```

That is the shape of the lane that should be pointed at this directory — a single `sk-doc` lane scoped to `docs-clean/`, distinct from the lane scoped at the main `docs/` corpus.

---

## 4. RELATED

- The fixture's main `docs/` corpus — the same rule set, applied to files that were written to fail parts of it on purpose.
- [`commands/well-formed.md`](./commands/well-formed.md) — this sub-corpus's other file, exercising the `command` document type's rules.
- [JSON Schema](https://json-schema.org/draft/2020-12/schema) — the general schema format the fixture's lane-config files are informally checked against.
- `FIXTURE.md` at the fixture root — the human key describing every file's intended conformance characteristic.
