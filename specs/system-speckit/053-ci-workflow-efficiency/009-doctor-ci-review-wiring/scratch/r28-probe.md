set exit=0
get exit=0
{"name":"SKILLED_CI_PROBE","value":"x"}
delete exit=0
get-after-delete exit=1
variable SKILLED_CI_PROBE was not found

Variable list before: [] (read 2026-10-25), after: [] . Variable name: SKILLED_CI_PROBE, set only for this probe and deleted in the same run.

Commands run, in order, against the source repository (each prints the exit line above):
- `gh variable set SKILLED_CI_PROBE --body x`
- `gh variable get SKILLED_CI_PROBE --json name,value`
- `gh variable delete SKILLED_CI_PROBE`
- `gh variable get SKILLED_CI_PROBE`

Live check after the delete: `gh variable list --json name,value` printed `[]`, so no `SKILLED_CI_PROBE` remains.
