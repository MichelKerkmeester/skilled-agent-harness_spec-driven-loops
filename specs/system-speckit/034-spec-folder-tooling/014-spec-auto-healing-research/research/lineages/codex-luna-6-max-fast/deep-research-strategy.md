---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable. Analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Analyze every change branch 091-consolidate-small-packets made to the spec folder tooling and the spec corpus, including the commits in `git log origin/main..HEAD` and the uncommitted corpus-wide repair of phase 013. Determine how to harden the tooling and automate safe healing of old formats, including pre-v4 repositories, without burdening external users on older versions. Answer five questions with file:line evidence: which one-off repairs should become permanent idempotent tooling and where they belong; what causes each validation failure class and how to prevent new instances; how to detect and safely heal older repositories and fit this into `/doctor:update`; how to harden this branch's CI rebuild, cleanup tools, seeder, Gate 3 wording, and token push; and which checks belong in CI or pre-commit.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- [x] What causes each validation failure class at the source, and how do we stop new instances?
- [x] How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- [x] What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- [x] Which checks belong in CI or pre-commit so drift is caught early and cheaply?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Implementation and corpus repair are out of scope. This lineage reads source and records recommendations only. It writes only inside its own lineage directory. It does not run repository repair, validation, test, reducer, or context-save tools.

---

## 5. STOP CONDITIONS
Complete all 15 iterations even if convergence signals pass. When an angle saturates, broaden to another key question. Synthesize only after iteration 15 and record stopReason `maxIterationsReached`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which one-off repair fixes should become permanent idempotent tooling, and where should each live?
- What causes each validation failure class at the source, and how do we stop new instances?
- How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update?
- What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push?
- Which checks belong in CI or pre-commit so drift is caught early and cheaply?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Adding every anchor-related validation failure to `repair-derived.cjs`'s allow-list. That tool's boundary is repository facts that can be recomputed; duplicate and overlapping anchor choices can affect structure and references without enough evidence to infer intent. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:59] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs:64] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Adding every anchor-related validation failure to `repair-derived.cjs`'s allow-list. That tool's boundary is repository facts that can be recomputed; duplicate and overlapping anchor choices can affect structure and references without enough evidence to infer intent. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:59] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs:64]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding every anchor-related validation failure to `repair-derived.cjs`'s allow-list. That tool's boundary is repository facts that can be recomputed; duplicate and overlapping anchor choices can affect structure and references without enough evidence to infer intent. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:59] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs:64]

### Adding specs/ migration writes to the current release-update apply plan and relying on release rollback. The current updater inventories .skilled and rejects rollback paths outside its release units. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2391] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Adding specs/ migration writes to the current release-update apply plan and relying on release rollback. The current updater inventories .skilled and rejects rollback paths outside its release units. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2391]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding specs/ migration writes to the current release-update apply plan and relying on release rollback. The current updater inventories .skilled and rejects rollback paths outside its release units. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2391]

### Automatically assigning the current version to a markerless legacy document. The absent marker does not establish which template, if any, produced the file. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:167] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Automatically assigning the current version to a markerless legacy document. The absent marker does not establish which template, if any, produced the file. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:167] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Automatically assigning the current version to a markerless legacy document. The absent marker does not establish which template, if any, produced the file. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:167] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40]

### Automatically reseeding archives during archive or restore while the phase 013 live-and-archived repair scope conflicts with the upgrader's frozen-snapshot contract. Record the conflict and keep archive mutation opt-in until one policy is selected. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Automatically reseeding archives during archive or restore while the phase 013 live-and-archived repair scope conflicts with the upgrader's frozen-snapshot contract. Record the conflict and keep archive mutation opt-in until one policy is selected. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Automatically reseeding archives during archive or restore while the phase 013 live-and-archived repair scope conflicts with the upgrader's frozen-snapshot contract. Record the conflict and keep archive mutation opt-in until one policy is selected. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59]

