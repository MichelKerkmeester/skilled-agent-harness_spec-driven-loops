---
title: "Marked screenshots"
description: "`vision` saves a PNG and returns its `image_path`, optionally overlaid with numbered ref badges through `--marks`."
trigger_phrases:
  - "marked screenshots"
  - "bladebro vision"
  - "bladebro vision marks"
  - "bladebro screenshot"
version: 1.0.0.0
---

# Marked screenshots (vision)

## 1. OVERVIEW

`vision` saves a PNG and returns its `image_path`, optionally overlaid with numbered ref badges through `--marks`.

The badges match the structural model's refs, so an agent can look at the image and then click by ref. The PNG lands in the data root's artifacts folder, which can hold page content and stays private.

---

## 2. HOW IT WORKS

`bladebro vision` always writes a PNG to a file and prints its path, and with `--json` the path sits in `image_path`. `--marks` overlays numbered ref badges in the Set-of-Marks style and reports how many elements it marked. The structural model from `see` is cheaper and gives actionable refs, so vision is the last resort. The artifact is checked on disk, by existence, size and file type, rather than trusted from the response.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md` | Shared | The `vision` tool and the `image_path` field |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/examples/agent-browser-read.sh` | Script | Captures a marked PNG and checks its magic bytes |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/agent-browser/vision-marks.md` | Manual playbook | One marked screenshot of the current page |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md` | Benchmark | Recorded `image_path` and mark count |

---

## 4. SOURCE METADATA

- Group: Agent Browser
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `agent-browser/marked-screenshots.md`

Related references:
- [page-reads.md](page-reads.md) - The cheaper structural read
- [tabs-cookies-and-sessions.md](tabs-cookies-and-sessions.md) - Tab state around a capture
