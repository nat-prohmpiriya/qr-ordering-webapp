'use client';

import { useSession } from 'next-auth/react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/components/AdminLayout';

const { Title } = Typography;

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <AdminLayout>
      <Title level={2}>Dashboard Overview</Title>
      <p style={{ marginBottom: 24, color: '#666' }}>
        Welcome back, {session?.user?.name}!
      </p>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Orders"
              value={0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Today's Revenue"
              value={0}
              prefix={<DollarOutlined />}
              suffix="THB"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Orders"
              value={0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={0}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={4}>Account Information</Title>
        <p><strong>Name:</strong> {session?.user?.name}</p>
        <p><strong>Email:</strong> {session?.user?.email}</p>
        <p><strong>Role:</strong> {session?.user?.role === 'owner' ? 'Owner' : 'Staff'}</p>
        {session?.user?.branchId && (
          <p><strong>Branch ID:</strong> {session?.user?.branchId}</p>
        )}
      </Card>
    </AdminLayout>
  );
}
