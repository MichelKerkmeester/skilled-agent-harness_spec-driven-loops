TASK: add one short paragraph to the system-spec-kit README's retrieval paragraph group naming the new track-narrowing script, its zero-call default and its two switches. One literal insert in one file.
F = .skilled/skills/system-spec-kit/README.md. Read F first. Change nothing else in it.

1. F:300 starts the paragraph "Retrieval is now two lexical lanes over committed files." and F:306 ends it with the line "clean no-hit.". After F:306 insert one blank line and then these four lines, so one blank line still separates them from the `---` line that follows:
`runtime/cli/retrieval/score-track-narrowing.mjs` measures offline whether a classifier that names
the spec track would beat those two lanes. Its default run makes no model call and writes no file;
`--deem` and `--jev` each add a model column behind that backend's own check. It changes no lookup,
index or recipe.

VERIFY (repo root):
  grep -c "score-track-narrowing" .skilled/skills/system-spec-kit/README.md   (expect 1)
  python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-spec-kit/README.md   (expect exit 0)
Accept when: 1 file changed and nothing else; the grep prints 1; the validator exits 0.
