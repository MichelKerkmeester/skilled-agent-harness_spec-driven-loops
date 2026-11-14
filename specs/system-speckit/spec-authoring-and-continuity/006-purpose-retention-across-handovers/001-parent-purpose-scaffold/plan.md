---
title: "Implementation Plan: Phase 1: parent-purpose-scaffold"
description: "Turn the phase-parent Problem Statement and Purpose hints into value tokens, stamp the template v2.3 so the token gate reads them, give the parent a recent_action default that a finished parent can keep, delete the dead generic-text lines in create.sh and pin the result with the snapshot and two test assertions."
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
Two hints in the phase-parent template become `[YOUR_VALUE_HERE: ...]` tokens, and the template stamp moves from `v2.2` to `v2.3` so the validator's token gate reads them as a Draft warning instead of an error. The template's `recent_action` default changes too, because at `v2.3` it fails every finished parent and nothing ever rewrites it. Four dead lines in `create.sh` that define and substitute generic parent text go away. The golden snapshot follows the template. One assertion proves a new parent reaches its author with the Purpose still open, and a second proves the parent default no longer reads as a scaffold placeholder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The baseline vitest command in section 5 prints `Test Files  4 passed (4)` and `Tests  99 passed (99)`
- [ ] `rg -c 'Keep parent documentation lean|_phase_parent_purpose|_phase_parent_problem' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` prints 4
- [ ] `sed -n '28p;66p;69p' .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl` prints the stamp and the two hints quoted in section 4
- [ ] `grep -c '^    recent_action: "Initialize phase-parent continuity block"$' .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` prints `:1` for each file

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
- **`check-scaffold-never-touched.sh`**: the `SCAFFOLD_NEVER_TOUCHED` rule. It is not edited. Section "Why the parent fails at Complete" says what it reads.

### Data Flow
`create.sh --phase` renders the template, copies the two tokens into the new parent's `spec.md` unchanged and stamps it `v2.3`. `validate.sh --strict` reads that stamp, finds the two tokens and reports `PLACEHOLDER_FILLED` as a warning until the author fills them or changes the status.

### Why the parent fails at Complete
Paths below start at `.skilled/skills/system-spec-kit/runtime/cli/`. The template is `phase-parent.spec.md.tmpl`, the file steps 1 to 3 edit.

- The rule passes at once unless `spec.md`'s Status classifies as complete (`rules/check-scaffold-never-touched.sh:42-56`).
- It reads `spec.md` itself only when `spec.md` carries a `v2.3` or later stamp (`rules/check-scaffold-never-touched.sh:58-62`, stamp test in `lib/status-classifier.sh:88-96`). That is why the stamp change turns it on for a new parent.
- It reads only the frontmatter (`rules/check-scaffold-never-touched.sh:81-86`) and records three kinds of marker. A `title:` holding `[template:` (line 93). A `packet_pointer:` starting with `scaffold/` (line 100). A `recent_action:` starting with `Initialize`, `Initialise` or `Initialized`, or a `next_safe_action:` starting with `Replace` (line 113).
- A new parent's `packet_pointer` is `scaffold/<folder>`. The template ships `[YOUR_VALUE_HERE: packet-id]` (`phase-parent.spec.md.tmpl:12`) and `create.sh` substitutes `scaffold/$(slugify_token ...)` (`spec/create.sh:1873` and `1899`). The `--level phase-parent` path does the same through `finalize_scaffold_templates` (`spec/create.sh:949` and `955`).
- A new parent's `recent_action` is the template's `"Initialize phase-parent continuity block"` (`phase-parent.spec.md.tmpl:15`). No `create.sh` substitution touches it. `next_safe_action` is `"Plan or resume a child phase folder"` (line 16), which the rule does not match.

What rewrites those two fields on a parent afterwards:

- A save never does. A save aimed at a phase parent writes into the leaf child (`continuity/generate-context.ts:188-191` and `800-823` at commit `8aaf39b52e`). On the parent it updates only `graph-metadata.json` (`generate-context.ts:647-653` at the same commit). A later phase of this packet, under way in this worktree during planning, adds three comment lines above line 188 and makes a save copy the parent's purpose into the leaf. Its diff to `core/workflow.ts` keeps `resolution.leafPath` as the write target, so it still writes nothing into the parent's `spec.md`.
- `repair-derived.cjs --apply` rewrites `packet_pointer` in every packet doc to the folder's real path whenever they differ (`spec/repair-derived.cjs:569-586`). An author meets it on every edited parent: filling the purpose makes the derived metadata stale, and the validator then prints the repair command. Sandbox case 3 below shows the repair turning `scaffold/001-purpose-probe` into `001-purpose-probe`.
- Nothing rewrites `recent_action`. `repair-derived.cjs` lists `SCAFFOLD_NEVER_TOUCHED` under "Not repairable here".

