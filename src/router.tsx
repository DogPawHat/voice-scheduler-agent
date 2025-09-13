import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { ConvexProvider } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL;
if (!CONVEX_URL) {
  console.error("missing envar CONVEX_URL");
}
const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convexQueryClient.convexClient}>
      {children}
    </ConvexProvider>
  );
}

// Create a new router instance
export const createRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createTanstackRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: "intent",
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          {props.children}
        </TanstackQuery.Provider>
      );
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
