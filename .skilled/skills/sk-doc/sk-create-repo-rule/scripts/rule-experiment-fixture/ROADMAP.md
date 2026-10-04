# Roadmap

1. Move session data onto the cache. Owner Priya. In progress, blocked on the
   eviction policy decision in docs/caching-options.md.
2. Add metrics for hit rate and eviction count. Owner Tomas. Done in 0.4.0.
3. Replace the hand-rolled TTL clock with a monotonic clock. Owner Priya. Not
   started.
4. Support a second region. Owner Lena. Paused until the ledger team ships
   replication.
5. Drop Python 3.9 support. Owner Tomas. Scheduled for 0.6.0.
6. Write an operator runbook for cache flushes. Owner Lena. Draft exists, not
   reviewed.
7. Load test at 5,000 requests per second. Owner Tomas. Failed once at 3,800,
   rerun planned after the store connection pool fix.
