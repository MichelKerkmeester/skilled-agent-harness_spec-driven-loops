"""Time Deem `choice` calls from one local urllib client, the method deem-local.md records.

Synthetic input only. 10 warm-up requests, then N timed requests, wall time from
request to parsed response. Prints p50, p95, min and max in milliseconds.
"""
import json
import statistics
import sys
import time
import urllib.request

URL = "http://127.0.0.1:8300/v1/systemone"
BODY = json.dumps({
    "state": "The nightly build failed and both automatic retries failed too.",
    "questions": {"q": {"type": "choice", "instructions": "Ship or hold?", "options": ["ship", "hold"]}},
}).encode("utf-8")


def call():
    req = urllib.request.Request(URL, data=BODY, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def main():
    timed = int(sys.argv[1]) if len(sys.argv) > 1 else 50
    for _ in range(10):
        call()
    samples = []
    answer = None
    for _ in range(timed):
        start = time.perf_counter()
        answer = call()
        samples.append((time.perf_counter() - start) * 1000.0)
    samples.sort()
    p95 = samples[max(0, int(round(0.95 * len(samples))) - 1)]
    print("n=%d p50=%.1f p95=%.1f min=%.1f max=%.1f" % (
        len(samples), statistics.median(samples), p95, samples[0], samples[-1]))
    print("answer=" + json.dumps(answer)[:200])


if __name__ == "__main__":
    main()
