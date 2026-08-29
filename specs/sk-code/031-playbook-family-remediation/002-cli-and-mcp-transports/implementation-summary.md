---
title: "Implementation Summary: CLI and MCP transport playbook remediation"
description: "Fourteen transport roots now report zero operator-scenario violations at fail-closed tier, and the one defect that was in the grader rather than the documents was fixed there instead."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "cli and mcp transport playbook remediation implementation"
  - "code mode call syntax false positive summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/031-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-code/031-playbook-family-remediation/002-cli-and-mcp-transports"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped the transport cleanup; fourteen roots verified at zero violations"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration"
      - ".opencode/skills/mcp-tooling"
      - ".opencode/skills/mcp-tooling/mcp-notion/manual-testing-playbook"
    session_dedup:
      fingerprint: "sha256:2274d2a10ced0c7ea1dbd97e738f6baf52a6d072e60ad4036d9b20183a3cdf51"
      session_id: "2026-08-29-sk-code-031-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: CLI and MCP transport playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-cli-and-mcp-transports |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — 2,158 violations across fourteen roots cleared to zero, with one defect routed to the grader |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Fourteen transport playbook roots went from 2,158 operator-scenario contract violations to zero, and one violation class was proven not to belong to the documents at all.

1. **Six CLI orchestration roots: 1,321 violations to zero.** `cli-opencode` from 306 to zero and now `scenarios=55 categories=13`; `cli-claude-code` from 301, now 52 across 12; `cli-devin` from 226, now 35 across 11; `cli-cursor` from 168, now 40 across 13; `cli-codex` from 163, now 42 across 11; `cli-pi` from 157, now 37 across 11. All `tier=FAIL_CLOSED`, `routing_gold_excluded=0`, `violations=0`.

2. **Eight MCP tooling roots: 837 violations to zero.** `mcp-figma` from 126, now 17 across 6; `mcp-mobbin` from 126, now 18 across 6; `mcp-chrome-devtools` from 117, now 30 across 7; `mcp-refero` from 115, now 17 across 5; `mcp-click-up` from 112, now 44 across 10; `mcp-aside-devtools` from 105, now 29 across 8; `mcp-notion` from 103, now 33 across 8; `mcp-obsidian` from 33, now 30 across 6. All `tier=FAIL_CLOSED`, `violations=0`.

3. **One defect fixed in the grader, not the documents.** In `mcp-notion`, the real Code Mode call syntax `notion["notion_tool"]({...})` was read as a markdown link across 34 files because the link scan did not exclude fenced code. The durable repair shipped in `032-authoring-hardening` phase `002-validator-false-positives`. The call syntax in the playbook is unchanged, because it was correct.

4. **A workaround that had contorted real code was reverted.** Before the grader was fixed, two remediation agents had inserted a space into sample JavaScript — the form `hooks['x'] (...)` — so the link scan would stop firing on it. That is a correct code sample made wrong to make a report green. It was removed once the grader was repaired.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each root was measured on its own with `validate-playbook-package.cjs --package <root> --strict` rather than through a fleet run, because a fleet run resolves a nested package to its parent identifier and would have reported these fourteen modes under the two family parents, both of which are routing-gold registered and therefore exempt. That is the same roll-up behaviour that let the backlog grow, so it could not also be the instrument used to prove the backlog gone.

The `mcp-notion` count is the part of this phase worth reading twice. A hundred and three reported violations, 34 files implicated, and the accused syntax was correct: `notion["notion_tool"]({...})` is how a Code Mode tool is actually invoked. The grader scanned raw markdown for links without excluding fenced code, so a bracket followed by a parenthesis inside a code sample looked like a link with a missing target. The expensive part of a false positive is not the wasted reading; it is that it teaches whoever is under pressure to make the number fall to change correct source until the pattern stops matching. That is exactly what happened here before the cause was understood, and the record of it is kept in this summary rather than quietly dropped: two agents put a space between the bracket and the parenthesis in sample JavaScript. The space made the grader happy and the sample wrong. Once the grader was fixed at its root, the workaround was reverted, and the absence of that spaced form across `.opencode/skills/` is now a check rather than an assumption.

Every count here is the coordinator's own re-measurement with `--package <root> --strict`, not a figure reported by the agent that did the remediation.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the link-scan defect in the grader rather than across 34 `mcp-notion` files | The documents were correct. Editing them would have passed the run, left the defect armed for the next author, and destroyed real invocation syntax that a reader depends on. |
| Revert the spaced sample-code workaround and record it rather than delete it silently | A packet that keeps only its successes teaches nothing. The workaround is the clearest available example of a false positive doing its real damage, which is to the source rather than to the report. |
| Measure each mode root with its own `--package` invocation | A fleet run resolves a nested package to its parent identifier. Both transport parents are routing-gold registered, so a roll-up would have graded fourteen fail-closed modes under two exempt parents. |
| Leave both family parents in `routingGoldRoots` | Their scenarios are outside the operator-scenario contract by registration, not by omission. Moving them would have changed what the contract covers, which is not remediation. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Six CLI orchestration roots | PASS — `cli-opencode` 55 across 13, `cli-claude-code` 52 across 12, `cli-codex` 42 across 11, `cli-cursor` 40 across 13, `cli-pi` 37 across 11, `cli-devin` 35 across 11; all `tier=FAIL_CLOSED violations=0` |
| Eight MCP tooling roots | PASS — `mcp-click-up` 44 across 10, `mcp-notion` 33 across 8, `mcp-chrome-devtools` 30 across 7, `mcp-obsidian` 30 across 6, `mcp-aside-devtools` 29 across 8, `mcp-mobbin` 18 across 6, `mcp-figma` 17 across 6, `mcp-refero` 17 across 5; all `violations=0` |
| `mcp-notion` syntax preserved | PASS — the bracket-index Code Mode call form is still present in `mcp-notion/manual-testing-playbook/`, and the package reports `violations=0 warnings=0` |
| Workaround absent from the tree | PASS — a recursive search for the `hooks['<key>'] (` form across `.opencode/skills/` returns no matches |
| No root reclassified to reach zero | PASS — all fourteen report `tier=FAIL_CLOSED` and `routing_gold_excluded=0` |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Zero violations is not zero warnings.** Twelve of the fourteen roots still report advisory warnings in the final census — `HAND_TYPED_CENSUS` on all twelve, `RESULT_PERSISTENCE_MARKER_MISSING` on four MCP roots, and `CENSUS_MISMATCH` on three of those four. Only `mcp-click-up` and `mcp-notion` are at `warnings=0`. The operator-scenario contract does not block on warnings, and none was cleared to reach the result claimed here.
2. **The location of the reverted workaround is not recorded.** The shape of the edit and the fact of its reversal are known; which package's sample carried it is UNKNOWN. Only the present-state absence check is reproducible.
3. **The starting counts cannot be re-derived.** Every root is at zero now, so the 306, 301, 226 and the rest are measurements taken before the repair, not checks a later reader can re-run.
<!-- /ANCHOR:limitations -->
