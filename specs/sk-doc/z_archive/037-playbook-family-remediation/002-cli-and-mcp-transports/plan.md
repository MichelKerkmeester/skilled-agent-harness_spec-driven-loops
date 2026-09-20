---
title: "Plan: CLI and MCP transport playbook remediation"
description: "Remediate fourteen transport roots per package, and when a violation class turns out to be a grader defect, fix the grader and revert whatever the documents were made to do to satisfy it."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "cli and mcp transport playbook remediation plan"
  - "grader defect routing plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-doc/037-playbook-family-remediation"
_memory:
  continuity:
    packet_pointer: "sk-doc/037-playbook-family-remediation/002-cli-and-mcp-transports"
    last_updated_at: "2026-08-29T11:45:00Z"
    last_updated_by: "claude"
    recent_action: "Remediated fourteen roots and routed the notion defect to the grader"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration"
      - ".opencode/skills/mcp-tooling"
    session_dedup:
      fingerprint: "sha256:abfad6186f12cc308d551ea603bfd80a74ad5ef97d0dd3a5b1f526ba465ba16b"
      session_id: "2026-08-29-sk-code-031-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: CLI and MCP transport playbook remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Both transport families are shaped the same way: a parent skill registered in `routingGoldRoots`, and beneath it a set of mode packages each carrying its own `manual-testing-playbook/` root under the operator-scenario contract at tier `FAIL_CLOSED`. The parents are exempt; the modes are not. Fourteen mode roots were dirty. Their playbooks are also the fleet's densest source of literal invocation syntax, because a transport package documents how to call something — which is why a grader that scans raw markdown for links without excluding fenced code produces its largest false-positive yield here.

### Overview

Take each of the fourteen roots to zero with its own `--package` run. Before editing a document to satisfy a reported violation, establish whether the violation is real: if the grader is reading correct source as broken, the fix belongs in the grader and the document stays as written. Any edit already made as a workaround for such a defect is reverted once the grader is corrected.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Starting counts measured per root: six CLI roots at 1,321 total, eight MCP roots at 837 total, 2,158 across the family.
- Both family parents confirmed as `routingGoldRoots` members, so their scenarios are outside the operator contract and no mode root inherits an exemption from them.

### Definition of Done

- All fourteen roots report `violations=0` at `tier=FAIL_CLOSED` under their own runs.
- `mcp-notion` reaches zero with its bracket-index call syntax unchanged.
- No spaced sample-code workaround remains anywhere under `.opencode/skills/`.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fix at the layer that is wrong. A reported violation has two possible causes — the document does not meet the contract, or the grader does not read the document correctly — and the repair layer follows the cause. Editing a document to satisfy a defective grader passes the run and leaves the defect armed for the next author, so that path is closed by policy rather than by judgement in the moment.

### Key Components

- `validate-playbook-package.cjs --package <root> --strict`: the per-root measurement, run once per package so each mode gets its own identifier and its own tier rather than the parent's.
- The Code Mode bracket-index call form, `notion["notion_tool"]({...})`: real invocation syntax that the grader's link scan misread across 34 files in `mcp-notion`. The syntax is the requirement, not the problem.
- `038-authoring-hardening` phase `002-validator-false-positives`: the durable repair, which stops the link scan from reading fenced code.

### Data Flow

Per-root measurement to establish each package's count, then classification of each violation class as document defect or grader defect, then repair in the matching layer, then per-root measurement again to confirm `violations=0` with the documented invocation syntax still present in the source.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Measure all fourteen mode roots individually and record each starting count. Confirm both family parents are routing-gold registered so no mode root is accidentally graded under a parent's exemption.

### Phase 2: Core Implementation

Remediate the six CLI orchestration roots and the eight MCP tooling roots by violation class. Classify the `mcp-notion` link violations as a grader defect and route the durable fix to `038-authoring-hardening` rather than rewriting the call syntax in 34 files.

### Phase 3: Verification

Re-run `--package <root> --strict` on all fourteen roots. Confirm `violations=0` everywhere, confirm `mcp-notion`'s bracket-index syntax is still present in its playbook, and confirm the spaced workaround form is absent from the tree.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral: `validate-playbook-package.cjs --package <root> --strict` per root, before and after, reading the full census line. Controlled: two source-level checks act as the controls on how the counts were reached — the bracket-index call syntax must still be present in `mcp-notion`'s playbook after it reports zero, and a tree-wide search for the spaced `hooks['<key>'] (` workaround form must return no matches. A root that reached zero honestly passes both; a root that reached zero by rewriting its own correct source fails the first.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` and its `playbook-corpus-manifest.json`.
- `038-authoring-hardening` phase `002-validator-false-positives` for the grader fix this phase depends on.
- No new packages or network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Documentation-only within this phase and fully reversible: reverting the fourteen roots' `manual-testing-playbook/` trees restores their prior contents and counts. The grader change this phase depends on is owned and reversible in `038-authoring-hardening`; reverting it there would restore the false positive in `mcp-notion` without changing any document in this phase.

<!-- /ANCHOR:rollback -->
