Review complete. Findings below, each with file, the offending fragment, a concrete triggering sequence, and the blast radius.

---

## P0 / P1 — Completed-mode record is destructively overwritten on resume (Attack #1, #4)

**File:** `enablement-driver.ts`, inside `runFleetEnablement`:

```ts
const completedModes: CutoverCertificateMode[] = [];   // <-- fresh array
...
if (outcome.ok) {
  completedModes.push(mode);
  save(completedModes, null);                            // persists ONLY this run's list
}
```

and `skippedModes`/`prior.completedModes` are read into `skipped` for planning but never merged back into what `save()` writes.

**Trigger:** Run A moves authority for `deep-review` (state file: `completedModes: ["deep-review"]`). Crash before the driver gets past that. Run B under `--resume` skips `deep-review`, completes the next mode (`council`), calls `save(completedModes, null)` → the file now reads `completedModes: ["council"]`. `deep-review`'s completion is gone from the durable ledger.

**Outcome:** A third run has no record that `deep-review` moved authority, re-plans it, re-runs `runStep(deep-review)` — `registry.read()` now returns a ledger state, not `cutover_ready`, so the flip check fails and the run is permanently stuck (CAS will not re-move it). A mode's completion is lost and the run becomes unresumable. The CLI's `completedModes`/`skippedModes` output on any subsequent failure is also wrong for the same reason.

**Caveat on severity:** Under the *current* frozen facts (`no code path moves any mode to cutover_ready`), `completedModes` stays empty and the save never fires, so this is latent today. The moment a real transition is wired in — which is the entire purpose of this tool and its stated resumability guarantee — it becomes live. Rank P1 today, P0 in effect.

---

## P1 — `registry.read(mode)` can throw and abort the whole run (Attack #6)

**File:** `enable-modes.cjs`, `buildRunStep`:

```ts
let surfaces = null;
try {
  surfaces = deriveModeSurfaceSet(mode);
} catch (error) { ... return { ok: false, failedCheck: 'reader-contract', ... }; }

if (surfaces.surfaceIds.length === 0) { ... return { ok: false, ... }; }

const record = registry.read(mode);          // <-- OUTSIDE the try
if (record.state !== 'cutover_ready') { ... }
```

`read()` throws on a malformed on-disk authority record (a stated external fact). That throw is not caught in `runStep`, so it propagates out of `runFleetEnablement`, `main()`, and lands in `main().catch` → `RUNTIME_ERROR`, exit 1, whole run aborted.

**Trigger:** one mode's authority file is corrupted; earlier modes already moved authority and were persisted. The run should stop cleanly at the named mode (`failedCheck`) and persist the failure; instead the entire run aborts with an uncaught error, and the interrupted mode's failure is never recorded in the state file.

---

## P1 — Manifest entry attributed to two modes (Attack #5)

**File:** `mode-surface-map.ts`, `SURFACE_PREFIX_OWNERSHIP`:

```ts
'deep-improvement-common': ['improvement-'],
'agent-improvement':       ['improvement-'],
```

**Trigger:** any real manifest entry with `surfaceId` starting `improvement-` (e.g. `improvement-scheduler`) matches the `improvement-` prefix for *both* `deep-improvement-common` and `agent-improvement`. `deriveModeSurfaceSet` returns it under both modes, so both modes claim ownership of the same surface and (per-mode) each could CAS-move authority over it. `sharedWith`'s `===` prefix comparison correctly *detects* the collision (that's why it's the only overlapping pair) but does not resolve it — two modes still own one surface.

Secondary half: a manifest entry whose `surfaceId` matches *none* of the eight prefix families (e.g. a `harness-…` or `dataset-…` surface) is attributed to **no** mode; `deriveAllModeSurfaceSets` union silently omits it, and nothing flags orphaned entries — only each mode's *own* emptiness is checked.

---

## P2 — Non-atomic state write (Attack #1, shared-path)

**File:** `enablement-driver.ts`, `persistState`:

```ts
mkdirSync(dirname(statePath), { recursive: true });
writeFileSync(statePath, raw);
```

Direct `writeFileSync`, no temp-file + rename. A crash or a second concurrent invocation mid-write leaves a truncated/corrupt JSON file; every later read then throws `not valid JSON` → `RUNTIME_ERROR`, permanently blocking resume. Also enables the two-runs-sharing-a-path clobber without any file locking.

---

## P2 — Resume "must be a decision" enforced only in the CLI (Attack #3)

`runFleetEnablement` is a public export and does the implicit resume itself from `prior.completedModes` — it never requires/checks any `resume` signal. The "resuming must be a decision" policy exists only in `enable-modes.cjs`'s `RESUME_NOT_REQUESTED` gate. Any programmatic caller that imports the library resumes silently. It honors the *skip-what's-completed* intent, so it won't re-run moved authority, but the operator-decision gate is bypassable at the library boundary.

Also on the "refuses an allowed run" side: a prior state with `failure: null` and *all* modes completed still triggers `RESUME_NOT_REQUESTED` (exit 1) for a re-run that is genuinely a no-op.

---

## P2 — Real run mutates the authority dir even when it will do nothing (Attack #2 variant)

`new AuthorityRegistry(authorityRoot)` does `mkdir -p` in its constructor and runs *before* any mode executes. If `plannedModes` is empty (everything already completed) the driver does zero work but the constructor has still created/modified the authority-state directory. Bounded side effect only.

---

## Properties I tried to break and could not

- **Dry run touches nothing (Attack #2):** holds. In the dry-run branch `authorityRoot` is never `resolveAuthorityRoot`'d, `AuthorityRegistry` is never imported or constructed, the injected `runStep` (which throws) is never invoked because the driver returns before the loop, and the only call reaching disk is `readEnablementState`'s `readFileSync`. I could not find a dry-run write path.
- **CAS prevents double-enable:** the flip check runs before any mutation and only passes on `cutover_ready`, so a re-run of an already-flipped mode fails rather than double-moves. This is what turns the P0/P1 resume bug into "stuck," not "moved twice."
- **Argument parsing (Attack #7):** `--state --dry-run`, `--state=foo`, `--state` trailing, stray positionals, `--dry-run <value>` all fail loudly with the documented exit codes. I found no accepted-but-wrong invocation; the casing helper and the two-pass parse/validate hold up.

---

## Guards that cannot fail (Attack #8)

- `enable-modes.cjs` dry-run `runStep = async () => { throw … }` is dead: the driver's dry-run branch returns before the loop, so nothing can call it. Harmless, but the "must never be called" guarantee is unexercised.
- The entire all-complete success path (`ok: true`, `failure: null`, full `completedModes` emission) is **unreachable** in this deployment: with no path ever setting `cutover_ready`, `runStep` can only ever return `flip` failure, so the CLI's success branch is perma-dead. Any future "the run reported success" claim would already be suspect.

---

Net: the two to fix before wiring in a real transition are the **resume merge bug** (completed-modes dropped on save) and the **uncaught `registry.read` throw**. The prefix collision is acknowledged in-code but is a genuine dual-ownership you should resolve, not just surface.