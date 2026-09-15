---
title: "Acceptance Criteria: Phase 8: agent-mirror-parity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/049-deep-loop-alignment-review/008-agent-mirror-parity"
    last_updated_at: "2026-09-16T01:45:00Z"
    last_updated_by: "agent-mirror-parity"
    recent_action: "Recorded the criteria and their evidence"
    next_safe_action: "Close the phase and hand off to 009-containment-promise-and-severity-scale"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md"
      - ".opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-mirror-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the .claude/agents/deep-review.md path-reference exception have had its own pass?"
    answered_questions:
      - "The budgetProfile/edgeCases demand was dropped rather than carried; the two keys had no consumer and carrying them would change a shared canonical schema."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: agent-mirror-parity

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 008-agent-mirror-parity
**Level:** 2
**Status:** Complete
**Date:** 2026-09-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the six agent trees, When the crosswalk is read, Then each of the five source keys has a row for each of the six trees and names what stands in place of a declaration that cannot translate | crosswalk sections 2.1-2.5 at `.opencode/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md:66`, `:103`, `:119`, `:134`, `:149`; the sanctioned-delta list is section 3 at `:160` | Met | - |
| AC-002 | REQ-001 | Given a manual invoker, When they open either agents directory, Then its README names the crosswalk and states that a tree silent about model and effort means "no pin" | `.opencode/agents/README.txt:11` and `:14`; `.claude/agents/README.txt:11` and `:14`; the manual-invocation section at `.opencode/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md:183`; the packet README indexes the crosswalk at `.opencode/skills/system-deep-loop/deep-improvement/README.md:206` | Met | - |
| AC-003 | REQ-002 | Given the two hubs that multiplex one packet across modes, When their manifests are generated, Then each mode carries the leaves its router scopes it to | `.opencode/skills/system-deep-loop/leaf-manifest.json:30` (agent-improvement, 23 leaves) and `:109` (model-benchmark, 47 leaves); `.opencode/skills/sk-doc/leaf-manifest.json:183` (sk-create-skill, 19) and `:204` (sk-create-skill-parent, 15); both scope files are `.opencode/skills/system-deep-loop/leaf-scopes.json` and `.opencode/skills/sk-doc/leaf-scopes.json` | Met | - |
| AC-004 | REQ-002 | Given two workflow modes whose scoped leaf sets normalise to the same digest, When a manifest is built, Then the build fails with a named error instead of writing a colliding manifest | refusal at `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:383`; helpers at `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:353` and `:370`; fixture at `.opencode/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs:81`; pre-fix run exited 2 with `MODE_LEAF_SET_COLLISION` on both real hubs | Met | - |
| AC-005 | REQ-002 | Given a hub with no `leaf-scopes.json`, When its manifest is generated, Then its bytes are unchanged | fallback walk taken at `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:262` when the mode has no scope; `ci-leaf-manifest-freshness.cjs` reports `checked=13 fresh=13 failed=0` with the four scoping-free hubs' digests unchanged (mcp-tooling `a7957849`, sk-code `e72482a8`, sk-design `1cdca644`, cli-external-orchestration `6b0e8212`) | Met | - |
| AC-006 | REQ-004 | Given the four trees that demanded `budgetProfile` and `edgeCases`, When the trees are searched, Then neither key is demanded anywhere and the derived trees still match their canonical source | the rewritten lines are `.opencode/agents/deep-review.md:167` and `:520` and `.claude/agents/deep-review.md:154` and `:507`; the regenerated trees carry the same text; `rg -n "budgetProfile\\|edgeCases" .opencode/agents .claude/agents .pi/agents .codex/agents` returns nothing; both sync scripts report `PASS: 12 agents are in sync` | Met | - |
| AC-007 | REQ-005 | Given the change set, When every mirror gate runs, Then each exits zero | `check-agent-mirror-sync.cjs:3` - "12 agent(s) checked - all mirrors in sync - OK"; `agent-roster-mirror-check.cjs:122` - `STATUS=OK` for all five runtimes; `sync-agents-pi.cjs:212` and `sync-agents.cjs:261` - `PASS: 12 agents are in sync`; the leaf gates: `ci-leaf-manifest-freshness.cjs:165` checked=13 fresh=13, `ci-skill-root-metadata.cjs:657` checked=13 passed=13, `ci-skill-derived-freshness.cjs:72` checked=13 fresh=13, `parent-skill-check.cjs:1476` clean for both touched hubs | Met | - |
| AC-008 | REQ-003 | Given this change set, When the deep-loop suite runs, Then it exits zero | `cd .opencode/skills/system-deep-loop/runtime && npx vitest run --no-coverage`: 154 files passed, 2677 of 2685 tests passed, 8 skipped, exit 0; recorded at `implementation-summary.md:119` | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

Every criterion is met with observed evidence. The two hubs that multiplex one packet across workflow modes now hand each mode its own leaves, and the generator refuses a future collision instead of writing one; the six-tree translation contract is written down where both agent READMEs point; and the state keys the deep-review bodies demanded but no consumer read are gone from all four trees that carried them. The deep-loop suite exits zero with the same counts as before the change, and every mirror gate is green.
<!-- /ANCHOR:closure -->
