# Reproduction: lock release without a nonce

`loop-lock.cjs acquire --lock-path <tmp>/.deep-research.lock --packet-id specs/x` -> `acquired:true`, lock carries `acquireNonce`.
`loop-lock.cjs release --lock-path <tmp>/.deep-research.lock --owner-pid 91124` -> `{"command":"release","released":false}` exit 0; the lock file remains.
`loop-lock.cjs release ... --owner-pid 91124 --nonce <acquire_nonce>` -> `{"command":"release","released":true}`; the file is gone.

Verdict: holds. The workflow release commands (auto lines 275, 278, 281, 2225; confirm 292, 295, 298, 1672) pass only `--owner-pid`.
