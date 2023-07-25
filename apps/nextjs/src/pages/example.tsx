// pages/example.tsx
import { UserButton } from "@erss/auth/client";

export default function Example() {
  return (
    <>
      <header>
        TEST
        <UserButton afterSignOutUrl="/" />
      </header>
      <div>Content can go here.</div>
    </>
  );
}
