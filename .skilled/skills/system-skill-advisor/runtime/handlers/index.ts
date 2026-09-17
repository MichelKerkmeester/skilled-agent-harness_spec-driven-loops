// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Handlers Index
// ───────────────────────────────────────────────────────────────

export { handleAdvisorRecommend } from './advisor-recommend.js';
export { handleAdvisorRebuild, rebuildAdvisorIndex } from './advisor-rebuild.js';
export { handleAdvisorStatus, readAdvisorStatus } from './advisor-status.js';
export { handleAdvisorValidate, validateAdvisor } from './advisor-validate.js';
export {
  handleSkillGraphQuery,
  handleSkillGraphScan,
  handleSkillGraphStatus,
  handleSkillGraphValidate,
} from './skill-graph/index.js';
