"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { ApiError } from "@/lib/api";
import { authService } from "@/services/authService";
import type { LoginRequest } from "@/types/auth";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/dashboard/race-result");
    }
  }, [router]);

  const handleLogin = async (values: LoginRequest) => {
    setLoading(true);
    try {
      const result = await authService.login(values);
      localStorage.setItem("accessToken", result.accessToken);
      message.success("Login successful");
      router.replace("/dashboard/race-result");
    } catch (error) {
      const messageText = error instanceof ApiError ? error.message : "Login failed";
      message.error(messageText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <Card style={{ width: 420 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          Login
        </Title>
        <Text type="secondary">Sign in to continue</Text>

        <Form
          layout="vertical"
          onFinish={handleLogin}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter username" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter password" autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form>

        <div style={{ marginTop: 16 }}>
          <Text>Do not have an account?</Text>{" "}
          <Link href="/register">Register now</Link>
        </div>
      </Card>
    </div>
  );
}
