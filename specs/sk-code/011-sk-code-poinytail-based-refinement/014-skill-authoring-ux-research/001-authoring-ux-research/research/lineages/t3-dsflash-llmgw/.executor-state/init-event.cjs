// Build the deep-research run-open event from the lineage config; no repo writes.
const fs = require("fs"), crypto = require("crypto");
const [configPath, outPath] = process.argv.slice(2);
const raw = fs.readFileSync(configPath);
const config = JSON.parse(raw);
const sha = (value) => crypto.createHash("sha256").update(value).digest("hex");
const lineage = config.lineage || {};
const sessionId = lineage.sessionId;
const lineageId = lineage.parentSessionId || sessionId;
const generation = Number(lineage.generation) || 1;
const configDigest = sha(raw);
const event = {
  stem: "deep_research.run_initialized",
  scope: { runId: sessionId, lineageId },
  data: {
    generation,
    charterDigest: sha(Buffer.from(JSON.stringify({ topic: config.topic, specFolder: config.specFolder || "" }))),
    configDigest,
    executorFingerprint: sha(Buffer.from(JSON.stringify(config.executor || {}))),
    replayFingerprint: sha(Buffer.from(JSON.stringify({ runId: sessionId, lineageId, generation, configDigest }))),
    maxIterations: Number(config.maxIterations),
    convergencePolicyVersion: "convergence-policy@" + ((config.antiConvergence && config.antiConvergence.convergenceMode) || "default"),
  },
};
fs.writeFileSync(outPath, JSON.stringify(event), "utf8");
console.log("event written", outPath);
