#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: COCOINDEX A/B BENCH — BUNDLED vs SIDECAR
# ───────────────────────────────────────────────────────────────
# Smoke A/B (n=1) comparing cocoindex rerank via bundled Qwen vs via the
# system-rerank-sidecar HTTP path (arc 008 phase 006).
"""Run two arms of cocoindex rerank against a fixture subset.

Arm A: COCOINDEX_RERANK_VIA_SIDECAR=false (bundled in-process Qwen).
Arm B: COCOINDEX_RERANK_VIA_SIDECAR=true (HTTP -> system-rerank-sidecar:8765).

Outputs per-arm lane JSON files in the same shape as
``run-expanded-bench.sh`` to keep downstream tooling compatible.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import statistics
import subprocess
import sys
import time
from datetime import UTC, datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[6]
CCC = REPO_ROOT / ".opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc"
BENCH_DIR = Path(__file__).resolve().parent
DEFAULT_FIXTURE = BENCH_DIR / "fixture-subset-18.json"
RUNS_DIR = BENCH_DIR / "runs"
MIRROR_PREFIXES = (".opencode/", ".claude/", ".codex/", ".gemini/")


def norm(path: str) -> str:
    for prefix in MIRROR_PREFIXES:
        if path.startswith(prefix):
            path = path[len(prefix):]
            break
    return re.sub(r":\d+(-\d+)?$", "", path)


def extract_paths(stdout: str) -> list[str]:
    paths: list[str] = []
    for line in stdout.splitlines():
        if not line.startswith("File: "):
            continue
        candidate = line.removeprefix("File: ").split(" ", 1)[0]
        candidate = re.sub(r":\d+(-\d+)?$", "", candidate)
        if candidate not in paths:
            paths.append(candidate)
    return paths


def percentile(values: list[int], pct: float) -> int:
    if not values:
        return 0
    ordered = sorted(values)
    index = max(0, min(len(ordered) - 1, int(round((pct / 100) * (len(ordered) - 1)))))
    return ordered[index]


def restart_daemon() -> None:
    subprocess.run([str(CCC), "daemon", "stop"], capture_output=True, check=False)


def run_arm(
    arm_id: str,
    arm_name: str,
    fixture: list[dict],
    env_overrides: dict[str, str],
    run_no: int,
) -> Path:
    output = RUNS_DIR / f"arm-{arm_id}-run-{run_no}.json"
    print(f"[arm={arm_id}] starting (n={len(fixture)} probes) overrides={env_overrides}", flush=True)
    restart_daemon()

    env = os.environ.copy()
    env.update(env_overrides)
    env.setdefault("COCOINDEX_RERANK", "true")
    env.setdefault("COCOINDEX_RERANK_MODEL", "Qwen/Qwen3-Reranker-0.6B")

    per_probe = []
    latencies: list[int] = []
    started_at = datetime.now(UTC).isoformat()

    for probe in fixture:
        t0 = time.monotonic()
        proc = subprocess.run(
            [str(CCC), "search", probe["query"], "--limit", "5"],
            capture_output=True,
            text=True,
            timeout=90,
            check=False,
            env=env,
        )
        latency_ms = int((time.monotonic() - t0) * 1000)
        latencies.append(latency_ms)
        top_paths = extract_paths(proc.stdout) if proc.returncode == 0 else []
        top5 = [norm(p) for p in top_paths[:5]]
        truth = {norm(p) for p in probe["truth_set"]}
        hit = bool(truth & set(top5))
        per_probe.append(
            {
                "probe_id": probe["id"],
                "query": probe["query"],
                "expected": probe["expected_source_path"],
                "top5": top5,
                "hit": hit,
                "latency_ms": latency_ms,
                "returncode": proc.returncode,
                "stderr": proc.stderr.strip()[-1000:],
            }
        )

    hits = sum(1 for row in per_probe if row["hit"])
    artifact = {
        "schema_version": 2,
        "arm_id": arm_id,
        "arm_name": arm_name,
        "run": run_no,
        "started_at": started_at,
        "completed_at": datetime.now(UTC).isoformat(),
        "fixture": str(DEFAULT_FIXTURE),
        "env": env_overrides,
        "hits": hits,
        "hit_rate": hits / len(per_probe) if per_probe else 0.0,
        "latency_ms": {
            "mean": statistics.fmean(latencies) if latencies else 0.0,
            "p50": percentile(latencies, 50),
            "p95": percentile(latencies, 95),
            "p99": percentile(latencies, 99),
        },
        "per_probe": per_probe,
    }
    output.write_text(json.dumps(artifact, indent=2, sort_keys=True))
    print(
        f"[arm={arm_id}] DONE hits={hits}/{len(per_probe)} p50={artifact['latency_ms']['p50']}ms "
        f"p95={artifact['latency_ms']['p95']}ms wrote={output.name}",
        flush=True,
    )
    return output


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--fixture", type=Path, default=DEFAULT_FIXTURE)
    parser.add_argument("--runs", type=int, default=1)
    parser.add_argument("--arms", default="a,b", help="comma-separated subset of {a,b}")
    args = parser.parse_args()

    fixture = json.loads(args.fixture.read_text())
    RUNS_DIR.mkdir(parents=True, exist_ok=True)

    arms = {a.strip() for a in args.arms.split(",") if a.strip()}
    arm_specs: list[tuple[str, str, dict]] = []
    if "a" in arms:
        arm_specs.append(
            (
                "a-bundled-qwen",
                "Arm A: bundled CrossEncoder('Qwen/Qwen3-Reranker-0.6B')",
                {"COCOINDEX_RERANK_VIA_SIDECAR": "false"},
            )
        )
    if "b" in arms:
        arm_specs.append(
            (
                "b-sidecar-qwen",
                "Arm B: HTTP sidecar -> Qwen/Qwen3-Reranker-0.6B",
                {"COCOINDEX_RERANK_VIA_SIDECAR": "true"},
            )
        )

    for run_no in range(1, args.runs + 1):
        for arm_id, arm_name, env in arm_specs:
            run_arm(arm_id, arm_name, fixture, env, run_no)

    return 0


if __name__ == "__main__":
    sys.exit(main())
