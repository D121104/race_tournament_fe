"use client";

import { Result, Button } from "antd";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
        extra={[
          <Button
            type="primary"
            key="home"
            onClick={() => router.push('/dashboard/race-result')}
          >
            Về trang dashboard
          </Button>,
        ]}
      />
    </div>
  );
}
