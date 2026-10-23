---
title: "Implementation Plan: Phase 7: playbook-catalog-readme-alignment"
description: "Add eight manual playbook scenarios, four feature catalog entries and the doc edits that describe the placeholder gate, the section fill guidance, the example drift guard and the authoring card."
trigger_phrases:
  - "playbook catalog readme alignment plan"
  - "template authoring playbook scenarios"
  - "authoring card documentation alignment"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: playbook-catalog-readme-alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash, ripgrep, jq |
| **Framework** | system-spec-kit validator, scaffold, playbook and catalog validators |
| **Storage** | None. The phase writes documentation only |
| **Testing** | The sk-doc package validators, `validate.sh`, the spec-kit suite and eight manual scenarios |

### Overview
Phases 2 to 6 change what the templates do. This phase makes the documentation say the same thing. Three lanes write eight manual playbook scenarios, four feature catalog entries and the edits to six existing docs. The conductor then adds the playbook index rows and the catalog root entries, runs every validator and hands the scenarios to phase 8.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 2 to 6 are closed, so `check-example-drift.sh`, `check-card-sync.sh` and `references/workflows/spec-authoring-card.md` exist
- [ ] The launch preconditions in `../spec.md` section 3 are recorded as met in `../goal.md` section 4
- [ ] `tasks.md` T001 to T003 are done: provider check, worktree check, start commit and suite baseline

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED`
- [ ] The playbook validator prints `violations=0` and the catalog validator prints `PASS`
- [ ] `git status --porcelain` lists nothing outside the file table in `spec.md` section 3 and this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three parallel documentation lanes over disjoint files, then a conductor-owned index pass and a gate run. No logic file changes.

### Target inventory

Facts read from the tree while this plan was written.

| Target | Current state | What this phase does |
|--------|---------------|----------------------|
| `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md` | 344 lines, 102 scenario files in 10 category folders, Section 7 is the index | Add a `template-authoring/` category and eight rows in Section 7.9 |
| `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` | 984 lines, 11 numbered sections | Add four H3 entries under Section 2 |
| `.skilled/skills/system-spec-kit/README.md` | 696 lines, validation and script tables still say `PLACEHOLDER` | Align five places with the token rule, the card and the two guards |
| `.skilled/skills/system-spec-kit/templates/README.md` | 226 lines, Section 1 and Section 8 do not mention tokens or guards | Add the token and fill facts and the three literal checks |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Rule summary row and Section 4 severity still say ERROR for every doc | Qualify both for the v2.3 Draft warning |
| `.skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md` | Rule table and pattern list say ERROR only | Qualify both for the v2.3 Draft warning |
| `.skilled/skills/system-spec-kit/references/templates/template-style-guide.md` | Placeholder table has no version rule, Section 8 lists one ERROR row | Add the v2.3 token rule and split the validation row |
| `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md` | Related Resources names the long guide only | Name the card first, then the guide |
| `.skilled/skills/system-spec-kit/references/templates/template-guide.md` | Phase 3 replaces five `PLACEHOLDER` lines and adds the token rule | Verify only. This phase does not edit it |

### 3.1 Playbook scenario catalogue

Eight scenarios, IDs 476 to 483, in the new category `template-authoring/`.

| ID | File | What it proves | Catalog entry |
|----|------|----------------|---------------|
| 476 | `placeholder-token-warning-while-draft.md` | A v2.3 Draft packet warns and still passes strict | `versioned-placeholder-gate.md` |
| 477 | `placeholder-token-error-after-draft.md` | The same packet fails once its status leaves Draft | `versioned-placeholder-gate.md` |
| 478 | `placeholder-gate-legacy-stamp-unchanged.md` | A v2.2 packet keeps the old error at any status | `versioned-placeholder-gate.md` |
| 479 | `example-drift-guard-catches-leak.md` | The drift guard fails a leaked description and passes a clean tree | `example-drift-guard.md` |
| 480 | `golden-render-all-levels.md` | Every level renders to the stored snapshots and the anchor counts hold | `template-section-fill-guidance.md` |
| 481 | `authoring-card-router-intents.md` | The four authoring intents load the card and not the guide | `spec-authoring-card.md` |
| 482 | `authoring-card-sync-guard.md` | The sync guard passes the tree and fails a copy without the card | `spec-authoring-card.md` |
| 483 | `level-1-packet-authored-from-card.md` | A DeepSeek worker writes a Level 1 packet from the card alone | `spec-authoring-card.md` |

### 3.2 Scenario 476 full text

Copy the block into `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-warning-while-draft.md`, without the outer four-backtick fence.

````markdown
---
title: "476 -- Placeholder token warning while Draft"
description: "This scenario validates that a v2.3 scaffold keeps an unfilled value token as a warning and still passes strict validation while its status is Draft."
version: 1.0.0.0
id: template-authoring-placeholder-token-warning-while-draft
---

# 476 -- Placeholder token warning while Draft

## 1. OVERVIEW

This scenario validates the Draft half of the versioned placeholder gate. A packet scaffolded from a v2.3 template carries `[YOUR_VALUE_HERE: ...]` tokens and a Status row that reads Draft. The gate must report an unfilled token as a warning and must not fail the strict run, because a planning commit is expected to hold tokens.

### Why This Matters

A gate that fails a fresh scaffold blocks every new packet before its first word is written. A gate that passes a finished packet lets a weak model ship a document that still says `[YOUR_VALUE_HERE: feature name]`. This scenario proves the first half. Draft warns and passes.

---

## 2. SCENARIO CONTRACT

Operators scaffold a Level 2 packet, read the gate entry from a strict JSON run, and confirm the warning.

- Objective: Prove that a v2.3 Level 2 scaffold with its Status row at Draft reports `PLACEHOLDER_FILLED` as `warning`, and that the strict run still reports `passed: true`.
- Playbook ID: 476.
- Real user request: `Scaffold a Level 2 packet, leave the value tokens unfilled, and tell me whether strict validation still passes while the packet is a Draft.`
- Prompt: `Scaffold a Level 2 packet, leave the value tokens unfilled, and tell me whether strict validation still passes while the packet is a Draft.`
- Preconditions: A checkout with Node, bash and jq on PATH, and a built `.skilled/skills/system-spec-kit` so `validate.sh` runs. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, confirm the v2.3 stamp and the Draft status, run strict validation with JSON output, then read the `PLACEHOLDER_FILLED` entry and the `passed` field.
- Expected signals: The scaffold prints the packet path. The stamp line ends with `v2.3 -->`. The status line reads Draft. The gate entry prints `warning`. The `passed` field prints `true`.
- Desired user-visible outcome: The operator sees a clean strict pass and one warning that names the unfilled tokens, with the packet left ready to fill.
- Pass/fail: PASS if the gate entry is `warning` and `passed` is `true`. FAIL if the entry is `error` or `pass`, or if `passed` is `false`.

---

## 3. TEST EXECUTION

### Prompt

```
Scaffold a Level 2 packet, leave the value tokens unfilled, and tell me whether strict validation still passes while the packet is a Draft.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Scaffold a Level 2 packet and confirm its stamp and status.

```bash
OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-gate-draft --short-name gate-draft --number 1 "Placeholder gate draft" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-gate-draft/001-gate-draft
test -f "$P/spec.md" && echo "packet=$P"
grep -m1 'SPECKIT_TEMPLATE_SOURCE' "$P/spec.md"
grep -m1 '| \*\*Status\*\* |' "$P/spec.md"
```

2. Run strict validation with JSON output and read the gate entry.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict --json > "$OUT/gate.json" 2>&1
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .status' "$OUT/gate.json"
jq -r '.passed' "$OUT/gate.json"
```

3. Remove the throwaway track.

```bash
rm -rf specs/zz-pb-gate-draft
test ! -d specs/zz-pb-gate-draft && echo "cleanup=ok"
```

### Expected

Step 1 prints `packet=specs/zz-pb-gate-draft/001-gate-draft`, then a stamp line that ends with `v2.3 -->`, then a Status row that reads Draft. Step 2 prints `warning`, then `true`. Step 3 prints `cleanup=ok`.

### Evidence

- The packet path, the stamp line and the status line from step 1.
- The `warning` line and the `true` line from step 2, and the `$OUT/gate.json` file.
- The `cleanup=ok` line from step 3.

### Pass / Fail

- **Pass**: The gate entry is `warning`, `passed` is `true`, and the track is gone at the end.
- **Fail**: The gate entry is `error` or `pass`, `passed` is `false`, or the track remains.

### Failure Triage

A `pass` entry means the scaffold held no token, so read the stamp line. A stamp below v2.3 means phase 3 is not closed, so stop and report it. An `error` entry at Draft means the gate is not installed, so run the phase 3 test file before this scenario. A `false` `passed` value means another rule failed, so read the other error entries in `$OUT/gate.json` before judging the gate.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [versioned-placeholder-gate.md](../../feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md)
- Implementation: [validate.sh](../../runtime/cli/spec/validate.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict --json

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 476
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/placeholder-token-warning-while-draft.md`
````

### 3.3 Scenario 477 full text

Copy the block into `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-error-after-draft.md`, without the outer four-backtick fence.

