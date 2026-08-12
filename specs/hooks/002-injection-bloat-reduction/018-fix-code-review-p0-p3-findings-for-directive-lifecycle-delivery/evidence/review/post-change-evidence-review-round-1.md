## Review

**Completion verdict: NOT ACCEPTED.** No P0 was confirmed, but multiple P1 evidence and documentation gates remain unsatisfied.

### P0

- No confirmed P0 finding.

### P1

1. **The whole-gate evidence cannot establish a comparable post-change result.**  
   **Confirmed.** `evidence/whole-gate/` contains only `baseline/`; no `post/` result or comparison artifact exists. The runner records results but never compares baseline/post inventories, totals, skips, todos, or failure identities, and does not return failure when commands miss expectations (`specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/whole-gate/run-manifest.mjs:91-126`). The baseline itself has an advisor suite exit `1` and a spec-kit suite timeout/SIGTERM (`.../evidence/whole-gate/baseline/results.json:75-204`, `:227-390`). This does not satisfy the identical-gate requirement in `spec.md:169-170`.

2. **The persistence wrapper does not enforce the documented PASS provenance contract.**  
   **Confirmed.** Durable validation is optional through `requireDurableEvidence`; without it, missing evidence remains `unverified` and PASS is accepted (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs:64-91`). Its test deliberately persists PASS with nonexistent `evidence/pass.txt` (`.../tests/manual-playbook-persist.test.cjs:84-112`). Runtime version, exact command, sanitized payload fixture, controlled evidence class, executor provenance, and a model-not-applicable reason are not required by `buildReport()` (`run-manual-playbook-scenario.cjs:198-266`). This conflicts with `spec.md:167-168` and task T026.

3. **Current outcomes omit exact command and payload provenance and mislabel Node as each host runtime version.**  
   **Confirmed.** All seven outcome records have no `command` or `payloadFixture`. Claude/Codex/Cursor/Devin records all store `runtimeVersion: "v25.6.1"`, while the runtime environment identifies that value as Node (`.../evidence/runtime/2026-08-11-registered-adapters/environment.json:2-5`). Cursor native-host evidence likewise reports Node v25.6.1 as its runtime version (`.../evidence/outcomes/cursor-native-host.json:18-27`). Models are honestly null, but runtime provenance is not host-version provenance.

4. **Evidence classes do not implement the specified controlled taxonomy.**  
   **Confirmed.** The specification requires `unit`, `adapter-driven`, `registered-path`, and `native-host-delivered` (`spec.md:166-170`; `plan.md:108-110`). The wrapper accepts any string and defaults to `manual-operator` (`run-manual-playbook-scenario.cjs:219-225`). Current records instead use `registered-adapter`, `adapter-suite`, `test-seam`, and `native-host`. For example, Claude is labeled `registered-adapter` while its own status says `adapter-driven-only` (`.../evidence/outcomes/claude-adapter.json:12-25`). This leaves evidence strength ambiguous.

5. **Evidence-root containment can be bypassed with a symlink.**  
   **Confirmed from code.** The wrapper checks only the lexical path, then calls `statSync` and `readFileSync`, both of which follow symlinks (`run-manual-playbook-scenario.cjs:64-91`). A symlink located under `evidenceRoot` can therefore hash and archive a file outside that root. No test covers this case. This can leak host-private data and violates the evidence containment requirement.

6. **Append-only folders exist, but external supersession is incomplete.**  
   **Confirmed.** Folder reservation refuses overwrite (`run-manual-playbook-scenario.cjs:288-330`), and corrected reports contain `supersedes`. However, there is no external supersession manifest. The report index lists old `/tmp`-based runs and corrected runs equally, without a current/superseded field (`.opencode/skills/system-spec-kit/benchmark/reports/README.md:22-34`). Thus consumers cannot determine current truth without opening every report. This does not satisfy `spec.md:167` or task T028.

7. **The checked symlink claim exceeds the recorded gate.**  
   **Confirmed.** The whole-gate command only checks `test -L` and prints `readlink`; it does not compare expected targets, resolve `realpath`, or hash targets (`.../evidence/whole-gate/manifest.json:89-96`). Yet CHK-051 claims correct targets passed 4/4 (`.../checklist.md`, File Organization section). Presence is supported; target correctness is not proven by that command.

8. **Phase 018 task/checklist state is stale relative to the repository artifacts.**  
   **Confirmed.** Phase 018 remains `status: planned`, `completion_pct: 0`, and states that no baseline or implementation exists (`.../implementation-summary.md:2-5`, Verification and Known Limitations sections). T002-T007 and implementation tasks remain unchecked despite baseline, runtime, performance, wrapper, scenario, report, and reconciliation artifacts being present (`.../tasks.md`, Phase 1 and Phase 2). Conservative non-completion is appropriate, but the individual task/evidence ledger is no longer truthful.

### P2

1. **Generated reports persist absolute checkout paths while rendered prose claims repo-relative provenance.**  
   **Confirmed.** JSON stores an absolute `targetSkill.root` (`.../benchmark/reports/2026-08-11--manual-testing-playbook--cursor-native-host/skill-benchmark-report.json:7-10`), and `source.md` exposes the same checkout path (`.../claude-adapter/source.md:7-13`). The rendered report nevertheless states that it carries no absolute checkout path (`.../claude-adapter/skill-benchmark-report.md:21-25`).

2. **Performance evidence is useful but insufficient for the promised residual-risk disposition.**  
   **Confirmed.** It records p50/p95/p99 and one contention run (`.../evidence/performance/result.json:1-48`). It is not bound to a source/dist hash or exact command, has no before/after latency comparison, and does not measure eviction or cleanup-at-capacity. Corresponding checklist rows correctly remain unchecked.

3. **Historical `/tmp` references remain visible as apparently current reports.**  
   **Confirmed.** The old report JSON files still contain `/tmp/directive-dl...` and `/tmp/pi-dispatch-suite.log`. Keeping historical bytes is correct, but without an authoritative supersession index their visible status remains ambiguous.

### P3 / Residual risks

- **Inferred:** Several baseline/test logs exist locally but were absent from `git ls-files --others --exclude-standard`; they may be ignored and therefore not deliverable. Confirm with `git check-ignore -v` before relying on them as durable committed evidence.
- Parent metadata and all phase 014-017 source hashes were not independently recomputed during this bounded review. Phase 018 itself admits reconciliation remains open.
- The working tree contains extensive unrelated changes and deletions. Evidence tied only to the current HEAD does not identify the actual dirty implementation state.

### Correct

- Cursor native-host status is honestly `SKIP`, dormant and unconfirmed (`.../evidence/outcomes/cursor-native-host.json:2-19`).
- An independent hash audit verified all 20 artifacts referenced by the seven corrected benchmark reports.
- Corrected evidence contains no `/tmp` references.
- Models remain null rather than claiming requested or unobserved model identities.
- The append-only destination reservation prevents overwriting an existing report folder.

## Commands Run

- `git status --short; git rev-parse --show-toplevel; git branch --show-current` — passed; dirty tree observed, no staged entries identified.
- `git diff --name-only ...; git ls-files --others --exclude-standard ...` — passed; scoped modified/untracked inventory captured.
- Python outcome-field and SHA-256 audit plus `rg -n '/tmp|/var/folders' ...` — passed; 20/20 corrected artifacts verified, historical temp references found.
- Test suites were inspected from stored evidence but were not rerun during this read-only review.