### Copying frontmatter classification from `spec.md` into every sibling document without a document-type check. The goal template demonstrates that values differ across document classes. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/add-fm-fields.mjs:44] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:10] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:11] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Copying frontmatter classification from `spec.md` into every sibling document without a document-type check. The goal template demonstrates that values differ across document classes. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/add-fm-fields.mjs:44] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:10] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:11]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying frontmatter classification from `spec.md` into every sibling document without a document-type check. The goal template demonstrates that values differ across document classes. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/add-fm-fields.mjs:44] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:10] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:11]

### Filling missing plans, tasks, or summaries from generic current templates as if they recorded completed work. The packet spec requires history-backed reconstruction and an explicit note for reconstructed documents. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:76] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:102] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Filling missing plans, tasks, or summaries from generic current templates as if they recorded completed work. The packet spec requires history-backed reconstruction and an explicit note for reconstructed documents. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:76] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:102]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Filling missing plans, tasks, or summaries from generic current templates as if they recorded completed work. The packet spec requires history-backed reconstruction and an explicit note for reconstructed documents. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:76] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:102]

### Fixing only existing packet copies or adding a one-time corpus repair. That leaves the current template source emitting the same malformed section boundary for future packets. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1184] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Fixing only existing packet copies or adding a one-time corpus repair. That leaves the current template source emitting the same malformed section boundary for future packets. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1184]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Fixing only existing packet copies or adding a one-time corpus repair. That leaves the current template source emitting the same malformed section boundary for future packets. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1184]

### Putting a whole-corpus strict validation sweep in every local pre-commit. The current hook explicitly scopes checks around the staged change, while a separate scheduled workflow owns the whole-corpus report. No local runtime measurement was collected. [SOURCE: .opencode/scripts/git-hooks/pre-commit:4] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:3] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:13] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Putting a whole-corpus strict validation sweep in every local pre-commit. The current hook explicitly scopes checks around the staged change, while a separate scheduled workflow owns the whole-corpus report. No local runtime measurement was collected. [SOURCE: .opencode/scripts/git-hooks/pre-commit:4] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:3] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Putting a whole-corpus strict validation sweep in every local pre-commit. The current hook explicitly scopes checks around the staged change, while a separate scheduled workflow owns the whole-corpus report. No local runtime measurement was collected. [SOURCE: .opencode/scripts/git-hooks/pre-commit:4] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:3] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:13]

### Relying on --phase output to satisfy the same graph-metadata state as a normal root scaffold. The phase route exits before the normal route's backfill block, and the supplied graph sample shows empty derived values. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1919] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2006] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/graph-metadata.json.txt:13] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Relying on --phase output to satisfy the same graph-metadata state as a normal root scaffold. The phase route exits before the normal route's backfill block, and the supplied graph sample shows empty derived values. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1919] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2006] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/graph-metadata.json.txt:13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on --phase output to satisfy the same graph-metadata state as a normal root scaffold. The phase route exits before the normal route's backfill block, and the supplied graph sample shows empty derived values. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1919] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2006] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/graph-metadata.json.txt:13]

### Running a spec migration from doctor update check. Its contract allows no checkout writes and check has no persisted run record. [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:77] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Running a spec migration from doctor update check. Its contract allows no checkout writes and check has no persisted run record. [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:77]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running a spec migration from doctor update check. Its contract allows no checkout writes and check has no persisted run record. [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:77]

### Running full-corpus strict validation in every local pre-commit: it is not supported by measured runtime evidence and would duplicate scheduled reporting. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Running full-corpus strict validation in every local pre-commit: it is not supported by measured runtime evidence and would duplicate scheduled reporting.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running full-corpus strict validation in every local pre-commit: it is not supported by measured runtime evidence and would duplicate scheduled reporting.

