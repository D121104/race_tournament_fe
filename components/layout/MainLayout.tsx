"use client";

import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TrophyOutlined,
  CalendarOutlined,
  FlagOutlined,
  BarChartOutlined,
  DollarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/authService";

const { Header, Sider, Content } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const getSelectedKey = () => {
    if (pathname?.includes('/dashboard/race-result')) return '1';
    if (pathname?.includes('/dashboard/sponsor')) return '2';
    return '1';
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case '1':
        router.push('/dashboard/race-result');
        break;
      case '2':
        router.push('/dashboard/sponsor');
        break;
      default:
        router.push('/dashboard');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={({ key }) => handleMenuClick(key)}
          items={[
            {
              key: "1",
              icon: <BarChartOutlined />,
              label: "Kết quả chặng đua",
            },
            {
              key: "2",
              icon: <DollarOutlined />,
              label: "Nhà tài trợ & Hợp đồng",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: "0 16px", background: colorBgContainer, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              authService.logout();
              router.push("/login");
            }}
          >
            Đăng xuất
          </Button>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

