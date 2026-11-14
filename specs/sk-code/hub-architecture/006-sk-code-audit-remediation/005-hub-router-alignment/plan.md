---
title: "Implementation Plan: Phase 5: hub-router-alignment"
description: "Bring the hub router's prose in line with its map and add the two missing surfaces to its tables. Fix what the drift guard reports and make the battery's exit status honest. Prove it with a path check and a green battery."
trigger_phrases:
  - "hub router alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: hub-router-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|---|---|
| **Language/Stack** | Markdown, JSON, Node 24 CommonJS, TypeScript headers, bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The setup battery and the drift guards |

### Overview
Bring the hub router's prose in line with its map and add the two missing surfaces to its tables. Fix what the drift guard reports and make the battery's exit status honest. Prove it with a path check and a green battery.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `spec.md` section 2 states the problem and section 3 lists the files to change
- [ ] Every requirement in `spec.md` section 4 names a command and its expected output
- [ ] The predecessor phase's handoff criteria are met, or this is phase 1

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends with `STATUS=PASS failed=0`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/005-hub-router-alignment --strict --quiet` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Prose mirrors map

### Key Components
- **`ROUTER.md` sections 2 to 5**: Prose that must name what section 8 routes
- **`sk-code-setup-check.cjs`**: Its exit status must agree with its status line

### Data Flow
Section 8 holds the map the replay tests read. Sections 2 to 5 describe the same rows for a human. The setup battery runs the guards that compare them and reports one status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `ROUTER.md` section 8 `RESOURCE_MAP` and `SHARED_CONTROL_RESOURCES` | Machine map | update | Router replay tests pass |
| `ROUTER.md` sections 2 to 5 | Human prose for the same rows | update | Path check prints `missing 0` |
| `sk-code-setup-check.cjs` callers | Read its output or exit status | update where a caller reads the exit status | `rg -n 'sk-code-setup-check' .skilled .opencode .github` |
| `verify_alignment_drift.py` rules | Decide what counts as a header or strict-mode error | unchanged | Guard output |
| Hub version carriers | Four files that must state one version | update | REQ-008 |

Required inventories:
- Same-class producers: every ledger row this phase owns is one producer, listed by id in `tasks.md`.
- Consumers of changed files: the rows above name each one and what proves it is unaffected.
- Matrix axes: the ledger verdict (`Confirmed`, `Changed`, `Refuted`, `Judgment`) is the one input axis, and each task states which verdicts it acts on.
- Algorithm invariant: N/A, this phase changes no parser, resolver or security path.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup loads the hub routing rule, records the battery baseline and lists the battery's callers. Implementation rewrites the router prose, routes the doctrine, fixes the guard errors and the exit status. Verification runs the path check, the battery and the version parity check.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | Router replay and router-sync tests | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests` |
| Integration | The whole setup battery | `sk-code-setup-check.cjs` |
| Manual | Path check on the router prose | The script in this section |

Path check for the router prose, run from the repository root:

```bash
python3 - <<'PY'
import os, re, itertools
hub = ".skilled/skills/sk-code"
text = open(hub + "/ROUTER.md").read().split("## 8. MACHINE")[0]
missing = 0
for raw in sorted(set(re.findall(r"`((?:sk-code-[a-z-]+|shared)/[^`\s*<]+)`", text))):
    parts = re.split(r"\{([^}]*)\}", raw)
    opts = [p.split(",") if i % 2 else [p] for i, p in enumerate(parts)]
    for combo in itertools.product(*opts):
        path = os.path.join(hub, "".join(combo))
        if not os.path.exists(path):
            missing += 1
            print("MISSING", path)
print("missing", missing)
PY
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Operator answers to the two open questions | Internal | Yellow | The 23 outside files and the exit status stay as they are |
| Phase 004 | Internal | Yellow | Guard inputs change under this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The battery still prints `STATUS=FAIL`, or a router replay test fails.
- **Procedure**: Revert the phase commits with `git revert <sha>` in reverse order and rerun the battery.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | The predecessor phase's handoff criteria | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing this phase and starting `006-skilled-packet-fixes` |
<!-- /ANCHOR:phase-deps -->

---

