"use client";

import { Result, Button } from "antd";
import { useRouter } from "next/navigation";
import { ToolOutlined } from "@ant-design/icons";

export default function SeasonPage() {
  const router = useRouter();

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh' 
    }}>
      <Result
        icon={<ToolOutlined style={{ color: '#1890ff' }} />}
        title="Tính năng đang phát triển"
        subTitle="Chức năng Quản lý mùa giải đang được xây dựng. Vui lòng quay lại sau!"
        extra={[
          <Button 
            type="primary" 
            key="race" 
            onClick={() => router.push('/dashboard/race')}
          >
            Đi đến Quản lý chặng đua
          </Button>,
          <Button 
            key="home" 
            onClick={() => router.push('/dashboard')}
          >
            Về trang chủ
          </Button>,
        ]}
      />
    </div>
  );
}
