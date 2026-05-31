---
title: "PHASE-002 -- Phase folder creation"
description: "This scenario validates Phase folder creation for `PHASE-002`. It focuses on Run `create.sh \"Test\" --phase --level 3 --phases 3` and verify parent+children structure."
---

# PHASE-002 -- Phase folder creation

## 1. OVERVIEW

This scenario validates Phase folder creation for `PHASE-002`. It focuses on Run `create.sh "Test" --phase --level 3 --phases 3` and verify parent+children structure.

---

## 2. SCENARIO CONTRACT


- Objective: Run `create.sh "Test" --phase --level 3 --phases 3` and verify parent+children structure.
- Real user request: `Please validate Phase folder creation against bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify" and tell me whether the expected signals are present: Parent folder with Phase Documentation Map in spec.md; 3 child folders with correct naming; back-references and predecessor/successor links in child spec.md files; Level 3 template files in all folders.`
- Prompt: `Validate Phase folder creation against bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify" and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Parent folder with Phase Documentation Map in spec.md; 3 child folders with correct naming; back-references and predecessor/successor links in child spec.md files; lean phase-parent trio at the parent and Level 1 template files in each child
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if parent contains Phase Documentation Map listing all 3 children, each child has parent back-reference, middle child has both predecessor and successor links, and all folders contain Level 3 templates

---

## 3. TEST EXECUTION

### Prompt

```
Validate Phase folder creation against bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify" and report cited pass/fail evidence.
```

### Commands

1. `bash .opencode/skills/system-spec-kit/scripts/spec/create.sh "Phase Test" --phase --level 3 --phases 3 --phase-names "Design,Implement,Verify"`
2. Verify parent folder `specs/NNN-phase-test/` exists with spec.md containing Phase Documentation Map
3. Verify 3 child folders `001-design/`, `002-implement/`, `003-verify/` exist under parent
4. Verify each child has spec.md with parent back-reference
5. Verify `002-implement/spec.md` has predecessor link to `001-design` and successor link to `003-verify`
6. Verify Level 3 template files present in parent and each child

### Expected

Parent folder with Phase Documentation Map in spec.md; 3 child folders with correct naming; back-references and predecessor/successor links in child spec.md files; Level 3 template files in all folders

### Evidence

Command transcript + `ls -R` of created structure + spec.md excerpts showing links

### Pass / Fail

- **Pass**: parent contains Phase Documentation Map listing all 3 children, parent contains the lean phase-parent trio (`spec.md`, `description.json`, `graph-metadata.json`), each child has parent back-reference, middle child has both predecessor and successor links, and each child contains Level 1 templates
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check create.sh supports --phase flag; verify --phase-names parsing; inspect the phase-parent contract and child level contract; check folder naming collision with existing specs

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/206-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/206-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: PHASE-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/002-phase-folder-creation.md`
