# Phase 001 — Adversarial Review (DeepSeek RCAF brief)

## Role
You are a senior documentation-standards reviewer. Your strength is adversarial verification of mechanical refactors — finding the single place a rule was applied wrong.

## Context
Repository: an OpenCode AI-assistant framework (CWD = repo root). A change (phase 001 of spec 133) de-numbers per-feature snippet FILENAMES in the "feature catalog" and "manual testing playbook" documentation STANDARDS, while KEEPING the numeric prefix on CATEGORY FOLDERS. The transformation rules were:
- snippet filename `NNN-feature-name.md` / `{NN}-{feature-name}.md` / `{NNN}-{feature-name}.md` → `feature-name.md` / `{feature-name}.md`
- category folder `NN--category-name/` UNCHANGED (keeps its number) — this is the #1 guardrail
- Feature IDs in content (`{CAT}-001`, `{CAT1}-001`, `M-219`, `EX-001`, `{PREFIX}-{NNN}`) UNCHANGED — they are scenario identifiers, not filenames
- `validate_document.py` logic UNCHANGED — only a stale code comment was de-staled (`NNN-feature.md` → `feature.md`)
- an ordering rule ADDED to BOTH reference docs (snippet order defined by the root doc listing, not the filename)

Artifacts to read directly (you have file read access):
- The full diff: `.opencode/specs/skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/scratch/phase-001.diff` (13 files)
- The two reference docs: `.opencode/skills/sk-doc/references/feature_catalog_creation.md` and `.opencode/skills/sk-doc/references/manual_testing_playbook_creation.md`

Pre-plan (medium):
1. Read the diff. For every `+`/`-` hunk, classify which token changed (filename vs folder vs Feature ID vs comment vs prose).
2. For every `+` line, check: was any CATEGORY FOLDER `NN--` number dropped? Was any Feature ID mangled? Was any non-numbering content altered? Any of these = a FAILURE.
3. Check completeness: any numbered snippet-FILENAME token left unchanged in a touched file? Is `validate_document.py` change comment-only (no regex/logic delta)? Is the ordering rule present in BOTH reference docs?

## Action
Adversarially verify this de-numbering diff is correct AND complete. Actively try to FIND a defect: a dropped category-folder number, a mangled Feature ID, an inconsistent or missed de-numbering, an example-tree collision (two identical filenames in one folder), or an unintended logic change in `validate_document.py`.

Acceptance criteria:
- Every category-folder `NN--` token is preserved in every `+` line.
- No Feature ID was altered.
- The `validate_document.py` change is comment-only (no regex/logic delta).
- The ordering rule is present in both reference docs.
- No numbered snippet-FILENAME token remains in the touched files.

## Format
Return ONLY a single JSON object in one fenced ```json block, no prose outside it:
```json
{ "verdict": "PASS" | "FAIL", "findings": [ { "severity": "P0"|"P1"|"P2", "file": "<path>", "issue": "<what is wrong>", "evidence": "<the offending token or line>" } ], "summary": "<= 2 lines" }
```
If you find zero defects: `verdict` = "PASS", `findings` = []. If confidence in a finding < 80%, set severity "P2" and prefix the issue with "LOW CONFIDENCE:".

Constraints:
- Read-only. Do NOT modify any file.
- The spec folder is pre-approved (skip Gate 3); do not ask questions.
