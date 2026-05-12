# Deep Review Iteration 002 — 007-voyage-cleanup-and-egress-monitoring

**Dimension:** security
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:45:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| None | - | No P0 found in this pass. | - | - |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-007-002 | 007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh:31 | The macOS verification script uses `tcpdump -i any`, but this host's tcpdump interface list has no `any` interface. | Script says macOS sudo at `tcpdump-verify.sh:10` and uses `-i any` at `:31`; `tcpdump -D` returned `utun0`, `en0`, `awdl0`, etc., but no `any`. | Prompt the user to choose an interface (`en0`/VPN `utun*`) or loop over active interfaces; do not ship `-i any` as the macOS command. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-007-002 | 007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh:31 | The script pipes `tcpdump -w` through `tee`, but `-w` writes packets to a file and status output is stderr, so the log file will not capture useful tcpdump stats. | `tcpdump-verify.sh:31-34` combines `-w` with `| tee`. | Redirect stderr to the log or remove the pipe and summarize with `tcpdump -r` after a controlled timeout/trap. |

## Notes
Security pass focused on whether the verification really detects egress. The intended check is good; the concrete script is not portable on this target.
