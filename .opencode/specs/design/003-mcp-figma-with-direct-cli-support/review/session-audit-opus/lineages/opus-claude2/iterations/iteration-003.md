# Iteration 003 — Traceability

**Dimension**: D3 Traceability / Spec-Alignment
**Protocols run**: `spec_code` (core), `checklist_evidence` (core), `skill_agent` / `feature_catalog_code` / `playbook_capability` (overlay)
**Session**: fanout-opus-claude2-1781464600582-ntawto

## spec_code (core, hard)

| Req | Claim | Shipped evidence | Status |
|-----|-------|------------------|--------|
| REQ-001 | install selects full repo build, warns vs npm `figma-cli` | `install.sh:51` `MIN_FULL_VERSION="1.2.0"`; `install.sh:113` warns "Do NOT 'npm i -g figma-cli'" | pass |
| REQ-002 | surface classified + eval/raw/run arbitrary | `tool_surface.md:62-162`, §7 | pass |
| REQ-003 | safe default, yolo gated, unpatch rollback | `connect-safe.sh`, `connect-yolo.sh:10-27`, `unpatch.sh` | pass |
| REQ-004 | MCP path documents get_figma_data + download_figma_images, opt-in | `mcp_wiring.md:111` | pass |
| REQ-005 | sibling terminal-control structure | package shape matches mcp-open-design / mcp-chrome-devtools | pass |
| REQ-006 | schema-2 graph + reciprocal sibling edges + live verify | `graph-metadata.json:2` schema_version 2; reciprocal edges confirmed below | pass |

**Reciprocal-edge verification (REQ-006):** `mcp-open-design/graph-metadata.json:23,37` and `mcp-chrome-devtools/graph-metadata.json:23,38` both carry a back-edge to `mcp-figma`. Reciprocity holds for the two live siblings. [SOURCE: .opencode/skills/mcp-open-design/graph-metadata.json:23] [SOURCE: .opencode/skills/mcp-chrome-devtools/graph-metadata.json:23]

spec_code: **pass (6/6)**.

## checklist_evidence (core, hard) — PARTIAL

26 items are marked `[x]`. One checked item is contradicted by the shipped artifact:

- **CHK-013 [P1] "Follows house patterns ... no em dashes, no new prose semicolons"** (`checklist.md:61`) — FALSE against the artifact (see F-OPUS-003).

The remaining 25 items resolve. CHK-010 (package_skill.py --check PASS) and CHK-023 (live verify figma-ds-cli 1.2.0 + Code Mode discovery) are claimed-verified with evidence recorded in `implementation-summary.md`; not independently re-runnable in this read-only review but internally consistent.

checklist_evidence: **partial (25/26)** — one hard-gate item fails.

## Overlay protocols

- `feature_catalog_code` — **pass**: 8 capability areas, 8 per-feature files, command counts hedged as verify-with-`--help`; classes match `tool_surface.md`. [SOURCE: .opencode/skills/mcp-figma/feature_catalog/feature_catalog.md:199-215]
- `playbook_capability` — **pass**: playbook scenarios map to executable figma-ds-cli verbs (safe-connect, daemon health, read-only inspect/export, destructive-verb-refused, framelink discovery).
- `skill_agent` — **pass**: SKILL.md `allowed-tools` (Read, Bash, Grep, Glob, call_tool_chain) is self-consistent; no runtime agent exists.
- `agent_cross_runtime` — **N/A**.

## Findings

### F-OPUS-003 (P1, traceability) — voice-sweep completion claim is false
The packet asserts and CHECKS as PASS that the skill has no em dashes and no prose semicolons:
- `spec.md:151` NFR-C01 "no em dashes and no prose semicolons in new prose"
- `checklist.md:61` CHK-013 marked `[x]` "no em dashes, no new prose semicolons"
- `tasks.md:74` "Voice sweep: no em dashes, no prose semicolons"
- `implementation-summary.md:62` "Voice sweep | PASS, no em dashes, no new prose semicolons"

The shipped artifact contradicts all four: `SKILL.md` contains **31 em dashes** (e.g. `SKILL.md:14`, `:16`, `:18`, `:27`, `:28`) and a **prose semicolon** at `SKILL.md:14` ("The CLI is the primary surface; the MCP is opt-in"). Em dashes appear across 15 of the skill's markdown files. The two named sibling skills — the explicit model under REQ-005 — contain **0 em dashes**, confirming the house norm and the divergence.

This is a `checklist_evidence` hard-gate failure: a verified completion claim that is demonstrably false, not a missing artifact. The remediation (strip em dashes/semicolons OR amend the false claim) is low-risk, hence P1 / CONDITIONAL rather than P0.
[SOURCE: .opencode/skills/mcp-figma/SKILL.md:14] [SOURCE: .opencode/specs/design/003-mcp-figma-with-direct-cli-support/002-skill-build-and-registration/implementation-summary.md:62]

### F-OPUS-004 (P2, traceability) — stale mcp-magicpath references in spec-002 docs
`spec.md:93` (Files Changed) and `implementation-summary.md:5` cite `mcp-magicpath` as a sibling that received a reciprocal edge. `mcp-magicpath` is deleted (`git status`: `D .opencode/changelog/mcp-magicpath`) and the shipped `mcp-figma/graph-metadata.json` correctly has NO magicpath edge. The shipped code is clean; the spec-002 prose is stale. (The parent spec already records "dropped deleted-magicpath refs", so the cleanup was partial.)
[SOURCE: .opencode/specs/design/003-mcp-figma-with-direct-cli-support/002-skill-build-and-registration/spec.md:93]

### F-OPUS-005 (P2, traceability) — zero-fingerprint session_dedup placeholder
`spec.md:20` and the child docs carry `fingerprint: "sha256:0000...0000"` placeholders rather than a computed content hash. Advisory; affects `CONTINUITY_FRESHNESS` only when enforced.
[SOURCE: .opencode/specs/design/003-mcp-figma-with-direct-cli-support/spec.md:20]

## Claim adjudication (typed packet for the P1)

- **findingId**: F-OPUS-003
- **claim**: spec-002 records "Voice sweep: PASS, no em dashes, no new prose semicolons" but shipped SKILL.md contains 31 em dashes and a prose semicolon.
- **evidenceRefs**: ["SKILL.md:14", "SKILL.md:16", "implementation-summary.md:62", "checklist.md:61", "spec.md:151"]
- **counterevidenceSought**: re-read SKILL.md:14/16/18/27/28 (prose, not code/tables); checked sibling skills mcp-open-design + mcp-chrome-devtools (0 em dashes → confirms norm); verified the matches are U+2014 spaced em dashes in prose.
- **alternativeExplanation**: em dashes might be tolerated under a looser reading of "house voice". Rejected: NFR-C01 explicitly forbids them AND the packet recorded its own voice sweep as PASS, so by its own contract this is a violation.
- **finalSeverity**: P1
- **confidence**: 0.9
- **downgradeTrigger**: an operator confirms the house style permits em dashes and waives NFR-C01 → downgrade to P2.
- **transitions**: none (asserted and final severity both P1).

## Coverage

- Dimensions covered so far: D1, D2, D3
- New findings this iteration: 3 (1 P1, 2 P2)
- newFindingsRatio: 0.50 (P0/P1 override floor applies; P1 present)

Review verdict: CONDITIONAL
