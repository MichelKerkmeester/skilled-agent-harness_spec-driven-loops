# 2026-11-21--manual-testing-playbook--hub-path-live

> mcp-chrome-devtools · manual-testing-playbook · five live CLI scenarios from the mcp-browser-use hub path · bdg 0.6.10

---

## 1. HEADLINE / OVERVIEW

Verdict: FAIL.

Five non-destructive `bdg` scenarios ran once against `https://example.com` from the packet's new home under `mcp-browser-use`. Install, session start, the screenshot and session stop passed. The `h1` query failed: example.com served no `h1` element, so `bdg dom query "h1"` found no nodes.

Tally: 4 PASS, 1 FAIL.

---

## 2. AGGREGATE RESULTS

| Scenario | File | Verdict | Observed |
|---|---|---|---|
| BDG-001 | `cli-bdg-lifecycle/install-version.md` | PASS | `/opt/homebrew/bin/bdg`, version `0.6.10` |
| BDG-002 | `cli-bdg-lifecycle/session-start.md` | PASS | `Session Started`, status `ACTIVE` on `https://example.com/` |
| BDG-008 | `dom-and-screenshot/query-selector.md` | FAIL | `No nodes found matching "h1"`, grep exit 1 |
| BDG-010 | `dom-and-screenshot/screenshot-capture.md` | PASS | PNG written, 88088 bytes, magic bytes `8950 4e47` |
| BDG-004 | `cli-bdg-lifecycle/session-stop.md` | PASS | `Session stopped`, no active session, Chrome process count 17 to 8 |

---

## 3. METHODOLOGY

The packet playbook already points at `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/`. A search of the playbook for `.skilled/skills/` paths found only the new hub path and `mcp-code-mode` paths, and no `mcp-tooling` path. Before the run the playbook validated with 0 violations.

`bdg` launched its own browser profile. Its default user data folder is `~/.bdg/chrome-profile`, per `bdg --help`, so no signed-in profile was touched. No form was filled or submitted. Each scenario ran once in the order 001, 002, 008, 010, 004. The first attempt at BDG-002 never reached `bdg`, because my wrapper called a `timeout` command that macOS lacks (`command not found: timeout`, exit 127). It was rerun without the wrapper. That was a wrapper error, not a scenario result.

---

## 4. RECORDED OUTPUT

### BDG-001

```text
$ command -v bdg
/opt/homebrew/bin/bdg
EXIT=0
$ bdg --version 2>&1
0.6.10
EXIT=0
```

### BDG-002

```text
$ bdg https://example.com

Session Started

Target: https://example.com/
[command help text truncated]
EXIT=0
$ bdg status 2>&1
Session Status    [divider and section lines trimmed]
Status:           ACTIVE
Duration:         4s
Daemon PID:       78261
Chrome PID:       78264 (running)
Port:             9222
URL:              https://example.com/
Title:            Example Domain
Network Requests: 2 captured
Console Messages: 0 captured
EXIT=0
```

### BDG-008

```text
$ bdg status 2>&1 | grep -i example.com
URL:              https://example.com/
EXIT=0
$ bdg dom query "h1" 2>&1
No nodes found matching "h1"

Suggestions:
  Verify selector: bdg dom eval "document.querySelector('h1')"
  List elements:   bdg dom query "*"
EXIT=0
$ bdg dom query "h1" 2>&1 | grep -i "Example Domain"
EXIT=1
```

A triage read after the verdict, which did not change it:

```text
$ bdg dom eval "document.querySelectorAll('h1').length + ' ' + document.title"
"0 Example Domain"
EXIT=0
```

The page title is still `Example Domain`, but the page has no `h1`. The scenario assumes an `h1` that example.com no longer serves.

### BDG-010

```text
$ rm -f /tmp/bdg-test.png
EXIT=0
$ bdg dom screenshot /tmp/bdg-test.png 2>&1
Screenshot captured

Path:       /tmp/bdg-test.png
Format:     PNG
Dimensions: 1920x908
Size:       86.0 KB
Full page:  yes
EXIT=0
$ ls -la /tmp/bdg-test.png
-rw-r--r--@ 1 <user>  wheel  88088 Nov 21 16:05 /tmp/bdg-test.png
EXIT=0
$ xxd /tmp/bdg-test.png | head -1
00000000: 8950 4e47 0d0a 1a0a 0000 000d 4948 4452  .PNG........IHDR
EXIT=0
```

### BDG-004

```text
$ pgrep -fl chrome | wc -l
      17
$ bdg stop
Session stopped. Output saved to: ~/.bdg/session.json
EXIT=0
$ bdg status 2>&1
[bdg] Starting daemon...
[cleanup] Removing stale session files...
[cleanup] Stale session cleanup complete
[bdg] Daemon started successfully
No active session found
EXIT=0
$ pgrep -fl chrome | wc -l
       8
```

`bdg status` after the stop started a fresh daemon. It reports no session, and the Chrome process count fell.

---

## 5. FINDINGS

1. BDG-008 depends on an `h1` on example.com, and the page served none on 2026-11-21. The scenario needs a selector the page carries, which is a corpus revision for the packet owner.
2. `bdg status` starts a daemon when none is running, so a status check after `bdg stop` leaves a daemon behind.

---

## 6. CAVEATS

Each scenario ran once on macOS. The MCP parallel-instance and destructive scenarios were not run.

---

## 7. RECOMMENDATIONS

Tier 1, apply now: none.

Tier 2, validate first: revise BDG-008 to query an element example.com serves today, for example `p`, then rerun it in a new folder.

Tier 3, future: run the MCP parallel-instance scenarios through Code Mode.

---

## 8. REPRODUCIBILITY

Run the five files named in section 2 in that order from the repository root. Each one lists its exact commands.

---

## 9. CROSS-LINKS

| File | Contents |
|---|---|
| `source.md` | Where the corpus and the raw evidence live |