### Summing all per-rule counts to estimate distinct failing packets. One missing Level 2 document pair is reported under both FILE_EXISTS and LEVEL_MATCH. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4080] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4083] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Summing all per-rule counts to estimate distinct failing packets. One missing Level 2 document pair is reported under both FILE_EXISTS and LEVEL_MATCH. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4080] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4083]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Summing all per-rule counts to estimate distinct failing packets. One missing Level 2 document pair is reported under both FILE_EXISTS and LEVEL_MATCH. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4080] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4083]

### Treating `description.json.specFolder` repair by itself as a complete path repair. The validator checks graph metadata and continuity pointers as well, so one field cannot clear the full mismatch class. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:99] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:102] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating `description.json.specFolder` repair by itself as a complete path repair. The validator checks graph metadata and continuity pointers as well, so one field cannot clear the full mismatch class. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:99] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:102]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `description.json.specFolder` repair by itself as a complete path repair. The validator checks graph metadata and continuity pointers as well, so one field cannot clear the full mismatch class. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:99] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:102]

### Treating a successful second apply as proof of rollback. The legacy upgrader's stepwise writes can converge after partial application, but no rollback record is visible in the inspected path. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:381] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:410] -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating a successful second apply as proof of rollback. The legacy upgrader's stepwise writes can converge after partial application, but no rollback record is visible in the inspected path. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:381] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:410]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a successful second apply as proof of rollback. The legacy upgrader's stepwise writes can converge after partial application, but no rollback record is visible in the inspected path. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:381] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:410]

### Treating builder-generated title, description, trigger phrases, or default classification as recovered historical metadata. The source derives them from present content and document type, not a historical template record. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:985] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1056] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating builder-generated title, description, trigger phrases, or default classification as recovered historical metadata. The source derives them from present content and document type, not a historical template record. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:985] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1056]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating builder-generated title, description, trigger phrases, or default classification as recovered historical metadata. The source derives them from present content and document type, not a historical template record. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:985] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1056]

### Treating every legacy validation finding as a pass without showing the baseline entries. The validator requires exact finding coverage and leaves unmatched details as errors. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:988] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1001] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating every legacy validation finding as a pass without showing the baseline entries. The validator requires exact finding coverage and leaves unmatched details as errors. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:988] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1001]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every legacy validation finding as a pass without showing the baseline entries. The validator requires exact finding coverage and leaves unmatched details as errors. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:988] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1001]

### Treating every older marker version as a validation failure. The migration contract explicitly keeps v2.1 marker support indefinitely and current validation checks presence only. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:56] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating every older marker version as a validation failure. The migration contract explicitly keeps v2.1 marker support indefinitely and current validation checks presence only. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:56]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every older marker version as a validation failure. The migration contract explicitly keeps v2.1 marker support indefinitely and current validation checks presence only. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:56]

### Treating marker-only edits as semantically neutral. Anchors define retrieval and generated-content boundaries, so a marker change can alter document structure even when natural-language prose stays untouched. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:687] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:692] -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating marker-only edits as semantically neutral. Anchors define retrieval and generated-content boundaries, so a marker change can alter document structure even when natural-language prose stays untouched. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:687] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:692]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating marker-only edits as semantically neutral. Anchors define retrieval and generated-content boundaries, so a marker change can alter document structure even when natural-language prose stays untouched. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:687] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:692]

### Treating markerless historical documents as current-template documents: marker absence does not prove creation version or author intent. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating markerless historical documents as current-template documents: marker absence does not prove creation version or author intent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating markerless historical documents as current-template documents: marker absence does not prove creation version or author intent.

### Treating the Claude 5.5 roster commits as direct spec-folder tooling changes. The commit paths are Claude runtime and roster files; retain them in the branch ledger but do not analyze them as causes of spec validation failures. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:49] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the Claude 5.5 roster commits as direct spec-folder tooling changes. The commit paths are Claude runtime and roster files; retain them in the branch ledger but do not analyze them as causes of spec validation failures. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:49]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the Claude 5.5 roster commits as direct spec-folder tooling changes. The commit paths are Claude runtime and roster files; retain them in the branch ledger but do not analyze them as causes of spec validation failures. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:49]

