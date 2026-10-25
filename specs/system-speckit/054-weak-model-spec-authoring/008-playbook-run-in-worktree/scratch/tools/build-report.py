#!/usr/bin/env python3
"""Builds the report folder from results.tsv and scenarios.tsv.

Usage: build-report.py <runroot> <phase-rel> <report-dir> <run-date>
Every verdict, path and hash comes from the captured runs. The narrative text
per scenario is the observed output of that run, read before it was written.
"""
import hashlib, json, os, sys

runroot, phase_rel, report, run_date = sys.argv[1:5]
phase = os.path.join(runroot, phase_rel)
env = {}
for line in open(os.path.join(phase, 'scratch/env.sh'), encoding='utf-8'):
    if '=' in line:
        k, v = line.rstrip('\n').split('=', 1)
        env[k] = v.strip('"')
base_ref = env['BASE_REF']
wt_branch = env['WT_BRANCH']
folder = os.path.basename(report)

results = [l.rstrip('\n').split('\t') for l in open(os.path.join(phase, 'scratch/results.tsv'), encoding='utf-8') if l.strip()]
scen = {l.split('\t')[0]: l.rstrip('\n').split('\t') for l in open(os.path.join(phase, 'scratch/scenarios.tsv'), encoding='utf-8') if l.strip()}
assert len(results) == 8

reasons = {
    'S1': 'A Level 2 scaffold stamped v2.3 with its Status row at Draft printed warn for PLACEHOLDER_FILLED and true for passed under strict validation. The throwaway track was removed (cleanup=ok).',
    'S2': 'The same kind of scaffold with its Status row changed to Complete printed error and false. The detail lines named spec.md lines that still held YOUR_VALUE_HERE tokens. The track was removed (cleanup=ok).',
    'S3': 'A Draft scaffold with all five stamps rewritten to v2.2 printed error and false, so the older stamp kept its error and received no Draft warning. The track was removed (cleanup=ok).',
    'S4': 'The drift guard exited 0 with EXAMPLE_DRIFT_OK on the clean tree. On a copy with one injected description tail it exited 1 with one description failure line and no EXAMPLE_DRIFT_OK line. The scratch folder was removed (cleanup=ok).',
    'S5': 'The golden render test printed Tests 12 passed (12) and the fill guidance test printed Tests 16 passed (16). Both exited 0 and neither output held the word failed. The scratch folder was removed (cleanup=ok).',
    'S6': 'The three awk counts printed 4 card lines and 0 guide lines across the four authoring intent blocks, and 1 guide line in the on-demand list.',
    'S7': 'The sync guard exited 0 on the tree with nine PASS lines and CARD SYNC OK. The rsync copy exited 0 with CARD SYNC OK. After the card was deleted from the copy the guard exited 1 with one FAIL card-exists line and CARD SYNC FAILED. The scratch folder was removed (cleanup=ok).',
    'S8': 'One cli-devin swe-2-max worker (permission mode dangerous) wrote a Level 1 packet from the card. devin exited 0 and the worker returned RESULT: PASSED. The conductor-side strict run printed val_exit=0 and RESULT: PASSED, the leftover token count was 0 and the track was removed (cleanup=ok). It took one attempt with no rate-limit reply.',
}
worker_dir = os.path.join(phase, 'scratch/runs/483.worker-1')

def rel(p):
    return os.path.relpath(p, runroot)

def ev(p):
    data = open(p, 'rb').read()
    return {'path': rel(p), 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()}

os.makedirs(os.path.join(report, 'outcomes'), exist_ok=True)
csv = ['scenario_id,runtime,run,evidence_class,verdict']
tally_p = tally_f = 0
for label, verdict, pid, run in results:
    out_verdict = 'PASS' if verdict in ('PASS', 'FIXED') else 'FAIL'
    tally_p += out_verdict == 'PASS'
    tally_f += out_verdict == 'FAIL'
    csv.append('%s,conductor,1,manual-testing-playbook,%s' % (pid, out_verdict))
    evidence = [ev(run)]
    if label == 'S8':
        for f in ('brief.txt', 'reply.txt', 'reply.err', 'val.txt'):
            evidence.append(ev(os.path.join(worker_dir, f)))
    obj = {
        'scenarioId': pid,
        'runtime': 'conductor',
        'evidenceClass': 'manual-testing-playbook',
        'verdict': out_verdict,
        'reason': reasons[label],
        'executionContext': {'evidenceRoot': '.', 'requireDurableEvidence': True},
        'supersedes': [],
        'providerModel': None,
        'dispatchModel': 'swe-2-max' if label == 'S8' else 'none',
        'runs': [{'run': '1', 'verdict': out_verdict, 'reason': reasons[label], 'operatorInputs': 'None.', 'evidence': evidence}],
        'evidence': evidence,
    }
    with open(os.path.join(report, 'outcomes', pid + '.json'), 'w', encoding='utf-8') as fh:
        json.dump(obj, fh, indent=2)
        fh.write('\n')
