## DELIVERABLE 1

File target: `AGENTS.md`

Before:
```md
#### GATE 3: SPEC FOLDER QUESTION [HARD] BLOCK - PRIORITY GATE
- **Overrides Gates 1-2:** If file modification detected → ask Gate 3 BEFORE any analysis/tool calls
- **Machine contract:** `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` (`classifyPrompt()`). The prose lists below are human-readable; the classifier module is authoritative for runtimes that call it.
- **Positive triggers (write actions):** create, add, remove, delete, rename, move, update, change, modify, edit, fix, patch, refactor, rewrite, implement, build, write, generate, configure
- **Positive triggers (continuity writes):** `save context`, `save memory`, `/memory:save`, `/speckit:resume`, `resume iteration`, `resume deep research`, `resume deep review`, `continue iteration` (these produce `description.json` / `graph-metadata.json` / continuity frontmatter / `iteration-NNN.md` writes)
- **Read-only disqualifiers:** `review`, `audit`, `inspect`, `analyze`, `explain` — suppress Gate 3 when they appear ALONE (e.g. "review the decomposition phase"). Do NOT suppress when a continuity-write trigger is also present.
- **Note:** tokens `analyze`, `decompose`, `phase` are NOT positive triggers; they false-positive on read-only review prompts.
- **Options:** A) Existing | B) New | C) Update related | D) Skip | E) Phase folder (e.g., `specs/NNN-name/001-phase/`)
- **Router commands:** For router-style commands such as `/doctor`, evaluate Gate 3 per selected route. The route manifest/table must expose each target's location and mutation class before asking or acting:
  - `read-only` routes may inspect and report without a spec-folder write path.
  - `add-only` routes may create scoped logs, snapshots, or evidence after Gate 3 is satisfied.
  - `mutates` routes require the same spec-folder discipline as any other file/database mutation.
- **Ask first, then act.** No Read/Edit/Write/Bash (except Gate Actions) before answer. The answer applies for the ENTIRE session — re-ask ONLY when user says "new task" / "different feature" / names a different spec folder, or asks you to re-ask.

#### VIOLATION RECOVERY [SELF-CORRECTION]
Trigger: About to skip gates, or realized gates were skipped → STOP → STATE: "Before I proceed, I need to ask about documentation:" → ASK Gate 3 (A/B/C/D/E) → WAIT
- **Exception:** If the user already answered Gate 3 earlier in this conversation for the same task, do NOT re-ask. Reuse the existing answer and proceed.
```

After:
```md
#### GATE 3: SPEC FOLDER QUESTION [HARD] BLOCK - PRIORITY GATE
- **Overrides Gates 1-2:** If file modification detected → ask Gate 3 BEFORE any analysis/tool calls unless the autonomous-precedence bridge below has already satisfied Gate 3 for this command-scoped run.
- **Machine contract:** `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` (`classifyPrompt()`). The prose lists below are human-readable; the classifier module is authoritative for runtimes that call it.
- **Positive triggers (write actions):** create, add, remove, delete, rename, move, update, change, modify, edit, fix, patch, refactor, rewrite, implement, build, write, generate, configure
- **Positive triggers (continuity writes):** `save context`, `save memory`, `/memory:save`, `/speckit:resume`, `resume iteration`, `resume deep research`, `resume deep review`, `continue iteration` (these produce `description.json` / `graph-metadata.json` / continuity frontmatter / `iteration-NNN.md` writes)
- **Read-only disqualifiers:** `review`, `audit`, `inspect`, `analyze`, `explain` — suppress Gate 3 when they appear ALONE (e.g. "review the decomposition phase"). Do NOT suppress when a continuity-write trigger is also present.
- **Note:** tokens `analyze`, `decompose`, `phase` are NOT positive triggers; they false-positive on read-only review prompts.
- **Options:** A) Existing | B) New | C) Update related | D) Skip | E) Phase folder (e.g., `specs/NNN-name/001-phase/`)
- **Autonomous precedence bridge:** A command-scoped run has already answered Gate 3 when ALL are true: the command contract declares autonomous execution; its setup flow has bound a valid `spec_folder` from flags, a `PRE-BOUND SETUP ANSWERS:` block, or target-path/spec-folder resolution; and the run remains inside that command's declared write boundary. Treat that binding as the Gate-3 answer for this run. Do NOT emit the generic A-E prompt. If autonomous setup cannot bind ownership, follow the command contract's targeted-ask/fail-fast path; do not fall back to the generic A-E prompt.
- **Router commands:** For router-style commands such as `/doctor`, evaluate Gate 3 per selected route. The route manifest/table must expose each target's location and mutation class before asking or acting:
  - `read-only` routes may inspect and report without a spec-folder write path.
  - `add-only` routes may create scoped logs, snapshots, or evidence after Gate 3 is satisfied.
  - `mutates` routes require the same spec-folder discipline as any other file/database mutation.
- **Ask first, then act.** In interactive sessions with unknown ownership, no Read/Edit/Write/Bash (except Gate Actions) before answer. The answer applies for the ENTIRE session — re-ask ONLY when user says "new task" / "different feature" / names a different spec folder, or asks you to re-ask.

#### VIOLATION RECOVERY [SELF-CORRECTION]
Trigger: About to skip gates, or realized gates were skipped → STOP → STATE: "Before I proceed, I need to ask about documentation:" → ASK Gate 3 (A/B/C/D/E) → WAIT
- **Exception:** If the user already answered Gate 3 earlier in this conversation for the same task, OR an autonomous command contract has validly bound a spec folder for the current run, do NOT re-ask. Reuse the existing/bound answer and proceed within scope.
```

