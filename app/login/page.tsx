"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, message, Tabs } from "antd";
import { UserOutlined, LockOutlined, IdcardOutlined, CalendarOutlined } from "@ant-design/icons";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const user = await authService.login(values);
      authService.saveAuth(user);
      message.success(`Xin chào, ${user.fullName}!`);
      router.push("/dashboard/tournament");
    } catch (error: any) {
      message.error(error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (values: {
    fullName: string;
    username: string;
    password: string;
    dateOfBirth: string;
  }) => {
    setLoading(true);
    try {
      const user = await authService.signUp(values);
      authService.saveAuth(user);
      message.success("Đăng ký thành công! Chào mừng bạn.");
      router.push("/dashboard/race-result");
    } catch (error: any) {
      message.error(error.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #001529 0%, #003a70 50%, #0050a0 100%)",
      }}
    >
      <Card
        style={{
          width: 420,
          borderRadius: 12,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", margin: 0, color: "#001529" }}>
            🏎️ Race Tournament
          </h1>
          <p style={{ color: "#666", marginTop: 8 }}>Hệ thống quản lý giải đua F1</p>
        </div>

        <Tabs
          defaultActiveKey="login"
          centered
          items={[
            {
              key: "login",
              label: "Đăng nhập",
              children: (
                <Form layout="vertical" onFinish={handleLogin} autoComplete="off">
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Tên đăng nhập"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Mật khẩu"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      size="large"
                    >
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: "signup",
              label: "Đăng ký",
              children: (
                <Form layout="vertical" onFinish={handleSignUp} autoComplete="off">
                  <Form.Item
                    name="fullName"
                    rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                  >
                    <Input
                      prefix={<IdcardOutlined />}
                      placeholder="Họ và tên"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Tên đăng nhập"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu" },
                      { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Mật khẩu"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item
                    name="dateOfBirth"
                    rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
                  >
                    <Input
                      prefix={<CalendarOutlined />}
                      placeholder="Ngày sinh (dd/mm/yyyy)"
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      size="large"
                    >
                      Đăng ký
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
