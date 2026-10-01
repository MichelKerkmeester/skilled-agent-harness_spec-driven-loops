---
title: "frontmatter: Markdown Frontmatter Parsing"
description: "Shared parser that splits a leading YAML frontmatter block from the body of a markdown document."
trigger_phrases:
  - "frontmatter parser"
  - "markdown frontmatter"
  - "parse yaml frontmatter"
---

# frontmatter: Markdown Frontmatter Parsing

---

## 1. OVERVIEW

`frontmatter/` owns the single shared parser for a leading `---` fenced block in a markdown document. It returns the parsed YAML mapping, the remaining body text and the raw block, so callers do not need their own regex or `indexOf` split.

Current state:

- One exported function and one exported interface cover every current read of a frontmatter block.
- A block counts only when the document's first line is exactly `---` with optional trailing whitespace and a later line closes it. No fence, a fence not on line 1, or an unclosed fence returns the whole text as the body with `raw` set to null.
- Line endings are preserved. Offsets are kept instead of re-joining lines, so the body and the raw block keep their original terminators.
- Malformed YAML, an empty block or a non-mapping block yields an empty object rather than an error, because callers that sniff keys line by line read `raw` and a parse failure must not hide the block.
- Section 3 SERIALIZATION is a reserved heading with no code under it.

---

## 2. FILES

| File | Responsibility |
|---|---|
| `parse-frontmatter.ts` | Frontmatter block detection, body and raw extraction, and YAML mapping parsing |

---

## 3. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | `js-yaml` only. No consumer module, skill folder or spec document is imported. |
| Exports | `parseFrontmatter` and the `ParsedFrontmatter` interface. `isFenceLine`, `stripTrailingTerminator` and `parseYamlMapping` stay private. |
| Ownership | Frontmatter detection and YAML mapping parsing belong here. Callers own what they do with the parsed keys. |

`ParsedFrontmatter` carries three fields. `frontmatter` is the parsed mapping, empty when the block is absent, empty, not a mapping or unparseable. `body` is everything after the closing fence terminator, an empty string when the document ends at the fence. `raw` is the block including both fence lines and excluding the terminator after the closing fence, null when there is no block.

---

## 4. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `parseFrontmatter` | Function | Turns markdown text into the parsed mapping, the body and the raw block |
| `ParsedFrontmatter` | Interface | Types the three fields the function returns |

---

## 5. RELATED

- [`system-spec-kit shared README`](../README.md)
