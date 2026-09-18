# Iteration 004: Reference rewrite

**Executor.** gpt-5.6-luna, reasoning max, service tier fast, read-only sandbox.

## REF-001 Central install-guide row points to a retired path

- **Severity:** P2
- **File:** `PUBLIC-RELEASE.md:57`
- **Trigger:** An operator follows the shared-components table.
- **Consequence:** `.opencode/install-guides/` no longer exists, and no `.skilled/install-guides/` replacement exists.
- **Evidence:** The tip deletes both central guide roots; both `test -e` checks fail.
- **Fix:** Remove this row or point it to surviving skill-owned guides.

## REF-002 Flowchart validation command points to a missing script

- **Severity:** P1
- **File:** `.skilled/skills/sk-doc/README.md:191`
- **Trigger:** Running the documented flowchart validation command.
- **Consequence:** Bash cannot find `.skilled/skills/sk-doc/scripts/validate-flowchart.sh`.
- **Evidence:** The tip contains the validator only at `.skilled/skills/sk-design/sk-design-diagram/scripts/validate-flowchart.sh`; the documented path is absent.
- **Fix:** Update the command to the existing validator path.
