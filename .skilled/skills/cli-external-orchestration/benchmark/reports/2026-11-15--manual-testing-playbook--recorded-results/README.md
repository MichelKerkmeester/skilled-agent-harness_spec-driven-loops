# 2026-11-15--manual-testing-playbook--recorded-results

> cli-external-orchestration · manual-testing-playbook--recorded-results · the operator session that ran each scenario; moved here from the scenario files' Recorded Result blocks

---

## 1. OVERVIEW

Verdict: PASS.

Tally: 3 PASS.

The recorder wrote this folder from `outside the repository and not kept (2026-11-15.csv)`. A field the run did not capture reads "not recorded".

---

## 2. RESULTS

| Scenario | File | Runtime | Verdict | Reason | Evidence |
|---|---|---|---|---|---|
| VIB-HR-001 | `hard-rules/dispatch-rule-check-suite.md` | not recorded | PASS | not recorded | Observed: the command exited `0` with `tests 64`, `pass 64`, `fail 0`, `cancelled 0`, `skipped 0` and `todo 0`. · Observed: the run printed the five Vibe rule cases, `stdin-redirect-required covers vibe print mode and its prompt-file form`, `the documented vibe dispatch line passes every hard rule` and `every vibe hard rule names an implemented check and never borrows the dsh roster check`, all passing. · Observed: the run also printed `dsh hard rules refuse the retired Mistral route`, which shows the shared evaluator keeps the dsh roster closed while the Vibe roster names Mistral models. · Note: the suite is hermetic. It evaluates command strings and never starts `vibe` or contacts a provider. |
| VIB-HR-002 | `hard-rules/hard-rule-sidecar-integrity.md` | not recorded | PASS | not recorded | Observed: the command exited `0` and printed `count=7`. · Observed: `ids=print-mode-only,isolated-vibe-home,output-dir-required,vibe-closed-roster,no-repo-root-cwd,stdin-redirect-required,rendered-home-hooks`. · Observed: `severities=error`. · Note: the sidecar is read by the preflight and by the suite; this scenario checks the file, and `VIB-HR-001` checks that each id has an implemented check. |
| VIB-ROUTE-001 | `hub-routing/front-door-compiled-decision.md` | not recorded | PASS | not recorded | Observed: the front door exited `0` and printed `{"hubId":"cli-external-orchestration","action":"route","selectionKind":"single","targets":[{"backendKind":"cli-dispatch","packetId":"cli-mistral-vibe","packetKind":"workflow","skillId":"cli-external-orchestration","workflowMode":"cli-mistral-vibe"}],"effectivePolicyHash":"177d05116c1fad5b3c4e717137447a11afb5a0e22c67c4856ea403976434fd32","generation":5}`. · Observed: `selected={"effectivePolicyHash":"177d05116c1fad5b3c4e717137447a11afb5a0e22c67c4856ea403976434fd32","generation":5}`, the same snapshot identity, and `match=true`. · History: an earlier run the same day printed the legacy sentinel, because the activation manifest still selected the policy hash from before the mode's docs changed. Re-pinning both activation manifests and running `compiled-route-sync.cjs` with `--finalize` restored the compiled decision. |

---

## 3. CROSS-LINKS

| File | Contents |
|---|---|
| `results.csv` | The same verdicts, one row per scenario and runtime |
| `source.md` | Where the corpus and the raw evidence live |
