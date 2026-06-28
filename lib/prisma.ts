import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const REQUIRED_DELEGATES = ["warmWish", "uploadedFile", "communityPost"] as const;

/** True when the cached client predates the current schema (e.g. after `prisma generate`). */
function isStalePrismaClient(client: PrismaClient | undefined): boolean {
  if (!client) return true;
  return REQUIRED_DELEGATES.some((key) => !(key in client));
}

function getPrismaClient(): PrismaClient {
  if (!isStalePrismaClient(globalThis.prisma) && globalThis.prisma) {
    return globalThis.prisma;
  }

  const client = new PrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = client;
  }

  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
