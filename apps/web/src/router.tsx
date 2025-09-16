import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ConvexProvider } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";

import { ClerkProvider } from "@clerk/clerk-react";

import { env } from "./env/client";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const createRouter = () => {
  const convexQueryClient = new ConvexQueryClient(env.VITE_CONVEX_URL);
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);

  const router = createTanstackRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <ClerkProvider
          publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
          afterSignOutUrl="/"
        >
          <ConvexProvider client={convexQueryClient.convexClient}>
            {props.children}
          </ConvexProvider>
        </ClerkProvider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