## DELIVERABLE 2

File target: `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`

Signature sketch:
```ts
export type ExecutionMode = 'AUTONOMOUS' | 'INTERACTIVE' | 'ASK';

export type SpecFolderBindingSource =
  | 'flags'
  | 'pre_bound_setup_answers'
  | 'target_path_resolution'
  | 'prior_answer';

export type Gate3SatisfiedBy = 'prebound_spec_folder' | 'prior_answer' | null;

export interface BoundSpecFolder {
  path: string;
  source: SpecFolderBindingSource;
  validated: boolean;
}

export interface CommandContract {
  declaresAutonomousExecution: boolean;
  ownsSpecFolderSetup: boolean;
  allowedSpecFolderSources: readonly Exclude<SpecFolderBindingSource, 'prior_answer'>[];
  writeBoundary?: string;
}

export interface ClassificationOptions {
  executionMode?: ExecutionMode;
  boundSpecFolder?: BoundSpecFolder | null;
  commandContract?: CommandContract | null;
}

export interface ClassificationResult {
  triggersGate3: boolean;
  requiresGate3Prompt: boolean;
  satisfiedBy: Gate3SatisfiedBy;
  reason: 'file_write_match' | 'memory_save_match' | 'resume_match' | 'read_only_override' | 'no_match';
  matched: TriggerEntry[];
  readOnlyMatched: TriggerEntry[];
}

export function classifyPrompt(prompt: string, options: ClassificationOptions = {}): ClassificationResult;
```

Satisfaction rule:
```ts
const satisfiedBy =
  core.triggersGate3 && options.boundSpecFolder?.validated && options.boundSpecFolder.source === 'prior_answer'
    ? 'prior_answer'
    : core.triggersGate3
      && options.executionMode === 'AUTONOMOUS'
      && options.commandContract?.declaresAutonomousExecution
      && options.commandContract.ownsSpecFolderSetup
      && options.boundSpecFolder?.validated
      && options.commandContract.allowedSpecFolderSources.includes(options.boundSpecFolder.source)
        ? 'prebound_spec_folder'
        : null;

return {
  ...core,
  triggersGate3: core.triggersGate3,
  requiresGate3Prompt: core.triggersGate3 && satisfiedBy === null,
  satisfiedBy,
};
```

Tests:
```ts
// autonomous + bound -> triggered but satisfied
classifyPrompt('/deep:review specs/123-x :auto', {
  executionMode: 'AUTONOMOUS',
  boundSpecFolder: { path: 'specs/123-x', source: 'target_path_resolution', validated: true },
  commandContract: { declaresAutonomousExecution: true, ownsSpecFolderSetup: true, allowedSpecFolderSources: ['flags', 'pre_bound_setup_answers', 'target_path_resolution'] },
});
// expect: { triggersGate3: true, requiresGate3Prompt: false, satisfiedBy: 'prebound_spec_folder' }

// autonomous + unbound -> triggered
classifyPrompt('/deep:review :auto', {
  executionMode: 'AUTONOMOUS',
  boundSpecFolder: null,
  commandContract: { declaresAutonomousExecution: true, ownsSpecFolderSetup: true, allowedSpecFolderSources: ['flags', 'pre_bound_setup_answers', 'target_path_resolution'] },
});
// expect: { triggersGate3: true, requiresGate3Prompt: true, satisfiedBy: null }

// interactive write -> triggered
classifyPrompt('fix the parser bug', { executionMode: 'INTERACTIVE' });
// expect: { triggersGate3: true, requiresGate3Prompt: true, satisfiedBy: null }

// read-only research -> not triggered
classifyPrompt('READ-ONLY RESEARCH TASK: analyze Gate 3; no file writes', { executionMode: 'INTERACTIVE' });
// expect: { triggersGate3: false, requiresGate3Prompt: false, satisfiedBy: null }

// prior answer -> triggered but satisfied
classifyPrompt('save context', {
  executionMode: 'INTERACTIVE',
  boundSpecFolder: { path: 'specs/123-x', source: 'prior_answer', validated: true },
});
// expect: { triggersGate3: true, requiresGate3Prompt: false, satisfiedBy: 'prior_answer' }

// interactive confirm with prebound marker -> still asks
classifyPrompt('/deep:review:confirm PRE-BOUND SETUP ANSWERS:\n  spec_folder: specs/123-x', {
  executionMode: 'INTERACTIVE',
  boundSpecFolder: { path: 'specs/123-x', source: 'pre_bound_setup_answers', validated: true },
  commandContract: { declaresAutonomousExecution: true, ownsSpecFolderSetup: true, allowedSpecFolderSources: ['flags', 'pre_bound_setup_answers', 'target_path_resolution'] },
});
// expect: { triggersGate3: true, requiresGate3Prompt: true, satisfiedBy: null }
```

## DELIVERABLE 3

File target: `.opencode/skills/system-spec-kit/references/workflows/autonomous_execution_profile.md`

Before:
```md
```

After:
```md
# Autonomous Execution Profile Prelude

1. Command contract controls this command-scoped run; repo policy applies inside it.
2. Write only within the resolved command artifact/spec folder and declared targets.
3. Read a target before editing it.
4. Preserve scope lock: no adjacent cleanup or opportunistic changes.
5. If the contract binds a valid spec folder, do not ask documentation/Gate-3 questions.
6. If code changes, run the command's required verification before completion claims.
7. Halt on missing/ambiguous ownership, unresolved required inputs, conflicts, or failed verification.
8. Return the command's declared output artifact/report format.
```
