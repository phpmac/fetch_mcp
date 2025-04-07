FROM oven/bun
WORKDIR /app
COPY . .
RUN bun i
CMD ["bun", "start"] 