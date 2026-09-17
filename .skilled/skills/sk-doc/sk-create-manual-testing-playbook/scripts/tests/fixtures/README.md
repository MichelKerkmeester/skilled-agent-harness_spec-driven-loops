# Validator Fixture Matrix

The clean package is the positive fixture for every operator-contract check. The test harness copies it into a
temporary directory and applies one named negative mutation per check, so the repository keeps one readable contract
fixture instead of duplicating the same scenario dozens of times.

The source shape follows an operator scenario in `sk-git/manual-testing-playbook/commit-formation/` and contains no
credentials, machine-local paths, or live run transcript. The negative mutations cover section order and absence,
frontmatter, each unconditional field, all three conditional rules, verdicts, filenames, duplicate IDs, index
orphans and phantoms, census warnings, local paths, evergreen truth, placeholders, strict exit behavior, and both
the explicit whole-tree and per-file routing-gold exclusions. The per-file fixture carries the same non-empty
`expected_workflow_mode` plus typed `expected_leaf_resources` signature consumed by the topology gate.
