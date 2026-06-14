#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Design fidelity helper - fetch a MagicPath component's backend-rendered preview
for the Claude Design parity fidelity check.

After `magicpath-ai code submit --wait`, the agent needs to compare the rendered
result against the design intent. MagicPath renders and screenshots every
revision server-side and returns it as `previewImageUrl` from `list-components`.
This helper fetches that URL (and downloads the image) so the agent can judge it,
without driving a browser at the session-gated `view`/`share` canvas URL.

The fidelity verdict is JUDGMENT, not pixel diffing: gate the render on the
sk-interface-design `ux_quality_reference.md` floor AND the anti-default critique
in `design_principles.md`. Automated screenshot comparison is unreliable for
subtle visual and color differences, so this tool fetches the evidence; it does
not score it.

Query-only. Standard library only. See ../../sk-interface-design/references/claude_design_parity.md.

Usage:
  python3 design_fidelity.py --project <projectId> [--component <name-or-id>] [--download-dir <dir>] [--json]
"""

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request
import urllib.error


def _run_cli(args):
    """Run magicpath-ai with JSON output; return parsed JSON or raise a clear error."""
    cmd = ["magicpath-ai", *args, "-o", "json", "-y"]
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
    except FileNotFoundError:
        raise SystemExit("error: magicpath-ai not found on PATH. Install it (scripts/install.sh) and `magicpath-ai login` first.")
    except subprocess.TimeoutExpired:
        raise SystemExit("error: magicpath-ai timed out.")
    if proc.returncode != 0:
        msg = (proc.stderr or proc.stdout or "").strip()
        raise SystemExit(f"error: magicpath-ai {' '.join(args)} failed: {msg[:300]}")
    try:
        return json.loads(proc.stdout)
    except json.JSONDecodeError:
        raise SystemExit(f"error: could not parse magicpath-ai JSON for: {' '.join(args)}")


def _slug(text):
    return re.sub(r"[^a-z0-9]+", "-", str(text).lower()).strip("-") or "component"


def _match(components, needle):
    """Return components matching needle by id or case-insensitive name substring."""
    if not needle:
        return components
    n = str(needle).lower()
    exact = [c for c in components if str(c.get("id", "")) == str(needle)]
    if exact:
        return exact
    return [c for c in components if n in str(c.get("name", "")).lower()
            or n in str(c.get("generatedName", "")).lower()]


def _download(url, dest_dir, name):
    os.makedirs(dest_dir, exist_ok=True)
    path = os.path.join(dest_dir, f"{_slug(name)}-preview.png")
    try:
        with urllib.request.urlopen(url, timeout=30) as resp, open(path, "wb") as f:
            f.write(resp.read())
        return path, None
    except (urllib.error.URLError, urllib.error.HTTPError, OSError) as e:
        return None, str(e)


def main():
    parser = argparse.ArgumentParser(description="Fetch a MagicPath component preview for the fidelity check")
    parser.add_argument("--project", "-p", required=True, help="MagicPath project id")
    parser.add_argument("--component", "-c", default=None, help="Component id or name substring to target")
    parser.add_argument("--download-dir", "-d", default=None, help="Where to save preview images (default: a temp dir)")
    parser.add_argument("--json", action="store_true", help="Machine-readable output")
    args = parser.parse_args()

    data = _run_cli(["list-components", args.project])
    components = data.get("components", []) if isinstance(data, dict) else []
    targets = _match(components, args.component)

    dest_dir = args.download_dir or os.path.join(tempfile.gettempdir(), f"magicpath-preview-{_slug(args.project)}")
    results = []
    for c in targets:
        name = c.get("name") or c.get("generatedName") or c.get("id") or "component"
        url = c.get("previewImageUrl")
        entry = {"name": name, "id": c.get("id"), "previewImageUrl": url, "localPath": None, "note": None}
        if not url:
            entry["note"] = "no previewImageUrl yet (run `code submit --wait` first, then retry)"
        else:
            local, err = _download(url, dest_dir, name)
            if local:
                entry["localPath"] = local
            else:
                entry["note"] = f"download failed ({err}); fetch the URL manually if needed"
        results.append(entry)

    out = {
        "project": args.project,
        "matched": len(results),
        "totalComponents": len(components),
        "results": results,
        "fidelityReminder": "Judge the render against ux_quality_reference.md (the quality floor) AND the design_principles.md anti-default critique. This is judgment, not pixel diff.",
    }

    if args.json:
        print(json.dumps(out, indent=2, ensure_ascii=False))
        return

    if not results:
        print(f"No components matched in project {args.project} (total {len(components)}). "
              f"Use --component to filter, or check the project id.")
        return
    print(f"## Fidelity preview ({len(results)} of {len(components)} components)")
    for e in results:
        print(f"\n### {e['name']}")
        print(f"- previewImageUrl: {e['previewImageUrl'] or '(none yet)'}")
        if e["localPath"]:
            print(f"- saved: {e['localPath']}  (Read this image, then judge it)")
        if e["note"]:
            print(f"- note: {e['note']}")
    print(f"\n{out['fidelityReminder']}")


if __name__ == "__main__":
    main()
