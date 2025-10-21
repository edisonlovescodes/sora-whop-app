"use client";

import { WhopApp } from "@whop/react/components";
import type { ReactNode } from "react";

export default function WhopClient({ children }: { children: ReactNode }) {
  return <WhopApp>{children}</WhopApp>;
}

