FROM oven/bun
WORKDIR /app
COPY . .
RUN bun i
RUN bun run build
CMD ["bun", "start"] 