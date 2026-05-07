"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { ApiError } from "@/lib/api";
import { authService } from "@/services/authService";
import type { RegisterRequest } from "@/types/auth";

const { Title, Text } = Typography;

interface RegisterFormValues extends RegisterRequest {
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/dashboard/race-result");
    }
  }, [router]);

  const handleRegister = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = values;
      const result = await authService.register(payload);
      localStorage.setItem("accessToken", result.accessToken);
      message.success("Register successful");
      router.replace("/dashboard/race-result");
    } catch (error) {
      const messageText = error instanceof ApiError ? error.message : "Register failed";
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
      <Card style={{ width: 480 }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          Register
        </Title>
        <Text type="secondary">Create a new account</Text>

        <Form
          layout="vertical"
          onFinish={handleRegister}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please enter a username" },
              { min: 3, message: "Username must be at least 3 characters" },
            ]}
          >
            <Input placeholder="Enter username" autoComplete="username" />
          </Form.Item>

          <Form.Item label="Full name" name="fullName">
            <Input placeholder="Enter full name" autoComplete="name" />
          </Form.Item>

          <Form.Item label="Date of birth" name="dateOfBirth">
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" autoComplete="new-password" />
          </Form.Item>

          <Form.Item
            label="Confirm password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" autoComplete="new-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Register
          </Button>
        </Form>

        <div style={{ marginTop: 16 }}>
          <Text>Already have an account?</Text>{" "}
          <Link href="/login">Login</Link>
        </div>
      </Card>
    </div>
  );
}
