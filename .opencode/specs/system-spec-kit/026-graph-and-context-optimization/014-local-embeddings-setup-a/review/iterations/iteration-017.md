# Deep Review v2 Iteration 017 — 007 portability

**Dimension:** cross-stack
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P0. | - | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V2-007-002 | `007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh:31` | The macOS tcpdump script uses Linux-style `-i any`, which is not available on this host. | `tcpdump -D` lists active `en0`, `utun*`, `awdl0`, etc.; no `any` interface appears. | Require `TCPDUMP_IFACE` or default to detected `en0` on this host; for VPN traffic, instruct choosing the active `utun*`. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P2-V2-007-001 | `007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh:31` | `tcpdump -w` is piped to `tee`, but packet output goes to the pcap and status is stderr. | Lines 31-34 combine `-w "${CAPTURE_FILE}"` with a stdout pipe. | Redirect stderr to the log, or remove `tee` and summarize from the pcap after capture. |

## Notes
This re-confirms v1 `P1-007-002`; recommended interface for this machine is `en0` unless the active route is a VPN `utun*`.
