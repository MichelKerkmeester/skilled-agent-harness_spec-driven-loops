---
title: "Implementation Plan: Phase 5: budget-and-chat-slice-handoff"
description: "This plan creates the budget and runtime handoff reference, then proves a temporary over-budget fixture can meet the cap without losing criteria."
trigger_phrases:
  - "budget and handoff plan"
  - "goal packet budget check"
  - "chat slice versus objective slice"
  - "over-budget fixture"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: budget-and-chat-slice-handoff

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown plus the existing Node.js goal CLI (.skilled/hooks/goal/bin/goal.cjs:203-216). |
| **Framework** | None. The deliverable is a sk-doc reference file (specs/sk-doc/060-create-goal-mode/spec.md:86,89,104). |
| **Storage** | A temporary packet fixture containing goal.md. No runtime goal state is changed (specs/sk-doc/060-create-goal-mode/goal.md:51-54). |
| **Testing** | goal.cjs packet for budget and projection output, strict spec-kit validation for the phase packet. |

### Overview
Create .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md as the only retained phase deliverable. It will measure parent goals with the shared packet command, document the set-string playbook's cut order and preserve all criteria. It will distinguish the printed chat slice from the bind-time objective slice, list the six runtime surfaces and stop at printing the handoff (.skilled/hooks/goal/lib/goal-slice.cjs:59-79,96-118, .skilled/hooks/goal/goal-plugin.md:151-170, specs/sk-doc/060-create-goal-mode/goal.md:51-54).

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004's incoming fixture meets the parent handoff: every phase is bound (specs/sk-doc/060-create-goal-mode/spec.md:145).
- [ ] The packet command, shared slice module, budget manifest and set-string playbook are available at the cited paths (.skilled/hooks/goal/bin/goal.cjs:203-216, .skilled/hooks/goal/lib/goal-slice.cjs:268-285, .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-28, .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71).
- [ ] The retained output path is in the mode packet's reference scope (specs/sk-doc/060-create-goal-mode/spec.md:86,89,104).

### Definition of Done
- [ ] The reference describes the configured 4,000-character budget, packet output fields and cut order.
- [ ] The fixture reports within budget after cuts and keeps the same criterion count.
- [ ] The runtime matrix identifies the chat handoff and excludes bind/set actions from the mode.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One mode reference plus a disposable local fixture. No new runtime component.

### Key Components
- **Budget measurement**: The existing packet command reads the goal and prints packet_durable_chars, packet_budget, objective_slice and chat_slice (.skilled/hooks/goal/bin/goal.cjs:203-216).
- **Handoff reference**: The new file documents the current budget and operator handoff without copying the goal template (specs/sk-doc/060-create-goal-mode/spec.md:89,94-99).
- **Temporary proof fixture**: An over-budget packet is cut in the playbook order and measured again. Its completion-criterion count is compared before and after (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71, specs/sk-doc/060-create-goal-mode/spec.md:146).

### Data Flow
The author writes a temporary top-level packet under the repository root, calls the packet read action with --workspace set to that root, and reads the reported count and budget state. The author then trims in the set-string order and repeats the command. goal.cjs packet prints both projections. The mode reference directs the operator to use chat_slice and stop, while the runtime objective slice remains separate (.skilled/hooks/goal/bin/goal.cjs:203-216, .skilled/hooks/goal/lib/goal-slice.cjs:96-118, specs/sk-doc/060-create-goal-mode/goal.md:51-54).

### Planned budget cut order

The reference will use the set-string playbook's order: frontmatter, log, restated child detail, decision prose, then criterion wording. It will shorten every criterion without dropping one and split the packet if it still does not fit (.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71).

The budget command measures from after the frontmatter fence to the log anchor, so frontmatter and log do not reduce packet_durable_chars when removed. The reference will name that boundary and rerun the packet command after changes to durable content (.skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-28, .skilled/hooks/goal/lib/goal-slice.cjs:59-63).

### Planned runtime handoff matrix

