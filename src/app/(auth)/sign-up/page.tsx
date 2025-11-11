import { Metadata } from "next";
import type { Route } from "next";
import { getSessionFromCookie } from "@/utils/auth";
import SignUpClientComponent from "./sign-up.client";
import { redirect } from "next/navigation";
import { REDIRECT_AFTER_SIGN_IN } from "@/constants";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

const SignUpPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) => {
  const { redirect: redirectParam } = await searchParams;
  const session = await getSessionFromCookie();
  const redirectPath = redirectParam ?? REDIRECT_AFTER_SIGN_IN;

  if (session) {
    return redirect(
      redirectParam ? (redirectParam as Route) : REDIRECT_AFTER_SIGN_IN,
    );
  }

  return <SignUpClientComponent redirectPath={redirectPath} />;
};

export default SignUpPage;
