---
title: "107 -- Checkpoint confirmName and schema enforcement"
description: "This scenario validates Checkpoint confirmName and schema enforcement for `107`. It focuses on Confirm delete safety is required across handler and validation layers."
version: 3.6.0.17
id: ux-hooks-checkpoint-confirmname-and-schema-enforcement
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 107 -- Checkpoint confirmName and schema enforcement

## 1. OVERVIEW

This scenario validates Checkpoint confirmName and schema enforcement for `107`. It focuses on Confirm delete safety is required across handler and validation layers.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm delete safety is required across handler and validation layers.
- Real user request: `` Please validate Checkpoint confirmName and schema enforcement against npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts and tell me whether the expected signals are present: Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting. Additionally, `tests/context-server.vitest.ts` Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement. ``
- Prompt: `Validate checkpoint confirmName and schema enforcement across handler, schema, input-validation, and context-server tests.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting. Additionally, `tests/context-server.vitest.ts` Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the three suites plus `context-server.vitest.ts` Group 13b pass and prove required `confirmName` enforcement end to end

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm delete safety is required across handler and validation layers against npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts. Verify validation and handler suites pass with missing-confirmName rejection plus successful delete confirmation reporting. context-server.vitest.ts Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts`
2. `npx vitest run tests/context-server.vitest.ts` (Group 13b: T103–T106 structural source-code pattern verification)
3. inspect rejection assertions for missing `confirmName`
4. inspect success assertions for `safetyConfirmationUsed=true`

### Expected

Validation and handler suites pass with missing-`confirmName` rejection plus successful delete confirmation reporting. `context-server.vitest.ts` Group 13b structural tests (T103–T106) verify source-code patterns for checkpoint confirmName enforcement

### Evidence

Command 1, run from `.opencode/skills/system-spec-kit/mcp-server`:

```text
$ npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/mcp-input-validation.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:1154) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  3 passed (3)
      Tests  144 passed (144)
   Start at  00:50:06
   Duration  2.06s (transform 1.24s, setup 21ms, import 210ms, tests 1.64s, environment 0ms)
```

Command 2, run from `.opencode/skills/system-spec-kit/mcp-server`:

```text
$ npx vitest run tests/context-server.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  391 passed (391)
   Start at  00:50:06
   Duration  958ms (transform 491ms, setup 15ms, import 109ms, tests 767ms, environment 0ms)
```

Assertion snippets inspected:

```text
tests/handler-checkpoints.vitest.ts:507-514
    it('T521-DEL3: Missing confirmName throws', async () => {
      await expect(
        handler.handleCheckpointDelete(
          invalidArgs<Parameters<typeof handler.handleCheckpointDelete>[0]>({
            name: 'checkpoint-without-confirm',
          }),
        ),
      ).rejects.toThrow(/confirmName.*required/);

tests/handler-checkpoints.vitest.ts:523-533
    it('T521-DEL5: Matching confirmName deletes checkpoint and reports safety confirmation', async () => {
      const spy = vi.spyOn(checkpointStorageMod, 'deleteCheckpoint').mockReturnValue(true);
      try {
        const result = await handler.handleCheckpointDelete({
          name: 'safe-delete',
          confirmName: 'safe-delete',
        });
        expect(result.isError).toBeFalsy();
        const parsed = JSON.parse(result.content[0].text);
        expect(parsed.data?.success).toBe(true);
        expect(parsed.data?.safetyConfirmationUsed).toBe(true);

tests/tool-input-schema.vitest.ts:588-597
  it('requires confirmName at schema level', () => {
    expect(() => {
      validateToolInputSchema('checkpoint_delete', { name: 'danger-zone' }, TOOL_DEFINITIONS);
    }).toThrow(/Missing required arguments.*confirmName/);
  });

  it('accepts matching name + confirmName payload shape', () => {
    expect(() => {
      validateToolInputSchema('checkpoint_delete', { name: 'danger-zone', confirmName: 'danger-zone' }, TOOL_DEFINITIONS);
    }).not.toThrow();

tests/mcp-input-validation.vitest.ts:119-123
  {
    tool: 'checkpoint_delete',
    handler: 'handleCheckpointDelete',
    invalidArgs: { name: 'checkpoint-without-confirm' },
    description: 'missing required confirmName string',

tests/context-server.vitest.ts:2745-2776
  describe('Group 13b: checkpoint_delete confirmName safety', () => {
    it('T103: checkpoint_delete requires confirmName in schema', () => {
      expect(toolSchemasCode).toMatch(/checkpoint_delete[\s\S]*?required.*confirmName/)
    })

    it('T104: checkpoint_delete handler rejects missing confirmName', () => {
      const handlerFile = fs.readFileSync(
        path.join(SERVER_DIR, 'handlers', 'checkpoints.ts'),
        'utf8'
      )
      expect(handlerFile).toMatch(/confirmName.*required.*must be a string/)
    })

    it('T105: checkpoint_delete handler rejects mismatched confirmName', () => {
      const handlerFile = fs.readFileSync(
        path.join(SERVER_DIR, 'handlers', 'checkpoints.ts'),
        'utf8'
      )
      expect(handlerFile).toMatch(/confirmName must exactly match name/)
    })

    it('T106: checkpoint_delete proceeds when confirmName matches name', () => {
      const handlerFile = fs.readFileSync(
        path.join(SERVER_DIR, 'handlers', 'checkpoints.ts'),
        'utf8'
      )
      // After confirmName validation, deleteCheckpoint is called
      const confirmCheck = handlerFile.indexOf('confirmName must exactly match name')
      const deleteCall = handlerFile.indexOf('deleteCheckpoint(name')
      expect(confirmCheck).toBeGreaterThan(-1)
      expect(deleteCall).toBeGreaterThan(-1)
      expect(deleteCall).toBeGreaterThan(confirmCheck)
```

### Pass / Fail

- **PASS**: the three suites passed (`3 passed`, `144 passed`) and `context-server.vitest.ts` passed (`1 passed`, `391 passed`); inspected assertions prove required `confirmName` rejection and `safetyConfirmationUsed=true` reporting, with Group 13b T103-T106 structural checks present.

### Failure Triage

Inspect checkpoint handler, schemas, tool typing alignment, and context-server structural test expectations

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [ux-hooks/checkpoint-delete-confirmname-safety.md](../../feature-catalog/ux-hooks/checkpoint-delete-confirmname-safety.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 107
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ux-hooks/checkpoint-confirmname-and-schema-enforcement.md`
- audited_post_018: true
