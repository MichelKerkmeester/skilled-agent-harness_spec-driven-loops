---
title: "ORCA-008 -- Official skill layer matches the upstream stubs"
description: "This scenario validates that the local snapshot layer is byte identical to the upstream stubs and that local documents defer flag detail to the binary guide."
catalog_applicable: true
version: 1.0.0.0
---

# ORCA-008 -- Official skill layer matches the upstream stubs

This file is the canonical operator contract for snapshot identity and the deference rule that keeps flag detail in the binary guide.

---

## 1. OVERVIEW

This scenario verifies two halves of the official skill layer contract. The eight vendored stub snapshots are byte identical to their versioned source files, and no local document claims the flag detail the binary serves.

### Why This Matters

The official stubs are discovery stubs by design: the real flags live in the installed binary, and a paraphrase would drift from the app version. A local layer that edits snapshot bytes or restates flags locally breaks both the provenance chain and the version-matched guide authority at once.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the local official skill layer matches the upstream stubs it snapshots and defers flag detail to the binary.
- Real user request: `Does our Orca skill layer match what the binary ships, and where does the flag detail live?`
- Prompt: `Does our Orca skill layer match what the binary ships, and where does the flag detail live?`
- Expected execution process: List the snapshot layer, compare one snapshot byte for byte against its versioned source, and read the overview's guide-authority rule. The comparison is the identity half, and the overview lines are the deference half.
- Expected signals: Step 1 lists the eight snapshot files plus PROVENANCE.md. Step 2 exits zero, proving the local snapshot is byte identical to the versioned source. Step 3 prints the rule that the real guide is served by the binary through `ORCA skills get <name> --full`, so no local document claims flag detail the binary owns.
- Desired user-visible outcome: The operator learns the layer matches upstream and that flag detail lives in the version-matched guide served by the binary, not in any local document.
- Pass/fail: PASS if the listing shows eight snapshot files plus PROVENANCE.md, the comparison exits zero, and the overview prints the binary-guide rule. FAIL if a snapshot drifts from its source, or if a local document presents itself as the flag authority instead of deferring to the binary guide. SKIP when the snapshot tree or its versioned source is missing, with the absent tree named as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

Run the steps in order from the repository root.

1. Run `ls .skilled/skills/cli-orca/assets/*.txt` and keep the listing.
2. Run `cmp .skilled/skills/cli-orca/assets/orchestration.txt specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/skills/orchestration/SKILL.md` and record the exit status.
3. Run `rg -n "guide" .skilled/skills/cli-orca/references/orca-skills/overview.md` and keep the guide-authority lines.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ORCA-008 | Official skill layer matches the upstream stubs | Prove snapshot identity and the deference rule that keeps flag detail in the binary guide. | `Does our Orca skill layer match what the binary ships, and where does the flag detail live?` | 1. `bash: ls .skilled/skills/cli-orca/assets/*.txt` -> 2. `bash: cmp .skilled/skills/cli-orca/assets/orchestration.txt specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/skills/orchestration/SKILL.md` -> 3. `bash: rg -n "guide" .skilled/skills/cli-orca/references/orca-skills/overview.md` | Step 1 lists the eight snapshot files plus PROVENANCE.md. Step 2 exits zero, proving the local snapshot is byte identical to the versioned source. Step 3 prints the rule that the real guide is served by the binary through `ORCA skills get <name> --full`, so no local document claims flag detail the binary owns. | Command transcript, exit statuses, the directory listing, the cmp result, and the guide-authority lines. | PASS if the listing shows eight snapshot files plus PROVENANCE.md, the comparison exits zero, and the overview prints the binary-guide rule. FAIL if a snapshot drifts from its source, or if a local document presents itself as the flag authority instead of deferring to the binary guide. SKIP when the snapshot tree or its versioned source is missing, with the absent tree named as the blocker. | 1. Rerun `cmp` on the drifted file and capture the first differing byte. 2. Regenerate the snapshot from the source following PROVENANCE.md and never hand-edit snapshot bytes. 3. Rerun the byte and hash comparison from PROVENANCE.md section 4. 4. If a local document restates flag detail, point it at `ORCA skills get <name> --full` and remove the local claim. |

### Evidence Review

The zero exit of the byte comparison is the load-bearing signal for identity, not the presence of the files. A listing proves the layer exists, and the guide-authority lines prove deference, so a PASS needs the comparison result together with the overview lines, and a drift fails the whole layer rather than one stub.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Orca-qualified routing vocabulary catalog entry](../../feature-catalog/routing/orca-qualified-vocabulary.md) | The routing signal class that names official skills in an Orca context. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Official skills overview](../../references/orca-skills/overview.md) | The hybrid stub design, the guide loading rule and the snapshot provenance. |
| [Snapshot provenance](../../assets/PROVENANCE.md) | Per-skill release records, the verification procedure and the refresh procedure. |
| [Router contract](../../SKILL.md) | Official-skill lane rules and the NEVER rule against restating stub flags as local truth. |

---

## 5. SOURCE METADATA

- Group: Ownership
- Group note: the official skill layer is a shared boundary, and this scenario checks the snapshot identity half of it.
- Playbook ID: ORCA-008
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ownership/official-skill-handoff.md`
- Catalog entry: `routing/orca-qualified-vocabulary.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
