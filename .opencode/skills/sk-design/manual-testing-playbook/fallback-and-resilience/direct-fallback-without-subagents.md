---
title: "FR-002: Direct Fallback Without Subagents"
description: "Verify sk-design modes preserve their proof bar when subagents are unavailable, including the md-generator backend boundary."
version: 1.0.0.0
id: FR-002
expected_workflow_mode: motion
expected_leaf_resources: []
---

# FR-002: Direct Fallback Without Subagents

## 1. OVERVIEW

This scenario verifies that direct fallback is not a weaker workflow. The four advisory modes must stay Read/Glob/Grep-only, while `md-generator` keeps its normal backend boundary.

## 2. SCENARIO CONTRACT

**Realistic user request**: The runtime cannot dispatch subagents, but the user still needs the selected mode to complete the same context capture and proof checks.

**Exact prompt**:
```text
Subagents are unavailable. motion: define the feedback states and reduced-motion path for this toolbar directly in the current session, and show the procedure card, context basis, proof line, and tool boundary you used.
```

**Expected mode resolution**: `motion`.

**Expected procedure card**: `design-motion/procedures/interaction-states-pass.md`.

**Expected fallback**: Execute directly with Read, Glob, and Grep only, preserving the same proof bar.

**md-generator variant**: `Subagents are unavailable. md-generator: validate this DESIGN.md against tokens.json directly in the current session and show the selected procedure or fallback, backend entrypoint, provenance proof, and validation result.` The expected fallback preserves md-generator's normal Write/Edit/Bash-capable backend boundary and dedicated validation entrypoint.

## 3. TEST EXECUTION

### Preconditions

1. The tested mode has `Context, Proof, And Direct Fallback` in `SKILL.md`.
2. The executor can observe tool calls or transcript enough to verify no forbidden fallback tool was used by a read-only mode.

### Exact Command Sequence

1. Run the exact motion prompt and save output to `/tmp/skd-FR002-motion.txt`.
2. Run the md-generator variant and save output to `/tmp/skd-FR002-md-generator.txt`.
3. Capture selected cards or no-card fallback, context basis, proof lines, and tool-boundary statements.

### Pass/Fail Criteria

- **PASS** iff motion executes directly without Task, Write, Edit, or Bash and still provides selected card, context basis, reduced-motion proof, and verification risks; md-generator executes directly under its normal backend boundary and names the backend entrypoint/provenance/validation proof.
- **FAIL** iff read-only fallback dispatches a subagent, uses mutating tools, skips proof because subagents are unavailable, or md-generator is incorrectly forced into Read/Glob/Grep-only behavior.

### Failure Triage

1. Re-read the affected mode's `Context, Proof, And Direct Fallback` section.
2. For read-only modes, compare observed tool calls with Read/Glob/Grep-only language.
3. For md-generator, re-read `Backend Boundary Preservation` and confirm fallback does not weaken extract/write/validate requirements.

## 4. SOURCE FILES

- `.opencode/skills/sk-design/design-motion/SKILL.md`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`

## 5. SOURCE METADATA

- **Critical path**: Candidate for operator confirmation
- **Destructive**: No for read-only mode; md-generator uses sandboxed output only when executed
- **Concurrent-safe**: Read-only branch yes; md-generator branch serial