open(os.path.join(report, 'results.csv'), 'w', encoding='utf-8').write('\n'.join(csv) + '\n')

verdict_word = 'PASS' if tally_p == 8 else 'FAIL (%d PASS, %d FAIL)' % (tally_p, tally_f)
pr = phase_rel + '/'
open(os.path.join(report, 'source.md'), 'w', encoding='utf-8').write('''# system-spec-kit Benchmark Sources

> system-spec-kit · manual-testing-playbook · weak-model authoring

---

## 1. OVERVIEW

This map names where the raw evidence behind this folder lives.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/system-spec-kit` |
| Scenarios | the eight files under `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/`, mapped in `%(pr)sscratch/scenarios.tsv` |
| Execution host | disposable worktree `%(wt)s`, removed at phase close |
| Base ref | `%(base)s` |
| Run files | `%(pr)sscratch/runs/`, one per playbook id, each with a `.check.txt` and a `.stderr.txt` sidecar |
| Provisioning record | `%(pr)sscratch/worktree/provision.out` (its last line is `provisioned: 11 installed, 5 built, 3 already present, 0 failed`) and `provision-exit.txt` (`exit=0`) |
| Timings | `%(pr)sscratch/timings.txt`, the modification times of the create, provision and run files |
| Runner | `%(pr)sscratch/tools/run-scenario.sh`, which executes only `bash` and `sh` fences and sets a 30 minute alarm (an `alarm` of 1800 seconds on line 21) |
| Scenario 483 worker files | `%(pr)sscratch/runs/483.worker-1/` (brief, reply, reply error output, validation output) |
| Verdict page | `%(pr)sscratch/verdicts.md` |
| Source packet | `%(pr)s` |

---

## 2. BOUNDARY

The corpus is an input and is never rewritten by a run. This folder holds outputs only. A run whose result changes gets a new folder rather than overwriting this one.

Last updated %(date)s.
''' % {'pr': pr, 'wt': wt_branch, 'base': base_ref, 'date': run_date})

rows = ''.join('| %s | %s | %s | `%s` |\n' % (l, p, v, rel(r)) for l, v, p, r in results)
prof = ''
for l, v, p, r in results:
    s = scen[l]
    fname = os.path.basename(s[2])
    pats = ' and '.join('`%s`' % x for x in s[3:6] if x)
    model = 'cli-devin swe-2-max' if l == 'S8' else 'none, scripted'
    prof += '| %s | %s `%s` | the scenario\'s own `### Commands` blocks, output in `%sscratch/runs/%s.txt` | %s | %s |\n' % (l, p, fname, pr, p, pats, model)

