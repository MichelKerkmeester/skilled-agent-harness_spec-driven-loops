# Local security patches

This package is built from `image-size` v2.0.2 with two upstream security fixes that were not published before the repository was archived:

- [PR #439](https://github.com/image-size/image-size/pull/439), commit `bdbe560bfd98af6feab93b46aed67f2f0a77e4d5`, prevents zero-length JXL and HEIF boxes from stalling parsing (CVE-2025-71329).
- [PR #453](https://github.com/image-size/image-size/pull/453), commit `0f6a6665a166c530ba126a8ab8608a0603cb49dc`, prevents zero-length ICNS entries from stalling parsing (CVE-2025-71330).

The generated `dist` files were produced with the upstream build command after applying both commits. The upstream test suite passed against that source, and `security.test.mjs` preserves regression coverage for all three malformed container formats.
