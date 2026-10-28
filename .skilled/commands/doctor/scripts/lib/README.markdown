---
title: "Lib: the CI and quality doctor modules"
description: "The modules behind /doctor:ci and /doctor:sk-code quality: the CI repository profile reader, the CI report's sources, workflow analysis and rendering, and the quality doctor's folders, config source, applied rules, views, init and script contract."
version: 1.0.0.0
---

# Lib

> Documents `.skilled/commands/doctor/scripts/lib/`. This README uses the `.markdown` extension because
> OpenCode registers every `.md` file under `.skilled/commands/` as a command.

---

## 1. OVERVIEW

`lib/` holds the modules two doctor entry points split their work into, so each entry keeps its flags and its one call and no file grows past the size a reader can hold. `../ci-report.cjs`, `../ci-toggle.cjs` and `../ci-scaffold.cjs` read the repository's CI conventions through `ci-profile.cjs`, and the report builds its document from the three `ci-report-*` modules. `../sk-code-quality-config.cjs` answers every `/doctor:sk-code quality` mode through the `quality-*` modules, which read the repository config through the sk-code-quality runner's own modules, so the doctor never keeps a second copy of config discovery or the override grammar.

Every module here only reads, apart from `quality-config-init.cjs`, which writes the repository quality config, and only when the caller passes `--apply`.

---

## 2. CONTENTS

```text
lib/
+-- ci-profile.cjs
+-- ci-report-render.cjs
+-- ci-report-sources.cjs
+-- ci-report-text.cjs
+-- ci-report-workflows.cjs
+-- quality-applied-rules.cjs
+-- quality-config-init.cjs
+-- quality-config-source.cjs
+-- quality-report-view.cjs
+-- quality-script-io.cjs
`-- quality-skill-paths.cjs
```

| File | Purpose |
|------|---------|
| `ci-profile.cjs` | The only reader of a repository's CI profile: its branch names, switch variables, the workflows that must stay on, the path twins, the workflows README and the setup action, so the report, the toggle and the scaffold agree |
| `ci-report-sources.cjs` | What the report reads from outside the workflow files: the repository variables through `gh variable list`, the branch the repository integrates on and the newest commit on it that is not a trigger-index rebuild |
| `ci-report-workflows.cjs` | The workflow files themselves: discovery under `.github/workflows/`, the YAML parse, the switch state per job, the drift flags, the purpose column from the workflows README and the switch names the report lists |
| `ci-report-render.cjs` | The report document and its two renderings, the JSON a machine reads and the table a person reads, both built from the same readings |
| `ci-report-text.cjs` | Cuts a gh failure or a YAML parse error to its first line, so one message fits a table row, a JSON field and a stderr line |
| `quality-skill-paths.cjs` | The sk-code-quality folder this doctor reads, resolved from this file's own location, and the runner modules it borrows: the config reader, `run-check.cjs` and the gate |
| `quality-config-source.cjs` | Where the repository quality config came from, whether the runner trusts it and which core hygiene rules it switches off |
| `quality-applied-rules.cjs` | Which checklists, hygiene rules and override rows the gate would apply here, read from the runner's `--explain`, which starts no check and writes no file |
| `quality-report-view.cjs` | The two read-only modes, `status` and `check`, each rendered as the lines a person reads and the document `--json` prints |
| `quality-config-init.cjs` | The one mode that writes: it shows the config it would create from the shipped template and writes it only with `--apply`, never over an existing file |
| `quality-script-io.cjs` | The typed request failure that carries an exit code and a `STATUS=` code, and the single place the report reaches stdout |

---

## 3. CONSUMERS

- `../ci-report.cjs` requires `ci-profile.cjs`, `ci-report-sources.cjs`, `ci-report-workflows.cjs` and `ci-report-render.cjs`.
- `../ci-toggle.cjs` requires `../ci-report.cjs` and `ci-profile.cjs`, and `../ci-scaffold.cjs` requires `ci-profile.cjs`.
- `../sk-code-quality-config.cjs` requires `quality-skill-paths.cjs`, `quality-script-io.cjs`, `quality-report-view.cjs` and `quality-config-init.cjs`.
- `../tests/ci-profile.test.cjs`, `../tests/ci-report.test.cjs`, `../tests/ci-report-profile.test.cjs`, `../tests/ci-toggle.test.cjs`, `../tests/ci-scaffold.test.cjs` and `../tests/sk-code-quality-config.test.cjs` cover these modules through their entry points, and `../tests/doctor-ci-contract.test.cjs` checks that every module ships.

---

## 4. RELATED

- [`Doctor scripts README`](../README.markdown)
- [`Doctor script tests`](../tests/README.markdown)
- [`sk-code-quality scripts lib`](../../../../skills/sk-code/sk-code-quality/scripts/lib/README.md)
