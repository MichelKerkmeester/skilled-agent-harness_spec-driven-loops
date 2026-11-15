import hashlib, json, pathlib, sys
baseline = json.load(open("../../../specs/system-deep-loop/loop-architecture/003-deprecate-improvement-modes/013-drift-guard-repairs/baseline/routing-baseline.json"))
corpus_dir = pathlib.Path("scripts/routing-accuracy")
bad = []
for name, meta in baseline["corpus"].items():
    if not isinstance(meta, dict) or "sha256" not in meta:
        continue
    actual = hashlib.sha256((corpus_dir / name).read_bytes()).hexdigest()
    if actual != meta["sha256"]:
        bad.append(f"{name}: pinned {meta['sha256'][:16]}… actual {actual[:16]}…")
if bad:
    print("CORPUS DRIFTED FROM PIN — recapture the baseline before scoring:")
    print("\n".join(f"  {line}" for line in bad))
    sys.exit(2)
print("corpus matches the pinned baseline hashes")