readme = '''# %(folder)s

> system-spec-kit · manual-testing-playbook · eight scenarios · weak-model authoring

---

## 1. HEADLINE / OVERVIEW

Verdict: %(verdict)s.

Eight scenarios from the template authoring group (playbook ids 476 to 483) ran on a disposable worktree built from `%(base)s`. %(p)d passed and %(f)d need attention. No fix was needed.

---

## 2. AGGREGATE RESULTS

| S | Playbook ID | Verdict | Evidence |
|---|---|---|---|
%(rows)s
The row verdict is the comparator result against the frozen patterns, confirmed by reading each run against the scenario's own Pass section.

---

## 3. METHODOLOGY

One disposable worktree (`%(wt)s`) was created through the sk-git allocator from `%(base)s` and provisioned by the allocator, which ended `11 installed, 5 built, 3 already present, 0 failed` (last line of `scratch/worktree/provision.out`). A realpath check showed the worktree runs its own `node_modules` and `runtime/dist`, and the base ref was proved to hold the authoring card, both guard scripts and the v2.3 template stamp.

Each scenario ran from its own `### Commands` blocks. The runner executes only the `bash` and `sh` fences under that heading in one shell from the worktree root, with stdin closed and a 30 minute alarm (`scratch/tools/run-scenario.sh`). The comparator then requires every non-empty frozen pattern to match the captured run.

Scenario 483 ran through the same runner. Its step 2 dispatched one cli-devin swe-2-max worker with `--permission-mode dangerous`, which the operator approved for this run, and its step 3 validated the packet the worker wrote.

Two frozen patterns changed before the first run. S1 used `^warning$` and now uses `^warn$`, because the scenario's own Expected and Pass sections say `warn`. S8 used a `leftover_tokens` line that the conductor was to write, and now matches the lines the scenario itself prints (`devin_exit=0`, the packet path, `val_exit=0`, `RESULT: PASSED`, the bare token count `0`, and `cleanup=ok`).

---

## 4. PER-CANDIDATE PROFILES

| S | Candidate | Command source | Pass patterns | Dispatch model |
|---|---|---|---|---|
%(prof)s
---

## 5. PROCESS NOTES

Provisioning took about 18 minutes (1094 s), the run files of scenarios S1 to S7 were written within 11 seconds of each other, and scenario 483 took about 3 minutes (174 s after S7 finished). The times are differences of file modification times, saved in `scratch/timings.txt`. No scenario needed a fix attempt, so `scratch/fix/` holds no brief. Scenario 483 dispatched once and met no rate limit. No scenario command was retyped by the conductor.

The runner was amended before the first scenario run to execute only `bash` and `sh` fences and to close stdin, and the amendments are recorded in the phase goal.

---

## 6. FINDINGS

The load-bearing result is the per-scenario verdict in section 2. A pass means the scenario's own commands produced its own criterion on a tree that holds the weak-model authoring work.

The scenario 483 worker ran strict validation twice. Its reply says the first run reported two derived-metadata errors after the rewrite and that it repaired them with the repair command the validator names before the second run passed. That is the worker's own account, and it is a candidate for the phase 009 comparison rather than a defect here.

Three phase 007 notes were forwarded to this phase and were recorded without editing a scenario file. Scenarios 479 and 482 list their tools without `awk` and `rg`. Scenario 483 leaves its pointer file under the phase 007 scratch folder inside the worktree, and this phase keeps that file in the saved patch.

---

## 7. CAVEATS

Each scenario ran once. Scenario 483 sampled one model on one attempt, so it shows the card can drive a passing Level 1 packet and does not compare models. The result is pinned to `%(base)s` and does not describe a later tree.

The S4 negative check (the broken run must not print `EXAMPLE_DRIFT_OK`) is not a frozen pattern. It was read from the run, where the count printed `0`.

The frozen patterns for S1 and S8 were amended as described in section 3, so those two rows are judged against the scenario's own Pass section.

---

## 8. RECOMMENDATIONS

Tier 1, apply now: none. No scenario failed and no product file was changed.

Tier 2, validate first: phase 009 can check whether the derived-metadata repair round trip in the scenario 483 worker recurs across its three runs, which would justify one card line about it. The phase 007 owner can decide the two preconditions-list notes and the pointer file location.

Tier 3, future: extend scenario 483 to a second model in a later packet.

---

## 9. REPRODUCIBILITY

```bash
bash .skilled/skills/sk-git/scripts/worktree-naming.sh create playbook-run %(base)s --no-provision
bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision <the printed directory>
cd <the printed directory>
bash %(pr)sscratch/tools/run-scenario.sh <scenario file> <out file> </dev/null
```

Expected wall clock: about 18 minutes for provisioning and about 3 minutes for the eight scenarios when scenario 483 meets no rate limit (observed in `scratch/timings.txt`).

---

## 10. CROSS-LINKS

Phase folder: `%(pr)s`

Parent packet: `specs/system-speckit/054-weak-model-spec-authoring/`

| File | Contents |
|---|---|
| `results.csv` | One row per scenario |
| `outcomes/` | One outcome JSON per scenario |
| `source.md` | Where the raw evidence lives |
''' % {'folder': folder, 'verdict': verdict_word, 'base': base_ref, 'p': tally_p, 'f': tally_f, 'rows': rows, 'wt': wt_branch, 'prof': prof, 'pr': pr}
open(os.path.join(report, 'README.md'), 'w', encoding='utf-8').write(readme)
print('REPORT_BUILT', folder, verdict_word)
