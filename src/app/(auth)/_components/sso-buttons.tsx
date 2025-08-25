import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Route } from "next";
import { useConfigStore } from "@/state/config";
import Google from "@/icons/google";
import { Skeleton } from "@/components/ui/skeleton";

export default function SSOButtons({
  isSignIn = false,
}: {
  isSignIn?: boolean;
}) {
  const { isGoogleSSOEnabled } = useConfigStore();

  if (isGoogleSSOEnabled === null) {
    return <Skeleton className="w-full h-[44px]" />;
  }

  return (
    <>
      {isGoogleSSOEnabled && (
        <>
          <Button className="w-full" asChild size="lg">
            <Link href={"/sso/google" as Route}>
              <Google className="w-[22px] h-[22px] mr-1" />
              {isSignIn ? "Sign in with Google" : "Sign up with Google"}
            </Link>
          </Button>
        </>
      )}
    </>
  );
}
