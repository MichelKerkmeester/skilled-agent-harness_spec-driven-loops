---
title: "10-Check Verification Gate for 026 Changelog Backfill"
description: "The acceptance gate every newly authored packet-local changelog must pass before it is accepted."
trigger_phrases:
  - "changelog verification gate"
  - "changelog 10 checks"
  - "hvr lint changelog"
importance_tier: "important"
contextType: "reference"
---

# Verification Gate

A changelog is accepted only when all ten checks pass. The enrichment agent runs these itself after writing the file. Failures recycle to enrichment at most twice, then the packet is logged for manual authoring.

## Check 1: strict validate touchpoint
Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict`. Require exit 0, zero errors, zero warnings.

## Check 2: HVR lint, em-dash and semicolon
Run `grep -n -- "—\|–\|;" <changelog-file>`. Scan the WHOLE file, every section INCLUDING the Files Changed table cells and the Verification table, not just the prose sections. Require zero matches except text that sits inside a backtick code span (for example `a; b` or a `path;with;semicolons`). The exemption is character-level, not line-level: a line that contains backticks is NOT exempt if the semicolon falls outside the backticks. Em-dashes (— U+2014) and en-dashes (– U+2013) are never exempt anywhere.

## Check 3: HVR lint, Oxford comma
Run `grep -n ", and\|, or" <changelog-file>`. Require zero matches in any prose sentence across the whole file. Oxford commas inside backtick code spans or quoted source strings are exempt.

## Check 4: template-source marker present
Run `grep -c "SPECKIT_TEMPLATE_SOURCE" <changelog-file>`. Require count at least 1. The marker is on the line immediately after `# Changelog` with no blank line between. phase.md files contain `changelog/phase.md`. root.md files contain `changelog/root.md`.

## Check 5: all required sections present
Run `grep -c "^### Summary\|^### Added\|^### Changed\|^### Fixed\|^### Verification\|^### Files Changed\|^### Follow-Ups" <changelog-file>`. Require count 7. Phase-parent files must also have `^### Included Phases` at least once.

## Check 6: Files Changed table format
The Files Changed section has a markdown table with at least one data row beyond the header. Run `grep -c "^| " <changelog-file>`, require at least 2. Table entries that correspond to git-tracked changes are cross-checked against `git diff --name-only` for the phase commit range. New files are annotated "(NEW)".

## Check 7: research/review convention
If contextType is research or review: Added, Changed, and Fixed each contain only the None line, and Verification has at least one artifact path.

## Check 8: frontmatter completeness
Keys present: title, description, trigger_phrases (at least 2 entries), importance_tier (important or normal), contextType (implementation, research, or review). Run `grep -c "^contextType:\|^importance_tier:\|^trigger_phrases:" <changelog-file>`, require 3.

## Check 9: date heading format
Run `grep -c "^## [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]" <changelog-file>`, require exactly 1.

## Check 10: spec folder blockquote present
Run `grep -c "^> Spec folder:" <changelog-file>`, require at least 1. Phase children must also pass `grep -c "^> Parent packet:"` at least 1.
