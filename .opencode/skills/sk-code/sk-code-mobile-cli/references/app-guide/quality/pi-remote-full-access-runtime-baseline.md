# Full-Access Runtime Baseline

> Evidence that the deployed relay launches the intended full-access (desktop-parity)
> pi child and that `/plan` produces a real, RPC-visible mode transition. This is the
> Phase 0 gate: no new phone control, foundation asset, or UI work starts until the
> operator-run fields below are filled from a live verifier pass.

---

## How to capture this baseline

Run the black-box verifier against the live pi installation used by the deployment:

```bash
npm run verify:runtime-boundary
```

It speaks strict LF-delimited pi RPC directly to a `pi --mode rpc --no-session --approve`
child, performs the four reads, and runs the `/plan` smoke, restoring the starting mode
before exit. Its output is bounded and secret-free; copy the safe summary fields into the
table below. A `PASS` line plus exit code `0` is the gate. Any missing read, a `/plan`
that does not transition, or a forbidden token in the output is a `FAIL` and keeps every
downstream phone control dark.

---

## Fixed contract (verified in code, not operator-entered)

| Field                               | Value                                                                 |
| ----------------------------------- | --------------------------------------------------------------------- |
| Full-access argument vector         | `--mode rpc --no-session --approve`                                   |
| Approval extension                  | Not loaded in full access (desktop parity)                            |
| Safe default (unchanged)            | `--mode rpc --no-session --no-tools --no-extensions`                  |
| Phone can enable full access        | No — host-selected only (`--full-access` / `PI_REMOTE_FULL_ACCESS=1`) |
| Runtime rollback needs DB migration | No                                                                    |

The argument vectors above are guarded by relay unit tests; the full-access relaunch
without migration is guarded by the rollback drill.

---

## Operator-observed evidence (fill from a live verifier pass)

| Field                                | Value                                                 |
| ------------------------------------ | ----------------------------------------------------- |
| Date (UTC)                           | _pending_                                             |
| Host / device                        | _pending_                                             |
| pi version                           | _pending_ (pinned `0.84` line)                        |
| Resolved pi executable               | _pending_ (path — record location only, not contents) |
| Observed child argument vector       | _pending_ (must equal the fixed vector above)         |
| `get_state` read                     | _pending_ (pass / fail)                               |
| `get_available_models` read          | _pending_ (pass / fail; count only)                   |
| `get_available_thinking_levels` read | _pending_ (pass / fail; level names)                  |
| `get_commands` read                  | _pending_ (pass / fail; `plan` present?)              |
| `/plan` loaded in RPC mode           | _pending_ (yes / no)                                  |
| Observed `/plan` status signal       | _pending_ (e.g. `extension_ui_request`)               |
| Mode restored after smoke            | _pending_ (yes / no)                                  |
| Verifier result                      | _pending_ (`PASS` / `FAIL`, exit code)                |

---

## Rollback

Runtime and visible-phase rollback requires no database or schema migration. To roll back:

1. Disable any new runtime-control capability if the release requires it; leave session
   data untouched.
2. Redeploy the prior verified relay and web build.
3. Restart through the verified full-access boot path:

   ```bash
   npm run boot -- --full-access
   ```

The rollback drill (`npm run rollback:drill`) proves backup-restore preserves sessions and
that the full-access posture relaunches against the restored database without a migration.

---

## Baseline screenshots

Capture the current app appearance before any Foundation (F1) restyle work begins, so the
inert-restyle phases can be proven pixel-stable against this reference. Record the file
names and capture context here:

| Screenshot | Context (device, theme, screen) | Captured  |
| ---------- | ------------------------------- | --------- |
| _pending_  | _pending_                       | _pending_ |
