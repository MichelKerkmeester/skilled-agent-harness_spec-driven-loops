# Caching options for session data

Three strategies are on the table for moving session data onto orbit-cache.

## Write-through

Every write goes to the cache and the ledger store in the same request. Reads
are always fresh. Write latency rises by the store round trip, about 12 ms at
p50 and 40 ms at p99. Operationally simple: no background workers. Monthly cost
estimate is unchanged from today because the store already sees every write.

## Write-behind

Writes land in the cache and a background worker flushes them to the store in
batches every 2 seconds. Write latency drops to about 1 ms. A crash between
flushes loses up to 2 seconds of session writes. Needs a worker process, a
retry queue and alerting on flush lag. Cost estimate falls by about 30 percent
because batched writes are cheaper.

## Read-through with TTL

Writes go to the store only. Reads fill the cache on a miss and expire after
the TTL. Simplest code change. Reads can be up to one TTL stale, 30 seconds by
default. Store load depends on the hit rate, which was 71 percent in the last
load test. Cost estimate rises by about 10 percent at current traffic.

The session team cares most about not losing writes, then latency, then cost.
