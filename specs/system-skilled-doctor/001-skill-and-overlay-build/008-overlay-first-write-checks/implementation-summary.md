---
title: "Implementation Summary"
description: "A project that vendors Skilled can now set one manifest key and have every write to a vendored path that no overlay owns refused when it is made, instead of meeting it weeks later at a re-pin."
trigger_phrases:
  - "overlay first write checks implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/008-overlay-first-write-checks"
    last_updated_at: "2026-11-11T19:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built and verified the strict write checks"
    next_safe_action: "Barter re-pins to the commit that carries this change"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/overlay-engine.cjs"
      - ".skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs"
      - ".skilled/commands/doctor/assets/doctor-overlay-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-overlay-first-write-checks-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-overlay-first-write-checks |
| **Completed** | 2026-11-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

With `"strictWrites": true` in the overlay manifest, the engine's `--guard` refuses a new file, or an edit to an upstream file no overlay owns, under a vendored root. The refusal names the overlay path to create or the `apply --adopt` command to run. A tree without the key behaves as it did before.

### Phase 8: overlay-first-write-checks

Until now the guard knew only the paths an overlay already owned. You could add a file under `.skilled`, or edit an upstream file in place, and nothing objected until the next re-pin dropped the file or refused on the edit. Barter had built its own checks for this in a private script. They now live in the engine, so any vendoring project gets them from one setting.

Five things come with it. The strict guard refuses the write. `apply --adopt <path>` turns the refused path into a manifest entry and applies. A `generated` list of globs names what your generators write, and every check leaves those paths alone. `pre-commit` runs the same test over staged changes, for a commit hook, because a write hook sees only an agent's write tools. `repin.rootFiles` names the upstream root files you carry, and a re-pin prints one `root-file` line for each one upstream changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | The "Strict Writes" section, the `--adopt` and `pre-commit` parsing, `repin.rootFiles` and the `root-file` report lines |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Created | Ten tests over the guard, adopt, the commit check and the root-file line |
| `.skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` | Modified | The apply route's new flag, with `--capture` and `--adopt` probed one at a time |
| `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` | Modified | One test that a strict refusal reaches the hook as a deny |
| `.skilled/hooks/overlay-guard/README.md` | Modified | What the guard refuses with strict writes on |
| `.skilled/commands/doctor/overlay.md` | Modified | The `--adopt` flag, the setting and the workflow summary |
| `.skilled/commands/doctor/_routes.yaml` | Modified | The apply route's flag, invocation and write location |
| `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml` | Modified | The adopt branch of the apply workflow |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modified | The adopt plan, question and result, the three manifest keys and the new report lines |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | The overlay hint, selector and loader lines |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | Strict writes, adopt, the commit check and root files |
| `.skilled/commands/README.txt`, `README.md` | Modified | The overlay command's hint and one line on adopt |
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Modified | Operator-requested follow-up: the source copy goes in entry by entry, so it works on Node 26 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline ran first: 91 tests passed across the five overlay engine files, the contract test and the hook test. The engine change followed, then the new test file, then the documents. The same gate at the end printed `tests 102`, `pass 102`, `fail 0`. The 11 added tests are the ten in the new file and one in the hook test.

The two `--guard` calls in `spec.md` were run against the engine at `1f50e98e12` and against the changed engine, on one fixture tree. The old engine printed `allow` for both and the new one refused both, so the test that proves the feature fails without it.

Two other model families read the change, each read-only, and each finding was checked before it was acted on.

- **GPT-6 Luna at max effort, through `codex exec`.** The brief named the diff, the reference and the defect classes to look for, and asked for at most ten findings marked confirmed or suspected. It returned two. The first, suspected: an adopt could write outside the overlay folder through a link inside it. The engine joined the path without resolving it, so the finding held, and adopt now refuses a copy that resolves outside the folder. The second, confirmed: a printed adopt command left `REPO RULES.md` unquoted, so pasting it failed on the space. All three printed adopt commands now quote such a path. Both fixes have assertions. Its own test run could not create fixtures in its sandbox, so its findings came from reading and from one command it ran.
- **DeepSeek V4.1 Flash at max thinking, through `pi`.** The brief asked for every case where the reference decides a path one way and the port the other, apart from the three intended differences. It returned eight, with a line in each file for every one. The cited lines were opened and each difference is real. None needed a code change: in every case the port is the stricter or the wider of the two, on purpose.
  - The port appends the entry to the manifest text. The reference refuses a manifest that is not in its own canonical format.
  - The port owns only a skill-root entry's `replace` and `remove` paths. The reference treats the whole folder as owned in its commit check, so a staged edit to a retained upstream file passes there and is refused here.
  - The port refuses an adopt when `pin.commit` cannot be read in the checkout. The reference then takes the file for a project file and adopts it without a pin.
  - The port normalizes a destination such as `./.skilled/x` before the overlap test. The reference compares the raw strings and misses the overlap.
  - The port refuses a copy through a link out of the overlay folder, which is the Luna finding.
  - The port checks the root files named in `repin.rootFiles`, which the reference has no key for.
  - The port needs `pin.commit` to compare with upstream, and without it refuses every unowned staged change. The reference lets a staged deletion through.
  - The port skips the commit check only when both the staged and the HEAD manifest name a pin and the two differ. The reference also skips it when the staged manifest has lost its pin.