So only the `recent_action` default stands between a finished parent and a pass.

### Shapes compared
| Shape | Edit | Evidence | Verdict |
|-------|------|----------|---------|
| A. Change the default | One template line, `recent_action`, plus its snapshot line and one test assertion | Sandbox case 3 passes. An untouched parent marked Complete still fails `SCAFFOLD_NEVER_TOUCHED` on its `scaffold/` pointer and `PLACEHOLDER_FILLED` on its two tokens (case 1) | Chosen |
| B. Exempt a parent in the rule | Skip a phase parent's `packet_pointer` and continuity lines in `check-scaffold-never-touched.sh` with `is_phase_parent`, plus a new rule test | Also lets case 3 pass. It drops the `scaffold/` pointer marker for every parent, so an untouched parent marked Complete loses its `SCAFFOLD_NEVER_TOUCHED` failure and is caught by `PLACEHOLDER_FILLED` alone | Rejected: more code, a new test and a weaker rule for the untouched parent |

The new default is a fact that stays true for the parent's whole life, as `next_safe_action` already is: child phases hold the continuity. It does not match the rule's `Initiali[sz]ed?` pattern. It is 49 characters and one clause, so `SPECDOC_FRONTMATTER_004` does not flag it as narrative (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:833-856`). `heal-spec-docs.cjs` heals a continuity value only when it matches the same signature and a template ships it (`spec/heal-spec-docs.cjs:80-83` and `1446-1450`), so it leaves the new value alone. Standard packets are untouched: no other template carries this line, and the rule does not change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup runs the baseline tests and confirms the current text in all five files. Implementation applies the eleven steps below, one change per step. Steps 9 to 11 carry out the operator decision recorded in `spec.md` section 7 and touch no file outside the five. Verification reruns the tests and the sandbox scaffold from `spec.md` Measured Behavior. `tasks.md` holds the ordered tasks.

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

### Step 9: template recent_action default
File: `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl` (line 15). The line starts with four spaces.

Current:
```text
    recent_action: "Initialize phase-parent continuity block"
```
Replacement:
```text
    recent_action: "Phase parent created, child phases own continuity"
```

### Step 10: golden snapshot, recent_action line
File: `.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` (line 3222). The line starts with four spaces. Apply it as a fourth replacement next to step 7, and again do not run vitest with `-u`.

Current:
```text
    recent_action: "Initialize phase-parent continuity block"
```
Replacement:
```text
    recent_action: "Phase parent created, child phases own continuity"
```

### Step 11: test assertion on the parent default
File: `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts`. Apply after step 8: the current text is the line step 8 adds, so it occurs once only after step 8.

Current:
```text
    expect(parentSpec, 'the new phase parent does not ask for its purpose').toMatch(/^### Purpose\n\[YOUR_VALUE_HERE: /mu);
```
Replacement:
```text
    expect(parentSpec, 'the new phase parent does not ask for its purpose').toMatch(/^### Purpose\n\[YOUR_VALUE_HERE: /mu);
    // No save ever rewrites a phase parent's own continuity lines, so a default
    // that reads as a scaffold placeholder would fail every finished parent.
    expect(parentSpec, 'the parent default reads as a scaffold placeholder').not.toMatch(/^\s*recent_action:\s*"?Initiali[sz]ed?\s/mu);
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

After step 11, run the same four files. Both assertions live inside an existing test in `scaffold-passes-its-own-gate.vitest.ts`, so the file count stays 4 and the test count stays 99. Expect `Test Files  4 passed (4)` and `Tests  99 passed (99)`. The fifth changed file is the snapshot, which `scaffold-golden-snapshots.vitest.ts` reads. Any failed test blocks completion. No other test reads the old default: outside `specs/`, `rg -l "Initialize phase-parent continuity block"` finds only the template and the snapshot. `validation-gate-hardening.vitest.ts` and `test-validation-extended.sh` test `SCAFFOLD_NEVER_TOUCHED` with their own fixtures, and the rule does not change.

Then repeat the `spec.md` Measured Behavior run in a fresh sandbox. Expect lines 64 and 67 to hold the two tokens, and `! PLACEHOLDER_FILLED: 2 unfilled value token(s) in a Draft packet` with `Errors: 0`. Change the sandbox parent's Status cell to `In Progress` and run `validate.sh` again. Expect `x PLACEHOLDER_FILLED: 2 placeholder(s) found` and exit 2.

Planning ran that matrix on a hand-edited sandbox parent: at `v2.2` the two tokens were errors in a Draft, so every untouched parent would fail. At `v2.3` and `v2.4` they were a Draft warning with `Errors: 0`. At `v2.3` with Status `In-Progress` or `Complete` they were errors.

### Sandbox proof for steps 1 to 11
Run on 2026-11-14 in a throwaway git repository under the session scratchpad, outside the repository. Its `.skilled` entries link to this worktree, except `skills/system-spec-kit`, which is an APFS clone (`cp -cRp`) with steps 1 to 11 applied. The worktree stayed untouched. Run from the sandbox root with `K=.skilled/skills/system-spec-kit`.

```text
$ bash $K/runtime/cli/spec/create.sh --phase --phases 2 --phase-names first,second "purpose probe"; echo "create exit=$?"
create exit=0
$ sed -n 10,14p specs/001-purpose-probe/spec.md
    packet_pointer: "scaffold/001-purpose-probe"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
```

Each case starts from a fresh copy of that scaffold. Two commands change it:

```bash
# fill the purpose
perl -0pi -e 's/^\[YOUR_VALUE_HERE: what breaks today and for whom, in one paragraph\]$/A new phase parent can reach Complete with no stated purpose, and no check notices./m; s/^\[YOUR_VALUE_HERE: one sentence on the outcome every child phase serves\]$/Every child phase serves one outcome: a session that crosses a hop still knows why the work exists./m' specs/001-purpose-probe/spec.md
# set the status, here to Complete
perl -pi -e 's/^\| \*\*Status\*\* \| Draft \|/| **Status** | Complete |/' specs/001-purpose-probe/spec.md
```

Every case then runs `bash $K/runtime/cli/spec/validate.sh specs/001-purpose-probe --strict --no-recursive; echo "exit=$?"`. Cases 2 and 3 first run `node $K/runtime/cli/spec/repair-derived.cjs --folder specs/001-purpose-probe --apply`, because filling the purpose makes the derived metadata stale. That is the command the validator prints, and it printed `packet pointer -> 001-purpose-probe` and exit 0.

Case 1, untouched, Draft. Warns, passes:
```text
! PLACEHOLDER_FILLED: 2 unfilled value token(s) in a Draft packet. Fill each one before the status leaves Draft
! DESCRIPTION_SHAPE: description.json level phase disagrees with the level the packet declares (2)
Summary: Errors: 0  Warnings: 2
RESULT: PASSED
exit=0
```

Case 1, untouched, Status set to Complete. Still fails, on both rules:
```text
x PLACEHOLDER_FILLED: 2 placeholder(s) found
x GENERATED_METADATA_INTEGRITY: Generated metadata integrity found 1 violation(s) (enforced)
x GENERATED_METADATA_DRIFT: Generated metadata drift found 1 drifted field(s) (enforced)
x SCAFFOLD_NEVER_TOUCHED: Found 1 scaffold-signature marker(s) in Complete spec folder
    - spec.md:10: packet_pointer starts with "scaffold/"
Summary: Errors: 4  Warnings: 1
RESULT: FAILED
exit=2
```
After `repair-derived.cjs --apply` the same untouched Complete parent still fails: `x PLACEHOLDER_FILLED: 2 placeholder(s) found`, `Summary: Errors: 1  Warnings: 0`, `RESULT: FAILED`.

Case 2, purpose filled, Status `In Progress`, after the repair. Passes:
```text
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ SCAFFOLD_NEVER_TOUCHED: Spec status is 'In Progress', not Complete; scaffold markers are allowed
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
exit=0
```

Case 3, purpose filled, Status `Complete`, after the repair. Passes:
```text
+ PLACEHOLDER_FILLED: No unfilled template placeholders found
+ SCAFFOLD_NEVER_TOUCHED: No scaffold-signature markers found in required docs for Complete spec
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
exit=0
```

Case 3 without step 9, with only steps 1 to 6 applied (the steps that change what `create.sh` writes), fails after the same repair:
```text
x SCAFFOLD_NEVER_TOUCHED: Found 1 scaffold-signature marker(s) in Complete spec folder
    - spec.md:13: continuity still holds a scaffold placeholder:    recent_action: "Initialize phase-parent continuity block"
Summary: Errors: 1  Warnings: 0
RESULT: FAILED
```

The four test files in the same clone, steps 1 to 11 applied: `Test Files  4 passed (4)`, `Tests  99 passed (99)`, exit 0. With step 9 reverted, `scaffold-passes-its-own-gate.vitest.ts` failed with `the parent default reads as a scaffold placeholder`, so the step 11 assertion fails for the reason it exists.

The `DESCRIPTION_SHAPE` warning is not new. The same scaffold at `HEAD`, before any step, printed it as its only warning (`Summary: Errors: 0  Warnings: 1`). `spec.md` section 7 lists it as a follow-up.
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

Trigger: an untouched new phase parent reports `Errors:` above 0, a parent with a filled purpose marked Complete fails after `repair-derived.cjs --apply`, or any of the four test files fails after step 11. Revert with `git checkout -- <the five files>` before commit, or `git revert <commit>` after. No live packet changes in this phase, so nothing else needs undoing.
<!-- /ANCHOR:rollback -->

---
