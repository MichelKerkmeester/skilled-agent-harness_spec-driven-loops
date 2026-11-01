# Run-folder consumers

Command: `rg -n "doctor-symlink|RUNS_PATH|runDir|digest.slice" .skilled/commands/doctor`, read before the change.

## Sites that derive a run folder name from a digest

- `.skilled/commands/doctor/scripts/symlink-engine.cjs:1023` (before the change): `createRunRecord()` built `path.join(RUNS_PATH, digest.slice(0, 16))`. Producer. Changed.
- `.skilled/commands/doctor/scripts/symlink-engine.cjs:1568` (before the change): `runUnlink()` rebuilt the same path and required the `--run` folder to equal it. Consumer. Changed.
- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:925`: names the agents-md backup folder from its own digest. Different engine and folder. Not a consumer.

## Sites that take the run folder as given

- `symlink-engine.cjs` apply output (`run: created.runDir` and the `unlink --run <dir> --dry-run` undo line): prints the folder `createRunRecord()` returned. Unchanged.
- `assets/doctor-symlink-unlink.yaml` and `assets/doctor-symlink-presentation.txt`: pass on the folder the apply printed. Unchanged.
- `scripts/tests/symlink-engine.test.cjs` `runDirectoryFrom()`: parses the undo line. Unchanged.

## Doc lines that state the name

- `.skilled/commands/doctor/symlink.md:90`: updated.
- `.skilled/commands/doctor/assets/doctor-symlink-link.yaml:31`: updated. The contract test `doctor-symlink-contract.test.cjs:442` matches `doctor-symlink\/<first 16 hex characters`, which the new text keeps.
- `.skilled/commands/doctor/_routes.yaml:561`: stated `<digest>`; updated to the real name and the numbered fallback.
- `.skilled/manual-testing-playbook/doctor-commands/doctor-symlink.md:28` and `:162`: describe the first apply in a fresh scratch repository, which still gets the plain prefix. Unchanged.

## Barter-facing callers

`rg -n -i "barter" .skilled/commands/doctor/symlink.md .skilled/commands/doctor/assets/doctor-symlink*.yaml` prints no line: neither the command doc nor the three workflow assets name a Barter caller. Every caller reaches the folder name through the engine's printed undo line.
