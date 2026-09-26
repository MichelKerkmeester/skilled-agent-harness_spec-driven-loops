import argparse
import base64
import glob
import json
import os
import tempfile
from pathlib import Path

import coverage


def _relative(root: Path, filename: str) -> str:
    return Path(filename).resolve().relative_to(root).as_posix()


def _decode_context(context: str):
    prefix = "supercov-v1:"
    dynamic = next(
        (part for part in context.split("|") if part.startswith(prefix)),
        None,
    )
    if dynamic is None:
        return None
    encoded = dynamic[len(prefix):]
    encoded += "=" * (-len(encoded) % 4)
    return json.loads(base64.urlsafe_b64decode(encoded).decode())


parser = argparse.ArgumentParser()
parser.add_argument("--data-file", required=True)
parser.add_argument("--outcomes", required=True)
parser.add_argument("--root", required=True)
args = parser.parse_args()

root = Path(args.root).resolve()
cov = coverage.Coverage(data_file=args.data_file, config_file=False)
data_files = sorted(glob.glob(f"{args.data_file}.*"))
if data_files:
    cov.combine(data_paths=[str(Path(args.data_file).parent)], strict=True, keep=True)
else:
    cov.load()
data = cov.get_data()

with tempfile.NamedTemporaryFile(suffix=".json", delete=False) as report_file:
    report_path = Path(report_file.name)
try:
    cov.json_report(outfile=str(report_path), pretty_print=False, show_contexts=False)
    report = json.loads(report_path.read_text(encoding="utf-8"))
finally:
    report_path.unlink(missing_ok=True)

files = []
for filename, details in sorted(report["files"].items()):
    candidate = Path(filename)
    if candidate.is_absolute():
        resolved = str(candidate)
    elif (root / candidate).exists():
        resolved = str((root / candidate).resolve())
    else:
        resolved = str(candidate.resolve())
    path = _relative(root, resolved)
    source_lines = Path(resolved).read_text(encoding="utf-8").splitlines()
    relevant_lines = sorted(set(
        details["executed_lines"]
        + details["missing_lines"]
        + [arc[0] for arc in details.get("executed_branches", [])]
        + [arc[0] for arc in details.get("missing_branches", [])]
    ))
    files.append({
        "path": path,
        "statements": sorted(details["executed_lines"] + details["missing_lines"]),
        "excludedLines": sorted(details["excluded_lines"]),
        "executedLines": sorted(details["executed_lines"]),
        "missingLines": sorted(details["missing_lines"]),
        "executedBranches": sorted(details.get("executed_branches", [])),
        "missingBranches": sorted(details.get("missing_branches", [])),
        "sourceLines": [
            {"line": line, "source": source_lines[line - 1]}
            for line in relevant_lines
        ],
    })

contexts = []
measured_files = sorted(data.measured_files())
for context in sorted(data.measured_contexts()):
    identity = _decode_context(context)
    static_worker = next(
        (
            part.removeprefix("supercov-worker-v1:")
            for part in context.split("|")
            if part.startswith("supercov-worker-v1:")
        ),
        os.environ.get("PYTEST_XDIST_WORKER", "main"),
    )
    data.set_query_context(context)
    observations = []
    for filename in measured_files:
        lines = sorted(data.lines(filename) or [])
        arcs = sorted([list(arc) for arc in (data.arcs(filename) or [])])
        if lines or arcs:
            observations.append({
                "path": _relative(root, filename),
                "lines": lines,
                "arcs": arcs,
            })
    contexts.append({
        "kind": "test-phase" if identity is not None else "background",
        "identity": identity,
        "workerId": (
            identity["workerId"]
            if identity is not None
            else static_worker
        ),
        "files": observations,
    })
data.set_query_contexts(None)

journal = []
for filename in sorted(glob.glob(args.outcomes)):
    with Path(filename).open(encoding="utf-8") as stream:
        journal.extend(json.loads(line) for line in stream if line.strip())

starts = {
    (
        record["workerId"],
        record["testId"],
        record["retry"],
        record["phase"],
    ): record
    for record in journal
    if record["outcome"] == "started"
}
outcomes = [
    record
    for record in journal
    if record["outcome"] != "started" and not record.get("workerCrash", False)
]
for crash in (record for record in journal if record.get("workerCrash", False)):
    matching = [
        start
        for key, start in starts.items()
        if key[:3]
        == (crash["workerId"], crash["testId"], crash["retry"])
    ]
    if not matching:
        raise RuntimeError(
            "crashed worker did not leave an active pytest phase: "
            f"{crash['workerId']} {crash['testId']} retry {crash['retry']}"
        )
    outcomes.append({
        "runId": crash["runId"],
        "workerId": crash["workerId"],
        "testId": crash["testId"],
        "retry": crash["retry"],
        "phase": matching[-1]["phase"],
        "outcome": crash["outcome"],
        "wasXfail": False,
    })

output = {
    "schemaVersion": 1,
    "producer": {"name": "coverage.py", "version": coverage.__version__},
    "runner": "pytest",
    "collectorCore": os.environ.get("COVERAGE_CORE", "default"),
    "branch": data.has_arcs(),
    "root": ".",
    "files": files,
    "contexts": contexts,
    "outcomes": sorted(
        outcomes,
        key=lambda item: (
            item["workerId"], item["testId"], item["retry"], item["phase"]
        ),
    ),
}
print(json.dumps(output, sort_keys=True, separators=(",", ":")))
