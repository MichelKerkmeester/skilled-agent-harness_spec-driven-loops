TASK: restore one sentence the last edit of the skill's feature-catalog index dropped.
F = .skilled/skills/sk-communication/feature-catalog/feature-catalog.md (exists; the only file you edit)
Read F in full first. Apply the one edit exactly, character for character. Every other line stays byte-identical.
Why: line 21 held two sentences. The earlier brief quoted only the second one, so replacing "that whole line" dropped the first. This puts it back.

EDIT 1. F:21 now reads:
```
Each feature summary links to a per-feature reference with implementation and test anchors under `.skilled/skills/sk-communication/cli-communication-projection/`, or under `.skilled/skills/sk-communication/benchmark/reply-harness/` for the offline judge measurement.
```
Replace that one line with this one line (the same line with the first sentence in front of it):
```
Use this catalog as the canonical inventory for the shipped communication-projection surface. Each feature summary links to a per-feature reference with implementation and test anchors under `.skilled/skills/sk-communication/cli-communication-projection/`, or under `.skilled/skills/sk-communication/benchmark/reply-harness/` for the offline judge measurement.
```

Accept when: 1 file changed (F), no other file changed, `grep -c "^Use this catalog as the canonical inventory" F` prints 1, `grep -c "^### " F` prints 13, and the validator exits 0.
Checks you run, from the repo root:
- `grep -c "^Use this catalog as the canonical inventory" .skilled/skills/sk-communication/feature-catalog/feature-catalog.md` (expect 1)
- `grep -c "^### " .skilled/skills/sk-communication/feature-catalog/feature-catalog.md` (expect 13)
- `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-communication/feature-catalog/feature-catalog.md` (expect exit 0)