````markdown
---
title: "477 -- Placeholder token error after Draft"
description: "This scenario validates that the same v2.3 packet fails strict validation once its status leaves Draft with a value token still unfilled."
version: 1.0.0.0
id: template-authoring-placeholder-token-error-after-draft
---

# 477 -- Placeholder token error after Draft

## 1. OVERVIEW

This scenario validates the other half of the versioned placeholder gate. A packet that carries a value token must fail once its status leaves Draft. The scenario scaffolds a Level 2 packet, keeps its tokens, changes the Status row to Complete, and reads the gate entry.

### Why This Matters

The Draft warning exists so planning commits can land. It must not survive into a finished packet. This scenario proves the status word is the switch, so a weak model cannot leave a token in place and still claim completion.

---

## 2. SCENARIO CONTRACT

Operators scaffold a packet, set its status to Complete, and confirm that the gate now fails.

- Objective: Prove that a v2.3 packet with an unfilled value token reports `PLACEHOLDER_FILLED` as `error` and `passed: false` once its Status row reads Complete.
- Playbook ID: 477.
- Real user request: `Mark this scaffold Complete and tell me whether strict validation now fails on the value tokens I left behind.`
- Prompt: `Mark this scaffold Complete and tell me whether strict validation now fails on the value tokens I left behind.`
- Preconditions: A checkout with Node, bash, perl and jq on PATH, and a built `.skilled/skills/system-spec-kit` so `validate.sh` runs. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, change the Status row from Draft to Complete, run strict validation with JSON output, then read the gate entry and the `passed` field.
- Expected signals: The status line reads Complete. The gate entry prints `error`. The `passed` field prints `false`.
- Desired user-visible outcome: The operator sees the gate refuse a finished packet that still holds a token, with the token lines named in the details.
- Pass/fail: PASS if the gate entry is `error` and `passed` is `false`. FAIL if the entry is `warning` or `pass`, or if `passed` is `true`.

---

## 3. TEST EXECUTION

### Prompt

```
Mark this scaffold Complete and tell me whether strict validation now fails on the value tokens I left behind.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Scaffold a Level 2 packet.

```bash
OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-gate-complete --short-name gate-complete --number 1 "Placeholder gate complete" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-gate-complete/001-gate-complete
test -f "$P/spec.md" && echo "packet=$P"
```

2. Change the Status row from Draft to Complete and confirm it.

```bash
perl -pi -e 's/\| \*\*Status\*\* \| Draft \|/| **Status** | Complete |/' "$P/spec.md"
grep -m1 '| \*\*Status\*\* |' "$P/spec.md"
```

3. Run strict validation with JSON output and read the gate entry.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict --json > "$OUT/gate.json" 2>&1
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .status' "$OUT/gate.json"
jq -r '.passed' "$OUT/gate.json"
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .details[]' "$OUT/gate.json" | head -3
```

4. Remove the throwaway track.

```bash
rm -rf specs/zz-pb-gate-complete
test ! -d specs/zz-pb-gate-complete && echo "cleanup=ok"
```

### Expected

Step 1 prints `packet=specs/zz-pb-gate-complete/001-gate-complete`. Step 2 prints a Status row that reads Complete. Step 3 prints `error`, then `false`, then at least one detail line that names a document and a line number. Step 4 prints `cleanup=ok`.

### Evidence

- The packet path from step 1.
- The Complete status line from step 2.
- The `error` line, the `false` line and the first three detail lines from step 3.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: The gate entry is `error`, `passed` is `false`, and at least one detail line names a token.
- **Fail**: The gate entry is `warning` or `pass`, `passed` is `true`, or no detail line names a token.

### Failure Triage

