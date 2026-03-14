# Use a Python image with uv pre-installed
FROM ghcr.io/astral-sh/uv:python3.11-bookworm-slim AS builder

# Install the project into `/app`
WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Copy from the cache instead of linking since it's a separate volume
ENV UV_LINK_MODE=copy

# Increase the timeout for downloads (default is 30s)
ENV UV_HTTP_TIMEOUT=300

# Install the project's dependencies using the lockfile and pyproject.toml
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project --no-dev

# Then, copy the rest of the application code and install the project
ADD . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

# Final runtime stage
FROM python:3.11-slim-bookworm

WORKDIR /app

# Copy the environment from the builder stage
COPY --from=builder /app /app

# Place executable scripts in the PATH
ENV PATH="/app/.venv/bin:$PATH"

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
