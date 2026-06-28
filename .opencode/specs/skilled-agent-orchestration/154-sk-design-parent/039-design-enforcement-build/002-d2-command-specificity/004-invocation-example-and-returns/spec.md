---
title: "D2-R4 — No concrete invocation example or Returns: line"
description: "Add examples[]{invocation,returnsArtifact} to command-metadata.json and generate a per-command ## Example section with one fenced call and a Returns: line."
trigger_phrases:
  - "d2-r4 invocation example"
  - "invocation example design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R4 — No concrete invocation example or Returns: line

## 1. OBJECTIVE
Give each `/design:*` command a concrete worked example and an explicit statement of what it returns.

## 2. WHY
Wrappers document no example invocation and no `Returns:` line, so the caller cannot see a real call or the artifact it produces.

## 3. TARGET & CLASS
- **Target file(s):** `command-metadata.json` → `.opencode/commands/design/*.md`
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Add `examples[]{invocation,returnsArtifact}` per command in metadata.
- Generate a `## Example` section with one fenced call plus a `Returns:` line.
- Checker fails if the example is absent or the invocation prefix ≠ the command filename.

## 5. ACCEPTANCE
- Checker exits non-zero when `## Example`/`Returns:` is missing or the invocation prefix mismatches the filename; zero otherwise.

## 6. EVIDENCE
- `commands/design/audit.md:24` — wrapper ends without an example or a Returns: line.
- Source: `research/research.md` §5 (D2-R4)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
