# Filed failures

No scenario recorded `FAIL`, so this file holds no failure row.

All 33 scenarios recorded `SKIP`, because the verb or the field each one drives is absent from the tree this run was taken on. A `FAIL` would file a defect against a phase that has not been built yet, and the corpus rule is that a scenario which cannot run records `SKIP` with its blocker rather than a verdict about behavior it never observed.

The blocker for each scenario is in its transcript under `transcripts/`, and the shared verb probe is `baseline-verbs.txt`.

| Scenario | Phase | Requirement | Observed | Evidence |
|---|---|---|---|---|
| none | - | - | no scenario reached a behavior it could judge | `results.csv` |
