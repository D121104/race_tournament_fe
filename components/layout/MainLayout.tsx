"use client";

import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TrophyOutlined,
  CalendarOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { useRouter, usePathname } from "next/navigation";

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

  // Xác định key dựa trên pathname hiện tại
  const getSelectedKey = () => {
    if (pathname?.includes('/dashboard/tournament')) return '1';
    if (pathname?.includes('/dashboard/season')) return '2';
    if (pathname?.includes('/dashboard/race')) return '3';
    return '1';
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case '1':
        router.push('/dashboard/tournament');
        break;
      case '2':
        router.push('/dashboard/season');
        break;
      case '3':
        router.push('/dashboard/race');
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
              icon: <TrophyOutlined />,
              label: "Quản lý Giải đua",
            },
            {
              key: "2",
              icon: <CalendarOutlined />,
              label: "Quản lý mùa giải",
            },
            {
              key: "3",
              icon: <FlagOutlined />,
              label: "Quản lý chặng đua",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
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
