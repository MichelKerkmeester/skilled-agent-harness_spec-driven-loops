---
title: "CHG-002 -- Route a phase child to a global entry and refuse --nested"
description: "This scenario validates phase-child topology for CHG-002. A phase-child source resolves to a global component entry, and a --nested request is refused because packet-local changelogs are deprecated."
version: 1.0.1.0
---

# CHG-002 -- Route a phase child to a global entry and refuse --nested

This document captures the operator contract for a phase-child source now that packet-local changelogs are deprecated.

## 1. OVERVIEW

This scenario validates phase-child topology for `CHG-002`. It focuses on resolving a phase child to a global component entry and on refusing `--nested`.

### Why This Matters

Spec folders no longer get changelogs. A phase child used to route to a packet-local file under the phase parent's `changelog/` folder, which no reader looked at. Its work now belongs in the global entry for the component it touched, and a request for the old packet-local file must stop with a clear reason rather than write one.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-002` and confirm the global route and the refusal.

- Objective: route a phase-child spec folder to a global component entry and refuse `--nested`
- Realistic user request: `Record the completed phase in its packet changelog.`
- Prompt: `Create a changelog for this phase child with --nested. Report what the workflow does with --nested, then resolve the global component the phase touched and report the target path without writing it.`
- Expected execution process: the topology rules are read, `--nested` is refused as deprecated, the phase child's changed paths are matched against `.skilled/changelog/` by whole path segment and the global target is reported. No file is written under `specs/**/changelog/`.
- Expected signals: the run says packet-local changelogs are deprecated and offers a global entry. The proposed path is `.skilled/changelog/{component}/v{VERSION}.md` or a hub link such as `.skilled/changelog/sk-doc/create-frontmatter/`. The nested generator is not run with `--write`.
- Desired user-visible outcome: a refusal of `--nested` and a resolved global target for the phase's work.
- Pass/fail: PASS if `--nested` is refused, the target is a global component path and nothing is written under the spec folder. FAIL if a packet-local file is written or proposed, or the nested generator runs with `--write`.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a changelog for this phase child with --nested. Report what the workflow does with --nested, then resolve the global component the phase touched and report the target path without writing it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-002 | Route a phase child to a global entry and refuse --nested | Refuse `--nested` and resolve a global target for a phase child | `Create a changelog for this phase child with --nested. Report what the workflow does with --nested, then resolve the global component the phase touched and report the target path without writing it.` | 1. `agent: Read SKILL.md sections 3, 4 and 6 and references/topology-edge-cases.md` -> 2. `bash: test -d specs/sk-doc/049-sk-create-frontmatter/002-mode-scaffold` -> 3. `bash: ls -l .skilled/changelog/sk-doc/` -> 4. `bash: git status --porcelain` -> 5. `agent: State the refusal, the matched component and the global target path` -> 6. `bash: git status --porcelain` | Step 1 names the `--nested` refusal and global-only mode. Step 2 exits 0. Step 3 lists the hub links. Step 5 refuses `--nested` and names a `.skilled/changelog/` target. Step 6 matches step 4 | Exact prompt, the rules cited, the folder check exit status, the hub listing, the refusal text, the target path and both status snapshots | PASS if `--nested` is refused, the target is global and the status is unchanged. FAIL if a packet-local path is proposed or written, or the nested generator runs with `--write` | 1. Reread SKILL.md section 4 on deprecated packet-local changelogs. 2. Match changed paths by whole path segment. 3. Remove any `specs/**/changelog/` output the run created |

### Commands

1. `agent: Read SKILL.md sections 3, 4 and 6 and references/topology-edge-cases.md`
2. `bash: test -d specs/sk-doc/049-sk-create-frontmatter/002-mode-scaffold`
3. `bash: ls -l .skilled/changelog/sk-doc/`
4. `bash: git status --porcelain`
5. `agent: State the refusal, the matched component and the global target path`
6. `bash: git status --porcelain`

### Expected

The run refuses `--nested` and says packet-local changelogs are deprecated. The phase child resolves to the global component its changed paths touch, here the `sk-doc/create-frontmatter` link. No file is written under the spec folder, and the nested generator is not run with `--write`.

### Evidence

Capture the prompt, the rules cited, the folder check and its exit status, the hub listing, the refusal text, the target path and the git status before and after.

### Pass / Fail

- **Pass**: `--nested` is refused, the target is a global component path and the git status is unchanged.
- **Fail**: the run writes or proposes a packet-local changelog for the phase.

### Failure Triage

1. Reread SKILL.md section 4 on deprecated packet-local changelogs.
2. Match the phase's changed paths against `.skilled/changelog/` by whole path segment.
3. Remove any file the run created under `specs/**/changelog/`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | The `--nested` refusal, the deprecation note and global target resolution |
| [`references/topology-edge-cases.md`](../../references/topology-edge-cases.md) | Placement table with the deprecated packet-local rows |

---

## 5. SOURCE METADATA

- Group: TOPOLOGY
- Playbook ID: CHG-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `topology/route-phase-child-nested.md`
