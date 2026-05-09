FROM node:20-bookworm

LABEL description="Spec Kit doctor command manual-testing sandbox"

RUN apt-get update && apt-get install -y \
    python3.11 \
    sqlite3 \
    jq \
    git \
    curl \
    ca-certificates \
    bash \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g 1001 testuser \
    && useradd -m -s /bin/bash -u 1001 -g testuser testuser \
    && mkdir -p /workspace \
    && chown -R testuser:testuser /workspace

USER testuser
WORKDIR /workspace

ENV PATH="/home/testuser/.local/bin:${PATH}"
ENV SPECKIT_SANDBOX=1

ENTRYPOINT ["bash", "/workspace/.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh"]
