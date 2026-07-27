# Deferred findings — could not be tested

20 findings could not be dispositioned. Deferred means the claim was not testable in this
pass, not that it is harmless. Each needs either a better-targeted verification or an operator
decision before its owning phase can act.

| Category | Count |
|---|---|
| CAT-1 | 4 |
| CAT-2 | 3 |
| CAT-3 | 2 |
| CAT-4 | 1 |
| CAT-5 | 7 |
| CAT-6 | 3 |

| finding | cat | why it could not be tested |
|---|---|---|
| `fanout:F1` | CAT-1 | (35\ |
| `fanout:F10` | CAT-1 | (35\ |
| `fanout:F22` | CAT-1 | (35\ |
| `fanout:F9` | CAT-1 | (35\ |
| `fanout:F18` | CAT-2 | No claim text in worklist row to test; file exists as a real router doc. Cannot confirm or refute an absent claim. |
| `fanout:F2` | CAT-2 | No claim text; path `:memory:` is a SQLite in-memory handle, not a real filesystem path (no file found). Nothing to test. |
| `fanout:F7` | CAT-2 | No claim text; directory contains no files (find returns empty). Nothing to test. |
| `fanout:F13` | CAT-3 | All files found by `find_file_by_name` are real readable files (README.md has 1595 lines of content); cannot detect broken symlinks without `ls -la` or `find -type l`, which require shell access that |
| `fanout:F21` | CAT-3 | `find_file_by_name` returns no files, but `node_modules` is gitignored (`**/node_modules` line 80) so the find tool skips it; cannot verify directory existence without shell access |
| `fanout:F16` | CAT-4 | 4 `description.json` files exist (fixtures 002, 003, 004, 053); claim column is empty — no stated assertion to test against |
| `fanout:F11` | CAT-5 | (35\ |
| `fanout:F14` | CAT-5 | (35\ |
| `fanout:F17` | CAT-5 | (35\ |
| `fanout:F19` | CAT-5 | (35\ |
| `fanout:F20` | CAT-5 | (35\ |
| `fanout:F3` | CAT-5 | (35\ |
| `fanout:F8` | CAT-5 | (35\ |
| `fanout:F12` | CAT-6 | No claim text; 4 fanout scripts exist (fanout-merge/pool/run/salvage.cjs). Cannot test an absent claim. |
| `fanout:F15` | CAT-6 | No claim text; 6 such folders exist, each with a real feature-catalog .md doc. Cannot test an absent claim. |
| `fanout:F4` | CAT-6 | No claim text; directory exists with real .cjs code (decision-contract.cjs 484 lines, projector.cjs). Cannot test an absent claim. |