| Runtime | Handoff documented for the reference |
|---------|--------------------------------------|
| Claude Code | Native host goal command. The repository says the speckit workflow hands the stripped parent slice to the operator, but live host behavior cannot be checked from repository files (.skilled/hooks/goal/README.md:81-84). |
| Codex | Native host goal command. The repository documents the same handoff and the same live-host evidence limit (.skilled/hooks/goal/README.md:82-84, .skilled/hooks/goal/goal-plugin.md:159-160). |
| OpenCode | /goal-opencode is the native session-goal command. The mode reference only prints its chat slice and does not invoke packet, bind or set actions (.skilled/hooks/goal/README.md:80, .skilled/commands/goal-opencode.md:34-50). |
| Pi | /goal-pi is registered by the native extension. The mode reference only prints the handoff and does not invoke Pi goal actions (.skilled/hooks/goal/README.md:77, .pi/prompts/goal-pi.md:1-7). |
| Cursor | /goal-cursor packet <path> is a session-free packet read. packet-log is a separate append action, and session binding is unsupported (.cursor/commands/goal-cursor.md:10,14-19). |
| Devin | Goal context is injected by hooks. The repository exposes no Devin goal command surface (.skilled/hooks/goal/README.md:79,84, .skilled/hooks/goal/goal-plugin.md:158). |

The mode prints chat_slice and stops. It never calls goal.cjs bind or goal.cjs set, which remain runtime actions outside this mode (specs/sk-doc/060-create-goal-mode/goal.md:51-54, .skilled/hooks/goal/bin/goal.cjs:153-173,233-246).

A fixed-text cost is not an amendment by itself. The parent log records that the parent was cut from 4,820 to 3,735 durable characters without dropping a criterion. This phase documents the cost and teaches the current budget rule. D4 remains available for a real conflict with the contract (specs/sk-doc/060-create-goal-mode/goal.md:52-54,136).

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase plans a new reference, not a software fix. These surfaces are read-only inputs to that reference.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Goal slice module and packet CLI | Measure durable characters and render the chat and objective projections (.skilled/hooks/goal/lib/goal-slice.cjs:59-79,399-428, .skilled/hooks/goal/bin/goal.cjs:203-216). | Unchanged, cite and reuse the packet action. | Read the final packet output fields and compare the measured count to the configured budget. |
| Runtime goal commands | Manage or inspect runtime-specific goal state (.skilled/hooks/goal/goal-plugin.md:151-170, .skilled/commands/goal-opencode.md:34-50, .pi/prompts/goal-pi.md:1-7). | Unchanged, document their roles without invoking them. | Confirm the reference says it prints chat_slice and does not call bind or set. |

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in tasks.md. It owns the Setup, Implementation and Verification phase checkboxes and task state.

1. **Setup**: Confirm phase 004's handoff, the current 4,000-character setting and the exact slice/projection behavior (specs/sk-doc/060-create-goal-mode/spec.md:145, .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-28, .skilled/hooks/goal/lib/goal-slice.cjs:59-79,96-118).
2. **Write**: Create .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md with the sourced measurement command, the ordered cut rule, the fixed-text decision and the runtime matrix (specs/sk-doc/060-create-goal-mode/spec.md:86,89,104, .skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71).
3. **Prove**: Build a temporary over-budget packet inside the workspace root, preserve its criterion count while trimming it and repeat the packet command. Remove the fixture after recording the output (specs/sk-doc/060-create-goal-mode/spec.md:146).

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

T006 creates a temporary top-level packet under the repository root. Its goal.md starts above 4,000 durable characters and has at least three completion bullets before the log anchor. Run both command blocks in one Bash shell.

