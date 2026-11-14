---
title: "Implementation Plan: Phase 1: parent-purpose-scaffold"
description: "Turn the phase-parent Problem Statement and Purpose hints into value tokens, stamp the template v2.3 so the token gate reads them, delete the dead generic-text lines in create.sh and pin the result with the snapshot and one test assertion."
trigger_phrases:
  - "parent purpose scaffold plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: parent-purpose-scaffold

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`create.sh`), Markdown template, JSON manifest, TypeScript test |
| **Framework** | system-spec-kit scaffold and validator |
| **Storage** | None |
| **Testing** | vitest 4, run from `.skilled/skills/system-spec-kit` with `vitest.config.ts` |

### Overview
Two hints in the phase-parent template become `[YOUR_VALUE_HERE: ...]` tokens, and the template stamp moves from `v2.2` to `v2.3` so the validator's token gate reads them as a Draft warning instead of an error. Four dead lines in `create.sh` that define and substitute generic parent text go away. The golden snapshot follows the template, and one assertion proves a new parent reaches its author with the Purpose still open.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The baseline vitest command in section 5 prints `Test Files  4 passed (4)` and `Tests  99 passed (99)`
- [ ] `rg -c 'Keep parent documentation lean|_phase_parent_purpose|_phase_parent_problem' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` prints 4
- [ ] `sed -n '28p;66p;69p' .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl` prints the stamp and the two hints quoted in section 4

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The after-change vitest command in section 5 prints `Test Files  4 passed (4)` and `Tests  99 passed (99)`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Template token gate. No new component.

### Key Components
- **`phase-parent.spec.md.tmpl`**: the parent's source text. Its stamp decides which placeholder verdict the validator gives. `carriesTokenGateStamp` in `runtime/lib/validation/orchestrator.ts:762-771` returns true at `v2.3` or later, and `validatePlaceholders` (`orchestrator.ts:833-900`) then warns on a token in a Draft packet and errors at any other status.
- **`create.sh` phase branch**: renders the template through `inline-gate-renderer.sh` and substitutes values line by line (`create.sh:1866-1928`). It never touches the two new tokens once lines 1902-1903 are gone.

### Data Flow
`create.sh --phase` renders the template, copies the two tokens into the new parent's `spec.md` unchanged and stamps it `v2.3`. `validate.sh --strict` reads that stamp, finds the two tokens and reports `PLACEHOLDER_FILLED` as a warning until the author fills them or changes the status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup runs the baseline tests and confirms the current text in all five files. Implementation applies the eight steps below, one change per step. Verification reruns the tests and the sandbox scaffold from `spec.md` Measured Behavior. `tasks.md` holds the ordered tasks.

Every path below is relative to the worktree root. Each edit is a literal search and replace. The search text appears exactly once in its file. Copy both blocks character for character, em dashes included where the current text has them.

### Step 1: template stamp
File: `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl` (line 28)

Current:
```text
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
```
Replacement:
```text
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->
```

### Step 2: template Problem Statement hint
File: `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl` (line 66)

Current:
```text
[One-paragraph problem statement — what needs solving and why]
```
Replacement:
```text
[YOUR_VALUE_HERE: what breaks today and for whom, in one paragraph]
```

### Step 3: template Purpose hint
File: `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl` (line 69)

Current:
```text
[One-paragraph purpose — what this phased decomposition achieves]
```
Replacement:
```text
[YOUR_VALUE_HERE: one sentence on the outcome every child phase serves]
```

### Step 4: manifest version
File: `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` (line 10)

Current:
```text
    "phase-parent.spec.md.tmpl": "v2.2",
```
Replacement:
```text
    "phase-parent.spec.md.tmpl": "v2.3",
```

### Step 5: delete the generic text definitions
File: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` (lines 1874-1877, of which 1875-1876 go)

Current:
```text
        _today="$(date -u +"%Y-%m-%d")"
        _phase_parent_problem="This phased decomposition tracks ${FEATURE_DESCRIPTION} across independently executable child phase folders."
        _phase_parent_purpose="Keep parent documentation lean while child phases own detailed plans, tasks, verification, and continuity."
        _scope_rows="- Root purpose and child phase manifest for ${FEATURE_DESCRIPTION}"$'\n'"- Per-phase implementation details in child folders"
```
Replacement:
```text
        _today="$(date -u +"%Y-%m-%d")"
        _scope_rows="- Root purpose and child phase manifest for ${FEATURE_DESCRIPTION}"$'\n'"- Per-phase implementation details in child folders"
