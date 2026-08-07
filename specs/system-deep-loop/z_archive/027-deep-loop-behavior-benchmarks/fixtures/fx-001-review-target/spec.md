# URL Slug Utility

## Purpose

Convert short human-readable labels (blog post titles, product names, category
tags) into URL-safe slug strings suitable for use in web addresses. Slugs are
meant to be stable, readable, and safe to embed in a URL path segment.

The utility is intentionally small: one function, no dependencies, no I/O.

## Requirements

1. **Lowercase.** The output must contain only lowercase characters.
2. **Trim.** Leading and trailing whitespace on the input is removed before any
   other processing.
3. **Separator collapse.** Every run of one or more non-alphanumeric characters
   is replaced by a single hyphen (`-`).
4. **No edge separators.** The final slug must not start or end with a hyphen.
5. **Maximum length.** The slug is at most 60 characters long. Truncation must
   keep the slug valid and must not introduce a broken separator by cutting.

## Acceptance Examples

- `slugify("  Hello, World!  ")` -> `hello-world`
- `slugify("Café Menu")` -> `caf-menu`
- `slugify("a___b   c")` -> `a-b-c`

## Notes

Inputs are expected to be short title strings such as post or product titles.
The default maximum length is 60 characters and may be overridden by passing a
second argument. The function returns the slug string; it performs no I/O and
holds no global state.
