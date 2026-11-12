// Builds the run-open ledger event exactly as the deep-review workflow's state-log step does,
// written to a file inside the lineage directory so no write leaves the lineage.
const fs = require("fs"), crypto = require("crypto"), path = require("path");
const [configPath, workflowPath, outPath] = process.argv.slice(2);
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const raw = fs.readFileSync(configPath);
const config = JSON.parse(raw);
const targetTypes = { files: "file", file: "file", directory: "directory", "spec-folder": "directory", track: "directory", repository: "repository" };
const lineageModes = { new: "fresh", fresh: "fresh", restart: "restart", resume: "resume" };
const topic = typeof config.topic === "string" && config.topic.trim() !== "" && config.topic.length <= 4096 ? config.topic : null;
fs.writeFileSync(outPath, JSON.stringify({
  stem: "deep_review.run_initialized",
  scope: { runId: config.sessionId, sessionId: config.sessionId, generation: Number(config.generation) || 1 },
  data: {
    target: {
      targetId: "review-target",
      targetType: targetTypes[config.reviewTargetType] || "artifact",
      artifactRef: "deep-review-config.json#reviewTarget",
      sourceDigest: sha(String(config.reviewTarget)),
      contentDigest: sha(raw),
    },
    lineageMode: lineageModes[config.lineageMode] || "fresh",
    maxIterations: Number(config.maxIterations),
    convergencePolicyVersion: "convergence-policy@" + ((config.antiConvergence && config.antiConvergence.convergenceMode) || "default"),
    reviewModeContractDigest: sha(fs.readFileSync(workflowPath)),
    initialReleaseReadinessState: "not-assessed",
    ...(topic === null ? {} : { topic }),
  },
}));
console.log("wrote " + path.basename(outPath));