### Treating the phrase-cleanup tool as the sole source of empty-list behavior. A later legacy upgrade runs heal-spec-docs and can restore literal defaults to any already-empty supported field. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:129] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392] -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating the phrase-cleanup tool as the sole source of empty-list behavior. A later legacy upgrade runs heal-spec-docs and can restore literal defaults to any already-empty supported field. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:129] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the phrase-cleanup tool as the sole source of empty-list behavior. A later legacy upgrade runs heal-spec-docs and can restore literal defaults to any already-empty supported field. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:129] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392]

### Treating the push branch filter as a restriction on manual dispatch. The workflow lists branches under `push` only; `workflow_dispatch` has no branch pattern of its own. [SOURCE: .github/workflows/trigger-index-rebuild.yml:6] [SOURCE: .github/workflows/trigger-index-rebuild.yml:9] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating the push branch filter as a restriction on manual dispatch. The workflow lists branches under `push` only; `workflow_dispatch` has no branch pattern of its own. [SOURCE: .github/workflows/trigger-index-rebuild.yml:6] [SOURCE: .github/workflows/trigger-index-rebuild.yml:9]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the push branch filter as a restriction on manual dispatch. The workflow lists branches under `push` only; `workflow_dispatch` has no branch pattern of its own. [SOURCE: .github/workflows/trigger-index-rebuild.yml:6] [SOURCE: .github/workflows/trigger-index-rebuild.yml:9]

### Treating the registry's current ANCHORS_VALID description or the tests' expected failures as proof that the runtime enforces required anchor IDs and order. The called native implementation only checks the marker lists and the registry dispatcher suppresses a second rule for that ID. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:716] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:728] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1073] -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating the registry's current ANCHORS_VALID description or the tests' expected failures as proof that the runtime enforces required anchor IDs and order. The called native implementation only checks the marker lists and the registry dispatcher suppresses a second rule for that ID. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:716] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:728] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1073]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the registry's current ANCHORS_VALID description or the tests' expected failures as proof that the runtime enforces required anchor IDs and order. The called native implementation only checks the marker lists and the registry dispatcher suppresses a second rule for that ID. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:716] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:728] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1073]

### Treating track-root refresh as a replacement for updating the phase parent's children_ids. The phase-mode call refreshes the track, and the validation rule separately compares a phase parent's children_ids with its on-disk phase children. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1830] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:157] -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating track-root refresh as a replacement for updating the phase parent's children_ids. The phase-mode call refreshes the track, and the validation rule separately compares a phase parent's children_ids with its on-disk phase children. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1830] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:157]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating track-root refresh as a replacement for updating the phase parent's children_ids. The phase-mode call refreshes the track, and the validation rule separately compares a phase parent's children_ids with its on-disk phase children. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1830] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:157]

### Using an old or absent template-source marker by itself as proof that the whole repository needs migration. The documented policy keeps legacy markers readable indefinitely and treats marker normalization as unnecessary churn. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40] -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Using an old or absent template-source marker by itself as proof that the whole repository needs migration. The documented policy keeps legacy markers readable indefinitely and treats marker normalization as unnecessary churn. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using an old or absent template-source marker by itself as proof that the whole repository needs migration. The documented policy keeps legacy markers readable indefinitely and treats marker normalization as unnecessary churn. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40]

