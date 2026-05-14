#!/usr/bin/env node
// Performance test runner for scenario 410
// Run this from the mcp_server directory so lazy imports resolve correctly

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load workload from absolute path
const workloadPath = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/_sandbox/24--local-llm-query-intelligence/410/workload.json';
const workload = JSON.parse(readFileSync(workloadPath, 'utf8'));

console.log(`Loaded ${workload.length} queries`);

// Import the memory tools using relative path from mcp_server/dist/tools/
const { handleTool } = await import('./dist/tools/memory-tools.js');

console.log('Memory tools loaded');

// Function to run a single query and measure time
async function runQuery(query, limit = 5) {
  const start = performance.now();
  try {
    const result = await handleTool('memory_search', { query, limit });
    const end = performance.now();
    return { success: true, latency: end - start, result };
  } catch (error) {
    const end = performance.now();
    return { success: false, latency: end - start, error: error.message };
  }
}

// Run all queries
async function runWorkload(queries, label) {
  console.log(`\n=== ${label} ===`);
  const timings = [];
  const errors = [];
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const result = await runQuery(query, 5);
    timings.push(result.latency);
    
    if (!result.success) {
      errors.push({ index: i, error: result.error });
    }
    
    if ((i + 1) % 10 === 0) {
      console.log(`  Progress: ${i + 1}/${queries.length} queries`);
    }
  }
  
  // Calculate statistics
  const sorted = timings.slice().sort((a, b) => a - b);
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  const totalTime = sorted.reduce((a, b) => a + b, 0);
  const qps = queries.length / (totalTime / 1000);
  
  console.log(`\nResults for ${label}:`);
  console.log(`  Total queries: ${queries.length}`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  p50: ${p50.toFixed(2)} ms`);
  console.log(`  p95: ${p95.toFixed(2)} ms`);
  console.log(`  p99: ${p99.toFixed(2)} ms`);
  console.log(`  Throughput: ${qps.toFixed(2)} qps`);
  console.log(`  Total time: ${(totalTime / 1000).toFixed(2)} s`);
  console.log(`  Min: ${sorted[0].toFixed(2)} ms`);
  console.log(`  Max: ${sorted[sorted.length - 1].toFixed(2)} ms`);
  
  if (errors.length > 0) {
    console.log(`\nFirst 5 errors:`);
    errors.slice(0, 5).forEach(e => console.log(`  [${e.index}] ${e.error}`));
  }
  
  return { p50, p95, p99, qps, errors: errors.length };
}

// Main execution
async function main() {
  console.log('Starting scenario 410 — Query latency + throughput test');
  console.log(`Workload: ${workload.length} queries`);
  
  // Cold run
  const coldResults = await runWorkload(workload, 'COLD RUN');
  
  // Steady run
  const steadyResults = await runWorkload(workload, 'STEADY RUN');
  
  // Evaluate against targets
  const targets = {
    p50: 200,
    p95: 800,
    p99: 2000,
    qps: 5
  };
  
  let passed = 0;
  if (steadyResults.p50 <= targets.p50) passed++;
  if (steadyResults.p95 <= targets.p95) passed++;
  if (steadyResults.p99 <= targets.p99) passed++;
  if (steadyResults.qps >= targets.qps) passed++;
  
  let verdict;
  if (passed === 4) verdict = 'PASS';
  else if (passed >= 2) verdict = 'PARTIAL';
  else verdict = 'FAIL';
  
  console.log(`\n=== FINAL VERDICT: ${verdict} (${passed}/4 targets met) ===`);
  console.log(`Targets: p50≤${targets.p50}ms, p95≤${targets.p95}ms, p99≤${targets.p99}ms, qps≥${targets.qps}`);
  console.log(`Steady:  p50=${steadyResults.p50.toFixed(0)}ms, p95=${steadyResults.p95.toFixed(0)}ms, p99=${steadyResults.p99.toFixed(0)}ms, qps=${steadyResults.qps.toFixed(1)}`);
  
  // Write results
  const results = { verdict, coldResults, steadyResults, targets };
  const resultsPath = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/_sandbox/24--local-llm-query-intelligence/410/results.json';
  const fs = await import('fs');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\nResults written to ${resultsPath}`);
  
  return results;
}

main().catch(console.error);
