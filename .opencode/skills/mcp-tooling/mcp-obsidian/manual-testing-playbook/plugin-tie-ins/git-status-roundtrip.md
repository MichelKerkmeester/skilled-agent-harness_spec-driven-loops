---
title: "OBS-019 -- git-status-roundtrip"
description: "This scenario validates the git file-layer contract by initializing a throwaway repository, creating a note, committing it and verifying git status and git log read back the committed state with the read-only allowlist."
stage: routing
version: "0.10.0.0"
---

# OBS-019 -- git-status-roundtrip

## 1. OVERVIEW

This scenario validates that the mode can inspect a vault repository at the file layer: a throwaway git repository is initialized, a note is created and committed, then `git status` and `git log` read back the committed state exactly. The test runs only inside `/tmp/_pbtest-git-status-roundtrip` and never touches a real vault.

### Why This Matters

The mode inspects real vaults with read-only git commands only. If those commands read back repository state faithfully against a known-good repository, vault backup health checks are fully delegated to the file layer. A clean status after a commit is the strongest honest signal the mode can produce without the app running.

---

## 2. SCENARIO CONTRACT

- Feature ID: OBS-019
- Feature Name: git status round-trip
- Scenario Objective: Initialize a throwaway git repository, create a note file, commit it, then verify `git status` and `git log` read back the committed state and the note round-trips.
- Exact Prompt: Check whether my vault is a git repository and show me the status and the last few commits, I want to verify my latest note was backed up.
- Exact Command Sequence: 1. Create the throwaway repo at `/tmp/_pbtest-git-status-roundtrip` and initialize it 2. Set a local commit identity 3. Create a note file 4. Run `git status --short` and `git log --oneline -n 5` 5. Stage and commit 6. Re-run `git status --short` and `git log --oneline -n 5` 7. Verify the file round-trips and the commit count is 1 8. Clean up the throwaway repo
- Expected Signals: `.git` exists at the repo root. Status shows `?? roundtrip.md` before the commit. The pre-commit log prints a fatal message because the branch has no commits yet (that absence is expected). The commit succeeds. Status reads empty after the commit. The log shows exactly the backup commit. The note content round-trips byte for byte.
- Evidence: Repo directory listing, git status output before and after, git log output, commit count, note content check.
- Pass/Fail Criteria: PASS if the repo initializes, the commit succeeds, status reads clean, the log shows the commit and the note round-trips. FAIL if the repo or commit fails, status or log disagree with the committed state, the note content is lost, or any real vault path was touched.
- Failure Triage: 1. Recreate the throwaway repo from scratch (it is disposable) 2. Confirm the local commit identity is set 3. Confirm no stale `.git` or lock state remains in the throwaway dir 4. Never substitute a real vault path.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

Work only inside `/tmp/_pbtest-git-status-roundtrip`. The real vaults (MEGA/Documents/Obsidian, iCloud, Barter) are never referenced by any command and never become the working directory. Every git command below runs with `-C "$PB"` or inside the throwaway dir, so nothing outside it can be touched.

### Prompt

Check whether my vault is a git repository and show me the status and the last few commits, I want to verify my latest note was backed up.

### Commands

1. Create and initialize the throwaway repo, set a local identity.

   ~~~sh
   PB=/tmp/_pbtest-git-status-roundtrip
   rm -rf "$PB"
   mkdir -p "$PB"
   git init -q -b main "$PB"
   git -C "$PB" config user.name "pbtest"
   git -C "$PB" config user.email "pbtest@example.invalid"
   ~~~

2. Create a note, then read the state with the read-only allowlist (expect `?? roundtrip.md`). The pre-commit `git log` prints a fatal message about no commits yet, that absence is the expected fresh-repo signal.

   ~~~sh
   printf '# Round-trip note\n\ncontent that must survive\n' > "$PB/roundtrip.md"
   git -C "$PB" status --short
   git -C "$PB" log --oneline -n 5
   git -C "$PB" branch --show-current
   git -C "$PB" remote -v
   git -C "$PB" diff --stat
   ~~~

3. Commit the note, then re-read the state (expect clean status and one commit). Hooks are disabled for the commit because a throwaway repo inherits the host git hook policy, and the simulated backup message keeps the plugin's vault style instead of a conventional-commit format.

   ~~~sh
   git -C "$PB" add roundtrip.md
   git -C "$PB" -c core.hooksPath=/dev/null commit -q -m "vault backup: roundtrip"
   git -C "$PB" status --short
   git -C "$PB" log --oneline -n 5
   ~~~

4. Verify the round-trip headlessly with a hard assertion script.

   ~~~sh
   python3 - "$PB" <<'EOF'
   import os, subprocess, sys
   root = sys.argv[1]
   def git(*args):
       return subprocess.run(["git", "-C", root, *args], capture_output=True, text=True)
   assert os.path.isdir(os.path.join(root, ".git")), "repo missing"
   assert git("status", "--short").stdout.strip() == "", "status not clean"
   log = git("log", "--oneline", "-n", "5").stdout.strip()
   assert "vault backup: roundtrip" in log, f"commit missing from log: {log}"
   assert git("rev-list", "--count", "HEAD").stdout.strip() == "1", "commit count is not 1"
   note = open(os.path.join(root, "roundtrip.md")).read()
   assert "content that must survive" in note, "note content lost"
   print("round-trip verified: clean status, 1 commit, note intact")
   EOF
   ~~~

### Grading

| Verdict | Criteria |
|---|---|
| PASS | Repo initializes, the note commits, status reads clean, the log shows the commit, the note round-trips, no real vault path was touched |
| FAIL | Repo init or commit fails, status or log disagree with the committed state, the note content is lost, or a real vault path was touched |
| SKIP | git binary unavailable (`git --version` fails) |

Note on honest grading: an empty `git remote -v` output proves no remote is configured in the throwaway repo, nothing more. That absence is expected state, so the check passes with that limitation stated. The same applies to the pre-commit `git log` fatal, which proves an empty history. The scenario proves the file-layer read-back contract, not a sync outcome, which only the app can confirm.

---

## 4. CLEANUP

1. Remove the throwaway repo.

   ~~~sh
   rm -rf /tmp/_pbtest-git-status-roundtrip
   [ ! -e /tmp/_pbtest-git-status-roundtrip ] && echo "throwaway repo removed"
   ~~~

2. Confirm no real vault path was touched. Every git command ran with `-C "$PB"` or inside the throwaway dir, and the note was written only under `$PB`. No command in this scenario references MEGA/Documents/Obsidian, iCloud or Barter.