### Widening `repair-derived.cjs` to repair anchors or authored prose: those operations have structural or semantic effects and need separate evidence and undo. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Widening `repair-derived.cjs` to repair anchors or authored prose: those operations have structural or semantic effects and need separate evidence and undo.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Widening `repair-derived.cjs` to repair anchors or authored prose: those operations have structural or semantic effects and need separate evidence and undo.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Treating the Claude 5.5 roster commits as direct spec-folder tooling changes. The commit paths are Claude runtime and roster files; retain them in the branch ledger but do not analyze them as causes of spec validation failures. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:49] (iteration 1)
- Summing all per-rule counts to estimate distinct failing packets. One missing Level 2 document pair is reported under both FILE_EXISTS and LEVEL_MATCH. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4080] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/all-detail.txt:4083] (iteration 2)
- Fixing only existing packet copies or adding a one-time corpus repair. That leaves the current template source emitting the same malformed section boundary for future packets. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1184] (iteration 3)
- Treating `description.json.specFolder` repair by itself as a complete path repair. The validator checks graph metadata and continuity pointers as well, so one field cannot clear the full mismatch class. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:99] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs:102] (iteration 4)
- Automatically assigning the current version to a markerless legacy document. The absent marker does not establish which template, if any, produced the file. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh:167] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40] (iteration 5)
- Treating every older marker version as a validation failure. The migration contract explicitly keeps v2.1 marker support indefinitely and current validation checks presence only. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-template-source.sh:56] (iteration 5)
- Adding every anchor-related validation failure to `repair-derived.cjs`'s allow-list. That tool's boundary is repository facts that can be recomputed; duplicate and overlapping anchor choices can affect structure and references without enough evidence to infer intent. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:7] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs:59] [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/fix-dup-anchors.mjs:64] (iteration 6)
- Copying frontmatter classification from `spec.md` into every sibling document without a document-type check. The goal template demonstrates that values differ across document classes. [SOURCE: /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/bd2aa56c-623b-43f8-a2ef-69a13c32d626/scratchpad/add-fm-fields.mjs:44] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:10] [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:11] (iteration 7)
- Filling missing plans, tasks, or summaries from generic current templates as if they recorded completed work. The packet spec requires history-backed reconstruction and an explicit note for reconstructed documents. [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:76] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:102] (iteration 7)
- Using an old or absent template-source marker by itself as proof that the whole repository needs migration. The documented policy keeps legacy markers readable indefinitely and treats marker normalization as unnecessary churn. [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:24] [SOURCE: .skilled/skills/system-spec-kit/templates/MIGRATION.md:40] (iteration 8)
- Treating builder-generated title, description, trigger phrases, or default classification as recovered historical metadata. The source derives them from present content and document type, not a historical template record. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:935] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:985] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:1056] (iteration 9)
- Treating every legacy validation finding as a pass without showing the baseline entries. The validator requires exact finding coverage and leaves unmatched details as errors. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:988] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1001] (iteration 9)
- Adding specs/ migration writes to the current release-update apply plan and relying on release rollback. The current updater inventories .skilled and rejects rollback paths outside its release units. [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:338] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:2391] (iteration 10)
- Running a spec migration from doctor update check. Its contract allows no checkout writes and check has no persisted run record. [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:65] [SOURCE: .skilled/commands/doctor/assets/doctor-update-check.yaml:77] (iteration 10)
- Automatically reseeding archives during archive or restore while the phase 013 live-and-archived repair scope conflicts with the upgrader's frozen-snapshot contract. Record the conflict and keep archive mutation opt-in until one policy is selected. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:12] [SOURCE: specs/system-speckit/034-spec-folder-tooling/013-corpus-wide-validation-repair/spec.md:59] (iteration 11)
- Treating the phrase-cleanup tool as the sole source of empty-list behavior. A later legacy upgrade runs heal-spec-docs and can restore literal defaults to any already-empty supported field. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:129] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392] (iteration 11)
- Relying on --phase output to satisfy the same graph-metadata state as a normal root scaffold. The phase route exits before the normal route's backfill block, and the supplied graph sample shows empty derived values. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1919] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:2006] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/scaffold-sample/graph-metadata.json.txt:13] (iteration 12)
- Treating track-root refresh as a replacement for updating the phase parent's children_ids. The phase-mode call refreshes the track, and the validation rule separately compares a phase parent's children_ids with its on-disk phase children. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1830] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-graph-metadata-child-drift.sh:157] (iteration 12)
- Putting a whole-corpus strict validation sweep in every local pre-commit. The current hook explicitly scopes checks around the staged change, while a separate scheduled workflow owns the whole-corpus report. No local runtime measurement was collected. [SOURCE: .opencode/scripts/git-hooks/pre-commit:4] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:3] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:13] (iteration 13)
- Treating the push branch filter as a restriction on manual dispatch. The workflow lists branches under `push` only; `workflow_dispatch` has no branch pattern of its own. [SOURCE: .github/workflows/trigger-index-rebuild.yml:6] [SOURCE: .github/workflows/trigger-index-rebuild.yml:9] (iteration 13)
- Treating a successful second apply as proof of rollback. The legacy upgrader's stepwise writes can converge after partial application, but no rollback record is visible in the inspected path. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:381] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:410] (iteration 14)
- Treating marker-only edits as semantically neutral. Anchors define retrieval and generated-content boundaries, so a marker change can alter document structure even when natural-language prose stays untouched. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:687] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:692] (iteration 14)
- Treating the registry's current ANCHORS_VALID description or the tests' expected failures as proof that the runtime enforces required anchor IDs and order. The called native implementation only checks the marker lists and the registry dispatcher suppresses a second rule for that ID. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:716] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:728] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1073] (iteration 14)
- Running full-corpus strict validation in every local pre-commit: it is not supported by measured runtime evidence and would duplicate scheduled reporting. (iteration 15)
- Treating markerless historical documents as current-template documents: marker absence does not prove creation version or author intent. (iteration 15)
- Widening `repair-derived.cjs` to repair anchors or authored prose: those operations have structural or semantic effects and need separate evidence and undo. (iteration 15)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- All five key questions remain open. (iteration 1)
- Q3: How should an older or pre-v4 repo be detected and migrated or healed safely, and how does that fit /doctor:update? (iteration 2)
- Q1: Which one-off repair fixes should become permanent idempotent tooling, and where should each live? (iteration 2)
- Q2: What causes each validation failure class at the source, and how do we stop new instances? (iteration 2)
- Q5: Which checks belong in CI or pre-commit so drift is caught early and cheaply? (iteration 2)
- Q4: What should be hardened in this branch's own changes: the CI rebuild job, the cleanup tools, the seeder, the Gate 3 wording and the token push? (iteration 2)
- Final: Rank the recommendations across Q1 to Q5 and synthesize the research. (iteration 14)
- Q4: The branch hardening findings are assembled across iterations 11 to 14; rank the final changes and reconcile the unresolved archive policy. (iteration 14)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
The lead brief lists ten branch commits, phases 006 through 013, and a live phase 013 repair spanning 4,371 packets. It identifies one-off repair scripts, validator rules, templates, `/doctor:update`, and CI workflows as evidence sources. Treat the reported repair counts and causes as hypotheses until independently checked against the cited source. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:37] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:53]

### Bounded Context Snapshot

Keep this pointer-based and small:

- Source pointers: `.skilled/skills/system-spec-kit/runtime/cli/spec/`, `.skilled/skills/system-spec-kit/references/validation/`, `.skilled/skills/system-spec-kit/templates/`, `.skilled/commands/doctor/`, and `.github/workflows/`. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:65] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:72]
- Reuse candidates: `repair-derived.cjs`, `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, `create.sh`, and the template migration contract. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:65] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:69]
- Integration points: `/doctor:update`, `/doctor:speckit`, `validate.sh`, `archive.sh`, trigger-index rebuild workflow, and changed-packet validation workflow. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:67] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:72]
- Constraints and risks: write only inside this lineage; treat other `specs/` paths as concurrently edited; cite committed content from `HEAD` where possible. [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:11] [SOURCE: specs/system-speckit/034-spec-folder-tooling/014-spec-auto-healing-research/research/lineages/codex-luna-6-max-fast/steer.md:74]

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 15
- Convergence threshold: 0.05, telemetry only under max-iterations stop policy
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true, with no early terminal synthesis
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-07T21:09:36Z
