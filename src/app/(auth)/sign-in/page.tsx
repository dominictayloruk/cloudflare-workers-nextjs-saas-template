import { Metadata } from "next";
import type { Route } from "next";
import { getSessionFromCookie } from "@/utils/auth";
import { redirect } from "next/navigation";
import SignInClientPage from "./sign-in.client";
import { REDIRECT_AFTER_SIGN_IN } from "@/constants";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

const SignInPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) => {
  const { redirect: redirectParam } = await searchParams;
  const session = await getSessionFromCookie();
  const redirectPath = redirectParam ?? REDIRECT_AFTER_SIGN_IN;

  if (session) {
    return redirect(redirectParam ? (redirectParam as Route) : REDIRECT_AFTER_SIGN_IN);
  }

  return <SignInClientPage redirectPath={redirectPath} />;
};

export default SignInPage;
