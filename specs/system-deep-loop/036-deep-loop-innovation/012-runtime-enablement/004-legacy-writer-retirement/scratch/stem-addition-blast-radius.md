---
title: "Why the surviving direct appends cannot be routed yet"
trigger_phrases: []
---
# Why the surviving direct appends cannot be routed yet

## The question

Four open items reduce to one thing: the embedded lifecycle writers append
records like `run_now_restored`, `run_now_accepted`, `run_now_rejected` and the
pause sentinels straight to the state log, because the mode's ledger schema has
no registered stem for them and the gateway would reject them.

The obvious fix is to add those stems. That was previously set aside as
belonging to the schema's own phase — a scope judgement, not a measured one.
Unlike the authority cutover it moves no authority and is reversible, so the
safety argument used there does not apply and it deserved a real answer.

## The measured answer: adding a stem breaks projection for every existing ledger

A ledger records the registry digest it was created under. The gateway compares
them on every append, at `lib/mode-append-gateway/append-mode-event.ts:416`:

```
} else if (eventRegistry.digest !== options.ledger.registryDigest) {
  projectionRefreshed = false;
  projectionError = `Event registry digest mismatch for mode ${options.mode}`;
```

Adding a stem changes the registry digest. Every ledger created under the old
digest then mismatches.

## The failure mode is silent, which is what makes it serious

A mismatch does **not** fail the write. The existing test at
`tests/unit/mode-append-gateway.vitest.ts:349`, "projection failure: succeeds
with stale projection marker and explicit error", asserts exactly this:

- `result.ok` is `true`
- `receipt.sequence` is `1` — the event is durable in the ledger
- `projectionRefreshed` is `false`
- `projectionError` is `Event registry digest mismatch for mode deep-research`

So after a stem is added, existing runs keep accepting writes and report success
while their legacy state file quietly stops being refreshed. The file goes stale
with nothing surfacing it at the call site.

That is precisely the silent divergence this whole effort exists to prevent, and
it lands on the file the enablement work has been careful to keep readable
because its consumers still depend on it.

## What routing those records actually requires

Not a stem addition. A migration:

1. Version the registry, or re-key existing ledgers' `registryDigest`, so a
   schema addition does not orphan ledgers already on disk.
2. Decide what happens to in-flight runs whose ledger predates the change.
3. Make a projection mismatch loud at the call site rather than a field on a
   successful result, so a stale projection cannot pass for a healthy write.

Step 3 is arguably worth doing on its own merits, independently of any stem.

## Status of the four items

They stay blocked, now on a mechanism with a citation rather than on a scope
boundary. The blocker is not "another phase owns this" — it is that the cheap
version of the fix breaks the legacy files six consumers read, silently, and the
safe version is a migration nobody has specified.
