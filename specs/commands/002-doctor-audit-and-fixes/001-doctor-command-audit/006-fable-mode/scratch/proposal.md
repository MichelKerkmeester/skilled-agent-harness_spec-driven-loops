# Proposal

Verdict: fix

The route, workflow, presentation file, audit script, metrics library and baseline snapshot are present, but the declared default target is missing in this checkout. The one read-only run, node .skilled/commands/doctor/scripts/fable-mode-check.cjs --dir "", exited 2 and printed a target under .skilled/specs/; the script computes that path from its default constant at fable-mode-check.cjs:13, 20. The workflow describes a default research corpus at doctor-fable-mode.yaml:42, but a repository search for the named corpus returned no directory. The route also accepts a baseline override without binding or forwarding it, and the visible manifest describes the metrics as review quality even though the workflow says they are drift detectors, not quality scores (_routes.yaml:172-178; doctor-fable-mode.yaml:43, 50, 60-61; doctor-speckit-presentation.txt:102).

## Minimal edits

### Require an existing target directory

File: .skilled/commands/doctor/scripts/fable-mode-check.cjs, lines 13 and 20.

Old behavior: DEFAULT_TARGET points to a research path beneath .skilled, and target resolution falls back to it. That path is missing in this checkout.

New behavior: remove the fixed default and fail clearly unless the caller supplies a path.

~~~js
const targetArg = flag('--dir') || positional;
if (!targetArg) {
  console.error('STATUS=ERROR fable-mode: pass --dir <path>');
  process.exit(2);
}
const target = path.resolve(targetArg);
~~~

File: .skilled/commands/doctor/assets/doctor-fable-mode.yaml, line 42.

Old text: target_dir says it defaults to the research corpus.

New text: target_dir is a required deep-loop artifact directory, either one lineage directory or a directory containing lineages/. Supply it with --dir or as the first positional argument.

File: .skilled/commands/doctor/assets/doctor-speckit-presentation.txt, after the existing setup prompts in lines 106-134.

Old text: no fable-mode setup prompt is present, although the router says unresolved setup values use per-target prompts (speckit.md:67-68).

New text to add:

~~~text
### Fable Mode Artifact Directory

Ask when target_dir was not supplied. Require a deep-loop artifact directory, either one lineage directory or a directory containing lineages/. Accept the path passed with --dir.
~~~

### Forward the baseline override

File: .skilled/commands/doctor/_routes.yaml, line 172.

Old text: setup_vars: [execution_mode, target_dir]

New text: setup_vars: [execution_mode, target_dir, baseline]

File: .skilled/commands/doctor/_routes.yaml, line 178.

Old text: node .skilled/commands/doctor/scripts/fable-mode-check.cjs --dir "{target_dir}"

New text: node .skilled/commands/doctor/scripts/fable-mode-check.cjs --dir "{target_dir}" --baseline "{baseline}"

File: .skilled/commands/doctor/assets/doctor-fable-mode.yaml, line 50.

Old text: the execution step passes target_dir as --dir.

New text: the execution step passes target_dir as --dir and baseline as --baseline, using the committed baseline path when no override was supplied.

### Match the metric description

File: .skilled/commands/doctor/assets/doctor-speckit-presentation.txt, line 102.

Old text: “Audit behavioral metrics for fable-mode review quality”

New text: “Report fable-5 behavioral metric drift against the baseline”

## FINDINGS

- The baseline snapshot records a source corpus path that is absent from this checkout. fable-baseline.json:2 contains the old absolute path; ls -ld on that path exited 1, and the exact directory-name search returned no match. The snapshot still contains aggregate metrics at fable-baseline.json:90-98, and the wrapper reads the aggregate object at fable-mode-check.cjs:31, but the recorded raw corpus cannot be used to reproduce those values here.
