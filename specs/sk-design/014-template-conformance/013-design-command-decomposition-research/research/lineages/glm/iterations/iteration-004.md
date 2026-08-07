# Iteration 004 — Machine Constraint Deep Dive: What a Split Must Satisfy

**Focus:** Examine the four hard-binding constraints in `design-command-surface-check.mjs` to understand exactly what wiring a new command requires, and whether the current 2-command topology is at a constraint complexity minimum.

## Evidence

Read `design-command-surface-check.mjs` at the four cited constraint sites and the surrounding validation logic.

### Constraint 1: `next` must be non-empty [surface-check.mjs:357-361]

```javascript
for (const field of ["aliases", "next", "proofFields"]) {
  if (!isNonEmptyStringArray(record?.[field])) {
    errors.push(`${command}: ${field} must be a non-empty string array`);
  }
}
```

Every command must declare at least one `next` command. Currently:
- `/interface:design` → `next: ["/interface:design-reference"]` [metadata:107-109]
- `/interface:design-reference` → `next: ["/interface:design"]` [metadata:478-480]

They form a 2-cycle. Adding a third command breaks this simple cycle: the new command must point to at least one existing command, and at least one existing command should point to it (otherwise it is unreachable via `next`).

### Constraint 2: `preferSiblingWhen` must cover exactly the derived sibling set [surface-check.mjs:916-918]

```javascript
if (!sameSet(seenSiblings, expectedSiblings)) {
  errors.push(`${command}: discriminator.preferSiblingWhen must cover exactly ${[...expectedSiblings].sort().join(",")}`);
}
```

`expectedSiblings` is derived from all other commands in the registry. Adding a command means EVERY existing command's `preferSiblingWhen` must be updated to include the new command. Currently each command has exactly 1 sibling entry (the other command) plus the `design-mcp-open-design` no-command transport. Adding a 3rd command means:
- `/interface:design` gets a new sibling entry (the 3rd command)
- `/interface:design-reference` gets a new sibling entry (the 3rd command)
- The 3rd command gets 2 sibling entries

This is **N-1 sibling entries per command**, growing linearly with command count.

### Constraint 3: `typicallyBefore` must subset `next` [surface-check.mjs:978-984]

```javascript
if (isStringArray(sequence.typicallyBefore) && Array.isArray(record?.next)) {
  const nextSet = new Set(record.next);
  for (const item of sequence.typicallyBefore) {
    if (!nextSet.has(item)) {
      errors.push(`${command}: discriminator.sequence.typicallyBefore must be a subset of next`);
    }
  }
}
```

Currently `/interface:design-reference` has `typicallyBefore: ["/interface:design"]` [metadata:538-540] and `next: ["/interface:design"]` [metadata:478-480] — a subset. Adding a command that should run before `/interface:design` means it must also be in `next`. This constrains the pipeline graph: `typicallyBefore` cannot introduce edges that `next` doesn't already declare.

### Constraint 4: `handoff.nextOptions` must match `next` exactly [surface-check.mjs:1245-1249]

```javascript
if (!Array.isArray(record?.next)) {
  errors.push(`${command}: handoff.nextOptions cannot be checked until next is a string array`);
} else if (!sameValue(optionCommands, record.next)) {
  errors.push(`${command}: handoff.nextOptions commands must match next exactly`);
}
```

Every command in `next` must have a corresponding `handoff.nextOptions` entry with a `when` clause, and vice versa. Currently:
- `/interface:design` → `next: ["/interface:design-reference"]`, `handoff.nextOptions: [{command: "/interface:design-reference", when: "..."}]` [metadata:107-119]
- `/interface:design-reference` → `next: ["/interface:design"]`, `handoff.nextOptions: [{command: "/interface:design", when: "..."}]` [metadata:478-490]

Adding a command means every command that lists it in `next` must also write a `when` clause explaining when to hand off to it. This is **content authoring**, not just wiring — each `when` clause must be a meaningful, non-empty string [surface-check.mjs:911-913].

## Constraint complexity analysis

The current 2-command topology is at a **constraint complexity minimum**:
- Each command has exactly 1 `next`, 1 `preferSiblingWhen` sibling, 0-1 `typicallyBefore`, 1 `handoff.nextOptions`.
- The graph is a simple 2-cycle with no branching.

Adding a 3rd command:
- Each existing command gains 1 `next` entry, 1 `preferSiblingWhen` entry, potentially 1 `typicallyBefore` entry, 1 `handoff.nextOptions` entry with a `when` clause.
- The new command has 2 `next` entries, 2 `preferSiblingWhen` entries, 0-2 `typicallyBefore`, 2 `handoff.nextOptions` with `when` clauses.
- Total new constraint-satisfying edits: ~12 field updates across 3 command records, each requiring a meaningful `when` string.

The test file `interface-command-contract.test.mjs:10-13` has an `EXPECTED` array that hardcodes the 2-command surface. Adding a command means updating `EXPECTED` [test:10-13], adding a `loadSurface` call [test:101-110], and the test automatically checks all 8 `VISIBLE_BLOCKS` across 4 surface files [test:52-61] — so 4 new files × 8 blocks = 32 new assertions that must pass.

## What was tried and failed

- Checked whether the `design-mcp-open-design` transport (no command, `command: null` [registry:91]) could absorb a split without adding a public command. It cannot: `command: null` means it has no public surface, no `next`, no `handoff.nextOptions`. It is deliberately outside the command graph. A split must add public commands, not transports.

## Novelty justification

First constraint-by-constraint analysis of what the machine checks enforce. The finding that the 2-command topology is at a constraint complexity minimum is new. newInfoRatio: 0.85 (substantially new — constraint mechanics not previously examined).

[SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:357-361,916-918,978-984,1245-1249]
[SOURCE: .opencode/skills/sk-design/command-metadata.json:107-119,478-490]
[SOURCE: .opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs:10-13,52-61,101-110]
[SOURCE: .opencode/skills/sk-design/mode-registry.json:91]