```bash
set -e
set -o pipefail
workspace=$PWD
fixture_packet=.tmp-goal-budget-fixture
fixture_root="$workspace/$fixture_packet"
criterion_count() {
  node -e 'const fs=require("node:fs"); const goal=fs.readFileSync(process.argv[1],"utf8"); const section=goal.split("<!-- ANCHOR:completion -->")[1]?.split("<!-- /ANCHOR:completion -->")[0] ?? ""; console.log((section.match(/^- \[[ xX]\] /gm) ?? []).length)' "$fixture_root/goal.md"
}
initial_output=$(node .skilled/hooks/goal/bin/goal.cjs packet "$fixture_packet" --workspace "$workspace")
printf '%s\n' "$initial_output" | rg -q '^packet_budget=over$'
before=$(criterion_count)
```

Now apply the set-string cuts in order to the fixture goal.md. Keep every criterion and record no count change.

```bash
final_output=$(node .skilled/hooks/goal/bin/goal.cjs packet "$fixture_packet" --workspace "$workspace")
printf '%s\n' "$final_output" | rg -q '^packet_durable_chars=[0-9]+$'
printf '%s\n' "$final_output" | rg -q '^packet_budget=ok$'
printf '%s\n' "$final_output" | rg -q '^objective_slice='
printf '%s\n' "$final_output" | rg -q '^chat_slice='
after=$(criterion_count)
test "$before" -eq "$after"
rm -r "$fixture_root"
```

The count command reads only the completion anchor, where the goal contract places its criteria (.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:96-105).

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | No code is added in this phase, no unit test is planned. | Not applicable. |
| Integration | One temporary top-level packet, measured before and after trimming. | goal.cjs packet, node -e, rg and Bash assertions. |
| Manual | Check the reference's citations, six-runtime matrix and stop boundary against the source files. | rg, source reads, bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff --strict. |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 parent and child fixture (specs/sk-doc/060-create-goal-mode/spec.md:145) | Internal | Pending | The incoming authoring contract is not established until the predecessor's handoff passes. |
| Goal budget manifest (.skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-28) | Internal | Available in this checkout | Without a readable budget, packet_budget can be unknown (.skilled/hooks/goal/lib/goal-slice.cjs:277-285,384-387). |
| Shared packet CLI (.skilled/hooks/goal/bin/goal.cjs:203-216) | Internal | Available in this checkout | Without the packet action, the required durable count and slice outputs cannot be observed. |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Stop if the fixture can meet budget only by dropping a criterion, if the handoff would need a bind/set action, or if the reference would contradict parent decisions D3-D4 (specs/sk-doc/060-create-goal-mode/goal.md:51-54).
- **Procedure**: Remove the temporary fixture. Revert only the new reference file to its prior absence. Record any irreconcilable contract gap for a system-spec-kit amendment under D4. Do not change the template or runtime state in this phase (specs/sk-doc/060-create-goal-mode/spec.md:94-99, specs/sk-doc/060-create-goal-mode/goal.md:52-54).

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 004 handoff → reference authoring → temporary fixture measurement → strict phase validation.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 004 handoff | Reference, fixture |
| Reference | Setup | Fixture |
| Fixture | Reference | Verification |
| Verification | Fixture | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Not estimated |
| Core Implementation | Low | Not estimated |
| Verification | Low | Not estimated |
| **Total** | | **Not estimated** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No deployment or runtime-state mutation is part of the plan (specs/sk-doc/060-create-goal-mode/spec.md:94-99, specs/sk-doc/060-create-goal-mode/goal.md:51-54).
- [ ] The fixture location is recorded and its cleanup is part of verification.
- [ ] Only the new reference is a retained implementation artifact (specs/sk-doc/060-create-goal-mode/spec.md:86,89,104).

### Rollback Procedure
1. Stop on any fixture result that requires dropping a criterion.
2. Remove the temporary fixture directory.
3. Revert the new reference if it cannot honor the frozen parent scope.
4. Report a system-spec-kit gap through D4 if the current contract cannot be met (specs/sk-doc/060-create-goal-mode/goal.md:52-54).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove the temporary goal.md fixture and the new reference file. No runtime goal state is part of this plan (specs/sk-doc/060-create-goal-mode/spec.md:94-99, specs/sk-doc/060-create-goal-mode/goal.md:51-54).

<!-- /ANCHOR:enhanced-rollback -->

---
