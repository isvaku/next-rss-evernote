// pages/example.tsx
import { UserButton } from "@erss/auth/client";

export default function Example() {
  return (
    <>
      <header>
        TEST
        <UserButton afterSignOutUrl="/" />
      </header>
      <div>Your page's content can go here.</div>
    </>
  );
}
