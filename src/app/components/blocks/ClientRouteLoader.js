// app/(marketing)/components/ClientRouteLoader.jsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LoaderOverlay from "../blocks/LoaderOverlay"; // adjust if your path differs

const MIN_DURATION_MS = 400;

export default function ClientRouteLoader({ children, locale }) {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const scopeKey = `__east_firstMount_${locale || "default"}`;

  // Initial mount
  useEffect(() => {
    const t = setTimeout(() => setShow(false), MIN_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  // Route transitions
  useEffect(() => {
    if (typeof window !== "undefined" && window[scopeKey]) {
      setShow(true);
      const t = setTimeout(() => setShow(false), MIN_DURATION_MS);
      return () => clearTimeout(t);
    } else if (typeof window !== "undefined") {
      window[scopeKey] = true;
    }
  }, [pathname]);

  return (
    <>
      <LoaderOverlay show={show} />
      <Suspense fallback={<LoaderOverlay show={true} />}>
        <div key={pathname}>{children}</div>
      </Suspense>
    </>
  );
}
