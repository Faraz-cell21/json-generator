function normalizePath(path: string): string {
  return path.startsWith("/") ? path : `/${path}`;
}

export const LOGIN_PATH = normalizePath(
  process.env.NEXT_PUBLIC_LOGIN_PATH ?? "/auth-z9p2n1q"
);

export const ADMIN_PATH = normalizePath(
  process.env.NEXT_PUBLIC_ADMIN_PATH ?? "/panel-k8f3m2x"
);
