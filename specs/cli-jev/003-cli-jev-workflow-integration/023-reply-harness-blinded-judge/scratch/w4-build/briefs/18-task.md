TASK: add the offline judge measurement to the skill's feature-catalog index.
F = .skilled/skills/sk-communication/feature-catalog/feature-catalog.md (exists; the only file you edit)
Read F in full first. Apply the three edits exactly, character for character. Every other line stays byte-identical.

EDIT 1. F:9 reads `last_updated: "2026-09-14"`. Change it to `last_updated: "2026-09-29"`.

EDIT 2. F:21 reads:
```
Each feature summary links to a per-feature reference with implementation and test anchors under `.skilled/skills/sk-communication/cli-communication-projection/`.
```
Replace that whole line with:
```
Each feature summary links to a per-feature reference with implementation and test anchors under `.skilled/skills/sk-communication/cli-communication-projection/`, or under `.skilled/skills/sk-communication/benchmark/reply-harness/` for the offline judge measurement.
```

EDIT 3. Section `## 6. EVALUATION AND OBSERVABILITY` ends with the `### Content-free observability` entry, its `See [...]` line, a blank line, a `---` line and a blank line, just above `## 7. PACKAGING AND RELEASE`. Insert the block below directly above the `## 7. PACKAGING AND RELEASE` line, then one `---` line and one blank line, so the new entry sits between two `---` lines like every other entry:
````markdown
### Offline judge agreement

#### Description

Measures offline whether a Deem or Jev score per rubric dimension agrees with the operator's grades of masked replies more often than the mechanical scores, with a zero-call default and a label gate.

#### Current Reality

`judge-agreement.mjs` joins masked replies to their reply files by the SHA-256 of the reply text, scores the baseline with `score.mjs` unchanged and stops below 20 operator-graded replies without calling a model. `--jev` and `--deem` each run only after their own check and with `--out <dir>`, ask one `score` per reply and dimension, and print one verdict per column under a keep rule fixed before any run. No verdict reaches `compare.mjs` or the release gate.

#### Source Files

See [`evaluation-and-observability/offline-judge-agreement.md`](evaluation-and-observability/offline-judge-agreement.md) for full implementation and test file listings.

---
````

Accept when: 1 file changed (F), `grep -c "^### " F` prints 13, and the validator exits 0.
Checks you run, from the repo root:
- `grep -c "^### " .skilled/skills/sk-communication/feature-catalog/feature-catalog.md` (expect 13)
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/feature-catalog/feature-catalog.md` (expect exit 0)