The wider doctor test folder was run as well. It first printed 1,092 passes and 8 failures in 1,100 tests, all 8 in `sk-skill-convert.test.cjs`. The operator then asked for those to be fixed in this session, outside the phase's first scope.

The cause was in the converter, not in this phase. It creates the target folder with an exclusive `mkdirSync` and then ran one strict `cpSync` of the whole source onto it. On Node 26.13, which the repository's `engines` range allows, a strict `cpSync` onto a folder that exists throws `ERR_FS_CP_EEXIST`, where earlier versions threw only for an existing file. A two-case script reproduced it: the copy onto an absent folder passed and the copy onto an empty existing folder threw. The converter now copies the source entry by entry into the folder it just claimed, with the same strict options on each entry. The only other strict copy in the repository, in `spec-root-migration.ts`, writes to a fresh temporary path and is not affected.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The setting lives in the manifest as `strictWrites`, not in `.skilled-overlays.json` | The guard, adopt and the commit check already load the manifest, and `generated` and `repin.rootFiles` sit there too. The setting file would need a second reader |
| The engine form is `apply --adopt <path>`, where the handover asked for an `adopt <path>` target | The `/doctor:overlay` contract test probes every route flag against the engine's parser, and the command refuses a second positional. Adopt ends in an apply, as capture does, so it takes the same shape as `apply --capture <path>` |
| A `generated` path is allowed by the guard, where Barter's script refuses it | The handover's dispatch prompt says generated paths are allowed, and a generator has to write them. Adopt still refuses one |
| `generated` is a flat list of globs, where Barter's list groups globs under a generator name | The engine only needs to know whether a path matches. Barter moves its list into this shape at its re-pin |
| Ownership comes from the engine's `managedPathTest` | The re-pin's drift scan uses the same test, so the edit-time check and the re-pin agree. It is also stricter than Barter's: a retained upstream file inside a skill-root folder is not owned |
| The adopted copy sits at the destination path without its leading dot | The mapping needs no project knowledge, where Barter's maps `.skilled/skills/x` to `x`. Existing entries keep their sources |
| No runtime-mirror message | A project lists its mirrors in `generated`, which allows them. A second rule for the same paths would be an untested branch |
| A re-pin names an owned root file too | The handover asked for unowned ones. An owned root file upstream changed needs its overlay rebased, and a re-pin never copies it, so nothing else reports it |
| Two trigger phrases for adopt were added and then removed | `doctor-phrase-reach.cjs` showed the advisor routes both to the helper command, and tuning the scorer is outside this phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test tests/overlay-engine-*.test.cjs tests/doctor-overlay-contract.test.cjs ../../../hooks/overlay-guard/lib/overlay-guard.test.cjs`, before the first edit | `tests 91`, `pass 91`, `fail 0` |
| The same command from the final state | `tests 102`, `pass 102`, `fail 0` |
| `node --test tests/overlay-engine-strict-writes.test.cjs` | `tests 10`, `pass 10`, `fail 0` |
| `--guard` on an unowned upstream file and a new file, engine at `1f50e98e12` | `allow`, exit 0, for both |
| The same two calls on the changed engine | `refuse:` lines, exit 1, for both |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | `OK: route-validate — 31 routes validated, 11 warnings` |
| `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | `STATUS=OK phrases=233 bridges=35` |
| `sync-runtime-mirrors.cjs --check` | `PASS: 256 mirrors across 10 trees are in sync` |
| `command-catalog-mirror-check.cjs` | `STATUS=OK` |
| `quality-gate.cjs --files` over the seven changed code and config files | `"findings": []`, `"p0_blocking": 0` |
| `validate_document.py` on `overlay.md`, `overlays.md` and the hook README | `VALID`, 0 issues, for each |
| `node --test tests/sk-skill-convert.test.cjs`, before the converter fix | `tests 69`, `pass 61`, `fail 8` |
| The same command after it | `tests 69`, `pass 69`, `fail 0` |
| `node --test tests/` over the whole doctor folder, final state | `tests 1100`, `pass 1100`, `fail 0` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Adopt writes its entry before it applies.** When another destination is live-edited or in conflict, the apply is refused and adopt exits 1 with the entry already in the manifest. The doctor workflow stops before the question in that case. On a direct engine call, settle the blocked destination and run `apply`.
2. **Adopt needs the upstream checkout.** It reads `pin.commit` from the folder `pin.checkout` names to tell an upstream file from a project file. Without that checkout it refuses a path that exists in the tree. Create the file in the overlay folder first, or run adopt where the checkout exists.
3. **The commit check is not wired to a hook.** `pre-commit` is an engine command. A vendoring project calls it from its own commit hook, and Skilled's hooks do not call it.
4. **Without the upstream checkout the commit check is stricter.** It cannot tell that a staged file equals upstream's, so it refuses every unowned staged change outside the `generated` list.
5. **A shell write is still not guarded at edit time.** The hook reads write tools only, as before. The commit check is what catches it.
6. **Not run on Barter's tree.** Every test uses a fixture. Barter's re-pin and its move to these checks are Barter's next session.
<!-- /ANCHOR:limitations -->

---
