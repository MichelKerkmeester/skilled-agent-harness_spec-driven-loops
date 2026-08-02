#!/usr/bin/env bash
# Install the headless notesmd-cli via Homebrew (with printed fallbacks) and
# print the steps to enable the official obsidian CLI. Prints only for the
# official CLI, it never toggles anything inside the desktop app.
set -euo pipefail

print_official_cli_steps() {
  cat <<'EOF'

── Official obsidian CLI (app-backed, optional) ──────────────────────
The official `obsidian` CLI ships inside the Obsidian desktop app
(v1.12.4+, free). There is no npm or Homebrew package to install, and
these steps are printed only — nothing is toggled for you.

Enable it in the desktop app:
  1. Settings → General → Command line interface
  2. Toggle it on
  3. Click "Register CLI"  (adds `obsidian` to PATH on macOS/Linux)

It remote-controls a RUNNING app (launching it if not running), so it is
not a headless/filesystem tool. Verify with: obsidian --help
──────────────────────────────────────────────────────────────────────
EOF
}

# ── Headless notesmd-cli ──────────────────────────────────────────────────────
if command -v notesmd-cli >/dev/null 2>&1; then
  echo "notesmd-cli already installed at $(command -v notesmd-cli)"
  print_official_cli_steps
  exit 0
fi

if command -v brew >/dev/null 2>&1; then
  echo "Installing notesmd-cli via Homebrew..."
  brew tap yakitrak/yakitrak
  brew install yakitrak/yakitrak/notesmd-cli
  echo "notesmd-cli installed. Register a vault: notesmd-cli add-vault <path>"
else
  cat <<'EOF'
Homebrew not found. Install notesmd-cli one of these ways instead:

  Scoop (Windows):
    scoop bucket add scoop-yakitrak https://github.com/yakitrak/scoop-yakitrak.git
    scoop install notesmd-cli

  AUR (Arch Linux):
    yay -S notesmd-cli-bin

  From source (Go 1.19+, `go install` is NOT supported):
    git clone https://github.com/Yakitrak/obsidian-cli
    cd obsidian-cli && go build -o notesmd-cli
    # then move the notesmd-cli binary onto your PATH
EOF
fi

print_official_cli_steps