A `warning` entry means the status edit did not land, so check step 2. A `pass` entry means the scaffold held no token, so read the stamp line and confirm phase 3 is closed. A `true` `passed` value means the gate did not run, so read `$OUT/gate.json` for the `PLACEHOLDER_FILLED` entry itself.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [versioned-placeholder-gate.md](../../feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md)
- Implementation: [validate.sh](../../runtime/cli/spec/validate.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict --json

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 477
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/placeholder-token-error-after-draft.md`
````

### 3.4 Scenario 478 full text

Copy the block into `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-gate-legacy-stamp-unchanged.md`, without the outer four-backtick fence.

````markdown
---
title: "478 -- Placeholder gate unchanged for a v2.2 doc"
description: "This scenario validates that a packet stamped v2.2 keeps the placeholder error it always had, even while its status is Draft."
version: 1.0.0.0
id: template-authoring-placeholder-gate-legacy-stamp-unchanged
---

# 478 -- Placeholder gate unchanged for a v2.2 doc

## 1. OVERVIEW

This scenario validates the compatibility half of the versioned placeholder gate. A packet with a v2.2 stamp, or with no stamp, must keep the old verdict. The scenario scaffolds a Level 2 packet, rewrites its stamp to v2.2, leaves its status at Draft and keeps its tokens. The gate must report an error.

### Why This Matters

External packets are written under the old contract. A new gate that changed their verdict would break `/doctor:update` for every repository that already holds a packet. This scenario proves the stamp is the switch, and that an unstamped or older packet is never treated as Draft.

---

## 2. SCENARIO CONTRACT

Operators rewrite the stamp on a scaffold, keep the Draft status, and confirm that the gate still fails.

- Objective: Prove that a Draft packet stamped v2.2 reports `PLACEHOLDER_FILLED` as `error` and `passed: false`, with no Draft warning.
- Playbook ID: 478.
- Real user request: `This packet uses the older template stamp. Confirm that the placeholder rule still gives it the same error it always had.`
- Prompt: `This packet uses the older template stamp. Confirm that the placeholder rule still gives it the same error it always had.`
- Preconditions: A checkout with Node, bash, perl and jq on PATH, and a built `.skilled/skills/system-spec-kit` so `validate.sh` runs. The scenario needs no network.
- Expected execution process: Scaffold one Level 2 packet, rewrite every v2.3 stamp to v2.2, confirm the Draft status and the stamp, run strict validation with JSON output, then read the gate entry.
- Expected signals: Each document stamp ends with `v2.2 -->`. The status line reads Draft. The gate entry prints `error`. The `passed` field prints `false`.
- Desired user-visible outcome: The operator sees the older packet keep its error, so no existing repository changes verdict.
- Pass/fail: PASS if the gate entry is `error` and `passed` is `false`. FAIL if the entry is `warning`, or if `passed` is `true`.

---

## 3. TEST EXECUTION

### Prompt

```
This packet uses the older template stamp. Confirm that the placeholder rule still gives it the same error it always had.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Scaffold a Level 2 packet.

```bash
OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-pb-gate-legacy --short-name gate-legacy --number 1 "Placeholder gate legacy" > "$OUT/create.txt" 2>&1
P=specs/zz-pb-gate-legacy/001-gate-legacy
test -f "$P/spec.md" && echo "packet=$P"
```

2. Rewrite the stamp in every packet document and confirm the stamp and the status.

```bash
for f in spec plan tasks acceptance-criteria; do
  perl -pi -e 's/\| v2\.3 -->/| v2.2 -->/g' "$P/$f.md"
  printf '%s ' "$f"
  grep -c 'v2\.2 -->' "$P/$f.md"
done
grep -m1 '| \*\*Status\*\* |' "$P/spec.md"
```

3. Run strict validation with JSON output and read the gate entry.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict --json > "$OUT/gate.json" 2>&1
jq -r '.entries[] | select(.rule == "PLACEHOLDER_FILLED") | .status' "$OUT/gate.json"
jq -r '.passed' "$OUT/gate.json"
```

4. Remove the throwaway track.

```bash
rm -rf specs/zz-pb-gate-legacy
test ! -d specs/zz-pb-gate-legacy && echo "cleanup=ok"
```

### Expected

Step 1 prints `packet=specs/zz-pb-gate-legacy/001-gate-legacy`. Step 2 prints four lines, each a document name followed by `1`, then a Status row that reads Draft. Step 3 prints `error`, then `false`. Step 4 prints `cleanup=ok`.

### Evidence

- The packet path from step 1.
- The four stamp counts and the Draft status line from step 2.
- The `error` line and the `false` line from step 3, and the `$OUT/gate.json` file.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: Every document reports one v2.2 stamp, the status stays Draft, the gate entry is `error`, and `passed` is `false`.
- **Fail**: A document keeps a v2.3 stamp, the gate entry is `warning`, or `passed` is `true`.

### Failure Triage

A stamp count of `0` means the rewrite did not match, so read the stamp line and confirm the template version. A `warning` entry means the stamp gate still saw v2.3 somewhere, so check all four documents before judging the rule. A different rule failure is separate from this scenario, so read the other error entries.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [versioned-placeholder-gate.md](../../feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md)
- Implementation: [validate.sh](../../runtime/cli/spec/validate.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict --json

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 478
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/placeholder-gate-legacy-stamp-unchanged.md`
````

### 3.5 Scenario 479 full text

Copy the block into `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md`, without the outer four-backtick fence.

````markdown
---
title: "479 -- Example drift guard catches a leaked description"
description: "This scenario validates that the example drift guard passes a clean tree and fails a copy whose description holds a leaked comment tail."
version: 1.0.0.0
id: template-authoring-example-drift-guard-catches-leak
---

# 479 -- Example drift guard catches a leaked description

## 1. OVERVIEW

This scenario validates the read-only example drift guard. The guard compares every hand-written example with its template and checks the description line. The scenario runs the guard on the clean tree, injects a leaked comment tail into one copy of an example, and runs the guard on that copy.

### Why This Matters

A weak model copies an example. A description that keeps the end of an HTML comment teaches the model to write a broken frontmatter line. The guard turns that defect into a failed command instead of a copy that spreads.

---

## 2. SCENARIO CONTRACT

Operators run the guard twice, once on the clean tree and once on a copy with one injected leak.

- Objective: Prove that the guard prints `EXAMPLE_DRIFT_OK` and exits 0 on the clean tree, and prints a description failure and exits 1 on the copy.
- Playbook ID: 479.
- Real user request: `Check every template example for drift, then prove the guard notices a description that leaked the end of an HTML comment.`
- Prompt: `Check every template example for drift, then prove the guard notices a description that leaked the end of an HTML comment.`
- Preconditions: A checkout with Node, bash and perl on PATH, and phase 4 closed so `runtime/cli/spec/check-example-drift.sh` exists. The scenario needs no network.
- Expected execution process: Run the guard on the tree, copy one example into a scratch folder, inject a leaked comment tail into its description, run the guard on the scratch folder, then remove the scratch folder.
- Expected signals: The clean run prints `EXAMPLE_DRIFT_OK` and exits 0. The broken run prints one line with `description holds an HTML comment tail` and exits 1. The broken run does not print `EXAMPLE_DRIFT_OK`.
- Desired user-visible outcome: The operator sees the guard accept the tree and reject the injected defect.
- Pass/fail: PASS if the clean run exits 0 with `EXAMPLE_DRIFT_OK` and the broken run exits 1 with the description failure. FAIL if either run returns the other verdict.

---

## 3. TEST EXECUTION

### Prompt

```
Check every template example for drift, then prove the guard notices a description that leaked the end of an HTML comment.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Run the guard on the clean tree.

```bash
OUT="$(mktemp -d)"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh > "$OUT/clean.txt" 2>&1
echo "clean_exit=$?"
tail -1 "$OUT/clean.txt"
```

2. Copy one example into a scratch folder and inject a leaked comment tail.

```bash
T="$OUT/examples"
mkdir -p "$T/level-2"
cp .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md "$T/level-2/"
perl -0pi -e 's/^(description: ")([^"]*)(")$/$1$2 leaked -->$3/m' "$T/level-2/acceptance-criteria.md"
grep -m1 '^description:' "$T/level-2/acceptance-criteria.md"
```

3. Run the guard on the scratch copy.

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh "$T" > "$OUT/broken.txt" 2>&1
echo "broken_exit=$?"
grep -c 'description holds an HTML comment tail' "$OUT/broken.txt"
grep -c 'EXAMPLE_DRIFT_OK' "$OUT/broken.txt"
```

4. Remove the scratch folder.

```bash
rm -rf "$OUT"
test ! -d "$OUT" && echo "cleanup=ok"
```

### Expected

Step 1 prints `clean_exit=0`, then `EXAMPLE_DRIFT_OK`. Step 2 prints a description line that ends with `leaked -->"`. Step 3 prints `broken_exit=1`, then `1`, then `0`. Step 4 prints `cleanup=ok`.

### Evidence

- The exit code and the last line from step 1.
- The injected description line from step 2.
- The exit code, the failure count and the `EXAMPLE_DRIFT_OK` count from step 3.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: The clean run exits 0 with `EXAMPLE_DRIFT_OK`, and the broken run exits 1 with exactly one description failure and no `EXAMPLE_DRIFT_OK`.
- **Fail**: The clean run fails, the broken run passes, or the failure count is not 1.

### Failure Triage

A clean failure means the tree already holds drift, so read `$OUT/clean.txt` and fix that before this scenario. A broken run that passes means the injection did not match, so read the description line from step 2. A count of 0 for the failure line means the guard changed its message, so read `$OUT/broken.txt` and report the new wording.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [example-drift-guard.md](../../feature-catalog/tooling-and-scripts/example-drift-guard.md)
- Implementation: [check-example-drift.sh](../../runtime/cli/spec/check-example-drift.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 479
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/example-drift-guard-catches-leak.md`
````

### 3.6 Scenario 480 full text

Copy the block into `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md`, without the outer four-backtick fence.

````markdown
---
title: "480 -- Golden render of every level"
description: "This scenario validates that every level renders to the stored golden snapshots and that each document keeps its frozen anchor count."
version: 1.0.0.0
id: template-authoring-golden-render-all-levels
---

# 480 -- Golden render of every level

## 1. OVERVIEW

This scenario validates the two template guards phase 4 adds. The golden test renders every level and compares the result with a stored snapshot. The fill guidance test renders every level and document and checks the anchor count and the one fill line per section. The scenario runs both and reads their test counts.

### Why This Matters

A fill instruction sits inside a template that a renderer prunes. A change that reads well in the source can alter the rendered shape, move an anchor or drop a section. The stored snapshots catch the shape change, and the anchor counts catch the structural change.

---

## 2. SCENARIO CONTRACT

Operators run both template guards and read the pass counts.

- Objective: Prove that the golden render prints `12 passed` and the fill guidance test prints `16 passed` without a snapshot update.
- Playbook ID: 480.
- Real user request: `Render every level and confirm the stored snapshots still match and every document still holds its anchors.`
- Prompt: `Render every level and confirm the stored snapshots still match and every document still holds its anchors.`
- Preconditions: A checkout with Node and the installed `node_modules` under `.skilled/skills/system-spec-kit`, and phase 4 closed so both test files exist. The scenario needs no network.
- Expected execution process: Run the golden test without a snapshot update, then run the fill guidance test, then read the `Tests` line from each run.
- Expected signals: The golden run prints `Tests  12 passed (12)`. The fill run prints `Tests  16 passed (16)`. Neither run prints `failed`.
- Desired user-visible outcome: The operator sees both guards green on the unchanged tree.
- Pass/fail: PASS if both runs print their expected pass count and neither prints a failure. FAIL if a run fails or updates a snapshot.

---

## 3. TEST EXECUTION

### Prompt

```
Render every level and confirm the stored snapshots still match and every document still holds its anchors.
```

### Commands

Run the commands from the checkout root in one shell session. The `cd` runs in a subshell so the checkout root stays current.

1. Run the golden render test without a snapshot update.

```bash
OUT="$(mktemp -d)"
( cd .skilled/skills/system-spec-kit && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts ) > "$OUT/golden.txt" 2>&1
echo "golden_exit=$?"
grep -E '^ *Tests +12 passed' "$OUT/golden.txt"
grep -c 'failed' "$OUT/golden.txt"
```

2. Run the fill guidance test.

```bash
( cd .skilled/skills/system-spec-kit && ./node_modules/.bin/vitest run runtime/cli/tests/template-fill-guidance.vitest.ts --config vitest.config.ts ) > "$OUT/fill.txt" 2>&1
echo "fill_exit=$?"
grep -E '^ *Tests +16 passed' "$OUT/fill.txt"
grep -c 'failed' "$OUT/fill.txt"
```

3. Remove the scratch folder.

```bash
rm -rf "$OUT"
test ! -d "$OUT" && echo "cleanup=ok"
```

### Expected

Step 1 prints `golden_exit=0`, then the `Tests  12 passed (12)` line, then `0`. Step 2 prints `fill_exit=0`, then the `Tests  16 passed (16)` line, then `0`. Step 3 prints `cleanup=ok`.

### Evidence

- The exit code, the `Tests` line and the `failed` count from step 1.
- The exit code, the `Tests` line and the `failed` count from step 2.
- The `cleanup=ok` line from step 3.

### Pass / Fail

- **Pass**: Both runs exit 0, the golden run prints `12 passed`, the fill run prints `16 passed`, and neither output holds the word `failed`.
- **Fail**: A run exits non-zero, a pass count differs, or a failure line appears.

### Failure Triage

A snapshot mismatch means a template change altered the render, so read the diff in `$OUT/golden.txt` and fix the template rather than updating the snapshot. A fill failure names the section that lacks one fill line, so read `$OUT/fill.txt`. A missing test file means phase 4 is not closed, so stop and report it.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [template-section-fill-guidance.md](../../feature-catalog/tooling-and-scripts/template-section-fill-guidance.md)
- Implementation: [scaffold-golden-snapshots.vitest.ts](../../runtime/cli/tests/scaffold-golden-snapshots.vitest.ts)

Provenance: manual only - cd .skilled/skills/system-spec-kit && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 480
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/golden-render-all-levels.md`
````

### 3.7 Scenario 481 full text

Copy the block into `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-router-intents.md`, without the outer four-backtick fence.

````markdown
---
title: "481 -- Authoring card loaded by four intents"
description: "This scenario validates that the PLAN, IMPLEMENT, INTAKE and TEMPLATE_AUTHORING intents load the authoring card and leave the long guide on demand."
version: 1.0.0.0
id: template-authoring-authoring-card-router-intents
---

# 481 -- Authoring card loaded by four intents

## 1. OVERVIEW

This scenario validates the router change phase 5 makes. The `RESOURCE_MAP` in `SKILL.md` sends four authoring intents to a short card. The long template guide stays reachable from `ON_DEMAND` only. The scenario counts the card and guide lines inside the four intent blocks and inside the on demand list.

### Why This Matters

A weak model follows the first document it is given. If an authoring intent still loads the 1,200 line guide, the model spends its context on the long path and never sees the card. The counts prove the router points at the short path and keeps the long one for a deliberate lookup.

---

## 2. SCENARIO CONTRACT

Operators count the card and guide lines in the router and read three numbers.

- Objective: Prove that the four authoring intent blocks name the card four times and the guide zero times, and that the on demand list names the guide once.
- Playbook ID: 481.
- Real user request: `Show me which authoring document each writing intent loads, and confirm the long guide is only an on-demand lookup now.`
- Prompt: `Show me which authoring document each writing intent loads, and confirm the long guide is only an on-demand lookup now.`
- Preconditions: A checkout with `awk` on PATH and phase 5 closed so `SKILL.md` and the card exist. The scenario needs no network.
- Expected execution process: Run one `awk` count over the four intent blocks for the card, one for the guide, and one over the on demand list for the guide.
- Expected signals: The card count prints `4`. The intent guide count prints `0`. The on demand guide count prints `1`.
- Desired user-visible outcome: The operator sees the four intents load the card and the guide held for an on demand read.
- Pass/fail: PASS if the three counts are `4`, `0` and `1` in that order. FAIL if any count differs.

---

## 3. TEST EXECUTION

### Prompt

```
Show me which authoring document each writing intent loads, and confirm the long guide is only an on-demand lookup now.
```

### Commands

Run the commands from the checkout root in one shell session.

1. Count the card lines in the four authoring intent blocks.

```bash
S=.skilled/skills/system-spec-kit
awk '/^    "(PLAN|IMPLEMENT|INTAKE|TEMPLATE_AUTHORING)": \[$/ {inside=1} inside && /spec-authoring-card\.md/ {n++} inside && /^    \],$/ {inside=0} END {print n+0}' "$S/SKILL.md"
```

2. Count the guide lines in the same four blocks.

```bash
awk '/^    "(PLAN|IMPLEMENT|INTAKE|TEMPLATE_AUTHORING)": \[$/ {inside=1} inside && /template-guide\.md/ {n++} inside && /^    \],$/ {inside=0} END {print n+0}' "$S/SKILL.md"
```

3. Count the guide lines in the on demand list.

```bash
awk '/"ON_DEMAND": \[/ {od=1; next} od && /^    \],$/ {od=0} od && /template-guide\.md/ {n++} END {print n+0}' "$S/SKILL.md"
```

### Expected

Step 1 prints `4`. Step 2 prints `0`. Step 3 prints `1`.

### Evidence

- The `4` from step 1.
- The `0` from step 2.
- The `1` from step 3.
- The four intent block headers from `SKILL.md`, quoted in the report.

### Pass / Fail

- **Pass**: The three counts are `4`, `0` and `1`.
- **Fail**: Any count differs.

### Failure Triage

A `3` on step 1 means one intent block still points elsewhere, so read the four blocks and name the missing intent. A `1` on step 2 means the guide did not leave that intent, so compare the block with the card row. A `0` on step 3 means the guide became unreachable, so add it back to `ON_DEMAND` before closing phase 5.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [spec-authoring-card.md](../../feature-catalog/tooling-and-scripts/spec-authoring-card.md)
- Implementation: [SKILL.md](../../SKILL.md)

Provenance: manual only - awk over the four intent blocks in .skilled/skills/system-spec-kit/SKILL.md

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 481
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/authoring-card-router-intents.md`
````

### 3.8 Scenario 482 full text

Copy the block into `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md`, without the outer four-backtick fence.

````markdown
---
title: "482 -- Authoring card sync guard"
description: "This scenario validates that the card sync guard passes the changed tree and fails a disposable copy whose card is missing."
version: 1.0.0.0
id: template-authoring-authoring-card-sync-guard
---

# 482 -- Authoring card sync guard

## 1. OVERVIEW

This scenario validates the read-only card sync guard. The guard reads the card, the router, the leaf inventory files and the authoring checklist, and it fails on the first disagreement. The scenario runs it on the tree, copies the skill into a scratch folder, deletes the card from the copy and runs the guard again.

### Why This Matters

Four surfaces describe one authoring path. A reader who edits one surface alone sends the next reader down a path the other three do not describe. The guard turns that quiet drift into a failed command.

---

## 2. SCENARIO CONTRACT

Operators run the guard twice, once on the tree and once on a copy without the card.

- Objective: Prove that the guard prints nine `PASS` lines and `CARD SYNC OK` on the tree, and `FAIL card-exists` with `CARD SYNC FAILED` on the copy.
- Playbook ID: 482.
- Real user request: `Confirm the authoring card, the router, the leaf inventory and the checklist agree, then prove the guard notices a missing card.`
- Prompt: `Confirm the authoring card, the router, the leaf inventory and the checklist agree, then prove the guard notices a missing card.`
- Preconditions: A checkout with bash, rsync and `jq` on PATH, and phase 5 closed so `runtime/cli/spec/check-card-sync.sh` and the card exist. The scenario needs no network.
- Expected execution process: Run the guard on the tree, copy the skill without `node_modules` into a scratch folder, run the guard on the copy, delete the card from the copy, run the guard again, then remove the scratch folder.
- Expected signals: The tree run prints nine `PASS` lines, then `CARD SYNC OK`, and exits 0. The copy run prints `CARD SYNC OK` before the card is deleted. The broken run exits 1, prints one `FAIL card-exists` line, then `CARD SYNC FAILED`.
- Desired user-visible outcome: The operator sees the four surfaces agree and the guard refuse a copy that lost one of them.
- Pass/fail: PASS if the tree run prints nine `PASS` lines and `CARD SYNC OK`, and the broken run exits 1 with `FAIL card-exists` and `CARD SYNC FAILED`. FAIL if either run returns the other verdict.

---

## 3. TEST EXECUTION

### Prompt

```
Confirm the authoring card, the router, the leaf inventory and the checklist agree, then prove the guard notices a missing card.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined.

1. Run the guard on the tree and count its pass lines.

```bash
OUT="$(mktemp -d)"
S=.skilled/skills/system-spec-kit
bash "$S/runtime/cli/spec/check-card-sync.sh" > "$OUT/clean.txt" 2>&1
echo "clean_exit=$?"
grep -c '^PASS ' "$OUT/clean.txt"
tail -1 "$OUT/clean.txt"
```

2. Copy the skill into a scratch folder and run the guard on the copy.

```bash
N="$OUT/skill"
rsync -a --exclude node_modules "$S/" "$N/"
bash "$N/runtime/cli/spec/check-card-sync.sh" > "$OUT/copy.txt" 2>&1
echo "copy_exit=$?"
tail -1 "$OUT/copy.txt"
```

3. Delete the card from the copy and run the guard again.

```bash
rm "$N/references/workflows/spec-authoring-card.md"
bash "$N/runtime/cli/spec/check-card-sync.sh" > "$OUT/broken.txt" 2>&1
echo "broken_exit=$?"
grep -c '^FAIL card-exists' "$OUT/broken.txt"
tail -1 "$OUT/broken.txt"
```

4. Remove the scratch folder.

```bash
rm -rf "$OUT"
test ! -d "$OUT" && echo "cleanup=ok"
```

### Expected

Step 1 prints `clean_exit=0`, then `9`, then `CARD SYNC OK`. Step 2 prints `copy_exit=0`, then `CARD SYNC OK`. Step 3 prints `broken_exit=1`, then `1`, then `CARD SYNC FAILED`. Step 4 prints `cleanup=ok`.

### Evidence

- The exit code, the `PASS` count and the last line from step 1.
- The exit code and the last line from step 2.
- The exit code, the failure count and the last line from step 3.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: The tree run exits 0 with nine `PASS` lines and `CARD SYNC OK`, and the broken run exits 1 with one `FAIL card-exists` line and `CARD SYNC FAILED`.
- **Fail**: A pass count differs, the broken run passes, or the failure line names a different check.

### Failure Triage

A tree failure means one of the four surfaces is already out of step, so read `$OUT/clean.txt` and fix the named check before this scenario. A copy failure before the deletion means `rsync` skipped a file, so read `$OUT/copy.txt`. A broken run that passes means the card deletion did not land, so list the copy's `references/workflows/` folder.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [spec-authoring-card.md](../../feature-catalog/tooling-and-scripts/spec-authoring-card.md)
- Implementation: [check-card-sync.sh](../../runtime/cli/spec/check-card-sync.sh)

Provenance: manual only - bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 482
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/authoring-card-sync-guard.md`
````

### 3.9 Scenario 483 full text

Copy the block into `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md`, without the outer four-backtick fence.

````markdown
---
title: "483 -- Level 1 packet authored from the card"
description: "This scenario validates that a DeepSeek worker can scaffold and fill a Level 1 packet from the authoring card alone, with strict validation passing and no token left."
version: 1.0.0.0
id: template-authoring-level-1-packet-authored-from-card
---

# 483 -- Level 1 packet authored from the card

## 1. OVERVIEW

This scenario validates the card as an authoring instruction. It dispatches one DeepSeek worker with the card as its guidance and a throwaway track as its only write path. The worker scaffolds and fills a Level 1 packet. The operator then runs strict validation and counts the tokens left in the four documents.

### Why This Matters

A card that reads well but cannot drive a finished packet is a brochure. This scenario is the end to end check: one model, one card, one strict pass and zero tokens left.

---

## 2. SCENARIO CONTRACT

Operators dispatch one worker, then validate the packet it wrote.

- Objective: Prove that a DeepSeek worker writes a Level 1 packet from the card, that strict validation prints `RESULT: PASSED`, and that the four documents hold no value token or open question marker.
- Playbook ID: 483.
- Real user request: `Use the authoring card to write a complete Level 1 packet for a small feature, then prove it passes strict validation with nothing left to fill.`
- Prompt: `Use the authoring card to write a complete Level 1 packet for a small feature, then prove it passes strict validation with nothing left to fill.`
- Preconditions: A checkout with Node, bash, `rg` and `opencode2` on PATH, a provider login that lists `llmgateway/deepseek-v4.1-flash-1017`, and phase 5 closed so the card exists. The scenario needs network access and one model run.
- Expected execution process: Remove any earlier throwaway track, write the worker brief, dispatch the worker, validate the packet it wrote, count the tokens left, then remove the track.
- Expected signals: The dispatch exits 0. The packet holds `spec.md`. Strict validation prints `RESULT: PASSED`. The token count prints `0`. The track is gone at the end.
- Desired user-visible outcome: The operator sees a finished Level 1 packet that a strict run accepts, with no authoring hint left for a reader to fill.
- Pass/fail: PASS if the dispatch exits 0, strict validation prints `RESULT: PASSED`, the token count is `0` and the track is gone. FAIL if any of those checks fails.

---

## 3. TEST EXECUTION

### Prompt

```
Use the authoring card to write a complete Level 1 packet for a small feature, then prove it passes strict validation with nothing left to fill.
```

### Commands

Run the commands from the checkout root in one shell session, so the variables set in step 1 stay defined. This scenario spends one model run.

1. Clear the throwaway track and write the worker brief.

```bash
OUT="$(mktemp -d)"
rm -rf specs/zz-pb-card
cat > "$OUT/brief.txt" <<'TXT'
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are set in your environment.

Your write authority is already bound. The spec folder you create and fill is:
  specs/zz-pb-card/001-card-authoring

ROLE: You are a documentation author. You read one card and write one Level 1 packet.

ALLOWED WRITE PATHS:
  specs/zz-pb-card/ and everything under it

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset, git stash, generate-context.js, /speckit:save, and any edit outside specs/zz-pb-card/.

TASK:
1. Read .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md completely.
2. Run exactly: bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --skip-branch --level 1 --track zz-pb-card --short-name card-authoring --number 1 "Author a Level 1 packet from the card"
3. Fill spec.md, plan.md, tasks.md and implementation-summary.md for this feature: add a --quiet flag to .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh that prints only the final recommended-level line.
4. Run: bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/zz-pb-card/001-card-authoring --strict
5. Fix what it reports and run it again, at most three times in all.

RETURN exactly one line: the last RESULT line validate.sh printed.
TXT
echo "brief=$(wc -l < "$OUT/brief.txt") lines"
```

2. Dispatch one DeepSeek worker.

```bash
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode2 run --standalone \
  -m llmgateway/deepseek-v4.1-flash-1017#max --format json \
  "$(cat "$OUT/brief.txt")" </dev/null > "$OUT/run.jsonl" 2>&1
echo "dispatch_exit=$?"
```

3. Validate the packet and count the tokens left.

```bash
P=specs/zz-pb-card/001-card-authoring
test -f "$P/spec.md" && echo "packet=$P"
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$P" --strict > "$OUT/val.txt" 2>&1
echo "val_exit=$?"
grep 'RESULT:' "$OUT/val.txt"
rg -o --no-filename 'YOUR_VALUE_HERE:|NEEDS CLARIFICATION:' "$P/spec.md" "$P/plan.md" "$P/tasks.md" "$P/implementation-summary.md" | wc -l | tr -d ' '
```

4. Remove the throwaway track.

```bash
rm -rf specs/zz-pb-card
test ! -d specs/zz-pb-card && echo "cleanup=ok"
```

### Expected

Step 1 prints a brief line count above 20. Step 2 prints `dispatch_exit=0`. Step 3 prints `packet=specs/zz-pb-card/001-card-authoring`, then `val_exit=0`, then `RESULT: PASSED`, then `0`. Step 4 prints `cleanup=ok`.

### Evidence

- The brief line count from step 1.
- The dispatch exit code from step 2 and the `$OUT/run.jsonl` transcript.
- The packet path, the validation exit code, the `RESULT` line and the token count from step 3.
- The `cleanup=ok` line from step 4.

### Pass / Fail

- **Pass**: The dispatch exits 0, the packet exists, strict validation prints `RESULT: PASSED`, the token count is `0` and the track is gone.
- **Fail**: The dispatch fails, the packet is missing, strict validation fails, the token count is above zero, or the track remains.

### Failure Triage

A missing packet means the worker did not run the scaffold command, so read `$OUT/run.jsonl` and check the provider login before retrying. A failed strict run means the packet is incomplete, so read `$OUT/val.txt` and name the rule. A token count above zero means the card did not drive a finished fill, so record the token lines in `$OUT/val.txt` before the next run. Remove `specs/zz-pb-card` before every retry.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature catalog: [spec-authoring-card.md](../../feature-catalog/tooling-and-scripts/spec-authoring-card.md)
- Implementation: [spec-authoring-card.md](../../references/workflows/spec-authoring-card.md)

Provenance: manual only - opencode2 run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max

---

## 5. SOURCE METADATA

- Group: Template Authoring
- Playbook ID: 483
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `template-authoring/level-1-packet-authored-from-card.md`
````

### 3.10 Feature catalog entries

Four new leaves under `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/`. The root entry and the leaf must agree on the title and the description word for word.

#### 3.10.1 `versioned-placeholder-gate.md`

```markdown
---
title: "Versioned placeholder gate"
description: "Gates unfilled value tokens by the template stamp, warning while a v2.3 packet is Draft and failing it at any other status."
trigger_phrases:
  - "versioned placeholder gate"
  - "placeholder token warning"
  - "Draft placeholder rule"
  - "v2.3 template stamp"
version: 1.0.0.0
---

# Versioned placeholder gate

## 1. OVERVIEW

The versioned placeholder gate decides the severity of an unfilled authoring token from the template stamp a document carries. A document stamped v2.3 or later warns while the packet status is Draft and fails at any other status. A document with an older stamp, or with no stamp, keeps the error it always had.

The gate exists so a planning commit can land with tokens still in place, while a finished packet cannot. It also keeps every existing packet on its old verdict, because a new rule that failed them would break an external repository on update.

---

## 2. HOW IT WORKS

### Stamp Detection

The rule reads the first 70 lines of each document for a `SPECKIT_TEMPLATE_SOURCE` line. A version of v2.3 or later opens the gate. A version of v2.2 or earlier, or no line at all, leaves the document on the old rule.

### Draft Lifecycle

When the gate is open, the rule reads the first Status row of the packet's `spec.md`. The exact word Draft, ignoring case, bold marks, backticks, quotes and trailing punctuation, makes an unfilled token a warning. Every other value, and a missing Status row, makes it an error. An open question marker is an error in both cases.

A warning does not fail `--strict`. The run passes when no other rule reports an error.

### Scope

The orchestrator reads every authored document that is present. The shell mirror reads `spec.md`, `plan.md`, `tasks.md` and `decision-record.md`, and it adds `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` only when they carry the stamp. Both implementations answer with the same verdict, and one test file compares them.

### Edge Cases

A fenced code block is skipped, so a token shown in an example does not fail a document. A token inside an inline code span is skipped for the same reason. A status such as `Draft (phase 3)` is not the word Draft, so it counts as any other value.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Handler | Reads the stamp and the status and returns the rule entry |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` | Script | Shell mirror used by the isolated rule harness |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts` | Vitest | Drives both implementations across the stamp and status matrix |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-warning-while-draft.md` | Manual playbook | Scenario 476, the Draft warning |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-error-after-draft.md` | Manual playbook | Scenario 477, the error after Draft |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-gate-legacy-stamp-unchanged.md` | Manual playbook | Scenario 478, the older stamp |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/versioned-placeholder-gate.md`

Related references:
- [spec-validation-rule-engine.md](spec-validation-rule-engine.md) - the orchestrator that runs the rule
- [template-section-fill-guidance.md](template-section-fill-guidance.md) - the instruction that tells a writer what to put in a token
```

#### 3.10.2 `template-section-fill-guidance.md`

```markdown
---
title: "Template section fill guidance"
description: "Places one imperative fill instruction below every template section heading, with a good and a weak example, and holds the rendered result with a golden test."
trigger_phrases:
  - "template section fill guidance"
  - "section fill instruction"
  - "good and weak example"
  - "template fill line"
version: 1.0.0.0
---

# Template section fill guidance

## 1. OVERVIEW

Template section fill guidance is the line below each content heading in the packet templates. It tells a writer the one action the section needs, then shows a good answer and a weak answer. A token alone says what to replace. The fill line says what a finished answer looks like.

The guidance covers every content section of the four core templates and the ten addon templates. The `TEMPLATE INSTRUCTIONS` and `Author Instructions` headings hold fixed instructions and get no fill line.

---

## 2. HOW IT WORKS

### The Fill Line

Each line is one HTML comment that starts with `FILL:`. It sits directly below the section heading and stays on one physical line, so a renderer cannot break the section. The line names the action, then a good example, then a weak example where the section needs both.

The text never holds an authoring token or an open question marker. A test renders the templates and fails when a section lacks its fill line, holds two of them, or carries a token inside one.

### Render and Anchor Guards

The fill guidance test renders all 16 level and document pairs. It compares the anchor count with a frozen table and checks one fill line per section. The golden snapshot test renders every level and compares the result with a stored file, so a change that moves a heading or prunes a gated block fails before it ships.

### Example Alignment

The hand-written examples a model copies carry the same anchors as their templates. The example drift guard compares each example with its template and reports a missing or extra anchor. The fill line and the anchor count are tested together, because a fill line inside a pruned block changes the rendered shape.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` | Template | Carries the fill lines for the specification sections |
| `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl` | Template | Carries the fill lines for the plan sections |
| `.skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl` | Template | Carries the fill lines for the task sections |
| `.skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl` | Template | Carries the fill lines for the summary sections |
| `.skilled/skills/system-spec-kit/templates/addons/*.tmpl` | Template | Carries the fill lines for the addon sections |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts` | Vitest | Renders 16 documents and checks one fill line and the anchor count |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts` | Vitest | Compares every rendered level with a stored snapshot |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md` | Manual playbook | Scenario 480, both template guards |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/template-section-fill-guidance.md`

Related references:
- [versioned-placeholder-gate.md](versioned-placeholder-gate.md) - the rule that reads a token a writer left behind
- [example-drift-guard.md](example-drift-guard.md) - the guard that keeps the examples aligned
```

#### 3.10.3 `example-drift-guard.md`

```markdown
---
title: "Example drift guard"
description: "Compares every hand-written example with its template and fails when an anchor or a description drifts."
trigger_phrases:
  - "example drift guard"
  - "check-example-drift"
  - "example anchor drift"
  - "example description check"
version: 1.0.0.0
---

# Example drift guard

## 1. OVERVIEW

The example drift guard is a read-only script that compares the hand-written example packets with the templates they came from. A model copies an example, so a drifted example teaches the model a structure the validator no longer expects.

The guard reports one line per problem and exits 1 on any drift. It exits 0 and prints `EXAMPLE_DRIFT_OK` when every example agrees with its template.

---

## 2. HOW IT WORKS

### Anchor Comparison

The guard calls `runtime/cli/utils/template-structure.js compare <level> <doc> <example> anchors`. It fails on every `missing_anchor` line and every `extra_anchor` line. The compare step reads the level contract, so the guard inherits the required and optional anchor lists instead of hard-coding a copy.

### Description Check

The guard reads the first `description:` line of each example. It fails when the line holds the end of an HTML comment, starts lowercase, or lacks a closing period. Those three defects were the leaked line phase 2 repaired, and the check keeps them from coming back.

### Invocation

The script takes one optional directory. With no argument it reads `templates/examples`. With an argument it reads that directory, which lets a test run it against a scratch copy. A vitest wrapper runs it in the suite.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh` | Script | Compares every example with its template and checks the description |
| `.skilled/skills/system-spec-kit/runtime/cli/utils/template-structure.js` | Shared | Compares anchors for one level and document |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/example-drift.vitest.ts` | Vitest | Runs the guard in the suite |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md` | Manual playbook | Scenario 479, the clean run and the injected leak |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/example-drift-guard.md`

Related references:
- [template-section-fill-guidance.md](template-section-fill-guidance.md) - the guidance that decides the section shape an example must keep
- [template-compliance-contract-enforcement.md](template-compliance-contract-enforcement.md) - the anchor contract the compare step reads
```

#### 3.10.4 `spec-authoring-card.md`

```markdown
---
title: "Spec authoring card"
description: "One short card that the four authoring intents load instead of the long template guide, held in sync with the router and the checklist."
trigger_phrases:
  - "spec authoring card"
  - "authoring card"
  - "write a spec packet"
  - "fill a spec scaffold"
version: 1.0.0.0
---

# Spec authoring card

## 1. OVERVIEW

The spec authoring card is the short authoring path for a model. It lives at `references/workflows/spec-authoring-card.md` and fits in one read. The `PLAN`, `IMPLEMENT`, `INTAKE` and `TEMPLATE_AUTHORING` intents load the card. The long template guide stays reachable from the on demand list only.

The card covers the bounds of a packet write, the level choice, the scaffold command, the fill rules, the validation command and the close steps. Each step carries one action, one acceptance line and one command.

---

## 2. HOW IT WORKS

### Router Change

`RESOURCE_MAP` in `SKILL.md` lists the resources each intent loads. Four rows changed from the long guide to the card. The `ON_DEMAND` list keeps one guide entry, so a reader can still ask for the long path.

### Sync Guard

`runtime/cli/spec/check-card-sync.sh` reads the card, the router, the generated leaf inventory files and the authoring checklist. It prints one `PASS` line per check and fails on the first disagreement. The checks cover the card length, the four intent rows, the guide level, the two inventory files and the checklist wording.

### Inventory Regeneration

The card is a leaf resource, so the two generated inventory files list it. Both files are written by their generator scripts and are never edited by hand. The sync guard reads them, and the leaf inventory check reports a missing card entry.

### Authoring Use

A model reads the card, scaffolds with `create.sh`, fills every section, removes every token, and runs `validate.sh --strict`. Three smoke runs measure the path, and the manual playbook holds a full end to end scenario.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` | Reference | The short authoring path |
| `.skilled/skills/system-spec-kit/SKILL.md` | Router | Loads the card for the four authoring intents |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` | Script | Compares the four surfaces and fails on the first disagreement |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/card-sync.vitest.ts` | Vitest | Runs the sync guard in the suite |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-router-intents.md` | Manual playbook | Scenario 481, the four intent rows |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md` | Manual playbook | Scenario 482, the guard on the tree and on a copy |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md` | Manual playbook | Scenario 483, the end to end write |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/spec-authoring-card.md`

Related references:
- [spec-validation-rule-engine.md](spec-validation-rule-engine.md) - the strict run the card closes with
- [versioned-placeholder-gate.md](versioned-placeholder-gate.md) - the rule that decides when a token must be gone
```

#### 3.10.5 Root catalog entry blocks

Each block goes into `feature-catalog/feature-catalog.md` immediately above the heading named in its row. The block ends with one `---` separator, and the existing separator above the named heading stays in place.

| Block | Insert immediately above |
|-------|--------------------------|
| C1 Example drift guard | `### Heal spec docs anchor repair` |
| C2 Spec authoring card | `### Spec-folder detection and description metadata` |
| C3 Template section fill guidance | `### Track-root children lists` |
| C4 Versioned placeholder gate | `## 3. SPEC-DOC QUALITY AND METADATA` |

C1:

```markdown
### Example drift guard

#### Description

Compares every hand-written example with its template and fails when an anchor or a description drifts.

#### Current Reality

`runtime/cli/spec/check-example-drift.sh` prints `EXAMPLE_DRIFT_OK` on the tree and one failure line per drifted example.

#### Source Files

See [`tooling-and-scripts/example-drift-guard.md`](tooling-and-scripts/example-drift-guard.md) for full implementation and test file listings.

---

```

C2:

```markdown
### Spec authoring card

#### Description

One short card that the four authoring intents load instead of the long template guide, held in sync with the router and the checklist.

#### Current Reality

`references/workflows/spec-authoring-card.md` is the default load for the `PLAN`, `IMPLEMENT`, `INTAKE` and `TEMPLATE_AUTHORING` intents, and `runtime/cli/spec/check-card-sync.sh` holds its four surfaces together.

#### Source Files

See [`tooling-and-scripts/spec-authoring-card.md`](tooling-and-scripts/spec-authoring-card.md) for full implementation and test file listings.

---

```

C3:

```markdown
### Template section fill guidance

#### Description

Places one imperative fill instruction below every template section heading, with a good and a weak example, and holds the rendered result with a golden test.

#### Current Reality

Every content section of the four core templates and the ten addon templates carries one `<!-- FILL: ... -->` line, and the fill guidance test prints `16 passed`.

#### Source Files

See [`tooling-and-scripts/template-section-fill-guidance.md`](tooling-and-scripts/template-section-fill-guidance.md) for full implementation and test file listings.

---

```

C4:

```markdown
### Versioned placeholder gate

#### Description

Gates unfilled value tokens by the template stamp, warning while a v2.3 packet is Draft and failing it at any other status.

#### Current Reality

`PLACEHOLDER_FILLED` warns in a v2.3 packet while its status is Draft and errors at any other status, and a packet with an older stamp keeps its old verdict.

#### Source Files

See [`tooling-and-scripts/versioned-placeholder-gate.md`](tooling-and-scripts/versioned-placeholder-gate.md) for full implementation and test file listings.

---

```

### 3.11 Exact edits to existing docs

Apply each block with the edit tool. The old text must occur exactly once. A refusal means the doc changed since this plan was written: read the doc, record the difference in `goal.md` section 4 and block the task.

#### E1: `.skilled/skills/system-spec-kit/README.md`

E1.1 Add the Authoring row.

Old text:

```text
| **Validation** | the 41-rule registry with three strict-only rules gated behind `--strict` |
```

New text:

```text
| **Validation** | the 41-rule registry with three strict-only rules gated behind `--strict` |
| **Authoring** | one short card as the default load for the four writing intents, a placeholder gate that warns while a packet is Draft, and two read-only guards for examples and card sync |
```

E1.2 Fix the Quick Fixes row.

Old text:

```text
| Placeholder check fails | run `check-placeholders.sh` and replace all `[PLACEHOLDER]` values |
```

New text:

```text
| Placeholder check fails | run `check-placeholders.sh` and replace every `[YOUR_VALUE_HERE: ...]` token. A Draft packet may warn and still pass strict |
```

E1.3 Fix the upgrade answer.

Old text:

```text
A: Run `upgrade-level.sh` with the target level. It renders and injects the additional Level contract sections into the existing folder. Then run `check-placeholders.sh` to find new placeholder values that need filling.
```

New text:

```text
A: Run `upgrade-level.sh` with the target level. It renders and injects the additional Level contract sections into the existing folder. Then run `check-placeholders.sh` to find new value tokens that need filling.
```

E1.4 Fix the placeholder script row and add the two guards.

Old text:

```text
| `check-placeholders.sh` | find remaining `[PLACEHOLDER]` values after a level upgrade |
```

New text:

```text
| `check-placeholders.sh` | find remaining `[YOUR_VALUE_HERE: ...]` tokens after a level upgrade |
| `check-example-drift.sh` | report an example whose anchors or description drifted from its template |
| `check-card-sync.sh` | report a disagreement between the authoring card, the router, the leaf inventory and the checklist |
```

E1.5 Name the card in Related Documents.

Old text:

```text
| [`references/templates/template-guide.md`](./references/templates/template-guide.md) | template usage and composition rules |
```

New text:

```text
| [`references/workflows/spec-authoring-card.md`](./references/workflows/spec-authoring-card.md) | the short authoring path the four writing intents load first |
| [`references/templates/template-guide.md`](./references/templates/template-guide.md) | template usage and composition rules |
```

#### E2: `.skilled/skills/system-spec-kit/templates/README.md`

E2.1 Add the token and fill facts to the current state list.

Old text:

```text
- `core/`, `addons/` and `packet-types/` `*.md.tmpl` files contain gated markdown blocks rendered by the inline-gate renderer.
- `examples/` stores rendered reference packets for each supported Level.
```

New text:

```text
- `core/`, `addons/` and `packet-types/` `*.md.tmpl` files contain gated markdown blocks rendered by the inline-gate renderer.
- Every content section carries one `<!-- FILL: ... -->` instruction below its heading, with a good and a weak answer where the section needs one.
- The four core templates and `addons/acceptance-criteria.md.tmpl` are stamped v2.3 and ship `[YOUR_VALUE_HERE: ...]` tokens in place of bare hints.
- `examples/` stores rendered reference packets for each supported Level.
```

E2.2 Replace the closing validation sentence with the three literal checks. The new text holds an inner bash fence, so its outer fence uses four backticks. Copy the text between the outer fence.

Old text:

```text
For template changes, also run the template and resolver test suite used by the repository.
```

New text:

````text
For template changes, also run the golden render, the fill guidance test and the example drift guard:

```bash
cd .skilled/skills/system-spec-kit
./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts
./node_modules/.bin/vitest run runtime/cli/tests/template-fill-guidance.vitest.ts --config vitest.config.ts
bash runtime/cli/spec/check-example-drift.sh
```

Expected: `Tests  12 passed (12)`, `Tests  16 passed (16)` and `EXAMPLE_DRIFT_OK`.
````

#### E3: `.skilled/skills/system-spec-kit/references/validation/validation-rules.md`

E3.1 Qualify the rule summary row.

Old text:

```text
| `PLACEHOLDER_FILLED` | ERROR    | Core files    | No unfilled template placeholders              |
```

New text:

```text
| `PLACEHOLDER_FILLED` | ERROR or WARNING | Core files | No unfilled template tokens. A v2.3 doc warns while Draft |
```

E3.2 Qualify the section severity line.

Old text:

```text
## 4. PLACEHOLDER_FILLED

**Severity:** ERROR  
**Description:** Detects unfilled template placeholders that should be replaced with actual content.
```

New text:

```text
## 4. PLACEHOLDER_FILLED

**Severity:** ERROR, or WARNING for an unfilled token in a doc stamped v2.3 or later while its status is Draft  
**Description:** Detects unfilled template placeholders that should be replaced with actual content.
```

#### E4: `.skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md`

E4.1 Qualify the rule table row.

Old text:

```text
| `PLACEHOLDER_FILLED` | ERROR    | No unfilled `[YOUR_VALUE_HERE:]` placeholders       |
```

New text:

```text
| `PLACEHOLDER_FILLED` | ERROR or WARNING | No unfilled `[YOUR_VALUE_HERE:]` tokens. A v2.3 doc warns while Draft |
```

E4.2 Add the Draft rule to the pattern list.

Old text:

```text
- `[YOUR_VALUE_HERE: ...]` - Template placeholder, must be filled
```

New text:

```text
- `[YOUR_VALUE_HERE: ...]` - Template token, must be filled. In a doc stamped v2.3 or later it is a warning while `spec.md` has the status Draft, and an error at any other status
```

#### E5: `.skilled/skills/system-spec-kit/references/templates/template-style-guide.md`

E5.1 Add the version rule after the placeholder type table.

Old text:

```text
| `[OPTIONAL: description]` | Optional fields | `[OPTIONAL: link to spec.md]` |

### Usage Guidelines
```

New text:

```text
| `[OPTIONAL: description]` | Optional fields | `[OPTIONAL: link to spec.md]` |

A scaffold stamped v2.3 or later ships each hint as a `[YOUR_VALUE_HERE: ...]` token. Replace the whole token, brackets included, with real content. While `spec.md` has the status Draft an unfilled token is a warning and strict validation can still pass. At every other status it is an error. A doc with an older stamp keeps the error it always had.

### Usage Guidelines
```

E5.2 Split the validation rule row.

Old text:

```text
| Placeholder completion | No unfilled `[YOUR_VALUE_HERE:]` | ERROR |
```

New text:

```text
| Placeholder completion while Draft | No unfilled `[YOUR_VALUE_HERE:]` token in a v2.3 doc | WARNING |
| Placeholder completion after Draft | No unfilled `[YOUR_VALUE_HERE:]` token | ERROR |
```

#### E6: `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md`

E6.1 Name the card before the long guide.

Old text:

```text
- [template-guide.md](../templates/template-guide.md) - Template selection, adaptation, and quality standards
```

New text:

```text
- [spec-authoring-card.md](spec-authoring-card.md) - The short authoring path the four writing intents load first
- [template-guide.md](../templates/template-guide.md) - Long-form template selection, adaptation, and quality standards
```

#### V1: `.skilled/skills/system-spec-kit/references/templates/template-guide.md`

No edit. Phase 3 owns five replacements in this file plus the token rule. Verify them with the commands in `tasks.md` T006. A miss blocks the task and does not get repaired here.

### Data Flow
Three lanes write disjoint files, the conductor adds the two index layers, the gate commands read the finished docs, and phase 8 runs the eight scenarios from the playbook.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes no producer or consumer. The table records what it documents so a reviewer can check for coverage.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `manual-testing-playbook/` | Operator scenarios for the engine | update: add one category and eight files | playbook validator prints `violations=0` |
| `feature-catalog/` | Current feature inventory | update: add four leaves and four root entries | catalog validator prints `PASS` |
| `README.md`, `templates/README.md` | Human orientation | update: name the token rule, the card and the two guards | `validate_document.py` passes both |
| `references/validation/`, `references/templates/`, `references/workflows/` | Authoring and validation reference | update: qualify the gate, the token form and the card pointer | `validate_document.py` passes each file |
| `SKILL.md`, the card, the two guard scripts | Surfaces another phase owns | unchanged, read-only here | the playbook validator resolves every link |

Required inventories:
- Same-class producers: every scenario file in the new category, every catalog leaf in the new set, and every doc that names the placeholder rule, found with `rg -l 'PLACEHOLDER_FILLED|YOUR_VALUE_HERE' .skilled/skills/system-spec-kit`.
- Consumers of changed symbols: none, nothing changes in code.
- Matrix axes: eight scenarios by their PASS and FAIL halves, plus four catalog leaves by root and leaf parity.
- Algorithm invariant: every scenario command is copy-runnable from a worktree root, and every scenario removes the track it creates.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Every new scenario file satisfies the operator contract | `validate-playbook-package.cjs` |
| Unit | Every new catalog leaf and its root entry agree | `validate_catalog_package.py` |
| Integration | The eight scenario IDs are in the root index | `rg` counts in `tasks.md` T007 |
| Integration | The spec-kit suite still passes | `npm --prefix $S test` |
| Manual | One read-only frontier review of the diff | `cli-codex` in `tasks.md` T015 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 closed, examples repaired | Internal | Checked in T001 | The drift guard would report the old leaks as new failures |
| Phase 3 closed, v2.3 templates and the gate | Internal | Checked in T001 | Three scenarios have no behavior to test |
| Phase 4 closed, `check-example-drift.sh` | Internal | Checked in T001 | Scenario 479 cannot run |
| Phase 5 closed, the card and `check-card-sync.sh` | Internal | Checked in T001 | Scenarios 481 to 483 cannot run |
| `sk-create-manual-testing-playbook`, `sk-create-feature-catalog`, `sk-create-readme` | Internal | Read in T003 | A lane follows the wrong contract |
| `cli-codex` for the review | External | Checked in T015 | The review is recorded as skipped and REQ-008 stays open |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any file outside the file table in `spec.md` section 3 and this phase folder changed.
- **Procedure**: `git diff --name-only <start commit>` lists the files. Restore each with `git restore --source=<start commit> -- <file>`. A new file that phase 8 has not run yet is removed with `rm`, and its row is removed from the playbook index in the same step.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T003) ──► Lane A scenarios (T004) ──► Playbook index (T007) ──┐
                  ├──► Lane B catalog (T005)   ──► Catalog index (T008)  ──┼──► Gates (T009-T014) ──► Review (T015-T016) ──► Close (T017)
                  └──► Lane C docs (T006)      ───────────────────────── ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Launch preconditions | Lanes |
| Lane A | Setup, phases 2 to 5 | Playbook index |
| Lane B | Setup | Catalog index |
| Lane C | Setup, phase 3 | Gates |
| Gates | Every lane and both indexes | Review |
| Review | Gates | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Three lanes | Med | 1 to 2 hours |
| Index and gates | Low | 45 minutes |
| Review and close | Low | 30 minutes |
| **Total** | | **2 to 4 hours, an assumption with no timed earlier run** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Start commit hash recorded in `goal.md` section 4 before the first dispatch
- [ ] `git status --porcelain` saved to `scratch/baseline/status-start.txt`
- [ ] No feature flag applies, this phase ships documentation only

### Rollback Procedure
1. List changed files with `git diff --name-only <start commit>`.
2. Restore each one outside this phase folder with `git restore --source=<start commit> -- <file>`.
3. Remove a new file that phase 8 has not run yet, then remove its row from the playbook index.
4. Run `git status --porcelain` and compare with `scratch/baseline/status-start.txt`.
5. Record the rollback in `goal.md` section 4.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, nothing persistent is written outside this folder
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐     ┌───────────────┐     ┌──────────────┐     ┌──────────┐
│  Setup   │────►│ Lane A, B, C  │────►│ Two indexes  │────►│  Gates   │
└────┬─────┘     └───────────────┘     └──────────────┘     └────┬─────┘
     │                                                             │
     └─────────────────────────────────────────────────────────────┴──► Review
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Launch preconditions | Start commit, checks | Lanes |
| Lane A | Setup, phases 2 to 5 | Eight scenario files | Playbook index |
| Lane B | Setup | Four catalog leaves | Catalog index |
| Lane C | Setup, phase 3 | Six aligned docs | Gates |
| Indexes | Lane A, Lane B | Two index layers | Gates |
| Gates | Indexes, Lane C | Validator output | Review |
| Review | Gates | Findings file | Close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup** - 20 minutes - CRITICAL
2. **Lane A, eight scenarios** - 1 to 2 hours - CRITICAL
3. **Gates** - 45 minutes - CRITICAL
4. **Review** - 30 minutes - CRITICAL

**Total Critical Path**: about 2 to 3 hours

**Parallel Opportunities**:
- Lanes A, B and C run together, three dispatches at once, because they write disjoint files.
- The two index edits run after their lane and touch different index files, so they can run together.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup done | T001 to T003 marked `[x]` with evidence | Start of phase |
| M2 | Scenario files written | Eight files exist and the playbook validator reports `violations=0` | Mid phase |
| M3 | Catalog written | Four leaves exist and the catalog validator prints `PASS` | Mid phase |
| M4 | Docs aligned | Six existing docs changed and `validate_document.py` passes each | Mid phase |
| M5 | Phase closeable | Every acceptance criterion `Met` | End of phase |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

Written for the executing swarm. Follow each rule as written. Where a rule and your own judgment disagree, follow the rule and record the disagreement in `goal.md` section 4.

### Roles
- **Conductor**: one DeepSeek V4.1 Flash max session that is not itself running inside OpenCode, because `cli-opencode` refuses a dispatch from inside OpenCode. It dispatches workers, runs every verify command, edits only the declared files, and keeps `goal.md` section 4 current.
- **Worker**: one `opencode2 run` dispatch on `llmgateway/deepseek-v4.1-flash-1017#max`. One worker does one lane, then stops.
- **Reviewer**: one read-only frontier review through `cli-codex` at phase close. It writes nothing.

### Pre-Task Checklist
- [ ] Read this phase's `spec.md`, this plan and `tasks.md` before the first dispatch
- [ ] Read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` sections 3 and 4 before composing the first worker command
- [ ] Confirm the working directory is the build worktree recorded in `../goal.md` section 4, never the main checkout
- [ ] Confirm `opencode2 models --standalone` lists `llmgateway/deepseek-v4.1-flash-1017`
- [ ] Save every brief to `scratch/briefs/<task-id>.txt` before dispatching it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Run tasks in ID order. Tasks marked `[P]` may run together, at most three at once, and only when no two write the same file |
| TASK-SCOPE | A worker writes only the paths under ALLOWED WRITE PATHS in its brief |
| TASK-VERIFY | The conductor runs the task's verify command and reads both its output and its exit status before marking the task `[x]` |
| TASK-LOCATE | Find text by its exact content, never by a line number |
| TASK-BANNED | Workers never run `git commit`, `git push`, `git checkout`, `git switch`, `git branch`, `git reset`, `git stash`, `generate-context.js` or `/speckit:save` |

### Worker Brief Skeleton

Every brief starts with this block, word for word, with the two paths filled in:

```text
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and
SYSTEM_SPEC_GATE_ENFORCE=0 are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE: <the one role this task needs>

ALLOWED WRITE PATHS:
  <the paths this task names>

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
git stash, rm, mv, create.sh outside the task's stated command, generate-context.js,
/speckit:save, opencode, any sub-agent, and any edit to a file not listed under ALLOWED WRITE PATHS.
```

The role line is a focused persona summary in place of a full agent file, the small-context exception that `cli-opencode` rule 18 allows. It is declared here as that exception.

### Dispatch Command

```bash
cd "$WORKTREE" && SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode2 run --standalone \
  -m llmgateway/deepseek-v4.1-flash-1017#max --format json \
  "$(cat "$PHASE/scratch/briefs/$TASK.txt")" </dev/null > "$PHASE/scratch/runs/$TASK.jsonl" 2>&1 &
PID=$!; wait "$PID"; kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
```

`PHASE` is this folder's path and `WORKTREE` is the build worktree. Never kill by a name pattern. Kill only the captured PID.

### Status Reporting Format

`[T###] DONE | BLOCKED - one line of evidence`, written as a row in the progress table of `goal.md` section 4.

### Blocked Task Protocol
1. Restore any file the task changed with `git restore --source=<start commit> -- <file>`.
2. Mark the task `[B]` in `tasks.md` with the failing command and the first line of its output.
3. Re-dispatch at most twice with the brief corrected for what failed. After the third failure on the same task, leave it `[B]` and continue with the next task.
4. Stop the phase when two tasks are blocked, and write `STOP` with both task IDs in `goal.md` section 4.
<!-- /ANCHOR:ai-execution -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Eight scenarios in one new category

**Status**: Accepted

**Context**: The playbook index is one long table per category. The eight new scenarios cover one subject, and the existing `tooling-and-scripts/` table already carries 60 rows.

**Decision**: Create `manual-testing-playbook/template-authoring/` with IDs 476 to 483, and add one section `### 7.9 Template Authoring` to the root index.

**Consequences**:
- The index gains one section and the subjects stay together.
- The category list and the index section both change. A missed section leaves eight orphan files, which the playbook validator reports.

**Alternatives Rejected**:
- Spread the rows through the `tooling-and-scripts/` table: eight insertions in a 60-row table invite a duplicate ID and a wrong alphabetical slot.

### ADR-002: Four catalog leaves, not one

**Status**: Accepted

**Context**: The new behavior has four distinct surfaces: a validation rule, a template instruction set, a read-only guard and an authoring card.

**Decision**: One leaf per surface, and one root entry per leaf. The playbook rows link the leaf that owns the behavior they test.

**Consequences**:
- A reader can find one subject without reading a combined page.
- Four titles and four descriptions must match the root entry word for word. The catalog validator checks that parity.

**Alternatives Rejected**:
- One combined leaf: its title would name no single feature, and the playbook cross-references would point at a page that covers three subjects.

### ADR-003: Verify the phase 3 reference edits instead of repeating them

**Status**: Accepted

**Context**: Phase 3 already replaces five `PLACEHOLDER` lines in `template-guide.md` and adds the lifecycle section to `validation-rules.md`. Two phases writing one text would make the second edit miss.

**Decision**: This phase verifies the phase 3 text with literal `rg` counts and edits only the rows phase 3 leaves: the rule summary, the section severity, the path-scoped rule table and the style guide.

**Consequences**:
- No line is written twice.
- A missing phase 3 edit blocks this phase instead of being silently repaired here.

**Alternatives Rejected**:
- Re-apply the phase 3 text: it would be a stale locator on the post-phase-3 tree.
