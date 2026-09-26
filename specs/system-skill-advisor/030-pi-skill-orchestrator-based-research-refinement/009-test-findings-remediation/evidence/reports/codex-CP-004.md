<!-- dispatch: codex CP-004; ledger: 2026-09-26T22:17:06Z 2026-09-26T22:17:57Z 0 51 -->

RESULT: PASS | scenario=CP-004 | runtime=Codex
NATIVE: Advisor: outage (fail_open); route by hand: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<request>"}' --format json
STEPS:
| # | Command (shortened) | Exit | Observed (key output) | Expected (from the scenario file) | Match |
|---|---|---:|---|---|---|
| 1 | Forced-local Python shim | 0 | Returned JSON array with `sk-git`, source `local` | Python scorer returns a JSON array | Yes |
| 2 | Create `/tmp/cp004.VN6ppF` sandbox; export isolated socket and DB paths | 0 | Sandbox created; recorded generation checksum | Use sandbox paths and record live generation checksum | Yes |
| 3 | Native `advisor_recommend --warm-only` | 75 | Retryable error envelope; `status: error`, socket `ENOENT`, `exitCode: 75`; sandbox DB absent | Error envelope for sandbox socket; exit 75; no spawn or DB creation | Yes |
| 4 | Native cold-start `advisor_recommend` | 0 | `status: ok`, `freshness: live`, recommendation present | Sandbox daemon returns live freshness; exit 0 | Yes |
| 5 | Sandbox-scoped teardown and checksum check | 0 | Sandbox launcher 72311 stopped; generation file unchanged | Stop only sandbox launcher; confirm generation unchanged | Yes |

DEVIATIONS: none
NOTES: Generation SHA-1 before: `80e72817bc0415a117361c09b2fc9c62b6f431b8`; after: `80e72817bc0415a117361c09b2fc9c62b6f431b8`. Live launcher SHA-1 before: `03f8dccfda9db4cd567e9f9b1d5fec56ecb92b44`; after: `03f8dccfda9db4cd567e9f9b1d5fec56ecb92b44`.
