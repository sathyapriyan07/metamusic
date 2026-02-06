"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signUpWithPassword } from "@/services/auth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const { error } = await signUpWithPassword(email, password);
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Check your inbox to confirm your account.");
    }
  }

  return (
    <Card className="w-full max-w-md space-y-6 p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Sign up
        </p>
        <h1 className="text-3xl font-semibold">Create your account</h1>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
      <p className="text-xs text-muted-foreground">
        Already have an account? <Link href="/login" className="text-primary">Sign in</Link>
      </p>
    </Card>
  );
}
