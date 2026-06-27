# Iteration 003 - Cross-Reference Integrity

## Dimension

Cross-reference integrity: every cited path should resolve and point to the intended owning document.

## Review Actions

- Scanned new and edited design-context files for Markdown links and inline `.md` path citations.
- Checked existence relative to the citing document when the path is written as a path.

## Findings

### F-003 - P1 - Shared contract has non-resolving bare path citations

Hypothesis confirmed. The contract correctly cites explicit owning paths at `.opencode/skills/sk-design/shared/context_loading_contract.md:16` and `.opencode/skills/sk-design/shared/context_loading_contract.md:27`, but then switches to bare filenames for required resources.

Examples:

- `.opencode/skills/sk-design/shared/context_loading_contract.md:37` cites `brief_to_dials.md` without the owning relative path.
- `.opencode/skills/sk-design/shared/context_loading_contract.md:40` cites `audit_contract.md`, `accessibility_performance.md`, `evidence_capture.md`, and `audit_evidence_worksheet.md` without paths.
- `.opencode/skills/sk-design/shared/context_loading_contract.md:134` cites `audit_evidence_worksheet.md` without the asset path.

From `shared/context_loading_contract.md`, those bare names resolve nowhere. The actual files exist under `../design-interface/references/design-process/brief_to_dials.md`, `../design-audit/references/audit_contract.md`, `../design-audit/references/accessibility_performance.md`, `../design-audit/references/evidence_capture.md`, and `../design-audit/assets/audit_evidence_worksheet.md`.

Fix: make every cited file path explicit and relative to the contract.

Review verdict: CONDITIONAL