```

### Step 6: delete the generic text substitutions
File: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` (lines 1901-1904 before step 5, of which 1902-1903 go)

Current:
```text
                    _line="${_line//\[YOUR_VALUE_HERE: successor-packet, or \"None\"\]/None}"
                    _line="${_line//\[YOUR_VALUE_HERE: one-paragraph problem statement — what needs solving and why\]/$_phase_parent_problem}"
                    _line="${_line//\[YOUR_VALUE_HERE: one-paragraph purpose — what this phased decomposition achieves\]/$_phase_parent_purpose}"
                    if [[ "$_line" == *"[YOUR_VALUE_HERE: bullet list of what this phase decomposition covers]"* ]]; then
```
Replacement:
```text
                    _line="${_line//\[YOUR_VALUE_HERE: successor-packet, or \"None\"\]/None}"
                    if [[ "$_line" == *"[YOUR_VALUE_HERE: bullet list of what this phase decomposition covers]"* ]]; then
```

### Step 7: golden snapshot, three lines
File: `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` (lines 3235, 3273 and 3276). Apply three separate replacements. Do not run vitest with `-u`, since that would also rewrite any unrelated drift.

Current, then replacement, line 3235:
```text
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
```
```text
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->
```

Current, then replacement, line 3273:
```text
[One-paragraph problem statement — what needs solving and why]
```
```text
[YOUR_VALUE_HERE: what breaks today and for whom, in one paragraph]
```

Current, then replacement, line 3276:
```text
[One-paragraph purpose — what this phased decomposition achieves]
```
```text
[YOUR_VALUE_HERE: one sentence on the outcome every child phase serves]
```

### Step 8: test assertion
File: `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts` (end of the phase-parent test, lines 113-116)

Current:
```text
      expect(result.stdout, `${path.basename(folder)} did not report a clean gate`).toMatch(/Errors: 0/u);
      expect(result.status).toBe(0);
    }
  });
```
Replacement:
```text
      expect(result.stdout, `${path.basename(folder)} did not report a clean gate`).toMatch(/Errors: 0/u);
      expect(result.status).toBe(0);
    }

    // A generator that writes the parent's purpose for the author passes every
    // other gate, so a new parent must still hold that question open.
    const parentSpec = fs.readFileSync(path.join(parent, 'spec.md'), 'utf8');
    expect(parentSpec, 'the new phase parent does not ask for its purpose').toMatch(/^### Purpose\n\[YOUR_VALUE_HERE: /mu);
  });
```
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Baseline, run before step 1 from `.skilled/skills/system-spec-kit`:

```bash
npx vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts runtime/cli/tests/template-version-parity.vitest.ts runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts runtime/cli/tests/placeholder-token-gate.vitest.ts --config vitest.config.ts
```

Observed on 2026-11-13 during planning: `Test Files  4 passed (4)`, `Tests  99 passed (99)`, exit 0. Also observed: `bash -n create.sh` exit 0, and `rg -c` for the generic-text names in `create.sh` printed 4.

After step 8, run the same four files. The assertion lives inside `scaffold-passes-its-own-gate.vitest.ts`, so the file count stays 4 and the test count stays 99. Expect `Test Files  4 passed (4)` and `Tests  99 passed (99)`. The fifth changed file is the snapshot, which `scaffold-golden-snapshots.vitest.ts` reads. Any failed test blocks completion.

Then repeat the `spec.md` Measured Behavior run in a fresh sandbox. Expect lines 64 and 67 to hold the two tokens, and `! PLACEHOLDER_FILLED: 2 unfilled value token(s) in a Draft packet` with `Errors: 0`. Change the sandbox parent's Status cell to `In Progress` and run `validate.sh` again. Expect `x PLACEHOLDER_FILLED: 2 placeholder(s) found` and exit 2.

Planning ran that matrix on a hand-edited sandbox parent: at `v2.2` the two tokens were errors in a Draft, so every untouched parent would fail. At `v2.3` and `v2.4` they were a Draft warning with `Errors: 0`. At `v2.3` with Status `In-Progress` or `Complete` they were errors.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`bash`, `git`, `node` and the vitest already installed under `.skilled/skills/node_modules`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: an untouched new phase parent reports `Errors:` above 0, or any of the four test files fails after step 8. Revert with `git checkout -- <the five files>` before commit, or `git revert <commit>` after. No live packet changes in this phase, so nothing else needs undoing.
<!-- /ANCHOR:rollback -->

---
