---
title: "PR-002 -- Self-Target Packaging Profile"
description: "Manual validation scenario for PR-002: Self-Target Packaging Profile."
feature_id: "PR-002"
category: "Non_Dev_AI_System Mode"
version: 1.17.0.1
---

# PR-002 -- Self-Target Packaging Profile

This document captures the canonical manual-testing contract for `PR-002`.

---

## 1. OVERVIEW

This scenario validates the runtime/ Lane D self-target packaging profile: editable technique docs are included in `allowedDiffRelpaths`, frozen scorer/harness surfaces are excluded from the allowed diff list, self-target schema fields are recognized without becoming required for legacy packagings, and `/deep:ai-system-improvement` documents the command-level guard without changing the `loop-host.cjs` argv contract.

---

## 2. SCENARIO CONTRACT

- Objective: Validate self-target profile boundaries and command/contract documentation.
- Real user request: `Confirm that the runtime/ self-target profile freezes scorer and harness files while allowing only technique-doc edits.`
- Prompt: `Validate the Lane D self-target packaging profile for runtime/.`
- Expected execution process: Read the profile, schema, command, and loop contract; run deterministic assertions over editable docs, frozen surfaces, schema fields, excluded session prefixes, and command text.
- Expected signals: every `editableTechDocs[].relpath` exists and appears in `allowedDiffRelpaths`; no `frozenSurfaces[].relpath` appears in `allowedDiffRelpaths`; at least one frozen surface is a scorer and at least one is a harness; `excludedSessionPrefixes` includes the runtime/ loop/scoring/merge/diagnostic prefixes; schema properties exist but are not required; command text documents `--self-target <profile>`, dry-run default, clean-tree live guard, single-writer lock, `--parallel` opt-in, and non-forwarding to `loop-host.cjs`.
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with decisive evidence from deterministic assertions.
- Pass/fail: PASS when all profile-boundary, schema, command, and contract assertions pass.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Run the exact command sequence.
3. Capture stdout, stderr, and exit code.
4. Compare observed output against the expected signals and pass/fail criteria.
5. Record the scenario verdict with decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PR-002 | Self-Target Packaging Profile | Validate self-target profile allow-list and frozen-surface boundaries | `Validate the Lane D self-target packaging profile for runtime/.` | <pre>node -e "const fs=require('fs');const path=require('path');const root=process.cwd();const profile=JSON.parse(fs.readFileSync('.opencode/skills/system-deep-loop/deep-improvement/assets/non_dev_ai_system/profiles/deep_loop_runtime.json','utf8'));const schema=JSON.parse(fs.readFileSync('.opencode/skills/system-deep-loop/deep-improvement/assets/non_dev_ai_system/packaging_config.schema.json','utf8'));const command=fs.readFileSync('.opencode/commands/deep/ai-system-improvement.md','utf8');const contract=fs.readFileSync('.opencode/skills/system-deep-loop/deep-improvement/references/non_dev_ai_system/loop_contract.md','utf8');const allowed=new Set(profile.allowedDiffRelpaths);const frozen=profile.frozenSurfaces.map(s=>s.relpath);function assert(ok,msg){if(!ok){throw new Error(msg)}}assert(fs.existsSync(path.resolve(root,profile.packaging_root)),'missing packaging_root');assert(profile.frozenSurfaces.some(s=>s.surfaceType==='scorer'),'missing scorer frozen surface');assert(profile.frozenSurfaces.some(s=>s.surfaceType==='harness'),'missing harness frozen surface');assert(JSON.stringify(profile.excludedSessionPrefixes)===JSON.stringify(['deep-loop-runtime-loop-','deep-loop-runtime-scoring-','deep-loop-runtime-merge-','deep-loop-runtime-diag-']),'unexpected excluded prefixes');for(const doc of profile.editableTechDocs){assert(allowed.has(doc.relpath),'editable doc not allowed: '+doc.relpath);assert(fs.existsSync(path.resolve(root,doc.relpath)),'editable doc missing: '+doc.relpath)}for(const rel of frozen){assert(!allowed.has(rel),'frozen surface allowed: '+rel);assert(fs.existsSync(path.resolve(root,rel)),'frozen surface missing: '+rel)}for(const key of ['frozenSurfaces','editableTechDocs','allowedDiffRelpaths','excludedSessionPrefixes']){assert(schema.properties[key],'schema missing '+key);assert(!(schema.required||[]).includes(key),'schema made legacy field required: '+key)}for(const text of ['--self-target <profile>','dry-run remains the default','Require a clean tree for `--live`','Acquire the single-writer loop lock','unless the user explicitly passes `--parallel`','The self-target flag is not forwarded to `loop-host.cjs`']){assert(command.includes(text),'command missing '+text)}assert(contract.includes('## 11. SELF-TARGET PACKAGING PROFILE'),'contract missing self-target section');assert(contract.includes('`allowedDiffRelpaths[]`'),'contract missing allowedDiffRelpaths');console.log('PASS self-target profile boundaries valid');"</pre> | Command exits 0 and prints `PASS self-target profile boundaries valid`; editable docs are allowed and exist; frozen surfaces exist and are not allowed; schema fields exist but remain optional; command and contract contain the required self-target guard wording. | Terminal transcript, assertion output, PASS/FAIL verdict. | PASS when the assertion command exits 0 and prints the PASS line. | If an editable doc is missing from `allowedDiffRelpaths`: update the profile allow-list or remove the editable doc entry<br>If a frozen surface is allowed: remove it from `allowedDiffRelpaths` before any self-target run<br>If schema fields are required: restore backward compatibility for older Lane D packagings<br>If command text is missing: update `/deep:ai-system-improvement` setup guidance |

### Optional Supplemental Checks

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste assertion output]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `non-dev-ai-system/self-target-packaging-profile.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for deep-improvement (Lane D: Non-Dev-AI-System Refine) |
| `../../assets/non_dev_ai_system/profiles/deep_loop_runtime.json` | Self-target packaging profile with frozen surfaces, editable docs, allowed diff relpaths, and excluded session prefixes |
| `../../assets/non_dev_ai_system/packaging_config.schema.json` | Schema recognizing self-target profile metadata |
| `../../references/non_dev_ai_system/loop_contract.md` | Contract reference documenting the self-target profile and guard |
| `../../../../../commands/deep/ai-system-improvement.md` | Command router documenting `--self-target <profile>` setup |
| `../../../../../skills/runtime//tests/unit/meta-loop-lane-d-packaging.vitest.ts` | Automated profile, schema, command, and contract coverage |

---

## 5. SOURCE METADATA

- Group: Non-Dev-AI-System Mode
- Playbook ID: PR-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `non-dev-ai-system/self-target-packaging-profile.md`
