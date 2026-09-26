#!/usr/bin/env python3
"""Measure per-interpreter startup separately from executing measured code.

Run with the Python version being investigated. --runtime can name another
checkout's runtime/python directory for a before/after comparison. Synthetic
plans deliberately include unused files: short-lived helpers still paid to
index all of these before entering user code. No timing threshold is used.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import statistics
import subprocess
import sys
import tempfile
import time


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--runtime", type=Path, default=Path(__file__).resolve().parents[1] / "runtime/python")
    parser.add_argument("--files", type=int, default=321)
    parser.add_argument("--statements", type=int, default=250)
    parser.add_argument("--decisions", type=int, default=25)
    parser.add_argument("--children", type=int, default=25)
    parser.add_argument("--timeout-ms", type=int, default=200)
    args = parser.parse_args()
    if min(args.files, args.statements, args.children, args.timeout_ms) < 1 or args.decisions < 0:
        parser.error("files, statements and children must be positive; decisions must be non-negative")
    plain = {k: v for k, v in os.environ.items() if not k.startswith("SUPERCOV_") and k != "PYTHONPATH"}

    def duration(environment):
        start = time.perf_counter()
        child = subprocess.run([sys.executable, "-c", "import bootstrap"], cwd=root, env=environment, capture_output=True, text=True)
        if child.returncode or "[supercov]" in child.stderr:
            raise RuntimeError((child.returncode, child.stderr))
        return (time.perf_counter() - start) * 1000

    def identifier(value):
        return hashlib.sha256(value.encode()).hexdigest()

    with tempfile.TemporaryDirectory(prefix="supercov-startup-") as directory:
        root = Path(directory)
        (root / "bootstrap.py").write_text("pass\n")
        files = {}
        for f in range(args.files):
            files[f"m{f}.py"] = {
                "statements": [{"id": identifier(f"{f}:s{i}"), "start": [i + 1, 0], "end": [i + 1, 5], "lines": [i + 1, i + 1]} for i in range(args.statements)],
                "decisions": [{
                    "id": identifier(f"{f}:d{i}"), "span": [[i + 1, 3], [i + 1, 10]],
                    "outcomeTrue": identifier(f"{f}:t{i}"), "outcomeFalse": identifier(f"{f}:f{i}"),
                    "conditions": [{"span": [[i + 1, 3], [i + 1, 4]], "not": 0}, {"span": [[i + 1, 9], [i + 1, 10]], "not": 0}],
                } for i in range(args.decisions)],
            }
        plan = root / "plan.json"
        plan.write_text(json.dumps({"version": 1, "root": str(root), "files": files}))
        measured = dict(plain, PYTHONPATH=str(args.runtime.resolve()), SUPERCOV_PYTHON_PLAN=str(plan), SUPERCOV_PYTHON_EVIDENCE_DIR=str(root / "evidence"), SUPERCOV_RUN_ID="benchmark")
        first_ms = duration(measured)
        normal, instrumented = [], []
        for _ in range(args.children):
            normal.append(duration(plain))
            instrumented.append(duration(measured))
        def partial_output(environment):
            try:
                result = subprocess.run(
                    [sys.executable, "-c", "import bootstrap, time; print('ready', flush=True); time.sleep(2)"],
                    cwd=root, env=environment, capture_output=True, timeout=args.timeout_ms / 1000,
                )
                return result.stdout.decode()
            except subprocess.TimeoutExpired as error:
                return (error.stdout or b"").decode()
        print(json.dumps({
            "python": sys.version.split()[0], "files": args.files,
            "statementsPerFile": args.statements, "decisionsPerFile": args.decisions,
            "planMB": round(plan.stat().st_size / 1e6, 2), "children": args.children,
            "firstInstrumentedMs": round(first_ms, 1),
            "plainMedianMs": round(statistics.median(normal), 1),
            "instrumentedMedianMs": round(statistics.median(instrumented), 1),
            "addedMedianMs": round(statistics.median(instrumented) - statistics.median(normal), 1),
            "plainTotalMs": round(sum(normal), 1), "instrumentedTotalMs": round(sum(instrumented), 1),
            "timeoutMs": args.timeout_ms,
            "plainPartialOutput": partial_output(plain), "instrumentedPartialOutput": partial_output(measured),
        }, indent=2))


if __name__ == "__main__":
    main()
