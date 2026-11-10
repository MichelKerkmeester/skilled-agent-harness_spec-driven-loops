---
title: "Resource map — swe-2-research lineage"
trigger_phrases: []
---
# Resource map — swe-2-research

All paths relative to repository root unless absolute.

## Packet documents (primary evidence)

- `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md` — phase map; load-bearing ordering rules; pattern reference to sibling packet (:196)
- `specs/.../025/goal.md` — completion criteria (:81), phase ledger (:114-117), deviations table incl. sweep-miss (:144), .github residue (:145), write-containment incident (:146), D8/D10 amendments (:147-148)
- `specs/.../025/001-surface-inventory/inventory.md` — frozen baseline `6012ec5c7d` (:22-30), env-block discovery (:152-155), caller classification (:160-172)
- `specs/.../025/002-daemon-transport-decision/{baseline,warm-mechanism,protocol-contract}.md` — 3008ms-vs-926ms measurement; MCP-client-starts-daemon + Pi gap; D1/D7 conflict + bespoke-protocol rejection
- `specs/.../025/003-cli-front-door-parity/parity/{report.json,frozen-inputs.json,cli-vs-mcp-parity.cjs,verdict.md}` — 22 cases / 7 matched / 15 named-allowlisted / 0 differed
- `specs/.../025/004,005 implementation-summary.md` — unfilled "Not started" scaffolds (packet-record residue evidence)
- `specs/.../025/007-docs-and-residue-sweep/spec.md` — sweep method, risks (:156 "run every command a document tells a reader to run"), exemption classes (:172-176)
- `specs/.../025/008-verification-and-closeout/{acceptance-criteria,latency-delta}.md` — AC rows 005-008 (:60-68), closure statement (:89-97), two-baselines method (:32-34,56-58)
- `specs/.../025/009-deep-review-decommission/review/_archive/20260911T192702Z/lineages/deepseek-review/review-report.md` — nine required findings + F015-F017 record findings (read as packet evidence; defect hunt not repeated)

## Live code / config (re-verified on current tree)

- `.opencode/bin/skill-advisor.cjs:22-23` — `mcpServerDir` name outliving referent; dist path
- `.opencode/bin/system-skill-advisor-launcher.cjs:83-91` — `REPO_ENV_DEFAULTS` (rehomed env; ".env entry still wins")
- `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:382-399` — prompt-time markers → `defaultWarmOnly`
- `.opencode/skills/system-skill-advisor/runtime/dist/hooks/lib/skill-advisor-cli-fallback.js:66-73,148-150` — repaired budget resolver; `--no-warm-only` with defect-recording comment
- `.opencode/skills/system-skill-advisor/runtime/lib/context/caller-context.ts:6-10` — trust gate; "Only 'stdio'" comment
- `.opencode/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts:19` — cross-package `TARGET_REL`
- `.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:141-142` — negative-guard test
- `.opencode/plugins/system-skill-advisor.js:374,1456-1462` — kept-by-constraint bridge-* names
- `.opencode/bin/README.md` (daemon-backed CLI shims section) — "registers no MCP server"
- `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:164` — "no MCP server to fall back to"
- `.opencode/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:6` — `"mcp recommend tool"` trigger phrase
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:191-196,2644` — repaired `--convergence-mode` binding
- `.github/workflows/routing-registry-drift.yml`, `.gitignore` — CI/ignore surfaces now clean

## Commits (read via `git show`)

`6012ec5c7d` (frozen inventory) · `514f2be726` (CLI local-scorer fallback + caller move) · `e8d564ca98` (hook move; three exposed defects) · `7920288acb` (bounded cold-start) · `91fd9b6226` (004 close, dependents handed to 005) · `eb53802beb` (deregistration; env rehome) · `077dbf804d` (bridge deletion) · `3def6d6c9b` (wire migration after the halt) · `3feab865ea` (rename, 407 path updates) · `127aef03e7` / `afd10f291f` (docs sweep; changelog restore) · `9015d00c79` (test retirement accounting; full-suite fix) · `f5c55c7eb8` (trigger-index regeneration)

## Sibling packet (corroboration)

- `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md:94,116-117,129,142-143` — independent occurrence of the same residue taxonomy; literal-zero criterion amended; code seams broken by removal

## Excluded

- `specs/.../025/010-deep-research-residue/research/` — not read (independence constraint)
