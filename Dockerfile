FROM denoland/deno:2.1.4


WORKDIR /app

COPY /src /app

# These steps will be re-run upon each file change in your working directory:
COPY . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

CMD ["run", "--allow-all", "--unstable-cron", "main.ts"]
