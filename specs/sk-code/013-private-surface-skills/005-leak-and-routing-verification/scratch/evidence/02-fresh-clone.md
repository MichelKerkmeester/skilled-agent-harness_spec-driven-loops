# 02 - Fresh clone

Run on 2026-10-24. Path substitution: the tasks name `/tmp/psurf-clone-main`. This run used the session scratchpad instead, `SP=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/7aa0d8d1-05fa-460d-ab2a-780167092e31/scratchpad`, so `CLONE=$SP/psurf-clone-main`. Every other command is unchanged.

C1 note: the evidence commit C1 does not exist yet (T006's commit and T007's push are handled by the orchestrator), so this clone is of the `origin/main` tip, not of C1.

## A - Clone

```bash
git fetch origin main
git rev-parse origin/main HEAD
CLONE=$SP/psurf-clone-main
rm -rf "$CLONE"
git clone --no-local https://github.com/MichelKerkmeester/skilled-agent-harness_spec-driven-loops.git "$CLONE"
git -C "$CLONE" rev-parse HEAD
```

Output:

```text
9129007915a2b6ada693440ad106fd8eefa5e589
9129007915a2b6ada693440ad106fd8eefa5e589
Cloning into '<SP>/psurf-clone-main'...
Updating files: 100% (109297/109297), done.
9129007915a2b6ada693440ad106fd8eefa5e589
```

(`<SP>` stands for the scratchpad path above. The first two lines are `origin/main` and the operator checkout `HEAD`.)

Expected: the clone HEAD equals the C1 sha

Result: held in the available form. The clone reports `Cloning into '...'`, exit status 0, and prints a full 40-character sha. The sha is the `origin/main` tip `9129007915a2b6ada693440ad106fd8eefa5e589`. It cannot equal a C1 sha because C1 is not committed yet.

## B - Identity

```bash
git -C "$CLONE" rev-parse HEAD
git rev-parse HEAD
git -C "$CLONE" status --porcelain | wc -l
```

Output:

```text
9129007915a2b6ada693440ad106fd8eefa5e589
9129007915a2b6ada693440ad106fd8eefa5e589
       0
```

C1 sha beside it: none (not committed). The operator checkout `HEAD` is `9129007915a2b6ada693440ad106fd8eefa5e589`.

Expected: equal shas and an empty status

Result: held. Both shas are identical and the status count is `0`.

<!-- evidence:end -->
