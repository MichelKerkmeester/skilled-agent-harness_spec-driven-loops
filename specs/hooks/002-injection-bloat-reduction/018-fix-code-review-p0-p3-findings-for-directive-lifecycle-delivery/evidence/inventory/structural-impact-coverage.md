# Structural-impact coverage

Captured: 2026-08-11

The repository's structural code-graph/detect-changes tooling was unavailable for this checkout, so this inventory uses the stored producer/consumer searches, direct registration-path inspection, scoped changed-path review, and the frozen whole-gate test inventories. This is a bounded disposition, not a claim that graph coverage ran.

| Changed surface | Consumers or boundary | Covering proof |
| --- | --- | --- |
| Canonical lifecycle contract, decision, file-store wrapper, and Python store helper | Claude shim, registered lifecycle bridges, OpenCode parity behavior | Focused advisor suite (`evidence/tests/advisor-focused-verified.log`, 87/87), persistence suite (`evidence/tests/manual-persistence-verified.log`, 9/9), negative controls (`evidence/negative-controls/final.json`, 5/5), and performance/race evidence (`evidence/performance/result-final-5.json`) |
| Claude/Codex/Cursor/Devin lifecycle owners and registered bridge | Runtime registrations and user-prompt adapters | Registered-adapter suite (`evidence/tests/registered-adapters-verified.log`, 23/23), `evidence/runtime/2026-08-11-registered-adapters/summary.json`, and `evidence/runtime/2026-08-11-registered-paths-final-2/summary.json` |
| OpenCode plugin identity, lifecycle, and receipt behavior | OpenCode system transform and lifecycle events | Focused advisor/plugin suite and negative-control generation-reset/identity rows |
| Pi prompt-advisor cadence | Pi input transform and independent tool-call preflight enforcement | Final Pi suite (`evidence/whole-gate/final-pi-repeat-4/pi-full-suite.log`, 55/55) and hashed append-only report `2026-08-11--manual-testing-playbook--pi-repeat-suppression-verified` |
| Scenario 457 and benchmark persistence | Manual-playbook readers, report index, supersession consumers | Persistence suite, repository-relative evidence/hash audit, append-only outcome reports, and external supersession manifest |
| Packet evidence runner and comparator | Whole-gate baseline/post consumers | Identical manifest hash and zero-blocker comparison in `evidence/whole-gate/comparison-final-pi-repeat-4-normalized.json` |
| Runtime-facing docs and feature catalog | Operators and future maintainers | Template validators, stale-wording scan, and final strict packet validation |

The frozen whole gate observed no lost advisor or Pi test file: advisor inventory increased from 120 to 121, spec-kit inventory increased from 844 to 846, and Pi remained at two files while passing tests increased from 54 to 55. The advisor failure identities stayed unchanged; the spec-kit lane retained the same timeout class and 154 normalized failures.

Uncovered boundaries remain deliberately classified as residual evidence gaps:

- Native-host-delivered receipts were not obtained for Claude, Codex, Devin, OpenCode, or Cursor. Adapter and registered-path results do not promote those claims.
- Cursor's native event remains dormant/unconfirmed.
- The TypeScript canonical core and OpenCode JavaScript mirror remain separate implementations, guarded by contract vectors rather than unified code.
- Structural code-graph coverage was unavailable, so future tooling must re-evaluate the direct producer/consumer inventory rather than treating this file as graph proof.

RR-005 remains owned by the release gate owner. Reopen it when failure identities change, a new producer/consumer surface is added without a mapped test, structural tooling becomes available and reports an uncovered edge, or a release requires native-host certification.
