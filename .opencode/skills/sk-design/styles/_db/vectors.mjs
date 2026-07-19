// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Rebuildable Style Vector Queue                                           ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const DEFAULT_BATCH_LIMIT = 25;
const DEFAULT_MAX_ATTEMPTS = 4;
const MAX_VECTOR_DIMENSIONS = 16_384;

function nowIso() {
  return new Date().toISOString();
}

function normalizeVector(value) {
  const vector = Array.from(value ?? [], Number);
  if (vector.length === 0 || vector.length > MAX_VECTOR_DIMENSIONS
    || vector.some((entry) => !Number.isFinite(entry))) {
    const error = new Error('Embedder returned an invalid vector.');
    error.code = 'invalid-vector';
    throw error;
  }
  return vector;
}

function retryAt(attempts) {
  const delayMilliseconds = Math.min(60_000, 250 * (2 ** Math.max(0, attempts - 1)));
  return new Date(Date.now() + delayMilliseconds).toISOString();
}

/**
 * Register immutable identity for a vector profile.
 *
 * @param {import('node:sqlite').DatabaseSync} database - Open style database.
 * @param {Object} profile - Provider/model/dimension identity.
 * @returns {void}
 */
export function registerEmbeddingProfile(database, profile) {
  if (!profile?.id || !profile.provider || !profile.model || !profile.configHash) {
    throw new TypeError('Embedding profile requires id, provider, model, and configHash.');
  }
  const existing = database.prepare(`
    SELECT provider, model, dimensions, config_hash
    FROM embedding_profiles WHERE profile_id = ?
  `).get(profile.id);
  if (existing && (
    existing.provider !== profile.provider
    || existing.model !== profile.model
    || existing.config_hash !== profile.configHash
    || (existing.dimensions != null && profile.dimensions != null
      && Number(existing.dimensions) !== profile.dimensions)
  )) {
    const error = new Error(`Embedding profile identity conflict: ${profile.id}`);
    error.code = 'embedding-profile-conflict';
    throw error;
  }
  if (existing) {
    if (existing.dimensions == null && profile.dimensions != null) {
      database.prepare(`
        UPDATE embedding_profiles SET dimensions = ? WHERE profile_id = ?
      `).run(profile.dimensions, profile.id);
    }
    return;
  }
  database.prepare(`
    INSERT INTO embedding_profiles(
      profile_id, provider, model, dimensions, config_hash, created_at
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    profile.id,
    profile.provider,
    profile.model,
    profile.dimensions ?? null,
    profile.configHash,
    nowIso(),
  );
}

/**
 * Queue the current retrieval document and supersede older work for the profile.
 *
 * @param {import('node:sqlite').DatabaseSync} database - Open style database.
 * @param {Object} job - Stable style, content, and profile identity.
 * @returns {number} Queue job row identifier.
 */
export function enqueueVectorJob(database, job) {
  const timestamp = nowIso();
  const style = database.prepare(`
    SELECT style_rowid, retrieval_hash FROM styles
    WHERE style_id = ? AND lifecycle_state = 'active'
  `).get(job.styleId);
  if (!style || style.retrieval_hash !== job.retrievalHash) {
    const error = new Error('Vector job does not match the current active retrieval document.');
    error.code = 'stale-vector-job';
    throw error;
  }
  database.prepare(`
    UPDATE style_vector_jobs SET status = 'superseded', updated_at = ?
    WHERE style_rowid = ? AND profile_id = ? AND retrieval_hash != ?
      AND status IN ('pending', 'running', 'failed')
  `).run(timestamp, style.style_rowid, job.profileId, job.retrievalHash);
  database.prepare(`
    UPDATE style_vector_jobs
    SET status = 'pending', updated_at = ?, last_error = NULL, next_attempt_at = NULL
    WHERE style_rowid = ? AND retrieval_hash = ? AND profile_id = ?
      AND status = 'completed'
      AND NOT EXISTS (
        SELECT 1 FROM style_vectors v
        WHERE v.style_rowid = style_vector_jobs.style_rowid
          AND v.retrieval_hash = style_vector_jobs.retrieval_hash
          AND v.profile_id = style_vector_jobs.profile_id
      )
  `).run(timestamp, style.style_rowid, job.retrievalHash, job.profileId);
  database.prepare(`
    INSERT INTO style_vector_jobs(
      style_rowid, retrieval_hash, profile_id, status, created_at, updated_at
    ) VALUES (?, ?, ?, 'pending', ?, ?)
    ON CONFLICT(style_rowid, retrieval_hash, profile_id) DO UPDATE SET
      status = CASE
        WHEN style_vector_jobs.status = 'completed' THEN 'completed' ELSE 'pending' END,
      updated_at = excluded.updated_at,
      last_error = NULL
  `).run(style.style_rowid, job.retrievalHash, job.profileId, timestamp, timestamp);
  return Number(database.prepare(`
    SELECT job_id FROM style_vector_jobs
    WHERE style_rowid = ? AND retrieval_hash = ? AND profile_id = ?
  `).get(style.style_rowid, job.retrievalHash, job.profileId).job_id);
}

/**
 * Drain bounded vector work while preserving lexical availability on every failure.
 *
 * @param {import('node:sqlite').DatabaseSync} database - Open style database.
 * @param {Object} options - Worker controls.
 * @param {string} options.profileId - Profile to process.
 * @param {Function} options.embedder - Async callback accepting document text and profile.
 * @param {number} [options.limit=25] - Maximum jobs to attempt.
 * @param {number} [options.maxAttempts=4] - Bounded retry count.
 * @returns {Promise<Object>} Completed, failed, cached, and superseded counts.
 */
export async function drainVectorQueue(database, options) {
  if (!options?.profileId || typeof options.embedder !== 'function') {
    throw new TypeError('Vector drain requires profileId and an embedder callback.');
  }
  const limit = Math.max(1, Math.min(100, options.limit ?? DEFAULT_BATCH_LIMIT));
  const maxAttempts = Math.max(1, options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS);
  const profile = database.prepare(`
    SELECT profile_id, provider, model, dimensions, config_hash
    FROM embedding_profiles WHERE profile_id = ?
  `).get(options.profileId);
  if (!profile) {
    const error = new Error(`Unknown embedding profile: ${options.profileId}`);
    error.code = 'unknown-embedding-profile';
    throw error;
  }
  const jobs = database.prepare(`
    SELECT j.job_id, j.style_rowid, j.retrieval_hash, j.attempts,
      d.document_json, d.body
    FROM style_vector_jobs j
    JOIN styles s ON s.style_rowid = j.style_rowid
      AND s.lifecycle_state = 'active'
      AND s.retrieval_hash = j.retrieval_hash
    JOIN retrieval_documents d ON d.style_rowid = j.style_rowid
      AND d.retrieval_hash = j.retrieval_hash
    WHERE j.profile_id = ?
      AND j.status IN ('pending', 'failed')
      AND j.attempts < ?
      AND (j.next_attempt_at IS NULL OR j.next_attempt_at <= ?)
    ORDER BY j.job_id ASC LIMIT ?
  `).all(options.profileId, maxAttempts, nowIso(), limit);
  const summary = { attempted: jobs.length, completed: 0, failed: 0, cached: 0, superseded: 0 };
  for (const job of jobs) {
    const timestamp = nowIso();
    const claimed = database.prepare(`
      UPDATE style_vector_jobs
      SET status = 'running', attempts = attempts + 1, updated_at = ?, last_error = NULL
      WHERE job_id = ? AND status IN ('pending', 'failed')
    `).run(timestamp, job.job_id);
    if (Number(claimed.changes) !== 1) continue;
    try {
      const cached = database.prepare(`
        SELECT dimensions, vector_json FROM embedding_cache
        WHERE retrieval_hash = ? AND profile_id = ?
      `).get(job.retrieval_hash, options.profileId);
      const vector = cached
        ? normalizeVector(JSON.parse(cached.vector_json))
        : normalizeVector(await options.embedder(
          `${job.document_json}\n\n${job.body}`,
          { ...profile },
        ));
      if (cached) summary.cached += 1;
      if (cached && Number(cached.dimensions) !== vector.length) {
        const error = new Error('Cached vector dimensions do not match its payload.');
        error.code = 'vector-dimension-mismatch';
        throw error;
      }
      if (profile.dimensions != null && Number(profile.dimensions) !== vector.length) {
        const error = new Error(
          `Embedding dimension mismatch: expected ${profile.dimensions}, received ${vector.length}.`,
        );
        error.code = 'vector-dimension-mismatch';
        throw error;
      }
      const vectorJson = JSON.stringify(vector);
      database.exec('BEGIN IMMEDIATE');
      try {
        const current = database.prepare(`
          SELECT retrieval_hash, lifecycle_state FROM styles WHERE style_rowid = ?
        `).get(job.style_rowid);
        if (!current || current.lifecycle_state !== 'active'
          || current.retrieval_hash !== job.retrieval_hash) {
          database.prepare(`
            UPDATE style_vector_jobs SET status = 'superseded', updated_at = ?
            WHERE job_id = ?
          `).run(nowIso(), job.job_id);
          database.exec('COMMIT');
          summary.superseded += 1;
          continue;
        }
        const currentProfile = database.prepare(`
          SELECT dimensions FROM embedding_profiles WHERE profile_id = ?
        `).get(options.profileId);
        if (!currentProfile || (currentProfile.dimensions != null
          && Number(currentProfile.dimensions) !== vector.length)) {
          const error = new Error(
            `Embedding dimension mismatch for profile ${options.profileId}.`,
          );
          error.code = 'vector-dimension-mismatch';
          throw error;
        }
        database.prepare(`
          INSERT INTO embedding_cache(
            retrieval_hash, profile_id, dimensions, vector_json, created_at
          ) VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(retrieval_hash, profile_id) DO NOTHING
        `).run(job.retrieval_hash, options.profileId, vector.length, vectorJson, nowIso());
        database.prepare(`
          UPDATE embedding_profiles SET dimensions = COALESCE(dimensions, ?)
          WHERE profile_id = ?
        `).run(vector.length, options.profileId);
        database.prepare(`
          INSERT INTO style_vectors(
            style_rowid, retrieval_hash, profile_id, dimensions, vector_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(style_rowid, profile_id) DO UPDATE SET
            retrieval_hash = excluded.retrieval_hash,
            dimensions = excluded.dimensions,
            vector_json = excluded.vector_json,
            created_at = excluded.created_at
        `).run(
          job.style_rowid,
          job.retrieval_hash,
          options.profileId,
          vector.length,
          vectorJson,
          nowIso(),
        );
        database.prepare(`
          UPDATE style_vector_jobs
          SET status = 'completed', updated_at = ?, next_attempt_at = NULL, last_error = NULL
          WHERE job_id = ?
        `).run(nowIso(), job.job_id);
        database.prepare(`
          INSERT INTO vector_projection_revisions(profile_id, revision, updated_at)
          VALUES (?, 1, ?)
          ON CONFLICT(profile_id) DO UPDATE SET
            revision = vector_projection_revisions.revision + 1,
            updated_at = excluded.updated_at
        `).run(options.profileId, nowIso());
        database.exec('COMMIT');
        summary.completed += 1;
      } catch (error) {
        database.exec('ROLLBACK');
        throw error;
      }
    } catch (error) {
      const attempts = Number(database.prepare(
        'SELECT attempts FROM style_vector_jobs WHERE job_id = ?',
      ).get(job.job_id)?.attempts ?? maxAttempts);
      database.prepare(`
        UPDATE style_vector_jobs
        SET status = 'failed', updated_at = ?, next_attempt_at = ?, last_error = ?
        WHERE job_id = ? AND status = 'running'
      `).run(nowIso(), retryAt(attempts), String(error.message ?? error), job.job_id);
      summary.failed += 1;
    }
  }
  return summary;
}

/**
 * Invalidate and requeue one profile without affecting lexical retrieval.
 *
 * @param {import('node:sqlite').DatabaseSync} database - Open style database.
 * @param {string} profileId - Profile projection to rebuild.
 * @returns {{profileId:string,queued:number,revision:number}} Rebuild summary.
 */
export function rebuildVectorProjection(database, profileId) {
  const profile = database.prepare(`
    SELECT profile_id FROM embedding_profiles WHERE profile_id = ?
  `).get(profileId);
  if (!profile) {
    const error = new Error(`Unknown embedding profile: ${profileId}`);
    error.code = 'unknown-embedding-profile';
    throw error;
  }
  const timestamp = nowIso();
  database.exec('BEGIN IMMEDIATE');
  try {
    database.prepare('DELETE FROM style_vectors WHERE profile_id = ?').run(profileId);
    const active = database.prepare(`
      SELECT style_rowid, retrieval_hash FROM styles
      WHERE lifecycle_state = 'active' ORDER BY style_rowid ASC
    `).all();
    for (const style of active) {
      database.prepare(`
        INSERT INTO style_vector_jobs(
          style_rowid, retrieval_hash, profile_id, status, attempts,
          next_attempt_at, last_error, created_at, updated_at
        ) VALUES (?, ?, ?, 'pending', 0, NULL, NULL, ?, ?)
        ON CONFLICT(style_rowid, retrieval_hash, profile_id) DO UPDATE SET
          status = 'pending', attempts = 0, next_attempt_at = NULL,
          last_error = NULL, updated_at = excluded.updated_at
      `).run(
        style.style_rowid,
        style.retrieval_hash,
        profileId,
        timestamp,
        timestamp,
      );
    }
    database.prepare(`
      INSERT INTO vector_projection_revisions(profile_id, revision, updated_at)
      VALUES (?, 1, ?)
      ON CONFLICT(profile_id) DO UPDATE SET
        revision = vector_projection_revisions.revision + 1,
        updated_at = excluded.updated_at
    `).run(profileId, timestamp);
    const revision = Number(database.prepare(`
      SELECT revision FROM vector_projection_revisions WHERE profile_id = ?
    `).get(profileId).revision);
    database.exec('COMMIT');
    return { profileId, queued: active.length, revision };
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}
