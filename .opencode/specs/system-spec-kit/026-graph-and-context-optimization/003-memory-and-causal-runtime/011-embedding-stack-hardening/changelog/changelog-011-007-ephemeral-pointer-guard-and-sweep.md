# Changelog , , ,  007: Ephemeral-pointer guard + comprehensive comment sweep

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Created standalone dependency-free guard (scripts/validation/ephemeral-pointer-audit.mjs, ~470 LOC) enforcing sk-code §4 "No ephemeral-artifact pointers"
- Guard inspects comment regions only, flagging spec folder/number, task/checklist/requirement ids, review-finding ids, ADR ids, and ticket/issue refs
- Guard explicitly allows durable look-alikes: HTTP codes, embedding dims, token tiers, V16: schema tags, JSDoc @example, runtime path constants, external standards, internal Safeguard #N enumerations
- Comprehensive comment sweep: 261 comment-only fixes across 119 files to achieve guard-clean (0 violations)
- Affected directories: mcp_server/**, scripts/**, shared/**, .opencode/bin/**
- Zero dist drift (edits behaviorally inert)

## Why
Packet 006 cleaned ephemeral-artifact pointers using hand-rolled grep patterns that were incomplete, covering only ~10% of the debt. A purpose-built detector revealed 274 violations across 116 files. A precise guard is needed to mechanically verify the rule and can gate CI/pre-commit.

## Verification
- Whole-tree guard (node ephemeral-pointer-audit.mjs system-spec-kit bin): PASS , , ,  0 violations, exit 0
- Guard self-test (BAD/GOOD fixture): PASS , , ,  flags BAD, passes GOOD
- TS build (@spec-kit/shared + @spec-kit/mcp-server): PASS , , ,  exit 0
- dist/ drift: PASS , , ,  0 files (edits behaviorally inert)
- node --check touched .cjs: PASS
- validate.sh --strict (this packet): PASS
