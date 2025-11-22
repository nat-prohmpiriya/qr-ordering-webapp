'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  DatePicker,
  Select,
  Space,
  Typography,
  Spin,
  message,
} from 'antd';
import {
  DollarOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  FireOutlined,
} from '@ant-design/icons';
import AdminLayout from '@/components/AdminLayout';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface ReportData {
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  ordersByStatus: Record<string, number>;
  ordersByPaymentStatus: Record<string, number>;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  topItems: Array<{
    name: { th: string; en: string };
    quantity: number;
    revenue: number;
  }>;
}

interface Branch {
  _id: string;
  name: string;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(
    null
  );

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches');
      const data = await response.json();

      if (data.success) {
        setBranches(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (selectedBranch) {
        params.append('branchId', selectedBranch);
      }
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.append('startDate', dateRange[0].toISOString());
        params.append('endDate', dateRange[1].toISOString());
      }

      const response = await fetch(`/api/admin/reports?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setReportData(data.data);
      } else {
        message.error(data.error || 'Failed to fetch reports');
      }
    } catch (error) {
      message.error('Failed to fetch reports');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchReports();
  }, []);

  useEffect(() => {
    fetchReports();
  }, [selectedBranch, dateRange]);

  const topItemsColumns: ColumnsType<any> = [
    {
      title: '#',
      key: 'index',
      width: 50,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Item',
      dataIndex: ['name', 'en'],
      key: 'item',
    },
    {
      title: 'Quantity Sold',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `฿${revenue.toFixed(2)}`,
      sorter: (a, b) => a.revenue - b.revenue,
    },
  ];

  const dailyRevenueColumns: ColumnsType<any> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `฿${revenue.toFixed(2)}`,
    },
  ];

  if (!reportData && loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Reports & Analytics</Title>

        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="All Branches"
            style={{ width: 200 }}
            allowClear
            value={selectedBranch || undefined}
            onChange={(value) => setSelectedBranch(value || '')}
          >
            {branches.map((branch) => (
              <Option key={branch._id} value={branch._id}>
                {branch.name}
              </Option>
            ))}
          </Select>

          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
            format="DD/MM/YYYY"
          />
        </Space>
      </div>

      {reportData && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total Orders"
                  value={reportData.summary.totalOrders}
                  prefix={<ShoppingCartOutlined />}
                  styles={{ value: { color: '#3f8600' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Total Revenue"
                  value={reportData.summary.totalRevenue.toFixed(2)}
                  prefix={<DollarOutlined />}
                  suffix="THB"
                  styles={{ value: { color: '#cf1322' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card>
                <Statistic
                  title="Average Order Value"
                  value={reportData.summary.averageOrderValue.toFixed(2)}
                  prefix={<RiseOutlined />}
                  suffix="THB"
                  styles={{ value: { color: '#1890ff' } }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={12}>
              <Card title="Orders by Status" loading={loading}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(reportData.ordersByStatus).map(([status, count]) => (
                    <div
                      key={status}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: '#f5f5f5',
                        borderRadius: 4,
                      }}
                    >
                      <span style={{ textTransform: 'capitalize' }}>{status}</span>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Payment Status" loading={loading}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(reportData.ordersByPaymentStatus).map(
                    ([status, count]) => (
                      <div
                        key={status}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: '#f5f5f5',
                          borderRadius: 4,
                        }}
                      >
                        <span style={{ textTransform: 'capitalize' }}>{status}</span>
                        <strong>{count}</strong>
                      </div>
                    )
                  )}
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card
                title={
                  <span>
                    <FireOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
                    Top Selling Items
                  </span>
                }
                loading={loading}
              >
                <Table
                  columns={topItemsColumns}
                  dataSource={reportData.topItems}
                  pagination={false}
                  rowKey={(record) => `${record.name.en}-${record.quantity}`}
                  size="small"
                />
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="Daily Revenue" loading={loading}>
                <Table
                  columns={dailyRevenueColumns}
                  dataSource={reportData.dailyRevenue}
                  pagination={{ pageSize: 10 }}
                  rowKey="date"
                  size="small"
                />
              </Card>
            </Col>
          </Row>
        </>
      )}
    </AdminLayout>
  );
}
