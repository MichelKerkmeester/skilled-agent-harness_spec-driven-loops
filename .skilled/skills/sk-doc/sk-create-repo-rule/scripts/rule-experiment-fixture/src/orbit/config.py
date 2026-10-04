import os


def load():
    return {
        "ttl": int(os.environ.get("ORBIT_TTL_SECONDS", "30")),
        "max_entries": int(os.environ.get("ORBIT_MAX_ENTRIES", "10000")),
    }
