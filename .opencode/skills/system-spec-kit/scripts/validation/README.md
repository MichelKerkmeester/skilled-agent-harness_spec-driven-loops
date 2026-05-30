---
title: "Validation Scripts: Spec Packet Checks"
description: "CLI validators for comment hygiene, continuity freshness and evidence-marker integrity."
trigger_phrases:
  - "ephemeral pointer audit"
  - "comment hygiene"
  - "continuity freshness"
  - "evidence marker lint"
  - "validation scripts"
---

# Validation Scripts: Spec Packet Checks

## 1. OVERVIEW

`scripts/validation/` contains focused validators used by the Spec Kit validation flow, the pre-commit gate and the write-time comment-hygiene hook. The scripts produce structured pass / warn / fail output that shell wrappers and strict validation gates consume.

Current responsibilities:

- Flag code comments that embed ephemeral tracking-artifact pointers (spec numbers, task / checklist / requirement / ADR / review-finding ids).
- Check whether continuity timestamps lag graph-metadata timestamps.
- Audit `[EVIDENCE: ...]` markers across spec-packet markdown.
- Provide a strict-mode evidence-marker lint bridge for validation scripts.

## 2. DIRECTORY TREE

```text
validation/
+-- ephemeral-pointer-audit.mjs  # Comment-hygiene guard (sk-code §4 enforcement)
+-- continuity-freshness.ts      # Continuity timestamp freshness validator
+-- evidence-marker-audit.ts     # Evidence-marker parser, report and optional rewrap tool
+-- evidence-marker-lint.ts      # Strict-mode bridge around the evidence-marker audit
`-- README.md
```

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `ephemeral-pointer-audit.mjs` | Standalone, dependency-free Node ESM guard that scans code comments only and flags pointers to ephemeral artifacts. Durable WHY comments and external standards (SHA-256, UTF-16, CWE, RFC) are explicitly allowed; the perishable traceability id is what it forbids. |
| `continuity-freshness.ts` | Compares `_memory.continuity.last_updated_at` against the `graph-metadata.json` save time and reports lag. |
| `evidence-marker-audit.ts` | Parses evidence markers while ignoring fenced and inline code; read-only unless `--rewrap` is supplied. |
| `evidence-marker-lint.ts` | Converts audit results into validation-friendly output and exits non-zero under `--strict` when invalid markers exist. |

## 4. COMMENT-HYGIENE GUARD

`ephemeral-pointer-audit.mjs` is the runtime arm of the sk-code §4 "No Ephemeral-Artifact Pointers" rule (`.opencode/skills/sk-code/references/universal/code_style_guide.md §4`). It is wired into the pre-commit gate and the write-time comment-hygiene hook.

What it flags (inside comment regions only): a tracking word plus a number ("spec 031", "phase 005", "packet 117"), zero-padded spec/sub-phase pairs ("029/003"), spec slugs ("031-embedding-stack-hardening"), task ids ("T043"), checklist ids ("CHK-160"), requirement ids ("REQ-005"), ADR ids ("ADR-004"), review-finding ids ("DR-008", "P0-3", "F-001-005") and GitHub issue refs ("#456").

What it deliberately does NOT flag: string/code content (only comments are inspected), durable structural numbers (HTTP codes, embedding dims, schema-version tags), `@example` / format-shape illustrations, runtime path constants the code reads, source line ranges, and externally versioned standards.

Behavior worth knowing:

- File selection is by extension (`.ts .tsx .js .jsx .mjs .cjs .py`) plus shebang detection for extensionless Node / Python scripts; `node_modules`, `.git`, `dist`, `build`, `coverage` and Python cache dirs are skipped.
- The guard never flags itself (`ephemeral-pointer-audit.mjs` is excluded by name).
- Exit codes: `0` clean, `1` violations found, `2` bad invocation (no paths). A non-code-only commit can still print a scary banner from upstream wrappers while this checker reports clean.

## 5. USAGE NOTES

- Run these scripts against spec folders or source trees as noted; the audit recurses directories.
- `evidence-marker-audit.ts` is read-only unless `--rewrap` is supplied.
- `evidence-marker-lint.ts` requires `--folder` and supports `--json` and `--strict`.
- `continuity-freshness.ts` treats missing optional files as skipped checks rather than hard failures.

## 6. VALIDATION

Run from the repository root.

Comment-hygiene smoke check over the spec-kit script tree:

```bash
node .opencode/skills/system-spec-kit/scripts/validation/ephemeral-pointer-audit.mjs \
  .opencode/skills/system-spec-kit/scripts
echo $?   # 0 = clean, 1 = violations, 2 = bad invocation
```

README structure check:

```bash
python .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/system-spec-kit/scripts/validation/README.md
```

Expected result: the audit exits `0` over a clean tree and the README validation exits `0`.

## 7. RELATED

- [`scripts/`](../README.md)
- [`ephemeral-pointer-audit.mjs`](./ephemeral-pointer-audit.mjs)
- [`continuity-freshness.ts`](./continuity-freshness.ts)
- [`evidence-marker-audit.ts`](./evidence-marker-audit.ts)
- [`evidence-marker-lint.ts`](./evidence-marker-lint.ts)
