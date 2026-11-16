#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: HOOK README WORKER DISPATCH
# ───────────────────────────────────────────────────────────────
# Runs one Vibe print-mode worker on a brief, and records which paths a wave
# of workers changed.
#
# Usage:
#   dispatch.sh run <brief.md>   one worker run, recorded in runs/<brief name>/
#   dispatch.sh snap <name>      save the tree id of the working tree
#   dispatch.sh changed <name>   list the paths that differ from that snapshot
#
# Exit Codes:
#   0 - Success. For run: export.json holds exit_code 0 and outcome finished
#   1 - Invalid arguments or a failed preflight
#   2 - The run ended with any other verdict

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRATCH_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKET_DIR="$(dirname "$SCRATCH_DIR")"
REPO_ROOT="$(git -C "$SCRATCH_DIR" rev-parse --show-toplevel)"
readonly SCRATCH_DIR PACKET_DIR REPO_ROOT

readonly MODEL="deepseek-flash"
readonly REQUIRED_VERSION="vibe 3.1.2"
readonly TIME_LIMIT_SECONDS=1200
readonly SNAP_DIR="$SCRATCH_DIR/snaps"

# ───────────────────────────────────────────────────────────────
# 2. HELPERS
# ───────────────────────────────────────────────────────────────

fail() {
    echo "dispatch: $1" >&2
    exit 1
}

# Fail closed before a command is built, as the Vibe dispatch contract requires.
preflight() {
    local version
    command -v vibe >/dev/null 2>&1 || fail "vibe is not on PATH"
    version="$(vibe --version </dev/null)"
    [[ "$version" == "$REQUIRED_VERSION" ]] || fail "expected $REQUIRED_VERSION, found $version"
    [[ -n "${MISTRAL_API_KEY:-}" ]] || fail "MISTRAL_API_KEY is not exported"
}

# Print the tree id of the working tree, untracked files included.
# The real index stays untouched: most hook READMEs are already modified, so
# only a tree comparison can show which file one wave of workers changed.
working_tree_id() {
    local index_copy
    index_copy="$(mktemp "${TMPDIR:-/tmp}/hook-readme-index.XXXXXX")"
    cp "$(git -C "$REPO_ROOT" rev-parse --path-format=absolute --git-path index)" "$index_copy"
    GIT_INDEX_FILE="$index_copy" git -C "$REPO_ROOT" add -A
    GIT_INDEX_FILE="$index_copy" git -C "$REPO_ROOT" write-tree
    rm -f "$index_copy"
}

# ───────────────────────────────────────────────────────────────
# 3. SUBCOMMANDS
# ───────────────────────────────────────────────────────────────

run_brief() {
    local brief="$1"
    local name record_dir run_dir home verdict
    local status=0
    local started="$SECONDS"

    [[ -f "$brief" ]] || fail "brief not found: $brief"
    brief="$(cd "$(dirname "$brief")" && pwd)/$(basename "$brief")"
    name="$(basename "$brief" .md)"
    record_dir="$SCRATCH_DIR/runs/$name"
    [[ ! -e "$record_dir" ]] || fail "run folder exists, give a retry brief a new name: $record_dir"
    preflight

    # The home stays outside the checkout, so no log or trust store lands in it.
    run_dir="$(mktemp -d "${TMPDIR:-/tmp}/hook-readme-worker.XXXXXX")"
    home="$run_dir/.vibe-home"
    mkdir -p "$home" "$record_dir/cwd"
    # An empty home offers no roster alias, so the model rows are copied in.
    cp "$REPO_ROOT/.vibe/config.toml" "$home/config.toml"

    # --add-dir also loads the checkout's own hooks.toml, and those hooks find
    # the checkout with git from the cwd. Started outside git, every hook fails
    # and every tool call is skipped, so a write run starts below the root.
    # Print mode leaves a shell call at "ask" with nobody to answer, so without
    # --auto-approve the worker cannot run its own check.
    cd "$record_dir/cwd" \
        && node "$REPO_ROOT/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$home" \
            >"$record_dir/render.txt" 2>&1 \
        && AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 SPECKIT_DIST_AUTO_REBUILD=0 \
            VIBE_SPEC_FOLDER="$PACKET_DIR" VIBE_HOME="$home" \
            vibe --prompt-file "$brief" --model "$MODEL" --add-dir "$REPO_ROOT" --auto-approve \
            --time-limit "$TIME_LIMIT_SECONDS" --output-dir "$run_dir/out" \
            </dev/null >"$record_dir/stdout.txt" 2>"$record_dir/stderr.txt" \
        || status=$?

    verdict="export=missing"
    if [[ -f "$run_dir/out/export.json" ]]; then
        cp -R "$run_dir/out/." "$record_dir/"
        verdict="$(python3 -c 'import json, sys
record = json.load(open(sys.argv[1]))
print("exit_code={} outcome={} cost_usd={}".format(record.get("exit_code"), record.get("outcome"), record.get("cost_usd")))' "$record_dir/export.json")"
    fi
    # Vibe unpacks its plugin packages read-only into the home's log folder.
    chmod -R u+w "$run_dir"
    rm -rf "$run_dir"

    echo "RUN $name process_exit=$status $verdict seconds=$((SECONDS - started))"
    # The verdict is the pair in export.json, never the process exit status.
    [[ "$verdict" == "exit_code=0 outcome=finished "* ]] || return 2
}

# A staged file or a commit leaves the working tree as it was, so HEAD and the
# tree of the real index are recorded beside the working-tree id.
repo_state() {
    echo "head $(git -C "$REPO_ROOT" rev-parse HEAD)"
    echo "index $(git -C "$REPO_ROOT" write-tree)"
}

snap() {
    local name="$1"
    mkdir -p "$SNAP_DIR"
    working_tree_id >"$SNAP_DIR/$name.tree"
    repo_state >"$SNAP_DIR/$name.state"
    echo "SNAP $name $(cat "$SNAP_DIR/$name.tree")"
}

changed() {
    local name="$1"
    local before after
    [[ -f "$SNAP_DIR/$name.tree" ]] || fail "no snapshot named $name"
    if [[ -f "$SNAP_DIR/$name.state" ]]; then
        # diff exits 1 when it finds a move, which is the case being reported.
        repo_state | { diff "$SNAP_DIR/$name.state" - || true; } | sed -n 's/^> /MOVED /p'
    fi
    before="$(cat "$SNAP_DIR/$name.tree")"
    after="$(working_tree_id)"
    # The snapshot files are written after the tree is read, and the run records
    # are this script's own output, so both are left out.
    git -C "$REPO_ROOT" diff-tree -r --name-only "$before" "$after" -- . \
        ":(exclude)${SNAP_DIR#"$REPO_ROOT"/}" ":(exclude)${SCRATCH_DIR#"$REPO_ROOT"/}/runs"
}

# ───────────────────────────────────────────────────────────────
# 4. MAIN
# ───────────────────────────────────────────────────────────────

main() {
    [[ $# -eq 2 ]] || fail "usage: dispatch.sh run <brief.md> | snap <name> | changed <name>"
    case "$1" in
        run) run_brief "$2" ;;
        snap) snap "$2" ;;
        changed) changed "$2" ;;
        *) fail "unknown subcommand: $1" ;;
    esac
}

main "$@"
