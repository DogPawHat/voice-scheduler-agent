import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    VITE_CONVEX_URL: z.string().min(1),
  },
  runtimeEnvStrict: {
    VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
    VITE_CONVEX_URL: import.meta.env.VITE_CONVEX_URL,
  },
  emptyStringAsUndefined: true,
});
